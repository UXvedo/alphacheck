import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import handler from '../api/og.js';
import {shareCard} from '../src/og-metrics.js';

function call(env, url) {
  const prev = process.env.VERCEL_ENV;
  const prevOn = process.env.FEATURES_ON;
  if (env.VERCEL_ENV == null) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = env.VERCEL_ENV;
  if (env.FEATURES_ON == null) delete process.env.FEATURES_ON;
  else process.env.FEATURES_ON = env.FEATURES_ON;
  const res = {statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b) { this.raw = Buffer.isBuffer(b) ? b : Buffer.from(b == null ? '' : String(b)); this.body = b == null ? '' : String(b); }};
  handler({url, query: {}}, res);
  if (prev == null) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prev;
  if (prevOn == null) delete process.env.FEATURES_ON; else process.env.FEATURES_ON = prevOn;
  return res;
}

test('share-image endpoint is on in production and prints real figures', () => {
  const snap = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));
  const hidden = call({FEATURES_ON: '0'}, '/api/og?sn=1&amt=100&days=30&take=18');
  assert.equal(hidden.statusCode, 404);
  const png = call({VERCEL_ENV: 'production'}, '/api/og?sn=1&amt=1000&days=30&take=18');
  assert.equal(png.statusCode, 200);
  assert.equal(png.headers['Content-Type'], 'image/png');
  assert.equal(png.raw.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.raw.readUInt32BE(16), 1200);
  assert.equal(png.raw.readUInt32BE(20), 630);
  const shown = call({VERCEL_ENV: 'production'}, '/api/og?sn=1&amt=1000&days=30&take=18&format=svg');
  assert.equal(shown.statusCode, 200);
  assert.match(shown.headers['Content-Type'], /image\/svg\+xml/);
  assert.doesNotMatch(shown.body, /PLACEHOLDER/);
  const card = shareCard(snap, {netuid: 1, amt: 1000, take: 0.18});
  assert.match(shown.body, new RegExp(card.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(shown.body, /Stake 1000 TAO/);
  assert.match(shown.body, new RegExp(card.apy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(shown.body, new RegExp(card.breakEven.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(shown.body, new RegExp(card.netTao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
