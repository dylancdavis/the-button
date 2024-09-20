import chroma from "chroma-js";
import ntc from "ntcjs";

export function hslFromLifePercentage(unitInterval) {
  if (unitInterval > 1 || unitInterval < 0) throw new TypeError('Unit interval must be between 0 and 1');

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
  return 0.00273222 * ageInSeconds ** 2 + ageInSeconds;
}
