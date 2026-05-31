# श्रद्धांजलि बॅनर — Shradhanjali Banner

**Free, privacy-first memorial banner generator for Indian families.**  
Create customisable funeral/tribute announcement banners in 12 Indian languages and download them for print, WhatsApp, Instagram, or flex printing — entirely in the browser, no backend, no data stored.

---

## Quick Start

```bash
docker pull sinalkar/shradhanjali-banner:latest
docker run -d -p 8080:80 sinalkar/shradhanjali-banner:latest
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Features

| Feature | Details |
|---|---|
| **Languages** | मराठी · हिन्दी · English · বাংলা · తెలుగు · தமிழ் · ગુજરાતી · ಕನ್ನಡ · മലയാളം · ਪੰਜਾਬੀ · ଓଡ଼ିଆ · اردو |
| **Themes** | 6 handcrafted themes — Traditional, Sunset, Ocean, Classic, Golden, Lavender |
| **Download formats** | Print · WhatsApp status (9:16) · Instagram post (1:1) · Flex print (2×3 to 6×4 ft, 72–300 DPI) |
| **Photo frames** | Gold ornate oval frame · Optional speaker/organiser photo |
| **Privacy** | 100% client-side — photos and data never leave the browser |

---

## Available Tags

| Tag | Description |
|---|---|
| `latest` | Latest stable build from `main` |
| `1.x.x` | Specific release version |
| `1.x` | Latest patch for a minor version |
| `sha-xxxxxxx` | Exact commit build |

---

## Supported Platforms

- `linux/amd64` — standard servers, VPS, x86 Docker Desktop
- `linux/arm64` — Apple Silicon, Raspberry Pi, AWS Graviton

---

## Environment

This is a **static site** served by `nginx:alpine`. No environment variables required.  
Default port: `80` inside the container.

```bash
# Custom port mapping
docker run -d -p 3000:80 sinalkar/shradhanjali-banner:latest

# With Docker Compose
services:
  shradhanjali:
    image: sinalkar/shradhanjali-banner:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

---

## Links

- **Live site:** https://shradhanjalibanner.in/
- **Source code:** https://github.com/sinalkar/shradhanjali-banner
- **Release notes:** https://github.com/sinalkar/shradhanjali-banner/releases
- **Issues:** https://github.com/sinalkar/shradhanjali-banner/issues

---

*Built with ❤️ for grieving families across India.*
