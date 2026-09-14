#!/usr/bin/env python3
"""Разделение поля `ru` в data/books/<id>/glossary.json на `ru` + `note`.

Поле `ru` собирало и перевод, и разбор употреблений — на карточке такой
текст не помещался. После правки:

    ru   — короткий перевод, значения через запятую. Это идёт на карточку.
    note — обороты, отделяемые приставки, устойчивые выражения, пояснения.

Разбиение сделано вручную и записано таблицей SPLIT: автоматика на таких
текстах ошибается (точка внутри «тж.», тире внутри перевода). Скрипт
одноразовый и лежит рядом с остальными scripts/ как след миграции;
повторный запуск на уже разделённом файле ничего не меняет.

    python scripts/split_glossary_note.py [--check]
"""

import json
import sys
from pathlib import Path

GLOSSARY = Path(__file__).resolve().parent.parent / 'data' / 'books' / 'bremer' / 'glossary.json'

# лемма: (новый ru, note)
SPLIT = {
    'an':           ('у, к, на',
                     'am = an dem. Тж. отделяемая приставка: anfangen «начинать», '
                     'annehmen, ansehen, anzünden'),
    'anfangen':     ('начинать, браться за дело',
                     'В тексте приставка оторвана: fingen … an — anfangen'),
    'Art':          ('вид, способ', 'eine Art haben — выйти складно'),
    'auf':          ('на, в',
                     'Тж. отделяемая приставка: aufspringen «вскочить», sich aufmachen'),
    'aus':          ('из', 'Тж. отделяемая приставка: auslöschen «погасить»'),
    'daran':        ('на этом, об этом', 'dran — разговорная форма'),
    'der/die/das':  ('определённый артикль', 'Тж. относительное местоимение «который»'),
    'du':           ('ты', 'dich — тебя, dir — тебе'),
    'ein/eine':     ('неопределённый артикль', 'einer — «один, некто»'),
    'er':           ('он', 'ihn — его, ihm — ему'),
    'essen':        ('есть, кушать', 'das Essen — еда'),
    'fahren':       ('ехать', 'in die Höhe fahren — подскочить'),
    'fangen':       ('ловить', 'Feuer fangen — загореться'),
    'fliegen':      ('летать, лететь',
                     'В тексте с отделяемой приставкой: flog hinauf — hinauffliegen «взлететь»'),
    'fort':         ('прочь, дальше',
                     'Тж. отделяемая приставка: fortlaufen, fortgehen, fortziehen, fortkönnen'),
    'gefallen':     ('нравиться', 'sich gefallen lassen — согласиться на что-л.'),
    'gehen':        ('идти, ходить',
                     'zu Ende gehen — подходить к концу. В тексте с отделяемой приставкой: '
                     'geh mit / ging mit — mitgehen «пойти вместе»; gingen fort — '
                     'fortgehen «уйти»'),
    'gern':         ('охотно', 'lieber — охотнее, лучше'),
    'Gesicht':      ('лицо', 'ein Gesicht machen — состроить мину'),
    'Grauschimmel': ('серый в яблоках конь', 'Тут — обращение «сивый»'),
    'gräulich':     ('жуткий, страшный',
                     'От Gräuel «ужас». Не путать с gräulich «сероватый» от grau — '
                     'пишутся одинаково, значения разные'),
    'gut':          ('хороший, добрый', 'besser — лучше'),
    'Hals':         ('шея, горло', 'aus vollem Hals — во всё горло'),
    'halten':       ('держать', 'halten für — считать кем/чем-л.'),
    'herab':        ('вниз (сюда)',
                     'Тж. отделяемая приставка: herabrufen «крикнуть сверху»'),
    'heraus':       ('наружу (сюда)',
                     'Тж. отделяемая приставка: herauswollen «хотеть выйти»'),
    'hinauf':       ('наверх (туда)',
                     'Тж. отделяемая приставка: hinauffliegen «взлететь»'),
    'hinaus':       ('наружу (туда)',
                     'Тж. отделяемая приставка: hinauswollen, hinausjagen'),
    'hinein':       ('внутрь (туда)',
                     'Тж. отделяемая приставка: hineinstürzen «ринуться внутрь»'),
    'Höhe':         ('высота', 'in die Höhe fahren — подскочить'),
    'ich':          ('я', 'mich — меня, mir — мне'),
    'immer':        ('всегда, всё', 'immer größer — всё больше'),
    'kommen':       ('приходить, приезжать',
                     'В тексте с отделяемой приставкой: kamen vorbei — vorbeikommen '
                     '«проходить мимо»'),
    'Kragen':       ('воротник', 'einem an den Kragen gehen — дело идёт к горлу'),
    'können':       ('мочь, уметь',
                     'В тексте с отделяемой приставкой: kann nicht fort — fortkönnen '
                     '«не мочь уйти»'),
    'laufen':       ('бежать, бегать',
                     'В тексте с отделяемой приставкой: lief fort — fortlaufen «убежать»; '
                     'lief zurück — zurücklaufen «побежать назад»'),
    'legen':        ('класть', 'sich legen — ложиться'),
    'Leibeskräfte': ('все силы', 'aus Leibeskräften — что было мочи'),
    'löschen':      ('гасить, тушить',
                     'В тексте с отделяемой приставкой: löschten aus — auslöschen «погасить»'),
    'machen':       ('делать', 'sich auf den Weg machen — отправиться в путь'),
    'Mark':         ('костный мозг', 'durch Mark und Bein — до мозга костей'),
    'mehr':         ('больше',
                     'В nicht/kein … mehr — больше не. Формально компаратив от viel'),
    'mit':          ('с', 'Тж. отделяемая приставка: mitgehen «пойти вместе»'),
    'nehmen':       ('брать',
                     'В тексте с отделяемой приставкой: nahmen vorlieb — vorliebnehmen '
                     '«довольствоваться»; Reißaus genommen — Reißaus nehmen «дать дёру»'),
    'rufen':        ('звать, кричать',
                     'В тексте с отделяемой приставкой: rief herab — herabrufen '
                     '«крикнуть сверху»'),
    'schaffen':     ('убрать, избавиться', 'Здесь — в обороте aus dem Futter schaffen'),
    'sehen':        ('видеть',
                     'В тексте с отделяемой приставкой: sah sich um — sich umsehen «оглядеться»'),
    'setzen':       ('сажать', 'sich setzen — садиться'),
    'sich':         ('себя, себе',
                     'Возвратное местоимение, часть возвратного глагола: sich auf den Weg '
                     'machen, sich setzen, sich legen, sich nähern, sich gefallen lassen, '
                     'sich getrauen, sich umsehen'),
    'speien':       ('плевать', 'О кошке — шипеть, фыркать'),
    'spinnen':      ('прясть', 'О кошке — мурлыкать'),
    'springen':     ('прыгать, вскакивать',
                     'В тексте с отделяемой приставкой: sprang auf — aufspringen «вскочить»'),
    'stürzen':      ('броситься, ринуться; падать',
                     'В тексте с отделяемой приставкой: stürzten hinein — hineinstürzen '
                     '«ринуться внутрь»'),
    'teuer':        ('дорогой', 'guter Rat ist teuer — дело плохо'),
    'trinken':      ('пить', 'das Trinken — питьё'),
    'tun':          ('делать', 'gut tun — быть кстати'),
    'um':           ('вокруг, в (о времени)',
                     'um … zu — чтобы. Тж. отделяемая приставка: sich umsehen «оглядеться»'),
    'verstehen':    ('понимать', 'sich verstehen auf — знать толк в чём-л.'),
    'vorbei':       ('мимо', 'Тж. отделяемая приставка: vorbeikommen «проходить мимо»'),
    'weit':         ('далёкий, далеко', 'weiter — дальше, далее; von weitem — издали'),
    'werden':       ('становиться', 'Вспомогательный глагол будущего времени и пассива'),
    'wir':          ('мы', 'uns — нас, нам'),
    'wollen':       ('хотеть',
                     'В тексте с отделяемой приставкой: wollte hinaus — hinauswollen; '
                     'heraus wollten — herauswollen'),
    'ziehen':       ('двигаться, отправляться; тянуть',
                     'В тексте — «двигаться, отправляться». С отделяемой приставкой: '
                     'zieh fort — fortziehen «уходить, отправляться»'),
    'zu':           ('к, в; слишком', 'zur = zu der, zum = zu dem'),
    'zurück':       ('назад', 'Тж. отделяемая приставка: zurücklaufen «побежать назад»'),
}


def main():
    check = '--check' in sys.argv
    data = json.loads(GLOSSARY.read_text(encoding='utf-8'))
    lemmas = data['l']

    missing = [k for k in SPLIT if k not in lemmas]
    if missing:
        print('НЕТ В ГЛОССАРИИ:', missing)
        return 1

    changed = 0
    for lemma, (ru, note) in SPLIT.items():
        entry = lemmas[lemma]
        if entry.get('ru') == ru and entry.get('note') == note:
            continue
        entry['ru'] = ru
        entry['note'] = note
        changed += 1

    long_ru = sorted((len(v['ru']), k) for k, v in lemmas.items() if len(v.get('ru', '')) > 40)
    print(f'разделено записей: {changed} из {len(SPLIT)}')
    print(f'ru длиннее 40 символов осталось: {len(long_ru)}'
          + (' → ' + ', '.join(f'{k} ({n})' for n, k in long_ru) if long_ru else ''))

    if check:
        return 0
    GLOSSARY.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('записано', GLOSSARY)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
