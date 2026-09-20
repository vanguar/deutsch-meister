const CACHE = 'deutsch-meister-v84';
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const BASE = SCOPE_PATH === '' ? '' : SCOPE_PATH;

// Only pre-cache the shell — lesson files are cached on first visit
const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/css/base.css?v=69',
  BASE + '/css/sidebar.css?v=69',
  BASE + '/css/lesson.css?v=69',
  BASE + '/css/exercises.css?v=69',
  BASE + '/js/progress.js?v=69',
  BASE + '/js/lesson-render.js?v=69',
  BASE + '/js/exercises.js?v=69',
  BASE + '/js/flashcards.js?v=69',
  BASE + '/js/tts.js?v=69',
  BASE + '/js/telegram.js?v=69',
  BASE + '/js/cloud-sync.js?v=69',
  BASE + '/js/install-app.js?v=69',
  BASE + '/js/support.js?v=69',
  BASE + '/js/sw-register.js?v=69',
  // Читалка: оболочка библиотеки и её движок. Каталог книг — маленький
  // и нужен сразу, поэтому он в прекеше; ?v= у .json нет намеренно:
  // bump_version.py версионирует только .js/.css, а запросы всё равно
  // идут network-first, так что свежее приходит из сети.
  BASE + '/books.html',
  BASE + '/css/reader.css?v=69',
  BASE + '/js/library.js?v=69',
  BASE + '/js/reader.js?v=69',
  BASE + '/js/reader-tip.js?v=69',
  BASE + '/js/reader-words.js?v=69',
  BASE + '/js/reader-speak.js?v=69',
  BASE + '/js/reader-cards.js?v=69',
  BASE + '/js/reader-dict.js?v=69',
  BASE + '/data/books/index.json',
  BASE + '/icons/icon.svg',
];

// Главы (data/books/*/ch-NN.json) и glossary.json НЕ прекешируются:
// библиотека будет расти, и складывать её целиком в кеш не масштабируется.
// Они попадают в кеш на первом успешном чтении (обычная ветка fetch ниже)
// и оттуда же отдаются без сети.
// Исходники книг в кеш не кладём вообще: это материалы сборки, не рантайм.
const NO_STORE = [
  /\/data\/books\/[^/]+\/raw\.txt$/,
  /\/tools\/sources\//
];

function isNoStore(url) {
  const path = new URL(url).pathname;
  return NO_STORE.some(re => re.test(path));
}

// skipWaiting() зовём ПЕРВЫМ делом, до прекеша. Раньше он висел на
// .then() после addAll — а addAll отклоняется целиком, если хотя бы один
// URL не отдался. Один битый адрес в списке (или моргнувшая сеть) означал
// проваленную установку: новый воркер не активировался НИКОГДА, старый
// продолжал отдавать старые файлы, и пользователь не мог это починить
// ни удалением PWA, ни очисткой кэша. Поэтому теперь каждый файл кладётся
// отдельно и его неудача не роняет остальные: прекеш — оптимизация для
// офлайна, а не условие работы.
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      STATIC.map(url => c.add(url).catch(err => {
        console.warn('[SW] не удалось прекешировать ' + url, err);
      }))
    )).catch(err => console.warn('[SW] прекеш недоступен', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Страница может попросить ждущий воркер активироваться немедленно.
// Принимаем и строку, и объект: разные версии страниц шлют по-разному,
// а старая страница обязана уметь разбудить новый воркер.
self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'SKIP_WAITING' || (d && d.type === 'SKIP_WAITING')) self.skipWaiting();
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

  // Everything else (JS/CSS/JSON глав…) → network-first: всегда берём свежее
  // из сети, а кэш держим как офлайн-фолбэк и как cache-on-read для глав книг.
  // Так новые правки видно обычной перезагрузкой — без ручной чистки кэша.
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok && !isNoStore(req.url)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() => caches.match(req).then(c => c || caches.match(BASE + '/index.html')))
  );
});
