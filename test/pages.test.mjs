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

test('production pages include yield tools; FEATURES_ON=0 hides them', () => {
  generate({VERCEL_ENV: 'production'});
  const prod = fs.readFileSync('sn/1/index.html', 'utf8');
  assert.match(prod, /Data as of/);
  assert.match(prod, /href="\/methodology\/"/);
  assert.match(prod, /href="\/leaderboard\/"/);
  assert.match(prod, /Break-even days/);
  assert.match(prod, /Max safe stake/);
  assert.match(prod, /\/api\/og\?sn=1/);
  assert.doesNotMatch(prod, /PLACEHOLDER/);
  assert.doesNotMatch(prod, /href="\/impressum\/"/);
  assert.doesNotMatch(prod, /href="\/privacy\/"/);
  const svg = fs.readFileSync('public/og/sn/1.svg', 'utf8');
  assert.match(svg, /Est\. APY/);
  assert.match(svg, /%/);
  assert.match(svg, /30-day net TAO/);
  assert.doesNotMatch(svg, /PLACEHOLDER/);
  const board = fs.readFileSync('leaderboard/index.html', 'utf8');
  assert.match(board, /30-day net TAO/);
  assert.match(board, /href="\/sn\/1\/"/);
  assert.doesNotMatch(board, /worst/i);
  const method = fs.readFileSync('methodology/index.html', 'utf8');
  assert.match(method, /staked alpha/);
  assert.match(method, /FeeRate/);
  assert.doesNotMatch(method, /TODO/);
  assert.match(method, /estimates, not financial advice/i);
  const impressum = fs.readFileSync('impressum/index.html', 'utf8');
  assert.match(impressum, /noindex/);
  assert.match(impressum, /\[PLACEHOLDER/);
  assert.match(fs.readFileSync('privacy/index.html', 'utf8'), /Vercel Web Analytics/);
  assert.match(fs.readFileSync('privacy/index.html', 'utf8'), /Buttondown/);
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  assert.match(sitemap, /\/methodology\//);
  assert.match(sitemap, /\/leaderboard\//);
  assert.doesNotMatch(sitemap, /impressum|privacy/);
  assert.match(fs.readFileSync('how-it-works/index.html', 'utf8'), /price = taoIn ÷ alphaIn/);

  generate({VERCEL_ENV: 'production', FEATURES_ON: '0'});
  const off = fs.readFileSync('sn/1/index.html', 'utf8');
  assert.doesNotMatch(off, /Break-even days/);
  assert.doesNotMatch(off, /Max safe stake/);
  assert.doesNotMatch(off, /href="\/leaderboard\/"/);
  assert.equal(fs.existsSync('leaderboard/index.html'), false);
  assert.equal(fs.existsSync('public/og/sn/1.svg'), false);
  assert.doesNotMatch(fs.readFileSync('public/sitemap.xml', 'utf8'), /leaderboard/);
  assert.match(fs.readFileSync('public/sitemap.xml', 'utf8'), /\/methodology\//);
});
