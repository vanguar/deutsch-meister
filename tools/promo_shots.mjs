// Скриншоты приложения для превью бота в Telegram (Main Mini App → профиль бота).
//   python -m http.server 8765        (из корня репо; другой порт — BASE=http://127.0.0.1:<порт>)
//   node --experimental-websocket tools/promo_shots.mjs [draft]
// Результат: promo/preview/<uk|ru>/NN-<кадр>.png, 1170×2532 (iPhone, 390×844 @3x).
// draft — те же кадры в 1x в системную временную папку, чтобы быстро посмотреть.
import fs from 'fs';
import { start } from './e2e/cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const DRAFT = process.argv.includes('draft');
const SCALE = DRAFT ? 1 : 3;

// [имя, адрес, подготовка на странице (JS), пауза до, пауза после, JS → [x, y] для тапа]
const SEC = i => `document.querySelectorAll('section.lesson-section')[${i}].scrollIntoView({block: 'start', behavior: 'instant'})`;
const LESSON = '/lessons/a1/lesson-05/index.html';
const READ = id => `Reader.open('${id}')`;
const FRAMES = [
  ['course', '/index.html',
    `[...document.querySelectorAll('body *')].find(e => !e.children.length && e.offsetParent && /Карта курс/.test(e.textContent))
       .scrollIntoView({block: 'start', behavior: 'instant'}); scrollBy({top: -24, behavior: 'instant'})`, 1500],
  ['phrases', LESSON, `scrollTo(0, 0)`, 1500],
  ['words', LESSON, SEC(1), 1500],
  ['dictation', LESSON, `document.querySelector('.ex-tab[data-panel=dictation]').click(); ${SEC(3)}`, 1500],
  ['book-interlinear', '/books.html', `${READ('bremer')}; setTimeout(() => document.getElementById('rdInterlinearBtn').click(), 2500)`, 1500, 4000],
  ['word-tip', '/books.html', READ('bremer'), 1500, 3500,
    // настоящий тап по слову: подсказка открывается на события указателя, а не на .click()
    `(() => { const r = [...document.querySelectorAll('#rdContent .bw')].find(w => w.textContent === 'Esel')
       .getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`],
  ['news', '/news.html', `scrollTo(0, 0)`, 2000],
  ['article', '/news.html#news=schildkroete-jonathan-2026', ``, 3500],
];

const c = await start(9351);
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: SCALE, mobile: true });
const outRoot = DRAFT ? (process.env.SP || '.') : 'promo/preview';
for (const lang of ['uk', 'ru']) {
  await c.go(`${B}/index.html`, 800);
  await c.ev(`localStorage.clear(); localStorage.setItem('dm_lang', JSON.stringify({lang: '${lang}', ts: Date.now()}))`);
  const dir = DRAFT ? outRoot : `${outRoot}/${lang}`;
  fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  for (const [name, url, prep, ms, after = 900, tap] of FRAMES) {
    await c.go(B + url, ms);
    if (prep) { await c.ev(`(() => { ${prep} })()`); await c.wait(after); }
    if (tap) {
      const [x, y] = await c.ev(tap);
      for (const type of ['mousePressed', 'mouseReleased'])
        await c.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
      await c.wait(1200);
    }
    const file = DRAFT ? `promo-${lang}-${String(++n).padStart(2, '0')}-${name}.png`
                       : `${String(++n).padStart(2, '0')}-${name}.png`;
    const r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${dir}/${file}`, Buffer.from(r.result.data, 'base64'));
    console.log(lang, file);
  }
}
const errs = c.errors();
if (errs.length) console.log('JS errors:', errs);
c.close();
