#!/usr/bin/env python3
"""
validate_books.py — проверка целостности книг читалки Deutsch Meister.

Запуск:  python scripts/validate_books.py            # все книги из index.json
         python scripts/validate_books.py bremer     # только одну
Код возврата: 0 — ок, 1 — есть ошибки.

Проверки (ошибки дают код возврата 1; предупреждения печатаются,
но код возврата не меняют):
  * data/books/index.json парсится, у каждой книги есть обязательные поля;
  * meta.json каждой книги парсится, id совпадает с именем папки;
  * все ch-NN.json парсятся, число глав в meta и в index совпадает
    с фактическим числом файлов;
  * у каждого предложения непустые de и ru;
  * КАЖДЫЙ токен каждой главы есть в glossary.w (покрытие 100%);
  * КАЖДАЯ лемма из glossary.w есть в glossary.l;
  * у леммы-существительного есть art и pl (pl: null — осознанное
    «мн. ч. нет»), у глагола — forms, у субстантивированного
    прилагательного — decl вместо art/pl;
  * значение glossary.w — либо строка-лемма, либо объект {l, old}
    (помета «устар.» на КОНКРЕТНОЙ словоформе: im Hause архаично,
    само Haus — нет); у объекта обязателен непустой l;
  * необязательное поле "old" (помета «устар.»), если есть, — непустая строка;
  * необязательное поле "note" (обороты, отделяемые приставки, пояснения),
    если есть, — непустая строка;
  * ПРЕДУПРЕЖДЕНИЕ: ru длиннее 60 символов — скорее всего в перевод
    затесался разбор употребления, которому место в note: на карточке
    длинный ru не помещается;
  * у прозвища (pos «прозвище») нет и не должно быть art/pl/decl;
  * в glossary.l нет лемм, на которые не ссылается ни одна словоформа
    (мёртвый вес — либо опечатка в w, либо забытая запись).

Почему отдельный скрипт, а не ветка в validate_lessons.py: у книг другой
формат (JSON, не JS) и другой жизненный цикл. validate_lessons.py книги
не видит вовсе — он глобит только data/<lvl>/<lvl>-lesson-*.js.
"""

import argparse
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKS_DIR = os.path.join(BASE, 'data', 'books')

# ВАЖНО: должна совпадать с TOKEN_RE в scripts/build_book.py и с WORD_RE в
# js/reader.js. Расхождение = дырки в подсказках у читателя. Источник
# правды — то, что реально попадает в .bw: /[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*/gu.
# В Python нет \p{L}, поэтому [^\W\d_] — тот же класс «любая буква».
# Дефис склеивает токен так же, как у ридера: «Süd-Ost» — одно слово.
TOKEN_RE = re.compile(r"[^\W\d_]+(?:[-'’][^\W\d_]+)*", re.UNICODE)

INDEX_FIELDS = ('id', 'title', 'titleRu', 'author', 'level', 'year',
                'chapters', 'words', 'minutes', 'cover', 'source', 'license')

NOUN_POS = 'сущ.'
VERB_POS = 'гл.'
SUBST_ADJ_POS = 'субст. прил.'
# Прозвища из сказки (Packan, Bartputzer): словарной нормы у них нет,
# артикль и мн. ч. пришлось бы выдумывать — поэтому запрещены.
NICKNAME_POS = 'прозвище'

errors = []
warnings = []

# ru идёт на карточку, а там мало места. 60 символов — не предел вёрстки,
# а сигнал: столько занимает уже не перевод, а разбор употребления.
RU_WARN_LEN = 60


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def load_json(path, label):
    """→ (data, ok). Ошибку чтения/парсинга кладёт в errors."""
    if not os.path.isfile(path):
        err('%s: файла нет (%s)' % (label, rel(path)))
        return None, False
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f), True
    except ValueError as e:
        err('%s: битый JSON — %s' % (label, e))
        return None, False
    except OSError as e:
        err('%s: не читается — %s' % (label, e))
        return None, False


def rel(path):
    return os.path.relpath(path, BASE).replace(os.sep, '/')


# ══════════════════════════════════════════════════════
#  Проверка одной книги
# ══════════════════════════════════════════════════════

def check_book(book_id, index_entry=None):
    book_dir = os.path.join(BOOKS_DIR, book_id)
    tag = 'books/' + book_id

    if not os.path.isdir(book_dir):
        err('%s: нет папки %s' % (tag, rel(book_dir)))
        return

    meta, ok = load_json(os.path.join(book_dir, 'meta.json'), tag + '/meta.json')
    if not ok:
        return
    if meta.get('id') != book_id:
        err('%s/meta.json: id "%s" не совпадает с именем папки "%s"'
            % (tag, meta.get('id'), book_id))

    glossary, ok = load_json(os.path.join(book_dir, 'glossary.json'),
                             tag + '/glossary.json')
    if not ok:
        return
    forms = glossary.get('w')
    lemmas = glossary.get('l')
    if not isinstance(forms, dict) or not isinstance(lemmas, dict):
        err('%s/glossary.json: нужны объекты "w" (словоформы) и "l" (леммы)' % tag)
        return

    # ── главы ──
    chapter_files = sorted(
        f for f in os.listdir(book_dir)
        if re.match(r'^ch-\d+\.json$', f)
    )
    if not chapter_files:
        err('%s: не найдено ни одного ch-NN.json' % tag)
        return

    declared = meta.get('chapters')
    if declared != len(chapter_files):
        err('%s/meta.json: chapters=%r, а файлов глав %d'
            % (tag, declared, len(chapter_files)))
    if index_entry is not None and index_entry.get('chapters') != len(chapter_files):
        err('%s: index.json объявляет chapters=%r, а файлов глав %d'
            % (tag, index_entry.get('chapters'), len(chapter_files)))

    used_forms = set()
    total_tokens = 0
    total_sentences = 0

    for fname in chapter_files:
        label = tag + '/' + fname
        ch, ok = load_json(os.path.join(book_dir, fname), label)
        if not ok:
            continue

        expected_id = fname[:-len('.json')]
        if ch.get('id') != expected_id:
            err('%s: id "%s" не совпадает с именем файла' % (label, ch.get('id')))
        for field in ('title', 'titleRu'):
            if not (ch.get(field) or '').strip():
                err('%s: пустое поле %s' % (label, field))

        paragraphs = ch.get('paragraphs')
        if not isinstance(paragraphs, list) or not paragraphs:
            err('%s: paragraphs пуст или не массив' % label)
            continue

        for pi, par in enumerate(paragraphs):
            sentences = (par or {}).get('s')
            if not isinstance(sentences, list) or not sentences:
                err('%s: абзац %d без предложений' % (label, pi))
                continue
            for si, sent in enumerate(sentences):
                de = (sent or {}).get('de') or ''
                ru = (sent or {}).get('ru') or ''
                total_sentences += 1
                if not de.strip():
                    err('%s: [%d.%d] пустое de' % (label, pi, si))
                    continue
                if not ru.strip():
                    err('%s: [%d.%d] нет перевода (ru): %s'
                        % (label, pi, si, de[:60]))
                for tok in TOKEN_RE.findall(de):
                    total_tokens += 1
                    key = tok.lower()
                    used_forms.add(key)
                    if key not in forms:
                        err('%s: [%d.%d] токен "%s" отсутствует в glossary.w'
                            % (label, pi, si, tok))

    # ── связность глоссария ──
    used_lemmas = set()
    for form, value in forms.items():
        if form != form.lower():
            err('%s/glossary.json: ключ w."%s" должен быть в lowercase' % (tag, form))

        # Значение w — либо строка-лемма, либо объект {l, old}: помета
        # «устар.» бывает привязана к КОНКРЕТНОЙ словоформе, а не к слову
        # (im Hause архаично, само Haus — нет).
        if isinstance(value, dict):
            lemma = value.get('l')
            if not isinstance(lemma, str) or not lemma.strip():
                err('%s/glossary.json: w."%s" — объект без непустого l' % (tag, form))
                continue
            if 'old' in value:
                if not isinstance(value['old'], str) or not value['old'].strip():
                    err('%s/glossary.json: w."%s".old пустое или не строка' % (tag, form))
            unknown = [k for k in value if k not in ('l', 'old')]
            if unknown:
                err('%s/glossary.json: w."%s" — лишние поля: %s'
                    % (tag, form, ', '.join(sorted(unknown))))
        elif isinstance(value, str):
            lemma = value
            if not lemma.strip():
                err('%s/glossary.json: w."%s" ссылается на пустую лемму' % (tag, form))
                continue
        else:
            err('%s/glossary.json: w."%s" должно быть строкой или объектом {l, old}'
                % (tag, form))
            continue

        if lemma not in lemmas:
            err('%s/glossary.json: лемма "%s" (из w."%s") отсутствует в l'
                % (tag, lemma, form))
            continue
        used_lemmas.add(lemma)

    for lemma, info in lemmas.items():
        if not isinstance(info, dict):
            err('%s/glossary.json: l."%s" не объект' % (tag, lemma))
            continue
        if not (info.get('ru') or '').strip():
            err('%s/glossary.json: l."%s" без перевода ru' % (tag, lemma))
        pos = (info.get('pos') or '').strip()
        if not pos:
            err('%s/glossary.json: l."%s" без части речи pos' % (tag, lemma))
        if pos == NOUN_POS:
            if not (info.get('art') or '').strip():
                err('%s/glossary.json: существительное "%s" без артикля art' % (tag, lemma))
            # pl: null — ОСОЗНАННОЕ «множественного числа нет» (Mist, Tod,
            # Furcht). Пропуск самого поля — ошибка: это забытая запись,
            # а не решение. Поэтому проверяем наличие ключа отдельно.
            if 'pl' not in info:
                err('%s/glossary.json: существительное "%s" без поля pl '
                    '(для «мн. ч. нет» ставь pl: null явно)' % (tag, lemma))
            elif info['pl'] is not None and not str(info['pl']).strip():
                err('%s/glossary.json: существительное "%s": pl пустая строка '
                    '(ставь null, если мн. ч. нет)' % (tag, lemma))
        if pos == SUBST_ADJ_POS:
            # Субстантивированное прилагательное склоняется как прилагательное:
            # артикль и мн. ч. зависят от детерминатива, поэтому art/pl тут
            # бессмысленны — нужна схема склонения целиком.
            if not (info.get('decl') or '').strip():
                err('%s/glossary.json: субстантивированное "%s" без decl' % (tag, lemma))
            for extra in ('art', 'pl'):
                if extra in info:
                    err('%s/glossary.json: у субстантивированного "%s" не должно '
                        'быть поля %s — только decl' % (tag, lemma, extra))
        if pos == NICKNAME_POS:
            for extra in ('art', 'pl', 'decl'):
                if extra in info:
                    err('%s/glossary.json: у прозвища "%s" не должно быть поля %s '
                        '— словарной нормы у него нет' % (tag, lemma, extra))
        if pos == VERB_POS and not (info.get('forms') or '').strip():
            err('%s/glossary.json: глагол "%s" без трёх форм forms' % (tag, lemma))
        # decl у обычного существительного — необязательная схема склонения
        # (n-Deklination). Если есть — непустая строка.
        if pos == NOUN_POS and 'decl' in info:
            if not isinstance(info['decl'], str) or not info['decl'].strip():
                err('%s/glossary.json: l."%s".decl присутствует, но пустое или не строка'
                    % (tag, lemma))
        # "old" — необязательная помета «устар.»: слово или его употребление
        # в этом тексте устарело и переносить его в свою речь не надо.
        # Отсутствие поля — норма и ошибкой НЕ является; ругаемся только на
        # присутствующее, но пустое или не-строку.
        if 'old' in info:
            if not isinstance(info['old'], str) or not info['old'].strip():
                err('%s/glossary.json: l."%s".old присутствует, но пустое или не строка'
                    % (tag, lemma))
        # "note" — необязательный разбор употребления: обороты, отделяемые
        # приставки, устойчивые выражения, пояснения. Всё, что НЕ перевод.
        # Показывается в тултипе и в словаре книги, но не на карточке.
        if 'note' in info:
            if not isinstance(info['note'], str) or not info['note'].strip():
                err('%s/glossary.json: l."%s".note присутствует, но пустое или не строка'
                    % (tag, lemma))
        ru_len = len((info.get('ru') or '').strip())
        if ru_len > RU_WARN_LEN:
            warn('%s/glossary.json: l."%s".ru — %d символов, длиннее %d: похоже, '
                 'разделение ru/note неполное' % (tag, lemma, ru_len, RU_WARN_LEN))

    orphan = sorted(set(lemmas) - used_lemmas)
    if orphan:
        err('%s/glossary.json: леммы без единой словоформы в w: %s'
            % (tag, ', '.join(orphan)))

    unused = sorted(set(forms) - used_forms)
    if unused:
        err('%s/glossary.json: словоформы в w, не встречающиеся в тексте: %s'
            % (tag, ', '.join(unused)))

    print('%s: глав %d, предложений %d, токенов %d, словоформ %d, лемм %d'
          % (tag, len(chapter_files), total_sentences, total_tokens,
             len(forms), len(lemmas)))


# ══════════════════════════════════════════════════════
#  main
# ══════════════════════════════════════════════════════

def main():
    ap = argparse.ArgumentParser(description='Проверить книги читалки')
    ap.add_argument('book_id', nargs='?', help='проверить только одну книгу')
    args = ap.parse_args()

    index, ok = load_json(os.path.join(BOOKS_DIR, 'index.json'), 'books/index.json')
    entries = {}
    if ok:
        books = index.get('books')
        if not isinstance(books, list) or not books:
            err('books/index.json: пустой или отсутствующий массив books')
            books = []
        for i, b in enumerate(books):
            if not isinstance(b, dict):
                err('books/index.json: элемент %d не объект' % i)
                continue
            missing = [f for f in INDEX_FIELDS if f not in b]
            if missing:
                err('books/index.json: у "%s" нет полей: %s'
                    % (b.get('id', '?'), ', '.join(missing)))
            if b.get('id'):
                if b['id'] in entries:
                    err('books/index.json: дубль id "%s"' % b['id'])
                entries[b['id']] = b

    if args.book_id:
        check_book(args.book_id, entries.get(args.book_id))
    else:
        for book_id in sorted(entries):
            check_book(book_id, entries[book_id])
        # папки книг, не перечисленные в каталоге
        if os.path.isdir(BOOKS_DIR):
            for name in sorted(os.listdir(BOOKS_DIR)):
                if os.path.isdir(os.path.join(BOOKS_DIR, name)) and name not in entries:
                    err('data/books/%s: папка книги не перечислена в index.json' % name)

    for e in errors:
        print('ERROR: ' + e)
    for w in warnings:
        print('WARN:  ' + w)
    print('\nПроверено книг: %d. Ошибок: %d. Предупреждений: %d.'
          % (1 if args.book_id else len(entries), len(errors), len(warnings)))
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
