/**
 * Exact vector path library and SVG assembler for Pero's constrained 2D rig.
 * Shares 100% identical geometry and palette tokens with svg/ and app-code/.
 */
(function (global) {
  'use strict';

  const FLIPPER_LEFT_PATHS = {
    'rest': [
      'M 162 322 C 136 332, 122 358, 122 380 L 158 386 C 162 366, 168 350, 176 340 Z',
      'M 122 378 C 134 377, 148 380, 160 384 L 159 396 C 146 398, 132 397, 123 394 C 120 390, 120 384, 122 378 Z',
      'M 124 394 C 133 397, 147 397, 158 395 C 165 406, 163 422, 150 424 C 132 425, 120 411, 124 394 Z',
    ],
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
  };

  const FLIPPER_RIGHT_PATHS = {
    'rest': [
      'M 344 320 C 372 330, 388 356, 388 380 L 352 386 C 348 366, 342 350, 332 340 Z',
      'M 351 384 C 364 380, 378 377, 388 377 C 390 385, 389 392, 386 396 C 374 398, 360 398, 349 395 Z',
      'M 351 395 C 363 398, 376 397, 385 395 C 387 412, 374 426, 355 424 C 344 422, 343 406, 351 395 Z',
    ],
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
  };

  function eyeLeftSvg(expr, gazeX, gazeY) {
    const gx = gazeX || 0;
    const gy = gazeY || 0;
    if (expr === 'calm') return '<path d="M 193 213 C 200 222, 224 222, 231 213" fill="none" stroke="#182038" stroke-width="6.8" stroke-linecap="round"/>';
    if (expr === 'closed') return '<path d="M 193 214 C 201 224, 223 224, 231 214" fill="none" stroke="#182038" stroke-width="6.5" stroke-linecap="round"/>';
    if (expr === 'happy') return '<path d="M 193 214 C 200 197, 224 197, 231 214" fill="none" stroke="#182038" stroke-width="7" stroke-linecap="round"/>';
    const rx = expr === 'wide' ? 14 : expr === 'focused' ? 16.5 : 18;
    const ry = expr === 'wide' ? 18 : expr === 'focused' ? 21.5 : 23.5;
    const cy = expr === 'look-up' ? 203 : 212;
    return `<g class="pero-eye-blink-l"><g class="pero-pupil-anim"><g transform="translate(${gx.toFixed(2)}, ${gy.toFixed(2)})">
      <ellipse cx="212" cy="${cy}" rx="${rx}" ry="${ry}" fill="#182038"/>
      <circle cx="206" cy="${cy - 8}" r="6.4" fill="#FFFFFF"/>
      <circle cx="218" cy="${cy + 9}" r="2.4" fill="#FFFFFF" opacity="0.75"/>
    </g></g></g>`;
  }

  function eyeRightSvg(expr, gazeX, gazeY, blink) {
    const gx = gazeX || 0;
    const gy = gazeY || 0;
    if (blink) return '<path d="M 299 214 C 307 224, 329 224, 337 214" fill="none" stroke="#182038" stroke-width="6.5" stroke-linecap="round"/>';
    if (expr === 'wink') return '<path d="M 298 213 C 305 196, 328 195, 336 211" fill="none" stroke="#182038" stroke-width="7.5" stroke-linecap="round"/>';
    if (expr === 'calm') return '<path d="M 299 213 C 306 222, 330 222, 337 213" fill="none" stroke="#182038" stroke-width="6.8" stroke-linecap="round"/>';
    if (expr === 'closed') return '<path d="M 299 214 C 307 224, 329 224, 337 214" fill="none" stroke="#182038" stroke-width="6.5" stroke-linecap="round"/>';
    if (expr === 'happy') return '<path d="M 298 214 C 306 197, 329 197, 336 214" fill="none" stroke="#182038" stroke-width="7.2" stroke-linecap="round"/>';
    if (expr === 'squint') {
      return '<path d="M 299 212 C 308 205, 326 205, 335 212" fill="none" stroke="#182038" stroke-width="7" stroke-linecap="round"/>';
    }
    const rx = expr === 'wide' ? 13.5 : expr === 'curious' ? 15 : expr === 'focused' ? 16 : 17;
    const ry = expr === 'wide' ? 17.5 : expr === 'curious' ? 19 : expr === 'focused' ? 20.5 : 22.5;
    return `<g class="pero-eye-blink-r"><g class="pero-pupil-anim"><g transform="translate(${gx.toFixed(2)}, ${gy.toFixed(2)})">
      <ellipse cx="318" cy="212" rx="${rx}" ry="${ry}" fill="#182038"/>
      <circle cx="312" cy="204" r="6.2" fill="#FFFFFF"/>
      <circle cx="324" cy="220" r="2.4" fill="#FFFFFF" opacity="0.75"/>
    </g></g></g>`;
  }

  function browSvg(mood) {
    if (mood === 'happy') return '<g class="pero-brow-l-anim"><path d="M 200 183 C 208 178, 220 178, 226 183" fill="none" stroke="#182038" stroke-width="3.6" stroke-linecap="round"/></g><g class="pero-brow-r-anim"><path d="M 305 183 C 313 178, 324 178, 331 183" fill="none" stroke="#182038" stroke-width="3.6" stroke-linecap="round"/></g>';
    if (mood === 'focused') return '<g class="pero-brow-l-anim"><path d="M 200 181 C 208 183, 218 185, 226 186" fill="none" stroke="#182038" stroke-width="3.4" stroke-linecap="round" opacity="0.9"/></g><g class="pero-brow-r-anim"><path d="M 304 186 C 312 185, 322 183, 330 181" fill="none" stroke="#182038" stroke-width="3.4" stroke-linecap="round" opacity="0.9"/></g>';
    if (mood === 'curious') return '<g class="pero-brow-l-anim"><path d="M 200 184 C 208 181, 219 181, 226 184" fill="none" stroke="#182038" stroke-width="3.4" stroke-linecap="round"/></g><g class="pero-brow-r-anim"><path d="M 303 182 C 312 175, 325 176, 333 183" fill="none" stroke="#182038" stroke-width="3.8" stroke-linecap="round"/></g>';
    if (mood === 'startled') return '<g class="pero-brow-l-anim"><path d="M 199 179 C 208 174, 220 175, 227 180" fill="none" stroke="#182038" stroke-width="3.8" stroke-linecap="round"/></g><g class="pero-brow-r-anim"><path d="M 303 180 C 311 174, 323 174, 332 180" fill="none" stroke="#182038" stroke-width="3.8" stroke-linecap="round"/></g>';
    if (mood === 'sleepy') return '<g class="pero-brow-l-anim"><path d="M 200 187 C 209 189, 219 189, 226 186" fill="none" stroke="#182038" stroke-width="3.4" stroke-linecap="round" opacity="0.75"/></g><g class="pero-brow-r-anim"><path d="M 305 186 C 313 189, 323 189, 331 187" fill="none" stroke="#182038" stroke-width="3.4" stroke-linecap="round" opacity="0.75"/></g>';
    return '<g class="pero-brow-l-anim"><path d="M 201 184 C 209 181, 218 181, 225 184" fill="none" stroke="#182038" stroke-width="3" stroke-linecap="round" opacity="0.48"/></g><g class="pero-brow-r-anim"><path d="M 305 184 C 312 181, 322 181, 329 184" fill="none" stroke="#182038" stroke-width="3" stroke-linecap="round" opacity="0.48"/></g>';
  }

  function beakSvg(expr, orangeUrl, scaleY) {
    const sy = typeof scaleY === 'number' ? scaleY : 1;
    const jawT = `translate(262, 245) scale(1, ${sy.toFixed(3)}) translate(-262, -245)`;
    if (expr === 'open-smile') {
      return `<g transform="${jawT}"><g class="pero-beak-lower-anim"><path d="M 239 245 C 248 269, 276 269, 285 245 Z" fill="#C94B0A" stroke="#5A2404" stroke-width="4.2" stroke-linejoin="round"/><path d="M 248 256 C 256 264, 268 264, 276 256 C 269 253, 255 253, 248 256 Z" fill="#FF8A7A"/></g></g><g class="pero-beak-upper-anim"><path d="M 236 244 C 244 226, 278 226, 288 244 C 276 249, 248 249, 236 244 Z" fill="url(#${orangeUrl})" stroke="#5A2404" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="261" cy="235" rx="10" ry="3.2" fill="#FFE082" opacity="0.75"/></g>`;
    }
    if (expr === 'o-mouth') {
      return `<g transform="${jawT}"><g class="pero-beak-lower-anim"><ellipse cx="262" cy="253" rx="10" ry="11" fill="#C94B0A" stroke="#5A2404" stroke-width="4.2"/></g></g><g class="pero-beak-upper-anim"><path d="M 240 243 C 247 227, 276 227, 284 243 C 274 247, 250 247, 240 243 Z" fill="url(#${orangeUrl})" stroke="#5A2404" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="261" cy="235" rx="9" ry="2.8" fill="#FFE082" opacity="0.75"/></g>`;
    }
    if (expr === 'neutral') {
      return `<g transform="${jawT}"><g class="pero-beak-lower-anim"><path d="M 240 246 C 249 260, 275 260, 284 246 C 275 249, 249 249, 240 246 Z" fill="#F67614" stroke="#5A2404" stroke-width="4.2" stroke-linejoin="round"/></g></g><g class="pero-beak-upper-anim"><path d="M 238 245 C 245 228, 277 228, 286 245 C 275 249, 249 249, 238 245 Z" fill="url(#${orangeUrl})" stroke="#5A2404" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="261" cy="236" rx="9.5" ry="3" fill="#FFE082" opacity="0.7"/></g>`;
    }
    return `<g transform="${jawT}"><g class="pero-beak-lower-anim"><path d="M 239 246 C 248 263, 276 263, 285 246 C 276 250, 248 250, 239 246 Z" fill="#F67614" stroke="#5A2404" stroke-width="4.2" stroke-linejoin="round"/></g></g><g class="pero-beak-upper-anim"><path d="M 237 245 C 244 227, 278 227, 287 245 C 276 250, 248 250, 237 245 Z" fill="url(#${orangeUrl})" stroke="#5A2404" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="261" cy="236" rx="10" ry="3.2" fill="#FFE082" opacity="0.75"/></g>`;
  }

  function propSvg(prop, prefix) {
    const pfx = prefix || 'studio-pero';
    const map = {
      'none': '',
      'sparkle-wave': '<g><circle class="pero-spark-ring" cx="114" cy="232" r="18" fill="none" stroke="#69BCFC" stroke-width="2.5" opacity="0"/><path class="pero-spark-1" d="M 74 188 L 79 201 L 92 206 L 79 211 L 74 224 L 69 211 L 56 206 L 69 201 Z" fill="#247BFA"/><circle class="pero-spark-2" cx="102" cy="174" r="5.5" fill="#69BCFC"/><path class="pero-spark-3" d="M 62 167 L 65 173 L 71 176 L 65 179 L 62 185 L 59 179 L 53 176 L 59 173 Z" fill="#69BCFC"/></g>',
      'hero-glint': '<g><circle class="pero-spark-ring" cx="172" cy="288" r="14" fill="none" stroke="#247BFA" stroke-width="2.5" opacity="0"/><path class="pero-spark-1" d="M 118 244 L 122 254 L 132 258 L 122 262 L 118 272 L 114 262 L 104 258 L 114 254 Z" fill="#247BFA"/><circle class="pero-spark-2" cx="138" cy="236" r="4.8" fill="#69BCFC"/></g>',
      'rec-badge': '<g transform="translate(422, 114)"><g class="pero-prop-anim"><rect x="-36" y="-17" width="80" height="34" rx="17" fill="#FFFFFF" stroke="#E1E8F0" stroke-width="3"/><circle cx="-16" cy="0" r="8.5" fill="#C43D4B" opacity="0.25" class="pero-prop-ring"/><circle cx="-16" cy="0" r="8.5" fill="none" stroke="#C43D4B" stroke-width="2" opacity="0" class="pero-prop-ring-2"/><circle cx="-16" cy="0" r="7.5" fill="#C43D4B" class="pero-prop-pulse"/><rect class="pero-eq-1" x="2" y="-7" width="5" height="14" rx="2.5" fill="#172334"/><rect class="pero-eq-2" x="10" y="-9" width="5" height="18" rx="2.5" fill="#172334"/><rect class="pero-eq-3" x="18" y="-6" width="5" height="12" rx="2.5" fill="#172334"/><rect class="pero-eq-4" x="26" y="-8" width="5" height="16" rx="2.5" fill="#172334"/></g></g>',
      'pause-bars': '<g transform="translate(422, 118)"><g class="pero-prop-anim"><circle class="pero-prop-ring" cx="0" cy="0" r="28" fill="none" stroke="#69BCFC" stroke-width="2.5" opacity="0.45"/><circle cx="0" cy="0" r="24" fill="#EAF3FF" stroke="#247BFA" stroke-width="3.5"/><rect class="pero-pause-bar-l" x="-9" y="-10" width="6.5" height="20" rx="3" fill="#247BFA"/><rect class="pero-pause-bar-r" x="2.5" y="-10" width="6.5" height="20" rx="3" fill="#247BFA"/></g></g>',
      'camera-flash': '<g transform="translate(394, 240)"><g class="pero-cam-frame" stroke="#69BCFC" stroke-width="3" fill="none" stroke-linecap="round"><path d="M -41 -22 L -41 -33 L -30 -33 M 30 -33 L 41 -33 L 41 -22"/><path d="M -41 22 L -41 33 L -30 33 M 30 33 L 41 33 L 41 22"/></g><rect x="-26" y="-20" width="52" height="40" rx="10" fill="#202E54" stroke="#08102D" stroke-width="4"/><rect x="-11" y="-27" width="22" height="9" rx="4" fill="#69BCFC" stroke="#08102D" stroke-width="3.5"/><circle cx="0" cy="0" r="12" fill="#FCFCFB" stroke="#08102D" stroke-width="3.5"/><circle class="pero-cam-iris" cx="0" cy="0" r="6.5" fill="#247BFA"/><circle class="pero-cam-flare" cx="32" cy="-26" r="11" fill="none" stroke="#FDB936" stroke-width="2.5" opacity="0"/><path class="pero-prop-flash" d="M 32 -42 L 36 -30 L 48 -26 L 36 -22 L 32 -10 L 28 -22 L 16 -26 L 28 -30 Z" fill="#FDB936"/></g>',
      'scan-frame': '<g transform="translate(76, 188)"><g class="pero-scan-brackets" stroke="#69BCFC" stroke-width="3" fill="none" stroke-linecap="round"><path d="M -36 -28 L -36 -40 L -24 -40 M 24 -40 L 36 -40 L 36 -28"/><path d="M -36 28 L -36 40 L -24 40 M 24 40 L 36 40 L 36 28"/></g><rect x="-28" y="-34" width="56" height="68" rx="10" fill="#F7F9FC" stroke="#247BFA" stroke-width="3.5"/><line class="pero-ocr-line-1" x1="-16" y1="-16" x2="16" y2="-16" stroke="#68778B" stroke-width="4" stroke-linecap="round"/><line class="pero-ocr-line-2" x1="-16" y1="-2" x2="12" y2="-2" stroke="#68778B" stroke-width="4" stroke-linecap="round"/><line class="pero-ocr-line-3" x1="-16" y1="12" x2="18" y2="12" stroke="#68778B" stroke-width="4" stroke-linecap="round"/><line class="pero-scan-bar" x1="-22" y1="0" x2="22" y2="0" stroke="#247BFA" stroke-width="4.5" stroke-linecap="round"/></g>',
      'thinking-dots': '<g><circle class="pero-cloud-1" cx="394" cy="146" r="5" fill="#EAF3FF" stroke="#247BFA" stroke-width="2.5"/><circle class="pero-cloud-2" cx="406" cy="132" r="7" fill="#EAF3FF" stroke="#247BFA" stroke-width="2.5"/><g transform="translate(426, 106)"><rect x="-38" y="-19" width="76" height="38" rx="19" fill="#EAF3FF" stroke="#247BFA" stroke-width="3"/><circle class="pero-dot-1" cx="-16" cy="0" r="5.5" fill="#247BFA"/><circle class="pero-dot-2" cx="0" cy="0" r="5.5" fill="#247BFA"/><circle class="pero-dot-3" cx="16" cy="0" r="5.5" fill="#247BFA"/></g><circle class="pero-spark-ring" cx="452" cy="74" r="12" fill="none" stroke="#69BCFC" stroke-width="2.5" opacity="0"/><path class="pero-spark-1" d="M 452 64 L 455 71 L 462 74 L 455 77 L 452 84 L 449 77 L 442 74 L 449 71 Z" fill="#247BFA"/></g>',
      'doc-draft': '<g transform="translate(442, 326)"><g class="pero-prop-anim"><rect x="-32" y="-42" width="64" height="84" rx="10" fill="#FFFFFF" stroke="#172334" stroke-width="4"/><rect x="-20" y="-26" width="40" height="8" rx="4" fill="#247BFA"/><rect x="-20" y="-10" width="40" height="6" rx="3" fill="#CBD5E1"/><rect x="-20" y="2" width="30" height="6" rx="3" fill="#CBD5E1"/><rect x="-20" y="14" width="36" height="6" rx="3" fill="#CBD5E1"/><path class="pero-ink-stroke" d="M -20 26 L 14 26" fill="none" stroke="#247BFA" stroke-width="5" stroke-linecap="round"/><path class="pero-ink-stroke-2" d="M -20 34 L 6 34" fill="none" stroke="#69BCFC" stroke-width="4" stroke-linecap="round"/><circle class="pero-ink-nib" cx="-16" cy="26" r="3" fill="#FDA326"/></g></g>',
      'annotation-callout': '<g transform="translate(432, 232)"><g class="pero-prop-anim"><circle class="pero-prop-ring" cx="-2" cy="24" r="9" fill="#247BFA" opacity="0.35"/><path d="M -32 48 C -20 42, -10 34, -4 26" fill="none" stroke="#247BFA" stroke-width="4.5" stroke-linecap="round"/><polygon points="-11,26 -1,22 -3,33" fill="#247BFA"/><rect x="-36" y="-26" width="72" height="50" rx="10" fill="#EAF3FF" stroke="#247BFA" stroke-width="4"/><g class="pero-callout-plus"><circle cx="-18" cy="-8" r="9.5" fill="#247BFA"/><path d="M -21 -8 L -15 -8 M -18 -12 L -18 -4" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/></g><line x1="-2" y1="-8" x2="24" y2="-8" stroke="#172334" stroke-width="4" stroke-linecap="round"/><line x1="-22" y1="9" x2="22" y2="9" stroke="#68778B" stroke-width="4" stroke-linecap="round"/></g></g>',
      'review-amber': '<g transform="translate(424, 118)"><circle class="pero-prop-ring" cx="0" cy="4" r="24" fill="none" stroke="#F59E0B" stroke-width="3" opacity="0.55"/><circle class="pero-prop-ring-2" cx="0" cy="4" r="24" fill="none" stroke="#F59E0B" stroke-width="2.5" opacity="0"/><g class="pero-prop-anim"><path d="M 0 -24 L 24 20 L -24 20 Z" fill="#FEF3C7" stroke="#B7791F" stroke-width="4.5" stroke-linejoin="round"/><line x1="0" y1="-8" x2="0" y2="4" stroke="#B7791F" stroke-width="4.5" stroke-linecap="round"/><circle cx="0" cy="12" r="2.8" fill="#B7791F"/></g></g>',
      'verified-check': '<g><circle class="pero-prop-ring" cx="424" cy="120" r="26" fill="none" stroke="#16865B" stroke-width="3" opacity="0"/><g transform="translate(424, 120)"><g class="pero-prop-anim"><circle cx="0" cy="0" r="24" fill="#16865B" stroke="#08102D" stroke-width="4"/><path d="M -10 1 L -3 8 L 11 -7" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></g><path class="pero-spark-1" d="M 88 134 L 91 141 L 98 144 L 91 147 L 88 154 L 85 147 L 78 144 L 85 141 Z" fill="#16865B"/><circle class="pero-spark-2" cx="448" cy="184" r="5" fill="#69BCFC"/><path class="pero-spark-3" d="M 388 83 L 390.5 89 L 396.5 91.5 L 390.5 94 L 388 100 L 385.5 94 L 379.5 91.5 L 385.5 89 Z" fill="#16865B"/></g>',
      'export-pdf': '<g transform="translate(428, 168)"><g class="pero-export-ticks" stroke="#69BCFC" stroke-width="3.5" stroke-linecap="round"><line x1="-10" y1="38" x2="-10" y2="48"/><line x1="0" y1="42" x2="0" y2="54"/><line x1="10" y1="40" x2="10" y2="50"/></g><g class="pero-prop-anim"><rect x="-24" y="-30" width="48" height="60" rx="8" fill="#FFFFFF" stroke="#08102D" stroke-width="4"/><path d="M 0 12 L 0 -12 M -9 -3 L 0 -13 L 9 -3" fill="none" stroke="#247BFA" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="-14" y="16" width="28" height="5" rx="2.5" fill="#69BCFC"/></g></g>',
      'ai-orbit': '<g><g class="pero-orbit-inner" opacity="0.65"><circle cx="256" cy="256" r="178" fill="none" stroke="#69BCFC" stroke-width="2.5" stroke-dasharray="6 18"/></g><g class="pero-orbit-spin" opacity="0.9"><circle cx="256" cy="256" r="212" fill="none" stroke="#DCE8FA" stroke-width="4" stroke-dasharray="10 14"/><g class="pero-sat-1"><circle cx="256" cy="44" r="13" fill="#247BFA" opacity="0.22"/><circle cx="256" cy="44" r="8" fill="#247BFA"/></g><circle class="pero-sat-2" cx="440" cy="362" r="7.5" fill="#69BCFC"/><circle class="pero-sat-3" cx="72" cy="362" r="7.5" fill="#16865B"/></g></g>',
      'shield': `<g transform="translate(96, 326)"><g class="pero-prop-anim"><path class="pero-shield-ring" d="M 0 -46 L 39 -30 L 39 10 C 39 35, 17 50, 0 56 C -17 50, -39 35, -39 10 L -39 -30 Z" fill="none" stroke="#69BCFC" stroke-width="2.5" opacity="0"/><path d="M 0 -40 L 34 -26 L 34 8 C 34 30, 14 44, 0 50 C -14 44, -34 30, -34 8 L -34 -26 Z" fill="#EAF3FF" stroke="#247BFA" stroke-width="4.5" stroke-linejoin="round"/><g clip-path="url(#${pfx}-shield-clip)"><rect class="pero-shield-sweep" x="-10" y="-45" width="18" height="100" fill="#FFFFFF" opacity="0.6" transform="rotate(24 0 0)"/></g><path class="pero-shield-check" d="M -11 4 L -2 13 L 14 -5" fill="none" stroke="#16865B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></g>`,
      'motion-lines': '<g class="pero-prop-anim"><line class="pero-line-1" x1="62" y1="418" x2="100" y2="418" stroke="#69BCFC" stroke-width="5.5" stroke-linecap="round"/><line class="pero-line-2" x1="50" y1="435" x2="92" y2="435" stroke="#247BFA" stroke-width="5.5" stroke-linecap="round"/></g>',
      'confetti': '<g><circle class="pero-conf-1" cx="92" cy="144" r="6.5" fill="#247BFA"/><rect class="pero-conf-2" x="412" y="128" width="13" height="13" rx="3" fill="#FDA326" transform="rotate(20 418 134)"/><path class="pero-conf-3" d="M 104 188 L 109 198 L 119 203 L 109 208 L 104 218 L 99 208 L 89 203 L 99 198 Z" fill="#16865B"/><circle class="pero-conf-4" cx="406" cy="196" r="5.5" fill="#69BCFC"/></g>',
      'zzz': '<g fill="#247BFA" font-family="system-ui, -apple-system, sans-serif" font-weight="800"><text x="382" y="164" font-size="22" class="pero-zzz-1">z</text><text x="404" y="138" font-size="28" class="pero-zzz-2">z</text><text x="426" y="108" font-size="34" class="pero-zzz-3">Z</text></g>',
      'error-spark': '<g transform="translate(424, 118)"><circle class="pero-prop-ring" cx="0" cy="0" r="22" fill="none" stroke="#C43D4B" stroke-width="3.5" opacity="0.6"/><circle class="pero-prop-ring-2" cx="0" cy="0" r="22" fill="none" stroke="#C43D4B" stroke-width="2.5" opacity="0"/><g class="pero-prop-anim"><circle cx="0" cy="0" r="22" fill="#FEE2E2" stroke="#C43D4B" stroke-width="4"/><line x1="0" y1="-10" x2="0" y2="3" stroke="#C43D4B" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="11" r="3" fill="#C43D4B"/></g></g>',
    };
    return map[prop] || '';
  }

  function buildFlipperLeftSvg(pose, prefix) {
    const [sleeve, cuff, paw] = FLIPPER_LEFT_PATHS[pose] || FLIPPER_LEFT_PATHS.rest;
    let extra = '';
    if (pose === 'hold-magnifier') {
      extra = `<g transform="translate(120, 244) rotate(-28)"><line x1="0" y1="22" x2="0" y2="38" stroke="#1B2338" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="-2" r="24" fill="#EAF3FF" fill-opacity="0.78" stroke="#1B2338" stroke-width="6.5"/><g clip-path="url(#${prefix}-mag-clip)"><rect class="pero-lens-sweep-anim" x="-8" y="-32" width="16" height="64" fill="#FFFFFF" opacity="0.55" transform="rotate(24 0 0)"/></g><path d="M -11 -13 C -5 -18, 4 -18, 10 -14" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/><circle class="pero-mag-clue-1" cx="-24" cy="-18" r="3" fill="#247BFA" opacity="0"/><circle class="pero-mag-clue-2" cx="22" cy="16" r="2.8" fill="#69BCFC" opacity="0"/></g>`;
    }
    const thumbLine = pose === 'thumbs-up' ? '<path d="M 163 292 C 165 286, 170 286, 172 292" fill="none" stroke="#455B8F" stroke-width="2.5" stroke-linecap="round"/>' : '';
    const orb = pose === 'hold-orb-left' ? '<circle cx="122" cy="240" r="9" fill="#247BFA" opacity="0.9"/><circle cx="122" cy="240" r="15" fill="#69BCFC" opacity="0.28"/>' : '';
    return `<path d="${sleeve}" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/><path d="${cuff}" fill="#FCFCFB" stroke="#08102D" stroke-width="5" stroke-linejoin="round"/>${extra}<path d="${paw}" fill="url(#${prefix}-navy)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>${thumbLine}${orb}`;
  }

  function buildFlipperRightSvg(pose, prefix) {
    const [sleeve, cuff, paw] = FLIPPER_RIGHT_PATHS[pose] || FLIPPER_RIGHT_PATHS.rest;
    const stylus = pose === 'write-out'
      ? '<g transform="translate(402, 356) rotate(-32)"><rect x="-4" y="-26" width="8" height="34" rx="3" fill="#247BFA" stroke="#08102D" stroke-width="3"/><polygon points="-4,8 4,8 0,17" fill="#FDA326" stroke="#08102D" stroke-width="2.5" stroke-linejoin="round"/></g>'
      : '';
    const orb = pose === 'hold-orb-right'
      ? '<circle cx="390" cy="240" r="9" fill="#247BFA" opacity="0.9"/><circle cx="390" cy="240" r="15" fill="#69BCFC" opacity="0.28"/>'
      : '';
    return `<path d="${sleeve}" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/><path d="${cuff}" fill="#FCFCFB" stroke="#08102D" stroke-width="5" stroke-linejoin="round"/>${stylus}<path d="${paw}" fill="url(#${prefix}-navy)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>${orb}`;
  }

  global.PeroRigParts = {
    FLIPPER_LEFT_KEYS: Object.keys(FLIPPER_LEFT_PATHS),
    FLIPPER_RIGHT_KEYS: Object.keys(FLIPPER_RIGHT_PATHS),
    EYE_LEFT_KEYS: ['open', 'focused', 'look-up', 'calm', 'happy', 'closed', 'wide'],
    EYE_RIGHT_KEYS: ['wink', 'open', 'focused', 'squint', 'curious', 'calm', 'happy', 'closed', 'wide'],
    BROW_KEYS: ['neutral', 'happy', 'focused', 'curious', 'startled', 'sleepy'],
    BEAK_KEYS: ['smile', 'open-smile', 'o-mouth', 'neutral'],
    PROP_KEYS: ['none', 'sparkle-wave', 'hero-glint', 'rec-badge', 'pause-bars', 'camera-flash', 'scan-frame', 'thinking-dots', 'doc-draft', 'annotation-callout', 'review-amber', 'verified-check', 'export-pdf', 'ai-orbit', 'shield', 'motion-lines', 'confetti', 'zzz', 'error-spark'],
    eyeLeftSvg,
    eyeRightSvg,
    browSvg,
    beakSvg,
    propSvg,
    buildFlipperLeftSvg,
    buildFlipperRightSvg,
  };
})(window);
