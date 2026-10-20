# MakeItColor field note: content evidence

Published article: `/blog/makeitcolor/`. Download page: `/makeitcolor/`. Date: 20 October 2026. App version 1.0.0, released
20 October 2026. Source: https://github.com/MuhammadNoman76/make-it-color (`main`; local copy `D:\MakeItColor`).
The repository has no LICENSE file, so the pages say "source on GitHub" and never call the app open source.
Name: MakeItColor (one word). Prose uses British "colour", as the app does; the saved file names keep the app's
`name (color).png` / `name (color).mp4`.

## Downloads

Two installers, published as assets of the GitHub release `v1.0.0` (not files in the repository: the x64 installer is
over GitHub's 100 MB limit for repository files), linked through
`https://github.com/MuhammadNoman76/make-it-color/releases/download/v1.0.0/<file>`, with `SHA256SUMS.txt` beside them
(release page https://github.com/MuhammadNoman76/make-it-color/releases/tag/v1.0.0). There is no 32-bit or Windows 7/8.1
build: both models run through Windows ML, which exists only for 64-bit Windows 10 (1903+) and 11
(`installer/MakeItColor.iss`: `MinVersion=10.0.18362`, x64 and ARM64 only). The download picker therefore gets a
`requirement` and shows it on PCs without a matching installer.

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | MakeItColor-Setup-1.0.0-x64.exe | 111,640,097 | 3a0d2efe03bda5308c47eb61757eb25fbfef43eeb5b92ae20ced75de4992a58d |
| Windows 10/11 ARM64 | MakeItColor-Setup-1.0.0-arm64.exe | 93,063,064 | 4e50f36eea792a901de4cb372d9c4d76456f30c9337f5a67e8e0d82a3171247a |

Checked on 20 October 2026: the files in `D:\MakeItColor\dist` have these sizes and hashes (`sha256sum`), the release's
`SHA256SUMS.txt` lists the same hashes, and both release links answer 200 with these exact `Content-Length`s.

Identity (`src/MakeItColor/Core/AppInfo.cs`): app id `MakeItColor`, update feed
`https://www.nomanshafiq.com/updates/makeitcolor.json` (`MAKEITCOLOR_UPDATE_URL` overrides it); `Updater` rejects a feed
whose `app` isn't `MakeItColor`. Inno AppId `{2359B1AF-53A7-4F1C-8168-65B4042B82F4}`. Installs for all users (admin) or
only for the current user (`PrivilegesRequiredOverridesAllowed=dialog commandline`). Not code-signed. Uninstalling deletes
`%LOCALAPPDATA%\MakeItColor` (models and the NPU compile cache, `[UninstallDelete]`); settings stay in `%APPDATA%\MakeItColor`.

## Update feed

`public/updates/makeitcolor.json`, the same format as `vibevideo-ai.json` (`app`, `version`, `released`, three `notes`,
`page`, and `editions.x64` / `editions.arm64` with `url`, `sha256`, `size`). `tests/makeitcolor.test.mjs` checks it against
`src/data/makeitcolor.ts`, and `scripts/check-export.mjs` checks it in the export. The app reads it 10 s after start and then
every 24 h at most (`Core/UpdateService.cs`: `FirstCheckDelay`, `CheckInterval`); Update now downloads the installer to
`%TEMP%\MakeItColor-Update`, checks size and SHA-256, runs it silently with `/RELAUNCH=1` and the app restarts. The check
can be turned off in Settings › Updates.

## Claims and where they come from

All in `src/MakeItColor/` of the make-it-color repository, and its README and `docs/QUALITY.md`.

- Formats in: photos JPEG, PNG, TIFF, BMP, GIF, WebP, HEIC/HEIF (needs Microsoft's HEIF Image Extensions), JPEG XR; videos
  MP4, MOV, MKV, AVI, WMV, WebM, MPEG, M2TS/TS, FLV, 3GP, OGV, VOB, MXF (README).
- Colour model at 512 × 512 on the lightness (L of CIE Lab), predicting a/b; a/b enlarged bilinearly to full size and lined up
  with a guided filter steered by L, then combined with the full-size L (`Core/Colorizer.cs`, `Core/ColorMath.cs`, README
  "How it works").
- Colour strength 0.5 to 1.5 (`Core/Settings.cs` `Vividness`, clamped); Reset; before/after divider with arrow keys
  (`Controls/CompareView.cs`).
- Save as PNG (lossless) or JPEG quality 95 (`Core/PictureIO.cs`, `QualityLevel = 95`); new file `name (color).png`.
- Fix brightness and contrast: darkest and brightest 0.5 % (`Percentile(…, 0.005)` / `0.995`) stretched toward 4 and 250,
  at most 1.8× (`MaxGain = 1.8`), never less contrast; in videos the 3 frames before and after in the same shot (`Radius = 3`)
  (`Core/Tone.cs`).
- Enhancer: Real-ESRGAN compact general model (realesr-general-x4v3 blended 50/50 with the weak-denoise model), 256 × 256
  tiles overlapping by 24 px (`Core/Enhancer.cs`, `Pad = 24`; `Core/Ai/EnhanceModel.cs`); tiles match the whole picture
  at once to 87 dB (README). Auto size: photos under 2000 px (`PhotoPrep.AutoTarget = 2000`) 2× or 4× larger; at most 24
  megapixels (`MaxOutputPixels = 24e6`).
- The colour model never sees the enhancer's output (README "How it works", step 2). In a first version it did, and the
  colours changed (a bluish patch on rocks, a red patch on a title card); see `docs/QUALITY.md`.
- Video: H.264 MP4 at the original size and frame rate with the original sound, next to the original or in Videos if that
  folder is read-only; Stop any time (`Core/Video/VideoJob.cs`). Full clean-up on a copy of at most 800 px
  (`EnhanceWorkSize = 800`), detail kept steady where nothing moves (`Core/Video/SteadyDetail.cs`); Light; Auto = Full on an
  NPU or GPU, Light on the CPU. Steady colours (`Core/Video/SteadyColors.cs`); a cut starts fresh.
- Chips: Windows ML, NPU first, then the best GPU, then the CPU; each chip checked with a known test picture against the
  float32 CPU result and skipped if wrong; in Auto the colour model prefers the NPU and the enhancer the GPU
  (`Core/Ai/Hardware.cs`, `Core/Ai/EnhanceModel.cs`).
- Models (`Core/Ai/ModelStore.cs`): colour model float16 456,392,880 bytes (NPU/GPU), float32 912,062,353 bytes (CPU),
  downloaded on first use and SHA-256 checked; the enhancer (2.4 MB and 4.9 MB) ships with the app. The pages show the
  colour model as 456.4 MB / 912.1 MB (decimal MB, like the rest of the site) and "about 1 GB free".

## Measured figures (the author's laptop: Intel Core Ultra 5 135U, Intel AI Boost NPU, Intel Graphics, Windows 11)

From the README and `docs/QUALITY.md`.

| What | Chip | Figure |
|---|---|---|
| Colour model, one 512 × 512 run | NPU (OpenVINO, float16) | 0.41–0.42 s |
| | GPU (OpenVINO, float16) | 0.51–0.54 s |
| | GPU (DirectML, float16) | 0.77 s |
| | CPU (float32) | 1.8–2.4 s |
| Enhancer, one 256 × 256 tile | GPU | 66–75 ms |
| | NPU (while it was also colouring) | 131 ms |
| | CPU | 1.0 s |

- A 1500 × 1000 photo enhanced to 3000 × 2000 and coloured: about 3 s with the enhancer on the GPU (35 tiles), about 50 s on
  the CPU alone.
- Video, 1280 × 720 film at 25 fps: about 1.5 frames a second with Full clean-up, 2.2 with Light. The whole 2:56 song (4,400
  frames) with Full clean-up: 59 minutes, while other tests ran on the same laptop.
- First NPU load: about 4–5 minutes to compile the colour model, about 15 s for the enhancer; in Auto the app starts on the
  GPU and switches when the NPU is ready. Later loads take a few seconds.
- The blog card and the "at a glance" figure use 0.42 s (the upper end of the NPU range).

## Correctness evidence (`docs/QUALITY.md`)

- The app's colour maths against the Python reference (`tools/model/pipeline.py`): CPU 88–100 dB (largest difference 1/255),
  NPU 51–57 dB, GPU 54–58 dB.
- Changes from ModelScope's DDColor pipeline, on the 24 Kodak images (gray versions coloured and compared with the real
  colours): PSNR 21.23 → 21.92 dB, ΔE 18.71 → 17.61. The changes: antialiased shrink to 512, bilinear colour enlargement
  instead of nearest neighbour, the guided filter.
- Steady colours, 600-frame test clip, colour flicker (mean |Δa| + |Δb| on unchanged pixels): 5.40 without, 2.76 with
  (the pages say "halved").
- Enhancer shimmer, 100 frames of the film (frame-to-frame lightness change on static pixels): coloured without clean-up
  0.70; Full without steady detail 0.89; Full with steady detail 0.81.
- Bugs found: DirectML gave wrong colours (check difference 15) because of one ONNX Runtime graph fusion (MatMul + Add →
  Gemm), now off for DirectML; float16 overflowed on GPUs in ConvNeXt's LayerNorm (values up to about 2 × 10^7 against
  float16's 65,504), fixed by exporting it as one LayerNormalization operator; a mixed float16/float32 file broke the NPU, so
  the shipped file is pure float16.
- Doraha clean-up: FFmpeg's denoisers (atadenoise 1 ms, fftdnoiz 74 ms, nlmeans 180 ms a frame; hqdn3d is GPL and not in the
  LGPL build) changed almost nothing, because the transfer's problem is blur and compression blocks, not grain. Working
  size 800 px chosen after comparing 960 (clean but soft) and 640 (sharpest but painted faces).

## Limits stated on the pages

- Colours are the model's best guess, not a record: skies, skin and grass usually right; clothes, cars and painted walls a
  guess (README).
- A dark shot of the heroine in Doraha came out with a purple cast.
- In Doraha, as the car drives toward the camera (0:13–0:17), the colour model's guess for its paint drifts from silver-pink
  to maroon within one shot. Steady colours keeps colours only where the picture doesn't change, so moving things can
  shift colour.
- At 4× fine textures (rocks, leaves) can look slightly painted (README).
- Untested: ARM64 hardware (Snapdragon X), AMD and Qualcomm NPUs, NVIDIA and AMD graphics cards, Windows 10 itself (built
  for 1903+, run only on Windows 11).

## Images

All copied from `D:\MakeItColor\.work\web-art\`. The app images are real screenshots: `MakeItColor.exe --capture
photo|settings out.png [--input …] [--theme light|dark] [--size …]` opens the window far off-screen (not activated, not in
the taskbar), puts it in a state, renders it to a PNG with the app's own interface code and closes it
(`src/MakeItColor/Views/Capture.cs`). The comparison pictures are real output of the app. None of them is a recreation.

| File | Size | What |
|---|---|---|
| makeitcolor-cover.jpg | 1672 × 940 | A Doraha frame: left 30 % the original, right MakeItColor's colour + enhanced output; "Original" / "MakeItColor" labels and the name and line "Old photos and films, in colour and restored. On your own PC." added for the cover (its caption says so). Shown whole (no type overlay), since the name is in the picture. |
| makeitcolor-social.jpg | 1200 × 630 | The same, for Open Graph / Twitter. |
| makeitcolor-app.jpg | 1600 × 973 | Real screenshot, dark theme: colouring and enhancing a 600 px copy of "Kissing the War Goodbye"; "Done in 9.3 s on the NPU · enhanced · 600 × 618 → 2400 × 2472". |
| makeitcolor-app-light.jpg | 1600 × 973 | Real screenshot, light theme (download page); "Done in 10.1 s on the NPU …". |
| makeitcolor-settings.jpg | 900 × 917 | Real screenshot of Settings (Colouring, Enhancing, Saving). |
| makeitcolor-restore.jpg | 1612 × 600 | Duck and Cover title card: faded gray original vs. MakeItColor (brightness fixed, enhanced 4×, coloured). |
| makeitcolor-enhance.jpg | 1612 × 450 | Faces from a 600 px copy of the 1945 photo: coloured without the enhancer and enlarged 4× (bicubic) vs. MakeItColor's enhanced 4×. |
| makeitcolor-film.jpg | 1598 × 476 | A Doraha frame: coloured only vs. coloured + Full clean-up. |
| makeitcolor-doraha.jpg | 1612 × 450 | The same frame: original black and white vs. MakeItColor (colour + Full clean-up). |
| makeitcolor-strength.jpg | 1878 × 520 | The 1945 photo at colour strength 60 %, 100 %, 140 %. |

## Footage and credits

- Doraha (1967), the song "Tumhain Kaisay Bata Dun", sung by Ahmad Rushdi: short excerpts (a VHS-era YouTube transfer,
  1280 × 720, with a channel logo and an address ticker). Not claimed to be in the public domain.
- Duck and Cover (1951, U.S. Federal Civil Defense Administration), public domain: https://archive.org/details/DuckandC1951
- "Kissing the War Goodbye" (1945, Victor Jorgensen, U.S. Navy), public domain:
  https://commons.wikimedia.org/wiki/File:Kissing_the_War_Goodbye.jpg
- Colour model DDColor (Kang et al., ICCV 2023; Apache 2.0) via the MakeItColor model on Hugging Face
  (https://huggingface.co/muhammadnoman76/makeitcolor); enhancer Real-ESRGAN (Xintao Wang et al., BSD 3-Clause), network
  from BasicSR (Apache 2.0); Windows ML / ONNX Runtime (MIT); FFmpeg (LGPL 2.1, unmodified BtbN build). MakeItColor is not
  affiliated with the DDColor or Real-ESRGAN authors.

## Launch video

`public/media/makeitcolor-launch.mp4` (1280 × 720, H.264 + AAC, about 71 s; `duration: 'PT1M11S'`, uploadDate 2026-10-20),
`public/media/makeitcolor-launch.en.vtt` (English captions) and `public/media/makeitcolor-launch-poster.jpg` (1280 × 720),
added by the author. The field note embeds it like the Tall Screenshot note (captions on by default); the download pages
don't embed launch videos. Its caption on the page only says what it is ("The MakeItColor launch video (1:11), with English
captions."); if the video recreates any of the app's interface, say so in that caption, as the other notes do.
