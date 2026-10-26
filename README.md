# Historia Salutis

An interactive biblical storybook web application built as a single-page 2.5D scrollytelling experience.

`Historia Salutis` narrates the redemptive arc of Scripture across 8 canonical chapters (Genesis → Revelation) using:

- multi-plane parallax dioramas
- smooth inertial scrolling
- chapter-aware ambient audio
- an illuminated scripture study drawer
- classical manuscript-inspired visual design

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Chapter Structure](#chapter-structure)
- [Project Structure](#project-structure)
- [Clone Tutorial](#clone-tutorial)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Asset Pipeline (Images)](#asset-pipeline-images)
- [Audio Pipeline (Ambient Tracks)](#audio-pipeline-ambient-tracks)
- [Configuration & Theming](#configuration--theming)
- [Architecture Notes](#architecture-notes)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **8 Canonical Story Chapters** with pinned fullscreen scrollytelling sections.
- **Three Visual Planes per Chapter** (background / midground / foreground) with layered parallax motion.
- **Smooth Scroll Navigation** via Lenis + chapter navigation bar.
- **GSAP ScrollTrigger Timelines** for pinning, section transitions, and chapter state updates.
- **Scripture Drawer** with chapter citations, theological summary, and cross references.
- **Audio HUD** with play/pause/mute, master volume slider, and live visualizer bars.
- **Chapter-Aware Ambient Audio** from `Chapter1`–`Chapter8` local tracks.
- **Startup Audio Integrity Check** that warns when chapter tracks are missing.
- **Responsive Layout** optimized for laptop/mobile, including touch-friendly chapter navigation.

---

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + custom manuscript palette/styles
- **Animation:** GSAP (`ScrollTrigger`)
- **Smooth Scrolling:** `@studio-freight/lenis`
- **Icons:** `lucide-react`
- **Audio:** Web Audio API + local chapter audio `.mp3/.ogg/.wav`

---

## Chapter Structure

The story flow includes:

1. The Garden and the Fracture (`Genesis 2–3`)
2. The Covenant of the Stars (`Genesis 15`)
3. The Waters and the Staff (`Exodus 14`)
4. The Glory in the Wilderness (`Exodus 40`)
5. The Word Made Flesh (`Luke 2; John 1`)
6. The Master of the Deep (`Mark 4`)
7. The Veil Torn and the Empty Garden (`Luke 23–24`)
8. The City and the Restored Tree (`Revelation 21–22`)

Primary data source: `src/data/chaptersData.ts`.

---

## Project Structure

```text
.
├─ public/
│  ├─ assets/chapters/<chapter-id>/{background,midground,foreground}.*
│  └─ audio/new-audio/Chapter<1-8>.mp3
├─ scripts/
│  ├─ asset-sources.json
│  ├─ audio-sources.json
│  ├─ download-assets.mjs
│  ├─ download-audio.mjs
│  └─ optimize-audio.mjs
├─ src/
│  ├─ components/
│  │  ├─ NavigationBar.tsx
│  │  ├─ ScriptureDrawer.tsx
│  │  └─ StoryChapter.tsx
│  ├─ data/
│  │  ├─ chapterLayerAssets.ts
│  │  └─ chaptersData.ts
│  ├─ utils/
│  │  └─ audioEngine.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ ASSETS.md
├─ AUDIO.md
└─ package.json
```

---

## Clone Tutorial

### 1) Copy the repository URL

Repository URL:

- `https://github.com/Nathaniel1024/historia-salutis.git`

### 2) Clone the project

```bash
git clone https://github.com/Nathaniel1024/historia-salutis.git
```

### 3) Enter the project folder

```bash
cd historia-salutis
```

### 4) Install dependencies

```bash
npm install
```

### 5) Start the app

```bash
npm run dev
```

### 6) (Optional) Download media assets

```bash
npm run assets:download
npm run audio:download
npm run audio:optimize
```

---

## Getting Started

### 1) Prerequisites

- **Node.js:** `>= 22` (recommended: latest **LTS**)
- **npm:** `>= 10`
- **ffmpeg:** required for `npm run audio:optimize`

This repo includes:

- `.nvmrc` → `lts/*`
- `.node-version` → `lts/*`

So version managers can auto-select a modern LTS runtime.

### 2) Install dependencies

```bash
npm install
```

### 3) (Optional) Download chapter images

```bash
npm run assets:download
```

### 4) (Optional) Download ambient chapter audio

```bash
npm run audio:download
```

### 5) Start development server

```bash
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

---

## Available Scripts

- `npm run dev` — start Vite dev server.
- `npm run build` — type-check + production build.
- `npm run preview` — serve the built app locally.
- `npm run assets:download` — fetch chapter image planes into `public/assets/chapters`.
- `npm run audio:download` — fetch chapter ambient audio into `public/audio/new-audio`.
- `npm run audio:optimize` — compress/trim chapter audio for faster page loading.

---

## Asset Pipeline (Images)

Image layers are auto-detected per chapter from:

- `public/assets/chapters/chapter-i/background.*`
- `public/assets/chapters/chapter-i/midground.*`
- `public/assets/chapters/chapter-i/foreground.*`

Supported extensions include `jpg`, `jpeg`, `webp`, `png`, `svg`.

If a layer is missing, the app falls back to internal gradient/painted layers so scenes still render.

### Source configuration

Edit `scripts/asset-sources.json` and re-run:

```bash
npm run assets:download
```

The downloader includes retry/backoff and host throttling to reduce `HTTP 429` failures.

For details, see `ASSETS.md`.

---

## Audio Pipeline (Ambient Tracks)

Place chapter tracks at:

- `public/audio/new-audio/Chapter1.mp3`
- ...
- `public/audio/new-audio/Chapter8.mp3`

Runtime supports manual files in `.mp3`, `.ogg`, `.wav`.

### Source configuration

Edit `scripts/audio-sources.json` and run:

```bash
npm run audio:download
```

Then optimize files for production performance:

```bash
npm run audio:optimize
```

Optional tuning:

```bash
AUDIO_BITRATE_KBPS=80 AUDIO_MAX_SECONDS=90 npm run audio:optimize
```

When chapter files exist in `public/audio/new-audio`, the app uses chapter-specific ambient playback.
If one or more files are missing, the app shows an on-screen warning listing missing tracks.

For details, see `AUDIO.md`.

---

## Configuration & Theming

- **Tailwind theme tokens:** `tailwind.config.js`
- **Global styles/noise/motif classes:** `src/index.css`
- **Chapter narrative + motion/audio metadata:** `src/data/chaptersData.ts`
- **Layer asset mappings:** `src/data/chapterLayerAssets.ts`

You can tune chapter mood by adjusting `cameraMood`, `colorGrade`, `focalHighlight`, and `motifTiming` in `src/data/chaptersData.ts`.

---

## Architecture Notes

- `src/App.tsx`
  - initializes Lenis
  - coordinates ScrollTrigger updates
  - handles chapter navigation, active chapter state, and audio state
- `src/components/StoryChapter.tsx`
  - renders three parallax planes + overlays
  - pins each chapter and drives chapter-local animation envelopes
- `src/components/NavigationBar.tsx`
  - chapter navigation UI (`I`–`VIII`) and smooth navigation triggers
- `src/components/ScriptureDrawer.tsx`
  - slide-out scripture/theological study panel
- `src/utils/audioEngine.ts`
  - chapter switching, loudness balancing, master volume, visualizer data

---

## Security

Even for a frontend project, use these controls before production deployment.

### 1) Dependency hygiene

- Keep dependencies updated (`npm outdated`, `npm audit`).
- Pin and review any new package additions.
- Use trusted registries only.

### 2) External media safety

- Image/audio download scripts fetch third-party URLs from:
  - `scripts/asset-sources.json`
  - `scripts/audio-sources.json`
- Review/approve every URL before use.
- Prefer hosting approved assets in your own storage/CDN for production.

### 3) Content Security Policy (recommended)

Use a CSP to restrict script/style/media/image origins. Minimal baseline (adjust for your deployment):

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: blob:;
media-src 'self' data: blob:;
connect-src 'self';
```

### 4) Client-only constraints

- No backend secrets are required in current architecture.
- Do not embed API keys or private tokens in frontend code.

### 5) Browser/API permissions

- Audio playback depends on user interaction/autoplay policies.
- Gracefully handle blocked autoplay and muted states.

### 6) Legal/security review checklist

Before launch, verify:

- asset/audio redistribution rights
- attribution requirements
- privacy/cookie policy obligations (if analytics are added)
- third-party terms of service compliance

---

## Troubleshooting

### Build error: missing optional Rollup native package

If you see a message similar to:

`Cannot find module @rollup/rollup-<platform>`

try:

```bash
rm -rf node_modules package-lock.json
npm install
```

Then run:

```bash
npm run build
```

### `HTTP 429` during asset/audio download

- Re-run the script (built-in retry/backoff exists).
- Replace failing URLs in `scripts/*.json` with alternate sources.
- Reduce repeated rapid fetch attempts from same host.

### Nav/audio appears out of sync

- Ensure app is updated to latest local source.
- Hard refresh (`Ctrl+Shift+R`) after major UI/audio changes.
- Confirm chapter audio files use expected names (`Chapter1.mp3` ... `Chapter8.mp3`).

### Audio files are too large

- Run `npm run audio:optimize` to reduce size and trim long tracks.
- Use stronger compression if needed:

```bash
AUDIO_BITRATE_KBPS=80 AUDIO_MAX_SECONDS=90 npm run audio:optimize
```

---

## Deployment

Typical static deployment flow:

```bash
npm install
npm run build
npm run preview
```

Deploy the generated `dist/` directory to your static host (e.g., Netlify, Vercel static output, Cloudflare Pages, S3+CDN).

---

## Contributing

Suggested workflow:

1. Create a feature/fix branch.
2. Make focused changes.
3. Run type-check/build locally.
4. Open a PR with before/after notes and screenshots (for UI changes).

For larger content updates, include theological/source notes in your PR description for review traceability.

---

## License

This project is licensed under the **MIT License**.

See `LICENSE` for the full text.

