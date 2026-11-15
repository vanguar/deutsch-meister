'use strict';
/* Minimal DOM harness for the real exercise engine; no browser/network needed. */
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
class Element {
  constructor(tag = 'div') { this.tagName = tag; this.children = []; this.dataset = {}; this.style = {}; this.listeners = {}; this.className = ''; this.disabled = false; }
  get classList() { return { contains: c => this.className.split(' ').includes(c), add: c => { if (!this.classList.contains(c)) this.className += ' ' + c; }, remove: c => { this.className = this.className.split(' ').filter(x => x !== c).join(' '); } }; }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  insertBefore(child) { return this.appendChild(child); }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  setAttribute(name, value) { this[name] = value; }
  click() { if (!this.disabled) (this.listeners.click || []).forEach(fn => fn({})); }
  set innerHTML(value) {
    this.html = value; this.children = [];
    if (value.includes('mc-options')) { const options = new Element(); options.className = 'mc-options'; this.appendChild(options); }
    if (value.includes('step-num')) { const num = new Element(); num.className = 'step-num'; this.appendChild(num); }
  }
  get innerHTML() { return this.html || ''; }
  querySelectorAll(selector) {
    const match = el => selector.startsWith('.') ? el.classList.contains(selector.slice(1)) : selector.startsWith('[data-option=') && String(el.dataset.option) === selector.match(/"(.*?)"/)[1];
    return this.children.flatMap(c => [...(match(c) ? [c] : []), ...c.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}
const container = new Element(), banner = new Element(), parent = new Element();
parent.appendChild(container);
const elements = { mcContainer: container, choiceResult: banner };
const completions = [], awards = [];
const store = {};
const ctx = vm.createContext({ console, setTimeout, clearTimeout,
  window: { innerWidth: 390 }, location: { reload() {} },
  document: { createElement: tag => new Element(tag), getElementById: id => elements[id] || null, querySelectorAll: () => [] },
  localStorage: { getItem: k => store[k], setItem: (k,v) => { store[k] = v; }, removeItem: k => { delete store[k]; } },
  LESSON_DATA: { id: 'test-01', exercises: { multipleChoice: Array.from({ length: 8 }, (_, i) => ({ question: 'Question ' + i, options: ['wrong', 'right', 'other', 'last'], correctIndex: 1 })) } },
  Progress: { addXP: (...a) => awards.push(a), markSectionDone: (...a) => completions.push(a), renderLessonProgress() {} }
});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../js/exercises.js'), 'utf8') + '\nExercises.init();', ctx);
for (const q of container.querySelectorAll('.mc-question')) {
  const next = q.querySelector('.step-next-btn');
  assert.equal(next.disabled, true, 'cannot skip an unanswered question');
  q.querySelector('[data-option="0"]').click();
  assert.equal(q.querySelector('[data-option="1"]').classList.contains('correct'), true, 'answer key is still revealed');
  assert.equal(next.disabled, false);
  next.click();
}
assert.match(banner.innerHTML, /Ошибок: 8 из 8\. Верно: 0/);
assert.equal(completions.at(-1)[1], 0);
assert.equal(awards.length, 0);
assert.equal(container.querySelectorAll('.mc-question').filter(q => q.style.display === '').length, 8, 'mistakes remain available for review');
console.log('PASS mobile eight-wrong regression, answer gate, review and no false XP');

// Validate real content: distinct options and legal correctIndex in every lesson.
const path = require('node:path');
let count = 0;
for (const level of ['a1', 'a2', 'b1', 'b2']) {
  const dir = path.join(__dirname, '../data', level);
  for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.js'))) {
    const c = vm.createContext({}); vm.runInContext(fs.readFileSync(path.join(dir,name), 'utf8') + '\nthis.lesson = LESSON_DATA;', c);
    const raw = c.lesson.exercises.multipleChoice;
    for (const q of (Array.isArray(raw) ? raw : raw?.items) || []) {
      const index = q.correctIndex ?? q.answer;
      assert(Number.isInteger(index) && index >= 0 && index < q.options.length, name);
      assert.equal(new Set(q.options.map(s => s.trim().toLowerCase())).size, q.options.length, name + ': duplicate option');
      count++;
    }
  }
}
console.log('PASS ' + count + ' course questions have distinct answers and valid keys');
