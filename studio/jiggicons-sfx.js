/**
 * Official Jiggicons Physical Foley SFX Synthesizer (MIT License — Copyright (c) 2026 Adrian Abelarde).
 */
(function (global) {
  'use strict';

  const TAU = 2 * Math.PI;
  const soundRate = 44100;

  function modes(t, list) {
    let sum = 0;
    for (const [hz, gain, decay] of list) sum += gain * Math.exp(-t / decay) * Math.sin(TAU * hz * t);
    return sum;
  }

  const SFX = {
    wood: { attack: .0008, texture: .68, tail: .2, level: 1, voice: (t, n, p) => modes(t * p, [
      [463, .69, .036], [817, .43, .024], [1339, .31, .016], [2093, .19, .011], [3091, .09, .008]]) + .65 * n * Math.exp(-t / .008) },
    brass: { attack: .0013, texture: .72, tail: 1.1, level: .82, voice: (t, n, p) => modes(t * p, [
      [861, .40, .25], [866, .25, .21], [1436, .34, .22], [2063, .29, .14], [2787, .15, .105], [3812, .12, .07], [5281, .08, .045]]) + .34 * n * Math.exp(-t / .006) },
    glass: { attack: .0006, texture: .9, tail: .7, level: .62, voice: (t, n, p) => modes(t * p, [
      [1873, .5, .2], [1881, .22, .17], [4418, .26, .09], [6007, .12, .05]]) + .22 * n * Math.exp(-t / .002) },
    metal: { attack: .0005, texture: .85, tail: .14, level: .8, voice: (t, n, p) => modes(t * p, [
      [2240, .42, .014], [3517, .3, .009], [5410, .16, .006], [610, .26, .02]]) + .62 * n * Math.exp(-t / .003) },
    plastic: { attack: .0007, texture: .6, tail: .12, level: .95, voice: (t, n, p) => modes(t * p, [
      [912, .5, .018], [1730, .3, .011], [2950, .15, .006]]) + .45 * n * Math.exp(-t / .004) },
    paper: { attack: .0004, texture: .85, tail: .07, level: .8, voice: (t, n, p) => modes(t * p, [
      [1450, .45, .009], [2380, .25, .006], [620, .3, .014]]) + .35 * n * Math.exp(-t / .0018) },
    cardboard: { attack: .003, texture: .55, tail: .2, level: 1, voice: (t, n, p) => modes(t * p, [
      [244, .65, .037], [526, .31, .029], [963, .19, .014]]) + .46 * n * Math.exp(-t / .012) },
    cloth: { attack: .0015, texture: .3, tail: .1, level: 1, voice: (t, n, p) =>
      Math.exp(-t / .03) * Math.sin(TAU * p * (180 * t + 1.6 * (1 - Math.exp(-t / .015)))) +
      modes(t * p, [[420, .15, .015]]) + .15 * n * Math.exp(-t / .003) },
    bubble: { attack: .002, texture: .46, tail: .25, level: .8, voice: (t, n, p) => {
      const phase = TAU * p * (820 * t - 10 * (1 - Math.exp(-t / .026)));
      return Math.exp(-t / .045) * (Math.sin(phase) + .21 * Math.sin(2.02 * phase)) + .23 * n * Math.exp(-t / .012);
    } },
    water: { attack: .0015, texture: .5, tail: .2, level: .75, voice: (t, n, p) => {
      const phase = TAU * p * (700 * t + 9 * (1 - Math.exp(-t / .016)) * 60);
      return Math.exp(-t / .035) * Math.sin(phase) + .12 * n * Math.exp(-t / .004);
    } },
    air: { attack: .0008, texture: .5, tail: .12, level: .75, voice: (t, n, p) => {
      const phase = TAU * p * (420 * t + 480 * .012 * (1 - Math.exp(-t / .012)));
      return Math.exp(-t / .028) * (Math.sin(phase) + .12 * Math.sin(2 * phase)) + .15 * n * Math.exp(-t / .0015);
    } },
    heartbeat: { attack: .006, texture: .09, tail: .3, level: 1, voice: (t, n, p) => {
      const phase = TAU * p * (78 * t + 2.4 * (1 - Math.exp(-t / .033)));
      return .83 * Math.exp(-t / .052) * Math.sin(phase) + .37 * Math.exp(-t / .039) * Math.sin(phase * 2.06) +
        .18 * Math.exp(-t / .027) * Math.sin(phase * 3.45) + .24 * n * Math.exp(-t / .025);
    } },
    rubber: { attack: .0015, texture: .47, tail: .2, level: 1, voice: (t, n, p) =>
      Math.exp(-t / .04) * Math.sin(TAU * p * (190 * t + 1.2 * (1 - Math.exp(-t / .02)) * 40)) +
      modes(t * p, [[618, .2, .019], [1491, .1, .02]]) + .4 * n * Math.exp(-t / .015) },
    tick: { attack: .0003, texture: .9, tail: .08, level: .7, voice: (t, n, p) => modes(t * p, [
      [2780, .5, .004], [4210, .3, .003], [1320, .3, .008]]) + .5 * n * Math.exp(-t / .002) },
    coin: { attack: .0005, texture: .88, tail: .6, level: .6, voice: (t, n, p) => modes(t * p, [
      [2637, .45, .16], [2651, .2, .13], [3955, .3, .1], [6210, .16, .06]]) + .3 * n * Math.exp(-t / .003) },
    shutter: { attack: .0004, texture: .8, tail: .16, level: .8, voice: (t, n, p) => {
      const click = (u) => u < 0 ? 0 : modes(u * p, [[1850, .4, .006], [3300, .3, .004]]) + .7 * n * Math.exp(-u / .0025);
      return click(t) + .7 * click(t - .048) + .25 * n * Math.exp(-(((t - .024) / .018) ** 2));
    } },
    spring: { attack: .002, texture: .3, tail: .35, level: .7, voice: (t, n, p) =>
      Math.exp(-t / .1) * Math.sin(TAU * p * (290 * t + .28 * Math.sin(TAU * 16 * t) * Math.exp(-t / .09) * 20)) +
      .1 * n * Math.exp(-t / .006) },
    blip: { attack: .003, texture: .2, tail: .18, level: .5, voice: (t, n, p) =>
      Math.exp(-t / .045) * (Math.sin(TAU * 1318 * p * t) + .22 * Math.sin(TAU * 2637 * p * t)) },
    stone: { attack: .0006, texture: .62, tail: .14, level: 1, voice: (t, n, p) => modes(t * p, [
      [312, .6, .028], [781, .32, .014], [1650, .16, .008], [2900, .08, .005]]) + .55 * n * Math.exp(-t / .005) },
    leaf: { attack: .0004, texture: .9, tail: .06, level: .6, voice: (t, n, p) => modes(t * p, [
      [3100, .35, .005], [4700, .2, .003], [2050, .25, .008]]) + .3 * n * Math.exp(-t / .0015) },
  };

  function mulberry(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6D2B79F5) >>> 0;
      let x = state;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return (((x ^ (x >>> 14)) >>> 0) / 4294967296) * 2 - 1;
    };
  }

  function renderStrikes(strikes, seed, rate) {
    const detune = .97 + ((seed >>> 3) & 255) / 255 * .06;
    const end = Math.max(...strikes.map((strike) => strike.t + (SFX[strike.m]?.tail ?? .2)));
    const samples = new Float32Array(Math.ceil((end + .02) * rate));
    for (const [number, strike] of strikes.entries()) {
      const model = SFX[strike.m] || SFX.plastic;
      const random = mulberry(seed + 4821 * (number + 1));
      const pitch = (strike.p ?? 1) * detune;
      const level = (strike.v ?? 1) * model.level;
      const start = Math.round(strike.t * rate);
      const stop = Math.min(samples.length, start + Math.ceil(model.tail * rate));
      let contact = 0;
      for (let index = start; index < stop; index++) {
        const t = (index - start) / rate;
        contact += model.texture * (random() - contact);
        const fade = Math.min(1, (stop - index) / (.015 * rate));
        samples[index] += level * (1 - Math.exp(-t / model.attack)) * model.voice(t, contact, pitch) * fade;
      }
    }
    let previous = 0;
    const smoothing = Math.exp(-TAU * 7200 / rate);
    for (let i = 0; i < samples.length; i++) previous = samples[i] = samples[i] * (1 - smoothing) + previous * smoothing;
    return samples;
  }

  function normalizeCue(samples) {
    const win = Math.round(.025 * soundRate);
    let peak = 0;
    let rollingEnergy = 0;
    let maxEnergy = 0;
    for (let i = 0; i < samples.length; i++) {
      const value = samples[i];
      peak = Math.max(peak, Math.abs(value));
      rollingEnergy += value * value;
      if (i >= win) rollingEnergy -= samples[i - win] ** 2;
      maxEnergy = Math.max(maxEnergy, rollingEnergy);
    }
    if (!peak || !maxEnergy) return samples;
    const gain = Math.min(.145 / peak, .078 / Math.sqrt(maxEnergy / win));
    for (let i = 0; i < samples.length; i++) samples[i] *= gain;
    return samples;
  }

  global.JiggiconsSfx = { soundRate, SFX, renderStrikes, normalizeCue };
})(window);
