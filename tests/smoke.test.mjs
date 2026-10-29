import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const engine=readFileSync(new URL('../js/app-v20261030-01.js',import.meta.url),'utf8');
const experience=readFileSync(new URL('../js/experience-v20261030-02.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../css/experience-v20261030-02.css',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
test('all JavaScript assets parse',()=>{
  assert.doesNotThrow(()=>new Script(engine));
  assert.doesNotThrow(()=>new Script(experience));
  assert.doesNotThrow(()=>new Script(sw));
});
test('twelve original game tiles are preserved',()=>{
  const gameIds=[...html.matchAll(/data-game="([a-z0-9]+)"/g)].map(m=>m[1]);
  assert.equal(gameIds.length,12);
  assert.equal(new Set(gameIds).size,12);
  for(const removed of ['workbook','runner','findway'])assert.ok(!gameIds.includes(removed));
});
test('home has no visible level selector and Contact Us lives in user dropdown',()=>{
  assert.match(html,/<select id="levelSelect" hidden/);
  assert.doesNotMatch(html,/<label>Level\s*<select/);
  assert.match(html,/id="menuContact"/);
  assert.match(html,/id="profileMenuBtn"/);
  assert.doesNotMatch(html,/id="contactBtn"/);
});
test('onboarding, accessible profile and history are present',()=>{
  for(const id of ['welcomeOverlay','welcomeName','profileForm','profileName','historyPage','historyItems','questionSelect','levelDots']) assert.ok(html.includes('id="'+id+'"'),id);
  assert.match(experience,/window\.start=function\(game\)/);
  assert.match(experience,/savedProgress\(game\)/);
  assert.match(experience,/storeCompletedLevel/);
  assert.match(experience,/littlelearning\.profile\.v2/);
  assert.match(experience,/littlelearning\.completions\.v2/);
});
test('all redesign assets are referenced and offline cached',()=>{
  for(const file of ['css/experience-v20261030-02.css','js/experience-v20261030-02.js']){
    assert.ok(html.includes(file));
    assert.ok(sw.includes(file));
  }
  assert.match(css,/\.gameGrid/);
  assert.match(css,/\.welcomeOverlay/);
  assert.match(css,/prefers-reduced-motion/);
});
