import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderOgSvg} from '../src/og-template.js';

test('share image keeps calculated metrics as PLACEHOLDER', () => {
  const src = fs.readFileSync(new URL('../src/og-template.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /from ['"][^'"]*swap-math/);
  const svg = renderOgSvg({title: 'SN1 · Apex', stakeLabel: '100 TAO', days: 90, take: 18});
  assert.equal(svg.match(/PLACEHOLDER/g).length, 3);
  assert.match(svg, /SN1 · Apex/);
  assert.match(svg, /Stake 100 TAO/);
  assert.match(svg, /Est\. APY/);
  assert.match(svg, /Break-even days/);
  assert.match(svg, /30-day net TAO/);
  assert.match(svg, /days=90 take=18/);
  assert.doesNotMatch(svg, /<img/);
  const hostile = renderOgSvg({title: 'SN1 <Apex>', stakeLabel: '10 TAO', days: '1--><script>', take: '18'});
  assert.doesNotMatch(hostile, /<script>/);
  assert.match(hostile, /SN1 &lt;Apex&gt;/);
});
