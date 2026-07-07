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

  function jsStr(str) {
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, ' ');
  }

  const BASIC_WORDS = {
    der: { ru: 'артикль мужского рода / форма родительного или дательного падежа', kind: 'Артикль' },
    die: { ru: 'артикль женского рода или множественного числа', kind: 'Артикль' },
    das: { ru: 'артикль среднего рода / это', kind: 'Артикль' },
    den: { ru: 'артикль мужского рода в Akkusativ или форма Dativ plural', kind: 'Артикль' },
    dem: { ru: 'артикль в Dativ: мужской или средний род', kind: 'Артикль' },
    des: { ru: 'артикль в Genitiv: мужской или средний род', kind: 'Артикль' },
    ein: { ru: 'один / неопределённый артикль', kind: 'Артикль' },
    eine: { ru: 'одна / неопределённый артикль женского рода', kind: 'Артикль' },
    einen: { ru: 'неопределённый артикль мужского рода в Akkusativ', kind: 'Артикль' },
    einem: { ru: 'неопределённый артикль в Dativ', kind: 'Артикль' },
    sich: { ru: 'себя; возвратное местоимение', kind: 'Местоимение' },
    ich: { ru: 'я', kind: 'Местоимение' },
    du: { ru: 'ты', kind: 'Местоимение' },
    er: { ru: 'он', kind: 'Местоимение' },
    sie: { ru: 'она / они / Вы', kind: 'Местоимение' },
    wir: { ru: 'мы', kind: 'Местоимение' },
    ihr: { ru: 'вы / её / их / ваш', kind: 'Местоимение' },
    es: { ru: 'оно / это', kind: 'Местоимение' },
    mein: { ru: 'мой', kind: 'Притяжательное' },
    meine: { ru: 'моя / мои', kind: 'Притяжательное' },
    meiner: { ru: 'моей / моего', kind: 'Притяжательное' },
    dein: { ru: 'твой', kind: 'Притяжательное' },
    deine: { ru: 'твоя / твои', kind: 'Притяжательное' },
    deiner: { ru: 'твоей / твоего', kind: 'Притяжательное' },
    sein: { ru: 'его / свой', kind: 'Притяжательное' },
    seine: { ru: 'его / свои', kind: 'Притяжательное' },
    ihre: { ru: 'её / их / ваши', kind: 'Притяжательное' },
    ist: { ru: 'есть, является; форма sein', kind: 'Глагол' },
    sind: { ru: 'есть, являются; форма sein', kind: 'Глагол' },
    bin: { ru: 'есть; форма sein для ich', kind: 'Глагол' },
    bist: { ru: 'есть; форма sein для du', kind: 'Глагол' },
    auf: { ru: 'на; также часть отделяемых глаголов', kind: 'Предлог' },
    an: { ru: 'на, у, к; часто о днях и контакте', kind: 'Предлог' },
    in: { ru: 'в', kind: 'Предлог' },
    im: { ru: 'в; слитно in + dem', kind: 'Предлог' },
    am: { ru: 'в/на; слитно an + dem', kind: 'Предлог' },
    um: { ru: 'вокруг; в точное время', kind: 'Предлог' },
    mit: { ru: 'с; при помощи', kind: 'Предлог' },
    zu: { ru: 'к, в; инфинитивная частица zu', kind: 'Предлог' },
    zum: { ru: 'к/в; слитно zu + dem', kind: 'Предлог' },
    zur: { ru: 'к/в; слитно zu + der', kind: 'Предлог' },
    vor: { ru: 'перед / до', kind: 'Предлог' },
    nach: { ru: 'после / в направлении', kind: 'Предлог' },
    aus: { ru: 'из', kind: 'Предлог' },
    von: { ru: 'от / о происхождении или исполнителе', kind: 'Предлог' },
    für: { ru: 'для / за', kind: 'Предлог' },
    ohne: { ru: 'без', kind: 'Предлог' },
    und: { ru: 'и', kind: 'Союз' },
    oder: { ru: 'или', kind: 'Союз' },
    aber: { ru: 'но', kind: 'Союз' },
    weil: { ru: 'потому что', kind: 'Союз' },
    dass: { ru: 'что; союз придаточного предложения', kind: 'Союз' },
    wenn: { ru: 'если / когда', kind: 'Союз' },
    nicht: { ru: 'не', kind: 'Отрицание' },
    kein: { ru: 'никакой / не один', kind: 'Отрицание' },
    keine: { ru: 'никакая / никакие', kind: 'Отрицание' }
  };

  const NOUN_FORM_OVERRIDES = {
    buch: [
      { word: 'Bücher', ru: 'книги', kind: 'Форма мн. числа', detail: 'das Buch → die Bücher' }
    ],
    film: [
      { word: 'Filme', ru: 'фильмы', kind: 'Форма мн. числа', detail: 'der Film → die Filme' }
    ],
    hobby: [
      { word: 'Hobbys', ru: 'хобби', kind: 'Форма мн. числа', detail: 'das Hobby → die Hobbys' }
    ]
  };

  const VERB_FORM_OVERRIDES = {
    lesen: [
      { word: 'lese', ru: 'читаю', detail: 'ich lese' },
      { word: 'liest', ru: 'читаешь / читает', detail: 'du liest · er/sie/es liest' },
      { word: 'lest', ru: 'читаете', detail: 'ihr lest' }
    ],
    sprechen: [
      { word: 'spreche', ru: 'говорю', detail: 'ich spreche' },
      { word: 'sprichst', ru: 'говоришь', detail: 'du sprichst' },
      { word: 'spricht', ru: 'говорит', detail: 'er/sie/es spricht' },
      { word: 'sprecht', ru: 'говорите', detail: 'ihr sprecht' }
    ],
    sehen: [
      { word: 'sehe', ru: 'вижу', detail: 'ich sehe' },
      { word: 'siehst', ru: 'видишь', detail: 'du siehst' },
      { word: 'sieht', ru: 'видит', detail: 'er/sie/es sieht' },
      { word: 'seht', ru: 'видите', detail: 'ihr seht' }
    ]
  };

  let wordLexicon = null;
  let wordTipCloseTimer = null;

  function keyOf(str) {
    const m = String(str || '').match(/[A-Za-zÄäÖöÜüß]+/);
    return m ? m[0].toLowerCase() : '';
  }

  function wordsOf(str) {
    return String(str || '').match(/[A-Za-zÄäÖöÜüß]+/g) || [];
  }

  function addInfo(map, word, info) {
    const key = keyOf(word);
    if (!key) return;
    const current = map.get(key) || {
      word: word,
      kind: info.kind || 'Слово',
      translations: [],
      details: [],
      conjugations: []
    };

    if (info.word && String(info.word).length > String(current.word || '').length) current.word = info.word;
    if (info.kind && current.kind === 'Слово') current.kind = info.kind;
    if (info.ru && !current.translations.includes(info.ru)) current.translations.push(info.ru);
    if (info.detail && !current.details.includes(info.detail)) current.details.push(info.detail);
    if (info.conjugation && !current.conjugations.includes(info.conjugation)) {
      current.conjugations.push(info.conjugation);
    }
    map.set(key, current);
  }

  function addGermanTerm(map, term, ru, extra = {}) {
    const words = wordsOf(String(term || '').replace(/\([^)]*\)/g, '').split(',')[0]);
    const content = words.filter(w => !['der', 'die', 'das', 'ein', 'eine', 'einen'].includes(w.toLowerCase()));
    if (!extra.allowMultiWord && content.length > 1) return;
    (content.length ? content : words).forEach(word => addInfo(map, word, { ...extra, word, ru }));
  }

  function vocabularyHeadword(term) {
    const words = wordsOf(String(term || '').replace(/\([^)]*\)/g, '').split(',')[0]);
    return words.filter(w => !['der', 'die', 'das', 'ein', 'eine', 'einen'].includes(w.toLowerCase()))[0] || '';
  }

  function addNounForms(map, term, ru, detail) {
    const headword = vocabularyHeadword(term);
    const overrideForms = NOUN_FORM_OVERRIDES[keyOf(headword)] || [];
    overrideForms.forEach(form => addInfo(map, form.word, {
      ...form,
      ru: form.ru || ru,
      kind: form.kind || 'Форма слова',
      detail: form.detail || detail
    }));
  }

  function addVerbForms(map, term, ru, detail) {
    const headword = vocabularyHeadword(term);
    const lower = keyOf(headword);
    if (!lower || !/(en|ern|eln)$/.test(lower)) return;

    const overrideForms = VERB_FORM_OVERRIDES[lower] || [];
    overrideForms.forEach(form => addInfo(map, form.word, {
      word: form.word,
      kind: 'Форма глагола',
      ru: form.ru || ru,
      detail: form.detail || detail
    }));

    if (overrideForms.length || !lower.endsWith('en')) return;

    const stem = headword.slice(0, -2);
    [
      { word: `${stem}e`, detail: `ich ${stem}e` },
      { word: `${stem}st`, detail: `du ${stem}st` },
      { word: `${stem}t`, detail: `er/sie/es ${stem}t · ihr ${stem}t` }
    ].forEach(form => addInfo(map, form.word, {
      word: form.word,
      kind: 'Форма глагола',
      ru,
      detail: form.detail
    }));
  }

  function addPhraseNoteTerms(map) {
    (LESSON_DATA?.phrases || []).forEach(p => {
      const note = String(p.note || '');
      const match = note.match(/\b([A-Za-zÄäÖöÜüß]+)\b\s*=\s*([^.;!,]+)/);
      if (!match) return;
      addGermanTerm(map, match[1], match[2].trim(), { kind: 'Заметка урока' });
    });
  }

  function buildWordLexicon() {
    const map = new Map();
    Object.entries(BASIC_WORDS).forEach(([word, info]) => addInfo(map, word, { ...info, word }));
    addPhraseNoteTerms(map);

    (LESSON_DATA?.vocabulary || []).forEach(w => {
      const clean = String(w.de || '').replace(/\([^)]*\)/g, '').split(',')[0].trim();
      const detail = [w.article, w.ipa, clean && clean !== w.de ? clean : ''].filter(Boolean).join(' · ');
      addGermanTerm(map, w.de, w.ru, {
        kind: 'Словарь урока',
        detail
      });
      addNounForms(map, w.de, w.ru, detail);
      addVerbForms(map, w.de, w.ru, detail);
    });

    (LESSON_DATA?.grammar || []).forEach(g => {
      (g.conjugation || []).forEach(row => {
        String(row.form || '').split(/[\/,;·]+/).forEach(part => {
          const formWords = wordsOf(part);
          if (formWords.length !== 1) return;
          const word = formWords[0];
          addInfo(map, word, {
            word,
            kind: 'Форма',
            ru: row.translation,
            conjugation: `${row.pronoun} → ${row.form}`
          });
        });
      });
    });

    const exercises = LESSON_DATA?.exercises || {};
    const matching = Array.isArray(exercises.matching) ? exercises.matching : exercises.matching?.pairs || [];
    matching.forEach(pair => {
      addGermanTerm(map, pair.de || pair.left, pair.ru || pair.right, { kind: 'Сопоставление' });
    });

    normalizeFillBlanks(exercises.fillBlanks).forEach(q => {
      const hint = q.hintRule && q.hintRule !== q.translation ? q.hintRule : '';
      if ((q.hintWord || q.blank) && hint) {
        addInfo(map, q.hintWord || q.blank, {
          word: q.hintWord || q.blank,
          kind: 'Подсказка',
          ru: hint
        });
      }
    });

    return map;
  }

  function getWordInfo(word) {
    if (!wordLexicon) wordLexicon = buildWordLexicon();
    return wordLexicon.get(keyOf(word));
  }

  function renderWordTip(word) {
    const info = getWordInfo(word);
    if (!info) return '';

    const title = info?.word || word;
    const translation = info?.translations?.[0] || '';
    const kind = info?.kind || 'Слово';
    const details = (info?.details || []).filter(Boolean).slice(0, 2);
    const conjugations = (info?.conjugations || []).slice(0, 3);

    if (!translation && !details.length && !conjugations.length) return '';

    return `
      <span class="word-tip" role="tooltip">
        <span class="word-tip-kicker">${esc(kind)}</span>
        <span class="word-tip-title">${esc(title)}</span>
        ${translation ? `<span class="word-tip-ru">${esc(translation)}</span>` : ''}
        ${details.length ? `<span class="word-tip-meta">${details.map(esc).join('<br>')}</span>` : ''}
        ${conjugations.length ? `<span class="word-tip-conj">${conjugations.map(esc).join('<br>')}</span>` : ''}
      </span>`;
  }

  function renderWord(word, phrase = {}) {
    const tip = renderWordTip(word);
    const classes = `word-speak${tip ? ' word-has-tip' : ''}`;
    return `<span class="${classes}" tabindex="0" onclick="event.stopPropagation();speak('${jsStr(word)}')">${esc(word)}<span class="wi">🔊</span>${tip}</span>`;
  }

  function wordTipTarget(target) {
    const el = target?.closest ? target : target?.parentElement;
    return el?.closest?.('.word-has-tip') || null;
  }

  function closeWordTips(except = null) {
    clearTimeout(wordTipCloseTimer);
    document.querySelectorAll('.word-has-tip.word-tip-open').forEach(el => {
      if (el === except) return;
      el.classList.remove('word-tip-open', 'word-tip-shift-left', 'word-tip-shift-right');
      el.closest('.phrase-card')?.classList.remove('word-tip-card-open');
    });
  }

  function positionWordTip(el) {
    const tip = el?.querySelector?.('.word-tip');
    if (!tip) return;

    el.classList.remove('word-tip-shift-left', 'word-tip-shift-right');
    const pad = 10;
    const rect = tip.getBoundingClientRect();

    if (rect.left < pad) {
      el.classList.add('word-tip-shift-right');
    } else if (rect.right > window.innerWidth - pad) {
      el.classList.add('word-tip-shift-left');
    }
  }

  function openWordTip(el, autoClose = false) {
    if (!el?.querySelector?.('.word-tip')) return;

    closeWordTips(el);
    el.classList.add('word-tip-open');
    el.closest('.phrase-card')?.classList.add('word-tip-card-open');
    positionWordTip(el);
    requestAnimationFrame(() => positionWordTip(el));

    if (autoClose) {
      clearTimeout(wordTipCloseTimer);
      wordTipCloseTimer = setTimeout(() => closeWordTips(), 3200);
    }
  }

  function initWordTips() {
    if (document.documentElement.dataset.dmWordTipsReady === '1') return;
    document.documentElement.dataset.dmWordTipsReady = '1';

    document.addEventListener('mouseover', event => {
      const el = wordTipTarget(event.target);
      if (el) openWordTip(el);
    }, true);

    document.addEventListener('mouseout', event => {
      const el = wordTipTarget(event.target);
      if (!el || el.contains(event.relatedTarget)) return;
      wordTipCloseTimer = setTimeout(() => closeWordTips(), 80);
    }, true);

    document.addEventListener('click', event => {
      const el = wordTipTarget(event.target);
      if (el) {
        openWordTip(el, true);
      } else {
        closeWordTips();
      }
    }, true);

    document.addEventListener('touchstart', event => {
      const el = wordTipTarget(event.target);
      if (el) {
        openWordTip(el, true);
      } else {
        closeWordTips();
      }
    }, { capture: true, passive: true });

    window.addEventListener('resize', () => closeWordTips());
    window.addEventListener('scroll', () => closeWordTips(), true);
  }

  function normalizeFillBlanks(raw) {
    if (Array.isArray(raw)) return raw;
    const items = raw?.items;
    if (!Array.isArray(items)) return [];

    return items.map(item => {
      const sentence = String(item.sentence || '');
      const parts = sentence.split('_____');
      return {
        before: parts[0] || '',
        blank: item.answer || item.blank || '',
        after: parts.slice(1).join('_____') || '',
        translation: item.translation || '',
        hintWord: item.hint || item.answer || '',
        hintRule: item.hintRule || item.hint || ''
      };
    });
  }

  function renderTable(table) {
    if (!table?.rows?.length) return '';
    const headers = Array.isArray(table.headers) ? table.headers : [];
    const head = headers.length
      ? `<tr>${headers.map(h => `<td><strong>${esc(h)}</strong></td>`).join('')}</tr>`
      : '';
    const rows = table.rows.map(row =>
      `<tr>${(Array.isArray(row) ? row : []).map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`
    ).join('');
    return `<table class="pattern-table" style="margin-top:16px">${head}${rows}</table>`;
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
      metaEl.innerHTML = `
        <span class="badge badge-violet">🎯 ${esc(LESSON_DATA.level)}</span>
        <span class="badge badge-gold">⏱ ${esc(LESSON_DATA.meta?.duration || '')}</span>
        <span class="badge badge-green">📚 ${LESSON_DATA.vocabulary?.length || 0} слов</span>
        <button id="themeToggle" onclick="toggleTheme()" title="Сменить тему"
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
          return renderWord(tok, p);
        }
        return esc(tok).replace(/\s/g, ' ');
      }).join('');

      card.innerHTML = `
        <div class="phrase-body">
          <div class="phrase-de">${deHtml}</div>
          <div class="phrase-ru">${esc(p.ru)}</div>
          ${p.note ? `<div class="phrase-note">${esc(p.note)}</div>` : ''}
        </div>
        <button class="speak-btn" type="button" onclick="event.stopPropagation();speakPhrase('${jsStr(p.audio || p.de)}')" title="Озвучить фразу">🔊</button>
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
        <td class="vocab-ipa">${esc(w.ipa || '')}</td>
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

      const body = g.body || esc(g.explanation || '');
      let inner = `<div class="grammar-box-title">${esc(g.title)}</div>
                   <div class="grammar-rule">${body}</div>`;

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
      if (g.table) inner += renderTable(g.table);

      box.innerHTML = inner;
      container.appendChild(box);
    });
  }

  /* ── Fill blanks ── */
  function renderFillBlanks() {
    const container = document.getElementById('fillContainer');
    if (!container || !LESSON_DATA?.exercises?.fillBlanks) return;

    normalizeFillBlanks(LESSON_DATA.exercises.fillBlanks).forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'blank-question';
      div.id = `bq-${i}`;

      div.innerHTML = `
        <div class="blank-sentence">
          ${q.before ? `<span>${esc(q.before)}</span>` : ''}
          <span class="blank-input-wrap" id="wrap-${i}">
            <input class="blank-input" id="blank-${i}" placeholder="?"
                   autocomplete="off" spellcheck="false"
                   style="width:${Math.max(70, String(q.blank || '').length * 14 + 24)}px">
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
    wordLexicon = null;
    renderNav();
    renderHeader();
    if (typeof Progress !== 'undefined' && Progress.renderSectionProgress) {
      Progress.renderSectionProgress();
    }
    renderPhrases();
    initWordTips();
    renderVocab();
    renderGrammar();
    renderFillBlanks();
  }

  return { init, wordHtml: renderWord, initWordTips };
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
function openSidebar() {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('show');
  const btn = document.getElementById('sidebarToggle');
  if (btn) btn.textContent = '✕';
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  const btn = document.getElementById('sidebarToggle');
  if (btn) btn.textContent = '☰';
}
function toggleSidebar() {
  const open = document.getElementById('sidebar')?.classList.contains('open');
  open ? closeSidebar() : openSidebar();
}
function toggleLevel(id) { document.getElementById(id)?.classList.toggle('collapsed'); }
