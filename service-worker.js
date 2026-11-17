const CACHE = 'deutsch-meister-v235';
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const BASE = SCOPE_PATH === '' ? '' : SCOPE_PATH;

// Only pre-cache the shell — lesson files are cached on first visit
const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/css/base.css?v=220',
  BASE + '/css/sidebar.css?v=220',
  BASE + '/css/home.css?v=220',
  BASE + '/css/lesson.css?v=220',
  BASE + '/css/exercises.css?v=220',
  BASE + '/js/i18n.js?v=220',
  BASE + '/js/tg-theme.js?v=220',
  BASE + '/js/theme.js?v=220',
  BASE + '/js/progress-model.js?v=220',
  BASE + '/js/progress.js?v=220',
  BASE + '/js/offline.js?v=220',
  BASE + '/css/offline.css?v=220',
  BASE + '/js/lesson-render.js?v=220',
  BASE + '/js/exercises.js?v=220',
  BASE + '/js/flashcards.js?v=220',
  BASE + '/js/tts.js?v=220',
  BASE + '/js/telegram.js?v=220',
  BASE + '/js/cloud-sync.js?v=220',
  BASE + '/js/install-app.js?v=220',
  BASE + '/js/support.js?v=220',
  BASE + '/js/home.js?v=220',
  BASE + '/js/vocab.js?v=220',
  BASE + '/js/sw-register.js?v=220',
  // Читалка: оболочка библиотеки и её движок. Каталог книг — маленький
  // и нужен сразу, поэтому он в прекеше; ?v= у .json нет намеренно:
  // bump_version.py версионирует только .js/.css, а запросы всё равно
  // идут network-first, так что свежее приходит из сети.
  BASE + '/books.html',
  BASE + '/news.html',
  BASE + '/css/reader.css?v=220',
  BASE + '/js/image-reveal.js?v=220',
  BASE + '/js/library.js?v=220',
  BASE + '/js/reader.js?v=220',
  BASE + '/js/reader-tip.js?v=220',
  BASE + '/js/reader-gloss.js?v=220',
  BASE + '/js/reader-words.js?v=220',
  BASE + '/js/reader-speak.js?v=220',
  BASE + '/js/reader-cards.js?v=220',
  BASE + '/js/reader-dict.js?v=220',
  BASE + '/css/news.css?v=220',
  BASE + '/js/news.js?v=220',
  // Диалоги: оболочка, движок и оглавление; сами диалоги (data/dialogs/*.json)
  // и фото кладутся в кеш при первом открытии, как главы книг
  BASE + '/dialogs.html',
  BASE + '/css/dialogs.css?v=220',
  BASE + '/js/dialogs.js?v=220',
  // Автошкола: оболочка, движок и оглавление; уроки и знаки — при открытии
  BASE + '/fahrschule.html',
  BASE + '/css/fahrschule.css?v=220',
  BASE + '/js/fahrschule.js?v=220',
  // Земли Германии: оболочка, движок, витрина и карта; тексты — при открытии
  BASE + '/history.html',
  BASE + '/css/history.css?v=220',
  BASE + '/js/history.js?v=220',
  BASE + '/data/history/index.json',
  BASE + '/laender.html',
  BASE + '/css/laender.css?v=220',
  BASE + '/js/laender.js?v=220',
  BASE + '/data/laender/lands.json',
  BASE + '/data/laender/map.json',
  BASE + '/data/books/index.json',
  BASE + '/data/news/index.json',
  BASE + '/data/dialogs/index.json',
  BASE + '/data/fahrschule/index.json',
  // словарь курса (вкладка «Словарь»): ~130 КБ, нужен и офлайн
  BASE + '/data/vocab/index.json',
  BASE + '/icons/icon.svg',
  BASE + '/icons/icon-192.png',
];
const SHARED_ASSETS = new Map();
for (const asset of STATIC) {
  const versioned = /^(.*\.(?:js|css))\?v=(\d+)$/.exec(asset);
  if (versioned) SHARED_ASSETS.set(versioned[1], { url: asset, version: Number(versioned[2]) });
}

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
      STATIC.map(url => c.add(new Request(new URL(url, self.location.origin), { cache: 'reload' })).catch(err => {
        console.warn('[SW] не удалось прекешировать ' + url, err);
      }))
    )).catch(err => console.warn('[SW] прекеш недоступен', err))
  );
});

// Own namespace only: other GitHub Pages apps share this origin.
const PREFIX = 'deutsch-meister:' + (BASE || '/') + ':';
const RUNTIME = PREFIX + 'runtime';
const PACK_PREFIX = PREFIX + 'pack:';
const META = new URL(BASE + '/__offline_pack__', self.location.origin).href;
const busyPacks = new Set();

async function packs() {
  const out = [];
  for (const key of await caches.keys()) {
    if (!key.startsWith(PACK_PREFIX)) continue;
    const cache = await caches.open(key), meta = await cache.match(META);
    if (meta) out.push({ key, meta: await meta.json(), cache });
  }
  return out;
}

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const runtime = await caches.open(RUNTIME);
    for (const key of await caches.keys()) {
      if (!/^deutsch-meister-v\d+$/.test(key) || key === CACHE) continue;
      const old = await caches.open(key);
      for (const req of await old.keys()) {
        const u = new URL(req.url);
        if (u.origin === self.location.origin && u.pathname.startsWith(BASE + '/') && !(await runtime.match(req))) {
          await runtime.put(req, await old.match(req));
        }
      }
      await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

function ownedUrl(raw) {
  const u = new URL(raw, self.registration.scope);
  if (u.origin !== self.location.origin || !u.pathname.startsWith(BASE + '/') || isNoStore(u.href)) throw new Error('Invalid offline resource');
  u.hash = '';
  // Never persist Telegram initData or other navigation query parameters.
  if (u.pathname.endsWith('.html') || u.pathname.endsWith('/')) u.search = '';
  return u.href;
}

async function savePack(pack, rawUrls, progress) {
  if (!pack || typeof pack.id !== 'string' || !Array.isArray(rawUrls) || rawUrls.length > 500) throw new Error('Invalid offline pack');
  if (busyPacks.has(pack.id)) throw new Error('Download already running');
  busyPacks.add(pack.id);
  const key = PACK_PREFIX + encodeURIComponent(pack.id) + ':' + Date.now();
  const cache = await caches.open(key);
  try {
    const urls = [...new Set(rawUrls.map(ownedUrl))];
    const page = ownedUrl(pack.page), href = new URL(pack.href, self.registration.scope);
    ownedUrl(href.href);
    if (!urls.includes(page)) throw new Error('Missing page');
    for (let i = 0; i < urls.length; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      let res;
      try { res = await fetch(urls[i], { cache: 'reload', signal: controller.signal }); }
      finally { clearTimeout(timer); }
      if (!res.ok || res.type === 'opaque') throw new Error('HTTP ' + res.status);
      if (/\.css(?:\?|$)/.test(urls[i])) {
        const css = await res.clone().text();
        for (const m of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
          try { const url = ownedUrl(new URL(m[1], urls[i]).href); if (!urls.includes(url)) urls.push(url); } catch (_) { /* external font: use fallback */ }
        }
      }
      await cache.put(urls[i], res);
      progress({ done: i + 1, total: urls.length });
    }
    // Commit marker LAST. A failed/quota-exceeded download is never advertised.
    await cache.put(META, new Response(JSON.stringify({ id: pack.id, lang: ['ru', 'uk', 'ar'].includes(pack.lang) ? pack.lang : 'ru', title: String(pack.title || pack.id), page, href: href.href, savedAt: Date.now(), count: urls.length }), { headers: { 'Content-Type': 'application/json' } }));
    for (const old of await packs()) if (old.meta.id === pack.id && old.key !== key) await caches.delete(old.key);
    return true;
  } catch (err) { await caches.delete(key); throw err; }
  finally { busyPacks.delete(pack.id); }
}

self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'SKIP_WAITING' || d?.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  const port = e.ports && e.ports[0]; if (!port) return;
  e.waitUntil((async () => {
    try {
      let result;
      if (d.type === 'OFFLINE_LIST') result = (await packs()).map(p => p.meta);
      else if (d.type === 'OFFLINE_REMOVE') {
        if (busyPacks.has(d.id)) throw new Error('Download already running');
        for (const p of await packs()) if (p.meta.id === d.id) await caches.delete(p.key);
        result = true;
      } else if (d.type === 'OFFLINE_SAVE') result = await savePack(d.pack, d.urls, progress => port.postMessage({ progress }));
      else throw new Error('Unknown offline request');
      port.postMessage({ result });
    } catch (err) { port.postMessage({ error: err.message }); }
  })());
});

async function cached(req) {
  const url = ownedUrl(req.url);
  const names = [CACHE, RUNTIME, ...(await packs()).sort((a,b) => b.meta.savedAt - a.meta.savedAt).map(p => p.key)];
  for (const name of names) {
    const cache = await caches.open(name);
    const found = await cache.match(url); if (found) return found;
  }
  // Keep downloaded resources readable if they only exist under another version.
  for (const name of names) {
    const found = await (await caches.open(name)).match(url, { ignoreSearch: true });
    if (found) return found;
  }
  return null;
}

self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== self.location.origin || !u.pathname.startsWith(BASE + '/') || isNoStore(req.url)) return;
  e.respondWith((async () => {
    try {
      // A saved page may still link to retired shared assets. Prefer this
      // release's precache over both the HTTP cache and the old saved copy.
      const requested = /^\?v=(\d+)$/.exec(u.search);
      const current = SHARED_ASSETS.get(u.pathname);
      if (current && requested && Number(requested[1]) < current.version) {
        const fresh = await caches.match(current.url, { cacheName: CACHE }).catch(() => null);
        if (fresh) return fresh;
      }
      // The host caches HTML for ten minutes. Revalidate it on navigation so
      // an online reopen gets the latest versioned scripts along with the page.
      const res = await fetch(req, req.mode === 'navigate' ? { cache: 'no-cache' } : undefined);
      if (res.ok) {
        const cache = await caches.open(RUNTIME);
        try {
          await cache.put(ownedUrl(req.url), res.clone());
          const entries = await cache.keys();
          for (const old of entries.slice(0, Math.max(0, entries.length - 400))) await cache.delete(old);
        } catch (_) { /* Storage/quota failures must not break an online page. */ }
      }
      return res;
    } catch (_) {
      const hit = await cached(req); if (hit) return hit;
      if (req.mode === 'navigate') return new Response('<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Офлайн</title><body><h1>Материал не скачан</h1><p>Подключитесь к интернету и скачайте этот материал.</p><a href="' + BASE + '/index.html#more">Открыть скачанные материалы</a></body></html>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return new Response('Offline: resource not downloaded', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
