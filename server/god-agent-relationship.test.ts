import { describe, expect, it } from "vitest";
import { buildFrameRelationship } from "./astrologyCore";
import { calculateChart } from "./astronomy";

describe("God's View of the Agent relationship layer", () => {
  it("classifies matching frames as convergence", () => {
    expect(buildFrameRelationship(8, 8)).toMatchObject({ type: "convergence" });
  });

  it("classifies an opposite axis as tension without changing the sky", () => {
    const relationship = buildFrameRelationship(8, 2);
    expect(relationship.type).toBe("tension");
    expect(relationship.tension).toContain("face one another across an axis");
  });

  it("classifies a private Agent channel as concealment", () => {
    expect(buildFrameRelationship(3, 12)).toMatchObject({ type: "concealment" });
  });

  it("keeps one longitude while exposing both house assignments", async () => {
    const result = await calculateChart({
      location: "Dallas, Texas, USA",
      latitude: 32.7767,
      longitude: -96.797,
      timezone: "America/Chicago",
      date: "1986-11-20",
      time: "10:06",
      worldview: "agent-vs-god",
      readingScope: "natal",
    });
    const sun = result.movingBodies.find(row => row.name === "Sun")!;
    const paired = result.godPlacements.find(row => row.name === "Sun")!;
    expect(sun.longitude).toBe(paired.longitude);
    expect(sun.godHouse).toBeDefined();
    expect(sun.agentHouse).toBeDefined();
    expect(sun.frameRelationship?.translation).toBeTruthy();
    expect(paired.frameRelationship?.type).toBe(sun.frameRelationship?.type);
  });

  it("keeps the existing location responsibilities explicit", async () => {
    const base = {
      location: "Dallas, Texas, USA",
      latitude: 32.7767,
      longitude: -96.797,
      timezone: "America/Chicago",
      date: "1986-11-20",
      time: "10:06",
      transitDate: "2025-01-15",
      transitTime: "14:30",
      worldview: "agent-vs-god" as const,
      readingScope: "combined" as const,
    };
    const newYork = await calculateChart({ ...base, transitLocation: "New York", transitLatitude: 40.7128, transitLongitude: -74.006, transitTimezone: "America/New_York" });
    const tokyo = await calculateChart({ ...base, transitLocation: "Tokyo", transitLatitude: 35.6762, transitLongitude: 139.6503, transitTimezone: "Asia/Tokyo" });
    const nyJupiter = newYork.transits.find(row => row.name === "Jupiter")!;
    const tokyoJupiter = tokyo.transits.find(row => row.name === "Jupiter")!;
    expect(nyJupiter.agentHouse).toBeDefined();
    expect(tokyoJupiter.agentHouse).toBeDefined();
    expect(newYork.input.transitLocation).toBe("New York");
    expect(tokyo.input.transitLocation).toBe("Tokyo");
  });
});
