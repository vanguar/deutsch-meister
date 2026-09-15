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
   Озвучка (слово, предложение, «дальше») — js/reader-speak.js, очередь
   чанков идёт по onEnd из js/tts.js. «Дальше» читает подряд от текущей
   страницы до конца главы и сама листает. Предложение, разорванное между
   страницами, РЕЖЕТСЯ по границе колонок (sentenceParts) и читается
   частями: перед каждой частью ридер уходит на её страницу, поэтому
   звучит только то, что видно. Листает при этом goTo, а не next():
   next() — жест читателя и обязан обрывать чтение, а goTo перепагинации
   не вызывает.

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
  // 'system' наследует глобальную data-theme, остальные три жёстко задают
  // свой набор --rd-* в css/reader.css. Порядок важен только для сетки 2×2
  // в шторке; сохранённое старое значение ('system' / 'sepia' / 'dark')
  // остаётся валидным, поэтому dm_reader_prefs из прошлых версий не ломается.
  const THEMES = ['system', 'sepia', 'light', 'dark'];
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
    { key: 'theme',  label: 'Тема страницы', segCls: 'rd-seg--grid',
      opts: [{ v: 'system', text: 'Как в приложении' }, { v: 'sepia', text: 'Сепия' },
             { v: 'light',  text: 'Светлая' },          { v: 'dark',  text: 'Тёмная' }] },
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
    chapters: [],    // ВСЕ главы книги: нужны для сквозной нумерации страниц
    chapter: null,   // данные текущей главы
    chIndex: 0,      // 0-based
    chTotal: 0,
    page:    0,
    pages:   1,      // страниц в текущей главе
    chPages: [],     // страниц в каждой главе при текущей геометрии
    bookPages: 0,    // страниц во всей книге
    pagesKey: null,  // подпись геометрии, под которую посчитан chPages
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
      elSheet, elSheetBack, elSheetBody,
      elSpeakBar, elSpeakBarText, elCardsBtn, elCardsN;

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
    // Когда страницы книги посчитаны — процент по ним, он честнее оценки
    // «глава из четырёх». Фолбэк оставлен на случай, если пересчёт ещё не
    // прошёл (первый кадр после открытия).
    const read    = (st.page + 1) / Math.max(1, st.pages);
    const percent = st.bookPages > 0
      ? Math.max(0, Math.min(100, (bookPage() / st.bookPages) * 100))
      : Math.max(0, Math.min(100, ((st.chIndex + read) / st.chTotal) * 100));
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

  function chapterHtml(ch) {
    const paras = Array.isArray(ch && ch.paragraphs) ? ch.paragraphs : [];
    return paras.map((para, p) => {
      const sents = Array.isArray(para.s) ? para.s : [];
      const inner = sents.map((sent, s) => renderSentence(sent.de || '', p, s)).join(' ');
      return `<p class="rd-p">${inner}</p>`;
    }).join('');
  }

  function renderChapter(ch) {
    elContent.innerHTML = chapterHtml(ch);
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

  /* ── Сквозная нумерация страниц книги ── */

  // Счётчик «стр. N / M» считал страницы ТЕКУЩЕЙ ГЛАВЫ, и на каждой новой
  // главе знаменатель менялся: 1/2 → 1/4 → 1/3. Смена главы в счётчике
  // ничем не отмечена, поэтому со стороны это выглядит поломкой. Теперь
  // номер сквозной по всей книге.
  //
  // Цена: страницы считает CSS-вёрстка по ОТРЕНДЕРЕННОЙ главе, значит
  // «сколько всего» можно узнать, только отрисовав каждую. Поэтому главы
  // грузятся целиком при открытии книги (они маленькие, и это заодно
  // убирает задержку при переходе между главами), а считаются в скрытом
  // пробнике с той же геометрией колонок, что и у настоящего .rd-content.
  let elProbe = null;

  function probeEl() {
    if (elProbe) return elProbe;
    elProbe = document.createElement('div');
    elProbe.className = 'rd-content';
    elProbe.lang = 'de';
    elProbe.setAttribute('aria-hidden', 'true');
    // position: absolute — пробник не должен влиять на раскладку вьюпорта;
    // никаких transform и transition, иначе замер поедет за анимацией
    elProbe.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;'
      + 'pointer-events:none;transform:none;transition:none';
    elViewport.appendChild(elProbe);
    return elProbe;
  }

  // Та же формула, что в measure(): scrollWidth = pages * step - gap
  function pagesOfHtml(html) {
    const step = st.width + st.gap;
    if (step <= 0) return 1;
    const probe = probeEl();
    probe.style.width       = st.width + 'px';
    probe.style.height      = st.height + 'px';
    probe.style.columnWidth = st.width + 'px';
    probe.style.columnGap   = st.gap + 'px';
    probe.innerHTML = html;
    const pages = Math.max(1, Math.round((probe.scrollWidth + st.gap) / step));
    probe.innerHTML = '';   // держать в DOM текст всей книги незачем
    return pages;
  }

  // Всё, от чего зависит разбивка на страницы. Совпала подпись — пересчитывать
  // остальные главы не нужно, хватит обновить текущую.
  function geometryKey() {
    const p = st.prefs || {};
    return [st.width, st.height, st.gap, p.fs, p.lh, p.margin, p.font].join('|');
  }

  // force: после repaginate() пересчитываем всегда. Геометрия могла остаться
  // прежней, а разбивка измениться — например, когда доехали шрифты Google
  // Fonts (document.fonts.ready) и строки стали другой ширины.
  function measureBook(force) {
    if (!st.chapters.length) { st.bookPages = st.pages; return; }
    const key = geometryKey();
    if (!force && st.pagesKey === key && st.chPages.length === st.chapters.length) {
      st.chPages[st.chIndex] = st.pages;
    } else {
      st.chPages = st.chapters.map((ch, i) =>
        i === st.chIndex ? st.pages : pagesOfHtml(chapterHtml(ch)));
      st.pagesKey = key;
    }
    st.bookPages = st.chPages.reduce((sum, n) => sum + (n || 1), 0);
  }

  function pagesBefore(index) {
    let n = 0;
    for (let i = 0; i < index; i++) n += st.chPages[i] || 1;
    return n;
  }

  // Номер текущей страницы в книге, 1-based
  function bookPage() {
    return pagesBefore(st.chIndex) + st.page + 1;
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
    const total   = st.bookPages || st.pages;
    const current = st.bookPages ? bookPage() : st.page + 1;
    elPages.textContent = `стр. ${current} / ${total}`;

    // Полоса тоже по всей книге — иначе она спорила бы со счётчиком
    const done = total > 1 ? ((current - 1) / (total - 1)) * 100 : 100;
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
  // Главы лежат в памяти с момента открытия книги, поэтому сеть тут больше
  // не нужна и переход между главами мгновенный.
  function loadChapter(index, where) {
    speakStop();   // смена главы останавливает озвучку
    st.retry = () => loadChapter(index, where);

    const ch = st.chapters[index];
    if (!ch) {
      showError(`${chapterFile(index)}: глава не загружена`);
      return;
    }

    st.chapter = ch;
    st.chIndex = index;
    renderChapter(ch);
    applySeen();
    refreshCards();   // в новой главе свой набор собранных слов
    hideState();
    measure();
    measureBook();

    // Якорь восстанавливаем только если это предложение есть в главе
    const anchor = where && where.anchor && anchorEl(where.anchor) ? where.anchor : null;
    const page = anchor          ? pageOfAnchor(anchor)
               : where && where.atEnd ? st.pages - 1
               : 0;
    goTo(page, { animate: false, anchor });

    // Шрифты Google Fonts могут приехать после первой пагинации и изменить
    // количество страниц — пересчитываем по якорю, когда они готовы.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (st.open) repaginate(); });
    }
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

        // Все главы сразу: без них не сказать, сколько страниц в книге, а
        // счётчик внутри главы врал про общий объём. Главы маленькие, и
        // переход между ними становится мгновенным.
        const files = [];
        for (let i = 0; i < st.chTotal; i++) files.push(getJson(chapterFile(i)));
        return Promise.all(files).then(chapters => {
          st.chapters = chapters;
          st.chPages  = chapters.map(() => 1);
          st.pagesKey = null;

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
        });
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
    measureBook(true);   // геометрия та же, а разбивка могла измениться
    // Без анимации и с сохранением якоря: читатель остаётся на своём предложении
    goTo(pageOfAnchor(anchor), { animate: false, keepAnchor: true });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    speakBarPlace(speakBarBs);   // вьюпорт переехал — плашка следом
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

  // Версия и аварийное обновление. Номер на виду, потому что иначе
  // «у меня старая версия» невозможно ни подтвердить, ни опровергнуть —
  // ровно на этом мы и застряли, когда телефон месяц держал старый
  // воркер. Кнопка снимает регистрации и сносит кеши: «очистить кэш»
  // в браузере этого не делает.
  function sheetFooterHtml() {
    const label = (typeof dmAppVersionLabel === 'function')
      ? dmAppVersionLabel() : 'версия неизвестна';
    return `
      <div class="rd-row rd-row--app">
        <div class="rd-app-ver" id="rdAppVer">Deutsch Meister · ${esc(label)}</div>
        <button type="button" class="rd-app-reset" id="rdAppReset">
          ⟳ Обновить приложение</button>
        <div class="rd-app-note">Снимет service worker и очистит кеш,
          затем перезагрузит страницу. Прогресс и собранные слова не
          затрагиваются — они в localStorage.</div>
      </div>`;
  }

  function buildSheet() {
    if (!elSheetBody) return;
    elSheetBody.innerHTML = SHEET_ROWS.map(row => `
      <div class="rd-row">
        <div class="rd-row-label">${esc(row.label)}</div>
        <div class="rd-seg ${esc(row.segCls || '')}" role="group" aria-label="${esc(row.label)}">
          ${row.opts.map(o => `<button type="button" class="${esc(o.cls || '')}"
            data-pref="${esc(row.key)}" data-value="${esc(o.v)}"
            aria-pressed="${String(st.prefs[row.key]) === String(o.v)}"
            >${esc(o.text)}</button>`).join('')}
        </div>
      </div>`).join('') + sheetFooterHtml();
  }

  function appReset() {
    const btn = document.getElementById('rdAppReset');
    if (btn) { btn.disabled = true; btn.textContent = '⟳ Обновляем…'; }
    if (typeof dmHardReset === 'function') { dmHardReset(); return; }
    location.reload();
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

    // Подсвечиваем сразу все формы этой леммы в главе, не только нажатую.
    // Счётчик карточек markLemma пересчитает сам.
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

  // Смена пометки у леммы всегда меняет и набор активных слов главы,
  // поэтому счётчик на кнопке карточек пересчитываем здесь же: иначе он
  // отставал бы на всю сессию карточек, где «Знаю» идёт одно за другим.
  function markLemma(lemma) {
    if (!lemma || typeof ReaderWords === 'undefined' || !elContent) return;
    const on = ReaderWords.isMarked(lemma);
    elContent.querySelectorAll('.bw').forEach(el => {
      if (lemmaOf(el) === lemma) el.classList.toggle('bw--seen', on);
    });
    refreshCards();
  }

  function tipClose() {
    if (typeof ReaderTip !== 'undefined') ReaderTip.close();
  }

  function tipIsOpen() {
    return typeof ReaderTip !== 'undefined' && ReaderTip.isOpen();
  }

  /* ── Озвучка (js/reader-speak.js) ── */

  function speakReady() { return typeof ReaderSpeak !== 'undefined'; }

  // Плашку гасим и здесь: если очереди не было, onDone не придёт
  function speakStop() {
    if (speakReady()) ReaderSpeak.stop();
    speakBarHide();
    setPlayingPart(null);
    tipRestore();
  }

  function tipCollapse() {
    if (typeof ReaderTip !== 'undefined') ReaderTip.collapse();
  }

  // Возвращает тултип только если сворачивали мы: если за время озвучки
  // читатель открыл другое слово, close() внутри open() уже снял флаг
  // и restore() молча ничего не делает.
  function tipRestore() {
    if (typeof ReaderTip !== 'undefined') ReaderTip.restore();
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

  // Поверх .bs--playing (оно красит предложение целиком) отмечаем ту его
  // часть, что звучит сейчас: иначе на разорванном предложении подсвечено
  // всё видимое, а читается только половина. Ставится лишь когда частей
  // больше одной. Только цвет и фон, как у всех подсветок ридера, —
  // метрики строки не меняются, пагинация поехать не может.
  function setPlayingPart(bs, page) {
    if (!elContent) return;
    elContent.querySelectorAll('.bw--speaking').forEach(n => n.classList.remove('bw--speaking'));
    if (!bs) return;
    bs.querySelectorAll('.bw').forEach(w => {
      if (colOf(w) === page) w.classList.add('bw--speaking');
    });
  }

  /* ── Плашка озвучки (задача: тултип не закрывает читаемый текст) ── */

  // Индикатор: первые слова предложения. Длинный текст плашку не растит —
  // строка одна, хвост режется многоточием (см. .rd-speakbar-text).
  function speakBarLabel(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '…' : '');
  }

  // Пришпиливаем к тому краю .rd-viewport, который дальше от подсвеченного
  // предложения: так .bs--playing остаётся целиком на виду. position: fixed
  // поверх, как панели в 2C, — размеры вьюпорта не меняются, значит
  // перепагинация отсюда невозможна.
  function speakBarPlace(bs) {
    if (!elSpeakBar || elSpeakBar.hidden || !elViewport) return;
    const vp = elViewport.getBoundingClientRect();
    const h  = elSpeakBar.offsetHeight || 36;

    let atTop = true;
    if (bs) {
      const r = bs.getBoundingClientRect();
      atTop = (r.top - vp.top) >= (vp.bottom - r.bottom);
    }
    elSpeakBar.classList.toggle('rd-speakbar--top', atTop);
    elSpeakBar.classList.toggle('rd-speakbar--bottom', !atTop);
    elSpeakBar.style.top = Math.round(atTop ? vp.top : vp.bottom - h) + 'px';
  }

  let speakBarBs = null;   // предложение, под которое посчитан край

  function speakBarShow(text, bs) {
    if (!elSpeakBar) return;
    if (elSpeakBarText) elSpeakBarText.textContent = speakBarLabel(text);
    speakBarBs = bs || null;
    elSpeakBar.hidden = false;   // высоту меряем уже показанной
    speakBarPlace(speakBarBs);
  }

  function speakBarHide() {
    if (!elSpeakBar) return;
    speakBarBs = null;
    elSpeakBar.hidden = true;
    if (elSpeakBarText) elSpeakBarText.textContent = '';
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
      // Предложение звучит долго — тултип уходит в плашку, чтобы читатель
      // видел подсвеченный текст. Слово короткое, там сворачивать нечего.
      ReaderSpeak.sentence(text, {
        onItem: () => {
          tipSpeaking('sentence');
          setPlayingSentence(ctx.bs);
          tipCollapse();
          speakBarShow(text, ctx.bs);
        },
        onDone: () => {
          tipSpeaking(null);
          setPlayingSentence(null);
          speakBarHide();
          tipRestore();
        }
      });
    }
  }

  function clampPage(page) {
    return Math.max(0, Math.min(st.pages - 1, page));
  }

  // Разбивка предложения по границам страниц.
  //
  // Длинное предложение колонка рвёт между страницами. Читать его целиком,
  // стоя на одной из них, нельзя ни при каком выборе страницы: вторая
  // часть всё равно останется невидимой — «страница с большей частью»
  // проблему не решает, а только уменьшает. Поэтому режем сам ТЕКСТ по
  // границе колонок и читаем части подряд, переходя на страницу каждой.
  //
  // Смещения берём из DOM: .bs отрисован из того же sent.de, поэтому
  // bs.textContent совпадает с ним символ в символ, и склейка частей даёт
  // исходную строку. Если вдруг не совпало — отдаём одну часть целиком:
  // лучше прежнее поведение, чем потерянный кусок текста.
  function sentenceParts(bs) {
    const text = sentenceDeOf(bs);
    if (!bs || !text) return [];

    const whole = [{ page: clampPage(colOf(bs)), text: text }];
    if (bs.textContent !== text) return whole;

    // Колонка слова — по его началу (colOf → offsetLeft). Слово,
    // перенесённое по слогам через границу колонки, целиком уходит в ту,
    // где начинается: рвать слово нельзя.
    const words = [];
    let offset = 0;
    Array.prototype.forEach.call(bs.childNodes, node => {
      const len = (node.textContent || '').length;
      if (node.nodeType === 1 && node.classList && node.classList.contains('bw')) {
        words.push({ start: offset, col: colOf(node) });
      }
      offset += len;
    });
    if (!words.length) return whole;

    // Рез — ровно перед первым словом новой колонки. Всё, что между
    // словами (пробел и знаки препинания), остаётся с предыдущей частью,
    // а слово не рвётся никогда.
    const parts = [];
    let from = 0;
    let col  = words[0].col;
    for (let i = 1; i < words.length; i++) {
      if (words[i].col === col) continue;
      parts.push({ page: clampPage(col), text: text.slice(from, words[i].start) });
      from = words[i].start;
      col  = words[i].col;
    }
    parts.push({ page: clampPage(col), text: text.slice(from) });
    return parts;
  }

  // Очередь чтения: от первого предложения, начинающегося на странице
  // page, и до конца главы. Следующую главу не берём — по её концу
  // озвучка останавливается.
  function sentencesFrom(page) {
    const out = [];
    if (!elContent || !st.chapter) return out;

    const all = Array.from(elContent.querySelectorAll('.bs'));
    let start = all.findIndex(bs => colOf(bs.querySelector('.bw') || bs) >= page);
    if (start < 0) start = 0;

    all.slice(start).forEach(bs => {
      const text = sentenceDeOf(bs);
      if (text) out.push({ el: bs, text: text });
    });
    return out;
  }

  // Кнопка «🔊 дальше»: читает подряд от текущей страницы и сама листает,
  // чтобы звучащее предложение всегда было на экране. Листаем через goTo,
  // а не через next(): next() — действие читателя и обязан обрывать
  // озвучку. goTo перепагинацию не запускает (DOM тот же) и заново выводит
  // якорь из новой страницы, поэтому позиция едет вместе с чтением.
  function speakOn() {
    if (!speakReady()) return;
    if (ReaderSpeak.isPlaying('page')) { ReaderSpeak.stop(); return; }

    // Очередь идёт ЧАСТЯМИ, а не предложениями: предложение на одной
    // странице даёт одну часть, разорванное — по части на страницу.
    // Внутри части работает прежний chunkForTts с лимитом прокси.
    const items = [];
    sentencesFrom(st.page).forEach(it => {
      const parts = sentenceParts(it.el);
      parts.forEach(part => {
        if (!part.text) return;
        items.push({ el: it.el, text: part.text, page: part.page,
                     split: parts.length > 1 });
      });
    });
    if (!items.length) return;

    // Читаем подряд — подсказка по одному слову тут уже не нужна:
    // тултип закрывается совсем, от него остаётся только плашка со «стоп».
    tipClose();

    const started = ReaderSpeak.page(items, {
      onItem: it => {
        // Пауза на стыке страниц совпадает с перелистыванием — так и надо
        if (it.page !== st.page) goTo(it.page);
        setPlayingSentence(it.el);
        setPlayingPart(it.split ? it.el : null, it.page);
        speakBarShow(it.text, it.el);
      },
      onDone: () => {
        setPlayingSentence(null);
        setPlayingPart(null);
        setSpeakBtn(false);
        speakBarHide();
      }
    });
    setSpeakBtn(started);
    if (!started) speakBarHide();
  }

  /* ── Карточки главы и словарь книги ── */

  // Область — ГЛАВА, не страница. На 360×640 глава занимает две страницы,
  // а на десктопе умещается в одну («стр. 1 / 1»), и привязка к странице
  // означала бы на каждом устройстве своё: то три слова, то вся глава.
  // Глава от ширины экрана не зависит и совпадает с тем, что читатель
  // видит подсвеченным в тексте.
  function chapterLemmas() {
    const out = [];
    if (!elContent || typeof ReaderWords === 'undefined') return out;
    const seen = Object.create(null);
    elContent.querySelectorAll('.bw').forEach(el => {
      const lemma = lemmaOf(el);
      if (!lemma || seen[lemma]) return;
      if (!ReaderWords.isMarked(lemma)) return;   // «знаю» из активных уходит
      seen[lemma] = true;
      out.push(lemma);
    });
    return out;
  }

  function chapterRecords() {
    if (typeof ReaderWords === 'undefined') return [];
    return chapterLemmas().map(l => ReaderWords.get(l)).filter(Boolean);
  }

  // Счётчик на кнопке: 0 — кнопка неактивна, тапать нечего
  function refreshCards() {
    if (!elCardsBtn) return;
    const n = chapterLemmas().length;
    if (elCardsN) elCardsN.textContent = '(' + n + ')';
    elCardsBtn.disabled = n === 0;
  }

  function openCards() {
    if (typeof ReaderCards === 'undefined') return;
    const records = chapterRecords();
    if (!records.length) return;

    tipClose();
    speakStop();
    ReaderCards.open({
      records: records,
      subtitle: (st.chapter && st.chapter.title) || '',
      theme: themeName(),
      // Ридер под оверлеем живой: перепагинации не было, поэтому
      // возвращаться некуда — просто обновляем счётчик и подсветку.
      onClose: () => { applySeen(); refreshCards(); }
    });
  }

  function openDict() {
    if (typeof ReaderDict === 'undefined') return;
    tipClose();
    speakStop();
    ReaderDict.open({
      bookId: st.bookId,
      title:  (st.meta && st.meta.title) || '',
      theme:  themeName(),
      onClose: () => { applySeen(); refreshCards(); }
    });
  }

  function themeName() {
    return (st.prefs && st.prefs.theme) || readPrefs().theme;
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
    st.chapters = [];
    st.chPages = [];
    st.bookPages = 0;
    st.pagesKey = null;
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
    elCardsBtn     = document.getElementById('rdCardsBtn');
    elCardsN       = document.getElementById('rdCardsN');
    elSpeakBar     = document.getElementById('rdSpeakBar');
    elSpeakBarText = document.getElementById('rdSpeakBarText');
    elSheet     = document.getElementById('rdSheet');
    elSheetBack = document.getElementById('rdSheetBack');
    elSheetBody = document.getElementById('rdSheetBody');
    if (!elView || !elViewport || !elContent) return;

    document.getElementById('rdBack')?.addEventListener('click', () => close());
    // Кнопки листания оставлены специально: на десктопе мышью так удобнее
    elPrev.addEventListener('click', prev);
    elNext.addEventListener('click', next);

    document.getElementById('rdPrefsBtn')?.addEventListener('click', openSheet);
    document.getElementById('rdSpeakBtn')?.addEventListener('click', speakOn);
    document.getElementById('rdSpeakStop')?.addEventListener('click', speakStop);
    elCardsBtn?.addEventListener('click', openCards);
    document.getElementById('rdDictBtn')?.addEventListener('click', openDict);
    document.getElementById('rdSheetClose')?.addEventListener('click', closeSheet);
    elSheetBack?.addEventListener('click', closeSheet);
    elSheetBody?.addEventListener('click', e => {
      const btn = e.target.closest('button[data-pref]');
      if (btn) { setPref(btn.dataset.pref, btn.dataset.value); return; }
      if (e.target.closest('#rdAppReset')) appReset();
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
    applySeen, markLemma, speakOn, sentencesFrom, sentenceParts, state: st,
    refreshCards, openCards, openDict, theme: themeName
  };
})();

document.addEventListener('DOMContentLoaded', () => Reader.init());
