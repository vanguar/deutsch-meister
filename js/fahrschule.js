/* ═══════════════════════════════════════════════
   fahrschule.js — раздел «Автошкола» (fahrschule.html)

   Немецкий для будущих водителей категории B. Данные собирает
   tools/fahrschule/build.py: data/fahrschule/index.json и <id>.json; на
   украинском и арабском js/i18n.js подменяет запрос на готовую копию
   i18n/<lang>/fahrschule/… (как у диалогов и книг).

   Два вида, у каждого свой адрес:
     • список уроков   — fahrschule.html
     • урок            — fahrschule.html#u=t-01
   Вглубь — запись в history; «назад», Telegram BackButton и «← …»
   поднимаются на уровень выше, со списка — на главную.

   Уроки трёх видов:
     theory   — правила по разделам (знак рядом со строкой) и тест «Was
                bedeutet dieses Schild?»;
     dialog   — разговор с инструктором, вид «пузырей» из css/dialogs.css;
     junction — перекрёсток в SVG: нажать на машины в порядке проезда,
                потом машины едут, объяснение озвучивается.

   Каждое немецкое слово — <span class="bw fs-w">: тултип перевода тот же,
   что в книгах и новостях (js/reader-tip.js, глоссарий урока в gloss).
   Мышью — подсказка при наведении, щелчок озвучивает слово (как в
   уроках); пальцем — подсказка по тапу, в ней 🔊 слова и предложения.
   Значение слова в конкретной строке (отделяемая приставка, оборот)
   лежит в line.o: {слово: ключ глоссария}.

   Озвучка — общая очередь ReaderSpeak (js/reader-speak.js) поверх TTS
   (js/tts.js), один голос, как в уроках. Останавливается при уходе с
   урока, смене вкладки и запуске другой фразы.
   Zero dependencies (нужны TTS, ReaderSpeak, ReaderTip).
   ═══════════════════════════════════════════════ */

const Fahrschule = (() => {

  const INDEX_URL = 'data/fahrschule/index.json';
  const DATA_DIR  = 'data/fahrschule/';
  const TR_KEY    = 'dm_fs_tr';      // показывать перевод: '1' / '0'
  const HOME_URL  = 'index.html';
  const GAP_MS    = 380;             // пауза между фразами
  const RATE      = 0.9;
  // Слово — как в tools/fahrschule/build.py (WORD_RE): держать одинаковыми
  const WORD_RE   = /km\/h|[A-Za-zÄÖÜäöüßÉé]+(?:-[A-Za-zÄÖÜäöüßÉé]+)*/g;

  const KINDS = {
    theory:   { label: 'Теория',      text: 'Правила и знаки с озвучкой и тестом',   forms: ['правило', 'правила', 'правил'] },
    dialog:   { label: 'Практика',    text: 'Разговор с инструктором за рулём',       forms: ['реплика', 'реплики', 'реплик'] },
    junction: { label: 'Перекрёсток', text: 'Кто едет первым? Расставьте машины по очереди', forms: ['ситуация', 'ситуации', 'ситуаций'] },
    road:     { label: 'На дороге',   text: 'Остановочный путь и дистанция — посчитайте и посмотрите', forms: ['ситуация', 'ситуации', 'ситуаций'] }
  };

  // Перекрёсток 300×300: дороги шириной 64 по центру, правостороннее
  // движение. Машина рисуется в системе «подъезд с юга, едет на север»,
  // остальные подъезды — поворот этой системы вокруг центра.
  const ROT = { S: 0, W: 90, N: 180, E: 270 };
  const ROUTE = {
    straight: 'M165 232 L165 -40',
    right:    'M165 232 L165 196 Q165 165 196 165 L340 165',
    left:     'M165 232 L165 172 Q165 135 128 135 L-40 135'
  };
  // Короткая стрелка «куда собирается ехать»
  const HINT = {
    straight: 'M165 200 L165 108',
    right:    'M165 200 Q165 165 200 165 L214 165',
    left:     'M165 196 Q165 135 112 135 L96 135'
  };
  const CAR = {
    blue:   { fill: '#2f7fd8', de: 'blaue Auto',  label: 'синяя машина' },
    red:    { fill: '#e0484f', de: 'rote Auto',   label: 'красная машина' },
    green:  { fill: '#2fa866', de: 'grüne Auto',  label: 'зелёная машина' },
    yellow: { fill: '#e8b923', de: 'gelbe Auto',  label: 'жёлтая машина' }
  };
  const DRIVE_MS = 1500;   // проезд одной машины
  const NEXT_MS  = 1000;   // следующая трогается, пока предыдущая ещё едет

  let el = {};
  let units  = [];          // оглавление
  let topics = [];          // темы: { id, emoji, title, titleTr, units: [id] }
  let loaded = false;
  let view   = { name: 'hub' };
  let unit   = null;        // открытый урок (полный JSON)
  let loadSeq = 0;
  let playing = null;       // ключ того, что звучит: 'all' | 's:<n>' | null
  let sentences = [];       // фразы на экране: [{ de, tr }], индекс = data-s
  let quiz  = null;         // { i, score, answered, opts, base, tr — перевод вопроса и вариантов открыт }
  let scene = null;         // { i, pick, done }
  let anims = [];           // requestAnimationFrame машин
  let timers = [];
  const cache = {};
  const pending = {};       // уроки в пути: открытие и фоновая загрузка не качают дважды
  const PREFETCH_MAX = 6;

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* приватный режим */ }
  }

  // Русские и украинские числительные устроены одинаково: 1 / 2–4 / 5+
  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5)   return forms[1];
    if (b === 1)          return forms[0];
    return forms[2];
  }

  // Число и слово — в разных узлах: DOM-переводчик (js/i18n.js) переводит
  // слово, число остаётся как есть
  function countHtml(n, forms) {
    return `<b>${n}</b> <span>${plural(n, forms)}</span>`;
  }

  function ofHtml(a, b) {
    return `<b>${a}</b> <span>из</span> <b>${b}</b>`;
  }

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function tg() {
    const w = window.Telegram && window.Telegram.WebApp;
    return w && w.initData && w.BackButton && w.isVersionAtLeast && w.isVersionAtLeast('6.1') ? w : null;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Немецкий текст: слова с подсказкой ── */

  // Ключ глоссария слова: своё значение в строке (o) или общая форма
  function wordKey(word, o) {
    const low = word.toLowerCase();
    return (o && o[low]) || low;
  }

  // Строка → HTML: слова — <span class="bw fs-w">, между ними текст как есть
  function wordsHtml(t) {
    const de = String((t && t.de) || '');
    let out = '';
    let last = 0;
    de.replace(WORD_RE, (w, at) => {
      out += esc(de.slice(last, at));
      out += `<span class="bw fs-w" data-t="${esc(wordKey(w, t.o))}">${esc(w)}</span>`;
      last = at + w.length;
      return w;
    });
    return out + esc(de.slice(last));
  }

  // Фраза, которую можно озвучить и перевести целиком (кнопка
  // «Предложение» в тултипе): номер в sentences — data-s
  function sentence(t, tag, cls) {
    const n = sentences.push({ de: t.de, tr: t.tr || '' }) - 1;
    return `<${tag} class="fs-s${cls ? ' ' + cls : ''}" data-s="${n}" lang="de" dir="ltr">${wordsHtml(t)}</${tag}>`;
  }

  /* ── Адрес ↔ вид ── */

  function viewFromHash() {
    const m = /^#u=([a-z]-\d\d)\b/.exec(location.hash || '');
    return m ? { name: 'unit', id: m[1] } : { name: 'hub' };
  }

  function setUrl(v, mode) {
    const url = location.pathname + location.search + (v.name === 'unit' ? '#u=' + v.id : '');
    const st = { fs: true, pushed: mode === 'push' };
    try {
      if (mode === 'push') history.pushState(st, '', url);
      else history.replaceState(st, '', url);
    } catch (e) { /* старый WebView */ }
  }

  function go(v) {
    setUrl(v, 'push');
    show(v);
  }

  function up() {
    if (view.name !== 'unit') { stopAll(); location.href = HOME_URL; return; }
    if (history.state && history.state.fs && history.state.pushed) { history.back(); return; }
    setUrl({ name: 'hub' }, 'replace');
    show({ name: 'hub' });
  }

  let tgBound = false;
  function syncTgBack() {
    const w = tg();
    if (!w) return;
    if (!tgBound) { w.BackButton.onClick(up); tgBound = true; }
    w.BackButton.show();
  }

  /* ── Показ вида ── */

  function show(v) {
    stopAll();
    if (loaded && v.name === 'unit' && !units.some(u => u.id === v.id)) {
      v = { name: 'hub' };      // старая ссылка на убранный урок
      setUrl(v, 'replace');
    }
    view = v;
    el.hub.hidden  = v.name !== 'hub';
    el.unit.hidden = v.name !== 'unit';
    syncTgBack();
    if (!loaded) return;
    if (v.name === 'hub') { renderHub(); document.title = el.baseTitle; }
    else openUnit(v.id);
    window.scrollTo(0, 0);
  }

  /* ── Список уроков ── */

  function tileHtml(u) {
    const k = KINDS[u.kind];
    return `<a class="news-tile is-live fs-tile" href="#u=${esc(u.id)}" data-unit="${esc(u.id)}">
      <div class="news-tile-top">
        <div class="news-tile-ico fs-kind-ico kind-${u.kind}" aria-hidden="true">${esc(u.emoji)}</div>
        <div class="news-tile-head">
          <div class="news-tile-title">${esc(k.label)}</div>
          <div class="news-tile-text">${esc(k.text)}</div>
        </div>
      </div>
      <div class="fs-tile-unit">
        <span class="fs-tile-de" lang="de" dir="ltr">${esc(u.title)}</span>
        <span class="fs-tile-tr">${esc(u.titleTr)}</span>
      </div>
      <div class="news-tile-foot">
        <span class="news-tile-count">${countHtml(u.count, k.forms)}</span>
        <span class="fs-tile-level">${esc(u.level)}</span>
        <span class="news-tile-go">Открыть →</span>
      </div>
    </a>`;
  }

  function soonTileHtml() {
    return `<div class="news-tile is-soon fs-tile fs-soon" aria-disabled="true">
      <span class="news-tile-badge soon">Скоро</span>
      <div class="news-tile-top">
        <div class="news-tile-ico fs-kind-ico" aria-hidden="true">🛣️</div>
        <div class="news-tile-head">
          <div class="news-tile-title">Дальше</div>
          <div class="news-tile-text">Скорость, обгон, парковка, автобан и экзамен — следующие темы</div>
        </div>
      </div>
    </div>`;
  }

  // Тема — отдельная карточка: шапка полосой (номер, эмодзи, название),
  // под ней сетка её уроков. Так темы не сливаются в одну ленту плиток.
  function topicHtml(t, n, byId) {
    return `<section class="fs-topic" data-topic="${esc(t.id)}" aria-labelledby="fsTopic-${esc(t.id)}">
      <div class="fs-topic-head">
        <span class="news-rubric-ico" aria-hidden="true">${esc(t.emoji)}</span>
        <div class="fs-topic-titles">
          <div class="fs-topic-n"><span>Тема</span> ${n}</div>
          <h2 class="fs-topic-title" id="fsTopic-${esc(t.id)}" lang="de" dir="ltr">${esc(t.title)}</h2>
          <div class="fs-topic-tr">${esc(t.titleTr)}</div>
        </div>
      </div>
      <div class="news-grid fs-topic-grid">${t.units.filter(id => byId[id]).map(id => tileHtml(byId[id])).join('')}</div>
    </section>`;
  }

  function renderHub() {
    el.list.setAttribute('aria-busy', 'false');
    const byId = Object.fromEntries(units.map(u => [u.id, u]));
    el.list.innerHTML = topics.map((t, k) => topicHtml(t, k + 1, byId)).join('') + soonTileHtml();
    // первые уроки тем — заранее, пока человек выбирает
    prefetch(topics.map(t => t.units[0]));
  }

  /* ── Урок ── */

  function fetchUnit(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    if (pending[id]) return pending[id];
    const p = fetch(DATA_DIR + id + '.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(id + '.json: HTTP ' + r.status); return r.json(); })
      .then(d => { cache[id] = d; return d; });
    pending[id] = p;
    const done = () => { if (pending[id] === p) delete pending[id]; };
    p.then(done, done);
    return p;
  }

  /* ── Фоновая загрузка ──
     Открытый урок грузится сразу и один. Когда он нарисован и браузер
     свободен (requestIdleCallback), по одному подтягиваются остальные
     уроки этой темы и следующей вместе с картинками знаков: следующий
     урок откроется мгновенно, а service worker сохранит их и для офлайна.
     В режиме экономии трафика и на 2G — не качаем лишнего. */

  function idle(fn) {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 1200);
  }

  function saveData() {
    const c = navigator.connection;
    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
  }

  function preloadSigns(d) {
    Object.values((d && d.signs) || {}).forEach(s => {
      const img = new Image();
      img.decoding = 'async';
      img.src = s.src;
    });
  }

  function prefetch(ids) {
    if (saveData()) return;
    const list = [...new Set(ids)].filter(id => id && !cache[id] && units.some(u => u.id === id)).slice(0, PREFETCH_MAX);
    let k = 0;
    const next = () => {
      if (k >= list.length) return;
      const id = list[k++];
      if (cache[id]) { next(); return; }
      fetchUnit(id).then(d => { preloadSigns(d); idle(next); }, () => { /* офлайн — откроется при переходе */ });
    };
    idle(next);
  }

  // Соседи открытого урока: остальные уроки темы, потом следующая тема
  function prefetchAround(id) {
    const ti = topics.findIndex(t => t.units.includes(id));
    if (ti < 0) return;
    prefetch(topics[ti].units.concat((topics[ti + 1] || {}).units || []).filter(x => x !== id));
  }

  function openUnit(id) {
    const seq = ++loadSeq;
    unit = null;
    el.body.innerHTML = '<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем урок</span></div>';
    el.heading.innerHTML = '';
    fetchUnit(id).then(d => {
      if (seq !== loadSeq) return;
      unit = d;
      renderUnit();
    }).catch(err => {
      if (seq !== loadSeq) return;
      console.error('[Fahrschule] урок не загрузился:', err);
      el.body.innerHTML = `<div class="news-error"><b>Не удалось загрузить урок.</b>
        <span>Проверьте соединение и попробуйте снова.</span>
        <button class="news-btn" type="button" data-retry>Повторить</button></div>`;
    });
  }

  function renderUnit() {
    const u = unit;
    sentences = [];
    quiz = null;
    scene = null;
    const k = KINDS[u.kind];
    el.heading.innerHTML = `
      <span class="dlg-level-chip fs-kind-chip kind-${u.kind}">${esc(k.label)}</span>
      <span class="fs-level">${esc(u.level)}</span>
      ${sentence({ de: u.title, tr: u.titleTr }, 'h2', 'dlg-title')}
      <div class="dlg-title-tr">${esc(u.titleTr)}</div>
      <p class="dlg-situation">${esc(u.intro)}</p>`;
    document.title = u.title + ' | German Morning';
    if (u.kind === 'theory') el.body.innerHTML = theoryHtml(u);
    else if (u.kind === 'dialog') el.body.innerHTML = dialogHtml(u);
    else el.body.innerHTML = '<div class="fs-junction" id="fsJunction"></div>';
    paintTr();
    paintPlay();
    if (u.kind === 'theory' && u.quiz && u.quiz.length) startQuiz();
    if (u.kind === 'junction' || u.kind === 'road') openScene(0);
    prefetchAround(u.id);
  }

  function controlsHtml(label) {
    return `<div class="dlg-controls">
      <button class="dlg-play" type="button" data-play="all" aria-pressed="false">
        <span class="dlg-play-ico" aria-hidden="true">▶</span> <span class="dlg-play-label">${esc(label)}</span>
      </button>
      <button class="news-chip dlg-tr-toggle" type="button" data-tr-toggle aria-pressed="false">🌐 <span>Перевод</span></button>
    </div>
    <p class="dlg-voice-note fs-hint"><span>Нажмите на слово — перевод слова. 🌐 у строки (или нажатие на строку) — перевод фразы, 🔊 — озвучка.</span></p>`;
  }

  function sayBtn(n) {
    return `<button class="dlg-say" type="button" data-say="${n}" title="Озвучить фразу" aria-label="Озвучить фразу">🔊</button>`;
  }

  // Видимая подсказка, что у фразы есть перевод: 🌐 открывает его у этой строки
  function trBtn() {
    return '<button class="dlg-say fs-tr-btn" type="button" data-tr-line aria-pressed="false" title="Перевод фразы" aria-label="Перевод фразы">🌐</button>';
  }

  function lineBtns(n) {
    return `<div class="fs-btns">${sayBtn(n)}${trBtn()}</div>`;
  }

  function signHtml(s, big) {
    if (!s) return '';
    return `<img class="fs-sign-img${big ? ' is-big' : ''}" src="${esc(s.src)}" alt="Zeichen ${esc(s.n)}" width="${big ? 120 : 64}" height="${big ? 120 : 64}" decoding="async">`;
  }

  /* ── Теория ── */

  function theoryHtml(u) {
    const secs = (u.sections || []).map(sec => `<section class="fs-sec">
      <h3 class="fs-sec-title">${esc(sec.title)}</h3>
      <ol class="fs-lines">${sec.lines.map(ln => {
        const s = ln.sign && u.signs[ln.sign];
        const n = sentences.length;
        const body = sentence(ln, 'p', 'fs-de');
        const sign = s ? `<figure class="fs-sign">
            ${signHtml(s)}
            <figcaption>
              <span class="fs-sign-n">Zeichen ${esc(s.n)}</span>
              ${sentence({ de: s.de, tr: s.tr }, 'span', 'fs-sign-de')}
              <span class="fs-sign-tr">${esc(s.tr)}</span>
            </figcaption>
          </figure>` : '';
        return `<li class="fs-line" data-line="${n}">
          ${sign}
          <div class="fs-line-row">
            <div class="fs-line-text">${body}<p class="fs-tr" dir="auto">${esc(ln.tr)}</p></div>
            ${lineBtns(n)}
          </div>
        </li>`;
      }).join('')}</ol>
    </section>`).join('');
    const quizBox = u.quiz && u.quiz.length
      ? `<section class="fs-quiz" id="fsQuiz" aria-live="polite"></section>` : '';
    return controlsHtml('Слушать урок') + secs + quizBox;
  }

  // Строки урока для «Слушать урок»: правила или реплики, без подписей знаков
  function lessonLines() {
    return [...el.body.querySelectorAll('.fs-line .fs-de')].map(p => Number(p.dataset.s));
  }

  // Пояснение к сцене перекрёстка (появляется после ответа)
  function explainLines() {
    return [...el.body.querySelectorAll('.fs-explain .fs-de')].map(p => Number(p.dataset.s));
  }

  /* ── Тест по знакам ── */

  // base — сколько фраз было до теста: вопрос перерисовывается, а его
  // фразы (вопрос, пояснение) каждый раз регистрируются заново
  function startQuiz() {
    if (quiz) sentences = sentences.slice(0, quiz.base);
    quiz = { i: 0, score: 0, answered: false, opts: [], base: sentences.length, tr: !!(quiz && quiz.tr) };
    renderQuiz();
  }

  // Строка теории, которая объясняет знак, — она же пояснение к ответу.
  // Последняя: знак сначала мелькает в обзоре («знаки бывают круглые»),
  // а подробное правило про него идёт ниже.
  function lineForSign(sid) {
    let found = null;
    for (const sec of unit.sections || []) {
      for (const l of sec.lines) if (l.sign === sid) found = l;
    }
    return found;
  }

  function renderQuiz() {
    const box = document.getElementById('fsQuiz');
    if (!box || !quiz) return;
    sentences = sentences.slice(0, quiz.base);
    const list = unit.quiz;
    if (quiz.i >= list.length) {
      const all = quiz.score === list.length;
      box.innerHTML = `<h3 class="fs-sec-title">Проверьте себя</h3>
        <div class="fs-result${all ? ' is-all' : ''}">
          <div class="fs-result-big">${all ? '🏆' : '🚗'}</div>
          <div class="fs-result-text"><span>Правильно</span>: ${ofHtml(quiz.score, list.length)}</div>
          <button class="news-chip" type="button" data-quiz-restart>↻ <span>Пройти ещё раз</span></button>
        </div>`;
      return;
    }
    const q = list[quiz.i];
    if (!quiz.answered) quiz.opts = shuffle([q.sign].concat(q.wrong));
    const s = unit.signs[q.sign];
    const answer = quiz.answered ? quiz.answered : null;
    const opts = quiz.opts.map(sid => {
      const o = unit.signs[sid];
      let cls = 'fs-opt';
      if (answer) {
        if (sid === q.sign) cls += ' is-right';
        else if (sid === answer) cls += ' is-wrong';
      }
      return `<button class="${cls}" type="button" data-opt="${esc(sid)}"${answer ? ' disabled' : ''}>
        <span class="fs-opt-de" lang="de" dir="ltr">${esc(o.de)}</span>
        <span class="fs-opt-tr">${esc(o.tr)}</span>
      </button>`;
    }).join('');
    let after = '';
    if (answer) {
      const ln = lineForSign(q.sign);
      const right = answer === q.sign;
      const n = ln ? sentences.length : -1;
      after = `<div class="fs-verdict ${right ? 'is-right' : 'is-wrong'}">${right ? '✓ <span>Верно!</span>' : '✗ <span>Не совсем.</span>'}</div>
        ${ln ? `<div class="fs-explain-one fs-line-row">
          <div class="fs-line-text">${sentence(ln, 'p', 'fs-de')}<p class="fs-tr is-open" dir="auto">${esc(ln.tr)}</p></div>
          ${sayBtn(n)}
        </div>` : ''}
        <button class="dlg-play fs-next" type="button" data-quiz-next>${quiz.i + 1 < list.length ? '<span>Дальше</span> ›' : '<span>Результат</span> ›'}</button>`;
    }
    box.innerHTML = `<h3 class="fs-sec-title">Проверьте себя</h3>
      <div class="fs-quiz-card${quiz.tr ? ' tr-open' : ''}">
        <div class="fs-quiz-top">
          <span><span>Вопрос</span> <span class="fs-quiz-n">${quiz.i + 1} / ${list.length}</span></span>
          <button class="news-chip fs-quiz-tr" type="button" data-tr-line aria-pressed="${quiz.tr ? 'true' : 'false'}">🌐 <span>Перевод</span></button>
        </div>
        ${signHtml(s, true)}
        ${unit.quizQuestion ? sentence(unit.quizQuestion, 'p', 'fs-quiz-q') + `<p class="fs-tr fs-quiz-q-tr" dir="auto">${esc(unit.quizQuestion.tr)}</p>` : ''}
        <div class="fs-opts${answer ? ' is-answered' : ''}">${opts}</div>
        ${after}
      </div>`;
  }

  function answerQuiz(sid) {
    if (!quiz || quiz.answered) return;
    const q = unit.quiz[quiz.i];
    quiz.answered = sid;
    if (sid === q.sign) quiz.score++;
    renderQuiz();
    // правильный ответ звучит сразу: так название знака запоминается
    speak([unit.signs[q.sign].de], 'quiz');
  }

  /* ── Диалог (вид «Диалогов») ── */

  function dialogHtml(u) {
    const sp = u.speakers || {};
    const lines = u.lines.map(ln => {
      const who = sp[ln.s] || { name: ln.s };
      const n = sentences.length;
      return `<li class="dlg-line side-${ln.s === 'A' ? 'a' : 'b'} fs-line" data-line="${n}">
        <div class="dlg-bubble">
          <div class="dlg-who" lang="de" dir="ltr">${esc(who.name)}</div>
          ${sentence(ln, 'div', 'dlg-de fs-de')}
          <div class="dlg-tr fs-tr" dir="auto">${esc(ln.tr || '')}</div>
        </div>
        ${lineBtns(n)}
      </li>`;
    }).join('');
    return controlsHtml('Слушать диалог') + `<ol class="dlg-lines fs-dialog">${lines}</ol>`;
  }

  /* ── Перекрёсток ── */

  function openScene(i) {
    stopAll();
    scene = unit.kind === 'road'
      ? { i, pick: null, done: false, right: false, shown: false }
      : { i, pick: [], done: false, right: false };
    renderScene();
  }

  function sceneSvg(sc) {
    const signs = sc.signs || {};
    const lights = sc.lights || null;
    const approach = a => {
      const s = signs[a];
      const light = lights && lights[a];
      if (!s && !light) return '';
      const r = ROT[a];
      // у светофора — сплошная стоп-линия (Haltlinie), у знаков 205/206 —
      // пунктирная линия ожидания и сплошная у «Стоп»
      const stop = light || s === 'z206'
        ? '<path class="fs-wait" d="M150 186 H182"/>'
        : s === 'z205' ? '<path class="fs-wait" d="M150 186 H182" stroke-dasharray="6 4"/>' : '';
      // светофор и знак стоят справа от подъезда; поворачиваем только место,
      // сами они — прямо. Рядом со светофором знак (Grünpfeil) меньше.
      const lightHtml = light ? `<g transform="translate(198 206) rotate(${-r})">
          <g class="fs-light state-${light}" data-light="${a}">
            <rect class="fs-light-box" x="-6.5" y="-16" width="13" height="32" rx="3.5"/>
            <circle class="fs-l-red" cy="-9.5" r="3.8"/><circle class="fs-l-yellow" cy="0" r="3.8"/><circle class="fs-l-green" cy="9.5" r="3.8"/>
          </g></g>` : '';
      const plate = s ? (light
        ? `<g transform="translate(219 206) rotate(${-r})"><image href="${esc(unit.signs[s].src)}" x="-9" y="-6" width="18" height="12"/></g>`
        : `<g transform="translate(206 210) rotate(${-r})"><image href="${esc(unit.signs[s].src)}" x="-13" y="-13" width="26" height="26"/></g>`) : '';
      return `<g transform="rotate(${r} 150 150)">${stop}${lightHtml}${plate}</g>`;
    };
    const cars = sc.cars.map(c => {
      const col = CAR[c.id];
      const r = ROT[c.from];
      const blink = c.turn === 'left' ? [-10] : c.turn === 'right' ? [10] : [];
      return `<g class="fs-frame" transform="rotate(${r} 150 150)">
        <path class="fs-hint-path" d="${HINT[c.turn]}" stroke="${col.fill}" marker-end="url(#fsArrow-${c.id})"/>
        <path class="fs-path" d="${ROUTE[c.turn]}"/>
        <g class="fs-car" data-car="${c.id}" role="button" tabindex="0" aria-label="${esc(col.label)}">
          <g class="fs-car-body" transform="translate(165 232)">
            <rect class="fs-car-hit" x="-20" y="-28" width="40" height="56" rx="8"/>
            <rect x="-11" y="-19" width="22" height="38" rx="6" fill="${col.fill}" class="fs-car-shell"/>
            <rect class="fs-glass" x="-8" y="-12" width="16" height="8" rx="2"/>
            <rect class="fs-glass" x="-8" y="8" width="16" height="5" rx="2"/>
            ${blink.map(x => `<circle class="fs-blink" cx="${x}" cy="-17" r="2.6"/><circle class="fs-blink" cx="${x}" cy="17" r="2.6"/>`).join('')}
            <g class="fs-badge" transform="rotate(${-r})"><circle r="10"/><text y="4">?</text></g>
          </g>
        </g>
      </g>`;
    }).join('');
    const markers = sc.cars.map(c => `<marker id="fsArrow-${c.id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="${CAR[c.id].fill}"/></marker>`).join('');
    return `<svg class="fs-svg" viewBox="0 0 300 300" role="group" aria-label="Kreuzung">
      <defs>${markers}</defs>
      <rect class="fs-grass" x="0" y="0" width="300" height="300"/>
      <rect class="fs-road" x="0" y="118" width="300" height="64"/>
      <rect class="fs-road" x="118" y="0" width="64" height="300"/>
      <path class="fs-mark" d="M0 150 H114 M186 150 H300 M150 0 V114 M150 186 V300"/>
      ${['S', 'W', 'N', 'E'].map(approach).join('')}
      ${cars}
    </svg>`;
  }

  function renderScene() {
    if (unit && unit.kind === 'road') { renderRoad(); return; }
    const box = document.getElementById('fsJunction');
    if (!box || !scene) return;
    const list = unit.scenes;
    const sc = list[scene.i];
    sentences = sentences.slice(0, 1);   // заголовок урока остаётся, фразы сцены — заново
    const sit = sentence(sc.situation, 'p', 'fs-de');
    const q = sentence({ de: unit.title, tr: unit.titleTr }, 'p', 'fs-quiz-q');
    const explain = scene.done ? sc.explain.map(e => {
      const n = sentences.length;
      return `<li class="fs-line" data-line="${n}"><div class="fs-line-row">
        <div class="fs-line-text">${sentence(e, 'p', 'fs-de')}<p class="fs-tr" dir="auto">${esc(e.tr)}</p></div>
        ${lineBtns(n)}</div></li>`;
    }).join('') : '';
    box.innerHTML = `
      <div class="fs-scene-top">
        <span><span>Ситуация</span> <span class="fs-scene-n">${scene.i + 1} / ${list.length}</span></span>
        <span class="fs-dots" aria-hidden="true">${list.map((_, k) => `<i class="${k === scene.i ? 'on' : ''}"></i>`).join('')}</span>
      </div>
      <div class="fs-situation fs-line-row">
        <div class="fs-line-text">${sit}<p class="fs-tr" dir="auto">${esc(sc.situation.tr)}</p></div>
        ${trBtn()}
      </div>
      ${q}
      <div class="fs-scene" id="fsScene">${sceneSvg(sc)}</div>
      <p class="fs-status" id="fsStatus" aria-live="polite"></p>
      <div class="fs-scene-actions" id="fsActions"></div>
      ${scene.done ? `<ol class="fs-lines fs-explain">${explain}</ol>` : ''}`;
    paintScene();
    paintTr();
  }

  function paintScene() {
    if (!scene) return;
    const sc = unit.scenes[scene.i];
    const order = scene.done ? sc.order : scene.pick;
    document.querySelectorAll('#fsScene .fs-car').forEach(g => {
      const k = order.indexOf(g.dataset.car);
      const t = g.querySelector('.fs-badge text');
      g.classList.toggle('is-picked', k >= 0);
      if (t) t.textContent = k >= 0 ? String(k + 1) : '?';
      g.setAttribute('aria-pressed', k >= 0 ? 'true' : 'false');
    });
    const st = document.getElementById('fsStatus');
    const act = document.getElementById('fsActions');
    if (!st || !act) return;
    const last = scene.i >= unit.scenes.length - 1;
    if (!scene.done) {
      st.className = 'fs-status';
      st.innerHTML = scene.pick.length
        ? `<span>Выбрано</span>: ${ofHtml(scene.pick.length, sc.cars.length)}`
        : '<span>Нажимайте на машины по очереди: кто проедет первым, вторым…</span>';
      act.innerHTML = scene.pick.length
        ? '<button class="news-chip" type="button" data-scene-reset>↺ <span>Сбросить</span></button>' : '';
      return;
    }
    st.className = 'fs-status ' + (scene.right ? 'is-right' : 'is-wrong');
    st.innerHTML = scene.right
      ? '✓ <span>Верно! Так машины и поедут.</span>'
      : '✗ <span>Не совсем. Правильный порядок — на машинах.</span>';
    act.innerHTML = `
      <button class="dlg-play" type="button" data-play="explain" aria-pressed="false"><span class="dlg-play-ico" aria-hidden="true">▶</span> <span class="dlg-play-label">Объяснение</span></button>
      <button class="news-chip" type="button" data-scene-again>↻ <span>Ещё раз</span></button>
      ${last ? '' : '<button class="news-chip" type="button" data-scene-next><span>Следующая</span> ›</button>'}`;
    paintPlay();
  }

  function pickCar(id) {
    if (!scene || scene.done || anims.length) return;
    const sc = unit.scenes[scene.i];
    const k = scene.pick.indexOf(id);
    if (k >= 0) scene.pick = scene.pick.slice(0, k);   // снять машину и всё после неё
    else scene.pick.push(id);
    paintScene();
    if (scene.pick.length === sc.cars.length) {
      scene.right = scene.pick.join() === sc.order.join();
      scene.done = true;
      const after = () => {
        renderScene();
        speakList(explainLines(), 'explain');
      };
      if (sc.lights) {
        // на светофоре: сначала зелёные (и Grünpfeil), смена сигнала, потом остальные
        const k = sc.switchAt || 0;
        drive(sc.order.slice(0, k), () => switchLights(sc.lights, () => drive(sc.order.slice(k), after)));
      } else {
        drive(sc.order, after);
      }
    }
  }

  // Машины едут по своим маршрутам в правильном порядке. Каждая
  // следующая трогается, пока предыдущая ещё в пути (NEXT_MS < DRIVE_MS).
  function drive(order, done) {
    const svg = document.querySelector('#fsScene .fs-svg');
    if (!svg || !order.length) { done(); return; }
    svg.classList.add('is-driving');
    const quick = reducedMotion() || typeof requestAnimationFrame !== 'function';
    let left = order.length;
    const finish = () => { if (--left === 0) timers.push(setTimeout(done, quick ? 0 : 250)); };
    order.forEach((id, k) => {
      const car = svg.querySelector(`.fs-car[data-car="${id}"]`);
      const frame = car && car.closest('.fs-frame');
      const path = frame && frame.querySelector('.fs-path');
      const body = car && car.querySelector('.fs-car-body');
      if (!path || !body || typeof path.getTotalLength !== 'function') { finish(); return; }
      if (quick) { car.classList.add('is-gone'); finish(); return; }
      timers.push(setTimeout(() => {
        const len = path.getTotalLength();
        const t0 = performance.now();
        const tick = now => {
          const t = Math.min(1, (now - t0) / DRIVE_MS);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // плавный старт и выход
          const p = path.getPointAtLength(len * e);
          const q = path.getPointAtLength(Math.min(len, len * e + 1));
          const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI + 90;
          body.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
          if (t < 1) { anims[k] = requestAnimationFrame(tick); return; }
          anims[k] = null;
          car.classList.add('is-gone');
          finish();
        };
        anims[k] = requestAnimationFrame(tick);
      }, k * NEXT_MS));
    });
  }

  /* ── На дороге: остановочный путь и дистанция ──
     Ответ и числа считает tools/fahrschule/build.py по формулам автошкол
     (реакция (v/10)·3, торможение (v/10)², экстренно — вдвое; дистанция
     v/2). Здесь только картинка: дорога слева направо, масштаб — чтобы
     весь путь влез в ширину. Сначала человек выбирает ответ, потом
     машина едет: видит помеху, жёлтым растёт путь реакции, красным —
     тормозной путь, затем подписи в метрах. Для дистанции — грузовик
     впереди, столбики на обочине (через 50 м) «едут» мимо. */

  const ROAD_W = 320;
  const ROAD_X0 = 26;
  const REACT_MS = 900;
  const BRAKE_MS = 1300;
  const GAP_ANIM_MS = 2400;
  const HAZARD = { ball: '⚽', deer: '🦌' };

  function roadGeom(sc) {
    if (sc.type === 'gap') {
      const S = 200 / sc.answer;          // дистанция — 200 px
      return { S, front: ROAD_X0 + 34, lead: ROAD_X0 + 34 + sc.answer * S };
    }
    const S = (ROAD_W - ROAD_X0 - 40) / sc.answer;
    return { S, r: sc.reaction * S, b: sc.brake * S, end: ROAD_X0 + sc.answer * S };
  }

  function carHtml(x, cls, fill) {
    return `<g class="${cls}" transform="translate(${x.toFixed(1)} 66)">
      <rect x="-28" y="-9" width="28" height="18" rx="5" fill="${fill}" class="fs-car-shell"/>
      <rect class="fs-glass" x="-10" y="-7" width="6" height="14" rx="2"/>
      <rect class="fs-glass" x="-25" y="-6" width="4" height="12" rx="1.5"/>
      <rect class="fs-brake" x="-29.5" y="-8" width="2.5" height="4" rx="1"/>
      <rect class="fs-brake" x="-29.5" y="4" width="2.5" height="4" rx="1"/>
    </g>`;
  }

  function roadSvg(sc, final) {
    const g = roadGeom(sc);
    const road = `<rect class="fs-grass" x="0" y="0" width="${ROAD_W}" height="130"/>
      <rect class="fs-road" x="0" y="44" width="${ROAD_W}" height="44"/>
      <path class="fs-mark" d="M0 66 H${ROAD_W}"/>`;
    if (sc.type === 'gap') {
      // столбики через 50 м по верхней обочине; двигаются влево — машины едут
      const step = 50 * g.S;
      const posts = [];
      for (let x = -step; x < ROAD_W + step; x += step) {
        posts.push(`<g transform="translate(${x.toFixed(1)} 30)"><rect class="fs-post" x="-2" y="0" width="4" height="12" rx="1"/><rect class="fs-post-band" x="-2" y="3" width="4" height="3"/></g>`);
      }
      const bracket = `<g class="fs-lab${final ? ' is-on' : ''}">
        <path class="fs-bracket" d="M${g.front} 96 V102 H${g.lead.toFixed(1)} V96"/>
        <text class="fs-lab-text" x="${((g.front + g.lead) / 2).toFixed(1)}" y="118">${sc.answer} m</text></g>`;
      return `<svg class="fs-svg fs-road-svg" viewBox="0 0 ${ROAD_W} 130" role="img" aria-label="Abstand">
        ${road}<g class="fs-posts" data-step="${step.toFixed(2)}">${posts.join('')}</g>
        ${carHtml(g.front, 'fs-road-car', CAR.blue.fill)}
        <g class="fs-truck" transform="translate(${g.lead.toFixed(1)} 66)">
          <rect x="0" y="-11" width="46" height="22" rx="3" class="fs-truck-box"/>
          <rect x="46" y="-9" width="12" height="18" rx="3" fill="${CAR.yellow.fill}" class="fs-car-shell"/>
        </g>${bracket}</svg>`;
    }
    const xEnd = ROAD_X0 + (final ? g.r + g.b : 0);
    const lab = (x, y, t, cls) => `<text class="fs-lab-text ${cls || ''}" x="${x.toFixed(1)}" y="${y}">${t}</text>`;
    return `<svg class="fs-svg fs-road-svg" viewBox="0 0 ${ROAD_W} 130" role="img" aria-label="Anhalteweg">
      ${road}
      <rect class="fs-zone-r" x="${ROAD_X0}" y="46" width="${final ? g.r.toFixed(1) : 0}" height="40"/>
      <rect class="fs-zone-b" x="${(ROAD_X0 + g.r).toFixed(1)}" y="46" width="${final ? g.b.toFixed(1) : 0}" height="40"/>
      <text class="fs-hazard${final ? ' is-on' : ''}" x="${(g.end + 14).toFixed(1)}" y="72">${HAZARD[sc.hazard] || '⚠️'}</text>
      ${carHtml(xEnd, 'fs-road-car' + (final ? ' is-braking' : ''), CAR.blue.fill)}
      <g class="fs-lab${final ? ' is-on' : ''}">
        ${lab(ROAD_X0 + g.r / 2, 38, sc.reaction + ' m', 'is-r')}
        ${lab(ROAD_X0 + g.r + g.b / 2, 38, sc.brake + ' m', 'is-b')}
        <path class="fs-bracket" d="M${ROAD_X0} 96 V102 H${g.end.toFixed(1)} V96"/>
        ${lab(ROAD_X0 + (g.r + g.b) / 2, 118, '= ' + sc.answer + ' m')}
      </g>
    </svg>`;
  }

  // Подпись цветов — немецкие слова с подсказкой, как в тексте урока
  function roadLegendHtml(sc) {
    const item = (cls, de) => `<span class="fs-legend-item"><i class="fs-sw ${cls}"></i><span lang="de" dir="ltr">${wordsHtml({ de })}</span></span>`;
    return sc.type === 'gap'
      ? `<div class="fs-legend">${item('fs-sw-gap', 'Abstand')}${item('fs-sw-post', 'Leitpfosten')}</div>`
      : `<div class="fs-legend">${item('fs-sw-r', 'Reaktionsweg')}${item('fs-sw-b', 'Bremsweg')}${item('fs-sw-sum', 'Anhalteweg')}</div>`;
  }

  function renderRoad() {
    const box = document.getElementById('fsJunction');
    if (!box || !scene) return;
    const list = unit.scenes;
    const sc = list[scene.i];
    sentences = sentences.slice(0, 1);   // заголовок урока остаётся, фразы сцены — заново
    const sit = sentence(sc.situation, 'p', 'fs-de');
    const q = sentence(sc.question, 'p', 'fs-quiz-q');
    const opts = sc.options.map(m => {
      let cls = 'fs-opt fs-road-opt';
      if (scene.done && m === sc.answer) cls += ' is-right';
      else if (scene.done && m === scene.pick) cls += ' is-wrong';
      return `<button class="${cls}" type="button" data-road-opt="${m}"${scene.done ? ' disabled' : ''}><span class="fs-opt-de" dir="ltr">${m} m</span></button>`;
    }).join('');
    const explain = scene.shown ? sc.explain.map(e => {
      const n = sentences.length;
      return `<li class="fs-line" data-line="${n}"><div class="fs-line-row">
        <div class="fs-line-text">${sentence(e, 'p', 'fs-de')}<p class="fs-tr" dir="auto">${esc(e.tr)}</p></div>
        ${lineBtns(n)}</div></li>`;
    }).join('') : '';
    const last = scene.i >= list.length - 1;
    let status = '<span>Выберите ответ — потом посмотрите, как это выглядит на дороге.</span>';
    if (scene.done) {
      status = scene.right ? '✓ <span>Верно!</span>' : '✗ <span>Не совсем. Правильный ответ отмечен зелёным.</span>';
    }
    const actions = scene.shown
      ? `<button class="dlg-play" type="button" data-play="explain" aria-pressed="false"><span class="dlg-play-ico" aria-hidden="true">▶</span> <span class="dlg-play-label">Объяснение</span></button>
        <button class="news-chip" type="button" data-scene-again>↻ <span>Ещё раз</span></button>
        ${last ? '' : '<button class="news-chip" type="button" data-scene-next><span>Следующая</span> ›</button>'}`
      : '';
    box.innerHTML = `
      <div class="fs-scene-top">
        <span><span>Ситуация</span> <span class="fs-scene-n">${scene.i + 1} / ${list.length}</span></span>
        <span class="fs-dots" aria-hidden="true">${list.map((_, k) => `<i class="${k === scene.i ? 'on' : ''}"></i>`).join('')}</span>
      </div>
      <div class="fs-situation fs-line-row">
        <div class="fs-line-text">${sit}<p class="fs-tr" dir="auto">${esc(sc.situation.tr)}</p></div>
        ${trBtn()}
      </div>
      ${q}
      <div class="fs-scene fs-road" id="fsScene">${roadSvg(sc, scene.shown)}</div>
      ${roadLegendHtml(sc)}
      <div class="fs-opts fs-road-opts${scene.done ? ' is-answered' : ''}">${opts}</div>
      <p class="fs-status${scene.done ? (scene.right ? ' is-right' : ' is-wrong') : ''}" id="fsStatus" aria-live="polite">${status}</p>
      <div class="fs-scene-actions" id="fsActions">${actions}</div>
      ${scene.shown ? `<ol class="fs-lines fs-explain">${explain}</ol>` : ''}`;
    paintTr();
    paintPlay();
  }

  function pickRoad(m) {
    if (!scene || scene.done) return;
    const sc = unit.scenes[scene.i];
    scene.pick = m;
    scene.right = m === sc.answer;
    scene.done = true;
    renderRoad();
    animateRoad(sc, () => {
      scene.shown = true;
      renderRoad();
      speakList(explainLines(), 'explain');
    });
  }

  function animateRoad(sc, done) {
    const svg = document.querySelector('#fsScene .fs-road-svg');
    if (!svg || reducedMotion() || typeof requestAnimationFrame !== 'function') { done(); return; }
    svg.classList.add('is-driving');
    if (sc.type === 'gap') {
      const posts = svg.querySelector('.fs-posts');
      const step = Number(posts.dataset.step);
      const t0 = performance.now();
      const tick = now => {
        const k = now - t0;
        posts.setAttribute('transform', `translate(${(-((k / 700) % 1) * step).toFixed(1)} 0)`);
        if (k < GAP_ANIM_MS) { anims[0] = requestAnimationFrame(tick); return; }
        anims[0] = null;
        svg.querySelector('.fs-lab').classList.add('is-on');
        timers.push(setTimeout(done, 700));
      };
      anims[0] = requestAnimationFrame(tick);
      return;
    }
    const g = roadGeom(sc);
    const car = svg.querySelector('.fs-road-car');
    const zr = svg.querySelector('.fs-zone-r');
    const zb = svg.querySelector('.fs-zone-b');
    svg.querySelector('.fs-hazard').classList.add('is-on');
    const t0 = performance.now() + 350;          // помеха появилась — водитель ещё не среагировал
    const tick = now => {
      const k = Math.max(0, now - t0);
      let x;
      if (k < REACT_MS) {                       // реакция: едет с прежней скоростью
        x = g.r * (k / REACT_MS);
        zr.setAttribute('width', x.toFixed(1));
      } else {                                  // торможение: замедляется до нуля
        const t = Math.min(1, (k - REACT_MS) / BRAKE_MS);
        const e = 1 - (1 - t) * (1 - t);
        zr.setAttribute('width', g.r.toFixed(1));
        zb.setAttribute('width', (g.b * e).toFixed(1));
        car.classList.add('is-braking');
        x = g.r + g.b * e;
        if (t >= 1) {
          car.setAttribute('transform', `translate(${(ROAD_X0 + x).toFixed(1)} 66)`);
          anims[0] = null;
          svg.querySelector('.fs-lab').classList.add('is-on');
          timers.push(setTimeout(done, 700));
          return;
        }
      }
      car.setAttribute('transform', `translate(${(ROAD_X0 + x).toFixed(1)} 66)`);
      anims[0] = requestAnimationFrame(tick);
    };
    anims[0] = requestAnimationFrame(tick);
  }

  function scrollToScene() {
    const box = document.getElementById('fsJunction');
    if (!box || !box.scrollIntoView) return;
    try { box.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { box.scrollIntoView(true); }
  }

  // Смена сигнала по-немецки: зелёный → жёлтый → красный, у поперечных
  // красный → красный+жёлтый → зелёный (Rot-Gelb: «сейчас будет зелёный»)
  const LIGHT_STEP_MS = 900;
  function setLight(a, state) {
    const g = document.querySelector(`#fsScene .fs-light[data-light="${a}"]`);
    if (g) g.setAttribute('class', 'fs-light state-' + state);
  }

  function switchLights(lights, done) {
    const was = Object.keys(lights);
    const greens = was.filter(a => lights[a] === 'green');
    const reds = was.filter(a => lights[a] === 'red');
    const steps = [
      () => greens.forEach(a => setLight(a, 'yellow')),
      () => { greens.forEach(a => setLight(a, 'red')); reds.forEach(a => setLight(a, 'redyellow')); },
      () => reds.forEach(a => setLight(a, 'green'))
    ];
    if (reducedMotion()) { steps.forEach(f => f()); done(); return; }
    steps.forEach((f, k) => timers.push(setTimeout(f, k * LIGHT_STEP_MS)));
    timers.push(setTimeout(done, steps.length * LIGHT_STEP_MS));
  }

  function stopMotion() {
    anims.forEach(a => { if (a) cancelAnimationFrame(a); });
    anims = [];
    timers.forEach(t => clearTimeout(t));
    timers = [];
  }

  /* ── Перевод ── */

  function trOn() { return readStore(TR_KEY) === '1'; }

  function paintTr() {
    const on = trOn();
    el.unit.classList.toggle('show-tr', on);
    el.unit.querySelectorAll('[data-tr-toggle]').forEach(b => b.setAttribute('aria-pressed', on ? 'true' : 'false'));
  }

  /* ── Озвучка ── */

  function paintPlay() {
    el.unit.querySelectorAll('[data-play]').forEach(b => {
      const on = playing === b.dataset.play;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
      const ico = b.querySelector('.dlg-play-ico');
      if (ico) ico.textContent = on ? '■' : '▶';
      const lab = b.querySelector('.dlg-play-label');
      if (lab) {
        if (!b.dataset.label) b.dataset.label = lab.textContent;
        lab.textContent = on ? 'Стоп' : b.dataset.label;
      }
    });
    el.unit.querySelectorAll('[data-say]').forEach(b => b.classList.toggle('is-on', playing === 's:' + b.dataset.say));
  }

  function mark(n) {
    el.unit.querySelectorAll('.fs-line.is-speaking').forEach(li => li.classList.remove('is-speaking'));
    if (n == null || n < 0) return;
    const li = el.unit.querySelector(`.fs-line[data-line="${n}"]`);
    if (!li) return;
    li.classList.add('is-speaking');
    if (li.scrollIntoView) {
      try { li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { li.scrollIntoView(false); }
    }
  }

  function stopSpeech() {
    if (playing === null) return;
    playing = null;
    try { ReaderSpeak.stop(); } catch (e) {}
    try { ReaderTip.setSpeaking(null); } catch (e) {}
    mark(-1);
    paintPlay();
  }

  function stopAll() {
    stopSpeech();
    stopMotion();
    try { ReaderTip.close(); } catch (e) {}
  }

  // Очередь фраз: тексты или номера фраз на экране (тогда подсветка строки)
  function run(items, key, opts) {
    if (typeof ReaderSpeak === 'undefined' || !items.length) return;
    try { ReaderSpeak.stop(); } catch (e) {}
    playing = key;
    paintPlay();
    const o = opts || {};
    const started = ReaderSpeak.run(items, {
      kind: 'fahrschule', rate: RATE, gap: GAP_MS, preload: true,
      onItem: item => { if (item.n != null) mark(item.n); },
      onDone: () => {
        if (playing !== key) return;   // уже звучит другое
        playing = null;
        mark(-1);
        try { ReaderTip.setSpeaking(null); } catch (e) {}
        paintPlay();
        if (o.onDone) o.onDone();
      }
    });
    if (!started) { playing = null; paintPlay(); }
  }

  function speak(texts, key) {
    run(texts.map(text => ({ text })), key);
  }

  function speakList(ns, key) {
    run(ns.filter(n => sentences[n]).map(n => ({ text: sentences[n].de, n })), key);
  }

  function togglePlay(kind) {
    if (playing === kind) { stopSpeech(); return; }
    if (kind === 'all') speakList(lessonLines(), 'all');
    else if (kind === 'explain' && scene) speakList(explainLines(), 'explain');
  }

  function sayLine(n) {
    if (playing === 's:' + n) { stopSpeech(); return; }
    speakList([n], 's:' + n);
  }

  /* ── Подсказка над словом ── */

  let pointerKind = 'mouse';       // чем нажали последний раз
  let hoverTimer = null;
  let tipFor = null;               // слово, для которого открыт тултип

  const canHover = (() => {
    try { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) { return false; }
  })();

  function openTip(w) {
    if (!unit || typeof ReaderTip === 'undefined') return;
    const box = w.closest('[data-s]');
    const s = box ? sentences[Number(box.dataset.s)] : null;
    const opened = ReaderTip.open(w, {
      gloss: unit.gloss,
      sentenceRu: s ? s.tr : '',
      bs: box,
      onAct: (act, info) => {
        if (act === 'speak-word') { ReaderTip.setSpeaking('word'); speak([info.word], 'tip'); }
        else if (act === 'speak-sentence' && s) { ReaderTip.setSpeaking('sentence'); speak([s.de], 'tip'); }
      }
    });
    tipFor = opened ? w : null;
  }

  function tipOpenFor(w) { return tipFor === w && ReaderTip.isOpen(); }

  function cancelHoverClose() { clearTimeout(hoverTimer); hoverTimer = null; }

  function scheduleHoverClose() {
    cancelHoverClose();
    hoverTimer = setTimeout(() => {
      if (tipFor) { ReaderTip.close(); tipFor = null; }
    }, 260);
  }

  function bindHover(app) {
    if (!canHover) return;
    app.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      const w = e.target.closest && e.target.closest('.fs-w');
      if (!w) return;
      cancelHoverClose();
      if (!tipOpenFor(w)) openTip(w);
    });
    app.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse') return;
      const w = e.target.closest && e.target.closest('.fs-w');
      if (!w) return;
      const to = e.relatedTarget;
      if (to && to.closest && (to.closest('.word-tip') || to.closest('.fs-w') === w)) return;
      scheduleHoverClose();
    });
    // мышь ушла с подсказки — закрываем; вернулась — держим
    document.addEventListener('pointerover', e => {
      if (e.pointerType === 'mouse' && e.target.closest && e.target.closest('.word-tip')) cancelHoverClose();
    });
    document.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse' || !tipFor || !e.target.closest || !e.target.closest('.word-tip')) return;
      const to = e.relatedTarget;
      if (to && to.closest && (to.closest('.word-tip') || to.closest('.fs-w') === tipFor)) return;
      scheduleHoverClose();
    });
  }

  function onWord(w) {
    if (pointerKind === 'mouse' && canHover) {
      // мышью: подсказка уже открыта наведением, щелчок — озвучка слова
      if (!tipOpenFor(w)) openTip(w);
      speak([w.textContent], 'tip');
      return;
    }
    openTip(w);   // пальцем: тап открывает и закрывает подсказку
  }

  /* ── События ── */

  function onClick(e) {
    const t = e.target;
    if (t.closest('[data-retry]')) { e.preventDefault(); if (view.name === 'unit') openUnit(view.id); else load(); return; }
    const tile = t.closest('[data-unit]');
    if (tile) { e.preventDefault(); go({ name: 'unit', id: tile.dataset.unit }); return; }
    const w = t.closest('.fs-w');
    if (w) { e.preventDefault(); onWord(w); return; }
    const say = t.closest('[data-say]');
    if (say) { e.preventDefault(); sayLine(Number(say.dataset.say)); return; }
    const play = t.closest('[data-play]');
    if (play) { e.preventDefault(); togglePlay(play.dataset.play); return; }
    if (t.closest('[data-tr-toggle]')) {
      writeStore(TR_KEY, trOn() ? '0' : '1');
      el.unit.querySelectorAll('.tr-open').forEach(h => toggleLineTr(h, false));
      paintTr();
      return;
    }
    if (t.closest('[data-tr-line]')) { toggleLineTr(trHolder(t)); return; }
    const ro = t.closest('[data-road-opt]');
    if (ro) { pickRoad(Number(ro.dataset.roadOpt)); return; }
    const opt = t.closest('[data-opt]');
    if (opt) { answerQuiz(opt.dataset.opt); return; }
    if (t.closest('[data-quiz-next]')) { stopSpeech(); quiz.i++; quiz.answered = false; renderQuiz(); return; }
    if (t.closest('[data-quiz-restart]')) { stopSpeech(); startQuiz(); return; }
    const car = t.closest('.fs-car');
    if (car) { pickCar(car.dataset.car); return; }
    if (t.closest('[data-scene-reset]')) { scene.pick = []; paintScene(); return; }
    if (t.closest('[data-scene-again]')) { openScene(scene.i); return; }
    if (t.closest('[data-scene-next]')) { openScene(scene.i + 1); scrollToScene(); return; }
    // нажатие на строку (не на слово и не на кнопку) — тоже перевод фразы
    if (!t.closest('a, button') && (t.closest('.fs-line, .fs-situation') || t.closest('.fs-quiz-q'))) toggleLineTr(trHolder(t));
  }

  // Чей перевод открывает 🌐 или нажатие: строка, ситуация сцены или
  // карточка теста (там — вопрос и все варианты сразу)
  function trHolder(t) {
    return t.closest('.fs-quiz-card') || t.closest('.fs-line, .fs-situation');
  }

  function toggleLineTr(holder, force) {
    if (!holder) return;
    const on = holder.classList.toggle('tr-open', force);
    holder.querySelectorAll(':scope > [data-tr-line], :scope > .fs-btns > [data-tr-line], :scope > .fs-line-row > .fs-btns > [data-tr-line], :scope > .fs-quiz-top > [data-tr-line]')
      .forEach(b => b.setAttribute('aria-pressed', on ? 'true' : 'false'));
    if (quiz && holder.classList.contains('fs-quiz-card')) quiz.tr = on;
  }

  function onKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const car = e.target.closest && e.target.closest('.fs-car');
    if (car) { e.preventDefault(); pickCar(car.dataset.car); return; }
    const w = e.target.closest && e.target.closest('.fs-w');
    if (w) { e.preventDefault(); openTip(w); }
  }

  function load() {
    el.list.innerHTML = '<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем уроки</span></div>';
    return fetch(INDEX_URL, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(INDEX_URL + ': HTTP ' + r.status); return r.json(); })
      .then(data => {
        units = (data && Array.isArray(data.units) ? data.units : []).filter(u => u && u.id && KINDS[u.kind]);
        topics = (data && Array.isArray(data.topics) ? data.topics : []).filter(t => t && Array.isArray(t.units));
        // старое оглавление без тем — одна общая группа
        if (!topics.length && units.length) topics = [{ id: 'all', emoji: '🚗', title: 'Fahrschule', titleTr: '', units: units.map(u => u.id) }];
        loaded = true;
        show(view);
      })
      .catch(err => {
        console.error('[Fahrschule] оглавление не загрузилось:', err);
        const box = view.name === 'unit' ? el.body : el.list;
        el.list.setAttribute('aria-busy', 'false');
        box.innerHTML = `<div class="news-error"><b>Не удалось загрузить уроки.</b>
          <span>Проверьте соединение и попробуйте снова.</span>
          <button class="news-btn" type="button" data-retry>Повторить</button>
          <small>${esc(err && err.message ? err.message : String(err))}</small></div>`;
      });
  }

  function init() {
    const $ = id => document.getElementById(id);
    el = {
      hub: $('fsHub'), list: $('fsList'),
      unit: $('fsUnit'), heading: $('fsHeading'), body: $('fsBody')
    };
    if (!el.hub || !el.unit) return;
    el.baseTitle = document.title;
    const app = $('fsApp');
    app.addEventListener('click', onClick);
    app.addEventListener('keydown', onKey);
    app.addEventListener('pointerdown', e => { pointerKind = e.pointerType || 'mouse'; }, true);
    bindHover(app);
    $('fsToHub').addEventListener('click', up);

    window.addEventListener('popstate', () => show(viewFromHash()));
    window.addEventListener('pagehide', stopAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
    document.addEventListener('dm:tg-ready', syncTgBack);

    view = viewFromHash();
    setUrl(view, 'replace');
    show(view);
    load();
  }

  return {
    init, up, go, stop: stopAll,
    get view() { return view; }, get unit() { return unit; }, get playing() { return playing; },
    get scene() { return scene; }, get quiz() { return quiz; },
    get topics() { return topics; }, get cached() { return Object.keys(cache); },
    wordsHtml, wordKey, WORD_RE
  };
})();

document.addEventListener('DOMContentLoaded', () => Fahrschule.init());
