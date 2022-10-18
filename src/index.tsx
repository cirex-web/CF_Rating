import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { FirebaseProvider } from "./context/FirebaseContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);
