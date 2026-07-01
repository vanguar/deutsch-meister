"""
Telegram webhook для Deutsch Meister (Vercel serverless, Python, только stdlib).

ENV (задать в настройках Vercel → Project → Settings → Environment Variables):
  BOT_TOKEN       — токен бота от @BotFather (обязательно)
  WEBHOOK_SECRET  — произвольная строка-секрет (рекомендуется)
  APP_URL         — URL мини-аппа (по умолчанию GitHub Pages)

Эндпоинт после деплоя: https://<project>.vercel.app/api/webhook
"""

import os
import json
import urllib.request

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
APP_URL = os.environ.get("APP_URL", "https://vanguar.github.io/deutsch-meister/")

# Варианты поддержки звёздами (валюта XTR)
DONATE_TIERS = [50, 100, 250, 500]

API = "https://api.telegram.org/bot{}/{}"


def tg(method, payload):
    """Вызов Telegram Bot API."""
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
    # Telegram Stars: currency = XTR, provider_token не нужен
    tg("sendInvoice", {
        "chat_id": chat_id,
        "title": "Поддержка Deutsch Meister",
        "description": f"Спасибо за поддержку проекта на {stars} ⭐!",
        "payload": f"donate_{stars}",
        "currency": "XTR",
        "prices": [{"label": f"{stars} Stars", "amount": stars}],
    })


def handle_update(update):
    # Успешная оплата
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

    # Обычные сообщения / команды
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

    # Нажатия на inline-кнопки
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

    # Подтверждение оплаты (обязательно ответить за 10 сек)
    if "pre_checkout_query" in update:
        pcq = update["pre_checkout_query"]
        tg("answerPreCheckoutQuery", {"pre_checkout_query_id": pcq["id"], "ok": True})
        return


# ── Vercel Python serverless handler ──
from http.server import BaseHTTPRequestHandler  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def _ok(self, body=b"ok", code=200):
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        # Проверка, что функция жива
        self._ok(b"Deutsch Meister bot webhook is running")

    def do_POST(self):
        # Проверка секрета (если задан)
        if WEBHOOK_SECRET:
            got = self.headers.get("X-Telegram-Bot-Api-Secret-Token", "")
            if got != WEBHOOK_SECRET:
                self._ok(b"forbidden", 403)
                return
        try:
            length = int(self.headers.get("content-length", 0) or 0)
            raw = self.rfile.read(length) if length else b"{}"
            update = json.loads(raw.decode("utf-8"))
            handle_update(update)
        except Exception:  # noqa: BLE001 — всегда отвечаем 200, чтобы TG не ретраил
            pass
        self._ok()
