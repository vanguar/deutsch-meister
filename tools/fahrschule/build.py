#!/usr/bin/env python3
"""
tools/fahrschule/build.py — сборка раздела «Автошкола» (fahrschule.html).

Исходники (правятся руками):
  tools/fahrschule/src/units.json   — уроки трёх видов:
      theory   — правила по разделам (+ знак у строки) и тест по знакам;
      dialog   — разговор инструктора и ученика (как в «Диалогах»);
      junction — перекрёстки «Wer fährt zuerst?»: машины, знаки, порядок.
    Любой немецкий текст — {"de": ..., "tr": [ru, uk, ar]}; необязательное
    "w": {"слово": "лемма"} — значение слова именно в этой строке
    (отделяемые приставки, обороты: Stellen Sie … ein → einstellen).
  tools/fahrschule/src/lexicon.json — подсказки над словами: лемма →
    {pos, tr: [ru, uk, ar], note?: [ru, uk, ar], art/pl у сущ., forms,
    f: [другие формы слова]}.
  tools/fahrschule/src/signs.json   — названия знаков (de + [ru, uk, ar]).
  tools/fahrschule/src/topics.json  — темы курса по порядку: id, emoji,
    немецкое название, [ru, uk, ar] и уроки темы (каждый урок — ровно
    в одной теме). На странице уроки идут группами по темам.
  tools/fahrschule/signs.json       — лицензии знаков (fetch_signs.py),
    сами SVG — data/fahrschule/signs/<id>.svg.

Выход — готовые файлы на каждый язык, без общей памяти переводов
(короткие подписи слов там путались бы с чужими: «с», «на», «пока»):
  data/fahrschule/index.json, data/fahrschule/<id>.json      — русский;
  i18n/uk/fahrschule/…, i18n/ar/fahrschule/…                — копии с той
    же структурой; js/i18n.js подставляет их вместо data/fahrschule/.

Проверки (ошибка = выход 1, ничего не пишется):
  * у каждого немецкого слова есть подсказка (лемма в словаре), и в
    словаре нет лишних лемм;
  * алфавиты: немецкий без кириллицы, украинский без ы/э/ъ/ё, арабский —
    арабицей без кириллицы;
  * знаки: SVG и свободная лицензия есть;
  * перекрёстки: порядок проезда вычисляется по правилам (светофор →
    знаки → «правый перед левым» → поворот налево уступает встречным;
    зелёная стрелка z720 — направо на красный после зелёных) и обязан
    совпасть с ответом в исходнике; неоднозначные сцены не допускаются.

Запуск: python tools/fahrschule/build.py
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(BASE, 'tools', 'fahrschule', 'src')
SIGN_META = os.path.join(BASE, 'tools', 'fahrschule', 'signs.json')
OUT = os.path.join(BASE, 'data', 'fahrschule')
LANGS = ['ru', 'uk', 'ar']

# Слово — как в js/fahrschule.js (WORD_RE): держать одинаковыми
WORD_RE = re.compile(r'km/h|[A-Za-zÄÖÜäöüßÉé]+(?:-[A-Za-zÄÖÜäöüßÉé]+)*')

CYR = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')
ARABIC = re.compile(r'[؀-ۿ]')
RU_ONLY = re.compile(r'[ЫыЭэЪъЁё]')
UK_ONLY = re.compile(r'[ІіЇїЄєҐґ]')
LATIN_DE = re.compile(r'[A-Za-zÄäÖöÜüß]')

# Части речи — те же подписи, что в глоссариях книг и новостей
POS = {
    'сущ.': ('ім.', 'اسم'), 'гл.': ('дієсл.', 'فعل'), 'прил.': ('прикм.', 'صفة'),
    'нареч.': ('присл.', 'ظرف'), 'мест.': ('займ.', 'ضمير'), 'предл.': ('прийм.', 'حرف جر'),
    'союз': ('спол.', 'أداة ربط'), 'частица': ('частка', 'أداة'), 'числ.': ('числ.', 'عدد'),
    'артикль': ('артикль', 'أداة تعريف'), 'имя собств.': ('власна назва', 'اسم علم'),
    'межд.': ('вигук', 'تعجّب'), 'выраж.': ('вираз', 'تعبير'),
}
# Существительное в украинском и арабском: строка рода и мн. числа
# (ReaderTip сам собирает её только для pos «сущ.»)
PLURAL = {'uk': ('мн.:', 'мн. немає'), 'ar': ('الجمع:', 'لا جمع له')}

KINDS = ('theory', 'dialog', 'junction', 'road')
PREFIX = {'theory': 't', 'dialog': 'p', 'junction': 'k', 'road': 'r'}   # t-01, p-01, k-01, r-03
ROAD_TYPES = ('stop', 'gap', 'side', 'overtake', 'zipper', 'parkspot', 'parallel', 'rightturn', 'zebracross', 'bus',
              'fog', 'highbeam', 'wild', 'promille', 'tired', 'lamp', 'tread', 'triangle', 'rescuelane',
              'access', 'merge', 'missed')
NUMERIC_ROAD = ('stop', 'gap', 'side', 'triangle')        # ответ — метры
HAZARDS = ('ball', 'deer')
# Боковой интервал при обгоне пешеходов и велосипедистов (§ 5 Abs. 4 StVO, с 2020)
SIDE_GAP = {'innerorts': 1.5, 'außerorts': 2}
# Где нельзя ставить машину, метры (§ 12 StVO): перекрёсток — 5 м (Abs. 3 Nr. 1),
# «зебра» — 5 м, там нельзя даже остановиться (Abs. 1), остановка автобуса —
# 15 м от знака 224 (Abs. 3 Nr. 4)
PARK_LIMIT = {'crossing': 5, 'zebra': 5, 'bus': 15}
# Туман: при видимости меньше 50 м — не быстрее 50 км/ч (§ 3 Abs. 1 StVO),
# задний противотуманный фонарь — только тогда (§ 17 Abs. 3 StVO)
FOG_SIGHT = 50
# Алкоголь (§ 24a StVG, § 316 StGB): с 0,5 ‰ нельзя; с 0,3 ‰ и признаками
# опьянения (Fahrfehler) — тоже; новичкам и до 21 года — 0,0 ‰ (§ 24c StVG)
PROMILLE_LIMIT = 0.5
PROMILLE_SYMPTOMS = 0.3
# Усталость: перерыв не реже чем раз в два часа (рекомендация ADAC/DVR)
REST_HOURS = 2
# Протектор: не меньше 1,6 мм (§ 36 Abs. 2 StVZO)
TREAD_MIN = 1.6
# Знак аварийной остановки позади места аварии, метры (правило автошкол):
# в городе ~50, на загородной ~100, на автобане 150–200 (берём минимум)
TRIANGLE = {'innerorts': 50, 'landstrasse': 100, 'autobahn': 150}
# На автобан и Kraftfahrstraße — только транспорт, который может ехать
# быстрее 60 км/ч (§ 18 Abs. 1 StVO)
AUTOBAHN_MIN = 60
VEHICLES = ('moped', 'car')
CARS = ('blue', 'red', 'green', 'yellow')
APPROACH = ('S', 'W', 'N', 'E')
TURNS = ('straight', 'left', 'right')
# Справа от машины, которая едет с этой стороны (правостороннее движение):
# с юга (едет на север) справа восток и т. д.
RIGHT = {'S': 'E', 'W': 'S', 'N': 'W', 'E': 'N'}
OPPOSITE = {'S': 'N', 'N': 'S', 'W': 'E', 'E': 'W'}
YIELD_SIGNS = ('z205', 'z206')
GREEN_ARROW = 'z720'     # Grünpfeil: при красном можно направо, после остановки
LIGHTS = ('green', 'red')
MAIN_SIGNS = ('z301', 'z306')

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def read_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write('\n')


def check_tr(where, tr):
    if not isinstance(tr, list) or len(tr) != 3:
        err(f'{where}: перевод — [ru, uk, ar]')
        return
    ru, uk, ar = tr
    if not ru or not CYR.search(ru):
        err(f'{where}: нет русского текста: {ru!r}')
    elif UK_ONLY.search(ru):
        err(f'{where}: в русском украинские буквы: {ru}')
    if not uk or not CYR.search(uk):
        err(f'{where}: нет украинского перевода')
    elif RU_ONLY.search(uk):
        err(f'{where}: в украинском русские буквы (ы/э/ъ/ё): {uk}')
    if not ar or not ARABIC.search(ar):
        err(f'{where}: нет арабского перевода')
    elif CYR.search(ar):
        err(f'{where}: кириллица в арабском: {ar}')


def check_de(where, de):
    if not isinstance(de, str) or not de.strip() or CYR.search(de) or ARABIC.search(de) or not LATIN_DE.search(de):
        err(f'{where}: немецкий текст: {de!r}')
    elif de != de.strip() or '  ' in de:
        err(f'{where}: лишние пробелы в немецком')
    elif len(de) > 200:
        err(f'{where}: длиннее 200 символов — озвучка разрежет фразу')


# Отделяемые приставки — они же предлоги и наречия (an der Kreuzung / halten
# Sie an). Глобально такая форма не может вести к глаголу: иначе каждый
# предлог молча получит подсказку «останавливаться». Значение приставки —
# только в строке, через "w".
PARTICLES = {'ab', 'an', 'auf', 'aus', 'bei', 'durch', 'ein', 'los', 'mit', 'nach',
             'vor', 'weg', 'zu', 'zurück', 'um', 'über', 'hin', 'her', 'fest', 'vorbei'}


class Glossary:
    """Слова → леммы. Общая карта форм + значения в конкретной строке."""

    def __init__(self, lexicon):
        self.lex = lexicon
        self.forms = {}
        for lemma, e in lexicon.items():
            keys = [lemma.lower()] + [x.lower() for x in e.get('f', [])]
            for k in keys:
                if ' ' in k:
                    continue          # оборот: только через "w" строки
                if k in self.forms and self.forms[k] != lemma:
                    err(f'словарь: форма «{k}» у двух лемм: {self.forms[k]} и {lemma}')
                if k in PARTICLES and e.get('pos') in ('гл.', 'выраж.'):
                    err(f'словарь: «{k}» у глагола {lemma} — приставку задают в строке через "w", '
                        f'глобально «{k}» — предлог/наречие')
                self.forms[k] = lemma
        self.used = set()

    def resolve(self, where, de, local):
        """Для строки — карта {слово: ключ} там, где значение своё, и
        ключи (слово → лемма) для общего глоссария урока."""
        local = {k.lower(): v for k, v in (local or {}).items()}
        tokens = {t.lower() for t in WORD_RE.findall(de)}
        for k in local:
            if k not in tokens:
                err(f'{where}: в "w" слово «{k}», которого нет в строке')
        keys, own = {}, {}
        for t in sorted(tokens):
            if t in local:
                lemma = local[t]
                if lemma not in self.lex:
                    err(f'{where}: «{t}» → «{lemma}», а такой леммы нет в словаре')
                    continue
                key = t + '>' + lemma
                own[t] = key
                keys[key] = lemma
            elif t in self.forms:
                keys[t] = self.forms[t]
            else:
                err(f'{where}: нет подсказки для слова «{t}» (добавьте в lexicon.json)')
                continue
            self.used.add(keys.get(own.get(t, t)))
        return keys, own


def check_lexicon(lex):
    for lemma, e in lex.items():
        where = f'словарь «{lemma}»'
        if e.get('pos') not in POS:
            err(f'{where}: часть речи {e.get("pos")!r} — нужна одна из {", ".join(POS)}')
        check_tr(where, e.get('tr'))
        if 'note' in e:
            check_tr(where + ' note', e['note'])
        if e.get('pos') == 'сущ.':
            if e.get('art') not in ('der', 'die', 'das'):
                err(f'{where}: у существительного нужен art (der/die/das)')
            if 'pl' not in e:
                err(f'{where}: у существительного нужен pl (строка или null)')
        if e.get('pos') == 'гл.' and not e.get('forms'):
            err(f'{where}: у глагола нужны forms (Präteritum · Perfekt)')


def entry_for(lemma, e, lang):
    i = LANGS.index(lang)
    out = {'ru': e['tr'][i], 'pos': e['pos'] if lang == 'ru' else POS[e['pos']][i - 1]}
    if e.get('note'):
        out['note'] = e['note'][i]
    if e.get('forms'):
        out['forms'] = e['forms']
    if e['pos'] == 'сущ.':
        if lang == 'ru':
            out['art'] = e['art']
            out['pl'] = e['pl']
        else:
            has, none = PLURAL[lang]
            out['decl'] = f'{e["art"]} {lemma} · ' + (f'{has} {e["pl"]}' if e['pl'] else none)
    return out


# ── Перекрёсток: кто кого пропускает ──

def sign_class(sign):
    if sign in YIELD_SIGNS:
        return 'yield'
    if sign in MAIN_SIGNS:
        return 'main'
    return 'none'


def beats(x, y, signs):
    """True, если машина x проезжает раньше y."""
    cx, cy = sign_class(signs.get(x['from'])), sign_class(signs.get(y['from']))
    if cx != cy and 'yield' in (cx, cy):
        return cy == 'yield'                      # знаки главнее
    if RIGHT[y['from']] == x['from']:
        return True                               # x справа от y
    if OPPOSITE[y['from']] == x['from'] and y['turn'] == 'left' and x['turn'] != 'left':
        return True                               # y поворачивает налево — пропускает встречного
    return False


def solve(cars, signs):
    """Порядок проезда или строка с причиной, почему его нет."""
    rest = list(cars)
    order = []
    while rest:
        free = [c for c in rest if not any(beats(d, c, signs) for d in rest if d is not c)]
        if not free:
            return 'тупик: каждая машина кому-то уступает'
        if len(free) > 1:
            return 'неоднозначно: могут ехать сразу ' + ', '.join(c['id'] for c in free)
        order.append(free[0]['id'])
        rest.remove(free[0])
    return order


def road_answer(sc):
    """Ответ сцены «на дороге» по немецким формулам автошкол (Faustformeln):
      путь реакции  = (v / 10) · 3
      тормозной путь = (v / 10)²; при экстренном торможении (Gefahrbremsung) — вдвое меньше
      остановочный путь = реакция + торможение
      дистанция (außerorts) = «halber Tacho»: v / 2 метров
    Возвращает словарь с числами или строку с причиной ошибки."""
    t = sc.get('type')
    if t == 'side':
        if sc.get('where') not in SIDE_GAP:
            return 'where — innerorts или außerorts'
        return {'answer': SIDE_GAP[sc['where']]}
    if t == 'overtake':
        # обгон запрещён: встречный транспорт, сплошная линия, знак 276 (§ 5 StVO)
        if sc.get('line') not in ('dashed', 'solid'):
            return 'line — dashed или solid'
        free = not sc.get('oncoming') and sc['line'] == 'dashed' and sc.get('sign') != 'z276'
        return {'answer': 'yes' if free else 'no'}
    if t == 'zipper':
        # Reißverschluss: перестраиваться в самом конце полосы, по очереди (§ 7 Abs. 4 StVO)
        return {'answer': 'end'}
    if t == 'parkspot':
        if sc.get('near') not in PARK_LIMIT:
            return 'near — ' + ', '.join(PARK_LIMIT)
        d = sc.get('dist')
        if not isinstance(d, (int, float)) or not 0 < d <= 30:
            return f'dist — расстояние в метрах (0–30), а не {d!r}'
        limit = PARK_LIMIT[sc['near']]
        return {'answer': 'yes' if d >= limit else 'no', 'limit': limit}
    if t == 'parallel':
        # в узкий карман вдоль бордюра — задним ходом
        return {'answer': 'back'}
    if t == 'rightturn':
        # поворот направо: велосипедист прямо по велодорожке и пешеход на
        # пересекаемой улице — первыми (§ 9 Abs. 3 StVO)
        if sc.get('who') not in ('bike', 'pedestrian', 'none'):
            return 'who — bike, pedestrian или none'
        return {'answer': 'go' if sc['who'] == 'none' else 'wait'}
    if t == 'zebracross':
        # «зебра»: пешеход ждёт или идёт — остановиться (§ 26 StVO)
        if sc.get('ped') not in ('waiting', 'none'):
            return 'ped — waiting или none'
        return {'answer': 'stop' if sc['ped'] == 'waiting' else 'go'}
    if t == 'bus':
        # автобус с аварийкой: стоит на остановке — мимо только шагом
        # (§ 20 Abs. 4), подъезжает к остановке — обгонять нельзя (Abs. 3)
        if sc.get('state') not in ('stopped', 'approaching'):
            return 'state — stopped или approaching'
        return {'answer': 'walk' if sc['state'] == 'stopped' else 'stay'}
    if t == 'fog':
        d = sc.get('sight')
        if not isinstance(d, int) or not 10 <= d <= 200:
            return f'sight — видимость в метрах (10–200), а не {d!r}'
        return {'answer': 'on', 'limit': FOG_SIGHT} if d < FOG_SIGHT else {'answer': 'off'}
    if t == 'highbeam':
        # дальний свет: переключиться на ближний, если кто-то едет навстречу
        # или впереди близко (§ 17 Abs. 2 StVO)
        if sc.get('who') not in ('oncoming', 'ahead', 'none'):
            return 'who — oncoming, ahead или none'
        return {'answer': 'high' if sc['who'] == 'none' else 'dim'}
    if t == 'promille':
        p = sc.get('p')
        if not isinstance(p, (int, float)) or not 0 <= p <= 3:
            return f'p — промилле 0–3, а не {p!r}'
        stay = (sc.get('novice') and p > 0) or p >= PROMILLE_LIMIT or (sc.get('symptoms') and p >= PROMILLE_SYMPTOMS)
        return {'answer': 'stay' if stay else 'drive'}
    if t == 'tired':
        h = sc.get('hours')
        if not isinstance(h, (int, float)) or not 0 < h <= 12:
            return f'hours — часы за рулём (0–12), а не {h!r}'
        return {'answer': 'rest' if sc.get('tired') or h >= REST_HOURS else 'go'}
    if t == 'lamp':
        # красная контрольная лампа — сразу остановиться, жёлтая — скоро в мастерскую
        if sc.get('color') not in ('red', 'yellow'):
            return 'color — red или yellow'
        if sc.get('lamp') not in ('oil', 'brake', 'battery', 'engine', 'tyre'):
            return 'lamp — oil, brake, battery, engine или tyre'
        return {'answer': 'stop' if sc['color'] == 'red' else 'later'}
    if t == 'tread':
        d = sc.get('depth')
        if not isinstance(d, (int, float)) or not 0.5 <= d <= 6:
            return f'depth — глубина протектора 0,5–6 мм, а не {d!r}'
        return {'answer': 'ok' if d >= TREAD_MIN else 'no'}
    if t == 'triangle':
        if sc.get('where') not in TRIANGLE:
            return 'where — ' + ', '.join(TRIANGLE)
        return {'answer': TRIANGLE[sc['where']]}
    if t == 'rescuelane':
        # Rettungsgasse (§ 11 Abs. 2 StVO): крайний левый ряд — влево, остальные — вправо
        n, k = sc.get('lanes'), sc.get('lane')
        if n not in (2, 3) or not isinstance(k, int) or not 0 <= k < n:
            return 'lanes — 2 или 3, lane — номер ряда слева (0…lanes-1)'
        return {'answer': 'left' if k == 0 else 'right'}
    if t == 'access':
        if sc.get('vehicle') not in VEHICLES:
            return 'vehicle — ' + ', '.join(VEHICLES)
        v = sc.get('vmax')
        if not isinstance(v, int) or not 6 <= v <= 250:
            return f'vmax — наибольшая скорость машины, км/ч (6–250), а не {v!r}'
        return {'answer': 'yes' if v > AUTOBAHN_MIN else 'no', 'limit': AUTOBAHN_MIN}
    if t == 'merge':
        # въезд с полосы разгона: у транспорта на автобане преимущество
        # (§ 18 Abs. 3 StVO) — грузовик рядом пропустить и встать за ним
        if not isinstance(sc.get('beside', False), bool):
            return 'beside — true/false (грузовик рядом)'
        return {'answer': 'behind' if sc.get('beside') else 'merge'}
    if t == 'missed':
        # пропустили съезд: разворот и задний ход запрещены (§ 18 Abs. 7)
        return {'answer': 'next'}
    if t == 'wild':
        # животное на дороге: ближний свет, сигнал, тормоз — не уходить в сторону
        return {'answer': 'brake'}
    v = sc.get('v')
    if not isinstance(v, int) or v % 10 or not 10 <= v <= 200:
        return f'скорость v — целое кратное 10, а не {v!r}'
    if sc.get('type') == 'gap':
        return {'answer': v // 2}
    r = v // 10 * 3
    b = (v / 10) ** 2 / (2 if sc.get('emergency') else 1)
    if b != int(b):
        return f'тормозной путь {b} — не целое; возьмите другую скорость'
    b = int(b)
    return {'reaction': r, 'brake': b, 'answer': r + b}


def solve_lights(cars, signs, lights):
    """Перекрёсток со светофором: (порядок, сколько машин едет до смены
    сигнала) или строка с причиной ошибки.

    Светофор главнее знаков и «правого перед левым» (§ 37 StVO): сначала
    едут машины на зелёный (поворот налево пропускает встречных), потом
    машины на красный с зелёной стрелкой-знаком (Zeichen 720), если
    поворачивают направо, — после остановки и пропустив тех, у кого
    зелёный. Затем сигнал меняется (немецкая последовательность: зелёный →
    жёлтый → красный; красный → красный+жёлтый → зелёный), едут остальные."""
    if set(lights) != set(APPROACH) or any(v not in LIGHTS for v in lights.values()):
        return 'светофор: нужны сигналы green/red на всех четырёх подъездах'
    if lights['S'] != lights['N'] or lights['W'] != lights['E'] or lights['S'] == lights['W']:
        return 'светофор: встречные подъезды — один сигнал, поперечные — противоположный'
    for a, s in signs.items():
        if s == GREEN_ARROW and lights[a] != 'red':
            return f'зелёная стрелка (z720) висит у красного сигнала, а у {a} — {lights[a]}'
    green = [c for c in cars if lights[c['from']] == 'green']
    arrow = [c for c in cars if lights[c['from']] == 'red' and signs.get(c['from']) == GREEN_ARROW and c['turn'] == 'right']
    later = [c for c in cars if c not in green and c not in arrow]
    parts = [solve(green, {}), solve(arrow, {}), solve(later, {})]
    for p in parts:
        if isinstance(p, str):
            return p
    return parts[0] + parts[1] + parts[2], len(parts[0]) + len(parts[1])


def main():
    units = read_json(os.path.join(SRC, 'units.json'))
    topics = read_json(os.path.join(SRC, 'topics.json'))
    lexicon = read_json(os.path.join(SRC, 'lexicon.json'))
    sign_names = read_json(os.path.join(SRC, 'signs.json'))
    sign_meta = read_json(SIGN_META) if os.path.isfile(SIGN_META) else {}

    check_lexicon(lexicon)
    gloss = Glossary(lexicon)

    for sid, s in sign_names.items():
        check_de(f'знак {sid}', s.get('de'))
        check_tr(f'знак {sid}', s.get('tr'))
        if not os.path.isfile(os.path.join(OUT, 'signs', sid + '.svg')):
            err(f'знак {sid}: нет data/fahrschule/signs/{sid}.svg (python tools/fahrschule/fetch_signs.py)')
        m = sign_meta.get(sid)
        if not m or not m.get('source') or not re.search(r'public domain|cc0', m.get('license', ''), re.I):
            err(f'знак {sid}: нет свободной лицензии в tools/fahrschule/signs.json')

    built = {lang: [] for lang in LANGS}
    index = {lang: [] for lang in LANGS}
    ids = set()

    for u in units:
        uid = u.get('id', '?')
        if uid in ids:
            err(f'{uid}: id повторяется')
        ids.add(uid)
        kind = u.get('kind')
        if kind not in KINDS:
            err(f'{uid}: kind {kind!r}')
            continue
        if not re.match(r'^[a-z]-\d\d$', uid):
            err(f'{uid}: id вида t-01 / p-01 / k-01 / r-03')
        if uid[0] != PREFIX[kind]:
            err(f'{uid}: у {kind} id начинается с {PREFIX[kind]}-')
        for key in ('emoji', 'level', 'title', 'titleTr', 'intro'):
            if not u.get(key):
                err(f'{uid}: нет поля {key}')
        check_de(f'{uid} название', u.get('title', ''))
        check_tr(f'{uid} название', u.get('titleTr'))
        check_tr(f'{uid} вступление', u.get('intro'))

        keys = {}        # общий глоссарий урока: ключ → лемма
        used_signs = set()

        def text(where, obj):
            """{de, tr, w?} → по языкам {de, tr, o?} и ключи в глоссарий."""
            check_de(where, obj.get('de'))
            check_tr(where, obj.get('tr'))
            k, own = gloss.resolve(where, obj.get('de') or '', obj.get('w'))
            keys.update(k)
            res = {}
            for i, lang in enumerate(LANGS):
                t = {'de': obj.get('de'), 'tr': (obj.get('tr') or [''] * 3)[i]}
                if own:
                    t['o'] = own
                res[lang] = t
            return res

        title_keys, _ = gloss.resolve(f'{uid} название', u.get('title', ''), None)
        keys.update(title_keys)
        per = {lang: {} for lang in LANGS}

        if kind == 'theory':
            secs = u.get('sections') or []
            if not secs:
                err(f'{uid}: нет разделов')
            out_secs = {lang: [] for lang in LANGS}
            for si, sec in enumerate(secs, 1):
                check_tr(f'{uid} раздел {si}', sec.get('title'))
                lines = {lang: [] for lang in LANGS}
                for li, ln in enumerate(sec.get('lines') or [], 1):
                    t = text(f'{uid} раздел {si} строка {li}', ln)
                    if ln.get('sign'):
                        if ln['sign'] not in sign_names:
                            err(f'{uid} раздел {si} строка {li}: нет знака {ln["sign"]}')
                        used_signs.add(ln['sign'])
                    for lang in LANGS:
                        if ln.get('sign'):
                            t[lang]['sign'] = ln['sign']
                        lines[lang].append(t[lang])
                if not lines['ru']:
                    err(f'{uid} раздел {si}: нет строк')
                for i, lang in enumerate(LANGS):
                    out_secs[lang].append({'title': (sec.get('title') or [''] * 3)[i], 'lines': lines[lang]})
            quiz = u.get('quiz') or []
            explained = {ln.get('sign') for sec in secs for ln in sec.get('lines') or []}
            for qi, q in enumerate(quiz, 1):
                opts = [q.get('sign')] + list(q.get('wrong') or [])
                if len(opts) != 3 or len(set(opts)) != 3:
                    err(f'{uid} тест {qi}: нужен знак и два разных неверных варианта')
                for s in opts:
                    if s not in sign_names:
                        err(f'{uid} тест {qi}: нет знака {s}')
                    used_signs.add(s)
                if q.get('sign') not in explained:
                    err(f'{uid} тест {qi}: знак {q.get("sign")} не объяснён в теории — нечем пояснить ответ')
            if quiz and len({q.get('sign') for q in quiz}) != len(quiz):
                err(f'{uid}: в тесте знак повторяется')
            question = text(f'{uid} вопрос теста', u.get('quizQuestion') or {}) if quiz else None
            for lang in LANGS:
                per[lang]['sections'] = out_secs[lang]
                per[lang]['quiz'] = [{'sign': q['sign'], 'wrong': q['wrong']} for q in quiz]
                if question:
                    per[lang]['quizQuestion'] = question[lang]
            count = sum(len(s['lines']) for s in out_secs['ru'])

        elif kind == 'dialog':
            sp = u.get('speakers') or {}
            if set(sp) != {'A', 'B'} or any(s.get('g') not in ('f', 'm') or not s.get('name') for s in sp.values()):
                err(f'{uid}: персонажи A и B с name и g (f/m)')
            prev = None
            lines = {lang: [] for lang in LANGS}
            for li, ln in enumerate(u.get('lines') or [], 1):
                if ln.get('s') not in ('A', 'B'):
                    err(f'{uid} реплика {li}: персонаж {ln.get("s")!r}')
                if ln.get('s') == prev:
                    err(f'{uid} реплика {li}: персонаж говорит дважды подряд')
                prev = ln.get('s')
                t = text(f'{uid} реплика {li}', ln)
                for lang in LANGS:
                    t[lang]['s'] = ln.get('s')
                    lines[lang].append(t[lang])
            if len(lines['ru']) < 8:
                err(f'{uid}: в диалоге меньше 8 реплик')
            for lang in LANGS:
                per[lang]['speakers'] = sp
                per[lang]['lines'] = lines[lang]
            count = len(lines['ru'])

        elif kind == 'junction':
            scenes = u.get('scenes') or []
            if not scenes:
                err(f'{uid}: нет сцен')
            out = {lang: [] for lang in LANGS}
            for ci, sc in enumerate(scenes, 1):
                w = f'{uid} сцена {ci}'
                cars = sc.get('cars') or []
                signs = sc.get('signs') or {}
                lights = sc.get('lights') or None
                switch_at = None
                if not 2 <= len(cars) <= 4:
                    err(f'{w}: машин от 2 до 4')
                if len({c.get('id') for c in cars}) != len(cars) or any(c.get('id') not in CARS for c in cars):
                    err(f'{w}: машины — разные из {", ".join(CARS)}')
                if len({c.get('from') for c in cars}) != len(cars) or any(c.get('from') not in APPROACH for c in cars):
                    err(f'{w}: у каждой машины свой подъезд из {", ".join(APPROACH)}')
                if any(c.get('turn') not in TURNS for c in cars):
                    err(f'{w}: turn — {", ".join(TURNS)}')
                for a, s in signs.items():
                    if a not in APPROACH or s not in sign_names:
                        err(f'{w}: знак {a}: {s}')
                    used_signs.add(s)
                if GREEN_ARROW in signs.values() and not lights:
                    err(f'{w}: зелёная стрелка (z720) бывает только у светофора')
                if not errors:
                    got = solve_lights(cars, signs, lights) if lights else solve(cars, signs)
                    if isinstance(got, tuple):
                        got, switch_at = got
                    if isinstance(got, str):
                        err(f'{w}: {got}')
                    elif got != sc.get('order'):
                        err(f'{w}: по правилам порядок {got}, а в исходнике {sc.get("order")}')
                sit = text(w + ' ситуация', sc.get('situation') or {})
                expl = [text(f'{w} пояснение {k}', e) for k, e in enumerate(sc.get('explain') or [], 1)]
                if not expl:
                    err(f'{w}: нет пояснения')
                for lang in LANGS:
                    scene = {
                        'situation': sit[lang], 'cars': cars, 'signs': signs,
                        'order': sc.get('order'), 'explain': [e[lang] for e in expl],
                    }
                    if lights:
                        scene['lights'] = lights         # сигналы до смены
                        scene['switchAt'] = switch_at    # столько машин едет до смены сигнала
                    out[lang].append(scene)
            for lang in LANGS:
                per[lang]['scenes'] = out[lang]
            count = len(scenes)

        elif kind == 'road':
            scenes = u.get('scenes') or []
            if not scenes:
                err(f'{uid}: нет сцен')
            out = {lang: [] for lang in LANGS}
            for ci, sc in enumerate(scenes, 1):
                w = f'{uid} сцена {ci}'
                if sc.get('type') not in ROAD_TYPES:
                    err(f'{w}: type — {", ".join(ROAD_TYPES)}')
                    continue
                if sc['type'] == 'stop' and sc.get('hazard') not in HAZARDS:
                    err(f'{w}: hazard — {", ".join(HAZARDS)}')
                got = road_answer(sc)
                if isinstance(got, str):
                    err(f'{w}: {got}')
                    continue
                opts = sc.get('options') or []
                expl_src = sc.get('explain') or []
                if sc['type'] == 'tread' and not any('1,6' in e.get('de', '') for e in expl_src):
                    err(f'{w}: в пояснении нет минимума 1,6 мм')
                opt_out = {lang: opts for lang in LANGS}
                if sc['type'] in NUMERIC_ROAD:
                    if len(opts) != 3 or len(set(opts)) != 3 or not all(isinstance(o, (int, float)) and o > 0 for o in opts):
                        err(f'{w}: options — три разных положительных числа (метры)')
                    if got['answer'] not in opts:
                        err(f'{w}: по правилу ответ {got["answer"]} м, его нет среди {opts}')
                    # числа в пояснении обязаны совпасть с формулой (1,5 — с запятой, как по-немецки)
                    nums = {x.replace(',', '.') for e in expl_src for x in re.findall(r'\d+(?:,\d+)?', e.get('de', ''))}
                    for k in ('reaction', 'brake', 'answer'):
                        if k in got and f'{got[k]:g}' not in nums:
                            err(f'{w}: в пояснении нет числа {got[k]:g} ({k})')
                elif 'limit' in got and not any(str(got['limit']) in re.findall(r'\d+', e.get('de', '')) for e in expl_src):
                    err(f'{w}: в пояснении нет предельного расстояния {got["limit"]} м')
                if sc['type'] not in NUMERIC_ROAD:
                    # варианты-фразы: {key, de, tr}; ответ — key
                    opt_keys = [o.get('key') for o in opts if isinstance(o, dict)]
                    if len(opt_keys) != len(opts) or len(set(opt_keys)) != len(opt_keys) or not 2 <= len(opt_keys) <= 3:
                        err(f'{w}: options — 2–3 варианта {{key, de, tr}} с разными key')
                    if got['answer'] not in opt_keys:
                        err(f'{w}: по правилу ответ «{got["answer"]}», такого key нет среди {opt_keys}')
                    for o in opts:
                        if isinstance(o, dict):
                            check_de(f'{w} вариант {o.get("key")}', o.get('de'))
                            check_tr(f'{w} вариант {o.get("key")}', o.get('tr'))
                    opt_out = {lang: [{'key': o.get('key'), 'de': o.get('de'), 'tr': (o.get('tr') or [''] * 3)[i]}
                                      for o in opts if isinstance(o, dict)] for i, lang in enumerate(LANGS)}
                    if sc.get('sign'):
                        if sc['sign'] not in sign_names:
                            err(f'{w}: нет знака {sc["sign"]}')
                        used_signs.add(sc['sign'])
                sit = text(w + ' ситуация', sc.get('situation') or {})
                q = text(w + ' вопрос', sc.get('question') or {})
                expl = [text(f'{w} пояснение {k}', e) for k, e in enumerate(expl_src, 1)]
                if not expl:
                    err(f'{w}: нет пояснения')
                for lang in LANGS:
                    scene = {'type': sc['type'], 'options': opt_out[lang],
                             'situation': sit[lang], 'question': q[lang], 'explain': [e[lang] for e in expl]}
                    scene.update(got)
                    if 'v' in sc:
                        scene['v'] = sc['v']
                    if sc['type'] == 'stop':
                        scene['hazard'] = sc['hazard']
                        scene['emergency'] = bool(sc.get('emergency'))
                    for k in ('where', 'line', 'oncoming', 'sign', 'near', 'dist', 'who', 'ped', 'state', 'sight', 'p', 'novice', 'symptoms', 'hours', 'tired', 'color', 'lamp', 'depth', 'lanes', 'lane',
                              'vehicle', 'vmax', 'beside'):
                        if k in sc:
                            scene[k] = sc[k]
                    out[lang].append(scene)
            for lang in LANGS:
                per[lang]['scenes'] = out[lang]
            count = len(scenes)

        # названия знаков (подписи и варианты теста) — тоже с подсказками
        for s in sorted(used_signs):
            if s in sign_names:
                keys.update(gloss.resolve(f'{uid} знак {s}', sign_names[s]['de'], None)[0])

        for i, lang in enumerate(LANGS):
            signs_out = {}
            for s in sorted(used_signs):
                if s not in sign_names:
                    continue
                m = sign_meta.get(s, {})
                signs_out[s] = {
                    'de': sign_names[s]['de'], 'tr': sign_names[s]['tr'][i],
                    'src': f'data/fahrschule/signs/{s}.svg', 'n': sign_names[s].get('n') or s[1:],
                    'license': m.get('license', ''), 'source': m.get('source', ''),
                }
            unit = {
                'id': uid, 'kind': kind, 'emoji': u.get('emoji'), 'level': u.get('level'),
                'title': u.get('title'), 'titleTr': (u.get('titleTr') or [''] * 3)[i],
                'intro': (u.get('intro') or [''] * 3)[i],
            }
            unit.update(per[lang])
            unit['signs'] = signs_out
            unit['gloss'] = {
                'w': dict(sorted(keys.items())),
                'l': {lm: entry_for(lm, lexicon[lm], lang) for lm in sorted(set(keys.values())) if lm in lexicon},
            }
            built[lang].append(unit)
            index[lang].append({
                'id': uid, 'kind': kind, 'emoji': u.get('emoji'), 'level': u.get('level'),
                'title': u.get('title'), 'titleTr': unit['titleTr'], 'count': count,
            })
    # темы: каждый урок ровно в одной, порядок уроков — как в теме
    topics_out = {lang: [] for lang in LANGS}
    seen = {}
    for ti, t in enumerate(topics, 1):
        where = f'тема {t.get("id") or ti}'
        if not re.match(r'^[a-z][a-z0-9-]*$', t.get('id') or ''):
            err(f'{where}: id латиницей (vorfahrt, zeichen-ampeln)')
        check_de(where, t.get('title'))
        check_tr(where, t.get('tr'))
        if not t.get('emoji') or not t.get('units'):
            err(f'{where}: нужны emoji и units')
        for uid in t.get('units') or []:
            if uid not in ids:
                err(f'{where}: нет урока {uid}')
            if uid in seen:
                err(f'{where}: урок {uid} уже в теме {seen[uid]}')
            seen[uid] = t.get('id')
        for i, lang in enumerate(LANGS):
            topics_out[lang].append({'id': t.get('id'), 'emoji': t.get('emoji'), 'title': t.get('title'),
                                     'titleTr': (t.get('tr') or [''] * 3)[i], 'units': t.get('units') or []})
    for uid in sorted(ids - set(seen)):
        err(f'{uid}: урок не входит ни в одну тему (tools/fahrschule/src/topics.json)')
    if len({t.get('id') for t in topics}) != len(topics):
        err('темы: id повторяется')

    unused = sorted(set(lexicon) - gloss.used)
    if unused:
        err('словарь: леммы нигде не встречаются (удалите или используйте): ' + ', '.join(unused))

    if errors:
        for w in warnings:
            print('WARNING:', w)
        for e in errors:
            print('ERROR:', e)
        print(f'\nОшибок: {len(errors)} — ничего не записано')
        return 1

    dirs = {'ru': OUT, 'uk': os.path.join(BASE, 'i18n', 'uk', 'fahrschule'),
            'ar': os.path.join(BASE, 'i18n', 'ar', 'fahrschule')}
    for lang in LANGS:
        d = dirs[lang]
        keep = {u['id'] + '.json' for u in built[lang]} | {'index.json'}
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.endswith('.json') and f not in keep:
                    os.remove(os.path.join(d, f))    # урок убрали из исходника
        write_json(os.path.join(d, 'index.json'), {'topics': topics_out[lang], 'units': index[lang]})
        for unit in built[lang]:
            write_json(os.path.join(d, unit['id'] + '.json'), unit)

    for w in warnings:
        print('WARNING:', w)
    kinds = {k: sum(1 for u in units if u['kind'] == k) for k in KINDS}
    print(f'fahrschule: ok — тем {len(topics)}, уроков {len(units)} {kinds}, слов в словаре {len(lexicon)}, знаков {len(sign_names)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
