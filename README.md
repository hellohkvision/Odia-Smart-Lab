# Odia Smart Lab

A touch-friendly classroom web application. Open dist/index.html to try the app, or serve dist over HTTPS for service worker and installation support.

Includes a pen and eraser, undo, PNG export, local board persistence, Odia vowel tracing, three lesson cards, and a four-question quiz. The language button switches navigation and introductory text; lesson and quiz instructions remain in English.

## Run

From this directory:

    python -m http.server 4173 --directory dist

Open http://localhost:4173. For other devices, deploy dist to an HTTPS static host. Use your browser's Install app or Add to Home Screen option where supported. This is a web app; no Android APK or native desktop installer is included. Offline use requires one successful load over HTTPS or localhost. Boards are saved in this browser only.

## Verification

JavaScript syntax checks passed for app.js and sw.js. Browser QA was attempted but the installed Playwright package has no Chromium executable. The workspace also blocks listening sockets, preventing a local HTTP preview. PWA installation, offline behavior, and touch input still require device testing.

## Hosting

Not published: the Sites plugin's required local starter and source packaging helpers were unavailable in this environment. No hosted Site was registered.
