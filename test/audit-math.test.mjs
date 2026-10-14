import test from 'node:test';
import assert from 'node:assert/strict';
import {BPY, price, buy, sell, shiftedPool, outcome, apyAlpha, apyRoot, growth, epochsPerYear} from '../src/swap-math.js';
import {comparisonMarkdown, comparisonRows} from '../scripts/compare-apy.mjs';

function cpBuy(s, x) {
  return s.alphaIn - s.taoIn * s.alphaIn / (s.taoIn + x);
}
function cpSell(pool, a) {
  return pool.taoIn - pool.taoIn * pool.alphaIn / (pool.alphaIn + a);
}
function cpShift(s, c) {
  const k = s.taoIn * s.alphaIn;
  const P = (s.taoIn / s.alphaIn) * (1 + c);
  const T = Math.sqrt(k * P);
  return {taoIn: T, alphaIn: k / T};
}
function rel(a, b) {
  return Math.abs(a - b) / Math.max(1e-12, Math.abs(b));
}

const pool = {
  taoIn: 100000, alphaIn: 200000, weightQuote: 0.5, fee: 0,
  alphaEmissionPerBlock: 0.02, rootProp: 0.2, stakedAlpha: 400000, take: 0.09, tempo: 360,
};

test('equal weights and a zero fee match constant product', () => {
  assert.ok(rel(price(pool), pool.taoIn / pool.alphaIn) < 1e-12);
  for (const x of [10, 100, 1000, 50000]) {
    assert.ok(rel(buy(pool, x), cpBuy(pool, x)) < 1e-8);
    const got = buy(pool, x);
    assert.ok(rel(sell(pool, got), cpSell(pool, got)) < 1e-8);
  }
  for (const c of [-0.5, -0.2, 0, 0.2]) {
    const shifted = shiftedPool(pool, c);
    const cp = cpShift(pool, c);
    assert.ok(rel(shifted.taoIn, cp.taoIn) < 1e-8);
    assert.ok(rel(shifted.alphaIn, cp.alphaIn) < 1e-8);
    const audited = outcome(pool, 1000, 90, 0.09, c);
    const aGot = cpBuy(pool, 1000);
    const aEnd = aGot * growth(pool, apyAlpha(pool, 0.09), 90);
    const exit = cpShift(pool, c);
    assert.ok(rel(audited.out, cpSell(exit, aEnd)) < 1e-8);
  }
});

test('the swap fee shrinks the buy and the sell', () => {
  const f = 33 / 65535;
  const s = {...pool, fee: f};
  const bare = {...pool, fee: 0};
  assert.ok(buy(s, 1000) < buy(bare, 1000));
  assert.ok(rel(buy(s, 1000), buy(bare, 1000 * (1 - f))) < 1e-12);
  assert.ok(sell(s, 500) < sell(bare, 500));
  assert.ok(rel(sell(s, 500), (1 - f) * sell(bare, 500)) < 1e-12);
});

test('unequal weights follow the balancer closed form', () => {
  const s = {taoIn: 100, alphaIn: 100, weightQuote: 0.25, fee: 0};
  const bought = 100 * (1 - (100 / 110) ** (0.25 / 0.75));
  assert.ok(rel(buy(s, 10), bought) < 1e-12);
  const sold = 100 * (1 - (100 / 110) ** (0.75 / 0.25));
  assert.ok(rel(sell(s, 10), sold) < 1e-12);
  assert.ok(rel(price(s), (0.75 / 0.25) * (100 / 100)) < 1e-12);
});

test('subnet APY divides by staked alpha', () => {
  const s = {alphaEmissionPerBlock: 1, rootProp: 0, take: 0, alphaOut: 100, stakedAlpha: 50, tempo: 360};
  assert.equal(apyAlpha(s, 0), BPY * 0.41 / 50);
  assert.ok(apyAlpha(s, 0) > BPY * 0.41 / 100);
});

test('holding periods compound once per epoch', () => {
  const s = {tempo: 360};
  assert.ok(Math.abs(epochsPerYear(s) - 7200 * 365 / 361) < 1e-9);
  const g = growth(s, 1, 90);
  const compounded = Math.exp(90 / 365) - 1;
  const simple = 90 / 365;
  assert.ok(Math.abs((g - 1) - compounded) < 0.002);
  assert.ok(g - 1 > simple);
});

test('root APY sells one epoch through the pool', () => {
  const root = {netuid: 0, taoIn: 1000, alphaIn: 1, alphaEmissionPerBlock: 0, rootProp: 0, tempo: 360};
  const thin = {netuid: 1, taoIn: 10, alphaIn: 10, alphaEmissionPerBlock: 1, rootProp: 1, fee: 0, weightQuote: 0.5, take: 0, tempo: 360};
  const spot = 1 * 0.41 * 1 * 1 * BPY / root.taoIn;
  const slipped = apyRoot([root, thin], 0);
  assert.ok(slipped > 0);
  assert.ok(slipped < spot);
});

test('comparison table reports nominal APY against one epoch of dividends', () => {
  const snap = {
    block: 1,
    asOf: '2026-10-14T00:00:00.000Z',
    subnets: [{
      netuid: 64, name: 'Chutes', alphaEmissionPerBlock: 1, rootProp: 0, take: 0.1,
      stakedAlpha: 1000, epochDividends: 0.05, tempo: 360, alphaOut: 5000,
    }],
  };
  const [row] = comparisonRows(snap);
  assert.equal(row.apy, apyAlpha(snap.subnets[0], 0.1));
  assert.equal(row.ref, 0.05 * epochsPerYear(snap.subnets[0]) / 1000);
  const md = comparisonMarkdown(snap);
  assert.match(md, /\| Subnet \| New APY \| Reference \| Delta \|/);
  assert.match(md, /\| 64 Chutes \|/);
});
