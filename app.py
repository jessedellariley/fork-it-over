"""Backend Endpoint Definitions
This module handles the major backend functionality of our app.
It defines endpoints and handles get and post requests.
Functions:
    index -> return rendered index.html page
    food_places -> pass JSON of search results to frontend
"""
import flask
from flask import Flask, render_template, request, url_for, redirect
import os
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, current_user, LoginManager
from flask_login.utils import login_required
import requests
from dotenv import load_dotenv, find_dotenv
from delivery import refine_results_by_delivery

load_dotenv(find_dotenv())


from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder="./build/static")
# Point SQLAlchemy to your Heroku database
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("APP_SECRET_KEY")

from flask_login import UserMixin

db = SQLAlchemy(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(200))

    def __repr__(self):
        return f"<User {self.username}>"

    def get_username(self):
        return self.username

    def is_authenticated(self):
        return True

    def is_active(self):
        return True


db.create_all()

# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/index")
@login_required
def index():
    """Render index.html"""
    return render_template("index.html")


app.register_blueprint(bp)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    return User.query.get(user_name)


@app.route("/signup")
def signup():
    return render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    username = flask.request.form.get("username")
    password = flask.request.form.get("password")

    user = User.query.filter_by(username=username).first()
    if user:
        flask.flash("Username is already taken!")
        return redirect(url_for("signup"))
    else:
        user = User(
            username=username,
            password=generate_password_hash(password, method="sha256"),
        )
        db.session.add(user)
        db.session.commit()

    return redirect(url_for("login"))


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/login", methods=["GET", "POST"])
def loginform():
    if current_user.is_authenticated:
        return redirect("/index")
    username = flask.request.form.get("username")
    password = flask.request.form.get("password")

    # redirects to signup page if username already exits
    inputUserName = User.query.filter_by(username=username).first()
    if not inputUserName or not check_password_hash(inputUserName.password, password):
        flask.flash("Username or password is wrong!")
        return render_template("login.html")
    login_user(inputUserName)
    return redirect("/index")


@app.route("/")
def main():
    if current_user.is_authenticated:
        return redirect(url_for("bp.index"))
    return redirect(url_for("login"))


@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
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
    return flask.jsonify({"flaskData": data})


if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8081)),
    )
