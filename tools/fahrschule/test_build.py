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


# ── 2. Сборка ловит ошибки и ничего не пишет ──
SRC = build.SRC
real = {f: json.load(open(os.path.join(SRC, f), encoding='utf-8')) for f in ('units.json', 'lexicon.json', 'signs.json')}


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
    {'de': 'Das Fahrrad fährt.', 'tr': ['Велосипед едет.', 'Велосипед їде.', 'الدراجة تسير.']}))
ok(code == 1 and any('fahrrad' in e for e in errs) and not written, 'слово без подсказки — ошибка, ничего не записано')

code, errs, written = run_with(lambda d: unit(d, 'k-01')['scenes'][0].__setitem__('order', ['blue', 'red']))
ok(code == 1 and any('по правилам порядок' in e for e in errs) and not written, 'неверный порядок проезда — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'p-01')['lines'][0]['tr'].__setitem__(1, 'Добрый день, пані!'))
ok(code == 1 and any('русские буквы' in e for e in errs), 'русские буквы в украинском — ошибка')

code, errs, written = run_with(lambda d: d['lexicon.json'].__setitem__(
    'Fahrrad', {'pos': 'сущ.', 'art': 'das', 'pl': 'die Fahrräder', 'tr': ['велосипед', 'велосипед', 'دراجة']}))
ok(code == 1 and any('нигде не встречаются' in e and 'Fahrrad' in e for e in errs), 'лишняя лемма в словаре — ошибка')

code, errs, written = run_with(lambda d: unit(d, 'p-01')['lines'][1].__setitem__('w', {'stellen': 'einstellen'}))
ok(code == 1 and any('которого нет в строке' in e for e in errs), '"w" на слово, которого нет в строке — ошибка')

code, errs, written = run_with(lambda d: unit(d, 't-01')['quiz'].append({'sign': 'z102', 'wrong': ['z205', 'z205']}))
ok(code == 1 and any('тест' in e for e in errs), 'тест: повтор неверного варианта — ошибка')

print(f'\nFAIL: {fails}' if fails else '\ntest_build: всё ок')
sys.exit(1 if fails else 0)
