import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=read('curriculum/catalog-v3.js'),questions=read('curriculum/questions-v3.js');
const ui=read('js/curriculum-v3.js'),voice=read('js/voice-v3.js');
const nav=read('js/navigation-v3.js'),html=read('index.html'),css=read('css/studio-v3.css'),sw=read('sw.js');
const context={window:{}};vm.runInNewContext(catalog,context);vm.runInNewContext(questions,context);
const grades=context.window.LL_CATALOG.grades;
const engine=context.window.LL_QUESTIONS;
test('curriculum exposes Kindergarten to Grade 6, separate Math and English learning journeys',()=>{
  assert.equal(grades.length,7);
  assert.equal(grades[0].label,'Kindergarten');assert.equal(grades[6].label,'Grade 6');
  for(const grade of grades){assert.ok(grade.math.length>=10);assert.ok(grade.english.length>=7);
    for(const topic of [...grade.math,...grade.english])assert.equal(topic.levels,10);}
});
test('all grade topics have ten uniquely answerable questions per level',()=>{
  for(const topic of grades.flatMap(g=>[...g.math,...g.english]))for(let level=1;level<=10;level++){
    const pool=engine.pool(topic,level,10);
    assert.equal(pool.length,10,topic.id+': level '+level);
    assert.equal(new Set(pool.map(q=>q.key)).size,10,topic.id);
    for(const q of pool){
      assert.ok(q.prompt&&q.visual&&q.answer,topic.id);
      assert.equal(q.options.length,4,topic.id);
      assert.equal(new Set(q.options).size,4,topic.id);
      assert.ok(q.options.includes(q.answer),topic.id+': correct answer absent');
    }
  }
});
test('question pools exclude answered questions without reshuffling duplicates',()=>{
  for(const topic of [grades[0].math[0],grades[1].english[0],grades[6].math.at(-1)]){
    const first=engine.pool(topic,1,10);
    const next=engine.pool(topic,1,10,first.map(q=>q.key));
    assert.equal(next.length,10,topic.id);
    assert.ok(next.every(q=>!first.some(old=>old.key===q.key)),topic.id);
  }
});
test('source code parses without frameworks or outside math libraries',()=>{
  for(const asset of [catalog,questions,ui,voice,nav,sw])assert.doesNotThrow(()=>new vm.Script(asset));
  assert.match(ui,/littlelearning\.curriculum\.v3/);
  assert.match(voice,/speechSynthesis/);
  assert.match(voice,/getVoices/);
  assert.match(voice,/voiceURI/);
  assert.match(voice,/femaleNames/);
});
test('professional grade dashboard, voice profile, lesson screen and offline assets are wired',()=>{
  const ids=['llStudio','llGradeSelect','llTopicGrid','llCurrResume','curriculumPage','llCurrPlay','llCurrChoices','llVoiceSelect','llVoicePreview','llCurriculumHistory'];
  for(const id of ids)assert.ok(html.includes('id="'+id+'"'),id);
  for(const asset of ['curriculum/catalog-v3.js','curriculum/questions-v3.js','css/studio-v3.css','js/voice-v3.js','js/curriculum-v3.js','js/navigation-v3.js']){
    assert.ok(html.includes(asset),asset+' missing from HTML');
    assert.ok(sw.includes(asset),asset+' missing from service-worker offline list');
  }
  assert.match(css,/\.llTopicGrid/);
  assert.match(css,/\.llCurrBottom/);
});
test('all existing Quick Play activities remain accessible under Quick Play',()=>{
  assert.ok(html.includes('id="llQuickDetails"'));
  const ids=[...html.matchAll(/data-game="([a-z0-9]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,12);
  assert.equal(new Set(ids).size,12);
});
