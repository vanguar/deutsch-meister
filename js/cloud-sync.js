/* ═══════════════════════════════════════════════
   js/cloud-sync.js — облачная синхронизация прогресса

   Работает ТОЛЬКО внутри Telegram (нужен подписанный initData).
   Вне Telegram прогресс остаётся локальным (localStorage) — модуль просто
   ничего не делает.

   Логика:
     1. При открытии тянем облачный снимок и сливаем с локальным
        (Progress.importAll — берём максимум/объединение, ничего не теряем).
     2. При любом изменении прогресса — отложенно (debounce) выгружаем в облако.
     3. При уходе со страницы — финальный флаш через sendBeacon.
   ═══════════════════════════════════════════════ */
(function () {
  const API = 'https://deutsch-meister-puce.vercel.app/api/progress';

  function initData() {
    const wa = window.Telegram && window.Telegram.WebApp;
    return (wa && wa.initData) ? wa.initData : '';
  }

  function refreshUI() {
    try { if (typeof Progress !== 'undefined') Progress.renderHomeProgress(); } catch (e) {}
    try { if (typeof Progress !== 'undefined') Progress.reloadSections(); } catch (e) {}
  }

  function pull(id) {
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: id }),
    })
      .then(r => r.json())
      .then(json => {
        if (json && json.ok && json.data) {
          const changed = Progress.importAll(json.data);
          if (changed) refreshUI();
        }
      })
      .catch(() => {});
  }

  let pushTimer = null;
  let pushing = false;
  function schedulePush(id) {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(id), 1500);
  }
  function push(id) {
    if (pushing) return Promise.resolve();
    pushing = true;
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: id, data: Progress.exportAll() }),
      keepalive: true,
    }).catch(() => {}).finally(() => { pushing = false; });
  }

  function flush(id) {
    try {
      const payload = JSON.stringify({ initData: id, data: Progress.exportAll() });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API, new Blob([payload], { type: 'application/json' }));
      } else {
        push(id);
      }
    } catch (e) {}
  }

  function start() {
    if (typeof Progress === 'undefined') return;
    const id = initData();
    if (!id) return;   // не в Telegram — только localStorage

    // 1) подтянуть облако и слить с локальным
    pull(id);

    // 2) любое изменение прогресса → отложенная выгрузка
    Progress.subscribe(() => schedulePush(id));

    // 3) финальный флаш при уходе
    window.addEventListener('pagehide', () => flush(id));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush(id);
    });
  }

  // Telegram SDK грузится асинхронно — дождёмся initData (до ~3 сек)
  function deferStart() {
    let tries = 0;
    (function wait() {
      if (initData() || tries > 20) { start(); return; }
      tries += 1;
      setTimeout(wait, 150);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferStart);
  } else {
    deferStart();
  }
})();
