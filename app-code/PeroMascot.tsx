import React, { useId } from 'react';
import { PERO_MOTION_BY_ID, type PeroMotionId } from './peroMotions';
import { PERO_STATE_ARIA_LABELS } from './peroMotionPresets';
import { buildPeroColorVars } from './peroColorUtils';
import { PeroBeak, PeroBrows, PeroDefs, PeroDustPuffs, PeroEyeLeft, PeroEyeRight, PeroFoot } from './peroRigParts';
import { PeroFlipperLeft, PeroFlipperRight } from './peroRigFlippers';
import { PeroProp } from './PeroProps';
import './pero-motions.css';
import './pero-motion-effects.css';

export interface PeroMascotProps {
  motion?: PeroMotionId;
  size?: number | string;
  playing?: boolean;
  speed?: number;
  reducedMotion?: boolean;
  capColor?: string;
  jacketColor?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PeroMascot: React.FC<PeroMascotProps> = ({
  motion = 'idle-breathe',
  size = 160,
  playing = true,
  speed = 1,
  reducedMotion = false,
  capColor,
  jacketColor,
  title,
  className = '',
  style,
}) => {
  const uid = useId().replace(/:/g, '');
  const prefix = `pero-${uid}`;
  const spec = PERO_MOTION_BY_ID[motion] ?? PERO_MOTION_BY_ID['idle-breathe'];
  const p = spec.pose;
  const label = title ?? PERO_STATE_ARIA_LABELS[spec.id];
  const colorVars = buildPeroColorVars(capColor, jacketColor);

  const classes = [
    'pero-mascot-svg',
    `pero-motion-${spec.id}`,
    !playing ? 'pero-paused' : '',
    reducedMotion ? 'pero-reduced' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const txMatch = p.bodyTransform.match(/translate\(\s*(-?\d+(?:\.\d+)?)/);
  const shadowTransform = `translate(${txMatch ? txMatch[1] : '0'}, 0)`;

  const rightArm = (
    <g className="pero-flipper-right-anim">
      <PeroFlipperRight pose={p.rightFlipper} prefix={prefix} />
    </g>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={classes}
      style={{ '--pero-speed': String(Math.max(0.25, speed)), ...colorVars, ...style } as React.CSSProperties}
    >
      <title>{label}</title>
      <PeroDefs prefix={prefix} />

      <g transform={shadowTransform}>
        <g className="pero-shadow-anim">
          <ellipse cx="256" cy="485" rx="130" ry="13.5" fill="var(--pero-outline, #08102D)" opacity={0.06} />
          <ellipse cx="256" cy="484" rx="112" ry="10.5" fill="var(--pero-outline, #08102D)" opacity={0.12} />
        </g>
        <g className="pero-foot-shadow-l">
          <ellipse cx="194" cy="479" rx="40" ry="6.5" fill="var(--pero-outline, #08102D)" opacity={0.16} />
        </g>
        <g className="pero-foot-shadow-r">
          <ellipse cx="324" cy="479" rx="40" ry="6.5" fill="var(--pero-outline, #08102D)" opacity={0.16} />
        </g>
        {p.dust && <PeroDustPuffs />}
      </g>
      {p.prop === 'ai-orbit' && <PeroProp prop="ai-orbit" prefix={prefix} />}

      <g className="pero-body-anim">
        <g transform={p.bodyTransform}>
          <g className="pero-tail-anim">
            <path d="M 156 392 C 134 395, 118 390, 113 384 C 110 402, 124 426, 158 430 Z" fill="var(--pero-navy, #202E54)" stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
            <path d="M 118 396 C 124 412, 136 422, 155 426" fill="none" stroke="#141E3B" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          <g>
            <PeroFoot side="left" pose={p.footLeft} prefix={prefix} />
            <PeroFoot side="right" pose={p.footRight} prefix={prefix} />
          </g>

          <g>
            <path d="M 150 388 C 146 436, 184 462, 256 462 C 328 462, 366 436, 362 388 Z" fill={`url(#${prefix}-navy)`} stroke="var(--pero-outline, #08102D)" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 188 412 C 194 446, 224 457, 256 457 C 288 457, 318 446, 324 412 Z" fill="var(--pero-white, #FCFCFB)" stroke="var(--pero-outline, #08102D)" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 192 434 C 212 450, 300 450, 320 434 C 310 448, 284 455, 256 455 C 228 455, 202 448, 192 434 Z" fill="var(--pero-white-shade, #DFE4F3)" />
          </g>

          {!p.rightFlipperFront && rightArm}

          <g>
            <g className="pero-jacket-hem-anim">
              <path d="M 164 316 C 148 340, 146 382, 152 406 C 176 416, 224 418, 254 416 L 254 320 Z" fill={`url(#${prefix}-jacket)`} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
              <path d="M 348 316 C 364 342, 366 382, 358 406 C 332 416, 286 418, 260 416 L 260 320 Z" fill={`url(#${prefix}-jacket)`} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
              <path d="M 253 330 L 263 330 L 263 416 C 259 417, 256 417, 253 416 Z" style={{ fill: 'var(--pero-jacket-accent, #2D8FED)' }} stroke="var(--pero-outline, #08102D)" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M 155 394 C 185 405, 226 406, 251 405 L 251 414 C 222 416, 178 414, 154 404 Z" style={{ fill: 'var(--pero-jacket-shade, #47A2F5)' }} opacity={0.55} />
              <path d="M 355 394 C 325 405, 288 406, 265 405 L 265 414 C 292 416, 332 414, 356 404 Z" style={{ fill: 'var(--pero-jacket-shade, #47A2F5)' }} opacity={0.55} />
            </g>

            <g className="pero-pocket-anim">
              <path d="M 294 346 L 340 346 L 340 384 C 340 392, 333 397, 324 397 L 310 397 C 301 397, 294 392, 294 384 Z" style={{ fill: 'var(--pero-jacket-accent, #2D8FED)' }} stroke="#162E66" strokeWidth="4" strokeLinejoin="round" />
              <path d="M 294 346 L 340 346 L 340 358 L 294 358 Z" fill="var(--pero-white, #FCFCFB)" stroke="#162E66" strokeWidth="4" strokeLinejoin="round" />
            </g>

            <g className="pero-lanyard-anim">
              <path d="M 192 315 L 256 334 L 320 315" fill="none" stroke="#1E2C52" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="250" y="325" width="12" height="17" rx="3.5" fill="#DCE4F0" stroke="var(--pero-outline, #08102D)" strokeWidth="3.5" />
              <line x1="253" y1="331" x2="259" y2="331" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              <rect x="234" y="341" width="44" height="48" rx="8" fill="var(--pero-navy, #202E54)" stroke="var(--pero-outline, #08102D)" strokeWidth="4" />
              <rect x="239" y="346" width="34" height="38" rx="4.5" fill="var(--pero-white, #FCFCFB)" />
              <g transform="translate(256, 363) rotate(-10)">
                <path d="M -7 -7 C -1 -11, 8 -8, 9 -1 C 10 6, 4 10, -3 8 C -9 6, -11 -1, -7 -7 Z" fill="none" stroke="#399EF9" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="5" y1="12" x2="12" y2="9" stroke="#399EF9" strokeWidth="3.8" strokeLinecap="round" />
              </g>
            </g>

            <g className="pero-collar-l-anim">
              <path d="M 158 302 C 142 308, 138 324, 152 332 C 176 340, 212 338, 240 328 L 236 308 C 204 316, 174 308, 158 302 Z" fill={`url(#${prefix}-jacket)`} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
              <path d="M 164 312 C 185 322, 212 324, 232 318" fill="none" style={{ stroke: 'var(--pero-jacket-highlight, #9AD7FF)' }} strokeWidth="3" strokeLinecap="round" />
            </g>
            <g className="pero-collar-r-anim">
              <path d="M 352 302 C 368 308, 372 324, 356 334 C 332 342, 296 340, 272 328 L 276 308 C 308 316, 336 308, 352 302 Z" fill={`url(#${prefix}-jacket)`} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
              <path d="M 346 312 C 325 322, 300 324, 280 318" fill="none" style={{ stroke: 'var(--pero-jacket-highlight, #9AD7FF)' }} strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          <g className="pero-head-anim">
            <g transform={p.headTransform}>
              <path d="M 134 218 C 128 158, 174 114, 258 114 C 344 114, 388 158, 382 222 C 378 280, 336 318, 258 318 C 180 318, 138 278, 134 218 Z" fill={`url(#${prefix}-navy)`} stroke="var(--pero-outline, #08102D)" strokeWidth="6.5" strokeLinejoin="round" />
              <path d="M 164 218 C 162 178, 188 154, 218 156 C 238 157, 252 172, 260 184 C 268 172, 286 154, 314 154 C 348 154, 370 182, 368 220 C 366 270, 326 308, 260 308 C 194 308, 166 270, 164 218 Z" fill="var(--pero-white, #FCFCFB)" stroke="var(--pero-outline, #08102D)" strokeWidth="3" strokeLinejoin="round" />
              <path d="M 176 268 C 200 298, 232 306, 260 306 C 288 306, 324 298, 352 268 C 336 294, 300 308, 260 308 C 220 308, 190 294, 176 268 Z" fill="var(--pero-white-shade, #DFE4F3)" />
              <circle cx="209" cy="210" r="39" fill="var(--pero-white, #FCFCFB)" />
              <g className="pero-blush-anim">
                <ellipse cx="186" cy="266" rx="15" ry="8" fill="var(--pero-blush, #FDC6BC)" opacity={0.88} transform="rotate(-6 186 266)" />
                <ellipse cx="336" cy="262" rx="15.5" ry="8" fill="var(--pero-blush, #FDC6BC)" opacity={0.88} transform="rotate(6 336 262)" />
              </g>
              <PeroBrows mood={p.brow} />
              <PeroEyeLeft expr={p.leftEye} />
              <PeroEyeRight expr={p.rightEye} />
              <PeroBeak expr={p.beak} prefix={prefix} />

              <g>
                <g className="pero-monocle-cord-anim">
                  <path d="M 164 202 C 146 210, 136 232, 134 256" fill="none" stroke="#151E35" strokeWidth="3.6" strokeLinecap="round" />
                </g>
                <circle cx="209" cy="210" r="42" fill={`url(#${prefix}-lens)`} />
                <g clipPath={`url(#${prefix}-lens-clip)`}>
                  <rect className="pero-lens-sweep-anim" x="196" y="162" width="24" height="96" fill="#FFFFFF" opacity={0.38} transform="rotate(24 209 210)" />
                </g>
                <path className="pero-monocle-gleam" d="M 184 185 C 194 176, 210 174, 222 178" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity={0.78} />
                <circle cx="209" cy="210" r="43" fill="none" stroke="var(--pero-monocle-rim, #1B2338)" strokeWidth="8.5" />
                <circle cx="209" cy="210" r="46.5" fill="none" stroke="var(--pero-outline, #08102D)" strokeWidth="2" />
                <circle cx="209" cy="210" r="39.5" fill="none" stroke="#8592B0" strokeWidth="2" />
                <circle cx="164" cy="202" r="6" fill="#DCE4F0" stroke="var(--pero-outline, #08102D)" strokeWidth="3" />
                <circle cx="163" cy="200.5" r="2" fill="#FFFFFF" />
              </g>

              <g className="pero-cap-anim">
                <g transform={p.capTransform}>
                  <g className="pero-cap-button-anim">
                    <ellipse cx="236" cy="40" rx="16" ry="7.5" style={{ fill: 'var(--pero-cap-button, #2D8FED)' }} stroke="var(--pero-outline, #08102D)" strokeWidth="5" />
                  </g>
                  <path d="M 140 166 C 134 100, 178 44, 240 42 C 296 40, 344 74, 354 128 C 288 118, 206 130, 140 166 Z" fill={`url(#${prefix}-cap)`} stroke="var(--pero-outline, #08102D)" strokeWidth="6" strokeLinejoin="round" />
                  <path d="M 238 43 C 204 68, 186 108, 184 146" fill="none" style={{ stroke: 'var(--pero-cap-seam, #2971C1)' }} strokeWidth="3" strokeLinecap="round" opacity={0.6} />
                  <path d="M 244 43 C 286 60, 314 88, 326 124" fill="none" style={{ stroke: 'var(--pero-cap-seam, #2971C1)' }} strokeWidth="3" strokeLinecap="round" opacity={0.6} />
                  <path d="M 164 102 C 174 72, 202 54, 228 50" fill="none" style={{ stroke: 'var(--pero-cap-highlight, #A6DBFF)' }} strokeWidth="4.5" strokeLinecap="round" opacity={0.65} />
                  <g className="pero-cap-emblem-anim"><g transform="translate(246, 84) rotate(-14)">
                    <path d="M -11 -11 C -2 -17, 12 -13, 14 -2 C 16 9, 7 15, -3 13 C -13 11, -17 0, -11 -11 Z" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="8" y1="21" x2="21" y2="16" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                  </g></g>
                  <g className="pero-cap-visor-anim">
                    <path d="M 192 146 C 254 114, 346 112, 382 142 C 378 152, 366 154, 348 148 C 304 134, 246 136, 192 146 Z" fill="#1E356B" stroke="var(--pero-outline, #08102D)" strokeWidth="5" strokeLinejoin="round" />
                    <path d="M 140 166 C 202 126, 302 102, 362 124 C 378 130, 385 138, 380 144 C 344 124, 256 126, 186 158 C 166 167, 150 172, 140 166 Z" style={{ fill: 'var(--pero-cap-main, #69BCFC)' }} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
                    <path d="M 164 154 C 224 124, 306 110, 358 124" fill="none" style={{ stroke: 'var(--pero-cap-highlight, #A6DBFF)' }} strokeWidth="3" strokeLinecap="round" opacity={0.75} />
                  </g>
                </g>
              </g>
            </g>
          </g>

          {p.rightFlipperFront && rightArm}

          <g className="pero-flipper-left-anim">
            <PeroFlipperLeft pose={p.leftFlipper} prefix={prefix} />
          </g>

          {p.prop !== 'ai-orbit' && <PeroProp prop={p.prop} prefix={prefix} />}
        </g>
      </g>
    </svg>
  );
};
