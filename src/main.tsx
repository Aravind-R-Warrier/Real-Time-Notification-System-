import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';



const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found. Ensure there's an element with id='root' in index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
