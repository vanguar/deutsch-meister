# Deutsch Meister 🇩🇪

**Deutsch Meister** — интерактивный курс немецкого языка от уровня A1 до B2.

Проект сделан как лёгкое веб-приложение без сложного backend: уроки открываются прямо в браузере, работают на GitHub Pages, поддерживают Telegram WebApp, PWA-режим, офлайн-кэширование, озвучку, упражнения, флэшкарты, XP и streak-систему.

---

## Демо

GitHub Pages:

```text
https://vanguar.github.io/deutsch-meister/
```

Telegram WebApp может открывать этот же адрес через кнопку бота.

---

## Возможности

- 🇩🇪 **Курс немецкого A1 → B2**
  - 4 уровня: A1, A2, B1, B2
  - 32 урока
  - темы от приветствий до сложной грамматики B2

- 📚 **Структура каждого урока**
  - фразы урока;
  - словарь с переводом и транскрипцией;
  - грамматический блок;
  - упражнения;
  - флэшкарты;
  - прогресс прохождения.

- 🔊 **Озвучка немецких слов и фраз**
  - Web Speech API;
  - fallback через StreamElements TTS;
  - fallback через ResponsiveVoice.

- ✏️ **Интерактивные упражнения**
  - заполнение пропусков;
  - выбор ответа;
  - сопоставление;
  - диктант.

- 🃏 **Флэшкарты**
  - карточки строятся из словаря урока;
  - пользователь отмечает: «знаю» / «ещё раз»;
  - за правильные ответы начисляется XP.

- ⚡ **XP и прогресс**
  - опыт хранится в `localStorage`;
  - сохраняются завершённые уроки;
  - сохраняется прогресс по секциям урока;
  - есть streak — количество дней подряд.

- 📱 **PWA**
  - можно установить как приложение;
  - есть `manifest.json`;
  - есть `service-worker.js`;
  - основные файлы кэшируются для офлайн-работы.

- 💬 **Telegram WebApp**
  - открытие курса внутри Telegram;
  - приветственное окно для пользователя;
  - Telegram BackButton на страницах уроков;
  - адаптация темы Telegram.

- 🤖 **Telegram Bot**
  - команда `/start`;
  - приветственное сообщение;
  - кнопка «Открыть курс».

---

## Технологии

Проект использует обычный frontend-стек без сборщика:

- HTML
- CSS
- JavaScript
- LocalStorage
- Web Speech API
- Telegram WebApp SDK
- Service Worker
- PWA Manifest
- GitHub Pages

Для Telegram-бота:

- Python
- aiogram

---

## Структура проекта

```text
deutsch-meister/
├── index.html                  # Главная страница курса
├── 404.html                    # Redirect для GitHub Pages
├── manifest.json               # PWA manifest
├── service-worker.js           # Офлайн-кэширование
├── bot.py                      # Telegram-бот для запуска WebApp
│
├── css/
│   ├── base.css                # Глобальные стили и переменные
│   ├── sidebar.css             # Боковое меню
│   ├── lesson.css              # Layout урока
│   └── exercises.css           # Стили упражнений
│
├── js/
│   ├── progress.js             # XP, streak, прогресс уроков
│   ├── lesson-render.js        # Рендер уроков из LESSON_DATA
│   ├── exercises.js            # Логика упражнений
│   ├── flashcards.js           # Флэшкарты
│   ├── tts.js                  # Озвучка
│   └── telegram.js             # Telegram WebApp-интеграция
│
├── data/
│   ├── a1/
│   │   └── a1-lesson-01.js
│   ├── a2/
│   │   └── a2-lesson-01.js
│   ├── b1/
│   │   └── b1-lesson-01.js
│   └── b2/
│       └── b2-lesson-01.js
│
├── lessons/
│   ├── a1/
│   ├── a2/
│   ├── b1/
│   └── b2/
│
└── tools/
    ├── gen_lessons.py          # Генерация HTML-страниц уроков
    ├── gen_template.html       # Шаблон урока
    └── patch_*.py              # Скрипты для массовых правок путей/кэша/PWA
```

---

## Как запустить локально

Так как проект статический, его можно открыть напрямую через `index.html`.

Но лучше запускать через локальный сервер, чтобы корректно работали PWA, Service Worker и относительные пути.

### Вариант 1: Python

```bash
python -m http.server 8000
```

Открыть:

```text
http://localhost:8000
```

### Вариант 2: VS Code Live Server

1. Открыть папку проекта в VS Code.
2. Установить расширение **Live Server**.
3. Нажать **Go Live**.
4. Открыть главную страницу курса.

---

## Деплой на GitHub Pages

Проект рассчитан на публикацию по пути:

```text
/deutsch-meister/
```

Поэтому в `manifest.json`, `service-worker.js` и ссылках используется базовый путь:

```text
/deutsch-meister
```

Чтобы опубликовать:

```bash
git add .
git commit -m "Обновляю Deutsch Meister"
git push
```

Далее в GitHub:

```text
Settings → Pages → Deploy from branch → main → /root
```

После деплоя сайт будет доступен по адресу:

```text
https://USERNAME.github.io/deutsch-meister/
```

---

## Telegram WebApp

В `index.html` и страницах уроков подключается Telegram WebApp SDK:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

Внутри Telegram приложение:

- раскрывается на весь экран;
- использует тему Telegram;
- показывает приветственное окно;
- на страницах уроков включает кнопку «Назад».

---

## Telegram Bot

Бот находится в файле:

```text
bot.py
```

Он отправляет приветственное сообщение и кнопку:

```text
🇩🇪 Открыть курс
```

### Установка зависимостей

```bash
pip install aiogram
```

### Запуск

```bash
python bot.py
```

### Безопасный вариант настройки токена

Не храните токен прямо в `bot.py`.

Лучше использовать переменную окружения:

```bash
export BOT_TOKEN="your_telegram_bot_token"
```

И в коде:

```python
import os

BOT_TOKEN = os.getenv("BOT_TOKEN")
```

---

## Формат данных урока

Каждый урок описывается в JS-файле через объект `LESSON_DATA`.

Пример структуры:

```js
const LESSON_DATA = {
  id: 'a1-01',
  level: 'A1',
  unit: 1,
  title: 'Hallo! Wie heißt du?',
  subtitle: 'Приветствия, знакомство и происхождение',

  meta: {
    duration: '25–30 мин',
    wordCount: 25,
    xpReward: 100
  },

  phrases: [],
  vocabulary: [],
  grammar: [],
  exercises: {}
};
```

Универсальный рендерер `lesson-render.js` читает `LESSON_DATA` и строит страницу урока автоматически.

---

## Генерация уроков

Для генерации HTML-страниц используется:

```text
gen_lessons.py
```

Он берёт шаблон:

```text
gen_template.html
```

И создаёт страницы вида:

```text
lessons/a2/lesson-01/index.html
lessons/b1/lesson-01/index.html
lessons/b2/lesson-01/index.html
```

Запуск:

```bash
python gen_lessons.py
```

Перед запуском проверьте переменную `BASE` внутри скрипта и укажите актуальный путь к проекту.

---

## PWA и офлайн-режим

Проект содержит:

```text
manifest.json
service-worker.js
```

Service Worker кэширует:

- главную страницу;
- CSS;
- JavaScript;
- иконку;
- данные уроков;
- страницы уроков.

После первого открытия часть курса может работать офлайн.

При изменении файлов нужно обновлять имя кэша в `service-worker.js`, например:

```js
const CACHE = 'deutsch-meister-v24';
```

---

## Прогресс пользователя

Прогресс хранится локально в браузере через `localStorage`.

Сохраняются:

- XP;
- streak;
- завершённые уроки;
- завершённые секции урока;
- результаты упражнений.

Ключи:

```text
dm_progress
dm_sections:<lesson-id>
dm_theme
tg_welcomed
```

---

## Озвучка

Озвучка реализована в `tts.js`.

Порядок работы:

1. Web Speech API с немецким голосом `de-DE`.
2. StreamElements TTS.
3. ResponsiveVoice fallback.

На страницах подключается:

```html
<script src="https://code.responsivevoice.org/responsivevoice.js?key=FREE"></script>
```

---

## Безопасность

Перед публикацией проекта обязательно:

- удалить реальные Telegram Bot Token из кода;
- перевыпустить уже опубликованные токены;
- добавить `.env` или переменные окружения;
- не коммитить локальные настройки IDE;
- не хранить приватные данные пользователей в репозитории;
- проверить, что Service Worker не кэширует секретные файлы.

Рекомендуемый `.gitignore`:

```gitignore
.env
.env.local
__pycache__/
*.pyc
.DS_Store
.vscode/
.idea/
.claude/
```

---

## Планы развития

- [ ] Добавить все уроки A1–B2
- [ ] Вынести все темы и уроки в отдельную структуру данных
- [ ] Добавить кнопку сброса прогресса
- [ ] Добавить страницу статистики
- [ ] Добавить выбор скорости озвучки
- [ ] Добавить режим повторения слов
- [ ] Добавить тест в конце каждого уровня
- [ ] Добавить таблицу неправильных ответов
- [ ] Добавить экспорт прогресса
- [ ] Подключить backend для синхронизации прогресса между устройствами
- [ ] Перенести токен Telegram-бота в переменные окружения
- [ ] Добавить GitHub Actions для проверки ссылок и деплоя

---

## Лицензия

Лицензия пока не указана.

Если проект планируется как открытый учебный курс, можно добавить MIT License.  
Если курс личный или коммерческий, лучше указать собственные условия использования.

---

## Автор

Проект создан как интерактивный курс немецкого языка с поддержкой Telegram Mini App, PWA и офлайн-обучения.