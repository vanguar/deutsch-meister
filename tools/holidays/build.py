"""Build the holiday catalog and localized texts consumed by the shared reader."""
import argparse
from datetime import date
import json
from pathlib import Path
import re
import sys

from content import EVENTS

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE.parent / 'history'))
from build import CYR, TOKEN, pool


LANGUAGES = ('ru', 'uk', 'ar')
SOURCE_TITLES = ('Источники и проверка фактов', 'Джерела і перевірка фактів', 'المصادر والتحقق من المعلومات')
LICENSES = ('Авторская учебная адаптация German Morning.',
            'Авторська навчальна адаптація German Morning.',
            'نص تعليمي من إعداد German Morning.')
CHECKED = '2026-11-18'


def vocabulary():
    words, lemmas, translations = pool()
    for line in (HERE / 'vocabulary.txt').read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):
            continue
        lemma, forms, pos, ru, uk, ar, *metadata = line.split('|')
        if pos:
            info = {'ru': ru, 'pos': pos}
            if metadata and metadata[0]:
                info['forms' if pos == 'гл.' else 'art'] = metadata[0]
            if len(metadata) > 1:
                info['pl'] = metadata[1] or None
            lemmas[lemma] = info
            translations['uk'][ru] = uk
            translations['ar'][ru] = ar
        if lemma not in lemmas:
            raise ValueError(f'Unknown glossary lemma: {lemma}')
        for form in forms.split(','):
            if form:
                words[form] = lemma
        if not pos and ru:
            translations['uk'][ru] = uk
            translations['ar'][ru] = ar
    return words, lemmas, translations


def date_rule(rule):
    if isinstance(rule[0], int):
        month, day = rule
        date(2025, month, day)  # A fixed annual date must exist in ordinary years.
        return {'type': 'fixed', 'month': month, 'day': day}
    if rule[0] == 'easter':
        return {'type': 'easter', 'offset': rule[1]}
    if rule == ('repentance',):
        return {'type': 'repentance'}
    raise ValueError(f'Unknown holiday date rule: {rule}')


def translated_fields(info, language, translations):
    if language == 'ru':
        return info
    memory = translations[language]
    return {field: memory[value] if isinstance(value, str) and CYR.search(value) else value
            for field, value in info.items()}


def artifacts():
    words, lemmas, translations = vocabulary()
    catalogs = {lang: {'version': 1, 'items': []} for lang in LANGUAGES}
    outputs = {}
    missing = set()
    translation_errors = set()
    seen = set()
    for slug, rule, titles, regions, references, blocks in EVENTS:
        item_id = 'holiday-' + slug  # Reader progress is keyed by ID across catalogs.
        if not re.fullmatch(r'[a-z0-9-]+', item_id) or item_id in seen:
            raise ValueError(f'Invalid or duplicate holiday ID: {item_id}')
        seen.add(item_id)
        title, *local_titles = titles.split('|')
        locations = regions.split('|')
        if len(local_titles) != len(LANGUAGES) or len(locations) != len(LANGUAGES):
            raise ValueError(f'Missing title or region: {item_id}')
        sources = [dict(zip(('id', 'name', 'url'), reference)) for reference in references]
        source_ids = {source['id'] for source in sources}
        if len(source_ids) != len(sources) or any(not source['url'].startswith('https://') for source in sources):
            raise ValueError(f'Invalid sources: {item_id}')
        paragraphs = [(ids.split(','), [row.split('|') for row in text.splitlines()]) for ids, text in blocks]
        for ids, sentences in paragraphs:
            if not set(ids) <= source_ids or any(len(row) != 4 or not all(row) for row in sentences):
                raise ValueError(f'Invalid paragraph: {item_id}')
        tokens = [word.lower() for _, sentences in paragraphs for row in sentences for word in TOKEN.findall(row[0])]
        missing.update(set(tokens) - words.keys())
        forms = {word: words[word] for word in sorted(set(tokens)) if word in words}
        used = sorted({ref if isinstance(ref, str) else ref['l'] for ref in forms.values()})

        for index, language in enumerate(LANGUAGES):
            prefix = ROOT / ('data' if language == 'ru' else f'i18n/{language}') / 'holidays'
            item = {
                'id': item_id, 'kind': 'holiday', 'rule': date_rule(rule), 'title': title,
                'titleRu': local_titles[index], 'region': locations[index], 'cover': '✦',
                'author': 'German Morning', 'level': 'B1', 'year': CHECKED[:4],
                'chapters': 1, 'words': len(tokens), 'minutes': max(1, round(len(tokens) / 45)),
                'source': sources[0]['name'], 'sourceUrl': sources[0]['url'],
                'license': LICENSES[index], 'checked': CHECKED,
            }
            catalogs[language]['items'].append(item)
            chapter = {
                'id': 'ch-01', 'title': title, 'titleRu': local_titles[index],
                'paragraphs': [{'sourceIds': ids, 's': [{'de': row[0], 'ru': row[index + 1]} for row in sentences]}
                               for ids, sentences in paragraphs],
                'sourceTitle': SOURCE_TITLES[index], 'sources': sources, 'checked': CHECKED,
            }
            glossary = {}
            for lemma in used:
                try:
                    glossary[lemma] = translated_fields(lemmas[lemma], language, translations)
                except KeyError as error:
                    translation_errors.add((language, lemma, error.args[0]))
            outputs[prefix / item_id / 'meta.json'] = item
            outputs[prefix / item_id / 'ch-01.json'] = chapter
            outputs[prefix / item_id / 'glossary.json'] = {'version': 1, 'w': forms, 'l': glossary}
            outputs[prefix / 'index.json'] = catalogs[language]

    if missing or translation_errors:
        raise ValueError(f'Missing forms: {sorted(missing)}\nMissing translations: {sorted(translation_errors)}')
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='verify the committed reader data')
    args = parser.parse_args()
    outputs = artifacts()
    for path, data in outputs.items():
        text = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
        if args.check:
            if not path.exists() or path.read_text(encoding='utf-8') != text:
                raise SystemExit(f'Outdated holiday data: {path.relative_to(ROOT)}')
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding='utf-8', newline='\n')
    print(f'{len(EVENTS)} holidays in Russian, Ukrainian and Arabic ({len(outputs)} files)')


if __name__ == '__main__':
    main()
