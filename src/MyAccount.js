import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import account from './account.png';
import accountdropdown from './account-dropdown.png';
import logout from './logout.png';
import logo from './Logo_LightBG.png';

export default function Account() {
  const [error] = useState("");

  const onUpdate = async () => {
    console.log("onUpdate");
  };

  return (
    <div>
      <div class="header-no-results">
        <div class="logo-container"><img src={logo} class="logo" alt="logo" /></div>
        <div class="navbar-no-results">
          <span class="navbar-link-container">
            <NavLink to="/about" class="navbar-link">
              <div class="navbar-link-title-padding">
                <div class="navbar-link-title-container">
                  <p class="navbar-link-title">ABOUT</p>
                </div>
              </div>
            </NavLink>
          </span>
        </div>
        <div class="navbar-no-results">
          <span class="navbar-link-container">
            <NavLink to="/index" class="navbar-link">
              <div class="navbar-link-title-padding">
                <div class="navbar-link-title-container">
                  <p class="navbar-link-title">SEARCH</p>
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
                  <p class="navbar-link-title">FAVORITES</p>
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
                            <button class="menu-item" type="submit" role="menuitem" tabindex="0">
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
      <div className="container myacccount-container">
        <h1>My Account</h1>
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
            <h2>My Address</h2>
            <div className="input-icons">
              <label htmlFor="address">Home:</label>
              <i className="fa fa-close icon" />
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Home"
              />
            </div>
            <div className="input-icons">
              <label htmlFor="vacation">Vacation:</label>
              <i className="fa fa-close icon" />
              <input
                type="text"
                id="vacation"
                name="vacation"
                placeholder="Vacation"
              />
            </div>
            <div className="input-icons">
              <i className="fa fa-plus icon" />
              <input
                type="text"
                id="address2"
                name="address2"
                placeholder="Add an Address"
              />
            </div>
            <div className="button-container">
              <button type="button" onClick={onUpdate}>
                Update
              </button>
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



