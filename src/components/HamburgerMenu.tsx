import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

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

  const handleNavigation = (path: string) => {
    // Navigate immediately
    navigate(path);
    // Close the menu
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
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
            <Link to="/about" onClick={() => handleNavigation("/about")}>
              About
            </Link>
            <Link to="/projects" onClick={() => handleNavigation("/projects")}>
              Projects
            </Link>
            <Link to="/blog" onClick={() => handleNavigation("/blog")}>
              Blog
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
