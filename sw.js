// 앱 파일을 캐시에 저장해 오프라인에서도 열리게 한다. 파일을 고치면 VERSION을 올릴 것.
const VERSION = 'dadari-v147';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-full.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;

  // 페이지는 네트워크 우선: 온라인이면 열 때마다 최신 버전, 오프라인이거나 4초 넘게 응답이 없으면 캐시를 쓴다.
  // cache: 'no-cache'는 브라우저가 저장해 둔 사본을 그대로 쓰지 않고 서버에 새 버전이 있는지 먼저 확인하게 한다
  // (GitHub Pages는 페이지를 10분 동안 다시 확인하지 않아도 된다고 알려 줘서, 이게 없으면 업데이트가 늦게 보인다).
  if (e.request.mode === 'navigate') {
    e.respondWith(
      Promise.race([
        fetch(e.request, { cache: 'no-cache' }).then(res => {
          if (res.ok) caches.open(VERSION).then(c => c.put('./index.html', res.clone()));
          return res;
        }),
        new Promise((_, reject) => setTimeout(reject, 4000))
      ]).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 그 밖의 파일은 캐시를 먼저 보여 주고, 온라인이면 뒤에서 새 버전을 받아 둔다.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const net = fetch(e.request, { cache: 'no-cache' }).then(res => {
        if (res.ok) caches.open(VERSION).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit || caches.match('./index.html'));
      return hit || net;
    })
  );
});
