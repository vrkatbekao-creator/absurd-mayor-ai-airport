# v0.2.2 — Strategy Balance Audit (2026-11-04)

## 1. Method and evidence

Executed the **actual embedded v0.2.1 game engine**, not an approximation, with eight fixed action planners and deterministic shuffled 12/15 event decks. Each strategy was tested against 100 shared deck seeds (800 full 12-turn games), with a shared policy-choice heuristic adapted only to publicity preference. Outputs are preserved in [Actions run #41853910746](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41853910746) as `v022-balance-baseline` artifact (`.json` and `.md`).

The seed formula is `20261104 + run_index × 7919`. The command is `node scripts/balance-v022.cjs`.

**Important:** 99/100 or 100/100 below represent **success under a particular fully specified scripted plan**, *not* real-player success rates or an exhaustive strategy search.

## 2. Comparative outcomes (all values fictional game units)

| Strategy | Average treasury | Average public support | Average AI achievement | Cumulative AI value | Cumulative airport income loss | Final throughput | Ever distressed | Ending distribution |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Airport preservation | 117.36 | 41.88 | 15.72 | 0 | 0 | 80 | 0/100 | Airport/policy turn 100 |
| Gradual transition | 35.99 | 73.59 | 164.72 | 149 | 39 | 35 | 23/100 | AI miracle 99, airport 1 |
| Aggressive conversion | −109.29 | 23.71 | 200.72 | 185 | 96 | 0 | 100/100 | Heater 100 |
| Upgrade-led | 39.31 | 68.70 | 183.72 | 168 | 34 | 50 | 12/100 | AI miracle 100 |
| Administration-led | 117.36 | 42.92 | 15.72 | 0 | 0 | 80 | 0/100 | Airport/policy turn 100 |
| Propaganda-led | 70.18 | 45.71 | 12.00 | 0 | 0 | 80 | 0/100 | PPT 100 |
| Conservation-led | 84.36 | 86.02 | 15.72 | 0 | 0 | 80 | 0/100 | Pigeon 100 |
| Legal random moves | −20.17 | 38.18 | 61.37 | 48.85 | 48.42 | 14.2 | 58/100 | Heater 30, miracle 2, pigeon 4, PPT 36, airport 28 |

## 3. Analysis

**A. The upgrade-led scripted plan is currently highly reliable.** It converts only two productive airport tiles, retains 50/80 throughput, uses building upgrades, and achieves AI miracle in all 100 tested decks. The gradual plan is similar (99/100) while retaining 35/80 throughput. These plans may be too forgiving for experienced players, although AI miracles need not be made artificially rare.

**B. Aggressive demolition is punished by two interacting constraints.** The script removes the runway and tower, immediately eliminating all airline revenues; energy demand later exceeds grid supply, so the mandatory final ending priority selects `heater`. This is a legitimate consequence of poor power planning, but the 100/100 deterministic result suggests adding a clearly visible pre-construction electricity forecast and ensuring an aggressive *but power-aware* planner is benchmarked before adjusting costs.

**C. Pure administrations and airport preservation yield high treasury but low real achievement.** These do not trivially obtain AI miracle, which is appropriate. They may be visually similar as both end in policy turn/airport category, despite different rhetoric.

**D. Propaganda and green strategies reliably trigger their thematic endings.** This is expected because these scripted plans deliberately maximize their corresponding metrics.

**E. Random legal play gives multiple endings.** This supports reachability of all five ending categories after new mechanics, though the distribution does not establish fairness.

## 4. Proposed improvement sequence

1. **P0 — Expose opportunity cost in the action preview:** show post-action airport income, electricity supply/demand, projected one-turn AI output and spending impact, particularly on runway/tower conversions and upgrades. Explicit explanation is more important than immediate nerfing.
2. **P1 — Expand benchmark coverage:** add *power-aware aggressive* and *AI-minimal* planners, test three independently selected policy heuristics, run several seeds, and collect per-turn treasury/energy trajectories.
3. **P1 — Test modest numerical changes against the frozen baseline.** Candidate variables: upgrade extra electric demand, facility operating costs, research benefit and AI miracle thresholds. Do **not** modify multiple parameters at once. Record outcome distributions, not only miracle rates.
4. **P2 — Human playtest after the above:** sample decisions at rounds 4/8/12 and ask whether the player understands that keeping the airport is economically beneficial. Physical touch tests are explicitly out of scope per project-owner decision.

## 5. Recommendation / release boundary

This is an **evidence-only v0.2.2 baseline audit**. It does not silently change v0.2.1's working economic rules. Hold any rule change until additional power-aware strategies and one-variable-at-a-time parameter comparisons can demonstrate a net improvement. The embedded economy is deliberately abstract; no results are actual employment, carbon or fiscal forecasts.
