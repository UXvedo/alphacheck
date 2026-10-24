# APY comparison

Snapshot block 9350961 at 2026-10-24T04:12:12.123Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.1% | 30.1% | +0.1 pp |
| 51 lium.io | 28.4% | 28.4% | +0.0 pp |
| 4 Targon | 27.8% | 27.7% | +0.1 pp |
| 8 Vanta | 36.2% | 45.4% | -9.3 pp |
| 3 Teutonic | 40.7% | 40.8% | -0.1 pp |
| 120 Affine | 37.7% | 37.6% | +0.1 pp |
| 44 Score | 24.8% | 25.1% | -0.3 pp |
| 9 iota | 31.7% | 31.6% | +0.1 pp |
| 56 Gradients | 42.2% | 42.2% | +0.0 pp |
| 68 NOVA | 32.6% | 32.5% | +0.1 pp |
| 35 Subnet 35 | 201.7% | 22.5% | +179.2 pp |
| 16 Zero Hour | 87.4% | 1.9% | +85.5 pp |
| 103 Subnet 103 | 358.3% | 350.1% | +8.2 pp |
| 36 Epago | 191.2% | 17.9% | +173.3 pp |
| 70 Consted 2.0 | 218.0% | 108.4% | +109.6 pp |
