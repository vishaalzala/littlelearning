/* Little Learning: ONE Continue Learning banner for Quick Play and grade lessons.
   Reads existing browser saves without migrating, resetting or copying child data. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const gameLabels = {
    math:'Math', picture:'Picture Quiz', english:'English',
    find:'Find & Circle', findnum:'Find Numbers',
    matchnum:'Match Numbers', matchalpha:'Match Alphabets',
    findodd:'Find Odd Numbers', missingalpha:'Missing Alphabets',
    missingalpha2:'Two Missing Alphabets', missingnum:'Missing Numbers',
    missingnum2:'Two Missing Numbers'
  };
  const icons = {
    math:'🧮', picture:'🐶', english:'📖', find:'🎯',
    findnum:'🔢', matchnum:'🧩', matchalpha:'🔤', findodd:'🔍',
    missingalpha:'🔠', missingalpha2:'🔠', missingnum:'🔢',
    missingnum2:'🔢'
  };
  const savePrefix='littlelearning.progress.v1.';
  const curriculumKey='littlelearning.curriculum.v3';
  const panel=$('unifiedResume');
  const btn=$('unifiedResumeButton');
  if(!panel||!btn)return;

  const safeRead=key=>{
    try{return JSON.parse(localStorage.getItem(key)||'null')}
    catch(_){return null}
  };
  const number=(v,def=0)=>{
    const n=Number(v);
    return Number.isFinite(n)?n:def;
  };
  function candidates(){
    const result=[];
    // Old Quick Play saves are stored independently per game.
    for(const [game,title] of Object.entries(gameLabels)){
      const progress=safeRead(savePrefix+game);
      if(!progress || progress.game!==game || !progress.current || progress.finished)continue;
      const lvl=Math.min(10,Math.max(1,number(progress.level,1)));
      const total=Math.max(1,number(progress.total,10));
      const index=Math.max(1,Math.min(total,number(progress.levelIndex,1)));
      result.push({
        type:'quick',game,title,icon:icons[game]||'⭐',
        details:'Quick Play • Level '+lvl+' • Question '+index+'/'+total+
          ' • ⭐ '+Math.max(0,number(progress.stars)),
        timestamp:Math.max(0,number(progress.updatedAt))
      });
    }
    const saved=safeRead(curriculumKey);
    const topics=saved&&saved.topics&&typeof saved.topics==='object'?saved.topics:{};
    const catalog=window.LL_STUDIO?.catalog||window.LL_CATALOG;
    for(const [topicId,progress] of Object.entries(topics)){
      if(!progress || typeof progress!=='object' || progress.finished)continue;
      const topic=catalog?.byId?.[topicId];
      if(!topic)continue;
      const grade=catalog.grades?.[topic.grade]?.label||'Learning';
      const lvl=Math.min(10,Math.max(1,number(progress.level,1)));
      const question=Math.min(10,Math.max(1,number(progress.questionIndex)+1));
      result.push({
        type:'curriculum',topicId,title:topic.name,icon:topic.icon||'📚',
        details:grade+' • Level '+lvl+' • Question '+question+'/10'+
          ' • ⭐ '+Math.max(0,number(progress.stars)),
        timestamp:Math.max(0,number(progress.lastActive))
      });
    }
    // Stable selection: latest activity wins, even when it is not the
    // currently selected grade or one of the featured Quick Play games.
    return result.sort((a,b)=>b.timestamp-a.timestamp);
  }
  let selected=null;
  function refresh(){
    const options=candidates();
    selected=options[0]||null;
    panel.hidden=!selected;
    if(!selected)return;
    $('unifiedResumeIcon').textContent=selected.icon;
    $('unifiedResumeTitle').textContent=selected.title;
    $('unifiedResumeDetails').textContent=selected.details;
    btn.textContent=selected.type==='quick'?'▶ Continue Game':'▶ Continue Lesson';
    btn.setAttribute('aria-label','Resume '+selected.title+'. '+selected.details);
  }
  btn.addEventListener('click',()=>{
    // Re-evaluate at tap time in case a save changed since the last render.
    refresh();
    if(!selected)return;
    if(selected.type==='quick' && typeof window.resumeGame==='function'){
      window.resumeGame(selected.game);
    }else if(selected.type==='curriculum'){
      window.LL_STUDIO?.openTopic?.(selected.topicId);
    }
  });

  // Called directly by both save engines. Also refresh when Home is shown
  // by a profile/back navigation or when another tab saves game progress.
  window.LL_REFRESH_RESUME=refresh;
  const home=$('homePage');
  if(home && typeof MutationObserver!=='undefined'){
    new MutationObserver(()=>{
      if(home.classList.contains('active'))refresh();
    }).observe(home,{attributes:true,attributeFilter:['class']});
  }
  window.addEventListener('pageshow',refresh);
  window.addEventListener('storage',event=>{
    if(event.key===curriculumKey||event.key?.startsWith(savePrefix))refresh();
  });
  refresh();
})();