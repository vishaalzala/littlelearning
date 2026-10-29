
/* Little Learning 2.0 enhancement layer. Existing game engines remain unchanged. */
(function () {
  'use strict';
  const PROFILE_KEY='littlelearning.profile.v2';
  const HISTORY_KEY='littlelearning.completions.v2';
  const PREFERENCES_KEY='littlelearning.preferences.v2';
  const avatars=['🦊','🐼','🐻','🦁','🌈','🐱'];
  const icons={math:'🔢',picture:'🐶',english:'🔤',find:'🧸',findnum:'🔎',matchnum:'🔗',matchalpha:'🧩',findodd:'🎯',missingalpha:'🔡',missingalpha2:'🅰️',missingnum:'🔢',missingnum2:'🧮'};
  const el=id=>document.getElementById(id);
  function read(key,fallback) {try{const v=JSON.parse(localStorage.getItem(key));return v===null?fallback:v}catch(e){return fallback}}
  function write(key,v){try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}}
  function safeName(v){return String(v||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,20)}
  function profile(){return read(PROFILE_KEY,null)}
  function welcomeName(){const p=profile();return p&&p.name?p.name:'Little Star'}
  function avatar(){const p=profile();return p&&avatars.includes(p.avatar)?p.avatar:'🦊'}
  function allCompletions(){const records=read(HISTORY_KEY,[]);return Array.isArray(records)?records:[]}
  function storeCompletedLevel(){
    if(!state.game||!names[state.game]||!Number.isInteger(state.level)||state.levelIndex<state.total)return;
    const rows=allCompletions();
    const at=rows.findIndex(r=>r.game===state.game&&r.level===state.level);
    const now=new Date().toISOString();
    const earlier=rows.filter(r=>r.game===state.game&&r.level<state.level); const usedStars=earlier.reduce((sum,r)=>sum+(Number(r.stars)||0),0); const usedScore=earlier.reduce((sum,r)=>sum+(Number(r.score)||0),0);
    const entry={game:state.game,level:state.level,questions:state.total,score:Math.max(0,state.score-usedScore),stars:Math.max(0,state.stars-usedStars),date:now};
    if(at>=0){const old=rows[at];entry.stars=Math.max(old.stars||0,entry.stars);entry.score=Math.max(old.score||0,entry.score);rows[at]=entry;}
    else rows.push(entry);
    write(HISTORY_KEY,rows.slice(-150));
  }
  function hydrateGreeting(){
    const name=welcomeName(),a=avatar();
    const greeting=el('helloHeading'),menu=el('menuHello'),pic=el('profileMenuBtn'),headIcon=el('heroArtwork');
    if(greeting) greeting.textContent='Hello, '+name+'! 👋';
    if(menu) menu.textContent=a+' '+name;
    if(pic)pic.textContent=a;
    if(headIcon)headIcon.textContent='🌈 ⭐ 📚';
  }
  function showPage(id){
    closeMenu();
    if(playPage.classList.contains('active')) rawGoHome();
    const pages=[el('homePage'),el('playPage'),el('contactPage'),el('profilePage'),el('historyPage')];
    pages.forEach(p=>{if(p)p.classList.toggle('active',p.id===id)});
    if(id==='historyPage')renderHistory();
    if(id==='profilePage')renderProfile();
    if(id==='homePage')refreshCards();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function closeMenu(){const menu=el('profileMenu'),btn=el('profileMenuBtn');if(menu)menu.hidden=true;if(btn)btn.setAttribute('aria-expanded','false')}
  function openMenu(){const menu=el('profileMenu'),btn=el('profileMenuBtn');if(!menu||!btn)return;menu.hidden=!menu.hidden;btn.setAttribute('aria-expanded',menu.hidden?'false':'true')}
  function renderProfile(){
    const p=profile()||{name:'',avatar:'🦊'};
    const input=el('profileName'),preview=el('profileAvatarPreview');
    if(input)input.value=p.name||'';
    if(preview)preview.textContent=avatar();
    document.querySelectorAll('.avatarPick').forEach(b=>{b.classList.toggle('selected',b.dataset.avatar===avatar());b.setAttribute('aria-pressed',b.dataset.avatar===avatar()?'true':'false')});
    const msg=el('profileMessage');if(msg)msg.textContent='';
  }
  function saveProfile(newName,newAvatar){
    const name=safeName(newName)||'Little Star';
    write(PROFILE_KEY,{name,avatar:avatars.includes(newAvatar)?newAvatar:'🦊'});
    hydrateGreeting();return name;
  }
  function welcomeComplete(){
    const name=saveProfile(el('welcomeName')?.value,'🦊');
    const overlay=el('welcomeOverlay');if(overlay)overlay.hidden=true;
    hydrateGreeting();
    try{speak('Hello '+name+'. Let us learn and play!')}catch(e){}
  }
  function renderHistory(){
    const rows=allCompletions().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const levels=new Set(rows.map(r=>r.game+':'+r.level)).size;
    const games=new Set(rows.map(r=>r.game)).size;
    const starCount=rows.reduce((n,r)=>n+Math.max(0,Number(r.stars)||0),0);
    if(el('historyLevels'))el('historyLevels').textContent=String(levels);
    if(el('historyStars'))el('historyStars').textContent=String(starCount);
    if(el('historyGames'))el('historyGames').textContent=String(games);
    const container=el('historyItems');if(!container)return;
    container.replaceChildren();
    if(!rows.length){const empty=document.createElement('p');empty.className='emptyHistory';empty.textContent='Your completed levels will appear here. Keep learning! 🌟';container.appendChild(empty);return;}
    rows.forEach(r=>{
      if(!names[r.game])return;
      const item=document.createElement('div');item.className='historyItem';
      const icon=document.createElement('div');icon.className='historyIcon';icon.textContent=icons[r.game]||'⭐';
      const info=document.createElement('div');info.className='historyInfo';
      const title=document.createElement('strong');title.textContent=names[r.game]+' • Level '+r.level;
      const details=document.createElement('small');
      let dateText='';
      if(r.date){const parsed=new Date(r.date);if(!isNaN(parsed))dateText=parsed.toLocaleDateString();}
      details.textContent='Completed '+dateText+' • '+(r.questions||10)+' questions';
      info.append(title,details);
      const stars=document.createElement('span');stars.className='historyStars';stars.textContent='⭐ '+(r.stars||0);
      item.append(icon,info,stars);container.appendChild(item);
    });
  }
  function refreshCards(){
    document.querySelectorAll('.game[data-game]').forEach(card=>{
      const game=card.dataset.game,meta=card.querySelector('.gameMeta')||document.createElement('div');
      meta.className='gameMeta';
      const s=savedProgress(game);
      const historyRows=allCompletions().filter(r=>r.game===game);
      const maxCompleted=historyRows.length?Math.max(...historyRows.map(r=>r.level)):0;
      if(s){
        const count=Math.max(1,Number(s.levelIndex)||1);
        meta.textContent='▶ Level '+s.level+' • Question '+count+'/'+s.total;
        card.setAttribute('aria-label',names[game]+', continue level '+s.level+', question '+count);
      }else if(maxCompleted>=10){
        meta.textContent='🏆 All 10 levels complete • Play again';
        card.setAttribute('aria-label',names[game]+', finished, play again');
      }else if(maxCompleted){
        meta.textContent='⭐ Start Level '+(maxCompleted+1);
        card.setAttribute('aria-label',names[game]+', start level '+(maxCompleted+1));
      }else{
        meta.textContent='▶ Start Level 1';
        card.setAttribute('aria-label',names[game]+', start level 1');
      }
      if(!meta.isConnected)card.appendChild(meta);
    });
  }
  function updateJourney(){
    const chip=el('levelChip'),question=el('levelQuestion'),dots=el('levelDots'),meter=el('questionMeterFill');
    if(!chip)return;
    chip.textContent='Level '+Math.min(10,state.level);
    if(question)question.textContent='Question '+state.levelIndex+' of '+state.total;
    if(dots){dots.replaceChildren();const completed=allCompletions().filter(r=>r.game===state.game).map(r=>r.level);
      for(let n=1;n<=10;n++){const d=document.createElement('span');d.className='levelDot'+(completed.includes(n)?' done':n===state.level?' current':'');d.title='Level '+n+(completed.includes(n)?' completed':'');dots.appendChild(d);}
    }
    if(meter)meter.style.width=(Math.max(0,Math.min(100,(Math.max(0,state.levelIndex-(state.locked?0:1))/Math.max(1,state.total))*100)))+'%';
  }
  function setNewGameLevel(game){
    const done=allCompletions().filter(r=>r.game===game).map(r=>r.level);
    const highest=done.length?Math.max(...done):0;
    levelSelect.value=String(highest>=10?1:Math.max(1,highest+1));
  }
  const rawStart=window.start,rawResume=window.resumeGame,rawNext=window.next,rawGoHome=window.goHome,rawAdvance=window.advanceLevel,rawEnd=window.endScreen,rawUpdate=window.update,rawCheckpoint=window.checkpoint;
  // Critical: a game card must never clear the current saved game.
  window.start=function(game){
    if(!names[game])return;
    closeMenu();
    if(savedProgress(game))return rawResume(game);
    setNewGameLevel(game);
    rawStart(game);
    updateJourney();refreshCards();
    window.scrollTo(0,0);
  };
  window.resumeGame=function(game){
    closeMenu();
    const result=rawResume(game);
    updateJourney();refreshCards();
    window.scrollTo(0,0);
    return result;
  };
  window.advanceLevel=function(){
    if(state.levelIndex>=state.total)storeCompletedLevel();
    const result=rawAdvance();
    updateJourney();refreshCards();
    return result;
  };
  window.endScreen=function(){
    if(state.levelIndex>=state.total)storeCompletedLevel();
    const result=rawEnd();
    updateJourney();refreshCards();
    return result;
  };
  window.next=function(){
    // Do not start new questions while the learner is on the home page.
    if(!playPage.classList.contains('active'))return;
    const result=rawNext();
    updateJourney();refreshCards();
    return result;
  };
  window.update=function(){const result=rawUpdate();updateJourney();return result;};
  window.checkpoint=function(){const result=rawCheckpoint();return result;};
  window.goHome=function(){const result=rawGoHome();refreshCards();return result;};
  if(el('profileMenuBtn'))el('profileMenuBtn').addEventListener('click',openMenu);
  if(el('menuProfile'))el('menuProfile').addEventListener('click',()=>showPage('profilePage'));
  if(el('menuHistory'))el('menuHistory').addEventListener('click',()=>showPage('historyPage'));
  if(el('menuContact'))el('menuContact').addEventListener('click',()=>showPage('contactPage'));
  if(el('profileBack'))el('profileBack').addEventListener('click',()=>showPage('homePage'));
  if(el('historyBack'))el('historyBack').addEventListener('click',()=>showPage('homePage'));
  if(el('profileForm'))el('profileForm').addEventListener('submit',e=>{
    e.preventDefault();
    const chosen=document.querySelector('.avatarPick.selected');
    const name=saveProfile(el('profileName').value,chosen?chosen.dataset.avatar:'🦊');
    if(el('profileMessage'))el('profileMessage').textContent='Saved! Hello, '+name+'! ⭐';
    refreshCards();
  });
  document.querySelectorAll('.avatarPick').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.avatarPick').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});
    if(el('profileAvatarPreview'))el('profileAvatarPreview').textContent=b.dataset.avatar;
  }));
  if(el('welcomeForm'))el('welcomeForm').addEventListener('submit',e=>{e.preventDefault();welcomeComplete();});
  if(el('welcomeSkip'))el('welcomeSkip').addEventListener('click',welcomeComplete);
  document.addEventListener('pointerdown',e=>{const p=el('profileBox');if(p&&!p.contains(e.target))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const qs=el('questionSelect'),pref=read(PREFERENCES_KEY,{questions:10});
  if(qs){if([5,10,20,30,40,50].includes(Number(pref.questions)))qs.value=String(pref.questions);
    qs.addEventListener('change',()=>write(PREFERENCES_KEY,{questions:Number(qs.value)}));
  }
  hydrateGreeting();
  refreshCards();
  const overlay=el('welcomeOverlay');
  if(overlay&&!profile()){overlay.hidden=false;setTimeout(()=>el('welcomeName')?.focus(),30);}
  else if(overlay)overlay.hidden=true;
  // Resume the latest game remains available; cards now independently resume their own progress.
})();
