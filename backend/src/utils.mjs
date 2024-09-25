export function calculatePointsForButtonAge(ageInSeconds) {
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
