/**
 * Multi-format browser exporter for Pero Animate Studio:
 *   - Animated .gif (GIF89a)
 *   - Animated Vector .svg
 *   - Rive-Importable Lottie v5 .json
 *   - PNG Sprite Sheet
 *   - WebM Video
 *   - .pero.json Project & React/CSS App Code
 */
(function (global) {
  'use strict';

  function buildColorVarString(capScheme, jacketScheme) {
    return [
      `--pero-cap-highlight:${capScheme.highlight}`,
      `--pero-cap-light:${capScheme.light}`,
      `--pero-cap-main:${capScheme.main}`,
      `--pero-cap-shade:${capScheme.shade}`,
      `--pero-cap-seam:${capScheme.seam}`,
      `--pero-cap-button:${capScheme.accent}`,
      `--pero-jacket-highlight:${jacketScheme.highlight}`,
      `--pero-jacket-light:${jacketScheme.light}`,
      `--pero-jacket-main:${jacketScheme.main}`,
      `--pero-jacket-shade:${jacketScheme.shade}`,
      `--pero-jacket-accent:${jacketScheme.accent}`,
    ].join(';');
  }

  function svgToImage(svgMarkup) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = (err) => { URL.revokeObjectURL(url); reject(err); };
      img.src = url;
    });
  }

  async function renderFramesToCanvas(project, opts, capScheme, jacketScheme) {
    const size = opts.size || 512;
    const fps = opts.fps || 20;
    const bg = opts.background || 'transparent';
    const totalFrames = Math.max(8, Math.round((project.durationMs / 1000) * fps));
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const inlineColorStyle = buildColorVarString(capScheme, jacketScheme);

    const frames = [];
    for (let i = 0; i < totalFrames; i++) {
      const tNorm = totalFrames === 1 ? 0 : i / totalFrames;
      const pose = global.PeroRigEngine.interpolatePose(project.keyframes, tNorm);
      const markup = global.PeroRigEngine.renderRigSvg(pose, {
        prefix: `exp-${i}`,
        inlineColorStyle,
      });
      const img = await svgToImage(markup);
      ctx.clearRect(0, 0, size, size);
      if (bg !== 'transparent') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.drawImage(img, 0, 0, size, size);
      frames.push(ctx.getImageData(0, 0, size, size).data);
    }
    return { frames, size, fps, totalFrames, canvas };
  }

  async function exportGif(project, opts, capScheme, jacketScheme) {
    const { frames, size, fps } = await renderFramesToCanvas(project, opts, capScheme, jacketScheme);
    const delayCs = Math.max(2, Math.round(100 / fps));
    return global.PeroGifEncoder.encodeGif(frames, size, size, delayCs);
  }

  async function exportSpriteSheet(project, opts, capScheme, jacketScheme) {
    const size = opts.size || 256;
    const fps = opts.fps || 12;
    const { frames, totalFrames } = await renderFramesToCanvas(project, { ...opts, size, fps }, capScheme, jacketScheme);
    const sheet = document.createElement('canvas');
    sheet.width = size * totalFrames;
    sheet.height = size;
    const ctx = sheet.getContext('2d');
    frames.forEach((data, idx) => {
      const imgData = new ImageData(new Uint8ClampedArray(data), size, size);
      ctx.putImageData(imgData, idx * size, 0);
    });
    return new Promise((resolve) => sheet.toBlob((blob) => resolve(blob), 'image/png'));
  }

  async function exportWebm(project, opts, capScheme, jacketScheme) {
    if (typeof MediaRecorder === 'undefined') throw new Error('MediaRecorder not supported in this browser.');
    const size = opts.size || 512;
    const fps = opts.fps || 24;
    const { frames } = await renderFramesToCanvas(project, { ...opts, size, fps, background: opts.background === 'transparent' ? '#FFFFFF' : opts.background }, capScheme, jacketScheme);
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(fps);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime });
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const done = new Promise((resolve) => { rec.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' })); });
    rec.start();
    const stepMs = 1000 / fps;
    for (let i = 0; i < frames.length; i++) {
      ctx.putImageData(new ImageData(new Uint8ClampedArray(frames[i]), size, size), 0, 0);
      await new Promise((r) => setTimeout(r, stepMs));
    }
    rec.stop();
    return done;
  }

  function exportAnimatedSvg(project, capScheme, jacketScheme) {
    const E = global.PeroRigEngine;
    const P = global.PeroRigParts;
    const durS = (project.durationMs / 1000).toFixed(2);
    const samples = 21; // every 5%
    const kfs = { shadow: [], shadowL: [], shadowR: [], root: [], head: [], cap: [], armL: [], armR: [], lan: [], tail: [], fL: [], fR: [], face: [], prop: [] };

    for (let i = 0; i < samples; i++) {
      const pct = Math.round((i / (samples - 1)) * 100);
      const pose = E.interpolatePose(project.keyframes, i / (samples - 1));
      const sh = E.computeFootingShadow(pose);
      const sy = pose.root.squashY, sx = 1 / Math.sqrt(sy);
      kfs.shadow.push(`${pct}% { transform: translate(${sh.tx.toFixed(2)}px, 0px) scale(${sh.scaleX.toFixed(3)}, ${sh.scaleY.toFixed(3)}); opacity: ${sh.opacity.toFixed(3)}; }`);
      kfs.shadowL.push(`${pct}% { transform: translate(${sh.footL.tx.toFixed(2)}px, 0px) scale(${sh.footL.scaleX.toFixed(3)}, ${sh.footL.scaleY.toFixed(3)}); opacity: ${sh.footL.opacity.toFixed(3)}; }`);
      kfs.shadowR.push(`${pct}% { transform: translate(${sh.footR.tx.toFixed(2)}px, 0px) scale(${sh.footR.scaleX.toFixed(3)}, ${sh.footR.scaleY.toFixed(3)}); opacity: ${sh.footR.opacity.toFixed(3)}; }`);
      kfs.root.push(`${pct}% { transform: translate(${pose.root.tx.toFixed(2)}px, ${pose.root.ty.toFixed(2)}px) rotate(${pose.root.rot.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)}); }`);
      kfs.head.push(`${pct}% { transform: translate(${pose.head.tx.toFixed(2)}px, ${pose.head.ty.toFixed(2)}px) rotate(${pose.head.rot.toFixed(2)}deg) scale(${pose.head.scale.toFixed(3)}); }`);
      kfs.cap.push(`${pct}% { transform: translate(${pose.cap.tx.toFixed(2)}px, ${pose.cap.ty.toFixed(2)}px) rotate(${pose.cap.rot.toFixed(2)}deg) scale(${pose.cap.scale.toFixed(3)}); }`);
      kfs.armL.push(`${pct}% { transform: translate(${pose.flipperLeft.tx.toFixed(2)}px, ${pose.flipperLeft.ty.toFixed(2)}px) rotate(${pose.flipperLeft.rot.toFixed(2)}deg) scale(${pose.flipperLeft.scale.toFixed(3)}); }`);
      kfs.armR.push(`${pct}% { transform: translate(${pose.flipperRight.tx.toFixed(2)}px, ${pose.flipperRight.ty.toFixed(2)}px) rotate(${pose.flipperRight.rot.toFixed(2)}deg) scale(${pose.flipperRight.scale.toFixed(3)}); }`);
      kfs.lan.push(`${pct}% { transform: translate(${pose.lanyard.tx.toFixed(2)}px, ${pose.lanyard.ty.toFixed(2)}px) rotate(${pose.lanyard.rot.toFixed(2)}deg) scale(${pose.lanyard.scale.toFixed(3)}); }`);
      kfs.tail.push(`${pct}% { transform: translate(${pose.tail.tx.toFixed(2)}px, ${pose.tail.ty.toFixed(2)}px) rotate(${pose.tail.rot.toFixed(2)}deg) scale(${pose.tail.scale.toFixed(3)}); }`);
      kfs.fL.push(`${pct}% { transform: translate(${pose.footLeft.tx.toFixed(2)}px, ${pose.footLeft.ty.toFixed(2)}px) rotate(${pose.footLeft.rot.toFixed(2)}deg) scale(${pose.footLeft.scale.toFixed(3)}); }`);
      kfs.fR.push(`${pct}% { transform: translate(${pose.footRight.tx.toFixed(2)}px, ${pose.footRight.ty.toFixed(2)}px) rotate(${pose.footRight.rot.toFixed(2)}deg) scale(${pose.footRight.scale.toFixed(3)}); }`);
      kfs.face.push(`${pct}% { transform: translate(${pose.face.tx.toFixed(2)}px, ${pose.face.ty.toFixed(2)}px); }`);
      kfs.prop.push(`${pct}% { transform: translate(${pose.propTransform.tx.toFixed(2)}px, ${pose.propTransform.ty.toFixed(2)}px) rotate(${pose.propTransform.rot.toFixed(2)}deg) scale(${pose.propTransform.scale.toFixed(3)}); }`);
    }

    const basePose = E.interpolatePose(project.keyframes, 0);
    const colorCss = buildColorVarString(capScheme, jacketScheme);
    const rArm = `<g class="c-arm-r" style="transform-origin:348px 328px">${P.buildFlipperRightSvg(basePose.flipperRight.pose, 'pero-exp')}</g>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="${project.name}" style="${colorCss}">
  <defs>
    <linearGradient id="pero-exp-cap" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" style="stop-color:var(--pero-cap-light)"/><stop offset="60%" style="stop-color:var(--pero-cap-main)"/><stop offset="100%" style="stop-color:var(--pero-cap-shade)"/></linearGradient>
    <linearGradient id="pero-exp-jacket" x1="0.15" y1="0.05" x2="0.85" y2="0.95"><stop offset="0%" style="stop-color:var(--pero-jacket-light)"/><stop offset="55%" style="stop-color:var(--pero-jacket-main)"/><stop offset="100%" style="stop-color:var(--pero-jacket-shade)"/></linearGradient>
    <linearGradient id="pero-exp-navy" x1="0.2" y1="0.1" x2="0.8" y2="0.9"><stop offset="0%" stop-color="#273763"/><stop offset="65%" stop-color="#202E54"/><stop offset="100%" stop-color="#162343"/></linearGradient>
    <linearGradient id="pero-exp-orange" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="#FDB936"/><stop offset="60%" stop-color="#FDA326"/><stop offset="100%" stop-color="#F68218"/></linearGradient>
    <linearGradient id="pero-exp-lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.34"/><stop offset="100%" stop-color="#69BCFC" stop-opacity="0.12"/></linearGradient>
    <clipPath id="pero-exp-mag-clip"><circle cx="0" cy="-2" r="21"/></clipPath>
    <clipPath id="pero-exp-shield-clip"><path d="M 0 -40 L 34 -26 L 34 8 C 34 30, 14 44, 0 50 C -14 44, -34 30, -34 8 L -34 -26 Z"/></clipPath>
  </defs>
  <style>
    .c-sh { animation: c-sh ${durS}s linear infinite; transform-origin: 256px 484px; }
    .c-sh-l { animation: c-sh-l ${durS}s linear infinite; transform-origin: 194px 479px; }
    .c-sh-r { animation: c-sh-r ${durS}s linear infinite; transform-origin: 324px 479px; }
    .c-root { animation: c-root ${durS}s linear infinite; transform-origin: 256px 464px; }
    .c-head { animation: c-head ${durS}s linear infinite; transform-origin: 256px 292px; }
    .c-cap { animation: c-cap ${durS}s linear infinite; transform-origin: 256px 120px; }
    .c-arm-l { animation: c-arm-l ${durS}s linear infinite; transform-origin: 162px 328px; }
    .c-arm-r { animation: c-arm-r ${durS}s linear infinite; transform-origin: 348px 328px; }
    .c-lan { animation: c-lan ${durS}s linear infinite; transform-origin: 256px 322px; }
    .c-tail { animation: c-tail ${durS}s linear infinite; transform-origin: 156px 412px; }
    .c-f-l { animation: c-f-l ${durS}s linear infinite; transform-origin: 194px 464px; }
    .c-f-r { animation: c-f-r ${durS}s linear infinite; transform-origin: 324px 464px; }
    .c-face { animation: c-face ${durS}s linear infinite; }
    .c-prop { animation: c-prop ${durS}s linear infinite; transform-origin: 410px 210px; }
    @keyframes c-sh { ${kfs.shadow.join(' ')} }
    @keyframes c-sh-l { ${kfs.shadowL.join(' ')} }
    @keyframes c-sh-r { ${kfs.shadowR.join(' ')} }
    @keyframes c-root { ${kfs.root.join(' ')} }
    @keyframes c-head { ${kfs.head.join(' ')} }
    @keyframes c-cap { ${kfs.cap.join(' ')} }
    @keyframes c-arm-l { ${kfs.armL.join(' ')} }
    @keyframes c-arm-r { ${kfs.armR.join(' ')} }
    @keyframes c-lan { ${kfs.lan.join(' ')} }
    @keyframes c-tail { ${kfs.tail.join(' ')} }
    @keyframes c-f-l { ${kfs.fL.join(' ')} }
    @keyframes c-f-r { ${kfs.fR.join(' ')} }
    @keyframes c-face { ${kfs.face.join(' ')} }
    @keyframes c-prop { ${kfs.prop.join(' ')} }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; } }
  </style>
  <ellipse class="c-sh" cx="256" cy="484" rx="112" ry="10.5" fill="#08102D" opacity="0.12"/>
  <ellipse class="c-sh-l" cx="194" cy="479" rx="40" ry="6.5" fill="#08102D" opacity="0.16"/>
  <ellipse class="c-sh-r" cx="324" cy="479" rx="40" ry="6.5" fill="#08102D" opacity="0.16"/>
  <g class="c-root">
    <g class="c-tail"><path d="M 156 392 C 134 395, 118 390, 113 384 C 110 402, 124 426, 158 430 Z" fill="#202E54" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/></g>
    <g class="c-f-l"><g transform="translate(194,464) rotate(-4)"><path d="M -44 4 C -46 -12, -22 -20, 6 -18 C 30 -16, 44 -4, 42 8 C 40 18, 14 20, -10 19 C -32 18, -43 13, -44 4 Z" fill="url(#pero-exp-orange)" stroke="#5A2404" stroke-width="5" stroke-linejoin="round"/></g></g>
    <g class="c-f-r"><g transform="translate(324,464) rotate(5)"><path d="M -42 8 C -44 -4, -30 -16, -6 -18 C 22 -20, 46 -12, 44 4 C 43 13, 32 18, 10 19 C -14 20, -40 18, -42 8 Z" fill="url(#pero-exp-orange)" stroke="#5A2404" stroke-width="5" stroke-linejoin="round"/></g></g>
    <path d="M 150 388 C 146 436, 184 462, 256 462 C 328 462, 366 436, 362 388 Z" fill="url(#pero-exp-navy)" stroke="#08102D" stroke-width="6" stroke-linejoin="round"/>
    <path d="M 188 412 C 194 446, 224 457, 256 457 C 288 457, 318 446, 324 412 Z" fill="#FCFCFB" stroke="#08102D" stroke-width="4" stroke-linejoin="round"/>
    ${!basePose.flipperRight.front ? rArm : ''}
    <path d="M 164 316 C 148 340, 146 382, 152 406 C 176 416, 224 418, 254 416 L 254 320 Z" fill="url(#pero-exp-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M 348 316 C 364 342, 366 382, 358 406 C 332 416, 286 418, 260 416 L 260 320 Z" fill="url(#pero-exp-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M 253 330 L 263 330 L 263 416 C 259 417, 256 417, 253 416 Z" style="fill:var(--pero-jacket-accent)" stroke="#08102D" stroke-width="3.5"/>
    <path d="M 294 346 L 340 346 L 340 384 C 340 392, 333 397, 324 397 L 310 397 C 301 397, 294 392, 294 384 Z" style="fill:var(--pero-jacket-accent)" stroke="#162E66" stroke-width="4"/>
    <path d="M 294 346 L 340 346 L 340 358 L 294 358 Z" fill="#FCFCFB" stroke="#162E66" stroke-width="4"/>
    <g class="c-lan"><path d="M 192 315 L 256 334 L 320 315" fill="none" stroke="#1E2C52" stroke-width="9" stroke-linecap="round"/><rect x="250" y="325" width="12" height="17" rx="3.5" fill="#DCE4F0" stroke="#08102D" stroke-width="3.5"/><rect x="234" y="341" width="44" height="48" rx="8" fill="#202E54" stroke="#08102D" stroke-width="4"/><rect x="239" y="346" width="34" height="38" rx="4.5" fill="#FCFCFB"/><g transform="translate(256, 363) rotate(-10)"><path d="M -7 -7 C -1 -11, 8 -8, 9 -1 C 10 6, 4 10, -3 8 C -9 6, -11 -1, -7 -7 Z" fill="none" stroke="#399EF9" stroke-width="4.4"/><line x1="5" y1="12" x2="12" y2="9" stroke="#399EF9" stroke-width="3.8" stroke-linecap="round"/></g></g>
    <path d="M 158 302 C 142 308, 138 324, 152 332 C 176 340, 212 338, 240 328 L 236 308 C 204 316, 174 308, 158 302 Z" fill="url(#pero-exp-jacket)" stroke="#08102D" stroke-width="5.5"/>
    <path d="M 352 302 C 368 308, 372 324, 356 334 C 332 342, 296 340, 272 328 L 276 308 C 308 316, 336 308, 352 302 Z" fill="url(#pero-exp-jacket)" stroke="#08102D" stroke-width="5.5"/>
    <g class="c-head">
      <path d="M 134 218 C 128 158, 174 114, 258 114 C 344 114, 388 158, 382 222 C 378 280, 336 318, 258 318 C 180 318, 138 278, 134 218 Z" fill="url(#pero-exp-navy)" stroke="#08102D" stroke-width="6.5"/>
      <path d="M 164 218 C 162 178, 188 154, 218 156 C 238 157, 252 172, 260 184 C 268 172, 286 154, 314 154 C 348 154, 370 182, 368 220 C 366 270, 326 308, 260 308 C 194 308, 166 270, 164 218 Z" fill="#FCFCFB" stroke="#08102D" stroke-width="3"/>
      <circle cx="209" cy="210" r="39" fill="#FCFCFB"/>
      <ellipse cx="186" cy="266" rx="15" ry="8" fill="#FDC6BC" opacity="0.88" transform="rotate(-6 186 266)"/>
      <ellipse cx="336" cy="262" rx="15.5" ry="8" fill="#FDC6BC" opacity="0.88" transform="rotate(6 336 262)"/>
      <g class="c-face">
        ${P.browSvg(basePose.face.brow)}
        ${P.eyeLeftSvg(basePose.face.leftEye, basePose.face.gazeX, basePose.face.gazeY)}
        ${P.eyeRightSvg(basePose.face.rightEye, basePose.face.gazeX, basePose.face.gazeY, basePose.face.blink)}
        ${P.beakSvg(basePose.face.beak, 'pero-exp-orange', basePose.face.beakScaleY)}
        <circle cx="209" cy="210" r="43" fill="none" stroke="#1B2338" stroke-width="8.5"/><circle cx="164" cy="202" r="6" fill="#DCE4F0" stroke="#08102D" stroke-width="3"/>
      </g>
      <g class="c-cap">
        <ellipse cx="236" cy="40" rx="16" ry="7.5" style="fill:var(--pero-cap-button)" stroke="#08102D" stroke-width="5"/>
        <path d="M 140 166 C 134 100, 178 44, 240 42 C 296 40, 344 74, 354 128 C 288 118, 206 130, 140 166 Z" fill="url(#pero-exp-cap)" stroke="#08102D" stroke-width="6"/>
        <g transform="translate(246, 84) rotate(-14)"><path d="M -11 -11 C -2 -17, 12 -13, 14 -2 C 16 9, 7 15, -3 13 C -13 11, -17 0, -11 -11 Z" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/><line x1="8" y1="21" x2="21" y2="16" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/></g>
        <path d="M 140 166 C 202 126, 302 102, 362 124 C 378 130, 385 138, 380 144 C 344 124, 256 126, 186 158 C 166 167, 150 172, 140 166 Z" style="fill:var(--pero-cap-main)" stroke="#08102D" stroke-width="5.5"/>
      </g>
    </g>
    ${basePose.flipperRight.front ? rArm : ''}
    <g class="c-arm-l">${P.buildFlipperLeftSvg(basePose.flipperLeft.pose, 'pero-exp')}</g>
    <g class="c-prop">${P.propSvg(basePose.prop, 'pero-exp')}</g>
  </g>
</svg>`;
  }

  function hexToLottieRgb(hex) {
    const c = hex.replace('#', '');
    const n = parseInt(c, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
  }

  /**
   * Standard Lottie v5.7.4 JSON exporter with parented bone hierarchy and keyframed transforms.
   * Imports cleanly into Rive Editor (to compile .riv) or Lottie players.
   */
  function exportLottieJson(project, capScheme, jacketScheme) {
    const fr = 30;
    const op = Math.max(15, Math.round((project.durationMs / 1000) * fr));
    const sorted = [...project.keyframes].sort((a, b) => a.t - b.t);
    const toKf = (fn) => sorted.map((k, idx) => ({ t: Math.round(k.t * op), s: fn(k.pose), ...(idx < sorted.length - 1 ? { i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } } : {}) }));

    const makeRectShape = (nm, w, h, r, color) => ({
      ty: 'gr',
      nm,
      it: [
        { ty: 'rc', d: 1, s: { a: 0, k: [w, h] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: r }, nm: 'Rect' },
        { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 100 }, nm: 'Fill' },
        { ty: 'st', c: { a: 0, k: hexToLottieRgb('#08102D') }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, nm: 'Stroke' },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    });

    const E = global.PeroRigEngine;
    const layers = [
      {
        ddd: 0, ind: 1, ty: 4, nm: 'pero_cap', parent: 2, sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [256, 120, 0] },
          p: { a: 1, k: toKf((p) => [256 + (p.cap.tx || 0), 120 + (p.cap.ty || 0), 0]) },
          r: { a: 1, k: toKf((p) => [p.cap.rot || 0]) },
          s: { a: 1, k: toKf((p) => [(p.cap.scale ?? 1) * 100, (p.cap.scale ?? 1) * 100, 100]) },
          o: { a: 0, k: 100 },
        },
        shapes: [makeRectShape('CapDome', 200, 105, 52, hexToLottieRgb(capScheme.main))],
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: 'pero_head', parent: 3, sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [256, 292, 0] },
          p: { a: 1, k: toKf((p) => [256 + (p.head.tx || 0), 292 + (p.head.ty || 0), 0]) },
          r: { a: 1, k: toKf((p) => [p.head.rot || 0]) },
          s: { a: 1, k: toKf((p) => [(p.head.scale ?? 1) * 100, (p.head.scale ?? 1) * 100, 100]) },
          o: { a: 0, k: 100 },
        },
        shapes: [makeRectShape('Head', 240, 198, 96, hexToLottieRgb('#202E54'))],
      },
      {
        ddd: 0, ind: 3, ty: 4, nm: 'pero_root_torso', sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [256, 464, 0] },
          p: { a: 1, k: toKf((p) => [256 + p.root.tx, 464 + p.root.ty, 0]) },
          r: { a: 1, k: toKf((p) => [p.root.rot]) },
          s: { a: 1, k: toKf((p) => [100 / Math.sqrt(p.root.squashY), 100 * p.root.squashY, 100]) },
          o: { a: 0, k: 100 },
        },
        shapes: [makeRectShape('Jacket', 208, 104, 24, hexToLottieRgb(jacketScheme.main))],
      },
      {
        ddd: 0, ind: 4, ty: 4, nm: 'pero_flipper_left', parent: 3, sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [162, 328, 0] },
          p: { a: 1, k: toKf((p) => [162 + (p.flipperLeft.tx || 0), 328 + (p.flipperLeft.ty || 0), 0]) },
          r: { a: 1, k: toKf((p) => [p.flipperLeft.rot]) },
          s: { a: 1, k: toKf((p) => [p.flipperLeft.scale * 100, p.flipperLeft.scale * 100, 100]) },
          o: { a: 0, k: 100 },
        },
        shapes: [makeRectShape('FlipperL', 42, 76, 18, hexToLottieRgb(jacketScheme.main))],
      },
      {
        ddd: 0, ind: 5, ty: 4, nm: 'pero_flipper_right', parent: 3, sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [348, 328, 0] },
          p: { a: 1, k: toKf((p) => [348 + (p.flipperRight.tx || 0), 328 + (p.flipperRight.ty || 0), 0]) },
          r: { a: 1, k: toKf((p) => [p.flipperRight.rot]) },
          s: { a: 1, k: toKf((p) => [p.flipperRight.scale * 100, p.flipperRight.scale * 100, 100]) },
          o: { a: 0, k: 100 },
        },
        shapes: [makeRectShape('FlipperR', 42, 76, 18, hexToLottieRgb(jacketScheme.main))],
      },
      {
        ddd: 0, ind: 6, ty: 4, nm: 'pero_ground_shadow', sr: 1, ip: 0, op, st: 0,
        ks: {
          a: { a: 0, k: [256, 482, 0] },
          p: { a: 1, k: toKf((p) => [256 + E.computeFootingShadow(p).tx, 482, 0]) },
          r: { a: 0, k: [0] },
          s: { a: 1, k: toKf((p) => [E.computeFootingShadow(p).scaleX * 100, E.computeFootingShadow(p).scaleY * 100, 100]) },
          o: { a: 1, k: toKf((p) => [E.computeFootingShadow(p).opacity * 100]) },
        },
        shapes: [{ ty: 'gr', nm: 'Shadow', it: [{ ty: 'el', s: { a: 0, k: [224, 22] }, p: { a: 0, k: [0, 0] } }, { ty: 'fl', c: { a: 0, k: [0.03, 0.06, 0.18, 1] }, o: { a: 0, k: 100 } }, { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }],
      },
    ];

    return JSON.stringify({
      v: '5.7.4',
      fr,
      ip: 0,
      op,
      w: 512,
      h: 512,
      nm: project.name,
      ddd: 0,
      assets: [],
      layers,
    }, null, 2);
  }

  function generateOperoAppCode(project) {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom-motion';
    return `// Drop-in OPERO custom motion preset for <PeroMascot />\n<PeroMascot\n  motion="idle-breathe"\n  capColor="${project.capColor}"\n  jacketColor="${project.jacketColor}"\n  size={140}\n/>\n// Project ID: ${slug} (${project.durationMs}ms, ${project.keyframes.length} keyframes)`;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  global.PeroExporters = {
    buildColorVarString,
    exportGif,
    exportSpriteSheet,
    exportWebm,
    exportAnimatedSvg,
    exportLottieJson,
    generateOperoAppCode,
    downloadBlob,
  };
})(window);
