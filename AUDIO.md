# Ambient Audio Assets

The app now supports real ambient audio files per chapter.

## File naming

Primary chapter tracks are loaded from:

- `public/audio/new-audio/Chapter1.mp3`
- `public/audio/new-audio/Chapter2.mp3`
- ...
- `public/audio/new-audio/Chapter8.mp3`

Supported runtime extensions are `.mp3`, `.ogg`, `.wav`.

## Download helper

Use:

```bash
npm run audio:download
```

This reads URLs from `scripts/audio-sources.json` and saves each chapter track as `.mp3`.

## Optimization helper (recommended)

To reduce page weight and speed up loading, run:

```bash
npm run audio:optimize
```

Default optimization settings:

- bitrate: `96 kbps`
- max length: `120s` (trims longer files)

You can override these:

```bash
AUDIO_BITRATE_KBPS=80 AUDIO_MAX_SECONDS=90 npm run audio:optimize
```

Note: this script requires `ffmpeg` installed and available in `PATH`.

## Behavior

- If chapter audio files exist in `public/audio/new-audio`, they are looped and crossfaded by chapter.
- If files are missing, playback for that chapter is skipped.
