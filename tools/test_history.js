/* History pilot: source integrity, unpublished chapters, navigation and motion. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const catalog = JSON.parse(read('data/history/index.json'));
const published = catalog.chapters.filter(ch => ch.ready);
assert.equal(catalog.chapters.length, 14);
assert.equal(published.length, 1);
assert.equal(new Set(catalog.chapters.map(ch => ch.id)).size, catalog.chapters.length);
assert.deepEqual(catalog.items.map(ch => ch.id), published.map(ch => ch.id));
for (const ch of catalog.chapters) {
  assert.match(ch.id, /^[a-z0-9-]+$/);
  if (!ch.ready) assert.equal(fs.existsSync(path.join(root, 'data/history', ch.id)), false);
}
for (const item of published) {
  const ch = JSON.parse(read(`data/history/${item.id}/ch-01.json`));
  const sources = new Set(ch.sources.map(s => s.id));
  assert.equal(sources.size, ch.sources.length);
  ch.sources.forEach(s => assert.match(s.url, /^https:\/\//));
  for (const para of ch.paragraphs) {
    if (para.s) {
      assert.ok(para.sourceIds.length && para.sourceIds.every(id => sources.has(id)));
      para.s.forEach(s => assert.ok(s.de.trim() && s.ru.trim()));
    }
    if (para.fig) {
      assert.ok(fs.existsSync(path.join(root, para.fig.src)));
      if (para.fig.motion) assert.ok(fs.existsSync(path.join(root, para.fig.motion)));
      if (para.fig.src.endsWith('.jpg')) assert.ok(para.fig.creditUrl && para.fig.licenseUrl);
    }
  }
}

async function boot({ hash = '', reduce = false, hidden = false, fail = false } = {}) {
  const docEvents = {}, winEvents = {}, calls = [], timers = new Map();
  const elements = Object.fromEntries(['hiToc', 'hiCount', 'hiSources', 'rdContent', 'rdViewport', 'hiRetry', 'hiErrorTemplate']
    .map(id => [id, { innerHTML: '', textContent: '', setAttribute() {}, addEventListener() {},
      replaceChildren() {}, querySelectorAll() { return []; }, content: { cloneNode() { return {}; } } }]));
  const ctx = {
    console, Set, Number, String, JSON, Promise,
    document: { hidden, getElementById: id => elements[id], addEventListener: (name, fn) => { docEvents[name] = fn; } },
    location: { hash, pathname: '/history.html', search: '' },
    history: { state: null, replaceState(state, _, url) { this.state = state; ctx.location.hash = url.includes('#') ? '#' + url.split('#')[1] : ''; } },
    localStorage: { getItem: () => null },
    Reader: { state: { open: false, bookId: 'romer-und-germanen' }, open(id, options) { calls.push({ id, options }); this.state.open = true; this.state.bookId = id; } },
    fetch: async () => { if (fail) throw new Error('offline'); return { ok: true, json: async () => catalog }; },
    setTimeout(fn) { const id = timers.size + 1; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); },
    matchMedia: () => ({ matches: reduce, addEventListener() {} }),
    addEventListener: (name, fn) => { winEvents[name] = fn; },
    IntersectionObserver: class { constructor(fn) { ctx.intersect = fn; } observe() {} disconnect() {} },
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(read('js/history.js'), ctx);
  docEvents.DOMContentLoaded();
  await new Promise(resolve => setImmediate(resolve));
  return { ctx, calls, elements, docEvents, winEvents, timers };
}

(async () => {
  const normal = await boot();
  assert.equal((normal.elements.hiToc.innerHTML.match(/aria-disabled="true"/g) || []).length, 13);
  assert.equal((normal.elements.hiToc.innerHTML.match(/<a /g) || []).length, 1);
  const click = id => ({ target: { closest: selector => selector === '[data-history-open]' ? { dataset: { historyOpen: id } } : null }, button: 0, preventDefault() {} });
  normal.docEvents.click(click('frankenreich'));
  assert.equal(normal.calls.length, 0, 'Unpublished chapter must never load');
  normal.docEvents.click(click('romer-und-germanen'));
  assert.equal(normal.calls[0].id, 'romer-und-germanen');
  const deep = await boot({ hash: '#history=romer-und-germanen' });
  assert.equal(deep.calls.length, 1, 'Published deep link opens');
  const blocked = await boot({ hash: '#history=frankenreich' });
  assert.equal(blocked.calls.length, 0, 'Unpublished deep link stays in catalog');
  deep.ctx.Reader.state.open = false;
  deep.ctx.location.hash = '#history=romer-und-germanen';
  deep.winEvents.popstate();
  assert.equal(deep.calls.at(-1).options.fromHistory, true, 'Forward restores without adding browser history');
  function image() { return { src: 'still.svg', isConnected: true, dataset: { still: 'still.svg', motion: 'motion.svg' }, addEventListener() {}, removeEventListener() {} }; }
  const img = image();
  normal.elements.rdContent.querySelectorAll = () => [img];
  normal.docEvents['dm:reader-render']();
  normal.ctx.intersect([{ target: img, isIntersecting: true, intersectionRatio: 0.3 }]);
  assert.equal(img.src, 'still.svg', 'Offscreen art stays still');
  normal.ctx.intersect([{ target: img, isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(img.src, 'motion.svg', 'Visible art autoplays');
  for (const fn of normal.timers.values()) fn();
  assert.equal(img.src, 'motion.svg', 'One-shot SVG retains its final frame');
  img.src = 'still.svg';
  normal.ctx.intersect([{ target: img, isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(img.src, 'still.svg', 'Already seen art does not replay');
  const quiet = await boot({ reduce: true });
  const quietImg = image();
  quiet.elements.rdContent.querySelectorAll = () => [quietImg];
  quiet.docEvents['dm:reader-render']();
  assert.equal(quiet.ctx.intersect, undefined, 'Reduced motion never schedules animation');
  assert.equal(quietImg.src, 'still.svg');
  const inactive = await boot({ hidden: true });
  const inactiveImg = image();
  inactive.elements.rdContent.querySelectorAll = () => [inactiveImg];
  inactive.docEvents['dm:reader-render']();
  inactive.ctx.intersect([{ target: inactiveImg, isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(inactiveImg.src, 'still.svg', 'Background tabs do not animate');
  inactive.ctx.document.hidden = false;
  inactive.docEvents.visibilitychange();
  inactive.ctx.intersect([{ target: inactiveImg, isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(inactiveImg.src, 'motion.svg', 'Art starts when tab becomes visible');
  console.log('PASS history: sources, catalog, disabled chapters, links, history, autoplay and reduced motion');
})().catch(err => { console.error(err); process.exitCode = 1; });
