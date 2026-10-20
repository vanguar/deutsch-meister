// E2E: поведение внутри мини-аппа Telegram (эмуляция, tools/e2e/tg-stub.js:
// SDK грузится асинхронно, схема Telegram — светлая). Нужны Chrome и сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/tg_flow.mjs
// Проверяет:
//  * тема: пока человек ничего не выбрал — схема Telegram; выбранная в
//    профиле тема (тёмная/светлая) держится на главной, в книгах, новостях,
//    автошколе, диалогах и уроках — Telegram её больше не перебивает;
//  * приветствие Telegram — только на главной: автошколу, открытую первой,
//    оно не закрывает;
//  * автошкола: 🌐 у ситуации (касанием) переводит ситуацию, вопрос и
//    варианты, перевод держится после ответа и на следующей сцене.
import { start } from './cdp.mjs';
import { readFileSync } from 'fs';

const B = 'http://127.0.0.1:8765';
const c = await start(9336);
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };
async function waitFor(expr, ms = 8000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}
let nav = 0;
const go = (path, ms = 1500) => c.go(`${B}/${path.replace(/(\.html)(#|$)/, `$1?n=${++nav}$2`)}`, ms);

await c.send('Network.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Telegram-Android/11.0' });
await c.send('Page.addScriptToEvaluateOnNewDocument', { source: readFileSync(new URL('./tg-stub.js', import.meta.url), 'utf8') });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmitTouchEventsForMouse', { enabled: true, configuration: 'mobile' });

const theme = () => c.ev(`document.documentElement.getAttribute('data-theme')`);
const PAGES = ['books.html', 'news.html', 'fahrschule.html', 'dialogs.html', 'lessons/a1/lesson-01/index.html', 'index.html'];

// первая загрузка в свежем профиле ждёт шрифты Google
await go('fahrschule.html', 600);
await waitFor(`document.readyState === 'complete'`, 20000);
await c.ev(`localStorage.clear(); sessionStorage.clear()`);

// ── Приветствие: только на главной ──
await go('fahrschule.html', 600);
ok(await waitFor(`!!window.Telegram && document.querySelectorAll('.fs-topic').length > 0`, 20000), 'автошкола открылась в «Telegram»');
await c.wait(800);
ok(await c.ev(`!document.getElementById('tg-welcome') && !localStorage.getItem('tg_welcomed')`), 'автошкола: приветствие не закрывает страницу');
await go('index.html', 600);
ok(await waitFor(`!!document.getElementById('tg-welcome')`, 8000), 'главная: приветствие показано');
await c.ev(`closeTgWelcome()`);

// ── Тема: без выбора — схема Telegram ──
await c.ev(`localStorage.removeItem('dm_theme')`);
for (const p of ['fahrschule.html', 'index.html']) {
  await go(p, 600);
  ok(await waitFor(`!!window.Telegram && document.documentElement.getAttribute('data-theme') === 'light'`, 8000), `${p}: без выбора — светлая схема Telegram`);
}
// ── выбрал тёмную в профиле — она везде ──
for (const want of ['dark', 'light', 'dark']) {
  await go('index.html#more', 600);
  await waitFor(`!!window.Telegram && !!document.querySelector('[data-set-theme="${want}"]')`, 8000);
  await c.wait(600);   // SDK «загрузился» — раньше он перебивал выбор
  await c.ev(`document.querySelector('[data-set-theme="${want}"]').click()`);
  ok((await theme()) === want && (await c.ev(`localStorage.getItem('dm_theme')`)) === want, `профиль: выбрана тема ${want}`);
  for (const p of PAGES) {
    await go(p, 600);
    await waitFor(`!!window.Telegram`, 8000);
    await c.wait(500);
    ok((await theme()) === want, `${p}: тема ${want} сохранилась (${await theme()})`);
  }
}
// выбор, совпадающий с текущей темой, тоже запоминается
await c.ev(`localStorage.removeItem('dm_theme')`);
await go('index.html#more', 600);
await waitFor(`!!window.Telegram && document.documentElement.getAttribute('data-theme') === 'light'`, 8000);
await c.ev(`document.querySelector('[data-set-theme="light"]').click()`);
ok((await c.ev(`localStorage.getItem('dm_theme')`)) === 'light', 'профиль: нажатие на уже включённую тему тоже запоминается');

// ── Автошкола: 🌐 у ситуации переводит ситуацию, вопрос и варианты ──
async function tap(sel) {
  await c.ev(`document.querySelector('${sel}').scrollIntoView({ block: 'center' })`);
  await c.wait(300);
  const p = JSON.parse(await c.ev(`(() => { const b = document.querySelector('${sel}').getBoundingClientRect(); return JSON.stringify({ x: b.x + b.width / 2, y: b.y + b.height / 2 }); })()`));
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] });
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await c.wait(400);
}
const sceneTr = () => c.ev(`JSON.stringify({
  sit: getComputedStyle(document.querySelector('.fs-situation .fs-tr')).display !== 'none',
  q: getComputedStyle(document.querySelector('.fs-junction > .fs-quiz-q-tr')).display !== 'none',
  opts: [...document.querySelectorAll('.fs-road-opt .fs-opt-tr')].every(e => getComputedStyle(e).display !== 'none') })`).then(JSON.parse);
const road = JSON.parse(readFileSync(new URL('../../data/fahrschule/index.json', import.meta.url), 'utf8')).units.find(u => u.kind === 'road' && u.id === 'r-04') ? 'r-04' : null;
if (road) {
  await go(`fahrschule.html#u=${road}`, 600);
  await waitFor(`Fahrschule.scene && document.querySelectorAll('[data-road-opt]').length > 0`, 8000);
  let s = await sceneTr();
  ok(!s.sit && !s.q && !s.opts, 'сцена: перевод сначала скрыт');
  await tap('.fs-situation [data-tr-line]');
  s = await sceneTr();
  ok(s.sit && s.q && s.opts, `🌐 касанием: перевод ситуации, вопроса и вариантов ${JSON.stringify(s)}`);
  const sc = JSON.parse(await c.ev(`JSON.stringify(Fahrschule.unit.scenes[0])`));
  await c.ev(`document.querySelector('[data-road-opt="${sc.answer}"]').click()`);
  await waitFor(`document.querySelectorAll('.fs-explain .fs-line').length > 0`, 10000);
  s = await sceneTr();
  ok(s.sit && s.q && s.opts, 'перевод остаётся после ответа');
  await c.ev(`ReaderSpeak.stop(); document.querySelector('[data-scene-next]').click()`);
  await c.wait(400);
  s = await sceneTr();
  ok(s.sit && s.q && s.opts, 'и на следующей сцене');
  await tap('.fs-situation [data-tr-line]');
  s = await sceneTr();
  ok(!s.sit && !s.q && !s.opts, 'повторный 🌐 скрывает перевод');
}

ok(c.errors().length === 0, `нет ошибок в консоли ${c.errors().slice(0, 2).join(' | ')}`);
c.close();
console.log(fail ? `\nFAIL: ${fail}` : '\ntg_flow: всё ок');
process.exit(fail ? 1 : 0);
