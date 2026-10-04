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
check('Telegram ar → ru (арабский неактивен)', boot({ hash: tgHash('ar') }).I.lang === 'ru');
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
check('?lang=ar игнорируется', r.I.lang === 'ru');

console.log('2. Подключение словарей');
r = boot({ search: '?lang=uk&lts=1' });
check('на главной — только ui.js', r.written.length === 1 && /i18n\/uk\/ui\.js\?v=7/.test(r.written[0]), r.written);
r = boot({ search: '?lang=uk&lts=1', path: '/deutsch-meister/lessons/b2/lesson-04/index.html' });
check('на уроке — ui + lexicon + урок', r.written.length === 3 && /lessons\/b2-04\.js/.test(r.written[2]), r.written);
r = boot();
check('ru — ничего не подключает', r.written.length === 0);

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

console.log(fails ? `\nПРОВАЛЕНО: ${fails}` : '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ');
process.exitCode = fails ? 1 : 0;
