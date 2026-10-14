import {loadData} from './data.js';
import {parseCompare, compareMetrics, compareUrl, liveSubnets} from './compare-core.js';
import {formatBreakEvenDays, formatApyRange} from './format.js';
import {formatAsOf} from './time.js';

const d = await loadData(), S = d.subnets, live = liveSubnets(S);
const $ = id => document.getElementById(id);
const f = (x, n = 2) => x.toLocaleString(undefined, {maximumFractionDigits: n, minimumFractionDigits: n});
const esc = x => String(x).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const opts = live.map(s => `<option value="${s.netuid}">${s.netuid} · ${esc(s.name)}</option>`).join('');
$('ca').innerHTML = opts; $('cb').innerHTML = opts;
const st = parseCompare(new URLSearchParams(location.search), S);
$('ca').value = st.a; $('cb').value = st.b; $('cstake').value = st.stake; $('cdays').value = st.days;

function run() {
  const cur = parseCompare(new URLSearchParams({a: $('ca').value, b: $('cb').value, stake: $('cstake').value, days: $('cdays').value}), S);
  history.replaceState(null, '', compareUrl(cur));
  const [A, B] = [cur.a, cur.b].map(n => compareMetrics(S.find(s => s.netuid === n), cur.stake, cur.days));
  const better = (x, y, hi) => (x === y ? '' : (hi ? x > y : x < y) ? ' class="pos"' : '');
  const be = m => (m.breakEven == null ? Infinity : m.breakEven);
  const row = (label, va, vb, ca = '', cb = '') => `<tr><th scope="row">${label}</th><td${ca}>${va}</td><td${cb}>${vb}</td></tr>`;
  $('cout').innerHTML = `<div class="tablewrap"><table class="cmp"><caption class="muted small">${f(cur.stake, 2)} τ each, ${cur.days} days, flat alpha price. Data as of ${formatAsOf(d.asOf)}.</caption>
<tr><th scope="col">Metric</th><th scope="col"><a href="/sn/${A.netuid}/">SN${A.netuid} · ${esc(A.name)}</a></th><th scope="col"><a href="/sn/${B.netuid}/">SN${B.netuid} · ${esc(B.name)}</a></th></tr>
${row('Est. APY (paid in alpha)', f(A.apy * 100, 1) + '%', f(B.apy * 100, 1) + '%', better(A.apy, B.apy, 1), better(B.apy, A.apy, 1))}
${row('APY range across validators', formatApyRange(A.apyRange), formatApyRange(B.apyRange))}
${row('Low TAO emission warning', A.lowEmission ? '⚠ Yes' : 'No', B.lowEmission ? '⚠ Yes' : 'No')}
${row('Entry slippage', f(A.entrySlip * 100, 2) + '%', f(B.entrySlip * 100, 2) + '%', better(A.entrySlip, B.entrySlip, 0), better(B.entrySlip, A.entrySlip, 0))}
${row('Break-even', formatBreakEvenDays(A.breakEven), formatBreakEvenDays(B.breakEven), better(be(A), be(B), 0), better(be(B), be(A), 0))}
${row('Exit slippage today (separate)', Number.isFinite(A.exitSlip) ? f(A.exitSlip * 100, 2) + '%' : '—', Number.isFinite(B.exitSlip) ? f(B.exitSlip * 100, 2) + '%' : '—')}
${row(`TAO back after ${cur.days} days`, f(A.out, 3) + ' τ', f(B.out, 3) + ' τ', better(A.out, B.out, 1), better(B.out, A.out, 1))}
${row('Net TAO', (A.net >= 0 ? '+' : '') + f(A.net, 3) + ' τ', (B.net >= 0 ? '+' : '') + f(B.net, 3) + ' τ')}
${row('Pool liquidity', f(A.pool, 0) + ' τ', f(B.pool, 0) + ' τ')}
${row('Validator take (stake-weighted)', f(A.take * 100, 2) + '%', f(B.take * 100, 2) + '%')}
</table></div>`;
}
['ca', 'cb', 'cstake', 'cdays'].forEach(i => $(i).addEventListener('input', run));
$('cswap').onclick = () => { const a = $('ca').value; $('ca').value = $('cb').value; $('cb').value = a; run(); };
$('ccopy').onclick = () => navigator.clipboard?.writeText(location.href).then(() => { $('ccopy').textContent = 'Link copied ✓'; }, () => prompt('Copy this link', location.href));
run();
