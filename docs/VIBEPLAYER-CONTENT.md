# VibePlayer field note: content evidence

Published article: `/blog/vibeplayer/`. Download page: `/vibeplayer/`. Date: 12 October 2026. App version 1.0.1.
Source: https://github.com/MuhammadNoman76/VibePlayer (commit `f881846`, "Builds for every supported Windows version").
The repository has no LICENSE file, so the pages say "source on GitHub" and never call the app open source.

## Downloads

The four installers are published in the VibePlayer repository under `release/` and linked through
`https://github.com/MuhammadNoman76/VibePlayer/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files
to 25 MiB, so the installers are not copied into this site. Each link was checked publicly on 12 October 2026 (HTTP 200,
no sign-in, redirected to raw.githubusercontent.com) and the served `Content-Length` matched the local file. The local
files' SHA-256 values match both the table below and the published `release/SHA256SUMS.txt`.

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | VibePlayer-Setup-1.0.1-x64.exe | 67,079,033 | 48f4a864927f84ab533c3b1ddc6dfb39cf37d44c5114099d2b62ae203ab48961 |
| Windows 10/11 ARM64 | VibePlayer-Setup-1.0.1-arm64.exe | 58,233,813 | cf024120a0a28c3d4349882d69c80528c140c000ce8507df7a731a94ac315f6c |
| Windows 10 32-bit | VibePlayer-Setup-1.0.1-x86.exe | 62,178,964 | be65130e24a448c154caea61f97bca1eca3a173e5bf1773810eadb123f63b705 |
| Windows 7 SP1 / 8.1 | VibePlayer-Setup-1.0.1-win7-8.exe | 45,422,166 | a06c47831dd20c52c8047eacf351eb1e5e4ebed4f0e0cd6278121d62a5f7a26a |

The Windows 10/11 editions are self-contained .NET 10 builds, each carrying only the VLC engine for its processor. The
Windows 7/8.1 edition targets .NET Framework 4.8 (AnyCPU) and carries both VLC engines; setup installs the one matching
Windows. Its installer checks the .NET Framework release key (>= 528040) and offers to open Microsoft's download page if
it is missing (`installer/VibePlayer.iss`, `MinVersion=6.1sp1`). Windows 8 users are told to update to 8.1; XP and Vista
are stated as unsupported. Setup defaults to an all-users install (`PrivilegesRequired=admin`) and offers "only for me"
without admin rights (`PrivilegesRequiredOverridesAllowed=dialog commandline`). Optional tasks: desktop icon, "Open with"
for video and audio files, and "Play with VibePlayer" on the folder right-click menu. The installers are not code-signed.

## What was tested (as reported by the author)

- The x64, 32-bit and Windows 7/8.1 (.NET Framework) builds were run on the author's Windows 11 PC, playing video.
- The Windows 7/8.1 installer was installed and uninstalled silently.
- Not tested: the ARM64 build on ARM hardware, and any build on an actual Windows 7 or 8.1 machine. Both pages say so.
- The ARM64 edition ships without VLC's prebuilt plugin cache (`plugins.dat`), because ARM64 programs cannot run on the
  x64 build PC (`build.ps1`). It scans its plugins at start-up, or writes the cache on first run when installed per-user.

## Claims and where they come from

All in `D:\mediaplayer` (the VibePlayer repository) at the commit above.

| Claim | Source |
|---|---|
| Skip check every 40 ms, "at most a frame or two" | `Views/PlayerView.xaml.cs`, `_skipTimer` (40 ms) and its comment; `CheckSkip()` runs only while playing |
| Won't start inside a marked part | `PlayCurrent()`, "Don't even start inside a skipped part" |
| Typed times: minutes:seconds or hours:minutes:seconds, e.g. 34:05 or 1:02:30 | `Views/SkipRangeDialog.xaml(.cs)` |
| `[` / `]` mark start and end; menu items in the settings and right-click menus | `HandleMediaKey`, `BuildSkipMenu`, `ShowContextMenu` |
| Overlapping or touching parts merge | `AddSkip()` |
| Amber marks, dimmed when skipping is off | `DrawSkipMarks()` (#FFC400 at alpha E6 / 66) |
| "Skip marked parts" on by default, "Skipped" message off by default | `Core/AppSettings.cs` (`SkipEnabled = true`, `ShowSkipNotice` false) |
| Skips stored per file path in `%APPDATA%\VibePlayer\settings.json`; file never changed | `AppSettings.SetSkips/GetSkips`, `DataDirectory`, the dialog's own text |
| Skips only for local files, not streams | `CanEditSkips()` |
| Hold right half (or right mouse button) for 2x, back to the chosen speed on release | `BeginHold/EndHold`, `HoldRate = 2`, `_rate` |
| Single click on the video does nothing; double-click is full screen | `OnSurfaceLeftDown/Up` |
| Wheel over the progress bar or time seeks 5 s; elsewhere volume; Ctrl + wheel or Ctrl + ↑/↓ brightness | `OnRootMouseWheel`, `HandleKeyDown` |
| Settings menu items; snapshots to Pictures\VibePlayer | `BuildSettingsMain`, `TakeSnapshot` |
| Resume "Resumed from … · press 0 to start over" for videos of 2 minutes or more | `PlayCurrent`, `SaveResumePosition` |
| Keyboard shortcut table | `HandleKeyDown`, `HandleMediaKey`, `BuildShortcuts` |
| 47 video and 34 audio file types (81), plus 18 subtitle types | `Core/MediaFormats.cs` (counted; the generated `associations.iss` registers the same 81) |
| Asks when VibePlayer is already playing; "Remember my choice" | `App.xaml.cs`, `Views/InstanceChoiceDialog.xaml` |
| One process per Explorer selection merges into one playlist via named pipes; 3-way settings merge | `Core/InstanceManager.cs`, `AppSettings.MergeFrom` |
| LibVLC 3.0.24 via LibVLCSharp 3.10.1; .NET 10 and .NET Framework 4.8 targets | `VibePlayer.csproj` |
| Controls in a transparent, non-activating overlay window; 32-bit `GetWindowLongPtrW` fix | `Views/OverlayWindow.cs`, `Interop/Native.cs`, commit message of `f881846` |
| About 320 plugin DLLs; plugin cache; exact timestamps | 321 DLLs counted in `publish/x64/libvlc/win-x64/plugins`; `build.ps1`; `TimeStampRounding=0` in the installer |

The brief that started this page said "83 media file types (47 video + 36 audio)". The source lists 34 audio types, so
the pages say 81.

## Figures, demo and video

The figures (`public/art/vibeplayer-cover.jpg`, `-social.jpg`, `-dialog.jpg`, `-jump.jpg`, `-hold.jpg`, `-menu.jpg`) and
the player shots in the launch video are **recreations** of VibePlayer's interface (layout, strings, icons and colours
taken from the app's XAML/C# source) composited with frames from Big Buck Bunny. They are not screenshots, and every
caption says so. The amber "Skipped 2:31 – 3:48" label and arc in the cover and jump figures are illustration (the app's
real "Skipped" message is an optional, off-by-default toast), and the jump figure's caption says so. The white labels in
the hold and menu figures are annotation, and their captions say so. No recreation is used as a `screenshot` in
structured data.

`/blog/vibeplayer/#try` is a web imitation of skip mode (`src/components/VibeSkipDemo.tsx`), labelled "WEB DEMO". It plays
`public/media/vibeplayer-skip-demo.mp4` (20 s, silent, Big Buck Bunny 1:24–1:44) muted and inline, with 0:08–0:13 marked.
While "Skip marked parts" is on, a `requestAnimationFrame` loop seeks past any marked part (the app uses a 40 ms timer),
and the visitor can mark parts with the buttons or `[` / `]`. It autoplays only when scrolled into view and never when the
visitor prefers reduced motion. It stores nothing.

The launch video (`public/media/vibeplayer-launch.mp4`, 1280×720, 74 s, 6.9 MB, H.264/AAC, fast-start) has no burned-in
captions; `vibeplayer-launch.en.vtt` is attached as the default English captions track. Every media file is well under
Cloudflare Pages' 25 MiB limit, and `scripts/check-export.mjs` now fails the build check if any exported file exceeds it.

## Footage licence

Big Buck Bunny © 2008 Blender Foundation (bigbuckbunny.org), licensed CC BY 3.0
(https://creativecommons.org/licenses/by/3.0/). `src/components/FootageCredit.tsx` renders this credit, with links, in
every caption where footage appears (cover, four figures, demo, launch video) and on the download page's hero figure.

VibePlayer uses LibVLC under the LGPL and is not affiliated with or endorsed by VideoLAN; each page says so once.

## Download recommendation

`src/components/WindowsDownload.tsx` is the shared "recommended for this PC" box for PawSip and VibePlayer, extracted from
the original `PawSipDownload`. It runs only in the browser and sends nothing anywhere: it reads the user-agent string
(Windows NT version) and, where available, User-Agent Client Hints (platform version, architecture, bitness). It takes a
function prop, so each app renders it from a small `'use client'` wrapper (`PawSipDownload.tsx`, `VibePlayerDownload.tsx`).
The PawSip pages' rendered HTML was compared before and after the refactor and is identical apart from React's text
separators. Without JavaScript the static page recommends the x64 installer and lists every edition.

## Download page

`/vibeplayer/` (`src/app/vibeplayer/page.tsx`) mirrors `/pawsip/`: hero with the recommended download, the three headline
numbers, every installer with checksums, system requirements, features, installing and links. It repeats claims already
in the article and in this file and adds none. Its JSON-LD is a `SoftwareApplication` with `@id` `<site>/vibeplayer/#app`,
shared with the article's graph (which also has a `BlogPosting` and a `VideoObject` for the launch video). Both routes are
in `sitemap.ts`, `public/llms.txt` and `scripts/check-export.mjs`, and the blog index lists VibePlayer first.
