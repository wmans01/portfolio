import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [currentText, setCurrentText] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const texts = [
    "Engineer",
    "Entrepreneur",
    "Game Developer",
    "Procrastinator",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="landing-container"
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <Link to="/" className="logo-link">
        <img src="/whiteLogo.png" alt="WM01 Logo" className="logo" />
      </Link>
      <div className="name-title">
        <h1 className="name" style={{ color: "var(--off-white)" }}>
          Jeremy Wang
        </h1>
        <div className="title-container">
          {texts.map((text, index) => (
            <span
              key={text}
              className={`title ${index === currentText ? "active" : ""}`}
              style={{ color: "var(--accent-blue)" }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
      <div className="quote-container">
        <p className="quote">
          "Perfection is not attainable, but if we chase perfection we can catch
          excellence."
        </p>
        <p className="quote-author">- Vince Lombardi</p>
      </div>
    </div>
  );
};

export default LandingPage;
