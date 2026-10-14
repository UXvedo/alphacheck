// Exit nonzero when public/snapshot.json is missing or older than 36 hours.
import fs from 'node:fs';
import {isStale, formatAsOf, STALE_MS} from '../src/time.js';

const file = process.argv[2] || 'public/snapshot.json';
let snap;
try {
  snap = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (err) {
  console.error(`check-stale: cannot read ${file}: ${err.message}`);
  process.exit(1);
}
const hours = STALE_MS / 3600000;
if (isStale(snap.asOf)) {
  console.error(`STALE: ${file} is older than ${hours}h (data as of ${formatAsOf(snap.asOf)})`);
  process.exit(1);
}
console.log(`fresh: ${file} data as of ${formatAsOf(snap.asOf)} (within ${hours}h)`);
