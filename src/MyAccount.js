import React, { useState } from "react";
import { Link } from "react-router-dom";

function MyAccount() {
  const [error] = useState("");

  const onUpdate = async () => {
    console.log("onUpdate");
  };

  return (
    <div>
      <div className="topnav">
        <Link to="/signup">
          <span className="logo">Fork It Over</span>
        </Link>
        <div className="topnav-right">
          <Link to="/search">Search</Link>
          <Link to="/about">About</Link>
          <Link to="/myfavorites">My Favorites</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </div>
      <div className="container myacccount-container">
        <h2 className="header">My Account</h2>
        <div className="body">
          <form>
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName">User Name:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Username"
              />
            </div>
      </div>
    </div>
  );
}

export default MyAccount;
