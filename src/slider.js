// What-if slider: maps a 0..1000 range position to a stake on a log scale (0.1 to 10,000 TAO) and back.
// Pure UI mapping; results still come from the approved math in swap-math.js.
export const STAKE_MIN = 0.1, STAKE_MAX = 10000, STEPS = 1000;
const L0 = Math.log10(STAKE_MIN), L1 = Math.log10(STAKE_MAX);

export function posToStake(pos) {
  const v = 10 ** (L0 + (L1 - L0) * Math.min(Math.max(+pos || 0, 0), STEPS) / STEPS);
  return v < 10 ? Math.round(v * 10) / 10 : v < 1000 ? Math.round(v) : Math.round(v / 10) * 10;
}

export function stakeToPos(stake) {
  const s = Math.min(Math.max(+stake || STAKE_MIN, STAKE_MIN), STAKE_MAX);
  return Math.round((Math.log10(s) - L0) / (L1 - L0) * STEPS);
}
