import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {price, apyAlpha, apyRoot, buy, sell, outcome} from '../src/calc.js';
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

