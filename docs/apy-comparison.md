# APY comparison

Snapshot block 9284382 at 2026-10-14T22:00:15.387Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.7% | 30.6% | +0.1 pp |
| 51 lium.io | 29.2% | 29.2% | +0.0 pp |
| 4 Targon | 28.6% | 28.5% | +0.1 pp |
| 8 Vanta | 37.7% | 37.9% | -0.2 pp |
| 3 Teutonic | 38.6% | 38.7% | -0.1 pp |
| 120 Affine | 38.1% | 38.0% | +0.1 pp |
| 44 Score | 24.9% | 25.2% | -0.3 pp |
| 9 iota | 32.2% | 32.1% | +0.1 pp |
| 56 Gradients | 43.6% | 43.6% | +0.0 pp |
| 68 NOVA | 30.7% | 30.6% | +0.1 pp |
| 35 Subnet 35 | 186.9% | 186.2% | +0.6 pp |
| 16 kenju | 91.2% | 91.3% | -0.1 pp |
| 103 Deprecated | 149.3% | 149.2% | +0.1 pp |
| 36 Epago | 172.7% | 171.8% | +0.9 pp |
| 70 Subnet 70 | 172.2% | 171.8% | +0.4 pp |
