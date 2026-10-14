// Figures for share images. Same formulas as the calculator, at a flat alpha price.
import {apyAlpha, apyRoot, outcome, breakEvenDays, takeOf, growth, apyRange, lowTaoEmission} from './swap-math.js';
import {formatBreakEvenDays, formatApyRange} from './format.js';

const f = (x, n = 1) => Number(x).toLocaleString('en-US', {maximumFractionDigits: n, minimumFractionDigits: n});
const signedTao = x => `${x >= 0 ? '+' : ''}${f(x, 2)} τ`;

export function shareCard(snapshot, {netuid, amt, take} = {}) {
  const S = snapshot?.subnets || [];
  const X = Number.isFinite(+amt) && +amt > 0 ? +amt : 100;
  const stakeLabel = `${X} TAO`;
  const requested = netuid != null && netuid !== '' ? String(netuid) : '';
  const s = requested ? S.find(x => String(x.netuid) === requested) : (S.find(x => x.netuid === 64) || S.find(x => x.netuid && x.taoIn > 0));
  if (!s) return {title: requested ? `SN${requested}` : 'AlphaCheck', stakeLabel, apy: '—', breakEven: '—', netTao: '—'};
  const title = `SN${s.netuid} · ${s.name}`;
  if (s.netuid === 0) {
    const rA = apyRoot(S);
    const net = X * growth(s, rA, 30) - X;
    return {title, stakeLabel, apy: `${f(rA * 100, 1)}%`, breakEven: 'None', netTao: signedTao(net)};
  }
  if (!(s.taoIn > 0)) return {title, stakeLabel, apy: '—', breakEven: '—', netTao: '—'};
  const t = take != null && Number.isFinite(+take) ? +take : takeOf(s);
  const net = outcome(s, X, 30, t, 0).out - X;
  return {
    title,
    stakeLabel,
    apy: take != null && Number.isFinite(+take) ? `${f(apyAlpha(s, t) * 100, 1)}%` : formatApyRange(apyRange(s)),
    warning: lowTaoEmission(s) ? 'Low TAO coverage: high alpha APY is paid in new alpha' : '',
    breakEven: formatBreakEvenDays(breakEvenDays(s, X, t)),
    netTao: signedTao(net),
  };
}
