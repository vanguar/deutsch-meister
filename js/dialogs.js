/* ═══════════════════════════════════════════════
   dialogs.js — раздел «Диалоги» (dialogs.html)

   Данные: data/dialogs/index.json + data/dialogs/<id>.json (собирает
   tools/dialogs/build.py). На украинском и арабском js/i18n.js подменяет
   запрос на переведённую копию i18n/<lang>/dialogs/… — так же, как у
   книг и новостей. Немецкие реплики одинаковы на всех языках.

   Три вида на одной странице, у каждого свой адрес:
     • уровни A1–B2          — dialogs.html
     • диалоги уровня         — dialogs.html#l=a1
     • диалог                 — dialogs.html#d=a1-03
   Вглубь — запись в history: «назад» браузера, Telegram BackButton и
   кнопки «← …» поднимаются на уровень выше; с уровней — на главную.
   Соседние диалоги («‹ Предыдущий / Следующий ›») заменяют запись, чтобы
   «назад» вело к списку, а не по всем открытым диалогам.

   Озвучка — общая очередь ReaderSpeak (js/reader-speak.js) поверх TTS
   (js/tts.js), без своего синтеза:
     • в браузере — системные немецкие голоса: если их два и больше,
       персонажи говорят разными голосами (по полу, если его видно по
       имени голоса); если голос один — второй персонаж звучит с другой
       высотой тона;
     • в Telegram (и без немецкого голоса) — mp3 Google TTS, голос там
       один. Чтобы персонажей было легче различать, второму можно
       немного понизить тон (кнопка «🎭»); это честно подписано как
       сдвиг тона одного голоса, а не второй голос.
   Следующая реплика качается заранее (opts.preload), между репликами —
   короткая пауза. Озвучка останавливается при уходе с диалога, смене
   вкладки и запуске другой реплики.
   Zero dependencies (нужны TTS и ReaderSpeak).
   ═══════════════════════════════════════════════ */

const Dialogs = (() => {

  const INDEX_URL = 'data/dialogs/index.json';
  const DATA_DIR  = 'data/dialogs/';
  const TR_KEY    = 'dm_dlg_tr';     // показывать перевод: '1' / '0'
  const TONE_KEY  = 'dm_dlg_tone';   // сдвиг тона в аудио-режиме: '1' — вкл (по умолчанию выкл)
  const HOME_URL  = 'index.html';
  const GAP_MS    = 380;             // пауза между репликами

  const LEVELS = [
    { id: 'a1', code: 'A1', title: 'Начальный',     text: 'Простые бытовые разговоры: знакомство, покупки, дорога' },
    { id: 'a2', code: 'A2', title: 'Элементарный',  text: 'Повседневные ситуации: врач, транспорт, сервис, планы' },
    { id: 'b1', code: 'B1', title: 'Средний',       text: 'Работа, жильё, учреждения и решение проблем' },
    { id: 'b2', code: 'B2', title: 'Выше среднего', text: 'Аргументы, переговоры и сложные ситуации' }
  ];
  const LEVEL = Object.fromEntries(LEVELS.map(l => [l.id, l]));
  // Скорость системного голоса: на A1 медленнее, на B2 почти обычная.
  // На mp3 Google TTS не влияет — там скорость своя.
  // Медленнее 0.85 системные голоса звучат «механически» — держим скорость
  // уроков (0.85) и книг (0.9).
  const RATE = { a1: 0.85, a2: 0.9, b1: 0.9, b2: 0.9 };

  let el = {};
  let items  = [];          // оглавление (index.json)
  let loaded = false;
  let view   = { name: 'hub' };
  let dialog = null;        // открытый диалог (полный JSON)
  let loadSeq = 0;          // защита от гонки: открыли другой диалог, пока грузился прежний
  let playing = null;       // 'all' | номер реплики | null
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
  function countHtml(n) {
    return `<b>${n}</b> <span>${plural(n, ['диалог', 'диалога', 'диалогов'])}</span>`;
  }

  function linesHtml(n) {
    return `<span>${n}</span> <span>${plural(n, ['реплика', 'реплики', 'реплик'])}</span>`;
  }

  function inLevel(lv) {
    return items.filter(it => it.level === lv).sort((a, b) => a.n - b.n);
  }

  function tg() {
    const w = window.Telegram && window.Telegram.WebApp;
    return w && w.initData && w.BackButton && w.isVersionAtLeast && w.isVersionAtLeast('6.1') ? w : null;
  }

  /* ── Адрес ↔ вид ── */

  function viewFromHash() {
    const h = location.hash || '';
    let m = /^#d=([a-z0-9-]+)/.exec(h);
    if (m) return { name: 'dialog', id: m[1] };
    m = /^#l=(a1|a2|b1|b2)\b/.exec(h);
    if (m) return { name: 'level', level: m[1] };
    return { name: 'hub' };
  }

  function hashOf(v) {
    if (v.name === 'dialog') return '#d=' + v.id;
    if (v.name === 'level')  return '#l=' + v.level;
    return '';
  }

  function levelOfId(id) {
    const it = items.find(x => x.id === id);
    if (it) return it.level;
    const m = /^(a1|a2|b1|b2)-/.exec(id || '');
    return m ? m[1] : null;
  }

  function parentOf(v) {
    if (v.name === 'dialog') {
      const lv = levelOfId(v.id);
      return lv ? { name: 'level', level: lv } : { name: 'hub' };
    }
    if (v.name === 'level') return { name: 'hub' };
    return null;   // выше уровней — главная
  }

  function setUrl(v, mode) {
    const url = location.pathname + location.search + hashOf(v);
    const st = { dlg: true, pushed: mode === 'push' || !!(history.state && history.state.pushed && mode === 'replace') };
    try {
      if (mode === 'push') history.pushState(st, '', url);
      else history.replaceState(st, '', url);
    } catch (e) { /* старый WebView */ }
  }

  // Вглубь — push; соседний диалог — replace; наверх — back(), если
  // родителя мы сами положили в history, иначе replace на родителя
  function go(v, mode) {
    setUrl(v, mode || 'push');
    show(v);
  }

  function up() {
    const parent = parentOf(view);
    if (!parent) { stopSpeech(); location.href = HOME_URL; return; }
    if (history.state && history.state.dlg && history.state.pushed) { history.back(); return; }
    setUrl(parent, 'replace');
    show(parent);
  }

  function onPopState() {
    show(viewFromHash());
  }

  /* ── Telegram BackButton: всегда «на уровень выше» ── */

  let tgBound = false;
  function syncTgBack() {
    const w = tg();
    if (!w) return;
    if (!tgBound) { w.BackButton.onClick(up); tgBound = true; }
    w.BackButton.show();
  }

  /* ── Показ вида ── */

  function show(v) {
    stopSpeech();
    // диалога нет в оглавлении (старая ссылка) — к его уровню или к уровням
    if (loaded && v.name === 'dialog' && !items.some(it => it.id === v.id)) {
      const lv = levelOfId(v.id);
      v = lv && inLevel(lv).length ? { name: 'level', level: lv } : { name: 'hub' };
      setUrl(v, 'replace');
    }
    view = v;
    el.hub.hidden   = v.name !== 'hub';
    el.level.hidden = v.name !== 'level';
    el.view.hidden  = v.name !== 'dialog';
    syncTgBack();
    if (!loaded) return;
    if (v.name === 'hub') renderHub();
    else if (v.name === 'level') renderLevel(v.level);
    else openDialog(v.id);
    window.scrollTo(0, 0);
  }

  /* ── Уровни ── */

  function levelTileHtml(l) {
    const list = inLevel(l.id);
    if (!list.length) {
      return `<a class="news-tile is-soon dlg-tile" href="#l=${l.id}" data-level="${l.id}" aria-disabled="true">
        <span class="news-tile-badge soon">Скоро</span>
        <div class="news-tile-top">
          <div class="news-tile-ico dlg-lv-badge lv-${l.id}">${l.code}</div>
          <div class="news-tile-head">
            <div class="news-tile-title">${esc(l.title)}</div>
            <div class="news-tile-text">${esc(l.text)}</div>
          </div>
        </div>
        <div class="news-tile-foot"><span class="news-tile-count muted"><span>Диалоги готовятся</span></span></div>
      </a>`;
    }
    const first = list[0];
    return `<a class="news-tile is-live dlg-tile" href="#l=${l.id}" data-level="${l.id}">
      <div class="news-tile-top">
        <div class="news-tile-ico dlg-lv-badge lv-${l.id}">${l.code}</div>
        <div class="news-tile-head">
          <div class="news-tile-title">${esc(l.title)}</div>
          <div class="news-tile-text">${esc(l.text)}</div>
        </div>
      </div>
      <div class="dlg-tile-thumbs" aria-hidden="true">
        ${list.slice(0, 4).map(it => thumbHtml(it, 'dlg-tile-thumb')).join('')}
      </div>
      <div class="news-tile-foot">
        <span class="news-tile-count">${countHtml(list.length)}</span>
        <span class="dlg-tile-first" lang="de" dir="ltr">${esc(first.title)}…</span>
        <span class="news-tile-go">Открыть →</span>
      </div>
    </a>`;
  }

  function renderHub() {
    el.levels.setAttribute('aria-busy', 'false');
    el.levels.innerHTML = LEVELS.map(levelTileHtml).join('');
  }

  /* ── Картинка: локальный файл, без сети — заглушка с эмодзи ── */

  function thumbHtml(it, cls) {
    const img = it.img || {};
    return `<span class="${cls} dlg-ph" data-emoji="${esc(it.emoji || '💬')}">${img.thumb
      ? `<img src="${esc(img.thumb)}" alt="" width="${img.tw || 320}" height="${img.th || 180}" loading="lazy" decoding="async">`
      : ''}</span>`;
  }

  // Не загрузилась картинка — остаётся градиент с эмодзи сцены
  function onImgError(e) {
    const t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    const ph = t.closest('.dlg-ph');
    if (ph) { ph.classList.add('is-fallback'); t.remove(); }
  }

  /* ── Список диалогов уровня ── */

  function renderLevel(lv) {
    const l = LEVEL[lv];
    const list = inLevel(lv);
    el.levelBadge.textContent = l.code;
    el.levelBadge.className = 'news-rubric-ico dlg-lv-badge lv-' + lv;
    el.levelTitle.textContent = l.title;
    el.levelSub.innerHTML = list.length ? countHtml(list.length) : '';
    el.list.innerHTML = list.length ? list.map(it => `<li>
      <a class="dlg-item" href="#d=${esc(it.id)}" data-dialog="${esc(it.id)}">
        ${thumbHtml(it, 'dlg-item-thumb')}
        <span class="dlg-item-body">
          <span class="dlg-item-n">${it.n}</span>
          <span class="dlg-item-title" lang="de" dir="ltr">${esc(it.title)}</span>
          <span class="dlg-item-tr">${esc(it.titleTr)}</span>
          <span class="dlg-item-meta">${linesHtml(it.lines)} · ${esc(it.speakers)}</span>
        </span>
        <span class="dlg-item-go" aria-hidden="true">›</span>
      </a></li>`).join('')
      : '<li class="news-empty">Диалоги этого уровня скоро появятся.</li>';
  }

  /* ── Диалог ── */

  function fetchDialog(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    return fetch(DATA_DIR + id + '.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(id + '.json: HTTP ' + r.status); return r.json(); })
      .then(d => { cache[id] = d; return d; });
  }

  function openDialog(id) {
    const seq = ++loadSeq;
    dialog = null;
    el.lines.innerHTML = '<li class="news-loading"><span class="rd-spinner"></span><span>Загружаем диалог</span></li>';
    el.figure.innerHTML = '';
    el.title.textContent = '';
    el.titleTr.textContent = '';
    el.situation.textContent = '';
    fetchDialog(id).then(d => {
      if (seq !== loadSeq) return;
      dialog = d;
      renderDialog();
    }).catch(err => {
      if (seq !== loadSeq) return;
      console.error('[Dialogs] диалог не загрузился:', err);
      el.lines.innerHTML = `<li class="news-error"><b>Не удалось загрузить диалог.</b>
        <span>Проверьте соединение и попробуйте снова.</span>
        <button class="news-btn" type="button" data-retry>Повторить</button></li>`;
    });
  }

  function figureHtml(d) {
    const img = d.img || {};
    const pic = img.src
      ? `<img src="${esc(img.src)}" alt="" width="${img.w || 800}" height="${img.h || 450}" decoding="async">`
      : '';
    const credit = img.author
      ? `<figcaption class="dlg-credit"><span>Фото</span>: ${esc(img.author)} · ${img.licenseUrl
          ? `<a href="${esc(img.licenseUrl)}" target="_blank" rel="noopener">${esc(img.license)}</a>`
          : esc(img.license)}${img.source
          ? ` · <a href="${esc(img.source)}" target="_blank" rel="noopener">${esc(img.site || 'Источник')}</a>` : ''}</figcaption>`
      : '';
    return `<span class="dlg-hero dlg-ph${pic ? '' : ' is-fallback'}" data-emoji="${esc(d.emoji || '💬')}">${pic}</span>${credit}`;
  }

  function renderDialog() {
    const d = dialog;
    const list = inLevel(d.level);
    const pos = list.findIndex(it => it.id === d.id);
    el.counter.textContent = (pos >= 0 ? pos + 1 : d.n) + ' / ' + (list.length || 10);
    el.figure.innerHTML = figureHtml(d);
    el.levelChip.textContent = LEVEL[d.level] ? LEVEL[d.level].code : d.level.toUpperCase();
    el.levelChip.className = 'dlg-level-chip lv-' + d.level;
    el.title.textContent = d.title;
    el.titleTr.textContent = d.titleTr || '';
    el.situation.textContent = d.situation || '';
    document.title = d.title + ' | German Morning';
    const sp = d.speakers || {};
    el.lines.innerHTML = d.lines.map((ln, i) => {
      const who = sp[ln.s] || { name: ln.s };
      return `<li class="dlg-line side-${ln.s === 'A' ? 'a' : 'b'}" data-i="${i}">
        <div class="dlg-bubble">
          <div class="dlg-who" lang="de" dir="ltr">${esc(who.name)}</div>
          <div class="dlg-de" lang="de" dir="ltr">${esc(ln.de)}</div>
          <div class="dlg-tr" dir="auto">${esc(ln.tr || '')}</div>
        </div>
        <button class="dlg-say" type="button" data-say="${i}" title="Озвучить реплику" aria-label="Озвучить реплику">🔊</button>
      </li>`;
    }).join('');
    el.prev.disabled = pos <= 0;
    el.next.disabled = pos < 0 || pos >= list.length - 1;
    paintVoiceNote();
    paintPlay();
  }

  function neighbour(step) {
    if (!dialog) return;
    const list = inLevel(dialog.level);
    const pos = list.findIndex(it => it.id === dialog.id);
    const it = list[pos + step];
    if (it) go({ name: 'dialog', id: it.id }, 'replace');
  }

  /* ── Перевод ── */

  function trOn() { return readStore(TR_KEY) === '1'; }

  function paintTr() {
    const on = trOn();
    el.view.classList.toggle('show-tr', on);
    el.trToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  /* ── Голоса персонажей ── */

  // Сдвиг тона — ресемплинг, звук становится менее естественным, поэтому
  // по умолчанию выключен: звучит так же, как в уроках и книгах.
  function toneOn() { return readStore(TONE_KEY) === '1'; }

  // Сдвиг тона (центы) для аудио-пути: мужской персонаж ниже, при
  // одинаковом поле второй отличается от первого. Небольшой: это
  // ресемплинг, вместе с тоном меняется и темп (до ~9%).
  function detunePlan(sp) {
    const ga = (sp.A && sp.A.g) || 'f';
    const gb = (sp.B && sp.B.g) || 'm';
    if (ga !== gb) return { A: ga === 'm' ? -150 : 0, B: gb === 'm' ? -150 : 0 };
    return ga === 'm' ? { A: -150, B: -60 } : { A: 0, B: -100 };
  }

  // Системные голоса: два РАЗНЫХ голоса — только если оба «живые»
  // (нейронные Natural/Online, Premium, Google: voiceScore ≥ 50). Старые
  // синтезаторы (Hedda, Stefan, eSpeak) звучат механически и не делают
  // вопросительной интонации — тогда, как в уроках и книгах, оба персонажа
  // говорят одним лучшим голосом, без искажения высоты.
  function speechPlan(sp) {
    const voices = (TTS.germanVoices && TTS.germanVoices()) || [];
    const score = v => (TTS.voiceScore ? TTS.voiceScore(v) : 0);
    const gender = v => (TTS.voiceGender ? TTS.voiceGender(v) : '');
    const best = voices[0] || null;
    const good = voices.filter(v => score(v) >= 50);
    const ga = (sp.A && sp.A.g) || 'f';
    const gb = (sp.B && sp.B.g) || 'm';
    const va = good.find(v => gender(v) === ga);
    const vb = good.find(v => v !== va && gender(v) === gb);
    if (ga !== gb && va && vb) {
      return { two: true, names: [va.name, vb.name], A: { voiceName: va.name }, B: { voiceName: vb.name } };
    }
    const name = best ? best.name : null;
    return { two: false, names: name ? [name] : [], A: { voiceName: name }, B: { voiceName: name } };
  }

  function voicePlan() {
    const sp = (dialog && dialog.speakers) || {};
    if (TTS.mode && TTS.mode() === 'speech') return Object.assign({ mode: 'speech' }, speechPlan(sp));
    const dt = toneOn() ? detunePlan(sp) : { A: 0, B: 0 };
    return { mode: 'audio', two: false, A: { detune: dt.A }, B: { detune: dt.B } };
  }

  function paintVoiceNote() {
    if (!dialog || typeof TTS === 'undefined') return;
    const plan = voicePlan();
    const sp = dialog.speakers || {};
    el.tone.hidden = plan.mode !== 'audio';
    el.tone.setAttribute('aria-pressed', toneOn() ? 'true' : 'false');
    if (plan.mode === 'speech' && plan.two) {
      el.voiceNote.innerHTML = `<span>Два системных голоса</span>: <bdi dir="ltr">${esc(plan.names[0])}</bdi> · <bdi dir="ltr">${esc(plan.names[1])}</bdi>`;
    } else if (plan.mode === 'speech') {
      el.voiceNote.innerHTML = '<span>Один голос для обоих персонажей — как в уроках и книгах.</span>';
    } else if (toneOn()) {
      const lower = plan.A.detune < plan.B.detune ? sp.A : sp.B;
      el.voiceNote.innerHTML = `<span>Озвучка Google — один голос. Чтобы различать персонажей, у одного из них тон немного ниже</span>: <bdi dir="ltr" lang="de">${esc((lower && lower.name) || '')}</bdi>.`;
    } else {
      el.voiceNote.innerHTML = '<span>Озвучка Google — один голос для обоих персонажей.</span>';
    }
  }

  /* ── Озвучка ── */

  function lineEls() { return el.lines.querySelectorAll('.dlg-line'); }

  function mark(i) {
    lineEls().forEach(li => li.classList.toggle('is-speaking', Number(li.dataset.i) === i));
    if (i == null || i < 0) return;
    const li = el.lines.querySelector(`.dlg-line[data-i="${i}"]`);
    if (li && li.scrollIntoView) {
      try { li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { li.scrollIntoView(false); }
    }
  }

  function paintPlay() {
    const on = playing === 'all';
    el.play.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.play.classList.toggle('is-on', on);
    el.playIco.textContent = on ? '■' : '▶';
    el.playLabel.textContent = on ? 'Стоп' : 'Слушать диалог';
    lineEls().forEach(li => {
      const b = li.querySelector('.dlg-say');
      if (b) b.classList.toggle('is-on', playing === Number(li.dataset.i));
    });
  }

  function stopSpeech() {
    if (playing === null) return;
    playing = null;
    try { ReaderSpeak.stop(); } catch (e) {}
    mark(-1);
    paintPlay();
  }

  function speakLines(from, to, kind) {
    if (!dialog || typeof ReaderSpeak === 'undefined') return;
    const plan = voicePlan();
    const seq = dialog.lines.slice(from, to).map((ln, k) => ({
      text: ln.de,
      idx: from + k,
      tts: Object.assign({}, ln.s === 'A' ? plan.A : plan.B)
    }));
    try { ReaderSpeak.stop(); } catch (e) {}
    playing = kind;
    paintPlay();
    paintVoiceNote();
    const started = ReaderSpeak.run(seq, {
      kind: 'dialog',
      rate: RATE[dialog.level] || 0.9,
      gap: GAP_MS,
      preload: true,
      onItem: item => mark(item.idx),
      onDone: () => {
        // onDone приходит и при остановке; чужую очередь (уже новую) не трогаем
        if (playing !== kind) return;
        playing = null;
        mark(-1);
        paintPlay();
      }
    });
    if (!started) { playing = null; paintPlay(); }
  }

  function togglePlay() {
    if (playing === 'all') { stopSpeech(); return; }
    speakLines(0, dialog ? dialog.lines.length : 0, 'all');
  }

  function sayLine(i) {
    if (playing === i) { stopSpeech(); return; }
    speakLines(i, i + 1, i);
  }

  /* ── События ── */

  function onClick(e) {
    const retry = e.target.closest('[data-retry]');
    if (retry) { e.preventDefault(); if (view.name === 'dialog') openDialog(view.id); else load(); return; }
    const lv = e.target.closest('[data-level]');
    if (lv) {
      e.preventDefault();
      if (lv.classList.contains('is-soon')) { toast('Диалоги этого уровня скоро появятся'); return; }
      go({ name: 'level', level: lv.dataset.level });
      return;
    }
    const dl = e.target.closest('[data-dialog]');
    if (dl) { e.preventDefault(); go({ name: 'dialog', id: dl.dataset.dialog }); return; }
    const say = e.target.closest('[data-say]');
    if (say) { e.preventDefault(); sayLine(Number(say.dataset.say)); return; }
    // нажатие на реплику открывает её перевод (когда общий перевод скрыт)
    const bubble = e.target.closest('.dlg-bubble');
    if (bubble && !e.target.closest('a')) bubble.parentNode.classList.toggle('tr-open');
  }

  function toast(msg) {
    if (typeof ReaderSpeak !== 'undefined' && ReaderSpeak.toast) ReaderSpeak.toast(msg);
  }

  function showStatus(html) {
    const box = view.name === 'level' ? el.list : view.name === 'dialog' ? el.lines : el.levels;
    el.levels.setAttribute('aria-busy', 'false');
    box.innerHTML = html;
  }

  function load() {
    showStatus('<div class="news-loading"><span class="rd-spinner"></span><span>Загружаем диалоги</span></div>');
    return fetch(INDEX_URL, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(INDEX_URL + ': HTTP ' + r.status); return r.json(); })
      .then(data => {
        items = (data && Array.isArray(data.items) ? data.items : []).filter(it => it && it.id && LEVEL[it.level]);
        loaded = true;
        show(view);
      })
      .catch(err => {
        console.error('[Dialogs] оглавление не загрузилось:', err);
        showStatus(`<div class="news-error"><b>Не удалось загрузить диалоги.</b>
          <span>Проверьте соединение и попробуйте снова.</span>
          <button class="news-btn" type="button" data-retry>Повторить</button>
          <small>${esc(err && err.message ? err.message : String(err))}</small></div>`);
      });
  }

  function init() {
    const $ = id => document.getElementById(id);
    el = {
      hub: $('dlgHub'), levels: $('dlgLevels'),
      level: $('dlgLevel'), list: $('dlgList'),
      levelBadge: $('dlgLevelBadge'), levelTitle: $('dlgLevelTitle'), levelSub: $('dlgLevelSub'),
      view: $('dlgView'), counter: $('dlgCounter'), figure: $('dlgFigure'),
      levelChip: $('dlgLevelChip'), title: $('dlgTitle'), titleTr: $('dlgTitleTr'), situation: $('dlgSituation'),
      play: $('dlgPlay'), trToggle: $('dlgTrToggle'), tone: $('dlgTone'), voiceNote: $('dlgVoiceNote'),
      lines: $('dlgLines'), prev: $('dlgPrev'), next: $('dlgNext')
    };
    if (!el.hub || !el.view) return;
    el.playIco = el.play.querySelector('.dlg-play-ico');
    el.playLabel = el.play.querySelector('.dlg-play-label');

    const app = $('dlgApp');
    app.addEventListener('click', onClick);
    app.addEventListener('error', onImgError, true);   // error картинок не всплывает
    $('dlgToHub').addEventListener('click', up);
    $('dlgToLevel').addEventListener('click', up);
    el.play.addEventListener('click', togglePlay);
    el.prev.addEventListener('click', () => neighbour(-1));
    el.next.addEventListener('click', () => neighbour(1));
    el.trToggle.addEventListener('click', () => {
      writeStore(TR_KEY, trOn() ? '0' : '1');
      el.lines.querySelectorAll('.tr-open').forEach(li => li.classList.remove('tr-open'));
      paintTr();
    });
    el.tone.addEventListener('click', () => {
      writeStore(TONE_KEY, toneOn() ? '0' : '1');
      stopSpeech();
      paintVoiceNote();
    });
    paintTr();

    window.addEventListener('popstate', onPopState);
    // ушли со страницы или свернули приложение — замолкаем
    window.addEventListener('pagehide', stopSpeech);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });
    // голоса браузера приходят асинхронно — подпись обновляем
    try {
      if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener('voiceschanged', () => { if (playing === null) paintVoiceNote(); });
      }
    } catch (e) { /* старый движок */ }
    // SDK Telegram подгружается асинхронно (js/telegram.js)
    document.addEventListener('dm:tg-ready', syncTgBack);

    view = viewFromHash();
    setUrl(view, 'replace');
    show(view);
    load();
  }

  return {
    init, up, go, stop: stopSpeech,
    get view() { return view; }, get dialog() { return dialog; }, get playing() { return playing; },
    voicePlan, levels: LEVELS
  };
})();

document.addEventListener('DOMContentLoaded', () => Dialogs.init());
