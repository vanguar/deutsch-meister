#!/usr/bin/env python3
"""
build.py — сборка статей раздела «Новости на немецком».

Запуск:  python tools/news/build.py

Вход:    tools/news/articles.py  — тексты (de, ru, разметка подстрочника словами)
         tools/news/glossary.py  — словарь новостей поверх глоссариев книг
         tools/news/meta.py      — даты, источники, уровень, подписи к фото
Выход:   data/news/index.json
         data/news/<id>/meta.json, ch-01.json, glossary.json

Статья — это «книга» из одной главы: её открывает тот же ридер, что и
книги (подсказки, подстрочник, перевод, озвучка, карточки, словарь).
Абзац-фото — { "fig": { src, w, h, cap, credit } }.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

from articles import ARTICLES            # noqa: E402
from glossary import W as NEWS_W, L as NEWS_L   # noqa: E402
from meta import META, ORDER             # noqa: E402

# Та же регулярка, что WORD_RE в js/reader.js и TOKEN_RE в scripts/validate_books.py
TOKEN_RE = re.compile(r"[^\W\d_]+(?:[-'’][^\W\d_]+)*", re.UNICODE)
WORDS_PER_MIN = 110   # медленное чтение на иностранном языке


def rel(*p):
    return os.path.join(BASE, *p)


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def book_glossaries():
    """Общий словарь всех книг: первая встреченная запись побеждает."""
    w, l = {}, {}
    books = os.path.join(BASE, 'data', 'books')
    for book in sorted(os.listdir(books)):
        path = os.path.join(books, book, 'glossary.json')
        if not os.path.isfile(path):
            continue
        with open(path, encoding='utf-8') as f:
            g = json.load(f)
        for k, v in g['w'].items():
            w.setdefault(k, v)
        for k, v in g['l'].items():
            l.setdefault(k, v)
    return w, l


def lemma_of(value):
    return value['l'] if isinstance(value, dict) else value


def gloss_indices(de, spec, where):
    """Разметка словами → разметка индексами data-w."""
    tokens = TOKEN_RE.findall(de)

    def find(word, start=0):
        nth = 1
        if '#' in word:
            word, nth = word.split('#')
            nth = int(nth)
        seen = 0
        for i in range(start, len(tokens)):
            if tokens[i] == word:
                seen += 1
                if seen == nth:
                    return i
        raise SystemExit('%s: в «%s» нет слова «%s» (#%d)' % (where, de, word, nth))

    def run(words, start=0):
        """Слова подряд → индекс первого (первое вхождение всей цепочки)."""
        if '#' in words[0]:
            starts = [find(words[0])]
        else:
            starts = [i for i in range(start, len(tokens)) if tokens[i] == words[0]]
        for i in starts:
            if all(i + j < len(tokens) and tokens[i + j] == p for j, p in enumerate(words[1:], 1)):
                return i
        raise SystemExit('%s: «%s» — слова не подряд в «%s»' % (where, ' '.join(words), de))

    out = {}
    for key, ru in spec.items():
        if '+' in key:
            # «näherte+sich», «ist+zu erkennen»: перевод над первым словом,
            # дуга к ПОСЛЕДНЕМУ слову хвоста, остальные слова хвоста — без подписи
            a, b = key.split('+')
            ia = find(a)
            tail = b.split()
            ib = run(tail, ia + 1)
            last = ib + len(tail) - 1
            out['%d+%d' % (ia, last)] = ru
            for j in range(ib, last):
                out[str(j)] = ''
        elif ' ' in key:
            parts = key.split()
            ia = run(parts)
            out['%d-%d' % (ia, ia + len(parts) - 1)] = ru
        else:
            out[str(find(key))] = ru
    return out


def build_article(aid, book_w, book_l):
    meta = META[aid]
    paras = []
    forms = {}
    words = 0
    figs = 0
    for pi, para in enumerate(ARTICLES[aid]):
        if isinstance(para, tuple):
            _, fid = para
            fig = dict(meta['figs'][fid])
            fig['src'] = 'data/news/%s/img/%s.jpg' % (aid, fid)
            paras.append({'fig': fig})
            figs += 1
            continue
        sents = []
        for si, (de, ru, g) in enumerate(para):
            where = '%s [%d.%d]' % (aid, pi, si)
            sents.append({'de': de, 'ru': ru, 'g': gloss_indices(de, g, where)})
            for tok in TOKEN_RE.findall(de):
                words += 1
                k = tok.lower()
                if k in NEWS_W:
                    forms[k] = NEWS_W[k]
                elif k in book_w:
                    forms[k] = book_w[k]
                else:
                    raise SystemExit('%s: словоформы «%s» нет ни в новостях, ни в книгах' % (where, tok))
        paras.append({'s': sents})

    lemmas = {}
    for k, val in forms.items():
        lem = lemma_of(val)
        entry = NEWS_L.get(lem) or book_l.get(lem)
        if not entry:
            raise SystemExit('%s: у леммы «%s» (из «%s») нет статьи' % (aid, lem, k))
        if lem not in NEWS_L and 'В тексте' in entry.get('note', ''):
            # пояснение про конкретное место книги новостям только мешает
            entry = {k: v for k, v in entry.items() if k != 'note'}
        lemmas[lem] = entry

    out_dir = rel('data', 'news', aid)
    write_json(os.path.join(out_dir, 'ch-01.json'), {
        'id': 'ch-01', 'title': meta['title'], 'titleRu': meta['titleRu'], 'paragraphs': paras
    })
    write_json(os.path.join(out_dir, 'glossary.json'), {
        'version': 1,
        'w': dict(sorted(forms.items())),
        'l': dict(sorted(lemmas.items(), key=lambda kv: kv[0].lower()))
    })
    minutes = max(1, round(words / WORDS_PER_MIN))
    full = {
        'id': aid, 'kind': 'news',
        'title': meta['title'], 'titleRu': meta['titleRu'],
        'rubric': meta['rubric'], 'level': meta['level'], 'levelNote': meta['levelNote'],
        'published': meta['published'], 'added': meta['added'],
        'source': meta['source'], 'sourceUrl': meta['sourceUrl'],
        'blurb': meta['blurb'], 'cover': 'data/news/%s/img/cover.jpg' % aid,
        'chapters': 1, 'words': words, 'minutes': minutes, 'photos': figs,
        'license': meta['license']
    }
    write_json(os.path.join(out_dir, 'meta.json'), full)
    print('%-24s слов %4d, фото %d, лемм %3d' % (aid, words, figs, len(lemmas)))
    return {k: full[k] for k in ('id', 'title', 'titleRu', 'blurb', 'rubric', 'level',
                                 'published', 'added', 'source', 'sourceUrl', 'cover',
                                 'words', 'minutes', 'photos', 'chapters')}


def main():
    book_w, book_l = book_glossaries()
    items = [build_article(aid, book_w, book_l) for aid in ORDER]
    # Лента: свежие сверху — по дате публикации в источнике, затем по нашей
    items.sort(key=lambda it: (it['published'], it['added']), reverse=True)
    write_json(rel('data', 'news', 'index.json'), {'version': 1, 'items': items})
    print('index.json: %d статей' % len(items))


if __name__ == '__main__':
    main()
