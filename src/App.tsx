import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HamburgerMenu from "./components/HamburgerMenu";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import LandingPage from "./components/LandingPage";
import Background from "./components/Background";
import LoadingAnimation from "./components/LoadingAnimation";
import Logo from "./components/Logo";

function App() {
  return (
    <Router>
      <div className="App">
        <Logo />
        <HamburgerMenu />
        <LoadingAnimation />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Background show3D={true} />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Background show3D={false} />
                <About />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Background show3D={false} />
                <Projects />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Background show3D={false} />
                <Blog />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
