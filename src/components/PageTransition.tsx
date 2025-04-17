import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // For landing page, set visible immediately
    if (location.pathname === "/") {
      setIsVisible(true);
      return;
    }

    // For other pages, start invisible and fade in
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
