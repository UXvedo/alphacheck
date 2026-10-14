// Compare view logic. Uses only the approved formulas in swap-math.js; no new math.
import {apyAlpha, outcome, breakEvenDays, takeOf, apyRange, exitSlippage, lowTaoEmission} from './swap-math.js';

export const liveSubnets = S => S.filter(s => s.netuid !== 0 && s.taoIn > 0);

export function parseCompare(params, S) {
  const live = liveSubnets(S), ok = v => live.some(s => String(s.netuid) === String(v));
  const num = (v, d, min, max) => (v != null && v !== '' && isFinite(+v) && +v >= min ? Math.min(+v, max) : d);
  let a = ok(params.get('a')) ? +params.get('a') : (ok(64) ? 64 : live[0]?.netuid);
  let b = ok(params.get('b')) ? +params.get('b') : (ok(19) ? 19 : live[1]?.netuid);
  return {a, b, stake: num(params.get('stake'), 100, 0.01, 1e7), days: Math.round(num(params.get('days'), 30, 1, 3650))};
}

export function compareMetrics(s, stake, days) {
  const t = takeOf(s), o = outcome(s, stake, days, t, 0);
  return {
    netuid: s.netuid, name: s.name, take: t, pool: s.taoIn,
    apy: apyAlpha(s, t), entrySlip: o.entrySlip, out: o.out, net: o.out - stake,
    breakEven: breakEvenDays(s, stake, t),
    apyRange: apyRange(s), exitSlip: exitSlippage(s, stake).pct, lowEmission: lowTaoEmission(s),
  };
}

export function compareUrl({a, b, stake, days}) {
  return `/compare/?a=${a}&b=${b}&stake=${stake}&days=${days}`;
}
