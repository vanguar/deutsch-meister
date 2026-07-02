"""
Единый Vercel-обработчик для Deutsch Meister (Python, только stdlib).

ВНИМАНИЕ: на этом проекте ВСЕ запросы /api/* приходят в этот файл
(api.webhook:handler — единая точка входа). Поэтому здесь реализован
диспетчер по пути:

  /api/webhook   — Telegram-бот (webhook)
  /api/tts       — прокси Google Translate TTS (mp3 + CORS) для звука
  /api/progress  — облачный прогресс (Upstash Redis, авторизация по initData)

ENV (Vercel → Project → Settings → Environment Variables):
  BOT_TOKEN                 — токен бота от @BotFather
  WEBHOOK_SECRET            — секрет вебхука (опционально)
  APP_URL                   — URL мини-аппа (по умолчанию GitHub Pages)
  UPSTASH_REDIS_REST_URL    — для /api/progress (интеграция Upstash)
  UPSTASH_REDIS_REST_TOKEN  — для /api/progress
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
UPSTASH_URL = os.environ.get("UPSTASH_REDIS_REST_URL", "").rstrip("/")
UPSTASH_TOK = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "")

DONATE_TIERS = [50, 100, 250, 500]
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


def welcome_text(first_name):
    return (
        f"👋 <b>Привет, {first_name}!</b>\n\n"
        f"Рад видеть тебя здесь — ты только что сделал отличный выбор! 🎉\n\n"
        f"<b>🇩🇪 Deutsch Meister</b> — интерактивный курс немецкого от нуля до B2, "
        f"прямо здесь в Telegram.\n\n"
        f"📚 32 урока · 🔊 озвучка · ✏️ упражнения · 🃏 флэшкарты · 🔥 стрики\n\n"
        f"Нажми кнопку ниже и поехали! 👇"
    )


def welcome_kb():
    return {"inline_keyboard": [
        [{"text": "🇩🇪 Открыть курс", "web_app": {"url": APP_URL}}],
        [{"text": "❤️ Поддержать проект", "callback_data": "donate"}],
    ]}


def donate_kb():
    return {"inline_keyboard": [
        [{"text": f"⭐ {n}", "callback_data": f"donate:{n}"}] for n in DONATE_TIERS
    ]}


def send_welcome(chat_id, first_name):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": welcome_text(first_name),
        "parse_mode": "HTML",
        "reply_markup": welcome_kb(),
    })


def send_donate(chat_id):
    tg("sendMessage", {
        "chat_id": chat_id,
        "text": (
            "❤️ <b>Поддержать Deutsch Meister</b>\n\n"
            "Проект бесплатный и развивается на энтузиазме. Ваша поддержка "
            "звёздами помогает добавлять новые уроки, озвучку и книги. Спасибо! 🙏\n\n"
            "Выберите количество звёзд:"
        ),
        "parse_mode": "HTML",
        "reply_markup": donate_kb(),
    })


def send_invoice(chat_id, stars):
    tg("sendInvoice", {
        "chat_id": chat_id,
        "title": "Поддержка Deutsch Meister",
        "description": f"Спасибо за поддержку проекта на {stars} ⭐!",
        "payload": f"donate_{stars}",
        "currency": "XTR",
        "prices": [{"label": f"{stars} Stars", "amount": stars}],
    })


def handle_update(update):
    if "message" in update and "successful_payment" in update["message"]:
        msg = update["message"]
        amount = msg["successful_payment"]["total_amount"]
        tg("sendMessage", {
            "chat_id": msg["chat"]["id"],
            "parse_mode": "HTML",
            "text": (
                f"🎉 <b>Спасибо за поддержку!</b>\n\n"
                f"Вы поддержали проект на {amount} ⭐. "
                f"Это очень помогает развитию Deutsch Meister! ❤️"
            ),
        })
        return

    if "message" in update:
        msg = update["message"]
        text = (msg.get("text") or "").strip()
        chat_id = msg["chat"]["id"]
        first_name = msg.get("from", {}).get("first_name", "друг")
        if text.startswith("/start"):
            arg = text[len("/start"):].strip()
            if arg == "donate":
                send_donate(chat_id)
            else:
                send_welcome(chat_id, first_name)
        elif text.startswith("/donate"):
            send_donate(chat_id)
        return

    if "callback_query" in update:
        cq = update["callback_query"]
        data = cq.get("data", "")
        tg("answerCallbackQuery", {"callback_query_id": cq["id"]})
        chat_id = cq["message"]["chat"]["id"]
        if data == "donate":
            send_donate(chat_id)
        elif data.startswith("donate:"):
            try:
                send_invoice(chat_id, int(data.split(":", 1)[1]))
            except ValueError:
                pass
        return

    if "pre_checkout_query" in update:
        pcq = update["pre_checkout_query"]
        tg("answerPreCheckoutQuery", {"pre_checkout_query_id": pcq["id"], "ok": True})
        return


# ══════════════════════════════════════════════════════
#  TTS-прокси (Google Translate TTS -> mp3 + CORS)
# ══════════════════════════════════════════════════════

GOOGLE_TTS = "https://translate.google.com/translate_tts"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


def fetch_tts(text, tl="de"):
    """Возвращает (audio_bytes, content_type) или (None, error_str)."""
    url = GOOGLE_TTS + "?" + urllib.parse.urlencode({
        "ie": "UTF-8", "client": "tw-ob", "tl": tl, "q": text[:200],
    })
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Referer": "https://translate.google.com/",
    })
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.read(), r.headers.get("Content-Type", "audio/mpeg")
    except Exception as e:  # noqa: BLE001
        return None, str(e)


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


def write_progress(uid, data):
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
            audio, ct = fetch_tts(text, tl)
            if audio is None:
                self.send_response(502)
                self._cors()
                self.end_headers()
                self.wfile.write(("tts error: " + str(ct)).encode("utf-8"))
                return
            self.send_response(200)
            self.send_header("Content-Type", ct)
            self.send_header("Content-Length", str(len(audio)))
            self._cors()
            self.send_header("Cache-Control", "public, max-age=604800, immutable")
            self.end_headers()
            self.wfile.write(audio)
            return

        if route == "progress":
            self._json({"ok": True, "service": "progress"})
            return

        # webhook health-check (+ диагностика маршрутизации)
        self._json({
            "ok": True,
            "service": "webhook",
            "build": "dispatch-2",
            "seen_path": self.path,
            "route": route,
        })

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
                self._json({"ok": True, "data": read_progress(uid)})
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
