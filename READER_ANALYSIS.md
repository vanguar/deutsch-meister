# READER_ANALYSIS.md
## Технический аудит проекта Deutsch Meister под задачу «читалка книг на немецком»

Дата: 2026-09-13 · ветка `main` · последний коммит `f527793`
Режим: только чтение, код не изменялся.

---

## 1. СТЕК И АРХИТЕКТУРА

### Язык, фреймворк, сборщик, менеджер пакетов

| Что | Факт |
|---|---|
| Фронтенд | **Vanilla HTML/CSS/JS (ES2020+)**, без фреймворка |
| Сборщик | **Отсутствует**. Никакого бандлера, транспайлера, минификатора |
| Менеджер пакетов | **Отсутствует**. Нет `package.json`, нет `node_modules`, нет `requirements.txt` |
| Модульная система | **Отсутствует** (нет ESM `import`/`export`). Все скрипты — глобальные `<script src>`, изоляция через IIFE-паттерн `const X = (() => {...})()` |
| Бэкенд | **Python 3.9+, только стандартная библиотека** (`http.server.BaseHTTPRequestHandler`), один файл `api/webhook.py`, деплой на Vercel |
| Node.js | Используется только для одного dev-скрипта `tools/check_tips.js` (модули `fs`, `path`, `vm` — тоже stdlib) |
| Python-скрипты сборки | `bump_version.py`, `scripts/validate_lessons.py`, `gen_lessons.py` — только stdlib |
| Хостинг фронта | GitHub Pages → `https://vanguar.github.io/deutsch-meister/` (авто-деплой по push в `main`) |
| Хостинг API | Vercel → `https://deutsch-meister-puce.vercel.app` (**деплой вручную**: `vercel --prod`, Vercel НЕ подключён к Git) |
| PWA | Да: `manifest.json` + `service-worker.js` |
| Telegram | Работает как Telegram Mini App (`@GermanMorningBot`) |

Явная политика проекта (README): *«Zero dependencies by design … Keep it that way»*. **Любая читалка должна быть написана в том же стиле — без npm, без сборки.**

### Структура папок (3 уровня)

```text
deutsch-meister/
├── index.html                  # главная: hero, статистика, карта курса, сайдбар, регистрация SW
├── 404.html                    # редирект на главную
├── manifest.json               # PWA-манифест
├── service-worker.js           # CACHE = 'deutsch-meister-v66', network-first
├── Makefile                    # bump / validate / check-tips / deploy-web / deploy-api / check-api
├── bump_version.py             # единая накрутка ?v=N + SW CACHE
├── gen_lessons.py              # генератор оболочек уроков (gitignored)
├── gen_template.html           # шаблон оболочки (gitignored)
├── patch_*.py                  # исторические одноразовые миграции (уже применены)
├── pyproject.toml              # [tool.vercel] entrypoint = "api.webhook:handler"
│
├── css/
│   ├── base.css                # 706 стр. — дизайн-токены, темы, reset, модалки, тосты
│   ├── sidebar.css             # 276 стр. — боковое меню
│   ├── lesson.css              # 481 стр. — карточки фраз, word-tip, словарь, грамматика
│   └── exercises.css           # 518 стр. — упражнения, флэшкарты
│
├── js/                         # 9 модулей
│   ├── lesson-render.js        # 2316 стр. — главный движок + словарь подсказок
│   ├── exercises.js            # 671 стр.
│   ├── progress.js             # 609 стр.
│   ├── tts.js                  # 316 стр.
│   ├── support.js              # 246 стр. — модалки/донат/«Книги»
│   ├── install-app.js          # 192 стр.
│   ├── flashcards.js           # 171 стр.
│   ├── cloud-sync.js           # 104 стр.
│   └── telegram.js             # 102 стр.
│
├── data/
│   ├── a1/a1-lesson-01.js … a1-lesson-20.js   # 20 файлов
│   ├── a2/a2-lesson-01.js … a2-lesson-20.js   # 20
│   ├── b1/b1-lesson-01.js … b1-lesson-14.js   # 14
│   └── b2/b2-lesson-01.js … b2-lesson-14.js   # 14   (всего 68 LESSON_DATA)
│
├── lessons/
│   ├── a1/lesson-01/index.html … lesson-20/index.html
│   ├── a2/lesson-01/…  b1/lesson-01/…  b2/lesson-01/…   (68 тонких HTML-оболочек)
│
├── api/webhook.py              # ВЕСЬ бэкенд: /api/webhook + /api/tts + /api/progress
├── bot/bot.py                  # aiogram-polling бот, только для локальных тестов
├── icons/icon.svg
├── scripts/
│   ├── validate_lessons.py     # CI-валидатор
│   └── check_api.sh            # смоук-тест бэкенда
├── tools/
│   ├── check_tips.js           # регресс подсказок (Node + vm)
│   └── legacy/                 # устаревшие patch-скрипты
├── .github/workflows/validate.yml
├── README.md, BOT_AND_DONATIONS.md, ДЕПЛОЙ-инструкция.md
```

### Паттерн организации кода

**Data-driven engine + слой рендера.** Не фиче-слайсы, не MVVM. Схема:

1. `data/<lvl>/<lvl>-lesson-NN.js` объявляет глобальную константу `const LESSON_DATA = {...}`.
2. `lessons/<lvl>/lesson-NN/index.html` — «тонкая оболочка»: подключает свой data-файл **до** движка, содержит пустые DOM-контейнеры (`#phraseGrid`, `#vocabTableBody`, `#grammarBoxes`, `#fillContainer`, `#flashcard`, …) и boot-скрипт.
3. `js/lesson-render.js` на `DOMContentLoaded` читает глобали `LESSON_DATA`, `CURRENT_LESSON_NUM`, `CURRENT_LESSON_LEVEL` и наполняет контейнеры.

Boot-последовательность в каждой оболочке (пример `lessons/a1/lesson-02/index.html:220`):

```js
const CURRENT_LESSON_NUM = 2;
document.addEventListener('DOMContentLoaded', () => {
  initTheme(); Progress.init();
  LessonRender.init();
  Exercises.init();
  Flashcards.init();
});
```

Все модули — синглтон-IIFE с публичным объектом:
`LessonRender` (`{init, wordHtml, initWordTips, renderNav}`), `Progress`, `Exercises` (`{init, escapeHtml, initBlankInput}`), `Flashcards` (`{init, flip, handleAgain, handleGood}`), `TTS` (`{init, speak, speakPhrase, speakSlow}`).
Плюс глобальные функции-алиасы для inline-`onclick` в HTML: `speak()`, `speakPhrase()`, `speakSlow()`, `speakPhraseEl()`, `cardFlip()`, `cardAgain()`, `cardGood()`, `toggleTheme()`, `openSidebar()`, `openBooksModal()`, `dmClose()` и т.д.

**Важное исключение:** `lessons/a1/lesson-01/index.html` — единственная оболочка со **старым инлайновым рендером** (свои копии `renderPhrases`, `renderVocab`, `renderFillBlanks` прямо в HTML, не использует `LessonRender.init()`). Остальные 67 — на общем движке.

### Ключевые зависимости

Внешних зависимостей на фронте **нет вообще**, кроме двух runtime-ресурсов по CDN:
- Google Fonts (`css/base.css:6`): `Playfair Display`, `DM Sans`, `DM Mono`;
- Telegram WebApp SDK (`js/telegram.js:12`): `https://telegram.org/js/telegram-web-app.js`, грузится **лениво и только внутри Telegram-WebView**.

Бэкенд: только stdlib Python. Внешние сервисы — Google Translate TTS и Upstash Redis (через REST, без SDK).

---

## 2. НАВИГАЦИЯ И ЭКРАНЫ

### Как устроена навигация

**Роутера нет.** Это классический многостраничный статический сайт: навигация — обычные `<a href>` на отдельные HTML-файлы. Никакого SPA, History API, хэш-роутинга.

- Сайдбар: на главной — жёстко захардкоженный HTML (`index.html:150–270`), на страницах урока — генерируется `LessonRender.renderNav()` (`js/lesson-render.js:2051`) из массивов `A1_LESSONS` / `A2_LESSONS` / `B1_LESSONS` / `B2_LESSONS` (`js/lesson-render.js:9–99`).
- Все ссылки несут cache-busting: `href="lessons/a1/lesson-01/index.html?v=51"`.
- Открытие/закрытие сайдбара — глобальные `openSidebar()` / `closeSidebar()` / `toggleSidebar()` (`js/lesson-render.js:2300–2315` и дубль в `index.html:536`).
- `404.html` делает `location.replace('/deutsch-meister/')`.
- Кнопка «Назад» в Telegram — `TG.BackButton` (`js/telegram.js:39–52`).

### Полный список экранов

| # | Экран | Путь |
|---|---|---|
| 1 | Главная (hero, статистика, карта курса из 68 карточек, сайдбар, XP) | `index.html` |
| 2–69 | 68 страниц уроков, каждая — одна страница с секциями: фразы, словарь, грамматика, заполни пропуски, выбор ответа, соединение пар, диктант, флэшкарты | `lessons/{a1,a2,b1,b2}/lesson-NN/index.html` |
| 70 | 404 / редирект | `404.html` |

Модальные «псевдо-экраны» (не отдельные страницы, а оверлеи `.dm-modal`):
- «Поддержать проект» → `openDonateModal()` (`js/support.js:71`)
- «Telegram Stars» → `donateStars()` (`js/support.js:97`)
- «Криптовалюта» → `donateCrypto()` (`js/support.js:159`)
- **«Книга с переводом»** → `openBooksModal()` (`js/support.js:218`)
- Приветствие в Telegram → `showTgWelcome()` (`js/telegram.js:70`)
- Баннер установки PWA → `js/install-app.js`

### ⚠️ Где именно находится «экран-заглушка» раздела «Чтение книг»

**Отдельного экрана НЕТ.** Есть только кнопка в сайдбаре, открывающая модалку «Скоро».

**1) Кнопка в сайдбаре** — `index.html:280–286`, дублируется в каждой из 68 оболочек уроков (напр. `lessons/a1/lesson-01/index.html:66`) и в шаблоне генератора `gen_template.html:42`:

```html
<button class="side-action" onclick="openBooksModal()">
  <span class="sa-ico">📖</span>
  <span class="sa-txt">
    <span class="sa-title">Разработка книги с переводом</span>
    <span class="sa-sub">Чтение, озвучка и упражнения</span>
  </span>
</button>
```

**2) Обработчик-заглушка** — `js/support.js:218–233`:

```js
function openBooksModal() {
  dmHaptic('light');
  dmOpen(`
    <div class="dm-emoji">📖</div>
    <h2 class="dm-title">Книга с переводом</h2>
    <p class="dm-text">Мы активно работаем над книгой на немецком с переводом:
      чтение с озвучкой, переводом фраз, разбором отдельных слов
      и упражнениями прямо по тексту.</p>
    <div class="dm-net-badge">🚀 Скоро в обновлении</div>
    <p class="dm-note">Следите за новостями — спасибо, что вы с нами!</p>
    <button class="dm-btn" onclick="dmClose()">Отлично, жду! 🙌</button>
  `);
}
```

Экспорт в глобальную область — `js/support.js:235–244` (`Object.assign(window, { … openBooksModal })`).

**Практический вывод:** точка подключения читалки уже есть в 69 файлах. Чтобы включить раздел, достаточно заменить тело `openBooksModal()` на переход (`location.href = '…/reader/index.html?v=NN'`) — править 69 HTML-файлов не придётся.

---

## 3. ОЗВУЧКА (TTS)

### Механизм — трёхуровневый каскад

Файл: **`js/tts.js`** (316 строк), модуль `TTS`, версия помечена внутри как `VERSION = 'v20'`.

Порядок выбора пути (`js/tts.js:246` — функция `speak`):

1. **Системный `speechSynthesis`** — только в обычном браузере/PWA, только если есть немецкий голос. Если `onstart` не сработал за `fallbackDelay` мс — автоматический фолбэк на аудио.
2. **Web Audio API + свой прокси** (основной путь в Telegram и всегда, когда нужна подсветка): `fetch` mp3 → `decodeAudioData` → `AudioBufferSourceNode`.
3. **`<audio>` с перебором трёх источников** — если Web Audio не смог.

Ключевая развилка (`js/tts.js:264`):

```js
if (inTelegram() || (spans && spans.length)) { speakAudio(text, spans); return; }
```

Т.е. **в Telegram `speechSynthesis` не используется вообще** (он там молчит) и **любая озвучка с подсветкой слов идёт через mp3**, потому что только там известна точная длительность.

### Внешний API

Прокси на своём бэкенде (`js/tts.js:3`):

```js
const PROXY = 'https://deutsch-meister-puce.vercel.app/api/tts';
function proxyUrl(text) {
  return PROXY + '?tl=de&text=' + encodeURIComponent(String(text).slice(0, 200));
}
```

Серверная часть — `api/webhook.py:172–210`:
- основной источник `https://translate.google.com/translate_tts?client=tw-ob`;
- фолбэк `https://translate.googleapis.com/translate_tts?client=gtx`;
- добавляет CORS и `Cache-Control: public, max-age=604800, immutable` (7 дней), заголовок `X-TTS-Source`;
- **лимит 200 символов на запрос** (`text[:200]` и на клиенте, и на сервере) — жёсткое ограничение Google TTS.

Прямые резервные URL на клиенте (`js/tts.js:190`): `gUrl('translate.google.com')`, `gUrl('translate.googleapis.com')`.

> ⚠️ README и история проекта: **StreamElements мёртв (401), возвращаться нельзя.** ResponsiveVoice тоже выпилен.

### Точные сигнатуры

```js
// js/tts.js:246 — ядро
TTS.speak(text, { rate = 0.85, pitch = 1, fallbackDelay = null, spans = null } = {})

// js/tts.js:284
TTS.speakPhrase(text, spans)      // rate 0.82, fallbackDelay 2200, с подсветкой

// js/tts.js:288
TTS.speakSlow(text)               // rate 0.65

// js/tts.js:290
TTS.init()                        // вызывается сразу при загрузке файла

// Глобальные алиасы для inline-onclick (js/tts.js:303–305)
speak(text); speakPhrase(text); speakSlow(text);

// js/tts.js:310 — озвучка фразы с подсветкой слов внутри её .phrase-card
speakPhraseEl(btn, text)
```

Внутренние: `playWebAudio(text, spans)` (`:196`), `playAudioEl(text, spans)` (`:219`), `speakAudio(text, spans)` (`:239`), `hlByDuration(spans, durSec)` (`:114`), `unlock()` (`:157`), `stopCurrent()` (`:140`), `diag(msg)` (`:14`).

### Язык, голос, скорость

- Язык зашит жёстко: `tl=de` в URL прокси; `u.lang = 'de-DE'` для `speechSynthesis`.
- Голос: `pickBestVoice()` (`js/tts.js:242`) — `lang === 'de-DE'`, иначе любой `de*`, иначе `null`.
- Скорость `rate` работает **только для `speechSynthesis`**. Для mp3-пути скорость не регулируется вообще (Google TTS отдаёт фиксированный темп). Для читалки это ограничение: «медленное чтение» через Google TTS недоступно без `playbackRate` (не реализовано).
- Выбора голоса пользователем в UI нет.

### Кеширование аудио

Три уровня:
1. **In-memory** `const bufCache = {}` (`js/tts.js:9`) — ключ = сам текст, значение = декодированный `AudioBuffer`. Живёт до перезагрузки страницы, объём не ограничен, не вытесняется.
2. **HTTP-кеш браузера** — прокси отдаёт `max-age=604800, immutable`.
3. **Service Worker НЕ кеширует аудио**: кросс-доменные запросы намеренно пропускаются (`service-worker.js:56`), потому что перехват медиа ломает звук на iOS. Собственный `/api/tts` — тоже другой origin (vercel), так что под SW не попадает.

**Вывод: офлайн-озвучки нет.** В офлайне в браузере остаётся только `speechSynthesis`, а в Telegram — тишина.

### Обработка ошибок и отсутствия сети

Ошибки глушатся полностью, «тихая деградация»:
- `playWebAudio` → `.catch(...)` → `playAudioEl` (`js/tts.js:239`);
- `playAudioEl` перебирает 3 URL по `onerror` / `play().catch()`, после исчерпания пишет только в диагностику (`js/tts.js:222`);
- весь модуль обёрнут в `try {} catch (e) {}`;
- **пользователю ошибка никак не показывается** — просто нет звука;
- отладка включается вручную: `localStorage.setItem('dm_tts_debug','1')` → на экран выводится оверлей `#ttsDiag`.

### Разблокировка аудио (важно для мобильных)

`unlock()` (`js/tts.js:157`) проигрывает встроенный тихий WAV (data-URI, `js/tts.js:7`) и делает `AudioContext.resume()`. Вешается на `click` и `touchend` в `init()` (`js/tts.js:290`). **`touchstart` не используется намеренно** — на iOS он не считается квалифицирующим жестом.

### Синхронная подсветка слов (готовый механизм для читалки!)

`hlByDuration(spans, durSec)` (`js/tts.js:114`) раскладывает массив DOM-элементов по времени звучания **пропорционально количеству букв** в каждом слове, с поправками `lead = min(120, ms*0.04)` и `usable = ms*0.92`. Если длительность неизвестна — оценка `300 + букв*70` мс. Подсветка — inline-стилем `text-shadow` (не CSS-классом, чтобы не зависеть от кеша CSS в Telegram WebView).

---

## 4. ПЕРЕВОД

### Есть ли перевод слов/фраз

**API перевода — отсутствует.** Ни Google Translate API, ни DeepL, ни Yandex, ни какого-либо другого сервиса в проекте нет. Перевод только **статический**, из двух источников:

**а) Готовые переводы в данных урока** — `data/**/*.js`: у каждой фразы поле `ru`, у каждого слова словаря поле `ru`.

**б) Локальный словарь подсказок для отдельных слов** — целиком внутри `js/lesson-render.js`:

| Источник | Строки | Размер | Формат |
|---|---|---|---|
| `BASIC_WORDS` | `115–173` | ~56 записей | объект `{ der: { ru: '…', kind: 'Артикль' }, … }` |
| `EXTRA_WORDS` | `174–395` | ~210 записей | тот же объект-формат |
| `COMMON_VERB_FORMS` | `396–505` | массив триплетов | `[word, ru, detail]` |
| **`COURSE_WORDS_RAW`** | `506–1636` | **~1128 строк** | template-string, разделитель `\|` |
| `NOUN_FORM_OVERRIDES` | `1637–1669` | 10 существительных | ручные формы мн. ч. |
| `VERB_FORM_OVERRIDES` | `1670–1694` | неправильные глаголы | ручные формы |

Формат `COURSE_WORDS_RAW` (`js/lesson-render.js:506`):

```
слово|перевод|часть речи|детали(необязательно)
ab|от / с / начиная с|Предлог
abgebaut|сокращён / уменьшен|Форма глагола
Buch|книга|Существительное
Bücher|книги|Форма мн. числа
```

Парсер — `addCourseWords(map)` (`js/lesson-render.js:1725`):

```js
COURSE_WORDS_RAW.trim().split(/\n+/).forEach(line => {
  const [word, ru, kind = 'Слово', detail = ''] = line.split('|').map(p => p.trim());
  if (!word || !ru) return;
  addInfo(map, word, { word, ru, kind, detail });
});
```

### Сигнатуры и формат ответа

```js
// js/lesson-render.js:1793 — собирает Map<string, WordInfo> для ТЕКУЩЕГО урока
function buildWordLexicon()

// js/lesson-render.js:1853 — синхронный поиск
function getWordInfo(word)   // → WordInfo | undefined

// js/lesson-render.js:1695 — нормализация ключа
function keyOf(str)          // первая буквенная последовательность → lowerCase
```

Формат `WordInfo` (собирается в `addInfo`, `js/lesson-render.js:1704`):

```js
{
  word:         'Bücher',                  // самая длинная встреченная форма
  kind:         'Форма мн. числа',         // «часть речи»/происхождение подсказки
  translations: ['книги', …],              // массив, дубли отсеиваются
  details:      ['das Buch → die Bücher'], // массив
  conjugations: ['ich → lese', …]          // массив
}
```

**Всё синхронно, в памяти, без Promise и без сети.**

Источники, которые `buildWordLexicon()` сливает в одну Map (`js/lesson-render.js:1793–1851`):
1. `BASIC_WORDS` + `EXTRA_WORDS`;
2. `COURSE_WORDS_RAW`;
3. `COMMON_VERB_FORMS`;
4. `addPhraseNoteTerms` — вытаскивает `слово = перевод` из `phrases[].note` регуляркой;
5. `LESSON_DATA.vocabulary` + автогенерация форм (`addNounForms`, `addVerbForms`);
6. `LESSON_DATA.grammar[].conjugation` — спряжения;
7. `LESSON_DATA.exercises.matching` — пары;
8. `LESSON_DATA.exercises.fillBlanks` — подсказки `hintRule`.

Рендер подсказки — `renderWordTip(word)` (`js/lesson-render.js:1858`). Важная деталь: перевод выбирается как **первая строка с кириллицей**, чтобы немецкие формы не подменяли перевод:

```js
const translation = allTranslations.find(t => /[А-Яа-яЁё]/.test(t)) || '';
if (!translation && !details.length && !conjugations.length) return '';  // тултипа не будет
```

### Кеш переводов

Только **in-memory на время жизни страницы**: `let wordLexicon = null` (`js/lesson-render.js:1690`), лениво строится при первом `getWordInfo()` и сбрасывается в `init()` (`js/lesson-render.js:2267`). В `localStorage`/IndexedDB переводы **не кешируются** — им это и не нужно, они и так в коде.

### Лемматизация

**Полноценной лемматизации нет.** Есть три частичных суррогата:

1. `keyOf()` — только нижний регистр + отсечение небуквенных символов. Никакой нормализации окончаний.
2. `addVerbForms()` (`js/lesson-render.js:1756`) — **генерация вперёд**, а не приведение к начальной форме: для глагола на `-en` добавляет `stem+e` / `stem+st` / `stem+t` в словарь:

```js
const stem = headword.slice(0, -2);
[{ word: `${stem}e`,  detail: `ich ${stem}e` },
 { word: `${stem}st`, detail: `du ${stem}st` },
 { word: `${stem}t`,  detail: `er/sie/es ${stem}t · ihr ${stem}t` }]
```

3. `NOUN_FORM_OVERRIDES` / `VERB_FORM_OVERRIDES` — ручные списки для неправильных случаев (`buch→Bücher`, `lesen→lese/liest/lest`, …). Всего 10 существительных и небольшой набор глаголов.

Т.е. **словоформы покрываются перебором наперёд, вручную**. Для закрытого набора из 68 уроков это работает (есть даже регресс-тест `tools/check_tips.js`), для произвольного книжного текста **не масштабируется** — это главный технический риск задачи (см. §11).

---

## 5. КАРТОЧКИ (флешкарты)

### Где реализовано

| Слой | Путь |
|---|---|
| Логика | **`js/flashcards.js`** (171 строка), модуль `Flashcards` |
| Разметка | **дублируется в каждой оболочке урока**, напр. `lessons/a1/lesson-02/index.html:156–206` |
| Стили | **`css/exercises.css:345–420`** (секция `5. FLASHCARDS`) + `css/base.css:421,461` (светлая тема) |

### Как устроено

**Компонента как такового нет** — это не переиспользуемый компонент, а модуль, жёстко привязанный к фиксированным DOM-id. Никаких props: `init()` не принимает аргументов и **сам берёт данные из глобали**:

```js
// js/flashcards.js:24
function init() {
  if (!LESSON_DATA?.vocabulary) return;
  elCard    = document.getElementById('flashcard');
  elCardDE  = document.getElementById('cardDE');
  elCardRU  = document.getElementById('cardRU');
  elCardIPA = document.getElementById('cardIPA');
  elActions = document.getElementById('cardActions');
  elCounter = document.getElementById('cardCounter');
  elDots    = document.getElementById('cardDots');
  elComplete= document.getElementById('lessonComplete');
  …
  deck = LESSON_DATA.vocabulary.map(w => ({ ...w }));
  totalCards = deck.length;
```

Требуемые DOM-id: `#flashcard`, `#cardDE`, `#cardRU`, `#cardIPA`, `#cardActions`, `#cardCounter`, `#cardDots`, `#lessonComplete` (+ в разметке есть `#cardIPAFront` и `#fcProgressFill`, которые модуль **не** использует).

**Лицевая сторона** (`.card-face.front`): подпись «Немецкое слово», `#cardDE` = `card.de`, кнопка 🔊 с inline-`onclick`:
```html
onclick="event.stopPropagation();TTS.speak(document.getElementById('cardDE').textContent)"
```
**Оборот** (`.card-face.back`): подпись «Перевод», `#cardRU` = `card.ru`, `#cardIPA` = `card.ipa || ''`.

**Анимация переворота** — CSS 3D (`css/exercises.css:372–398`):
```css
.flashcard-viewport { perspective: 1000px; }
.flashcard { height: 200px; transform-style: preserve-3d;
             transition: transform .5s cubic-bezier(.4,0,.2,1); }
.flashcard.flipped { transform: rotateY(180deg); }
.card-face { position: absolute; inset: 0; backface-visibility: hidden; }
.card-face.back { transform: rotateY(180deg); }
```
Переворот триггерится классом `.flipped` в `flip()` (`js/flashcards.js:69`); при перевороте **автоматически озвучивает** слово и показывает кнопки оценки.

**Управление:** клик по карточке, кнопки «😕 Не знал» / «✓ Знаю!», клавиши `Space` (перевернуть), `←` (again), `→` (good). Обработчик клавиш вешается на `document` **внутри `init()` без снятия** — повторный `init()` навесит второй listener.

Публичный API: `Flashcards.init()`, `.flip()`, `.handleAgain()`, `.handleGood()` + глобальные `cardFlip()`, `cardAgain()`, `cardGood()`.

### Можно ли переиспользовать «как есть» с произвольным списком слов

**Нет, как есть — нельзя.** Три жёстких зацепа:

1. `init()` читает **только** `LESSON_DATA.vocabulary` (глобаль), передать колоду снаружи невозможно.
2. Привязка к глобально уникальным DOM-id — две колоды на одной странице невозможны.
3. `finishRound()` (`js/flashcards.js:106`) вызывает `Progress.markSectionDone('flashcards', …)`, а `markSectionDone` жёстко валидирует имя по `REQUIRED_SECTIONS = ['flashcards','fill','choice','match','dict']` (`js/progress.js:32`) и при завершении дёргает `tryFinishLesson()` → баннер «Урок завершён» + XP урока. Для колоды из книги это некорректное поведение.

**Минимальная доработка (≈15–30 строк, обратно совместимая):**
```js
function init(opts = {}) {
  const source = opts.cards || LESSON_DATA?.vocabulary;
  const ids    = opts.ids || {};            // переопределение DOM-id
  const onDone = opts.onDone || (score => Progress.markSectionDone('flashcards', score));
  …
}
```
Карточке нужны всего три поля: `{ de, ru, ipa }` — их легко собрать из слов, накопленных при чтении.

### Система интервальных повторений (SRS)

**Настоящего SRS нет.** В UI написано «Интервальное повторение», по факту это **разовый двухпроходный цикл в пределах одной сессии**:

```js
// js/flashcards.js:106
function finishRound() {
  if (again.length > 0) {           // второй проход: только «не знал»
    deck = again; again = []; current = 0;
    buildDots(); showCard(0);
  } else { … Progress.addXP(25); Progress.markSectionDone('flashcards', computeScore()); }
}
```

- Никакого SM-2, Leitner, Anki-подобного алгоритма;
- **не хранятся** интервалы, `easeFactor`, `dueDate`, число повторений, история ответов;
- всё состояние (`deck`, `again`, `current`, `flipped`) — обычные переменные модуля, **обнуляются при перезагрузке страницы**;
- персистится только агрегат: `computeScore()` = `(totalCards - again.length) / totalCards * 100`, сохраняется как `scores.flashcards` в `dm_sections:<lessonId>`;
- «выученность отдельного слова» не хранится **нигде**.

XP: +5 за каждое «Знаю», +25 за завершение круга, +`meta.xpReward` за урок целиком.

---

## 6. ХРАНЕНИЕ ДАННЫХ

### Способ персистентности

**`localStorage`** (браузер) + **Upstash Redis** (облако, только Telegram). Нет: SQLite, IndexedDB, Hive, Room, Realm, ORM. Схем и миграций нет.

### Полная карта ключей localStorage

| Ключ | Где определён | Тип | Содержимое |
|---|---|---|---|
| `dm_progress` | `js/progress.js:17` | JSON | глобальный прогресс (см. ниже) |
| `dm_sections:<lessonId>` | `js/progress.js:18` | JSON | секции одного урока, напр. `dm_sections:a1-01` |
| `dm_last_lesson` | `js/progress.js:19` | string | id последнего открытого урока |
| `dm_theme` | `js/lesson-render.js:2258` | `'dark'｜'light'` | текущая тема |
| `dm_tts_debug` | `js/tts.js:19` | `'1'` | флаг отладочного оверлея TTS |
| `tg_welcomed` | `js/telegram.js:64` | `'1'` | приветствие в Telegram показано |
| `dm_install_banner_hidden` | `js/install-app.js:109` | `'1'` | **sessionStorage**, баннер установки скрыт |

### Схема `dm_progress` (`js/progress.js:44`)

```js
const defaults = {
  xp: 0,                   // number  — суммарный опыт
  streak: 0,               // number  — дней подряд
  lastActive: null,        // string  — ISO-дата 'YYYY-MM-DD'
  completedLessons: [],    // string[] — ['a1-01', 'a1-02', …]
  lessonScores: {}         // { [lessonId: string]: number 0..100 }
};
```

### Схема `dm_sections:<lessonId>` (`js/progress.js:107`)

```js
{
  done:   ['flashcards', 'fill', 'choice', 'match', 'dict'],  // подмножество REQUIRED_SECTIONS
  scores: { flashcards: 87, fill: 100, … }                    // 0..100, целые
}
```

Константы: `REQUIRED_SECTIONS = ['flashcards','fill','choice','match','dict']` (`js/progress.js:32`), `XP_PER_LEVEL = 200` (`js/progress.js:20`).

### Облако (`api/webhook.py`)

- Хранилище: Upstash Redis через REST, одна строка на пользователя;
- Ключ: **`dm:progress:<telegram_user_id>`** (`api/webhook.py:261`);
- Значение: JSON вида `Progress.exportAll()` = `{ progress: {…}, sections: { 'a1-01': {…}, … }, lastLesson: 'a1-03' }` (`js/progress.js:434`);
- Функции: `read_progress(uid)` (`api/webhook.py:260`), `write_progress(uid, data)` (`api/webhook.py:270`), `_upstash(command)` (`api/webhook.py:244`);
- Авторизация: `verify_init_data(init_data, bot_token, max_age=86400)` (`api/webhook.py:220`) — HMAC-SHA256 по Telegram `initData`, TTL 24 ч. Без валидного `initData` → 401.
- Клиент: `js/cloud-sync.js` — `pull()` при открытии, debounce-`push()` 1500 мс на любое изменение (`Progress.subscribe`), финальный `flush()` через `navigator.sendBeacon` на `pagehide`/`visibilitychange`.

### Стратегия слияния (готовый CRDT-подобный merge)

`Progress.importAll(cloud)` (`js/progress.js:467`) + `_mergeGlobal(a, b)` (`js/progress.js:444`):
- `xp`, `streak` → `Math.max`;
- `lastActive` → лексикографически позднее;
- `completedLessons` → объединение `Set`;
- `lessonScores`, `sections[].scores` → `Math.max` по ключу;
- `sections[].done` → объединение `Set`.

Ничего не затирается — прогресс с разных устройств складывается.

### «Выученность» слова и статистика пользователя

- **Выученность отдельного слова не хранится нигде.** Ни в localStorage, ни в облаке. Гранулярность — «секция урока».
- Статистика пользователя: только `xp`, `streak`, `lastActive`, список пройденных уроков и проценты по секциям. Нет: времени занятий, количества ошибок по словам, истории ответов.

### Миграции схемы

**Отсутствуют.** Нет поля `version`, нет кода миграции. Совместимость обеспечивается только:
- `{ ...defaults, ...JSON.parse(raw) }` при чтении (`js/progress.js:52`) — новые поля получают дефолт;
- фильтрацией мусора: `stored.done.filter(s => REQUIRED_SECTIONS.includes(s))` (`js/progress.js:163`);
- `try/catch` вокруг каждого доступа к storage.

Исторические миграции делались одноразовыми python-скриптами (`patch_*.py`, `tools/legacy/`) — но это миграции **файлов проекта**, а не данных пользователя.

---

## 7. МОДЕЛЬ СЛОВА

### Есть ли сущность «слово»

Отдельного класса/типа нет (проект без типизации), но есть **три устойчивых формата-контракта**.

**а) Запись словаря урока** — `LESSON_DATA.vocabulary[]` (`data/**/*.js`):

```js
{ de: 'die Freizeit', ru: 'свободное время', ipa: '[ˈfʁaɪ̯ˌtsaɪ̯t]', article: 'die' }
{ de: 'können',       ru: 'мочь, уметь',     ipa: '[ˈkœnən]',        article: ''    }
```

| Поле | Тип | Есть? | Комментарий |
|---|---|---|---|
| `de` | string | ✅ | немецкое слово, **с артиклем прямо в строке** («die Freizeit») |
| `ru` | string | ✅ | перевод |
| `ipa` | string | ✅ | транскрипция в квадратных скобках |
| `article` | string | ✅ | `'der'｜'die'｜'das'｜''` (дублирует префикс `de`) |
| часть речи | — | ❌ | **отсутствует** в vocabulary (есть только как `kind` в словаре подсказок) |
| пример употребления | — | ❌ | отсутствует (примеры живут отдельно, в `phrases[]`) |
| уровень (A1/B1…) | — | ❌ | не у слова; выводится из уровня урока |
| статус изучения | — | ❌ | **отсутствует полностью** |
| лемма / начальная форма | — | ❌ | отсутствует |
| id | — | ❌ | отсутствует |

**б) `WordInfo` словаря подсказок** — см. §4 (`word`, `kind`, `translations[]`, `details[]`, `conjugations[]`).

**в) Строка `COURSE_WORDS_RAW`** — `слово|перевод|часть речи|детали`. Здесь **часть речи есть** (`Существительное`, `Глагол`, `Предлог`, `Прилагательное`, `Форма мн. числа`, `Форма глагола`, `Артикль`, …).

Смежные сущности в тех же data-файлах:
```js
// phrases[]
{ de: 'Ich lese gern Bücher.', ru: 'Я люблю читать книги.',
  note: 'gern + глагол = делать с удовольствием', audio: 'Ich lese gern Bücher' }
// exercises.matching[]
{ id: 1, de: 'können', ru: 'мочь, уметь' }
// exercises.dictation[]
{ word: 'Freizeit', audio: 'Freizeit' }
// exercises.fillBlanks[]
{ before: '— Ich', blank: 'kann', after: 'sehr gut kochen.',
  translation: '— Я очень хорошо умею готовить.',
  hintWord: 'kann', hintRule: 'können для ich → kann (без окончания!)' }
// exercises.multipleChoice[]
{ question: '…', options: ['…','…','…','…'], correctIndex: 1 }
// grammar[].conjugation[]
{ pronoun: 'ich', form: 'lese', translation: 'читаю', audio: 'lese' }
```

Обратите внимание на поле **`audio`** — отдельная «озвучиваемая» версия текста без знаков препинания. Для читалки такой же приём пригодится.

### Откуда берутся слова сейчас

**Только встроенный датасет, зашитый в исходники.** Ни API, ни пользовательского ввода, ни базы.

1. 68 файлов `data/<lvl>/<lvl>-lesson-NN.js` — по ~20–26 слов и ~20–24 фразы на урок (≈600+ слов по README);
2. `COURSE_WORDS_RAW` в `js/lesson-render.js` — ~1128 строк словаря подсказок;
3. `BASIC_WORDS` (~56) + `EXTRA_WORDS` (~210) + `COMMON_VERB_FORMS` там же.

### Формат и расположение файлов данных

- Формат: **не JSON, а исполняемый JS** — `const LESSON_DATA = {…};` в глобальной области. Загружается обычным `<script src="../../../data/a1/a1-lesson-01.js?v=51">` **до** движка.
- Плюс: работает без `fetch`, кешируется SW как обычный ассет.
- Минус: **на странице может быть только одна `LESSON_DATA`** (это `const` в глобальной области) — для читалки нельзя загрузить «книгу» тем же приёмом, не конфликтуя с именем; нужна своя глобаль (`BOOK_DATA`) или честный `fetch(...).then(r => r.json())`.

---

## 8. UI И СТИЛИ

### Система тем/стилей

Собственная система на **CSS custom properties**, без Tailwind/Bootstrap/какой-либо библиотеки компонентов. Всё в `css/base.css:9–89`.

**Цвета (тёмная тема — дефолт, `:root`):**
```css
--bg:#0f0e17;  --surface:#1a1929;  --surface2:#232136;  --surface3:#2a2740;
--border:#2e2b4a;  --border-light:#3d3960;
--accent:#e8c547;  --accent2:#7c6af7;  --accent3:#f06b6b;
--green:#56d899;   --blue:#5bb8f5;
--text:#e8e6f0;  --text-muted:#8b87a8;  --text-dim:#5c5878;  --text-strong:#ffffff;
--tint:rgba(255,255,255,.04);  --tint-border:rgba(255,255,255,.06);
--correct:#56d899;  --wrong:#f06b6b;
```
**Светлая тема** — переопределение тех же токенов в `[data-theme="light"]` (`css/base.css:37–62`).

**Отступы / радиусы / тени / переходы** (`css/base.css:65–89`):
```css
--sp-xs:4px --sp-sm:8px --sp-md:16px --sp-lg:24px --sp-xl:32px --sp-2xl:48px
--r-sm:8px --r-md:12px --r-lg:16px --r-xl:24px --r-full:9999px
--shadow-sm/md/lg, --shadow-accent
--t-fast:.15s ease  --t-normal:.25s ease  --t-slow:.4s cubic-bezier(.4,0,.2,1)
```

**Типографика:** Google Fonts, `@import` в `css/base.css:6` — `Playfair Display` (700/900, заголовки и `.card-de`), `DM Sans` (основной текст), `DM Mono` (IPA, код).

### Тёмная тема и переключение

Да, тёмная — **тема по умолчанию**. Механика:
- атрибут `data-theme` на `<html>`;
- сохранение в `localStorage['dm_theme']`;
- `initTheme()` (`js/lesson-render.js:2284`) — применить при загрузке;
- `toggleTheme()` (`js/lesson-render.js:2291`) — переключить и обновить иконку кнопок `#themeToggle,#themeToggle2` (☀️/🌙);
- кнопка вставляется в `.lesson-meta` из `renderHeader()` (`js/lesson-render.js:2126`);
- в Telegram тема может форсироваться светлой по `TG.colorScheme` (`js/telegram.js:31`);
- **Функции `initTheme`/`toggleTheme` продублированы** в `index.html:551–566` и `js/lesson-render.js:2284` — типичная для проекта дупликация.

### Готовые попапы / bottom sheet / тултипы

| Готовый примитив | Где | Пригодность для читалки |
|---|---|---|
| **`.word-tip`** — всплывающая подсказка над словом с переводом | `css/lesson.css:180–284`, логика `js/lesson-render.js:1858–2016` | 🔥 **прямо то, что нужно** для потапного перевода |
| `.dm-modal` / `.dm-card` — центрированная модалка с блюром, Esc и кликом по фону | `css/base.css:544–569`, `js/support.js:57–70` | подойдёт для «сборника слов», настроек |
| `.dm-toast` — тост снизу по центру | `css/base.css:692–706`, `js/support.js:45` | «слово добавлено в словарь» |
| `.dm-choice`, `.dm-btn`, `.dm-btn-ghost` | `css/base.css` | кнопки в модалках |
| **bottom sheet** | — | **отсутствует** |
| `.hint-*` — подсказка в упражнениях | `js/exercises.js:112` | не для читалки |

**Механика `.word-tip` (готовый движок тултипа) — разбор:**

- Разметка генерится строкой в `renderWord(word, phrase)` (`js/lesson-render.js:1883`):
```js
function renderWord(word, phrase = {}) {
  const tip = renderWordTip(word);
  const classes = `word-speak${tip ? ' word-has-tip' : ''}`;
  return `<span class="${classes}" tabindex="0"
    onclick="event.stopPropagation();speak('${jsStr(word)}')">${esc(word)}<span class="wi">🔊</span>${tip}</span>`;
}
```
- Содержимое (`renderWordTip`, `js/lesson-render.js:1858`): `.word-tip-kicker` (часть речи), `.word-tip-title` (слово), `.word-tip-ru` (перевод), `.word-tip-meta` (детали), `.word-tip-conj` (спряжения). **Если перевода и деталей нет — тултип не создаётся вовсе**, слово остаётся просто кликабельным для озвучки.
- Позиционирование — `positionWordTip(el)` (`js/lesson-render.js:1922`): `position:fixed`, учитывает `window.visualViewport` (важно для Telegram и мобильной клавиатуры), сам решает «сверху/снизу» (класс `.word-tip-below`), клампится в границы экрана, двигает стрелку через `--word-tip-arrow-left`.
- Хитрость: `mountWordTip(el)` (`js/lesson-render.js:1910`) **переносит `.word-tip` в `document.body`**, оставляя вместо него HTML-комментарий-плейсхолдер, чтобы не обрезался `overflow` родителя; `closeWordTips()` возвращает обратно через `placeholder.replaceWith(tip)`.
- Одновременно открыт **ровно один** тултип (`activeWordTip`, `wordTipPinned`).

### Обработка жестов

**Общего подхода / абстракции жестов нет.** Обработчики вешаются точечно:

1. **Единственное централизованное место — `initWordTips()`** (`js/lesson-render.js:1981`), делегирование на `document` в capture-фазе:
```js
document.addEventListener('mouseover',  e => {…}, true);   // hover → показать
document.addEventListener('mouseout',   e => {…}, true);   // с задержкой 120 мс
document.addEventListener('click',      e => {…}, true);   // клик → «прибить» (pinned)
document.addEventListener('touchstart', e => {…}, { capture: true, passive: true });
window.addEventListener('resize', () => closeWordTips());
window.addEventListener('scroll', () => closeWordTips(), true);
```
Цель ищется через `wordTipTarget(target)` → `el.closest('.word-has-tip')` — классическая делегация, идеально подходит для длинного текста книги.

2. **Разблокировка аудио** — `document.addEventListener('touchend'|'click', unlock, {passive:true})` (`js/tts.js:290`).

3. **Всё остальное — inline `onclick` прямо в HTML-строках**: `onclick="speak('…')"`, `onclick="cardFlip()"`, `onclick="openBooksModal()"`, `onclick="toggleSidebar()"`. Это доминирующая конвенция проекта.

**Чего нет:** swipe, long-press, pinch/zoom, pointer-события, drag. Свайп-листание страниц книги придётся писать с нуля. Защита от конфликта «свайп vs выделение текста» тоже отсутствует как класс.

---

## 9. СОСТОЯНИЕ И АСИНХРОННОСТЬ

### Менеджер состояния

**Отсутствует.** Ни Redux, ни Zustand, ни Context, ни MobX, ни собственного стора. Состояние живёт в трёх местах:

1. **Глобальные константы страницы**: `LESSON_DATA`, `CURRENT_LESSON_NUM`, `CURRENT_LESSON_LEVEL` — объявляются в data-файле и boot-скрипте оболочки.
2. **Приватные переменные IIFE-модулей**: `Flashcards`: `deck/again/current/flipped/totalCards`; `LessonRender`: `wordLexicon/activeWordTip/wordTipPinned`; `Progress`: `_currentLessonId/_doneSections/_sectionScores`; `TTS`: `audio/actx/currentSource/bufCache/hlSpans`.
3. **`localStorage`** — единственный персистентный слой.

Единственный намёк на реактивность — **мини pub/sub в `Progress`** (`js/progress.js:23–25`):
```js
const _subs = [];
function subscribe(fn) { if (typeof fn === 'function') _subs.push(fn); }
function _notify() { _subs.forEach(fn => { try { fn(); } catch (e) {} }); }
```
`_notify()` дёргается из `save()` / `setLastLesson()`; единственный подписчик — `cloud-sync.js`. Отписки нет.

Обновление UI — **императивное**, прямыми DOM-манипуляциями: `renderXP`, `renderStreak`, `renderSectionProgress`, `renderHomeProgress`, `renderLessonProgress`.

### Асинхронность

Только `fetch` + `.then()` цепочки. **`async/await` в проекте не используется ни разу.** Отмены запросов нет (`AbortController` отсутствует).

Устоявшийся шаблон — «тихая деградация без индикатора загрузки»:

```js
// js/cloud-sync.js:33
fetch(API, { method:'POST', headers:{'Content-Type':'application/json'},
             body: JSON.stringify({ initData: id }) })
  .then(r => r.json())
  .then(json => { if (json && json.ok && json.data) { … } })
  .catch(() => {});                       // ← молча глотаем

// js/tts.js:239
playWebAudio(text, spans)
  .then(() => diag('✅ WebAudio сыграл'))
  .catch(e => { diag('…'); playAudioEl(text, spans); });   // ← фолбэк вместо ошибки
```

**Спиннеров, скелетонов, состояний loading/error в UI нет ни одного.** Ошибки видны только через опциональный `dm_tts_debug`-оверлей. `keepalive: true` и `navigator.sendBeacon` используются для выгрузки прогресса при уходе со страницы.

---

## 10. ПРОЧЕЕ

### Локализация (i18n)

**Системы i18n нет.** Весь интерфейс **захардкожен по-русски** прямо в HTML/JS (`Карточка 1 из 10`, `Урок завершён!`, `✅ 3/5 секций`). `<html lang="ru">`, `manifest.json: "lang": "ru"`.
Фактически двуязычный контент (немецкий ↔ русский), но это **предметная область, а не локализация UI**. Целевая аудитория жёстко — русскоговорящие.

### Офлайн

Да, через Service Worker (`service-worker.js`, `CACHE = 'deutsch-meister-v66'`):
- `install` — прекеш «оболочки»: `/`, `index.html`, `manifest.json`, 4 CSS, 9 JS, иконка (все с `?v=51`);
- `activate` — удаление всех кешей, кроме текущего, + `clients.claim()`;
- `fetch` — **network-first для всего** (и HTML, и JS/CSS), кеш только как офлайн-фолбэк. Это сознательное решение (коммит `983de5a` «SW: serve JS/CSS network-first to end cache-testing pain»);
- **кросс-доменные запросы не перехватываются вовсе** (`service-worker.js:56`) — иначе на iOS ломается аудио;
- страницы уроков и data-файлы **не прекешируются** — попадают в кеш при первом посещении;
- поддержан `postMessage('SKIP_WAITING')` + `controllerchange` → одноразовая перезагрузка (`index.html:492`).

**Итог для читалки:** тексты, лежащие статикой рядом, автоматически станут офлайн-доступными после первого открытия. Аудио — нет.

### Тесты

**Юнит/интеграционных тестов нет.** Нет Jest/Vitest/pytest/Playwright. Вместо них — валидаторы:

| Инструмент | Запуск | Что делает |
|---|---|---|
| `scripts/validate_lessons.py` | `make validate` / CI | количество уроков (20/20/14/14); непустые `id/title/meta/phrases/vocabulary/grammar/exercises`; соответствие `id` пути; отсутствие дублей и «осиротевших» оболочек; **все `?v=N` одинаковы** (рассинхрон = ошибка); покрытие слов подсказками (warning). Код возврата 1 при ошибках |
| `tools/check_tips.js` | `make check-tips` | Node + `vm`: прогоняет `lesson-render.js` с DOM-стабом в изолированном контексте, рендерит подсказку для каждого слова каждой фразы, **падает, если у подсказки нет русского перевода** (кириллицы) |
| `scripts/check_api.sh` | `make check-api` | смоук-тест задеплоенного бэкенда |

CI: `.github/workflows/validate.yml` — `validate_lessons.py` на каждый push и PR (Python 3.12). `check_tips.js` в CI **не включён**.

### Линтер / форматтер

**Отсутствуют полностью.** Нет ESLint, Prettier, Stylelint, ruff, black, flake8, нет `.editorconfig`. Стиль поддерживается вручную.

### Конвенции кодстайла (наблюдения)

**Файлы и каталоги**
- kebab-case: `lesson-render.js`, `cloud-sync.js`, `install-app.js`, `a1-lesson-01.js`;
- номера уроков с ведущим нулём: `lesson-01`, `a1-lesson-01.js`;
- id урока: `<level>-<NN>` в нижнем регистре — `'a1-01'`, `'b2-14'`;
- каждый урок — своя папка с `index.html` (для чистых URL на GitHub Pages).

**JS**
- 2 пробела, точки с запятой обязательны, одинарные кавычки, template-strings для HTML;
- модуль = `const Name = (() => { … return { … }; })();`, PascalCase для модуля, camelCase для функций;
- приватные хелперы с подчёркиванием: `_loadSections`, `_ensureLessonContext`, `_mergeGlobal`, `_notify`;
- шапка каждого файла — ASCII-рамка `═══` с описанием, разделители секций `/* ── Название ── */`;
- **комментарии по-русски** (в старых файлах встречаются английские);
- активный optional chaining и `??`: `LESSON_DATA?.vocabulary`, `getScore() ?? null`;
- **везде защитное программирование**: `try {} catch {}` вокруг любого `localStorage`, ранние `return` при отсутствии DOM-узла (`if (!elCard) return;`);
- обязательное экранирование строк: `esc()` для HTML (`js/lesson-render.js:101`), `jsStr()` для вставки в inline-`onclick` (`js/lesson-render.js:108`), `Exercises.escapeHtml()`;
- обработчики из HTML вызываются глобальными функциями-алиасами, экспорт через `Object.assign(window, {…})` (`js/support.js:235`);
- `event.stopPropagation()` в inline-обработчиках вложенных кликабельных элементов.

**CSS**
- один общий токен-слой в `base.css`, дальше файлы по зонам ответственности;
- нумерованные секции в комментариях (`/* ══ 5. FLASHCARDS ══ */`);
- **всегда var()-токены**, hex-цвета в компонентах почти не встречаются;
- BEM-подобные, но вольные имена: `.phrase-card`, `.word-tip-ru`, `.fc-dot.done`, `.dm-btn-ghost`;
- префиксы-неймспейсы: `dm-` (модалки/донат), `fc-` (флэшкарты), `tgw-` (Telegram welcome), `word-` (подсказки), `lc-` (карточка урока в карте курса).

**Git / деплой (жёсткие правила, описаны в README и `ДЕПЛОЙ-инструкция.md`)**
1. Изменил JS/CSS/данные → **обязательно** `python bump_version.py` (`make bump`). Руками `?v=` не править никогда.
2. `git push origin main` → GitHub Pages сам пересобирает фронт.
3. Изменил `api/` → **отдельно** `vercel --prod` (`make deploy-api`), Vercel к Git не подключён.
4. Сообщения коммитов — смешанные RU/EN, повелительное наклонение.

---

## 11. ОЦЕНКА: ЧТО ПЕРЕИСПОЛЬЗОВАТЬ, ЧТО ДОРАБОТАТЬ, ГДЕ РИСКИ

### ✅ Переиспользуется без изменений

| Механизм | Файл | Как применить в читалке |
|---|---|---|
| **Позиционирование тултипа** — `mountWordTip` / `positionWordTip` / `openWordTip` / `closeWordTips` | `js/lesson-render.js:1910–1979` | Готовое ядро попапа перевода: `visualViewport`, авто-флип сверху/снизу, кламп по краям, стрелка, портал в `body`. Писать заново незачем |
| **Делегирование жестов на `document`** — `initWordTips()` | `js/lesson-render.js:1981` | Один набор слушателей на весь документ. Для текста из тысяч `<span>` это единственный правильный подход — работает без изменений |
| **CSS тултипа** `.word-tip*` | `css/lesson.css:180–284` | Полностью готово, обе темы поддержаны |
| **`TTS.speak / speakPhrase / speakSlow`** | `js/tts.js:246–288` | Озвучка слова по тапу — вызывается как есть |
| **Синхронная подсветка `hlByDuration(spans, durSec)`** | `js/tts.js:114` | Караоке-подсветка предложения при чтении вслух — именно то поведение, которое ждут от читалки. Работает и в Telegram |
| **Прокси `/api/tts`** | `api/webhook.py:172–210` | Менять не нужно (кроме лимита 200 симв., см. ниже) |
| **Дизайн-токены + тёмная/светлая тема** | `css/base.css:9–89` | Читалка сразу получает обе темы через `var(--…)` |
| **Модалка `.dm-modal` + `dmOpen/dmClose/dmToast`** | `js/support.js:57–70`, `css/base.css:544` | Экран «мой словарь», настройки чтения, тосты «слово добавлено» |
| **Merge-логика прогресса** `_mergeGlobal` / `importAll` | `js/progress.js:444–495` | Синк словаря читалки между устройствами по той же схеме max/union |
| **Облачный транспорт** `cloud-sync.js` + `/api/progress` | `js/cloud-sync.js`, `api/webhook.py:244–280` | Вся авторизация и Redis уже есть; словарь читателя влезет в тот же снапшот |
| **Service Worker** | `service-worker.js` | Тексты книг закешируются автоматически (same-origin, network-first) |
| **`bump_version.py` + `validate_lessons.py`** | корень, `scripts/` | Новые файлы читалки подхватятся, если следовать соглашению `?v=N` |
| **Токенайзер текста** | `js/lesson-render.js:2145` | `p.de.match(/[A-Za-zÄäÖöÜüßÉé]+|[^A-Za-zÄäÖöÜüßÉé\s]+|\s+/g)` — годится для книжного текста как есть |

### 🔧 Придётся дорабатывать

| Что | Почему | Объём |
|---|---|---|
| **Источник переводов** | `getWordInfo()` работает по `Map`, собранной из `LESSON_DATA` текущего урока + ~1400 захардкоженных слов. Для книги `LESSON_DATA` нет, а покрытие словаря будет дырявым | **Главная работа.** Либо большой офлайн-словарь, либо новый эндпоинт перевода |
| **Лемматизация** | Её фактически нет: формы добавляются перебором вперёд и ручными оверрайдами на 10 существительных. В книге будет `gingen`, `dachte`, `Häuser`, отделяемые приставки (`steht … auf`), склонённые прилагательные | Нужен нормализатор (правила + список неправильных глаголов), либо словарь, где ключи — все словоформы |
| **`Flashcards.init()`** | Читает только `LESSON_DATA.vocabulary`, привязан к глобальным DOM-id, по завершении дёргает `Progress.markSectionDone('flashcards')` → баннер «Урок завершён» | ~15–30 строк: параметр `init({cards, ids, onDone})` с сохранением текущего поведения по умолчанию |
| **`Progress`** | `REQUIRED_SECTIONS` жёстко из 5 секций урока; прогресс только на уровне урока. «Выученность слова» хранить негде | Новый ключ (напр. `dm_reader_words`) + свой merge; **не трогать** существующую схему, чтобы не поломать синк |
| **Модель слова** | В `vocabulary[]` нет части речи, статуса изучения, леммы, id, контекста | Новый тип записи для читалки: `{de, lemma, ru, pos, article, ipa, context, bookId, addedAt, status}` |
| **TTS для длинного текста** | Лимит **200 символов** на запрос (`js/tts.js:192`, `api/webhook.py:181`). Абзац книги не влезет | Резать по предложениям и ставить в очередь; сейчас очереди нет — `stopCurrent()` прерывает предыдущее |
| **Скорость чтения** | `rate` действует только на `speechSynthesis`; mp3-путь (а в Telegram он единственный) скорость не меняет | Добавить `playbackRate` на `<audio>` / `AudioBufferSourceNode.playbackRate` |
| **Загрузка контента** | `LESSON_DATA` — глобальный `const`, одна на страницу. Для книги так нельзя | Свой `BOOK_DATA`/`fetch` JSON, с учётом офлайна |
| **Свайпы/листание** | Жестов, кроме tap/hover, в проекте нет | Писать с нуля; отдельно — конфликт со скроллом и выделением текста |
| **Кнопка входа** | `openBooksModal()` — заглушка-модалка | Замена на переход; **править нужно только `js/support.js`**, а не 69 HTML |
| **Индикаторы загрузки** | В проекте нет ни одного loader/error-состояния | Для книги с загрузкой текста потребуются — новый паттерн для этого кода |

### ⚠️ Узкие места и риски

1. **Словарь переводов — главный риск.** Текущий подход (~1400 слов, вручную поддерживаемых, с регресс-тестом `check_tips.js`) масштабируется на 68 контролируемых уроков, но не на произвольную книгу. Покрытие «каждого слова» потребует словаря на десятки тысяч словоформ. Если делать это в том же стиле (константа внутри `.js`), файл `lesson-render.js` (уже 2316 строк, из них ~1130 — данные) станет неуправляемым.
   *Рекомендация:* вынести словарь читалки в отдельные data-файлы (шардировать по первой букве / по книге) и **не смешивать** с `COURSE_WORDS_RAW`.

2. **Отсутствие лемматизации → «дырки» в подсказках.** Сейчас, если слова нет в словаре, `renderWordTip` возвращает `''` и слово просто теряет подсказку, **молча**. В уроке это ловит валидатор; в книге пользователь просто увидит слова без перевода. Нужна явная деградация («перевод не найден» + возможность озвучить).

3. **Производительность DOM на длинном тексте.** `renderWord()` для каждого слова генерирует `<span>` **со встроенным полным HTML тултипа внутри**. На фразе из 6 слов это нормально; на главе из 3000 слов — это 3000 span'ов + 3000 вложенных тултипов = десятки тысяч узлов и заметные фризы.
   *Рекомендация:* рендерить тултип **лениво**, в момент открытия (`renderWordTip(word)` уже синхронный и дешёвый), а в span'ы класть только текст. Плюс — постраничная нарезка/виртуализация текста.

4. **Inline-`onclick` с конкатенацией строк.** Текущая конвенция `onclick="speak('${jsStr(word)}')"` требует аккуратного экранирования (`jsStr` обрабатывает `\`, `'`, переводы строк). На произвольном книжном тексте (кавычки-ёлочки, апострофы, тире, эмодзи) это зона багов и потенциального XSS, если текст книги придёт извне. Для читалки лучше делегирование + `dataset`, а не inline-строки.

5. **Нет офлайн-озвучки.** SW не кеширует аудио принципиально (iOS). В офлайне читалка в Telegram будет немой.

6. **Глобальное пространство имён.** Всё висит на `window` (`LESSON_DATA`, `speak`, `Progress`, …). Новые имена читалки обязаны быть уникальными; коллизия проявится как молчаливая поломка урока.

7. **Дупликация кода как системная проблема.** `initTheme`/`toggleTheme`/`openSidebar` существуют в двух-трёх копиях; сайдбар захардкожен в 69 файлах; `lesson-01` живёт на старом инлайновом рендере. Любое изменение «общего» UI сейчас = массовая правка. Читалку стоит строить так, чтобы не добавлять новых копий.

8. **Процесс деплоя легко нарушить.** Забыть `bump_version.py` = пользователи получат старые файлы; рассинхрон `?v=` = **красный CI**. Новые файлы читалки обязаны попасть и в `STATIC` в `service-worker.js`, и под правила `bump_version.py` (он ловит `src=`/`href=` на `.js`/`.css` в HTML — значит подключать скрипты читалки надо в том же стиле).

9. **`text[:200]` молча обрезает.** И клиент, и сервер режут без предупреждения — длинное предложение озвучится наполовину и никто не заметит.

10. **Прогресс завязан на `LESSON_DATA?.id`.** `Progress.init()` / `_ensureLessonContext()` предполагают, что открыт урок. На странице читалки `LESSON_DATA` не будет. Судя по коду, он защищён (`typeof LESSON_DATA !== 'undefined'` и `?.`), а `renderHomeProgress()` / `_ensureSectionBadge()` тихо выйдут, не найдя DOM — но это надо проверить в браузере до реализации.

### 📚 Как правильнее хранить тексты книг

**Рекомендация: статические файлы в репозитории, рядом с `data/`, разбитые по главам, загружаемые `fetch`-ем как JSON.**

Предлагаемая раскладка, ложащаяся на текущие соглашения:

```text
data/books/
├── index.json                  # каталог: id, title, автор, уровень, число глав, обложка
├── kafka-verwandlung/
│   ├── meta.json               # {id, title, author, level:'B1', chapters:12, …}
│   ├── ch-01.json              # {id:'ch-01', title, paragraphs:[{de:'…', ru:'…'}]}
│   └── ch-02.json
└── dictionary/                 # словарь читалки, шардированный
    ├── a.json  b.json  …       # {"gingen": {lemma:"gehen", ru:"шли", pos:"Глагол"}, …}
```

**Почему именно так:**

1. **Совпадает с текущей архитектурой.** Контент уже отделён от рендера (`data/` vs `js/`), 68 файлов данных лежат в репозитории. Книги — ровно тот же паттерн.
2. **Офлайн получается бесплатно.** Same-origin файлы попадают в SW-кеш при первом открытии (network-first + фолбэк). БД/бэкенд такого не дадут без ручной работы.
3. **Бэкенд не нужен.** Vercel-функция деплоится вручную и отдельно; добавление главы книги не должно требовать `vercel --prod`. GitHub Pages деплоит сам по push.
4. **Постраничная загрузка.** Глава ≈ 50–200 КБ — грузится мгновенно; вся книга одним файлом убьёт и память, и DOM.
5. **Валидируемо.** `scripts/validate_lessons.py` легко расширить проверкой книг (главы на месте, JSON парсится, `?v=` синхронны).

**Важный нюанс: JSON + `fetch`, а не `.js` с глобальной константой.** Уроки используют `<script src>` + `const LESSON_DATA`, но для книг это не подходит: глава выбирается в рантайме, а `const` в глобальной области допускает ровно одно значение на страницу. `fetch('data/books/<id>/ch-01.json?v=NN')` решает это и по-прежнему кешируется SW. Не забыть `?v=NN` — иначе `bump_version.py` пройдёт мимо (он ловит только `src=`/`href=` в HTML; версию для `fetch` придётся подставлять из JS-константы, которую bump стоит научить обновлять).

**Чего делать не стоит:**
- ❌ **Тексты в localStorage** — лимит ~5 МБ на весь домен, а там уже живёт прогресс. Риск `QuotaExceededError`, который в текущем коде глотается молча.
- ❌ **Загрузка с сервера/бэкенда** — ломает офлайн (ключевая фича, вынесена даже в приветственный экран Telegram), требует ручного деплоя Vercel на каждую главу и добавляет сетевые состояния, которых в проекте нет нигде.
- ❌ **IndexedDB как источник правды для текстов** — в проекте её нет вообще, новый слой абстракции ради того, что решается файлами. Но IndexedDB **уместна** для пользовательских данных читалки (закладки, накопленные слова, позиция чтения), если `localStorage` начнёт распухать.

**Гибрид, если книг станет много:** каталог (`index.json`) + главы в репозитории, а «мои книги / закладки / словарь пользователя» — в localStorage (`dm_reader_*`) с синком в тот же `/api/progress` по существующей merge-схеме.

---

## Краткая сводка по критичным пунктам

| Вопрос | Ответ |
|---|---|
| Озвучка | ✅ Есть, зрелая, 3-уровневый каскад, `TTS.speak(text, opts)` + караоке-подсветка `hlByDuration`. Ограничения: 200 симв., нет офлайна, скорость только для `speechSynthesis` |
| Перевод | ⚠️ API **отсутствует**. Только статический словарь ~1400 слов в `js/lesson-render.js` + `ru` в данных уроков. Кеш не нужен (всё в памяти) |
| Лемматизация | ❌ **Отсутствует**. Есть генерация форм вперёд + ручные оверрайды на 10 существительных |
| Карточки | ⚠️ Есть, но привязаны к `LESSON_DATA.vocabulary` и глобальным DOM-id; ~15–30 строк на параметризацию |
| SRS | ❌ **Отсутствует**. Двухпроходный цикл в рамках сессии, состояние не сохраняется |
| БД | `localStorage` + Upstash Redis (Telegram). Схем, ORM, миграций нет |
| Модель слова | `{de, ru, ipa, article}`. Нет: части речи, статуса изучения, леммы, примера, id |
| Тултип перевода | ✅ **Готов полностью** — `.word-tip` + `positionWordTip` с `visualViewport`, авто-флипом и порталом в body |
| Жесты | Только tap/hover через делегирование на `document`. Свайпов и long-press нет |
| Стейт-менеджер | ❌ Отсутствует. IIFE-модули + глобали + императивный DOM |
| i18n | ❌ Отсутствует, весь UI по-русски захардкожен |
| Тесты | Юнит-тестов нет; есть 2 валидатора данных (`validate_lessons.py` в CI, `check_tips.js` вручную) |
| Линтер | ❌ Отсутствует полностью |
| Экран-заглушка «книги» | `js/support.js:218` → `openBooksModal()`, кнопка в `index.html:280` + 68 оболочек + `gen_template.html:42` |
