// E2E: главная — вкладки «Главная · Курс · Профиль» (index.html, js/home.js).
// Нужны Chrome и статический сервер:
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/home_flow.mjs
// Проверяет, что редизайн не потерял ни одной функции старой главной:
// «Продолжить» ведёт туда же, куда решает progress.js; пройденные и текущий
// урок, XP, серия; облачное слияние перерисовывает экран; все переходы
// (уроки, книги, новости, диалоги, поддержка, связь, установка); язык
// RU/UA/AR и тема; арабский RTL без кириллицы; без горизонтальной прокрутки
// и наложений; контраст текста; телефон и десктоп.
import { start, SP } from './cdp.mjs';

const B = process.env.BASE || 'http://127.0.0.1:8765';
const c = await start(9350);
let fail = 0;
const ok = (cond, msg, x) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg + (cond || x === undefined ? '' : '  → ' + JSON.stringify(x))); if (!cond) fail++; };
const waitFor = async (expr, ms = 6000) => { for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); } return false; };
const J = async expr => JSON.parse(await c.ev(`JSON.stringify(${expr})`));
const phone = (w = 390, h = 844) => c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
const today = new Date().toISOString().slice(0, 10);

// общий снимок экрана
const SNAP = `(() => {
  const vis = s => [...document.querySelectorAll('[data-tab]')].filter(e => !e.hidden).map(e => e.dataset.tab);
  const t = id => (document.getElementById(id) || {}).textContent;
  return {
    tab: vis(), hash: location.hash,
    greet: t('greetSub'), greetDe: t('greetDe'),
    btn: t('continueBtn'), href: document.getElementById('continueBtn').getAttribute('href'),
    nowLvl: t('nowLvl'), nowNum: t('nowNum'), nowTitle: t('nowTitle'), nowSub: t('nowSub'), nowBg: t('nowBg'),
    stepsOn: document.querySelectorAll('#nowSteps .step.on').length,
    stepNext: [...document.querySelectorAll('#nowSteps .step')].findIndex(s => s.classList.contains('next')),
    stepsShown: getComputedStyle(document.getElementById('nowSteps')).display !== 'none',
    xpLevel: t('xpLevel'), xpNow: t('xpNow'), streak: t('streakNum'), streakWord: t('streakWord'),
    cards: document.querySelectorAll('.lesson-card[href]').length,
    done: [...document.querySelectorAll('.lesson-card[data-state="done"]')].map(c => c.getAttribute('href').match(/(\\w\\d)\\/lesson-(\\d+)/).slice(1).join('-')),
    cur: [...document.querySelectorAll('.lesson-card[data-state="cur"]')].map(c => c.getAttribute('href').match(/(\\w\\d)\\/lesson-(\\d+)/).slice(1).join('-')),
    courseCount: t('courseCount'), lvlName: t('lvlName'), lvlCount: t('lvlCount'),
    statStreak: t('statStreak'), statXp: t('statXp'), statDone: t('statDone'),
    hscroll: document.documentElement.scrollWidth > innerWidth + 1,
    lang: I18N.lang, dir: document.documentElement.dir || 'ltr', theme: document.documentElement.getAttribute('data-theme')
  };
})()`;

async function fresh(storage = {}) {
  await c.go(B + '/index.html', 600);
  await c.ev(`localStorage.clear(); sessionStorage.clear(); ${Object.entries(storage).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(typeof v === 'string' ? v : JSON.stringify(v))});`).join('')}`);
  await c.go(B + '/index.html', 1600);
  await waitFor(`typeof Home !== 'undefined' && document.querySelectorAll('.lesson-card[data-state]').length > 0`);
}

// ── 1. Новый пользователь ──
console.log('1. Новый пользователь, тёмная тема, 390px');
await phone();
await fresh({ dm_theme: 'dark' });
let s = await J(SNAP);
ok(s.tab.join() === 'home' && s.hash === '', 'открыта вкладка «Главная»', s.tab);
ok(s.greet === 'Добро пожаловать' && s.greetDe === 'Willkommen!', `приветствие нового пользователя: ${s.greet} / ${s.greetDe}`);
ok(s.btn === 'Начать курс' && /lessons\/a1\/lesson-01\//.test(s.href), `«Начать курс» → ${s.href}`);
ok(s.nowTitle === 'Приветствия' && s.nowNum === '01' && s.nowLvl === 'A1', `карточка: ${s.nowLvl} ${s.nowNum} ${s.nowTitle}`);
ok(!s.stepsShown && /68 уроков/.test(s.nowSub), `шаги скрыты, подпись «${s.nowSub}»`);
ok(s.cards === 68, `в курсе 68 уроков (${s.cards})`);
ok(s.done.length === 0 && s.cur.join() === 'a1-01', `ничего не пройдено, текущий a1-01`, s.cur);
ok(s.xpLevel === '1' && s.xpNow === '0', `уровень 1, 0 XP`);
ok(!s.hscroll, 'нет горизонтальной прокрутки');
await c.shot('home-new-dark.png');

// ── 2. Есть прогресс ──
console.log('2. Пройдено 3 урока, открыт 4-й (2 части из 5), 320 XP, серия 5');
const PROG = {
  dm_theme: 'dark',
  dm_progress: { xp: 320, streak: 5, lastActive: today, completedLessons: ['a1-01', 'a1-02', 'a1-03'], lessonScores: {} },
  dm_last_lesson: 'a1-04',
  'dm_sections:a1-04': { done: ['flashcards', 'fill'], scores: {} }
};
await fresh(PROG);
s = await J(SNAP);
ok(/^(Доброе утро|Добрый день|Добрый вечер)$/.test(s.greet) && /^Guten (Morgen|Tag|Abend)!$/.test(s.greetDe), `приветствие по времени: ${s.greet} / ${s.greetDe}`);
ok(s.btn === 'Продолжить урок' && /lessons\/a1\/lesson-04\//.test(s.href), `«Продолжить урок» → ${s.href}`);
ok(s.nowTitle === 'Семья' && s.nowNum === '04' && s.nowBg === 'Familie', `карточка: ${s.nowNum} ${s.nowTitle} (${s.nowBg})`);
ok(s.stepsShown && s.stepsOn === 2 && s.stepNext === 2 && s.nowSub === 'Пройдено 2 из 5', `шаги: ${s.stepsOn}/5, дальше №${s.stepNext + 1}, «${s.nowSub}»`);
ok(s.xpLevel === '2' && s.xpNow === '120', `уровень ${s.xpLevel}, ${s.xpNow} / 200 XP`);
ok(s.streak === '5' && s.streakWord === 'дней подряд', `серия: ${s.streak} ${s.streakWord}`);
ok(s.done.join() === 'a1-01,a1-02,a1-03' && s.cur.join() === 'a1-04', `путь: пройдены ${s.done}, текущий ${s.cur}`);
ok(s.courseCount === '3 из 68 уроков' && s.lvlCount === '3 / 20' && s.lvlName === 'Начинающий', `курс: ${s.courseCount}, ${s.lvlName} ${s.lvlCount}`);
ok(s.statStreak === '5' && s.statXp === '320' && s.statDone === '3', `профиль: ${s.statStreak} / ${s.statXp} / ${s.statDone}`);
const curState = await c.ev(`document.querySelector('.lesson-card[data-state="cur"] .lc-state').textContent`);
ok(curState === 'Пройдено 2 из 5', `у текущего урока в пути: «${curState}»`);
// старый дизайн progress.js (inline outline) не должен просвечивать
const outline = await c.ev(`getComputedStyle(document.querySelector('.lesson-card.continue')).outlineStyle`);
ok(outline === 'none', `у текущего урока нет старой фиолетовой обводки (${outline})`);
// плитки и панель не наезжают друг на друга
const lay = await J(`(() => {
  scrollTo(0, document.body.scrollHeight);
  const bar = document.querySelector('.tabbar').getBoundingClientRect();
  const last = [...document.querySelectorAll('[data-tab="home"] .read')].pop().getBoundingClientRect();
  const hits = [...document.querySelectorAll('[data-tab="home"] .read, #continueBtn')].every(e => { e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return e.contains(h); });
  scrollTo(0, document.body.scrollHeight);
  const last2 = [...document.querySelectorAll('[data-tab="home"] .read')].pop().getBoundingClientRect();
  return { gap: Math.round(bar.top - last2.bottom), hits };
})()`);
ok(lay.gap >= 8, `последняя плитка не уходит под панель вкладок (зазор ${lay.gap}px)`);
ok(lay.hits, 'кнопки и плитки ничем не перекрыты');
await c.ev('scrollTo(0,0)');
await c.shot('home-progress-dark.png');

// водяной знак — слово урока целиком, даже длинное «Komparativ» (A2·18)
for (const [id, word] of [['a1-04', 'Familie'], ['a2-18', 'Komparativ'], ['b1-09', 'Deklination'], ['b2-04', 'Nominalisierung']]) {
  await fresh({ ...PROG, dm_last_lesson: id });
  await c.wait(500);
  const wm = await J(`(() => { const e = document.getElementById('nowBg'), r = e.getBoundingClientRect(), k = document.getElementById('nowCard').getBoundingClientRect();
    return { t: e.textContent, inside: r.left >= k.left - 1 && r.right <= k.right + 1, fs: parseFloat(getComputedStyle(e).fontSize) }; })()`);
  ok(wm.t === word && wm.inside && wm.fs >= 28, `водяной знак ${id}: «${wm.t}» целиком в карточке (${wm.fs}px)`, wm);
  const tt = await J(`(() => { const t = document.getElementById('nowTitle'); return { fits: t.scrollWidth <= t.clientWidth + 1, lines: Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight)) }; })()`);
  ok(tt.fits, `название урока ${id} не рвётся посреди слова`, tt);
}
await c.shot('home-watermark-long.png');
await fresh(PROG);

// ── 3. Вкладки ──
console.log('3. Вкладки и уровни');
await c.ev(`document.querySelector('[data-tab-btn="course"]').click()`); await c.wait(300);
s = await J(SNAP);
ok(s.tab.join() === 'course' && s.hash === '#course', `«Курс»: ${s.tab} ${s.hash}`);
await c.shot('home-course-dark.png');
await c.ev(`document.querySelector('[data-level-btn="b1"]').click()`); await c.wait(200);
const b1 = await J(`({ n: document.querySelectorAll('.path[data-level="b1"]:not([hidden]) .lesson-card').length, other: document.querySelectorAll('.path:not([hidden])').length, name: document.getElementById('lvlName').textContent, cnt: document.getElementById('lvlCount').textContent })`);
ok(b1.n === 14 && b1.other === 1 && b1.name === 'Средний' && b1.cnt === '0 / 14', `B1: ${b1.n} уроков, ${b1.name} ${b1.cnt}`);
await c.go(B + '/index.html#more', 1500);
s = await J(SNAP);
ok(s.tab.join() === 'more', 'по #more после перезагрузки открыт «Профиль»');
await c.shot('home-profile-dark.png');
await c.ev(`document.querySelector('[data-tab-btn="home"]').click()`); await c.wait(200);
s = await J(SNAP);
ok(s.tab.join() === 'home' && s.hash === '', '«Главная» — hash убран');
const histLen = await c.ev('history.length');
await c.ev(`document.querySelector('[data-tab-btn="course"]').click(); document.querySelector('[data-tab-btn="more"]').click()`);
ok(await c.ev('history.length') === histLen, 'вкладки не плодят записи в истории (кнопка «назад» Telegram)');

// мини-апп: hash с подписью Telegram (#tgWebAppData=…) вкладки не стирают —
// по нему работают облачный прогресс и язык из бота
const TGH = '#tgWebAppData=' + encodeURIComponent('user=%7B%22id%22%3A42%7D&auth_date=1&hash=x') + '&tgWebAppVersion=7.0';
await c.go(B + '/index.html' + TGH, 1500);
await c.ev(`document.querySelector('[data-tab-btn="course"]').click(); document.querySelector('[data-tab-btn="home"]').click()`);
ok(await c.ev(`location.hash.startsWith('#tgWebAppData=')`), 'вкладки не стирают #tgWebAppData (подпись Telegram)');
ok((await J(SNAP)).tab.join() === 'home', 'с подписью Telegram в hash открыта «Главная»');
await c.ev(`document.querySelector('[data-tab-btn="course"]').click()`);
await c.go(B + '/index.html?r=1' + TGH, 1500);
ok((await J(SNAP)).tab.join() === 'course', 'в мини-аппе вкладка «Курс» запоминается (возврат из урока)');
await c.go(B + '/index.html', 1200);

// возврат из урока на ту же вкладку
await c.ev(`document.querySelector('[data-tab-btn="course"]').click()`); await c.wait(200);
await c.ev(`document.querySelector('.lesson-card[href*="a1/lesson-05/"]').click()`);
ok(await waitFor(`location.pathname.includes('/lessons/a1/lesson-05/')`), 'урок из пути открывается');
await c.wait(1200);
await c.ev('history.back()');
ok(await waitFor(`location.pathname.endsWith('/index.html') && typeof Home !== 'undefined'`), 'назад — на главную');
await c.wait(800);
s = await J(SNAP);
ok(s.tab.join() === 'course', `после «назад» снова «Курс» (${s.tab})`);
ok(s.cur.join() === 'a1-05' && /lesson-05/.test(s.href), `последний открытый урок стал текущим: ${s.cur}`);

// ── 3б. Словарь ──
console.log('3б. Словарь');
await fresh(PROG);
await c.ev(`window.__said = []; TTS.speak = t => window.__said.push(t)`);
await c.ev(`document.querySelector('[data-tab-btn="dict"]').click()`);
ok(await waitFor(`document.querySelectorAll('.v-item').length > 0`), 'вкладка «Словарь» загрузила слова');
const VSNAP = `({ hash: location.hash, n: document.querySelectorAll('.v-item').length, cnt: document.getElementById('vocabCount').textContent,
  lvl: document.querySelector('[data-vlevel].on')?.dataset.vlevel, head: document.getElementById('vLvlCount').textContent,
  first: (document.querySelector('.v-item .v-term') || {}).textContent, hscroll: document.documentElement.scrollWidth > innerWidth + 1,
  empty: !document.getElementById('vocabEmpty').hidden })`;
let v = await J(VSNAP);
const VOC = JSON.parse(await c.ev(`fetch('data/vocab/index.json').then(r => r.text())`));
const inLv = lv => VOC.items.filter(i => i.l.startsWith(lv + '-')).length;
ok(v.hash === '#dict' && v.lvl === 'a1' && v.n === inLv('a1'), `уровень текущего урока (A1): ${v.n} слов из ${inLv('a1')}`, v);
ok(v.cnt === `${VOC.items.length} слов` && v.head === `Знаю 0 из ${inLv('a1')}` && v.first === 'Hallo', `шапка: ${v.cnt}, ${v.head}, первое слово ${v.first}`);
ok(!v.hscroll, 'словарь без горизонтальной прокрутки');
await c.shot('home-dict-dark.png');
// озвучка и «знаю»
await c.ev(`document.querySelector('.v-item .v-say').click()`);
ok((await J('window.__said')).join() === 'Hallo', '🔊 озвучивает слово через TTS');
await c.ev(`document.querySelectorAll('.v-item .v-know')[1].click()`); await c.wait(150);
v = await J(VSNAP);
const kn = await J(`JSON.parse(localStorage.getItem('dm_vocab_known'))`);
ok(kn['Tschüss'] === 1 && v.head === `Знаю 1 из ${inLv('a1')}`, `«знаю» сохраняется: ${Object.keys(kn)} · ${v.head}`);
ok(await c.ev(`document.querySelectorAll('.v-item')[1].classList.contains('known') && document.querySelectorAll('.v-item .v-know')[1].getAttribute('aria-pressed') === 'true'`), 'отмеченное слово подсвечено');
await c.ev(`document.querySelector('[data-vfilter="known"]').click()`); await c.wait(150);
v = await J(VSNAP);
ok(v.n === 1 && v.first === 'Tschüss', `фильтр «Знаю»: ${v.n} — ${v.first}`);
await c.ev(`document.querySelector('[data-vfilter="learn"]').click()`); await c.wait(150);
ok((await J(VSNAP)).n === inLv('a1') - 1, 'фильтр «Учить» — без отмеченного');
await c.ev(`document.querySelector('[data-vfilter="all"]').click()`); await c.wait(150);
// уровни
await c.ev(`document.querySelector('[data-vlevel="b2"]').click()`); await c.wait(200);
v = await J(VSNAP);
ok(v.lvl === 'b2' && v.n === inLv('b2') && v.head === `Знаю 0 из ${inLv('b2')}`, `B2: ${v.n} слов, ${v.head}`);
// поиск — по всем уровням, без умлаутов и по переводу
const search = async q => { await c.ev(`(() => { const i = document.getElementById('vocabQuery'); i.value = ${JSON.stringify(q)}; i.dispatchEvent(new Event('input')); })()`); await c.wait(350);
  return J(`[...document.querySelectorAll('.v-item')].map(r => r.querySelector('.v-term').textContent)`); };
let found = await search('schon');
ok(found.includes('schön'), `«schon» находит «schön» (${found.slice(0, 5)})`);
found = await search('собака');
ok(found.includes('der Hund'), `«собака» находит «der Hund» (${found.slice(0, 5)})`);
ok(await c.ev(`getComputedStyle(document.querySelector('.v-levels')).display === 'none'`), 'при поиске уровни скрыты — ищем по всем');
found = await search('qqqzzz');
ok(found.length === 0 && (await J(VSNAP)).empty, 'ничего не найдено — пишем об этом');
await search('');
ok((await J(VSNAP)).n === inLv('b2'), 'пустой поиск — снова уровень B2');
// ссылка на урок
const href = await c.ev(`document.querySelector('.v-item .v-lesson').getAttribute('href')`);
ok(/^lessons\/b2\/lesson-\d+\/index\.html$/.test(href), `тег урока ведёт в урок: ${href}`);
// после перезагрузки отметка на месте
await c.go(B + '/index.html?r=2#dict', 1500);
await waitFor(`document.querySelectorAll('.v-item').length > 0`);
ok(await c.ev(`document.getElementById('vLvlCount').textContent`) === `Знаю 1 из ${inLv('a1')}`, 'отметки «знаю» переживают перезагрузку');
// ── 3в. Анимации в карточке слова ──
console.log('3в. Анимации слов');
await c.go(B + '/index.html?r=4#dict', 1500);
await waitFor(`document.querySelectorAll('.v-item').length > 0`);
await c.ev(`window.__said = []; TTS.speak = t => window.__said.push(t)`);
const withX = VOC.items.filter(i => i.l.startsWith('a1-') && i.x).length;
ok(await c.ev(`document.querySelectorAll('.v-item .v-emo').length`) === withX, `в списке A1 значок у ${withX} слов с анимацией`);
ok(await c.ev(`!window.lottie`), 'проигрыватель Lottie не грузится, пока не открыли карточку');
const openWord = async de => { await c.ev(`Vocab.openCard(${JSON.stringify(VOC.items.find(i => i.de === de))})`); };
const CARD = `({ open: !document.getElementById('vSheet').hidden, word: document.getElementById('vsWord').textContent, tr: document.getElementById('vsTr').textContent,
  svg: !!document.querySelector('#vsAnim svg'), cls: document.getElementById('vsAnim').className, credit: !document.getElementById('vsCredit').hidden,
  move: (() => { const m = document.querySelector('#vsAnim .v-move'); return m ? getComputedStyle(m).animationName : ''; })(),
  emo: (document.querySelector('#vsAnim .v-bob') || {}).textContent || '' })`;
// Hallo — Lottie
await c.ev(`document.querySelector('.v-item .v-main').click()`);
ok(await waitFor(`!!document.querySelector('#vsAnim svg')`, 8000), 'карточка «Hallo»: анимация Lottie отрисована');
let cd = await J(CARD);
ok(cd.open && cd.word === 'Hallo' && cd.credit, `карточка открыта: «${cd.word}» — ${cd.tr}, подпись CC BY есть`);
ok((await J('window.__said')).includes('Hallo'), 'при открытии слово озвучивается');
await c.wait(600);
await c.shot('home-card-hallo.png');
// «знаю» из карточки — и в списке
await c.ev(`document.getElementById('vsKnow').click()`); await c.wait(150);
ok(await c.ev(`document.getElementById('vsKnow').classList.contains('on') && document.querySelector('.v-item').classList.contains('known')`), '«Знаю» в карточке отмечает слово и в списке');
await c.ev(`document.getElementById('vsKnow').click()`); await c.wait(150);
// закрытие
await c.ev(`document.querySelector('.v-sheet-x').click()`); await c.wait(200);
cd = await J(CARD);
ok(!cd.open && !cd.svg, 'крестик закрывает карточку и останавливает анимацию');
// gehen — CSS-движение
await openWord('gehen'); await c.wait(400);
cd = await J(CARD);
ok(cd.cls.includes('m-walk') && cd.emo === '🚶' && cd.move === 'v-cross' && !cd.credit, `«gehen»: 🚶 шагает (${cd.move})`, cd);
await c.shot('home-card-gehen.png');
await c.ev(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`); await c.wait(150);
ok(!(await J(CARD)).open, 'Esc закрывает карточку');
// fliegen — орёл
await openWord('fliegen');
ok(await waitFor(`!!document.querySelector('#vsAnim svg')`, 8000), '«fliegen»: орёл (Lottie)');
await c.wait(700);
await c.shot('home-card-fliegen.png');
await c.ev('Vocab.closeCard()');
// слово без анимации — карточка без пустого места
await openWord('der Montag'); await c.wait(200);
ok((await J(CARD)).cls.includes('none'), 'у слова без анимации блок анимации скрыт');
await c.ev('Vocab.closeCard()');
// «уменьшить движение» — анимации стоят
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await openWord('gehen'); await c.wait(300);
ok((await J(CARD)).move === 'none', '«уменьшить движение»: 🚶 стоит');
await c.ev('Vocab.closeCard()');
await openWord('Hallo');
await waitFor(`!!document.querySelector('#vsAnim svg')`, 8000);
ok(await c.ev(`(() => { const a = lottie.getRegisteredAnimations ? lottie.getRegisteredAnimations() : []; return a.length > 0 && a.every(x => x.isPaused); })()`), '«уменьшить движение»: Lottie на паузе');
await c.ev('Vocab.closeCard()');
await c.send('Emulation.setEmulatedMedia', { features: [] });
// все анимации из словаря открываются без ошибок
const codes = [...new Set(VOC.items.filter(i => i.x && i.x.startsWith('n:')).map(i => i.x.slice(2)))];
const bad = JSON.parse(await c.ev(`(async () => { const bad = []; const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-999px;width:60px;height:60px'; document.body.appendChild(box);
  for (const n of ${JSON.stringify(codes)}) { try { const r = await fetch('data/vocab/anim/' + n + '.json'); if (!r.ok) { bad.push(n + ' HTTP ' + r.status); continue; }
    const a = lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: await r.json() }); a.goToAndStop(5, true);
    if (!box.querySelector('svg')) bad.push(n + ' без svg'); a.destroy(); } catch (e) { bad.push(n + ' ' + e.message); } }
  box.remove(); return bad; })().then(b => JSON.stringify(b))`));
ok(bad.length === 0, `все ${codes.length} анимаций грузятся и рисуются`, bad);
await c.ev(`localStorage.setItem('dm_theme', 'light')`); await c.go(B + '/index.html?r=3#dict', 1500);
await waitFor(`document.querySelectorAll('.v-item').length > 0`); await c.wait(500);
await c.shot('home-dict-light.png');
await c.ev(`localStorage.setItem('dm_theme', 'dark')`);

// ── 4. Облачное слияние ──
console.log('4. Облако: cloud-sync.js → Progress.renderHomeProgress()');
await fresh(PROG);
await c.ev(`Progress.importAll({ progress: { xp: 520, streak: 7, completedLessons: ['a1-01','a1-02','a1-03','a1-04'] } }); Progress.renderHomeProgress();`);
await c.wait(200);
s = await J(SNAP);
ok(s.statXp === '520' && s.statDone === '4' && s.xpLevel === '3' && s.xpNow === '120' && s.streak === '7', `после слияния: XP ${s.statXp}, уроков ${s.statDone}, уровень ${s.xpLevel}, серия ${s.streak}`);
ok(s.done.length + s.cur.length === 4 && s.courseCount === '4 из 68 уроков', `путь перерисован: ${s.done.length} пройдено + текущий ${s.cur}, ${s.courseCount}`);

// ── 5. Переходы и действия ──
console.log('5. Переходы и действия');
await fresh(PROG);
await c.ev(`document.getElementById('continueBtn').click()`);
ok(await waitFor(`location.pathname.includes('/lessons/a1/lesson-04/')`), '«Продолжить урок» открывает урок 04');
for (const [id, path] of [['readBooks', '/books.html'], ['readNews', '/news.html'], ['readDialogs', '/dialogs.html']]) {
  await c.go(B + '/index.html', 1200);
  await c.ev(`document.getElementById('${id}').click()`);
  ok(await waitFor(`location.pathname.endsWith('${path}')`), `${id} → ${path}`);
}
await c.go(B + '/index.html#more', 1500);
await c.ev(`[...document.querySelectorAll('[data-tab="more"] .row')].find(r => /Поддержать/.test(r.textContent)).click()`);
ok(await waitFor(`!!document.querySelector('.dm-modal.show')`, 3000), '«Поддержать проект» открывает окно поддержки');
await c.ev('dmClose()'); await c.wait(400);
const contact = await c.ev(`(() => { const log = []; window.open = (u, t) => { log.push(u + ' ' + t); return null; };
  [...document.querySelectorAll('[data-tab="more"] .row')].find(r => /Связь/.test(r.textContent)).click(); return log.join(';'); })()`);
ok(contact === 'https://t.me/ObiVan1978 _blank', `«Связь с автором» в браузере: ${contact}`);
const contactTg = await c.ev(`(() => { const log = []; window.Telegram = { WebApp: { openTelegramLink: u => log.push('tg ' + u), HapticFeedback: { impactOccurred() {} } } };
  window.open = u => log.push('win ' + u);
  [...document.querySelectorAll('[data-tab="more"] .row')].find(r => /Связь/.test(r.textContent)).click(); delete window.Telegram; return log.join(';'); })()`);
ok(contactTg === 'tg https://t.me/ObiVan1978', `«Связь с автором» в мини-аппе: ${contactTg}`);
await c.ev(`document.getElementById('installMenuBtn').click()`);
ok(await waitFor(`(document.getElementById('installModal') || {}).style?.display === 'flex'`, 2000), '«Установить на телефон» открывает инструкцию');
ok(await c.ev(`document.querySelectorAll('#installMenuBtn').length === 1`), 'install-app.js не добавил второй пункт «Установить»');
await c.ev(`document.getElementById('installClose').click()`);
// плашка «Нет звука» (её рисует install-app.js только в Telegram) — над панелью вкладок
const banner = await J(`(() => { const b = document.createElement('div'); b.id = 'installBanner'; b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;height:40px';
  document.body.appendChild(b); const r = b.getBoundingClientRect(), t = document.querySelector('.tabbar').getBoundingClientRect(); b.remove(); return { b: Math.round(r.bottom), t: Math.round(t.top) }; })()`);
ok(banner.b <= banner.t, `плашка «Нет звука» над панелью вкладок (${banner.b} ≤ ${banner.t})`);

// бейдж «Свежее» — по тому же правилу, что лента
const expectFresh = await c.ev(`fetch('${B}/data/news/index.json').then(r => r.json()).then(x => x.items.some(it => dmNewsAgeDays(it.published) <= DM_NEWS_FRESH_DAYS))`);
await c.go(B + '/index.html', 1800);
const badge = await c.ev(`!document.getElementById('newsFresh').hidden`);
ok(badge === expectFresh, `«Свежее» у новостей: ${badge} (ожидалось ${expectFresh})`);

// ── 6. Тема ──
console.log('6. Тема');
await c.go(B + '/index.html#more', 1500);
await c.ev(`document.querySelector('[data-set-theme="light"]').click()`); await c.wait(300);
let th = await J(`({ t: document.documentElement.getAttribute('data-theme'), saved: localStorage.getItem('dm_theme'), bg: getComputedStyle(document.body).backgroundColor, on: document.querySelector('[data-set-theme].on').dataset.setTheme })`);
ok(th.t === 'light' && th.saved === 'light' && th.on === 'light' && th.bg === 'rgb(255, 255, 255)', `светлая тема: ${JSON.stringify(th)}`);
await c.shot('home-profile-light.png');
await c.go(B + '/index.html', 1500);
ok(await c.ev(`document.documentElement.getAttribute('data-theme')`) === 'light', 'светлая тема сохраняется после перезагрузки');
await c.shot('home-progress-light.png');
await c.ev(`location.hash = 'course'`); await c.go(B + '/index.html#course', 1500);
await c.shot('home-course-light.png');

// ── 7. Контраст ──
console.log('7. Контраст (WCAG AA)');
const CONTRAST = `(() => {
  const rgb = s => s.match(/[\\d.]+/g).slice(0, 4).map(Number);
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const bgOf = el => { while (el) { const c = rgb(getComputedStyle(el).backgroundColor); if (c[3] === undefined || c[3] > .5) return c; el = el.parentElement; } return [255,255,255]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const sel = ['#continueBtn', '.now-sub', '.now-num', '.step span', '.tile-head', '.tile-big small', '.tile-big .word', '.tile-hint', '#streakNum',
    '.read-title', '.read-sub', '.fresh', '.tab-btn', '.tab-btn.on', '.lvl-count', '.lc-title', '.lc-words', '.lesson-card[data-state="done"] .lc-state',
    '.lesson-card[data-state="cur"] .lc-state', '.lc-go', '.row-title', '.row-sub', '.stat span', '.seg button.on', '.seg button:not(.on)', '.page-aside', '.group-title'];
  const out = [];
  for (const s of sel) for (const e of [...document.querySelectorAll(s)].slice(0, 2)) {
    const r = ratio(rgb(getComputedStyle(e).color), bgOf(e));
    out.push([s, Math.round(r * 100) / 100]);
  }
  return out;
})()`;
for (const theme of ['dark', 'light']) {
  await c.ev(`localStorage.setItem('dm_theme', '${theme}'); document.getElementById('newsFresh').hidden = false;
    document.querySelectorAll('[data-tab]').forEach(e => e.hidden = false); document.querySelectorAll('.path').forEach(e => e.hidden = false)`);
  await c.go(B + '/index.html', 1500);
  await c.ev(`document.getElementById('newsFresh').hidden = false; document.querySelectorAll('[data-tab]').forEach(e => e.hidden = false); document.querySelectorAll('.path').forEach(e => e.hidden = false)`);
  const res = await J(CONTRAST);
  const bad = res.filter(([, r]) => r < 4.5);
  ok(bad.length === 0, `${theme}: контраст ≥ 4.5 у ${res.length} подписей` + (bad.length ? '' : ` (мин. ${Math.min(...res.map(x => x[1]))})`), bad);
}

// ── 7б. Тема Telegram (themeParams) ──
console.log('7б. Цвета темы Telegram: iOS и Android, светлая и тёмная');
const PALETTES = {
  'ios-dark':      { scheme: 'dark',  p: { bg_color: '#000000', secondary_bg_color: '#1c1c1d', section_bg_color: '#2c2c2e', text_color: '#ffffff', hint_color: '#98989e', link_color: '#3e88f7', button_color: '#3e88f7', button_text_color: '#ffffff', accent_text_color: '#3e88f7', section_separator_color: '#545458' } },
  'ios-light':     { scheme: 'light', p: { bg_color: '#ffffff', secondary_bg_color: '#efeff4', section_bg_color: '#ffffff', text_color: '#000000', hint_color: '#8e8e93', link_color: '#007aff', button_color: '#007aff', button_text_color: '#ffffff', accent_text_color: '#007aff', section_separator_color: '#c8c7cc' } },
  'android-dark':  { scheme: 'dark',  p: { bg_color: '#212d3b', secondary_bg_color: '#151e27', section_bg_color: '#1d2733', text_color: '#ffffff', hint_color: '#7d8b99', link_color: '#5eabe1', button_color: '#50a8eb', button_text_color: '#ffffff', accent_text_color: '#64b5ef' } },
  'android-light': { scheme: 'light', p: { bg_color: '#ffffff', secondary_bg_color: '#f0f0f0', text_color: '#222222', hint_color: '#a8a8a8', link_color: '#2678b6', button_color: '#50a8eb', button_text_color: '#ffffff' } }
};
const tgStub = (scheme, p) => `window.Telegram = { WebApp: { themeParams: ${JSON.stringify(p)}, colorScheme: '${scheme}', platform: 'ios', initData: '', initDataUnsafe: {}, version: '8.0',
  ready() {}, expand() {}, isVersionAtLeast() { return true; }, BackButton: { show() {}, hide() {}, onClick() {} },
  onEvent(e, f) { if (e === 'themeChanged') window.__tgThemeChanged = f; }, HapticFeedback: { impactOccurred() {}, selectionChanged() {} }, openTelegramLink() {} } };
  try { localStorage.setItem('tg_welcomed', '1'); sessionStorage.setItem('dm_install_banner_hidden', '1'); } catch (e) {}`;
for (const [name, { scheme, p }] of Object.entries(PALETTES)) {
  const { result } = await c.send('Page.addScriptToEvaluateOnNewDocument', { source: tgStub(scheme, p) });
  await fresh({ ...PROG, dm_theme: scheme });
  await c.wait(700);
  const tg = await J(`({ theme: document.documentElement.getAttribute('data-theme'), on: document.documentElement.classList.contains('tg-theme'),
    bg: getComputedStyle(document.body).backgroundColor, btn: getComputedStyle(document.getElementById('continueBtn')).backgroundColor })`);
  const hex = h => 'rgb(' + [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(', ') + ')';
  ok(tg.theme === scheme && tg.on && tg.bg === hex(p.bg_color), `${name}: тема ${tg.theme}, фон как в Telegram (${tg.bg})`, tg);
  await c.ev(`document.getElementById('newsFresh').hidden = false`);
  await c.shot(`home-tg-${name}.png`);
  await c.ev(`document.querySelectorAll('[data-tab]').forEach(e => e.hidden = false); document.querySelectorAll('.path').forEach(e => e.hidden = false)`);
  const res = await J(CONTRAST);
  const bad = res.filter(([, r]) => r < 4.5);
  ok(bad.length === 0, `${name}: контраст ≥ 4.5 у ${res.length} подписей` + (bad.length ? '' : ` (мин. ${Math.min(...res.map(x => x[1]))})`), bad);
  if (name === 'ios-dark') {
    // выбрал в профиле другую тему — своя палитра, а не цвета Telegram
    await c.ev(`document.querySelector('[data-set-theme="light"]').click()`); await c.wait(700);
    const own = await J(`({ on: document.documentElement.classList.contains('tg-theme'), bg: getComputedStyle(document.body).backgroundColor })`);
    ok(!own.on && own.bg === 'rgb(255, 255, 255)', `ios-dark + «Светлая» в профиле: своя светлая палитра (${own.bg})`);
    await c.ev(`document.querySelector('[data-set-theme="dark"]').click()`); await c.wait(200);
    ok(await c.ev(`document.documentElement.classList.contains('tg-theme')`), 'вернул «Тёмную» — снова цвета Telegram');
    // пользователь сменил тему оформления Telegram на лету
    await c.ev(`Telegram.WebApp.themeParams = ${JSON.stringify(PALETTES['android-dark'].p)}; window.__tgThemeChanged && window.__tgThemeChanged()`); await c.wait(700);
    ok(await c.ev(`getComputedStyle(document.body).backgroundColor`) === 'rgb(33, 45, 59)', 'themeChanged — палитра обновилась на лету');
  }
  await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: result.identifier });
}
// вне Telegram — прежняя своя палитра
await fresh({ ...PROG, dm_theme: 'dark' });
ok(await c.ev(`!document.documentElement.classList.contains('tg-theme') && getComputedStyle(document.body).backgroundColor === 'rgb(22, 32, 42)'`), 'в браузере — своя тёмная палитра');

// ── 8. Украинский ──
console.log('8. Украинский');
await fresh({ ...PROG, dm_lang: { lang: 'uk', ts: Date.now() } });
s = await J(SNAP);
const ru = await J(`[...document.querySelectorAll('.home-main *, .tabbar *')].filter(e => !e.children.length && /[ыэъЫЭЪёЁ]/.test(e.textContent)).map(e => e.textContent.trim()).slice(0, 10)`);
ok(s.lang === 'uk' && ru.length === 0, 'uk: нет русских слов (ы/э/ъ/ё)', ru);
const ukT = await J(`[...document.querySelectorAll('.tab-btn span')].map(e => e.textContent)`);
ok(ukT.join() === 'Головна,Курс,Словник,Профіль', `uk: вкладки ${ukT}`);
await c.ev(`document.querySelector('[data-tab-btn="dict"]').click()`);
await waitFor(`document.querySelectorAll('.v-item').length > 0`);
await c.ev(`(() => { const i = document.getElementById('vocabQuery'); i.value = 'собака'; i.dispatchEvent(new Event('input')); })()`); await c.wait(400);
const ukV = await J(`({ ph: document.getElementById('vocabQuery').placeholder, rows: [...document.querySelectorAll('.v-item')].map(r => r.querySelector('.v-word').textContent + ' — ' + r.querySelector('.v-tr').textContent).slice(0, 3),
  cnt: document.getElementById('vocabCount').textContent })`);
ok(/українською/.test(ukV.ph) && ukV.rows.includes('Hund — собака') && /слів$/.test(ukV.cnt), `uk словник: «${ukV.ph}», ${ukV.rows.join('; ')}, ${ukV.cnt}`);
await c.shot('home-uk-dict.png');
ok(s.btn === 'Продовжити урок' && s.nowSub === 'Пройдено 2 з 5' && s.nowTitle === "Сім'я", `uk: ${s.btn} · ${s.nowSub} · ${s.nowTitle}`);
ok(s.courseCount === '3 з 68 уроків' && s.streakWord === 'днів поспіль', `uk: ${s.courseCount} · ${s.streakWord}`);
await c.shot('home-uk.png');
// переключатель языка в профиле
await c.ev(`document.querySelector('[data-tab-btn="more"]').click()`); await c.wait(200);
ok(await c.ev(`document.querySelector('[data-set-lang].on').dataset.setLang`) === 'uk', 'в профиле отмечен UA');
await c.ev(`document.querySelector('[data-set-lang="ru"]').click()`);
ok(await waitFor(`I18N.lang === 'ru' && typeof Home !== 'undefined'`, 6000), 'RU в профиле переключает язык на русский');

// ── 9. Арабский ──
console.log('9. Арабский RTL');
await fresh({ ...PROG, dm_lang: { lang: 'ar', ts: Date.now() } });
await c.wait(600);
s = await J(SNAP);
const cyr = await J(`[...document.querySelectorAll('.home-main *, .tabbar *')].filter(e => !e.children.length && /[А-Яа-яЁё]/.test(e.textContent)).map(e => e.textContent.trim()).slice(0, 10)`);
ok(s.lang === 'ar' && s.dir === 'rtl', `ar: dir=${s.dir}`);
ok(cyr.length === 0, 'ar: нет кириллицы', cyr);
ok(!s.hscroll, 'ar: нет горизонтальной прокрутки');
const geo = await J(`(() => { const r = document.getElementById('nowCard').getBoundingClientRect(); const t = document.querySelector('.now-top .lvl-badge').getBoundingClientRect();
  return { l: Math.round(r.left), r: Math.round(innerWidth - r.right), badgeRight: t.right > r.left + r.width / 2, banner: !!document.querySelector('.ar-trial') }; })()`);
ok(Math.abs(geo.l - geo.r) <= 2 && geo.l >= 14, `ar: поля симметричны (${geo.l} / ${geo.r})`);
ok(geo.badgeRight, 'ar: плашка уровня справа (зеркально)');
ok(geo.banner, 'ar: плашка пробной версии на месте');
await c.ev(`document.querySelector('.ar-trial')?.remove(); scrollTo(0,0)`);
await c.shot('home-ar.png');
await c.ev(`document.querySelector('[data-tab-btn="course"]').click()`); await c.wait(300);
await c.shot('home-ar-course.png');
await c.ev(`document.querySelector('[data-tab-btn="more"]').click()`); await c.wait(300);
await c.shot('home-ar-profile.png');
ok(await c.ev(`document.querySelector('[data-set-lang].on').dataset.setLang`) === 'ar', 'ar: в профиле отмечен AR');
await c.ev(`document.querySelector('[data-tab-btn="dict"]').click()`);
await waitFor(`document.querySelectorAll('.v-item').length > 0`); await c.wait(400);
const arV = await J(`({ cyr: [...document.querySelectorAll('[data-tab="dict"] *')].filter(e => !e.children.length && /[А-Яа-яЁё]/.test(e.textContent)).map(e => e.textContent.trim()).slice(0, 5),
  ph: document.getElementById('vocabQuery').placeholder, hs: document.documentElement.scrollWidth > innerWidth + 1 })`);
ok(arV.cyr.length === 0 && !/[А-Яа-я]/.test(arV.ph) && !arV.hs, `ar: словарь по-арабски, без кириллицы («${arV.ph}»)`, arV);
await c.shot('home-ar-dict.png');

// ── 10. Маленький экран и десктоп ──
console.log('10. 360×640 и 1280×800');
await fresh(PROG);
await phone(360, 640);
await c.go(B + '/index.html', 1500);
s = await J(SNAP);
const clip = await J(`[...document.querySelectorAll('.home-main *')].filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible' && !e.matches('.now-card, .now-bg, .lc-sub, .step span, .lc-num, .lc-status')).map(e => e.className).slice(0, 5)`);
ok(!s.hscroll && clip.length === 0, '360px: без прокрутки и обрезанного текста', clip);
await c.shot('home-360.png');
await phone(1280, 800);
await c.go(B + '/index.html', 1500);
const desk = await J(`(() => { const m = document.querySelector('.home-main').getBoundingClientRect(); const W = document.documentElement.clientWidth; return { w: Math.round(m.width), l: Math.round(m.left), r: Math.round(W - m.right) }; })()`);
ok(desk.w <= 520 && Math.abs(desk.l - desk.r) <= 2, `десктоп: колонка ${desk.w}px по центру (${desk.l} / ${desk.r})`);
await c.shot('home-1280.png');

const errs = c.errors();
ok(errs.length === 0, 'нет ошибок JS' + (errs.length ? ': ' + errs.join(' | ') : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ', '· скриншоты:', SP);
process.exit(fail ? 1 : 0);
