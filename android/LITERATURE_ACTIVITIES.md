# Class 6 literature activities

Open **ସାଥୀ → ପାଠଶାଳା → Class 6 → ସାହିତ୍ୟ ସୁଧା → Activity or Quizzes → ☰ ପାଠ (Chapters) → ଜନ୍ମଭୂମି → full-width content**.

The existing Sahitya Sudha Activity and Quizzes buttons now open this module directly instead of their placeholder. Back from its chapter list or Close/Escape returns to the same book section. The separate Subject activities shortcut remains available. PDF Book requires the Android reader bridge; bundled Sahitya Sudha activities can open without it.

Navigation follows book selection → Activity or Quiz → the ☰ ପାଠ (Chapters) button → chapter selection → full-width activities or quiz. Chapters are hidden by default and open as a narrow overlay drawer. Selecting a chapter automatically closes it. Toggle, outside tap and Escape also close the drawer without resetting the current activity or quiz. Escape closes the full activity hub only when the drawer is already closed. Hidden drawer controls are inert; focus returns to the chapter toggle on dismissal. The selected chapter remains highlighted and marked with aria-current inside the drawer. Back returns one level at a time. Only the source-verified first chapter is currently available.

This Android asset change adds one chapter, not the entire textbook. The separate `dist/` web application is unchanged. Existing writing tools, menus, saved board pages and drawings are preserved. The activity hub opens in a modal dialog and returns focus to the Saathi trigger when closed, including with Escape.

## Source and content

The source is the user's uploaded `6th_Mil_P101.pdf`, a 12-page scanned chapter extract inspected visually. It contains:

- PDF pages 1–2: ଜନ୍ମଭୂମି, by ମଧୁସୂଦନ ରାଓ.
- PDF page 3: poet introduction and comprehension.
- PDF pages 4–9: word meanings, discussion, language and creative exercises.
- PDF page 10: supplementary comparison material.
- PDF page 11: ଏଇ ଦେଶ ଏଇ ମାଟି, by ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ.
- PDF page 12: writing/drawing space.

The module uses original exercises and five bundled, real CC0 photographs: three distinct photos for visual exploration (Ladakh, the Ganges near Rishikesh, and the Bay of Bengal at Visakhapatnam), plus separate Nilkanth Peak and Ganges photographs for two geography quiz questions. Source and author details are in `app/src/main/assets/literature-images/CREDITS.md`. Activity cards use icons without decorative photos. The visual explorer switches between three captioned real photos; its abstract poet-feeling discussion hides the photograph. Only the two geography quiz questions use photos, both different from the explorer images. Author, abstract-theme and environment-judgment questions have no unnecessary picture. No photograph is reused across these placements. It does not reproduce the textbook scans or full poems. Photo captions identify their actual locations; they are supporting examples for the poem. Poem comparison uses paraphrased themes.

Six activities are available: visual exploration followed by three poem-clue missions, six word/meaning pairs followed by a metaphor/meaning challenge, six quiz questions with hints and encouraging feedback, three sentence-building rounds, creative writing, and teacher-led poem comparison. Sentence and application questions are identified as new exercises. Open-ended writing and discussions are marked practiced by the student or teacher; this is not an automatic assessment.

Quiz rewards one learning star for every question eventually solved, including after hints or retry; stars are never deducted. Wrong choices receive a supportive, specific hint and are disabled for that question, while correct choices remain available. A thin progress bar and brief encouragement show progress. First-attempt statistics are retained only inside collapsed practice details; using help does not reduce learning stars. Results offer targeted replay of just the questions that needed help. A short replay never overwrites the full six-question best statistic. Best score, practiced activity IDs, and a 4,000-character writing draft are saved under a separate localStorage key, `odia-literature-class6-janmabhumi-v1`. A storage failure is displayed and activities remain usable during the session. This is device-local persistence, not cloud backup.

## Validation

`node --check android/app/src/main/assets/literature.js` passes. Static integration, question data, and referenced assets were checked. Playwright with system Chromium passed the integration smoke test over a local HTTP server: default-hidden chapter drawer and full-width content in both Activity and Quiz, existing Pathasala Class 6 Sahitya Sudha Activity/Quizzes buttons (including return focus and Back/Escape), direct chapter quiz navigation and back behavior, all six activities, incorrect matching and retry, quiz hints and first-attempt scoring, sentence building, draft persistence after reload, preserving existing board ink, Escape/focus return, and viewport overflow checks at 1920×1080, 844×390 and 390×844. No browser JavaScript errors were reported. Earlier sandbox restrictions blocked browser launch; after permissions changed the tests were rerun successfully. No Android APK was built, and real Android touch behavior and visual layout still require device checks.

Run the integration check on a browser-capable machine with Python Playwright and Chromium installed:

```sh
python android/tests/literature_smoke.py
```

Before merging, also check an Android phone in both landscape directions and a classroom smartboard. Verify all six activities; wrong answers, hints and retry; writing draft after reload; keyboard focus and Escape; storage-disabled behavior; and returning to an existing drawing with undo/redo, page selection, erasing and PNG export intact.

All module assets are bundled with the Android app and require no network requests. Real Android WebView compatibility and offline launch still require a device build/test. Adding further chapters requires their verified source pages and additional content; unsupported subjects are not presented as working.


The header is a compact 50px row with 48px navigation targets. Back and the chapter toggle share the compact top row; there is no bottom navigation bar or reserved sidebar space. Lesson content uses the full width and extends to the screen bottom. Storage failures still appear as a small notice. Teacher information is collapsible. Activity cards, quiz options and spacing are compact; the original Pathasala Book/Activity/Quizzes section uses small inline buttons. Real photos remain inside relevant content. Storage failures remain visible.

The explorer now requires applying three poem clues rather than only visiting tabs. Word matching adds a meaning-in-context question after all six pairs. Sentence building now uses longer sentences about metaphor, interpretation and applying the poem’s ideas instead of elementary four-word sentences. These are original chapter-based exercises. Browser smoke coverage includes wrong-answer recovery, hints, completing every clue, metaphor application, effort stars, targeted quiz replay and preserving the full-quiz statistic.

Drawer behavior is covered by the browser smoke test: default hidden state, toggle, auto-close on chapter selection, Escape/outside-tap dismissal with quiz progress preserved, focus return, and full-width layout at desktop, phone landscape and portrait sizes.
