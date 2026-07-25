/**
 * Tailwind + daisyUI build config.
 *
 * The site ships as plain static HTML — this build exists only to produce a
 * tree-shaken `assets/daisyui.css` from the handful of daisyUI components the
 * page actually uses. The built file is committed, so deploying still needs no
 * build step. Run `npm run build:css` after changing classes in index.html.
 *
 * Two constraints drive the unusual settings below:
 *
 * 1. `preflight: false` — the page has its own reset and hand-written design
 *    system. Tailwind's preflight would restyle headings, images and borders
 *    inside the banner and change the rendered output.
 *
 * 2. A single custom theme named `shraddha`. daisyUI's stock themes bind to
 *    `[data-theme="light"]` / `[data-theme="dark"]`, which are the exact
 *    attribute values the site already uses for its own light/dark mode. Using
 *    one custom theme emits the variables under `:root` instead, so there is no
 *    collision. Colours mirror the existing CSS custom properties.
 */
module.exports = {
  content: ['./index.html', './404.html'],

  // The page provides its own reset; Tailwind's would alter banner rendering.
  corePlugins: { preflight: false },

  // Classes toggled from JavaScript are never seen by the content scanner.
  safelist: [
    'alert-success',
    'alert-error',
    'alert-info',
    'progress-primary',
    'btn-disabled',
    'collapse-open',
  ],

  plugins: [require('daisyui')],

  daisyui: {
    logs: false,
    themes: [
      {
        shraddha: {
          primary: '#460137',
          'primary-content': '#fff5ee',
          secondary: '#c9a06a',
          'secondary-content': '#2b0022',
          accent: '#c97d08',
          'accent-content': '#180800',
          neutral: '#3a0130',
          'neutral-content': '#fff5ee',
          'base-100': '#fdf8f0',
          'base-200': '#f6f0e8',
          'base-300': '#e4cfb4',
          'base-content': '#3d1020',
          info: '#2f6f8f',
          success: '#1f7a4d',
          warning: '#c97d08',
          error: '#9c1024',
          '--rounded-btn': '10px',
          '--rounded-box': '12px',
          '--border-btn': '1px',
        },
      },
    ],
  },
};
