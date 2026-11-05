# v0.4.2 illustrated city and QA

## Final scope
The user selected art direction A: detailed, smooth city illustrations. This replaces the minimal SVG prototype with a 16-cell illustrated atlas, embedded once as WebP inside the standalone HTML. SVG/CSS overlays provide the closure cross, upgrades and shortage treatment. See ASSET_PROVENANCE_v0.4.2.md for the source, hashes and generation prompt.

- Full-scene illustrations cover all nine original plot types, six developments and a closed runway.
- No nominal capacity text appears on plots, in their tooltip or in their accessible names. Airport-wide traffic remains in the dashboard and redevelopment forecasts.
- Shortage and grounding use visible localized text, not color alone. Decorative scene art is excluded from accessible names.
- Decisions announce localized numeric deltas, with turn and action context. Display-only redraws preserve the live-region DOM, avoiding repeated announcements on plot selection.
- Brief construction and KPI effects respect prefers-reduced-motion. Transient feedback does not add save fields.
- Earlier HTML versions are preserved; gameplay, economy, thresholds and save schema are unchanged.

## Validation
Local Chrome on Windows: **23 passed, 0 failed** on the final A-style implementation. This includes the 12 viewport/language cases, inherited behavior cases, four exceptional-state/reduced-motion cases, and a mixed 12-turn comparison whose complete saved state is equal in v0.4.1 and v0.4.2. Old v0.4.1 saves load unchanged. Display-only interactions do not mutate saved state or repeatedly rewrite the live region. The tests assert absence of per-tile capacity text.

Manual local review: Chinese desktop overview and French mobile overview were viewed after integrating the final artwork; names are readable and no obvious clipping was observed. The PR records the final Chromium/Firefox/WebKit CI head, outcome and further screenshot sampling. Full manual screen-reader and physical-touch sessions are outside this check; accessible names, keyboard operation and reduced motion are tested automatically.
