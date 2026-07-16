const CACHE = 'deutsch-meister-v56';
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const BASE = SCOPE_PATH === '' ? '' : SCOPE_PATH;

// Only pre-cache the shell — lesson files are cached on first visit
const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/css/base.css?v=35',
  BASE + '/css/sidebar.css?v=36',
  BASE + '/css/lesson.css?v=42',
  BASE + '/css/exercises.css',
  BASE + '/js/progress.js?v=14',
  BASE + '/js/lesson-render.js?v=29',
  BASE + '/js/exercises.js?v=12',
  BASE + '/js/flashcards.js',
  BASE + '/js/tts.js?v=17',
  BASE + '/js/telegram.js?v=14',
  BASE + '/js/cloud-sync.js',
  BASE + '/js/install-app.js',
  BASE + '/js/support.js?v=7',
  BASE + '/icons/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Allow the page to force-activate a waiting SW
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

function isHtml(req) {
  return req.mode === 'navigate' ||
         (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Кросс-доменные запросы (озвучка StreamElements/ResponsiveVoice, Telegram SDK,
  // аудио с Range-заголовками) НЕ трогаем — пусть браузер сам идёт в сеть. Иначе
  // на iOS перехват медиа-запросов ломает воспроизведение звука.
  if (new URL(req.url).origin !== self.location.origin) return;

  // HTML / navigations → network-first, so new versions show immediately online
  if (isHtml(req)) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() =>
        caches.match(req).then(c => c || caches.match(BASE + '/index.html'))
      )
    );
    return;
  }

  // Everything else → cache-first (assets are versioned via ?v= query)
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(BASE + '/index.html'));
    })
  );
});
