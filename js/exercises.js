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
  const results = new Map();
  const sessionKey = 'dm_exercise:' + (typeof LESSON_DATA !== 'undefined' ? LESSON_DATA.id : '');
  const signature = JSON.stringify(typeof LESSON_DATA !== 'undefined' ? LESSON_DATA.exercises : {});
  let session;
  try { session = JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch (_) {}
  if (!session || session.signature !== signature) session = { signature, answers: {}, order: {}, steps: {} };
  function saveSession() { try { localStorage.setItem(sessionKey, JSON.stringify(session)); } catch (_) {} }
  function award(n, task) { Progress.addXP(n, LESSON_DATA.id + ':' + task); }
  function shuffled(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function rememberInput(input) {
    input.value = session.answers[input.id] || '';
    input.addEventListener('input', () => { session.answers[input.id] = input.value; saveSession(); });
  }
  function retryButton(host) {
    if (!host || host.querySelector('.exercise-retry')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn exercise-retry';
    b.textContent = 'Повторить упражнения';
    b.addEventListener('click', () => { localStorage.removeItem(sessionKey); location.reload(); }); host.appendChild(b);
  }

  function addResult(isCorrect, id) {
    results.set(id || 'attempt:' + results.size, isCorrect);
    score.total = results.size;
    score.correct = [...results.values()].filter(Boolean).length;
    const pct = Math.round(score.correct / score.total * 100);
    Progress.renderLessonProgress(pct);
  }

  function normalizeMultipleChoice(raw) {
    const items = Array.isArray(raw) ? raw : raw?.items;
    if (!Array.isArray(items)) return [];
    return items.map(q => ({
      question: q.question,
      options: q.options || [],
      correctIndex: q.correctIndex ?? q.answer ?? 0
    }));
  }

  function normalizeMatching(raw) {
    const items = Array.isArray(raw) ? raw : raw?.pairs;
    if (!Array.isArray(items)) return [];
    return items.map((pair, i) => ({
      id: pair.id ?? i + 1,
      de: pair.de ?? pair.left ?? '',
      ru: pair.ru ?? pair.right ?? ''
    }));
  }

  function normalizeDictation(raw) {
    if (Array.isArray(raw)) return raw;
    const sentences = raw?.sentences;
    if (!Array.isArray(sentences)) return [];
    return sentences.map(sentence => ({ word: sentence, audio: sentence }));
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
    rememberInput(input);
    input.setAttribute('aria-label', (window.I18N ? I18N.t('Пропуск') : 'Пропуск') + ': ' + (card.querySelector('.blank-sentence')?.textContent || card.textContent).trim());

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
        addResult(true, input.id);
        award(10, 'fill:' + input.id);
      } else {
        input.classList.add('input-wrong');
        card.classList.add('wrong');
        addResult(false, input.id);
        showHintButton(wrap, hintWord, hintRule);
      }
    }

    // Check on Enter key
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !_isMobile()) evaluate(); });

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
    const raw = LESSON_DATA?.exercises?.multipleChoice;
    if (!container || !raw) return;

    const questions = normalizeMultipleChoice(raw);
    if (!questions.length) return;
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

      const order = session.order[qi] || shuffled(q.options.map((_, i) => i));
      session.order[qi] = order; saveSession();
      order.forEach(oi => {
        const opt = q.options[oi];
        const btn = document.createElement('button');
        btn.className = 'mc-option';
        btn.type = 'button'; btn.dataset.option = oi;
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          if (btn.classList.contains('disabled')) return;

          // Lock all options
          optsEl.querySelectorAll('.mc-option').forEach(b => { b.classList.add('disabled'); b.disabled = true; });

          const isCorrect = (oi === q.correctIndex);
          div.dataset.answered = 'true'; div.dataset.correct = String(isCorrect);
          session.answers['choice:' + qi] = oi; saveSession();
          const next = div.querySelector('.step-next-btn'); if (next) next.disabled = false;
          if (isCorrect) {
            btn.classList.add('correct');
            correctCount++;
            award(8, 'choice:' + qi);
            addResult(true);
          } else {
            btn.classList.add('wrong');
            addResult(false);
            // Reveal correct answer
            optsEl.querySelector('[data-option="' + q.correctIndex + '"]')?.classList.add('correct');
          }

          answeredCount++;
          if (answeredCount === questions.length) {
            showBanner('choiceResult', correctCount, questions.length);

            // ✦ Section finished — every question got an answer.
            const pct = Math.round(correctCount / questions.length * 100);
            Progress.markSectionDone('choice', pct);
            retryButton(document.getElementById('choiceResult'));
          }
        });
        optsEl.appendChild(btn);
      });

      container.appendChild(div);
      const previous = session.answers['choice:' + qi];
      if (Number.isInteger(previous)) optsEl.querySelector('[data-option="' + previous + '"]')?.click();
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
    const raw = LESSON_DATA?.exercises?.matching;
    if (!leftCol || !rightCol || !raw) return;

    const pairs = normalizeMatching(raw);
    if (!pairs.length) return;
    const totalPairs = pairs.length;

    // Build left column (German, in order)
    pairs.forEach((pair, i) => {
      leftCol.appendChild(createMatchItem(pair.id, 'left', pair.de));
    });

    // Build right column (Russian, shuffled)
    const rightOrder = shuffled(pairs);
    rightOrder.forEach(pair => {
      rightCol.appendChild(createMatchItem(pair.id, 'right', pair.ru));
    });

    function createMatchItem(pairId, side, text) {
      const el = document.createElement('div');
      el.className = 'match-item';
      el.tabIndex = 0; el.setAttribute('role', 'button');
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
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
      award(8, 'match:' + pairId);

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
    const raw = LESSON_DATA?.exercises?.dictation;
    if (!container || !raw) return;

    const words = normalizeDictation(raw);
    if (!words.length) return;

    words.forEach((item, i) => {
      const isPhrase = String(item.word || '').trim().includes(' ');
      const unitLabel = isPhrase ? 'Фраза' : 'Слово';
      const card = document.createElement('div');
      card.className = 'dictation-card';
      card.innerHTML = `
        <div class="dictation-top">
          <button class="big-play-btn" title="Прослушать" data-text="${escapeHtml(item.audio || item.word)}">🔊</button>
          <div class="dictation-info">
            <span class="dictation-num">${unitLabel} ${i + 1} из ${words.length}</span><br>
            Нажмите 🔊 и напишите то, что услышали
          </div>
        </div>
        <input class="dictation-input" id="dict-${i}" aria-label="${window.I18N ? I18N.t('Диктант') : 'Диктант'}: ${i + 1}"
               placeholder="${isPhrase ? 'Введите фразу…' : 'Введите слово…'}"
               autocomplete="off" spellcheck="false">
      `;
      rememberInput(card.querySelector('.dictation-input'));
      // Speak button
      card.querySelector('.big-play-btn').addEventListener('click', () => {
        TTS.speak(item.audio || item.word);
      });
      // Enter key
      card.querySelector('.dictation-input').addEventListener('keydown', e => {
        if (e.key === 'Enter' && !_isMobile()) checkSingleDict(i, item.word);
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

        if (correct === total) award(20, 'dict:perfect');

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
    session.answers[input.id] = input.value; saveSession();
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
      const wrong = total - correct;
      el.className = 'result-banner show fail';
      el.innerHTML = `❌ Ошибок: ${wrong} из ${total}. Верно: ${correct}. Попробуй исправить!`;
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
     One task at a time with "Далее →" button.
     ════════════════════════════════════ */

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

  function _mkNextBtn(isLast) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'step-next-btn';
    b.textContent = isLast ? 'Завершить ✓' : 'Далее →';
    return b;
  }

  /**
   * Шаг с полем ввода: «Проверить» (неактивна, пока поле пустое) →
   * при верном ответе сам переходит дальше, при неверном кнопка
   * становится «Далее →» / «Завершить ✓». Так кнопка всегда говорит,
   * что сделает: проверит или пропустит.
   * @param {object} o
   *   host, inp, isLast — карточка, поле, последний ли шаг
   *   evaluate()        — проверить поле (ставит input-correct / input-wrong)
   *   onWrong()         — что показать при ошибке (необязательно)
   *   retry             — можно ли исправить ответ после ошибки
   *   onDone(correct)   — перейти к следующему шагу
   */
  function _wireCheckStep(o) {
    const { host, inp, isLast } = o;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'step-next-btn';
    host.appendChild(btn);

    let checked = false;
    let done = false;
    const isChecked = () => inp.classList.contains('input-correct') || inp.classList.contains('input-wrong');

    function reset() {
      checked = false;
      btn.textContent = 'Проверить';
      btn.disabled = !inp.value.trim();
    }
    function finish() {
      if (done) return;
      done = true;
      session.steps[inp.id] = inp.classList.contains('input-correct'); saveSession();
      o.onDone(inp.classList.contains('input-correct'));
    }
    function check() {
      if (!inp.value.trim()) return;
      // Enter уже мог проверить поле обработчиком упражнения — не дублируем
      if (!isChecked()) o.evaluate();
      checked = true;
      if (inp.classList.contains('input-correct')) {
        btn.disabled = true;
        setTimeout(finish, 600);   // короткая пауза, чтобы увидеть зелёный
      } else {
        wrong();
      }
    }
    function wrong() {
      checked = true;
      inp.classList.remove('input-correct');
      inp.classList.add('input-wrong');
      o.onWrong?.();
      btn.textContent = isLast ? 'Завершить ✓' : 'Далее →';
      btn.disabled = false;
    }

    btn.addEventListener('click', () => (checked ? finish() : check()));
    inp.addEventListener('input', () => {
      if (checked && o.retry && !done) {
        inp.classList.remove('input-correct', 'input-wrong');
        reset();
      } else if (!checked) {
        btn.disabled = !inp.value.trim();
      }
    });
    inp.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (!checked) check();
      else finish();
    });
    reset();
    return { btn, giveUp: wrong };
  }

  /* ── Fill step ── */
  function applyFillStep() {
    if (!_isMobile()) return;
    const cnt = document.getElementById('fillContainer');
    if (!cnt) return;
    const qs = [...cnt.querySelectorAll('.blank-question')];
    if (!qs.length) return;

    let idx = qs.findIndex(q => !(q.querySelector('input')?.id in session.steps));
    if (idx < 0) idx = 0;
    let ok = qs.slice(0, idx).filter(q => session.steps[q.querySelector('input')?.id]).length;
    const total = qs.length;
    const bar = _makeStepBar(total, cnt);

    qs.forEach((q, qi) => { if (qi !== idx) q.style.display = 'none'; });
    _updateBar(bar, idx, total);

    const checkAllBtn = document.getElementById('checkFillBtn');
    if (checkAllBtn) checkAllBtn.style.display = 'none';

    function advance() {
      qs[idx].style.display = 'none';
      idx++;
      if (idx < total) {
        qs[idx].style.display = '';
        _updateBar(bar, idx, total);
        setTimeout(() => qs[idx].querySelector('.blank-input')?.focus(), 80);
      } else {
        showBanner('fillResult', ok, total);
        Progress.markSectionDone('fill', Math.round(ok / total * 100));
        qs.forEach(q => { q.style.display = ''; q.querySelector('.step-next-btn').hidden = true; });
        retryButton(document.getElementById('fillResult'));
      }
    }

    qs.forEach((q, qi) => {
      const inp = q.querySelector('.blank-input');
      if (!inp) return;
      _wireCheckStep({
        host: q, inp, isLast: qi === total - 1, retry: true,
        evaluate: () => inp._evaluate?.(),
        onDone: correct => { if (correct) ok++; advance(); }
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

    let idx = Math.min(session.steps.choice || 0, qs.length - 1);
    const total = qs.length;
    const bar = _makeStepBar(total, cnt);

    qs.forEach((q, qi) => { if (qi !== idx) q.style.display = 'none'; });
    _updateBar(bar, idx, total);

    qs.forEach((q, qi) => {
      const btn = _mkNextBtn(qi === total - 1);
      q.appendChild(btn);
      btn.disabled = q.dataset.answered !== 'true';

      btn.addEventListener('click', () => {
        if (q.dataset.answered !== 'true') return;
        session.steps.choice = qi + 1; saveSession();
        q.style.display = 'none';
        idx++;
        if (idx < total) {
          qs[idx].style.display = '';
          _updateBar(bar, idx, total);
        } else {
          // Count correct answers from DOM state
          let correct = 0;
          qs.forEach(q => { if (q.dataset.correct === 'true') correct++; q.style.display = ''; q.querySelector('.step-next-btn').hidden = true; });
          showBanner('choiceResult', correct, total);
          Progress.markSectionDone('choice', Math.round(correct / total * 100));
          retryButton(document.getElementById('choiceResult'));
        }
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

    const dictData = normalizeDictation(LESSON_DATA?.exercises?.dictation);
    let idx = cards.findIndex(q => !(q.querySelector('input')?.id in session.steps));
    if (idx < 0) idx = 0;
    let ok = cards.slice(0, idx).filter(q => session.steps[q.querySelector('input')?.id]).length;
    const total = cards.length;
    const bar = _makeStepBar(total, cnt);

    cards.forEach((c, ci) => { if (ci !== idx) c.style.display = 'none'; });
    _updateBar(bar, idx, total);

    const checkDictBtn = document.getElementById('checkDictBtn');
    if (checkDictBtn) checkDictBtn.style.display = 'none';
    // Прогресс уже показывает полоса шагов — «Слово 1 из 8» в карточке лишнее
    cnt.classList.add('step-mode');

    function advance() {
      cards[idx].style.display = 'none';
      idx++;
      if (idx < total) {
        cards[idx].style.display = '';
        _updateBar(bar, idx, total);
        setTimeout(() => cards[idx].querySelector('.dictation-input')?.focus(), 80);
      } else {
        showBanner('dictResult', ok, total);
        Progress.markSectionDone('dict', Math.round(ok / total * 100));
        if (ok === total) award(20, 'dict:perfect');
        cards.forEach(c => { c.style.display = ''; c.querySelector('.step-next-btn').hidden = true; });
        retryButton(document.getElementById('dictResult'));
      }
    }

    cards.forEach((card, ci) => {
      const inp = card.querySelector('.dictation-input');
      if (!inp) return;
      const word = dictData[ci]?.word || '';

      function reveal() {
        inp.readOnly = true;
        reveal.btn?.remove();
        if (card.querySelector('.dict-answer')) return;
        const ans = document.createElement('div');
        ans.className = 'dict-answer';
        ans.innerHTML = `<span>Правильный ответ:</span> <b lang="de">${escapeHtml(word)}</b>`;
        inp.insertAdjacentElement('afterend', ans);
      }

      const step = _wireCheckStep({
        host: card, inp, isLast: ci === total - 1,
        evaluate: () => checkSingleDict(ci, word),
        onWrong: reveal,
        onDone: correct => { if (correct) ok++; advance(); }
      });

      // «Не знаю» — показать ответ без попытки, дальше как при ошибке
      const giveUp = document.createElement('button');
      giveUp.type = 'button';
      giveUp.className = 'step-skip-btn';
      giveUp.textContent = 'Показать ответ';
      giveUp.addEventListener('click', () => step.giveUp());
      reveal.btn = giveUp;
      card.appendChild(giveUp);
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
