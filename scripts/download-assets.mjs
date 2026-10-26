import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcesPath = path.join(root, 'scripts', 'asset-sources.json');
const outRoot = path.join(root, 'public', 'assets', 'chapters');
const hostLastRequest = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

const waitForHostWindow = async (url, minGapMs = 900) => {
  const host = new URL(url).host;
  const last = hostLastRequest.get(host) ?? 0;
  const elapsed = Date.now() - last;
  if (elapsed < minGapMs) {
    await sleep(minGapMs - elapsed);
  }
  hostLastRequest.set(host, Date.now());
};

const fetchWithTimeout = async (url, timeoutMs = 25000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await waitForHostWindow(url);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'HistoriaSalutisAssetFetcher/1.0'
      }
    });
    if (!response.ok) {
      const retryAfterHeader = response.headers.get('retry-after');
      const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      err.retryAfterMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : undefined;
      throw err;
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const bytes = new Uint8Array(await response.arrayBuffer());
    return { bytes, contentType };
  } finally {
    clearTimeout(timeout);
  }
};

const extFromContentType = (contentType) => {
  if (contentType.includes('image/jpeg')) return 'jpg';
  if (contentType.includes('image/png')) return 'png';
  if (contentType.includes('image/webp')) return 'webp';
  if (contentType.includes('image/svg+xml')) return 'svg';
  return 'jpg';
};

const fetchWithRetry = async (url, retries = 4) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchWithTimeout(url);
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const shouldRetry =
        attempt < retries &&
        (status === 429 || (typeof status === 'number' && status >= 500) || /EAI_AGAIN|aborted|timed out/i.test(String(error)));

      if (!shouldRetry) break;

      const serverDelay = error?.retryAfterMs;
      const backoff = Math.min(7000, 700 * 2 ** attempt + Math.round(Math.random() * 350));
      await sleep(serverDelay ?? backoff);
    }
  }

  throw lastError;
};

const summary = [];

for (const [chapterId, planes] of Object.entries(sources)) {
  const chapterDir = path.join(outRoot, chapterId);
  await mkdir(chapterDir, { recursive: true });

  for (const plane of ['background', 'midground', 'foreground']) {
    const urls = Array.isArray(planes[plane]) ? planes[plane] : [planes[plane]].filter(Boolean);
    if (!urls.length) continue;

    let downloaded = false;
    const errors = [];

    for (const url of urls) {
      try {
        const { bytes, contentType } = await fetchWithRetry(url);
        const ext = extFromContentType(contentType);
        const filename = `${plane}.${ext}`;
        const target = path.join(chapterDir, filename);
        await writeFile(target, bytes);
        summary.push({
          chapterId,
          plane,
          status: 'ok',
          file: `public/assets/chapters/${chapterId}/${filename}`,
          source: url
        });
        downloaded = true;
        break;
      } catch (error) {
        errors.push(`${url} -> ${String(error)}`);
      }
    }

    if (!downloaded) {
      summary.push({ chapterId, plane, status: 'failed', message: errors.join(' | ') });
    }

    await sleep(220);
  }
}

console.log('\nAsset download summary:\n');
for (const item of summary) {
  if (item.status === 'ok') {
    console.log(`✓ ${item.chapterId} ${item.plane} -> ${item.file} (${item.source})`);
  } else {
    console.log(`✗ ${item.chapterId} ${item.plane} -> ${item.message}`);
  }
}

console.log('\nDone. You can now run `npm run dev` and inspect scene layers.');
