#!/usr/bin/env python3
"""
validate_lessons.py — проверка целостности уроков Deutsch Meister.

Запуск:  python scripts/validate_lessons.py
Код возврата: 0 — ок (warnings допустимы), 1 — есть ошибки.

Проверки (ошибки):
  * количество уроков по уровням = A1:20, A2:20, B1:14, B2:14;
  * каждый data/<lvl>/<lvl>-lesson-NN.js содержит LESSON_DATA с непустыми
    id, title, meta, phrases[], vocabulary[], grammar[], exercises{};
  * id совпадает с путём/номером файла, дублей нет;
  * для каждого data-файла есть оболочка lessons/<lvl>/lesson-NN/index.html,
    подключающая именно свой data-файл; осиротевших оболочек нет;
  * все ?v=N во всех HTML и в STATIC service-worker.js одинаковые.

Проверки (warnings, не валят сборку):
  * слова из phrases[], не покрытые словарём подсказок
    (COURSE_WORDS_RAW / BASIC_WORDS / EXTRA_WORDS / словарь урока и т.д.).
    Питон приближённо повторяет buildWordLexicon() из lesson-render.js.
"""

import glob
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXPECTED_COUNTS = {'a1': 20, 'a2': 20, 'b1': 14, 'b2': 14}

WORD_RE = re.compile(r"[A-Za-zÄäÖöÜüßÉé]+")
ARTICLES = {'der', 'die', 'das', 'ein', 'eine', 'einen'}

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def key_of(s):
    m = WORD_RE.search(s or '')
    return m.group(0).lower() if m else ''


def words_of(s):
    return WORD_RE.findall(s or '')


def extract_block(text, key, open_ch, close_ch):
    """Вернуть содержимое блока `key: [ ... ]` / `const key = { ... }` (без скобок).

    Простой сканер со скобочным балансом, знает про строки '...' и "..."
    и шаблонные строки `...`. None, если ключ не найден.
    """
    m = re.search(r'\b' + re.escape(key) + r'\s*[:=]\s*' + re.escape(open_ch), text)
    if not m:
        return None
    i = m.end()
    depth = 1
    out = []
    in_str = None
    while i < len(text):
        ch = text[i]
        if in_str:
            if ch == '\\':
                out.append(text[i:i + 2])
                i += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in ('"', "'", '`'):
            in_str = ch
        elif ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return ''.join(out)
        out.append(ch)
        i += 1
    return None


def str_values(block, key):
    """Все строковые значения `key: '...'` внутри блока."""
    if not block:
        return []
    vals = []
    for m in re.finditer(r'\b' + re.escape(key) + r"\s*:\s*'((?:[^'\\]|\\.)*)'", block):
        vals.append(m.group(1).replace("\\'", "'"))
    return vals


# ══════════════════════════════════════════════════════
#  Лексикон подсказок (приближение buildWordLexicon)
# ══════════════════════════════════════════════════════

def build_static_lexicon(render_src):
    keys = set()

    # BASIC_WORDS / EXTRA_WORDS: ключи объектов
    for const in ('BASIC_WORDS', 'EXTRA_WORDS'):
        m = re.search(r'const ' + const + r'\s*=\s*\{', render_src)
        if not m:
            warn(f'lesson-render.js: не нашёл const {const}')
            continue
        block = extract_block(render_src, const, '{', '}') or ''
        for km in re.finditer(r'(?m)^\s*([A-Za-zÄäÖöÜüßÉé]+)\s*:', block):
            keys.add(km.group(1).lower())

    # COURSE_WORDS_RAW: строки `word|перевод|тип`
    m = re.search(r'const COURSE_WORDS_RAW\s*=\s*`([^`]*)`', render_src)
    if m:
        for line in m.group(1).strip().splitlines():
            word = line.split('|')[0].strip()
            if word:
                keys.add(key_of(word))
    else:
        warn('lesson-render.js: не нашёл COURSE_WORDS_RAW')

    # COMMON_VERB_FORMS: [['word', ...], ...]
    block = extract_block(render_src, 'COMMON_VERB_FORMS', '[', ']')
    if block:
        for fm in re.finditer(r"\[\s*'([^']+)'", block):
            keys.add(key_of(fm.group(1)))

    # NOUN_FORM_OVERRIDES / VERB_FORM_OVERRIDES: word: '...'
    for const in ('NOUN_FORM_OVERRIDES', 'VERB_FORM_OVERRIDES'):
        block = extract_block(render_src, const, '{', '}')
        for wm in re.finditer(r"word:\s*'([^']+)'", block or ''):
            keys.add(key_of(wm.group(1)))

    keys.discard('')
    return keys


def headwords(term):
    """Как addGermanTerm: убрать скобки, взять до запятой, выкинуть артикли."""
    clean = re.sub(r'\([^)]*\)', '', term or '').split(',')[0]
    words = words_of(clean)
    content = [w for w in words if w.lower() not in ARTICLES]
    return content if content else words


def lesson_lexicon(data_src, static_keys):
    """static-лексикон + слова, порождаемые данными конкретного урока."""
    keys = set(static_keys)

    vocab_block = extract_block(data_src, 'vocabulary', '[', ']')
    for term in str_values(vocab_block, 'de'):
        hw = headwords(term)
        for w in hw:
            keys.add(w.lower())
        # генерация форм глагола stem+e/st/t для -en (как addVerbForms)
        if len(hw) == 1 and hw[0].lower().endswith('en'):
            stem = hw[0][:-2].lower()
            keys.update({stem + 'e', stem + 'st', stem + 't'})

    # пары "Сопоставление" (только одиночные слова, как addGermanTerm)
    ex_block = extract_block(data_src, 'exercises', '{', '}') or ''
    match_block = extract_block(ex_block, 'matching', '[', ']')
    if match_block is None:
        match_block = extract_block(ex_block, 'pairs', '[', ']')
    for term in str_values(match_block, 'de') + str_values(match_block, 'left'):
        hw = headwords(term)
        if len(hw) == 1:
            keys.add(hw[0].lower())

    # подсказки fillBlanks
    for w in str_values(ex_block, 'hintWord') + str_values(ex_block, 'blank'):
        keys.add(key_of(w))

    # грамматика: form: 'gehe' и т.п.
    grammar_block = extract_block(data_src, 'grammar', '[', ']')
    for form in str_values(grammar_block, 'form'):
        for part in re.split(r'[/,;·]+', form):
            ws = words_of(part)
            if len(ws) == 1:
                keys.add(ws[0].lower())

    # заметки фраз "X = перевод"
    phrases_block = extract_block(data_src, 'phrases', '[', ']')
    for note in str_values(phrases_block, 'note'):
        nm = re.search(r'\b([A-Za-zÄäÖöÜüßÉé]+)\b\s*=\s*\S', note)
        if nm:
            keys.add(nm.group(1).lower())

    keys.discard('')
    return keys


# ══════════════════════════════════════════════════════
#  Основные проверки
# ══════════════════════════════════════════════════════

def check_lessons():
    render_src = read(os.path.join(BASE, 'js', 'lesson-render.js'))
    static_keys = build_static_lexicon(render_src)

    seen_ids = {}
    data_ids = set()

    for level, expected in EXPECTED_COUNTS.items():
        data_files = sorted(glob.glob(os.path.join(BASE, 'data', level, f'{level}-lesson-*.js')))
        if len(data_files) != expected:
            err(f'{level}: ожидалось {expected} data-файлов, найдено {len(data_files)}')

        for path in data_files:
            rel = os.path.relpath(path, BASE).replace(os.sep, '/')
            name = os.path.basename(path)
            nm = re.match(rf'{level}-lesson-(\d+)\.js$', name)
            if not nm:
                err(f'{rel}: имя файла не соответствует шаблону {level}-lesson-NN.js')
                continue
            num = nm.group(1)
            expected_id = f'{level}-{num}'
            src = read(path)

            if 'LESSON_DATA' not in src:
                err(f'{rel}: нет LESSON_DATA')
                continue

            idm = re.search(r"\bid\s*:\s*['\"]([^'\"]+)['\"]", src)
            lesson_id = idm.group(1) if idm else None
            if not lesson_id:
                err(f'{rel}: не найден id')
            else:
                if lesson_id != expected_id:
                    err(f'{rel}: id "{lesson_id}" не совпадает с путём (ожидался "{expected_id}")')
                if lesson_id in seen_ids:
                    err(f'{rel}: дубль id "{lesson_id}" (уже в {seen_ids[lesson_id]})')
                seen_ids[lesson_id] = rel
                data_ids.add(expected_id)

            tm = re.search(r"\btitle\s*:\s*['\"](.+?)['\"]", src)
            if not tm or not tm.group(1).strip():
                err(f'{rel}: пустой или отсутствующий title')

            for field, br in (('meta', '{}'), ('phrases', '[]'), ('vocabulary', '[]'),
                              ('grammar', '[]'), ('exercises', '{}')):
                block = extract_block(src, field, br[0], br[1])
                if block is None:
                    err(f'{rel}: нет поля {field}')
                elif not re.search(r'\S', block):
                    err(f'{rel}: поле {field} пустое')

            # оболочка
            shell = os.path.join(BASE, 'lessons', level, f'lesson-{num}', 'index.html')
            if not os.path.isfile(shell):
                err(f'{rel}: нет оболочки lessons/{level}/lesson-{num}/index.html')
            else:
                shell_src = read(shell)
                if f'{level}-lesson-{num}.js' not in shell_src:
                    err(f'lessons/{level}/lesson-{num}/index.html: не подключает {name}')

            # покрытие подсказок (warning)
            lex = lesson_lexicon(src, static_keys)
            phrases_block = extract_block(src, 'phrases', '[', ']')
            missing = set()
            for phrase in str_values(phrases_block, 'de'):
                for w in words_of(phrase):
                    if w.lower() not in lex:
                        missing.add(w)
            if missing:
                warn(f'{rel}: слова фраз без подсказки: ' + ', '.join(sorted(missing)))

        # осиротевшие оболочки
        for shell in sorted(glob.glob(os.path.join(BASE, 'lessons', level, 'lesson-*', 'index.html'))):
            sm = re.search(r'lesson-(\d+)', os.path.basename(os.path.dirname(shell)))
            if sm and f'{level}-{sm.group(1)}' not in data_ids:
                rel = os.path.relpath(shell, BASE).replace(os.sep, '/')
                err(f'{rel}: оболочка без data-файла (осиротевшая)')


def check_versions():
    html_files = [os.path.join(BASE, 'index.html'), os.path.join(BASE, '404.html')]
    html_files += glob.glob(os.path.join(BASE, 'lessons', '*', '*', 'index.html'))

    versions = {}
    for path in html_files:
        if not os.path.isfile(path):
            continue
        rel = os.path.relpath(path, BASE).replace(os.sep, '/')
        for m in re.finditer(r'\?v=(\d+)', read(path)):
            versions.setdefault(int(m.group(1)), set()).add(rel)

    sw = read(os.path.join(BASE, 'service-worker.js'))
    for m in re.finditer(r'\?v=(\d+)', sw):
        versions.setdefault(int(m.group(1)), set()).add('service-worker.js')

    if len(versions) > 1:
        detail = '; '.join(
            f'v={v} в {len(files)} файл(ах), напр. {sorted(files)[0]}'
            for v, files in sorted(versions.items())
        )
        err(f'?v=N рассинхронизированы: {detail}. Запусти python bump_version.py')


def main():
    check_lessons()
    check_versions()

    for w in warnings:
        print(f'WARNING: {w}')
    for e in errors:
        print(f'ERROR: {e}')

    total = sum(EXPECTED_COUNTS.values())
    print(f'\nПроверено уровней: {len(EXPECTED_COUNTS)} (ожидается {total} уроков). '
          f'Ошибок: {len(errors)}, предупреждений: {len(warnings)}.')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
