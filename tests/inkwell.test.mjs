import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/inkwell.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/inkwell/page.tsx');
const downloadPage = read('src/app/inkwell/page.tsx');
const blog = read('src/app/blog/page.tsx');
const exportCheck = read('scripts/check-export.mjs');
/** The rendered JSX of the article, without comments or the helpers' own templates. */
const articleBody = article.slice(article.indexOf('export default function')).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
/** The data file's `testing.untested` list. */
const untested = /untested: \[([\s\S]*?)\]/.exec(data)?.[1] ?? '';
const knownGaps = /export const knownGaps = \[([\s\S]*?)\] as const/.exec(data)?.[1] ?? '';

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

test('Inkwell downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.0');
  assert.equal(released, '2026-10-15');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `Inkwell-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [49025506, 43569277, 45073988, 7014508], 'sizes match the installers in the Inkwell repository');
  assert.deepEqual(editions.map(e => e.sha256), [
    'fdb6930b94206e7c24d7755d7c872c4858a6b7ae0cd2d6e242a3427567b00c88',
    'e0cb318b7c1d14fee5a4742706f2e8a296aa5e9722a6081f06fe737ed28bd74b',
    '77ef488ea90313b48ae462f3872d7c9c75e490abc981ea4b91ee2cc5e6699d97',
    '9f46c0c3c54dab81f1223c1eda11ca461c889b141f70fc6aa269dea4c8448d4b',
  ], 'checksums match release/SHA256SUMS.txt');
});

test('downloads point at the Inkwell repository (capital I) over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /repoUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell'/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /noticesUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Inkwell\/blob\/main\/THIRD-PARTY-NOTICES\.txt'/);
  assert.doesNotMatch(data + article + downloadPage + read('public/updates/inkwell.json'), /github\.com\/MuhammadNoman76\/inkwell/, 'the repository name has a capital I');
  assert.doesNotMatch(data, /http:\/\//);
});

test('Inkwell uses the shared Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer|Trove|Stagecraft|Inkwell/, 'no app names baked into the shared picker');
  const wrapper = read('src/components/InkwellDownload.tsx');
  assert.match(wrapper, /^'use client';/, 'the wrapper is the client boundary');
  assert.match(wrapper, /<WindowsDownload appName="Inkwell" version=\{inkwellArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\}\/>/);
});

test('the Inkwell field note is published, linked and has its sections', () => {
  assert.match(article, /<InkwellDownload\/>/);
  assert.match(article, /editions\.map/);
  const ids = ['idea', 'design', 'writing', 'fixes', 'safe', 'serious', 'focus', 'rtl', 'formats', 'engine', 'download', 'next'];
  ids.forEach((id, index) => {
    const number = String(index + 1).padStart(2, '0');
    assert.match(articleBody, new RegExp(`href="#${id}">${number} / `), `${id} is number ${number} in the contents`);
    if (index > 0) assert.match(articleBody, new RegExp(`<section id="${id}"[^>]*><span className="jev-section-number">${number} / `), `${id} section is numbered ${number}`);
    else assert.match(articleBody, /<section id="idea"/);
  });
  assert.equal((articleBody.match(/<section id="/g) ?? []).length, ids.length, 'no section without a contents entry');
  assert.match(article, /\{\/\* LAUNCH VIDEO \(to be added\)/, 'the launch video has a marked place');
  assert.ok(article.indexOf('<section id="engine"') < article.indexOf('LAUNCH VIDEO (to be added)') && article.indexOf('LAUNCH VIDEO (to be added)') < article.indexOf('<section id="download"'), 'the placeholder sits between Under the hood and Download');
  assert.doesNotMatch(articleBody, /id="video"|<video|href="#video"/, 'no empty video section is rendered');
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /'@type': 'BlogPosting'/);
  assert.match(article, /'@type': 'SoftwareApplication', '@id': appId/);
  assert.match(article, /softwareVersion: inkwellArticle\.version/, 'the structured data follows the release');
  assert.match(article, /dateModified: inkwellArticle\.released/);
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/blog/inkwell/\`,lastModified:'${released}'`));
  assert.match(read('src/app/sitemap.ts'), new RegExp(`\\$\\{siteUrl\\}/inkwell/\`,lastModified:'${released}'`));
  const llms = read('public/llms.txt');
  assert.match(llms, /^- Inkwell, a free Windows word processor .*https:\/\/www\.nomanshafiq\.com\/blog\/inkwell\/\r?$/m);
  assert.match(llms, /^- Inkwell download page: https:\/\/www\.nomanshafiq\.com\/inkwell\/\r?$/m);
  assert.match(llms, /^- Inkwell source: https:\/\/github\.com\/MuhammadNoman76\/Inkwell\r?$/m);
  assert.match(llms, /Inkwell[^\n]*Version 1\.0\.0 has four installers/, 'llms.txt names the current version');
  assert.match(read('src/app/layout.tsx'), /import '\.\/inkwell\.css';/);
  assert.match(exportCheck, /'blog\/inkwell','inkwell'/);
  assert.ok(exists('docs/INKWELL-CONTENT.md'), 'evidence doc');
  assert.match(read('AGENTS.md'), /`\/blog\/inkwell\/`/);
  assert.match(read('AGENTS.md'), /`src\/data\/inkwell\.ts`/);
});

test('Inkwell is the first card on the blog index', () => {
  assert.match(blog, /inkwellArticle\.path/);
  assert.match(blog, /href=\{inkwellDownloadPage\.path\}/);
  const order = ['inkwell-cover.jpg', 'stagecraft-cover.jpg', 'trove-cover.jpg', 'vibeplayer-cover.jpg', 'pawsip-cover.png', 'jev-urdu-cover.webp'].map(art => blog.indexOf(art));
  assert.ok(order.every(index => index > 0), 'every card has its cover');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'Inkwell, then Stagecraft, Trove, VibePlayer, PawSip and Jev-Urdu');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: inkwellArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.ok(blog.indexOf('fetchPriority="high"') > blog.indexOf('inkwell-cover.jpg') && blog.indexOf('fetchPriority="high"') < blog.indexOf('stagecraft-cover.jpg'), 'the high-priority image is Inkwell’s');
  assert.match(blog, /src="\/art\/stagecraft-cover\.jpg" width="1672" height="940" alt="[^"]+" loading="lazy"/, 'Stagecraft is no longer the first card, so its image loads lazily');
  assert.match(blog, /images: \[\{ url: '\/art\/inkwell-social\.jpg', width: 1200, height: 630 \}\]/, 'the blog index shares the Inkwell card');
  assert.match(blog, /images: \['\/art\/inkwell-social\.jpg'\]/);
  const readTime = /(\d+) MIN READ/.exec(article)?.[1];
  assert.ok(readTime, 'the article states its reading time');
  assert.match(blog, new RegExp(`<span className="blog-read-time">${readTime} MIN</span>`), 'the blog card shows the same reading time');
});

test('the images are real screenshots with their true sizes', () => {
  for (const [file, size] of [['inkwell-cover.jpg', [1672, 940]], ['inkwell-social.jpg', [1200, 630]]]) {
    assert.deepEqual(Object.values(imageSize(`public/art/${file}`)), size, file);
    assert.match(exportCheck, new RegExp(`'art/${file.replace('.', '\\.')}'`), `${file} is checked in the export`);
  }
  const shots = [...data.matchAll(/(\w+): \{ src: '\/art\/(inkwell-[\w-]+\.png)', width: (\d+), height: (\d+), version: '([\d.]+)' \}/g)];
  assert.equal(shots.length, 23, 'twenty-three screenshots');
  for (const [, key, file, width, height, shotVersion] of shots) {
    assert.deepEqual(imageSize(`public/art/${file}`), {width: Number(width), height: Number(height)}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/${file}'`), `${file} is checked in the export`);
    assert.match(article + downloadPage, new RegExp(`screenshots\\.${key}\\b|\\bs\\.${key}\\b`), `${key} is used`);
    assert.equal(shotVersion, '1.0.0', `${key} shows the released version`);
  }
  const docs = [...data.matchAll(/\{ id: '([a-z-]+)', name: '[^']+', note: '[^']+' \}/g)].map(([, id]) => id);
  assert.deepEqual(docs, ['report', 'letter', 'resume', 'essay', 'urdu-english'], 'the five demo documents, in the app’s order');
  for (const id of docs) {
    const file = `public/art/inkwell-doc-${id}.jpg`;
    assert.deepEqual(imageSize(file), {width: 560, height: 600}, file);
    assert.ok(statSync(new URL(`../${file}`, import.meta.url)).size < 60_000, `${file} stays small`);
    assert.match(exportCheck, new RegExp(`'art/inkwell-doc-${id}\\.jpg'`), `${id} tile is checked in the export`);
  }
  assert.match(article, /src=\{`\/art\/inkwell-doc-\$\{doc\.id\}\.jpg`\} width=\{560\} height=\{600\}/, 'the gallery uses the demo document tiles');
  const figures = articleBody.match(/<Shot shot=[\s\S]*?<\/Shot>|<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 22, 'cover, gallery and screenshots');
  for (const figure of figures) assert.match(figure, /[Rr]eal screenshot/, 'every figure says it is (made from) a real screenshot');
  for (const figure of figures.filter(f => f.startsWith('<Shot'))) assert.match(figure, /Inkwell \{s\.\w+\.version\}/, 'every screenshot caption names its version');
  assert.match(downloadPage, /A real screenshot of Inkwell \{screenshots\.editor\.version\}/);
  assert.doesNotMatch(articleBody + downloadPage, /recreat/i, 'no recreated interface on these pages yet');
  const guides = figures.find(figure => figure.includes('s.pictureGuides')) ?? '';
  assert.match(guides, /capture mode drew/, 'the guides figure says the capture mode drew the guides');
  const history = figures.find(figure => figure.includes('s.history')) ?? '';
  assert.match(history, /demo versions/, 'the version history figure says its versions are demo versions');
});

test('the copy stays honest about Word, licences and testing', () => {
  const both = article + downloadPage + data;
  assert.match(data, /\['Word 97–2003 \.doc files', 'Not supported: open them in Word and save as \.docx', 'unsupported'\]/);
  assert.match(data, /\['Charts, SmartArt, embedded objects, EMF \/ WMF pictures', 'Kept exactly; shown as labelled placeholders', 'placeholder'\]/);
  assert.match(data, /\['Equations', 'Kept exactly; shown as their plain text, not edited', 'shown'\]/, 'equations show as text, not as a placeholder (ParaSource.cs)');
  assert.match(data, /tight wrapping is laid out like square/);
  assert.match(article, /wordCompatibility\.map/, 'the article shows the compatibility table');
  assert.match(data, /documents: 9,\s*values: 117,\s*matched: 116,/);
  assert.match(article, /résumé is two pages in Inkwell and one in Word/, 'the one Word difference is stated');
  assert.match(article, /field result outside its hyperlink|field[^.]*outside its hyperlink/i, 'the bug Word found is told');
  assert.match(data, /engineTests: 323,/);
  assert.match(data, /installerChecks: 23,/);
  assert.match(data, /pages: 301,\s*words: 112_562,/);
  assert.match(data, /\['Open \(load the \.docx\)', '82 ms', '167 ms'\]/);
  assert.match(data, /\['Lay out every page', '2\.6 s', '3\.8 s'\]/);
  assert.match(data, /\['Median keystroke \(edit and relayout\)', '2\.9 ms', '2\.3 ms'\]/);
  for (const item of ['real printer', 'screen readers', 'East Asian input methods', 'languages other than English', 'ARM64 hardware', 'real Windows 7 or 8\\.1 PCs', '32-bit Windows 10', 'PDF viewers'])
    assert.match(untested, new RegExp(item), `untested: ${item}`);
  for (const gap of ['résumé', 'Tight wrapping', 'Text boxes', 'Charts and SmartArt', 'equations appear as their plain text', '0\\.6 to 1\\.6 MB'])
    assert.match(knownGaps, new RegExp(gap), `known gap: ${gap}`);
  for (const page of [article, downloadPage]) {
    assert.match(page, /SmartScreen/);
    assert.match(page, /testing\.untested/, 'says what was not tested');
  }
  assert.match(article, /knownGaps\.map/, 'the article lists the known gaps');
  assert.doesNotMatch(both, /open[- ]source (?:word processor|app)|Inkwell is open[- ]source|MIT licen[sc]e for Inkwell/i, 'no licence is chosen for Inkwell');
  assert.match(both, /Markdig \(BSD-2-Clause\)/);
  assert.match(article, /href=\{inkwellArticle\.noticesUrl\}/, 'links the third-party notices');
  assert.doesNotMatch(both, /Ctrl\+Shift\+E\b/,'Ctrl+Shift+E opens Export in 1.0.0, so no page offers it for track changes');
  assert.doesNotMatch(both, /Page 3 of 10/, 'page numbers with the total read “3 of 10”');
  assert.match(article, /only network use is the update check/, 'the network note matches the README');
  assert.match(article, /never makes itself the default/, 'the installer never takes over .docx');
  assert.doesNotMatch(both, /never crash|bug[- ]free|fastest|better than Word|100% compatible/i, 'no unmeasured superlatives');
});

test('the Inkwell download page offers every edition', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/inkwell\/'/);
  assert.match(data, /description: 'Download Inkwell 1\.0\.0,/);
  assert.match(downloadPage, /<InkwellDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download Inkwell for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /<summary><span className="inkwell-nw">SHA-256<\/span> checksums<\/summary>/);
  assert.match(downloadPage, /<code>\{edition\.sha256\}<\/code>/, 'lists every checksum');
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /'@id': `\$\{pageUrl\}#app`/);
  assert.match(downloadPage, /softwareVersion: inkwellArticle\.version/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{inkwellArticle\.path\}/, 'links back to the field note');
  const numbers = [...downloadPage.matchAll(/<span>(\d\d) \/ /g)].map(([, n]) => n);
  assert.deepEqual(numbers, ['01', '02', '03', '04', '05'], 'the download page sections are numbered in order');
});

test('the Inkwell update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/inkwell.json'));
  assert.equal(feed.app, 'Inkwell', 'Updater.ParseManifest only accepts app "Inkwell"');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/inkwell/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like Updater.Edition (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/Inkwell/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/inkwell\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\r?\n {2}Cache-Control: no-cache\r?\n {2}Content-Type: application\/json\r?$/m, 'the feed is never served stale');
  assert.match(exportCheck, /'updates\/inkwell\.json'/);
  assert.match(exportCheck, /\['inkwell\.json','Inkwell'\]/, 'the export check validates the feed');
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
});
