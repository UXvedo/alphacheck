// Single source of swap, slippage, and APY math.
// The calculator, page generator, history snapshots, and flagged tools all call this module.
// An audit fix for the published formulas should change the block below and nothing else.
// Derived metrics only call those functions, so they follow an audit without a second formula.

export const BPY=7200*365, STAKER=0.41, SC=[-0.5,-0.2,0,0.2];
export const price=s=>s.taoIn/s.alphaIn;
export const apyAlpha=(s,t)=>s.alphaOut?s.alphaEmissionPerBlock*STAKER*(1-s.rootProp)*(1-t)*BPY/s.alphaOut:0;
export const apyRoot=(S,t)=>{const root=S.find(s=>s.netuid===0);return S.filter(s=>s.netuid).reduce((a,s)=>a+s.alphaEmissionPerBlock*STAKER*s.rootProp*price(s),0)*(1-t)*BPY/root.taoIn};
export const buy=(s,x)=>s.alphaIn-s.taoIn*s.alphaIn/(s.taoIn+x);
export const sell=(T,A,a)=>T-T*A/(A+a);
// TAO back after `days` if alpha/TAO moves by c (e.g. 0 = flat), after entry+exit slippage
export function outcome(s,X,days,t,c=0){const P=price(s),aGot=buy(s,X),aEnd=aGot*(1+apyAlpha(s,t)*days/365),k=s.taoIn*s.alphaIn,T=Math.sqrt(k*P*(1+c)),A=k/T;
 return {P,aGot,aEnd,entrySlip:1-aGot/(X/P),ideal:aEnd*P*(1+c),out:sell(T,A,aEnd)}}

// --- Derived metrics. These call the formulas above; they do not restate them. ---

export const DEFAULT_TAKE = 0.18;
export const REF_STAKES = [10, 100, 1000];
export const SLIP_BANDS = [0.005, 0.01, 0.02];

// Round trip at 0% alpha change, before emissions accrue.
// Stake slippage (TAO) is the gap between TAO in and the spot value of alpha received.
// Unstake slippage (TAO) is the gap between that spot value and TAO received selling it back.
export function roundTripCost(s, X) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return {stakeSlip: NaN, unstakeSlip: NaN, total: NaN};
  const P = price(s);
  const aGot = buy(s, X);
  const stakeSlip = X - aGot * P;
  const out = outcome(s, X, 0, 0, 0).out;
  const unstakeSlip = aGot * P - out;
  return {stakeSlip, unstakeSlip, total: stakeSlip + unstakeSlip};
}

// Estimated emissions on this stake, valued in TAO at the current alpha price, per day.
export function dailyEmissionsTao(s, X, t) {
  if (!(X > 0) || !(s.alphaIn > 0) || !(s.taoIn > 0)) return 0;
  const aGot = buy(s, X);
  const daily = aGot * apyAlpha(s, t) / 365 * price(s);
  return Number.isFinite(daily) ? daily : 0;
}

// Days for daily emissions to cover the round trip. null means emissions cannot cover it.
export function breakEvenDays(s, X, t = DEFAULT_TAKE) {
  const {total} = roundTripCost(s, X);
  const daily = dailyEmissionsTao(s, X, t);
  if (!(daily > 0) || !Number.isFinite(total)) return null;
  if (total <= 0) return 0;
  return total / daily;
}

// Largest stake whose entry slippage (from outcome/buy) stays at or below maxSlip.
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
