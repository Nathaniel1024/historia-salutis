# Chapter Art Assets

This project supports real chapter image layers in `public/assets/chapters/<chapter-id>/`.

## Folder layout

Each chapter folder can contain any of:

- `background.jpg|jpeg|webp|png|svg`
- `midground.jpg|jpeg|webp|png|svg`
- `foreground.jpg|jpeg|webp|png|svg`

Example:

- `public/assets/chapters/chapter-i/background.jpg`
- `public/assets/chapters/chapter-i/midground.png`
- `public/assets/chapters/chapter-i/foreground.webp`

The renderer auto-detects the first available format and falls back to embedded painted SVG layers when no file exists.

## Download script

A starter source map is in `scripts/asset-sources.json`.
Each plane can be either a single URL string or an array of fallback URLs.

Run:

```bash
npm run assets:download
```

or:

```bash
./scripts/download-assets.sh
```

This fetches assets into `public/assets/chapters/...` using the URLs in the source map.
The downloader includes retry/backoff and per-host throttling to reduce `HTTP 429` failures.

## Notes

- Some URLs may fail or be rate-limited; update `scripts/asset-sources.json` as needed.
- Verify usage rights/licensing for any external assets before publishing.
