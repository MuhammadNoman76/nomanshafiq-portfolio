import type { Edition } from './windows';

export { formatSize, type Edition, type EditionId } from './windows';

/*
 * Everything that changes with an Inkwell release lives in this file: the version and date, the installers,
 * the counts and feature lists the pages quote, and the test figures. Keep public/updates/inkwell.json in step
 * (tests/inkwell.test.mjs checks it) and docs/INKWELL-CONTENT.md says where each claim comes from.
 */

export const inkwellArticle = {
  title: 'Inkwell: write beautifully, without fighting your document.',
  description: 'I built Inkwell, a free word processor for Windows with a Windows 11 look and no ribbon. It opens and saves Word documents (.docx) and keeps what it doesn’t edit, fixes the things that make word processors frustrating, writes Urdu and Arabic right to left, and exports PDF. Downloads for Windows 7, 8.1, 10 and 11.',
  path: '/blog/inkwell/',
  date: '2026-10-15',
  version: '1.0.0',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-15',
  releasedLabel: '15 OCTOBER 2026',
  repoUrl: 'https://github.com/MuhammadNoman76/Inkwell',
  checksumsUrl: 'https://github.com/MuhammadNoman76/Inkwell/blob/main/release/SHA256SUMS.txt',
  noticesUrl: 'https://github.com/MuhammadNoman76/Inkwell/blob/main/THIRD-PARTY-NOTICES.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download Inkwell for Windows — free word processor for .docx',
  description: 'Download Inkwell 1.0.0, a free word processor for Windows with a Windows 11 look and no ribbon. It opens and saves Word documents (.docx), keeps what it doesn’t edit, writes Urdu and Arabic right to left, and exports PDF. Installers for Windows 7 SP1, 8.1, 10 and 11 (x64, ARM64 and 32-bit).',
  path: '/inkwell/',
};

/** Installers in the Inkwell repository (release/), checked against release/SHA256SUMS.txt and the files' sizes. */
export const editions: Edition[] = [
  {
    id: 'x64', name: 'Windows 10 & 11 · 64-bit', forWho: 'Intel or AMD processor. Most PCs.',
    windows: 'Windows 10, Windows 11', cpu: '64-bit (x64)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Inkwell-Setup-1.0.0-x64.exe', bytes: 49025506, sha256: 'fdb6930b94206e7c24d7755d7c872c4858a6b7ae0cd2d6e242a3427567b00c88',
  },
  {
    id: 'arm64', name: 'Windows 11 & 10 on ARM', forWho: 'Snapdragon laptops, Surface Pro X and other ARM PCs.',
    windows: 'Windows 10, Windows 11', cpu: 'ARM64', runtime: 'Self-contained. Nothing else to install.',
    file: 'Inkwell-Setup-1.0.0-arm64.exe', bytes: 43569277, sha256: 'e0cb318b7c1d14fee5a4742706f2e8a296aa5e9722a6081f06fe737ed28bd74b',
  },
  {
    id: 'x86', name: 'Windows 10 · 32-bit', forWho: 'Older PCs running a 32-bit installation of Windows 10.',
    windows: 'Windows 10', cpu: '32-bit (x86)', runtime: 'Self-contained. Nothing else to install.',
    file: 'Inkwell-Setup-1.0.0-x86.exe', bytes: 45073988, sha256: '77ef488ea90313b48ae462f3872d7c9c75e490abc981ea4b91ee2cc5e6699d97',
  },
  {
    id: 'win7-8', name: 'Windows 7 SP1 & 8.1', forWho: 'Older PCs, 32- or 64-bit.',
    windows: 'Windows 7 SP1, Windows 8.1', cpu: '32- or 64-bit', runtime: 'Uses Microsoft .NET Framework 4.8 (setup tells you if it is missing).',
    file: 'Inkwell-Setup-1.0.0-win7-8.exe', bytes: 7014508, sha256: '9f46c0c3c54dab81f1223c1eda11ca461c889b141f70fc6aa269dea4c8448d4b',
  },
];

/** The feed Inkwell checks for updates (src/Inkwell/Services/Updater.cs): public/updates/inkwell.json, kept in step with `editions`. */
export const updateFeed = 'https://www.nomanshafiq.com/updates/inkwell.json';

export const downloadUrl = (edition: Edition) =>
  `https://github.com/MuhammadNoman76/Inkwell/raw/refs/heads/main/release/${edition.file}`;

/** The start screen's templates (Templates/TemplateCatalog.cs), with the descriptions the app shows. */
export const templates = [
  ['Blank document', 'A clean page in your default design'],
  ['Report', 'Title page feel, headings, a table and notes'],
  ['Letter', 'A formal letter with your details'],
  ['Résumé', 'A crisp one-page CV'],
  ['Essay', 'Academic essay with citations and references'],
  ['Proposal', 'Problem, approach, timeline and budget'],
  ['Meeting notes', 'Agenda, decisions and action items'],
  ['Newsletter', 'Two columns of stories'],
] as const;

/** The designs (Templates/DocumentDesigns.cs): fonts, colours and heading styles at once, with the app's descriptions. */
export const designs = [
  ['Inkwell', 'Literata for reading, Inter for headings'],
  ['Modern', 'Clean sans-serif throughout'],
  ['Classic', 'Source Serif with Playfair Display headings'],
  ['Editorial', 'DM Serif Display headings with DM Sans'],
  ['Technical', 'Plus Jakarta Sans, Inter and JetBrains Mono'],
  ['Universal', 'Calibri and Cambria: looks the same everywhere'],
] as const;

/** The styles in the style menu (the app shows Word's "Normal" as Body). */
export const styles = ['Title', 'Subtitle', 'Heading 1', 'Heading 2', 'Heading 3', 'Body', 'Quote', 'Caption', 'Code'] as const;

/** The bundled font families (SIL Open Font License 1.1), loaded privately from the app folder (Fonts/SOURCE.txt, FontCatalog). */
export const fonts = ['Literata', 'Source Serif 4', 'Inter', 'Playfair Display', 'DM Serif Display', 'DM Sans', 'Plus Jakarta Sans', 'Space Grotesk', 'JetBrains Mono', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu'] as const;

/** The panel on the right (Views/Panels/ContextPanel.cs): the first tab follows the selection. */
export const panelTabs = ['Format', 'Picture', 'Table', 'Page', 'Review', 'Reveal', 'Design'] as const;

/** The slash menu (EditorView.Slash.cs), in the app's order. */
export const slashItems = ['Heading 1', 'Heading 2', 'Heading 3', 'Table', 'Picture', 'Bulleted list', 'Numbered list', 'Table of contents', 'Footnote', 'Endnote', 'Page break', 'Quote', 'Code', 'Divider', 'Date', 'Link', 'Comment', 'Caption', 'Citation', 'Bibliography', 'Section break', 'Symbol'] as const;

/** Markdown shortcuts (Editing/MarkdownShortcuts.cs): [what you type, what you get]. Each is its own undo step. */
export const markdownShortcuts = [
  ['# to ###', 'Heading 1 to 3'],
  ['- or *', 'a bulleted list'],
  ['1.', 'a numbered list'],
  ['>', 'a quote'],
  ['```', 'a code block'],
  ['---', 'a divider'],
  ['**bold**', 'bold'],
  ['_italic_', 'italic'],
  ['`code`', 'code'],
  ['~~strike~~', 'strikethrough'],
] as const;

/** The autocorrect rules, each with its own switch in Settings › Autocorrect (Editing/AutoCorrect.cs). */
export const autocorrectRules = ['Smart quotes', 'Capitalize sentences', 'Capital I', 'Symbols', 'Ellipsis', 'Dashes', 'Arrows', 'Fractions', 'Superscript ordinals', 'Fix TWo INitial CApitals'] as const;

/** The start screen's tour, "What Inkwell fixes" (Views/StartView.xaml.cs), word for word. */
export const fixes = [
  ['Pictures stay where you put them', 'Clear wrap choices with a live preview, alignment guides, a visible anchor and Lock position. Pictures you move keep their place on the page when the text above them changes.'],
  ['Lists number the way you expect', 'A list continues only from the list right above it. "Restart at 1" and "Continue from previous" are right there in the panel, and indents stay consistent.'],
  ['Paste without the mess', 'Pasted text takes your document\'s look and keeps bold, italic, links and lists. One click on the paste chip keeps the original formatting; Ctrl+Shift+V pastes plain text.'],
  ['See why text looks the way it does', 'Reveal formatting shows the style, the direct formatting and where each setting comes from. Clear formatting is one click, and a consistency check finds stray formatting.'],
  ['No mystery blank pages', 'Page, section and column breaks are visible, labelled and selectable. The empty paragraph after a final table never makes an extra page, and neither does a page break at the very end.'],
  ['Tables that cooperate', 'Drag column borders, repeat header rows on every page, keep rows from splitting, add rows and columns with one click; Tab in the last cell adds a row.'],
  ['Autocorrect you can trust', 'Every automatic change shows a small chip and goes away with one Ctrl+Z. No capital letters after i.e., e.g. or etc., and every rule can be turned off.'],
  ['Never lose work', 'Documents with a file save themselves as you write, safely. Recovery copies cover new documents, and version history keeps earlier versions you can browse and restore.'],
  ['One landscape page, one click', '"Make this page landscape" adds the section breaks around the page for you, and "Make this page portrait" undoes it the same way.'],
  ['Headers and footers without fiddling', 'Click a header to edit it. First-page and odd/even options are obvious switches, and page numbers are one click.'],
  ['Styles that make sense', 'A small, clear set of styles that follow the document\'s design, and "Update style to match selection" when you like what you made.'],
  ['Counts you can rely on', 'Live word and character counts for the document or the selection, with or without footnotes, and reading time.'],
] as const;

/** The style consistency check (Editing/RevealFormatting.cs): [what it finds, its one-click fix]. */
export const consistencyChecks = [
  ['text with its own font, size or colour', 'Use the styles’ fonts'],
  ['lines that look like a heading but are body text', 'Make them Heading 2'],
  ['lines that start with a typed number or bullet', 'Turn into lists'],
  ['extra empty lines used for spacing', 'Remove the extra empty lines'],
  ['body paragraphs with their own spacing or indents', 'Use the style’s spacing'],
] as const;

/** Citation styles (Citations/CitationStyle.cs), as the dialog names them. */
export const citationStyles = ['APA (7th edition)', 'MLA (9th edition)', 'Chicago (17th edition, author-date)', 'IEEE'] as const;

/**
 * The README's Word compatibility table, row for row: [in a .docx file, in Inkwell, kind].
 * kind: 'edited' (shown and edited), 'shown' (shown and kept, not edited), 'placeholder' (kept exactly, shown as a
 * labelled placeholder), 'kept' (kept exactly, not shown) or 'unsupported'. One correction to the README, from the source:
 * equations are shown as their plain text (ParaSource.cs), not as a labelled placeholder.
 */
export const wordCompatibility = [
  ['Text, character and paragraph formatting, styles, theme fonts and colours', 'Shown and edited', 'edited'],
  ['Bulleted, numbered and multi-level lists, restart / continue numbering', 'Shown and edited', 'edited'],
  ['Tables: merged cells, borders, shading, header rows, rows that don’t split', 'Shown and edited (borders are shown; table styles and shading are edited)', 'edited'],
  ['Pictures in line and floating (square, tight, top and bottom, behind, in front)', 'Shown and edited; tight wrapping is laid out like square', 'edited'],
  ['Headers and footers, different first page, different odd and even pages', 'Shown and edited', 'edited'],
  ['Sections: paper size, orientation, margins, columns; page, column and section breaks', 'Shown and edited', 'edited'],
  ['Hyperlinks, bookmarks', 'Shown and edited', 'edited'],
  ['Footnotes and endnotes', 'Shown and edited', 'edited'],
  ['Table of contents (TOC field)', 'Shown, inserted and updated', 'edited'],
  ['Captions (SEQ), cross-references (REF / PAGEREF), page numbers (PAGE / NUMPAGES)', 'Shown, inserted and updated', 'edited'],
  ['Citations and bibliography (CITATION / BIBLIOGRAPHY fields, sources part)', 'Shown, inserted and updated', 'edited'],
  ['Comments with replies, resolved comments', 'Shown and edited', 'edited'],
  ['Tracked insertions, deletions and formatting changes', 'Shown, made, accepted and rejected', 'edited'],
  ['Document properties (title, author, subject, keywords)', 'Shown and edited', 'edited'],
  ['Text boxes', 'Shown and kept; not edited', 'shown'],
  ['Content controls', 'Their content is shown and kept', 'shown'],
  ['Other fields', 'Their last result is shown; the field is kept', 'shown'],
  ['Charts, SmartArt, embedded objects, EMF / WMF pictures', 'Kept exactly; shown as labelled placeholders', 'placeholder'],
  ['Equations', 'Kept exactly; shown as their plain text, not edited', 'shown'],
  ['Macros (.docm), custom XML, glossary, digital signatures', 'Macros and custom XML are kept exactly; signatures are removed on save (they’d no longer match), as Word does', 'kept'],
  ['Word 97–2003 .doc files', 'Not supported: open them in Word and save as .docx', 'unsupported'],
] as const;

/** The check against Microsoft Word (README, AGENTS.md; tools/word-fidelity.ps1 repeats it). As reported by the author. */
export const wordCheck = {
  word: 'Microsoft Word (Microsoft 365, version 16)',
  documents: 9,
  values: 117,
  matched: 116,
};

/** The 300-page performance test (tests/Inkwell.Tests/PerformanceTests.cs), as measured on the author's PC with 1.0.0. */
export const performance = {
  pages: 301,
  words: 112_562,
  rows: [
    ['Open (load the .docx)', '82 ms', '167 ms'],
    ['Lay out every page', '2.6 s', '3.8 s'],
    ['Median keystroke (edit and relayout)', '2.9 ms', '2.3 ms'],
  ],
} as const;

/** What was tested, and what wasn't (as reported by the author's build; see docs/INKWELL-CONTENT.md). */
export const testing = {
  /** Test cases in tests/Inkwell.Tests (267 [Fact] tests, 51 [InlineData] cases and 5 [MemberData] cases), each run on net10.0-windows and net48. */
  engineTests: 323,
  /** The capture mode's end-to-end checks (smoke.txt): open a .docx, type, save, read back, contents kept, automatic save, undo, open Markdown and text. */
  smokeChecks: 9,
  smokeBuilds: '64-bit, 32-bit and Windows 7/8.1 (.NET Framework 4.8)',
  /** The per-user installer test (install, check, uninstall in a scratch folder). */
  installerChecks: 23,
  untested: [
    'printing on a real printer',
    'screen readers (Narrator, NVDA)',
    'East Asian input methods',
    'spell checking in languages other than English',
    'the ARM64 edition on ARM64 hardware',
    'any build on real Windows 7 or 8.1 PCs, or on 32-bit Windows 10 (those editions ran on 64-bit Windows 11)',
    'how exported PDFs look in other PDF viewers',
  ],
} as const;

/** Known gaps in 1.0 (README and source; see docs/INKWELL-CONTENT.md). */
export const knownGaps = [
  'Line breaks can differ slightly from Word’s, most likely next to floating pictures: the sample résumé is two pages in Inkwell and one in Word.',
  'Tight wrapping is laid out like square wrapping.',
  'Text boxes are shown but not edited. Charts and SmartArt are kept exactly but drawn as labelled placeholders, and equations appear as their plain text.',
  'Inkwell embeds the bundled fonts a document uses when it saves (on by default), whole rather than subset, which added 0.6 to 1.6 MB to each of the five demo documents; Settings can turn it off.',
] as const;

/** "What comes next" on the field note: the known gaps and untested parts, turned into a list. */
export const nextUp = [
  'Line breaks next to floating pictures that match Word’s',
  'Tight wrapping that follows a picture’s outline',
  'Editing text boxes, and drawing charts and equations properly',
  'Code-signing, so SmartScreen stays quiet',
  'Testing with screen readers and on a real printer',
] as const;

/**
 * The real screenshots: PrintWindow captures of Inkwell's own windows (x64, Windows 11 at 150%), made by Inkwell's
 * capture mode with its demo documents. `crop` marks the ones cropped from a larger capture.
 */
export const screenshots = {
  editor: { src: '/art/inkwell-editor.png', width: 1946, height: 1226, version: '1.0.0' },
  editorDark: { src: '/art/inkwell-editor-dark.png', width: 1946, height: 1226, version: '1.0.0' },
  start: { src: '/art/inkwell-start.png', width: 1946, height: 1226, version: '1.0.0' },
  tour: { src: '/art/inkwell-tour.png', width: 1810, height: 900, version: '1.0.0' },
  palette: { src: '/art/inkwell-palette.png', width: 1946, height: 1226, version: '1.0.0' },
  slash: { src: '/art/inkwell-slash.png', width: 1072, height: 420, version: '1.0.0' },
  autocorrect: { src: '/art/inkwell-autocorrect.png', width: 1072, height: 230, version: '1.0.0' },
  paste: { src: '/art/inkwell-paste.png', width: 1072, height: 230, version: '1.0.0' },
  pictureWrap: { src: '/art/inkwell-picture-wrap.png', width: 1946, height: 1226, version: '1.0.0' },
  pictureGuides: { src: '/art/inkwell-picture-guides.png', width: 1072, height: 824, version: '1.0.0' },
  lists: { src: '/art/inkwell-lists.png', width: 1581, height: 660, version: '1.0.0' },
  reveal: { src: '/art/inkwell-reveal.png', width: 1946, height: 1226, version: '1.0.0' },
  breaks: { src: '/art/inkwell-breaks.png', width: 700, height: 680, version: '1.0.0' },
  table: { src: '/art/inkwell-table.png', width: 1946, height: 1226, version: '1.0.0' },
  history: { src: '/art/inkwell-history.png', width: 1350, height: 960, version: '1.0.0' },
  review: { src: '/art/inkwell-review.png', width: 1946, height: 1226, version: '1.0.0' },
  toc: { src: '/art/inkwell-toc.png', width: 1946, height: 1226, version: '1.0.0' },
  citations: { src: '/art/inkwell-citations.png', width: 1290, height: 960, version: '1.0.0' },
  focus: { src: '/art/inkwell-focus.png', width: 1946, height: 1226, version: '1.0.0' },
  urdu: { src: '/art/inkwell-urdu.png', width: 1072, height: 1114, version: '1.0.0' },
  spelling: { src: '/art/inkwell-spelling.png', width: 1072, height: 200, version: '1.0.0' },
  export: { src: '/art/inkwell-export.png', width: 840, height: 976, version: '1.0.0' },
  settings: { src: '/art/inkwell-settings.png', width: 1140, height: 1226, version: '1.0.0' },
} as const;

/** The five demo documents (Samples/DemoDocuments.cs): the first page of each, cropped from the editor captures (inkwell-doc-<id>.jpg, 560×600). */
export const demoDocuments = [
  { id: 'report', name: 'Annual report', note: 'Contents, figures with captions, a table, footnotes and a floating picture' },
  { id: 'letter', name: 'Letter', note: 'A formal letter in the Classic design' },
  { id: 'resume', name: 'Résumé', note: 'A CV in the Modern design, with a floating portrait' },
  { id: 'essay', name: 'Essay with citations', note: 'APA citations, comments with a reply and tracked changes' },
  { id: 'urdu-english', name: 'Urdu and English', note: 'Urdu, Arabic and English in one document' },
] as const;
