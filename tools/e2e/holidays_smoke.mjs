// Run from the repository with: node --experimental-websocket tools/e2e/holidays_smoke.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { start } from './cdp.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const prefix = '/deutsch-meister/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
const requests = [];
let failCatalog = false;
let catalogFixture = null;
let slowHoliday = '';
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const name = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
  const file = path.resolve(root, name);
  requests.push(name);
  if (!url.pathname.startsWith(prefix) || !file.startsWith(path.resolve(root) + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  if (name.endsWith('holidays/index.json')) {
    if (failCatalog) {
      response.writeHead(503).end();
      return;
    }
    if (catalogFixture) {
      response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(catalogFixture));
      return;
    }
  }
  const reply = () => {
    try {
      const content = fs.readFileSync(file);
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(content);
    } catch (_) {
      response.writeHead(404).end();
    }
  };
  if (slowHoliday && name.includes(slowHoliday + '/')) setTimeout(reply, 900);
  else reply();
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
let browser;
try {
  browser = await start(9415, ['--no-proxy-server']);
  const { ev, go, send, wait } = browser;
  async function until(expression) {
    for (let attempt = 0; attempt < 200; attempt++) {
      if (await ev(expression)) return;
      await wait(40);
    }
    throw new Error(`Timed out: ${expression}\n${browser.errors().join('\n')}`);
  }
  const click = selector => ev(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const calendar = `document.querySelector('#holidayCalendar')?.getAttribute('aria-busy') === 'false'`;
  const opened = slug => until(`typeof Reader !== 'undefined' && Reader.state.bookId === '${slug}' && !document.querySelector('#rdView').hidden && document.querySelector('#rdState').hidden && !!document.querySelector('#rdContent .bw')`);
  const setPrefs = (language, theme) => ev(`localStorage.setItem('dm_lang', JSON.stringify({lang:'${language}',ts:Date.now()})); localStorage.setItem('dm_theme', '${theme}');`);
  const gridDate = slug => `.hd-days [data-holiday="${slug}"]`;
  const fallDate = 'holiday-buss-und-bettag';
  const reformDate = 'holiday-reformationstag';
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `{
    const NativeDate = Date;
    window.calendarTestNow = '2026-11-18T12:00:00Z';
    window.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [window.calendarTestNow])); }
      static now() { return new NativeDate(window.calendarTestNow).valueOf(); }
    };
  }` });
  const setTime = iso => ev(`window.calendarTestNow = '${iso}'; document.dispatchEvent(new Event('visibilitychange'))`);
  await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 900, deviceScaleFactor: 1, mobile: false });
  await go(base + 'index.html', 1000);
  await until(`!!document.querySelector('#readHolidays')`);
  assert.match(await ev(`document.querySelector('#readHolidays').getAttribute('href')`), /^holidays\.html(?:#holiday=holiday-buss-und-bettag)?$/);
  assert.ok(!requests.includes('data/holidays/holiday-buss-und-bettag/ch-01.json'), 'Home does not load holiday articles');
  await ev(`document.querySelector('#readHolidays').scrollIntoView()`);
  await until(`document.querySelector('#readHolidays').hash === '#holiday=${fallDate}'`);
  await setTime('2026-11-18T23:00:00Z');
  assert.equal(await ev(`document.querySelector('#readHolidays').getAttribute('href')`), 'holidays.html');
  await setTime('2026-11-18T12:00:00Z');
  await click('#readHolidays');
  await opened(fallDate);
  await click('#rdBack');
  await until(calendar + ` && document.querySelector('#rdView').hidden`);
  assert.equal(await ev(`document.querySelector(${JSON.stringify(gridDate(fallDate))}).getAttribute('aria-current')`), 'date');
  await setTime('2026-11-18T23:00:00Z');
  assert.equal(await ev(`document.querySelector('#holidayDays [aria-current="date"]').dataset.date`), '2026-11-19');
  await setTime('2026-11-18T12:00:00Z');
  await click('[data-month-step="-1"]');
  assert.equal(await ev(`document.querySelectorAll('.hd-days [data-holiday]').length`), 3);
  assert.equal(await ev(`getComputedStyle(document.querySelector('#holidayRetry')).display`), 'none');
  assert.match(await ev('location.search'), /month=2026-10/);
  const dayIds = selector => ev(`Array.from(document.querySelectorAll(${JSON.stringify(selector)}), link => link.dataset.holiday)`);
  const assertSameDates = async () => assert.deepEqual(await dayIds('.hd-days [data-holiday]'), await dayIds('#holidayList [data-holiday]'));
  await assertSameDates();

  await click('[data-month-step="-1"]');
  assert.match(await ev('location.search'), /month=2026-09/);
  assert.deepEqual(await dayIds('#holidayList [data-holiday]'), []);
  await assertSameDates();
  assert.equal(await ev(`document.querySelector('#holidayNextDate').hidden`), false);
  await click('#holidayNextDate');
  assert.match(await ev('location.search'), /month=2026-10/);
  await assertSameDates();
  assert.equal(await ev(`document.querySelector('#holidayNextDate').hidden`), true);

  await click('[data-month-step="1"]');
  await click('[data-month-step="1"]');
  assert.match(await ev('location.search'), /month=2026-12/);
  assert.deepEqual(await dayIds('#holidayList [data-holiday]'), []);
  await click('#holidayNextDate');
  assert.match(await ev('location.search'), /month=2027-01/);
  assert.deepEqual(await dayIds('.hd-days [data-holiday]'), ['holiday-dreikoenige']);
  await assertSameDates();
  for (let i = 0; i < 3; i++) await click('[data-month-step="-1"]');
  await browser.shot('dm-calendar-desktop.png');

  await click(gridDate(reformDate));
  await opened(reformDate);
  assert.equal(await ev(`getComputedStyle(document.querySelector('#rdView')).backgroundColor`), await ev(`getComputedStyle(document.body).backgroundColor`));
  assert.equal(await ev(`document.querySelectorAll('#rdContent [data-reader-external]').length`), 3);
  await ev(`window.holidaySpeech = []; TTS.speak = (text, options) => {
    holidaySpeech.push(text);
    options.onStart?.();
    queueMicrotask(() => options.onEnd?.(true));
  };`);
  await click('#rdSpeakBtn');
  await until(`holidaySpeech.some(text => text.includes('Reformationstag'))`);
  await click('#rdFullTranslationBtn');
  await until(`document.querySelector('#rdContent .brw') && document.getElementById('rdFullTranslationBtn').getAttribute('aria-pressed') === 'true'`);
  assert.match(await ev(`document.querySelector('.rd-chapter-heading').textContent`), /Реформации/);
  await ev('history.back()');
  await until(`document.querySelector('#rdView').hidden && document.activeElement.getAttribute('data-holiday') === '${reformDate}'`);
  await ev('history.forward()');
  await opened(reformDate);
  await send('Page.reload');
  await opened(reformDate);
  await click('#rdBack');
  await until(`document.querySelector('#rdView').hidden && ${calendar}`);
  assert.match(await ev('location.search'), /month=2026-10/);

  // The reader must ignore the previous request after the user goes back and opens another date.
  slowHoliday = 'holiday-deutsche-einheit-tag';
  await click(gridDate(slowHoliday));
  await click('#rdBack');
  await until(`document.querySelector('#rdView').hidden`);
  await click(gridDate('holiday-nationalfeiertag-oesterreich'));
  await opened('holiday-nationalfeiertag-oesterreich');
  await wait(1100);
  assert.match(await ev(`document.querySelector('.rd-chapter-heading').textContent`), /Österreichischer/);
  await click('#rdDictBtn');
  await until(`!document.querySelector('#rdDict').hidden && document.querySelector('#rdDictList').textContent.length > 0`);
  await click('#rdDictBack');
  slowHoliday = '';

  for (const [language, theme, width] of [['uk', 'light', 390], ['ar', 'dark', 320]]) {
    await setPrefs(language, theme);
    await send('Emulation.setDeviceMetricsOverride', { width, height: 820, deviceScaleFactor: 1, mobile: true });
    await go(base + 'holidays.html?month=2026-08', 300);
    await until(calendar);
    assert.equal(await ev('I18N.lang'), language);
    assert.equal(await ev('document.documentElement.scrollWidth <= innerWidth'), true);
    assert.equal(await ev(`getComputedStyle(document.querySelector('.hd-layout')).gridTemplateColumns.split(' ').length`), 1);
    if (language === 'ar') assert.equal(await ev('document.documentElement.dir'), 'rtl');
    assert.equal(await ev(`document.documentElement.dataset.theme`), theme);
    await browser.shot(`dm-calendar-mobile-${language}.png`);
    await click(gridDate('holiday-augsburger-friedensfest'));
    await opened('holiday-augsburger-friedensfest');
    await click('#rdFullTranslationBtn');
    await until(`!!document.querySelector('#rdContent .brw')`);
    const translation = await ev(`document.querySelector('.rd-chapter-heading').textContent`);
    assert.match(translation, language === 'ar' ? /أوغسبورغ/ : /Аугсбурзі/);
    assert.deepEqual(browser.errors(), []);
  }

  // Load failure and retry leave the calendar usable.
  failCatalog = true;
  await go(base + 'holidays.html?month=2026-08', 300);
  await until(calendar);
  assert.equal(await ev(`document.querySelector('#holidayRetry').hidden`), false);
  failCatalog = false;
  await click('#holidayRetry');
  await until(calendar + ` && document.querySelector('.hd-days [data-holiday]')`);
  await click('#holidayToday');
  assert.match(await ev('location.search'), /month=2026-11/);
  assert.equal(await ev(`document.querySelector(${JSON.stringify(gridDate(fallDate))}).getAttribute('aria-current')`), 'date');
  await setPrefs('ru', 'dark');
  await go(base + 'history.html#history=deutsche-einheit', 400);
  await opened('deutsche-einheit');
  assert.equal(await ev(`document.querySelector('#rdBack').title`), 'К оглавлению');
  await click('#rdBack');
  await until(`document.querySelector('#rdView').hidden && document.querySelectorAll('#hiToc a').length === 14`);
  assert.deepEqual(browser.errors(), []);

  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/holidays/index.json'), 'utf8'));
  catalogFixture = { version: 1, items: [{ ...catalog.items[0], rule: { type: 'fixed', month: 2, day: 30 } }] };
  await go(base + 'holidays.html?month=2026-07&fixture=malformed', 200);
  await until(calendar);
  assert.equal(await ev(`document.querySelector('#holidayRetry').hidden`), false);
  await click('[data-month-step="1"]');
  assert.equal(await ev(`document.querySelector('#holidayDays a, #holidayList a')`), null);
  catalogFixture = null;
  await click('#holidayRetry');
  await until(calendar + ` && document.querySelectorAll('#holidayList a').length === 2`);
  assert.match(await ev('location.search'), /month=2026-08/);
  assert.deepEqual(browser.errors(), []);

  const [first, second] = catalog.items;
  catalogFixture = { version: 1, items: [first, { ...second, rule: first.rule }] };
  await go(base + 'holidays.html?month=2027-01&fixture=shared#holiday-list-2027-01-06', 200);
  await until(calendar);
  assert.equal(await ev('document.activeElement.id'), 'holiday-list-2027-01-06');
  assert.equal(await ev(`document.querySelector('#holidayDays a').hash`), '#holiday-list-2027-01-06');
  assert.equal(await ev(`document.querySelectorAll('#holidayList a').length`), 2);
  await click('#holidayDays a');
  assert.equal(await ev('document.activeElement.id'), 'holiday-list-2027-01-06');
  await click(`#holidayList a[data-holiday="${second.id}"]`);
  await opened(second.id);
  await click('#rdBack');
  await until(`document.querySelector('#rdView').hidden && document.activeElement.dataset.holiday === '${second.id}'`);
  assert.deepEqual(browser.errors(), []);
  catalogFixture = null;

  await go(base + 'holidays.html?fixture=deep#holiday=holiday-augsburger-friedensfest', 200);
  await opened('holiday-augsburger-friedensfest');
  assert.equal(await ev('document.activeElement.id'), 'rdBack');
  await click('#rdBack');
  await until(`document.querySelector('#rdView').hidden && document.activeElement.dataset.holiday === 'holiday-augsburger-friedensfest'`);
  assert.match(await ev('location.search'), /month=2026-08/);
  await send('Page.reload');
  await until(calendar);
  assert.deepEqual(await dayIds('#holidayList [data-holiday]'), ['holiday-bundesfeier', 'holiday-augsburger-friedensfest']);

  await click('[data-lang-toggle]');
  await until(calendar + ` && I18N.lang === 'uk' && document.querySelector('#holidayList a')?.textContent.includes('Швейцарії')`);
  assert.match(await ev('location.search'), /month=2026-08/);

  const fixed = [
    ['01-06', 'dreikoenige'], ['03-08', 'frauentag'], ['08-01', 'bundesfeier'], ['08-08', 'augsburger-friedensfest'],
    ['10-03', 'deutsche-einheit-tag'], ['10-26', 'nationalfeiertag-oesterreich'], ['10-31', 'reformationstag']
  ];
  const movable = {
    2026: [['04-05', 'ostern'], ['06-04', 'fronleichnam'], ['11-18', 'buss-und-bettag']],
    2027: [['03-28', 'ostern'], ['05-27', 'fronleichnam'], ['11-17', 'buss-und-bettag']],
    2028: [['04-16', 'ostern'], ['06-15', 'fronleichnam'], ['11-22', 'buss-und-bettag']]
  };
  for (const [language, theme, width] of [['ru', 'dark', 1000], ['uk', 'light', 390], ['ar', 'dark', 320]]) {
    await setPrefs(language, theme);
    await send('Emulation.setDeviceMetricsOverride', { width, height: 820, deviceScaleFactor: 1, mobile: width < 600 });
    await go(base + `holidays.html?month=2026-01&matrix=${language}`, 250);
    await until(calendar + ` && I18N.lang === '${language}'`);
    for (const year of [2026, 2027, 2028]) {
      for (let month = 1; month <= 12; month++) {
        const query = `${year}-${String(month).padStart(2, '0')}`;
        const expected = fixed.concat(movable[year]).filter(([day]) => day.startsWith(query.slice(-2)))
          .sort(([left], [right]) => left.localeCompare(right)).map(([day, slug]) => [`${year}-${day}`, `holiday-${slug}`]);
        const view = await ev(`(() => {
          const cells = [...document.querySelector('#holidayDays').children];
          return { month: new URLSearchParams(location.search).get('month'),
            days: cells.flatMap(cell => cell.firstElementChild ? [cell.firstElementChild.dataset.date] : []),
            firstColumn: cells.findIndex(cell => cell.firstElementChild),
            grid: [...document.querySelectorAll('#holidayDays a')].map(link => [link.dataset.date, link.dataset.holiday]),
            list: [...document.querySelectorAll('#holidayList a')].map(link => [link.querySelector('time').dateTime, link.dataset.holiday]),
            jump: !document.querySelector('#holidayNextDate').hidden,
            fit: document.documentElement.scrollWidth <= innerWidth };
        })()`);
        const context = `${language} ${query}`;
        assert.equal(view.month, query, context);
        const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
        assert.deepEqual(view.days, Array.from({ length: count }, (_, index) => `${query}-${String(index + 1).padStart(2, '0')}`), context);
        assert.equal(view.firstColumn, (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7, context);
        assert.deepEqual(view.grid, expected, context);
        assert.deepEqual(view.list, expected, context);
        assert.equal(view.jump, expected.length === 0, context);
        assert.equal(view.fit, true, context);
        await click('[data-month-step="1"]');
      }
    }

    const section = language === 'ru' ? 'data/holidays' : `i18n/${language}/holidays`;
    const localized = JSON.parse(fs.readFileSync(path.join(root, section, 'index.json'), 'utf8'));
    for (const { id, titleRu, region } of localized.items) {
      await go(base + `holidays.html?sample=${id}#holiday=${id}`, 160);
      await opened(id);
      assert.equal(await ev(`document.querySelector('.rd-chapter-kicker span:nth-child(2)').textContent`), region);
      assert.ok(await ev(`document.querySelector('#rdContent [data-reader-external]')?.href.startsWith('https://')`));
      await click('#rdFullTranslationBtn');
      await until(`!!document.querySelector('#rdContent .brw')`);
      assert.equal(await ev(`document.querySelector('.rd-chapter-heading').textContent`), titleRu);
      assert.deepEqual(browser.errors(), []);
    }
    console.log(`PASS Chromium ${language}: 36 months (2026–2028) and all 10 texts`);
  }

  await until(`!!navigator.serviceWorker.controller`);
  const cachedId = catalog.items.at(-1).id;
  const filenames = ['meta.json', 'ch-01.json', 'glossary.json'];
  await until(`Promise.all(${JSON.stringify(filenames)}.map(name => caches.match('i18n/ar/holidays/${cachedId}/' + name))).then(files => files.every(Boolean))`);
  const network = { latency: 0, downloadThroughput: -1, uploadThroughput: -1 };
  await send('Network.enable');
  await send('Network.emulateNetworkConditions', { ...network, offline: true });
  try {
    await go(base + 'holidays.html?offline=1#holiday=' + cachedId, 200);
    await opened(cachedId);
    assert.deepEqual(browser.errors(), []);
  } finally {
    await send('Network.emulateNetworkConditions', { ...network, offline: false });
  }
  console.log('PASS Chromium: home, all ten texts, reader, navigation, sources, translation, mobile RTL, retry, offline and history');
} finally {
  browser?.close();
  server.close();
}
