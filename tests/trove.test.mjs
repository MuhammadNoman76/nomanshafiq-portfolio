import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = path => existsSync(new URL(`../${path}`, import.meta.url));
const data = read('src/data/trove.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));
const article = read('src/app/blog/trove/page.tsx');
const downloadPage = read('src/app/trove/page.tsx');
const blog = read('src/app/blog/page.tsx');
/** The rendered JSX of the article, without comments or the Shot helper's own template. */
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

test('Trove downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.0');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `Trove-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.deepEqual(editions.map(e => e.bytes), [45423304, 39885122, 41383656, 3804080], 'sizes match the installers in the Trove repository');
  assert.deepEqual(editions.map(e => e.sha256), [
    'd76bff1b3d29131cfce2b2586cc46ed8502c868fdd73cbfc55daf90577356482',
    'e6b8cccd880aae217ed2581a79c67c19b002ef59c53a7af004b56787652ac84c',
    'b2b7abae990cffb1e5508d5c94cd97354da2e05b999f11a6acf0dce68f9c8c3a',
    'd8e4126ae0fc46fa6c05b75e59b63333cbf36a19ab81ba6db7128c7cfac03ea0',
  ], 'checksums match release/SHA256SUMS.txt');
  assert.match(data, /released: '2026-10-13'/);
});

test('downloads point at the Trove repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/Trove\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.match(data, /checksumsUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Trove\/blob\/main\/release\/SHA256SUMS\.txt'/);
  assert.match(data, /noticesUrl: 'https:\/\/github\.com\/MuhammadNoman76\/Trove\/blob\/main\/THIRD-PARTY-NOTICES\.txt'/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('Trove uses the shared Windows download picker', () => {
  const picker = read('src/components/WindowsDownload.tsx');
  assert.doesNotMatch(picker.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /PawSip|VibePlayer|Trove/, 'no app names baked into the shared picker');
  const wrapper = read('src/components/TroveDownload.tsx');
  assert.match(wrapper, /^'use client';/, 'the wrapper is the client boundary');
  assert.match(wrapper, /<WindowsDownload appName="Trove" version=\{troveArticle\.version\} editions=\{editions\} downloadUrl=\{downloadUrl\}\/>/);
});

test('the Trove field note is published, linked and has its sections', () => {
  assert.match(article, /<TroveDownload\/>/);
  assert.match(article, /editions\.map/);
  for (const id of ['idea', 'open', 'make', 'passwords', 'safety', 'explorer', 'engine', 'download', 'next']) {
    assert.match(article, new RegExp(`id="${id}"`), id);
    assert.match(article, new RegExp(`href="#${id}"`), `${id} is in the contents`);
  }
  assert.match(article, /\{\/\* LAUNCH VIDEO \(to be added\)/, 'the launch video has a marked place');
  assert.doesNotMatch(articleBody, /id="video"|<video|href="#video"/, 'no empty video section is rendered');
  assert.match(article, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(article, /'@type': 'BlogPosting'/);
  assert.match(article, /'@type': 'SoftwareApplication', '@id': appId/);
  assert.match(article, /const appId = `\$\{siteUrl\}\$\{downloadPage\.path\}#app`/, 'the app id is shared with the download page');
  assert.match(article, /href=\{downloadPage\.path\}/);
  assert.match(blog, /troveArticle\.path/);
  assert.match(blog, /href=\{troveDownloadPage\.path\}/);
  assert.ok(blog.indexOf('trove-cover.jpg') < blog.indexOf('vibeplayer-cover.jpg'), 'Trove is the first feature');
  assert.ok(blog.indexOf('vibeplayer-cover.jpg') < blog.indexOf('pawsip-cover.png') && blog.indexOf('pawsip-cover.png') < blog.indexOf('jev-urdu-cover.webp'), 'then VibePlayer, PawSip and Jev-Urdu');
  assert.match(blog, /hasPart: \[\{ '@type': 'BlogPosting', headline: troveArticle\.title/);
  assert.equal((blog.match(/fetchPriority="high"/g) ?? []).length, 1, 'only the first card image is high priority');
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/trove\/`,lastModified:'2026-10-13'/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/trove\/`,lastModified:'2026-10-13'/);
  assert.match(read('public/llms.txt'), /^- Trove, a free Windows archive manager .*https:\/\/www\.nomanshafiq\.com\/blog\/trove\/\r?$/m);
  assert.match(read('public/llms.txt'), /^- Trove download page: https:\/\/www\.nomanshafiq\.com\/trove\/\r?$/m);
  assert.match(read('src/app/layout.tsx'), /import '\.\/trove\.css';/);
  assert.match(read('scripts/check-export.mjs'), /'blog\/trove','trove'/);
  assert.ok(exists('docs/TROVE-CONTENT.md'), 'evidence doc');
});

test('the images are real screenshots with their true sizes', () => {
  for (const [file, size] of [['trove-cover.jpg', [1672, 940]], ['trove-social.jpg', [1200, 630]]]) {
    assert.deepEqual(Object.values(imageSize(`public/art/${file}`)), size, file);
  }
  const shots = [...data.matchAll(/(\w+): \{ src: '\/art\/(trove-[\w-]+\.png)', width: (\d+), height: (\d+) \}/g)];
  assert.equal(shots.length, 9, 'nine screenshots');
  for (const [, key, file, width, height] of shots) {
    assert.deepEqual(imageSize(`public/art/${file}`), {width: Number(width), height: Number(height)}, `${file} dimensions`);
    assert.ok(statSync(new URL(`../public/art/${file}`, import.meta.url)).size < 400_000, `${file} stays small`);
    assert.match(read('scripts/check-export.mjs'), new RegExp(`'art/${file}'`), `${file} is checked in the export`);
    assert.match(article + downloadPage, new RegExp(`screenshots\\.${key}\\b`), `${key} is used`);
  }
  const figures = articleBody.match(/<Shot shot=[\s\S]*?<\/Shot>|<figure[\s\S]*?<\/figure>/g) ?? [];
  assert.ok(figures.length >= 9, 'cover, screenshots and the safety pair');
  for (const figure of figures) assert.match(figure, /[Rr]eal screenshot/, 'every figure says it is a real screenshot');
  assert.match(downloadPage, /A real screenshot of Trove/);
  assert.doesNotMatch(article + downloadPage, /recreat/i, 'nothing here is a recreation');
});

test('the copy stays honest about RAR, licensing and testing', () => {
  const both = article + downloadPage;
  assert.match(article, /can&apos;t create them/, 'says plainly that RAR archives cannot be created');
  assert.match(downloadPage, /RAR archives can be opened and extracted, but not created/);
  assert.doesNotMatch(both, /creates? RAR|make RAR|RAR creation/i);
  assert.doesNotMatch(both, /open[- ]source (?:archive|app)|Trove is open[- ]source|MIT licen[sc]e for Trove/i, 'no licence is chosen for Trove');
  assert.match(both, /not affiliated with or endorsed by (?:<span className="trove-nw">)?7-Zip(?:<\/span>)?, Igor Pavlov or RARLAB/);
  assert.match(article, /href=\{troveArticle\.noticesUrl\}/, 'links the third-party notices');
  assert.match(article, /unRAR licence restriction/);
  assert.match(article, /Show more options/, 'Windows 11 menu location is stated');
  assert.match(article, /haven|Not tested yet: the ARM64 edition on ARM hardware, any build on an actual Windows 7 or 8.1 machine, and the all-users installation/);
  assert.match(downloadPage, /haven&apos;t run it on ARM hardware/, 'says what was not tested');
  assert.match(article, /code-reviewed/, 'drag in and out is only code-reviewed');
  assert.match(data, /engineTests = 85;/);
  assert.match(data, /engine = \{ name: '7-Zip', version: '26\.04' \}/);
  assert.match(data, /\['Store \(no compression\)', 0\],\s*\['Fastest', 1\],\s*\['Balanced', 5\],\s*\['Smallest', 9\]/);
  assert.doesNotMatch(both, /every format 7z\.dll|every format the 7-Zip engine/i, 'Trove skips some 7z.dll handlers, so not "every format"');
});

test('the Trove download page offers every edition', () => {
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/trove\/'/);
  assert.match(downloadPage, /<TroveDownload\/>/);
  assert.match(downloadPage, /editions\.map\(edition => <tr/);
  assert.match(downloadPage, /aria-label=\{`Download Trove for \$\{edition\.name\}`\}/);
  assert.match(downloadPage, /<summary><span className="trove-nw">SHA-256<\/span> checksums<\/summary>/);
  assert.match(downloadPage, /<code>\{edition\.sha256\}<\/code>/, 'lists every checksum');
  assert.match(downloadPage, /canonical: downloadPage\.path/);
  assert.match(downloadPage, /'@type': 'SoftwareApplication'/);
  assert.match(downloadPage, /'@id': `\$\{pageUrl\}#app`/);
  assert.match(downloadPage, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(downloadPage, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(downloadPage, /href=\{troveArticle\.path\}/, 'links back to the field note');
  assert.match(downloadPage, /SmartScreen/);
});

test('the Trove update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/trove.json'));
  const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
  assert.equal(feed.app, 'Trove', 'Updater.ParseManifest only accepts app "Trove"');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(feed.page, 'https://www.nomanshafiq.com/trove/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like Updater.Edition (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/Trove/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.doesNotMatch(feed.notes.join(' '), /creates? RAR/i);
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/trove\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(read('scripts/check-export.mjs'), /'updates\/trove\.json'/);
  assert.match(read('scripts/check-export.mjs'), /\['trove\.json','Trove'\]/, 'the export check validates the feed');
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(downloadPage, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
  assert.match(downloadPage, /Settings › Updates/);
});
