"""Delivery Services Finder
This module adds delivery services to the search results found in app.py.
Functions:
    refine_results_by_delivery -> return modified search results dictionary
    get_delivery_services -> return delivery services for single restaurant as a dictionary
    verify_uber_eats_link -> return true if a link is the restaurant's Uber Eats page
    verify_doordash_link -> return true if a link is the restaurant's DoorDash page
    verify_grubhub_link -> return true if a link is the restaurant's Grubhub page
    verify_postmates_link -> return true if a link is the restaurant's Postmates page
"""
import os
from urllib import parse
import requests
from dotenv import load_dotenv, find_dotenv


NUM_CUSTOM_SEARCH_KEYS = 20


def refine_results_by_delivery(search_results):
    """Refine search results to include only restaurants offered by delivery services.
    Return refined dictionary with new key 'delivery_services' for each remaining restaurant.
    Key 'delivery_services' has a dictionary value formatted {"delivery_service": "url"}.
    """
    # tracks which API key we will use to find delivery services - initialize to first key
    custom_search_key_num = 1
    for result in search_results["businesses"][:]:
        delivery_services = {}
        if (
            result["name"] is not None
            and result["location"]["address1"] is not None
            and result["location"]["city"] is not None
            and result["location"]["state"] is not None
        ):
            delivery_services, custom_search_key_num = get_delivery_services(
                result["name"],
                result["location"]["address1"],
                result["location"]["city"],
                result["location"]["state"],
                custom_search_key_num,
            )
        if not delivery_services:
            search_results["businesses"].remove(result)
        else:
            result["delivery_services"] = delivery_services
    return search_results


def get_delivery_services(
    restaurant_name,
    restaurant_street_address,
    restaurant_city,
    restaurant_state,
    custom_search_key_num,
):
    """Find all delivery services offering a restaurant.
    Return a dictionary of format {"delivery_service": "url"} containing all services.
    Return the index of the current Google Custom Search API key being used.
    """
    links, new_custom_search_key_num = get_possible_links(
        restaurant_name,
        restaurant_street_address,
        restaurant_city,
        restaurant_state,
        custom_search_key_num,
    )
    # occurs when API key has reached max number of calls/day
    if custom_search_key_num != new_custom_search_key_num:
        custom_search_key_num = new_custom_search_key_num
        # make the call using a new API key
        links, custom_search_key_num = get_possible_links(
            restaurant_name,
            restaurant_street_address,
            restaurant_city,
            restaurant_state,
            custom_search_key_num,
        )
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
    return delivery_services, custom_search_key_num


def get_possible_links(
    restaurant_name,
    restaurant_street_address,
    restaurant_city,
    restaurant_state,
    custom_search_key_num,
):
    """Use Google Custom Search API to get potential delivery service
    website links for a particular restaurant.
    Return a list of the potential links.
    Return the index of the current Google Custom Search API key being used.
    """
    # pylint: disable=invalid-name
    CUSTOM_SEARCH_KEY = get_custom_search_key(custom_search_key_num)
    if CUSTOM_SEARCH_KEY == "":
        return [], custom_search_key_num
    SEARCH_ENGINE_ID = "b5c09c2f0d678adcc"
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
        "cx": SEARCH_ENGINE_ID,
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
    if "error" in json_response:
        custom_search_key_num += 1
    links = []
    if "items" in json_response:
        links = [search_result["link"] for search_result in json_response["items"]]
    return links, custom_search_key_num


def get_custom_search_key(custom_search_key_num):
    """Get the correct Google Custom Search API Key from environment variables.
    If all API keys are at their daily limit, return "".
    """
    if custom_search_key_num > NUM_CUSTOM_SEARCH_KEYS:
        return ""
    load_dotenv(find_dotenv())
    return os.getenv("CUSTOM_SEARCH_KEY" + str(custom_search_key_num))


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
    """Check if a link is the Grubhub store page for a given restaurant and if so return True."""
    url_restaurant_name = restaurant_name.replace(" ", "-").lower()
    url_restaurant_name = list(
        ch for ch in url_restaurant_name if ch.isalnum() or ch == "-"
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