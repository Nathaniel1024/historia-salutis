import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcesPath = path.join(root, 'scripts', 'audio-sources.json');
const outRoot = path.join(root, 'public', 'audio', 'new-audio');
const chapterTrackFilenames = {
  'chapter-i': 'Chapter1',
  'chapter-ii': 'Chapter2',
  'chapter-iii': 'Chapter3',
  'chapter-iv': 'Chapter4',
  'chapter-v': 'Chapter5',
  'chapter-vi': 'Chapter6',
  'chapter-vii': 'Chapter7',
  'chapter-viii': 'Chapter8'
};

const hostLastRequest = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForHostWindow = async (url, minGapMs = 900) => {
  const host = new URL(url).host;
  const last = hostLastRequest.get(host) ?? 0;
  const elapsed = Date.now() - last;
  if (elapsed < minGapMs) {
    await sleep(minGapMs - elapsed);
  }
  hostLastRequest.set(host, Date.now());
};

const fetchWithRetry = async (url, retries = 4) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28000);

    try {
      await waitForHostWindow(url);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'HistoriaSalutisAudioFetcher/1.0' }
      });

      if (!response.ok) {
        const retryAfter = Number(response.headers.get('retry-after') || '0');
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        err.retryAfterMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 0;
        throw err;
      }

      const bytes = new Uint8Array(await response.arrayBuffer());
      return bytes;
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const shouldRetry =
        attempt < retries &&
        (status === 429 || (typeof status === 'number' && status >= 500) || /EAI_AGAIN|aborted|timed out/i.test(String(error)));

      if (!shouldRetry) break;

      const backoff = Math.min(8000, 700 * 2 ** attempt + Math.round(Math.random() * 450));
      await sleep(error?.retryAfterMs || backoff);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
};

const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));
await mkdir(outRoot, { recursive: true });

const summary = [];

for (const chapterId of Object.keys(sources)) {
  const candidates = Array.isArray(sources[chapterId]) ? sources[chapterId] : [sources[chapterId]].filter(Boolean);

  let downloaded = false;
  const errors = [];

  for (const url of candidates) {
    try {
      const bytes = await fetchWithRetry(url);
      const trackName = chapterTrackFilenames[chapterId] ?? chapterId;
      const target = path.join(outRoot, `${trackName}.mp3`);
      await writeFile(target, bytes);
      summary.push({ chapterId, status: 'ok', file: `public/audio/new-audio/${trackName}.mp3`, source: url });
      downloaded = true;
      break;
    } catch (error) {
      errors.push(`${url} -> ${String(error)}`);
    }
  }

  if (!downloaded) {
    summary.push({ chapterId, status: 'failed', message: errors.join(' | ') });
  }

  await sleep(220);
}

console.log('\nAudio download summary:\n');
for (const item of summary) {
  if (item.status === 'ok') {
    console.log(`✓ ${item.chapterId} -> ${item.file} (${item.source})`);
  } else {
    console.log(`✗ ${item.chapterId} -> ${item.message}`);
  }
}

console.log('\nDone. The app automatically uses /public/audio/new-audio/Chapter<1-8>.mp3 when present.');
