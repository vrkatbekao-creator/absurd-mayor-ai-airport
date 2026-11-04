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

## Manual screenshot review — uploaded artifact inspection (2026-11-04)

The user supplied `issue2-browser-qa.zip` containing **37 screenshots** (3 engines × 3 viewports × 4 languages = 36 UI states, plus one Chinese Chromium ending modal) and `screenshots/chromium/a11y-initial-focus.json`. A contact-sheet comparison covered all 36 images; detailed visual inspection of representative full-resolution English, Chinese, French and Dutch screenshots confirmed the following. The screenshot scenes are different randomized game states, so **pixel-for-pixel language comparisons are not valid**.

| Priority | Finding | Evidence paths in CI artifact | Acceptance / fix idea |
| --- | --- | --- | --- |
| P1 | **Non-Chinese circular city seal clips its text / crowds the page title.** The `DABING CITY` label is too long for the small circle, most apparent in EN/FR/NL mobile and tablet. | `screenshots/chromium/mobile-390-en.png`, `mobile-390-fr.png`, `mobile-390-nl.png`; `tablet-1024-nl.png` | Use a compact logo monogram for every language or provide a correctly sized, separately styled text label. No overlapping title. |
| P1 | **Dutch 3×3 tile titles break inside words**, e.g. `Passagiersterminal`, `Onderhoudshangar`, `Duivenleefgebied`, even though body horizontal scrolling was eliminated. | `screenshots/chromium/mobile-390-nl.png`, `tablet-1024-nl.png`; similar across engines | Consider abbreviated labels/tooltip or tile label layout, minimum font 12px, preserve word boundaries where possible. Do not fix by hiding content. |
| P1 | **Tiny information-dense effect descriptions** on mobile: the build card effects and airport explanation are rendered at approximately 11–12px CSS. The controls themselves work in CI but reading long multi-language effects is laborious. | `screenshots/chromium/mobile-390-{zh,en,fr,nl}.png` | Improve mobile body font / line-height and show the most decision-relevant numbers first; review actual device legibility. |
| P2 | Selected tile displays **two check indicators** (one in icon content and one from `.selected:after`), causing visual clutter. | `screenshots/chromium/tablet-1024-zh.png`, `mobile-390-zh.png` | Render one prominent selection marker, retain border and `aria-pressed`. |
| P2 | 1024px two-column construction section leaves a **large blank region** under the 3×3 map alongside a long list of six build choices. No functional breakage observed. | `screenshots/chromium/tablet-1024-zh.png`, `tablet-1024-fr.png` | Consider responsive stacking around tablet portrait, or condensed right-hand choices, without sacrificing comprehension. |
| A11y | The introduction overlay is marked as a dialog, but initial focus is still **`BODY`** and there is no `autofocus`. The screenshot package does not show a focus trap / restored focus. | `screenshots/chromium/a11y-initial-focus.json` | Move focus into dialog on open, trap Tab focus, restore focus on close; track in Issue #5. |

### What the screenshots do **not** establish

- No actual 10-inch tablet, phone or physical touchscreen was tested by this screenshot ZIP; mobile taps in CI are emulated.
- The 36 viewport×language images predominantly show the **build phase only**. Other policy/settlement states and all language-specific ending dialogs were not visually sampled here; only a Chinese Chromium final modal is included.
- Translation completeness/idiomatic quality cannot be guaranteed from a screenshot comparison.
- Passing scroll-width checks demonstrates no horizontal scrolling in the tested state, **not** adequate mobile readability.

### Recommended sign-off gate

1. Fix P1 logo and long tile labels / readability; add screenshot regression examples for 390px Dutch and French.
2. Rerun three-engine, four-language, three-viewport CI and visually compare screenshots again.
3. Complete physical 10-inch tablet landscape/portrait taps, scroll and reload checks.
4. Review policy, settlement and endings in all four languages before formally closing Issue #2.
