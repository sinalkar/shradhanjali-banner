# श्रद्धांजलि बॅनर (Shradhanjali Banner Maker)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hosting: Netlify](https://img.shields.io/badge/Hosting-Netlify-00C7B7?style=flat&logo=netlify)](https://shradhanjalibanner.in/)
[![Website](https://img.shields.io/badge/Website-shradhanjalibanner.in-460137)](https://shradhanjalibanner.in/)

> विनामूल्य श्रद्धांजलि बॅनर जनरेटर — मराठी, हिंदी आणि इंग्रजीत बॅनर तयार करा.
> A free, client-side, highly-respectful online memorial and funeral tribute banner generator designed for Marathi, Hindi, and English-speaking families.

---

## 🌸 Overview

**श्रद्धांजलि बॅनर** helps grieving families and print shop operators create customized, high-quality printable and shareable memorial announcement banners (भावपूर्ण श्रद्धांजली बॅनर) within minutes. 

Built with deep cultural reverence for Maharashtrian rituals, the application features Devanagari-first typography, devotional color palettes (anchored around warm marigolds, ritual parchment, and deep plums), and runs entirely in the browser.

---

## ✨ Features

- **🎨 6 Handcrafted Ritual Themes:**
  - **परंपरागत (Traditional):** Warm parchment background, marigold garlands, and oil lamps.
  - **सूर्यास्त (Sunset):** Serene orange-to-pink gradient representing the twilight of life.
  - **सागर (Ocean):** Calm blue tones for a peaceful, flowing tribute.
  - **क्लासिक (Classic):** Minimalist grayscale theme for a formal and dignified look.
  - **सोने (Golden):** Premium dark-gold rich devotional design.
  - **आकाश (Lavender):** Gentle, ethereal lavender gradient for peace and transcendence.

- **🌐 Tri-lingual Support:**
  - Full UI and localization in **मराठी (Marathi - Default)**, **हिंदी (Hindi)**, and **English**.

- **🖼️ Photo Frames & Overlays:**
  - Support for single or dual photo uploads with a beautiful, traditional gold-border photo frame overlay (`bg_photoframe.png`).

- **📱 Multiple Export Formats & Dimensions:**
  - **Standard Print Banner:** Landscape format for printing.
  - **WhatsApp Status / Instagram Story:** 9:16 portrait layout (1080×1920 px).
  - **Instagram Post:** 1:1 square layout (1080×1080 px).
  - **Flex Print (फिक्स साईज):** Customizable banner sizes (2x3, 3x4, 4x6, 6x4 ft) at specific resolution settings (**72 / 150 / 300 DPI**).

- **🔒 Privacy-First & Serverless:**
  - No database, no backend server, no login, no accounts. All image compilation happens **entirely on your local browser** via `html2canvas`. User images never touch a server.

---

## 🎨 Design Philosophy ("The Marigold Threshold")

This system is built around a warm, respectful visual vocabulary representing the entrance to a memorial space — marigold garlands draped over a doorway, the amber glow of oil lamps, and warm incense.

- **No SaaS Purple or Tech Gradients:** Rejects generic tech aesthetics in favor of deeply spiritual colors (Devotional Maroon `#460137`, Marigold Amber `#f39c12`, and Ceremony Mauve `#894dce`).
- **Devanagari-First:** Font scales, line heights, and typography weights are optimized specifically for Devanagari letterforms (**Rozha One** for headlines/deceased names, **Tiro Devanagari Marathi** for text).
- **Mobile-Native:** Optimized for older family members accessing via Android devices on the go, utilizing touch-friendly targets, high contrast, and legible, simple layouts.

---

## 🛠️ Technology Stack & Architecture

This is a pure static single-page web application (SPA) with **no heavy modern build tools or Node.js frameworks**, designed for instant loading, high durability, and simple hosting.

- **Core:** Semantic HTML5, CSS3 Custom Properties (CSS variables) for immediate theme switching, and Vanilla JavaScript.
- **Styling:** Bootstrap 5.3.3 grid classes (primarily used for form grouping and structural capture layout within `html2canvas`).
- **Typography:** Google Fonts (`Rozha One` & `Tiro Devanagari Marathi`).
- **Rendering/Export:** `html2canvas` (loaded via CDN) captures the active `#banner` DOM element at a custom scale multiplier (e.g. 2.5x for high resolution) and triggers a browser download.
- **Analytics:** Minimal privacy-compliant Google Analytics tag.

---

## 🚀 Getting Started (Local Development)

Because this project is a serverless static web application, local setup requires no installation or package managers:

1. Clone the repository:
   ```bash
   git clone https://github.com/sinalkar/shradhanjali-banner.git
   cd shradhanjali-banner
   ```

2. Start a local HTTP server (highly recommended, as `html2canvas` blocklists direct `file://` protocols for canvas image security):
   
   Using **Python 3**:
   ```bash
   python3 -m http.server 8080
   ```
   
   Using **Node / npx**:
   ```bash
   npx serve .
   ```

3. Open [http://localhost:8080](http://localhost:8080) in your web browser.


---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

```
Copyright (c) 2026 Sanjay Sinalkar
```

---

*For queries, issues, or contributions, please feel free to open a pull request or get in touch.*
