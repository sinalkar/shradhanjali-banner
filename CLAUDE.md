# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static memorial/tribute banner generator web app for Marathi/Hindi-speaking users. It renders a customizable funeral announcement banner in the browser and allows download as a JPG image. Deployed at `https://shradhanjalibanner.in/`.

No build system, no dependencies to install — just static HTML files served directly (Netlify).

## Files

- **[index.html](index.html)** — The primary production page (~555 lines). Full-featured generator with Bootstrap 5, Google Fonts (Rozha One, Tiro Devanagari Marathi), and html2canvas for download.
- **[banner.html](banner.html)** — A simpler, earlier prototype using an HTML5 `<canvas>` element directly (no html2canvas). Useful as a reference for the canvas-based approach.
- **[bg_photoframe.png](bg_photoframe.png)** — Decorative photo frame overlay used in the banner preview.
- **[banner-preview.jpg](banner-preview.jpg)** — OG/Twitter card image referenced in meta tags.
- **[sitemap.xml](sitemap.xml)** / **[robots.txt](robots.txt)** — SEO files pointing to `https://shradhanjalibanner.in/`.

## Architecture

`index.html` is a single-page app with no framework:

1. **Form inputs** (left column) — collect name, age, death date, message, ceremony details, family members, and a color theme selector.
2. **Live banner preview** (`#banner` div) — a styled HTML div (not canvas) that updates immediately via `generateBanner()`. The photo frame uses `bg_photoframe.png` as an overlay.
3. **Download** — `html2canvas` (loaded from CDN) captures the `#banner` div at 2.5× scale and saves it as `memorial-banner.jpg`.

### Theme system

`applyTheme(selectedTheme)` in the script switches CSS variables on the banner div. Four themes: `traditional`, `sunset`, `ocean`, `classic`. Each theme object defines banner background, text colors, and whether decorative flowers are shown.

### Photo handling

User uploads via `<input type="file" id="mainPhoto">`. A `FileReader` reads it as a data URL and sets it as the `src` of `#mainPhotoPreview` inside the frame. `html2canvas` uses `useCORS: true` to handle the data URL during capture.

## Development

Open `index.html` directly in a browser — no server needed for local editing. For download functionality, serve over HTTP since html2canvas can behave differently with `file://` protocol:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

## Key CDN dependencies (no local npm)

- Bootstrap 5.3.3
- html2canvas (loaded inline via CDN script tag in index.html)
- Google Fonts: Rozha One, Tiro Devanagari Marathi


