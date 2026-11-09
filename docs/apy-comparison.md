# APY comparison

Snapshot block 9466451 at 2026-11-09T05:12:53.841Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 29.8% | 29.7% | +0.0 pp |
| 51 lium.io | 27.5% | 27.5% | +0.0 pp |
| 4 Targon | 27.8% | 27.7% | +0.1 pp |
| 8 Vanta | 34.1% | 43.0% | -8.9 pp |
| 3 Teutonic | 41.8% | 41.9% | -0.1 pp |
| 120 Affine | 36.9% | 36.8% | +0.1 pp |
| 44 Score | 25.1% | 27.5% | -2.4 pp |
| 9 iota | 31.5% | 31.4% | +0.1 pp |
| 56 Gradients | 42.7% | 42.6% | +0.1 pp |
| 68 NOVA | 31.0% | 30.9% | +0.1 pp |
| 35 Jacob Robert Steeves | 217.6% | 52.4% | +165.1 pp |
| 16 Subnet 16 | 524.2% | 521.1% | +3.1 pp |
| 103 Terza Inference | 169.1% | 167.7% | +1.4 pp |
| 36 Weir | 177.0% | 168.2% | +8.9 pp |
| 70 Fugal | 178.0% | 176.2% | +1.8 pp |
