#!/usr/bin/env node
/**
 * Generates one real, server-rendered HTML page per language.
 *
 * Why this exists
 * ---------------
 * The app is a single client-side-rendered page. Before this, all 12 languages
 * lived behind `?lang=xx` and served byte-identical HTML — so a crawler saw
 * Marathi at every URL, Google folded them into one, and 11 of the 12
 * languages could never rank. hreflang cannot fix that: alternates must be
 * self-canonical AND return content in their own language.
 *
 * This emits `/<lang>/index.html` for the 11 non-default locales, each with
 * translated <title>, meta description, Open Graph, visible copy, FAQ, About
 * and JSON-LD already in the markup — no JavaScript required to read it.
 * Marathi stays at the root as the x-default.
 *
 * Output is committed, so deploying still needs no build step. CI regenerates
 * and fails on drift (see .github/workflows/code-quality.yml).
 *
 * Usage: npm run build:i18n
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://shradhanjalibanner.in';
const DEFAULT_LANG = 'mr';

const SEO = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', 'seo.json'), 'utf8'));
const SEO_LANGS = Object.keys(SEO).filter((k) => !k.startsWith('_'));

const source = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ── Pull the translation tables straight out of the page ──────────────────
   index.html stays the single source of truth for UI strings; duplicating
   them into a build config would guarantee they drift apart. */
function extractObject(name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start === -1) throw new Error(`Could not find "${name}" in index.html`);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) {
        return eval('(' + source.slice(open, i + 1) + ')');
      }
    }
  }
  throw new Error(`Unbalanced braces reading "${name}"`);
}

const TRANSLATIONS = extractObject('TRANSLATIONS');
const metaTitles = extractObject('metaTitles');
const metaDescs = extractObject('metaDescs');

/* index.html decides which languages the app actually ships — seo.json only
   supplies copy for them. Deriving the list from TRANSLATIONS means adding or
   removing a language in the app is enough; the pages follow. Urdu was removed
   from the app once while its SEO copy stayed behind, and generating a page
   for a language with no UI strings would have shipped a broken page. */
const APP_LANGS = Object.keys(TRANSLATIONS);
const LANGS = APP_LANGS.filter((l) => SEO_LANGS.includes(l));

const missingCopy = APP_LANGS.filter((l) => !SEO_LANGS.includes(l));
if (missingCopy.length) {
  console.error(
    `\nERROR: index.html ships ${missingCopy.join(', ')} but i18n/seo.json has no copy for ` +
      `${missingCopy.length > 1 ? 'them' : 'it'}.\n` +
      `Add ${missingCopy.length > 1 ? 'entries' : 'an entry'} to i18n/seo.json, or remove ` +
      `${missingCopy.length > 1 ? 'those languages' : 'that language'} from TRANSLATIONS.\n`
  );
  process.exit(1);
}

const unusedCopy = SEO_LANGS.filter((l) => !APP_LANGS.includes(l));
if (unusedCopy.length) {
  console.log(
    `  note: seo.json has copy for ${unusedCopy.join(', ')}, which the app does not ship — ` +
      `keeping it, generating nothing.`
  );
}

for (const l of LANGS) {
  if (!metaTitles[l] || !metaDescs[l]) {
    console.error(`\nERROR: ${l} is in TRANSLATIONS but missing from metaTitles/metaDescs.\n`);
    process.exit(1);
  }
}

const canonicalFor = (lang) => (lang === DEFAULT_LANG ? `${ORIGIN}/` : `${ORIGIN}/${lang}/`);

/* Relative URLs break one directory down, so make every asset root-absolute. */
const ASSET_PREFIXES = ['assets/', 'frames/', 'icons/', 'sample-photo-', 'manifest.json', 'favicon.ico'];

function rootAbsolutise(html) {
  let out = html;
  for (const p of ASSET_PREFIXES) {
    out = out
      .split(`href="${p}`).join(`href="/${p}`)
      .split(`src="${p}`).join(`src="/${p}`)
      .split(`url(${p}`).join(`url(/${p}`)
      .split(`'${p}`).join(`'/${p}`);
  }
  return out.split("register('./sw.js')").join("register('/sw.js')");
}

/* Removing a node leaves its surrounding whitespace behind. index.html is both
   template and output, so those blanks would accumulate on every run and the
   CI drift check would never settle. Collapsing runs of blank lines makes the
   generator converge. Safe here: no textarea default contains a blank line. */
function normaliseBlankLines(html) {
  return html.replace(/(?:[ \t]*\r?\n){3,}/g, '\n\n');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const GALLERY_TITLES = {
  mr: 'नमुना श्रद्धांजली बॅनर डिझाईन्स',
  hi: 'नमूना श्रद्धांजलि बैनर डिज़ाइन',
  en: 'Sample Shradhanjali Banner Designs',
  bn: 'নমুনা শ্রদ্ধাঞ্জলি ব্যানার ডিজাইন',
  te: 'నమూనా శ్రద్ధాంజలి బ్యానర్ డిజైన్లు',
  ta: 'மாதிரி இரங்கல் கார்டு வடிவமைப்பு',
  gu: 'નમૂના શ્રદ્ધાંજલિ બેનર ડિઝાઇન',
  kn: 'ನಮೂನೆ ಶ್ರದ್ಧಾಂಜಲಿ ಬ್ಯಾನರ್ ಡಿಸೈನ್ಸ್',
  ml: 'മാതൃകാ ആദരാഞ്ജലി ബാനർ ഡിസൈനുകൾ',
  pa: 'ਨਮੂਨਾ ਸ਼ਰਧਾਂਜਲੀ ਬੈਨਰ ਡਿਜ਼ਾਈਨ',
  or: 'ନମୁନା ଶ୍ରଦ୍ଧାଞ୍ଜଳି ବ୍ୟାନର ଡିଜାଇନ୍',
};

const GALLERY_SUBS = {
  mr: 'विविध रंगसंगती, फोटो फ्रेम व आकारामधील तयार नमुने',
  hi: 'विभिन्न रंग, फोटो फ्रेम और आकार में तैयार नमूने',
  en: 'Pre-rendered sample banners across themes, frames and dimensions',
};

function buildGallerySection(lang) {
  const title = GALLERY_TITLES[lang] || GALLERY_TITLES.en;
  const sub = GALLERY_SUBS[lang] || GALLERY_SUBS.en;

  const samples = [
    {
      file: `assets/samples/${lang}_whatsapp.jpg`,
      alt: `${title} - WhatsApp Status (9:16)`,
      tag: 'WhatsApp Status (9:16)',
    },
    {
      file: `assets/samples/${lang}_instagram.jpg`,
      alt: `${title} - Instagram Post (1:1)`,
      tag: 'Instagram Post (1:1)',
    },
    {
      file: `assets/samples/${lang}_print.jpg`,
      alt: `${title} - Print Banner`,
      tag: 'Print Banner (Landscape)',
    },
    {
      file: `assets/samples/${lang}_flex.jpg`,
      alt: `${title} - Flex Banner (6x4 ft)`,
      tag: 'Flex Print (6x4 ft)',
    },
  ];

  const cards = samples
    .map(
      (s) => `
                <div class="gallery-card">
                    <img src="${s.file}" alt="${esc(s.alt)}" loading="lazy" width="320" height="240">
                    <span class="gallery-tag">${esc(s.tag)}</span>
                </div>`
    )
    .join('\n');

  return `
            <section class="sample-gallery-section" id="sampleGallery">
                <h3 class="gallery-heading">🖼️ ${esc(title)}</h3>
                <p class="gallery-sub">${esc(sub)}</p>
                <div class="gallery-grid">
${cards}
                </div>
            </section>
`;
}

function buildFaqSection(lang) {
  const d = SEO[lang];
  const items = d.faq
    .map(
      (f, i) => `
                <details class="collapse collapse-arrow faq-item"${i === 0 ? ' open' : ''}>
                    <summary class="collapse-title faq-q">${esc(f.q)}</summary>
                    <div class="collapse-content faq-a">
                        <p><strong>${esc(f.a)}</strong></p>
                        <p>${esc(f.a2)}</p>
                    </div>
                </details>`
    )
    .join('\n');

  return `
${buildGallerySection(lang)}
            <hr class="faq-rule">

            <h3 id="faqHeading" class="faq-heading">${esc(d.faqHeading)}</h3>

            <div class="faq-list">${items}
            </div>

            <div class="about-block">
                <h4 class="about-heading">${esc(d.glossaryTerm)}</h4>
                <p>${esc(d.glossaryDef)}</p>
            </div>

            <div class="about-block">
                <h4 class="about-heading">&#8505;&#65039; ${esc(d.aboutHeading)}</h4>
                <p>${esc(d.about)}</p>
                <p class="about-meta">
                    <span>&#9881;&#65039; FileReader API, daisyUI &amp; html2canvas &mdash; 100% local processing.</span>
                    <span>&#128340; Last updated: July 2026</span>
                </p>
            </div>
`;
}

function buildJsonLd(lang) {
  const d = SEO[lang];
  const url = canonicalFor(lang);
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: metaTitles[lang],
      description: metaDescs[lang],
      inLanguage: d.locale,
      isPartOf: { '@id': `${ORIGIN}/#website` },
      about: { '@id': `${ORIGIN}/#app` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.faq-a p strong', '.about-block p'],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: d.locale,
      mainEntity: d.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: `${f.a} ${f.a2}` },
      })),
    },
    {
      '@type': 'DefinedTerm',
      '@id': `${url}#term`,
      name: d.glossaryTerm,
      description: d.glossaryDef,
      inLanguage: d.locale,
    },
  ];

  if (lang !== DEFAULT_LANG) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Shradhanjali Banner',
          item: `${ORIGIN}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: metaTitles[lang],
          item: url,
        },
      ],
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function generate(lang, atRoot) {
  const doc = parse(source, { comment: true });

  /* Re-running must be idempotent — index.html is both the template and one of
     the outputs, so strip anything a previous run appended before rebuilding. */
  doc.querySelectorAll('[data-generated="i18n"]').forEach((el) => el.remove());
  const d = SEO[lang];
  const url = canonicalFor(lang);

  /* ── <html> ── */
  const html = doc.querySelector('html');
  html.setAttribute('lang', lang);
  if (d.dir) html.setAttribute('dir', d.dir);
  else html.removeAttribute('dir');

  /* ── Title + description ── */
  doc.querySelector('title').set_content(esc(metaTitles[lang]));
  const setMeta = (sel, val) => {
    const el = doc.querySelector(sel);
    if (el) el.setAttribute('content', val);
  };
  setMeta('meta[name="description"]', metaDescs[lang]);
  setMeta('meta[property="og:title"]', metaTitles[lang]);
  setMeta('meta[property="og:description"]', metaDescs[lang]);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:locale"]', d.locale.replace('-', '_'));
  setMeta('meta[name="twitter:title"]', metaTitles[lang]);
  setMeta('meta[name="twitter:description"]', metaDescs[lang]);

  /* ── Self-referencing canonical: the whole point of the exercise ── */
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', url);

  /* ── hreflang cluster, rebuilt for the new directory URLs ── */
  doc.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
  const head = doc.querySelector('head');
  const alts = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${canonicalFor(l)}" data-generated="i18n">`
  ).join('\n    ');
  head.insertAdjacentHTML(
    'beforeend',
    `\n    ${alts}\n    <link rel="alternate" hreflang="x-default" href="${ORIGIN}/" data-generated="i18n">\n`
  );

  /* ── Pre-render every UI string so crawlers need no JavaScript ── */
  const T = TRANSLATIONS[lang] || {};
  doc.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = T[el.getAttribute('data-i18n')];
    if (typeof v === 'string') el.set_content(esc(v));
  });
  doc.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const v = T[el.getAttribute('data-i18n-ph')];
    if (typeof v === 'string') el.setAttribute('placeholder', v);
  });

  /* ── Language selector reflects the page it is on ── */
  doc.querySelectorAll('#langSelect option').forEach((opt) => {
    if (opt.getAttribute('value') === lang) opt.setAttribute('selected', '');
    else opt.removeAttribute('selected');
  });

  /* ── Translated FAQ / definition / about ── */
  const faq = doc.querySelector('.seo-faq-section');
  if (faq) faq.set_content(buildFaqSection(lang));

  /* ── Per-language JSON-LD appended after the shared graph ── */
  head.insertAdjacentHTML(
    'beforeend',
    `\n    <script type="application/ld+json" data-generated="i18n">\n${JSON.stringify(buildJsonLd(lang), null, 6)}\n    </script>\n`
  );

  /* ── Tell the runtime which language this page was built for ── */
  const marker = `<script data-generated="i18n">window.__PRERENDER_LANG = ${JSON.stringify(lang)};</script>`;
  head.insertAdjacentHTML('afterbegin', `\n    ${marker}\n`);

  const out = atRoot ? doc.toString() : rootAbsolutise(doc.toString());
  return normaliseBlankLines(out);
}

/* ── Write ─────────────────────────────────────────────────────────────── */
let written = 0;
for (const lang of LANGS) {
  const isDefault = lang === DEFAULT_LANG;
  const dir = isDefault ? ROOT : path.join(ROOT, lang);
  if (!isDefault) fs.mkdirSync(dir, { recursive: true });
  // The default language is served from the root, so it keeps relative asset
  // paths — only the sub-directory pages need them made root-absolute.
  const out = isDefault ? generate(lang, true) : generate(lang);
  fs.writeFileSync(path.join(dir, 'index.html'), out);
  console.log(
    `  ${(isDefault ? 'index.html' : lang + '/index.html').padEnd(16)} ` +
      `${(Buffer.byteLength(out) / 1024).toFixed(0)} KB  ${metaTitles[lang].slice(0, 40)}…`
  );
  written++;
}

/* ── Sitemap: every language is now a real, self-canonical URL ─────────── */
const today = new Date().toISOString().slice(0, 10);
const entries = LANGS.map((lang) => {
  const alts = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${canonicalFor(l)}" />`
  ).join('\n');
  return `  <url>
    <loc>${canonicalFor(lang)}</loc>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/" />
    <lastmod>${today}</lastmod>
  </url>`;
}).join('\n\n');

fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Generated by scripts/build-i18n.js — do not edit by hand.
  Every language is a real server-rendered page with a self-referencing
  canonical, which is what lets the hreflang cluster below be honoured.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${entries}

</urlset>
`
);

console.log(`\n  sitemap.xml  ${LANGS.length} URLs with full hreflang cluster`);

/* A manifest of what was actually generated, so the CI checks and anything
   else downstream agree with the app instead of re-deriving the list (and
   drifting, which is exactly how Urdu ended up half-removed). */
fs.writeFileSync(
  path.join(ROOT, 'i18n', 'languages.json'),
  JSON.stringify({ default: DEFAULT_LANG, languages: LANGS }, null, 2) + '\n'
);
console.log(`  i18n/languages.json  ${LANGS.join(', ')}`);
console.log(`\nGenerated ${written} language pages (${DEFAULT_LANG} at the root).`);
