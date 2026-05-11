/* ═══════════════════════════════════════════════
   js/lesson-render.js
   Universal renderer — works for ALL lessons.
   Reads LESSON_DATA and CURRENT_LESSON_NUM globals.
   ═══════════════════════════════════════════════ */

const LessonRender = (() => {

  /* ── A1 nav config ── */
  const A1_LESSONS = [
    { num: 1,  title: 'Приветствия',    icon: '👋' },
    { num: 2,  title: 'Числа 1–20',     icon: '🔢' },
    { num: 3,  title: 'Цвета',          icon: '🎨' },
    { num: 4,  title: 'Семья',          icon: '👨‍👩‍👧' },
    { num: 5,  title: 'Дни недели',     icon: '📅' },
    { num: 6,  title: 'Еда и напитки',  icon: '☕' },
    { num: 7,  title: 'В городе',       icon: '🏙️' },
    { num: 8,  title: 'Время',          icon: '⏰' }
  ];

  /* ── A2 nav config ── */
  const A2_LESSONS = [
    { num: 1, title: 'Распорядок дня',   icon: '⏰' },
    { num: 2, title: 'Хобби и досуг',    icon: '🎨' },
    { num: 3, title: 'У врача',          icon: '🩺' },
    { num: 4, title: 'Путешествия',      icon: '✈️' },
    { num: 5, title: 'Покупки и одежда', icon: '🛍️' },
    { num: 6, title: 'Жильё и мебель',   icon: '🏠' },
    { num: 7, title: 'Работа',           icon: '💼' },
    { num: 8, title: 'Погода',           icon: '☀️' }
  ];

  /* ── B1 nav config ── */
  const B1_LESSONS = [
    { num: 1, title: 'Konjunktiv II',    icon: '💭' },
    { num: 2, title: 'Пассивный залог',  icon: '🔄' },
    { num: 3, title: 'Придаточные',      icon: '🔗' },
    { num: 4, title: 'Союзы weil/dass',  icon: '📎' },
    { num: 5, title: 'Инфинитив (zu)',   icon: '∞'  },
    { num: 6, title: 'Работа и резюме',  icon: '💼' },
    { num: 7, title: 'Аргументация',     icon: '🗣️' },
    { num: 8, title: 'Окружающая среда', icon: '🌿' }
  ];

  /* ── B2 nav config ── */
  const B2_LESSONS = [
    { num: 1, title: 'Причастия',        icon: '📝' },
    { num: 2, title: 'Модальные части.', icon: '💬' },
    { num: 3, title: 'Коннекторы',       icon: '⛓️' },
    { num: 4, title: 'Номинализация',    icon: '🔤' },
    { num: 5, title: 'Научный стиль',    icon: '🔬' },
    { num: 6, title: 'Экономика',        icon: '💹' },
    { num: 7, title: 'Дискуссия',        icon: '⚖️' },
    { num: 8, title: 'Сложные тексты',   icon: '📚' }
  ];

  const ALL_LEVELS = [
    { key: 'a1', label: 'A1', name: 'Начинающий',    lessons: A1_LESSONS },
    { key: 'a2', label: 'A2', name: 'Элементарный',  lessons: A2_LESSONS },
    { key: 'b1', label: 'B1', name: 'Средний',        lessons: B1_LESSONS },
    { key: 'b2', label: 'B2', name: 'Выше среднего',  lessons: B2_LESSONS }
  ];

  /* ── Helpers ── */
  function esc(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  /* ── Sidebar nav ── */
  function renderNav() {
    const nav = document.getElementById('lessonNav');
    if (!nav) return;

    const curLevel = typeof CURRENT_LESSON_LEVEL !== 'undefined' ? CURRENT_LESSON_LEVEL : 'a1';
    const curNum   = typeof CURRENT_LESSON_NUM   !== 'undefined' ? CURRENT_LESSON_NUM   : 1;
    const completed = JSON.parse(localStorage.getItem('dm_progress') || '{}').completedLessons || [];

    ALL_LEVELS.forEach(level => {
      const isCurrent = level.key === curLevel;

      const group = document.createElement('div');
      group.className = `level-group${isCurrent ? '' : ' collapsed'}`;
      group.id = `lvl-${level.key}`;
      group.innerHTML = `
        <div class="level-toggle" onclick="toggleLevel('lvl-${level.key}')">
          <span class="badge badge-level${isCurrent ? ' current' : ''}">${level.label}</span>
          <span style="font-size:13px;color:var(--text-muted)">${level.name}</span>
          <span class="level-toggle-arrow">▼</span>
        </div>`;

      const lessonsDiv = document.createElement('div');
      lessonsDiv.className = 'level-lessons';

      level.lessons.forEach(l => {
        const id     = `${level.key}-${String(l.num).padStart(2,'0')}`;
        const isDone = completed.includes(id);
        const isActive = isCurrent && l.num === curNum;
        const isLocked = isCurrent && l.num > curNum && !isDone;

        const href = level.key === curLevel
          ? `../lesson-${String(l.num).padStart(2,'0')}/index.html`
          : `../../${level.key}/lesson-${String(l.num).padStart(2,'0')}/index.html`;

        const el = document.createElement(isLocked ? 'div' : 'a');
        if (!isLocked) el.href = href;
        el.className = [
          'lesson-item',
          isActive ? 'active'            : '',
          isLocked ? 'locked'            : '',
          isDone && !isActive ? 'done'   : ''
        ].filter(Boolean).join(' ');

        el.innerHTML = `
          <span class="lesson-num">${String(l.num).padStart(2,'0')}</span>
          <span class="lesson-name">${l.title}</span>
          <span class="lesson-status ${isDone ? 'done' : isLocked ? 'lock' : ''}">
            ${isDone ? '✓' : isLocked ? '🔒' : ''}
          </span>`;
        lessonsDiv.appendChild(el);
      });

      group.appendChild(lessonsDiv);
      nav.appendChild(group);
    });
  }

  /* ── Lesson header ── */
  function renderHeader() {
    const titleEl = document.getElementById('lessonTitle');
    const metaEl  = document.getElementById('lessonMeta');
    if (!titleEl || !LESSON_DATA) return;

    titleEl.textContent = LESSON_DATA.title;

    if (metaEl) {
      const themeBtn = metaEl.querySelector('#themeToggle2') || '';
      metaEl.innerHTML = `
        <span class="badge badge-violet">🎯 ${esc(LESSON_DATA.level)}</span>
        <span class="badge badge-gold">⏱ ${esc(LESSON_DATA.meta?.duration || '')}</span>
        <span class="badge badge-green">📚 ${LESSON_DATA.vocabulary?.length || 0} слов</span>
        <button id="themeToggle2" onclick="toggleTheme()" title="Сменить тему"
          style="margin-left:auto;background:var(--surface3);border:1px solid var(--border);
                 border-radius:var(--r-full);padding:5px 12px;font-size:16px;cursor:pointer">
          ${(localStorage.getItem('dm_theme')||'dark')==='dark'?'☀️':'🌙'}
        </button>
      `;
    }
  }

  /* ── Phrase grid ── */
  function renderPhrases() {
    const grid = document.getElementById('phraseGrid');
    if (!grid || !LESSON_DATA?.phrases) return;

    LESSON_DATA.phrases.forEach(p => {
      const card = document.createElement('div');
      card.className = 'phrase-card';

      // Tokenise: words get speak spans, punctuation stays plain
      const tokens = p.de.match(/[A-Za-zÄäÖöÜüß]+|[^A-Za-zÄäÖöÜüß\s]+|\s+/g) || [p.de];
      const deHtml = tokens.map(tok => {
        if (/[A-Za-zÄäÖöÜüß]/.test(tok)) {
          return `<span class="word-speak" onclick="event.stopPropagation();speak('${esc(tok)}')">${esc(tok)}<span class="wi">🔊</span></span>`;
        }
        return esc(tok).replace(/\s/g, ' ');
      }).join('');

      card.innerHTML = `
        <div class="phrase-body">
          <div class="phrase-de">${deHtml}</div>
          <div class="phrase-ru">${esc(p.ru)}</div>
          ${p.note ? `<div class="phrase-note">${esc(p.note)}</div>` : ''}
        </div>
        <button class="speak-btn" onclick="speak('${esc(p.audio)}')" title="Озвучить фразу">🔊</button>
      `;
      grid.appendChild(card);
    });
  }

  /* ── Vocab table ── */
  function renderVocab() {
    const tbody = document.getElementById('vocabTableBody');
    if (!tbody || !LESSON_DATA?.vocabulary) return;

    LESSON_DATA.vocabulary.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="vocab-de">
          ${w.article ? `<span class="vocab-article">${esc(w.article)}</span>` : ''}
          <span class="word-speak" onclick="speak('${esc(w.de)}')">
            ${esc(w.de)}<span class="wi" style="opacity:1;font-size:11px">🔊</span>
          </span>
        </td>
        <td class="vocab-ipa">${esc(w.ipa)}</td>
        <td>${esc(w.ru)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ── Grammar boxes ── */
  function renderGrammar() {
    const container = document.getElementById('grammarBoxes');
    const titleEl   = document.getElementById('grammarTitle');
    if (!container || !LESSON_DATA?.grammar) return;

    if (titleEl && LESSON_DATA.grammar[0]?.title) {
      titleEl.textContent = LESSON_DATA.grammar[0].title.replace(/^[^ ]+ /, '');
    }

    LESSON_DATA.grammar.forEach((g, gi) => {
      const box = document.createElement('div');
      box.className = 'grammar-box';
      box.style.marginBottom = '16px';

      let inner = `<div class="grammar-box-title">${esc(g.title)}</div>
                   <div class="grammar-rule">${g.body}</div>`;

      if (g.conjugation) {
        inner += `<table class="pattern-table" style="margin-top:16px">`;
        g.conjugation.forEach(row => {
          inner += `<tr>
            <td>${esc(row.pronoun)}</td>
            <td><span class="conj-word" onclick="speak('${esc(row.audio)}')">
              <strong>${esc(row.form)}</strong><span class="wi">🔊</span>
            </span></td>
            <td>${esc(row.translation)}</td>
          </tr>`;
        });
        inner += `</table>`;
      }

      box.innerHTML = inner;
      container.appendChild(box);
    });
  }

  /* ── Fill blanks ── */
  function renderFillBlanks() {
    const container = document.getElementById('fillContainer');
    if (!container || !LESSON_DATA?.exercises?.fillBlanks) return;

    LESSON_DATA.exercises.fillBlanks.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'blank-question';
      div.id = `bq-${i}`;

      div.innerHTML = `
        <div class="blank-sentence">
          ${q.before ? `<span>${esc(q.before)}</span>` : ''}
          <span class="blank-input-wrap" id="wrap-${i}">
            <input class="blank-input" id="blank-${i}" placeholder="?"
                   autocomplete="off" spellcheck="false"
                   style="width:${Math.max(70, q.blank.length * 14 + 24)}px">
          </span>
          ${q.after ? `<span>${esc(q.after)}</span>` : ''}
        </div>
        <div class="blank-translation">${esc(q.translation)}</div>
      `;
      container.appendChild(div);

      const input = div.querySelector('.blank-input');
      if (typeof Exercises !== 'undefined' && Exercises.initBlankInput) {
        Exercises.initBlankInput(input, q.blank, q.hintWord, q.hintRule);
      }
    });
  }

  /* ── Theme ── */
  function initThemeGlobal() {
    const saved = localStorage.getItem('dm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('#themeToggle,#themeToggle2').forEach(b => {
      if (b) b.textContent = saved === 'dark' ? '☀️' : '🌙';
    });
  }

  /* ── Public init ── */
  function init() {
    renderNav();
    renderHeader();
    renderPhrases();
    renderVocab();
    renderGrammar();
    renderFillBlanks();
  }

  return { init };
})();

/* ── Global helpers called from inline HTML ── */
function initTheme() {
  const saved = localStorage.getItem('dm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.querySelectorAll('#themeToggle,#themeToggle2').forEach(b => {
    if (b) b.textContent = saved === 'dark' ? '☀️' : '🌙';
  });
}
function toggleTheme() {
  const cur  = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dm_theme', next);
  document.querySelectorAll('#themeToggle,#themeToggle2').forEach(b => {
    if (b) b.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}
function openSidebar()   { document.getElementById('sidebar')?.classList.add('open'); document.getElementById('sidebarOverlay')?.classList.add('show'); }
function closeSidebar()  { document.getElementById('sidebar')?.classList.remove('open'); document.getElementById('sidebarOverlay')?.classList.remove('show'); }
function toggleLevel(id) { document.getElementById(id)?.classList.toggle('collapsed'); }
