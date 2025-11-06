import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App"; // če uporabljaš AppWrapper kot prej
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>
);
