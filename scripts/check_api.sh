#!/usr/bin/env bash
# check_api.sh — смоук-проверка бэкенда после `vercel --prod` (make check-api).
# Проверяет боевой URL; другой деплой можно передать первым аргументом:
#   bash scripts/check_api.sh https://deutsch-meister-<preview>.vercel.app

set -u
BASE_URL="${1:-https://deutsch-meister-puce.vercel.app}"
FAIL=0

check() {
  local name="$1"; shift
  local expected="$1"; shift
  local got="$1"; shift
  if [ "$got" = "$expected" ]; then
    echo "OK   $name ($got)"
  else
    echo "FAIL $name: ожидалось '$expected', получено '$got'"
    FAIL=1
  fi
}

echo "Проверяю $BASE_URL ..."

# 1) /api/webhook health-check → 200 + "service": "webhook"
resp=$(curl -s -w '\n%{http_code}' "$BASE_URL/api/webhook")
code=$(echo "$resp" | tail -1)
body=$(echo "$resp" | head -n -1)
check "webhook: HTTP-код" "200" "$code"
echo "$body" | grep -q '"service": *"webhook"' \
  && echo 'OK   webhook: "service": "webhook"' \
  || { echo "FAIL webhook: нет \"service\": \"webhook\" в ответе: $body"; FAIL=1; }

# 2) /api/tts → 200 + audio/mpeg + непустое тело
read -r code ctype size < <(curl -s -o /dev/null \
  -w '%{http_code} %{content_type} %{size_download}' \
  "$BASE_URL/api/tts?tl=de&text=Hallo")
check "tts: HTTP-код" "200" "$code"
case "$ctype" in
  audio/mpeg*) echo "OK   tts: content-type $ctype" ;;
  *) echo "FAIL tts: content-type '$ctype' (ожидался audio/mpeg)"; FAIL=1 ;;
esac
if [ "${size:-0}" -gt 1000 ]; then
  echo "OK   tts: размер mp3 $size байт"
else
  echo "FAIL tts: подозрительно маленькое тело ($size байт)"
  FAIL=1
fi

# 3) /api/progress без валидного initData → 401 unauthorized
code=$(curl -s -o /dev/null -w '%{http_code}' \
  -X POST -H 'Content-Type: application/json' \
  -d '{"initData":"invalid"}' "$BASE_URL/api/progress")
check "progress: 401 без initData" "401" "$code"

echo
if [ "$FAIL" -eq 0 ]; then
  echo "✅ Бэкенд отвечает корректно."
else
  echo "❌ Есть проблемы — смотри строки FAIL выше."
fi
exit "$FAIL"
