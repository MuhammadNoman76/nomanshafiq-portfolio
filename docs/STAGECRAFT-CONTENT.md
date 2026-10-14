# Stagecraft field note: content evidence

Published article: `/blog/stagecraft/`. Download page: `/stagecraft/`. Date: 14 October 2026. App version 1.1.0.
The pages were first written for 1.0.0 (local commit `32f603e`, never pushed) and updated for 1.1.0 before publishing.
Source: the Stagecraft repository at `D:\Stagecraft`, commit `b628c6d` ("Stagecraft 1.1.0 installers and sample decks"),
on top of `57dccd7` (1.0.0) with `2007636` (window placement fix) and `9b52dd8` (1.1 features), published at
https://github.com/MuhammadNoman76/stagecraft (`main` tracks `origin/main` at `b628c6d`; the installers in `release/` are
live). The 1.0 claims below were checked against `57dccd7` and re-read where 1.1 touched them; the 1.1 claims were
checked against `b628c6d`. The repository has no LICENSE file, so the pages never call Stagecraft open source; they
credit the Open XML SDK, PDFsharp and the Fluent UI System Icons (MIT) and the fonts (SIL OFL 1.1), and link
`THIRD-PARTY-NOTICES.txt`.

Everything release-specific (version, date, installers, counts, feature lists, test figures, untested items, the "next"
list, the "What's new" list and each screenshot's version) lives in `src/data/stagecraft.ts`, so a new release mostly
means editing that file and `public/updates/stagecraft.json`.

## Downloads

The four installers are in the Stagecraft repository under `release/` and linked through
`https://github.com/MuhammadNoman76/stagecraft/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files to
25 MiB, so the installers are not copied into this site. Sizes and SHA-256 values were checked against the local files
(`sha256sum`) and `release/SHA256SUMS.txt`:

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | Stagecraft-Setup-1.1.0-x64.exe | 48,593,808 | d2de9ca98c92bb56574c990d06d19eea25e47dbaba57c2b06db39ca2f6840f68 |
| Windows 10/11 ARM64 | Stagecraft-Setup-1.1.0-arm64.exe | 43,134,464 | 4031591a4543569c94b1f1ca4bfc8f6b76f3de0a6c43b6483d820782470a66d7 |
| Windows 10 32-bit | Stagecraft-Setup-1.1.0-x86.exe | 44,630,557 | 96dbe45e4da0fd153b439e27d097bb924e43cf4d068c5148f0d11a4707f9d986 |
| Windows 7 SP1 / 8.1 | Stagecraft-Setup-1.1.0-win7-8.exe | 6,563,166 | 340d65a3f8a0af6d20ff90503648ab4168c65cc9974c42ef9d7e040f8805aff3 |

The site and Stagecraft's 1.1 README both show decimal megabytes (48.6 MB). The 1.0.0 installers are gone from `release/`.
Between 1.0.0 and 1.1.0, `installer/Stagecraft.iss` and `build.ps1` changed only their version number, so the setup facts
below still hold. The Windows 10/11 editions are
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
valid URL, size or SHA-256 are dropped by the app. The feed offers 1.1.0, so installed 1.0.0 copies will be offered the
update once this is pushed. `Updater.cs` and `UpdateService.cs` are unchanged between 1.0.0 and 1.1.0 (`git diff 57dccd7
b628c6d`), so 1.0.0 reads this feed exactly as before; the app parses `notes` but doesn't show them.
`tests/stagecraft.test.mjs` keeps the feed and `src/data/stagecraft.ts` in step, and `scripts/check-export.mjs` validates the
exported feed. The `/updates/*` rule in `public/_headers` (no-cache, JSON) covers it. `UpdateService.cs`: first check 10 s
after start, then hourly ticks that only fetch when 24 h have passed; "Update now" / "Later" / "Skip this version"; size and
SHA-256 checked before the installer runs with `/VERYSILENT ... /RELAUNCH=1 /CURRENTUSER|/ALLUSERS`.

## What was tested

- Engine tests: **135** test cases: 121 `[Fact]` tests and one `[Theory]` with 14 `[InlineData]` cases
  (`LinkTests.NormalizeWeb_AllowsOnlyHttp`), counted in the source (Animation 22, EditingV11 15, ExportV11 9, File 13,
  Link 7 + a theory with 14 cases, Math 17, Media 9, Model 14, Pptx 6, Render 9). `tests/Stagecraft.Tests` targets
  `net10.0-windows;net48`. That they pass on both is as reported by the author's build (`build.ps1` runs them first).
- Performance: `RenderTests.Performance_200Slides_LoadAndThumbnails` still exists and only asserts load < 10 s and
  thumbnails < 60 s. The figures on the pages (200 slides: load 73 ms, 200 thumbnails 452 ms) are the author's 1.0 run, as
  reported, and the pages label them as measured with 1.0.0; "still passes" in 1.1 is as reported. The headline number
  that used to show it now shows the animation effects instead.
- Smoke run: `CaptureRunner.Smoke` (hidden `--capture`) runs the editor's commands on a new deck, then undoes and redoes
  them all, and writes `smoke.txt`. The 1.1 capture folder's `smoke.txt` reads "133 commands ran, 110 undo steps, 18
  slides, 0 problems", and `smoke-progress.txt` lists the commands (animations, links, media, guides and crop included).
  That it ran on the x64, x86 and win7-8 builds is as reported.
- Video and sound: checked with MP4 (H.264 / AAC), MP3, M4A and WAV on Windows 11 (README, as reported); MOV, WMV, WMA,
  Windows 7 / 8.1 and Windows N editions weren't tested, and the pages say so.
- PowerPoint: the author opened exported files in PowerPoint itself, which read 37 effects, the links, trims and fades
  correctly, and imported a deck authored in PowerPoint (**as reported**; the repository has no record of the run beyond
  AGENTS.md: "preset ids were checked against PowerPoint itself" and the COM recipe for checking exports). The pages say
  "I checked the round trip in PowerPoint itself".
- Installer: the 1.0.0 per-user install and uninstall was clean (as reported). The 1.1 installers weren't re-tested; only
  the version number in the setup script changed, and the pages list "the 1.1 installers themselves" as untested.
- Not tested, and both pages say so (`testing.untested`): a slide show in real full screen or on a real second display
  (only the windowed test mode, `--present-windowed`), real mouse dragging and typing, the ARM64 edition on ARM64
  hardware, real Windows 7 / 8.1 PCs and 32-bit Windows 10 (those editions ran on 64-bit Windows 11), MOV / WMV / WMA files
  and Windows N editions, the 1.1 installers themselves, and screen readers.

## Stagecraft 1.1

Everything here was checked against `b628c6d` (paths under `src/`). The download page's "What's new in 1.1" block, the
feed's notes and the article's Animations, Links and Video & sound sections are built from these.

| Claim | Source |
|---|---|
| 12 entrance effects (Appear, Fade, Fly in, Float in, Wipe, Split, Zoom, Grow & turn, Bounce, Wheel, Swivel, Rise up), 8 emphasis (Pulse, Spin, Grow / shrink, Teeter, Colour pulse, Transparency, Bold flash, Wave), 12 exits (Disappear, Fade out, Fly out, Float out, Wipe, Split, Zoom, Shrink & turn, Bounce, Wheel, Swivel, Sink down); 32 effects in all | `Stagecraft.Core/Model/Animation.cs` (`EffectKind`, `EffectCatalog` names) |
| Fly in from 8 directions; Fly, Float, Wipe choose a direction, Split opens horizontally / vertically, in / out | `EffectDirection` and its comment, `EffectCatalog` direction names |
| Motion paths Line, Arc, Circle, Custom path; shown on the slide when selected, points draggable; Reverse, Draw a path | `EffectKind`, `Views/Editor/SlideCanvas.Animation.cs`, `PropertiesPanel.Animations.cs`; 1.1 capture `motion-path` |
| Start: On click / With previous / After previous; duration, delay; repeat Once, 2–5, 10 times, Until next click, Until end of slide; Rewind when done; easing Automatic, Steady, Speed up, Slow down, Smooth start and end, Overshoot | `PropertiesPanel.Animations.cs` (lines ~451–469) |
| Text: All at once, By paragraph, By word, By letter; "Each paragraph on its own click" | `PropertiesPanel.Animations.cs` (~506–509), `TextUnit` |
| Triggers: an effect waits until an element is clicked in the show | `AnimationEffect.Trigger` doc comment, `Animation/Timeline.cs` |
| Animation pane: click groups, timeline, drag to reorder, Ctrl+click multi-select, Play from here; numbered badges while it's open | `PropertiesPanel.Animations.cs` ("Play from here", "Drag to change the order. Ctrl+click to select several."), 1.1 captures `animation-pane` |
| Gallery previews an effect on the slide on hover ("Point at an effect to see it on the slide.") | `Views/Editor/AnimationGallery.cs`, capture `animation-gallery` |
| Animation painter Alt+Shift+C | `EditorView.Commands.cs` ("Copy animation (animation painter)", `Key.C, A | S`) |
| Show: next click group, back a step; presenter view "Click n of m" and "Next: click n of m" | `Views/Show/SlideShowController.cs`, `PresenterWindow.cs` (~298–312) |
| 1.0 files: builds become On click + With previous effects with the same delays (appear, fade, rise, wipe; scale up → Zoom from 82 %); `CurrentSchemaVersion = 2` | `IO/DeckFile.cs` (`Migrations`), `Model/Deck.cs` |
| Morph keeps elements an animation hides hidden | Stagecraft AGENTS.md (`MorphFrame`), `Animation/Morph.cs` |
| Links on any element (`Element.Link`) and on text runs (`Run.Link`); the pages name words, shapes, pictures, icons and action buttons | `Model/Elements.cs`, `Model/Text.cs` |
| Action buttons Back, Next, First slide, Last slide, Return, Link… | `EditorView.Commands.cs` ("Action button: …") |
| Targets: web (http / https only; `javascript:`, `file:`, `ftp:` refused), e-mail with subject, slide (next, previous, first, last, last viewed, a slide), file | `Model/Links.cs` (`LinkSafety.NormalizeWeb`, `MailtoUri`), `Views/LinkDialog.cs`, `LinkTests` |
| Files open after a confirmation; blocked: .exe .com .bat .cmd .ps1 .psm1 .vbs .vbe .js .jse .wsf .wsh .msi .msp .scr .pif .cpl .hta .jar .lnk .reg .inf .application .appref-ms .gadget .msc .dll .sys .url and files without an extension | `LinkSafety.BlockedExtensions`, `Services/LinkLauncher.cs` |
| Ctrl+Shift+K (also right-click menu, panel, palette); Ctrl+click follows a link in the editor | `EditorView.Commands.cs` (`Key.K, C | S`), `EditorView.Links.cs`, `SlideCanvas.Input.cs` ("Ctrl+click follows a link, as in the slide show") |
| Linked text underlined in the theme's link colour | `Rendering/TextLayout.cs` ("the theme's link colour … always underlined") |
| Show: hand cursor over links, ScreenTip (or the link's summary) | `Views/Show/ShowSurface.cs` (~472–475) |
| PDF link annotations: web and e-mail, slides go to their page, files and linked media; "last viewed" has no PDF equivalent; online video cards link to their page | `Export/PdfExporter.cs` (`AddLinks` doc comment) |
| Video / audio file types accepted: .mp4 .m4v .mov .wmv .avi .mkv .webm .3gp .mpg .mpeg .ts .asf / .mp3 .m4a .aac .wav .wma .flac .ogg .opus .aif .aiff; played by WPF `MediaElement` / `MediaPlayer` (Media Foundation), no codecs bundled | `Model/Media.cs` (`MediaTypes`), Stagecraft AGENTS.md |
| Can't-play message suggests MP4 (H.264 / AAC) and the Media Feature Pack on "N" editions | `Rendering/MediaProbe.cs` (`CantPlayAdvice`) |
| Embedded by default; files over 200 MB (decimal) offer linking; "Link instead…" / "Embed" switch later | `MediaLimits.EmbedWarningBytes = 200L * 1000 * 1000`, `EditorView.Media.cs`, `PropertiesPanel.Media.cs` |
| Video: poster frame, trim ("The file itself isn't changed."), start In click order / Automatically / When clicked on, Play full screen, Loop until stopped, volume, fade in / out, Hide when not playing, shape (rectangle, rounded, circle), corners, border | `PropertiesPanel.Media.cs`, `PropertiesPanel.Element.cs` (`BuildBorder` includes `VideoElement`), `Views/TrimDialog.cs`, captures `video-editor`, `trim-dialog` |
| Sound: speaker icon ("Hide the icon in the show"), "Play across slides" with "Stop after", loop, volume, fades | `PropertiesPanel.Media.cs` |
| Play / Pause / Stop as animation steps | `EffectKind.Play / Pause / Stop`, `EffectClass.Media` |
| Editor hover playback bar; show bar with play / pause, seek and mute | `Views/Editor/SlideCanvas.Media.cs`, `Views/Show/MediaControlBar.cs` |
| Only the audience window plays sound; the presenter view is muted unless it's the only window | Stagecraft AGENTS.md (Slide show), `Views/Show/MediaHosts.cs` |
| Online video cards open the browser in the show and don't play in the slide; picture and title from YouTube's / Vimeo's oEmbed pages and YouTube's thumbnail server, once, when "Download the video's picture and title from the site" is ticked (it is by default) | `Services/OnlineVideos.cs`, `Views/OnlineVideoDialog.cs`, `PropertiesPanel.Media.cs` |
| Header and footer: slide number, date (automatic or fixed), footer, not on title slides, in the theme's fonts and colours; in PDF and .pptx (text boxes, slide number and automatic date as fields) | `Views/HeaderFooterDialog.cs`, `Model/HeaderFooter.cs`, `Rendering/DecorPainter.cs`, `Export/PptxExporter.cs` |
| Find and replace: Ctrl+F / Ctrl+H; text boxes and shapes, table cells, speaker notes ("Also search speaker notes", on by default); Match case, Whole words only | `EditorView.Commands.cs`, `Views/Editor/FindBar.cs`, `Editing/FindReplace.cs` |
| Spell check as you type in slide text and notes, suggestions on right-click; Settings "Check spelling as I type" (on by default) | `SettingsWindow.cs`, `AppSettings.SpellCheck = true`, `Views/Editor/TextContextMenu.cs` |
| Crop with handles (edges, corners, move inside, Enter to finish); circle / rounded rectangle; opacity; border; shadows None, Soft, Lifted, Close, Glow; "Replace picture…" | `Views/Editor/SlideCanvas.Crop.cs`, `PropertiesPanel.Media.cs` (~214), `PropertiesPanel.Element.cs`, `EditorView.Commands.cs`; capture `crop` |
| Custom gradient: Linear / Radial, From / To colours, Angle 0–360 (linear) | `PropertiesPanel.Element.cs` (~179–194) |
| Text shadow ("A soft shadow behind the letters, for text over pictures"); outlines Solid, Dashes, Long dashes, Dots, Dash dot | `EditorView.Text.cs`, `PropertiesPanel.Media.cs` (~17); capture `link-panel` |
| Rulers in centimetres where the region is metric, else inches; Gridlines (Shift+F9), Grid spacing, Snap to grid, guides | `SlideCanvas.ViewAids.cs` (`RegionInfo.CurrentRegion.IsMetric`), `EditorView.Views.cs` (~122–145) |
| Save automatically: on by default, only decks that have a file, 4 s after the last change, not while typing / dragging / cropping or with a dialog open, written with `DeckFile.Save` | `AppSettings.AutoSaveFile = true`, `EditorView.Files.cs` (`AutoSaveDelay`, `AutoSaveFileTick`), `SettingsWindow.cs` |
| Import summary: "Some things couldn't be brought over exactly:" with the left-out and changed items (SmartArt, unreadable pictures, unknown shapes, media and animation changes) | `Import/PptxImporter.cs` (~112–124, 605, 798), `Views/MainWindow.xaml.cs` (~112–124) |
| .pptx animation mapping (exact: Appear 1, Fly 2, Fade 10, Split 16, Wheel 21, Wipe 22, Zoom 53, Grow 6, Spin 8, Transparency 9, Pulse 26; approximated: Bounce → Fly from the top, Grow & turn → Zoom, Float / Rise / Swivel → Fade, Teeter / Wave / Colour pulse / Bold flash → Pulse; motion paths as custom paths; media play 1 / pause 2 / stop 3) | `Export/PptxTiming.cs` (`PptxTimingWriter.Mapping`, Bounce direction ~271) |
| .pptx import mapping (Float 30 / 42 / 47, Rise 37, Swivel 19, Bounce 26, Grow & turn 31, Bold flash 10, Teeter 32, Wave 34; others → Fade or Pulse) | `Import/PptxImporter.Animations.cs` (~349–383) |
| Export: action buttons, online video cards, charts, icons and theme artwork as pictures (keeping links); Morph → fade; links as hyperlinks / show jumps; media with trim and fades | `Export/PptxExporter.cs` (class comment, ~326, ~368, ~464) |
| Export tests against the Open XML schema (1.1 exports included) | `tests/Stagecraft.Tests/PptxTests.cs`, `ExportV11Tests.cs` (`OpenXmlValidator`) |
| 1,112 icons (1.1 adds `speaker_2`) | `Assets/IconCatalog.txt` (1,114 lines, 2 of them comments) |
| Fix: the first window fits and centres in the main display's work area (or opens maximized), and windows stay on their display | commit `2007636` (`Controls/FluentWindow.cs`, `Views/MainWindow.xaml.cs`, `Interop/Native.cs`; the placement maths is `Editing/ScreenFit.cs` in `9b52dd8`) |
| Command bar: …, picture, "Video, sound or an online video", icon, chart, table, link, views, palette, "Animations on this slide", design, present | `Views/EditorView.xaml` tooltips |

### Changed or dropped while checking 1.1

- **Autosave and crop** were dropped from the 1.0 pages because 1.0 didn't have them. 1.1 has both (see the table), so the
  pages now describe "Save automatically" and crop with handles, and no longer say Stagecraft never saves your file or has
  no crop tool (a test guards against the old wording).
- **"Builds"** are gone from the pages: 1.1 replaced them with animations, and 1.0 files are migrated.
- **"Only network use: the update feed"**: no longer true. Online video cards fetch a picture and title once (optional,
  ticked by default). The article's privacy sentence and `llms.txt` say so.
- **200-slide timing**: no 1.1 figure was given, so the 1.0 measurement is kept and labelled with its version.
- **Rulers "in centimetres or inches"**: there's no unit setting; the unit follows Windows' region
  (`RegionInfo.IsMetric`). The pages say "following Windows' regional settings".
- **Exit effect count**: the 12 exits are mirror images of the entrances, but they have their own names in the app, so the
  pages count 32 effects (12 + 8 + 12) and list motion paths separately.
- **Import "reads them back"**: true for animations (closest effect where needed), links, media with trim / fades / volume
  / looping, and the footer as text; Colour pulse has no import preset and arrives as Pulse, which the table says.
- **"37 effects" in PowerPoint**: as reported by the author, not re-checkable from the repository (see "What was tested").
- **Video border**: the README says "a border in the theme's style"; the code adds videos to the shared border section, so
  the pages say "a border" only.
- **Settings screenshot**: still the 1.0.0 capture; its caption says 1.1 adds Save automatically and Check spelling as I type.

## Claims and where they come from (1.0)

All paths in `D:\Stagecraft` at `57dccd7`. Rows that 1.1 changed (builds, schema version 1, "no builds" in .pptx, the
only-network-use row) are superseded by the 1.1 table above.

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

## Claims dropped or changed while checking 1.0

Autosave and crop below were true of 1.0; 1.1 added both (see "Stagecraft 1.1").

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
- AGENTS.md in the Stagecraft repository says 1,100 icons; the 1.0 catalogue had 1,111 (1.1: 1,112, which the pages use).

## Screenshots

Every image of Stagecraft is a **real screenshot** of Stagecraft 1.1.0 or 1.0.0 x64 on Windows 11 at 150 % scaling, and
every caption says so and names the version (`screenshots.<key>.version` in the data file; a test checks it). They come from Stagecraft's own hidden capture mode (`--capture`, `Services/CaptureRunner.cs`): it opens
its windows off screen (left of every display, never activated, never full screen), waits while another app is full
screen, and saves `PrintWindow` captures of its own window handles, with the three sample decks. 42 captures (light and
dark) were taken before this work; the 1.0.0 set below is still used where 1.1 has no newer capture of the same view:

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

### 1.1.0 captures

The author's 1.1.0 capture run (`--capture`, `STAGECRAFT_CAPTURE_ONLY` with `v11`; 33 PNGs, light and dark, plus
`smoke.txt`) supplied the 1.1 images. Nothing was captured for this update; the owner's PC didn't run Stagecraft. Same
treatment as 1.0: lossless PNG re-encoded with `sharp` (compression level 9) and the 12 px corners restored as
transparency.

- Replaced with 1.1.0 captures (same file names): `stagecraft-editor.png` (editor-aurora-kickoff-light, 12 slides now),
  `stagecraft-editor-dark.png` (editor-coffee-pitch-dark; the speaker icon is the sample's background music), and
  `stagecraft-start.png` (start-light, the top 955 px: title bar, logo and the first two rows of themes; only the top
  corners are rounded. The 1.1 capture has no recovery banners).
- New: `stagecraft-animation-gallery.png` (dark), `stagecraft-animation-pane.png`, `stagecraft-motion-path.png`,
  `stagecraft-link-dialog.png` (1020×760), `stagecraft-show-link.png` (1440×868, the slide show in the windowed test mode,
  "Slide show (test window)"; the hand pointer isn't in it because `PrintWindow` doesn't capture the cursor, so the
  caption only mentions the ScreenTip), `stagecraft-video.png` (dark), `stagecraft-trim.png` (1140×960),
  `stagecraft-header-footer.png` (1140×922), `stagecraft-find.png`, `stagecraft-crop.png`, `stagecraft-view-aids.png`.
  Not used: `link-panel` (its Link section is below the visible part of the panel) and `smoke.png`.
- Still 1.0.0 (captions say so): selection, Design panel, command palette, chart editor, icon picker (shows "1111 icons";
  the caption gives the 1.1 count), outline, sorter, presenter view, export dialog, settings, and the ten theme tiles
  (`ThemeCatalog.cs` is unchanged in 1.1; `DecorPainter.cs` only gained the footer).
- `stagecraft-cover.jpg` (1672×940) now places the 1.1 editor with the animation pane and the Trim video dialog on the same
  violet gradient; `stagecraft-social.jpg` (1200×630) places the 1.1 editor with a video slide next to the logo
  (`docs/icon.png`, unchanged in 1.1) and the title. Same file names; the cover caption and the blog card's alt text
  describe the new contents.

## Launch video

`/blog/stagecraft/#video` ("11 / The launch video", between "Under the hood" and "Download", in the contents; Download
and What comes next became 12 and 13) plays `public/media/stagecraft-launch.mp4`: 1280×720, 100.9 s, H.264 High (30 fps)
+ AAC LC (48 kHz stereo), fast-start (`moov` before `mdat`), 14,750,254 bytes, no burned-in captions (checked with
`ffprobe`). `stagecraft-launch.en.vtt` (33 cues, the last ending at 1:38.6) is the default English captions track, and
`stagecraft-launch-poster.jpg` is the supplied 1280×720 poster. All three are well under Cloudflare Pages' 25 MiB limit
and listed in `scripts/check-export.mjs`. The supplied `stagecraft-cover.jpg` / `stagecraft-social.jpg` from the video
work were not used: the site keeps its real-screenshot cover and social images.

The markup follows Trove's: `<video controls preload="metadata" playsInline poster>` with a `<source>` and a
`<track kind="captions" srcLang="en" label="English" default>`, in a 16:9 `.stagecraft-video` figure, and a
`VideoObject` (`#launch-video`, with thumbnail, content URL, upload date 2026-10-14, ISO duration `PT1M41S` and the
caption file) that the `BlogPosting` points to. The data is `launchVideo` in `src/data/stagecraft.ts`.

**The video's app shots recreate Stagecraft's interface from its source; the slides in it are rendered by Stagecraft's
own engine** (as supplied with the video). A few demo edits were added for the video and aren't in the shipped sample
decks: some extra effects, two slides (for example "Four steps to launch") and a link. The figure's caption, the
`VideoObject` description, the closing note of the article and `public/llms.txt` say so. A test checks that every other
mention of a recreation on the page refers to the launch video, that every still figure says "real screenshot", and
the video's data, files, size, poster size, fast-start layout and captions track.

The narration matches the 1.1 pages, with two simplifications the pages make precise: "it runs on Windows 7 to 11" (the
pages say Windows 7 SP1, 8.1, 10 and 11, and that Windows 8 needs 8.1 first) and "saves your work automatically" (the
pages say Save automatically works once a presentation has a file, with recovery copies for unsaved work). "Over a
thousand icons" is 1,112.

## Download page

`/stagecraft/` (`src/app/stagecraft/page.tsx`) mirrors `/trove/`: hero with the editor screenshot and the recommended
download (`StagecraftDownload`, a `'use client'` wrapper around the shared `WindowsDownload`), three headline numbers,
every installer with checksums, "What's new in 1.1" (`whatsNew` in the data file), requirements with the testing note,
features, installing and links (six numbered sections). It repeats claims from the article and adds none. Its JSON-LD `SoftwareApplication` (`<site>/stagecraft/#app`) is shared with the article's graph.
Both routes are in `sitemap.ts`, `public/llms.txt` and `scripts/check-export.mjs`, and the blog index lists Stagecraft
first (its social image is the blog index's share image).
