// E2E: раздел «Новости». Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/news_flow.mjs
// Проверяет витрину рубрик (счётчики, последняя статья, свежесть), страницы
// рубрик (только свои статьи, порядок, уровень, даты, «назад»), статью в
// ридере (фото целиком на странице, подписи, подсказки, перевод), язык uk.
import { start, SP } from './cdp.mjs';

const B = 'http://127.0.0.1:8765';
const RUBRICS = ['astronomy', 'science', 'economy', 'events'];
const READY = `document.querySelectorAll('.news-tile.is-live').length > 0`;
const CARDS = `document.querySelectorAll('.news-card').length > 0`;
const c = await start();
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 6000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

async function checkArticle(id, width, height) {
  await c.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await c.go(`${B}/news.html`, 800);
  await waitFor(READY);
  await c.ev(`NewsFeed.open(${JSON.stringify(id)})`);
  ok(await waitFor(`document.querySelector('#rdContent .rd-news-opening') && !document.getElementById('rdView').hidden`),
    `${id} @${width}: статья открылась`);
  const early = await c.ev(`(() => { const ct = document.getElementById('rdContent'); const st = Reader.state;
    return Math.floor([...ct.querySelectorAll('.bw')].pop().offsetLeft / (st.width + st.gap)) <= st.pages - 1; })()`);
  ok(early, `${id}: сразу после открытия (фото ещё грузятся) страниц хватает на весь текст`);
  await c.wait(1200);   // картинки и шрифты
  const r = JSON.parse(await c.ev(`(() => {
    const ct = document.getElementById('rdContent');
    const h = parseFloat(ct.style.height);
    const figs = [...ct.querySelectorAll('.rd-fig')].map(f => ({
      h: f.getBoundingClientRect().height, rects: f.getClientRects().length,
      img: f.querySelector('img').naturalWidth, cap: f.querySelector('figcaption').textContent.trim().length
    }));
    const step = Reader.state.width + Reader.state.gap;
    const lastCol = Math.floor([...ct.querySelectorAll('.bw')].pop().offsetLeft / step);
    return JSON.stringify({ h, figs, lastCol, pages: Reader.state.pages, words: ct.querySelectorAll('.bw').length,
      dates: ct.querySelector('.rd-news-dates').textContent.replace(/\\s+/g, ' ').trim(),
      level: (ct.querySelector('.rd-news-level') || {}).textContent });
  })()`));
  ok(r.lastCol <= r.pages - 1, `${id}: последнее слово на странице ${r.lastCol + 1} из ${r.pages} — текст не теряется`);
  ok(r.figs.length >= 3, `${id}: фото в статье: ${r.figs.length}`);
  ok(r.figs.every(f => f.img > 0), `${id}: все фото загрузились`);
  ok(r.figs.every(f => f.h <= r.h + 1 && f.rects === 1), `${id}: каждое фото целиком на одной странице (стр. ${Math.round(r.h)}px)`);
  ok(r.figs.every(f => f.cap > 10), `${id}: у всех фото есть подписи`);
  ok(/Опубликовано|Опубліковано/.test(r.dates) && /\d{2}\.\d{2}\.2026.*\d{2}\.\d{2}\.2026/.test(r.dates), `${id}: две даты: ${r.dates}`);
  ok(!!r.level, `${id}: уровень в шапке: ${r.level}`);
  // каждая страница: листаем до конца, ошибок нет
  for (let i = 0; i < r.pages - 1; i++) { await c.ev('Reader.next()'); await c.wait(220); }
  ok(await c.ev('Reader.state.page') === r.pages - 1, `${id}: пролистано страниц: ${r.pages}`);
  await c.shot(`news_${id}_${width}_last.png`);
  await c.ev('Reader.goTo(0, { animate: false })');
  await c.wait(200);
  await c.shot(`news_${id}_${width}_p1.png`);
  // подсказка у каждого немецкого слова есть в глоссарии
  const miss = await c.ev(`(() => { const g = Reader.state.gloss; return [...document.querySelectorAll('#rdContent .bw')]
    .filter(w => !ReaderTip.lookup(g, w.dataset.t)).map(w => w.textContent).join(', '); })()`);
  ok(!miss, `${id}: подсказки у всех слов${miss ? ' — нет у: ' + miss : ''}`);
  // подстрочник и полный перевод
  await c.ev('Reader.toggleInterlinear()'); await c.wait(300);
  ok(await c.ev(`document.querySelectorAll('#rdContent .rd-gl-layer *').length > 10`), `${id}: подстрочник рисуется`);
  await c.shot(`news_${id}_${width}_gloss.png`);
  await c.ev('Reader.toggleFullTranslation()'); await c.wait(300);
  ok(await c.ev(`document.getElementById('rdContent').classList.contains('rd-full-translation')`), `${id}: полный перевод`);
  await c.ev('Reader.toggleFullTranslation()'); await c.wait(100);
  await c.ev('Reader.close()'); await c.wait(400);
}

// ── Витрина рубрик ──
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.go(`${B}/news.html`, 1500);
await waitFor(READY);
const idx = JSON.parse(await c.ev(`fetch('data/news/index.json').then(r => r.text())`)).items;
const byDate = (a, b) => (b.published + b.added).localeCompare(a.published + a.added);
const hub = JSON.parse(await c.ev(`JSON.stringify({
  tiles: [...document.querySelectorAll('.news-tile')].map(t => ({ id: t.dataset.rubric, live: t.classList.contains('is-live'),
    fresh: t.classList.contains('is-fresh'), last: (t.querySelector('.ntl-title') || {}).textContent,
    count: +(t.querySelector('.news-tile-count b') || {}).textContent })),
  cards: document.querySelectorAll('.news-card').length,
  rubricHidden: document.getElementById('newsRubric').hidden,
  scrollX: document.documentElement.scrollWidth > innerWidth
})`));
ok(idx.length === 8, `статей в индексе: ${idx.length}`);
ok(hub.tiles.map(t => t.id).join() === RUBRICS.join(), 'рубрики: ' + hub.tiles.map(t => t.id).join(', '));
ok(hub.tiles.every(t => t.live), 'во всех рубриках есть статьи');
ok(hub.cards === 0 && hub.rubricHidden, 'на витрине нет «простыни» статей — только рубрики');
for (const t of hub.tiles) {
  const list = idx.filter(it => it.rubric === t.id).sort(byDate);
  ok(t.count === list.length && t.last === list[0].title, `${t.id}: ${t.count} шт., последняя — ${t.last}`);
}
ok(hub.tiles.some(t => t.fresh), 'рубрики со свежим подсвечены: ' + hub.tiles.filter(t => t.fresh).map(t => t.id));
ok(!hub.scrollX, 'витрина: нет горизонтальной прокрутки на 390px');
await c.shot('news_hub_390.png');

// ── Страница рубрики: переход, порядок, «назад» ──
async function rubricPage() {
  return JSON.parse(await c.ev(`JSON.stringify({
    hash: location.hash, hubHidden: document.getElementById('newsHub').hidden,
    cards: [...document.querySelectorAll('.news-card')].map(a => ({ id: a.dataset.id,
      lead: a.classList.contains('is-lead'), level: a.querySelector('.nc-level').textContent,
      dates: a.querySelector('.nc-dates').textContent.replace(/\\s+/g, ' ') })),
    scrollX: document.documentElement.scrollWidth > innerWidth })`));
}
for (const r of RUBRICS) {
  await c.go(`${B}/news.html`, 900);
  await waitFor(READY);
  await c.ev(`document.querySelector('.news-tile[data-rubric="${r}"]').click()`);
  await waitFor(CARDS);
  const p = await rubricPage();
  const list = idx.filter(it => it.rubric === r).sort(byDate);
  ok(p.hash === '#r=' + r && p.hubHidden, `${r}: открылась своя страница (${p.hash}), витрина скрыта`);
  ok(p.cards.length === list.length && p.cards.every((x, i) => x.id === list[i].id),
    `${r}: только свои статьи, от новых к старым: ${p.cards.map(x => x.id).join(', ')}`);
  ok(p.cards[0].lead && p.cards.filter(x => x.lead).length === 1, `${r}: первая — самая свежая и главная`);
  ok(p.cards.every(x => x.level && /Опубликовано/.test(x.dates) && /В приложении/.test(x.dates)), `${r}: у каждой уровень и обе даты`);
  ok(!p.scrollX, `${r}: нет горизонтальной прокрутки`);
  await c.shot(`news_rubric_${r}_390.png`);
  // статья из рубрики и обратно — остаёмся в рубрике
  await c.ev(`document.querySelector('.news-card [data-news]').click()`);
  await waitFor(`!document.getElementById('rdView').hidden`);
  await c.wait(500);
  await c.ev('history.back()');
  await waitFor(`document.getElementById('rdView').hidden`);
  await c.wait(200);
  ok(await c.ev(`location.hash === '#r=${r}' && !document.getElementById('newsRubric').hidden`), `${r}: «назад» из статьи — снова рубрика`);
  await c.ev('history.back()');
  ok(await waitFor(`!document.getElementById('newsHub').hidden && !location.hash`), `${r}: «назад» из рубрики — витрина`);
}
// кнопка «← Все рубрики» и прямая ссылка на рубрику
await c.go(`${B}/news.html#r=science`, 1200);
await waitFor(CARDS);
ok(await c.ev(`document.getElementById('newsFeedTitle').textContent === 'Наука'`), 'прямая ссылка #r=science открывает рубрику');
await c.ev(`document.getElementById('newsToHub').click()`);
ok(await waitFor(`!document.getElementById('newsHub').hidden && document.querySelectorAll('.news-tile').length === 4`), '«← Все рубрики» ведёт на витрину');
// прямая ссылка на статью: под ней её рубрика
await c.go(`${B}/news.html#news=plastiksteuer-2027`, 1500);
ok(await waitFor(`!document.getElementById('rdView').hidden`), 'ссылка #news=… открывает статью');
await c.ev('Reader.close()');
ok(await waitFor(`location.hash === '#r=economy' && document.querySelectorAll('.news-card').length > 0`), 'после статьи по ссылке — её рубрика');
console.log('ошибки JS:', c.errors());

for (const id of idx.map(it => it.id)) {
  await checkArticle(id, 390, 844);
}
await checkArticle('nobelpreis-physik-2026', 1280, 800);
await checkArticle('plastiksteuer-2027', 360, 640);
await checkArticle('oktoberfest-rekord-2026', 360, 640);
await checkArticle('juice-erde-2026', 1280, 800);

// отметка «Новое» снялась после открытия
await c.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await c.go(`${B}/news.html`, 1500);
await waitFor(READY);
ok(await c.ev(`document.querySelectorAll('.news-tile-unread').length`) === 0, 'после чтения отметки «новые» на витрине сняты');
await c.shot('news_hub_1280.png');
await c.go(`${B}/news.html#r=events`, 1500);
await waitFor(CARDS);
ok(await c.ev(`document.querySelectorAll('.news-card.is-unread').length`) === 0, 'и в рубрике тоже');
await c.shot('news_rubric_1280.png');

// ── Украинский ──
await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({lang:'uk', ts: Date.now()}))`);
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.go(`${B}/news.html`, 2000);
await waitFor(READY);
await c.wait(500);
const ukHub = await c.ev(`[...document.querySelectorAll('.news-tile-text, .news-tile-go')].map(e => e.textContent).join(' | ')`);
ok(/Дослідження/.test(ukHub) && /Відкрити/.test(ukHub), 'uk: витрина рубрик: ' + ukHub.slice(0, 140));
await c.shot('news_hub_uk.png');
await c.go(`${B}/news.html#r=science`, 2000);
await waitFor(CARDS);
await c.wait(500);
const uk = JSON.parse(await c.ev(`JSON.stringify({ ru: document.querySelector('.nc-title-ru').textContent,
  back: document.getElementById('newsToHub').textContent,
  dates: document.querySelector('.nc-dates').textContent.replace(/\\s+/g, ' ') })`));
ok(/[іїєґ]/i.test(uk.ru), 'uk: заголовок статьи переведён: ' + uk.ru);
ok(/Усі рубрики/.test(uk.back) && /Опубліковано/.test(uk.dates), 'uk: интерфейс рубрики: ' + uk.back + ' / ' + uk.dates);
await c.shot('news_rubric_uk.png');
for (const id of ['nobelpreis-physik-2026', 'plastiksteuer-2027', 'oktoberfest-rekord-2026', 'juice-erde-2026']) {
  await c.ev(`NewsFeed.open('${id}')`);
  await waitFor(`document.querySelector('#rdContent .rd-news-opening')`);
  await c.wait(1000);
  const t = await c.ev(`document.querySelector('#rdContent .rd-chapter-translation').textContent + ' | ' + document.querySelector('.rd-fig figcaption').textContent.slice(0, 60)`);
  ok(/[іїєґ]/i.test(t), `uk ${id}: ` + t.slice(0, 120));
  const miss = await c.ev(`(() => { const g = Reader.state.gloss; return [...document.querySelectorAll('#rdContent .bw')]
    .filter(w => !ReaderTip.lookup(g, w.dataset.t)).map(w => w.textContent).join(', '); })()`);
  ok(!miss, `uk ${id}: подсказки у всех слов` + (miss ? ' — нет у: ' + miss : ''));
  await c.ev('Reader.close()'); await c.wait(400);
}
await c.ev(`NewsFeed.open('nobelpreis-physik-2026')`);
await waitFor(`document.querySelector('#rdContent .rd-news-opening')`);
await c.wait(1200);
await c.shot('news_article_uk.png');
await c.ev('Reader.close()'); await c.wait(300);

const errs = c.errors();
ok(errs.length === 0, 'нет ошибок JS' + (errs.length ? ': ' + errs.join(' | ') : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ', '· скриншоты:', SP);
process.exit(fail ? 1 : 0);
