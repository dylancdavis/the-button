import React from "react";
import ButtonPage from "./ButtonPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";
import "./reset.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/beta" element={<ButtonPage />} />
          <Route
            path="*"
            element={
              <div className="goodbye-message">
                the button will return 2024.10.01
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
