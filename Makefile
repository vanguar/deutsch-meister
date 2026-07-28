# Deutsch Meister — команды деплоя (см. ДЕПЛОЙ-инструкция.md)
# Windows: запускать из Git Bash. Без make — прямые команды указаны в целях.

.PHONY: bump validate deploy-web deploy-api check-api

# Поднять ?v=N во всех HTML + CACHE в service-worker.js (обязательно перед
# пушем любых правок JS/CSS)
bump:
	python bump_version.py

# Проверить целостность уроков (данные <-> оболочки, версии, подсказки)
validate:
	python scripts/validate_lessons.py

# Фронтенд: GitHub Pages деплоит сам при пуше в main
deploy-web:
	git push origin main

# Бэкенд (api/): Vercel НЕ подключён к Git — деплой только этой командой
deploy-api:
	vercel --prod

# Смоук-проверка бэкенда после деплоя
check-api:
	bash scripts/check_api.sh
