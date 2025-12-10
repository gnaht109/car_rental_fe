import React from "react";
import ReactDOM from "react-dom/client";

// 1. Import the global stylesheet
import "./style.css";

// 2. Import the main App component
import App from "./App";

// 3. Find the 'root' div in the public/index.html file
const root = ReactDOM.createRoot(document.getElementById("root"));

// 4. Render the App component into the root div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
