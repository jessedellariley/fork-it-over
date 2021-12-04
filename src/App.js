import './App.css';
import React from 'react'
import { useState, useRef } from 'react';
import logo from './Logo_LightBG.png';
import account from './account.png';
import unfilledfavorite from './unfilledfavorite.png';
import spinner from './loading.gif'
import accountdropdown from './account-dropdown.png';
import logout from './logout.png';
import searchbutton from './searchbutton.png';
import ubereats_img from './ubereats.png';
import grubhub_img from './grubhub.png';
import doordash_img from './doordash.png';
import postmates_img from './postmates.png';
import filledfavorite from './filledfavorite.png';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [inputs, setInputs] = useState([]);
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState([]);
  const [loading, setSpinner] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);


  const foodInput = useRef(null);
  const addressInput = useRef(null);
  const radiusInput = useRef(null);

  function onSavedUser() {
    setMessage([])
    setErrorMessage([])
    let food = foodInput.current.value;
    let address = addressInput.current.value;
    let radius = radiusInput.current.value;

    if (food.length === 0 || address.length === 0 || radius.length === 0) {
      alert("One or more fields are empty");
      return false;
    }

    let errorText = "Oops...Please enter valid information in the fields!"
    let addErrorMessage = [...errorMessage, errorText]

    let text = "Loading...Please wait patiently!"
    let addMessage = [...message, text]
    setMessage(addMessage)

    let load = spinner
    let addSpinner = [...loading, load]
    setSpinner(addSpinner)

    let addInputs = [...inputs, food, address, radius]
    setInputs(addInputs);

    // Sends the inputs to the foodPlaces flask endpoint to produce the yelpApi data
    fetch('/foodPlaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'food': food, 'address': address, 'radius': radius }),
    }).then(response => response.json()).then(data => {
      setInputs([]);
      foodInput.current.value = "";
      addressInput.current.value = "";
      radiusInput.current.value = "";
      console.log(data)
      setMessage([])
      setSpinner([])
      setErrorMessage([])
      setResult(data)
    }).catch((er) => {
      console.log(er);
      foodInput.current.value = "";
      addressInput.current.value = "";
      radiusInput.current.value = "";
      setMessage([])
      setSpinner([])
      setErrorMessage(addErrorMessage)
    });

  }
  return (
    <Router>
      <div>
        {result?.flaskData?.businesses ? (
          <div>
            <div class="header">
              <div class="header-container">
                <div class="header-content">
                  <div class="logo-container"><img src={logo} class="logo" alt="logo" /></div>
                  <div class="searchbar-outer-container">
                    <div class="searchbar-mid-container">
                      <div class="searchbar-inner-container">
                        <div class="searchbar">
                          <div class="searchbar-table">
                            <div class="searchbar-input">
                              <div class="searchbar-input-flex">
                                <div class="food-type-query-container">
                                  <div class="food-type-query">
                                    <input ref={foodInput} placeholder="ramen, cheap dinner, Thai" type="text" name="food-type-query" required class="textbox"
                                      spellcheck="value" data-testid="query_input" autocomplete="off" aria-autocomplete="list" tabindex="0" id="food-type-query" />
                                  </div>
                                </div>
                                <div class="location-container">
                                  <div class="location">
                                    <input ref={addressInput} placeholder="address, neighborhood, city, state or zip" type="text" name="address"
                                      required class="textbox" spellcheck="value" data-testid="location_input" autocomplete="off"
                                      aria-autocomplete="list" tabindex="0" />
                                  </div>
                                </div>
                                <div class="radius-container">
                                  <div class="radius">
                                    <input ref={radiusInput} placeholder="radius in miles" class="radius-select" type="number" name="radius" min="1" max="20" required />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="searchbar-button-outer-container">
                              <div class="searchbar-button-mid-container">
                                <div class="searchbar-button-inner-container">
                                  <button class="searchbar-button" onClick={onSavedUser}>
                                    <span class="searchbar-button-image-wrapper">
                                      {message.length == 0 ?
                                        (<img alt='search-button' data-search-testid="searchbar-button-test-id" class="searchbar-button-image" src={searchbutton} />) :
                                        (<img class="searchbar-button-image" src={spinner} />)}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="navbar">
                    <span class="navbar-link-container">
                      <a href="#" class="navbar-link">
                        <div class="navbar-link-title-padding">
                          <div class="navbar-link-title-container">
                            <p class="navbar-link-title">ABOUT</p>
                          </div>
                        </div>
                      </a>
                    </span>
                  </div>
                  <div class="account-outer-container">
                    <div class="account-table">
                      <div class="account-table-cell">
                        <div class="account-mid-container">
                          <div class="account-inner-container">
                            <div>
                              <button class="account" aria-label="Toggle Menu" aria-haspopup="menu" aria-controls="header-dropdown-menu"
                                aria-expanded="true" type="submit">
                                <span class="account-image-outer-wrapper">
                                  <span class="account-image-inner-wrapper">
                                    <img class="account-image" src={account} alt="Account" width="36" height="36" />
                                  </span>
                                </span>
                              </button>
                              <menu class="menu">
                                <div class="menu-account-section">
                                  <a class="menu-item" href="#" tabindex="0">
                                    <div class="menu-item-components-padding">
                                      <div class="menu-item-components-container">
                                        <div class="menu-item-symbol-container">
                                          <div class="menu-item-symbol-padding">
                                            <span class="menu-item-symbol-wrapper">
                                              <img class="menu-item-symbol" src={accountdropdown} />
                                            </span>
                                          </div>
                                        </div>
                                        <div class="menu-item-name-container">
                                          <span class="menu-item-name">Account</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                  <a class="menu-item" href="#" tabindex="0">
                                    <div class="menu-item-components-padding">
                                      <div class="menu-item-components-container">
                                        <div class="menu-item-symbol-container">
                                          <div class="menu-item-symbol-padding">
                                            <span class="menu-item-symbol-wrapper">
                                              <img class="menu-item-symbol" src={unfilledfavorite} />
                                            </span>
                                          </div>
                                        </div>
                                        <div class="menu-item-name-container">
                                          <span class="menu-item-name">Favorites</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div class="menu-logout-section">
                                  <form id="logout" class="logout" action="/logout" name="logout" method="post">
                                    <div class="logout-button-wrapper">
                                      <button class="menu-item" type="submit" role="menuitem" tabindex="0">
                                        <div class="menu-item-components-padding">
                                          <div class="menu-item-components-container">
                                            <div class="menu-item-symbol-container">
                                              <div class="menu-item-symbol-padding">
                                                <span class="menu-item-symbol-wrapper">
                                                  <img alt='log-out' class="menu-item-symbol" src={logout} />
                                                </span>
                                              </div>
                                            </div>
                                            <div class="menu-item-name-container">
                                              <span class="menu-item-name">Log Out</span>
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </menu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div >
            <div class="results">
              <h1 id="message" data-testid="loading">{errorMessage}</h1>
              <div class="results-container">
                {result.flaskData.businesses.sort((a, b) => b.rating - a.rating).map((d) => (
                  <div class="places-container">
                    <div key={d.id} class="places">
                      <div class="places-content-wrapper">
                        <div class="restaurant-info-container">
                          <div class="name-and-favorite">
                            <h2 class="restaurant-name">{d.name}</h2>
                            <div class="favorite-icon">
                              <img class="unfilled-favorite" src={unfilledfavorite} />
                            </div>
                          </div>
                          <h4 class="rating">Rating: {d.rating} ({d.review_count})</h4>
                          <p class="website"><a target="_blank" rel="noopener noreferrer" href={d.url}>Website</a></p>
                          <div class="restaurant-address"><p>{d?.location?.display_address}</p></div>
                        </div>
                        <div class="restaurant-photo">
                          <img id="images" alt="Restaurant image from Yelp" src={d.image_url} />
                        </div>
                        <div class="delivery-services-container">
                          <div class="delivery-services">
                            {d?.delivery_services?.UberEats !== undefined &&
                              <p class="delivery-service">
                                <a target="_blank" rel="noopener noreferrer" href={d.delivery_services.UberEats}>
                                  <img class="delivery-logo" src={ubereats_img} />
                                </a>
                              </p>
                            }
                            {d?.delivery_services?.Grubhub !== undefined &&
                              <p class="delivery-service">
                                <a target="_blank" rel="noopener noreferrer" href={d.delivery_services.Grubhub}>
                                  <img class="delivery-logo" src={grubhub_img} />
                                </a>
                              </p>
                            }
                            {d?.delivery_services?.Postmates !== undefined &&
                              <p class="delivery-service">
                                <a target="_blank" rel="noopener noreferrer" href={d.delivery_services.Postmates}>
                                  <img class="delivery-logo" src={postmates_img} />
                                </a>
                              </p>
                            }
                            {d?.delivery_services?.DoorDash !== undefined &&
                              <p class="delivery-service">
                                <a target="_blank" rel="noopener noreferrer" href={d.delivery_services.DoorDash}>
                                  <img class="delivery-logo" src={doordash_img} />
                                </a>
                              </p>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
            </div>
          </div >) : (
          <div class="search-page-before-results">
            <div class="header-no-results">
              <div class="navbar-no-results">
                <span class="navbar-link-container">
                  <a href="#" class="navbar-link">
                    <div class="navbar-link-title-padding">
                      <div class="navbar-link-title-container">
                        <p class="navbar-link-title">ABOUT</p>
                      </div>
                    </div>
                  </a>
                </span>
              </div>
              <div class="navbar-no-results">
                <span class="navbar-link-container">
                  <a href="/index/favorites" class="navbar-link">
                    <div class="navbar-link-title-padding">
                      <div class="navbar-link-title-container">
                        <p class="navbar-link-title">FAVORITES</p>
                      </div>
                    </div>
                  </a>
                </span>
              </div>
              <div class="account-no-results">
                <div class="account-table">
                  <div class="account-table-cell">
                    <div class="account-mid-container">
                      <div class="account-inner-container">
                        <div>
                          <button class="account" aria-label="Toggle Menu" aria-haspopup="menu" aria-controls="header-dropdown-menu"
                            aria-expanded="true" type="submit">
                            <span class="account-image-outer-wrapper">
                              <span class="account-image-inner-wrapper">
                                <img class="account-image" src={account} alt="Account" width="36" height="36" />
                              </span>
                            </span>
                          </button>
                          <menu class="menu">
                            <div class="menu-account-section">
                              <a class="menu-item" href="#" tabindex="0">
                                <div class="menu-item-components-padding">
                                  <div class="menu-item-components-container">
                                    <div class="menu-item-symbol-container">
                                      <div class="menu-item-symbol-padding">
                                        <span class="menu-item-symbol-wrapper">
                                          <img class="menu-item-symbol" src={accountdropdown} />
                                        </span>
                                      </div>
                                    </div>
                                    <div class="menu-item-name-container">
                                      <span class="menu-item-name">Account</span>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div class="menu-logout-section">
                              <form id="logout" class="logout" action="/logout" name="logout" method="post">
                                <div class="logout-button-wrapper">
                                  <button class="menu-item" type="submit" role="menuitem" tabindex="0">
                                    <div class="menu-item-components-padding">
                                      <div class="menu-item-components-container">
                                        <div class="menu-item-symbol-container">
                                          <div class="menu-item-symbol-padding">
                                            <span class="menu-item-symbol-wrapper">
                                              <img alt='log-out' class="menu-item-symbol" src={logout} />
                                            </span>
                                          </div>
                                        </div>
                                        <div class="menu-item-name-container">
                                          <span class="menu-item-name">Log Out</span>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </form>
                            </div>
                          </menu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="big-center-logo-container">
              <img alt="logo" class="big-center-logo" src={logo} />
            </div>
            <div class="searchbar-outer-container-no-results">
              <div class="searchbar-mid-container">
                <div class="searchbar-inner-container">
                  <div class="searchbar">
                    <div class="searchbar-table">
                      <div class="searchbar-input">
                        <div class="searchbar-input-flex">
                          <div class="food-type-query-container">
                            <div class="food-type-query">
                              <input ref={foodInput} placeholder="ramen, cheap dinner, Thai" type="text" name="food-type-query" required class="textbox"
                                spellcheck="value" data-testid="query_input" autocomplete="off" aria-autocomplete="list" tabindex="0" id="food-type-query" />
                            </div>
                          </div>
                          <div class="location-container">
                            <div class="location">
                              <input ref={addressInput} placeholder="address, neighborhood, city, state or zip" type="text" name="address"
                                required class="textbox" spellcheck="value" data-testid="location_input" autocomplete="off"
                                aria-autocomplete="list" tabindex="0" />
                            </div>
                          </div>
                          <div class="radius-container">
                            <div class="radius">
                              <input ref={radiusInput} placeholder="radius in miles" class="radius-select" type="number" name="radius" min="1" max="20" required />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="searchbar-button-outer-container">
                        <div class="searchbar-button-mid-container">
                          <div class="searchbar-button-inner-container">
                            <button class="searchbar-button" onClick={onSavedUser}>
                              <span class="searchbar-button-image-wrapper">
                                {message.length == 0 ?
                                  (<img alt='search-button' data-search-testid="searchbar-button-test-id" class="searchbar-button-image" src={searchbutton} />) :
                                  (<img class="searchbar-button-image" src={spinner} />)}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h1 id="message" data-testid="loading">{errorMessage}</h1>
          </div>
        )
        }

      </div>
    </Router>
  );
}
export default App;