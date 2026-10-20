#!/usr/bin/env python3
"""
Тесты сборщика раздела «Автошкола» (tools/fahrschule/build.py).

  python tools/fahrschule/test_build.py

1. Решатель перекрёстка: «правый перед левым», знаки главнее, поворот
   налево уступает встречным, тупик и неоднозначность ловятся.
2. Сборка ловит ошибки исходника и при этом НИЧЕГО не пишет: слово без
   подсказки, неверный порядок проезда, русские буквы в украинском,
   лишняя лемма, «w» на слово, которого нет в строке. Исходники
   подменяются во временной папке, рабочие data/ и i18n/ не трогаются.
"""

import copy
import importlib.util
import json
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('fs_build', os.path.join(HERE, 'build.py'))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

fails = 0


def ok(cond, msg):
    global fails
    print(('  ok   ' if cond else '  FAIL ') + msg)
    if not cond:
        fails += 1


def car(cid, frm, turn='straight'):
    return {'id': cid, 'from': frm, 'turn': turn}


# ── 1. Решатель ──
ok(build.solve([car('blue', 'S'), car('red', 'E')], {}) == ['red', 'blue'],
   'правый перед левым: машина справа первая')
ok(build.solve([car('green', 'S'), car('yellow', 'W')], {'S': 'z205', 'W': 'z306'}) == ['yellow', 'green'],
   'знаки главнее правила «правый перед левым»')
ok(build.solve([car('green', 'S'), car('yellow', 'W')], {'S': 'z206'}) == ['yellow', 'green'],
   '«Стоп» уступает дороге без знака')
ok(build.solve([car('blue', 'S'), car('green', 'N', 'left')], {}) == ['blue', 'green'],
   'поворот налево пропускает встречного')
ok(build.solve([car('blue', 'S'), car('red', 'W'), car('green', 'N', 'left')], {}) == ['blue', 'red', 'green'],
   'три машины: синяя, красная, зелёная')
ok(isinstance(build.solve([car('a', 'S'), car('b', 'W'), car('c', 'N'), car('d', 'E')], {}), str)
   and 'тупик' in build.solve([car('a', 'S'), car('b', 'W'), car('c', 'N'), car('d', 'E')], {}),
   'четыре машины без знаков — тупик')
ok('неоднозначно' in str(build.solve([car('blue', 'S'), car('green', 'N')], {})),
   'две встречные прямо — неоднозначно (сцена не допускается)')

L_NS = {'S': 'green', 'N': 'green', 'W': 'red', 'E': 'red'}
L_WE = {'S': 'red', 'N': 'red', 'W': 'green', 'E': 'green'}
ok(build.solve_lights([car('blue', 'S'), car('red', 'E')], {}, L_NS) == (['blue', 'red'], 1),
   'светофор главнее «правого перед левым»')
ok(build.solve_lights([car('blue', 'S'), car('green', 'N', 'left'), car('yellow', 'W')], {}, L_NS) == (['blue', 'green', 'yellow'], 2),
   'на зелёный: налево пропускает встречного; красный ждёт смены')
ok(build.solve_lights([car('blue', 'W'), car('red', 'S', 'right'), car('green', 'N')], {'S': 'z720'}, L_WE) == (['blue', 'red', 'green'], 2),
   'зелёная стрелка: направо на красный после зелёных, до смены сигнала')
ok(build.solve_lights([car('blue', 'W'), car('red', 'S', 'straight')], {'S': 'z720'}, L_WE) == (['blue', 'red'], 1),
   'зелёная стрелка не даёт ехать прямо — только после смены')
ok('противоположный' in str(build.solve_lights([car('a', 'S'), car('b', 'W')], {}, {'S': 'green', 'N': 'green', 'W': 'green', 'E': 'green'})),
   'зелёный сразу всем — ошибка сцены')
ok('красного' in str(build.solve_lights([car('a', 'S'), car('b', 'W')], {'S': 'z720'}, L_NS)),
   'зелёная стрелка у зелёного сигнала — ошибка сцены')

# Формулы автошкол: реакция (v/10)·3, тормозной (v/10)², экстренно — вдвое, дистанция v/2
ok(build.road_answer({'type': 'stop', 'v': 50}) == {'reaction': 15, 'brake': 25, 'answer': 40}, 'остановочный путь при 50: 15 + 25 = 40')
ok(build.road_answer({'type': 'stop', 'v': 100}) == {'reaction': 30, 'brake': 100, 'answer': 130}, 'при 100: 30 + 100 = 130')
ok(build.road_answer({'type': 'stop', 'v': 60, 'emergency': True}) == {'reaction': 18, 'brake': 18, 'answer': 36}, 'экстренно при 60: 18 + 18 = 36')
ok(build.road_answer({'type': 'gap', 'v': 100}) == {'answer': 50}, 'дистанция при 100 — половина спидометра, 50 м')
ok('не целое' in str(build.road_answer({'type': 'stop', 'v': 50, 'emergency': True})), 'дробный тормозной путь (12,5 м) — ошибка сцены')
ok(build.road_answer({'type': 'fog', 'sight': 30}) == {'answer': 'on', 'limit': 50}, 'туман 30 м: противотуманный фонарь, не быстрее 50')
ok(build.road_answer({'type': 'fog', 'sight': 50}) == {'answer': 'off'}, 'туман ровно 50 м — фонарь нельзя (только меньше 50)')
ok(build.road_answer({'type': 'highbeam', 'who': 'oncoming'})['answer'] == 'dim', 'встречная машина — ближний свет')
ok(build.road_answer({'type': 'highbeam', 'who': 'ahead'})['answer'] == 'dim', 'машина близко впереди — ближний свет')
ok(build.road_answer({'type': 'highbeam', 'who': 'none'})['answer'] == 'high', 'никого — дальний можно')
ok(build.road_answer({'type': 'wild'})['answer'] == 'brake', 'косуля — тормозить, не уходить в сторону')
ok('кратное 10' in str(build.road_answer({'type': 'stop', 'v': 55})), 'скорость не кратна 10 — ошибка сцены')
ok(build.road_answer({'type': 'side', 'where': 'innerorts'}) == {'answer': 1.5}, 'обгон велосипедиста в городе — 1,5 м')
ok(build.road_answer({'type': 'side', 'where': 'außerorts'}) == {'answer': 2}, 'обгон велосипедиста за городом — 2 м')
ok(build.road_answer({'type': 'overtake', 'line': 'dashed'}) == {'answer': 'yes'}, 'обгон: прерывистая линия, встречных нет — можно')
ok(build.road_answer({'type': 'overtake', 'line': 'dashed', 'oncoming': True}) == {'answer': 'no'}, 'обгон: встречная машина — нельзя')
ok(build.road_answer({'type': 'overtake', 'line': 'solid'}) == {'answer': 'no'}, 'обгон: сплошная линия — нельзя')
ok(build.road_answer({'type': 'overtake', 'line': 'dashed', 'sign': 'z276'}) == {'answer': 'no'}, 'обгон: знак 276 — нельзя')
ok(build.road_answer({'type': 'zipper'}) == {'answer': 'end'}, 'молния: перестраиваться в конце полосы')
ok(build.road_answer({'type': 'parkspot', 'near': 'crossing', 'dist': 3}) == {'answer': 'no', 'limit': 5}, 'парковка в 3 м от перекрёстка — нельзя (5 м)')
ok(build.road_answer({'type': 'parkspot', 'near': 'crossing', 'dist': 5}) == {'answer': 'yes', 'limit': 5}, 'ровно 5 м от перекрёстка — можно')
ok(build.road_answer({'type': 'parkspot', 'near': 'bus', 'dist': 10}) == {'answer': 'no', 'limit': 15}, 'остановка автобуса: 10 м — нельзя (15 м)')
ok(build.road_answer({'type': 'parkspot', 'near': 'zebra', 'dist': 4})['answer'] == 'no', '«зебра»: 4 м — нельзя')
ok('near' in str(build.road_answer({'type': 'parkspot', 'near': 'tree', 'dist': 4})), 'неизвестный объект — ошибка сцены')
ok(build.road_answer({'type': 'parallel'}) == {'answer': 'back'}, 'параллельная парковка — задним ходом')
ok(build.road_answer({'type': 'rightturn', 'who': 'bike'}) == {'answer': 'wait'}, 'направо: велосипедист прямо — ждать')
ok(build.road_answer({'type': 'rightturn', 'who': 'pedestrian'}) == {'answer': 'wait'}, 'направо: пешеход на улице — ждать')
ok(build.road_answer({'type': 'rightturn', 'who': 'none'}) == {'answer': 'go'}, 'направо: никого — ехать')
ok(build.road_answer({'type': 'zebracross', 'ped': 'waiting'}) == {'answer': 'stop'}, '«зебра»: пешеход ждёт — остановиться')
ok(build.road_answer({'type': 'bus', 'state': 'stopped'}) == {'answer': 'walk'}, 'автобус с аварийкой на остановке — шагом')
ok(build.road_answer({'type': 'bus', 'state': 'approaching'}) == {'answer': 'stay'}, 'автобус с аварийкой подъезжает — не обгонять')
ok(build.road_answer({'type': 'access', 'vehicle': 'moped', 'vmax': 45}) == {'answer': 'no', 'limit': 60}, 'автобан: скутер 45 км/ч — нельзя')
ok(build.road_answer({'type': 'access', 'vehicle': 'moped', 'vmax': 60})['answer'] == 'no', 'автобан: ровно 60 км/ч — нельзя (нужно быстрее 60)')
ok(build.road_answer({'type': 'access', 'vehicle': 'car', 'vmax': 160})['answer'] == 'yes', 'автобан: машина 160 км/ч — можно')
ok('vehicle' in str(build.road_answer({'type': 'access', 'vehicle': 'tank', 'vmax': 60})), 'автобан: неизвестный транспорт — ошибка сцены')
ok(build.road_answer({'type': 'merge', 'beside': True}) == {'answer': 'behind'}, 'полоса разгона: грузовик рядом — встать за ним')
ok(build.road_answer({'type': 'merge'}) == {'answer': 'merge'}, 'полоса разгона: промежуток свободен — встраиваться')
ok(build.road_answer({'type': 'missed'}) == {'answer': 'next'}, 'пропущенный съезд — до следующего, без разворота')
ok(build.road_answer({'type': 'roundabout', 'ask': 'enter'}) == {'answer': 'none'}, 'кольцо: при въезде не мигать')
ok(build.road_answer({'type': 'roundabout', 'ask': 'exit'}) == {'answer': 'right'}, 'кольцо: перед съездом — направо')
ok(build.road_answer({'type': 'roundabout', 'ask': 'yield', 'inside': True}) == {'answer': 'wait'}, 'кольцо: машина в круге — пропустить')
ok(build.road_answer({'type': 'roundabout', 'ask': 'yield', 'inside': False}) == {'answer': 'go'}, 'кольцо: в круге пусто — ехать')
ok('inside' in str(build.road_answer({'type': 'roundabout', 'ask': 'yield'})), 'кольцо: без inside — ошибка сцены')
ok(build.road_answer({'type': 'railway', 'signal': 'red'}) == {'answer': 'stop'}, 'переезд: мигает красный — стоять')
ok(build.road_answer({'type': 'railway', 'signal': 'none'}) == {'answer': 'go'}, 'переезд: сигнала нет — проезжать без остановки')
ok(build.road_answer({'type': 'yellow'}) == {'answer': 'yellow'}, 'ремонт дороги: жёлтая разметка главнее')
ok(build.road_answer({'type': 'shift', 'rpm': 2500, 'gear': 2}) == {'answer': 'up', 'limit': 2000}, 'обороты 2500 — переключаться вверх')
ok(build.road_answer({'type': 'shift', 'rpm': 1500, 'gear': 3})['answer'] == 'stay', 'обороты 1500 — рано переключаться')
ok('gear' in str(build.road_answer({'type': 'shift', 'rpm': 1500})), 'без передачи — ошибка сцены')
ok(build.road_answer({'type': 'idle', 'wait': 180, 'where': 'rail'}) == {'answer': 'off', 'limit': 20}, 'шлагбаум 3 минуты — заглушить мотор')
ok(build.road_answer({'type': 'idle', 'wait': 5, 'where': 'zebra'})['answer'] == 'on', '«зебра» 5 секунд — мотор не глушить')
ok(build.road_answer({'type': 'umweltzone', 'sticker': 'green'}) == {'answer': 'yes'}, 'экозона: зелёная наклейка — можно')
ok(build.road_answer({'type': 'umweltzone', 'sticker': 'yellow'})['answer'] == 'no', 'экозона: жёлтая наклейка — нельзя')
ok(build.road_answer({'type': 'umweltzone', 'sticker': 'none'})['answer'] == 'no', 'экозона: без наклейки — нельзя')


# ── 2. Сборка ловит ошибки и ничего не пишет ──
SRC = build.SRC
real = {f: json.load(open(os.path.join(SRC, f), encoding='utf-8')) for f in ('units.json', 'lexicon.json', 'signs.json', 'topics.json', 'exam.json')}


def run_with(mutate):
    """Собрать из изменённой копии исходников; вернуть (код, ошибки, писал ли)."""
    data = copy.deepcopy(real)
    mutate(data)
    with tempfile.TemporaryDirectory() as tmp:
        for f, obj in data.items():
            with open(os.path.join(tmp, f), 'w', encoding='utf-8') as fh:
                json.dump(obj, fh, ensure_ascii=False)
        build.SRC = tmp
        build.errors.clear()
        written = []
        orig = build.write_json
        build.write_json = lambda path, obj: written.append(path)
        try:
            code = build.main()
        finally:
            build.write_json = orig
            build.SRC = SRC
    return code, list(build.errors), written


def unit(data, uid):
    return next(u for u in data['units.json'] if u['id'] == uid)


code, errs, written = run_with(lambda d: None)
ok(code == 0 and not errs and written, 'исходник как есть собирается')

code, errs, written = run_with(lambda d: unit(d, 't-01')['sections'][0]['lines'].append(
    {'de': 'Das Pferd läuft.', 'tr': ['Лошадь бежит.', 'Кінь біжить.', 'الحصان يجري.']}))
ok(code == 1 and any('pferd' in e for e in errs) and not written, 'слово без подсказки — ошибка, ничего не записано')

code, errs, written = run_with(lambda d: unit(d, 'k-01')['scenes'][0].__setitem__('order', ['blue', 'red']))
ok(code == 1 and any('по правилам порядок' in e for e in errs) and not written, 'неверный порядок проезда — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'p-01')['lines'][0]['tr'].__setitem__(1, 'Добрый день, пані!'))
ok(code == 1 and any('русские буквы' in e for e in errs), 'русские буквы в украинском — ошибка')

code, errs, written = run_with(lambda d: d['lexicon.json'].__setitem__(
    'Pferd', {'pos': 'сущ.', 'art': 'das', 'pl': 'die Pferde', 'tr': ['лошадь', 'кінь', 'حصان']}))
ok(code == 1 and any('нигде не встречаются' in e and 'Pferd' in e for e in errs), 'лишняя лемма в словаре — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'p-01')['lines'][1].__setitem__('w', {'stellen': 'einstellen'}))
ok(code == 1 and any('которого нет в строке' in e for e in errs), '"w" на слово, которого нет в строке — ошибка')

code, errs, written = run_with(lambda d: unit(d, 't-01')['quiz'].append({'sign': 'z102', 'wrong': ['z205', 'z205']}))
ok(code == 1 and any('тест' in e for e in errs), 'тест: повтор неверного варианта — ошибка')

code, errs, written = run_with(lambda d: d['topics.json'][0]['units'].remove('k-01'))
ok(code == 1 and any('k-01' in e and 'ни в одну тему' in e for e in errs), 'урок без темы — ошибка')

code, errs, written = run_with(lambda d: d['topics.json'].append(dict(d['topics.json'][0], id='copy')))
ok(code == 1 and any('уже в теме' in e for e in errs), 'урок в двух темах — ошибка')

code, errs, written = run_with(lambda d: d['lexicon.json']['anhalten'].__setitem__('f', ['an']))
ok(code == 1 and any('приставку задают в строке' in e for e in errs), 'приставка «an» глобально у глагола — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'r-03')['scenes'][0].__setitem__('options', [25, 45, 50]))
ok(code == 1 and any('по правилу ответ 40' in e for e in errs), 'нет верного ответа среди вариантов — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'r-03')['scenes'][0]['explain'][2].__setitem__('de', 'Anhalteweg: 15 plus 25. Sie brauchen also 45 Meter, bis das Auto steht.'))
ok(code == 1 and any('нет числа 40' in e for e in errs), 'число в пояснении не совпало с формулой — ошибка')


def fog_no_limit(d):
    sc = next(x for x in unit(d, 'r-07')['scenes'] if x['type'] == 'fog' and x['sight'] < 50)
    for e in sc['explain']:
        e['de'] = e['de'].replace('50', 'fünfzig')


code, errs, written = run_with(fog_no_limit)
ok(code == 1 and any('предельного расстояния 50' in e for e in errs), 'туман: в пояснении нет 50 — ошибка')

# ── 3. Пробный экзамен: запас из уроков, без повторов, баллы 2–5 ──
units_ru = {u['id'] for u in build.read_json(os.path.join(build.OUT, 'index.json'))['units']}
ex = build.read_json(os.path.join(build.OUT, 'x-01.json'))
road_keys = [json.dumps({k: v for k, v in q['scene'].items() if k not in build.SCENE_TEXT}, sort_keys=True)
             for q in ex['pool'] if q['kind'] == 'road']
signs_pool = [q['sign'] for q in ex['pool'] if q['kind'] == 'sign']
ok(len(road_keys) == len(set(road_keys)) and len(signs_pool) == len(set(signs_pool)), 'экзамен: ситуации и знаки в запасе не повторяются')
ok(all(2 <= q['pts'] <= 5 for q in ex['pool']), 'экзамен: штрафные баллы 2–5')
ok(len(signs_pool) >= ex['rules']['signs'] and len(road_keys) >= ex['rules']['n'] - ex['rules']['signs'], 'экзамен: вопросов хватает на билет')
ok(all(any(t in ks for ks in build.EXAM_ROAD_POINTS.values()) for t in build.ROAD_TYPES), 'экзамен: у каждого типа ситуации есть баллы')
ok(all(q['src'] in units_ru for q in ex['pool']), 'экзамен: вопросы ссылаются на уроки из оглавления')

print(f'\nFAIL: {fails}' if fails else '\ntest_build: всё ок')
sys.exit(1 if fails else 0)
