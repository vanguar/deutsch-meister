/* ═══════════════════════════════════════════════
   news.js — лента раздела «Новости на немецком» (news.html)
   Читает data/news/index.json и рисует:
     • рубрики: где статьи уже есть — счётчик и «свежее», где нет — «скоро»;
     • ленту: самые свежие сверху, у каждой статьи уровень, дата публикации
       в источнике и дата появления у нас.
   Статью открывает тот же ридер, что и книги (js/reader.js), — с
   подсказками, подстрочником, переводом, озвучкой и карточками.

   «Свежесть» — две разные отметки, чтобы было понятно с первого взгляда:
     🔥 Свежее — новости не больше FRESH_DAYS дней (по дате в источнике);
     • НОВОЕ   — статью ещё не открывали на этом устройстве (dm_news_seen:<id>).
   Zero dependencies.
   ═══════════════════════════════════════════════ */

const NewsFeed = (() => {

  const INDEX_URL  = 'data/news/index.json';
  const SEEN_KEY   = 'dm_news_seen:';
  const POS_KEY    = 'dm_book_pos:';   // позицию пишет ридер — тот же ключ, что у книг
  const FRESH_DAYS = 3;
  const DAY_MS     = 24 * 60 * 60 * 1000;

  // Рубрики в порядке плиток. Пустые рубрики остаются заглушками «скоро».
  const RUBRICS = [
    { id: 'astronomy', ico: '🔭', title: 'Астрономия', text: 'Космос, открытия и миссии' },
    { id: 'economy',   ico: '💹', title: 'Экономика',  text: 'Рынки, цены, работа и деньги' },
    { id: 'events',    ico: '🌍', title: 'События',    text: 'Главное в Германии и мире' }
  ];

  let elRubrics, elFeed, elFeedTitle, elFilterReset;
  let items  = [];
  let filter = null;   // id рубрики или null — все

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Русские и украинские числительные устроены одинаково: 1 / 2–4 / 5+
  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5)   return forms[1];
    if (b === 1)          return forms[0];
    return forms[2];
  }

  function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* приватный режим */ }
  }

  // ГГГГ-ММ-ДД как локальная полночь: new Date('2026-10-04') — это UTC,
  // и западнее Гринвича «сегодня» превратилось бы во «вчера».
  function parseDay(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function dateDots(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? `${m[3]}.${m[2]}.${m[1]}` : '';
  }

  function ageDays(iso) {
    const d = parseDay(iso);
    if (!d) return Infinity;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((today - d) / DAY_MS);
  }

  // Число и слово — в разных узлах: так DOM-переводчик (js/i18n.js)
  // переводит слово, а число остаётся как есть.
  function agoHtml(days) {
    if (days <= 0) return '<span>сегодня</span>';
    if (days === 1) return '<span>вчера</span>';
    return `<span>${days}</span> <span>${plural(days, ['день назад', 'дня назад', 'дней назад'])}</span>`;
  }

  function isFresh(it) { return ageDays(it.published) <= FRESH_DAYS; }
  function isSeen(it)  { return readStore(SEEN_KEY + it.id) !== null; }

  function percentOf(it) {
    try {
      const pos = JSON.parse(readStore(POS_KEY + it.id) || 'null');
      return pos && typeof pos.percent === 'number' ? Math.max(0, Math.min(100, pos.percent)) : 0;
    } catch (e) { return 0; }
  }

  /* ── Рубрики ── */

  function renderRubrics() {
    elRubrics.innerHTML = RUBRICS.map(r => {
      const list  = items.filter(it => it.rubric === r.id);
      const fresh = list.filter(isFresh).length;
      if (!list.length) {
        return `<button class="news-tile is-soon" type="button" data-rubric="${r.id}" aria-disabled="true">
          <span class="news-tile-badge soon">Скоро</span>
          <div class="news-tile-ico">${r.ico}</div>
          <div class="news-tile-title">${esc(r.title)}</div>
          <div class="news-tile-text">${esc(r.text)}</div>
          <div class="news-tile-count muted"><span>Раздел в разработке</span></div>
        </button>`;
      }
      const on = filter === r.id;
      return `<button class="news-tile is-live${on ? ' is-on' : ''}" type="button" data-rubric="${r.id}" aria-pressed="${on}">
        ${fresh ? '<span class="news-tile-badge fresh">🔥 <span>Свежее</span></span>' : '<span class="news-tile-badge live">Есть статьи</span>'}
        <div class="news-tile-ico">${r.ico}</div>
        <div class="news-tile-title">${esc(r.title)}</div>
        <div class="news-tile-text">${esc(r.text)}</div>
        <div class="news-tile-count"><b>${list.length}</b> <span>${plural(list.length, ['статья', 'статьи', 'статей'])}</span></div>
      </button>`;
    }).join('');
  }

  /* ── Лента ── */

  const RUBRIC_TITLE = { astronomy: 'Астрономия', economy: 'Экономика', events: 'События' };

  function cardHtml(it, i) {
    const fresh = isFresh(it);
    const seen  = isSeen(it);
    const pct   = percentOf(it);
    const lead  = i === 0;
    const cls = ['news-card', lead ? 'is-lead' : '', fresh ? 'is-fresh' : '', seen ? '' : 'is-unread']
      .filter(Boolean).join(' ');
    const badges = [
      fresh ? `<span class="nc-badge fresh">🔥 <span>${lead ? 'Самое свежее' : 'Свежее'}</span></span>` : '',
      seen ? '' : '<span class="nc-badge unread"><i aria-hidden="true"></i><span>Новое</span></span>'
    ].join('');
    return `<article class="${cls}">
      <a class="nc-link" href="#news=${encodeURIComponent(it.id)}" data-news="${esc(it.id)}">
        <div class="nc-media">
          <img src="${esc(it.cover)}" alt="" width="640" height="360" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
          <div class="nc-badges">${badges}</div>
          <span class="nc-level" title="Уровень языка">${esc(it.level)}</span>
        </div>
        <div class="nc-body">
          <div class="nc-kicker">
            <span class="nc-rubric">${esc(RUBRIC_TITLE[it.rubric] || 'Новости')}</span>
            <span class="nc-ago">${agoHtml(ageDays(it.published))}</span>
          </div>
          <h2 class="nc-title" lang="de">${esc(it.title)}</h2>
          <div class="nc-title-ru">${esc(it.titleRu)}</div>
          <p class="nc-blurb">${esc(it.blurb)}</p>
          <dl class="nc-dates">
            <div><dt>Опубликовано</dt><dd>${dateDots(it.published)} · ${esc(it.source)}</dd></div>
            <div><dt>В приложении</dt><dd>${dateDots(it.added)}</dd></div>
          </dl>
          <div class="nc-foot">
            <span class="nc-stat"><span>Уровень</span> <b>${esc(it.level)}</b></span>
            <span class="nc-stat">~${Number(it.minutes) || 1} мин</span>
            <span class="nc-stat"><span>${Number(it.photos) || 0}</span> <span>фото</span></span>
            ${pct > 0 ? `<span class="nc-stat nc-read">${pct}% прочитано</span>` : ''}
            <span class="nc-go">Читать →</span>
          </div>
        </div>
      </a>
    </article>`;
  }

  function renderFeed() {
    const list = filter ? items.filter(it => it.rubric === filter) : items;
    elFeedTitle.textContent = filter ? (RUBRIC_TITLE[filter] || 'Новости') : 'Лента новостей';
    elFilterReset.hidden = !filter;
    elFeed.setAttribute('aria-busy', 'false');
    if (!list.length) {
      elFeed.innerHTML = '<p class="news-empty">В этой рубрике статей пока нет.</p>';
      return;
    }
    elFeed.innerHTML = list.map(cardHtml).join('');
  }

  function render() {
    renderRubrics();
    renderFeed();
  }

  function showError(message) {
    elFeed.setAttribute('aria-busy', 'false');
    elFeed.innerHTML = `<div class="news-error">
      <b>Не удалось загрузить новости.</b>
      <span>Проверьте соединение и попробуйте снова.</span>
      <button class="news-btn" type="button" id="newsRetry">Повторить</button>
      <small>${esc(message)}</small>
    </div>`;
    document.getElementById('newsRetry')?.addEventListener('click', load);
  }

  /* ── Открытие статьи ── */

  function open(id) {
    if (!items.some(it => it.id === id) || typeof Reader === 'undefined') return;
    writeStore(SEEN_KEY + id, String(Date.now()));
    Reader.open(id);
  }

  function onClick(e) {
    const link = e.target.closest('[data-news]');
    if (link) {
      e.preventDefault();
      open(link.dataset.news);
      return;
    }
    const tile = e.target.closest('[data-rubric]');
    if (!tile) return;
    if (tile.classList.contains('is-soon')) {
      if (typeof window.newsSoon === 'function') window.newsSoon();
      return;
    }
    filter = filter === tile.dataset.rubric ? null : tile.dataset.rubric;
    render();
    document.getElementById('newsFeedHead')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Ссылка вида news.html#news=<id> открывает статью сразу (её можно
  // переслать). Хэш убираем: ридер положит свою запись в history сам.
  function openFromHash() {
    const m = /^#news=([^&]+)/.exec(location.hash || '');
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* старый WebView */ }
    open(id);
  }

  function load() {
    elFeed.setAttribute('aria-busy', 'true');
    elFeed.innerHTML = '<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем новости</span></div>';
    return fetch(INDEX_URL, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`${INDEX_URL}: HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const list = data && Array.isArray(data.items) ? data.items : [];
        items = list.filter(it => it && it.id && it.title)
          .sort((a, b) => String(b.published).localeCompare(String(a.published))
                       || String(b.added).localeCompare(String(a.added)));
        render();
        openFromHash();
      })
      .catch(err => {
        console.error('[News] лента не загрузилась:', err);
        showError(err && err.message ? err.message : String(err));
      });
  }

  function init() {
    elRubrics     = document.getElementById('newsRubrics');
    elFeed        = document.getElementById('newsFeed');
    elFeedTitle   = document.getElementById('newsFeedTitle');
    elFilterReset = document.getElementById('newsFilterReset');
    if (!elRubrics || !elFeed) return;
    elRubrics.addEventListener('click', onClick);
    elFeed.addEventListener('click', onClick);
    elFilterReset?.addEventListener('click', () => { filter = null; render(); });
    load();
  }

  // После закрытия ридера: отметка «Новое» и процент прочтения
  function refresh() {
    if (items.length) render();
  }

  return { init, refresh, open };
})();

document.addEventListener('DOMContentLoaded', () => NewsFeed.init());
