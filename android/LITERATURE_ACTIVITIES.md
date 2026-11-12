# Class 6 literature activities

Open **ସାଥୀ → ପାଠଶାଳା → Class 6 → ସାହିତ୍ୟ ସୁଧା → Activity or Quizzes → ଜନ୍ମଭୂମି (left chapter list) → content on the right**.

The existing Sahitya Sudha Activity and Quizzes buttons now open this module directly instead of their placeholder. Back from its chapter list or Close/Escape returns to the same book section. The separate Subject activities shortcut remains available. PDF Book requires the Android reader bridge; bundled Sahitya Sudha activities can open without it.

Navigation follows book selection → Activity or Quiz → chapter-name list on the left → selected chapter content on the right. The chapter list stays visible during activities, quiz questions and results. Each pane scrolls independently; the selected chapter is visibly highlighted and marked with aria-current. Back returns one level at a time. Only the source-verified first chapter is currently available.

This Android asset change adds one chapter, not the entire textbook. The separate `dist/` web application is unchanged. Existing writing tools, menus, saved board pages and drawings are preserved. The activity hub opens in a modal dialog and returns focus to the Saathi trigger when closed, including with Escape.

## Source and content

The source is the user's uploaded `6th_Mil_P101.pdf`, a 12-page scanned chapter extract inspected visually. It contains:

- PDF pages 1–2: ଜନ୍ମଭୂମି, by ମଧୁସୂଦନ ରାଓ.
- PDF page 3: poet introduction and comprehension.
- PDF pages 4–9: word meanings, discussion, language and creative exercises.
- PDF page 10: supplementary comparison material.
- PDF page 11: ଏଇ ଦେଶ ଏଇ ମାଟି, by ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ.
- PDF page 12: writing/drawing space.

The module uses original exercises and three bundled, real CC0 photographs: the Himalayas in Ladakh, the Ganges near Rishikesh, and the Bay of Bengal at Visakhapatnam. Source and author details are in `app/src/main/assets/literature-images/CREDITS.md`. Activity cards include photo previews, the visual explorer switches between captioned real photos, and relevant quiz questions use photo prompts. It does not reproduce the textbook scans or full poems. Photo captions identify their actual locations; they are supporting examples for the poem. Poem comparison uses paraphrased themes.

Six activities are available: visual exploration, six word/meaning pairs, six quiz questions with hints and feedback, three sentence-building rounds, creative writing, and teacher-led poem comparison. Sentence and application questions are identified as new exercises. Open-ended writing and discussions are marked practiced by the student or teacher; this is not an automatic assessment.

Quiz score counts correct first attempts without hints. Wrong attempts and hints remain available for learning. Best score, practiced activity IDs, and a 4,000-character writing draft are saved under a separate localStorage key, `odia-literature-class6-janmabhumi-v1`. A storage failure is displayed and activities remain usable during the session. This is device-local persistence, not cloud backup.

## Validation

`node --check android/app/src/main/assets/literature.js` passes. Static integration, question data, and referenced assets were checked. Playwright with system Chromium passed the integration smoke test over a local HTTP server: persistent left chapter navigation and right content layout in both Activity and Quiz, existing Pathasala Class 6 Sahitya Sudha Activity/Quizzes buttons (including return focus and Back/Escape), direct chapter quiz navigation and back behavior, all six activities, incorrect matching and retry, quiz hints and first-attempt scoring, sentence building, draft persistence after reload, preserving existing board ink, Escape/focus return, and viewport overflow checks at 1920×1080, 844×390 and 390×844. No browser JavaScript errors were reported. Earlier sandbox restrictions blocked browser launch; after permissions changed the tests were rerun successfully. No Android APK was built, and real Android touch behavior and visual layout still require device checks.

Run the integration check on a browser-capable machine with Python Playwright and Chromium installed:

```sh
python android/tests/literature_smoke.py
```

Before merging, also check an Android phone in both landscape directions and a classroom smartboard. Verify all six activities; wrong answers, hints and retry; writing draft after reload; keyboard focus and Escape; storage-disabled behavior; and returning to an existing drawing with undo/redo, page selection, erasing and PNG export intact.

All module assets are bundled with the Android app and require no network requests. Real Android WebView compatibility and offline launch still require a device build/test. Adding further chapters requires their verified source pages and additional content; unsupported subjects are not presented as working.


The header and footer are compact 52px bars (plus safe-area insets), with 48px touch targets. The repeated header kicker is hidden. The chapter content retains the remaining height; photographs live inside the activity content.
