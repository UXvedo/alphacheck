# AlphaCheck

Plain-English "real yield" calculator for Bittensor ($TAO) staking. Pick root or a subnet, enter an amount and holding period, and see estimated rewards alongside what you'd actually end up with in TAO if the subnet's alpha token moves (-50%, -20%, flat, +20%), including slippage, compared with root staking.

APYs are estimates derived from on-chain emissions, not exact validator yields.

## Usage

```bash
npm install
npm run snapshot   # fetch fresh Bittensor chain data into the site
npm run build      # build the static site into dist/
npm run dev        # local dev server
npm test           # math, history, and page-generation checks
```

## Daily history

`npm run snapshot` writes `public/snapshot.json` and upserts one record per subnet into `data/history/YYYY-MM-DD.json` (UTC day), then updates `data/history/index.json`. A second run on the same UTC day replaces that day's file. Older days are left as they were. Each record stores alpha price, pool TAO, pool alpha, emissions (alpha per block), that subnet's stake-weighted validator take, estimated APY from `src/swap-math.js` at that take, block, and the UTC timestamp. Root's estimated APY is the root APY (each subnet's own take, after selling one epoch of root dividends). History files are version 2.

`npm run check-stale` exits nonzero when `public/snapshot.json` is missing or older than 36 hours. The site shows the same cutoff in a banner, and every page includes "Data as of <UTC timestamp>".

## Feature flag

Break-even days, max safe stake, the leaderboard, and share images are **on by default**, including a Vercel production build. Nothing has to be set in the Vercel dashboard.

The switch lives in `src/features.js` as `FEATURES_DEFAULT`. Set it to `false` and redeploy to hide the tools again. `FEATURES_ON=0` does the same without editing the file: the static site reads it at **build** time, and `/api/og` reads it on each request. `FEATURES_ON=1` forces the tools on. Only the characters `0` and `1` are special. `VERCEL_ENV` does not change the flag.

To build a bundle with the tools hidden:

```bash
FEATURES_ON=0 npm run build
```

Share images are SVG. Subnet pages point `og:image` at `/og/sn/<netuid>.svg` (100 TAO, that subnet's stake-weighted take). The calculator's Share image link points at `/api/og` with `sn`, `amt`, `days`, and `take` (`hk` selects a validator in the calculator; `take` is a percent). Estimated APY, break-even days, and 30-day net TAO are filled from `src/swap-math.js` at a flat alpha price. `vite` and `vite preview` serve `/api/og` locally; on Vercel it is `api/og.js`.

## Math

Slippage, swaps, and APY live in `src/swap-math.js`. The calculator, `scripts/gen-pages.mjs`, history snapshots, and the flagged tools all call that module. `src/calc.js` only re-exports it. A formula fix should land in `src/swap-math.js`. `npm test` checks the audited behaviour: equal weights match a constant-product pool, the fee and the balancer weights follow the chain formulas, APY divides by staked alpha, and holding periods compound per epoch.

## Pages

- `/methodology/` is linked from the nav and footer and listed in the sitemap. It states the audited formulas, assumptions, and sources. A same-block APY comparison for fifteen subnets is in `docs/apy-comparison.md`.
- `/contact/` (email only: alphacheck-dev@proton.me) and `/privacy/` (English, international) are public, linked in every footer, and listed in the sitemap.
- Vercel Web Analytics (`@vercel/analytics`, cookieless, free tier) loads on each page. Enable it for the project in the Vercel dashboard or it will not record views.
- `newsletter/issue.md` and `newsletter/issue.html` are the weekly template. They have no figures.
