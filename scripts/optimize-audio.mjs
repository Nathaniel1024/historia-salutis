import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const audioDir = path.join(root, 'public', 'audio', 'new-audio');

const targetBitrateKbps = Number(process.env.AUDIO_BITRATE_KBPS || '96');
const maxSeconds = Number(process.env.AUDIO_MAX_SECONDS || '120');

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'ignore' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const hasFfmpeg = async () => {
  try {
    await run('ffmpeg', ['-version']);
    return true;
  } catch {
    return false;
  }
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const isMp3 = (file) => file.toLowerCase().endsWith('.mp3');

const optimizeFile = async (absolutePath) => {
  const before = await stat(absolutePath);
  const tempPath = `${absolutePath}.opt.tmp.mp3`;

  const ffmpegArgs = [
    '-y',
    '-i',
    absolutePath,
    '-map_metadata',
    '-1',
    '-vn',
    '-ac',
    '2',
    '-ar',
    '44100',
    '-b:a',
    `${targetBitrateKbps}k`,
    '-t',
    `${maxSeconds}`,
    tempPath
  ];

  await run('ffmpeg', ffmpegArgs);

  const after = await stat(tempPath);

  if (after.size >= before.size) {
    await unlink(tempPath);
    return {
      changed: false,
      before: before.size,
      after: before.size,
      note: 'kept original (optimized file was not smaller)'
    };
  }

  await rename(tempPath, absolutePath);

  return {
    changed: true,
    before: before.size,
    after: after.size,
    note: 'optimized'
  };
};

const main = async () => {
  const ffmpegReady = await hasFfmpeg();
  if (!ffmpegReady) {
    console.error('✗ ffmpeg is not installed or not in PATH. Install ffmpeg first.');
    process.exit(1);
  }

  const files = (await readdir(audioDir)).filter(isMp3).sort();

  if (!files.length) {
    console.log('No .mp3 files found in public/audio/new-audio.');
    return;
  }

  console.log(`Optimizing ${files.length} files in public/audio/new-audio`);
  console.log(`Settings: AUDIO_BITRATE_KBPS=${targetBitrateKbps}, AUDIO_MAX_SECONDS=${maxSeconds}\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const fullPath = path.join(audioDir, file);
    const result = await optimizeFile(fullPath);
    totalBefore += result.before;
    totalAfter += result.after;

    const delta = result.before - result.after;
    const percent = result.before > 0 ? ((delta / result.before) * 100).toFixed(1) : '0.0';

    console.log(
      `${result.changed ? '✓' : '•'} ${file} -> ${result.note} (${formatBytes(result.before)} → ${formatBytes(result.after)}, ${percent}% smaller)`
    );
  }

  const totalDelta = totalBefore - totalAfter;
  const totalPercent = totalBefore > 0 ? ((totalDelta / totalBefore) * 100).toFixed(1) : '0.0';

  console.log('\nSummary:');
  console.log(`Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (${totalPercent}% smaller)`);
};

main().catch((error) => {
  console.error(`\n✗ Audio optimization failed: ${error.message || String(error)}`);
  process.exit(1);
});
