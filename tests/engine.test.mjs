import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {buildMesh,clamp,lerp} from '../public/engine/sculpture.mjs';
import config from '../next.config.mjs';

test('camera values clamp at both boundaries',()=>{assert.equal(clamp(-2,0,1),0);assert.equal(clamp(2,0,1),1);assert.equal(clamp(.5,0,1),.5);});
test('interpolation preserves endpoints and midpoint',()=>{assert.equal(lerp(1,7,0),1);assert.equal(lerp(1,7,1),7);assert.equal(lerp(1,7,.5),4);});
test('three mesh targets have stable topology',()=>{const m=buildMesh(80,12);assert.equal(m.targets.length,3);for(const t of m.targets){assert.equal(t.positions.length,81*13*3);assert.equal(t.normals.length,t.positions.length);}assert.equal(m.indices.length,80*12*6);});
test('all vertex indices are valid unsigned 16-bit values',()=>{const m=buildMesh();const count=m.targets[0].positions.length/3;assert.ok(count<65536);for(const i of m.indices)assert.ok(i>=0&&i<count);});
test('all vertex positions and normals are finite',()=>{const m=buildMesh(100,16);for(const t of m.targets){for(const p of t.positions)assert.ok(Number.isFinite(p));for(const n of t.normals)assert.ok(Number.isFinite(n));}});
test('surface normals are normalized',()=>{for(const t of buildMesh(60,10).targets)for(let i=0;i<t.normals.length;i+=3)assert.ok(Math.abs(Math.hypot(...t.normals.slice(i,i+3))-1)<.00001);});
test('shape modes are distinct geometries, not CSS transforms',()=>{const m=buildMesh(50,10);assert.notDeepEqual(m.targets[0].positions,m.targets[1].positions);assert.notDeepEqual(m.targets[1].positions,m.targets[2].positions);});
test('Cloudflare Pages uses a real static export configuration',()=>{assert.equal(config.output,'export');assert.equal(config.trailingSlash,true);assert.equal(config.images.unoptimized,true);assert.equal(config.poweredByHeader,false);});
test('runtime is local and has no CDN or third-party fetch dependency',()=>{for(const name of ['experience.mjs','sculpture.mjs']){const js=readFileSync(new URL('../public/engine/'+name,import.meta.url),'utf8');assert.equal(/\bfetch\s*\(/.test(js),false);assert.equal(/https?:\/\//.test(js),false);}});
test('all source assets and fallback shape views exist',()=>{for(const name of ['hero','hero-flow','hero-reimagine','langvoice','resumeworld','metamod','reelsbuilder','lughaat'])assert.ok(existsSync(new URL('../public/art/'+name+'.webp',import.meta.url)));assert.ok(existsSync(new URL('../public/files/muhammad-noman-resume.pdf',import.meta.url)));});
test('project routes are statically enumerated',()=>{const src=readFileSync(new URL('../src/app/work/[slug]/page.tsx',import.meta.url),'utf8');assert.match(src,/generateStaticParams/);assert.match(src,/dynamicParams\s*=\s*false/);assert.match(src,/await params/);});
test('reduced motion and WebGL fallback are explicit',()=>{const js=readFileSync(new URL('../public/engine/experience.mjs',import.meta.url),'utf8');assert.match(js,/prefers-reduced-motion/);assert.match(js,/webglcontextlost/);assert.match(js,/visibilitychange/);assert.match(js,/hero-reimagine\.webp/);});

test('invalid mesh sizes fail before allocation',()=>{for(const args of [[0,24],[220,0],[1000,100],[3.5,20]])assert.throws(()=>buildMesh(...args),RangeError);});
