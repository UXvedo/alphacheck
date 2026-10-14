import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {price, apyAlpha, apyRoot, buy, sell, outcome, SC} from '../src/calc.js';
import * as swap from '../src/swap-math.js';

test('calc.js re-exports swap-math and holds no formulas', () => {
  const src = fs.readFileSync(new URL('../src/calc.js', import.meta.url), 'utf8');
  assert.match(src, /swap-math\.js/);
  assert.doesNotMatch(src, /alphaEmissionPerBlock|Math\.sqrt|export const buy|export function outcome/);
  assert.equal(price, swap.price);
  assert.equal(apyAlpha, swap.apyAlpha);
  assert.equal(apyRoot, swap.apyRoot);
  assert.equal(buy, swap.buy);
  assert.equal(sell, swap.sell);
  assert.equal(outcome, swap.outcome);
});

test('published calculator outputs are unchanged', () => {
  const golden = JSON.parse(fs.readFileSync(new URL('./golden/outputs.json', import.meta.url), 'utf8'));
  const d = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));
  assert.equal(d.asOf, golden.asOf);
  assert.equal(d.block, golden.block);
  const S = d.subnets;
  assert.equal(apyRoot(S, 0), golden.root.t0);
  assert.equal(apyRoot(S, 0.18), golden.root.t18);
  assert.equal(apyRoot(S, 1), golden.root.t1);
  const ids = [0, 1, 2, 4, 8, 64, 128];
  const pick = ids.map(id => S.find(s => s.netuid === id)).filter(Boolean);
  const tiny = S.filter(s => s.netuid && s.taoIn > 0).sort((a, b) => a.taoIn - b.taoIn)[0];
  const cases = [];
  for (const s of [...pick, tiny]) {
    const t = 0.18;
    cases.push({netuid: s.netuid, price: price(s), apy0: apyAlpha(s, 0), apy18: apyAlpha(s, t), apy1: apyAlpha(s, 1)});
    for (const X of [10, 100, 1000]) {
      cases.push({netuid: s.netuid, X, buy: buy(s, X), sellSpot: sell(s.taoIn, s.alphaIn, buy(s, X))});
      for (const days of [0, 30, 90]) for (const c of SC) {
        const o = outcome(s, X, days, t, c);
        cases.push({netuid: s.netuid, X, days, c, t, P: o.P, aGot: o.aGot, aEnd: o.aEnd, entrySlip: o.entrySlip, ideal: o.ideal, out: o.out});
      }
    }
  }
  assert.deepEqual(cases, golden.cases);
});
