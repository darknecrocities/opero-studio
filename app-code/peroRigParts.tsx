import React from 'react';
import type { BeakExpr, BrowMood, EyeLeftExpr, EyeRightExpr, FootPose } from './peroMotions';

export const PeroDefs: React.FC<{ prefix: string }> = ({ prefix }) => (
  <defs>
    <linearGradient id={`${prefix}-cap`} x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" style={{ stopColor: 'var(--pero-cap-light, #7BCEFF)' }} />
      <stop offset="60%" style={{ stopColor: 'var(--pero-cap-main, #69BCFC)' }} />
      <stop offset="100%" style={{ stopColor: 'var(--pero-cap-shade, #4FA9F8)' }} />
    </linearGradient>
    <linearGradient id={`${prefix}-jacket`} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
      <stop offset="0%" style={{ stopColor: 'var(--pero-jacket-light, #76C7FC)' }} />
      <stop offset="55%" style={{ stopColor: 'var(--pero-jacket-main, #69BCFC)' }} />
      <stop offset="100%" style={{ stopColor: 'var(--pero-jacket-shade, #52AEFA)' }} />
    </linearGradient>
    <linearGradient id={`${prefix}-navy`} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
      <stop offset="0%" stopColor="#273763" />
      <stop offset="65%" stopColor="var(--pero-navy, #202E54)" />
      <stop offset="100%" stopColor="var(--pero-navy-shade, #162343)" />
    </linearGradient>
    <linearGradient id={`${prefix}-orange`} x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor="var(--pero-beak-light, #FDB936)" />
      <stop offset="60%" stopColor="var(--pero-beak-base, #FDA326)" />
      <stop offset="100%" stopColor="#F68218" />
    </linearGradient>
    <linearGradient id={`${prefix}-lens`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
      <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#69BCFC" stopOpacity="0.12" />
    </linearGradient>
    <clipPath id={`${prefix}-lens-clip`}><circle cx="209" cy="210" r="39.5" /></clipPath>
    <clipPath id={`${prefix}-mag-clip`}><circle cx="0" cy="-2" r="21" /></clipPath>
    <clipPath id={`${prefix}-shield-clip`}><path d="M 0 -40 L 34 -26 L 34 8 C 34 30, 14 44, 0 50 C -14 44, -34 30, -34 8 L -34 -26 Z" /></clipPath>
  </defs>
);

export const PeroBrows: React.FC<{ mood?: BrowMood }> = ({ mood = 'neutral' }) => {
  if (mood === 'happy') {
    return (
      <>
        <g className="pero-brow-l-anim"><path d="M 200 183 C 208 178, 220 178, 226 183" fill="none" stroke="#182038" strokeWidth="3.6" strokeLinecap="round" /></g>
        <g className="pero-brow-r-anim"><path d="M 305 183 C 313 178, 324 178, 331 183" fill="none" stroke="#182038" strokeWidth="3.6" strokeLinecap="round" /></g>
      </>
    );
  }
  if (mood === 'focused') {
    return (
      <>
        <g className="pero-brow-l-anim"><path d="M 200 181 C 208 183, 218 185, 226 186" fill="none" stroke="#182038" strokeWidth="3.4" strokeLinecap="round" opacity="0.9" /></g>
        <g className="pero-brow-r-anim"><path d="M 304 186 C 312 185, 322 183, 330 181" fill="none" stroke="#182038" strokeWidth="3.4" strokeLinecap="round" opacity="0.9" /></g>
      </>
    );
  }
  if (mood === 'curious') {
    return (
      <>
        <g className="pero-brow-l-anim"><path d="M 200 184 C 208 181, 219 181, 226 184" fill="none" stroke="#182038" strokeWidth="3.4" strokeLinecap="round" /></g>
        <g className="pero-brow-r-anim"><path d="M 303 182 C 312 175, 325 176, 333 183" fill="none" stroke="#182038" strokeWidth="3.8" strokeLinecap="round" /></g>
      </>
    );
  }
  if (mood === 'startled') {
    return (
      <>
        <g className="pero-brow-l-anim"><path d="M 199 179 C 208 174, 220 175, 227 180" fill="none" stroke="#182038" strokeWidth="3.8" strokeLinecap="round" /></g>
        <g className="pero-brow-r-anim"><path d="M 303 180 C 311 174, 323 174, 332 180" fill="none" stroke="#182038" strokeWidth="3.8" strokeLinecap="round" /></g>
      </>
    );
  }
  if (mood === 'sleepy') {
    return (
      <>
        <g className="pero-brow-l-anim"><path d="M 200 187 C 209 189, 219 189, 226 186" fill="none" stroke="#182038" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" /></g>
        <g className="pero-brow-r-anim"><path d="M 305 186 C 313 189, 323 189, 331 187" fill="none" stroke="#182038" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" /></g>
      </>
    );
  }
  return (
    <>
      <g className="pero-brow-l-anim"><path d="M 201 184 C 209 181, 218 181, 225 184" fill="none" stroke="#182038" strokeWidth="3" strokeLinecap="round" opacity="0.48" /></g>
      <g className="pero-brow-r-anim"><path d="M 305 184 C 312 181, 322 181, 329 184" fill="none" stroke="#182038" strokeWidth="3" strokeLinecap="round" opacity="0.48" /></g>
    </>
  );
};

export const PeroEyeLeft: React.FC<{ expr: EyeLeftExpr }> = ({ expr }) => {
  if (expr === 'focused') {
    return (
      <g className="pero-eye-blink-l"><g className="pero-pupil-anim">
        <ellipse cx="214" cy="212" rx="16.5" ry="21.5" fill="#182038" />
        <circle cx="209" cy="205" r="6.2" fill="#FFFFFF" />
        <circle cx="219" cy="220" r="2.2" fill="#FFFFFF" opacity="0.75" />
      </g></g>
    );
  }
  if (expr === 'look-up') {
    return (
      <g className="pero-eye-blink-l"><g className="pero-pupil-anim">
        <ellipse cx="213" cy="203" rx="16" ry="20.5" fill="#182038" />
        <circle cx="208" cy="196" r="6" fill="#FFFFFF" />
      </g></g>
    );
  }
  if (expr === 'calm' || expr === 'closed') {
    return (
      <path
        d={expr === 'calm' ? 'M 193 213 C 200 222, 224 222, 231 213' : 'M 193 214 C 201 224, 223 224, 231 214'}
        fill="none"
        stroke="#182038"
        strokeWidth="6.8"
        strokeLinecap="round"
      />
    );
  }
  if (expr === 'happy') {
    return <path d="M 193 214 C 200 197, 224 197, 231 214" fill="none" stroke="#182038" strokeWidth="7" strokeLinecap="round" />;
  }
  if (expr === 'wide') {
    return (
      <g className="pero-eye-blink-l"><g className="pero-pupil-anim">
        <ellipse cx="212" cy="212" rx="14" ry="18" fill="#182038" />
        <circle cx="207" cy="206" r="5.5" fill="#FFFFFF" />
      </g></g>
    );
  }
  return (
    <g className="pero-eye-blink-l"><g className="pero-pupil-anim">
      <ellipse cx="212" cy="212" rx="18" ry="23.5" fill="#182038" />
      <circle cx="206" cy="204" r="6.8" fill="#FFFFFF" />
      <circle cx="218" cy="221" r="2.6" fill="#FFFFFF" opacity="0.75" />
    </g></g>
  );
};

export const PeroEyeRight: React.FC<{ expr: EyeRightExpr }> = ({ expr }) => {
  if (expr === 'wink') {
    return <path d="M 298 213 C 305 196, 328 195, 336 211" fill="none" stroke="#182038" strokeWidth="7.5" strokeLinecap="round" />;
  }
  if (expr === 'focused') {
    return (
      <g className="pero-eye-blink-r"><g className="pero-pupil-anim">
        <ellipse cx="318" cy="212" rx="16" ry="20.5" fill="#182038" />
        <circle cx="313" cy="205" r="6" fill="#FFFFFF" />
      </g></g>
    );
  }
  if (expr === 'squint') {
    return <path d="M 299 212 C 308 205, 326 205, 335 212" fill="none" stroke="#182038" strokeWidth="7" strokeLinecap="round" />;
  }
  if (expr === 'curious') {
    return (
      <g className="pero-eye-blink-r"><g className="pero-pupil-anim">
        <ellipse cx="318" cy="213" rx="15" ry="19" fill="#182038" />
        <circle cx="313" cy="206" r="5.5" fill="#FFFFFF" />
      </g></g>
    );
  }
  if (expr === 'calm' || expr === 'closed') {
    return (
      <path
        d={expr === 'calm' ? 'M 299 213 C 306 222, 330 222, 337 213' : 'M 299 214 C 307 224, 329 224, 337 214'}
        fill="none"
        stroke="#182038"
        strokeWidth="6.8"
        strokeLinecap="round"
      />
    );
  }
  if (expr === 'happy') {
    return <path d="M 298 214 C 306 197, 329 197, 336 214" fill="none" stroke="#182038" strokeWidth="7.2" strokeLinecap="round" />;
  }
  if (expr === 'wide') {
    return (
      <g className="pero-eye-blink-r"><g className="pero-pupil-anim">
        <ellipse cx="318" cy="212" rx="13.5" ry="17.5" fill="#182038" />
        <circle cx="313" cy="206" r="5.2" fill="#FFFFFF" />
      </g></g>
    );
  }
  return (
    <g className="pero-eye-blink-r"><g className="pero-pupil-anim">
      <ellipse cx="318" cy="212" rx="17" ry="22.5" fill="#182038" />
      <circle cx="312" cy="204" r="6.5" fill="#FFFFFF" />
      <circle cx="324" cy="220" r="2.4" fill="#FFFFFF" opacity="0.75" />
    </g></g>
  );
};

export const PeroBeak: React.FC<{ expr: BeakExpr; prefix: string }> = ({ expr, prefix }) => {
  if (expr === 'open-smile') {
    return (
      <>
        <g className="pero-beak-lower-anim">
          <path d="M 239 245 C 248 269, 276 269, 285 245 Z" fill="#C94B0A" stroke="#5A2404" strokeWidth="4.2" strokeLinejoin="round" />
          <path d="M 248 256 C 256 264, 268 264, 276 256 C 269 253, 255 253, 248 256 Z" fill="#FF8A7A" />
        </g>
        <g className="pero-beak-upper-anim">
          <path d="M 236 244 C 244 226, 278 226, 288 244 C 276 249, 248 249, 236 244 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="4.5" strokeLinejoin="round" />
          <ellipse cx="261" cy="235" rx="10" ry="3.2" fill="#FFE082" opacity="0.75" />
        </g>
      </>
    );
  }
  if (expr === 'o-mouth') {
    return (
      <>
        <g className="pero-beak-lower-anim">
          <ellipse cx="262" cy="253" rx="10" ry="11" fill="#C94B0A" stroke="#5A2404" strokeWidth="4.2" />
        </g>
        <g className="pero-beak-upper-anim">
          <path d="M 240 243 C 247 227, 276 227, 284 243 C 274 247, 250 247, 240 243 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="4.5" strokeLinejoin="round" />
          <ellipse cx="261" cy="235" rx="9" ry="2.8" fill="#FFE082" opacity="0.75" />
        </g>
      </>
    );
  }
  if (expr === 'neutral') {
    return (
      <>
        <g className="pero-beak-lower-anim">
          <path d="M 240 246 C 249 260, 275 260, 284 246 C 275 249, 249 249, 240 246 Z" fill="#F67614" stroke="#5A2404" strokeWidth="4.2" strokeLinejoin="round" />
        </g>
        <g className="pero-beak-upper-anim">
          <path d="M 238 245 C 245 228, 277 228, 286 245 C 275 249, 249 249, 238 245 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="4.5" strokeLinejoin="round" />
          <ellipse cx="261" cy="236" rx="9.5" ry="3" fill="#FFE082" opacity="0.7" />
        </g>
      </>
    );
  }
  return (
    <>
      <g className="pero-beak-lower-anim">
        <path d="M 239 246 C 248 263, 276 263, 285 246 C 276 250, 248 250, 239 246 Z" fill="#F67614" stroke="#5A2404" strokeWidth="4.2" strokeLinejoin="round" />
      </g>
      <g className="pero-beak-upper-anim">
        <path d="M 237 245 C 244 227, 278 227, 287 245 C 276 250, 248 250, 237 245 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="4.5" strokeLinejoin="round" />
        <ellipse cx="261" cy="236" rx="10" ry="3.2" fill="#FFE082" opacity="0.75" />
      </g>
    </>
  );
};

export const PeroFoot: React.FC<{ side: 'left' | 'right'; pose: FootPose; prefix: string }> = ({ side, pose, prefix }) => {
  if (side === 'left') {
    const ty = pose === 'tip-left' ? 456 : pose === 'step-up' ? 448 : 464;
    const rot = pose === 'tip-left' ? 12 : pose === 'step-up' ? -12 : -4;
    return (
      <g className="pero-foot-left-anim">
        <g transform={`translate(194, ${ty}) rotate(${rot})`}>
          <path d="M -44 4 C -46 -12, -22 -20, 6 -18 C 30 -16, 44 -4, 42 8 C 40 18, 14 20, -10 19 C -32 18, -43 13, -44 4 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="5" strokeLinejoin="round" />
          <ellipse cx="-10" cy="-7" rx="14" ry="4.5" fill="#FFE082" opacity="0.65" transform="rotate(-6 -10 -7)" />
        </g>
      </g>
    );
  }
  const ty = pose === 'tip-right' ? 456 : 464;
  const rot = pose === 'tip-right' ? -12 : 5;
  return (
    <g className="pero-foot-right-anim">
      <g transform={`translate(324, ${ty}) rotate(${rot})`}>
        <path d="M -42 8 C -44 -4, -30 -16, -6 -18 C 22 -20, 46 -12, 44 4 C 43 13, 32 18, 10 19 C -14 20, -40 18, -42 8 Z" fill={`url(#${prefix}-orange)`} stroke="#5A2404" strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="10" cy="-7" rx="14" ry="4.5" fill="#FFE082" opacity="0.65" transform="rotate(6 10 -7)" />
      </g>
    </g>
  );
};

export const PeroDustPuffs: React.FC = () => (
  <g>
    <g className="pero-dust-l" opacity={0}>
      <ellipse cx="174" cy="476" rx="13" ry="6" fill="#CBD5E1" />
      <circle cx="160" cy="473" r="5" fill="#E2E8F0" />
    </g>
    <g className="pero-dust-r" opacity={0}>
      <ellipse cx="338" cy="476" rx="13" ry="6" fill="#CBD5E1" />
      <circle cx="352" cy="473" r="5" fill="#E2E8F0" />
    </g>
  </g>
);
