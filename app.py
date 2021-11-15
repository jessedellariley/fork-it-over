"""Backend Endpoint Definitions
This module handles the major backend functionality of our app.
It defines endpoints and handles get and post requests.
Functions:
    index -> return rendered index.html page
    food_places -> pass JSON of search results to frontend
"""
import os
import flask
import requests
from dotenv import load_dotenv, find_dotenv
from delivery import refine_results_by_delivery

load_dotenv(find_dotenv())


app = flask.Flask(__name__, static_folder="./build/static")

# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/")
def index():
    """Render index.html"""
    return flask.render_template("index.html")


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


app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8081)),
    )