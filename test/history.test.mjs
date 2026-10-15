import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {price, apyAlpha, apyRoot, takeOf} from '../src/swap-math.js';
import {writeDailyHistory, HISTORY_VERSION} from '../scripts/history.mjs';

const snap = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));

test('daily history is idempotent within a day and leaves other days untouched', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'alphacheck-hist-'));
  writeDailyHistory(snap, {root});
  writeDailyHistory(snap, {root});
  const index = JSON.parse(fs.readFileSync(path.join(root, 'data/history/index.json'), 'utf8'));
  assert.equal(index.version, HISTORY_VERSION);
  assert.equal(index.days.length, 1);
  assert.equal(index.days[0].date, snap.asOf.slice(0, 10));
  const day = JSON.parse(fs.readFileSync(path.join(root, 'data/history', index.days[0].file), 'utf8'));
  assert.equal(day.version, HISTORY_VERSION);
  assert.equal(day.subnets.length, snap.subnets.length);
  const s1 = day.subnets.find(s => s.netuid === 1);
  const raw1 = snap.subnets.find(s => s.netuid === 1);
  assert.equal(s1.alphaPrice, price(raw1));
  assert.equal(s1.poolTao, raw1.taoIn);
  assert.equal(s1.poolAlpha, raw1.alphaIn);
  assert.equal(s1.emissions, raw1.alphaEmissionPerBlock);
  assert.equal(s1.estApy, apyAlpha(raw1, takeOf(raw1)));
  assert.equal(s1.take, takeOf(raw1));
  assert.equal(s1.block, snap.block);
  assert.equal(s1.asOf, snap.asOf);
  assert.equal(day.subnets.find(s => s.netuid === 0).estApy, apyRoot(snap.subnets));

  // Fresh root with fixed dates so this part doesn't depend on the live snapshot's date.
  const root2 = fs.mkdtempSync(path.join(os.tmpdir(), 'alphacheck-hist-'));
  const older = {...snap, asOf: '2026-10-13T01:00:00.000Z', block: 1};
  writeDailyHistory(older, {root: root2});
  const kept = fs.readFileSync(path.join(root2, 'data/history/2026-10-13.json'), 'utf8');
  writeDailyHistory({...snap, asOf: '2026-10-14T01:00:00.000Z', block: 2}, {root: root2});
  const later = {...snap, asOf: '2026-10-14T23:00:00.000Z', block: 99};
  writeDailyHistory(later, {root: root2});
  assert.equal(fs.readFileSync(path.join(root2, 'data/history/2026-10-13.json'), 'utf8'), kept);
  const index2 = JSON.parse(fs.readFileSync(path.join(root2, 'data/history/index.json'), 'utf8'));
  assert.deepEqual(index2.days.map(d => d.date), ['2026-10-13', '2026-10-14']);
  assert.equal(index2.days.length, 2);
  const updated = JSON.parse(fs.readFileSync(path.join(root2, 'data/history/2026-10-14.json'), 'utf8'));
  assert.equal(updated.block, 99);
  assert.equal(updated.subnets[1].block, 99);
  assert.equal(updated.subnets[1].asOf, later.asOf);
});
