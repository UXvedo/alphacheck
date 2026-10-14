// Vercel serverless share image. Same URL params as the calculator: sn, amt, days, take.
// take is a percent, matching the calculator. The 30-day net uses a flat alpha price.
// Features are on unless FEATURES_ON=0 (see src/features.js).
import fs from 'node:fs';
import {featuresEnabled} from '../src/features.js';
import {renderOgSvg} from '../src/og-template.js';
import {shareCard} from '../src/og-metrics.js';
import {svgToPng} from '../src/og-png.js';

const snapshot = JSON.parse(fs.readFileSync(new URL('../public/snapshot.json', import.meta.url), 'utf8'));

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
  const amt = q.amt == null || q.amt === '' ? 100 : +q.amt;
  const take = q.take == null || q.take === '' || !Number.isFinite(+q.take) ? undefined : +q.take / 100;
  const svg = renderOgSvg(shareCard(snapshot, {netuid: q.sn, amt, take}));
  res.statusCode = 200;
  if (q.format === 'svg') {
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(svg);
    return;
  }
  // PNG by default: X, Discord and Telegram do not render SVG previews.
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end(svgToPng(svg));
}
