export type PatternFrame = "God View" | "Agent View";
export type PatternFamily = "western" | "vedic-kp" | "cross-system";

export type PatternFinding = {
  id: string;
  family: PatternFamily;
  name: string;
  strength: number;
  evidence: string[];
  meaning: string;
  relevance: string;
};

export type FramePatternAnalysis = {
  frame: PatternFrame;
  findings: PatternFinding[];
  themes: string[];
  strongestPlanets: string[];
  summary: string;
};

export type PatternRecognitionReport = {
  version: "GENESIS_PATTERN_ENGINE_V1";
  question: string;
  godView: FramePatternAnalysis;
  agentView: FramePatternAnalysis;
  agentViewAvailable: boolean;
  convergence: {
    state: "convergent" | "counterforce" | "mixed" | "unavailable";
    sharedThemes: string[];
    explanation: string;
  };
  plainLanguage: string;
  limitations: string[];
};

type Planet = {
  planet: string;
  tropicalLongitude: number;
  fixedBackgroundLongitude: number;
  house: number;
  sign: string;
  degreeInHouse: number;
  nakshatra: string;
  starLord?: string;
  subLord?: string;
  isRetrograde: boolean;
};

type Chart = {
  planets: Planet[];
  houses: Array<{ house: number; cluster: string; sign: string; starLord: string; subLord: string }>;
};

const WESTERN_MEANINGS: Record<string, string> = {
  conjunction: "fusion and concentration: the two planetary functions act as one force",
  opposition: "polarization and a need to integrate two competing directions",
  square: "friction, pressure, and a demand for active resolution",
  trine: "ease, talent, and a tendency to rely on an already-open channel",
  sextile: "available opportunity that still requires deliberate activation",
  stellium: "intense focus and concentration in one sign or life area",
  angular: "high visibility and stronger ability to manifest through action",
  retrograde: "review, delay, reversal, or an inward-turning expression of the planet",
  quincunx: "a mismatch that asks for adjustment because the two functions do not naturally share a rhythm",
};

const VEDIC_MEANINGS: Record<string, string> = {
  nakshatra: "the lunar-mansion field gives the placement a specific motive, rhythm, and behavioral texture",
  subLord: "the KP Sub-Lord acts as a decision filter for which houses and outcomes become relevant",
  upachaya: "houses 3, 6, 10, and 11 emphasize effort, competition, improvement, work, and gains",
  dusthana: "houses 6, 8, and 12 mark friction, vulnerability, transformation, or hidden cost",
  node: "Rahu/Ketu intensify, distort, detach, or redirect the ordinary house storyline",
};

function angleDifference(a: number, b: number) {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function round(value: number) {
  return Number(value.toFixed(2));
}

function addFinding(findings: PatternFinding[], finding: PatternFinding) {
  findings.push({ ...finding, strength: round(Math.max(0, Math.min(1, finding.strength))) });
}

function analyzeWestern(frame: PatternFrame, chart: Chart): PatternFinding[] {
  const findings: PatternFinding[] = [];
  const planets = chart.planets;

  for (let i = 0; i < planets.length; i += 1) {
    for (let j = i + 1; j < planets.length; j += 1) {
      const first = planets[i]!;
      const second = planets[j]!;
      const distance = angleDifference(first.fixedBackgroundLongitude, second.fixedBackgroundLongitude);
      const aspects = [
        [0, 8, "conjunction"],
        [60, 5, "sextile"],
        [90, 6, "square"],
        [120, 6, "trine"],
        [150, 3, "quincunx"],
        [180, 8, "opposition"],
      ] as const;
      const aspect = aspects.find(([angle, orb]) => Math.abs(distance - angle) <= orb);
      if (!aspect) continue;
      const [angle, orb, type] = aspect;
      const strength = 1 - Math.abs(distance - angle) / orb;
      addFinding(findings, {
        id: `western-aspect-${first.planet}-${second.planet}-${type}`,
        family: "western",
        name: `${first.planet} ${type} ${second.planet}`,
        strength,
        evidence: [`${round(distance)}° separation`, `${round(Math.abs(distance - angle))}° orb`, frame],
        meaning: WESTERN_MEANINGS[type],
        relevance: `This links ${first.sign}/H${first.house} with ${second.sign}/H${second.house}.`,
      });
    }
  }

  const bySign = new Map<string, Planet[]>();
  planets.forEach((planet) => bySign.set(planet.sign, [...(bySign.get(planet.sign) ?? []), planet]));
  bySign.forEach((members, sign) => {
    if (members.length >= 3) {
      addFinding(findings, {
        id: `western-stellium-sign-${sign}`,
        family: "western",
        name: `Stellium in ${sign}`,
        strength: Math.min(1, members.length / 5),
        evidence: [members.map((planet) => planet.planet).join(", "), `${members.length} planets in one sign`],
        meaning: WESTERN_MEANINGS.stellium,
        relevance: `The concentration centers on houses ${unique(members.map((planet) => planet.house)).join(", ")}.`,
      });
    }
  });

  const byHouse = new Map<number, Planet[]>();
  planets.forEach((planet) => byHouse.set(planet.house, [...(byHouse.get(planet.house) ?? []), planet]));
  byHouse.forEach((members, house) => {
    if (members.length >= 2 || [1, 4, 7, 10].includes(house)) {
      const strength = Math.min(1, (members.length / 4) + ([1, 4, 7, 10].includes(house) ? 0.35 : 0));
      addFinding(findings, {
        id: `western-house-${house}`,
        family: "western",
        name: `House ${house} emphasis`,
        strength,
        evidence: [`${members.map((planet) => planet.planet).join(", ") || "No planets"}`, [1, 4, 7, 10].includes(house) ? "angular house" : "occupied house"],
        meaning: [1, 4, 7, 10].includes(house) ? WESTERN_MEANINGS.angular : "the occupied house becomes a concrete arena for the event",
        relevance: `The chart concentrates attention in H${house}.`,
      });
    }
  });

  for (const planet of planets.filter((item) => item.isRetrograde)) {
    addFinding(findings, {
      id: `western-retrograde-${planet.planet}`,
      family: "western",
      name: `${planet.planet} retrograde`,
      strength: 0.62,
      evidence: [`${planet.planet} in ${planet.sign}`, `H${planet.house}`],
      meaning: WESTERN_MEANINGS.retrograde,
      relevance: `The ${planet.planet} storyline may not express in a straight line.`,
    });
  }

  return findings;
}

function analyzeVedic(frame: PatternFrame, chart: Chart): PatternFinding[] {
  const findings: PatternFinding[] = [];
  const planets = chart.planets;
  const byNakshatra = new Map<string, Planet[]>();
  const bySubLord = new Map<string, Planet[]>();

  planets.forEach((planet) => {
    byNakshatra.set(planet.nakshatra, [...(byNakshatra.get(planet.nakshatra) ?? []), planet]);
    if (planet.subLord) {
      bySubLord.set(planet.subLord, [...(bySubLord.get(planet.subLord) ?? []), planet]);
    }
  });

  byNakshatra.forEach((members, nakshatra) => {
    if (members.length >= 2) {
      addFinding(findings, {
        id: `vedic-nakshatra-${nakshatra}`,
        family: "vedic-kp",
        name: `${nakshatra} concentration`,
        strength: Math.min(1, 0.45 + members.length * 0.14),
        evidence: [members.map((planet) => planet.planet).join(", "), `${members.length} placements share the mansion`],
        meaning: VEDIC_MEANINGS.nakshatra,
        relevance: `The shared mansion creates a repeated Vedic motif in this ${frame} frame.`,
      });
    }
  });

  bySubLord.forEach((members, subLord) => {
    if (members.length >= 2) {
      addFinding(findings, {
        id: `vedic-sublord-${subLord}`,
        family: "vedic-kp",
        name: `${subLord} Sub-Lord repetition`,
        strength: Math.min(1, 0.5 + members.length * 0.12),
        evidence: [members.map((planet) => planet.planet).join(", "), `${members.length} placements resolve through ${subLord}`],
        meaning: VEDIC_MEANINGS.subLord,
        relevance: `The repeated Sub-Lord makes ${subLord} a candidate for the chart's controlling interpretive thread.`,
      });
    }
  });

  const upachaya = planets.filter((planet) => [3, 6, 10, 11].includes(planet.house));
  if (upachaya.length >= 2) {
    addFinding(findings, {
      id: "vedic-upachaya-cluster",
      family: "vedic-kp",
      name: "Upachaya emphasis",
      strength: Math.min(1, 0.45 + upachaya.length * 0.1),
      evidence: [upachaya.map((planet) => `${planet.planet}/H${planet.house}`).join(", "), "H3/H6/H10/H11 activity"],
      meaning: VEDIC_MEANINGS.upachaya,
      relevance: "This favors patterns that develop through effort, pressure, work, and competitive response.",
    });
  }

  const dusthana = planets.filter((planet) => [6, 8, 12].includes(planet.house));
  if (dusthana.length >= 2) {
    addFinding(findings, {
      id: "vedic-dusthana-cluster",
      family: "vedic-kp",
      name: "Dusthana emphasis",
      strength: Math.min(1, 0.4 + dusthana.length * 0.12),
      evidence: [dusthana.map((planet) => `${planet.planet}/H${planet.house}`).join(", "), "H6/H8/H12 activity"],
      meaning: VEDIC_MEANINGS.dusthana,
      relevance: "The chart carries friction, hidden cost, transformation, or recovery themes that should temper a simple call.",
    });
  }

  for (const node of planets.filter((planet) => planet.planet === "Rahu" || planet.planet === "Ketu")) {
    addFinding(findings, {
      id: `vedic-node-${node.planet}`,
      family: "vedic-kp",
      name: `${node.planet} house activation`,
      strength: 0.58,
      evidence: [`${node.planet} in ${node.sign}`, `H${node.house}`, `${node.nakshatra} / ${node.subLord}`],
      meaning: VEDIC_MEANINGS.node,
      relevance: "The node placement can amplify or redirect the ordinary reading of its house and mansion.",
    });
  }

  return findings;
}

function themesFor(findings: PatternFinding[]) {
  const themes: string[] = [];
  const add = (theme: string) => { if (!themes.includes(theme)) themes.push(theme); };
  findings.forEach((finding) => {
    const text = `${finding.name} ${finding.meaning}`.toLowerCase();
    if (text.includes("pressure") || text.includes("friction") || text.includes("opposition")) add("pressure / conflict");
    if (text.includes("ease") || text.includes("opportunity") || text.includes("talent")) add("flow / opportunity");
    if (text.includes("focus") || text.includes("concentration")) add("concentration / focus");
    if (text.includes("effort") || text.includes("competition") || text.includes("gains")) add("effort / competitive development");
    if (text.includes("hidden") || text.includes("transformation") || text.includes("redirect")) add("transformation / hidden variables");
    if (text.includes("retrograde") || text.includes("review")) add("review / reversal");
  });
  return themes.slice(0, 5);
}

function analyzeFrame(frame: PatternFrame, chart: Chart): FramePatternAnalysis {
  const findings = [...analyzeWestern(frame, chart), ...analyzeVedic(frame, chart)]
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 12);
  const themes = themesFor(findings);
  const strongestPlanets = chart.planets
    .map((planet) => ({ planet: planet.planet, score: (planet.isRetrograde ? 0.1 : 0) + ([1, 4, 7, 10].includes(planet.house) ? 0.25 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.planet);
  return {
    frame,
    findings,
    themes,
    strongestPlanets,
    summary: findings.length
      ? `${frame} is led by ${findings.slice(0, 3).map((finding) => finding.name).join(", ")}. The strongest repeated themes are ${themes.join(", ") || "not yet classified"}.`
      : `${frame} did not produce a strong pattern signature under the current Genesis rules.`,
  };
}

export function buildPatternRecognitionReport(input: {
  godView: Chart;
  agentView: Chart | null;
  question?: string;
}): PatternRecognitionReport {
  const godView = analyzeFrame("God View", input.godView);
  const agentViewAvailable = input.agentView !== null;
  const agentView: FramePatternAnalysis = input.agentView
    ? analyzeFrame("Agent View", input.agentView)
    : {
        frame: "Agent View",
        findings: [],
        themes: [],
        strongestPlanets: [],
        summary: "Agent View is unavailable because this chart does not have the exact birth time and location required to calculate personal houses.",
      };
  const sharedThemes = godView.themes.filter((theme) => agentView.themes.includes(theme));
  const godTop = godView.findings.slice(0, 3).map((finding) => finding.name);
  const agentTop = agentView.findings.slice(0, 3).map((finding) => finding.name);
  const state = !agentViewAvailable ? "unavailable" : sharedThemes.length >= 2 ? "convergent" : sharedThemes.length === 0 ? "counterforce" : "mixed";
  const explanation = state === "unavailable"
    ? "Only the fixed God frame is available; no God/Agent comparison or convergence claim is made without personal-house data."
    : state === "convergent"
    ? `Both frames repeat ${sharedThemes.join(" and ")}; AgentView appears to localize rather than overturn the fixed-field pattern.`
    : state === "counterforce"
      ? "The fixed field and local frame do not share a dominant theme, so the interpretation should retain counterforce instead of forcing agreement."
      : `The frames share ${sharedThemes.join(" and ")}, but each also emphasizes different signatures (${godTop.join(", ")} versus ${agentTop.join(", ")}).`;
  const question = input.question?.trim() || "Which patterns are strongest in this event?";
  return {
    version: "GENESIS_PATTERN_ENGINE_V1",
    question,
    godView,
    agentView,
    agentViewAvailable,
    convergence: { state, sharedThemes, explanation },
    plainLanguage: `${explanation} In plain terms, the chart should be read through ${[...sharedThemes, ...godView.themes, ...agentView.themes].filter((theme, index, list) => list.indexOf(theme) === index).slice(0, 4).join(", ") || "the strongest returned placements"}. This report identifies patterns from calculated chart facts; it is an interpretive aid, not a certainty claim.`,
    limitations: [
      "Pattern meanings are the deterministic Genesis interpretation scaffold; the natal chapter writer receives the findings as structured evidence.",
      "Western and Vedic/KP findings are shown separately before cross-frame synthesis.",
      "No KP star lord or sub-lord is inferred when the chart calculator has not supplied one.",
      ...(!agentViewAvailable ? ["The Agent frame is unavailable for this chart, so no cross-frame conclusion is claimed."] : []),
    ],
  };
}
