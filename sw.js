/* Service worker: páginas e códigos sempre tentam a internet primeiro (suas edições aparecem na hora).
   Imagens ficam guardadas no aparelho do cliente, então voltam a abrir rapidinho nas próximas visitas. */
const C = "futstore-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const guardar = res => { if (res && res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; };
  if (r.destination === "image") {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(guardar)));
    return;
  }
  e.respondWith(fetch(r).then(guardar).catch(() => caches.match(r)));
});
