# v0.4 Visual Acceptance Report — 2026-11-04

## Scope and source

- Source under review: `荒謬市長_v0.4.html`, PR #14 (`feature/v04-visual-first`). The stable `v0.3` HTML is untouched.
- Real-browser screenshots from the **successful** [GitHub Actions run #41901334632](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41901334632); artifact `v04-visual-browser-qa` ID `13357886704`, 148 files (~66 MB zipped), consisting of build, city administration, deferral, settlement, full ending and focus diagnostics.
- Three browser engines (Chromium, Firefox, WebKit), widths 390px/1024px/1440px, four languages zh/en/fr/nl. Chromium/Firefox output is 1×; WebKit captures may have 2× device-pixel scaling.
- The browser CI passed **44 tests, 10 intentional skips and 0 failures** on commit `65fc99a41b41101e9a0547fd410f03e2174f9f6c` before the minor AI-target visual-label correction.
- Review method: inspect actual image pixels in representative four-language mobile top and middle panels, Chromium desktop/tablet and ending, and compare selected Chromium/Firefox/WebKit screenshots side-by-side. This is **representative human visual inspection**, not 148 individual images approved line-by-line.

## Acceptance observations

| Area | Assessment | Evidence / limitation |
| --- | --- | --- |
| Header and KPI dashboard | Pass with one correction | Six icon+number cards and meters displayed consistently. **Found:** AI progress scale used 100 despite promise threshold 50; French/Dutch notes displayed English `pledge`. Fixed in this branch: full AI meter now represents goal 50, with four localized labels. |
| 12-turn timeline | Pass | All 12 round chips and 4/8/12 milestones are legible and distinguish current/completed phases. |
| Nine-tile city | Pass for present visual prototype | All nine labeled cells visible; facility colors, level tags, grounded-flight and power-shortage warnings distinguish state. Current emoji are placeholders, not a complete custom illustrated art set. |
| Policy choice | Pass | Policy icons, signed effect chips, delayed-effect markers and prose fallback coexist. No observed overlap in selected screenshots. |
| Construction / upgrade | Pass with UX follow-up | Six building cards with cost/power/AI badges, one-round forecast and detailed text. Long vertically scrollable list remains on mobile. |
| Municipal administration / defer | Pass with UX follow-up | Four administrative choices, defer and their fiscal/political effect chips are legible in zh/en/fr/nl on 390px. Mobile user scrolls below KPI/timeline/map to reach actions. |
| Settlement | Pass | Breakdown / turn settlement buttons visible; text remains readable, page is vertically scrollable without detected clipping. |
| Ending | Pass for representative Chromium ending | Illustrated outcome header, loss vs AI comparison, pledge audit, expandable detail and restart control shown; keyboard focus has passing final CI tests. |
| Cross-engine geometry | Pass at automated layout level | Chromium, Firefox and WebKit screenshots have matching section order and no observed major clipping/overlap; Playwright checks validate horizontal overflow and keyboard interactions across matrix. |
| Localization | Pass for **layout**, not certified proofreading | French/Dutch long labels display without observed mid-word truncation; text differs naturally in length. Native-speaking copyediting remains a separate concern. |
| Accessible design | Partial | Important icons have adjacent values/labels and reduced-motion behavior. Full screen-reader audit and physical touchscreen testing are not claimed. Touch testing intentionally waived by owner. |

## Visual issues

**P1 — Corrected in PR #14:** AI bar was capped at 100 while political pledge success begins at 50; its note mixed English with French/Dutch. Changed `statSpecs.ai.max` to 50, added `aiTarget` captions per language and protected with an automated test in `tests/visual-contract-v04.test.cjs`. This is a display-only change; AI rules and outcomes remain unchanged.

**P2 — Follow-up:** At 390px the KPI cards + timeline + 3×3 map precede the action choices, which are often more than one viewport below. Propose compact/collapsible metrics or a mobile sticky bottom action navigator in v0.4.1, with accessibility and scroll position testing. Do not mix this larger interaction change into final v0.4 visual sign-off.

**P2 — Follow-up:** Construction cards still contain long detail lines; a single visual cost/benefit row is working, but details could be a disclosure panel as a later improvement. The map's emoji building icons should eventually be replaced by coherent local SVG art without external asset dependencies.

## Required release gate

1. The **latest** PR #14 head, including the AI-goal correction and its new test, must show green Node rule/visual contracts AND Chromium/Firefox/WebKit Playwright checks.
2. The limited localized AI note should render with no text overflow in latest screenshots.
3. Keep PR #14 draft and `main` unchanged until the gate is passed.
4. Real-device touch is excluded by the owner. Full 148-frame independent human sign-off and professional native-language proofreading were not performed and must not be claimed.

## Verdict

**Representative visual design: conditional pass** (no blocking clipping found, a score-bar semantics defect fixed in source). Final release approval is **pending fresh CI on corrected commit** and a quick updated screenshot check. Gameplay mechanics were not altered.
