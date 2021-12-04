import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import account from './white-account.png';
import accountdropdown from "./account-dropdown.png"
import logout from './logout.png';
import logo from './Logo_DarkBG.png';
import { useLocation } from "react-router";

export default function Account() {
  const args = (document.getElementById('data') == null) ? ({
    addresses: [],
    email: ''
  }) : JSON.parse(document.getElementById('data').text);
  let location = useLocation();
  const [accountAddresses, setAddresses] = useState(args.addresses);
  const [email, setEmail] = useState(args.email);
  const [addressInput, setAddressInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  function onClickAdd() {
    const address = addressInput;
    const updatedAddresses = [...accountAddresses, address];
    setAddresses(updatedAddresses);
    setAddressInput('');
  }

  function onClickDelete(i) {
    const updatedAddresses = [...accountAddresses.slice(0, i), ...accountAddresses.slice(i + 1)];
    setAddresses(updatedAddresses);
  }

  function onUpdate() {
    const requestData = { username: emailInput, addresses: accountAddresses };
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data.addresses);
        setEmail(data.username);
      });
    setEmailInput("");
  };

  const addressesList = accountAddresses.map((address, i) => (
    <div class="adresses-list">
      <span>{address}</span>
      <button id="delete" onClick={() => onClickDelete(i)}>-</button>
    </div>
  ));

  return (
    <div class="account-page">
      <div class="header-container header-no-results">
        <div class="logo-container logo-account"><img src={logo} class="logo" alt="logo" /></div>
        <div class="navbar-no-results">
          <span class="navbar-link-container">
            <NavLink to="/index" class="navbar-link">
              <div class="navbar-link-title-padding">
                <div class="navbar-link-title-container">
                  <p class="navbar-link-title white-nav">SEARCH</p>
                </div>
              </div>
            </NavLink>
          </span>
        </div>
        <div class="navbar-no-results">
          <span class="navbar-link-container">
            <NavLink to="/favorites" class="navbar-link">
              <div class="navbar-link-title-padding">
                <div class="navbar-link-title-container">
                  <p class="navbar-link-title white-nav">FAVORITES</p>
                </div>
              </div>
            </NavLink>
          </span>
        </div>
        <div class="account-no-results">
          <div class="account-table">
            <div class="account-table-cell">
              <div class="account-mid-container">
                <div class="account-inner-container">
                  <div>
                    <button class="account" aria-label="Toggle Menu" aria-haspopup="menu" aria-controls="header-dropdown-menu"
                      aria-expanded="true" type="submit">
                      <span class="account-image-outer-wrapper">
                        <span class="account-image-inner-wrapper">
                          <img class="account-image" src={account} alt="Account" width="36" height="36" />
                        </span>
                      </span>
                    </button>
                    <menu class="menu">
                      <div class="menu-account-section">
                        <NavLink to="/account" class="menu-item">
                          <div class="menu-item-components-padding">
                            <div class="menu-item-components-container">
                              <div class="menu-item-symbol-container">
                                <div class="menu-item-symbol-padding">
                                  <span class="menu-item-symbol-wrapper">
                                    <img class="menu-item-symbol" src={accountdropdown} />
                                  </span>
                                </div>
                              </div>
                              <div class="menu-item-name-container">
                                <span class="menu-item-name">Account</span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                      <div class="menu-logout-section">
                        <form id="logout" class="logout" action="/logout" name="logout" method="post">
                          <div class="logout-button-wrapper">
                            <button id="account-page-logout" class="menu-item" type="submit" role="menuitem" tabindex="0">
                              <div class="menu-item-components-padding">
                                <div class="menu-item-components-container">
                                  <div class="menu-item-symbol-container">
                                    <div class="menu-item-symbol-padding">
                                      <span class="menu-item-symbol-wrapper">
                                        <img alt='log-out' class="menu-item-symbol" src={logout} />
                                      </span>
                                    </div>
                                  </div>
                                  <div class="menu-item-name-container">
                                    <span class="menu-item-name">Log Out</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </form>
                      </div>
                    </menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="myaccount-container">
        <h1>My Account</h1>
        <div class="email-input">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={email}
            value={emailInput}
            onInput={e => setEmailInput(e.target.value)}
          />
        </div>
        <h2>Addresses</h2>
        {addressesList}
        <div class="addresses">
          <label for="address">Add a new address: </label>
          <input id="address" type="text" value={addressInput} onInput={e => setAddressInput(e.target.value)} />
          <button id="add" onClick={onClickAdd}>+</button>
        </div>
        <div class="update">
        <button type="button" onClick={onUpdate}>
          Update
        </button>
        </div>
      </div>
    </div>
  );
}



