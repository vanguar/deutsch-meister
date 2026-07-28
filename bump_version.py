#!/usr/bin/env python3
"""
bump_version.py — единая накрутка версий кэша (?v=N) для Deutsch Meister.

Зачем: у сайта Service Worker с cache-first для ассетов. Чтобы правки
JS/CSS доехали до пользователей, нужно поднять ?v=N во ссылках всех
HTML-файлов (index.html, 404.html, lessons/**/index.html), в списке STATIC
внутри service-worker.js, и увеличить номер CACHE там же.
Раньше это делалось руками по ~69 файлам — теперь одной командой.

Что делает:
  * приводит ВСЕ локальные ссылки на .js/.css к единой версии ?v=N
    (добавляет ?v=N, если его не было);
  * обновляет существующие ?v=N у локальных ссылок на .html (не добавляет);
  * синхронизирует ?v=N в списке STATIC service-worker.js;
  * поднимает const CACHE = 'deutsch-meister-vNN' на +1, если что-то менялось;
  * внешние URL (http/https) не трогает.

Использование:
  python bump_version.py            # цель = max(найденных версий) + 1
  python bump_version.py --set 50   # выставить конкретный номер
  python bump_version.py --dry-run  # показать, что изменится, ничего не писать
"""

import argparse
import glob
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

SW_FILE = os.path.join(BASE, 'service-worker.js')

# src="..." / href="..." на локальный файл; версия опциональна
LINK_RE = re.compile(
    r'(?P<attr>(?:src|href))="(?P<url>[^"]*?\.(?:js|css|html))(?:\?v=(?P<ver>\d+))?"'
)
# записи вида BASE + '/css/base.css?v=35' в STATIC service-worker.js
SW_STATIC_RE = re.compile(
    r"(?P<q>')(?P<url>/[^']*?\.(?:js|css))(?:\?v=(?P<ver>\d+))?'"
)
SW_CACHE_RE = re.compile(r"const CACHE = 'deutsch-meister-v(\d+)'")


def is_external(url):
    return url.startswith(('http://', 'https://', '//', 'data:'))


def html_files():
    files = [os.path.join(BASE, 'index.html'), os.path.join(BASE, '404.html')]
    files += glob.glob(os.path.join(BASE, 'lessons', '*', '*', 'index.html'))
    return [f for f in files if os.path.isfile(f)]


def collect_versions(files):
    """Все встречающиеся номера ?v=N (в HTML и в STATIC service-worker)."""
    versions = set()
    for path in files:
        with open(path, encoding='utf-8') as f:
            text = f.read()
        for m in LINK_RE.finditer(text):
            if m.group('ver') and not is_external(m.group('url')):
                versions.add(int(m.group('ver')))
    with open(SW_FILE, encoding='utf-8') as f:
        sw = f.read()
    for m in SW_STATIC_RE.finditer(sw):
        if m.group('ver'):
            versions.add(int(m.group('ver')))
    return versions


def patch_html(text, target):
    def repl(m):
        url, ver = m.group('url'), m.group('ver')
        if is_external(url):
            return m.group(0)
        if url.endswith('.html'):
            if ver is None:          # html без версии не трогаем
                return m.group(0)
            return f'{m.group("attr")}="{url}?v={target}"'
        # .js / .css: всегда единая версия (добавляем, если не было)
        return f'{m.group("attr")}="{url}?v={target}"'
    return LINK_RE.sub(repl, text)


def patch_sw(text, target):
    def repl(m):
        return f"'{m.group('url')}?v={target}'"
    return SW_STATIC_RE.sub(repl, text)


def main():
    ap = argparse.ArgumentParser(description='Bump ?v=N and SW CACHE version')
    ap.add_argument('--set', type=int, dest='set_ver', metavar='N',
                    help='выставить конкретный номер версии')
    ap.add_argument('--dry-run', action='store_true',
                    help='показать изменения, ничего не записывать')
    args = ap.parse_args()

    files = html_files()
    if not files or not os.path.isfile(SW_FILE):
        print('ОШИБКА: не найдены HTML-файлы или service-worker.js', file=sys.stderr)
        return 2

    versions = collect_versions(files)
    if len(versions) > 1:
        print(f'⚠️  ВНИМАНИЕ: версии были рассинхронизированы: '
              f'{", ".join(str(v) for v in sorted(versions))}')

    target = args.set_ver if args.set_ver is not None else (max(versions or {0}) + 1)

    changed = 0
    for path in files:
        with open(path, encoding='utf-8') as f:
            old = f.read()
        new = patch_html(old, target)
        if new != old:
            changed += 1
            if not args.dry_run:
                with open(path, 'w', encoding='utf-8', newline='') as f:
                    f.write(new)

    with open(SW_FILE, encoding='utf-8') as f:
        sw_old = f.read()
    sw_new = patch_sw(sw_old, target)

    cache_m = SW_CACHE_RE.search(sw_old)
    if not cache_m:
        print('ОШИБКА: не нашёл const CACHE в service-worker.js', file=sys.stderr)
        return 2
    cache_old = int(cache_m.group(1))
    anything_changed = changed > 0 or sw_new != sw_old
    cache_new = cache_old + 1 if anything_changed else cache_old
    sw_new = SW_CACHE_RE.sub(f"const CACHE = 'deutsch-meister-v{cache_new}'", sw_new)

    if sw_new != sw_old:
        changed += 1
        if not args.dry_run:
            with open(SW_FILE, 'w', encoding='utf-8', newline='') as f:
                f.write(sw_new)

    mode = '[dry-run] ' if args.dry_run else ''
    print(f'{mode}Версии ассетов: {sorted(versions) or "—"} → {target}')
    print(f'{mode}SW CACHE: v{cache_old} → v{cache_new}')
    print(f'{mode}Изменено файлов: {changed} из {len(files) + 1}')
    if not anything_changed:
        print('Всё уже актуально — ничего не изменено.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
