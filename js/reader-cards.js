/* ═══════════════════════════════════════════════
   reader-cards.js — карточки собранных слов книги
   Deutsch Meister Course

   Оверлей поверх ридера. Ридер НЕ размонтируется: .rd-cards лежит
   отдельной секцией с position: fixed, размеров .rd-viewport не
   трогает, поэтому страница, якорь и пагинация переживают сессию
   карточек без единого пересчёта.

   Движок колоды — js/flashcards.js в произвольном режиме
   (init({ cards, ids, onDone, ... })): ни XP, ни markSectionDone,
   ни баннера урока. Переворот — тот же CSS из css/exercises.css.

   Озвучка — только через js/reader-speak.js, теми же вызовами,
   что и в ридере. Своей логики озвучки здесь нет.

   «Знаю» → ReaderWords.setStatus(lemma, 'known'): слово уходит из
   активных, и подсветка .bw--seen в тексте снимается сразу же.
   «Повторить» → статус не меняется, карточка возвращается в конец
   очереди (один раз, см. flashcards.js).

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderCards = (() => {

  const IDS = {
    card:    'rdCard',
    de:      'rdCardDE',
    ru:      'rdCardRU',
    ipa:     'rdCardIPA',
    meta:    'rdCardMeta',
    old:     'rdCardOld',
    actions: 'rdCardActions',
    counter: 'rdCardsCounter',
    dots:    'rdCardsDots',
    complete: null          // баннера урока здесь нет и быть не должно
  };

  let elView, elSub, elDone, elDoneTitle, elCard, elActions;
  let bound   = false;
  let open_   = false;
  let bookId  = null;
  let onClose = null;
  let deck    = [];     // карточки сессии, нужны для 🔊 (см. currentCard)

  /* ── Склейка карточки из записи сборника ── */

  // Лицо — лемма с артиклем: у существительного артикль часть словарной
  // формы, и без него карточка учит неправильному.
  function faceOf(rec) {
    return (rec.art ? rec.art + ' ' : '') + rec.de;
  }

  // Оборот — грамматика ровно та, что есть в записи; пустых строк не даём
  function metaLines(rec) {
    const lines = [];
    if (rec.pos) lines.push(rec.pos);
    if (rec.pos === 'сущ.') {
      lines.push(faceOf(rec) + ' · ' + (rec.pl ? 'мн. ч.: ' + rec.pl : 'мн. ч. нет'));
    }
    if (rec.decl) lines.push(rec.decl);
    if (rec.forms) {
      lines.push(rec.pos === 'гл.' ? rec.de + ' · ' + rec.forms : rec.forms);
    }
    return lines;
  }

  function cardOf(rec) {
    return {
      lemma: rec.de,          // ключ записи в dm_book_words
      word:  rec.de,          // что озвучиваем: словарная форма без артикля
      de:    faceOf(rec),
      ru:    rec.ru || '',
      ipa:   '',
      meta:  metaLines(rec),
      old:   rec.old || ''
    };
  }

  /* ── Озвучка: только через ReaderSpeak ── */

  // Движок не сообщает о смене карточки, поэтому цель берём из DOM: лицо
  // карточки всегда показывает текущее слово. Так озвучка не разъедется
  // с колодой, что бы ни случилось с порядком (возврат в конец очереди).
  function currentCard() {
    const de = document.getElementById('rdCardDE');
    const face = de ? de.textContent : '';
    return deck.find(c => c.de === face) || null;
  }

  function say() {
    if (typeof ReaderSpeak === 'undefined') return;
    const card = currentCard();
    if (!card) return;
    if (ReaderSpeak.isPlaying('word')) { ReaderSpeak.stop(); return; }
    ReaderSpeak.word(card.word);
  }

  /* ── Снятие подсветки в тексте ── */

  // Ридер сам перечитает ReaderWords.isMarked и погасит .bw--seen у всех
  // форм этой леммы. Если ридер закрыт (карточки открыты из библиотеки),
  // вызов молча ничего не делает.
  function unmark(lemma) {
    if (typeof Reader !== 'undefined' && typeof Reader.markLemma === 'function') {
      Reader.markLemma(lemma);
    }
  }

  /* ── Итог ── */

  function showDone(res) {
    if (!elDone) return;
    elDoneTitle.textContent =
      'Разобрано: ' + res.known.length + ' знаю, ' + res.repeat.length + ' на повторение';
    elDone.hidden = false;
    if (elActions) elActions.style.display = 'none';
  }

  /* ── Открыть / закрыть ── */

  function bind() {
    if (bound) return;
    bound = true;

    document.getElementById('rdCardsBack')?.addEventListener('click', () => close());
    document.getElementById('rdCardsBackToRead')?.addEventListener('click', () => close());
    document.getElementById('rdCardSayFront')?.addEventListener('click', e => {
      e.stopPropagation();   // тап по 🔊 не должен переворачивать карточку
      say();
    });
    document.getElementById('rdCardSayBack')?.addEventListener('click', e => {
      e.stopPropagation();
      say();
    });
    document.getElementById('rdCardAgain')?.addEventListener('click', () => {
      if (typeof Flashcards !== 'undefined') Flashcards.handleAgain();
    });
    document.getElementById('rdCardGood')?.addEventListener('click', () => {
      if (typeof Flashcards !== 'undefined') Flashcards.handleGood();
    });
    document.addEventListener('keydown', e => {
      if (open_ && e.key === 'Escape') close();
    });
  }

  // opts: { bookId, records: [запись сборника], subtitle, theme, onClose }
  function open(opts) {
    const o = opts || {};
    const records = Array.isArray(o.records) ? o.records : [];
    if (!records.length) return false;

    elView      = document.getElementById('rdCards');
    elSub       = document.getElementById('rdCardsSub');
    elDone      = document.getElementById('rdCardsDone');
    elDoneTitle = document.getElementById('rdCardsDoneTitle');
    elCard      = document.getElementById('rdCard');
    elActions   = document.getElementById('rdCardActions');
    if (!elView || !elCard) return false;

    bind();
    bookId  = o.bookId || null;
    onClose = (typeof o.onClose === 'function') ? o.onClose : null;

    // Прошлая сессия могла оставить карточку скрытой в конце колоды
    elCard.style.display = '';
    elDone.hidden = true;
    elView.dataset.rdTheme = o.theme || 'system';
    if (elSub) elSub.textContent = o.subtitle || '';

    deck = records.map(cardOf);

    const started = Flashcards.init({
      cards: deck,
      ids: IDS,
      showProgress: true,
      onGood: card => {
        if (typeof ReaderWords !== 'undefined') ReaderWords.setStatus(card.lemma, 'known');
        unmark(card.lemma);
      },
      onDone: showDone
    });
    if (!started) return false;

    // Flashcards работает на копиях (deck = source.map(...)), поэтому для
    // поиска по лицу карточки держим при себе ровно те же значения
    elView.hidden = false;
    open_ = true;
    document.body.classList.add('rd-open');
    return true;
  }

  function close() {
    if (!elView) return;
    if (typeof ReaderSpeak !== 'undefined') ReaderSpeak.stop();
    if (typeof Flashcards !== 'undefined') Flashcards.destroy();
    elView.hidden = true;
    open_ = false;
    deck = [];
    // body.rd-open снимаем только если ридер под нами закрыт: иначе
    // страница бы прокрутилась, и позиция чтения уехала бы
    const rd = document.getElementById('rdView');
    if (!rd || rd.hidden) document.body.classList.remove('rd-open');
    if (onClose) {
      const cb = onClose;
      onClose = null;
      try { cb(); } catch (e) { console.warn('[ReaderCards] onClose бросил исключение', e); }
    }
  }

  function isOpen() { return open_; }

  return { open, close, isOpen, cardOf, metaLines, faceOf };
})();
