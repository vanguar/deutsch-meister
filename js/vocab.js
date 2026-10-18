/* ═══════════════════════════════════════════════
   js/vocab.js — вкладка «Словарь» на главной (index.html#dict)

   Все слова курса из data/vocab/index.json (собирает
   tools/vocab/build.js из уроков; js/i18n.js подменяет путь на
   i18n/<lang>/vocab/ — перевод уже на языке интерфейса).
   Грузится при первом открытии вкладки, не раньше.

   • уровни A1–B2, у каждого — «Знаю N из M»;
   • поиск сразу по всем уровням — по-немецки (умлауты можно не
     набирать: «schon» найдёт «schön») и по переводу;
   • фильтр «Все / Учить / Знаю»;
   • 🔊 — озвучка тем же js/tts.js, что в уроках;
   • ✓ «знаю» хранится на устройстве: localStorage dm_vocab_known
     ({ «der Montag»: 1, … });
   • ссылка «A1·05» открывает урок, где слово встретилось.
   ═══════════════════════════════════════════════ */

const Vocab = (() => {
  const KNOWN_KEY = 'dm_vocab_known';
  const LEVEL_NAMES = { a1: 'Начинающий', a2: 'Элементарный', b1: 'Средний', b2: 'Выше среднего' };
  const MAX_FOUND = 200;

  let items = null;          // [{ de, w, a, ipa, ru, l, f }]
  let loading = null;
  let level = null;
  let filter = 'all';
  let query = '';
  let known = readKnown();

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function readKnown() {
    try { const o = JSON.parse(localStorage.getItem(KNOWN_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; }
    catch (e) { return {}; }
  }
  function saveKnown() {
    try { localStorage.setItem(KNOWN_KEY, JSON.stringify(known)); } catch (e) {}
  }

  // «schön» ищется и как «schon», «Straße» — и как «strasse»
  function fold(s) {
    return String(s || '').toLowerCase()
      .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
      .replace(/ё/g, String.fromCharCode(0x435));   // yo → ye, без кириллицы в литерале (иначе это «строка интерфейса» для tools/i18n.js)
  }

  function plural(n, one, few, many) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  function load() {
    if (items) return Promise.resolve(items);
    if (loading) return loading;
    loading = fetch('data/vocab/index.json')
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => {
        items = (d.items || []).map((it, i) => Object.assign(it, { i, f: fold(it.de) + ' ' + fold(it.ru) }));
        return items;
      })
      .catch(e => { loading = null; throw e; });
    return loading;
  }

  function lessonHref(id) {
    const [lv, n] = id.split('-');
    return `lessons/${lv}/lesson-${n}/index.html`;
  }

  const SVG_SAY = '<svg class="ico sm" aria-hidden="true"><use href="#i-speaker"/></svg>';
  const SVG_OK = '<svg class="ico sm" aria-hidden="true"><use href="#i-check"/></svg>';

  function row(it, i, showLevel) {
    const isKnown = !!known[it.de];
    const tag = it.l.slice(0, 2).toUpperCase() + '·' + it.l.slice(3);
    return `<li class="v-item${isKnown ? ' known' : ''}" data-i="${i}">` +
      `<div class="v-main">` +
        `<div class="v-term" lang="de" dir="ltr">${it.a ? `<span class="v-art art-${esc(it.a)}">${esc(it.a)}</span> ` : ''}<span class="v-word">${esc(it.w)}</span></div>` +
        `<div class="v-tr">${esc(it.ru)}</div>` +
      `</div>` +
      `<a class="v-lesson${showLevel ? ' lv' : ''}" href="${lessonHref(it.l)}" dir="ltr">${tag}</a>` +
      `<button type="button" class="v-btn v-say" data-act="say" aria-label="Озвучить" title="Озвучить">${SVG_SAY}</button>` +
      `<button type="button" class="v-btn v-know" data-act="know" aria-pressed="${isKnown}" aria-label="Знаю" title="Знаю">${SVG_OK}</button>` +
      `</li>`;
  }

  function render() {
    const list = $('vocabList');
    if (!list || !items) return;
    const q = fold(query.trim());
    let pool = q ? items.filter(it => it.f.includes(q)) : items.filter(it => it.l.startsWith(level + '-'));
    if (filter === 'known') pool = pool.filter(it => known[it.de]);
    else if (filter === 'learn') pool = pool.filter(it => !known[it.de]);
    const shown = q ? pool.slice(0, MAX_FOUND) : pool;
    list.innerHTML = shown.map(it => row(it, it.i, !!q)).join('');
    const empty = $('vocabEmpty');
    empty.textContent = 'Ничего не найдено';
    empty.hidden = shown.length > 0;
    document.querySelector('[data-tab="dict"]').classList.toggle('is-search', !!q);
    renderHead();
  }

  function renderHead() {
    if (!items) return;
    const n = items.length;
    const cnt = $('vocabCount');
    if (cnt) cnt.textContent = plural(n, `${n} слово`, `${n} слова`, `${n} слов`);
    const lv = items.filter(it => it.l.startsWith(level + '-'));
    const k = lv.filter(it => known[it.de]).length;
    $('vLvlCode').textContent = level.toUpperCase();
    $('vLvlName').textContent = LEVEL_NAMES[level];
    $('vLvlCount').textContent = `Знаю ${k} из ${lv.length}`;
    $('vLvlBar').style.width = (lv.length ? Math.round(k / lv.length * 100) : 0) + '%';
  }

  function paintControls() {
    document.querySelectorAll('[data-vlevel]').forEach(b => {
      const on = b.dataset.vlevel === level;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-vfilter]').forEach(b => {
      const on = b.dataset.vfilter === filter;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function haptic() { try { window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.(); } catch (e) {} }

  function onListClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const li = btn.closest('.v-item');
    const it = items && items[+li.dataset.i];
    if (!it) return;
    if (btn.dataset.act === 'say') {
      if (typeof TTS !== 'undefined') TTS.speak(it.de);
    } else {
      haptic();
      if (known[it.de]) delete known[it.de]; else known[it.de] = 1;
      saveKnown();
      const on = !!known[it.de];
      li.classList.toggle('known', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      renderHead();
      // в фильтре «Учить» / «Знаю» слово уходит из списка не сразу,
      // а при следующей перерисовке — чтобы промах пальцем можно было отменить
    }
  }

  let bound = false;
  function bind() {
    if (bound) return;
    bound = true;
    document.querySelectorAll('[data-vlevel]').forEach(b => b.addEventListener('click', () => {
      level = b.dataset.vlevel; haptic(); paintControls(); render(); window.scrollTo(0, 0);
    }));
    document.querySelectorAll('[data-vfilter]').forEach(b => b.addEventListener('click', () => {
      filter = b.dataset.vfilter; haptic(); paintControls(); render();
    }));
    const input = $('vocabQuery');
    let timer = null;
    if (input) input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { query = input.value; render(); }, 120);
    });
    const list = $('vocabList');
    if (list) list.addEventListener('click', onListClick);
  }

  /* Открыли вкладку: при первом разе — загрузка; уровень — как у
     текущего урока на главной */
  function show(defaultLevel) {
    bind();
    if (!level) level = LEVEL_NAMES[defaultLevel] ? defaultLevel : 'a1';
    known = readKnown();
    paintControls();
    const list = $('vocabList');
    if (!items && list && !list.children.length) list.innerHTML = '<li class="v-wait">…</li>';
    return load().then(render).catch(() => {
      if (list) list.innerHTML = '';
      const empty = $('vocabEmpty');
      if (empty) { empty.hidden = false; empty.textContent = 'Не удалось загрузить словарь. Проверьте интернет и откройте вкладку ещё раз.'; }
    });
  }

  return { show, load, fold };
})();
