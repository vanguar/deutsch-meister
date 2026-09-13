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

   Zero dependencies. Кнопки 🔊 и «Предложение» — этапы 4 и 3C,
   под них оставлен пустой .word-tip-actions.
   ═══════════════════════════════════════════════ */

const ReaderTip = (() => {

  const PAD = 10;   // отступ от краёв экрана
  const GAP = 12;   // зазор между словом и тултипом

  let elTip  = null;   // единственный узел тултипа
  let target = null;   // текущее слово .bw
  let bound  = false;

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

  function render(word, info) {
    const parts = [];

    if (!info || !info.entry) {
      parts.push(`<span class="word-tip-title">${esc(word)}</span>`);
      parts.push('<span class="word-tip-meta">нет в словаре</span>');
      parts.push('<span class="word-tip-actions"></span>');
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

    // Место под 🔊 (этап 4) и «Предложение» (этап 3C): пустой блок схлопнут
    parts.push('<span class="word-tip-actions"></span>');
    return parts.join('');
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
  function open(el, opts) {
    if (!el) return;
    const o = opts || {};

    // повторный тап по тому же слову закрывает
    if (target === el) { close(); return; }

    const tip = ensureTip();
    bind();
    close();

    target = el;
    tip.innerHTML = render(el.textContent, lookup(o.gloss, el.dataset.t || String(el.textContent).toLowerCase()));
    tip.dataset.rdTheme = o.theme || 'system';
    el.classList.add('word-tip-open');

    position(el);
    tip.classList.add('word-tip-visible');
    // второй проход: после показа размеры уже окончательные
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (target === el) position(el); });
    }
  }

  function close() {
    if (target) target.classList.remove('word-tip-open');
    target = null;
    if (elTip) elTip.classList.remove('word-tip-visible');
  }

  function isOpen() { return !!target; }

  return { open, close, isOpen, position, lookup, render };
})();
