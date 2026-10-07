#!/usr/bin/env python3
"""
test_audience_wording.py — регресс: пользовательский контент не должен
привязывать аудиторию к России/РФ.

Русский язык интерфейса ≠ Россия. Целевой пользователь — из Украины.
Если для объяснения немецкой реалии нужно сравнение со страной пользователя,
сравниваем с Украиной; если национальная привязка не нужна — нейтрально.

Запуск:  python scripts/test_audience_wording.py
Код возврата: 0 — ок, 1 — найдены запрещённые конструкции.

Ловит (ru и uk): «РФ», «у нас в России/РФ», «в нашей стране» (ru),
«для россиян», «по российским меркам», «как принято в России»,
«российская/русская нумерация/этажи/школы/адреса/система/валюта/почта»,
рубли и ₽ в примерах, российские телефоны +7, флаг 🇷🇺.
Упоминание России как ПРЕДМЕТА материала (например, «российский космонавт»
в новости) не запрещено. Осознанное исключение — в ALLOW.
"""

import os
import re
import subprocess
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Что попадает пользователю: данные уроков/книг/новостей, переводы,
# страницы, рантайм-JS, бот и генераторы контента.
SCAN_PREFIXES = ('data/', 'lessons/', 'i18n/', 'js/', 'api/', 'bot/',
                 'tools/news/', 'gen_lessons.py', 'gen_template.html',
                 'index.html', 'books.html', 'news.html', '404.html')
SCAN_EXT = ('.js', '.json', '.html', '.py')

L = r'А-Яа-яЁёІіЇїЄєҐґ'  # «буква» для границ слова в кириллице

FORBIDDEN = [
    (r'(?<![%s])РФ(?![%s])' % (L, L), 'РФ'),
    (r'у\s+нас\s+(в|во|у)\s+(РФ|Росси|Росії)', 'у нас в России/РФ'),
    (r'(в|по)\s+нашей\s+стране', 'в нашей стране (ru)'),
    (r'для\s+россиян', 'для россиян'),
    (r'по\s+(российским|російськими)\s+(меркам|мірками)', 'по российским меркам'),
    (r'(как|як)\s+(принято\s+|прийнято\s+|обычно\s+|зазвичай\s+)?(в|у)\s+(России|Росії)',
     'как принято в России'),
    (r'(российск|русск|російськ)[%s]*\s+(нумерац|этаж|поверх|школ|адрес|систем|валют|почт|пошт)' % L,
     'российская нумерация/этажи/школы/…'),
    (r'(?<![%s])рубл(ь|я|ей|ям|ях|ями|и|ів)(?![%s])|₽' % (L, L), 'рубли в примерах'),
    (r'\+7[\s(-]*\d{3}', 'российский телефон +7'),
    (r'🇷🇺', 'флаг РФ'),
]
FORBIDDEN = [(re.compile(p, re.IGNORECASE), why) for p, why in FORBIDDEN]

# (путь, подстрока) — осознанные исключения, если Россия — предмет материала
ALLOW = set()

# Самопроверка: правило обязано ловить исходный найденный случай
# и не трогать описание языка / Россию как предмет материала.
MUST_FAIL = ['⚠️ ersten Stock у нас = 2-й этаж РФ!',
             'В Германии первый этаж — это второй этаж у нас в РФ.',
             'Как принято в России, адрес пишут наоборот.',
             'Стоит 500 рублей.', '🇷🇺 перевод']
MUST_PASS = ['⚠️ der erste Stock в Германии = 2-й этаж по украинской нумерации!',
             'в русском языке', 'русский перевод', 'русскоязычный пользователь',
             'Для пилота — российского космонавта Сергея', 'вырубленный лес',
             'Почему вы хотите работать у нас?', 'у нас есть']


def hits(text):
    return [(m, why) for rx, why in FORBIDDEN for m in rx.finditer(text)]


def main():
    bad = [s for s in MUST_FAIL if not hits(s)] + [s for s in MUST_PASS if hits(s)]
    if bad:
        for s in bad:
            print(f'САМОПРОВЕРКА: правило ошибается на строке: {s!r}')
        return 1

    files = subprocess.run(['git', 'ls-files'], cwd=BASE, capture_output=True,
                           text=True, check=True).stdout.splitlines()
    files = [f for f in files if f.startswith(SCAN_PREFIXES) and f.endswith(SCAN_EXT)]

    problems = []
    for f in files:
        with open(os.path.join(BASE, f), encoding='utf-8', errors='replace') as fh:
            for no, line in enumerate(fh, 1):
                for m, why in hits(line):
                    ctx = line[max(0, m.start() - 50):m.end() + 50].strip()
                    if any(f == p and sub in line for p, sub in ALLOW):
                        continue
                    problems.append(f'{f}:{no}: [{why}] …{ctx}…')

    for p in problems:
        print(p)
    print(f'Проверено файлов: {len(files)}. Нарушений: {len(problems)}.')
    if problems:
        print('Русский язык интерфейса ≠ Россия: сравнивайте с Украиной '
              'или пишите нейтрально.')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
