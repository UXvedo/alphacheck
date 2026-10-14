// Build-time generator: per-subnet pages, how-it-works page, sitemap, robots. Run before `vite build`.
// All numbers come from public/snapshot.json via src/calc.js (same math as the calculator).
import fs from 'node:fs';import path from 'node:path';
import {price,apyAlpha,apyRoot,outcome} from '../src/calc.js';
const SITE='https://www.alphacheck.io', R=path.resolve(import.meta.dirname,'..');
const d=JSON.parse(fs.readFileSync(path.join(R,'public/snapshot.json'),'utf8')), S=d.subnets;
const tpl=fs.readFileSync(path.join(R,'index.html'),'utf8');
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const f=(x,n=1)=>x.toLocaleString('en-US',{maximumFractionDigits:n,minimumFractionDigits:n});
const date=d.asOf.slice(0,10), X=100, DAYS=90, T=0.18;
const rootEnd=X*(1+apyRoot(S,T)*DAYS/365);
const live=S.filter(s=>s.netuid!==0&&s.taoIn>0).sort((a,b)=>a.netuid-b.netuid);
const between=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b)+b.length);
function page({url,title,desc,ogTitle,hero,sn='',links=''}){
 let h=tpl.replace(between(tpl,'<!--HEAD-->','<!--/HEAD-->'),`<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta property="og:title" content="${esc(ogTitle||title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${url}">`).replace('<body data-sn="">',`<body data-sn="${sn}">`);
 if(hero!=null)h=h.replace(between(h,'<!--HERO-->','<!--/HERO-->'),hero);
 return h.replace('<!--LINKS-->',links)}
const out=[], write=(rel,html)=>{const p=path.join(R,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,html);out.push(rel)};
fs.rmSync(path.join(R,'sn'),{recursive:true,force:true});
const allLinks=`<section class="card"><h2>All subnets</h2><ul class="snlist">${live.map(s=>`<li><a href="/sn/${s.netuid}/">SN${s.netuid} · ${esc(s.name)}</a></li>`).join('')}</ul></section>`;
for(const s of live){
 const o=outcome(s,X,DAYS,T,0), apy=apyAlpha(s,T)*100, nm=`SN${s.netuid} ${s.name}`;
 const verdict=o.out>=rootEnd?`beats root staking (≈${f(rootEnd,1)} τ)`:`trails root staking (≈${f(rootEnd,1)} τ)`;
 const title=`${nm} staking: real yield in TAO | AlphaCheck`;
 const desc=`${nm}: est. ${f(apy)}% APY paid in alpha, ${f(s.taoIn,0)} τ pool. ${X} τ staked ${DAYS} days returns ≈${f(o.out,1)} τ at a flat alpha price after slippage (data ${date}).`;
 const hero=`<section class="hero"><h1>${esc(nm)}: is the APY real?</h1><p class="summary">As of ${date} (block ${d.block}), subnet ${s.netuid} (${esc(s.name)}) shows an estimated <b>${f(apy)}% APY</b>, paid in its alpha token. The pool holds <b>${f(s.taoIn,0)} τ</b>, so staking ${X} τ costs about <b>${f(o.entrySlip*100,2)}%</b> in entry slippage. Held ${DAYS} days at a flat alpha price and with ${T*100}% validator take, you'd get back about <b>${f(o.out,2)} τ</b> after exit slippage, which ${verdict}. Change the inputs below to check your own case.</p></section>`;
 write(`sn/${s.netuid}/index.html`,page({url:`/sn/${s.netuid}/`,title,desc,ogTitle:`${nm}: High APY ≠ profit`,hero,sn:s.netuid,links:allLinks}));
}
// How it's calculated
const how=`<section class="hero"><h1>How AlphaCheck calculates returns</h1><p>Every number on AlphaCheck comes from one on-chain snapshot of the Bittensor Finney chain, refreshed daily. Current data: ${date}, block ${d.block}.</p></section>
<section class="card"><h2>1. Data</h2><p>For each subnet we read the pool's TAO reserve (<code>taoIn</code>), alpha reserve (<code>alphaIn</code>), alpha held by stakers (<code>alphaOut</code>), alpha emitted per block, and the root proportion, from <code>subtensorModule</code> storage via the public OpenTensor RPC. Source: ${esc(d.source)}.</p></section>
<section class="card"><h2>2. Alpha price</h2><p>price = taoIn ÷ alphaIn (TAO per alpha).</p></section>
<section class="card"><h2>3. Estimated subnet APY (paid in alpha)</h2><p>APY = alpha emission per block × 0.41 (validator/staker share) × (1 − root proportion) × (1 − validator take) × 7,200 blocks/day × 365 ÷ alphaOut.</p></section>
<section class="card"><h2>4. Estimated root APY (paid in TAO)</h2><p>Sum over subnets of: alpha emission per block × 0.41 × root proportion × alpha price, then × (1 − take) × blocks per year ÷ total root stake.</p></section>
<section class="card"><h2>5. Slippage (x·y = k)</h2><p>Entering: alpha received = alphaIn − k ÷ (taoIn + TAO in), with k = taoIn × alphaIn. Exiting: we first move the pool to the scenario price (−50%, −20%, flat, +20%) keeping k constant, then TAO out = T − k ÷ (A + alpha sold).</p></section>
<section class="card"><h2>6. Holding period</h2><p>Rewards accrue as simple (non-compounded) interest over the days you choose. Real yields vary by validator and change every block, so treat results as rough estimates. Not financial advice.</p></section>
<p><a href="/">← Back to the calculator</a></p>`;
let hp=page({url:'/how-it-works/',title:"How it's calculated | AlphaCheck",desc:'The exact formulas AlphaCheck uses for Bittensor subnet and root staking APY, alpha price, and AMM slippage.',ogTitle:"How AlphaCheck calculates real yield",hero:how});
hp=hp.slice(0,hp.indexOf('<section class="card grid">'))+hp.slice(hp.indexOf('<p class="muted small disclaimer">')).replace(/<script type="module"[^>]*><\/script>/,'');
fs.rmSync(path.join(R,'how-it-works'),{recursive:true,force:true});write('how-it-works/index.html',hp);
// sitemap + robots
const urls=['/','/how-it-works/',...live.map(s=>`/sn/${s.netuid}/`)];
fs.writeFileSync(path.join(R,'public/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${SITE}${u}</loc><lastmod>${date}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(R,'public/robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(R,'.pages.json'),JSON.stringify(['index.html',...out]));
console.log(`generated ${out.length} pages, sitemap ${urls.length} urls`);
