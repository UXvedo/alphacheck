import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/og.js';

function call(env, url) {
  const prev = process.env.VERCEL_ENV;
  const prevOn = process.env.FEATURES_ON;
  process.env.VERCEL_ENV = env.VERCEL_ENV;
  if (env.FEATURES_ON == null) delete process.env.FEATURES_ON;
  else process.env.FEATURES_ON = env.FEATURES_ON;
  const res = {statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b == null ? '' : String(b); }};
  handler({url, query: {}}, res);
  if (prev == null) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prev;
  if (prevOn == null) delete process.env.FEATURES_ON; else process.env.FEATURES_ON = prevOn;
  return res;
}

test('share-image endpoint follows the feature flag', () => {
  const hidden = call({VERCEL_ENV: 'production'}, '/api/og?sn=1&amt=100&days=30&take=18');
  assert.equal(hidden.statusCode, 404);
  const shown = call({VERCEL_ENV: 'preview'}, '/api/og?sn=1&amt=1000&days=30&take=18');
  assert.equal(shown.statusCode, 200);
  assert.match(shown.headers['Content-Type'], /image\/svg\+xml/);
  assert.equal(shown.body.match(/PLACEHOLDER/g).length, 3);
  assert.match(shown.body, /Stake 1000 TAO/);
  const forced = call({VERCEL_ENV: 'production', FEATURES_ON: '1'}, '/api/og?sn=4&amt=10');
  assert.equal(forced.statusCode, 200);
  assert.match(forced.body, /Stake 10 TAO/);
});
