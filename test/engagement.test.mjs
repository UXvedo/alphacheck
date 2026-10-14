import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {engagementFlags, stripFlagged} from '../src/features.js';
import {loadWatch, toggleWatch, starredFirst, WATCH_KEY} from '../src/watchlist.js';
import {posToStake, stakeToPos} from '../src/slider.js';
import {parseCompare, compareMetrics, compareUrl} from '../src/compare-core.js';
import {apyAlpha, outcome, breakEvenDays, takeOf} from '../src/swap-math.js';

const snap = JSON.parse(fs.readFileSync('public/snapshot.json', 'utf8'));

test('engagement flags: off in production, on in preview/dev, overridable', () => {
  assert.deepEqual(engagementFlags({VERCEL_ENV: 'production'}), {slider: false, compare: false, watchlist: false});
  assert.deepEqual(engagementFlags({VERCEL_ENV: 'preview'}), {slider: true, compare: true, watchlist: true});
  assert.deepEqual(engagementFlags({}), {slider: true, compare: true, watchlist: true});
  assert.equal(engagementFlags({VERCEL_ENV: 'production', FLAG_COMPARE: '1'}).compare, true);
  assert.equal(engagementFlags({VERCEL_ENV: 'preview', FLAG_SLIDER: '0'}).slider, false);
  assert.deepEqual(engagementFlags({VERCEL_ENV: 'preview', FEATURES_ON: '0'}), {slider: false, compare: false, watchlist: false});
  assert.equal(stripFlagged('a<!--F:x-->X<!--/F:x-->b<!--F:y-->Y<!--/F:y-->', {x: true, y: false}), 'aXb');
});

test('watchlist storage and ordering', () => {
  const mem = new Map(), st = {getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v)};
  assert.deepEqual(loadWatch(st), []);
  assert.equal(toggleWatch(st, '19'), true);
  assert.equal(toggleWatch(st, 64), true);
  assert.deepEqual(loadWatch(st), [19, 64]);
  assert.equal(toggleWatch(st, 19), false);
  assert.deepEqual(JSON.parse(mem.get(WATCH_KEY)), [64]);
  mem.set(WATCH_KEY, 'not json'); assert.deepEqual(loadWatch(st), []);
  assert.deepEqual(loadWatch({getItem() { throw new Error('blocked'); }}), []);
  assert.deepEqual(starredFirst([1, 2, 3, 4, 5], [4, 2]), [2, 4, 1, 3, 5]);
});

test('slider maps stake on a log scale and round-trips', () => {
  assert.equal(posToStake(0), 0.1);
  assert.equal(posToStake(1000), 10000);
  for (const v of [1, 10, 100, 1000]) assert.ok(Math.abs(posToStake(stakeToPos(v)) - v) / v < 0.02);
  assert.equal(stakeToPos(1e9), 1000);
});

test('compare uses the approved math unchanged and builds a shareable URL', () => {
  const st = parseCompare(new URLSearchParams('a=64&b=19&stake=100'), snap.subnets);
  const live = snap.subnets.filter(s => s.netuid !== 0 && s.taoIn > 0);
  assert.equal(st.stake, 100); assert.equal(st.days, 30);
  if (live.some(s => s.netuid === 64)) assert.equal(st.a, 64);
  const bad = parseCompare(new URLSearchParams('a=99999&b=abc&stake=-5'), snap.subnets);
  assert.ok(live.some(s => s.netuid === bad.a)); assert.equal(bad.stake, 100);
  const s = live[0], m = compareMetrics(s, 100, 30), t = takeOf(s);
  assert.equal(m.apy, apyAlpha(s, t));
  assert.equal(m.out, outcome(s, 100, 30, t, 0).out);
  assert.equal(m.breakEven, breakEvenDays(s, 100, t));
  assert.equal(compareUrl({a: 64, b: 19, stake: 100, days: 30}), '/compare/?a=64&b=19&stake=100&days=30');
});

function gen(env) {
  const e = {...process.env, ...env};
  for (const k of ['FEATURES_ON', 'FLAG_SLIDER', 'FLAG_COMPARE', 'FLAG_WATCHLIST']) if (!(k in env)) delete e[k];
  const r = spawnSync(process.execPath, ['scripts/gen-pages.mjs'], {env: e, encoding: 'utf8'});
  assert.equal(r.status, 0, r.stderr);
}

test('pages: engagement features hidden in production, shown on preview', () => {
  gen({VERCEL_ENV: 'production'});
  assert.equal(fs.existsSync('compare/index.html'), false);
  let sn = fs.readFileSync('sn/1/index.html', 'utf8');
  for (const re of [/data-star=/, /amt-range/, /watch-ui\.js/, /href="\/compare\//, /<!--F:/]) assert.doesNotMatch(sn, re);
  let priv = fs.readFileSync('privacy/index.html', 'utf8');
  assert.doesNotMatch(priv, /local storage/);

  gen({VERCEL_ENV: 'preview'});
  sn = fs.readFileSync('sn/1/index.html', 'utf8');
  for (const re of [/data-star="1"/, /amt-range/, /watch-ui\.js/, /href="\/compare\/"/]) assert.match(sn, re);
  const cmp = fs.readFileSync('compare/index.html', 'utf8');
  assert.match(cmp, /src\/compare\.js/); assert.match(cmp, /noindex/); assert.doesNotMatch(cmp, /src\/main\.js/);
  priv = fs.readFileSync('privacy/index.html', 'utf8');
  assert.match(priv, /local storage/); assert.match(priv, /never sent/);
  assert.doesNotMatch(fs.readFileSync('public/sitemap.xml', 'utf8'), /compare/);
  gen({VERCEL_ENV: 'production'});
});
