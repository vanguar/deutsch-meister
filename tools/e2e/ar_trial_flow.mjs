// E2E: арабская версия (меню + готовые уроки из i18n/ar/ready.js,
// остальное «скоро»). Каждый готовый урок проверяется на остатки кириллицы.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/ar_trial_flow.mjs
import { start } from './cdp.mjs';
const c = await start(9334);
const B = 'http://127.0.0.1:8765';
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? '  ok   ' : '  FAIL ') + n + (ok ? '' : '  → ' + JSON.stringify(x))); if (!ok) fails++; };
const CYR = "/[А-Яа-яЁё]/";
import { readFileSync } from 'fs';
const READY = JSON.parse(readFileSync(new URL('../../i18n/ar/ready.js', import.meta.url), 'utf8').match(/=\s*(\[.*?\])/)[1]);
const ALL = [['a1', 20], ['a2', 20], ['b1', 14], ['b2', 14]].flatMap(([lv, n]) => Array.from({ length: n }, (_, i) => lv + '-' + String(i + 1).padStart(2, '0')));
const LOCKED = ALL.filter(id => !READY.includes(id));
const url = id => B + '/lessons/' + id.replace('-', '/lesson-') + '/index.html';

await c.go(B + '/index.html?lang=ar&lts=' + Date.now(), 2500);
let s = JSON.parse(await c.ev(`JSON.stringify({lang:I18N.lang, btn:document.querySelector('[data-lang-toggle]').textContent,
  banner:!!document.querySelector('.ar-trial'), soon:[...document.querySelectorAll('.lesson-card.ar-soon .lc-status')].filter(e=>e.textContent==='🔒 قريبًا').length,
  open:document.querySelectorAll('.lesson-card:not(.ar-soon)').length,
  cyr:[...document.querySelectorAll('.home-main *')].filter(e=>!e.children.length && ${CYR}.test(e.textContent)).map(e=>e.textContent.trim()).slice(0,10)})`));
check('главная на ar, кнопка AR', s.lang === 'ar' && s.btn === 'AR', s);
check('плашка пробной версии', s.banner);
check(`${LOCKED.length} уроков «скоро», открыто ${READY.length}`, s.soon === LOCKED.length && s.open === READY.length, s);
check('в основной части нет кириллицы', s.cyr.length === 0, s.cyr);
await c.shot('ar-home.png');
if (LOCKED.length) {
  await c.ev(`document.querySelector('a[href*="${LOCKED[0].replace('-', '/lesson-')}/"]').click()`); await c.wait(400);
  check('клик по закрытому уроку не уводит', await c.ev('location.pathname') === '/index.html');
  check('тост «скоро»', await c.ev(`!!document.querySelector('.ar-toast')`));
}

// все готовые уроки: обе плашки и ни строчки кириллицы
for (const id of READY.filter(id => id !== 'a1-01')) {
  await c.go(url(id), 2500);
  const r = JSON.parse(await c.ev(`JSON.stringify({n:document.querySelectorAll('.ar-trial').length,
    cyr:[...document.querySelectorAll('.lesson-content *, .lesson-header *')].filter(e=>!e.children.length && ${CYR}.test(e.textContent)).map(e=>e.textContent.trim()).slice(0,15)})`));
  check(`урок ${id}: плашки и нет кириллицы`, r.n === 2 && r.cyr.length === 0, r);
}

await c.go(B + '/lessons/a1/lesson-01/index.html', 3000);
s = JSON.parse(await c.ev(`JSON.stringify({n:document.querySelectorAll('.ar-trial').length,
  tg:[...document.querySelectorAll('.ar-trial')].every(b=>b.textContent.includes('@ObiVan1978')),
  cyr:[...document.querySelectorAll('.lesson-content *, .lesson-header *')].filter(e=>!e.children.length && ${CYR}.test(e.textContent)).map(e=>e.textContent.trim()).slice(0,15)})`));
check('урок A1-01: две плашки с @ObiVan1978', s.n === 2 && s.tg, s);
check('урок A1-01: нет кириллицы', s.cyr.length === 0, s.cyr);
await c.shot('ar-lesson-top.png');
await c.ev(`document.querySelectorAll('.ar-trial')[1].scrollIntoView({block:'center'})`); await c.wait(500);
await c.shot('ar-lesson-bottom.png');

// зеркальный интерфейс: меню справа, немецкий текст не перевёрнут
const FLIPPED = `(()=>{const bad=[];const w=document.createTreeWalker(document.body,4);let n;
 while(n=w.nextNode()){const t=n.nodeValue,s=t.trim();if(s.length<2||/[\u0600-\u06FF]/.test(s)||!/[A-Za-zÄÖÜäöüß]/.test(s)||!/[.!?…:]$/.test(s))continue;
  const el=n.parentElement;if(!el||!el.getClientRects().length)continue;
  const i0=t.indexOf(s[0]),i1=t.lastIndexOf(s[s.length-1]),r=document.createRange();
  r.setStart(n,i0);r.setEnd(n,i0+1);const a=r.getBoundingClientRect();r.setStart(n,i1);r.setEnd(n,i1+1);const b=r.getBoundingClientRect();
  if(a.width&&b.width&&Math.abs(a.top-b.top)<=4&&b.left<a.left)bad.push(s.slice(0,30))}
 return bad})()`;
check('<html dir="rtl">', await c.ev(`document.documentElement.dir`) === 'rtl');
let flipped = [];
for (let i = 0; i <= 4; i++) { if (i) { await c.ev(`document.querySelectorAll('.ex-tab')[${i-1}].click()`); await c.wait(300); } flipped.push(...await c.ev(FLIPPED)); }
check('немецкая пунктуация не перевёрнута (все упражнения)', flipped.length === 0, flipped);
await c.ev(`openSidebar()`); await c.wait(500);
check('меню выезжает справа', await c.ev(`(()=>{const r=document.querySelector('.sidebar').getBoundingClientRect();return Math.round(r.right)===innerWidth})()`));

if (LOCKED.length) {
  await c.go(url(LOCKED[0]), 2500);
  check('непереведённый урок: плашка «ещё нет»', await c.ev(`(document.querySelector('.ar-trial')||{}).textContent?.includes('غير متوفرة') || false`));
  await c.shot('ar-locked.png');
}

// книги: готовые открыты, остальные «скоро»; в готовых (все главы, словарь,
// мета) — ни строчки кириллицы
const BOOKS = JSON.parse(readFileSync(new URL('../../i18n/ar/ready.js', import.meta.url), 'utf8').match(/I18N_READY_BOOKS\s*=\s*(\[.*?\])/)[1]);
await c.go(B + '/books.html', 2500);
s = JSON.parse(await c.ev(`JSON.stringify({cards:document.querySelectorAll('.lib-card').length,
  locked:[...document.querySelectorAll('.lib-card.ar-soon [data-book-id]')].map(b=>b.dataset.bookId),
  open:[...document.querySelectorAll('.lib-card:not(.ar-soon) [data-book-id]')].map(b=>b.dataset.bookId),
  cyr:(()=>{const out=[],w=document.createTreeWalker(document.getElementById('libContent'),4);let n;while(n=w.nextNode())if(${CYR}.test(n.nodeValue))out.push(n.nodeValue.trim());return out.slice(0,10)})()})`));
check(`библиотека: открыто ${BOOKS.length}, остальные «скоро»`, (s.open.length === BOOKS.length && s.open.every(id => BOOKS.includes(id)) && s.locked.length === s.cards - BOOKS.length), s);
check('библиотека: нет кириллицы', s.cyr.length === 0, s.cyr);
await c.shot('ar-books.png');
if (s.locked.length) {
  await c.ev(`document.querySelector('.lib-card.ar-soon [data-book-id]').click()`); await c.wait(400);
  check('закрытая книга не открывается, тост', await c.ev(`!!document.querySelector('.ar-toast') && !document.querySelector('.rd-chapter, .rd-text')`));
}
for (const id of BOOKS) {
  const r = JSON.parse(await c.ev(`(async()=>{const get=f=>fetch('data/books/${id}/'+f).then(r=>r.json());
    const meta=await get('meta.json');const files=['meta.json','glossary.json'];for(let i=1;i<=meta.chapters;i++)files.push('ch-'+String(i).padStart(2,'0')+'.json');
    const bad=[];for(const f of files){const d=await get(f);(function w(o,k){if(typeof o==='string'){if(${CYR}.test(o)&&k!=='w')bad.push(f+': '+o.slice(0,60))}else if(o&&typeof o==='object')for(const [kk,v] of Object.entries(o))w(v,k==='w'?'w':kk)})(d,'')}
    return JSON.stringify({files:files.length,bad:bad.slice(0,10)})})()`, true));
  check(`книга ${id}: ${r.files} файлов без кириллицы`, r.bad.length === 0, r.bad);
}
// реальный клик мышью в центр элемента (ловит и перекрытые кнопки)
async function mouse(sel) {
  const r = JSON.parse(await c.ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});const b=e.getBoundingClientRect();
    const x=b.left+b.width/2,y=b.top+b.height/2,t=document.elementFromPoint(x,y);return JSON.stringify({x,y,hit:!!t&&(t===e||e.contains(t))})})()`));
  for (const type of ['mousePressed', 'mouseReleased']) await c.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
  await c.wait(800);
  return r.hit;
}
// первое слово, видимое в окне страницы
const firstWord = `(()=>{const v=document.getElementById('rdViewport').getBoundingClientRect();
  return [...document.querySelectorAll('#rdContent .bw, #rdContent .brw')].find(w=>{const b=w.getBoundingClientRect();return b.width&&b.left>=v.left-1&&b.right<=v.right+1})?.textContent||''})()`;
// x-координаты символов текстового узла
const glyphX = id => `(()=>{const n=document.getElementById('${id}').firstChild,r=document.createRange(),o={};
  for(let i=0;i<n.length;i++){r.setStart(n,i);r.setEnd(n,i+1);const ch=n.data[i];if(!(ch in o))o[ch]=r.getBoundingClientRect().left}return JSON.stringify(o)})()`;
if (BOOKS.length) {
  await c.ev(`Reader.open('${BOOKS[0]}')`); await c.wait(2500);
  // листание: колонки-страницы идут слева направо и в арабском интерфейсе
  const w0 = await c.ev(firstWord);
  check('ридер: кнопка «вперёд» доступна для клика', await mouse('#rdNext'));
  const w1 = await c.ev(firstWord);
  check('ридер: «вперёд» показывает следующую страницу', w0 && w1 && w0 !== w1, { w0, w1 });
  await mouse('#rdPrev');
  check('ридер: «назад» возвращает страницу', await c.ev(firstWord) === w0);
  let g = JSON.parse(await c.ev(glyphX('rdPrev')));
  check('ридер: стрелка «назад» слева от слова', g['‹'] < g['ر'], g);
  g = JSON.parse(await c.ev(glyphX('rdPages')));
  check('ридер: счётчик «ف. 1 / N» читается справа налево, дробь слева направо', g['ف'] > g['1'] && g['1'] < g['/'], g);
  await mouse('#rdFullTranslationBtn');
  const t0 = await c.ev(firstWord);
  await mouse('#rdNext');
  const t1 = await c.ev(firstWord);
  check('ридер: перевод тоже листается', t0 && t1 && t0 !== t1, { t0, t1 });
  await mouse('#rdFullTranslationBtn');
  await c.shot('ar-reader.png');
  await c.ev(`document.getElementById('rdFullTranslationBtn').click()`); await c.wait(800);
  await c.shot('ar-reader-translation.png');
  await c.ev(`document.getElementById('rdFullTranslationBtn').click(); document.getElementById('rdInterlinearBtn').click()`); await c.wait(800);
  await c.shot('ar-reader-interlinear.png');
  check('ридер: перевод и подстрочник без кириллицы', await c.ev(`(()=>{const w=document.createTreeWalker(document.getElementById('rdContent'),4);let n;while(n=w.nextNode())if(${CYR}.test(n.nodeValue))return false;return true})()`));
  await c.ev(`document.getElementById('rdInterlinearBtn').click()`);
  check('ридер открыл готовую книгу', await c.ev(`!document.getElementById('libView') || getComputedStyle(document.getElementById('libView')).display==='none' || document.getElementById('libView').hidden`));
}

await c.go(B + '/index.html?lang=uk&lts=' + Date.now(), 2000);
check('uk без плашек и без RTL', await c.ev(`I18N.lang==='uk' && !document.querySelector('.ar-trial') && document.documentElement.dir!=='rtl'`));
check('ошибок JS нет', c.errors().length === 0, c.errors());
c.close();
console.log(fails ? `ПРОВАЛЕНО: ${fails}` : 'ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
process.exit(fails ? 1 : 0);
