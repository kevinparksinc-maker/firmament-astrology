import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Compass,
  Eye,
  HelpCircle,
  Layers3,
  MoonStar,
  Orbit,
  Sparkles,
  Stars,
} from "lucide-react";
import "./Guardian2050.css";
import "./Guardian2050-polish.css";
import { FirmamentDomeIllustration } from "./FirmamentDomeIllustration";

type Depth = "guided" | "scholar";
type Portal = {
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  icon: typeof Stars;
  label: string;
};

const portals: Portal[] = [
  {
    href: "#chart-setup",
    eyebrow: "01 / YOUR FOUNDATION",
    title: "Cast a natal chart",
    summary:
      "Begin with your birth details. See the moving sky against the permanently fixed firmament.",
    icon: Stars,
    label: "Open chart setup",
  },
  {
    href: "/horary",
    eyebrow: "02 / A LIVING QUESTION",
    title: "Ask a horary question",
    summary:
      "Explore the sky at the exact moment of your question, including planetary rulers and testimony.",
    icon: MoonStar,
    label: "Open horary",
  },
  {
    href: "/zodiac-readings",
    eyebrow: "THE TWELVE CELESTIAL GATES",
    title: "Explore your sign",
    summary:
      "Read your sign through twelve distinct house perspectives, with both sky views kept clear.",
    icon: Sparkles,
    label: "Open sign readings",
  },
  {
    href: "/sky",
    eyebrow: "03 / THE CELESTIAL MAP",
    title: "Explore the firmament",
    summary:
      "See moving planets, fixed stellar territories, and the 27 / 28 / 36 celestial overlays.",
    icon: Orbit,
    label: "Explore the map",
  },
  {
    href: "/history",
    eyebrow: "04 / YOUR LIBRARY",
    title: "Return to your readings",
    summary:
      "Revisit your chart work and reflect on what you have learned.",
    icon: BookOpenText,
    label: "Open your library",
  },
];

const glossary = [
  {
    word: "God View",
    meaning:
      "The permanent twelve-sector celestial reference frame. It does not depend on your local horizon.",
  },
  {
    word: "Agent View",
    meaning:
      "Your observer-centered equal houses, beginning with the local Ascendant. Moving planets are interpreted locally.",
  },
  {
    word: "Synthesis",
    meaning:
      "Where the independent God and Agent calculations are woven together and their agreements and differences explained.",
  },
  {
    word: "Nakshatras · Manzils · Decans",
    meaning:
      "The permanent 27, 28 and 36 equal divisions of the fixed Firmament backdrop; moving planets pass through them.",
  },
];

function scholarlySummary(href: string) {
  if (href === "#chart-setup")
    return "Birth coordinates · tropical ephemeris · fixed and local house frameworks";
  if (href === "/horary")
    return "Question-moment significators · planetary rulers · traditional testimony";
  if (href === "/zodiac-readings")
    return "Twelve sign-centered house perspectives · fixed and local sky views";
  if (href === "/sky")
    return "Fixed-star archive · Nakshatras, Manzils, Decans · dual-frame overlays";
  return "Saved charts, interpretations, and previous readings";
}

export function Guardian2050Welcome() {
  const [depth, setDepth] = useState<Depth>("guided");
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <section
      className="fg2050"
      aria-label="Firmament Guardian celestial observatory"
    >
      <nav className="fg2050-topbar" aria-label="Guardian primary navigation">
        <a href="/" className="fg2050-brand">
          <span className="fg2050-brandmark">
            <Orbit size={21} aria-hidden="true" />
          </span>
          <span>
            <b>FIRMAMENT</b>
            <small>GUARDIAN · CELESTIAL WISDOM</small>
          </span>
        </a>
        <div className="fg2050-toplinks">
          <a href="#chart-setup">Natal</a>
          <a href="/horary">Horary</a>
          <a href="/zodiac-readings">12 Signs</a>
          <a href="/sky">Celestial Map</a>
          <a href="/history">Library</a>
        </div>
        <span className="fg2050-model-tag">
          <i /> EARTH BELOW · DOME ABOVE
        </span>
      </nav>

      <div className="fg2050-lead">
        <div className="fg2050-intro">
          <div className="fg2050-kicker">
            <span /> THE BIBLICAL FIRMAMENT · AN INTERPRETIVE OBSERVATORY
          </div>
          <h2>
            Two skies.
            <br />
            <em>One precise moment.</em>
          </h2>
          <p className="fg2050-subtitle">
            An ancient language of the heavens, reimagined for a new generation.
            Explore the moving tropical sky against a permanent stellar
            firmament—then discover what its patterns mean in everyday life.
          </p>
          <div className="fg2050-actions">
            <a href="#chart-setup" className="fg2050-action-primary">
              Begin your reading <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href="/sky" className="fg2050-action-secondary">
              Enter the observatory <Orbit size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="fg2050-horizon-badges">
            <span>
              <Stars size={14} aria-hidden="true" /> FIXED STARS
            </span>
            <span>
              <Layers3 size={14} aria-hidden="true" /> 27 · 28 · 36 OVERLAYS
            </span>
            <span>
              <Compass size={14} aria-hidden="true" /> EQUAL HOUSES
            </span>
          </div>
        </div>
        <FirmamentDomeIllustration />
      </div>

      <div className="fg2050-portal-heading">
        <div>
          <span className="fg2050-eyebrow">YOUR CELESTIAL JOURNEY</span>
          <h3>What would you like to explore?</h3>
          <p>Choose a starting point. You can move between these tools anytime.</p>
        </div>
        <div className="fg2050-depth-switch" role="group" aria-label="Explanation depth">
          <button
            type="button"
            aria-pressed={depth === "guided"}
            className={depth === "guided" ? "active" : ""}
            onClick={() => setDepth("guided")}
          >
            <Sparkles size={14} aria-hidden="true" /> New to astrology
          </button>
          <button
            type="button"
            aria-pressed={depth === "scholar"}
            className={depth === "scholar" ? "active" : ""}
            onClick={() => setDepth("scholar")}
          >
            <BookOpenText size={14} aria-hidden="true" /> Deep study
          </button>
        </div>
      </div>

      <div className="fg2050-portals" aria-label="Explore Firmament Guardian">
        {portals.map(({ href, eyebrow, title, summary, icon: Icon, label }) => (
          <a key={href} href={href} className="fg2050-portal" aria-label={label}>
            <span className="fg2050-portal-icon" aria-hidden="true">
              <Icon size={21} strokeWidth={1.5} />
            </span>
            <span className="fg2050-portal-copy">
              <span className="fg2050-portal-top">{eyebrow}</span>
              <strong>{title}</strong>
              <span className="fg2050-portal-summary">
                {depth === "guided" ? summary : scholarlySummary(href)}
              </span>
            </span>
            <span className="fg2050-portal-cta" aria-hidden="true">
              <span>{label}</span>
              <ArrowUpRight size={17} />
            </span>
          </a>
        ))}
      </div>

      <div className="fg2050-education">
        <div>
          <div className="fg2050-eyebrow">ONE CALCULATION · TWO PERSPECTIVES</div>
          <h3>
            Separate in calculation.
            <br />
            <em>United in understanding.</em>
          </h3>
          <p>
            Your chart keeps God View and Agent View distinct. The Master
            Interpreter connects their evidence in clear English, without
            erasing the differences between them.
          </p>
        </div>
        <div className="fg2050-education-right">
          <div className="fg2050-view-row">
            <span>
              <Eye size={17} aria-hidden="true" /> GOD VIEW
            </span>
            <p>Permanent celestial reference · the shared fixed order</p>
          </div>
          <div className="fg2050-view-row">
            <span>
              <Compass size={17} aria-hidden="true" /> AGENT VIEW
            </span>
            <p>Local Ascendant · observer-centered equal houses</p>
          </div>
          <div className="fg2050-view-row">
            <span>
              <Sparkles size={17} aria-hidden="true" /> SYNTHESIS
            </span>
            <p>Agreements, contradictions, and lived human meaning</p>
          </div>
        </div>
      </div>

      <div className="fg2050-guide">
        <button
          type="button"
          aria-expanded={guideOpen}
          onClick={() => setGuideOpen(value => !value)}
        >
          <HelpCircle size={18} aria-hidden="true" />
          <span>
            {guideOpen ? "Hide the quick guide" : "What do these astrology terms mean?"}
          </span>
          <span className="fg2050-guide-state" aria-hidden="true">
            {guideOpen ? "−" : "+"}
          </span>
        </button>
        {guideOpen && (
          <dl>
            {glossary.map(item => (
              <div key={item.word}>
                <dt>{item.word}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <a href="#chart-setup" className="fg2050-step-link">
        CONTINUE TO YOUR CHART SETUP <ArrowDown size={15} aria-hidden="true" />
      </a>
    </section>
  );
}
