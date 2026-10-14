import {loadData} from './data.js';
const BPY=7200*365, STAKER=0.41, SC=[-0.5,-0.2,0,0.2];
const d=await loadData(), S=d.subnets, root=S.find(s=>s.netuid===0);
const $=id=>document.getElementById(id), f=(x,n=2)=>x.toLocaleString(undefined,{maximumFractionDigits:n,minimumFractionDigits:n}), p=x=>(x>=0?'+':'')+f(x*100,1)+'%';
const price=s=>s.taoIn/s.alphaIn;
const apyAlpha=(s,t)=>s.alphaOut?s.alphaEmissionPerBlock*STAKER*(1-s.rootProp)*(1-t)*BPY/s.alphaOut:0;
const apyRoot=t=>S.filter(s=>s.netuid).reduce((a,s)=>a+s.alphaEmissionPerBlock*STAKER*s.rootProp*price(s),0)*(1-t)*BPY/root.taoIn;
const buy=(s,x)=>s.alphaIn-s.taoIn*s.alphaIn/(s.taoIn+x);            // TAO -> alpha (x*y=k)
const sell=(T,A,a)=>T-T*A/(A+a);                                       // alpha -> TAO
const opts=S.filter(s=>s.netuid===0||s.taoIn>0).map(s=>`<option value="${s.netuid}">${s.netuid} · ${s.name}</option>`);
$('sn').innerHTML=opts.join('');$('sn').value=S.some(s=>s.netuid===64)?'64':'1';
function run(){
 const s=S.find(x=>x.netuid==$('sn').value), X=+$('amt').value||0, days=+$('days').value||0, t=(+$('take').value||0)/100, yr=days/365;
 const rA=apyRoot(t), rootEnd=X*(1+rA*yr);
 let html=`<p class="muted small">Data as of <b>${new Date(d.asOf).toLocaleString()}</b> (block ${d.block}) · ${d.source}. Estimates, not live.</p>`;
 if(s.netuid===0){html+=`<div class="card"><h2>Root staking</h2><div class="stats"><div class="stat"><span class="muted small">Est. APY (paid in TAO)</span><b>${f(rA*100,1)}%</b></div><div class="stat"><span class="muted small">After ${days} days</span><b>${f(rootEnd,3)} τ</b></div><div class="stat"><span class="muted small">Price risk / slippage</span><b>None</b></div></div></div>`;return $('out').innerHTML=html}
 const P=price(s), aA=apyAlpha(s,t), aGot=buy(s,X), entrySlip=1-aGot/(X/P), aEnd=aGot*(1+aA*yr);
 const k=s.taoIn*s.alphaIn;
 const rows=SC.map(c=>{const T=Math.sqrt(k*P*(1+c)),A=k/T, out=sell(T,A,aEnd), ideal=aEnd*P*(1+c), net=out-X;
  return `<tr><td>Alpha ${p(c)} vs TAO</td><td>${f(ideal,3)}</td><td>${f(out,3)}</td><td class="${net>=0?'pos':'neg'}">${(net>=0?'+':'')+f(net,3)} τ (${p(net/X)})</td><td class="${out>=rootEnd?'pos':'neg'}">${out>=rootEnd?'beats':'loses to'} root</td></tr>`}).join('');
 html+=`<div class="card"><h2>SN${s.netuid} · ${s.name}</h2><div class="stats">
 <div class="stat"><span class="muted small">Est. APY (paid in alpha)</span><b>${f(aA*100,1)}%</b></div>
 <div class="stat"><span class="muted small">Alpha price</span><b>${f(P,5)} τ</b></div>
 <div class="stat"><span class="muted small">Pool liquidity</span><b>${f(s.taoIn,0)} τ</b></div>
 <div class="stat"><span class="muted small">Entry slippage</span><b class="${entrySlip>0.01?'warn':''}">${f(entrySlip*100,2)}%</b></div>
 <div class="stat"><span class="muted small">Alpha after ${days}d</span><b>${f(aEnd,2)}</b></div></div></div>
 <div class="card"><h2>What you'd get back in TAO</h2><div class="tablewrap"><table><tr><th>Scenario</th><th>Value at spot</th><th>After exit slippage</th><th>Net vs ${f(X,2)} τ in</th><th>vs root</th></tr>${rows}</table></div>
 <p class="muted small">Root staking the same ${f(X,2)} τ for ${days} days ≈ <b>${f(rootEnd,3)} τ</b> (est. ${f(rA*100,1)}% APY, paid in TAO, no slippage). Rewards use simple (non-compounded) interest; alpha emission rates and pool prices will change.</p></div>`;
 $('out').innerHTML=html}
['sn','amt','days','take'].forEach(i=>$(i).addEventListener('input',run));run();
