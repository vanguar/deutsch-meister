"""Pure merge rules and optimistic CAS persistence. No external dependencies.
See js/progress-model.js for the corresponding client rules.
"""
import json
import math
from datetime import date, timedelta

class ProgressUnavailable(RuntimeError):
    pass


def _max_map(a, b):
    a, b = a or {}, b or {}
    return {k: _int_or_float(max(_num(a.get(k)), _num(b.get(k)))) for k in set(a) | set(b)}


def _days(p):
    if isinstance(p.get("activeDays"), list):
        out = []
        for day in p["activeDays"]:
            try:
                date.fromisoformat(day)
                out.append(day)
            except (ValueError, TypeError):
                pass
        return out
    try:
        end = date.fromisoformat(p.get("lastActive", ""))
        return [(end - timedelta(days=i)).isoformat() for i in range(min(36600, max(1, int(_num(p.get("streak"))))))]
    except (ValueError, TypeError):
        return []


def merge_status(a, b):
    ta = _num(a.get("statusTs", a.get("ts")))
    tb = _num(b.get("statusTs", b.get("ts")))
    winner = b if tb > ta or (tb == ta and b.get("status") == "known") else a
    return {"status": winner.get("status") or "new", "statusTs": max(ta, tb)}


def _num(v):
    try:
        n = float(v)
        return max(0, n) if math.isfinite(n) else 0.0
    except (TypeError, ValueError):
        return 0.0


def _merge_book_pos(old, new):
    """Позиция чтения: last-write-wins по ts (запись без ts считается старой)."""
    if not isinstance(old, dict):
        return new if isinstance(new, dict) else None
    if not isinstance(new, dict):
        return old
    return new if _num(new.get("ts")) > _num(old.get("ts")) else old


def _merge_word(old, new):
    """n — максимум, seen — объединение форм, статус — по времени выбора."""
    rec = dict(old)
    rec.update(new)                      # словарные поля одинаковы
    rec["n"] = max(_num(old.get("n")), _num(new.get("n")))
    if rec["n"] == int(rec["n"]):
        rec["n"] = int(rec["n"])
    rec["ts"] = max(_num(old.get("ts")), _num(new.get("ts")))
    if rec["ts"] == int(rec["ts"]):
        rec["ts"] = int(rec["ts"])
    rec.update(merge_status(old, new))
    seen, keys = [], set()
    for form in list(old.get("seen") or []) + list(new.get("seen") or []):
        key = str(form).lower()
        if key in keys:
            continue
        keys.add(key)
        seen.append(form)
    rec["seen"] = seen
    return rec


def _merge_books(old, new):
    """Сборники слов и позиции сливаются между устройствами.
    Снимок старого клиента (без books) ничего не стирает."""
    old = old if isinstance(old, dict) else {}
    new = new if isinstance(new, dict) else {}
    out = {}
    for book_id in set(old) | set(new):
        lo = old.get(book_id) or {}
        ln = new.get(book_id) or {}
        if not isinstance(lo, dict) or not isinstance(ln, dict):
            out[book_id] = ln or lo
            continue
        rec = {}
        pos = _merge_book_pos(lo.get("pos"), ln.get("pos"))
        if pos:
            rec["pos"] = pos
        wo = lo.get("words") if isinstance(lo.get("words"), dict) else {}
        wn = ln.get("words") if isinstance(ln.get("words"), dict) else {}
        words = {}
        for lemma in set(wo) | set(wn):
            ro, rn = wo.get(lemma), wn.get(lemma)
            if isinstance(ro, dict) and isinstance(rn, dict):
                words[lemma] = _merge_word(ro, rn)
            else:
                words[lemma] = rn if isinstance(rn, dict) else ro
        if words:
            rec["words"] = words
        if rec:
            out[book_id] = rec
    return out


def _int_or_float(v):
    v = _num(v)
    return int(v) if v == int(v) else v


def _merge_global(old, new):
    """XP — объединение событий, серия — последовательные даты активности;
    пройденные уроки объединением, оценки максимум (как ProgressModel)."""
    old = old if isinstance(old, dict) else {}
    new = new if isinstance(new, dict) else {}
    out = dict(old)
    out.update(new)
    events = _max_map(old.get("xpEvents"), new.get("xpEvents"))
    def base(p):
        return max(_num(p.get("xpBase")), _num(p.get("xp")) - sum(_num(v) for v in (p.get("xpEvents") or {}).values()))
    out.update(schema=2, xpBase=max(base(old), base(new)), xpEvents=events)
    out["xp"] = _int_or_float(out["xpBase"] + sum(events.values()))
    active = sorted(set(_days(old)) | set(_days(new)))
    out["activeDays"] = active
    out["lastActive"] = active[-1] if active else None
    streak = 0
    if active:
        end = date.fromisoformat(active[-1])
        while (end - timedelta(days=streak)).isoformat() in active:
            streak += 1
    out["streak"] = streak
    done = []
    for lid in list(old.get("completedLessons") or []) + list(new.get("completedLessons") or []):
        if lid not in done:
            done.append(lid)
    out["completedLessons"] = sorted(done)
    so = old.get("lessonScores") if isinstance(old.get("lessonScores"), dict) else {}
    sn = new.get("lessonScores") if isinstance(new.get("lessonScores"), dict) else {}
    out["lessonScores"] = {k: _int_or_float(max(_num(so.get(k)), _num(sn.get(k))))
                           for k in set(so) | set(sn)}
    return out


def _merge_sections(old, new):
    """Секции уроков: сданные — объединением, оценки — максимум."""
    old = old if isinstance(old, dict) else {}
    new = new if isinstance(new, dict) else {}
    out = {}
    for lid in set(old) | set(new):
        lo = old.get(lid) if isinstance(old.get(lid), dict) else {}
        ln = new.get(lid) if isinstance(new.get(lid), dict) else {}
        done = []
        for s in list(lo.get("done") or []) + list(ln.get("done") or []):
            if s not in done:
                done.append(s)
        so = lo.get("scores") if isinstance(lo.get("scores"), dict) else {}
        sn = ln.get("scores") if isinstance(ln.get("scores"), dict) else {}
        scores = {k: _int_or_float(max(_num(so.get(k)), _num(sn.get(k)))) for k in set(so) | set(sn)}
        out[lid] = {"done": done, "scores": scores}
    return out


def _merge_lesson_pos(old, new):
    """Место в уроке: свежее по ts, прочитанная доля теории — максимум."""
    old = old if isinstance(old, dict) else {}
    new = new if isinstance(new, dict) else {}
    out = {}
    for lid in set(old) | set(new):
        a, b = old.get(lid), new.get(lid)
        if not isinstance(a, dict) or not isinstance(b, dict):
            out[lid] = b if isinstance(b, dict) else a
            continue
        rec = dict(b if _num(b.get("ts")) > _num(a.get("ts")) else a)
        rec["read"] = max(_num(a.get("read")), _num(b.get("read")))
        out[lid] = rec
    return out



def merge_vocab(a, b):
    a, b = a or {}, b or {}
    def clean(v):
        return v if isinstance(v, dict) else {"status": "known" if v else "new", "statusTs": 0}
    return {k: merge_status(clean(a.get(k)), clean(b.get(k))) for k in set(a) | set(b)}


def merge_driving(a, b):
    a, b = a or {}, b or {}
    out = {}
    for key in set(a) | set(b):
        x, y = a.get(key) or {}, b.get(key) or {}
        seen = sorted(set(x.get("seen") or []) | set(y.get("seen") or []))
        out[key] = {"n": max(_num(x.get("n")), _num(y.get("n")), len(seen)), "done": bool(x.get("done") or y.get("done")), "seen": seen}
    return out


def merge_exam(a, b):
    a, b = a or {}, b or {}
    def base(p):
        return p.get("base") or {"tries": _num(p.get("tries")), "passed": _num(p.get("passed")), "best": p.get("best"), "last": p.get("last")}
    ba, bb = base(a), base(b)
    records = dict(a.get("records") or {})
    records.update(b.get("records") or {})
    values = list(records.values())
    bests = [ba.get("best") if ba.get("tries") else None, bb.get("best") if bb.get("tries") else None] + [v.get("points") for v in values]
    bests = [_num(v) for v in bests if v is not None]
    legacy = {"tries": max(_num(ba.get("tries")), _num(bb.get("tries"))), "passed": max(_num(ba.get("passed")), _num(bb.get("passed"))), "best": min(bests) if bests else 0,
              "last": bb.get("last") if _num((bb.get("last") or {}).get("ts")) > _num((ba.get("last") or {}).get("ts")) else ba.get("last")}
    last = sorted([v for v in values + [legacy["last"]] if v], key=lambda v: _num(v.get("ts")), reverse=True)
    return {"base": legacy, "records": records, "tries": legacy["tries"] + len(values), "passed": legacy["passed"] + sum(bool(v.get("passed")) for v in values), "best": legacy["best"], "last": last[0] if last else None}


def merge_snapshot(stored, incoming):
    stored = stored or {}
    data = dict(stored)
    data.update(incoming)
    data["schema"] = 2
    for field, merge in (("progress", _merge_global), ("sections", _merge_sections), ("lessonPos", _merge_lesson_pos), ("books", _merge_books), ("vocab", merge_vocab), ("driving", merge_driving), ("exam", merge_exam)):
        data[field] = merge(stored.get(field), incoming.get(field))
    data["drivingLast"] = _merge_book_pos(stored.get("drivingLast"), incoming.get("drivingLast"))
    if not data.get("lastLesson") and stored.get("lastLesson"):
        data["lastLesson"] = stored["lastLesson"]
    return data


def read_raw(redis, key):
    res = redis(["GET", key])
    if not isinstance(res, dict) or "error" in res or "result" not in res:
        raise ProgressUnavailable("Progress read failed")
    raw = res["result"]
    if raw is None:
        return None, None
    try:
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise ValueError("Invalid snapshot")
        return raw, data
    except (ValueError, TypeError) as exc:
        raise ProgressUnavailable("Stored progress is invalid") from exc


# Atomic compare + set: retry merge if another device writes between GET and EVAL.
CAS = """local current = redis.call('GET', KEYS[1])
if (not current and ARGV[1] == 'missing') or (current and ARGV[1] == 'present' and current == ARGV[2]) then
  redis.call('SET', KEYS[1], ARGV[3]); return 1
end
return 0"""


def write(redis, uid, incoming):
    if not isinstance(incoming, dict):
        raise ValueError("Snapshot must be an object")
    key = "dm:progress:" + str(uid)
    for _ in range(5):
        raw, stored = read_raw(redis, key)
        merged = merge_snapshot(stored, incoming)
        payload = json.dumps(merged, ensure_ascii=False, separators=(",", ":"), allow_nan=False)
        result = redis(["EVAL", CAS, 1, key, "missing" if raw is None else "present", raw or "", payload])
        if not isinstance(result, dict) or "error" in result or "result" not in result:
            raise ProgressUnavailable("Progress write failed")
        if result["result"] == 1:
            return merged
        if result["result"] != 0:
            raise ProgressUnavailable("Invalid CAS response")
    raise ProgressUnavailable("Concurrent progress update; retry later")
