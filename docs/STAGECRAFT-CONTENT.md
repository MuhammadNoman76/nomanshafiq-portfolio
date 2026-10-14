# Stagecraft field note: content evidence

Published article: `/blog/stagecraft/`. Download page: `/stagecraft/`. Date: 14 October 2026. App version 1.0.0.
Source: the Stagecraft repository at `D:\Stagecraft`, commit `57dccd7` ("Stagecraft 1.0.0 installers and sample decks"),
published at https://github.com/MuhammadNoman76/stagecraft (the installers in `release/` are live). Every claim below was
checked against that commit. The repository has no LICENSE file, so the pages never call Stagecraft open source; they
credit the Open XML SDK, PDFsharp and the Fluent UI System Icons (MIT) and the fonts (SIL OFL 1.1), and link
`THIRD-PARTY-NOTICES.txt`.

Everything release-specific (version, date, installers, counts, feature lists, test figures, untested items, the "next"
list and the screenshots' version) lives in `src/data/stagecraft.ts`, so a new release mostly means editing that file and
`public/updates/stagecraft.json`.

## Downloads

The four installers are in the Stagecraft repository under `release/` and linked through
`https://github.com/MuhammadNoman76/stagecraft/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files to
25 MiB, so the installers are not copied into this site. Sizes and SHA-256 values were checked against the local files
(`sha256sum`) and `release/SHA256SUMS.txt`:

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | Stagecraft-Setup-1.0.0-x64.exe | 48,060,306 | 99463272d8f2203a804db59e142cb9d723c5217fd203ed2a971dfbb0c52b4533 |
| Windows 10/11 ARM64 | Stagecraft-Setup-1.0.0-arm64.exe | 42,603,902 | 2dbd3bc688829895103047784f638647b98e0651efbea753acf7f96f44c5dce2 |
| Windows 10 32-bit | Stagecraft-Setup-1.0.0-x86.exe | 44,102,700 | 1f05bea27d28d2a1c7d281274a851d78542ce7cce163cb8340e129d0bf5f0e32 |
| Windows 7 SP1 / 8.1 | Stagecraft-Setup-1.0.0-win7-8.exe | 5,921,961 | 671209ae3069761bd73d1379a3764cdca97eab8d11c24a9d005cd21093171607 |

The site shows decimal megabytes (48.1 MB); Stagecraft's README shows MiB (45.8 MB). The Windows 10/11 editions are
self-contained .NET 10 builds. The Windows 7/8.1 edition is .NET Framework 4.8 (AnyCPU); `installer/Stagecraft.iss` checks
for .NET 4.8 (release key >= 528040) and offers Microsoft's download page, with `MinVersion=6.1sp1` (10.0 for the others).
Setup defaults to all users (`PrivilegesRequired=admin`) and offers "only for me"
(`PrivilegesRequiredOverridesAllowed=dialog commandline`). Tasks: desktop shortcut (unticked), "Open Stagecraft
presentations (.stagecraft) with Stagecraft" and "Add Stagecraft to "Open with" for PowerPoint files (.pptx, imported as a
copy)" (both ticked). There is no `[UninstallDelete]`, so `%APPDATA%\Stagecraft` stays after uninstalling. No code signing.

## Update feed

`public/updates/stagecraft.json` follows the schema `src/Stagecraft/Services/Updater.cs` parses (`UpdateManifest`): `app`
must be "Stagecraft" (`ParseManifest`), `version`, `released`, `notes`, `page`, and `editions` keyed `x64` / `arm64` / `x86`
/ `win7-8` (the `Updater.Edition` values, matched case-insensitively) with `url`, `sha256` and `size`; entries without a
valid URL, size or SHA-256 are dropped by the app. Version 1.0.0 equals the released app, so nothing is offered yet.
`tests/stagecraft.test.mjs` keeps the feed and `src/data/stagecraft.ts` in step, and `scripts/check-export.mjs` validates the
exported feed. The `/updates/*` rule in `public/_headers` (no-cache, JSON) covers it. `UpdateService.cs`: first check 10 s
after start, then hourly ticks that only fetch when 24 h have passed; "Update now" / "Later" / "Skip this version"; size and
SHA-256 checked before the installer runs with `/VERYSILENT ... /RELAUNCH=1 /CURRENTUSER|/ALLUSERS`.

## What was tested

- Engine tests: 60 `[Fact]` tests (File 13, Math 18, Model 14, Pptx 6, Render 9; no theories), counted in the source;
  `tests/Stagecraft.Tests` targets `net10.0-windows;net48`.
- Performance: `RenderTests.Performance_200Slides_LoadAndThumbnails` prints save, load and thumbnail times. The figures on
  the pages (200 slides: load 73 ms, 200 thumbnails 452 ms) are the author's run on his PC, as reported; the test itself
  only asserts load < 10 s and thumbnails < 60 s.
- Smoke run: `CaptureRunner.Smoke` (hidden `--capture`, `STAGECRAFT_CAPTURE_ONLY=smoke`) runs the editor's commands on a new
  deck, then undoes and redoes them all, and writes `smoke.txt`. The figure of 83 commands, run on the x64, x86 and
  win7-8 builds, is **as reported by the author's build**; no `smoke.txt` was found to re-check it. A hand count of the
  commands that can run gives about 81, so 83 is plausible.
- A per-user install and uninstall was clean (as reported).
- Not tested, and both pages say so: a slide show in real full screen or on a real second display (only the windowed
  test mode, `--present-windowed`), real mouse dragging and typing (the snapping maths and the commands are tested),
  the ARM64 edition on ARM64 hardware, real Windows 7 / 8.1 PCs and 32-bit Windows 10 (those editions ran on 64-bit
  Windows 11), and screen readers. The pages don't claim the all-users installation was tested.

## Claims and where they come from

All paths in `D:\Stagecraft` at `57dccd7`.

| Claim | Source |
|---|---|
| No ribbon: command bar, slide rail, canvas, properties panel | `Views/EditorView.xaml` (`RailColumn`, `PanelColumn`, `e:PropertiesPanel`) |
| Ctrl+K palette searches commands, layouts, themes and variants, transitions and slides (text and notes) | `Views/Editor/CommandPalette.cs`, `EditorView.Commands.cs` |
| Windows 11 look: Mica on 22H2+ (build 22621), light/dark from Windows, accent colour, Segoe UI Variable | `Interop/Native.cs`, `Controls/FluentWindow.cs`, `Themes/ThemeManager.cs`, `Themes/Theme.xaml` |
| 10 themes, 3 colour variants each, names and descriptions | `Stagecraft.Core/Themes/ThemeCatalog.cs` |
| Switching theme re-lays every slide and keeps the words (and user-moved items) | `DeckOperations.ApplyTheme` → `LayoutEngine.Reflow` |
| 16 smart layouts (names) | `Layouts/LayoutEngine.cs` |
| Shrink text to fit: binary search, sizes and line spacing scale together; per-box switch; drawn text boxes grow instead | `Rendering/TextLayout.cs` (`FitScale`), `PropertiesPanel.Element.cs`, `Model/Elements.cs` |
| Balanced wrapping for titles, subtitles, headings and quotes | `TextLayout.Balance` |
| Smart guides: edges, centres, slide edges/centre/margins, equal spacing; Alt skips once | `Editing/Snapper.cs`, `SlideCanvas.Input.cs`, `SettingsWindow.cs` |
| Tidy up, Ctrl+Alt+T: row, column or grid | `Editing/Tidy.cs`, `EditorView.Commands.cs` |
| 8 bundled font families, loaded privately, never installed | `Rendering/FontCatalog.cs`, `Fonts/SOURCE.txt`, `installer/Stagecraft.iss` |
| Charts bar/line/pie/donut; paste rows from a spreadsheet | `ChartKind`, `ChartEditorDialog.cs`, `Controls/CellGrid.cs` |
| Tables: header row, banded rows, bold first column | `PropertiesPanel.Element.cs` |
| 1,111 icons (Fluent UI System Icons) with None/Circle/Square backgrounds | `Assets/IconCatalog.txt` (1,111 entries), `IconPickerDialog.cs` |
| Shapes incl. callout; connectors stay attached | `ShapeKind`, `DeckOperations.UpdateConnectors` |
| Pictures: insert, drag from Explorer or a browser, paste; fill empty picture placeholder; Fill/Fit/Stretch, circle mask, corners, focus point, alt text | `ClipboardImages.cs`, `EditorView.Elements.cs`, `PropertiesPanel.Element.cs` |
| Undo/redo, group (Ctrl+G), align/distribute, order, lock, duplicate (Ctrl+D), copy/paste between decks, Copy style / Paste style (Ctrl+Alt+C / V) | `Editing/UndoStack.cs`, `EditorView.Commands.cs`, `EditorView.Clipboard.cs` (`Stagecraft.Clipboard.v1`) |
| Views: editor (Ctrl+1, rail with sections), sorter (Ctrl+2), outline (Ctrl+3; Enter / Ctrl+Enter) | `SlideRail`, `SorterView.cs`, `OutlineView.cs` (and its on-screen hint) |
| Slide sizes 16:9, 4:3, custom; speaker notes | `EditorView.Commands.cs`, `EditorView.xaml` |
| Transitions Fade, Push, Slide over, Zoom, Morph | `TransitionKind`, `PropertiesPanel.Slide.cs` |
| Morph: identity → name → content → layout slot, same kind only; interpolates position, size, rotation, opacity, colours, corner radius; changed text cross-fades; unmatched objects fade | `Animation/Morph.cs`, `MathTests` |
| Builds: Appear, Fade in, Rise, Scale up, Wipe; order, delay, duration; Preview animations | `BuildEffect`, `PropertiesPanel.Element.cs` |
| Shows drawn per frame with easing | `Views/Show/ShowSurface.cs` (`CompositionTarget.Rendering`), `Animation/Easing.cs` |
| F5 / Shift+F5 / Alt+F5 | `EditorView.Commands.cs` |
| Presenter view: current/next slide, notes size, timer with pause/restart, clock, slide grid; tools; B/W; number + Enter; clickers; Esc | `Views/Show/PresenterWindow.cs`, `SlideShowController.cs` |
| Ink kept per slide for the show only | `SlideShowController.cs` |
| Rehearse timings: per-slide seconds, kept on request, shown in the slide panel (no auto-advance) | `SlideShowController.cs`, `Slide.RehearsedSeconds`, `PropertiesPanel.Slide.cs` |
| Display stays on | `Native.cs` (`SetThreadExecutionState` with `ES_DISPLAY_REQUIRED`) |
| `.stagecraft` = ZIP: mimetype, deck.json (schemaVersion 1), media/ (named by a truncated SHA-256), thumbs/; newer files refused | `IO/DeckFile.cs`, `Model/Deck.cs`, `Rendering/MediaStore.cs` |
| Atomic save with read-back | `DeckFile.Save` (temporary file, load check, `File.Replace`) |
| Recovery copies: Off / every 1, 2 (default), 5, 10 minutes; offered on the start screen | `SettingsWindow.cs`, `EditorView.xaml.cs`, `Services/Recovery.cs`, `StartView` |
| PDF: vectors via PDFsharp, text as outlines + invisible Inter text layer stretched per run; rasterised effects | `Export/PdfExporter.cs` |
| PNG/JPG: this slide or all, 1920/2560/3840 wide; hidden slides optional | `ExportDialog.cs`, `Export/ImageExporter.cs` |
| PowerPoint export: native objects, notes, size, hidden slides (optional), transitions (Slide over → cover, Morph → fade); charts/icons/artwork as pictures; no builds; fonts not embedded | `Export/PptxExporter.cs`, the export dialog's note |
| Schema validation by tests (not at export time) | `tests/Stagecraft.Tests/PptxTests.cs` (`OpenXmlValidator`, `Export_DemoDecks_AreValidOpenXml`, `Export_EveryLayoutAndTheme_IsValid`) |
| PowerPoint import: contents, skipped items and their warnings, master/layout inheritance, EMF/WMF, opens a copy | `Import/PptxImporter.cs`, `IO/DocumentLoader.cs`, `MainWindow.xaml.cs` |
| `--export-pdf` without a window | `App.xaml.cs` |
| Only network use: the feed and an update download the user asked for | `Services/Updater.cs` (only `HttpClient`), `ClipboardImages.cs` (web links not downloaded) |
| Licences | `THIRD-PARTY-NOTICES.txt` (Open XML SDK 3.5.1, PDFsharp 6.2.4, Fluent UI System Icons, SIL OFL fonts) |

## Claims dropped or changed while checking

- **Autosave** (in the brief): Stagecraft never saves the user's file by itself. It keeps *recovery copies* of unsaved
  work (`%APPDATA%\Stagecraft\Recovery`); the pages say "recovery copy" and that it doesn't save your file behind your back.
- **Crop** (README): the editor has no crop tool; crops only come from imported .pptx pictures. The pages list fill / fit /
  stretch, circle mask, rounded corners, focus point and alt text instead, and "pictures (with their cropping)" for import.
- **"Its own font pairing"** (README): Corporate, Mono and Swiss all use Inter, so the pages say "its own typography".
- **Media "named by the SHA-256"** (README): only the first 10 bytes of the hash are used; the pages say "named by a hash of
  its bytes (part of its SHA-256)".
- **PDF rasterising** (README: soft glows and see-through gradients): also multi-colour gradients and see-through
  pictures; the pages list those. The text layer is described as approximate (each run is stretched to the outlines'
  width, but letters follow Inter's spacing); that is an inference from the code, not a measured offset.
- **".pptx validated"**: validation happens in the automated tests, not during export; the pages say so.
- **Import "tells you what it skipped"**: true except for animations, which are dropped without a warning; the pages say
  so. Master/layout inheritance also brings the master's own shapes and pictures, which the pages add.
- **Copy style between decks**: the copied style is kept per window, so the pages only claim copy and paste of objects
  between decks.
- **Ink**: kept per slide only during the show (not saved). **Rehearse timings**: no auto-advance; not claimed.
- **Transitions "drawn by the GPU"** (README): the pages say "eased and drawn frame by frame, in step with the display"
  (`CompositionTarget.Rendering`), without claiming GPU rendering.
- AGENTS.md in the Stagecraft repository says 1,100 icons; the catalogue has 1,111, which the pages use.

## Screenshots

Every image of Stagecraft is a **real screenshot** of Stagecraft 1.0.0 x64 on Windows 11 at 150 % scaling, and every
caption says so. They come from Stagecraft's own hidden capture mode (`--capture`, `Services/CaptureRunner.cs`): it opens
its windows off screen (left of every display, never activated, never full screen), waits while another app is full
screen, and saves `PrintWindow` captures of its own window handles, with the three sample decks. 42 captures (light and
dark) were taken before this work; this site uses 13 of them plus crops:

- Lossless PNGs re-encoded with `sharp` (compression only), with the Windows 11 rounded corners (12 px at 150 %) restored
  as transparency, because `PrintWindow` returns square corners: editor (light, and dark with the Coffee shop pitch),
  selection, Design panel (dark), command palette, chart editor, icon picker, outline, sorter, presenter view, export
  dialog, settings.
- `stagecraft-start.png`: the start screen cropped to its theme gallery (y 452 to the bottom). The full capture showed two
  "Unsaved changes to “Untitled presentation” were kept" recovery banners left over from test runs, so they were cropped
  away rather than published. Eight of the ten themes are in view, and the caption says so.
- `stagecraft-theme-<id>.jpg` (10 × 640×360): the slide canvas (x 439–1392, y 300–835) of the editor captures that show
  the Aurora Project kickoff title slide in each theme, downscaled. The gallery caption says they are crops.
- The presenter view was captured in the windowed test mode; its title bar says "Presenter view (test window)" and the
  caption says so.
- `stagecraft-cover.jpg` (1672×940) and `stagecraft-social.jpg` (1200×630) place the editor (and, on the cover, the chart
  editor) on a soft violet gradient with `sharp`, running off the right edge so the overlay title has room on phones; the social card adds the logo (`docs/icon.png` at `57dccd7`) and the
  title in system fonts. The cover caption says how it was made.

The start screen wasn't recaptured, so the owner's PC didn't run Stagecraft for this work.

## Launch video

Not added yet. The article has a marked JSX comment (`LAUNCH VIDEO (to be added)`) between "Under the hood" and
"Download"; no empty section is rendered, and `tests/stagecraft.test.mjs` expects the placeholder until the video arrives.
When it does, follow the Trove pattern (`docs/TROVE-CONTENT.md`): `public/media/stagecraft-launch.*`, a `launchVideo`
entry in `src/data/stagecraft.ts`, a `VideoObject`, a contents entry and renumbered sections. If its app shots are
recreations, its caption must say so.

## Download page

`/stagecraft/` (`src/app/stagecraft/page.tsx`) mirrors `/trove/`: hero with the editor screenshot and the recommended
download (`StagecraftDownload`, a `'use client'` wrapper around the shared `WindowsDownload`), three headline numbers,
every installer with checksums, requirements with the testing note, features, installing and links. It repeats claims from
the article and adds none. Its JSON-LD `SoftwareApplication` (`<site>/stagecraft/#app`) is shared with the article's graph.
Both routes are in `sitemap.ts`, `public/llms.txt` and `scripts/check-export.mjs`, and the blog index lists Stagecraft
first (its social image is the blog index's share image).
