import React from "react";

export function Scoreboard({ scores, totalClicks }) {
  if (!scores) return null;
  const scoresArr = Object.entries(scores);
  const sortedScores = scoresArr.sort((a, b) => b[1] - a[1]);

  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="user-list">
        {sortedScores.map(([team, points], index) => (
          <>
            <div className="user-id" style={{ textAlign: "left" }}>
              {index + 1}. {team}
            </div>
            <div style={{ textAlign: "right" }}>{points.toLocaleString()}</div>
          </>
        ))}
      </div>
      <div className="click-counter">Total Clicks: {totalClicks}</div>
    </div>
  );
}
