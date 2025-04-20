import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HamburgerMenu from "./components/HamburgerMenu";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Hardware from "./pages/Hardware";
import Software from "./pages/Software";
import Blog from "./pages/Blog";
import Background from "./components/Background";
import LoadingAnimation from "./components/LoadingAnimation";
import Logo from "./components/Logo";
import PageTransition from "./components/PageTransition";
import { useState, useEffect } from "react";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      setDisplayLocation(location);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [location, displayLocation]);

  const renderPage = (Component: React.ComponentType, show3D: boolean) => (
    <>
      <Background show3D={show3D} />
      <PageTransition>
        <div className={`page-content ${isTransitioning ? "fade-in" : ""}`}>
          {location.pathname !== "/" && <Component />}
        </div>
      </PageTransition>
    </>
  );

  return (
    <div className="App">
      <Logo />
      <HamburgerMenu />
      <LoadingAnimation />
      <div
        className={`content-container ${
          location.pathname === "/" ? "content-container-centered" : ""
        }`}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={renderPage(() => null, true)} />
          <Route path="/about" element={renderPage(About, false)} />
          <Route path="/projects" element={renderPage(Projects, false)} />
          <Route
            path="/projects/hardware"
            element={renderPage(Hardware, false)}
          />
          <Route
            path="/projects/software"
            element={renderPage(Software, false)}
          />
          <Route path="/diary" element={renderPage(Blog, false)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
