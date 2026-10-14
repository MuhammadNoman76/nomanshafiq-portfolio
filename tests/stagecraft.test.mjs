import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/stagecraft.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/stagecraft/page.tsx');
const downloadPage = read('src/app/stagecraft/page.tsx');
const blog = read('src/app/blog/page.tsx');
const exportCheck = read('scripts/check-export.mjs');
/** The rendered JSX of the article, without comments or the helpers' own templates. */
const articleBody = article.slice(article.indexOf('export default function')).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

/** PNG and JPEG pixel sizes, read from the file headers. */
const imageSize = path => {
  const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
  if (bytes.readUInt32BE(0) === 0x89504e47) return {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)};
  for (let i = 2; i < bytes.length;) {
    const marker = bytes[i + 1], length = bytes.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return {width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5)};
    i += 2 + length;
  }
  throw new Error(`No size in ${path}`);
};

test('Stagecraft downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.0');
  assert.equal(released, '2026-10-14');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `Stagecraft-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [48060306, 42603902, 44102700, 5921961], 'sizes match the installers in the Stagecraft repository');
  assert.deepEqual(editions.map(e => e.sha256), [
    '99463272d8f2203a804db59e142cb9d723c5217fd203ed2a971dfbb0c52b4533',
    '2dbd3bc688829895103047784f638647b98e0651efbea753acf7f96f44c5dce2',
    '1f05bea27d28d2a1c7d281274a851d78542ce7cce163cb8340e129d0bf5f0e32',
    '671209ae3069761bd73d1379a3764cdca97eab8d11c24a9d005cd21093171607',
  ], 'checksums match release/SHA256SUMS.txt');
});

test('downloads point at the Stagecraft repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft'/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /noticesUrl: 'https:\/\/github\.com\/MuhammadNoman76\/stagecraft\/blob\/main\/THIRD-PARTY-NOTICES\.txt'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('Stagecraft uses the shared Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer|Trove|Stagecraft/, 'no app names baked into the shared picker');
  const wrapper = read('src/components/StagecraftDownload.tsx');
  assert.match(wrapper, /^'use client';/, 'the wrapper is the client boundary');
  assert.match(wrapper, /<WindowsDownload appName="Stagecraft" version=\{stagecraftArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\}\/>/);
});

test('the Stagecraft field note is published, linked and has its sections', () => {
  assert.match(article, /<StagecraftDownload\/>/);
  assert.match(article, /editions\.map/);
  const ids = ['idea', 'design', 'editing', 'motion', 'presenter', 'files', 'engine', 'download', 'next'];
  ids.forEach((id, index) => {
    const number = String(index + 1).padStart(2, '0');
    assert.match(articleBody, new RegExp(`href="#${id}">${number} / `), `${id} is number ${number} in the contents`);
    if (index > 0) assert.match(articleBody, new RegExp(`<section id="${id}"[^>]*><span className="jev-section-number">${number} / `), `${id} section is numbered ${number}`);
    else assert.match(articleBody, /<section id="idea"/);
  });
  assert.match(article, /\{\/\* LAUNCH VIDEO \(to be added\)/, 'the launch video has a marked place');
  assert.ok(article.indexOf('<section id="engine"') < article.indexOf('LAUNCH VIDEO (to be added)') && article.indexOf('LAUNCH VIDEO (to be added)') < article.indexOf('<section id="download"'), 'the placeholder sits between Under the hood and Download');
  assert.doesNotMatch(articleBody, /id="video"|<video|href="#video"/, 'no empty video section is rendered');
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /'@type': 'BlogPosting'/);
  assert.match(article, /'@type': 'SoftwareApplication', '@id': appId/);
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/stagecraft\/`,lastModified:'2026-10-14'/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/stagecraft\/`,lastModified:'2026-10-14'/);
  assert.match(read('public/llms.txt'), /^- Stagecraft, a free Windows presentation app .*https:\/\/www\.nomanshafiq\.com\/blog\/stagecraft\/\r?$/m);
  assert.match(read('public/llms.txt'), /^- Stagecraft download page: https:\/\/www\.nomanshafiq\.com\/stagecraft\/\r?$/m);
  assert.match(read('public/llms.txt'), /^- Stagecraft source: https:\/\/github\.com\/MuhammadNoman76\/stagecraft\r?$/m);
  assert.match(read('src/app/layout.tsx'), /import '\.\/stagecraft\.css';/);
  assert.match(exportCheck, /'blog\/stagecraft','stagecraft'/);
  assert.ok(exists('docs/STAGECRAFT-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/stagecraft\/`/);
});

test('Stagecraft is the first card on the blog index', () => {
  assert.match(blog, /stagecraftArticle\.path/);
  assert.match(blog, /href=\{stagecraftDownloadPage\.path\}/);
  const order = ['stagecraft-cover.jpg', 'trove-cover.jpg', 'vibeplayer-cover.jpg', 'pawsip-cover.png', 'jev-urdu-cover.webp'].map(art => blog.indexOf(art));
  assert.ok(order.every(index => index > 0), 'every card has its cover');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'Stagecraft, then Trove, VibePlayer, PawSip and Jev-Urdu');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: stagecraftArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.ok(blog.indexOf('fetchPriority="high"') > blog.indexOf('stagecraft-cover.jpg') && blog.indexOf('fetchPriority="high"') < blog.indexOf('trove-cover.jpg'), 'the high-priority image is Stagecraft’s');
  assert.match(blog, /images: \[\{ url: '\/art\/stagecraft-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the Stagecraft card');
  assert.match(blog, /images: \['\/art\/stagecraft-social\.jpg'\]/);
});

test('the images are real screenshots with their true sizes', () => {
  for (const [file, size] of [['stagecraft-cover.jpg', [1672, 940]], ['stagecraft-social.jpg', [1200, 630]]]) {
    assert.deepEqual(Object.values(imageSize(`public/art/${file}`)), size, file);
    assert.match(exportCheck, new RegExp(`'art/${file.replace('.', '\\.')}'`), `${file} is checked in the export`);
  }
  const shots = [...data.matchAll(/(\w+): \{ src: '\/art\/(stagecraft-[\w-]+\.png)', width: (\d+), height: (\d+) \}/g)];
  assert.equal(shots.length, 13, 'thirteen screenshots');
  for (const [, key, file, width, height] of shots) {
    assert.deepEqual(imageSize(`public/art/${file}`), {width: Number(width), height: Number(height)}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/${file}'`), `${file} is checked in the export`);
    assert.match(article + downloadPage, new RegExp(`screenshots\\.${key}\\b`), `${key} is used`);
  }
  const themes = [...data.matchAll(/\{ id: '([a-z]+)', name: '([A-Z][a-z]+)', description: '[^']+' \}/g)].map(([, id]) => id);
  assert.deepEqual(themes, ['aurora', 'editorial', 'midnight', 'pastel', 'corporate', 'mono', 'gradient', 'swiss', 'botanical', 'slate'], 'the ten themes, in the app’s order');
  for (const id of themes) {
    const file = `public/art/stagecraft-theme-${id}.jpg`;
    assert.deepEqual(imageSize(file), {width: 640, height: 360}, file);
    assert.ok(statSync(new URL(`../${file}`, import.meta.url)).size < 60_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/stagecraft-theme-${id}\\.jpg'`), `${id} tile is checked in the export`);
  }
  assert.match(article, /src=\{`\/art\/stagecraft-theme-\$\{theme\.id\}\.jpg`\} width=\{640\} height=\{360\}/, 'the gallery uses the theme tiles');
  const figures = articleBody.match(/<Shot shot=[\s\S]*?<\/Shot>|<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 12, 'cover, gallery and screenshots');
  for (const figure of figures) assert.match(figure, /[Rr]eal screenshot/, 'every figure says it is (made from) a real screenshot');
  assert.match(downloadPage, /A real screenshot of Stagecraft/);
  assert.doesNotMatch(article + downloadPage, /recreat/i, 'no recreated interface on these pages');
  assert.match(articleBody, /test window|windowed test mode/, 'the presenter view shot says it is the windowed test mode');
});

test('the copy stays honest about export limits, licences and testing', () => {
  const both = article + downloadPage + data;
  assert.match(both, /Charts, icons and the theme’s background artwork become pictures/);
  assert.match(both, /Morph becomes a fade/);
  assert.match(both, /[Bb]uilds aren’t exported/);
  assert.match(both, /SmartArt, other chart types, video and sound, ink, embedded objects and animations are left out/);
  assert.match(both, /only followed for positions, text styles and backgrounds/);
  assert.match(article, /approximate/, 'the PDF text layer is described as approximate');
  assert.doesNotMatch(both, /open[- ]source (?:presentation|app)|Stagecraft is open[- ]source|MIT licen[sc]e for Stagecraft/i, 'no licence is chosen for Stagecraft');
  assert.match(article, /href=\{stagecraftArticle\.noticesUrl\}/, 'links the third-party notices');
  assert.match(data, /engineTests: 60,/);
  assert.match(data, /smokeCommands: 83,/);
  assert.match(data, /bigDeck: \{ slides: 200, loadMs: 73, thumbnailsMs: 452 \}/);
  for (const page of [article, downloadPage]) {
    assert.match(page, /SmartScreen/);
    assert.match(page, /\{untested\}|untested\.map|testing\.untested/, 'says what was not tested');
  }
  assert.match(data, /a slide show in real full screen or on a real second display/);
  assert.match(data, /ARM64 hardware/);
  assert.match(data, /real Windows 7 or 8\.1 PCs/);
  assert.match(data, /screen readers/);
  assert.doesNotMatch(both, /never crash|bug[- ]free|fastest|better than PowerPoint/i, 'no unmeasured superlatives');
});

test('the Stagecraft download page offers every edition', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/stagecraft\/'/);
  assert.match(downloadPage, /<StagecraftDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download Stagecraft for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /<summary><span className="stagecraft-nw">SHA-256<\/span> checksums<\/summary>/);
  assert.match(downloadPage, /<code>\{edition\.sha256\}<\/code>/, 'lists every checksum');
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /'@id': `\$\{pageUrl\}#app`/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{stagecraftArticle\.path\}/, 'links back to the field note');
});

test('the Stagecraft update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/stagecraft.json'));
  assert.equal(feed.app, 'Stagecraft', 'Updater.ParseManifest only accepts app "Stagecraft"');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/stagecraft/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like Updater.Edition (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/stagecraft/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/stagecraft\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(exportCheck, /'updates\/stagecraft\.json'/);
  assert.match(exportCheck, /\['stagecraft\.json','Stagecraft'\]/, 'the export check validates the feed');
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
});
