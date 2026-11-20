'use strict';
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const workerSource = fs.readFileSync(require('node:path').join(__dirname, '../service-worker.js'), 'utf8');
class Cache {
  constructor() { this.entries = new Map(); }
  url(req) { return new URL(typeof req === 'string' ? req : req.url, 'https://test/deutsch-meister/').href; }
  async put(req, res) { this.entries.set(this.url(req), res.clone()); }
  async match(req, options = {}) {
    const url = this.url(req);
    for (const [key, val] of this.entries) if (key === url || (options.ignoreSearch && key.split('?')[0] === url.split('?')[0])) return val.clone();
  }
  async keys() { return [...this.entries.keys()].map(url => ({ url })); }
  async delete(url) { return this.entries.delete(this.url(url)); }
  async add(url) { await this.put(url, await network(url)); }
}
const buckets = new Map(), events = {};
const caches = {
  async keys() { return [...buckets.keys()]; },
  async open(key) { if (!buckets.has(key)) buckets.set(key, new Cache()); return buckets.get(key); },
  async match(url, { cacheName }) { return buckets.get(cacheName)?.match(url); },
  async delete(key) { return buckets.delete(key); }
};
let offline = false, bad = null;
const fetched = [];
const scope = 'https://test/deutsch-meister/';
async function network(req, options = {}) {
  const url = typeof req === 'string' ? req : req.url;
  fetched.push({ url, cache: options.cache || req.cache });
  if (offline) throw Error('offline');
  return new Response(url.endsWith('.css') ? '.x{background:url(icon.svg)}' : url, { status: url === bad ? 404 : 200 });
}
const context = vm.createContext({ URL, Response, Request, AbortController, setTimeout, clearTimeout, console, caches,
  self: { registration: { scope }, location: { origin: 'https://test' }, clients: { claim: async () => {} }, skipWaiting() {}, addEventListener: (name, fn) => { events[name] = fn; } },
  fetch: network
});
vm.runInContext(workerSource, context);
async function send(data) {
  let result, promise;
  events.message({ data, ports: [{ postMessage: r => { if (!r.progress) result = r; } }], waitUntil: p => { promise = p; } });
  await promise;
  return result;
}
async function load(path, mode = 'cors') {
  let promise;
  const jobs = [];
  events.fetch({ request: { url: scope + path, method: 'GET', mode, headers: new Headers() },
    respondWith: p => { promise = p; }, waitUntil: p => { jobs.push(p); } });
  const response = await promise;
  await Promise.all(jobs);
  return response;
}
(async () => {
  await (await caches.open('unrelated-app-v1')).put('https://test/other/app.js', new Response('other'));
  await (await caches.open('deutsch-meister-v1')).put(scope + 'data/books/bremer/ch-01.json', new Response('{"saved":true}'));
  let activation;
  events.activate({ waitUntil: p => { activation = p; } }); await activation;
  assert(buckets.has('unrelated-app-v1'), 'activation must not clear another app');
  offline = true;
  assert.equal(await (await load('data/books/bremer/ch-01.json')).text(), '{"saved":true}');
  const missing = await load('missing.js');
  assert.equal(missing.status, 503); assert(missing.headers.get('content-type').startsWith('text/plain'));
  assert.match(await (await load('lessons/a1/lesson-20/index.html', 'navigate')).text(), /Материал не скачан/);
  offline = false;
  const pack = { id: 'book:bremer:ru', title: 'Bremer', page: scope + 'books.html', href: scope + 'books.html#book=bremer' };
  const urls = [pack.page, scope + 'js/reader.js?v=1', scope + 'data/books/bremer/ch-01.json'];
  assert.equal((await send({ type: 'OFFLINE_SAVE', pack, urls })).result, true);
  assert.equal((await send({ type: 'OFFLINE_LIST' })).result.length, 1);
  assert(!fetched.some(({ url }) => /kafka/.test(url)), 'another book must not download');
  bad = scope + 'missing.json';
  assert((await send({ type: 'OFFLINE_SAVE', pack: { ...pack, id: 'bad' }, urls: [...urls, bad] })).error);
  assert.equal((await send({ type: 'OFFLINE_LIST' })).result.length, 1, 'partial pack must not advertise success');
  assert((await send({ type: 'OFFLINE_SAVE', pack, urls: [...urls, 'https://other/private'] })).error);
  events.activate({ waitUntil: p => { activation = p; } }); await activation;
  assert.equal((await send({ type: 'OFFLINE_LIST' })).result.length, 1, 'download survives activation');
  offline = true;
  assert.equal((await load('books.html?lang=ru', 'navigate')).status, 200);
  assert.equal((await load('js/reader.js?v=2')).status, 200, 'downloaded asset remains usable after version change');
  await send({ type: 'OFFLINE_REMOVE', id: pack.id });
  assert.equal((await send({ type: 'OFFLINE_LIST' })).result.length, 0);

  offline = false;
  const lessonPath = 'lessons/b2/lesson-04/index.html';
  const lesson = { id: 'lesson:b2-04:ru', title: 'B2-04', page: scope + lessonPath, href: scope + lessonPath };
  const ttsVersion = Number(workerSource.match(/\/js\/tts\.js\?v=(\d+)/)[1]);
  const oldTts = `js/tts.js?v=${ttsVersion - 1}`;
  const currentTts = `js/tts.js?v=${ttsVersion}`;
  const nextTts = `js/tts.js?v=${ttsVersion + 1}`;
  assert.equal((await send({ type: 'OFFLINE_SAVE', pack: lesson, urls: [lesson.page, scope + oldTts] })).result, true);
  await load(oldTts); // Also keep an exact old response in the normal browsing cache.
  await load(nextTts);
  await load(lessonPath, 'navigate');
  assert.equal(fetched.at(-1).cache, 'no-cache', 'online reopen revalidates stale HTML');
  let installation;
  events.install({ waitUntil: p => { installation = p; } }); await installation;
  assert(fetched.some(({ url, cache }) => url === scope + currentTts && cache === 'reload'), 'new precache bypasses browser HTTP cache');
  const requestCount = fetched.length;
  assert.equal(await (await load(oldTts)).text(), scope + currentTts);
  assert.equal(fetched.length, requestCount, 'retired URL cannot be satisfied by a stale browser HTTP cache');
  offline = true;
  assert.equal(await (await load(oldTts)).text(), scope + currentTts, 'old saved page gets updated shared code even with an exact stale cache hit');
  for (const preview of ['data/course/previews.json', 'i18n/uk/course/previews.json', 'i18n/ar/course/previews.json']) {
    assert.equal(await (await load(preview)).text(), scope + preview, 'preview stays available offline: ' + preview);
  }
  assert.equal(await (await load(nextTts)).text(), scope + nextTts, 'worker must respect an exact newer asset');
  const shell = buckets.get(workerSource.match(/const CACHE = '([^']+)'/)[1]);
  await shell.delete(scope + currentTts);
  assert.equal(await (await load(oldTts)).text(), scope + oldTts, 'failed precache still permits opening the saved material');
  assert.equal((await send({ type: 'OFFLINE_LIST' })).result[0].id, lesson.id);
  assert(buckets.has('unrelated-app-v1'));
  console.log('PASS selective offline packs, failure cleanup, scope isolation, upgrade retention, honest fallbacks');
})().catch(e => { console.error(e); process.exitCode = 1; });
