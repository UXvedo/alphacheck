# APY comparison

Snapshot block 9401631 at 2026-10-31T05:06:13.746Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.2% | 30.2% | +0.1 pp |
| 51 lium.io | 27.4% | 27.4% | +0.0 pp |
| 4 Targon | 28.4% | 28.3% | +0.1 pp |
| 8 Vanta | 35.7% | 44.8% | -9.1 pp |
| 3 Teutonic | 40.9% | 41.1% | -0.1 pp |
| 120 Affine | 37.7% | 37.6% | +0.1 pp |
| 44 Score | 25.5% | 25.8% | -0.3 pp |
| 9 iota | 32.2% | 32.1% | +0.1 pp |
| 56 Gradients | 43.1% | 43.0% | +0.1 pp |
| 68 NOVA | 32.3% | 32.2% | +0.1 pp |
| 35 Jacob Robert Steeves | 226.5% | 41.1% | +185.4 pp |
| 16 Subnet 16 | n/a | n/a | n/a |
| 103 Terza Inference | 170.8% | 169.6% | +1.2 pp |
| 36 Bittensor | 201.4% | 34.2% | +167.2 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
