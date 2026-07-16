import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
//  <-- This line brings in te styles that might be hiding your text

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
