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

Break-even days, max safe stake, the leaderboard, and dynamic share images are hidden on Vercel Production and shown on Preview.

| Environment | Flag |
| --- | --- |
| `VERCEL_ENV=production` | off |
| `VERCEL_ENV=preview` (Preview deployments) | on |
| `npm run dev` or `npm run build` with `VERCEL_ENV` unset | on |
| `FEATURES_ON=1` | on, including Production |

The static site reads the flag at **build** time. The share-image endpoint (`/api/og`) reads it per request. To show the tools on the production site, set `FEATURES_ON` to `1` for the Production environment in the Vercel project and redeploy. To build a production bundle locally:

```bash
VERCEL_ENV=production npm run build
```

`FEATURES_ON` must be the character `1`. Other values do not turn the flag on.

Share images are SVG templates. Subnet and stake size come from the page or from the calculator's `sn`, `amt`, `days`, and `take` query params (`hk` selects a validator in the calculator). Estimated APY, break-even days, and 30-day net TAO stay the literal text PLACEHOLDER. Subnet pages point `og:image` at `/og/sn/<netuid>.svg`. The calculator's Share image link points at `/api/og` with the same params. `vite` and `vite preview` serve that route locally; on Vercel it is `api/og.js`.

## Math

Slippage, swaps, and APY live in `src/swap-math.js`. The calculator, `scripts/gen-pages.mjs`, history snapshots, and the flagged tools all call that module. `src/calc.js` only re-exports it. A formula fix should land in `src/swap-math.js`. `npm test` checks the audited behaviour: equal weights match a constant-product pool, the fee and the balancer weights follow the chain formulas, APY divides by staked alpha, and holding periods compound per epoch.

## Pages

- `/methodology/` is linked from the nav and footer and listed in the sitemap. It states the audited formulas, assumptions, and sources. A same-block APY comparison for fifteen subnets is in `docs/apy-comparison.md`.
- `/impressum/` and `/privacy/` are German-law drafts with `[PLACEHOLDER]` fields. They are not linked, not in the sitemap, and marked `noindex`. Fill them in before adding links or removing `noindex`.
- Vercel Web Analytics (`@vercel/analytics`, cookieless, free tier) loads on each page. Enable it for the project in the Vercel dashboard or it will not record views.
- `newsletter/issue.md` and `newsletter/issue.html` are the weekly template. They have no figures.
