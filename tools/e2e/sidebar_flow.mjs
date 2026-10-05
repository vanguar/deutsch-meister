// E2E: плашки бокового меню (Книги, Новости, Поддержать, Связь с автором).
// Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/sidebar_flow.mjs
// Проверяет на главной и в уроке: все четыре плашки на месте и в нужном
// порядке, ничего не обрезано и не вылезает, плашки не перекрыты (клик
// попадает в саму плашку), каждая ведёт куда надо, «Связь» открывает
// Telegram @ObiVan1978, тёмная и светлая темы, язык uk, маленький экран.
import { start, SP } from './cdp.mjs';

const B = 'http://127.0.0.1:8765';
const c = await start();
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 6000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

const PAGES = [
  { name: 'главная', url: '/index.html' },
  { name: 'урок A1-01', url: '/lessons/a1/lesson-01/index.html' },
  { name: 'урок B2-14', url: '/lessons/b2/lesson-14/index.html' }
];

// Снимок плашек: порядок на экране, размеры, перекрытие, обрезка текста
const SNAPSHOT = `(() => {
  const box = document.querySelector('.sidebar-extra');
  const sb = document.querySelector('.sidebar');
  if (!box) return JSON.stringify({ none: true });
  box.scrollIntoView({ block: 'end' });
  const items = [...box.querySelectorAll('.side-action')].map(b => {
    const r = b.getBoundingClientRect();
    const t = b.querySelector('.sa-title'), s = b.querySelector('.sa-sub');
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      cls: b.className, top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width),
      title: t ? t.textContent.trim() : '', sub: s ? s.textContent.trim() : '',
      hit: !!hit && b.contains(hit),
      badge: (() => { const n = b.querySelector('.sa-new'); if (!n) return null; const q = n.getBoundingClientRect();
        return { inside: q.left >= sb.getBoundingClientRect().left && q.right <= sb.getBoundingClientRect().right,
                 hit: (() => { const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!e && n.contains(e); })() }; })(),
      clip: b.scrollWidth > b.clientWidth + 1 || (s && s.scrollWidth > s.clientWidth + 1),
      icoBg: getComputedStyle(b.querySelector('.sa-ico')).backgroundColor,
      chevron: getComputedStyle(b, '::after').content
    };
  }).sort((a, b) => a.top - b.top);
  return JSON.stringify({ items, sbW: Math.round(sb.getBoundingClientRect().width),
    hScroll: sb.scrollWidth > sb.clientWidth + 1 });
})()`;

async function checkPage(p, width, height, label) {
  await c.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await c.go(B + p.url, 1800);
  await waitFor(`document.querySelectorAll('.side-action.contact').length > 0`);
  if (width <= 860) { await c.ev('openSidebar()'); await c.wait(500); }
  const s = JSON.parse(await c.ev(SNAPSHOT));
  const tag = `${p.name} ${label}`;
  ok(!s.none, `${tag}: блок плашек есть`);
  if (s.none) return;
  // «Установить на телефон» (js/install-app.js) — необязательная, всегда сверху
  const kinds = s.items.map(i => ['books', 'news', 'donate', 'contact'].find(k => i.cls.split(' ').includes(k)) || 'install');
  if (kinds[0] === 'install') { kinds.shift(); s.items.shift(); }
  ok(kinds.join(',') === 'books,news,donate,contact', `${tag}: порядок — ${kinds.join(', ')}`);
  ok(s.items.length === 4, `${tag}: плашек ${s.items.length} (+ «Установить»), по одной каждой`);
  ok(s.items.every(i => i.h <= 72), `${tag}: плашки компактные, не больше 72px (${s.items.map(i => i.h).join('/')})`);
  ok(s.items.every(i => i.h >= 48), `${tag}: высота плашек ≥ 48px (${s.items.map(i => i.h).join('/')})`);
  ok(s.items.every(i => i.hit), `${tag}: ничто не перекрывает плашки (клик попадает в них)`);
  ok(s.items.every(i => !i.clip) && !s.hScroll, `${tag}: текст не обрезан, нет горизонтальной прокрутки`);
  ok(s.items.every(i => i.icoBg !== 'rgba(0, 0, 0, 0)' && i.chevron !== 'none'), `${tag}: иконка в плитке и шеврон`);
  const badge = s.items[1].badge;
  ok(badge && badge.inside && badge.hit, `${tag}: бейдж «Есть статьи» виден целиком`);
  const contact = s.items[3];
  ok(/@ObiVan1978/.test(contact.sub), `${tag}: в «Связи» указан @ObiVan1978 — «${contact.title} / ${contact.sub}»`);
  return s;
}

// ── Русский, тёмная тема: телефон и десктоп ──
await c.go(B + '/index.html', 800);
await c.ev(`localStorage.clear(); localStorage.setItem('dm_theme', 'dark')`);
for (const p of PAGES) {
  await checkPage(p, 390, 844, '390');
  await c.shot(`sidebar_${p.url.replace(/\W+/g, '_')}_390.png`);
}
await checkPage(PAGES[0], 1280, 800, '1280');
await c.shot('sidebar_index_1280.png');
await checkPage(PAGES[1], 360, 640, '360×640');
await c.shot('sidebar_lesson_360.png');

// ── Действия ──
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.go(B + '/index.html', 1500);
await waitFor(`document.querySelectorAll('.side-action.contact').length > 0`);
// «Связь»: в браузере — новая вкладка с t.me/ObiVan1978
const opened = await c.ev(`(() => { const log = []; window.open = (u, t) => { log.push(u + ' ' + t); return null; };
  document.querySelector('.side-action.contact').click(); return log.join(';'); })()`);
ok(opened === 'https://t.me/ObiVan1978 _blank', `«Связь» в браузере открывает ${opened}`);
// «Связь» внутри Telegram: через openTelegramLink, без window.open
const tg = await c.ev(`(() => { const log = []; window.Telegram = { WebApp: { openTelegramLink: u => log.push('tg ' + u),
  HapticFeedback: { impactOccurred() {} } } }; window.open = u => log.push('win ' + u);
  document.querySelector('.side-action.contact').click(); return log.join(';'); })()`);
ok(tg === 'tg https://t.me/ObiVan1978', `«Связь» в мини-аппе: ${tg}`);
// «Поддержать» — модалка
await c.go(B + '/index.html', 1500);
await c.ev(`document.querySelector('.side-action.donate').click()`);
ok(await waitFor(`!!document.querySelector('.dm-modal, .dm-overlay.show, .dm-sheet') || /Поддержать/.test(document.body.innerText.slice(-3000))`, 3000),
  '«Поддержать» открывает окно поддержки');
// «Книги» и «Новости» — переходы
await c.ev(`document.querySelector('.side-action.books').click()`);
ok(await waitFor(`location.pathname.endsWith('/books.html')`), '«Книги» ведут на books.html');
await c.go(B + '/lessons/a2/lesson-05/index.html', 1800);
await waitFor(`document.querySelectorAll('.side-action.news').length > 0`);
await c.ev(`document.querySelector('.side-action.news').click()`);
ok(await waitFor(`location.pathname.endsWith('/news.html')`), '«Новости» из урока ведут на news.html');
ok(await waitFor(`document.querySelectorAll('.news-card').length === 5`), 'на news.html — 5 статей');

// ── Светлая тема ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
const light = await checkPage(PAGES[0], 390, 844, 'светлая');
await c.shot('sidebar_index_light.png');
const light2 = await checkPage(PAGES[1], 390, 844, 'светлая');
await c.shot('sidebar_lesson_light.png');
ok(light && light2 && light.items[0].icoBg !== light.items[3].icoBg, 'у плашек разные цвета плиток');

// ── Украинский ──
await c.ev(`localStorage.setItem('dm_theme', 'dark'); localStorage.setItem('dm_lang', JSON.stringify({lang:'uk', ts: Date.now()}))`);
for (const p of PAGES.slice(0, 2)) {
  const s = await checkPage(p, 390, 844, 'uk');
  await c.wait(400);
  const t = JSON.parse(await c.ev(SNAPSHOT));
  const titles = t.items.map(i => i.title + ' / ' + i.sub).join(' | ');
  ok(/Зв.язок з автором/.test(titles) && /Зауваження/.test(titles) && /@ObiVan1978/.test(titles), `uk ${p.name}: ${titles}`);
  ok(!/Астроном/.test(titles), `uk ${p.name}: в меню нет упоминания астрономии`);
  await c.shot(`sidebar_${p.url.replace(/\W+/g, '_')}_uk.png`);
}

// ── Нигде в меню нет «Астрономия … скоро» ──
await c.ev(`localStorage.removeItem('dm_lang')`);
await c.go(B + '/index.html', 1500);
await waitFor(`document.querySelectorAll('.side-action.news').length > 0`);
const newsSub = await c.ev(`document.querySelector('.side-action.news .sa-sub').textContent`);
ok(!/Астроном|скоро/i.test(newsSub), `подпись «Новостей» без астрономии: «${newsSub}»`);

const errs = c.errors();
ok(errs.length === 0, 'нет ошибок JS' + (errs.length ? ': ' + errs.join(' | ') : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ', '· скриншоты:', SP);
process.exit(fail ? 1 : 0);
