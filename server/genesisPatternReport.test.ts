import { describe, expect, it } from "vitest";
import { calculateChart } from "./astronomy";
import { buildDualFrameEvidence } from "./genesisPatternReport";

const dallasBirth = {
  location: "Dallas, Texas, USA",
  latitude: 32.7767,
  longitude: -96.797,
  timezone: "America/Chicago",
  date: "1986-11-20",
  time: "10:06",
  readingScope: "natal" as const,
};

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
