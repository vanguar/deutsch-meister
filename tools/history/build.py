"""Build one sourced history chapter and its translation memories (stdlib only)."""
from pathlib import Path
import argparse
import copy
import json
import re

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
CYR = re.compile('[А-Яа-яЁё]')
TOKEN = re.compile(r"[^\W\d_]+(?:[-'’][^\W\d_]+)*", re.UNICODE)

def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))

def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def strings(value):
    if isinstance(value,str):
        if CYR.search(value): yield value
    elif isinstance(value,list):
        for item in value: yield from strings(item)
    elif isinstance(value,dict):
        for item in value.values(): yield from strings(item)

def pool():
    words, lemmas = {}, {}
    memories = {'uk':{},'ar':{}}
    for lang in memories:
        for file in sorted((ROOT/f'i18n/{lang}/src').rglob('*.json')):
            if 'overrides' not in file.parts:
                memories[lang].update(read(file))
    for section in ('laender','books','news'):
        for file in sorted((ROOT/f'data/{section}').glob('*/glossary.json')):
            data=read(file)
            localized={lang:read(ROOT/f'i18n/{lang}/{section}/{file.parent.name}/glossary.json')
                       for lang in memories if (ROOT/f'i18n/{lang}/{section}/{file.parent.name}/glossary.json').exists()}
            for form,ref in data['w'].items():
                if form in words: continue
                lemma=ref if isinstance(ref,str) else ref['l']
                words[form]=ref
                lemmas[lemma]=data['l'][lemma]
            for lemma,info in data['l'].items():
                for lang,translated in localized.items():
                    translated_info=translated.get('l',{}).get(lemma,{})
                    for field,value in info.items():
                        other=translated_info.get(field)
                        if isinstance(value,str) and CYR.search(value) and isinstance(other,str) and not CYR.search(other):
                            memories[lang].setdefault(value,other)
    custom=read(HERE/'lexicon.json')
    words.update(custom['w']); lemmas.update(custom['l'])
    for lang in memories: memories[lang].update(custom.get('translations',{}).get(lang,{}))
    return words,lemmas,memories

def build(chapter_id):
    definition=read(HERE/f'content/{chapter_id}.json')
    catalog=read(ROOT/'data/history/index.json')
    entry=next(c for c in catalog['chapters'] if c['id']==chapter_id)
    number=catalog['chapters'].index(entry)+1
    words,lemmas,memories=pool()
    chapter={'id':'ch-01','title':entry['title'],'titleRu':entry['titleRu'],'icon':str(number),
             'paragraphs':[], 'sourceTitle':'Источники и проверка фактов',
             'sources':definition['sources'],'checked':'2026-11-17'}
    for para in definition['paragraphs']:
        if 'fig' in para:
            chapter['paragraphs'].append(copy.deepcopy(para)); continue
        out={'sourceIds':para['sourceIds'],'s':[]}
        for sentence in para['sentences']:
            de,ru,uk,ar=sentence[:4]
            item={'de':de,'ru':ru}
            if len(sentence)>4: item['g']=sentence[4]
            out['s'].append(item)
            memories['uk'][ru]=uk; memories['ar'][ru]=ar
        chapter['paragraphs'].append(out)
    tokens=[t.lower() for para in chapter['paragraphs'] for sent in para.get('s',[]) for t in TOKEN.findall(sent['de'])]
    missing=sorted(set(tokens)-set(words))
    if missing:
        print('MISSING_WORDS '+json.dumps(missing,ensure_ascii=False)); return False
    forms={t:words[t] for t in sorted(set(tokens))}
    used={ref if isinstance(ref,str) else ref['l'] for ref in forms.values()}
    glossary={'version':1,'w':forms,'l':{lemma:lemmas[lemma] for lemma in sorted(used)}}
    meta={'id':chapter_id,'kind':'history','title':entry['title'],'titleRu':entry['titleRu'],
          'author':'German Morning','level':'B1','year':'2026','chapters':1,
          'words':len(tokens),'minutes':max(3,round(len(tokens)/45)), 'cover':str(number),'number':number,
          'source':definition.get('source',' / '.join(dict.fromkeys(s['name'].split(' · ')[0] for s in definition['sources']))),
          'sourceUrl':definition['sources'][0]['url'],'checked':'2026-11-17',
          'license':'Авторская учебная адаптация German Morning; ссылки на материалы — в главе.'}
    for name,data in (('ch-01.json',chapter),('glossary.json',glossary),('meta.json',meta)):
        write(ROOT/f'data/history/{chapter_id}/{name}',data)
    all_keys=set(strings([chapter,glossary,meta]))
    good=True
    for lang in memories:
        own=definition.get('translations',{}).get(lang,{})
        effective={**memories[lang],**own}
        # Lemma references are structural and must remain identical in w/l.
        for ref in forms.values():
            lemma=ref if isinstance(ref,str) else ref['l']
            if CYR.search(lemma): effective.setdefault(lemma,lemma)
        absent=sorted(k for k in all_keys if k not in effective)
        if absent:
            print('MISSING_TRANSLATIONS '+lang+' '+json.dumps(absent,ensure_ascii=False)); good=False
        write(ROOT/f'i18n/{lang}/src/overrides/history/{chapter_id}.json',
              {k:effective[k] for k in sorted(all_keys) if k in effective})
    if not good: return False
    entry['ready']=True
    by_id={item['id']:item for item in catalog.get('items',[])}
    by_id[chapter_id]=meta
    catalog['items']=[by_id[c['id']] for c in catalog['chapters'] if c['ready']]
    write(ROOT/'data/history/index.json',catalog)
    print(f'BUILT {number:02d} {chapter_id}: {len(tokens)} words, {len(forms)} forms, {len(used)} lemmas; ru/uk/ar')
    return True

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('chapter_id')
    args=parser.parse_args()
    raise SystemExit(0 if build(args.chapter_id) else 1)
