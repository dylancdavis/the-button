import React, { useEffect, useState } from "react";
import "./app.css";
import "./reset.css";
import { ColorChangingButton } from "./ColorChangingButton";
import { Scoreboard } from "./Scoreboard";

const apiURL = "http://localhost:8080/api";
// const apiURL = '/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [button, setButton] = useState({});
  const [name, setName] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    async function setUpWebSocket() {
      const ws = new WebSocket("ws://localhost:8080/api/click");
      ws.onopen = () => {
        console.log("Connected to websocket");
        setLoading(false);
      };

      ws.onmessage = (event) => {
        console.log("Received message");
        const data = JSON.parse(event.data);
        setClicks(data);
      };
      setWs(ws);
    }
    setUpWebSocket();
  }, []);

  const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7;

  function getButtonLifePercent() {
    const now = new Date();
    const mostRecentClick = new Date();
    const buttonAge = now - mostRecentClick;
    if (buttonAge > secondsInOneWeek) return 1;
    return buttonAge / secondsInOneWeek;
  }

  function sendClick() {
    ws.send(name);
  }

  if (loading) return <div>Loading...</div>;

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
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
          ></input>
        </div>
      </div>
      <Scoreboard scores={scores} totalClicks={0} />
      <ol>
        {clicks.map((click, index) => {
          return (
            <li key={index}>
              team: {click.team}, points: {click.points}
            </li>
          );
        })}
      </ol>
      <div className="app-version">v2.0</div>
    </div>
  );
}

export default App;
