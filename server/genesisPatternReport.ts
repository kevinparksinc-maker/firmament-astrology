import type { ChartResult, ChartRow } from "./astronomy";
import { buildPatternRecognitionReport, type PatternRecognitionReport } from "./patternRecognition";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function signFor(longitude: number) {
  return SIGNS[Math.floor((((longitude % 360) + 360) % 360) / 30)] ?? "Unknown";
}

function toPlanet(row: ChartRow) {
  return {
    planet: row.name,
    tropicalLongitude: row.longitude,
    fixedBackgroundLongitude: row.longitude,
    house: row.house,
    sign: signFor(row.longitude),
    degreeInHouse: row.longitude % 30,
    nakshatra: row.overlay.nakshatra,
    starLord: `${row.name}-star-lord-not-supplied`,
    subLord: `${row.name}-sub-lord-not-supplied`,
    isRetrograde: Boolean(row.retrograde),
  };
}

function toChart(rows: ChartRow[], houses: number[]) {
  return {
    planets: rows.filter(row => !["Ascendant", "Descendant", "Midheaven"].includes(row.name)).map(toPlanet),
    houses: houses.map((_, index) => ({ house: index + 1, cluster: "not supplied", sign: SIGNS[index] ?? "Unknown", starLord: "not supplied", subLord: "not supplied" })),
  };
}

export function buildGenesisPatternReport(chart: ChartResult): PatternRecognitionReport {
  const godRows = chart.godPlacements.length ? chart.godPlacements : chart.movingBodies;
  const agentRows = chart.movingBodies;
  return buildPatternRecognitionReport({
    godView: toChart(godRows, chart.houses),
    agentView: toChart(agentRows, chart.houses),
    question: `${chart.readingScope} chart · ${chart.worldview} worldview`,
  });
}
