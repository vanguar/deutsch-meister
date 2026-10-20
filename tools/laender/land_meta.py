"""
Земли Германии: витрина раздела (16 земель), паспорт и тест готовых земель.

Факты — только проверенные: у каждой готовой земли source/sourceUrl и дата
сверки checked. Цифры населения — с датой из источника. Фамилий действующих
политиков нет (тексты не должны устаревать). Неготовые земли — только
название и столица: они видны на карте и в списке серыми («в разработке»).

Поля готовой земли:
  emoji, blurb       — карточка в списке;
  facts              — паспорт: [(подпись, значение)], русский (переводится
                       общей памятью i18n);
  quiz               — тест после чтения: {q, opts, a (номер верного), why};
  figs               — фото глав: {имя: {w, h, cap, credit}} (data/laender/<id>/img).
"""

LEVELS = {
    'b1': {'level': 'B1', 'label': 'Проще',
           'note': 'B1: короткие предложения, Präsens и Präteritum, основные слова о стране.'},
    'b2': {'level': 'B2', 'label': 'Подробнее',
           'note': 'B2: длиннее и подробнее, придаточные, пассив, лексика политики и экономики.'},
}

# Общие источники витрины (показываются внизу страницы)
SOURCES = [
    {'name': 'Контуры земель — Natural Earth (public domain)', 'url': 'https://www.naturalearthdata.com/'},
    {'name': 'Флаги земель — Wikimedia Commons (public domain)', 'url': 'https://commons.wikimedia.org/'},
]

LANDS = [
    {'id': 'baden-wuerttemberg', 'name': 'Baden-Württemberg', 'nameRu': 'Баден-Вюртемберг', 'capital': 'Stuttgart'},
    {'id': 'bayern', 'name': 'Bayern', 'nameRu': 'Бавария', 'capital': 'München'},
    {'id': 'berlin', 'name': 'Berlin', 'nameRu': 'Берлин', 'capital': 'Berlin'},
    {'id': 'brandenburg', 'name': 'Brandenburg', 'nameRu': 'Бранденбург', 'capital': 'Potsdam'},
    {'id': 'bremen', 'name': 'Bremen', 'nameRu': 'Бремен', 'capital': 'Bremen'},
    {'id': 'hamburg', 'name': 'Hamburg', 'nameRu': 'Гамбург', 'capital': 'Hamburg'},
    {'id': 'hessen', 'name': 'Hessen', 'nameRu': 'Гессен', 'capital': 'Wiesbaden'},
    {'id': 'mecklenburg-vorpommern', 'name': 'Mecklenburg-Vorpommern', 'nameRu': 'Мекленбург — Передняя Померания',
     'capital': 'Schwerin'},
    {'id': 'niedersachsen', 'name': 'Niedersachsen', 'nameRu': 'Нижняя Саксония', 'capital': 'Hannover'},
    {'id': 'nordrhein-westfalen', 'name': 'Nordrhein-Westfalen', 'nameRu': 'Северный Рейн — Вестфалия',
     'capital': 'Düsseldorf'},
    {'id': 'rheinland-pfalz', 'name': 'Rheinland-Pfalz', 'nameRu': 'Рейнланд-Пфальц', 'capital': 'Mainz'},
    {'id': 'saarland', 'name': 'Saarland', 'nameRu': 'Саар', 'capital': 'Saarbrücken'},
    {'id': 'sachsen', 'name': 'Sachsen', 'nameRu': 'Саксония', 'capital': 'Dresden'},
    {'id': 'sachsen-anhalt', 'name': 'Sachsen-Anhalt', 'nameRu': 'Саксония-Анхальт', 'capital': 'Magdeburg'},
    {'id': 'schleswig-holstein', 'name': 'Schleswig-Holstein', 'nameRu': 'Шлезвиг-Гольштейн', 'capital': 'Kiel'},
    {'id': 'thueringen', 'name': 'Thüringen', 'nameRu': 'Тюрингия', 'capital': 'Erfurt'},
]

for _l in LANDS:
    _l.setdefault('emoji', '📍')
