import './App.css';
import React from 'react'
import { useState, useRef } from 'react';
import logo from './Logo_LightBG.png';
import account from './account.png';

function App() {
  const [inputs, setInputs] = useState([]);
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState([]);

  const foodInput = useRef(null);
  const addressInput = useRef(null);
  const radiusInput = useRef(null);

  function onSavedUser() {
    let food = foodInput.current.value;
    let address = addressInput.current.value;
    let radius = radiusInput.current.value;

    if (food.length === 0 || address.length === 0 || radius.length === 0) {
      alert("One or more fields are empty");
      return false;
    }

    let text = "Loading...Please wait patiently!"
    let addMessage = [...message, text]
    setMessage(addMessage)

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
      setResult(data)
    });
  }
  return (

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
                            <button class="searchbar-button" onClick={onSavedUser}>*</button>
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
                      <p class="navbar-link-title">
                        About
                      </p>
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
                      <button class="account" aria-label="Toggle Menu" aria-haspopup="menu" aria-controls="header-dropdown-menu"
                        aria-expanded="false" type="submit">
                        <span class="account-image-outer-wrapper">
                          <span class="account-image-inner-wrapper">
                            <img class="account-image" src={account} alt="Account" width="36" height="36" />
                          </span>
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
      <div class="results">
        <h1 id="message" data-testid="loading">{message}</h1>
        {result?.flaskData?.businesses &&
          result.flaskData.businesses.sort((a, b) => b.rating - a.rating).map((d) => (
            <div key={d.id} class="places">
              <h2>{d.name}</h2>
              <h4>Rating: {d.rating}</h4>
              <p><a target="_blank" rel="noopener noreferrer" href={d.url}>Website</a></p>
              <p>Address: {d?.location?.display_address}</p>
              <img id="images" alt="Restaurant image from Yelp" src={d.image_url} />
              <div class="grid_container">
                {d?.delivery_services?.UberEats !== undefined && <p class="grid_item"><a target="_blank" rel="noopener noreferrer" href={d.delivery_services.UberEats}>Uber Eats</a></p>}
                {d?.delivery_services?.Grubhub !== undefined && <p class="grid_item"><a target="_blank" rel="noopener noreferrer" href={d.delivery_services.Grubhub}>Grubhub</a></p>}
                {d?.delivery_services?.Postmates !== undefined && <p class="grid_item"><a target="_blank" rel="noopener noreferrer" href={d.delivery_services.Postmates}>Postmates</a></p>}
                {d?.delivery_services?.DoorDash !== undefined && <p class="grid_item"><a target="_blank" rel="noopener noreferrer" href={d.delivery_services.DoorDash}>DoorDash</a></p>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
export default App;