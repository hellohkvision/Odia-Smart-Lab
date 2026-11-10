# Odia Smart Lab — Product and design rule book

This is the shared product baseline for future work. Explicit new user requests override these rules. When a request is limited to one part of the design, change that part and preserve the rest.

## Product and devices

- Build for a teacher-led Odia classroom using an Android smartboard, large screen, or Android phone. The Android app uses landscape orientation; support both landscape directions. The web version may have different browser limitations.
- Keep essential controls near the bottom so they are reachable on a large board. Check usability on phone landscape and large-board sizes; compact icons must still have at least 48 × 48 CSS-pixel touch targets.
- Keep the writing surface spacious and uncluttered. Use minimal branding: “ଓଡ଼ିଆ Smart Lab” with a short yellow underline at the bottom left, without covering the writing or controls.

## Fixed writing-board toolbar

Preserve this order and the underlying functions unless the user explicitly requests a change:

1. Left action group: Menu, ସାଥୀ, Exit, Share as four separate buttons; Menu opens file actions and ସାଥୀ opens activities.
2. Pen: opens one compact pen-options popup; it includes pen type, stroke size, and color.
3. Eraser.
4. Odia letter practice.
5. Undo.
6. Redo.
7. Board style/settings.
8. Clear page, with confirmation.
9. Save image.
10. Page controls: previous, page indicator, next, and add page.

Highlighter is a pen type inside the pen popup, not a second pen icon in the main toolbar. Keep marker and brush options; their current implementation is a basic stroke-width variation, not a realistic brush engine.

For narrow screens, core controls may remain visible while secondary controls move to a clearly accessible More (+) panel. Never silently remove a tool or its behavior. Preserve page controls and the current action order when adapting layouts; avoid horizontal scrolling as the only way to discover essential buttons. Test reach, safe-area insets, and overflow in landscape.

## ସାଥୀ menu

- Open close to the bottom toolbar. Use a compact vertical list with an icon and readable label for each existing action, inspired by the classroom board reference; adapt on small screens without clipping.
- Keep Whiteboard, Odia alphabet, Lessons, Quiz, Language and Fullscreen accessible, with distinct understandable icons and accessible names.
- Keep file menu actions visible with consistent, recognizable icons and readable labels.
- Menu previews must preserve the approved toolbar and branding. Changes to the menu must not redesign or remove other tools.
- Language and fullscreen controls must reflect real functionality and platform limitations; do not claim complete Odia translation until implemented.

## Pen and board behavior

- Tapping Pen selects it and opens a compact, bottom-reachable popup. Put pen type, stroke width and color in that one popup. Use icons and visible selected states, with accessible labels.
- Support pen, marker, highlighter and brush choices, preset stroke widths, preset colors and a custom color. Do not add a separate highlighter toolbar button unless requested.
- Finger and stylus input should work; avoid blocking drawing. Erasing handwriting must not erase the letter-tracing guide.
- Keep undo and redo per page, autosave locally, and offer explicit PNG export. Device storage can be cleared; do not describe local autosave as cloud backup.
- Preserve current pages and drawings when changing the UI. Do not clear content without confirmation. Clearly distinguish implemented functions from future proposals such as PDF export, shapes, text editing, object selection and realistic brush effects.

## Implementation and review

- The Android app lives under `android/`. Check the current GitHub branch and files before changing them; do not overwrite unrelated work. The `dist/` web app is separate and must not be represented as updated unless it is actually updated.
- Use an accessible name for every icon-only button, preserve keyboard focus, show selected/disabled states, and maintain sufficient contrast.
- Prefer SVG icons with consistent size and stroke; do not rely on color alone to show selection.
- Validate syntax and run relevant UI or Android tests when available. Test phone landscape and smartboard sizes, drawing, erasing, undo/redo, page changes, reload/autosave, and PNG export. State which tests could not be run.
- A generated design image is a concept, not an app screenshot. Label previews accurately, avoid claiming device compatibility without testing, and do not say a planned feature works until verified.

## New board direction

- Build a new writing-board interface and foundation for future board work. Do not treat incremental additions to the old board layout as a substitute for the requested new board.
- Keep existing saved drawings and pages safe; plan and verify migration or preserve access to the old data before replacing the current implementation.
- Implement and test board features in the new foundation, and distinguish working features from planned features. Integrate Odia-specific experiences later, as requested by the user.
