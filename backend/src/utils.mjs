export function calculatePointsForButtonAge(ageInSeconds) {
  return Math.floor(0.00273222 * ageInSeconds ** 2 + ageInSeconds);
}
