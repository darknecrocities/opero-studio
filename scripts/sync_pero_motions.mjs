import fs from 'node:fs';
import path from 'node:path';
import { buildMotionSvg, loadRigParts } from './pero_svg_builder.mjs';

const BASE = path.resolve(import.meta.dirname, '..');
const CSS_DIR = path.join(BASE, 'app-code', 'css');
const MANIFEST_PATH = path.join(BASE, 'manifest.json');
const TS_PATH = path.join(BASE, 'app-code', 'peroMotions.ts');
const HTML_PATH = path.join(BASE, 'index.html');

const UPDATED_DESCRIPTIONS = {
  'idle-breathe': 'Living companion idle: 3-beat diaphragm breath, staggered jacket lapels, double-blink + curiosity glance, lanyard swing, cap button bob, tail twitch, monocle sweep, and alternating right-heel micro-flex with grounded footing shadows.',
  'wave-hello': 'Energetic onboarding host: weight-transfer sway, 2-beat Figure-8 wave snap, counter-balance right wing, double-chirp beak, rhythmic right toe tap with shrinking foot shadow, cap visor tip, and expanding paw greeting ripple.',
  'thumbs-up': 'Hero approval stamp: anticipation squash dip into thumbs-up overshoot lifting left collar, locked left-foot plant with right mini-stomp settle, wink squeeze, rotating hero starburst, cap emblem gleam flash, and proud lanyard hop.',
  'recording-active': 'Live workflow director: optical scanning pupils + furrowed brows, baton cue beats on raised flipper, hip-brace counter pulse, 4-bar equalizer pill, dual crimson telemetry sonar rings, whispered cue beak, and COM-tracking ground/foot shadows.',
  'capture-paused': 'Restful sigh hold: deep suspended chest drop, cozy inward tucked flippers flexing together, dreamy brow & eye settle, monocle cord pendulum, breathing pause bars with frost aura, relaxed tail tuck, and wide settled ground/foot shadows.',
  'camera-snap': '4-beat shutter precision: forward aim -> click squeeze -> kickback recoil with popped right heel + shrinking right-foot shadow, pinching viewfinder brackets, golden starburst + radial flash ring, blue iris pulse, and lagged cap button pop.',
  'monocle-inspect': 'Forensic OCR scrutiny: forward lean gripping & twisting monocle rim, laser scan bar sequentially illuminating text lines, pulsing target reticles, rapid reading eye saccades, tipped brim, tail rudder, and forward-weighted footing shadow.',
  'thinking-processing': 'Local AI ideation: double-tap chin contemplation into eureka nod, staggered cloud pearls + triple-dot wave, timed synapse spark + halo ring, upward gaze + curious brow arch, 3/4 right-toe tap with dynamic foot shadow, and cap emblem pulse.',
  'writing-manual': 'Purposeful penmanship: elliptic cursive stylus trace drawing dual blue ink lines + gliding orange nib spark, flexing paper bounce, ping-pong tracking eyes, 2x enthusiastic tail wag, carriage-return head nod, and diagonal lean footing shadow.',
  'annotating-arrows': 'Studio presenter flourish: pullback windup into sweeping pointer extension, expanding arrow beacon ring + card perspective tilt, popping + badge glow, cheerful chirp, rear wing balance, and right-toe tap with decoupled foot shadow.',
  'magnifying-search': 'Detective sleuth prowl: wide figure-8 magnifier sweep with lens gleam & clue sparkles, crouching knee bounce at turnarounds, creeping heel-toe rock, tracking eyes, tipping cap brim, tail rudder, and left-to-right prowling COM shadow.',
  'needs-review-alert': 'Human-gate double-take: crisp head-snap double-take, symmetrical collar shoulder shrug ("Hmm?"), nervous foreground chin-tap, arched brow glance, quivering O-mouth, rocking amber triangle with dual pulse rings, and weight-shifting ankle shadow.',
  'verified-celebrate': 'Clean audit hop: ground squash into crisp bounded cheer leap shrinking main & dual foot shadows cleanly in mid-air, V-victory arm pump, asymmetric scissor-kick tiptoes, slamming emerald check stamp + shockwave ring, and 3 twinkling stars.',
  'export-document': 'Document dispatch heave: windup crouch into upward right-arm toss launching PDF skyward with speed ticks, left-arm brace swing, upward visor + sky-tracking pupils, right-heel push-off shrinking foot shadow, and planted left weight lock.',
  'model-loading': 'AI maestro levitation: sinusoidal zero-G hover softening altitude-reactive ground & foot shadows, counter-conducting orb arms, clockwise outer orbital ring + counter-clockwise inner dashed ring, pulsing satellites, and floating hem wave.',
  'privacy-shield': 'Local-first sentry guard: wide fortress brace stomp anchoring thick footing shadows (+12px COM shift), tactical shield brace forward with prismatic sweep glaze + outer ward pulse, perimeter-scanning pupils, and pulsing emerald seal.',
  'walk-waddle': '4-beat penguin waddle gait: elliptical alternating step clearances without floor clip, torso roll counter-balanced by head horizon lock, opposing flipper swings, 2x cap button hop, velocity speed streaks, dust puffs, and inverse L/R foot shadows.',
  'jump-cheer': 'Milestone 4-stage leap: deep anticipation crouch -> vertical stretch apex (`0.58x` main shadow & `0.30x` vanishing foot shadows) -> mid-air scissor kick -> landing stomp with twin dust clouds, 4 tumbling confetti pieces, and parachute cap snapback.',
  'sleep-standby': 'REM nap cycle: slow belly inhale widening grounded shadows -> heavy drowsy head droop with mini-catch settle, soft snore beak puff, drooping brows & relaxed floor tail, folded wing breathe, and spiraling S-curve z-z-Z trajectory.',
  'error-recover': 'Two-act recovery arc: Act I startled hop recoil shrinking ground & right-foot shadows, wing tremor shakes, crown cap pop-up, wide eye tremor & crimson alert shockwaves -> Act II stomp landing dust puff, relief exhale, calming double-blink & steady stance.',
};

let htmlSrc = fs.readFileSync(HTML_PATH, 'utf8');
const motionsRe = /window\.__PERO_MOTIONS__\s*=\s*(\[.*?\]);/;
const mapRe = /window\.__PERO_SVG_MAP__\s*=\s*\{.*?\};/;
const existingMatch = htmlSrc.match(motionsRe);
if (!existingMatch || !mapRe.test(htmlSrc)) {
  throw new Error('Could not find window.__PERO_MOTIONS__ or window.__PERO_SVG_MAP__ in index.html');
}
const motionsWithPose = JSON.parse(existingMatch[1]);
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

manifest.motions.forEach((m) => {
  if (UPDATED_DESCRIPTIONS[m.id]) m.description = UPDATED_DESCRIPTIONS[m.id];
});
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

const parts = loadRigParts(BASE);
const svgMap = {};
for (const m of motionsWithPose) {
  if (UPDATED_DESCRIPTIONS[m.id]) m.description = UPDATED_DESCRIPTIONS[m.id];
  const standaloneSvg = buildMotionSvg(m, CSS_DIR, parts, { scoped: false });
  fs.writeFileSync(path.join(BASE, 'svg', `${m.slug}.svg`), standaloneSvg);
  svgMap[m.id] = buildMotionSvg(m, CSS_DIR, parts, { scoped: true });
}

let tsSrc = fs.readFileSync(TS_PATH, 'utf8');
for (const m of motionsWithPose) {
  const escDesc = m.description.replace(/'/g, "\\'");
  const re = new RegExp(`(id:\\s*'${m.id}',[\\s\\S]*?description:\\s*)'[^']*(?:\\\\'[^']*)*'`);
  tsSrc = tsSrc.replace(re, `$1'${escDesc}'`);
}
fs.writeFileSync(TS_PATH, tsSrc);

htmlSrc = htmlSrc.replace(motionsRe, () => `window.__PERO_MOTIONS__ = ${JSON.stringify(motionsWithPose)};`);
htmlSrc = htmlSrc.replace(mapRe, () => `window.__PERO_SVG_MAP__ = ${JSON.stringify(svgMap)};`);
fs.writeFileSync(HTML_PATH, htmlSrc);

console.log(`Synced ${motionsWithPose.length} motions across manifest.json, peroMotions.ts, svg/*.svg, and index.html.`);
