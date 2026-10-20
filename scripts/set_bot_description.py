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
            "German Morning 🇩🇪 — безкоштовний курс німецької мови A1–B2 у Telegram.\n\n"
            "68 коротких уроків з озвученням і вправами, діалоги, словник, книжки "
            "та новини німецькою з перекладом, а ще «Автошкола» — німецька для іспиту на права.\n\n"
            "Інтерфейс українською, російською або арабською.\n\n"
            "Обери мову та почни навчання 👇\n"
            "Сайт: vanguar.github.io/german-morning"
        ),
        "short_description": "Німецька A1–B2 безкоштовно: 68 уроків, діалоги, книжки, новини, автошкола. "
                             "vanguar.github.io/german-morning",
    },
    "ru": {
        "description": (
            "German Morning 🇩🇪 — бесплатный курс немецкого языка A1–B2 в Telegram.\n\n"
            "68 коротких уроков с озвучкой и упражнениями, диалоги, словарь, книги "
            "и новости на немецком с переводом, а ещё «Автошкола» — немецкий для экзамена на права.\n\n"
            "Интерфейс на украинском, русском или арабском.\n\n"
            "Выбери язык и начни обучение 👇\n"
            "Сайт: vanguar.github.io/german-morning"
        ),
        "short_description": "Немецкий A1–B2 бесплатно: 68 уроков, диалоги, книги, новости, автошкола. "
                             "vanguar.github.io/german-morning",
    },
    "ar": {
        "description": (
            "German Morning 🇩🇪 — دورة مجانية لتعلّم اللغة الألمانية من A1 إلى B2 في Telegram.\n\n"
            "68 درسًا قصيرًا مع النطق والتمارين، وحوارات، وكتب وأخبار بالألمانية مع الترجمة، "
            "و«مدرسة القيادة» — الألمانية لامتحان رخصة القيادة.\n\n"
            "اختر اللغة وابدأ التعلّم 👇\n"
            "الموقع: vanguar.github.io/german-morning"
        ),
        "short_description": "الألمانية A1–B2 مجانًا: 68 درسًا، حوارات، كتب، أخبار، مدرسة القيادة. "
                             "vanguar.github.io/german-morning",
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
