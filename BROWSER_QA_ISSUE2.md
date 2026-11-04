# Issue #2 — Browser Playtest Evidence (2026-11-04)

## Scope

Browser automation was run directly against the shipped `荒謬市長_v0.2.html` using its offline `file://` URL. Browsers were installed and launched through GitHub Actions on Ubuntu using Playwright.

- Engines: Chromium, Firefox, WebKit
- Viewports: 1440×900, 1024×768, 390×844
- Languages: zh-Hant, en, fr, nl
- Input: pointer click and **emulated** touch taps at 390px
- Screenshots and test output retained as a GitHub Actions artifact.

## Evidence and outcomes

| Run | State | Tests | Findings |
| --- | --- | --- | --- |
| [Initial run](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41837460847) | Failed | 26 passed / 13 failed / 6 skipped | Mobile body overflow in all 12 engine/language combinations; save/reload click blocked by legacy v0.1 intro overlay |
| [Passing verification](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/actions/runs/41838728744) | **Passed** | **39 passed / 0 failed / 6 skipped** | 390px overflow checks pass; legacy overlay no longer prevents resumed gameplay |

The six skipped tests are deliberate per-project exclusions: the three special diagnostic/full-session scenarios run in Chromium only, not in Firefox and WebKit. All 36 engine/language/viewport smoke tests pass, plus Chromium 12-turn interaction, persistence and accessibility diagnostic.

## Fixes on PR #6

1. The mobile hero/turn indicator now wraps within 390px instead of extending past the right edge. This was a **real issue obscured by `overflow-x:hidden`**: initially `document.body.scrollWidth` reached 419–461px although `document.documentElement.scrollWidth` was 390px.
2. v0.2 no longer invokes the old v0.1 initial render/intro on load. Previously, restoring a saved v0.2 building phase produced an obsolete overlay that intercepted clicks. v0.2 localStorage and language state were present but interaction was blocked.
3. Added Playwright browser tests and automated artifact uploads (screenshots and diagnostics). The game remains offline and self-contained; no runtime CDN or backend was added.

## Limits — do not overclaim

- These results are from browser engines running in Linux CI, **not** physical 10-inch tablets or iOS/Android devices.
- Touch is simulated by Playwright `hasTouch`; actual touchscreen ergonomics are unverified.
- Screenshot generation is not equivalent to human visual quality review.
- Keyboard focus trapping and screen-reader behavior remain tracked in Issue #5.
- Four-language text presence and interaction are covered; idiomatic quality requires native-language review.
- Production `main` is unchanged while PR #6 remains unmerged.

## Acceptance status

Automated cross-browser acceptance: **PASS**. Physical touch/visual and accessibility acceptance: **PENDING**.

Keep Issue #2 open for real-device verification and final visual sign-off.