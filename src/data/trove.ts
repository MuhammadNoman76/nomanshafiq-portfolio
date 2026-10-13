import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

export const troveArticle = {
  title: 'Trove: open any archive, make zips in a click.',
  description: 'I built Trove, a free archive manager for Windows with a Windows 11 look, on the official 7-Zip engine. It opens ZIP, 7Z, RAR, TAR, ISO and many more, makes ZIP and 7Z archives with AES-256 passwords, and blocks files in an archive that try to escape the folder you extract to. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/trove/',
  date: '2026-10-13',
  version: '1.0.0',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-13',
  repoUrl: 'https://github.com/MuhammadNoman76/Trove',
  checksumsUrl: 'https://github.com/MuhammadNoman76/Trove/blob/main/release/SHA256SUMS.txt',
  noticesUrl: 'https://github.com/MuhammadNoman76/Trove/blob/main/THIRD-PARTY-NOTICES.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download Trove for Windows — free archive manager on the 7-Zip engine',
  description: 'Download Trove 1.0.0, a free archive manager for Windows with a Windows 11 look, built on the official 7-Zip engine. Opens ZIP, 7Z, RAR, TAR, ISO and more; makes ZIP and 7Z with AES-256 passwords. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit).',
  path: '/trove/',
};

/** Installers in the Trove repository (release/), checked against release/SHA256SUMS.txt and the files' sizes. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Trove-Setup-1.0.0-x64.exe', bytes: 45423304, sha256: 'd76bff1b3d29131cfce2b2586cc46ed8502c868fdd73cbfc55daf90577356482',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'Trove-Setup-1.0.0-arm64.exe', bytes: 39885122, sha256: 'e6b8cccd880aae217ed2581a79c67c19b002ef59c53a7af004b56787652ac84c',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Trove-Setup-1.0.0-x86.exe', bytes: 41383656, sha256: 'b2b7abae990cffb1e5508d5c94cd97354da2e05b999f11a6acf0dce68f9c8c3a',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8 (setup tells you if it is missing). Installs the 32- or 64-bit 7-Zip engine that matches Windows.',
    file: 'Trove-Setup-1.0.0-win7-8.exe', bytes: 3804080, sha256: 'd8e4126ae0fc46fa6c05b75e59b63333cbf36a19ab81ba6db7128c7cfac03ea0',
  },
];

/** The feed Trove checks for updates (src/Trove/Services/Updater.cs): public/updates/trove.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/trove.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/Trove/raw/refs/heads/main/release/${edition.file}`;

/** The 7-Zip release whose unmodified 7z.dll Trove ships (vendor/7-Zip/SOURCE.txt). */
export const engine = { name: '7-Zip', version: '26.04' } as const;

/** Engine test cases (36 facts + 49 theory cases in tests/Trove.Tests), run on .NET 10 and on .NET Framework 4.8. */
export const engineTests = 85;

/** What Trove makes (ArchiveKind in Trove.Core) and how many file types setup offers it for in "Open with" (KnownExtensions.Associated). */
export const formats = {
  creates: ['ZIP', '7Z', 'TAR', 'TAR.GZ', 'TAR.XZ'],
  openWith: 30,
} as const;

/** The create dialog's compression levels and the 7-Zip level each one uses (CreateArchiveDialog.xaml). */
export const levels = [
  ['Store (no compression)', 0],
  ['Fastest', 1],
  ['Balanced', 5],
  ['Smallest', 9],
] as const;

/** The real screenshots (PrintWindow captures of Trove 1.0.0 x64 on Windows 11, with demo files). */
export const screenshots = {
  home: { src: '/art/trove-home.png', width: 1632, height: 1116 },
  archive: { src: '/art/trove-archive.png', width: 1632, height: 1116 },
  archiveDark: { src: '/art/trove-archive-dark.png', width: 1632, height: 1116 },
  create: { src: '/art/trove-create.png', width: 1122, height: 1011 },
  password: { src: '/art/trove-password.png', width: 642, height: 474 },
  progress: { src: '/art/trove-progress.png', width: 792, height: 394 },
  blocked: { src: '/art/trove-blocked.png', width: 792, height: 377 },
  blockedDetails: { src: '/art/trove-blocked-details.png', width: 672, height: 603 },
  settings: { src: '/art/trove-settings.png', width: 1032, height: 1131 },
} as const;
