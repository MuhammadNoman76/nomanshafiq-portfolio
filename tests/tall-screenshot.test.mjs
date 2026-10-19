import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/tall-screenshot.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const zip = /file: '([^']+)',\s*bytes: (\d+),\s*sha256: '([^']+)'/.exec(data);
const article = read('src/app/blog/tall-screenshot/page.tsx');
const downloadPage = read('src/app/tall-screenshot/page.tsx');
const box = read('src/components/ExtensionDownload.tsx');
const blog = read('src/app/blog/page.tsx');
const articleBody = article.slice(article.indexOf('export default function'));

test('Tall Screenshot offers one ZIP for Chrome and Edge, from its own repository', () => {
  assert.equal(version, '1.0.1');
  assert.ok(zip, 'the ZIP has a file name, size and checksum');
  const [, file, bytes, sha256] = zip;
  assert.equal(file, `tall-screenshot-${version}.zip`);
  assert.ok(Number(bytes) > 10_000 && Number(bytes) < 1_000_000, 'a small extension package');
  assert.match(sha256, /^[0-9a-f]{64}$/);
  assert.match(data, /export const downloadUrl = `https:\/\/github\.com\/MuhammadNoman76\/Tall-Screenshot\/raw\/refs\/heads\/main\/release\/\$\{extensionZip\.file\}`/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Tall-Screenshot\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Tall-Screenshot'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('the download box is a server component with the shared download look', () => {
  assert.doesNotMatch(box, /'use client'/, 'one ZIP for every browser: nothing to detect');
  assert.match(box, /className="pawsip-download ts-download"/);
  assert.match(box, /href=\{downloadUrl\}/);
  assert.match(box, /Chrome Web Store: \{chromeWebStore\.status\}/);
  assert.match(article, /<ExtensionDownload\/>/);
  assert.match(downloadPage, /<ExtensionDownload\/>/);
});

test('the Chrome Web Store listing is described as in review, and not linked before it is live', () => {
  assert.match(data, /chromeWebStore = \{ status: 'in review', submitted: '2026-10-19', version: '1\.0\.0'/);
  for (const page of [article, downloadPage, box]) assert.doesNotMatch(page, /chromewebstore\.google\.com|chrome\.google\.com\/webstore/, 'no link to a listing that is not live yet');
  assert.match(article, /\{chromeWebStore\.status\}/);
  assert.match(downloadPage, /\{chromeWebStore\.status\}/);
});

test('the shortcuts are the ones Chrome assigns', () => {
  assert.match(data, /\['Pick color', 'Alt\+Shift\+E'\]/, 'Chrome keeps Alt+Shift+C for itself, so the manifest uses E');
  assert.doesNotMatch(data.replace(/\/\*\*[\s\S]*?\*\//g, ''), /'Alt\+Shift\+C'/);
  for (const key of ['Alt+Shift+F', 'Alt+Shift+S', 'Alt+Shift+V']) assert.ok(data.includes(`'${key}'`), key);
  assert.match(data, /\['Measure', 'None by default/);
});

test('the Tall Screenshot field note is published, linked and has its media', () => {
  for (const id of ['idea', 'capture', 'stitch', 'editor', 'tools', 'private', 'limits', 'video', 'download', 'next']) assert.match(article, new RegExp(`id="${id}"`), id);
  for (const art of ['cover.jpg', 'social.jpg', 'popup.png', 'select.jpg', 'page.jpg', 'editor.jpg', 'color.jpg', 'ruler.jpg']) {
    assert.ok(exists(`public/art/tall-screenshot-${art}`), `public/art/tall-screenshot-${art}`);
    assert.match(read('scripts/check-export.mjs'), new RegExp(`'art/tall-screenshot-${art.replace('.', '\\.')}'`), `${art} in the export check`);
  }
  for (const media of ['tall-screenshot-launch.mp4', 'tall-screenshot-launch.en.vtt', 'tall-screenshot-launch-poster.jpg']) {
    assert.ok(exists(`public/media/${media}`), `public/media/${media}`);
    assert.ok(statSync(new URL(`../public/media/${media}`, import.meta.url)).size < 25 * 1024 * 1024, `${media} fits Cloudflare Pages' 25 MiB limit`);
  }
  const mp4 = readFileSync(new URL('../public/media/tall-screenshot-launch.mp4', import.meta.url)).subarray(0, 200_000).toString('latin1');
  assert.ok(mp4.indexOf('moov') > 0 && mp4.indexOf('moov') < mp4.indexOf('mdat'), 'the MP4 is fast-start');
  assert.match(read('public/media/tall-screenshot-launch.en.vtt'), /^WEBVTT/);
  assert.match(article, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\}/);
  assert.match(article, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(article, /'@type': 'VideoObject'[\s\S]*?thumbnailUrl[\s\S]*?contentUrl[\s\S]*?uploadDate[\s\S]*?duration: launchVideo\.duration/);
  assert.match(data, /duration: 'PT1M27S'/);
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/tall-screenshot\/`,lastModified:'2026-10-19'/);
  assert.match(read('public/llms.txt'), /\/blog\/tall-screenshot\//);
  assert.match(read('src/app/layout.tsx'), /import '\.\/tall-screenshot\.css';/);
  assert.ok(exists('docs/TALL-SCREENSHOT-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/tall-screenshot\/` \(first on the blog index\)/);
  assert.match(read('AGENTS.md'), /`src\/data\/tall-screenshot\.ts`/);
  assert.ok(articleBody.indexOf('<section id="limits"') < articleBody.indexOf('<section id="video"') && articleBody.indexOf('<section id="video"') < articleBody.indexOf('<section id="download"'), 'the video comes after the limits, before the download');
});

test('Tall Screenshot is the first card on the blog index', () => {
  assert.match(blog, /tallScreenshotArticle\.path/);
  assert.match(blog, /href=\{tallScreenshotDownloadPage\.path\}/);
  assert.ok(blog.indexOf('tall-screenshot-cover.jpg') > 0 && blog.indexOf('tall-screenshot-cover.jpg') < blog.indexOf('vibevideo-ai-cover.jpg'), 'Tall Screenshot comes before VibeVideo AI');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: tallScreenshotArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.ok(blog.indexOf('fetchPriority="high"') > blog.indexOf('tall-screenshot-cover.jpg') && blog.indexOf('fetchPriority="high"') < blog.indexOf('vibevideo-ai-cover.jpg'), 'the high-priority image is Tall Screenshot’s');
  assert.match(blog, /images: \[\{ url: '\/art\/tall-screenshot-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the Tall Screenshot card');
  assert.match(blog, /images: \['\/art\/tall-screenshot-social\.jpg'\]/);
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`Read the field note <span className="blog-read-time">${readTime} MIN</span></a><a className="plain-link" href=\\{tallScreenshotDownloadPage\\.path\\}`), 'the blog card shows the same reading time');
});

test('the pages are honest about screenshots, recreations, protected pages and what is untested', () => {
  const figures = article.match(/<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 8, 'cover, six figures and the video');
  for (const figure of figures.filter(f => /tall-screenshot-(popup|select|editor|color|ruler)\./.test(f))) assert.match(figure, /real screenshot/, 'each screenshot figure says it is real');
  const video = figures.find(f => f.includes('<video'));
  assert.match(video, /real captures made by the extension/);
  assert.match(video, /recreated from its source code/);
  assert.match(video, /slower pace than the real two screens a second/, 'the slowed-down capture is disclosed');
  assert.match(article, /a demo page made for this note \(a fictional travel magazine\)/);
  assert.match(data, /untested: 'Brave, Opera, Arc and other Chromium browsers, and macOS, Linux and ChromeOS'/);
  assert.match(article, /Not tested yet: \{tested\.untested\}/);
  assert.match(downloadPage, /Not tested yet/);
  assert.match(article, /No Firefox version yet/);
  assert.match(data, /view-source: pages and blank tabs', 'Nothing/);
  assert.match(article, /\{protectedPages\.map/);
  assert.doesNotMatch(article + downloadPage, /open[- ]source/i, 'no licence is published, so it is not called open source');
});

test('the privacy claims match the manifest', () => {
  for (const permission of ['activeTab', 'scripting', 'storage', 'contextMenus']) assert.match(data, new RegExp(`\\['${permission}', `), permission);
  assert.doesNotMatch(data, /\['(debugger|tabs|<all_urls>|host_permissions)'/);
  assert.match(article, /asks for no access to any website/);
  assert.match(article, /only the five most recent/);
  assert.match(downloadPage, /only the five most recent/);
});

test('the Tall Screenshot download page is complete and linked across the site', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/tall-screenshot\/'/);
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /downloadUrl,/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{tallScreenshotArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /SHA-256 checksum/);
  assert.match(downloadPage, /Load unpacked/);
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/tall-screenshot\/`,lastModified:'2026-10-19'/);
  assert.match(read('public/llms.txt'), /^- Tall Screenshot download page: https:\/\/www\.nomanshafiq\.com\/tall-screenshot\/\r?$/m);
  assert.match(read('scripts/check-export.mjs'), /'blog\/tall-screenshot','tall-screenshot'/);
});
