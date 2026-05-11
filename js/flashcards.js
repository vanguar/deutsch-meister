/* ═══════════════════════════════════════════════
   js/flashcards.js — Spaced-repetition flashcards
                      Reads data from LESSON_DATA.vocabulary

   ✦ Updated: marks 'flashcards' section as done via
     Progress.markSectionDone() instead of completing
     the whole lesson by itself.
   ═══════════════════════════════════════════════ */

const Flashcards = (() => {

  let deck    = [];   // cards still to review
  let again   = [];   // cards to repeat
  let current = 0;
  let flipped = false;
  let totalCards = 0;

  /* ── DOM refs (populated in init) ── */
  let elCard, elFront, elBack, elCardDE, elCardRU, elCardIPA;
  let elActions, elCounter, elDots, elComplete;

  /* ── Init ── */
  function init() {
    if (!LESSON_DATA?.vocabulary) return;

    elCard     = document.getElementById('flashcard');
    elCardDE   = document.getElementById('cardDE');
    elCardRU   = document.getElementById('cardRU');
    elCardIPA  = document.getElementById('cardIPA');
    elActions  = document.getElementById('cardActions');
    elCounter  = document.getElementById('cardCounter');
    elDots     = document.getElementById('cardDots');
    elComplete = document.getElementById('lessonComplete');

    if (!elCard) return;

    // Build deck from vocabulary
    deck = LESSON_DATA.vocabulary.map(w => ({ ...w }));
    totalCards = deck.length;

    buildDots();
    showCard(0);

    // Flip on click
    elCard.addEventListener('click', flip);

    // Keyboard: Space = flip, ← = again, → = good
    document.addEventListener('keydown', e => {
      if (!elCard) return;
      if (e.code === 'Space')       { e.preventDefault(); flip(); }
      if (e.code === 'ArrowLeft')   handleAgain();
      if (e.code === 'ArrowRight')  handleGood();
    });
  }

  /* ── Show card ── */
  function showCard(idx) {
    if (idx >= deck.length) {
      finishRound();
      return;
    }
    current = idx;
    flipped = false;
    elCard.classList.remove('flipped');

    const card = deck[idx];
    elCardDE.textContent  = card.de;
    elCardRU.textContent  = card.ru;
    elCardIPA.textContent = card.ipa || '';

    updateMeta();
    elActions.style.display = 'none';

    // Auto-speak (optional)
    // TTS.speak(card.de);
  }

  /* ── Flip ── */
  function flip() {
    if (!deck[current]) return;
    flipped = !flipped;
    elCard.classList.toggle('flipped', flipped);
    if (flipped) {
      elActions.style.display = 'flex';
      TTS.speak(deck[current].de);
    } else {
      elActions.style.display = 'none';
    }
  }

  /* ── "Again" button ── */
  function handleAgain() {
    again.push(deck[current]);
    updateDot(current, 'again');
    nextCard();
  }

  /* ── "Know it" button ── */
  function handleGood() {
    Progress.addXP(5);
    updateDot(current, 'done');
    nextCard();
  }

  function nextCard() {
    showCard(current + 1);
  }

  /* ── After going through all cards ── */
  function finishRound() {
    if (again.length > 0) {
      // Second pass: cards the user didn't know
      deck    = again;
      again   = [];
      current = 0;
      buildDots();
      showCard(0);
    } else {
      // All cards reviewed — hide the deck UI for this section
      elCard.style.display    = 'none';
      elActions.style.display = 'none';
      elCounter.style.display = 'none';

      Progress.addXP(25);

      // ✦ Mark this section as done; lesson-completion banner
      //   will only appear once ALL sections are finished.
      Progress.markSectionDone('flashcards', computeScore());
    }
  }

  /* ── Dots ── */
  function buildDots() {
    if (!elDots) return;
    elDots.innerHTML = '';
    deck.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'fc-dot' + (i === 0 ? ' current' : '');
      d.id = `dot-${i}`;
      elDots.appendChild(d);
    });
  }

  function updateDot(idx, state) {
    const d = document.getElementById(`dot-${idx}`);
    if (d) { d.className = `fc-dot ${state}`; }
    const next = document.getElementById(`dot-${idx + 1}`);
    if (next) next.classList.add('current');
  }

  /* ── Counter ── */
  function updateMeta() {
    if (elCounter) {
      elCounter.textContent = `Карточка ${current + 1} из ${deck.length}`;
    }
  }

  /* ── Simple score ── */
  function computeScore() {
    const correct = totalCards - again.length;
    return Math.round(correct / totalCards * 100);
  }

  /* Expose button handlers to HTML onclick */
  return { init, flip, handleAgain, handleGood };
})();

/* Aliases for HTML onclick attributes */
function cardFlip()  { Flashcards.flip(); }
function cardAgain() { Flashcards.handleAgain(); }
function cardGood()  { Flashcards.handleGood(); }
