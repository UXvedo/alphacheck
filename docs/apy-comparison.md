# APY comparison

Snapshot block 9459264 at 2026-11-08T05:14:44.796Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 29.9% | 29.8% | +0.0 pp |
| 51 lium.io | 27.4% | 27.4% | +0.0 pp |
| 4 Targon | 28.0% | 27.9% | +0.1 pp |
| 8 Vanta | 34.4% | 43.4% | -9.0 pp |
| 3 Teutonic | 41.8% | 41.9% | -0.1 pp |
| 120 Affine | 37.0% | 36.9% | +0.1 pp |
| 44 Score | 25.1% | 27.6% | -2.5 pp |
| 9 iota | 31.5% | 31.5% | +0.1 pp |
| 56 Gradients | 42.4% | 42.3% | +0.1 pp |
| 68 NOVA | 31.1% | 31.1% | +0.1 pp |
| 35 Jacob Robert Steeves | 203.4% | 47.7% | +155.8 pp |
| 16 Subnet 16 | 520.7% | 517.4% | +3.3 pp |
| 103 Terza Inference | 175.2% | 173.8% | +1.4 pp |
| 36 Weir | 181.5% | 173.2% | +8.3 pp |
| 70 Fugal | 174.9% | 173.2% | +1.8 pp |
