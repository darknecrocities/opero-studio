import React from 'react';
import type { FlipperLeftPose, FlipperRightPose } from './peroMotions';

export const PeroFlipperLeft: React.FC<{ pose: FlipperLeftPose; prefix: string }> = ({ pose, prefix }) => {
  const jacket = `url(#${prefix}-jacket)`;
  const navy = `url(#${prefix}-navy)`;
  const paths: Record<FlipperLeftPose, [string, string, string]> = {
    'thumbs-up': [
      'M 162 324 C 136 338, 118 358, 126 378 C 134 394, 158 394, 174 374 L 190 346 Z',
      'M 148 338 C 156 328, 170 326, 180 333 L 194 344 C 185 356, 174 364, 162 362 C 152 359, 146 348, 148 338 Z',
      'M 152 332 C 150 314, 154 282, 166 280 C 176 279, 180 296, 178 308 C 188 306, 200 314, 198 326 C 196 338, 184 352, 168 352 C 157 352, 152 342, 152 332 Z',
    ],
    'wave-up': [
      'M 162 326 C 134 316, 116 288, 108 264 L 142 252 C 152 276, 162 296, 176 312 Z',
      'M 106 263 C 116 254, 130 250, 143 251 L 145 264 C 132 264, 118 268, 109 275 Z',
      'M 105 262 C 94 244, 94 220, 110 214 C 124 209, 138 226, 142 250 Z',
    ],
    'cheer-up': [
      'M 156 334 C 126 322, 112 288, 112 256 L 144 248 C 148 274, 158 298, 172 314 Z',
      'M 111 256 C 121 247, 133 244, 145 246 L 146 259 C 134 258, 122 261, 113 268 Z',
      'M 110 254 C 102 234, 108 210, 124 208 C 138 206, 146 224, 145 246 Z',
    ],
    'chin-tap': [
      'M 160 326 C 130 342, 128 370, 146 382 C 164 392, 190 374, 210 342 L 190 322 C 178 336, 168 344, 158 340 Z',
      'M 185 322 C 192 312, 203 309, 212 315 L 221 326 C 214 337, 203 342, 193 338 Z',
      'M 205 310 C 215 292, 232 285, 240 293 C 248 300, 240 318, 222 327 Z',
    ],
    'touch-monocle': [
      'M 158 326 C 126 328, 116 300, 122 272 L 152 266 C 152 288, 160 304, 174 316 Z',
      'M 121 271 C 130 263, 142 261, 152 264 L 154 276 C 143 274, 131 277, 122 283 Z',
      'M 124 266 C 124 244, 138 225, 154 228 C 164 230, 163 250, 152 264 Z',
    ],
    'hold-magnifier': [
      'M 162 324 C 128 326, 114 302, 116 278 L 148 276 C 150 294, 160 306, 174 314 Z',
      'M 116 277 C 126 271, 138 270, 148 273 L 149 285 C 138 284, 126 285, 118 289 Z',
      'M 114 274 C 109 256, 120 242, 135 244 C 146 246, 150 260, 148 273 Z',
    ],
    'hold-shield': [
      'M 164 324 C 138 334, 126 352, 128 366 L 160 368 C 164 354, 170 344, 178 336 Z',
      'M 127 364 C 138 361, 150 362, 161 366 L 160 377 C 149 375, 137 374, 126 376 Z',
      'M 126 376 C 122 394, 136 408, 152 402 C 162 398, 165 386, 160 377 Z',
    ],
    'hold-orb-left': [
      'M 160 326 C 130 332, 114 316, 112 294 L 144 288 C 148 304, 158 314, 174 318 Z',
      'M 111 294 C 121 287, 133 285, 144 287 L 146 299 C 135 298, 123 300, 114 306 Z',
      'M 111 292 C 106 274, 118 258, 133 260 C 144 262, 148 275, 144 287 Z',
    ],
    'hold-left': [
      'M 164 322 C 138 334, 126 356, 130 376 L 162 374 C 165 358, 170 344, 178 336 Z',
      'M 129 372 C 140 368, 152 368, 163 372 L 162 384 C 151 382, 139 382, 129 385 Z',
      'M 129 384 C 126 402, 140 414, 156 408 C 165 404, 167 392, 162 384 Z',
    ],
    'tuck-in': [
      'M 156 328 C 136 346, 138 378, 160 390 L 188 374 C 178 360, 174 344, 174 330 Z',
      'M 159 388 C 168 378, 179 372, 189 373 L 193 385 C 183 387, 172 392, 164 398 Z',
      'M 166 397 C 174 410, 192 410, 200 398 C 204 390, 199 383, 192 385 Z',
    ],
    'startled-left': [
      'M 162 324 C 128 320, 108 296, 104 274 L 136 266 C 144 286, 156 300, 174 310 Z',
      'M 103 273 C 113 266, 125 264, 137 265 L 139 277 C 127 277, 114 279, 105 284 Z',
      'M 102 272 C 92 254, 98 232, 114 230 C 128 228, 138 244, 137 265 Z',
    ],
    'swing-back': [
      'M 164 322 C 136 340, 126 368, 134 388 L 164 380 C 162 362, 166 346, 176 336 Z',
      'M 133 386 C 144 380, 156 378, 165 379 L 166 390 C 156 391, 144 393, 135 397 Z',
      'M 135 396 C 136 414, 152 422, 166 414 C 174 408, 172 396, 166 390 Z',
    ],
    rest: [
      'M 162 322 C 136 332, 122 358, 122 380 L 158 386 C 162 366, 168 350, 176 340 Z',
      'M 122 378 C 134 377, 148 380, 160 384 L 159 396 C 146 398, 132 397, 123 394 C 120 390, 120 384, 122 378 Z',
      'M 124 394 C 133 397, 147 397, 158 395 C 165 406, 163 422, 150 424 C 132 425, 120 411, 124 394 Z',
    ],
  };
  const [sleeve, cuff, paw] = paths[pose];

  if (pose === 'hold-magnifier') {
    return (
      <>
        <path d={sleeve} fill={jacket} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
        <path d={cuff} fill="var(--pero-white, #FCFCFB)" stroke="var(--pero-outline, #08102D)" strokeWidth="5" strokeLinejoin="round" />
        <g transform="translate(120, 244) rotate(-28)">
          <line x1="0" y1="22" x2="0" y2="38" stroke="#1B2338" strokeWidth="10" strokeLinecap="round" />
          <circle cx="0" cy="-2" r="24" fill="#EAF3FF" fillOpacity="0.78" stroke="#1B2338" strokeWidth="6.5" />
          <g clipPath={`url(#${prefix}-mag-clip)`}>
            <rect className="pero-lens-sweep-anim" x="-8" y="-32" width="16" height="64" fill="#FFFFFF" opacity="0.55" transform="rotate(24 0 0)" />
          </g>
          <path d="M -11 -13 C -5 -18, 4 -18, 10 -14" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <circle className="pero-mag-clue-1" cx="-24" cy="-18" r="3" fill="#247BFA" opacity={0} />
          <circle className="pero-mag-clue-2" cx="22" cy="16" r="2.8" fill="#69BCFC" opacity={0} />
        </g>
        <path d={paw} fill={navy} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
      </>
    );
  }

  return (
    <>
      <path d={sleeve} fill={jacket} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
      <path d={cuff} fill="var(--pero-white, #FCFCFB)" stroke="var(--pero-outline, #08102D)" strokeWidth="5" strokeLinejoin="round" />
      <path d={paw} fill={navy} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
      {pose === 'thumbs-up' && (
        <path d="M 163 292 C 165 286, 170 286, 172 292" fill="none" stroke="#455B8F" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {pose === 'hold-orb-left' && (
        <>
          <circle cx="122" cy="240" r="9" fill="#247BFA" opacity="0.9" />
          <circle cx="122" cy="240" r="15" fill="#69BCFC" opacity="0.28" />
        </>
      )}
    </>
  );
};

export const PeroFlipperRight: React.FC<{ pose: FlipperRightPose; prefix: string }> = ({ pose, prefix }) => {
  const jacket = `url(#${prefix}-jacket)`;
  const navy = `url(#${prefix}-navy)`;
  const paths: Record<FlipperRightPose, [string, string, string]> = {
    'cheer-up': [
      'M 356 334 C 386 322, 400 288, 400 256 L 368 248 C 364 274, 354 298, 340 314 Z',
      'M 401 256 C 391 247, 379 244, 367 246 L 366 259 C 378 258, 390 261, 399 268 Z',
      'M 402 254 C 410 234, 404 210, 388 208 C 374 206, 366 224, 367 246 Z',
    ],
    'point-up': [
      'M 350 326 C 378 320, 396 298, 400 272 L 368 266 C 362 286, 354 302, 340 314 Z',
      'M 401 272 C 391 265, 379 264, 367 266 L 367 278 C 379 277, 391 279, 399 284 Z',
      'M 400 271 C 406 252, 400 232, 386 232 C 374 232, 367 248, 368 266 Z',
    ],
    'point-out': [
      'M 350 324 C 380 322, 402 316, 418 308 L 408 338 C 386 344, 364 344, 344 340 Z',
      'M 417 308 C 408 316, 405 328, 408 339 L 419 337 C 418 326, 420 316, 426 309 Z',
      'M 424 309 C 444 306, 460 314, 458 326 C 456 338, 438 342, 419 337 Z',
    ],
    'write-out': [
      'M 346 326 C 374 328, 392 340, 400 354 L 376 372 C 364 358, 352 346, 338 340 Z',
      'M 399 352 C 390 356, 380 364, 375 373 L 384 381 C 391 373, 400 365, 408 361 Z',
      'M 405 360 C 417 366, 420 379, 409 387 C 398 394, 385 388, 383 379 Z',
    ],
    'hold-camera': [
      'M 348 326 C 376 320, 392 302, 396 284 L 366 280 C 362 296, 354 308, 340 316 Z',
      'M 396 283 C 386 277, 375 276, 365 279 L 365 290 C 376 289, 387 290, 395 295 Z',
      'M 396 281 C 402 266, 392 252, 378 254 C 367 256, 364 268, 365 280 Z',
    ],
    'toss-up': [
      'M 350 326 C 380 314, 400 290, 406 264 L 374 256 C 366 280, 356 298, 340 312 Z',
      'M 406 264 C 396 256, 384 254, 373 256 L 373 268 C 384 267, 396 269, 404 275 Z',
      'M 406 263 C 412 244, 404 224, 390 224 C 378 224, 372 240, 373 256 Z',
    ],
    'chin-tap-right': [
      'M 352 326 C 382 342, 384 370, 366 382 C 348 392, 322 374, 302 342 L 322 322 C 334 336, 344 344, 354 340 Z',
      'M 327 322 C 320 312, 309 309, 300 315 L 291 326 C 298 337, 309 342, 319 338 Z',
      'M 307 310 C 297 292, 280 285, 272 293 C 264 300, 272 318, 290 327 Z',
    ],
    'hold-orb-right': [
      'M 352 326 C 382 332, 398 316, 400 294 L 368 288 C 364 304, 354 314, 338 318 Z',
      'M 401 294 C 391 287, 379 285, 368 287 L 366 299 C 377 298, 389 300, 398 306 Z',
      'M 401 292 C 406 274, 394 258, 379 260 C 368 262, 364 275, 368 287 Z',
    ],
    'tuck-in-front': [
      'M 356 328 C 376 346, 374 378, 352 390 L 324 374 C 334 360, 338 344, 338 330 Z',
      'M 353 388 C 344 378, 333 372, 323 373 L 319 385 C 329 387, 340 392, 348 398 Z',
      'M 346 397 C 338 410, 320 410, 312 398 C 308 390, 313 383, 320 385 Z',
    ],
    'startled-right': [
      'M 350 324 C 384 320, 404 296, 408 274 L 376 266 C 368 286, 356 300, 338 310 Z',
      'M 409 273 C 399 266, 387 264, 375 265 L 373 277 C 385 277, 398 279, 407 284 Z',
      'M 410 272 C 420 254, 414 232, 398 230 C 384 228, 374 244, 375 265 Z',
    ],
    'swing-forward': [
      'M 348 322 C 380 328, 396 348, 396 370 L 362 374 C 358 356, 348 342, 334 334 Z',
      'M 397 368 C 385 366, 373 367, 362 372 L 363 384 C 375 381, 387 380, 397 380 Z',
      'M 397 380 C 402 398, 388 412, 372 408 C 362 405, 358 393, 363 384 Z',
    ],
    rest: [
      'M 344 320 C 372 330, 388 356, 388 380 L 352 386 C 348 366, 342 350, 332 340 Z',
      'M 351 384 C 364 380, 378 377, 388 377 C 390 385, 389 392, 386 396 C 374 398, 360 398, 349 395 Z',
      'M 351 395 C 363 398, 376 397, 385 395 C 387 412, 374 426, 355 424 C 344 422, 343 406, 351 395 Z',
    ],
  };
  const [sleeve, cuff, paw] = paths[pose];

  return (
    <>
      <path d={sleeve} fill={jacket} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
      <path d={cuff} fill="var(--pero-white, #FCFCFB)" stroke="var(--pero-outline, #08102D)" strokeWidth="5" strokeLinejoin="round" />
      {pose === 'write-out' && (
        <g transform="translate(402, 356) rotate(-32)">
          <rect x="-4" y="-26" width="8" height="34" rx="3" fill="#247BFA" stroke="#08102D" strokeWidth="3" />
          <polygon points="-4,8 4,8 0,17" fill="#FDA326" stroke="#08102D" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      )}
      <path d={paw} fill={navy} stroke="var(--pero-outline, #08102D)" strokeWidth="5.5" strokeLinejoin="round" />
      {pose === 'hold-orb-right' && (
        <>
          <circle cx="390" cy="240" r="9" fill="#247BFA" opacity="0.9" />
          <circle cx="390" cy="240" r="15" fill="#69BCFC" opacity="0.28" />
        </>
      )}
    </>
  );
};
