const CACHE = 'deutsch-meister-v7';
const BASE = '/deutsch-meister';

const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/css/base.css',
  BASE + '/css/sidebar.css',
  BASE + '/css/lesson.css',
  BASE + '/js/progress.js',
  BASE + '/js/lesson-render.js',
  BASE + '/js/exercises.js',
  BASE + '/js/flashcards.js',
  BASE + '/icons/icon.svg',
];

const LEVELS = ['a1','a2','b1','b2'];
const LESSONS = [1,2,3,4,5,6,7,8];

LEVELS.forEach(lvl => {
  LESSONS.forEach(n => {
    const pad = String(n).padStart(2,'0');
    STATIC.push(`${BASE}/lessons/${lvl}/lesson-${pad}/index.html`);
    STATIC.push(`${BASE}/data/${lvl}/${lvl}-lesson-${pad}.js`);
  });
});

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
