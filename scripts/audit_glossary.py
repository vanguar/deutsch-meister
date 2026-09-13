#!/usr/bin/env python3
"""
audit_glossary.py — ручной аудит глоссария книги.

Запуск:  python scripts/audit_glossary.py bremer

В отличие от scripts/validate_books.py этот скрипт НИЧЕГО не чинит и не
валит сборку. Он вытаскивает из текста контекст и показывает места, где
словарная карточка может врать, а машинная проверка этого не увидит:

  1. дательный с -e — с фактическим предложением (nach/zu Hause = норма);
  2. субстантивированные прилагательные (нужен decl, не art/pl);
  3. слабое склонение (n-Deklination) у существительных м. р.;
  4. компаративы/суперлативы, выделенные в отдельную лемму;
  5. многозначные существительные — контекст для выбора рода и мн. ч.;
  6. существительные без множественного числа;
  7. нерегулярное множественное (-leute, -männer, Worte/Wörter);
  8. три формы глагола + вспомогательный sein/haben;
  9. отделяемые приставки, оторванные от глагола в тексте;
 10. возвратное sich — к какому глаголу оно относится в каждом месте;
 11. пометы old, привязанные к словоформе, и их контекст.

Решения по итогам аудита фиксируются в REVIEW_GLOSSARY.md.
"""

import argparse
import json
import os
import re
import sys
import collections

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TOKEN_RE = re.compile("[A-Za-zÄäÖöÜüßÉé]+"
                      "(?:['’][A-Za-zÄäÖöÜüß]+)*")

# ── справочные списки для проверок ────────────────────────────────────

# Формы с «дательным -e», которые надо посмотреть глазами.
DATIVE_E = ['hause', 'wege', 'miste', 'dache', 'tage', 'weibe', 'kinde',
            'lande', 'jahre', 'buche', 'grunde']

# Устойчивые сочетания, где -e — ЖИВАЯ современная норма, а не архаизм.
DATIVE_E_OK = ['nach hause', 'zu hause', 'im grunde', 'zu tage', 'auf dem lande',
               'im jahre', 'zu buche']

# Существительные м. р. слабого склонения (n-Deklination).
# Суффикс засчитываем только если перед ним осталось ещё хотя бы 3 буквы,
# иначе Mist ловится на «ist», а Rat — на «at».
WEAK_SUFFIXES = ('ant', 'ent', 'ist', 'oge', 'graf', 'nom', 'arch')
WEAK_KNOWN = {'Herr', 'Mensch', 'Bauer', 'Nachbar', 'Held', 'Fürst', 'Graf',
              'Hirt', 'Prinz', 'Narr', 'Bär', 'Löwe', 'Hase', 'Affe', 'Junge',
              'Knabe', 'Riese', 'Zeuge', 'Geselle', 'Bote', 'Erbe', 'Neffe'}

# Неправильные и «ловушечные» множественные.
PLURAL_TRAPS = {
    'Spielmann': 'die Spielleute (НЕ Spielmänner)',
    'Hauptmann': 'die Hauptleute (НЕ Hauptmänner)',
    'Kaufmann': 'die Kaufleute',
    'Seemann': 'die Seeleute',
    'Mann': 'die Männer',
    'Wort': 'die Worte (связная речь) / die Wörter (отдельные слова)',
    'Bank': 'die Bänke (скамья) / die Banken (банк)',
    'Band': 'die Bänder (лента) / die Bände (том) / die Banden (шайка)',
}

# Существительные, у которых множественного числа фактически нет.
NO_PLURAL = {'Mist', 'Tod', 'Glück', 'Hunger', 'Durst', 'Mut', 'Lärm', 'Lärmen',
             'Fleisch', 'Furcht', 'Geschrei', 'Erbarmen', 'Schlaf', 'Futter',
             'Musik', 'Mark', 'Regenwetter', 'Nachtmusik', 'Obst', 'Milch',
             # решено по Duden: у Asche мн. ч. только техническое,
             # у Wetter — только в значении «непогода»
             'Asche', 'Wetter'}

# Многозначные: род и/или мн. ч. зависят от значения — нужен контекст.
AMBIGUOUS = {
    'Licht': 'die Lichter (огни, свечи) / die Lichte (техн.)',
    'Rat': 'die Ratschläge (совет-рекомендация) / die Räte (совет-орган)',
    'Tor': 'das Tor — ворота / der Tor — глупец (устар.)',
    'Mark': 'das Mark — костный мозг / die Mark — марка, граница',
    'Schloss': 'die Schlösser — замок(оба значения)',
    'Gericht': 'die Gerichte — суд / блюдо',
    'Bank': 'die Bänke / die Banken',
    'Band': 'die Bänder / die Bände / die Banden',
    'Messer': 'das Messer — нож / der Messer — измеритель',
    'See': 'der See — озеро / die See — море',
}

# Компаративы/суперлативы, которые нельзя держать отдельной леммой.
DEGREE_FORMS = {
    'besser': 'gut', 'best': 'gut', 'bestes': 'gut', 'besseres': 'gut',
    'lieber': 'gern', 'liebsten': 'gern',
    # 'mehr' сознательно НЕ сворачиваем в 'viel': в книге это
    # отрицательная частица «больше не» (nicht/kein … mehr),
    # связь с viel там этимологическая, а не смысловая.
    'älter': 'alt', 'ältesten': 'alt',
    'größer': 'groß', 'größte': 'groß', 'größter': 'groß', 'größten': 'groß',
    'höher': 'hoch', 'näher': 'nah', 'eher': 'bald',
    'weiter': 'weit', 'weitem': 'weit',
    'heller': 'hell', 'schwächer': 'schwach', 'sichersten': 'sicher',
}

# Глаголы движения и смены состояния — перфект с sein.
EXPECT_SEIN = {
    'gehen', 'kommen', 'laufen', 'rennen', 'vorbeirennen', 'springen',
    'aufspringen', 'klettern', 'fliegen', 'fliehen', 'fahren', 'reisen',
    'steigen', 'fallen', 'sinken', 'wachsen', 'sterben', 'werden',
    'bleiben', 'geschehen', 'passieren', 'einschlafen', 'aufwachen',
    'erschrecken', 'stürzen', 'ziehen', 'fortgehen', 'hingehen',
    'fortkommen', 'schwimmen', 'begegnen', 'folgen', 'gelingen', 'sein',
}

# Глаголы с ДВУМЯ спряжениями (перех./неперех.) — проверить по контексту.
SPLIT_VERBS = {
    'erschrecken': 'неперех. erschrak · ist erschrocken (испугался) / '
                   'перех. erschreckte · hat erschreckt (испугал)',
    'hängen': 'неперех. hing · hat gehangen / перех. hängte · hat gehängt',
    'schaffen': 'создавать schuf · hat geschaffen / '
                'справляться, убирать schaffte · hat geschafft',
    'bewegen': 'двигать bewegte · hat bewegt / побуждать bewog · hat bewogen',
    'senden': 'посылать sandte/sendete / транслировать sendete',
    'wenden': 'поворачивать wandte/wendete',
    'ziehen': 'тянуть hat gezogen / двигаться ist gezogen',
    'schwimmen': 'ist (движение) / hat (как занятие)',
}

# Сильные глаголы, три формы которых чаще всего путают.
STRONG_CHECK = [
    'ziehen', 'treten', 'laufen', 'tragen', 'fangen', 'springen', 'schreien',
    'stoßen', 'sitzen', 'setzen', 'liegen', 'legen', 'fallen', 'fällen',
    'schlagen', 'werfen', 'brechen', 'sprechen', 'sehen', 'finden', 'stehen',
    'nehmen', 'geben', 'reißen', 'stechen', 'speien', 'kriechen', 'fliehen',
    'beißen', 'essen', 'trinken', 'waschen', 'halten', 'heißen', 'lassen',
    'schlafen', 'spinnen', 'bleiben', 'brennen', 'bringen', 'denken', 'wissen',
]

# Отделяемые глаголы этой книги: (базовая лемма, приставка) → цельный глагол.
# Список ручной: перебирать все предлоги подряд бесполезно — в немецком
# приставка омонимична предлогу, и автоматика даёт сплошной шум.
SEPARABLE_PAIRS = {
    ('gehen', 'mit'): 'mitgehen',
    ('gehen', 'fort'): 'fortgehen',
    ('laufen', 'fort'): 'fortlaufen',
    ('laufen', 'zurück'): 'zurücklaufen',
    ('ziehen', 'fort'): 'fortziehen',
    ('springen', 'auf'): 'aufspringen',
    ('löschen', 'aus'): 'auslöschen',
    ('sehen', 'um'): 'sich umsehen',
    ('anfangen', 'an'): 'anfangen',
    ('nehmen', 'vorlieb'): 'vorliebnehmen',
    ('kommen', 'vorbei'): 'vorbeikommen',
    ('fliegen', 'hinauf'): 'hinauffliegen',
    ('stürzen', 'hinein'): 'hineinstürzen',
    ('rufen', 'herab'): 'herabrufen',
    ('wollen', 'hinaus'): 'hinauswollen',
    ('wollen', 'heraus'): 'herauswollen',
    ('können', 'fort'): 'fortkönnen',
}


def lemma_of(value, default=None):
    """Значение glossary.w — строка-лемма или объект {l, old}."""
    if isinstance(value, dict):
        return value.get('l', default)
    if isinstance(value, str):
        return value
    return default


def form_old(value):
    """Помета «устар.», привязанная к самой словоформе (или None)."""
    return value.get('old') if isinstance(value, dict) else None


def lookup(w, form, default=None):
    return lemma_of(w.get(form), default)


def forms_of(w, lemma):
    """Все словоформы, ведущие на эту лемму."""
    return sorted(f for f, v in w.items() if lemma_of(v) == lemma)


def read_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def load_sentences(book_dir):
    """→ [(ch_id, p, s, de), ...]"""
    out = []
    for fname in sorted(os.listdir(book_dir)):
        if not re.match(r'^ch-\d+\.json$', fname):
            continue
        doc = read_json(os.path.join(book_dir, fname))
        for pi, par in enumerate(doc.get('paragraphs') or []):
            for si, sent in enumerate(par.get('s') or []):
                out.append((doc['id'], pi, si, sent.get('de') or ''))
    return out


def sentences_with(sentences, form):
    """Все предложения, где встречается словоформа form (целым токеном)."""
    hits = []
    for ch, pi, si, de in sentences:
        if form in [t.lower() for t in TOKEN_RE.findall(de)]:
            hits.append((ch, pi, si, de))
    return hits


def short(de, form, width=90):
    """Вырезать окно вокруг словоформы."""
    m = re.search(r'\b' + re.escape(form) + r'\b', de, re.I)
    if not m:
        return de[:width]
    a = max(0, m.start() - width // 2)
    b = min(len(de), m.end() + width // 2)
    return ('…' if a else '') + de[a:b] + ('…' if b < len(de) else '')


# ══════════════════════════════════════════════════════
#  Проверки
# ══════════════════════════════════════════════════════

def section(title):
    print('\n' + '═' * 78)
    print(title)
    print('═' * 78)


def check_dative_e(sentences, w, l):
    section('1. ДАТЕЛЬНЫЙ С -e — контекст для каждой формы')
    found = False
    for form in DATIVE_E:
        hits = sentences_with(sentences, form)
        if not hits:
            continue
        found = True
        lemma = lookup(w, form, '—')
        # Помета может сидеть и на словоформе, и на лемме — показываем где.
        on_form = bool(form_old(w.get(form)))
        on_lemma = bool((l.get(lemma) or {}).get('old'))
        where = 'на словоформе' if on_form else ('на лемме' if on_lemma else 'нет')
        print('\n  форма "%s"  →  лемма %s   [old: %s]' % (form, lemma, where))
        for ch, pi, si, de in hits:
            ctx = short(de, form)
            norm = [p for p in DATIVE_E_OK if p in de.lower()]
            flag = '  ← СОВРЕМЕННАЯ НОРМА (%s), помету снять' % norm[0] if norm else ''
            print('    %s[%d.%d] %s%s' % (ch, pi, si, ctx, flag))
    if not found:
        print('  форм с дательным -e не найдено')


def check_subst_adj(l):
    section('2. СУБСТАНТИВИРОВАННЫЕ ПРИЛАГАТЕЛЬНЫЕ')
    suspects = []
    for lemma, c in sorted(l.items()):
        if c.get('pos') == 'субст. прил.':
            ok = bool((c.get('decl') or '').strip())
            print('  %-22s pos=субст. прил.  decl=%s  art/pl=%s' %
                  (lemma, 'есть' if ok else 'НЕТ ← ошибка',
                   'есть ← лишнее' if ('art' in c or 'pl' in c) else 'нет ✓'))
        elif c.get('pos') == 'сущ.' and re.search(r'(te|ge|ne|de|le|re|ke|se)$', lemma) \
                and (c.get('pl') or '').endswith('en'):
            suspects.append(lemma)
    if suspects:
        print('\n  Кандидаты в субстантивированные (pos=сущ., мн. ч. на -en):')
        for s in suspects:
            print('    %-22s %s · %s' % (s, l[s].get('art'), l[s].get('pl')))


def check_weak_nouns(l):
    section('3. СЛАБОЕ СКЛОНЕНИЕ (n-Deklination) у сущ. м. р.')
    for lemma, c in sorted(l.items()):
        if c.get('pos') != 'сущ.' or c.get('art') != 'der':
            continue
        base = lemma.split()[0]
        by_suffix = any(base.endswith(s) and len(base) >= len(s) + 3
                        for s in WEAK_SUFFIXES)
        if not (base in WEAK_KNOWN or by_suffix):
            continue
        has = bool((c.get('decl') or '').strip())
        print('  %-22s %s · %s   decl: %s' %
              (lemma, c.get('art'), c.get('pl'),
               c.get('decl') if has else 'НЕТ ← карточка врёт в косв. падежах'))


def check_degrees(w, l):
    section('4. КОМПАРАТИВЫ / СУПЕРЛАТИВЫ')
    for form, base in sorted(DEGREE_FORMS.items()):
        if form not in w:
            continue
        lemma = lookup(w, form)
        if lemma == form:
            print('  "%s" → лемма "%s"  ← ОТДЕЛЬНАЯ ЛЕММА, должно быть "%s"'
                  % (form, lemma, base))
        elif lemma != base:
            print('  "%s" → лемма "%s"  (ожидалось "%s")' % (form, lemma, base))
        else:
            forms = (l.get(lemma) or {}).get('forms')
            print('  "%s" → "%s" ✓   степени: %s'
                  % (form, lemma, forms or 'НЕ УКАЗАНЫ ← добавить'))


def check_ambiguous(sentences, w, l):
    section('5. МНОГОЗНАЧНЫЕ СУЩЕСТВИТЕЛЬНЫЕ — контекст')
    for lemma, note in sorted(AMBIGUOUS.items()):
        if lemma not in l:
            continue
        c = l[lemma]
        print('\n  %s — сейчас: %s · %s' % (lemma, c.get('art'), c.get('pl')))
        print('    варианты: %s' % note)
        forms = forms_of(w, lemma)
        for f in sorted(forms):
            for ch, pi, si, de in sentences_with(sentences, f):
                print('    %s[%d.%d] %s' % (ch, pi, si, short(de, f)))


def check_no_plural(l):
    section('6. СУЩЕСТВИТЕЛЬНЫЕ БЕЗ МНОЖЕСТВЕННОГО')
    for lemma, c in sorted(l.items()):
        if c.get('pos') != 'сущ.':
            continue
        pl = c.get('pl')
        if lemma in NO_PLURAL:
            ok = pl is None
            print('  %-22s pl=%-28r %s' % (lemma, pl,
                  '✓ null' if ok else '← должно быть null'))
        elif pl is None:
            print('  %-22s pl=null (нет в списке NO_PLURAL — проверить)' % lemma)


def check_plural_traps(l):
    section('7. НЕРЕГУЛЯРНОЕ МНОЖЕСТВЕННОЕ')
    for lemma, expect in sorted(PLURAL_TRAPS.items()):
        if lemma not in l:
            continue
        pl = l[lemma].get('pl')
        ok = pl is not None and pl.split(' (')[0] in expect
        print('  %-22s pl=%-26s %s' % (lemma, repr(pl), '✓' if ok else '← ожидалось: ' + expect))


def check_verbs(sentences, w, l):
    section('8. ГЛАГОЛЫ — три формы и вспомогательный глагол')

    print('\n  ── Глаголы с двумя спряжениями (нужен контекст) ──')
    for lemma, note in sorted(SPLIT_VERBS.items()):
        if lemma not in l:
            continue
        print('\n  %s — сейчас: %s' % (lemma, l[lemma].get('forms')))
        print('    вилка: %s' % note)
        for f in forms_of(w, lemma):
            for ch, pi, si, de in sentences_with(sentences, f):
                print('    %s[%d.%d] %s' % (ch, pi, si, short(de, f)))

    print('\n  ── Вспомогательный глагол (движение / смена состояния → ist) ──')
    for lemma, c in sorted(l.items()):
        if c.get('pos') != 'гл.':
            continue
        forms = c.get('forms') or ''
        has_ist = ' ist ' in forms
        want_ist = lemma in EXPECT_SEIN
        if want_ist and not has_ist:
            print('  %-22s %-44s ← ожидался ist' % (lemma, forms))
        elif has_ist and not want_ist:
            print('  %-22s %-44s ← ist, но нет в списке движения — проверить'
                  % (lemma, forms))

    print('\n  ── Сильные глаголы из списка контроля ──')
    for lemma in STRONG_CHECK:
        if lemma in l:
            print('  %-22s %s' % (lemma, l[lemma].get('forms')))

    print('\n  ── Полный список глаголов ──')
    for lemma, c in sorted(l.items(), key=lambda kv: kv[0].lower()):
        if c.get('pos') == 'гл.':
            print('  %-22s %s' % (lemma, c.get('forms')))


def check_separable(sentences, w, l):
    section('9. ОТДЕЛЯЕМЫЕ ПРИСТАВКИ, ОТОРВАННЫЕ ОТ ГЛАГОЛА')
    print('  Для каждой пары (базовый глагол + приставка) из SEPARABLE_PAIRS')
    print('  показано, куда ведёт КАЖДЫЙ из двух токенов.')
    print('  ВНИМАНИЕ: срабатывания требуют ручной проверки. Если в одном')
    print('  предложении два глагола и одна приставка, скрипт покажет обе')
    print('  комбинации — какая настоящая, решает человек.\n')
    verb_lemmas = {lm for lm, c in l.items() if c.get('pos') == 'гл.'}
    hits = 0
    for ch, pi, si, de in sentences:
        toks = [t.lower() for t in TOKEN_RE.findall(de)]
        tokset = set(toks)
        for (base, pref), whole in sorted(SEPARABLE_PAIRS.items()):
            if pref not in tokset:
                continue
            verb_toks = [t for t in toks if lookup(w, t) == base]
            if not verb_toks:
                continue
            hits += 1
            pref_lemma = lookup(w, pref, '—')
            pref_pos = (l.get(pref_lemma) or {}).get('pos', '—')
            print('  %s[%d.%d] %s' % (ch, pi, si, de[:145]))
            print('      цельный глагол: %s' % whole)
            print('      глагол    "%-9s" → %-22s (%s)'
                  % (verb_toks[0], base, (l.get(base) or {}).get('forms', '')))
            mark = 'ведёт на глагол ✓' if pref_pos == 'гл.' \
                else 'НЕ глагол — омоним приставки и предлога/наречия'
            print('      приставка "%-9s" → %-22s (%s) — %s'
                  % (pref, pref_lemma, pref_pos, mark))
            note = (l.get(base) or {}).get('ru', '')
            print('      упомянут ли %s в карточке базового глагола: %s\n'
                  % (whole, 'да' if whole in note else 'НЕТ ← добавить в ru'))
    if not hits:
        print('  отделяемых приставок не найдено')
    else:
        print('  Всего случаев: %d' % hits)


def check_reflexive(sentences, w, l):
    section('10. ВОЗВРАТНОЕ sich — к какому глаголу относится')
    target = lookup(w, 'sich', '—')
    print('  Токен "sich" ведёт на лемму: %s (%s)\n'
          % (target, (l.get(target) or {}).get('pos', '—')))
    verb_lemmas = {lm for lm, c in l.items() if c.get('pos') == 'гл.'}
    refl_lemmas = {lm for lm in verb_lemmas if lm.startswith('sich ')}
    print('  Возвратные леммы в глоссарии: %s\n'
          % (', '.join(sorted(refl_lemmas)) or '—'))
    for ch, pi, si, de in sentences:
        toks = [t.lower() for t in TOKEN_RE.findall(de)]
        if 'sich' not in toks:
            continue
        verbs = sorted({lookup(w, t) for t in toks if lookup(w, t) in verb_lemmas})
        print('  %s[%d.%d] %s' % (ch, pi, si, short(de, 'sich', 110)))
        print('      глаголы рядом: %s' % ', '.join(verbs))



def check_form_old(sentences, w, l):
    section('11. ПОМЕТА old НА СЛОВОФОРМЕ (а не на лемме)')
    print('  Помета на словоформе значит: устарела именно эта форма или оборот,')
    print('  а само слово современное (im Hause архаично — Haus нет).\n')
    any_form = False
    for form in sorted(w):
        old = form_old(w[form])
        if not old:
            continue
        any_form = True
        lemma = lemma_of(w[form])
        clash = (l.get(lemma) or {}).get('old')
        print('  "%s" → %s' % (form, lemma))
        print('      %s' % old)
        if clash:
            print('      ← ВНИМАНИЕ: у леммы "%s" тоже есть old — дубль в тултипе'
                  % lemma)
        for ch, pi, si, de in sentences_with(sentences, form):
            print('      %s[%d.%d] %s' % (ch, pi, si, short(de, form)))
    if not any_form:
        print('  помет на словоформах нет')

    print('\n  ── Пометы, оставшиеся на леммах ──')
    for lemma in sorted((k for k, c in l.items() if c.get('old')), key=str.lower):
        print('  %-20s %s' % (lemma, l[lemma]['old']))


def main():
    ap = argparse.ArgumentParser(description='Аудит глоссария книги')
    ap.add_argument('book_id', nargs='?', default='bremer')
    args = ap.parse_args()

    book_dir = os.path.join(BASE, 'data', 'books', args.book_id)
    if not os.path.isdir(book_dir):
        print('нет папки ' + book_dir, file=sys.stderr)
        return 2

    gl = read_json(os.path.join(book_dir, 'glossary.json'))
    w, l = gl['w'], gl['l']
    sentences = load_sentences(book_dir)

    print('Аудит книги "%s": предложений %d, словоформ %d, лемм %d'
          % (args.book_id, len(sentences), len(w), len(l)))

    check_dative_e(sentences, w, l)
    check_subst_adj(l)
    check_weak_nouns(l)
    check_degrees(w, l)
    check_ambiguous(sentences, w, l)
    check_no_plural(l)
    check_plural_traps(l)
    check_verbs(sentences, w, l)
    check_separable(sentences, w, l)
    check_reflexive(sentences, w, l)
    check_form_old(sentences, w, l)
    return 0


if __name__ == '__main__':
    sys.exit(main())
