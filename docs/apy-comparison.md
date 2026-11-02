# APY comparison

Snapshot block 9416044 at 2026-11-02T05:09:31.923Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.2% | 30.2% | +0.1 pp |
| 51 lium.io | 27.6% | 27.6% | +0.0 pp |
| 4 Targon | 28.1% | 28.0% | +0.1 pp |
| 8 Vanta | 35.4% | 42.8% | -7.4 pp |
| 3 Teutonic | 40.8% | 40.9% | -0.1 pp |
| 120 Affine | 37.4% | 37.4% | +0.1 pp |
| 44 Score | 25.4% | 25.7% | -0.3 pp |
| 9 iota | 32.1% | 32.0% | +0.1 pp |
| 56 Gradients | 42.4% | 42.3% | +0.1 pp |
| 68 NOVA | 32.0% | 31.9% | +0.1 pp |
| 35 Jacob Robert Steeves | 220.6% | 43.3% | +177.3 pp |
| 16 Subnet 16 | n/a | n/a | n/a |
| 103 Terza Inference | 156.0% | 155.0% | +1.0 pp |
| 36 Bittensor | 212.2% | 39.8% | +172.4 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
