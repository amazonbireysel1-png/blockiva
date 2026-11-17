/* Blockiva: yalnızca "internet yok" ekranı. Oyunu ÖNBELLEĞE ALMAZ; internet yoksa sayfa yerine offline.html gösterir. */
var CACHE = 'blockiva-offline-v1';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.add('offline.html'); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var r = e.request;
  if (r.mode !== 'navigate' || r.method !== 'GET') return; // sadece sayfa açılışı; reklam/analitik/diğer istekler aynen geçer
  e.respondWith(
    fetch(r, { cache: 'no-cache' }).catch(function(){ return caches.match('offline.html'); })
  );
});
