---
name: श्रद्धांजलि बॅनर
description: Funeral memorial banner generator for Marathi and Hindi-speaking families
colors:
  devotional-maroon: "#460137"
  devotional-magenta: "#a805a1"
  marigold-amber: "#f39c12"
  ceremony-mauve: "#894dce"
  ritual-parchment: "#faf8f0"
  deep-plum: "#360128"
  near-black: "#212121"
  flower-crimson: "#e74c3c"
  surface-white: "#FFFFFF"
  ink-on-parchment: "#360128"
typography:
  display:
    fontFamily: "'Rozha One', Georgia, serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "'Rozha One', Georgia, serif"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.005em"
  body:
    fontFamily: "'Tiro Devanagari Marathi', Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body-bold:
    fontFamily: "'Tiro Devanagari Marathi', Georgia, serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.65
  label:
    fontFamily: "'Tiro Devanagari Marathi', Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "10px"
  lg: "15px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.devotional-maroon}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "#6e0352"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-download:
    backgroundColor: "{colors.marigold-amber}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  button-download-hover:
    backgroundColor: "#cc7800"
    textColor: "{colors.near-black}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  banner-card:
    backgroundColor: "{colors.ritual-parchment}"
    rounded: "{rounded.lg}"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: श्रद्धांजलि बॅनर

## 1. Overview

**Creative North Star: "The Marigold Threshold"**

This system is built around a single physical scene: the entrance to a memorial space — marigold garlands draped over a doorway, the amber glow of oil lamps against deep maroon cloth, the smell of incense. It is warm without being festive. Devotional without being cold. Every decision is measured against that threshold: does this belong in that space?

The audience arrives in grief. Many are on Android phones, under time pressure, often in a household where an elder has just died. The interface cannot demand attention or add friction. It earns trust by being exactly what the moment needs: familiar, quiet, precise. The Devanagari script is not a translation layer — it is the native tongue of this tool.

This system explicitly rejects the generic startup palette (purple gradients, white surfaces, blue CTAs — what the current header still carries), the cold government form aesthetic, and the Western funeral parlor visual vocabulary (navy, silver, black roses). Warmth here is carried by color temperature and typography, not by decoration or noise.

**Key Characteristics:**
- Devotional color vocabulary rooted in Maharashtrian ritual (maroon, amber, mauve, parchment)
- Devanagari-first typography: Rozha One for ceremony weight, Tiro Devanagari Marathi for text
- Mobile-native layout: large touch targets, generous text, no pinch-to-zoom
- Flat-at-rest elevation; shadow appears only as structural containment on the banner card
- Transitions at 0.5s ease for theme switches (intentionally unhurried)

## 2. Colors: The Ritual Palette

A palette drawn from the physical materials of a Maharashtrian Hindu ceremony: the maroon and magenta of ritual cloth, the amber of marigolds and lamp flame, the off-white of sacred ash and cotton.

### Primary
- **Devotional Maroon** (`#460137`, oklch ≈ 18% 0.13 320): The deepest anchor. Family section background in the traditional banner theme. Used as the page header and primary action surface. Represents the weight and gravity of ceremony.
- **Devotional Magenta** (`#a805a1`, oklch ≈ 45% 0.25 310): The vibrant ceremonial accent. Used for the deceased's name display — the most important text on the banner. Never used casually or on UI chrome; it carries singular weight.

### Secondary
- **Marigold Amber** (`#f39c12`, oklch ≈ 72% 0.17 62): The warm light. Oil lamp, marigold garland, ritual fire. Used as the download/action button background and decorative lamp elements. The counterweight to the dark maroon: warm, alive, hopeful.
- **Ceremony Mauve** (`#894dce`, oklch ≈ 52% 0.18 295): The ceremony title color. A lighter devotional purple, less intense than the magenta. Used for ceremony and occasion headings within the banner.

### Neutral
- **Ritual Parchment** (`#faf8f0`, oklch ≈ 97% 0.008 82): The banner background in the traditional theme. Not a page background — it represents the surface of the printed banner: cotton, sacred paper, ritual cloth. Never use as the page body background; reserve for the banner output only.
- **Deep Plum** (`#360128`, oklch ≈ 13% 0.12 330): Primary body text in the traditional banner theme. Near-black with a devotional warmth.
- **Near Black** (`#212121`, oklch ≈ 17% 0 0): UI text, labels, and form body copy. Used where neutrality serves legibility over atmosphere.
- **Surface White** (`#FFFFFF`): Form fields, input backgrounds, card surfaces within the form area.

### Named Rules
**The Parchment Rule.** Ritual Parchment (`#faf8f0`) is reserved for the banner output. The page body is never parchment. On the interface side, backgrounds are either the deep maroon of the header or the clean white of the form surface.

**The One Magenta Rule.** Devotional Magenta appears only on the primary name display within the banner. It does not appear on buttons, links, or labels. Its rarity is the point.

## 3. Typography

**Display Font:** Rozha One (with Georgia, serif fallback)
**Body Font:** Tiro Devanagari Marathi (with Georgia, serif fallback)

**Character:** Rozha One carries the weight of ceremonial inscription — thick strokes, compressed forms, the presence of carved stone or inked announcement boards. Tiro Devanagari Marathi is a reading font first, designed for the Devanagari script's density and vertical stroke rhythm. Together they speak to print culture: the bold proclamation and the legible record. Both are selected first for Devanagari, which means Latin characters benefit from the pairing rather than the reverse.

### Hierarchy
- **Display** (Rozha One, 400, clamp(2rem–3.5rem), lh 1.1): The deceased's name on the banner. The single most prominent text element.
- **Headline** (Rozha One, 400, clamp(1.5rem–2.5rem), lh 1.2): Banner ceremony title ("भावपूर्ण श्रद्धांजली") and page section headers.
- **Title** (Tiro Devanagari Marathi, 700, 1.25rem–1.5rem, lh 1.4): Form section headings, banner sub-headings (age, death date).
- **Body** (Tiro Devanagari Marathi, 400, 1rem, lh 1.65): Memorial message text, ceremony details, family names on banner. Max line length 65ch for the memorial message field.
- **Label** (Tiro Devanagari Marathi, 700, 0.875rem, lh 1.4): Form field labels. No all-caps. Labels in Marathi/Hindi should be in the script's natural case.

### Named Rules
**The Script-First Rule.** Font size, line height, and letter spacing are calibrated for Devanagari letterforms. If an adjustment improves Latin rendering but harms Devanagari readability, Devanagari wins.

**The No All-Caps Rule.** Form labels are never set in all-caps. Devanagari does not have a case system; applying an uppercase transform to mixed scripts produces inconsistent output and signals a Latin-first design reflex.

## 4. Elevation

This system is nearly flat. The primary shadow appears only as structural containment — the banner card is the focal object of the page, and a meaningful shadow (`0 10px 30px rgba(0,0,0,0.2)`) lifts it above the form surface to signal "this is the output, the thing you're making." All other containers are flat or use a single ambient shadow (`0 5px 15px rgba(0,0,0,0.1)`) for section grouping only.

There is no interactive elevation change (no lift on hover, no pressed shadow). Hover states are communicated through color shift alone, not through shadow or transform. This matches the emotional register: this is not a playful tool, and motion should not feel energetic.

### Shadow Vocabulary
- **Structural lift** (`0 10px 30px rgba(0,0,0,0.2)`): The banner preview card only. Communicates "this is the output."
- **Section ambient** (`0 5px 15px rgba(0,0,0,0.1)`): Form section grouping. Subtle depth, no drama.

### Named Rules
**The Flat-By-Default Rule.** Shadows are not feedback mechanisms. They are spatial anchors. No shadow increases on hover or focus; depth is fixed at rest.

## 5. Components

### Buttons

Buttons have two distinct roles. The Generate action is the primary task trigger — it should feel deliberate, grounded, ceremonial. The Download action is the culmination — the moment the family has what they came for.

- **Shape:** Gently rounded (10px radius). Not pill-shaped, not square.
- **Primary (Generate):** Devotional Maroon (`#460137`) background, white text. Padding 12px × 28px. Tiro Devanagari Marathi, 700, 1rem. Hover: lightens to `#6e0352`.
- **Download:** Marigold Amber (`#f39c12`) background, Near Black text. Padding 12px × 32px. Same type. Hover: deepens to `#cc7800`. The amber-on-dark-text pairing is the only button using the warm amber key.
- **Focus:** 3px solid `#894dce` (ceremony mauve) offset ring on both variants. Visible on both light and dark surfaces.
- **Disabled:** 40% opacity. No structural change.

### Inputs / Fields

The form uses Bootstrap 5 defaults currently. The aspirational spec:

- **Style:** White background, 1px solid `#d0c8cc` (warm gray border), 8px radius.
- **Focus:** Border shifts to Devotional Maroon (`#460137`), 1px. No glow. Quiet, not electric.
- **Error:** Border `#e74c3c` (flower crimson), inline message in the same color, body font 0.875rem.
- **Labels:** Tiro Devanagari Marathi 700 0.875rem, Near Black, no transform.

### Cards / Containers

- **Banner Card (the preview):** 15px radius, Ritual Parchment background (`#faf8f0`), structural shadow (`0 10px 30px rgba(0,0,0,0.2)`). This is the only element with this weight of shadow.
- **Form Section:** White background, 10px radius, section ambient shadow (`0 5px 15px rgba(0,0,0,0.1)`). Bootstrap `.bg-light.rounded-3` currently; aspirational is warmer off-white surface.

### Navigation
No navigation bar exists. The page header serves as the primary brand surface. It must use Devotional Maroon (`#460137`) as background, not the current purple gradient (`#667eea → #764ba2`). White Rozha One text for the site name.

### Theme Selector (Signature Component)

The four banner color themes (Traditional, Sunset, Ocean, Classic) are selected via a `<select>` dropdown. Aspirationally, this becomes a row of color swatches — four circular or square tiles showing the banner background gradient, labeled in Marathi. The active theme has a ring in Devotional Maroon. No dropdown; swatches are direct-tap targets.

## 6. Do's and Don'ts

### Do:
- **Do** use Devotional Maroon (`#460137`) as the page header background, replacing the purple gradient entirely.
- **Do** set all form labels in Tiro Devanagari Marathi at a minimum 0.875rem, 700 weight, Near Black — never muted gray on white. Older family members must be able to read them.
- **Do** maintain 4.5:1 contrast for all body text. The memorial message, family names, and ceremony details are the user's words about their loved one — they must be readable.
- **Do** use Marigold Amber (`#f39c12`) for the download action. The warmth of completion.
- **Do** treat the Devanagari letterforms as the primary calibration target for all font sizing, line height, and letter spacing decisions.
- **Do** keep hover and focus transitions at 0.3s–0.5s ease for color changes. This is an unhurried interface.
- **Do** ensure all touch targets on the form are at minimum 44 × 44px. Many users are on mobile phones with large fingers, in grief.

### Don't:
- **Don't** use the current `#667eea → #764ba2` purple gradient anywhere. It is a generic startup product aesthetic, explicitly wrong for this context.
- **Don't** use Bootstrap's default blue primary or green success colors on any visible button. They carry no meaning in this context and undermine the devotional palette.
- **Don't** use Ritual Parchment (`#faf8f0`) as the page body background. It belongs to the printed banner output, not the UI chrome.
- **Don't** put government-form-style layouts on the input section: cold single-column stacked fields with no warmth, no grouping, no visual breathing room.
- **Don't** use a dark navy, silver, or black-rose aesthetic. That is the Western funeral parlor visual vocabulary, not Maharashtrian Hindu ritual culture.
- **Don't** use cheerful, energetic, or festive UI language anywhere — no gradients suggesting celebration, no bright rainbow palettes in the UI chrome.
- **Don't** set labels in all-caps. Devanagari has no uppercase; the transform produces incorrect or inconsistent output on mixed-script content.
- **Don't** use gradient text (`background-clip: text`). Emphasis is carried by weight, size, or color — never by a gradient masking over letters.
- **Don't** add side-stripe `border-left` accents to cards or form sections. They read as bureaucratic separation, not devotional warmth.
