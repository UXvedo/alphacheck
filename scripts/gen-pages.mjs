// Build-time generator: per-subnet pages, how-it-works, methodology, sitemap, robots.
// Flagged pages (leaderboard, share images) are emitted only when the feature flag is on.
// Numbers come from public/snapshot.json via src/swap-math.js (same math as the calculator).
import fs from 'node:fs';
import path from 'node:path';
import {apyAlpha, apyRoot, outcome, breakEvenDays, maxSafeStake, REF_STAKES, SLIP_BANDS, DEFAULT_TAKE} from '../src/swap-math.js';
import {featuresEnabled} from '../src/features.js';
import {formatBreakEvenDays} from '../src/format.js';
import {renderOgSvg} from '../src/og-template.js';

const SITE = 'https://www.alphacheck.io', R = path.resolve(import.meta.dirname, '..');
const features = featuresEnabled(process.env);
const d = JSON.parse(fs.readFileSync(path.join(R, 'public/snapshot.json'), 'utf8')), S = d.subnets;
const tpl = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
const esc = x => String(x).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const f = (x, n = 1) => x.toLocaleString('en-US', {maximumFractionDigits: n, minimumFractionDigits: n});
const date = d.asOf.slice(0, 10), X = 100, DAYS = 90, T = DEFAULT_TAKE;
const rootEnd = X * (1 + apyRoot(S, T) * DAYS / 365);
const live = S.filter(s => s.netuid !== 0 && s.taoIn > 0).sort((a, b) => a.netuid - b.netuid);
const between = (s, a, b) => s.slice(s.indexOf(a), s.indexOf(b) + b.length);

function page({url, title, desc, ogTitle, hero, sn = '', links = '', robots = '', lang = 'en'}) {
  let h = tpl.replace(between(tpl, '<!--HEAD-->', '<!--/HEAD-->'), `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots ? `<meta name="robots" content="${esc(robots)}">\n` : ''}<link rel="canonical" href="${SITE}${url}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${url}">`).replace('<body data-sn="">', `<body data-sn="${sn}">`).replace('<html lang="en">', `<html lang="${lang}">`);
  if (hero != null) h = h.replace(between(h, '<!--HERO-->', '<!--/HERO-->'), hero);
  if (features && sn !== '') {
    h = h.replaceAll('https://www.alphacheck.io/og.png', `${SITE}/og/sn/${sn}.svg`);
  }
  return h.replace('<!--LINKS-->', links);
}
function withoutCalculator(html) {
  const start = html.indexOf('<section class="card grid">');
  const end = html.indexOf('<p class="muted small disclaimer">');
  return html.slice(0, start) + html.slice(end).replace('<script type="module" src="/src/main.js"></script>', '');
}
const out = [], write = (rel, html) => {
  const body = features ? html : html.replace(/<!--FEATURES-->[\s\S]*?<!--\/FEATURES-->/g, '');
  const p = path.join(R, rel);
  fs.mkdirSync(path.dirname(p), {recursive: true});
  fs.writeFileSync(p, body);
  out.push(rel);
};

for (const dir of ['sn', 'how-it-works', 'methodology', 'leaderboard', 'impressum', 'privacy']) {
  fs.rmSync(path.join(R, dir), {recursive: true, force: true});
}
fs.rmSync(path.join(R, 'public', 'og'), {recursive: true, force: true});

function featureCards(s) {
  if (!features) return '';
  const be = REF_STAKES.map(amt => `<div class="stat"><span class="muted small">${f(amt, 0)} τ staked</span><b>${esc(formatBreakEvenDays(breakEvenDays(s, amt, T)))}</b></div>`).join('');
  const safe = SLIP_BANDS.map(b => `<div class="stat"><span class="muted small">≤ ${f(b * 100, 1)}% entry slippage</span><b>${f(maxSafeStake(s, b), 2)} τ</b></div>`).join('');
  const share = `${SITE}/api/og?sn=${s.netuid}&amp;amt=${X}&amp;days=${DAYS}&amp;take=${T * 100}`;
  return `<section class="card feature"><h2>Break-even days</h2>
<p>Days for estimated emissions on this stake to cover the round trip — stake slippage plus unstake slippage — if alpha does not move against TAO. Validator take ${T * 100}%. <b>Never</b> means those emissions cannot cover the cost.</p>
<div class="stats">${be}</div></section>
<section class="card feature"><h2>Max safe stake</h2>
<p>Largest stake that keeps entry slippage at or below each limit in the current pool.</p>
<div class="stats">${safe}</div>
<p class="small"><a href="${share}">Share image</a> <span class="muted">for this subnet at ${X} τ. The image carries the subnet and stake size; est. APY, break-even days, and 30-day net TAO read PLACEHOLDER until the audit.</span></p>
</section>`;
}

const allLinks = `<section class="card"><h2>All subnets</h2><ul class="snlist">${live.map(s => `<li><a href="/sn/${s.netuid}/">SN${s.netuid} · ${esc(s.name)}</a></li>`).join('')}</ul></section>`;
for (const s of live) {
  const o = outcome(s, X, DAYS, T, 0), apy = apyAlpha(s, T) * 100, nm = `SN${s.netuid} ${s.name}`;
  const verdict = o.out >= rootEnd ? `beats root staking (≈${f(rootEnd, 1)} τ)` : `trails root staking (≈${f(rootEnd, 1)} τ)`;
  const title = `${nm} staking: real yield in TAO | AlphaCheck`;
  const desc = `${nm}: est. ${f(apy)}% APY paid in alpha, ${f(s.taoIn, 0)} τ pool. ${X} τ staked ${DAYS} days returns ≈${f(o.out, 1)} τ at a flat alpha price after slippage (data ${date}).`;
  const hero = `<section class="hero"><h1>${esc(nm)}: is the APY real?</h1><p class="summary">As of ${date} (block ${d.block}), subnet ${s.netuid} (${esc(s.name)}) shows an estimated <b>${f(apy)}% APY</b>, paid in its alpha token. The pool holds <b>${f(s.taoIn, 0)} τ</b>, so staking ${X} τ costs about <b>${f(o.entrySlip * 100, 2)}%</b> in entry slippage. Held ${DAYS} days at a flat alpha price and with ${T * 100}% validator take, you'd get back about <b>${f(o.out, 2)} τ</b> after exit slippage, which ${verdict}. Change the inputs below to check your own case.</p></section>${featureCards(s)}`;
  write(`sn/${s.netuid}/index.html`, page({url: `/sn/${s.netuid}/`, title, desc, ogTitle: `${nm}: High APY ≠ profit`, hero, sn: s.netuid, links: allLinks}));
}

const how = `<section class="hero"><h1>How AlphaCheck calculates returns</h1><p>Every number on AlphaCheck comes from one on-chain snapshot of the Bittensor Finney chain, refreshed daily. Current data: ${date}, block ${d.block}.</p></section>
<section class="card"><h2>1. Data</h2><p>For each subnet we read the pool's TAO reserve (<code>taoIn</code>), alpha reserve (<code>alphaIn</code>), alpha held by stakers (<code>alphaOut</code>), alpha emitted per block, and the root proportion, from <code>subtensorModule</code> storage via the public OpenTensor RPC. Source: ${esc(d.source)}.</p></section>
<section class="card"><h2>2. Alpha price</h2><p>price = taoIn ÷ alphaIn (TAO per alpha).</p></section>
<section class="card"><h2>3. Estimated subnet APY (paid in alpha)</h2><p>APY = alpha emission per block × 0.41 (validator/staker share) × (1 − root proportion) × (1 − validator take) × 7,200 blocks/day × 365 ÷ alphaOut.</p></section>
<section class="card"><h2>4. Estimated root APY (paid in TAO)</h2><p>Sum over subnets of: alpha emission per block × 0.41 × root proportion × alpha price, then × (1 − take) × blocks per year ÷ total root stake.</p></section>
<section class="card"><h2>5. Slippage (x·y = k)</h2><p>Entering: alpha received = alphaIn − k ÷ (taoIn + TAO in), with k = taoIn × alphaIn. Exiting: we first move the pool to the scenario price (−50%, −20%, flat, +20%) keeping k constant, then TAO out = T − k ÷ (A + alpha sold).</p></section>
<section class="card"><h2>6. Holding period</h2><p>Rewards accrue as simple (non-compounded) interest over the days you choose. Real yields vary by validator and change every block, so treat results as rough estimates. Not financial advice.</p></section>
<p><a href="/">← Back to the calculator</a></p>`;
fs.mkdirSync(path.join(R, 'how-it-works'), {recursive: true});
write('how-it-works/index.html', withoutCalculator(page({
  url: '/how-it-works/',
  title: "How it's calculated | AlphaCheck",
  desc: 'The exact formulas AlphaCheck uses for Bittensor subnet and root staking APY, alpha price, and AMM slippage.',
  ogTitle: 'How AlphaCheck calculates real yield',
  hero: how,
})));

const methodology = fs.readFileSync(path.join(R, 'content/methodology.html'), 'utf8');
write('methodology/index.html', withoutCalculator(page({
  url: '/methodology/',
  title: 'Methodology | AlphaCheck',
  desc: 'Assumptions, data sources, and formula sections for AlphaCheck. Estimates, not financial advice.',
  ogTitle: 'AlphaCheck methodology',
  hero: methodology,
})));

write('impressum/index.html', withoutCalculator(page({
  url: '/impressum/',
  title: 'Impressum | AlphaCheck',
  desc: 'Draft legal notice for AlphaCheck. Not published.',
  ogTitle: 'Impressum',
  hero: fs.readFileSync(path.join(R, 'content/impressum.html'), 'utf8'),
  robots: 'noindex, nofollow',
  lang: 'de',
})));
write('privacy/index.html', withoutCalculator(page({
  url: '/privacy/',
  title: 'Datenschutzerklärung | AlphaCheck',
  desc: 'Draft privacy notice for AlphaCheck. Not published.',
  ogTitle: 'Datenschutzerklärung',
  hero: fs.readFileSync(path.join(R, 'content/privacy.html'), 'utf8'),
  robots: 'noindex, nofollow',
  lang: 'de',
})));

if (features) {
  const buttons = REF_STAKES.map(amount => `<button type="button" data-stake="${amount}" aria-pressed="${amount === 100 ? 'true' : 'false'}">${f(amount, 0)} TAO</button>`).join('');
  const panels = REF_STAKES.map(amount => {
    const rows = live.map(s => ({
      s,
      net: outcome(s, amount, 30, T, 0).out - amount,
      apy: apyAlpha(s, T),
      be: breakEvenDays(s, amount, T),
    })).sort((a, b) => (b.net - a.net) || (a.s.netuid - b.s.netuid));
    const body = rows.map(r => `<tr><td><a href="/sn/${r.s.netuid}/">SN${r.s.netuid} · ${esc(r.s.name)}</a></td><td>${f(r.s.taoIn, 0)}</td><td>${f(r.apy * 100, 1)}%</td><td>${(r.net >= 0 ? '+' : '') + f(r.net, 2)} τ</td><td>${esc(formatBreakEvenDays(r.be))}</td></tr>`).join('');
    return `<div data-panel="${amount}"${amount === 100 ? '' : ' hidden'}><div class="tablewrap"><table><tr><th>Subnet</th><th>Pool τ</th><th>Est. APY</th><th>Est. 30-day net TAO</th><th>Break-even</th></tr>${body}</table></div></div>`;
  }).join('');
  const hero = `<section class="hero"><h1>Leaderboard</h1><p>Subnets ordered by estimated net TAO after 30 days at a flat alpha price, including entry and exit slippage. Choose a stake size. Validator take ${T * 100}%. The order is a sort of estimates, not a recommendation.</p></section>
<section class="card"><div class="toggles" role="group" aria-label="Stake size">${buttons}</div>${panels}
<p class="muted small">0% alpha change. Net TAO is TAO returned minus TAO staked. Each name links to that subnet's page. Estimates, not financial advice.</p></section>
<script>
document.querySelectorAll('.toggles button').forEach(function(btn){
  btn.addEventListener('click', function(){
    var stake=btn.getAttribute('data-stake');
    document.querySelectorAll('.toggles button').forEach(function(b){b.setAttribute('aria-pressed', b===btn?'true':'false')});
    document.querySelectorAll('[data-panel]').forEach(function(p){p.hidden=p.getAttribute('data-panel')!==stake});
  });
});
</script>`;
  write('leaderboard/index.html', withoutCalculator(page({
    url: '/leaderboard/',
    title: 'Leaderboard | AlphaCheck',
    desc: 'Subnets ordered by estimated 30-day net TAO at a flat alpha price, for stakes of 10, 100, and 1,000 TAO.',
    ogTitle: 'AlphaCheck leaderboard',
    hero,
  })));

  const ogDir = path.join(R, 'public', 'og', 'sn');
  fs.mkdirSync(ogDir, {recursive: true});
  for (const s of live) {
    fs.writeFileSync(path.join(ogDir, `${s.netuid}.svg`), renderOgSvg({title: `SN${s.netuid} · ${s.name}`, stakeLabel: `${X} TAO`, days: DAYS, take: T * 100}));
  }
  fs.writeFileSync(path.join(R, 'public', 'og', 'calc.svg'), renderOgSvg({title: 'Your calculation', stakeLabel: 'PLACEHOLDER'}));
}

fs.mkdirSync(path.join(R, 'api'), {recursive: true});
fs.writeFileSync(path.join(R, 'api', 'subnet-names.json'), JSON.stringify(Object.fromEntries(S.map(s => [s.netuid, s.name]))));

const urls = ['/', '/how-it-works/', '/methodology/', ...live.map(s => `/sn/${s.netuid}/`), ...(features ? ['/leaderboard/'] : [])];
fs.writeFileSync(path.join(R, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${date}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(R, 'public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(R, '.pages.json'), JSON.stringify(['index.html', ...out]));
console.log(`generated ${out.length} pages, sitemap ${urls.length} urls, features ${features ? 'on' : 'off'}`);
