# APY comparison

Snapshot block 9452029 at 2026-11-07T05:07:38.899Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.0% | 29.9% | +0.0 pp |
| 51 lium.io | 27.5% | 27.5% | +0.0 pp |
| 4 Targon | 28.2% | 28.0% | +0.1 pp |
| 8 Vanta | 34.6% | 43.7% | -9.0 pp |
| 3 Teutonic | 42.0% | 42.1% | -0.1 pp |
| 120 Affine | 37.0% | 37.0% | +0.1 pp |
| 44 Score | 25.1% | 27.5% | -2.4 pp |
| 9 iota | 31.6% | 31.5% | +0.1 pp |
| 56 Gradients | 42.4% | 42.4% | +0.0 pp |
| 68 NOVA | 31.2% | 31.1% | +0.1 pp |
| 35 Jacob Robert Steeves | 212.4% | 48.5% | +164.0 pp |
| 16 Subnet 16 | 596.3% | 592.7% | +3.6 pp |
| 103 Terza Inference | 176.9% | 175.7% | +1.2 pp |
| 36 Weir | 186.5% | 179.5% | +7.0 pp |
| 70 Fugal | 210.3% | 207.8% | +2.5 pp |
