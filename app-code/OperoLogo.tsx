import React from 'react';

export interface OperoLogoProps {
  /** 'squircle': Official Midnight Navy squircle + Pero monocle cap mark; 'mark': transparent face/cap mark; 'mono': 1-color line mark */
  variant?: 'squircle' | 'mark' | 'mono';
  size?: number | string;
  inkColor?: string;
  skyColor?: string;
  className?: string;
  title?: string;
}

export const OperoLogo: React.FC<OperoLogoProps> = ({
  variant = 'squircle',
  size = 44,
  inkColor = '#071B4F',
  skyColor = '#5BA3FC',
  className = '',
  title = 'OPERO App Icon',
}) => {
  const clipId = React.useId();
  const isMono = variant === 'mono';
  const isSquircle = variant === 'squircle';
  const capFill = isMono ? 'none' : skyColor;
  const visorFill = isMono ? 'none' : '#80BEFC';
  const stroke = isMono ? inkColor : '#041036';

  const coreMark = (
    <>
      <path d="M 96 174 L 122 188 M 86 206 L 114 210" stroke={isSquircle ? '#FFFFFF' : inkColor} strokeWidth="14" strokeLinecap="round" />
      <path d="M 140 220 C 138 118, 212 72, 294 84 C 350 92, 386 128, 392 172 L 140 220 Z" fill={capFill} stroke={stroke} strokeWidth="10" strokeLinejoin="round" />
      <path d="M 140 220 C 216 154, 368 140, 424 188 C 432 204, 412 216, 392 204 C 334 174, 218 186, 140 228 Z" fill={visorFill} stroke={stroke} strokeWidth="10" strokeLinejoin="round" />
      <circle cx="282" cy="126" r="19" fill="none" stroke="#FFFFFF" strokeWidth="11" />
      <path d="M 308 144 L 324 138" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
      <circle cx="204" cy="306" r="68" fill={isMono ? 'none' : '#E6F2FF'} stroke={stroke} strokeWidth="14" />
      <circle cx="204" cy="306" r="56" fill={isMono ? 'none' : '#FFFFFF'} stroke={inkColor} strokeWidth="6" />
      <ellipse cx="212" cy="310" rx="22" ry="29" fill={inkColor} />
      <circle cx="220" cy="302" r="8" fill="#FFFFFF" />
      <circle cx="136" cy="296" r="10" fill="#FFFFFF" stroke={stroke} strokeWidth="6" />
      <path d="M 308 308 C 324 286, 356 286, 372 308" fill="none" stroke={inkColor} strokeWidth="16" strokeLinecap="round" />
      <path d="M 236 352 C 252 328, 282 328, 298 352 C 280 374, 254 374, 236 352 Z" fill={capFill} stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
    </>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <title>{title}</title>
      {isSquircle ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <path d="M 140 28 C 44 28, 28 44, 28 140 L 28 372 C 28 468, 44 484, 140 484 L 372 484 C 468 484, 484 468, 484 372 L 484 140 C 484 44, 468 28, 372 28 Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect x="0" y="0" width="512" height="512" fill={inkColor} />
            <path d="M 60 490 C 60 326, 134 218, 260 218 C 386 218, 462 326, 462 490 Z" fill="#0E2052" />
            <path d="M 102 490 C 100 456, 126 436, 152 434 C 118 424, 108 386, 124 344 C 142 292, 190 272, 224 288 C 244 298, 254 318, 262 332 C 272 308, 304 268, 354 274 C 414 282, 444 352, 418 418 C 434 426, 434 452, 412 490 Z" fill="#FBFBFC" />
            {coreMark}
          </g>
          <path d="M 140 28 C 44 28, 28 44, 28 140 L 28 372 C 28 468, 44 484, 140 484 L 372 484 C 468 484, 484 468, 484 372 L 484 140 C 484 44, 468 28, 372 28 Z" fill="none" stroke={stroke} strokeWidth="10" />
        </>
      ) : (
        coreMark
      )}
    </svg>
  );
};
