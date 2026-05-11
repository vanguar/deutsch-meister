import glob, re

files = glob.glob('lessons/a1/**/index.html', recursive=True)
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    new = re.sub(
        r'src="../../../data/a1-lesson-(\d+)\.js"',
        r'src="../../../data/a1/a1-lesson-\1.js"',
        html
    )
    if new != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        patched += 1
        print(f'patched: {path}')
print(f'Done: {patched} files.')
