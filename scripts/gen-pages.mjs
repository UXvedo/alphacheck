// Build-time generator: per-subnet pages, how-it-works, methodology, sitemap, robots.
// Flagged pages (leaderboard, share images) are emitted only when the feature flag is on.
// Numbers come from public/snapshot.json via src/swap-math.js (same math as the calculator).
import fs from 'node:fs';
import path from 'node:path';
import {apyAlpha, apyRoot, outcome, breakEvenDays, maxSafeStake, REF_STAKES, SLIP_BANDS, takeOf, growth} from '../src/swap-math.js';
import {featuresEnabled, engagementFlags, stripFlagged} from '../src/features.js';
import {formatBreakEvenDays} from '../src/format.js';
import {renderOgSvg} from '../src/og-template.js';
import {shareCard} from '../src/og-metrics.js';

const SITE = 'https://www.alphacheck.io', R = path.resolve(import.meta.dirname, '..');
const features = featuresEnabled(process.env);
const flags = engagementFlags(process.env);
const star = s => `<!--F:watchlist--><button type="button" class="star" data-star="${s.netuid}" data-name="SN${s.netuid} ${esc(s.name)}" aria-pressed="false" aria-label="Add SN${s.netuid} to watchlist">☆</button><!--/F:watchlist-->`;
const d = JSON.parse(fs.readFileSync(path.join(R, 'public/snapshot.json'), 'utf8')), S = d.subnets;
const tpl = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
const esc = x => String(x).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const f = (x, n = 1) => x.toLocaleString('en-US', {maximumFractionDigits: n, minimumFractionDigits: n});
const date = d.asOf.slice(0, 10), X = 100, DAYS = 90;
const rootSubnet = S.find(s => s.netuid === 0);
const rootApy = apyRoot(S);
const rootEnd = X * growth(rootSubnet, rootApy, DAYS);
const takePct = s => takeOf(s) * 100;
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
  const body = stripFlagged(features ? html : html.replace(/<!--FEATURES-->[\s\S]*?<!--\/FEATURES-->/g, ''), flags);
  const p = path.join(R, rel);
  fs.mkdirSync(path.dirname(p), {recursive: true});
  fs.writeFileSync(p, body);
  out.push(rel);
};

for (const dir of ['sn', 'how-it-works', 'methodology', 'leaderboard', 'impressum', 'contact', 'privacy', 'compare']) {
  fs.rmSync(path.join(R, dir), {recursive: true, force: true});
}
fs.rmSync(path.join(R, 'public', 'og'), {recursive: true, force: true});

function featureCards(s) {
  if (!features) return '';
  const t = takeOf(s);
  const be = REF_STAKES.map(amt => `<div class="stat"><span class="muted small">${f(amt, 0)} τ staked</span><b>${esc(formatBreakEvenDays(breakEvenDays(s, amt, t)))}</b></div>`).join('');
  const safe = SLIP_BANDS.map(b => `<div class="stat"><span class="muted small">≤ ${f(b * 100, 1)}% entry slippage</span><b>${f(maxSafeStake(s, b), 2)} τ</b></div>`).join('');
  const share = `${SITE}/api/og?sn=${s.netuid}&amp;amt=${X}&amp;days=${DAYS}&amp;take=${takePct(s)}`;
  return `<section class="card feature"><h2>Break-even days</h2>
<p>Days for estimated emissions on this stake to cover the round trip — stake slippage plus unstake slippage — if alpha does not move against TAO. Stake-weighted validator take ${f(takePct(s), 2)}%. <b>Never</b> means those emissions cannot cover the cost.</p>
<div class="stats">${be}</div></section>
<section class="card feature"><h2>Max safe stake</h2>
<p>Largest stake that keeps entry slippage at or below each limit in the current pool.</p>
<div class="stats">${safe}</div>
<p class="small"><a href="${share}">Share image</a> <span class="muted">for this subnet at ${X} τ, with the estimated APY, break-even days, and 30-day net TAO filled in.</span></p>
</section>`;
}

const allLinks = `<section class="card"><h2>All subnets</h2><ul class="snlist" data-watch-sort>${live.map(s => `<li data-sn="${s.netuid}">${star(s)}<a href="/sn/${s.netuid}/">SN${s.netuid} · ${esc(s.name)}</a></li>`).join('')}</ul></section>`;
for (const s of live) {
  const t = takeOf(s);
  const o = outcome(s, X, DAYS, t, 0), apy = apyAlpha(s, t) * 100, nm = `SN${s.netuid} ${s.name}`;
  const verdict = o.out >= rootEnd ? `beats root staking (≈${f(rootEnd, 1)} τ)` : `trails root staking (≈${f(rootEnd, 1)} τ)`;
  const title = `${nm} staking: real yield in TAO | AlphaCheck`;
  const desc = `${nm}: est. ${f(apy)}% APY paid in alpha, ${f(s.taoIn, 0)} τ pool. ${X} τ staked ${DAYS} days returns ≈${f(o.out, 1)} τ at a flat alpha price after slippage (data ${date}).`;
  const hero = `<section class="hero"><h1>${esc(nm)}: is the APY real?</h1>${star(s).replace('class="star"', 'class="star star-lg"')}<!--F:compare--><p class="small"><a href="/compare/?a=${s.netuid}&amp;b=${s.netuid === 64 ? 19 : 64}&amp;stake=${X}&amp;days=30">Compare SN${s.netuid} with another subnet</a></p><!--/F:compare--><p class="summary">As of ${date} (block ${d.block}), subnet ${s.netuid} (${esc(s.name)}) shows an estimated <b>${f(apy)}% APY</b>, paid in its alpha token, at a stake-weighted validator take of ${f(takePct(s), 2)}%. The pool holds <b>${f(s.taoIn, 0)} τ</b>, so staking ${X} τ costs about <b>${f(o.entrySlip * 100, 2)}%</b> in entry slippage. Held ${DAYS} days at a flat alpha price, with epoch compounding, you'd get back about <b>${f(o.out, 2)} τ</b> after the swap fee and exit slippage, which ${verdict}. Change the inputs below to check your own case.</p></section>${featureCards(s)}`;
  write(`sn/${s.netuid}/index.html`, page({url: `/sn/${s.netuid}/`, title, desc, ogTitle: `${nm}: High APY ≠ profit`, hero, sn: s.netuid, links: allLinks}));
}

const how = `<section class="hero"><h1>How AlphaCheck calculates returns</h1><p>Every number on AlphaCheck comes from one on-chain snapshot of the Bittensor Finney chain, refreshed daily. Current data: ${date}, block ${d.block}. The full formulas, assumptions, and sources are on <a href="/methodology/">Methodology</a>.</p></section>
<section class="card"><h2>1. Data</h2><p>For each subnet we read the pool TAO reserve (<code>taoIn</code>), pool alpha reserve (<code>alphaIn</code>), alpha outstanding (<code>alphaOut</code>), staked alpha (<code>totalAlphaStaked</code>), alpha emitted per block, root proportion, tempo, SwapBalancer quote weight, FeeRate, and Delegates takes, from <code>subtensorModule</code> and <code>swap</code> storage via the public OpenTensor RPC. Source: ${esc(d.source)}.</p></section>
<section class="card"><h2>2. Alpha price</h2><p>price = (base weight ÷ quote weight) × (taoIn ÷ alphaIn). When the weights are equal, price = taoIn ÷ alphaIn (TAO per alpha).</p></section>
<section class="card"><h2>3. Estimated subnet APY (paid in alpha)</h2><p>APY = alpha emission per block × 0.41 (validator/staker share) × (1 − root proportion) × (1 − validator take) × 7,200 blocks/day × 365 ÷ staked alpha. The published figure uses that subnet's stake-weighted average take.</p></section>
<section class="card"><h2>4. Estimated root APY (paid in TAO)</h2><p>Each subnet contributes one epoch of root alpha: emission × 0.41 × root proportion × (1 − that subnet's take) × (tempo + 1). That alpha is sold through the subnet pool, so the swap fee and slippage come off, and the TAO is annualized and divided by root stake.</p></section>
<section class="card"><h2>5. Slippage and the swap fee</h2><p>The pool is a weighted balancer. At equal weights the buy and sell match constant-product math (TAO × alpha = k). FeeRate ÷ 65535 (about 0.05%) is charged on the way in and on the way out. Exit reserves are rebuilt at the scenario price (−50%, −20%, flat, +20%) while the weighted invariant stays fixed.</p></section>
<section class="card"><h2>6. Holding period</h2><p>Rewards compound once per epoch. Epochs per year are 7,200 × 365 ÷ (tempo + 1), about 7,280 when tempo is 360. Real yields vary by validator and change every block, so treat results as rough estimates. Not financial advice.</p></section>
<p><a href="/">← Back to the calculator</a> · <a href="/methodology/">Methodology</a></p>`;
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

write('contact/index.html', withoutCalculator(page({
  url: '/contact/',
  title: 'Contact | AlphaCheck',
  desc: 'Contact AlphaCheck by email: alphacheck-dev@proton.me.',
  ogTitle: 'Contact AlphaCheck',
  hero: fs.readFileSync(path.join(R, 'content/contact.html'), 'utf8'),
})));
write('privacy/index.html', withoutCalculator(page({
  url: '/privacy/',
  title: 'Privacy policy | AlphaCheck',
  desc: 'What AlphaCheck processes: no accounts, no ads, no cookies. Vercel hosting and cookieless analytics, Buttondown newsletter.',
  ogTitle: 'AlphaCheck privacy policy',
  hero: fs.readFileSync(path.join(R, 'content/privacy.html'), 'utf8'),
})));

if (features) {
  const buttons = REF_STAKES.map(amount => `<button type="button" data-stake="${amount}" aria-pressed="${amount === 100 ? 'true' : 'false'}">${f(amount, 0)} TAO</button>`).join('');
  const panels = REF_STAKES.map(amount => {
    const rows = live.map(s => {
      const t = takeOf(s);
      return {
        s,
        net: outcome(s, amount, 30, t, 0).out - amount,
        apy: apyAlpha(s, t),
        be: breakEvenDays(s, amount, t),
      };
    }).sort((a, b) => (b.net - a.net) || (a.s.netuid - b.s.netuid));
    const body = rows.map(r => `<tr data-sn="${r.s.netuid}"><td>${star(r.s)}<a href="/sn/${r.s.netuid}/">SN${r.s.netuid} · ${esc(r.s.name)}</a></td><td>${f(r.s.taoIn, 0)}</td><td>${f(r.apy * 100, 1)}%</td><td>${(r.net >= 0 ? '+' : '') + f(r.net, 2)} τ</td><td>${esc(formatBreakEvenDays(r.be))}</td></tr>`).join('');
    return `<div data-panel="${amount}"${amount === 100 ? '' : ' hidden'}><div class="tablewrap"><table><tbody data-watch-sort><tr><th>Subnet</th><th>Pool τ</th><th>Est. APY</th><th>Est. 30-day net TAO</th><th>Break-even</th></tr>${body}</tbody></table></div></div>`;
  }).join('');
  const hero = `<section class="hero"><h1>Leaderboard</h1><p>Subnets ordered by estimated net TAO after 30 days at a flat alpha price, including entry and exit slippage and the swap fee. Choose a stake size. Each row uses that subnet's stake-weighted average validator take. The order is a sort of estimates, not a recommendation.</p></section>
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
    fs.writeFileSync(path.join(ogDir, `${s.netuid}.svg`), renderOgSvg(shareCard(d, {netuid: s.netuid, amt: X, take: takeOf(s)})));
  }
  fs.writeFileSync(path.join(R, 'public', 'og', 'calc.svg'), renderOgSvg(shareCard(d, {netuid: 64, amt: X})));
}

if (flags.compare) {
  const hero = `<section class="hero"><h1>Compare two subnets</h1><p>Same stake, same holding period, side by side. Estimates at a flat alpha price, using each subnet's stake-weighted validator take.</p></section>
<section class="card grid" aria-label="Compare inputs">
 <label>Subnet A<select id="ca"></select></label>
 <label>Subnet B<select id="cb"></select></label>
 <label>Stake (TAO)<input id="cstake" type="number" value="100" min="0.01" step="any" inputmode="decimal"></label>
 <label>Holding period (days)<input id="cdays" type="number" value="30" min="1" max="3650"></label>
</section>
<p class="small actions"><button type="button" id="cswap" class="ghost">Swap A and B</button> <button type="button" id="ccopy" class="ghost">Copy link to this comparison</button></p>
<section class="card" id="cout" aria-live="polite"></section>
<p class="muted small">Green marks the better value on that row. Not a recommendation. See <a href="/methodology/">Methodology</a>.</p>
<script type="module" src="/src/compare.js"></script>`;
  write('compare/index.html', withoutCalculator(page({
    url: '/compare/',
    title: 'Compare subnets | AlphaCheck',
    desc: 'Compare two Bittensor subnets side by side: APY, entry slippage, break-even days and TAO back for the same stake.',
    ogTitle: 'Compare subnets on AlphaCheck',
    hero,
    robots: 'noindex',
  })));
}

fs.mkdirSync(path.join(R, 'api'), {recursive: true});
fs.writeFileSync(path.join(R, 'api', 'subnet-names.json'), JSON.stringify(Object.fromEntries(S.map(s => [s.netuid, s.name]))));

const urls = ['/', '/how-it-works/', '/methodology/', '/contact/', '/privacy/', ...live.map(s => `/sn/${s.netuid}/`), ...(features ? ['/leaderboard/'] : [])];
fs.writeFileSync(path.join(R, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${date}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(R, 'public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(R, '.pages.json'), JSON.stringify(['index.html', ...out]));
console.log(`generated ${out.length} pages, sitemap ${urls.length} urls, features ${features ? 'on' : 'off'}`);
