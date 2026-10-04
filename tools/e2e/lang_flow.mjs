// E2E: язык бот ↔ приложение. Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/lang_flow.mjs
// /api/lang подменяется через CDP Fetch — сеть и токен бота не нужны.
// Сценарий Telegram: бот ↔ приложение. /api/lang подменяется через CDP Fetch.
import { start } from './cdp.mjs';
const c = await start();
const B = 'http://127.0.0.1:8765';
let server = { lang: null, ts: 0 };      // «Redis» бота
const posts = [];
await c.send('Fetch.enable', { patterns: [{ urlPattern: '*api/lang*' }, { urlPattern: '*telegram.org*' }] });
setInterval(async () => {
  while (c.events.some(e => e.method === 'Fetch.requestPaused')) {
    const i = c.events.findIndex(e => e.method === 'Fetch.requestPaused');
    const ev = c.events.splice(i, 1)[0].params;
    if (/telegram\.org/.test(ev.request.url)) { await c.send('Fetch.failRequest', { requestId: ev.requestId, errorReason: 'Failed' }); continue; }
    let body = {};
    if (ev.request.method === 'POST') {
      try { body = JSON.parse(ev.request.postData || '{}'); } catch {}
      posts.push(body);
      if (body.lang && (!server.ts || Number(body.ts) >= server.ts)) server = { lang: body.lang, ts: Number(body.ts) };
    }
    const resp = ev.request.method === 'OPTIONS' ? '' : JSON.stringify({ ok: true, lang: server.lang, ts: server.ts });
    await c.send('Fetch.fulfillRequest', { requestId: ev.requestId, responseCode: ev.request.method === 'OPTIONS' ? 204 : 200,
      responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }, { name: 'Access-Control-Allow-Headers', value: 'Content-Type' }],
      body: Buffer.from(resp).toString('base64') });
  }
}, 50);
const tg = code => '#tgWebAppData=' + encodeURIComponent('user=' + encodeURIComponent(JSON.stringify({ id: 42, language_code: code })) + '&auth_date=1&hash=x') + '&tgWebAppVersion=7.0';
const state = async () => JSON.parse(await c.ev(`JSON.stringify({lang:I18N.lang, stored:localStorage.getItem('dm_lang'), btn:(document.querySelector('[data-lang-toggle]')||{}).textContent, title:(document.querySelector('.logo-sub')||{}).textContent})`));
let fails = 0;
const ok = (n, cond, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + n + (cond ? '' : '  → ' + JSON.stringify(x))); if (!cond) fails++; };
const newSession = async () => { await c.ev(`sessionStorage.clear()`); };

console.log('1. Пользователь выбрал «Українська» в боте, открыл приложение кнопкой меню без ?lang (язык Telegram — ru)');
server = { lang: 'uk', ts: 500 };
await c.go(B + '/index.html' + tg('ru'), 5000);
let s = await state();
ok('приложение подтянуло uk с сервера', s.lang === 'uk', s);
ok('выбор записан на устройство с ts бота', s.stored === JSON.stringify({ lang: 'uk', ts: 500 }), s.stored);
ok('интерфейс на украинском', s.title === 'Німецька A1 → B2' && s.btn === 'UA', s);

console.log('2. Нажал старую кнопку бота из прошлого сообщения (?lang=ru, lts=100)');
await newSession();
await c.go(B + '/index.html?lang=ru&lts=100' + tg('ru'), 4000);
s = await state();
ok('старая кнопка не перебила свежий выбор', s.lang === 'uk', s);

console.log('3. Сменил язык в боте на русский → новая кнопка (?lang=ru, lts=900)');
server = { lang: 'ru', ts: 900 };
await newSession();
await c.go(B + '/index.html?lang=ru&lts=900' + tg('ru'), 4000);
s = await state();
ok('приложение на русском', s.lang === 'ru' && s.title === 'Немецкий A1 → B2' && s.btn === 'RU', s);

console.log('4. Переключил язык в самом приложении (кнопка RU/UA)');
posts.length = 0;
await c.ev(`I18N.toggle()`);
await c.wait(4000);
s = await state();
ok('после перезагрузки — украинский', s.lang === 'uk', s);
ok('выбор отправлен на сервер (бот узнает)', posts.some(p => p.lang === 'uk' && p.initData), posts);
ok('сервер хранит uk', server.lang === 'uk', server);

console.log('5. Повторный вход через меню без параметров — язык сохраняется');
await newSession();
await c.go(B + '/index.html' + tg('ru'), 4000);
s = await state();
ok('uk сохранился', s.lang === 'uk', s);

console.log('6. Урок и книги открываются на выбранном языке');
await c.go(B + '/lessons/a2/lesson-03/index.html', 3000);
const lessonTitle = await c.ev(`document.querySelector('.section-title').textContent`);
ok('урок на украинском', lessonTitle === 'У лікаря', lessonTitle);
await c.go(B + '/books.html', 3000);
const libTitle = await c.ev(`document.querySelector('.lib-h1').textContent`);
ok('библиотека на украинском', libTitle === 'Бібліотека', libTitle);
ok('без JS-ошибок', c.errors().length === 0, c.errors());

console.log(fails ? `\nПРОВАЛЕНО: ${fails}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
c.close(); process.exit(0);
