#!/usr/bin/env node
/* ═══════════════════════════════════════════════
   tools/i18n.js — переводы интерфейса и контента

   Исходник переводов: i18n/<lang>/src/<группа>.json — {русская строка: перевод}.
   Группы: ui (интерфейс), lexicon (подсказки над словами), lessons/<a1-01>,
   books/<id>, books-index.
   Поиск перевода идёт по ВСЕМ группам (общая память переводов), так что
   одинаковая строка переводится один раз.

   Команды:
     node tools/i18n.js extract [lang]   — список строк по группам → i18n/keys/*.json
     node tools/i18n.js todo <group> [lang] [limit]
                                         — непереведённые строки группы (по одной
                                           в строке, \n экранирован) → stdout
     node tools/i18n.js merge <group> <file> [lang]
                                         — file: переводы построчно в том же
                                           порядке, что выдал todo
     node tools/i18n.js build [lang]     — рантайм-файлы в i18n/<lang>/
     node tools/i18n.js check [lang]     — покрытие; exit 1, если есть пропуски
   ═══════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CYR = /[А-Яа-яЁё]/;
const rel = p => path.join(ROOT, p);
const read = p => fs.readFileSync(rel(p), 'utf8');
const exists = p => fs.existsSync(rel(p));
const writeJson = (p, o) => { fs.mkdirSync(path.dirname(rel(p)), { recursive: true }); fs.writeFileSync(rel(p), JSON.stringify(o, null, 1) + '\n'); };

/* ── лексер JS: строковые литералы без комментариев ── */
function jsStrings(src) {
  const out = [];          // { text, tpl: bool(есть ${}) }
  let i = 0, prev = '';    // prev — последний значимый символ/слово (для regex)
  const n = src.length;
  const regexAllowed = () => /[(,=:[!&|?{};+\-*%<>~^]$/.test(prev) || prev === '' || /\b(return|typeof|case|in|of|delete|void|throw|new)$/.test(prev);
  function readQuoted(q) {
    let s = '', j = i + 1;
    while (j < n && src[j] !== q) {
      if (src[j] === '\\') { s += unescape2(src[j + 1]); j += 2; continue; }
      if (src[j] === '\n') break;
      s += src[j++];
    }
    i = j + 1;
    return s;
  }
  function unescape2(c) { return { n: '\n', t: '\t', r: '', '\\': '\\', "'": "'", '"': '"', '`': '`', '$': '$' }[c] ?? c; }
  function readTemplate() {
    // возвращает части статического текста; ${...} → \u0000
    let s = '', j = i + 1, tpl = false;
    while (j < n && src[j] !== '`') {
      if (src[j] === '\\') { s += unescape2(src[j + 1]); j += 2; continue; }
      if (src[j] === '$' && src[j + 1] === '{') {
        tpl = true;
        // вложенные выражения: рекурсивно лексим до парной }
        let depth = 1, k = j + 2;
        const start = k;
        while (k < n && depth) {
          const c = src[k];
          if (c === '{') depth++;
          else if (c === '}') depth--;
          else if (c === '`' || c === '"' || c === "'") {
            // вложенный литерал: используем тот же лексер на подстроке
            const save = i; i = k;
            if (c === '`') { const r = readTemplate(); out.push(r); } else { const t = readQuoted(c); out.push({ text: t, tpl: false }); }
            k = i; i = save; continue;
          }
          k++;
        }
        void start;
        s += '\u0000';
        j = k;
        continue;
      }
      s += src[j++];
    }
    i = j + 1;
    return { text: s, tpl };
  }
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'") { out.push({ text: readQuoted(c), tpl: false }); prev = 'x'; continue; }
    if (c === '`') { out.push(readTemplate()); prev = 'x'; continue; }
    if (c === '/' && regexAllowed()) {
      let j = i + 1, cls = false;
      while (j < n && (cls || src[j] !== '/')) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false;
        if (src[j] === '\n') break;
        j++;
      }
      i = j + 1; while (/[a-z]/.test(src[i] || '')) i++;
      prev = 'x'; continue;
    }
    if (/\s/.test(c)) { i++; continue; }
    if (/[A-Za-z_$0-9]/.test(c)) { let j = i; while (j < n && /[A-Za-z_$0-9]/.test(src[j])) j++; prev = src.slice(i, j); i = j; continue; }
    prev = c; i++;
  }
  return out;
}

/* Текст литерала → строки, как они окажутся в DOM: режем по тегам,
   декодируем сущности, ${} → {n}. */
const ENT = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&laquo;': '«', '&raquo;': '»', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&rarr;': '→', '&larr;': '←', '&middot;': '·', '&times;': '×' };
// отступы внутри многострочных литералов в DOM не видны — схлопываем
const collapse = s => s.replace(/\n[ \t]+/g, ' ').trim();
const decode = s => s.replace(/&[a-z]+;|&#\d+;/g, e => ENT[e] ?? (e.startsWith('&#') ? String.fromCharCode(+e.slice(2, -1)) : e));

function fragments(text) {
  const res = [];
  // атрибуты внутри разметки
  text.replace(/\b(?:title|placeholder|aria-label|alt)="([^"]*)"/g, (_, v) => { res.push(v); return ''; });
  text.replace(/\b(?:title|placeholder|aria-label|alt)='([^']*)'/g, (_, v) => { res.push(v); return ''; });
  const noTags = /<[a-zA-Z\/!]/.test(text) ? text.split(/<[^>]*>/) : [text];
  for (let part of noTags) {
    // хвосты тегов, разрезанных между литералами: 'style="…">Текст' / 'Текст<span'
    if (/["']\s*\/?>/.test(part)) part = part.slice(part.lastIndexOf('>') + 1);
    if (/<[a-zA-Z\/]/.test(part)) part = part.slice(0, part.search(/<[a-zA-Z\/]/));
    res.push(part);
  }
  return res
    .map(s => collapse(decode(s).replace(/\u0000/g, '{n}')))
    // служебные сообщения консоли («[Library] …») пользователь не видит
    .filter(s => CYR.test(s) && !/^\[[A-Za-z]+\]/.test(s));
}

/* ── HTML: текстовые узлы и атрибуты ── */
function htmlStrings(html) {
  const out = [];
  html = html.replace(/<script[\s\S]*?<\/script>/gi, m => {
    // встроенные скрипты: строки из них тоже нужны (например, A1-01)
    jsStrings(m.replace(/^<script[^>]*>|<\/script>$/gi, '')).forEach(x => fragments(x.text).forEach(f => out.push(f)));
    return '<script></script>';
  });
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  html.replace(/\b(?:title|placeholder|aria-label|alt|content)="([^"]*)"/g, (_, v) => { if (CYR.test(v)) out.push(decode(v).trim()); return ''; });
  html.split(/<[^>]*>/).forEach(t => { t = decode(t).trim(); if (CYR.test(t)) out.push(t); });
  return out;
}

/* ── источники ── */
const LEVELS = ['a1', 'a2', 'b1', 'b2'];
function lessonIds() {
  const ids = [];
  for (const lv of LEVELS) for (const f of fs.readdirSync(rel('data/' + lv)).sort()) {
    const m = f.match(/^(a1|a2|b1|b2)-lesson-(\d+)\.js$/);
    if (m) ids.push(`${m[1]}-${m[2]}`);
  }
  return ids;
}

function walkStrings(obj, out) {
  if (typeof obj === 'string') { if (CYR.test(obj)) out.push(obj); return out; }
  if (obj && typeof obj === 'object') for (const k of Object.keys(obj)) walkStrings(obj[k], out);
  return out;
}

function lessonData(id) {
  const [lv, num] = id.split('-');
  const src = read(`data/${lv}/${lv}-lesson-${num}.js`);
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src + '\n;this.__D = LESSON_DATA;', ctx);
  return ctx.__D;
}

const LEXICON_START = 'const BASIC_WORDS';
const LEXICON_END = 'let wordLexicon';

function lexiconStrings() {
  const src = read('js/lesson-render.js');
  const a = src.indexOf(LEXICON_START), b = src.indexOf(LEXICON_END);
  const out = [];
  for (const s of jsStrings(src.slice(a, b))) {
    if (s.text.includes('|') && s.text.split('\n').length > 50) {
      // COURSE_WORDS_RAW: word|ru|kind|detail
      for (const line of s.text.split('\n')) {
        line.split('|').slice(1).map(x => x.trim()).filter(x => CYR.test(x)).forEach(x => out.push(x));
      }
    } else if (CYR.test(s.text)) out.push(s.text.trim());
  }
  return out;
}

function uiStrings() {
  const out = [];
  const lr = read('js/lesson-render.js');
  const a = lr.indexOf(LEXICON_START), b = lr.indexOf(LEXICON_END);
  const sources = { 'js/lesson-render.js': lr.slice(0, a) + lr.slice(b) };
  for (const f of fs.readdirSync(rel('js'))) if (f.endsWith('.js') && f !== 'lesson-render.js' && f !== 'i18n.js') sources['js/' + f] = read('js/' + f);
  const tplKeys = [];
  for (const [file, src] of Object.entries(sources)) {
    for (const s of jsStrings(src)) for (const f of fragments(s.text)) { out.push(f); if (f.includes('{n}')) tplKeys.push(file + ': ' + f); }
  }
  for (const f of ['index.html', 'books.html', 'news.html']) htmlStrings(read(f)).forEach(s => out.push(s));
  return { out, tplKeys };
}

function bookIds() {
  return JSON.parse(read('data/books/index.json')).books.map(b => b.id);
}
function bookFiles(id) {
  return fs.readdirSync(rel('data/books/' + id)).filter(f => f.endsWith('.json')).sort().map(f => `data/books/${id}/${f}`);
}

function uniq(a) { return [...new Set(a)]; }

/* Все группы и их ключи */
function extract() {
  const groups = {};
  const shellCount = {};
  const shells = {};
  for (const id of lessonIds()) {
    const [lv, num] = id.split('-');
    const shell = `lessons/${lv}/lesson-${num}/index.html`;
    shells[id] = exists(shell) ? uniq(htmlStrings(read(shell))) : [];
    shells[id].forEach(s => { shellCount[s] = (shellCount[s] || 0) + 1; });
  }
  const { out: ui, tplKeys } = uiStrings();
  // строки оболочек, встречающиеся в 3+ уроках, — это интерфейс
  const sharedShell = Object.keys(shellCount).filter(s => shellCount[s] >= 3);
  groups.ui = uniq([...ui, ...sharedShell]);
  groups.lexicon = uniq(lexiconStrings());
  const uiSet = new Set(groups.ui);
  for (const id of lessonIds()) {
    const own = [...walkStrings(lessonData(id), []), ...shells[id].filter(s => shellCount[s] < 3)];
    groups['lessons/' + id] = uniq(own).filter(s => !uiSet.has(s));
  }
  groups['books-index'] = uniq(walkStrings(JSON.parse(read('data/books/index.json')), []));
  for (const id of bookIds()) {
    groups['books/' + id] = uniq(bookFiles(id).flatMap(f => walkStrings(JSON.parse(read(f)), [])));
  }
  return { groups, tplKeys };
}

/* ── память переводов ── */
function loadTM(lang) {
  const dir = rel(`i18n/${lang}/src`);
  const tm = Object.create(null);
  const files = {};
  if (!fs.existsSync(dir)) return { tm, files };
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.json')) {
        const g = path.relative(dir, p).replace(/\\/g, '/').replace(/\.json$/, '');
        files[g] = JSON.parse(fs.readFileSync(p, 'utf8'));
        Object.assign(tm, files[g]);
      }
    }
  })(dir);
  return { tm, files };
}

const esc = s => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
const unesc = s => s.replace(/\\(\\|n)/g, (_, c) => c === 'n' ? '\n' : '\\');

function cmdTodo(group, lang = 'uk', limit = Infinity) {
  const { groups } = extract();
  if (!groups[group]) throw new Error('нет группы ' + group + '. Есть: ' + Object.keys(groups).join(', '));
  const { tm } = loadTM(lang);
  const todo = groups[group].filter(s => tm[s] === undefined).slice(0, limit);
  fs.mkdirSync(rel(`i18n/${lang}/.todo`), { recursive: true });
  fs.writeFileSync(rel(`i18n/${lang}/.todo/${group.replace(/\//g, '__')}.txt`), todo.map(esc).join('\n'));
  process.stdout.write(todo.map(esc).join('\n') + '\n');
  console.error(`[${group}] осталось ${groups[group].filter(s => tm[s] === undefined).length}, выдано ${todo.length}`);
}

function cmdMerge(group, file, lang = 'uk', strict = false) {
  const todoFile = rel(`i18n/${lang}/.todo/${group.replace(/\//g, '__')}.txt`);
  const keys = fs.readFileSync(todoFile, 'utf8').split('\n').filter(l => l.length).map(unesc);
  const vals = fs.readFileSync(path.resolve(file), 'utf8').replace(/\r/g, '').split('\n');
  while (vals.length && vals[vals.length - 1] === '') vals.pop();
  if (strict && vals.length !== keys.length) throw new Error(`[${group}] строк: ключей ${keys.length}, переводов ${vals.length}`);
  if (vals.length > keys.length) throw new Error(`строк: ключей ${keys.length}, переводов ${vals.length}`);
  // частичный перевод: берём первые vals.length строк списка todo
  if (vals.length < keys.length) { console.error(`частично: ${vals.length} из ${keys.length}`); keys.length = vals.length; }
  const srcFile = `i18n/${lang}/src/${group}.json`;
  const cur = exists(srcFile) ? JSON.parse(read(srcFile)) : {};
  let bad = 0;
  keys.forEach((k, i) => {
    const v = unesc(vals[i]);
    // защита от сдвига строк: число {n}, HTML-тегов и цифр должно совпадать
    const sig = s => [(s.match(/\{n\}/g) || []).length, (s.match(/<[^>]+>/g) || []).length, (s.match(/\d+/g) || []).join(',')].join('|');
    if (sig(k) !== sig(v)) { bad++; console.error(`! строка ${i + 1}: структура отличается\n  ru: ${k}\n  uk: ${v}`); }
    cur[k] = v;
  });
  writeJson(srcFile, cur);
  console.error(`[${group}] добавлено ${keys.length}${bad ? `, подозрительных: ${bad}` : ''}`);
}

function translateObj(obj, tm) {
  if (typeof obj === 'string') return CYR.test(obj) && tm[obj] !== undefined ? tm[obj] : obj;
  if (Array.isArray(obj)) return obj.map(x => translateObj(x, tm));
  if (obj && typeof obj === 'object') { const o = {}; for (const k of Object.keys(obj)) o[k] = translateObj(obj[k], tm); return o; }
  return obj;
}

function dictJs(keys, tm, title) {
  const d = {};
  // Ключи нормализуем так же, как рантайм ищет: без краёв и без отступов
  // многострочных литералов (иначе строка с переносом и отступом из данных
  // урока не найдётся — t() обрезает края и схлопывает такие отступы).
  const normKey = k => k.replace(/\n[ \t]+/g, ' ').trim();
  for (const k of keys) if (tm[k] !== undefined && (tm[k] !== k || k.includes('{s}'))) d[normKey(k)] = tm[k];
  return `/* ${title} — сгенерировано tools/i18n.js build, руками не править */\nI18N.add(${JSON.stringify(d)});\n`;
}

function cmdBuild(lang = 'uk') {
  const { groups } = extract();
  const { tm, files } = loadTM(lang);
  const out = `i18n/${lang}`;
  // UI: интерфейс + ручные шаблоны из src/ui.json (ключи с {n} и т.п.)
  const uiKeys = uniq([...groups.ui, ...Object.keys(files.ui || {})]);
  fs.mkdirSync(rel(out + '/lessons'), { recursive: true });
  fs.writeFileSync(rel(out + '/ui.js'), dictJs(uiKeys, tm, 'Интерфейс'));
  fs.writeFileSync(rel(out + '/lexicon.js'), dictJs(groups.lexicon, tm, 'Подсказки над словами'));
  for (const id of lessonIds()) {
    fs.writeFileSync(rel(`${out}/lessons/${id}.js`), dictJs(groups['lessons/' + id], tm, 'Урок ' + id));
  }
  writeJson(`${out}/books/index.json`, translateObj(JSON.parse(read('data/books/index.json')), tm));
  for (const id of bookIds()) for (const f of bookFiles(id)) {
    const dst = f.replace(/^data\/books\//, `${out}/books/`);
    fs.mkdirSync(path.dirname(rel(dst)), { recursive: true });
    // компактно: книги большие
    fs.writeFileSync(rel(dst), JSON.stringify(translateObj(JSON.parse(read(f)), tm)));
  }
  console.log('build: ok →', out);
}

function cmdCheck(lang = 'uk') {
  const { groups } = extract();
  const { tm } = loadTM(lang);
  let missing = 0;
  for (const [g, keys] of Object.entries(groups)) {
    const m = keys.filter(k => tm[k] === undefined);
    missing += m.length;
    console.log(`${m.length ? '✗' : '✓'} ${g.padEnd(20)} ${keys.length - m.length}/${keys.length}`);
  }
  console.log(missing ? `НЕ ПЕРЕВЕДЕНО строк: ${missing}` : 'Все строки переведены');
  // рантайм-файлы должны быть собраны из текущих переводов
  process.exitCode = missing ? 1 : 0;
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'extract') {
  const { groups, tplKeys } = extract();
  writeJson('i18n/keys.json', Object.fromEntries(Object.entries(groups).map(([g, k]) => [g, k.length])));
  let chars = 0;
  for (const [g, k] of Object.entries(groups)) { const c = k.join('').length; chars += c; console.log(g.padEnd(20), String(k.length).padStart(6), 'строк', String(c).padStart(8), 'симв'); }
  console.log('ИТОГО символов', chars);
  if (args[0] === '--tpl') console.log(tplKeys.join('\n'));
} else if (cmd === 'todos') {
  // пакет: несколько групп разом, секции «### группа»
  for (const g of args) { process.stdout.write('### ' + g + '\n'); cmdTodo(g); }
} else if (cmd === 'merge-multi') {
  // файл с секциями «### группа» → merge по каждой
  const text = fs.readFileSync(path.resolve(args[0]), 'utf8').replace(/\r/g, '');
  const parts = text.split(/^### (.+)\n/m);
  const tmp = path.join(require('os').tmpdir(), 'i18n-part.txt');
  for (let i = 1; i < parts.length; i += 2) {
    fs.writeFileSync(tmp, parts[i + 1]);
    cmdMerge(parts[i].trim(), tmp, 'uk', true);
  }
} else if (cmd === 'todo') cmdTodo(args[0], args[1] || 'uk', args[2] ? +args[2] : Infinity);
else if (cmd === 'merge') cmdMerge(args[0], args[1], args[2] || 'uk');
else if (cmd === 'build') cmdBuild(args[0] || 'uk');
else if (cmd === 'check') cmdCheck(args[0] || 'uk');
else { console.log('команды: extract | todo <group> | merge <group> <file> | build | check'); }

module.exports = { jsStrings, fragments, htmlStrings, extract };
