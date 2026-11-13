# APY comparison

Snapshot block 9495217 at 2026-11-13T05:06:07.062Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 31.1% | 31.2% | -0.1 pp |
| 51 lium.io | 28.0% | 28.0% | +0.0 pp |
| 4 Targon | 28.3% | 28.2% | +0.1 pp |
| 8 Vanta | 33.0% | 41.6% | -8.6 pp |
| 3 Teutonic | 44.5% | 44.7% | -0.2 pp |
| 120 Affine | 37.0% | 36.9% | +0.1 pp |
| 44 Score | 25.2% | 27.7% | -2.5 pp |
| 9 iota | 31.5% | 31.4% | +0.1 pp |
| 56 Gradients | 42.9% | 42.8% | +0.1 pp |
| 68 NOVA | 31.7% | 31.6% | +0.1 pp |
| 35 Subnet 35 | 237.9% | 236.4% | +1.5 pp |
| 16 Subnet 16 | 272.9% | 269.1% | +3.8 pp |
| 103 Terza Inference | 144.0% | 142.4% | +1.5 pp |
| 36 Weir | 131.7% | 126.1% | +5.7 pp |
| 70 Fugal | 152.1% | 150.3% | +1.7 pp |
