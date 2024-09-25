import React, { useEffect, useState } from "react";
import "./app.css";
import "./reset.css";
import { ColorChangingButton } from "./ColorChangingButton";
import { Scoreboard } from "./Scoreboard";
import {
  calculateScore,
  getButtonLifePercent,
  getMostRecentClickTime,
  getTeamPointsFromClicks,
  buttonLifespan,
} from "./utils";

const apiURL = "ws://localhost:8080/api";
// const apiURL = '/api';

function App() {
  const [clicks, setClicks] = useState(null);
  const [team, setTeam] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ws, setWs] = useState(null);
  const [expectedPoints, setExpectedPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    async function setUpWebSocket() {
      const ws = new WebSocket(`${apiURL}/click`);
      ws.onopen = () => {
        console.log("Connected to websocket");
      };

      ws.onmessage = (event) => {
        console.log("Received message");
        const data = JSON.parse(event.data);
        setClicks(data);
        setSubmitting(false);
      };
      setWs(ws);
    }
    setUpWebSocket();
  }, []);

  useEffect(() => {
    if (!clicks || !ws) return;
    const pointsInterval = setInterval(() => {
      const now = new Date();
      const mostRecentClickTime = getMostRecentClickTime(clicks);
      const timeDiff = new Date() - getMostRecentClickTime(clicks);
      const newPoints = calculateScore(timeDiff / 1000);
      console.log({ newPoints, now, mostRecentClickTime, timeDiff });
      setExpectedPoints(newPoints);
    }, 50);
    const lifespan = buttonLifespan(clicks.length);
    const lifespanInterval = setInterval(() => {
      const mostRecentClickTime = getMostRecentClickTime(clicks);
      const timeDiff = new Date() - getMostRecentClickTime(clicks);
      const timeLeft = lifespan - timeDiff / 1000;
      setTimeLeft(Math.round(timeLeft));
    }, 1000);
    return () => {
      clearInterval(pointsInterval);
      clearInterval(lifespanInterval);
    };
  }, [clicks, ws]);

  function sendClick() {
    if (!ws || !team) return;
    setSubmitting(true);
    ws.send(team);
  }

  if (!clicks) return <div>Loading...</div>;

  const scores = getTeamPointsFromClicks(clicks);

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <ColorChangingButton
          onClick={sendClick}
          ageAsPercent={getButtonLifePercent(clicks)}
          disabled={team === "" || submitting}
        />
        <div>{expectedPoints} points</div>
        <div>Time Left: {timeLeft}</div>
        <div className="input-wrapper">
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter a team name"
          ></input>
        </div>
      </div>
      <Scoreboard scores={scores} totalClicks={clicks.length} />
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
