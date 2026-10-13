import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

export const vibeplayerArticle = {
  title: "VibePlayer: skip the scenes you don't want to see.",
  description: 'I built VibePlayer, a free Windows media player with a YouTube-style interface on the VLC engine. Mark the parts of a video you would rather not see and it jumps over them every time, without editing the file. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/vibeplayer/',
  date: '2026-10-12',
  version: '1.0.2',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-13',
  repoUrl: 'https://github.com/MuhammadNoman76/VibePlayer',
  checksumsUrl: 'https://github.com/MuhammadNoman76/VibePlayer/blob/main/release/SHA256SUMS.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download VibePlayer for Windows — free media player that skips scenes',
  description: 'Download VibePlayer 1.0.2, a free media player for Windows built on the VLC engine. Mark the parts of a video you want to skip and it jumps over them every time. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit).',
  path: '/vibeplayer/',
};

/** Installers published in the VibePlayer repository (release/), verified against the files on GitHub. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'VibePlayer-Setup-1.0.2-x64.exe', bytes: 67086880, sha256: '5b11d72ea2957148c85a424f680ba6822da3fd2287512ce9a15b185532a5b1a4',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'VibePlayer-Setup-1.0.2-arm64.exe', bytes: 58238617, sha256: 'c28b2d8bc4846030a94470633041467df1a2207473a9970d6b1396829305d414',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'VibePlayer-Setup-1.0.2-x86.exe', bytes: 62186392, sha256: 'ad5963c240599f407c62a63cfb09a7bec35d1211b9552c611ca3326bffb2744a',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8 (setup tells you if it is missing). Installs the 32- or 64-bit VLC engine that matches Windows.',
    file: 'VibePlayer-Setup-1.0.2-win7-8.exe', bytes: 45430512, sha256: '9dbab58062fbb6f0a75670719696eb1c3f9c2b960a60c4b75df0b97efd73648a',
  },
];

/** The feed VibePlayer (1.0.2 and later) checks for updates: public/updates/vibeplayer.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/vibeplayer.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/VibePlayer/raw/refs/heads/main/release/${edition.file}`;

/** Media file types VibePlayer opens and registers for "Open with" (src/VibePlayer/Core/MediaFormats.cs). */
export const fileTypes = { video: 47, audio: 34, subtitles: 18 } as const;

/** The 74-second launch video (no burned-in captions; English WebVTT track alongside). */
export const launchVideo = {
  src: '/media/vibeplayer-launch.mp4',
  captions: '/media/vibeplayer-launch.en.vtt',
  poster: '/media/vibeplayer-launch-poster.jpg',
  width: 1280,
  height: 720,
  duration: 'PT1M14S',
  uploadDate: '2026-10-12',
};

/** A 20-second, silent clip of Big Buck Bunny (1:24–1:44 of the film) for the in-page skip demo. */
export const skipDemo = {
  src: '/media/vibeplayer-skip-demo.mp4',
  poster: '/media/vibeplayer-skip-demo-poster.jpg',
  length: 20,
  preset: { start: 8, end: 13 },
};

/** Big Buck Bunny footage appears in the figures, the demo and the launch video. */
export const footage = {
  title: 'Big Buck Bunny',
  holder: '© 2008 Blender Foundation',
  site: 'https://www.bigbuckbunny.org/',
  siteLabel: 'bigbuckbunny.org',
  license: 'CC BY 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
};
