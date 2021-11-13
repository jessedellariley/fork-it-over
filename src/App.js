import './App.css';
import React from 'react'
import { useState, useRef } from 'react';

function App() {
  const [res, setRes] = useState([]);
  const [result, setResult] = useState([]);

  const foodInput = useRef(null);
  const addressInput = useRef(null);
  const radiusInput = useRef(null);


  function onSavedUser() {
    let food = foodInput.current.value;
    let address = addressInput.current.value;
    let radius = radiusInput.current.value;

    let add = [...res, food, address, radius]
    setRes(add);

    // Sends the inputs to the foodPlaces flask endpoint to produce the yelpApi data
    fetch('/foodPlaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'food': food, 'address': address, 'radius': radius }),
    }).then(response => response.json()).then(data => {
      setRes([]);
      foodInput.current.value = "";
      addressInput.current.value = "";
      radiusInput.current.value = "";
      console.log(data)

      setResult(data)
    });
  }
  return (
    <div class="divClass">
      <input ref={foodInput} placeholder="Enter the food/cuisine" type="text" name="food" required class="text"
        spellcheck="value" />
      <input ref={addressInput} placeholder="Enter the location" type="text" name="address" required class="text" spellcheck="value" />
      {/* <input ref={radiusInput} placeholder="Enter the radius in miles" type="text" name="radius" required class="text" spellcheck="value" /> */}
     
      <select name="radius" ref={radiusInput}>
        <option value="" disabled selected hidden>Enter the radius in miles</option>
        <option value="5">Five</option>
        <option value="10">Ten</option>
        <option value="15">Fifteen</option>
      </select>
      <button onClick={onSavedUser}>Search!</button>
      <p>Please enter valid information.</p>

      {result?.flaskData?.businesses &&
        result.flaskData.businesses.map((d) => (
          d.rating > 4 &&
          <div key={d.id} class="places">
            <p>{d.name}</p>
            <p>Rating: {d.rating}</p>
            <p><a href={d.url}>Website</a></p>
            <p>Address: {d?.location?.display_address}</p>
            <img id="images" src={d.image_url} />
     
            <p><a href={d?.delivery_services?.UberEats}>UberEats</a></p>
            <p><a href={d?.delivery_services?.Grubhub}>GrubHub</a></p>
            <p><a href={d?.delivery_services?.Postmates}>PostMates</a></p>
            <p><a href={d?.delivery_services?.DoorDash}>Doordash</a></p>

          </div>
        ))
      }

    </div>
  );
}
export default App;
