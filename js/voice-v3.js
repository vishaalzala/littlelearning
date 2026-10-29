/* Little Learning 3.0 — device-native voice preferences.
   Offline and private. Voice quality and available gender depend on the child's OS. */
(function(){
  'use strict';
  const key='littlelearning.voice.v3';
  const defaults={voice:'auto',rate:0.92,pitch:1.04};
  let prefs;try{prefs=Object.assign({},defaults,JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){prefs={...defaults}}
  const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
  const femaleNames=/samantha|karen|moira|ava|aria|jenny|zira|victoria|serena|allison|susan|fiona|female|natasha|sonia|hazel|siri|sophia|olivia/i;
  const naturalNames=/natural|enhanced|premium|neural|online|samantha|karen|aria|jenny|ava/i;
  const englishVoice=v=>/^en([-_]|$)/i.test(v.lang||'');
  const list=()=>synth?synth.getVoices().filter(englishVoice):[];
  function preferredVoice(){
    const voices=list();
    if(prefs.voice!=='auto'){
      const saved=voices.find(v=>v.voiceURI===prefs.voice||v.name+'|'+v.lang===prefs.voice);
      if(saved)return saved;
    }
    const sorted=voices.slice().sort((a,b)=>{
      const score=v=>(femaleNames.test(v.name)?60:0)+(naturalNames.test(v.name)?30:0)+(v.lang==='en-NZ'?16:0)+(v.lang==='en-AU'?12:0)+(v.localService?5:0);
      return score(b)-score(a);
    });
    return sorted[0]||null;
  }
  function say(text){
    if(!synth||typeof SpeechSynthesisUtterance==='undefined')return;
    synth.cancel();
    const message=new SpeechSynthesisUtterance(String(text||''));
    const voice=preferredVoice();
    if(voice){message.voice=voice;message.lang=voice.lang}
    else message.lang='en-US';
    message.rate=Math.max(.7,Math.min(1.12,Number(prefs.rate)||.92));
    message.pitch=Math.max(.85,Math.min(1.25,Number(prefs.pitch)||1.04));
    message.volume=1;
    synth.speak(message);
  }
  window.speak=say;
  function updateSelect(){
    const sel=document.getElementById('llVoiceSelect');if(!sel)return;
    const prior=prefs.voice;
    sel.replaceChildren();
    const option=(v,t)=>{const o=document.createElement('option');o.value=v;o.textContent=t;sel.appendChild(o)};
    option('auto','Best available natural-sounding English voice');
    list().sort((a,b)=>a.name.localeCompare(b.name)).forEach(v=>option(v.voiceURI,v.name+' ('+v.lang+')'+(femaleNames.test(v.name)?' ♀':'')));
    if([...sel.options].some(o=>o.value===prior))sel.value=prior;
    else sel.value='auto';
    const msg=document.getElementById('llVoiceInfo');
    if(msg)msg.textContent=list().length?'Choose a voice to preview. Voice quality depends on the device.':'Your browser will use its available English voice. Extra voices may be installed in device settings.';
  }
  function init(){
    const sel=document.getElementById('llVoiceSelect'),rate=document.getElementById('llVoiceRate'),preview=document.getElementById('llVoicePreview');
    updateSelect();
    if(rate){rate.value=String(prefs.rate);const label=document.getElementById('llVoiceRateLabel');if(label)label.textContent=prefs.rate.toFixed(2)+'×';
      rate.addEventListener('input',()=>{prefs.rate=Number(rate.value);if(label)label.textContent=prefs.rate.toFixed(2)+'×';persist()});
    }
    if(sel)sel.addEventListener('change',()=>{prefs.voice=sel.value;persist()});
    if(preview)preview.addEventListener('click',()=>say('Hello! Welcome to Little Learning. Great job! Let us play and learn.'));
  }
  function persist(){try{localStorage.setItem(key,JSON.stringify(prefs))}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  if(synth){if(typeof synth.addEventListener==='function')synth.addEventListener('voiceschanged',updateSelect);else synth.onvoiceschanged=updateSelect}
})();