import { useState } from "react";
import "./App.css";

function App() {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const [hasBeenWhite, setHasBeenWhite] = useState(false);

  const changeAmount = 10;

  function cycleColor() {
    if (hue < 320) {
      setHue(hue + changeAmount);
      return;
    }
    if (lightness >= 100) {
      setHasBeenWhite(true);
      setSaturation(0);
    }
    if (!hasBeenWhite) {
      setLightness(lightness + changeAmount);
      return;
    }
    if (lightness > 0) setLightness(lightness - changeAmount);
  }

  return (
    <div className="App">
      <div className="content">
        <h1>Color Circle</h1>
        <div className="color-circle-wrapper">
          <div
            onClick={cycleColor}
            className="color-circle"
            style={{
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
