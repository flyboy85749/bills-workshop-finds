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
              fill="#fffdf8" stroke="#102a43" stroke-width="3.2"/>
        <g stroke="currentColor" stroke-width="3.2" fill="none" opacity=".75">
          <path d="M16 44 h 214"/><path d="M8 92 h 214"/><path d="M0 140 h 214"/>
        </g>
        <circle cx="118" cy="104" r="30" fill="none"
                stroke="#102a43" stroke-width="3.2"/>
        <circle cx="118" cy="104" r="6" fill="currentColor"/>
      </g>
      <g transform="translate(322 150) scale(.66)">
        <circle r="42" fill="none" stroke="#c99c54" stroke-width="3"/>
        <path d="M0 -46 L 11 0 L 0 46 L -11 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M-46 0 h 92" stroke="#102a43" stroke-width="3" opacity=".4"/>
      </g>`
  },

  "first-solo-flight-gifts": {
    accent: "#5c7f34",
    accentSoft: "#e6edda",
    label: "A cut shirttail pinned to a wall, a high-wing trainer and a windsock",
    scene: `
      ${FRAME}
      <path d="M56 128 C 150 96, 300 104, 392 148 S 640 300, 752 396"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(92 120)">
        <path d="M0 0 h 200 v 140 l -25 18 l -25 -16 l -25 18 l -25 -16
                 l -25 18 l -25 -16 l -25 18 l -25 -16 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <g stroke="currentColor" stroke-width="2" fill="none" opacity=".75">
          <path d="M28 52 h 144"/><path d="M28 88 h 108"/>
        </g>
        <path d="M28 118 h 76" stroke="#102a43" stroke-width="2" opacity=".55"/>
        <circle cx="100" cy="-14" r="9" fill="#c99c54"
                stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(538 176)">
        <path d="M-34 -76 h 68" stroke="#102a43" stroke-width="2"/>
        <rect x="-13" y="-70" width="26" height="150" rx="13"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="-115" y="-44" width="230" height="24" rx="10"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="-48" y="54" width="96" height="18" rx="9"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(636 322)">
        <path d="M0 0 v 118" stroke="#102a43" stroke-width="2"/>
        <path d="M0 6 L 42 18 L 42 44 L 0 58 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M42 18 L 78 26 L 78 40 L 42 44 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M78 26 L 108 31 L 108 37 L 78 40 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
      </g>`,
    badge: `
      <path d="M22 82 C 110 52, 210 66, 282 106 S 428 208, 464 244"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(46 78) scale(.72)">
        <path d="M0 0 h 200 v 140 l -25 18 l -25 -16 l -25 18 l -25 -16
                 l -25 18 l -25 -16 l -25 18 l -25 -16 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.8"/>
        <g stroke="currentColor" stroke-width="2.8" fill="none" opacity=".75">
          <path d="M28 52 h 144"/><path d="M28 88 h 108"/>
        </g>
        <circle cx="100" cy="-14" r="10" fill="#c99c54"
                stroke="#102a43" stroke-width="2.8"/>
      </g>
      <g transform="translate(348 150) scale(.62)">
        <path d="M-34 -76 h 68" stroke="#102a43" stroke-width="3"/>
        <rect x="-13" y="-70" width="26" height="150" rx="13"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <rect x="-115" y="-44" width="230" height="24" rx="10"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <rect x="-48" y="54" width="96" height="18" rx="9"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
      </g>`
  },

  "checkride-prep-gifts": {
    accent: "#8f3f76",
    accentSoft: "#f0dfec",
    label: "A checklist clipboard, a stack of study books and a sealed certificate",
    scene: `
      ${FRAME}
      <path d="M46 388 C 180 356, 268 300, 386 306 S 640 268, 760 148"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(80 132)">
        <rect x="0" y="0" width="180" height="228" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="60" y="-14" width="60" height="26" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <g stroke="#102a43" stroke-width="2" opacity=".45" fill="none">
          <path d="M68 58 h 88"/><path d="M68 110 h 88"/><path d="M68 162 h 60"/>
        </g>
        <g fill="none" stroke="currentColor" stroke-width="4"
           stroke-linecap="round" stroke-linejoin="round">
          <path d="M26 58 l 10 10 l 18 -22"/>
          <path d="M26 110 l 10 10 l 18 -22"/>
        </g>
      </g>
      <g transform="translate(322 316)">
        <rect x="0" y="60" width="180" height="30" rx="6"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="10" y="30" width="164" height="30" rx="6"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="-6" y="0" width="176" height="30" rx="6"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M18 74 h 56" stroke="#102a43" stroke-width="2" opacity=".5"/>
      </g>
      <g transform="translate(520 120)">
        <rect x="0" y="0" width="200" height="140" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="12" y="12" width="176" height="116" rx="4"
              fill="none" stroke="#c99c54" stroke-width="2"/>
        <g stroke="#102a43" stroke-width="2" opacity=".45" fill="none">
          <path d="M32 44 h 136"/><path d="M32 70 h 100"/>
        </g>
        <circle cx="150" cy="102" r="18"
                fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M138 114 l -6 26 l 18 -10 l 18 10 l -6 -26"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
      </g>`,
    badge: `
      <path d="M20 250 C 120 224, 200 176, 300 178 S 440 140, 462 96"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(46 52) scale(.62)">
        <rect x="0" y="0" width="180" height="228" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.2"/>
        <rect x="60" y="-14" width="60" height="26" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="3.2"/>
        <g stroke="#102a43" stroke-width="3.2" opacity=".45" fill="none">
          <path d="M68 58 h 88"/><path d="M68 110 h 88"/><path d="M68 162 h 60"/>
        </g>
        <g fill="none" stroke="currentColor" stroke-width="6"
           stroke-linecap="round" stroke-linejoin="round">
          <path d="M26 58 l 10 10 l 18 -22"/>
          <path d="M26 110 l 10 10 l 18 -22"/>
        </g>
      </g>
      <g transform="translate(250 96) scale(.86)">
        <rect x="0" y="0" width="200" height="140" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.6"/>
        <rect x="12" y="12" width="176" height="116" rx="4"
              fill="none" stroke="#c99c54" stroke-width="2.6"/>
        <g stroke="#102a43" stroke-width="2.6" opacity=".45" fill="none">
          <path d="M32 44 h 136"/><path d="M32 70 h 100"/>
        </g>
        <circle cx="150" cy="102" r="18"
                fill="currentColor" stroke="#102a43" stroke-width="2.6"/>
        <path d="M138 114 l -6 26 l 18 -10 l 18 10 l -6 -26"
              fill="currentColor" stroke="#102a43" stroke-width="2.6"/>
      </g>`
  },

  "new-private-pilot-gifts": {
    accent: "#2f7d3f",
    accentSoft: "#dbeddd",
    label: "A pinned wall map, a high-wing aircraft in profile and a packed duffel",
    scene: `
      ${FRAME}
      <path d="M44 132 C 170 100, 300 128, 400 176 S 632 268, 762 262"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(84 158)">
        <rect x="0" y="0" width="230" height="172" rx="10"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M22 122 C 62 100, 78 46, 124 38 C 166 32, 190 66, 210 56"
              fill="none" stroke="currentColor" stroke-width="2" opacity=".7"/>
        <g fill="#c99c54" stroke="#102a43" stroke-width="2">
          <circle cx="46" cy="116" r="8"/>
          <circle cx="126" cy="40" r="8"/>
          <circle cx="196" cy="128" r="8"/>
        </g>
      </g>
      <g transform="translate(448 176)">
        <path d="M0 12 l -16 -20 M0 34 l -16 20"
              stroke="#102a43" stroke-width="2" fill="none"/>
        <rect x="46" y="-16" width="152" height="14" rx="7"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="0" width="240" height="46" rx="23"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M186 2 L 236 -52 L 252 -52 L 244 2 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="72" cy="58" r="14"
                fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="202" cy="56" r="10"
                fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(524 344)">
        <path d="M40 0 c 10 -22, 60 -22, 70 0"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="0" width="150" height="76" rx="34"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M0 38 h 150" stroke="#102a43" stroke-width="2" opacity=".45"/>
      </g>`,
    badge: `
      <path d="M18 92 C 110 62, 210 84, 288 122 S 440 178, 466 176"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(40 92) scale(.72)">
        <rect x="0" y="0" width="230" height="172" rx="10"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.8"/>
        <path d="M22 122 C 62 100, 78 46, 124 38 C 166 32, 190 66, 210 56"
              fill="none" stroke="currentColor" stroke-width="2.8" opacity=".7"/>
        <g fill="#c99c54" stroke="#102a43" stroke-width="2.8">
          <circle cx="46" cy="116" r="9"/>
          <circle cx="126" cy="40" r="9"/>
          <circle cx="196" cy="128" r="9"/>
        </g>
      </g>
      <g transform="translate(232 116) scale(.72)">
        <path d="M0 12 l -16 -20 M0 34 l -16 20"
              stroke="#102a43" stroke-width="3" fill="none"/>
        <rect x="46" y="-16" width="152" height="14" rx="7"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <rect x="0" y="0" width="240" height="46" rx="23"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M186 2 L 236 -52 L 252 -52 L 244 2 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <circle cx="72" cy="58" r="14"
                fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <circle cx="202" cy="56" r="10"
                fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
      </g>`
  },

  "travel-essentials": {
    accent: "#1f5f8b",
    accentSoft: "#dde8f0",
    label: "A rolling cabin bag, a luggage tag and a dashed route arc",
    scene: `
      ${FRAME}
      <path d="M56 392 C 210 316, 330 208, 470 178 S 700 138, 750 92"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <circle cx="56" cy="392" r="8" fill="#c99c54"
              stroke="#102a43" stroke-width="2"/>
      <circle cx="750" cy="92" r="8" fill="#c99c54"
              stroke="#102a43" stroke-width="2"/>
      <g transform="translate(120 140)">
        <path d="M52 40 V 12 a 12 12 0 0 1 12 -12 h 52 a 12 12 0 0 1 12 12 V 40"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="40" width="180" height="230" rx="24"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M0 96 h 180" stroke="#102a43" stroke-width="2" opacity=".45"/>
        <path d="M0 150 h 180" stroke="#c99c54" stroke-width="10"/>
        <circle cx="36" cy="288" r="16" fill="#fffdf8"
                stroke="#102a43" stroke-width="2"/>
        <circle cx="144" cy="288" r="16" fill="#fffdf8"
                stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(520 168)">
        <path d="M24 12 C 4 -14, 22 -46, 54 -42 C 82 -38, 84 -12, 56 -6"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="0" width="152" height="104" rx="16"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="24" cy="24" r="8" fill="none"
                stroke="#102a43" stroke-width="2"/>
        <path d="M30 58 h 96" stroke="currentColor" stroke-width="8"/>
        <path d="M30 80 h 62" stroke="currentColor" stroke-width="8"/>
      </g>`,
    badge: `
      <path d="M18 262 C 120 208, 210 150, 306 118 S 448 62, 466 44"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(56 52) scale(.66)">
        <path d="M52 40 V 12 a 12 12 0 0 1 12 -12 h 52 a 12 12 0 0 1 12 12 V 40"
              fill="none" stroke="#102a43" stroke-width="3"/>
        <rect x="0" y="40" width="180" height="230" rx="24"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M0 150 h 180" stroke="#c99c54" stroke-width="10"/>
        <circle cx="36" cy="288" r="16" fill="#fffdf8"
                stroke="#102a43" stroke-width="3"/>
        <circle cx="144" cy="288" r="16" fill="#fffdf8"
                stroke="#102a43" stroke-width="3"/>
      </g>
      <g transform="translate(292 122) scale(.9)">
        <path d="M24 12 C 4 -14, 22 -46, 54 -42 C 82 -38, 84 -12, 56 -6"
              fill="none" stroke="#102a43" stroke-width="2.2"/>
        <rect x="0" y="0" width="152" height="104" rx="16"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
        <circle cx="24" cy="24" r="8" fill="none"
                stroke="#102a43" stroke-width="2.2"/>
        <path d="M30 58 h 96" stroke="currentColor" stroke-width="8"/>
        <path d="M30 80 h 62" stroke="currentColor" stroke-width="8"/>
      </g>`
  },

  "flight-attendant-dog-gifts": {
    accent: "#7b5ea7",
    accentSoft: "#e8e2f1",
    label: "A dog watching from a window, a pair of crew wings and a bone",
    scene: `
      ${FRAME}
      <path d="M46 404 C 200 436, 330 302, 470 268 S 700 198, 758 136"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(90 110)">
        <rect x="0" y="0" width="264" height="244" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M132 0 V 244 M0 122 H 264"
              stroke="#102a43" stroke-width="2" opacity=".45"/>
        <g transform="translate(132 96)">
          <path d="M-58 148 v -34 a 58 42 0 0 1 116 0 v 34 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2"/>
          <path d="M-38 6 C -72 12, -76 66, -52 88 C -36 100, -26 86, -30 66 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2"/>
          <path d="M38 6 C 72 12, 76 66, 52 88 C 36 100, 26 86, 30 66 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2"/>
          <ellipse cx="0" cy="30" rx="46" ry="42"
                   fill="currentColor" stroke="#102a43" stroke-width="2"/>
          <ellipse cx="0" cy="54" rx="19" ry="14"
                   fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
          <circle cx="0" cy="44" r="6" fill="#102a43"/>
          <circle cx="-17" cy="22" r="4.5" fill="#102a43"/>
          <circle cx="17" cy="22" r="4.5" fill="#102a43"/>
        </g>
        <rect x="-16" y="244" width="296" height="18" rx="6"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(590 200) scale(.72)">
        <path d="M-26 -14 C -70 -22, -128 -14, -152 4 C -126 16, -66 18, -26 6 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="2.8"/>
        <path d="M26 -14 C 70 -22, 128 -14, 152 4 C 126 16, 66 18, 26 6 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="2.8"/>
        <path d="M-46 -8 v 16 M-70 -8 v 18 M-94 -4 v 16
                 M46 -8 v 16 M70 -8 v 18 M94 -4 v 16"
              stroke="#102a43" stroke-width="2.8" opacity=".5"/>
        <path d="M-26 -26 h 52 v 30 C 26 22, 6 32, 0 38 C -6 32, -26 22, -26 4 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2.8"/>
      </g>
      <g transform="translate(620 370) scale(.66)">
        <path d="M-34 -12 C -34 -32, -66 -32, -66 -12 C -84 -12, -84 12, -66 12
                 C -66 32, -34 32, -34 12 h 68 C 34 32, 66 32, 66 12
                 C 84 12, 84 -12, 66 -12 C 66 -32, 34 -32, 34 -12 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
      </g>`,
    badge: `
      <path d="M20 254 C 132 232, 212 160, 312 130 S 450 88, 468 66"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(34 46) scale(.8)">
        <rect x="0" y="0" width="264" height="244" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.5"/>
        <path d="M132 0 V 244 M0 122 H 264"
              stroke="#102a43" stroke-width="2.5" opacity=".45"/>
        <g transform="translate(132 96)">
          <path d="M-58 148 v -34 a 58 42 0 0 1 116 0 v 34 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
          <path d="M-38 6 C -72 12, -76 66, -52 88 C -36 100, -26 86, -30 66 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
          <path d="M38 6 C 72 12, 76 66, 52 88 C 36 100, 26 86, 30 66 Z"
                fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
          <ellipse cx="0" cy="30" rx="46" ry="42"
                   fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
          <ellipse cx="0" cy="54" rx="19" ry="14"
                   fill="#fffdf8" stroke="#102a43" stroke-width="2.5"/>
          <circle cx="0" cy="44" r="7" fill="#102a43"/>
          <circle cx="-17" cy="22" r="5" fill="#102a43"/>
          <circle cx="17" cy="22" r="5" fill="#102a43"/>
        </g>
        <rect x="-16" y="244" width="296" height="18" rx="6"
              fill="#c99c54" stroke="#102a43" stroke-width="2.5"/>
      </g>
      <g transform="translate(362 176) scale(.6)">
        <path d="M-26 -14 C -70 -22, -128 -14, -152 4 C -126 16, -66 18, -26 6 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="3.3"/>
        <path d="M26 -14 C 70 -22, 128 -14, 152 4 C 126 16, 66 18, 26 6 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="3.3"/>
        <path d="M-26 -26 h 52 v 30 C 26 22, 6 32, 0 38 C -6 32, -26 22, -26 4 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3.3"/>
      </g>`
  },

  "elementary-classroom-essentials": {
    accent: "#3f6152",
    accentSoft: "#dfe8e3",
    label: "A rolling classroom cart, a cup of pencils and a name tag",
    scene: `
      ${FRAME}
      <path d="M44 388 C 190 432, 300 322, 452 330 S 690 372, 762 296"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(110 120)">
        <path d="M14 8 a 14 14 0 0 1 14 -14 h 120 a 14 14 0 0 1 14 14"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <path d="M14 8 V 312 M162 8 V 312"
              stroke="#102a43" stroke-width="2"/>
        <rect x="-8" y="70" width="192" height="46" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="-8" y="162" width="192" height="46" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="-8" y="254" width="192" height="46" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M64 92 h 48 M64 184 h 48 M64 276 h 48"
              stroke="#102a43" stroke-width="2" opacity=".5"/>
        <circle cx="16" cy="330" r="15" fill="#fffdf8"
                stroke="#102a43" stroke-width="2"/>
        <circle cx="160" cy="330" r="15" fill="#fffdf8"
                stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(430 258)">
        <g transform="translate(16 -72) rotate(-8)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
          <rect x="0" y="0" width="17" height="96"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        </g>
        <g transform="translate(42 -84)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
          <rect x="0" y="0" width="17" height="108"
                fill="currentColor" stroke="#102a43" stroke-width="2"/>
        </g>
        <g transform="translate(68 -74) rotate(9)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
          <rect x="0" y="0" width="17" height="96"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        </g>
        <path d="M0 0 h 100 l -11 112 h -78 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M4 34 h 92" stroke="currentColor" stroke-width="10"/>
      </g>
      <g transform="translate(590 150)">
        <path d="M78 0 v -26" stroke="#102a43" stroke-width="2"/>
        <circle cx="78" cy="-34" r="9" fill="none"
                stroke="#c99c54" stroke-width="3"/>
        <rect x="0" y="0" width="158" height="106" rx="14"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M2 32 h 154 v -18 a 12 12 0 0 0 -12 -12 h -130
                 a 12 12 0 0 0 -12 12 Z" fill="currentColor"/>
        <path d="M0 32 h 158" stroke="#102a43" stroke-width="2"/>
        <path d="M24 58 h 110" stroke="#102a43" stroke-width="5" opacity=".6"/>
        <path d="M24 80 h 72" stroke="#c99c54" stroke-width="5"/>
      </g>`,
    badge: `
      <path d="M18 236 C 120 270, 210 190, 306 200 S 448 242, 468 206"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(44 34) scale(.68)">
        <path d="M14 8 a 14 14 0 0 1 14 -14 h 120 a 14 14 0 0 1 14 14"
              fill="none" stroke="#102a43" stroke-width="3"/>
        <path d="M14 8 V 312 M162 8 V 312"
              stroke="#102a43" stroke-width="3"/>
        <rect x="-8" y="70" width="192" height="46" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <rect x="-8" y="162" width="192" height="46" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <rect x="-8" y="254" width="192" height="46" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="3"/>
        <circle cx="16" cy="330" r="15" fill="#fffdf8"
                stroke="#102a43" stroke-width="3"/>
        <circle cx="160" cy="330" r="15" fill="#fffdf8"
                stroke="#102a43" stroke-width="3"/>
      </g>
      <g transform="translate(308 142) scale(.9)">
        <g transform="translate(16 -72) rotate(-8)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
          <rect x="0" y="0" width="17" height="96"
                fill="#c99c54" stroke="#102a43" stroke-width="2.2"/>
        </g>
        <g transform="translate(42 -84)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
          <rect x="0" y="0" width="17" height="108"
                fill="currentColor" stroke="#102a43" stroke-width="2.2"/>
        </g>
        <g transform="translate(68 -74) rotate(9)">
          <path d="M0 0 L 8.5 -20 L 17 0 Z"
                fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
          <rect x="0" y="0" width="17" height="96"
                fill="#c99c54" stroke="#102a43" stroke-width="2.2"/>
        </g>
        <path d="M0 0 h 100 l -11 112 h -78 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
        <path d="M4 34 h 92" stroke="currentColor" stroke-width="10"/>
      </g>`
  },

  "dog-lover-gifts": {
    accent: "#a8621c",
    accentSoft: "#f7e6d6",
    label: "Three paw prints crossing to a food bowl, with a leash hanging above",
    scene: `
      ${FRAME}
      <path d="M44 400 C 140 370, 220 326, 330 290 S 580 228, 762 200"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(150 350) rotate(-14)"
         fill="currentColor" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(258 306) rotate(-4)"
         fill="#c99c54" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(366 262) rotate(6)"
         fill="currentColor" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(600 96)" fill="none"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M0 -22 C -44 -22, -44 44, 0 44 C 44 44, 44 -22, 0 -22 Z"
              stroke="#102a43" stroke-width="17"/>
        <path d="M0 -22 C -44 -22, -44 44, 0 44 C 44 44, 44 -22, 0 -22 Z"
              stroke="currentColor" stroke-width="13"/>
        <path d="M0 44 C 6 92, 44 106, 38 146"
              stroke="#102a43" stroke-width="17"/>
        <path d="M0 44 C 6 92, 44 106, 38 146"
              stroke="currentColor" stroke-width="13"/>
      </g>
      <g transform="translate(638 242)">
        <rect x="-11" y="-4" width="22" height="26" rx="6"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M0 22 v 10 a 12 12 0 1 0 12 8"
              fill="none" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(470 336)">
        <path d="M0 0 C 0 74, 176 74, 176 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M10 26 C 46 50, 130 50, 166 26"
              fill="none" stroke="#c99c54" stroke-width="9"/>
        <ellipse cx="88" cy="0" rx="88" ry="19"
                 fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      </g>`,
    badge: `
      <path d="M18 252 C 100 226, 170 192, 250 162 S 420 120, 466 96"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(66 214) rotate(-14)"
         fill="currentColor" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(146 174) rotate(-4)"
         fill="#c99c54" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(226 136) rotate(6)"
         fill="currentColor" stroke="#102a43" stroke-width="2">
        <ellipse cx="0" cy="16" rx="27" ry="22"/>
        <circle cx="-25" cy="-12" r="10"/>
        <circle cx="-9" cy="-25" r="10"/>
        <circle cx="10" cy="-25" r="10"/>
        <circle cx="26" cy="-11" r="10"/>
      </g>
      <g transform="translate(292 158) scale(.9)">
        <path d="M0 0 C 0 74, 176 74, 176 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2.2"/>
        <path d="M10 26 C 46 50, 130 50, 166 26"
              fill="none" stroke="#c99c54" stroke-width="9"/>
        <ellipse cx="88" cy="0" rx="88" ry="19"
                 fill="#fffdf8" stroke="#102a43" stroke-width="2.2"/>
      </g>`
  },

  "first-apartment-tools": {
    accent: "#4a6572",
    accentSoft: "#e2e8eb",
    label: "A screwdriver, a spirit level with its bubble centered and two hex keys",
    scene: `
      ${FRAME}
      <path d="M46 190 C 168 156, 246 372, 418 404 S 688 402, 760 316"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(110 300) rotate(-24)">
        <rect x="0" y="0" width="112" height="54" rx="20"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M36 8 v 38 M64 8 v 38"
              stroke="#102a43" stroke-width="2" opacity=".45"/>
        <rect x="112" y="16" width="24" height="22"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <rect x="136" y="21" width="108" height="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M244 15 h 26 v 24 h -26 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(420 106)">
        <rect x="0" y="0" width="300" height="64" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M42 0 v 64 M258 0 v 64"
              stroke="#102a43" stroke-width="2" opacity=".35"/>
        <rect x="110" y="16" width="80" height="32" rx="16"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M134 18 v 28 M166 18 v 28"
              stroke="#102a43" stroke-width="2" opacity=".45"/>
        <circle cx="150" cy="32" r="11"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
      </g>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g transform="translate(548 292) rotate(-8)">
          <path d="M0 0 h 112 v 54" stroke="#102a43" stroke-width="17"/>
          <path d="M0 0 h 112 v 54" stroke="#c99c54" stroke-width="12"/>
        </g>
        <g transform="translate(586 386) rotate(7)">
          <path d="M0 0 h 86 v 42" stroke="#102a43" stroke-width="15"/>
          <path d="M0 0 h 86 v 42" stroke="#c99c54" stroke-width="10"/>
        </g>
      </g>`,
    badge: `
      <path d="M18 300 C 120 322, 210 240, 300 218 S 448 178, 468 142"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(150 56) rotate(-6) scale(.86)">
        <rect x="0" y="0" width="300" height="64" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="2.3"/>
        <path d="M42 0 v 64 M258 0 v 64"
              stroke="#102a43" stroke-width="2.3" opacity=".35"/>
        <rect x="110" y="16" width="80" height="32" rx="16"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.3"/>
        <circle cx="150" cy="32" r="11"
                fill="#c99c54" stroke="#102a43" stroke-width="2.3"/>
      </g>
      <g transform="translate(60 262) rotate(-24) scale(.86)">
        <rect x="0" y="0" width="112" height="54" rx="20"
              fill="currentColor" stroke="#102a43" stroke-width="2.3"/>
        <path d="M36 8 v 38 M64 8 v 38"
              stroke="#102a43" stroke-width="2.3" opacity=".45"/>
        <rect x="112" y="16" width="24" height="22"
              fill="#c99c54" stroke="#102a43" stroke-width="2.3"/>
        <rect x="136" y="21" width="108" height="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.3"/>
        <path d="M244 15 h 26 v 24 h -26 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.3"/>
      </g>`
  },

  "holiday-gifts": {
    accent: "#a63d40",
    accentSoft: "#f4dedf",
    label: "Two stacked gift boxes tied with a ribbon bow, beside a gift tag",
    scene: `
      ${FRAME}
      <path d="M46 400 C 200 444, 320 296, 464 268 S 700 200, 760 132"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(120 190)">
        <rect x="0" y="118" width="210" height="158" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M105 118 v 158" stroke="#c99c54" stroke-width="16"/>
        <path d="M0 190 h 210" stroke="#c99c54" stroke-width="16"/>
        <rect x="36" y="0" width="138" height="118" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M105 0 v 118" stroke="currentColor" stroke-width="14"/>
        <path d="M105 0 C 80 -12, 62 -36, 84 -44 C 102 -50, 104 -16, 105 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M105 0 C 130 -12, 148 -36, 126 -44 C 108 -50, 106 -16, 105 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <circle cx="105" cy="-2" r="9"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(570 200)">
        <path d="M20 40 C -12 18, -22 -30, 26 -54"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <path d="M32 0 h 126 a 14 14 0 0 1 14 14 v 84 a 14 14 0 0 1 -14 14
                 h -126 L 0 56 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="30" cy="56" r="8" fill="none"
                stroke="#102a43" stroke-width="2"/>
        <path d="M58 42 h 92" stroke="currentColor" stroke-width="8"/>
        <path d="M58 70 h 60" stroke="currentColor" stroke-width="8"/>
      </g>`,
    badge: `
      <path d="M18 258 C 130 294, 220 176, 320 158 S 448 110, 468 74"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(40 62) scale(.66)">
        <rect x="0" y="118" width="210" height="158" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M105 118 v 158" stroke="#c99c54" stroke-width="16"/>
        <path d="M0 190 h 210" stroke="#c99c54" stroke-width="16"/>
        <rect x="36" y="0" width="138" height="118" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <path d="M105 0 v 118" stroke="currentColor" stroke-width="14"/>
        <path d="M105 0 C 80 -12, 62 -36, 84 -44 C 102 -50, 104 -16, 105 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M105 0 C 130 -12, 148 -36, 126 -44 C 108 -50, 106 -16, 105 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <circle cx="105" cy="-2" r="9"
                fill="#c99c54" stroke="#102a43" stroke-width="3"/>
      </g>
      <g transform="translate(250 110) scale(.94)">
        <path d="M20 40 C -12 18, -22 -30, 26 -54"
              fill="none" stroke="#102a43" stroke-width="2.1"/>
        <path d="M32 0 h 126 a 14 14 0 0 1 14 14 v 84 a 14 14 0 0 1 -14 14
                 h -126 L 0 56 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.1"/>
        <circle cx="30" cy="56" r="8" fill="none"
                stroke="#102a43" stroke-width="2.1"/>
        <path d="M58 42 h 92" stroke="currentColor" stroke-width="8"/>
        <path d="M58 70 h 60" stroke="currentColor" stroke-width="8"/>
      </g>`
  },

  "retro-classroom-decor": {
    accent: "#c99c54",
    accentSoft: "#f6ecda",
    label: "A chalkboard under a string of pennants, with an apple beside it",
    scene: `
      ${FRAME}
      <path d="M44 424 C 190 464, 330 402, 470 400 S 700 356, 762 300"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <path d="M60 60 Q 320 154, 580 60"
            fill="none" stroke="#102a43" stroke-width="2"/>
      <g stroke="#102a43" stroke-width="2">
        <path d="M89 77 h 46 L 112 131 Z" fill="currentColor"/>
        <path d="M183 98 h 46 L 206 152 Z" fill="#fffdf8"/>
        <path d="M276 107 h 46 L 299 161 Z" fill="#102a43"/>
        <path d="M370 103 h 46 L 393 157 Z" fill="#fffdf8"/>
        <path d="M463 88 h 46 L 486 142 Z" fill="currentColor"/>
      </g>
      <g transform="translate(110 178)">
        <rect x="0" y="0" width="340" height="236" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="18" y="18" width="304" height="182" rx="4" fill="#102a43"/>
        <path d="M48 66 h 196 M48 102 h 148 M48 138 h 174"
              stroke="#fbf6ed" stroke-width="4" opacity=".8"/>
        <rect x="18" y="206" width="304" height="16" rx="6"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <rect x="236" y="204" width="48" height="12" rx="6"
              fill="#fbf6ed" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(620 316)">
        <path d="M22 -64 C 40 -80, 64 -72, 62 -52 C 44 -42, 26 -50, 22 -64 Z"
              fill="#2f6f73" stroke="#102a43" stroke-width="2"/>
        <path d="M0 -30 C 2 -48, 10 -60, 22 -64"
              fill="none" stroke="#102a43" stroke-width="4"/>
        <path d="M0 -30 C -34 -50, -70 -22, -62 20 C -56 56, -26 78, 0 60
                 C 26 78, 56 56, 62 20 C 70 -22, 34 -50, 0 -30 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M-34 -14 C -44 -2, -46 16, -40 30"
              fill="none" stroke="#fbf6ed" stroke-width="4" opacity=".6"/>
      </g>`,
    badge: `
      <path d="M18 268 C 120 294, 220 244, 310 250 S 448 228, 468 190"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(28 68) scale(.66)">
        <rect x="0" y="0" width="340" height="236" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <rect x="18" y="18" width="304" height="182" rx="4" fill="#102a43"/>
        <path d="M48 66 h 196 M48 102 h 148 M48 138 h 174"
              stroke="#fbf6ed" stroke-width="6" opacity=".8"/>
        <rect x="18" y="206" width="304" height="16" rx="6"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <rect x="236" y="204" width="48" height="12" rx="6"
              fill="#fbf6ed" stroke="#102a43" stroke-width="3"/>
      </g>
      <g transform="translate(370 176)">
        <path d="M22 -64 C 40 -80, 64 -72, 62 -52 C 44 -42, 26 -50, 22 -64 Z"
              fill="#2f6f73" stroke="#102a43" stroke-width="2"/>
        <path d="M0 -30 C 2 -48, 10 -60, 22 -64"
              fill="none" stroke="#102a43" stroke-width="4"/>
        <path d="M0 -30 C -34 -50, -70 -22, -62 20 C -56 56, -26 78, 0 60
                 C 26 78, 56 56, 62 20 C 70 -22, 34 -50, 0 -30 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
      </g>`
  },

  "pen-pal-starter-kit": {
    accent: "#6b4a2f",
    accentSoft: "#f0e5d9",
    label: "An envelope, a fountain pen nib and a stamped wax seal",
    scene: `
      ${FRAME}
      <path d="M40 108 C 180 62, 320 142, 468 116 S 690 214, 762 322"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(96 202)">
        <rect x="0" y="0" width="304" height="204" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M0 194 L 152 120 M304 194 L 152 120"
              stroke="#102a43" stroke-width="2" opacity=".4"/>
        <path d="M6 3 L 152 120 L 298 3 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(470 122)">
        <path d="M0 0 C -40 6, -56 60, -34 118 C -22 150, -8 168, 0 176
                 C 8 168, 22 150, 34 118 C 56 60, 40 6, 0 0 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M-27 42 C -14 36, 14 36, 27 42"
              fill="none" stroke="#102a43" stroke-width="2" opacity=".5"/>
        <circle cx="0" cy="66" r="12"
                fill="#fbf6ed" stroke="#102a43" stroke-width="2"/>
        <path d="M0 78 V 176" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(628 344)">
        <circle r="48" fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <circle r="35" fill="none" stroke="#102a43"
                stroke-width="2" opacity=".45"/>
        <path d="M-13 -15 v 30 M-13 -15 L 13 15 M13 -15 v 30"
              fill="none" stroke="#fbf6ed" stroke-width="5"/>
      </g>`,
    badge: `
      <path d="M18 250 C 110 212, 190 256, 292 224 S 448 152, 468 116"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(34 92) scale(.64)">
        <rect x="0" y="0" width="304" height="204" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <path d="M0 194 L 152 120 M304 194 L 152 120"
              stroke="#102a43" stroke-width="3" opacity=".4"/>
        <path d="M6 3 L 152 120 L 298 3 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
      </g>
      <g transform="translate(356 60) scale(.95)">
        <path d="M0 0 C -40 6, -56 60, -34 118 C -22 150, -8 168, 0 176
                 C 8 168, 22 150, 34 118 C 56 60, 40 6, 0 0 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="2.1"/>
        <circle cx="0" cy="66" r="12"
                fill="#fbf6ed" stroke="#102a43" stroke-width="2.1"/>
        <path d="M0 78 V 176" stroke="#102a43" stroke-width="2.1"/>
      </g>`
  },

  "adventure-travel-essentials": {
    accent: "#3d7a5c",
    accentSoft: "#dcebe3",
    label: "A roll-top dry bag and a filtered bottle against a mountain ridge",
    scene: `
      ${FRAME}
      <path d="M30 402 L 168 232 L 268 322 L 392 190 L 512 320 L 618 258 L 770 402 Z"
            fill="currentColor" opacity=".16"/>
      <path d="M30 402 L 168 232 L 268 322 L 392 190 L 512 320 L 618 258 L 770 402"
            fill="none" stroke="#102a43" stroke-width="2" opacity=".55"/>
      <path d="M366 218 L 392 190 L 418 218 C 406 210, 378 226, 366 218 Z"
            fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      <path d="M46 434 C 190 400, 300 454, 430 424 S 690 398, 762 358"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(110 208)">
        <path d="M18 -2 C 18 -34, 152 -34, 152 -2"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="72" y="-26" width="26" height="18" rx="4"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M-6 0 h 182 v 40 h -182 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M-6 14 h 182 M-6 28 h 182"
              stroke="#102a43" stroke-width="2" opacity=".35"/>
        <path d="M0 40 h 170 v 150 a 16 16 0 0 1 -16 16 h -138
                 a 16 16 0 0 1 -16 -16 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M0 110 h 170" stroke="#c99c54" stroke-width="10"/>
      </g>
      <g transform="translate(556 186)">
        <rect x="26" y="0" width="44" height="40" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M0 40 h 96 v 190 a 18 18 0 0 1 -18 18 h -60
                 a 18 18 0 0 1 -18 -18 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M2 132 C 26 118, 70 146, 94 132 v 96 a 16 16 0 0 1 -16 16
                 h -60 a 16 16 0 0 1 -16 -16 Z" fill="currentColor"/>
        <rect x="34" y="86" width="28" height="44" rx="7"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <path d="M48 40 v 46" stroke="#102a43" stroke-width="5" opacity=".5"/>
        <path d="M76 158 h 12 M76 182 h 12 M76 206 h 12"
              stroke="#102a43" stroke-width="2" opacity=".4"/>
        <path d="M0 40 h 96 v 190 a 18 18 0 0 1 -18 18 h -60
                 a 18 18 0 0 1 -18 -18 Z"
              fill="none" stroke="#102a43" stroke-width="2"/>
      </g>`,
    badge: `
      <path d="M10 264 L 92 150 L 154 208 L 228 124 L 300 204 L 364 166 L 470 264 Z"
            fill="currentColor" opacity=".2"/>
      <path d="M14 286 C 110 266, 200 298, 292 280 S 448 262, 470 232"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(56 126) scale(.66)">
        <path d="M18 -2 C 18 -34, 152 -34, 152 -2"
              fill="none" stroke="#102a43" stroke-width="3"/>
        <rect x="72" y="-26" width="26" height="18" rx="4"
              fill="#c99c54" stroke="#102a43" stroke-width="3"/>
        <path d="M-6 0 h 182 v 40 h -182 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <path d="M-6 20 h 182" stroke="#102a43" stroke-width="3" opacity=".35"/>
        <path d="M0 40 h 170 v 150 a 16 16 0 0 1 -16 16 h -138
                 a 16 16 0 0 1 -16 -16 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M0 110 h 170" stroke="#c99c54" stroke-width="10"/>
      </g>
      <g transform="translate(300 69) scale(.78)">
        <rect x="26" y="0" width="44" height="40" rx="8"
              fill="#c99c54" stroke="#102a43" stroke-width="2.55"/>
        <path d="M0 40 h 96 v 190 a 18 18 0 0 1 -18 18 h -60
                 a 18 18 0 0 1 -18 -18 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.55"/>
        <path d="M2 132 C 26 118, 70 146, 94 132 v 96 a 16 16 0 0 1 -16 16
                 h -60 a 16 16 0 0 1 -16 -16 Z" fill="currentColor"/>
        <rect x="34" y="86" width="28" height="44" rx="7"
              fill="none" stroke="#102a43" stroke-width="2.55"/>
        <path d="M0 40 h 96 v 190 a 18 18 0 0 1 -18 18 h -60
                 a 18 18 0 0 1 -18 -18 Z"
              fill="none" stroke="#102a43" stroke-width="2.55"/>
      </g>`
  },

  "whimsical-kitchen-finds": {
    accent: "#b8536b",
    accentSoft: "#f6e0e6",
    label: "A mushroom grinder, nesting doll measuring cups and a wind-up timer",
    scene: `
      ${FRAME}
      <path d="M44 412 C 190 450, 320 392, 470 406 S 700 356, 762 286"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(112 176)">
        <path d="M88 -30 v -20" stroke="#102a43" stroke-width="2"/>
        <circle cx="88" cy="-58" r="11"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M52 60 h 72 v 118 a 14 14 0 0 1 -14 14 h -44
                 a 14 14 0 0 1 -14 -14 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M0 60 C 0 6, 40 -30, 88 -30 C 136 -30, 176 6, 176 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <g fill="#fffdf8" stroke="#102a43" stroke-width="2">
          <circle cx="52" cy="18" r="13"/>
          <circle cx="106" cy="6" r="10"/>
          <circle cx="138" cy="34" r="9"/>
          <circle cx="26" cy="44" r="8"/>
        </g>
      </g>
      <g transform="translate(524 330) scale(.62)">
        <path d="M0 -60 C -34 -60, -46 -26, -40 4 C -50 40, -46 84, 0 84
                 C 46 84, 50 40, 40 4 C 46 -26, 34 -60, 0 -60 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="3.2"/>
        <path d="M0 -46 C -20 -46, -26 -20, -18 -8 C -10 0, 10 0, 18 -8
                 C 26 -20, 20 -46, 0 -46 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.2"/>
        <circle cx="-7" cy="-28" r="3.5" fill="#102a43"/>
        <circle cx="7" cy="-28" r="3.5" fill="#102a43"/>
        <path d="M-34 26 C -20 12, 20 12, 34 26 C 36 58, 20 78, 0 78
                 C -20 78, -36 58, -34 26 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.2"/>
      </g>
      <g transform="translate(430 296)">
        <path d="M0 -60 C -34 -60, -46 -26, -40 4 C -50 40, -46 84, 0 84
                 C 46 84, 50 40, 40 4 C 46 -26, 34 -60, 0 -60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M0 -46 C -20 -46, -26 -20, -18 -8 C -10 0, 10 0, 18 -8
                 C 26 -20, 20 -46, 0 -46 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="-7" cy="-28" r="3.5" fill="#102a43"/>
        <circle cx="7" cy="-28" r="3.5" fill="#102a43"/>
        <circle cx="-15" cy="-17" r="4" fill="#c99c54"/>
        <circle cx="15" cy="-17" r="4" fill="#c99c54"/>
        <path d="M-34 26 C -20 12, 20 12, 34 26 C 36 58, 20 78, 0 78
                 C -20 78, -36 58, -34 26 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle cx="0" cy="44" r="10"
                fill="#c99c54" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(660 200)">
        <path d="M0 -52 v -14" stroke="#102a43" stroke-width="2"/>
        <rect x="-13" y="-82" width="26" height="18" rx="7"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M-30 44 l -12 20 M30 44 l 12 20"
              stroke="#102a43" stroke-width="3"/>
        <circle r="54" fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <circle r="41" fill="none" stroke="currentColor" stroke-width="9"/>
        <path d="M0 -54 v 12 M54 0 h -12 M0 54 v -12 M-54 0 h 12"
              stroke="#102a43" stroke-width="2"/>
        <path d="M0 0 L 27 -27" stroke="#102a43"
              stroke-width="4" stroke-linecap="round"/>
        <circle r="5" fill="#102a43"/>
      </g>`,
    badge: `
      <path d="M18 262 C 120 290, 210 232, 300 240 S 448 212, 468 176"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(52 96) scale(.66)">
        <path d="M88 -30 v -20" stroke="#102a43" stroke-width="3"/>
        <circle cx="88" cy="-58" r="11"
                fill="#c99c54" stroke="#102a43" stroke-width="3"/>
        <path d="M52 60 h 72 v 118 a 14 14 0 0 1 -14 14 h -44
                 a 14 14 0 0 1 -14 -14 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <path d="M0 60 C 0 6, 40 -30, 88 -30 C 136 -30, 176 6, 176 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <g fill="#fffdf8" stroke="#102a43" stroke-width="3">
          <circle cx="52" cy="18" r="13"/>
          <circle cx="106" cy="6" r="10"/>
          <circle cx="138" cy="34" r="9"/>
          <circle cx="26" cy="44" r="8"/>
        </g>
      </g>
      <g transform="translate(348 172) scale(1.1)">
        <path d="M0 -60 C -34 -60, -46 -26, -40 4 C -50 40, -46 84, 0 84
                 C 46 84, 50 40, 40 4 C 46 -26, 34 -60, 0 -60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="1.8"/>
        <path d="M0 -46 C -20 -46, -26 -20, -18 -8 C -10 0, 10 0, 18 -8
                 C 26 -20, 20 -46, 0 -46 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="1.8"/>
        <circle cx="-7" cy="-28" r="3.5" fill="#102a43"/>
        <circle cx="7" cy="-28" r="3.5" fill="#102a43"/>
        <circle cx="-15" cy="-17" r="4" fill="#c99c54"/>
        <circle cx="15" cy="-17" r="4" fill="#c99c54"/>
        <path d="M-34 26 C -20 12, 20 12, 34 26 C 36 58, 20 78, 0 78
                 C -20 78, -36 58, -34 26 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="1.8"/>
        <circle cx="0" cy="44" r="10"
                fill="#c99c54" stroke="#102a43" stroke-width="1.8"/>
      </g>`
  },

  "hotel-room-essentials": {
    accent: "#46508c",
    accentSoft: "#e3e5f2",
    label: "A hotel bed, a lit bedside lamp and half-drawn curtains at night",
    scene: `
      ${FRAME}
      <path d="M56 388 C 150 330, 190 236, 268 190 S 400 140, 462 122"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <circle cx="56" cy="388" r="8" fill="#c99c54"
              stroke="#102a43" stroke-width="2"/>
      <circle cx="462" cy="122" r="8" fill="#c99c54"
              stroke="#102a43" stroke-width="2"/>
      <path d="M64 414 h 672" stroke="#102a43" stroke-width="2" opacity=".35"/>
      <g transform="translate(520 92)">
        <path d="M-44 -14 h 298" stroke="#c99c54" stroke-width="6"/>
        <rect x="0" y="0" width="210" height="170" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <circle cx="150" cy="44" r="20" fill="#fffdf8"
                stroke="#102a43" stroke-width="2"/>
        <circle cx="58" cy="34" r="4" fill="#c99c54"/>
        <circle cx="92" cy="76" r="3" fill="#c99c54"/>
        <path d="M-40 -8 h 60 v 200 h -60 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M-22 -8 v 200 M -4 -8 v 200"
              stroke="#102a43" stroke-width="2" opacity=".45"/>
        <path d="M190 -8 h 60 v 200 h -60 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M208 -8 v 200 M 226 -8 v 200"
              stroke="#102a43" stroke-width="2" opacity=".45"/>
      </g>
      <g transform="translate(96 262)">
        <rect x="0" y="0" width="28" height="152" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="28" y="114" width="248" height="26" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M44 140 v 12 M 260 140 v 12"
              stroke="#102a43" stroke-width="2"/>
        <rect x="28" y="62" width="248" height="56" rx="14"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M186 90 h 90" stroke="#c99c54" stroke-width="10"/>
        <rect x="44" y="30" width="76" height="36" rx="14"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(398 262)">
        <path d="M4 44 h -20 M 72 44 h 20 M 38 20 v -16"
              stroke="#c99c54" stroke-width="2"/>
        <path d="M6 68 L 70 68 L 58 26 L 18 26 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="2"/>
        <path d="M38 68 V 76" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="76" width="76" height="76" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M0 110 h 76" stroke="#102a43" stroke-width="2" opacity=".45"/>
        <circle cx="38" cy="93" r="4" fill="none"
                stroke="#102a43" stroke-width="2"/>
      </g>
      <g transform="translate(600 330)">
        <path d="M30 18 V 8 a 10 10 0 0 1 10 -10 h 40 a 10 10 0 0 1 10 10 V 18"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="0" y="18" width="120" height="66" rx="12"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M0 46 h 120" stroke="#c99c54" stroke-width="8"/>
      </g>`,
    badge: `
      <path d="M16 250 C 70 214, 96 160, 150 134 S 226 104, 258 94"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <path d="M16 265 h 448" stroke="#102a43" stroke-width="2" opacity=".35"/>
      <g transform="translate(292 90) scale(.6)">
        <path d="M-44 -14 h 298" stroke="#c99c54" stroke-width="8"/>
        <rect x="0" y="0" width="210" height="170" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="3.3"/>
        <circle cx="150" cy="44" r="20" fill="#fffdf8"
                stroke="#102a43" stroke-width="3.3"/>
        <circle cx="58" cy="34" r="5" fill="#c99c54"/>
        <circle cx="92" cy="76" r="4" fill="#c99c54"/>
        <path d="M-40 -8 h 60 v 200 h -60 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.3"/>
        <path d="M-22 -8 v 200 M -4 -8 v 200"
              stroke="#102a43" stroke-width="3.3" opacity=".45"/>
        <path d="M190 -8 h 60 v 200 h -60 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.3"/>
        <path d="M208 -8 v 200 M 226 -8 v 200"
              stroke="#102a43" stroke-width="3.3" opacity=".45"/>
      </g>
      <g transform="translate(10 174) scale(.6)">
        <rect x="0" y="0" width="28" height="152" rx="8"
              fill="currentColor" stroke="#102a43" stroke-width="3.3"/>
        <rect x="28" y="114" width="248" height="26" rx="10"
              fill="currentColor" stroke="#102a43" stroke-width="3.3"/>
        <path d="M44 140 v 12 M 260 140 v 12"
              stroke="#102a43" stroke-width="3.3"/>
        <rect x="28" y="62" width="248" height="56" rx="14"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.3"/>
        <path d="M186 90 h 90" stroke="#c99c54" stroke-width="14"/>
        <rect x="44" y="30" width="76" height="36" rx="14"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.3"/>
      </g>
      <g transform="translate(186 174) scale(.6)">
        <path d="M4 44 h -20 M 72 44 h 20 M 38 20 v -16"
              stroke="#c99c54" stroke-width="3.3"/>
        <path d="M6 68 L 70 68 L 58 26 L 18 26 Z"
              fill="#c99c54" stroke="#102a43" stroke-width="3.3"/>
        <path d="M38 68 V 76" stroke="#102a43" stroke-width="3.3"/>
        <rect x="0" y="76" width="76" height="76" rx="8"
              fill="#fffdf8" stroke="#102a43" stroke-width="3.3"/>
        <path d="M0 110 h 76" stroke="#102a43" stroke-width="3.3" opacity=".45"/>
        <circle cx="38" cy="93" r="5" fill="none"
                stroke="#102a43" stroke-width="3.3"/>
      </g>
      <g transform="translate(280 215) scale(.6)">
        <path d="M30 18 V 8 a 10 10 0 0 1 10 -10 h 40 a 10 10 0 0 1 10 10 V 18"
              fill="none" stroke="#102a43" stroke-width="3.3"/>
        <rect x="0" y="18" width="120" height="66" rx="12"
              fill="currentColor" stroke="#102a43" stroke-width="3.3"/>
        <path d="M0 46 h 120" stroke="#c99c54" stroke-width="12"/>
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
    <g transform="translate(30 18)" stroke="#102a43" stroke-width="2.5" fill="none">
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
    <g transform="translate(46 16)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="20" width="70" height="46" rx="6" fill="#2f6f73"/>
      <path d="M0 34 h 70"/>
      <path d="M35 20 v -10 m -14 0 h 28"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Gifts</text>
  </g>

  <g transform="translate(112 336)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(40 20)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="6" width="82" height="54" rx="5" fill="#102a43"/>
      <path d="M12 24 h 40 M12 38 h 26" stroke="#fbf6ed"/>
      <path d="M0 60 h 82" stroke="#c99c54" stroke-width="4"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Teachers</text>
  </g>

  <g transform="translate(322 362)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(50 16)" stroke="#102a43" stroke-width="2.5" fill="none">
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

// Category icons, replacing the six emoji on the home page. 64x64, drawn with
// currentColor so each card supplies its own hue.
export const categoryArt = {
  travel: `<rect x="12" y="22" width="40" height="30" rx="6" fill="currentColor" opacity=".18"/><rect x="12" y="22" width="40" height="30" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 22v-6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 30v14" stroke="currentColor" stroke-width="3"/>`,
  dogs: `<ellipse cx="32" cy="42" rx="12" ry="15" fill="currentColor" opacity=".22"/><ellipse cx="32" cy="42" rx="12" ry="15" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="21" r="6" fill="currentColor" opacity=".22"/><circle cx="17" cy="21" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="28" cy="14" r="6" fill="currentColor" opacity=".22"/><circle cx="28" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="42" cy="17" r="6" fill="currentColor" opacity=".22"/><circle cx="42" cy="17" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="29" r="6" fill="currentColor" opacity=".22"/><circle cx="50" cy="29" r="6" fill="none" stroke="currentColor" stroke-width="3"/>`,
  gifts: `<rect x="12" y="26" width="40" height="28" rx="5" fill="currentColor" opacity=".18"/><rect x="12" y="26" width="40" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 36h40M32 26v28" stroke="currentColor" stroke-width="3"/><path d="M32 26c-8 0-12-4-12-8s8-4 12 8c4-12 12-12 12-8s-4 8-12 8z" fill="none" stroke="currentColor" stroke-width="3"/>`,
  teachers: `<rect x="10" y="14" width="44" height="30" rx="4" fill="currentColor" opacity=".2"/><rect x="10" y="14" width="44" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M19 26h20M19 34h13" stroke="currentColor" stroke-width="3"/><path d="M8 50h48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  seasonal: `<path d="M32 10l6 15h16l-13 11 5 16-14-10-14 10 5-16-13-11h16z" fill="currentColor" opacity=".22"/><path d="M32 10l6 15h16l-13 11 5 16-14-10-14 10 5-16-13-11h16z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  workshop: `<path d="M14 50l24-24" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M36 20l10 10-6 6-10-10z" fill="currentColor" opacity=".25"/><path d="M36 20l10 10-6 6-10-10z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="48" cy="18" r="6" fill="currentColor" opacity=".25"/><circle cx="48" cy="18" r="6" fill="none" stroke="currentColor" stroke-width="3"/>`
};
