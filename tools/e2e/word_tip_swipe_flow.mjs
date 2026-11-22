// E2E: подсказку над словом можно смахнуть свайпом влево или вправо —
// в уроках (js/lesson-render.js) и в ридере книг (js/reader-tip.js),
// общий жест — js/tip-swipe.js.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/word_tip_swipe_flow.mjs
// Короткий сдвиг возвращает карточку на место, тап по «озвучить» после
// неудачного свайпа подсказку не закрывает, досланный клик не открывает её заново.
import { start } from './cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9374);
let fail = 0;
const ok = (cond, msg, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg + (cond || x === undefined ? '' : '  → ' + JSON.stringify(x))); if (!cond) fail++; };
const J = async expr => JSON.parse(await c.ev(`JSON.stringify(${expr})`));
const isOpen = `!!document.querySelector('body > .word-tip.word-tip-visible')`;

await c.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
await c.go(B + '/lessons/b2/lesson-07/index.html', 1500);

const touch = (type, x, y) => c.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });

async function openTip() {
  const p = await J(`(() => { const w = document.querySelector('#phraseGrid .word-has-tip');
    w.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = w.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await c.wait(150);
  await touch('touchStart', p.x, p.y); await touch('touchEnd');
  await c.wait(300);
  return J(`(() => { const r = document.querySelector('body > .word-tip').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
}

async function drag(from, dx, steps = 8) {
  await touch('touchStart', from.x, from.y);
  for (let i = 1; i <= steps; i++) { await touch('touchMove', from.x + dx * i / steps, from.y + 2); await c.wait(16); }
  await touch('touchEnd');
}

for (const dx of [-140, 140]) {
  const at = await openTip();
  ok(await c.ev(isOpen), `подсказка открыта (${dx < 0 ? 'влево' : 'вправо'})`);
  await drag(at, dx);
  await c.wait(400);
  ok(!(await c.ev(isOpen)), `свайп ${dx < 0 ? 'влево' : 'вправо'} закрывает подсказку`);
  ok(!(await c.ev(`!!document.querySelector('.word-has-tip.word-tip-open')`)), 'слово больше не подсвечено');
}

let at = await openTip();
await drag(at, 30, 4);
await c.wait(300);
let s = await J(`(() => { const t = document.querySelector('body > .word-tip');
  return { open: !!t?.classList.contains('word-tip-visible'), translate: t?.style.translate || '', opacity: t?.style.opacity || '' }; })()`);
ok(s.open && !s.translate && !s.opacity, 'короткий сдвиг возвращает подсказку на место', s);

const play = await J(`(() => { const r = document.querySelector('body > .word-tip .word-tip-play').getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
await c.wait(500);
await touch('touchStart', play.x, play.y); await touch('touchEnd');
await c.wait(300);
ok(await c.ev(isOpen), 'тап по «озвучить» подсказку не закрывает');

await drag(at, -40, 2);   // быстрый короткий флик
await c.wait(400);
ok(!(await c.ev(isOpen)), 'быстрый флик тоже смахивает');

at = await openTip();
await c.ev(`window.scrollBy(0, 40)`); await c.wait(300);
ok(!(await c.ev(isOpen)), 'прокрутка по-прежнему закрывает подсказку');

// ── Ридер книг ──
console.log('Ридер');
await c.go(B + '/books.html?lang=ru&lts=' + Date.now(), 2500);
await c.ev(`Reader.open('bremer')`);
for (let t = 0; t < 8000 && !(await c.ev(`/гл\./.test(document.getElementById('rdPages')?.textContent || '')`)); t += 100) await c.wait(100);
await c.wait(600);
const bookTip = `document.querySelector('.word-tip--book')`;
const bookOpen = `ReaderTip.isOpen() && !!document.querySelector('.word-tip--book.word-tip-visible')`;
async function openBookWord(n) {
  const p = await J(`(() => { const v = document.querySelector('.rd-viewport').getBoundingClientRect();
    const words = [...document.querySelectorAll('#rdContent .bw')].filter(w => { const b = w.getBoundingClientRect();
      return b.width && b.left >= v.left && b.right <= v.right && b.top >= v.top + 40 && b.bottom <= v.bottom - 40; });
    const r = words[${n}].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await touch('touchStart', p.x, p.y); await touch('touchEnd');
  await c.wait(400);
  return J(`(() => { const r = ${bookTip}.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 24 }; })()`);
}
const pageBefore = await c.ev(`document.getElementById('rdPages').textContent + '|' + document.querySelector('.rd-viewport').scrollLeft`);
for (const [n, dx] of [[0, -140], [3, 140]]) {
  at = await openBookWord(n);
  ok(await c.ev(bookOpen), `ридер: подсказка открыта (${dx < 0 ? 'влево' : 'вправо'})`);
  await drag(at, dx);
  await c.wait(450);
  ok(!(await c.ev(`ReaderTip.isOpen()`)), `ридер: свайп ${dx < 0 ? 'влево' : 'вправо'} закрывает подсказку`);
}
ok(await c.ev(`document.getElementById('rdPages').textContent + '|' + document.querySelector('.rd-viewport').scrollLeft`) === pageBefore,
  'ридер: свайп по подсказке не листает страницу');
at = await openBookWord(1);
s = await J(`(() => { const t = ${bookTip}; return { open: ReaderTip.isOpen(), translate: t.style.translate, opacity: t.style.opacity }; })()`);
ok(s.open && !s.translate && !s.opacity, 'ридер: после свайпа следующая подсказка открывается без сдвига', s);
await drag(at, 30, 4);
await c.wait(300);
ok(await c.ev(bookOpen), 'ридер: короткий сдвиг возвращает подсказку на место');

const errs = c.errors();
ok(errs.length === 0, 'без ошибок JS', errs);
c.close();
console.log(fail ? `\n${fail} FAIL` : '\nвсё ок');
process.exit(fail ? 1 : 0);
