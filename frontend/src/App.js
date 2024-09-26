import React, { useEffect, useState } from "react";
import "./app.css";
import "./reset.css";
import { ColorChangingButton } from "./components/ColorChangingButton";
import { Scoreboard } from "./Scoreboard";
import {
  calculateScore,
  getButtonLifePercent,
  getMostRecentClickTime,
  getTeamPointsFromClicks,
  buttonLifespan,
  secondsSince,
  formatDuration,
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
    const mostRecentClickTime = getMostRecentClickTime(clicks);
    const lifespanSecs = buttonLifespan(clicks.length);

    function recalculatePoints() {
      const secondsSinceLastClick = secondsSince(mostRecentClickTime);
      const newPoints = calculateScore(secondsSinceLastClick);
      setExpectedPoints(newPoints);
    }

    function recalculateLifespan() {
      const secondsSinceLastClick = secondsSince(mostRecentClickTime);
      const timeLeftSecs = lifespanSecs - secondsSinceLastClick;
      setTimeLeft(Math.round(timeLeftSecs));
    }

    // Run instantly whenever points are changed
    recalculatePoints();
    recalculateLifespan();

    // And then update as needed
    const pointsInterval = setInterval(recalculatePoints, 50);
    const lifespanInterval = setInterval(recalculateLifespan, 1000);
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
        <div>{expectedPoints.toLocaleString()} points</div>
        <div>Time Left: {formatDuration(timeLeft)}</div>
        <div className="input-wrapper">
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter a team name"
          ></input>
        </div>
        <Scoreboard scores={scores} totalClicks={clicks.length} />
      </div>
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
