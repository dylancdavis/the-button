import React from "react";
import { hslAsCSS, hslFromLifePercentage } from "../utils";

export function ColorChangingButton({ onClick, ageAsPercent, disabled }) {
  const backgroundColor = hslAsCSS(hslFromLifePercentage(ageAsPercent));

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
