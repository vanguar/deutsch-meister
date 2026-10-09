"""
Задать описание бота («Що вміє цей бот?») и короткое описание профиля
через Bot API — отдельно для украинского (по умолчанию) и русского клиента.

Telegram сам выбирает текст по language_code клиента; без совпадения
показывается вариант по умолчанию (украинский).

Запуск:
  BOT_TOKEN=123:ABC python scripts/set_bot_description.py            # применить
  BOT_TOKEN=123:ABC python scripts/set_bot_description.py --dry-run  # только показать
  BOT_TOKEN=123:ABC python scripts/set_bot_description.py --show     # что сейчас в Telegram
"""
import json
import os
import sys
import urllib.request

# language_code → тексты. "" — вариант по умолчанию (для всех без своего перевода).
# 🇩🇪 обозначает тему бота, а не язык строки; 🇷🇺 как значок языка не используем.
TEXTS = {
    "": {
        "description": (
            "German Morning 🇩🇪 — бот для щоденного вивчення німецької мови.\n\n"
            "Короткі уроки, нові слова та регулярна практика щодня. "
            "Обери мову та почни навчання."
        ),
        "short_description": "Щоденні короткі уроки німецької: нові слова та практика.",
    },
    "ru": {
        "description": (
            "German Morning 🇩🇪 — бот для ежедневного изучения немецкого языка.\n\n"
            "Короткие уроки, новые слова и регулярная практика каждый день. "
            "Выбери язык и начни обучение."
        ),
        "short_description": "Ежедневные короткие уроки немецкого: новые слова и практика.",
    },
}

LIMITS = {"description": 512, "short_description": 120}


def tg(token, method, payload):
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    if not data.get("ok"):
        raise RuntimeError(f"{method}: {data}")
    return data.get("result")


def check_limits():
    for lang, t in TEXTS.items():
        for field, limit in LIMITS.items():
            n = len(t[field])
            if n > limit:
                sys.exit(f"[{lang or 'default'}] {field}: {n} > {limit} символов")


def main():
    args = set(sys.argv[1:])
    check_limits()
    token = os.environ.get("BOT_TOKEN", "")
    if not token and "--dry-run" not in args:
        sys.exit("Нужен BOT_TOKEN в окружении")

    for lang, t in TEXTS.items():
        label = lang or "default"
        base = {"language_code": lang} if lang else {}
        if "--show" in args:
            d = tg(token, "getMyDescription", base)["description"]
            s = tg(token, "getMyShortDescription", base)["short_description"]
            print(f"--- {label} ---\n{d}\n[short] {s}\n")
            continue
        print(f"--- {label} ---\n{t['description']}\n[short] {t['short_description']}\n")
        if "--dry-run" in args:
            continue
        tg(token, "setMyDescription", {**base, "description": t["description"]})
        tg(token, "setMyShortDescription", {**base, "short_description": t["short_description"]})
        print(f"OK: {label}\n")


if __name__ == "__main__":
    main()
