import "./FirmamentDomeIllustration.css";

export function FirmamentDomeIllustration() {
  return (
    <figure className="fg-dome-figure">
      <svg
        viewBox="0 0 520 370"
        className="fg-dome-svg"
        role="img"
        aria-label="Genesis-inspired cosmography: a level Earth plane below a curved celestial dome, with the Sun, Moon, and fixed stars above."
      >
        <defs>
          <linearGradient id="fg-dome-sky" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#0b2435" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#113b58" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#151630" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="fg-earth-plane" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#183c48" />
            <stop offset="52%" stopColor="#102c3c" />
            <stop offset="100%" stopColor="#091b2b" />
          </linearGradient>
          <radialGradient id="fg-sun-glow">
            <stop offset="0%" stopColor="#f4db9a" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#f4db9a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d="M34 284 Q260 17 486 284 L486 285 L34 285 Z" fill="url(#fg-dome-sky)" />
        <path d="M34 284 Q260 17 486 284" fill="none" stroke="#93dce9" strokeOpacity="0.78" strokeWidth="2" />
        <path d="M67 284 Q260 51 453 284" fill="none" stroke="#76cbdc" strokeOpacity="0.32" strokeWidth="1" />
        <path d="M119 284 Q260 109 401 284" fill="none" stroke="#76cbdc" strokeOpacity="0.22" strokeWidth="1" />
        <path d="M260 23 Q260 155 260 282" fill="none" stroke="#92dbe8" strokeOpacity="0.22" strokeDasharray="3 6" />
        <path d="M124 122 Q182 198 205 282" fill="none" stroke="#92dbe8" strokeOpacity="0.13" />
        <path d="M396 122 Q338 198 315 282" fill="none" stroke="#92dbe8" strokeOpacity="0.13" />

        <path d="M74 272 Q260 88 446 272" fill="none" stroke="#ecd29a" strokeOpacity="0.76" strokeWidth="2" strokeDasharray="5 7" />
        <path d="M439 265 L451 272 L439 279" fill="none" stroke="#ecd29a" strokeOpacity="0.8" strokeWidth="1.5" />

        <circle cx="145" cy="216" r="38" fill="url(#fg-sun-glow)" />
        <circle cx="145" cy="216" r="12" fill="#f3d589" />
        <text x="145" y="220" textAnchor="middle" fill="#1b2532" fontSize="13" fontWeight="700">☉</text>
        <text x="145" y="242" textAnchor="middle" fill="#f2d7a2" fontSize="8" letterSpacing="1.1">SUN</text>

        <circle cx="373" cy="205" r="11" fill="#d8edf1" />
        <circle cx="378" cy="201" r="10" fill="#0f2638" />
        <text x="373" y="235" textAnchor="middle" fill="#c3e6ed" fontSize="8" letterSpacing="1.1">MOON</text>

        <circle cx="222" cy="126" r="2.2" fill="#f5e8c2" />
        <circle cx="282" cy="84" r="2.8" fill="#f5e8c2" />
        <circle cx="320" cy="137" r="1.8" fill="#9de2ed" />
        <circle cx="192" cy="169" r="1.6" fill="#9de2ed" />
        <circle cx="341" cy="169" r="1.5" fill="#f5e8c2" />
        <circle cx="262" cy="64" r="1.8" fill="#f5e8c2" />
        <circle cx="114" cy="199" r="1.5" fill="#c9b8f2" />
        <circle cx="412" cy="228" r="1.7" fill="#c9b8f2" />

        <text x="260" y="47" textAnchor="middle" fill="#a8dce6" fontSize="9" fontWeight="700" letterSpacing="2.1">CELESTIAL DOME</text>
        <text x="260" y="274" textAnchor="middle" fill="#e5ca91" fontSize="8" fontWeight="700" letterSpacing="1.4">THE SKY ABOVE</text>

        <path d="M34 284 Q260 255 486 284 Q260 329 34 284 Z" fill="url(#fg-earth-plane)" stroke="#83d2df" strokeOpacity="0.74" strokeWidth="1.5" />
        <path d="M58 284 Q260 267 462 284" fill="none" stroke="#87d2df" strokeOpacity="0.28" strokeWidth="1" />
        <path d="M94 293 Q260 311 426 293" fill="none" stroke="#87d2df" strokeOpacity="0.17" strokeWidth="1" />
        <text x="260" y="296" textAnchor="middle" fill="#eff6f7" fontSize="9" fontWeight="700" letterSpacing="1.5">LEVEL EARTH PLANE</text>
        <text x="260" y="341" textAnchor="middle" fill="#91a9bc" fontSize="8" letterSpacing="1.15">GENESIS 1:6–8 · FIRMAMENT VIEW</text>
      </svg>
      <figcaption>
        Illustrative Genesis-inspired cosmography. Planet positions in the charts remain calculated from the selected time and place.
      </figcaption>
    </figure>
  );
}
