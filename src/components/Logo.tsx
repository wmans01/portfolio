import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="logo-link">
      <img src="/whiteLogo.png" alt="WM01 Logo" className="logo" />
    </Link>
  );
};

export default Logo;
