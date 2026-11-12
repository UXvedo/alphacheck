# APY comparison

Snapshot block 9488015 at 2026-11-12T05:05:37.206Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.8% | 30.8% | -0.1 pp |
| 51 lium.io | 28.2% | 28.2% | +0.0 pp |
| 4 Targon | 28.3% | 28.2% | +0.1 pp |
| 8 Vanta | 33.5% | 42.2% | -8.7 pp |
| 3 Teutonic | 43.6% | 43.7% | -0.1 pp |
| 120 Affine | 36.8% | 36.7% | +0.1 pp |
| 44 Score | 25.0% | 27.4% | -2.4 pp |
| 9 iota | 31.5% | 31.4% | +0.1 pp |
| 56 Gradients | 42.8% | 42.8% | -0.0 pp |
| 68 NOVA | 31.5% | 31.4% | +0.1 pp |
| 35 Subnet 35 | n/a | n/a | n/a |
| 16 Subnet 16 | 288.4% | 287.0% | +1.5 pp |
| 103 Terza Inference | 146.8% | 145.5% | +1.3 pp |
| 36 Weir | 130.7% | 125.3% | +5.4 pp |
| 70 Fugal | 153.9% | 152.7% | +1.2 pp |
