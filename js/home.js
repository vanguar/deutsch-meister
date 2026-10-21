/* ═══════════════════════════════════════════════
   js/home.js — главная: вкладки «Главная · Курс · Словарь · Профиль»

   Только отрисовка. Логика прогресса остаётся в js/progress.js:
   renderHomeProgress() по-прежнему ставит .done / .continue на
   .lesson-card[href] и href у #continueBtn (куда «Продолжить»),
   ar-trial.js по-прежнему помечает непереведённое .ar-soon и
   правит #continueBtn. Этот модуль читает получившееся состояние
   и рисует поверх: карточку текущего урока, уровень и серию,
   путь уроков, профиль.

   Вкладка хранится в hash (#course, #dict, #more) через replaceState —
   новых записей в истории нет, а «назад» из урока возвращает
   на ту же вкладку.

   Тексты — по-русски: js/i18n.js переводит их в DOM. Числа
   стоят либо отдельным узлом, либо в шаблоне `… ${n} …`, чтобы
   ключ перевода совпал с тем, что видит DOM-переводчик.
   ═══════════════════════════════════════════════ */

const Home = (() => {
  const TOTAL = 68;
  const XP_PER_LEVEL = 200;
  const SECTIONS = ['flashcards', 'fill', 'choice', 'match', 'dict'];
  const SECTION_SHORT = ['Карточки', 'Пропуски', 'Выбор', 'Пары', 'Диктант'];
  const LEVEL_NAMES = { a1: 'Начинающий', a2: 'Элементарный', b1: 'Средний', b2: 'Выше среднего' };
  const TABS = ['home', 'course', 'dict', 'more'];

  let level = null;          // выбранный уровень на вкладке «Курс»

  const $ = id => document.getElementById(id);

  function idFromHref(href) {
    const m = /lessons\/([a-z0-9]+)\/lesson-(\d+)/i.exec(href || '');
    return m ? `${m[1].toLowerCase()}-${m[2]}` : null;
  }

  function cards() { return Array.from(document.querySelectorAll('.lesson-card[href]')); }

  // Меняем узел, только если текст другой: лишние мутации будят
  // наблюдатели i18n.js и ar-trial.js
  function setText(el, text) {
    if (el && el.textContent !== String(text)) el.textContent = text;
  }

  function sectionsDone(id) {
    try {
      const raw = JSON.parse(localStorage.getItem('dm_sections:' + id) || 'null');
      const done = (raw && Array.isArray(raw.done)) ? raw.done : [];
      return SECTIONS.filter(s => done.includes(s));
    } catch (e) { return []; }
  }

  function plural(n, one, few, many) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  /* ── вкладки ── */
  function showTab(tab, keepScroll) {
    if (!TABS.includes(tab)) tab = 'home';
    document.querySelectorAll('[data-tab]').forEach(s => { s.hidden = s.dataset.tab !== tab; });
    document.querySelectorAll('[data-tab-btn]').forEach(b => {
      const on = b.dataset.tabBtn === tab;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    // Чужой hash не трогаем: в мини-аппе там #tgWebAppData=… — подпись
    // Telegram, по которой работают облачный прогресс и язык из бота
    try { sessionStorage.setItem('dm_home_tab', tab); } catch (e) {}
    const h = location.hash.slice(1);
    if (!h || TABS.includes(h)) {
      try {
        const url = location.pathname + location.search + (tab === 'home' ? '' : '#' + tab);
        history.replaceState(history.state, '', url);
      } catch (e) { /* без history API */ }
    }
    if (!keepScroll) window.scrollTo(0, 0);
    if (tab === 'course') scrollToCurrent();
    if (tab === 'home') fitBg();
    if (tab === 'dict' && typeof Vocab !== 'undefined') Vocab.show(((($('nowLvl') || {}).textContent) || 'a1').toLowerCase());
  }

  // Вкладка — из hash; в мини-аппе hash занят подписью Telegram, тогда
  // из sessionStorage (так «назад» из урока возвращает на ту же вкладку)
  function tabFromHash() {
    const h = (location.hash || '').slice(1);
    if (TABS.includes(h)) return h;
    if (h) { try { const t = sessionStorage.getItem('dm_home_tab'); if (TABS.includes(t)) return t; } catch (e) {} }
    return 'home';
  }

  function go(tab) {
    try { window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.(); } catch (e) {}
    showTab(tab);
  }

  /* ── уровень на вкладке «Курс» ── */
  function pickLevel(lv) {
    if (!LEVEL_NAMES[lv]) lv = 'a1';
    level = lv;
    document.querySelectorAll('.path[data-level]').forEach(p => { p.hidden = p.dataset.level !== lv; });
    document.querySelectorAll('[data-level-btn]').forEach(b => {
      const on = b.dataset.levelBtn === lv;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderLevelHead();
  }

  function renderLevelHead() {
    const lv = level || 'a1';
    const list = cards().filter(c => idFromHref(c.getAttribute('href'))?.startsWith(lv + '-'));
    const done = list.filter(c => c.classList.contains('done')).length;
    setText($('lvlCode'), lv.toUpperCase());
    setText($('lvlName'), LEVEL_NAMES[lv]);
    setText($('lvlCount'), `${done} / ${list.length}`);
    const bar = $('lvlBar');
    if (bar) bar.style.width = (list.length ? Math.round(done / list.length * 100) : 0) + '%';
    const nx = document.querySelector(`.path[data-level="${lv}"] .lvl-next`);
    if (nx) nx.classList.toggle('is-ready', list.length > 0 && done === list.length);
  }

  /* ── «Дальше — следующий уровень» в конце пути уровня ──
     Без него после A1-20 путь просто обрывается: что уровни
     переключаются сегментом наверху, видно не всем. */
  const LEVEL_ORDER = ['a1', 'a2', 'b1', 'b2'];
  const LEVEL_TEASER = {
    a2: 'Präteritum, сравнение, планы на будущее — и жизненные темы: врач, работа, жильё',
    b1: 'Konjunktiv II, пассив, придаточные — и тексты о работе, СМИ и экологии',
    b2: 'Причастия, номинализация, научный стиль и деловое общение'
  };
  function buildLevelNext() {
    document.querySelectorAll('.path[data-level]').forEach(path => {
      if (path.querySelector('.lvl-next')) return;
      const lv = path.dataset.level;
      const nx = LEVEL_ORDER[LEVEL_ORDER.indexOf(lv) + 1];
      const el = document.createElement('div');
      el.className = 'lvl-next' + (nx ? '' : ' is-final');
      el.innerHTML = nx
        ? `<span class="ln-dot" aria-hidden="true"><svg class="ico"><use href="#i-flag"/></svg></span>
           <div class="ln-body">
             <div class="ln-kicker"><span>Конец уровня</span> <b>${lv.toUpperCase()}</b></div>
             <div class="ln-title"><span>Дальше —</span> <b>${nx.toUpperCase()}</b> · <span>${LEVEL_NAMES[nx]}</span></div>
             <div class="ln-sub">${LEVEL_TEASER[nx]}</div>
             <button type="button" class="ln-btn" data-level-go="${nx}"><span>Перейти к уровню</span> <b>${nx.toUpperCase()}</b><svg class="ico sm flip"><use href="#i-arrow"/></svg></button>
           </div>`
        : `<span class="ln-dot" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>
           <div class="ln-body">
             <div class="ln-kicker"><span>Конец курса</span></div>
             <div class="ln-title">Это последний уровень</div>
             <div class="ln-sub">Закрепляйте немецкий на живом материале: диалоги, книги, новости, земли Германии и автошкола</div>
             <button type="button" class="ln-btn" data-tab-go="home">Читать и слушать</button>
           </div>`;
      path.appendChild(el);
    });
    document.querySelectorAll('[data-level-go]').forEach(b => b.addEventListener('click', () => {
      try { window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.(); } catch (e) {}
      pickLevel(b.dataset.levelGo);
      window.scrollTo(0, 0);
    }));
    document.querySelectorAll('[data-tab-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.tabGo)));
  }

  function scrollToCurrent() {
    const cur = document.querySelector('.path:not([hidden]) .lesson-card.continue');
    if (!cur) return;
    const r = cur.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.7) window.scrollTo(0, window.scrollY + r.top - window.innerHeight / 3);
  }

  /* ── всё, что зависит от прогресса ── */
  function render() {
    const all = cards();
    const btn = $('continueBtn');
    const cid = idFromHref(btn && btn.getAttribute('href'));
    const card = all.find(c => idFromHref(c.getAttribute('href')) === cid) || all[0];
    const doneCount = all.filter(c => c.classList.contains('done')).length;
    let last = null;
    try { last = (typeof Progress !== 'undefined') ? Progress.getLastLesson() : null; } catch (e) {}
    const started = doneCount > 0 || !!last;

    // приветствие по времени суток
    const h = new Date().getHours();
    const greet = !started ? ['Добро пожаловать', 'Willkommen!']
      : h < 5 ? ['Добрый вечер', 'Guten Abend!']
      : h < 11 ? ['Доброе утро', 'Guten Morgen!']
      : h < 18 ? ['Добрый день', 'Guten Tag!']
      : ['Добрый вечер', 'Guten Abend!'];
    setText($('greetSub'), greet[0]);
    setText($('greetDe'), greet[1]);

    // карточка текущего урока
    if (card) {
      const id = idFromHref(card.getAttribute('href')) || 'a1-01';
      const isDone = card.classList.contains('done');
      const secs = isDone ? SECTIONS.slice() : sectionsDone(id);
      setText($('nowLvl'), id.slice(0, 2).toUpperCase());
      setText($('nowNum'), id.slice(3));
      setText($('nowTitle'), (card.querySelector('.lc-title')?.textContent || '').trim());
      setText($('nowBg'), card.dataset.de || '');
      fitBg();
      const nowCard = $('nowCard');
      if (nowCard) nowCard.classList.toggle('is-new', !started);
      setText($('nowSub'), started
        ? (isDone ? 'Урок пройден' : `Пройдено ${secs.length} из ${SECTIONS.length}`)
        : `${TOTAL} уроков — от нуля до B2`);
      const next = SECTIONS.find(s => !secs.includes(s));
      document.querySelectorAll('#nowSteps .step').forEach((st, i) => {
        st.classList.toggle('on', secs.includes(SECTIONS[i]));
        st.classList.toggle('next', SECTIONS[i] === next);
      });
    }
    // progress.js и ar-trial.js пишут в кнопку свой текст — у новой
    // карточки название урока стоит выше, на кнопке только действие
    if (btn && !btn.classList.contains('ar-soon')) setText(btn, started ? 'Продолжить урок' : 'Начать курс');

    // уровень и серия
    let xp = 0, streak = 0;
    try { xp = Progress.getXP() || 0; streak = Progress.getStreak() || 0; } catch (e) {}
    setText($('xpLevel'), Math.floor(xp / XP_PER_LEVEL) + 1);
    setText($('xpNow'), xp % XP_PER_LEVEL);
    const fill = $('xpBar');
    if (fill) fill.style.width = Math.min((xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, 100) + '%';
    setText($('streakNum'), streak);
    setText($('streakWord'), plural(streak, 'день подряд', 'дня подряд', 'дней подряд'));
    setText($('streakHint'), started ? 'Зайдите и завтра' : 'Начните сегодня');

    // путь уроков
    all.forEach(c => {
      const id = idFromHref(c.getAttribute('href'));
      const isDone = c.classList.contains('done');
      const isCur = c.classList.contains('continue');
      const st = c.querySelector('.lc-state');
      let state = '', text = '';
      if (isCur) {
        const n = sectionsDone(id).length;
        state = 'cur';
        text = isDone ? 'Пройден' : (n ? `Пройдено ${n} из ${SECTIONS.length}` : '');
      } else if (isDone) {
        state = 'done';
        text = 'Пройден';
      }
      if (c.dataset.state !== state) c.dataset.state = state;
      setText(st, text);
      setText(c.querySelector('.lc-go'), started ? 'Дальше' : 'Начать');
    });
    setText($('courseCount'), `${doneCount} из ${TOTAL} уроков`);
    if (!level) pickLevel((cid || 'a1-01').slice(0, 2));
    else renderLevelHead();

    // профиль
    setText($('statStreak'), streak);
    setText($('statXp'), xp);
    setText($('statDone'), doneCount);
  }

  /* Водяной знак — слово урока целиком: уменьшаем кегль, пока оно не
     влезет в карточку (76px — для коротких «Hallo», «Familie»). */
  const BG_MAX = 76, BG_MIN = 28;
  function fitBg() {
    const el = $('nowBg'), cardEl = $('nowCard');
    if (!el || !cardEl) return;
    const room = cardEl.clientWidth - 28;
    if (room <= 0) return;                 // вкладка скрыта — подгоним при показе
    el.style.fontSize = BG_MAX + 'px';
    const w = el.scrollWidth;
    if (w > room && w > 0) el.style.fontSize = Math.max(BG_MIN, Math.floor(BG_MAX * room / w)) + 'px';
    // название урока: длинное слово не рвём посередине, а уменьшаем
    const t = $('nowTitle');
    if (!t) return;
    t.style.fontSize = '';
    const full = parseFloat(getComputedStyle(t).fontSize) || 30;
    for (let fs = full; t.scrollWidth > t.clientWidth + 1 && fs > 18; fs -= 1) t.style.fontSize = (fs - 1) + 'px';
  }

  /* ── «Свежее» у новостей: то же правило, что у ленты и меню ── */
  function newsBadge() {
    const b = $('newsFresh');
    if (!b || typeof fetch !== 'function' || typeof dmNewsAgeDays !== 'function') return;
    const days = (typeof DM_NEWS_FRESH_DAYS === 'number') ? DM_NEWS_FRESH_DAYS : 3;
    fetch('data/news/index.json')
      .then(r => (r.ok ? r.json() : null))
      .then(idx => {
        const items = (idx && idx.items) || [];
        b.hidden = !items.some(it => dmNewsAgeDays(it.published) <= days);
      })
      .catch(() => {});
  }

  /* ── язык и тема в профиле ── */
  function paintSettings() {
    const lang = (window.I18N && I18N.lang) || 'ru';
    document.querySelectorAll('[data-set-lang]').forEach(b => {
      const on = b.dataset.setLang === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    document.querySelectorAll('[data-set-theme]').forEach(b => {
      const on = b.dataset.setTheme === theme;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setLang(lang) {
    if (!window.I18N || lang === I18N.lang) return;
    I18N.setLang(lang);
  }

  function setTheme(theme) {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme !== cur && typeof toggleTheme === 'function') toggleTheme();
    // выбор запоминаем, даже если тема уже такая: иначе схема Telegram
    // (js/telegram.js) на следующей странице считала бы, что выбора не было
    try { localStorage.setItem('dm_theme', theme); } catch (e) { /* приватный режим */ }
    paintSettings();
  }

  /* ar-trial.js подменяет openBooksModal / openNewsPage тостом «скоро»,
     пока раздел не переведён, и гасит плашки меню (.side-action) —
     плитки главной гасим так же */
  function markLocked() {
    [['openBooksModal', 'readBooks'], ['openNewsPage', 'readNews'], ['openDialogsPage', 'readDialogs'], ['openFahrschulePage', 'readFahrschule'], ['openLaenderPage', 'readLaender']].forEach(([fn, id]) => {
      const el = $(id);
      if (el) el.classList.toggle('ar-soon', !!(window[fn] && window[fn].__arLocked));
    });
  }

  function init() {
    document.querySelectorAll('[data-tab-btn]').forEach(b => b.addEventListener('click', () => go(b.dataset.tabBtn)));
    document.querySelectorAll('[data-level-btn]').forEach(b => b.addEventListener('click', () => pickLevel(b.dataset.levelBtn)));
    buildLevelNext();
    document.querySelectorAll('[data-set-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));
    document.querySelectorAll('[data-set-theme]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.setTheme)));

    // cloud-sync.js после слияния облака зовёт Progress.renderHomeProgress() —
    // дорисовываем и свою часть
    if (typeof Progress !== 'undefined' && !Progress.renderHomeProgress.__home) {
      const orig = Progress.renderHomeProgress;
      const wrapped = function () { const r = orig.apply(this, arguments); render(); return r; };
      wrapped.__home = true;
      Progress.renderHomeProgress = wrapped;
    }
    // ссылка или закладка на #course / #more при уже открытой главной
    window.addEventListener('hashchange', () => showTab(tabFromHash()));
    // возврат из урока кнопкой «назад» может поднять страницу из bfcache
    window.addEventListener('pageshow', e => {
      if (e.persisted && typeof Progress !== 'undefined') Progress.renderHomeProgress();
    });
    // telegram.js может переключить тему после загрузки SDK
    // цвета темы Telegram ставит js/tg-theme.js (общий для всех страниц)
    new MutationObserver(paintSettings)
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // шрифт Unbounded догружается позже — после него ширина слова другая
    try { document.fonts && document.fonts.ready.then(fitBg); } catch (e) {}
    window.addEventListener('resize', fitBg);
    render();
    paintSettings();
    markLocked();
    newsBadge();
    showTab(tabFromHash(), true);
  }

  return { init, render, showTab, pickLevel };
})();
