/* Original Kindergarten–Grade 6 skill questions. No third-party worksheets. */
window.LL_QUESTIONS=(()=>{
 const things=['🍎','🍌','🐶','🐱','🌟','🦋','🚗','🍓','🐟','🧸'];
 const lex=[['cat','🐱'],['dog','🐶'],['fish','🐟'],['sun','☀️'],['moon','🌙'],['tree','🌳'],['ball','⚽'],['car','🚗'],['apple','🍎'],['book','📘'],['frog','🐸'],['train','🚂'],['bird','🐦'],['cake','🍰'],['house','🏠'],['flower','🌼'],['clock','🕒'],['banana','🍌'],['tiger','🐯'],['rabbit','🐰'],['chair','🪑'],['school','🏫'],['pencil','✏️'],['orange','🍊']];
 const opposites=[['hot','cold'],['big','small'],['happy','sad'],['fast','slow'],['day','night'],['open','closed'],['young','old'],['heavy','light'],['loud','quiet'],['early','late']];
 const reading=[['Ben visited the library. He borrowed a book about stars.','Where did Ben go?','the library',['the beach','the zoo','the park']],['Mia planted a seed and watered it. Soon a green leaf appeared.','What did Mia plant?','a seed',['a shoe','a pencil','a rock']],['A bird gathered twigs to make a nest.','What did the bird make?','a nest',['a cake','a boat','a kite']],['Ravi carried an umbrella because the clouds were dark.','Why did Ravi take an umbrella?','It might rain',['He wanted to swim','It was very sunny','He was hungry']],['Grandpa baked bread with Nina. They mixed flour and water.','What did they bake?','bread',['pizza','soup','rice']]];
 const money=[1,2,5,10,20,50],shape=[['Circle','🔴'],['Triangle','🔺'],['Square','🟦'],['Diamond','🔷'],['Star','⭐']];
 const hash=s=>{let h=2166136261;for(const c of s){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0};
 const rng=n=>{let x=n||42;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}};
 const rand=(r,a,b)=>a+Math.floor(r()*(b-a+1));
 const pick=(r,a)=>a[rand(r,0,a.length-1)];
 function choices(answer,wrong,r){
  const correct=String(answer),unique=new Set((wrong||[]).map(String).filter(s=>s!==correct));
  if(!Number.isNaN(Number(correct))){
    const n=Number(correct);
    for(let d=1;unique.size<7&&d<40;d++){
      if(String(n+d)!==correct)unique.add(String(Number((n+d).toFixed(3))));
      if(String(n-d)!==correct)unique.add(String(Number((n-d).toFixed(3))));
    }
  }
  for(const text of ['yes','no','maybe','none','first','last','more','less'])if(unique.size<7&&text!==correct)unique.add(text);
  const opts=Array.from(unique).filter(s=>s!==correct);
  for(let i=opts.length-1;i>0;i--){const j=rand(r,0,i);[opts[i],opts[j]]=[opts[j],opts[i]]}
  const arr=[correct,...opts.slice(0,3)];
  for(let i=arr.length-1;i>0;i--){const j=rand(r,0,i);[arr[i],arr[j]]=[arr[j],arr[i]]}
  return arr;
 }
 const numOpts=n=>[n+1,n-1,n+2,n-2,n+3,n-3,n+5];
 const dots=(n,em)=>Array(Math.min(20,n)).fill(em).join(' ');
 function math(t,l,r){
  const g=t.grade,kind=t.kind;
  const cap=g===0?Math.min(20,4+l*2):g===1?Math.min(100,10+l*10):g===2?Math.min(1000,100+l*90):Math.min(99999,100*g*l+500);
  const n=rand(r,1,cap),a=rand(r,1,Math.max(2,Math.floor(cap/2))),b=rand(r,1,Math.max(2,Math.min(cap-a,50)));
  let question='',visual='',answer='',wrong=[],hint='',type='choice';
  switch(kind){
   case 'count':case 'number':{let v=kind==='count'?rand(r,1,Math.min(20,cap)):rand(r,1,cap);answer=v;question=kind==='count'?'Count the pictures':'Find the number '+v;visual=kind==='count'?dots(v,pick(r,things)):'🔢 '+v;wrong=numOpts(v);hint='Count one at a time.';if(kind==='number'&&r()<.5){question='Which number comes after '+v+'?';visual='🔢 '+v+' → __';answer=v+1;wrong=numOpts(answer)}break}
   case 'pattern':case 'missing':{let step=kind==='missing'?1:pick(r,g===0?[1,2]:[1,2,3,5,10]),start=rand(r,1,Math.max(2,cap-4*step)),slot=rand(r,1,3);let seq=Array.from({length:5},(_,i)=>start+i*step);answer=seq[slot];seq[slot]='__';question='Fill the missing number';visual=seq.join('  →  ');wrong=numOpts(answer);hint='Look at the gap between numbers.';type='drop';break}
   case 'compare':case 'sort':{let x=n,y=n+rand(r,1,Math.max(2,cap/5|0));question=kind==='sort'?'Which group has more?':'Which number is bigger?';visual=kind==='sort'?dots(Math.min(x,10),'🍎')+'  OR  '+dots(Math.min(y,10),'🍌'):x+'   ⚖️   '+y;answer=kind==='sort'?'Right group':y;wrong=kind==='sort'?['Left group','Same','Neither']:numOpts(y);hint='Look for the larger amount.';break}
   case 'odd':{answer=n%2?'Odd':'Even';question='Is '+n+' odd or even?';visual='🎯 '+n+' '+dots(Math.min(n,10),pick(r,['🔵','🟡','🍎','⭐']));wrong=['Odd','Even','Both','Neither'];hint='Even numbers make equal pairs.';break}
   case 'add':case 'subtract':case 'word':case 'missingadd':{let sub=kind==='subtract'||kind==='word'&&r()<.5,whole=a+b;question=kind==='missingadd'?'Find the missing addend':kind==='word'?'Solve the story':sub?'Subtract':'Add';visual=kind==='word'?'🍎 Sam has '+(sub?whole:a)+' apples and '+(sub?'gives away ':'gets ')+b+(sub?'. How many are left?':'. How many now?'):kind==='missingadd'?a+' + __ = '+whole:sub?whole+' − '+b:a+' + '+b;answer=kind==='missingadd'?b:sub?a:whole;wrong=numOpts(answer);hint=sub?'Take away the second number.':'Count on or add the parts.';type=kind==='missingadd'?'drop':'choice';break}
   case 'multiply':case 'divide':{let x=rand(r,2,Math.min(12,l+3)),y=rand(r,2,g<3?5:Math.min(12,l+3));question=kind==='multiply'?'How many altogether?':'Share equally';visual=kind==='multiply'?x+' groups of '+y+'  ✖️':(x*y)+' ÷ '+x;answer=kind==='multiply'?x*y:y;wrong=numOpts(answer);hint=kind==='multiply'?'Add equal groups.':'Divide into equal parts.';break}
   case 'place':{let digits=Math.min(5,Math.max(2,g+2)),v=rand(r,10**(digits-1),10**digits-1),pos=rand(r,0,digits-1),value=Math.floor(v/10**pos)%10;question='What is the value of the [digit]?';visual=String(v).split('').map((c,i)=>i===digits-1-pos?'['+c+']':c).join(' ');answer=value*10**pos;wrong=[value,value*10,answer+10**pos,answer+1,10**pos];hint='Think about ones, tens, hundreds and thousands.';break}
   case 'round':{let step=g<=2?10:100,x=rand(r,10,Math.max(100,cap));question='Round to the nearest '+step;visual='🎯 '+x;answer=Math.round(x/step)*step;wrong=[answer-step,answer+step,Math.floor(x/step)*step,Math.ceil(x/step)*step];hint='Which multiple is closer?';break}
   case 'fraction':case 'fractionadd':{let den=pick(r,g<=1?[2,3,4]:[2,3,4,5,6,8,10]),x=rand(r,1,den-1),y=rand(r,1,den-x);question=kind==='fraction'?'What fraction is colored?':'Add the fractions';visual=kind==='fraction'?'🟩'.repeat(x)+'⬜'.repeat(den-x):x+'/'+den+' + '+y+'/'+den;answer=(kind==='fraction'?x:x+y)+'/'+den;wrong=[(x+1)+'/'+den,(x+y+1)+'/'+den,x+'/'+(den+1),den+'/'+x];hint='Count the colored parts and all the parts.';break}
   case 'decimal':{let p=g<4?10:100,x=rand(r,1,80),y=rand(r,1,40);question='Add the decimals';visual=(x/p).toFixed(p===10?1:2)+' + '+(y/p).toFixed(p===10?1:2);answer=((x+y)/p).toFixed(p===10?1:2);wrong=[((x+y+1)/p).toFixed(p===10?1:2),((x+y-1)/p).toFixed(p===10?1:2),((x+y+10)/p).toFixed(p===10?1:2)];hint='Line up the decimal places.';break}
   case 'time':{let h=rand(r,1,12),m=pick(r,g===0?[0,30]:[0,15,30,45]),fmt=(hour,min)=>hour+':'+String(min).padStart(2,'0');question='What time is shown?';visual='🕒 '+fmt(h,m);answer=fmt(h,m);wrong=[fmt(h,(m+15)%60),fmt((h%12)+1,m),fmt(h,(m+30)%60)];hint='Read the hour first.';break}
   case 'money':{let x=pick(r,money),y=pick(r,money);question='Count the cents';visual='🪙 '+x+'¢ + 🪙 '+y+'¢';answer=x+y;wrong=numOpts(answer);hint='Add the coin values.';break}
   case 'measure':case 'convert':{let x=rand(r,1,15),factor=kind==='convert'?pick(r,[10,100,1000]):100;question=factor===1000?'How many metres?':'How many centimetres?';visual='📏 '+x+' '+(factor===100?'metres':factor===1000?'kilometres':'decimetres');answer=x*factor;wrong=[x*10,x*100,answer+factor,answer-factor];hint='Multiply by the unit conversion.';break}
   case 'shape':{let [name,picture]=pick(r,shape),amount=rand(r,1,10);question='Name the shape';visual=Array(amount).fill(picture).join(' ');answer=name;wrong=shape.map(x=>x[0]).filter(x=>x!==name);hint='Think about sides and corners.';break}
   case 'graph':{let values=[2,5,8,11].map(x=>x+rand(r,0,1)),shift=rand(r,0,3),labels=['Apples','Stars','Cars','Dogs'];let rows=labels.map((label,i)=>[label,values[(i+shift)%4]]);question='Which has the most?';visual=rows.map(x=>x[0]+': '+'🟦'.repeat(x[1])).join('\n');answer=rows.reduce((best,row)=>row[1]>best[1]?row:best)[0];wrong=labels.filter(x=>x!==answer);hint='Compare the bar lengths.';break}
   case 'perimeter':case 'area':case 'volume':{let x=rand(r,2,l+5),y=rand(r,2,l+4),z=rand(r,2,7);question=kind==='perimeter'?'Find the rectangle perimeter':kind==='area'?'Find the area':'Find the box volume';visual=kind==='volume'?'📦 '+x+' × '+y+' × '+z:'▭ '+x+' by '+y;answer=kind==='perimeter'?2*(x+y):kind==='area'?x*y:x*y*z;wrong=numOpts(answer);hint=kind==='perimeter'?'Add the four sides.':'Multiply the dimensions.';break}
   case 'angle':{let deg=pick(r,[30,45,60,90,120,135,180]);question='Which type of angle?';visual='📐 '+deg+'°';answer=deg<90?'Acute':deg===90?'Right':deg<180?'Obtuse':'Straight';wrong=['Acute','Right','Obtuse','Straight'];hint='A right angle is 90 degrees.';break}
   case 'factors':{let x=rand(r,2,12),y=rand(r,2,12),v=x*y;question='Which number is a factor of '+v+'?';visual='🧩 '+v;answer=x;wrong=[v+1,v+2,v+3,v+5,v+7].filter(k=>v%k!==0);hint='A factor divides without a remainder.';break}
   case 'order':{let x=rand(r,1,9),y=rand(r,2,9),z=rand(r,2,9);question='Use order of operations';visual=x+' + '+y+' × '+z;answer=x+y*z;wrong=[(x+y)*z,x+y+z,x*y+z];hint='Multiply before adding.';break}
   case 'integer':{let x=rand(r,-20,20),y=rand(r,-12,12);question='Calculate with integers';visual=x+' + ('+y+')';answer=x+y;wrong=numOpts(answer);hint='Move left for negative and right for positive.';break}
   case 'exponent':{let x=rand(r,2,5),y=rand(r,2,4);question='Find the power';visual=x+' ^ '+y;answer=x**y;wrong=[x*y,x**(y-1),answer+x];hint='Multiply the base by itself.';break}
   case 'algebra':{let x=rand(r,1,20+l),y=rand(r,1,20+l);question='Solve for x';visual='x + '+y+' = '+(x+y);answer=x;wrong=numOpts(answer);hint='Subtract '+y+' from both sides.';break}
   case 'percent':{let percent=pick(r,[10,20,25,50,75]),whole=pick(r,[20,40,80,100,200]);question='Find the percentage';visual=percent+'% of '+whole;answer=percent*whole/100;wrong=numOpts(answer);hint='Percent means out of 100.';break}
   case 'ratio':{let x=rand(r,1,9),y=rand(r,1,9);question='Ratio of red to blue?';visual='🔴'.repeat(x)+'  '+'🔵'.repeat(y);answer=x+':'+y;wrong=[y+':'+x,x+':'+(y+1),(x+1)+':'+y];hint='Count red first and blue second.';break}
   case 'proportion':{let x=rand(r,2,9),y=rand(r,2,9),k=rand(r,2,6);question='Find the missing number';visual=x+' : '+y+' = '+(x*k)+' : __';answer=y*k;wrong=numOpts(answer);hint='Multiply both parts by the same value.';type='drop';break}
   default: {question='Add the numbers';visual=a+' + '+b;answer=a+b;wrong=numOpts(answer);hint='Count on.'}
  }
  return {prompt:question,visual,answer:String(answer),options:choices(answer,wrong,r),hint,format:type,spoken:question};
 }
 function english(t,l,r){
  const kind=t.kind,[w,emoji]=pick(r,lex),other=lex.filter(x=>x[0]!==w);
  let question='',visual='',answer='',wrong=[],hint='',type='choice';
  switch(kind){
   case 'letters':case 'missingletter':{let i=rand(r,1,24),letter=String.fromCharCode(65+i);question=kind==='letters'?'Match the small letter':'Which letter is missing?';visual=kind==='letters'?letter:String.fromCharCode(64+i)+'   __   '+String.fromCharCode(66+i);answer=kind==='letters'?letter.toLowerCase():letter;wrong='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(x=>kind==='letters'?x.toLowerCase():x).filter(x=>x!==answer);hint='Say the alphabet in order.';type=kind==='missingletter'?'drop':'choice';break}
   case 'phonics':{question='Which word starts with this letter?';visual='🔊 '+w[0].toUpperCase();answer=w;wrong=other.filter(x=>x[0][0]!==w[0]).map(x=>x[0]);hint='Say the first sound.';break}
   case 'spelling':{let i=rand(r,0,w.length-1);question='Find the missing letter';visual=emoji+'  '+w.split('').map((c,j)=>i===j?'_':c).join(' ').toUpperCase();answer=w[i].toUpperCase();wrong='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(x=>x!==answer);hint='Say the word slowly.';type='drop';break}
   case 'vocabulary':{question='Which word matches the picture?';visual=emoji;answer=w;wrong=other.map(x=>x[0]);hint='Look closely at the picture.';break}
   case 'rhyme':{let set=pick(r,[['cat','hat'],['ball','tall'],['sun','fun'],['cake','lake'],['light','night'],['green','seen'],['tree','bee'],['bear','chair'],['fish','dish'],['star','car'],['book','look'],['house','mouse'],['run','sun'],['boat','coat']]);question='Which word rhymes with '+set[0]+'?';visual='🎵 '+set[0];answer=set[1];wrong=other.map(x=>x[0]);hint='Listen for the same ending sound.';break}
   case 'grammar':{question='Which is a noun?';visual='💬 A noun names a person, place, or thing.';answer=w;wrong=['slowly','quickly','happy','jumping','very','under'];hint='Look for a word naming a thing.';break}
   case 'sentence':{let who=pick(r,['The dog','My friend','The cat','A bird','Our teacher']),verb=pick(r,['runs','plays','jumps','reads','smiles']);question='Choose the correct sentence';visual='✏️';answer=who+' '+verb+'.';wrong=[who.toLowerCase()+' '+verb+'.',who+' '+verb,who+' '+verb+'?'];hint='Start with a capital and end with a full stop.';break}
   case 'reading':{let [passage,q,correct,wrongSet]=pick(r,reading);const who=pick(r,['Mia','Leo','Nina','Aria','Sam','Ava','Oliver','Ruby','Finn','Max']);const what=pick(r,['a kite','a book','a sandwich','a pencil','a flower','a ball','a jacket','a toy']);const place=pick(r,['the garden','the library','the classroom','the park','the kitchen','the playground']);if(r()<.85){passage=who+' brought '+what+' to '+place+'. '+who+' was excited to share it.';if(r()<.5){q='Who brought the item?';correct=who;wrongSet=['Mom','Dad','The teacher','A friend','A dog']}else{q='Where did '+who+' go?';correct=place;wrongSet=['the beach','the hospital','the farm','the pool','the market']}}question=q;visual='📚 '+passage;answer=correct;wrong=wrongSet;hint='Read the story again.';break}
   case 'synonym':{let [first,second]=pick(r,opposites);question='Choose the opposite of '+first;visual='🔄 '+first;answer=second;wrong=opposites.filter(x=>x[1]!==second).map(x=>x[1]);hint='Find a word with the opposite meaning.';break}
   case 'prefix':{let [prefix,base,built]=pick(r,[['un','happy','unhappy'],['re','play','replay'],['dis','like','dislike'],['pre','view','preview'],['mis','place','misplace'],['un','kind','unkind']]);question='Build the word';visual=prefix+' + '+base;answer=built;wrong=[base,prefix+prefix+base,base+prefix];hint='Add the prefix before the root word.';break}
   default:{question='Find the word';visual=emoji;answer=w;wrong=other.map(x=>x[0]);hint='Look at the picture.'}
  }
  return {prompt:question,visual,answer:String(answer),options:choices(answer,wrong,r),hint,format:type,spoken:question};
 }
 function make(topic,level,seed){const r=rng(hash(topic.id+'|'+level+'|'+seed)),q=topic.subject==='math'?math(topic,level,r):english(topic,level,r);return {...q,seed,level,topicId:topic.id,key:topic.id+'|'+level+'|'+q.prompt+'|'+q.visual+'|'+q.answer};}
 function pool(topic,level,count,exclude=[]){const seen=new Set(exclude),out=[];let i=0;while(out.length<count&&i<15000){let q=make(topic,level,i++);if(seen.has(q.key))continue;seen.add(q.key);out.push(q)}return out}
 return Object.freeze({make,pool,math,english,hash,choices});
})();