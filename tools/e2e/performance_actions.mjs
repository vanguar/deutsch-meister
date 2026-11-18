// Browser regressions for navigation, vocabulary and offline reopening.
// Starts its own local server; Chrome + Node --experimental-websocket required.
// Optional root + "baseline" mode record the original behavior for comparison.
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { start, SP } from './cdp.mjs';
const root = process.argv[2] || fileURLToPath(new URL('../../', import.meta.url));
const baseline = process.argv[3] === 'baseline';
const B = 'http://127.0.0.1:8768/deutsch-meister/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, B).pathname).replace(/^\/deutsch-meister\//, '');
  const file = path.resolve(root, !rel || rel.endsWith('/') ? rel + 'index.html' : rel);
  if (!file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  try { const body = fs.readFileSync(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(8768, '127.0.0.1', resolve));
const c = await start(9388);
let checks = 0;
const snapshots = {};
function check(condition, message) { assert(condition, message); checks++; console.log('PASS ' + message); }
async function waitFor(expr) {
  const end = Date.now() + 15000;
  do { try { if (await c.ev(expr)) return; } catch {} await c.wait(25); } while (Date.now() < end);
  throw Error('Timed out: ' + expr);
}
async function go(page = 'index.html') {
  const url = B + page;
  await c.send('Page.navigate', { url });
  await waitFor(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete' && (typeof Home !== 'undefined' || document.querySelectorAll('.phrase-card').length > 0)`);
}
const click = selector => c.ev(`document.querySelector(${JSON.stringify(selector)}).click()`);
async function search(value, condition) {
  await c.ev(`(() => { const el = document.getElementById('vocabQuery'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input')); })()`);
  await waitFor(condition);
}
try {
  await c.send('Network.enable');
  await c.send('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*', '*telegram.org*'] });
  await c.send('Storage.clearDataForOrigin', { origin: 'http://127.0.0.1:8768', storageTypes: 'all' });
  await go();
  await c.ev('navigator.serviceWorker.ready.then(() => true)');
  await waitFor('!!navigator.serviceWorker.controller');
  await c.ev(`localStorage.clear(); sessionStorage.clear();
    localStorage.setItem('dm_progress', JSON.stringify({xp:320,streak:5,lastActive:new Date().toISOString().slice(0,10),completedLessons:['a1-01','a1-02','a1-03'],lessonScores:{}}));
    localStorage.setItem('dm_last_lesson','a1-04');
    localStorage.setItem('dm_sections:a1-04', JSON.stringify({done:['flashcards','fill'],scores:{}}));`);
  await go();
  snapshots.progress = await c.ev(`({stepCount:document.querySelectorAll('#nowSteps .step.on').length, next:document.getElementById('nowNextName').textContent, percent:document.getElementById('nowSub').textContent})`);
  await c.ev(`Progress.importAll({progress:{xp:520,streak:7,completedLessons:['a1-01','a1-02','a1-03','a1-04']}}); Progress.renderHomeProgress();`);
  snapshots.cloud = await c.ev(`({xp:document.getElementById('statXp').textContent,done:document.getElementById('statDone').textContent,streak:document.getElementById('streakNum').textContent})`);
  for (const lang of ['ru', 'uk', 'ar']) {
    await c.ev(`localStorage.setItem('dm_lang',JSON.stringify({lang:'${lang}',ts:Date.now()})); localStorage.removeItem('dm_vocab_known'); localStorage.removeItem('dm_vocab_status');`);
    await go();
    await waitFor(`typeof I18N !== 'undefined' && I18N.lang === '${lang}'`);
    await click('[data-tab-btn="dict"]');
    await waitFor("document.querySelectorAll('#vocabList .v-item').length > 0");
    const total = await c.ev('document.querySelectorAll("#vocabList .v-item").length');
    await c.ev('window.__firstRow = document.querySelector("#vocabList .v-item")');
    await click('[data-tab-btn="course"]');
    await click('[data-tab-btn="dict"]');
    await c.ev('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
    check(await c.ev('window.__firstRow === document.querySelector("#vocabList .v-item")') === !baseline, `${lang}: expected row identity on returning to dictionary`);
    check(await c.ev('!document.querySelector("[data-tab=\\"dict\\"]").hidden'), `${lang}: dictionary tab visible`);
    await click('#vocabList .v-know');
    check(await c.ev('document.querySelector("#vocabList .v-item").classList.contains("known")'), `${lang}: word marked known`);
    await click('[data-vfilter="known"]');
    check(await c.ev('document.querySelectorAll("#vocabList .v-item").length') === 1, `${lang}: known filter`);
    await click('[data-vfilter="learn"]');
    check(await c.ev('document.querySelectorAll("#vocabList .v-item").length') === total - 1, `${lang}: learning filter`);
    await click('[data-vfilter="all"]');
    await search('schon', '[...document.querySelectorAll("#vocabList .v-word")].some(el => el.textContent === "schön")');
    check(await c.ev('document.querySelectorAll("#vocabList .v-item").length') > 0, `${lang}: search handles umlauts`);
    await search('qqqzzz', 'document.querySelectorAll("#vocabList .v-item").length === 0');
    check(await c.ev('!document.getElementById("vocabEmpty").hidden'), `${lang}: empty search state`);
    await search('', `document.querySelectorAll('#vocabList .v-item').length === ${total}`);
    await c.ev('localStorage.setItem("dm_vocab_known", "{}"); window.dispatchEvent(new Event("dm:progress-import"))');
    check(await c.ev('document.querySelectorAll("#vocabList .known").length') === 0, `${lang}: cloud import refreshes word statuses`);
    await click('[data-vlevel="b2"]');
    check(await c.ev('document.getElementById("vLvlCode").textContent') === 'B2', `${lang}: level switching`);
    for (const width of [360, 1280]) {
      await c.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 600 });
      check(await c.ev('document.documentElement.scrollWidth <= innerWidth + 1'), `${lang}: no horizontal overflow at ${width}px`);
    }
    await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    if (lang === 'ar') check(await c.ev('document.documentElement.dir') === 'rtl', 'Arabic keeps RTL');
  }
  await c.ev(`localStorage.setItem('dm_lang', JSON.stringify({lang:'ru',ts:Date.now()}))`);
  await go('lessons/a1/lesson-01/index.html');
  await c.ev('new Promise(r => setTimeout(r, 250))');
  await c.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
  await go('lessons/a1/lesson-01/index.html');
  check(await c.ev('document.querySelectorAll(".phrase-card").length') > 0, 'visited lesson reopens offline');
  fs.writeFileSync(path.join(SP, baseline ? 'actions-before.json' : 'actions-after.json'), JSON.stringify({checks,snapshots},null,2));
  console.log(`${checks} browser checks passed; progress snapshot:`, JSON.stringify(snapshots));
} finally {
  await Promise.race([c.send('Browser.close'), c.wait(1000)]);
  c.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
