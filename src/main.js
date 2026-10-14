import {loadData} from './data.js';
import {SC, apyAlpha, apyRoot as apyRootS, outcome, breakEvenDays, maxSafeStake, exitSlippage, apyRange, lowTaoEmission, LOW_EMISSION_WARNING, REF_STAKES, SLIP_BANDS, takeOf, growth} from './swap-math.js';
import {formatAsOf} from './time.js';
import {formatBreakEvenDays, formatApyRange} from './format.js';
import {posToStake, stakeToPos} from './slider.js';
import {loadWatch, starredFirst} from './watchlist.js';

const d = await loadData(), S = d.subnets;
const $ = id => document.getElementById(id);
const f = (x, n = 2) => x.toLocaleString(undefined, {maximumFractionDigits: n, minimumFractionDigits: n});
const p = x => (x >= 0 ? '+' : '') + f(x * 100, 1) + '%';
const esc = x => String(x).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const pctText = t => (t * 100).toFixed(4).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
const shortHk = hk => (hk && hk.length > 12 ? hk.slice(0, 6) + '…' + hk.slice(-4) : (hk || ''));
const near = (a, b) => Math.abs(a - b) < 1e-6;

const store = (() => { try { return window.localStorage; } catch { return null; } })();
function fillSubnets() {
  let list = S.filter(s => s.netuid === 0 || s.taoIn > 0);
  const starred = __WATCH_ON__ ? loadWatch(store) : [];
  if (__WATCH_ON__) list = starredFirst(list, starred, s => s.netuid);
  const keep = $('sn').value;
  $('sn').innerHTML = list.map(s => `<option value="${s.netuid}">${starred.includes(s.netuid) ? '★ ' : ''}${s.netuid} · ${esc(s.name)}</option>`).join('');
  if (keep) $('sn').value = keep;
}
fillSubnets();
const Q = new URLSearchParams(location.search), def = document.body.dataset.sn;
$('sn').value = [Q.get('sn'), def, '64', '1'].find(v => v != null && S.some(s => String(s.netuid) === v && (s.netuid === 0 || s.taoIn > 0)));
for (const i of ['amt', 'days']) {const v = Q.get(i); if (v != null && v !== '' && isFinite(+v) && +v >= 0) $(i).value = v}

function subnet() {return S.find(x => x.netuid == $('sn').value)}

function fillValidators(s, preset) {
  const val = $('val');
  if (!val) return;
  if (!s || s.netuid === 0) {
    val.innerHTML = '<option value="root">No subnet validator</option>';
    val.value = 'root';
    val.disabled = true;
    return;
  }
  val.disabled = false;
  const rows = Array.isArray(s.validators) ? s.validators : [];
  val.innerHTML = [`<option value="avg">Stake-weighted average (${pctText(takeOf(s))}%)</option>`]
    .concat(rows.map((v, i) => `<option value="${i}">${esc(shortHk(v.hotkey))} · ${pctText(v.take)}%</option>`))
    .concat('<option value="custom">Custom take</option>').join('');
  if (preset?.index != null) {
    val.value = String(preset.index);
    if (!preset.keepTake) $('take').value = pctText(rows[preset.index].take);
    return;
  }
  if (preset?.custom) {
    val.value = 'custom';
    return;
  }
  val.value = 'avg';
  $('take').value = pctText(takeOf(s));
}

function presetFromUrl(s) {
  const raw = Q.get('take');
  const hasTake = raw != null && raw !== '' && isFinite(+raw) && +raw >= 0;
  if (hasTake) $('take').value = raw;
  if (!s || s.netuid === 0) return fillValidators(s);
  const rows = Array.isArray(s.validators) ? s.validators : [];
  const hk = Q.get('hk');
  const index = hk ? rows.findIndex(v => v.hotkey === hk) : -1;
  if (index >= 0) {
    const matches = !hasTake || near(+raw / 100, rows[index].take);
    if (matches) return fillValidators(s, {index, keepTake: hasTake});
    return fillValidators(s, {custom: true});
  }
  if (hasTake && !near(+raw / 100, takeOf(s))) return fillValidators(s, {custom: true});
  return fillValidators(s);
}

function selectedHotkey(s) {
  const v = $('val')?.value;
  if (!s || !v || v === 'avg' || v === 'custom' || v === 'root') return '';
  return s.validators?.[+v]?.hotkey || '';
}

function sync() {
  const q = new URLSearchParams();
  ['sn', 'amt', 'days', 'take'].forEach(i => q.set(i, $(i).value));
  const hk = selectedHotkey(subnet());
  if (hk) q.set('hk', hk);
  history.replaceState(null, '', location.pathname + '?' + q);
  if (__FEATURES_ON__) {
    const share = $('shareimg');
    if (share) share.href = '/api/og?' + q.toString();
  }
}

function run() {
  const s = subnet(), X = +$('amt').value || 0, days = +$('days').value || 0, t = (+$('take').value || 0) / 100;
  const rootSubnet = S.find(x => x.netuid === 0) || s;
  const rA = apyRootS(S);
  const rootEnd = X * growth(rootSubnet, rA, days);
  let html = `<p class="muted small">Data as of <b>${formatAsOf(d.asOf)}</b> (block ${d.block}) · ${esc(d.source)}. Estimates, not live.</p>`;
  const hint = $('stake-hint');
  if (__FEATURES_ON__ && hint) {
    if (s.netuid === 0) hint.textContent = 'Root staking keeps your TAO in place. The root APY already includes the cost of selling each epoch of root dividends.';
    else {
      const bits = SLIP_BANDS.map(b => `${f(b * 100, 1)}% up to ${f(maxSafeStake(s, b), 2)} τ`);
      hint.textContent = `Max safe stake (entry slippage): ${bits.join(', ')}.`;
    }
  }
  if (s.netuid === 0) {
    html += `<div class="card"><h2>Root staking</h2><div class="stats"><div class="stat"><span class="muted small">Est. APY (paid in TAO)</span><b>${f(rA * 100, 1)}%</b></div><div class="stat"><span class="muted small">After ${days} days</span><b>${f(rootEnd, 3)} τ</b></div><div class="stat"><span class="muted small">Price risk / slippage</span><b>None on your stake</b></div></div><p class="muted small">This APY uses each subnet's stake-weighted validator take, then sells one epoch of that subnet's root alpha through its pool (slippage and the swap fee). Your own root stake stays in TAO. The holding-period figure compounds once per epoch.</p></div>`;
    $('out').innerHTML = html;
    return;
  }
  const flat = outcome(s, X, days, t, 0), P = flat.P, aA = apyAlpha(s, t), entrySlip = flat.entrySlip, aEnd = flat.aEnd;
  const rows = SC.map(c => {
    const o = outcome(s, X, days, t, c), net = o.out - X;
    return `<tr><td>Alpha ${p(c)} vs TAO</td><td>${f(o.ideal, 3)}</td><td>${f(o.out, 3)}</td><td class="${net >= 0 ? 'pos' : 'neg'}">${(net >= 0 ? '+' : '') + f(net, 3)} τ (${X > 0 ? p(net / X) : '—'})</td><td class="${o.out >= rootEnd ? 'pos' : 'neg'}">${o.out >= rootEnd ? 'beats' : 'loses to'} root</td></tr>`;
  }).join('');
  let feature = '';
  if (__FEATURES_ON__) {
    const cells = [`<div class="stat"><span class="muted small">This stake (${f(X, 2)} τ)</span><b>${formatBreakEvenDays(breakEvenDays(s, X, t))}</b></div>`]
      .concat(REF_STAKES.map(amt => `<div class="stat"><span class="muted small">${f(amt, 0)} τ</span><b>${formatBreakEvenDays(breakEvenDays(s, amt, t))}</b></div>`)).join('');
    const ex = exitSlippage(s, X);
    feature = `<div class="card"><h2>Break-even days</h2><div class="stats">${cells}<div class="stat"><span class="muted small">Exit slippage today (separate)</span><b>${Number.isFinite(ex.pct) ? f(ex.pct * 100, 2) + '% · ' + f(ex.tao, 3) + ' τ' : '—'}</b></div></div><p class="muted small">Entry cost (stake slippage plus the 0.05% swap fee, in TAO) divided by your stake's daily alpha rewards valued at today's alpha price, at 0% alpha change and your validator take. Exit slippage, selling into today's pool, is shown separately. Never means zero rewards or a stake larger than the pool; over 365 days shows as &gt; 1 year.</p></div>`;
  }
  const warn = lowTaoEmission(s) ? `<div class="card warnbox" role="note"><b>⚠ Low TAO emission (${f(s.emission_share_percent, 3)}% of TAO emission, ≈${f(s.emission_tao_per_day, 2)} τ/day).</b> ${esc(LOW_EMISSION_WARNING)}</div>` : '';
  html += `${warn}${feature}<div class="card"><h2>SN${s.netuid} · ${esc(s.name)}</h2><div class="stats">
 <div class="stat"><span class="muted small">Est. APY (paid in alpha), your take</span><b>${f(aA * 100, 1)}%</b></div>
 <div class="stat"><span class="muted small">APY range across validators (paid in alpha)</span><b>${formatApyRange(apyRange(s))}</b></div>
 <div class="stat"><span class="muted small">Alpha price</span><b>${f(P, 5)} τ</b></div>
 <div class="stat"><span class="muted small">Pool liquidity</span><b>${f(s.taoIn, 0)} τ</b></div>
 <div class="stat"><span class="muted small">Entry slippage</span><b class="${entrySlip > 0.01 ? 'warn' : ''}">${f(entrySlip * 100, 2)}%</b></div>
 <div class="stat"><span class="muted small">Alpha after ${days}d</span><b>${f(aEnd, 2)}</b></div></div>${X > s.taoIn ? `<p class="warn small">Your stake (${f(X, 2)} τ) is larger than the whole pool (${f(s.taoIn, 0)} τ). Most of it would be lost to slippage.</p>` : ''}</div>
 <div class="card"><h2>What you'd get back in TAO</h2><div class="tablewrap"><table><tr><th>Scenario</th><th>Value at spot</th><th>After exit slippage</th><th>Net vs ${f(X, 2)} τ in</th><th>vs root</th></tr>${rows}</table></div>
 <p class="muted small">Root staking the same ${f(X, 2)} τ for ${days} days ≈ <b>${f(rootEnd, 3)} τ</b> (est. ${f(rA * 100, 1)}% APY, paid in TAO). Root APY uses each subnet's stake-weighted take, then sells one epoch of root dividends through that pool. Subnet rewards compound once per epoch (about 7,280 a year when tempo is 360). Emission rates and pool prices will change.</p></div>`;
  $('out').innerHTML = html;
}

presetFromUrl(subnet());
$('sn').addEventListener('change', () => {fillValidators(subnet()); run(); sync()});
$('val').addEventListener('change', () => {
  const s = subnet(), v = $('val').value;
  if (v === 'avg') $('take').value = pctText(takeOf(s));
  else if (v !== 'custom' && v !== 'root') {
    const row = s.validators?.[+v];
    if (row) $('take').value = pctText(row.take);
  }
  run(); sync();
});
$('take').addEventListener('input', () => {
  const s = subnet();
  if (s && s.netuid !== 0 && $('val')) {
    const entered = (+$('take').value || 0) / 100;
    const v = $('val').value;
    let matches = false;
    if (v === 'avg') matches = near(entered, takeOf(s));
    else if (v !== 'custom' && v !== 'root') matches = near(entered, s.validators?.[+v]?.take);
    if (!matches) $('val').value = 'custom';
  }
  run(); sync();
});
['amt', 'days'].forEach(i => $(i).addEventListener('input', () => {run(); sync(); paintSliders()}));
function paintSliders() {
  if (!__SLIDER_ON__ || !$('amt-range')) return;
  $('amt-range').value = stakeToPos($('amt').value);
  $('amt-out').textContent = f(+$('amt').value || 0, 2);
  $('days-range').value = Math.min(Math.max(+$('days').value || 1, 1), 365);
  $('days-out').textContent = String(+$('days').value || 0);
  $('amt-range').setAttribute('aria-valuetext', `${$('amt-out').textContent} TAO`);
  $('days-range').setAttribute('aria-valuetext', `${$('days-out').textContent} days`);
}
if (__SLIDER_ON__ && $('amt-range')) {
  $('amt-range').addEventListener('input', () => {$('amt').value = posToStake($('amt-range').value); run(); sync(); paintSliders()});
  $('days-range').addEventListener('input', () => {$('days').value = $('days-range').value; run(); sync(); paintSliders()});
  paintSliders();
}
if (__WATCH_ON__) document.addEventListener('watchlist-change', fillSubnets);
run();
sync();
const cp = $('copylink'); if (cp) cp.onclick = () => {sync(); navigator.clipboard?.writeText(location.href).then(() => cp.textContent = 'Link copied ✓', () => prompt('Copy this link', location.href))};
