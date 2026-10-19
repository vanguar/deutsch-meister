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
    junction: { label: 'Перекрёсток', text: 'Кто едет первым? Расставьте машины по очереди', forms: ['ситуация', 'ситуации', 'ситуаций'] }
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
  let loaded = false;
  let view   = { name: 'hub' };
  let unit   = null;        // открытый урок (полный JSON)
  let loadSeq = 0;
  let playing = null;       // ключ того, что звучит: 'all' | 's:<n>' | null
  let sentences = [];       // фразы на экране: [{ de, tr }], индекс = data-s
  let quiz  = null;         // { i, score, answered, opts, base }
  let scene = null;         // { i, pick, done }
  let anims = [];           // requestAnimationFrame машин
  let timers = [];
  const cache = {};

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
          <div class="news-tile-text">Скорость, обгон, парковка, автобан и экзамен — после пилота</div>
        </div>
      </div>
    </div>`;
  }

  function renderHub() {
    el.list.setAttribute('aria-busy', 'false');
    el.list.innerHTML = units.map(tileHtml).join('') + soonTileHtml();
  }

  /* ── Урок ── */

  function fetchUnit(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    return fetch(DATA_DIR + id + '.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(id + '.json: HTTP ' + r.status); return r.json(); })
      .then(d => { cache[id] = d; return d; });
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
    if (u.kind === 'junction') openScene(0);
  }

  function controlsHtml(label) {
    return `<div class="dlg-controls">
      <button class="dlg-play" type="button" data-play="all" aria-pressed="false">
        <span class="dlg-play-ico" aria-hidden="true">▶</span> <span class="dlg-play-label">${esc(label)}</span>
      </button>
      <button class="news-chip dlg-tr-toggle" type="button" data-tr-toggle aria-pressed="false">🌐 <span>Перевод</span></button>
    </div>
    <p class="dlg-voice-note fs-hint"><span>Нажмите на слово — появится перевод. 🔊 — озвучка фразы.</span></p>`;
  }

  function sayBtn(n) {
    return `<button class="dlg-say" type="button" data-say="${n}" title="Озвучить фразу" aria-label="Озвучить фразу">🔊</button>`;
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
            ${sayBtn(n)}
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
    quiz = { i: 0, score: 0, answered: false, opts: [], base: sentences.length };
    renderQuiz();
  }

  // Строка теории, которая объясняет знак, — она же пояснение к ответу
  function lineForSign(sid) {
    for (const sec of unit.sections || []) {
      const ln = sec.lines.find(l => l.sign === sid);
      if (ln) return ln;
    }
    return null;
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
        ${answer ? `<span class="fs-opt-tr">${esc(o.tr)}</span>` : ''}
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
      <div class="fs-quiz-card">
        <div class="fs-quiz-top"><span>Вопрос</span> <span class="fs-quiz-n">${quiz.i + 1} / ${list.length}</span></div>
        ${signHtml(s, true)}
        ${unit.quizQuestion ? sentence(unit.quizQuestion, 'p', 'fs-quiz-q') : ''}
        <div class="fs-opts">${opts}</div>
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
        ${sayBtn(n)}
      </li>`;
    }).join('');
    return controlsHtml('Слушать диалог') + `<ol class="dlg-lines fs-dialog">${lines}</ol>`;
  }

  /* ── Перекрёсток ── */

  function openScene(i) {
    stopAll();
    scene = { i, pick: [], done: false, right: false };
    renderScene();
  }

  function sceneSvg(sc) {
    const signs = sc.signs || {};
    const approach = a => {
      const s = signs[a];
      if (!s) return '';
      const r = ROT[a];
      const stop = s === 'z205'
        ? '<path class="fs-wait" d="M150 186 H182" stroke-dasharray="6 4"/>'
        : s === 'z206' ? '<path class="fs-wait" d="M150 186 H182"/>' : '';
      // знак стоит справа от подъезда; поворачиваем только место, сам знак — прямо
      return `<g transform="rotate(${r} 150 150)">${stop}
        <g transform="translate(206 210) rotate(${-r})"><image href="${esc(unit.signs[s].src)}" x="-13" y="-13" width="26" height="26"/></g></g>`;
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
        ${sayBtn(n)}</div></li>`;
    }).join('') : '';
    box.innerHTML = `
      <div class="fs-scene-top">
        <span><span>Ситуация</span> <span class="fs-scene-n">${scene.i + 1} / ${list.length}</span></span>
        <span class="fs-dots" aria-hidden="true">${list.map((_, k) => `<i class="${k === scene.i ? 'on' : ''}"></i>`).join('')}</span>
      </div>
      <div class="fs-line-text fs-situation">${sit}<p class="fs-tr" dir="auto">${esc(sc.situation.tr)}</p></div>
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
      drive(sc.order, after);
    }
  }

  // Машины едут по своим маршрутам в правильном порядке. Каждая
  // следующая трогается, пока предыдущая ещё в пути (NEXT_MS < DRIVE_MS).
  function drive(order, done) {
    const svg = document.querySelector('#fsScene .fs-svg');
    if (!svg) { done(); return; }
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

  function scrollToScene() {
    const box = document.getElementById('fsJunction');
    if (!box || !box.scrollIntoView) return;
    try { box.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { box.scrollIntoView(true); }
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
      el.unit.querySelectorAll('.tr-open').forEach(li => li.classList.remove('tr-open'));
      paintTr();
      return;
    }
    const opt = t.closest('[data-opt]');
    if (opt) { answerQuiz(opt.dataset.opt); return; }
    if (t.closest('[data-quiz-next]')) { stopSpeech(); quiz.i++; quiz.answered = false; renderQuiz(); return; }
    if (t.closest('[data-quiz-restart]')) { stopSpeech(); startQuiz(); return; }
    const car = t.closest('.fs-car');
    if (car) { pickCar(car.dataset.car); return; }
    if (t.closest('[data-scene-reset]')) { scene.pick = []; paintScene(); return; }
    if (t.closest('[data-scene-again]')) { openScene(scene.i); return; }
    if (t.closest('[data-scene-next]')) { openScene(scene.i + 1); scrollToScene(); return; }
    // нажатие на строку открывает её перевод (когда общий перевод скрыт)
    const line = t.closest('.fs-line, .fs-situation');
    if (line && !t.closest('a, button')) line.classList.toggle('tr-open');
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
    wordsHtml, wordKey, WORD_RE
  };
})();

document.addEventListener('DOMContentLoaded', () => Fahrschule.init());
