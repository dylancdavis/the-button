export function calculateScore(ageInSeconds) {
    return 0.00273222 * (ageInSeconds ** 2) + ageInSeconds;
}