// E2E: переход к следующему уровню курса.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/level_next_flow.mjs
// Вкладка «Курс»: в конце пути каждого уровня — карточка «Дальше — A2 …»
// (после B2 — «Это последний уровень»), кнопка переключает уровень; когда
// уровень пройден, карточка подсвечена. В конце урока доступно превью
// следующего урока, включая переход между уровнями. У B2-14 — итог курса.
// uk/ar — без кириллицы русского в новых блоках.
import { start } from './cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9361);
let fail = 0;
const ok = (cond, msg, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg + (cond || x === undefined ? '' : '  → ' + JSON.stringify(x))); if (!cond) fail++; };
const waitFor = async (expr, ms = 6000) => { for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); } return false; };
const J = async expr => JSON.parse(await c.ev(`JSON.stringify(${expr})`));
const today = new Date().toISOString().slice(0, 10);
const A1 = Array.from({ length: 20 }, (_, i) => 'a1-' + String(i + 1).padStart(2, '0'));
const finish = 'for (const name of ["flashcards", "fill", "choice", "match", "dict"]) Progress.markSectionDone(name, 100)';

async function fresh(url, storage = {}) {
  await c.go(B + '/404.html', 500);
  await c.ev(`localStorage.clear(); sessionStorage.clear(); ${Object.entries(storage).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(typeof v === 'string' ? v : JSON.stringify(v))});`).join('')}`);
  await c.go(B + url, 1600);
}

// ── 1. Вкладка «Курс» ──
console.log('1. Курс: карточки в конце уровней');
await fresh('/index.html#course', { dm_theme: 'dark' });
await waitFor(`document.querySelectorAll('.lvl-next').length === 4`);
let s = await J(`[...document.querySelectorAll('.path[data-level]')].map(p => ({
  lv: p.dataset.level, last: p.lastElementChild.className,
  go: p.querySelector('[data-level-go]')?.dataset.levelGo || null,
  final: p.querySelector('.lvl-next').classList.contains('is-final'),
  title: p.querySelector('.ln-title').textContent.replace(/\\s+/g, ' ').trim() }))`);
ok(s.every(p => p.last.startsWith('lvl-next')), 'карточка — последний узел каждого пути', s);
ok(s.map(p => p.go).join() === 'a2,b1,b2,', `кнопки ведут дальше: ${s.map(p => p.go)}`);
ok(s[3].final && !s[0].final, 'у B2 — финальная карточка');
ok(s[0].title === 'Дальше — A2 · Элементарный', `A1: «${s[0].title}»`);
ok(!(await c.ev(`document.querySelector('.path[data-level="a1"] .lvl-next').classList.contains('is-ready')`)), 'A1 не пройден — без подсветки');
await c.ev(`document.querySelector('.path[data-level="a1"] .lvl-next').scrollIntoView({ block: 'center', behavior: 'instant' })`); await c.wait(300);
await c.shot('level-next-course.png');
ok(!(await c.ev(`document.documentElement.scrollWidth > innerWidth + 1`)), 'нет горизонтальной прокрутки');

await c.ev(`document.querySelector('[data-level-go="a2"]').click()`); await c.wait(1200);
s = await J(`({ vis: [...document.querySelectorAll('.path[data-level]')].filter(p => !p.hidden).map(p => p.dataset.level),
  on: document.querySelector('[data-level-btn].on').dataset.levelBtn, y: scrollY, code: document.getElementById('lvlCode').textContent })`);
ok(s.vis.join() === 'a2' && s.on === 'a2' && s.code === 'A2' && s.y === 0, 'кнопка открыла A2 и подняла к началу', s);

await c.ev(`document.querySelector('[data-level-btn="b2"]').click(); document.querySelector('[data-tab-go="home"]').click()`); await c.wait(300);
ok((await J(`[...document.querySelectorAll('[data-tab]')].filter(e => !e.hidden).map(e => e.dataset.tab)`)).join() === 'home', 'после B2 кнопка ведёт на главную');

// пройденный A1 — карточка подсвечена
await fresh('/index.html#course', { dm_theme: 'dark', dm_progress: { xp: 2000, streak: 1, lastActive: today, completedLessons: A1, lessonScores: {} } });
await waitFor(`document.querySelectorAll('.lvl-next').length === 4`);
await c.ev(`document.querySelector('[data-level-btn="a1"]').click()`); await c.wait(200);
ok(await c.ev(`document.querySelector('.path[data-level="a1"] .lvl-next').classList.contains('is-ready')`), 'A1 пройден — карточка подсвечена');
await c.ev(`document.querySelector('.path[data-level="a1"] .lvl-next').scrollIntoView({ block: 'center', behavior: 'instant' })`); await c.wait(300);
await c.shot('level-next-course-ready.png');

// ── 2. Последние уроки уровней ──
console.log('2. Последний урок уровня');
const LAST = [['a1', 20, 'a2'], ['a2', 20, 'b1'], ['b1', 14, 'b2'], ['b2', 14, null]];
for (const [lv, n, nx] of LAST) {
  await fresh(`/lessons/${lv}/lesson-${n}/index.html`, { dm_theme: 'dark' });
  await waitFor(`!!document.querySelector('#lessonComplete .lesson-preview')`);
  ok(!(await c.ev(`document.querySelector('.lesson-preview').getClientRects().length`)),
    `${lv}-${n}: превью скрыто до завершения урока`);
  await c.ev(finish);
  if (nx) await waitFor(`!!document.querySelector('.lesson-preview-example')`);
  s = await J(`(() => {
    const preview = document.querySelector('#lessonComplete .lesson-preview');
    const link = preview.querySelector('.lesson-next');
    return { visible: preview.getClientRects().length > 0, link: link?.pathname,
      sample: !!preview.querySelector('.lesson-preview-example'),
      home: !!document.querySelector('#lessonComplete .lesson-complete-actions a') };
  })()`);
  if (nx) ok(s.visible && s.sample && s.link?.endsWith('/lessons/' + nx + '/lesson-01/index.html'),
    `${lv}-${n}: после завершения показан первый урок ${nx.toUpperCase()}`, s);
  else ok(s.visible && !s.link && s.home, 'B2-14: итог курса и ссылка на главную', s);
  if (lv === 'a1') {
    await c.ev(`document.querySelector('.lesson-preview').scrollIntoView({ block: 'center', behavior: 'instant' })`); await c.wait(300);
    await c.shot('level-next-lesson.png');
    ok(!(await c.ev(`document.documentElement.scrollWidth > innerWidth + 1`)), 'урок: нет горизонтальной прокрутки');
  }
  if (lv === 'b2') {
    await c.ev(`document.getElementById('lessonComplete').scrollIntoView({ block: 'center', behavior: 'instant' })`); await c.wait(300);
    await c.shot('level-next-final.png');
  }
}
await fresh('/lessons/a1/lesson-19/index.html');
await c.wait(500);
ok(!(await c.ev(`document.querySelector('.lesson-preview').getClientRects().length`)), 'a1-19: превью скрыто');

// ── 3. uk / ar ──
console.log('3. Переводы');
for (const lang of ['uk', 'ar']) {
  for (const url of ['/index.html#course', '/lessons/a1/lesson-20/index.html', '/lessons/b2/lesson-14/index.html']) {
    await fresh(url, { dm_lang: { lang, ts: Date.now() } });
    await waitFor(`!!document.querySelector('.lvl-next, .lesson-preview')`);
    if (url.includes('/lessons/')) await c.ev(finish);
    await c.wait(800);
    const ru = await J(`[...document.querySelectorAll('.lvl-next *, .lesson-preview *')].filter(e => (${lang === 'ar' ? '/[а-яА-ЯёЁіїєІЇЄ]/' : '/[ыэъЫЭЪёЁ]/'}).test([...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(''))).map(e => e.textContent.trim())`);
    ok(ru.length === 0, `${lang} ${url}: перевод`, ru);
    if (lang === 'ar' && url.includes('a1')) await c.shot('level-next-ar.png');
  }
}

const errs = c.errors();
ok(errs.length === 0, 'без ошибок JS', errs);
c.close();
console.log(fail ? `\n${fail} FAIL` : '\nвсё ок');
process.exit(fail ? 1 : 0);
