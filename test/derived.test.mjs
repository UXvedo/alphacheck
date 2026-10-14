import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {outcome, roundTripCost, dailyEmissionsTao, breakEvenDays, maxSafeStake, SLIP_BANDS} from '../src/swap-math.js';

const snap = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));
const subnet = snap.subnets.find(s => s.netuid === 1);
const thin = snap.subnets.find(s => s.netuid === 70);
const root = snap.subnets.find(s => s.netuid === 0);

test('round trip is stake slippage plus unstake slippage at 0% alpha', () => {
  for (const X of [10, 100, 1000]) {
    const cost = roundTripCost(subnet, X);
    const out = outcome(subnet, X, 0, 0, 0).out;
    assert.ok(Math.abs(cost.total - (cost.stakeSlip + cost.unstakeSlip)) < 1e-9);
    assert.ok(Math.abs(cost.total - (X - out)) < 1e-9);
    assert.ok(cost.stakeSlip > 0);
    assert.ok(cost.unstakeSlip > 0);
  }
});

test('break-even days are cost divided by daily emissions, else Never', () => {
  for (const s of [subnet, thin]) {
    for (const X of [10, 100, 1000]) {
      const cost = roundTripCost(s, X).total;
      const daily = dailyEmissionsTao(s, X, 0.18);
      const days = breakEvenDays(s, X, 0.18);
      assert.ok(daily > 0);
      assert.ok(Math.abs(days - cost / daily) < 1e-9);
    }
  }
  assert.equal(breakEvenDays(root, 100, 0.18), null);
  assert.equal(breakEvenDays(subnet, 100, 1), null);
});

test('max safe stake is the largest entry at or under each band', () => {
  for (const s of [subnet, thin]) {
    for (const band of SLIP_BANDS) {
      const x = maxSafeStake(s, band);
      assert.ok(x > 0);
      assert.ok(outcome(s, x, 0, 0, 0).entrySlip <= band + 1e-8);
      assert.ok(outcome(s, x * 1.002, 0, 0, 0).entrySlip > band);
    }
  }
});
