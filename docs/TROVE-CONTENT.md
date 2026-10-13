# Trove field note: content evidence

Published article: `/blog/trove/`. Download page: `/trove/`. Date: 13 October 2026. App version 1.0.0.
Source: the Trove repository at `D:\Trove`, commit `66fb783` ("Trove 1.0.0: Windows 11 style app, installers for every
edition"). Its GitHub repository (https://github.com/MuhammadNoman76/Trove) **didn't exist yet** when these pages were
written, so the download, checksum, notices and repository links only work once the owner creates it and pushes
`release/`. The repository has no LICENSE file, so the pages never call Trove open source; they credit the 7-Zip engine
(LGPL, unRAR restriction) and the Fluent UI System Icons (MIT) and link `THIRD-PARTY-NOTICES.txt`.

## Downloads

The four installers are in the Trove repository under `release/` and linked through
`https://github.com/MuhammadNoman76/Trove/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files to
25 MiB, so the installers are not copied into this site. Sizes and SHA-256 values were checked against the local files
and `release/SHA256SUMS.txt` (they match `dist/` too):

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | Trove-Setup-1.0.0-x64.exe | 45,423,304 | d76bff1b3d29131cfce2b2586cc46ed8502c868fdd73cbfc55daf90577356482 |
| Windows 10/11 ARM64 | Trove-Setup-1.0.0-arm64.exe | 39,885,122 | e6b8cccd880aae217ed2581a79c67c19b002ef59c53a7af004b56787652ac84c |
| Windows 10 32-bit | Trove-Setup-1.0.0-x86.exe | 41,383,656 | b2b7abae990cffb1e5508d5c94cd97354da2e05b999f11a6acf0dce68f9c8c3a |
| Windows 7 SP1 / 8.1 | Trove-Setup-1.0.0-win7-8.exe | 3,804,080 | d8e4126ae0fc46fa6c05b75e59b63333cbf36a19ab81ba6db7128c7cfac03ea0 |

The Windows 10/11 editions are self-contained .NET 10 builds, each with the 7z.dll for its processor. The Windows 7/8.1
edition is .NET Framework 4.8 (AnyCPU) and carries the x64 and x86 7z.dll; setup installs the one matching Windows
(`installer/Trove.iss`, `MinVersion=6.1sp1`, .NET release key >= 528040 with an offer to open Microsoft's download page).
Windows 8 users are told to update to 8.1 (the installer has no explicit 8.0 check; .NET Framework 4.8 doesn't support
8.0). Setup defaults to all users (`PrivilegesRequired=admin`) and offers "only for me"
(`PrivilegesRequiredOverridesAllowed=dialog commandline`). Tasks: "Open with" for archives and the right-click menu
(both ticked), desktop shortcut (unticked). Uninstalling keeps `%APPDATA%\Trove`. No code signing (no SignTool in
`Trove.iss` or `build.ps1`).

## Update feed

`public/updates/trove.json` follows the schema `src/Trove/Services/Updater.cs` parses: `app` must be "Trove", `version`,
`released`, `notes`, `page`, and `editions` keyed `x64` / `arm64` / `x86` / `win7-8` (the `Updater.Edition` values) with
`url`, `sha256` and `size`. Version 1.0.0 equals the released app, so nothing is offered yet. `tests/trove.test.mjs`
keeps the feed and `src/data/trove.ts` in step, and `scripts/check-export.mjs` validates the exported feed. The
`/updates/*` rule in `public/_headers` (no-cache, JSON) covers it. Release order: push installers to the Trove
repository first, then update both files here.

## What was tested (as reported by the author's build)

- Engine tests: 85 of 85 pass on .NET 10 (x64) and on .NET Framework 4.8 as an x64 and an x86 process.
  The count was checked in the source: 36 `[Fact]` + 7 `[Theory]` with 49 `[InlineData]` cases, no skips.
- The x64, x86 and legacy (.NET Framework) builds ran on the author's Windows 11 PC; the Explorer menu and multi-file
  selection were checked; a per-user install and uninstall left nothing behind.
- Not tested: ARM64 hardware, real Windows 7 / 8.1 machines, the all-users installation. Drag-in / drag-out were only
  code-reviewed. Both pages say so.
- Note: the PC used for the screenshots has an all-users Trove 1.0.0 install (HKLM uninstall entry, `C:\Program
  Files\Trove`). That was not exercised here, and the pages keep the author's statement that it is untested.

## Claims and where they come from

All paths in `D:\Trove`.

| Claim | Source |
|---|---|
| 7-Zip 26.04, unmodified 7z.dll for x64 / x86 / ARM64 | `vendor/7-Zip/SOURCE.txt` (hashes), `RoundTripTests` asserts the version |
| Own COM interop, no wrapper library | `Trove.Core/SevenZip/Interop.cs` (`[PreserveSig]`), `SevenZipLibrary.cs`; no archive packages in any csproj |
| Formats it opens (list on the pages) | `README.md` table; `OpenArchive.cs`, `KnownExtensions.cs`; split `.001` via `ConcatenatedReadStream`; SFX search for exe/dll/sfx |
| 30 types in "Open with" | `KnownExtensions.Associated` (counted) |
| Creates ZIP, 7Z, TAR, TAR.GZ, TAR.XZ, never RAR | `ArchiveKind` (Models.cs), `ArchiveWriter.cs`, `THIRD-PARTY-NOTICES.txt` (unRAR restriction) |
| Store (no compression) / Fastest / Balanced / Smallest = 0 / 1 / 5 / 9 | `CreateArchiveDialog.xaml` tags and hints |
| Solid on by default (7Z), "Delete the original files after archiving (they go to the Recycle Bin)" only after success | `CreateArchiveDialog.xaml`, `Jobs.cs` (`FOF_ALLOWUNDO`, only when nothing was skipped) |
| AES-256 for ZIP and 7Z, never ZipCrypto; "Hide file names too" (7Z); ASCII-only ZIP passwords | `ArchiveWriter.cs` (`em=AES256`, `he`), `PasswordProblem` |
| Split: 100 MB, 700 MB (CD), 4 GB (FAT32 USB drive), Custom size…, parts `.001`… | `CreateArchiveDialog.xaml` |
| "Remember it until I close Trove", memory only | `PasswordDialog.xaml(.cs)` |
| Browser: breadcrumb, Back/Up, search (folder and subfolders), Info pane fields, Test | `ArchiveView.xaml(.cs)` |
| Double-click extracts to temp and opens; warns before programs/scripts (quoted text) | `ArchiveView.xaml.cs` (24 extensions; "This is a program or script…") |
| Add/Delete in ZIP, 7Z, TAR; drag in / out | `ArchiveEditor.cs`, `ArchiveView.xaml.cs` |
| Zip slip (`..`, absolute, drive letters, dots/spaces), junctions, no links/ADS, reserved names, long paths | `PathSafety.cs`, `Extractor.cs`, `FileSystem.cs`, `app.manifest` (`longPathAware`) |
| `.part` files moved into place only when 7-Zip reports OK | `Extractor.cs` |
| Conflicts: Replace / Keep both / Skip, "Do this for every conflict" | `ConflictDialog.xaml` |
| Mark of the Web copied (zone 3+), setting on by default | `FileSystem.cs`, `AppSettings.MarkAsDownloaded` |
| Result: "Done, with some problems", "N unsafe items were blocked", "Blocked for safety. …" | `Jobs.cs`, `ProgressWindow.xaml.cs`, `PathSafety.cs` (seen in the screenshots) |
| Right-click menu labels, submenu, Windows 11 "Show more options", labels can't hold file names | `installer/Trove.iss`, `ShellIntegration.cs`, `README.md`, `AGENTS.md` |
| Several selected files → one archive; leader process, named pipe, 350 ms quiet | `Program.cs`, `InstanceManager.cs`, `ArchiveNames.SuggestName` |
| Updates: 10 s after start, then at most once a day; size + SHA-256; silent install and relaunch; UAC for all-users; Update now / Later / Skip this version; Settings › Updates | `UpdateService.cs`, `Updater.cs`, `MainWindow.xaml`, `SettingsWindow.xaml` |
| Only network use is the feed (plus an update the user asked for); user agent `Trove/<version>` | `Updater.cs` (only `HttpClient`), `README.md` |
| Mica on 22H2+, live light/dark and accent, Segoe UI Variable, vector Fluent icons | `FluentWindow.cs`, `Native.cs`, `ThemeManager.cs`, `Theme.xaml`, `Icons.xaml` |
| PROPVARIANT 16 / 24 bytes, no 7-Zip calls on the UI thread, ZIP writer reads after SetOperationResult, tars via a temporary .tar, edits replace on success | `PropVariant.cs`, `AGENTS.md`, `Streams.cs` (`LazyFileStream`), `ArchiveReader.cs`, `ArchiveWriter.cs`, `ArchiveEditor.cs` |

## Claims dropped or changed while checking

- "Every format 7z.dll lists": Trove never auto-detects 16 7z.dll handlers (PE, ELF, MachO, Hash, Base64, …;
  `OpenArchive.cs`), so the pages say "many more of the formats the 7-Zip engine reads".
- The brief's "Store" label is "Store (no compression)" in the app; "Hide file names" is "Hide file names too";
  the custom split option is "Custom size…". The pages use the app's labels.
- Encrypted RAR4 has no test sample (RAR4, RAR5 and encrypted RAR5 do); the pages repeat the README's
  "RAR and RAR5 (including encrypted and multi-part archives)" without claiming per-variant tests.
- The engine's "60 formats" (shown in Settings › About) isn't used as a stat, because of the skipped handlers.
- No claim about how fast Trove is or how it compares with other archivers.

## Screenshots

Every image of Trove is a **real screenshot** of Trove 1.0.0 x64 (`D:\Trove\publish\x64`) on Windows 11 at 150 % scaling,
and every caption says so. How they were made:

- Demo files only, in `C:\Users\Public\Documents\Trove demo` (made with Node and FFmpeg: generated images, random-content
  Office files, plain text). Archives were made with Trove itself: `Trove.exe a …` (Aurora Project.zip, Website
  backup.tar.gz, Holiday photos.7z) and the create dialog (Client files (protected).7z, AES-256 with hidden names).
  "Unexpected attachment.zip" was written byte by byte with three escaping entry names. Nothing escaped: the two
  ordinary files were extracted and the three others blocked.
- Trove's settings (`%APPDATA%\Trove`, which didn't exist before) were written per shot (theme, window size, recent list)
  and deleted afterwards, together with the demo folder. `TROVE_UPDATE_URL` pointed at this repository's
  `public/updates/trove.json`, so **Check now** answered "You're up to date (Trove 1.0.0)." without a network request.
- Input went only to Trove's own windows through UI Automation patterns (value, toggle, selection, invoke, scroll),
  after checking that each window belonged to the Trove process that was started; no keystrokes or clicks were sent.
  Captures used `PrintWindow(PW_RENDERFULLCONTENT)` on Trove's windows, never the screen, cropped to the frame with the
  rounded corners kept transparent. No window was opened while `SHQueryUserNotificationState` reported a full-screen app.
- Stored as lossless PNGs at their captured size (`public/art/trove-*.png`); the pages display them no larger than
  their size at 150 %, on a light gradient "stage".

`trove-cover.jpg` (1672×940) and `trove-social.jpg` (1200×630) place the same screenshots on a gradient background with
`sharp`; the social card adds the logo (`docs/icon.png`) and the title. The cover caption says how it was made. A launch
video with its own cover and social art is being made separately; it can replace these two files under the same names.

## Launch video

The article has a marked JSX comment between "Built on 7-Zip" and "Download" where the launch video section goes. It
isn't rendered until the video exists; the tests check that no empty video section ships.

## Download page

`/trove/` (`src/app/trove/page.tsx`) mirrors `/vibeplayer/`: hero with a real screenshot and the recommended download
(`TroveDownload`, a `'use client'` wrapper around the shared `WindowsDownload`), the three headline numbers, every
installer with checksums, requirements, features, installing and links. It repeats claims from the article and adds
none. Its JSON-LD `SoftwareApplication` (`<site>/trove/#app`) is shared with the article's graph. Both routes are in
`sitemap.ts`, `public/llms.txt` and `scripts/check-export.mjs`, and the blog index lists Trove first.
