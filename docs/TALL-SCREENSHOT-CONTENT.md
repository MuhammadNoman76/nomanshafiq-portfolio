# Tall Screenshot field note: content evidence

Published article: `/blog/tall-screenshot/`. Download page: `/tall-screenshot/`. Date: 19 October 2026. Extension version 1.0.1.
Source: https://github.com/MuhammadNoman76/Tall-Screenshot (`main`). The repository has no LICENSE file, so the pages say
"source on GitHub" and never call it open source.

## Download

One ZIP for Chrome and Edge, published in the repository under `release/` and linked through
`https://github.com/MuhammadNoman76/Tall-Screenshot/raw/refs/heads/main/release/tall-screenshot-1.0.1.zip`, with
`release/SHA256SUMS.txt` beside it. Built by `scripts/package.ps1` (manifest.json, icons/ and src/ only, forward-slash paths).

| File | Bytes | SHA-256 |
|---|---|---|
| tall-screenshot-1.0.1.zip | 51,919 | 63440f5b2526f7b4931023a9a93a7d35c2fb80e7b7f0c66ab1f2986487b1e122 |

The extracted ZIP was loaded in Chrome 155 with Developer mode on: 0 manifest errors, 0 install warnings, 0 runtime errors,
and no permission warnings at install (`chrome.developerPrivate.getExtensionsInfo`).

Chrome Web Store: version 1.0.0 was submitted on 19 October 2026 and is in review (item id `bfmngemdhmceglndhjenllnmgblncnhp`).
The pages say "in review" and don't link to the listing; add the link when it is live. 1.0.1 differs from 1.0.0 in two ways:
the colour picker's shortcut is Alt+Shift+E (Chrome silently drops Alt+Shift+C and Alt+Shift+P, both checked on a fresh
install), and the popup's tool buttons put the shortcut under the label.

## What was tested (19 October 2026, Windows 11)

Automated runs with a test copy of the extension in Chrome 155 and Microsoft Edge 155 (a copy with `<all_urls>` standing in for
the activeTab grant a click gives; the protected-page runs used the unmodified permissions with a real toolbar click through
the DevTools protocol's `Extensions.triggerAction`).

- Full page, 6,444 px test page with a ruler line every 250 px: 1258 × 6444 image in 4.7 s; the rulers at y = 1500, 3250
  and 6000 are at those exact rows. Same at 125% display scaling (1574 × 8058, no seams at the frame boundaries).
- Fixed header, sticky subnav and fixed cookie bar each appear once; the lazy-loaded image is loaded.
- Inner-scroller app page: 1038 × 5329, the scrolling panel only, its sticky bar once.
- Custom length 2 screens: 1258 × 1604 (2 × 802). Visible area: 0.2 s. Esc after 1.4 s: 1258 × 3208.
- Select area with auto-scroll past the bottom edge: 500 × 4917. The capture starts where the drag did (no header over it).
- Editor: drag-crop 409 × 306, typed H = 120, Ctrl+Z, JPG download.
- Colour picker: #E11D48 and #3B82F6 picked exactly (click and Enter), at 100% and 125% scaling.
- Ruler: a 240 × 120 box measured 240 × 120 (crosshair) and a loose drag snapped to 240 × 120; a 96 × 36 button showed
  `button#btn.primary 96 × 36` with Shift; correct in CSS pixels at 125%; still correct after scrolling.
- Chrome's own error log (developer mode on) after 16 flows including cancel, abort, stop, double shortcut, tab switch and
  navigation mid-capture, both tools and protected pages: 0 errors.
- Protected pages with a real click: screenshot allowed and scripts blocked on chromewebstore.google.com, chrome://settings,
  chrome://newtab, chrome://extensions and data: pages; both blocked on view-source: and about:blank; both allowed on the outer
  page of a PDF (which scrolls inside Chrome's viewer). The Developer Dashboard redirects to sign-in in a test profile, so it
  was not tested directly; it is under chrome.google.com/webstore, the same protected class as the store.
- Not tested: Brave, Opera, Arc, macOS, Linux, ChromeOS, Firefox (not supported).

## Images

All real screenshots of Tall Screenshot 1.0.1 in Chrome 155 (headless, `--force-device-scale-factor=1.5`, light theme), made by
a Puppeteer script that runs the extension's own modes on the demo page (a fictional travel magazine, "Field Notes", written
for these pictures; its photos are CSS gradients). Resized to 1600 px wide (the popup at 2x, 680 px; the stitched page at 800 px).

| File | What |
|---|---|
| tall-screenshot-popup.png | The popup, 2x, with eight example recent colours |
| tall-screenshot-select.jpg | Select area mid-drag, label 1120 × 484 |
| tall-screenshot-page.jpg | The extension's own stitched capture of the demo page (1887 × 4903 at 150%) |
| tall-screenshot-editor.jpg | The editor in crop mode, box 1,767 × 810 drawn with the mouse |
| tall-screenshot-color.jpg | The colour picker on the hero's sun, #FDE68A rgb(253, 230, 138) |
| tall-screenshot-ruler.jpg | A loose box snapped to the photo, 712 × 300; with Shift, `h2 712 × 46.2` |
| tall-screenshot-cover.jpg / -social.jpg | Rendered with Remotion in `D:\Work\tall-screenshot-launch-video` (Cover.tsx) from the real popup and the stitched page |

## Launch video

`public/media/tall-screenshot-launch.mp4` (1280 × 720, 87 s, H.264 + AAC 48 kHz, from the 1080p master at −14 LUFS),
`tall-screenshot-launch.en.vtt` (33 cues) and `tall-screenshot-launch-poster.jpg`. Made with Remotion in
`D:\Work\tall-screenshot-launch-video`, narrated (voice "Brian", like the other launch videos), with a music bed and UI sounds.
The page images in it are the extension's own captures of the demo page (`public/shots`, made by the same capture script).
The cursor and the extension's overlays (popup progress, selection, magnifier, ruler lines, crop box) are recreated in React
from the extension's CSS values; the colours and measurements are computed from the captured pixels with copies of the
extension's `edgesAt` and `snapBox` (src/inspect.js). The full-page scroll is shown at one screen per 0.8 s, slower than the
real two a second; the caption says so.

## Claims and where they come from

- Two screenshots a second: Chrome's `MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND`; the extension waits 510 ms (`CAPTURE_GAP`).
- Fixed and sticky rules: `collectFixed` in src/content.js (top-anchored on the first screen, bottom-anchored on the last when
  the capture reaches the page end, 60%-tall ones always; sticky elements set to relative after the first screen).
- 32,000 px: the editor's `MAX_SIDE` (Chrome's canvas limit is 32,767); larger captures are scaled and the editor says so.
- 30,000 px: the default "Max full-page length" setting (src/settings.js).
- Five captures kept: `KEEP_SESSIONS` in src/db.js. Sixteen recent colours: `remember()` in src/inspect.js.
- 11 × 11 magnifier, tolerance 12 per channel, CSS pixels: src/inspect.js.
- Permissions: manifest.json (`activeTab`, `scripting`, `storage`, `contextMenus`; no host permissions, nothing optional).
