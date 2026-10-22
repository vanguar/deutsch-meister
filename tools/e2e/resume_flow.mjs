// E2E: «Продолжить урок» — полоса прогресса над кнопкой и возврат на место.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/resume_flow.mjs
// Урок запоминает, где остановились (dm_lesson_pos:<id>, js/lesson-render.js
// initLessonResume), и долю прочитанной теории; главная (js/home.js) рисует
// по ней первый сегмент полосы и процент. Кнопка «Продолжить урок» открывает
// урок на том же месте (и на той же вкладке упражнений), а урок из «Курса» —
// сначала. Работает и в переводе (uk), где высоты блоков другие.
import { start } from './cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9361);
let fail = 0;
const ok = (cond, msg, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg + (cond || x === undefined ? '' : '  → ' + JSON.stringify(x))); if (!cond) fail++; };
const waitFor = async (expr, ms = 6000) => { for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); } return false; };
const J = async expr => JSON.parse(await c.ev(`JSON.stringify(${expr})`));
const today = new Date().toISOString().slice(0, 10);
const LESSON = B + '/lessons/a1/lesson-04/index.html';
const ANCH = `'.lesson-section, .lesson-section > *, #phraseGrid > *, #vocabTableBody > *, #grammarBoxes > *, #grammarBoxes > * > *, #fillContainer > *, #mcContainer > *, #dictationContainer > *'`;
const POS = `JSON.parse(localStorage.getItem('dm_lesson_pos:a1-04') || 'null')`;
const HOME = `(() => {
  const st = [...document.querySelectorAll('#nowSteps .step')];
  return { sub: document.getElementById('nowSub').textContent, next: document.getElementById('nowNextName').textContent,
    capShown: !document.getElementById('nowNext').hidden, steps: st.length,
    on: st.filter(s => s.classList.contains('on')).length, nextI: st.findIndex(s => s.classList.contains('next')),
    p0: st[0].style.getPropertyValue('--p'), w0: st[0].getBoundingClientRect().width,
    fill0: parseFloat(getComputedStyle(st[0], '::after').width), href: document.getElementById('continueBtn').getAttribute('href'),
    cur: (document.querySelector('.lesson-card[data-state="cur"] .lc-state') || {}).textContent };
})()`;
// где сейчас верх экрана: номер якоря и доля
const WHERE = `(() => { const els = document.querySelectorAll(${ANCH}); let i = -1, f = 0;
  els.forEach((e, k) => { const r = e.getBoundingClientRect(); if (r.height > 0 && r.top <= 0 && r.bottom > 0) { i = k; f = -r.top / r.height; } });
  return { i, f, y: Math.round(scrollY), tab: (document.querySelector('.ex-tab.active') || {}).dataset?.panel }; })()`;

async function lesson(url = LESSON) {
  await c.go(url, 900);
  await waitFor(`document.querySelectorAll('#phraseGrid > *').length > 0 && document.readyState === 'complete'`);
  await c.wait(400);
}
async function home() {
  await c.go(B + '/index.html', 900);
  await waitFor(`typeof Home !== 'undefined' && document.querySelectorAll('.lesson-card[data-state]').length > 0`);
}
async function scrollTo(expr) {
  await c.ev(`(() => { const e = ${expr}; scrollTo({ top: scrollY + e.getBoundingClientRect().top + 37, behavior: 'instant' }); })()`);
  await c.wait(500);   // сохранение — через 250 мс после прокрутки
}
async function viaContinue() {
  await home();
  await c.ev(`document.getElementById('continueBtn').click()`);
  await waitFor(`location.pathname.includes('/lesson-04/') && document.querySelectorAll('#phraseGrid > *').length > 0 && document.readyState === 'complete'`, 8000);
  await c.wait(900);
}

// ── 1. Начало урока ──
console.log('1. Урок открыт впервые: ничего не прочитано');
await c.go(B + '/index.html', 600);
await c.ev(`localStorage.clear(); sessionStorage.clear();
  localStorage.setItem('dm_theme', 'dark');
  localStorage.setItem('dm_progress', JSON.stringify({ xp: 320, streak: 5, lastActive: '${today}', completedLessons: ['a1-01', 'a1-02', 'a1-03'], lessonScores: {} }));`);
await lesson();
ok(await c.ev(`scrollY`) === 0, 'урок открыт сверху');
await home();
let h = await J(HOME);
ok(/lesson-04/.test(h.href) && h.steps === 6 && h.on === 0 && h.nextI === 0 && h.next === 'Теория' && h.capShown, `шаги: 0/${h.steps}, дальше «${h.next}», → ${h.href}`, h);

// ── 2. Прочитал половину теории ──
console.log('2. Дочитал до грамматики — полоса сдвинулась');
await lesson();
await scrollTo(`document.querySelector('#grammarBoxes > *')`);
const saved = await J(POS);
const at = await J(WHERE);
ok(saved && saved.i === at.i && Math.abs(saved.f - at.f) < 0.01 && saved.read > 0.3 && saved.read < 1, `место сохранено: якорь ${saved && saved.i}, прочитано ${saved && saved.read}`, saved);
await home();
h = await J(HOME);
const pct = Math.round(saved.read / 6 * 100);
ok(h.sub === `Пройдено ${pct}%` && h.cur === `Пройдено ${pct}%`, `подпись «${h.sub}», в пути «${h.cur}»`, h);
ok(h.on === 0 && h.nextI === 0 && h.p0 === Math.round(saved.read * 100) + '%' && Math.abs(h.fill0 - h.w0 * Math.round(saved.read * 100) / 100) <= 1.5, `теория залита на ${h.p0} (${h.fill0.toFixed(1)} из ${h.w0.toFixed(1)} px)`, h);
await c.shot('resume-home.png');

// ── 3. «Продолжить урок» возвращает на место ──
console.log('3. «Продолжить урок» → то же место');
await viaContinue();
let w = await J(WHERE);
ok(w.i === saved.i && Math.abs(w.f - saved.f) < 0.02, `вернулись к якорю ${w.i} (доля ${w.f.toFixed(3)}), y=${w.y}`, { w, saved });
ok(await c.ev(`sessionStorage.getItem('dm_resume')`) === null, 'флаг возврата израсходован');
await c.shot('resume-lesson.png');

// ── 4. Из «Курса» — сначала ──
console.log('4. Урок из «Курса» открывается сверху');
await home();
await c.ev(`document.querySelector('.lesson-card[href*="a1/lesson-04"]').click()`);
await waitFor(`location.pathname.includes('/lesson-04/') && document.readyState === 'complete'`, 8000);
await c.wait(900);
ok(await c.ev(`scrollY`) === 0, 'из «Курса» — с начала урока');
ok((await J(POS)).i === saved.i, 'позиция при этом не затёрта');

// ── 5. Вкладка упражнений ──
console.log('5. Упражнения: вкладка «Сопоставление» и место');
await c.ev(`document.querySelector('.ex-tab[data-panel="match"]').click()`);
await scrollTo(`document.getElementById('panel-match')`);
let p = await J(POS);
ok(p.tab === 'match' && p.read === 1, `сохранено: вкладка ${p.tab}, теория ${p.read}`, p);
await viaContinue();
w = await J(WHERE);
ok(w.tab === 'match' && w.i === p.i && Math.abs(w.f - p.f) < 0.02, `вкладка ${w.tab}, якорь ${w.i}`, { w, p });
ok(await c.ev(`document.getElementById('panel-match').classList.contains('active')`), 'панель «Сопоставление» открыта');
await home();
h = await J(HOME);
ok(h.on === 1 && h.nextI === 1 && h.next === 'Пропуски' && h.sub === 'Пройдено 17%', `теория пройдена: ${h.on}/6, дальше «${h.next}», «${h.sub}»`, h);

// ── 6. Прокрутка вверх не уменьшает прочитанное ──
console.log('6. Вернулся к началу — прочитанное не убывает');
await lesson();
await c.ev(`scrollTo({ top: 300, behavior: 'instant' })`); await c.wait(500);
p = await J(POS);
ok(p.read === 1 && p.i >= 0, `теория ${p.read}, якорь ${p.i}`, p);
await c.ev(`scrollTo({ top: 0, behavior: 'instant' })`); await c.wait(500);
p = await J(POS);
ok(p.read === 1 && p.i === undefined, 'в самом начале урока — без якоря', p);

// ── 7. Свой скролл отменяет удержание якоря ──
console.log('7. Пользователь листает сам — урок его не дёргает');
await scrollTo(`document.querySelector('#vocabTableBody > *:nth-child(3)')`);
await home();
await c.ev(`document.getElementById('continueBtn').click()`);
await waitFor(`location.pathname.includes('/lesson-04/') && document.querySelectorAll('#phraseGrid > *').length > 0`, 8000);
await c.wait(150);
await c.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 200, y: 400, deltaX: 0, deltaY: 600 });
await c.wait(250);
await c.ev(`scrollTo({ top: 10, behavior: 'instant' })`);
await c.wait(3200);
const y7 = await c.ev(`scrollY`);
ok(y7 === 10, 'после своего жеста страница остаётся там, куда долистал', y7);

// ── 8. Перевод: блоки другой высоты ──
console.log('8. Украинский интерфейс — возврат по якорю, не по пикселям');
await lesson();
await scrollTo(`document.querySelector('#grammarBoxes > *:last-child')`);
const ukSaved = await J(POS);
await c.ev(`localStorage.setItem('dm_lang', 'uk')`);
await viaContinue();
await waitFor(`I18N.lang === 'uk'`);
await c.wait(800);
w = await J(WHERE);
ok(w.i === ukSaved.i && Math.abs(w.f - ukSaved.f) < 0.05, `uk: якорь ${w.i} (ждали ${ukSaved.i}), доля ${w.f.toFixed(3)}`, { w, ukSaved });
await home();
h = await J(HOME);
ok(h.sub === 'Пройдено 17%' && h.next === 'Пропуски', `uk: «${h.sub}», далі «${h.next}»`, h);
await c.ev(`localStorage.setItem('dm_lang', 'ru')`);

// ── 9. Облако и сброс ──
console.log('9. Облачное слияние и сброс урока');
const merged = await J(`(() => {
  localStorage.setItem('dm_lesson_pos:a1-05', JSON.stringify({ i: 4, f: .5, read: .8, ts: 100 }));
  const snap = Progress.exportAll();
  const hasLocal = !!(snap.lessonPos && snap.lessonPos['a1-05']);
  Progress.importAll({ lessonPos: { 'a1-05': { i: 9, f: .1, read: .2, ts: 200 }, 'a1-06': { i: 2, f: 0, read: .4, ts: 5, tab: 'dict' }, 'bad id': { read: 1 } } });
  return { hasLocal, a5: Progress.getLessonPos('a1-05'), a6: Progress.getLessonPos('a1-06'), bad: localStorage.getItem('dm_lesson_pos:bad id') };
})()`);
ok(merged.hasLocal, 'место в уроках уходит в облачный снимок');
ok(merged.a5.i === 9 && merged.a5.read === 0.8 && merged.a6.tab === 'dict' && merged.bad === null, `слияние: место — свежее (${merged.a5.i}), прочитанное — максимум (${merged.a5.read})`, merged);
const reset = await J(`(() => { Progress.resetLessonProgress('a1-05'); return localStorage.getItem('dm_lesson_pos:a1-05'); })()`);
ok(reset === null, 'сброс урока стирает и место');

const errs = c.errors();
ok(!errs.length, 'нет ошибок JS', errs);
c.close();
console.log(fail ? `\n${fail} FAIL` : '\nвсё ok');
process.exit(fail ? 1 : 0);
