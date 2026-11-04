# v0.4.1 visual screenshot review

Result: **Changes required; PR #16 remains draft.**

Reviewed implementation: `f60f8623f109ef6ecf79cddadc3aed1a8f17270a`.
Evidence: [Actions run 41913383193](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41913383193), artifact `13362988865` (`v041-visual-browser-qa`). Original artifact was downloaded and extracted for this review.

## Manual review scope

Seven original screenshots were individually viewed:

| Engine | Image | State |
| --- | --- | --- |
| WebKit | mobile-390-fr.png | Construction |
| Chromium | desktop-1440-en.png | Construction |
| Firefox | tablet-1024-nl.png | Construction |
| Firefox | admin-mobile-390-en.png | Administration |
| Chromium | defer-mobile-390-zh.png | Defer |
| WebKit | settlement-tablet-1024-nl.png | Settlement |
| Chromium | final-result.png | Ending, expanded numeric report |

This is representative sampling, not manual inspection of every artifact image. Languages and sizes are covered across the sample, not in every combination. The automated suite reports 44 passed and 10 intentionally skipped; screenshots alone do not establish keyboard or screen-reader correctness.

## Findings

### P1 — Construction effect badges still depend on icons

In the English desktop and French mobile construction captures, AI and publicity badges display values such as a brain icon +4 and a megaphone icon +3 without visible text naming the metric. Their explanatory text is now collapsed. The cost and power badges have text, making the missing labels particularly inconsistent.

Add localized short labels to every effect badge, with suitable accessible names and hidden decorative icons. Clearly distinguish per-turn AI production from accumulated AI results. Verify all four languages at 390 px after the labels are added.

### P2 — Repeated building names lengthen disclosure controls

Every disclosure repeats the full action title, icon and trailing arrow. French mobile and Dutch tablet captures wrap several summaries over two lines; the long control competes with the action above it.

Use a short visible localized disclosure label and associate it accessibly with its card title. Keep sufficient spacing and a clear focus indicator.

### P1 — Screenshot coverage does not demonstrate the default compact experience

The browser test opens detailed indicators before capturing construction, administration, defer and settlement. Those captures show both the compact strip and the six full KPI cards, so they cannot establish the intended default reduction in reading and scrolling.

Capture the default collapsed KPI state separately from the expanded state. Also capture a building disclosure open, an upgrade card closed/open, and the viewport immediately after using the decision jump. Measure the decision position in consistent deterministic states across four languages.

## Positive observations

- The compact six-metric strip, decision jump, selected map tile and municipal action tabs are visually distinguishable.
- No obvious horizontal clipping, overlapping labels or broken card borders appeared in the seven reviewed captures.
- Long French/Dutch text wraps inside the inspected cards.
- Administration and defer values retain visible text labels in the sample.
- Settlement primary button and ending title have clear visual hierarchy.

## Follow-up

Resolve the findings, rerun affected checks and review new captures before marking the visual acceptance complete. Complete keyboard and screen-reader validation separately. No merge was performed during this screenshot review.
