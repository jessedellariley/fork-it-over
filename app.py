"""Backend Endpoint Definitions
This module handles the major backend functionality of our app.
It defines endpoints and handles get and post requests.
Functions:
    index -> return rendered index.html page
    food_places -> pass JSON of search results to frontend
"""
import os
import flask
import json
from flask import Flask, render_template, url_for, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import (
    login_user,
    logout_user,
    current_user,
    LoginManager,
    UserMixin,
    login_required,
)
import requests
from dotenv import load_dotenv, find_dotenv
from flask_sqlalchemy import SQLAlchemy
from delivery import refine_results_by_delivery

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder="./build/static")
# Point SQLAlchemy to your Heroku database
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = bytes(os.getenv("APP_SECRET_KEY"), "utf-8")

db = SQLAlchemy(app)


class User(UserMixin, db.Model):
    """Define User database to store username, password."""

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        """Return string representation of this user."""
        return f"<User {self.username}>"

    def get_username(self):
        """Return the username of this user."""
        return self.username


class Address(db.Model):
    """
    Model for saved addresses
    """

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(
        db.String(150),
    )
    username = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        """
        Determines what happens when we print an instance of the class
        """
        return f"<Address {self.address}>"


db.create_all()

# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/index")
@login_required
def index():
    """Fetches user and address data and embeds it in
    the returned HTML."""
    addresses = Address.query.filter_by(username=current_user.username).all()
    addresses = [a.address for a in addresses]

    data = json.dumps({"email": current_user.username, "addresses": addresses})
    return flask.render_template(
        "index.html",
        data=data,
    )


app.register_blueprint(bp)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    """Load the current user."""
    return User.query.get(user_name)


@app.route("/signup")
def signup():
    """Render the sign up page."""
    return render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    """Get user input on sign up form.
    Check if the username entered is already taken, and flash a message if so.
    Otherwise, create a new user entry in db and redirect to login page.
    """
    username = flask.request.form.get("username")
    password = flask.request.form.get("password")

    user = User.query.filter_by(username=username).first()
    if user:
        flask.flash("That username must be popular - try another")
        return redirect(url_for("signup"))
    user = User(
        username=username,
        password=generate_password_hash(password, method="sha256"),
    )
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return redirect("/index")


@app.route("/login")
def login():
    """Render the login page."""
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def loginform():
    """Get user input on login form.
    Check if the username entered is in the db, and if not flash a message.
    If the username is in the db, log the user in.
    """
    if current_user.is_authenticated:
        return redirect("/index")
    username = flask.request.form.get("username")
    password = flask.request.form.get("password")

    # redirects to signup page if username doesn't exits
    input_user_name = User.query.filter_by(username=username).first()
    if not input_user_name or not check_password_hash(
        input_user_name.password, password
    ):
        flask.flash("Username or password is wrong")
        return render_template("login.html")
    login_user(input_user_name)
    return redirect("/index")


@app.route("/")
def main():
    """Check if the user is authenticated before redirecting them to search page."""
    if current_user.is_authenticated:
        return redirect(url_for("bp.index"))
    return redirect(url_for("signup"))


@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    """Log the user out and redirect to login page."""
    logout_user()
    return redirect("/")


@app.route("/foodPlaces", methods=["POST"])
def food_places():
    """Get JSON of search results from Yelp API based on user input.
    Modify search results to only include restaurants that offer delivery.
    Pass JSON of search results to frontend.
    """
    # pylint: disable=invalid-name
    API_KEY = os.getenv("YELP_API_KEY")
    ENDPOINT = "https://api.yelp.com/v3/businesses/search"
    HEADERS = {"Authorization": f"Bearer {API_KEY}"}
    food = flask.request.json.get("food")
    address = flask.request.json.get("address")
    radius = flask.request.json.get("radius")

    ## Converts the miles to meters since yelp api only takes meters as paramter
    if radius is None:
        radius = 0
    radius = int(radius) * 1609
    PARAMETERS = {
        "term": food,
        "limit": 20,
        "radius": radius,
        "location": address,
        "sort_by": "rating",
    }
    response = requests.get(url=ENDPOINT, params=PARAMETERS, headers=HEADERS)
    data = response.json()
    for business in data["businesses"][:]:
        if business["rating"] < 4:
            data["businesses"].remove(business)
    data = refine_results_by_delivery(data)
    if data == "":
        return flask.jsonify({"status": 401, "reason": "Invalid Search Inputs Error"})

    return flask.jsonify({"flaskData": data})


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/save", methods=["POST"])
def save():
    """
    Receives JSON data from App.js and updates the DB.
    """
    addresses = flask.request.json.get("addresses")
    email = flask.request.json.get("username")
    addresses = set(addresses)
    username = current_user.username
    if email != "" and username != email:
        update_username(username, email)
        username = email
    update_db_addresses_for_user(username, addresses)
    addresses = list(addresses)
    data = json.dumps({"email": current_user.username, "addresses": addresses})
    return flask.render_template(
        "index.html",
        data=data,
    )


def update_db_addresses_for_user(username, addresses):
    """
    Updates the DB with new addresses.
    """
    existing_addresses = {
        v.address for v in Address.query.filter_by(username=username).all()
    }
    new_addresses = addresses - existing_addresses
    for new_address in new_addresses:
        db.session.add(Address(address=new_address, username=username))
    if len(existing_addresses - addresses) > 0:
        for address in Address.query.filter_by(username=username).filter(
            Address.address.notin_(addresses)
        ):
            db.session.delete(address)
    db.session.commit()
    addresses = list(addresses)
    response = {"username": username, "addresses": addresses}
    return flask.jsonify(response)


def update_username(username, email):
    """
    Updates the DB with a new username.
    """
    user = User.query.filter_by(username=username).first()
    user.username = email
    addresses = {v.address for v in Address.query.filter_by(username=username).all()}
    for address in addresses:
        db.session.add(Address(address=address, username=email))
    for address in Address.query.filter_by(username=username).all():
        db.session.delete(address)
    db.session.commit()


if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8081)),
    )
