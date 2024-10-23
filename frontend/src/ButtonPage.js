import React, { useEffect, useState } from "react";
import { ColorChangingButton } from "./components/ColorChangingButton";
import { Scoreboard } from "./components/Scoreboard";
import {
  calculateScore,
  getButtonLifePercent,
  getMostRecentClickTime,
  getTeamPointsFromClicks,
  buttonLifespan,
  secondsSince,
  formatDuration,
} from "./utils";

function ButtonPage() {
  const [clicks, setClicks] = useState(null);
  const [team, setTeam] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ws, setWs] = useState(null);
  const [expectedPoints, setExpectedPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    async function setUpWebSocket() {
      const protocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const host = window.location.host;
      const path = "/api";

      const wsUrl = `${protocol}${host}${path}`;
      const ws = new WebSocket(`${wsUrl}/click`)
      ;
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

  const getLastClicked = () => {
    if (clicks.length === 0) return "No one has clicked yet";
    const mostRecentClick = clicks[0];
    const secondRecentClick = clicks[1];
    const mostRecentDuration = (new Date(mostRecentClick.clicked) - new Date(secondRecentClick.clicked)) / 1000
    const recentClickPoints = calculateScore(mostRecentDuration);
    const secsSinceLastclick = Math.round((new Date() - new Date(mostRecentClick.clicked)) / 1000)
    const lastClickDurationString = formatDuration(secsSinceLastclick);
    return `${mostRecentClick.team} clicked ${lastClickDurationString} ago and earned ${recentClickPoints} points`;
  }

  return (
    <div className="content">
      <h1>The Button</h1>
      <ColorChangingButton
        onClick={sendClick}
        ageAsPercent={getButtonLifePercent(clicks)}
        disabled={team === "" || submitting}
      />
      <div>{Math.max(0, expectedPoints).toLocaleString()} points</div>
      <div className="time-left">{formatDuration(timeLeft)}</div>
      <div className="time-left">{getLastClicked()}</div>
      <div className="input-wrapper">
        <input
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="Enter a team name"
        ></input>
      </div>
      <Scoreboard scores={scores} totalClicks={clicks.length} />
    </div>
  );
}

export default ButtonPage;
