/* Little Learning 2.1 navigation and game-view layout */
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const play=byId('playPage');
  const brand=byId('brandHomeBtn');
  const syncLayout=()=>{
    document.body.classList.toggle('isGameActive',!!(play&&play.classList.contains('active')));
  };
  if(play){
    new MutationObserver(syncLayout).observe(play,{attributes:true,attributeFilter:['class']});
    syncLayout();
  }
  if(brand){
    brand.addEventListener('click',()=>{
      const active=document.querySelector('.page.active');
      const pageId=active&&active.id;
      const backId={
        playPage:'homeBtn',
        profilePage:'profileBack',
        historyPage:'historyBack',
        contactPage:'contactBackBtn'
      }[pageId];
      if(backId){
        const back=byId(backId);
        if(back)back.click();
      }
      syncLayout();
      const home=byId('homePage');
      if(home&&!home.classList.contains('active')&&pageId!=='playPage'){
        document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===home));
      }
      window.scrollTo({top:0,behavior:'instant'});
    });
  }
})();
