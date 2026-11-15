'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../js/progress-model.js');
const root = require('node:path').resolve(__dirname, '..');
const read = f => fs.readFileSync(root + '/' + f, 'utf8');
function storage() {
  const s = {};
  Object.defineProperties(s, {
    getItem: { value: k => s[k] ?? null },
    setItem: { value: (k,v) => { s[k] = String(v); } },
    removeItem: { value: k => { delete s[k]; } }
  }); return s;
}
function events() { const map = {}; return { addEventListener(k, fn) { (map[k] ||= []).push(fn); }, dispatchEvent(e) { (map[e.type] || []).forEach(fn => fn(e)); } }; }

const merged = M.global({ xp: 110, xpBase: 100, xpEvents: { a: 10 } }, { xp: 108, xpBase: 100, xpEvents: { b: 8 } });
assert.equal(merged.xp, 118);
assert.equal(M.global(merged, merged).xp, 118);
assert.equal(M.global({ lastActive: '2026-10-01', streak: 30 }, { lastActive: '2026-11-15', streak: 1 }).streak, 1);
assert.deepEqual(M.status({ status: 'known', statusTs: 10, ts: 100 }, { status: 'new', statusTs: 20 }), { status: 'new', statusTs: 20 });

const localStorage = storage();
const document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
const ctx = vm.createContext({ localStorage, document, window: events(), Event, console, LESSON_DATA: { id: 'a1-01', meta: { xpReward: 100 } } });
vm.runInContext(read('js/progress-model.js') + '\n' + read('js/progress.js') + '\nthis.P = Progress;', ctx);
localStorage.setItem('dm_progress', JSON.stringify({ xp: 75, completedLessons: [], lessonScores: {} }));
ctx.P.addXP(10, 'a1-01:fill:0'); ctx.P.addXP(10, 'a1-01:fill:0');
assert.equal(ctx.P.getXP(), 85, 'retrying a correct answer must not award XP twice');
ctx.P.importAll({ progress: { xp: 83, xpBase: 75, xpEvents: { 'a1-02:choice:0': 8 } } });
assert.equal(ctx.P.getXP(), 93, 'independent offline work adds up');
localStorage.setItem('dm_sections:a1-02', JSON.stringify({ done: ['flashcards', 'fill'], scores: { fill: 90, flashcards: 100 } }));
ctx.P.importAll({ sections: { 'a1-02': { done: ['choice', 'match', 'dict'], scores: { choice: 80, match: 100, dict: 90 } } } });
assert.equal(ctx.P.isCompleted('a1-02'), true);
assert.equal(ctx.P.getXP(), 193, 'union-completed lesson awards its reward');
ctx.P.importAll(ctx.P.exportAll());
assert.equal(ctx.P.getXP(), 193, 'reward survives repeated merges without duplication');
console.log('PASS progress migration, XP idempotence, streak, relearning and union completion');

// Cross-language fixtures: JS and Python must agree on the same saved state.
const { spawnSync } = require('node:child_process');
const fixtures = [
  [{ xp: 100, streak: 3, lastActive: '2026-11-13' }, { xp: 80, streak: 1, lastActive: '2026-11-15' }],
  [{ xp: 110, xpBase: 100, xpEvents: { a: 10 } }, { xp: 108, xpBase: 100, xpEvents: { b: 8 } }],
  [merged, merged]
];
const py = spawnSync(process.env.PYTHON || 'python', ['-B', '-c', 'import json,sys; from api.progress_state import _merge_global; print(json.dumps([_merge_global(*x) for x in json.load(sys.stdin)]))'], { cwd: root, input: JSON.stringify(fixtures), encoding: 'utf8' });
assert.equal(py.status, 0, py.stderr);
assert.deepEqual(JSON.parse(py.stdout), fixtures.map(([a,b]) => M.global(a,b)));
console.log('PASS server/client merge parity');

(async () => {
  const doc = { ...events(), readyState: 'complete', visibilityState: 'visible', getElementById: () => null };
  const win = events(), store = storage(), tasks = [];
  let subscriber, requests = 0, fail = true;
  const c = vm.createContext({ document: doc, window: win, localStorage: store, Event, Blob, AbortController, Date,
    setTimeout: fn => { tasks.push(fn); return fn; }, clearTimeout: fn => { const i = tasks.indexOf(fn); if (i >= 0) tasks.splice(i,1); },
    Progress: { subscribe: fn => { subscriber = fn; }, exportAll: () => ({ progress: { xp: 8 } }), importAll: () => false, renderHomeProgress() {}, reloadSections() {} },
    fetch: async (_, opt) => { requests++; if (fail) return { ok: false, status: 503 }; const data = JSON.parse(opt.body); return { ok: true, json: async () => ({ ok: true, saved: !!data.data }) }; }
  });
  vm.runInContext(read('js/cloud-sync.js'), c);
  for (let i = 0; i < 45 && tasks.length; i++) await tasks.shift()();
  assert.equal(requests, 0);
  win.Telegram = { WebApp: { initData: 'late-sdk' } };
  doc.dispatchEvent(new Event('dm:tg-ready'));
  await tasks.shift()();
  assert.equal(requests, 1);
  assert.equal(store.getItem('dm_sync_dirty'), '1', 'failed HTTP must remain dirty');
  fail = false;
  await tasks.shift()();
  assert.equal(requests, 3, 'retry performs GET and acknowledged POST');
  assert.equal(store.getItem('dm_sync_dirty'), '0');
  subscriber();
  assert.equal(store.getItem('dm_sync_dirty'), '1');
  console.log('PASS late Telegram SDK, failed sync retry, acknowledged dirty state');
})().catch(e => { console.error(e); process.exitCode = 1; });
