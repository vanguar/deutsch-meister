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
W._upstash_pipe = lambda cmds: None   # база пользователей — в test_bot_users.py

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
check("арабский помечен «пробная версия»", "تجريبية" in kb[2][0]["text"])

print("2. Арабский — пробная версия: сохраняется и открывает приложение на ar")
CALLS.clear()
W.handle_update(cb("lang:ar"))
rec = json.loads(REDIS.get("dm:lang:42", "null") or "null")
check("сохранено ar", rec and rec["lang"] == "ar", rec)
wel = calls("sendMessage")
check("приветствие по-арабски с пометкой о пробной версии", wel and "تجريبية" in wel[0]["text"] and "@ObiVan1978" in wel[0]["text"])
btn = wel[0]["reply_markup"]["inline_keyboard"][0][0]
check("кнопка открывает ar", lang_params(btn["web_app"]["url"])[0] == "ar")
check("донат без перевода — из ru", W.tr("ar", "donate") == W.tr("ru", "donate"))
REDIS.pop("dm:lang:42", None)

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
check("текст доната uk", "Підтримати German Morning" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update(cb("donate:100"))
inv = calls("sendInvoice")
check("инвойс uk", inv and inv[0]["title"] == "Підтримка German Morning" and inv[0]["prices"][0]["amount"] == 100)
CALLS.clear()
W.handle_update({"message": {"chat": {"id": 42}, "from": {"id": 42},
                             "successful_payment": {"total_amount": 100}}})
check("спасибо uk", "Дякуємо за підтримку" in calls("sendMessage")[0]["text"])
CALLS.clear()
W.handle_update({"pre_checkout_query": {"id": "p1"}})
check("pre_checkout отвечается", calls("answerPreCheckoutQuery") == [{"pre_checkout_query_id": "p1", "ok": True}])

print("5a. Крипто-донат в чате (ru и uk)")
TRC20 = ("TRC-20", "TRC20", "Tron", "TZ6rTYbF5Go94Q4f9uZwcVZ4g3oAnzwDHN", "TJJ63iThrWz4mLRNob5C5GezYsRwQtwmeg")


def no_trc20(s):
    return not any(t in s for t in TRC20)


for lang, uid, title in (("ru", 61, "Поддержать криптовалютой"), ("uk", 62, "Підтримати криптовалютою")):
    REDIS["dm:lang:%d" % uid] = json.dumps({"lang": lang, "ts": 1})
    CALLS.clear()
    W.handle_update(cb("donate", uid=uid))
    kb = calls("sendMessage")[0]["reply_markup"]["inline_keyboard"]
    datas = [b["callback_data"] for row in kb for b in row]
    check(f"[{lang}] Stars не изменились", datas[:4] == ["donate:50", "donate:100", "donate:250", "donate:500"], datas)
    check(f"[{lang}] кнопка «💎 Криптовалюта» → donate_crypto",
          kb[-1] == [{"text": "💎 Криптовалюта", "callback_data": "donate_crypto"}], kb[-1])
    check(f"[{lang}] меню доната без TRC-20", no_trc20(json.dumps(kb, ensure_ascii=False) + calls("sendMessage")[0]["text"]))
    CALLS.clear()
    W.handle_update(cb("donate_crypto", uid=uid))
    out = calls("sendMessage")
    text = out[0]["text"] if out else ""
    check(f"[{lang}] donate_crypto обработан", len(out) == 1 and calls("answerCallbackQuery")
          and out[0]["parse_mode"] == "HTML" and title in text, text[:80])
    check(f"[{lang}] есть ERC-20, TON, BTC", all(s in text for s in ("ERC-20", "TON", "BTC")))
    check(f"[{lang}] адреса в <code>", text.count("<code>") == 3 == len(W.CRYPTO_WALLETS))
    check(f"[{lang}] TRC-20 не показывается", no_trc20(text))
    check(f"[{lang}] инвойс не создаётся", not calls("sendInvoice"))
    CALLS.clear()
    W.handle_update(cb("donate:250", uid=uid))
    inv = calls("sendInvoice")
    check(f"[{lang}] Stars ⭐ 250 → инвойс", inv and inv[0]["currency"] == "XTR" and inv[0]["prices"][0]["amount"] == 250
          and inv[0]["payload"] == "donate_250" and "German Morning" in inv[0]["title"])

# адреса бота = адреса мини-аппа (js/support.js), ничего не придумано
import re  # noqa: E402
_sup = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js", "support.js"), encoding="utf-8").read()
_app = dict(re.findall(r"net: '([^']+)',\s*addr: '([^']+)'", _sup))
check("адреса совпадают с js/support.js",
      all(_app.get(net) == addr for _, _, net, addr in W.CRYPTO_WALLETS), [w[2] for w in W.CRYPTO_WALLETS])

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
check("/start donate без выбора, Telegram ar → текст доната из ru", "Поддержать" in calls("sendMessage")[0]["text"])


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
code, res = api({"initData": init_data(), "lang": "xx"})
check("неизвестный язык через API запрещён", code == 400)
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
