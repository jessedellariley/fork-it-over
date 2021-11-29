import React, { useState } from "react";
import { Link } from "react-router-dom";

function MyAccount() {
  const [error] = useState("");

  const onUpdate = async () => {
    console.log("onUpdate");
  };

export default MyAccount;


