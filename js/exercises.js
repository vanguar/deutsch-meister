/* ═══════════════════════════════════════════════
   js/exercises.js — All exercise types:
   Fill-in-blank, Multiple Choice, Matching,
   Dictation. Reads data from LESSON_DATA global.

   ✦ Updated: each section calls Progress.markSectionDone()
     when the user has actually answered every item — only
     then does it count toward lesson completion.
   ═══════════════════════════════════════════════ */

const Exercises = (() => {

  /* ── Shared state ── */
  let score = { correct: 0, total: 0 };

  function addResult(isCorrect) {
    score.total++;
    if (isCorrect) score.correct++;
    const pct = Math.round(score.correct / score.total * 100);
    Progress.renderLessonProgress(pct);
  }

  /* ════════════════════════════════════
     TAB SWITCHING
     ════════════════════════════════════ */
  function initTabs() {
    document.querySelectorAll('.ex-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;
        document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.exercise-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + target)?.classList.add('active');
      });
    });
  }

  /* ════════════════════════════════════
     1. FILL-IN-THE-BLANK
     ════════════════════════════════════ */

  /**
   * Attach behaviour to a single blank input.
   * @param {HTMLInputElement} input
   * @param {string}           correctAnswer   – exact expected string
   * @param {string}           hintWord        – word shown in tooltip
   * @param {string}           hintRule        – grammar note in tooltip
   */
  function initBlankInput(input, correctAnswer, hintWord, hintRule) {
    const wrap = input.closest('.blank-input-wrap');
    const card = input.closest('.blank-question');

    function evaluate() {
      const val = input.value.trim();
      if (!val) return;

      // Clean up previous state
      input.classList.remove('input-correct', 'input-wrong');
      card.classList.remove('correct', 'wrong');
      wrap.querySelector('.hint-btn')?.remove();
      wrap.querySelector('.hint-tooltip')?.remove();

      const isCorrect = (val === correctAnswer);

      if (isCorrect) {
        input.classList.add('input-correct');
        card.classList.add('correct');
        addResult(true);
        Progress.addXP(10);
      } else {
        input.classList.add('input-wrong');
        card.classList.add('wrong');
        addResult(false);
        showHintButton(wrap, hintWord, hintRule);
      }
    }

    // Check on Enter key
    input.addEventListener('keydown', e => { if (e.key === 'Enter') evaluate(); });

    // Store evaluator so the "Check All" button can call it
    input._evaluate = evaluate;
  }

  function showHintButton(wrap, word, rule) {
    const btn = document.createElement('button');
    btn.className = 'hint-btn';
    btn.textContent = '?';
    btn.title = 'Подсказка';
    btn.type = 'button';

    btn.addEventListener('click', e => {
      e.stopPropagation();
      // Toggle tooltip
      const existing = wrap.querySelector('.hint-tooltip');
      if (existing) { existing.remove(); return; }

      const tip = document.createElement('div');
      tip.className = 'hint-tooltip';
      tip.innerHTML = `
        <span class="hint-word">${escapeHtml(word)}</span>
        <span class="hint-rule">${escapeHtml(rule)}</span>
      `;
      wrap.appendChild(tip);

      // Auto-dismiss after 5 s
      setTimeout(() => tip.remove(), 5000);
    });

    wrap.appendChild(btn);
  }

  /** Wire up the "Check All" button for the fill panel */
  function initFillPanel() {
    const btn = document.getElementById('checkFillBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('#panel-fill .blank-input');
      const total  = inputs.length;

      // Count how many have any user input — empty fields don't count as "answered"
      let answered = 0;
      let correct  = 0;

      inputs.forEach(input => {
        const hasValue = input.value.trim().length > 0;
        if (hasValue) {
          answered++;
          if (input._evaluate) input._evaluate();
          if (input.classList.contains('input-correct')) correct++;
        }
      });

      const incomplete = total - answered;
      showBanner('fillResult', correct, total, incomplete);

      // ✦ Section is "done" only when every blank has been filled in.
      if (total > 0 && answered === total) {
        const pct = Math.round(correct / total * 100);
        Progress.markSectionDone('fill', pct);
      }
    });
  }

  /* ════════════════════════════════════
     2. MULTIPLE CHOICE
     ════════════════════════════════════ */

  /**
   * Render multiple-choice questions from LESSON_DATA.exercises.multipleChoice
   */
  function initMCPanel() {
    const container = document.getElementById('mcContainer');
    if (!container || !LESSON_DATA?.exercises?.multipleChoice) return;

    const questions = LESSON_DATA.exercises.multipleChoice;
    let answeredCount = 0;
    let correctCount  = 0;

    questions.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'mc-question';
      div.innerHTML = `
        <div class="mc-question-text">${qi + 1}. ${escapeHtml(q.question)}</div>
        <div class="mc-options" id="mc-opts-${qi}"></div>
      `;
      const optsEl = div.querySelector('.mc-options');

      q.options.forEach((opt, oi) => {
        const btn = document.createElement('button');
        btn.className = 'mc-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          if (btn.classList.contains('disabled')) return;

          // Lock all options
          optsEl.querySelectorAll('.mc-option').forEach(b => b.classList.add('disabled'));

          const isCorrect = (oi === q.correctIndex);
          if (isCorrect) {
            btn.classList.add('correct');
            correctCount++;
            Progress.addXP(8);
            addResult(true);
          } else {
            btn.classList.add('wrong');
            addResult(false);
            // Reveal correct answer
            optsEl.querySelectorAll('.mc-option')[q.correctIndex]?.classList.add('correct');
          }

          answeredCount++;
          if (answeredCount === questions.length) {
            showBanner('choiceResult', correctCount, questions.length);

            // ✦ Section finished — every question got an answer.
            const pct = Math.round(correctCount / questions.length * 100);
            Progress.markSectionDone('choice', pct);
          }
        });
        optsEl.appendChild(btn);
      });

      container.appendChild(div);
    });
  }

  /* ════════════════════════════════════
     3. MATCHING
     ════════════════════════════════════ */

  let matchSelection = null;   // { el, pairId, side }
  let matchedPairs   = 0;

  function initMatchPanel() {
    const leftCol  = document.getElementById('matchLeft');
    const rightCol = document.getElementById('matchRight');
    if (!leftCol || !rightCol || !LESSON_DATA?.exercises?.matching) return;

    const pairs = LESSON_DATA.exercises.matching;
    const totalPairs = pairs.length;

    // Build left column (German, in order)
    pairs.forEach((pair, i) => {
      leftCol.appendChild(createMatchItem(pair.id, 'left', pair.de));
    });

    // Build right column (Russian, shuffled)
    const shuffled = [...pairs].sort(() => Math.random() - .5);
    shuffled.forEach(pair => {
      rightCol.appendChild(createMatchItem(pair.id, 'right', pair.ru));
    });

    function createMatchItem(pairId, side, text) {
      const el = document.createElement('div');
      el.className = 'match-item';
      el.dataset.pairId = pairId;
      el.dataset.side   = side;
      el.textContent    = text;

      el.addEventListener('click', () => handleMatchClick(el, pairId, side, totalPairs));
      return el;
    }
  }

  function handleMatchClick(el, pairId, side, totalPairs) {
    if (el.classList.contains('matched')) return;

    if (!matchSelection) {
      // First pick
      el.classList.add('selected');
      matchSelection = { el, pairId, side };
      return;
    }

    const prev = matchSelection;

    // Clicked same item — deselect
    if (prev.el === el) {
      el.classList.remove('selected');
      matchSelection = null;
      return;
    }

    // Clicked same column — switch selection
    if (prev.side === side) {
      prev.el.classList.remove('selected');
      el.classList.add('selected');
      matchSelection = { el, pairId, side };
      return;
    }

    // Cross-column selection — evaluate
    prev.el.classList.remove('selected');
    matchSelection = null;

    if (prev.pairId === pairId) {
      // Correct pair
      prev.el.classList.add('matched');
      el.classList.add('matched');
      matchedPairs++;
      addResult(true);
      Progress.addXP(8);

      if (matchedPairs === totalPairs) {
        setTimeout(() => {
          showBanner('matchResult', totalPairs, totalPairs);
          // ✦ All pairs matched correctly — section done.
          Progress.markSectionDone('match', 100);
        }, 300);
      }
    } else {
      // Wrong pair
      prev.el.classList.add('wrong-match');
      el.classList.add('wrong-match');
      addResult(false);
      setTimeout(() => {
        prev.el.classList.remove('wrong-match');
        el.classList.remove('wrong-match');
      }, 500);
    }
  }

  /* ════════════════════════════════════
     4. DICTATION
     ════════════════════════════════════ */

  function initDictationPanel() {
    const container = document.getElementById('dictationContainer');
    const checkBtn  = document.getElementById('checkDictBtn');
    if (!container || !LESSON_DATA?.exercises?.dictation) return;

    const words = LESSON_DATA.exercises.dictation;

    words.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'dictation-card';
      card.innerHTML = `
        <div class="dictation-top">
          <button class="big-play-btn" title="Прослушать" data-text="${escapeHtml(item.audio || item.word)}">🔊</button>
          <div class="dictation-info">
            <span class="dictation-num">Слово ${i + 1} из ${words.length}</span><br>
            Нажмите 🔊 и напишите то, что услышали
          </div>
        </div>
        <input class="dictation-input" id="dict-${i}"
               placeholder="Введите слово…"
               autocomplete="off" spellcheck="false">
      `;
      // Speak button
      card.querySelector('.big-play-btn').addEventListener('click', () => {
        TTS.speak(item.audio || item.word);
      });
      // Enter key
      card.querySelector('.dictation-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkSingleDict(i, item.word);
      });

      container.appendChild(card);
    });

    // "Check" button
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        let correct  = 0;
        let answered = 0;
        words.forEach((item, i) => {
          const input = document.getElementById('dict-' + i);
          if (input && input.value.trim().length > 0) answered++;
          if (checkSingleDict(i, item.word)) correct++;
        });

        const total = words.length;
        const incomplete = total - answered;
        showBanner('dictResult', correct, total, incomplete);

        if (correct === total) Progress.addXP(20);

        // ✦ Section is "done" only when every word has been written in.
        if (total > 0 && answered === total) {
          const pct = Math.round(correct / total * 100);
          Progress.markSectionDone('dict', pct);
        }
      });
    }
  }

  function checkSingleDict(i, correctWord) {
    const input = document.getElementById('dict-' + i);
    if (!input) return false;
    const val = input.value.trim();
    input.classList.remove('input-correct', 'input-wrong');
    if (!val) return false;
    const ok = (val === correctWord);
    input.classList.add(ok ? 'input-correct' : 'input-wrong');
    return ok;
  }

  /* ════════════════════════════════════
     HELPERS
     ════════════════════════════════════ */

  /**
   * Show a result banner.
   * @param {string} id              DOM id of the banner element
   * @param {number} correct         number of correct answers
   * @param {number} total           total number of items
   * @param {number} [incomplete]    number of items left blank (optional)
   */
  function showBanner(id, correct, total, incomplete) {
    const el = document.getElementById(id);
    if (!el) return;

    if (incomplete && incomplete > 0) {
      el.className = 'result-banner show fail';
      el.innerHTML = `⚠️ Заполни все поля (осталось: ${incomplete}). Верно пока: ${correct} из ${total}.`;
      return;
    }

    if (correct === total) {
      el.className = 'result-banner show success';
      el.innerHTML = `🎉 Отлично! ${correct} из ${total} верно!`;
    } else {
      el.className = 'result-banner show fail';
      el.innerHTML = `✅ Верно: ${correct} из ${total}. Попробуй исправить ошибки!`;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ════════════════════════════════════
     MOBILE STEP MODE  (≤860 px)
     Show one task at a time; skip after
     STEP_SKIP_AFTER consecutive wrong answers.
     ════════════════════════════════════ */

  const STEP_SKIP_AFTER = 3;

  function _isMobile() { return window.innerWidth <= 860; }

  function _makeStepBar(total, anchor) {
    const el = document.createElement('div');
    el.className = 'step-bar';
    const cap = Math.min(total, 12);
    el.innerHTML =
      `<div class="step-dots">${
        Array.from({length: cap}, (_, i) =>
          `<span class="sd${i === 0 ? ' sd-cur' : ''}"></span>`
        ).join('')
      }</div><span class="step-num">1 / ${total}</span>`;
    anchor.parentNode.insertBefore(el, anchor);
    return el;
  }

  function _updateBar(bar, idx, total) {
    const cap = Math.min(total, 12);
    bar.querySelectorAll('.sd').forEach((d, i) => {
      d.className = 'sd' +
        (i < Math.min(idx, cap) ? ' sd-done' :
         i === idx && idx < cap  ? ' sd-cur'  : '');
    });
    const numEl = bar.querySelector('.step-num');
    if (numEl && idx < total) numEl.textContent = `${idx + 1} / ${total}`;
  }

  function _addSkipBtn(bar, cb) {
    if (bar.querySelector('.step-skip')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'step-skip';
    b.textContent = 'Пропустить →';
    b.onclick = () => { b.remove(); cb(); };
    bar.appendChild(b);
  }

  function _addNextBtn(bar, cb) {
    if (bar.querySelector('.step-next')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'step-next';
    b.textContent = 'Следующий →';
    b.onclick = () => { b.remove(); cb(); };
    bar.appendChild(b);
  }

  /* ── Fill step ── */
  function applyFillStep() {
    if (!_isMobile()) return;
    const cnt = document.getElementById('fillContainer');
    if (!cnt) return;
    const qs = [...cnt.querySelectorAll('.blank-question')];
    if (!qs.length) return;

    let idx = 0, wrong = 0, ok = 0;
    const total = qs.length;
    const bar = _makeStepBar(total, cnt);

    qs.forEach((q, qi) => { if (qi > 0) q.style.display = 'none'; });

    const checkBtn = document.getElementById('checkFillBtn');
    if (checkBtn) checkBtn.style.display = 'none';

    function next() {
      qs[idx].style.display = 'none';
      idx++; wrong = 0;
      if (idx < total) {
        qs[idx].style.display = '';
        _updateBar(bar, idx, total);
        setTimeout(() => qs[idx].querySelector('.blank-input')?.focus(), 80);
      } else {
        showBanner('fillResult', ok, total);
        Progress.markSectionDone('fill', Math.round(ok / total * 100));
      }
    }

    qs.forEach(q => {
      const inp = q.querySelector('.blank-input');
      if (!inp) return;
      let locked = false;
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || locked) return;
        if (inp.classList.contains('input-correct')) {
          locked = true; ok++;
          setTimeout(next, 500);
        } else if (inp.classList.contains('input-wrong')) {
          wrong++;
          if (wrong >= STEP_SKIP_AFTER) _addSkipBtn(bar, next);
        }
      });
    });
  }

  /* ── Multiple-choice step ── */
  function applyMCStep() {
    if (!_isMobile()) return;
    const cnt = document.getElementById('mcContainer');
    if (!cnt) return;
    const qs = [...cnt.querySelectorAll('.mc-question')];
    if (!qs.length) return;

    let idx = 0;
    const total = qs.length;
    const bar = _makeStepBar(total, cnt);

    qs.forEach((q, qi) => { if (qi > 0) q.style.display = 'none'; });

    function next() {
      qs[idx].style.display = 'none';
      idx++;
      if (idx < total) { qs[idx].style.display = ''; _updateBar(bar, idx, total); }
      // initMCPanel handles section completion when all questions are answered
    }

    qs.forEach(q => {
      const optsEl = q.querySelector('.mc-options');
      if (!optsEl) return;
      let locked = false;
      optsEl.addEventListener('click', e => {
        const btn = e.target.closest('.mc-option');
        if (!btn || locked) return;
        // initMCPanel adds 'disabled' to btn synchronously before bubbling reaches here,
        // so we must NOT check for 'disabled' — use our own 'locked' guard instead
        locked = true;
        requestAnimationFrame(() => {
          if (btn.classList.contains('correct'))    setTimeout(next, 700);
          else if (btn.classList.contains('wrong')) setTimeout(() => _addNextBtn(bar, next), 500);
        });
      });
    });
  }

  /* ── Dictation step ── */
  function applyDictStep() {
    if (!_isMobile()) return;
    const cnt = document.getElementById('dictationContainer');
    if (!cnt) return;
    const cards = [...cnt.querySelectorAll('.dictation-card')];
    if (!cards.length) return;

    let idx = 0, wrong = 0, ok = 0;
    const total = cards.length;
    const bar = _makeStepBar(total, cnt);

    cards.forEach((c, ci) => { if (ci > 0) c.style.display = 'none'; });

    const checkBtn = document.getElementById('checkDictBtn');
    if (checkBtn) checkBtn.style.display = 'none';

    function next() {
      cards[idx].style.display = 'none';
      idx++; wrong = 0;
      if (idx < total) {
        cards[idx].style.display = '';
        _updateBar(bar, idx, total);
        setTimeout(() => cards[idx].querySelector('.dictation-input')?.focus(), 80);
      } else {
        showBanner('dictResult', ok, total);
        Progress.markSectionDone('dict', Math.round(ok / total * 100));
      }
    }

    cards.forEach(card => {
      const inp = card.querySelector('.dictation-input');
      if (!inp) return;
      let locked = false;
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || locked) return;
        if (inp.classList.contains('input-correct')) {
          locked = true; ok++;
          setTimeout(next, 500);
        } else if (inp.classList.contains('input-wrong')) {
          wrong++;
          if (wrong >= STEP_SKIP_AFTER) _addSkipBtn(bar, next);
        }
      });
    });
  }

  function initStepModes() {
    applyFillStep();
    applyMCStep();
    applyDictStep();
  }

  /* ── Public init ── */
  function init() {
    initTabs();
    initFillPanel();
    initMCPanel();
    initMatchPanel();
    initDictationPanel();
    initStepModes();
  }

  return { init, escapeHtml, initBlankInput };
})();
