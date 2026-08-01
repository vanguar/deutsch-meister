# Deutsch Meister — команды деплоя (см. ДЕПЛОЙ-инструкция.md)
# Windows: запускать из Git Bash. Без make — прямые команды указаны в целях.

.PHONY: bump validate check-tips deploy-web deploy-api check-api

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

# Фронтенд: GitHub Pages деплоит сам при пуше в main
deploy-web:
	git push origin main

# Бэкенд (api/): Vercel НЕ подключён к Git — деплой только этой командой
deploy-api:
	vercel --prod

# Смоук-проверка бэкенда после деплоя
check-api:
	bash scripts/check_api.sh
