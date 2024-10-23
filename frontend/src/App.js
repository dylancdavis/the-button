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
          <Route path="*" element={<ButtonPage />} />
        </Routes>
      </BrowserRouter>
      <div className="app-version">v2.1</div>
    </div>
  );
}

export default App;
