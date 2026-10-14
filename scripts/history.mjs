// Append-only daily history. One JSON file per UTC day plus data/history/index.json.
// A second snapshot on the same UTC day replaces that day's file (idempotent).
// Older days are never rewritten.
import fs from 'node:fs';
import path from 'node:path';
import {price, apyAlpha, apyRoot} from '../src/swap-math.js';

export const HISTORY_VERSION = 1;
export const HISTORY_TAKE = 0.18;

export function historyRecord(snapshot, take = HISTORY_TAKE) {
  const asOf = snapshot.asOf;
  const block = snapshot.block;
  const rootApy = apyRoot(snapshot.subnets, take);
  const subnets = snapshot.subnets.map(s => ({
    netuid: s.netuid,
    name: s.name,
    alphaPrice: price(s),
    poolTao: s.taoIn,
    poolAlpha: s.alphaIn,
    emissions: s.alphaEmissionPerBlock,
    estApy: s.netuid === 0 ? rootApy : apyAlpha(s, take),
    block,
    asOf,
  }));
  return {version: HISTORY_VERSION, date: asOf.slice(0, 10), asOf, block, take, subnets};
}

export function writeDailyHistory(snapshot, opts = {}) {
  const root = opts.root ?? path.resolve(import.meta.dirname, '..');
  const dir = path.join(root, 'data', 'history');
  fs.mkdirSync(dir, {recursive: true});
  const rec = historyRecord(snapshot, opts.take ?? HISTORY_TAKE);
  const fileName = `${rec.date}.json`;
  fs.writeFileSync(path.join(dir, fileName), JSON.stringify(rec, null, 2) + '\n');
  const indexPath = path.join(dir, 'index.json');
  const prev = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : {days: []};
  const days = (prev.days || []).filter(d => d.date !== rec.date);
  days.push({date: rec.date, asOf: rec.asOf, block: rec.block, file: fileName, subnets: rec.subnets.length});
  days.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const index = {
    version: HISTORY_VERSION,
    takeForEstApy: HISTORY_TAKE,
    note: 'One file per UTC day. Re-running snapshot on the same day replaces that file and its index entry. Older days are left untouched. estApy comes from src/swap-math.js at takeForEstApy (root uses root APY). emissions is alpha emitted per block. alphaPrice is poolTao / poolAlpha.',
    days,
  };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  return {file: path.join(dir, fileName), date: rec.date};
}
