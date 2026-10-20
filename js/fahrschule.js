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
  const OPEN_KEY  = 'dm_fs_open';    // раскрытые темы: JSON-массив id
  const LAST_KEY  = 'dm_fs_last';    // последний открытый урок
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
  let sceneTr = false;      // перевод ситуации, вопроса и вариантов в сценах урока
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
          <div class="news-tile-text">Кольцо, переезд, экономичная езда и экзамен — следующие темы</div>
        </div>
      </div>
    </div>`;
  }

  // Тема — отдельная карточка: шапка полосой (номер, эмодзи, название),
  // под ней сетка её уроков. Так темы не сливаются в одну ленту плиток.
  // Тема сворачивается: шапка — кнопка. Справа — сколько уроков и
  // подсказка «Показать уроки» со стрелкой, чтобы было видно, что по тапу
  // откроется список. Раскрытые темы запоминаются (OPEN_KEY); пока выбора
  // не было — открыта тема последнего урока, а при первом заходе — первая.
  function openTopics() {
    try {
      const saved = JSON.parse(readStore(OPEN_KEY) || 'null');
      if (Array.isArray(saved)) return new Set(saved);
    } catch (e) { /* испорченное значение — как будто выбора не было */ }
    const last = readStore(LAST_KEY);
    const t = topics.find(x => x.units.includes(last)) || topics[0];
    return new Set(t ? [t.id] : []);
  }

  function saveOpenTopics(set) {
    writeStore(OPEN_KEY, JSON.stringify([...set]));
  }

  function topicHtml(t, n, byId, open) {
    const list = t.units.filter(id => byId[id]);
    return `<section class="fs-topic${open ? ' is-open' : ''}" data-topic="${esc(t.id)}">
      <button class="fs-topic-head" type="button" data-topic-toggle="${esc(t.id)}" aria-expanded="${open ? 'true' : 'false'}" aria-controls="fsTopicList-${esc(t.id)}">
        <span class="news-rubric-ico" aria-hidden="true">${esc(t.emoji)}</span>
        <span class="fs-topic-titles">
          <span class="fs-topic-n"><span>Тема</span> ${n}</span>
          <span class="fs-topic-title" lang="de" dir="ltr">${esc(t.title)}</span>
          <span class="fs-topic-tr">${esc(t.titleTr)}</span>
        </span>
        <span class="fs-topic-more">
          <span class="fs-topic-count">${countHtml(list.length, ['урок', 'урока', 'уроков'])}</span>
          <span class="fs-topic-hint"><span class="fs-topic-show">Показать уроки</span><span class="fs-topic-hide">Скрыть</span></span>
          <span class="fs-topic-chev" aria-hidden="true"></span>
        </span>
      </button>
      <div class="news-grid fs-topic-grid" id="fsTopicList-${esc(t.id)}"${open ? '' : ' hidden'}>${list.map(id => tileHtml(byId[id])).join('')}</div>
    </section>`;
  }

  function toggleTopic(id) {
    const sec = el.list.querySelector(`.fs-topic[data-topic="${id}"]`);
    if (!sec) return;
    const open = !sec.classList.contains('is-open');
    sec.classList.toggle('is-open', open);
    sec.querySelector('[data-topic-toggle]').setAttribute('aria-expanded', open ? 'true' : 'false');
    sec.querySelector('.fs-topic-grid').hidden = !open;
    const set = new Set([...el.list.querySelectorAll('.fs-topic.is-open')].map(x => x.dataset.topic));
    saveOpenTopics(set);
  }

  function renderHub() {
    el.list.setAttribute('aria-busy', 'false');
    const byId = Object.fromEntries(units.map(u => [u.id, u]));
    const open = openTopics();
    // тема урока, из которого вернулись, всегда раскрыта
    const last = readStore(LAST_KEY);
    const lastTopic = topics.find(x => x.units.includes(last));
    if (lastTopic && !open.has(lastTopic.id)) { open.add(lastTopic.id); saveOpenTopics(open); }
    el.list.innerHTML = topics.map((t, k) => topicHtml(t, k + 1, byId, open.has(t.id))).join('') + soonTileHtml();
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
    writeStore(LAST_KEY, id);
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
    sceneTr = trOn();
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
    // tr: null — как общий «Перевод», true/false — выбор 🌐 в тесте
    quiz = { i: 0, score: 0, answered: false, opts: [], base: sentences.length, tr: quiz ? quiz.tr : null };
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
      <div class="fs-quiz-card${trCls(quizTr())}">
        <div class="fs-quiz-top">
          <span><span>Вопрос</span> <span class="fs-quiz-n">${quiz.i + 1} / ${list.length}</span></span>
          <button class="news-chip fs-quiz-tr" type="button" data-tr-line aria-pressed="${quizTr() ? 'true' : 'false'}">🌐 <span>Перевод</span></button>
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
    const q = sentence({ de: unit.title, tr: unit.titleTr }, 'p', 'fs-quiz-q')
      + `<p class="fs-tr fs-quiz-q-tr" dir="auto">${esc(unit.titleTr)}</p>`;
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
    paintSceneTr(box);
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
    if (PLANS[sc.type]) return planSvg(sc, final);
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
    if (PLANS[sc.type]) return '';
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
    const q = sentence(sc.question, 'p', 'fs-quiz-q')
      + `<p class="fs-tr fs-quiz-q-tr" dir="auto">${esc(sc.question.tr)}</p>`;
    const answer = String(sc.answer);
    const phrases = sc.options.some(o => typeof o === 'object');
    const opts = roadOptions(sc).map(o => {
      let cls = 'fs-opt fs-road-opt' + (phrases ? ' is-phrase' : '');
      if (scene.done && o.key === answer) cls += ' is-right';
      else if (scene.done && o.key === scene.pick) cls += ' is-wrong';
      return `<button class="${cls}" type="button" data-road-opt="${esc(o.key)}"${scene.done ? ' disabled' : ''}>
        <span class="fs-opt-de" lang="de" dir="ltr">${esc(o.label)}</span>${o.tr ? `<span class="fs-opt-tr">${esc(o.tr)}</span>` : ''}</button>`;
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
      <div class="fs-opts fs-road-opts${phrases ? ' is-phrases' : ''}${scene.done ? ' is-answered' : ''}">${opts}</div>
      <p class="fs-status${scene.done ? (scene.right ? ' is-right' : ' is-wrong') : ''}" id="fsStatus" aria-live="polite">${status}</p>
      <div class="fs-scene-actions" id="fsActions">${actions}</div>
      ${scene.shown ? `<ol class="fs-lines fs-explain">${explain}</ol>` : ''}`;
    paintSceneTr(box);
    paintTr();
    paintPlay();
  }

  function pickRoad(key) {
    if (!scene || scene.done) return;
    const sc = unit.scenes[scene.i];
    scene.pick = key;
    scene.right = key === String(sc.answer);
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
    if (PLANS[sc.type]) { animatePlan(sc, svg, done); return; }
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

  /* ── Сцены с несколькими участниками: обгон, велосипедист, «молния»,
     парковка ──
     План сцены — участники с ключевыми кадрами {t: 0…1, x, y, r, b}: x — нос
     машины, y — центр полосы, r — поворот кузова вокруг носа (градусы),
     b — поворотник ('l' / 'r') на отрезке от этого кадра. Между кадрами —
     линейно. Один план и рисует сцену (кадр 0, а после ответа — «снимок»
     snap), и анимирует её. Неподвижные машины — один кадр. */

  const LANE_UP = 53;       // встречная / левая полоса
  const LANE_DOWN = 79;     // наша / правая полоса
  const TREAD_Y = 40;       // протектор: верх резины и масштаб (px на мм)
  const TREAD_S = 12;
  const LAMP = { oil: '● Öldruck', brake: '● Bremsanlage', battery: '● Batterie', engine: '● Motor', tyre: '● Reifendruck' };
  const FOG_X = 80;         // нос машины в тумане в конце сцены
  const FOG_S = 1.6;        // туман: px на метр (столбики через 50 м = 80 px)

  function roadOptions(sc) {
    return sc.options.map(o => typeof o === 'object'
      ? { key: String(o.key), label: o.de, tr: o.tr }
      : { key: String(o), label: String(o).replace('.', ',') + ' m', tr: '' });
  }

  const PLANS = {
    overtake(sc) {
      const yes = sc.answer === 'yes';
      const truck = { id: 'truck', kind: 'truck', keys: [{ t: 0, x: 205, y: LANE_DOWN }, { t: 1, x: 235, y: LANE_DOWN }] };
      const me = { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: yes
        ? [{ t: 0, x: 110, y: LANE_DOWN }, { t: 0.12, x: 125, y: LANE_DOWN, b: 'l' }, { t: 0.3, x: 165, y: LANE_UP, b: 'l' },
           { t: 0.58, x: 255, y: LANE_UP }, { t: 0.66, x: 262, y: LANE_UP, b: 'r' }, { t: 0.82, x: 300, y: LANE_DOWN, b: 'r' },
           { t: 1, x: 318, y: LANE_DOWN }]
        : [{ t: 0, x: 110, y: LANE_DOWN }, { t: 1, x: 138, y: LANE_DOWN }] };
      const actors = [truck, me];
      if (sc.oncoming) {
        actors.push({ id: 'oncoming', kind: 'car', dir: -1, fill: CAR.red.fill,
          keys: [{ t: 0, x: 340, y: LANE_UP }, { t: 1, x: -40, y: LANE_UP }] });
      }
      return { actors, dur: 3600, snap: 1, line: sc.line };
    },
    side() {
      return {
        actors: [
          { id: 'bike', kind: 'bike', keys: [{ t: 0, x: 170, y: 87 }, { t: 1, x: 200, y: 87 }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 40, y: LANE_DOWN }, { t: 0.25, x: 110, y: LANE_DOWN, b: 'l' },
            { t: 0.42, x: 160, y: 50 }, { t: 0.6, x: 205, y: 50 }, { t: 0.78, x: 265, y: 50, b: 'r' }, { t: 0.9, x: 300, y: LANE_DOWN },
            { t: 1, x: 318, y: LANE_DOWN }] }
        ],
        dur: 3200, snap: 0.6, line: 'dashed', gapLabel: true
      };
    },
    // Можно ли здесь парковаться: машина заезжает в карман у тротуара,
    // после ответа видны запретная зона (красным) и расстояние в метрах.
    // Масштаб 8 px = 1 м. У перекрёстка и остановки машина стоит после
    // объекта, у «зебры» — перед ней (запрет — до 5 м перед переходом).
    parkspot(sc) {
      const S = 8;
      const before = sc.near === 'zebra';
      const edge = sc.near === 'zebra' ? 230 : sc.near === 'bus' ? 70 : 80;
      const front = before ? edge - sc.dist * S : edge + sc.dist * S + 28;
      return {
        actors: [{ id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [
          { t: 0, x: 12, y: LANE_UP + 10 }, { t: 0.5, x: front - 16, y: LANE_UP + 10, b: 'r' },
          { t: 0.85, x: front, y: 84, b: 'r' }, { t: 1, x: front, y: 84 }] }],
        dur: 2800, snap: 1, line: 'dashed', park: { S, edge, front, before }
      };
    },
    // Параллельная парковка задним ходом: встать рядом с передней машиной,
    // поворотник вправо, назад с поворотом кузова, затем выровняться
    parallel() {
      return {
        actors: [
          { id: 'a', kind: 'car', fill: CAR.green.fill, keys: [{ t: 0, x: 150, y: 84 }] },
          { id: 'b', kind: 'car', fill: CAR.red.fill, keys: [{ t: 0, x: 250, y: 84 }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [
            { t: 0, x: 40, y: 62 }, { t: 0.32, x: 258, y: 62, b: 'r' }, { t: 0.4, x: 258, y: 62, b: 'r' },
            { t: 0.62, x: 236, y: 70, r: -30, b: 'r' }, { t: 0.84, x: 214, y: 82, r: -6 }, { t: 1, x: 212, y: 84 }] }
        ],
        dur: 4200, snap: 1, line: 'dashed', curb: true
      };
    },
    // Поворот направо: велосипедист едет прямо по велодорожке или пешеход
    // переходит улицу, в которую поворачиваем, — ждём, потом поворачиваем
    rightturn(sc) {
      const wait = sc.answer === 'wait';
      const me = { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: wait
        ? [{ t: 0, x: 40, y: 74 }, { t: 0.32, x: 190, y: 74, b: 'r' }, { t: 0.58, x: 193, y: 74, b: 'r' },
           { t: 0.76, x: 214, y: 92, r: 55, b: 'r' }, { t: 0.9, x: 221, y: 114, r: 90 }, { t: 1, x: 221, y: 138, r: 90 }]
        : [{ t: 0, x: 40, y: 74 }, { t: 0.4, x: 192, y: 74, b: 'r' }, { t: 0.62, x: 214, y: 92, r: 55, b: 'r' },
           { t: 0.8, x: 221, y: 114, r: 90 }, { t: 1, x: 221, y: 138, r: 90 }] };
      const actors = [me];
      if (sc.who === 'bike') actors.push({ id: 'bike', kind: 'bike', keys: [{ t: 0, x: 40, y: 89 }, { t: 0.5, x: 255, y: 89 }, { t: 1, x: 340, y: 89 }] });
      if (sc.who === 'pedestrian') actors.push({ id: 'ped', kind: 'ped', keys: [{ t: 0, x: 186, y: 100 }, { t: 0.2, x: 186, y: 100 }, { t: 0.6, x: 252, y: 100 }, { t: 1, x: 280, y: 100 }] });
      return { actors, dur: 4200, snap: 0.45, line: 'dashed', curb: true, bikeLane: true, sideStreet: true };
    },
    // «Зебра»: пешеход ждёт у края — машина останавливается и пропускает
    zebracross(sc) {
      const stop = sc.answer === 'stop';
      const actors = [{ id: 'me', kind: 'car', fill: CAR.blue.fill, keys: stop
        ? [{ t: 0, x: 40, y: LANE_DOWN }, { t: 0.3, x: 192, y: LANE_DOWN }, { t: 0.82, x: 192, y: LANE_DOWN }, { t: 1, x: 330, y: LANE_DOWN }]
        : [{ t: 0, x: 40, y: LANE_DOWN }, { t: 1, x: 330, y: LANE_DOWN }] }];
      if (sc.ped === 'waiting') actors.push({ id: 'ped', kind: 'ped', keys: [{ t: 0, x: 213, y: 101 }, { t: 0.34, x: 213, y: 101 }, { t: 0.8, x: 213, y: 28 }, { t: 1, x: 213, y: 28 }] });
      return { actors, dur: 4000, snap: 0.55, line: 'dashed', curb: true, zebraX: 200 };
    },
    // Автобус с аварийкой у остановки: стоит — объезжаем шагом; подъезжает —
    // не обгоняем, едем следом
    bus(sc) {
      const stopped = sc.state === 'stopped';
      return stopped ? {
        actors: [
          { id: 'bus', kind: 'bus', keys: [{ t: 0, x: 232, y: LANE_DOWN, b: 'both' }, { t: 1, x: 232, y: LANE_DOWN, b: 'both' }] },
          { id: 'kid', kind: 'ped', keys: [{ t: 0, x: 244, y: 101 }, { t: 1, x: 262, y: 101 }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 30, y: LANE_DOWN }, { t: 0.22, x: 128, y: LANE_DOWN, b: 'l' },
            { t: 0.36, x: 150, y: LANE_UP, b: 'l' }, { t: 0.82, x: 262, y: LANE_UP }, { t: 0.92, x: 292, y: 66, b: 'r' }, { t: 1, x: 318, y: LANE_DOWN }] }
        ], dur: 5200, snap: 0.6, line: 'dashed', curb: true, stopSign: 238
      } : {
        actors: [
          { id: 'bus', kind: 'bus', keys: [{ t: 0, x: 170, y: LANE_DOWN, b: 'both' }, { t: 1, x: 240, y: LANE_DOWN, b: 'both' }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 60, y: LANE_DOWN }, { t: 1, x: 132, y: LANE_DOWN }] }
        ], dur: 3600, snap: 1, line: 'dashed', curb: true, stopSign: 246
      };
    },
    // Ночь, загородная дорога, дальний свет: встречная машина или машина
    // близко впереди — переключаемся на ближний; никого — дальний остаётся
    highbeam(sc) {
      const dim = sc.answer === 'dim';
      const me = { id: 'me', kind: 'car', fill: CAR.blue.fill, lights: true, keys: dim
        ? [{ t: 0, x: 30, y: LANE_DOWN, l: 'high' }, { t: 0.3, x: 90, y: LANE_DOWN, l: 'low' }, { t: 1, x: 190, y: LANE_DOWN, l: 'low' }]
        : [{ t: 0, x: 30, y: LANE_DOWN, l: 'high' }, { t: 1, x: 230, y: LANE_DOWN, l: 'high' }] };
      const actors = [me];
      if (sc.who === 'oncoming') {
        actors.push({ id: 'oncoming', kind: 'car', dir: -1, fill: CAR.red.fill, lights: true,
          keys: [{ t: 0, x: 360, y: LANE_UP, l: 'low' }, { t: 1, x: -20, y: LANE_UP, l: 'low' }] });
      }
      if (sc.who === 'ahead') {
        actors.unshift({ id: 'ahead', kind: 'car', fill: CAR.yellow.fill, lights: true,
          keys: [{ t: 0, x: 150, y: LANE_DOWN, l: 'low' }, { t: 1, x: 260, y: LANE_DOWN, l: 'low' }] });
      }
      return { actors, dur: 3800, snap: 0.6, line: 'dashed', night: true };
    },
    // Туман: столбики через 50 м, дальше видимости — белая пелена. Меньше
    // 50 м — включаем задний противотуманный фонарь и едем не быстрее 50
    fog(sc) {
      const on = sc.answer === 'on';
      return {
        actors: [{ id: 'me', kind: 'car', fill: CAR.blue.fill, lights: true, keys: [
          { t: 0, x: 24, y: LANE_DOWN, l: 'low' }, { t: 0.35, x: 56, y: LANE_DOWN, l: 'low', f: on },
          { t: 1, x: FOG_X, y: LANE_DOWN, l: 'low', f: on }] }],
        dur: 3000, snap: 1, line: 'dashed', fog: { S: FOG_S }
      };
    },
    // Косуля ночью: ближний свет, сигнал, торможение — по прямой, без
    // манёвра; животное уходит с дороги
    wild() {
      return {
        actors: [
          { id: 'deer', kind: 'deer', keys: [{ t: 0, x: 236, y: 72 }, { t: 0.55, x: 236, y: 72 }, { t: 1, x: 246, y: 24 }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, lights: true, keys: [
            { t: 0, x: 30, y: LANE_DOWN, l: 'high' }, { t: 0.2, x: 80, y: LANE_DOWN, l: 'low', h: true },
            { t: 0.4, x: 120, y: LANE_DOWN, l: 'low', br: true, h: true }, { t: 0.62, x: 158, y: LANE_DOWN, l: 'low', br: true },
            { t: 1, x: 160, y: LANE_DOWN, l: 'low', br: true }] }
        ],
        dur: 4200, snap: 1, line: 'dashed', night: true
      };
    },
    // Сесть за руль после алкоголя? Нельзя — человек уезжает на такси,
    // наша машина остаётся у тротуара; можно — садится и уезжает
    promille(sc) {
      const stay = sc.answer === 'stay';
      const actors = stay ? [
        { id: 'ped', kind: 'ped', keys: [{ t: 0, x: 96, y: 100 }, { t: 0.42, x: 136, y: 100 }, { t: 0.5, x: 136, y: 86 }, { t: 0.54, x: 136, y: 86, g: true }] },
        { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 236, y: 84 }] },
        { id: 'taxi', kind: 'car', fill: CAR.yellow.fill, taxi: true, keys: [{ t: 0, x: -30, y: LANE_DOWN }, { t: 0.36, x: 150, y: 84 },
          { t: 0.56, x: 150, y: 84, b: 'l' }, { t: 0.7, x: 196, y: LANE_DOWN - 8 }, { t: 1, x: 360, y: LANE_DOWN - 8 }] }
      ] : [
        { id: 'ped', kind: 'ped', keys: [{ t: 0, x: 120, y: 100 }, { t: 0.32, x: 196, y: 100 }, { t: 0.4, x: 196, y: 86 }, { t: 0.44, x: 196, y: 86, g: true }] },
        { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 220, y: 84 }, { t: 0.46, x: 220, y: 84, b: 'l' },
          { t: 0.66, x: 262, y: LANE_DOWN - 8 }, { t: 1, x: 360, y: LANE_DOWN - 8 }] }
      ];
      return { actors, dur: 4200, snap: 1, line: 'dashed', curb: true, badge: `${sc.p.toFixed(1).replace('.', ',')} ‰${sc.novice ? ' · Probezeit' : ''}` };
    },
    // Устали или едете больше двух часов — съезд на стоянку и сон 15–20 минут
    tired(sc) {
      const rest = sc.answer === 'rest';
      return {
        actors: [{ id: 'me', kind: 'car', fill: CAR.blue.fill, keys: rest
          ? [{ t: 0, x: 30, y: LANE_DOWN }, { t: 0.36, x: 150, y: LANE_DOWN, b: 'r' }, { t: 0.58, x: 206, y: 104, r: 28, b: 'r' },
             { t: 0.76, x: 246, y: 112 }, { t: 1, x: 252, y: 112 }]
          : [{ t: 0, x: 30, y: LANE_DOWN }, { t: 1, x: 350, y: LANE_DOWN }] }],
        dur: 3800, snap: 1, line: 'dashed', restArea: true, badge: `${String(sc.hours).replace('.', ',')} h`, zzz: rest
      };
    },
    // Контрольная лампа: красная — поворотник, к тротуару, стоп с аварийкой;
    // жёлтая — едем дальше (в мастерскую — скоро)
    lamp(sc) {
      const stop = sc.answer === 'stop';
      return {
        actors: [{ id: 'me', kind: 'car', fill: CAR.blue.fill, keys: stop
          ? [{ t: 0, x: 30, y: LANE_DOWN }, { t: 0.3, x: 140, y: LANE_DOWN, b: 'r' }, { t: 0.62, x: 236, y: 84, b: 'r' },
             { t: 0.7, x: 240, y: 84, b: 'both', br: true }, { t: 1, x: 240, y: 84, b: 'both', br: true }]
          : [{ t: 0, x: 30, y: LANE_DOWN }, { t: 1, x: 350, y: LANE_DOWN }], lights: true }],
        dur: 3600, snap: 1, line: 'dashed', curb: true, badge: LAMP[sc.lamp], badgeCls: 'is-' + sc.color
      };
    },
    // Замер протектора: щуп опускается в канавку; красная линия — 1,6 мм
    tread(sc) {
      return {
        actors: [{ id: 'gauge', kind: 'gauge', keys: [{ t: 0, x: 160, y: 8 }, { t: 0.15, x: 160, y: 8 },
          { t: 1, x: 160, y: TREAD_Y + sc.depth * TREAD_S }] }],
        dur: 2400, snap: 1, tyre: true
      };
    },
    // Знак аварийной остановки: человек в жилете несёт знак назад от машины
    // с аварийкой; масштаб такой, что расстояние всегда ≈ 200 px
    triangle(sc) {
      const x0 = 250, x1 = 52;
      return {
        actors: [
          { id: 'crash', kind: 'car', fill: CAR.red.fill, keys: [{ t: 0, x: 300, y: LANE_DOWN, b: 'both' }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 268, y: LANE_DOWN, b: 'both' }] },
          { id: 'tri', kind: 'triangle', keys: [{ t: 0, x: x0 - 6, y: 104 }, { t: 0.72, x: x1 - 6, y: 104 }, { t: 0.82, x: x1 - 6, y: 88 }, { t: 1, x: x1 - 6, y: 88 }] },
          { id: 'ped', kind: 'ped', keys: [{ t: 0, x: x0, y: 104 }, { t: 0.72, x: x1, y: 104 }, { t: 0.82, x: x1, y: 100 }, { t: 1, x: x1 + 20, y: 104 }] }
        ],
        dur: 4200, snap: 1, line: 'dashed', measure: { x1, x2: 240, y: 116, label: sc.answer + ' m' }
      };
    },
    // Rettungsgasse: машины в пробке разъезжаются — левый ряд влево,
    // остальные вправо, — и по коридору проезжает скорая
    rescuelane(sc) {
      const n = sc.lanes;
      const ys = n === 3 ? [41, 67, 93] : [LANE_UP, LANE_DOWN];
      const fills = [CAR.green.fill, CAR.yellow.fill, CAR.red.fill, '#8e98a4'];
      const actors = [];
      ys.forEach((y, lane) => [76, 158, 240].forEach((x, i) => {
        const me = lane === sc.lane && i === 1;
        const dy = lane === 0 ? -9 : 9;
        actors.push({ id: me ? 'me' : `c${lane}${i}`, kind: 'car', fill: me ? CAR.blue.fill : fills[(lane + i) % 4],
          keys: [{ t: 0, x: x + lane * 8, y }, { t: 0.32, x: x + lane * 8 + 4, y: y + dy, b: me ? (dy < 0 ? 'l' : 'r') : undefined }, { t: 1, x: x + lane * 8 + 4, y: y + dy }] });
      }));
      const gap = (ys[0] + ys[1]) / 2;
      actors.push({ id: 'amb', kind: 'ambulance', keys: [{ t: 0, x: -40, y: gap }, { t: 0.38, x: -40, y: gap }, { t: 1, x: 370, y: gap }] });
      return { actors, dur: 4600, snap: 1, line: 'dashed', lanes3: n === 3 };
    },
    // Въезд на автобан: у развилки знак 330.1. Скутер (до 60 км/ч) едет
    // дальше по загородной дороге, машина сворачивает на въезд
    access(sc) {
      const yes = sc.answer === 'yes';
      const me = { id: 'me', kind: sc.vehicle === 'moped' ? 'moped' : 'car', fill: CAR.blue.fill, keys: yes
        ? [{ t: 0, x: 30, y: LANE_DOWN }, { t: 0.45, x: 160, y: LANE_DOWN, b: 'r' }, { t: 0.62, x: 204, y: 96, r: 28, b: 'r' },
           { t: 0.82, x: 244, y: 117, r: 28 }, { t: 1, x: 290, y: 142, r: 28 }]
        : [{ t: 0, x: 30, y: LANE_DOWN }, { t: 1, x: 350, y: LANE_DOWN }] };
      return { actors: [me], dur: 3600, snap: yes ? 0.72 : 0.62, line: 'dashed', ramps: [150],
        signAt: { x: 236, y: 98, w: 22, h: 22 }, badge: `max. ${sc.vmax} km/h` };
    },
    // С полосы разгона: промежуток свободен — разгон и встраивание; рядом
    // едет грузовик — чуть сбросить скорость и встать за ним
    merge(sc) {
      const behind = sc.answer === 'behind';
      const actors = behind ? [
        { id: 'truck', kind: 'truck', keys: [{ t: 0, x: 130, y: LANE_DOWN }, { t: 1, x: 410, y: LANE_DOWN }] },
        { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 100, y: 101 }, { t: 0.3, x: 146, y: 101, b: 'l', br: true },
          { t: 0.5, x: 178, y: 101, b: 'l' }, { t: 0.76, x: 226, y: LANE_DOWN, b: 'l' }, { t: 1, x: 300, y: LANE_DOWN }] }
      ] : [
        { id: 'left', kind: 'car', fill: CAR.red.fill, keys: [{ t: 0, x: 70, y: LANE_UP }, { t: 1, x: 390, y: LANE_UP }] },
        { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 40, y: 101 }, { t: 0.32, x: 136, y: 101, b: 'l' },
          { t: 0.58, x: 214, y: LANE_DOWN, b: 'l' }, { t: 0.66, x: 236, y: LANE_DOWN }, { t: 1, x: 330, y: LANE_DOWN }] }
      ];
      return { actors, dur: 4000, snap: behind ? 0.62 : 0.6, line: 'dashed', accel: true };
    },
    // Съезд остался позади (слева, со знаком 333): едем до следующего
    // и сворачиваем на него
    missed() {
      return {
        actors: [{ id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 70, y: LANE_DOWN }, { t: 0.42, x: 210, y: LANE_DOWN, b: 'r' },
          { t: 0.62, x: 262, y: 100, r: 28, b: 'r' }, { t: 0.82, x: 298, y: 120, r: 28 }, { t: 1, x: 334, y: 140, r: 28 }] }],
        dur: 3600, snap: 0.56, line: 'dashed', ramps: [-40, 200], signAt: { x: 38, y: 112, w: 52, h: 12 }, badge: 'Ausfahrt: 8 km'
      };
    },
    zipper() {
      return {
        actors: [
          { id: 'l1', kind: 'car', fill: CAR.yellow.fill, keys: [{ t: 0, x: 150, y: LANE_UP }, { t: 0.5, x: 340, y: LANE_UP }, { t: 1, x: 340, y: LANE_UP }] },
          { id: 'me', kind: 'car', fill: CAR.blue.fill, keys: [{ t: 0, x: 170, y: LANE_DOWN }, { t: 0.22, x: 212, y: LANE_DOWN, b: 'l' },
            { t: 0.36, x: 240, y: LANE_UP, b: 'l' }, { t: 0.7, x: 340, y: LANE_UP }, { t: 1, x: 340, y: LANE_UP }] },
          { id: 'l2', kind: 'car', fill: CAR.green.fill, keys: [{ t: 0, x: 95, y: LANE_UP }, { t: 0.36, x: 185, y: LANE_UP }, { t: 0.85, x: 340, y: LANE_UP }, { t: 1, x: 340, y: LANE_UP }] },
          { id: 'r2', kind: 'car', fill: CAR.red.fill, keys: [{ t: 0, x: 115, y: LANE_DOWN }, { t: 0.5, x: 212, y: LANE_DOWN, b: 'l' },
            { t: 0.64, x: 240, y: LANE_UP, b: 'l' }, { t: 1, x: 340, y: LANE_UP }] }
        ],
        dur: 4200, snap: 0.3, line: 'dashed', laneEnds: true
      };
    }
  };

  function keyAt(keys, t) {
    if (t <= keys[0].t) return keys[0];
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i];
      if (t <= b.t) {
        const k = (t - a.t) / ((b.t - a.t) || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, r: (a.r || 0) + ((b.r || 0) - (a.r || 0)) * k,
          b: a.b, l: a.l, f: a.f, br: a.br, h: a.h, g: a.g };
      }
    }
    return keys[keys.length - 1];
  }

  function actorTransform(a, k) {
    return `translate(${k.x.toFixed(1)} ${k.y.toFixed(1)})${k.r ? ` rotate(${k.r.toFixed(1)})` : ''}${a.dir === -1 ? ' scale(-1 1)' : ''}`;
  }

  function blinkCls(b) {
    if (b === 'both') return ' is-blink-l is-blink-r';
    return b ? ' is-blink-' + b : '';
  }

  // Свет и звук машины в кадре: l — фары ('low' ближний / 'high' дальний),
  // f — задний противотуманный фонарь, br — тормоз, h — звуковой сигнал
  const STATES = { 'is-low': k => k.l === 'low', 'is-high': k => k.l === 'high', 'is-fog': k => !!k.f,
    'is-braking': k => !!k.br, 'is-horn': k => !!k.h, 'is-gone': k => !!k.g };

  function stateCls(k) {
    return Object.keys(STATES).filter(c => STATES[c](k)).map(c => ' ' + c).join('');
  }

  function actorHtml(a, k) {
    const cls = `fs-actor${blinkCls(k.b)}${stateCls(k)}`;
    const tr = actorTransform(a, k);
    if (a.kind === 'truck') {
      return `<g class="${cls} fs-truck" data-actor="${a.id}" transform="${tr}">
        <rect x="-58" y="-11" width="46" height="22" rx="3" class="fs-truck-box"/>
        <rect x="-12" y="-9" width="12" height="18" rx="3" fill="${CAR.yellow.fill}" class="fs-car-shell"/></g>`;
    }
    if (a.kind === 'bus') {
      return `<g class="${cls} fs-bus" data-actor="${a.id}" transform="${tr}">
        <rect x="-72" y="-11" width="72" height="22" rx="4" class="fs-bus-box"/>
        ${[-64, -50, -36, -22].map(x => `<rect class="fs-glass" x="${x}" y="-8" width="10" height="16" rx="2"/>`).join('')}
        <circle class="fs-blink fs-blink-l" cx="-2" cy="-10" r="2.6"/><circle class="fs-blink fs-blink-l" cx="-70" cy="-10" r="2.6"/>
        <circle class="fs-blink fs-blink-r" cx="-2" cy="10" r="2.6"/><circle class="fs-blink fs-blink-r" cx="-70" cy="10" r="2.6"/></g>`;
    }
    if (a.kind === 'ped') {
      return `<g class="${cls} fs-ped" data-actor="${a.id}" transform="${tr}">
        <circle cx="0" cy="-7" r="3.2" class="fs-ped-head"/>
        <path d="M0 -4 V4 M-3.5 0 H3.5 M0 4 L-3 10 M0 4 L3 10" class="fs-ped-body"/></g>`;
    }
    if (a.kind === 'gauge') {
      return `<g class="${cls} fs-gauge" data-actor="${a.id}" transform="${tr}">
        <rect x="-14" y="-34" width="28" height="12" rx="3" class="fs-gauge-head"/><rect x="-2" y="-22" width="4" height="22" class="fs-gauge-pin"/></g>`;
    }
    if (a.kind === 'triangle') {
      return `<g class="${cls}" data-actor="${a.id}" transform="${tr}"><path class="fs-tri" d="M0 -9 L8 5 H-8 Z"/></g>`;
    }
    if (a.kind === 'ambulance') {
      return `<g class="${cls} fs-amb" data-actor="${a.id}" transform="${tr}">
        <rect x="-34" y="-10" width="34" height="20" rx="4" class="fs-amb-box"/>
        <rect x="-22" y="-2" width="10" height="4" class="fs-amb-cross"/><rect x="-19" y="-5" width="4" height="10" class="fs-amb-cross"/>
        <circle cx="-6" cy="-6" r="2.6" class="fs-amb-blue"/><circle cx="-6" cy="6" r="2.6" class="fs-amb-blue is-b"/></g>`;
    }
    if (a.kind === 'deer') {
      return `<g class="${cls} fs-deer" data-actor="${a.id}" transform="${tr}"><text x="-11" y="7" class="fs-deer-ico">🦌</text></g>`;
    }
    if (a.kind === 'moped') {
      return `<g class="${cls} fs-moped" data-actor="${a.id}" transform="${tr}">
        <circle cx="-17" cy="5" r="4.2" class="fs-wheel"/><circle cx="-3" cy="5" r="4.2" class="fs-wheel"/>
        <path d="M-19 2 H-8 L-4 -5" class="fs-moped-body"/><circle cx="-12" cy="-6" r="3" class="fs-rider"/></g>`;
    }
    if (a.kind === 'bike') {
      return `<g class="${cls} fs-bike" data-actor="${a.id}" transform="${tr}">
        <circle cx="-15" cy="0" r="4.5" class="fs-wheel"/><circle cx="-2" cy="0" r="4.5" class="fs-wheel"/>
        <path d="M-15 0 L-9 -6 L-2 0 M-9 -6 L-6 -9" class="fs-frame"/><circle cx="-8" cy="-11" r="2.6" class="fs-rider"/></g>`;
    }
    // фары: конус перед носом (ближний короче), сзади тормоз и «противотуманка»
    const lights = a.lights ? `<path class="fs-beam fs-beam-low" d="M0 -6 L64 -15 L64 15 L0 6 Z"/>
      <path class="fs-beam fs-beam-high" d="M0 -6 L170 -30 L170 30 L0 6 Z"/>
      <path class="fs-horn" d="M5 -7 Q11 0 5 7 M10 -11 Q19 0 10 11"/>` : '';
    const rear = a.lights ? `<rect class="fs-brake" x="-29.5" y="-8" width="2.5" height="4" rx="1"/>
      <rect class="fs-brake" x="-29.5" y="4" width="2.5" height="4" rx="1"/>
      <rect class="fs-rearfog" x="-30" y="-1.5" width="2.5" height="3" rx="1"/>` : '';
    return `<g class="${cls}" data-actor="${a.id}" transform="${tr}">${lights}
      <rect x="-28" y="-9" width="28" height="18" rx="5" fill="${a.fill}" class="fs-car-shell"/>${rear}
      ${a.taxi ? '<rect class="fs-taxi" x="-19" y="-3.5" width="7" height="7" rx="1.5"/>' : ''}
      <rect class="fs-glass" x="-10" y="-7" width="6" height="14" rx="2"/>
      <rect class="fs-glass" x="-25" y="-6" width="4" height="12" rx="1.5"/>
      <circle class="fs-blink fs-blink-l" cx="-2" cy="-8.5" r="2.4"/><circle class="fs-blink fs-blink-l" cx="-26" cy="-8.5" r="2.4"/>
      <circle class="fs-blink fs-blink-r" cx="-2" cy="8.5" r="2.4"/><circle class="fs-blink fs-blink-r" cx="-26" cy="8.5" r="2.4"/></g>`;
  }

  function planSvg(sc, final) {
    const plan = PLANS[sc.type](sc);
    const t = final ? plan.snap : 0;
    const solid = plan.line === 'solid';
    const ends = plan.laneEnds
      ? `<rect class="fs-grass" x="236" y="66" width="${ROAD_W - 236}" height="26"/>
         <g class="fs-barrier"><rect x="222" y="67" width="14" height="24" class="fs-barrier-box"/>
         <path d="M222 73 L236 67 M222 81 L236 73 M222 89 L236 81 M226 91 L236 87" class="fs-barrier-stripe"/></g>`
      : '';
    // знак сцены — в углу; у остановки он уже стоит у тротуара (stopSign)
    // (у развилки автобана — рядом со съездом: signAt)
    const at = plan.signAt || { x: 286, y: 8, w: 26, h: 26 };
    const sign = sc.sign && unit.signs[sc.sign] && !plan.stopSign
      ? `<image href="${esc(unit.signs[sc.sign].src)}" x="${at.x}" y="${at.y}" width="${at.w}" height="${at.h}"/>` : '';
    const curb = (plan.park || plan.curb ? `<rect class="fs-sidewalk" x="0" y="92" width="${ROAD_W}" height="12"/>` : '')
      + (plan.bikeLane ? `<rect class="fs-bikelane" x="0" y="84" width="${ROAD_W}" height="9"/>` : '')
      + (plan.sideStreet ? `<rect class="fs-road" x="200" y="84" width="42" height="46"/>` : '')
      + (plan.zebraX ? [43, 51, 59, 67, 75, 83].map(y => `<rect class="fs-zebra" x="${plan.zebraX}" y="${y}" width="26" height="4.5"/>`).join('') : '')
      + (plan.stopSign && unit.signs.z224 ? `<image href="${esc(unit.signs.z224.src)}" x="${plan.stopSign}" y="104" width="16" height="16"/>` : '');
    const park = plan.park ? parkHtml(sc, plan.park, final) : '';
    const night = plan.night ? `<rect class="fs-night" x="0" y="0" width="${ROAD_W}" height="130"/>` : '';
    // стоянка у дороги (Parkplatz) — ниже проезжей части
    const rest = plan.restArea ? `<path class="fs-road" d="M140 92 L180 98 H310 V128 H180 Z"/>
      ${[200, 230, 260, 290].map(x => `<path class="fs-mark is-solid" d="M${x} 100 V126"/>`).join('')}` : '';
    // табличка над сценой: промилле, часы за рулём
    const badge = plan.badge ? `<g class="fs-badge-s ${plan.badgeCls || ''}"><rect x="8" y="8" width="${(plan.badge.length * 6.6 + 16).toFixed(0)}" height="20" rx="10"/>
      <text x="16" y="22">${esc(plan.badge)}</text></g>` : '';
    const zzz = plan.zzz ? `<text class="fs-lab${final ? ' is-on' : ''} fs-zzz" x="262" y="104">😴</text>` : '';
    const gap = plan.gapLabel ? `<g class="fs-lab${final ? ' is-on' : ''}">
        <path class="fs-bracket" d="M182 60 H192 M187 60 V75 M182 75 H192"/><path class="fs-leader" d="M192 68 H232 V104"/>
        <text class="fs-lab-text" x="232" y="117">${String(sc.answer).replace('.', ',')} m</text></g>` : '';
    // съезд / въезд вправо-вниз от проезжей части и полоса разгона
    const ramps = (plan.ramps || []).map(x => `<path class="fs-road" d="M${x} 90 H${x + 62} L${x + 132} 130 H${x + 70} Z"/>`).join('')
      + (plan.accel ? `<path class="fs-road" d="M0 90 H300 L232 112 H0 Z"/><path class="fs-mark is-block" d="M0 91.5 H232"/>` : '');
    const ground = plan.tyre ? tyreHtml(sc, final)
      : plan.lanes3 ? `<rect class="fs-road" x="0" y="28" width="${ROAD_W}" height="78"/>
        <path class="fs-mark" d="M0 54 H${ROAD_W}"/><path class="fs-mark" d="M0 80 H${ROAD_W}"/>`
      : `<rect class="fs-road" x="0" y="40" width="${ROAD_W}" height="52"/>
      <path class="fs-mark${solid ? ' is-solid' : ''}" d="M0 66 H${plan.laneEnds ? 222 : ROAD_W}"/>`;
    // скобка с расстоянием (знак аварийной остановки)
    const measure = plan.measure ? `<g class="fs-lab${final ? ' is-on' : ''}">
        <path class="fs-bracket" d="M${plan.measure.x1} ${plan.measure.y - 6} V${plan.measure.y} H${plan.measure.x2} V${plan.measure.y - 6}"/>
        <text class="fs-lab-text" x="${(plan.measure.x1 + plan.measure.x2) / 2}" y="${plan.measure.y + 12}">${esc(plan.measure.label)}</text></g>` : '';
    return `<svg class="fs-svg fs-road-svg" viewBox="0 0 ${ROAD_W} 130" role="img" aria-label="${esc(sc.type)}">
      <rect class="fs-grass" x="0" y="0" width="${ROAD_W}" height="130"/>
      ${ramps}${ground}
      ${curb}${rest}${ends}${sign}${park}${night}${plan.fog ? fogPosts(plan.fog) : ''}
      ${plan.actors.map(a => actorHtml(a, keyAt(a.keys, t))).join('')}
      ${plan.fog ? fogHtml(sc, plan.fog, final) : ''}${gap}${zzz}${badge}${measure}
    </svg>`;
  }

  // Протектор в разрезе: резина с тремя канавками глубиной depth мм,
  // после ответа — красная линия минимума 1,6 мм и подписи
  function tyreHtml(sc, final) {
    const d = sc.depth * TREAD_S, min = TREAD_Y + 1.6 * TREAD_S;
    const grooves = [70, 148, 226].map(x => `<rect class="fs-groove" x="${x}" y="${TREAD_Y}" width="24" height="${d.toFixed(1)}"/>`).join('');
    return `<rect class="fs-rubber" x="20" y="${TREAD_Y}" width="280" height="90" rx="4"/>${grooves}
      <g class="fs-lab${final ? ' is-on' : ''}">
        <path class="fs-tread-min" d="M20 ${min.toFixed(1)} H300"/>
        <text class="fs-lab-text is-b" x="44" y="${(min - 4).toFixed(1)}">1,6 mm</text>
        <text class="fs-lab-text fs-tread-val" x="214" y="${(TREAD_Y + d + 16).toFixed(1)}">${String(sc.depth).replace('.', ',')} mm</text>
      </g>`;
  }

  // Столбики через 50 м от носа машины — по ним водитель оценивает видимость
  function fogPosts(f) {
    let out = '';
    for (let x = FOG_X + 50 * f.S; x <= ROAD_W; x += 50 * f.S) {
      out += `<g transform="translate(${x.toFixed(1)} 26)"><rect class="fs-post" x="-2" y="0" width="4" height="12" rx="1"/><rect class="fs-post-band" x="-2" y="3" width="4" height="3"/></g>`;
    }
    return out;
  }

  // Пелена тумана: у машины почти прозрачная, на границе видимости — сплошная;
  // после ответа — скобка «N m» видимости и, если меньше 50 м, «max. 50 km/h»
  function fogHtml(sc, f, final) {
    const x2 = Math.min(FOG_X + sc.sight * f.S, ROAD_W - 2);
    const id = 'fsFog' + sc.sight;
    return `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${FOG_X - 30}" y1="0" x2="${x2.toFixed(1)}" y2="0">
        <stop offset="0" stop-color="#e9edf1" stop-opacity=".12"/><stop offset="1" stop-color="#e9edf1" stop-opacity=".96"/>
      </linearGradient></defs>
      <rect x="0" y="0" width="${ROAD_W}" height="130" fill="url(#${id})" class="fs-fog"/>
      <g class="fs-lab${final ? ' is-on' : ''}">
        <path class="fs-bracket fs-bracket-fog" d="M${FOG_X} 98 V104 H${x2.toFixed(1)} V98"/>
        <text class="fs-lab-text fs-lab-fog" x="${((FOG_X + x2) / 2).toFixed(1)}" y="118">${sc.sight} m</text>
        ${sc.limit ? `<text class="fs-lab-text fs-lab-fog" x="${FOG_X - 40}" y="118">max. 50 km/h</text>` : ''}
      </g>`;
  }

  // Перекрёсток / «зебра» / остановка, запретная зона и расстояние до машины
  function parkHtml(sc, p, final) {
    const z = sc.limit * p.S;
    let obj = '';
    if (sc.near === 'crossing') {
      obj = `<rect class="fs-road" x="${p.edge - 40}" y="92" width="40" height="38"/>`;
    } else if (sc.near === 'zebra') {
      for (let y = 43; y < 90; y += 8) obj += `<rect class="fs-zebra" x="${p.edge}" y="${y}" width="26" height="4.5"/>`;
    } else if (sc.near === 'bus' && sc.sign && unit.signs[sc.sign]) {
      obj = `<image href="${esc(unit.signs[sc.sign].src)}" x="${p.edge - 9}" y="96" width="18" height="18"/>`;
    }
    const zx = p.before ? p.edge - z : p.edge;
    const carEnd = p.before ? p.front : p.front - 28;     // ближний к объекту край машины
    const lo = Math.min(p.edge, carEnd), hi = Math.max(p.edge, carEnd);
    return `${obj}
      <g class="fs-lab${final ? ' is-on' : ''}">
        <rect class="fs-noparking" x="${zx}" y="76" width="${z}" height="16"/>
        <text class="fs-lab-text is-b" x="${zx + z / 2}" y="73">${sc.limit} m</text>
        <path class="fs-bracket" d="M${lo} 108 V114 H${hi} V108"/>
        <text class="fs-lab-text" x="${(lo + hi) / 2}" y="126">${String(sc.dist).replace('.', ',')} m</text>
      </g>`;
  }

  function animatePlan(sc, svg, done) {
    const plan = PLANS[sc.type](sc);
    const nodes = plan.actors.map(a => [a, svg.querySelector(`[data-actor="${a.id}"]`)]);
    const t0 = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - t0) / plan.dur);
      nodes.forEach(([a, g]) => {
        if (!g) return;
        const k = keyAt(a.keys, t);
        g.setAttribute('transform', actorTransform(a, k));
        g.classList.toggle('is-blink-l', k.b === 'l' || k.b === 'both');
        g.classList.toggle('is-blink-r', k.b === 'r' || k.b === 'both');
        Object.keys(STATES).forEach(c => g.classList.toggle(c, STATES[c](k)));
      });
      if (t < 1) { anims[0] = requestAnimationFrame(tick); return; }
      anims[0] = null;
      const lab = svg.querySelector('.fs-lab');
      if (lab) lab.classList.add('is-on');
      timers.push(setTimeout(done, 500));
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

  function lineTrShown(h) {
    return trOn() ? !h.classList.contains('tr-closed') : h.classList.contains('tr-open');
  }

  function trCls(shown) {
    const g = trOn();
    return shown && !g ? ' tr-open' : !shown && g ? ' tr-closed' : '';
  }

  function quizTr() { return quiz && quiz.tr !== null ? quiz.tr : trOn(); }

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
    const tt = t.closest('[data-topic-toggle]');
    if (tt) { e.preventDefault(); toggleTopic(tt.dataset.topicToggle); return; }
    const tile = t.closest('[data-unit]');
    if (tile) { e.preventDefault(); go({ name: 'unit', id: tile.dataset.unit }); return; }
    const w = t.closest('.fs-w');
    if (w) { e.preventDefault(); onWord(w); return; }
    const say = t.closest('[data-say]');
    if (say) { e.preventDefault(); sayLine(Number(say.dataset.say)); return; }
    const play = t.closest('[data-play]');
    if (play) { e.preventDefault(); togglePlay(play.dataset.play); return; }
    if (t.closest('[data-tr-toggle]')) {
      // общий «Перевод» сбрасывает выбор 🌐 у строк, сцены и теста
      writeStore(TR_KEY, trOn() ? '0' : '1');
      el.unit.querySelectorAll('.tr-open, .tr-closed').forEach(h => h.classList.remove('tr-open', 'tr-closed'));
      sceneTr = trOn();
      if (quiz) quiz.tr = null;
      const box = document.getElementById('fsJunction');
      if (box) paintSceneTr(box);
      paintTr();
      return;
    }
    if (t.closest('[data-tr-line]')) { toggleLineTr(trHolder(t)); return; }
    const ro = t.closest('[data-road-opt]');
    if (ro) { pickRoad(ro.dataset.roadOpt); return; }
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
  // В сцене (перекрёсток, «на дороге») 🌐 у ситуации и тап по вопросу
  // переводят всё, что нужно для ответа: ситуацию, вопрос и варианты.
  // Пояснения после ответа — у каждой строки своя 🌐.
  function trHolder(t) {
    const box = t.closest('.fs-junction');
    if (box && !t.closest('.fs-explain') && (t.closest('.fs-situation') || t.closest('.fs-quiz-q'))) return box;
    return t.closest('.fs-quiz-card') || t.closest('.fs-line, .fs-situation');
  }

  function paintSceneTr(box) {
    box.classList.toggle('scene-tr', sceneTr);
    box.classList.toggle('scene-tr-off', !sceneTr);
    const b = box.querySelector('.fs-situation [data-tr-line]');
    if (b) b.setAttribute('aria-pressed', sceneTr ? 'true' : 'false');
  }

  function toggleLineTr(holder, force) {
    if (!holder) return;
    if (holder.classList.contains('fs-junction')) {
      sceneTr = force === undefined ? !sceneTr : force;
      paintSceneTr(holder);
      return;
    }
    // 🌐 переключает видимость относительно общего «Перевода»: при общем
    // включённом — скрывает перевод этой строки (tr-closed), при выключенном —
    // показывает (tr-open)
    const on = force === undefined ? !lineTrShown(holder) : force;
    const g = trOn();
    holder.classList.toggle('tr-open', on && !g);
    holder.classList.toggle('tr-closed', !on && g);
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
