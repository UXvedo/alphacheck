# APY comparison

Snapshot block 9387238 at 2026-10-29T05:07:34.969Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.3% | 30.2% | +0.1 pp |
| 51 lium.io | 27.8% | 27.7% | +0.0 pp |
| 4 Targon | 28.5% | 28.4% | +0.1 pp |
| 8 Vanta | 35.5% | 44.7% | -9.1 pp |
| 3 Teutonic | 40.2% | 40.3% | -0.1 pp |
| 120 Affine | 37.6% | 37.5% | +0.1 pp |
| 44 Score | 25.2% | 25.5% | -0.3 pp |
| 9 iota | 31.8% | 31.7% | +0.1 pp |
| 56 Gradients | 43.2% | 43.1% | +0.1 pp |
| 68 NOVA | 32.3% | 32.2% | +0.1 pp |
| 35 Subnet 35 | 167.1% | 27.6% | +139.5 pp |
| 16 end game | 75.3% | 2.9% | +72.5 pp |
| 103 Terza Inference | 198.4% | 207.8% | -9.3 pp |
| 36 Bittensor | 151.3% | 23.0% | +128.3 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
