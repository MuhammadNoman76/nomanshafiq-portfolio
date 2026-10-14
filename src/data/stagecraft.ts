import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

/*
 * Everything that changes with a Stagecraft release lives in this file: the version and date, the installers,
 * the counts and feature lists the pages quote, and the test figures. Keep public/updates/stagecraft.json in step
 * (tests/stagecraft.test.mjs checks it) and docs/STAGECRAFT-CONTENT.md says where each claim comes from.
 */

export const stagecraftArticle = {
  title: 'Stagecraft: presentations that look designed, without the effort.',
  description: 'I built Stagecraft, a free presentation app for Windows with a Windows 11 look: 10 themes, 16 smart layouts, text that fits, Morph transitions, animations, links, video and sound, and a presenter view. It exports PDF, pictures and PowerPoint, and opens .pptx files. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/stagecraft/',
  date: '2026-10-14',
  version: '1.1.0',
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
  description: 'Download Stagecraft 1.1.0, a free presentation app for Windows with a Windows 11 look: 10 themes, 16 smart layouts, Morph transitions, animations, links, video and sound, and a presenter view, with PDF, picture and PowerPoint export. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit).',
  path: '/stagecraft/',
};

/** Installers in the Stagecraft repository (release/), checked against release/SHA256SUMS.txt and the files' sizes. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.1.0-x64.exe', bytes: 48593808, sha256: 'd2de9ca98c92bb56574c990d06d19eea25e47dbaba57c2b06db39ca2f6840f68',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.1.0-arm64.exe', bytes: 43134464, sha256: '4031591a4543569c94b1f1ca4bfc8f6b76f3de0a6c43b6483d820782470a66d7',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Stagecraft-Setup-1.1.0-x86.exe', bytes: 44630557, sha256: '96dbe45e4da0fd153b439e27d097bb924e43cf4d068c5148f0d11a4707f9d986',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8 (setup tells you if it is missing).',
    file: 'Stagecraft-Setup-1.1.0-win7-8.exe', bytes: 6563166, sha256: '340d65a3f8a0af6d20ff90503648ab4168c65cc9974c42ef9d7e040f8805aff3',
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

/** Slide icons: Fluent UI System Icons entries in Assets/IconCatalog.txt (1.0 had 1,111; 1.1 added a speaker). */
export const iconCount = 1112;

/** Transitions, with the app's labels. */
export const transitions = ['Fade', 'Push', 'Slide over', 'Zoom', 'Morph'] as const;

/** The animation effects and options (Model/Animation.cs and PropertiesPanel.Animations.cs), with the names the app shows. */
export const animations = {
  entrance: ['Appear', 'Fade', 'Fly in', 'Float in', 'Wipe', 'Split', 'Zoom', 'Grow & turn', 'Bounce', 'Wheel', 'Swivel', 'Rise up'],
  emphasis: ['Pulse', 'Spin', 'Grow / shrink', 'Teeter', 'Colour pulse', 'Transparency', 'Bold flash', 'Wave'],
  exit: ['Disappear', 'Fade out', 'Fly out', 'Float out', 'Wipe', 'Split', 'Zoom', 'Shrink & turn', 'Bounce', 'Wheel', 'Swivel', 'Sink down'],
  motionPaths: ['Line', 'Arc', 'Circle', 'Custom path'],
  starts: ['On click', 'With previous', 'After previous'],
  easings: ['Automatic', 'Steady', 'Speed up', 'Slow down', 'Smooth start and end', 'Overshoot'],
  text: ['All at once', 'By paragraph', 'By word', 'By letter'],
} as const;

/** How animations travel to and from PowerPoint (PptxTimingWriter.Mapping and PptxImporter.Animations): [Stagecraft, exported as, imported from PowerPoint]. */
export const pptxAnimations = [
  ['Appear, Fade, Fly in and out (8 directions), Wipe, Split, Wheel, Zoom', 'the same effect', 'the same effect'],
  ['Float in, Rise up, Swivel', 'Fade', 'Float in, Rise up, Swivel'],
  ['Bounce', 'Fly in from the top', 'Bounce'],
  ['Grow & turn', 'Zoom', 'Grow & turn'],
  ['Pulse, Spin, Grow / shrink, Transparency', 'the same effect', 'the same effect'],
  ['Teeter, Wave, Colour pulse, Bold flash', 'Pulse', 'Teeter, Wave and Bold flash; Colour pulse arrives as Pulse'],
  ['Motion paths (line, arc, circle, drawn)', 'a custom path of the same shape', 'a line or a custom path'],
  ['Play, pause and stop of a video or sound', 'the same media action', 'the same media action'],
  ['Other PowerPoint effects', '', 'the closest one (Fade or Pulse), counted in the summary after importing'],
] as const;

/** What a link can go to (Model/Links.cs, LinkDialog.cs, LinkSafety). */
export const linkTargets = ['a web page (http and https only)', 'an e-mail address, with a subject', 'a slide: the next, previous, first, last or last viewed one, or a particular slide', 'a file, which opens in its app after you confirm (programs and scripts never open from a link)'] as const;

/** Video and sound (Model/Media.cs, EditorView.Media.cs). */
export const media = {
  /** MediaLimits.EmbedWarningBytes: above this, inserting offers to link to the file instead of embedding it. */
  linkOfferMB: 200,
  /** The formats the author checked on Windows 11 (README); others play when Windows can play them. */
  checked: ['MP4 (H.264 / AAC)', 'MP3', 'M4A', 'WAV'],
} as const;

/** What's new in 1.1, as the download page lists it (each item checked against the 1.1 source; see docs/STAGECRAFT-CONTENT.md). */
export const whatsNew = [
  ['Animations', `${animations.entrance.length} entrance, ${animations.emphasis.length} emphasis and ${animations.exit.length} exit effects, plus motion paths you can draw and reshape on the slide. On click, With previous or After previous, with duration, delay, repeat, rewind and easing; text all at once or by paragraph, word or letter; triggers. An animation pane with click groups, a timeline, drag-to-reorder and Play from here, a gallery that previews each effect on the slide, and the animation painter (Alt+Shift+C).`],
  ['Links', 'On text, shapes, pictures, icons and action buttons, to web pages, e-mail, slides or files (a file opens only after you confirm; programs and scripts never do). Ctrl+Shift+K adds one, Ctrl+click follows it in the editor, and the show gives a hand pointer and a ScreenTip. Links stay clickable in PDF exports.'],
  ['Video and sound', `Insert or drop video and sound, played by Windows’ own media support. Stored in the presentation, or linked for files over ${media.linkOfferMB} MB. Poster frame, trim, start options, full screen, loop, volume, fades, hide when not playing, sound across slides, and play, pause and stop in the animation order. Online videos become cards that open in the browser.`],
  ['More editing', 'Header and footer, find and replace (Ctrl+F, Ctrl+H, speaker notes included), spell check as you type, crop with handles or to a circle or rounded rectangle, opacity, borders and shadow presets, Replace picture, your own gradients, text shadows, rulers, gridlines, guides and snap to grid.'],
  ['Save automatically', 'A presentation that already has a file is saved a few seconds after you stop editing (on by default; Settings can switch it off). Recovery copies of unsaved work are still kept separately.'],
  ['PowerPoint, both ways', 'Export writes animations, links and slide jumps, video and sound with their trim and fades, and the footer; import reads them back, and a summary lists anything left out or approximated. Presentations from Stagecraft 1.0 open with their builds turned into the same animations.'],
  ['Fixed', 'At high display scaling, the window no longer opens taller than the screen the first time Stagecraft starts.'],
] as const;

/** What each export and the import give you, and their limits (README, checked against Export/ and Import/). */
export const fileFormats = [
  ['PDF', 'One page per slide at the slide’s size. Vector pages keep text, shapes and gradients sharp at any zoom, embed the pictures, and carry an invisible text layer so the words can be selected and searched. Links stay clickable: web pages and e-mail, slides (they go to that page), files, and the file of a linked video or sound. The header and footer are on the pages. Or “Pictures”: each page is a high-resolution image.', 'Effects PDF can’t draw directly (soft glows, see-through and multi-colour gradients, see-through pictures) are embedded as high-resolution pictures inside the vector page. Videos show their poster frame, or a video card. “Last slide viewed” links have no PDF equivalent. The text layer is approximate (see below).'],
  ['PNG / JPG', 'This slide, or every slide into a folder, at 1920, 2560 or 3840 pixels wide.', 'Hidden slides are left out unless you include them. Videos show their poster frame, or a video card.'],
  ['PowerPoint export (.pptx)', 'Text boxes, shapes, lines, pictures and tables as native, editable PowerPoint objects, with the slide size, speaker notes, hidden slides (if you include them), the Fade, Push, Slide over and Zoom transitions, animations as PowerPoint animation timing, links and slide jumps, videos and sounds with their trim and fades, and the header and footer (the slide number and an automatic date as PowerPoint fields).', 'Charts, icons, action buttons, online video cards and the theme’s background artwork become pictures; buttons and video cards keep their links. Morph becomes a fade, and effects PowerPoint has no match for become the closest one (see the table below). Fonts aren’t embedded, so PowerPoint replaces any that aren’t installed on the other PC.'],
  ['PowerPoint import (.pptx)', 'Slide size, text with basic formatting, shapes (action buttons included), lines and connectors with arrowheads, pictures (with their cropping), groups, tables, bar, line, pie and doughnut charts from their saved data, backgrounds, speaker notes, hidden slides, transitions, hyperlinks (web, e-mail, slides and files), embedded and linked videos and sounds with their trim, fades, volume and looping, and animations. Opening a .pptx imports a copy; the original isn’t changed.', 'SmartArt, other chart types, ink and embedded objects are left out, and effects Stagecraft doesn’t have become the closest one; a summary after importing lists what was left out or changed. Master and layout inheritance is only followed for positions, text styles and backgrounds (plus the master’s own shapes and pictures), so some decks need touching up. EMF and WMF pictures aren’t shown.'],
] as const;

/** What was tested, and what wasn't (as reported by the author's build; see docs/STAGECRAFT-CONTENT.md). */
export const testing = {
  /** Test cases in tests/Stagecraft.Tests (121 [Fact] tests and the 14 cases of one [Theory]), each run on net10.0-windows and net48. */
  engineTests: 135,
  /** Editor commands the hidden smoke run executes on a new deck, and the undo steps it then undoes and redoes (smoke.txt). */
  smokeCommands: 133,
  smokeUndoSteps: 110,
  smokeBuilds: '64-bit, 32-bit and Windows 7/8.1 (.NET Framework 4.8)',
  /** The engine's performance test (RenderTests.Performance_200Slides_LoadAndThumbnails), as measured on the author's PC with 1.0. It still passes in 1.1. */
  bigDeck: { slides: 200, loadMs: 73, thumbnailsMs: 452, version: '1.0.0' },
  /** Animation effects PowerPoint itself read back from a Stagecraft export (opened in PowerPoint; as reported by the author). */
  powerPointEffects: 37,
  untested: [
    'a slide show in real full screen or on a real second display (both views were tested in the windowed test mode)',
    'dragging and typing with a real mouse and keyboard (the snapping maths and the commands are tested)',
    'the ARM64 edition on ARM64 hardware',
    'any build on real Windows 7 or 8.1 PCs, or on 32-bit Windows 10 (those editions ran on 64-bit Windows 11)',
    'MOV, WMV and WMA files, and video and sound on Windows N editions',
    'the 1.1 installers themselves (the 1.0 installers installed and uninstalled cleanly for one user, and the 1.1 setup script differs only in its version number)',
    'screen readers',
  ],
} as const;

/** "What comes next" on the field note. */
export const nextUp = [
  'exporting a presentation as a video (MP4)',
  'a slide show on a real second display, tested end to end',
  'code-signing, so SmartScreen stays quiet',
  'thumbnails of .stagecraft files in File Explorer',
  'charts that stay editable charts in PowerPoint',
  'a theme editor for your own colours and fonts',
  'a phone remote for the slide show',
] as const;

/**
 * The real screenshots: PrintWindow captures of Stagecraft's own windows (x64, Windows 11 at 150%, with the sample decks).
 * `version` is the release each one shows; 1.1 captures replace the 1.0 ones where the same view was captured again.
 */
export const screenshots = {
  editor: { src: '/art/stagecraft-editor.png', width: 1946, height: 1226, version: '1.1.0' },
  editorDark: { src: '/art/stagecraft-editor-dark.png', width: 1946, height: 1226, version: '1.1.0' },
  start: { src: '/art/stagecraft-start.png', width: 1946, height: 955, version: '1.1.0' },
  selection: { src: '/art/stagecraft-selection.png', width: 1946, height: 1226, version: '1.0.0' },
  design: { src: '/art/stagecraft-design.png', width: 1946, height: 1226, version: '1.0.0' },
  palette: { src: '/art/stagecraft-palette.png', width: 1946, height: 1226, version: '1.0.0' },
  chart: { src: '/art/stagecraft-chart.png', width: 1560, height: 960, version: '1.0.0' },
  icons: { src: '/art/stagecraft-icons.png', width: 1140, height: 960, version: '1.0.0' },
  outline: { src: '/art/stagecraft-outline.png', width: 1946, height: 1226, version: '1.0.0' },
  sorter: { src: '/art/stagecraft-sorter.png', width: 1946, height: 1226, version: '1.0.0' },
  presenter: { src: '/art/stagecraft-presenter.png', width: 1920, height: 1200, version: '1.0.0' },
  export: { src: '/art/stagecraft-export.png', width: 1080, height: 641, version: '1.0.0' },
  settings: { src: '/art/stagecraft-settings.png', width: 1080, height: 1170, version: '1.0.0' },
  animationGallery: { src: '/art/stagecraft-animation-gallery.png', width: 1946, height: 1226, version: '1.1.0' },
  animationPane: { src: '/art/stagecraft-animation-pane.png', width: 1946, height: 1226, version: '1.1.0' },
  motionPath: { src: '/art/stagecraft-motion-path.png', width: 1946, height: 1226, version: '1.1.0' },
  linkDialog: { src: '/art/stagecraft-link-dialog.png', width: 1020, height: 760, version: '1.1.0' },
  showLink: { src: '/art/stagecraft-show-link.png', width: 1440, height: 868, version: '1.1.0' },
  video: { src: '/art/stagecraft-video.png', width: 1946, height: 1226, version: '1.1.0' },
  trim: { src: '/art/stagecraft-trim.png', width: 1140, height: 960, version: '1.1.0' },
  headerFooter: { src: '/art/stagecraft-header-footer.png', width: 1140, height: 922, version: '1.1.0' },
  find: { src: '/art/stagecraft-find.png', width: 1946, height: 1226, version: '1.1.0' },
  crop: { src: '/art/stagecraft-crop.png', width: 1946, height: 1226, version: '1.1.0' },
  viewAids: { src: '/art/stagecraft-view-aids.png', width: 1946, height: 1226, version: '1.1.0' },
} as const;

/** The theme tiles (stagecraft-theme-<id>.jpg) are crops of 1.0.0 captures; ThemeCatalog is unchanged in 1.1. */
export const themeTilesVersion = '1.0.0';
