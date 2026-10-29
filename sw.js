const CACHE="little-learning-v20261030-06";
const FILES=["./","./index.html","./css/style-v20261030-01.css","./js/app-v20261030-06.js","./css/experience-v20261030-02.css","./js/experience-v20261030-02.js","./css/layout-v20261030-03.css","./js/navigation-v3.js","./css/studio-v3.css","./curriculum/catalog-v3.js","./curriculum/questions-v3.js","./js/voice-v3.js","./js/curriculum-v20261030-06.js","./css/adventure-home-v31.css","./js/adventure-home-v31.js","./assets/fox-mascot-v31.svg","./css/unified-resume-v32.css","./js/unified-resume-v32.js","./manifest.webmanifest"];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('little-learning-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return;}
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));});
