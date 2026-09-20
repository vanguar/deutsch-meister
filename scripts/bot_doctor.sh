#!/usr/bin/env bash
# bot_doctor.sh — диагностика и починка Telegram-бота одной командой.
#
# Зачем: 20 сентября 2026 бот замолчал на /start, и на поиск причины ушёл
# час. Причина оказалась одна, а симптомов два: токен пересоздали в
# BotFather, из-за чего Telegram АВТОМАТИЧЕСКИ снёс вебхук, а в окружении
# Vercel остался старый токен. Снаружи это выглядело как «всё живое, но
# бот молчит»: health отвечал 200, POST с секретом отвечал 200, в логах —
# тишина. Скрипт проверяет обе вещи сразу и говорит, что делать.
#
# Запуск:
#   scripts/bot_doctor.sh <ТОКЕН>            # проверить
#   scripts/bot_doctor.sh <ТОКЕН> --fix      # проверить и перерегистрировать
#
# Токен берётся у @BotFather: /mybots → бот → API Token.
# Секрет вебхука в Vercel помечен Sensitive и НЕ читается, поэтому --fix
# генерирует новый и прописывает его с обеих сторон.

set -u

HOOK_URL="https://deutsch-meister-puce.vercel.app/api/webhook"
TOKEN="${1:-${BOT_TOKEN:-}}"
MODE="${2:-check}"

if [ -z "$TOKEN" ]; then
  echo "Нужен токен: scripts/bot_doctor.sh <ТОКЕН> [--fix]" >&2
  exit 2
fi

api() { curl -s "https://api.telegram.org/bot${TOKEN}/$1"; }
field() { printf '%s' "$1" | sed -n "s/.*\"$2\":\"\\([^\"]*\\)\".*/\\1/p"; }
num()   { printf '%s' "$1" | sed -n "s/.*\"$2\":\\([0-9]*\\).*/\\1/p"; }

echo "── 1. Токен ──"
ME="$(api getMe)"
case "$ME" in
  *'"ok":true'*)
    echo "   OK: @$(field "$ME" username)" ;;
  *)
    echo "   МЁРТВ. Telegram не знает этот токен."
    echo "   Токен пересоздали в BotFather. Возьми актуальный там же и"
    echo "   пропиши в Vercel → Settings → Environment Variables → BOT_TOKEN"
    echo "   (Production), затем задеплой: vercel --prod"
    exit 1 ;;
esac

echo "── 2. Вебхук ──"
WH="$(api getWebhookInfo)"
URL="$(field "$WH" url)"
PENDING="$(num "$WH" pending_update_count)"
ERR="$(field "$WH" last_error_message)"
if [ -z "$URL" ]; then
  echo "   НЕ ЗАРЕГИСТРИРОВАН — Telegram некуда слать апдейты."
elif [ "$URL" != "$HOOK_URL" ]; then
  echo "   Указывает не туда: $URL"
  echo "   Ждали: $HOOK_URL"
else
  echo "   OK: $URL"
fi
[ -n "${PENDING:-}" ] && [ "${PENDING:-0}" -gt 0 ] && echo "   В очереди апдейтов: $PENDING"
[ -n "$ERR" ] && echo "   Последняя ошибка доставки: $ERR"

echo "── 3. Эндпоинт ──"
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$HOOK_URL")"
echo "   GET $HOOK_URL → $CODE"
[ "$CODE" = "200" ] || echo "   Функция не отвечает 200 — смотри vercel logs"

if [ "$MODE" != "--fix" ]; then
  echo
  echo "Починить: scripts/bot_doctor.sh <ТОКЕН> --fix"
  exit 0
fi

echo "── 4. Починка ──"
SECRET="$(head -c 24 /dev/urandom | base64 | tr -d '=+/' | cut -c1-32)"
echo "   Новый секрет сгенерирован."

vercel env rm WEBHOOK_SECRET production --yes >/dev/null 2>&1
printf '%s' "$SECRET" | vercel env add WEBHOOK_SECRET production >/dev/null 2>&1 \
  && echo "   WEBHOOK_SECRET записан в Vercel." \
  || { echo "   Не удалось записать WEBHOOK_SECRET (vercel login?)"; exit 1; }

echo "   Деплой (без него переменная не подхватится)…"
vercel --prod --yes >/dev/null 2>&1 \
  && echo "   Задеплоено." \
  || { echo "   Деплой не прошёл."; exit 1; }

RES="$(curl -s "https://api.telegram.org/bot${TOKEN}/setWebhook" \
  -H 'Content-Type: application/json' \
  -d "{\"url\":\"${HOOK_URL}\",\"secret_token\":\"${SECRET}\",\"drop_pending_updates\":true,\"allowed_updates\":[\"message\",\"callback_query\",\"pre_checkout_query\"]}")"
case "$RES" in
  *'"ok":true'*) echo "   Вебхук зарегистрирован." ;;
  *) echo "   setWebhook не прошёл: $RES"; exit 1 ;;
esac

echo
echo "Готово. Напиши боту /start — должно прийти приветствие с кнопками."
