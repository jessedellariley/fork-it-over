import os
import requests
from dotenv import load_dotenv, find_dotenv
from urllib import parse


def refine_results_by_delivery(search_results):
    """Refine search results to include only restaurants offered by one or more of delivery services.
    Return refined dictionary with new key 'delivery_services' for each remaining restaurant.
    Key 'delivery_services' has a dictionary value formatted {"delivery_service": "url"}.
    """
    for result in search_results["businesses"][:]:
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

    params = {
        "key": CUSTOM_SEARCH_KEY,
        "cx": search_engine_id,
        "filter": "0",
        "orTerms": "postmates|ubereats|grubhub|doordash",
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
    delivery_services = {}
    for link in links:
        if verify_uber_eats_link(link, restaurant_name):
            if "UberEats" not in delivery_services:
                delivery_services.update({"UberEats": link})
        elif verify_doordash_link(link, restaurant_name):
            if "DoorDash" not in delivery_services:
                delivery_services.update({"DoorDash": link})
        elif verify_grubhub_link(link, restaurant_name):
            if "Grubhub" not in delivery_services:
                delivery_services.update({"Grubhub": link})
        elif verify_postmates_link(link, restaurant_name):
            if "Postmates" not in delivery_services:
                delivery_services.update({"Postmates": link})
    return delivery_services


def verify_uber_eats_link(link, restaurant_name):
    """Check if a link is the Uber Eats store page for a given restaurant and if so return True."""
    to_replace = {" ": "-", "&": "%26", "'": "", "#": "%23"}
    url_restaurant_name = restaurant_name.lower()
    for key, value in to_replace.items():
        url_restaurant_name = url_restaurant_name.replace(key, value)
    if link.startswith(f"https://www.ubereats.com/store/{url_restaurant_name}"):
        return True
    return False


def verify_doordash_link(link, restaurant_name):
    """Check if a link is the DoorDash store page for a given restaurant and if so return True."""
    url_restaurant_name = restaurant_name.replace(" ", "-").lower()
    url_restaurant_name_apostrophe_case1 = url_restaurant_name
    url_restaurant_name_apostrophe_case2 = url_restaurant_name.replace("'", "-")
    url_restaurant_name_apostrophe_case3 = url_restaurant_name.replace("'", "%27")
    if (
        link.startswith(
            f"https://www.doordash.com/store/{url_restaurant_name_apostrophe_case1}"
        )
        or link.startswith(
            f"https://www.doordash.com/store/{url_restaurant_name_apostrophe_case2}"
        )
        or link.startswith(
            f"https://www.doordash.com/store/{url_restaurant_name_apostrophe_case3}"
        )
    ):
        return True
    return False


def verify_grubhub_link(link, restaurant_name):
    """Check if a link is the Grubhub restaurant page for a given restaurant and if so return True."""
    url_restaurant_name = restaurant_name.replace(" ", "-").lower()
    url_restaurant_name = list(
        [ch for ch in url_restaurant_name if ch.isalnum() or ch == "-"]
    )
    url_restaurant_name = "".join(url_restaurant_name)
    if link.startswith(f"https://www.grubhub.com/restaurant/{url_restaurant_name}"):
        return True
    return False


def verify_postmates_link(link, restaurant_name):
    """Check if a link is the Postmates store page for a given restaurant and if so return True."""
    to_replace = {" ": "-", "&": "%26", "'": "", "#": "%23"}
    url_restaurant_name = restaurant_name.lower()
    for key, value in to_replace.items():
        url_restaurant_name = url_restaurant_name.replace(key, value)
    if link.startswith(f"https://postmates.com/store/{url_restaurant_name}"):
        return True
    return False