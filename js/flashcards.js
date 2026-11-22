/* ═══════════════════════════════════════════════
   js/flashcards.js — Vocabulary review flashcards

   Два режима, один движок.

   1. init()  — режим урока. Всё как было: колода из
      LESSON_DATA.vocabulary, XP через Progress.addXP, завершение
      через Progress.markSectionDone('flashcards'), второй проход
      по «не знал». Ни одна из 68 оболочек не меняется.

   2. init({ cards, ids, onDone, showProgress, onShow, onGood, onAgain })
      — произвольная колода на произвольной разметке. Ни XP, ни
      markSectionDone, ни баннера «Урок завершён» здесь нет вообще:
      итог отдаётся колбэком onDone. Этим режимом живут карточки
      книги (js/reader-cards.js).

   Озвучка: в режиме урока переворот озвучивает слово через TTS,
   как и раньше. В произвольном режиме модуль не озвучивает ничего —
   кнопки 🔊 рисует и обрабатывает вызывающая сторона (в ридере это
   js/reader-speak.js). Своей логики озвучки здесь нет.

   Переворот — тот же CSS: .flashcard / .flashcard.flipped /
   .card-face из css/exercises.css. Новых правил переворота нет.
   ═══════════════════════════════════════════════ */

const Flashcards = (() => {

  /* ── Разметка по умолчанию: оболочки уроков ── */
  const DEFAULT_IDS = {
    card:     'flashcard',
    de:       'cardDE',
    ru:       'cardRU',
    ipa:      'cardIPA',
    meta:     null,          // в уроках таких узлов нет
    old:      null,
    actions:  'cardActions',
    counter:  'cardCounter',
    dots:     'cardDots',
    complete: 'lessonComplete',
    finish:   'lessonFinish'   // финиш урока из lesson-render.js
  };

  /* ── Состояние сессии ── */
  let mode    = 'lesson';
  let cfg     = null;    // опции произвольного режима
  let ids     = DEFAULT_IDS;

  let deck    = [];      // cards still to review
  let again   = [];      // cards to repeat (режим урока: второй проход)
  let current = 0;
  let flipped = false;
  let totalCards = 0;
  let tally   = null;    // произвольный режим: { known: [], repeat: [] }
  let missed = new Set();
  let resumeKey = null;
  let sourceSignature = '';
  let cardStates = [];  // Indexed by original vocabulary id, across repeat rounds.
  let live    = false;   // сессия идёт — защита от повторной инициализации

  /* ── DOM refs (populated in init) ── */
  let elCard, elCardDE, elCardRU, elCardIPA, elCardMeta, elCardOld,
      elActions, elCounter, elDots, elComplete;

  /* ── Слушатели: ссылки храним, чтобы снять их в destroy() ── */
  let onKeyDown = null;
  let onCardTap = null;
  let restartButton = null;

  function byId(key) {
    const id = ids[key];
    return id ? document.getElementById(id) : null;
  }

  /* ── Снять сессию ──
     Зовётся и перед новой инициализацией, и снаружи (закрытие оверлея
     карточек). Слушатели снимаются явно: иначе второй запуск на той же
     странице давал бы два переворота на один Пробел.                  */

  function destroy() {
    restartButton?.remove();
    restartButton = null;
    if (onKeyDown) document.removeEventListener('keydown', onKeyDown);
    if (onCardTap && elCard) elCard.removeEventListener('click', onCardTap);
    onKeyDown = null;
    onCardTap = null;

    deck = [];
    again = [];
    current = 0;
    flipped = false;
    totalCards = 0;
    tally = null;
    live = false;
    missed = new Set(); resumeKey = null;
    cardStates = [];

    elCard = elCardDE = elCardRU = elCardIPA = elCardMeta = elCardOld = null;
    elActions = elCounter = elDots = elComplete = null;
  }

  /* ── Init ── */

  function init(options, restart = false) {
    destroy();   // повторная инициализация не должна копить слушатели

    mode = (options && typeof options === 'object') ? 'custom' : 'lesson';
    cfg  = (mode === 'custom') ? options : null;
    ids  = (cfg && cfg.ids) ? Object.assign({}, DEFAULT_IDS, cfg.ids) : DEFAULT_IDS;

    let source;
    if (mode === 'lesson') {
      if (!LESSON_DATA?.vocabulary) return false;
      source = LESSON_DATA.vocabulary;
    } else {
      source = Array.isArray(cfg.cards) ? cfg.cards : [];
      if (!source.length) return false;
    }

    elCard     = byId('card');
    elCardDE   = byId('de');
    elCardRU   = byId('ru');
    elCardIPA  = byId('ipa');
    elCardMeta = byId('meta');
    elCardOld  = byId('old');
    elActions  = byId('actions');
    elCounter  = byId('counter');
    elDots     = byId('dots');
    elComplete = byId('complete');

    if (!elCard) return false;

    if (mode === 'lesson') {
      trimUI();
      mountRestartButton();
    }

    // Build deck from vocabulary
    deck = source.map((w, i) => ({ ...w, _id: i }));
    totalCards = deck.length;
    cardStates = Array(totalCards).fill('');
    tally = { known: [], repeat: [] };
    live = true;

    // Wording/translation edits must not reset an unfinished session.
    sourceSignature = JSON.stringify(source.map(w => w.de));
    let completed = false;
    if (mode === 'lesson') {
      resumeKey = 'dm_cards:' + LESSON_DATA.id;
      try {
        const saved = restart ? null : JSON.parse(localStorage.getItem(resumeKey) || 'null');
        const signature = saved && JSON.parse(saved.signature);
        const matches = Array.isArray(signature) && JSON.stringify(signature.map(w => typeof w === 'string' ? w : w.de)) === sourceSignature;
        if (saved && matches) {
          const cards = deck;
          if (Array.isArray(saved.deck) && saved.deck.length && saved.deck.every(i => Number.isInteger(i) && cards[i]) &&
              new Set(saved.deck).size === saved.deck.length && Array.isArray(saved.again) &&
              saved.again.every(i => Number.isInteger(i) && cards[i])) {
            deck = saved.deck.map(i => cards[i]); again = saved.again.map(i => cards[i]).filter(Boolean);
            current = Number.isInteger(saved.current) ? Math.max(0, Math.min(saved.current, deck.length)) : 0;
            missed = new Set((Array.isArray(saved.missed) ? saved.missed : []).filter(i => Number.isInteger(i) && cards[i]));
            completed = saved.done === true;
            if (Array.isArray(saved.states) && saved.states.length === totalCards && saved.states.every(s => ['', 'done', 'again'].includes(s))) {
              cardStates = saved.states.slice();
            } else {
              // Migrate sessions saved before per-card states were persisted.
              cardStates = cards.map(card => {
                const idx = deck.findIndex(c => c._id === card._id);
                if (completed || idx < 0) return 'done';
                if (again.some(c => c._id === card._id)) return 'again';
                if (idx < current) return 'done';
                return deck.length < totalCards ? 'again' : '';
              });
            }
          }
        }
      } catch (_) {}
    }
    elCard.style.display = '';
    if (elCard.parentElement) elCard.parentElement.style.display = '';
    if (elCounter) elCounter.style.display = '';
    buildDots();
    if (completed) {
      showCompleted();
      if (!Progress.getCompletionStatus().done.includes('flashcards')) recordCompletion();
      return true;
    }
    showCard(current);

    // Flip on click
    onCardTap = () => flip();
    elCard.addEventListener('click', onCardTap);
    elCard.tabIndex = 0; elCard.setAttribute('role', 'button');
    elCard.setAttribute('aria-label', 'Перевернуть карточку');

    // Keyboard: Space = flip, ← = again, → = good
    onKeyDown = e => {
      if (!live || !elCard || e.target !== elCard || !elCard.getClientRects().length) return;
      if (e.code === 'Space' || e.code === 'Enter')       { e.preventDefault(); flip(); }
      if (e.code === 'ArrowLeft' && flipped) { e.preventDefault(); handleAgain(); }
      if (e.code === 'ArrowRight' && flipped) { e.preventDefault(); handleGood(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return true;
  }

  /* ── Чистка лишнего UI (только режим урока) ──

     Кнопку «Перевернуть», подсказку «или нажмите Пробел» и тексты
     вокруг кнопок оценки снимаем из DOM здесь, а не в разметке:
     флэшкарты живут в 68 оболочках вида lessons/<lvl>/lesson-NN,
     и править их нельзя. Лишнее есть не везде — кнопка переворота
     только в a1/lesson-02…08, поэтому каждый шаг молча выходит,
     если цели нет.

     Карточка переворачивается тапом по себе (слушатель на elCard),
     а Space / ← / → продолжают работать — просто без видимых
     подсказок. Подсчёт, XP и markSectionDone не затронуты.        */

  function trimUI() {
    dropFlipButton();
    trimActions();
    fixHowto();
  }

  function dropFlipButton() {
    const btn = document.querySelector('button[onclick*="cardFlip"]');
    if (!btn) return;
    // Кнопка лежит в своей центрирующей обёртке вместе с подсказкой
    // про Пробел — уносим обёртку целиком, если в ней нет чужого.
    const wrap = btn.parentElement;
    const keep = '#flashcard, #cardActions, #cardDots, #cardCounter, #lessonComplete';
    const safe = wrap && wrap !== document.body && !wrap.querySelector(keep);
    (safe ? wrap : btn).remove();
  }

  function trimActions() {
    if (!elActions) return;
    const btns = Array.from(elActions.querySelectorAll('.card-btn'));
    if (!btns.length) return;
    // Оставляем только сами кнопки: «Ты знал это слово?» и
    // «← Не знал | Знаю →» уходят вместе со своей обёрткой.
    // Сами кнопки — те же узлы с теми же onclick, их не пересоздаём.
    elActions.innerHTML = '';
    btns.forEach(b => elActions.appendChild(b));
  }

  // Подсказка над карточкой ссылалась на кнопку, которой больше нет
  function fixHowto() {
    const el = document.querySelector('.fc-howto');
    if (!el || el.textContent.indexOf('Перевернуть') < 0) return;
    el.textContent = el.textContent.replace(
      /нажми\s+«Перевернуть»/,
      'нажми на карточку');
  }

  /* ── Show card ── */

  function showCard(idx) {
    if (idx >= deck.length) {
      finishRound();
      return;
    }
    current = idx;
    saveResume(false);
    flipped = false;
    elCard.classList.remove('flipped');

    const card = deck[idx];
    elCardDE.textContent  = card.de;
    elCardRU.textContent  = card.ru;
    elCardIPA.textContent = card.ipa || '';
    if (mode === 'lesson') {
      let note = elCard.querySelector('.card-note');
      if (!note && card.note) {
        note = document.createElement('div');
        note.className = 'card-note';
        elCardRU.parentElement.appendChild(note);
      }
      if (note) { note.textContent = card.note || ''; note.hidden = !card.note; }
    }
    fillExtra(card);

    // Произвольный режим может подстроиться под конкретную карточку
    // (у книги это кегль перевода по длине оборота). В уроках хука нет.
    if (mode === 'custom' && cfg && typeof cfg.onShow === 'function') {
      safeCall(cfg.onShow, card);
    }

    updateMeta();
    syncDots();
    setActions(false);

    // Auto-speak (optional)
    // TTS.speak(card.de);
  }

  // Грамматика и помета «устар.» — только если разметка их ждёт.
  // В уроках таких узлов нет, поэтому шаг пропускается целиком.
  function fillExtra(card) {
    if (elCardMeta) {
      elCardMeta.textContent = '';
      const lines = Array.isArray(card.meta) ? card.meta : [];
      lines.forEach(line => {
        if (!line) return;
        const d = document.createElement('div');
        d.className = 'fc-meta-line';
        d.textContent = line;   // textContent, не innerHTML — экранировать нечего
        elCardMeta.appendChild(d);
      });
    }
    if (elCardOld) {
      elCardOld.textContent = card.old ? 'устар. ' + card.old : '';
      elCardOld.hidden = !card.old;
    }
  }

  /* ── Flip ── */

  function flip() {
    if (!live || !deck[current]) return;
    flipped = !flipped;
    elCard.classList.toggle('flipped', flipped);
    if (flipped) {
      setActions(true);
      // Озвучка на перевороте — поведение уроков. В произвольном режиме
      // модуль не озвучивает: там свои кнопки 🔊 у вызывающей стороны.
      if (mode === 'lesson') TTS.speak(deck[current].de, { noticeHost: elCard.closest('.flashcard-section') });
    } else {
      setActions(false);
    }
  }

  function setActions(visible) {
    if (!elActions) return;
    // Reserve the answer row so a tap never changes the page height mid-flip.
    elActions.style.display = 'flex';
    elActions.style.visibility = visible ? 'visible' : 'hidden';
  }

  /* ── "Again" button ── */

  function handleAgain() {
    const card = deck[current];
    if (!card || !flipped || !live) return;

    if (mode === 'lesson') {
      again.push(card);
      missed.add(card._id);
      updateDot(current, 'again');
      nextCard();
      return;
    }

    // Произвольный режим: карточка остаётся активной и уходит в конец
    // очереди. Возврат даётся один раз — иначе сессия не кончилась бы
    // никогда, и «… на повторение» нечего было бы показать.
    if (tally.repeat.indexOf(card) < 0) tally.repeat.push(card);
    updateDot(current, 'again');
    if (!card.__requeued) {
      card.__requeued = true;
      deck.push(card);
    }
    if (typeof cfg.onAgain === 'function') safeCall(cfg.onAgain, card);
    nextCard();
  }

  /* ── "Know it" button ── */

  function handleGood() {
    const card = deck[current];
    if (!card || !flipped || !live) return;

    if (mode === 'lesson') {
      Progress.addXP(5, LESSON_DATA.id + ':card:' + card._id);
      updateDot(current, 'done');
      nextCard();
      return;
    }

    const wasRepeat = tally.repeat.indexOf(card);
    if (wasRepeat >= 0) tally.repeat.splice(wasRepeat, 1);
    if (tally.known.indexOf(card) < 0) tally.known.push(card);
    // Дубль, поставленный в конец очереди, спрашивать уже не за что
    const dup = deck.indexOf(card, current + 1);
    if (dup >= 0) deck.splice(dup, 1);

    updateDot(current, 'done');
    if (typeof cfg.onGood === 'function') safeCall(cfg.onGood, card);
    nextCard();
  }

  function safeCall(fn, arg) {
    try { fn(arg); }
    catch (e) { console.warn('[Flashcards] колбэк бросил исключение', e); }
  }

  function nextCard() {
    showCard(current + 1);
  }

  /* ── After going through all cards ── */

  function finishRound() {
    // Произвольный режим: ни XP, ни markSectionDone, ни баннера урока.
    if (mode === 'custom') {
      live = false;
      if (elCard)    elCard.style.display    = 'none';
      if (elActions) elActions.style.display = 'none';
      if (cfg && typeof cfg.onDone === 'function') {
        safeCall(cfg.onDone, {
          known:  tally.known.slice(),
          repeat: tally.repeat.slice(),
          total:  totalCards
        });
      }
      return;
    }

    if (again.length > 0) {
      // Second pass: cards the user didn't know
      deck    = again;
      again   = [];
      current = 0;
      buildDots();
      showCard(0);
    } else {
      // All cards reviewed — hide the deck UI for this section
      showCompleted();
      saveResume(true);
      recordCompletion();
    }
  }

  function recordCompletion() {
    Progress.addXP(25, LESSON_DATA.id + ':cards:complete');
    Progress.markSectionDone('flashcards', computeScore());
  }

  // Стопка карточек: на наведении верхняя «соскальзывает» (css/lesson.css)
  const STACK_ICON = '<svg class="flashcard-restart-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
    '<rect class="stack-back" x="3" y="6" width="13" height="15" rx="2.5"/>' +
    '<rect class="stack-front" x="8" y="3" width="13" height="15" rx="2.5"/></svg>';

  // Кнопка повтора живёт в финише урока рядом со «Следующим уроком» и
  // видна, только когда колода пройдена (во время повтора она не нужна).
  function mountRestartButton() {
    const host = byId('finish')?.querySelector('.lesson-complete-actions') ||
      elComplete?.querySelector('.lesson-complete-actions') || elComplete;
    if (!host) return;
    const label = document.createElement('span');
    const text = 'Повторить флешкарты';
    label.textContent = window.I18N ? I18N.t(text) : text;
    restartButton = document.createElement('button');
    restartButton.type = 'button';
    restartButton.className = 'btn btn-ghost flashcard-restart';
    restartButton.hidden = true;
    restartButton.innerHTML = STACK_ICON;
    restartButton.append(label);
    restartButton.addEventListener('click', () => {
      if (!init(null, true)) return;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      elCard.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      elCard.focus({ preventScroll: true });
    });
    const home = host.querySelector('a.btn');
    host.insertBefore(restartButton, home || null);
  }

  function showCompleted() {
    live = false;
    cardStates.fill('done');
    elCard.style.display = 'none';
    if (elCard.parentElement) elCard.parentElement.style.display = 'none';
    if (elActions) elActions.style.display = 'none';
    if (elCounter) {
      const message = 'Все карточки повторены';
      elCounter.textContent = window.I18N ? I18N.t(message) : message;
    }
    if (restartButton) restartButton.hidden = false;
    syncDots();
  }

  /* ── Dots ── */

  function buildDots() {
    if (!elDots || progressOff()) return;
    elDots.innerHTML = '';
    cardStates.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'fc-dot';
      d.id = `dot-${i}`;
      elDots.appendChild(d);
    });
    syncDots();
  }

  function updateDot(idx, state) {
    if (deck[idx]) cardStates[deck[idx]._id] = state;
    syncDots();
  }

  function syncDots() {
    if (!elDots || progressOff()) return;
    Array.from(elDots.children).forEach((dot, i) => {
      dot.className = 'fc-dot' + (cardStates[i] ? ' ' + cardStates[i] : '') +
        (live && deck[current]?._id === i ? ' current' : '');
    });
  }

  // showProgress: false выключает счётчик и точки. По умолчанию они есть,
  // поэтому в уроках эта ветка никогда не срабатывает.
  function progressOff() {
    return mode === 'custom' && cfg && cfg.showProgress === false;
  }

  /* ── Counter ── */

  function updateMeta() {
    if (elCounter && !progressOff()) {
      elCounter.textContent = `Карточка ${current + 1} из ${deck.length}`;
    }
  }

  /* ── Simple score ── */

  function computeScore() {
    const correct = totalCards - missed.size;
    return Math.round(correct / totalCards * 100);
  }

  function saveResume(done) {
    if (!resumeKey) return;
    try { localStorage.setItem(resumeKey, JSON.stringify({ signature: sourceSignature, deck: deck.map(c => c._id), again: again.map(c => c._id), current, missed: [...missed], states: cardStates, done })); } catch (_) {}
  }

  /* Expose button handlers to HTML onclick */
  return { init, destroy, flip, handleAgain, handleGood };
})();

/* Aliases for HTML onclick attributes */
function cardFlip()  { Flashcards.flip(); }
function cardAgain() { Flashcards.handleAgain(); }
function cardGood()  { Flashcards.handleGood(); }
