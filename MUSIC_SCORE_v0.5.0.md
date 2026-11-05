# V0.5.0 — City on the Move / 城市向前

An original instrumental background score: 120 BPM, D major, 4/4, 32 bars, a 64-second loop. The mood combines bright urban optimism with a forward-moving campaign rally. It uses newly composed material; no recordings, samples, lyrics or melodies from the referenced songs are included.

## Arrangement
Bars 1–4: plucked rhythm guitar, warm keys, bass and light drums. Bars 5–12 introduce an eight-bar original brass refrain. Bars 13–16 give the refrain to keys. Bars 17–24 add a soft chord pad and keyboard replies. Bars 25–32 relax into a turnaround that returns to the opening. Kick, snare, offbeat hats and restrained handclaps maintain the campaign pulse.

The score and instrument synthesis are in assets/v5-campaign-score.js and are embedded in the HTML. The guitar uses a damped plucked-string buffer, brass uses a shaped harmonic waveform, and the percussion uses deterministic local noise. A short stereo reverb and compressor combine the instruments. Its random generator is independent from game randomness.

## Controls and lifecycle
The page starts silent and does not allocate an AudioContext before a user gesture. Four-language controls provide play/pause, a keyboard-operable volume slider and percentage. Default volume is 28%. Only the volume preference is stored, under a separate audio-settings key; playback never resumes automatically after a reload. Switching tabs suspends audio. The ending dialog includes its own reachable pause button. Unsupported or blocked audio shows a message and leaves gameplay operational.

## Preview and validation
The preview is rendered from the same score and synthesis used by the game, rather than a separate recording. It has a short release tail and a preview-only ending fade; the game loops without that fade. The 65.5-second stereo PCM render has 1,146 note/percussion events, peak 0.5266 or lower and RMS about 0.0443 at render gain 0.8, with no clipped samples. The MP3 preview is loudness-adjusted for convenient audition.

Local Chrome: 30 passed, including the inherited four-language/three-size matrix, full playthrough, save equality, audio controls in four languages, unsupported-audio fallback, rapid toggles, visibility suspension, ending-dialog pause and representative rendered PCM at the loop junction. These signal checks do not replace the user's artistic listening judgement. A full manual screen-reader and device speaker/headphone audit has not been performed.

The GitHub PR records the exact final CI head and all Chromium/Firefox/WebKit results. V0.5.0 is the version label requested for this music addition; game save version 2 and previous game files are preserved.


## Initial CI finding and correction
The first full CI run passed 86 cases and failed four Firefox activation cases: the realtime context remained suspended. The runner had libpulse but no configured audio server. The CI harness now starts PulseAudio with a null output sink before testing, retaining the original keyboard gesture and running-state assertions. This follows the headless Firefox backend requirement documented by the maintainer of [playwright-audio-mocking](https://github.com/tsuemura/playwright-audio-mocking#notes--caveats); no microphone mocking or autoplay bypass is used here.

Independently, the app now shows a starting state and returns to a visible, non-blocking error after five seconds if the audio backend never starts. A pending-backend test verifies that gameplay remains usable. Test reports use explicit paths so failed-case evidence is uploaded reliably. Final CI results are recorded in the PR.
