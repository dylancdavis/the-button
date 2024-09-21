import React from "react";

export function Scoreboard({ scores, totalClicks }) {
  if (!scores) return null;
  const scoresArr = Object.entries(scores);
  const sortedScores = scoresArr.sort((a, b) => b.points - a.points);

  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="user-list">
        {sortedScores.map((team, index) => (
          <>
            <div className="user-id">
              {index + 1}. {team[0]}
            </div>
            <div>{team[1]}</div>
          </>
        ))}
      </div>
      <div className="click-counter">Total Clicks: {totalClicks}</div>
    </div>
  );
}
