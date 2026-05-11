import glob

files = glob.glob('lessons/**/**/index.html', recursive=True)
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    new = html.replace('onclick="openSidebar()"', 'onclick="toggleSidebar()"')
    if new != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        patched += 1
print(f'Done: {patched} files patched.')
