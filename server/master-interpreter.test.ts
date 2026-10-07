import { beforeEach, describe, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM: mocked.invokeLLM }));

import { askHost } from "./host";
import { followUp, generateChapter, generateInterpretation } from "./interpretation";
import { calculateChart } from "./astronomy";
import { buildDualFrameEvidence } from "./genesisPatternReport";
import type { ChartResult } from "./astronomy";
import { ASTROLOGY_INTERPRETATION_ADAPTER, MASTER_INTERPRETER_PROMPT } from "./master-interpreter";

const chart = {
  input: { location: "Synthetic Test City", date: "1990-01-01", time: "12:00", timezone: "UTC" },
  utc: "1990-01-01T12:00:00.000Z",
  julianDay: 2447893,
  ascendant: { display: "Libra 12°00′" },
  descendant: { display: "Aries 12°00′" },
  northNode: { display: "Aquarius 4°00′", house: 5 },
  southNode: { display: "Leo 4°00′", house: 11 },
  houses: [],
  movingBodies: [],
  frozenStars: [],
  transitDate: "2025-01-01T12:00:00.000Z",
  transits: [],
  validation: [],
} as unknown as ChartResult;

function systemPromptFromLastCall() {
  const request = mocked.invokeLLM.mock.calls.at(-1)?.[0] as { messages: Array<{ role: string; content: string }> };
  return request.messages.find(message => message.role === "system")?.content ?? "";
}

beforeEach(() => {
  mocked.invokeLLM.mockReset();
  mocked.invokeLLM.mockResolvedValue({
    choices: [{ message: { role: "assistant", content: "A concise synthetic interpretation response." } }],
  });
});

describe("Master Interpreter prompt coverage", () => {
  it("keeps the full supplied operating instructions and astrology-only source-of-truth adapter", () => {
    expect(MASTER_INTERPRETER_PROMPT.split(/\s+/).length).toBeGreaterThan(3000);
    expect(MASTER_INTERPRETER_PROMPT).toContain("XVII. DECISIVE DELIVERY");
    expect(MASTER_INTERPRETER_PROMPT).toContain("KNOWLEDGE IS THE MATERIAL.");
    expect(MASTER_INTERPRETER_PROMPT).toContain("UNDERSTANDING IS THE RESULT.");
    expect(MASTER_INTERPRETER_PROMPT).not.toContain("The next thing I'd build");
    expect(ASTROLOGY_INTERPRETATION_ADAPTER).toContain("calculation engine and the supplied chart evidence are the sole source of chart facts");
  });

  it("writes chapters from a distilled prompt, the evidence sheet, and the reading plan", async () => {
    const analysis = JSON.stringify({
      threads: [{ title: "Test thread", insight: "A synthetic insight.", evidence: ["Sun — Aries 1°"], chapters: ["identity"] }],
      tensions: [],
      chapters: { identity: { angle: "A synthetic angle.", evidence: ["Sun — Aries 1°"] } },
    });
    await generateChapter(chart, "natal", "synthetic chart intelligence", "identity", [], analysis);
    const request = mocked.invokeLLM.mock.calls.at(-1)?.[0] as { messages: Array<{ role: string; content: string }> };
    const system = systemPromptFromLastCall();
    const user = request.messages.find(message => message.role === "user")?.content ?? "";
    expect(system).not.toContain(MASTER_INTERPRETER_PROMPT);
    expect(system).toContain("FACTS");
    expect(system).toContain(ASTROLOGY_INTERPRETATION_ADAPTER);
    expect(system).toContain("VOICE");
    expect(system.indexOf("VOICE (this governs how everything above sounds")).toBeGreaterThan(system.lastIndexOf("\nMETHOD\n"));
    expect(system.split(/\s+/).length).toBeLessThan(900);
    expect(user).toContain("CHART EVIDENCE SHEET");
    expect(user).toContain("INTERNAL GENESIS KNOWLEDGE");
    expect(user).toContain("READING PLAN");
    expect(user).toContain("Test thread");
  });

  it("passes calculated God/Agent house meanings and Genesis rule findings into the real natal chapter prompt", async () => {
    const natal = await calculateChart({
      location: "Dallas, Texas, USA",
      latitude: 32.7767,
      longitude: -96.797,
      timezone: "America/Chicago",
      date: "1986-11-20",
      time: "10:06",
      worldview: "agent-vs-god",
      readingScope: "natal",
    });
    const sun = buildDualFrameEvidence(natal).find((row) => row.name === "Sun");
    expect(sun?.agentView.available).toBe(true);
    if (!sun || !sun.agentView.available) throw new Error("The fixture should have both natal house frames.");

    await generateChapter(natal, "natal", "", "identity", [], "");
    const request = mocked.invokeLLM.mock.calls.at(-1)?.[0] as { messages: Array<{ role: string; content: string }> };
    const user = request.messages.find((message) => message.role === "user")?.content ?? "";

    expect(user).toContain("INTERNAL GENESIS KNOWLEDGE");
    expect(user).toContain(`God View: House ${sun.godView.house} (${sun.godView.label}; ${sun.godView.themes.join(", ")})`);
    expect(user).toContain(`Agent View: House ${sun.agentView.house} (${sun.agentView.label}; ${sun.agentView.themes.join(", ")})`);
    expect(sun.relationship).not.toBeNull();
    if (!sun.relationship) throw new Error("The natal fixture should have a calculated God/Agent relationship.");
    expect(user).toContain(sun.relationship.translation);
    expect(user).toContain(sun.relationship.synthesis);
    const natalFindings = [
      ...natal.patternRecognition!.godView.findings.slice(0, 5),
      ...natal.patternRecognition!.agentView.findings.slice(0, 5),
    ];
    expect(natalFindings.length).toBeGreaterThan(0);
    for (const finding of natalFindings) expect(user).toContain(finding.meaning);
    expect(systemPromptFromLastCall()).toContain("Genesis is internal astrology knowledge");
  });

  it("applies a decisive, direct voice to planning, natal/transit/combined chapters, Mirror, and follow-ups", async () => {
    const natal = await calculateChart({
      location: "Dallas, Texas, USA",
      latitude: 32.7767,
      longitude: -96.797,
      timezone: "America/Chicago",
      date: "1986-11-20",
      time: "10:06",
      worldview: "agent-vs-god",
      readingScope: "natal",
    });

    await generateInterpretation(natal, "natal");
    let system = systemPromptFromLastCall();
    expect(system).toContain("AUTHORITATIVE, DECISIVE VOICE");
    expect(system).toContain("direct, authoritative language");
    expect(system).not.toContain("Write insights as hypotheses");

    for (const mode of ["natal", "transit", "combined"] as const) {
      await generateChapter(natal, mode, "", "identity", [], "");
      system = systemPromptFromLastCall();
      expect(system).toContain("AUTHORITATIVE, DECISIVE VOICE");
      expect(system).toContain("direct, declarative present-tense language");
      expect(system).not.toContain("Use conditional language");
      expect(system).not.toContain("Psychological readings are hypotheses");
    }

    await generateChapter(natal, "natal", "", "mirror", [], "");
    expect(systemPromptFromLastCall()).toContain("direct, declarative present-tense language");

    await followUp(natal, { intelligence: "synthetic", reading: "synthetic" }, [], "What does this mean?", "combined");
    system = systemPromptFromLastCall();
    expect(system).toContain("FOLLOW-UP VOICE AND METHOD");
    expect(system).toContain("Lead with the clearest chart-supported answer");
    expect(system).not.toContain("conditional hypotheses to test");
  });

  it("attaches the Master Interpreter to chart-anchored interpretive follow-ups", async () => {
    await followUp(chart, { intelligence: "synthetic", reading: "synthetic" }, [], "What does this pattern mean?", "combined");
    expect(systemPromptFromLastCall()).toContain(MASTER_INTERPRETER_PROMPT);
    expect(systemPromptFromLastCall()).toContain(ASTROLOGY_INTERPRETATION_ADAPTER);
  });

  it("attaches the Master Interpreter to model-backed Host responses", async () => {
    await askHost([], "What might a supplied Saturn placement mean in relationships?");
    expect(systemPromptFromLastCall()).toContain(MASTER_INTERPRETER_PROMPT);
    expect(systemPromptFromLastCall()).toContain(ASTROLOGY_INTERPRETATION_ADAPTER);
    expect(systemPromptFromLastCall()).toContain("product host for this exact engine");
  });
});
