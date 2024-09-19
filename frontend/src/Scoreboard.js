import { hslFromLifePercentage, getColorNameFromScore, hslAsCSS } from "./utils";

export function Scoreboard({ users, totalClicks }) {
  if (!users) return null;
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="user-list">
        {users.map((user, index) => (
          <>
            <div className="user-id">
              {index + 1}. {user.name}
            </div>
            <div
              className="score-circle"
              style={{
                backgroundColor: hslAsCSS(hslFromLifePercentage(user.score)),
              }}
            >
              <div className="tooltip-text">{getColorNameFromScore(user.score)}</div>
            </div>
          </>
        ))}
      </div>
      <div className="click-counter">Total Clicks: {totalClicks}</div>
    </div>
  );
}
