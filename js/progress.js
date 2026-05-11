/* ═══════════════════════════════════════════════
   js/progress.js — XP, Streak, Lesson Progress
                    Uses localStorage for persistence

   ✦ v2 changes:
     • Section completion persists across sessions
       (per-lesson, in localStorage).
     • UI badge "✅ N/5 секций" auto-injected into
       the lesson header.
     • Lesson-complete banner re-shown automatically
       when reopening an already-finished lesson;
       XP reward never granted twice.
   ═══════════════════════════════════════════════ */

const Progress = (() => {
  const STORAGE_KEY            = 'dm_progress';
  const SECTIONS_KEY_PREFIX    = 'dm_sections:';   // dm_sections:a1-01
  const XP_PER_LEVEL           = 200;

  /* All sections that must be finished before a lesson counts as done */
  const REQUIRED_SECTIONS = ['flashcards', 'fill', 'choice', 'match', 'dict'];

  const SECTION_LABELS = {
    flashcards: 'Карточки',
    fill:       'Заполни пропуски',
    choice:     'Выбор ответа',
    match:      'Соединение пар',
    dict:       'Диктант'
  };

  /* In-memory tracker for the lesson currently on screen */
  let _currentLessonId = null;
  let _doneSections    = new Set();
  let _sectionScores   = {};

  /* Default global state */
  const defaults = {
    xp: 0,
    streak: 0,
    lastActive: null,          // ISO date string
    completedLessons: [],      // e.g. ['a1-01', 'a1-02']
    lessonScores: {}           // e.g. { 'a1-01': 87 }
  };

  /* ════════════════════════════════════
     Load / Save  —  global state
     ════════════════════════════════════ */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      console.warn('Progress: localStorage not available.');
    }
  }

  /* ════════════════════════════════════
     Load / Save  —  per-lesson sections
     ════════════════════════════════════ */
  function _loadSections(lessonId) {
    try {
      const raw = localStorage.getItem(SECTIONS_KEY_PREFIX + lessonId);
      if (!raw) return { done: [], scores: {} };
      const parsed = JSON.parse(raw);
      return {
        done:   Array.isArray(parsed.done) ? parsed.done : [],
        scores: parsed.scores && typeof parsed.scores === 'object' ? parsed.scores : {}
      };
    } catch {
      return { done: [], scores: {} };
    }
  }

  function _saveSections(lessonId) {
    try {
      localStorage.setItem(
        SECTIONS_KEY_PREFIX + lessonId,
        JSON.stringify({ done: [..._doneSections], scores: _sectionScores })
      );
    } catch { /* quota or disabled — silently ignore */ }
  }

  /* ════════════════════════════════════
     Streak logic
     ════════════════════════════════════ */
  function updateStreak(state) {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.lastActive) {
      state.streak = 1;
    } else {
      const last = new Date(state.lastActive);
      const diff = Math.floor((new Date(today) - last) / 86400000);
      if (diff === 0) {
        // already active today — no change
      } else if (diff === 1) {
        state.streak += 1;
      } else {
        state.streak = 1;
      }
    }
    state.lastActive = today;
    return state;
  }

  /* ════════════════════════════════════
     Section tracking
     ════════════════════════════════════ */

  /**
   * Detect lesson change and reload section state from storage.
   */
  function _ensureLessonContext() {
    const id = (typeof LESSON_DATA !== 'undefined') ? LESSON_DATA?.id : null;
    if (id && _currentLessonId !== id) {
      _currentLessonId = id;
      const stored = _loadSections(id);
      _doneSections  = new Set(stored.done.filter(s => REQUIRED_SECTIONS.includes(s)));
      _sectionScores = { ...stored.scores };
    }
  }

  /**
   * Mark one section of the current lesson as completed.
   * @param {'flashcards'|'fill'|'choice'|'match'|'dict'} name
   * @param {number} [scorePct]  optional 0–100 score
   */
  function markSectionDone(name, scorePct) {
    _ensureLessonContext();
    if (!REQUIRED_SECTIONS.includes(name)) return;

    _doneSections.add(name);
    if (typeof scorePct === 'number' && !Number.isNaN(scorePct)) {
      _sectionScores[name] = Math.max(0, Math.min(100, Math.round(scorePct)));
    }
    if (_currentLessonId) _saveSections(_currentLessonId);

    renderSectionProgress();
    tryFinishLesson();
  }

  function isLessonFullyDone() {
    _ensureLessonContext();
    return REQUIRED_SECTIONS.every(s => _doneSections.has(s));
  }

  function getCompletionStatus() {
    _ensureLessonContext();
    return {
      done:      [..._doneSections],
      pending:   REQUIRED_SECTIONS.filter(s => !_doneSections.has(s)),
      total:     REQUIRED_SECTIONS.length,
      completed: _doneSections.size,
      scores:    { ..._sectionScores }
    };
  }

  /**
   * Wipe progress for a specific lesson (or all lessons if no id given).
   * Useful for "Restart lesson" buttons or debugging.
   */
  function resetLessonProgress(lessonId) {
    if (lessonId) {
      try { localStorage.removeItem(SECTIONS_KEY_PREFIX + lessonId); } catch {}
      const state = load();
      state.completedLessons = state.completedLessons.filter(id => id !== lessonId);
      delete state.lessonScores[lessonId];
      save(state);
      if (_currentLessonId === lessonId) {
        _doneSections  = new Set();
        _sectionScores = {};
        renderSectionProgress();
      }
    } else {
      // Reset everything (use with care)
      try {
        Object.keys(localStorage)
          .filter(k => k === STORAGE_KEY || k.startsWith(SECTIONS_KEY_PREFIX))
          .forEach(k => localStorage.removeItem(k));
      } catch {}
      _doneSections  = new Set();
      _sectionScores = {};
      renderSectionProgress();
    }
  }

  function _averageScore() {
    const vals = Object.values(_sectionScores);
    if (!vals.length) return 100;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  /**
   * If all required sections are done: show banner, award reward XP
   * the first time only, persist completion. Idempotent.
   */
  function tryFinishLesson() {
    if (!isLessonFullyDone()) return;
    const id = (typeof LESSON_DATA !== 'undefined') ? LESSON_DATA?.id : null;
    if (!id) return;

    const banner = document.getElementById('lessonComplete');
    if (banner) banner.classList.add('show');

    const alreadyCompleted = isCompleted(id);
    const reward = (typeof LESSON_DATA !== 'undefined' && LESSON_DATA?.meta?.xpReward) || 100;

    // Update the XP label inside the banner so it matches reality
    const xpLabel = banner?.querySelector('.xp-earned');
    if (xpLabel) {
      xpLabel.textContent = alreadyCompleted
        ? '✅ Урок уже пройден ранее'
        : `⚡ +${reward} XP получено!`;
    }

    if (!alreadyCompleted) {
      addXP(reward);
    }
    completeLesson(id, _averageScore());
  }

  /* ════════════════════════════════════
     Public XP / completion API
     ════════════════════════════════════ */

  function addXP(amount) {
    const state = load();
    updateStreak(state);
    state.xp = Math.max(0, state.xp + amount);
    save(state);
    renderXP(state.xp);
    renderStreak(state.streak);
  }

  function completeLesson(lessonId, score) {
    const state = load();
    if (!state.completedLessons.includes(lessonId)) {
      state.completedLessons.push(lessonId);
    }
    state.lessonScores[lessonId] = score;
    save(state);
  }

  function isCompleted(lessonId) {
    return load().completedLessons.includes(lessonId);
  }

  function getScore(lessonId) {
    return load().lessonScores[lessonId] ?? null;
  }

  function getXP()     { return load().xp; }
  function getStreak() { return load().streak; }

  /* ════════════════════════════════════
     DOM rendering helpers
     ════════════════════════════════════ */

  function renderXP(xp) {
    const fill  = document.getElementById('xpFill');
    const label = document.getElementById('xpText');
    if (!fill || !label) return;
    const pct = Math.min((xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, 100);
    fill.style.width = pct + '%';
    label.textContent = `${xp % XP_PER_LEVEL} / ${XP_PER_LEVEL} XP`;
  }

  function renderStreak(streak) {
    const el = document.getElementById('streakCount');
    if (el) el.textContent = streak;
  }

  function renderLessonProgress(pct) {
    const bar = document.getElementById('lessonProgressFill');
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
  }

  /**
   * Insert (or update) the "N/5 секций" badge in the lesson header.
   */
  function _ensureSectionBadge() {
    if (document.getElementById('sectionProgressBadge')) return;

    const meta = document.querySelector('.lesson-meta');
    if (!meta) return;   // not on a lesson page

    const badge = document.createElement('span');
    badge.className = 'badge section-progress-badge';
    badge.id = 'sectionProgressBadge';
    badge.style.cssText = [
      'cursor:help',
      'transition:all .25s ease'
    ].join(';');
    badge.title = 'Кликни, чтобы посмотреть прогресс по урокам';

    // Insert before the theme-toggle button (which is pushed to the right)
    const themeBtn = meta.querySelector('#themeToggle');
    if (themeBtn) meta.insertBefore(badge, themeBtn);
    else          meta.appendChild(badge);

    // Tooltip on click — shows what's done / what's left
    badge.addEventListener('click', () => {
      const status = getCompletionStatus();
      const doneList    = status.done.map(s => '✓ ' + (SECTION_LABELS[s] || s)).join('\n');
      const pendingList = status.pending.map(s => '○ ' + (SECTION_LABELS[s] || s)).join('\n');
      const text = [
        `Прогресс урока: ${status.completed} из ${status.total}`,
        doneList    ? '\nПройдено:\n' + doneList    : '',
        pendingList ? '\nОсталось:\n' + pendingList : ''
      ].filter(Boolean).join('\n');
      alert(text);
    });
  }

  function renderSectionProgress() {
    _ensureSectionBadge();
    const el = document.getElementById('sectionProgressBadge');
    if (!el) return;

    const done  = _doneSections.size;
    const total = REQUIRED_SECTIONS.length;
    el.textContent = `✅ ${done}/${total} секций`;

    if (done === total) {
      // All sections finished — gold accent
      el.style.background  = 'rgba(255,193,7,.15)';
      el.style.borderColor = 'rgba(255,193,7,.4)';
      el.style.color       = '#f9a825';
    } else if (done > 0) {
      // In-progress — green
      el.style.background  = 'rgba(120,200,110,.1)';
      el.style.borderColor = 'rgba(120,200,110,.3)';
      el.style.color       = '#4caf50';
    } else {
      // Nothing done yet — neutral grey
      el.style.background  = 'rgba(150,150,150,.08)';
      el.style.borderColor = 'rgba(150,150,150,.25)';
      el.style.color       = '#888';
    }
  }

  /* ════════════════════════════════════
     Init
     ════════════════════════════════════ */

  /**
   * Call once on page load to sync UI with stored state.
   */
  function init() {
    const state = load();
    updateStreak(state);
    save(state);
    renderXP(state.xp);
    renderStreak(state.streak);

    // Per-lesson section state
    _ensureLessonContext();
    renderSectionProgress();

    // If the lesson was already fully completed in a previous session,
    // re-show the completion banner (no XP awarded again).
    if (isLessonFullyDone()) {
      tryFinishLesson();
    }
  }

  return {
    init,
    addXP,
    completeLesson,
    isCompleted,
    getScore,
    getXP,
    getStreak,
    renderLessonProgress,

    // ✦ Section-completion API
    markSectionDone,
    isLessonFullyDone,
    getCompletionStatus,
    tryFinishLesson,
    renderSectionProgress,
    resetLessonProgress
  };
})();
