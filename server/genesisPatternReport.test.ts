import { describe, expect, it } from "vitest";
import { calculateChart } from "./astronomy";
import { houseThemesFor } from "./astrologyCore";
import { buildDualFrameEvidence } from "./genesisPatternReport";
import { buildPatternRecognitionReport } from "./patternRecognition";

const dallasBirth = {
  location: "Dallas, Texas, USA",
  latitude: 32.7767,
  longitude: -96.797,
  timezone: "America/Chicago",
  date: "1986-11-20",
  time: "10:06",
  readingScope: "natal" as const,
};

function syntheticPlanet(planet: string, longitude: number, house: number) {
  return {
    planet,
    tropicalLongitude: longitude,
    fixedBackgroundLongitude: longitude,
    house,
    sign: "Aries",
    degreeInHouse: longitude % 30,
    nakshatra: `${planet} mansion`,
    isRetrograde: false,
  };
}

describe("canonical God / Agent evidence and Genesis report", () => {
  it("maps each frame from its explicit calculated house, not the selected display house", async () => {
    const chart = await calculateChart({ ...dallasBirth, worldview: "agent-vs-god" });
    const sun = chart.movingBodies.find((row) => row.name === "Sun")!;
    const evidence = buildDualFrameEvidence(chart).find((row) => row.name === "Sun")!;

    expect(evidence.longitude).toBe(sun.longitude);
    expect(evidence.godView.house).toBe(sun.godHouse);
    expect(evidence.agentView).toMatchObject({ available: true, house: sun.agentHouse });
    expect(evidence.relationship).toEqual(sun.frameRelationship);
    expect(chart.patternRecognition?.agentViewAvailable).toBe(true);
    expect(chart.patternRecognition?.agentView.frame).toBe("Agent View");
  });

  // Conventional house-domain baseline, cross-checked against:
  // https://traditional-astrology.com/houses.html and
  // https://www.chani.com/blogs/the-12-houses-in-astrology
  it.each([
    [1, ["selfhood", "beginnings"]],
    [2, ["resources", "money"]],
    [3, ["communication", "movement"]],
    [4, ["home", "family"]],
    [5, ["creativity", "pleasure"]],
    [6, ["routine", "service"]],
    [7, ["relationships", "contracts"]],
    [8, ["shared resources", "intimacy"]],
    [9, ["belief", "study"]],
    [10, ["career", "authority"]],
    [11, ["networks", "hopes"]],
    [12, ["private work", "closure"]],
  ])("retains conventional life-area meanings for House %i", (house, expectedThemes) => {
    const meaning = houseThemesFor(Number(house));
    const searchable = `${meaning.label} ${meaning.themes.join(" ")}`.toLowerCase();
    for (const theme of expectedThemes as string[]) {
      expect(searchable, `House ${house} should retain the ${theme} domain`).toContain(theme);
    }
  });

  it("does not treat the always-opposite lunar nodes as a chart-specific aspect", () => {
    const frame = {
      planets: [syntheticPlanet("North Node", 45, 4), syntheticPlanet("South Node", 225, 10)],
      houses: [],
    };
    const report = buildPatternRecognitionReport({ godView: frame, agentView: frame });
    const names = report.godView.findings.map((finding) => finding.name);

    expect(names).not.toContain("North Node opposition South Node");
    expect(names).toContain("North Node house activation");
    expect(names).toContain("South Node house activation");
    expect(report.godView.findings.flatMap((finding) => finding.evidence).join(" ")).not.toContain("undefined");
  });

  it("applies the hard-coded Upachaya and Dusthana house-cluster rules", () => {
    const frame = {
      planets: [
        syntheticPlanet("Sun", 2, 3),
        syntheticPlanet("Mars", 40, 10),
        syntheticPlanet("Venus", 95, 6),
        syntheticPlanet("Saturn", 160, 8),
      ],
      houses: [],
    };
    const report = buildPatternRecognitionReport({ godView: frame, agentView: frame });
    const names = report.godView.findings.map((finding) => finding.name);

    expect(names).toContain("Upachaya emphasis");
    expect(names).toContain("Dusthana emphasis");
  });

  it("does not fabricate an Agent comparison for a date-only God chart", async () => {
    const chart = await calculateChart({
      location: "",
      latitude: 0,
      longitude: 0,
      timezone: "",
      date: "1986-11-20",
      time: "",
      worldview: "god",
      readingScope: "natal",
      birthTimeKnown: false,
    });
    const evidence = buildDualFrameEvidence(chart).find((row) => row.name === "Sun")!;

    expect(evidence.agentView).toEqual({ available: false });
    expect(evidence.relationship).toBeNull();
    expect(chart.patternRecognition?.convergence.state).toBe("unavailable");
    expect(chart.patternRecognition?.agentView.findings).toEqual([]);
  });
});
