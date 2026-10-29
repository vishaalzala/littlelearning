/* Little Learning 3.0: self-contained grade / subject / topic player.
   Keeps the original 12 Quick Play activities, profiles and saved progress. */
(function(){
 'use strict';
 const cat=window.LL_CATALOG,engine=window.LL_QUESTIONS;
 if(!cat||!engine)return;
 const $=id=>document.getElementById(id);
 const storeKey='littlelearning.curriculum.v3',settingsKey='littlelearning.curriculum.settings.v3';
 const read=(k,def)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||def}catch(e){return def}};
 const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 const state=read(storeKey,{topics:{},completed:[]}),settings=read(settingsKey,{grade:0,subject:'math'});
 if(!state.topics||typeof state.topics!=='object')state.topics={};
 if(!Array.isArray(state.completed))state.completed=[];
 let current=null,locked=false,transition=null,selected=null,ghost=null;
 const name=t=>t.name;
 const say=text=>{try{if(window.speak)window.speak(text)}catch(e){}};
 function show(id){
   clearTimeout(transition);
   document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
   document.body.classList.toggle('isGameActive',id==='curriculumPage');
   window.scrollTo(0,0);
 }
 function template(id,html){const el=$(id);if(el)el.innerHTML=html}
 function setup(){
   if($('llGradeSelect'))$('llGradeSelect').addEventListener('change',e=>{settings.grade=+e.target.value;saveSettings();renderTopics()});
   document.querySelectorAll('[data-ll-subject]').forEach(b=>b.addEventListener('click',()=>{settings.subject=b.dataset.llSubject;saveSettings();renderTopics()}));
   if($('llTopicGrid'))$('llTopicGrid').addEventListener('click',e=>{const b=e.target.closest('[data-ll-topic]');if(b)openTopic(b.dataset.llTopic)});
   if($('llCurrHome'))$('llCurrHome').addEventListener('click',goHome);
   if($('llCurrSound'))$('llCurrSound').addEventListener('click',()=>{if(current&&current.question)say(current.question.spoken||current.question.prompt)});
   if($('llHintBtn'))$('llHintBtn').addEventListener('click',()=>{if(current&&current.question){const hint=current.question.hint||'Try again';$('llHintText').textContent=hint;say(hint)}});
   if($('llCurrChoices'))$('llCurrChoices').addEventListener('click',e=>{const b=e.target.closest('[data-ll-answer]');if(b)answer(b.dataset.llAnswer)});
   for(const id of ['menuProfile','menuHistory','menuContact'])if($(id))$(id).addEventListener('click',()=>{$('curriculumPage')?.classList.remove('active');document.body.classList.remove('isGameActive')});
   if($('historyPage'))new MutationObserver(()=>{if($('historyPage').classList.contains('active'))renderHistory()}).observe($('historyPage'),{attributes:true,attributeFilter:['class']});
   renderTopics();
 }
 function saveSettings(){write(settingsKey,settings)}
 function save(){write(storeKey,state)}
 function getProgress(topic){
   const p=state.topics[topic.id];
   return p&&typeof p==='object'?p:null;
 }
 function progress(topic){
   if(!state.topics[topic.id])state.topics[topic.id]={level:1,questionIndex:0,stars:0,score:0,question:null,used:{},completed:[],lastActive:Date.now()};
   return state.topics[topic.id];
 }
 function grade(){return cat.grades[settings.grade]||cat.grades[0]}
 function renderTopics(){
   if(!$('llTopicGrid'))return;
   const g=grade(),topics=g[settings.subject]||g.math;
   if($('llGradeSelect'))$('llGradeSelect').value=String(settings.grade);
   document.querySelectorAll('[data-ll-subject]').forEach(b=>{const yes=b.dataset.llSubject===settings.subject;b.classList.toggle('isSelected',yes);b.setAttribute('aria-pressed',String(yes))});
   if($('llSelectedGrade'))$('llSelectedGrade').textContent=g.label+' • '+(settings.subject==='math'?'Math':'English');
   const nDone=topics.filter(t=>getProgress(t)?.finished).length;
   if($('llTopicCount'))$('llTopicCount').textContent=nDone+' of '+topics.length+' topics finished';
   const grid=$('llTopicGrid');grid.replaceChildren();
   topics.forEach(topic=>{
     const p=getProgress(topic);
     const b=document.createElement('button');b.type='button';b.className='llTopic';
     b.dataset.llTopic=topic.id;
     const em=document.createElement('span');em.className='llTopicIcon';em.textContent=topic.icon;
     const title=document.createElement('strong');title.textContent=topic.name;
     const detail=document.createElement('span');detail.className='llTopicStatus';
     detail.textContent=p?.finished?'🏆 Completed':p?'▶ Level '+p.level+' • '+(p.questionIndex+1)+'/10':'Start Level 1';
     const bar=document.createElement('div');bar.className='llTopicProgress';
     const fill=document.createElement('span');fill.style.width=((p?.finished?10:(p?.level||1)-1)*10)+'%';
     bar.appendChild(fill);b.append(em,title,detail,bar);grid.appendChild(b);
   });
   renderContinue();
 }
 function renderContinue(){
   const saved=cat.topics.filter(t=>getProgress(t)&&!getProgress(t).finished);
   saved.sort((a,b)=>(getProgress(b).lastActive||0)-(getProgress(a).lastActive||0));
   const t=saved[0],box=$('llCurrResume');
   if(!box)return;
   box.hidden=!t;
   if(!t)return;
   const p=getProgress(t);
   $('llCurrResumeText').textContent=t.icon+' '+t.name+' • '+cat.grades[t.grade].label+' • Level '+p.level;
   $('llCurrResumeBtn').onclick=()=>openTopic(t.id);
 }
 function openTopic(id){
   const t=cat.byId[id];if(!t)return;
   const p=progress(t);if(p.finished){p.finished=false;p.level=1;p.questionIndex=0;p.question=null;p.used={};p.stars=0;p.score=0;p.completed=[]}
   current={topic:t,progress:p,question:p.question||null};
   p.lastActive=Date.now();save();
   if($('llCurrTitle'))$('llCurrTitle').textContent=t.icon+' '+t.name;
   show('curriculumPage');nextQuestion(true);
 }
 function clean(){
   if(ghost)ghost.remove();ghost=null;selected=null;
   const feedback=$('llCurrFeedback');if(feedback)feedback.textContent='';
   const hint=$('llHintText');if(hint)hint.textContent='';
 }
 function nextQuestion(replay=false){
   if(!current)return;
   clean();locked=false;
   const p=current.progress,t=current.topic;
   if(p.questionIndex>=10){
     const oldLevel=p.level;
     if(!p.completed.includes(oldLevel)){
       p.completed.push(oldLevel);
       state.completed.push({topicId:t.id,topic:t.name,subject:t.subject,grade:t.grade,level:oldLevel,stars:p.stars,score:p.score,date:new Date().toISOString()});
     }
     p.level++;p.questionIndex=0;p.question=null;
     if(p.level>10){
       p.finished=true;p.question=null;save();
       const list=cat.grades[t.grade][t.subject],i=list.findIndex(x=>x.id===t.id),next=list[i+1];
       $('llCurrPlay').hidden=true;$('llCurrCelebration').hidden=false;
       $('llCurrCelebration').replaceChildren();
       const h=document.createElement('h2');h.textContent='🏆 '+t.name+' complete!';
       const ptext=document.createElement('p');ptext.textContent='Great job! You finished all 10 levels.';
       const go=document.createElement('button');go.className='llPrimary';go.textContent=next?'▶ Start '+next.name:'🏠 Back to topics';
       go.onclick=()=>{if(next)openTopic(next.id);else goHome()};
       $('llCurrCelebration').append(h,ptext,go);renderTopics();
       say('Amazing! You completed all ten levels. Great job!');
       return;
     }
     say('Level '+oldLevel+' complete. Great job! Level '+p.level+'.');
   }
   $('llCurrPlay').hidden=false;$('llCurrCelebration').hidden=true;
   if(!p.question){
     const used=p.used[p.level]||[],q=engine.pool(t,p.level,1,used)[0];
     if(!q){
       // No available unique question: avoid repeating, complete this level.
       p.questionIndex=10;save();nextQuestion();return;
     }
     p.question=q;
   }
   current.question=p.question;
   p.lastActive=Date.now();
   save();renderQuestion();
   if(!replay||p.questionIndex===0)transition=setTimeout(()=>say(current?.question?.spoken||''),180);
 }
 function renderQuestion(){
   const p=current.progress,q=current.question,t=current.topic;
   $('llCurrGrade').textContent=cat.grades[t.grade].label;
   $('llCurrLevel').textContent='Level '+p.level+'/10';
   $('llCurrQuestion').textContent='Question '+(p.questionIndex+1)+'/10';
   $('llCurrScore').textContent='⭐ '+p.stars;
   $('llCurrPrompt').textContent=q.prompt;
   $('llCurrVisual').textContent=q.visual;
   $('llCurrVisual').style.whiteSpace='pre-line';
   $('llCurrChoices').replaceChildren();
   q.options.forEach(option=>{
     const b=document.createElement('button');b.className='llAnswer';b.type='button';
     b.textContent=option;b.dataset.llAnswer=option;
     b.setAttribute('aria-label','Answer '+option);
     $('llCurrChoices').appendChild(b);
   });
   $('llCurrDropHint').hidden=q.format!=='drop';
   const bar=$('llCurrBar');if(bar)bar.style.width=(p.questionIndex/10*100)+'%';
   const dots=$('llCurrLevelDots');if(dots){dots.replaceChildren();for(let i=1;i<=10;i++){const d=document.createElement('span');d.className='llLevelDot'+(p.completed.includes(i)?' done':i===p.level?' now':'');dots.appendChild(d)}}
   addDragDrop(q);
 }
 function addDragDrop(q){
   if(q.format!=='drop')return;
   const target=$('llCurrDropHint');
   const choices=$('llCurrChoices');
   choices.querySelectorAll('button').forEach(b=>{
     b.addEventListener('pointerdown',e=>{
       if(locked)return;
       selected={id:e.pointerId,text:b.dataset.llAnswer,x:e.clientX,y:e.clientY};
       b.setPointerCapture(e.pointerId);
     });
     b.addEventListener('pointermove',e=>{
       if(!selected||selected.id!==e.pointerId)return;
       if(!ghost&&Math.hypot(e.clientX-selected.x,e.clientY-selected.y)>12){
         ghost=document.createElement('div');ghost.className='llDragGhost';ghost.textContent=selected.text;document.body.appendChild(ghost);
       }
       if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px'}
     });
     b.addEventListener('pointerup',e=>{
       if(!selected||selected.id!==e.pointerId)return;
       const rect=target.getBoundingClientRect();
       const dropped=e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom;
       if(ghost){ghost.remove();ghost=null}
       if(dropped){answer(selected.text);e.stopPropagation()}
       selected=null;
     });
     b.addEventListener('pointercancel',()=>{if(ghost)ghost.remove();ghost=null;selected=null});
   });
   target.onclick=()=>{say('Tap the correct answer below, or drag it here.')};
 }
 function answer(choice){
   if(locked||!current)return;
   const p=current.progress,q=current.question,feedback=$('llCurrFeedback');
   if(String(choice)!==String(q.answer)){
     feedback.className='llFeedback wrong';feedback.textContent='Try again';
     say('Try again');return;
   }
   locked=true;
   feedback.className='llFeedback good';feedback.textContent='⭐ Great job!';
   p.score++;p.stars++;p.questionIndex++;
   if(!p.used[p.level])p.used[p.level]=[];
   p.used[p.level].push(q.key);p.question=null;save();
   $('llCurrScore').textContent='⭐ '+p.stars;
   $('llCurrBar').style.width=(p.questionIndex/10*100)+'%';
   say('Correct. Great job!');
   transition=setTimeout(()=>nextQuestion(),2000);
 }
 function goHome(){
   clearTimeout(transition);
   if(ghost)ghost.remove();ghost=null;
   try{speechSynthesis.cancel()}catch(e){}
   current=null;show('homePage');renderTopics();
 }
 function renderHistory(){
   const holder=$('llCurriculumHistory');if(!holder)return;
   holder.replaceChildren();
   const h=document.createElement('h3');h.textContent='📘 Grade learning achievements';holder.appendChild(h);
   const rows=state.completed.slice().reverse();
   if(!rows.length){const p=document.createElement('p');p.textContent='Finish a curriculum level to see it here.';holder.appendChild(p);return}
   rows.slice(0,50).forEach(row=>{
     const div=document.createElement('div');div.className='llHistoryRow';
     const topic=document.createElement('strong');topic.textContent=row.topic+' • Level '+row.level;
     const when=document.createElement('small');when.textContent=cat.gradeLabels[row.grade]+' • '+(row.date?new Date(row.date).toLocaleDateString():'')+' • ⭐ '+row.stars;
     div.append(topic,when);holder.appendChild(div);
   });
 }
 window.LL_STUDIO={catalog:cat,questions:engine,openTopic,renderTopics,readProgress:()=>state};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();