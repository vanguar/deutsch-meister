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
from texts_brandenburg import TEXTS as _brandenburg

TEXTS = {}
for _part in (_bayern, _mv, _berlin, _hamburg, _bremen, _brandenburg):
    TEXTS.update(_part)

from texts_sachsen import TEXTS as _sachsen
TEXTS.update(_sachsen)

from texts_thueringen import TEXTS as _thueringen
TEXTS.update(_thueringen)

from texts_sachsen_anhalt import TEXTS as _sachsen_anhalt
TEXTS.update(_sachsen_anhalt)

from texts_niedersachsen import TEXTS as _niedersachsen
TEXTS.update(_niedersachsen)

from texts_schleswig_holstein import TEXTS as _schleswig_holstein
TEXTS.update(_schleswig_holstein)

from texts_nordrhein_westfalen import TEXTS as _nordrhein_westfalen
TEXTS.update(_nordrhein_westfalen)

from texts_hessen import TEXTS as _hessen
TEXTS.update(_hessen)
