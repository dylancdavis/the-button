import React, { useEffect, useState } from "react";
import "./app.css";
import "./reset.css";
import { ColorChangingButton } from "./ColorChangingButton";
import { Scoreboard } from "./Scoreboard";

const apiURL = "ws://localhost:8080/api";
// const apiURL = '/api';

const buttonBirthday = new Date("2021-09-21");

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

  function getButtonLifePercent() {
    const mostRecentClickTime =
      clicks.length === 0 ? buttonBirthday : new Date(clicks[0].clicked);
    const now = new Date();
    const buttonAge = now - mostRecentClickTime;

    const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
    const maxButtonAge = secondsInOneWeek;

    if (buttonAge > maxButtonAge) return 1;
    return buttonAge / maxButtonAge;
  }

  function sendClick() {
    if (!ws || !team) return;
    setSubmitting(true);
    ws.send(team);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <ColorChangingButton
          onClick={sendClick}
          ageAsPercent={getButtonLifePercent()}
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
      <Scoreboard scores={[]} totalClicks={0} />
      <ol>
        {clicks.map((click, index) => {
          return (
            <li key={index}>
              team: {click.team}, clicked: {click.clicked}
            </li>
          );
        })}
      </ol>
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
