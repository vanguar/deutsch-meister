"""
Облачный прогресс для Deutsch Meister (Vercel serverless, Python, только stdlib).

Хранит прогресс пользователя (JSON) в Upstash Redis по ключу dm:progress:<user_id>.
Пользователь определяется по подписанному Telegram initData (HMAC-SHA256 с BOT_TOKEN),
поэтому чужой прогресс подделать нельзя.

ENV (Vercel → Project → Settings → Environment Variables):
  BOT_TOKEN                 — токен бота от @BotFather (тот же, что у webhook)
  UPSTASH_REDIS_REST_URL    — из интеграции Upstash (Vercel Marketplace)
  UPSTASH_REDIS_REST_TOKEN  — из интеграции Upstash

Эндпоинт после деплоя: https://<project>.vercel.app/api/progress

API:
  POST  { "initData": "<Telegram.WebApp.initData>" }             -> { ok, data }        (чтение)
  POST  { "initData": "...", "data": { ... } }                   -> { ok, saved, data } (запись)
  GET   -> health-check
"""

import os
import json
import hmac
import hashlib
import time
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

BOT_TOKEN   = os.environ.get("BOT_TOKEN", "")
UPSTASH_URL = os.environ.get("UPSTASH_REDIS_REST_URL", "").rstrip("/")
UPSTASH_TOK = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "")

# Максимальный возраст initData (сутки). Ставим щедро — мини-апп может висеть открытым.
MAX_AUTH_AGE = 24 * 60 * 60


# ── Проверка подписи Telegram initData ──
def verify_init_data(init_data, bot_token, max_age=MAX_AUTH_AGE):
    """
    Возвращает dict пользователя (из поля 'user') если подпись валидна, иначе None.
    """
    if not init_data or not bot_token:
        return None

    # initData — это query-string. Разбираем, сохраняя порядок неважен.
    pairs = urllib.parse.parse_qsl(init_data, keep_blank_values=True)
    data = dict(pairs)

    received_hash = data.pop("hash", None)
    if not received_hash:
        return None

    # data_check_string: key=value, отсортированные по ключу, через \n (без hash)
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))

    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    calc_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, received_hash):
        return None

    # Проверка свежести
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


# ── Upstash Redis REST ──
def _upstash(command):
    """command — список, напр. ['GET', key] или ['SET', key, value]."""
    if not UPSTASH_URL or not UPSTASH_TOK:
        return None
    req = urllib.request.Request(
        UPSTASH_URL,
        data=json.dumps(command).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {UPSTASH_TOK}",
            "Content-Type": "application/json",
        },
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


# ── Vercel handler ──
class handler(BaseHTTPRequestHandler):
    def _send(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        # initData подписан, поэтому открытый CORS безопасен: без валидной подписи
        # прочитать/записать нельзя, и только свой собственный user_id.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self._send({"ok": True, "service": "deutsch-meister progress"})

    def do_POST(self):
        try:
            length = int(self.headers.get("content-length", 0) or 0)
            raw = self.rfile.read(length) if length else b"{}"
            body = json.loads(raw.decode("utf-8"))
        except Exception:  # noqa: BLE001
            self._send({"ok": False, "error": "bad_request"}, 400)
            return

        user = verify_init_data(body.get("initData", ""), BOT_TOKEN)
        if not user or not user.get("id"):
            self._send({"ok": False, "error": "unauthorized"}, 401)
            return

        uid = user["id"]

        # Запись, если пришло поле data
        if "data" in body and body["data"] is not None:
            ok = write_progress(uid, body["data"])
            self._send({"ok": ok, "saved": ok, "data": body["data"]})
            return

        # Иначе — чтение
        self._send({"ok": True, "data": read_progress(uid)})
