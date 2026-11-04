# v0.2.1 — Municipal Actions (draft)

## Problem corrected

A 3×3 map has nine plots but a 12-turn game previously required a plot-based construction or maintenance decision every turn. It also allowed an occupied plot to be overwritten without any demolition explanation. The new phase lets the mayor choose meaningful **non-construction** actions.

## One city action per round

Every round still follows **policy event → city action → settlement**. The internally named `build` phase is retained for old-save compatibility, but the UI permits:

| Action | Conditions | Cost and effect |
| --- | --- | --- |
| First redevelopment | Only an original tile; existing structure cannot be overwritten | Existing six building types and construction costs/side effects |
| Upgrade | Only developed Lv.1 tile | 60% of original cost, minimum 5; becomes Lv.2; cannot repeat |
| Consultation | Once per game; does not need plot | Treasury −6, support +5 |
| Industrial research | Once per game; does not need plot | Treasury −7, accumulated AI achievement +6, hype +1 |
| Investor financing | Once per game; does not need plot | Treasury +8, support −3, hype +2, promise debt +2 |
| Fiscal/procedure audit | Once per game; does not need plot | Treasury −4, support +2, hype −3, promise debt −1 (floored at zero) |
| Defer | Can be selected every round; does not need plot | Support −2, promise debt +1 |

The four administrative actions can each be used at most once, preventing free/repeated farming of benefits. Deferral always carries a political penalty.

## Upgrades and economy

The new tile `level` is `1` when first built and `2` after upgrading. A facility keeps its identity and original plot; its upgrade does **not** increase the number of redeveloped productive airport plots.

- AI output: upgrade adds `ceil(base AI output / 2)` per round.
- Upgraded AI-producing buildings require one more unit of electricity per round.
- Upgraded power stations add 3 units of electricity supply; no extra grid demand.
- Upgraded market adds 1 unit of business revenue per round.
- Upgraded park gives an immediate +3 support; upgraded show hall +5 hype.
- Upgrades count toward cumulative **public construction expense** so they cannot circumvent the original no-public-money promise.

## Preserve the satire and existing rules

12 rounds, 9 plots, 15 randomized policy cards, airport financial opportunity costs, three milestones and five ending categories remain. Airport runway/tower dependence stays unchanged. Upgrades and research can make AI development feasible without demolishing new buildings.

## Save compatibility and limitations

The version 2 save key remains `absurd-mayor-v02`. Old v0.2 records with no `level`, `adminUsed`, or `deferred` fields are normalized on load; other save checks remain in place. The same HTML file is used for the prototype; this branch is marked v0.2.1 draft by its documentation rather than replacing release v0.2 in main.

**Not included:** deliberate demolition/replacement, a third building level, new ending classes, or a full rebalancing of 600+ strategy simulations. Those are separate choices for a future version.

## Acceptance

- Complete 12 rounds without re-developing the same plot, and also with zero plot developments.
- Upgrades only once per developed plot.
- Repeated administrative actions rejected.
- Old v0.2 saved games resume.
- Screen controls remain readable in all four languages and tested viewport widths.
- Do not merge before browser and game-state tests pass.
