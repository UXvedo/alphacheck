// Append-only daily history. One JSON file per UTC day plus data/history/index.json.
// A second snapshot on the same UTC day replaces that day's file (idempotent).
// Older days are never rewritten.
import fs from 'node:fs';
import path from 'node:path';
import {price, apyAlpha, apyRoot, takeOf} from '../src/swap-math.js';

export const HISTORY_VERSION = 3;

export function historyRecord(snapshot) {
  const asOf = snapshot.asOf;
  const block = snapshot.block;
  const rootApy = apyRoot(snapshot.subnets);
  const subnets = snapshot.subnets.map(s => ({
    netuid: s.netuid,
    name: s.name,
    alphaPrice: price(s),
    poolTao: s.taoIn,
    poolAlpha: s.alphaIn,
    emissions: s.alphaEmissionPerBlock,
    take: takeOf(s),
    estApy: s.netuid === 0 ? rootApy : apyAlpha(s),
    emission_share_percent: Number.isFinite(s.emission_share_percent) ? s.emission_share_percent : null,
    emission_tao_per_day: Number.isFinite(s.emission_tao_per_day) ? s.emission_tao_per_day : null,
    tao_injected_per_day: Number.isFinite(s.tao_injected_per_day) ? s.tao_injected_per_day : null,
    excess_tao_per_day: Number.isFinite(s.excess_tao_per_day) ? s.excess_tao_per_day : null,
    alpha_emission_per_day: Number.isFinite(s.alpha_emission_per_day) ? s.alpha_emission_per_day : null,
    tao_coverage_percent: Number.isFinite(s.tao_coverage_percent) ? s.tao_coverage_percent : null,
    block,
    asOf,
  }));
  return {version: HISTORY_VERSION, date: asOf.slice(0, 10), asOf, block, subnets};
}

export function writeDailyHistory(snapshot, opts = {}) {
  const root = opts.root ?? path.resolve(import.meta.dirname, '..');
  const dir = path.join(root, 'data', 'history');
  fs.mkdirSync(dir, {recursive: true});
  const rec = historyRecord(snapshot);
  const fileName = `${rec.date}.json`;
  fs.writeFileSync(path.join(dir, fileName), JSON.stringify(rec, null, 2) + '\n');
  const indexPath = path.join(dir, 'index.json');
  const prev = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : {days: []};
  const days = (prev.days || []).filter(d => d.date !== rec.date);
  days.push({date: rec.date, asOf: rec.asOf, block: rec.block, file: fileName, subnets: rec.subnets.length});
  days.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const index = {
    version: HISTORY_VERSION,
    note: 'One file per UTC day. Re-running snapshot on the same day replaces that file and its index entry. Older days are left untouched. estApy is the nominal subnet APY at that subnet\'s stake-weighted validator take (the take field). Root estApy is the root APY: each subnet uses its own take, and one epoch of root dividends is sold through that pool. emissions is alpha emitted per block. alphaPrice is the weighted-pool spot price. From version 3: emission_share_percent is the subnet\'s share of all subnet TAO emission (subnetTaoInEmission) in percent, and emission_tao_per_day is that TAO per day; null when the snapshot did not carry them. From Oct 14 22:00 UTC, emission_tao_per_day = tao_injected_per_day (subnetTaoInEmission) + excess_tao_per_day (subnetExcessTao); before that it was injection only. alpha_emission_per_day is all alpha emitted to participants per day (subnetAlphaOutEmission × 7,200) and tao_coverage_percent is emission_tao_per_day ÷ (alpha_emission_per_day × alphaPrice) × 100.',
    days,
  };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  return {file: path.join(dir, fileName), date: rec.date};
}
