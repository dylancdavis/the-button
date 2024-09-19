import React from "react";

export function Scoreboard({ scores, totalClicks }) {
  if (!scores) return null;
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="user-list">
        {scores.map((team, index) => (
          <>
            <div className="user-id">
              {index + 1}. {team.name}
            </div>
            <div>{team.points}</div>
          </>
        ))}
      </div>
      <div className="click-counter">Total Clicks: {totalClicks}</div>
    </div>
  );
}
