# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static memorial/tribute banner generator web app for Indian families, with a UI in 12 languages (Marathi default). It renders a customizable funeral announcement banner in the browser and allows download as a JPG image. Deployed at `https://shradhanjalibanner.in/`.

Deploying needs **no build step** — Netlify serves the files as they are in the repo. There is a small optional build (`npm run build:css`) that regenerates the committed daisyUI stylesheet; see below.

## Files

- **[index.html](index.html)** — The primary production page. Self-contained single-page app: inline CSS, inline JS, inline translations for 12 languages.
- **`<lang>/index.html`** (hi, en, bn, te, ta, gu, kn, ml, pa, or, ur) — **Generated, committed.** One real page per language. Do not hand-edit; run `npm run build:i18n`.
- **[i18n/seo.json](i18n/seo.json)** — Per-language FAQ, definition and About copy. The source of truth for that content.
- **[scripts/build-i18n.js](scripts/build-i18n.js)** — The generator. Also rewrites `index.html` (Marathi) and `sitemap.xml`.
- **[assets/daisyui.css](assets/daisyui.css)** — **Generated, committed.** Tree-shaken daisyUI build. Do not hand-edit; run `npm run build:css`.
- **[src/daisyui.css](src/daisyui.css)** / **[tailwind.config.js](tailwind.config.js)** — Input + config for that build.
- **[banner.html](banner.html)** — Frozen early prototype using a raw `<canvas>`. `noindex`, disallowed in robots.txt. Reference only.
- **[frames/](frames/)** — Photo-frame overlays (`frame-*.webp`, ~960px) and `thumb/*.webp` (128px) for the picker. Keep the two in sync.
- **[404.html](404.html)**, **[_headers](_headers)** — Netlify error page and cache/security headers.
- **[sitemap.xml](sitemap.xml)** / **[robots.txt](robots.txt)** / **[llms.txt](llms.txt)** — SEO and AI-crawler discovery files.

## Architecture

`index.html` is a single-page app with no runtime framework:

1. **Form inputs** (left column) — name, age, death date, message, ceremony details, family members.
2. **Live banner preview** (`#banner` div) — a styled HTML div (not canvas). Every field has a debounced `input` listener, so the preview always matches what will download.
3. **Download** — `html2canvas` (CDN, SRI-pinned) captures `#banner` (or the offscreen `#bannerSocial` card for 9:16 / 1:1 formats) and saves a JPG.

### Constraints worth knowing before editing

- **Never put daisyUI classes inside `#banner` or `#bannerSocial`.** daisyUI resolves colours through `oklch()`, which html2canvas 1.4.1 cannot parse — it would render those areas black. Both elements pin an explicit `color` so nothing inherits an oklch value. daisyUI is for the surrounding form/chrome only.
- **daisyUI stays on 4.x and Tailwind on 3.x**, pinned exactly in `package.json`. daisyUI 5 / Tailwind 4 emit `oklch()` throughout, so a major bump would start exporting black banners — the one failure a user cannot work around. A CI job (`Pinned major versions`) fails the build if either is bumped past its major.
- **`data-theme` is the site's own light/dark attribute.** daisyUI's stock themes bind to the same attribute, so `tailwind.config.js` defines a single custom theme (`shraddha`) that emits under `:root` instead. Do not add daisyUI's built-in themes.
- **`generateBanner()` runs on every keystroke**, so it must stay cheap and must not scroll. Use `generateBannerAndReveal()` for user-initiated regeneration that should scroll to the preview on mobile.
- **`index.html` is both the template and an output.** `npm run build:i18n` reads it, then rewrites its FAQ section, hreflang links and canonical along with the other 11 pages. The generator is idempotent and CI fails on drift, so edit the app freely — but put FAQ/definition/About copy in `i18n/seo.json`, never directly in the FAQ markup, or the next build will overwrite it.
- **Every language must stay self-canonical.** The 11 sub-directory pages exist precisely because `?lang=` variants served identical HTML and Google folded them into one URL. A CI job checks `lang`, `dir`, canonical, the hreflang cluster and that translated copy is pre-rendered.
- **Text colour tokens must be defined for both themes.** The FAQ/E-E-A-T section sits on `--page-bg` outside the white card; a token that is only defined for dark mode becomes invisible in light mode.

### Theme system

`applyTheme(themeName)` switches CSS variables on the banner div. Eleven themes: `traditional`, `marigold`, `sunset`, `saffron`, `tulsi`, `rose`, `ocean`, `lavender`, `golden`, `ivory`, `classic`.

### Photo handling

User uploads via `<input type="file" id="mainPhoto">`. A `FileReader` reads it as a data URL and sets it as the `src` of `#mainPhotoPreview`. Nothing is uploaded to a server. Typed details are persisted to `localStorage` under `shradhDraft`.

## Development

```bash
npm install          # dev tooling only — nothing ships to the browser
npm run serve        # http://localhost:8080
```

Serve over HTTP rather than opening the file directly; html2canvas behaves differently under `file://`.

```bash
npm run build        # both of the below
npm run build:css    # regenerate assets/daisyui.css after changing daisyUI classes
npm run build:i18n   # regenerate the 12 language pages + sitemap.xml
npm run lint:js      # eslint (sw.js + build config)
npm run lint:html    # html-validate
npm run format       # prettier
```

CI enforces that `assets/daisyui.css` matches a fresh build, so commit it whenever you add a daisyUI class.

### Page-weight budget

CI fails if the first-load set exceeds 900 KB or any single image exceeds 250 KB. The audience is largely on mobile data — encode images as WebP and keep frame overlays around 960px wide.

## Runtime dependencies

- html2canvas 1.4.1 — CDN, SRI-pinned (update the `integrity` hash if the version changes)
- Google Fonts: Rozha One, Tiro Devanagari Marathi
- daisyUI 4.x — self-hosted, tree-shaken, committed at `assets/daisyui.css`
