# Class 6 literature activities

Open **ସାଥୀ → ବିଷୟ ଅନୁସାରେ କାର୍ଯ୍ୟକଳାପ → Class 6 / Odia literature → ସାହିତ୍ୟ ସୁଧା → ଜନ୍ମଭୂମି**.

This Android asset change adds one chapter, not the entire textbook. The separate `dist/` web application is unchanged. Existing writing tools, menus, saved board pages and drawings are preserved. The activity hub opens in a modal dialog and returns focus to the Saathi trigger when closed, including with Escape.

## Source and content

The source is the user's uploaded `6th_Mil_P101.pdf`, a 12-page scanned chapter extract inspected visually. It contains:

- PDF pages 1–2: ଜନ୍ମଭୂମି, by ମଧୁସୂଦନ ରାଓ.
- PDF page 3: poet introduction and comprehension.
- PDF pages 4–9: word meanings, discussion, language and creative exercises.
- PDF page 10: supplementary comparison material.
- PDF page 11: ଏଇ ଦେଶ ଏଇ ମାଟି, by ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ.
- PDF page 12: writing/drawing space.

The module uses original exercises and a locally drawn SVG landscape. It does not reproduce the textbook scans or full poems. The landscape is explicitly identified as a symbolic illustration, not a map. Poem comparison uses paraphrased themes.

Six activities are available: visual exploration, six word/meaning pairs, six quiz questions with hints and feedback, three sentence-building rounds, creative writing, and teacher-led poem comparison. Sentence and application questions are identified as new exercises. Open-ended writing and discussions are marked practiced by the student or teacher; this is not an automatic assessment.

Quiz score counts correct first attempts without hints. Wrong attempts and hints remain available for learning. Best score, practiced activity IDs, and a 4,000-character writing draft are saved under a separate localStorage key, `odia-literature-class6-janmabhumi-v1`. A storage failure is displayed and activities remain usable during the session. This is device-local persistence, not cloud backup.

## Validation

`node --check android/app/src/main/assets/literature.js` passes. Static integration, question data, and referenced assets were checked. Browser launch was attempted with Playwright and system Chromium; the sandbox blocked Chromium with `setsockopt: Operation not permitted`, followed by SIGTRAP. Browser interaction, visual layout, touch input, focus behavior and persistence have therefore **not** been verified in this environment. No Android APK was built here.

Run the integration check on a browser-capable machine with Python Playwright and Chromium installed:

```sh
python android/tests/literature_smoke.py
```

Before merging, also check an Android phone in both landscape directions and a classroom smartboard. Verify all six activities; wrong answers, hints and retry; writing draft after reload; keyboard focus and Escape; storage-disabled behavior; and returning to an existing drawing with undo/redo, page selection, erasing and PNG export intact.

All module assets are bundled with the Android app and require no network requests. Real Android WebView compatibility and offline launch still require a device build/test. Adding further chapters requires their verified source pages and additional content; unsupported subjects are not presented as working.
