import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

export const makeitcolorArticle = {
  title: 'MakeItColor: old photos and films, in colour and restored.',
  description: 'MakeItColor is a free Windows app that colours black-and-white photos and videos and restores them on your own PC: it fixes faded brightness and contrast, takes out blur, noise and JPEG damage, and can make small photos up to 4× larger. It runs on the NPU, the graphics card or the CPU.',
  path: '/blog/makeitcolor/',
  date: '2026-10-20',
  version: '1.0.0',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-20',
  tagline: 'Black-and-white photos and videos, in colour and restored. On your own PC.',
  repoUrl: 'https://github.com/MuhammadNoman76/make-it-color',
  releaseUrl: 'https://github.com/MuhammadNoman76/make-it-color/releases/tag/v1.0.0',
  checksumsUrl: 'https://github.com/MuhammadNoman76/make-it-color/releases/download/v1.0.0/SHA256SUMS.txt',
  qualityUrl: 'https://github.com/MuhammadNoman76/make-it-color/blob/main/docs/QUALITY.md',
  modelUrl: 'https://huggingface.co/muhammadnoman76/makeitcolor',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download MakeItColor for Windows — colour and restore black-and-white photos and videos',
  description: 'Download MakeItColor 1.0, free: it colours black-and-white photos and videos and restores them on your own PC, on the NPU, the graphics card or the CPU. For 64-bit Windows 10 (1903 or later) and Windows 11, x64 and ARM64.',
  path: '/makeitcolor/',
};

/** What the app needs: shown by the download picker on PCs it can't run on. */
export const requirement = '64-bit Windows 10 (version 1903 or later) or Windows 11, on an x64 or ARM64 PC';

/**
 * Installers published as assets of the v1.0.0 GitHub release of make-it-color (not files in the repository: the x64
 * installer is over GitHub's 100 MB limit for repository files), with SHA256SUMS.txt beside them.
 */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10 (1903 or later), Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. The colour model downloads on first use.',
    file: 'MakeItColor-Setup-1.0.0-x64.exe', bytes: 111640097, sha256: '3a0d2efe03bda5308c47eb61757eb25fbfef43eeb5b92ae20ced75de4992a58d',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops and other ARM PCs. Not yet tested on ARM hardware.',
    windows: 'Windows 10 (1903 or later), Windows 11', cpu: 'ARM64', runtime: 'Self-contained. The colour model downloads on first use.',
    file: 'MakeItColor-Setup-1.0.0-arm64.exe', bytes: 93063064, sha256: '4e50f36eea792a901de4cb372d9c4d76456f30c9337f5a67e8e0d82a3171247a',
  },
];

/** The feed MakeItColor checks for updates: public/updates/makeitcolor.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/makeitcolor.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/make-it-color/releases/download/v${makeitcolorArticle.version}/${edition.file}`;

/**
 * The models. The colour model downloads the first time it's needed (src/MakeItColor/Core/Ai/ModelStore.cs), each file
 * checked against its SHA-256; the enhancer ships with the app. Sizes in bytes.
 */
export const models = {
  colorFp16: { name: 'MakeItColor colour model, float16', use: 'NPU and graphics card', bytes: 456_392_880 },
  colorFp32: { name: 'MakeItColor colour model, float32', use: 'CPU', bytes: 912_062_353 },
  enhancer: { name: 'Real-ESRGAN compact general model', sizes: '2.4 MB and 4.9 MB' },
} as const;

/** What it opens. */
export const photoFormats = ['JPEG', 'PNG', 'TIFF', 'BMP', 'GIF', 'WebP', 'HEIC/HEIF', 'JPEG XR'] as const;
export const videoFormats = ['MP4', 'MOV', 'MKV', 'AVI', 'WMV', 'WebM', 'MPEG', 'M2TS/TS', 'FLV', '3GP', 'OGV', 'VOB', 'MXF'] as const;

/** The test laptop for every speed figure. */
export const testPc = 'Intel Core Ultra 5 135U with an Intel AI Boost NPU and Intel Graphics';

/** One 512 × 512 run of the colour model on the test laptop. */
export const colorSpeeds = [
  { chip: 'NPU', device: 'Intel AI Boost', path: 'OpenVINO, float16', time: '0.41–0.42 s' },
  { chip: 'GPU', device: 'Intel Graphics', path: 'OpenVINO, float16', time: '0.51–0.54 s' },
  { chip: 'GPU', device: 'Intel Graphics', path: 'DirectML, float16', time: '0.77 s' },
  { chip: 'CPU', device: 'Intel Core Ultra 5 135U', path: 'float32', time: '1.8–2.4 s' },
] as const;

/** One 256 × 256 tile of the enhancer on the test laptop. */
export const enhanceSpeeds = [
  { chip: 'GPU', device: 'Intel Graphics', time: '66–75 ms', note: '' },
  { chip: 'NPU', device: 'Intel AI Boost', time: '131 ms', note: 'while the NPU was also colouring' },
  { chip: 'CPU', device: 'Intel Core Ultra 5 135U', time: '1.0 s', note: '' },
] as const;

/** Whole jobs on the test laptop. */
export const jobs = {
  photo: { from: '1500 × 1000', to: '3000 × 2000', tiles: 35, gpu: 'about 3 s', cpu: 'about 50 s' },
  video: { size: '1280 × 720', fps: 25, full: 1.5, light: 2.2 },
  song: { length: '2:56', frames: '4,400', minutes: 59 },
  npuCompile: { color: 'about 4–5 minutes', enhancer: 'about 15 s' },
} as const;

/** Correctness checks (docs/QUALITY.md in the repository). */
export const checks = {
  /** The app's colour maths against the Python reference, per chip. */
  reference: [
    { chip: 'CPU', psnr: '88–100 dB', note: 'largest difference 1/255' },
    { chip: 'NPU', psnr: '51–57 dB', note: 'float16' },
    { chip: 'GPU', psnr: '54–58 dB', note: 'float16' },
  ],
  /** The 24 Kodak images, made gray, coloured and compared with their real colours: ModelScope's pipeline → MakeItColor's. */
  kodak: { images: 24, psnr: ['21.23', '21.92'], deltaE: ['18.71', '17.61'] },
  /** Colour flicker (mean |Δa| + |Δb| on unchanged pixels), 600-frame test clip: without → with Steady colours. */
  flicker: { frames: 600, without: '5.40', with: '2.76' },
  /** Frame-to-frame lightness change on static pixels, 100 frames of the film. */
  shimmer: { frames: 100, coloured: '0.70', fullUnsteady: '0.89', full: '0.81' },
  /** Enhancer tiles (256 × 256, 24 px overlap) against running the whole picture at once. */
  tiles: '87 dB',
} as const;

/** The launch video (no burned-in captions; English WebVTT track alongside). */
export const launchVideo = {
  src: '/media/makeitcolor-launch.mp4',
  captions: '/media/makeitcolor-launch.en.vtt',
  poster: '/media/makeitcolor-launch-poster.jpg',
  width: 1280,
  height: 720,
  duration: 'PT1M11S',
  uploadDate: '2026-10-20',
};

/** The footage in the pictures and the video. */
export const footage = {
  doraha: { title: 'Doraha', year: 1967, by: 'the song “Tumhain Kaisay Bata Dun”, sung by Ahmad Rushdi', use: 'short excerpts' },
  duck: { title: 'Duck and Cover', year: 1951, by: 'U.S. Federal Civil Defense Administration', url: 'https://archive.org/details/DuckandC1951', use: 'public domain' },
  kiss: { title: 'Kissing the War Goodbye', year: 1945, by: 'Victor Jorgensen, U.S. Navy', url: 'https://commons.wikimedia.org/wiki/File:Kissing_the_War_Goodbye.jpg', use: 'public domain' },
} as const;

/** The parts MakeItColor is built on, and their licences. */
export const credits = [
  ['Colour model', 'DDColor (ConvNeXt-L; Kang et al., ICCV 2023), Apache 2.0, converted to ONNX and published as the MakeItColor model on Hugging Face'],
  ['Enhancer', 'Real-ESRGAN compact general model (Xintao Wang et al.), BSD 3-Clause; its network definition from BasicSR, Apache 2.0'],
  ['Runtime', 'Windows ML and ONNX Runtime, MIT'],
  ['Video', 'FFmpeg, LGPL 2.1 (an unmodified BtbN build)'],
] as const;
