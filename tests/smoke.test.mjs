import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const engine=readFileSync(new URL('../js/app-v20261030-06.js',import.meta.url),'utf8');
const experience=readFileSync(new URL('../js/experience-v20261030-02.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../css/experience-v20261030-02.css',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const layout=readFileSync(new URL('../css/layout-v20261030-03.css',import.meta.url),'utf8');
const navigation=readFileSync(new URL('../js/navigation-v3.js',import.meta.url),'utf8');
test('all JavaScript assets parse',()=>{
  assert.doesNotThrow(()=>new Script(engine));
  assert.doesNotThrow(()=>new Script(experience));
  assert.doesNotThrow(()=>new Script(navigation));
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

test('clickable Little Learning logo safely navigates home',()=>{
  assert.match(html,/id="brandHomeBtn"/);
  assert.match(html,/<button class="brandHome"/);
  assert.match(navigation,/brand\.addEventListener\('click'/);
  for(const id of ['homeBtn','profileBack','historyBack','contactBackBtn'])assert.ok(navigation.includes("'"+id+"'"),id);
});
test('game footer places level and question/score/stars below the play surface',()=>{
  const play=html.slice(html.indexOf('<section id="playPage"'),html.indexOf('</section>',html.indexOf('<section id="playPage"')));
  const area=play.indexOf('id="playArea"'),footer=play.indexOf('id="gameFooter"');
  assert.ok(area>=0 && footer>area);
  for(const id of ['levelChip','levelQuestion','levelDots','questionMeterFill','questionNumber','scoreText','starsText']) assert.ok(play.indexOf('id="'+id+'"')>footer,id);
  assert.match(layout,/body\.isGameActive \.siteHeader\{display:none!important\}/);
  assert.match(layout,/#playPage \.gameFooter/);
});
test('desktop homepage uses wide 6-column layout and retains touch-friendly mobile grid',()=>{
  assert.match(layout,/@media\(min-width:1180px\)/);
  assert.match(layout,/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(layout,/@media\(max-width:599px\)/);
  assert.match(layout,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(layout,/\.app\{width:100%;max-width:none/);
});
test('new assets are cache busted and available offline',()=>{
  for(const asset of ['css/layout-v20261030-03.css','js/navigation-v3.js']){
    assert.ok(html.includes(asset),asset);
    assert.ok(sw.includes(asset),asset);
  }
  assert.match(sw,/little-learning-v20261030-06/);
});
