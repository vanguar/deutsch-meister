// E2E: пробный экзамен «Автошколы» (fahrschule.html#u=x-01). Нужны Chrome и
// статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/fahrschule_exam_flow.mjs
// Проверяет: карточку экзамена в списке, вступление и правила, билет из
// 30 вопросов (10 знаков + 20 ситуаций, без повторов), что во время
// экзамена правильность не видна, «Назад», подсказку над КАЖДЫМ словом во
// всех вопросах запаса, сдачу без ошибок, провал и разбор ошибок со
// ссылкой на урок, правило «две ошибки на 5 баллов», лучший результат на
// карточке, перевод, телефон без горизонтальной прокрутки, светлую тему,
// языки uk и ar, отсутствие ошибок в консоли.
import { start } from './cdp.mjs';
import { readFileSync } from 'fs';

const B = 'http://127.0.0.1:8765';
const IDX = JSON.parse(readFileSync(new URL('../../data/fahrschule/index.json', import.meta.url), 'utf8'));
const EX = IDX.exam;
const c = await start(9337);
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 8000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

const STUB = `(() => { window.__said = []; TTS.speak = (text, o) => { o = o || {};
  window.__said.push(text); clearTimeout(window.__sayT);
  if (o.onEnd) window.__sayT = setTimeout(() => o.onEnd({ ok: true, reason: 'end' }), 60); };
  TTS.stop = () => { clearTimeout(window.__sayT); }; return true; })()`;

let nav = 0;
const _go = c.go;
c.go = (url, ms) => _go(url.replace(/(\.html)(#|$)/, `$1?n=${++nav}$2`), ms);
const NO_HSCROLL = `document.documentElement.scrollWidth <= window.innerWidth + 1`;
const allErrors = [];
const collect = () => allErrors.push(...c.errors());

const TIP_AUDIT = `(() => { const g = Fahrschule.unit.gloss; const bad = [];
  document.querySelectorAll('#fsApp .fs-w').forEach(w => { const lm = g.w[w.dataset.t];
    if (!lm || !g.l[lm] || !g.l[lm].ru) bad.push(w.textContent + '→' + w.dataset.t); });
  return JSON.stringify({ n: document.querySelectorAll('#fsApp .fs-w').length, bad }); })()`;

// ответ на текущий вопрос: верный (right) или любой неверный
const ANSWER = right => `(() => { const e = Fahrschule.exam; const q = e.qs[e.i];
  const a = q.kind === 'sign' ? q.sign : String(q.scene.answer);
  const key = ${right} ? a : e.opts[e.i].map(o => o.key).find(k => k !== a);
  document.querySelector('[data-exam-opt="' + key + '"]').click(); return key; })()`;
const NEXT = `document.querySelector('[data-exam-next]').click()`;

async function openExam() {
  await c.go(`${B}/fahrschule.html#u=${EX.id}`, 600);
  ok(await waitFor(`typeof Fahrschule !== 'undefined' && Fahrschule.unit && Fahrschule.unit.id === '${EX.id}' && !!document.querySelector('[data-exam-start]')`, 20000), 'экзамен открыт, видно вступление');
  await c.ev(STUB);
}

ok(!!EX && EX.id === 'x-01' && EX.count === 30, `оглавление: экзамен ${JSON.stringify(EX)}`);

await c.go(B + '/index.html', 800);
await c.ev(`localStorage.clear(); localStorage.setItem('dm_theme', 'dark')`);

// ── Список: карточка экзамена над темами ──
await c.go(B + '/fahrschule.html', 600);
ok(await waitFor(`!!document.querySelector('.fs-exam-tile')`, 20000), 'список: карточка «Пробный экзамен»');
ok(await c.ev(`(() => { const t = document.querySelector('.fs-exam-tile'), h = document.getElementById('fsListHead');
  return !!(t.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING); })()`), 'карточка стоит над списком тем');
ok(await c.ev(`/30/.test(document.querySelector('.fs-exam-tile').textContent) && /Probeprüfung/.test(document.querySelector('.fs-exam-tile').textContent)`), 'на карточке название и 30 вопросов');
ok(await c.ev(`!document.querySelector('.fs-list [data-unit="${EX.id}"]')`), 'экзамена нет среди уроков тем');
ok(await c.ev(NO_HSCROLL), 'список: без горизонтальной прокрутки');
await c.shot('fs_exam_hub.png');
await c.ev(`document.querySelector('.fs-exam-tile').click()`);
ok(await waitFor(`location.hash === '#u=${EX.id}' && !!document.querySelector('[data-exam-start]')`, 15000), 'карточка → экзамен');
collect();

// ── Вступление ──
await openExam();
ok(await c.ev(`document.querySelectorAll('.fs-exam-rules li').length === 4`), 'вступление: четыре правила');
ok(await c.ev(`/Все темы/.test(document.getElementById('fsToHub').textContent) && /0/.test(document.getElementById('fsBarCount').textContent)`), 'панель: «Все темы · 0 из 30»');
await c.shot('fs_exam_intro.png');

// ── Подсказки над каждым словом во всех вопросах запаса ──
const audit = JSON.parse(await c.ev(`(() => { const u = Fahrschule.unit; const bad = []; let n = 0;
  const check = t => { if (!t || !t.de) return; (t.de.match(Fahrschule.WORD_RE) || []).forEach(w => { n++;
    const k = Fahrschule.wordKey(w, t.o); const lm = u.gloss.w[k]; if (!lm || !u.gloss.l[lm]) bad.push(w + '→' + k); }); };
  u.pool.forEach(q => { (q.explain || []).forEach(check);
    if (q.scene) { check(q.scene.situation); check(q.scene.question); q.scene.explain.forEach(check); } });
  check(u.quizQuestion); check({ de: u.title });
  return JSON.stringify({ n, bad: [...new Set(bad)], pool: u.pool.length }); })()`));
ok(audit.n > 1000 && audit.bad.length === 0, `запас ${audit.pool} вопросов: у каждого из ${audit.n} слов подсказка ${audit.bad.slice(0, 5).join(', ')}`);

// ── Билет ──
await c.ev(`document.querySelector('[data-exam-start]').click()`);
ok(await waitFor(`!!document.querySelector('.fs-exam-card')`, 5000), 'начать экзамен → первый вопрос');
const ticket = JSON.parse(await c.ev(`(() => { const e = Fahrschule.exam; const ids = e.qs.map(q => q.kind + ':' + (q.sign || q.src + JSON.stringify(q.scene && q.scene.situation.de)));
  return JSON.stringify({ n: e.qs.length, signs: e.qs.filter(q => q.kind === 'sign').length, uniq: new Set(ids).size,
    pts: e.qs.every(q => q.pts >= 2 && q.pts <= 5) }); })()`));
ok(ticket.n === 30 && ticket.signs === 10 && ticket.uniq === 30 && ticket.pts, `билет: 30 вопросов, 10 знаков, без повторов, баллы 2–5 ${JSON.stringify(ticket)}`);
ok(await c.ev(`document.querySelector('[data-exam-next]').disabled`), '«Дальше» недоступно без ответа');
ok(await c.ev(`/балл/.test(document.querySelector('.fs-exam-pts').textContent)`), 'у вопроса видны штрафные баллы');

// пройти до первой ситуации «На дороге»: у неё картинка
let road = await c.ev(`Fahrschule.exam.qs.findIndex(q => q.kind === 'road')`);
let sign = await c.ev(`Fahrschule.exam.qs.findIndex(q => q.kind === 'sign')`);
ok(road >= 0 && sign >= 0, 'в билете есть и знаки, и ситуации');

// отвечаем на все верно; по дороге проверяем вид вопросов
for (let k = 0; k < 30; k++) {
  if (k === sign) {
    ok(await c.ev(`!!document.querySelector('.fs-exam-card .fs-sign-img') && /Schild/.test(document.querySelector('.fs-exam-card .fs-quiz-q').textContent)`), 'вопрос по знаку: знак и «Was bedeutet dieses Schild?»');
    await c.shot('fs_exam_sign.png');
  }
  if (k === road) {
    ok(await c.ev(`!!document.querySelector('.fs-exam-card .fs-exam-pic svg') && !!document.querySelector('.fs-exam-sit .fs-de')`), 'ситуация: описание и картинка');
    const t = JSON.parse(await c.ev(TIP_AUDIT));
    ok(t.n > 5 && t.bad.length === 0, `ситуация на экране: подсказка у каждого из ${t.n} слов`);
    // перевод карточки
    ok(!(await c.ev(`getComputedStyle(document.querySelector('.fs-exam-sit .fs-tr')).display !== 'none'`)), 'перевод скрыт');
    await c.ev(`document.querySelector('.fs-exam-card [data-tr-line]').click()`);
    ok(await c.ev(`getComputedStyle(document.querySelector('.fs-exam-sit .fs-tr')).display !== 'none'`), '«Перевод» показывает перевод ситуации');
    await c.ev(`document.querySelector('.fs-exam-card [data-tr-line]').click()`);
    // тултип над словом
    await c.ev(`document.querySelector('.fs-exam-sit .fs-w').click()`);
    ok(await waitFor(`!!document.querySelector('.rd-tip') && getComputedStyle(document.querySelector('.rd-tip')).display !== 'none'`, 3000)
      || await c.ev(`typeof ReaderTip !== 'undefined' && ReaderTip.isOpen()`), 'тап по слову открывает подсказку');
    await c.ev(`ReaderTip.close && ReaderTip.close()`);
    ok(await c.ev(NO_HSCROLL), 'вопрос: без горизонтальной прокрутки');
    await c.shot('fs_exam_road.png');
  }
  await c.ev(ANSWER(true));
  if (k === 0) {
    ok(await c.ev(`!document.querySelector('.fs-exam-card .is-right, .fs-exam-card .is-wrong') && !!document.querySelector('.fs-exam-card .is-picked')`), 'во время экзамена правильность не видна, выбор отмечен');
    ok(await c.ev(`!document.querySelector('[data-exam-next]').disabled`), 'после выбора «Дальше» доступно');
  }
  if (k === 1) {
    // «Назад» — к прошлому вопросу, выбор сохранён
    await c.ev(`document.querySelector('[data-exam-prev]').click()`);
    ok(await c.ev(`Fahrschule.exam.i === 0 && !!document.querySelector('.fs-exam-card .is-picked')`), '«Назад»: прошлый вопрос, выбор сохранён');
    await c.ev(NEXT);
  }
  await c.ev(NEXT);
}
ok(await waitFor(`!!document.querySelector('.fs-exam-result.is-pass')`, 5000), 'все ответы верны → «Сдано!»');
ok(await c.ev(`!document.querySelector('.fs-exam-review') && /\\b0\\b/.test(document.querySelector('.fs-exam-result').textContent)`), 'без ошибок: 0 баллов, разбора нет');
ok(await c.ev(`JSON.parse(localStorage.getItem('dm_fs_exam')).passed === 1`), 'результат сохранён');
await c.shot('fs_exam_pass.png');

// ── Новый экзамен: все ответы неверны → провал и разбор ──
await c.ev(`document.querySelector('[data-exam-new]').click()`);
ok(await waitFor(`!!document.querySelector('.fs-exam-card') && Fahrschule.exam.i === 0 && Fahrschule.exam.picks.every(p => p === null)`, 5000), '«Новый экзамен» — новый билет');
for (let k = 0; k < 30; k++) { await c.ev(ANSWER(false)); await c.ev(NEXT); }
ok(await waitFor(`!!document.querySelector('.fs-exam-result.is-fail')`, 5000), 'все ответы неверны → «Не сдано»');
ok(await c.ev(`document.querySelectorAll('.fs-exam-review').length === 30`), 'разбор: 30 ошибок');
ok(await c.ev(`[...document.querySelectorAll('.fs-exam-review')].every(r => r.querySelector('.fs-opt.is-right') && r.querySelector('.fs-opt.is-wrong') && r.querySelector('.fs-exam-src[data-unit]'))`),
  'в разборе: верный и мой ответ, ссылка на урок');
ok(await c.ev(`[...document.querySelectorAll('.fs-exam-review')].every(r => r.querySelector('.fs-explain .fs-de'))`), 'в разборе у каждой ошибки пояснение');
const t2 = JSON.parse(await c.ev(TIP_AUDIT));
ok(t2.n > 300 && t2.bad.length === 0, `разбор: подсказка у каждого из ${t2.n} слов`);
// 🔊 строки пояснения
await c.ev(`window.__said = []; document.querySelector('.fs-exam-review [data-say]').click()`);
ok(await waitFor(`window.__said.length > 0`, 3000), '🔊 у строки пояснения');
ok(await c.ev(NO_HSCROLL), 'разбор: без горизонтальной прокрутки');
await c.shot('fs_exam_fail.png');
// ссылка на урок
const src = await c.ev(`document.querySelector('.fs-exam-src').dataset.unit`);
await c.ev(`document.querySelector('.fs-exam-src').click()`);
ok(await waitFor(`Fahrschule.unit && Fahrschule.unit.id === '${src}'`, 10000), `разбор → урок ${src}`);
collect();

// ── Правило «две ошибки на 5 баллов» ──
await openExam();
await c.ev(`document.querySelector('[data-exam-start]').click()`);
await waitFor(`!!document.querySelector('.fs-exam-card')`, 5000);
const fives = await c.ev(`Fahrschule.exam.qs.map((q, k) => q.pts === 5 ? k : -1).filter(k => k >= 0).slice(0, 2).join(',')`);
const wrongAt = new Set(fives.split(',').map(Number));
for (let k = 0; k < 30; k++) { await c.ev(ANSWER(!wrongAt.has(k))); await c.ev(NEXT); }
ok(await waitFor(`!!document.querySelector('.fs-exam-result.is-fail')`, 5000), 'две ошибки на 5 баллов (10 баллов) → не сдано');
ok(await c.ev(`/5/.test(document.querySelector('.fs-exam-why').textContent)`), 'причина провала названа');

// ── Карточка в списке: лучший результат ──
await c.go(B + '/fahrschule.html', 600);
ok(await waitFor(`!!document.querySelector('.fs-exam-tile') && /Лучший результат/.test(document.querySelector('.fs-exam-tile').textContent)`, 15000), 'карточка: лучший результат');

// ── Светлая тема ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
await openExam();
await c.ev(`document.querySelector('[data-exam-start]').click()`);
await waitFor(`!!document.querySelector('.fs-exam-card')`, 5000);
await c.ev(ANSWER(true));
await c.shot('fs_exam_light.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);
collect();

// ── Языки ──
for (const lang of ['uk', 'ar']) {
  await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: '${lang}', ts: Date.now() }))`);
  await c.go(B + '/fahrschule.html', 800);
  ok(await waitFor(`!!document.querySelector('.fs-exam-tile')`, 20000), `${lang}: карточка экзамена`);
  await openExam();
  await c.ev(`document.querySelector('[data-exam-start]').click()`);
  await waitFor(`!!document.querySelector('.fs-exam-card')`, 5000);
  await c.ev(`document.querySelector('.fs-exam-card [data-tr-line]').click()`);
  const txt = await c.ev(`document.getElementById('fsApp').innerText`);
  if (lang === 'ar') {
    ok(!/[А-Яа-яЁёІіЇїЄєҐґ]/.test(txt), `ar: в экзамене нет кириллицы ${(txt.match(/[^\n]*[А-Яа-яЁёІіЇїЄєҐґ][^\n]*/) || [''])[0].slice(0, 80)}`);
    ok(await c.ev(`document.documentElement.dir === 'rtl' && getComputedStyle(document.querySelector('.fs-exam-card .fs-opt-de')).direction === 'ltr'`), 'ar: RTL, немецкий LTR');
  } else {
    ok(!/[ЫыЭэЪъЁё]/.test(txt) && /Питання|Запитання|Далі|бал/.test(txt), `uk: экзамен по-украински ${(txt.match(/[^\n]*[ЫыЭэЪъЁё][^\n]*/) || [''])[0].slice(0, 80)}`);
  }
  for (let k = 0; k < 30; k++) { await c.ev(ANSWER(false)); await c.ev(NEXT); }
  await waitFor(`!!document.querySelector('.fs-exam-result')`, 5000);
  const res = await c.ev(`document.getElementById('fsApp').innerText`);
  if (lang === 'ar') ok(!/[А-Яа-яЁёІіЇїЄєҐґ]/.test(res), `ar: в разборе нет кириллицы ${(res.match(/[^\n]*[А-Яа-яЁёІіЇїЄєҐґ][^\n]*/) || [''])[0].slice(0, 80)}`);
  else ok(!/[ЫыЭэЪъЁё]/.test(res), `uk: разбор по-украински ${(res.match(/[^\n]*[ЫыЭэЪъЁё][^\n]*/) || [''])[0].slice(0, 80)}`);
  await c.shot(`fs_exam_${lang}.png`);
  collect();
}
await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: 'ru', ts: Date.now() }))`);

ok(allErrors.length === 0, `нет ошибок в консоли ${allErrors.slice(0, 3).join(' | ')}`);
c.close();
console.log(fail ? `\nFAIL: ${fail}` : '\nfahrschule_exam_flow: всё ок');
process.exit(fail ? 1 : 0);
