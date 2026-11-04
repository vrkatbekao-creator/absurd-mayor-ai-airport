# v0.3 Human Visual & Multilingual QA — 2026-11-04

## Sources and methodology

- Live game: `荒謬市長_v0.3.html`; no changes to its economy or to `荒謬市長_v0.2.html`.
- Real **Chromium** screenshots rendered by GitHub Actions, before and after corrections. The 5 representative states reviewed at full image size are:
  `mobile-nl-build` (390px), `mobile-fr-admin` (390px), `tablet-nl-build` (1024px), `desktop-en-build` (1440px) and `mobile-zh-ending` (390px).
- [Before sample](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41859579721), [after corrections](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41860182401), [French button final check](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41860501234).
- Screenshot-based judgments below are **human inspection of representative frames**. Additional three-engine automated tests for four languages / three viewports were added to check layout metrics for build, administrative, defer and settlement phases and store screenshot artifacts. These are not a substitute for reviewing every frame by eye.

## Confirmed visual defects and fixes

| Priority | Before | Confirmed result / correction |
| --- | --- | --- |
| P1 | At 390px the heading displayed a long rules paragraph, occupying roughly seven lines in FR/NL and pushing the actual game down | Replaced heading with short narrative line in each of zh/en/fr/nl. Detailed instructions remain in the intro dialog and map help. Visually rechecked NL/FR mobile. |
| P1 | Narrow action tabs split Dutch `Gebiedsontwikkeling` and `Stadsbestuur`, and French `Gestion municipale`, across parts of words | Display short **Bouwen / Besturen / Uitstellen** (NL) and **Bâtir / Gérer / Reporter** (FR), while preserving full accessible labels and tooltips. Visually rechecked FR mobile. |
| P1 | 1024px layout stretched each tile to a very tall rectangle because map height matched the longer construction panel | Removed stretch behavior, retaining compact 3×3 map and natural left-panel height. Visually rechecked NL tablet. |
| P1 | End dialog focused the *restart* button at the bottom, scrolling the modal down and hiding the actual ending title | Focuses `#endtitle` at top without scrolling; matching intro title also receives keyboard focus. Visually rechecked ZH mobile ending. Tab trapping updated for focusable headings. |
| P2 | Each of six build options repeated a long full sentence explaining forecast, extending mobile scroll length | Forecast caveat shown once in header; individual cards display short airport/power/actual-AI values and arrows. Visually rechecked NL mobile and EN desktop. |

The final mobile ending is **scrollable**: its full audit and Restart action need a vertical scroll. This is intentional rather than a cut-off; screen-reader announcements are still not human-certified.

## Language and factual copy review

- Corrected stale v0.2 compulsory plot-maintenance instructions in all four languages.
- Corrected city financing as a **treasury gain of +8** rather than a negative construction cost.
- Corrected one-turn projected AI output to use *realized* production: when electricity is insufficient, output is halved. This is a calculation/copy consistency fix, not a game balance change.
- Clarified the Chinese deficit/financing explanation.
- Dutch: `Transitiekosten` (not `Transactiekosten`); improved long-term electricity-discount agreement; clear municipal action phrasing.
- French: coherent land/energy/tax concession wording; `audition publique` instead of ambiguous `audience`; improved prime-time ad purchase, power discount terminology and short menu `Bâtir`.
- New language-coverage regression validates all keys in M, A, UX and the translations of 15 event cards, facility names and five ending texts in zh/en/fr/nl. **Key coverage and spot proofreading are not equivalent to native-speaker review of every sentence.**

## Browser / accessibility boundaries

- Expanded Playwright captures: 3 engines × 3 viewports × 4 languages in build, administration, deferral and settlement, plus intro/end dialogs and persistence.
- Tests assert no horizontal overflow, 44px minimum height for municipal tabs, visible action lists, dialog heading focus and keyboard containment.
- A real-device physical touchscreen test is **expressly waived by the user**, not passed.
- Screen-reader UX, full native-language proofreading and all-round narrative quality are separate future human tasks.

## Sign-off criterion

This audit **supports passing the five visually inspected representative scenes**. Mark full cross-browser sign-off only after the final QA branch's GitHub Actions tests succeed; retain an open follow-up for any unreviewed screenshot/assistive-technology issues.
