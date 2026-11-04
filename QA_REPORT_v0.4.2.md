# v0.4.2 city visuals and QA

## Scope
- New standalone offline file: 荒謬市長_v0.4.2.html. Earlier version files are preserved.
- Fifteen inline SVG illustrations cover nine original airport/city plots and six development types, with a shared palette, outline and ground plane.
- An operating runway shows an aircraft; when flights are grounded, the original runway shows a closure cross. Productive buildings show power-shortage text and dimmed windows; level-two facilities have an added upgrade marker.
- Global flight/power status and tile accessible names retain localized text. The SVGs are decorative and cannot receive focus.
- Decisions show numeric deltas in a polite, atomic live region. Building artwork moves briefly and changed KPI cards pulse once; reduced-motion settings disable these effects. Feedback is transient UI state and adds no save fields.

## Validation
The complete inherited 36-case language/size/browser matrix plus existing behavioral cases is retained. New tests cover all building art, combined grounded/shortage/upgraded states in each language, reduced motion, old-save loading, and exact full-state equality after a mixed 12-turn playthrough in v0.4.1/v0.4.2.

Local Chrome: the 18 inherited cases passed; the five new cases passed after correcting a fixture interaction (the level-two fixture has no upgrade disclosure, so the test now toggles KPI details to verify display-only interactions do not mutate the save). Chinese desktop and Chinese/Dutch combined-state screenshots were manually reviewed. Tile warnings are shortened; the city status retains the full half-output explanation.

The PR records the final CI head, results and representative screenshot review. Manual screenshot sampling is not a full screen-reader session or native-language copy edit. No economy, thresholds, actions or save schema changes are intended.
