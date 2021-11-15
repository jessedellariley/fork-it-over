"""Flask Backend"""
import os
import flask
from flask_login.utils import login_required , logout_user 
from flask_login import LoginManager
import requests
from dotenv import load_dotenv, find_dotenv
from urllib import parse
from uuid import uuid4
from delivery import refine_results_by_delivery

from flask import request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy

from flask_mail import Mail, Message

load_dotenv(find_dotenv())

app = flask.Flask(__name__, template_folder="./build", static_folder="./build/static")

app.secret_key = os.getenv("FLASK_SECRET_KEY")


# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")

uri = os.getenv("DATABASE_URL")  # or other relevant config var
print(uri)
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://")

app.config["SQLALCHEMY_DATABASE_URI"] = uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USERNAME"] = "yossofrupa@gmail.com"
app.config["MAIL_PASSWORD"] = "mdwnnxjgmndrtwpl"
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_DEBUG"] = True
app.config["MAIL_SUPPRESS_SEND"] = False
app.config["TESTING "] = False

mail = Mail(app)

print("Database", os.getenv("DATABASE_URL"))


class User(db.Model):
    """User Model Class"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    password = db.Column(db.String(50))
    token = db.Column(db.String(50))
    active = db.Column(db.Integer)

    def __init__(self, name, email, phone, password):
        self.username = name
        self.email = email
        self.phone = phone
        self.password = password
        self.active = 0

    def __repr__(self):
        return f"<id {self.id}>"

    def get_username(self):
        return self.username

    def is_authenticated(self):
        return True    

    def serialize(self):
        """serialize"""
        return {"id": self.id, "username": self.username}

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    return User.query.get(user_name)


# @app.route("/*", methods=["GET"])
@app.route("/", defaults={"u_path": ""})
@app.route("/<path:u_path>", methods=["GET"])
# @login_required
def index(u_path):
    """index"""

    print(u_path)

    return flask.render_template(
        "index.html",
    )


@app.route("/login", methods=["POST"])
def login():
    """login"""

    print("login")
    # get parameters from submitted data
    data = request.get_json()

    # get user name
    email = data["email"]
    password = data["password"]

    print("email", email)
    print("password", password)

    user = User.query.filter_by(email=email, password=password).first()
    result = {}
    if user is None:
        result["code"] = 300
        result["message"] = "email or password is incorrect"
    elif user.active != 1:
        result["code"] = 301
        result["message"] = "Account is not still verified"
    else:
        result["code"] = 200
        result["id"] = user.id

    return result


@app.route("/signup", methods=["POST"])
def signup():
    """signup"""

    print("signup")

    # get parameters from submitted data
    data = request.get_json()

    # get user name
    name = data["name"]
    email = data["email"]
    phone = data["phone"]
    password = data["password"]

    result = {}

    user = User.query.filter_by(email=email).first()
    if user is not None:
        result["code"] = 300
        result["message"] = "email is duplicated."

        return result

    user = User(name, email, phone, password)

    # generate token
    token = uuid4()
    user.token = token

    db.session.add(user)
    db.session.commit()

    print("Mail1")

    msg = Message(
        "Hello from the other side!",
        sender="smartsoft1987@gmail.com",
        recipients=[email],
    )

    print("Mail2")

    url = (
        os.getenv("BASE_URL", "0.0.0.0")
        + "/verify?id="
        + str(user.id)
        + "&token="
        + str(token)
    )
    body = f'Hey {name}, Please verify your account. <a href="{url}">Verify</a>'
    print("Verify_URL: " + url)
    print("Verify_Body: " + body)
    msg.html = body
    mail.send(msg)

    print("Email is sent successfully")

    result["code"] = 200

    return result


@app.route("/migrate")
def migrate():
    """migrate"""
    db.create_all()
    db.session.commit()

    return "Migration is completed"


@app.route("/verify")
def verify():
    """verify"""
    id = request.args.get("id")
    token = request.args.get("token")
    if token is None:
        return "Token is empty"

    user = User.query.filter_by(id=id, token=token).first()
    if user is None:
        return "Token is mismatch"

    user.active = 1
    db.session.commit()

    url = os.getenv("BASE_URL", "0.0.0.0") + "/login"

    return f'Account is activate, you can login now<br/>Please login here <a href="{url}">Verify</a>'


# https://account.google.com/


@app.route("/email")
def email():
    print("email1")
    msg = Message(
        "Hello from the other side!",
        sender="yossofrupa@gmail.com",
        recipients=["smartsoft1987@gmail.com"],
    )
    print("email2")
    msg.body = "Hey Paul, sending you this email from my Flask app, lmk if it works"
    mail.send(msg)
    print("email3")
    return "Message sent!"

@app.route("/foodPlaces", methods=["POST", "GET"])
def foodPlaces():
    load_dotenv(find_dotenv())

    if flask.request.method == "POST":
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

        print(food, address, radius)
        PARAMETERS = {
            "term": food,
            "limit": 20,
            "radius": radius,
            "location": address,
            "sort_by": "rating",
        }
        response = requests.get(url=ENDPOINT, params=PARAMETERS, headers=HEADERS)
        databefore = response.json()
        # print(data)
        # print("\n")
        # print("\n")
        # print("break")

        data = refine_results_by_delivery(databefore)
        print(data)


        return flask.jsonify({"flaskData": data})

    return flask.render_template("index.html")

@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return flask.redirect("/")



if __name__ == "__main__":
    print("flask server is running")
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", "8080")), debug=True
    )
 