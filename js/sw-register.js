/* ═══════════════════════════════════════════════
   sw-register.js — регистрация service worker и обновление приложения
   Deutsch Meister Course

   Повод: на телефоне месяцами жил старый воркер. На проде лежал
   свежий код (?v=58), а устройство показывало старый интерфейс, и
   ни удаление PWA, ни «очистить кэш» не помогали — «очистить кэш» в
   Android Chrome не снимает регистрацию воркера и не трогает Cache
   Storage. Три дырки складывались в одну:

     1. books.html воркер НЕ регистрировал вообще. Регистрация — это
        и есть то, что заставляет браузер проверить обновление. Читалку
        открывают прямо по ссылке, и на ней проверка не запускалась
        никогда: страница управлялась старым воркером и не имела
        способа его сменить.
     2. register() шёл без updateViaCache: 'none'. GitHub Pages отдаёт
        service-worker.js с Cache-Control: max-age=600, и по умолчанию
        (updateViaCache: 'imports') браузер берёт сам файл воркера из
        HTTP-кэша — проверка обновления десять минут смотрит в копию.
     3. Номер версии нигде не показывался, и понять, что именно
        крутится на экране, было нельзя — только гадать по наличию
        кнопки.

   Поэтому здесь: одна общая регистрация на все страницы,
   updateViaCache: 'none', проверка обновления при каждом возврате на
   вкладку, немедленная активация нового воркера и одна перезагрузка
   по controllerchange (со счётчиком против цикла). Плюс dmAppVersion()
   для видимой строки версии и dmHardReset() — аварийный сброс.

   Zero dependencies.
   ═══════════════════════════════════════════════ */

(function () {
  // Счётчик перезагрузок держим в сессии: если новый воркер почему-то
  // меняется по кругу, страница не должна перезагружаться бесконечно.
  const RELOAD_KEY = 'dm_sw_reload';
  const RELOAD_MAX = 2;

  /* ── Версия приложения ── */

  // Номер берём из ?v= у собственного тега: bump_version.py правит его
  // во всех HTML, значит отдельного места для версии заводить не нужно
  // и рассинхрону взяться неоткуда.
  const own = document.currentScript;

  function readVersion() {
    const fromOwn = own && /[?&]v=(\d+)/.exec(own.src || '');
    if (fromOwn) return fromOwn[1];
    const tags = document.querySelectorAll('script[src*="v="], link[href*="v="]');
    for (let i = 0; i < tags.length; i++) {
      const m = /[?&]v=(\d+)/.exec(tags[i].src || tags[i].href || '');
      if (m) return m[1];
    }
    return '';
  }

  const VERSION = readVersion();

  function appVersion() { return VERSION; }
  function appVersionLabel() {
    return VERSION ? 'версия ' + VERSION : 'версия неизвестна';
  }

  /* ── Аварийный сброс ── */

  // Снимаем ВСЕ регистрации и сносим ВСЕ кеши, потом перезагружаемся.
  // location.reload(true) не используем: параметр forceGet давно
  // игнорируется, а после unregister + caches.delete отдавать старое
  // уже некому.
  let resetting = false;

  function hardReset() {
    if (resetting) return Promise.resolve();
    resetting = true;

    let reloaded = false;
    const reload = () => {
      if (reloaded) return;
      reloaded = true;
      try { sessionStorage.removeItem(RELOAD_KEY); } catch (e) {}
      location.reload();
    };

    const jobs = [];
    if ('serviceWorker' in navigator) {
      jobs.push(
        navigator.serviceWorker.getRegistrations()
          .then(list => Promise.all(list.map(r => r.unregister())))
          .catch(e => console.warn('[SW] не удалось снять регистрации', e))
      );
    }
    if (window.caches && caches.keys) {
      jobs.push(
        caches.keys()
          .then(keys => Promise.all(keys.map(k => caches.delete(k))))
          .catch(e => console.warn('[SW] не удалось очистить кеши', e))
      );
    }

    // Страховка: если какой-то из шагов завис, всё равно перезагружаемся
    setTimeout(reload, 3000);
    return Promise.all(jobs).then(reload, reload);
  }

  /* ── Регистрация ── */

  if (!('serviceWorker' in navigator)) {
    Object.assign(window, { dmAppVersion: appVersion, dmAppVersionLabel: appVersionLabel,
                            dmHardReset: hardReset });
    return;
  }

  const swBase = location.pathname.startsWith('/deutsch-meister/')
    ? '/deutsch-meister/' : '/';

  let refreshing = false;

  function reloadOnce() {
    if (refreshing) return;
    let n = 0;
    try { n = Number(sessionStorage.getItem(RELOAD_KEY)) || 0; } catch (e) {}
    if (n >= RELOAD_MAX) {
      console.warn('[SW] перезагрузка после смены воркера зациклилась — остановлено');
      return;
    }
    refreshing = true;
    try { sessionStorage.setItem(RELOAD_KEY, String(n + 1)); } catch (e) {}
    location.reload();
  }

  // Страница прожила больше десяти секунд — значит цикла нет, счётчик
  // можно обнулить, иначе следующее честное обновление в этой же сессии
  // упёрлось бы в лимит.
  setTimeout(() => { try { sessionStorage.removeItem(RELOAD_KEY); } catch (e) {} }, 10000);

  navigator.serviceWorker.addEventListener('controllerchange', reloadOnce);

  function activate(worker) {
    if (!worker) return;
    try { worker.postMessage('SKIP_WAITING'); } catch (e) {}
  }

  navigator.serviceWorker.register(swBase + 'service-worker.js', {
    // Без этого браузер берёт сам файл воркера из HTTP-кэша (max-age=600
    // на GitHub Pages) и до десяти минут «проверяет обновление» по копии
    updateViaCache: 'none'
  }).then(reg => {
    reg.update().catch(() => {});

    // Новая версия уже дождалась своей очереди — пускаем сразу
    if (reg.waiting) activate(reg.waiting);

    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        // controller есть — значит это обновление, а не первая установка:
        // при первой установке перезагружать нечего.
        if (nw.state === 'installed' && navigator.serviceWorker.controller) activate(nw);
      });
    });

    // Возврат на вкладку — самый частый момент, когда пользователь ждёт
    // свежую версию. Открытая неделями PWA иначе не проверяется вовсе.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  }).catch(e => console.warn('[SW] регистрация не удалась', e));

  Object.assign(window, {
    dmAppVersion: appVersion,
    dmAppVersionLabel: appVersionLabel,
    dmHardReset: hardReset
  });
})();
