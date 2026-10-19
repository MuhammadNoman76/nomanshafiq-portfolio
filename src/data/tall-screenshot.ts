export const tallScreenshotArticle = {
  title: 'Tall Screenshot: the whole page, or exactly as much as you want.',
  description: 'Tall Screenshot is a free extension for Chrome and Edge that screenshots a whole web page, a length you choose, or an area you drag past the edge of the screen, with a crop editor, a colour picker and an on-page ruler. Nothing leaves your computer.',
  path: '/blog/tall-screenshot/',
  date: '2026-10-19',
  version: '1.0.1',
  /** When this version was released (the article itself was published on `date`). */
  released: '2026-10-19',
  repoUrl: 'https://github.com/MuhammadNoman76/Tall-Screenshot',
  checksumsUrl: 'https://github.com/MuhammadNoman76/Tall-Screenshot/blob/main/release/SHA256SUMS.txt',
};

/** The standalone download page. Its claims mirror the field note. */
export const downloadPage = {
  title: 'Download Tall Screenshot for Chrome and Edge — full-page and long screenshots',
  description: 'Download Tall Screenshot 1.0.1, a free extension for Chrome and Edge: full-page, custom-length and select-area screenshots with a crop editor, a colour picker and a ruler. Nothing is uploaded.',
  path: '/tall-screenshot/',
};

/** The extension package, published in the Tall-Screenshot repository (release/ on main), verified against the file on GitHub. */
export const extensionZip = {
  file: 'tall-screenshot-1.0.1.zip',
  bytes: 51919,
  sha256: '63440f5b2526f7b4931023a9a93a7d35c2fb80e7b7f0c66ab1f2986487b1e122',
};

export const downloadUrl = `https://github.com/MuhammadNoman76/Tall-Screenshot/raw/refs/heads/main/release/${extensionZip.file}`;

/**
 * The Chrome Web Store listing: version 1.0.0 was submitted on 19 October 2026 and is in review. The pages say so and
 * don't link to the listing until it is live.
 */
export const chromeWebStore = { status: 'in review', submitted: '2026-10-19', version: '1.0.0', itemId: 'bfmngemdhmceglndhjenllnmgblncnhp' } as const;

/** Where it was tested (19 October 2026). */
export const tested = {
  browsers: 'Chrome 155 and Microsoft Edge 155 on Windows 11',
  untested: 'Brave, Opera, Arc and other Chromium browsers, and macOS, Linux and ChromeOS',
};

/** The manifest's commands (Chrome keeps Alt+Shift+C and Alt+Shift+P for itself, so the colour picker is on E). */
export const shortcuts = [
  ['Full page', 'Alt+Shift+F'],
  ['Select area', 'Alt+Shift+S'],
  ['Visible area', 'Alt+Shift+V'],
  ['Pick color', 'Alt+Shift+E'],
  ['Measure', 'None by default. Set one at chrome://extensions/shortcuts'],
] as const;

/** manifest.json permissions: no host permissions, nothing optional. */
export const permissions = [
  ['activeTab', 'Screenshots and runs its tools in the tab you use it on, only after you click its button, press one of its shortcuts or use its right-click menu.'],
  ['scripting', 'Runs its own bundled script in that tab, to scroll the page, draw the selection and show the colour picker and ruler.'],
  ['storage', 'Keeps your settings and your last 16 colours in the browser.'],
  ['contextMenus', 'Adds its entries to the right-click menu.'],
] as const;

/** What works on the pages Chrome protects from every extension (tested with a real toolbar click, 19 October 2026). */
export const protectedPages = [
  ['Ordinary websites', 'Everything.'],
  ['PDFs', 'Visible area, select area and both tools. A PDF scrolls inside Chrome’s own viewer, which extensions can’t control, so Full page captures the visible part and says so.'],
  ['The Chrome Web Store, chrome:// pages, the new tab page, data: pages', 'Visible area only. Full page, select area and custom length capture the visible part instead, and the editor says why. The tools can’t run.'],
  ['view-source: pages and blank tabs', 'Nothing: Chrome blocks screenshots there too.'],
] as const;

/** The stitching test: a 6,444 px test page with a ruler line every 250 px, at 100% and 125% Windows scaling. */
export const stitchTest = { pageHeight: 6444, seconds: 4.7 };

/** The launch video (no burned-in captions; English WebVTT track alongside). */
export const launchVideo = {
  src: '/media/tall-screenshot-launch.mp4',
  captions: '/media/tall-screenshot-launch.en.vtt',
  poster: '/media/tall-screenshot-launch-poster.jpg',
  width: 1280,
  height: 720,
  duration: 'PT1M27S',
  uploadDate: '2026-10-19',
};

export const formatKB = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
