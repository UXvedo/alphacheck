# APY comparison

Snapshot block 9394431 at 2026-10-30T05:06:15.958Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.3% | 30.2% | +0.1 pp |
| 51 lium.io | 27.6% | 27.6% | +0.0 pp |
| 4 Targon | 28.4% | 28.3% | +0.1 pp |
| 8 Vanta | 35.7% | 44.7% | -9.0 pp |
| 3 Teutonic | 40.6% | 40.6% | -0.1 pp |
| 120 Affine | 37.6% | 37.6% | +0.1 pp |
| 44 Score | 25.5% | 25.8% | -0.3 pp |
| 9 iota | 32.0% | 31.9% | +0.1 pp |
| 56 Gradients | 43.1% | 42.9% | +0.1 pp |
| 68 NOVA | 32.2% | 32.1% | +0.1 pp |
| 35 Subnet 35 | 201.3% | 34.8% | +166.5 pp |
| 16 Subnet 16 | n/a | n/a | n/a |
| 103 Terza Inference | 181.4% | 180.0% | +1.5 pp |
| 36 Bittensor | 218.8% | 35.4% | +183.4 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
