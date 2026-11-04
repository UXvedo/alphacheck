# APY comparison

Snapshot block 9430450 at 2026-11-04T05:11:28.324Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.2% | 30.1% | +0.0 pp |
| 51 lium.io | 28.1% | 28.1% | +0.0 pp |
| 4 Targon | 28.4% | 28.3% | +0.1 pp |
| 8 Vanta | 35.2% | 44.3% | -9.1 pp |
| 3 Teutonic | 40.6% | 40.7% | -0.1 pp |
| 120 Affine | 37.2% | 37.1% | +0.1 pp |
| 44 Score | 25.3% | 27.8% | -2.4 pp |
| 9 iota | 31.9% | 31.8% | +0.1 pp |
| 56 Gradients | 42.3% | 42.2% | +0.1 pp |
| 68 NOVA | 31.2% | 31.2% | +0.1 pp |
| 35 Jacob Robert Steeves | 199.3% | 41.4% | +157.9 pp |
| 16 Subnet 16 | 433.6% | 430.3% | +3.3 pp |
| 103 Terza Inference | 161.8% | 160.9% | +0.9 pp |
| 36 Subnet 36 | n/a | n/a | n/a |
| 70 Fugal | 170.2% | 169.6% | +0.6 pp |
