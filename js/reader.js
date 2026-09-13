/* ═══════════════════════════════════════════════
   reader.js — вид «Ридер»: рендер главы и пагинация
   Deutsch Meister Course

   Пагинация — CSS multi-column, без ручного замера высоты:
     .rd-viewport { overflow: hidden }
     .rd-content  { column-width: <ширина вьюпорта>; height: <высота> }
   Листание — transform: translateX(-page * (W + GAP)).

   Позиция — якорь { chapter, p, s } (первое видимое предложение),
   номер страницы как позиция не хранится никогда: при другой
   ширине экрана он означает другое место в тексте.

   Zero dependencies. Жесты, тултип, озвучка и карточки — этапы 2C/2D.
   ═══════════════════════════════════════════════ */

const Reader = (() => {

  /* ── Константы ── */
  const BOOKS_DIR = 'data/books/';
  const POS_KEY   = 'dm_book_pos:';
  const GAP       = 32;    // px, зазор между колонками-страницами
  const ANIM_MS   = 180;   // длительность листания, синхронно с css

  /* ── Состояние ── */
  const st = {
    bookId:  null,
    meta:    null,
    gloss:   null,   // глоссарий грузим заранее, используем в 2C
    chapter: null,   // данные текущей главы
    chIndex: 0,      // 0-based
    chTotal: 0,
    page:    0,
    pages:   1,
    width:   0,
    height:  0,
    anchor:  null,   // { p, s } — первое видимое предложение
    open:    false,
    pushed:  false,  // мы добавили запись в history
    retry:   null    // что повторить после ошибки
  };

  /* ── DOM ── */
  let elLib, elView, elViewport, elContent, elState,
      elTitle, elSub, elPages, elBar, elPrev, elNext;

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function chapterFile(i) {
    return `${BOOKS_DIR}${st.bookId}/ch-${String(i + 1).padStart(2, '0')}.json`;
  }

  function getJson(url) {
    return fetch(url, { cache: 'no-cache' }).then(res => {
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status} ${res.statusText}`);
      return res.json();
    });
  }

  /* ── Позиция в localStorage ── */

  function readPos() {
    let raw = null;
    try {
      raw = localStorage.getItem(POS_KEY + st.bookId);
    } catch (e) {
      console.warn('[Reader] localStorage недоступен для чтения позиции', e);
      return null;
    }
    if (!raw) return null;
    try {
      const pos = JSON.parse(raw);
      return (pos && typeof pos === 'object') ? pos : null;
    } catch (e) {
      console.warn('[Reader] повреждённая позиция → начинаем с начала', e);
      return null;
    }
  }

  // Формат из PROGRESS.md: { chapter, p, s, percent }.
  // percent — только для карточки в библиотеке; восстановление идёт по p/s.
  function savePos() {
    if (!st.anchor || st.chTotal <= 0) return;
    const read    = (st.page + 1) / Math.max(1, st.pages);
    const percent = Math.max(0, Math.min(100, ((st.chIndex + read) / st.chTotal) * 100));
    const data = {
      chapter: st.chIndex,
      p:       st.anchor.p,
      s:       st.anchor.s,
      percent: Math.round(percent)
    };
    try {
      localStorage.setItem(POS_KEY + st.bookId, JSON.stringify(data));
    } catch (e) {
      console.warn('[Reader] не удалось сохранить позицию', e);
    }
  }

  /* ── Рендер текста ── */

  // Слово = только буквы (с дефисом и апострофом внутри). Пунктуация,
  // пробелы и цифры остаются голым текстом, без span.
  const WORD_RE = /[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*/gu;

  function renderSentence(text, p, s) {
    let out = '';
    let last = 0;
    let m;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(text)) !== null) {
      if (m.index > last) out += esc(text.slice(last, m.index));
      const w = m[0];
      out += `<span class="bw" data-t="${esc(w.toLowerCase())}">${esc(w)}</span>`;
      last = m.index + w.length;
    }
    if (last < text.length) out += esc(text.slice(last));
    // Перевод предложения в DOM не кладём: он берётся из st.chapter по p/s (2C).
    return `<span class="bs" data-p="${p}" data-s="${s}">${out}</span>`;
  }

  function renderChapter(ch) {
    const paras = Array.isArray(ch.paragraphs) ? ch.paragraphs : [];
    elContent.innerHTML = paras.map((para, p) => {
      const sents = Array.isArray(para.s) ? para.s : [];
      const inner = sents.map((sent, s) => renderSentence(sent.de || '', p, s)).join(' ');
      return `<p class="rd-p">${inner}</p>`;
    }).join('');

    elTitle.textContent = ch.title || '';
    elSub.textContent   = ch.titleRu || '';
  }

  /* ── Пагинация ── */

  function measure() {
    // Ширину берём у самого .rd-content: у вьюпорта есть padding, и он
    // не должен попасть в шаг листания. Высоту — из вьюпорта минус padding.
    const cs = getComputedStyle(elViewport);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    st.width  = elContent.clientWidth;
    st.height = Math.max(0, elViewport.clientHeight - padY);

    elContent.style.columnWidth = st.width + 'px';
    elContent.style.columnGap   = GAP + 'px';
    elContent.style.height      = st.height + 'px';

    // scrollWidth = pages * (W + GAP) - GAP
    const step = st.width + GAP;
    st.pages = step > 0 ? Math.max(1, Math.round(elContent.scrollWidth / step)) : 1;
  }

  function colOf(el) {
    const step = st.width + GAP;
    if (!el || step <= 0) return 0;
    return Math.floor(el.offsetLeft / step);
  }

  function sentences() {
    return elContent.querySelectorAll('.bs');
  }

  // Первое предложение, начинающееся на текущей странице. Если страница
  // целиком занята «хвостом» длинного предложения — берём его начало.
  function anchorFromPage() {
    let fallback = null;
    const list = sentences();
    for (let i = 0; i < list.length; i++) {
      const col = colOf(list[i]);
      if (col === st.page) return list[i];
      if (col < st.page) fallback = list[i];
      if (col > st.page) break;
    }
    return fallback;
  }

  function syncAnchor() {
    const el = anchorFromPage();
    st.anchor = el
      ? { p: Number(el.dataset.p), s: Number(el.dataset.s) }
      : { p: 0, s: 0 };
  }

  function anchorEl(anchor) {
    if (!anchor) return null;
    return elContent.querySelector(`.bs[data-p="${anchor.p}"][data-s="${anchor.s}"]`);
  }

  function pageOfAnchor(anchor) {
    const el = anchorEl(anchor);
    if (!el) return 0;
    return Math.max(0, Math.min(st.pages - 1, colOf(el)));
  }

  function applyTransform(animate) {
    elContent.style.transition = animate ? `transform ${ANIM_MS}ms ease` : 'none';
    elContent.style.transform  = `translateX(${-st.page * (st.width + GAP)}px)`;
    if (!animate) {
      // Сбрасываем inline-none, чтобы следующее листание снова было плавным
      void elContent.offsetWidth;
      elContent.style.transition = '';
    }
  }

  // opts.anchor    — поставить именно этот якорь (восстановление позиции);
  // opts.keepAnchor — не трогать текущий: иначе при каждой перепагинации
  //                   якорь сползал бы на первое предложение страницы, и
  //                   позиция уезжала назад к началу главы;
  // по умолчанию якорь выводится из страницы (обычное листание).
  function goTo(page, opts) {
    const o = opts || {};
    st.page = Math.max(0, Math.min(st.pages - 1, page));
    applyTransform(o.animate !== false);

    if (o.anchor)         st.anchor = o.anchor;
    else if (!o.keepAnchor) syncAnchor();

    paint();
    savePos();
  }

  /* ── Панели ── */

  function paint() {
    elPages.textContent = `стр. ${st.page + 1} / ${st.pages}`;

    const done = st.pages > 1 ? (st.page / (st.pages - 1)) * 100 : 100;
    elBar.style.width = done + '%';

    elPrev.disabled = (st.chIndex === 0 && st.page === 0);
    elNext.disabled = (st.chIndex >= st.chTotal - 1 && st.page >= st.pages - 1);
  }

  /* ── Состояния загрузки / ошибки ── */

  function lockNav() {
    elPrev.disabled = true;
    elNext.disabled = true;
  }

  function showLoading(text) {
    lockNav();
    elState.hidden = false;
    elState.innerHTML = `
      <div class="rd-state-box">
        <div class="rd-spinner"></div>
        <div class="rd-state-title">${esc(text || 'Загружаем')}</div>
      </div>`;
  }

  function showError(message, title) {
    lockNav();
    elState.hidden = false;
    elState.innerHTML = `
      <div class="rd-state-box error">
        <div class="rd-state-icon">📕</div>
        <div class="rd-state-title">${esc(title || 'Глава не загрузилась')}</div>
        <p class="rd-state-text">
          Проверьте соединение и попробуйте снова.
          <span class="rd-state-detail">${esc(message)}</span>
        </p>
        <div class="rd-state-actions">
          <button class="btn btn-primary" id="rdRetry">Повторить</button>
          <button class="btn btn-ghost" id="rdToLib">В библиотеку</button>
        </div>
      </div>`;
    const retry = document.getElementById('rdRetry');
    if (retry) retry.addEventListener('click', () => { if (st.retry) st.retry(); });
    const toLib = document.getElementById('rdToLib');
    if (toLib) toLib.addEventListener('click', () => close());
  }

  function hideState() {
    elState.hidden = true;
    elState.innerHTML = '';
  }

  /* ── Загрузка главы ── */

  // where: { anchor } | { atEnd: true } | ничего → первая страница
  function loadChapter(index, where) {
    st.retry = () => loadChapter(index, where);
    showLoading('Загружаем главу');

    return getJson(chapterFile(index))
      .then(ch => {
        st.chapter = ch;
        st.chIndex = index;
        renderChapter(ch);
        hideState();
        measure();

        // Якорь восстанавливаем только если это предложение есть в главе
        const anchor = where && where.anchor && anchorEl(where.anchor) ? where.anchor : null;
        const page = anchor          ? pageOfAnchor(anchor)
                   : where && where.atEnd ? st.pages - 1
                   : 0;
        goTo(page, { animate: false, anchor });

        // Шрифты Google Fonts могут приехать после первой пагинации и
        // изменить количество страниц — пересчитываем по якорю, когда готовы.
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => { if (st.open) repaginate(); });
        }
      })
      .catch(err => {
        console.error('[Reader] глава не загрузилась:', err);
        showError(err && err.message ? err.message : String(err));
      });
  }

  function loadBook(id, startPos) {
    st.bookId = id;
    st.retry  = () => loadBook(id, startPos);
    showLoading('Открываем книгу');

    // Глоссарий грузим здесь же — в 2C он понадобится сразу, без дозагрузки
    return Promise.all([
      getJson(`${BOOKS_DIR}${id}/meta.json`),
      getJson(`${BOOKS_DIR}${id}/glossary.json`)
    ])
      .then(([meta, gloss]) => {
        st.meta    = meta;
        st.gloss   = gloss;
        st.chTotal = Number(meta.chapters) || 1;

        let index  = 0;
        let where  = null;
        if (startPos && typeof startPos.chapter === 'number'
            && startPos.chapter >= 0 && startPos.chapter < st.chTotal) {
          index = startPos.chapter;
          if (typeof startPos.p === 'number' && typeof startPos.s === 'number') {
            where = { anchor: { p: startPos.p, s: startPos.s } };
          }
        }
        return loadChapter(index, where);
      })
      .catch(err => {
        console.error('[Reader] книга не открылась:', err);
        showError(err && err.message ? err.message : String(err), 'Книга не открылась');
      });
  }

  /* ── Листание, включая границы глав ── */

  function next() {
    if (st.page < st.pages - 1) { goTo(st.page + 1); return; }
    if (st.chIndex < st.chTotal - 1) loadChapter(st.chIndex + 1, null);   // с первой страницы
  }

  function prev() {
    if (st.page > 0) { goTo(st.page - 1); return; }
    if (st.chIndex > 0) loadChapter(st.chIndex - 1, { atEnd: true });     // с последней
  }

  /* ── Перепагинация ── */

  let resizeTimer = null;

  function repaginate() {
    if (!st.open || !st.chapter) return;
    const anchor = st.anchor;
    measure();
    // Без анимации и с сохранением якоря: читатель остаётся на своём предложении
    goTo(pageOfAnchor(anchor), { animate: false, keepAnchor: true });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(repaginate, 120);
  }

  /* ── Открыть / закрыть ── */

  function open(id) {
    if (!elView || !id) return;

    st.open = true;
    elLib.hidden  = true;
    elView.hidden = false;
    document.body.classList.add('rd-open');

    try {
      history.pushState({ view: 'reader', book: id }, '', '#book=' + encodeURIComponent(id));
      st.pushed = true;
    } catch (e) {
      st.pushed = false;
      console.warn('[Reader] history.pushState недоступен', e);
    }

    loadBook(id, readPos());
  }

  function close(fromHistory) {
    if (!elView) return;

    if (st.pushed && !fromHistory) {
      st.pushed = false;
      history.back();          // popstate закроет ридер
      return;
    }
    st.pushed = false;
    st.open = false;
    st.chapter = null;
    elView.hidden = true;
    elLib.hidden  = false;
    document.body.classList.remove('rd-open');
    elContent.innerHTML = '';
    hideState();

    // Карточка книги должна показать свежий процент
    if (typeof Library !== 'undefined' && typeof Library.refresh === 'function') Library.refresh();
  }

  /* ── Инициализация ── */

  function init() {
    elLib      = document.getElementById('libView');
    elView     = document.getElementById('rdView');
    elViewport = document.getElementById('rdViewport');
    elContent  = document.getElementById('rdContent');
    elState    = document.getElementById('rdState');
    elTitle    = document.getElementById('rdChapterTitle');
    elSub      = document.getElementById('rdChapterSub');
    elPages    = document.getElementById('rdPages');
    elBar      = document.getElementById('rdBarFill');
    elPrev     = document.getElementById('rdPrev');
    elNext     = document.getElementById('rdNext');
    if (!elView || !elViewport || !elContent) return;

    document.getElementById('rdBack')?.addEventListener('click', () => close());
    elPrev.addEventListener('click', prev);
    elNext.addEventListener('click', next);

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('popstate', e => {
      const isReader = e.state && e.state.view === 'reader';
      if (st.open && !isReader) close(true);
    });
  }

  return { init, open, close, next, prev, goTo, repaginate, state: st };
})();

document.addEventListener('DOMContentLoaded', () => Reader.init());
