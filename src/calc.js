// Shared math (browser + build-time page generator). Same formulas as the calculator.
export const BPY=7200*365, STAKER=0.41, SC=[-0.5,-0.2,0,0.2];
export const price=s=>s.taoIn/s.alphaIn;
export const apyAlpha=(s,t)=>s.alphaOut?s.alphaEmissionPerBlock*STAKER*(1-s.rootProp)*(1-t)*BPY/s.alphaOut:0;
export const apyRoot=(S,t)=>{const root=S.find(s=>s.netuid===0);return S.filter(s=>s.netuid).reduce((a,s)=>a+s.alphaEmissionPerBlock*STAKER*s.rootProp*price(s),0)*(1-t)*BPY/root.taoIn};
export const buy=(s,x)=>s.alphaIn-s.taoIn*s.alphaIn/(s.taoIn+x);
export const sell=(T,A,a)=>T-T*A/(A+a);
// TAO back after `days` if alpha/TAO moves by c (e.g. 0 = flat), after entry+exit slippage
export function outcome(s,X,days,t,c=0){const P=price(s),aGot=buy(s,X),aEnd=aGot*(1+apyAlpha(s,t)*days/365),k=s.taoIn*s.alphaIn,T=Math.sqrt(k*P*(1+c)),A=k/T;
 return {P,aGot,aEnd,entrySlip:1-aGot/(X/P),ideal:aEnd*P*(1+c),out:sell(T,A,aEnd)}}
