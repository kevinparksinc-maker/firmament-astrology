import { useMemo, useState } from "react";
import type { ChartResult } from "../../../server/astronomy";
import { angularDistance } from "../../../server/astrologyCore";
import { formatLongitude } from "../../../shared/hybrid";

type Layer = "natal" | "transit" | "god";
type SkyBody = {
  name: string;
  longitude: number;
  display: string;
  color: string;
  glyph: string;
  house: string;
  retrograde?: boolean;
};

const LAYERS: Record<Layer, { label: string; short: string; color: string; offset: number }> = {
  god: { label: "Fixed Firmament", short: "FIRMAMENT", color: "#6de7ed", offset: 0 },
  transit: { label: "Selected-Time Sky", short: "SELECTED TIME", color: "#bca5ff", offset: 13 },
  natal: { label: "Natal / Local Horizon", short: "NATAL", color: "#f2c875", offset: 26 },
};
const PLANETS: Record<string, { glyph: string; color: string }> = {
  Sun: { glyph: "☉", color: "#f5cf73" },
  Moon: { glyph: "☽", color: "#eef3ff" },
  Mercury: { glyph: "☿", color: "#72d9ed" },
  Venus: { glyph: "♀", color: "#f29ac6" },
  Mars: { glyph: "♂", color: "#ff887e" },
  Jupiter: { glyph: "♃", color: "#c19fff" },
  Saturn: { glyph: "♄", color: "#c6d0e4" },
  Uranus: { glyph: "♅", color: "#72e6cf" },
  Neptune: { glyph: "♆", color: "#91a8ff" },
  Pluto: { glyph: "♇", color: "#f0a1ef" },
  "North Node": { glyph: "☊", color: "#ffe295" },
  "South Node": { glyph: "☋", color: "#c5a783" },
};
const SIGNS = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];
const ROYAL_STARS = [
  { name: "Aldebaran", longitude: 45 },
  { name: "Regulus", longitude: 135 },
  { name: "Antares", longitude: 225.0167 },
  { name: "Fomalhaut", longitude: 315 },
];
const normalizeLongitude = (longitude: number) => ((longitude % 360) + 360) % 360;
const domeX = (longitude: number) => 84 + (normalizeLongitude(longitude) / 360) * 632;
const domeY = (longitude: number) => {
  const t = normalizeLongitude(longitude) / 360;
  return 406 - 1240 * t * (1 - t);
};
const STAR_DOTS = Array.from({ length: 82 }, (_, index) => {
  const x = 110 + ((index * 71) % 580);
  const t = (x - 84) / 632;
  const shell = 406 - 1240 * t * (1 - t);
  const skyDepth = Math.max(1, 406 - shell - 34);
  return {
    x,
    y: shell + 17 + ((index * 43) % skyDepth),
    r: index % 13 === 0 ? 1.75 : index % 4 === 0 ? 1.25 : 0.8,
    opacity: 0.25 + ((index * 17) % 65) / 100,
  };
});
const round2 = (value: number) => Math.round(value * 100) / 100;

function getBodyRows(chart: ChartResult | null | undefined, layer: Layer): SkyBody[] {
  if (!chart) return [];
  const source = layer === "natal"
    ? chart.movingBodies
    : chart.transits.length > 0
      ? chart.transits
      : chart.movingBodies;

  return source.filter(row => PLANETS[row.name]).map(row => {
    const meta = PLANETS[row.name]!;
    const house = layer === "natal"
      ? `Agent House ${row.agentHouse ?? row.house}`
      : layer === "god"
        ? `God House ${row.godHouse ?? Math.floor(row.longitude / 30) + 1}`
        : `House ${row.house}`;
    return {
      name: row.name,
      longitude: row.longitude,
      display: row.display,
      color: meta.color,
      glyph: meta.glyph,
      house,
      retrograde: row.retrograde,
    };
  });
}

function SelectedAnnotation({ body, x, y }: { body: SkyBody; x: number; y: number }) {
  const left = Math.max(91, Math.min(570, x - 70));
  const top = Math.max(66, y - 78);
  return (
    <g aria-hidden="true" pointerEvents="none">
      <path d={`M${x} ${y - 15} L${x} ${top + 43}`} stroke={body.color} strokeOpacity=".55" strokeWidth="1" strokeDasharray="3 4" />
      <rect x={left} y={top} width="140" height="42" rx="11" fill="#0b1727" stroke={body.color} strokeOpacity=".76" />
      <circle cx={left + 14} cy={top + 14} r="3" fill={body.color} />
      <text x={left + 25} y={top + 17} fill="#f6f2e9" fontSize="12" fontWeight="700">{body.glyph} {body.name}</text>
      <text x={left + 14} y={top + 33} fill={body.color} fontSize="10" fontFamily="monospace">{body.display}</text>
    </g>
  );
}

export function FirmamentSkyMap({ chart }: { chart?: ChartResult | null }) {
  const [layer, setLayer] = useState<Layer>("god");
  const [selectedName, setSelectedName] = useState("Moon");
  const [showComparisons, setShowComparisons] = useState(true);
  const rowsByLayer = useMemo(() => ({
    god: getBodyRows(chart, "god"),
    transit: getBodyRows(chart, "transit"),
    natal: getBodyRows(chart, "natal"),
  }), [chart]);
  const activeRows = rowsByLayer[layer];
  const selected = activeRows.find(body => body.name === selectedName) ?? activeRows[0];
  const aspects = useMemo(() => {
    const result: Array<{ a: SkyBody; b: SkyBody; color: string; label: string; orb: number }> = [];
    const targets: Array<[number, string, string]> = [
      [0, "Conjunction", "#f4d477"],
      [60, "Sextile", "#71d6e9"],
      [90, "Square", "#ff887e"],
      [120, "Trine", "#72dfbb"],
      [180, "Opposition", "#bca5ff"],
    ];
    for (let i = 0; i < activeRows.length; i += 1) {
      for (let j = i + 1; j < activeRows.length; j += 1) {
        const a = activeRows[i]!;
        const b = activeRows[j]!;
        const distance = angularDistance(a.longitude, b.longitude);
        for (const [angle, label, color] of targets) {
          const orb = Math.abs(distance - angle);
          if (orb <= 5) {
            result.push({ a, b, color, label, orb });
            break;
          }
        }
      }
    }
    return result;
  }, [activeRows]);
  const selectedX = selected ? domeX(selected.longitude) : 0;
  const selectedY = selected ? domeY(selected.longitude) + LAYERS[layer].offset : 0;
  const chartWhen = chart?.input
    ? [chart.input.date, chart.input.time].filter(Boolean).join(" · ")
    : "Select a chart time";
  const chartWhere = chart?.input?.location || "Calculated chart";

  return (
    <section className="space-y-4" aria-label="Interactive celestial dome atlas">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Firmament chart layers">
        {(Object.keys(LAYERS) as Layer[]).map(key => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={layer === key}
            onClick={() => setLayer(key)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${layer === key ? "border-cyan-200/40 bg-cyan-300/10 text-white shadow-[0_0_22px_rgba(80,218,229,0.09)]" : "border-slate-700/80 bg-slate-950/50 text-slate-400 hover:border-slate-500 hover:text-white"}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LAYERS[key].color, boxShadow: `0 0 10px ${LAYERS[key].color}` }} />
            {LAYERS[key].label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={showComparisons}
          onClick={() => setShowComparisons(value => !value)}
          className="ml-auto rounded-xl border border-slate-700/80 px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-200/40 hover:text-white"
        >
          {showComparisons ? "Hide comparison layers" : "Compare chart layers"}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_292px]">
        <div className="overflow-hidden rounded-[26px] border border-cyan-100/15 bg-[#060d18] shadow-[0_26px_80px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-gradient-to-r from-[#102031] via-[#0d1725] to-[#151529] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-100/20 bg-cyan-200/[0.07] text-lg text-cyan-100">✧</div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-cyan-200/75">FIRMAMENT ATLAS</div>
                <h3 className="mt-0.5 font-serif text-lg tracking-wide text-[#f3ecde] sm:text-xl">The Sky Beneath the Dome</h3>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-2.5 py-1.5 font-semibold uppercase tracking-[.13em] text-emerald-200"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />Calculated sky</span>
              <span className="rounded-full border border-white/[0.08] bg-black/20 px-2.5 py-1.5 text-slate-300">{chartWhen}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-1 pt-4 text-[10px] sm:px-6">
            <span className="font-semibold uppercase tracking-[.16em] text-slate-400">{chartWhere}</span>
            <span className="text-slate-500">{activeRows.length} calculated positions <span className="mx-1.5 text-slate-700">/</span> {aspects.length} close aspects</span>
          </div>

          <div className="px-1 pb-1 sm:px-4">
            <svg
              viewBox="0 0 800 570"
              className="mx-auto block h-auto w-full max-w-[860px] select-none"
              role="img"
              aria-label={`Detailed Earth-under-dome celestial chart for ${LAYERS[layer].label}; plotted positions are calculated chart data, connector lines are chart aspects rather than physical paths.`}
            >
              <defs>
                <linearGradient id="atlas-sky" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#071b2a" />
                  <stop offset=".45" stopColor="#101c37" />
                  <stop offset="1" stopColor="#201b3b" />
                </linearGradient>
                <linearGradient id="atlas-shell" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#266b7d" stopOpacity=".12" />
                  <stop offset=".48" stopColor="#4385a5" stopOpacity=".2" />
                  <stop offset="1" stopColor="#8066ab" stopOpacity=".12" />
                </linearGradient>
                <linearGradient id="atlas-earth" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#184754" />
                  <stop offset=".48" stopColor="#102e43" />
                  <stop offset="1" stopColor="#0a1d31" />
                </linearGradient>
                <linearGradient id="atlas-ecliptic" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e6c887" stopOpacity=".04" />
                  <stop offset=".5" stopColor="#e6c887" stopOpacity=".16" />
                  <stop offset="1" stopColor="#e6c887" stopOpacity=".04" />
                </linearGradient>
                <radialGradient id="atlas-nebula">
                  <stop offset="0" stopColor="#52bad7" stopOpacity=".15" />
                  <stop offset="1" stopColor="#52bad7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="sun-aura">
                  <stop offset="0" stopColor="#ffe6a1" stopOpacity=".42" />
                  <stop offset=".3" stopColor="#ffc775" stopOpacity=".12" />
                  <stop offset="1" stopColor="#ffc775" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="moon-aura">
                  <stop offset="0" stopColor="#dcecff" stopOpacity=".36" />
                  <stop offset=".36" stopColor="#9fbaff" stopOpacity=".1" />
                  <stop offset="1" stopColor="#9fbaff" stopOpacity="0" />
                </radialGradient>
                <filter id="atlas-soft-glow" x="-250%" y="-250%" width="600%" height="600%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
                <clipPath id="atlas-dome-clip">
                  <path d="M84 406 Q400 -214 716 406 L716 409 L84 409Z" />
                </clipPath>
              </defs>

              <rect x="12" y="12" width="776" height="540" rx="22" fill="#07111e" />
              <rect x="12" y="12" width="776" height="540" rx="22" fill="url(#atlas-sky)" />
              <ellipse cx="400" cy="286" rx="300" ry="242" fill="url(#atlas-nebula)" />
              <text x="400" y="43" textAnchor="middle" fill="#b8d9e3" fontSize="10" fontWeight="700" letterSpacing="3">THE FIXED HEAVENS · A CELESTIAL ATLAS</text>
              <text x="38" y="72" fill="#7892a8" fontSize="9" fontWeight="600" letterSpacing="1.5">NORTH</text>
              <path d="M50 80v21m-4-7 4-6 4 6" fill="none" stroke="#8ca5b7" strokeOpacity=".55" strokeWidth="1" />
              <text x="762" y="72" textAnchor="end" fill="#7892a8" fontSize="9" fontWeight="600" letterSpacing="1.5">POLAR REFERENCE</text>

              <g clipPath="url(#atlas-dome-clip)">
                <path d="M84 406 Q400 -214 716 406 L716 410 L84 410Z" fill="url(#atlas-shell)" />
                <ellipse cx="400" cy="350" rx="140" ry="90" fill="url(#atlas-nebula)" />
                {STAR_DOTS.map((star, index) => (
                  <circle key={`star-${index}`} cx={star.x} cy={star.y} r={star.r} fill={index % 9 === 0 ? "#d5e7ff" : "#b5c9df"} opacity={star.opacity} />
                ))}
                {Array.from({ length: 7 }, (_, index) => {
                  const longitude = (index + 1) * 45;
                  const x = domeX(longitude);
                  const y = domeY(longitude);
                  return <path key={`meridian-${longitude}`} d={`M${x} 408 Q400 ${Math.max(86, y - 82)} ${800 - x} 408`} fill="none" stroke="#82bacc" strokeOpacity={index === 3 ? ".11" : ".075"} strokeWidth="1" />;
                })}
                {[0, 1, 2, 3].map(index => {
                  const inset = (index + 1) * 35;
                  const apex = -214 + inset * 1.37;
                  return <path key={`latitude-${index}`} d={`M${84 + inset} 406 Q400 ${apex} ${716 - inset} 406`} fill="none" stroke="#9fd6de" strokeOpacity={index === 1 ? ".21" : ".13"} strokeWidth="1" strokeDasharray={index === 1 ? "" : "3 8"} />;
                })}

                <path d="M84 406 Q400 -214 716 406" fill="none" stroke="#8de3e8" strokeOpacity=".15" strokeWidth="12" filter="url(#atlas-soft-glow)" />
                <path d="M84 406 Q400 -214 716 406" fill="none" stroke="#b4e7e3" strokeOpacity=".72" strokeWidth="2.1" />
                <path d="M84 406 Q400 -214 716 406" fill="none" stroke="#eccf92" strokeOpacity=".5" strokeWidth=".8" strokeDasharray="2 7" />
                <path d="M92 414 Q400 -206 708 414" fill="none" stroke="url(#atlas-ecliptic)" strokeWidth="16" />
                <path d="M92 414 Q400 -206 708 414" fill="none" stroke="url(#atlas-ecliptic)" strokeWidth="12" />

                {Array.from({ length: 73 }, (_, index) => {
                  const longitude = index * 5;
                  const x = domeX(longitude);
                  const y = domeY(longitude);
                  const major = index % 6 === 0;
                  return <path key={`tick-${index}`} d={`M${x} ${y - (major ? 2 : 1)}v${major ? 12 : 6}`} stroke={major ? "#e7cd97" : "#96ccd1"} strokeOpacity={major ? ".72" : ".35"} strokeWidth={major ? "1.2" : ".7"} />;
                })}

                {ROYAL_STARS.map(star => {
                  const x = domeX(star.longitude);
                  const y = domeY(star.longitude) + 4;
                  return (
                    <g key={star.name}>
                      <circle cx={x} cy={y} r="8" fill="#f3d293" opacity=".1" />
                      <path d={`M${x} ${y - 5}l1.7 3.3 3.8 1.7-3.8 1.7L${x} ${y + 6}l-1.7-5-3.8-1.7 3.8-1.7z`} fill="#f2d393" stroke="#fff1c9" strokeWidth=".5" />
                      <title>{star.name} · fixed Royal Star reference</title>
                    </g>
                  );
                })}

                {showComparisons && (Object.keys(LAYERS) as Layer[]).filter(key => key !== layer).flatMap(key => rowsByLayer[key].map(body => {
                  const x = domeX(body.longitude);
                  const y = domeY(body.longitude) + LAYERS[key].offset;
                  return (
                    <g key={`${key}-${body.name}`}>
                      <circle cx={x} cy={y} r="7" fill="#091525" stroke={LAYERS[key].color} strokeWidth="1.5" opacity=".86" />
                      <title>{LAYERS[key].label}: {body.name} · {body.display}</title>
                    </g>
                  );
                }))}

                {aspects.map((aspect, index) => {
                  const x1 = domeX(aspect.a.longitude);
                  const y1 = domeY(aspect.a.longitude) + LAYERS[layer].offset;
                  const x2 = domeX(aspect.b.longitude);
                  const y2 = domeY(aspect.b.longitude) + LAYERS[layer].offset;
                  return (
                    <line key={`${aspect.a.name}-${aspect.b.name}-${index}`} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={aspect.color} strokeOpacity=".38" strokeWidth="1.2" strokeDasharray="3 4">
                      <title>{aspect.a.name} {aspect.label.toLowerCase()} {aspect.b.name} · {aspect.orb.toFixed(1)}° orb · chart aspect, not a path</title>
                    </line>
                  );
                })}

                {activeRows.map(body => {
                  const x = domeX(body.longitude);
                  const y = domeY(body.longitude) + LAYERS[layer].offset;
                  const active = selected?.name === body.name;
                  const planetGlow = body.name === "Sun" ? "url(#sun-aura)" : body.name === "Moon" ? "url(#moon-aura)" : undefined;
                  return (
                    <g key={body.name} role="button" tabIndex={0} aria-label={`Select ${body.name}, ${body.display}, ${body.house}`}
                      onClick={() => setSelectedName(body.name)}
                      onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedName(body.name);
                        }
                      }}
                      className="cursor-pointer outline-none">
                      {planetGlow && <circle cx={x} cy={y} r="34" fill={planetGlow} />}
                      {active && <circle cx={x} cy={y} r="20" fill="none" stroke={body.color} strokeOpacity=".3" strokeWidth="7" />}
                      <circle cx={x} cy={y} r={active ? 12 : 9} fill="#07111e" stroke={body.color} strokeWidth={active ? "2.5" : "1.7"} />
                      <text x={x} y={y + 4.5} textAnchor="middle" fill={body.color} fontSize={active ? "14" : "12"} fontWeight="700">{body.glyph}</text>
                      <title>{body.name} · {body.display} · {body.house}{body.retrograde ? " · Retrograde" : ""}</title>
                    </g>
                  );
                })}
              </g>

              {SIGNS.map((sign, index) => {
                const longitude = index * 30 + 15;
                const x = domeX(longitude);
                const y = domeY(longitude) + 34;
                return (
                  <g key={sign}>
                    <rect x={x - 17} y={y - 11} width="34" height="19" rx="7" fill="#0b1726" stroke="#d9c393" strokeOpacity=".22" />
                    <text x={x} y={y + 2} textAnchor="middle" fill="#e8d4a8" fontSize="9" fontWeight="700" letterSpacing=".8">{sign}</text>
                  </g>
                );
              })}

              {selected && <SelectedAnnotation body={selected} x={selectedX} y={selectedY} />}

              <path d="M54 417 Q400 385 746 417 L746 477 Q400 524 54 477Z" fill="url(#atlas-earth)" stroke="#72cfda" strokeOpacity=".72" strokeWidth="1.6" />
              <path d="M68 427 Q400 399 732 427" fill="none" stroke="#9be1e3" strokeOpacity=".42" strokeWidth="1" />
              <path d="M90 442 Q400 417 710 442" fill="none" stroke="#82c9d4" strokeOpacity=".2" strokeWidth="1" strokeDasharray="3 8" />
              <path d="M128 461 Q400 490 672 461" fill="none" stroke="#82c9d4" strokeOpacity=".17" strokeWidth="1" />
              <path d="M400 407 Q400 457 400 493" fill="none" stroke="#a4d9dc" strokeOpacity=".18" strokeDasharray="4 6" />
              <path d="M198 410 Q215 452 247 493M602 410 Q585 452 553 493" fill="none" stroke="#a4d9dc" strokeOpacity=".1" />
              <text x="400" y="448" textAnchor="middle" fill="#edf3ef" fontSize="12" fontWeight="700" letterSpacing="3">THE LEVEL EARTH PLANE</text>
              <text x="400" y="468" textAnchor="middle" fill="#9cc6ca" fontSize="9" letterSpacing="1.8">BELOW THE FIXED CELESTIAL DOME</text>
              <text x="400" y="517" textAnchor="middle" fill="#7e99af" fontSize="9" fontWeight="600" letterSpacing="1.4">SKY LONGITUDE · 0° ARIES — 360° PISCES</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] bg-black/15 px-4 py-3 text-[10px] text-slate-400 sm:px-6">
            {(Object.keys(LAYERS) as Layer[]).map(key => (
              <span key={key} className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: LAYERS[key].color, boxShadow: `0 0 8px ${LAYERS[key].color}70` }} />{LAYERS[key].label}</span>
            ))}
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rotate-45 border border-[#f2d393] bg-[#f2d393]/30" />Four Royal Star references</span>
            <span className="ml-auto text-slate-500">Fine dashed connectors show chart aspects — never orbital tracks</span>
          </div>
        </div>

        <aside className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-gradient-to-b from-[#101a2a] to-[#0a101b] shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/[0.07] px-4 py-4">
            <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-200/70">At this place in the sky</div>
            {selected ? (
              <>
                <h4 className="mt-3 flex items-center gap-2 font-serif text-2xl text-[#f4eddf]"><span style={{ color: selected.color }}>{selected.glyph}</span>{selected.name}</h4>
                <p className="mt-1 font-mono text-sm text-cyan-100">{formatLongitude(selected.longitude)}</p>
                <p className="mt-1 text-xs text-slate-400">{selected.house}{selected.retrograde ? " · Retrograde" : ""}</p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-slate-400">Choose a chart time and place to plot the calculated sky.</p>
            )}
          </div>

          {selected && (
            <div className="grid grid-cols-2 gap-1.5 p-3">
              {activeRows.map(body => (
                <button key={body.name} type="button" onClick={() => setSelectedName(body.name)}
                  className={`flex items-center justify-between gap-1 rounded-xl border px-2.5 py-2.5 text-left text-[11px] transition ${body.name === selected.name ? "border-cyan-100/30 bg-cyan-200/[0.08] text-white" : "border-white/[0.06] bg-black/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.03]"}`}>
                  <span className="flex items-center gap-1.5"><span className="text-sm" style={{ color: body.color }}>{body.glyph}</span>{body.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">{Math.floor(body.longitude)}°</span>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.07] px-4 py-4">
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">
              <span>Aspect patterns</span><span className="rounded-full bg-white/[0.06] px-2 py-1 text-cyan-100">{aspects.length}</span>
            </div>
            {aspects.length ? (
              <ul className="mt-3 space-y-2">
                {aspects.slice(0, 6).map((aspect, index) => (
                  <li key={index} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex items-center gap-2 text-slate-300"><i className="h-1.5 w-1.5 rounded-full" style={{ background: aspect.color }} />{aspect.a.name} <span className="text-slate-500">{aspect.label.toLowerCase()}</span> {aspect.b.name}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500">{aspect.orb.toFixed(1)}°</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">No close aspects in this chart layer.</p>
            )}
          </div>
          <div className="border-t border-white/[0.07] bg-black/15 px-4 py-3 text-[10px] leading-relaxed text-slate-500">
            Sky positions are calculated from the selected time and place. This dome atlas is an interpretive chart view, not a physical survey.
          </div>
        </aside>
      </div>
    </section>
  );
}
