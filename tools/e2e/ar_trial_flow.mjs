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

await c.go(B + '/index.html?lang=uk&lts=' + Date.now(), 2000);
check('uk без плашек и без RTL', await c.ev(`I18N.lang==='uk' && !document.querySelector('.ar-trial') && document.documentElement.dir!=='rtl'`));
check('ошибок JS нет', c.errors().length === 0, c.errors());
c.close();
console.log(fails ? `ПРОВАЛЕНО: ${fails}` : 'ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
process.exit(fails ? 1 : 0);
