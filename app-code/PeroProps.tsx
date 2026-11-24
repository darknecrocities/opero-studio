import React from 'react';
import type { PropType } from './peroMotions';

export const PeroProp: React.FC<{ prop: PropType; prefix?: string }> = ({ prop, prefix = 'pero' }) => {
  switch (prop) {
    case 'sparkle-wave':
      return (
        <g>
          <circle className="pero-spark-ring" cx="114" cy="232" r="18" fill="none" stroke="#69BCFC" strokeWidth="2.5" opacity={0} />
          <path className="pero-spark-1" d="M 74 188 L 79 201 L 92 206 L 79 211 L 74 224 L 69 211 L 56 206 L 69 201 Z" fill="#247BFA" />
          <circle className="pero-spark-2" cx="102" cy="174" r="5.5" fill="#69BCFC" />
          <path className="pero-spark-3" d="M 62 167 L 65 173 L 71 176 L 65 179 L 62 185 L 59 179 L 53 176 L 59 173 Z" fill="#69BCFC" />
        </g>
      );
    case 'hero-glint':
      return (
        <g>
          <circle className="pero-spark-ring" cx="172" cy="288" r="14" fill="none" stroke="#247BFA" strokeWidth="2.5" opacity={0} />
          <path className="pero-spark-1" d="M 118 244 L 122 254 L 132 258 L 122 262 L 118 272 L 114 262 L 104 258 L 114 254 Z" fill="#247BFA" />
          <circle className="pero-spark-2" cx="138" cy="236" r="4.8" fill="#69BCFC" />
        </g>
      );
    case 'rec-badge':
      return (
        <g transform="translate(422, 114)"><g className="pero-prop-anim">
          <rect x="-36" y="-17" width="80" height="34" rx="17" fill="#FFFFFF" stroke="#E1E8F0" strokeWidth="3" />
          <circle cx="-16" cy="0" r="8.5" fill="#C43D4B" opacity={0.25} className="pero-prop-ring" />
          <circle cx="-16" cy="0" r="8.5" fill="none" stroke="#C43D4B" strokeWidth="2" opacity={0} className="pero-prop-ring-2" />
          <circle cx="-16" cy="0" r="7.5" fill="#C43D4B" className="pero-prop-pulse" />
          <rect className="pero-eq-1" x="2" y="-7" width="5" height="14" rx="2.5" fill="#172334" />
          <rect className="pero-eq-2" x="10" y="-9" width="5" height="18" rx="2.5" fill="#172334" />
          <rect className="pero-eq-3" x="18" y="-6" width="5" height="12" rx="2.5" fill="#172334" />
          <rect className="pero-eq-4" x="26" y="-8" width="5" height="16" rx="2.5" fill="#172334" />
        </g></g>
      );
    case 'pause-bars':
      return (
        <g transform="translate(422, 118)"><g className="pero-prop-anim">
          <circle className="pero-prop-ring" cx="0" cy="0" r="28" fill="none" stroke="#69BCFC" strokeWidth="2.5" opacity={0.45} />
          <circle cx="0" cy="0" r="24" fill="#EAF3FF" stroke="#247BFA" strokeWidth="3.5" />
          <rect className="pero-pause-bar-l" x="-9" y="-10" width="6.5" height="20" rx="3" fill="#247BFA" />
          <rect className="pero-pause-bar-r" x="2.5" y="-10" width="6.5" height="20" rx="3" fill="#247BFA" />
        </g></g>
      );
    case 'camera-flash':
      return (
        <g transform="translate(394, 240)">
          <g className="pero-cam-frame" stroke="#69BCFC" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M -41 -22 L -41 -33 L -30 -33 M 30 -33 L 41 -33 L 41 -22" />
            <path d="M -41 22 L -41 33 L -30 33 M 30 33 L 41 33 L 41 22" />
          </g>
          <rect x="-26" y="-20" width="52" height="40" rx="10" fill="#202E54" stroke="#08102D" strokeWidth="4" />
          <rect x="-11" y="-27" width="22" height="9" rx="4" fill="#69BCFC" stroke="#08102D" strokeWidth="3.5" />
          <circle cx="0" cy="0" r="12" fill="#FCFCFB" stroke="#08102D" strokeWidth="3.5" />
          <circle className="pero-cam-iris" cx="0" cy="0" r="6.5" fill="#247BFA" />
          <circle className="pero-cam-flare" cx="32" cy="-26" r="11" fill="none" stroke="#FDB936" strokeWidth="2.5" opacity={0} />
          <path className="pero-prop-flash" d="M 32 -42 L 36 -30 L 48 -26 L 36 -22 L 32 -10 L 28 -22 L 16 -26 L 28 -30 Z" fill="#FDB936" />
        </g>
      );
    case 'scan-frame':
      return (
        <g transform="translate(76, 188)">
          <g className="pero-scan-brackets" stroke="#69BCFC" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M -36 -28 L -36 -40 L -24 -40 M 24 -40 L 36 -40 L 36 -28" />
            <path d="M -36 28 L -36 40 L -24 40 M 24 40 L 36 40 L 36 28" />
          </g>
          <rect x="-28" y="-34" width="56" height="68" rx="10" fill="#F7F9FC" stroke="#247BFA" strokeWidth="3.5" />
          <line className="pero-ocr-line-1" x1="-16" y1="-16" x2="16" y2="-16" stroke="#68778B" strokeWidth="4" strokeLinecap="round" />
          <line className="pero-ocr-line-2" x1="-16" y1="-2" x2="12" y2="-2" stroke="#68778B" strokeWidth="4" strokeLinecap="round" />
          <line className="pero-ocr-line-3" x1="-16" y1="12" x2="18" y2="12" stroke="#68778B" strokeWidth="4" strokeLinecap="round" />
          <line className="pero-scan-bar" x1="-22" y1="0" x2="22" y2="0" stroke="#247BFA" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      );
    case 'thinking-dots':
      return (
        <g>
          <circle className="pero-cloud-1" cx="394" cy="146" r="5" fill="#EAF3FF" stroke="#247BFA" strokeWidth="2.5" />
          <circle className="pero-cloud-2" cx="406" cy="132" r="7" fill="#EAF3FF" stroke="#247BFA" strokeWidth="2.5" />
          <g transform="translate(426, 106)">
            <rect x="-38" y="-19" width="76" height="38" rx="19" fill="#EAF3FF" stroke="#247BFA" strokeWidth="3" />
            <circle className="pero-dot-1" cx="-16" cy="0" r="5.5" fill="#247BFA" />
            <circle className="pero-dot-2" cx="0" cy="0" r="5.5" fill="#247BFA" />
            <circle className="pero-dot-3" cx="16" cy="0" r="5.5" fill="#247BFA" />
          </g>
          <circle className="pero-spark-ring" cx="452" cy="74" r="12" fill="none" stroke="#69BCFC" strokeWidth="2.5" opacity={0} />
          <path className="pero-spark-1" d="M 452 64 L 455 71 L 462 74 L 455 77 L 452 84 L 449 77 L 442 74 L 449 71 Z" fill="#247BFA" />
        </g>
      );
    case 'doc-draft':
      return (
        <g transform="translate(442, 326)"><g className="pero-prop-anim">
          <rect x="-32" y="-42" width="64" height="84" rx="10" fill="#FFFFFF" stroke="#172334" strokeWidth="4" />
          <rect x="-20" y="-26" width="40" height="8" rx="4" fill="#247BFA" />
          <rect x="-20" y="-10" width="40" height="6" rx="3" fill="#CBD5E1" />
          <rect x="-20" y="2" width="30" height="6" rx="3" fill="#CBD5E1" />
          <rect x="-20" y="14" width="36" height="6" rx="3" fill="#CBD5E1" />
          <path className="pero-ink-stroke" d="M -20 26 L 14 26" fill="none" stroke="#247BFA" strokeWidth="5" strokeLinecap="round" />
          <path className="pero-ink-stroke-2" d="M -20 34 L 6 34" fill="none" stroke="#69BCFC" strokeWidth="4" strokeLinecap="round" />
          <circle className="pero-ink-nib" cx="-16" cy="26" r="3" fill="#FDA326" />
        </g></g>
      );
    case 'annotation-callout':
      return (
        <g transform="translate(432, 232)"><g className="pero-prop-anim">
          <circle className="pero-prop-ring" cx="-2" cy="24" r="9" fill="#247BFA" opacity={0.35} />
          <path d="M -32 48 C -20 42, -10 34, -4 26" fill="none" stroke="#247BFA" strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="-11,26 -1,22 -3,33" fill="#247BFA" />
          <rect x="-36" y="-26" width="72" height="50" rx="10" fill="#EAF3FF" stroke="#247BFA" strokeWidth="4" />
          <g className="pero-callout-plus">
            <circle cx="-18" cy="-8" r="9.5" fill="#247BFA" />
            <path d="M -21 -8 L -15 -8 M -18 -12 L -18 -4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <line x1="-2" y1="-8" x2="24" y2="-8" stroke="#172334" strokeWidth="4" strokeLinecap="round" />
          <line x1="-22" y1="9" x2="22" y2="9" stroke="#68778B" strokeWidth="4" strokeLinecap="round" />
        </g></g>
      );
    case 'review-amber':
      return (
        <g transform="translate(424, 118)">
          <circle className="pero-prop-ring" cx="0" cy="4" r="24" fill="none" stroke="#F59E0B" strokeWidth="3" opacity={0.55} />
          <circle className="pero-prop-ring-2" cx="0" cy="4" r="24" fill="none" stroke="#F59E0B" strokeWidth="2.5" opacity={0} />
          <g className="pero-prop-anim">
            <path d="M 0 -24 L 24 20 L -24 20 Z" fill="#FEF3C7" stroke="#B7791F" strokeWidth="4.5" strokeLinejoin="round" />
            <line x1="0" y1="-8" x2="0" y2="4" stroke="#B7791F" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="0" cy="12" r="2.8" fill="#B7791F" />
          </g>
        </g>
      );
    case 'verified-check':
      return (
        <g>
          <circle className="pero-prop-ring" cx="424" cy="120" r="26" fill="none" stroke="#16865B" strokeWidth="3" opacity={0} />
          <g transform="translate(424, 120)"><g className="pero-prop-anim">
            <circle cx="0" cy="0" r="24" fill="#16865B" stroke="#08102D" strokeWidth="4" />
            <path d="M -10 1 L -3 8 L 11 -7" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g></g>
          <path className="pero-spark-1" d="M 88 134 L 91 141 L 98 144 L 91 147 L 88 154 L 85 147 L 78 144 L 85 141 Z" fill="#16865B" />
          <circle className="pero-spark-2" cx="448" cy="184" r="5" fill="#69BCFC" />
          <path className="pero-spark-3" d="M 388 83 L 390.5 89 L 396.5 91.5 L 390.5 94 L 388 100 L 385.5 94 L 379.5 91.5 L 385.5 89 Z" fill="#16865B" />
        </g>
      );
    case 'export-pdf':
      return (
        <g transform="translate(428, 168)">
          <g className="pero-export-ticks" stroke="#69BCFC" strokeWidth="3.5" strokeLinecap="round">
            <line x1="-10" y1="38" x2="-10" y2="48" />
            <line x1="0" y1="42" x2="0" y2="54" />
            <line x1="10" y1="40" x2="10" y2="50" />
          </g>
          <g className="pero-prop-anim">
            <rect x="-24" y="-30" width="48" height="60" rx="8" fill="#FFFFFF" stroke="#08102D" strokeWidth="4" />
            <path d="M 0 12 L 0 -12 M -9 -3 L 0 -13 L 9 -3" fill="none" stroke="#247BFA" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="-14" y="16" width="28" height="5" rx="2.5" fill="#69BCFC" />
          </g>
        </g>
      );
    case 'ai-orbit':
      return (
        <g>
          <g className="pero-orbit-inner" opacity={0.65}>
            <circle cx="256" cy="256" r="178" fill="none" stroke="#69BCFC" strokeWidth="2.5" strokeDasharray="6 18" />
          </g>
          <g className="pero-orbit-spin" opacity={0.9}>
            <circle cx="256" cy="256" r="212" fill="none" stroke="#DCE8FA" strokeWidth="4" strokeDasharray="10 14" />
            <g className="pero-sat-1">
              <circle cx="256" cy="44" r="13" fill="#247BFA" opacity={0.22} />
              <circle cx="256" cy="44" r="8" fill="#247BFA" />
            </g>
            <circle className="pero-sat-2" cx="440" cy="362" r="7.5" fill="#69BCFC" />
            <circle className="pero-sat-3" cx="72" cy="362" r="7.5" fill="#16865B" />
          </g>
        </g>
      );
    case 'shield':
      return (
        <g transform="translate(96, 326)"><g className="pero-prop-anim">
          <path className="pero-shield-ring" d="M 0 -46 L 39 -30 L 39 10 C 39 35, 17 50, 0 56 C -17 50, -39 35, -39 10 L -39 -30 Z" fill="none" stroke="#69BCFC" strokeWidth="2.5" opacity={0} />
          <path d="M 0 -40 L 34 -26 L 34 8 C 34 30, 14 44, 0 50 C -14 44, -34 30, -34 8 L -34 -26 Z" fill="#EAF3FF" stroke="#247BFA" strokeWidth="4.5" strokeLinejoin="round" />
          <g clipPath={`url(#${prefix}-shield-clip)`}>
            <rect className="pero-shield-sweep" x="-10" y="-45" width="18" height="100" fill="#FFFFFF" opacity={0.6} transform="rotate(24 0 0)" />
          </g>
          <path className="pero-shield-check" d="M -11 4 L -2 13 L 14 -5" fill="none" stroke="#16865B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g></g>
      );
    case 'motion-lines':
      return (
        <g className="pero-prop-anim">
          <line className="pero-line-1" x1="62" y1="418" x2="100" y2="418" stroke="#69BCFC" strokeWidth="5.5" strokeLinecap="round" />
          <line className="pero-line-2" x1="50" y1="435" x2="92" y2="435" stroke="#247BFA" strokeWidth="5.5" strokeLinecap="round" />
        </g>
      );
    case 'confetti':
      return (
        <g>
          <circle className="pero-conf-1" cx="92" cy="144" r="6.5" fill="#247BFA" />
          <rect className="pero-conf-2" x="412" y="128" width="13" height="13" rx="3" fill="#FDA326" transform="rotate(20 418 134)" />
          <path className="pero-conf-3" d="M 104 188 L 109 198 L 119 203 L 109 208 L 104 218 L 99 208 L 89 203 L 99 198 Z" fill="#16865B" />
          <circle className="pero-conf-4" cx="406" cy="196" r="5.5" fill="#69BCFC" />
        </g>
      );
    case 'zzz':
      return (
        <g fill="#247BFA" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800">
          <text x="382" y="164" fontSize="22" className="pero-zzz-1">z</text>
          <text x="404" y="138" fontSize="28" className="pero-zzz-2">z</text>
          <text x="426" y="108" fontSize="34" className="pero-zzz-3">Z</text>
        </g>
      );
    case 'error-spark':
      return (
        <g transform="translate(424, 118)">
          <circle className="pero-prop-ring" cx="0" cy="0" r="22" fill="none" stroke="#C43D4B" strokeWidth="3.5" opacity={0.6} />
          <circle className="pero-prop-ring-2" cx="0" cy="0" r="22" fill="none" stroke="#C43D4B" strokeWidth="2.5" opacity={0} />
          <g className="pero-prop-anim">
            <circle cx="0" cy="0" r="22" fill="#FEE2E2" stroke="#C43D4B" strokeWidth="4" />
            <line x1="0" y1="-10" x2="0" y2="3" stroke="#C43D4B" strokeWidth="5" strokeLinecap="round" />
            <circle cx="0" cy="11" r="3" fill="#C43D4B" />
          </g>
        </g>
      );
    default:
      return null;
  }
};
