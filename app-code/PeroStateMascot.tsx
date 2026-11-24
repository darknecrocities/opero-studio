import React from 'react';
import { PeroMascot, type PeroMascotProps } from './PeroMascot';
import { PERO_MOTION_BY_ID, getMotionForOperoState, type OperoAppState } from './peroMotions';

export interface PeroStateMascotProps extends Omit<PeroMascotProps, 'motion'> {
  state: OperoAppState;
}

/**
 * OPERO UX-State Auto-Mapper:
 * Pass any OPERO application state (e.g. "recording", "processing", "needs-review", "verified-draft")
 * and Pero automatically renders the matching motion, accessible label, and reduced-motion behavior.
 */
export const PeroStateMascot: React.FC<PeroStateMascotProps> = ({ state, title, ...rest }) => {
  const motionId = getMotionForOperoState(state);
  const motionMeta = PERO_MOTION_BY_ID[motionId];
  return <PeroMascot motion={motionId} title={title ?? motionMeta.description} {...rest} />;
};
