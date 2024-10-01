import React from "react";
import { hslAsCSS, hslFromLifePercentage } from "../utils";

export function ColorChangingButton({ onClick, ageAsPercent, disabled }) {
  const correctedAge = Math.max(0, Math.min(1, ageAsPercent))
  const backgroundColor = hslAsCSS(hslFromLifePercentage(correctedAge));

  return (
    <div className="color-circle-wrapper">
      <button
        onClick={onClick}
        className="color-circle"
        style={{ backgroundColor }}
        disabled={disabled}
      ></button>
    </div>
  );
}
