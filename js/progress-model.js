/* Pure, versioned merge rules. Kept in sync with api/progress_state.py. */
const ProgressModel = (() => {
  const object = x => x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  const number = x => Number.isFinite(Number(x)) ? Math.max(0, Number(x)) : 0;
  const union = (a, b) => [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])];
  function maxMap(a, b) {
    a = object(a); b = object(b);
    return Object.fromEntries(union(Object.keys(a), Object.keys(b)).sort().map(k => [k, Math.max(number(a[k]), number(b[k]))]));
  }
  function days(p) {
    const out = new Set((p.activeDays || []).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)));
    if (!p.activeDays && /^\d{4}-\d{2}-\d{2}$/.test(p.lastActive || '')) {
      const end = Date.parse(p.lastActive + 'T12:00:00Z');
      for (let i = 0; i < Math.min(36600, Math.max(1, number(p.streak))); i++) out.add(new Date(end - i * 86400000).toISOString().slice(0, 10));
    }
    return [...out].sort();
  }
  function global(a = {}, b = {}) {
    const xpEvents = maxMap(a.xpEvents, b.xpEvents);
    const sum = m => Object.values(object(m)).reduce((s, n) => s + number(n), 0);
    const base = p => Math.max(number(p.xpBase), number(p.xp) - sum(p.xpEvents));
    const xpBase = Math.max(base(a), base(b));
    const activeDays = union(days(a), days(b)).sort();
    const lastActive = activeDays.at(-1) || null;
    let streak = 0;
    if (lastActive) {
      const set = new Set(activeDays), end = Date.parse(lastActive + 'T12:00:00Z');
      while (set.has(new Date(end - streak * 86400000).toISOString().slice(0, 10))) streak++;
    }
    return { ...a, ...b, schema: 2, xpBase, xpEvents, xp: xpBase + sum(xpEvents), activeDays, lastActive, streak,
      completedLessons: union(a.completedLessons, b.completedLessons).sort(), lessonScores: maxMap(a.lessonScores, b.lessonScores) };
  }
  function status(a = {}, b = {}) {
    const ta = number(a.statusTs ?? a.ts), tb = number(b.statusTs ?? b.ts);
    // Legacy ties keep known; an explicit later 'new' always wins.
    const winner = tb > ta || (tb === ta && b.status === 'known') ? b : a;
    return { status: winner.status || 'new', statusTs: Math.max(ta, tb) };
  }
  function vocab(a = {}, b = {}) {
    const out = {};
    union(Object.keys(a), Object.keys(b)).forEach(k => {
      const clean = v => typeof v === 'object' && v ? v : { status: v ? 'known' : 'new', statusTs: 0 };
      out[k] = status(clean(a[k]), clean(b[k]));
    });
    return out;
  }
  function driving(a = {}, b = {}) {
    const out = {};
    union(Object.keys(a), Object.keys(b)).forEach(k => {
      const x = object(a[k]), y = object(b[k]);
      const seen = union(x.seen, y.seen).sort((i,j) => i-j);
      out[k] = { n: Math.max(number(x.n), number(y.n), seen.length), done: !!(x.done || y.done), seen };
    });
    return out;
  }
  function exam(a = {}, b = {}) {
    const base = p => p.base || { tries: number(p.tries), passed: number(p.passed), best: p.best, last: p.last };
    const ba = base(a), bb = base(b), legacy = { tries: Math.max(number(ba.tries), number(bb.tries)), passed: Math.max(number(ba.passed), number(bb.passed)) };
    const records = { ...object(a.records), ...object(b.records) };
    const values = Object.values(records);
    const bests = [ba.tries ? ba.best : null, bb.tries ? bb.best : null, ...values.map(v => v.points)].filter(v => v != null).map(number);
    legacy.best = bests.length ? Math.min(...bests) : 0;
    legacy.last = number(bb.last?.ts) > number(ba.last?.ts) ? bb.last : ba.last;
    const last = [...values, legacy.last].filter(Boolean).sort((x,y) => number(y.ts) - number(x.ts))[0] || null;
    return { base: legacy, records, tries: legacy.tries + values.length, passed: legacy.passed + values.filter(v => v.passed).length, best: legacy.best, last };
  }
  return { global, status, vocab, driving, exam };
})();
if (typeof module !== 'undefined') module.exports = ProgressModel;
