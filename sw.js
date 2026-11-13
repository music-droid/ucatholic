// Network-first for the gate and app.enc; runtime-cache everything else same-origin.
// Encrypted PDFs and audio may be cached; plaintext charts are never stored in this repo.
const C="ucatholic-2026-11-15-2";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; const u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  const fresh=u.pathname.endsWith("app.enc")||u.pathname.endsWith("index.html")||r.mode==="navigate";
  if(fresh){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r)));
  }else{
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
  }
});
