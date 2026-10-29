/* Little Learning 3.0 — consistent home navigation for Quick Play and grade lessons. */
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const play=byId('playPage'),curr=byId('curriculumPage'),brand=byId('brandHomeBtn');
  function sync(){
    document.body.classList.toggle('isGameActive',Boolean(play?.classList.contains('active')||curr?.classList.contains('active')));
  }
  for(const page of [play,curr])if(page)new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  if(brand)brand.addEventListener('click',()=>{
    const page=document.querySelector('.page.active'),pageId=page?.id;
    const backId={playPage:'homeBtn',curriculumPage:'llCurrHome',profilePage:'profileBack',historyPage:'historyBack',contactPage:'contactBackBtn'}[pageId];
    if(backId&&byId(backId))byId(backId).click();
    const home=byId('homePage');
    if(home&&!home.classList.contains('active')){
      document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===home));
    }
    sync();
    window.scrollTo({top:0,behavior:'instant'});
  });
  sync();
})();