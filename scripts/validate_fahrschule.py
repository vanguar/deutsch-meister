#!/usr/bin/env python3
"""
validate_fahrschule.py — проверка раздела «Автошкола» (fahrschule.html).

Запуск:  python scripts/validate_fahrschule.py
Код возврата: 0 — ок, 1 — есть ошибки.

Проверяет собранное (tools/fahrschule/build.py):
  * оглавление и уроки есть на ru (data/fahrschule) и в копиях
    i18n/uk/fahrschule, i18n/ar/fahrschule; набор уроков одинаков;
  * немецкий текст во всех копиях один и тот же (переводится только tr);
  * переводы на своём языке: русский и украинский кириллицей (в
    украинском нет ы/э/ъ/ё), арабский арабицей без кириллицы;
  * у КАЖДОГО немецкого слова есть подсказка: ключ в gloss.w ведёт к
    лемме в gloss.l, у леммы есть перевод на языке копии;
  * знаки: SVG лежит в data/fahrschule/signs, лицензия свободная;
  * у перекрёстка порядок — перестановка машин сцены;
  * темы одинаковы во всех копиях и покрывают каждый урок ровно один раз;
  * fahrschule.html подключает tts.js, reader-speak.js, reader-tip.js,
    fahrschule.js и стили тултипа; на главной есть плитка раздела;
    service-worker кладёт оболочку в кеш.
Слово ищется тем же регулярным выражением, что в js/fahrschule.js
(WORD_RE) — расхождение тоже ошибка.
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = {'ru': 'data/fahrschule', 'uk': 'i18n/uk/fahrschule', 'ar': 'i18n/ar/fahrschule'}
CYR = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')
RU_ONLY = re.compile(r'[ЫыЭэЪъЁё]')
ARABIC = re.compile(r'[؀-ۿ]')
FREE = re.compile(r'public domain|cc0', re.I)

errors = []


def err(msg):
    errors.append(msg)


def read(rel):
    with open(os.path.join(BASE, rel), encoding='utf-8') as f:
        return f.read()


def load(rel):
    path = os.path.join(BASE, rel)
    if not os.path.isfile(path):
        err(f'нет файла {rel}')
        return None
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def word_re():
    m = re.search(r"const WORD_RE\s*=\s*/(.+?)/g;", read('js/fahrschule.js'))
    if not m:
        err('js/fahrschule.js: не найден WORD_RE')
        return re.compile(r'[A-Za-zÄÖÜäöüß]+')
    src = m.group(1).replace('\\/', '/')
    build = read('tools/fahrschule/build.py')
    if src not in build.replace('\\/', '/'):
        err('WORD_RE в js/fahrschule.js и tools/fahrschule/build.py разные')
    return re.compile(src)


def check_tr(where, lang, tr):
    if not isinstance(tr, str) or not tr.strip():
        err(f'{where}: пустой перевод')
    elif lang == 'ar':
        if not ARABIC.search(tr) or CYR.search(tr):
            err(f'{where}: перевод не арабицей: {tr}')
    elif not CYR.search(tr):
        err(f'{where}: перевод без кириллицы: {tr}')
    elif lang == 'uk' and RU_ONLY.search(tr):
        err(f'{where}: в украинском русские буквы: {tr}')


def texts(unit):
    """Все немецкие фразы урока: (где, {de, tr, o?})."""
    out = [('название', {'de': unit['title'], 'tr': unit['titleTr']})]
    for si, sec in enumerate(unit.get('sections') or [], 1):
        for li, ln in enumerate(sec['lines'], 1):
            out.append((f'раздел {si} строка {li}', ln))
    if unit.get('quizQuestion'):
        out.append(('вопрос теста', unit['quizQuestion']))
    for li, ln in enumerate(unit.get('lines') or [], 1):
        out.append((f'реплика {li}', ln))
    for ci, sc in enumerate(unit.get('scenes') or [], 1):
        out.append((f'сцена {ci} ситуация', sc['situation']))
        if sc.get('question'):
            out.append((f'сцена {ci} вопрос', sc['question']))
        for ei, e in enumerate(sc['explain'], 1):
            out.append((f'сцена {ci} пояснение {ei}', e))
    for sid, s in (unit.get('signs') or {}).items():
        out.append((f'знак {sid}', {'de': s['de'], 'tr': s['tr']}))
    return out


# Переводимые поля: всё остальное (немецкий, машины, знаки, порядок) общее
TR_KEYS = ('tr', 'titleTr', 'intro', 'gloss')


def german(obj, section=False):
    """Структура урока без переводов — должна совпасть во всех копиях.
    У раздела теории title — перевод, у урока — немецкое название."""
    if isinstance(obj, dict):
        return {k: german(v, k == 'sections') for k, v in obj.items()
                if k not in TR_KEYS and not (section and k == 'title')}
    if isinstance(obj, list):
        return [german(v, section) for v in obj]
    return obj


def main():
    wre = word_re()
    meta = load('tools/fahrschule/signs.json') or {}
    idx = {lang: load(f'{d}/index.json') for lang, d in LANGS.items()}
    if not all(idx.values()):
        return report()
    ids = [u['id'] for u in idx['ru']['units']]
    if not ids:
        err('в оглавлении нет уроков')
    for lang in ('uk', 'ar'):
        if [u['id'] for u in idx[lang]['units']] != ids:
            err(f'{lang}: в оглавлении другие уроки')
        for u in idx[lang]['units']:
            check_tr(f'{lang} оглавление {u["id"]}', lang, u.get('titleTr'))
    # темы: одинаковые во всех копиях, каждый урок ровно в одной
    for lang in LANGS:
        tops = idx[lang].get('topics') or []
        if [(t['id'], t['units'], t['title']) for t in tops] != [(t['id'], t['units'], t['title']) for t in idx['ru'].get('topics') or []]:
            err(f'{lang}: темы отличаются от русской копии')
        flat = [x for t in tops for x in t['units']]
        if sorted(flat) != sorted(ids) or len(flat) != len(set(flat)):
            err(f'{lang}: темы должны покрывать все уроки по одному разу')
        for t in tops:
            check_tr(f'{lang} тема {t["id"]}', lang, t.get('titleTr'))

    for uid in ids:
        units = {lang: load(f'{d}/{uid}.json') for lang, d in LANGS.items()}
        if not all(units.values()):
            continue
        base = german(units['ru'])
        for lang, u in units.items():
            where = f'{lang} {uid}'
            if lang != 'ru' and german(u) != base:
                err(f'{where}: немецкий текст или структура не совпадают с русской копией')
            check_tr(f'{where} название', lang, u.get('titleTr'))
            check_tr(f'{where} вступление', lang, u.get('intro'))
            for sec in u.get('sections') or []:
                check_tr(f'{where} раздел', lang, sec.get('title'))
            gl = u.get('gloss') or {}
            wmap, lmap = gl.get('w') or {}, gl.get('l') or {}
            for lemma, e in lmap.items():
                check_tr(f'{where} словарь «{lemma}»', lang, e.get('ru'))
            for w, t in texts(u):
                check_tr(f'{where} {w}', lang, t.get('tr'))
                o = {k.lower(): v for k, v in (t.get('o') or {}).items()}
                for tok in wre.findall(t.get('de') or ''):
                    low = tok.lower()
                    key = o.get(low, low)
                    lemma = wmap.get(key)
                    if not lemma:
                        err(f'{where} {w}: у слова «{tok}» нет подсказки')
                    elif lemma not in lmap:
                        err(f'{where} {w}: «{tok}» → лемма «{lemma}», которой нет в словаре урока')
            for sid, s in (u.get('signs') or {}).items():
                if not os.path.isfile(os.path.join(BASE, s.get('src', ''))):
                    err(f'{where}: нет файла знака {s.get("src")}')
                if not FREE.search(s.get('license', '')) or not FREE.search((meta.get(sid) or {}).get('license', '')):
                    err(f'{where}: у знака {sid} нет свободной лицензии')
            for ci, sc in enumerate(u.get('scenes') or [], 1):
                if u['kind'] == 'road':
                    if sc.get('answer') not in (sc.get('options') or []):
                        err(f'{where} сцена {ci}: ответа {sc.get("answer")} нет среди вариантов')
                    if sc.get('type') == 'stop' and sc.get('reaction', 0) + sc.get('brake', 0) != sc.get('answer'):
                        err(f'{where} сцена {ci}: реакция + торможение ≠ остановочному пути')
                    continue
                if sorted(sc.get('order') or []) != sorted(c['id'] for c in sc.get('cars') or []):
                    err(f'{where} сцена {ci}: порядок — не перестановка машин')
                if sc.get('lights'):
                    k = sc.get('switchAt')
                    if not isinstance(k, int) or not 0 <= k <= len(sc['order']):
                        err(f'{where} сцена {ci}: у светофора нет верного switchAt')
                    if sorted(sc['lights']) != ['E', 'N', 'S', 'W']:
                        err(f'{where} сцена {ci}: светофор на всех четырёх подъездах')
            for q in u.get('quiz') or []:
                for sid in [q['sign']] + q['wrong']:
                    if sid not in (u.get('signs') or {}):
                        err(f'{where}: в тесте знак {sid}, которого нет в signs')

    html = read('fahrschule.html')
    for need in ('js/i18n.js', 'js/tts.js', 'js/reader-speak.js', 'js/reader-tip.js', 'js/fahrschule.js',
                 'css/lesson.css', 'css/reader.css', 'css/news.css', 'css/dialogs.css', 'css/fahrschule.css'):
        if need not in html:
            err(f'fahrschule.html: не подключён {need}')
    if 'openFahrschulePage()' not in read('index.html'):
        err('index.html: нет плитки «Автошкола»')
    sw = read('service-worker.js')
    for need in ("'/fahrschule.html'", "'/js/fahrschule.js", "'/css/fahrschule.css", "'/data/fahrschule/index.json'"):
        if need not in sw:
            err(f'service-worker.js: нет {need}')
    if 'fahrschule' not in read('js/i18n.js'):
        err('js/i18n.js: копии i18n/<lang>/fahrschule не подставляются')
    return report()


def report():
    for e in errors:
        print('ERROR:', e)
    if errors:
        print(f'\nfahrschule: ошибок {len(errors)}')
        return 1
    print('fahrschule: ok')
    return 0


if __name__ == '__main__':
    sys.exit(main())
