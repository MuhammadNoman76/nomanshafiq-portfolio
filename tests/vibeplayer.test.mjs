import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/vibeplayer.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/vibeplayer/page.tsx');
const downloadPage = read('src/app/vibeplayer/page.tsx');
const demo = read('src/components/VibeSkipDemo.tsx');

test('VibePlayer downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.2');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `VibePlayer-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [67086880, 58238617, 62186392, 45430512], 'sizes match the published installers');
  assert.match(data, /title: "VibePlayer: skip the scenes you don't want to see\."/);
});

test('downloads point at the published VibePlayer repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/VibePlayer\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/VibePlayer\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('both desktop apps share one Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.match(picker, /export function WindowsDownload\(\{ appName, version, editions, downloadUrl \}/);
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer/, 'no app names baked into the shared picker');
  for (const [file, app] of [['src/components/PawSipDownload.tsx', 'PawSip'], ['src/components/VibePlayerDownload.tsx', 'VibePlayer']]) {
    const wrapper = read(file);
    assert.match(wrapper, /^'use client';/, `${file} is the client boundary`);
    assert.match(wrapper, new RegExp(`<WindowsDownload appName="${app}" version=\\{\\w+Article\\.version\\} editions=\\{editions\\} downloadUrl=\\{downloadUrl\\}/>`));
  }
});

test('the VibePlayer field note is published, linked and has its media', () => {
  assert.match(article, /<VibePlayerDownload\/>/);
  assert.match(article, /<VibeSkipDemo\/>/);
  assert.match(article, /editions\.map/);
  for (const id of ['idea', 'skip', 'try', 'player', 'engine', 'video', 'download', 'next']) assert.match(article, new RegExp(`id="${id}"`), id);
  for (const art of ['vibeplayer-cover.jpg', 'vibeplayer-social.jpg', 'vibeplayer-dialog.jpg', 'vibeplayer-jump.jpg', 'vibeplayer-hold.jpg', 'vibeplayer-menu.jpg']) {
    assert.ok(exists(`public/art/${art}`), `public/art/${art}`);
  }
  for (const media of ['vibeplayer-launch.mp4', 'vibeplayer-launch.en.vtt', 'vibeplayer-launch-poster.jpg', 'vibeplayer-skip-demo.mp4', 'vibeplayer-skip-demo-poster.jpg']) {
    assert.ok(exists(`public/media/${media}`), `public/media/${media}`);
    assert.ok(statSync(new URL(`../public/media/${media}`, import.meta.url)).size < 25 * 1024 * 1024, `${media} fits Cloudflare Pages' 25 MiB limit`);
  }
  assert.match(read('public/media/vibeplayer-launch.en.vtt'), /^WEBVTT/);
  assert.match(article, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\}/);
  assert.match(article, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(article, /'@type': 'VideoObject'[\s\S]*?thumbnailUrl[\s\S]*?contentUrl[\s\S]*?uploadDate[\s\S]*?duration: launchVideo\.duration/);
  assert.match(data, /duration: 'PT1M14S'/);
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  const blog = read('src/app/blog/page.tsx');
  assert.match(blog, /vibeplayerArticle\.path/);
  assert.ok(blog.indexOf('vibeplayer-cover.jpg') < blog.indexOf('pawsip-cover.png'), 'VibePlayer is the first feature');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: vibeplayerArticle\.title/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/vibeplayer\/`,lastModified:'2026-10-13'/);
  assert.match(read('public/llms.txt'), /\/blog\/vibeplayer\//);
  assert.match(read('src/app/layout.tsx'), /import '\.\/vibeplayer\.css';/);
});

test('the figures, demo and video are labelled as recreations and credit the footage', () => {
  const credit = read('src/components/FootageCredit.tsx');
  assert.match(data, /holder: '© 2008 Blender Foundation'/);
  assert.match(data, /license: 'CC BY 3\.0'/);
  assert.match(data, /licenseUrl: 'https:\/\/creativecommons\.org\/licenses\/by\/3\.0\/'/);
  assert.match(credit, /footage\.licenseUrl/);
  const figures = article.match(/<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 7, 'cover, four figures, demo and video');
  for (const figure of figures) assert.match(figure, /<FootageCredit\/>/, 'every figure credits the footage');
  assert.match(article, /recreated from the app&apos;s interface code/);
  assert.match(article, /not a screenshot/);
  assert.match(article, /not affiliated with or endorsed by VideoLAN/);
  assert.match(downloadPage, /<FootageCredit\/>/);
  assert.match(downloadPage, /not affiliated with or endorsed by VideoLAN/);
  assert.doesNotMatch(article + downloadPage, /open[- ]source (?:media )?player|VibePlayer is open[- ]source/i, 'no licence is published, so the app is not called open source');
  assert.doesNotMatch(article + downloadPage, /screenshot: /, 'no recreation is passed off as a screenshot in structured data');
});

test('the skip demo behaves like the app and stays accessible', () => {
  assert.match(data, /preset: \{ start: 8, end: 13 \}/);
  assert.match(data, /length: 20/);
  assert.match(demo, /^'use client';/);
  assert.match(demo, /requestAnimationFrame\(tick\)/);
  assert.match(demo, /muted playsInline loop preload="metadata"/);
  assert.match(demo, /prefers-reduced-motion: reduce/);
  assert.match(demo, /aria-pressed=\{skipOn\}/);
  assert.match(demo, /Start skip here <kbd>\[<\/kbd>/);
  assert.match(demo, /event\.key === '\['/);
  assert.match(demo, /event\.key === '\]'/);
  assert.match(demo, /WEB DEMO/);
  assert.match(demo, /aria-label="Seek"/);
  assert.match(demo, /role="status" aria-live="polite"/);
});

test('the VibePlayer download page offers every edition and is linked across the site', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/vibeplayer\/'/);
  assert.match(downloadPage, /<VibePlayerDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download VibePlayer for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /SHA-256 checksums/);
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{vibeplayerArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /haven&apos;t run it on ARM hardware/, 'says what was not tested');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/blog/page.tsx'), /href=\{vibeplayerDownloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/vibeplayer\/`,lastModified:'2026-10-13'/);
  assert.match(read('public/llms.txt'), /^- VibePlayer download page: https:\/\/www\.nomanshafiq\.com\/vibeplayer\/\r?$/m);
  assert.match(read('scripts/check-export.mjs'), /'blog\/vibeplayer','vibeplayer'/);
});

test('the update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/vibeplayer.json'));
  const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
  assert.equal(feed.app, 'VibePlayer');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/vibeplayer/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like the app (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/VibePlayer/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/vibeplayer\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(read('scripts/check-export.mjs'), /'updates\/vibeplayer\.json'/);
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
  assert.match(downloadPage, /Settings › Updates/);
});

test('the file-type count matches the app source list', () => {
  assert.match(data, /fileTypes = \{ video: 47, audio: 34, subtitles: 18 \}/);
  assert.doesNotMatch(article + downloadPage, /\b83\b/);
});
