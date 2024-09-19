import "./App.css";
import "./reset.css";
import chroma from "chroma-js";
import ntc from "ntcjs";

const apiURL = 'http://localhost:8080/api';
// const apiURL = '/api';

function App() {
  const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7
  const totalClicks = 0;

  function getButtonLifePercent() {
    const mostRecentClick = new Date();
    const now = new Date();
    const buttonAge = now - mostRecentClick;
    if (buttonAge > secondsInOneWeek) return 1;
    return buttonAge / secondsInOneWeek;
  }

  function getColorProgress(unitInterval) {
    if (unitInterval > 1 || unitInterval < 0) return;

    const firstThreshold = 0.7;
    const secondThreshold = 0.8;

    if (unitInterval < firstThreshold) {
      const scaledPercent = unitInterval / firstThreshold;
      return {
        hue: scaledPercent * 320,
        saturation: 1,
        lightness: 0.5,
      };
    }
    if (unitInterval < secondThreshold) {
      const scaledPercent =
        (unitInterval - firstThreshold) / (secondThreshold - firstThreshold);
      return {
        hue: 320,
        saturation: 1,
        lightness: 0.5 + scaledPercent * 0.5,
      };
    }
    const scaledPercent =
      (unitInterval - secondThreshold) / (1 - secondThreshold);
    return {
      hue: 320,
      saturation: 0,
      lightness: 1 - scaledPercent,
    };
  }

  function getScoreboardUsers() {
    return []
  }

  const users = []

  function toHslString({ hue, saturation, lightness }) {
    return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
  }

  function scoreToName(score) {
    const { hue, saturation, lightness } = getColorProgress(score);
    const chromaColor = chroma.hsl(hue, saturation, lightness);
    const hex = chromaColor.hex();
    const name = ntc.name(hex)[1];
    return name;
  }

  function sendClick() {
    console.log('clicked');
  }

  return (
    <div className="App">
      <div className="content">
        <h1>The Button</h1>
        <div className="color-circle-wrapper">
          <button
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
        <input placeholder="What's your name?"></input>
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
                >
                  <div className="tooltip-text">{scoreToName(user.score)}</div>
                </div>
              </>
            ))}
          </div>
          <div className="click-counter">Total Clicks: {totalClicks}</div>
        </div>
      )}
      <div className="app-version">v1.2</div>
    </div>
  );
}

export default App;
