#!/usr/bin/env python3
"""
build_book.py — сборка заготовок глав книги из исходного текста.

Запуск:  python scripts/build_book.py bremer
         python scripts/build_book.py bremer --dry-run

Вход:    tools/sources/<id>.txt   (НЕ уезжает на прод — лежит вне data/)
Выход:   data/books/<id>/ch-NN.json        — абзацы + разбитые предложения
         tools/sources/<id>.tokens.txt     — все уникальные токены книги
                                             с частотой и примером употребления

Формат исходника:

    # ch-01 | Der Esel | Осёл
    Первый абзац главы одной строкой или несколькими.

    Второй абзац — отделён пустой строкой.

    # ch-02 | Die Gefährten | Спутники
    ...

Зачем отдельный шаг сборки: разбивка на предложения делается ОДИН РАЗ здесь,
а не в рантайме читалки. В рантайме «z. B.», «Hr.», «usw.» и прямая речь
вида „…?" ломают любой наивный сплит, а тут результат можно вычитать глазами
и поправить руками прямо в JSON.

Переводы (поле "ru") скрипт НЕ трогает: при повторном запуске уже
заполненные переводы переносятся в новый файл по совпадению немецкого
текста предложения. Так пересборку можно гонять сколько угодно, не теряя
проделанную работу.
"""

import argparse
import json
import os
import re
import sys
from collections import Counter, OrderedDict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ВАЖНО: регулярка токена ОБЯЗАНА совпадать с TOKEN_RE в
# scripts/validate_books.py и с WORD_RE в js/reader.js. Апостроф внутри
# слова — часть токена («war's», «wenn's»), иначе в глоссарии заводится
# мусорный ключ «s». Дефис — тоже часть токена, как у ридера.
TOKEN_RE = re.compile(r"[^\W\d_]+(?:[-'’][^\W\d_]+)*", re.UNICODE)

CHAPTER_RE = re.compile(r'^#\s*(ch-\d+)\s*\|\s*([^|]+?)\s*\|\s*(.+?)\s*$')

# Сокращения, после точки которых предложение НЕ кончается.
ABBREV = {
    'z', 'b', 'd', 'h', 'u', 's', 'w', 'a', 'o', 'evtl', 'bzw', 'ca',
    'usw', 'etc', 'vgl', 'ggf', 'inkl', 'nr', 'st', 'hr', 'fr', 'dr', 'prof',
    'jh', 'bd', 'abs', 'sog', 'dgl',
}

# Закрывающие кавычки и скобки, которые могут стоять ПОСЛЕ точки/!/?
# Внимание: в немецкой типографике «ёлочки» развёрнуты — открывающая »,
# закрывающая «. Поэтому « здесь, а » — в OPENING. Наборы не пересекаются,
# иначе „…“ и »…« нельзя различить.
CLOSING = '«"”’\')]'

# Открывающие кавычки — с них может начинаться новое предложение
OPENING = '»„“‘'


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def write_json(path, data, dry_run=False):
    text = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    if dry_run:
        return False
    os.makedirs(os.path.dirname(path), exist_ok=True)
    old = read(path) if os.path.isfile(path) else None
    if old == text:
        return False
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    return True


# ══════════════════════════════════════════════════════
#  Разбивка на предложения
# ══════════════════════════════════════════════════════

def split_sentences(par):
    """Разбить абзац на предложения.

    Границей считается .!?… (возможно с закрывающими кавычками/скобками),
    после которого идёт пробел и слово с заглавной буквы или открывающая
    кавычка. Не режем:
      * после сокращений («z. B.», «usw.», «Dr.»);
      * после одиночной буквы или цифры с точкой («1. Mai», «A. Müller»);
      * если следующее слово начинается со строчной — это прямая речь
        вида „Was hast du vor?" sprach der Esel.
    """
    out = []
    start = 0
    i = 0
    n = len(par)
    while i < n:
        ch = par[i]
        if ch not in '.!?…':
            i += 1
            continue

        end = i + 1
        # съедаем подряд идущие знаки конца и закрывающие кавычки/скобки
        while end < n and par[end] in '.!?…':
            end += 1
        while end < n and par[end] in CLOSING:
            end += 1

        m = re.match(r'\s+(\S)', par[end:])
        if not m:
            i = end
            continue

        nxt = m.group(1)
        # следующее слово со строчной → это не конец предложения
        if not (nxt.isupper() or nxt in OPENING):
            i = end
            continue

        if ch == '.':
            wm = re.search('([A-Za-zÄäÖöÜüß0-9]+)$',
                           par[start:i])
            prev = wm.group(1).lower() if wm else ''
            if prev in ABBREV or len(prev) <= 1 or prev.isdigit():
                i = end
                continue

        sent = par[start:end].strip()
        if sent:
            out.append(sent)
        start = end
        i = end

    tail = par[start:].strip()
    if tail:
        out.append(tail)
    return out


# ══════════════════════════════════════════════════════
#  Разбор исходника
# ══════════════════════════════════════════════════════

def parse_source(text):
    """→ [{'id','title','titleRu','paragraphs': [str, ...]}, ...]"""
    chapters = []
    cur = None
    buf = []

    def flush_par():
        if not buf:
            return
        par = re.sub(r'\s+', ' ', ' '.join(buf)).strip()
        del buf[:]
        if par and cur is not None:
            cur['paragraphs'].append(par)

    for raw_line in text.splitlines():
        line = raw_line.strip()
        m = CHAPTER_RE.match(line)
        if m:
            flush_par()
            cur = {'id': m.group(1), 'title': m.group(2),
                   'titleRu': m.group(3), 'paragraphs': []}
            chapters.append(cur)
            continue
        if not line:
            flush_par()
            continue
        if line.startswith('#'):
            flush_par()          # обычный комментарий — не часть текста
            continue
        if cur is None:
            raise SystemExit('ОШИБКА: текст до первого заголовка "# ch-NN | … | …"')
        buf.append(line)

    flush_par()
    return chapters


def load_existing_ru(path):
    """Карта {немецкое предложение: перевод} из уже существующей главы."""
    if not os.path.isfile(path):
        return {}
    try:
        data = json.loads(read(path))
    except (ValueError, OSError):
        return {}
    out = {}
    for par in data.get('paragraphs') or []:
        for s in par.get('s') or []:
            de, ru = s.get('de'), s.get('ru')
            if de and ru:
                out[de] = ru
    return out


# ══════════════════════════════════════════════════════
#  main
# ══════════════════════════════════════════════════════

def main():
    ap = argparse.ArgumentParser(description='Собрать заготовки глав книги')
    ap.add_argument('book_id', help='id книги, напр. bremer')
    ap.add_argument('--dry-run', action='store_true',
                    help='показать, что получится, ничего не записывать')
    args = ap.parse_args()

    src_path = os.path.join(BASE, 'tools', 'sources', args.book_id + '.txt')
    if not os.path.isfile(src_path):
        print('ОШИБКА: нет исходника ' + src_path, file=sys.stderr)
        return 2

    out_dir = os.path.join(BASE, 'data', 'books', args.book_id)
    chapters = parse_source(read(src_path))
    if not chapters:
        print('ОШИБКА: в исходнике нет ни одной главы', file=sys.stderr)
        return 2

    freq = Counter()
    example = OrderedDict()
    total_sent = 0
    written = 0

    for ch in chapters:
        path = os.path.join(out_dir, ch['id'] + '.json')
        kept = load_existing_ru(path)

        paragraphs = []
        for par in ch['paragraphs']:
            sentences = split_sentences(par)
            total_sent += len(sentences)
            paragraphs.append({'s': [{'de': s, 'ru': kept.get(s, '')} for s in sentences]})
            for s in sentences:
                for tok in TOKEN_RE.findall(s):
                    key = tok.lower()
                    freq[key] += 1
                    if key not in example:
                        example[key] = s

        doc = {'id': ch['id'], 'title': ch['title'],
               'titleRu': ch['titleRu'], 'paragraphs': paragraphs}
        if write_json(path, doc, args.dry_run):
            written += 1

        n = sum(len(p['s']) for p in paragraphs)
        filled = sum(1 for p in paragraphs for s in p['s'] if s['ru'])
        print('%s: %d абз., %d предл., перевод есть у %d/%d'
              % (ch['id'], len(paragraphs), n, filled, n))

    # tokens.txt — рабочий файл для набивки глоссария, на прод не уезжает
    tok_path = os.path.join(BASE, 'tools', 'sources', args.book_id + '.tokens.txt')
    lines = ['# токенов всего: %d, уникальных: %d' % (sum(freq.values()), len(freq)),
             '# частота\tтокен\tпример употребления', '']
    for tok, cnt in sorted(freq.items(), key=lambda kv: (-kv[1], kv[0])):
        lines.append('%d\t%s\t%s' % (cnt, tok, example[tok]))
    if not args.dry_run:
        with open(tok_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write('\n'.join(lines) + '\n')

    mode = '[dry-run] ' if args.dry_run else ''
    print('\n%sГлав: %d, предложений: %d, слов: %d, уникальных токенов: %d'
          % (mode, len(chapters), total_sent, sum(freq.values()), len(freq)))
    print('%sЗаписано файлов глав: %d' % (mode, written))
    print('%sТокены: %s' % (mode, os.path.relpath(tok_path, BASE)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
