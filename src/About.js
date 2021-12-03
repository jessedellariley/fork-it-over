import React from 'react';
import { NavLink } from "react-router-dom";
import account from './account.png';
import accountdropdown from './account-dropdown.png';
import logout from './logout.png';
import logo from './Logo_LightBG.png';

export default function About(props) {
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
            <h1>About</h1>
        </div>
    );
}