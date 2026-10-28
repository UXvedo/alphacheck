# APY comparison

Snapshot block 9380033 at 2026-10-28T05:06:34.374Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.3% | 30.2% | +0.1 pp |
| 51 lium.io | 28.0% | 27.9% | +0.0 pp |
| 4 Targon | 28.1% | 28.0% | +0.1 pp |
| 8 Vanta | 36.6% | 46.0% | -9.4 pp |
| 3 Teutonic | 40.2% | 40.3% | -0.1 pp |
| 120 Affine | 37.1% | 37.1% | +0.1 pp |
| 44 Score | 24.9% | 25.2% | -0.3 pp |
| 9 iota | 31.9% | 31.8% | +0.1 pp |
| 56 Gradients | 43.1% | 43.0% | +0.1 pp |
| 68 NOVA | 32.5% | 32.4% | +0.1 pp |
| 35 Subnet 35 | 191.2% | 28.7% | +162.5 pp |
| 16 Zero Hour | 79.8% | 2.8% | +77.1 pp |
| 103 Terza Inference | 187.5% | 184.2% | +3.3 pp |
| 36 Bittensor | 162.9% | 21.8% | +141.1 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
