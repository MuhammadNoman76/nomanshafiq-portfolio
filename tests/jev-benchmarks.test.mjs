import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../public/benchmarks/jev-urdu-results.json', import.meta.url), 'utf8'));

function readCsv(file) {
  const lines = readFileSync(new URL(`../public/benchmarks/${file}`, import.meta.url), 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const fields = line => [...line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map(match => (match[1] ?? match[2]).replace(/""/g, '"'));
  const header = fields(lines.shift());
  return lines.map(line => Object.fromEntries(fields(line).map((value, index) => [header[index], value])));
}

test('published chart metrics preserve all source CSV values and counts', () => {
  const source = readCsv('jev-urdu-metrics.csv');
  assert.equal(source.length, 40);
  assert.equal(data.metrics.length, source.length);
  for (const row of source) {
    const published = data.metrics.find(item => ['benchmark', 'prompt', 'model'].every(key => item[key] === row[key]));
    assert.ok(published, `Missing source result: ${JSON.stringify(row)}`);
    for (const field of ['decisions', 'accuracy', 'macro_f1', 'log_loss', 'brier', 'ece', 'confidence', 'majority_class']) {
      assert.equal(published[field], row[field] === '' ? null : Number(row[field]), `${row.benchmark}/${row.prompt}/${row.model}/${field}`);
    }
    assert.ok(published.accuracy >= 0 && published.accuracy <= 1);
  }
});

test('comparison deltas agree with accuracy and include positive and negative findings', () => {
  const source = readCsv('jev-urdu-deltas.csv');
  assert.equal(data.deltas.length, source.length);
  const keys = Object.keys(source[0]);
  assert.equal(source.length, 30);
  let positive = 0, negative = 0, inconclusive = 0;
  for (const row of data.deltas) {
    const match = predicate => data.metrics.find(item => item.benchmark === row.benchmark && item.prompt === row.prompt && predicate(item));
    const jev = match(item => item.model === 'jev-urdu');
    const baseline = match(item => item.model === row[keys[2]]);
    assert.ok(jev && baseline);
    const delta = row[keys[3]], low = row[keys[4]], high = row[keys[5]];
    assert.ok(Math.abs(jev.accuracy - baseline.accuracy - delta) < 1e-12);
    assert.ok(low <= delta && delta <= high);
    assert.equal(row.significant === 'yes', low > 0 || high < 0);
    if (low > 0) positive++;
    else if (high < 0) negative++;
    else inconclusive++;
  }
  assert.ok(positive > 0 && negative > 0 && inconclusive > 0);
});

test('matched API comparison stays distinct from full-suite results', () => {
  assert.equal(data.headToHead.length, 9);
  assert.equal(data.headToHeadDeltas.length, 9);
  const external = data.headToHead.filter(row => row.benchmark !== 'Laya-Urdu test');
  assert.equal(external.length, 8);
  for (const row of external) {
    assert.equal(row.decisions, 100);
    assert.equal(Object.keys(row.scores).length, 6);
    assert.ok('jev (TypeSafe)' in row.scores);
    const full = data.metrics.find(item => item.benchmark === row.benchmark && item.prompt === row.prompt && item.model === 'jev-urdu');
    assert.ok(full.decisions > row.decisions);
  }
  assert.equal(data.headToHead.find(row => row.benchmark === 'Laya-Urdu test').decisions, 232);
  assert.equal(data.throughput.find(row => row.model === 'jev-urdu').decisions, 22775);
});
