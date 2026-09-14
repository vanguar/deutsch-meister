/* ═══════════════════════════════════════════════
   reader-tip.js — тултип перевода по тапу на слово в ридере
   Deutsch Meister Course

   Один тултип на документ, портал в body, содержимое рендерится
   лениво при открытии. Внутри .bw никакого HTML не появляется.

   Позиционирование повторяет движок уроков (js/lesson-render.js:
   mountWordTip / positionWordTip / openWordTip): visualViewport,
   флип сверху/снизу, клампинг по краям экрана, стрелка через
   --word-tip-arrow-left. Сам lesson-render.js не используется и
   не трогается — у уроков свой инстанс на hover, у ридера свой на тап.

   Вид — класс .word-tip из css/lesson.css + модификатор
   .word-tip--book в css/reader.css.

   Перевод предложения раскрывается внутри тултипа (кнопка
   «Предложение» в .word-tip-actions), без отдельного окна. Раскрытие
   меняет высоту, поэтому позиция пересчитывается тем же клампингом.

   Кнопки 🔊 (слово и предложение) сам тултип не озвучивает: он
   сообщает о нажатии через opts.onAct, а озвучку делает ридер
   (js/reader.js + js/reader-speak.js). Состояние «играет» ставится
   снаружи через setSpeaking().

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderTip = (() => {

  const PAD = 10;   // отступ от краёв экрана
  const GAP = 12;   // зазор между словом и тултипом

  let elTip  = null;   // единственный узел тултипа
  let target = null;   // текущее слово .bw
  let bound  = false;

  // Перевод предложения: раскрытое состояние живёт только до следующего
  // слова — новое слово всегда открывается свёрнутым.
  let sentenceRu = '';
  let sentenceEl = null;   // .bs, которое подсвечиваем на время раскрытия
  let expanded   = false;
  let actCb      = null;   // колбэк ридера на кнопки тултипа

  // Свёрнут на время озвучки: узел спрятан, но состояние живо и restore()
  // возвращает тултип ровно таким, каким он был (в том числе раскрытым).
  let collapsed  = false;

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureTip() {
    if (elTip) return elTip;
    elTip = document.createElement('div');
    elTip.className = 'word-tip word-tip--book';
    // Кнопки внутри тултипа переживают перерисовку содержимого, поэтому
    // слушатель делегированный и навешивается один раз
    elTip.addEventListener('click', e => {
      const btn = e.target.closest && e.target.closest('[data-act]');
      if (!btn) return;
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'sentence') { toggleSentence(); return; }
      if (typeof actCb === 'function') {
        actCb(act, {
          word: target ? target.textContent : '',
          bs:   sentenceEl
        });
      }
    });
    document.body.appendChild(elTip);
    return elTip;
  }

  /* ── Глоссарий ── */

  // glossary.w: значение — либо строка-лемма, либо { l, old }.
  // Помета old со словоформы идёт наравне с old леммы.
  function lookup(gloss, token) {
    const wmap = gloss && gloss.w;
    const lmap = gloss && gloss.l;
    if (!wmap || !token) return null;

    const raw = wmap[token];
    if (raw === undefined || raw === null) return null;

    const lemma   = (typeof raw === 'string') ? raw : (raw && raw.l) || '';
    const oldForm = (raw && typeof raw === 'object' && raw.old) ? raw.old : '';
    if (!lemma) return null;

    return { lemma, oldForm, entry: (lmap && lmap[lemma]) || null };
  }

  /* ── Содержимое ── */

  function grammarLines(entry, lemma) {
    const lines = [];
    if (!entry || entry.pos === 'прозвище') return lines;   // прозвище — без грамматики

    if (entry.pos === 'сущ.') {
      const head = (entry.art ? entry.art + ' ' : '') + lemma;
      // pl: null — у слова нет множественного числа, это тоже факт
      lines.push(head + ' · ' + (entry.pl ? 'мн. ч.: ' + entry.pl : 'мн. ч. нет'));
    }
    // субст. прил. и n-Deklination живут в decl отдельной строкой
    if (entry.decl) lines.push(entry.decl);
    return lines;
  }

  // Глагол — три формы (инфинитив + две из forms), прилагательное —
  // степени сравнения, они уже лежат в forms целиком.
  function formsLine(entry, lemma) {
    if (!entry || !entry.forms || entry.pos === 'прозвище') return '';
    if (entry.pos === 'гл.') return lemma + ' · ' + entry.forms;
    return entry.forms;
  }

  // Ряд действий: 🔊 слова и «Предложение». У раскрытого перевода —
  // своя 🔊, она озвучивает предложение целиком.
  function actionsHtml(hasSentence) {
    const say = '<button type="button" class="word-tip-say" data-act="speak-word"'
      + ' title="Озвучить слово" aria-label="Озвучить слово">🔊</button>';
    if (!hasSentence) {
      return '<span class="word-tip-actions">' + say + '</span>';
    }
    return '<span class="word-tip-actions">'
      + say
      + '<button type="button" class="word-tip-act" data-act="sentence"'
      + ' aria-expanded="false">Предложение <span class="word-tip-caret">⌄</span></button>'
      + '</span>'
      + '<span class="word-tip-sentence" hidden>'
      + '<button type="button" class="word-tip-say" data-act="speak-sentence"'
      + ' title="Озвучить предложение" aria-label="Озвучить предложение">🔊</button>'
      + '<span class="word-tip-sentence-ru"></span>'
      + '</span>';
  }

  // Кнопку «играет» подсвечивает ридер: тултип сам про TTS не знает
  function setSpeaking(kind) {
    if (!elTip) return;
    elTip.querySelectorAll('[data-act^="speak-"]').forEach(b => {
      b.classList.toggle('is-playing', !!kind && b.dataset.act === 'speak-' + kind);
    });
  }

  function render(word, info, opts) {
    const parts = [];
    const hasSentence = !!(opts && opts.hasSentence);

    if (!info || !info.entry) {
      parts.push(`<span class="word-tip-title">${esc(word)}</span>`);
      parts.push('<span class="word-tip-meta">нет в словаре</span>');
      parts.push(actionsHtml(hasSentence));
      return parts.join('');
    }

    const e     = info.entry;
    const lemma = info.lemma;
    const showLemma = lemma && lemma.toLowerCase() !== String(word).toLowerCase();

    if (e.pos) parts.push(`<span class="word-tip-kicker">${esc(e.pos)}</span>`);

    parts.push(`<span class="word-tip-title">${esc(word)}`
      + (showLemma ? ` <span class="word-tip-arrowto">→</span> ${esc(lemma)}` : '')
      + '</span>');

    if (e.ru) parts.push(`<span class="word-tip-ru">${esc(e.ru)}</span>`);

    grammarLines(e, lemma).forEach(line => {
      parts.push(`<span class="word-tip-meta">${esc(line)}</span>`);
    });

    const forms = formsLine(e, lemma);
    if (forms) parts.push(`<span class="word-tip-conj">${esc(forms)}</span>`);

    // Пометы «устар.»: сначала со словоформы, потом с леммы; бывают обе
    [info.oldForm, e.old].forEach(note => {
      if (note) parts.push(`<span class="word-tip-old"><b>устар.</b> ${esc(note)}</span>`);
    });

    parts.push(actionsHtml(hasSentence));
    return parts.join('');
  }

  /* ── Перевод предложения ── */

  // Раскрытие внутри тултипа: отдельного окна нет, высота меняется, поэтому
  // в конце всегда пересчитываем позицию — тем же клампингом, что и при
  // открытии, так что на нижних строках тултип переворачивается вверх.
  function toggleSentence() {
    if (!elTip || !sentenceRu) return;
    const box   = elTip.querySelector('.word-tip-sentence');
    const ru    = elTip.querySelector('.word-tip-sentence-ru');
    const btn   = elTip.querySelector('[data-act="sentence"]');
    const caret = elTip.querySelector('.word-tip-caret');
    if (!box || !ru) return;

    expanded = !expanded;

    if (expanded) {
      ru.textContent = sentenceRu;
      box.hidden = false;
      if (sentenceEl) sentenceEl.classList.add('bs--active');
    } else {
      box.hidden = true;
      ru.textContent = '';
      if (sentenceEl) sentenceEl.classList.remove('bs--active');
    }

    if (caret) caret.textContent = expanded ? '⌃' : '⌄';
    if (btn) btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');

    if (target) position(target);
  }

  /* ── Позиционирование (логика из js/lesson-render.js) ── */

  function position(el) {
    if (!elTip || !el) return;

    elTip.classList.remove('word-tip-below');

    const viewport = window.visualViewport;
    const vLeft   = (viewport && viewport.offsetLeft) || 0;
    const vTop    = (viewport && viewport.offsetTop) || 0;
    const vWidth  = (viewport && viewport.width)  || window.innerWidth;
    const vHeight = (viewport && viewport.height) || window.innerHeight;
    const vRight  = vLeft + vWidth;
    const vBottom = vTop + vHeight;

    const rect = el.getBoundingClientRect();

    // Ширина тултипа — shrink-to-fit, то есть зависит от собственного left:
    // при большом left места справа мало и текст переносится шире. Поэтому
    // сначала ставим left в минимум (места максимум) и только тогда меряем —
    // иначе клампинг считался бы по заниженной ширине и правый край уезжал
    // за экран. offsetWidth/Height берём до transform (у скрытого scale(.98)).
    elTip.style.left = PAD + 'px';
    const tipWidth  = Math.min(elTip.offsetWidth || 240, vWidth - PAD * 2);
    const tipHeight = elTip.offsetHeight || 120;

    const center  = rect.left + rect.width / 2;
    const minLeft = vLeft + PAD;
    const maxLeft = vRight - PAD - tipWidth;
    const minTop  = vTop + PAD;
    const maxTop  = vBottom - PAD - tipHeight;

    const left = Math.max(minLeft, Math.min(center - tipWidth / 2, Math.max(minLeft, maxLeft)));

    let top = rect.top - tipHeight - GAP;
    const belowTop = rect.bottom + GAP;
    const fitsAbove = top >= minTop;
    const fitsBelow = belowTop + tipHeight <= vBottom - PAD;

    if (!fitsAbove && fitsBelow) {
      elTip.classList.add('word-tip-below');
      top = belowTop;
    } else {
      top = Math.max(minTop, Math.min(top, Math.max(minTop, maxTop)));
    }

    const arrow = Math.max(18, Math.min(center - left, tipWidth - 18));
    elTip.style.left = Math.round(left) + 'px';
    elTip.style.top  = Math.round(top) + 'px';
    elTip.style.setProperty('--word-tip-arrow-left', Math.round(arrow) + 'px');
  }

  /* ── Открыть / закрыть ── */

  function bind() {
    if (bound) return;
    bound = true;

    // Тап вне тултипа закрывает — но только за пределами области чтения.
    // Внутри .rd-viewport решение принимает жестовый слой ридера на pointerup:
    // если закрыть здесь, на pointerup ридер уже не знал бы, что тултип был
    // открыт, и заодно перелистнул бы страницу.
    // Тап по самому тултипу не закрывает: там появятся кнопки этапов 4 и 3C.
    document.addEventListener('pointerdown', e => {
      if (!target || !e.target || !e.target.closest) return;
      if (e.target.closest('.word-tip') || e.target.closest('.bw')) return;
      if (e.target.closest('.rd-viewport')) return;
      // «Стоп» на плашке озвучки обязан вернуть тултип, а не потерять его
      if (e.target.closest('.rd-speakbar')) return;
      close();
    }, true);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', close);
    window.addEventListener('orientationchange', close);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', close);
      // экранная клавиатура и зум сдвигают вьюпорт — тултип едет за словом
      window.visualViewport.addEventListener('scroll', () => { if (target) position(target); });
    }
  }

  // opts: { gloss, theme } — тема ридера, чтобы тултип в body не остался
  // в глобальной теме, когда в ридере выбрана сепия или тёмная
  // Возвращает true, если тултип открылся, и false, если тап его закрыл:
  // ридер по этому различает «спросил перевод» (n+1) и «убрал подсказку».
  function open(el, opts) {
    if (!el) return false;
    const o = opts || {};

    // повторный тап по тому же слову закрывает
    if (target === el) { close(); return false; }

    const tip = ensureTip();
    bind();
    close();

    target     = el;
    sentenceRu = o.sentenceRu || '';
    sentenceEl = o.bs || null;
    actCb      = (typeof o.onAct === 'function') ? o.onAct : null;
    expanded   = false;          // новое слово — всегда свёрнутый перевод

    tip.innerHTML = render(
      el.textContent,
      lookup(o.gloss, el.dataset.t || String(el.textContent).toLowerCase()),
      { hasSentence: !!sentenceRu }
    );
    tip.dataset.rdTheme = o.theme || 'system';
    el.classList.add('word-tip-open');

    position(el);
    tip.classList.add('word-tip-visible');
    // второй проход: после показа размеры уже окончательные
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (target === el) position(el); });
    }
    return true;
  }

  /* ── Сворачивание на время озвучки ── */

  // Прячем только узел. target, expanded, текст перевода и подсветка
  // .bs--active остаются на месте, содержимое не перерисовывается —
  // поэтому возврат ничего не теряет и не мигает новым layout'ом.
  function collapse() {
    if (!target || !elTip || collapsed) return false;
    collapsed = true;
    elTip.classList.remove('word-tip-visible');
    return true;
  }

  // Позицию считаем заново: за время озвучки читатель мог скрыть панели
  // или повернуть экран, а размеры тултипа зависят от его же left (см.
  // position()). Второй проход — после показа, как и в open().
  function restore() {
    if (!collapsed) return false;
    collapsed = false;
    if (!target || !elTip) return false;
    const el = target;
    position(el);
    elTip.classList.add('word-tip-visible');
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (target === el) position(el); });
    }
    return true;
  }

  function isCollapsed() { return collapsed; }

  function close() {
    if (target) target.classList.remove('word-tip-open');
    if (sentenceEl) sentenceEl.classList.remove('bs--active');
    target     = null;
    sentenceEl = null;
    sentenceRu = '';
    expanded   = false;
    collapsed  = false;
    if (elTip) elTip.classList.remove('word-tip-visible');
  }

  function isOpen()     { return !!target; }
  function isExpanded() { return expanded; }

  return {
    open, close, isOpen, isExpanded, toggleSentence, setSpeaking,
    collapse, restore, isCollapsed,
    position, lookup, render
  };
})();
