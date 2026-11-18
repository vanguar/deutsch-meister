'use strict';
// Regressions for work on the click/navigation path, without timing the CPU.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = process.argv[2] || path.join(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'service-worker.js'), 'utf8');
const scope = 'https://test/deutsch-meister/';
const shellName = source.match(/const CACHE = '([^']+)'/)[1];
const version = source.match(/\/js\/tts\.js\?v=(\d+)/)[1];
const deferred = () => {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
};
async function settles(promise) {
  const pending = Symbol('pending');
  let timer;
  try { return await Promise.race([promise, new Promise(r => { timer = setTimeout(() => r(pending), 100); })]) !== pending; }
  finally { clearTimeout(timer); }
}
function worker() {
  const events = {}, buckets = new Map(), requests = [];
  let putGate = null;
  class Cache {
    constructor() { this.entries = new Map(); }
    key(req) { return new URL(typeof req === 'string' ? req : req.url, scope).href; }
    async match(req, options = {}) {
      const url = this.key(req);
      for (const [key, res] of this.entries) {
        if (key === url || options.ignoreSearch && key.split('?')[0] === url.split('?')[0]) return res.clone();
      }
    }
    async put(req, res) { if (putGate) await putGate.promise; this.entries.set(this.key(req), res.clone()); }
    async keys() { return [...this.entries.keys()].map(url => ({ url })); }
    async delete(req) { return this.entries.delete(this.key(req)); }
  }
  const caches = {
    async open(name) { if (!buckets.has(name)) buckets.set(name, new Cache()); return buckets.get(name); },
    async keys() { return [...buckets.keys()]; },
    async match(req, { cacheName }) { return buckets.get(cacheName)?.match(req); },
    async delete(name) { return buckets.delete(name); }
  };
  const context = vm.createContext({ URL, Response, Request, AbortController, setTimeout, clearTimeout, console, caches,
    self: { registration: { scope }, location: { origin: 'https://test' }, addEventListener: (name, fn) => { events[name] = fn; } },
    fetch: async (req, options = {}) => {
      requests.push({ url: req.url, ...options });
      return new Response('fresh');
    }
  });
  vm.runInContext(source, context);
  return {
    caches, requests,
    blockWrites() { return putGate = deferred(); },
    load(file, mode = 'cors') {
      const jobs = [];
      let response;
      events.fetch({ request: { url: scope + file, method: 'GET', mode },
        respondWith(p) { response = p; }, waitUntil(p) { jobs.push(p); } });
      return { response, flush: () => Promise.all(jobs) };
    }
  };
}
const tests = [
  ['online responses do not wait for cache writes or pruning', async () => {
    const w = worker(), gate = w.blockWrites();
    const load = w.load('data/news/index.json');
    const immediate = await settles(load.response);
    gate.resolve();
    assert.equal(await (await load.response).text(), 'fresh');
    await load.flush();
    assert(immediate, 'response was held until a cache write finished');
  }],
  ['catalogs and HTML still revalidate; newer assets never use an older version', async () => {
    const w = worker();
    const cache = await w.caches.open(shellName);
    await cache.put(scope + 'data/news/index.json', new Response('stale'));
    await cache.put(scope + 'js/tts.js?v=' + version, new Response('old'));
    for (const [file, mode] of [['data/news/index.json', 'cors'], ['index.html', 'navigate'], ['js/tts.js?v=' + (+version + 1), 'cors']]) {
      const load = w.load(file, mode);
      assert.equal(await (await load.response).text(), 'fresh');
      await load.flush();
    }
    assert.equal(w.requests.find(req => req.url.endsWith('/index.html')).cache, 'no-cache');
  }],
  ['returning to the same dictionary preserves rows and still imports changed progress', async () => {
    const data = new Map(), listeners = {}, elements = new Map();
    let renders = 0;
    function el(id) {
      if (!elements.has(id)) elements.set(id, { textContent: '', children: [], style: {}, classList: { toggle() {} }, addEventListener() {},
        set innerHTML(value) { this.html = value; this.children = value ? [{}] : []; if (id === 'vocabList') renders++; },
        get innerHTML() { return this.html; }
      });
      return elements.get(id);
    }
    const ctx = vm.createContext({ console, setTimeout, clearTimeout,
      window: { addEventListener(name, fn) { listeners[name] = fn; } },
      document: { getElementById: el, querySelectorAll: () => [], querySelector: () => el('tab') },
      localStorage: { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) },
      fetch: async () => ({ ok: true, json: async () => ({ items: [{ de: 'der Tag', w: 'Tag', a: 'der', ru: 'day', l: 'a1-01' }] }) })
    });
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/vocab.js'), 'utf8') + '\nthis.subject = Vocab;', ctx);
    await ctx.subject.show('a1');
    const first = renders;
    await ctx.subject.show('a1');
    assert.equal(renders, first, 'unchanged rows rebuilt on every tab click');
    data.set('dm_vocab_known', JSON.stringify({ 'der Tag': 1 }));
    await ctx.subject.show('a1');
    assert.equal(renders, first + 1, 'progress from another page must repaint rows');
    assert.match(el('vocabList').innerHTML, /v-item known/);
    data.set('dm_vocab_known', '{}');
    listeners['dm:progress-import']();
    assert.equal(renders, first + 2, 'cloud progress must repaint rows');
    assert.doesNotMatch(el('vocabList').innerHTML, /v-item known/);
  }]
];
(async () => {
  let failed = 0;
  for (const [name, test] of tests) {
    try { await test(); console.log('PASS ' + name); }
    catch (err) { failed++; console.error('FAIL ' + name + ': ' + err.message); }
  }
  process.exitCode = failed ? 1 : 0;
})();
