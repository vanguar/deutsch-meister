#!/usr/bin/env python3
"""
tools/fahrschule/fetch_signs.py — дорожные знаки для раздела «Автошкола».

Знаки StVO — официальные произведения (§ 5 UrhG), на Wikimedia Commons
лежат в общественном достоянии (векторные SVG по Bundesgesetzblatt).
Скрипт качает SVG по названию файла на Commons, проверяет, что внутри
нет скриптов и внешних ссылок, и записывает автора/лицензию/источник
в tools/fahrschule/signs.json (их показывает страница и проверяет
build.py).

Запуск:
  python tools/fahrschule/fetch_signs.py            — скачать недостающие
  python tools/fahrschule/fetch_signs.py --force    — перекачать все

Новый знак: добавить строку в SIGNS (id → точное имя файла на Commons).
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(BASE, 'data', 'fahrschule', 'signs')
META = os.path.join(BASE, 'tools', 'fahrschule', 'signs.json')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'DeutschMeister/1.0 (https://vanguar.github.io/deutsch-meister/)'

SIGNS = {
    'z102': 'File:Zeichen 102 - Kreuzung oder Einmündung mit Vorfahrt von rechts, StVO 1970.svg',
    'z205': 'File:Zeichen 205 - Vorfahrt gewähren! StVO 1970.svg',
    'z206': 'File:Zeichen 206 - Halt! Vorfahrt gewähren! StVO 1970.svg',
    'z301': 'File:Zeichen 301 - Vorfahrt, StVO 1970.svg',
    'z306': 'File:Zeichen 306 - Vorfahrtstraße, StVO 1970.svg',
    'z307': 'File:Zeichen 307 - Ende der Vorfahrtstraße, StVO 1970.svg',
    'z720': 'File:Zeichen 720 - Grünpfeil, StVO 1994.svg',
    'z101': 'File:Zeichen 101 - Gefahrstelle, StVO 1970.svg',
    'z136': 'File:Zeichen 136 - Kinder, StVO 1970.svg',
    'z267': 'File:Zeichen 267 - Verbot der Einfahrt, StVO 1970.svg',
    'z274': 'File:Zeichen 274-30 - Zulässige Höchstgeschwindigkeit, StVO 2017.svg',
    'z2741': 'File:Zeichen 274.1 - Beginn einer Tempo 30-Zone, StVO 2013.svg',
    'z276': 'File:Zeichen 276 - Überholverbot für Kraftfahrzeuge aller Art, StVO 1992.svg',
    'z283': 'File:Zeichen 283 - Absolutes Haltverbot, StVO 2017.svg',
    'z286': 'File:Zeichen 286 - Eingeschränktes Halteverbot, StVO 1970.svg',
    'z310': 'File:Zeichen 310 - Ortstafel Vorderseite, StVO 2017.svg',
    'z311': 'File:Zeichen 311 - Ortstafel (Rückseite), StVO 1970.svg',
    'z3251': 'File:Zeichen 325.1 - Beginn eines verkehrsberuhigten Bereichs, StVO 2009.svg',
    'z350': 'File:Zeichen 350-10 - Fußgängerüberweg (rechts), StVO 1992.svg',
    'z380': 'File:Zeichen 380 - Richtgeschwindigkeit, StVO 1988.svg',
    'z3301': 'File:Zeichen 330.1 - Autobahn, StVO 2013.svg',
    'z282': 'File:Zeichen 282 - Ende sämtlicher Streckenverbote, StVO 1970.svg',
    'z280': 'File:Zeichen 280 - Ende des Überholverbotes für Kraftfahrzeuge aller Art, StVO 1992.svg',
    'z295': 'File:Zeichen 295 - Fahrstreifenbegrenzung und Fahrbahnbegrenzung, StVO 1970.svg',
    'z2771': 'File:Zeichen 277.1 - Verbot des Überholens von einspurigen Fahrzeugen für mehrspurige Kraftfahrzeuge und Krafträdern mit Beiwagen; StVO 2020.svg',
    'z224': 'File:Zeichen 224 - Haltestelle, StVO 2017.svg',
    'z314': 'File:Zeichen 314 - Parken, StVO 2017.svg',
    'z315': 'File:Zeichen 315 - Parken auf Gehwegen, StVO 1970.svg',
    'z318': 'File:Zeichen 318 - Parkscheibe, StVO 2013.svg',
}

# SVG с Commons встраивается как <img>: скрипты там и так не исполняются,
# но в репозиторий кладём только «чистую» графику
UNSAFE = re.compile(r'<script|\son[a-z]+\s*=|javascript:|<foreignObject', re.I)
EXTERNAL = re.compile(r'(?:href|src)\s*=\s*["\']https?:', re.I)


PAUSE = 1.5      # между запросами: Commons режет частые запросы (HTTP 429)
TRIES = 6


def get(url):
    """GET с паузой и повторами: на 429/503 ждём Retry-After (или 5, 10, 20… с)."""
    for k in range(TRIES):
        time.sleep(PAUSE)
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503) or k == TRIES - 1:
                raise
            wait = int(e.headers.get('Retry-After') or 0) or 5 * 2 ** k
            print(f'  Commons просит подождать ({e.code}), пауза {wait} с')
            time.sleep(wait)
    raise RuntimeError('недоступно: ' + url)


def strip_html(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()


def info(title):
    q = urllib.parse.urlencode({
        'action': 'query', 'titles': title, 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata|mime', 'format': 'json',
    })
    data = json.loads(get(API + '?' + q))
    page = next(iter(data['query']['pages'].values()))
    if 'imageinfo' not in page:
        raise RuntimeError(f'нет файла на Commons: {title}')
    ii = page['imageinfo'][0]
    meta = ii.get('extmetadata', {})
    return {
        'url': ii['url'],
        'mime': ii.get('mime'),
        'license': strip_html(meta.get('LicenseShortName', {}).get('value')),
        'author': strip_html(meta.get('Artist', {}).get('value')) or 'Wikimedia Commons',
        'source': ii.get('descriptionurl') or ('https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title)),
    }


def main(argv):
    force = '--force' in argv
    os.makedirs(OUT_DIR, exist_ok=True)
    meta = {}
    if os.path.isfile(META):
        with open(META, encoding='utf-8') as f:
            meta = json.load(f)
    for sid, title in SIGNS.items():
        path = os.path.join(OUT_DIR, sid + '.svg')
        if os.path.isfile(path) and sid in meta and not force:
            continue
        i = info(title)
        if i['mime'] != 'image/svg+xml':
            raise RuntimeError(f'{sid}: не SVG ({i["mime"]})')
        if not re.search(r'public domain|^pd|cc0', i['license'], re.I):
            raise RuntimeError(f'{sid}: лицензия не свободная: {i["license"]!r}')
        svg = get(i['url']).decode('utf-8')
        if UNSAFE.search(svg) or EXTERNAL.search(svg):
            raise RuntimeError(f'{sid}: в SVG скрипт или внешняя ссылка — не берём')
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(svg)
        meta[sid] = {'title': title[5:], 'license': i['license'], 'author': i['author'], 'source': i['source']}
        print(f'{sid}: {len(svg)} байт · {i["license"]}')
    with open(META, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(f'знаков: {len(meta)}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
