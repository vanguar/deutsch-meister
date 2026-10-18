#!/usr/bin/env node
/* ═══════════════════════════════════════════════
   tools/vocab/build.js — словарь курса для вкладки «Словарь» (index.html)

   Собирает слова всех 68 уроков (LESSON_DATA.vocabulary из data/<lv>/)
   в один файл data/vocab/index.json: немецкое слово, артикль, IPA,
   русский перевод и урок, где слово встретилось впервые. Повторы
   убираются — слово остаётся в самом раннем уроке.

   Переведённые копии (i18n/uk/vocab/index.json, i18n/ar/vocab/index.json)
   собираются из той же памяти переводов, что и уроки (i18n/<lang>/src):
   отдельно словарь не переводится. js/i18n.js подменяет data/vocab/ на
   i18n/<lang>/vocab/ так же, как книги, новости и диалоги.

     node tools/vocab/build.js          — собрать
     node tools/vocab/build.js --check  — проверить, что файлы свежие
                                          и всё переведено (exit 1, если нет)
   ═══════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const rel = p => path.join(ROOT, p);
const LEVELS = ['a1', 'a2', 'b1', 'b2'];
const LANGS = ['uk', 'ar'];
const ARTICLE_RE = /^(der|die|das)\s+(?=[A-ZÄÖÜ])/;

function lessonData(lv, file) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(rel(`data/${lv}/${file}`), 'utf8') + '\n;this.__D = LESSON_DATA;', ctx);
  return ctx.__D;
}

function collect() {
  const seen = new Set();
  const items = [];
  for (const lv of LEVELS) {
    const files = fs.readdirSync(rel('data/' + lv)).filter(f => /^(a1|a2|b1|b2)-lesson-\d+\.js$/.test(f)).sort();
    for (const f of files) {
      const D = lessonData(lv, f);
      for (const w of D.vocabulary || []) {
        const de = String(w.de || '').trim();
        if (!de) continue;
        const key = de.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const m = de.match(ARTICLE_RE);
        const art = w.article || (m ? m[1] : '');
        const word = m && m[1] === art ? de.slice(m[0].length) : de;
        items.push({ de, w: word, a: art, ipa: w.ipa || '', ru: String(w.ru || '').trim(), l: D.id });
      }
    }
  }
  return items;
}

// память переводов: все src/*.json, кроме перекрытий ридера (как в tools/i18n.js)
function loadTM(lang) {
  const tm = Object.create(null);
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f !== 'overrides') walk(p); }
      else if (f.endsWith('.json')) Object.assign(tm, JSON.parse(fs.readFileSync(p, 'utf8')));
    }
  })(rel(`i18n/${lang}/src`));
  return tm;
}

const json = o => JSON.stringify(o) + '\n';

function build() {
  const items = collect();
  const out = { 'data/vocab/index.json': json({ count: items.length, items }) };
  const missing = {};
  for (const lang of LANGS) {
    const tm = loadTM(lang);
    missing[lang] = [];
    const tr = items.map(it => {
      const t = tm[it.ru];
      if (t === undefined) { missing[lang].push(it.ru); return it; }
      return Object.assign({}, it, { ru: t });
    });
    out[`i18n/${lang}/vocab/index.json`] = json({ count: tr.length, items: tr });
  }
  return { out, items, missing };
}

const check = process.argv.includes('--check');
const { out, items, missing } = build();
let bad = 0;
for (const [file, text] of Object.entries(out)) {
  if (check) {
    const cur = fs.existsSync(rel(file)) ? fs.readFileSync(rel(file), 'utf8').replace(/\r\n/g, '\n') : null;
    if (cur !== text) { console.log('✗ устарел ' + file + ' — запусти node tools/vocab/build.js'); bad++; }
  } else {
    fs.mkdirSync(path.dirname(rel(file)), { recursive: true });
    fs.writeFileSync(rel(file), text);
  }
}
for (const lang of LANGS) {
  if (missing[lang].length) { console.log(`✗ ${lang}: нет перевода у ${missing[lang].length}: ${missing[lang].slice(0, 8).join(' | ')}`); bad++; }
}
const by = LEVELS.map(lv => lv + ': ' + items.filter(i => i.l.startsWith(lv)).length).join(', ');
console.log(`${check ? 'check' : 'build'}: ${items.length} слов (${by})${bad ? '' : ' — ok'}`);
process.exitCode = bad ? 1 : 0;
