/* ═══════════════════════════════════════════════
   news.js — раздел «Новости на немецком» (news.html)
   Читает data/news/index.json. Два вида на одной странице:
     • витрина рубрик (news.html) — плитка на рубрику: сколько статей,
       есть ли свежие и какая последняя;
     • страница рубрики (news.html#r=<рубрика>) — статьи только этой
       рубрики, самые свежие сверху; у каждой уровень, дата публикации в
       источнике и дата появления у нас.
   Переход в рубрику — запись в history: «назад» в браузере, в Telegram
   и кнопка «← Все рубрики» возвращают на витрину.
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
    { id: 'science',   ico: '🔬', title: 'Наука',      text: 'Исследования, открытия и премии' },
    { id: 'economy',   ico: '💹', title: 'Экономика',  text: 'Рынки, цены, работа и деньги' },
    { id: 'events',    ico: '🌍', title: 'События',    text: 'Главное в Германии и мире' }
  ];
  const RUBRIC = Object.fromEntries(RUBRICS.map(r => [r.id, r]));

  let elHub, elRubrics, elPage, elFeed, elTitle, elIco, elSub;
  let items   = [];
  let current = null;     // id открытой рубрики или null — витрина
  let loaded  = false;

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

  function countHtml(n) {
    return `<b>${n}</b> <span>${plural(n, ['статья', 'статьи', 'статей'])}</span>`;
  }

  function isFresh(it) { return ageDays(it.published) <= FRESH_DAYS; }
  function isSeen(it)  { return readStore(SEEN_KEY + it.id) !== null; }
  function inRubric(id) { return items.filter(it => it.rubric === id); }

  function percentOf(it) {
    try {
      const pos = JSON.parse(readStore(POS_KEY + it.id) || 'null');
      return pos && typeof pos.percent === 'number' ? Math.max(0, Math.min(100, pos.percent)) : 0;
    } catch (e) { return 0; }
  }

  /* ── Витрина рубрик ── */

  function tileHtml(r) {
    const list = inRubric(r.id);
    if (!list.length) {
      return `<a class="news-tile is-soon" href="#r=${r.id}" data-rubric="${r.id}" aria-disabled="true">
        <span class="news-tile-badge soon">Скоро</span>
        <div class="news-tile-top">
          <div class="news-tile-ico">${r.ico}</div>
          <div class="news-tile-head">
            <div class="news-tile-title">${esc(r.title)}</div>
            <div class="news-tile-text">${esc(r.text)}</div>
          </div>
        </div>
        <div class="news-tile-foot"><span class="news-tile-count muted"><span>Раздел в разработке</span></span></div>
      </a>`;
    }
    const fresh  = list.filter(isFresh).length;
    const unread = list.filter(it => !isSeen(it)).length;
    const last   = list[0];   // items уже отсортированы: свежие первыми
    return `<a class="news-tile is-live${fresh ? ' is-fresh' : ''}" href="#r=${r.id}" data-rubric="${r.id}">
      ${fresh ? '<span class="news-tile-badge fresh">🔥 <span>Свежее</span></span>' : ''}
      <div class="news-tile-top">
        <div class="news-tile-ico">${r.ico}</div>
        <div class="news-tile-head">
          <div class="news-tile-title">${esc(r.title)}</div>
          <div class="news-tile-text">${esc(r.text)}</div>
        </div>
      </div>
      <div class="news-tile-last">
        <img src="${esc(last.cover)}" alt="" width="640" height="360" loading="lazy" decoding="async">
        <div class="ntl-body">
          <div class="ntl-label"><span>Последняя</span> · ${agoHtml(ageDays(last.published))}</div>
          <div class="ntl-title" lang="de">${esc(last.title)}</div>
        </div>
      </div>
      <div class="news-tile-foot">
        <span class="news-tile-count">${countHtml(list.length)}</span>
        ${unread ? `<span class="news-tile-unread"><i aria-hidden="true"></i><span>${unread}</span> <span>${plural(unread, ['новая', 'новые', 'новых'])}</span></span>` : ''}
        <span class="news-tile-go">Открыть →</span>
      </div>
    </a>`;
  }

  function renderHub() {
    elRubrics.setAttribute('aria-busy', 'false');
    elRubrics.innerHTML = RUBRICS.map(tileHtml).join('');
  }

  /* ── Страница рубрики ── */

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
    return `<article class="${cls}" data-id="${esc(it.id)}">
      <a class="nc-link" href="#news=${encodeURIComponent(it.id)}" data-news="${esc(it.id)}">
        <div class="nc-media">
          <img src="${esc(it.cover)}" alt="" width="640" height="360" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
          <div class="nc-badges">${badges}</div>
          <span class="nc-level" title="Уровень языка">${esc(it.level)}</span>
        </div>
        <div class="nc-body">
          <div class="nc-kicker">
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

  function renderRubric() {
    const r    = RUBRIC[current];
    const list = inRubric(current);
    elIco.textContent   = r.ico;
    elTitle.textContent = r.title;
    elSub.innerHTML     = list.length ? countHtml(list.length) : '';
    elFeed.setAttribute('aria-busy', 'false');
    elFeed.innerHTML = list.length
      ? list.map(cardHtml).join('')
      : '<p class="news-empty">В этой рубрике статей пока нет.</p>';
  }

  /* ── Вид: витрина или рубрика ── */

  function render() {
    elHub.hidden  = !!current;
    elPage.hidden = !current;
    syncTgBack();
    if (!loaded) return;
    if (current) renderRubric(); else renderHub();
  }

  function rubricFromHash() {
    const m = /^#r=([\w-]+)/.exec(location.hash || '');
    return m && RUBRIC[m[1]] ? m[1] : null;
  }

  // Своя запись в history: «назад» из рубрики ведёт на витрину
  function openRubric(id) {
    if (!RUBRIC[id] || id === current) return;
    try { history.pushState({ view: 'rubric', rubric: id }, '', '#r=' + id); } catch (e) { /* старый WebView */ }
    current = id;
    render();
    window.scrollTo(0, 0);
  }

  function toHub() {
    if (!current) return;
    if (history.state && history.state.view === 'rubric') {
      history.back();          // popstate вернёт витрину
      return;
    }
    // В рубрику пришли по прямой ссылке — записи «до» нет, заменяем адрес
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* старый WebView */ }
    current = null;
    render();
    window.scrollTo(0, 0);
  }

  function onPopState() {
    if (/^#news=/.test(location.hash || '')) {
      // запись ридера; если ридер закрыт — ссылку на статью открыли на
      // уже загруженной странице (сменился только хэш)
      if (loaded && !(typeof Reader !== 'undefined' && Reader.state && Reader.state.open)) openFromHash();
      return;
    }
    const next = rubricFromHash();
    if (next === current) { render(); return; }        // закрыли статью — та же рубрика
    current = next;
    render();
    window.scrollTo(0, 0);
  }

  // Кнопка «назад» Telegram: в рубрике и в статье ведёт на шаг назад,
  // на витрине прячется — тогда Telegram показывает «Закрыть».
  function onTgBack() {
    if (typeof Reader !== 'undefined' && Reader.state && Reader.state.open) Reader.close();
    else toHub();
  }

  function syncTgBack() {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (!tg || !tg.BackButton || !tg.initData || !tg.isVersionAtLeast || !tg.isVersionAtLeast('6.1')) return;
    tg.BackButton.offClick(onTgBack);
    if (current) {
      tg.BackButton.onClick(onTgBack);
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  }

  function showStatus(html) {
    const el = current ? elFeed : elRubrics;
    el.setAttribute('aria-busy', 'false');
    el.innerHTML = html;
  }

  function showError(message) {
    showStatus(`<div class="news-error">
      <b>Не удалось загрузить новости.</b>
      <span>Проверьте соединение и попробуйте снова.</span>
      <button class="news-btn" type="button" id="newsRetry">Повторить</button>
      <small>${esc(message)}</small>
    </div>`);
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
    e.preventDefault();
    if (tile.classList.contains('is-soon')) {
      if (typeof window.newsSoon === 'function') window.newsSoon();
      return;
    }
    openRubric(tile.dataset.rubric);
  }

  // Ссылка вида news.html#news=<id> открывает статью сразу (её можно
  // переслать). Под статьёй — её рубрика, ридер положит свою запись в history.
  function openFromHash() {
    const m = /^#news=([^&]+)/.exec(location.hash || '');
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    const it = items.find(x => x.id === id);
    const rubric = it && RUBRIC[it.rubric] ? it.rubric : null;
    try {
      history.replaceState(rubric ? { view: 'rubric', rubric } : null, '',
        location.pathname + location.search + (rubric ? '#r=' + rubric : ''));
    } catch (e) { /* старый WebView */ }
    current = rubric;
    render();
    open(id);
  }

  function load() {
    showStatus('<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем новости</span></div>');
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
        loaded = true;
        render();
        openFromHash();
      })
      .catch(err => {
        console.error('[News] лента не загрузилась:', err);
        showError(err && err.message ? err.message : String(err));
      });
  }

  function init() {
    elHub     = document.getElementById('newsHub');
    elRubrics = document.getElementById('newsRubrics');
    elPage    = document.getElementById('newsRubric');
    elFeed    = document.getElementById('newsFeed');
    elTitle   = document.getElementById('newsFeedTitle');
    elIco     = document.getElementById('newsRubricIco');
    elSub     = document.getElementById('newsRubricSub');
    if (!elHub || !elRubrics || !elPage || !elFeed) return;
    elRubrics.addEventListener('click', onClick);
    elFeed.addEventListener('click', onClick);
    document.getElementById('newsToHub')?.addEventListener('click', toHub);
    window.addEventListener('popstate', onPopState);
    current = rubricFromHash();
    render();
    load();
  }

  // После закрытия ридера: отметка «Новое» и процент прочтения
  function refresh() {
    if (loaded) render();
  }

  return { init, refresh, open, openRubric, toHub, rubrics: RUBRICS, get current() { return current; } };
})();

document.addEventListener('DOMContentLoaded', () => NewsFeed.init());
