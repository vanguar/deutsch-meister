# Деплой бота на Vercel (бесплатно, 24/7)

Бот работает через **webhook**: Telegram сам вызывает функцию `api/webhook.py`
на каждое сообщение. Постоянно работающий сервер не нужен → бесплатный тариф Vercel.

---

## 0. Безопасность: сначала перевыпустить токен

Старый токен попал в git-историю (был захардкожен). Обязательно:

1. Открой [@BotFather](https://t.me/BotFather) → `/revoke` → выбери `@GermanMorningBot`.
2. Получишь **новый токен** — он понадобится ниже. Нигде его не коммить.

---

## 1. Деплой на Vercel

1. Зайди на [vercel.com](https://vercel.com) → **Sign up** через GitHub (карта не нужна).
2. **Add New → Project** → импортируй репозиторий `vanguar/deutsch-meister`.
3. Framework Preset: **Other**. Ничего больше не меняй → **Deploy**.
4. После деплоя получишь адрес вида `https://deutsch-meister-xxxx.vercel.app`.

## 2. Переменные окружения

В проекте Vercel → **Settings → Environment Variables** добавь:

| Name             | Value                                   |
|------------------|-----------------------------------------|
| `BOT_TOKEN`      | новый токен от @BotFather               |
| `WEBHOOK_SECRET` | любая случайная строка (напр. `dm_9f3kQ2`) |
| `APP_URL`        | `https://vanguar.github.io/deutsch-meister/` |

После добавления → вкладка **Deployments → ⋯ → Redeploy** (чтобы переменные подхватились).

## 3. Привязать webhook к Telegram

Подставь свои значения и выполни в терминале (одна команда):

```bash
curl "https://api.telegram.org/bot<НОВЫЙ_ТОКЕН>/setWebhook?url=https://<твой-проект>.vercel.app/api/webhook&secret_token=<WEBHOOK_SECRET>&allowed_updates=[\"message\",\"callback_query\",\"pre_checkout_query\"]"
```

Проверить:
```bash
curl "https://api.telegram.org/bot<НОВЫЙ_ТОКЕН>/getWebhookInfo"
```
Должно быть `"url": "https://<твой-проект>.vercel.app/api/webhook"`.

## 4. Перегенерировать invoice-ссылки для звёзд

Ссылки в `js/support.js` (`DONATE.starsTiers`) привязаны к боту. После смены токена
пересоздай их новым токеном и замени URL-ы в `js/support.js`:

```bash
TOKEN="<НОВЫЙ_ТОКЕН>"
for n in 50 100 250 500; do
  curl -s "https://api.telegram.org/bot$TOKEN/createInvoiceLink" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Поддержка Deutsch Meister\",\"description\":\"Спасибо за поддержку на $n звёзд!\",\"payload\":\"donate_$n\",\"currency\":\"XTR\",\"prices\":[{\"label\":\"$n Stars\",\"amount\":$n}]}"
  echo
done
```
Скопируй полученные `https://t.me/$...` в соответствующие поля `url` и запушь.

---

## Проверка

- Открой мини-апп в Telegram → «❤️ Поддержать проект» → «⭐ Telegram Stars» →
  выбери номинал → оплата открывается **внутри апка**.
- Либо напиши боту `/donate`.

> ⚠️ Когда webhook привязан, **локальный `python bot/bot.py` запускать не нужно** —
> polling и webhook конфликтуют. Локальный бот — только для теста без Vercel.
