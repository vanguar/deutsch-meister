const CACHE = 'deutsch-meister-v24';
const BASE = '/deutsch-meister';

// Only pre-cache the shell — lesson files are cached on first visit
const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/css/base.css',
  BASE + '/css/sidebar.css',
  BASE + '/css/lesson.css',
  BASE + '/css/exercises.css',
  BASE + '/js/progress.js',
  BASE + '/js/lesson-render.js',
  BASE + '/js/exercises.js',
  BASE + '/js/flashcards.js',
  BASE + '/js/tts.js',
  BASE + '/js/telegram.js',
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(BASE + '/index.html'));
    })
  );
});
