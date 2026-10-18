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
   • ссылка «A1·05» открывает урок, где слово встретилось;
   • нажатие на слово — карточка: крупно слово, IPA, перевод, 🔊, «знаю»
     и анимация (у 220 слов A1–A2, поле x из tools/vocab/anim.json):
       n:<код> — анимированный эмодзи Google Noto (Lottie, CC BY 4.0),
                 проигрыватель js/vendor/lottie_light.min.js грузится
                 только при первой такой карточке;
       e:<эмодзи>:<walk|run|swim> — обычный эмодзи, движение — CSS.
     В списке анимаций нет: только маленький статичный значок. Анимация
     играет, пока открыта карточка; при «уменьшить движение» — стоит.
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

  // «n:1f642_200d_2195_fe0f» → 🙂‍↕️ (статичный значок в списке — системный эмодзи)
  function glyph(x) {
    if (!x) return '';
    const [kind, a] = x.split(':');
    if (kind === 'e') return a;
    try { return String.fromCodePoint(...a.split('_').map(h => parseInt(h, 16))); } catch (e) { return ''; }
  }

  const SVG_SAY = '<svg class="ico sm" aria-hidden="true"><use href="#i-speaker"/></svg>';
  const SVG_OK = '<svg class="ico sm" aria-hidden="true"><use href="#i-check"/></svg>';

  function row(it, i, showLevel) {
    const isKnown = !!known[it.de];
    const tag = it.l.slice(0, 2).toUpperCase() + '·' + it.l.slice(3);
    return `<li class="v-item${isKnown ? ' known' : ''}" data-i="${i}">` +
      `<button type="button" class="v-main" data-act="open">` +
        (it.x ? `<span class="v-emo" aria-hidden="true">${glyph(it.x)}</span>` : '') +
        `<span class="v-txt">` +
          `<span class="v-term" lang="de" dir="ltr">${it.a ? `<span class="v-art art-${esc(it.a)}">${esc(it.a)}</span> ` : ''}<span class="v-word">${esc(it.w)}</span></span>` +
          `<span class="v-tr">${esc(it.ru)}</span>` +
        `</span>` +
      `</button>` +
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
    if (btn.dataset.act === 'open') openCard(it);
    else if (btn.dataset.act === 'say') say(it);
    else toggleKnown(it);
  }

  function say(it) { if (typeof TTS !== 'undefined') TTS.speak(it.de); }

  // в фильтре «Учить» / «Знаю» слово уходит из списка не сразу,
  // а при следующей перерисовке — чтобы промах пальцем можно было отменить
  function toggleKnown(it) {
    haptic();
    if (known[it.de]) delete known[it.de]; else known[it.de] = 1;
    saveKnown();
    const on = !!known[it.de];
    const li = document.querySelector(`.v-item[data-i="${it.i}"]`);
    if (li) {
      li.classList.toggle('known', on);
      li.querySelector('.v-know')?.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    const kb = $('vsKnow');
    if (kb && card === it) { kb.classList.toggle('on', on); kb.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    renderHead();
  }

  /* ── карточка слова ── */
  const LOTTIE_SRC = 'js/vendor/lottie_light.min.js';
  let card = null;          // слово в открытой карточке
  let anim = null;          // проигрыватель Lottie
  let lottieLoad = null;
  let lastFocus = null;

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function loadLottie() {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (lottieLoad) return lottieLoad;
    lottieLoad = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = LOTTIE_SRC;
      s.onload = () => (window.lottie ? resolve(window.lottie) : reject(new Error('lottie')));
      s.onerror = () => { lottieLoad = null; reject(new Error('lottie')); };
      document.head.appendChild(s);
    });
    return lottieLoad;
  }

  function sheet() {
    let bg = $('vSheet');
    if (bg) return bg;
    bg = document.createElement('div');
    bg.id = 'vSheet';
    bg.className = 'v-sheet-bg';
    bg.hidden = true;
    bg.innerHTML =
      '<div class="v-sheet" role="dialog" aria-modal="true" aria-labelledby="vsWord">' +
        '<button type="button" class="v-sheet-x" data-sheet="close" aria-label="Закрыть">✕</button>' +
        '<div class="v-anim" id="vsAnim" aria-hidden="true"></div>' +
        '<div class="v-sheet-term" id="vsWord" lang="de" dir="ltr"></div>' +
        '<div class="v-sheet-ipa" id="vsIpa" dir="ltr"></div>' +
        '<div class="v-sheet-tr" id="vsTr"></div>' +
        '<div class="v-sheet-actions">' +
          `<button type="button" class="v-sheet-btn" data-sheet="say">${SVG_SAY}<span>Слушать</span></button>` +
          `<button type="button" class="v-sheet-btn" id="vsKnow" data-sheet="know" aria-pressed="false">${SVG_OK}<span>Знаю</span></button>` +
        '</div>' +
        '<a class="v-sheet-lesson" id="vsLesson"><span>Открыть урок</span> <b dir="ltr" id="vsTag"></b></a>' +
        '<div class="v-sheet-credit" id="vsCredit" hidden>Анимация: Noto Emoji, Google · CC BY 4.0</div>' +
      '</div>';
    bg.addEventListener('click', e => {
      const b = e.target.closest('[data-sheet]');
      if (e.target === bg || (b && b.dataset.sheet === 'close')) { closeCard(); return; }
      if (!b || !card) return;
      if (b.dataset.sheet === 'say') say(card);
      else if (b.dataset.sheet === 'know') toggleKnown(card);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && card) closeCard(); });
    document.body.appendChild(bg);
    return bg;
  }

  function stopAnim() {
    if (anim) { try { anim.destroy(); } catch (e) {} anim = null; }
    const box = $('vsAnim');
    if (box) { box.innerHTML = ''; box.className = 'v-anim'; }
  }

  function playAnim(it) {
    const box = $('vsAnim');
    const credit = $('vsCredit');
    if (credit) credit.hidden = true;
    if (!box) return;
    if (!it.x) { box.classList.add('none'); return; }
    const [kind, a, motion] = it.x.split(':');
    if (kind === 'e') {
      box.classList.add('emo', 'm-' + motion);
      box.innerHTML = `<span class="v-move"><span class="v-bob">${a}</span></span>`;
      return;
    }
    // пока грузится — статичный значок, чтобы место не пустовало
    box.classList.add('emo');
    box.innerHTML = `<span class="v-move"><span class="v-bob">${glyph(it.x)}</span></span>`;
    if (credit) credit.hidden = false;
    const want = it;
    Promise.all([loadLottie(), fetch(`data/vocab/anim/${a}.json`).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })])
      .then(([lottie, data]) => {
        if (card !== want) return;          // карточку уже закрыли или открыли другую
        box.classList.remove('emo');
        box.innerHTML = '';
        const still = reducedMotion();
        anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: !still, autoplay: !still, animationData: data });
        if (still) anim.goToAndStop(Math.floor((anim.totalFrames || 2) / 2), true);
      })
      .catch(() => { /* без сети — остаётся статичный значок */ });
  }

  function openCard(it) {
    const bg = sheet();
    lastFocus = document.activeElement;
    stopAnim();
    card = it;
    $('vsWord').innerHTML = (it.a ? `<span class="v-art art-${esc(it.a)}">${esc(it.a)}</span> ` : '') + esc(it.w);
    $('vsIpa').textContent = it.ipa || '';
    $('vsTr').textContent = it.ru;
    $('vsTag').textContent = it.l.slice(0, 2).toUpperCase() + '·' + it.l.slice(3);
    $('vsLesson').setAttribute('href', lessonHref(it.l));
    const kb = $('vsKnow');
    kb.classList.toggle('on', !!known[it.de]);
    kb.setAttribute('aria-pressed', known[it.de] ? 'true' : 'false');
    bg.hidden = false;
    document.body.classList.add('v-sheet-open');
    requestAnimationFrame(() => bg.classList.add('show'));
    playAnim(it);
    haptic();
    say(it);
    try { bg.querySelector('.v-sheet-x').focus({ preventScroll: true }); } catch (e) {}
  }

  function closeCard() {
    const bg = $('vSheet');
    if (!bg || !card) return;
    card = null;
    stopAnim();
    bg.classList.remove('show');
    bg.hidden = true;
    document.body.classList.remove('v-sheet-open');
    try { lastFocus && lastFocus.focus({ preventScroll: true }); } catch (e) {}
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

  return { show, load, fold, openCard, closeCard };
})();
