// Single source of swap, slippage, and APY math.
// Audited formulas (2026-10-14 math audit, section 4). Change them here only.
// Derived metrics call these functions.

export const BPY = 7200 * 365, STAKER = 0.41, SC = [-0.5, -0.2, 0, 0.2];
export const DEFAULT_TAKE = 0.18;
export const DEFAULT_TEMPO = 360;
export const REF_STAKES = [10, 100, 1000];
export const SLIP_BANDS = [0.005, 0.01, 0.02];

export function weightQuote(s) {
  const w = Number(s?.weightQuote);
  return w > 0 && w < 1 ? w : 0.5;
}
export function weightBase(s) {
  return 1 - weightQuote(s);
}
export function feeOf(s) {
  const f = Number(s?.fee);
  return f > 0 && f < 1 ? f : 0;
}
export function stakedOf(s) {
  const v = Number(s?.stakedAlpha);
  return v > 0 ? v : (s?.alphaOut || 0);
}
export function tempoOf(s) {
  const t = Number(s?.tempo);
  return Number.isFinite(t) && t >= 0 ? t : DEFAULT_TEMPO;
}
export function epochsPerYear(s) {
  return BPY / (tempoOf(s) + 1);
}
// t === undefined → the subnet's stake-weighted take. A number, including 0, is an override.
export function takeOf(s, t) {
  if (t != null && Number.isFinite(Number(t))) return Number(t);
  const own = Number(s?.take);
  return Number.isFinite(own) ? own : DEFAULT_TAKE;
}

// Spot TAO per alpha. At equal weights this is taoIn / alphaIn.
export const price = s => (weightBase(s) / weightQuote(s)) * (s.taoIn / s.alphaIn);

// Nominal subnet APY, paid in alpha. Denominator is staked alpha (totalAlphaStaked).
export function apyAlpha(s, t) {
  const denom = stakedOf(s);
  if (!(denom > 0)) return 0;
  return s.alphaEmissionPerBlock * STAKER * (1 - (s.rootProp || 0)) * (1 - takeOf(s, t)) * BPY / denom;
}

// Buy: alpha out for `x` TAO in. The fee shrinks the TAO that reaches the pool.
export function buy(s, x) {
  const dx = x * (1 - feeOf(s));
  if (!(dx > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return 0;
  const ratio = s.taoIn / (s.taoIn + dx);
  const got = s.alphaIn * (1 - ratio ** (weightQuote(s) / weightBase(s)));
  return got > 0 ? got : 0;
}

// Sell `alphaSold` into `pool` (default: the subnet's current reserves). Fee is taken on the TAO out.
export function sell(s, alphaSold, pool = s) {
  const T = pool?.taoIn, A = pool?.alphaIn;
  if (!(alphaSold > 0) || !(T > 0) || !(A > 0)) return 0;
  const ratio = A / (A + alphaSold);
  const got = (1 - feeOf(s)) * T * (1 - ratio ** (weightBase(s) / weightQuote(s)));
  return got > 0 ? got : 0;
}

// Reserves after a scenario price move of `c`, holding the weighted-pool invariant.
export function shiftedPool(s, c) {
  const wb = weightBase(s), wq = weightQuote(s);
  const factor = 1 + c;
  if (!(s.taoIn > 0) || !(s.alphaIn > 0) || !(factor > 0)) return {taoIn: s.taoIn, alphaIn: s.alphaIn};
  const P = price(s) * factor;
  const I = s.taoIn ** wb * s.alphaIn ** wq;
  const A = I / (P ** wb * (wq / wb) ** wb);
  const T = P * A * (wq / wb);
  return {taoIn: T, alphaIn: A};
}

// Compounded growth from an annual APY: (1 + APY)^(days/365). Approved Oct 14 (revision): the daily
// rate is (1 + APY)^(1/365) − 1, not APY/365. Used for break-even and every holding-period figure.
export function dailyRate(apy) {
  if (!Number.isFinite(apy) || apy <= -1) return 0;
  return (1 + apy) ** (1 / 365) - 1;
}
export function growth(s, apy, days) {
  if (!(days > 0) || !apy || !Number.isFinite(apy) || apy <= -1) return 1;
  return (1 + apy) ** (days / 365);
}

// TAO back after `days` if alpha/TAO moves by c, after entry and exit fees and slippage.
export function outcome(s, X, days, t, c = 0) {
  const P = price(s), aGot = buy(s, X), aEnd = aGot * growth(s, apyAlpha(s, t), days);
  const out = sell(s, aEnd, shiftedPool(s, c));
  const spotAlpha = P ? X / P : 0;
  return {P, aGot, aEnd, entrySlip: spotAlpha ? 1 - aGot / spotAlpha : 0, ideal: aEnd * P * (1 + c), out};
}

// Root APY in TAO. Each subnet's root alpha is sold through that pool (slippage and fee),
// then summed and divided by root stake. Pass `t` to force one take; otherwise each subnet uses its own.
export function apyRoot(S, t) {
  const root = S.find(s => s.netuid === 0);
  if (!(root?.taoIn > 0)) return 0;
  let taoYear = 0;
  for (const s of S) {
    if (!s.netuid || !(s.alphaEmissionPerBlock > 0) || !(s.rootProp > 0)) continue;
    const take = takeOf(s, t);
    const epochBlocks = tempoOf(s) + 1;
    const alphaEpoch = s.alphaEmissionPerBlock * STAKER * s.rootProp * (1 - take) * epochBlocks;
    const taoEpoch = sell(s, alphaEpoch);
    taoYear += taoEpoch * (BPY / epochBlocks);
  }
  return taoYear / root.taoIn;
}

// --- Derived metrics. These call the formulas above. ---

export function roundTripCost(s, X) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return {stakeSlip: NaN, unstakeSlip: NaN, total: NaN};
  const P = price(s);
  const aGot = buy(s, X);
  const stakeSlip = X - aGot * P;
  const out = outcome(s, X, 0, 0, 0).out;
  const unstakeSlip = aGot * P - out;
  return {stakeSlip, unstakeSlip, total: stakeSlip + unstakeSlip};
}

export function dailyEmissionsTao(s, X, t) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return 0;
  const aGot = buy(s, X);
  const daily = aGot * price(s) * dailyRate(apyAlpha(s, t));
  return Number.isFinite(daily) ? daily : 0;
}

// Entry cost in TAO: stake slippage plus the swap fee (buy() already applies the fee).
export function entryCost(s, X) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return NaN;
  return X - buy(s, X) * price(s);
}

// Exit slippage in TAO: selling the alpha you just bought into today's pool, as its own figure.
// Not part of break-even (approved Oct 14: counting it on top of entry double-counts most of the slippage).
export function exitSlippage(s, X) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return {tao: NaN, pct: NaN};
  const aGot = buy(s, X), spot = aGot * price(s);
  const tao = spot - sell(s, aGot);
  return {tao, pct: spot > 0 ? tao / spot : NaN};
}

// Break-even days = entry cost (slippage + fee, τ) ÷ (YOUR stake's daily alpha rewards × current alpha price),
// at 0% alpha price change. null ("Never") when rewards are zero or the stake is larger than the pool.
export function breakEvenDays(s, X, t = DEFAULT_TAKE) {
  if (!(X > 0) || !(s?.taoIn > 0) || X > s.taoIn) return null;
  const cost = entryCost(s, X);
  const daily = dailyEmissionsTao(s, X, t);
  if (!(daily > 0) || !Number.isFinite(cost)) return null;
  if (cost <= 0) return 0;
  return cost / daily;
}

// APY range across validators holding at least `minShare` of the subnet's stake.
export const RANGE_MIN_SHARE = 0.01;
export function apyRange(s, minShare = RANGE_MIN_SHARE) {
  const rows = Array.isArray(s?.validators) ? s.validators : [];
  const total = rows.reduce((a, v) => a + (v.alpha > 0 ? v.alpha : 0), 0);
  const denom = Math.max(stakedOf(s), total);
  const takes = denom > 0 ? rows.filter(v => v.alpha / denom >= minShare && Number.isFinite(v.take)).map(v => v.take) : [];
  if (!takes.length) takes.push(takeOf(s));
  const apys = takes.map(t => apyAlpha(s, t));
  return {min: Math.min(...apys), max: Math.max(...apys), validators: takes.length};
}

// TAO coverage = TAO injected into the pool per day ÷ TAO value (spot) of all alpha emitted per day
// (miners + validators/stakers + owner = subnetAlphaOutEmission). Warning below 25% (approved Oct 14).
export const LOW_COVERAGE_PERCENT = 25;
export function taoCoveragePercent(s) {
  if (!s || s.netuid === 0) return null;
  const stored = Number(s.tao_coverage_percent);
  if (s.tao_coverage_percent != null && Number.isFinite(stored)) return stored;
  const taoDay = Number(s.emission_tao_per_day);
  if (s.emission_tao_per_day == null || !Number.isFinite(taoDay)) return null;
  const alphaValue = (s.alphaEmissionPerBlock || 0) * 7200 * (s.taoIn > 0 && s.alphaIn > 0 ? price(s) : 0);
  return alphaValue > 0 ? taoDay / alphaValue * 100 : null;
}
export function lowTaoEmission(s) {
  const c = taoCoveragePercent(s);
  return c != null && c < LOW_COVERAGE_PERCENT;
}
export const LOW_EMISSION_WARNING = 'This subnet\'s pool receives little TAO compared with the alpha it issues. High alpha APY here is paid in newly issued alpha, which tends to push the alpha price down.';

export function maxSafeStake(s, maxSlip) {
  if (!(s.taoIn > 0) || !(s.alphaIn > 0) || !(maxSlip > 0) || maxSlip >= 1) return 0;
  const slip = x => outcome(s, x, 0, 0, 0).entrySlip;
  const tiny = Math.min(s.taoIn * 1e-9, 1e-6);
  if (!Number.isFinite(slip(tiny)) || slip(tiny) > maxSlip) return 0;
  let lo = 0;
  let hi = Math.max(s.taoIn, 1);
  for (let i = 0; i < 60 && slip(hi) <= maxSlip; i++) hi *= 2;
  for (let i = 0; i < 70; i++) {
    const mid = (lo + hi) / 2;
    if (slip(mid) <= maxSlip) lo = mid;
    else hi = mid;
  }
  return lo;
}
