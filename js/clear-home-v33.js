/* Little Learning 3.3 — show six topics first, with an explicit touch-friendly disclosure.
   Existing grade selection, lesson launch and progress handling remain untouched. */
(function(){
  'use strict';
  const studio=document.getElementById('llStudio');
  const grid=document.getElementById('llTopicGrid');
  const button=document.getElementById('llShowMoreTopics');
  if(!studio||!grid||!button)return;
  let expanded=false;
  function update(){
    const count=grid.querySelectorAll('button[data-ll-topic]').length;
    const more=Math.max(0,count-6);
    button.hidden=more===0;
    if(!more)expanded=false;
    studio.classList.toggle('topicsExpanded',expanded);
    button.setAttribute('aria-expanded',String(expanded));
    button.textContent=expanded?'Show fewer topics':'See all '+count+' topics';
    button.setAttribute('aria-label',expanded?'Show only the first six learning topics':'Show all '+count+' learning topics');
  }
  button.addEventListener('click',()=>{
    expanded=!expanded;
    update();
    if(!expanded)studio.querySelector('.llTopicHeading')?.scrollIntoView({block:'nearest',behavior:'instant'});
  });
  // Changing the grade or subject returns to a short, understandable selection.
  document.getElementById('llGradeSelect')?.addEventListener('change',()=>{expanded=false;update()});
  document.querySelectorAll('[data-ll-subject]').forEach(b=>{
    b.addEventListener('click',()=>{expanded=false;update()});
  });
  new MutationObserver(update).observe(grid,{childList:true});
  update();
})();