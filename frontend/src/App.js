import React, { useState } from "react";
import "./App.css";
import "./reset.css";
import { ColorChangingButton } from "./ColorChangingButton";
import { Scoreboard } from "./Scoreboard";

const apiURL = "http://localhost:8080/api";
// const apiURL = '/api';

function App() {
  const [scores, setScores] = useState([]);
  const [name, setName] = useState("");

  const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7;

  function getButtonLifePercent() {
    const now = new Date();
    const mostRecentClick = new Date();
    const buttonAge = now - mostRecentClick;
    if (buttonAge > secondsInOneWeek) return 1;
    return buttonAge / secondsInOneWeek;
  }

  function sendClick() {
    console.log("clicked");
  }

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <ColorChangingButton
          onClick={sendClick}
          ageAsPercent={getButtonLifePercent()}
        />
        <div className="input-wrapper">
          <input
            value={name}
            onChange={(e) => setName(e.target.valuegi)}
            placeholder="What's your name?"
          ></input>
        </div>
      </div>
      <Scoreboard scores={scores} totalClicks={0} />
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
