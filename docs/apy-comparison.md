# APY comparison

Snapshot block 9307813 at 2026-10-18T04:06:31.573Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.7% | 30.6% | +0.1 pp |
| 51 lium.io | 29.1% | 29.0% | +0.0 pp |
| 4 Targon | 28.3% | 28.2% | +0.1 pp |
| 8 Vanta | 37.7% | 37.9% | -0.2 pp |
| 3 Teutonic | 39.0% | 39.1% | -0.1 pp |
| 120 Affine | 37.9% | 37.8% | +0.1 pp |
| 44 Score | 24.9% | 25.3% | -0.3 pp |
| 9 iota | 32.0% | 31.9% | +0.1 pp |
| 56 Gradients | 43.4% | 43.4% | +0.0 pp |
| 68 NOVA | 31.7% | 31.6% | +0.1 pp |
| 35 Subnet 35 | 179.6% | 179.0% | +0.6 pp |
| 16 Zero Hour | 83.6% | 83.6% | +0.1 pp |
| 103 Consted | 141.4% | 147.4% | -6.0 pp |
| 36 Epago | 184.9% | 183.9% | +1.1 pp |
| 70 Consted 2.0 | 154.7% | 154.3% | +0.4 pp |
