import { hslFromLifePercentage, getColorNameFromScore, hslAsCSS } from "./utils";

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
            <div
              className="score-circle"
              style={{
                backgroundColor: hslAsCSS(hslFromLifePercentage(team.points)),
              }}
            >
              <div className="tooltip-text">{getColorNameFromScore(team.points)}</div>
            </div>
          </>
        ))}
      </div>
      <div className="click-counter">Total Clicks: {totalClicks}</div>
    </div>
  );
}
