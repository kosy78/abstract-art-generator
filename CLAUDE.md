# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

This is a static frontend-only application with no build step. Serve with any HTTP server:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in a browser.

## Architecture

Single-page canvas drawing app with three files:

- **`index.html`** — Full-screen canvas, instruction overlay, Reset/Download buttons (top-right)
- **`script.js`** — All application logic: canvas resize, mouse/touch event handling, HSL color cycling per stroke, JPEG export
- **`styles.css`** — Dark theme, glass-morphism UI, responsive layout

**Drawing model:** `isDrawing` flag toggled by mousedown/touchstart. Each stroke cycles the HSL hue. Lines are drawn at 5px width with round caps/joins on a black canvas background.

**Download:** Exports canvas via `canvas.toDataURL('image/jpeg')` triggered by the download button.
