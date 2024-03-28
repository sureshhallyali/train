// navbar.jsx

import React, { useState } from "react";
import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);

  const toggleMenu = () => {
    setShowMediaIcons(!showMediaIcons);
  };

  return (
    <nav className="main-nav">
      <div className="logo">
        <h2>
          <span>A</span>DIS
          <span>T</span>ECHNOLOGY
        </h2>
      </div>

      <div className={showMediaIcons ? "menu-link show" : "menu-link"}>
        <ul>
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={toggleMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/service" onClick={toggleMenu}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={toggleMenu}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="social-media">
        <ul className="social-media-desktop">
          <li>
            <a href="https://www.youtube.com/@desicow" target="_ADIS">
              <FaFacebookSquare className="facebook" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@desicow" target="_ADIS">
              <FaInstagramSquare className="instagram" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@desicow" target="_ADIS">
              <FaYoutubeSquare className="youtube" />
            </a>
          </li>
        </ul>

        <div className="hamburger-menu">
          <a href="#" onClick={toggleMenu}>
            <GiHamburgerMenu />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

