#!/usr/bin/env python3
"""
tools/laender/fetch_flags.py — флаги 16 земель для раздела «Земли Германии».

Флаги земель — официальные символы (§ 5 UrhG), на Wikimedia Commons лежат
в общественном достоянии. Скрипт качает SVG по имени файла, проверяет,
что внутри нет скриптов и внешних ссылок, и пишет лицензию/источник в
tools/laender/flags.json (их показывает страница и проверяет валидатор).

Запуск:
  python tools/laender/fetch_flags.py            — скачать недостающие
  python tools/laender/fetch_flags.py --force    — перекачать все
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(BASE, 'tools', 'fahrschule'))

from fetch_signs import UNSAFE, EXTERNAL, get, info   # noqa: E402  (тот же Commons API)

OUT_DIR = os.path.join(BASE, 'data', 'laender', 'flags')
META = os.path.join(HERE, 'flags.json')

FLAGS = {
    'baden-wuerttemberg': 'File:Flag of Baden-Württemberg.svg',
    'bayern': 'File:Flag of Bavaria (lozengy).svg',
    'berlin': 'File:Flag of Berlin.svg',
    'brandenburg': 'File:Flag of Brandenburg.svg',
    'bremen': 'File:Flag of Bremen.svg',
    'hamburg': 'File:Flag of Hamburg.svg',
    'hessen': 'File:Flag of Hesse.svg',
    'mecklenburg-vorpommern': 'File:Flag of Mecklenburg-Western Pomerania.svg',
    'niedersachsen': 'File:Flag of Lower Saxony.svg',
    'nordrhein-westfalen': 'File:Flag of North Rhine-Westphalia.svg',
    'rheinland-pfalz': 'File:Flag of Rhineland-Palatinate.svg',
    'saarland': 'File:Flag of Saarland.svg',
    'sachsen': 'File:Flag of Saxony.svg',
    'sachsen-anhalt': 'File:Flag of Saxony-Anhalt (state).svg',
    'schleswig-holstein': 'File:Flag of Schleswig-Holstein.svg',
    'thueringen': 'File:Flag of Thuringia.svg',
}


def main(argv):
    force = '--force' in argv
    os.makedirs(OUT_DIR, exist_ok=True)
    meta = {}
    if os.path.isfile(META):
        with open(META, encoding='utf-8') as f:
            meta = json.load(f)
    for lid, title in FLAGS.items():
        path = os.path.join(OUT_DIR, lid + '.svg')
        if os.path.isfile(path) and lid in meta and not force:
            continue
        i = info(title)
        if i['mime'] != 'image/svg+xml':
            raise RuntimeError(f'{lid}: не SVG ({i["mime"]})')
        if not re.search(r'public domain|^pd|cc0', i['license'], re.I):
            raise RuntimeError(f'{lid}: лицензия не свободная: {i["license"]!r}')
        svg = get(i['url']).decode('utf-8')
        if UNSAFE.search(svg) or EXTERNAL.search(svg):
            raise RuntimeError(f'{lid}: в SVG скрипт или внешняя ссылка — не берём')
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(svg)
        meta[lid] = {'title': title[5:], 'license': i['license'], 'author': i['author'], 'source': i['source']}
        print(f'{lid}: {len(svg) // 1024} КБ · {i["license"]}')
        with open(META, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(meta, f, ensure_ascii=False, indent=1)
            f.write('\n')
    print(f'флагов: {len(meta)}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
