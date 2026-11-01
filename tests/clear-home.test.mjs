import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('one clear home journey without duplicate promotional game galleries',()=>{
 assert.match(html,/<section[^>]*id="llStudio"/);
 assert.match(html,/id="unifiedResume"/);
 assert.equal((html.match(/id="unifiedResume"/g)||[]).length,1);
 assert.doesNotMatch(html,/class="adventureQuickFeatures"/,'duplicate Quick Play showcase creates clutter');
 assert.match(html,/id="llQuickDetails"/,'all existing games must remain available');
 assert.equal((html.match(/data-game=/g)||[]).length,12);
});
test('children see one easy-to-read set of learning topics with an optional expand control',()=>{
 assert.match(html,/id="llShowMoreTopics"/);
 assert.match(html,/aria-controls="llTopicGrid"/);
 assert.match(html,/id="llTopicGrid"/);
 assert.match(html,/data-ll-subject="math"/);
 assert.match(html,/data-ll-subject="english"/);
 assert.match(html,/id="llGradeSelect"/);
});
test('avoid unnecessary copy and repeated category headings on home',()=>{
 assert.doesNotMatch(html,/<h2>🎮 Choose a game<\/h2>/);
 assert.doesNotMatch(html,/<h2>Quick Play<\/h2>/,'there should be just the expandable Quick Play section');
 assert.match(html,/100% free, No signup required!/);
});

test('responsive CSS shows six topics by default while keeping all topics accessible',()=>{
 const css=readFileSync(new URL('../css/clear-home-v33.css',import.meta.url),'utf8');
 assert.match(css,/nth-child\(n\+7\)/);
 assert.match(css,/topicsExpanded/);
 assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
});
test('Show all / Show fewer is a real accessible interaction and resets for new grade',async()=>{
 const {runInNewContext}=await import('node:vm');
 const script=readFileSync(new URL('../js/clear-home-v33.js',import.meta.url),'utf8');
 let total=14,observer=null,scrolls=0;
 const classes=new Set();
 const studio={classList:{toggle:(name,val)=>{if(val)classes.add(name);else classes.delete(name)}},querySelector:()=>({scrollIntoView(){scrolls++}})};
 const grid={querySelectorAll:()=>Array.from({length:total},(_,i)=>({i}))};
 const button={attrs:{},handlers:{},hidden:false,textContent:'',
  addEventListener(type,cb){this.handlers[type]=cb},
  setAttribute(k,v){this.attrs[k]=v}
 };
 const grade={handlers:{},addEventListener(type,cb){this.handlers[type]=cb}};
 const subjects=[{handlers:{},addEventListener(type,cb){this.handlers[type]=cb}},{handlers:{},addEventListener(type,cb){this.handlers[type]=cb}}];
 const elements={llStudio:studio,llTopicGrid:grid,llShowMoreTopics:button,llGradeSelect:grade};
 const document={getElementById:id=>elements[id],querySelectorAll:()=>subjects};
 class MutationObserver{constructor(cb){observer=cb}observe(){}}
 runInNewContext(script,{document,MutationObserver});
 assert.equal(button.hidden,false);
 assert.equal(button.attrs['aria-expanded'],'false');
 assert.match(button.textContent,/14 topics/);
 assert.equal(classes.has('topicsExpanded'),false);
 button.handlers.click();
 assert.equal(button.attrs['aria-expanded'],'true');
 assert.equal(classes.has('topicsExpanded'),true);
 button.handlers.click();
 assert.equal(button.attrs['aria-expanded'],'false');
 assert.equal(classes.has('topicsExpanded'),false);
 assert.equal(scrolls,1);
 button.handlers.click();
 grade.handlers.change();
 assert.equal(button.attrs['aria-expanded'],'false');
 total=5;observer();
 assert.equal(button.hidden,true);
});
test('new standalone styles and script are loaded last, versioned and offline cached',()=>{
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 for(const path of ['css/clear-home-v33.css','js/clear-home-v33.js']){
   assert.ok(html.includes(path),path);
   assert.ok(sw.includes(path),path);
 }
 assert.match(sw,/little-learning-v20261102-01/);
});
