export { PeroMascot, type PeroMascotProps } from './PeroMascot';
export { PeroStateMascot, type PeroStateMascotProps } from './PeroStateMascot';
export { OperoLogo, type OperoLogoProps } from './OperoLogo';
export {
  PERO_MOTIONS,
  PERO_MOTION_BY_ID,
  OPERO_STATE_TO_MOTION,
  getMotionForOperoState,
  type PeroMotionId,
  type OperoAppState,
  type PeroMotionMeta,
  type PeroPoseSpec,
} from './peroMotions';
export {
  PERO_OUTFIT_PRESETS,
  PERO_DEFAULT_CAP_COLOR,
  PERO_DEFAULT_JACKET_COLOR,
  derivePeroColorScheme,
  buildPeroColorVars,
  type PeroColorScheme,
  type PeroOutfitPreset,
} from './peroColorUtils';
export {
  PERO_PALETTE,
  PERO_CONTAINER_PRESET,
  PERO_STATE_ARIA_LABELS,
  type PeroContainerMotionPreset,
} from './peroMotionPresets';
