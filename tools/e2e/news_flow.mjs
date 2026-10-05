// E2E: раздел «Новости». Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/news_flow.mjs
// Проверяет ленту (рубрики, свежесть, уровень, даты), статью в ридере
// (фото целиком на странице, подписи, подсказки, перевод), язык uk.
import { start, SP } from './cdp.mjs';

const B = 'http://127.0.0.1:8765';
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
  await waitFor(`document.querySelectorAll('.news-card').length > 0`);
  await c.ev(`NewsFeed.open(${JSON.stringify(id)})`);
  ok(await waitFor(`document.querySelector('#rdContent .rd-news-opening') && !document.getElementById('rdView').hidden`),
    `${id} @${width}: статья открылась`);
  const early = await c.ev(`(() => { const ct = document.getElementById('rdContent'); const st = Reader.state;
    return Math.floor([...ct.querySelectorAll('.bw')].pop().offsetLeft / (st.width + st.gap)) <= st.pages - 1; })()`);
  ok(early, `${id}: сразу после открытия (фото ещё грузятся) страниц хватает на весь текст`);
  await c.wait(1200);   // картинки и шрифты
  const r = JSON.parse(await c.ev(`(() => {
    const vp = document.getElementById('rdViewport').getBoundingClientRect();
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

// ── Лента ──
await c.go(`${B}/news.html`, 1500);
await waitFor(`document.querySelectorAll('.news-card').length > 0`);
const feed = JSON.parse(await c.ev(`JSON.stringify({
  cards: [...document.querySelectorAll('.news-card')].map(a => ({
    title: a.querySelector('.nc-title').textContent, fresh: a.classList.contains('is-fresh'),
    lead: a.classList.contains('is-lead'), unread: a.classList.contains('is-unread'),
    level: a.querySelector('.nc-level').textContent, dates: a.querySelector('.nc-dates').textContent.replace(/\\s+/g,' ') })),
  live: [...document.querySelectorAll('.news-tile.is-live')].map(t => t.querySelector('.news-tile-title').textContent),
  soon: [...document.querySelectorAll('.news-tile.is-soon')].map(t => t.querySelector('.news-tile-title').textContent),
  scrollX: document.documentElement.scrollWidth > innerWidth
})`));
ok(feed.cards.length === 3, `лента: ${feed.cards.length} статьи`);
ok(feed.cards[0].lead, `первая — главная: ${feed.cards[0].title}`);
ok(feed.cards.every(x => x.level), 'у каждой статьи уровень: ' + feed.cards.map(x => x.level).join(', '));
ok(feed.cards.every(x => /Опубликовано/.test(x.dates) && /В приложении/.test(x.dates)), 'у каждой обе даты');
ok(feed.cards.some(x => x.fresh), 'свежие подсвечены: ' + feed.cards.filter(x => x.fresh).map(x => x.title.slice(0, 20)).join(' | '));
ok(feed.live.length === 1 && feed.soon.length === 2, `рубрики: есть статьи — ${feed.live}, скоро — ${feed.soon}`);
ok(!feed.scrollX, 'нет горизонтальной прокрутки на 390px');
await c.shot('news_feed_390.png');
console.log('ошибки JS:', c.errors());

for (const id of ['saturn-opposition-2026', 'crew-13-iss-2026', 'juice-erde-2026']) {
  await checkArticle(id, 390, 844);
}
await checkArticle('juice-erde-2026', 1280, 800);
await checkArticle('saturn-opposition-2026', 360, 640);

// отметка «Новое» снялась после открытия
await c.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await c.go(`${B}/news.html`, 1500);
await waitFor(`document.querySelectorAll('.news-card').length > 0`);
ok(await c.ev(`document.querySelectorAll('.news-card.is-unread').length`) === 0, 'после чтения отметки «Новое» сняты');
await c.shot('news_feed_1280.png');

// ── Украинский ──
await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({lang:'uk', ts: Date.now()}))`);
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.go(`${B}/news.html`, 2000);
await waitFor(`document.querySelectorAll('.news-card').length > 0`);
await c.wait(500);
const uk = JSON.parse(await c.ev(`JSON.stringify({ ru: document.querySelector('.nc-title-ru').textContent,
  feed: document.getElementById('newsFeedTitle').textContent, h1: document.querySelector('.news-h1').textContent,
  dates: document.querySelector('.nc-dates').textContent.replace(/\\s+/g,' ') })`));
ok(/[іїєґ]/i.test(uk.ru), 'uk: заголовок статьи переведён: ' + uk.ru);
ok(/Стрічка/.test(uk.feed) && /Опубліковано/.test(uk.dates), 'uk: интерфейс ленты: ' + uk.feed + ' / ' + uk.dates);
await c.shot('news_feed_uk.png');
await c.ev(`NewsFeed.open('juice-erde-2026')`);
await waitFor(`document.querySelector('#rdContent .rd-news-opening')`);
await c.wait(1200);
const ukA = await c.ev(`document.querySelector('#rdContent .rd-chapter-translation').textContent + ' | ' + document.querySelector('.rd-fig figcaption').textContent.slice(0, 60)`);
ok(/[іїєґ]/i.test(ukA), 'uk: статья и подписи: ' + ukA);
const miss = await c.ev(`(() => { const g = Reader.state.gloss; return [...document.querySelectorAll('#rdContent .bw')]
  .filter(w => !ReaderTip.lookup(g, w.dataset.t)).map(w => w.textContent).join(', '); })()`);
ok(!miss, 'uk: подсказки у всех слов' + (miss ? ' — нет у: ' + miss : ''));
await c.shot('news_article_uk.png');

const errs = c.errors();
ok(errs.length === 0, 'нет ошибок JS' + (errs.length ? ': ' + errs.join(' | ') : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ', '· скриншоты:', SP);
process.exit(fail ? 1 : 0);
