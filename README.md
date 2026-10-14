# AlphaCheck

Plain-English "real yield" calculator for Bittensor ($TAO) staking. Pick root or a subnet, enter an amount and holding period, and see estimated rewards alongside what you'd actually end up with in TAO if the subnet's alpha token moves (-50%, -20%, flat, +20%), including slippage, compared with root staking.

APYs are estimates derived from on-chain emissions, not exact validator yields.

## Usage

```bash
npm install
npm run snapshot   # fetch fresh Bittensor chain data into the site
npm run build      # build the static site into dist/
npm run dev        # local dev server
```
