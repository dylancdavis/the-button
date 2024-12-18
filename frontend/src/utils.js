import chroma from "chroma-js";
import ntc from "ntcjs";

export const BUTTON_BIRTHDAY = new Date("2024-10-01T17:00-04:00");

export function hslFromLifePercentage(unitInterval) {
  if (unitInterval > 1 || unitInterval < 0)
    throw new TypeError("Unit interval must be between 0 and 1");

  const firstThreshold = 0.7;
  const secondThreshold = 0.8;

  if (unitInterval < firstThreshold) {
    const scaledPercent = unitInterval / firstThreshold;
    return {
      hue: scaledPercent * 320,
      saturation: 1,
      lightness: 0.5,
    };
  }
  if (unitInterval < secondThreshold) {
    const scaledPercent =
      (unitInterval - firstThreshold) / (secondThreshold - firstThreshold);
    return {
      hue: 320,
      saturation: 1,
      lightness: 0.5 + scaledPercent * 0.5,
    };
  }
  const scaledPercent =
    (unitInterval - secondThreshold) / (1 - secondThreshold);
  return {
    hue: 320,
    saturation: 0,
    lightness: 1 - scaledPercent,
  };
}

export function hslAsCSS({ hue, saturation, lightness }) {
  return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
}

export function getColorNameFromScore(score) {
  const { hue, saturation, lightness } = hslFromLifePercentage(score);
  const chromaColor = chroma.hsl(hue, saturation, lightness);
  const hex = chromaColor.hex();
  const name = ntc.name(hex)[1];
  return name;
}

export function calculateScore(ageInSeconds) {
  return Math.floor(0.00273222 * ageInSeconds ** 2 + ageInSeconds);
}

export function buttonLifespan(numClicks) {
  // startingTime is the lifespan of the button in seconds
  // when zero clicks have occurred.
  // The clicksToReach and decrease factor calibrate what the
  // lifespan of the button should be as a fraction of the starting time
  // at clicksToReach number of clicks
  // i.e. 1/21 of starting time (for one week, 8 hours) by 10,000 clicks
  const startingTimeSecs = 604800;
  const decreaseFactor = 21;
  const clicksToReachFractionalTime = 10000;
  const r = Math.log(1 / decreaseFactor) / clicksToReachFractionalTime;
  const timeLeftSecs = startingTimeSecs * Math.E ** (r * numClicks);
  return Math.round(timeLeftSecs);
}

export function getMostRecentClickTime(clicks) {
  if (clicks.length === 0) return BUTTON_BIRTHDAY;
  const clickTimes = clicks.map((click) => new Date(click.clicked));
  clickTimes.sort((a, b) => b - a);
  return clickTimes[0];
}

export function getButtonLifePercent(clicks) {
  if (!clicks) return 0;

  let mostRecentClickTime = getMostRecentClickTime(clicks);
  const now = new Date();

  if (mostRecentClickTime > now) {
    console.error("Most recent click time is in the future");
    // Assume button clicked very recently if click time is in future
    return 0;
  }
  const buttonAge = now - mostRecentClickTime;

  const secondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
  const buttonLifespan = secondsInOneWeek;

  if (buttonAge > buttonLifespan) return 1;
  return buttonAge / buttonLifespan;
}

export function getTeamPointsFromClicks(clicks) {
  const clicksWithTimeDiffs = clicks.map((click, index) => {
    if (index === clicks.length - 1) {
      const timeDiffFromBirthday = new Date(click.clicked) - BUTTON_BIRTHDAY;
      return { ...click, timeDiff: timeDiffFromBirthday };
    }
    const previousClickTime = clicks[index + 1].clicked;
    const timeDiff = new Date(click.clicked) - new Date(previousClickTime);
    return { ...click, timeDiff };
  });
  const clicksWithPoints = clicksWithTimeDiffs.map((click) => {
    const points = calculateScore(click.timeDiff / 1000);
    return { ...click, points };
  });
  const teamsWithPoints = clicksWithPoints.reduce((teamPoints, click) => {
    if (!teamPoints[click.team]) {
      teamPoints[click.team] = click.points;
    } else {
      teamPoints[click.team] += click.points;
    }
    return teamPoints;
  }, {});
  return teamsWithPoints;
}

export const secondsSince = (time) => (new Date() - time) / 1000;

export function formatDuration(seconds) {
  if (seconds < 0) {
    throw new Error("Duration cannot be negative.");
  }

  const secondsInADay = 86400; // 24 * 60 * 60
  const secondsInAnHour = 3600; // 60 * 60
  const secondsInAMinute = 60; // 60

  const days = Math.floor(seconds / secondsInADay);
  seconds %= secondsInADay;
  const hours = Math.floor(seconds / secondsInAnHour);
  seconds %= secondsInAnHour;
  const minutes = Math.floor(seconds / secondsInAMinute);
  seconds %= secondsInAMinute;

  const durationParts = [];
  if (days > 0) durationParts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) durationParts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0)
    durationParts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 || durationParts.length === 0) {
    durationParts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
  }

  return durationParts.join(", ");
}
