# APY comparison

Snapshot block 9300624 at 2026-10-17T04:08:33.990Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.7% | 30.6% | +0.1 pp |
| 51 lium.io | 29.1% | 29.1% | +0.0 pp |
| 4 Targon | 28.3% | 28.2% | +0.1 pp |
| 8 Vanta | 37.8% | 37.9% | -0.2 pp |
| 3 Teutonic | 39.0% | 39.1% | -0.1 pp |
| 120 Affine | 37.9% | 37.8% | +0.1 pp |
| 44 Score | 25.1% | 25.4% | -0.3 pp |
| 9 iota | 32.1% | 32.0% | +0.1 pp |
| 56 Gradients | 43.6% | 43.5% | +0.1 pp |
| 68 NOVA | 31.4% | 31.3% | +0.1 pp |
| 35 Subnet 35 | 185.1% | 184.3% | +0.8 pp |
| 16 kenju run next week | 86.4% | 86.3% | +0.1 pp |
| 103 Consted | 137.7% | 132.9% | +4.8 pp |
| 36 Epago | 169.8% | 168.9% | +1.0 pp |
| 70 Pending | 158.1% | 158.0% | +0.1 pp |
