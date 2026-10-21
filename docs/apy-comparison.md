# APY comparison

Snapshot block 9329378 at 2026-10-21T04:13:40.952Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.6% | 30.5% | +0.1 pp |
| 51 lium.io | 28.9% | 28.9% | +0.0 pp |
| 4 Targon | 28.2% | 28.1% | +0.1 pp |
| 8 Vanta | 36.5% | 45.9% | -9.4 pp |
| 3 Teutonic | 40.8% | 40.8% | -0.1 pp |
| 120 Affine | 37.6% | 37.5% | +0.1 pp |
| 44 Score | 24.7% | 25.0% | -0.3 pp |
| 9 iota | 32.1% | 32.1% | +0.1 pp |
| 56 Gradients | 43.1% | 43.0% | +0.0 pp |
| 68 NOVA | 32.1% | 32.1% | +0.1 pp |
| 35 Subnet 35 | 209.3% | 16.8% | +192.4 pp |
| 16 Zero Hour | 91.0% | 1.2% | +89.9 pp |
| 103 Subnet 103 | n/a | n/a | n/a |
| 36 Epago | 195.6% | 11.8% | +183.8 pp |
| 70 Consted 2.0 | 184.9% | 90.4% | +94.5 pp |
