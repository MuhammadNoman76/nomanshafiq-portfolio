import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

export const pawsipArticle = {
  title: 'PawSip: a desktop cat that keeps you hydrated.',
  description: 'I built PawSip, a free Windows water reminder with an animated cat companion. It follows your activity, waits during fullscreen work, and keeps asking until you drink. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/pawsip/',
  date: '2026-10-12',
  version: '1.0.2',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-13',
  repoUrl: 'https://github.com/MuhammadNoman76/PawSip',
  checksumsUrl: 'https://github.com/MuhammadNoman76/PawSip/blob/main/release/SHA256SUMS.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download PawSip for Windows — free desktop cat water reminder',
  description: 'Download PawSip 1.0.2, a free water reminder for Windows with an animated desktop cat. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit). No account; your data stays on your PC.',
  path: '/pawsip/',
};

/** Installers published in the PawSip repository (release/), verified against the files on GitHub. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.2-x64.exe', bytes: 50865639, sha256: 'e1c19dbc46b2d7d1daf834ef02809fddba9db734765c8734e881a6045bf2a7ab',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.2-arm64.exe', bytes: 44706867, sha256: 'be9f71f81089f409730cc2181a777b4992fa3704bb6c1b7acd6d7d60c597a09f',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.2-x86.exe', bytes: 46277685, sha256: 'cad7716239c96e3c2216a6f80aab747d360a48bca17d15fdddc7f3188e9e397c',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit. A small 2.6 MB download.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8. Setup tells you if it is missing.',
    file: 'PawSip-Setup-1.0.2-win7-8.exe', bytes: 2605368, sha256: '46b406b2142442ba47a0c247b401a720d1870b14c97800b86fc0dd3f56212c52',
  },
];

/** The feed PawSip (1.0.2 and later) checks for updates: public/updates/pawsip.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/pawsip.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/PawSip/raw/refs/heads/main/release/${edition.file}`;

