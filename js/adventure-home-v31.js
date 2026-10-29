/* Little Learning Adventure — original illustrated topic scenes.
   This enhances the existing curriculum grid without changing game logic or saved progress. */
(function () {
 'use strict';
 const grid=document.getElementById('llTopicGrid');
 if (!grid) return;
 const catalogue=window.LL_CATALOG;
 const motifs={
  count:['🐞','🌼','🐞','🌷','🐞'],
  number:['🚂','1️⃣','2️⃣','3️⃣'],
  pattern:['🟠','🔵','🟠','🔵','🟠'],
  missing:['1️⃣','❔','3️⃣','⭐'],
  compare:['🐻','⚖️','🐰'],
  sort:['🧺','🍎','🍋','🍇'],
  odd:['🐻','🐻','🦊','🐻'],
  add:['🍎','➕','🍌','✨'],
  subtract:['🎈','🎈','➖','🎈'],
  missingadd:['4️⃣','➕','❔','🔟'],
  multiply:['🐣','🐣','✖️','🐣'],
  divide:['🍪','🍪','➗','🧸'],
  place:['🧱','1️⃣','2️⃣','3️⃣'],
  round:['🎯','3️⃣','5️⃣','🔟'],
  fraction:['🍕','🥧','½'],
  fractionadd:['🥧','➕','🍕'],
  decimal:['1️⃣','🔸','5️⃣','🔟'],
  time:['⏰','🌞','🌙'],
  money:['🪙','💰','🪙'],
  measure:['🧸','📏','🐻'],
  convert:['📏','🧪','⚖️'],
  shape:['🔺','🟡','🟦','⭐'],
  graph:['📊','🍎','🍌','🍓'],
  area:['🏡','📐','🟦'],
  perimeter:['📐','🟦','📏'],
  volume:['🧊','🧊','📦'],
  angle:['📐','🔺','🧭'],
  factors:['🧩','2️⃣','3️⃣','6️⃣'],
  order:['1️⃣','➕','✖️','2️⃣'],
  integer:['➖','0️⃣','➕'],
  exponent:['2️⃣','⚡','3️⃣'],
  algebra:['❔','➕','🔢'],
  percent:['💯','🥧','📊'],
  ratio:['🔴','🔵','🔴','🔵'],
  proportion:['⚖️','🧪','📏'],
  word:['📖','🧸','🧮'],
  letters:['🅰️','🅱️','🌟'],
  missingletter:['🅰️','❔','🅲️'],
  phonics:['🐍','🔊','🐝'],
  spelling:['🐱','✏️','🔤'],
  vocabulary:['🦁','🐼','🐶'],
  rhyme:['🚗','🎵','⭐'],
  sentence:['📖','🐕','✏️'],
  grammar:['🔤','📒','📝'],
  reading:['📚','🦊','🐻'],
  synonym:['🌞','↔️','🌙'],
  prefix:['🧩','🔤','✨']
 };
 const palettes=[
  {sky:'#cef5ff',floor:'#8fd68a',accent:'#fbdc72',edge:'#f7b380'},
  {sky:'#e5e9ff',floor:'#b1e9db',accent:'#e9adf0',edge:'#aeb9f5'},
  {sky:'#fff0cd',floor:'#ffd6a5',accent:'#b6e4f9',edge:'#efaf99'},
  {sky:'#dcf9fa',floor:'#b7e5a2',accent:'#eac2fa',edge:'#96ced9'},
  {sky:'#ffe7ee',floor:'#e5d1fb',accent:'#ffd17a',edge:'#eda7b9'},
  {sky:'#e2f4ff',floor:'#e1e7a8',accent:'#ffb7af',edge:'#a8d8f3'}
 ];
 const element=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
 function illustration(topic,index){
  const theme=palettes[(index+topic.grade*2)%palettes.length];
  const art=element('span','adventure-art');
  art.setAttribute('aria-hidden','true');
  art.style.setProperty('--scene-sky',theme.sky);
  art.style.setProperty('--scene-ground',theme.floor);
  art.style.setProperty('--scene-accent',theme.accent);
  art.style.setProperty('--scene-edge',theme.edge);
  const sky=element('span','scene-sky');
  const sun=element('span','scene-sun');
  const cloud1=element('span','scene-cloud scene-cloud-a'),cloud2=element('span','scene-cloud scene-cloud-b');
  const hills=element('span','scene-hills');
  const confetti=element('span','scene-confetti');
  const pieces=element('span','scene-actors');
  const em=motifs[topic.kind]||[topic.icon,'⭐','🌈'];
  em.forEach((symbol,k)=>{
    const sprite=element('span','scene-sprite scene-sprite-'+k);
    sprite.textContent=symbol;
    pieces.appendChild(sprite);
  });
  for(const symbol of ['✦','✧','•']){
    const sparkle=element('span','scene-sparkle');sparkle.textContent=symbol;confetti.appendChild(sparkle)
  }
  art.append(sky,sun,cloud1,cloud2,hills,pieces,confetti);
  return art;
 }
 function decorate(){
  const cards=[...grid.querySelectorAll('button[data-ll-topic]')];
  for(const [index,button] of cards.entries()){
    if(button.dataset.adventureReady==='true')continue;
    const topic=catalogue?.byId?.[button.dataset.llTopic];
    if(!topic)continue;
    button.dataset.adventureReady='true';
    button.classList.add('adventure-topic');
    const art=illustration(topic,index);
    const status=button.querySelector('.llTopicStatus');
    if(status)button.insertBefore(art,status);
    else button.appendChild(art);
    const title=button.querySelector('strong');
    if(title){
      title.classList.add('adventure-title');
      title.title=topic.name;
    }
    const icon=button.querySelector('.llTopicIcon');
    if(icon)icon.setAttribute('aria-hidden','true');
    const p=button.querySelector('.llTopicStatus');
    if(p&&p.textContent.includes('Level'))p.textContent=p.textContent.replace(/^▶ /,'▶ ');
    const number=element('span','adventure-number');
    number.textContent=String(index+1).padStart(2,'0');
    button.appendChild(number);
  }
  const progressText=document.getElementById('llTopicCount');
  if(progressText){
    const percent=cards.filter(b=>b.querySelector('.llTopicStatus')?.textContent.includes('Completed')).length;
    const label=progressText.textContent;
    progressText.setAttribute('aria-label',label);
  }
 }
 const obs=new MutationObserver(decorate);
 obs.observe(grid,{childList:true});
 decorate();
 document.querySelectorAll('[data-ll-subject]').forEach(button=>{
   button.addEventListener('click',()=>{if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;grid.animate?.([{opacity:.72,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});});
 });
})();
