/* Selective offline packs. A pack is complete only after every required file
   has been saved. No other lesson/book/dialog is downloaded implicitly. */
(function () {
  'use strict';
  const own = document.currentScript;
  const root = new URL('../', own.src);
  const tr = s => window.I18N ? I18N.t(s) : s;
  const at = p => new URL(p, root).href;
  let sequence = 0;

  async function request(type, data = {}, onProgress) {
    if (!('serviceWorker' in navigator)) throw new Error(tr('Офлайн недоступен в этом браузере'));
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error(tr('Не удалось подготовить офлайн. Обновите страницу.'))), 15000))
    ]);
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error(tr('Загрузка прервана. Попробуйте снова.'))); }, 180000);
      channel.port1.onmessage = e => {
        if (e.data.progress) { if (onProgress) onProgress(e.data.progress); return; }
        clearTimeout(timer); channel.port1.close();
        if (e.data.error) reject(new Error(e.data.error)); else resolve(e.data.result);
      };
      reg.active.postMessage({ type, ...data }, [channel.port2]);
    });
  }

  function localResource(value, base) {
    if (!value || /^(data:|blob:|#)/.test(value)) return null;
    const u = new URL(value, base);
    return u.origin === root.origin && u.pathname.startsWith(root.pathname) ? u.href : null;
  }

  async function pageFiles(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(tr('Страница не загрузилась'));
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const files = [url];
    doc.querySelectorAll('script[src],link[rel="stylesheet"][href],link[rel="icon"][href],img[src]').forEach(el => {
      const u = localResource(el.getAttribute('src') || el.getAttribute('href'), url);
      if (u) files.push(u);
    });
    return files;
  }

  async function filesFor(pack) {
    const pages = await Promise.all([pageFiles(at('index.html')), pageFiles(pack.page)]);
    const urls = pages.flat().concat(pack.files || []);
    // i18n injects dictionaries before rendering. Include those used by this page.
    document.querySelectorAll('script[src],link[rel="stylesheet"][href]').forEach(el => {
      const u = localResource(el.src || el.href, location.href);
      if (u) urls.push(u);
    });
    return [...new Set(urls)];
  }

  async function mount(host, pack) {
    if (!host) return;
    const previous = host.querySelector('.offline-control');
    previous?._observer?.disconnect(); previous?.remove();
    const box = document.createElement('div');
    box.className = 'offline-control';
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'btn offline-button';
    const help = document.createElement('small'); help.className = 'offline-help';
    help.textContent = tr('Текст и упражнения — без сети. Озвучка в Telegram требует интернета; в браузере нужен немецкий голос на телефоне.');
    const note = document.createElement('span');
    note.className = 'offline-note'; note.setAttribute('role', 'status');
    box.append(button, note, help); host.append(box);
    const resized = () => { if (typeof Reader !== 'undefined') Reader.repaginate(); };
    if (typeof ResizeObserver !== 'undefined') { const observer = new ResizeObserver(resized); observer.observe(box); box._observer = observer; }
    let saved = false, busy = false;
    function label() { button.textContent = tr(saved ? '✓ Скачано · удалить' : '↓ Скачать для офлайн'); }
    label();
    try {
      const packs = await request('OFFLINE_LIST');
      saved = packs.some(p => p.id === pack.id); label();
    } catch (_) { /* Button explains errors on an explicit attempt. */ }
    button.addEventListener('click', async () => {
      if (busy) return;
      busy = true; button.disabled = true;
      try {
        if (saved) {
          await request('OFFLINE_REMOVE', { id: pack.id }); saved = false;
          note.textContent = tr('Скачанная копия удалена');
        } else {
          note.textContent = tr('Подготовка загрузки…');
          const urls = await filesFor(pack);
          await request('OFFLINE_SAVE', { pack: { ...pack, files: undefined }, urls }, p => {
            note.textContent = tr('Скачивание') + ': ' + p.done + ' / ' + p.total;
          });
          saved = true;
          note.textContent = tr('Скачано. Внешние фото могут требовать интернета.');
          if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
        }
      } catch (e) { note.textContent = tr('Не удалось сохранить. Проверьте сеть и свободное место.') + ' ' + e.message; }
      finally { busy = false; button.disabled = false; label(); }
    });
  }

  async function book(host, id, count, title) {
    const lang = window.I18N?.lang || 'ru';
    const dir = lang === 'ru' ? 'data/books/' : 'i18n/' + lang + '/books/';
    const files = [at(dir + 'index.json'), at(dir + id + '/meta.json'), at(dir + id + '/glossary.json')];
    for (let i = 1; i <= count; i++) files.push(at(dir + id + '/ch-' + String(i).padStart(2, '0') + '.json'));
    return mount(host, { id: 'book:' + id + ':' + lang, lang, title, page: at('books.html'), href: at('books.html#book=' + id), files });
  }

  function dialog(host, id, title, img) {
    const lang = window.I18N?.lang || 'ru';
    const dir = lang === 'ru' ? 'data/dialogs/' : 'i18n/' + lang + '/dialogs/';
    const files = [at(dir + 'index.json'), at(dir + id + '.json')];
    const picture = localResource(img, location.href); if (picture) files.push(picture);
    return mount(host, { id: 'dialog:' + id + ':' + lang, lang, title, page: at('dialogs.html'), href: at('dialogs.html#d=' + id), files });
  }

  async function renderSaved() {
    const host = document.getElementById('offlineLibrary'); if (!host) return;
    const seq = ++sequence;
    try {
      const packs = await request('OFFLINE_LIST');
      if (seq !== sequence) return;
      host.replaceChildren();
      if (!packs.length) { host.textContent = tr('Пока нет скачанных материалов'); return; }
      packs.forEach(p => {
        const row = document.createElement('div'); row.className = 'offline-saved-row';
        const a = document.createElement('a'); a.href = p.href; a.textContent = p.title + ' · ' + (p.lang || 'ru').toUpperCase();
        a.addEventListener('click', () => { const u = new URL(p.href); u.searchParams.set('lang', p.lang || 'ru'); u.searchParams.set('lts', Date.now()); a.href = u.href; });
        const del = document.createElement('button'); del.type = 'button'; del.textContent = tr('Удалить');
        del.setAttribute('aria-label', tr('Удалить') + ': ' + p.title);
        del.addEventListener('click', async () => { del.disabled = true; try { await request('OFFLINE_REMOVE', { id: p.id }); await renderSaved(); } catch (e) { del.disabled = false; } });
        row.append(a, del); host.append(row);
      });
    } catch (_) { host.textContent = tr('Офлайн недоступен в этом браузере'); }
  }

  function init() {
    if (typeof LESSON_DATA !== 'undefined') {
      const lang = window.I18N?.lang || 'ru';
      const page = new URL(location.pathname, location.origin).href;
      const nav = document.createElement('nav'); nav.className = 'lesson-jump'; nav.setAttribute('aria-label', tr('Разделы урока'));
      document.querySelectorAll('.lesson-section').forEach((section, i) => {
        const heading = section.querySelector('h2'); if (!heading) return;
        section.id ||= 'lesson-part-' + i;
        const link = document.createElement('a'); link.href = '#' + section.id; link.textContent = heading.textContent; nav.append(link);
      });
      document.querySelector('.lesson-meta')?.after(nav);
      mount(document.querySelector('.lesson-meta'), { id: 'lesson:' + LESSON_DATA.id + ':' + lang, lang,
        title: LESSON_DATA.id.toUpperCase() + ' · ' + (LESSON_DATA.title || document.title), page, href: page, files: [] });
    }
    renderSaved();
  }
  window.Offline = { mount, book, dialog, renderSaved };
  window.addEventListener('pageshow', renderSaved);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
