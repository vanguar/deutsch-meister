#!/usr/bin/env python3
"""
build.py — сборка раздела «Земли Германии» (laender.html).

Запуск:  python tools/laender/build.py

Вход:    tools/laender/land_meta.py — 16 земель: название, столица, готовность,
                                     паспорт (факты с источником), тест
         tools/laender/land_texts.py — тексты земель по уровням (B1, B2): главы,
                                     предложения (de, ru, разметка подстрочника
                                     словами — как в tools/news/articles.py)
         tools/laender/land_glossary.py — новые слова поверх словаря книг и новостей
Выход:   data/laender/lands.json   — витрина: все 16 земель (неготовые — серые)
         data/laender/index.json   — готовые тексты в формате книг (для ридера
                                     и scripts/validate_books.py --laender)
         data/laender/<земля>-<b1|b2>/meta.json, ch-NN.json, glossary.json

Текст земли — «книга» из нескольких глав: его открывает тот же ридер, что и
книги (подсказки, подстрочник, перевод, озвучка, карточки, словарь).
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(os.path.dirname(HERE))
import importlib.util                                           # noqa: E402

# Сборщик новостей даёт разметку подстрочника и общий словарь книг; сам он
# подтягивает свои articles/glossary/meta — поэтому модули земель названы land_*
_spec = importlib.util.spec_from_file_location('news_build', os.path.join(BASE, 'tools', 'news', 'build.py'))
news_build = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(news_build)
news_glossary = sys.modules['glossary']                         # tools/news/glossary.py

sys.path.insert(0, HERE)
from land_glossary import W as LAND_W, L as LAND_L, W_TEXT     # noqa: E402
from land_meta import LANDS, LEVELS, SOURCES                    # noqa: E402
from land_texts import TEXTS                                    # noqa: E402

TOKEN_RE = news_build.TOKEN_RE
WORDS_PER_MIN = news_build.WORDS_PER_MIN
OUT = os.path.join(BASE, 'data', 'laender')


def fail(msg):
    raise SystemExit('laender: ' + msg)


def build_text(tid, land, level, chapters, book_w, book_l):
    """Один текст земли (bayern-b1) → папка в формате книги."""
    out_dir = os.path.join(OUT, tid)
    forms, words, figs = {}, 0, 0
    own = W_TEXT.get(tid, {})
    files = []
    # фото из land_meta (ch — номер главы) встают после первого абзаца главы
    by_ch = {}
    for fid, fig in land['figs'].items():
        if 'ch' in fig:
            by_ch.setdefault(fig['ch'], []).append(fid)
    for ci, ch in enumerate(chapters, 1):
        title, title_ru, icon, paras = ch
        if by_ch.get(ci):
            paras = paras[:1] + [('fig', fid) for fid in by_ch[ci]] + paras[1:]
        out_paras = []
        for pi, para in enumerate(paras):
            if isinstance(para, tuple):
                _, fid = para
                fig = {k: v for k, v in land['figs'][fid].items() if k != 'ch'}
                fig['src'] = 'data/laender/%s/img/%s.jpg' % (land['id'], fid)
                if not os.path.isfile(os.path.join(BASE, fig['src'])):
                    fail('%s: нет фото %s' % (tid, fig['src']))
                out_paras.append({'fig': fig})
                figs += 1
                continue
            sents = []
            for si, (de, ru, g) in enumerate(para):
                where = '%s гл.%d [%d.%d]' % (tid, ci, pi, si)
                sents.append({'de': de, 'ru': ru, 'g': news_build.gloss_indices(de, g, where)})
                for tok in TOKEN_RE.findall(de):
                    words += 1
                    k = tok.lower()
                    if k in own:
                        forms[k] = own[k]
                    elif k in LAND_W:
                        forms[k] = LAND_W[k]
                    elif k in news_glossary.W:
                        forms[k] = news_glossary.W[k]
                    elif k in book_w:
                        forms[k] = book_w[k]
                    else:
                        fail('%s: словоформы «%s» нет ни в land_glossary.py, ни в новостях, ни в книгах' % (where, tok))
            out_paras.append({'s': sents})
        files.append(('ch-%02d.json' % ci, {'id': 'ch-%02d' % ci, 'title': title, 'titleRu': title_ru,
                                            'icon': icon, 'paragraphs': out_paras}))

    lemmas = {}
    for k, val in forms.items():
        lem = news_build.lemma_of(val)
        entry = LAND_L.get(lem) or news_glossary.L.get(lem) or book_l.get(lem)
        if not entry:
            fail('%s: у леммы «%s» (из «%s») нет статьи' % (tid, lem, k))
        if lem not in LAND_L and lem not in news_glossary.L and 'В тексте' in entry.get('note', ''):
            # пояснение про конкретное место книги здесь только мешает
            entry = {kk: v for kk, v in entry.items() if kk != 'note'}
        lemmas[lem] = entry

    for name, data in files:
        news_build.write_json(os.path.join(out_dir, name), data)
    news_build.write_json(os.path.join(out_dir, 'glossary.json'), {
        'version': 1,
        'w': dict(sorted(forms.items())),
        'l': dict(sorted(lemmas.items(), key=lambda kv: kv[0].lower()))
    })
    lv = LEVELS[level]
    meta = {
        'id': tid, 'kind': 'land', 'land': land['id'],
        'title': land['name'], 'titleRu': land['nameRu'],
        'author': 'German Morning', 'level': lv['level'], 'levelNote': lv['note'],
        'year': land['checked'][:4], 'chapters': len(files), 'words': words,
        'minutes': max(1, round(words / WORDS_PER_MIN)), 'photos': figs,
        'cover': land['emoji'], 'flag': 'data/laender/flags/%s.png' % land['id'],
        'source': land['source'], 'sourceUrl': land['sourceUrl'], 'checked': land['checked'],
        'license': 'текст курса German Morning',
    }
    news_build.write_json(os.path.join(out_dir, 'meta.json'), meta)
    print('%-28s глав %d, слов %4d, лемм %3d' % (tid, len(files), words, len(lemmas)))
    return meta


def main():
    book_w, book_l = news_build.book_glossaries()
    ids = [l['id'] for l in LANDS]
    if len(ids) != 16 or len(set(ids)) != 16:
        fail('земель должно быть 16, без повторов')
    flags_meta = news_build_json(os.path.join(HERE, 'flags.json'))
    shape = news_build_json(os.path.join(OUT, 'map.json'))['lands']
    items, lands_out = [], []
    for land in LANDS:
        lid = land['id']
        if lid not in shape:
            fail('%s: нет контура на карте (python tools/laender/make_map.py)' % lid)
        if lid not in flags_meta or not os.path.isfile(os.path.join(OUT, 'flags', lid + '.png')):
            fail('%s: нет флага (python tools/laender/fetch_flags.py)' % lid)
        texts = {}
        for level in LEVELS:
            tid = '%s-%s' % (lid, level)
            if tid not in TEXTS:
                continue
            if not land.get('facts'):
                fail('%s: текст есть, а паспорта земли (facts, source) нет' % lid)
            meta = build_text(tid, land, level, TEXTS[tid], book_w, book_l)
            items.append({k: meta[k] for k in ('id', 'title', 'titleRu', 'author', 'level', 'year', 'chapters',
                                                'words', 'minutes', 'cover', 'source', 'license', 'land')})
            texts[level] = {'id': tid, 'chapters': meta['chapters'], 'words': meta['words'],
                            'minutes': meta['minutes'],
                            'toc': [{'title': c[0], 'titleRu': c[1], 'icon': c[2]} for c in TEXTS[tid]]}
        out = {'id': lid, 'name': land['name'], 'nameRu': land['nameRu'], 'capital': land['capital'],
               'emoji': land['emoji'], 'flag': 'data/laender/flags/%s.png' % lid,
               'flagSource': flags_meta[lid]['source'], 'ready': bool(texts)}
        if texts:
            for k in ('blurb', 'facts', 'source', 'sourceUrl', 'checked'):
                out[k] = land[k]
            quiz = land.get('quiz') or []
            for qi, q in enumerate(quiz, 1):
                if not (2 <= len(q['opts']) <= 4 and 0 <= q['a'] < len(q['opts'])):
                    fail('%s тест %d: 2–4 варианта и номер верного' % (lid, qi))
                if not q.get('why'):
                    fail('%s тест %d: нет пояснения why' % (lid, qi))
            if len(quiz) < 4:
                fail('%s: в тесте меньше 4 вопросов' % lid)
            out['quiz'] = quiz
            out['texts'] = texts
        lands_out.append(out)
    for tid in TEXTS:
        if tid.rsplit('-', 1)[0] not in ids or tid.rsplit('-', 1)[1] not in LEVELS:
            fail('текст %s: нет такой земли или уровня (b1, b2)' % tid)
    # лишние папки текстов, которых больше нет в texts.py
    keep = {it['id'] for it in items}
    for name in os.listdir(OUT):
        p = os.path.join(OUT, name)
        if os.path.isdir(p) and name not in keep and name not in ('flags',) and not name.startswith('img'):
            if os.path.isfile(os.path.join(p, 'meta.json')):
                fail('папка %s без текста в land_texts.py — удалите её' % name)
    news_build.write_json(os.path.join(OUT, 'index.json'), {'version': 1, 'items': items})
    news_build.write_json(os.path.join(OUT, 'lands.json'), {
        'version': 1, 'levels': {k: {'level': v['level'], 'label': v['label']} for k, v in LEVELS.items()},
        'sources': SOURCES, 'lands': lands_out})
    print('lands.json: земель %d, готовы: %s' % (len(lands_out), ', '.join(l['id'] for l in lands_out if l['ready']) or '—'))


def news_build_json(path):
    import json
    with open(path, encoding='utf-8') as f:
        return json.load(f)


if __name__ == '__main__':
    main()
