#!/usr/bin/env node
/* ═══════════════════════════════════════════════
   tools/test_i18n.js — юнит-тест js/i18n.js без браузера (vm + заглушки)

   Проверяет выбор языка (URL / устройство / Telegram, last-write-wins по ts),
   перевод строк, шаблоны {n}/{s}, замены без кириллицы и перевод данных.
   Запуск: node tools/test_i18n.js
   ═══════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
const UI = fs.readFileSync(path.join(ROOT, 'i18n/uk/ui.js'), 'utf8');

let fails = 0;
function check(name, cond, extra) {
  console.log((cond ? '  ok   ' : '  FAIL ') + name + (!cond && extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
  if (!cond) fails++;
}

/* Окружение страницы: search/hash, localStorage, язык Telegram */
function boot({ search = '', hash = '', store = {}, path: pathname = '/index.html' } = {}) {
  const written = [];
  const ctx = {
    location: { search, hash, pathname, href: 'https://x.test' + pathname + search + hash, reload() { ctx.__reloaded = true; } },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    sessionStorage: { getItem: () => null, setItem() {} },
    history: { state: null, replaceState(st, t, url) { ctx.__url = url; } },
    document: {
      documentElement: { setAttribute(k, v) { ctx.__htmlLang = v; } },
      currentScript: { getAttribute: () => 'js/i18n.js?v=7' },
      readyState: 'complete',
      write(s) { written.push(s); },
      addEventListener() {},
      querySelectorAll: () => [],
      createTreeWalker: () => ({ nextNode: () => null }),
    },
    MutationObserver: class { observe() {} },
    fetch: () => Promise.reject(new Error('offline')),
    URLSearchParams, URL, WeakMap, Promise, setTimeout, JSON, Date, Number, String, Object, Array, RegExp, Error,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  return { I: ctx.I18N, ctx, store, written };
}

const tgHash = code => '#tgWebAppData=' + encodeURIComponent('user=' + encodeURIComponent(JSON.stringify({ id: 1, language_code: code })) + '&hash=x');

console.log('1. Выбор языка');
check('по умолчанию ru', boot().I.lang === 'ru');
check('Telegram uk → uk (первый запуск)', boot({ hash: tgHash('uk') }).I.lang === 'uk');
check('Telegram ar → ar (пробная версия)', boot({ hash: tgHash('ar') }).I.lang === 'ar');
check('Telegram en → ru', boot({ hash: tgHash('en') }).I.lang === 'ru');
let r = boot({ search: '?lang=uk&lts=100' });
check('URL ?lang=uk', r.I.lang === 'uk');
check('URL сохранён на устройстве', JSON.parse(r.store.dm_lang).ts === 100, r.store.dm_lang);
check('URL очищен от lang/lts', r.ctx.__url === '/index.html', r.ctx.__url);
check('<html lang="uk">', r.ctx.__htmlLang === 'uk');
r = boot({ search: '?lang=ru&lts=50', store: { dm_lang: JSON.stringify({ lang: 'uk', ts: 100 }) } });
check('старая кнопка бота (lts меньше) НЕ перебивает', r.I.lang === 'uk');
r = boot({ search: '?lang=ru&lts=200', store: { dm_lang: JSON.stringify({ lang: 'uk', ts: 100 }) } });
check('свежая кнопка бота перебивает', r.I.lang === 'ru');
r = boot({ store: { dm_lang: JSON.stringify({ lang: 'uk', ts: 1 }) }, hash: tgHash('ru') });
check('выбор на устройстве важнее языка Telegram', r.I.lang === 'uk');
r = boot({ store: { dm_lang: '{битый' } });
check('битая запись → ru без падения', r.I.lang === 'ru');
r = boot({ search: '?lang=ar&lts=5' });
check('?lang=ar', r.I.lang === 'ar');
r = boot({ search: '?lang=xx&lts=5' });
check('неизвестный ?lang игнорируется', r.I.lang === 'ru');

console.log('2. Подключение словарей');
r = boot({ search: '?lang=uk&lts=1' });
check('на главной — только ui.js', r.written.length === 1 && /i18n\/uk\/ui\.js\?v=7/.test(r.written[0]), r.written);
r = boot({ search: '?lang=uk&lts=1', path: '/deutsch-meister/lessons/b2/lesson-04/index.html' });
check('на уроке — ui + lexicon + урок', r.written.length === 3 && /lessons\/b2-04\.js/.test(r.written[2]), r.written);
r = boot();
check('ru — ничего не подключает', r.written.length === 0);
r = boot({ search: '?lang=ar&lts=1' });
check('ar на главной — ui + ar-trial.js', r.written.length === 2 && /i18n\/ar\/ui\.js/.test(r.written[0]) && /js\/ar-trial\.js/.test(r.written[1]), r.written);
r = boot({ search: '?lang=ar&lts=1', path: '/deutsch-meister/lessons/a1/lesson-01/index.html' });
check('ar на уроке A1-01 — ui + lexicon + урок + ar-trial', r.written.length === 4 && /ar\/lessons\/a1-01\.js/.test(r.written[2]), r.written);
r = boot({ search: '?lang=ar&lts=1', path: '/deutsch-meister/lessons/a1/lesson-02/index.html' });
check('ar на непереведённом уроке — без словаря урока', r.written.length === 2 && !r.written.some(w => /lessons\/a1-02/.test(w)), r.written);

console.log('3. Перевод');
r = boot({ search: '?lang=uk&lts=1' });
vm.runInContext(UI, r.ctx);
const t = r.I.t;
const cases = [
  ['Главная', 'Головна'],
  ['  Пройдено:  ', '  Пройдено:  '],
  ['Карточка 4 из 10', 'Картка 4 з 10'],
  ['Слово 3 из 8', 'Слово 3 з 8'],
  ['📗 5 слов в словаре', '📗 5 слів у словнику'],
  ['Собрано: 12 слов (10 новых, 2 знаю)', 'Зібрано: 12 слів (10 нових, 2 знаю)'],
  ['4 главы', '4 розділи'],
  ['Читать →', 'Читати →'],
  ['Привет, друг!', 'Привіт, друже!'],
  ['Hallo', 'Hallo'],
  ['Совсем неизвестная строка', 'Совсем неизвестная строка'],
];
for (const [a, b] of cases) check(JSON.stringify(a) + ' → ' + JSON.stringify(b), t(a) === b, t(a));
check('ru-режим не трогает строки', boot().I.t('Главная') === 'Главная');

console.log('4. Перевод данных урока');
const data = { title: 'Beim Arzt', note: 'Главная', list: ['Карточка 1 из 2', { de: 'Hallo' }] };
r.I.data(data);
check('строки заменены, немецкие и ключи — нет', data.note === 'Головна' && data.list[0] === 'Картка 1 з 2' && data.title === 'Beim Arzt' && data.list[1].de === 'Hallo', data);

console.log('5. Первый урок: переводы подсказок, спряжение и метаданные');
const readProject = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const shell = readProject('lessons/a1/lesson-01/index.html');
const inlineLesson = [...shell.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => m[1]).find(s => s.includes('CURRENT_LESSON_NUM'));

function lessonBoot(lang) {
  const env = boot({ search: '?lang=' + lang + '&lts=100' });
  if (lang !== 'ru') {
    for (const file of ['ui.js', 'lexicon.js', 'lessons/a1-01.js']) {
      vm.runInContext(readProject('i18n/' + lang + '/' + file), env.ctx);
    }
  }
  const nodes = {};
  const element = () => ({
    style: {}, children: [], textContent: '', innerHTML: '',
    appendChild(child) { this.children.push(child); }, addEventListener() {}
  });
  Object.assign(env.ctx.document, {
    readyState: 'loading',
    querySelector: () => null,
    getElementById: id => nodes[id] || null,
    createElement: element,
    body: { appendChild(el) { nodes[el.id] = el; } }
  });
  vm.runInContext(readProject('data/a1/a1-lesson-01.js'), env.ctx);
  vm.runInContext(readProject('js/lesson-render.js'), env.ctx);
  vm.runInContext(inlineLesson, env.ctx);
  return { ...env, nodes, element };
}

for (const lang of ['ru', 'uk', 'ar']) {
  const env = lessonBoot(lang);
  const translations = vm.runInContext(`
    [...new Set(LESSON_DATA.phrases.flatMap(p => p.de.match(/[A-Za-zÄäÖöÜüß]+/g) || []))]
      .map(word => ({word, html: LessonRender.wordHtml(word)}))`, env.ctx);
  const alphabet = lang === 'ar' ? /[\u0600-\u06ff]/ : /[А-Яа-яЁёІіЇїЄєҐґ]/;
  const missing = translations.filter(({html}) => {
    const tr = (html.match(/<span class="word-tip-ru">([^<]*)<\/span>/) || [])[1] || '';
    return !alphabet.test(env.I.t(tr));
  }).map(({word}) => word);
  check(lang + ': у всех слов фраз есть перевод', !missing.length, missing);

  env.nodes.conjugationTable = env.element();
  env.ctx.renderConjugation();
  const forms = () => env.nodes.conjugationTable.children.map(row => (row.innerHTML.match(/<strong>(.*?)<\/strong>/) || [])[1]);
  const expected = ['heiße', 'heißt', 'heißt', 'heißen', 'heißt', 'heißen'];
  check(lang + ': таблица heißen', JSON.stringify(forms()) === JSON.stringify(expected), forms());
  vm.runInContext('LESSON_DATA.grammar.reverse()', env.ctx);
  env.nodes.conjugationTable.children = [];
  env.ctx.renderConjugation();
  check(lang + ': таблица не зависит от порядка блоков', JSON.stringify(forms()) === JSON.stringify(expected), forms());

  env.nodes.lessonDuration = env.element();
  env.nodes.lessonWordCount = env.element();
  if (typeof env.ctx.renderLessonMeta === 'function') env.ctx.renderLessonMeta();
  check(lang + ': длительность и 25 слов из данных',
    env.nodes.lessonDuration.textContent === vm.runInContext('LESSON_DATA.meta.duration', env.ctx)
    && String(env.nodes.lessonWordCount.textContent) === '25');
  vm.runInContext('LESSON_DATA.meta.duration = "40–45"; LESSON_DATA.vocabulary.pop()', env.ctx);
  if (typeof env.ctx.renderLessonMeta === 'function') env.ctx.renderLessonMeta();
  check(lang + ': шапка обновляется при изменении данных',
    env.nodes.lessonDuration.textContent === '40–45' && String(env.nodes.lessonWordCount.textContent) === '24');

  const handlers = {};
  for (const id of ['installClose', 'installOpenBrowser']) {
    env.nodes[id] = { addEventListener(type, fn) { handlers[id] = fn; } };
  }
  let opened = '';
  env.ctx.navigator = { userAgent: 'Telegram Android' };
  env.ctx.Telegram = { WebApp: { platform: 'android', openLink(url) { opened = url; } } };
  vm.runInContext(readProject('js/install-app.js'), env.ctx);
  env.ctx.openInstallModal();
  const para = env.nodes.installModal.innerHTML.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)[1];
  const rendered = para.split(/<[^>]*>/).map(s => env.I.t(s)).join('');
  const expectedParagraph = env.I.t('Если в Telegram нет звука — установи German Morning на телефон и запускай')
    + ' ' + env.I.t('с иконки. Там озвучка работает, плюс офлайн-доступ. 🔊');
  check(lang + ': весь абзац установки переведён', rendered === expectedParagraph, rendered);
  handlers.installOpenBrowser();
  const url = new URL(opened);
  check(lang + ': ссылка передаёт язык и время выбора',
    url.searchParams.get('lang') === lang && Number(url.searchParams.get('lts')) > 100, opened);
  check(lang + ': чистый внешний браузер сохраняет язык', boot({search:url.search}).I.lang === lang);
  check(lang + ': старый выбор во внешнем браузере обновлён',
    boot({search:url.search, store:{dm_lang:JSON.stringify({lang:lang === 'ru' ? 'uk' : 'ru', ts:100})}}).I.lang === lang);
  env.ctx.Telegram = null;
  env.ctx.open = url => { opened = url; };
  opened = '';
  handlers.installOpenBrowser();
  check(lang + ': резервный window.open тоже передаёт язык', new URL(opened).searchParams.get('lang') === lang);
}


console.log(fails ? `\nПРОВАЛЕНО: ${fails}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
process.exitCode = fails ? 1 : 0;
