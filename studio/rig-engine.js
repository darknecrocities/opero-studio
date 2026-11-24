/**
 * Constrained 4-DOF Hierarchical Bone Rig (tx, ty, rot, scale),
 * Easing Curves, Footing Shadow Solver, Auto Follow-Through Physics,
 * Safe Joint Envelope Gizmos, and SVG Rig Renderer.
 */
(function (global) {
  'use strict';

  const BONE_META = {
    root:         { label: 'Body',   pivot: [256, 464], tx: [-38, 38], ty: [-24, 22], rot: [-16, 16], squashY: [0.85, 1.12] },
    head:         { label: 'Head',   pivot: [256, 292], tx: [-12, 12], ty: [-10, 12], rot: [-22, 22], scale: [0.94, 1.07] },
    cap:          { label: 'Cap',    pivot: [256, 120], tx: [-9, 9],   ty: [-12, 7],  rot: [-22, 22], scale: [0.94, 1.07] },
    flipperLeft:  { label: 'L Arm',  pivot: [162, 328], tx: [-10, 10], ty: [-12, 10], rot: [-52, 52], scale: [0.88, 1.12] },
    flipperRight: { label: 'R Arm',  pivot: [348, 328], tx: [-10, 10], ty: [-12, 10], rot: [-52, 52], scale: [0.88, 1.12] },
    lanyard:      { label: 'Badge',  pivot: [256, 322], tx: [-8, 8],   ty: [-6, 8],   rot: [-25, 25], scale: [0.90, 1.12] },
    tail:         { label: 'Tail',   pivot: [156, 412], tx: [-6, 6],   ty: [-6, 6],   rot: [-28, 28], scale: [0.88, 1.14] },
    footLeft:     { label: 'L Foot', pivot: [194, 460], tx: [-16, 16], ty: [-28, 10], rot: [-28, 28], scale: [0.92, 1.08] },
    footRight:    { label: 'R Foot', pivot: [324, 460], tx: [-16, 16], ty: [-28, 10], rot: [-28, 28], scale: [0.92, 1.08] },
    face:         { label: 'Face',   pivot: [262, 232], tx: [-8, 8],   ty: [-7, 7] },
    prop:         { label: 'Prop',   pivot: [410, 210], tx: [-28, 28], ty: [-28, 28], rot: [-25, 25], scale: [0.75, 1.25] },
  };

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function createDefaultPose() {
    return {
      root: { tx: 0, ty: 0, rot: 0, squashY: 1 },
      head: { tx: 0, ty: 0, rot: 0, scale: 1 },
      cap: { tx: 0, ty: 0, rot: 0, scale: 1 },
      flipperLeft: { pose: 'rest', tx: 0, ty: 0, rot: 0, scale: 1 },
      flipperRight: { pose: 'rest', tx: 0, ty: 0, rot: 0, scale: 1, front: false },
      lanyard: { tx: 0, ty: 0, rot: 0, scale: 1 },
      tail: { tx: 0, ty: 0, rot: 0, scale: 1 },
      footLeft: { tx: 0, ty: 0, rot: 0, scale: 1 },
      footRight: { tx: 0, ty: 0, rot: 0, scale: 1 },
      face: { tx: 0, ty: 0, leftEye: 'open', rightEye: 'open', brow: 'neutral', gazeX: 0, gazeY: 0, blink: false, beak: 'smile', beakScaleY: 1, monocleGleam: 0.78 },
      prop: 'none',
      propTransform: { tx: 0, ty: 0, rot: 0, scale: 1 },
    };
  }

  function clonePose(p) { return JSON.parse(JSON.stringify(p)); }

  function normalizePose(raw) {
    const def = createDefaultPose();
    const p = raw || {};
    return {
      root: { ...def.root, ...(p.root || {}) },
      head: { ...def.head, ...(p.head || {}) },
      cap: { ...def.cap, ...(p.cap || {}) },
      flipperLeft: { ...def.flipperLeft, ...(p.flipperLeft || {}) },
      flipperRight: { ...def.flipperRight, ...(p.flipperRight || {}) },
      lanyard: { ...def.lanyard, ...(p.lanyard || {}) },
      tail: { ...def.tail, ...(p.tail || {}) },
      footLeft: { ...def.footLeft, ...(p.footLeft || {}) },
      footRight: { ...def.footRight, ...(p.footRight || {}) },
      face: { ...def.face, ...(p.face || {}) },
      prop: p.prop || 'none',
      propTransform: { ...def.propTransform, ...(p.propTransform || {}) },
    };
  }

  function clampPose(pose) {
    const out = normalizePose(clonePose(pose));
    out.root.tx = clamp(out.root.tx, BONE_META.root.tx[0], BONE_META.root.tx[1]);
    out.root.ty = clamp(out.root.ty, BONE_META.root.ty[0], BONE_META.root.ty[1]);
    out.root.rot = clamp(out.root.rot, BONE_META.root.rot[0], BONE_META.root.rot[1]);
    out.root.squashY = clamp(out.root.squashY, BONE_META.root.squashY[0], BONE_META.root.squashY[1]);

    ['head', 'cap', 'flipperLeft', 'flipperRight', 'lanyard', 'tail', 'footLeft', 'footRight'].forEach((b) => {
      const m = BONE_META[b];
      if (m.tx) out[b].tx = clamp(out[b].tx, m.tx[0], m.tx[1]);
      if (m.ty) out[b].ty = clamp(out[b].ty, m.ty[0], m.ty[1]);
      if (m.rot) out[b].rot = clamp(out[b].rot, m.rot[0], m.rot[1]);
      if (m.scale) out[b].scale = clamp(out[b].scale, m.scale[0], m.scale[1]);
    });

    out.face.tx = clamp(out.face.tx, BONE_META.face.tx[0], BONE_META.face.tx[1]);
    out.face.ty = clamp(out.face.ty, BONE_META.face.ty[0], BONE_META.face.ty[1]);
    out.face.gazeX = clamp(out.face.gazeX, -5, 5);
    out.face.gazeY = clamp(out.face.gazeY, -4, 4);
    out.face.beakScaleY = clamp(out.face.beakScaleY, 0.82, 1.28);
    out.face.monocleGleam = clamp(out.face.monocleGleam, 0, 1);

    out.propTransform.tx = clamp(out.propTransform.tx, BONE_META.prop.tx[0], BONE_META.prop.tx[1]);
    out.propTransform.ty = clamp(out.propTransform.ty, BONE_META.prop.ty[0], BONE_META.prop.ty[1]);
    out.propTransform.rot = clamp(out.propTransform.rot, BONE_META.prop.rot[0], BONE_META.prop.rot[1]);
    out.propTransform.scale = clamp(out.propTransform.scale, BONE_META.prop.scale[0], BONE_META.prop.scale[1]);
    return out;
  }

  function applyEasing(u, mode) {
    if (mode === 'step') return u < 1 ? 0 : 1;
    if (mode === 'linear') return u;
    if (mode === 'cubic') return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    if (mode === 'back') {
      const c1 = 1.70158, c3 = c1 + 1;
      return u < 0.5
        ? (Math.pow(2 * u, 2) * ((c3 * 1.5 + 1) * 2 * u - c3 * 1.5)) / 2
        : (Math.pow(2 * u - 2, 2) * ((c3 * 1.5 + 1) * (u * 2 - 2) + c3 * 1.5) + 2) / 2;
    }
    if (mode === 'spring') {
      if (u === 0 || u === 1) return u;
      return 1 - Math.pow(2, -7 * u) * Math.cos(u * Math.PI * 2.5);
    }
    return -(Math.cos(Math.PI * u) - 1) / 2;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpBone(a, b, u, extra) {
    return {
      ...extra,
      tx: lerp(a.tx || 0, b.tx || 0, u),
      ty: lerp(a.ty || 0, b.ty || 0, u),
      rot: lerp(a.rot || 0, b.rot || 0, u),
      scale: lerp(a.scale ?? 1, b.scale ?? 1, u),
    };
  }

  function interpolatePose(keyframes, tNorm) {
    if (!keyframes || keyframes.length === 0) return createDefaultPose();
    const sorted = [...keyframes].sort((a, b) => a.t - b.t);
    if (tNorm <= sorted[0].t) return clampPose(sorted[0].pose);
    if (tNorm >= sorted[sorted.length - 1].t) return clampPose(sorted[sorted.length - 1].pose);

    let k0 = sorted[0], k1 = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (tNorm >= sorted[i].t && tNorm <= sorted[i + 1].t) { k0 = sorted[i]; k1 = sorted[i + 1]; break; }
    }
    const u = applyEasing((tNorm - k0.t) / Math.max(0.0001, k1.t - k0.t), k0.easing || 'easeInOut');
    const a = normalizePose(k0.pose), b = normalizePose(k1.pose);
    const discrete = u < 0.5 ? a : b;

    return clampPose({
      root: { tx: lerp(a.root.tx, b.root.tx, u), ty: lerp(a.root.ty, b.root.ty, u), rot: lerp(a.root.rot, b.root.rot, u), squashY: lerp(a.root.squashY, b.root.squashY, u) },
      head: lerpBone(a.head, b.head, u),
      cap: lerpBone(a.cap, b.cap, u),
      flipperLeft: lerpBone(a.flipperLeft, b.flipperLeft, u, { pose: discrete.flipperLeft.pose }),
      flipperRight: lerpBone(a.flipperRight, b.flipperRight, u, { pose: discrete.flipperRight.pose, front: discrete.flipperRight.front }),
      lanyard: lerpBone(a.lanyard, b.lanyard, u),
      tail: lerpBone(a.tail, b.tail, u),
      footLeft: lerpBone(a.footLeft, b.footLeft, u),
      footRight: lerpBone(a.footRight, b.footRight, u),
      face: {
        tx: lerp(a.face.tx, b.face.tx, u),
        ty: lerp(a.face.ty, b.face.ty, u),
        leftEye: discrete.face.leftEye,
        rightEye: discrete.face.rightEye,
        brow: discrete.face.brow || 'neutral',
        gazeX: lerp(a.face.gazeX, b.face.gazeX, u),
        gazeY: lerp(a.face.gazeY, b.face.gazeY, u),
        blink: discrete.face.blink,
        beak: discrete.face.beak,
        beakScaleY: lerp(a.face.beakScaleY, b.face.beakScaleY, u),
        monocleGleam: lerp(a.face.monocleGleam, b.face.monocleGleam, u),
      },
      prop: discrete.prop,
      propTransform: lerpBone(a.propTransform, b.propTransform, u),
    });
  }

  function computeFootingShadow(pose) {
    const p = normalizePose(pose);
    const footMidX = (p.footLeft.tx + p.footRight.tx) * 0.5;
    const avgFootLift = Math.max(0, -(p.footLeft.ty + p.footRight.ty) * 0.5);
    const h = Math.max(-12, -p.root.ty + avgFootLift * 0.35);
    const liftL = Math.max(-6, -(p.root.ty + p.footLeft.ty) - Math.max(0, -p.footLeft.rot) * 0.15);
    const liftR = Math.max(-6, -(p.root.ty + p.footRight.ty) - Math.max(0, -p.footRight.rot) * 0.15);
    return {
      tx: p.root.tx + footMidX * 0.45,
      scaleX: clamp(1 - h * 0.011 + (1 - p.root.squashY) * 0.65, 0.54, 1.2),
      scaleY: clamp(1 - h * 0.008, 0.7, 1.12),
      opacity: clamp(0.12 - h * 0.0022 + (1 - p.root.squashY) * 0.15, 0.04, 0.18),
      footL: {
        tx: p.root.tx + p.footLeft.tx,
        scaleX: clamp(1 - liftL * 0.016 + (1 - p.root.squashY) * 0.4, 0.34, 1.18),
        scaleY: clamp(1 - liftL * 0.012, 0.42, 1.1),
        opacity: clamp(0.16 - liftL * 0.0038, 0.025, 0.22),
      },
      footR: {
        tx: p.root.tx + p.footRight.tx,
        scaleX: clamp(1 - liftR * 0.016 + (1 - p.root.squashY) * 0.4, 0.34, 1.18),
        scaleY: clamp(1 - liftR * 0.012, 0.42, 1.1),
        opacity: clamp(0.16 - liftR * 0.0038, 0.025, 0.22),
      },
    };
  }

  function applyAutoFollowThrough(keyframes) {
    const out = keyframes.map((k) => ({ ...k, pose: normalizePose(clonePose(k.pose)) }));
    for (let i = 0; i < out.length; i++) {
      const prev = out[(i - 1 + out.length) % out.length].pose;
      const cur = out[i].pose;
      const velY = cur.root.ty - prev.root.ty;
      const velRot = cur.root.rot - prev.root.rot;
      cur.head.rot = clamp(cur.head.rot - velRot * 0.45, -22, 22);
      cur.cap.ty = clamp(velY * 0.28, -12, 7);
      cur.cap.rot = clamp(cur.head.rot * 0.55 - velRot * 0.35, -22, 22);
      cur.lanyard.rot = clamp(-cur.root.rot * 0.9 - velRot * 0.6, -25, 25);
      cur.tail.rot = clamp(-cur.root.rot * 1.1 + velY * 0.3, -28, 28);
    }
    return out;
  }

  function renderGizmoOverlay(pose, selectedBone) {
    const dots = Object.keys(BONE_META).map((k) => {
      const [bx, by] = BONE_META[k].pivot;
      const off = k === 'prop' ? pose.propTransform : pose[k];
      const cx = bx + (pose.root.tx || 0) + (off && off.tx ? off.tx : 0);
      const cy = by + (pose.root.ty || 0) + (off && off.ty ? off.ty : 0);
      const isSel = k === selectedBone;
      return isSel
        ? ''
        : `<circle data-bone="${k}" class="gizmo-hit" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="#FFFFFF" fill-opacity="0.85" stroke="#69BCFC" stroke-width="2"/>`;
    }).join('');

    const m = BONE_META[selectedBone];
    if (!m) return `<g class="gizmo-ring">${dots}</g>`;
    const off = selectedBone === 'prop' ? pose.propTransform : pose[selectedBone];
    const baseCx = m.pivot[0] + (selectedBone === 'root' ? 0 : pose.root.tx);
    const baseCy = m.pivot[1] + (selectedBone === 'root' ? 0 : pose.root.ty);
    const curX = baseCx + (off && off.tx ? off.tx : 0);
    const curY = baseCy + (off && off.ty ? off.ty : 0);

    let envBox = '';
    if (m.tx && m.ty) {
      const x = baseCx + m.tx[0];
      const y = baseCy + m.ty[0];
      const w = m.tx[1] - m.tx[0];
      const h = m.ty[1] - m.ty[0];
      envBox = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="4" fill="rgba(105,188,252,0.12)" stroke="#69BCFC" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    }

    return `<g class="gizmo-ring">${dots}${envBox}<circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="14" fill="rgba(15,23,42,0.06)" stroke="#0F172A" stroke-width="2" stroke-dasharray="4 3"/><line x1="${(curX - 7).toFixed(1)}" y1="${curY.toFixed(1)}" x2="${(curX + 7).toFixed(1)}" y2="${curY.toFixed(1)}" stroke="#0F172A" stroke-width="1.8"/><line x1="${curX.toFixed(1)}" y1="${(curY - 7).toFixed(1)}" x2="${curX.toFixed(1)}" y2="${(curY + 7).toFixed(1)}" stroke="#0F172A" stroke-width="1.8"/><circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="3.5" fill="#0F172A"/></g>`;
  }

  function buildBodyMarkup(rawPose, prefix, interactive, selectedBone) {
    const pose = normalizePose(rawPose);
    const P = global.PeroRigParts;
    const sy = pose.root.squashY;
    const sx = 1 / Math.sqrt(sy);
    const rootT = `translate(${pose.root.tx.toFixed(2)}, ${pose.root.ty.toFixed(2)}) translate(256, 464) rotate(${pose.root.rot.toFixed(2)}) scale(${sx.toFixed(3)}, ${sy.toFixed(3)}) translate(-256, -464)`;
    const headT = `translate(${pose.head.tx.toFixed(2)}, ${pose.head.ty.toFixed(2)}) translate(256, 292) rotate(${pose.head.rot.toFixed(2)}) scale(${pose.head.scale.toFixed(3)}) translate(-256, -292)`;
    const capT = `translate(${pose.cap.tx.toFixed(2)}, ${pose.cap.ty.toFixed(2)}) translate(256, 120) rotate(${pose.cap.rot.toFixed(2)}) scale(${pose.cap.scale.toFixed(3)}) translate(-256, -120)`;
    const armLT = `translate(${(162 + pose.flipperLeft.tx).toFixed(2)}, ${(328 + pose.flipperLeft.ty).toFixed(2)}) rotate(${pose.flipperLeft.rot.toFixed(2)}) scale(${pose.flipperLeft.scale.toFixed(3)}) translate(-162, -328)`;
    const armRT = `translate(${(348 + pose.flipperRight.tx).toFixed(2)}, ${(328 + pose.flipperRight.ty).toFixed(2)}) rotate(${pose.flipperRight.rot.toFixed(2)}) scale(${pose.flipperRight.scale.toFixed(3)}) translate(-348, -328)`;
    const lanT = `translate(${(256 + pose.lanyard.tx).toFixed(2)}, ${(322 + pose.lanyard.ty).toFixed(2)}) rotate(${pose.lanyard.rot.toFixed(2)}) scale(${pose.lanyard.scale.toFixed(3)}) translate(-256, -322)`;
    const tailT = `translate(${(156 + pose.tail.tx).toFixed(2)}, ${(412 + pose.tail.ty).toFixed(2)}) rotate(${pose.tail.rot.toFixed(2)}) scale(${pose.tail.scale.toFixed(3)}) translate(-156, -412)`;
    const fLT = `translate(${(194 + pose.footLeft.tx).toFixed(2)}, ${(464 + pose.footLeft.ty).toFixed(2)}) rotate(${(-4 + pose.footLeft.rot).toFixed(2)}) scale(${pose.footLeft.scale.toFixed(3)})`;
    const fRT = `translate(${(324 + pose.footRight.tx).toFixed(2)}, ${(464 + pose.footRight.ty).toFixed(2)}) rotate(${(5 + pose.footRight.rot).toFixed(2)}) scale(${pose.footRight.scale.toFixed(3)})`;
    const faceT = `translate(${pose.face.tx.toFixed(2)}, ${pose.face.ty.toFixed(2)})`;
    const propT = `translate(${(410 + pose.propTransform.tx).toFixed(2)}, ${(210 + pose.propTransform.ty).toFixed(2)}) rotate(${pose.propTransform.rot.toFixed(2)}) scale(${pose.propTransform.scale.toFixed(3)}) translate(-410, -210)`;
    const collarLRot = clamp(-pose.root.ty * 0.25 + pose.flipperLeft.rot * 0.14 + (1 - pose.root.squashY) * 28, -7, 7);
    const collarRRot = clamp(pose.root.ty * 0.25 + pose.flipperRight.rot * 0.14 - (1 - pose.root.squashY) * 28, -7, 7);
    const sweepX = ((pose.face.monocleGleam - 0.5) * 140).toFixed(1);
    const hit = (bone) => (interactive ? `data-bone="${bone}" class="gizmo-hit"` : '');

    const rArm = `<g ${hit('flipperRight')} transform="${armRT}">${P.buildFlipperRightSvg(pose.flipperRight.pose, prefix)}</g>`;
    const propMarkup = pose.prop && pose.prop !== 'none'
      ? `<g ${hit('prop')} transform="${propT}">${P.propSvg(pose.prop, prefix)}</g>`
      : '';

    return `
      ${pose.prop === 'ai-orbit' ? propMarkup : ''}
      <g transform="${rootT}">
        <g ${hit('tail')} transform="${tailT}">
          <path d="M 156 392 C 134 395, 118 390, 113 384 C 110 402, 124 426, 158 430 Z" fill="#202E54" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
          <path d="M 118 396 C 124 412, 136 422, 155 426" fill="none" stroke="#141E3B" stroke-width="3.5" stroke-linecap="round"/>
        </g>
        <g ${hit('footLeft')} transform="${fLT}">
          <path d="M -44 4 C -46 -12, -22 -20, 6 -18 C 30 -16, 44 -4, 42 8 C 40 18, 14 20, -10 19 C -32 18, -43 13, -44 4 Z" fill="url(#${prefix}-orange)" stroke="#5A2404" stroke-width="5" stroke-linejoin="round"/>
          <ellipse cx="-10" cy="-7" rx="14" ry="4.5" fill="#FFE082" opacity="0.65" transform="rotate(-6 -10 -7)"/>
        </g>
        <g ${hit('footRight')} transform="${fRT}">
          <path d="M -42 8 C -44 -4, -30 -16, -6 -18 C 22 -20, 46 -12, 44 4 C 43 13, 32 18, 10 19 C -14 20, -40 18, -42 8 Z" fill="url(#${prefix}-orange)" stroke="#5A2404" stroke-width="5" stroke-linejoin="round"/>
          <ellipse cx="10" cy="-7" rx="14" ry="4.5" fill="#FFE082" opacity="0.65" transform="rotate(6 10 -7)"/>
        </g>
        <g ${hit('root')}>
          <path d="M 150 388 C 146 436, 184 462, 256 462 C 328 462, 366 436, 362 388 Z" fill="url(#${prefix}-navy)" stroke="#08102D" stroke-width="6" stroke-linejoin="round"/>
          <path d="M 188 412 C 194 446, 224 457, 256 457 C 288 457, 318 446, 324 412 Z" fill="#FCFCFB" stroke="#08102D" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 192 434 C 212 450, 300 450, 320 434 C 310 448, 284 455, 256 455 C 228 455, 202 448, 192 434 Z" fill="#DFE4F3"/>
        </g>
        ${!pose.flipperRight.front ? rArm : ''}
        <g ${hit('root')}>
          <path d="M 164 316 C 148 340, 146 382, 152 406 C 176 416, 224 418, 254 416 L 254 320 Z" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
          <path d="M 348 316 C 364 342, 366 382, 358 406 C 332 416, 286 418, 260 416 L 260 320 Z" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
          <path d="M 253 330 L 263 330 L 263 416 C 259 417, 256 417, 253 416 Z" style="fill:var(--pero-jacket-accent,#2D8FED)" stroke="#08102D" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M 294 346 L 340 346 L 340 384 C 340 392, 333 397, 324 397 L 310 397 C 301 397, 294 392, 294 384 Z" style="fill:var(--pero-jacket-accent,#2D8FED)" stroke="#162E66" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 294 346 L 340 346 L 340 358 L 294 358 Z" fill="#FCFCFB" stroke="#162E66" stroke-width="4" stroke-linejoin="round"/>
          <g ${hit('lanyard')} transform="${lanT}">
            <path d="M 192 315 L 256 334 L 320 315" fill="none" stroke="#1E2C52" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="250" y="325" width="12" height="17" rx="3.5" fill="#DCE4F0" stroke="#08102D" stroke-width="3.5"/>
            <rect x="234" y="341" width="44" height="48" rx="8" fill="#202E54" stroke="#08102D" stroke-width="4"/>
            <rect x="239" y="346" width="34" height="38" rx="4.5" fill="#FCFCFB"/>
            <g transform="translate(256, 363) rotate(-10)"><path d="M -7 -7 C -1 -11, 8 -8, 9 -1 C 10 6, 4 10, -3 8 C -9 6, -11 -1, -7 -7 Z" fill="none" stroke="#399EF9" stroke-width="4.4" stroke-linecap="round"/><line x1="5" y1="12" x2="12" y2="9" stroke="#399EF9" stroke-width="3.8" stroke-linecap="round"/></g>
          </g>
          <g transform="rotate(${collarLRot.toFixed(2)} 216 324)"><path d="M 158 302 C 142 308, 138 324, 152 332 C 176 340, 212 338, 240 328 L 236 308 C 204 316, 174 308, 158 302 Z" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/></g>
          <g transform="rotate(${collarRRot.toFixed(2)} 296 324)"><path d="M 352 302 C 368 308, 372 324, 356 334 C 332 342, 296 340, 272 328 L 276 308 C 308 316, 336 308, 352 302 Z" fill="url(#${prefix}-jacket)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/></g>
        </g>
        <g ${hit('head')} transform="${headT}">
          <path d="M 134 218 C 128 158, 174 114, 258 114 C 344 114, 388 158, 382 222 C 378 280, 336 318, 258 318 C 180 318, 138 278, 134 218 Z" fill="url(#${prefix}-navy)" stroke="#08102D" stroke-width="6.5" stroke-linejoin="round"/>
          <path d="M 164 218 C 162 178, 188 154, 218 156 C 238 157, 252 172, 260 184 C 268 172, 286 154, 314 154 C 348 154, 370 182, 368 220 C 366 270, 326 308, 260 308 C 194 308, 166 270, 164 218 Z" fill="#FCFCFB" stroke="#08102D" stroke-width="3" stroke-linejoin="round"/>
          <g ${hit('face')} transform="${faceT}">
            <circle cx="209" cy="210" r="39" fill="#FCFCFB"/>
            <ellipse cx="186" cy="266" rx="15" ry="8" fill="#FDC6BC" opacity="0.88" transform="rotate(-6 186 266)"/>
            <ellipse cx="336" cy="262" rx="15.5" ry="8" fill="#FDC6BC" opacity="0.88" transform="rotate(6 336 262)"/>
            ${P.browSvg(pose.face.brow)}${P.eyeLeftSvg(pose.face.leftEye, pose.face.gazeX, pose.face.gazeY)}${P.eyeRightSvg(pose.face.rightEye, pose.face.gazeX, pose.face.gazeY, pose.face.blink)}
            ${P.beakSvg(pose.face.beak, `${prefix}-orange`, pose.face.beakScaleY)}
            <g transform="rotate(${clamp(-pose.head.rot * 0.45, -7, 7).toFixed(2)} 164 202)"><path d="M 164 202 C 146 210, 136 232, 134 256" fill="none" stroke="#151E35" stroke-width="3.6" stroke-linecap="round"/></g>
            <circle cx="209" cy="210" r="42" fill="url(#${prefix}-lens)"/>
            <g clip-path="url(#${prefix}-lens-clip)"><rect x="${(196 + parseFloat(sweepX)).toFixed(1)}" y="162" width="24" height="96" fill="#FFFFFF" opacity="0.34" transform="rotate(24 209 210)"/></g>
            <path d="M 184 185 C 194 176, 210 174, 222 178" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="${pose.face.monocleGleam.toFixed(2)}"/>
            <circle cx="209" cy="210" r="43" fill="none" stroke="#1B2338" stroke-width="8.5"/><circle cx="209" cy="210" r="46.5" fill="none" stroke="#08102D" stroke-width="2"/><circle cx="209" cy="210" r="39.5" fill="none" stroke="#8592B0" stroke-width="2"/>
            <circle cx="164" cy="202" r="6" fill="#DCE4F0" stroke="#08102D" stroke-width="3"/>
          </g>
          <g ${hit('cap')} transform="${capT}">
            <g transform="translate(0, ${clamp(pose.cap.ty * 0.35, -2.5, 2.5).toFixed(2)})"><ellipse cx="236" cy="40" rx="16" ry="7.5" style="fill:var(--pero-cap-button,#2D8FED)" stroke="#08102D" stroke-width="5"/></g>
            <path d="M 140 166 C 134 100, 178 44, 240 42 C 296 40, 344 74, 354 128 C 288 118, 206 130, 140 166 Z" fill="url(#${prefix}-cap)" stroke="#08102D" stroke-width="6" stroke-linejoin="round"/>
            <path d="M 238 43 C 204 68, 186 108, 184 146" fill="none" style="stroke:var(--pero-cap-seam,#2971C1)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
            <path d="M 244 43 C 286 60, 314 88, 326 124" fill="none" style="stroke:var(--pero-cap-seam,#2971C1)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
            <g transform="translate(246, 84) rotate(-14)"><path d="M -11 -11 C -2 -17, 12 -13, 14 -2 C 16 9, 7 15, -3 13 C -13 11, -17 0, -11 -11 Z" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/><line x1="8" y1="21" x2="21" y2="16" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/></g>
            <path d="M 192 146 C 254 114, 346 112, 382 142 C 378 152, 366 154, 348 148 C 304 134, 246 136, 192 146 Z" fill="#1E356B" stroke="#08102D" stroke-width="5" stroke-linejoin="round"/>
            <path d="M 140 166 C 202 126, 302 102, 362 124 C 378 130, 385 138, 380 144 C 344 124, 256 126, 186 158 C 166 167, 150 172, 140 166 Z" style="fill:var(--pero-cap-main,#69BCFC)" stroke="#08102D" stroke-width="5.5" stroke-linejoin="round"/>
          </g>
        </g>
        ${pose.flipperRight.front ? rArm : ''}
        <g ${hit('flipperLeft')} transform="${armLT}">${P.buildFlipperLeftSvg(pose.flipperLeft.pose, prefix)}</g>
        ${pose.prop !== 'ai-orbit' ? propMarkup : ''}
      </g>
      ${interactive && selectedBone ? renderGizmoOverlay(pose, selectedBone) : ''}
    `;
  }

  function renderRigSvg(pose, opts) {
    const o = opts || {};
    const prefix = o.prefix || 'studio-pero';
    const sh = computeFootingShadow(pose);
    const shT = `translate(${sh.tx.toFixed(2)}, 0) translate(256, 484) scale(${sh.scaleX.toFixed(3)}, ${sh.scaleY.toFixed(3)}) translate(-256, -484)`;
    const flT = `translate(${sh.footL.tx.toFixed(2)}, 0) translate(194, 479) scale(${sh.footL.scaleX.toFixed(3)}, ${sh.footL.scaleY.toFixed(3)}) translate(-194, -479)`;
    const frT = `translate(${sh.footR.tx.toFixed(2)}, 0) translate(324, 479) scale(${sh.footR.scaleX.toFixed(3)}, ${sh.footR.scaleY.toFixed(3)}) translate(-324, -479)`;
    const onionPrev = o.onionPrev ? `<g opacity="0.20" style="filter:hue-rotate(-25deg)">${buildBodyMarkup(o.onionPrev, prefix, false, null)}</g>` : '';
    const onionNext = o.onionNext ? `<g opacity="0.16" style="filter:hue-rotate(30deg)">${buildBodyMarkup(o.onionNext, prefix, false, null)}</g>` : '';
    const inlineCss = o.inlineColorStyle || '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" ${inlineCss ? `style="${inlineCss}"` : ''}>
      <defs>
        <linearGradient id="${prefix}-cap" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" style="stop-color:var(--pero-cap-light,#7BCEFF)"/><stop offset="60%" style="stop-color:var(--pero-cap-main,#69BCFC)"/><stop offset="100%" style="stop-color:var(--pero-cap-shade,#4FA9F8)"/></linearGradient>
        <linearGradient id="${prefix}-jacket" x1="0.15" y1="0.05" x2="0.85" y2="0.95"><stop offset="0%" style="stop-color:var(--pero-jacket-light,#76C7FC)"/><stop offset="55%" style="stop-color:var(--pero-jacket-main,#69BCFC)"/><stop offset="100%" style="stop-color:var(--pero-jacket-shade,#52AEFA)"/></linearGradient>
        <linearGradient id="${prefix}-navy" x1="0.2" y1="0.1" x2="0.8" y2="0.9"><stop offset="0%" stop-color="#273763"/><stop offset="65%" stop-color="#202E54"/><stop offset="100%" stop-color="#162343"/></linearGradient>
        <linearGradient id="${prefix}-orange" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="#FDB936"/><stop offset="60%" stop-color="#FDA326"/><stop offset="100%" stop-color="#F68218"/></linearGradient>
        <linearGradient id="${prefix}-lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.34"/><stop offset="100%" stop-color="#69BCFC" stop-opacity="0.12"/></linearGradient>
        <clipPath id="${prefix}-lens-clip"><circle cx="209" cy="210" r="39.5"/></clipPath>
        <clipPath id="${prefix}-mag-clip"><circle cx="0" cy="-2" r="21"/></clipPath>
        <clipPath id="${prefix}-shield-clip"><path d="M 0 -40 L 34 -26 L 34 8 C 34 30, 14 44, 0 50 C -14 44, -34 30, -34 8 L -34 -26 Z"/></clipPath>
      </defs>
      <g transform="${shT}">
        <ellipse cx="256" cy="485" rx="130" ry="13.5" fill="#08102D" opacity="${(sh.opacity * 0.5).toFixed(3)}"/>
        <ellipse cx="256" cy="484" rx="112" ry="10.5" fill="#08102D" opacity="${sh.opacity.toFixed(3)}"/>
      </g>
      <g transform="${flT}"><ellipse cx="194" cy="479" rx="40" ry="6.5" fill="#08102D" opacity="${sh.footL.opacity.toFixed(3)}"/></g>
      <g transform="${frT}"><ellipse cx="324" cy="479" rx="40" ry="6.5" fill="#08102D" opacity="${sh.footR.opacity.toFixed(3)}"/></g>
      ${onionPrev}${onionNext}
      ${buildBodyMarkup(pose, prefix, !!o.interactive, o.showGizmos ? o.selectedBone : null)}
    </svg>`;
  }

  global.PeroRigEngine = { BONE_META, clamp, createDefaultPose, clonePose, normalizePose, clampPose, interpolatePose, computeFootingShadow, applyAutoFollowThrough, renderRigSvg };
})(window);
