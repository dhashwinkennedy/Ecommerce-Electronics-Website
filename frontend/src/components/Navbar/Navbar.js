import React from "react";
import NavLinks from "./NavLinks";
import "./Navbar.css";

const Navbar = () => { 
  return (
    <header className="main-header">
      <nav className="main-navigation__header-nav">
        <NavLinks />
      </nav>
    </header>
  );
};

export default Navbar;
