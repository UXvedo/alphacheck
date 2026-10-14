// Compare the audited emission APY with realized last-epoch nominator dividends.
// Reference = Σ AlphaDividendsPerSubnet × epochs/year ÷ staked alpha. Same definition as the 2026-10-14 audit.
import fs from 'node:fs';
import path from 'node:path';
import {apyAlpha, epochsPerYear} from '../src/swap-math.js';

export const COMPARE_IDS = [64, 51, 4, 8, 3, 120, 44, 9, 56, 68, 35, 16, 103, 36, 70];

export function comparisonRows(snapshot) {
  return COMPARE_IDS.map(id => {
    const s = snapshot.subnets.find(x => x.netuid === id);
    if (!s || !(s.stakedAlpha > 0)) return {id, name: s?.name || '', apy: NaN, ref: NaN, delta: NaN};
    const apy = apyAlpha(s, s.take);
    const ref = (s.epochDividends || 0) * epochsPerYear(s) / s.stakedAlpha;
    return {id, name: s.name, apy, ref, delta: apy - ref};
  });
}

const pct = x => Number.isFinite(x) ? (x * 100).toFixed(1) + '%' : 'n/a';
const pp = x => Number.isFinite(x) ? (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + ' pp' : 'n/a';

export function comparisonMarkdown(snapshot) {
  const rows = comparisonRows(snapshot);
  const body = rows.map(r => `| ${r.id} ${r.name} | ${pct(r.apy)} | ${pct(r.ref)} | ${pp(r.delta)} |`).join('\n');
  return `# APY comparison

Snapshot block ${snapshot.block} at ${snapshot.asOf}.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of \`AlphaDividendsPerSubnet\` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
${body}
`;
}

export function writeComparison(snapshot, root = path.resolve(import.meta.dirname, '..')) {
  const md = comparisonMarkdown(snapshot);
  const file = path.join(root, 'docs', 'apy-comparison.md');
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, md);
  return file;
}
