/* ═══════════════════════════════════════════════
   laender.js — раздел «Земли Германии» (laender.html)

   Данные собирает tools/laender/build.py: data/laender/lands.json (все 16
   земель; готовые — с паспортом, тестом и текстами B1/B2) и map.json
   (контуры земель, Natural Earth). На украинском и арабском js/i18n.js
   подменяет запрос на копию i18n/<lang>/laender/….

   Виды:
     • витрина — laender.html: карта (тап по земле — карточка земли),
       игра «Найди землю», список всех земель; неготовые — серые,
       «в разработке»;
     • страница земли — laender.html#l=<земля>: паспорт, уровни B1/B2,
       оглавление, тест «Проверь себя»;
     • текст земли открывает тот же ридер, что и книги (js/reader.js),
       адрес #land=<земля>-<b1|b2>.
   Переходы — записи в history: «назад», «← Все земли» и Telegram
   BackButton поднимаются на уровень выше.
   Zero dependencies (кроме Reader).
   ═══════════════════════════════════════════════ */

const Laender = (() => {

  const LANDS_URL = 'data/laender/lands.json';
  const MAP_URL   = 'data/laender/map.json';
  const POS_KEY   = 'dm_book_pos:';        // позицию пишет ридер — тот же ключ, что у книг
  const LEVEL_KEY = 'dm_land_level';       // выбранный уровень: 'b1' | 'b2'
  const QUIZ_KEY  = 'dm_land_quiz:';       // лучший результат теста земли
  const GAME_KEY  = 'dm_land_game';        // лучший результат «Найди землю»
  const READ_PCT  = 90;                    // с этого процента текст считается прочитанным
  const GAME_N    = 10;
  const SVG_NS    = 'http://www.w3.org/2000/svg';
  // Город-земли на карте крошечные: попасть пальцем помогает круг вокруг центра
  const HIT_R     = { berlin: 9, hamburg: 8, bremen: 8 };

  let el = {};
  let lands = [];
  let byId = {};
  let levels = {};
  let sources = [];
  let shapes = null;
  let loaded = false;
  let view = { name: 'hub' };
  let picked = null;        // выбранная на карте земля
  let game = null;          // { order, i, score, lock }
  let quiz = null;          // { id, i, score, pick }

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* приватный режим */ }
  }

  function plural(n, forms) {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }

  // Число и слово — в разных узлах: DOM-переводчик (js/i18n.js) переводит слово
  function countHtml(n, forms) {
    return `<b>${n}</b> <span>${plural(n, forms)}</span>`;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function level() {
    const v = readStore(LEVEL_KEY);
    return levels[v] ? v : 'b1';
  }

  function percentOf(tid) {
    try {
      const pos = JSON.parse(readStore(POS_KEY + tid) || 'null');
      return pos && typeof pos.percent === 'number' ? Math.max(0, Math.min(100, pos.percent)) : 0;
    } catch (e) { return 0; }
  }

  // Земля прочитана, если хотя бы один её текст дочитан
  function isRead(land) {
    return !!land.ready && Object.values(land.texts).some(t => percentOf(t.id) >= READ_PCT);
  }

  function stateOf(land) {
    return !land.ready ? 'soon' : isRead(land) ? 'read' : 'ready';
  }

  function flagHtml(land, cls) {
    return `<img class="ld-flag${cls ? ' ' + cls : ''}" src="${esc(land.flag)}" alt="" width="36" height="22" decoding="async">`;
  }

  function soon() {
    if (typeof window.newsSoon === 'function') window.newsSoon();
  }

  /* ── Адрес ↔ вид ── */

  function viewFromHash() {
    const h = location.hash || '';
    const m = /^#l=([\w-]+)/.exec(h);
    if (m) return { name: 'land', id: m[1] };
    const r = /^#land=([\w-]+)/.exec(h);
    if (r) return { name: 'read', tid: r[1] };
    return { name: 'hub' };
  }

  function openLand(id) {
    const land = byId[id];
    if (!land) return;
    if (!land.ready) { soon(); return; }
    try { history.pushState({ view: 'land', land: id }, '', '#l=' + id); } catch (e) { /* старый WebView */ }
    show({ name: 'land', id });
    window.scrollTo(0, 0);
  }

  function toHub() {
    if (view.name !== 'land') return;
    if (history.state && history.state.view === 'land') { history.back(); return; }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* старый WebView */ }
    show({ name: 'hub' });
    window.scrollTo(0, 0);
  }

  function onPopState() {
    const v = viewFromHash();
    if (v.name === 'read') {
      if (loaded && !(typeof Reader !== 'undefined' && Reader.state && Reader.state.open)) openFromHash();
      return;
    }
    show(v);
  }

  function onTgBack() {
    if (typeof Reader !== 'undefined' && Reader.state && Reader.state.open) Reader.close();
    else toHub();
  }

  function syncTgBack() {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (!tg || !tg.BackButton || !tg.initData || !tg.isVersionAtLeast || !tg.isVersionAtLeast('6.1')) return;
    tg.BackButton.offClick(onTgBack);
    if (view.name === 'land') { tg.BackButton.onClick(onTgBack); tg.BackButton.show(); }
    else tg.BackButton.hide();
  }

  function show(v) {
    if (v.name === 'land' && loaded && !(byId[v.id] && byId[v.id].ready)) {
      v = { name: 'hub' };
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* старый WebView */ }
    }
    if (v.name === 'read') v = { name: 'hub' };
    view = v;
    quiz = null;
    el.hub.hidden = v.name !== 'hub';
    el.land.hidden = v.name !== 'land';
    syncTgBack();
    if (!loaded) return;
    if (v.name === 'hub') renderHub();
    else renderLand(byId[v.id]);
  }

  /* ── Витрина ── */

  function levelsHtml() {
    const cur = level();
    return Object.entries(levels).map(([k, v]) =>
      `<button class="ld-level${k === cur ? ' is-on' : ''}" type="button" data-level="${k}" aria-pressed="${k === cur}">
        <b>${esc(v.level)}</b> <span>${esc(v.label)}</span></button>`).join('');
  }

  function renderHub() {
    el.levels.innerHTML = levelsHtml();
    paintMap();
    renderPick();
    const order = lands.slice().sort((a, b) => (b.ready - a.ready) || a.name.localeCompare(b.name, 'de'));
    el.list.innerHTML = order.map(cardHtml).join('');
    el.list.setAttribute('aria-busy', 'false');
    const ready = lands.filter(l => l.ready);
    el.done.innerHTML = `<span>Готово</span>: <b>${ready.length}</b> <span>из</span> <b>${lands.length}</b>`
      + ` · <span>прочитано</span>: <b>${ready.filter(isRead).length}</b>`;
  }

  function cardHtml(land) {
    const st = stateOf(land);
    if (!land.ready) {
      return `<button class="ld-card is-soon" type="button" data-land="${esc(land.id)}" aria-disabled="true">
        ${flagHtml(land)}
        <span class="ld-card-text">
          <span class="ld-card-de" lang="de" dir="ltr">${esc(land.name)}</span>
          <span class="ld-card-ru"><span>${esc(land.nameRu)}</span> · <span lang="de" dir="ltr">${esc(land.capital)}</span></span>
        </span>
        <span class="ld-badge">В разработке</span>
      </button>`;
    }
    const lv = Object.entries(land.texts).map(([k, t]) => {
      const p = percentOf(t.id);
      return `<span class="ld-chip${p >= READ_PCT ? ' is-done' : ''}">${esc(levels[k].level)}${p >= READ_PCT ? ' ✓' : p > 0 ? ` · ${p}%` : ''}</span>`;
    }).join('');
    return `<a class="ld-card is-${st}" href="#l=${esc(land.id)}" data-land="${esc(land.id)}">
      ${flagHtml(land)}
      <span class="ld-card-text">
        <span class="ld-card-de" lang="de" dir="ltr">${esc(land.name)}</span>
        <span class="ld-card-ru"><span>${esc(land.nameRu)}</span> · <span lang="de" dir="ltr">${esc(land.capital)}</span></span>
        <span class="ld-chips">${lv}</span>
      </span>
      <span class="ld-go" aria-hidden="true">›</span>
    </a>`;
  }

  /* ── Карта ── */

  function buildMap() {
    if (!shapes) return;
    const vb = shapes.viewBox;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', vb.join(' '));
    svg.setAttribute('class', 'ld-svg');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Карта земель Германии');
    let paths = '', hits = '', labels = '';
    lands.forEach(land => {
      const s = shapes.lands[land.id];
      if (!s) return;
      paths += `<path class="ld-shape" data-land="${esc(land.id)}" d="${s.d}" fill-rule="evenodd" tabindex="0" role="button" aria-label="${esc(land.name)}"><title>${esc(land.name)}</title></path>`;
      if (HIT_R[land.id]) hits += `<circle class="ld-hit" data-land="${esc(land.id)}" cx="${s.c[0]}" cy="${s.c[1]}" r="${HIT_R[land.id]}"/>`;
      labels += `<text class="ld-label" data-for="${esc(land.id)}" x="${s.c[0]}" y="${s.c[1]}">${esc(land.name)}</text>`;
    });
    // города-земли — поверх соседей, иначе их закрывает окружающая земля
    svg.innerHTML = `<g class="ld-shapes">${paths}</g><g class="ld-hits">${hits}</g><g class="ld-labels" aria-hidden="true">${labels}</g>`;
    const g = svg.querySelector('.ld-shapes');
    ['berlin', 'hamburg', 'bremen'].forEach(id => {
      const p = g.querySelector(`[data-land="${id}"]`);
      if (p) g.appendChild(p);
    });
    el.map.innerHTML = '';
    el.map.appendChild(svg);
    el.map.setAttribute('aria-busy', 'false');
  }

  function paintMap() {
    if (!el.map.firstChild) buildMap();
    el.map.querySelectorAll('.ld-shape').forEach(p => {
      const land = byId[p.dataset.land];
      const st = stateOf(land);
      p.classList.toggle('is-ready', st === 'ready');
      p.classList.toggle('is-read', st === 'read');
      p.classList.toggle('is-soon', st === 'soon');
      p.classList.toggle('is-sel', !game && picked === land.id);
    });
    // подписи — у готовых и выбранной (во время игры подписей нет)
    el.map.querySelectorAll('.ld-label').forEach(t => {
      const land = byId[t.dataset.for];
      t.classList.toggle('is-on', !game && (land.ready || picked === land.id));
    });
    el.map.classList.toggle('is-game', !!game);
  }

  // Ключевые цифры для карточки под картой — из паспорта земли
  const PICK_FACTS = ['Население', 'Площадь', 'Столица'];

  // Карточка выбранной земли под картой: шапка (флаг, название, столица),
  // описание на всю ширину, 2–3 цифры чипами и кнопки во всю ширину —
  // на телефоне текст не сжимается в узкую колонку
  function renderPick() {
    const land = picked && byId[picked];
    if (!land || game) { el.pick.innerHTML = ''; return; }
    const head = `<div class="ld-pick-head">
        ${flagHtml(land, 'is-mid')}
        <div class="ld-pick-titles">
          <div class="ld-pick-de" lang="de" dir="ltr">${esc(land.name)}</div>
          <div class="ld-card-ru"><span>${esc(land.nameRu)}</span> · <span>столица</span> <span lang="de" dir="ltr">${esc(land.capital)}</span></div>
        </div>
        <button class="ld-pick-close" type="button" data-pick-close aria-label="Закрыть" title="Закрыть">✕</button>
      </div>`;
    if (!land.ready) {
      el.pick.innerHTML = `<div class="ld-pick-card is-soon">${head}
        <p class="ld-pick-blurb"><span>Эта земля пока в разработке</span> 🚧</p></div>`;
      return;
    }
    const facts = (land.facts || []).filter(([k]) => PICK_FACTS.includes(k) && k !== 'Столица')
      .map(([k, v]) => `<span class="ld-pick-fact"><b>${esc(k)}</b><span>${esc(v)}</span></span>`).join('');
    const t = land.texts[level()] || Object.values(land.texts)[0];
    const lv = Object.keys(land.texts).find(k => land.texts[k] === t);
    const p = percentOf(t.id);
    el.pick.innerHTML = `<div class="ld-pick-card">${head}
      <p class="ld-pick-blurb">${esc(land.blurb)}</p>
      ${facts ? `<div class="ld-pick-facts">${facts}</div>` : ''}
      <div class="ld-pick-actions">
        <button class="ld-open is-wide" type="button" data-read="${esc(t.id)}">▶ <span>${p > 0 && p < READ_PCT ? 'Продолжить' : 'Читать'}</span> · ${esc(levels[lv].level)}</button>
        <button class="news-chip ld-pick-more" type="button" data-open="${esc(land.id)}"><span>Паспорт и тест</span> ›</button>
      </div>
    </div>`;
  }

  function pickOnMap(id) {
    if (game) { gameAnswer(id); return; }
    picked = picked === id ? null : id;
    paintMap();
    renderPick();
  }

  /* ── Игра «Найди землю» ── */

  function startGame() {
    picked = null;
    game = { order: shuffle(lands.map(l => l.id)).slice(0, GAME_N), i: 0, score: 0, lock: false };
    el.game.hidden = false;
    el.gameBtn.hidden = true;
    renderGame();
    paintMap();
    renderPick();
    // вопрос и вся карта — в одном кадре
    el.game.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function stopGame() {
    game = null;
    el.game.hidden = true;
    el.game.innerHTML = '';
    el.gameBtn.hidden = false;
    el.map.querySelectorAll('.is-ok, .is-bad').forEach(p => p.classList.remove('is-ok', 'is-bad'));
    paintMap();
  }

  function renderGame(note) {
    if (!game) return;
    if (game.i >= game.order.length) {
      const best = Math.max(Number(readStore(GAME_KEY)) || 0, game.score);
      writeStore(GAME_KEY, String(best));
      el.game.innerHTML = `<div class="ld-game-row">
          <span class="ld-game-q">🎯 <span>Результат</span>: <b>${game.score}</b> <span>из</span> <b>${game.order.length}</b></span>
          <span class="ld-game-best"><span>Рекорд</span>: <b>${best}</b></span>
        </div>
        <div class="ld-game-row">
          <button class="news-chip" type="button" data-game="again">↻ <span>Ещё раз</span></button>
          <button class="news-chip" type="button" data-game="stop">✕ <span>Закрыть</span></button>
        </div>`;
      return;
    }
    const land = byId[game.order[game.i]];
    el.game.innerHTML = `<div class="ld-game-row">
        <span class="ld-game-q"><span lang="de" dir="ltr">Wo liegt</span> <b lang="de" dir="ltr">${esc(land.name)}</b>?</span>
        <span class="ld-game-n">${game.i + 1} / ${game.order.length} · ✓ ${game.score}</span>
      </div>
      <div class="ld-game-row">
        <span class="ld-game-tr">${note || `<span>Где находится</span> «<span>${esc(land.nameRu)}</span>»? <span>Нажмите на карте.</span>`}</span>
        <button class="news-chip" type="button" data-game="stop">✕ <span>Закрыть</span></button>
      </div>`;
  }

  function gameAnswer(id) {
    if (!game || game.lock || game.i >= game.order.length) return;
    const want = game.order[game.i];
    const ok = id === want;
    game.lock = true;
    if (ok) game.score++;
    const pathOf = x => el.map.querySelector(`.ld-shape[data-land="${x}"]`);
    pathOf(want)?.classList.add('is-ok');
    if (!ok) pathOf(id)?.classList.add('is-bad');
    renderGame(ok ? '✓ <span>Верно!</span>'
      : `✗ <span>Это</span> <b lang="de" dir="ltr">${esc(byId[id].name)}</b>. <span>Правильная земля подсвечена зелёным.</span>`);
    setTimeout(() => {
      if (!game) return;
      el.map.querySelectorAll('.is-ok, .is-bad').forEach(p => p.classList.remove('is-ok', 'is-bad'));
      game.i++;
      game.lock = false;
      renderGame();
    }, ok ? 800 : 1600);
  }

  /* ── Страница земли ── */

  function renderLand(land) {
    if (!land) return;
    const cur = level();
    const t = land.texts[cur] || Object.values(land.texts)[0];
    // длинное значение — плитка во всю ширину, короткие — по две в ряд
    const facts = land.facts.map(([k, v]) => `<div class="ld-fact${String(v).length > 34 ? ' is-wide' : ''}"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const lv = Object.entries(land.texts).map(([k, x]) => {
      const p = percentOf(x.id);
      return `<button class="ld-read${k === cur ? ' is-cur' : ''}" type="button" data-read="${esc(x.id)}">
        <span class="ld-read-lv">${esc(levels[k].level)}</span>
        <span class="ld-read-text"><b>${esc(levels[k].label)}</b>
          <span>${countHtml(x.chapters, ['глава', 'главы', 'глав'])} · ${countHtml(x.minutes, ['минута', 'минуты', 'минут'])}</span></span>
        <span class="ld-read-pct">${p >= READ_PCT ? '✓' : p > 0 ? p + '%' : '▶'}</span>
      </button>`;
    }).join('');
    const toc = t.toc.map((c, i) => `<li><button class="ld-toc-item" type="button" data-chapter="${i}" data-tid="${esc(t.id)}">
        <span class="ld-toc-ico" aria-hidden="true">${esc(c.icon)}</span>
        <span class="ld-toc-text"><span class="ld-toc-de" lang="de" dir="ltr">${esc(c.title)}</span>
          <span class="ld-toc-ru">${esc(c.titleRu)}</span></span></button></li>`).join('');
    el.landBody.innerHTML = `
      <header class="ld-hero">
        ${flagHtml(land, 'is-big')}
        <div>
          <h2 class="ld-hero-de" lang="de" dir="ltr">${esc(land.name)}</h2>
          <div class="ld-hero-ru">${esc(land.nameRu)}</div>
        </div>
      </header>
      <p class="ld-blurb">${esc(land.blurb)}</p>
      <section class="ld-box">
        <h3 class="ld-box-title">Паспорт земли</h3>
        <dl class="ld-facts">${facts}</dl>
      </section>
      <section class="ld-box">
        <h3 class="ld-box-title">Читать</h3>
        <div class="ld-reads">${lv}</div>
        <ol class="ld-toc">${toc}</ol>
      </section>
      <section class="ld-box ld-quiz" id="ldQuiz" aria-live="polite"></section>
      <p class="ld-src"><span>Источник</span>: <a href="${esc(land.sourceUrl)}" target="_blank" rel="noopener">${esc(land.source)}</a>
        · <span>сверено</span> ${esc(land.checked)}</p>`;
    document.title = land.name + ' | German Morning';
    renderQuiz();
  }

  function readText(tid, chapter) {
    if (typeof Reader === 'undefined') return;
    if (typeof chapter === 'number') {
      // с начала выбранной главы: ридер читает позицию из того же ключа
      writeStore(POS_KEY + tid, JSON.stringify({ chapter, p: 0, s: 0, w: 0, percent: percentOf(tid) }));
    }
    Reader.open(tid);
  }

  /* ── Тест земли ── */

  function renderQuiz() {
    const box = document.getElementById('ldQuiz');
    const land = view.name === 'land' && byId[view.id];
    if (!box || !land) return;
    const list = land.quiz;
    const best = readStore(QUIZ_KEY + land.id);
    if (!quiz || quiz.id !== land.id) {
      box.innerHTML = `<h3 class="ld-box-title">Проверь себя</h3>
        <p class="ld-quiz-sub">${countHtml(list.length, ['вопрос', 'вопроса', 'вопросов'])} <span>по тексту о земле</span>${best !== null ? ` · <span>лучший результат</span>: <b>${esc(best)}</b> <span>из</span> <b>${list.length}</b>` : ''}</p>
        <button class="ld-open" type="button" data-quiz="start"><span>Начать тест</span> ›</button>`;
      return;
    }
    if (quiz.i >= list.length) {
      const b = Math.max(Number(best) || 0, quiz.score);
      writeStore(QUIZ_KEY + land.id, String(b));
      box.innerHTML = `<h3 class="ld-box-title">Проверь себя</h3>
        <p class="ld-quiz-result"><span>Правильно</span>: <b>${quiz.score}</b> <span>из</span> <b>${list.length}</b></p>
        <button class="news-chip" type="button" data-quiz="start">↻ <span>Пройти ещё раз</span></button>`;
      return;
    }
    const q = list[quiz.i];
    const answered = quiz.pick !== null;
    const opts = q.opts.map((o, k) => {
      let cls = 'ld-opt';
      if (answered && k === q.a) cls += ' is-right';
      else if (answered && k === quiz.pick) cls += ' is-wrong';
      return `<button class="${cls}" type="button" data-opt="${k}"${answered ? ' disabled' : ''}>${esc(o)}</button>`;
    }).join('');
    box.innerHTML = `<h3 class="ld-box-title"><span>Проверь себя</span> <span class="ld-quiz-n">${quiz.i + 1} / ${list.length}</span></h3>
      <p class="ld-quiz-q">${esc(q.q)}</p>
      <div class="ld-opts">${opts}</div>
      ${answered ? `<p class="ld-why ${quiz.pick === q.a ? 'is-right' : 'is-wrong'}">${quiz.pick === q.a ? '✓' : '✗'} <span>${esc(q.why)}</span></p>
        <button class="ld-open" type="button" data-quiz="next">${quiz.i + 1 < list.length ? '<span>Дальше</span> ›' : '<span>Результат</span> ›'}</button>` : ''}`;
  }

  /* ── События ── */

  function onClick(e) {
    const t = e.target;
    const lvl = t.closest('[data-level]');
    if (lvl) {
      writeStore(LEVEL_KEY, lvl.dataset.level);
      renderHub();
      return;
    }
    if (t.closest('#ldGameBtn')) { startGame(); return; }
    if (t.closest('[data-pick-close]')) { picked = null; paintMap(); renderPick(); return; }
    const gm = t.closest('[data-game]');
    if (gm) { if (gm.dataset.game === 'again') startGame(); else stopGame(); return; }
    const shape = t.closest('.ld-shape, .ld-hit');
    if (shape) { pickOnMap(shape.dataset.land); return; }
    const op = t.closest('[data-open]');
    if (op) { openLand(op.dataset.open); return; }
    const card = t.closest('.ld-card[data-land]');
    if (card) { e.preventDefault(); openLand(card.dataset.land); return; }
    if (t.closest('#ldToHub')) { toHub(); return; }
    const rd = t.closest('[data-read]');
    if (rd) { readText(rd.dataset.read); return; }
    const ch = t.closest('[data-chapter]');
    if (ch) { readText(ch.dataset.tid, Number(ch.dataset.chapter)); return; }
    const qz = t.closest('[data-quiz]');
    if (qz && view.name === 'land') {
      if (qz.dataset.quiz === 'start') quiz = { id: view.id, i: 0, score: 0, pick: null };
      else if (quiz) { quiz.i++; quiz.pick = null; }
      renderQuiz();
      return;
    }
    const opt = t.closest('[data-opt]');
    if (opt && quiz && quiz.pick === null) {
      quiz.pick = Number(opt.dataset.opt);
      if (quiz.pick === byId[quiz.id].quiz[quiz.i].a) quiz.score++;
      renderQuiz();
    }
  }

  function onKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const shape = e.target.closest && e.target.closest('.ld-shape');
    if (shape) { e.preventDefault(); pickOnMap(shape.dataset.land); }
  }

  // Ссылка laender.html#land=<текст> открывает текст сразу; под ним — его земля
  function openFromHash() {
    const m = /^#land=([\w-]+)/.exec(location.hash || '');
    if (!m) return;
    const tid = m[1];
    const land = lands.find(l => l.ready && Object.values(l.texts).some(t => t.id === tid));
    try {
      history.replaceState(land ? { view: 'land', land: land.id } : null, '',
        location.pathname + location.search + (land ? '#l=' + land.id : ''));
    } catch (e) { /* старый WebView */ }
    show(land ? { name: 'land', id: land.id } : { name: 'hub' });
    if (land) Reader.open(tid);
  }

  function load() {
    el.list.innerHTML = '<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем земли</span></div>';
    return Promise.all([
      fetch(LANDS_URL, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(LANDS_URL + ': HTTP ' + r.status); return r.json(); }),
      fetch(MAP_URL).then(r => { if (!r.ok) throw new Error(MAP_URL + ': HTTP ' + r.status); return r.json(); })
    ]).then(([data, map]) => {
      lands = (data && Array.isArray(data.lands) ? data.lands : []).filter(l => l && l.id);
      byId = Object.fromEntries(lands.map(l => [l.id, l]));
      levels = data.levels || {};
      sources = data.sources || [];
      shapes = map;
      loaded = true;
      if (view.name === 'read') { show({ name: 'hub' }); openFromHash(); }
      else show(view);
    }).catch(err => {
      console.error('[Laender] данные не загрузились:', err);
      el.list.setAttribute('aria-busy', 'false');
      el.list.innerHTML = `<div class="news-error"><b>Не удалось загрузить земли.</b>
        <span>Проверьте соединение и попробуйте снова.</span>
        <button class="news-btn" type="button" id="ldRetry">Повторить</button>
        <small>${esc(err && err.message ? err.message : String(err))}</small></div>`;
      document.getElementById('ldRetry')?.addEventListener('click', load);
    });
  }

  function init() {
    const $ = id => document.getElementById(id);
    el = {
      hub: $('ldHub'), land: $('ldLand'), landBody: $('ldLandBody'), levels: $('ldLevels'),
      map: $('ldMap'), pick: $('ldPick'), list: $('ldList'), done: $('ldDone'),
      game: $('ldGame'), gameBtn: $('ldGameBtn')
    };
    if (!el.hub || !el.land) return;
    const page = $('libView');
    page.addEventListener('click', onClick);
    page.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('dm:tg-ready', syncTgBack);
    view = viewFromHash();
    load();
  }

  // После закрытия ридера: процент прочтения, закрашенная земля
  function refresh() {
    if (!loaded) return;
    if (view.name === 'land') renderLand(byId[view.id]);
    else renderHub();
  }

  return {
    init, refresh, openLand, toHub, startGame,
    get lands() { return lands; }, get view() { return view; }, get game() { return game; }, get quiz() { return quiz; }
  };
})();

document.addEventListener('DOMContentLoaded', () => Laender.init());
