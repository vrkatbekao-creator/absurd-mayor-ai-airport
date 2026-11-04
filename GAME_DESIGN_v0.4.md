# v0.4 Visual First — Game Design & QA Scope

## Goal

Make each choice legible in under a glance: display the **consequence before prose**, then keep detailed explanations available. This is a visual/design iteration of v0.3 and does not alter the economic engine.

## Shipped experimental interface

- **Six metric cards** with icons, values, proportion bars and accessible text labels: budget, operational flight throughput, support, AI score, publicity, and electricity margin. Progress bars are a *visual comparison scale*, not new rules. Their fill is clamped between 0 and 100% and absolute values remain visible when negative or above the display scale.
- **3×3 city map** with visually distinct surface treatment for original airport, AI lab, data centre, exhibition hall, electricity, park and business district. Emoji pictograms use existing building data, with Lv.1/Lv.2 tags, grounded flight warning and power-shortage warning. The map remains nine accessible buttons and each retains its complete title.
- **12-turn timeline** with current round, past turns, and milestone ticks at turns 4, 8 and 12.
- **Policy effect chips** for money, support, AI, publicity, pledge debt, and delayed costs. Icon, signed number and concise readable label appear together. All original event titles/descriptions and detailed numerical effect text are retained.
- **Construction/upgrade/administration cards** show cost and effects first, with previous detailed copy beneath.
- **Election result** has an illustrated ending-specific scene symbol, two-column airport-loss versus AI-value comparison, optional detailed numerical report, and the existing three-promise audit.

## Boundaries

- Game remains a **standalone HTML file**: `荒謬市長_v0.4.html`, with no remote JS/CSS/image dependencies.
- Existing `荒謬市長_v0.3.html` remains unchanged.
- Retain 12 rounds, 9 plots, six buildings, 15 events, three milestones, civic-action restrictions and five ending classes; do not change their costs, power, income, or eligibility thresholds.
- v0.4 inherits the current v0.3 localStorage schema and key. Test versions with separate browser profiles when comparing local save state.
- Emoji are temporary scalable scene tokens, **not** a completed bespoke illustration asset library. A cohesive SVG city tile set and richer conditional animations are possible v0.4.2 follow-up.
- All effect information must remain available without color or animation. Respect reduced-motion settings. Physical-device touch remains excluded by the user; no claim of real tablet testing.

## Acceptance

- Full offline Chromium/Firefox/WebKit × 1440/1024/390px × zh/en/fr/nl test matrix.
- 12-turn complete session, reload, restart, all three civic-action categories, saved-state compatibility.
- Six metrics and visual bars, nine visually distinct map tiles, twelve timeline steps and policy effect chips actually render.
- Keep modal keyboard focus, translated headings, 3-pledge audit and no horizontal clipping.
- Inspect actual new v0.4 screenshots before merging. Do not interpret a green browser suite as complete artistic signoff.
