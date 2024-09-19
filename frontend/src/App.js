import React from "react";
import "./App.css";
import "./reset.css";
import { BigButton } from "./BigButton";
import { Scoreboard } from "./Scoreboard";
import { hslFromLifePercentage, hslAsCSS } from "./utils";

const apiURL = "http://localhost:8080/api";
// const apiURL = '/api';

function App() {
  const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7;

  function getButtonLifePercent() {
    const mostRecentClick = new Date();
    const now = new Date();
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
        <BigButton
          onClick={sendClick}
          color={hslAsCSS(hslFromLifePercentage(getButtonLifePercent()))}
        />
        <div className="input-wrapper">
          <input placeholder="What's your name?"></input>
        </div>
      </div>
      <Scoreboard users={[]} totalClicks={0} />
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
