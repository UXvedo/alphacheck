# APY comparison

Snapshot block 9408881 at 2026-11-01T05:16:11.108Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.2% | 30.1% | +0.1 pp |
| 51 lium.io | 27.4% | 27.4% | +0.0 pp |
| 4 Targon | 28.4% | 28.3% | +0.1 pp |
| 8 Vanta | 35.5% | 44.4% | -9.0 pp |
| 3 Teutonic | 40.9% | 41.0% | -0.1 pp |
| 120 Affine | 37.5% | 37.4% | +0.1 pp |
| 44 Score | 25.5% | 25.8% | -0.3 pp |
| 9 iota | 32.1% | 32.1% | +0.1 pp |
| 56 Gradients | 42.8% | 42.7% | +0.1 pp |
| 68 NOVA | 32.2% | 32.1% | +0.1 pp |
| 35 Jacob Robert Steeves | 230.9% | 43.8% | +187.1 pp |
| 16 Subnet 16 | n/a | n/a | n/a |
| 103 Terza Inference | 157.8% | 156.6% | +1.2 pp |
| 36 Bittensor | 200.8% | 35.9% | +164.8 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
