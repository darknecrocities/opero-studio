export type PeroMotionId =
  | 'idle-breathe'
  | 'wave-hello'
  | 'thumbs-up'
  | 'recording-active'
  | 'capture-paused'
  | 'camera-snap'
  | 'monocle-inspect'
  | 'thinking-processing'
  | 'writing-manual'
  | 'annotating-arrows'
  | 'magnifying-search'
  | 'needs-review-alert'
  | 'verified-celebrate'
  | 'export-document'
  | 'model-loading'
  | 'privacy-shield'
  | 'walk-waddle'
  | 'jump-cheer'
  | 'sleep-standby'
  | 'error-recover';

export type OperoAppState =
  | 'onboarding' | 'ready' | 'recording' | 'paused' | 'capturing' | 'ocr'
  | 'processing' | 'drafting' | 'annotating' | 'searching' | 'needs-review'
  | 'verified-draft' | 'exported' | 'model-setup' | 'privacy' | 'standby' | 'error';

export type FlipperLeftPose =
  | 'rest' | 'thumbs-up' | 'wave-up' | 'cheer-up' | 'chin-tap' | 'touch-monocle'
  | 'hold-magnifier' | 'hold-shield' | 'hold-orb-left' | 'hold-left' | 'tuck-in'
  | 'startled-left' | 'swing-back';

export type FlipperRightPose =
  | 'rest' | 'cheer-up' | 'point-up' | 'point-out' | 'write-out' | 'hold-camera'
  | 'toss-up' | 'chin-tap-right' | 'hold-orb-right' | 'tuck-in-front'
  | 'startled-right' | 'swing-forward';

export type EyeLeftExpr = 'open' | 'focused' | 'look-up' | 'calm' | 'happy' | 'closed' | 'wide';
export type EyeRightExpr = 'wink' | 'open' | 'focused' | 'squint' | 'curious' | 'calm' | 'happy' | 'closed' | 'wide';
export type BrowMood = 'neutral' | 'happy' | 'focused' | 'curious' | 'startled' | 'sleepy';
export type BeakExpr = 'smile' | 'open-smile' | 'o-mouth' | 'neutral';
export type FootPose = 'flat' | 'tip-left' | 'tip-right' | 'step-up';
export type PropType =
  | 'none' | 'sparkle-wave' | 'hero-glint' | 'rec-badge' | 'pause-bars' | 'camera-flash'
  | 'scan-frame' | 'thinking-dots' | 'doc-draft' | 'annotation-callout' | 'review-amber'
  | 'verified-check' | 'export-pdf' | 'ai-orbit' | 'shield' | 'motion-lines'
  | 'confetti' | 'zzz' | 'error-spark';

export interface PeroPoseSpec {
  bodyTransform: string;
  headTransform: string;
  capTransform: string;
  leftFlipper: FlipperLeftPose;
  rightFlipper: FlipperRightPose;
  rightFlipperFront?: boolean;
  leftEye: EyeLeftExpr;
  rightEye: EyeRightExpr;
  brow?: BrowMood;
  beak: BeakExpr;
  footLeft: FootPose;
  footRight: FootPose;
  prop: PropType;
  dust?: boolean;
}

export interface PeroMotionMeta {
  number: string;
  id: PeroMotionId;
  slug: string;
  name: string;
  description: string;
  operoStates: OperoAppState[];
  durationMs: number;
  loop: boolean;
  pose: PeroPoseSpec;
}

export const PERO_MOTIONS: readonly PeroMotionMeta[] = [
  {
    number: '01', id: 'idle-breathe', slug: '01-idle-breathe', name: 'Idle Breathe',
    description: 'Living companion idle: 3-beat diaphragm breath, staggered jacket lapels, double-blink + curiosity glance, lanyard swing, cap button bob, tail twitch, monocle sweep, and alternating right-heel micro-flex with grounded footing shadows.',
    operoStates: ['ready'], durationMs: 2800, loop: true,
    pose: { bodyTransform: 'translate(0, 0)', headTransform: 'rotate(0 256 260)', capTransform: 'rotate(0 256 120)', leftFlipper: 'rest', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'open', rightEye: 'open', brow: 'neutral', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'none', dust: false },
  },
  {
    number: '02', id: 'wave-hello', slug: '02-wave-hello', name: 'Wave Hello',
    description: 'Energetic onboarding host: weight-transfer sway, 2-beat Figure-8 wave snap, counter-balance right wing, double-chirp beak, rhythmic right toe tap with shrinking foot shadow, cap visor tip, and expanding paw greeting ripple.',
    operoStates: ['onboarding'], durationMs: 1800, loop: true,
    pose: { bodyTransform: 'rotate(-2 256 460)', headTransform: 'rotate(-4 256 260)', capTransform: 'rotate(-2 256 120)', leftFlipper: 'wave-up', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'open', rightEye: 'wink', brow: 'happy', beak: 'open-smile', footLeft: 'flat', footRight: 'tip-right', prop: 'sparkle-wave', dust: false },
  },
  {
    number: '03', id: 'thumbs-up', slug: '03-thumbs-up', name: 'Signature Thumbs Up',
    description: 'Hero approval stamp: anticipation squash dip into thumbs-up overshoot lifting left collar, locked left-foot plant with right mini-stomp settle, wink squeeze, rotating hero starburst, cap emblem gleam flash, and proud lanyard hop.',
    operoStates: [], durationMs: 2000, loop: true,
    pose: { bodyTransform: 'translate(0, 0)', headTransform: 'rotate(0 256 260)', capTransform: 'rotate(0 256 120)', leftFlipper: 'thumbs-up', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'open', rightEye: 'wink', brow: 'happy', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'hero-glint', dust: false },
  },
  {
    number: '04', id: 'recording-active', slug: '04-recording-active', name: 'Recording Active',
    description: 'Live workflow director: optical scanning pupils + furrowed brows, baton cue beats on raised flipper, hip-brace counter pulse, 4-bar equalizer pill, dual crimson telemetry sonar rings, whispered cue beak, and COM-tracking ground/foot shadows.',
    operoStates: ['recording'], durationMs: 1600, loop: true,
    pose: { bodyTransform: 'translate(-6, 2) rotate(2 256 460)', headTransform: 'rotate(3 256 260)', capTransform: 'rotate(2 256 120)', leftFlipper: 'hold-left', rightFlipper: 'point-up', rightFlipperFront: true, leftEye: 'focused', rightEye: 'focused', brow: 'focused', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'rec-badge', dust: false },
  },
  {
    number: '05', id: 'capture-paused', slug: '05-capture-paused', name: 'Capture Paused',
    description: 'Restful sigh hold: deep suspended chest drop, cozy inward tucked flippers flexing together, dreamy brow & eye settle, monocle cord pendulum, breathing pause bars with frost aura, relaxed tail tuck, and wide settled ground/foot shadows.',
    operoStates: ['paused'], durationMs: 2600, loop: true,
    pose: { bodyTransform: 'translate(0, 0)', headTransform: 'rotate(0 256 260)', capTransform: 'rotate(-1 256 120)', leftFlipper: 'tuck-in', rightFlipper: 'tuck-in-front', rightFlipperFront: true, leftEye: 'calm', rightEye: 'calm', brow: 'sleepy', beak: 'neutral', footLeft: 'flat', footRight: 'flat', prop: 'pause-bars', dust: false },
  },
  {
    number: '06', id: 'camera-snap', slug: '06-camera-snap', name: 'Screenshot Snap',
    description: '4-beat shutter precision: forward aim -> click squeeze -> kickback recoil with popped right heel + shrinking right-foot shadow, pinching viewfinder brackets, golden starburst + radial flash ring, blue iris pulse, and lagged cap button pop.',
    operoStates: ['capturing'], durationMs: 1700, loop: true,
    pose: { bodyTransform: 'translate(-8, 0)', headTransform: 'rotate(-3 256 260)', capTransform: 'rotate(-2 256 120)', leftFlipper: 'rest', rightFlipper: 'hold-camera', rightFlipperFront: true, leftEye: 'open', rightEye: 'wink', brow: 'happy', beak: 'smile', footLeft: 'flat', footRight: 'tip-right', prop: 'camera-flash', dust: false },
  },
  {
    number: '07', id: 'monocle-inspect', slug: '07-monocle-inspect', name: 'Monocle Inspect',
    description: 'Forensic OCR scrutiny: forward lean gripping & twisting monocle rim, laser scan bar sequentially illuminating text lines, pulsing target reticles, rapid reading eye saccades, tipped brim, tail rudder, and forward-weighted footing shadow.',
    operoStates: ['ocr'], durationMs: 2200, loop: true,
    pose: { bodyTransform: 'translate(12, 2) rotate(-2 256 460)', headTransform: 'translate(-4, 2) rotate(-5 256 260)', capTransform: 'rotate(-3 256 120)', leftFlipper: 'touch-monocle', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'focused', rightEye: 'squint', brow: 'focused', beak: 'neutral', footLeft: 'flat', footRight: 'flat', prop: 'scan-frame', dust: false },
  },
  {
    number: '08', id: 'thinking-processing', slug: '08-thinking-processing', name: 'Local AI Thinking',
    description: 'Local AI ideation: double-tap chin contemplation into eureka nod, staggered cloud pearls + triple-dot wave, timed synapse spark + halo ring, upward gaze + curious brow arch, 3/4 right-toe tap with dynamic foot shadow, and cap emblem pulse.',
    operoStates: ['processing'], durationMs: 2400, loop: true,
    pose: { bodyTransform: 'translate(-4, 0) rotate(2 256 460)', headTransform: 'rotate(5 256 260)', capTransform: 'rotate(4 256 120)', leftFlipper: 'chin-tap', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'look-up', rightEye: 'open', brow: 'curious', beak: 'neutral', footLeft: 'flat', footRight: 'tip-right', prop: 'thinking-dots', dust: false },
  },
  {
    number: '09', id: 'writing-manual', slug: '09-writing-manual', name: 'Drafting Manual',
    description: 'Purposeful penmanship: elliptic cursive stylus trace drawing dual blue ink lines + gliding orange nib spark, flexing paper bounce, ping-pong tracking eyes, 2x enthusiastic tail wag, carriage-return head nod, and diagonal lean footing shadow.',
    operoStates: ['drafting'], durationMs: 1400, loop: true,
    pose: { bodyTransform: 'translate(-18, 0) rotate(2 256 460)', headTransform: 'rotate(5 256 260)', capTransform: 'rotate(3 256 120)', leftFlipper: 'rest', rightFlipper: 'write-out', rightFlipperFront: true, leftEye: 'focused', rightEye: 'focused', brow: 'focused', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'doc-draft', dust: false },
  },
  {
    number: '10', id: 'annotating-arrows', slug: '10-annotating-arrows', name: 'Studio Annotating',
    description: 'Studio presenter flourish: pullback windup into sweeping pointer extension, expanding arrow beacon ring + card perspective tilt, popping + badge glow, cheerful chirp, rear wing balance, and right-toe tap with decoupled foot shadow.',
    operoStates: ['annotating'], durationMs: 2000, loop: true,
    pose: { bodyTransform: 'translate(-18, 0) rotate(2 256 460)', headTransform: 'rotate(4 256 260)', capTransform: 'rotate(2 256 120)', leftFlipper: 'rest', rightFlipper: 'point-out', rightFlipperFront: true, leftEye: 'open', rightEye: 'wink', brow: 'happy', beak: 'open-smile', footLeft: 'flat', footRight: 'tip-right', prop: 'annotation-callout', dust: false },
  },
  {
    number: '11', id: 'magnifying-search', slug: '11-magnifying-search', name: 'Workflow Search',
    description: 'Detective sleuth prowl: wide figure-8 magnifier sweep with lens gleam & clue sparkles, crouching knee bounce at turnarounds, creeping heel-toe rock, tracking eyes, tipping cap brim, tail rudder, and left-to-right prowling COM shadow.',
    operoStates: ['searching'], durationMs: 2200, loop: true,
    pose: { bodyTransform: 'translate(10, 2) rotate(-3 256 460)', headTransform: 'rotate(-5 256 260)', capTransform: 'rotate(-3 256 120)', leftFlipper: 'hold-magnifier', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'focused', rightEye: 'focused', brow: 'focused', beak: 'neutral', footLeft: 'flat', footRight: 'flat', prop: 'none', dust: false },
  },
  {
    number: '12', id: 'needs-review-alert', slug: '12-needs-review-alert', name: 'Needs Review',
    description: 'Human-gate double-take: crisp head-snap double-take, symmetrical collar shoulder shrug ("Hmm?"), nervous foreground chin-tap, arched brow glance, quivering O-mouth, rocking amber triangle with dual pulse rings, and weight-shifting ankle shadow.',
    operoStates: ['needs-review'], durationMs: 2100, loop: true,
    pose: { bodyTransform: 'translate(-4, 5) rotate(2 256 460)', headTransform: 'rotate(5.5 256 260)', capTransform: 'rotate(3 256 120)', leftFlipper: 'rest', rightFlipper: 'chin-tap-right', rightFlipperFront: true, leftEye: 'open', rightEye: 'curious', brow: 'curious', beak: 'o-mouth', footLeft: 'flat', footRight: 'flat', prop: 'review-amber', dust: false },
  },
  {
    number: '13', id: 'verified-celebrate', slug: '13-verified-celebrate', name: 'Verified Draft',
    description: 'Clean audit hop: ground squash into crisp bounded cheer leap shrinking main & dual foot shadows cleanly in mid-air, V-victory arm pump, asymmetric scissor-kick tiptoes, slamming emerald check stamp + shockwave ring, and 3 twinkling stars.',
    operoStates: ['verified-draft'], durationMs: 1500, loop: true,
    pose: { bodyTransform: 'translate(0, 4)', headTransform: 'rotate(-2 256 260)', capTransform: 'rotate(-2 256 120)', leftFlipper: 'cheer-up', rightFlipper: 'cheer-up', rightFlipperFront: false, leftEye: 'happy', rightEye: 'happy', brow: 'happy', beak: 'open-smile', footLeft: 'tip-left', footRight: 'tip-right', prop: 'verified-check', dust: false },
  },
  {
    number: '14', id: 'export-document', slug: '14-export-document', name: 'Export Document',
    description: 'Document dispatch heave: windup crouch into upward right-arm toss launching PDF skyward with speed ticks, left-arm brace swing, upward visor + sky-tracking pupils, right-heel push-off shrinking foot shadow, and planted left weight lock.',
    operoStates: ['exported'], durationMs: 1900, loop: true,
    pose: { bodyTransform: 'translate(-14, 0) rotate(2 256 460)', headTransform: 'rotate(3 256 260)', capTransform: 'rotate(2 256 120)', leftFlipper: 'rest', rightFlipper: 'toss-up', rightFlipperFront: true, leftEye: 'open', rightEye: 'happy', brow: 'happy', beak: 'open-smile', footLeft: 'flat', footRight: 'tip-right', prop: 'export-pdf', dust: false },
  },
  {
    number: '15', id: 'model-loading', slug: '15-model-loading', name: 'Orchestrating AI',
    description: 'AI maestro levitation: sinusoidal zero-G hover softening altitude-reactive ground & foot shadows, counter-conducting orb arms, clockwise outer orbital ring + counter-clockwise inner dashed ring, pulsing satellites, and floating hem wave.',
    operoStates: ['model-setup'], durationMs: 2200, loop: true,
    pose: { bodyTransform: 'translate(0, -3)', headTransform: 'rotate(-2 256 260)', capTransform: 'rotate(-1 256 120)', leftFlipper: 'hold-orb-left', rightFlipper: 'hold-orb-right', rightFlipperFront: true, leftEye: 'focused', rightEye: 'focused', brow: 'focused', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'ai-orbit', dust: false },
  },
  {
    number: '16', id: 'privacy-shield', slug: '16-privacy-shield', name: 'Privacy Guard',
    description: 'Local-first sentry guard: wide fortress brace stomp anchoring thick footing shadows (+12px COM shift), tactical shield brace forward with prismatic sweep glaze + outer ward pulse, perimeter-scanning pupils, and pulsing emerald seal.',
    operoStates: ['privacy'], durationMs: 2400, loop: true,
    pose: { bodyTransform: 'translate(14, 0) rotate(-1 256 460)', headTransform: 'rotate(-2 256 260)', capTransform: 'rotate(-1 256 120)', leftFlipper: 'hold-shield', rightFlipper: 'rest', rightFlipperFront: false, leftEye: 'focused', rightEye: 'focused', brow: 'focused', beak: 'smile', footLeft: 'flat', footRight: 'flat', prop: 'shield', dust: false },
  },
  {
    number: '17', id: 'walk-waddle', slug: '17-walk-waddle', name: 'Penguin Waddle',
    description: '4-beat penguin waddle gait: elliptical alternating step clearances without floor clip, torso roll counter-balanced by head horizon lock, opposing flipper swings, 2x cap button hop, velocity speed streaks, dust puffs, and inverse L/R foot shadows.',
    operoStates: [], durationMs: 1100, loop: true,
    pose: { bodyTransform: 'rotate(-3 256 445)', headTransform: 'rotate(2 256 260)', capTransform: 'rotate(2 256 120)', leftFlipper: 'swing-back', rightFlipper: 'swing-forward', rightFlipperFront: true, leftEye: 'open', rightEye: 'open', brow: 'happy', beak: 'open-smile', footLeft: 'step-up', footRight: 'flat', prop: 'motion-lines', dust: true },
  },
  {
    number: '18', id: 'jump-cheer', slug: '18-jump-cheer', name: 'Milestone Cheer',
    description: 'Milestone 4-stage leap: deep anticipation crouch -> vertical stretch apex (`0.58x` main shadow & `0.30x` vanishing foot shadows) -> mid-air scissor kick -> landing stomp with twin dust clouds, 4 tumbling confetti pieces, and parachute cap snapback.',
    operoStates: [], durationMs: 1400, loop: true,
    pose: { bodyTransform: 'translate(0, 0)', headTransform: 'rotate(0 256 260)', capTransform: 'rotate(-2 256 120)', leftFlipper: 'cheer-up', rightFlipper: 'cheer-up', rightFlipperFront: false, leftEye: 'happy', rightEye: 'wink', brow: 'happy', beak: 'open-smile', footLeft: 'tip-left', footRight: 'tip-right', prop: 'confetti', dust: true },
  },
  {
    number: '19', id: 'sleep-standby', slug: '19-sleep-standby', name: 'Standby Sleep',
    description: 'REM nap cycle: slow belly inhale widening grounded shadows -> heavy drowsy head droop with mini-catch settle, soft snore beak puff, drooping brows & relaxed floor tail, folded wing breathe, and spiraling S-curve z-z-Z trajectory.',
    operoStates: ['standby'], durationMs: 3200, loop: true,
    pose: { bodyTransform: 'translate(0, 4)', headTransform: 'rotate(5 256 260)', capTransform: 'rotate(5 256 120)', leftFlipper: 'tuck-in', rightFlipper: 'tuck-in-front', rightFlipperFront: true, leftEye: 'closed', rightEye: 'closed', brow: 'sleepy', beak: 'neutral', footLeft: 'flat', footRight: 'flat', prop: 'zzz', dust: false },
  },
  {
    number: '20', id: 'error-recover', slug: '20-error-recover', name: 'Error & Recover',
    description: 'Two-act recovery arc: Act I startled hop recoil shrinking ground & right-foot shadows, wing tremor shakes, crown cap pop-up, wide eye tremor & crimson alert shockwaves -> Act II stomp landing dust puff, relief exhale, calming double-blink & steady stance.',
    operoStates: ['error'], durationMs: 2200, loop: true,
    pose: { bodyTransform: 'translate(0, 6) rotate(-2 256 460)', headTransform: 'rotate(-3 256 260)', capTransform: 'rotate(-2 256 120)', leftFlipper: 'startled-left', rightFlipper: 'startled-right', rightFlipperFront: false, leftEye: 'wide', rightEye: 'wide', brow: 'startled', beak: 'o-mouth', footLeft: 'flat', footRight: 'tip-right', prop: 'error-spark', dust: true },
  },
];

export const PERO_MOTION_BY_ID = Object.fromEntries(
  PERO_MOTIONS.map((m) => [m.id, m]),
) as Record<PeroMotionId, PeroMotionMeta>;

export const OPERO_STATE_TO_MOTION: Record<OperoAppState, PeroMotionId> = {
  onboarding: 'wave-hello', ready: 'idle-breathe', recording: 'recording-active',
  paused: 'capture-paused', capturing: 'camera-snap', ocr: 'monocle-inspect',
  processing: 'thinking-processing', drafting: 'writing-manual', annotating: 'annotating-arrows',
  searching: 'magnifying-search', 'needs-review': 'needs-review-alert',
  'verified-draft': 'verified-celebrate', exported: 'export-document',
  'model-setup': 'model-loading', privacy: 'privacy-shield',
  standby: 'sleep-standby', error: 'error-recover',
};

export function getMotionForOperoState(state: OperoAppState): PeroMotionId {
  return OPERO_STATE_TO_MOTION[state] ?? 'idle-breathe';
}
