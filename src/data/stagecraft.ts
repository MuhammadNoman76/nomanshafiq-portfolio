import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

/*
 * Everything that changes with a Stagecraft release lives in this file: the version and date, the installers,
 * the counts and feature lists the pages quote, and the test figures. Keep public/updates/stagecraft.json in step
 * (tests/stagecraft.test.mjs checks it) and docs/STAGECRAFT-CONTENT.md says where each claim comes from.
 */

export const stagecraftArticle = {
  title: 'Stagecraft: presentations that look designed, without the effort.',
  description: 'I built Stagecraft, a free presentation app for Windows with a Windows 11 look: 10 themes, 16 smart layouts, text that fits, smart guides, charts, icons, Morph transitions and a presenter view. It exports PDF, pictures and PowerPoint, and opens .pptx files. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/stagecraft/',
  date: '2026-10-14',
  version: '1.0.0',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-14',
  releasedLabel: '14 OCTOBER 2026',
  repoUrl: 'https://github.com/MuhammadNoman76/stagecraft',
  checksumsUrl: 'https://github.com/MuhammadNoman76/stagecraft/blob/main/release/SHA256SUMS.txt',
  noticesUrl: 'https://github.com/MuhammadNoman76/stagecraft/blob/main/THIRD-PARTY-NOTICES.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download Stagecraft for Windows — free presentation app',
  description: 'Download Stagecraft 1.0.0, a free presentation app for Windows with a Windows 11 look: 10 themes, 16 smart layouts, Morph transitions and a presenter view, with PDF, picture and PowerPoint export. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit).',
  path: '/stagecraft/',
};

/** Installers in the Stagecraft repository (release/), checked against release/SHA256SUMS.txt and the files' sizes. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.0.0-x64.exe', bytes: 48060306, sha256: '99463272d8f2203a804db59e142cb9d723c5217fd203ed2a971dfbb0c52b4533',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.0.0-arm64.exe', bytes: 42603902, sha256: '2dbd3bc688829895103047784f638647b98e0651efbea753acf7f96f44c5dce2',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.0.0-x86.exe', bytes: 44102700, sha256: '1f05bea27d28d2a1c7d281274a851d78542ce7cce163cb8340e129d0bf5f0e32',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8 (setup tells you if it is missing).',
    file: 'Stagecraft-Setup-1.0.0-win7-8.exe', bytes: 5921961, sha256: '671209ae3069761bd73d1379a3764cdca97eab8d11c24a9d005cd21093171607',
  },
];

/** The feed Stagecraft checks for updates (src/Stagecraft/Services/Updater.cs): public/updates/stagecraft.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/stagecraft.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/stagecraft/raw/refs/heads/main/release/${edition.file}`;

/** The ten themes in ThemeCatalog order, with the descriptions the app shows. Each has three colour variants. */
export const themes = [
  { id: 'aurora', name: 'Aurora', description: 'Modern and airy, with soft colour glows' },
  { id: 'editorial', name: 'Editorial', description: 'Elegant serif type on warm paper' },
  { id: 'midnight', name: 'Midnight', description: 'Bold and dark with a bright accent' },
  { id: 'pastel', name: 'Pastel', description: 'Soft colours and friendly rounded shapes' },
  { id: 'corporate', name: 'Corporate', description: 'Clean, structured and trustworthy' },
  { id: 'mono', name: 'Mono', description: 'Minimal black and white, one sharp accent' },
  { id: 'gradient', name: 'Gradient', description: 'Vivid colour gradients that pop' },
  { id: 'swiss', name: 'Swiss', description: 'Big type on a strict grid' },
  { id: 'botanical', name: 'Botanical', description: 'Calm, natural colours and organic shapes' },
  { id: 'slate', name: 'Slate', description: 'Dark, focused and professional' },
] as const;

/** Colour variants per theme (ThemeCatalog: three ThemeVariants each). */
export const variantsPerTheme = 3;

/** The smart layouts (LayoutEngine), in the order the panel shows them. */
export const layouts = ['Title', 'Section', 'Title + content', 'Two columns', 'Title only', 'Big number', 'Quote', 'Image left', 'Image right', 'Full-bleed image', 'Agenda', 'Timeline', 'Comparison', 'Team', 'Thank you', 'Blank'] as const;

/** The bundled font families (SIL Open Font License 1.1), loaded privately from the app folder (FontCatalog). */
export const fonts = ['Inter', 'Plus Jakarta Sans', 'DM Sans', 'Space Grotesk', 'Playfair Display', 'DM Serif Display', 'Source Serif 4', 'JetBrains Mono'] as const;

/** Slide icons: Fluent UI System Icons entries in Assets/IconCatalog.txt. */
export const iconCount = 1111;

/** Transitions and build effects, with the app's labels. */
export const transitions = ['Fade', 'Push', 'Slide over', 'Zoom', 'Morph'] as const;
export const buildEffects = ['Appear', 'Fade in', 'Rise', 'Scale up', 'Wipe'] as const;

/** What each export and the import give you, and their limits (README, checked against Export/ and Import/). */
export const fileFormats = [
  ['PDF', 'One page per slide at the slide’s size. Vector pages keep text, shapes and gradients sharp at any zoom, embed the pictures, and carry an invisible text layer so the words can be selected and searched. Or “Pictures”: each page is a high-resolution image.', 'Effects PDF can’t draw directly (soft glows, see-through and multi-colour gradients, see-through pictures) are embedded as high-resolution pictures inside the vector page. The text layer is approximate (see below).'],
  ['PNG / JPG', 'This slide, or every slide into a folder, at 1920, 2560 or 3840 pixels wide.', 'Hidden slides are left out unless you include them.'],
  ['PowerPoint export (.pptx)', 'Text boxes, shapes, lines, pictures and tables as native, editable PowerPoint objects, with the slide size, speaker notes, hidden slides (if you include them) and the Fade, Push, Slide over and Zoom transitions.', 'Charts, icons and the theme’s background artwork become pictures. Morph becomes a fade, and builds aren’t exported. Fonts aren’t embedded, so PowerPoint replaces any that aren’t installed on the other PC.'],
  ['PowerPoint import (.pptx)', 'Slide size, text with basic formatting, shapes, lines and connectors with arrowheads, pictures (with their cropping), groups, tables, bar, line, pie and doughnut charts from their saved data, backgrounds, speaker notes, hidden slides and transitions. Opening a .pptx imports a copy; the original isn’t changed.', 'SmartArt, other chart types, video and sound, ink, embedded objects and animations are left out. Stagecraft tells you what it left out, except animations. Master and layout inheritance is only followed for positions, text styles and backgrounds (plus the master’s own shapes and pictures), so some decks need touching up. EMF and WMF pictures aren’t shown.'],
] as const;

/** What was tested, and what wasn't (as reported by the author's build; see docs/STAGECRAFT-CONTENT.md). */
export const testing = {
  /** [Fact] tests in tests/Stagecraft.Tests, each run on net10.0-windows and net48. */
  engineTests: 60,
  /** Editor commands the hidden smoke run executes on a new deck before undoing and redoing them all. */
  smokeCommands: 83,
  smokeBuilds: '64-bit, 32-bit and Windows 7/8.1 (.NET Framework 4.8)',
  /** The engine's performance test (RenderTests.Performance_200Slides_LoadAndThumbnails) on the author's PC. */
  bigDeck: { slides: 200, loadMs: 73, thumbnailsMs: 452 },
  untested: [
    'a slide show in real full screen or on a real second display (both views were tested in the windowed test mode)',
    'dragging and typing with a real mouse and keyboard (the snapping maths and the commands are tested)',
    'the ARM64 edition on ARM64 hardware',
    'any build on real Windows 7 or 8.1 PCs, or on 32-bit Windows 10 (those editions ran on 64-bit Windows 11)',
    'screen readers',
  ],
} as const;

/** "What comes next" on the field note. */
export const nextUp = [
  'code-signing, so SmartScreen stays quiet',
  'a slide show on a real second display, tested end to end',
  'thumbnails of .stagecraft files in File Explorer',
  'charts that stay editable charts in PowerPoint',
  'video and audio on slides',
  'a spell checker',
  'a theme editor for your own colours and fonts',
  'a phone remote for the slide show',
] as const;

/** The version the screenshots show (they can lag behind `stagecraftArticle.version`). */
export const shotsVersion = '1.0.0';

/** The real screenshots (PrintWindow captures of Stagecraft 1.0.0 x64's own windows on Windows 11 at 150%, with the sample decks). */
export const screenshots = {
  editor: { src: '/art/stagecraft-editor.png', width: 1946, height: 1226 },
  editorDark: { src: '/art/stagecraft-editor-dark.png', width: 1946, height: 1226 },
  start: { src: '/art/stagecraft-start.png', width: 1946, height: 774 },
  selection: { src: '/art/stagecraft-selection.png', width: 1946, height: 1226 },
  design: { src: '/art/stagecraft-design.png', width: 1946, height: 1226 },
  palette: { src: '/art/stagecraft-palette.png', width: 1946, height: 1226 },
  chart: { src: '/art/stagecraft-chart.png', width: 1560, height: 960 },
  icons: { src: '/art/stagecraft-icons.png', width: 1140, height: 960 },
  outline: { src: '/art/stagecraft-outline.png', width: 1946, height: 1226 },
  sorter: { src: '/art/stagecraft-sorter.png', width: 1946, height: 1226 },
  presenter: { src: '/art/stagecraft-presenter.png', width: 1920, height: 1200 },
  export: { src: '/art/stagecraft-export.png', width: 1080, height: 641 },
  settings: { src: '/art/stagecraft-settings.png', width: 1080, height: 1170 },
} as const;
