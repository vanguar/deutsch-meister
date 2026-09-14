/* ═══════════════════════════════════════════════
   reader.js — вид «Ридер»: рендер главы и пагинация
   Deutsch Meister Course

   Пагинация — CSS multi-column, без ручного замера высоты:
     .rd-viewport { overflow: hidden }
     .rd-content  { column-width: <ширина вьюпорта>; height: <высота> }
   Листание — transform: translateX(-page * (W + gap)), зазор считается в
   measure() и не меньше боковых полей: иначе соседняя страница видна в
   полосе padding, которую overflow:hidden не режет.

   Позиция — якорь { chapter, p, s, w }: первое видимое слово (p — абзац,
   s — предложение, w — слово в нём). Номер страницы как позиция не хранится
   никогда: при другой ширине экрана он означает другое место в тексте.
   Якорь именно по слову, а не по предложению: длинное предложение занимает
   несколько страниц, и «первое предложение страницы» на таких страницах
   указывало бы на колонку назад — каждая перепагинация отбрасывала бы
   читателя на страницу раньше.

   Жесты — делегирование на .rd-viewport в capture-фазе, только Pointer
   Events (иначе touch и click срабатывали бы дважды). Тап по слову отдаётся
   в ReaderTip (js/reader-tip.js) и перехватывает и боковые зоны, и центр.
   Тот же тап значит «не знаю»: лемма уходит в сборник (js/reader-words.js),
   и все её словоформы в главе получают .bw--seen. Перевод предложения
   раскрывается внутри тултипа — ru берётся из st.chapter по data-p/data-s.
   Озвучка (слово, предложение, страница) — js/reader-speak.js, очередь
   чанков идёт по onEnd из js/tts.js.

   Zero dependencies. Перевод предложения — этап 3C, озвучка — 4.
   ═══════════════════════════════════════════════ */

const Reader = (() => {

  /* ── Константы ── */
  const BOOKS_DIR = 'data/books/';
  const POS_KEY   = 'dm_book_pos:';
  const GAP_MIN   = 32;    // px, минимальный зазор между колонками-страницами
  const ANIM_MS   = 180;   // длительность листания, синхронно с css

  /* ── Жесты ── */
  const EDGE      = 0.18;  // доля ширины вьюпорта под боковые зоны листания
  const SWIPE_MIN = 40;    // px, минимальный горизонтальный свайп
  const SWIPE_MS  = 300;   // мс, дольше — уже не свайп
  const TAP_SLOP  = 10;    // px, в пределах этого сдвига жест считается тапом

  /* ── Настройки чтения (dm_reader_prefs) ── */
  const PREFS_KEY = 'dm_reader_prefs';
  const FS_STEPS  = [15, 17, 19, 21, 23];          // px
  const LH_STEPS  = [1.5, 1.75, 2];
  const MARGIN_STEPS = [                            // поля и ширина колонки
    { pad: 12, measure: 860 },
    { pad: 22, measure: 720 },
    { pad: 38, measure: 580 }
  ];
  const THEMES = ['system', 'sepia', 'dark'];
  const FONTS  = {
    system: "'DM Sans', sans-serif",
    serif:  "Georgia, 'Iowan Old Style', 'Times New Roman', serif"
  };
  const DEFAULT_PREFS = { fs: 1, lh: 1, theme: 'system', margin: 1, font: 'system' };

  const SHEET_ROWS = [
    { key: 'fs',     label: 'Размер шрифта',
      opts: FS_STEPS.map((_, i) => ({ v: i, text: 'A', cls: 'fs-' + i })) },
    { key: 'lh',     label: 'Межстрочный интервал',
      opts: [{ v: 0, text: 'Плотно' }, { v: 1, text: 'Обычно' }, { v: 2, text: 'Свободно' }] },
    { key: 'theme',  label: 'Тема страницы',
      opts: [{ v: 'system', text: 'Системная' }, { v: 'sepia', text: 'Сепия' }, { v: 'dark', text: 'Тёмная' }] },
    { key: 'margin', label: 'Поля',
      opts: [{ v: 0, text: 'Узкие' }, { v: 1, text: 'Средние' }, { v: 2, text: 'Широкие' }] },
    { key: 'font',   label: 'Шрифт',
      opts: [{ v: 'system', text: 'Системный' }, { v: 'serif', text: 'Serif', cls: 'ff-serif' }] }
  ];

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
    gap:     GAP_MIN,  // фактический зазор, считается в measure()
    width:   0,
    height:  0,
    anchor:  null,   // { p, s } — первое видимое предложение
    open:    false,
    pushed:  false,  // мы добавили запись в history
    retry:   null,   // что повторить после ошибки
    prefs:   null,   // настройки чтения
    chromeHidden: false,
    sheet:   false   // открыта шторка настроек
  };

  /* ── DOM ── */
  let elLib, elView, elViewport, elContent, elState,
      elTitle, elSub, elPages, elBar, elPrev, elNext,
      elSheet, elSheetBack, elSheetBody;

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

  // Формат из PROGRESS.md: { chapter, p, s, percent } + w (слово в предложении)
  // + ts (когда записали: по нему облачный merge выбирает свежую позицию).
  // percent — только для карточки в библиотеке; восстановление идёт по p/s/w.
  function savePos() {
    if (!st.anchor || st.chTotal <= 0) return;
    const read    = (st.page + 1) / Math.max(1, st.pages);
    const percent = Math.max(0, Math.min(100, ((st.chIndex + read) / st.chTotal) * 100));
    const data = {
      chapter: st.chIndex,
      p:       st.anchor.p,
      s:       st.anchor.s,
      w:       st.anchor.w || 0,
      percent: Math.round(percent),
      ts:      Date.now()
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
    let i = 0;
    let m;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(text)) !== null) {
      if (m.index > last) out += esc(text.slice(last, m.index));
      const w = m[0];
      out += `<span class="bw" data-w="${i}" data-t="${esc(w.toLowerCase())}">${esc(w)}</span>`;
      last = m.index + w.length;
      i++;
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
    const padL = parseFloat(cs.paddingLeft)  || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

    st.width  = elContent.clientWidth;
    st.height = Math.max(0, elViewport.clientHeight - padY);

    // overflow:hidden режет по padding-box вьюпорта, а не по колонке. Если
    // зазор меньше боковых полей, левый край соседней страницы видно в полосе
    // padding — поэтому зазор всегда не меньше самого широкого поля плюс запас.
    st.gap = Math.max(GAP_MIN, Math.ceil(Math.max(padL, padR)) + 8);

    elContent.style.columnWidth = st.width + 'px';
    elContent.style.columnGap   = st.gap + 'px';
    elContent.style.height      = st.height + 'px';

    // scrollWidth = pages * step - gap, поэтому делим (scrollWidth + gap):
    // при большом зазоре (широкие поля на десктопе) простое
    // round(scrollWidth / step) ошибается на страницу.
    const step = st.width + st.gap;
    st.pages = step > 0
      ? Math.max(1, Math.round((elContent.scrollWidth + st.gap) / step))
      : 1;
  }

  function colOf(el) {
    const step = st.width + st.gap;
    if (!el || step <= 0) return 0;
    return Math.floor(el.offsetLeft / step);
  }

  // Первое слово текущей страницы. Слово в колонку влезает целиком, поэтому
  // такой якорь указывает ровно на видимую страницу. Переносимые по слогам
  // слова могут быть разорваны колонкой — у них два client-прямоугольника,
  // такие пропускаем.
  function anchorFromPage() {
    const words = elContent.querySelectorAll('.bw');
    let fallback = null;
    for (let i = 0; i < words.length; i++) {
      const col = colOf(words[i]);
      if (col === st.page) {
        if (words[i].getClientRects().length === 1) return words[i];
        if (!fallback) fallback = words[i];
      }
      if (col > st.page) break;
    }
    return fallback || elContent.querySelector('.bw');
  }

  function syncAnchor() {
    const el = anchorFromPage();
    const bs = el ? el.closest('.bs') : null;
    st.anchor = bs
      ? { p: Number(bs.dataset.p), s: Number(bs.dataset.s), w: Number(el.dataset.w) || 0 }
      : { p: 0, s: 0, w: 0 };
  }

  // Ищем сохранённое слово; если его нет (позиция из старой версии, где
  // якорь был по предложению, или текст главы изменился) — берём предложение.
  function anchorEl(anchor) {
    if (!anchor) return null;
    const bs = elContent.querySelector(`.bs[data-p="${anchor.p}"][data-s="${anchor.s}"]`);
    if (!bs) return null;
    if (typeof anchor.w === 'number') {
      const bw = bs.querySelector(`.bw[data-w="${anchor.w}"]`);
      if (bw) return bw;
    }
    return bs;
  }

  function pageOfAnchor(anchor) {
    const el = anchorEl(anchor);
    if (!el) return 0;
    return Math.max(0, Math.min(st.pages - 1, colOf(el)));
  }

  function applyTransform(animate) {
    elContent.style.transition = animate ? `transform ${ANIM_MS}ms ease` : 'none';
    elContent.style.transform  = `translateX(${-st.page * (st.width + st.gap)}px)`;
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
    tipClose();   // листание и перепагинация закрывают тултип
    // Озвучку здесь НЕ останавливаем: goTo вызывает и repaginate (resize,
    // смена настроек, поздняя загрузка шрифта), а это не действие читателя —
    // чтение не должно обрываться само. Стоп висит на next/prev и загрузке главы.
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
    speakStop();   // смена главы останавливает озвучку
    st.retry = () => loadChapter(index, where);
    showLoading('Загружаем главу');

    return getJson(chapterFile(index))
      .then(ch => {
        st.chapter = ch;
        st.chIndex = index;
        renderChapter(ch);
        applySeen();
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
            where = { anchor: {
              p: startPos.p,
              s: startPos.s,
              w: typeof startPos.w === 'number' ? startPos.w : 0
            } };
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
    speakStop();   // листание читателем останавливает озвучку
    if (st.page < st.pages - 1) { goTo(st.page + 1); return; }
    if (st.chIndex < st.chTotal - 1) loadChapter(st.chIndex + 1, null);   // с первой страницы
  }

  function prev() {
    speakStop();
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

  /* ══ Настройки чтения ══ */

  function clampIdx(v, len, def) {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n < len ? n : def;
  }

  function readPrefs() {
    let raw = null;
    try {
      raw = localStorage.getItem(PREFS_KEY);
    } catch (e) {
      console.warn('[Reader] localStorage недоступен для настроек', e);
      return Object.assign({}, DEFAULT_PREFS);
    }
    if (!raw) return Object.assign({}, DEFAULT_PREFS);
    try {
      const p = JSON.parse(raw) || {};
      return {
        fs:     clampIdx(p.fs,     FS_STEPS.length,     DEFAULT_PREFS.fs),
        lh:     clampIdx(p.lh,     LH_STEPS.length,     DEFAULT_PREFS.lh),
        margin: clampIdx(p.margin, MARGIN_STEPS.length, DEFAULT_PREFS.margin),
        theme:  THEMES.indexOf(p.theme) >= 0 ? p.theme : DEFAULT_PREFS.theme,
        font:   FONTS[p.font] ? p.font : DEFAULT_PREFS.font
      };
    } catch (e) {
      console.warn('[Reader] повреждённые настройки → значения по умолчанию', e);
      return Object.assign({}, DEFAULT_PREFS);
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(st.prefs));
    } catch (e) {
      console.warn('[Reader] не удалось сохранить настройки', e);
    }
  }

  // Только CSS-переменные и data-rd-theme на .rd-view: тема ридера живёт
  // в своём слое --rd-* и с глобальной data-theme не конфликтует.
  function applyPrefs() {
    if (!elView || !st.prefs) return;
    const p = st.prefs;
    const m = MARGIN_STEPS[p.margin];
    elView.style.setProperty('--rd-fs', FS_STEPS[p.fs] + 'px');
    elView.style.setProperty('--rd-lh', String(LH_STEPS[p.lh]));
    elView.style.setProperty('--rd-font', FONTS[p.font]);
    elView.style.setProperty('--rd-pad-x', m.pad + 'px');
    elView.style.setProperty('--rd-measure', m.measure + 'px');
    elView.setAttribute('data-rd-theme', p.theme);
  }

  // После смены настройки перепагинируем с сохранением якоря сразу же:
  // measure() читает clientWidth/scrollWidth, а чтение форсирует layout
  // с новыми переменными. Через requestAnimationFrame делать нельзя —
  // в невидимой вкладке кадры не идут, и пересчёт отставал на один шаг.
  // Второй проход — когда догрузится шрифт (смена на serif и обратно).
  function afterPrefChange() {
    if (!st.open || !st.chapter) return;
    repaginate();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (st.open) repaginate(); });
    }
  }

  function setPref(key, value) {
    if (!st.prefs || !(key in st.prefs)) return;
    const next = (key === 'theme' || key === 'font') ? String(value) : Number(value);
    if (st.prefs[key] === next) return;
    st.prefs[key] = next;
    savePrefs();
    applyPrefs();
    markSheet();
    afterPrefChange();
  }

  /* ── Шторка настроек ── */

  function buildSheet() {
    if (!elSheetBody) return;
    elSheetBody.innerHTML = SHEET_ROWS.map(row => `
      <div class="rd-row">
        <div class="rd-row-label">${esc(row.label)}</div>
        <div class="rd-seg" role="group" aria-label="${esc(row.label)}">
          ${row.opts.map(o => `<button type="button" class="${esc(o.cls || '')}"
            data-pref="${esc(row.key)}" data-value="${esc(o.v)}"
            aria-pressed="${String(st.prefs[row.key]) === String(o.v)}"
            >${esc(o.text)}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  function markSheet() {
    if (!elSheetBody) return;
    elSheetBody.querySelectorAll('button[data-pref]').forEach(btn => {
      const same = String(st.prefs[btn.dataset.pref]) === String(btn.dataset.value);
      btn.setAttribute('aria-pressed', same ? 'true' : 'false');
    });
  }

  function openSheet() {
    if (!elSheet) return;
    tipClose();
    speakStop();
    buildSheet();
    st.sheet = true;
    elSheet.classList.add('show');
    elSheetBack.classList.add('show');
  }

  function closeSheet() {
    if (!elSheet) return;
    st.sheet = false;
    elSheet.classList.remove('show');
    elSheetBack.classList.remove('show');
  }

  /* ── Тултип перевода (js/reader-tip.js) ── */

  // Перевод предложения лежит в уже загруженной главе, в DOM его не дублируем
  function sentenceRuOf(bs) {
    if (!bs || !st.chapter || !Array.isArray(st.chapter.paragraphs)) return '';
    const para = st.chapter.paragraphs[Number(bs.dataset.p)];
    const sent = para && Array.isArray(para.s) ? para.s[Number(bs.dataset.s)] : null;
    return (sent && sent.ru) || '';
  }

  function tipOpen(el) {
    if (typeof ReaderTip === 'undefined') return;
    const bs = el.closest('.bs');
    const opened = ReaderTip.open(el, {
      gloss: st.gloss,
      theme: st.prefs ? st.prefs.theme : 'system',
      sentenceRu: sentenceRuOf(bs),
      bs: bs,
      onAct: tipAct
    });
    // Тап, который тултип закрыл, «не знаю» не значит — n не растёт
    if (opened) collectWord(el);
  }

  /* ── Сборник слов: тап = «не знаю» ── */

  // Слова без словарной записи («нет в словаре») в сборник не идут.
  function collectWord(el) {
    if (typeof ReaderWords === 'undefined' || typeof ReaderTip === 'undefined') return;

    const token = el.dataset.t || String(el.textContent).toLowerCase();
    const info  = ReaderTip.lookup(st.gloss, token);
    if (!info || !info.entry) return;

    const bs = el.closest('.bs');
    const rec = ReaderWords.add(info, {
      form: el.textContent,
      ch:   (st.chapter && st.chapter.id) || '',
      p:    bs ? Number(bs.dataset.p) : -1
    });
    if (!rec) return;

    // Подсвечиваем сразу все формы этой леммы в главе, не только нажатую
    markLemma(info.lemma);
  }

  /* ── Подсветка собранных слов ── */

  // Форма → лемма через тот же glossary.w, что и тултип
  function lemmaOf(el) {
    if (typeof ReaderTip === 'undefined') return '';
    const info = ReaderTip.lookup(st.gloss, el.dataset.t || String(el.textContent).toLowerCase());
    return (info && info.lemma) || '';
  }

  // Пробегаем главу целиком: вызывается после рендера главы.
  // text-decoration метрики не меняет, поэтому порядок с measure() не важен.
  function applySeen() {
    if (typeof ReaderWords === 'undefined' || !elContent) return;
    elContent.querySelectorAll('.bw').forEach(el => {
      const lemma = lemmaOf(el);
      el.classList.toggle('bw--seen', !!lemma && ReaderWords.isMarked(lemma));
    });
  }

  function markLemma(lemma) {
    if (!lemma || typeof ReaderWords === 'undefined' || !elContent) return;
    const on = ReaderWords.isMarked(lemma);
    elContent.querySelectorAll('.bw').forEach(el => {
      if (lemmaOf(el) === lemma) el.classList.toggle('bw--seen', on);
    });
  }

  function tipClose() {
    if (typeof ReaderTip !== 'undefined') ReaderTip.close();
  }

  function tipIsOpen() {
    return typeof ReaderTip !== 'undefined' && ReaderTip.isOpen();
  }

  /* ── Озвучка (js/reader-speak.js) ── */

  function speakReady() { return typeof ReaderSpeak !== 'undefined'; }

  function speakStop() {
    if (speakReady()) ReaderSpeak.stop();
  }

  function sentenceDeOf(bs) {
    if (!bs || !st.chapter || !Array.isArray(st.chapter.paragraphs)) return '';
    const para = st.chapter.paragraphs[Number(bs.dataset.p)];
    const sent = para && Array.isArray(para.s) ? para.s[Number(bs.dataset.s)] : null;
    return (sent && sent.de) || '';
  }

  function setPlayingSentence(el) {
    if (!elContent) return;
    elContent.querySelectorAll('.bs--playing').forEach(n => n.classList.remove('bs--playing'));
    if (el) el.classList.add('bs--playing');
  }

  function setSpeakBtn(on) {
    const btn = document.getElementById('rdSpeakBtn');
    if (!btn) return;
    btn.classList.toggle('is-playing', !!on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function tipSpeaking(kind) {
    if (typeof ReaderTip !== 'undefined') ReaderTip.setSpeaking(kind);
  }

  // Кнопки в тултипе: 🔊 слова и 🔊 раскрытого перевода
  function tipAct(act, ctx) {
    if (!speakReady()) return;

    if (act === 'speak-word') {
      if (ReaderSpeak.isPlaying('word')) { ReaderSpeak.stop(); return; }
      // озвучиваем словоформу как в тексте, не лемму
      ReaderSpeak.word(ctx.word, {
        onItem: () => tipSpeaking('word'),
        onDone: () => tipSpeaking(null)
      });
      return;
    }

    if (act === 'speak-sentence') {
      if (ReaderSpeak.isPlaying('sentence')) { ReaderSpeak.stop(); return; }
      const text = sentenceDeOf(ctx.bs);
      if (!text) return;
      ReaderSpeak.sentence(text, {
        onItem: () => { tipSpeaking('sentence'); setPlayingSentence(ctx.bs); },
        onDone: () => { tipSpeaking(null); setPlayingSentence(null); }
      });
    }
  }

  // Предложения текущей страницы: те, что на ней начинаются
  function pageSentences() {
    const out = [];
    if (!elContent || !st.chapter) return out;
    elContent.querySelectorAll('.bs').forEach(bs => {
      const first = bs.querySelector('.bw') || bs;
      if (colOf(first) !== st.page) return;
      const text = sentenceDeOf(bs);
      if (text) out.push({ el: bs, text: text });
    });
    return out;
  }

  // Дочитала страницу — остановилась: сама не листает
  function speakPage() {
    if (!speakReady()) return;
    if (ReaderSpeak.isPlaying('page')) { ReaderSpeak.stop(); return; }

    const items = pageSentences();
    if (!items.length) return;

    const started = ReaderSpeak.page(items, {
      onItem: it => setPlayingSentence(it.el),
      onDone: () => { setPlayingSentence(null); setSpeakBtn(false); }
    });
    setSpeakBtn(started);
  }

  /* ── Панели: скрыть / показать ── */

  // Только класс на .rd-view → opacity/transform/pointer-events. Размеры
  // .rd-viewport не меняются, поэтому перепагинации здесь нет и быть не должно.
  function toggleChrome(force) {
    const hide = (force === undefined) ? !st.chromeHidden : !!force;
    st.chromeHidden = hide;
    elView.classList.toggle('rd-chrome-hidden', hide);
  }

  /* ══ Жесты ══ */

  let gesture = null;

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!e.isPrimary) { gesture = null; return; }   // второй палец — отменяем жест
    gesture = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId };
  }

  function onPointerUp(e) {
    const g = gesture;
    gesture = null;
    if (!g || e.pointerId !== g.id || st.sheet) return;

    // кнопки поверх текста (состояние загрузки/ошибки) — это не жест
    if (e.target.closest && e.target.closest('button, a, .rd-state')) return;

    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    // свайп: горизонтальный, быстрый и достаточно длинный
    if (adx > SWIPE_MIN && adx > ady && (Date.now() - g.t) < SWIPE_MS) {
      if (dx < 0) next(); else prev();
      return;
    }
    if (ady > adx && ady > SWIPE_MIN) return;        // вертикальный свайп — игнор
    if (adx > TAP_SLOP || ady > TAP_SLOP) return;    // перетаскивание, не тап

    const r = elViewport.getBoundingClientRect();
    const rel = r.width > 0 ? (e.clientX - r.left) / r.width : 0.5;
    const word = e.target.closest && e.target.closest('.bw');

    // Слово забирает тап в любой зоне: страница не листается и панели
    // не переключаются — открывается тултип перевода.
    if (word) { tipOpen(word); return; }

    // Открытый тултип гасится первым тапом вне него, и этот тап больше
    // ничего не делает: иначе закрытие заодно листало бы страницу.
    if (tipIsOpen()) { tipClose(); return; }

    if (rel < EDGE)          prev();
    else if (rel > 1 - EDGE) next();
    else                     toggleChrome();
  }

  function onPointerCancel() { gesture = null; }

  /* ── Открыть / закрыть ── */

  function open(id) {
    if (!elView || !id) return;

    st.open = true;
    elLib.hidden  = true;
    elView.hidden = false;
    document.body.classList.add('rd-open');

    // Настройки применяем до первой пагинации, иначе страницы посчитаются
    // по дефолтной типографике и тут же пересчитаются заново
    st.prefs = readPrefs();
    applyPrefs();
    toggleChrome(false);

    // Сборник слов книги: нужен до рендера главы, чтобы подсветка встала сразу
    if (typeof ReaderWords !== 'undefined') ReaderWords.load(id);

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
    closeSheet();
    tipClose();
    speakStop();
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
    elSheet     = document.getElementById('rdSheet');
    elSheetBack = document.getElementById('rdSheetBack');
    elSheetBody = document.getElementById('rdSheetBody');
    if (!elView || !elViewport || !elContent) return;

    document.getElementById('rdBack')?.addEventListener('click', () => close());
    // Кнопки листания оставлены специально: на десктопе мышью так удобнее
    elPrev.addEventListener('click', prev);
    elNext.addEventListener('click', next);

    document.getElementById('rdPrefsBtn')?.addEventListener('click', openSheet);
    document.getElementById('rdSpeakBtn')?.addEventListener('click', speakPage);
    document.getElementById('rdSheetClose')?.addEventListener('click', closeSheet);
    elSheetBack?.addEventListener('click', closeSheet);
    elSheetBody?.addEventListener('click', e => {
      const btn = e.target.closest('button[data-pref]');
      if (btn) setPref(btn.dataset.pref, btn.dataset.value);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && st.sheet) closeSheet();
    });

    // Жесты: делегирование на контейнер, capture-фаза, только pointer-события
    // (touch + click дали бы двойное срабатывание)
    elViewport.addEventListener('pointerdown', onPointerDown, true);
    elViewport.addEventListener('pointerup', onPointerUp, true);
    elViewport.addEventListener('pointercancel', onPointerCancel, true);

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('popstate', e => {
      const isReader = e.state && e.state.view === 'reader';
      if (st.open && !isReader) close(true);
    });
  }

  return {
    init, open, close, next, prev, goTo, repaginate,
    setPref, openSheet, closeSheet, toggleChrome,
    applySeen, markLemma, speakPage, pageSentences, state: st
  };
})();

document.addEventListener('DOMContentLoaded', () => Reader.init());
