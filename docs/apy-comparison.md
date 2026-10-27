# APY comparison

Snapshot block 9372829 at 2026-10-27T05:05:51.035Z.

New APY is the audited emission estimate: alpha emitted per block × 0.41 × (1 − root proportion) × (1 − stake-weighted validator take) × blocks per year ÷ staked alpha.

Reference is the realized nominator APY from the last epoch: the sum of `AlphaDividendsPerSubnet` (already net of take) × epochs per year ÷ staked alpha. Epochs per year are 7,200 ÷ (tempo + 1) × 365. One epoch is indicative, not a 7-day average.

| Subnet | New APY | Reference | Delta |
| --- | --- | --- | --- |
| 64 Chutes | 30.4% | 30.3% | +0.1 pp |
| 51 lium.io | 28.1% | 28.1% | +0.0 pp |
| 4 Targon | 27.5% | 27.4% | +0.1 pp |
| 8 Vanta | 36.4% | 45.7% | -9.3 pp |
| 3 Teutonic | 40.5% | 40.6% | -0.1 pp |
| 120 Affine | 37.1% | 37.0% | +0.1 pp |
| 44 Score | 24.8% | 25.1% | -0.3 pp |
| 9 iota | 31.7% | 31.7% | +0.1 pp |
| 56 Gradients | 42.6% | 42.5% | +0.1 pp |
| 68 NOVA | 32.3% | 32.2% | +0.1 pp |
| 35 Subnet 35 | 195.0% | 27.6% | +167.4 pp |
| 16 Zero Hour | 82.9% | 2.6% | +80.3 pp |
| 103 Subnet 103 | 261.6% | 253.2% | +8.4 pp |
| 36 Bittensor | 182.3% | 22.7% | +159.6 pp |
| 70 Subnet 70 | n/a | n/a | n/a |
