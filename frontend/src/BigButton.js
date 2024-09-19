import React from "react";

export function BigButton({ onClick, color }) {
  return (
    <div className="color-circle-wrapper">
      <button
        onClick={onClick}
        className="color-circle"
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
}
