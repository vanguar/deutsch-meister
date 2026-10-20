// E2E: раздел «Автошкола» (fahrschule.html). Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/fahrschule_flow.mjs
// Проверяет: плитку на главной и переход, список уроков, теорию (строки,
// знаки, подсказка над КАЖДЫМ словом, тултип и перевод предложения,
// «Слушать урок» по порядку, 🔊 строки, перевод), тест по знакам (верно,
// неверно, итог), диалог (реплики, стороны, озвучка), перекрёсток (выбор
// машин, неверный и верный порядок, машины едут, пояснение звучит,
// следующая сцена), навигацию «назад», телефон без горизонтальной
// прокрутки, светлую тему, языки uk и ar (перевод на своём языке, немецкий
// LTR, раздел не закрыт пробной версией), отсутствие ошибок в консоли.
// Озвучку подменяем заглушкой TTS.speak: проверяется очередь, а не звук.
import { start } from './cdp.mjs';
import { readFileSync } from 'fs';

const B = 'http://127.0.0.1:8765';
// уроки по порядку тем — из собранного оглавления
const IDX = JSON.parse(readFileSync(new URL('../../data/fahrschule/index.json', import.meta.url), 'utf8'));
const ORDER = IDX.topics.flatMap(t => t.units);
const c = await start(9335);
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 8000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

// Заглушка озвучки: каждая фраза «звучит» 60 мс, журнал — window.__said
const STUB = `(() => { window.__said = []; TTS.speak = (text, o) => { o = o || {};
  window.__said.push(text); clearTimeout(window.__sayT);
  if (o.onEnd) window.__sayT = setTimeout(() => o.onEnd({ ok: true, reason: 'end' }), 60); };
  TTS.stop = () => { clearTimeout(window.__sayT); }; return true; })()`;

// Каждый переход — новая загрузка страницы (язык и тема читаются при загрузке)
let nav = 0;
const _go = c.go;
c.go = (url, ms) => _go(url.replace(/(\.html)(#|$)/, `$1?n=${++nav}$2`), ms);

const NO_HSCROLL = `document.documentElement.scrollWidth <= window.innerWidth + 1`;
const allErrors = [];
const collect = () => allErrors.push(...c.errors());

async function setLang(lang) {
  await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: '${lang}', ts: Date.now() }))`);
}

async function openUnit(id) {
  await c.go(`${B}/fahrschule.html#u=${id}`, 600);
  ok(await waitFor(`typeof Fahrschule !== 'undefined' && Fahrschule.unit && Fahrschule.unit.id === '${id}' && document.querySelectorAll('.fs-w').length > 0`, 20000), `${id}: урок открыт`);
  await c.ev(STUB);
}

// В каждом немецком слове урока — подсказка: ключ слова ведёт к лемме и переводу
const TIP_AUDIT = `(() => { const g = Fahrschule.unit.gloss; const bad = [];
  document.querySelectorAll('.fs-w').forEach(w => { const lm = g.w[w.dataset.t];
    if (!lm || !g.l[lm] || !g.l[lm].ru) bad.push(w.textContent + '→' + w.dataset.t); });
  return JSON.stringify({ n: document.querySelectorAll('.fs-w').length, bad }); })()`;

// Первая загрузка в свежем профиле ждёт шрифты Google — даём время
await c.go(B + '/index.html', 800);
await c.ev(`localStorage.clear(); localStorage.setItem('dm_theme', 'dark')`);

// ── Главная: плитка «Автошкола» ──
await c.go(B + '/index.html', 800);
// плитка зовёт openFahrschulePage из js/support.js (подключён в конце страницы)
ok(await waitFor(`!!document.getElementById('readFahrschule') && typeof openFahrschulePage === 'function'`, 20000), 'главная: плитка «Автошкола» есть');
ok(await c.ev(`/Автошкола/.test(document.getElementById('readFahrschule').textContent)`), 'главная: подпись плитки');
// «Читать и слушать» — сетка 2×2: Книги | Автошкола, Новости | Диалоги
const grid = JSON.parse(await c.ev(`JSON.stringify(['readBooks', 'readFahrschule', 'readNews', 'readDialogs'].map(id => {
  const r = document.getElementById(id).getBoundingClientRect(); return { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width) }; }))`));
ok(grid[0].t === grid[1].t && grid[2].t === grid[3].t && grid[0].t < grid[2].t && grid[0].l < grid[1].l && grid[2].l < grid[3].l
  && new Set(grid.map(g => g.w)).size === 1, `главная: плитки 2×2 одинаковой ширины ${JSON.stringify(grid)}`);
await c.shot('fs_home_grid.png');
await c.ev(`document.getElementById('readFahrschule').click()`);
ok(await waitFor(`/fahrschule\\.html/.test(location.pathname)`, 8000), 'главная → fahrschule.html');
collect();

// ── Список уроков ──
await c.go(B + '/fahrschule.html', 600);
ok(await waitFor(`document.querySelectorAll('.fs-tile[data-unit]').length === ${ORDER.length}`, 20000), `все уроки на странице (${ORDER.length})`);
const hub = await c.ev(`[...document.querySelectorAll('.fs-tile[data-unit]')].map(t => t.dataset.unit).join(',')`);
ok(hub === ORDER.join(), `порядок по темам: ${hub}`);
ok(await c.ev(`document.querySelectorAll('.fs-soon').length === 1`), 'плитка «Скоро» с планами');
const topicsN = await c.ev(`Fahrschule.topics.length`);
ok(await c.ev(`document.querySelectorAll('.fs-topic').length === ${topicsN} && ${topicsN} >= 1`), `темы: ${topicsN} карточк(и) тем`);
ok(await c.ev(`Fahrschule.topics.every(t => [...document.querySelectorAll('.fs-topic[data-topic="' + t.id + '"] [data-unit]')].map(e => e.dataset.unit).join() === t.units.join())`),
  'в карточке каждой темы — её уроки по порядку');
ok(await c.ev(`(() => { const cs = getComputedStyle(document.querySelector('.fs-topic')); const hs = getComputedStyle(document.querySelector('.fs-topic-head'));
  return parseFloat(cs.borderTopWidth) >= 1 && cs.backgroundColor !== getComputedStyle(document.body).backgroundColor && hs.backgroundColor !== cs.backgroundColor; })()`),
  'тема выделена: рамка, свой фон и шапка-полоса');
// темы сворачиваются: при первом заходе раскрыта первая, у свёрнутых видно «Показать уроки» и стрелку
const topicState = () => c.ev(`JSON.stringify([...document.querySelectorAll('.fs-topic')].map(t => ({ id: t.dataset.topic,
  open: t.classList.contains('is-open'), aria: t.querySelector('[data-topic-toggle]').getAttribute('aria-expanded'),
  visible: [...t.querySelectorAll('[data-unit]')].some(x => x.offsetParent !== null),
  hint: t.querySelector('.fs-topic-hint').innerText.trim(), chev: getComputedStyle(t.querySelector('.fs-topic-chev'), '::before').content })))`).then(JSON.parse);
let ts = await topicState();
ok(ts[0].open && ts[0].visible && ts.slice(1).every(t => !t.open && !t.visible && t.aria === 'false'), `темы: раскрыта только первая (${ts.map(t => t.open ? 1 : 0).join('')})`);
ok(ts.slice(1).every(t => /Показать уроки/.test(t.hint) && t.chev.includes('▾')), 'свёрнутые темы: «Показать уроки» и стрелка ▾');
ok(/\d+\s+урок/.test(await c.ev(`document.querySelector('.fs-topic-count').innerText`)), 'в шапке темы — число уроков');
const t3 = ts[ts.length > 2 ? 2 : 1].id;
await c.ev(`document.querySelector('[data-topic-toggle="${t3}"]').click()`);
ts = await topicState();
let st3 = ts.find(t => t.id === t3);
ok(st3.open && st3.visible && st3.aria === 'true' && /Скрыть/.test(st3.hint), `тап по шапке раскрывает тему ${t3}: видны уроки, «Скрыть»`);
await c.shot('fs_hub_collapse.png');
await c.go(B + '/fahrschule.html', 600);
await waitFor(`document.querySelectorAll('.fs-topic').length > 0`, 20000);
ts = await topicState();
ok(ts.find(t => t.id === t3).open && ts[0].open, 'раскрытые темы запоминаются после перезагрузки');
await c.ev(`document.querySelector('[data-topic-toggle="${t3}"]').click()`);
ts = await topicState();
ok(!ts.find(t => t.id === t3).open && !ts.find(t => t.id === t3).visible, 'повторный тап сворачивает тему');
// из урока свёрнутой темы обратно — его тема раскрыта
const lastT = IDX.topics[IDX.topics.length - 1];
await c.ev(`Fahrschule.go({ name: 'unit', id: '${lastT.units[0]}' })`);
await waitFor(`Fahrschule.unit && Fahrschule.unit.id === '${lastT.units[0]}'`, 8000);
await c.ev(`history.back()`);
await waitFor(`!document.getElementById('fsHub').hidden && document.querySelectorAll('.fs-topic').length > 0`, 4000);
ok((await topicState()).find(t => t.id === lastT.id).open, 'после урока его тема раскрыта');
await c.ev(`localStorage.removeItem('dm_fs_open'); localStorage.removeItem('dm_fs_last')`);
await c.go(B + '/fahrschule.html', 600);
await waitFor(`document.querySelectorAll('.fs-topic').length > 0`, 20000);
// на списке первые уроки тем подгружаются в фоне
// не больше PREFETCH_MAX (6) уроков за раз — первые уроки первых шести тем
ok(await waitFor(`Fahrschule.topics.slice(0, 6).every(t => Fahrschule.cached.includes(t.units[0]))`, 8000), 'список: первые уроки тем подгружены в фоне');
ok(await c.ev(NO_HSCROLL), 'список: нет горизонтальной прокрутки (390)');
await c.shot('fs_hub_390.png');
await c.ev(`document.querySelector('.fs-tile[data-unit="t-01"]').click()`);
ok(await waitFor(`location.hash === '#u=t-01' && Fahrschule.unit && Fahrschule.unit.id === 't-01'`), 'плитка → #u=t-01');
// открытый урок сразу, соседи по теме — в фоне; переход к ним — без сети
ok(await waitFor(`['p-01', 'k-01'].every(id => Fahrschule.cached.includes(id))`, 8000), 'соседние уроки темы подгружены в фоне');
await c.send('Network.enable');
c.events.length = 0;
await c.ev(`Fahrschule.go({ name: 'unit', id: 'p-01' })`);
ok(await waitFor(`Fahrschule.unit && Fahrschule.unit.id === 'p-01' && document.querySelectorAll('.fs-dialog .dlg-line').length > 0`, 1500), 'следующий урок открылся сразу');
ok(!c.events.some(e => e.method === 'Network.requestWillBeSent' && /data\/fahrschule\/p-01\.json|fahrschule\/p-01\.json/.test(e.params.request.url)), 'при открытии подгруженного урока запроса в сеть нет');
await c.ev(`history.back()`);
await waitFor(`Fahrschule.unit && Fahrschule.unit.id === 't-01'`, 2000);
await c.ev(`history.back()`);
ok(await waitFor(`location.hash === '' && !document.getElementById('fsHub').hidden && document.getElementById('fsUnit').hidden`), '«назад» → список');
collect();

// ── Теория ──
await openUnit('t-01');
const th = JSON.parse(await c.ev(`JSON.stringify({
  lines: document.querySelectorAll('.fs-lines > .fs-line').length,
  want: Fahrschule.unit.sections.reduce((n, s) => n + s.lines.length, 0),
  signs: document.querySelectorAll('.fs-sign img').length,
  wantSigns: Fahrschule.unit.sections.reduce((n, s) => n + s.lines.filter(l => l.sign).length, 0),
  signsOk: [...document.querySelectorAll('.fs-sign img')].every(i => i.complete && i.naturalWidth > 0),
  hs: ${NO_HSCROLL} })`));
ok(th.lines === th.want && th.lines > 0, `теория: строк ${th.lines}`);
ok(th.signs === th.wantSigns && th.signs > 0 && th.signsOk, `теория: знаки загрузились (${th.signs})`);
ok(th.hs, 'теория: нет горизонтальной прокрутки');
const audit = JSON.parse(await c.ev(TIP_AUDIT));
ok(audit.n > 100 && audit.bad.length === 0, `теория: подсказка у каждого из ${audit.n} слов ${audit.bad.slice(0, 5).join(' ')}`);
await c.shot('fs_t01_390.png');

// тултип: слово → перевод, «Предложение» → перевод фразы
await c.ev(`document.querySelector('.fs-lines .fs-w[data-t="kreuzung"]').click()`);
ok(await waitFor(`ReaderTip.isOpen() && document.querySelector('.word-tip.word-tip-visible')`, 2000), 'тап по слову открывает подсказку');
const tip = await c.ev(`document.querySelector('.word-tip.word-tip-visible').textContent`);
ok(/перекрёсток/.test(tip) && /die Kreuzungen/.test(tip), `подсказка: перевод и мн. число (${tip.replace(/\s+/g, ' ').trim().slice(0, 80)})`);
await c.ev(`document.querySelector('.word-tip [data-act="sentence"]').click()`);
ok(await c.ev(`/На перекрёстке без светофора/.test(document.querySelector('.word-tip-sentence-ru').textContent)`), 'подсказка: перевод предложения');
await c.ev(`document.querySelector('.word-tip [data-act="speak-word"]').click()`);
ok(await waitFor(`window.__said.includes('Kreuzung')`, 2000), 'подсказка: 🔊 озвучивает слово');
await c.shot('fs_t01_tip.png');
await c.ev(`document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))`);
ok(await waitFor(`!ReaderTip.isOpen()`, 1000), 'тап мимо закрывает подсказку');
// мышь: подсказка при наведении, уходит с задержкой; щелчок озвучивает слово
if (await c.ev(`matchMedia('(hover: hover) and (pointer: fine)').matches`)) {
  await c.ev(`window.__said = []; document.querySelector('.fs-lines .fs-w[data-t="ampel"]').dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))`);
  ok(await waitFor(`ReaderTip.isOpen() && /светофор/.test(document.querySelector('.word-tip.word-tip-visible').textContent)`, 1000), 'мышь: подсказка при наведении');
  await c.ev(`document.querySelector('.fs-lines .fs-w[data-t="ampel"]').dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget: document.body }))`);
  ok(await waitFor(`!ReaderTip.isOpen()`, 1500), 'мышь: увели — подсказка закрылась');
  await c.ev(`(() => { const w = document.querySelector('.fs-lines .fs-w[data-t="ampel"]'); w.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' })); w.click() })()`);
  ok(await waitFor(`window.__said.includes('Ampel') && ReaderTip.isOpen()`, 1500), 'мышь: щелчок озвучивает слово, подсказка остаётся');
  await c.ev(`ReaderTip.close()`);
}
// палец: тап открывает, повторный тап закрывает
await c.ev(`(() => { const w = document.querySelector('.fs-lines .fs-w[data-t="links"]'); w.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' })); w.click() })()`);
ok(await waitFor(`ReaderTip.isOpen()`, 1000), 'палец: тап открывает подсказку');
await c.ev(`(() => { const w = document.querySelector('.fs-lines .fs-w[data-t="links"]'); w.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' })); w.click() })()`);
ok(await waitFor(`!ReaderTip.isOpen()`, 1000), 'палец: повторный тап закрывает');

// «Слушать урок»: все правила по порядку, подсветка
await c.ev(`window.__said = []; document.querySelector('[data-play="all"]').click()`);
ok(await waitFor(`document.querySelector('.fs-line.is-speaking') !== null`, 2000), 'подсветка звучащей строки');
ok(await waitFor(`Fahrschule.playing === null`, 15000), 'урок дочитан до конца');
const saidT = JSON.parse(await c.ev(`JSON.stringify(window.__said)`));
const wantT = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.sections.flatMap(s => s.lines.map(l => l.de)))`));
ok(saidT.join('|') === wantT.join('|'), `озвучены все ${wantT.length} правил по порядку`);
// 🔊 одной строки и стоп
await c.ev(`window.__said = []; document.querySelectorAll('.fs-lines [data-say]')[2].click()`);
ok(await waitFor(`window.__said.length === 1`, 2000) && (await c.ev(`window.__said[0]`)) === wantT[2], '🔊 строки озвучивает её');
// перевод
ok(await c.ev(`getComputedStyle(document.querySelector('.fs-lines .fs-tr')).display === 'none'`), 'перевод по умолчанию скрыт');
await c.ev(`document.querySelector('[data-tr-toggle]').click()`);
ok(await c.ev(`getComputedStyle(document.querySelector('.fs-lines .fs-tr')).display !== 'none' && localStorage.getItem('dm_fs_tr') === '1'`), '🌐 показывает перевод и запоминает');
await c.ev(`document.querySelector('[data-tr-toggle]').click()`);

// 🌐 у строки: перевод этой фразы, повторно — скрыть
await c.ev(`document.querySelectorAll('.fs-lines [data-tr-line]')[1].click()`);
ok(await c.ev(`(() => { const li = document.querySelectorAll('.fs-lines > .fs-line')[1];
  return getComputedStyle(li.querySelector('.fs-tr')).display !== 'none' && li.querySelector('[data-tr-line]').getAttribute('aria-pressed') === 'true'
    && getComputedStyle(document.querySelectorAll('.fs-lines > .fs-line')[0].querySelector('.fs-tr')).display === 'none'; })()`), '🌐 у строки открывает перевод только этой фразы');
await c.ev(`document.querySelectorAll('.fs-lines [data-tr-line]')[1].click()`);
ok(await c.ev(`getComputedStyle(document.querySelectorAll('.fs-lines > .fs-line')[1].querySelector('.fs-tr')).display === 'none'`), '🌐 повторно скрывает перевод');
// тест: перевод вопроса и вариантов до ответа (🌐 в карточке)
ok(await c.ev(`getComputedStyle(document.querySelector('#fsQuiz .fs-opt-tr')).display === 'none'`), 'тест: перевод вариантов по умолчанию скрыт');
await c.ev(`document.querySelector('#fsQuiz [data-tr-line]').click()`);
ok(await c.ev(`[...document.querySelectorAll('#fsQuiz .fs-opt-tr, #fsQuiz .fs-quiz-q-tr')].every(e => getComputedStyle(e).display !== 'none' && e.textContent.trim())
  && !document.querySelector('#fsQuiz .fs-opt:disabled')`), 'тест: 🌐 показывает перевод вопроса и вариантов, не отвечая');
await c.shot('fs_quiz_tr.png');
await c.ev(`document.querySelector('#fsQuiz [data-tr-line]').click()`);
ok(await c.ev(`getComputedStyle(document.querySelector('#fsQuiz .fs-opt-tr')).display === 'none'`), 'тест: 🌐 повторно скрывает перевод');
// тест: 1-й вопрос неверно, остальные верно → 4 из 5
const quizN = await c.ev(`Fahrschule.unit.quiz.length`);
for (let i = 0; i < quizN; i++) {
  const q = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.quiz[${i}])`));
  ok(await waitFor(`document.querySelectorAll('#fsQuiz [data-opt]').length === 3 && document.querySelector('#fsQuiz .fs-quiz-n').textContent === '${i + 1} / ${quizN}'`, 3000), `тест ${i + 1}: три варианта`);
  const pick = i === 0 ? q.wrong[0] : q.sign;
  await c.ev(`window.__said = []; document.querySelector('#fsQuiz [data-opt="${pick}"]').click()`);
  const v = JSON.parse(await c.ev(`JSON.stringify({
    right: !!document.querySelector('#fsQuiz .fs-verdict.is-right'), wrong: !!document.querySelector('#fsQuiz .fs-verdict.is-wrong'),
    marked: document.querySelector('#fsQuiz .fs-opt.is-right').dataset.opt, disabled: [...document.querySelectorAll('#fsQuiz .fs-opt')].every(b => b.disabled),
    tr: [...document.querySelectorAll('#fsQuiz .fs-opt-tr')].filter(e => getComputedStyle(e).display !== 'none').length, explain: !!document.querySelector('#fsQuiz .fs-explain-one .fs-w') })`));
  ok((i === 0 ? v.wrong : v.right) && v.marked === q.sign && v.disabled && v.tr === 3 && v.explain,
    `тест ${i + 1}: ${i === 0 ? 'неверный ответ отмечен' : 'верно'}, правильный подсвечен, перевод и пояснение`);
  ok(await waitFor(`window.__said[0] === Fahrschule.unit.signs['${q.sign}'].de`, 2000), `тест ${i + 1}: название знака озвучено`);
  if (i === 1) await c.shot('fs_quiz.png');
  await c.ev(`document.querySelector('#fsQuiz [data-quiz-next]').click()`);
}
ok(await waitFor(`/4\\s*из\\s*5/.test(document.querySelector('#fsQuiz .fs-result-text').textContent)`, 2000), 'тест: итог 4 из 5');
await c.ev(`document.querySelector('#fsQuiz [data-quiz-restart]').click()`);
ok(await c.ev(`Fahrschule.quiz.i === 0 && Fahrschule.quiz.score === 0`), 'тест: «Пройти ещё раз» начинает заново');
collect();

// ── Остальные уроки теории: знаки, подсказки, тест целиком ──
for (const id of IDX.units.filter(u => u.kind === 'theory' && u.id !== 't-01').map(u => u.id)) {
  await openUnit(id);
  await c.wait(800);   // картинки знаков
  const tv = JSON.parse(await c.ev(`JSON.stringify({
    lines: document.querySelectorAll('.fs-lines > .fs-line').length,
    want: Fahrschule.unit.sections.reduce((n, s) => n + s.lines.length, 0),
    signs: [...document.querySelectorAll('.fs-sign img')].map(i => i.complete && i.naturalWidth > 0),
    nums: [...document.querySelectorAll('.fs-sign-n')].map(e => e.textContent), hs: ${NO_HSCROLL} })`));
  ok(tv.lines === tv.want && tv.lines > 0, `${id}: строк ${tv.lines}`);
  ok(tv.signs.every(Boolean), `${id}: все ${tv.signs.length} знаков загрузились`);
  ok(tv.nums.every(n => /^Zeichen \d{3}([.-]\d+)?$/.test(n)), `${id}: номера знаков (${[...new Set(tv.nums)].join(', ')})`);
  ok(tv.hs, `${id}: нет горизонтальной прокрутки`);
  const au = JSON.parse(await c.ev(TIP_AUDIT));
  ok(au.bad.length === 0, `${id}: подсказка у каждого из ${au.n} слов ${au.bad.slice(0, 5).join(' ')}`);
  // теория без знаков (алкоголь, усталость…) — без теста
  const qn = await c.ev(`(Fahrschule.unit.quiz || []).length`);
  for (let i = 0; i < qn; i++) {
    await waitFor(`document.querySelectorAll('#fsQuiz [data-opt]').length === 3 && document.querySelector('#fsQuiz .fs-quiz-n').textContent === '${i + 1} / ${qn}'`, 3000);
    await c.ev(`document.querySelector('#fsQuiz [data-opt="' + Fahrschule.unit.quiz[${i}].sign + '"]').click()`);
    ok(await c.ev(`!!document.querySelector('#fsQuiz .fs-verdict.is-right') && !!document.querySelector('#fsQuiz .fs-explain-one .fs-w')`), `${id} тест ${i + 1}: верно, есть пояснение`);
    await c.ev(`ReaderSpeak.stop(); document.querySelector('#fsQuiz [data-quiz-next]').click()`);
  }
  if (qn) {
    ok(await waitFor(`!!document.querySelector('#fsQuiz .fs-result-text')`, 2000)
      && (await c.ev(`document.querySelector('#fsQuiz .fs-result-text').textContent`)).includes(`${qn} из ${qn}`), `${id}: тест ${qn} из ${qn}`);
  } else {
    ok(await c.ev(`!document.getElementById('fsQuiz')`), `${id}: без знаков — без теста`);
  }
  await c.ev(`document.querySelector('.fs-sec').scrollIntoView()`);
  await c.shot(`fs_${id}_390.png`);
  collect();
}

// ── Диалог ──
await openUnit('p-01');
const dl = JSON.parse(await c.ev(`JSON.stringify({
  lines: document.querySelectorAll('.fs-dialog .dlg-line').length, want: Fahrschule.unit.lines.length,
  sides: [...document.querySelectorAll('.fs-dialog .dlg-line')].map(l => l.classList.contains('side-a') ? 'a' : 'b').join(''),
  hs: ${NO_HSCROLL} })`));
ok(dl.lines === dl.want && dl.lines >= 8, `диалог: реплик ${dl.lines}`);
ok(!/aa|bb/.test(dl.sides), 'диалог: реплики чередуются по сторонам');
ok(dl.hs, 'диалог: нет горизонтальной прокрутки');
const auditD = JSON.parse(await c.ev(TIP_AUDIT));
ok(auditD.bad.length === 0, `диалог: подсказка у каждого из ${auditD.n} слов ${auditD.bad.slice(0, 5).join(' ')}`);
// значение в строке: «Stellen Sie … ein» → einstellen, «ein» в «ein bisschen» — артикль
ok(await c.ev(`Fahrschule.unit.gloss.w[document.querySelectorAll('.fs-dialog .dlg-line')[2].querySelector('.fs-w[data-t^="ein"]:last-child, .fs-w[data-t="ein>einstellen"]').dataset.t] === 'einstellen'`), 'отделяемая приставка: Stellen … ein → einstellen');
ok(await c.ev(`[...document.querySelectorAll('.fs-dialog .dlg-line')[1].querySelectorAll('.fs-w')].find(w => w.textContent === 'ein').dataset.t === 'ein'`), '«ein bisschen» — общее значение (артикль)');
await c.ev(`document.querySelectorAll('.fs-dialog .dlg-line')[2].querySelector('.fs-w[data-t="ein>einstellen"]').click()`);
ok(await waitFor(`/регулировать/.test((document.querySelector('.word-tip.word-tip-visible') || {}).textContent || '')`, 2000), 'подсказка над «ein» — «регулировать»');
await c.ev(`ReaderTip.close()`);
await c.ev(`window.__said = []; document.querySelector('[data-play="all"]').click()`);
ok(await waitFor(`Fahrschule.playing === null && window.__said.length > 0`, 15000), 'диалог доигран до конца');
const saidD = JSON.parse(await c.ev(`JSON.stringify(window.__said)`));
const wantD = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.lines.map(l => l.de))`));
ok(saidD.join('|') === wantD.join('|'), `озвучены все ${wantD.length} реплик по порядку`);
// тап по реплике (не по слову) открывает её перевод
await c.ev(`document.querySelectorAll('.fs-dialog .dlg-who')[0].click()`);
ok(await c.ev(`getComputedStyle(document.querySelector('.fs-dialog .dlg-line .dlg-tr')).display !== 'none'`), 'тап по реплике открывает перевод');
await c.shot('fs_p01_390.png');
collect();

// ── Остальные диалоги: подсказки, стороны, озвучка ──
for (const id of IDX.units.filter(u => u.kind === 'dialog' && u.id !== 'p-01').map(u => u.id)) {
  await openUnit(id);
  const dv = JSON.parse(await c.ev(`JSON.stringify({ n: document.querySelectorAll('.fs-dialog .dlg-line').length, want: Fahrschule.unit.lines.length,
    sides: [...document.querySelectorAll('.fs-dialog .dlg-line')].map(l => l.classList.contains('side-a') ? 'a' : 'b').join(''), hs: ${NO_HSCROLL} })`));
  ok(dv.n === dv.want && !/aa|bb/.test(dv.sides) && dv.hs, `${id}: реплик ${dv.n}, стороны чередуются, без прокрутки вбок`);
  const ad = JSON.parse(await c.ev(TIP_AUDIT));
  ok(ad.bad.length === 0, `${id}: подсказка у каждого из ${ad.n} слов ${ad.bad.slice(0, 5).join(' ')}`);
  await c.ev(`window.__said = []; document.querySelector('[data-play="all"]').click()`);
  ok(await waitFor(`Fahrschule.playing === null && window.__said.length > 0`, 15000)
    && (await c.ev(`window.__said.join('|') === Fahrschule.unit.lines.map(l => l.de).join('|')`)), `${id}: озвучены все реплики по порядку`);
  collect();
}
// отделяемые глаголы в строке: подсказка — целый глагол, а «an der Ampel» — предлог
if (IDX.units.some(u => u.id === 'p-02')) {
  await openUnit('p-02');
  const sep = JSON.parse(await c.ev(`(() => { const g = Fahrschule.unit.gloss; const lm = w => g.w[w.dataset.t];
    const lines = [...document.querySelectorAll('.fs-dialog .dlg-line')];
    const find = (k, word) => [...lines[k].querySelectorAll('.fs-w')].filter(w => w.textContent === word).map(lm);
    return JSON.stringify({ halte: find(13, 'halte'), an13: find(13, 'an'), los: find(13, 'los'), bleibe: find(7, 'bleibe'),
      an11: find(11, 'an'), durch: find(0, 'durch') }); })()`));
  ok(sep.halte[0] === 'anhalten' && sep.an13[0] === 'anhalten' && sep.los[0] === 'losfahren' && sep.bleibe[0] === 'stehen bleiben',
    `p-02: halte…an → anhalten, fahre…los → losfahren, bleibe…stehen → stehen bleiben`);
  ok(sep.an11[0] === 'an' && sep.durch[0] === 'durch', 'p-02: «an der Ampel», «durch die Stadt» — предлоги');
  collect();
}

// ── Перекрёсток ──
await openUnit('k-01');
const scenes = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.scenes.map(s => ({ cars: s.cars.map(c => c.id), order: s.order })))`));
for (let i = 0; i < scenes.length; i++) {
  const sc = scenes[i];
  ok(await waitFor(`Fahrschule.scene && Fahrschule.scene.i === ${i} && document.querySelectorAll('#fsScene .fs-car').length === ${sc.cars.length}`, 4000), `сцена ${i + 1}: машин ${sc.cars.length}`);
  ok(await c.ev(`document.querySelector('.fs-scene-n').textContent === '${i + 1} / ${scenes.length}'`), `сцена ${i + 1}: счётчик`);
  const auditK = JSON.parse(await c.ev(TIP_AUDIT));
  ok(auditK.bad.length === 0, `сцена ${i + 1}: подсказки у всех слов`);
  if (i === 0) {
    // выбор и снятие машины
    await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${sc.cars[0]}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
    ok(await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${sc.cars[0]}"] .fs-badge text').textContent === '1'`), 'сцена 1: у выбранной машины номер 1');
    await c.ev(`document.querySelector('[data-scene-reset]').click()`);
    ok(await c.ev(`Fahrschule.scene.pick.length === 0 && document.querySelector('#fsScene .fs-badge text').textContent === '?'`), 'сцена 1: «Сбросить»');
    // неверный порядок
    const wrong = sc.order.slice().reverse();
    await c.ev(`window.__said = []`);
    for (const id of wrong) await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${id}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
    ok(await waitFor(`document.querySelector('#fsScene .fs-svg.is-driving')`, 1000), 'сцена 1: машины поехали');
    const before = await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${sc.order[0]}"] .fs-car-body').getAttribute('transform')`);
    await c.wait(700);
    const mid = await c.ev(`(document.querySelector('#fsScene .fs-car[data-car="${sc.order[0]}"] .fs-car-body') || {}).getAttribute?.('transform')`);
    ok(before !== mid, `сцена 1: первая машина движется (${before} → ${mid})`);
    ok(await waitFor(`document.querySelector('#fsStatus.is-wrong') && document.querySelectorAll('.fs-explain .fs-line').length > 0`, 8000), 'сцена 1: неверный порядок — «не совсем» и пояснение');
    ok(await c.ev(`[...document.querySelectorAll('#fsScene .fs-car')].map(g => g.dataset.car + g.querySelector('.fs-badge text').textContent).sort().join() === ${JSON.stringify(sc.order.map((id, k) => id + (k + 1)).sort().join())}`), 'сцена 1: на машинах правильный порядок');
    ok(await waitFor(`Fahrschule.playing === null && window.__said.length > 0`, 8000), 'сцена 1: пояснение прозвучало');
    const wantE = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.scenes[0].explain.map(e => e.de))`));
    ok((await c.ev(`window.__said.join('|')`)) === wantE.join('|'), 'сцена 1: пояснение по порядку');
    await c.shot('fs_k01_wrong.png');
    await c.ev(`document.querySelector('[data-scene-again]').click()`);
    ok(await c.ev(`!Fahrschule.scene.done && Fahrschule.scene.pick.length === 0 && !document.querySelector('.fs-explain')`), 'сцена 1: «Ещё раз»');
  }
  // верный порядок
  for (const id of sc.order) await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${id}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
  ok(await waitFor(`document.querySelector('#fsStatus.is-right') && document.querySelectorAll('.fs-explain .fs-line').length > 0`, 9000), `сцена ${i + 1}: верный порядок принят`);
  ok(await c.ev(NO_HSCROLL), `сцена ${i + 1}: нет горизонтальной прокрутки`);
  if (i === 1) await c.shot('fs_k01_signs.png');
  if (i < scenes.length - 1) {
    await c.ev(`ReaderSpeak.stop(); document.querySelector('[data-scene-next]').click()`);
  } else {
    ok(await c.ev(`!document.querySelector('[data-scene-next]')`), 'последняя сцена: «Следующей» нет');
  }
}
// уход со страницы останавливает озвучку (сначала дожидаемся автоозвучки пояснения)
ok(await waitFor(`Fahrschule.playing === null`, 8000), 'пояснение последней сцены прозвучало');
await c.ev(`window.__said = []; document.querySelector('[data-play="explain"]').click()`);
ok(await waitFor(`Fahrschule.playing === 'explain'`, 1000), 'пояснение можно переслушать');
await c.ev(`document.getElementById('fsToHub').click()`);
ok(await waitFor(`Fahrschule.playing === null && !document.getElementById('fsHub').hidden`, 2000), '«← Все уроки» останавливает озвучку');
collect();

// ── Перекрёсток со светофором: сигналы, табличка Grünpfeil, смена сигнала ──
await openUnit('k-02');
const lsc = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.scenes.map(s => ({ order: s.order, lights: s.lights, k: s.switchAt, signs: s.signs })))`));
for (let i = 0; i < lsc.length; i++) {
  const sc = lsc[i];
  ok(await waitFor(`Fahrschule.scene && Fahrschule.scene.i === ${i} && document.querySelectorAll('#fsScene .fs-car').length === ${sc.order.length}`, 4000), `светофор, сцена ${i + 1}: открыта`);
  const states = JSON.parse(await c.ev(`JSON.stringify(Object.fromEntries([...document.querySelectorAll('#fsScene .fs-light')].map(g => [g.dataset.light, g.getAttribute('class').replace('fs-light state-', '')])))`));
  ok(JSON.stringify(Object.keys(states).sort()) === '["E","N","S","W"]' && Object.entries(sc.lights).every(([a, v]) => states[a] === v), `светофор, сцена ${i + 1}: сигналы ${JSON.stringify(states)}`);
  for (const [a, sid] of Object.entries(sc.signs)) {
    ok(await c.ev(`[...document.querySelectorAll('#fsScene image')].some(im => /${sid}\.svg/.test(im.getAttribute('href')))`), `светофор, сцена ${i + 1}: табличка ${sid} у подъезда ${a}`);
  }
  const auditL = JSON.parse(await c.ev(TIP_AUDIT));
  ok(auditL.bad.length === 0, `светофор, сцена ${i + 1}: подсказки у всех слов`);
  const redSide = Object.keys(sc.lights).find(a => sc.lights[a] === 'red');
  const greenSide = Object.keys(sc.lights).find(a => sc.lights[a] === 'green');
  for (const id of sc.order) await c.ev(`document.querySelector('#fsScene .fs-car[data-car="${id}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
  // смена сигнала по-немецки: зелёный → жёлтый; красный → красный+жёлтый → зелёный
  ok(await waitFor(`!!document.querySelector('#fsScene .fs-light[data-light="${greenSide}"].state-yellow')`, 9000), `светофор, сцена ${i + 1}: зелёный сменился на жёлтый`);
  ok(await waitFor(`!!document.querySelector('#fsScene .fs-light[data-light="${redSide}"].state-redyellow')`, 3000), `светофор, сцена ${i + 1}: у поперечных красный+жёлтый`);
  if (i === 2) await c.shot('fs_k02_switch.png');
  ok(await waitFor(`!!document.querySelector('#fsScene .fs-light[data-light="${redSide}"].state-green')`, 3000), `светофор, сцена ${i + 1}: затем зелёный`);
  ok(await waitFor(`document.querySelector('#fsStatus.is-right') && document.querySelectorAll('.fs-explain .fs-line').length > 0`, 12000), `светофор, сцена ${i + 1}: верный порядок принят, пояснение`);
  if (i === 2) await c.shot('fs_k02_done.png');
  if (i < lsc.length - 1) await c.ev(`ReaderSpeak.stop(); document.querySelector('[data-scene-next]').click()`);
}
collect();

// ── На дороге: остановочный путь, дистанция, обгон, велосипедист, «молния» ──
for (const id of IDX.units.filter(u => u.kind === 'road').map(u => u.id)) {
  await openUnit(id);
  const rs = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.scenes)`));
  for (let i = 0; i < rs.length; i++) {
    const sc = rs[i];
    const keys = sc.options.map(o => typeof o === 'object' ? o.key : String(o));
    const answer = String(sc.answer);
    const tag = `${id} сцена ${i + 1} (${sc.type})`;
    ok(await waitFor(`Fahrschule.scene && Fahrschule.scene.i === ${i} && document.querySelectorAll('[data-road-opt]').length === ${keys.length}`, 4000), `${tag}: варианты на месте`);
    const au = JSON.parse(await c.ev(TIP_AUDIT));
    ok(au.bad.length === 0, `${tag}: подсказки у всех слов ${au.bad.slice(0, 4).join(' ')}`);
    ok(await c.ev(NO_HSCROLL), `${tag}: нет горизонтальной прокрутки`);
    if (i === 0) {
      // 🌐 у ситуации — перевод ситуации, вопроса и вариантов сразу; повторно — скрыть
      const tr = () => c.ev(`[document.querySelector('.fs-situation .fs-tr'), document.querySelector('.fs-junction > .fs-quiz-q-tr'), ...document.querySelectorAll('.fs-road-opt .fs-opt-tr')]
        .map(e => getComputedStyle(e).display !== 'none').join()`);
      await c.ev(`document.querySelector('.fs-situation [data-tr-line]').click()`);
      ok(!(await tr()).includes('false'), `${tag}: 🌐 переводит ситуацию, вопрос и варианты`);
      await c.ev(`document.querySelector('.fs-situation [data-tr-line]').click()`);
      ok(!(await tr()).includes('true'), `${tag}: повторный 🌐 скрывает перевод`);
    }
    // первая сцена урока — сначала неверный ответ, потом «Ещё раз» и верный
    const picks = i === 0 ? [keys.find(k => k !== answer), answer] : [answer];
    for (const [k, key] of picks.entries()) {
      await c.ev(`window.__said = []; document.querySelector('[data-road-opt="${key}"]').click()`);
      const right = key === answer;
      ok(await c.ev(`!!document.querySelector('#fsStatus.${right ? 'is-right' : 'is-wrong'}') && document.querySelector('[data-road-opt="${answer}"]').classList.contains('is-right') && [...document.querySelectorAll('[data-road-opt]')].every(b => b.disabled)`),
        `${tag}: ${right ? 'верный' : 'неверный'} ответ «${key}» отмечен, верный подсвечен`);
      if (sc.type === 'stop') {
        ok(await waitFor(`parseFloat(document.querySelector('#fsScene .fs-zone-r').getAttribute('width')) > 0`, 2500), `${tag}: путь реакции растёт`);
        ok(await waitFor(`parseFloat(document.querySelector('#fsScene .fs-zone-b').getAttribute('width')) > 0 && document.querySelector('#fsScene .fs-road-car.is-braking')`, 3000), `${tag}: торможение, стоп-сигналы`);
        if (i === 0 && k === 1) await c.shot(`fs_${id}_brake.png`);
      } else if (sc.type === 'gap') {
        const p0 = await c.ev(`document.querySelector('#fsScene .fs-posts').getAttribute('transform') || ''`);
        await c.wait(500);
        ok(p0 !== await c.ev(`document.querySelector('#fsScene .fs-posts').getAttribute('transform') || ''`), `${tag}: столбики едут мимо`);
      } else {
        // участники сцены двигаются; при обгоне и «молнии» мигает поворотник
        const p0 = await c.ev(`document.querySelector('#fsScene [data-actor="me"]').getAttribute('transform')`);
        await c.wait(900);
        ok(p0 !== await c.ev(`document.querySelector('#fsScene [data-actor="me"]').getAttribute('transform')`), `${tag}: машина едет`);
        if (sc.type === 'zipper' || (sc.type === 'overtake' && answer === 'yes') || sc.type === 'side') {
          ok(await waitFor(`!!document.querySelector('#fsScene .fs-actor.is-blink-l')`, 3000), `${tag}: левый поворотник`);
        }
        if (sc.oncoming) ok(await c.ev(`!!document.querySelector('#fsScene [data-actor="oncoming"]')`), `${tag}: встречная машина`);
        if (sc.line === 'solid') ok(await c.ev(`!!document.querySelector('#fsScene .fs-mark.is-solid')`), `${tag}: сплошная линия`);
        if (sc.type === 'rightturn') {
          ok(await waitFor(`!!document.querySelector('#fsScene [data-actor="me"].is-blink-r')`, 3000), `${tag}: правый поворотник`);
          ok(await waitFor(`document.querySelector('#fsScene [data-actor="me"]').getAttribute('transform').includes('rotate(') && !document.querySelector('#fsScene [data-actor="me"]').getAttribute('transform').includes('rotate(-')`, 6000), `${tag}: машина поворачивает направо`);
        }
        if (sc.type === 'zebracross') {
          const p0 = await c.ev(`document.querySelector('#fsScene [data-actor="ped"]').getAttribute('transform')`);
          await c.wait(1500);
          ok(p0 !== await c.ev(`document.querySelector('#fsScene [data-actor="ped"]').getAttribute('transform')`), `${tag}: пешеход переходит`);
        }
        if (sc.type === 'bus') {
          ok(await c.ev(`(() => { const b = document.querySelector('#fsScene [data-actor="bus"]'); return b.classList.contains('is-blink-l') && b.classList.contains('is-blink-r'); })()`), `${tag}: у автобуса аварийка`);
        }
        if (sc.type === 'parallel') {
          ok(await waitFor(`document.querySelector('#fsScene [data-actor="me"]').getAttribute('transform').includes('rotate(-')`, 4000), `${tag}: заезд задним ходом под углом`);
        }
        if (i === 1 && k === picks.length - 1) await c.shot(`fs_${id}_overtake.png`);
      }
      ok(await waitFor(`document.querySelectorAll('.fs-explain .fs-line').length === ${sc.explain.length}`, 8000), `${tag}: пояснение`);
      if (sc.type === 'parkspot') {
        const labs = await c.ev(`[...document.querySelectorAll('#fsScene .fs-lab-text')].map(t => t.textContent).join(' | ')`);
        ok(labs.includes(`${sc.limit} m`) && labs.includes(`${sc.dist} m`) && await c.ev(`!!document.querySelector('#fsScene .fs-lab.is-on .fs-noparking')`),
          `${tag}: запретная зона ${sc.limit} m и расстояние ${sc.dist} m (${labs})`);
        if (k === picks.length - 1) await c.shot(`fs_${id}_park${i + 1}.png`);
      }
      if (sc.type === 'parallel') await c.shot(`fs_${id}_parallel.png`);
      if (['stop', 'gap', 'side'].includes(sc.type)) {
        const labs = await c.ev(`[...document.querySelectorAll('#fsScene .fs-lab-text')].map(t => t.textContent).join(' | ')`);
        const m = v => String(v).replace('.', ',') + ' m';
        const want = sc.type === 'stop' ? [m(sc.reaction), m(sc.brake), '= ' + m(sc.answer)] : [m(sc.answer)];
        ok(want.every(w => labs.includes(w)) && await c.ev(`!!document.querySelector('#fsScene .fs-lab.is-on')`), `${tag}: на картинке ${labs}`);
      }
      if (typeof sc.options[0] === 'object') {
        ok(await c.ev(`[...document.querySelectorAll('.fs-road-opt .fs-opt-tr')].every(e => getComputedStyle(e).display !== 'none' && e.textContent.trim())`), `${tag}: после ответа виден перевод вариантов`);
      }
      ok(await waitFor(`Fahrschule.playing === null && window.__said.length === ${sc.explain.length}`, 8000), `${tag}: пояснение прозвучало`);
      if (sc.type === 'side' || sc.type === 'zipper') await c.shot(`fs_${id}_${sc.type}.png`);
      if (sc.type === 'gap') await c.shot(`fs_${id}_gap.png`);
      if (k < picks.length - 1) await c.ev(`document.querySelector('[data-scene-again]').click()`);
    }
    if (i < rs.length - 1) await c.ev(`ReaderSpeak.stop(); document.querySelector('[data-scene-next]').click()`);
  }
  collect();
}

// ── Светлая тема ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
await openUnit('k-01');
await c.ev(`window.scrollTo(0, 250)`);
await c.shot('fs_k01_light.png');
await openUnit('t-01');
await c.shot('fs_t01_light.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);
collect();

// ── Языки ──
for (const lang of ['uk', 'ar']) {
  await setLang(lang);
  await c.go(B + '/fahrschule.html', 600);
  ok(await waitFor(`document.querySelectorAll('.fs-tile[data-unit]').length === ${ORDER.length}`, 20000), `${lang}: список уроков`);
  ok(await c.ev(`!document.querySelector('.ar-trial')`), `${lang}: раздел открыт без плашек пробной версии`);
  if (lang === 'ar') ok(await c.ev(`document.documentElement.dir === 'rtl'`), 'ar: интерфейс RTL');
  for (const id of ORDER) {
    await openUnit(id);
    const r = JSON.parse(await c.ev(`JSON.stringify({
      tr: [...document.querySelectorAll('.fs-tr, .dlg-title-tr, .dlg-situation')].map(e => e.textContent).join(' '),
      ui: document.body.innerText,
      de: [...document.querySelectorAll('.fs-s')].every(e => e.dir === 'ltr' && getComputedStyle(e).direction === 'ltr'),
      hs: ${NO_HSCROLL} })`));
    if (lang === 'uk') {
      ok(!/[ыэъё]/i.test(r.tr) && /[іїєґ]/i.test(r.tr), `uk ${id}: перевод украинский`);
      ok(!/[ыэъё]/i.test(r.ui), `uk ${id}: интерфейс без русских букв`);
    } else {
      ok(/[؀-ۿ]/.test(r.tr) && !/[А-Яа-яЁё]/.test(r.tr), `ar ${id}: перевод арабский`);
      ok(!/[А-Яа-яЁё]/.test(r.ui), `ar ${id}: на странице нет кириллицы`);
    }
    ok(r.de, `${lang} ${id}: немецкий текст LTR`);
    ok(r.hs, `${lang} ${id}: нет горизонтальной прокрутки`);
    // подсказка над первым существительным урока: перевод из копии этого языка
    const tw = JSON.parse(await c.ev(`(() => { const g = Fahrschule.unit.gloss;
      const w = [...document.querySelectorAll('#fsBody .fs-w')].find(x => { const e = g.l[g.w[x.dataset.t]]; return e && e.decl; });
      if (!w) return 'null'; w.click(); const e = g.l[g.w[w.dataset.t]];
      return JSON.stringify({ word: w.textContent, want: e.ru, tip: (document.querySelector('.word-tip.word-tip-visible .word-tip-ru') || {}).textContent || '' }); })()`));
    ok(tw && tw.tip === tw.want && (lang === 'uk' ? /[А-Яа-яІіЇїЄєҐґ]/.test(tw.tip) && !/[ыэъё]/i.test(tw.tip) : /[؀-ۿ]/.test(tw.tip)),
      `${lang} ${id}: подсказка на своём языке (${tw && tw.word} → ${tw && tw.tip})`);
    await c.ev(`ReaderTip.close()`);
    if (id === 'k-01') await c.shot(`fs_k01_${lang}.png`);
    if (id === 't-01') await c.shot(`fs_t01_${lang}.png`);
  }
  // плитка на главной не закрыта
  await c.go(B + '/index.html', 600);
  ok(await waitFor(`!!document.getElementById('readFahrschule')`, 15000), `${lang}: плитка на главной`);
  ok(await c.ev(`!document.getElementById('readFahrschule').classList.contains('ar-soon') && !/[А-Яа-яЁё]{3}/.test(document.getElementById('readFahrschule').textContent) === ${lang === 'ar'}`), `${lang}: плитка открыта и переведена`);
  collect();
}
await setLang('ru');

ok(allErrors.length === 0, `нет ошибок в консоли ${allErrors.slice(0, 3).join(' | ')}`);
c.close();
console.log(fail ? `\nFAIL: ${fail}` : '\nfahrschule_flow: всё ок');
process.exit(fail ? 1 : 0);
