#!/usr/bin/env python3
"""
validate_dialogs.py — проверка раздела «Диалоги» (dialogs.html).

Запуск:  python scripts/validate_dialogs.py
Код возврата: 0 — ок, 1 — есть ошибки.

Проверяет собранное (tools/dialogs/build.py + node tools/i18n.js build):
  * уровни из EXPECTED_LEVELS есть, в каждом ровно 10 диалогов, номера 1–10;
  * у диалога: число реплик по уровню (A1 8–12, A2 12–16, B1 16–20,
    B2 20–25), персонажи A/B чередуются, немецкий без кириллицы, перевод
    реплики (русский) есть;
  * переведённые копии i18n/uk/dialogs и i18n/ar/dialogs есть для каждого
    диалога и оглавления, немецкие реплики в них те же, что в data/, а
    перевод — на своём языке (украинский без ы/э/ъ/ё, арабский арабицей,
    без кириллицы);
  * фото: файлы есть, 800×450 и превью 320×180, автор, лицензия (только
    свободные) и ссылка на источник указаны;
  * dialogs.html подключает tts.js, reader-speak.js и dialogs.js.
"""

import json
import os
import re
import struct
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED_LEVELS = ['a1', 'a2']
PER_LEVEL = 10
LINES = {'a1': (8, 12), 'a2': (12, 16), 'b1': (16, 20), 'b2': (20, 25)}
FREE = re.compile(r'^(CC0|Public domain|CC BY(-SA)? \d(\.\d)?)$')
CYR = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')
RU_ONLY = re.compile(r'[ЫыЭэЪъЁё]')
ARABIC = re.compile(r'[؀-ۿ]')

errors = []


def err(msg):
    errors.append(msg)


def load(rel):
    path = os.path.join(BASE, rel)
    if not os.path.isfile(path):
        err(f'нет файла {rel}')
        return None
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def jpeg_size(path):
    """(ширина, высота) JPEG без сторонних библиотек."""
    with open(path, 'rb') as f:
        data = f.read()
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack('>HH', data[i + 5:i + 9])
            return w, h
        seg = struct.unpack('>H', data[i + 2:i + 4])[0]
        i += 2 + seg
    return None


def check_tr_lang(where, lang, text):
    if not text:
        err(f'{where}: пустой перевод ({lang})')
    elif lang == 'ru' and not CYR.search(text):
        err(f'{where}: перевод не на русском: {text}')
    elif lang == 'uk' and (not CYR.search(text) or RU_ONLY.search(text)):
        err(f'{where}: перевод не на украинском: {text}')
    elif lang == 'ar' and (not ARABIC.search(text) or CYR.search(text)):
        err(f'{where}: перевод не на арабском: {text}')


def main():
    index = load('data/dialogs/index.json')
    if not index:
        return report()
    items = index.get('items', [])
    for lv in EXPECTED_LEVELS:
        mine = sorted((it for it in items if it.get('level') == lv), key=lambda it: it['n'])
        if len(mine) != PER_LEVEL:
            err(f'{lv}: диалогов {len(mine)}, нужно {PER_LEVEL}')
        if [it['n'] for it in mine] != list(range(1, len(mine) + 1)):
            err(f'{lv}: номера диалогов не по порядку')

    tr_index = {lang: load(f'i18n/{lang}/dialogs/index.json') for lang in ('uk', 'ar')}
    for lang, idx in tr_index.items():
        if idx and len(idx.get('items', [])) != len(items):
            err(f'i18n/{lang}/dialogs/index.json: диалогов {len(idx.get("items", []))}, в data/ — {len(items)}')
        for it in (idx or {}).get('items', []):
            check_tr_lang(f'{lang} оглавление {it.get("id")}', lang, it.get('titleTr'))

    for it in items:
        did, lv = it['id'], it['level']
        d = load(f'data/dialogs/{did}.json')
        if not d:
            continue
        lines = d.get('lines', [])
        lo, hi = LINES[lv]
        if not lo <= len(lines) <= hi:
            err(f'{did}: реплик {len(lines)}, для {lv.upper()} нужно {lo}–{hi}')
        if it.get('lines') != len(lines):
            err(f'{did}: в оглавлении {it.get("lines")} реплик, в файле {len(lines)}')
        prev = None
        for i, ln in enumerate(lines, 1):
            if ln.get('s') not in ('A', 'B') or ln.get('s') == prev:
                err(f'{did} реплика {i}: персонажи должны чередоваться (A/B)')
            prev = ln.get('s')
            if not ln.get('de') or CYR.search(ln['de']):
                err(f'{did} реплика {i}: немецкий текст')
            check_tr_lang(f'{did} реплика {i}', 'ru', ln.get('tr'))
        sp = d.get('speakers', {})
        if set(sp) != {'A', 'B'} or any(s.get('g') not in ('f', 'm') for s in sp.values()):
            err(f'{did}: персонажи A и B с полом f/m')

        for lang in ('uk', 'ar'):
            t = load(f'i18n/{lang}/dialogs/{did}.json')
            if not t:
                continue
            tl = t.get('lines', [])
            if [x.get('de') for x in tl] != [x.get('de') for x in lines]:
                err(f'i18n/{lang}/dialogs/{did}.json: немецкие реплики отличаются от data/ (пересоберите)')
            for i, ln in enumerate(tl, 1):
                check_tr_lang(f'{lang} {did} реплика {i}', lang, ln.get('tr'))
            check_tr_lang(f'{lang} {did} название', lang, t.get('titleTr'))
            check_tr_lang(f'{lang} {did} ситуация', lang, t.get('situation'))

        img = d.get('img')
        if not img:
            err(f'{did}: нет картинки')
            continue
        for key in ('author', 'license', 'source'):
            if not img.get(key):
                err(f'{did}: у картинки нет {key}')
        if not FREE.match(img.get('license', '')):
            err(f'{did}: лицензия картинки {img.get("license")!r} — не из списка свободных')
        for rel, size in ((img.get('src', ''), (800, 450)), ((it.get('img') or {}).get('thumb', ''), (320, 180))):
            path = os.path.join(BASE, rel)
            if not rel or not os.path.isfile(path):
                err(f'{did}: нет файла картинки {rel!r}')
                continue
            if jpeg_size(path) != size:
                err(f'{rel}: размер {jpeg_size(path)}, нужно {size}')
            if os.path.getsize(path) > 160_000:
                err(f'{rel}: {os.path.getsize(path)} байт — пережать (≤160 КБ)')

    with open(os.path.join(BASE, 'dialogs.html'), encoding='utf-8') as f:
        page = f.read()
    for js in ('js/i18n.js', 'js/tts.js', 'js/reader-speak.js', 'js/dialogs.js', 'js/telegram.js'):
        if js not in page:
            err(f'dialogs.html: не подключён {js}')
    return report(len(items))


def report(n=0):
    for e in errors:
        print('ERROR:', e)
    print(f'\nДиалогов: {n}. Ошибок: {len(errors)}.')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
