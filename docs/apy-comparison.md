# APY comparison

Snapshot block 9473651 at 2026-11-10T05:12:56.675Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 29.8% | 29.8% | +0.0 pp |
| 51 lium.io | 27.5% | 27.5% | +0.0 pp |
| 4 Targon | 27.6% | 27.5% | +0.1 pp |
| 8 Vanta | 33.7% | 42.4% | -8.7 pp |
| 3 Teutonic | 41.8% | 41.9% | -0.1 pp |
| 120 Affine | 36.8% | 36.7% | +0.1 pp |
| 44 Score | 25.0% | 27.4% | -2.4 pp |
| 9 iota | 31.5% | 31.5% | +0.1 pp |
| 56 Gradients | 42.7% | 42.6% | +0.1 pp |
| 68 NOVA | 31.2% | 31.2% | +0.1 pp |
| 35 Jacob Robert Steeves | 222.0% | 55.0% | +167.0 pp |
| 16 Subnet 16 | 525.7% | 522.7% | +3.0 pp |
| 103 Terza Inference | 163.7% | 162.2% | +1.5 pp |
| 36 Weir | 167.0% | 158.8% | +8.2 pp |
| 70 Fugal | 189.2% | 187.0% | +2.3 pp |
