import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=file('index.html');
const script=file('js/adventure-home-v31.js');
const css=file('css/adventure-home-v31.css');
const fox=file('assets/fox-mascot-v31.svg');
const sw=file('sw.js');

test('the home page has original illustrated mascot, child greeting, subject selection and grade selector',()=>{
  assert.match(html,/id="helloHeading"/);
  assert.match(html,/assets\/fox-mascot-v31\.svg/);
  assert.match(html,/id="llGradeSelect"/);
  assert.match(html,/data-ll-subject="math"/);
  assert.match(html,/data-ll-subject="english"/);
  assert.match(html,/id="llTopicGrid"/);
  assert.match(html,/LITTLE LEARNERS/);
});

test('four Quick Play illustrations launch existing real games',()=>{
 const featured=[...html.matchAll(/data-featured-game="([a-z0-9]+)"/g)].map(m=>m[1]);
 const existing=[...html.matchAll(/data-game="([a-z0-9]+)"/g)].map(m=>m[1]);
 assert.deepEqual(featured,['math','english','find','matchnum']);
 assert.equal(existing.length,12);
 for(const id of featured) assert.ok(existing.includes(id),'Unknown Quick Play game: '+id);
 assert.match(script,/original\.click\(\)/);
 assert.match(html,/id="llQuickDetails"/);
});

test('original SVG and responsive home artwork are self contained, without external image requests',()=>{
 assert.match(fox,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(fox,/<linearGradient/);
 assert.ok(!/href="https?:\/\//.test(fox));
 assert.match(css,/\.adventure-art/);
 assert.match(css,/\.scene-actors/);
 assert.match(css,/\.adventureHeroFox/);
 assert.match(css,/@media\(max-width:599px\)/);
 assert.match(css,/@media\(min-width:1700px\)/);
 assert.match(css,/prefers-reduced-motion/);
});

test('adventure JavaScript parses and re-decorates topic grid across grades without replacing cards',()=>{
 assert.doesNotThrow(()=>new Script(script));
 assert.match(script,/new MutationObserver\(decorate\)/);
 assert.match(script,/topic\.kind/);
 assert.match(script,/button\.insertBefore\(art,status\)/);
 assert.match(script,/dataset\.adventureReady/);
});

test('new home assets are referenced, cache-busted and available offline',()=>{
 for(const path of ['css/adventure-home-v31.css','js/adventure-home-v31.js','assets/fox-mascot-v31.svg']){
  assert.ok(html.includes(path),path+' missing from HTML');
  assert.ok(sw.includes(path),path+' missing from service worker');
 }
 assert.match(sw,/little-learning-v20261030-06/);
});

test('old games and profile/progress navigation remain unchanged',()=>{
 for(const id of ['profileMenuBtn','menuProfile','menuHistory','menuContact','unifiedResume','unifiedResumeButton','unifiedResumeDetails','curriculumPage','llCurrLevel']){
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
 }
 assert.equal((html.match(/id="unifiedResume"/g)||[]).length,1);
 assert.equal((html.match(/id="resumePanel"|id="llCurrResume"/g)||[]).length,0);
 assert.match(html,/js\/curriculum-v20261030-06\.js/);
 assert.match(html,/js\/experience-v20261030-02\.js/);
 assert.match(html,/js\/voice-v3\.js/);
});
