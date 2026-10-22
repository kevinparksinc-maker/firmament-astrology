import type { ChartResult, ChartRow } from "../../astronomy";
import { angularDistance } from "../../astrologyCore";
import { normalizeLongitude, ZODIAC_SIGNS } from "../../../shared/hybrid";
import type { EvidenceItem } from "../types";
import {
  BEHAVIORAL_POLARITY_AXES,
  COMPACT_PATTERN_INDEX,
  DO_NOT_CLAIM_RESTRICTIONS,
  EVENT_SEQUENCE_CHAINS,
  HOUSE_AXIS_DYNAMICS,
  HUMAN_BEHAVIOR_PATTERNS,
  LIFE_EVENT_PATTERNS,
  PLANET_INTERACTION_MATRIX,
  type BehavioralDomain,
  type ResponseStyle,
} from "./catalog";

export type BehavioralConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type BehavioralConfidenceLabel =
  | "Level 1 — Possible"
  | "Level 2 — Supported"
  | "Level 3 — Strong"
  | "Level 4 — Dominant"
  | "Level 5 — Structural";

export type BehavioralState =
  | "baseline"
  | "activated"
  | "suppressed"
  | "emerging"
  | "integrated"
  | "crisis";

export type EvidenceChannelHit = {
  channel:
    | "planet"
    | "sign"
    | "house"
    | "aspect"
    | "angularity"
    | "repetition"
    | "development"
    | "god-agent"
    | "overlay";
  detail: string;
};

export type EvaluatedBehaviorPattern = {
  id: string;
  codeNumber: number;
  name: string;
  domain: BehavioralDomain;
  domainLabel: string;
  confidenceLevel: BehavioralConfidenceLevel;
  confidenceLabel: BehavioralConfidenceLabel;
  languagePrefix: string;
  state: BehavioralState;
  questionRelevance: number;
  score: number;
  definition: string;
  observableExpressions: string[];
  constructiveExpression: string;
  shadowExpression: string;
  consciousExpression: string;
  automaticExpression: string;
  internalExpression: string;
  externalExpression: string;
  motivationPatterns: string[];
  triggerPatterns: string[];
  responseStyle: ResponseStyle;
  repeatingCycle: string;
  compensationPattern: string;
  developmentalTrajectory: {
    early: string;
    developing: string;
    mature: string;
  };
  godToAgentSynthesis: string;
  supportingEvidence: EvidenceChannelHit[];
  counterEvidence: string[];
  aiLanguageRule: string;
};

export type EvaluatedPolarityAxis = {
  id: string;
  leftPole: string;
  rightPole: string;
  leftScore: number;
  rightScore: number;
  isDynamicTension: boolean;
  dominantSide: "left" | "right" | "balanced-tension";
  leftEvidence: string[];
  rightEvidence: string[];
  synthesis: string;
};

export type EventConfidenceCode = "E1" | "E2" | "E3" | "E4" | "E5";
export type EventTemporalState =
  | "State 1 — Latent (Natal Promise)"
  | "State 2 — Approaching"
  | "State 3 — Activating"
  | "State 4 — Manifesting"
  | "State 5 — Peak Convergence"
  | "State 6 — Integrating"
  | "State 8 — Consolidating";

export type EvaluatedLifeEventPattern = {
  id: string;
  codeNumber: number;
  name: string;
  category: string;
  categoryLabel: string;
  confidenceCode: EventConfidenceCode;
  confidenceLabel: string;
  temporalState: EventTemporalState;
  questionRelevance: number;
  score: number;
  definition: string;
  possibleManifestations: string[];
  alternativeManifestations: string[];
  supportingEvidence: string[];
  counterEvidence: string[];
  godToAgentTranslation: string;
  developmentalMeaning: string;
  sequencePredecessors: string[];
  sequenceSuccessors: string[];
  aiLanguageRule: string;
};

export type EvaluatedSequenceChain = {
  id: string;
  name: string;
  activeStages: string[];
  supportingEvidence: string[];
  narrative: string;
  developmentalMeaning: string;
  strength: number;
};

export type EvaluatedPlanetInteraction = {
  pair: string;
  aspect: string;
  orb: number;
  coreTheme: string;
  constructive: string;
  shadow: string;
  behavioralMechanism: string;
};

export type SelfKnowledgeDimensionItem = {
  id: string;
  question: string;
  synthesis: string;
  astrologicalProof: string[];
  counterEvidence: string[];
  reflectiveQuestions: string[];
  confidenceLabel: string | null;
  evidenceStatus: "supported" | "no-supported-signal";
  matchedPatternId?: string;
};

export type BehavioralIntelligenceReport = {
  question: string;
  mode: "natal" | "transit" | "combined";
  evaluatedAt: string;
  allAboutYouProfile: SelfKnowledgeDimensionItem[];
  dominantBehaviors: EvaluatedBehaviorPattern[];
  polarityAxes: EvaluatedPolarityAxis[];
  activeContradictions: EvaluatedPolarityAxis[];
  activeLifeEvents: EvaluatedLifeEventPattern[];
  eventSequences: EvaluatedSequenceChain[];
  planetInteractions: EvaluatedPlanetInteraction[];
  activeHouseAxes: Array<{
    name: string;
    theme: string;
    narrative: string;
    evidence: string[];
  }>;
  matchedVocabularyTags: Array<{
    code: number;
    domain: string;
    name: string;
    evidence: string;
  }>;
  doNotClaimRestrictions: readonly string[];
};

type SelfKnowledgeDimensionSpec = {
  id: string;
  question: string;
  domains: string[];
  kind?: "polarity" | "event";
  allDomains?: boolean;
};

const SELF_KNOWLEDGE_DIMENSIONS: SelfKnowledgeDimensionSpec[] = [
  { id: "who-you-are", question: "Who are you beyond the roles you carry?", domains: ["identity", "self-worth", "positive-capacities"] },
  { id: "how-you-think", question: "How do you process information and make meaning?", domains: ["thinking", "communication", "perception", "learning"] },
  { id: "how-you-feel", question: "What chart-supported patterns relate to feeling and recovery?", domains: ["emotional", "adaptation-shadow"] },
  { id: "what-motivates-you", question: "What motives are most supported by this chart?", domains: ["motivation", "work", "money"] },
  { id: "how-you-respond-to-pressure", question: "What response patterns may activate under pressure?", domains: ["conflict-action", "decision-making", "authority-power"] },
  { id: "what-strengthens-you", question: "Which capacities are most supported by the evidence?", domains: ["positive-capacities", "learning", "work"] },
  { id: "what-weakens-you", question: "Where could a supported pattern become costly?", domains: ["adaptation-shadow", "risk-reward", "self-worth", "decision-making"] },
  { id: "what-triggers-you", question: "What conditions could activate an automatic response?", domains: ["conflict-action", "emotional", "social", "authority-power"] },
  { id: "how-you-protect-yourself", question: "What protective responses does the chart suggest you might use?", domains: ["adaptation-shadow", "attachment-boundaries", "self-worth"] },
  { id: "how-you-relate-to-others", question: "What relational patterns are supported here?", domains: ["relationships", "attachment-boundaries", "social"] },
  { id: "where-you-self-sabotage", question: "Which supported loop could work against your own goals?", domains: ["decision-making", "risk-reward", "adaptation-shadow", "work"] },
  { id: "what-patterns-repeat", question: "What repeating response loop is suggested—not proven—by the chart?", domains: [], allDomains: true },
  { id: "what-contradictions-exist", question: "What real tensions are evidenced between two needs or tendencies?", domains: [], kind: "polarity" },
  { id: "what-life-themes-recur", question: "What timing themes meet this engine's event-evidence threshold?", domains: [], kind: "event" },
  { id: "how-patterns-develop", question: "How could a supported pattern mature over time?", domains: ["adaptation-shadow", "learning", "positive-capacities"] },
  { id: "conscious-integration", question: "What constructive alternative is named for the supported pattern?", domains: ["positive-capacities", "adaptation-shadow", "identity"] },
];

function reflectionQuestions(
  question: string,
  pattern?: EvaluatedBehaviorPattern
): string[] {
  if (!pattern) {
    return [
      `Think of one recent situation relevant to “${question}.” What happened, and what did you feel or need?`,
      "What did you do next, what did that response help with in the moment, and what happened afterward?",
      "What concrete counterexample would show that a broad interpretation of this area does not fit you?",
    ];
  }
  const trigger = pattern.triggerPatterns[0] ?? "the conditions described by this pattern";
  return [
    `In a recent situation involving “${trigger},” what was the first sign in your body, thoughts, or urge to act?`,
    `What did you do next? What did that response provide or protect in the short term, and what—if anything—did it cost later?`,
    "Can you recall a counterexample where the trigger appeared but you chose a different response? What made that possible?",
  ];
}

export function buildSelfKnowledgeProfile(
  patterns: EvaluatedBehaviorPattern[],
  axes: EvaluatedPolarityAxis[],
  events: EvaluatedLifeEventPattern[]
): SelfKnowledgeDimensionItem[] {
  const evidenceQualifiedPatterns = patterns.filter(
    candidate =>
      candidate.confidenceLevel >= 3 &&
      candidate.supportingEvidence.length >= 2
  );
  return SELF_KNOWLEDGE_DIMENSIONS.map(spec => {
    const pattern = spec.kind || spec.allDomains
      ? undefined
      : evidenceQualifiedPatterns.find(candidate =>
          spec.domains.includes(candidate.domain)
        );
    const repeatedPattern = spec.allDomains
      ? evidenceQualifiedPatterns[0]
      : undefined;
    const selectedPattern = pattern ?? repeatedPattern;
    const axis = spec.kind === "polarity"
      ? axes.find(candidate => candidate.leftEvidence.length > 0 && candidate.rightEvidence.length > 0)
      : undefined;
    const event = spec.kind === "event" ? events[0] : undefined;
    const astrologicalProof = selectedPattern
      ? selectedPattern.supportingEvidence.map(hit => `${hit.channel}: ${hit.detail}`)
      : axis
        ? [...axis.leftEvidence, ...axis.rightEvidence]
        : event?.supportingEvidence ?? [];
    const counterEvidence = selectedPattern?.counterEvidence ?? event?.counterEvidence ?? [];

    let synthesis: string;
    if (selectedPattern) {
      const evidenceSummary = astrologicalProof.slice(0, 5).join("; ");
      synthesis = `${selectedPattern.name} is the strongest relevant chart-pattern match for this question (${selectedPattern.confidenceLabel}; ${selectedPattern.supportingEvidence.length} support signals). The engine selected it from: ${evidenceSummary}. The pattern catalog describes it as: ${selectedPattern.definition} If that description fits your lived experience, possible triggers include ${selectedPattern.triggerPatterns.join(", ") || "the conditions described above"}. A possible automatic response is ${selectedPattern.automaticExpression}; its protective function may be ${selectedPattern.compensationPattern}, while a potential cost to watch for is ${selectedPattern.shadowExpression}. The catalog's constructive alternative is ${selectedPattern.consciousExpression}. This is a symbolic hypothesis to test—not a fact about your biography or a diagnosis.`;
    } else if (axis) {
      synthesis = `The chart contains evidence on both sides of this tension: ${axis.synthesis} Left-side signals: ${axis.leftEvidence.join("; ")}. Right-side signals: ${axis.rightEvidence.join("; ")}. This establishes a symbolic contrast to examine, not proof that both sides are equally strong in your daily life.`;
    } else if (event) {
      synthesis = `The event engine returned “${event.name}” (${event.confidenceLabel}; ${event.temporalState}) from: ${event.supportingEvidence.join("; ")}. Treat this as an astrological timing hypothesis, not a predicted event or a claim about what has happened in your life. Check it against concrete experience and the counter-signals below.`;
    } else {
      synthesis = "No chart-supported conclusion met the engine's evidence threshold for this question in the selected chart and mode. The report will not fill that gap with a generic personality claim. The prompts below start with your own experience; you decide whether any pattern fits.";
    }

    const evidenceStatus = astrologicalProof.length > 0 ? "supported" : "no-supported-signal";
    return {
      id: spec.id,
      question: spec.question,
      synthesis,
      astrologicalProof,
      counterEvidence,
      reflectiveQuestions: reflectionQuestions(spec.question, selectedPattern),
      confidenceLabel: selectedPattern?.confidenceLabel ?? event?.confidenceLabel ?? (axis ? "Evidence on both poles" : null),
      evidenceStatus,
      ...(selectedPattern ? { matchedPatternId: selectedPattern.id } : {}),
    };
  });
}

const TRADITIONAL_RULERS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const MUTABLE_SIGNS = new Set(["Gemini", "Virgo", "Sagittarius", "Pisces"]);
const ANGULAR_HOUSES = new Set([1, 4, 7, 10]);

function signOf(longitude: number): string {
  return ZODIAC_SIGNS[Math.floor(normalizeLongitude(longitude) / 30)] ?? "Aries";
}

type NatalAspect = {
  a: string;
  b: string;
  aspect: "conjunction" | "sextile" | "square" | "trine" | "opposition";
  orb: number;
};

function computeNatalAspects(bodies: ChartRow[], maxOrb = 5): NatalAspect[] {
  const aspects: NatalAspect[] = [];
  const targets: Array<[number, NatalAspect["aspect"]]> = [
    [0, "conjunction"],
    [60, "sextile"],
    [90, "square"],
    [120, "trine"],
    [180, "opposition"],
  ];
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const first = bodies[i]!;
      const second = bodies[j]!;
      const dist = angularDistance(first.longitude, second.longitude);
      const best = targets
        .map(([deg, aspect]) => ({ aspect, orb: Math.abs(dist - deg) }))
        .sort((x, y) => x.orb - y.orb)[0];
      if (best && best.orb <= maxOrb) {
        aspects.push({
          a: first.name,
          b: second.name,
          aspect: best.aspect,
          orb: Number(best.orb.toFixed(2)),
        });
      }
    }
  }
  return aspects;
}

function findAspect(
  aspects: NatalAspect[],
  p1: string,
  p2: string
): NatalAspect | undefined {
  return aspects.find(
    item =>
      (item.a === p1 && item.b === p2) || (item.a === p2 && item.b === p1)
  );
}

function confidenceFromChannels(
  channels: EvidenceChannelHit[],
  hasGodAgentBridge: boolean,
  hasOverlay: boolean,
  isVolatilityPattern: boolean,
  mutableCount: number
): {
  level: BehavioralConfidenceLevel;
  label: BehavioralConfidenceLabel;
  prefix: string;
} {
  const distinctTypes = new Set(channels.map(c => c.channel)).size;
  const totalHits = channels.length;

  let rawLevel: BehavioralConfidenceLevel = 1;
  if (totalHits >= 6 && distinctTypes >= 5 && (hasGodAgentBridge || hasOverlay)) {
    rawLevel = 5;
  } else if (totalHits >= 5 && distinctTypes >= 4) {
    rawLevel = 4;
  } else if (totalHits >= 3 && distinctTypes >= 3) {
    rawLevel = 3;
  } else if (totalHits >= 2) {
    rawLevel = 2;
  } else {
    rawLevel = 1;
  }

  // Enforce the Volatility Convergence Rule: do not assign high confidence from a single aspect
  if (isVolatilityPattern) {
    const hasAspect = channels.some(c => c.channel === "aspect");
    const hasAngular = channels.some(c => c.channel === "angularity");
    if ((!hasAspect || (!hasAngular && mutableCount < 3)) && rawLevel > 2) {
      rawLevel = 2;
    }
  }

  const map: Record<
    BehavioralConfidenceLevel,
    { label: BehavioralConfidenceLabel; prefix: string }
  > = {
    1: {
      label: "Level 1 — Possible",
      prefix: "May indicate",
    },
    2: {
      label: "Level 2 — Supported",
      prefix: "The chart supports",
    },
    3: {
      label: "Level 3 — Strong",
      prefix: "A recurring pattern suggests",
    },
    4: {
      label: "Level 4 — Dominant",
      prefix: "This is one of the strongest behavioral themes in the chart:",
    },
    5: {
      label: "Level 5 — Structural",
      prefix: "This theme appears structurally repeated across multiple chart systems:",
    },
  };

  return {
    level: rawLevel,
    label: map[rawLevel].label,
    prefix: map[rawLevel].prefix,
  };
}

function computeQuestionRelevance(question: string, keywords: string[]): number {
  const q = question.toLowerCase();
  if (!q.trim()) return 0.5;
  let hits = 0;
  for (const kw of keywords) {
    if (q.includes(kw.toLowerCase())) hits += 1;
  }
  return Math.min(1, 0.35 + hits * 0.22);
}

export function evaluateBehavioralIntelligence(
  chart: ChartResult,
  question = "",
  mode: "natal" | "transit" | "combined" = chart.readingScope
): BehavioralIntelligenceReport {
  const bodies = (chart.movingBodies ?? []).filter((b): b is ChartRow =>
    Boolean(b && typeof b.longitude === "number")
  );
  const transits = chart.transits ?? [];
  const frozenStars = chart.frozenStars ?? [];
  const allPoints = [
    ...bodies,
    ...(chart.ascendant ? [chart.ascendant] : []),
    ...(chart.midheaven ? [chart.midheaven] : []),
    ...(chart.northNode ? [chart.northNode] : []),
    ...(chart.southNode ? [chart.southNode] : []),
  ].filter((b): b is ChartRow => Boolean(b && typeof b.longitude === "number"));
  const natalAspects = computeNatalAspects(allPoints, 5);
  const bodyByName = new Map(allPoints.map(b => [b.name, b]));
  const mutableCount = bodies.filter(b =>
    MUTABLE_SIGNS.has(signOf(b.longitude))
  ).length;

  // 1. Evaluate Planet Interaction Matrix
  const planetInteractions: EvaluatedPlanetInteraction[] = [];
  for (const [key, meta] of Object.entries(PLANET_INTERACTION_MATRIX)) {
    const [p1, p2] = key.split("-");
    if (!p1 || !p2) continue;
    const found = findAspect(natalAspects, p1, p2);
    if (found) {
      planetInteractions.push({
        pair: key,
        aspect: found.aspect,
        orb: found.orb,
        ...meta,
      });
    }
  }

  // 2. Evaluate Human Behavior Patterns across the 7 Evidence Channels
  const evaluatedBehaviors: EvaluatedBehaviorPattern[] = [];

  for (const pattern of HUMAN_BEHAVIOR_PATTERNS) {
    const channels: EvidenceChannelHit[] = [];
    const counterEvidence: string[] = [];

    // Channel 1 & 2 & 3: Planet + Sign + House
    for (const pName of pattern.primaryPlanets) {
      const row = bodyByName.get(pName);
      if (!row) continue;
      const pSign = signOf(row.longitude);

      if (pattern.signs.includes(pSign)) {
        channels.push({
          channel: "sign",
          detail: `${row.name} in ${pSign} (${row.display})`,
        });
      }
      if (pattern.primaryHouses.includes(row.house)) {
        channels.push({
          channel: "house",
          detail: `${row.name} in House ${row.house} (${row.display})`,
        });
      } else if (pattern.secondaryHouses.includes(row.house)) {
        channels.push({
          channel: "planet",
          detail: `${row.name} active in secondary House ${row.house}`,
        });
      }
    }

    for (const pName of pattern.secondaryPlanets) {
      const row = bodyByName.get(pName);
      if (!row) continue;
      const pSign = signOf(row.longitude);
      if (
        pattern.primaryHouses.includes(row.house) &&
        pattern.signs.includes(pSign)
      ) {
        channels.push({
          channel: "planet",
          detail: `Supporting ${row.name} in ${pSign}, House ${row.house}`,
        });
      }
    }

    // Channel 4: Aspects (5° orb)
    for (const [p1, p2] of pattern.aspectPairs) {
      const hit = findAspect(natalAspects, p1, p2);
      if (hit) {
        channels.push({
          channel: "aspect",
          detail: `${hit.a} ${hit.aspect} ${hit.b} (${hit.orb.toFixed(1)}° orb)`,
        });
      }
    }

    // Channel 5: Angularity
    for (const pName of pattern.angularPlanets) {
      const row = bodyByName.get(pName);
      if (row && ANGULAR_HOUSES.has(row.house)) {
        channels.push({
          channel: "angularity",
          detail: `${row.name} angular in House ${row.house}`,
        });
      }
    }

    // God View ↔ Agent View Bridge
    let hasGodAgentBridge = false;
    const godAgentDetails: string[] = [];
    for (const pName of pattern.primaryPlanets) {
      const row = bodyByName.get(pName);
      if (!row || row.godHouse == null || row.agentHouse == null) continue;
      if (
        pattern.primaryHouses.includes(row.godHouse) ||
        pattern.primaryHouses.includes(row.agentHouse)
      ) {
        hasGodAgentBridge = true;
        if (row.godHouse !== row.agentHouse) {
          godAgentDetails.push(
            `${row.name} bridges God House ${row.godHouse} into local Agent House ${row.agentHouse}`
          );
        } else {
          godAgentDetails.push(
            `${row.name} aligns in House ${row.house} across both God View and Agent View`
          );
        }
      }
    }
    if (godAgentDetails.length > 0) {
      channels.push({
        channel: "god-agent",
        detail: godAgentDetails[0]!,
      });
    }

    // Overlay modifiers (Nakshatra, Manzil, Decan, Royal Stars)
    let hasOverlay = false;
    const primaryBody = bodyByName.get(pattern.primaryPlanets[0] ?? "Sun");
    if (primaryBody?.overlay) {
      hasOverlay = true;
      const royalContact = (primaryBody.royalStarContacts ?? []).find(
        c => c.contact
      );
      channels.push({
        channel: "overlay",
        detail: `${primaryBody.name} in ${primaryBody.overlay.nakshatra} (Pada ${primaryBody.overlay.pada}), ${primaryBody.overlay.manzil}, ${primaryBody.overlay.decan}${royalContact ? `, near Royal Star ${royalContact.name}` : ""}`,
      });
    }

    // Channel 6: Repetition rule (3+ independent indicators before overlay)
    const coreCount = channels.filter(c => c.channel !== "overlay").length;
    if (coreCount >= 3) {
      channels.push({
        channel: "repetition",
        detail: `Repeated across ${coreCount} independent chart factors (Repetition Rule active)`,
      });
    }

    // Channel 7: Developmental & Transit State
    let state: BehavioralState = "baseline";
    if (mode !== "natal" && transits.length > 0) {
      const transitHits = transits.flatMap(t =>
        (t.natalContacts ?? [])
          .filter(c => pattern.primaryPlanets.includes(c.natalName))
          .map(c => ({ transit: t.name, ...c }))
      );
      if (transitHits.length > 0) {
        const firstHit = transitHits[0]!;
        if (
          ["Pluto", "Uranus"].includes(firstHit.transit) &&
          ["square", "opposition", "conjunction"].includes(firstHit.aspect)
        ) {
          state = "crisis";
        } else if (firstHit.transit === "Saturn") {
          state = "suppressed";
        } else {
          state = "activated";
        }
        channels.push({
          channel: "development",
          detail: `Currently ${state} via Transit ${firstHit.transit} ${firstHit.aspect} natal ${firstHit.natalName} (${firstHit.orb.toFixed(1)}°)`,
        });
      }
    }

    // Evaluate Counter-Indicators
    if (pattern.counterIndicators.aspectPairs) {
      for (const [c1, c2] of pattern.counterIndicators.aspectPairs) {
        const hit = findAspect(natalAspects, c1, c2);
        if (hit) {
          counterEvidence.push(
            `${hit.a} ${hit.aspect} ${hit.b} (${hit.orb.toFixed(1)}°): ${pattern.counterIndicators.description}`
          );
        }
      }
    }
    if (pattern.counterIndicators.houses) {
      for (const h of pattern.counterIndicators.houses) {
        const inHouse = bodies.filter(b => b.house === h);
        if (inHouse.length >= 2) {
          counterEvidence.push(
            `${inHouse.map(b => b.name).join(", ")} in House ${h}: ${pattern.counterIndicators.description}`
          );
        }
      }
    }

    // Require at least 1 real astrological channel (excluding generic overlay)
    if (coreCount === 0) continue;

    const isVolatility = pattern.id === "emotional-volatility-reactivity";
    const conf = confidenceFromChannels(
      channels,
      hasGodAgentBridge,
      hasOverlay,
      isVolatility,
      mutableCount
    );
    const questionRelevance = computeQuestionRelevance(
      question,
      pattern.questionKeywords
    );
    const score = Number(
      (conf.level * 18 + coreCount * 4 + questionRelevance * 15).toFixed(1)
    );

    evaluatedBehaviors.push({
      id: pattern.id,
      codeNumber: pattern.codeNumber,
      name: pattern.name,
      domain: pattern.domain,
      domainLabel: pattern.domainLabel,
      confidenceLevel: conf.level,
      confidenceLabel: conf.label,
      languagePrefix: conf.prefix,
      state,
      questionRelevance,
      score,
      definition: pattern.definition,
      observableExpressions: pattern.observableExpressions,
      constructiveExpression: pattern.constructiveExpression,
      shadowExpression: pattern.shadowExpression,
      consciousExpression: pattern.consciousExpression,
      automaticExpression: pattern.automaticExpression,
      internalExpression: pattern.internalExpression,
      externalExpression: pattern.externalExpression,
      motivationPatterns: pattern.motivationPatterns,
      triggerPatterns: pattern.triggerPatterns,
      responseStyle: pattern.responseStyle,
      repeatingCycle: pattern.repeatingCycle,
      compensationPattern: pattern.compensationPattern,
      developmentalTrajectory: pattern.developmentalTrajectory,
      godToAgentSynthesis:
        godAgentDetails.length > 0
          ? `${godAgentDetails.join("; ")}. ${pattern.godToAgentTemplate}`
          : pattern.godToAgentTemplate,
      supportingEvidence: channels,
      counterEvidence,
      aiLanguageRule: pattern.aiLanguageRule,
    });
  }

  evaluatedBehaviors.sort((a, b) => b.score - a.score);

  // 3. Evaluate the 12 Behavioral Polarity Axes & Contradiction Engine
  const polarityAxes: EvaluatedPolarityAxis[] = BEHAVIORAL_POLARITY_AXES.map(
    axis => {
      const leftEvidence: string[] = [];
      const rightEvidence: string[] = [];

      for (const b of bodies) {
        const s = signOf(b.longitude);
        if (
          axis.leftIndicators.planets.includes(b.name) &&
          (axis.leftIndicators.signs.includes(s) ||
            axis.leftIndicators.houses.includes(b.house))
        ) {
          leftEvidence.push(`${b.name} in ${s} (House ${b.house})`);
        }
        if (
          axis.rightIndicators.planets.includes(b.name) &&
          (axis.rightIndicators.signs.includes(s) ||
            axis.rightIndicators.houses.includes(b.house))
        ) {
          rightEvidence.push(`${b.name} in ${s} (House ${b.house})`);
        }
      }

      for (const [p1, p2] of axis.leftIndicators.aspects) {
        const hit = findAspect(natalAspects, p1, p2);
        if (hit) leftEvidence.push(`${hit.a} ${hit.aspect} ${hit.b}`);
      }
      for (const [p1, p2] of axis.rightIndicators.aspects) {
        const hit = findAspect(natalAspects, p1, p2);
        if (hit) rightEvidence.push(`${hit.a} ${hit.aspect} ${hit.b}`);
      }

      const leftScore = Math.min(94, 28 + leftEvidence.length * 16);
      const rightScore = Math.min(94, 28 + rightEvidence.length * 16);
      const isDynamicTension =
        leftEvidence.length >= 2 &&
        rightEvidence.length >= 2 &&
        Math.abs(leftScore - rightScore) <= 24;

      const dominantSide: EvaluatedPolarityAxis["dominantSide"] =
        isDynamicTension
          ? "balanced-tension"
          : leftScore >= rightScore
            ? "left"
            : "right";

      return {
        id: axis.id,
        leftPole: axis.leftPole,
        rightPole: axis.rightPole,
        leftScore,
        rightScore,
        isDynamicTension,
        dominantSide,
        leftEvidence,
        rightEvidence,
        synthesis: isDynamicTension
          ? `ACTIVE POLARITY TENSION (${axis.leftPole} ↔ ${axis.rightPole}): ${axis.tensionSynthesis}`
          : leftScore > rightScore
            ? `Leans toward ${axis.leftPole} (${leftScore}) over ${axis.rightPole} (${rightScore}). ${axis.tensionSynthesis}`
            : `Leans toward ${axis.rightPole} (${rightScore}) over ${axis.leftPole} (${leftScore}). ${axis.tensionSynthesis}`,
      };
    }
  );

  const activeContradictions = polarityAxes.filter(a => a.isDynamicTension);

  // 4. Evaluate House-to-House Axis Dynamics
  const activeHouseAxes: BehavioralIntelligenceReport["activeHouseAxes"] = [];
  for (const item of HOUSE_AXIS_DYNAMICS) {
    const [h1, h2] = item.axis;
    const inH1 = bodies.filter(b => b.house === h1);
    const inH2 = bodies.filter(b => b.house === h2);
    if (inH1.length > 0 && inH2.length > 0) {
      activeHouseAxes.push({
        name: item.name,
        theme: item.theme,
        narrative: item.behavioralNarrative,
        evidence: [
          `House ${h1}: ${inH1.map(b => b.name).join(", ")}`,
          `House ${h2}: ${inH2.map(b => b.name).join(", ")}`,
        ],
      });
    }
  }

  // 5. Evaluate Life-Event & Situation Patterns
  const houseCusps = chart.houses ?? [];
  const houseRulerHouse = new Map<number, { ruler: string; inHouse: number }>();
  for (let h = 1; h <= 12; h += 1) {
    const cuspLon = houseCusps[h - 1] ?? (h - 1) * 30;
    const cuspSign = signOf(cuspLon);
    const rulerName = TRADITIONAL_RULERS[cuspSign];
    const rulerRow = rulerName ? bodyByName.get(rulerName) : undefined;
    if (rulerName && rulerRow) {
      houseRulerHouse.set(h, { ruler: rulerName, inHouse: rulerRow.house });
    }
  }

  const activeLifeEvents: EvaluatedLifeEventPattern[] = [];
  for (const eventDef of LIFE_EVENT_PATTERNS) {
    const supporting: string[] = [];

    // Natal house occupation
    for (const h of eventDef.primaryHouses) {
      const occupants = bodies.filter(
        b => b.house === h && eventDef.primaryPlanets.includes(b.name)
      );
      for (const occ of occupants) {
        supporting.push(
          `Natal ${occ.name} in House ${h} (${occ.display})`
        );
      }
    }

    // House ruler connections
    for (const [fromHouse, toHouse] of eventDef.houseRulerConnections) {
      const info = houseRulerHouse.get(fromHouse);
      if (info && info.inHouse === toHouse) {
        supporting.push(
          `Ruler of House ${fromHouse} (${info.ruler}) placed in House ${toHouse}`
        );
      }
    }

    // Natal aspects
    for (const [p1, p2] of eventDef.aspectPairs) {
      const hit = findAspect(natalAspects, p1, p2);
      if (hit) {
        supporting.push(
          `Natal ${hit.a} ${hit.aspect} ${hit.b} (${hit.orb.toFixed(1)}°)`
        );
      }
    }

    // Transit activations
    let transitCount = 0;
    let tightestTransitOrb = 99;
    if (mode !== "natal" && transits.length > 0) {
      for (const tr of transits) {
        if (
          eventDef.primaryHouses.includes(tr.house) &&
          eventDef.primaryPlanets.includes(tr.name)
        ) {
          supporting.push(
            `Transit ${tr.name} moving through House ${tr.house} (${tr.display})`
          );
          transitCount += 1;
        }
        for (const contact of tr.natalContacts ?? []) {
          if (
            eventDef.primaryPlanets.includes(tr.name) ||
            eventDef.primaryPlanets.includes(contact.natalName)
          ) {
            supporting.push(
              `Transit ${tr.name} ${contact.aspect} natal ${contact.natalName} (${contact.orb.toFixed(1)}° orb)`
            );
            transitCount += 1;
            if (contact.orb < tightestTransitOrb) {
              tightestTransitOrb = contact.orb;
            }
          }
        }
      }
    }

    if (supporting.length === 0) continue;

    // God View ↔ Agent View Event Translation
    const primaryPlanetRow = bodyByName.get(eventDef.primaryPlanets[0] ?? "Sun");
    const godToAgentTranslation =
      primaryPlanetRow &&
      primaryPlanetRow.godHouse != null &&
      primaryPlanetRow.agentHouse != null &&
      primaryPlanetRow.godHouse !== primaryPlanetRow.agentHouse
        ? `${primaryPlanetRow.name} sits in Collective God House ${primaryPlanetRow.godHouse} and translates into local Agent House ${primaryPlanetRow.agentHouse}. ${eventDef.godToAgentTemplate}`
        : eventDef.godToAgentTemplate;

    let confidenceCode: EventConfidenceCode = "E1";
    let confidenceLabel = "E1 — Natal Potential";
    let temporalState: EventTemporalState = "State 1 — Latent (Natal Promise)";

    if (supporting.length >= 5 && transitCount >= 2) {
      confidenceCode = "E5";
      confidenceLabel = "E5 — Multi-Layer Convergence";
      temporalState =
        tightestTransitOrb <= 1.5
          ? "State 5 — Peak Convergence"
          : "State 4 — Manifesting";
    } else if (supporting.length >= 4 && transitCount >= 1) {
      confidenceCode = "E4";
      confidenceLabel = "E4 — Convergent Event Signature";
      temporalState = "State 3 — Activating";
    } else if (supporting.length >= 3) {
      confidenceCode = "E3";
      confidenceLabel = "E3 — Strong Event Signature";
      temporalState =
        transitCount > 0
          ? "State 3 — Activating"
          : "State 1 — Latent (Natal Promise)";
    } else if (supporting.length >= 2) {
      confidenceCode = "E2";
      confidenceLabel = "E2 — Activated Theme";
      temporalState =
        transitCount > 0
          ? "State 2 — Approaching"
          : "State 1 — Latent (Natal Promise)";
    }

    if (eventDef.category === "consolidation" && supporting.length >= 3) {
      temporalState = "State 8 — Consolidating";
    }

    const questionRelevance = computeQuestionRelevance(
      question,
      eventDef.questionKeywords
    );
    const score = Number(
      (
        supporting.length * 9 +
        transitCount * 12 +
        questionRelevance * 20
      ).toFixed(1)
    );

    activeLifeEvents.push({
      id: eventDef.id,
      codeNumber: eventDef.codeNumber,
      name: eventDef.name,
      category: eventDef.category,
      categoryLabel: eventDef.categoryLabel,
      confidenceCode,
      confidenceLabel,
      temporalState,
      questionRelevance,
      score,
      definition: eventDef.definition,
      possibleManifestations: eventDef.possibleManifestations,
      alternativeManifestations: eventDef.alternativeManifestations,
      supportingEvidence: supporting.slice(0, 6),
      counterEvidence: eventDef.counterIndicators,
      godToAgentTranslation,
      developmentalMeaning: eventDef.developmentalMeaning,
      sequencePredecessors: eventDef.sequencePredecessors,
      sequenceSuccessors: eventDef.sequenceSuccessors,
      aiLanguageRule: eventDef.aiLanguageRule,
    });
  }

  activeLifeEvents.sort((a, b) => b.score - a.score);

  // 6. Evaluate Cross-Domain Event Sequence Chains
  const eventSequences: EvaluatedSequenceChain[] = [];
  for (const chain of EVENT_SEQUENCE_CHAINS) {
    const matchedHouses = chain.requiredHouses.filter(h =>
      bodies.some(b => b.house === h)
    );
    if (matchedHouses.length >= 2) {
      const supporting = matchedHouses.map(h => {
        const names = bodies
          .filter(b => b.house === h)
          .map(b => b.name)
          .join(", ");
        return `House ${h} occupied by ${names}`;
      });
      eventSequences.push({
        id: chain.id,
        name: chain.name,
        activeStages: chain.stages,
        supportingEvidence: supporting,
        narrative: chain.narrative,
        developmentalMeaning: chain.developmentalMeaning,
        strength: Number(
          (matchedHouses.length / chain.requiredHouses.length).toFixed(2)
        ),
      });
    }
  }

  // 7. Match Compact 200-Pattern Vocabulary Index
  const matchedVocabularyTags: BehavioralIntelligenceReport["matchedVocabularyTags"] =
    [];
  for (const item of COMPACT_PATTERN_INDEX) {
    const tokens = item.lookFor.split(/[,;/]+/).map(s => s.trim());
    for (const token of tokens) {
      const pairMatch = token.match(
        /^(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)-(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)$/
      );
      if (pairMatch) {
        const hit = findAspect(natalAspects, pairMatch[1]!, pairMatch[2]!);
        if (hit) {
          matchedVocabularyTags.push({
            code: item.code,
            domain: item.domain,
            name: item.name,
            evidence: `${hit.a} ${hit.aspect} ${hit.b} (${hit.orb.toFixed(1)}°)`,
          });
          break;
        }
      }
      const houseMatch = token.match(
        /^(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\s+(\d+)(?:st|nd|rd|th)$/
      );
      if (houseMatch) {
        const row = bodyByName.get(houseMatch[1]!);
        if (row && row.house === Number(houseMatch[2])) {
          matchedVocabularyTags.push({
            code: item.code,
            domain: item.domain,
            name: item.name,
            evidence: `${row.name} in House ${row.house}`,
          });
          break;
        }
      }
    }
  }

  // 8. Build an evidence-gated self-knowledge profile.
  const allAboutYouProfile = buildSelfKnowledgeProfile(
    evaluatedBehaviors,
    activeContradictions,
    activeLifeEvents
  );

  return {
    question,
    mode,
    evaluatedAt: new Date().toISOString(),
    allAboutYouProfile,
    dominantBehaviors: evaluatedBehaviors.slice(0, 10),
    polarityAxes,
    activeContradictions,
    activeLifeEvents: activeLifeEvents.slice(0, 8),
    eventSequences,
    planetInteractions,
    activeHouseAxes,
    matchedVocabularyTags: matchedVocabularyTags.slice(0, 18),
    doNotClaimRestrictions: DO_NOT_CLAIM_RESTRICTIONS,
  };
}

export function behavioralReportToEvidenceItems(
  report: BehavioralIntelligenceReport
): {
  behavioralEvidence: EvidenceItem[];
  lifeEventEvidence: EvidenceItem[];
} {
  const retrievedAt = report.evaluatedAt;
  const trace = (technique: string) => ({
    sourceId: "firmament-behavioral-intelligence",
    tradition: "firmament" as const,
    technique,
    sourceTitle: "Firmament Human Behavior & Life-Event Pattern Intelligence",
    retrievedAt,
    ruleId: "firmament-behavioral-pattern-engine",
    confidence: "high" as const,
  });

  const behavioralEvidence: EvidenceItem[] = [
    ...report.dominantBehaviors.slice(0, 8).map(b => ({
      id: `behavior-${b.id}`,
      tradition: "firmament" as const,
      category: "deterministic-rule" as const,
      technique: "behavioral-pattern",
      subject: b.name,
      statement: `[${b.confidenceLabel} | State: ${b.state}] ${b.name} (${b.domainLabel}): ${b.languagePrefix} ${b.definition} Trigger: ${b.triggerPatterns.slice(0, 2).join(", ")} -> Response (${b.responseStyle}): ${b.automaticExpression} -> Motivation: ${b.motivationPatterns.slice(0, 2).join(", ")} -> Constructive: ${b.constructiveExpression} | Shadow: ${b.shadowExpression}. Evidence: ${b.supportingEvidence.map(e => e.detail).join("; ")}.${b.counterEvidence.length ? ` Counter-evidence: ${b.counterEvidence.join("; ")}.` : ""}`,
      concepts: [
        "behavioral-pattern",
        b.domain,
        ...b.motivationPatterns.slice(0, 2),
      ],
      polarity: "mixed" as const,
      strength: Math.min(1, b.confidenceLevel / 5),
      ruleId: "firmament-behavioral-pattern-engine",
      sourceId: "firmament-behavioral-intelligence",
      sourceTrace: trace("behavioral-pattern"),
    })),
    ...report.activeContradictions.map(axis => ({
      id: `polarity-tension-${axis.id}`,
      tradition: "firmament" as const,
      category: "deterministic-rule" as const,
      technique: "behavioral-polarity",
      subject: `${axis.leftPole} vs ${axis.rightPole}`,
      statement: `${axis.synthesis} (${axis.leftPole}: ${axis.leftEvidence.join(", ")} vs. ${axis.rightPole}: ${axis.rightEvidence.join(", ")}).`,
      concepts: ["behavioral-polarity", "contradiction", axis.id],
      polarity: "mixed" as const,
      strength: 0.85,
      ruleId: "firmament-behavioral-pattern-engine",
      sourceId: "firmament-behavioral-intelligence",
      sourceTrace: trace("behavioral-polarity"),
    })),
    ...report.planetInteractions.slice(0, 6).map(inter => ({
      id: `planet-interaction-${inter.pair.toLowerCase()}`,
      tradition: "firmament" as const,
      category: "deterministic-rule" as const,
      technique: "interaction-matrix",
      subject: inter.pair,
      statement: `Interaction Matrix ${inter.pair} (${inter.aspect}, ${inter.orb.toFixed(1)}°): ${inter.coreTheme}. Mechanism: ${inter.behavioralMechanism} Constructive: ${inter.constructive}. Shadow: ${inter.shadow}.`,
      concepts: ["interaction-matrix", ...inter.pair.toLowerCase().split("-")],
      polarity: ["square", "opposition"].includes(inter.aspect)
        ? ("pressured" as const)
        : ("mixed" as const),
      strength: Math.max(0.5, 1 - inter.orb / 6),
      ruleId: "firmament-behavioral-pattern-engine",
      sourceId: "firmament-behavioral-intelligence",
      sourceTrace: trace("interaction-matrix"),
    })),
  ];

  const lifeEventEvidence: EvidenceItem[] = [
    ...report.activeLifeEvents.slice(0, 6).map(ev => ({
      id: `life-event-${ev.id}`,
      tradition: "firmament" as const,
      category: "deterministic-rule" as const,
      technique: "life-event-signature",
      subject: ev.name,
      statement: `[${ev.confidenceLabel} | ${ev.temporalState}] ${ev.name} (${ev.categoryLabel}): ${ev.definition} Possible manifestations: ${ev.possibleManifestations.join("; ")}. Alternative manifestation: ${ev.alternativeManifestations.join("; ")}. Developmental meaning: ${ev.developmentalMeaning} Evidence: ${ev.supportingEvidence.join("; ")}.`,
      concepts: ["life-event", ev.category],
      polarity: "mixed" as const,
      strength:
        ev.confidenceCode === "E5"
          ? 0.95
          : ev.confidenceCode === "E4"
            ? 0.85
            : ev.confidenceCode === "E3"
              ? 0.75
              : 0.6,
      ruleId: "firmament-life-event-engine",
      sourceId: "firmament-behavioral-intelligence",
      sourceTrace: trace("life-event-signature"),
    })),
    ...report.eventSequences.map(seq => ({
      id: `event-sequence-${seq.id}`,
      tradition: "firmament" as const,
      category: "deterministic-rule" as const,
      technique: "event-sequence-chain",
      subject: seq.name,
      statement: `Cross-Domain Sequence [${seq.name}]: ${seq.narrative} Developmental meaning: ${seq.developmentalMeaning} (${seq.supportingEvidence.join("; ")}).`,
      concepts: ["event-sequence", seq.id],
      polarity: "supportive" as const,
      strength: seq.strength,
      ruleId: "firmament-life-event-engine",
      sourceId: "firmament-behavioral-intelligence",
      sourceTrace: trace("event-sequence-chain"),
    })),
  ];

  return { behavioralEvidence, lifeEventEvidence };
}
