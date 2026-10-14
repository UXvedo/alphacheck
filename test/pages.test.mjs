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
  assert.match(prod, /href="\/contact\/"/);
  assert.match(prod, /href="\/privacy\/"/);
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
  assert.equal(fs.existsSync('impressum/index.html'), false);
  for (const page of ['contact/index.html', 'privacy/index.html']) {
    const html = fs.readFileSync(page, 'utf8');
    assert.doesNotMatch(html, /noindex/);
    assert.doesNotMatch(html, /PLACEHOLDER/);
    assert.match(html, /alphacheck-dev@proton\.me/);
    assert.match(html, /href="\/privacy\/"/);
    assert.match(html, /href="\/contact\/"/);
  }
  const privacy = fs.readFileSync('privacy/index.html', 'utf8');
  assert.match(privacy, /Vercel Web Analytics/);
  assert.match(privacy, /Buttondown/);
  assert.match(privacy, /no cookies/);
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  assert.match(sitemap, /\/methodology\//);
  assert.match(sitemap, /\/leaderboard\//);
  assert.match(sitemap, /\/contact\//);
  assert.match(sitemap, /\/privacy\//);
  assert.doesNotMatch(sitemap, /impressum/);
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

test('subnet pages use PNG share images and link to a prefilled wrong-number issue', () => {
  generate({VERCEL_ENV: 'production'});
  const html = fs.readFileSync('sn/64/index.html', 'utf8');
  assert.match(html, /og:image" content="https:\/\/www\.alphacheck\.io\/og\/sn\/64\.png"/);
  assert.match(html, /twitter:image" content="https:\/\/www\.alphacheck\.io\/og\/sn\/64\.png"/);
  assert.doesNotMatch(html, /og\/sn\/64\.svg/);
  assert.match(html, /Report a wrong number/);
  assert.match(html, /issues\/new\?template=wrong-number\.yml&amp;title=Wrong\+number%3A\+SN64[^"]*subnet=64/);
  const png = fs.readFileSync('public/og/sn/64.png');
  assert.equal(png.subarray(0, 4).toString('hex'), '89504e47');
});
