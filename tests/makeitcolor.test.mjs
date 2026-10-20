import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/makeitcolor.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/makeitcolor/page.tsx');
const downloadPage = read('src/app/makeitcolor/page.tsx');
const blog = read('src/app/blog/page.tsx');
const exportCheck = read('scripts/check-export.mjs');
const articleBody = article.slice(article.indexOf('export default function'));
const releaseBase = `https://github.com/MuhammadNoman76/make-it-color/releases/download/v${version}/`;

/** JPEG pixel sizes, read from the file header. */
const imageSize = path => {
  const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
  for (let i = 2; i < bytes.length;) {
    const marker = bytes[i + 1], length = bytes.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return {width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5)};
    i += 2 + length;
  }
  return null;
};

/** Every picture on the pages, with its true size. */
const art = {
  cover: [1672, 940], social: [1200, 630], app: [1600, 973], 'app-light': [1600, 973], settings: [900, 917],
  restore: [1612, 600], enhance: [1612, 450], film: [1598, 476], doraha: [1612, 450], strength: [1839, 340],
};

test('MakeItColor 1.0.0 offers its two 64-bit installers', () => {
  assert.equal(version, '1.0.0');
  assert.equal(released, '2026-10-20');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64'], 'Windows ML exists only on 64-bit Windows 10 and 11');
  for (const edition of editions) {
    assert.equal(edition.file, `MakeItColor-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 2 * 1024 ** 3, `${edition.id} fits GitHub's 2 GiB release-asset limit`);
  }
  assert.deepEqual(editions.map(e => [e.bytes, e.sha256]), [
    [111640097, '3a0d2efe03bda5308c47eb61757eb25fbfef43eeb5b92ae20ced75de4992a58d'],
    [93063064, '4e50f36eea792a901de4cb372d9c4d76456f30c9337f5a67e8e0d82a3171247a'],
  ], 'the published release assets');
  assert.match(data, /export const requirement = '64-bit Windows 10 \(version 1903 or later\) or Windows 11/);
  assert.match(data, /forWho: 'Snapdragon laptops and other ARM PCs\. Not yet tested on ARM hardware\.'/);
});

test('downloads are GitHub release assets, over HTTPS', () => {
  assert.match(data, /`https:\/\/github\.com\/MuhammadNoman76\/make-it-color\/releases\/download\/v\$\{makeitcolorArticle\.version\}\/\$\{edition\.file\}`/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/make-it-color\/releases\/download\/v1\.0\.0\/SHA256SUMS\.txt'/);
  assert.match(data, /releaseUrl: 'https:\/\/github\.com\/MuhammadNoman76\/make-it-color\/releases\/tag\/v1\.0\.0'/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/make-it-color'/);
  assert.match(data, /qualityUrl: 'https:\/\/github\.com\/MuhammadNoman76\/make-it-color\/blob\/main\/docs\/QUALITY\.md'/);
  assert.match(data, /modelUrl: 'https:\/\/huggingface\.co\/muhammadnoman76\/makeitcolor'/);
  assert.doesNotMatch(data, /http:\/\//);
  assert.doesNotMatch(data, /make-it-color\/raw\//, 'the installers are not files in the repository');
});

test('the download box knows MakeItColor has no 32-bit or Windows 7 build', () => {
  const wrapper = read('src/components/MakeItColorDownload.tsx');
  assert.match(wrapper, /^'use client';/);
  assert.match(wrapper, /<WindowsDownload appName="MakeItColor" version=\{makeitcolorArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\} requirement=\{requirement\}\/>/);
  assert.match(article, /<MakeItColorDownload\/>/);
  assert.match(downloadPage, /<MakeItColorDownload\/>/);
  for (const page of [article, downloadPage]) assert.match(page, /Windows ML[^.]*doesn&apos;t exist there|Windows ML, which runs the models, doesn’t exist there/);
});

test('the MakeItColor field note is published, linked and has its media', () => {
  for (const id of ['idea', 'colouring', 'restoring', 'films', 'hardware', 'checks', 'limits', 'video', 'download', 'credits']) assert.match(article, new RegExp(`<section id="${id}"`), id);
  assert.ok(articleBody.indexOf('<section id="limits"') < articleBody.indexOf('<section id="video"') && articleBody.indexOf('<section id="video"') < articleBody.indexOf('<section id="download"'), 'the video comes after the limits, before the download');
  for (const media of ['makeitcolor-launch.mp4', 'makeitcolor-launch.en.vtt', 'makeitcolor-launch-poster.jpg']) {
    assert.match(exportCheck, new RegExp(`'media/${media.replace(/\./g, '\\.')}'`), `${media} in the export check`);
    assert.ok(exists(`public/media/${media}`), `public/media/${media}`);
    assert.ok(statSync(new URL(`../public/media/${media}`, import.meta.url)).size < 25 * 1024 * 1024, `${media} fits Cloudflare Pages' 25 MiB limit`);
  }
  const mp4 = readFileSync(new URL('../public/media/makeitcolor-launch.mp4', import.meta.url)).subarray(0, 200_000).toString('latin1');
  assert.ok(mp4.indexOf('moov') > 0 && mp4.indexOf('moov') < mp4.indexOf('mdat'), 'the MP4 is fast-start');
  assert.match(read('public/media/makeitcolor-launch.en.vtt'), /^WEBVTT/);
  assert.deepEqual(imageSize('public/media/makeitcolor-launch-poster.jpg'), {width: 1280, height: 720}, 'the poster matches the video');
  assert.match(article, /<video controls preload="metadata" playsInline poster=\{launchVideo\.poster\}/);
  assert.match(article, /<track kind="captions" srcLang="en" label="English" src=\{launchVideo\.captions\} default\/>/);
  assert.match(article, /'@type': 'VideoObject'[\s\S]*?thumbnailUrl[\s\S]*?contentUrl[\s\S]*?uploadDate[\s\S]*?duration: launchVideo\.duration/);
  assert.match(data, /duration: 'PT1M15S'/);
  assert.match(data, /uploadDate: '2026-10-20'/);
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/makeitcolor\/`,lastModified:'2026-10-20'/);
  assert.match(read('public/llms.txt'), /^- MakeItColor, a free Windows app[^\n]*: https:\/\/www\.nomanshafiq\.com\/blog\/makeitcolor\/\r?$/m);
  assert.match(read('src/app/layout.tsx'), /import '\.\/makeitcolor\.css';/);
  assert.match(exportCheck, /'blog\/makeitcolor','makeitcolor'/);
  assert.ok(exists('docs/MAKEITCOLOR-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/makeitcolor\/` \(first on the blog index\)/);
  assert.match(read('AGENTS.md'), /`src\/data\/makeitcolor\.ts`/);
});

test('the pictures are on the site at their true sizes, and the pages give those sizes', () => {
  for (const [name, [width, height]] of Object.entries(art)) {
    const file = `makeitcolor-${name}.jpg`;
    assert.deepEqual(imageSize(`public/art/${file}`), {width, height}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/${file.replace('.', '\\.')}'`), `${file} is checked in the export`);
  }
  for (const [file, html] of [...(article + downloadPage + blog).matchAll(/<img src="\/art\/(makeitcolor-[\w-]+\.jpg)" ([^>]*)\/>/g)].map(([, f, attrs]) => [f, attrs])) {
    const [width, height] = art[file.slice('makeitcolor-'.length, -'.jpg'.length)];
    assert.match(html, new RegExp(`^width="${width}" height="${height}"`), `${file} is given its own size`);
    assert.match(html, /alt="[^"]{20,}"/, `${file} has real alt text`);
  }
  assert.match(article, /images: \[\{ url: '\/art\/makeitcolor-social\.jpg', width: 1200, height: 630, alt: '[^']+' \}\]/);
  assert.match(downloadPage, /images: \[\{ url: '\/art\/makeitcolor-social\.jpg', width: 1200, height: 630, alt: '[^']+' \}\]/);
});

test('MakeItColor is the first card on the blog index', () => {
  assert.match(blog, /href=\{makeitcolorArticle\.path\}/);
  assert.match(blog, /href=\{makeitcolorDownloadPage\.path\}/);
  assert.ok(blog.indexOf('makeitcolor-cover.jpg') > 0 && blog.indexOf('makeitcolor-cover.jpg') < blog.indexOf('tall-screenshot-cover.jpg'), 'MakeItColor comes before Tall Screenshot');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: makeitcolorArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.match(blog, /src="\/art\/makeitcolor-cover\.jpg" width="1672" height="940" alt="[^"]+" fetchPriority="high"/, 'the high-priority image is MakeItColor’s');
  assert.match(blog, /images: \[\{ url: '\/art\/makeitcolor-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the MakeItColor card');
  assert.match(blog, /images: \['\/art\/makeitcolor-social\.jpg'\]/);
  assert.match(blog, /DESKTOP SOFTWARE \/ 20 OCTOBER 2026/);
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`Read the field note <span className="blog-read-time">${readTime} MIN</span></a><a className="plain-link" href=\\{makeitcolorDownloadPage\\.path\\}`), 'the blog card shows the same reading time');
  assert.match(article, /<time dateTime=\{makeitcolorArticle\.date\}>20 October 2026<\/time>/);
});

test('the pages are honest about screenshots, footage, licences and what is untested', () => {
  const figures = article.match(/<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 9, 'cover, seven figures and the video');
  for (const figure of figures.filter(f => /makeitcolor-(app|app-light|settings)\.jpg/.test(f))) assert.match(figure, /real screenshot/, 'each app screenshot says it is real');
  for (const figure of figures.filter(f => /makeitcolor-(restore|enhance|film|doraha|strength)\.jpg/.test(f))) assert.match(figure, /[Rr]eal output/, 'each before/after says it is real output');
  for (const figure of figures.filter(f => f.includes('<img'))) assert.match(figure, /<MakeItColorCredit source="(duck|doraha)"\/>|Settings, a real screenshot/, 'every figure with footage credits it');
  const cover = figures.find(f => f.includes('makeitcolor-cover.jpg'));
  assert.match(cover, /The labels and the name were added for this cover/, 'the cover says what was added');
  assert.match(downloadPage, /real screenshot/);
  assert.match(downloadPage, /<MakeItColorCredit source="doraha"\/>/);
  assert.doesNotMatch(article + downloadPage, /recreat/i, 'every picture is real, so nothing is called a recreation');
  assert.doesNotMatch(article + downloadPage, /open[- ]source/i, 'no licence is published, so the app is not called open source');
  assert.ok(data.includes('https://archive.org/details/DuckandC1951'), 'Duck and Cover source');
  assert.doesNotMatch(article + downloadPage + data, /Kissing the War Goodbye|1945/, 'the 1945 photo is no longer used');
  assert.match(data, /doraha: \{ title: 'Doraha', year: 1967, [^}]*use: 'short excerpts' \}/);
  for (const licence of ['Apache 2.0', 'BSD 3-Clause', 'MIT', 'LGPL 2.1']) assert.ok(data.includes(licence) && downloadPage.includes(licence), licence);
  assert.match(article + downloadPage, /not affiliated with the DDColor or Real-ESRGAN authors/);
  assert.match(article, /Not tested yet: ARM64 hardware \(Snapdragon X\), AMD and Qualcomm NPUs, NVIDIA and AMD graphics cards, and Windows 10 itself/);
  assert.match(downloadPage, /haven&apos;t run it on ARM hardware/);
  assert.match(article, /purple cast/);
  assert.match(article, /from silver-pink to maroon within one shot/, 'the car in Doraha changes colour as it moves');
  assert.match(article, /slightly painted/);
  assert.match(article, /Skies, skin and grass usually come out right/);
  assert.match(article, /the colour model never sees the enhanced picture/i);
  assert.match(article, /qualityUrl/, 'links docs/QUALITY.md');
});

test('the measured figures are the ones in the evidence doc', () => {
  const doc = read('docs/MAKEITCOLOR-CONTENT.md');
  assert.match(data, /export const testPc = 'Intel Core Ultra 5 135U with an Intel AI Boost NPU and Intel Graphics';/);
  assert.match(data, /\{ chip: 'NPU', device: 'Intel AI Boost', path: 'OpenVINO, float16', time: '0\.41–0\.42 s' \}/);
  assert.match(data, /\{ chip: 'CPU', device: 'Intel Core Ultra 5 135U', path: 'float32', time: '1\.8–2\.4 s' \}/);
  assert.match(data, /flicker: \{ frames: 600, without: '5\.40', with: '2\.76' \}/);
  assert.match(data, /kodak: \{ images: 24, psnr: \['21\.23', '21\.92'\], deltaE: \['18\.71', '17\.61'\] \}/);
  assert.match(data, /colorFp16: \{[^}]*bytes: 456_392_880 \}/);
  assert.match(data, /colorFp32: \{[^}]*bytes: 912_062_353 \}/);
  for (const figure of ['0.41–0.42 s', '5.40', '2.76', '21.23', '21.92', '18.71', '17.61', '456,392,880', '912,062,353', '88–100 dB', '51–57 dB', '54–58 dB', '87 dB', '0.70', '0.89', '0.81']) assert.ok(doc.includes(figure), `${figure} in the evidence doc`);
  assert.match(blog, /<strong>0\.42<span>s<\/span><\/strong>/, 'the blog card uses the NPU figure');
  assert.match(article, /Intel Core Ultra 5 135U/, 'the test PC is named');
});

test('the MakeItColor download page offers both editions and is linked across the site', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/makeitcolor\/'/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download MakeItColor for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /SHA-256 checksums/);
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{makeitcolorArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /href=\{makeitcolorArticle\.releaseUrl\}/, 'links the release page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/makeitcolor\/`,lastModified:'2026-10-20'/);
  assert.match(read('public/llms.txt'), /^- MakeItColor download page: https:\/\/www\.nomanshafiq\.com\/makeitcolor\/\r?$/m);
  assert.match(read('public/llms.txt'), /^- MakeItColor source: https:\/\/github\.com\/MuhammadNoman76\/make-it-color\r?$/m);
});

test('the update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/makeitcolor.json'));
  assert.equal(feed.app, 'MakeItColor', 'the app only accepts a feed for its own id (AppInfo.Id)');
  assert.equal(feed.version, version);
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/makeitcolor/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length === 3 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'three release notes');
  assert.deepEqual(Object.keys(feed), ['app', 'version', 'released', 'notes', 'page', 'editions']);
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id));
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry), ['url', 'sha256', 'size'], edition.id);
    assert.equal(entry.url, `${releaseBase}${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/makeitcolor\.json';/);
  assert.match(exportCheck, /\['makeitcolor\.json','MakeItColor',\['x64','arm64'\]\]/);
  assert.match(exportCheck, /'updates\/makeitcolor\.json'/);
  assert.match(article, /<code>\{updateFeed\}<\/code>/);
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/);
  for (const page of [article, downloadPage]) assert.match(page, /Settings › Updates/);
});
