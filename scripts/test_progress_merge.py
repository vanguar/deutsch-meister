"""
Облачный прогресс: сервер сливает снимок с сохранённым, а не перезаписывает.
Устройство со старыми данными не должно стирать упражнения, сданные на
другом. Без сети: Upstash подменён словарём.

Запуск:  python scripts/test_progress_merge.py
"""
import json
import os
import sys

os.environ.setdefault("BOT_TOKEN", "123:TEST")
os.environ["UPSTASH_REDIS_REST_URL"] = "https://redis.test"
os.environ["UPSTASH_REDIS_REST_TOKEN"] = "x"
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "api"))

import webhook as W  # noqa: E402

KV = {}


def fake(cmd):
    if cmd[0] == "GET":
        return {"result": KV.get(cmd[1])}
    if cmd[0] == "SET":
        KV[cmd[1]] = cmd[2]
        return {"result": "OK"}
    raise AssertionError(cmd)


W._upstash = fake
fail = 0


def ok(cond, msg):
    global fail
    print(("  ok   " if cond else "  FAIL ") + msg)
    if not cond:
        fail += 1


# телефон: все упражнения B1·02
W.write_progress(1, {
    "progress": {"xp": 300, "streak": 3, "lastActive": "2026-10-22",
                 "completedLessons": ["b1-01"], "lessonScores": {"b1-01": 90}},
    "sections": {"b1-02": {"done": ["fill", "choice", "match", "dict"],
                           "scores": {"fill": 80, "choice": 100, "match": 100, "dict": 70}}},
    "lastLesson": "b1-02",
    "lessonPos": {"b1-02": {"read": 1, "ts": 200, "i": 40, "f": 0.5}},
})
# Desktop со старым снимком: только карточки
W.write_progress(1, {
    "progress": {"xp": 120, "streak": 1, "lastActive": "2026-10-21",
                 "completedLessons": [], "lessonScores": {}},
    "sections": {"b1-02": {"done": ["flashcards"], "scores": {"flashcards": 90, "fill": 10}}},
    "lastLesson": "b1-02",
    "lessonPos": {"b1-02": {"read": 0.3, "ts": 300, "i": 5, "f": 0}},
    "books": {},
})
d = W.read_progress(1)
sec = d["sections"]["b1-02"]
ok(set(sec["done"]) == {"fill", "choice", "match", "dict", "flashcards"}, "секции объединены")
ok(sec["scores"]["fill"] == 80 and sec["scores"]["flashcards"] == 90, "оценки — максимум")
ok(d["progress"]["xp"] == 300 and d["progress"]["streak"] == 3, "xp и серия не уменьшились")
ok(d["progress"]["completedLessons"] == ["b1-01"], "пройденные уроки не потерялись")
ok(d["progress"]["lastActive"] == "2026-10-22", "последний день — самый поздний")
ok(d["lessonPos"]["b1-02"]["i"] == 5 and d["lessonPos"]["b1-02"]["read"] == 1, "место — свежее, read — максимум")
ok(isinstance(json.dumps(d), str), "снимок сериализуется")

# первый снимок без сохранённого — пишется как есть
W.write_progress(2, {"progress": {"xp": 5}, "sections": {}})
ok(W.read_progress(2) == {"progress": {"xp": 5}, "sections": {}}, "первая запись без изменений")

sys.exit(1 if fail else 0)
