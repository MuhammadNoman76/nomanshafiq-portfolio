import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/vibevideo-ai.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/vibevideo-ai/page.tsx');
const downloadPage = read('src/app/vibevideo-ai/page.tsx');
const blog = read('src/app/blog/page.tsx');

test('VibeVideo AI offers its two 64-bit installers', () => {
  assert.equal(version, '0.1.0');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64'], 'Windows ML exists only on 64-bit Windows 10 and 11');
  for (const edition of editions) {
    assert.equal(edition.file, `VibeVideoAI-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} fits GitHub's 100 MB file limit`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.match(data, /export const requirement = '64-bit Windows 10 \(version 1903 or later\) or Windows 11/);
});

test('downloads point at the vibeplayer-ai repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/vibeplayer-ai\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/vibeplayer-ai\/blob\/main\/release\/VibeVideoAI-SHA256SUMS\.txt'/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/vibeplayer-ai'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('the download box knows VibeVideo AI has no 32-bit or Windows 7 build', () => {
  const wrapper = read('src/components/VibeVideoAiDownload.tsx');
  const picker = read('src/components/WindowsDownload.tsx');
  assert.match(wrapper, /^'use client';/);
  assert.match(wrapper, /<WindowsDownload appName="VibeVideo AI" version=\{vibevideoArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\} requirement=\{requirement\}\/>/);
  assert.match(picker, /requirement\?: string;/);
  assert.match(picker, /!match && !!requirement/, 'a PC without a matching installer gets the requirement, not the x64 installer');
});

test('the VibeVideo AI field note is published, linked and has its media', () => {
  assert.match(article, /<VibeVideoAiDownload\/>/);
  assert.match(article, /editions\.map/);
  for (const id of ['idea', 'how', 'control', 'hardware', 'limits', 'video', 'download', 'next']) assert.match(article, new RegExp(`id="${id}"`), id);
  for (const art of ['cover', 'social', 'scan', 'frames', 'menu', 'skip', 'processor']) assert.ok(exists(`public/art/vibevideo-ai-${art}.jpg`), `public/art/vibevideo-ai-${art}.jpg`);
  assert.ok(exists('public/art/vibevideo-ai-scenes.png'), 'the Scenes to skip screenshot');
  assert.match(read('scripts/check-export.mjs'), /'art\/vibevideo-ai-scenes\.png'/);
  for (const media of ['vibevideo-ai-launch.mp4', 'vibevideo-ai-launch.en.vtt', 'vibevideo-ai-launch-poster.jpg']) {
    assert.ok(exists(`public/media/${media}`), `public/media/${media}`);
    assert.ok(statSync(new URL(`../public/media/${media}`, import.meta.url)).size < 25 * 1024 * 1024, `${media} fits Cloudflare Pages' 25 MiB limit`);
  }
  assert.match(read('public/media/vibevideo-ai-launch.en.vtt'), /^WEBVTT/);
  assert.match(article, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\}/);
  assert.match(article, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(article, /'@type': 'VideoObject'[\s\S]*?thumbnailUrl[\s\S]*?contentUrl[\s\S]*?uploadDate[\s\S]*?duration: launchVideo\.duration/);
  assert.match(data, /duration: 'PT1M18S'/);
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/vibevideo-ai\/`,lastModified:'2026-10-18'/);
  assert.match(read('public/llms.txt'), /\/blog\/vibevideo-ai\//);
  assert.match(read('src/app/layout.tsx'), /import '\.\/vibevideo-ai\.css';/);
  assert.ok(exists('docs/VIBEVIDEO-AI-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/vibevideo-ai\/`/);
  assert.match(read('AGENTS.md'), /`src\/data\/vibevideo-ai\.ts`/);
});

test('VibeVideo AI is the second card on the blog index, after Tall Screenshot', () => {
  assert.match(blog, /vibevideoArticle\.path/);
  assert.match(blog, /href=\{vibevideoDownloadPage\.path\}/);
  assert.ok(blog.indexOf('tall-screenshot-cover.jpg') < blog.indexOf('vibevideo-ai-cover.jpg') && blog.indexOf('vibevideo-ai-cover.jpg') < blog.indexOf('inkwell-cover.jpg'), 'Tall Screenshot (the newest), then VibeVideo AI, then Inkwell');
  assert.match(blog, /\}, \{ '@type': 'BlogPosting', headline: vibevideoArticle\.title/, 'second in the structured data, after Tall Screenshot');
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.match(blog, /src="\/art\/vibevideo-ai-cover\.jpg" width="1672" height="940" alt="[^"]+" loading="lazy"/, 'VibeVideo AI is no longer the first card, so its image loads lazily');
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`<span className="blog-read-time">${readTime} MIN</span>`), 'the blog card shows the same reading time');
});

test('the pages are honest about recreations, footage, licences and what is untested', () => {
  const credit = read('src/components/ReelCredit.tsx');
  assert.match(credit, /all in the public domain/);
  for (const source of ['https://archive.org/details/DuckandC1951', 'https://archive.org/details/the-kiss-1896', 'https://commons.wikimedia.org/wiki/File:Kissing_the_War_Goodbye.jpg']) assert.ok(data.includes(source), source);
  const figures = article.match(/<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 8, 'cover, six figures and the video');
  const screenshot = figures.filter(figure => figure.includes('vibevideo-ai-scenes.png'));
  assert.equal(screenshot.length, 1, 'the Scenes to skip window is shown once');
  assert.match(screenshot[0], /a real screenshot \(the app drew it with its own interface code/, 'the real screenshot says how it was made');
  assert.match(screenshot[0], /example scenes/, 'and that its scenes are examples');
  for (const figure of figures.filter(figure => !figure.includes('vibevideo-ai-scenes.png'))) assert.match(figure, /<ReelCredit\/>/, 'every figure with footage credits it');
  assert.match(article, /<FootageCredit\/>/, 'the video credits the Big Buck Bunny shot');
  assert.match(article, /recreated from the app&apos;s interface code/);
  assert.match(article, /not a screenshot/);
  assert.match(article + downloadPage, /not affiliated with or endorsed by VideoLAN/);
  assert.match(downloadPage, /<ReelCredit\/>/);
  assert.match(article, /early preview/);
  assert.match(article, /It can mark a harmless scene/);
  assert.match(article, /It can miss a scene/);
  assert.match(article, /It isn&apos;t parental control/);
  assert.match(downloadPage, /isn&apos;t parental control/);
  assert.match(article, /Not tested yet: ARM64 hardware/);
  assert.match(downloadPage, /haven&apos;t run it on ARM hardware/);
  assert.match(article + downloadPage, /AGPL-3\.0/, 'NudeNet’s licence is named');
  assert.match(data, /nudenet: \{[^}]*use: 'optional, off by default'/);
  assert.doesNotMatch(article + downloadPage, /VibeVideo AI is open[- ]source/i, 'no licence is published, so the app is not called open source');
  assert.doesNotMatch(article + downloadPage, /screenshot: /, 'no recreation is passed off as a screenshot in structured data');
});

test('the speed figures are the measured ones', () => {
  assert.match(data, /export const fullHdSpeed = 17;/);
  assert.match(data, /\{ chip: 'NPU', device: 'Intel AI Boost', x: \d+, ms: [\d.]+ \}/);
  assert.match(article, /Intel Core Ultra 5 135U/, 'the test PC is named');
  assert.match(blog, /<strong>17×<span>real(?:&nbsp;| )time<\/span><\/strong>/, 'the blog card uses the same full-HD figure');
});

test('the VibeVideo AI download page offers both editions and is linked across the site', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/vibevideo-ai\/'/);
  assert.match(downloadPage, /<VibeVideoAiDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download VibeVideo AI for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /SHA-256 checksums/);
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{vibevideoArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /href=\{vibeplayerDownloadPage\.path\}/, 'points older PCs to VibePlayer');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/vibevideo-ai\/`,lastModified:'2026-10-18'/);
  assert.match(read('public/llms.txt'), /^- VibeVideo AI download page: https:\/\/www\.nomanshafiq\.com\/vibevideo-ai\/\r?$/m);
  assert.match(read('scripts/check-export.mjs'), /'blog\/vibevideo-ai','vibevideo-ai'/);
});

test('the update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/vibevideo-ai.json'));
  const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
  assert.equal(feed.app, 'VibeVideoAI', 'the app only accepts a feed for its own id (AppInfo.Id)');
  assert.equal(feed.version, version);
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/vibevideo-ai/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.length <= 6 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id));
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/vibeplayer-ai/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/vibevideo-ai\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(read('scripts/check-export.mjs'), /\['vibevideo-ai\.json','VibeVideoAI',\['x64','arm64'\]\]/);
  assert.match(article, /<code>\{updateFeed\}<\/code>/);
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/);
  assert.match(downloadPage, /Settings › Updates/);
});

test('the pages describe the scene controls the app has', () => {
  for (const action of ['Stretch or trim it.', 'Keep it.', 'Watch it once.', 'Undo your changes.', 'Add one it missed.']) assert.ok(article.includes(`'${action}'`), action);
  assert.match(article, /Scenes to skip…/);
  assert.match(article, /−1 s and \+1 s/);
  assert.match(downloadPage, /'Every scene, your call'/);
  assert.match(read('public/llms.txt'), /Scenes to skip/);
});
