"""
Тексты земель по уровням: TEXTS["<земля>-<b1|b2>"] = [(заголовок de, заголовок ru, иконка, абзацы)].
Абзац — список предложений (de, ru, g) или фото ('fig', имя). Разметка g — как в
tools/news/articles.py: "Wort", "Wort#2", "zwei Wörter", "trennbar+Präfix", "": без подписи.

Каждая земля — свой файл texts_<земля>.py. Только проверенные факты: источники
и дата сверки — в шапке файла земли и у земли в land_meta.py.
"""

from texts_bayern import TEXTS as _bayern
from texts_mecklenburg_vorpommern import TEXTS as _mv
from texts_berlin import TEXTS as _berlin
from texts_hamburg import TEXTS as _hamburg
from texts_bremen import TEXTS as _bremen

TEXTS = {}
for _part in (_bayern, _mv, _berlin, _hamburg, _bremen):
    TEXTS.update(_part)
