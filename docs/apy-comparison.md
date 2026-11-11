# APY comparison

Snapshot block 9480841 at 2026-11-11T05:10:57.907Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 29.6% | 29.6% | -0.0 pp |
| 51 lium.io | 27.5% | 27.5% | +0.0 pp |
| 4 Targon | 27.8% | 27.7% | +0.1 pp |
| 8 Vanta | 33.6% | 42.4% | -8.7 pp |
| 3 Teutonic | 41.8% | 41.9% | -0.1 pp |
| 120 Affine | 36.4% | 36.3% | +0.1 pp |
| 44 Score | 24.9% | 27.4% | -2.4 pp |
| 9 iota | 31.5% | 31.5% | +0.1 pp |
| 56 Gradients | 42.8% | 42.7% | +0.1 pp |
| 68 NOVA | 31.4% | 31.3% | +0.1 pp |
| 35 Jacob Robert Steeves | 225.4% | 57.3% | +168.2 pp |
| 16 Subnet 16 | 310.5% | 308.9% | +1.7 pp |
| 103 Terza Inference | 149.5% | 148.2% | +1.3 pp |
| 36 Weir | 129.5% | 124.6% | +4.9 pp |
| 70 Fugal | 153.7% | 152.2% | +1.4 pp |
