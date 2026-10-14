// Pulls a live snapshot from the public Bittensor (Finney) RPC. No API key needed.
import {ApiPromise,WsProvider} from '@polkadot/api';
import fs from 'fs';
import {writeDailyHistory} from './history.mjs';
const RPC='wss://entrypoint-finney.opentensor.ai:443';
const api=await ApiPromise.create({provider:new WsProvider(RPC),noInitWarn:true});
const q=api.query.subtensorModule;
const ent=async k=>Object.fromEntries((await q[k].entries()).map(([key,v])=>[key.args[0].toNumber(),v]));
const [tao,ain,aout,aemit,rprop,ids,head]=await Promise.all([ent('subnetTAO'),ent('subnetAlphaIn'),ent('subnetAlphaOut'),ent('subnetAlphaOutEmission'),ent('rootProp'),ent('subnetIdentitiesV3'),api.rpc.chain.getHeader()]);
const num=v=>Number(BigInt(v.toString()))/1e9;
const fix=v=>{try{return Number(BigInt(v.toJSON().bits))/2**32}catch{return Number(v.toString())/1e18}};
const subnets=Object.keys(tao).map(Number).sort((a,b)=>a-b).map(n=>{const id=ids[n]?.toHuman?.()||{};
 return {netuid:n,name:n===0?'Root':(id.subnetName||'').trim()||`Subnet ${n}`,taoIn:num(tao[n]),alphaIn:ain[n]?num(ain[n]):0,alphaOut:aout[n]?num(aout[n]):0,alphaEmissionPerBlock:aemit[n]?num(aemit[n]):0,rootProp:rprop[n]?fix(rprop[n]):0}});
const snapshot={asOf:new Date().toISOString(),block:head.number.toNumber(),source:`Bittensor Finney chain, public RPC ${RPC} (subtensorModule storage)`,subnets};
fs.writeFileSync('public/snapshot.json',JSON.stringify(snapshot,null,1));
const hist=writeDailyHistory(snapshot);
console.log(subnets.length,'subnets; sample',subnets.slice(0,3));
console.log('history',hist.date,hist.file);
process.exit(0);
