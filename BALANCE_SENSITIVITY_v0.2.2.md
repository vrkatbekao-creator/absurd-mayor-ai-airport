# v0.2.2 — Supplementary Strategy Sensitivity (2026-11-04)

## Question

Does the aggressive redevelopment plan fail because of **insufficient power**, or because it dismantles airport revenue too soon? Can a relatively low-cost, minimal AI development also meet the AI miracle conditions?

All findings below were **actually generated using the embedded game engine** through [GitHub Actions #41854374423](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41854374423). It compares **11 strategies × 100 shared deterministic decks = 1,100 complete games**.

## New experiments

| Planner | Treasury (mean) | Support (mean) | AI achievement (mean) | Cumulative airport loss | Throughput | Financial distress | Endings |
|---|---:|---:|---:|---:|---:|---:|---|
| Aggressive (unplanned power) | −109.29 | 23.71 | 200.72 | 96 | 0 | 100/100 | Heater 100 |
| **Power-aware aggressive** | −77.21 | 42.79 | 233.72 | 80 | 0 | 100/100 | Airport / policy U-turn 100 |
| **Late runway demolition** | −37.00 | 44.03 | 250.72 | 65 | 0 | 100/100 | Airport / policy U-turn 100 |
| **Minimal AI** (2 laboratories + upgrades) | **58.36** | **69.98** | 145.72 | 35 | 50 | **0/100** | **AI miracle 98**, airport 2 |
| Gradual transition | 35.99 | 73.59 | 164.72 | 39 | 35 | 23/100 | AI miracle 99, airport 1 |
| Upgrade-led | 39.31 | 68.70 | 183.72 | 34 | 50 | 12/100 | AI miracle 100 |

The original other five scenarios remain unchanged and are included in the machine-readable artifact.

## Interpretation

1. **Power shortage is not the whole cause.** In the power-aware aggressive plan, the heating-ending problem disappears, but all 100 endings remain non-miracles because public capital expenses and lost airport income leave treasury negative. Even postponing runway/tower demolition produces negative treasury in all tested decks.
2. **The low-spending two-plot option is a stronger challenge to balance.** Building and upgrading two labs on productive airport plots preserves throughput at 50/80, with only 58 public construction expense, and achieves a miracle on 98/100 decks. It is not obvious whether this should be a valuable “sensible mayor” strategy or whether the challenge has become too easy.
3. **Current miracle conditions evaluate financial sustainability only at the end.** They do not explicitly require a number of jobs or any carbon reduction; these are currently storytelling proxies. Do not label an endpoint improvement as a real jobs/climate benefit.
4. **The highest priority is a forecast UI**, not arbitrary nerfing. Before a player decides to convert the runway/tower, they should see that live airport revenue will drop to zero and power needs could exceed capacity.
5. A useful **candidate sensitivity design** would vary one parameter at a time: extra upgrade energy consumption, upgrade construction price, or a separate capital-adjusted net value indicator. This branch does **not** modify the shipped economic rules, since the sample is not an exhaustive strategy search nor a human playtest.

## Decision

Keep the v0.2.1 numerical baseline unchanged in this audit; implement clear, localized fiscal/power/aviation previews in the next UX branch. After the forecast is understandable, rerun with representative human decisions and an explicit parametric experiment before changing the five ending rules.

The exercise is comparative, not an estimate of real-world aviation, public finance, carbon emissions or AI employment.
