# REVIEW_GLOSSARY.md — самопроверка глоссария «Die Bremer Stadtmusikanten»

Книга: `data/books/bremer` · 4 главы · 45 предложений · 1182 токена
Глоссарий: **501 словоформа → 376 лемм**.
Пометы «устар.»: 7 на словоформах, 19 на леммах.

Инструмент: `python scripts/audit_glossary.py bremer` — ничего не чинит,
только показывает контекст из текста. Проверка на прохождение:
`python scripts/validate_books.py` → **0 ошибок**.

---

## Исправлено по вычитке

Правки внесены **прямо в `glossary.json`** — он теперь источник правды,
скрипт-генератор больше не используется.

### Проверка перед правками

По требованию вычитки сначала вывел фактические предложения для 10 лемм,
которые могли оказаться из другой сказки: `Christkindlein`, `Hemdchen`,
`Sonntag`, `prophezeien`, `Bequemlichkeit`, `Frau`, `lieb`, `Hexe`,
`Richter`, `Gespenst`. **Все 10 найдены в тексте**, 7 из них — из одного
предложения `ch-02[2.2]` (монолог петуха про день Богородицы), `Hexe` и
`Richter` — из `ch-04[3.0]`, `Gespenst` — `ch-03[3.2]`, `Bequemlichkeit` —
`ch-04[0.0]`. Посторонних нет.

### Новый формат `glossary.w`

Значение словоформы теперь **либо строка-лемма, либо объект `{l, old}`**:

```json
"hause": { "l": "Haus", "old": "старый дательный с -e (im Hause, in dem Hause); сегодня im Haus. Внимание: nach Hause и zu Hause — живая норма" },
"esel":  "Esel"
```

Это решает проблему из прошлой итерации: помета висела на лемме и срабатывала
на всех её формах, хотя устарела ровно одна. Теперь `Haus`, `Weg`, `Dach`,
`Mist`, `Tag`, `vier` — чистые современные слова без пометы, а «устар.»
показывается только при тапе по архаичной форме.

Переехали на словоформу 7 помет: `ward`, `tage`, `hause`, `wege`, `dache`,
`miste`, `viere`. Итого: **7 помет на словоформах, 19 на леммах**.

`validate_books.py`: принимает оба вида, у объекта требует непустой `l`,
`old` — непустая строка если есть, лишние поля запрещены.
`audit_glossary.py`: добавлены `lemma_of()` / `form_old()` / `lookup()` /
`forms_of()`, плюс **новая проверка 11** — все пометы на словоформах с их
контекстом и предупреждение, если у той же леммы тоже есть `old` (дубль
в тултипе).

### Правки по леммам

| # | лемма | что сделано |
|---|---|---|
| 1 | `ward` | убрана как лемма; словоформа `ward` → `werden`, помета на словоформе |
| 2 | `mehr` | возвращена отдельной леммой: «больше; в nicht/kein … mehr — больше не. Формально компаратив от viel». Лемма `viel` удалена — на неё больше не ведёт ни одна словоформа |
| 3 | `herumjagen` | `jagte herum · hat herumgejagt` (было `ist`) |
| 4 | `Ende` | помета `old` снята, оборот `zu Ende gehen` остался в переводе |
| 5 | `Packan`, `Bartputzer`, `Grauschimmel` | `pos: "прозвище"`, `art`/`pl` убраны — грамматика была выдумана; `old` остался |
| 6 | `Asche`, `Wetter` | `pl: null` |
| 6 | `Ferne`, `Natur` | **оставлены как были** — Duden даёт `die Fernen` и `die Naturen` обычным мн. ч. (у `Asche` там же только «(technisch:) Aschen», поэтому её в `null`) |
| 7 | `gräulich` | добавлена оговорка про омонимию: «жуткий» от `Gräuel` ≠ «сероватый» от `grau` |

`weiter` оставлен свёрнутым в `weit`, `lieber` — в `gern`, как и просила вычитка.

### Валидатор: новый `pos "прозвище"`

Для него `art`, `pl` и `decl` **не требуются и не допускаются** — у прозвищ
из сказки словарной нормы нет, и любая грамматика там была бы выдумкой.
`old` при этом остаётся.

### Итог

**501 словоформа → 376 лемм** (было 377: ушёл `ward`, ушёл `viel`, вернулся
`mehr`). `validate_books.py` — 0 ошибок, `audit_glossary.py` — без замечаний
по всем 11 проверкам.

---

## Исправлено (первая итерация)

### 1. Дательный с -e — помета привязана к обороту, а не к слову

Прогнал все формы на `-e` через текст. **`nach Hause` / `zu Hause` в книге
не встречаются ни разу** — снимать было нечего, но формулировки я переписал:
раньше помета читалась как «слово устарело», теперь называет конкретный оборот.

| форма | фактическое предложение | вердикт |
|---|---|---|
| `Hause` | `im Hause brannte` · `in dem Hause sitzt` | архаичный датив, помета остаётся |
| `Wege` | `auf dem Wege liegen` · `an dem Wege` · `von ihrem langen Wege` | архаичный датив, помета остаётся |
| `Miste` | `an dem Miste vorbeirannte` | архаичный датив, помета остаётся |
| `Dache` | `oben auf dem Dache` | архаичный датив, помета остаётся |
| `Tage` | `in einem Tage nicht erreichen` | **добавил помету** — её не было |
| `Tage` | `wie drei Tage Regenwetter` | обычное мн. ч., НЕ архаизм |
| `Jahre` | `schon lange Jahre` | обычное мн. ч., пометы нет и не надо |

`Tag` — единственный случай, где одна и та же форма в книге и архаичный датив,
и нормальное множественное. Помета явно называет только `in einem Tage`.
В `Haus` добавил оговорку, что `nach Hause` / `zu Hause` — живая норма.

### 2. Субстантивированные прилагательные

Введён `pos: "субст. прил."` + поле `decl`, `art`/`pl` убраны.

| лемма | decl |
|---|---|
| `Abgeschickte` | `der Abgeschickte / ein Abgeschickter / die Abgeschickten` |
| `Landesflüchtige` | `der Landesflüchtige / ein Landesflüchtiger / die Landesflüchtigen` |

Больше субстантивированных в книге нет. Эвристика аудита предлагает ещё
11 кандидатов (`Auge`, `Ende`, `Ferne`, `Geselle`, `Herberge`, `Holzkeule`,
`Kohle`, `Laute`, `Mühle`, `Pauke`, `Schlafstätte`) — это ложные срабатывания
на «мн. ч. на -en», все они обычные существительные. Оставил как есть.

`validate_books.py`: для `субст. прил.` теперь **требуется** `decl` и
**запрещены** `art`/`pl`.

### 3. Слабое склонение (n-Deklination)

Добавлено поле `decl` — без него карточка врала в косвенных падежах.

| лемма | decl |
|---|---|
| `Herr` | `der Herr / des Herrn / dem Herrn / den Herrn / мн. die Herren` |
| `Geselle` | `der Geselle / des Gesellen / dem Gesellen / den Gesellen` |
| `Stadtmusikant` | `der Stadtmusikant / des Stadtmusikanten / dem Stadtmusikanten` |
| `Musikant` | `der Musikant / des Musikanten / dem Musikanten` |

`Mist` и `Rat` сначала попали в список по ошибке — эвристика ловила их на
концовках `-ist` / `-at`. Поправил: суффикс засчитывается, только если перед
ним осталось ≥3 букв.

`decl` у обычного существительного — необязательное поле; если есть, валидатор
требует непустую строку.

### 4. Компаративы и суперлативы — свёрнуты в базовую лемму

Было 4 самостоятельных леммы-формы. Стало: форма ведёт на базовое слово,
у базового слова появилось поле `forms` со всеми тремя степенями.

| форма в тексте | было | стало | степени |
|---|---|---|---|
| `besseres` | лемма `besser` | `gut` | `gut · besser · am besten` |
| `lieber` | лемма `lieber` | `gern` | `gern · lieber · am liebsten` |
| `mehr` | лемма `mehr` | `viel` | `viel · mehr · am meisten` |
| `weiter` | лемма `weiter` | `weit` | `weit · weiter · am weitesten` |

Заодно прошёл **весь раздел прилагательных**: степени сравнения проставлены
у всех 30 градуируемых (`alt`, `groß`, `hell`, `schwach`, `sicher`, `lang`,
`warm`, `schön`, `teuer`, `müde`, `schlecht`, `lieb`, `schwarz`, `voll`,
`lustig`, `ruhig`, `still`, `munter`, `stumpf`, `tüchtig`, `zufrieden`,
`gräulich`, `entsetzlich`, `lebendig`, `feurig`, `gewaltig` и др.).
Без степеней остались только неградуируемые причастия и относительные:
`gedeckt`, `erleuchtet`, `glühend`, `unverdrossen`, `untauglich`, `übrig`,
`fertig`, `Bremer`.

`lieber` — омоним: это и компаратив `gern`, и компаратив `lieb`. В тексте
`zieh lieber mit uns fort` — наречие, поэтому форма ведёт на `gern`.
Лемма `lieb` (из `unserer lieben Frauen`) существует отдельно и свои степени
тоже имеет.

### 5. Многозначные существительные — проверены по контексту

Все четыре оказались верными, менять не пришлось. Контекст:

| лемма | предложение из книги | вердикт |
|---|---|---|
| `Rat` | `aber nun ist guter Rat teuer` | совет-рекомендация → `die Ratschläge` ✓ (не `die Räte`) |
| `Licht` | `ein Licht anzuzünden` · `löschten sie das Licht aus` · `es scheine ein Licht` | свеча/огонёк → `die Lichter` ✓ (не `die Lichte`) |
| `Tor` | `da saß auf dem Tor der Haushahn` | ворота → `das Tor` ✓ (не `der Tor` «глупец») |
| `Mark` | `Du schreist einem durch Mark und Bein` | костный мозг → `das Mark` ✓ (не `die Mark`) |
| `Messer` | `ein Mann mit einem Messer` | нож → `das Messer` ✓ |

`Schloss`, `Bank`, `Gericht`, `Band`, `See` в книге не встречаются.

### 6. Существительные без множественного → `pl: null`

13 лемм переведены со строки-заглушки `"мн. ч. не употр."` на `null`:
`Erbarmen`, `Fleisch`, `Furcht`, `Futter`, `Geschrei`, `Lärmen`, `Mark`,
`Mist`, `Musik`, `Nachtmusik`, `Regenwetter`, `Schlaf`, `Tod`.

`Nachtmusik` раньше имел выдуманное `die Nachtmusiken` — убрал.

`validate_books.py` теперь различает три состояния:
* `pl` отсутствует → **ошибка** (забытая запись);
* `pl: null` → осознанное «множественного числа нет», ок;
* `pl: ""` → **ошибка** (пустая строка вместо решения).

`Leibeskräfte` намеренно оставлен строкой `"только мн. ч."` — это не
«нет множественного», а наоборот, pluraletantum.

### 7. Нерегулярное множественное — проверено

| лемма | pl | статус |
|---|---|---|
| `Spielmann` | `die Spielleute` | ✓ не `Spielmänner` |
| `Hauptmann` | `die Hauptleute` | ✓ не `Hauptmänner` |
| `Mann` | `die Männer` | ✓ |

`Wort`, `Kaufmann`, `Seemann` в книге не встречаются.

### 8. Глаголы

**Найдена реальная ошибка:**

| лемма | было | стало |
|---|---|---|
| `ratschlagen` | `ratschlagte · hat ratschlagt` | `ratschlagte · hat geratschlagt` |

Проверено по Duden — причастие с `ge-`, потому что ударение на первом слоге.

**Глаголы с двумя спряжениями — выбор по контексту книги:**

| лемма | предложение | выбор |
|---|---|---|
| `erschrecken` | `Da erschrak er gewaltig` | непереходное → `erschrak · ist erschrocken` ✓ |
| `schaffen` | `ihn aus dem Futter zu schaffen` | «убрать», не «создать» → слабое `schaffte · hat geschafft` ✓ |
| `ziehen` | `zieh lieber mit uns fort` | непереходное движение → **уточнил формы**: `zog · ist gezogen (двигаться) / hat gezogen (тянуть)` |

`hängen`, `bewegen`, `senden`, `wenden`, `schwimmen` в книге не встречаются.

**Вспомогательный глагол.** Прогнал все 110 глаголов против списка движения
и смены состояния — расхождений нет. С `ist` стоят: `gehen`, `kommen`,
`laufen`, `vorbeirennen`, `springen`, `klettern`, `fliegen`, `fliehen`,
`fahren`, `stürzen`, `ziehen`, `bleiben`, `geschehen`, `einschlafen`,
`erschrecken`, `werden`, `ward`, `fortgehen`, `hingehen`, `fortkommen`,
`herumjagen`. Все остальные с `hat`.

Сильные глаголы из твоего контрольного списка, которые есть в книге, сверены
поштучно: `ziehen, laufen, tragen, fangen, springen, schreien, sitzen, setzen,
liegen, legen, schlagen, sprechen, sehen, finden, stehen, nehmen, geben,
stechen, speien, fliehen, beißen, essen, trinken, waschen, halten, heißen,
lassen, schlafen, spinnen, bleiben, brennen, bringen, denken, wissen`.
`treten, stoßen, fallen/fällen, werfen, brechen, reißen, kriechen` в книге нет.

### 9. Отделяемые приставки

Аудит нашёл **18 мест**, где приставка оторвана от глагола. Проблема
системная: в немецком приставка омонимична предлогу или наречию, а модель
«одна словоформа → одна лемма» не умеет развести `mit` в `geh mit`
(приставка) и `mit` в `Geh mit uns` (предлог) — это один и тот же токен
в одной и той же книге.

**Что сделал:** оба токена теперь ведут на осмысленную карточку, и каждая
из них называет цельный глагол.

| место | оторванная конструкция | глагол ведёт на | приставка ведёт на |
|---|---|---|---|
| ch-01[0.1] | `lief fort` | `laufen` → упомянут `fortlaufen` | `fort` → упомянут `fortlaufen` |
| ch-01[1.2] | `nicht mehr fort kann` | `können` → `fortkönnen` | `fort` |
| ch-01[2.0] | `geh mit` | `gehen` → `mitgehen` | `mit` → `mitgehen` |
| ch-02[1.1] | `ging mit` | `gehen` → `mitgehen` | `mit` |
| ch-02[2.0] | `kamen … vorbei` | `kommen` → `vorbeikommen` | `vorbei` → `vorbeikommen` |
| ch-02[3.0] | `zieh … fort` | `ziehen` → `fortziehen` | `fort` |
| ch-02[3.1] | `gingen … fort` | `gehen` → `fortgehen` | `fort` |
| ch-03[0.2] | `sah … sich … um` | `sehen` → `sich umsehen` | `um` → `sich umsehen` |
| ch-03[2.4] | `fingen … an` | `anfangen` ✓ (уже цельная лемма) | `an` → `anfangen` |
| ch-03[3.1] | `flog … hinauf` | `fliegen` → `hinauffliegen` | `hinauf` |
| ch-03[3.1] | `stürzten … hinein` | `stürzen` → `hineinstürzen` | `hinein` |
| ch-03[3.3] | `nahmen … vorlieb` | `nehmen` → `vorliebnehmen` | `vorlieb` → лемма `vorliebnehmen` ✓ |
| ch-04[0.0] | `löschten … aus` | `löschen` → `auslöschen` | `aus` |
| ch-04[2.2] | `sprang auf` | `springen` → `aufspringen` | `auf` |
| ch-04[2.2] | `wollte … hinaus` | `wollen` → `hinauswollen` | `hinaus` |
| ch-04[2.2] | `rief … herab` | `rufen` → `herabrufen` | `herab` |
| ch-04[3.0] | `lief … zurück` | `laufen` → `zurücklaufen` | `zurück` |
| ch-04[3.2] | `nicht wieder heraus wollten` | `wollen` → `herauswollen` | `heraus` |

Единственные приставки, которые ведут прямо на цельный глагол —
`vorlieb` → `vorliebnehmen`, `reißaus` → `Reißaus nehmen`,
`bockshorn` → `ins Bockshorn jagen`: они больше нигде в книге не встречаются,
поэтому конфликта нет.

### 10. Возвратное `sich`

Токен `sich` **оставлен отдельной леммой-местоимением** — и это не недоработка.
В книге `sich` стоит при 12 разных глаголах, так что привязать его к одному
глаголу нельзя в принципе:

`machte sich auf den Weg` · `sich müde gelaufen` · `setzte sich` ·
`machten sich in die Äste` · `legten sich` · `näherte sich` ·
`ließ sich den Vorschlag gefallen` · `suchten sich eine Schlafstätte` ·
`lassen's sich wohl sein` · `getrauten sich` · `sah sich um` ·
`machten sich auf den Weg`

Что сделано: перевод леммы `sich` теперь прямо говорит, что это часть
возвратного глагола, и перечисляет обороты из книги. Сами возвратные глаголы
заведены как отдельные леммы, и **токен глагола ведёт именно на них**:
`fortgemacht` → `sich fortmachen`, `aufmachen` → `sich aufmachen`,
`getrauten` → `sich getrauen`, `näherte` → `sich nähern`.

---

## Спорное

Здесь я принял решение, но уверенности меньше — посмотри отдельно.

**1. `weiter` свёрнут в `weit`.**
`sie gingen weiter` · `getrauten sich … nicht weiter in das Haus`.
Формально `weiter` — компаратив `weit`, и по твоему правилу №4 он не должен
быть отдельной леммой. Но в современном немецком `weiter` лексикализовался как
самостоятельное наречие «далее», и Duden даёт его отдельной статьёй.
Свернул по правилу, оба значения прописал в переводе. Если считаешь, что
для читателя полезнее видеть «дальше» без отсылки к «далёкий» — верну отдельной
леммой.

**2. `mehr` свёрнут в `viel`.**
Та же история: `nicht mehr fort kann` · `kein Licht mehr`. В этих местах
`mehr` — отрицательная частица «больше не», а вовсе не «много в большей
степени». Связь с `viel` тут этимологическая, а не смысловая. По правилу свернул,
но это ровно тот случай, когда правило работает против читателя.

**3. `herumjagen` — вспомогательный `sein`.**
`als nach Mäusen herumjage`. Поставил `jagte herum · ist herumgejagt` (движение
без цели). С `haben` тоже встречается, когда это занятие, а не перемещение.
Контекст — «гоняться за мышами» — я прочитал как перемещение.

**4. `Ende` с пометой `old`.**
`dessen Kräfte aber nun zu Ende gingen`. Сам оборот `zu Ende gehen` живой,
устарело именно применение к физическим силам. Помету оставил на `Ende`,
а не на `gehen` — глагол-то не устаревший. Возможно, помета тут вообще лишняя.

**5. `nahmen` ведёт на `nehmen`, а не на `vorliebnehmen`.**
`nahmen mit dem vorlieb`. Технически я мог отдать форму `nahmen` цельному
`vorliebnehmen` — она в книге одна. Не стал: тогда базовый глагол `nehmen`
остался бы без единой словоформы и вылетел бы из глоссария по правилу
«лемма без форм». `nehmen` полезнее. Оборот назван в переводе обеих лемм.

**6. `Packan`, `Bartputzer`, `Grauschimmel` — выдуманные артикль и мн. ч.**
Это прозвища из сказки, словарной нормы у них нет. Проставил `der` + регулярное
множественное, чтобы карточка была единообразной, и повесил `old`.
Возможно, честнее было бы дать им `pos: "прозвище"` без грамматики.

**7. `Tag` с пометой `old`.**
Помета сработает и когда читатель тапнет по `Tage` в `drei Tage Regenwetter`,
где ничего архаичного нет. Текст пометы это оговаривает, но лишний шум остаётся.
Альтернатива — вешать `old` на словоформу, а не на лемму, но это изменение
формата глоссария.

**8. `sein` — две леммы с похожими именами.**
Глагол `sein` («быть») и притяжательное `sein (его, свой)` — разные записи.
В тексте `sein` как отдельный токен всегда глагол, притяжательное встречается
только в формах `seinem / seinen / seiner`, так что развести удалось. Но имя
леммы `sein (его, свой)` в тултипе будет выглядеть громоздко.

---

## Полный список лемм

Формат: `лемма | грамматика (арт.·мн.ч.·склонение, либо три формы, либо степени) | перевод | устар.`
Пометы вида **форма `x`:** привязаны к конкретной словоформе, а не к слову целиком.

#### сущ. — 119

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `Abend` | der · die Abende | вечер |  |
| `Arbeit` | die · die Arbeiten | работа |  |
| `Art` | die · die Arten | вид, способ; eine Art haben — выйти складно |  |
| `Asche` | die · — | зола, пепел |  |
| `Ast` | der · die Äste | ветка, сук |  |
| `Auge` | das · die Augen | глаз |  |
| `Balken` | der · die Balken | балка, перекладина |  |
| `Baum` | der · die Bäume | дерево |  |
| `Bein` | das · die Beine | нога; кость |  |
| `Bequemlichkeit` | die · die Bequemlichkeiten | удобство |  |
| `Brot` | das · die Brote | хлеб |  |
| `Christkindlein` | das · die Christkindlein | младенец Христос |  |
| `Dach` | das · die Dächer | крыша | **форма `dache`:** старый дательный с -e (auf dem Dache); сегодня auf dem Dach |
| `Ende` | das · die Enden | конец |  |
| `Erbarmen` | das · — | жалость, сострадание |  |
| `Esel` | der · die Esel | осёл |  |
| `Fenster` | das · die Fenster | окно |  |
| `Ferne` | die · die Fernen | даль |  |
| `Feuer` | das · die Feuer | огонь |  |
| `Finger` | der · die Finger | палец |  |
| `Fleisch` | das · — | мясо |  |
| `Frau` | die · die Frauen | женщина; хозяйка; госпожа |  |
| `Furcht` | die · — | страх |  |
| `Futter` | das · — | корм |  |
| `Fünkchen` | das · die Fünkchen | искорка |  |
| `Gast` | der · die Gäste | гость |  |
| `Gegend` | die · die Gegenden | местность, сторона |  |
| `Geschrei` | das · — | крик, вопль |  |
| `Geselle` | der · die Gesellen · n-Deklination: der Geselle / des Gesellen / dem Gesellen / den Gesellen | товарищ, подмастерье | в значении «товарищ» устарело; сегодня Kumpel, Gefährte. Geselle сейчас — «подмастерье» |
| `Gesicht` | das · die Gesichter | лицо; ein Gesicht machen — состроить мину |  |
| `Gespenst` | das · die Gespenster | привидение |  |
| `Hahn` | der · die Hähne | петух |  |
| `Hahnenbalken` | der · die Hahnenbalken | насест | устарело; сегодня Hühnerstange, Sitzstange |
| `Hals` | der · die Hälse | шея; горло (aus vollem Hals — во всё горло) |  |
| `Hauptmann` | der · die Hauptleute | атаман, главарь; капитан |  |
| `Haus` | das · die Häuser | дом | **форма `hause`:** старый дательный с -e (im Hause, in dem Hause); сегодня im Haus. Внимание: nach Hause и zu Hause — живая норма |
| `Hausfrau` | die · die Hausfrauen | хозяйка дома |  |
| `Haushahn` | der · die Haushähne | домашний петух |  |
| `Hemdchen` | das · die Hemdchen | рубашечка |  |
| `Herberge` | die · die Herbergen | приют, ночлег |  |
| `Herd` | der · die Herde | очаг, плита |  |
| `Herr` | der · die Herren · n-Deklination: der Herr / des Herrn / dem Herrn / den Herrn / мн. die Herren | господин, хозяин |  |
| `Hexe` | die · die Hexen | ведьма |  |
| `Hinterfuß` | der · die Hinterfüße | задняя нога |  |
| `Hintertür` | die · die Hintertüren | задняя дверь |  |
| `Hof` | der · die Höfe | двор |  |
| `Holzkeule` | die · die Holzkeulen | деревянная дубина |  |
| `Hund` | der · die Hunde | собака, пёс |  |
| `Höhe` | die · die Höhen | высота (in die Höhe fahren — подскочить) |  |
| `Jagd` | die · die Jagden | охота |  |
| `Jagdhund` | der · die Jagdhunde | охотничья собака |  |
| `Jahr` | das · die Jahre | год |  |
| `Katze` | die · die Katzen | кошка |  |
| `Knochen` | der · die Knochen | кость |  |
| `Kohle` | die · die Kohlen | уголь |  |
| `Kopf` | der · die Köpfe | голова |  |
| `Kraft` | die · die Kräfte | сила |  |
| `Kragen` | der · die Kragen | воротник; einem an den Kragen gehen — дело идёт к горлу |  |
| `Köchin` | die · die Köchinnen | кухарка |  |
| `Küche` | die · die Küchen | кухня |  |
| `Laute` | die · die Lauten | лютня |  |
| `Leibeskräfte` | die · только мн. ч. | все силы (aus Leibeskräften — что было мочи) |  |
| `Licht` | das · die Lichter | свет; огонёк |  |
| `Lärmen` | das · — | шум, гам | субстантивированный инфинитив; сегодня просто der Lärm |
| `Mann` | der · die Männer | мужчина, человек |  |
| `Mark` | das · — | костный мозг (durch Mark und Bein — до мозга костей) |  |
| `Maus` | die · die Mäuse | мышь |  |
| `Messer` | das · die Messer | нож |  |
| `Mist` | der · — | навоз | **форма `miste`:** старый дательный с -e (an dem Miste); сегодня an dem Mist |
| `Mittel` | das · die Mittel | средство |  |
| `Mitternacht` | die · die Mitternächte | полночь |  |
| `Mund` | der · die Münder | рот |  |
| `Musik` | die · — | музыка |  |
| `Musikant` | der · die Musikanten · n-Deklination: der Musikant / des Musikanten / dem Musikanten | музыкант (бродячий, уличный) |  |
| `Mühle` | die · die Mühlen | мельница |  |
| `Nachtmusik` | die · — | ночная музыка, серенада |  |
| `Natur` | die · die Naturen | природа, натура |  |
| `Ofen` | der · die Öfen | печь |  |
| `Pauke` | die · die Pauken | литавра |  |
| `Rat` | der · die Ratschläge | совет |  |
| `Regenwetter` | das · — | дождливая погода |  |
| `Richter` | der · die Richter | судья |  |
| `Rotkopf` | der · die Rotköpfe | красноголовый (о петухе) |  |
| `Räuber` | der · die Räuber | разбойник |  |
| `Räuberhaus` | das · die Räuberhäuser | разбойничий дом |  |
| `Rücken` | der · die Rücken | спина |  |
| `Sack` | der · die Säcke | мешок |  |
| `Scheibe` | die · die Scheiben | оконное стекло |  |
| `Schelm` | der · die Schelme | мошенник, плут | устарело; сегодня Gauner, Schlingel |
| `Schlaf` | der · — | сон |  |
| `Schlafstätte` | die · die Schlafstätten | место для сна, ночлег |  |
| `Schlag` | der · die Schläge | удар |  |
| `Schwefelhölzchen` | das · die Schwefelhölzchen | серная спичка | устарело вместе с самим предметом; сегодня Streichholz |
| `Sonntag` | der · die Sonntage | воскресенье |  |
| `Spaß` | der · die Späße | шутка, забава |  |
| `Spielmann` | der · die Spielleute | бродячий музыкант | устарело; сегодня Musiker, Straßenmusiker |
| `Spitze` | die · die Spitzen | верхушка, вершина |  |
| `Stadt` | die · die Städte | город |  |
| `Stadtmusikant` | der · die Stadtmusikanten · n-Deklination: der Stadtmusikant / des Stadtmusikanten / dem Stadtmusikanten | городской музыкант |  |
| `Stimme` | die · die Stimmen | голос |  |
| `Stube` | die · die Stuben | комната, горница |  |
| `Suppe` | die · die Suppen | суп |  |
| `Tag` | der · die Tage | день | **форма `tage`:** в обороте in einem Tage — старый дательный с -e; сегодня an einem Tag. В «drei Tage Regenwetter» это обычное мн. ч. |
| `Tier` | das · die Tiere | животное, зверь |  |
| `Tisch` | der · die Tische | стол |  |
| `Tod` | der · — | смерть |  |
| `Tor` | das · die Tore | ворота |  |
| `Tür` | die · die Türen | дверь |  |
| `Ungetüm` | das · die Ungetüme | чудище, страшилище |  |
| `Vorderfuß` | der · die Vorderfüße | передняя нога, передняя лапа |  |
| `Vorschlag` | der · die Vorschläge | предложение |  |
| `Wald` | der · die Wälder | лес |  |
| `Weg` | der · die Wege | путь, дорога | **форма `wege`:** старый дательный с -e (auf dem Wege, an dem Wege); сегодня auf dem Weg |
| `Weilchen` | das · die Weilchen | немного времени, минутка |  |
| `Wetter` | das · — | погода |  |
| `Wind` | der · die Winde | ветер |  |
| `Woche` | die · die Wochen | неделя |  |
| `Zahn` | der · die Zähne | зуб |  |
| `Zeichen` | das · die Zeichen | знак |  |

#### субст. прил. — 2

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `Abgeschickte` | der Abgeschickte / ein Abgeschickter / die Abgeschickten | посланный, гонец |  |
| `Landesflüchtige` | der Landesflüchtige / ein Landesflüchtiger / die Landesflüchtigen | беглец, покинувший страну | книжное и устаревшее; сегодня сказали бы Flüchtling |

#### прозвище — 3

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `Bartputzer` | — | бородомойка (шутливое прозвище кота) | шутливое прозвище кота из сказки; в современной речи не встречается |
| `Grauschimmel` | — | серый в яблоках конь; тут — обращение «сивый» | как обращение к ослу — шутка из сказки; в живой речи не употребляется |
| `Packan` | — | пёс, хватай (кличка крупной собаки) | устаревшее прозвище для большого пса; в живой речи не используется |

#### гл. — 109

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `abschneiden` | schnitt ab · hat abgeschnitten | отрезать, отрубать |  |
| `anfangen` | fing an · hat angefangen | начинать; браться за дело. В тексте приставка оторвана: fingen … an — anfangen |  |
| `anhauchen` | hauchte an · hat angehaucht | дохнуть на кого-л. |  |
| `annehmen` | nahm an · hat angenommen | принимать, брать на работу |  |
| `ansehen` | sah an · hat angesehen | принимать за кого-л.; рассматривать |  |
| `antworten` | antwortete · hat geantwortet | отвечать |  |
| `anzünden` | zündete an · hat angezündet | зажигать |  |
| `beißen` | biss · hat gebissen | кусать |  |
| `bellen` | bellte · hat gebellt | лаять |  |
| `bleiben` | blieb · ist geblieben | оставаться |  |
| `brennen` | brannte · hat gebrannt | гореть |  |
| `bringen` | brachte · hat gebracht | приносить, приводить |  |
| `dauern` | dauerte · hat gedauert | длиться, продолжаться |  |
| `denken` | dachte · hat gedacht | думать |  |
| `dünken` | deuchte · hat gedeucht | казаться, чудиться | форма däuchte устарела полностью; сегодня scheinen, vorkommen |
| `einschlafen` | schlief ein · ist eingeschlafen | засыпать |  |
| `erreichen` | erreichte · hat erreicht | достигать, добираться |  |
| `erschrecken` | erschrak · ist erschrocken | испугаться |  |
| `ersäufen` | ersäufte · hat ersäuft | утопить | грубое и устарелое; сегодня ertränken |
| `erzählen` | erzählte · hat erzählt | рассказывать |  |
| `essen` | aß · hat gegessen | есть, кушать; das Essen — еда |  |
| `fahren` | fuhr · ist gefahren | ехать; in die Höhe fahren — подскочить |  |
| `fangen` | fing · hat gefangen | ловить; Feuer fangen — загореться |  |
| `finden` | fand · hat gefunden | находить |  |
| `fliegen` | flog · ist geflogen | летать, лететь; в тексте с отделяемой приставкой: flog hinauf — hinauffliegen «взлететь» |  |
| `fliehen` | floh · ist geflohen | бежать, спасаться бегством |  |
| `fortgehen` | ging fort · ist fortgegangen | уйти, отойти |  |
| `fortkommen` | kam fort · ist fortgekommen | убраться, унести ноги |  |
| `fragen` | fragte · hat gefragt | спрашивать |  |
| `geben` | gab · hat gegeben | давать |  |
| `gefallen` | gefiel · hat gefallen | нравиться; sich gefallen lassen — согласиться на что-л. |  |
| `gehen` | ging · ist gegangen | идти, ходить; zu Ende gehen — подходить к концу; в тексте с отделяемой приставкой: geh mit / ging mit — mitgehen «пойти вместе»; gingen fort — fortgehen «уйти» |  |
| `geschehen` | geschah · ist geschehen | происходить, случаться |  |
| `haben` | hatte · hat gehabt | иметь; вспомог. глагол |  |
| `halten` | hielt · hat gehalten | держать; halten für — считать кем/чем-л. |  |
| `heißen` | hieß · hat geheißen | называться; велеть |  |
| `herumjagen` | jagte herum · hat herumgejagt | гоняться, носиться |  |
| `hinausjagen` | jagte hinaus · hat hinausgejagt | выгнать |  |
| `hingehen` | ging hin · ist hingegangen | пойти туда, дойти |  |
| `hungern` | hungerte · hat gehungert | голодать |  |
| `jagen` | jagte · hat gejagt | гнать; охотиться |  |
| `jappen` | jappte · hat gejappt | тяжело дышать, пыхтеть | устарело и диалектно; сегодня hecheln, keuchen |
| `klettern` | kletterte · ist geklettert | взбираться, лезть |  |
| `klirren` | klirrte · hat geklirrt | звенеть, дребезжать |  |
| `kommen` | kam · ist gekommen | приходить, приезжать; в тексте с отделяемой приставкой: kamen vorbei — vorbeikommen «проходить мимо» |  |
| `kratzen` | kratzte · hat gekratzt | царапать |  |
| `krähen` | krähte · hat gekräht | кукарекать |  |
| `können` | konnte · hat gekonnt | мочь, уметь; в тексте с отделяемой приставкой: kann nicht fort — fortkönnen «не мочь уйти» |  |
| `lassen` | ließ · hat gelassen | позволять, велеть; оставлять |  |
| `laufen` | lief · ist gelaufen | бежать; бегать; в тексте с отделяемой приставкой: lief fort — fortlaufen «убежать»; lief zurück — zurücklaufen «побежать назад» |  |
| `legen` | legte · hat gelegt | класть; sich legen — ложиться |  |
| `liegen` | lag · hat gelegen | лежать |  |
| `losschlagen` | schlug los · hat losgeschlagen | ударить, наброситься |  |
| `löschen` | löschte · hat gelöscht | гасить, тушить; в тексте с отделяемой приставкой: löschten aus — auslöschen «погасить» |  |
| `machen` | machte · hat gemacht | делать; sich auf den Weg machen — отправиться в путь |  |
| `meinen` | meinte · hat gemeint | полагать, считать; иметь в виду |  |
| `merken` | merkte · hat gemerkt | замечать, чуять |  |
| `miauen` | miaute · hat miaut | мяукать |  |
| `musizieren` | musizierte · hat musiziert | играть музыку, музицировать |  |
| `müssen` | musste · hat gemusst | быть вынужденным, должен |  |
| `nehmen` | nahm · hat genommen | брать; в тексте с отделяемой приставкой: nahmen vorlieb — vorliebnehmen «довольствоваться»; Reißaus genommen — Reißaus nehmen «дать дёру» |  |
| `prophezeien` | prophezeite · hat prophezeit | предсказывать, пророчить |  |
| `ratschlagen` | ratschlagte · hat geratschlagt | держать совет, совещаться | устарело; сегодня beraten, sich beratschlagen |
| `rufen` | rief · hat gerufen | звать, кричать; в тексте с отделяемой приставкой: rief herab — herabrufen «крикнуть сверху» |  |
| `sagen` | sagte · hat gesagt | говорить, сказать |  |
| `schaffen` | schaffte · hat geschafft | здесь: убрать, избавиться (aus dem Futter schaffen) |  |
| `schauen` | schaute · hat geschaut | смотреть, глядеть |  |
| `scheinen` | schien · hat geschienen | светить; казаться |  |
| `schimmern` | schimmerte · hat geschimmert | мерцать, светиться |  |
| `schlafen` | schlief · hat geschlafen | спать |  |
| `schlagen` | schlug · hat geschlagen | бить, ударять |  |
| `schreien` | schrie · hat geschrien | кричать |  |
| `sehen` | sah · hat gesehen | видеть; в тексте с отделяемой приставкой: sah sich um — sich umsehen «оглядеться» |  |
| `sein` | war · ist gewesen | быть; вспомог. глагол |  |
| `setzen` | setzte · hat gesetzt | сажать; sich setzen — садиться |  |
| `sich aufmachen` | machte sich auf · hat sich aufgemacht | отправляться в путь, собираться | книжно и устарело; сегодня losgehen, aufbrechen |
| `sich fortmachen` | machte sich fort · hat sich fortgemacht | убраться, удрать | устарело; сегодня sich davonmachen, abhauen |
| `sich getrauen` | getraute sich · hat sich getraut | отваживаться, решаться | устарело; сегодня sich trauen, wagen |
| `sich nähern` | näherte sich · hat sich genähert | приближаться |  |
| `sitzen` | saß · hat gesessen | сидеть |  |
| `sollen` | sollte · hat gesollt | быть должным, следует |  |
| `speien` | spie · hat gespien | плевать; о кошке — шипеть, фыркать | устарело; сегодня spucken |
| `spielen` | spielte · hat gespielt | играть |  |
| `spinnen` | spann · hat gesponnen | прясть; о кошке — мурлыкать |  |
| `sprechen` | sprach · hat gesprochen | говорить, сказать | здесь sprach в значении «сказал» — книжно и устарело; в совр. речи sagte |
| `springen` | sprang · ist gesprungen | прыгать, вскакивать; в тексте с отделяемой приставкой: sprang auf — aufspringen «вскочить» |  |
| `stechen` | stach · hat gestochen | колоть, пырнуть |  |
| `stehen` | stand · hat gestanden | стоять |  |
| `stellen` | stellte · hat gestellt | ставить |  |
| `stürzen` | stürzte · ist gestürzt | броситься, ринуться; падать; в тексте с отделяемой приставкой: stürzten hinein — hineinstürzen «ринуться внутрь» |  |
| `suchen` | suchte · hat gesucht | искать |  |
| `totschlagen` | schlug tot · hat totgeschlagen | убить, забить насмерть |  |
| `tragen` | trug · hat getragen | носить, нести |  |
| `trinken` | trank · hat getrunken | пить; das Trinken — питьё |  |
| `trocknen` | trocknete · hat getrocknet | сушить; сохнуть |  |
| `tun` | tat · hat getan | делать; gut tun — быть кстати |  |
| `untersuchen` | untersuchte · hat untersucht | осматривать, обследовать |  |
| `verdienen` | verdiente · hat verdient | зарабатывать; заслуживать |  |
| `verstehen` | verstand · hat verstanden | понимать; sich verstehen auf — знать толк в чём-л. |  |
| `vorbeirennen` | rannte vorbei · ist vorbeigerannt | пробежать мимо |  |
| `waschen` | wusch · hat gewaschen | мыть, стирать |  |
| `wecken` | weckte · hat geweckt | будить |  |
| `wehen` | wehte · hat geweht | дуть, веять |  |
| `werden` | wurde · ist geworden | становиться; вспомог. глагол будущего и пассива | **форма `ward`:** устаревшая форма Präteritum от werden; сегодня wurde |
| `wissen` | wusste · hat gewusst | знать |  |
| `wollen` | wollte · hat gewollt | хотеть; в тексте с отделяемой приставкой: wollte hinaus — hinauswollen; heraus wollten — herauswollen |  |
| `zerkratzen` | zerkratzte · hat zerkratzt | исцарапать |  |
| `ziehen` | zog · ist gezogen (двигаться) / hat gezogen (тянуть) | двигаться, отправляться (в тексте); тянуть; в тексте с отделяемой приставкой: zieh fort — fortziehen «уходить, отправляться» |  |
| `übernachten` | übernachtete · hat übernachtet | ночевать |  |

#### прил. — 36

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `alt` | alt · älter · am ältesten | старый |  |
| `Bremer` |  | бременский |  |
| `entsetzlich` | entsetzlich · entsetzlicher · am entsetzlichsten | ужасный, страшный |  |
| `erleuchtet` |  | освещённый |  |
| `fertig` |  | готовый; тут: покончивший с едой |  |
| `feurig` | feurig · feuriger · am feurigsten | огненный |  |
| `gedeckt` |  | накрытый (о столе) |  |
| `gewaltig` | gewaltig · gewaltiger · am gewaltigsten | страшно, сильно; огромный |  |
| `glühend` |  | горящий, раскалённый |  |
| `groß` | groß · größer · am größten | большой, рослый |  |
| `gräulich` | gräulich · gräulicher · am gräulichsten | жуткий, страшный (от Gräuel «ужас»). Не путать с gräulich «сероватый» от grau — пишутся одинаково, значения разные |  |
| `gut` | gut · besser · am besten | хороший, добрый; besser — лучше |  |
| `hell` | hell · heller · am hellsten | светлый, яркий |  |
| `lang` | lang · länger · am längsten | длинный, долгий |  |
| `lebendig` | lebendig · lebendiger · am lebendigsten | живой |  |
| `lieb` | lieb · lieber · am liebsten | милый, дорогой |  |
| `lustig` | lustig · lustiger · am lustigsten | весёлый |  |
| `munter` | munter · munterer · am muntersten | бодрый, оживлённый |  |
| `müde` | müde · müder · am müdesten | усталый |  |
| `ruhig` | ruhig · ruhiger · am ruhigsten | спокойный, тихий |  |
| `schlecht` | schlecht · schlechter · am schlechtesten | плохой |  |
| `schwach` | schwach · schwächer · am schwächsten | слабый |  |
| `schwarz` | schwarz · schwärzer · am schwärzesten | чёрный |  |
| `schön` | schön · schöner · am schönsten | красивый; прекрасный |  |
| `sicher` | sicher · sicherer · am sichersten | безопасный, надёжный |  |
| `still` | still · stiller · am stillsten | тихий, безмолвный |  |
| `stumpf` | stumpf · stumpfer · am stumpfsten | тупой |  |
| `teuer` | teuer · teurer · am teuersten | дорогой (guter Rat ist teuer — дело плохо) |  |
| `tüchtig` | tüchtig · tüchtiger · am tüchtigsten | изрядный, добротный |  |
| `untauglich` |  | негодный, непригодный |  |
| `unverdrossen` |  | безропотно, неутомимо |  |
| `voll` | voll · voller · am vollsten | полный |  |
| `warm` | warm · wärmer · am wärmsten | тёплый |  |
| `weit` | weit · weiter · am weitesten | далёкий, далеко; weiter — дальше, далее; von weitem — издали |  |
| `zufrieden` | zufrieden · zufriedener · am zufriedensten | довольный |  |
| `übrig` |  | оставшийся |  |

#### нареч. — 43

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `abends` |  | вечером, по вечерам |  |
| `also` |  | итак, стало быть |  |
| `anders` |  | иначе, по-другому |  |
| `bald` |  | скоро |  |
| `da` |  | тут, там; тогда |  |
| `dann` |  | потом, затем |  |
| `daran` |  | на этом, об этом (dran — разг. форма) |  |
| `darauf` |  | затем, после этого; на этом |  |
| `darin` |  | в этом, внутри |  |
| `dort` |  | там |  |
| `einmal` |  | однажды; раз |  |
| `endlich` |  | наконец |  |
| `fort` |  | прочь; дальше; тж. отделяемая приставка: fortlaufen, fortgehen, fortziehen, fortkönnen |  |
| `gar` |  | вовсе, совсем |  |
| `gern` | gern · lieber · am liebsten | охотно; lieber — охотнее, лучше |  |
| `her` |  | сюда |  |
| `herab` |  | вниз (сюда); тж. отделяемая приставка: herabrufen «крикнуть сверху» |  |
| `heraus` |  | наружу (сюда); тж. отделяемая приставка: herauswollen «хотеть выйти» |  |
| `herein` |  | внутрь (сюда) |  |
| `heute` |  | сегодня |  |
| `hier` |  | здесь |  |
| `hin` |  | туда |  |
| `hinauf` |  | наверх (туда); тж. отделяемая приставка: hinauffliegen «взлететь» |  |
| `hinaus` |  | наружу (туда); тж. отделяемая приставка: hinauswollen, hinausjagen |  |
| `hinein` |  | внутрь (туда); тж. отделяемая приставка: hineinstürzen «ринуться внутрь» |  |
| `immer` |  | всегда; всё (immer größer — всё больше) |  |
| `insgesamt` |  | все вместе, в общей сложности |  |
| `mehr` |  | больше; в nicht/kein … mehr — больше не. Формально компаратив от viel |  |
| `morgen` |  | завтра |  |
| `noch` |  | ещё |  |
| `nun` |  | теперь; ну |  |
| `oben` |  | наверху |  |
| `schon` |  | уже |  |
| `so` |  | так; такой; то (в главном предложении) |  |
| `vorbei` |  | мимо; тж. отделяемая приставка: vorbeikommen «проходить мимо» |  |
| `wieder` |  | снова |  |
| `wo` |  | где; куда; когда (в придаточном) |  |
| `wohl` |  | хорошо; пожалуй, вероятно |  |
| `womit` |  | чем, с помощью чего |  |
| `zuletzt` |  | напоследок, последним |  |
| `zurück` |  | назад; тж. отделяемая приставка: zurücklaufen «побежать назад» |  |
| `zusammen` |  | вместе |  |
| `überall` |  | везде, повсюду |  |

#### мест. — 19

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `alle/alles` |  | все; всё |  |
| `dessen` |  | чей, которого (род. п. от der/das) |  |
| `du` |  | ты (dich — тебя, dir — тебе) |  |
| `ein paar` |  | несколько, пара |  |
| `er` |  | он (ihn — его, ihm — ему) |  |
| `es` |  | оно; это |  |
| `etwas` |  | что-то, нечто; немного |  |
| `ich` |  | я (mich — меня, mir — мне) |  |
| `ihr (её, их)` |  | её; их |  |
| `jeder` |  | каждый |  |
| `kein` |  | никакой, ни один |  |
| `mein` |  | мой, моя |  |
| `sein (его, свой)` |  | его, свой |  |
| `sich` |  | себя, себе — возвратное местоимение. Часть возвратного глагола: sich auf den Weg machen, sich setzen, sich legen, sich nähern, sich gefallen lassen, sich getrauen, sich umsehen |  |
| `sie` |  | она; они; Вы |  |
| `unser` |  | наш |  |
| `was` |  | что; что-нибудь |  |
| `wer` |  | кто |  |
| `wir` |  | мы (uns — нас, нам) |  |

#### предл. — 16

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `an` |  | у, к, на (am = an dem); тж. отделяемая приставка: anfangen «начинать», annehmen, ansehen, anzünden |  |
| `auf` |  | на; в; тж. отделяемая приставка: aufspringen «вскочить», sich aufmachen |  |
| `aus` |  | из; тж. отделяемая приставка: auslöschen «погасить» |  |
| `bei` |  | у, при, возле |  |
| `durch` |  | через, сквозь, из-за |  |
| `für` |  | для, за |  |
| `hinter` |  | за, позади |  |
| `in` |  | в (im = in dem, ins = in das) |  |
| `mit` |  | с; тж. отделяемая приставка: mitgehen «пойти вместе» |  |
| `nach` |  | в, на, после, по |  |
| `um` |  | вокруг, в (о времени); um … zu — чтобы; тж. отделяемая приставка: sich umsehen «оглядеться» |  |
| `unter` |  | под, среди |  |
| `von` |  | от, из, о (vom = von dem) |  |
| `vor` |  | перед, до; от (страха) |  |
| `zu` |  | к, в; слишком (zur = zu der, zum = zu dem) |  |
| `über` |  | над, через, о |  |

#### союз — 12

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `aber` |  | но, однако |  |
| `als` |  | когда; как; чем |  |
| `bis` |  | до; пока не |  |
| `dass` |  | что; чтобы |  |
| `denn` |  | ведь, так как |  |
| `ehe` |  | прежде чем |  |
| `sodass` |  | так что, в результате чего |  |
| `solange` |  | пока, до тех пор пока |  |
| `und` |  | и, а |  |
| `weil` |  | потому что |  |
| `wenn` |  | если; когда |  |
| `wie` |  | как; какой |  |

#### артикль — 2

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `der/die/das` |  | определённый артикль; тж. относительное местоимение «который» |  |
| `ein/eine` |  | неопределённый артикль; einer — «один, некто» |  |

#### числ. — 2

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `drei` |  | три |  |
| `vier` |  | четыре | **форма `viere`:** alle viere — устаревшая форма «вчетвером»; сегодня alle vier |

#### частица — 5

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `auch` |  | тоже, также; даже |  |
| `doch` |  | всё же, всё-таки; ведь |  |
| `ja` |  | да; ведь (усилительная частица) |  |
| `nicht` |  | не |  |
| `zwar` |  | правда, хотя и |  |

#### межд. — 3

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `ach` |  | ах |  |
| `ei` |  | эй, ну (выражение удивления) |  |
| `kikeriki` |  | кукареку |  |

#### выраж. — 4

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `in die Quere kommen` |  | встать поперёк дороги, помешать |  |
| `ins Bockshorn jagen` |  | запугать, нагнать страху |  |
| `Reißaus nehmen` |  | дать дёру, удрать |  |
| `vorliebnehmen` |  | довольствоваться тем, что есть |  |

#### геогр. — 1

| лемма | грамматика | перевод | устар. |
|---|---|---|---|
| `Bremen` |  | Бремен (город на севере Германии) |  |
