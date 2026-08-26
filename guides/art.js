// Per-guide illustration registry. Data only — rendering lives in art-render.js.
//
// Every scene is 800x500 (16:10) and every badge is 480x320 (3:2). Motifs share
// one substrate so twelve guides read as one site: a dashed navy route line,
// flat 2px strokes, no gradients inside objects.
//
// Scenes carry FRAME -- a cream ground inside a brass hairline -- because they
// sit alone on a guide page. Badges carry neither: they sit edge-to-edge inside
// a .guide-card that already has its own rounded border, so a frame inside a
// frame reads as boxy, and their ground comes from the card's --accent-soft.
//
// `currentColor` resolves to the accent — art-render.js sets `color` on the
// wrapper — so a motif recolors without editing its path data.

const FRAME = `<rect x="1" y="1" width="798" height="498" rx="18" fill="#fbf6ed" stroke="#c99c54" stroke-width="2"/>`;

export const guideArt = {
  "cozy-fall-finds": {
    accent: "#b4552f",
    accentSoft: "#f6e7dc",
    label: "Falling leaves, a string of warm lights and a steaming mug",
    scene: `
      ${FRAME}
      <path d="M40 300 C 200 240, 320 360, 470 280 S 700 220, 760 260"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g stroke="#102a43" stroke-width="2" fill="none">
        <circle cx="130" cy="286" r="13" fill="currentColor"/>
        <circle cx="248" cy="316" r="13" fill="#c99c54"/>
        <circle cx="366" cy="300" r="13" fill="currentColor"/>
        <circle cx="484" cy="272" r="13" fill="#c99c54"/>
        <circle cx="602" cy="246" r="13" fill="currentColor"/>
      </g>
      <g transform="translate(150 120)">
        <path d="M0 60 C 0 20, 34 -8, 70 0 C 106 8, 118 48, 96 76
                 C 74 104, 26 100, 0 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M4 62 L 96 22" stroke="#102a43" stroke-width="2" fill="none"/>
      </g>
      <g transform="translate(470 330)">
        <rect x="0" y="0" width="120" height="86" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M120 22 h 22 a 20 20 0 0 1 0 40 h -22"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <path d="M0 30 h 120" stroke="currentColor" stroke-width="8"/>
        <g stroke="#102a43" stroke-width="2" fill="none" opacity=".6">
          <path d="M34 -14 c 10 -12, -10 -20, 0 -32"/>
          <path d="M62 -14 c 10 -12, -10 -20, 0 -32"/>
          <path d="M90 -14 c 10 -12, -10 -20, 0 -32"/>
        </g>
      </g>`,
    badge: `
      <path d="M20 200 C 130 160, 220 240, 320 190 S 440 150, 462 172"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(74 74) scale(.8)">
        <path d="M0 60 C 0 20, 34 -8, 70 0 C 106 8, 118 48, 96 76
                 C 74 104, 26 100, 0 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
        <path d="M4 62 L 96 22" stroke="#102a43" stroke-width="2.5" fill="none"/>
      </g>
      <g transform="translate(280 176) scale(.82)">
        <rect x="0" y="0" width="120" height="86" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.5"/>
        <path d="M120 22 h 22 a 20 20 0 0 1 0 40 h -22"
              fill="none" stroke="#102a43" stroke-width="2.5"/>
        <path d="M0 30 h 120" stroke="currentColor" stroke-width="8"/>
      </g>`
  },

  "student-pilot-gifts": {
    accent: "#2f6f73",
    accentSoft: "#dde9ea",
    label: "A sectional chart wedge, a headset and a compass rose",
    scene: `
      ${FRAME}
      <path d="M60 420 C 220 380, 300 200, 460 170 S 700 140, 756 96"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(96 96)">
        <path d="M0 0 h 250 l -40 210 h -250 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <g stroke="currentColor" stroke-width="2" fill="none" opacity=".75">
          <path d="M16 44 h 214"/><path d="M8 92 h 214"/>
          <path d="M0 140 h 214"/><path d="M-8 188 h 214"/>
        </g>
        <circle cx="118" cy="104" r="30" fill="none"
                stroke="#102a43" stroke-width="2"/>
        <circle cx="118" cy="104" r="4" fill="currentColor"/>
      </g>
      <g transform="translate(470 210)">
        <path d="M0 90 V 44 a 66 66 0 0 1 132 0 V 90"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="-16" y="86" width="34" height="66" rx="16"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="114" y="86" width="34" height="66" rx="16"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M18 130 h -34 a 26 26 0 0 0 -26 26 v 20"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <circle cx="-42" cy="182" r="6" fill="#c99c54"/>
      </g>
      <g transform="translate(640 372)">
        <circle r="42" fill="none" stroke="#c99c54" stroke-width="2"/>
        <path d="M0 -46 L 11 0 L 0 46 L -11 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M-46 0 h 92" stroke="#102a43" stroke-width="2" opacity=".4"/>
      </g>`,
    badge: `
      <path d="M24 268 C 130 236, 180 120, 300 100 S 440 74, 460 52"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(44 56) scale(.62)">
        <path d="M0 0 h 250 l -40 210 h -250 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <g stroke="currentColor" stroke-width="3" fill="none" opacity=".75">
          <path d="M16 44 h 214"/><path d="M8 92 h 214"/><path d="M0 140 h 214"/>
        </g>
        <circle cx="118" cy="104" r="30" fill="none"
                stroke="#102a43" stroke-width="3"/>
        <circle cx="118" cy="104" r="6" fill="currentColor"/>
      </g>
      <g transform="translate(322 150) scale(.66)">
        <circle r="42" fill="none" stroke="#c99c54" stroke-width="3"/>
        <path d="M0 -46 L 11 0 L 0 46 L -11 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M-46 0 h 92" stroke="#102a43" stroke-width="3" opacity=".4"/>
      </g>`
  }
};

// The home hero. A navy pegboard with one motif per category, replacing the
// travel board — the hero used to say "travel" while the site now spans dogs,
// teachers, kitchens and tools.
export const homeArt = `
  <rect width="800" height="560" rx="34" fill="#071b2d"/>
  <g fill="#dbeaf0" opacity=".13">
    ${Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 12 }, (_, col) =>
        `<circle cx="${64 + col * 62}" cy="${70 + row * 62}" r="4"/>`
      ).join("")
    ).join("")}
  </g>
  <path d="M70 300 C 240 232, 380 366, 540 292 S 740 236, 760 268"
        fill="none" stroke="#dbeaf0" stroke-width="2"
        stroke-dasharray="11 10" opacity=".38"/>

  <g transform="translate(78 92)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(30 26)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="14" y="22" width="58" height="42" rx="7" fill="#e46f55"/>
      <path d="M28 22 v -9 a 8 8 0 0 1 8 -8 h 14 a 8 8 0 0 1 8 8 v 9"/>
      <path d="M72 44 h 30" stroke-dasharray="6 5"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Travel</text>
  </g>

  <g transform="translate(288 66)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(44 30)" stroke="#102a43" stroke-width="2.5">
      <ellipse cx="18" cy="34" rx="15" ry="19" fill="#c99c54"/>
      <circle cx="4" cy="10" r="7.5" fill="#c99c54"/>
      <circle cx="24" cy="4" r="7.5" fill="#c99c54"/>
      <circle cx="44" cy="12" r="7.5" fill="#c99c54"/>
      <circle cx="52" cy="32" r="7.5" fill="#c99c54"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Dog lovers</text>
  </g>

  <g transform="translate(498 96)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(46 24)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="20" width="70" height="46" rx="6" fill="#2f6f73"/>
      <path d="M0 34 h 70"/>
      <path d="M35 20 v -10 m -14 0 h 28"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Gifts</text>
  </g>

  <g transform="translate(112 336)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(40 26)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="6" width="82" height="54" rx="5" fill="#102a43"/>
      <path d="M12 24 h 40 M12 38 h 26" stroke="#fbf6ed"/>
      <path d="M0 60 h 82" stroke="#c99c54" stroke-width="4"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Teachers</text>
  </g>

  <g transform="translate(322 362)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(50 22)" stroke="#102a43" stroke-width="2.5" fill="none">
      <path d="M34 4 l 9 22 h 23 l -19 16 7 24 -20 -14 -20 14 7 -24 -19 -16 h 23 Z"
            fill="#e46f55"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Seasonal</text>
  </g>

  <g transform="translate(532 332)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(44 28)" stroke="#102a43" stroke-width="2.5" fill="none">
      <path d="M6 50 L 44 12" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 6 l 18 18 -10 10 -18 -18 Z" fill="#c99c54"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Workshop</text>
  </g>

  <text x="600" y="524" font-size="13" letter-spacing="3.4"
        fill="#dbeaf0" font-weight="700">CURATED BY BILL</text>`;

// Filled in Task 6.
export const categoryArt = {};
