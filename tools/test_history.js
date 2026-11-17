/* History pilot: source integrity, unpublished chapters and external navigation. */
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
      assert.equal(para.fig.motion, undefined, 'History illustrations must be static');
      if (para.fig.src.endsWith('.jpg')) assert.ok(para.fig.creditUrl && para.fig.licenseUrl);
    }
  }
}

async function boot({ hash = '', telegram = null } = {}) {
  const docEvents = {}, winEvents = {}, calls = [], timers = new Map();
  const elements = Object.fromEntries(['hiToc', 'hiCount', 'hiSources', 'rdContent', 'rdViewport', 'hiRetry', 'hiErrorTemplate']
    .map(id => [id, { innerHTML: '', textContent: '', setAttribute() {}, addEventListener() {},
      replaceChildren() {}, querySelectorAll() { return []; }, content: { cloneNode() { return {}; } } }]));
  const ctx = {
    console: { ...console, warn() {} }, Set, Number, String, JSON, Promise, URL,
    Telegram: telegram,
    document: { getElementById: id => elements[id], addEventListener: (name, fn) => { docEvents[name] = fn; } },
    location: { hash, pathname: '/history.html', search: '' },
    history: { state: null, replaceState(state, _, url) { this.state = state; ctx.location.hash = url.includes('#') ? '#' + url.split('#')[1] : ''; } },
    localStorage: { getItem: () => null },
    Reader: { state: { open: false, bookId: 'romer-und-germanen' }, open(id, options) { calls.push({ id, options }); this.state.open = true; this.state.bookId = id; } },
    fetch: async () => ({ ok: true, json: async () => catalog }),
    setTimeout(fn) { const id = timers.size + 1; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); },
    addEventListener: (name, fn) => { winEvents[name] = fn; },
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
  assert.equal((normal.elements.hiSources.innerHTML.match(/data-reader-external/g) || []).length, catalog.sources.length);
  assert.ok(!normal.elements.hiSources.innerHTML.includes('target="_blank"'), 'Embedded browsers must not depend on pop-up tabs');
  assert.ok(normal.elements.hiSources.innerHTML.includes('↗') && normal.elements.hiSources.innerHTML.includes('PDF'));
  function external(url, extra = {}) {
    return { target: { closest: selector => selector === 'a[data-reader-external]' ? { href: url } : null },
      button: 0, prevented: false, preventDefault() { this.prevented = true; }, ...extra };
  }
  for (const source of catalog.sources) {
    const event = external(source.url);
    normal.docEvents.click(event);
    assert.equal(event.prevented, false, 'Normal browser keeps native same-tab navigation: ' + source.id);
  }
  const opened = [];
  const telegram = await boot({ telegram: { WebApp: { openLink: (url, options) => opened.push({ url, options }) } } });
  const event = external(catalog.sources[0].url);
  telegram.docEvents.click(event);
  assert.equal(event.prevented, true);
  assert.equal(opened[0].url, catalog.sources[0].url);
  assert.equal(opened[0].options.try_instant_view, false);
  const modified = external(catalog.sources[1].url, { ctrlKey: true });
  telegram.docEvents.click(modified);
  assert.equal(modified.prevented, false, 'Modified clicks keep native behavior');
  assert.equal(opened.length, 1);
  const fallback = await boot({ telegram: { WebApp: { openLink() { throw new Error('SDK unavailable'); } } } });
  const failed = external(catalog.sources[2].url);
  fallback.docEvents.click(failed);
  assert.equal(failed.prevented, false, 'SDK failures fall back to working native navigation');
  console.log('PASS history: sources, static photos, disabled chapters, browser links, Telegram links and fallback');
})().catch(err => { console.error(err); process.exitCode = 1; });
