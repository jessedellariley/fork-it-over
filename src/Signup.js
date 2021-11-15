import React, { useState, useRef } from "react";

import { Link, useHistory } from "react-router-dom";

function Signup() {
  const [error, setError] = useState("");
  const history = useHistory();

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const onSignup = async () => {
    const name = nameRef.current.value;
    if (name === "") {
      setError("Name is empty");
      return;
    }

    const email = emailRef.current.value;
    if (email === "") {
      setError("Email is empty");
      return;
    }

    const phone = phoneRef.current.value;

    const password = passwordRef.current.value;
    if (password === "") {
      setError("Password is empty");
      return;
    }

    const confirm = confirmPasswordRef.current.value;
    if (password !== confirm) {
      setError("Password is not matched with confirm password");
      return;
    }

    const data = { name, email, phone, password };
    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    console.log(json);
    if (json.code !== 200) setError(json.message);
    else history.push(`/login`);
  };

  return (
    <div className="frame">
      <div className="container">
        <h2 className="header">Register</h2>
        <div className="body">
          <form>
            <div>
              <label htmlFor="name">Name:</label>
              <br />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name"
                ref={nameRef}
              />
              <br />
            </div>
            <div>
              <label htmlFor="email">Email address:</label>
              <br />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                ref={emailRef}
              />
              <br />
              <small>we will never share your email with anyone else.</small>
            </div>
            <div>
              <label htmlFor="phone">Phone Number:</label>
              <br />
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                ref={phoneRef}
              />
              <br />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                ref={passwordRef}
              />
            </div>
            <div>
              <label htmlFor="email">Confirm Password:</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
              />
            </div>
            <div className="button-container center">
              <button type="button" onClick={onSignup}>
                Register
              </button>
            </div>
            <div className="center">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
        <div className="center">
          <span>{error}</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
