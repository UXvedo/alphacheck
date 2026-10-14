import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderOgSvg} from '../src/og-template.js';
import {shareCard} from '../src/og-metrics.js';
import {apyAlpha, outcome, breakEvenDays, takeOf} from '../src/swap-math.js';
import {formatBreakEvenDays} from '../src/format.js';

test('share image prints the calculated metrics', () => {
  const svg = renderOgSvg({title: 'SN1 · Apex', stakeLabel: '100 TAO', apy: '29.4%', breakEven: '3.2 days', netTao: '+1.20 τ'});
  assert.match(svg, /SN1 · Apex/);
  assert.match(svg, /Stake 100 TAO/);
  assert.match(svg, /Est\. APY/);
  assert.match(svg, /29\.4%/);
  assert.match(svg, /Break-even days/);
  assert.match(svg, /3\.2 days/);
  assert.match(svg, /30-day net TAO/);
  assert.match(svg, /\+1\.20 τ/);
  assert.doesNotMatch(svg, /PLACEHOLDER/);
  assert.doesNotMatch(svg, /<img/);
  const hostile = renderOgSvg({title: 'SN1 <Apex>', stakeLabel: '10 TAO', apy: '1%<script>', breakEven: '1 day', netTao: '+1 τ'});
  assert.doesNotMatch(hostile, /<script>/);
  assert.match(hostile, /SN1 &lt;Apex&gt;/);
  assert.match(hostile, /1%&lt;script&gt;/);
});

test('share card matches the calculator at a flat alpha price', () => {
  const snap = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));
  const s = snap.subnets.find(x => x.netuid === 1);
  const card = shareCard(snap, {netuid: 1, amt: 100});
  const t = takeOf(s);
  const net = outcome(s, 100, 30, t, 0).out - 100;
  assert.equal(card.title, `SN1 · ${s.name}`);
  assert.equal(card.stakeLabel, '100 TAO');
  assert.equal(card.apy, `${(apyAlpha(s, t) * 100).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`);
  assert.equal(card.breakEven, formatBreakEvenDays(breakEvenDays(s, 100, t)));
  const signed = `${net >= 0 ? '+' : ''}${net.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} τ`;
  assert.equal(card.netTao, signed);
  const custom = shareCard(snap, {netuid: 1, amt: 1000, take: 0.18});
  assert.equal(custom.apy, `${(apyAlpha(s, 0.18) * 100).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`);
  assert.equal(custom.stakeLabel, '1000 TAO');
});
