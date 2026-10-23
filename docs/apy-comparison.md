# APY comparison

Snapshot block 9343771 at 2026-10-23T04:14:18.226Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.4% | 30.3% | +0.1 pp |
| 51 lium.io | 28.6% | 28.6% | +0.0 pp |
| 4 Targon | 28.1% | 27.9% | +0.1 pp |
| 8 Vanta | 36.1% | 45.4% | -9.3 pp |
| 3 Teutonic | 40.8% | 40.9% | -0.1 pp |
| 120 Affine | 38.2% | 38.2% | +0.1 pp |
| 44 Score | 24.9% | 25.2% | -0.3 pp |
| 9 iota | 31.9% | 31.9% | +0.1 pp |
| 56 Gradients | 42.4% | 42.3% | +0.1 pp |
| 68 NOVA | 32.4% | 32.3% | +0.1 pp |
| 35 Subnet 35 | 193.3% | 19.5% | +173.7 pp |
| 16 Zero Hour | 90.5% | 1.7% | +88.9 pp |
| 103 Subnet 103 | 400.7% | 394.5% | +6.2 pp |
| 36 Epago | 184.0% | 15.2% | +168.8 pp |
| 70 Consted 2.0 | 214.2% | 105.9% | +108.2 pp |
