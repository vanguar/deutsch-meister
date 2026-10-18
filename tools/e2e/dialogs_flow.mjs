// E2E: раздел «Диалоги» (dialogs.html). Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/dialogs_flow.mjs
// Проверяет: уровни (живые и «скоро»), список уровня, каждый диалог (фото,
// подпись автора, реплики, перевод), очередь озвучки (порядок, подсветка,
// стоп, повтор, остановка при уходе), навигацию (назад, соседние,
// прямые ссылки), телефон без горизонтальной прокрутки, языки uk и ar
// (RTL, немецкий LTR, без кириллицы), отсутствие ошибок в консоли.
// Озвучку подменяем заглушкой TTS.speak: проверяется очередь и интерфейс,
// а не звук (звука в headless нет).
import { start } from './cdp.mjs';
import { readFileSync } from 'fs';

const B = 'http://127.0.0.1:8765';
// живые уровни — те, у которых есть диалоги в data/dialogs/index.json
// (DLG_LEVELS=a1,a2 — проверить только часть)
const DATA_LEVELS = [...new Set(JSON.parse(readFileSync(new URL('../../data/dialogs/index.json', import.meta.url), 'utf8')).items.map(i => i.level))];
const LEVELS = process.env.DLG_LEVELS ? process.env.DLG_LEVELS.split(',') : DATA_LEVELS;
const c = await start();
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };

async function waitFor(expr, ms = 6000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

// Заглушка озвучки: каждая фраза «звучит» 60 мс, журнал — window.__said
const STUB = `(() => { window.__said = []; TTS.speak = (text, o) => { o = o || {};
  const rec = { text, voiceName: o.voiceName || null, pitch: o.pitch, detune: o.detune || 0, t: Date.now() };
  window.__said.push(rec); clearTimeout(window.__sayT);
  if (o.onEnd) window.__sayT = setTimeout(() => o.onEnd({ ok: true, reason: 'end' }), 60); };
  TTS.stop = () => { clearTimeout(window.__sayT); }; return true; })()`;

// Каждый переход — новая загрузка страницы: смена одного хэша на том же
// адресе браузер делает без перезагрузки, а язык и тема читаются при загрузке
let nav = 0;
const _go = c.go;
c.go = (url, ms) => _go(url.replace(/(\.html)(#|$)/, `$1?n=${++nav}$2`), ms);

const NO_HSCROLL = `document.documentElement.scrollWidth <= window.innerWidth + 1`;

async function setLang(lang) {
  await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: '${lang}', ts: Date.now() }))`);
}

await c.go(B + '/dialogs.html', 800);
await c.ev(`localStorage.clear(); localStorage.setItem('dm_theme', 'dark')`);

// ── Уровни ──
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.go(B + '/dialogs.html', 1500);
ok(await waitFor(`document.querySelectorAll('.dlg-tile').length === 4`), 'четыре плитки уровней');
const hub = JSON.parse(await c.ev(`JSON.stringify([...document.querySelectorAll('.dlg-tile')].map(t => ({
  lv: t.dataset.level, live: t.classList.contains('is-live'), n: (t.querySelector('.news-tile-count b') || {}).textContent || '' })))`));
for (const h of hub) {
  const want = LEVELS.includes(h.lv);
  ok(h.live === want && (!want || h.n === '10'), `уровень ${h.lv}: ${want ? 'живой, 10 диалогов' : '«скоро»'} (${h.live ? h.n : 'скоро'})`);
}
ok(await c.ev(NO_HSCROLL), 'уровни: нет горизонтальной прокрутки (390)');
await c.shot('dlg_hub_390.png');

// ── Каждый уровень и каждый диалог ──
const idx = JSON.parse(await c.ev(`fetch('data/dialogs/index.json').then(r => r.text())`)).items;
for (const lv of LEVELS) {
  await c.go(B + '/dialogs.html', 1000);
  await waitFor(`document.querySelectorAll('.dlg-tile.is-live').length > 0`);
  await c.ev(`document.querySelector('.dlg-tile[data-level="${lv}"]').click()`);
  ok(await waitFor(`location.hash === '#l=${lv}' && document.querySelectorAll('.dlg-item').length === 10`), `${lv}: список из 10 диалогов (#l=${lv})`);
  await c.shot(`dlg_list_${lv}.png`);
  const ids = await c.ev(`[...document.querySelectorAll('.dlg-item')].map(a => a.dataset.dialog).join(',')`);
  ok(ids === idx.filter(i => i.level === lv).map(i => i.id).join(','), `${lv}: порядок ${ids}`);
  await c.ev(`document.querySelector('.dlg-item').click()`);
  for (let k = 0; k < 10; k++) {
    const id = `${lv}-${String(k + 1).padStart(2, '0')}`;
    ok(await waitFor(`location.hash === '#d=${id}' && Dialogs.dialog && Dialogs.dialog.id === '${id}' && document.querySelectorAll('.dlg-line').length > 0`), `${id}: открыт`);
    await c.wait(600);   // фото
    const d = JSON.parse(await c.ev(`JSON.stringify({
      lines: document.querySelectorAll('.dlg-line').length, want: Dialogs.dialog.lines.length,
      img: (document.querySelector('.dlg-hero img') || {}).naturalWidth || 0,
      credit: (document.querySelector('.dlg-credit') || {}).textContent || '',
      title: document.getElementById('dlgTitle').textContent, tr: document.querySelectorAll('.dlg-tr').length,
      emptyTr: [...document.querySelectorAll('.dlg-tr')].filter(e => !e.textContent.trim()).length,
      counter: document.getElementById('dlgCounter').textContent, hs: ${NO_HSCROLL},
      sides: [...document.querySelectorAll('.dlg-line')].map(l => l.classList.contains('side-a') ? 'a' : 'b').join('') })`));
    ok(d.lines === d.want && d.lines >= 8, `${id}: реплик ${d.lines}`);
    ok(d.img === 800, `${id}: фото загрузилось (${d.img}px)`);
    ok(/Фото/.test(d.credit) && /CC|Public/.test(d.credit), `${id}: автор и лицензия: ${d.credit.trim()}`);
    ok(d.tr === d.lines && d.emptyTr === 0, `${id}: перевод у каждой реплики`);
    ok(!/aa|bb/.test(d.sides), `${id}: реплики чередуются по сторонам`);
    ok(d.counter === `${k + 1} / 10`, `${id}: счётчик ${d.counter}`);
    ok(d.hs, `${id}: нет горизонтальной прокрутки`);
    if (k === 0) await c.shot(`dlg_${id}_390.png`);
    if (k < 9) await c.ev(`document.getElementById('dlgNext').click()`);
  }
  ok(await c.ev(`document.getElementById('dlgNext').disabled`), `${lv}: на последнем диалоге «Следующий» выключен`);
  // соседние диалоги заменяют запись: «назад» ведёт к списку уровня
  await c.ev(`history.back()`);
  ok(await waitFor(`location.hash === '#l=${lv}' && !document.getElementById('dlgLevel').hidden`), `${lv}: «назад» после листания — к списку`);
}

// ── Озвучка: очередь, подсветка, стоп, повтор ──
const first = idx.find(i => i.level === LEVELS[0]).id;
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`Dialogs.dialog && document.querySelectorAll('.dlg-line').length > 0`);
await c.ev(STUB);
await c.ev(`document.getElementById('dlgPlay').click()`);
ok(await waitFor(`document.querySelector('.dlg-line.is-speaking') !== null`, 2000), 'подсветка активной реплики');
ok(await c.ev(`document.getElementById('dlgPlay').getAttribute('aria-pressed') === 'true' && /Стоп/.test(document.getElementById('dlgPlay').textContent)`), 'кнопка → «Стоп»');
ok(await waitFor(`Dialogs.playing === null`, 8000), 'диалог доигран до конца');
const said = JSON.parse(await c.ev(`JSON.stringify(window.__said)`));
const want = JSON.parse(await c.ev(`JSON.stringify(Dialogs.dialog.lines.map(l => l.de))`));
ok(said.map(s => s.text).join('|') === want.join('|'), `все ${want.length} реплик по порядку`);
const gaps = said.slice(1).map((s, i) => s.t - said[i].t);
ok(gaps.every(g => g >= 60 + 300), `паузы между репликами (${Math.min(...gaps)}–${Math.max(...gaps)} мс)`);
const plan = JSON.parse(await c.ev(`JSON.stringify(Dialogs.voicePlan())`));
const perSpeaker = JSON.parse(await c.ev(`JSON.stringify(Dialogs.dialog.lines.map(l => l.s))`));
const distinct = said.every((s, i) => JSON.stringify([s.voiceName, s.pitch, s.detune]) ===
  JSON.stringify(perSpeaker[i] === 'A' ? [plan.A.voiceName || null, plan.A.pitch, plan.A.detune || 0] : [plan.B.voiceName || null, plan.B.pitch, plan.B.detune || 0]));
ok(distinct, `у персонажей свои параметры голоса (режим ${plan.mode}: A=${JSON.stringify(plan.A)} B=${JSON.stringify(plan.B)})`);
ok(plan.two ? JSON.stringify(plan.A) !== JSON.stringify(plan.B) : JSON.stringify(plan.A) === JSON.stringify(plan.B) && !plan.A.pitch && !plan.A.detune,
  plan.two ? 'два «живых» голоса у разных персонажей' : 'один лучший голос без искажения тона — как в уроках и книгах');
ok(await c.ev(`document.querySelector('.dlg-line.is-speaking') === null && document.getElementById('dlgPlay').getAttribute('aria-pressed') === 'false'`), 'после конца — подсветка снята, кнопка «Слушать»');
ok((await c.ev(`document.getElementById('dlgVoiceNote').textContent`)).length > 10, 'подпись о голосах: ' + await c.ev(`document.getElementById('dlgVoiceNote').textContent`));
// стоп посередине и повтор
await c.ev(`window.__said = []; document.getElementById('dlgPlay').click()`);
await c.wait(500);
await c.ev(`document.getElementById('dlgPlay').click()`);
const n1 = await c.ev(`window.__said.length`);
await c.wait(700);
ok(n1 > 0 && n1 < want.length && await c.ev(`window.__said.length`) === n1 && await c.ev(`!ReaderSpeak.isPlaying() && Dialogs.playing === null`), `стоп: остановилось на ${n1}-й реплике`);
await c.ev(`window.__said = []; document.getElementById('dlgPlay').click()`);
ok(await waitFor(`Dialogs.playing === null && window.__said.length === ${want.length}`, 8000), 'повторный запуск играет диалог целиком');
// одна реплика: кнопка 🔊
await c.ev(`window.__said = []; document.querySelectorAll('.dlg-say')[2].click()`);
ok(await waitFor(`Dialogs.playing === null`, 3000) && await c.ev(`window.__said.length === 1 && window.__said[0].text === Dialogs.dialog.lines[2].de`), 'кнопка 🔊 у реплики озвучивает только её');
// реплика прерывает диалог
await c.ev(`window.__said = []; document.getElementById('dlgPlay').click()`);
await c.wait(300);
await c.ev(`document.querySelectorAll('.dlg-say')[1].click()`);
await c.wait(400);
ok(await c.ev(`Dialogs.playing === null && window.__said[window.__said.length - 1].text === Dialogs.dialog.lines[1].de && document.getElementById('dlgPlay').getAttribute('aria-pressed') === 'false'`),
  'другая озвучка корректно прерывает диалог');
// уход со страницы диалога останавливает озвучку
await c.ev(`window.__said = []; document.getElementById('dlgPlay').click()`);
await c.wait(250);
await c.ev(`document.getElementById('dlgToLevel').click()`);
const n2 = await c.ev(`window.__said.length`);
await c.wait(600);
ok(await c.ev(`window.__said.length`) === n2 && await c.ev(`!ReaderSpeak.isPlaying() && !document.getElementById('dlgLevel').hidden`), 'переход к списку останавливает озвучку');
// перевод: общий переключатель и тап по реплике
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`document.querySelectorAll('.dlg-line').length > 0`);
ok(await c.ev(`getComputedStyle(document.querySelector('.dlg-tr')).display === 'none'`), 'перевод скрыт по умолчанию');
await c.ev(`document.querySelector('.dlg-bubble').click()`);
ok(await c.ev(`getComputedStyle(document.querySelector('.dlg-tr')).display !== 'none' && getComputedStyle(document.querySelectorAll('.dlg-tr')[1]).display === 'none'`), 'тап по реплике открывает её перевод');
await c.ev(`document.getElementById('dlgTrToggle').click()`);
ok(await c.ev(`[...document.querySelectorAll('.dlg-tr')].every(e => getComputedStyle(e).display !== 'none')`), '«Перевод» показывает все переводы');
await c.shot('dlg_translation_390.png');
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`document.querySelectorAll('.dlg-line').length > 0`);
ok(await c.ev(`getComputedStyle(document.querySelector('.dlg-tr')).display !== 'none'`), 'выбор «Перевод» запоминается');
await c.ev(`document.getElementById('dlgTrToggle').click()`);

// ── Навигация ──
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`Dialogs.dialog`);
await c.ev(`Dialogs.up()`);
ok(await waitFor(`location.hash === '#l=${LEVELS[0]}' && !document.getElementById('dlgLevel').hidden`), 'прямая ссылка на диалог: «вверх» → список уровня');
await c.ev(`Dialogs.up()`);
ok(await waitFor(`location.hash === '' && !document.getElementById('dlgHub').hidden`), '«вверх» со списка → уровни');
await c.ev(`document.querySelector('.dlg-tile.is-live').click()`);
await waitFor(`document.querySelectorAll('.dlg-item').length === 10`);
await c.ev(`document.querySelectorAll('.dlg-item')[3].click()`);
await waitFor(`Dialogs.dialog && Dialogs.dialog.n === 4`);
await c.ev(`history.back()`);
ok(await waitFor(`!document.getElementById('dlgLevel').hidden && location.hash.startsWith('#l=')`), '«назад» браузера: диалог → список');
await c.ev(`history.back()`);
ok(await waitFor(`!document.getElementById('dlgHub').hidden`), '«назад» браузера: список → уровни');
await c.ev(`history.forward()`);
ok(await waitFor(`!document.getElementById('dlgLevel').hidden`), '«вперёд» возвращает список');
await c.go(`${B}/dialogs.html#d=zz-99`, 1500);
ok(await waitFor(`!document.getElementById('dlgHub').hidden`), 'несуществующий диалог → уровни, без ошибок');
await c.ev(`location.hash = ''`);
// Telegram BackButton: эмулируем SDK и событие готовности
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`Dialogs.dialog`);
const tgRes = await c.ev(`(() => { const log = []; let cb = null;
  window.Telegram = { WebApp: { initData: 'x', isVersionAtLeast: () => true,
    BackButton: { show: () => log.push('show'), hide: () => log.push('hide'), onClick: f => { cb = f; log.push('on'); }, offClick() {} } } };
  document.dispatchEvent(new CustomEvent('dm:tg-ready'));
  cb && cb(); return log.join(',') + '|' + location.hash; })()`);
ok(/on,show/.test(tgRes) && /#l=/.test(tgRes), `Telegram BackButton: показана и ведёт на уровень выше (${tgRes})`);

// ── Узкий экран и десктоп ──
for (const [w, h] of [[320, 640], [1280, 800]]) {
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await c.go(`${B}/dialogs.html#d=${first}`, 1500);
  await waitFor(`document.querySelectorAll('.dlg-line').length > 0`);
  await c.wait(500);
  ok(await c.ev(NO_HSCROLL), `${w}px: нет горизонтальной прокрутки`);
  ok(await c.ev(`(() => { const b = document.getElementById('dlgPlay').getBoundingClientRect(); return b.height >= 40 && b.width >= 120; })()`), `${w}px: кнопка «Слушать» удобного размера`);
  await c.shot(`dlg_${first}_${w}.png`);
}
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

// ── Светлая тема ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
await c.go(`${B}/dialogs.html#d=${first}`, 1500);
await waitFor(`document.querySelectorAll('.dlg-line').length > 0`);
await c.shot('dlg_light_390.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);

// ── Украинский ──
await setLang('uk');
await c.go(`${B}/dialogs.html#d=${first}`, 1800);
await waitFor(`Dialogs.dialog && document.querySelectorAll('.dlg-line').length > 0`);
await c.wait(400);
const ukData = JSON.parse(await c.ev(`fetch('i18n/uk/dialogs/${first}.json').then(r => r.text())`));
const uk = JSON.parse(await c.ev(`JSON.stringify({ tr: [...document.querySelectorAll('.dlg-tr')].map(e => e.textContent),
  de: [...document.querySelectorAll('.dlg-de')].map(e => e.textContent), play: document.getElementById('dlgPlay').textContent,
  h1: document.querySelector('.news-h1').textContent })`));
ok(uk.tr.join('|') === ukData.lines.map(l => l.tr).join('|'), 'uk: переводы реплик украинские (из i18n/uk/dialogs)');
ok(uk.de.join('|') === want.join('|'), 'uk: немецкие реплики не изменились');
ok(/Слухати/.test(uk.play) && /Діалоги/.test(uk.h1), `uk: интерфейс — «${uk.h1}», «${uk.play.trim()}»`);
const ruLeft = await c.ev(`(() => { const w = document.createTreeWalker(document.body, 4); const out = []; let n;
  while ((n = w.nextNode())) { if (/[ЫыЭэЪъЁё]/.test(n.nodeValue) && n.parentElement.offsetParent !== null) out.push(n.nodeValue.trim()); } return out.slice(0, 5).join(' | '); })()`);
ok(!ruLeft, 'uk: на странице нет русских букв ы/э/ъ/ё' + (ruLeft ? ' — ' + ruLeft : ''));
await c.shot('dlg_uk_390.png');

// ── Арабский: RTL, немецкий LTR, весь раздел открыт ──
await setLang('ar');
await c.go(`${B}/dialogs.html`, 1800);
ok(await waitFor(`document.querySelectorAll('.dlg-tile.is-live').length === ${LEVELS.length}`), 'ar: уровни с диалогами открыты (не «🔒 قريبًا»)');
ok(await c.ev(`document.documentElement.dir === 'rtl' && !document.querySelector('.ar-trial') && !document.querySelector('.ar-soon')`), 'ar: зеркальный интерфейс, без плашек «не переведено»');
await c.shot('dlg_ar_hub.png');
await c.go(`${B}/dialogs.html#d=${first}`, 1800);
await waitFor(`Dialogs.dialog && document.querySelectorAll('.dlg-line').length > 0`);
await c.ev(`document.getElementById('dlgTrToggle').click()`);
await c.wait(500);
const ar = JSON.parse(await c.ev(`JSON.stringify({
  deDir: [...document.querySelectorAll('.dlg-de')].every(e => getComputedStyle(e).direction === 'ltr'),
  trDir: [...document.querySelectorAll('.dlg-tr')].every(e => getComputedStyle(e).direction === 'rtl'),
  titleDir: getComputedStyle(document.getElementById('dlgTitle')).direction,
  cyr: (() => { const w = document.createTreeWalker(document.body, 4); const out = []; let n;
    while ((n = w.nextNode())) { if (/[А-Яа-яЁёІіЇїЄєҐґ]/.test(n.nodeValue) && n.parentElement.offsetParent !== null) out.push(n.nodeValue.trim()); }
    return out.slice(0, 6); })(),
  hs: ${NO_HSCROLL}, play: document.getElementById('dlgPlay').textContent.trim() })`));
ok(ar.deDir && ar.titleDir === 'ltr', 'ar: немецкие реплики и название — LTR');
ok(ar.trDir, 'ar: перевод — RTL');
ok(!ar.cyr.length, 'ar: нет кириллицы' + (ar.cyr.length ? ' — ' + ar.cyr.join(' | ') : ''));
ok(ar.hs, 'ar: нет горизонтальной прокрутки');
ok(/[؀-ۿ]/.test(ar.play), `ar: кнопка по-арабски «${ar.play}»`);
await c.shot('dlg_ar_dialog.png');
await c.ev(`document.getElementById('dlgTrToggle').click()`);
// плитка «Диалоги» на главной открыта и ведёт в диалоги (новости на
// арабском тоже открыты — с переводом первой статьи)
await c.go(`${B}/index.html`, 1800);
await waitFor(`!!document.getElementById('readDialogs')`);
ok(await c.ev(`!document.getElementById('readDialogs').classList.contains('ar-soon') && !document.getElementById('readNews').classList.contains('ar-soon')`),
  'ar: «Диалоги» и «Новости» на главной открыты');
await c.ev(`document.getElementById('readDialogs').click()`);
ok(await waitFor(`location.pathname.endsWith('/dialogs.html')`), 'ar: плитка ведёт на dialogs.html');
// пункт бокового меню урока — тоже
await c.go(`${B}/lessons/a1/lesson-01/index.html`, 2200);
await waitFor(`document.querySelectorAll('.side-action.dialogs').length > 0`);
ok(await c.ev(`!document.querySelector('.side-action.dialogs').classList.contains('ar-soon')`), 'ar: «Диалоги» в меню урока открыты');
await c.ev(`document.querySelector('.side-action.dialogs').click()`);
ok(await waitFor(`location.pathname.endsWith('/dialogs.html')`), 'ar: пункт меню ведёт на dialogs.html');

await setLang('ru');
const errs = c.errors();
ok(!errs.length, 'ошибок JS в консоли нет' + (errs.length ? ': ' + errs.join(' | ').slice(0, 300) : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВсе проверки пройдены');
process.exit(fail ? 1 : 0);
