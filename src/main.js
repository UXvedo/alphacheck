import {loadData} from './data.js';
import {SC, apyAlpha, apyRoot as apyRootS, outcome, breakEvenDays, maxSafeStake, REF_STAKES, SLIP_BANDS} from './swap-math.js';
import {formatAsOf} from './time.js';
import {formatBreakEvenDays} from './format.js';

const d = await loadData(), S = d.subnets;
const $ = id => document.getElementById(id), f = (x, n = 2) => x.toLocaleString(undefined, {maximumFractionDigits: n, minimumFractionDigits: n}), p = x => (x >= 0 ? '+' : '') + f(x * 100, 1) + '%';
const apyRoot = t => apyRootS(S, t);
const opts = S.filter(s => s.netuid === 0 || s.taoIn > 0).map(s => `<option value="${s.netuid}">${s.netuid} · ${s.name}</option>`);
$('sn').innerHTML = opts.join('');
const Q = new URLSearchParams(location.search), def = document.body.dataset.sn;
$('sn').value = [Q.get('sn'), def, '64', '1'].find(v => v != null && S.some(s => String(s.netuid) === v && (s.netuid === 0 || s.taoIn > 0)));
for (const i of ['amt', 'days', 'take']) {const v = Q.get(i); if (v != null && v !== '' && isFinite(+v) && +v >= 0) $(i).value = v}
function sync() {
  const q = new URLSearchParams();
  ['sn', 'amt', 'days', 'take'].forEach(i => q.set(i, $(i).value));
  history.replaceState(null, '', location.pathname + '?' + q);
  if (__FEATURES_ON__) {
    const share = $('shareimg');
    if (share) share.href = '/api/og?' + q.toString();
  }
}
function run() {
  const s = S.find(x => x.netuid == $('sn').value), X = +$('amt').value || 0, days = +$('days').value || 0, t = (+$('take').value || 0) / 100, yr = days / 365;
  const rA = apyRoot(t), rootEnd = X * (1 + rA * yr);
  let html = `<p class="muted small">Data as of <b>${formatAsOf(d.asOf)}</b> (block ${d.block}) · ${d.source}. Estimates, not live.</p>`;
  const hint = $('stake-hint');
  if (__FEATURES_ON__ && hint) {
    if (s.netuid === 0) hint.textContent = 'Root staking has no pool slippage.';
    else {
      const bits = SLIP_BANDS.map(b => `${f(b * 100, 1)}% up to ${f(maxSafeStake(s, b), 2)} τ`);
      hint.textContent = `Max safe stake (entry slippage): ${bits.join(', ')}.`;
    }
  }
  if (s.netuid === 0) {
    html += `<div class="card"><h2>Root staking</h2><div class="stats"><div class="stat"><span class="muted small">Est. APY (paid in TAO)</span><b>${f(rA * 100, 1)}%</b></div><div class="stat"><span class="muted small">After ${days} days</span><b>${f(rootEnd, 3)} τ</b></div><div class="stat"><span class="muted small">Price risk / slippage</span><b>None</b></div></div></div>`;
    return $('out').innerHTML = html;
  }
  const flat = outcome(s, X, days, t, 0), P = flat.P, aA = apyAlpha(s, t), entrySlip = flat.entrySlip, aEnd = flat.aEnd;
  const rows = SC.map(c => {
    const o = outcome(s, X, days, t, c), net = o.out - X;
    return `<tr><td>Alpha ${p(c)} vs TAO</td><td>${f(o.ideal, 3)}</td><td>${f(o.out, 3)}</td><td class="${net >= 0 ? 'pos' : 'neg'}">${(net >= 0 ? '+' : '') + f(net, 3)} τ (${p(net / X)})</td><td class="${o.out >= rootEnd ? 'pos' : 'neg'}">${o.out >= rootEnd ? 'beats' : 'loses to'} root</td></tr>`;
  }).join('');
  let feature = '';
  if (__FEATURES_ON__) {
    const cells = [`<div class="stat"><span class="muted small">This stake (${f(X, 2)} τ)</span><b>${formatBreakEvenDays(breakEvenDays(s, X, t))}</b></div>`]
      .concat(REF_STAKES.map(amt => `<div class="stat"><span class="muted small">${f(amt, 0)} τ</span><b>${formatBreakEvenDays(breakEvenDays(s, amt, t))}</b></div>`)).join('');
    feature = `<div class="card"><h2>Break-even days</h2><div class="stats">${cells}</div><p class="muted small">Round-trip cost (stake slippage plus unstake slippage) divided by estimated daily emissions in TAO, at 0% alpha change and your validator take. Never means those emissions cannot cover the cost.</p></div>`;
  }
  html += `${feature}<div class="card"><h2>SN${s.netuid} · ${s.name}</h2><div class="stats">
 <div class="stat"><span class="muted small">Est. APY (paid in alpha)</span><b>${f(aA * 100, 1)}%</b></div>
 <div class="stat"><span class="muted small">Alpha price</span><b>${f(P, 5)} τ</b></div>
 <div class="stat"><span class="muted small">Pool liquidity</span><b>${f(s.taoIn, 0)} τ</b></div>
 <div class="stat"><span class="muted small">Entry slippage</span><b class="${entrySlip > 0.01 ? 'warn' : ''}">${f(entrySlip * 100, 2)}%</b></div>
 <div class="stat"><span class="muted small">Alpha after ${days}d</span><b>${f(aEnd, 2)}</b></div></div></div>
 <div class="card"><h2>What you'd get back in TAO</h2><div class="tablewrap"><table><tr><th>Scenario</th><th>Value at spot</th><th>After exit slippage</th><th>Net vs ${f(X, 2)} τ in</th><th>vs root</th></tr>${rows}</table></div>
 <p class="muted small">Root staking the same ${f(X, 2)} τ for ${days} days ≈ <b>${f(rootEnd, 3)} τ</b> (est. ${f(rA * 100, 1)}% APY, paid in TAO, no slippage). Rewards use simple (non-compounded) interest; alpha emission rates and pool prices will change.</p></div>`;
  $('out').innerHTML = html;
}
['sn', 'amt', 'days', 'take'].forEach(i => $(i).addEventListener('input', () => {run(); sync()}));
run();
sync();
const cp = $('copylink'); if (cp) cp.onclick = () => {sync(); navigator.clipboard?.writeText(location.href).then(() => cp.textContent = 'Link copied ✓', () => prompt('Copy this link', location.href))};
