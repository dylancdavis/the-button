import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const buttonLifeSpan = 1000 * 60 * 60 * 24 * 7 * 2; // Two Weeks

  const [lastClickDate, setLastClickDate] = useState(new Date());

  
  function getUserID() {
    let userID = window.localStorage.getItem('userID');
    if (!userID) {
      userID = crypto.randomUUID()
      window.localStorage.setItem('userID', userID)
    }
    return userID
  }
  
  const userID = getUserID()

  useEffect(() => {
    (async function fetchData() {
      const response = await fetch("http://localhost:8000/last-clicked");
      const data = await response.json();
      setLastClickDate(new Date(data));
    })();
  }, []);

  function getButtonLifePercent() {
    const now = new Date();
    const buttonAge = now - lastClickDate;
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

  function toHslString({ hue, saturation, lightness }) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  async function updateClickDate() {
    const bodyData = {userID: userID}
    const response = await fetch("http://localhost:8000/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });
    const data = await response.json();
    console.log("data:", data);
    setLastClickDate(new Date(data.mostRecentClick));
  }

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <div className="color-circle-wrapper">
          <div
            onClick={updateClickDate}
            className="color-circle"
            style={{
              backgroundColor: toHslString(
                getColorProgress(getButtonLifePercent())
              ),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
