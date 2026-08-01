/* tools/check_tips.js
   Проверяет, что у КАЖДОГО слова с подсказкой (word-has-tip) есть перевод
   (span.word-tip-ru). Прогоняет data-файл каждого урока + js/lesson-render.js
   в изолированном vm-контексте и рендерит подсказку для каждого слова фраз.

   Использование:
     node tools/check_tips.js            # проверить все уроки
     node tools/check_tips.js data/a2/a2-lesson-13.js   # один файл
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const RENDER_SRC = fs.readFileSync(path.join(ROOT, 'js', 'lesson-render.js'), 'utf8');

function domStub() {
  const el = {
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    dataset: {}, style: {}, setAttribute() {}, getAttribute() { return null; },
    appendChild() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    closest() { return null; }, replaceWith() {}, removeAttribute() {},
    addEventListener() {}, textContent: '', innerHTML: ''
  };
  const doc = {
    documentElement: el, body: el,
    getElementById() { return null; }, querySelector() { return null; },
    querySelectorAll() { return []; }, createElement() { return el; },
    createComment() { return el; }, addEventListener() {}
  };
  return {
    document: doc,
    window: { visualViewport: null, innerWidth: 400, innerHeight: 800, addEventListener() {} },
    localStorage: { getItem() { return null; }, setItem() {} },
    console, JSON, Math, Object, Array, String, Number, Boolean, RegExp, Map, Set,
    setTimeout() {}, clearTimeout() {}
  };
}

// извлекает список немецких слов из фразы тем же токенайзером, что и рендер
function wordsOf(str) {
  return String(str || '').match(/[A-Za-zÄäÖöÜüßÉé]+/g) || [];
}

function checkLesson(dataFile) {
  const dataSrc = fs.readFileSync(dataFile, 'utf8');
  const ctx = vm.createContext(domStub());
  const probe = `
    ;(function () {
      globalThis.__probe = function (word) {
        return LessonRender.wordHtml(word, {});
      };
      globalThis.__phrases = (typeof LESSON_DATA !== 'undefined' && LESSON_DATA.phrases) || [];
      globalThis.__id = (typeof LESSON_DATA !== 'undefined' && LESSON_DATA.id) || '?';
    })();
  `;
  vm.runInContext(dataSrc + '\n' + RENDER_SRC + '\n' + probe, ctx, { filename: dataFile });

  const phrases = ctx.__phrases;
  const seen = new Set();
  const noTip = new Set();       // слово вообще без подсказки
  const tipNoRu = new Set();     // подсказка есть, но перевод пустой / не на русском
  const RU_RE = /[А-Яа-яЁё]/;
  const reRu = /<span class="word-tip-ru">([\s\S]*?)<\/span>/;
  for (const p of phrases) {
    for (const w of wordsOf(p.de)) {
      const key = w.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const html = ctx.__probe(w) || '';
      const hasTip = html.includes('word-has-tip');
      if (!hasTip) { noTip.add(w); continue; }
      const m = html.match(reRu);
      const ru = m ? m[1].trim() : '';
      // перевод обязан присутствовать и содержать кириллицу
      if (!ru || !RU_RE.test(ru)) tipNoRu.add(`${w}${ru ? ` [«${ru}»]` : ''}`);
    }
  }
  return { id: ctx.__id, noTip: [...noTip], tipNoRu: [...tipNoRu] };
}

function collectFiles(args) {
  if (args.length) return args.map(a => path.resolve(a));
  const files = [];
  for (const lvl of ['a1', 'a2', 'b1', 'b2']) {
    const dir = path.join(ROOT, 'data', lvl);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
      files.push(path.join(dir, f));
    }
  }
  return files;
}

function main() {
  const files = collectFiles(process.argv.slice(2));
  let totalNoTip = 0, totalTipNoRu = 0;
  const report = [];
  for (const f of files) {
    let res;
    try {
      res = checkLesson(f);
    } catch (e) {
      console.error(`ERROR loading ${f}: ${e.message}`);
      process.exitCode = 1;
      continue;
    }
    totalNoTip += res.noTip.length;
    totalTipNoRu += res.tipNoRu.length;
    if (res.noTip.length || res.tipNoRu.length) {
      report.push({ file: path.relative(ROOT, f), ...res });
    }
  }
  for (const r of report) {
    console.log(`\n${r.file}  (${r.id})`);
    if (r.tipNoRu.length) console.log(`  ПОДСКАЗКА БЕЗ ПЕРЕВОДА (${r.tipNoRu.length}): ${r.tipNoRu.join(', ')}`);
    if (r.noTip.length)   console.log(`  БЕЗ ПОДСКАЗКИ        (${r.noTip.length}): ${r.noTip.join(', ')}`);
  }
  console.log(`\n=== ИТОГО: подсказок без перевода: ${totalTipNoRu}; слов без подсказки: ${totalNoTip} ===`);
  // Тест регресса: падаем, если есть подсказки без перевода
  if (totalTipNoRu > 0) process.exitCode = 2;
}

main();
