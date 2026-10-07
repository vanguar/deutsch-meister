# Deutsch Meister — команды деплоя (см. ДЕПЛОЙ-инструкция.md)
# Windows: запускать из Git Bash. Без make — прямые команды указаны в целях.

.PHONY: bump validate check-tips check-audience deploy-web deploy-api check-api i18n-check i18n-build test-i18n news

# Поднять ?v=N во всех HTML + CACHE в service-worker.js (обязательно перед
# пушем любых правок JS/CSS)
bump:
	python bump_version.py

# Проверить целостность уроков (данные <-> оболочки, версии, подсказки)
validate:
	python scripts/validate_lessons.py

# Регресс подсказок: у каждого слова фраз всех уроков подсказка обязана
# содержать русский перевод (кириллицу). Падает, если нет.
check-tips:
	node tools/check_tips.js

# Регресс аудитории: русский интерфейс ≠ Россия. Падает на «РФ», «у нас в
# России», рублях, флаге 🇷🇺 и т.п. в пользовательском контенте.
check-audience:
	python scripts/test_audience_wording.py

# Новости: собрать data/news из tools/news/*.py и проверить (покрытие словаря,
# фото, даты). Потом — i18n-check / i18n-build и bump.
news:
	python tools/news/build.py
	python scripts/validate_books.py --news

# Фронтенд: GitHub Pages деплоит сам при пуше в main
deploy-web:
	git push origin main

# Бэкенд (api/): Vercel НЕ подключён к Git — деплой только этой командой
deploy-api:
	vercel --prod

# Смоук-проверка бэкенда после деплоя
check-api:
	bash scripts/check_api.sh

# ── Языки интерфейса (i18n) ──
# Покрытие переводов: каждая русская строка уроков/книг/интерфейса имеет украинский перевод
i18n-check:
	node tools/i18n.js check

# Собрать рантайм-файлы i18n/uk/* из i18n/uk/src/*.json (после правки переводов или контента)
i18n-build:
	node tools/i18n.js build

# Юнит-тесты: рантайм i18n и бот (выбор языка, /api/lang)
test-i18n:
	node tools/test_i18n.js
	python scripts/test_bot_lang.py
