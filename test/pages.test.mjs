import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

function generate(extra) {
  const env = {...process.env, ...extra};
  delete env.FEATURES_ON;
  if (extra.FEATURES_ON) env.FEATURES_ON = extra.FEATURES_ON;
  const res = spawnSync(process.execPath, ['scripts/gen-pages.mjs'], {env, encoding: 'utf8'});
  assert.equal(res.status, 0, res.stderr || res.stdout);
}

test('production pages hide flagged features; preview pages show them', () => {
  generate({VERCEL_ENV: 'production'});
  const prod = fs.readFileSync('sn/1/index.html', 'utf8');
  assert.match(prod, /Data as of/);
  assert.match(prod, /href="\/methodology\/"/);
  assert.doesNotMatch(prod, /Break-even days/);
  assert.doesNotMatch(prod, /Max safe stake/);
  assert.doesNotMatch(prod, /href="\/leaderboard\/"/);
  assert.doesNotMatch(prod, /href="\/impressum\/"/);
  assert.doesNotMatch(prod, /href="\/privacy\/"/);
  assert.equal(fs.existsSync('leaderboard/index.html'), false);
  assert.equal(fs.existsSync('public/og/sn/1.svg'), false);
  assert.match(fs.readFileSync('methodology/index.html', 'utf8'), /TODO: post-audit formula/);
  assert.match(fs.readFileSync('methodology/index.html', 'utf8'), /estimates, not financial advice/i);
  const impressum = fs.readFileSync('impressum/index.html', 'utf8');
  assert.match(impressum, /noindex/);
  assert.match(impressum, /\[PLACEHOLDER/);
  assert.match(fs.readFileSync('privacy/index.html', 'utf8'), /Vercel Web Analytics/);
  assert.match(fs.readFileSync('privacy/index.html', 'utf8'), /Buttondown/);
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  assert.match(sitemap, /\/methodology\//);
  assert.doesNotMatch(sitemap, /leaderboard|impressum|privacy/);
  assert.match(fs.readFileSync('how-it-works/index.html', 'utf8'), /price = taoIn ÷ alphaIn/);

  generate({VERCEL_ENV: 'preview'});
  const preview = fs.readFileSync('sn/1/index.html', 'utf8');
  assert.match(preview, /Break-even days/);
  assert.match(preview, /Max safe stake/);
  assert.match(preview, /Never|days/);
  assert.match(preview, /href="\/leaderboard\/"/);
  assert.match(preview, /\/api\/og\?sn=1/);
  assert.match(fs.readFileSync('public/og/sn/1.svg', 'utf8'), /PLACEHOLDER/);
  const board = fs.readFileSync('leaderboard/index.html', 'utf8');
  assert.match(board, /30-day net TAO/);
  assert.match(board, /href="\/sn\/1\/"/);
  assert.doesNotMatch(board, /worst/i);
  assert.match(fs.readFileSync('public/sitemap.xml', 'utf8'), /\/leaderboard\//);
  assert.doesNotMatch(fs.readFileSync('public/sitemap.xml', 'utf8'), /impressum|privacy/);

  generate({VERCEL_ENV: 'production', FEATURES_ON: '1'});
  assert.match(fs.readFileSync('sn/1/index.html', 'utf8'), /Break-even days/);
});
