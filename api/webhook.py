"""
Единый Vercel-обработчик для Deutsch Meister (Python, только stdlib).

ВНИМАНИЕ: на этом проекте ВСЕ запросы /api/* приходят в этот файл
(api.webhook:handler — единая точка входа). Поэтому здесь реализован
диспетчер по пути:

  /api/webhook   — Telegram-бот (webhook)
  /api/tts       — прокси Google Translate TTS (mp3 + CORS) для звука
  /api/progress  — облачный прогресс (Upstash Redis, авторизация по initData)
  /api/lang      — язык интерфейса (ru/uk) <-> бот (Upstash Redis, initData)

ENV (Vercel → Project → Settings → Environment Variables):
  BOT_TOKEN                 — токен бота от @BotFather
  WEBHOOK_SECRET            — секрет вебхука (опционально)
  APP_URL                   — URL мини-аппа (по умолчанию GitHub Pages)
  UPSTASH_REDIS_REST_URL    — база Upstash Redis (или KV_REST_API_URL —
  UPSTASH_REDIS_REST_TOKEN    так их называет интеграция Vercel Marketplace)
  ADMIN_IDS                 — ID владельцев через запятую (команды /stats и др.)
  ADMIN_USERNAMES           — их @username через запятую (по умолчанию ObiVan1978)

База пользователей бота (Upstash): см. раздел «База пользователей» ниже.
Команда владельца: /stats — сводка и кнопки (список, CSV, уведомления, перенос).
"""

import os
import json
import hmac
import hashlib
import time
import urllib.parse
import urllib.request

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
APP_URL = os.environ.get("APP_URL", "https://vanguar.github.io/deutsch-meister/")
# Интеграция «Upstash for Redis» из Vercel Marketplace создаёт KV_REST_API_*,
# ручная настройка — UPSTASH_REDIS_REST_*. Берём то, что есть.
UPSTASH_URL = (os.environ.get("UPSTASH_REDIS_REST_URL")
               or os.environ.get("KV_REST_API_URL") or "").rstrip("/")
UPSTASH_TOK = (os.environ.get("UPSTASH_REDIS_REST_TOKEN")
               or os.environ.get("KV_REST_API_TOKEN") or "")

DONATE_TIERS = [50, 100, 250, 500]
# Крипто-кошельки — копия из js/support.js (DONATE.wallets), только
# подтверждённые. USDT TRC-20 не показываем, пока адрес не подтверждён.
# Совпадение адресов с js/support.js проверяет scripts/test_bot_lang.py.
CRYPTO_WALLETS = [
    ("💎", "USDT", "ERC-20 (Ethereum)", "0xf0e70cb55f38ad3Ca7ABCDD276A997092ecb7346"),
    ("💧", "TON", "The Open Network", "UQB0W1KEAR7RFQ03AIA872jw-2G2ntydiXlyhfTN8rAb2KN5"),
    ("🟡", "Bitcoin", "BTC", "bc1qq0rs5j43yh09tyvdynregg56c68d2yaz6ek8dx"),
]
API = "https://api.telegram.org/bot{}/{}"

# ══════════════════════════════════════════════════════
#  Telegram Bot
# ══════════════════════════════════════════════════════

def tg(method, payload):
    if not BOT_TOKEN:
        return {"ok": False, "error": "BOT_TOKEN not set"}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API.format(BOT_TOKEN, method),
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def _verdict(info):
    """Человекочитаемый диагноз для /api/webhook?probe=1.

    Порядок проверок — от корня к следствию: без токена бот не может даже
    спросить Telegram, поэтому токен первым.
    """
    if not info["env"]["bot_token"]:
        return "BOT_TOKEN не задан в окружении — бот не сможет ответить ни на что"
    if info.get("bot") is None:
        return ("BOT_TOKEN недействителен (%s) — скорее всего токен "
                "пересоздали в BotFather, а в окружении остался старый"
                % info.get("bot_error", "?"))
    wh = info.get("webhook") or {}
    if wh.get("error"):
        return "не удалось спросить Telegram о вебхуке: %s" % wh["error"]
    if not wh.get("url"):
        return ("вебхук НЕ зарегистрирован — Telegram некуда слать апдейты. "
                "Лечение: scripts/bot_doctor.sh")
    if not info["env"]["webhook_secret"]:
        return "WEBHOOK_SECRET не задан — проверка подписи Telegram отключена"
    if wh.get("last_error"):
        return "Telegram не может достучаться: %s" % wh["last_error"]
    return "всё на месте"


# ── Языки ─────────────────────────────────────────────
# ru — исходный, uk — полностью переведён, ar — в разработке (кнопка есть,
# но выбрать нельзя: показываем предупреждение).
LANGS = ("ru", "uk")
LANG_SOON = ("ar",)

T = {
    "ru": {
        "welcome": (
            "👋 <b>Привет, {name}!</b>\n\n"
            "Рад видеть тебя здесь — ты только что сделал отличный выбор! 🎉\n\n"
            "<b>🇩🇪 German Morning</b> — интерактивный курс немецкого от A1 до B2 "
            "прямо здесь, в Telegram.\n\n"
            "📚 68 уроков (A1 — 20, A2 — 20, B1 — 14, B2 — 14) · 🔊 озвучка · "
            "✏️ упражнения · 🃏 флэшкарты · 🔥 стрики\n\n"
            "📖 <b>Книги на немецком</b> — читалка с переводом каждого "
            "предложения, подсказками над словами и озвучкой. Список постоянно пополняется.\n\n"
            "Нажми кнопку ниже и поехали! 👇"
        ),
        "friend": "друг",
        "open": "🇩🇪 Открыть курс",
        "menu": "Курс",
        "donate_btn": "❤️ Поддержать проект",
        "lang_btn": "🌐 Язык",
        "donate": (
            "❤️ <b>Поддержать German Morning</b>\n\n"
            "Проект бесплатный и развивается на энтузиазме. Ваша поддержка "
            "звёздами помогает добавлять новые уроки, озвучку и книги. Спасибо! 🙏\n\n"
            "Выберите количество звёзд:"
        ),
        "crypto_btn": "💎 Криптовалюта",
        "crypto": (
            "💎 <b>Поддержать криптовалютой</b>\n\n"
            "Нажмите на адрес, чтобы скопировать его. Отправляйте только "
            "в указанной сети — перевод в другой сети может потеряться.\n\n"
            "{wallets}\n\n"
            "Спасибо за поддержку! 🙏"
        ),
        "invoice_title": "Поддержка German Morning",
        "invoice_desc": "Спасибо за поддержку проекта на {stars} ⭐!",
        "thanks": (
            "🎉 <b>Спасибо за поддержку!</b>\n\n"
            "Вы поддержали проект на {amount} ⭐. "
            "Это очень помогает развитию German Morning! ❤️"
        ),
        "lang_set": "✅ Язык: Русский",
        "cmd_start": "Открыть курс",
        "cmd_language": "Сменить язык",
        "cmd_donate": "Поддержать проект",
    },
    "uk": {
        "welcome": (
            "👋 <b>Привіт, {name}!</b>\n\n"
            "Радий бачити тебе тут — ти щойно зробив чудовий вибір! 🎉\n\n"
            "<b>🇩🇪 German Morning</b> — інтерактивний курс німецької від A1 до B2 "
            "просто тут, у Telegram.\n\n"
            "📚 68 уроків (A1 — 20, A2 — 20, B1 — 14, B2 — 14) · 🔊 озвучення · "
            "✏️ вправи · 🃏 флешкартки · 🔥 стрики\n\n"
            "📖 <b>Книжки німецькою</b> — читалка з перекладом кожного "
            "речення, підказками над словами та озвученням. Список постійно поповнюється.\n\n"
            "Натисни кнопку нижче — і вперед! 👇"
        ),
        "friend": "друже",
        "open": "🇩🇪 Відкрити курс",
        "menu": "Курс",
        "donate_btn": "❤️ Підтримати проєкт",
        "lang_btn": "🌐 Мова",
        "donate": (
            "❤️ <b>Підтримати German Morning</b>\n\n"
            "Проєкт безкоштовний і розвивається на ентузіазмі. Ваша підтримка "
            "зірками допомагає додавати нові уроки, озвучення та книжки. Дякуємо! 🙏\n\n"
            "Оберіть кількість зірок:"
        ),
        "crypto_btn": "💎 Криптовалюта",
        "crypto": (
            "💎 <b>Підтримати криптовалютою</b>\n\n"
            "Натисніть на адресу, щоб скопіювати її. Надсилайте тільки "
            "в зазначеній мережі — переказ в іншій мережі може загубитися.\n\n"
            "{wallets}\n\n"
            "Дякуємо за підтримку! 🙏"
        ),
        "invoice_title": "Підтримка German Morning",
        "invoice_desc": "Дякуємо за підтримку проєкту на {stars} ⭐!",
        "thanks": (
            "🎉 <b>Дякуємо за підтримку!</b>\n\n"
            "Ви підтримали проєкт на {amount} ⭐. "
            "Це дуже допомагає розвитку German Morning! ❤️"
        ),
        "lang_set": "✅ Мова: Українська",
        "cmd_start": "Відкрити курс",
        "cmd_language": "Змінити мову",
        "cmd_donate": "Підтримати проєкт",
    },
}

CHOOSE_TEXT = (
    "🌐 <b>Выберите язык · Оберіть мову · اختر اللغة</b>\n\n"
    "На этом языке будут переводы, объяснения и интерфейс курса.\n"
    "Цією мовою будуть переклади, пояснення та інтерфейс курсу."
)
AR_SOON_ALERT = (
    "🚧 العربية — قيد التطوير\n\n"
    "Арабский язык в разработке — скоро будет!\n"
    "Арабська мова в розробці — незабаром буде!"
)


def tr(lang, key, **kw):
    text = T.get(lang, T["ru"]).get(key) or T["ru"][key]
    return text.format(**kw) if kw else text


def default_lang(user):
    """Язык по умолчанию — из настроек Telegram (uk → uk), иначе ru."""
    code = str((user or {}).get("language_code") or "").lower()[:2]
    return "uk" if code == "uk" else "ru"


def read_lang(uid):
    """Сохранённый выбор: {"lang": "uk", "ts": <ms>} или None."""
    res = _upstash(["GET", f"dm:lang:{uid}"])
    if not res or res.get("result") in (None, "null"):
        return None
    try:
        rec = json.loads(res["result"])
    except (ValueError, TypeError):
        return None
    if isinstance(rec, dict) and rec.get("lang") in LANGS:
        return {"lang": rec["lang"], "ts": int(_num(rec.get("ts")))}
    return None


def write_lang(uid, lang, ts=None):
    """Last-write-wins: более старый ts не перетирает свежий выбор.
    Возвращает действующую запись или None, если хранилище недоступно."""
    if lang not in LANGS:
        return None
    ts = int(_num(ts) or time.time() * 1000)
    cur = read_lang(uid)
    if cur and cur["ts"] > ts:
        return cur
    rec = {"lang": lang, "ts": ts}
    res = _upstash(["SET", f"dm:lang:{uid}", json.dumps(rec)])
    return rec if res and res.get("result") == "OK" else None


def user_lang(user):
    """(lang, ts) пользователя: сохранённый выбор или язык Telegram (ts=0)."""
    rec = read_lang(user.get("id")) if user and user.get("id") else None
    if rec:
        return rec["lang"], rec["ts"]
    return default_lang(user), 0


def app_url(lang, ts):
    """Ссылка на мини-апп с выбранным языком. lts — время выбора: приложение
    сравнивает его со своим и не даёт старой кнопке перебить новый выбор."""
    sep = "&" if "?" in APP_URL else "?"
    return f"{APP_URL}{sep}lang={lang}&lts={int(ts)}"


def lang_kb():
    return {"inline_keyboard": [
        [{"text": "Русский", "callback_data": "lang:ru"}],
        [{"text": "🇺🇦 Українська", "callback_data": "lang:uk"}],
        [{"text": "🇸🇦 العربية · 🚧 в разработке", "callback_data": "lang:ar"}],
    ]}


def welcome_kb(lang, ts):
    return {"inline_keyboard": [
        [{"text": tr(lang, "open"), "web_app": {"url": app_url(lang, ts)}}],
        [{"text": tr(lang, "donate_btn"), "callback_data": "donate"}],
        [{"text": tr(lang, "lang_btn"), "callback_data": "lang"}],
    ]}


def donate_kb(lang="ru"):
    rows = [[{"text": f"⭐ {n}", "callback_data": f"donate:{n}"}] for n in DONATE_TIERS]
    rows.append([{"text": tr(lang, "crypto_btn"), "callback_data": "donate_crypto"}])
    return {"inline_keyboard": rows}


def set_menu_button(chat_id, lang, ts):
    """Кнопка меню чата тоже открывает приложение на выбранном языке."""
    return tg("setChatMenuButton", {
        "chat_id": chat_id,
        "menu_button": {
            "type": "web_app",
            "text": tr(lang, "menu"),
            "web_app": {"url": app_url(lang, ts)},
        },
    })


def set_commands(chat_id, lang, admin=False):
    """Меню команд «/» этого чата — на выбранном языке; владельцу — ещё /stats."""
    commands = [
        {"command": "start", "description": tr(lang, "cmd_start")},
        {"command": "language", "description": tr(lang, "cmd_language")},
        {"command": "donate", "description": tr(lang, "cmd_donate")},
    ]
    if admin:
        commands.append({"command": "stats", "description": "Пользователи бота (только для вас)"})
    return tg("setMyCommands", {
        "commands": commands,
        "scope": {"type": "chat", "chat_id": chat_id},
    })


def send_lang_choice(chat_id):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": CHOOSE_TEXT,
        "parse_mode": "HTML",
        "reply_markup": lang_kb(),
    })


def send_welcome(chat_id, first_name, lang, ts):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": tr(lang, "welcome", name=first_name or tr(lang, "friend")),
        "parse_mode": "HTML",
        "reply_markup": welcome_kb(lang, ts),
    })


def send_donate(chat_id, lang="ru"):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": tr(lang, "donate"),
        "parse_mode": "HTML",
        "reply_markup": donate_kb(lang),
    })


def crypto_text(lang="ru"):
    wallets = "\n\n".join(
        f"{icon} <b>{name}</b> · {net}\n<code>{addr}</code>"
        for icon, name, net, addr in CRYPTO_WALLETS
    )
    return tr(lang, "crypto", wallets=wallets)


def send_crypto(chat_id, lang="ru"):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": crypto_text(lang),
        "parse_mode": "HTML",
    })


def send_invoice(chat_id, stars, lang="ru"):
    tg("sendInvoice", {
        "chat_id": chat_id,
        "title": tr(lang, "invoice_title"),
        "description": tr(lang, "invoice_desc", stars=stars),
        "payload": f"donate_{stars}",
        "currency": "XTR",
        "prices": [{"label": f"{stars} Stars", "amount": stars}],
    })


# ══════════════════════════════════════════════════════
#  База пользователей (Upstash Redis)
#
#  Кто хоть раз написал боту, нажал в нём кнопку или открыл мини-апп
#  внутри Telegram, попадает сюда сразу:
#    dm:users           SET  — все ID
#    dm:users:joined    ZSET — ID → первый визит (мс): «новые за сутки/неделю»
#    dm:users:seen      ZSET — ID → последний визит (мс): «активные»
#    dm:users:blocked   SET  — заблокировали бота (апдейт my_chat_member)
#    dm:user:<ID>       HASH — id, first_name, last_name, username, tg_lang,
#                              first_seen, last_seen, via, last_via, source, status
#    dm:admins          SET  — чаты админов: им приходит «🆕 новый пользователь»
#    dm:admin:mute      SET  — админы, выключившие уведомления (кнопка 🔔 под /stats)
#
#  Админ — ID из ADMIN_IDS или @username из ADMIN_USERNAMES (env). Username
#  в апдейте подставляет сам Telegram, подделать его нельзя; ID надёжнее —
#  его бот показывает в /stats, чтобы можно было вписать в ADMIN_IDS.
# ══════════════════════════════════════════════════════

ADMIN_IDS = {s.strip() for s in os.environ.get("ADMIN_IDS", "").split(",") if s.strip()}
ADMIN_USERNAMES = {s.strip().lstrip("@").lower()
                   for s in os.environ.get("ADMIN_USERNAMES", "ObiVan1978").split(",") if s.strip()}
DAY_MS = 24 * 60 * 60 * 1000
USER_FIELDS = ("first_name", "last_name", "username")


def _now_ms():
    return int(time.time() * 1000)


def is_admin(user):
    if not user or not user.get("id"):
        return False
    if str(user["id"]) in ADMIN_IDS:
        return True
    return str(user.get("username") or "").lower() in ADMIN_USERNAMES


def _upstash_pipe(commands):
    """Несколько команд Redis одним запросом. Список {"result": …} или None."""
    if not UPSTASH_URL or not UPSTASH_TOK or not commands:
        return None
    req = urllib.request.Request(
        UPSTASH_URL + "/pipeline",
        data=json.dumps(commands).encode("utf-8"),
        headers={"Authorization": f"Bearer {UPSTASH_TOK}",
                 "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            res = json.loads(r.read().decode("utf-8"))
            return res if isinstance(res, list) else None
    except Exception:  # noqa: BLE001
        return None


def _results(res, n):
    """Результаты конвейера по порядку; при сбое — None на каждом месте."""
    if not res:
        return [None] * n
    return [(r or {}).get("result") if isinstance(r, dict) else None for r in res] + [None] * (n - len(res))


def _hash(flat):
    """HGETALL → dict (Upstash отдаёт плоский список [k, v, k, v, …])."""
    if isinstance(flat, dict):
        return flat
    if not isinstance(flat, list):
        return {}
    return {flat[i]: flat[i + 1] for i in range(0, len(flat) - 1, 2)}


def track_user(user, via, source=""):
    """Записать визит. via: "bot" | "app". True — если человек новый."""
    if not user or not user.get("id") or user.get("is_bot"):
        return False
    uid = str(user["id"])
    now = str(_now_ms())
    key = f"dm:user:{uid}"
    fields = ["id", uid, "tg_lang", str(user.get("language_code") or ""),
              "last_seen", now, "last_via", via, "status", "active"]
    for f in USER_FIELDS:
        fields += [f, str(user.get(f) or "")]
    cmds = [
        ["SADD", "dm:users", uid],
        ["HSET", key] + fields,
        ["HSETNX", key, "first_seen", now],
        ["HSETNX", key, "via", via],
        ["ZADD", "dm:users:joined", "NX", now, uid],
        ["ZADD", "dm:users:seen", now, uid],
        ["SREM", "dm:users:blocked", uid],
    ]
    if source:
        cmds.append(["HSETNX", key, "source", source[:64]])
    is_new = _results(_upstash_pipe(cmds), 1)[0] == 1
    if is_new:
        notify_admins_new(user, via, source)
    return is_new


def mark_blocked(user, blocked):
    """my_chat_member: человек заблокировал бота (kicked) или вернулся."""
    if not user or not user.get("id"):
        return
    uid = str(user["id"])
    if blocked:
        _upstash_pipe([["SADD", "dm:users:blocked", uid],
                       ["HSET", f"dm:user:{uid}", "status", "blocked", "blocked_at", str(_now_ms())]])
    else:
        track_user(user, "bot")


def _html(s):
    return str(s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _tz():
    try:
        from zoneinfo import ZoneInfo
        return ZoneInfo("Europe/Berlin")
    except Exception:  # noqa: BLE001 — нет tzdata в рантайме
        return None


def _fmt_ts(ms, with_year=False):
    import datetime
    try:
        ms = int(float(ms))
    except (TypeError, ValueError):
        return "—"
    tz = _tz()
    dt = datetime.datetime.fromtimestamp(ms / 1000, tz or datetime.timezone.utc)
    s = dt.strftime("%d.%m.%Y %H:%M" if with_year else "%d.%m %H:%M")
    return s if tz else s + " UTC"


VIA_RU = {"bot": "бот", "app": "мини-апп", "import": "перенесён"}


def user_line(u, lang=None, full=False):
    """Одна строка о пользователе для /stats и уведомлений (HTML)."""
    name = " ".join(x for x in (u.get("first_name"), u.get("last_name")) if x) or "без имени"
    parts = [f"<b>{_html(name)}</b>"]
    if u.get("username"):
        parts.append("@" + _html(u["username"]))
    parts.append(f"<code>{_html(u.get('id'))}</code>")
    tail = []
    if lang:
        tail.append(lang)
    elif u.get("tg_lang"):
        tail.append(_html(u["tg_lang"]))
    tail.append(VIA_RU.get(u.get("via"), _html(u.get("via") or "")))
    if u.get("source") and u.get("source") not in ("app", "import"):
        tail.append("/start " + _html(u["source"]))
    if u.get("status") == "blocked":
        tail.append("🚫 заблокировал бота")
    line = " · ".join(parts) + "\n    " + " · ".join(t for t in tail if t)
    if full:
        line = _fmt_ts(u.get("first_seen")) + " — " + line
    return line


def notify_admins_new(user, via, source=""):
    admins, muted, total = _results(_upstash_pipe([
        ["SMEMBERS", "dm:admins"], ["SMEMBERS", "dm:admin:mute"], ["SCARD", "dm:users"]]), 3)
    targets = [a for a in (admins or []) if a not in set(muted or [])]
    if not targets:
        return
    u = {"id": user.get("id"), "via": via, "source": source,
         "tg_lang": user.get("language_code") or ""}
    for f in USER_FIELDS:
        u[f] = user.get(f) or ""
    text = f"🆕 <b>Новый пользователь</b> (№{total or '?'})\n" + user_line(u)
    for chat in targets:
        chat = int(chat) if str(chat).lstrip("-").isdigit() else chat
        tg("sendMessage", {"chat_id": chat, "text": text, "parse_mode": "HTML",
                           "disable_notification": False})


def _users_by_ids(ids):
    """HGETALL для списка ID одним запросом."""
    if not ids:
        return []
    res = _results(_upstash_pipe([["HGETALL", f"dm:user:{i}"] for i in ids]), len(ids))
    out = []
    for i, flat in zip(ids, res):
        u = _hash(flat)
        u.setdefault("id", i)
        out.append(u)
    return out


def _app_langs(ids):
    """Язык интерфейса, выбранный в боте/приложении (dm:lang:<ID>)."""
    if not ids:
        return {}
    res = _results(_upstash_pipe([["GET", f"dm:lang:{i}"] for i in ids]), len(ids))
    out = {}
    for i, raw in zip(ids, res):
        try:
            rec = json.loads(raw) if raw else None
            if isinstance(rec, dict) and rec.get("lang"):
                out[i] = rec["lang"]
        except (TypeError, ValueError):
            pass
    return out


STATS_HELP = (
    "<b>Кнопки:</b>\n"
    "👥 — новые пользователи по дате прихода: имя, @username, язык, откуда пришёл\n"
    "📄 — все пользователи одним файлом для Excel\n"
    "🔔/🔕 — присылать ли мне сообщение о каждом новом пользователе\n"
    "📥 — один раз: добавить тех, кто пользовался ботом до появления базы"
)


def stats_kb(muted):
    """Инлайн-кнопки под /stats: вместо отдельных команд."""
    return {"inline_keyboard": [
        [{"text": "👥 Последние 20", "callback_data": "adm:users:20"},
         {"text": "👥 Последние 100", "callback_data": "adm:users:100"}],
        [{"text": "📄 Скачать всех (CSV)", "callback_data": "adm:export"}],
        [{"text": "🔔 Включить уведомления" if muted else "🔕 Выключить уведомления",
          "callback_data": "adm:notify:on" if muted else "adm:notify:off"}],
        [{"text": "📥 Перенести старых пользователей", "callback_data": "adm:import"}],
        [{"text": "🔄 Обновить", "callback_data": "adm:stats"}],
    ]}


BACK_KB = {"inline_keyboard": [[{"text": "⬅️ К статистике", "callback_data": "adm:stats"}]]}


def send_stats(chat_id, user, message_id=None, limit=10):
    """Сводка + кнопки. message_id — обновить это сообщение, а не слать новое."""
    now = _now_ms()
    total, d1, d7, d30, act1, act7, blocked, recent, muted = _results(_upstash_pipe([
        ["SADD", "dm:admins", str(chat_id)],   # кто смотрит /stats — получает уведомления
        ["SCARD", "dm:users"],
        ["ZCOUNT", "dm:users:joined", str(now - DAY_MS), "+inf"],
        ["ZCOUNT", "dm:users:joined", str(now - 7 * DAY_MS), "+inf"],
        ["ZCOUNT", "dm:users:joined", str(now - 30 * DAY_MS), "+inf"],
        ["ZCOUNT", "dm:users:seen", str(now - DAY_MS), "+inf"],
        ["ZCOUNT", "dm:users:seen", str(now - 7 * DAY_MS), "+inf"],
        ["SCARD", "dm:users:blocked"],
        ["ZREVRANGE", "dm:users:joined", "0", str(limit - 1)],
        ["SISMEMBER", "dm:admin:mute", str(chat_id)],
    ]), 10)[1:]
    if total is None:
        tg("sendMessage", {"chat_id": chat_id,
                           "text": "⚠️ База недоступна: в Vercel не подключён Upstash Redis "
                                   "(нет KV_REST_API_URL/TOKEN или UPSTASH_REDIS_REST_URL/TOKEN)."})
        return
    ids = [str(i) for i in (recent or [])]
    users = _users_by_ids(ids)
    langs = _app_langs(ids)
    lines = [
        "📊 <b>Пользователи бота</b>",
        f"Всего: <b>{total}</b>" + (f" · заблокировали бота: {blocked}" if blocked else ""),
        f"Новых: за сутки <b>{d1}</b> · за 7 дней <b>{d7}</b> · за 30 дней <b>{d30}</b>",
        f"Заходили: за сутки <b>{act1}</b> · за 7 дней <b>{act7}</b>",
        "Уведомления о новых: " + ("🔕 выключены" if muted else "🔔 включены"),
        "",
        f"<b>Последние {len(users)} новых</b> (время — Германия):" if users else "Пока никого нет.",
    ]
    lines += [user_line(u, langs.get(str(u.get("id"))), full=True) for u in users]
    lines += ["", STATS_HELP, "", f"Ваш ID: <code>{_html(user.get('id'))}</code>"]
    text = "\n".join(lines)[:4000]
    kb = stats_kb(bool(muted))
    if message_id:
        res = tg("editMessageText", {"chat_id": chat_id, "message_id": message_id, "text": text,
                                     "parse_mode": "HTML", "disable_web_page_preview": True,
                                     "reply_markup": kb})
        # «message is not modified» — данные не изменились, это не ошибка
        if res.get("ok") or "not modified" in str(res.get("description", "")):
            return
    tg("sendMessage", {"chat_id": chat_id, "text": text, "parse_mode": "HTML",
                       "disable_web_page_preview": True, "reply_markup": kb})


def _send_long(chat_id, text, reply_markup=None):
    """Telegram режет сообщения на 4096 символах — шлём кусками по строкам,
    кнопки — под последним куском."""
    chunks, chunk = [], ""
    for line in text.split("\n"):
        if len(chunk) + len(line) + 1 > 3900:
            chunks.append(chunk)
            chunk = ""
        chunk += line + "\n"
    if chunk.strip():
        chunks.append(chunk)
    for i, c in enumerate(chunks):
        payload = {"chat_id": chat_id, "text": c, "parse_mode": "HTML",
                   "disable_web_page_preview": True}
        if reply_markup and i == len(chunks) - 1:
            payload["reply_markup"] = reply_markup
        tg("sendMessage", payload)


def send_users(chat_id, limit):
    ids = _results(_upstash_pipe([["ZREVRANGE", "dm:users:joined", "0", str(limit - 1)]]), 1)[0] or []
    ids = [str(i) for i in ids]
    users = _users_by_ids(ids)
    langs = _app_langs(ids)
    head = (f"👥 <b>Последние {len(users)} новых пользователей</b> (время — Германия):"
            if users else "👥 Пока никого нет.")
    _send_long(chat_id, "\n".join([head] + [user_line(u, langs.get(str(u.get("id"))), full=True)
                                             for u in users]), BACK_KB)


def tg_upload(method, fields, file_field, filename, content, ctype="text/csv"):
    """multipart/form-data для sendDocument (только stdlib)."""
    if not BOT_TOKEN:
        return {"ok": False}
    boundary = "dm" + hashlib.sha1(str(time.time()).encode()).hexdigest()
    body = b""
    for k, v in fields.items():
        body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n").encode("utf-8")
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{file_field}\"; "
             f"filename=\"{filename}\"\r\nContent-Type: {ctype}\r\n\r\n").encode("utf-8")
    body += content + f"\r\n--{boundary}--\r\n".encode("utf-8")
    req = urllib.request.Request(API.format(BOT_TOKEN, method), data=body,
                                 headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def users_csv():
    import csv
    import io
    ids = _results(_upstash_pipe([["ZRANGE", "dm:users:joined", "0", "-1"]]), 1)[0] or []
    ids = [str(i) for i in ids]
    users, langs = [], {}
    for k in range(0, len(ids), 200):
        part = ids[k:k + 200]
        users += _users_by_ids(part)
        langs.update(_app_langs(part))
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=";")
    w.writerow(["id", "username", "first_name", "last_name", "tg_lang", "app_lang",
                "first_seen", "last_seen", "via", "source", "status"])
    for u in users:
        uid = str(u.get("id"))
        w.writerow([uid, u.get("username", ""), u.get("first_name", ""), u.get("last_name", ""),
                    u.get("tg_lang", ""), langs.get(uid, ""),
                    _fmt_ts(u.get("first_seen"), True), _fmt_ts(u.get("last_seen"), True),
                    u.get("via", ""), u.get("source", ""), u.get("status", "")])
    # BOM — чтобы Excel открыл кириллицу правильно
    return ("﻿" + buf.getvalue()).encode("utf-8"), len(users)


def send_export(chat_id):
    data, n = users_csv()
    stamp = time.strftime("%Y-%m-%d")
    res = tg_upload("sendDocument", {"chat_id": str(chat_id), "caption": f"Пользователи бота: {n}"},
                    "document", f"deutsch-meister-users-{stamp}.csv", data)
    if not res.get("ok"):
        tg("sendMessage", {"chat_id": chat_id, "text": "⚠️ Не удалось отправить файл: "
                           + str(res.get("description") or res.get("error") or "")})


def _scan_ids(pattern):
    """Все ID из ключей вида dm:lang:<ID> (SCAN, без KEYS)."""
    ids, cursor = set(), "0"
    for _ in range(1000):
        res = _upstash(["SCAN", cursor, "MATCH", pattern, "COUNT", "500"])
        if not res or not isinstance(res.get("result"), list):
            break
        cursor, keys = res["result"][0], res["result"][1]
        for k in keys:
            tail = str(k).rsplit(":", 1)[-1]
            if tail.isdigit():
                ids.add(tail)
        if str(cursor) == "0":
            break
    return ids


def import_old_users(chat_id):
    """Одноразовый перенос: всех, кто уже оставил след в базе (язык, прогресс),
    добавить в dm:users. Имена и username — через getChat (личный чат с ботом)."""
    started = time.time()
    known = set(str(i) for i in (_results(_upstash_pipe([["SMEMBERS", "dm:users"]]), 1)[0] or []))
    lang_ids = _scan_ids("dm:lang:*")
    found = (lang_ids | _scan_ids("dm:progress:*")) - known
    langs = _app_langs(sorted(lang_ids & found))
    added, unnamed, left = 0, 0, 0
    for uid in sorted(found):
        if time.time() - started > 240:   # запас до лимита функции Vercel
            left += 1
            continue
        info = tg("getChat", {"chat_id": int(uid)})
        chat = (info.get("result") or {}) if info.get("ok") else {}
        if not chat:
            unnamed += 1
        ts = None
        raw = _results(_upstash_pipe([["GET", f"dm:lang:{uid}"]]), 1)[0] if uid in langs else None
        try:
            ts = int(json.loads(raw).get("ts") or 0) if raw else None
        except (TypeError, ValueError, AttributeError):
            ts = None
        first = str(ts or _now_ms())
        fields = ["id", uid, "first_seen", first, "last_seen", first, "via", "import",
                  "last_via", "import", "source", "import", "status", "active"]
        for f in USER_FIELDS:
            fields += [f, str(chat.get(f) or "")]
        _upstash_pipe([["SADD", "dm:users", uid], ["HSET", f"dm:user:{uid}"] + fields,
                       ["ZADD", "dm:users:joined", "NX", first, uid],
                       ["ZADD", "dm:users:seen", "NX", first, uid]])
        added += 1
    hook = enable_member_updates()
    text = (f"📥 Перенос завершён: добавлено <b>{added}</b>"
            + (f" (без имени: {unnamed} — заблокировали бота или скрыли профиль)" if unnamed else "")
            + (f"\n⏳ Не успел: {left} — нажмите «📥 Перенести» ещё раз" if left else "")
            + f"\nУже были в базе: {len(known)}"
            + ("\n🔔 Бот теперь узнаёт, кто его заблокировал." if hook else ""))
    tg("sendMessage", {"chat_id": chat_id, "text": text, "parse_mode": "HTML"})


def enable_member_updates():
    """Добавить my_chat_member в allowed_updates вебхука (URL и секрет — прежние)."""
    info = tg("getWebhookInfo", {})
    r = (info.get("result") or {}) if info.get("ok") else {}
    url = r.get("url")
    if not url:
        return False
    want = ["message", "callback_query", "pre_checkout_query", "my_chat_member"]
    if set(want) <= set(r.get("allowed_updates") or []):
        return True
    payload = {"url": url, "allowed_updates": want}
    if WEBHOOK_SECRET:
        payload["secret_token"] = WEBHOOK_SECRET
    return bool(tg("setWebhook", payload).get("ok"))


def handle_admin(cmd, text, chat_id, user):
    """Команда владельца — одна: /stats. Остальное — кнопками под ней."""
    if cmd != "/stats":
        return False
    set_commands(chat_id, user_lang(user)[0], admin=True)
    send_stats(chat_id, user)
    return True


def handle_admin_callback(cq, user):
    """Кнопки под /stats (callback_data «adm:…»)."""
    data = cq.get("data", "")
    chat_id = cq["message"]["chat"]["id"]
    message_id = cq["message"].get("message_id")
    if not is_admin(user):
        tg("answerCallbackQuery", {"callback_query_id": cq["id"],
                                   "text": "Эта кнопка только для владельца бота.", "show_alert": True})
        return
    parts = data.split(":")
    action = parts[1] if len(parts) > 1 else ""
    hint = {"users": "Собираю список…", "export": "Готовлю файл…",
            "import": "Переношу старых пользователей…"}.get(action, "")
    tg("answerCallbackQuery", {"callback_query_id": cq["id"], "text": hint})
    if action == "stats":
        send_stats(chat_id, user, message_id)
    elif action == "users":
        try:
            n = int(parts[2])
        except (IndexError, ValueError):
            n = 20
        send_users(chat_id, max(1, min(n, 300)))
    elif action == "export":
        send_export(chat_id)
    elif action == "notify":
        off = len(parts) > 2 and parts[2] == "off"
        _upstash_pipe([["SADD", "dm:admins", str(chat_id)],
                       ["SADD" if off else "SREM", "dm:admin:mute", str(chat_id)]])
        send_stats(chat_id, user, message_id)   # кнопка сама покажет новое состояние
    elif action == "import":
        import_old_users(chat_id)


def handle_update(update):
    # Платёжный путь — строго первым: Telegram даёт на pre_checkout_query
    # 10 секунд, иначе платёж отменяется. Никакой код не должен стоять раньше.
    if "pre_checkout_query" in update:
        pcq = update["pre_checkout_query"]
        tg("answerPreCheckoutQuery", {"pre_checkout_query_id": pcq["id"], "ok": True})
        return

    if "message" in update and "successful_payment" in update["message"]:
        msg = update["message"]
        amount = msg["successful_payment"]["total_amount"]
        lang, _ = user_lang(msg.get("from") or {})
        tg("sendMessage", {
            "chat_id": msg["chat"]["id"],
            "parse_mode": "HTML",
            "text": tr(lang, "thanks", amount=amount),
        })
        return

    # Заблокировал бота или вернулся (нужен my_chat_member в allowed_updates)
    if "my_chat_member" in update:
        mcm = update["my_chat_member"]
        if (mcm.get("chat") or {}).get("type") == "private":
            status = (mcm.get("new_chat_member") or {}).get("status")
            mark_blocked(mcm.get("from") or {}, status in ("kicked", "left"))
        return

    if "message" in update:
        msg = update["message"]
        text = (msg.get("text") or "").strip()
        chat_id = msg["chat"]["id"]
        user = msg.get("from") or {}
        first_name = user.get("first_name", "")
        cmd = text.split()[0].split("@")[0] if text else ""
        if (msg.get("chat") or {}).get("type") == "private":
            # source — откуда пришёл: параметр /start (t.me/бот?start=…) или просто «start»
            src = (text[len("/start"):].strip() or "start") if text.startswith("/start") else ""
            track_user(user, "bot", src)
        if is_admin(user) and handle_admin(cmd, text, chat_id, user):
            return
        if text.startswith("/start"):
            arg = text[len("/start"):].strip()
            rec = read_lang(user.get("id")) if user.get("id") else None
            if arg == "donate":
                send_donate(chat_id, rec["lang"] if rec else default_lang(user))
            elif rec:
                send_welcome(chat_id, first_name, rec["lang"], rec["ts"])
            else:
                # Язык ещё не выбран — сначала выбор, потом приветствие
                send_lang_choice(chat_id)
        elif text.startswith("/donate"):
            send_donate(chat_id, user_lang(user)[0])
        elif cmd in ("/language", "/lang", "/mova", "/yazyk"):
            send_lang_choice(chat_id)
        return

    if "callback_query" in update:
        cq = update["callback_query"]
        data = cq.get("data", "")
        user = cq.get("from") or {}
        chat_id = cq["message"]["chat"]["id"]
        track_user(user, "bot")

        if data.startswith("adm:"):
            handle_admin_callback(cq, user)
            return

        if data.startswith("lang:") and data[5:] in LANG_SOON:
            tg("answerCallbackQuery", {"callback_query_id": cq["id"],
                                       "text": AR_SOON_ALERT, "show_alert": True})
            return

        if data.startswith("lang:") and data[5:] in LANGS:
            lang = data[5:]
            rec = write_lang(user.get("id"), lang) if user.get("id") else None
            # хранилище недоступно — всё равно открываем на выбранном языке
            ts = rec["ts"] if rec else int(time.time() * 1000)
            lang = rec["lang"] if rec else lang
            tg("answerCallbackQuery", {"callback_query_id": cq["id"],
                                       "text": tr(lang, "lang_set")})
            set_menu_button(chat_id, lang, ts)
            set_commands(chat_id, lang, admin=is_admin(user))
            send_welcome(chat_id, user.get("first_name", ""), lang, ts)
            return

        tg("answerCallbackQuery", {"callback_query_id": cq["id"]})
        lang = user_lang(user)[0]
        if data == "lang":
            send_lang_choice(chat_id)
        elif data == "donate":
            send_donate(chat_id, lang)
        elif data == "donate_crypto":
            send_crypto(chat_id, lang)
        elif data.startswith("donate:"):
            try:
                send_invoice(chat_id, int(data.split(":", 1)[1]), lang)
            except ValueError:
                pass
        return


# ══════════════════════════════════════════════════════
#  TTS-прокси (Google Translate TTS -> mp3 + CORS)
# ══════════════════════════════════════════════════════

GOOGLE_TTS = "https://translate.google.com/translate_tts"               # client=tw-ob
GOOGLE_TTS_FALLBACK = "https://translate.googleapis.com/translate_tts"  # client=gtx
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


def _fetch_tts_once(base_url, client, text, tl):
    """Возвращает (audio_bytes, content_type) или (None, error_str)."""
    url = base_url + "?" + urllib.parse.urlencode({
        "ie": "UTF-8", "client": client, "tl": tl, "q": text[:200],
    })
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Referer": "https://translate.google.com/",
    })
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.read(), r.headers.get("Content-Type", "audio/mpeg")
    except Exception as e:  # noqa: BLE001
        return None, str(e)


def fetch_tts(text, tl="de"):
    """Возвращает (audio_bytes, content_type, source) или (None, error_str, None).

    source: 'google' (translate.google.com, client=tw-ob) или
    'fallback' (translate.googleapis.com, client=gtx). Запасной источник
    пробуем при не-200 / пустом теле / не-audio content-type основного.
    """
    audio, ct = _fetch_tts_once(GOOGLE_TTS, "tw-ob", text, tl)
    if audio and str(ct).startswith("audio"):
        return audio, ct, "google"
    err1 = ct if audio is None else "bad response: %s, %d bytes" % (ct, len(audio))

    audio, ct = _fetch_tts_once(GOOGLE_TTS_FALLBACK, "gtx", text, tl)
    if audio and str(ct).startswith("audio"):
        return audio, ct, "fallback"
    err2 = ct if audio is None else "bad response: %s, %d bytes" % (ct, len(audio))

    return None, "google: %s; fallback: %s" % (err1, err2), None


# ══════════════════════════════════════════════════════
#  Облачный прогресс (Upstash Redis + проверка initData)
# ══════════════════════════════════════════════════════

MAX_AUTH_AGE = 24 * 60 * 60


def verify_init_data(init_data, bot_token, max_age=MAX_AUTH_AGE):
    if not init_data or not bot_token:
        return None
    data = dict(urllib.parse.parse_qsl(init_data, keep_blank_values=True))
    received_hash = data.pop("hash", None)
    if not received_hash:
        return None
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    calc_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(calc_hash, received_hash):
        return None
    try:
        auth_date = int(data.get("auth_date", "0"))
        if max_age and auth_date and (time.time() - auth_date) > max_age:
            return None
    except ValueError:
        return None
    try:
        return json.loads(data.get("user", "null"))
    except (ValueError, TypeError):
        return None


def _upstash(command):
    if not UPSTASH_URL or not UPSTASH_TOK:
        return None
    req = urllib.request.Request(
        UPSTASH_URL,
        data=json.dumps(command).encode("utf-8"),
        headers={"Authorization": f"Bearer {UPSTASH_TOK}",
                 "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception:  # noqa: BLE001
        return None


def read_progress(uid):
    res = _upstash(["GET", f"dm:progress:{uid}"])
    if not res or res.get("result") in (None, "null"):
        return None
    try:
        return json.loads(res["result"])
    except (ValueError, TypeError):
        return None


def _num(v):
    try:
        return float(v)
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
    """n — максимум, seen — объединение форм, «known» побеждает «new»."""
    rec = dict(old)
    rec.update(new)                      # словарные поля одинаковы
    rec["n"] = max(_num(old.get("n")), _num(new.get("n")))
    if rec["n"] == int(rec["n"]):
        rec["n"] = int(rec["n"])
    rec["ts"] = max(_num(old.get("ts")), _num(new.get("ts")))
    if rec["ts"] == int(rec["ts"]):
        rec["ts"] = int(rec["ts"])
    rec["status"] = ("known"
                     if "known" in (old.get("status"), new.get("status"))
                     else (new.get("status") or old.get("status") or "new"))
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
    """Узкая ветка для поля books: остальной снимок перезаписывается входящим,
    а сборники слов и позиции сливаются, чтобы не терять чтение с других
    устройств. Снимок старого клиента (без books) ничего не стирает."""
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


def write_progress(uid, data):
    # Всё, кроме books, перезаписывается входящим снимком — как и раньше.
    # books сливаем с сохранённым: иначе клиент без этого поля (старая версия)
    # или с частичными данными стёр бы чтение, накопленное на другом устройстве.
    if isinstance(data, dict):
        stored = read_progress(uid)
        if isinstance(stored, dict) and (stored.get("books") or data.get("books")):
            data = dict(data)
            merged = _merge_books(stored.get("books"), data.get("books"))
            if merged:
                data["books"] = merged
            else:
                data.pop("books", None)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    res = _upstash(["SET", f"dm:progress:{uid}", payload])
    return bool(res and res.get("result") == "OK")


# ══════════════════════════════════════════════════════
#  Vercel handler + диспетчер по пути
# ══════════════════════════════════════════════════════
from http.server import BaseHTTPRequestHandler  # noqa: E402


def _route(path):
    p = urllib.parse.urlparse(path).path
    if p.endswith("/tts"):
        return "tts"
    if p.endswith("/progress"):
        return "progress"
    if p.endswith("/lang"):
        return "lang"
    return "webhook"


class handler(BaseHTTPRequestHandler):
    # ── helpers ──
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _text(self, body=b"ok", code=200, ctype="text/plain; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.end_headers()
        self.wfile.write(body)

    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _query(self):
        return urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)

    # ── OPTIONS (CORS preflight для tts/progress) ──
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    # ── GET ──
    def do_GET(self):
        route = _route(self.path)

        if route == "tts":
            q = self._query()
            text = (q.get("text") or q.get("q") or [""])[0]
            tl = (q.get("tl") or ["de"])[0]
            if not text:
                self.send_response(400)
                self._cors()
                self.end_headers()
                self.wfile.write(b"missing text")
                return
            audio, ct, source = fetch_tts(text, tl)
            if audio is None:
                self.send_response(502)
                self._cors()
                self.end_headers()
                self.wfile.write(("tts error: " + str(ct)).encode("utf-8"))
                return
            self.send_response(200)
            self.send_header("Content-Type", ct)
            self.send_header("Content-Length", str(len(audio)))
            self.send_header("X-TTS-Source", source)
            self._cors()
            self.send_header("Cache-Control", "public, max-age=604800, immutable")
            self.end_headers()
            self.wfile.write(audio)
            return

        if route == "progress":
            self._json({"ok": True, "service": "progress"})
            return

        if route == "lang":
            self._json({"ok": True, "service": "lang", "langs": list(LANGS)})
            return

        # webhook health-check (+ диагностика маршрутизации и конфигурации)
        #
        # Зачем env: снаружи мёртвый BOT_TOKEN неотличим от рабочего. Health
        # отдаёт 200, POST от Telegram отдаёт 200 — а бот молчит, потому что
        # tg() сразу возвращает {"error": "BOT_TOKEN not set"} и до Telegram
        # даже не доходит. Через `vercel env pull` этого тоже не видно:
        # переменные помечены Sensitive и приезжают пустыми всегда.
        info = {
            "ok": True,
            "service": "webhook",
            "build": "dispatch-4-i18n",
            "seen_path": self.path,
            "route": route,
            "env": {
                "redis": bool(UPSTASH_URL and UPSTASH_TOK),
                "bot_token": bool(BOT_TOKEN),
                "webhook_secret": bool(WEBHOOK_SECRET),
                "app_url": bool(os.environ.get("APP_URL")),
            },
        }

        # ?probe=1 — живой опрос Telegram: валиден ли токен и куда, по мнению
        # Telegram, слать апдейты. Секретов в ответе нет: @username бота
        # публичен, getWebhookInfo secret_token не возвращает никогда.
        #
        # Пересоздание токена в BotFather УДАЛЯЕТ вебхук. Поэтому пустой
        # webhook.url почти всегда значит: токен сменили, а в окружении
        # остался старый. Проверять эти две вещи надо вместе.
        if (self._query().get("probe") or [""])[0] == "1":
            me = tg("getMe", {})
            if me.get("ok"):
                info["bot"] = "@" + (me.get("result") or {}).get("username", "")
            else:
                info["bot"] = None
                info["bot_error"] = str(
                    me.get("error") or me.get("description") or "unknown"
                )

            wh = tg("getWebhookInfo", {})
            if wh.get("ok"):
                r = wh.get("result") or {}
                info["webhook"] = {
                    "url": r.get("url", ""),
                    "pending": r.get("pending_update_count", 0),
                    "last_error": r.get("last_error_message", ""),
                }
            else:
                info["webhook"] = {"error": str(
                    wh.get("error") or wh.get("description") or "unknown"
                )}

            info["verdict"] = _verdict(info)

        self._json(info)

    # ── POST ──
    def do_POST(self):
        route = _route(self.path)

        if route == "progress":
            try:
                length = int(self.headers.get("content-length", 0) or 0)
                raw = self.rfile.read(length) if length else b"{}"
                body = json.loads(raw.decode("utf-8"))
            except Exception:  # noqa: BLE001
                self._json({"ok": False, "error": "bad_request"}, 400)
                return
            user = verify_init_data(body.get("initData", ""), BOT_TOKEN)
            if not user or not user.get("id"):
                self._json({"ok": False, "error": "unauthorized"}, 401)
                return
            uid = user["id"]
            if "data" in body and body["data"] is not None:
                ok = write_progress(uid, body["data"])
                self._json({"ok": ok, "saved": ok, "data": body["data"]})
            else:
                # чтение = открытие мини-аппа в Telegram: отмечаем визит
                track_user(user, "app", "app")
                self._json({"ok": True, "data": read_progress(uid)})
            return

        if route == "lang":
            # Язык приложения <-> бот. Без lang — чтение, с lang — запись
            # (last-write-wins по ts) + обновление кнопки меню чата.
            try:
                length = int(self.headers.get("content-length", 0) or 0)
                raw = self.rfile.read(length) if length else b"{}"
                body = json.loads(raw.decode("utf-8"))
            except Exception:  # noqa: BLE001
                self._json({"ok": False, "error": "bad_request"}, 400)
                return
            user = verify_init_data(body.get("initData", ""), BOT_TOKEN)
            if not user or not user.get("id"):
                self._json({"ok": False, "error": "unauthorized"}, 401)
                return
            uid = user["id"]
            lang = body.get("lang")
            if lang is None:
                track_user(user, "app", "app")
                rec = read_lang(uid)
                self._json({"ok": True, "lang": rec and rec["lang"],
                            "ts": rec["ts"] if rec else 0})
                return
            if lang not in LANGS:
                self._json({"ok": False, "error": "bad_lang"}, 400)
                return
            rec = write_lang(uid, lang, body.get("ts"))
            if rec:
                # личный чат с ботом: chat_id == user_id
                set_menu_button(uid, rec["lang"], rec["ts"])
            self._json({"ok": bool(rec), "lang": rec and rec["lang"],
                        "ts": rec["ts"] if rec else 0})
            return

        # webhook (Telegram update)
        if WEBHOOK_SECRET:
            got = self.headers.get("X-Telegram-Bot-Api-Secret-Token", "")
            if got != WEBHOOK_SECRET:
                self._text(b"forbidden", 403)
                return
        try:
            length = int(self.headers.get("content-length", 0) or 0)
            raw = self.rfile.read(length) if length else b"{}"
            update = json.loads(raw.decode("utf-8"))
            handle_update(update)
        except Exception:  # noqa: BLE001
            pass
        self._text(b"ok")
