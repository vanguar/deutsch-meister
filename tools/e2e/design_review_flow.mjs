// Регресс по дизайн-ревью: словарь списком без дубля артикля, автоскрытие
// кнопки меню, диктант «Проверить → Далее», подписи панели ридера,
// счётчик ридера по главам. Нужен python -m http.server 8765.
import { start } from './cdp.mjs';
const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9341);
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fails++; };
const waitFor = async (x, ms = 6000) => { for (let t = 0; t < ms; t += 150) { if (await c.ev(x)) return true; await c.wait(150); } return false; };
const card = i => `document.querySelectorAll('#dictationContainer .dictation-card')[${i}]`;

// ── Словарь ──
await c.go(B + '/lessons/a1/lesson-05/index.html?lang=ru&lts=' + Date.now(), 2000);
await waitFor(`document.querySelectorAll('.vocab-item').length > 0`);
const v = await c.ev(`(() => {
  const items = [...document.querySelectorAll('.vocab-item')];
  const word = li => li.querySelector('.vocab-word').textContent;
  return {
    n: items.length,
    dbl: items.filter(li => /^(der|die|das)\\s/.test(word(li))).length,
    colors: new Set(['der', 'die', 'das'].map(a => {
      const e = document.querySelector('.art-' + a); return e && getComputedStyle(e).color;
    })).size,
    months: items.filter(li => /^(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)$/.test(word(li))).length,
    ipaOneLine: items.every(li => { const e = li.querySelector('.vocab-ipa'); return !e || e.getBoundingClientRect().height < 22; }),
    hscroll: document.documentElement.scrollWidth > innerWidth
  };
})()`);
ok(v.n === 33, `в словаре A1-05 ${v.n} слов`);
ok(v.dbl === 0, 'артикль не дублируется в слове');
ok(v.colors === 3, 'der / die / das разного цвета');
ok(v.months === 12, `все 12 месяцев (${v.months})`);
ok(v.ipaOneLine, 'транскрипция в одну строку');
ok(!v.hscroll, 'нет горизонтальной прокрутки');
const meta = await c.ev(`new Set([...document.querySelectorAll('#lessonMeta > *')].map(e => { const r = e.getBoundingClientRect(); return Math.round((r.top + r.height / 2) / 8); })).size`);
ok(meta === 1, `метки шапки урока в одну строку (рядов: ${meta})`);
await c.shot('dr-lesson-head.png');
await c.ev(`document.getElementById('vocabTableBody').scrollIntoView({ behavior: 'instant' })`);
await c.wait(400);
await c.shot('dr-vocab-dark.png');

// ── Кнопка меню ──
const fabHidden = `document.querySelector('.sidebar-mobile-toggle').classList.contains('fab-hidden')`;
await c.ev(`scrollTo(0, 0)`); await c.wait(300);
for (let y = 200; y <= 1400; y += 200) { await c.ev(`scrollTo(0, ${y})`); await c.wait(80); }
await c.wait(400);
ok(await c.ev(fabHidden), 'кнопка меню прячется при прокрутке вниз');
for (let y = 1300; y >= 900; y -= 100) { await c.ev(`scrollTo(0, ${y})`); await c.wait(80); }
await c.wait(400);
ok(!(await c.ev(fabHidden)), 'и возвращается при прокрутке вверх');

// ── Диктант ──
await c.ev(`document.querySelector('.ex-tab[data-panel="dictation"]').click()`);
await c.wait(300);
const d0 = await c.ev(`(() => {
  const b = ${card(0)}.querySelector('.step-next-btn');
  return { text: b.textContent, dis: b.disabled,
    numHidden: getComputedStyle(${card(0)}.querySelector('.dictation-num')).display === 'none' };
})()`);
ok(d0.text === 'Проверить' && d0.dis, `пустое поле: «${d0.text}», неактивна: ${d0.dis}`);
ok(d0.numHidden, 'прогресс не дублируется в карточке');
await c.ev(`(() => { const i = ${card(0)}.querySelector('.dictation-input'); i.value = 'falsch'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
ok(await c.ev(`!${card(0)}.querySelector('.step-next-btn').disabled`), 'после ввода кнопка активна');
await c.ev(`${card(0)}.querySelector('.step-next-btn').click()`);
await c.wait(200);
const d1 = await c.ev(`({ text: ${card(0)}.querySelector('.step-next-btn').textContent,
  ans: (${card(0)}.querySelector('.dict-answer')?.textContent || '').trim() })`);
ok(d1.text === 'Далее →' && d1.ans.startsWith('Правильный ответ:'), `ошибка: «${d1.text}», ${d1.ans}`);
await c.ev(`${card(0)}.scrollIntoView({ block: 'center', behavior: 'instant' })`);
await c.wait(700);
await c.shot('dr-dict-wrong.png');
await c.ev(`${card(0)}.querySelector('.step-next-btn').click()`);
await c.wait(200);
ok(await c.ev(`${card(1)}.style.display !== 'none' && ${card(0)}.style.display === 'none'`), '«Далее» переходит ко 2-му слову');
await c.ev(`${card(1)}.querySelector('.step-skip-btn').click()`);
await c.wait(100);
ok(await c.ev(`!!${card(1)}.querySelector('.dict-answer') && !${card(1)}.querySelector('.step-next-btn').disabled && ${card(1)}.querySelector('.step-next-btn').textContent === 'Далее →'`),
  '«Показать ответ» на пустом поле открывает ответ и «Далее»');
// верный ответ через Enter — сам переходит дальше
await c.ev(`${card(1)}.querySelector('.step-next-btn').click()`);
await c.wait(150);
const word2 = await c.ev(`LESSON_DATA.exercises.dictation[2].word || LESSON_DATA.exercises.dictation[2]`);
await c.ev(`(() => { const i = ${card(2)}.querySelector('.dictation-input'); i.value = ${JSON.stringify(String(word2))}; i.dispatchEvent(new Event('input', { bubbles: true }));
  i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); })()`);
await c.wait(900);
ok(await c.ev(`${card(3)}.style.display !== 'none'`), 'верный ответ по Enter — переход к следующему слову');
ok(c.errors().length === 0, 'урок без JS-ошибок ' + c.errors().join(' | '));

// ── Светлая тема словаря ──
await c.ev(`localStorage.setItem('dm_theme', 'light')`);
await c.go(B + '/lessons/a1/lesson-05/index.html?lang=ru', 2000);
await c.ev(`document.getElementById('vocabTableBody').scrollIntoView({ behavior: 'instant' })`); await c.wait(700);
await c.shot('dr-vocab-light.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);

// ── Украинский ──
await c.go(B + '/lessons/a1/lesson-05/index.html?lang=uk&lts=' + Date.now(), 2200);
ok(await waitFor(`[...document.querySelectorAll('.vocab-ru')].some(e => e.textContent === 'лютий')`), 'uk: перевод новых месяцев (лютий)');

// ── Ридер ──
await c.go(B + '/books.html?lang=ru&lts=' + Date.now(), 2500);
await c.ev(`Reader.open('bremer')`);
await waitFor(`/гл\\./.test(document.getElementById('rdPages')?.textContent || '')`, 8000);
const r = await c.ev(`({
  pages: document.getElementById('rdPages').textContent,
  labels: [...document.querySelectorAll('#rdSlot .rd-slot-btn:not([hidden]) .rd-btn-label')]
    .map(e => e.getBoundingClientRect().width > 0 ? e.textContent : '').join('|'),
  icon: document.querySelector('.rd-chapter-icon')?.textContent,
  hscroll: document.documentElement.scrollWidth > innerWidth
})`);
ok(/^гл\. 1 \/ 4 · \d+%$/.test(r.pages), `счётчик ридера: «${r.pages}»`);
ok(r.labels.split('|').every(Boolean), `подписи кнопок видны: ${r.labels}`);
ok(r.icon === '🐕', `значок 1-й главы: ${r.icon}`);
ok(!r.hscroll, 'ридер без горизонтальной прокрутки');
await c.shot('dr-reader.png');
await c.ev(`document.getElementById('rdInterlinearBtn').click()`); await c.wait(1500);
const r2 = await c.ev(`document.getElementById('rdPages').textContent`);
ok(/^гл\. 1 \/ 4 · \d+%$/.test(r2), `в подстрочнике счётчик тоже по главе: «${r2}»`);
await c.shot('dr-reader-gloss.png');
ok(c.errors().length === 0, 'ридер без JS-ошибок ' + c.errors().join(' | '));

// ── Новости ──
await c.go(B + '/news.html?lang=ru', 2500);
await c.shot('dr-news.png');

c.close();
console.log(fails ? `\nПРОВАЛЕНО: ${fails}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
process.exit(fails ? 1 : 0);
