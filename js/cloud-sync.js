/* Acknowledged, retryable sync. Local progress is authoritative while offline. */
(function () {
  'use strict';
  const API = 'https://deutsch-meister-puce.vercel.app/api/progress';
  const DIRTY = 'dm_sync_dirty', LAST = 'dm_sync_last';
  let started = false, running = false, importing = false, timer = null, revision = 0, failures = 0;
  let state = 'local';
  const id = () => window.Telegram?.WebApp?.initData || '';
  const get = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const put = (k,v) => { try { localStorage.setItem(k,v); } catch (_) {} };
  const tr = s => window.I18N ? I18N.t(s) : s;
  function paint(next) {
    state = next || state;
    const el = document.getElementById('syncStatus'), retry = document.getElementById('syncRetry');
    if (el) {
      const labels = { local: 'Прогресс хранится на этом устройстве. Облако доступно в Telegram.', pending: 'Прогресс сохранён на устройстве. Ожидает отправки в облако.', syncing: 'Синхронизация…', saved: 'Прогресс сохранён в облаке.', error: 'Не удалось синхронизировать. Прогресс сохранён на устройстве.' };
      el.textContent = tr(labels[state]);
      if (get(LAST) && state === 'saved') el.textContent += ' ' + new Date(Number(get(LAST))).toLocaleString();
    }
    if (retry) { retry.hidden = !started || state === 'syncing'; retry.onclick = () => schedule(0); }
  }
  function schedule(ms = 1500) { clearTimeout(timer); if (started) timer = setTimeout(sync, ms); }
  function changed() {
    if (importing) return;
    revision++; put(DIRTY, '1'); paint(started ? 'pending' : 'local'); schedule();
  }
  async function call(data, keepalive = false) {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const body = JSON.stringify({ initData: id(), ...data });
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
        signal: controller.signal, keepalive: keepalive && new Blob([body]).size < 60000 });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const result = await res.json();
      if (!result?.ok || (data.data && result.saved !== true)) throw new Error('Not acknowledged');
      return result;
    } finally { clearTimeout(timeout); }
  }
  function merge(data) {
    if (!data) return;
    importing = true;
    try {
      if (Progress.importAll(data)) { Progress.renderHomeProgress(); Progress.reloadSections(); }
    } finally { importing = false; }
  }
  async function sync() {
    if (running || !id()) return;
    running = true; paint('syncing');
    try {
      merge((await call({})).data);
      const rev = revision;
      const result = await call({ data: Progress.exportAll() });
      merge(result.data);
      failures = 0; put(LAST, String(Date.now()));
      if (rev === revision) { put(DIRTY, '0'); paint('saved'); }
      else { paint('pending'); schedule(); }
    } catch (_) {
      put(DIRTY, '1'); paint('error');
      schedule(Math.min(60000, 2000 * (2 ** Math.min(failures++, 5))));
    } finally { running = false; }
  }
  function start() {
    if (typeof Progress === 'undefined') return;
    if (!started && id()) { started = true; put(DIRTY, '1'); paint('pending'); schedule(0); }
  }
  function flush() {
    if (!started) return;
    put(DIRTY, '1');
    // Beacon has no acknowledgement. Keep dirty until a successful foreground sync.
    if (!running) call({ data: Progress.exportAll() }, true).catch(() => {});
  }
  function init() {
    if (typeof Progress === 'undefined') return;
    Progress.subscribe(changed); paint(); start();
    let tries = 0;
    const poll = () => { start(); if (!started && ++tries < 40) setTimeout(poll, 250); };
    poll();
    document.addEventListener('dm:tg-ready', start);
    window.addEventListener('online', () => { start(); schedule(0); });
    window.addEventListener('pageshow', () => { start(); schedule(0); });
    window.addEventListener('pagehide', flush);
    window.addEventListener('storage', e => { if (e.key?.startsWith('dm_') && !e.key.startsWith('dm_sync')) changed(); });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush(); else { start(); schedule(0); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
