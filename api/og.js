// Vercel serverless share image. Same URL params as the calculator: sn, amt, days, take.
// Calculated metrics are PLACEHOLDER. Runtime flag: off when VERCEL_ENV=production unless FEATURES_ON=1.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {featuresEnabled} from '../src/features.js';
import {renderOgSvg} from '../src/og-template.js';

const here = path.dirname(fileURLToPath(import.meta.url));

function names() {
  try {
    return JSON.parse(fs.readFileSync(path.join(here, 'subnet-names.json'), 'utf8'));
  } catch {
    return {};
  }
}

export default function handler(req, res) {
  if (!featuresEnabled(process.env)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
    return;
  }
  const q = req.query && Object.keys(req.query).length
    ? req.query
    : Object.fromEntries(new URL(req.url || '/', 'http://localhost').searchParams);
  const sn = q.sn == null ? '' : String(q.sn);
  const map = names();
  const title = sn && map[sn] ? `SN${sn} · ${map[sn]}` : sn ? `SN${sn}` : 'AlphaCheck';
  const amt = q.amt == null || q.amt === '' ? '' : String(q.amt);
  const stakeLabel = amt !== '' && Number.isFinite(+amt) ? `${amt} TAO` : 'PLACEHOLDER';
  const svg = renderOgSvg({title, stakeLabel, days: q.days, take: q.take});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end(svg);
}
