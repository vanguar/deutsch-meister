"""
Тест базы пользователей бота без сети: Telegram и Upstash (с конвейером)
подменены в памяти.

Запуск:  python scripts/test_bot_users.py
"""
import fnmatch
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.parse

os.environ["BOT_TOKEN"] = "123:TEST"
os.environ["UPSTASH_REDIS_REST_URL"] = "https://redis.test"
os.environ["UPSTASH_REDIS_REST_TOKEN"] = "x"
os.environ["ADMIN_USERNAMES"] = "ObiVan1978"
os.environ.pop("ADMIN_IDS", None)
os.environ.pop("WEBHOOK_SECRET", None)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "api"))

import webhook as W  # noqa: E402

CALLS, UPLOADS = [], []
KV, SETS, ZSETS, HASHES = {}, {}, {}, {}


def redis(cmd):
    op, args = cmd[0].upper(), cmd[1:]
    if op == "GET":
        return KV.get(args[0])
    if op == "SET":
        KV[args[0]] = args[1]
        return "OK"
    if op == "SADD":
        s = SETS.setdefault(args[0], set())
        n = len([m for m in args[1:] if m not in s])
        s.update(args[1:])
        return n
    if op == "SREM":
        s = SETS.setdefault(args[0], set())
        n = len([m for m in args[1:] if m in s])
        s.difference_update(args[1:])
        return n
    if op == "SMEMBERS":
        return sorted(SETS.get(args[0], set()))
    if op == "SCARD":
        return len(SETS.get(args[0], set()))
    if op == "HSET":
        h = HASHES.setdefault(args[0], {})
        for i in range(1, len(args), 2):
            h[args[i]] = args[i + 1]
        return 1
    if op == "HSETNX":
        h = HASHES.setdefault(args[0], {})
        if args[1] in h:
            return 0
        h[args[1]] = args[2]
        return 1
    if op == "HGETALL":
        out = []
        for k, v in HASHES.get(args[0], {}).items():
            out += [k, v]
        return out
    if op == "ZADD":
        z = ZSETS.setdefault(args[0], {})
        nx = args[1] == "NX"
        score, member = (args[2], args[3]) if nx else (args[1], args[2])
        if nx and member in z:
            return 0
        new = member not in z
        z[member] = float(score)
        return int(new)
    if op == "ZCOUNT":
        lo = float(args[1])
        return len([1 for s in ZSETS.get(args[0], {}).values() if s >= lo])
    if op in ("ZREVRANGE", "ZRANGE"):
        z = ZSETS.get(args[0], {})
        items = sorted(z, key=lambda m: z[m], reverse=(op == "ZREVRANGE"))
        a, b = int(args[1]), int(args[2])
        return items[a:(None if b == -1 else b + 1)]
    if op == "SCAN":
        pattern = args[args.index("MATCH") + 1]
        keys = [k for k in KV if fnmatch.fnmatch(k, pattern)]
        return ["0", keys]
    raise AssertionError(cmd)


def fake_upstash(cmd):
    return {"result": redis(cmd)}


def fake_pipe(cmds):
    return [{"result": redis(c)} for c in cmds]


def fake_tg(method, payload):
    CALLS.append((method, payload))
    if method == "getChat":
        if payload["chat_id"] == 777:
            return {"ok": True, "result": {"id": 777, "first_name": "Старый", "username": "old_user"}}
        return {"ok": False, "description": "chat not found"}
    if method == "getWebhookInfo":
        return {"ok": True, "result": {"url": "https://x.test/api/webhook",
                                       "allowed_updates": ["message", "callback_query", "pre_checkout_query"]}}
    return {"ok": True, "result": {}}


def fake_upload(method, fields, file_field, filename, content, ctype="text/csv"):
    UPLOADS.append((method, fields, filename, content))
    return {"ok": True}


W.tg = fake_tg
W._upstash = fake_upstash
W._upstash_pipe = fake_pipe
W.tg_upload = fake_upload

FAILS = []


def check(name, cond, extra=""):
    print(("  ok   " if cond else "  FAIL ") + name + (("  → " + str(extra)) if not cond and extra else ""))
    if not cond:
        FAILS.append(name)


def sent(chat=None):
    return [p for m, p in CALLS if m == "sendMessage" and (chat is None or p["chat_id"] == chat)]


def msg(text, uid, username="", first="Оля", code="uk"):
    return {"message": {"chat": {"id": uid, "type": "private"}, "text": text,
                        "from": {"id": uid, "first_name": first, "username": username,
                                 "language_code": code}}}


ADMIN = 1000

print("1. Владелец: /stats — регистрирует чат для уведомлений")
W.handle_update(msg("/stats", ADMIN, "ObiVan1978", "Иван", "ru"))
check("владелец сам попал в базу", "1000" in SETS.get("dm:users", set()))
check("чат владельца в dm:admins", "1000" in SETS.get("dm:admins", set()))
st = sent(ADMIN)[-1]["text"]
check("в /stats есть «Всего: 1»", "Всего: <b>1</b>" in st, st)
check("в /stats показан ID владельца", "<code>1000</code>" in st)

print("2. Новый человек нажал /start — сразу в базе, владельцу пришло уведомление")
CALLS.clear()
W.handle_update(msg("/start donate", 42, "olya_k", "Оля"))
u = HASHES.get("dm:user:42", {})
check("ID в dm:users", "42" in SETS["dm:users"])
check("имя, username, язык, источник", u.get("first_name") == "Оля" and u.get("username") == "olya_k"
      and u.get("tg_lang") == "uk" and u.get("source") == "donate" and u.get("via") == "bot", u)
check("даты первого и последнего визита", u.get("first_seen") and u.get("last_seen"))
note = [p for p in sent(ADMIN) if "Новый пользователь" in p["text"]]
check("уведомление владельцу", len(note) == 1 and "@olya_k" in note[0]["text"] and "№2" in note[0]["text"],
      note)
check("пользователь получил обычный ответ бота", len(sent(42)) == 1)

print("3. Повторный визит — не новый, без уведомления, last_seen обновился")
first = u["first_seen"]
time.sleep(0.01)
CALLS.clear()
W.handle_update(msg("/start", 42, "olya_new", "Оля"))
u = HASHES["dm:user:42"]
check("first_seen не изменился", u["first_seen"] == first)
check("username обновился", u["username"] == "olya_new")
check("уведомления нет", not [p for p in sent(ADMIN) if "Новый" in p["text"]])

print("4. Обычный пользователь не может вызвать /stats")
CALLS.clear()
W.handle_update(msg("/stats", 43, "hacker", "Хакер"))
check("статистику не получил", not [p for p in sent(43) if "Пользователи бота" in p["text"]])

print("5. Мини-апп открыт в Telegram без бота — тоже попадает в базу")


def init_data(user):
    data = {"auth_date": str(int(time.time())), "user": json.dumps(user)}
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret = hmac.new(b"WebAppData", b"123:TEST", hashlib.sha256).digest()
    data["hash"] = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    return urllib.parse.urlencode(data)


user55 = {"id": 55, "first_name": "Taras", "username": "taras", "language_code": "uk"}
verified = W.verify_init_data(init_data(user55), "123:TEST")
W.track_user(verified, "app", "app")
check("через мини-апп: via=app", HASHES["dm:user:55"].get("via") == "app")

print("6. Заблокировал бота — помечен; вернулся — снова активен")
W.handle_update({"my_chat_member": {"chat": {"id": 42, "type": "private"}, "from": {"id": 42},
                                    "new_chat_member": {"status": "kicked"}}})
check("blocked", "42" in SETS["dm:users:blocked"] and HASHES["dm:user:42"]["status"] == "blocked")
W.handle_update({"my_chat_member": {"chat": {"id": 42, "type": "private"},
                                    "from": {"id": 42, "first_name": "Оля", "username": "olya_new"},
                                    "new_chat_member": {"status": "member"}}})
check("снова active", "42" not in SETS["dm:users:blocked"] and HASHES["dm:user:42"]["status"] == "active")

print("7. /notify off — уведомления не приходят")
W.handle_update(msg("/notify off", ADMIN, "ObiVan1978", "Иван"))
CALLS.clear()
W.handle_update(msg("/start", 60, "", "Без ника"))
check("нет уведомления", not [p for p in sent(ADMIN) if "Новый" in p["text"]])
W.handle_update(msg("/notify on", ADMIN, "ObiVan1978", "Иван"))
CALLS.clear()
W.handle_update(msg("/start", 61, "", "Ещё один"))
check("снова есть", len([p for p in sent(ADMIN) if "Новый" in p["text"]]) == 1)

print("8. /import — перенос старых из dm:lang:* и dm:progress:*")
KV["dm:lang:777"] = json.dumps({"lang": "ru", "ts": 1700000000000})
KV["dm:progress:888"] = "{}"
KV["dm:progress:42"] = "{}"   # уже в базе — не трогаем
CALLS.clear()
W.handle_update(msg("/import", ADMIN, "ObiVan1978", "Иван"))
check("777 перенесён с именем", HASHES.get("dm:user:777", {}).get("username") == "old_user")
check("first_seen 777 — из даты выбора языка", HASHES["dm:user:777"]["first_seen"] == "1700000000000")
check("888 перенесён без имени", "888" in SETS["dm:users"] and HASHES["dm:user:888"]["via"] == "import")
check("42 не перезаписан", HASHES["dm:user:42"]["via"] == "bot")
check("вебхук: добавлен my_chat_member",
      any(m == "setWebhook" and "my_chat_member" in p["allowed_updates"] for m, p in CALLS))
rep = sent(ADMIN)[-1]["text"]
check("отчёт: добавлено 2", "добавлено <b>2</b>" in rep, rep)

print("9. /users и /export")
CALLS.clear()
W.handle_update(msg("/users 3", ADMIN, "ObiVan1978", "Иван"))
lst = sent(ADMIN)[-1]["text"]
check("/users: 3 последних", lst.count("<code>") == 3, lst)
W.handle_update(msg("/export", ADMIN, "ObiVan1978", "Иван"))
check("CSV отправлен", len(UPLOADS) == 1)
csv_text = UPLOADS[0][3].decode("utf-8")
check("CSV: заголовок и все пользователи", csv_text.startswith("﻿id;username;first_name")
      and csv_text.count("\n") == len(SETS["dm:users"]) + 1, csv_text[:200])
check("CSV: язык приложения из dm:lang", ";ru;" in csv_text)

print("10. /stats после всего")
CALLS.clear()
W.handle_update(msg("/stats", ADMIN, "ObiVan1978", "Иван"))
st = sent(ADMIN)[-1]["text"]
total = len(SETS["dm:users"])
check(f"всего {total}", f"Всего: <b>{total}</b>" in st, st)
check("в списке есть username", "@olya_new" in st)

print()
print("ПРОВАЛЕНО: " + ", ".join(FAILS) if FAILS else "ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ")
sys.exit(1 if FAILS else 0)
