# APY comparison

Snapshot block 9336535 at 2026-10-22T04:07:05.033Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.6% | 30.5% | +0.1 pp |
| 51 lium.io | 28.7% | 28.7% | +0.0 pp |
| 4 Targon | 28.2% | 28.0% | +0.1 pp |
| 8 Vanta | 36.7% | 46.1% | -9.4 pp |
| 3 Teutonic | 40.8% | 41.0% | -0.1 pp |
| 120 Affine | 37.9% | 37.8% | +0.1 pp |
| 44 Score | 24.8% | 25.1% | -0.3 pp |
| 9 iota | 32.2% | 32.1% | +0.1 pp |
| 56 Gradients | 42.8% | 42.8% | +0.1 pp |
| 68 NOVA | 32.4% | 32.3% | +0.1 pp |
| 35 Subnet 35 | 205.1% | 19.3% | +185.9 pp |
| 16 Zero Hour | 91.3% | 1.4% | +90.0 pp |
| 103 Subnet 103 | 441.5% | 447.1% | -5.6 pp |
| 36 Epago | 187.2% | 14.0% | +173.3 pp |
| 70 Consted 2.0 | 202.4% | 100.3% | +102.1 pp |
