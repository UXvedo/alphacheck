# APY comparison

Snapshot block 9437638 at 2026-11-05T05:09:26.977Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.0% | 30.0% | +0.0 pp |
| 51 lium.io | 27.9% | 27.8% | +0.0 pp |
| 4 Targon | 28.2% | 28.0% | +0.1 pp |
| 8 Vanta | 35.0% | 44.1% | -9.1 pp |
| 3 Teutonic | 40.6% | 40.6% | -0.1 pp |
| 120 Affine | 36.9% | 36.8% | +0.1 pp |
| 44 Score | 25.1% | 27.5% | -2.4 pp |
| 9 iota | 31.6% | 31.5% | +0.1 pp |
| 56 Gradients | 42.3% | 41.8% | +0.5 pp |
| 68 NOVA | 31.2% | 31.1% | +0.1 pp |
| 35 Jacob Robert Steeves | 208.8% | 44.9% | +163.9 pp |
| 16 Subnet 16 | 665.5% | 660.7% | +4.8 pp |
| 103 Terza Inference | 174.5% | 172.7% | +1.7 pp |
| 36 Weir | 194.0% | 189.6% | +4.4 pp |
| 70 Fugal | 209.8% | 207.4% | +2.4 pp |
