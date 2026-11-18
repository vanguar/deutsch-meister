import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import os from 'node:os';

// Runs its own local server. Close anything already listening on port 8765.
// node --experimental-websocket tools/e2e/performance_flow.mjs [project-root] [results.json]
const root = process.argv[2] || fileURLToPath(new URL('../../', import.meta.url));
const output = process.argv[3] || path.join(process.env.SP || os.tmpdir(), 'deutsch-meister-performance.json');
const latency = 180;
const requests = [];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  requests.push(url.pathname);
  const relative = decodeURIComponent(url.pathname).replace(/^\/deutsch-meister\//, '');
  const file = path.resolve(root, !relative || relative.endsWith('/') ? relative + 'index.html' : relative);
  if (!file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  setTimeout(() => {
    try {
      const body = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  }, latency);
});
await new Promise(resolve => server.listen(8765, '127.0.0.1', resolve));
const { start } = await import(pathToFileURL(path.join(root, 'tools/e2e/cdp.mjs')));
const c = await start(9367);
const B = 'http://127.0.0.1:8765/deutsch-meister/';
const result = { latencyMs: latency, cpuSlowdown: 4, scenarios: [], tabs: {}, errors: [] };
const waitFor = async (expr, timeout = 20000) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try { if (await c.ev(expr)) return; } catch {}
    await c.wait(25);
  }
  throw new Error('Timed out: ' + expr);
};
const selectors = {
  'index.html': "document.querySelector('#nowTitle')?.textContent.length > 0 && document.querySelector('#readHistory')",
  'books.html': "document.querySelectorAll('.lib-card').length > 0",
  'news.html': "document.querySelectorAll('#newsRubrics .news-tile').length > 0",
  'history.html': "document.querySelectorAll('#hiToc .hi-item').length > 0",
  'lessons/a1/lesson-01/index.html': "document.querySelectorAll('.phrase-row, .phrase-card, .vocab-table tbody tr').length > 0"
};
async function go(page) {
  console.log('Opening', page);
  await c.send('Page.navigate', { url: B + page });
  await waitFor("location.pathname.endsWith(" + JSON.stringify('/' + page) + ") && document.readyState === 'complete' && (" + selectors[page] + ')');
  await c.ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  return await c.ev(`(() => { const n = performance.getEntriesByType('navigation')[0]; return { responseMs: n.responseStart, domMs: n.domContentLoadedEventEnd, readyMs: performance.now(), nodes: document.querySelectorAll('*').length }; })()`);
}
try {
  await c.send('Network.enable');
  await c.send('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*', '*telegram.org*'] });
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await c.send('Storage.clearDataForOrigin', { origin: 'http://127.0.0.1:8765', storageTypes: 'all' });
  await c.send('Network.clearBrowserCache');
  await go('index.html');
  await c.ev('navigator.serviceWorker.ready.then(() => true)');
  await waitFor('!!navigator.serviceWorker.controller');
  for (const page of Object.keys(selectors)) await go(page);
  for (const expiredHttpCache of [false, true]) {
    for (const page of Object.keys(selectors)) {
      for (let run = 0; run < 3; run++) {
        if (expiredHttpCache) await c.send('Network.clearBrowserCache');
        const at = requests.length;
        const metric = await go(page);
        result.scenarios.push({ page, expiredHttpCache, run, ...metric, networkRequests: requests.length - at });
        result.errors.push(...c.errors());
      }
    }
  }
  for (const lang of ['ru', 'uk', 'ar']) {
    await go('index.html');
    await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({ lang: '${lang}', ts: Date.now() }));`);
    await go('index.html');
    await c.ev('Vocab.show("a1")');
    await waitFor("document.querySelectorAll('#vocabList .v-item').length > 0");
    const samples = [];
    for (let run = 0; run < 5; run++) {
      await c.ev('Home.showTab("course")');
      samples.push(await c.ev(`new Promise(resolve => {
        const start = performance.now();
        const list = document.getElementById('vocabList');
        let changes = 0;
        const observer = new MutationObserver(records => { changes += records.length; });
        observer.observe(list, { childList: true });
        document.querySelector('[data-tab-btn="dict"]').click();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          observer.disconnect();
          resolve({ ms: performance.now() - start, listMutations: changes, rows: list.children.length });
        }));
      })`));
    }
    result.tabs[lang] = samples;
  }
  assert(result.scenarios.every(s => Number.isFinite(s.readyMs)));
  fs.writeFileSync(output, JSON.stringify(result, null, 2));
  for (const expiredHttpCache of [false, true]) {
    console.log(expiredHttpCache ? 'Expired HTTP cache (SW still warm)' : 'Warm HTTP cache');
    for (const page of Object.keys(selectors)) {
      const samples = result.scenarios.filter(s => s.page === page && s.expiredHttpCache === expiredHttpCache);
      const median = key => samples.map(s => s[key]).sort((a,b) => a-b)[1];
      console.log(`${page}: ready ${Math.round(median('readyMs'))} ms, response ${Math.round(median('responseMs'))} ms, requests ${median('networkRequests')}`);
    }
  }
  for (const [lang, samples] of Object.entries(result.tabs)) {
    console.log(`Dict tab ${lang}: median ${Math.round(samples.map(s => s.ms).sort((a,b) => a-b)[2])} ms; mutations ${samples.map(s => s.listMutations).join(',')}; rows ${samples[0].rows}`);
  }
  console.log('JS errors:', result.errors.length);
} finally {
  await Promise.race([c.send('Browser.close'), c.wait(1000)]);
  c.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
