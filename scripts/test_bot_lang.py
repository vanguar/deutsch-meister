"""
Тест бота и /api/lang без сети: Telegram и Upstash подменены в памяти.

Запуск:  python scripts/test_bot_lang.py
"""
import hashlib
import hmac
import io
import json
import os
import sys
import time
import urllib.parse

os.environ["BOT_TOKEN"] = "123:TEST"
os.environ["UPSTASH_REDIS_REST_URL"] = "https://redis.test"
os.environ["UPSTASH_REDIS_REST_TOKEN"] = "x"
os.environ.pop("WEBHOOK_SECRET", None)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "api"))

import webhook as W  # noqa: E402

CALLS = []
REDIS = {}


def fake_tg(method, payload):
    CALLS.append((method, payload))
    return {"ok": True, "result": {}}


def fake_upstash(cmd):
    op = cmd[0]
    if op == "GET":
        return {"result": REDIS.get(cmd[1])}
    if op == "SET":
        REDIS[cmd[1]] = cmd[2]
        return {"result": "OK"}
    raise AssertionError(cmd)


W.tg = fake_tg
W._upstash = fake_upstash

FAILS = []


def check(name, cond, extra=""):
    print(("  ok   " if cond else "  FAIL ") + name + (("  → " + str(extra)) if not cond and extra else ""))
    if not cond:
        FAILS.append(name)


def calls(method):
    return [p for m, p in CALLS if m == method]


def msg(text, uid=42, code="uk"):
    return {"message": {"chat": {"id": uid}, "text": text,
                        "from": {"id": uid, "first_name": "Оля", "language_code": code}}}


def cb(data, uid=42):
    return {"callback_query": {"id": "cq1", "data": data,
                               "from": {"id": uid, "first_name": "Оля"},
                               "message": {"chat": {"id": uid}}}}


def lang_params(url):
    q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    return q.get("lang", [None])[0], int(q.get("lts", ["0"])[0])


print("1. /start нового пользователя — сначала выбор языка (3 кнопки)")
CALLS.clear()
W.handle_update(msg("/start"))
sent = calls("sendMessage")
check("одно сообщение", len(sent) == 1)
kb = sent[0]["reply_markup"]["inline_keyboard"]
datas = [row[0]["callback_data"] for row in kb]
check("кнопки ru / uk / ar", datas == ["lang:ru", "lang:uk", "lang:ar"], datas)
check("арабский помечен «в разработке»", "в разработке" in kb[2][0]["text"])

print("2. Арабский — предупреждение, язык не меняется")
CALLS.clear()
W.handle_update(cb("lang:ar"))
ans = calls("answerCallbackQuery")
check("show_alert", ans and ans[0].get("show_alert") is True)
check("текст про разработку", ans and "в разработке" in ans[0]["text"].lower())
check("ничего не сохранено", "dm:lang:42" not in REDIS)
check("без сообщений", not calls("sendMessage"))

print("3. Выбор украинского")
CALLS.clear()
before = int(time.time() * 1000)
W.handle_update(cb("lang:uk"))
rec = json.loads(REDIS.get("dm:lang:42", "null") or "null")
check("сохранено uk", rec and rec["lang"] == "uk", rec)
check("ts свежий", rec and rec["ts"] >= before, rec)
menu = calls("setChatMenuButton")
check("кнопка меню обновлена", len(menu) == 1)
mlang, mts = lang_params(menu[0]["menu_button"]["web_app"]["url"])
check("меню: lang=uk и тот же ts", mlang == "uk" and mts == rec["ts"], (mlang, mts))
wel = calls("sendMessage")
check("приветствие по-украински", wel and "Привіт, Оля" in wel[0]["text"])
btn = wel[0]["reply_markup"]["inline_keyboard"][0][0]
check("кнопка «Відкрити курс»", btn["text"] == "🇩🇪 Відкрити курс")
check("кнопка открывает uk", lang_params(btn["web_app"]["url"]) == ("uk", rec["ts"]))
cmds = calls("setMyCommands")
check("команды чата на uk", cmds and cmds[0]["commands"][1] == {"command": "language", "description": "Змінити мову"} and cmds[0]["scope"] == {"type": "chat", "chat_id": 42}, cmds)
check("подтверждение выбора", calls("answerCallbackQuery")[0]["text"] == "✅ Мова: Українська")

print("4. Повторный /start — сразу приветствие на сохранённом языке")
CALLS.clear()
W.handle_update(msg("/start", code="ru"))
wel = calls("sendMessage")
check("приветствие uk, а не выбор", wel and "Привіт" in wel[0]["text"])

print("5. Донат по-украински")
CALLS.clear()
W.handle_update(cb("donate"))
check("текст доната uk", "Підтримати Deutsch Meister" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update(cb("donate:100"))
inv = calls("sendInvoice")
check("инвойс uk", inv and inv[0]["title"] == "Підтримка Deutsch Meister" and inv[0]["prices"][0]["amount"] == 100)
CALLS.clear()
W.handle_update({"message": {"chat": {"id": 42}, "from": {"id": 42},
                             "successful_payment": {"total_amount": 100}}})
check("спасибо uk", "Дякуємо за підтримку" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update({"pre_checkout_query": {"id": "p1"}})
check("pre_checkout отвечается", calls("answerPreCheckoutQuery") == [{"pre_checkout_query_id": "p1", "ok": True}])

print("6. Смена на русский через /language")
CALLS.clear()
W.handle_update(msg("/language"))
check("снова выбор языка", calls("sendMessage")[0]["reply_markup"] == W.lang_kb())
CALLS.clear()
W.handle_update(cb("lang:ru"))
check("сохранено ru", json.loads(REDIS["dm:lang:42"])["lang"] == "ru")
check("приветствие ru", "Привет, Оля" in calls("sendMessage")[0]["text"])

print("7. Пользователь без выбора: язык Telegram для доната")
CALLS.clear()
W.handle_update(msg("/donate", uid=7, code="uk"))
check("uk по language_code", "Підтримати" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update(msg("/donate", uid=8, code="en"))
check("ru по умолчанию", "Поддержать" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update(msg("/start donate", uid=9, code="ar"))
check("/start donate без выбора языка → ru", "Поддержать" in calls("sendMessage")[0]["text"])


# ── /api/lang через настоящий обработчик ─────────────────
def init_data(uid=42):
    fields = {"auth_date": str(int(time.time())), "query_id": "q",
              "user": json.dumps({"id": uid, "first_name": "Оля"})}
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", b"123:TEST", hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    return urllib.parse.urlencode(fields)


def api(body, path="/api/lang"):
    raw = json.dumps(body).encode()
    h = W.handler.__new__(W.handler)
    h.path = path
    h.headers = {"content-length": str(len(raw))}
    h.rfile = io.BytesIO(raw)
    h.wfile = io.BytesIO()
    status = {}
    h.send_response = lambda code, msg=None: status.setdefault("code", code)
    h.send_header = lambda *a: None
    h.end_headers = lambda: None
    h.do_POST()
    return status.get("code"), json.loads(h.wfile.getvalue().decode() or "null")


print("8. /api/lang")
code, res = api({"initData": "bad"})
check("плохая подпись → 401", code == 401)
code, res = api({"initData": init_data()})
check("чтение: ru из бота", code == 200 and res["lang"] == "ru", res)
srv_ts = res["ts"]
CALLS.clear()
code, res = api({"initData": init_data(), "lang": "uk", "ts": srv_ts - 1000})
check("старый ts не перетирает", res["lang"] == "ru" and json.loads(REDIS["dm:lang:42"])["lang"] == "ru", res)
code, res = api({"initData": init_data(), "lang": "uk", "ts": srv_ts + 1000})
check("свежий ts записан", res["lang"] == "uk" and res["ts"] == srv_ts + 1000, res)
menu = calls("setChatMenuButton")
check("меню переключено на uk", menu and lang_params(menu[-1]["menu_button"]["web_app"]["url"]) == ("uk", srv_ts + 1000))
code, res = api({"initData": init_data(), "lang": "ar"})
check("ar через API запрещён", code == 400)
code, res = api({"initData": init_data(uid=555)})
check("нет выбора → lang=null", res["ok"] and res["lang"] is None and res["ts"] == 0, res)
CALLS.clear()
W.handle_update(msg("/start", code="ru"))
check("бот видит выбор из приложения", "Привіт" in calls("sendMessage")[0]["text"])

print("9. Маршруты не сломаны")
check("/api/progress", W._route("/api/progress") == "progress")
check("/api/tts", W._route("/api/tts?text=a") == "tts")
check("/api/webhook", W._route("/api/webhook") == "webhook")
check("/api/lang", W._route("/api/lang") == "lang")

print()
print("ПРОВАЛЕНО: %d" % len(FAILS) if FAILS else "ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ")
sys.exit(1 if FAILS else 0)
