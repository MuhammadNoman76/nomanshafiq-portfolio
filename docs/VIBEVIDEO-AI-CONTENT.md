# VibeVideo AI field note: content evidence

Published article: `/blog/vibevideo-ai/`. Download page: `/vibevideo-ai/`. Date: 18 October 2026. App version 0.1.0 (preview).
Source: https://github.com/MuhammadNoman76/vibeplayer-ai (`main`; built from VibePlayer's code, developed locally on VibePlayer's
`vibevideo-ai` branch before it got its own repository).
The repository has no LICENSE file, so the pages say "source on GitHub" and never call the app open source.

## Downloads

Two installers, published in the vibeplayer-ai repository under `release/` and linked through
`https://github.com/MuhammadNoman76/vibeplayer-ai/raw/refs/heads/main/release/<file>`, with
`release/VibeVideoAI-SHA256SUMS.txt` beside them. There is no 32-bit or Windows 7/8.1 build: the AI runs through Windows ML,
which exists only for 64-bit Windows 10 (1903+) and 11 (`AiEngine.IsSupported`, `installer/VibeVideoAI.iss` `MinVersion=10.0.18362`,
x64 and ARM64 only). The download picker therefore gets a `requirement` and shows it on PCs without a matching installer.

| Edition | File | Bytes | SHA-256 |
|---|---|---|---|
| Windows 10/11 x64 | VibeVideoAI-Setup-0.1.0-x64.exe | 86,821,647 | 51732bc6d96efc448c60c3bf63ce61de1c1b3918d828b86362e68ca217fb8c19 |
| Windows 10/11 ARM64 | VibeVideoAI-Setup-0.1.0-arm64.exe | 78,144,183 | 2027fcfbedb68a398ba3e1b78ec0a0e4d6bbbb4e272c5d85ee34b3e0a5642197 |

Built by `build-ai.ps1` on 18 October 2026 (with Scenes to skip); the values match `release/VibeVideoAI-SHA256SUMS.txt`.

Separate identity (`Core/AppInfo.cs`): exe `VibeVideoAI.exe`, Inno AppId `{B7F3D2A1-6C4E-4F8B-9A15-3E2D7C9F0B64}` (VibePlayer's
is different, so it installs beside VibePlayer), settings in `%APPDATA%\VibeVideoAI`, models/scans/cache in
`%LOCALAPPDATA%\VibeVideoAI` (deleted on uninstall by `[UninstallDelete]`). Update feed
`https://www.nomanshafiq.com/updates/vibevideo-ai.json`; `Updater.ParseManifest` rejects a feed whose `app` isn't `VibeVideoAI`.

## What was tested

On the author's Windows 11 laptop, 18 October 2026, with the x64 installer above:
- Silent per-user install into a scratch folder (`/VERYSILENT /CURRENTUSER /DIR=… /TASKS=""`): exit 0, uninstall entry under
  the VibeVideo AI AppId, file version 0.1.0.
- Headless scans from the installed copy (`VibeVideoAI.exe --ai-scan test-reel.mp4 --ai-processor npu|gpu|cpu --ai-no-nudenet`),
  starting with no models: the first scan downloaded the 16-bit CLIP model (shown as 168 MB, i.e. MiB) and checked it, prepared
  it for the NPU in about 17 s, and scanned. The first scan after installing spent about 30 s before the first picture (later
  runs: 0.1 s); probably Windows scanning the freshly installed files, not reproduced afterwards. The CPU run downloaded the
  32-bit model. Every run, on every chip, found the same scene at Medium (0:59.5-1:19.5, kissing).
- Silent uninstall: exit 0; program folder, uninstall entry and `%LOCALAPPDATA%\VibeVideoAI` removed; `%APPDATA%\VibeVideoAI`
  kept; no registry keys or shortcuts left. The author's app data was backed up first and restored exactly afterwards.
- Not tested: the ARM64 installer (no ARM hardware), all-users installation, the updater against the live feed (it parses the
  same format as VibePlayer's, which was tested), AMD/Qualcomm NPUs, discrete GPUs, Windows 10.

## Measured speeds (author's laptop: Intel Core Ultra 5 135U, 16 GB, Windows 11)

The installed 0.1.0 build, test reel (2:19, 640x480), extra nudity detector off. `speedX` = video seconds scanned per second;
ms = average time to score one picture. Shown on the article rounded (36x/13 ms, 21x/23 ms, 11x/44 ms).

| Chip | Device (as the app reports it) | Runs (speedX, ms per picture) |
|---|---|---|
| NPU | NPU (Intel(R) AI Boost), OpenVINO through Windows ML | 35.92 / 12.9; 36.88 / 13.38 |
| GPU | GPU (Intel(R) Graphics), DirectML | 20.91 / 23.29 |
| CPU | CPU (Intel(R) Core(TM) Ultra 5 135U), 32-bit model | 10.82 / 45.17; 11.33 / 44.04 |

- Full HD: a 2-minute 1080p H.264 clip (24 fps) scanned on the NPU at 16.8x (detector off) and 17.8x (on) with the build of
  18 October 2026, and at 18.2x and 18.6x (off) with the installed 0.1.0. The pages say "about 17x" (the lowest run, rounded).
  Decoding, not the model, limits it; the pages say "about 17x" and "a two-hour film in about seven minutes" (120 / 17 = 7.1).
- First NPU use: "Preparing the scene model (CLIP) for the NPU" took 14-17 s in the logged runs; the status line says "the first
  time can take a minute", so the pages say "can take up to a minute".

## Claims and where they come from

All in the vibeplayer-ai repository (`src/VibePlayer/`).

- Two pictures per second, 320 px short side: `Core/Ai/FrameGrabber.cs` (`SampleIntervalMs = 500`, `ShortSide = 320`).
- Scan starts at the playback position, jumps when the viewer seeks far ahead (more than 90 s past the scan), then fills the rest;
  progress saved every 20 s: `Core/Ai/SceneScanner.cs`.
- 46 descriptions (4 kiss, 5 sex, 3 nudity, 34 ordinary), score = softmax share: `tools/ai/embed_prompts.py`,
  `Assets/ai-prompts.json`, `Core/Ai/Onnx/OnnxSceneAnalyzer.cs`.
- Thresholds (kiss / sex / CLIP nudity / NudeNet): Low 0.70/0.65/0.75/0.60, Medium 0.50/0.45/0.60/0.45, High 0.35/0.30/0.45/0.32;
  two hot frames or one at 1.35x the threshold; padding 2 s before, 1.5 s after; snap to cuts within 4 s: `Core/Ai/SceneFinder.cs`.
- Menu labels and behaviour (Skip scenes the AI finds, Nudity and sex, Kissing, Sensitivity, Scan videos when they open, Processor,
  Extra nudity detector (NudeNet), Don't skip / Skip it, the tip note, "Changing this doesn't need a new scan"): `Views/PlayerView.Ai.cs`.
  Defaults: `Core/AppSettings.cs` (filter, both kinds and auto-scan on; Medium; Auto; NudeNet off).
- Marks dim when the filter is off (alpha 0x66): `PlayerView.xaml.cs` `DrawSkipMarks`. "Skipped a scene (AI filter)" is always shown
  on an AI skip: `PlayerView.xaml.cs`.
- Hardware order NPU, best GPU, CPU through Windows ML's execution-provider catalog: `Core/Ai/Onnx/AiHardware.cs`.
- Models, sizes and SHA-256 checks (CLIP fp16 176,080,659 bytes; fp32 351,685,709; NudeNet wheel 10,595,223): `Core/Ai/Onnx/ModelStore.cs`.
- Scan cache keyed by path + size + modified time: `Core/Ai/SceneScan.cs`.
- Streams and audio files aren't scanned: `PlayerView.Ai.cs` `AiCanScan`.

## The test reel and the real scan

`test-reel.mp4` (2:19, 640x480): Duck and Cover (1951, U.S. Federal Civil Defense Administration, archive.org `DuckandC1951`)
30-90 s, The Kiss (1896, Edison, archive.org `the-kiss-1896`), "Kissing the War Goodbye" (1945, Victor Jorgensen, U.S. Navy,
Wikimedia Commons) as an 8-second still, Duck and Cover 200-260 s. All public domain.

Scan by the 0.1.0 build on the NPU (18 October 2026, 279 samples, 35.5x, 13.6 ms per picture):
- Low and Medium: one scene, 0:59.5-1:19.5, Kissing. High: also 0:15.0-0:20.5 as Nudity/sex (Duck and Cover; a false positive,
  quoted on both pages).
- Frame scores shown in the article figure and the video (kiss share, nearest sample): 0:33 0.003, 0:52 0.18, 1:02 0.933,
  1:06 0.808, 1:14 0.988, 1:24 0.004.

## Scene control ("Scenes to skip")

Added before the first release (same version, 0.1.0): `Views/ScenesDialog.xaml(.cs)`, `Views/PlayerView.Scenes.cs`.
- One list of the AI's scenes (pink) and the user's own skips (amber), with times, length and status, and a count at the top
  ("2 scenes skipped · 31 s in total · 1 kept").
- For a selected scene: Starts at / Ends at with −1 s and +1 s (1000 ms steps) or typed times; Watch it once (seeks 3 s before
  the start and plays without skipping until playback passes the end); Don't skip / Skip it for AI scenes; Back to the AI's
  times for an AI scene whose edges were moved; Remove for the user's own scenes. Add a scene starts at the playback position
  and runs 30 s. A scene must be at least half a second long; ends are clamped to the video's length.
- Opened from Settings › AI scene filter › Scenes to skip…, Settings › Skip scenes › Scenes to skip…, and the right-click menu.
- Moved edges are stored in the file's scan cache as (AI start, AI end, new start, new end) and matched to the AI's scene by
  overlap (at least half of the shorter); "don't skip" and moved edges are now also kept when the scan was made with other
  models (switching NudeNet). A console test against the real classes and the reel's real samples checked: the edit applies,
  survives Low and High sensitivity and a restart, "don't skip" still matches an edited scene, ends clamp to the length, the
  choices save and load, and both "back to the AI's times" paths clear the edit (12 checks, all passed).
- `public/art/vibevideo-ai-scenes.png` is a real screenshot: `VibeVideoAI.exe --capture-scenes out.png` renders the window
  off-screen with example scenes for the test reel (`Views/ScenesCapture.cs`), at 2x. Its caption says the scenes are examples.
- The rebuilt x64 installer was installed per-user again, ran the capture and an NPU scan of the reel (35.8x, the same scene),
  and uninstalled cleanly. The window itself was not clicked through on screen (the author's PC was in use); its logic was
  tested as above.

## Images and video

Recreations of the app's interface (from `PlayerView.xaml`, `PlayerView.Ai.cs` and the icons), rendered with Remotion in
`D:\Work\vibevideo-ai-launch-video` on frames of the test reel; every caption says they are recreations. The launch video (1:18,
narrated, English WebVTT) opens with a Big Buck Bunny shot (credited, CC BY 3.0). Its scan pace on screen is sped up (the real
scan of the reel took about 4 s of scoring); the 35x in the pill is the reel's real speed, and the narration's "about seventeen
times" is the full-HD figure.
