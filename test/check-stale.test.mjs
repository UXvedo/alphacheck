import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function run(asOf) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'alphacheck-stale-'));
  const file = path.join(dir, 'snapshot.json');
  fs.writeFileSync(file, JSON.stringify({asOf}));
  return spawnSync(process.execPath, ['scripts/check-stale.mjs', file], {encoding: 'utf8'});
}

test('check-stale exits nonzero when the snapshot is older than 36h', () => {
  const old = run(new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString());
  assert.notEqual(old.status, 0);
  assert.match(old.stderr, /STALE/);
  const fresh = run(new Date().toISOString());
  assert.equal(fresh.status, 0);
  assert.match(fresh.stdout, /fresh/);
  const missing = spawnSync(process.execPath, ['scripts/check-stale.mjs', '/tmp/does-not-exist-snapshot.json'], {encoding: 'utf8'});
  assert.notEqual(missing.status, 0);
});
