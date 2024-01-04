import { useState } from "react";
import "./App.css";

function App() {
  const [hue, setHue] = useState(320);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  function decreaseColor() {
    if (hue > 0) {
      setHue(hue - 1);
    }
  }

  return (
    <div className="App">
      <div className="content">
        <h1>Color Circle</h1>
        <div className="color-circle-wrapper">
          <div
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
