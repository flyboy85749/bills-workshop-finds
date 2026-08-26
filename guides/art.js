// Per-guide illustration registry. Data only — rendering lives in art-render.js.
//
// Every scene is 800x500 (16:10) and every badge is 480x320 (3:2). Motifs share
// one substrate so twelve guides read as one site: cream ground, brass hairline
// frame, a dashed navy route line, flat 2px strokes, no gradients inside objects.
//
// `currentColor` resolves to the accent — art-render.js sets `color` on the
// wrapper — so a motif recolors without editing its path data.

const FRAME = `<rect x="1" y="1" width="798" height="498" rx="18" fill="#fbf6ed" stroke="#c99c54" stroke-width="2"/>`;
const BADGE_FRAME = `<rect x="1" y="1" width="478" height="318" rx="14" fill="none" stroke="#c99c54" stroke-width="2"/>`;

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
      ${BADGE_FRAME}
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
      ${BADGE_FRAME}
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

// Filled in Task 5.
export const homeArt = "";

// Filled in Task 6.
export const categoryArt = {};
