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
    </div>
  );
export default MyAccount;


