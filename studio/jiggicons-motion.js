/**
 * Official Jiggicons Motion & SVG Runtime (MIT License — Copyright (c) 2026 Adrian Abelarde).
 * Combines 120 Hz spring physics baking and Web Animations API SVG playback.
 */
(function (global) {
  'use strict';

  const RATE = 120;
  const CHANNELS = ['x', 'y', 'r', 'sq', 's', 'o'];
  const VARIANTS = Object.freeze(['outline', 'solid', 'duotone', 'glass']);
  const materialOf = (variant) => (variant === 'glass' ? 'solid' : variant === 'duotone' ? 'outline' : variant);

  function bump(time, start, end) {
    if (time <= start || time >= end) return 0;
    return Math.sin(Math.PI * (time - start) / (end - start)) ** 2;
  }

  function plateau(time, start, end, ramp) {
    if (time <= start || time >= end) return 0;
    if (time < start + ramp) return Math.sin(Math.PI / 2 * (time - start) / ramp) ** 2;
    if (time > end - ramp) return Math.sin(Math.PI / 2 * (end - time) / ramp) ** 2;
    return 1;
  }

  function step(time, start, end) {
    if (time <= start) return 0;
    if (time >= end) return 1;
    const u = (time - start) / (end - start);
    return u * u * (3 - 2 * u);
  }

  function spring(target, frequency, damping) {
    const result = new Float64Array(target.length);
    let position = 0;
    let velocity = 0;
    const omega = 2 * Math.PI * frequency;
    const substeps = 4;
    const dt = 1 / (RATE * substeps);
    for (let i = 0; i < target.length; i++) {
      for (let k = 0; k < substeps; k++) {
        const acceleration = omega ** 2 * (target[i] - position) - 2 * damping * omega * velocity;
        velocity += acceleration * dt;
        position += velocity * dt;
      }
      result[i] = position;
    }
    return result;
  }

  function bake(layers, ms) {
    const count = Math.round(ms / 1000 * RATE) + 1;
    const time = Array.from({ length: count }, (_, i) => i / RATE);
    const result = layers.map(() => ({}));
    layers.forEach(([, , , channels], index) => {
      for (const name of CHANNELS) {
        const channel = channels[name];
        if (!channel) continue;
        let drive;
        if (channel.follow) {
          const [leader, leaderChannel] = channel.follow;
          const source = result[leader]?.[leaderChannel] ?? new Float64Array(count);
          drive = Float64Array.from(source, (value) => value * (channel.gain ?? 1));
        } else {
          drive = Float64Array.from(time, (t) =>
            (channel.push ?? []).reduce((sum, [amount, start, end]) => sum + amount * bump(t, start, end), 0) +
            (channel.hold ?? []).reduce((sum, [amount, start, end, ramp]) => sum + amount * plateau(t, start, end, ramp), 0) +
            (channel.turn ?? []).reduce((sum, [amount, start, end]) => sum + amount * step(t, start, end), 0));
        }
        let values = channel.spring ? spring(drive, ...channel.spring) : drive;
        let rest = (channel.turn ?? []).reduce((sum, [amount]) => sum + amount, 0) * (channel.follow ? 0 : 1);
        if (channel.follow) {
          const leader = result[channel.follow[0]]?.[channel.follow[1]];
          rest = (leader?.rest ?? 0) * (channel.gain ?? 1);
          if (channel.relative && leader) {
            values = values.map((value, i) => value - leader[i]);
            rest -= leader.rest ?? 0;
          }
        }
        values.rest = rest;
        result[index][name] = values;
      }
    });
    return result;
  }

  function poseOf(channels, i) {
    const at = (name) => channels[name]?.[i] ?? 0;
    const sq = at('sq');
    const s = 1 + at('s');
    return {
      x: at('x'),
      y: at('y'),
      r: at('r'),
      sx: s * (1 + sq),
      sy: s * (1 - sq),
      o: Math.max(0, Math.min(1, 1 + at('o'))),
    };
  }

  function keyframesOf(channels) {
    const names = Object.keys(channels);
    if (!names.length) return null;
    const count = channels[names[0]].length;
    const frames = [];
    for (let i = 0; i < count; i += 2) {
      const last = i + 2 >= count;
      const pose = last ? { x: 0, y: 0, r: channels.r?.rest ?? 0, sx: 1, sy: 1, o: 1 } : poseOf(channels, i);
      frames.push({
        offset: last ? 1 : i / (count - 1),
        transform: `translate(${pose.x / 24 * 100}%, ${pose.y / 24 * 100}%) rotate(${pose.r}deg) scale(${pose.sx}, ${pose.sy})`,
        opacity: pose.o,
      });
      if (last) break;
    }
    return frames;
  }

  function pick(icon, variant) {
    if (!icon || !icon.svg) throw new TypeError('Not a Jiggicons icon');
    if (icon.svg[variant]) return variant;
    return VARIANTS.find((name) => icon.svg[name]) ?? Object.keys(icon.svg)[0];
  }

  function markupOf(icon, variant = 'outline', uid = '') {
    const name = pick(icon, variant);
    const markup = icon.svg[name].markup;
    if (!uid) return markup;
    const prefix = 'jigg-' + icon.id + '-' + name;
    return markup.replaceAll(prefix + '-', prefix + '-' + String(uid).replace(/[^a-zA-Z0-9_-]/g, '') + '-');
  }

  const escapeAttr = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

  function toSvg(icon, { variant = 'duotone', size = 24, title, className, uid = '' } = {}) {
    const label = title ? ` role="img" aria-label="${escapeAttr(title)}"` : ' aria-hidden="true"';
    const cls = className ? ` class="${escapeAttr(className)}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" data-jiggicon="${icon.id}" data-variant="${pick(icon, variant)}"${label}${cls}>${markupOf(icon, variant, uid)}</svg>`;
  }

  const running = new WeakMap();
  const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stop(root) {
    running.get(root)?.();
  }

  function play(root, icon, { variant, sound = false, volume } = {}) {
    if (!root || !icon?.motion) return () => {};
    const svg = root.matches?.('svg') ? root : root.querySelector?.('svg');
    const drawn = svg?.dataset?.variant ?? variant ?? 'outline';
    const name = pick(icon, variant ?? drawn);
    if (sound && global.JiggiconsAudio) global.JiggiconsAudio.playSound(icon, { variant: name, volume });
    stop(root);
    if (reducedMotion() || typeof root.querySelectorAll !== 'function') return () => {};
    const { motion } = icon;
    const layers = motion[materialOf(name)] ?? motion.outline;
    const baked = bake(layers, motion.ms);
    const animations = [];
    for (const element of root.querySelectorAll('[data-rig-layer]')) {
      if (typeof element.animate !== 'function') continue;
      const frames = keyframesOf(baked[Number(element.dataset.rigLayer)] ?? {});
      if (frames) animations.push(element.animate(frames, { duration: motion.ms }));
    }
    if (!animations.length) return () => {};
    const halt = () => {
      if (running.get(root) !== halt) return;
      for (const animation of animations) animation.cancel();
      running.delete(root);
    };
    animations.at(-1).onfinish = () => { if (running.get(root) === halt) running.delete(root); };
    running.set(root, halt);
    return halt;
  }

  global.JiggiconsMotion = { RATE, VARIANTS, materialOf, bake, poseOf, keyframesOf, markupOf, toSvg, play, stop };
})(window);
