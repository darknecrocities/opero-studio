/**
 * Expanded 4-DOF Rig Inspector Panel & Harmonic Color Derivation for Pero Animate Studio.
 * Every bone exposes constrained Move X, Move Y, Rotate, and Scale within safe anatomical bounds.
 */
(function (global) {
  'use strict';

  const PRESET_COLORS = [
    ['OPERO Sky', '#69BCFC'], ['Ice Blue', '#93C5FD'], ['Ink Black', '#0F172A'],
    ['Midnight', '#202E54'], ['Emerald', '#16865B'], ['Amber', '#F59E0B'],
    ['Coral', '#EF4444'], ['Slate', '#475569'],
  ];

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function hexToRgb(hex) { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h / 6, s, l];
  }
  function hslToHex(h, s, l) {
    const h2r = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
    let r, g, b;
    if (s === 0) r = g = b = l;
    else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = h2r(p, q, h + 1/3); g = h2r(p, q, h); b = h2r(p, q, h - 1/3); }
    const x = (v) => clamp(Math.round(v * 255), 0, 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${x(r)}${x(g)}${x(b)}`;
  }

  function deriveScheme(hex) {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    return {
      highlight: hslToHex(h, clamp(s * 0.9, 0, 1), clamp(l + 0.17, 0.2, 0.95)),
      light: hslToHex(h, clamp(s * 0.95, 0, 1), clamp(l + 0.08, 0.14, 0.92)),
      main: hex.toUpperCase(),
      shade: hslToHex(h, clamp(s + 0.04, 0, 1), clamp(l - 0.11, 0.08, 0.85)),
      seam: hslToHex(h, clamp(s + 0.06, 0, 1), clamp(l - 0.19, 0.06, 0.78)),
      accent: hslToHex(h, clamp(s + 0.08, 0, 1), clamp(l - 0.17, 0.08, 0.75)),
    };
  }

  function sliderHtml(id, label, min, max, step, val, unit) {
    return `<div class="slider-row"><label for="${id}">${label}</label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}" /><span class="slider-val">${Number(val).toFixed(step < 1 ? 2 : 0)}${unit}</span></div>`;
  }

  function renderBoneInspector(ctx) {
    const { selectedBone, pose: rawPose, commitPoseMutation, pushHistorySnapshot, onResetBone, onResetPose, onCopyPose, onPastePose, hasCopiedPose } = ctx;
    const E = global.PeroRigEngine;
    const P = global.PeroRigParts;
    const m = E.BONE_META;
    const pose = E.normalizePose(rawPose);
    const box = document.getElementById('boneControls');
    const meta = m[selectedBone] || m.head;

    const ico = (n, s) => (global.PeroIcons ? global.PeroIcons.icon(n, { size: s || 15 }) : '');

    let html = `
      <div class="row-wrap" style="justify-content:space-between;margin-bottom:6px;">
        <span class="label-xs">${meta.label} Placement &amp; Joint</span>
        <button id="btnResetBone" type="button" class="btn ghost" style="min-height:26px;padding:0 7px;font-size:11px;">${ico('broom', 15)}<span>Reset ${meta.label}</span></button>
      </div>`;

    if (selectedBone === 'root') {
      html += sliderHtml('sTx', 'Move X', m.root.tx[0], m.root.tx[1], 1, pose.root.tx, 'px')
        + sliderHtml('sTy', 'Move Y', m.root.ty[0], m.root.ty[1], 1, pose.root.ty, 'px')
        + sliderHtml('sRot', 'Lean', m.root.rot[0], m.root.rot[1], 0.5, pose.root.rot, '°')
        + sliderHtml('sRootSq', 'Squash Y', m.root.squashY[0], m.root.squashY[1], 0.01, pose.root.squashY, 'x');
    } else if (selectedBone === 'face') {
      const gxPct = ((pose.face.gazeX + 5) / 10) * 100;
      const gyPct = ((pose.face.gazeY + 4) / 8) * 100;
      html += sliderHtml('sTx', 'Shift X', m.face.tx[0], m.face.tx[1], 0.5, pose.face.tx, 'px')
        + sliderHtml('sTy', 'Shift Y', m.face.ty[0], m.face.ty[1], 0.5, pose.face.ty, 'px')
        + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
            <div><span class="label-xs">Left Eye</span><select id="selEyeL" class="select-sm">${P.EYE_LEFT_KEYS.map((k) => `<option value="${k}" ${k === pose.face.leftEye ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
            <div><span class="label-xs">Right Eye</span><select id="selEyeR" class="select-sm">${P.EYE_RIGHT_KEYS.map((k) => `<option value="${k}" ${k === pose.face.rightEye ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
          </div>
          <div style="margin-top:6px;"><span class="label-xs">Brows</span><select id="selBrow" class="select-sm">${P.BROW_KEYS.map((k) => `<option value="${k}" ${k === (pose.face.brow || 'neutral') ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
          <div style="display:flex;gap:12px;align-items:center;margin-top:8px;">
            <div><span class="label-xs" style="display:block;margin-bottom:4px;">Pupil Gaze</span><div id="gazePad" class="gaze-pad"><div class="gaze-dot" style="left:${gxPct}%;top:${gyPct}%;"></div></div></div>
            <div style="flex:1;">
              <span class="label-xs">Beak</span><select id="selBeak" class="select-sm" style="margin-bottom:6px;">${P.BEAK_KEYS.map((k) => `<option value="${k}" ${k === pose.face.beak ? 'selected' : ''}>${k}</option>`).join('')}</select>
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;"><input id="chkBlink" type="checkbox" ${pose.face.blink ? 'checked' : ''}/> Blink</label>
            </div>
          </div>`
        + sliderHtml('sBeakSc', 'Chirp', 0.82, 1.28, 0.01, pose.face.beakScaleY, 'x')
        + sliderHtml('sGleam', 'Lens Gleam', 0, 1, 0.02, pose.face.monocleGleam, '');
    } else if (selectedBone === 'prop') {
      html += `<label class="label-xs">Active Prop</label><select id="selProp" class="select-sm" style="margin-top:4px;">${P.PROP_KEYS.map((k) => `<option value="${k}" ${k === pose.prop ? 'selected' : ''}>${k}</option>`).join('')}</select>`
        + sliderHtml('sTx', 'Move X', m.prop.tx[0], m.prop.tx[1], 1, pose.propTransform.tx, 'px')
        + sliderHtml('sTy', 'Move Y', m.prop.ty[0], m.prop.ty[1], 1, pose.propTransform.ty, 'px')
        + sliderHtml('sRot', 'Rotate', m.prop.rot[0], m.prop.rot[1], 1, pose.propTransform.rot, '°')
        + sliderHtml('sSc', 'Scale', m.prop.scale[0], m.prop.scale[1], 0.01, pose.propTransform.scale, 'x');
    } else {
      const b = pose[selectedBone];
      if (selectedBone === 'flipperLeft') {
        html += `<label class="label-xs">Hand Pose</label><select id="selArmL" class="select-sm" style="margin-top:4px;">${P.FLIPPER_LEFT_KEYS.map((k) => `<option value="${k}" ${k === b.pose ? 'selected' : ''}>${k}</option>`).join('')}</select>`;
      } else if (selectedBone === 'flipperRight') {
        html += `<label class="label-xs">Hand Pose</label><select id="selArmR" class="select-sm" style="margin-top:4px;">${P.FLIPPER_RIGHT_KEYS.map((k) => `<option value="${k}" ${k === b.pose ? 'selected' : ''}>${k}</option>`).join('')}</select>`
          + `<label style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;"><input id="chkArmRFront" type="checkbox" ${b.front ? 'checked' : ''}/> Render in Front Layer</label>`;
      }
      if (meta.tx) html += sliderHtml('sTx', 'Move X', meta.tx[0], meta.tx[1], 0.5, b.tx, 'px');
      if (meta.ty) html += sliderHtml('sTy', 'Move Y', meta.ty[0], meta.ty[1], 0.5, b.ty, 'px');
      if (meta.rot) html += sliderHtml('sRot', 'Rotate', meta.rot[0], meta.rot[1], 0.5, b.rot, '°');
      if (meta.scale) html += sliderHtml('sSc', 'Scale', meta.scale[0], meta.scale[1], 0.01, b.scale, 'x');
    }

    html += `
      <div class="row-wrap" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);">
        <button id="btnCopyPose" type="button" class="btn" style="min-height:28px;font-size:11px;">${ico('bookmark', 15)}<span>Copy Pose</span></button>
        <button id="btnPastePose" type="button" class="btn" style="min-height:28px;font-size:11px;" ${hasCopiedPose ? '' : 'disabled'}>${ico('pin', 15)}<span>Paste Pose</span></button>
        <button id="btnResetPose" type="button" class="btn ghost" style="min-height:28px;font-size:11px;">${ico('broom', 15)}<span>Reset All</span></button>
      </div>`;
    box.innerHTML = html;

    const $ = (id) => document.getElementById(id);
    const bindRange = (id, fn) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener('input', () => commitPoseMutation((p) => fn(p, parseFloat(el.value)), false));
      el.addEventListener('change', pushHistorySnapshot);
    };

    const getTarget = (p) => (selectedBone === 'prop' ? p.propTransform : p[selectedBone]);
    bindRange('sTx', (p, v) => { getTarget(p).tx = v; });
    bindRange('sTy', (p, v) => { getTarget(p).ty = v; });
    bindRange('sRot', (p, v) => { getTarget(p).rot = v; });
    bindRange('sSc', (p, v) => { getTarget(p).scale = v; });
    bindRange('sRootSq', (p, v) => { p.root.squashY = v; });
    bindRange('sBeakSc', (p, v) => { p.face.beakScaleY = v; });
    bindRange('sGleam', (p, v) => { p.face.monocleGleam = v; });

    const bindSelect = (id, fn) => { const el = $(id); if (el) el.addEventListener('change', () => commitPoseMutation((p) => fn(p, el.value), true)); };
    bindSelect('selArmL', (p, v) => { p.flipperLeft.pose = v; });
    bindSelect('selArmR', (p, v) => { p.flipperRight.pose = v; });
    bindSelect('selEyeL', (p, v) => { p.face.leftEye = v; });
    bindSelect('selEyeR', (p, v) => { p.face.rightEye = v; });
    bindSelect('selBrow', (p, v) => { p.face.brow = v; });
    bindSelect('selBeak', (p, v) => { p.face.beak = v; });
    bindSelect('selProp', (p, v) => { p.prop = v; });

    if ($('chkArmRFront')) $('chkArmRFront').addEventListener('change', (e) => commitPoseMutation((p) => { p.flipperRight.front = e.target.checked; }, true));
    if ($('chkBlink')) $('chkBlink').addEventListener('change', (e) => commitPoseMutation((p) => { p.face.blink = e.target.checked; }, true));
    if ($('btnResetBone') && onResetBone) $('btnResetBone').addEventListener('click', onResetBone);
    if ($('btnResetPose') && onResetPose) $('btnResetPose').addEventListener('click', onResetPose);
    if ($('btnCopyPose') && onCopyPose) $('btnCopyPose').addEventListener('click', onCopyPose);
    if ($('btnPastePose') && onPastePose) $('btnPastePose').addEventListener('click', onPastePose);

    const pad = $('gazePad');
    if (pad) {
      let gazing = false;
      const updateGaze = (e) => {
        const r = pad.getBoundingClientRect();
        const nx = clamp((e.clientX - r.left) / r.width, 0, 1);
        const ny = clamp((e.clientY - r.top) / r.height, 0, 1);
        commitPoseMutation((p) => { p.face.gazeX = nx * 10 - 5; p.face.gazeY = ny * 8 - 4; }, false);
      };
      pad.addEventListener('pointerdown', (e) => { gazing = true; pad.setPointerCapture(e.pointerId); updateGaze(e); });
      pad.addEventListener('pointermove', (e) => { if (gazing) updateGaze(e); });
      pad.addEventListener('pointerup', () => { if (gazing) { gazing = false; pushHistorySnapshot(); } });
    }
  }

  global.PeroStudioInspector = { PRESET_COLORS, deriveScheme, renderBoneInspector };
})(window);
