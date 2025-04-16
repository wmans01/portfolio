import React, { useState } from "react";
import { Link } from "react-router-dom";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      setIsClosing(true);
      // Wait for animation to complete before removing the overlay
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300); // Match this with the CSS animation duration
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {(isOpen || isClosing) && (
        <div className={`menu-overlay ${isClosing ? "closing" : ""}`}>
          <nav className="menu-content">
            <Link to="/about" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/projects" onClick={toggleMenu}>
              Projects
            </Link>
            <Link to="/blog" onClick={toggleMenu}>
              Blog
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
