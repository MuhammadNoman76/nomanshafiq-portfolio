import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = read('src/data/pawsip.ts');
const version = /version: '([\d.]+)'/.exec(data)?.[1];
const editions = [...data.matchAll(/id: '([\w-]+)', name: '([^']+)'[\s\S]*?file: '([^']+)', bytes: (\d+), sha256: '([^']+)'/g)]
  .map(([, id, name, file, bytes, sha256]) => ({id, name, file, bytes: Number(bytes), sha256}));

test('PawSip downloads cover every supported Windows edition', () => {
  assert.equal(version, '1.0.2');
  assert.deepEqual(editions.map(e => e.id), ['x64', 'arm64', 'x86', 'win7-8']);
  for (const edition of editions) {
    assert.equal(edition.file, `PawSip-Setup-${version}-${edition.id}.exe`, edition.id);
    assert.match(edition.sha256, /^[0-9a-f]{64}$/, `${edition.id} checksum`);
    assert.ok(edition.bytes > 1_000_000 && edition.bytes < 100_000_000, `${edition.id} size`);
  }
  assert.equal(new Set(editions.map(e => e.sha256)).size, editions.length, 'checksums are distinct');
  assert.ok(editions.find(e => e.id === 'win7-8').bytes < editions.find(e => e.id === 'x64').bytes, 'the .NET Framework edition is the small one');
  assert.deepEqual(editions.map(e => e.bytes), [50865639, 44706867, 46277685, 2605368], 'sizes match the published installers');
});

test('downloads point at the published PawSip repository over HTTPS', () => {
  assert.match(data, /https:\/\/github\.com\/MuhammadNoman76\/PawSip\/raw\/refs\/heads\/main\/release\/\$\{edition\.file\}/);
  assert.doesNotMatch(data, /http:\/\//);
});

test('the PawSip field note is published, linked and has its artwork', () => {
  const page = read('src/app/blog/pawsip/page.tsx');
  assert.match(page, /<PawSipDownload\/>/);
  assert.match(page, /editions\.map/);
  assert.match(page, /id="download"/);
  for (const art of ['pawsip-cover.png', 'pawsip-social.jpg', 'pawsip-moods.png', 'pawsip-dashboard.png']) {
    assert.ok(existsSync(new URL(`../public/art/${art}`, import.meta.url)), `public/art/${art}`);
  }
  assert.match(read('src/app/blog/page.tsx'), /pawsipArticle\.path/);
  assert.match(read('src/app/sitemap.ts'), /\/blog\/pawsip\//);
  assert.match(read('public/llms.txt'), /\/blog\/pawsip\//);
});

test('the PawSip download page offers every edition and is linked across the site', () => {
  const page = read('src/app/pawsip/page.tsx');
  assert.match(data, /export const downloadPage = \{[\s\S]*?path: '\/pawsip\/'/);
  assert.match(page, /<PawSipDownload\/>/);
  assert.match(page, /<PawSipCat\/>/);
  assert.match(page, /editions\.map\(edition => <tr/);
  assert.match(page, /aria-label=\{`Download PawSip for \$\{edition\.name\}`\}/);
  assert.match(page, /SHA-256 checksums/);
  assert.match(page, /canonical: downloadPage\.path/);
  assert.match(page, /'@type': 'SoftwareApplication'/);
  assert.match(page, /downloadUrl: editions\.map\(downloadUrl\)/);
  assert.match(page, /JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/, 'structured data is escaped');
  assert.match(page, /href=\{pawsipArticle\.path\}/, 'links back to the field note');
  assert.match(page, /haven&apos;t run it on ARM hardware/, 'says what was not tested');
  assert.match(read('src/app/blog/pawsip/page.tsx'), /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/blog/page.tsx'), /href=\{downloadPage\.path\}/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/pawsip\/`,lastModified:'2026-10-13'/);
  assert.match(read('src/app/sitemap.ts'), /\$\{siteUrl\}\/blog\/pawsip\/`,lastModified:'2026-10-13'/);
  assert.match(read('public/llms.txt'), /^- PawSip download page: https:\/\/www\.nomanshafiq\.com\/pawsip\/\r?$/m);
  assert.match(read('scripts/check-export.mjs'), /'blog\/pawsip','pawsip'/);
});

test('the PawSip update feed offers the same installers as the download pages', () => {
  const feed = JSON.parse(read('public/updates/pawsip.json'));
  const released = /released: '(\d{4}-\d{2}-\d{2})'/.exec(data)?.[1];
  const page = read('src/app/pawsip/page.tsx');
  const article = read('src/app/blog/pawsip/page.tsx');
  assert.equal(feed.app, 'PawSip');
  assert.equal(feed.version, version, 'the app is offered the version the pages offer');
  assert.equal(feed.released, released);
  assert.equal(released, '2026-10-13');
  assert.equal(feed.page, 'https://www.nomanshafiq.com/pawsip/');
  assert.ok(Array.isArray(feed.notes) && feed.notes.length > 0 && feed.notes.every(note => typeof note === 'string' && note.trim()), 'release notes');
  assert.deepEqual(Object.keys(feed.editions), editions.map(e => e.id), 'one entry per edition, keyed like the app (x64, arm64, x86, win7-8)');
  for (const edition of editions) {
    const entry = feed.editions[edition.id];
    assert.deepEqual(Object.keys(entry).sort(), ['sha256', 'size', 'url'], edition.id);
    assert.equal(entry.url, `https://github.com/MuhammadNoman76/PawSip/raw/refs/heads/main/release/${edition.file}`, `${edition.id} url`);
    assert.equal(entry.sha256, edition.sha256, `${edition.id} sha256`);
    assert.equal(entry.size, edition.bytes, `${edition.id} size`);
  }
  assert.match(data, /export const updateFeed = 'https:\/\/www\.nomanshafiq\.com\/updates\/pawsip\.json';/);
  assert.match(read('public/_headers'), /^\/updates\/\*\n {2}Cache-Control: no-cache\n {2}Content-Type: application\/json$/m, 'the feed is never served stale');
  assert.match(read('scripts/check-export.mjs'), /'updates\/pawsip\.json'/);
  assert.match(article, /<code>\{updateFeed\}<\/code>/, 'the article says what the update check reads');
  assert.match(page, /<code>\{updateFeed\}<\/code>/, 'the download page says what the update check reads');
  assert.match(page, /Settings › Updates/);
  assert.match(page, /keeps itself up to date/i);
  assert.doesNotMatch(page + article, /no network access/, 'no longer claims the app never goes online');
});
