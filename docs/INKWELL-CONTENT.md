# Inkwell field note: content evidence

Published article: `/blog/inkwell/`. Download page: `/inkwell/`. Date: 15 October 2026. App version 1.0.1.
The pages were first written for 1.0.0 (local commit `78a730a`, never pushed) and updated for 1.0.1 before publishing.
Source: the Inkwell repository at `D:\Inkwell`, commit `0d28b5c` ("Inkwell 1.0.1 installers") on top of `cbc166b` (the
1.0.1 fixes) and `bc190e0` (1.0.0), published at https://github.com/MuhammadNoman76/Inkwell (capital I; the 1.0.1
installers in `release/` are live and the 1.0.0 ones are gone). The 1.0.0 claims below were checked against `bc190e0` and
re-read where 1.0.1 touched them (see "Inkwell 1.0.1"), not only the README. The repository
has no LICENSE file, so the pages never call Inkwell open source; they credit the Open XML SDK, PDFsharp and the Fluent UI
System Icons (MIT), Markdig (BSD-2-Clause) and the fonts (SIL OFL 1.1), and link `THIRD-PARTY-NOTICES.txt`.

Everything release-specific (version, date, installers, counts, feature lists, the Word comparison, performance and test
figures, untested items, known gaps, the "next" list and each screenshot's version) lives in `src/data/inkwell.ts`, so a
new release mostly means editing that file and `public/updates/inkwell.json`.

## Downloads

The four installers are in the Inkwell repository under `release/` and linked through
`https://github.com/MuhammadNoman76/Inkwell/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files to
25 MiB, so the installers are not copied into this site. Sizes and SHA-256 values were checked against the local files
(`sha256sum`, `ls -l`) and `release/SHA256SUMS.txt`:

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | Inkwell-Setup-1.0.1-x64.exe | 49,038,301 | 19c10a70fe126e056504829e31eb1f1570410e872ee830514970cda96e62a46d |
| Windows 10/11 ARM64 | Inkwell-Setup-1.0.1-arm64.exe | 43,571,909 | 930722d616be18d1a73d0f1bb68023503109a84164ff848dfb022297df9f601d |
| Windows 10 32-bit | Inkwell-Setup-1.0.1-x86.exe | 45,084,054 | df33bac61ac3a5f25985f5c886ed5ccee9bc08e9adc8222a626b3de6b118999e |
| Windows 7 SP1 / 8.1 | Inkwell-Setup-1.0.1-win7-8.exe | 7,020,082 | a866027a5b26f49841c7f88e2212dd00d28eba8528e7b162b17603c39cc31288 |

The site shows decimal megabytes (49.0 MB); the README shows binary ones (46.8 MB): same files. Between 1.0.0 and 1.0.1,
`installer/Inkwell.iss` changed only its version number, so the setup facts below still hold.

Setup (`installer/Inkwell.iss`): all users by default (`PrivilegesRequired=admin`) with "only for me"
(`PrivilegesRequiredOverridesAllowed=dialog commandline`); `MinVersion=10.0` (x64, arm64, x86) or `6.1sp1` (Windows 7/8.1
edition, which checks for .NET Framework 4.8, release key >= 528040, offers Microsoft's download page and stops). Tasks:
desktop shortcut (unticked), "Add Inkwell to "Open with" for Word documents (.docx)" and "... for Markdown files (.md)"
(both ticked). The registry section only writes `OpenWithProgids`, `Capabilities` and `RegisteredApplications`, never
the default value of `.docx` / `.md`: Inkwell never makes itself the default app. There is no `[UninstallDelete]`, so
`%APPDATA%\Inkwell` and `%LOCALAPPDATA%\Inkwell` stay after uninstalling. No code signing.

## Update feed

`public/updates/inkwell.json` follows the schema `src/Inkwell/Services/Updater.cs` parses (`UpdateManifest`): `app` must be
"Inkwell" (`ParseManifest`, case-insensitive), `version`, `released`, `notes`, `page`, and `editions` keyed `x64` / `arm64`
/ `x86` / `win7-8` (`Updater.Edition`, set by `build.ps1` through AssemblyMetadata "Edition"; matched case-insensitively)
with `url`, `sha256` and `size`; entries without a valid URL, size or SHA-256 are dropped by the app. The feed offers
1.0.1, so copies of 1.0.0 will be offered the update once this is pushed. 1.0.0 still looks for the wrong uninstall key
(see "Inkwell 1.0.1"), so it falls back to the folder: 1.0.0 in Program Files or `%LOCALAPPDATA%\Programs` updates in
place, and 1.0.0 in any other folder gets a "Download page" button for this one update. `Updater.cs` parses the same
schema in both versions. The app shows up to six `notes` as bullets in its update bar (`MainWindow.xaml.cs`), so the
feed has six, summarising 1.0.1. `tests/inkwell.test.mjs` keeps the feed and `src/data/inkwell.ts`
in step, and `scripts/check-export.mjs` validates the exported feed. The `/updates/*` rule in `public/_headers` (no-cache,
JSON) covers it.

`UpdateService.cs`: first check 10 s after start, then hourly ticks that only fetch when the last successful check is 24 h
old (the pages say "at most once a day"); "Update now" / "Later" / "Skip this version"; unsaved documents are confirmed;
size and SHA-256 checked before the installer runs with `/VERYSILENT ... /RELAUNCH=1 /CURRENTUSER|/ALLUSERS /DIR=...`.
Settings: "Check for updates automatically" and "Check now".

## What was tested

- Tests: **344** test cases in `tests/Inkwell.Tests` at 1.0.1 (counted in the source): 288 `[Fact]`, 51 `[InlineData]`
  (46 in `DocumentStatsTests`, 5 in `DocxPictureTests`) and one `[MemberData]` theory over the 5 demo documents. 1.0.1
  added checks of the app (`ShortcutTests`, `UpdaterTests`, `SettingsTests`, `AppResourceTests`), so the pages say
  "tests", not "engine tests". The 1.0.1 release build's log (`build.ps1`, kept in the session's scratch folder) reads
  "Passed: 344, Failed: 0" for both net10.0 and net48. 1.0.0 had 323 (267 + 51 + 5), also passing on both.
- Performance (`PerformanceTests.ThreeHundredPages_LoadLayoutTypeSave`): builds a long document, loads it, lays out every
  page, types a sentence in the middle (edit + incremental relayout per keystroke) and saves. The test only asserts
  generous limits; the figures on the pages (301 pages, 112,562 words; load 82 ms / 167 ms, full layout 2.6 s / 3.8 s,
  median keystroke 2.9 ms / 2.3 ms on .NET 10 / .NET Framework 4.8) are the author's run with `INKWELL_PERF_OUT`, **as
  reported**; the repository has no record of them. The pages say "as measured on my PC with 1.0.0"; 1.0.1 didn't touch
  `src/Inkwell.Core/Layout` or the editor engine's layout code.
- Capture-mode checks: `CaptureRunner.Script.cs` (`Smoke`, light theme only) writes `smoke.txt`. In 1.0.0 it had 9
  checks (open .docx, typing, save, saved text reads back, table of contents kept, automatic save, undo, open Markdown,
  open text). 1.0.1 adds 11 (focus-mode and pageless messages, autocorrect by Enter and its single undo, a Markdown
  heading, "Stop doing this", the Settings switch for that rule, turning it back on, Settings following changes, the
  shortcut working again): **20**. The capture folders of the 1.0.1 release builds (`publish\x64`, `publish\x86`,
  `publish\legacy`, each `scope.txt` reading "version 1.0.1") have all 20 as PASS. The 1.0.1 x64 capture run also writes
  layout checks: the command bar at 14 widths from 940 to 3840 px (no clipped label) and the panels, status bar, outline,
  start screen, Settings, Export and citations at the narrowest window, all PASS.
- Installer: a per-user install / uninstall test of the **1.0.0** installer with **23 checks**, as reported (not in the
  repository). The 1.0.1 x64 installer was then installed per user into a custom scratch folder (`/CURRENTUSER /DIR=…
  /TASKS="mdopenwith"`): it wrote the `{B1102FC4-…}_is1` uninstall entry, Inkwell detected the install as "only for me"
  (the 1.0.1 updater fix), and the uninstall removed the entry, folder and shortcut (as reported by the 1.0.1 release
  run). The other three 1.0.1 installers weren't installed, and the pages say so.
- Microsoft Word: `WordFidelityTests.WriteDocuments` writes 9 documents (`report`, `letter`, `resume`, `essay`,
  `urdu-english`, `sections`, `lists`, `tables`, `fields`) and Inkwell's 13 counts per document (pages, words, tables,
  inline and floating pictures, footnotes, endnotes, comments, sections, hyperlinks, TOCs, sources, revisions: 9 × 13 =
  117). `tools/word-fidelity.ps1` opens each one read-only in an invisible Word with macros off and writes Word's counts;
  comparing the two CSVs is manual. Result (README, AGENTS.md; as reported): all 9 open without errors or repairs in
  Microsoft 365 (version 16), 116 of 117 counts equal; the résumé is 2 pages in Inkwell and 1 in Word (a line beside the
  floating portrait wraps one word earlier).
- The bug Word found: commit `d1bbb88` ("Fields inside links are saved within one hyperlink (Word opens the report)").
  AGENTS.md: "Word refuses a file whose field begins in one `w:hyperlink` and ends in another (the schema allows it, and the
  Open XML validator doesn't catch it; `DemoDocumentTests.AssertFieldsNotSplit` does)". `AssertFieldsNotSplit` checks that
  `fldChar` begin / end balance inside every `w:hyperlink` and paragraph-level `w:ins`.
- Not tested, and both pages say so (`testing.untested`): printing on a real printer, screen readers (Narrator, NVDA),
  East Asian input methods, spell checking in languages other than English, the ARM64 edition on ARM64 hardware, real
  Windows 7 / 8.1 PCs and 32-bit Windows 10 (those editions ran on 64-bit Windows 11), exported PDFs in other PDF
  viewers, and the 1.0.1 ARM64, 32-bit and Windows 7 / 8.1 installers.

## Inkwell 1.0.1

Released 15 October 2026, the same day as 1.0.0. Every item was checked against `cbc166b` ("Inkwell 1.0.1: one key per
command, every autocorrect rule in Settings, updater finds its install"). The download page's "What's new in 1.0.1" block
(`whatsNew`), the feed's notes and the changed sentences in the article come from this table.

| Claim | Source |
|---|---|
| The updater recognises its own installation (AppId `{B1102FC4-…}`, as in `Inkwell.iss`), so installs in custom folders update in place; a copy that wasn't installed with the installer gets the download page | `Services/Updater.cs` (`InstallerAppId`), `UpdaterTests`, README "Updates" |
| One table of shortcuts: Ctrl+Shift+E is Track changes, Export is Ctrl+Shift+X, Alt+F opens the menu, zoom Ctrl+Alt+= / Ctrl+Alt+-; menus, tooltips and the palette show the keyboard layout's key names | `Views/Shortcuts.cs` (`Export`, `TrackChanges`, `Menu`, `ZoomIn`, `ZoomOut`), `ShortcutTests` |
| The app menu: New document, Open…, Save, Save as…, Export…, Print…, Version history…, Document properties…, Start screen, Settings, About Inkwell, Close | `Views/EditorView.Menus.cs` |
| Settings › Autocorrect lists every rule, "Markdown paragraphs" and "Markdown formatting" included (the separate "Markdown shortcuts" switch is gone), so a rule turned off with "Stop doing this" can be turned on again | `Views/SettingsWindow.cs` (~66–84), `Editing/AutoCorrect.cs` (73–74), `SettingsTests` |
| A correction made by Enter shows its chip and one Ctrl+Z undoes it | commit message; capture checks "autocorrect by Enter", "one undo after Enter puts back what was typed" |
| The command bar shortens in whole steps (search box: "Search", then icon and Ctrl+K, then icon; Insert and Export become icons) and never cuts a label | `Views/EditorView.xaml.cs`, `fit.txt` (14 widths, all PASS) |
| "Start at…" on the right-click menu and "Start numbering at…" in the palette | `Views/EditorView.Navigation.cs` (285), `EditorView.Commands.cs` (106) |
| .docm documents save automatically; version history follows its size limit when Settings change it; messages close when the view changes | commit message, `EditorView.Files.cs`, capture checks |
| The start screen's tour: "Never lose work" now reads "Documents with a file save themselves, safely, a few seconds after you stop typing. …"; the other eleven texts are unchanged | `Views/StartView.xaml.cs` |
| README privacy section covers `error.log` and `info.log` | README "Privacy" |

Still true in 1.0.1, so the pages keep them: "Add page numbers" with the total writes "3 of 10" (`DocEditor.Document.cs`
is unchanged; the 1.0.1 README says the Page panel "can make them "Page 3 of 10"", which only the checkbox label says);
equations show as their plain text (`ParaSource.cs` unchanged; the 1.0.1 README still calls them labelled placeholders);
there's no bookmarks manager. The video's narration line "every command is one search away" is a simplification: panel-only
actions such as Lock position or the wrap choices aren't palette entries, so the article now says "Commands are one search
away".

## Claims and where they come from

| Claim | Source |
|---|---|
| No ribbon: command bar (undo/redo, style, font, size, B/I/U, colour, more, bullets, numbering, alignment, picture, table, link, comment, Insert, search, Review, panel, Export) | `Views/EditorView.xaml` tooltips |
| Outline pane on the left (Title + Heading 1–6, shown by default, palette "Outline") | `Views/Panels/OutlinePane.cs`, `AppSettings.cs` |
| Panel tabs: Format / Picture / Table (first tab follows the selection), Page, Review, Reveal, Design | `Views/Panels/ContextPanel.cs` (~153–180) |
| Status bar: page, live word count, goal ring, language and "· Right to left", views | `EditorView.xaml`, `EditorView.Status.cs`, `EditorView.xaml.cs` |
| 8 templates with their descriptions | `Inkwell.Core/Templates/TemplateCatalog.cs`; start-screen capture |
| 6 designs (Inkwell, Modern, Classic, Editorial, Technical, Universal) with descriptions | `Templates/DocumentDesigns.cs` |
| Styles: Title, Subtitle, Heading 1–3, Body ("Normal"), Quote, Caption, Code; "Update style" | `EditorView.Menus.cs`, `DocEditor.Format.cs`, `ContextPanel.cs` |
| 11 bundled font families, loaded privately, never installed | `Rendering/FontCatalog.cs`, `Fonts/SOURCE.txt`, `THIRD-PARTY-NOTICES.txt` |
| Kerning and ligatures in Inkwell's designs; widow / orphan, keep with next | `Layout/TextProps.cs` (`InkTypography`), `DocumentDesigns.cs` (kern 16, `w14:ligatures`), `Layout/Paginator.cs` |
| Dark mode: pages stay white unless "Dark pages in dark mode" (off by default; printing and PDF never affected) | `Views/SettingsWindow.cs`, `AppSettings.cs` |
| Ctrl+K palette: commands, styles, designs, templates, headings | `Views/Panels/CommandPalette.cs`, `EditorView.Commands.cs` |
| Slash menu: 22 items; `/` at the start of a paragraph or after whitespace | `EditorView.Slash.cs` (43–65), `EditorView.Typing.cs` (163) |
| Markdown shortcuts, each its own undo step | `Editing/MarkdownShortcuts.cs`, `DocEditor.Shortcuts.cs`, `Editing/History.cs` |
| Autocorrect rules and switches; chip "Undo" / "Stop doing this"; no capital after i.e., e.g., etc. and 58 more abbreviations | `Editing/AutoCorrect.cs` (63–74, 215–221), `EditorView.Typing.cs` (278–279), `SettingsWindow.cs` |
| Paste matches the document (keeps bold, italic, underline, links, headings, quotes, lists, tables); chip "Keep source formatting" / "Text only"; Ctrl+Shift+V; Ctrl+Alt+V | `Editing/Clipboard.cs`, `EditorView.Clipboard.cs` (260–265), `EditorView.Commands.cs` (59–60) |
| Format painter Ctrl+Shift+C (one shot) | `EditorView.Commands.cs` (65), `EditorView.Insert.cs` |
| Find / replace: Aa, whole words, regex, "Notes, comments, headers" (on by default) | `Views/Panels/FindBar.cs`, `Editing/FindReplace.cs` |
| Spelling: Windows Spell Checking API, Windows 8+, per-paragraph language, F7, right-click suggestions | `Proofing/WindowsSpellChecker.cs`, `EditorView.Spelling.cs`, `EditorView.Navigation.cs` |
| Wrap choices (In line with text, Square, Tight, Top and bottom, Behind text, In front of text) preview on hover | `DocEditor.Objects.cs` (156–165), `ContextPanel.Objects.cs` (32–34, 149–192) |
| Guides snap to margins, page and column centres, text-area top / bottom, page middle; Alt skips | `Views/Editing/DocumentView.Input.cs` (728–759) |
| Anchor mark ⚓ with a dotted line, draggable to another paragraph; position relative to the margins; Lock position | `DocumentView.Overlay.cs`, `DocumentView.Input.cs`, `DocEditor.Objects.cs` (89–111, 205–217), `ContextPanel.Objects.cs` (47–59) |
| Tight laid out like Square | `Model/Inlines.cs` (128), `Layout/PageModel.cs` (152) |
| Lists: continue only from the same kind directly above; panel "Restart at 1", "Continue from the list above", "Start at…"; right-click has the first two | `DocEditor.Format.cs` (573–606, 662–695), `ContextPanel.cs` (457–460), `EditorView.Navigation.cs` (283–284) |
| Reveal (Shift+F1): each setting and its source; Tidy up; consistency check with 5 issue types and fixes | `Editing/RevealFormatting.cs` (72–136, 241–260), `ContextPanel.Review.cs` (328–332) |
| Labelled break markers with formatting marks (Ctrl+Shift+8); empty paragraph after a final table and a final page break make no page | `Rendering/PageRenderer.cs`, `Layout/Paginator.cs` (585–586, 673–681, 879–885) |
| Table tab: rows / columns, merge / split, "Repeat header row on each page", "Don't split rows across pages", the three fit buttons, Inkwell / Grid / Plain, header row, banded rows, first column, shading; Tab in the last cell adds a row; drag column borders | `ContextPanel.Objects.cs` (256–311), `DocEditor.Tables.cs` (541–546), `DocumentView.Input.cs` (819–845) |
| "Make only this page landscape" / "portrait" (Page tab), palette "Make this page landscape" | `ContextPanel.Objects.cs` (348–349), `EditorView.Commands.cs` (160–161), `DocEditor.Document.cs` (69–149) |
| Headers / footers: click the top or bottom of a page; "Different first page", "Different odd and even pages"; "Add page numbers" in 5 places, optional total | `DocumentView.Input.cs` (379–382), `ContextPanel.Objects.cs` (370–384), `DocEditor.Document.cs` (240–266) |
| Save automatically (on; ~3 s after the last edit; only documents with a file); temp file, read back, then moved over the original | `AppSettings.cs` (40), `EditorView.Files.cs` (184–191), `IO/DocxWriter.cs` (17–29, 118–136), `DocxSaveOptions.cs` |
| Recovery copies every 2 min by default (Off / 1 / 2 / 5 / 10), every unsaved document, Recover / Discard on the start screen | `SettingsWindow.cs` (92–98), `EditorView.Files.cs` (226–258), `StartView.xaml.cs` (274–333) |
| Version history: every save, automatic saves at most every 10 min, identical copies skipped, copy kept before a restore; `%LOCALAPPDATA%\Inkwell\History`; 200 MB – 2 GB (500 MB default), oldest unnamed first; Name it…, Delete, Open as a copy, Restore this version | `IO/VersionHistory.cs`, `Views/Dialogs/VersionHistoryDialog.cs`, `SettingsWindow.cs` (99–108) |
| TOC (Heading 1–3, F9, click to jump); footnotes at the bottom of each column, continued | `DocEditor.Document.cs` (415–434), `EditorView.Commands.cs` (126–127), `Paginator.cs` (505–550) |
| Captions (Figure / Table / Equation, SEQ); cross-references to headings and captions (text, page, above / below) | `Views/Dialogs/SmallDialogs.cs` (135–173), `DocEditor.Document.cs` (497–611) |
| Bookmarks (Ctrl+Shift+F5), a link target ("Place in this document") | `EditorView.Commands.cs` (130), `EditorView.Insert.cs` (119–133), `SmallDialogs.cs` (65, 74) |
| Citations: APA 7, MLA 9, Chicago 17 author-date, IEEE; 8 source types; "Sources and citations"; bibliography "References" / "Works Cited"; stored in the .docx sources part | `Citations/CitationStyle.cs`, `Views/Dialogs/CitationDialog.cs`, `IO/DocxWriter.cs` (814–832) |
| Comments: replies, resolve / reopen, show resolved; Ctrl+Alt+M | `ContextPanel.Review.cs`, `EditorView.Commands.cs` (118) |
| Track changes: four views; accept / reject one, all, all by one person ("From", with more than one author) | `ContextPanel.Review.cs` (39–67) |
| Document properties: title, subject, author, keywords, description | `SmallDialogs.cs` (195–239) |
| Focus mode F11 (hides bars and panes, fades other paragraphs, centred line); typewriter scrolling (palette); pageless; several pages side by side | `EditorView.xaml.cs` (394–410), `DocumentView.Overlay.cs`, `DocumentView.cs`, `EditorView.Commands.cs` |
| Word count dialog (Ctrl+Shift+G): words with / without notes, characters, paragraphs, pages, reading (238 wpm) and speaking (130 wpm) time; word goal ring, stored in the document | `EditorView.Status.cs`, `Editing/DocumentStats.cs` (112–113) |
| RTL: an empty paragraph turns RTL when an RTL letter is typed; language from the keyboard layout or letters (Urdu-only letters → ur-PK); Noto Nastaliq Urdu / Noto Naskh Arabic; Direction buttons, Ctrl+Alt+. / Ctrl+Alt+, | `EditorView.Typing.cs` (78–124), `DocEditor.Shortcuts.cs` (162–206), `ContextPanel.cs` (361–365), `EditorView.Commands.cs` (95–96) |
| PDF text layer: Inter, and Noto Naskh Arabic for Arabic-script runs (Urdu included); tested | `Export/PdfExporter.cs` (248–295), `tests/.../PdfExportTests.cs` (`UrduText_IsExportedWithAnArabicScriptTextLayer`) |
| .docx / .docm / .dotx / .dotm; saving starts from the original package, untouched parts byte for byte; the open notice "Some parts of this document are kept exactly as they are, but can't be edited in Inkwell" | `IO/DocumentFiles.cs` (43), `IO/DocxWriter.cs` (8–14, 279–298), `EditorView.Files.cs` (323–339), `DocxPreservationTests` |
| Other formats open as new documents; web pictures never downloaded | `DocumentFiles.cs` (53–54), `Formats/HtmlImporter.cs` (836–864), `Formats/MarkdownImporter.cs` (553–574) |
| Export: PDF (selectable text, bookmarks, links, optional changes and comments), Markdown (pictures in a folder), web page (one file), plain text (UTF-8); print via the Windows dialog, no preview; `--export-pdf` | `Views/Dialogs/ExportDialog.cs`, `DocumentFiles.Formats.cs` (63–83), `Services/HeadlessExport.cs` |
| Layout engine: TextFormatter for breaking / shaping / bidi; own paginator (columns balanced in continuous sections, keep with next, widow / orphan, keep lines, tables across pages, repeated headers, unsplit rows, footnotes per column, floats, pageless); incremental relayout from the page before the first change | `Layout/ParagraphLayout.cs`, `Layout/Paginator.cs` (28–32 and the lines in the table), `Layout/DocumentLayout.cs` (204–270) |
| XML-backed properties keep what Inkwell doesn't model | `Model/Props.cs` (6–11) |
| Windows 11 touches guarded: Mica from build 22621, dark title bars, accent colour, Segoe UI Variable | `Interop/Native.cs`, `Controls/FluentWindow.cs`, `Themes/ThemeManager.cs`, `Themes/Theme.xaml` |
| Network: only the update feed and an update the user starts; links open in the browser; no telemetry; settings, recent files and logs in `%APPDATA%\Inkwell`; History, Recovery, Thumbnails in `%LOCALAPPDATA%\Inkwell` | `Services/Updater.cs` (the only `HttpClient`), `EditorView.Navigation.cs`, `Services/Log.cs`, `Services/Recovery.cs`, `Views/Thumbnails.cs`; README "Privacy" |
| Font embedding on by default, whole bundled font files (not subsets) of the families a document references; 0.6–1.6 MB | `AppSettings.cs` (70–71), `IO/DocxFonts.cs` (149–224); measured on `samples/*.docx` (font parts 600,221 to 1,640,185 bytes compressed) |

## Changed or dropped while checking

- **The 12 fixes** are the start screen's tour, word for word (`StartView.xaml.cs` 339–350). Its 11th item is "Styles
  that make sense", not "fast start with no ribbon" as in the brief; the pages follow the app. The tour's own wording is
  shown as the app's ("in the app's own words"); where the code differs, the prose is precise: the panel says "Continue
  from the list above" (the tour: "Continue from previous"); recovery copies cover every unsaved document, not only new
  ones; a correction made by pressing Enter shows no chip (the first Ctrl+Z undoes the Enter, the second the correction).
- **Ctrl+Shift+E for track changes** (README keyboard table) is **not** published: `EditorView.Commands.cs` binds it to both
  "Export…" (line 35) and "Track changes" (169), and the key handler runs the first match, so it opens Export. A test
  keeps the shortcut off the pages.
- **"Page 3 of 10"**: "Add page numbers" with the total inserts `PAGE` + " of " + `NUMPAGES` ("3 of 10", no "Page"; the demo
  report's own footer does say "Page"). The pages say "with the total (“3 of 10”)".
- **Right-click list menu**: has "Restart numbering at 1" and "Continue from the list above", not "Start at…". The pages
  say the right-click menu has the first two.
- **Bookmarks**: there's an add-bookmark prompt (Ctrl+Shift+F5) and links can point to bookmarks, but no bookmarks
  manager, and cross-references can't point to bookmarks. The pages claim only the first two.
- **Right to left "by itself"**: only when the paragraph is empty as the first RTL letter is typed (`p.IsEmpty`); in an
  English paragraph the new text is marked RTL. The pages say "in an empty paragraph" and explain the other case.
- **Equations** (README: "shown as labelled placeholders"): shown as their plain text in Cambria Math italic
  (`ParaSource.cs` 231–238). The compatibility table on the site splits them into their own row and says so; every other
  row is the README's.
- **Font embedding size**: the README says "about 0.5–1.5 MB". The five samples' embedded font parts measure 0.60 MB to
  1.64 MB (whole files; JetBrains Mono is always embedded because every design's Code style names it). The pages say
  0.6 to 1.6 MB, measured on the demo documents.
- **Kerning**: Inkwell kerns where `w:kern` is set (its designs set it) and uses ligatures unless a document turns them off.
  The pages say "Inkwell's designs turn on kerning and ligatures".
- **Guides**: they snap to the margins, centres and text-area edges, not to other pictures or paragraphs; the pages say
  exactly that.
- **Text boxes** are drawn (framed) but not edited; the brief's "not edited or rendered" is narrowed to "shown but not
  edited". Charts and SmartArt are labelled placeholders.
- **Update now with a custom install folder**: `Updater.cs` looks for the uninstall key of AppId `{B522CE93-…}`, but
  `Inkwell.iss` uses `{B1102FC4-…}`, so `DetectInstallScope` falls back to the folder: Program Files and
  `%LOCALAPPDATA%\Programs` still update in place, any other folder gets a "Download page" button. Both pages say so in
  one sentence. (Reported to the owner as a bug.)
- **Typewriter scrolling** is a palette command, not a setting; **no print preview**; **no compare** in version history;
  none of these is claimed.
- **"Pages side by side"**: the status-bar button "Several pages side by side" (palette "Multiple pages").
- **Accessibility**: the README's "screen reader support (UI Automation text pattern)" exists in code
  (`DocumentView.Automation.cs`) but screen readers are untested, so the pages only list screen readers as untested.
- **Spell checking**: per-paragraph language, but only tried in English; said in the Urdu section and in `untested`.
- **"What comes next"**: built from the known gaps and the untested list (Word-like line breaks next to floats, tight
  wrapping, text boxes / charts / equations, screen readers and a real printer, code-signing). The owner didn't supply a
  roadmap; adjust it if needed.

### Bugs in Inkwell 1.0.0 found while checking (fixed in 1.0.1 unless noted)

- Ctrl+Shift+E opens Export instead of toggling track changes (duplicate binding).
- `Updater.UninstallKey` uses the wrong AppId (see above).
- "Add page numbers" with the total writes "3 of 10" though the checkbox says “Page 3 of 10” (**not fixed** in 1.0.1).
- A Markdown rule switched off from the chip ("Stop doing this") can't be switched back on in Settings › Autocorrect
  (those two rules aren't listed there); the chip's tooltip says it can.
- The "Menu (Alt+F)" tooltip has no Alt+F binding; the zoom tooltips say Ctrl++ / Ctrl+- while the keys are Ctrl+Alt+= /
  Ctrl+Alt+-.
- README: `toolsword-fidelity.ps1` is missing a backslash; the privacy section doesn't mention `error.log` / `info.log`.

## Screenshots

Every still image of Inkwell is a **real screenshot** of Inkwell 1.0.1 x64 on Windows 11 at 150 % scaling, and every caption
says so and names the version (`screenshots.<key>.version`; a test checks it). They come from Inkwell's own hidden capture
mode (`--capture`, `Services/CaptureRunner*.cs`): it opens its windows off screen, never activated, waits while another
app is full screen, drives the editor through test hooks (never the keyboard or the system clipboard) and saves
`PrintWindow` captures of its own window handles, with the demo documents. Nothing was captured for this page, and
Inkwell wasn't run. The 1.0.0 pages (`78a730a`) used the 1.0.0 capture set; the 1.0.1 pages use the capture run of the
1.0.1 code (`capall` in the session's scratch folder: 77 files, the same views light and dark, plus `smoke.txt`,
`fit.txt` and `scope.txt` reading "version 1.0.1", from a Debug build of that code; the README's new screenshots are
copies of the same run). Same file names, same crops (the layout didn't move), so only the images whose pixels changed
differ (mostly the command bar).

Treatment (`sharp`): lossless PNG (compression only), with the Windows 11 rounded corners (12 px at 150 %) restored as
transparency on the corners that are real window corners, because `PrintWindow` returns square ones; crops of the inside
of a window keep square edges. Sizes are read from the files by the tests.

- Whole windows: `inkwell-editor.png` (editor-report-light), `-editor-dark.png` (editor-essay-dark), `-start.png`,
  `-palette.png`, `-picture-wrap.png`, `-reveal.png`, `-table.png`, `-review.png` (dark), `-toc.png` (toc-footnotes-light,
  pages side by side), `-focus.png`, `-history.png`, `-citations.png`, `-export.png`, `-settings.png`.
- Crops (captions say "Crop of a real screenshot"): `-tour.png` (the "What Inkwell fixes" cards), `-slash.png`,
  `-autocorrect.png`, `-paste.png`, `-spelling.png`, `-lists.png` (page and panel), `-picture-guides.png`, `-breaks.png`,
  `-urdu.png` (the document column below the command bar, status bar included, so the Nastaliq is readable at article width).
- **The command-bar search box**: in the 1.0.0 captures it was clipped ("Search comr" with short titles, a cut "Ctrl+K"
  badge with long ones), which is why the 1.0.0 pages cropped the short-title shots below the bar. 1.0.1 fixed the bar,
  and its captures show "Search" and a whole Ctrl+K badge (short titles) or the icon and the badge (long titles). The
  crops were kept for size and legibility.
- Not used: `pageless-*` (the 1.0.0 pair carried a stale focus-mode toast; 1.0.1 fixed that, but the page didn't need
  another view), the other editor captures (letter, résumé, Urdu-English, except as gallery tiles), the dark twins and the
  `bar-*` / `narrow-*` fit images.
- **Staged content, said in the captions**: the alignment guides in `-picture-guides.png` were drawn by the capture mode
  (`DocumentView.Guides.Add` at the right margin and the picture's top edge), not by a drag; the version history's four
  versions are demo versions with back-dated times made by the capture mode. The autocorrect, paste and slash shots show
  text the capture mode typed or pasted through the editor's test hooks (the paste is a CF_HTML fragment in Comic Sans /
  Courier with colours). The Settings window shows "NOMAN" as the placeholder for "Your name" (the Windows user name).
- `inkwell-doc-<id>.jpg` (5 × 560×600): the page area (x 421–1363, y 158–1168) of each light editor capture, downscaled.
  The gallery caption says they are crops.
- `inkwell-cover.jpg` (1672×940) places the picture-wrap editor and the version history dialog on a soft blue-to-teal
  gradient, running off the right edge so the overlay title has room; `inkwell-social.jpg` (1200×630) places the report
  editor next to the logo (`docs/icon.png` at `bc190e0`) and the title in system fonts. The cover caption says how it was
  made.

## Launch video

Not in yet. A marked `{/* LAUNCH VIDEO (to be added) ... */}` comment sits between "10 / Under the hood" and "11 /
Download" in `src/app/blog/inkwell/page.tsx`, as Stagecraft's article had before its video; `tests/inkwell.test.mjs`
expects the placeholder and checks that no empty video section is rendered. `.inkwell-video` styles are ready in
`src/app/inkwell.css`. When the video is added: give the section `id="video"` and number 11, renumber Download and What
comes next, add a `launchVideo` entry and a `VideoObject` (as in Stagecraft), say in the caption, the closing note and
`llms.txt` what the video recreates, and turn the placeholder tests into video tests.

## Launch video

`/blog/inkwell/#video` ("11 / The launch video", between "Under the hood" and "Download", in the contents; Download and
What comes next became 12 and 13) plays `public/media/inkwell-launch.mp4`: 1280×720, 105.1 s, H.264 (30 fps) + AAC
(48 kHz stereo), fast-start (`moov` at byte 36, before `mdat`), 14,660,961 bytes, no burned-in captions (checked with
`ffprobe` and two extracted frames with narration playing). `inkwell-launch.en.vtt` (36 cues, the last ending at 1:42.7)
is the default English captions track, and `inkwell-launch-poster.jpg` is the supplied 1280×720 poster. All three are well
under Cloudflare Pages' 25 MiB limit and listed in `scripts/check-export.mjs`.

The markup follows Stagecraft's: `<video controls preload="metadata" playsInline poster>` with a `<source>` and a
`<track kind="captions" srcLang="en" label="English" default>`, in a 16:9 `.inkwell-video` figure, and a `VideoObject`
(`#launch-video`, with thumbnail, content URL, upload date 2026-10-15, ISO duration `PT1M45S` and the caption file) that
the `BlogPosting` points to. The data is `launchVideo` in `src/data/inkwell.ts`.

**The video's app shots recreate Inkwell's interface from its source; every page in it is laid out and rendered by
Inkwell's own engine** (the 1.0.0 engine through a small harness; 1.0.1 didn't change layout or rendering). Demo edits
that aren't in the shipped samples, from the video's working notes: the report's contents removed and re-inserted with
`/toc`, the essay's citation removed and re-inserted with `/cite`, typed sentences (the picture scene, the end of the
essay's conclusion in focus mode), a "Spring fair" Markdown document, a table header row added in the slash scene,
fabricated version-history entries (times, words, sizes), a hypothetical update offer ("Inkwell 1.0.1 is available / You
have 1.0.0"; 1.0.1 has since been released), and a generic PDF viewer frame showing Inkwell's page renders with the
bookmarks read from a real exported PDF. The figure's caption names the demo edits and the PDF frame; the `VideoObject`
description, the closing note of the article and `public/llms.txt` say the interface is recreated. A test checks that
every other mention of a recreation on the page refers to the launch video, that every still figure says "real
screenshot", and the video's data, files, size, poster size, fast-start layout and captions track.

The narration matches the pages, with simplifications the pages make precise: "every command is one search away" (the
pages: "Commands are one search away"), "it runs on Windows 7 to 11" (Windows 7 SP1, 8.1, 10 and 11; Windows 8 needs 8.1),
"saves as you go" (documents that have a file, a few seconds after you stop typing; recovery copies for new ones) and "the
things that drive you mad in Word are fixed" (the pages list the twelve fixes).

## Download page

`/inkwell/` (`src/app/inkwell/page.tsx`) mirrors `/stagecraft/`: hero with the editor screenshot and the recommended
download (`InkwellDownload`, a `'use client'` wrapper around the shared `WindowsDownload`), three headline numbers, every
installer with checksums, "What's new in 1.0.1" (`whatsNew`), requirements with the testing note, features, installing and
links (six numbered sections). It repeats claims from the article and adds none. Its JSON-LD `SoftwareApplication`
(`<site>/inkwell/#app`) is shared with the article's graph. Both routes are in `sitemap.ts`, `public/llms.txt` and
`scripts/check-export.mjs`, and the blog index lists Inkwell first (its social image is the blog index's share image).
