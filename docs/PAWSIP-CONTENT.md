# PawSip field note: content evidence

Published article: `/blog/pawsip/`. Date: 12 October 2026. App version 1.0.1. Source: https://github.com/MuhammadNoman76/PawSip (commit `9658535`).

## Downloads

The four installers are published in the PawSip repository under `release/` and linked from the article through
`https://github.com/MuhammadNoman76/PawSip/raw/refs/heads/main/release/<file>`. Cloudflare Pages limits single files to
25 MiB, so the installers are not copied into this site. Each link was checked publicly (HTTP 200, no sign-in) and the
served size matched the local file.

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | PawSip-Setup-1.0.1-x64.exe | 50,848,601 | 266c3d69deb5ebd53e47105585e4b20be3280061b66e608ff79a7d9a7e24a1cf |
| Windows 10/11 ARM64 | PawSip-Setup-1.0.1-arm64.exe | 44,687,086 | e1b73e95c7625df8c5c276f8d3c04b56e36500b7fe0f51499d25f2554a514551 |
| Windows 10 32-bit | PawSip-Setup-1.0.1-x86.exe | 46,259,558 | 1b2c59697232d9a4f972314b021a43115b1e8d8d58923091113c301b70718896 |
| Windows 7 SP1 / 8.1 | PawSip-Setup-1.0.1-win7-8.exe | 2,592,021 | 52d8c0345a13cc806e58829c8dcdcabe1cde9565ff9dc851108179186e5a55f6 |

Windows 10/11 editions are self-contained .NET 10 builds; the Windows 7/8.1 edition targets .NET Framework 4.8, whose
installer checks the framework's registry release key (>= 528040) and links to Microsoft's download page if missing.
.NET Framework 4.8 does not support Windows 8.0, so the article tells Windows 8 users to update to 8.1 first. Windows XP
and Vista are stated as unsupported.

## What was tested

- The PE machine type of each build was checked: x64, ARM64 and x86 binaries match their editions; the .NET Framework
  edition is AnyCPU IL.
- The x64, x86 and .NET Framework editions were run on the author's Windows 11 PC with the desktop widget visible and no
  errors logged. The x86 run found and fixed a 32-bit-only bug (GetWindowLongPtrW is not exported by 32-bit user32).
- The Windows 7/8.1 installer was installed silently, launched and uninstalled; uninstall removed the files, the process
  and the startup entry.
- Not tested: the ARM64 build on ARM hardware and any build on an actual Windows 7 or 8.1 machine. The article says so.

## Figures in the article

Measured on the author's Windows 11 PC: 66 MB working set and 0.5% average CPU over 45 seconds with the desktop cat on
screen and the main window closed; about 25 MB tray-only; 18 MB for the .NET Framework edition shortly after start. These
are single local measurements, not benchmarks across devices.

Reminder behaviour described (presence = display on, session unlocked, input within 5 minutes; fullscreen deferral;
15-minute repeat until a drink; pacing factors 0.65–1.5; rest after the goal) matches `src/PawSip/Core/ReminderScheduler.cs`
and `src/PawSip/Interop/Presence.cs` at the commit above.

## Artwork

`public/art/pawsip-cover.png` (1671×940) and `pawsip-social.jpg` (1200×630) were rendered from the app's own WPF vector
cat (`CatView.xaml`) in a local render harness. `pawsip-moods.png` is the same harness's mood sheet. `pawsip-dashboard.png`
is a real screenshot of the app. The interactive cat on the page (`src/components/PawSipCat.tsx`) is an SVG port of the same
vector paths, animated with CSS and disabled for reduced motion.

## Download recommendation

`src/components/PawSipDownload.tsx` runs only in the browser and sends nothing anywhere. It reads the user-agent string
(Windows NT version) and, where available, User-Agent Client Hints (platform version for Windows 10 vs 11, architecture and
bitness). Without JavaScript the static page recommends the x64 installer and lists every edition.

## Download page

`/pawsip/` (`src/app/pawsip/page.tsx`) is a standalone "Download PawSip for Windows" page for sharing. It reuses the
article's data and components: the browser-side recommendation (`PawSipDownload`), the interactive cat (`PawSipCat`), the
editions table built from `editions`, and the SHA-256 checksums. Its system requirements, feature list, installing notes
and the note on what was not tested repeat claims already in the article and in this file; it adds no new facts. Its
JSON-LD is a `SoftwareApplication` with `@id` `<site>/pawsip/#app`, and the article's `SoftwareApplication` node uses the
same `@id`, so both pages describe one app. The page is linked from the article (download section and its links list),
the PawSip feature on `/blog/`, `sitemap.ts`, `public/llms.txt`, and checked by `scripts/check-export.mjs`.

## Version 1.0.2 and the update feed

Released 13 October 2026 (PawSip commit `e0c2f1f`). The pages and `public/updates/pawsip.json` now offer these installers:

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | PawSip-Setup-1.0.2-x64.exe | 50,865,639 | e1c19dbc46b2d7d1daf834ef02809fddba9db734765c8734e881a6045bf2a7ab |
| Windows 10/11 ARM64 | PawSip-Setup-1.0.2-arm64.exe | 44,706,867 | be9f71f81089f409730cc2181a777b4992fa3704bb6c1b7acd6d7d60c597a09f |
| Windows 10 32-bit | PawSip-Setup-1.0.2-x86.exe | 46,277,685 | cad7716239c96e3c2216a6f80aab747d360a48bca17d15fdddc7f3188e9e397c |
| Windows 7 SP1 / 8.1 | PawSip-Setup-1.0.2-win7-8.exe | 2,605,368 | 46b406b2142442ba47a0c247b401a720d1870b14c97800b86fc0dd3f56212c52 |

The update claims ("about 30 seconds after it starts, then at most once a day", dashboard card or tray notification that
waits during fullscreen, size and SHA-256 check, silent per-user install, back in the tray, Settings › Updates) match
`src/PawSip/Core/Updater.cs`, `src/PawSip/App.Updates.cs` and `installer/PawSip.iss` at that commit. `PawSip/<version>` is
the request's user agent; nothing else is sent. `tests/pawsip.test.mjs` keeps the feed's version, links, sizes and
SHA-256 equal to `src/data/pawsip.ts`, and `scripts/check-export.mjs` checks the exported feed.

Tested on the author's PC: the updater code (version comparison, feed parsing, size and hash mismatches refused and
deleted, HTTPS-only links) under .NET 10 and .NET Framework 4.8, and an end-to-end update of a side-by-side test copy of
the x64 edition from a local feed (download, verification, silent install, removal of an obsolete file, relaunch). Not
tested: an update through the live feed (the first one will be 1.0.2 to a later version), and the in-app card on a
running copy, because the author's own PawSip was running.
