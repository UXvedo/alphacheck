# APY comparison

Snapshot block 9358438 at 2026-10-25T05:07:34.282Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.3% | 30.2% | +0.1 pp |
| 51 lium.io | 28.2% | 28.2% | +0.0 pp |
| 4 Targon | 27.5% | 27.4% | +0.1 pp |
| 8 Vanta | 36.3% | 45.6% | -9.3 pp |
| 3 Teutonic | 40.4% | 40.5% | -0.1 pp |
| 120 Affine | 37.8% | 37.7% | +0.1 pp |
| 44 Score | 24.7% | 25.0% | -0.3 pp |
| 9 iota | 31.6% | 31.5% | +0.1 pp |
| 56 Gradients | 42.3% | 42.2% | +0.0 pp |
| 68 NOVA | 32.6% | 32.5% | +0.1 pp |
| 35 Subnet 35 | 208.7% | 25.6% | +183.1 pp |
| 16 Zero Hour | 85.6% | 2.2% | +83.4 pp |
| 103 Subnet 103 | 306.9% | 298.6% | +8.3 pp |
| 36 Epago | 172.5% | 18.0% | +154.5 pp |
| 70 Consted 2.0 | 176.5% | 88.5% | +88.0 pp |
