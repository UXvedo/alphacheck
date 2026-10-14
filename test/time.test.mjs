import test from 'node:test';
import assert from 'node:assert/strict';
import {formatAsOf, isStale, STALE_MS} from '../src/time.js';
import {formatBreakEvenDays} from '../src/format.js';

test('formatAsOf is a UTC timestamp', () => {
  assert.equal(formatAsOf('2026-10-14T10:04:13.544Z'), '2026-10-14 10:04:13 UTC');
  assert.equal(formatAsOf('not-a-date'), 'unknown');
});

test('stale means strictly older than 36 hours', () => {
  const asOf = '2026-10-14T10:04:13.544Z';
  const t = new Date(asOf).getTime();
  assert.equal(isStale(asOf, t + STALE_MS), false);
  assert.equal(isStale(asOf, t + STALE_MS + 1), true);
  assert.equal(isStale(undefined, t), true);
  assert.equal(isStale('nope', t), true);
});

test('break-even label', () => {
  assert.equal(formatBreakEvenDays(null), 'Never');
  assert.equal(formatBreakEvenDays(Number.NaN), 'Never');
  assert.equal(formatBreakEvenDays(0), '0 days');
});
