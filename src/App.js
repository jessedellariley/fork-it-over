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
      <input ref={foodInput} placeholder="Enter the food/cuisine" type="text" name="food" required class="text"
        spellcheck="value" />
      <input ref={addressInput} placeholder="Enter the location" type="text" name="address" required class="text" spellcheck="value" />
      <select name="radius" ref={radiusInput}>
        <option value="" disabled selected hidden>Enter the radius in miles</option>
        <option value="5">Five</option>
        <option value="10">Ten</option>
        <option value="15">Fifteen</option>
      </select>
      <button onClick={onSavedUser}>Search!</button>
      <h4>Please enter valid information.</h4>
      <h1 id="message">{message}</h1>
      
      {result?.flaskData?.businesses &&
        result.flaskData.businesses.map((d) => (
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
