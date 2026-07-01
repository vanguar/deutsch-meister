# Донаты и Telegram-бот — как всё устроено и как не наступать на грабли

> Документ для владельца проекта и для других ИИ-ассистентов.
> Описывает механику доната (Telegram Stars + крипта) и деплой бота.
> **Читай раздел «Грабли» перед любыми изменениями бота или деплоя.**

---

## 1. Что сделано

**Фронтенд (мини-апп, на GitHub Pages):**
- Внизу сайдбара — кнопки **«❤️ Поддержать проект»** и **«📖 Скоро: книги на немецком»**.
- Модалка доната (`js/support.js` + стили в `css/base.css`) с выбором:
  - **Telegram Stars** — оплата открывается **прямо в мини-аппе** через `TG.openInvoice()`
    (номиналы 50/100/250/500 ⭐, invoice-ссылки в `DONATE.starsTiers`).
    Вне Telegram показывается подсказка открыть курс через бота.
  - **Криптовалюта** — список кошельков (USDT TRC-20/ERC-20, TON, BTC, ETH, SOL) с копированием.
- Работает одинаково в Telegram Mini App, на мобильном и десктопе.

**Бот (на Vercel, webhook, бесплатно 24/7):**
- `api/webhook.py` — serverless-функция (только stdlib Python, без зависимостей).
- Команды `/start`, `/donate`, inline-кнопки, `sendInvoice` в валюте **XTR**,
  подтверждение `pre_checkout_query`, ответ на `successful_payment`.
- `bot/bot.py` — альтернативный вариант на **polling** (для локального теста без Vercel).

---

## 2. Архитектура

```
Пользователь в Telegram
        │
        ▼
Мини-апп (статика)            Telegram Stars оплата
GitHub Pages                  через TG.openInvoice(invoice_link)
vanguar.github.io/…                     │
        │  кнопка «Звёзды»               ▼
        └──────────────►  Telegram шлёт pre_checkout / payment
                                          │
                                          ▼
                          Бот на Vercel (webhook)
                          deutsch-meister-puce.vercel.app/api/webhook
                          подтверждает оплату за <10 сек
```

- **Сайт/мини-апп:** GitHub Pages → `https://vanguar.github.io/deutsch-meister/`
- **Бот:** Vercel serverless → `https://deutsch-meister-puce.vercel.app/api/webhook`
- **Бот в Telegram:** `@GermanMorningBot`
- **Vercel-проект:** `vanguars-projects/deutsch-meister`

---

## 3. ГРАБЛИ (главное — читать первым)

1. **GitHub Pages НЕ запускает бота.** Pages отдаёт только статику. Бот — это
   отдельный процесс/функция на другом хостинге (у нас — Vercel).

2. **Telegram Stars невозможны без живого бота.** На каждый платёж Telegram шлёт
   `pre_checkout_query`, и его нужно подтвердить **за 10 секунд**. Сделать это
   «чисто фронтом» / на статике нельзя. Даже готовая invoice-ссылка не оплатится,
   если в момент оплаты бот офлайн.

3. **Vercel + Python: НЕ клади `requirements.txt` в корень проекта.** Он переключает
   Vercel в режим «single Python entrypoint» и деплой падает с
   `No python entrypoint found`. Правильно — файл **`pyproject.toml`** в корне:
   ```toml
   [tool.vercel]
   entrypoint = "api.webhook:handler"
   ```
   Зависимостей у нас нет (stdlib), поэтому `requirements.txt` вообще не нужен.

4. **Vercel Deployment Protection ломает webhook.** Часть алиасов проекта защищена
   логином и отдаёт **302 на страницу авторизации** — Telegram туда не достучится.
   - Защищён (302): `deutsch-meister-vanguars-projects.vercel.app`
   - Публичный (200): **`deutsch-meister-puce.vercel.app`** ← его и используем для webhook.
   - Проверка: `curl -I https://…/api/webhook` должен вернуть **200**, а не 302.
   - Альтернатива: отключить защиту в *Vercel → Project → Settings → Deployment Protection*.

5. **Webhook и polling нельзя одновременно.** Если задан webhook, а ты запустишь
   `python bot/bot.py` (polling) — будет конфликт (`getUpdates` вернёт 409).
   При активном webhook локальный бот **не нужен**. Хочешь тестировать локально —
   сначала сними webhook: `curl https://api.telegram.org/bot<TOKEN>/deleteWebhook`.

6. **Service Worker кэширует агрессивно.** Изначально был `cache-first` — обновления
   не долетали до пользователей. Исправлено: **network-first для HTML** + версия кэша
   (`CACHE = 'deutsch-meister-vNN'`) + версии ассетов (`?v=N`).
   **При любой правке `css/*.css` или `js/*.js` — поднимай номер версии** (в SW и/или `?v=`).

7. **Telegram кэширует мини-аппы отдельно от SW.** Если после деплоя в Telegram видна
   старая версия — закрыть мини-апп полностью и/или *Настройки → Данные и память →
   Очистить кэш*.

8. **Секрет webhook.** `setWebhook` передаёт `secret_token`, а функция проверяет
   заголовок `X-Telegram-Bot-Api-Secret-Token`. Чужой POST → 403.

9. **Токен бота — не хардкодить.** Хранить в переменных окружения (Vercel env),
   не коммитить. Если токен утёк в git — `@BotFather → /revoke`, затем п.10.

10. **invoice-ссылки привязаны к боту/токену.** При смене токена их нужно
    **пересоздать** и заменить URL в `js/support.js → DONATE.starsTiers` (см. п.6 деплоя).

---

## 4. Переменные окружения (Vercel → Settings → Environment Variables)

| Name             | Назначение                                   |
|------------------|----------------------------------------------|
| `BOT_TOKEN`      | токен бота от @BotFather                      |
| `WEBHOOK_SECRET` | секрет для проверки входящих запросов Telegram|
| `APP_URL`        | URL мини-аппа (GitHub Pages)                  |

> Значения хранятся зашифрованными в Vercel и в локальном `.env.local`
> (он в `.gitignore`, в репозиторий не попадает). В этом файле секретов нет — и не надо.

---

## 5. Типовые операции (шпаргалка)

**Передеплой бота после правки `api/webhook.py`:**
```bash
vercel --prod --yes
```

**Переустановить webhook** (после смены URL/секрета):
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://deutsch-meister-puce.vercel.app/api/webhook",
       "secret_token":"<WEBHOOK_SECRET>",
       "allowed_updates":["message","callback_query","pre_checkout_query"]}'
```

**Проверить состояние webhook:**
```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
# url должен указывать на …-puce.vercel.app, pending_update_count близко к 0
```

**Пересоздать invoice-ссылки на звёзды** (после смены токена):
```bash
TOKEN="<НОВЫЙ_ТОКЕН>"
for n in 50 100 250 500; do
  curl -s "https://api.telegram.org/bot$TOKEN/createInvoiceLink" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Поддержка Deutsch Meister\",\"description\":\"Спасибо за поддержку на $n звёзд!\",\"payload\":\"donate_$n\",\"currency\":\"XTR\",\"prices\":[{\"label\":\"$n Stars\",\"amount\":$n}]}"
  echo
done
# полученные https://t.me/$... вписать в js/support.js → DONATE.starsTiers, затем git push
```

**Обновление фронта:** правишь файлы → поднимаешь версию (SW `CACHE` и/или `?v=`) →
`git push origin main`. GitHub Pages опубликует автоматически за 1–2 минуты.

---

## 6. Как проверить, что всё работает

1. `curl https://deutsch-meister-puce.vercel.app/api/webhook` → `Deutsch Meister bot webhook is running` (200).
2. В Telegram открой `@GermanMorningBot` → `/donate` → выбери номинал → оплати.
3. В мини-аппе: сайдбар → «❤️ Поддержать проект» → «⭐ Telegram Stars» →
   оплата открывается прямо в апке; после — тост «Спасибо за поддержку! ⭐».

---

## 7. Файлы, которых это касается

| Файл                | Роль                                             |
|---------------------|--------------------------------------------------|
| `js/support.js`     | UI доната, кошельки, Stars (`openInvoice`)        |
| `css/base.css`      | стили модалки/тоста                               |
| `css/sidebar.css`   | стили кнопок в сайдбаре                           |
| `index.html`        | подключение `support.js`, регистрация SW          |
| `service-worker.js` | стратегия кэша (network-first HTML), версия кэша  |
| `api/webhook.py`    | **боевой** бот на Vercel (webhook)               |
| `pyproject.toml`    | точка входа Python-функции для Vercel             |
| `bot/bot.py`        | локальный бот на polling (только для теста)        |
