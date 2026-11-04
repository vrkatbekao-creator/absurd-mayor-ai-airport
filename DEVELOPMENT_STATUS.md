# Development status — 2026-11-04

Scope: private repository `vrkatbekao-creator/absurd-mayor-ai-airport`. Never use `vrkkao-eng` for writes.

## Completed in sequence

| Step | Delivery | Reference |
|---|---|---|
| 01 | Responsive visual fixes, real desktop cross-browser QA and screenshots | merged PR #6 |
| 02 | Dependency-free Node.js gameplay regression suite and CI | merged PR #1 |
| 03 | v0.2.1 municipal actions, upgrades, no forced rebuilding; aligned four-language rules, investment ledger and old-save normalization | merged PR #8; Issue #7 closed |
| 04 | v0.2.1 version snapshot | `release/v0.2.1`, `荒謬市長_v0.2.html` |
| 05 | 800 seeded strategy runs, documented outcomes and artifacts | merged PR #9 |
| 06 | 1,100-run sensitivity experiment: power-aware aggressive, late runway, minimal AI | merged PR #10 |
| 07 | v0.3 three-act prompts, transparent promise audit, one-turn airport/power/AI forecasts | merged PR #11 |
| 08 | v0.3 categorized civic actions, intro/outcome dialog focus management; independent versioned game | merged PR #11; `release/v0.3`, `荒謬市長_v0.3.html` |

## Verified controls and limitations

- The Playwright browser suite executed against the standalone v0.3 HTML and has a passing run: [#41855568274](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41855568274), **42 passed / 0 failed / 6 intentional per-browser exclusions**.
- The original regression and municipal action Node.js suites pass in GitHub Actions. These test actual in-page code and saved-state contracts.
- The v0.2.2 800- and 1,100-game benchmarks are deterministic scripts, not human win-rate estimates.
- All game metrics are fictional. “AI jobs” and “zero carbon” use explicitly labelled proxy measures; v0.3 does not claim real jobs or emissions.
- **Physical touchscreen testing is explicitly waived** by the user, not verified. The original Issue #2 browser QA is closed with that disclosure.
- The latest v0.3 screenshot UI states have **not received separate full human visual approval** and are tracked as Issue #12. Additional language/assistive-technology QA remains Issue #5.
- v0.2.2 retained original economic parameters deliberately. The sensitivity study identified a reliable two-lab winning plan; follow-up one-factor numeric experiments remain Issue #3.
- The legacy v0.1 startup code still exists for compatibility; deeper cleanup remains Issue #4.

## Version and merge history

1. PR #6 → PR #1 → PR #8 → PR #9 → PR #10 → PR #11.
2. `main` retains both independently playable single HTML versions.
3. `release/v0.2.1` is a frozen commit snapshot after v0.2.1 was merged; `release/v0.3` is a frozen commit snapshot after v0.3 was merged. These are **branches**, not GitHub Releases or version tags.
4. GitHub Pages remains disabled; the repository remains private.

## Next prioritized backlog

1. **Issue #12:** human review of new v0.3 screenshots (all UI states, French and Dutch especially), *excluding real-device touch*.
2. **Issue #5:** accessibility/screen-reader and human four-language proofreading.
3. **Issue #3:** one-variable-at-a-time tuning using the frozen 1,100-run benchmark and realistic human choices.
4. **Issue #4:** remove remaining v0.1 legacy event-handler/startup code without breaking old saves.
5. True event causal arcs and more transparent employment/carbon proxies are proposed future versions; they are not claimed as already implemented.
