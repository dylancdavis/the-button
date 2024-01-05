import { useEffect, useState } from "react";
import "./App.css";
import "./reset.css";

function App() {
  const buttonLifeSpan = 1000 * 60 * 60 * 24 * 7 * 2; // Two Weeks

  const [mostRecentClick, setMostRecentClick] = useState(new Date());
  const [users, setUsers] = useState(null);
  const [totalClicks, setTotalClicks] = useState(null);

  const [username, setUsername] = useState("");

  const [newUser, setNewUser] = useState(true);

  function getUserID() {
    let userID = window.localStorage.getItem("userID");
    if (!userID) {
      userID = crypto.randomUUID();
      window.localStorage.setItem("userID", userID);
    }
    return userID;
  }

  const userID = getUserID();

  function getScoreboardUsers() {
    const sorted = users.sort((a, b) => b.score - a.score);
    return sorted.slice(0, 10);
  }

  useEffect(() => {
    (async function fetchData() {
      const response = await fetch("http://localhost:8000/api/data");
      const data = await response.json();
      setMostRecentClick(new Date(data.mostRecentClick));
      setTotalClicks(data.totalClicks);
      setUsers(data.users);
      if (data.users) {
        const user = data.users.find((user) => user.userID === userID);
        if (user) {
          setUsername(user.name);
          setNewUser(false);
        }
      }
    })();
  }, [userID]);

  function getButtonLifePercent() {
    const now = new Date();
    const buttonAge = now - mostRecentClick;
    if (buttonAge > buttonLifeSpan) return 1;
    return buttonAge / buttonLifeSpan;
  }

  function getColorProgress(unitInterval) {
    if (unitInterval > 1 || unitInterval < 0) return;

    const firstThreshold = 0.7;
    const secondThreshold = 0.8;

    if (unitInterval < firstThreshold) {
      const scaledPercent = unitInterval / firstThreshold;
      return {
        hue: scaledPercent * 320,
        saturation: 100,
        lightness: 50,
      };
    }
    if (unitInterval < secondThreshold) {
      const scaledPercent =
        (unitInterval - firstThreshold) / (secondThreshold - firstThreshold);
      return {
        hue: 320,
        saturation: 100,
        lightness: 50 + scaledPercent * 50,
      };
    }
    const scaledPercent =
      (unitInterval - secondThreshold) / (1 - secondThreshold);
    return {
      hue: 320,
      saturation: 0,
      lightness: 100 - scaledPercent * 100,
    };
  }

  function isButtonDisabled() {
    if (users === null || totalClicks === null) return true;

    if (!username && newUser) return true;

    const user = users.find((user) => user.userID === userID);

    if (user) {
      if (user.score > getButtonLifePercent()) {
        console.log("is disbaled!");
        return true;
      }
    }
    return false;
  }

  function toHslString({ hue, saturation, lightness }) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  async function sendClick() {
    if (!username) return;
    const bodyData = {
      userID: userID,
      score: getButtonLifePercent(),
      name: username,
    };
    const response = await fetch("http://localhost:8000/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    setMostRecentClick(new Date(data.mostRecentClick));
    setTotalClicks(data.totalClicks);
    setUsers(data.users);
  }

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <div className="color-circle-wrapper">
          <button
            disabled={isButtonDisabled()}
            onClick={sendClick}
            className="color-circle"
            style={{
              backgroundColor: toHslString(
                getColorProgress(getButtonLifePercent())
              ),
            }}
          ></button>
        </div>
        <div className="input-wrapper">
          {newUser ? (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="What's your name?"
            ></input>
          ) : (
            <div class="button-message">
              welcome back, {username.toLowerCase()}
            </div>
          )}
        </div>
      </div>
      {users && (
        <div className="scoreboard">
          <h2>Scoreboard</h2>
          <div className="user-list">
            {getScoreboardUsers().map((user, index) => (
              <>
                <div className="user-id">
                  {index + 1}. {user.name}
                </div>
                <div
                  className="score-circle"
                  style={{
                    backgroundColor: toHslString(getColorProgress(user.score)),
                  }}
                ></div>
              </>
            ))}
          </div>
          <div className="click-counter">Total Clicks: {totalClicks}</div>
        </div>
      )}
    </div>
  );
}

export default App;
