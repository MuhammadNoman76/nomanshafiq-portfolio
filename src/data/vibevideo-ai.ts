import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

export const vibevideoArticle = {
  title: 'VibeVideo AI: a media player that finds the scenes for you.',
  description: 'VibeVideo AI is VibePlayer with an AI scene filter that runs on your own PC. It looks through a video as you watch, marks scenes with nudity, sex or kissing in pink, and jumps over them. A free preview for Windows 10 and 11.',
  path: '/blog/vibevideo-ai/',
  date: '2026-10-18',
  version: '0.1.0',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-18',
  repoUrl: 'https://github.com/MuhammadNoman76/vibeplayer-ai',
  checksumsUrl: 'https://github.com/MuhammadNoman76/vibeplayer-ai/blob/main/release/VibeVideoAI-SHA256SUMS.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download VibeVideo AI for Windows — the media player that skips scenes for you',
  description: 'Download VibeVideo AI 0.1, a free preview of VibePlayer with an AI scene filter that runs on your PC. It finds scenes with nudity, sex or kissing and skips them. For 64-bit Windows 10 (1903 or later) and Windows 11, x64 and ARM64.',
  path: '/vibevideo-ai/',
};

/** What the app needs: shown by the download picker on PCs it can't run on. */
export const requirement = '64-bit Windows 10 (version 1903 or later) or Windows 11, on an x64 or ARM64 PC';

/** Installers published in the vibeplayer-ai repository (release/ on main), verified against the files on GitHub. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10 (1903 or later), Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. The AI models download on first use.',
    file: 'VibeVideoAI-Setup-0.1.0-x64.exe', bytes: 86821647, sha256: '51732bc6d96efc448c60c3bf63ce61de1c1b3918d828b86362e68ca217fb8c19',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops and other ARM PCs. Not yet tested on ARM hardware.',
    windows: 'Windows 10 (1903 or later), Windows 11', cpu: 'ARM64', runtime: 'Self-contained. The AI models download on first use.',
    file: 'VibeVideoAI-Setup-0.1.0-arm64.exe', bytes: 78144183, sha256: '2027fcfbedb68a398ba3e1b78ec0a0e4d6bbbb4e272c5d85ee34b3e0a5642197',
  },
];

/** The feed VibeVideo AI checks for updates: public/updates/vibevideo-ai.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/vibevideo-ai.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/vibeplayer-ai/raw/refs/heads/main/release/${edition.file}`;

/**
 * Model files the app downloads the first time it scans (src/VibePlayer/Core/Ai/Onnx/ModelStore.cs), each checked
 * against its size and SHA-256. Sizes in bytes.
 */
export const models = {
  clipFp16: { name: 'CLIP ViT-B/32 image encoder, 16-bit', use: 'NPU and graphics card', bytes: 176_080_659, license: 'MIT (OpenAI)' },
  clipFp32: { name: 'CLIP ViT-B/32 image encoder, 32-bit', use: 'CPU', bytes: 351_685_709, license: 'MIT (OpenAI)' },
  nudenet: { name: 'NudeNet 320n detector', use: 'optional, off by default', bytes: 10_595_223, license: 'AGPL-3.0' },
} as const;

/**
 * Scans of the 2:19 test reel with the installed 0.1.0 build on my laptop (Intel Core Ultra 5 135U, 16 GB),
 * extra nudity detector off. `x` = video seconds scanned per second; `ms` = time to score one picture.
 */
export const speeds = [
  { chip: 'NPU', device: 'Intel AI Boost', x: 36, ms: 13 },
  { chip: 'GPU', device: 'Intel Graphics (DirectML)', x: 21, ms: 23 },
  { chip: 'CPU', device: 'Intel Core Ultra 5 135U', x: 11, ms: 44 },
] as const;

/** A 2-minute 1080p clip on the NPU (16.8x to 18.6x in five runs): decoding the full-HD pictures, not the AI, sets the pace. */
export const fullHdSpeed = 17;

/** The launch video (no burned-in captions; English WebVTT track alongside). */
export const launchVideo = {
  src: '/media/vibevideo-ai-launch.mp4',
  captions: '/media/vibevideo-ai-launch.en.vtt',
  poster: '/media/vibevideo-ai-launch-poster.jpg',
  width: 1280,
  height: 720,
  duration: 'PT1M18S',
  uploadDate: '2026-10-18',
};

/** The public-domain test reel in the figures and the video, and the Big Buck Bunny shot in the video's opening. */
export const footage = [
  { title: 'Duck and Cover', year: 1951, by: 'U.S. Federal Civil Defense Administration', url: 'https://archive.org/details/DuckandC1951' },
  { title: 'The Kiss', year: 1896, by: 'Edison Manufacturing Company', url: 'https://archive.org/details/the-kiss-1896' },
  { title: 'Kissing the War Goodbye', year: 1945, by: 'Victor Jorgensen, U.S. Navy', url: 'https://commons.wikimedia.org/wiki/File:Kissing_the_War_Goodbye.jpg' },
] as const;
