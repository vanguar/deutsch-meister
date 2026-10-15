#!/usr/bin/env python3
"""
tools/dialogs/fetch_image.py — фото сцен для «Диалогов»: Wikimedia Commons
и Openverse (каталог свободных фото, в основном Flickr).

Берём только свободные лицензии (CC0, Public domain, CC BY, CC BY-SA),
автора и лицензию сохраняем в tools/dialogs/images.json — они показываются
под снимком. Файлы храним у себя (data/dialogs/img/), без hotlink.

  python tools/dialogs/fetch_image.py search "<запрос>" [--out DIR] [-n 12] [--ov]
      (--ov — искать в Openverse вместо Commons)
      кандидаты: список (номер, файл, лицензия, автор, размер) и
      контакт-лист DIR/sheet.jpg с номерами — чтобы глазами выбрать сцену
  python tools/dialogs/fetch_image.py get <id> "File:<имя>" | ov:<uuid>
      скачать, обрезать до 16:9 → data/dialogs/img/<id>.jpg (800×450)
      и <id>-t.jpg (320×180), записать автора и лицензию в images.json

Нужен ImageMagick (magick) в PATH.
"""

import html
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API = 'https://commons.wikimedia.org/w/api.php'
IMG_DIR = os.path.join(BASE, 'data', 'dialogs', 'img')
IMAGES = os.path.join(BASE, 'tools', 'dialogs', 'images.json')
UA = 'GermanMorningDialogs/1.0 (https://vanguar.github.io/deutsch-meister/; educational)'
FREE = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? \d(\.\d)?( [a-z]{2,})?)$', re.I)


def api(params):
    params = dict(params, format='json', formatversion='2')
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def fetch(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
        f.write(r.read())


def clean(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


def info(titles, width):
    data = api({'action': 'query', 'prop': 'imageinfo', 'titles': '|'.join(titles),
                'iiprop': 'url|size|extmetadata|mime', 'iiurlwidth': str(width)})
    out = []
    for p in data['query']['pages']:
        if 'imageinfo' not in p:
            continue
        ii = p['imageinfo'][0]
        md = ii.get('extmetadata', {})
        lic = clean(md.get('LicenseShortName', {}).get('value', ''))
        out.append({
            'title': p['title'], 'mime': ii.get('mime'), 'w': ii['width'], 'h': ii['height'],
            'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl'),
            'license': lic, 'licenseUrl': clean(md.get('LicenseUrl', {}).get('value', '')),
            'author': clean(md.get('Artist', {}).get('value', '')) or clean(md.get('Credit', {}).get('value', '')),
            'free': bool(FREE.match(lic)),
        })
    return out


OV = 'https://api.openverse.org/v1/images/'
OV_LIC = {'by': 'CC BY', 'by-sa': 'CC BY-SA', 'cc0': 'CC0', 'pdm': 'Public domain'}


def ov_item(r):
    lic = OV_LIC.get(r.get('license'), '')
    ver = r.get('license_version') or ''
    if lic.startswith('CC BY') and ver:
        lic += ' ' + ver
    site = {'flickr': 'Flickr', 'wikimedia': 'Wikimedia Commons'}.get(r.get('source'), r.get('source') or 'Openverse')
    return {
        'title': 'ov:' + r['id'], 'mime': 'image/jpeg', 'w': r.get('width') or 0, 'h': r.get('height') or 0,
        'thumb': r.get('url'), 'page': r.get('foreign_landing_url') or '', 'license': lic,
        'licenseUrl': r.get('license_url') or '', 'author': clean(r.get('creator') or ''),
        'free': bool(lic), 'site': site, 'name': clean(r.get('title') or ''),
    }


def ov_get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def ov_search(query, n):
    q = urllib.parse.urlencode({'q': query, 'license': 'by,by-sa,cc0,pdm', 'page_size': str(min(20, n * 2)),
                                'aspect_ratio': 'wide'})
    return [ov_item(r) for r in ov_get_json(OV + '?' + q).get('results', [])]


def search(query, out_dir, n=12, use_ov=False):
    if use_ov:
        found = ov_search(query, n)
    else:
        data = api({'action': 'query', 'list': 'search', 'srsearch': query,
                    'srnamespace': '6', 'srlimit': str(n * 2)})
        titles = [x['title'] for x in data['query']['search']]
        found = info(titles, 400) if titles else []
    if not found:
        print('ничего не найдено')
        return
    cands = [c for c in found
             if c['free'] and c['mime'] in ('image/jpeg', 'image/png') and c['w'] >= 800 and c['w'] > c['h'] * 1.05][:n]
    os.makedirs(out_dir, exist_ok=True)
    files = []
    for i, c in enumerate(cands, 1):
        p = os.path.join(out_dir, f'c{i:02d}.jpg')
        try:
            fetch(c['thumb'], p)
        except Exception as e:  # noqa: BLE001
            print(f'{i:2d}. не скачалось: {e}')
            continue
        files.append((i, p))
        print(f'{i:2d}. {c["title"]} | {c["license"]} | {c["author"][:40]} | {c["w"]}x{c["h"]} | {c.get("name", "")[:50]}')
    if files:
        args = ['magick', 'montage']
        for i, p in files:
            args += ['-label', str(i), p]
        args += ['-tile', '4x', '-geometry', '300x200+4+4', '-pointsize', '22', os.path.join(out_dir, 'sheet.jpg')]
        subprocess.run(args, check=True)
        print('sheet:', os.path.join(out_dir, 'sheet.jpg'))


def get(did, title):
    if title.startswith('ov:'):
        c = [ov_item(ov_get_json(OV + title[3:] + '/'))]
    else:
        c = info([title], 1600)
    if not c:
        sys.exit('файл не найден: ' + title)
    c = c[0]
    if not c['free']:
        sys.exit(f'лицензия не подходит: {c["license"]}')
    os.makedirs(IMG_DIR, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, 'src.jpg')
        fetch(c['thumb'], src)
        big = os.path.join(IMG_DIR, did + '.jpg')
        small = os.path.join(IMG_DIR, did + '-t.jpg')
        for path, w, h, q in ((big, 800, 450, 78), (small, 320, 180, 72)):
            subprocess.run(['magick', src, '-auto-orient', '-resize', f'{w}x{h}^', '-gravity', 'center',
                            '-extent', f'{w}x{h}', '-strip', '-interlace', 'Plane', '-sampling-factor', '4:2:0',
                            '-quality', str(q), path], check=True)
    images = {}
    if os.path.isfile(IMAGES):
        with open(IMAGES, encoding='utf-8') as f:
            images = json.load(f)
    author = c['author'] or 'unknown'
    if len(author) > 80:
        author = author[:77] + '…'
    images[did] = {'file': title, 'author': author, 'license': c['license'], 'licenseUrl': c['licenseUrl'],
                   'source': c['page'], 'site': c.get('site', 'Wikimedia Commons'), 'w': 800, 'h': 450}
    with open(IMAGES, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(dict(sorted(images.items())), f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(f'{did}: {title} | {c["license"]} | {author} → {os.path.relpath(big, BASE)}')


def main():
    a = sys.argv[1:]
    if len(a) >= 2 and a[0] == 'search':
        out = tempfile.gettempdir()
        n = 12
        if '--out' in a:
            out = a[a.index('--out') + 1]
        if '-n' in a:
            n = int(a[a.index('-n') + 1])
        search(a[1], out, n, '--ov' in a)
    elif len(a) == 3 and a[0] == 'get':
        get(a[1], a[2])
    else:
        print(__doc__)


if __name__ == '__main__':
    main()
