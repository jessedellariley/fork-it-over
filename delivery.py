import os
import requests
from dotenv import load_dotenv, find_dotenv
from urllib import parse


def get_delivery_services(restaurant_name, restaurant_city, restaurant_state):
    """Find all delivery services offering a restaurant and return a dictionary of format {"delivery_service": "url"} containing all services."""
    delivery_services = check_delivery_service(
        restaurant_name, restaurant_city, restaurant_state, "Uber Eats"
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name, restaurant_city, restaurant_state, "DoorDash"
        )
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name, restaurant_city, restaurant_state, "Postmates"
        )
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name, restaurant_city, restaurant_state, "Grubhub"
        )
    )
    return delivery_services


def check_delivery_service(
    restaurant_name, restaurant_city, restaurant_state, delivery_service
):
    """Check a delivery service to see if it offers a restaurant and return a dicitionary with format {"delivery_service": "url"} if it does."""
    load_dotenv(find_dotenv())

    CUSTOM_SEARCH_KEY = os.getenv("CUSTOM_SEARCH_KEY")
    search_engine_id = "b5c09c2f0d678adcc"
    query = restaurant_name + " " + restaurant_city + ", " + restaurant_state
    fields = "items(link)"  # search only for the url links of each search result
    delivery_service = delivery_service

    params = {
        "key": CUSTOM_SEARCH_KEY,
        "cx": search_engine_id,
        "exactTerms": delivery_service,
        "q": query,
        "fields": fields,
    }

    params_url_encoded = parse.urlencode(params)

    response = requests.get(
        f"https://www.googleapis.com/customsearch/v1?{params_url_encoded}"
    )

    json_response = response.json()
    links = [search_result["link"] for search_result in json_response["items"]]

    # need to create a check for if the delivery service offerse the restaurant
    # this is a dummy return value
    return {delivery_service: links[0]}
