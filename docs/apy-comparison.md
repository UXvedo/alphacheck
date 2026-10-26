# APY comparison

Snapshot block 9365643 at 2026-10-26T05:08:38.198Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.3% | 30.2% | +0.1 pp |
| 51 lium.io | 28.2% | 28.2% | +0.0 pp |
| 4 Targon | 27.3% | 27.2% | +0.1 pp |
| 8 Vanta | 36.4% | 45.7% | -9.3 pp |
| 3 Teutonic | 40.6% | 40.7% | -0.1 pp |
| 120 Affine | 37.8% | 37.7% | +0.1 pp |
| 44 Score | 24.7% | 25.0% | -0.3 pp |
| 9 iota | 31.6% | 31.5% | +0.1 pp |
| 56 Gradients | 42.5% | 42.4% | +0.1 pp |
| 68 NOVA | 32.3% | 32.2% | +0.1 pp |
| 35 Subnet 35 | 199.1% | 26.3% | +172.7 pp |
| 16 Zero Hour | 85.2% | 2.4% | +82.7 pp |
| 103 Subnet 103 | 273.5% | 265.4% | +8.1 pp |
| 36 Epago | 185.6% | 21.4% | +164.1 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
