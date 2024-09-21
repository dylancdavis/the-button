import React, { useEffect, useState } from "react";
import "./app.css";
import "./reset.css";
import { ColorChangingButton } from "./ColorChangingButton";
import { Scoreboard } from "./Scoreboard";
import { getButtonLifePercent, getTeamPointsFromClicks } from "./utils";

const apiURL = "ws://localhost:8080/api";
// const apiURL = '/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState([]);
  const [team, setTeam] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    async function setUpWebSocket() {
      const ws = new WebSocket(`${apiURL}/click`);
      ws.onopen = () => {
        console.log("Connected to websocket");
        setLoading(false);
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

  function sendClick() {
    if (!ws || !team) return;
    setSubmitting(true);
    ws.send(team);
  }

  if (loading) return <div>Loading...</div>;

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
