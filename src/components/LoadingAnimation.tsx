import { useEffect, useState } from "react";

const LoadingAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="logo-container">
        <img src="/whiteLogo.png" alt="WM01 Logo" className="loading-logo" />
        <div className="logo-reveal"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
