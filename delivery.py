import os
import requests
from dotenv import load_dotenv, find_dotenv
from urllib import parse


def refine_results_by_delivery(search_results):
    """Refine search results to include only restaurants offered by one or more of delivery services.
    Return refined dictionary with new key 'delivery_services' for each remaining restaurant.
    Key 'delivery_services' has a dictionary value formatted {"delivery_service": "url"}.
    """
    for result in search_results["businesses"]:
        delivery_services = get_delivery_services(
            result["name"],
            result["location"]["address1"],
            result["location"]["city"],
            result["location"]["state"],
        )
        if not delivery_services:
            search_results["businesses"].remove(result)
        else:
            result["delivery_services"] = delivery_services
    return search_results


def get_delivery_services(
    restaurant_name, restaurant_street_address, restaurant_city, restaurant_state
):
    """Find all delivery services offering a restaurant and return a dictionary of format {"delivery_service": "url"} containing all services."""
    delivery_services = {}
    delivery_services.update(
        check_delivery_service(
            restaurant_name,
            restaurant_street_address,
            restaurant_city,
            restaurant_state,
            "Uber Eats",
        )
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name,
            restaurant_street_address,
            restaurant_city,
            restaurant_state,
            "DoorDash",
        )
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name,
            restaurant_street_address,
            restaurant_city,
            restaurant_state,
            "Postmates",
        )
    )
    delivery_services.update(
        check_delivery_service(
            restaurant_name,
            restaurant_street_address,
            restaurant_city,
            restaurant_state,
            "Grubhub",
        )
    )
    return delivery_services


def check_delivery_service(
    restaurant_name,
    restaurant_street_address,
    restaurant_city,
    restaurant_state,
    delivery_service,
):
    """Check a delivery service to see if it offers a restaurant and return a dicitionary with format {"delivery_service": "url"} if it does."""
    load_dotenv(find_dotenv())

    CUSTOM_SEARCH_KEY = os.getenv("CUSTOM_SEARCH_KEY")
    search_engine_id = "b5c09c2f0d678adcc"
    query = (
        restaurant_name
        + " "
        + restaurant_street_address
        + " "
        + restaurant_city
        + ", "
        + restaurant_state
    )
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
    links = []
    if "items" in json_response:
        links = [search_result["link"] for search_result in json_response["items"]]

    delivery_service_link = {}
    for link in links:
        if (
            (
                delivery_service == "Uber Eats"
                and verify_uber_eats_link(link, restaurant_name)
            )
            or (
                delivery_service == "DoorDash"
                and verify_doordash_link(link, restaurant_name)
            )
            or (
                delivery_service == "Grubhub"
                and verify_grubhub_link(link, restaurant_name)
            )
            or (
                delivery_service == "Postmates"
                and verify_postmates_link(link, restaurant_name)
            )
        ):
            delivery_service_link = {delivery_service: link}
            break

    return delivery_service_link


def verify_uber_eats_link(link, restaurant_name):
    """Check if a link is the Uber Eats store page for a given restaurant and return True if so."""
    to_replace = {" ": "-", "&": "%26", "'": "", "#": "%23"}
    url_restaurant_name = restaurant_name.lower()
    for key, value in to_replace.items():
        url_restaurant_name = url_restaurant_name.replace(key, value)
    if link.startswith(f"https://www.ubereats.com/store/{url_restaurant_name}"):
        return True
    return False


def verify_doordash_link(link, restaurant_name):
    """Check if a link is the DoorDash store page for a given restaurant and return True if so."""
    url_restaurant_name = restaurant_name.replace(" ", "-").lower()
    if link.startswith(f"https://www.doordash.com/store/{url_restaurant_name}"):
        return True
    return False


def verify_grubhub_link(link, restaurant_name):
    """Check if a link is the Grubhub restaurant page for a given restaurant and return True if so."""
    url_restaurant_name = restaurant_name.replace(" ", "-").lower()
    url_restaurant_name = list(
        [ch for ch in url_restaurant_name if ch.isalnum() or ch == "-"]
    )
    url_restaurant_name = "".join(url_restaurant_name)
    if link.startswith(f"https://www.grubhub.com/restaurant/{url_restaurant_name}"):
        return True
    return False


def verify_postmates_link(link, restaurant_name):
    """Check if a link is the Postmates store page for a given restaurant and return True if so."""
    to_replace = {" ": "-", "&": "%26", "'": "", "#": "%23"}
    url_restaurant_name = restaurant_name.lower()
    for key, value in to_replace.items():
        url_restaurant_name = url_restaurant_name.replace(key, value)
    if link.startswith(f"https://postmates.com/store/{url_restaurant_name}"):
        return True
    return False
