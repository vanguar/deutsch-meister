#!/usr/bin/env python3
"""
validate_laender.py — проверка раздела «Земли Германии» (laender.html).

Запуск:  python scripts/validate_laender.py
Код возврата: 0 — ок, 1 — есть ошибки.

Проверяет собранное (tools/laender/build.py):
  * витрина data/laender/lands.json: ровно 16 земель, у каждой контур на
    карте (map.json), флаг SVG со свободной лицензией (tools/laender/flags.json);
  * готовая земля: паспорт, источник со ссылкой и датой сверки, тест
    (2–4 варианта, номер верного, пояснение), тексты B1/B2 есть в
    data/laender/index.json и в папках;
  * копии i18n/uk/laender и i18n/ar/laender: та же структура, немецкий
    тот же, переводы на своём языке (украинский без ы/э/ъ/ё, арабский
    арабицей без кириллицы); у пробного арабского нет непереведённых строк;
  * laender.html подключает ридер, laender.js и стили; на главной есть
    плитка раздела; service worker кладёт оболочку в кеш.
Сами тексты (подсказки над каждым словом) проверяет
python scripts/validate_books.py --laender.
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CYR = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')
RU_ONLY = re.compile(r'[ЫыЭэЪъЁё]')
ARABIC = re.compile(r'[؀-ۿ]')
FREE = re.compile(r'public domain|cc0', re.I)
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
LANGS = {'uk': 'i18n/uk/laender', 'ar': 'i18n/ar/laender'}

errors = []


def err(msg):
    errors.append(msg)


def load(rel):
    path = os.path.join(BASE, rel)
    if not os.path.isfile(path):
        err('нет файла ' + rel)
        return None
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def read(rel):
    with open(os.path.join(BASE, rel), encoding='utf-8') as f:
        return f.read()


def strings(obj, out, path=''):
    """Все строки с кириллицей (переводимые) и их путь в структуре."""
    if isinstance(obj, str):
        if CYR.search(obj):
            out.append((path, obj))
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if path == '' and k == 'w':
                continue      # glossary.w: словоформа → имя леммы (ключ, не перевод)
            strings(v, out, path + '.' + k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            strings(v, out, path + '[%d]' % i)
    return out


def same_shape(ru, tr):
    """Структура та же, немецкий и числа те же; переводятся только строки
    с кириллицей в русской копии."""
    if isinstance(ru, str):
        return isinstance(tr, str) and (bool(CYR.search(ru)) or ru == tr)
    if isinstance(ru, dict):
        return isinstance(tr, dict) and ru.keys() == tr.keys() and all(same_shape(ru[k], tr[k]) for k in ru)
    if isinstance(ru, list):
        return isinstance(tr, list) and len(ru) == len(tr) and all(same_shape(x, y) for x, y in zip(ru, tr))
    return ru == tr


def check_copy(lang, rel_ru, rel_tr):
    ru, tr = load(rel_ru), load(rel_tr)
    if ru is None or tr is None:
        return
    if not same_shape(ru, tr):
        err('%s: структура или немецкий текст отличаются от %s' % (rel_tr, rel_ru))
    for path, s in strings(tr, []):
        if lang == 'ar':
            err('%s%s: кириллица в арабской копии: %s' % (rel_tr, path, s[:60]))
        elif RU_ONLY.search(s):
            err('%s%s: русские буквы в украинской копии: %s' % (rel_tr, path, s[:60]))
    if lang == 'uk':
        same = [s for _, s in strings(ru, []) if s in {x for _, x in strings(tr, [])} and RU_ONLY.search(s)]
        if same:
            err('%s: не переведено: %s' % (rel_tr, '; '.join(same[:3])))


def main():
    lands = load('data/laender/lands.json')
    shapes = load('data/laender/map.json')
    index = load('data/laender/index.json')
    flags = load('tools/laender/flags.json') or {}
    if not lands or not shapes or index is None:
        return report()
    items = {it['id']: it for it in index.get('items', [])}
    ids = [l['id'] for l in lands.get('lands', [])]
    if len(ids) != 16 or len(set(ids)) != 16:
        err('lands.json: должно быть 16 разных земель, а их %d' % len(set(ids)))
    for land in lands.get('lands', []):
        lid = land['id']
        where = 'lands.json ' + lid
        if lid not in shapes.get('lands', {}):
            err(where + ': нет контура в map.json')
        if not os.path.isfile(os.path.join(BASE, land.get('flag', ''))):
            err(where + ': нет файла флага')
        if not FREE.search((flags.get(lid) or {}).get('license', '')):
            err(where + ': у флага нет свободной лицензии')
        if not land.get('ready'):
            if land.get('texts'):
                err(where + ': не готова, а тексты есть')
            continue
        if not land.get('facts') or not all(isinstance(f, list) and len(f) == 2 and f[0] and f[1] for f in land['facts']):
            err(where + ': паспорт — список пар [подпись, значение]')
        if not land.get('source') or not str(land.get('sourceUrl', '')).startswith('https://'):
            err(where + ': нет источника со ссылкой')
        if not DATE_RE.match(str(land.get('checked', ''))):
            err(where + ': дата сверки checked — ГГГГ-ММ-ДД')
        for qi, q in enumerate(land.get('quiz') or [], 1):
            if not (2 <= len(q.get('opts', [])) <= 4 and isinstance(q.get('a'), int) and 0 <= q['a'] < len(q['opts'])):
                err('%s тест %d: 2–4 варианта и номер верного' % (where, qi))
            if not q.get('why') or not q.get('q'):
                err('%s тест %d: нет вопроса или пояснения' % (where, qi))
        if len(land.get('quiz') or []) < 4:
            err(where + ': в тесте меньше 4 вопросов')
        for lv, t in (land.get('texts') or {}).items():
            if t['id'] not in items:
                err('%s: текста %s нет в data/laender/index.json' % (where, t['id']))
            if not os.path.isfile(os.path.join(BASE, 'data', 'laender', t['id'], 'meta.json')):
                err('%s: нет папки текста %s' % (where, t['id']))
            if len(t.get('toc') or []) != t.get('chapters'):
                err('%s: оглавление %s не совпадает с числом глав' % (where, t['id']))

    for lang, d in LANGS.items():
        check_copy(lang, 'data/laender/lands.json', d + '/lands.json')
        check_copy(lang, 'data/laender/index.json', d + '/index.json')
        for tid in items:
            folder = os.path.join(BASE, 'data', 'laender', tid)
            for f in sorted(os.listdir(folder)):
                if f.endswith('.json'):
                    check_copy(lang, 'data/laender/%s/%s' % (tid, f), '%s/%s/%s' % (d, tid, f))

    html = read('laender.html')
    for need in ('js/i18n.js', 'js/reader.js', 'js/laender.js', 'css/reader.css', 'css/laender.css',
                 'data-reader-dir="data/laender/"'):
        if need not in html:
            err('laender.html: нет ' + need)
    if 'openLaenderPage()' not in read('index.html'):
        err('index.html: нет плитки «Земли Германии»')
    sw = read('service-worker.js')
    for need in ("'/laender.html'", "'/js/laender.js", "'/css/laender.css", "'/data/laender/lands.json'"):
        if need not in sw:
            err('service-worker.js: нет ' + need)
    if 'laender' not in read('js/i18n.js'):
        err('js/i18n.js: копии i18n/<lang>/laender не подставляются')
    return report()


def report():
    for e in errors:
        print('ERROR:', e)
    if errors:
        print('\nlaender: ошибок %d' % len(errors))
        return 1
    print('laender: ok')
    return 0


if __name__ == '__main__':
    sys.exit(main())
