// Pulls a live snapshot from the public Bittensor (Finney) RPC. No API key needed.
import {ApiPromise, WsProvider} from '@polkadot/api';
import fs from 'fs';
import {writeDailyHistory} from './history.mjs';
import {writeComparison, comparisonMarkdown} from './compare-apy.mjs';

const RPC = 'wss://entrypoint-finney.opentensor.ai:443';
const api = await ApiPromise.create({provider: new WsProvider(RPC), noInitWarn: true});
const q = api.query.subtensorModule;
const swap = api.query.swap;
const ent = async (query, k) => Object.fromEntries((await query[k].entries()).map(([key, v]) => [key.args.map(a => a.toString()).join('\0'), v]));
const num = v => Number(BigInt(v.toString())) / 1e9;
const fix = v => {try {return Number(BigInt(v.toJSON().bits)) / 2 ** 32} catch {return Number(v.toString()) / 1e18}};
const quoteW = v => {
  try {
    const w = Number(BigInt(v.toJSON().quote)) / 1e18;
    if (w > 0 && w < 1) return w;
  } catch { /* default below */ }
  return 0.5;
};

const [tao, ain, aout, aemit, rprop, ids, head, staked, tempo, fees, weights, delegates, hotkeyAlpha, dividends, taoEmit] = await Promise.all([
  ent(q, 'subnetTAO'), ent(q, 'subnetAlphaIn'), ent(q, 'subnetAlphaOut'), ent(q, 'subnetAlphaOutEmission'), ent(q, 'rootProp'), ent(q, 'subnetIdentitiesV3'), api.rpc.chain.getHeader(),
  ent(q, 'totalAlphaStaked'), ent(q, 'tempo'), ent(swap, 'feeRate'), ent(swap, 'swapBalancer'), ent(q, 'delegates'), ent(q, 'totalHotkeyAlpha'), ent(q, 'alphaDividendsPerSubnet'),
  // Optional: older runtimes may lack it; the emission fields are then omitted (backward-compatible).
  q.subnetTaoInEmission ? ent(q, 'subnetTaoInEmission').catch(() => ({})) : Promise.resolve({}),
]);
const taoEmitTotal = Object.entries(taoEmit).filter(([k]) => k !== '0').reduce((a, [, v]) => a + num(v), 0);

const u16 = v => {
  const s = v?.toString?.() ?? '';
  if (s.startsWith('0x')) return Number(BigInt(s));
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};
const isNet = s => /^\d{1,4}$/.test(s);
const takeByHotkey = new Map(Object.entries(delegates).map(([hk, v]) => [hk, u16(v) / 65535]));
const stakeByNet = new Map();
const divByNet = new Map();
for (const [key, v] of Object.entries(hotkeyAlpha)) {
  const [a, b] = key.split('\0');
  const net = isNet(b) && !isNet(a) ? b : isNet(a) && !isNet(b) ? a : b;
  const hk = net === a ? b : a;
  const alpha = num(v);
  if (!(alpha > 0) || !hk) continue;
  if (!stakeByNet.has(net)) stakeByNet.set(net, []);
  stakeByNet.get(net).push({hotkey: hk, alpha, take: takeByHotkey.get(hk) ?? 0});
}
for (const [key, v] of Object.entries(dividends)) {
  const [a, b] = key.split('\0');
  const net = isNet(a) && !isNet(b) ? a : isNet(b) && !isNet(a) ? b : a;
  divByNet.set(net, (divByNet.get(net) || 0) + num(v));
}

// TAO injected into this subnet's pool per block → per day, and its share of all subnet TAO emission.
function emissionFields(n) {
  const raw = taoEmit[String(n)];
  if (raw == null || !(taoEmitTotal > 0)) return {};
  const perBlock = n === 0 ? 0 : num(raw);
  return {emission_tao_per_day: perBlock * 7200, emission_share_percent: n === 0 ? 0 : perBlock / taoEmitTotal * 100};
}

const subnets = Object.keys(tao).map(Number).sort((a, b) => a - b).map(n => {
  const id = ids[String(n)]?.toHuman?.() || {};
  const rows = stakeByNet.get(String(n)) || [];
  const stakeSum = rows.reduce((s, r) => s + r.alpha, 0);
  const take = stakeSum > 0 ? rows.reduce((s, r) => s + r.take * r.alpha, 0) / stakeSum : 0;
  const validators = [...rows].sort((a, b) => b.alpha - a.alpha).filter((r, i) => i < 12 || (stakeSum > 0 && r.alpha / stakeSum >= 0.01)).map(r => ({hotkey: r.hotkey, take: r.take, alpha: r.alpha}));
  const feeRaw = fees[String(n)];
  return {
    netuid: n,
    name: n === 0 ? 'Root' : (id.subnetName || '').trim() || `Subnet ${n}`,
    taoIn: num(tao[n]),
    alphaIn: ain[n] ? num(ain[n]) : 0,
    alphaOut: aout[n] ? num(aout[n]) : 0,
    stakedAlpha: staked[n] ? num(staked[n]) : stakeSum,
    alphaEmissionPerBlock: aemit[n] ? num(aemit[n]) : 0,
    rootProp: rprop[n] ? fix(rprop[n]) : 0,
    tempo: tempo[n] ? Number(tempo[n].toString()) : 360,
    fee: feeRaw && Number.isFinite(u16(feeRaw)) ? u16(feeRaw) / 65535 : 33 / 65535,
    weightQuote: weights[n] ? quoteW(weights[n]) : 0.5,
    take,
    validatorCount: rows.length,
    validators,
    epochDividends: divByNet.get(String(n)) || 0,
    ...emissionFields(n),
  };
});

const snapshot = {
  asOf: new Date().toISOString(),
  block: head.number.toNumber(),
  blockHash: head.hash.toHex(),
  source: `Bittensor Finney chain, public RPC ${RPC} (subtensorModule and swap storage)`,
  subnets,
};
fs.writeFileSync('public/snapshot.json', JSON.stringify(snapshot, null, 1));
const hist = writeDailyHistory(snapshot);
const report = writeComparison(snapshot);
console.log(subnets.length, 'subnets; sample', subnets.slice(0, 3).map(s => ({netuid: s.netuid, name: s.name, take: s.take, stakedAlpha: s.stakedAlpha, fee: s.fee, weightQuote: s.weightQuote})));
for (const id of [35, 64]) {
  const s = subnets.find(x => x.netuid === id);
  console.log('check', s && {netuid: s.netuid, name: s.name, stakedAlpha: s.stakedAlpha, alphaOut: s.alphaOut, take: s.take, fee: s.fee, weightQuote: s.weightQuote, tempo: s.tempo, epochDividends: s.epochDividends, validators: s.validatorCount});
}
console.log('history', hist.date, hist.file);
console.log('comparison', report);
console.log(comparisonMarkdown(snapshot));
await api.disconnect();
process.exit(0);
