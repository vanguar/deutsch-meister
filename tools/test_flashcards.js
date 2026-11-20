'use strict';
// Exercise the real engine across page reloads, including pre-fix saved sessions.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/flashcards.js'), 'utf8');
class Element {
  constructor() { this.children = []; this.style = {}; this.className = ''; this.listeners = {}; this.textContent = ''; }
  get classList() { return {
    contains: c => this.className.split(' ').includes(c),
    add: c => { if (!this.classList.contains(c)) this.className += ' ' + c; },
    remove: c => { this.className = this.className.split(' ').filter(x => x !== c).join(' '); },
    toggle: (c, yes) => yes ? this.classList.add(c) : this.classList.remove(c)
  }; }
  appendChild(el) { this.children.push(el); el.parentElement = this; return el; }
  before(el) { this.parentElement.appendChild(el); }
  remove() { this.parentElement.children = this.parentElement.children.filter(el => el !== this); }
  set innerHTML(_) { this.children = []; }
  querySelectorAll() { return []; }
  querySelector(sel) { return this.children.find(c => sel === '.' + c.className) || null; }
  closest() { return this.section; }
  setAttribute(k, v) { this[k] = v; }
  addEventListener(k, fn) { this.listeners[k] = fn; }
  removeEventListener(k) { delete this.listeners[k]; }
  getClientRects() { return [1]; }
  focus() { this.focused = true; }
}
const vocabulary = ['eins', 'zwei', 'drei', 'vier'].map(de => ({ de, ru: de, ipa: '' }));
function boot(store = {}, words = vocabulary) {
  const ids = Object.fromEntries(['flashcard','cardDE','cardRU','cardIPA','cardActions','cardCounter','cardDots','lessonComplete'].map(k => [k, new Element()]));
  const section = new Element(), viewport = section.appendChild(new Element());
  viewport.appendChild(ids.flashcard); ids.flashcard.section = section;
  const back = ids.flashcard.appendChild(new Element()); back.appendChild(ids.cardRU);
  section.appendChild(ids.cardActions);
  const awards = [], completions = [], speaks = [];
  const document = { getElementById: id => ids[id], querySelector: () => null,
    createElement: () => new Element(), addEventListener() {}, removeEventListener() {} };
  const ctx = vm.createContext({ document, window: {}, console, LESSON_DATA: { id: 'test', vocabulary: words },
    localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; } },
    TTS: { speak: (...args) => speaks.push(args) },
    Progress: {
      addXP: (...args) => awards.push(args),
      markSectionDone: (...args) => { completions.push(args); store['dm_sections:test'] = JSON.stringify([args[0]]); },
      getCompletionStatus: () => ({ done: JSON.parse(store['dm_sections:test'] || '[]') })
    }
  });
  vm.runInContext(source + '\nthis.F = Flashcards;', ctx);
  ctx.F.init();
  const rate = again => { ctx.F.flip(); again ? ctx.F.handleAgain() : ctx.F.handleGood(); };
  const dots = () => ids.cardDots.children.map(d => d.className.trim());
  return { F: ctx.F, ids, store, rate, dots, awards, completions, speaks };
}
let app = boot();
assert.equal(app.ids.cardActions.style.display, 'flex');
assert.equal(app.ids.cardActions.style.visibility, 'hidden');
app.rate(true); app.rate(false);
const before = app.dots();
app = boot(app.store);
assert.deepEqual(app.dots(), before, 'reload preserves every dot and the current position');
assert.equal(app.ids.cardCounter.textContent, 'Карточка 3 из 4');
app.rate(false); app.rate(false);
assert.equal(app.ids.cardCounter.textContent, 'Карточка 1 из 1');
assert.equal(app.dots().length, 4, 'repeat round keeps all original dots');
assert(app.dots()[0].includes('again current'));
app = boot(app.store);
assert.equal(app.dots().length, 4, 'reload during repeat keeps all dots');
app.rate(false);
assert.equal(app.completions[0][1], 75, 'score remembers the first-pass mistake');
assert(app.dots().every(d => d === 'fc-dot done'));
assert.equal(app.ids.cardCounter.textContent, 'Все карточки повторены');
app = boot(app.store);
assert.equal(app.ids.flashcard.style.display, 'none');
assert.equal(app.ids.cardCounter.textContent, 'Все карточки повторены');
assert.equal(app.awards.length, 0, 'completed reload never grants XP again');
assert.equal(app.completions.length, 0);
const recovered = boot({ ...app.store, 'dm_sections:test': '[]' });
assert.deepEqual(recovered.completions, [['flashcards', 75]], 'a saved completed deck restores a missing section result');
app.ids.lessonComplete.children.find(el => el.className.includes('flashcard-restart')).listeners.click();
assert.equal(app.ids.cardCounter.textContent, 'Карточка 1 из 4', 'completed cards can be deliberately reviewed again');
assert.equal(app.ids.flashcard.style.display, '');
assert.equal(app.ids.flashcard.focused, true);

const legacy = { signature: JSON.stringify(vocabulary), deck: [0,1,2,3], again: [0], current: 2, missed: [0], done: false };
app = boot({ 'dm_cards:test': JSON.stringify(legacy) });
assert.deepEqual(app.dots(), ['fc-dot again', 'fc-dot done', 'fc-dot current', 'fc-dot']);
app = boot(app.store, vocabulary.map(w => ({ ...w, ru: 'new explanation' })));
assert.equal(app.ids.cardCounter.textContent, 'Карточка 3 из 4', 'content clarifications do not reset progress');
app = boot({ 'dm_cards:test': JSON.stringify({ ...legacy, deck: [0], again: [], current: 0 }) });
assert.deepEqual(app.dots(), ['fc-dot again current', 'fc-dot done', 'fc-dot done', 'fc-dot done']);
for (const bad of ['{', JSON.stringify({ ...legacy, deck: [999] }), JSON.stringify({ ...legacy, deck: [0,0] })]) {
  app = boot({ 'dm_cards:test': bad });
  assert.equal(app.ids.cardCounter.textContent, 'Карточка 1 из 4');
}

app = boot();
let result;
app.F.init({ cards: vocabulary.slice(0,2), onDone: r => { result = r; } });
app.rate(true); app.rate(false); app.rate(false);
assert.equal(result.known.length, 2, 'reader/custom mode still requeues and completes');
assert.equal(result.repeat.length, 0);
assert.equal(app.awards.length, 0, 'custom mode does not award lesson XP');
app.F.init({ cards: vocabulary.slice(0,1), onDone() {} });
assert.equal(app.ids.flashcard.style.display, '', 'custom deck can reopen after completion');
app.F.destroy(); app.F.flip();
console.log('PASS flashcard reload, legacy migration, repeat dots, completion, score and reader lifecycle');
