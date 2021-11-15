import flask
import os
from flask_login.utils import login_required
import requests
from dotenv import load_dotenv, find_dotenv
from urllib import parse
from delivery import refine_results_by_delivery
load_dotenv(find_dotenv())


from flask_sqlalchemy import SQLAlchemy

app = flask.Flask(__name__, static_folder="./build/static")

# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/foodPlaces", methods=["POST", "GET"])
def foodPlaces():
    # if flask.request.method == "POST":
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
    databefore = response.json()
    for business in databefore["businesses"]:
        if business["rating"]< 4 :
            databefore["businesses"].remove(business)
    data = refine_results_by_delivery(databefore)
    return flask.jsonify({"flaskData": data})

app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False,
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8081))
    )