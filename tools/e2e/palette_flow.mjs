// E2E: одна палитра на всё приложение.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/palette_flow.mjs
// Главная, урок, книги (библиотека и ридер «Как в приложении»), новости,
// диалоги — в своей тёмной и светлой теме и в четырёх темах Telegram
// (iOS/Android × светлая/тёмная, через заглушку Telegram.WebApp):
//   • фон страницы и акцент (кнопки, ссылки) везде одинаковые;
//   • в Telegram — фон из его themeParams на всех страницах;
//   • весь видимый текст читается: контраст ≥ 4.5:1 (крупный ≥ 3:1).
import { start, SP } from './cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9352);
let fail = 0;
const ok = (cond, msg, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg + (cond || x === undefined ? '' : '  → ' + JSON.stringify(x).slice(0, 900))); if (!cond) fail++; };
const waitFor = async (expr, ms = 8000) => { for (let t = 0; t < ms; t += 150) { if (await c.ev(expr)) return true; await c.wait(150); } return false; };
const J = async expr => JSON.parse(await c.ev(`JSON.stringify(${expr})`));

const PAGES = [
  { name: 'главная', url: '/index.html', ready: `document.querySelectorAll('.lesson-card[data-state]').length > 0` },
  { name: 'курс', url: '/index.html#course', ready: `document.querySelectorAll('.lesson-card[data-state]').length > 0` },
  { name: 'словарь', url: '/index.html#dict', ready: `document.querySelectorAll('.v-item').length > 0` },
  { name: 'профиль', url: '/index.html#more', ready: `!!document.querySelector('[data-set-lang].on')` },
  { name: 'урок', url: '/lessons/a1/lesson-05/index.html', ready: `document.querySelectorAll('.vocab-item').length > 0` },
  { name: 'книги', url: '/books.html', ready: `document.querySelectorAll('.lib-card').length > 0` },
  { name: 'ридер', url: '/books.html', ready: `document.querySelectorAll('.lib-card').length > 0`,
    open: `document.querySelector('.lib-card [data-book-id]').click()`, opened: `!!document.querySelector('.rd-view:not([hidden]) .rd-p')`, reader: true },
  { name: 'новости', url: '/news.html', ready: `document.querySelectorAll('.news-tile').length > 0` },
  { name: 'диалоги', url: '/dialogs.html', ready: `document.querySelectorAll('.dlg-tile').length > 0` }
];

const PALETTES = {
  'ios-dark':      { scheme: 'dark',  p: { bg_color: '#000000', secondary_bg_color: '#1c1c1d', section_bg_color: '#2c2c2e', text_color: '#ffffff', hint_color: '#98989e', link_color: '#3e88f7', button_color: '#3e88f7', button_text_color: '#ffffff', accent_text_color: '#3e88f7', section_separator_color: '#545458' } },
  'ios-light':     { scheme: 'light', p: { bg_color: '#ffffff', secondary_bg_color: '#efeff4', section_bg_color: '#ffffff', text_color: '#000000', hint_color: '#8e8e93', link_color: '#007aff', button_color: '#007aff', button_text_color: '#ffffff', accent_text_color: '#007aff', section_separator_color: '#c8c7cc' } },
  'android-dark':  { scheme: 'dark',  p: { bg_color: '#212d3b', secondary_bg_color: '#151e27', section_bg_color: '#1d2733', text_color: '#ffffff', hint_color: '#7d8b99', link_color: '#5eabe1', button_color: '#50a8eb', button_text_color: '#ffffff', accent_text_color: '#64b5ef' } },
  'android-light': { scheme: 'light', p: { bg_color: '#ffffff', secondary_bg_color: '#f0f0f0', text_color: '#222222', hint_color: '#a8a8a8', link_color: '#2678b6', button_color: '#50a8eb', button_text_color: '#ffffff' } }
};
const tgStub = (scheme, p) => `window.Telegram = { WebApp: { themeParams: ${JSON.stringify(p)}, colorScheme: '${scheme}', platform: 'ios', initData: '', initDataUnsafe: {}, version: '8.0',
  ready() {}, expand() {}, isVersionAtLeast() { return true; }, BackButton: { show() {}, hide() {}, onClick() {}, offClick() {} },
  onEvent() {}, offEvent() {}, HapticFeedback: { impactOccurred() {}, selectionChanged() {}, notificationOccurred() {} }, openTelegramLink() {}, openLink() {} } };
  try { localStorage.setItem('tg_welcomed', '1'); sessionStorage.setItem('dm_install_banner_hidden', '1'); } catch (e) {}`;

// снимок: токены, фон, контраст всего видимого текста
const SNAP = `(() => {
  const rgb = s => { const m = String(s).match(/[\\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  // фон под элементом: смешиваем полупрозрачные слои до первого непрозрачного
  const bgOf = el => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null;   // картинка — не меряем
      if (/gradient/.test(cs.backgroundImage)) { const m = cs.backgroundImage.match(/rgba?\\([^)]+\\)/); if (m) { layers.push(rgb(m[0])); if ((rgb(m[0])[3] ?? 1) >= .95) break; } }
      const c = rgb(cs.backgroundColor);
      if (c && (c[3] ?? 1) > 0) { layers.push(c); if ((c[3] ?? 1) >= .95) break; }
    }
    let base = rgb(getComputedStyle(document.documentElement).backgroundColor) || [255, 255, 255];
    if ((base[3] ?? 1) < .5) base = rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) { const [r, g, b, a = 1] = layers[i]; base = [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)]; }
    return base;
  };
  const bad = [];
  let n = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t; (t = walker.nextNode());) {
    if (!/[\\p{L}\\p{N}]/u.test(t.nodeValue)) continue;
    const el = t.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity < .5 || el.closest('[aria-hidden="true"], .now-bg, .ar-soon, [disabled], .is-disabled')) continue;
    if (/text/.test(cs.webkitBackgroundClip) || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue;   // градиентный текст
    const fg = rgb(cs.color), bg = bgOf(el);
    if (!fg || !bg) continue;
    const a = fg[3] ?? 1;
    const col = [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
    const k = ratio(col, bg);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.6 && +cs.fontWeight >= 700);
    n++;
    if (k < (big ? 3 : 4.5)) bad.push((el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName) + ' «' + t.nodeValue.trim().slice(0, 24) + '» ' + k.toFixed(2));
  }
  const root = getComputedStyle(document.documentElement);
  return { bg: root.getPropertyValue('--bg').trim(), acc: root.getPropertyValue('--accent2').trim(), accT: root.getPropertyValue('--accent2-text').trim(),
    body: getComputedStyle(document.body).backgroundColor, n, bad: [...new Set(bad)] };
})()`;

const hexRgb = h => 'rgb(' + [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(', ') + ')';

async function runMode(name, theme, tg) {
  console.log(`\n${name}`);
  let id = null;
  if (tg) ({ result: { identifier: id } } = await c.send('Page.addScriptToEvaluateOnNewDocument', { source: tgStub(tg.scheme, tg.p) }));
  await c.go(B + '/index.html', 600);
  await c.ev(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('dm_theme', '${theme}');
    localStorage.setItem('dm_progress', JSON.stringify({ xp: 320, streak: 5, lastActive: new Date().toISOString().slice(0, 10), completedLessons: ['a1-01','a1-02','a1-03'], lessonScores: {} }));
    localStorage.setItem('dm_last_lesson', 'a1-04')`);
  const rows = [];
  for (const p of PAGES) {
    await c.go(B + p.url, 1500);
    await waitFor(p.ready);
    if (p.open) { await c.ev(p.open); await waitFor(p.opened); }
    await c.wait(700);            // переход фона в base.css — .3s
    const s = await J(SNAP);
    rows.push({ ...p, ...s });
    await c.shot(`pal-${name}-${p.name}.png`.replace(/\s+/g, '_'));
    ok(s.bad.length === 0, `${p.name}: контраст у ${s.n} текстов` + (s.bad.length ? ` — плохих ${s.bad.length}` : ''), s.bad.slice(0, 12));
  }
  const base = rows[0];
  const same = rows.filter(r => !r.reader).every(r => r.bg === base.bg && r.acc === base.acc && r.accT === base.accT && r.body === base.body);
  ok(same, `фон и акцент одинаковые на всех страницах (${base.body}, акцент ${base.acc} / ${base.accT})`,
    rows.map(r => `${r.name}: ${r.body} ${r.acc} ${r.accT}`));
  if (tg) ok(base.body === hexRgb(tg.p.bg_color), `фон — из темы Telegram (${tg.p.bg_color})`);
  if (id) await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
}

await runMode('своя тёмная', 'dark');
await runMode('своя светлая', 'light');
for (const [name, tg] of Object.entries(PALETTES)) await runMode('telegram ' + name, tg.scheme, tg);

const errs = c.errors();
ok(errs.length === 0, 'нет ошибок JS' + (errs.length ? ': ' + errs.join(' | ').slice(0, 400) : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ', '· скриншоты:', SP);
process.exit(fail ? 1 : 0);
