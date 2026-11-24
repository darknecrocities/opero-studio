/**
 * Official Jiggicons Spatial Web Audio Engine (MIT License — Copyright (c) 2026 Adrian Abelarde).
 * Renders stereo cues along each icon's moving mass path in real time.
 */
(function (global) {
  'use strict';

  const STEP = 2;
  const releaseSeconds = .022;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const materialOf = (variant) => (variant === 'glass' ? 'solid' : variant === 'duotone' ? 'outline' : variant);

  const WIDTH = {
    brass: .55, glass: .5, coin: .45, water: .4, spring: .35, bubble: .35, air: .3, metal: .3, leaf: .25, blip: .25,
    paper: .2, shutter: .2, plastic: .2, cardboard: .2, cloth: .15, wood: .15, rubber: .15, stone: .1, tick: .1,
    heartbeat: 0,
  };

  function local(pose, ox, oy) {
    const angle = pose.r * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const a = cos * pose.sx;
    const b = sin * pose.sx;
    const c = -sin * pose.sy;
    const d = cos * pose.sy;
    return [a, b, c, d, ox + pose.x - (a * ox + c * oy), oy + pose.y - (b * ox + d * oy)];
  }

  const compose = ([a1, b1, c1, d1, e1, f1], [a2, b2, c2, d2, e2, f2]) => [
    a1 * a2 + c1 * b2, b1 * a2 + d1 * b2, a1 * c2 + c1 * d2, b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1,
  ];

  function soundPath(motion, material = 'outline', mass) {
    const M = global.JiggiconsMotion;
    const parts = motion[material] ?? motion.outline;
    const baked = M.bake(parts, motion.ms);
    const count = Math.round(motion.ms / 1000 * M.RATE) + 1;
    const points = parts.map(([, ox, oy], index) => mass?.[index] ?? (index === 0 ? [12, 12, 100] : [ox, oy, 5]));
    const frames = [];
    for (let i = 0; i < count; i += STEP) frames.push(i);
    if (frames.at(-1) !== count - 1) frames.push(count - 1);

    const tracks = parts.map(() => []);
    for (const i of frames) {
      const matrices = [];
      const matrixOf = (index) => {
        if (matrices[index]) return matrices[index];
        const [parent, ox, oy] = parts[index];
        const own = local(M.poseOf(baked[index], i), ox, oy);
        return (matrices[index] = parent >= 0 ? compose(matrixOf(parent), own) : own);
      };
      parts.forEach((_, index) => {
        const [a, b, c, d, e, f] = matrixOf(index);
        const [x, y] = points[index];
        tracks[index].push([a * x + c * y + e, b * x + d * y + f, Math.sqrt(Math.abs(a * d - b * c))]);
      });
    }

    const travel = tracks.map((track) => Math.max(...track.map(([x, y, size]) =>
      Math.hypot(x - track[0][0], y - track[0][1]) + 6 * Math.abs(size - 1))));
    const most = Math.max(1e-6, ...travel);
    const weights = points.map(([, , area], index) => Math.max(area, 1) * (1 + 3 * travel[index] / most));
    const total = weights.reduce((sum, w) => sum + w, 0);
    return {
      step: STEP / M.RATE,
      dx: frames.map((_, n) => tracks.reduce((sum, track, k) => sum + weights[k] * (track[n][0] - track[0][0]), 0) / total),
      dy: frames.map((_, n) => tracks.reduce((sum, track, k) => sum + weights[k] * (track[n][1] - track[0][1]), 0) / total),
      grow: frames.map((_, n) => tracks.reduce((sum, track, k) => sum + weights[k] * track[n][2], 0) / total),
    };
  }

  function spatialCurve(path) {
    const peak = Math.max(...path.dx.map((x, i) => Math.hypot(x, path.dy[i])));
    const gain = peak < .05 ? 0 : Math.min(Math.max(9, 8 / peak), 45 / peak);
    const x = [];
    const y = [];
    const z = [];
    for (let i = 0; i < path.dx.length; i++) {
      const azimuth = clamp(path.dx[i] * gain, -50, 50) * Math.PI / 180;
      const elevation = clamp(-path.dy[i] * gain * .8, -35, 35) * Math.PI / 180;
      const distance = clamp(1 / path.grow[i] ** 2.2, .5, 1.8);
      x.push(Math.sin(azimuth) * Math.cos(elevation) * distance);
      y.push(Math.sin(elevation) * distance);
      z.push(-Math.cos(azimuth) * Math.cos(elevation) * distance);
    }
    return { step: path.step, x, y, z };
  }

  function positionAt(curve, seconds) {
    const index = seconds / curve.step;
    const last = curve.x.length - 1;
    if (!(index < last)) return [curve.x[last], curve.y[last], curve.z[last]];
    const low = Math.max(0, Math.floor(index));
    const mix = index - low;
    return [0, 1, 2].map((axis) => {
      const values = [curve.x, curve.y, curve.z][axis];
      return values[low] + (values[low + 1] - values[low]) * mix;
    });
  }

  function widthOf(sound = []) {
    const total = sound.reduce((sum, strike) => sum + (strike.v ?? 1), 0);
    if (!total) return .2;
    return sound.reduce((sum, strike) => sum + (WIDTH[strike.m] ?? .2) * (strike.v ?? 1), 0) / total;
  }

  function panAt(curve, seconds) {
    if (!curve) return [0, 1];
    const [x, y, z] = positionAt(curve, seconds);
    const distance = Math.max(.3, Math.hypot(x, y, z));
    return [clamp(1.6 * x / distance, -.92, .92), distance];
  }

  function travelTargets(curve, strikes) {
    if (!curve) return [];
    return strikes.filter((s) => s.m === 'air').map((strike) => {
      let best = strike.t;
      let farthest = -1;
      for (let t = strike.t; t <= strike.t + .4; t += curve.step) {
        const [pan] = panAt(curve, t);
        if (Math.abs(pan) > farthest) { farthest = Math.abs(pan); best = t; }
      }
      return { from: strike.t, to: strike.t + .12, at: best };
    });
  }

  function stereoize(samples, curve, width = .2, rate = 44100, strikes = []) {
    const targets = travelTargets(curve, strikes);
    const itd = .00045 * rate;
    const echoLeft = Math.round(.011 * rate);
    const echoRight = Math.round(.017 * rate);
    const length = samples.length + echoRight + Math.ceil(itd) + 1;
    const left = new Float32Array(length);
    const right = new Float32Array(length);
    const at = (i) => (i >= 0 && i < samples.length ? samples[i] : 0);
    const between = (pos) => { const idx = Math.floor(pos); const m = pos - idx; return at(idx) * (1 - m) + at(idx + 1) * m; };
    let softLeft = 0;
    let softRight = 0;
    for (let i = 0; i < length; i++) {
      const time = i / rate;
      const target = targets.find((e) => time >= e.from && time < e.to);
      const [pan, distance] = panAt(curve, target ? target.at : time);
      const angle = (pan + 1) * Math.PI / 4;
      const near = clamp(distance ** -.7, .65, 1.25);
      const delay = Math.abs(pan) * itd;
      const direct = [between(i - (pan > 0 ? delay : 0)), between(i - (pan < 0 ? delay : 0))];
      const spread = width * .5 * near * (1 - .5 * Math.abs(pan));
      const l = Math.cos(angle) * 1.15 * near * direct[0] + spread * at(i - echoLeft);
      const r = Math.sin(angle) * 1.15 * near * direct[1] + spread * at(i - echoRight);
      const open = clamp(1 - (distance - .8) * .55, .35, 1);
      softLeft += open * (l - softLeft);
      softRight += open * (r - softRight);
      left[i] = softLeft;
      right[i] = softRight;
    }
    const fade = Math.min(length, Math.round(.006 * rate));
    for (let k = 0; k < fade; k++) { const g = k / fade; left[length - 1 - k] *= g; right[length - 1 - k] *= g; }
    return { left, right };
  }

  function seedOf(id) {
    let hash = 2166136261;
    for (const ch of id) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
    return hash >>> 0;
  }

  let engine = null;
  let master = .6;
  let current = null;
  let lastTap = -Infinity;
  const cues = new Map();

  function context() {
    if (engine !== null) return engine;
    engine = undefined;
    const Context = global.AudioContext || global.webkitAudioContext;
    if (!Context) return engine;
    try {
      const audio = new Context({ latencyHint: 'interactive' });
      let output = audio.destination;
      if (audio.createDynamicsCompressor) {
        output = audio.createDynamicsCompressor();
        output.threshold.value = -14; output.knee.value = 8; output.ratio.value = 4;
        output.attack.value = .002; output.release.value = .16;
        output.connect(audio.destination);
      }
      engine = { audio, output };
    } catch { engine = undefined; }
    return engine;
  }

  function stereoFor(icon, variant) {
    const key = icon.id + '/' + variant;
    let stereo = cues.get(key);
    if (stereo) cues.delete(key);
    else {
      const S = global.JiggiconsSfx;
      const mono = S.normalizeCue(S.renderStrikes(icon.motion.sound, seedOf(icon.id), S.soundRate));
      const curve = spatialCurve(soundPath(icon.motion, materialOf(variant), icon.svg?.[variant]?.mass));
      stereo = stereoize(mono, curve, widthOf(icon.motion.sound), S.soundRate, icon.motion.sound);
      if (cues.size >= 64) cues.delete(cues.keys().next().value);
    }
    cues.set(key, stereo);
    return stereo;
  }

  function stopSound() { const v = current; current = null; v?.release(); }
  function setVolume(value) { master = clamp(Number(value) || 0, 0, 1); }

  function playSound(icon, { variant = 'duotone', volume = 1, overlap = false } = {}) {
    if (!icon?.motion?.sound?.length || master <= 0 || volume <= 0) return Promise.resolve();
    const live = context();
    if (!live) return Promise.resolve();
    const { audio } = live;
    const asked = performance.now();
    const ready = audio.state === 'running' ? Promise.resolve() : audio.resume();
    return ready.then(() => {
      if (audio.state !== 'running' || performance.now() - asked > 250) return;
      if (!overlap) stopSound();
      const now = audio.currentTime;
      const t = clamp((now - lastTap - .075) / .48, 0, 1);
      const level = (.42 + .58 * t * t * (3 - 2 * t)) * master * clamp(volume, 0, 1);
      lastTap = now;
      const stereo = stereoFor(icon, variant);
      const buffer = audio.createBuffer(2, stereo.left.length, global.JiggiconsSfx.soundRate);
      buffer.copyToChannel(stereo.left, 0);
      buffer.copyToChannel(stereo.right, 1);
      const source = audio.createBufferSource();
      const envelope = audio.createGain();
      envelope.gain.value = level;
      source.buffer = buffer;
      source.connect(envelope);
      envelope.connect(live.output);
      const voice = {
        release() {
          const at = audio.currentTime;
          envelope.gain.setValueAtTime(level, at);
          envelope.gain.linearRampToValueAtTime(0, at + releaseSeconds);
          try { source.stop(at + releaseSeconds); } catch {}
        },
      };
      source.onended = () => { source.disconnect(); envelope.disconnect(); if (current === voice) current = null; };
      current = voice;
      source.start();
    }).catch(() => {});
  }

  global.JiggiconsAudio = { context, setVolume, stopSound, playSound };
})(window);
