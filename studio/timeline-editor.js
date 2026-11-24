/**
 * Timeline Project State, Undo/Redo Stack, Preset-to-Keyframe Remixing,
 * and localStorage Save/Load Management for Pero Animate Studio.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'pero_animate_studio_saved_v1';

  function parseTransformTxTyRot(str) {
    const tMatch = String(str || '').match(/translate\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/);
    const rMatch = String(str || '').match(/rotate\(\s*(-?\d+(?:\.\d+)?)/);
    return {
      tx: tMatch ? parseFloat(tMatch[1]) : 0,
      ty: tMatch ? parseFloat(tMatch[2]) : 0,
      rot: rMatch ? parseFloat(rMatch[1]) : 0,
    };
  }

  function presetToProject(motionMeta, capColor, jacketColor) {
    const E = global.PeroRigEngine;
    const p = motionMeta.pose || {};
    const bT = parseTransformTxTyRot(p.bodyTransform);
    const hT = parseTransformTxTyRot(p.headTransform);
    const cT = parseTransformTxTyRot(p.capTransform);

    const basePose = E.createDefaultPose();
    basePose.root = { tx: bT.tx, ty: bT.ty, rot: bT.rot, squashY: 1 };
    basePose.head = { tx: hT.tx, ty: hT.ty, rot: hT.rot };
    basePose.cap = { ty: cT.ty, rot: cT.rot };
    basePose.flipperLeft = { pose: p.leftFlipper || 'rest', rot: 0, scale: 1 };
    basePose.flipperRight = { pose: p.rightFlipper || 'rest', rot: 0, scale: 1, front: !!p.rightFlipperFront };
    basePose.face.leftEye = p.leftEye || 'open';
    basePose.face.rightEye = p.rightEye || 'open';
    basePose.face.brow = p.brow || 'neutral';
    basePose.face.beak = p.beak || 'smile';
    basePose.prop = p.prop || 'none';
    if (p.footLeft === 'tip-left') { basePose.footLeft.ty = -8; basePose.footLeft.rot = 12; }
    if (p.footLeft === 'step-up') { basePose.footLeft.ty = -14; basePose.footLeft.rot = -10; }
    if (p.footRight === 'tip-right') { basePose.footRight.ty = -8; basePose.footRight.rot = -12; }

    const midPose = E.clonePose(basePose);
    midPose.face.monocleGleam = 0.98;
    // Give each remixed preset an expressive multi-part proactive arc
    let rawFrames;
    if (motionMeta.id === 'jump-cheer' || motionMeta.id === 'verified-celebrate') {
      basePose.root.ty = 12; basePose.root.squashY = 0.92;
      const apex = E.clonePose(basePose);
      apex.root.ty = -9; apex.root.squashY = 1.02;
      apex.cap.ty = -2; apex.cap.rot = -3.5;
      apex.flipperLeft.rot = -13; apex.flipperRight.rot = 13;
      apex.footLeft.rot = -12; apex.footRight.rot = 12;
      apex.face.beakScaleY = 1.12;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-48', t: 0.48, easing: 'back', pose: E.clampPose(apex) },
        { id: 'kf-84', t: 0.84, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    } else if (motionMeta.id === 'walk-waddle') {
      basePose.root.rot = -4.5; basePose.footLeft.ty = -8; basePose.flipperLeft.rot = -17; basePose.flipperRight.rot = 17;
      midPose.root.rot = 5; midPose.footLeft.ty = 0; midPose.footRight.ty = -12;
      midPose.flipperLeft.rot = 17; midPose.flipperRight.rot = -17; midPose.face.beakScaleY = 1.08;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-50', t: 0.5, easing: 'easeInOut', pose: E.clampPose(midPose) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    } else if (motionMeta.id === 'error-recover') {
      const shock = E.clonePose(basePose);
      shock.root.ty = -4; shock.root.rot = -4.5; shock.head.rot = -4.5;
      shock.flipperLeft.rot = -15; shock.flipperRight.rot = 15;
      shock.footRight.ty = -8; shock.footRight.rot = -12; shock.face.beakScaleY = 1.16;
      const recover = E.clonePose(basePose);
      recover.root.ty = 3; recover.root.squashY = 0.98; recover.head.rot = 4; recover.face.blink = true;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-18', t: 0.18, easing: 'back', pose: E.clampPose(shock) },
        { id: 'kf-60', t: 0.6, easing: 'easeInOut', pose: E.clampPose(recover) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    } else if (motionMeta.id === 'wave-hello') {
      midPose.flipperLeft.rot = 17; midPose.head.rot += 4; midPose.root.rot -= 2.5; midPose.face.beakScaleY = 1.12;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-50', t: 0.5, easing: 'easeInOut', pose: E.clampPose(midPose) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    } else if (motionMeta.id === 'magnifying-search') {
      basePose.flipperLeft.rot = -16; basePose.face.gazeX = -3.5;
      midPose.flipperLeft.rot = -2; midPose.root.rot += 4; midPose.face.gazeX = 3.5;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-50', t: 0.5, easing: 'easeInOut', pose: E.clampPose(midPose) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    } else {
      midPose.root.ty -= 4;
      midPose.root.squashY = 1.02;
      midPose.head.rot += 3.5;
      midPose.flipperLeft.rot = -6;
      midPose.flipperRight.rot = 6;
      midPose.face.gazeX = 2.5;
      rawFrames = [
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: E.clampPose(basePose) },
        { id: 'kf-50', t: 0.5, easing: 'easeInOut', pose: E.clampPose(midPose) },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: E.clonePose(basePose) },
      ];
    }

    const keyframes = E.applyAutoFollowThrough(rawFrames);

    return {
      id: `custom-${motionMeta.id}-${Date.now()}`,
      name: `${motionMeta.name} Remix`,
      durationMs: motionMeta.durationMs || 1800,
      capColor: capColor || '#69BCFC',
      jacketColor: jacketColor || '#69BCFC',
      keyframes,
    };
  }

  function createBlankProject(capColor, jacketColor) {
    const E = global.PeroRigEngine;
    const p0 = E.createDefaultPose();
    const pMid = E.createDefaultPose();
    pMid.root.ty = -6;
    pMid.head.rot = 4;
    pMid.flipperLeft.rot = -10;
    const pEnd = E.clonePose(p0);
    return {
      id: `custom-${Date.now()}`,
      name: 'Custom Pero Motion',
      durationMs: 1800,
      capColor: capColor || '#69BCFC',
      jacketColor: jacketColor || '#69BCFC',
      keyframes: E.applyAutoFollowThrough([
        { id: 'kf-0', t: 0, easing: 'easeInOut', pose: p0 },
        { id: 'kf-50', t: 0.5, easing: 'easeInOut', pose: pMid },
        { id: 'kf-100', t: 1, easing: 'easeInOut', pose: pEnd },
      ]),
    };
  }

  function loadSavedMotions() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveMotionToLibrary(project) {
    const list = loadSavedMotions();
    const clean = JSON.parse(JSON.stringify(project));
    clean.updatedAt = new Date().toISOString();
    const idx = list.findIndex((item) => item.id === clean.id);
    if (idx >= 0) list[idx] = clean;
    else list.unshift(clean);
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
    return list;
  }

  function deleteSavedMotion(id) {
    const list = loadSavedMotions().filter((item) => item.id !== id);
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
    return list;
  }

  function createHistoryStack(initialState) {
    const past = [];
    const future = [];
    let current = JSON.parse(JSON.stringify(initialState));

    return {
      get: () => current,
      push: (nextState) => {
        past.push(JSON.parse(JSON.stringify(current)));
        if (past.length > 40) past.shift();
        future.length = 0;
        current = JSON.parse(JSON.stringify(nextState));
        return current;
      },
      undo: () => {
        if (!past.length) return null;
        future.push(JSON.parse(JSON.stringify(current)));
        current = past.pop();
        return current;
      },
      redo: () => {
        if (!future.length) return null;
        past.push(JSON.parse(JSON.stringify(current)));
        current = future.pop();
        return current;
      },
      canUndo: () => past.length > 0,
      canRedo: () => future.length > 0,
    };
  }

  global.PeroTimelineEditor = {
    presetToProject,
    createBlankProject,
    loadSavedMotions,
    saveMotionToLibrary,
    deleteSavedMotion,
    createHistoryStack,
  };
})(window);
