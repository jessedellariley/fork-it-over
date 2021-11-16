import './App.css';
import React from 'react'
import { useState, useRef } from 'react';

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
    <div class="divClass">
      <h4>Search the best food places available near you!</h4>

      <input ref={foodInput} placeholder="Enter the food/cuisine" type="text" name="food" required class="text"
        spellcheck="value" data-testid="query_input" />
      <input ref={addressInput} placeholder="Enter the location" type="text" name="address" required class="text" spellcheck="value" data-testid="location_input" />
      <select name="radius" ref={radiusInput} data-testid="radius_options">
        <option value="" disabled selected hidden>Enter the radius in miles</option>
        <option value="5" data-testid="5_miles">5</option>
        <option value="10" data-testid="10_miles">10</option>
        <option value="15" data-testid="15_miles">15</option>
      </select>
      <button onClick={onSavedUser}>Search!</button>
      <h5>Please enter valid information.</h5>
      <h1 id="message" data-testid="loading">{message}</h1>

      {result?.flaskData?.businesses &&
        result.flaskData.businesses.sort((a, b) => b.rating - a.rating).map((d) => (
          <div key={d.id} class="places">
            <h2>{d.name}</h2>
            <h4>Rating: {d.rating}</h4>
            <p><a target="_blank" href={d.url}>Website</a></p>
            <p>Address: {d?.location?.display_address}</p>
            <img id="images" src={d.image_url} />
            <div class="grid_container">
              {d?.delivery_services?.UberEats != undefined && <p class="grid_item"><a target="_blank" href={d.delivery_services.UberEats}>Uber Eats</a></p>}
              {d?.delivery_services?.Grubhub != undefined && <p class="grid_item"><a target="_blank" href={d.delivery_services.Grubhub}>Grubhub</a></p>}
              {d?.delivery_services?.Postmates != undefined && <p class="grid_item"><a target="_blank" href={d.delivery_services.Postmates}>Postmates</a></p>}
              {d?.delivery_services?.DoorDash != undefined && <p class="grid_item"><a target="_blank" href={d.delivery_services.DoorDash}>DoorDash</a></p>}
            </div>

          </div>
        ))
      }
      <form id="signup" method="POST" action="/logout">
        <div class="inputs">
          <input id="submit" type="submit" value="LOGOUT" />
        </div>

      </form>


    </div>
  );
}
export default App;