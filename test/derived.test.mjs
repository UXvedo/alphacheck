import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {outcome, roundTripCost, dailyEmissionsTao, breakEvenDays, maxSafeStake, SLIP_BANDS, entryCost, exitSlippage, apyRange, apyAlpha, takeOf, lowTaoEmission, taoCoveragePercent, coverageTier, coverageLine, buy, price} from '../src/swap-math.js';
import {formatBreakEvenDays, formatApyRange} from '../src/format.js';

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

test('break-even days are ENTRY cost divided by your stake daily rewards in TAO, else Never', () => {
  for (const s of [subnet, thin]) {
    for (const X of [10, 100, 1000]) {
      if (X > s.taoIn) continue;
      const cost = entryCost(s, X);
      assert.ok(Math.abs(cost - roundTripCost(s, X).stakeSlip) < 1e-9);
      const daily = buy(s, X) * price(s) * ((1 + apyAlpha(s, 0.18)) ** (1 / 365) - 1);
      assert.ok(Math.abs(daily - dailyEmissionsTao(s, X, 0.18)) < 1e-12);
      const days = breakEvenDays(s, X, 0.18);
      const after = buy(s, X) * price(s), r = (1 + apyAlpha(s, 0.18)) ** (1 / 365) - 1;
      assert.ok(Math.abs(days - Math.log(1 + cost / after) / Math.log(1 + r)) < 1e-9);
      assert.ok(days < roundTripCost(s, X).total / daily, 'no double-counted exit slippage');
    }
  }
  assert.equal(breakEvenDays(root, 100, 0.18), null);
  assert.equal(breakEvenDays(subnet, 100, 1), null);
  assert.equal(breakEvenDays({...thin, alphaEmissionPerBlock: 0}, 10, 0.18), null);
  assert.equal(breakEvenDays(thin, thin.taoIn * 1.01, 0), null, 'stake bigger than pool → Never');
});

test('exit slippage is a separate positive figure', () => {
  const e = exitSlippage(subnet, 100);
  assert.ok(e.tao > 0 && e.pct > 0 && e.pct < 1);
  assert.ok(Math.abs(e.tao - roundTripCost(subnet, 100).unstakeSlip) < 1e-9);
});

test('display caps: Never, > 1 year, no raw counts above 365', () => {
  assert.equal(formatBreakEvenDays(null), 'Never');
  assert.equal(formatBreakEvenDays(Infinity), 'Never');
  assert.equal(formatBreakEvenDays(365), '365.0 days');
  assert.equal(formatBreakEvenDays(365.01), '> 1 year');
  assert.equal(formatBreakEvenDays(93617), '> 1 year');
  for (const s of snap.subnets) for (const X of [10, 100, 1000]) {
    const txt = formatBreakEvenDays(breakEvenDays(s, X, takeOf(s)));
    const m = txt.match(/^([\d,.]+) days$/);
    if (m) assert.ok(+m[1].replace(/,/g, '') <= 365, txt);
  }
});

test('APY range spans validators with >= 1% of stake', () => {
  const s = {...subnet, stakedAlpha: 1000, validators: [{take: 0, alpha: 500}, {take: 0.18, alpha: 400}, {take: 0.5, alpha: 5}]};
  const r = apyRange(s);
  assert.equal(r.validators, 2);
  assert.ok(Math.abs(r.min - apyAlpha(s, 0.18)) < 1e-12 && Math.abs(r.max - apyAlpha(s, 0)) < 1e-12);
  assert.match(formatApyRange(r), /^[\d.,]+–[\d.,]+%$/);
  const none = apyRange({...subnet, validators: []});
  assert.equal(none.min, apyAlpha(subnet));
});

test('low TAO coverage warning triggers by coverage tier', () => {
  assert.equal(lowTaoEmission({netuid: 5, tao_coverage_percent: 9.9}), true);
  assert.equal(lowTaoEmission({netuid: 5, tao_coverage_percent: 10}), false);
  assert.equal(coverageTier({netuid: 5, tao_coverage_percent: 49.9}), 'moderate');
  assert.equal(coverageTier({netuid: 5, tao_coverage_percent: 50}), 'ok');
  assert.equal(coverageTier({netuid: 5, emission_tao_per_day: 0, tao_coverage_percent: null}), 'none');
  assert.equal(coverageLine({netuid: 5, tao_coverage_percent: 30}), 'Moderate TAO coverage: 30.0%');
  assert.equal(coverageLine({netuid: 5, tao_coverage_percent: 64.9}), 'TAO coverage: 64.9%');
  assert.equal(coverageLine({netuid: 5}), 'No TAO emissions');
  assert.equal(lowTaoEmission({netuid: 5, emission_share_percent: 0.001}), false, 'share threshold dropped');
  assert.equal(lowTaoEmission({netuid: 5}), false, 'old snapshots without the fields never warn');
  assert.equal(lowTaoEmission({netuid: 0, tao_coverage_percent: 0}), false);
  // computed from older fields when tao_coverage_percent is missing
  const s = {netuid: 5, taoIn: 100, alphaIn: 100, weightQuote: 0.5, alphaEmissionPerBlock: 1, emission_tao_per_day: 7200 * 0.05};
  assert.ok(Math.abs(taoCoveragePercent(s) - 5) < 1e-9);
  assert.equal(lowTaoEmission(s), true);
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
