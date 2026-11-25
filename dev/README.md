# Build chain (copied from the session scratchpad)
`build.sh` rebuilds the game from `c89.html` by running every patch in order (`p82.py` ... `p96.py`), with `hub82.js`
(Meridian dressing) and `guns83.js` (first-person guns) spliced in. The result is the shipped `index.html`.
Run it from a folder holding these files; it also writes a test copy (`mk_test.py` + `mk70.py` + `inj.js` add the
`window.__*` helpers) under `gtest/`. Tests are `t*.js` (Playwright, headless Chromium with swiftshader; one browser at a time).
