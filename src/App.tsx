import LandingPage from "./components/LandingPage";
import Background from "./components/Background";
import { BrowserRouter } from "react-router-dom";
import LoadingAnimation from "./components/LoadingAnimation";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <LoadingAnimation />
        <Background />
        <LandingPage />
      </div>
    </BrowserRouter>
  );
}

export default App;
