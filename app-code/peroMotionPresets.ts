import type { PeroMotionId } from './peroMotions';

export const PERO_PALETTE = {
  outline: '#08102D',
  navy: '#202E54',
  navyShade: '#162343',
  skyMain: '#69BCFC',
  skyLight: '#76C7FC',
  skyMid: '#57B2FB',
  royal: '#2D8FED',
  white: '#FCFCFB',
  whiteShade: '#DFE4F3',
  beakBase: '#FDA326',
  beakLight: '#FDB936',
  beakShade: '#FC7414',
  blush: '#FDC6BC',
  monocleRim: '#1B2338',
  monocleBevel: '#8592B0',
} as const;

export interface PeroContainerMotionPreset {
  initial: { opacity: number; scale: number; y: number };
  animate: { opacity: number; scale: number; y: number };
  exit: { opacity: number; scale: number; y: number };
  transition: { duration: number; ease: [number, number, number, number] };
}

/**
 * Compatible with OPERO's `motion` (Framer Motion) library for smooth entrance/exit
 * transitions when mounting or swapping <PeroMascot /> across UI surfaces.
 */
export const PERO_CONTAINER_PRESET: PeroContainerMotionPreset = {
  initial: { opacity: 0, scale: 0.94, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -4 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

export const PERO_STATE_ARIA_LABELS: Record<PeroMotionId, string> = {
  'idle-breathe': 'Pero is ready',
  'wave-hello': 'Pero welcomes you to OPERO',
  'thumbs-up': 'Pero gives a thumbs up',
  'recording-active': 'OPERO is actively recording your workflow',
  'capture-paused': 'Workflow capture is paused',
  'camera-snap': 'Screenshot captured',
  'monocle-inspect': 'Inspecting UI labels and OCR evidence',
  'thinking-processing': 'Local AI is reconstructing workflow steps',
  'writing-manual': 'Drafting operation manual steps',
  'annotating-arrows': 'Adding visual annotations in OPERO Studio',
  'magnifying-search': 'Searching workflow steps and evidence',
  'needs-review-alert': 'Steps need human review before verification',
  'verified-celebrate': 'Draft verified and ready',
  'export-document': 'Exporting manual document',
  'model-loading': 'Preparing local AI model',
  'privacy-shield': 'Local-first privacy guard active',
  'walk-waddle': 'Navigating between steps',
  'jump-cheer': 'Workflow milestone complete',
  'sleep-standby': 'OPERO is on standby',
  'error-recover': 'Action interrupted; ready to retry',
};
