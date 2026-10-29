import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext,Script} from 'node:vm';

const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('index.html');
const script=read('js/unified-resume-v32.js');
const css=read('css/unified-resume-v32.css');
const app=read('js/app-v20261030-06.js');
const curriculum=read('js/curriculum-v20261030-06.js');
const sw=read('sw.js');

const sampleQuick=(updatedAt=1000,game='math')=>({
 game,level:2,total:10,levelIndex:4,stars:3,
 current:{mode:'count',answer:5},updatedAt,finished:false
});
const sampleTopic=(lastActive=2000)=>({
 level:1,questionIndex:2,stars:2,finished:false,lastActive,
 current:{answer:5}
});
const topic={id:'math-0-measure-0',name:'Measuring & Size',icon:'📏',grade:0,subject:'math'};
function mock(entries={}){
 const saved=new Map(Object.entries(entries).map(([key,value])=>[key,JSON.stringify(value)]));
 const panel={hidden:true};
 const button={handlers:{},attributes:{},textContent:'',
  addEventListener(type,fn){this.handlers[type]=fn},
  setAttribute(k,v){this.attributes[k]=v},
  click(){this.handlers.click?.()}
 };
 const items={
  unifiedResume:panel,unifiedResumeButton:button,
  unifiedResumeIcon:{textContent:''},unifiedResumeTitle:{textContent:''},
  unifiedResumeDetails:{textContent:''},
  homePage:{classList:{contains:()=>true}}
 };
 const calls=[];
 const window={
  LL_STUDIO:{catalog:{byId:{[topic.id]:topic},grades:[{label:'Kindergarten'}]},openTopic(id){calls.push(['curriculum',id])}},
  resumeGame(game){calls.push(['quick',game])},
  addEventListener(){}
 };
 const context={
  window, document:{getElementById:id=>items[id]||null},
  localStorage:{getItem:key=>saved.get(key)||null},
  MutationObserver:class {observe(){}}
 };
 runInNewContext(script,context);
 return {items,window,calls,button,panel,saved};
}
test('exactly one on-screen Continue Learning banner and no duplicate panels',()=>{
 assert.equal((html.match(/id="unifiedResume"/g)||[]).length,1);
 assert.equal((html.match(/id="unifiedResumeButton"/g)||[]).length,1);
 assert.doesNotMatch(html,/id="resumePanel"|id="llCurrResume"/);
 assert.match(html,/class="unifiedResume"/);
 assert.match(css,/\.unifiedResume\[hidden\]/);
});
test('all modified scripts parse and original save key formats are preserved',()=>{
 for(const s of [script,app,curriculum,sw])assert.doesNotThrow(()=>new Script(s));
 assert.match(app,/littlelearning\.progress\.v1\./);
 assert.match(curriculum,/littlelearning\.curriculum\.v3/);
 assert.match(app,/LL_REFRESH_RESUME/);
 assert.match(curriculum,/LL_REFRESH_RESUME/);
});
test('when there are no saved games, the single ribbon stays hidden',()=>{
 const ui=mock();
 assert.equal(ui.panel.hidden,true);
});
test('Quick Play activity resumes when it is the only saved progress',()=>{
 const ui=mock({'littlelearning.progress.v1.math':sampleQuick()});
 assert.equal(ui.panel.hidden,false);
 assert.equal(ui.items.unifiedResumeTitle.textContent,'Math');
 assert.match(ui.items.unifiedResumeDetails.textContent,/Level 2 • Question 4\/10/);
 ui.button.click();
 assert.deepEqual(ui.calls,[['quick','math']]);
});
test('newer curriculum lesson wins even if a Quick Play game was last opened',()=>{
 const ui=mock({
  'littlelearning.progress.v1.math':sampleQuick(1000),
  'littlelearning.curriculum.v3':{topics:{[topic.id]:sampleTopic(2000)}}
 });
 assert.equal(ui.items.unifiedResumeTitle.textContent,'Measuring & Size');
 assert.match(ui.items.unifiedResumeDetails.textContent,/Kindergarten • Level 1 • Question 3\/10/);
 ui.button.click();
 assert.deepEqual(ui.calls,[['curriculum',topic.id]]);
});
test('newer Quick Play game wins over older curriculum progress',()=>{
 const ui=mock({
  'littlelearning.progress.v1.english':sampleQuick(3000,'english'),
  'littlelearning.curriculum.v3':{topics:{[topic.id]:sampleTopic(2000)}}
 });
 assert.equal(ui.items.unifiedResumeTitle.textContent,'English');
 ui.button.click();
 assert.deepEqual(ui.calls,[['quick','english']]);
});
test('finished and invalid progress does not get a resume button',()=>{
 const ui=mock({
  'littlelearning.progress.v1.math':{...sampleQuick(5000),finished:true},
  'littlelearning.curriculum.v3':{topics:{[topic.id]:{...sampleTopic(7000),finished:true}}}
 });
 assert.equal(ui.panel.hidden,true);
});
test('refresh before click chooses the newest saved activity without losing progress',()=>{
 const ui=mock({
  'littlelearning.progress.v1.math':sampleQuick(1000),
  'littlelearning.curriculum.v3':{topics:{[topic.id]:sampleTopic(2000)}}
 });
 ui.saved.set('littlelearning.progress.v1.math',JSON.stringify(sampleQuick(9000)));
 ui.button.click();
 assert.deepEqual(ui.calls,[['quick','math']]);
});
test('new versioned files are referenced in HTML and cached for offline use',()=>{
 for(const path of [
  'js/app-v20261030-06.js',
  'js/curriculum-v20261030-06.js',
  'js/unified-resume-v32.js',
  'css/unified-resume-v32.css'
 ]){assert.ok(html.includes(path),path);assert.ok(sw.includes(path),path)}
 assert.match(sw,/little-learning-v20261030-06/);
 assert.equal((html.match(/data-game=/g)||[]).length,12);
});
