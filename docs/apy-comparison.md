# APY comparison

Snapshot block 9444825 at 2026-11-06T05:06:54.473Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 29.8% | 29.8% | +0.0 pp |
| 51 lium.io | 27.5% | 27.5% | +0.0 pp |
| 4 Targon | 28.0% | 27.9% | +0.1 pp |
| 8 Vanta | 34.5% | 43.5% | -9.0 pp |
| 3 Teutonic | 40.7% | 40.8% | -0.1 pp |
| 120 Affine | 36.9% | 36.8% | +0.1 pp |
| 44 Score | 25.0% | 27.4% | -2.4 pp |
| 9 iota | 31.7% | 31.6% | +0.1 pp |
| 56 Gradients | 42.1% | 42.0% | +0.2 pp |
| 68 NOVA | 31.1% | 31.0% | +0.1 pp |
| 35 Jacob Robert Steeves | 204.3% | 45.3% | +158.9 pp |
| 16 Subnet 16 | 538.3% | 535.0% | +3.4 pp |
| 103 Terza Inference | 171.5% | 170.3% | +1.1 pp |
| 36 Weir | 176.7% | 172.1% | +4.6 pp |
| 70 Fugal | 204.3% | 202.2% | +2.1 pp |
