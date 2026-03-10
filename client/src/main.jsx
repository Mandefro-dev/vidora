import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "./LandingPage.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <LandingPage /> */}
  </StrictMode>,
);
