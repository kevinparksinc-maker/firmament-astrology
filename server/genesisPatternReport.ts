import type { ChartResult, ChartRow } from "./astronomy";
import {
  buildFrameRelationship,
  godHouseFor,
  houseThemesFor,
  type FrameRelationship,
} from "./astrologyCore";
import { buildPatternRecognitionReport, type PatternRecognitionReport } from "./patternRecognition";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function signFor(longitude: number) {
  return SIGNS[Math.floor((((longitude % 360) + 360) % 360) / 30)] ?? "Unknown";
}

export type DualFramePlacementEvidence = {
  name: string;
  longitude: number;
  display: string;
  sign: string;
  godView: { house: number; label: string; themes: string[] };
  agentView: { available: true; house: number; label: string; themes: string[] } | { available: false };
  relationship: FrameRelationship | null;
};

/**
 * Canonical comparison for one astronomical placement. God and Agent houses
 * come from their explicit calculated fields, never the worldview-dependent
 * display `row.house`.
 */
export function buildDualFrameEvidence(chart: ChartResult): DualFramePlacementEvidence[] {
  const rows: ChartRow[] = [
    ...chart.movingBodies,
    chart.ascendant,
    chart.descendant,
    chart.midheaven,
    chart.northNode,
    chart.southNode,
    ...chart.frozenStars,
  ].filter((row): row is ChartRow => Boolean(row));

  return rows.map((row) => {
    const godHouse = row.godHouse ?? godHouseFor(row.longitude);
    const godThemes = houseThemesFor(godHouse);
    const agentHouse = chart.agentViewAvailable ? row.agentHouse : undefined;
    const agentThemes = agentHouse == null ? null : houseThemesFor(agentHouse);
    const relationship = agentHouse == null
      ? null
      : row.frameRelationship ?? buildFrameRelationship(godHouse, agentHouse);

    return {
      name: row.name,
      longitude: row.longitude,
      display: row.display,
      sign: signFor(row.longitude),
      godView: { house: godHouse, label: godThemes.label, themes: godThemes.themes },
      agentView: agentHouse == null || !agentThemes
        ? { available: false }
        : { available: true, house: agentHouse, label: agentThemes.label, themes: agentThemes.themes },
      relationship,
    };
  });
}

function toPlanet(
  row: ChartRow,
  frame: "god" | "agent",
): {
  planet: string;
  tropicalLongitude: number;
  fixedBackgroundLongitude: number;
  house: number;
  sign: string;
  degreeInHouse: number;
  nakshatra: string;
  isRetrograde: boolean;
} {
  const house = frame === "god" ? row.godHouse : row.agentHouse;
  if (house == null) throw new Error(`Agent house is unavailable for ${row.name}.`);
  return {
    planet: row.name,
    tropicalLongitude: row.longitude,
    fixedBackgroundLongitude: row.longitude,
    house,
    sign: signFor(row.longitude),
    degreeInHouse: row.longitude % 30,
    nakshatra: row.overlay.nakshatra,
    isRetrograde: Boolean(row.retrograde),
  };
}

function patternChart(rows: ChartRow[], frame: "god" | "agent") {
  return {
    planets: rows
      .filter((row) => !["Ascendant", "Descendant", "Midheaven"].includes(row.name))
      .map((row) => toPlanet(row, frame)),
    houses: [],
  };
}

export function buildGenesisPatternReport(chart: ChartResult): PatternRecognitionReport {
  // Use exactly the same natal points for both analyses, including the nodes.
  const rows = [...chart.movingBodies, chart.northNode, chart.southNode];
  const godView = patternChart(rows, "god");
  const agentView = chart.agentViewAvailable ? patternChart(rows, "agent") : null;

  return buildPatternRecognitionReport({
    godView,
    agentView,
    question: `${chart.readingScope} chart · ${chart.worldview} worldview`,
  });
}
