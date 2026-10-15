#!/usr/bin/env python3
"""
tools/dialogs/build.py — сборка раздела «Диалоги» (dialogs.html).

Исходники (правятся руками):
  tools/dialogs/src/<a1|a2|b1|b2>.json — 10 диалогов уровня. У каждой
      реплики сразу четыре языка: ["A"|"B", de, ru, uk, ar]; у названия и
      описания ситуации — [ru, uk, ar]. Так перевод не «съезжает» с реплики.
  tools/dialogs/images.json — картинка сцены: файл, автор, лицензия, источник.
  data/dialogs/img/<id>.jpg (800×450) и <id>-t.jpg (320×180) — сами снимки
      (кладёт tools/dialogs/fetch_image.py).

Выход:
  data/dialogs/index.json, data/dialogs/<id>.json — немецкий + русский;
  i18n/uk/src/dialogs/<id>.json, i18n/ar/src/dialogs/<id>.json — память
      переводов {русская строка: перевод}, дальше их подхватывает
      `node tools/i18n.js build` и кладёт копии в i18n/<lang>/dialogs/.

Проверки (ошибка = выход 1): число реплик по уровню, чередование
персонажей, алфавиты языков (нет кириллицы в немецком, нет русских букв
в украинском, арабский — арабицей), полнота переводов, совпадение
переводов с общей памятью (одна русская строка — один перевод везде).

Запуск: python tools/dialogs/build.py
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(BASE, 'tools', 'dialogs', 'src')
IMAGES = os.path.join(BASE, 'tools', 'dialogs', 'images.json')
OUT = os.path.join(BASE, 'data', 'dialogs')
LEVELS = ['a1', 'a2', 'b1', 'b2']
LANGS = ['uk', 'ar']
# Реплик в диалоге по уровню (CEFR): от коротких бытовых до переговоров
LINES = {'a1': (8, 12), 'a2': (12, 16), 'b1': (16, 20), 'b2': (20, 25)}
PER_LEVEL = 10

CYR = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')
ARABIC = re.compile(r'[؀-ۿ]')
RU_ONLY = re.compile(r'[ЫыЭэЪъЁё]')
UK_ONLY = re.compile(r'[ІіЇїЄєҐґ]')
LATIN_DE = re.compile(r'[A-Za-zÄäÖöÜüß]')

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def read_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def write_json(path, obj, compact=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        if compact:
            json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
        else:
            json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write('\n')


def check_tr(where, ru, uk, ar):
    if not ru or not CYR.search(ru):
        err(f'{where}: нет русского текста: {ru!r}')
    if not uk or not CYR.search(uk):
        err(f'{where}: нет украинского перевода')
    elif RU_ONLY.search(uk):
        err(f'{where}: в украинском русские буквы (ы/э/ъ/ё): {uk}')
    if ru and RU_ONLY.search(ru) is None and UK_ONLY.search(ru):
        err(f'{where}: в русском украинские буквы: {ru}')
    if not ar or not ARABIC.search(ar):
        err(f'{where}: нет арабского перевода')
    elif CYR.search(ar):
        err(f'{where}: кириллица в арабском: {ar}')


def other_memory(lang):
    """Память переводов языка БЕЗ диалогов: {ru: (перевод, файл)}."""
    root = os.path.join(BASE, 'i18n', lang, 'src')
    mem = {}
    for dirpath, _, files in os.walk(root):
        rel_dir = os.path.relpath(dirpath, root).replace(os.sep, '/')
        if rel_dir == 'dialogs' or rel_dir.startswith('dialogs/'):
            continue
        for f in files:
            if not f.endswith('.json'):
                continue
            path = os.path.join(dirpath, f)
            for k, v in read_json(path).items():
                mem.setdefault(k, (v, os.path.relpath(path, BASE).replace(os.sep, '/')))
    return mem


def main():
    images = read_json(IMAGES) if os.path.isfile(IMAGES) else {}
    index = []
    memory = {lang: {} for lang in LANGS}       # ru → (перевод, id диалога)
    per_dialog = {lang: {} for lang in LANGS}   # id → {ru: перевод}
    present = []

    for lv in LEVELS:
        path = os.path.join(SRC, lv + '.json')
        if not os.path.isfile(path):
            continue
        present.append(lv)
        dialogs = read_json(path)
        if len(dialogs) != PER_LEVEL:
            err(f'{lv}: ожидалось {PER_LEVEL} диалогов, найдено {len(dialogs)}')
        lo, hi = LINES[lv]
        for n, d in enumerate(dialogs, 1):
            did = d.get('id', '')
            where = did or f'{lv}#{n}'
            if did != f'{lv}-{n:02d}':
                err(f'{where}: id должен быть {lv}-{n:02d}')
            for key in ('emoji', 'title', 'titleTr', 'situation', 'speakers', 'lines'):
                if not d.get(key):
                    err(f'{where}: нет поля {key}')
            if errors and not d.get('lines'):
                continue
            sp = d['speakers']
            if set(sp) != {'A', 'B'}:
                err(f'{where}: персонажи должны быть A и B')
            for k, s in sp.items():
                if not s.get('name') or s.get('g') not in ('f', 'm'):
                    err(f'{where}: у персонажа {k} нужны name и g (f/m)')
                if CYR.search(s.get('name', '')):
                    err(f'{where}: имя персонажа {k} — по-немецки')
            if CYR.search(d['title']) or not LATIN_DE.search(d['title']):
                err(f'{where}: название — по-немецки: {d["title"]}')

            pairs = []   # (ru, uk, ar)
            tt, st = d['titleTr'], d['situation']
            if len(tt) != 3 or len(st) != 3:
                err(f'{where}: titleTr и situation — [ru, uk, ar]')
                continue
            check_tr(f'{where} название', *tt)
            check_tr(f'{where} ситуация', *st)
            pairs += [tuple(tt), tuple(st)]

            lines = d['lines']
            if not lo <= len(lines) <= hi:
                err(f'{where}: реплик {len(lines)}, для {lv.upper()} нужно {lo}–{hi}')
            prev = None
            out_lines = []
            for i, ln in enumerate(lines, 1):
                lw = f'{where} реплика {i}'
                if len(ln) != 5:
                    err(f'{lw}: нужно [персонаж, de, ru, uk, ar], а не {len(ln)} полей')
                    continue
                s, de, ru, uk, ar = ln
                if s not in ('A', 'B'):
                    err(f'{lw}: персонаж {s!r}')
                if s == prev:
                    err(f'{lw}: персонаж {s} говорит дважды подряд')
                prev = s
                if not de.strip() or CYR.search(de) or ARABIC.search(de) or not LATIN_DE.search(de):
                    err(f'{lw}: немецкий текст: {de!r}')
                if de != de.strip() or '  ' in de:
                    err(f'{lw}: лишние пробелы в немецком')
                if len(de) > 200:
                    warn(f'{lw}: длиннее 200 символов — озвучка разрежет на части')
                check_tr(lw, ru, uk, ar)
                pairs.append((ru, uk, ar))
                out_lines.append({'s': s, 'de': de, 'tr': ru})
            if {x['s'] for x in out_lines} != {'A', 'B'}:
                err(f'{where}: говорят не оба персонажа')

            # память переводов: одна русская строка — один перевод
            for lang_i, lang in enumerate(LANGS):
                mine = per_dialog[lang].setdefault(did, {})
                for p in pairs:
                    ru, tr = p[0], p[1 + lang_i]
                    seen = memory[lang].get(ru)
                    if seen and seen[0] != tr:
                        err(f'{lang}: «{ru}» переведено по-разному в {seen[1]} и {did}: «{seen[0]}» / «{tr}»')
                    memory[lang].setdefault(ru, (tr, did))
                    mine[ru] = tr

            img = images.get(did)
            img_out = None
            thumb = None
            if img:
                src = f'data/dialogs/img/{did}.jpg'
                tsrc = f'data/dialogs/img/{did}-t.jpg'
                if not os.path.isfile(os.path.join(BASE, src)):
                    err(f'{where}: нет файла {src}')
                if not os.path.isfile(os.path.join(BASE, tsrc)):
                    err(f'{where}: нет файла {tsrc}')
                for key in ('author', 'license', 'source'):
                    if not img.get(key):
                        err(f'{where}: у картинки нет {key}')
                img_out = {'src': src, 'w': img.get('w', 800), 'h': img.get('h', 450),
                           'author': img.get('author'), 'license': img.get('license'),
                           'licenseUrl': img.get('licenseUrl', ''), 'source': img.get('source'),
                           'site': img.get('site', '')}
                thumb = {'thumb': tsrc, 'tw': 320, 'th': 180}
            else:
                warn(f'{where}: нет картинки — будет заглушка с эмодзи')

            full = {
                'id': did, 'level': lv, 'n': n, 'emoji': d['emoji'],
                'title': d['title'], 'titleTr': tt[0], 'situation': st[0],
                'speakers': sp, 'lines': out_lines,
            }
            if img_out:
                full['img'] = img_out
            write_json(os.path.join(OUT, did + '.json'), full)
            item = {
                'id': did, 'level': lv, 'n': n, 'emoji': d['emoji'],
                'title': d['title'], 'titleTr': tt[0], 'lines': len(out_lines),
                'speakers': sp['A']['name'] + ' · ' + sp['B']['name'],
            }
            if thumb:
                item['img'] = thumb
            index.append(item)

    # совпадение с остальной памятью переводов (уроки, книги, новости)
    for lang in LANGS:
        others = other_memory(lang)
        for ru, (tr, did) in memory[lang].items():
            if ru in others and others[ru][0] != tr:
                err(f'{lang}: «{ru}» в {did} → «{tr}», а в {others[ru][1]} уже «{others[ru][0]}» '
                    f'(память общая: переформулируйте или возьмите тот же перевод)')

    if errors:
        for w in warnings:
            print('WARNING:', w)
        for e in errors:
            print('ERROR:', e)
        print(f'\nОшибок: {len(errors)} — ничего не записано в i18n/*/src/dialogs и index.json')
        return 1

    write_json(os.path.join(OUT, 'index.json'), {'levels': present, 'items': index})
    for lang in LANGS:
        for did, mapping in per_dialog[lang].items():
            write_json(os.path.join(BASE, 'i18n', lang, 'src', 'dialogs', did + '.json'), mapping)

    for w in warnings:
        print('WARNING:', w)
    counts = {lv: sum(1 for it in index if it['level'] == lv) for lv in present}
    total_lines = sum(it['lines'] for it in index)
    print(f'dialogs: ok — {len(index)} диалогов {counts}, реплик {total_lines}, '
          f'картинок {sum(1 for it in index if "img" in it)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
