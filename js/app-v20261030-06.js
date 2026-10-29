const $=id=>document.getElementById(id);
const homePage=$("homePage"),playPage=$("playPage"),playArea=$("playArea"),levelSelect=$("levelSelect"),questionSelect=$("questionSelect"),alphaCaseSelect=$("alphaCaseSelect"),gameTitle=$("gameTitle"),questionNumber=$("questionNumber"),scoreText=$("scoreText"),starsText=$("starsText"),feedback=$("feedback");
const names={math:"Math",picture:"Picture Quiz",english:"English",find:"Find & Circle",findnum:"Find Numbers",matchnum:"Match Numbers",matchalpha:"Match Alphabets",findodd:"Find Odd Numbers",missingalpha:"Missing Alphabets",missingnum:"Missing Numbers",missingalpha2:"Two Missing Alphabets",missingnum2:"Two Missing Numbers"};
const emojis=["🐶","🐱","🐰","🐵","🐟","🐢","🦁","🐸","🦋","🐥","🍎","🍌","🍓","🍇","🍊","🍉","🍐","🍒","🚗","🚌","🚒","🚜","🚲","✈️","🚂","🚕","⭐","🌟","💎","❤️","🎈","🌼","🟡","🧸"];
const words={
1:["go","no","up","in","on","cat","fat","fan","hat","sun","dog","red","pig","jam","cup"],
2:["ball","fish","frog","book","milk","duck","star","tree","blue","cake","bird","hand","lamp","moon","ship"],
3:["apple","tiger","chair","table","green","house","happy","water","zebra","horse","grape","smile","bread","plant","clock"],
4:["banana","orange","yellow","monkey","rabbit","flower","school","family","little","purple","pencil","garden","silver","friend","button"],
5:["banana","orange","yellow","monkey","rabbit","flower","school","family","little","purple","pencil","garden","planet","rocket","window","kitten"],
6:["banana","orange","yellow","monkey","rabbit","flower","school","family","little","purple","pencil","garden","planet","rocket","jacket","basket"],
7:["blanket","dolphin","elephant","hospital","mountain","notebook","pineapple","strawberry","triangle","umbrella","backpack","airplane"],
8:["alligator","butterfly","crocodile","dinosaur","firetruck","keyboard","lollipop","marigold","raincoat","sunshine","waterfall","xylophone"],
9:["adventure","blueberry","chocolate","dangerous","everybody","football","hamburger","important","jellybean","kangaroo","ladybird","pineapple"],
10:["astronaut","beautiful","caterpillar","dictionary","friendship","helicopter","ladyfinger","playground","strawberry","watermelon","basketball","vegetable"]
};
const findTargets={
1:[["doll","🧸"],["apple","🍎"],["car","🚗"],["ball","⚽"],["cat","🐱"],["dog","🐶"],["star","⭐"],["fish","🐟"],["banana","🍌"],["bus","🚌"],["flower","🌼"],["heart","❤️"]],
2:[["doll","🧸"],["apple","🍎"],["fish","🐟"],["star","⭐"],["banana","🍌"],["bus","🚌"],["butterfly","🦋"],["frog","🐸"],["orange","🍊"],["car","🚗"],["flower","🌼"],["duck","🐥"]],
3:[["doll","🧸"],["apple","🍎"],["orange","🍊"],["frog","🐸"],["train","🚂"],["flower","🌼"],["umbrella","☂️"],["grapes","🍇"],["turtle","🐢"],["bike","🚲"],["heart","❤️"],["pear","🍐"]],
4:[["doll","🧸"],["red apple","🍎"],["green pear","🍐"],["taxi","🚕"],["lion","🦁"],["cake","🍰"],["heart","❤️"],["butterfly","🦋"],["tractor","🚜"],["watermelon","🍉"],["diamond","💎"],["balloon","🎈"]],
5:[["doll","🧸"],["apple","🍎"],["monkey","🐵"],["plane","✈️"],["grapes","🍇"],["bicycle","🚲"],["diamond","💎"],["fire truck","🚒"],["turtle","🐢"],["cherries","🍒"],["yellow circle","🟡"],["mushroom","🍄"]],
6:[["doll","🧸"],["apple","🍎"],["rocket","🚀"],["turtle","🐢"],["watermelon","🍉"],["fire truck","🚒"],["yellow circle","🟡"],["lion","🦁"],["train","🚂"],["umbrella","☂️"],["heart","❤️"],["flower","🌼"]],
7:[["rocket","🚀"],["zebra","🦓"],["ice cream","🍦"],["house","🏠"],["ship","🚤"],["balloon","🎈"],["cookie","🍪"],["kite","🪁"],["bee","🐝"],["ladybug","🐞"],["corn","🌽"],["lemon","🍋"]],
8:[["helicopter","🚁"],["unicorn","🦄"],["octopus","🐙"],["crab","🦀"],["boat","🛶"],["gift","🎁"],["scooter","🛵"],["paint","🎨"],["juice","🧃"],["candy","🍭"],["basketball","🏀"],["target","🎯"]],
9:[["submarine","🚤"],["slide","🛝"],["yo-yo","🪀"],["rocket","🚀"],["carrot","🥕"],["house","🏡"],["dice","🎲"],["football","🏈"],["cookie","🍪"],["mushroom","🍄"],["bee","🐝"],["elephant","🐘"]],
10:[["dinosaur","🦕"],["whale","🐋"],["penguin","🐧"],["giraffe","🦒"],["coconut","🥥"],["dragon fruit","🍉"],["camera","📷"],["phone","📱"],["clock","⏰"],["trophy","🏆"],["robot","🤖"],["present","🎁"]]
}
const distractors=[...emojis,"⚽","☂️","🍰","🍄","🚀","🛝","🎁","🎨","🪁","🛵","🦄","🐝","🐞","🐙","🦀","🍋","🥕","🌽","🍪","🍭","🧃","🏀","🏈","🎲","🎯","🪀","🚁","🚤","🛶","🏡"];
let state={game:"",level:1,startLevel:1,maxLevel:10,total:10,levelIndex:0,totalAsked:0,score:0,stars:0,current:null,history:[],last:"",locked:false,rows:{},usedLevelKeys:{},find:{canvas:null,ctx:null,board:null,drawing:false,points:[]}};
document.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>start(b.dataset.game));
$("homeBtn").onclick=goHome;$("soundBtn").onclick=()=>state.current&&speak(state.current.spoken||"Tap the answer");

// Offline, no-signup progress: saved separately for each game on this device.
const SAVE_PREFIX="littlelearning.progress.v1.";
const LAST_SAVE_KEY="littlelearning.last-game.v1";
const isValidGame=game=>!!names[game];
function savedProgress(game){
  if(!isValidGame(game))return null;
  try{const saved=JSON.parse(localStorage.getItem(SAVE_PREFIX+game)||"null");
    if(!saved||saved.game!==game||!saved.current||saved.finished)return null;
    return saved;
  }catch(e){return null;}
}
function checkpoint(){
  if(!state.current||!isValidGame(state.game))return;
  const partial={};
  if(state.current.mode==="worksheet")partial.rows={...state.rows};
  if(state.current.mode==="matchnum"&&state.match)partial.lines=state.match.lines.map(x=>({left:x.left,right:x.right}));
  if(state.current.mode==="matchalpha"&&state.alpha)partial.lines=state.alpha.lines.map(x=>({left:x.left,right:x.right}));
  if(state.current.mode==="missingalpha")partial.filled={...(state.missingAlphaFilled||{})};
  if(state.current.mode==="missingnum")partial.filled={...(state.missingNumberFilled||{})};
  const snapshot={game:state.game,startLevel:state.startLevel,level:state.level,maxLevel:10,total:state.total,levelIndex:state.levelIndex,totalAsked:state.totalAsked,score:state.score,stars:state.stars,
    current:state.current,history:state.history.slice(),last:state.last,usedLevelKeys:{...state.usedLevelKeys},partial,pendingAdvance:!!state.locked,updatedAt:Date.now()};
  try{localStorage.setItem(SAVE_PREFIX+state.game,JSON.stringify(snapshot));localStorage.setItem(LAST_SAVE_KEY,state.game);}catch(e){}
  refreshContinueButton();
}
function refreshContinueButton(){
  // The unified home ribbon owns the resume UI for BOTH game systems.
  // Keep all saved Quick Play state unchanged.
  if(typeof window.LL_REFRESH_RESUME==='function')window.LL_REFRESH_RESUME();
}

function resumeGame(game){
  const s=savedProgress(game);if(!s)return start(game);
  state={...state,game:s.game,startLevel:s.startLevel,level:s.level,maxLevel:10,total:s.total,levelIndex:s.levelIndex,totalAsked:s.totalAsked,score:s.score,stars:s.stars,
    current:s.current,history:s.history||[],last:s.last||"",locked:false,rows:{},usedLevelKeys:s.usedLevelKeys||{},
    matchAlphaPools:{},missingAlphaPools:{},missingNumberPools:{},picturePools:{},matchNumberPools:{}};
  levelSelect.value=String(s.level);questionSelect.value=String(s.total);
  homePage.classList.remove("active");playPage.classList.add("active");
  updateGameTitle();
  if(s.pendingAdvance){next();return;}
  update();render(state.current);restorePartial(s.partial||{});checkpoint();
  setTimeout(()=>state.current&&speak(state.current.spoken||"Find the answer"),200);
}
function restorePartial(partial){
  if(state.current.mode==="worksheet"){
    state.rows={...partial.rows};Object.keys(state.rows).forEach(i=>{const el=playArea.querySelector(`.rowCard[data-row="${i}"]`);
      if(el){el.classList.add("correct");el.querySelectorAll('button').forEach(b=>b.disabled=true);}});
  }
  if((state.current.mode==="matchnum"||state.current.mode==="matchalpha")&&Array.isArray(partial.lines)){
    const match=state.current.mode==="matchnum"?state.match:state.alpha;
    for(const line of partial.lines){match.lines.push(line);match.matchedLeft[line.left]=true;match.matchedRight[line.right]=true;
      if(state.current.mode==="matchnum")markMatchDone(line.left,line.right);else markAlphaDone(line.left,line.right);}
    if(state.current.mode==="matchnum")drawMatchLines();else drawAlphaLines();
  }
  if(state.current.mode==="missingalpha"||state.current.mode==="missingnum"){
    const alpha=state.current.mode==="missingalpha";
    const dropClass=alpha?".alphaDrop":".numberDrop",choiceClass=alpha?".alphaChoice":".numberChoice";
    const filled={...(partial.filled||{})};
    if(alpha)state.missingAlphaFilled=filled;else state.missingNumberFilled=filled;
    Object.keys(filled).forEach(i=>{const el=[...playArea.querySelectorAll(dropClass)].find(e=>e.dataset.pos===i);
      if(!el)return;el.textContent=el.dataset.answer;el.classList.add("filled");
      const selected=[...playArea.querySelectorAll(choiceClass)].find(c=>(alpha?c.dataset.letter:c.dataset.number)===el.dataset.answer&&!c.classList.contains('used'));
      if(selected)selected.classList.add('used');});
  }
}

function updateGameTitle(){gameTitle.textContent=names[state.game]+" • Level "+state.level}
function start(game){
  const startLevel=Math.max(1,Math.min(10,+levelSelect.value||1));
  try{localStorage.removeItem(SAVE_PREFIX+game);}catch(e){}
  state={...state,game,startLevel,level:startLevel,maxLevel:10,total:+questionSelect.value,levelIndex:0,totalAsked:0,score:0,stars:0,current:null,history:[],last:"",locked:false,rows:{},usedLevelKeys:{},matchAlphaPools:{},missingAlphaPools:{},missingNumberPools:{},picturePools:{},matchNumberPools:{}};
  updateGameTitle();
  homePage.classList.remove("active");
  playPage.classList.add("active");
  next();
}
function goHome(){if(state.current)checkpoint();stopSpeech();hideFeedback();playPage.classList.remove("active");if(typeof contactPage!=="undefined"&&contactPage)contactPage.classList.remove("active");homePage.classList.add("active");playArea.innerHTML="";state.current=null;refreshContinueButton()}
function advanceLevel(){
  if(state.level>=state.maxLevel) return false;
  state.level++;
  state.levelIndex=0;
  state.history=[];
  state.last="";
  state.rows={};
  state.usedLevelKeys={};
  if(state.matchAlphaPools) delete state.matchAlphaPools[state.level];
  state.missingAlphaPools={};
  state.missingNumberPools={};
  state.picturePools={};
  state.matchNumberPools={};
  updateGameTitle();
  showFeedback("Level "+state.level,true);
  speak("Level "+state.level);
  return true;
}
function next(){
  hideFeedback();
  state.locked=false;
  if(state.level>state.maxLevel) return endScreen();
  if(state.levelIndex>=state.total){
    if(!advanceLevel()) return endScreen();
  }
  let q=uniqueQuestion();
  if(!q){
    if(!advanceLevel()) return endScreen();
    q=uniqueQuestion();
    if(!q) return endScreen();
  }
  state.current=q;
  state.usedLevelKeys[q.key]=true;
  state.history.push(q.key);
  state.last=q.key;
  state.levelIndex++;
  state.totalAsked++;
  state.rows={};
  update();
  render(state.current);
  checkpoint();
  setTimeout(()=>state.current&&speak(state.current.spoken||"Tap the answer"),180)
}
function update(){questionNumber.textContent=state.levelIndex+"/"+state.total;scoreText.textContent=state.score;starsText.textContent="⭐ "+state.stars;if(state.current)checkpoint()}
function uniqueQuestion(){
  const gen={math:mathQ,picture:pictureQ,english:englishQ,find:findQ,findnum:findNumberQ,matchnum:matchNumberQ,matchalpha:matchAlphabetQ,findodd:findOddNumberQ,missingalpha:missingAlphaQ,missingnum:missingNumberQ,missingalpha2:missingAlphaQ,missingnum2:missingNumberQ}[state.game];
  let fb=null;
  for(let i=0;i<4000;i++){
    let q=gen(state.level);
    fb=q;
    if(!state.usedLevelKeys[q.key]) return q;
  }
  return null;
}
function render(q){playArea.classList.remove("locked");if(q.mode==="worksheet")return renderWorksheet(q);if(q.mode==="find")return renderFind(q);if(q.mode==="matchnum")return renderMatchNumbers(q);if(q.mode==="matchalpha")return renderMatchAlphabet(q);if(q.mode==="missingalpha")return renderMissingAlpha(q);if(q.mode==="missingnum")return renderMissingNumber(q);playArea.innerHTML=`<div class="prompt"><div class="qTitle">${q.title}</div><div class="qSmall">${q.helper||"Tap the answer"}</div></div><div class="visual">${q.visual}</div><div class="answers">${q.choices.map(c=>`<button class="bigAnswer ${q.word?"wordChoice":""}" data-a="${esc(c)}">${esc(String(c)).toUpperCase()}</button>`).join("")}</div>`;playArea.querySelectorAll(".bigAnswer").forEach(b=>b.onclick=()=>singleAnswer(b,b.dataset.a,q.answer))}
function renderWorksheet(q){playArea.innerHTML=`<div class="prompt"><div class="qTitle">${q.title}</div><div class="qSmall">${q.helper}</div></div><div class="worksheet">${q.rows.map((r,i)=>`<div class="rowCard" data-row="${i}"><div><div class="rowLabel">${r.label}</div><div class="${r.eq?"rowEq":"rowPics"}">${r.html}</div></div><div class="sideChoices">${r.choices.map(c=>`<button class="circle" data-row="${i}" data-a="${c}">${c}</button>`).join("")}</div></div>`).join("")}</div>`;playArea.querySelectorAll(".circle").forEach(b=>b.onclick=()=>worksheetAnswer(b,+b.dataset.row,+b.dataset.a,q.rows[+b.dataset.row].answer))}
function renderFind(q){playArea.innerHTML=`<div class="prompt"><div class="qTitle">Find the ${esc(q.name)}</div><div class="qSmall">${q.oddGame?"Draw a circle around the different number":(q.numberGame?"Draw a circle around the number":"Draw a circle around it")}</div></div><div class="findWrap">${q.oddGame?`<div class="oddHeaderText">Find the odd one out</div>`:""}<div id="findBoard" class="findBoard ${q.oddGame?'oddBoard':''}" style="--size:${q.oddGame?oddNumberItemSize(q.level):(q.numberGame?numberItemSize(q.level):itemSize(q.level))}px">${q.items.map(it=>`<div class="findItem ${q.oddGame?"oddNumberItem":(q.numberGame?"numberItem "+it.color:"")} ${it.target?"targetItem":""}" style="left:${it.x}%;top:${it.y}%">${it.emoji}</div>`).join("")}<canvas id="findCanvas" class="findCanvas"></canvas></div><div class="findHelp"><div class="findHelpText">Use finger or mouse to round the ${esc(q.name)}.</div><button id="clearBtn" class="clearBtn">Clear</button></div></div>`;setupFind(q);$("clearBtn").onclick=()=>clearCanvas()}
function setupFind(q){const board=$("findBoard"),canvas=$("findCanvas"),ctx=canvas.getContext("2d");state.find={canvas,ctx,board,drawing:false,points:[]};resizeCanvas();const start=e=>{if(state.locked)return;e.preventDefault();state.find.drawing=true;state.find.points=[];clearCanvas(false);let p=point(e);state.find.points.push(p);ctx.beginPath();ctx.moveTo(p.x,p.y);dot(p.x,p.y)};const move=e=>{if(!state.find.drawing||state.locked)return;e.preventDefault();let p=point(e);state.find.points.push(p);ctx.lineTo(p.x,p.y);ctx.strokeStyle="#ff1654";ctx.lineWidth=8;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke()};const stop=e=>{if(!state.find.drawing||state.locked)return;e.preventDefault();state.find.drawing=false;checkFind()};canvas.onpointerdown=start;canvas.onpointermove=move;canvas.onpointerup=stop;canvas.onpointercancel=stop}
function resizeCanvas(){const {canvas,board}=state.find;if(!canvas||!board)return;const r=board.getBoundingClientRect(),ratio=devicePixelRatio||1;canvas.width=r.width*ratio;canvas.height=r.height*ratio;canvas.style.width=r.width+"px";canvas.style.height=r.height+"px";state.find.ctx.setTransform(ratio,0,0,ratio,0,0)}
function point(e){const r=state.find.board.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function dot(x,y){const c=state.find.ctx;c.fillStyle="#ff1654";c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill()}
function clearCanvas(reset=true){const {canvas,ctx}=state.find;if(!canvas||!ctx)return;const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);if(reset)state.find.points=[]}
function checkFind(){const pts=state.find.points,board=state.find.board,t=board.querySelector(".targetItem");if(!t||pts.length<2)return wrongFind();const br=board.getBoundingClientRect(),tr=t.getBoundingClientRect();const box={cx:tr.left-br.left+tr.width/2,cy:tr.top-br.top+tr.height/2,r:Math.max(tr.width,tr.height)/2};let hit=pts.some(p=>Math.hypot(p.x-box.cx,p.y-box.cy)<=box.r*1.25);let xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),draw={l:Math.min(...xs),r:Math.max(...xs),t:Math.min(...ys),b:Math.max(...ys)};let around=draw.l<=box.cx&&draw.r>=box.cx&&draw.t<=box.cy&&draw.b>=box.cy&&(draw.r-draw.l)>box.r&&(draw.b-draw.t)>box.r;if(pts.length>=6&&(hit||around))correctFind(t);else wrongFind()}
function correctFind(t){state.locked=true;checkpoint();playArea.classList.add("locked");t.classList.add("correctPulse");state.score++;state.stars++;update();celebrate();showFeedback("Correct",true);speak("Correct. Great job");setTimeout(next,2000)}
function wrongFind(){showFeedback("Try again",false);speak("Try again");bounce($("findBoard"));setTimeout(()=>clearCanvas(),650)}
function singleAnswer(btn,sel,ans){if(state.locked)return;if(String(sel).toLowerCase()===String(ans).toLowerCase()){state.locked=true;checkpoint();playArea.classList.add("locked");state.score++;state.stars++;update();celebrate();showFeedback("Great job",true);speak("Great job");setTimeout(next,2000)}else{showFeedback("Try again",false);speak("Try again");bounce(btn)}}
function worksheetAnswer(btn,row,sel,ans){if(state.locked||state.rows[row])return;if(sel===ans){state.rows[row]=true;checkpoint();let card=playArea.querySelector(`[data-row="${row}"]`);card.classList.add("correct");card.querySelectorAll("button").forEach(b=>b.disabled=true);sparkleAt(btn);if(state.current.rows.every((_,i)=>state.rows[i])){state.locked=true;checkpoint();playArea.classList.add("locked");state.score++;state.stars++;update();celebrate();showFeedback("Great job",true);speak("Great job");setTimeout(next,2000)}}else{showFeedback("Try again",false);speak("Try again");bounce(btn)}}


function renderMatchNumbers(q){
  playArea.innerHTML=`
    <div class="prompt">
      <div class="qTitle">Count and match</div>
      <div class="qSmall">Draw line to number</div>
    </div>
    <div id="matchBoard" class="matchBoard">
      <canvas id="matchCanvas" class="matchLineCanvas"></canvas>
      <div class="matchRows">
        ${q.rows.map((row,i)=>`
          <div class="matchRow" data-left-row="${i}">
            <div class="matchPics">${row.html}</div>
            <div class="matchDot matchDotL" data-left="${i}"></div>
            <div></div>
            <div class="matchDot matchDotR" data-right="${i}"></div>
            <div class="matchNumberCard ${q.numbers[i].color}" data-number-card="${i}">${q.numbers[i].number}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  setupMatchNumbers(q);
}

function setupMatchNumbers(q){
  const board=$("matchBoard");
  const canvas=$("matchCanvas");
  const ctx=canvas.getContext("2d");

  state.match={
    board,
    canvas,
    ctx,
    startLeft:null,
    active:null,
    lines:[],
    matchedLeft:{},
    matchedRight:{},
    drawing:false
  };

  resizeMatchCanvas();
  drawMatchLines();

  const start=e=>{
    if(state.locked) return;
    e.preventDefault();
    let p=matchPoint(e);
    let left=findNearestMatchDot(p,"left");

    if(left===null || state.match.matchedLeft[left]) return;

    state.match.startLeft=left;
    state.match.active={from:getMatchDotCenter("left",left),to:p};
    state.match.drawing=true;
    drawMatchLines();
  };

  const move=e=>{
    if(!state.match.drawing || state.locked) return;
    e.preventDefault();
    let p=matchPoint(e);
    state.match.active.to=p;
    drawMatchLines();
  };

  const end=e=>{
    if(!state.match.drawing || state.locked) return;
    e.preventDefault();

    let p=matchPoint(e);
    let right=findNearestMatchDot(p,"right");
    let left=state.match.startLeft;

    state.match.drawing=false;
    state.match.active=null;

    if(right===null || state.match.matchedRight[right]){
      drawMatchLines();
      showFeedback("Try again",false);
      speak("Try again");
      return;
    }

    const leftCount=q.rows[left].count;
    const rightNumber=q.numbers[right].number;

    if(leftCount===rightNumber){
      state.match.matchedLeft[left]=true;
      state.match.matchedRight[right]=true;
      state.match.lines.push({left,right});checkpoint();
      markMatchDone(left,right);
      drawMatchLines();
      sparkleAtMatch(left,right);

      if(Object.keys(state.match.matchedLeft).length===q.rows.length){
        state.locked=true;checkpoint();
        playArea.classList.add("locked");
        state.score++;
        state.stars++;
        update();
        celebrate();
        showFeedback("Great job",true);
        speak("Great job");
        setTimeout(next,2000);
      }else{
        showFeedback("Correct",true);
        speak("Correct");
        setTimeout(hideFeedback,700);
      }
    }else{
      drawMatchLines();
      showFeedback("Try again",false);
      speak("Try again");
    }
  };

  canvas.onpointerdown=start;
  canvas.onpointermove=move;
  canvas.onpointerup=end;
  canvas.onpointercancel=end;
  window.addEventListener("resize",()=>{resizeMatchCanvas();drawMatchLines();},{once:true});
}

function resizeMatchCanvas(){
  if(!state.match || !state.match.canvas || !state.match.board) return;
  const canvas=state.match.canvas;
  const board=state.match.board;
  const rect=board.getBoundingClientRect();
  const ratio=window.devicePixelRatio||1;
  canvas.width=Math.floor(rect.width*ratio);
  canvas.height=Math.floor(rect.height*ratio);
  canvas.style.width=rect.width+"px";
  canvas.style.height=rect.height+"px";
  state.match.ctx.setTransform(ratio,0,0,ratio,0,0);
}

function matchPoint(e){
  const r=state.match.board.getBoundingClientRect();
  return{x:e.clientX-r.left,y:e.clientY-r.top};
}

function getMatchDotCenter(side,index){
  const selector=side==="left"?`[data-left="${index}"]`:`[data-right="${index}"]`;
  const dot=state.match.board.querySelector(selector);
  const br=state.match.board.getBoundingClientRect();
  const dr=dot.getBoundingClientRect();
  return{x:dr.left-br.left+dr.width/2,y:dr.top-br.top+dr.height/2};
}

function findNearestMatchDot(p,side){
  const dots=[...state.match.board.querySelectorAll(side==="left"?".matchDotL":".matchDotR")];
  let best=null;
  let bestDist=9999;

  dots.forEach(dot=>{
    const idx=side==="left"?+dot.dataset.left:+dot.dataset.right;
    const br=state.match.board.getBoundingClientRect();
    const dr=dot.getBoundingClientRect();
    const cx=dr.left-br.left+dr.width/2;
    const cy=dr.top-br.top+dr.height/2;
    const d=Math.hypot(p.x-cx,p.y-cy);
    if(d<bestDist){
      bestDist=d;
      best=idx;
    }
  });

  return bestDist<58?best:null;
}

function drawMatchLines(){
  if(!state.match || !state.match.ctx) return;
  const ctx=state.match.ctx;
  const rect=state.match.canvas.getBoundingClientRect();
  ctx.clearRect(0,0,rect.width,rect.height);

  ctx.lineCap="round";
  ctx.lineJoin="round";

  state.match.lines.forEach(line=>{
    const a=getMatchDotCenter("left",line.left);
    const b=getMatchDotCenter("right",line.right);
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.strokeStyle="#12b886";
    ctx.lineWidth=8;
    ctx.stroke();
  });

  if(state.match.active){
    ctx.beginPath();
    ctx.moveTo(state.match.active.from.x,state.match.active.from.y);
    ctx.lineTo(state.match.active.to.x,state.match.active.to.y);
    ctx.strokeStyle="#ff1654";
    ctx.lineWidth=7;
    ctx.stroke();
  }
}

function markMatchDone(left,right){
  const leftDot=state.match.board.querySelector(`[data-left="${left}"]`);
  const rightDot=state.match.board.querySelector(`[data-right="${right}"]`);
  if(leftDot) leftDot.closest(".matchRow").classList.add("leftDone");
  if(rightDot) rightDot.closest(".matchRow").classList.add("rightDone");
}

function sparkleAtMatch(left,right){
  const a=getMatchDotCenter("left",left);
  const br=state.match.board.getBoundingClientRect();
  sparkle(br.left+a.x,br.top+a.y);
}





function renderMatchAlphabet(q){
  playArea.innerHTML=`
    <div class="prompt">
      <div class="qTitle">Match alphabets</div>
      <div class="qSmall">Draw line to picture</div>
    </div>
    <div id="alphaBoard" class="alphaBoard">
      <canvas id="alphaCanvas" class="alphaLineCanvas"></canvas>
      <div class="alphaRows">
        ${q.letters.map((left,i)=>`
          <div class="alphaRow" data-alpha-left-row="${i}">
            <div class="alphaLetterCard">${left.letter}</div>
            <div class="alphaDot alphaDotL" data-aleft="${i}"></div>
            <div></div>
            <div class="alphaDot alphaDotR" data-aright="${i}"></div>
            <div class="alphaPicCard" data-apic-card="${i}">
              <span class="alphaEmoji">${q.pictures[i].emoji}</span>
              <span class="alphaName">${q.pictures[i].name}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  setupMatchAlphabet(q);
}

function setupMatchAlphabet(q){
  const board=$("alphaBoard");
  const canvas=$("alphaCanvas");
  const ctx=canvas.getContext("2d");

  state.alpha={
    board,
    canvas,
    ctx,
    startLeft:null,
    active:null,
    lines:[],
    matchedLeft:{},
    matchedRight:{},
    drawing:false
  };

  resizeAlphaCanvas();
  drawAlphaLines();

  const start=e=>{
    if(state.locked) return;
    e.preventDefault();
    let p=alphaPoint(e);
    let left=findNearestAlphaDot(p,"left");

    if(left===null || state.alpha.matchedLeft[left]) return;

    state.alpha.startLeft=left;
    state.alpha.active={from:getAlphaDotCenter("left",left),to:p};
    state.alpha.drawing=true;
    drawAlphaLines();
  };

  const move=e=>{
    if(!state.alpha.drawing || state.locked) return;
    e.preventDefault();
    let p=alphaPoint(e);
    state.alpha.active.to=p;
    drawAlphaLines();
  };

  const end=e=>{
    if(!state.alpha.drawing || state.locked) return;
    e.preventDefault();

    let p=alphaPoint(e);
    let right=findNearestAlphaDot(p,"right");
    let left=state.alpha.startLeft;

    state.alpha.drawing=false;
    state.alpha.active=null;

    if(right===null || state.alpha.matchedRight[right]){
      drawAlphaLines();
      showFeedback("Try again",false);
      speak("Try again");
      return;
    }

    const leftLetter=q.letters[left].letter;
    const rightLetter=q.pictures[right].letter;

    if(leftLetter===rightLetter){
      state.alpha.matchedLeft[left]=true;
      state.alpha.matchedRight[right]=true;
      state.alpha.lines.push({left,right});checkpoint();
      markAlphaDone(left,right);
      drawAlphaLines();
      sparkleAtAlpha(left,right);

      if(Object.keys(state.alpha.matchedLeft).length===q.letters.length){
        state.locked=true;checkpoint();
        playArea.classList.add("locked");
        state.score++;
        state.stars++;
        update();
        celebrate();
        showFeedback("Great job",true);
        speak("Great job");
        setTimeout(next,2000);
      }else{
        showFeedback("Correct",true);
        speak("Correct");
        setTimeout(hideFeedback,700);
      }
    }else{
      drawAlphaLines();
      showFeedback("Try again",false);
      speak("Try again");
    }
  };

  canvas.onpointerdown=start;
  canvas.onpointermove=move;
  canvas.onpointerup=end;
  canvas.onpointercancel=end;
  window.addEventListener("resize",()=>{resizeAlphaCanvas();drawAlphaLines();},{once:true});
}

function resizeAlphaCanvas(){
  if(!state.alpha || !state.alpha.canvas || !state.alpha.board) return;
  const canvas=state.alpha.canvas;
  const board=state.alpha.board;
  const rect=board.getBoundingClientRect();
  const ratio=window.devicePixelRatio||1;
  canvas.width=Math.floor(rect.width*ratio);
  canvas.height=Math.floor(rect.height*ratio);
  canvas.style.width=rect.width+"px";
  canvas.style.height=rect.height+"px";
  state.alpha.ctx.setTransform(ratio,0,0,ratio,0,0);
}

function alphaPoint(e){
  const r=state.alpha.board.getBoundingClientRect();
  return{x:e.clientX-r.left,y:e.clientY-r.top};
}

function getAlphaDotCenter(side,index){
  const selector=side==="left"?`[data-aleft="${index}"]`:`[data-aright="${index}"]`;
  const dot=state.alpha.board.querySelector(selector);
  const br=state.alpha.board.getBoundingClientRect();
  const dr=dot.getBoundingClientRect();
  return{x:dr.left-br.left+dr.width/2,y:dr.top-br.top+dr.height/2};
}

function findNearestAlphaDot(p,side){
  const dots=[...state.alpha.board.querySelectorAll(side==="left"?".alphaDotL":".alphaDotR")];
  let best=null;
  let bestDist=9999;

  dots.forEach(dot=>{
    const idx=side==="left"?+dot.dataset.aleft:+dot.dataset.aright;
    const br=state.alpha.board.getBoundingClientRect();
    const dr=dot.getBoundingClientRect();
    const cx=dr.left-br.left+dr.width/2;
    const cy=dr.top-br.top+dr.height/2;
    const d=Math.hypot(p.x-cx,p.y-cy);
    if(d<bestDist){
      bestDist=d;
      best=idx;
    }
  });

  return bestDist<58?best:null;
}

function drawAlphaLines(){
  if(!state.alpha || !state.alpha.ctx) return;
  const ctx=state.alpha.ctx;
  const rect=state.alpha.canvas.getBoundingClientRect();
  ctx.clearRect(0,0,rect.width,rect.height);

  ctx.lineCap="round";
  ctx.lineJoin="round";

  state.alpha.lines.forEach(line=>{
    const a=getAlphaDotCenter("left",line.left);
    const b=getAlphaDotCenter("right",line.right);
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.strokeStyle="#12b886";
    ctx.lineWidth=8;
    ctx.stroke();
  });

  if(state.alpha.active){
    ctx.beginPath();
    ctx.moveTo(state.alpha.active.from.x,state.alpha.active.from.y);
    ctx.lineTo(state.alpha.active.to.x,state.alpha.active.to.y);
    ctx.strokeStyle="#ff1654";
    ctx.lineWidth=7;
    ctx.stroke();
  }
}

function markAlphaDone(left,right){
  const leftDot=state.alpha.board.querySelector(`[data-aleft="${left}"]`);
  const rightDot=state.alpha.board.querySelector(`[data-aright="${right}"]`);
  if(leftDot) leftDot.closest(".alphaRow").classList.add("leftDone");
  if(rightDot) rightDot.closest(".alphaRow").classList.add("rightDone");
}

function sparkleAtAlpha(left,right){
  const a=getAlphaDotCenter("left",left);
  const br=state.alpha.board.getBoundingClientRect();
  sparkle(br.left+a.x,br.top+a.y);
}


function runnerQ(l){
  const type=l<=2?"count":l<=4?(Math.random()<.5?"count":"add"):l<=6?(Math.random()<.45?"add":"word"):l<=8?(Math.random()<.5?"math":"word"):"mixed";
  let question,answer,choices,visual="",key;
  if(type==="count"){
    const max=l===1?5:l===2?8:10,emoji=pick(["🍎","⭐","🐟","🧸","⚽","🚗","🌼","🍌"]);
    answer=rand(1,max);question=`How many ${emoji}?`;visual=repeat(emoji,answer);choices=numChoices(answer,1,max);key=`runner-count-${l}-${emoji}-${answer}`;
  }else if(type==="add"){
    const max=l<=4?6:l<=6?10:15,a=rand(1,max),b=rand(1,max);
    answer=a+b;question=`${a} + ${b}`;choices=numChoices(answer,2,max*2);key=`runner-add-${l}-${a}-${b}`;
  }else if(type==="math"){
    if(Math.random()<.55){const a=rand(5,25),b=rand(2,20);answer=a+b;question=`${a} + ${b}`;choices=numChoices(answer,1,60);key=`runner-math-add-${l}-${a}-${b}`;}
    else{const a=rand(8,35),b=rand(1,Math.min(20,a-1));answer=a-b;question=`${a} − ${b}`;choices=numChoices(answer,0,40);key=`runner-math-sub-${l}-${a}-${b}`;}
  }else if(type==="word"){
    const pool=words[Math.min(l,10)]||words[10];answer=pick(pool);question=`Find: ${answer.toUpperCase()}`;const all=Object.values(words).flat();choices=shuffle(unique([answer,...shuffle(all.filter(w=>w!==answer)).slice(0,2)]));key=`runner-word-${l}-${answer}`;
  }else{
    if(Math.random()<.5){const a=rand(10,40),b=rand(5,30);answer=a+b;question=`${a} + ${b}`;choices=numChoices(answer,0,90);key=`runner-mixed-${l}-${a}-${b}`;}
    else{const pool=words[Math.min(l,10)]||words[10];answer=pick(pool);question=`Find: ${answer.toUpperCase()}`;const all=Object.values(words).flat();choices=shuffle(unique([answer,...shuffle(all.filter(w=>w!==answer)).slice(0,2)]));key=`runner-mixed-word-${l}-${answer}`;}
  }
  choices=shuffle(choices).slice(0,3);
  if(!choices.map(String).includes(String(answer))){choices[rand(0,2)]=answer;choices=shuffle(choices);}
  return{mode:"runner",title:"Run & Learn",helper:"Move to the correct lane",spoken:`Run to the correct answer. ${String(question).replace("−","minus")}`,question,visual,answer,choices,key}
}

function renderRunner(q){
  const answerIndex=q.choices.map(String).indexOf(String(q.answer));
  playArea.innerHTML=`<div class="runnerGame"><div class="runnerPrompt"><div class="runnerQuestion">${esc(q.question)}</div><div class="runnerHelp">${q.visual?esc(q.visual):"Choose the correct lane"}</div></div><div id="runnerTrack" class="runnerTrack"><div class="runnerRoad"></div><div class="runnerLaneLine line1"></div><div class="runnerLaneLine line2"></div>${q.choices.map((choice,i)=>`<div class="runnerOption" data-lane="${i}" data-good="${i===answerIndex?"yes":"no"}">${esc(String(choice)).toUpperCase()}</div>`).join("")}<div id="runnerPlayer" class="runnerPlayer">🏃</div></div><div class="runnerControls"><button class="runnerControlBtn" id="runnerLeft">⬅️</button><button class="runnerControlBtn" id="runnerGo">GO</button><button class="runnerControlBtn" id="runnerRight">➡️</button></div></div>`;
  state.runner={lane:1,answerIndex};
  updateRunnerPlayer();
  const leftBtn=$("runnerLeft"),rightBtn=$("runnerRight"),goBtn=$("runnerGo"),track=$("runnerTrack");
  if(leftBtn)leftBtn.onclick=()=>moveRunner(-1);
  if(rightBtn)rightBtn.onclick=()=>moveRunner(1);
  if(goBtn)goBtn.onclick=()=>checkRunnerAnswer();
  if(track)track.onclick=e=>{if(state.locked)return;const rect=track.getBoundingClientRect(),x=e.clientX-rect.left;state.runner.lane=x<rect.width/3?0:x<rect.width*2/3?1:2;updateRunnerPlayer();};
  window.onkeydown=e=>{if(state.game!=="runner"||state.locked)return;if(e.key==="ArrowLeft")moveRunner(-1);if(e.key==="ArrowRight")moveRunner(1);if(e.key==="Enter"||e.key===" ")checkRunnerAnswer();};
}

function moveRunner(dir){if(state.locked||!state.runner)return;state.runner.lane=Math.max(0,Math.min(2,state.runner.lane+dir));updateRunnerPlayer();}
function updateRunnerPlayer(){const player=$("runnerPlayer");if(!player||!state.runner)return;const laneCenters=[16.5,50,83.5];player.style.left=`calc(${laneCenters[state.runner.lane]}% - 45px)`;player.classList.add("jump");setTimeout(()=>player.classList.remove("jump"),180);}
function checkRunnerAnswer(){if(state.locked||!state.runner)return;const lane=state.runner.lane,options=[...document.querySelectorAll(".runnerOption")],selected=options[lane];if(!selected)return;if(selected.dataset.good==="yes"){state.locked=true;checkpoint();playArea.classList.add("locked");selected.classList.add("goodGlow");state.score++;state.stars++;update();celebrate();showFeedback("Great job",true);speak("Great job");setTimeout(next,2000);}else{showFeedback("Try again",false);speak("Try again");bounce(selected);}}


function runnerQ(l){
  const type=l<=2?"count":l<=4?(Math.random()<.55?"count":"add"):l<=6?(Math.random()<.45?"add":"word"):l<=8?(Math.random()<.5?"math":"word"):"mixed";
  let question,answer,choices,visual="",key;

  if(type==="count"){
    const max=l===1?5:l===2?8:10;
    const emoji=pick(["🍎","⭐","🐟","🧸","⚽","🚗","🌼","🍌"]);
    answer=rand(1,max);
    question=`How many ${emoji}?`;
    visual=repeat(emoji,answer);
    choices=numChoices(answer,1,max);
    key=`runner-count-${l}-${emoji}-${answer}`;
  }else if(type==="add"){
    const max=l<=4?6:l<=6?10:15;
    const a=rand(1,max),b=rand(1,max);
    answer=a+b;
    question=`${a} + ${b}`;
    choices=numChoices(answer,2,max*2);
    key=`runner-add-${l}-${a}-${b}`;
  }else if(type==="math"){
    if(Math.random()<.55){
      const a=rand(5,25),b=rand(2,20);
      answer=a+b;question=`${a} + ${b}`;choices=numChoices(answer,1,60);key=`runner-math-add-${l}-${a}-${b}`;
    }else{
      const a=rand(8,35),b=rand(1,Math.min(20,a-1));
      answer=a-b;question=`${a} − ${b}`;choices=numChoices(answer,0,40);key=`runner-math-sub-${l}-${a}-${b}`;
    }
  }else if(type==="word"){
    const pool=words[Math.min(l,10)]||words[10];
    answer=pick(pool);
    question=`Find: ${answer.toUpperCase()}`;
    const all=Object.values(words).flat();
    choices=shuffle(unique([answer,...shuffle(all.filter(w=>w!==answer)).slice(0,2)]));
    key=`runner-word-${l}-${answer}`;
  }else{
    if(Math.random()<.5){
      const a=rand(10,40),b=rand(5,30);
      answer=a+b;question=`${a} + ${b}`;choices=numChoices(answer,0,90);key=`runner-mixed-${l}-${a}-${b}`;
    }else{
      const pool=words[Math.min(l,10)]||words[10];
      answer=pick(pool);question=`Find: ${answer.toUpperCase()}`;
      const all=Object.values(words).flat();
      choices=shuffle(unique([answer,...shuffle(all.filter(w=>w!==answer)).slice(0,2)]));
      key=`runner-mixed-word-${l}-${answer}`;
    }
  }

  choices=shuffle(choices).slice(0,3);
  if(!choices.map(String).includes(String(answer))){
    choices[rand(0,2)]=answer;
    choices=shuffle(choices);
  }

  return{mode:"runner",title:"Run & Learn",helper:"Swipe to correct answer",spoken:`Swipe to the correct answer. ${String(question).replace("−","minus")}`,question,visual,answer,choices,key};
}

function renderTouchRunner(q){
  const answerIndex=q.choices.map(String).indexOf(String(q.answer));
  playArea.innerHTML=`
    <div class="touchRunnerGame">
      <div class="touchRunnerTop">
        <div class="touchRunnerQuestion">${esc(q.question)}</div>
        <div class="touchRunnerHint">${q.visual?esc(q.visual):"Swipe left or right. Run into the correct answer."}</div>
      </div>
      <div id="touchRunnerWorld" class="touchRunnerWorld">
        <div class="runnerCloud c1">☁️</div>
        <div class="runnerCloud c2">☁️</div>
        <div class="touchRunnerRoad"></div>
        <div id="runnerMovingPlayer" class="runnerMovingPlayer" aria-label="Car"><img src="assets/car-topview.png" alt="Car" class="runnerPlayerCar"></div>
      </div>
      <div class="runnerMiniControls">
        <button id="touchRunLeft">⬅️</button>
        <button id="touchRunJump">⬆️</button>
        <button id="touchRunRight">➡️</button>
      </div>
    </div>
  `;

  state.touchRunner={
    lane:1,
    jumping:false,
    answerIndex,
    choices:q.choices,
    answer:q.answer,
    speed:2.7 + Math.min(3,state.level*.18),
    gate:null,
    obstacle:null,
    coin:null,
    raf:null,
    lastTime:0,
    startX:0,
    startY:0,
    done:false
  };

  updateTouchRunnerPlayer();

  const world=$("touchRunnerWorld");
  $("touchRunLeft").onclick=()=>touchRunnerMove(-1);
  $("touchRunRight").onclick=()=>touchRunnerMove(1);
  $("touchRunJump").onclick=()=>touchRunnerJump();

  world.addEventListener("pointerdown",e=>{
    state.touchRunner.startX=e.clientX;
    state.touchRunner.startY=e.clientY;
  });

  world.addEventListener("pointerup",e=>{
    const dx=e.clientX-state.touchRunner.startX;
    const dy=e.clientY-state.touchRunner.startY;
    if(Math.abs(dx)>35 && Math.abs(dx)>Math.abs(dy)){
      touchRunnerMove(dx>0?1:-1);
    }else if(dy<-35){
      touchRunnerJump();
    }else{
      const rect=world.getBoundingClientRect();
      const x=e.clientX-rect.left;
      state.touchRunner.lane=x<rect.width/3?0:x<rect.width*2/3?1:2;
      updateTouchRunnerPlayer();
    }
  });

  window.onkeydown=e=>{
    if(state.game!=="runner"||state.locked)return;
    if(e.key==="ArrowLeft")touchRunnerMove(-1);
    if(e.key==="ArrowRight")touchRunnerMove(1);
    if(e.key==="ArrowUp"||e.key===" ")touchRunnerJump();
  };

  spawnRunnerGate(q);
  setTimeout(()=>spawnRunnerObstacle(),600);
  setTimeout(()=>spawnRunnerCoin(),1100);
  state.touchRunner.raf=requestAnimationFrame(touchRunnerLoop);
}

function getLaneLeftPercent(lane){return [16.5,50,83.5][lane];}

function updateTouchRunnerPlayer(){
  const player=$("runnerMovingPlayer");
  if(!player||!state.touchRunner)return;
  const half=(window.innerWidth<=430?36:42);player.style.left=`calc(${getLaneLeftPercent(state.touchRunner.lane)}% - ${half}px)`;
}

function touchRunnerMove(dir){
  if(state.locked||!state.touchRunner)return;
  state.touchRunner.lane=Math.max(0,Math.min(2,state.touchRunner.lane+dir));
  updateTouchRunnerPlayer();
}

function touchRunnerJump(){
  if(state.locked||!state.touchRunner||state.touchRunner.jumping)return;
  const player=$("runnerMovingPlayer");
  state.touchRunner.jumping=true;
  if(player)player.classList.add("jump");
  setTimeout(()=>{
    state.touchRunner.jumping=false;
    if(player)player.classList.remove("jump");
  },520);
}

function spawnRunnerGate(q){
  const world=$("touchRunnerWorld");
  if(!world||!state.touchRunner)return;
  const gateWrap=document.createElement("div");
  gateWrap.className="runnerGateWrap";
  q.choices.forEach((choice,i)=>{
    const el=document.createElement("div");
    el.className=`runnerAnswerGate lane${i}`;
    el.dataset.lane=String(i);
    el.dataset.good=String(choice).toLowerCase()===String(q.answer).toLowerCase()?"yes":"no";
    el.textContent=String(choice).toUpperCase();
    gateWrap.appendChild(el);
  });
  world.appendChild(gateWrap);
  state.touchRunner.gate={el:gateWrap,y:-120,checked:false};
}

function spawnRunnerObstacle(){
  const world=$("touchRunnerWorld");
  if(!world||!state.touchRunner||state.touchRunner.done)return;
  const lane=rand(0,2);
  const el=document.createElement("div");
  el.className="runnerObstacle";
  el.textContent=pick(["🚧","🧱","🌵"]);
  el.dataset.lane=String(lane);
  el.style.left=`calc(${getLaneLeftPercent(lane)}% - 31px)`;
  world.appendChild(el);
  state.touchRunner.obstacle={el,lane,y:-80,hit:false};
}

function spawnRunnerCoin(){
  const world=$("touchRunnerWorld");
  if(!world||!state.touchRunner||state.touchRunner.done)return;
  const lane=rand(0,2);
  const el=document.createElement("div");
  el.className="runnerStarCoin";
  el.textContent="⭐";
  el.dataset.lane=String(lane);
  el.style.left=`calc(${getLaneLeftPercent(lane)}% - 27px)`;
  world.appendChild(el);
  state.touchRunner.coin={el,lane,y:-60,collected:false};
}


function runnerCorrectDriveOn(selected){
  const r=state.touchRunner;
  const world=$("touchRunnerWorld");
  const player=$("runnerMovingPlayer");

  if(!r || r.done) return;
  r.done=true;

  if(selected) selected.classList.add("successGate");
  if(world) world.classList.add("driveSuccess");
  if(player) player.classList.add("driveSuccess");

  state.score++;
  state.stars++;
  update();
  celebrate();
  showFeedback("Great job",true);
  speak("Great job. Keep going!");

  setTimeout(()=>{
    state.locked=true;checkpoint();
    next();
  },1650);
}

function touchRunnerLoop(time){
  const r=state.touchRunner;
  const world=$("touchRunnerWorld");
  if(!r||!world||state.game!=="runner"||state.locked||r.done)return;

  const height=world.getBoundingClientRect().height;
  const playerY=height-95;

  if(r.gate){
    r.gate.y+=r.speed;
    [...r.gate.el.children].forEach(el=>el.style.top=r.gate.y+"px");

    if(!r.gate.checked && r.gate.y>=playerY-70){
      r.gate.checked=true;
      const selected=[...r.gate.el.children].find(el=>+el.dataset.lane===r.lane);
      if(selected&&selected.dataset.good==="yes"){
        runnerCorrectDriveOn(selected);
        return;
      }else{
        showFeedback("Try again",false);
        speak("Try again");
        r.gate.checked=false;
        r.gate.y=-120;
        [...r.gate.el.children].forEach(el=>el.style.top=r.gate.y+"px");
      }
    }
  }

  if(r.obstacle){
    r.obstacle.y+=r.speed*1.15;
    r.obstacle.el.style.top=r.obstacle.y+"px";
    if(!r.obstacle.hit && r.obstacle.y>=playerY-45 && r.obstacle.y<=playerY+35 && r.obstacle.lane===r.lane && !r.jumping){
      r.obstacle.hit=true;
      showFeedback("Jump!",false);
      speak("Jump");
      bounce(r.obstacle.el);
      r.obstacle.y=-100;
      r.obstacle.lane=rand(0,2);
      r.obstacle.el.style.left=`calc(${getLaneLeftPercent(r.obstacle.lane)}% - 31px)`;
    }
    if(r.obstacle.y>height){
      r.obstacle.y=-100;
      r.obstacle.lane=rand(0,2);
      r.obstacle.hit=false;
      r.obstacle.el.style.left=`calc(${getLaneLeftPercent(r.obstacle.lane)}% - 31px)`;
    }
  }

  if(r.coin){
    r.coin.y+=r.speed;
    r.coin.el.style.top=r.coin.y+"px";
    if(!r.coin.collected && r.coin.y>=playerY-40 && r.coin.y<=playerY+40 && r.coin.lane===r.lane){
      r.coin.collected=true;
      state.stars++;
      update();
      sparkleAt(r.coin.el);
      r.coin.y=-120;
      r.coin.lane=rand(0,2);
      r.coin.el.style.left=`calc(${getLaneLeftPercent(r.coin.lane)}% - 27px)`;
      setTimeout(()=>{if(r.coin)r.coin.collected=false;},400);
    }
    if(r.coin.y>height){
      r.coin.y=-90;
      r.coin.lane=rand(0,2);
      r.coin.el.style.left=`calc(${getLaneLeftPercent(r.coin.lane)}% - 27px)`;
    }
  }

  r.raf=requestAnimationFrame(touchRunnerLoop);
}





function missingAlphaQ(l){
  if(!state.missingAlphaPools) state.missingAlphaPools={};

  if(!state.missingAlphaPools[l] || !state.missingAlphaPools[l].length){
    state.missingAlphaPools[l]=buildMissingAlphaPool(l).filter(q=>!state.usedLevelKeys[q.key]);
  }

  while(state.missingAlphaPools[l].length){
    const q=state.missingAlphaPools[l].shift();
    if(!state.usedLevelKeys[q.key]) return q;
  }

  const refill=buildMissingAlphaPool(l).filter(q=>!state.usedLevelKeys[q.key]);
  state.missingAlphaPools[l]=refill;
  return refill.length ? state.missingAlphaPools[l].shift() : buildMissingAlphaPool(l)[0];
}

function missingCountForLevel(l){
  if(state.game==="missingalpha2")return 2;
  if(l<=2) return 1;
  if(l<=4) return 2;
  if(l<=6) return 3;
  if(l<=8) return 4;
  if(l===9) return 5;
  return 6;
}

function sequenceLengthsForLevel(l){
  if(l<=2) return [3,4];
  if(l<=4) return [5,6];
  if(l<=6) return [6,7];
  if(l<=8) return [7,8];
  return [8,9];
}

function buildMissingAlphaPool(l){
  const upper="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const cases=["upper","lower"];
  const missingCount=missingCountForLevel(l);
  const lengths=sequenceLengthsForLevel(l).filter(len=>len>missingCount);

  let questions=[];

  cases.forEach(alphaCase=>{
    const letters=alphaCase==="lower" ? upper.map(x=>x.toLowerCase()) : upper;

    lengths.forEach(length=>{
      for(let start=0; start<=letters.length-length; start++){
        const seq=letters.slice(start,start+length);
        const positionCombos=missingPositionCombos(length,missingCount);

        positionCombos.forEach(combo=>{
          const missingPositions=combo;
          const answers=missingPositions.map(pos=>seq[pos]);
          const display=seq.map((letter,i)=>missingPositions.includes(i)?"_":letter);
          const pool=letters.filter(x=>!answers.includes(x));
          const choiceCount=Math.min(6,Math.max(3,answers.length+2));
          const choices=shuffle([...answers,...shuffle(pool).slice(0,choiceCount-answers.length)]);

          questions.push({
            mode:"missingalpha",
            title:"Missing Alphabets",
            helper:"Drag the missing letters",
            spoken:`Find the missing letters. ${seq.map((x,i)=>missingPositions.includes(i)?"blank":x.toUpperCase()).join(", ")}`,
            sequence:display,
            fullSequence:seq,
            answers,
            missingPositions,
            answer:answers[0],
            choices,
            alphaCase,
            missingCount,
            key:`${state.game}-multi-${alphaCase}-${l}-${start}-${length}-${missingPositions.join("-")}`
          });
        });
      }
    });
  });

  return shuffle(questions);
}

function missingPositionCombos(length,count){
  const all=[];
  const positions=[...Array(length)].map((_,i)=>i);

  function choose(start,combo){
    if(combo.length===count){
      all.push(combo.slice());
      return;
    }

    for(let i=start;i<positions.length;i++){
      combo.push(positions[i]);
      choose(i+1,combo);
      combo.pop();
    }
  }

  choose(0,[]);

  // Keep the pool large but not huge.
  return shuffle(all).slice(0,24);
}

function renderMissingAlpha(q){
  const typeText=q.alphaCase==="lower"?"Small letters":"Capital letters";
  const blankText=q.missingCount>1?`${q.missingCount} missing letters`:"1 missing letter";

  playArea.innerHTML=`
    <div class="missingAlphaGame">
      <div class="missingAlphaPrompt">
        <div class="missingAlphaTitle">Missing Alphabets</div>
        <div class="missingAlphaSmall">Drag each letter into the right blank</div>
        <div class="alphaTypeBadge">${typeText} • ${blankText}</div>
        <div class="alphaBlankHelp">Tap a letter, then tap the blank — or drag and drop.</div>
      </div>

      <div class="alphaSequenceCard">
        <div class="alphaSequence">
          ${q.sequence.map((letter,i)=>letter==="_"?`<div class="alphaDrop ${q.missingCount>2?"smallBlank":""}" data-pos="${i}" data-answer="${esc(q.fullSequence[i])}">_</div>`:`<div class="alphaSeqLetter">${esc(letter)}</div>`).join(`<div class="alphaSeqLetter">,</div>`)}
        </div>
      </div>

      <div class="alphaChoices">
        ${q.choices.map(letter=>`<button class="alphaChoice" type="button" data-letter="${esc(letter)}">${esc(letter)}</button>`).join("")}
      </div>
    </div>
  `;

  setupMissingAlphaDrag(q);
}

function setupMissingAlphaDrag(q){
  state.missingAlphaFilled={};
  state.selectedAlphaChoice=null;

  const drops=[...document.querySelectorAll(".alphaDrop")];
  const choices=[...document.querySelectorAll(".alphaChoice")];

  choices.forEach(choice=>{
    choice.onclick=()=>{
      if(state.locked || choice.classList.contains("used")) return;
      choices.forEach(c=>c.classList.remove("selected"));
      choice.classList.add("selected");
      state.selectedAlphaChoice=choice;
      speak(`Letter ${choice.dataset.letter.toUpperCase()}`);
    };
    choice.onpointerdown=e=>startAlphaDrag(e,choice,drops);
  });

  drops.forEach(drop=>{
    drop.onclick=()=>{
      if(state.locked || drop.classList.contains("filled")) return;
      if(state.selectedAlphaChoice){
        missingAlphaAnswer(state.selectedAlphaChoice.dataset.letter,state.selectedAlphaChoice,drop);
      }else{
        showFeedback("Pick a letter",false);
        speak("Pick a letter");
        bounce(drop);
      }
    };
  });
}

function startAlphaDrag(e,choice,drops){
  if(state.locked || choice.classList.contains("used")) return;
  e.preventDefault();

  const letter=choice.dataset.letter;
  const ghost=document.createElement("div");
  ghost.className="alphaGhost";
  ghost.textContent=letter;
  document.body.appendChild(ghost);

  const moveGhost=(x,y)=>{
    ghost.style.left=x+"px";
    ghost.style.top=y+"px";
  };

  moveGhost(e.clientX,e.clientY);
  choice.setPointerCapture(e.pointerId);

  const onMove=ev=>{
    moveGhost(ev.clientX,ev.clientY);
    const over=getDropAtPoint(ev.clientX,ev.clientY);
    drops.forEach(d=>d.classList.remove("ready"));
    if(over && !over.classList.contains("filled")) over.classList.add("ready");
  };

  const onUp=ev=>{
    choice.removeEventListener("pointermove",onMove);
    choice.removeEventListener("pointerup",onUp);
    choice.removeEventListener("pointercancel",onUp);

    const drop=getDropAtPoint(ev.clientX,ev.clientY);
    ghost.remove();
    drops.forEach(d=>d.classList.remove("ready"));

    if(drop && !drop.classList.contains("filled")){
      missingAlphaAnswer(letter,choice,drop);
    }
  };

  choice.addEventListener("pointermove",onMove);
  choice.addEventListener("pointerup",onUp);
  choice.addEventListener("pointercancel",onUp);
}

function getDropAtPoint(x,y){
  const drops=[...document.querySelectorAll(".alphaDrop")];
  return drops.find(drop=>{
    const d=drop.getBoundingClientRect();
    return x>=d.left && x<=d.right && y>=d.top && y<=d.bottom;
  }) || null;
}

function missingAlphaAnswer(letter,choice,drop){
  if(state.locked || !drop) return;

  if(String(letter)===String(drop.dataset.answer)){
    drop.textContent=letter;
    drop.classList.add("filled");
    if(choice){
      choice.classList.add("used");
      choice.classList.remove("selected");
    }
    state.selectedAlphaChoice=null;
    state.missingAlphaFilled[drop.dataset.pos]=true;checkpoint();
    sparkleAt(drop);

    const allDrops=[...document.querySelectorAll(".alphaDrop")];
    const allFilled=allDrops.every(d=>d.classList.contains("filled"));

    if(allFilled){
      state.locked=true;checkpoint();
      playArea.classList.add("locked");
      state.score++;
      state.stars++;
      update();
      celebrate();
      showFeedback("Great job",true);
      speak("Great job");
      setTimeout(next,2000);
    }else{
      showFeedback("Correct",true);
      speak("Correct");
      setTimeout(hideFeedback,700);
    }
  }else{
    showFeedback("Try again",false);
    speak("Try again");
    bounce(choice || drop);
  }
}


function missingNumberQ(l){
  if(!state.missingNumberPools) state.missingNumberPools={};

  if(!state.missingNumberPools[l] || !state.missingNumberPools[l].length){
    state.missingNumberPools[l]=buildMissingNumberPool(l).filter(q=>!state.usedLevelKeys[q.key]);
  }

  while(state.missingNumberPools[l].length){
    const q=state.missingNumberPools[l].shift();
    if(!state.usedLevelKeys[q.key]) return q;
  }

  const refill=buildMissingNumberPool(l).filter(q=>!state.usedLevelKeys[q.key]);
  state.missingNumberPools[l]=refill;
  return refill.length ? state.missingNumberPools[l].shift() : buildMissingNumberPool(l)[0];
}

function missingNumberRange(l){
  if(l===1) return {min:1,max:20,label:"1 to 20"};
  if(l===2) return {min:10,max:30,label:"10 to 30"};
  if(l===3) return {min:20,max:40,label:"20 to 40"};
  if(l===4) return {min:30,max:50,label:"30 to 50"};
  if(l===5) return {min:40,max:60,label:"40 to 60"};
  if(l===6) return {min:50,max:70,label:"50 to 70"};
  if(l===7) return {min:60,max:80,label:"60 to 80"};
  if(l===8) return {min:70,max:90,label:"70 to 90"};
  if(l===9) return {min:80,max:100,label:"80 to 100"};
  return {min:1,max:100,label:"1 to 100"};
}

function missingNumberCountForLevel(l){
  if(state.game==="missingnum2")return 2;
  if(l<=2) return 1;
  if(l<=4) return 2;
  if(l<=6) return 3;
  if(l<=8) return 4;
  if(l===9) return 5;
  return 6;
}

function numberSequenceLengthsForLevel(l){
  if(l<=2) return [3,4];
  if(l<=4) return [4,5];
  if(l<=6) return [5,6];
  if(l<=8) return [6,7];
  return [7,8];
}

function buildMissingNumberPool(l){
  const range=missingNumberRange(l);
  const missingCount=missingNumberCountForLevel(l);
  const lengths=numberSequenceLengthsForLevel(l).filter(len=>len>missingCount);
  let questions=[];

  lengths.forEach(length=>{
    for(let start=range.min; start<=range.max-length+1; start++){
      const seq=[...Array(length)].map((_,i)=>start+i);
      const positionCombos=missingNumberPositionCombos(length,missingCount);

      positionCombos.forEach(combo=>{
        const missingPositions=combo;
        const answers=missingPositions.map(pos=>seq[pos]);
        const display=seq.map((n,i)=>missingPositions.includes(i)?"_":n);
        const pool=[];
        for(let n=range.min;n<=range.max;n++){
          if(!answers.includes(n)) pool.push(n);
        }
        const choiceCount=Math.min(6,Math.max(3,answers.length+2));
        const choices=shuffle([...answers,...shuffle(pool).slice(0,choiceCount-answers.length)]);

        questions.push({
          mode:"missingnum",
          title:"Missing Numbers",
          helper:"Drag the missing number",
          spoken:`Find the missing number. ${seq.map((n,i)=>missingPositions.includes(i)?"blank":String(n)).join(", ")}`,
          sequence:display,
          fullSequence:seq,
          answers,
          missingPositions,
          answer:answers[0],
          choices,
          rangeLabel:range.label,
          missingCount,
          key:`${state.game}-${l}-${range.min}-${range.max}-${start}-${length}-${missingPositions.join("-")}`
        });
      });
    }
  });

  return shuffle(questions);
}

function missingNumberPositionCombos(length,count){
  const all=[];
  const positions=[...Array(length)].map((_,i)=>i);

  function choose(start,combo){
    if(combo.length===count){
      all.push(combo.slice());
      return;
    }
    for(let i=start;i<positions.length;i++){
      combo.push(positions[i]);
      choose(i+1,combo);
      combo.pop();
    }
  }

  choose(0,[]);
  return shuffle(all).slice(0,24);
}

function renderMissingNumber(q){
  const blankText=q.missingCount>1?`${q.missingCount} missing numbers`:"1 missing number";

  playArea.innerHTML=`
    <div class="missingNumberGame">
      <div class="missingNumberPrompt">
        <div class="missingNumberTitle">Missing Numbers</div>
        <div class="missingNumberSmall">Drag each number into the right blank</div>
        <div class="numberRangeBadge">Level ${state.level} • ${q.rangeLabel} • ${blankText}</div>
        <div class="numberBlankHelp">Tap a number, then tap the blank — or drag and drop.</div>
      </div>

      <div class="numberSequenceCard">
        <div class="numberSequence">
          ${q.sequence.map((item,i)=>item==="_"?`<div class="numberDrop" data-pos="${i}" data-answer="${q.fullSequence[i]}">_</div>`:`<div class="numberSeqItem">${item}</div>`).join(`<div class="numberComma">,</div>`)}
        </div>
      </div>

      <div class="numberChoices">
        ${q.choices.map(n=>`<button class="numberChoice" type="button" data-number="${n}">${n}</button>`).join("")}
      </div>
    </div>
  `;

  setupMissingNumberDrag(q);
}

function setupMissingNumberDrag(q){
  state.missingNumberFilled={};
  state.selectedNumberChoice=null;

  const drops=[...document.querySelectorAll(".numberDrop")];
  const choices=[...document.querySelectorAll(".numberChoice")];

  choices.forEach(choice=>{
    choice.onclick=()=>{
      if(state.locked || choice.classList.contains("used")) return;
      choices.forEach(c=>c.classList.remove("selected"));
      choice.classList.add("selected");
      state.selectedNumberChoice=choice;
      speak(`Number ${choice.dataset.number}`);
    };
    choice.onpointerdown=e=>startNumberDrag(e,choice,drops);
  });

  drops.forEach(drop=>{
    drop.onclick=()=>{
      if(state.locked || drop.classList.contains("filled")) return;
      if(state.selectedNumberChoice){
        missingNumberAnswer(state.selectedNumberChoice.dataset.number,state.selectedNumberChoice,drop);
      }else{
        showFeedback("Pick a number",false);
        speak("Pick a number");
        bounce(drop);
      }
    };
  });
}

function startNumberDrag(e,choice,drops){
  if(state.locked || choice.classList.contains("used")) return;
  e.preventDefault();

  const number=choice.dataset.number;
  const ghost=document.createElement("div");
  ghost.className="numberGhost";
  ghost.textContent=number;
  document.body.appendChild(ghost);

  const moveGhost=(x,y)=>{
    ghost.style.left=x+"px";
    ghost.style.top=y+"px";
  };

  moveGhost(e.clientX,e.clientY);
  choice.setPointerCapture(e.pointerId);

  const onMove=ev=>{
    moveGhost(ev.clientX,ev.clientY);
    const over=getNumberDropAtPoint(ev.clientX,ev.clientY);
    drops.forEach(d=>d.classList.remove("ready"));
    if(over && !over.classList.contains("filled")) over.classList.add("ready");
  };

  const onUp=ev=>{
    choice.removeEventListener("pointermove",onMove);
    choice.removeEventListener("pointerup",onUp);
    choice.removeEventListener("pointercancel",onUp);

    const drop=getNumberDropAtPoint(ev.clientX,ev.clientY);
    ghost.remove();
    drops.forEach(d=>d.classList.remove("ready"));

    if(drop && !drop.classList.contains("filled")){
      missingNumberAnswer(number,choice,drop);
    }
  };

  choice.addEventListener("pointermove",onMove);
  choice.addEventListener("pointerup",onUp);
  choice.addEventListener("pointercancel",onUp);
}

function getNumberDropAtPoint(x,y){
  const drops=[...document.querySelectorAll(".numberDrop")];
  return drops.find(drop=>{
    const d=drop.getBoundingClientRect();
    return x>=d.left && x<=d.right && y>=d.top && y<=d.bottom;
  }) || null;
}

function missingNumberAnswer(number,choice,drop){
  if(state.locked || !drop) return;

  if(String(number)===String(drop.dataset.answer)){
    drop.textContent=number;
    drop.classList.add("filled");
    if(choice){
      choice.classList.add("used");
      choice.classList.remove("selected");
    }
    state.selectedNumberChoice=null;
    state.missingNumberFilled[drop.dataset.pos]=true;checkpoint();
    sparkleAt(drop);

    const allDrops=[...document.querySelectorAll(".numberDrop")];
    const allFilled=allDrops.every(d=>d.classList.contains("filled"));

    if(allFilled){
      state.locked=true;checkpoint();
      playArea.classList.add("locked");
      state.score++;
      state.stars++;
      update();
      celebrate();
      showFeedback("Great job",true);
      speak("Great job");
      setTimeout(next,2000);
    }else{
      showFeedback("Correct",true);
      speak("Correct");
      setTimeout(hideFeedback,700);
    }
  }else{
    showFeedback("Try again",false);
    speak("Try again");
    bounce(choice || drop);
  }
}


function endScreen(){try{localStorage.removeItem(SAVE_PREFIX+state.game);}catch(e){}refreshContinueButton();state.current=null;update();playArea.innerHTML=`<div class="end"><div class="endIcon">🏆</div><div class="endTitle">Great job!</div><div class="endScore">Completed Levels: ${state.startLevel} to ${state.level}</div><div class="endScore">Score: ${state.score} / ${state.totalAsked}</div><div class="endScore">Stars: ⭐ ${state.stars}</div><button class="again" id="again">Play Again</button></div>`;speak("Great job. You finished all levels.");$("again").onclick=()=>start(state.game)}
function mathQ(l){let e=pick(emojis),a,b,ans,title,visual,spoken,choices,key;if(l<=2){let max=l===1?5:10;ans=rand(1,max);title="How many?";visual=emojiLines(e,ans);spoken="How many pictures?";choices=numChoices(ans,1,max);key=`mc-${e}-${ans}-${max}`}else if(l===3){a=rand(1,5);b=rand(1,5);ans=a+b;title="Add them";visual=`<span class="emojiLine">${repeat(e,a)}</span><span class="equation">+</span><span class="emojiLine">${repeat(e,b)}</span>`;spoken=`What is ${a} plus ${b}?`;choices=numChoices(ans,2,10);key=`ma-${a}-${b}`}else{let add=Math.random()<.5;if(add){a=rand(2,l>4?25:12);b=rand(1,l>4?20:8);ans=a+b;title="Add";visual=`<div class="equation">${a} + ${b}</div>`;spoken=`What is ${a} plus ${b}?`;choices=numChoices(ans,2,60);key=`ma2-${a}-${b}`}else{a=rand(4,l>4?40:15);b=rand(1,Math.min(a-1,l>4?25:9));ans=a-b;title="Take away";visual=`<div class="equation">${a} − ${b}</div>`;spoken=`What is ${a} minus ${b}?`;choices=numChoices(ans,0,40);key=`ms-${a}-${b}`}}return{mode:"single",title,helper:"Tap the answer",visual,spoken,answer:ans,choices,key}}

function workbookQ(l){
  let rows=[],keys=[],n=l<=2?3:l<=4?4:5,used={};

  for(let i=0;i<n;i++){
    let r=null;

    for(let attempt=0;attempt<80;attempt++){
      r=workbookRow(l);
      if(!used[r.key]) break;
    }

    used[r.key]=true;
    rows.push(r);
    keys.push(r.key);
  }

  return{mode:"worksheet",title:l===1?"How many?":l===2?"Picture adding":l===3?"Add":l===4?"Add and take away":l===5?"Mixed practice":"Challenge workbook",helper:"Tap the side answer",spoken:"Tap the side answer.",rows,key:"workbook-"+keys.join("|")}
}
function workbookRow(l){let e=pick(emojis),type=l===1?"count":l===2?(Math.random()<.65?"picAdd":"count"):l===3?(Math.random()<.55?"picAdd":"numAdd"):l===4?(Math.random()<.5?"numAdd":"sub"):pick(["picAdd","numAdd","sub","mixed"]);let a,b,c,ans,html,label,eq=false,key;if(type==="count"){ans=rand(1,l===1?5:10);html=emojiLines(e,ans);label="How many?";key=`wc-${e}-${ans}`}else if(type==="picAdd"){a=rand(1,l<=3?5:8);b=rand(1,l<=3?5:8);ans=a+b;html=`${repeat(e,a)} <strong>+</strong> ${repeat(e,b)}`;label="How many in all?";key=`wp-${e}-${a}-${b}`}else if(type==="numAdd"){a=rand(1,l<=3?8:15);b=rand(1,l<=3?8:15);ans=a+b;html=`${a} + ${b}`;label="Add";eq=true;key=`wn-${a}-${b}`}else if(type==="sub"){a=rand(4,l<=4?15:25);b=rand(1,Math.min(a-1,l<=4?9:15));ans=a-b;html=`${a} − ${b}`;label="Take away";eq=true;key=`ws-${a}-${b}`}else{a=rand(2,10);b=rand(1,8);c=rand(1,6);ans=a+b-c;if(ans<0)ans=a+b;html=`${a} + ${b} − ${c}`;label="Mixed";eq=true;key=`wm-${a}-${b}-${c}`}return{label,html,answer:ans,choices:numChoices(ans,0,30),key,eq}}
function englishQ(l){let pool=words[Math.min(l,10)],answer=pick(pool),all=Object.values(words).flat();let choices=shuffle(unique([answer,...shuffle(all.filter(w=>w!==answer)).slice(0,3)])).slice(0,4);while(choices.length<4){let w=pick(all);if(!choices.includes(w))choices.push(w)}return{mode:"single",title:"Find the word",helper:"Listen and tap",visual:`<div class="equation">${answer.toUpperCase()}</div>`,spoken:"Find the word "+answer,answer,choices,word:true,key:`english-${l}-${answer}`}}

function levelNumberRange(l){
  if(l===1) return {min:1,max:20,label:"1 to 20"};
  if(l===2) return {min:10,max:30,label:"10 to 30"};
  if(l===3) return {min:20,max:40,label:"20 to 40"};
  if(l===4) return {min:30,max:50,label:"30 to 50"};
  if(l===5) return {min:40,max:60,label:"40 to 60"};
  if(l===6) return {min:50,max:70,label:"50 to 70"};
  if(l===7) return {min:60,max:80,label:"60 to 80"};
  if(l===8) return {min:70,max:90,label:"70 to 90"};
  if(l===9) return {min:80,max:100,label:"80 to 100"};
  return {min:1,max:100,label:"1 to 100"};
}
function nextFromPool(poolName,l,builder){
  if(!state[poolName]) state[poolName]={};
  if(!state[poolName][l] || !state[poolName][l].length){
    state[poolName][l]=builder(l).filter(q=>!state.usedLevelKeys[q.key]);
  }
  while(state[poolName][l].length){
    const q=state[poolName][l].shift();
    if(!state.usedLevelKeys[q.key]) return q;
  }
  const refill=builder(l).filter(q=>!state.usedLevelKeys[q.key]);
  state[poolName][l]=refill;
  return refill.length?state[poolName][l].shift():builder(l)[0];
}
function countPictureHTML(count,emoji){
  if(count<=20)return repeat(emoji,count);
  const tens=Math.floor(count/10),ones=count%10;
  return `<span class="tenBlocks">${repeat(`<span class="tenBlock">10 ${emoji}</span>`,tens)}${ones?`<span class="onesBlock">${repeat(emoji,ones)}</span>`:""}</span>`;
}
function pictureQ(l){return nextFromPool("picturePools",l,buildPicturePool)}
function buildPicturePool(l){
  const pool=[];
  const rowCount=l<=2?3:l<=4?4:5;
  for(let i=0;i<260;i++){
    const rows=[];
    const used={};
    for(let r=0;r<rowCount;r++){
      let row=null;
      for(let attempt=0;attempt<120;attempt++){
        const e=emojis[(i+r+attempt+rand(0,emojis.length-1))%emojis.length];
        let ans,html,label,key;
        if(l===1){
          ans=rand(1,20); html=countPictureHTML(ans,e); label="How many?"; key=`pc-${e}-${ans}`;
          row={label,html,answer:ans,choices:numChoices(ans,1,20),key};
        }else if(l===2){
          ans=rand(10,30); html=countPictureHTML(ans,e); label="How many?"; key=`pc-${e}-${ans}`;
          row={label,html,answer:ans,choices:numChoices(ans,1,30),key};
        }else{
          const range=levelNumberRange(l);
          const target=rand(range.min,range.max);
          const a=rand(1,target-1);
          const b=target-a;
          ans=target;
          html=`${countPictureHTML(a,e)} <strong>+</strong> ${countPictureHTML(b,e)}`;
          label="How many in all?"; key=`pa-${e}-${a}-${b}`;
          row={label,html,answer:ans,choices:numChoices(ans,Math.max(1,ans-10),Math.min(100,ans+10)),key};
        }
        if(!used[row.key]) break;
      }
      used[row.key]=true;
      rows.push(row);
    }
    pool.push({mode:"worksheet",title:"Picture Quiz",helper:"Tap the circles",spoken:l<=2?"Count each row and tap the number.":"Add each row and tap the number.",rows,key:`picture-${l}-${rows.map(x=>x.key).join("|")}`});
  }
  const uniqueMap={}; pool.forEach(q=>uniqueMap[q.key]=q); return shuffle(Object.values(uniqueMap));
}
function matchNumberQ(l){return nextFromPool("matchNumberPools",l,buildMatchNumberPool)}
function buildMatchNumberPool(l){
  const pool=[];
  const range=levelNumberRange(l);
  const picEmojis=["🍎","🍌","🍓","🍇","🍊","🍉","🍐","🍒","🧁","🍭","⚽","🚗","🚌","⭐","🌼","🧸","🐟","🐶","🎈","🚀","🍪","🛶","🦋","🐸","🚲","🍄","🌽","🍋","❤️","🦁"];
  const rowCount=l<=2?4:l<=5?5:6;
  const maxCount=l<=2?20:30;
  for(let i=0;i<300;i++){
    let values=[];
    const low=range.min;
    const high=range.max;
    while(values.length<rowCount){const n=rand(low,high); if(!values.includes(n)) values.push(n)}
    values=shuffle(values);
    const chosenEmojis=shuffle(picEmojis).slice(0,rowCount);
    const rows=values.map((count,idx)=>({count,emoji:chosenEmojis[idx],html:(count<=20?repeat(chosenEmojis[idx],count):`<span class="tenBlocks">${repeat(`<span class="tenBlock">10 ${chosenEmojis[idx]}</span>`,Math.floor(count/10))}${count%10?`<span class="onesBlock">${repeat(chosenEmojis[idx],count%10)}</span>`:""}</span>`),key:`matchrow-${count}-${chosenEmojis[idx]}`}));
    const numbers=shuffle(values).map((n,idx)=>({number:n,color:"c"+((idx%5)+1)}));
    pool.push({mode:"matchnum",title:"Count and match",helper:"Draw lines",spoken:"Count and match with the number.",rows,numbers,key:`matchnum-${l}-${values.join("-")}-${chosenEmojis.join("")}-${numbers.map(n=>n.number).join("-")}`});
  }
  const uniqueMap={}; pool.forEach(q=>uniqueMap[q.key]=q); return shuffle(Object.values(uniqueMap));
}
function matchAlphabetQ(l){return nextFromPool("matchAlphaPools",l,buildMatchAlphabetPool)}
function buildMatchAlphabetPool(l){
  const bank=[
    {letter:"A",name:"Apple",emoji:"🍎"},{letter:"B",name:"Ball",emoji:"⚽"},{letter:"C",name:"Cat",emoji:"🐱"},{letter:"D",name:"Dog",emoji:"🐶"},{letter:"E",name:"Elephant",emoji:"🐘"},{letter:"F",name:"Fish",emoji:"🐟"},{letter:"G",name:"Goat",emoji:"🐐"},{letter:"H",name:"House",emoji:"🏠"},{letter:"I",name:"Ice Cream",emoji:"🍦"},{letter:"J",name:"Juice",emoji:"🧃"},{letter:"K",name:"Kite",emoji:"🪁"},{letter:"L",name:"Lion",emoji:"🦁"},{letter:"M",name:"Monkey",emoji:"🐵"},{letter:"N",name:"Nest",emoji:"🪺"},{letter:"O",name:"Orange",emoji:"🍊"},{letter:"P",name:"Parrot",emoji:"🦜"},{letter:"Q",name:"Queen",emoji:"👑"},{letter:"R",name:"Rocket",emoji:"🚀"},{letter:"S",name:"Star",emoji:"⭐"},{letter:"T",name:"Tiger",emoji:"🐯"},{letter:"U",name:"Umbrella",emoji:"☂️"},{letter:"V",name:"Van",emoji:"🚐"},{letter:"W",name:"Watermelon",emoji:"🍉"},{letter:"X",name:"Xylophone",emoji:"🎼"},{letter:"Y",name:"Yarn",emoji:"🧶"},{letter:"Z",name:"Zebra",emoji:"🦓"}
  ];
  const rowCount=l<=2?5:l<=6?6:7;
  const maxLetters=l===1?10:l===2?12:l===3?14:l===4?16:l===5?18:l===6?20:l===7?22:26;
  const levelBank=bank.slice(0,maxLetters);
  const pool=[];
  for(let i=0;i<320;i++){
    const chosen=shuffle(levelBank).slice(0,rowCount);
    const letters=chosen.map(item=>({letter:item.letter,key:`alpha-left-${item.letter}-${item.name}`}));
    const pictures=shuffle(chosen).map(item=>({letter:item.letter,name:item.name,emoji:item.emoji,key:`alpha-right-${item.letter}-${item.name}`}));
    pool.push({mode:"matchalpha",title:"Match alphabets",helper:"Draw line to picture",spoken:"Match the alphabet with the picture.",letters,pictures,key:`matchalpha-${l}-${rowCount}-${chosen.map(x=>x.letter).join("")}-${pictures.map(x=>x.letter).join("")}`});
  }
  const uniqueMap={}; pool.forEach(q=>uniqueMap[q.key]=q); return shuffle(Object.values(uniqueMap));
}

function findQ(l){
  let [name,emoji]=pick(findTargets[l]||findTargets[6]);
  let cfg=findCfg(l);
  let pos=findPositions(cfg.count,cfg.margin);
  let targetIndex=rand(0,pos.length-1);

  // Single-target rule:
  // The target picture appears only ONE time.
  // Example: if the question is "Find the car", only one car icon appears.
  // All other icons are allowed to repeat so the child must focus.
  let safeDistractors=distractors.filter(e=>e!==emoji);

  // Use a smaller repeated distractor pool for a workbook-style search.
  // This makes other icons repeat many times but keeps the target unique.
  let poolSize=l<=2?6:l<=4?8:10;
  let repeatPool=shuffle(safeDistractors).slice(0, Math.min(safeDistractors.length, poolSize));

  let items=pos.map((p,i)=>{
    if(i===targetIndex){
      return{x:p.x,y:p.y,emoji:emoji,target:true};
    }

    return{
      x:p.x,
      y:p.y,
      emoji:pick(repeatPool),
      target:false
    };
  });

  // Extra safety: never allow the target emoji in non-target positions.
  items=items.map((item,i)=>{
    if(i!==targetIndex && item.emoji===emoji){
      return{...item,emoji:pick(safeDistractors)};
    }
    return item;
  });

  return{mode:"find",name,emoji,items,level:l,spoken:`Find the ${name}. Draw a circle around it.`,key:`find-${l}-${name}`}
}


function findOddNumberQ(l){
  const cfg=oddNumberCfg(l);

  let base=String(rand(cfg.min,cfg.max));
  let odd=String(rand(cfg.min,cfg.max));

  // Make sure odd number is different.
  let guard=0;
  while(odd===base && guard<80){
    odd=String(rand(cfg.min,cfg.max));
    guard++;
  }

  // For harder levels, sometimes use look-alike numbers.
  if(l>=4 && Math.random()<0.65){
    const pairs=[
      ["6","9"],["8","3"],["5","2"],["1","7"],["12","21"],["15","10"],
      ["34","43"],["24","42"],["69","96"],["18","81"],["25","52"],
      ["39","93"],["45","54"],["56","65"],["78","87"]
    ].filter(p=>Number(p[0])>=cfg.min && Number(p[0])<=cfg.max && Number(p[1])>=cfg.min && Number(p[1])<=cfg.max);
    if(pairs.length){
      const pair=pick(pairs);
      base=pair[0];
      odd=pair[1];
    }
  }

  const pos=findPositions(cfg.count,cfg.margin);
  const targetIndex=rand(0,pos.length-1);

  let items=pos.map((p,i)=>({
    x:p.x,
    y:p.y,
    emoji:i===targetIndex?odd:base,
    target:i===targetIndex
  }));

  return{
    mode:"find",
    name:"odd number",
    emoji:odd,
    items,
    level:l,
    oddGame:true,
    spoken:`Find the odd number. Find ${odd}.`,
    key:`findodd-${l}-${base}-${odd}`
  }
}

function oddNumberCfg(l){
  if(l===1) return{min:0,max:9,count:35,margin:7};
  if(l===2) return{min:0,max:9,count:45,margin:6};
  if(l===3) return{min:0,max:15,count:55,margin:6};
  if(l===4) return{min:0,max:20,count:65,margin:5};
  if(l===5) return{min:10,max:50,count:75,margin:5};
  if(l===6) return{min:10,max:99,count:85,margin:4};
  if(l===7) return{min:10,max:120,count:95,margin:4};
  if(l===8) return{min:20,max:150,count:105,margin:4};
  if(l===9) return{min:20,max:200,count:115,margin:3};
  return{min:20,max:300,count:125,margin:3};
}

function oddNumberItemSize(l){
  if(l===1) return 32;
  if(l===2) return 30;
  if(l===3) return 28;
  if(l===4) return 25;
  if(l===5) return 24;
  if(l===6) return 22;
  if(l===7) return 21;
  if(l===8) return 20;
  if(l===9) return 19;
  return 18;
}

function findNumberQ(l){
  let maxNumber=l===1?5:l===2?9:l===3?10:l===4?15:l===5?20:l===6?30:l===7?40:l===8?50:l===9?75:99;
  let target=String(rand(0,maxNumber));
  let cfg=findNumberCfg(l);
  let pos=findPositions(cfg.count,cfg.margin);
  let targetIndex=rand(0,pos.length-1);

  // Single-target rule:
  // The target number appears only ONE time.
  // Other numbers repeat many times, like a kids workbook page.
  let allNumbers=[];
  for(let i=0;i<=maxNumber;i++){
    if(String(i)!==target) allNumbers.push(String(i));
  }

  let poolSize=l<=2?3:l<=4?4:5;
  let repeatPool=shuffle(allNumbers).slice(0,Math.min(allNumbers.length,poolSize));
  const colors=["pink","blue","yellow","green"];

  let items=pos.map((p,i)=>{
    if(i===targetIndex){
      return{x:p.x,y:p.y,emoji:target,target:true,color:pick(colors)};
    }
    return{x:p.x,y:p.y,emoji:pick(repeatPool),target:false,color:pick(colors)};
  });

  // Extra safety: no non-target can show the target number.
  items=items.map((item,i)=>{
    if(i!==targetIndex && String(item.emoji)===target){
      return{...item,emoji:pick(allNumbers)};
    }
    return item;
  });

  return{mode:"find",name:target,emoji:target,items,level:l,numberGame:true,spoken:`Find the number ${target}. Draw a circle around it.`,key:`findnum-${l}-${target}`}
}

function findNumberCfg(l){
  if(l===1) return{count:16,margin:13};
  if(l===2) return{count:20,margin:11};
  if(l===3) return{count:25,margin:10};
  if(l===4) return{count:30,margin:9};
  if(l===5) return{count:36,margin:8};
  return{count:42,margin:7};
}

function numberItemSize(l){return l===1?54:l===2?50:l===3?46:l===4?42:l===5?38:36}

function findCfg(l){return l===1?{count:20,margin:10}:l===2?{count:25,margin:9}:l===3?{count:30,margin:8}:l===4?{count:40,margin:7}:l===5?{count:45,margin:7}:l===6?{count:50,margin:6}:l===7?{count:55,margin:6}:l===8?{count:60,margin:6}:l===9?{count:65,margin:5}:{count:70,margin:5}}
function itemSize(l){return l===1?44:l===2?40:l===3?36:l===4?32:l===5?30:28}
function findPositions(count,margin){let cols=Math.ceil(Math.sqrt(count*1.25)),rows=Math.ceil(count/cols),pos=[];for(let r=0;r<rows;r++)for(let c=0;c<cols&&pos.length<count;c++){let xs=(100-margin*2)/Math.max(1,cols-1),ys=(100-margin*2)/Math.max(1,rows-1);pos.push({x:clamp(margin+c*xs+rand(-4,4),margin,100-margin),y:clamp(margin+r*ys+rand(-4,4),margin,100-margin)})}return shuffle(pos)}
function numChoices(ans,min,max){let vals=[+ans],lo=Math.max(min,ans-8),hi=Math.min(max,ans+8);for(let i=0;vals.length<4&&i<80;i++){let v=rand(lo,hi);if(!vals.includes(v))vals.push(v)}for(let n=min;vals.length<4&&n<=max;n++)if(!vals.includes(n))vals.push(n);return shuffle(vals).slice(0,4)}
function emojiLines(e,n){let per=n>10?8:n>6?5:6,out="";for(let i=0;i<n;i+=per)out+=`<span class="emojiLine">${repeat(e,Math.min(per,n-i))}</span>`;return out}
function repeat(e,n){return Array.from({length:n},()=>e).join(" ")}
function showFeedback(text,good){feedback.textContent=good?"🎉 "+text+"!":"🙂 "+text;feedback.className="feedback show "+(good?"good":"try");if(!good)setTimeout(hideFeedback,900)}
function hideFeedback(){feedback.className="feedback";feedback.textContent=""}
function bounce(el){if(!el)return;el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake");setTimeout(()=>el.classList.remove("shake"),320)}
function celebrate(){for(let i=0;i<10;i++)setTimeout(sparkleRandom,i*70)}
function sparkleAt(btn){let r=btn.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2)}
function sparkleRandom(){sparkle(rand(24,innerWidth-24),rand(130,innerHeight-80))}
function sparkle(x,y){let s=document.createElement("div");s.className="sparkle";s.textContent=pick(["⭐","🌟","✨","🎉"]);s.style.left=x+"px";s.style.top=y+"px";document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}
function speak(text){if(!("speechSynthesis" in window))return;stopSpeech();let u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.82;u.pitch=1.18;let v=speechSynthesis.getVoices().find(v=>/female|samantha|karen|zira|google us english|english/i.test(v.name+" "+v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
function stopSpeech(){if("speechSynthesis" in window)speechSynthesis.cancel()}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[rand(0,a.length-1)]}
function shuffle(a){let c=[...a];for(let i=c.length-1;i>0;i--){let j=rand(0,i);[c[i],c[j]]=[c[j],c[i]]}return c}
function unique(a){return[...new Set(a)]}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
addEventListener("beforeunload",stopSpeech);
if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices();


const contactPage=$("contactPage");
const contactBtn=$("contactBtn");
const contactBackBtn=$("contactBackBtn");
const contactSoundBtn=$("contactSoundBtn");

if(contactBtn){
  contactBtn.onclick=()=>{
    stopSpeech();
    hideFeedback();
    homePage.classList.remove("active");
    playPage.classList.remove("active");
    if(contactPage)contactPage.classList.add("active");
    setTimeout(()=>speak("Contact us"),120);
  };
}

if(contactBackBtn){
  contactBackBtn.onclick=()=>{
    stopSpeech();
    hideFeedback();
    if(contactPage)contactPage.classList.remove("active");
    playPage.classList.remove("active");
    homePage.classList.add("active");
  };
}

if(contactSoundBtn){
  contactSoundBtn.onclick=()=>speak("Contact us. Send us a message.");
}

refreshContinueButton();
