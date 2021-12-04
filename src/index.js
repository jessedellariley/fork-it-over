import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import Account from "./MyAccount";
import Favorites from "./MyFavorites";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/index" element={<App />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="account" element={<Account />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

