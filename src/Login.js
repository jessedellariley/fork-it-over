import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const [error, setError] = useState("");
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const onLogin = async () => {
    const email = emailRef.current.value;
    if (email === "") {
      setError("Email is empty");
      return;
    }

    const password = passwordRef.current.value;
    if (password === "") {
      setError("Password is empty");
      return;
    }

    const data = { email, password };
    const res = await fetch("/login", {
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
    else {
      localStorage.setItem("login", 1);
      history.push("/");    
    }
  };

  return (
    <div className="frame">
      <h1 className="center">Welcome to Fork It Over</h1>
      <div className="container">
        <h2 className="header">Login</h2>
        <div className="body">
          <form>
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
              <small>We will never share your email with anyone else.</small>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                ref={passwordRef}
              />
            </div>
            <div className="button-container center">
              <button type="button" onClick={onLogin}>
                Submit
              </button>
            </div>
            <div className="center">
              Dont have an account? <Link to="/signup">Register</Link>
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

export default Login;
