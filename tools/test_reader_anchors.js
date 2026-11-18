'use strict';
// Exercise the actual reader's saved positions on pages without prose.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const original = fs.readFileSync(path.join(__dirname, '../js/reader.js'), 'utf8').replace(/\r\n/g, '\n');
// Expose the closure only in this VM; production's public API stays unchanged.
const source = original.replace('    theme: themeName\n', `    theme: themeName,
    anchors: { syncAnchor, anchorEl, pageOfAnchor, savePos, readPos,
      setContent(value) { elContent = value; } }
`);
assert.notEqual(source, original);
const storage = new Map();
const ctx = vm.createContext({
  console, window: {},
  document: { body: { dataset: { readerDir: 'data/history/' } }, documentElement: { dir: '' }, addEventListener() {} },
  localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }
});
vm.runInContext(source + '\nthis.subject = Reader;', ctx);
const { state, anchors } = ctx.subject;
storage.set('dm_reader_prefs', JSON.stringify({ theme: 'sepia' }));
assert.equal(ctx.subject.theme(), 'system', 'History follows the app when a saved reader theme is sepia');
state.prefs = { theme: 'sepia' };
ctx.subject.setPref('theme', 'system');
assert.equal(JSON.parse(storage.get('dm_reader_prefs')).theme, 'sepia', 'Clicking the active history theme preserves the saved preference');
state.prefs = null;
const books = vm.createContext({
  console, window: {}, localStorage: ctx.localStorage,
  document: { ...ctx.document, body: { dataset: { readerDir: 'data/books/' } } }
});
vm.runInContext(original + '\nthis.subject = Reader;', books);
assert.equal(books.subject.theme(), 'sepia', 'Books still honor the saved sepia preference');
storage.set('dm_reader_prefs', JSON.stringify({ theme: 'light' }));
assert.equal(ctx.subject.theme(), 'light', 'History still honors an explicit light theme');
storage.delete('dm_reader_prefs');
Object.assign(state, { bookId: 'test', chapter: { paragraphs: Array(6).fill({}) }, chTotal: 1,
  chIndex: 0, chPages: [4], bookPages: 4, pages: 4, width: 320, gap: 32 });
const json = value => JSON.parse(JSON.stringify(value));
const firstWord = { dataset: { w: '0' }, offsetLeft: 0, getClientRects: () => [{}],
  hasAttribute: () => false, matches: () => false, closest: () => ({ dataset: { p: '0', s: '0' } }) };
const links = [0, 1].map((index) => ({ dataset: { sourceIndex: String(index) },
  offsetLeft: (index + 2) * 352, hasAttribute: name => name === 'data-source-index' }));
const figure = { dataset: { p: '2' }, offsetLeft: 352, hasAttribute: () => false, matches: () => true };
const content = {
  querySelectorAll(selector) { return selector === '.bw' || selector === '.brw' ? [firstWord] : [...links, figure]; },
  querySelector(selector) {
    if (selector.startsWith('.rd-chapter-sources')) {
      const index = /data-source-index="(\d+)"/.exec(selector);
      return index ? links[Number(index[1])] || null : links[0];
    }
    if (selector === '.rd-fig[data-p="2"]') return figure;
    if (selector === '.bw' || selector === '.brw') return firstWord;
    if (selector === '.bs[data-p="0"][data-s="0"]') return { querySelector: () => firstWord };
    return null;
  }
};
anchors.setContent(content);
state.page = 2;
anchors.syncAnchor();
assert.deepEqual(json(state.anchor), { p: 6, s: 0, w: 0 }, 'Source page must not save the first German word');
anchors.savePos();
const saved = anchors.readPos();
assert.equal(saved.p, 6);
assert.equal(anchors.pageOfAnchor(saved), 2, 'Reload and browser Back restore the source page');
state.page = 3;
anchors.syncAnchor();
anchors.savePos();
assert.equal(anchors.readPos().w, 1, 'Each page of source links has a distinct anchor');
state.width = 464; state.gap = 40;
links[1].offsetLeft = 3 * 504;
assert.equal(anchors.pageOfAnchor(anchors.readPos()), 3, 'Source anchor survives a change of viewport');
state.width = 320; state.gap = 32;
links[1].offsetLeft = 3 * 352;
state.fullTranslation = true;
state.page = 2;
anchors.syncAnchor();
assert.deepEqual(json(state.anchor), { p: 6, s: 0, w: 0 }, 'Russian translation also saves sources');
state.page = 1;
anchors.syncAnchor();
assert.deepEqual(json(state.anchor), { p: 2, s: 0, w: 0 });
assert.equal(anchors.pageOfAnchor(state.anchor), 1, 'Photograph-only pages can be restored');
state.fullTranslation = false;
state.page = 0;
anchors.syncAnchor();
assert.deepEqual(json(state.anchor), { p: 0, s: 0, w: 0 }, 'Existing prose anchors still work');
assert.equal(anchors.pageOfAnchor({ p: 0, s: 0, w: 0 }), 0);
assert.equal(anchors.anchorEl({ p: 6, s: 0, w: 100 }), links[0], 'Changed source lists have a safe fallback');
console.log('PASS reader anchors: source pages, storage, viewport changes, translation, photographs and prose');
