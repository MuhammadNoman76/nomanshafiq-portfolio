export const pawsipArticle = {
  title: 'PawSip: a desktop cat that keeps you hydrated.',
  description: 'I built PawSip, a free Windows water reminder with an animated cat companion. It follows your activity, waits during fullscreen work, and keeps asking until you drink. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/pawsip/',
  date: '2026-10-12',
  version: '1.0.1',
  repoUrl: 'https://github.com/MuhammadNoman76/PawSip',
  checksumsUrl: 'https://github.com/MuhammadNoman76/PawSip/blob/main/release/SHA256SUMS.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download PawSip for Windows — free desktop cat water reminder',
  description: 'Download PawSip 1.0.1, a free water reminder for Windows with an animated desktop cat. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit). No account; your data stays on your PC.',
  path: '/pawsip/',
};

export type EditionId = 'x64' | 'arm64' | 'x86' | 'win7-8';

export interface Edition {
  id: EditionId;
  name: string;
  forWho: string;
  windows: string;
  cpu: string;
  runtime: string;
  file: string;
  bytes: number;
  sha256: string;
}

/** Installers published in the PawSip repository (release/), verified against the files on GitHub. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.1-x64.exe', bytes: 50848601, sha256: '266c3d69deb5ebd53e47105585e4b20be3280061b66e608ff79a7d9a7e24a1cf',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.1-arm64.exe', bytes: 44687086, sha256: 'e1b73e95c7625df8c5c276f8d3c04b56e36500b7fe0f51499d25f2554a514551',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'PawSip-Setup-1.0.1-x86.exe', bytes: 46259558, sha256: '1b2c59697232d9a4f972314b021a43115b1e8d8d58923091113c301b70718896',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit. A small 2.6 MB download.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8. Setup tells you if it is missing.',
    file: 'PawSip-Setup-1.0.1-win7-8.exe', bytes: 2592021, sha256: '52d8c0345a13cc806e58829c8dcdcabe1cde9565ff9dc851108179186e5a55f6',
  },
];

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/PawSip/raw/refs/heads/main/release/${edition.file}`;

/** Decimal megabytes, like the rest of the site. */
export const formatSize = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;
