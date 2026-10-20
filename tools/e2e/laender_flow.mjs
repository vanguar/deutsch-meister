// E2E: раздел «Земли Германии» (laender.html). Нужны Chrome и сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/laender_flow.mjs
// Проверяет: плитку на главной и порядок плиток, витрину (16 земель на
// карте и в списке, неготовые — серые «в разработке»), выбор земли на карте,
// уровень B1/B2, игру «Найди землю», страницу готовой земли (паспорт,
// источник, оглавление), чтение текста в ридере (подсказка над КАЖДЫМ
// словом, глава из оглавления, «назад»), тест земли, закрашенную после
// чтения землю, телефон без горизонтальной прокрутки, светлую тему, языки
// uk и ar (без русского текста), отсутствие ошибок в консоли.
import { start } from './cdp.mjs';
import { readFileSync } from 'fs';

const B = 'http://127.0.0.1:8765';
const LANDS = JSON.parse(readFileSync(new URL('../../data/laender/lands.json', import.meta.url), 'utf8')).lands;
const READY = LANDS.filter(l => l.ready);
const c = await start(9339);
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 8000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

let nav = 0;
const _go = c.go;
c.go = (url, ms) => _go(url.replace(/(\.html)(#|$)/, `$1?n=${++nav}$2`), ms);
const NO_HSCROLL = `document.documentElement.scrollWidth <= window.innerWidth + 1`;
const allErrors = [];
const collect = () => allErrors.push(...c.errors());
const HUB_READY = `typeof Laender !== 'undefined' && document.querySelectorAll('.ld-shape').length === 16 && document.querySelectorAll('.ld-card').length === 16`;

await c.go(B + '/index.html', 800);
await c.ev(`localStorage.clear(); localStorage.setItem('dm_theme', 'dark')`);

// ── Главная: плитка и порядок ──
await c.go(B + '/index.html', 800);
ok(await waitFor(`!!document.getElementById('readLaender') && typeof openLaenderPage === 'function'`, 20000), 'главная: плитка «Земли Германии»');
const order = await c.ev(`[...document.querySelectorAll('.read-grid .read')].map(b => b.id).join()`);
ok(order === 'readDialogs,readLaender,readBooks,readNews,readFahrschule', `главная: порядок плиток ${order}`);
await c.ev(`document.getElementById('readLaender').click()`);
ok(await waitFor(`/laender\\.html/.test(location.pathname)`, 8000), 'главная → laender.html');
collect();

// ── Витрина ──
await c.go(B + '/laender.html', 800);
ok(await waitFor(HUB_READY, 20000), 'витрина: 16 земель на карте и в списке');
ok(await c.ev(`document.querySelectorAll('.ld-shape.is-soon').length === ${16 - READY.length} && document.querySelectorAll('.ld-card.is-soon').length === ${16 - READY.length}`),
  `неготовые земли серые: ${16 - READY.length}`);
ok(await c.ev(`document.querySelectorAll('.ld-shape.is-ready').length === ${READY.length}`), `готовые на карте подсвечены: ${READY.length}`);
ok(await c.ev(`[...document.querySelectorAll('.ld-card')].slice(0, ${READY.length}).every(c => !c.classList.contains('is-soon'))`), 'готовые — в начале списка');
ok(await c.ev(`[...document.querySelectorAll('.ld-card.is-soon')].every(c => /В разработке/.test(c.textContent))`), 'у неготовых — «В разработке»');
ok(await c.ev(`[...document.querySelectorAll('.ld-flag')].every(i => i.complete && i.naturalWidth > 0)`) || await waitFor(`[...document.querySelectorAll('.ld-flag')].every(i => i.complete && i.naturalWidth > 0)`, 5000), 'флаги загрузились');
ok(await c.ev(NO_HSCROLL), 'витрина: без горизонтальной прокрутки');
await c.shot('ld_hub.png');

// тап по серой земле на карте: карточка «в разработке»
const soonId = LANDS.find(l => !l.ready).id;
await c.ev(`document.querySelector('.ld-shape[data-land="${soonId}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
ok(await waitFor(`/в разработке/.test(document.getElementById('ldPick').textContent) && document.querySelector('.ld-shape[data-land="${soonId}"]').classList.contains('is-sel')`, 3000),
  'карта: серая земля выбрана, «в разработке»');
// карточка серой земли — тост, страница не открывается
await c.ev(`document.querySelector('.ld-card.is-soon').click()`);
ok(await waitFor(`document.getElementById('newsToast').classList.contains('show')`, 2000) && await c.ev(`!location.hash`), 'серая карточка: тост, без перехода');

// уровень B2 запоминается
await c.ev(`document.querySelector('[data-level="b2"]').click()`);
ok(await c.ev(`localStorage.getItem('dm_land_level') === 'b2' && document.querySelector('[data-level="b2"]').classList.contains('is-on')`), 'уровень B2 выбран и сохранён');
await c.ev(`document.querySelector('[data-level="b1"]').click()`);

// ── Игра «Найди землю» ──
await c.ev(`document.getElementById('ldGameBtn').click()`);
ok(await waitFor(`!!Laender.game && /Wo liegt/.test(document.getElementById('ldGame').textContent)`, 3000), 'игра: вопрос «Wo liegt …?»');
ok(await c.ev(`document.querySelectorAll('.ld-label.is-on').length === 0`), 'игра: подписей на карте нет');
const tap = id => c.ev(`document.querySelector('.ld-shape[data-land="${id}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
// первый ответ верный, второй — неверный
let want = await c.ev(`Laender.game.order[Laender.game.i]`);
await tap(want);
ok(await waitFor(`document.querySelector('.ld-shape[data-land="${want}"]').classList.contains('is-ok') && Laender.game.score === 1`, 2000), 'игра: верный ответ — зелёным, +1');
await waitFor(`Laender.game.i === 1 && !Laender.game.lock`, 3000);
want = await c.ev(`Laender.game.order[1]`);
const wrong = LANDS.map(l => l.id).find(id => id !== want);
await tap(wrong);
ok(await waitFor(`document.querySelector('.ld-shape[data-land="${wrong}"]').classList.contains('is-bad') && document.querySelector('.ld-shape[data-land="${want}"]').classList.contains('is-ok')`, 2000),
  'игра: неверный ответ — красным, верная земля зелёным');
await c.shot('ld_game.png');
for (let k = 2; k <= 10; k++) {
  await waitFor(`!Laender.game.lock`, 3000);
  if (k === 10) break;
  await tap(await c.ev(`Laender.game.order[Laender.game.i]`));
}
ok(await waitFor(`/Результат/.test(document.getElementById('ldGame').textContent) && localStorage.getItem('dm_land_game') === '9'`, 4000), 'игра: итог 9 из 10, рекорд сохранён');
await c.ev(`document.querySelector('[data-game="stop"]').click()`);
ok(await c.ev(`!Laender.game && document.getElementById('ldGame').hidden`), 'игра закрыта');
collect();

// ── Готовые земли ──
for (const land of READY) {
  await c.go(B + '/laender.html', 800);
  await waitFor(HUB_READY, 20000);
  await c.ev(`document.querySelector('.ld-shape[data-land="${land.id}"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
  ok(await waitFor(`!!document.querySelector('#ldPick [data-open="${land.id}"]')`, 3000), `${land.id}: карта → карточка с «Открыть»`);
  await c.ev(`document.querySelector('#ldPick [data-open]').click()`);
  ok(await waitFor(`location.hash === '#l=${land.id}' && !document.getElementById('ldLand').hidden`, 5000), `${land.id}: страница земли`);
  ok(await c.ev(`document.querySelectorAll('.ld-fact').length === ${land.facts.length} && !!document.querySelector('.ld-src a[href^="https://"]')`), `${land.id}: паспорт и источник`);
  ok(await c.ev(`document.querySelectorAll('.ld-read').length === ${Object.keys(land.texts).length}`), `${land.id}: уровни ${Object.keys(land.texts).join(', ')}`);
  ok(await c.ev(NO_HSCROLL), `${land.id}: без горизонтальной прокрутки`);
  await c.shot(`ld_${land.id}.png`);

  // каждый текст: открыть, подсказка у каждого слова, все главы
  for (const [lv, t] of Object.entries(land.texts)) {
    await c.go(`${B}/laender.html#l=${land.id}`, 800);
    await waitFor(`!!document.querySelector('[data-read="${t.id}"]')`, 20000);
    await c.ev(`document.querySelector('[data-read="${t.id}"]').click()`);
    ok(await waitFor(`Reader.state.open && Reader.state.chapters.length === ${t.chapters} && document.querySelectorAll('#rdContent .bw').length > 10`, 15000),
      `${t.id}: открыт в ридере, глав ${t.chapters}`);
    ok(await c.ev(`location.hash === '#land=${t.id}'`), `${t.id}: адрес #land=`);
    const audit = JSON.parse(await c.ev(`(() => { const g = Reader.state.gloss; const bad = []; let n = 0;
      Reader.state.chapters.forEach(ch => ch.paragraphs.forEach(p => (p.s || []).forEach(s =>
        (s.de.match(/[\\p{L}\\p{M}]+(?:[-'’][\\p{L}\\p{M}]+)*/gu) || []).forEach(w => { n++;
          const lm = g.w[w.toLowerCase()]; const key = lm && (lm.l || lm); if (!key || !g.l[key]) bad.push(w); }))));
      return JSON.stringify({ n, bad: [...new Set(bad)] }); })()`));
    ok(audit.n > 200 && audit.bad.length === 0, `${t.id}: подсказка у каждого из ${audit.n} слов ${audit.bad.slice(0, 5).join(', ')}`);
    await c.shot(`ld_${t.id}.png`);
    // «назад» — на страницу земли
    await c.ev(`document.getElementById('rdBack').click()`);
    ok(await waitFor(`!Reader.state.open && location.hash === '#l=${land.id}'`, 5000), `${t.id}: «назад» → страница земли`);
  }
  // глава из оглавления
  const tid = Object.values(land.texts)[0].id;
  await c.ev(`document.querySelector('[data-chapter="2"][data-tid="${tid}"]') && document.querySelector('[data-chapter="2"][data-tid="${tid}"]').click()`);
  ok(await waitFor(`Reader.state.open && Reader.state.chIndex === 2`, 10000), `${land.id}: глава 3 из оглавления`);
  // дочитали — земля зелёная
  await c.ev(`localStorage.setItem('dm_book_pos:${tid}', JSON.stringify({ chapter: 0, p: 0, s: 0, percent: 100 }))`);
  await c.ev(`document.getElementById('rdBack').click()`);
  await waitFor(`!Reader.state.open`, 5000);
  await c.ev(`document.getElementById('ldToHub').click()`);
  ok(await waitFor(`!document.getElementById('ldHub').hidden && document.querySelector('.ld-shape[data-land="${land.id}"]').classList.contains('is-read')`, 5000), `${land.id}: прочитана — зелёная на карте`);

  // тест земли: все ответы верные
  await c.go(`${B}/laender.html#l=${land.id}`, 800);
  await waitFor(`!!document.querySelector('[data-quiz="start"]')`, 20000);
  await c.ev(`document.querySelector('[data-quiz="start"]').click()`);
  for (let i = 0; i < land.quiz.length; i++) {
    await waitFor(`!!document.querySelector('.ld-opt')`, 3000);
    await c.ev(`document.querySelector('.ld-opt[data-opt="${land.quiz[i].a}"]').click()`);
    ok(await c.ev(`!!document.querySelector('.ld-opt.is-right') && !!document.querySelector('.ld-why.is-right')`), `${land.id} тест ${i + 1}: верно, пояснение`);
    await c.ev(`document.querySelector('[data-quiz="next"]').click()`);
  }
  ok(await waitFor(`/${land.quiz.length}\\s*из\\s*${land.quiz.length}/.test(document.querySelector('.ld-quiz-result').textContent.replace(/\\s+/g, ' '))`, 3000)
    && await c.ev(`localStorage.getItem('dm_land_quiz:${land.id}') === '${land.quiz.length}'`), `${land.id}: тест пройден, результат сохранён`);
  collect();
}

// ── Светлая тема ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
await c.go(B + '/laender.html', 800);
await waitFor(HUB_READY, 20000);
await c.shot('ld_hub_light.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);

// ── Языки ──
for (const lang of ['uk', 'ar']) {
  await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: '${lang}', ts: Date.now() }))`);
  await c.go(B + '/laender.html', 1000);
  ok(await waitFor(HUB_READY, 20000), `${lang}: витрина`);
  const pages = [await c.ev(`document.body.innerText`)];
  for (const land of READY) {
    await c.go(`${B}/laender.html#l=${land.id}`, 1000);
    await waitFor(`!document.getElementById('ldLand').hidden && !!document.querySelector('.ld-fact')`, 20000);
    pages.push(await c.ev(`document.body.innerText`));
    const t = Object.values(land.texts)[0];
    await c.ev(`document.querySelector('[data-read="${t.id}"]').click()`);
    await waitFor(`Reader.state.open && document.querySelectorAll('#rdContent .bw').length > 10`, 15000);
    await c.ev(`Reader.toggleFullTranslation()`);
    await c.wait(500);
    pages.push(await c.ev(`document.getElementById('rdContent').innerText`));
    await c.shot(`ld_${lang}_${t.id}.png`);
  }
  const txt = pages.join('\n');
  if (lang === 'ar') {
    const bad = txt.match(/[^\n]*[А-Яа-яЁёІіЇїЄєҐґ][^\n]*/);
    ok(!bad, `ar: нет кириллицы ${bad ? bad[0].slice(0, 80) : ''}`);
    ok(await c.ev(`document.documentElement.dir === 'rtl'`), 'ar: RTL');
  } else {
    const bad = txt.match(/[^\n]*[ЫыЭэЪъЁё][^\n]*/);
    ok(!bad, `uk: нет русских букв ${bad ? bad[0].slice(0, 80) : ''}`);
  }
  await c.go(B + '/laender.html', 800);
  await waitFor(HUB_READY, 20000);
  await c.shot(`ld_hub_${lang}.png`);
  collect();
}
await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: 'ru', ts: Date.now() }))`);

ok(allErrors.length === 0, `нет ошибок в консоли ${allErrors.slice(0, 3).join(' | ')}`);
c.close();
console.log(fail ? `\nFAIL: ${fail}` : '\nlaender_flow: всё ок');
process.exit(fail ? 1 : 0);
