import glob

SDK = '  <script src="https://telegram.org/js/telegram-web-app.js"></script>\n'
files = glob.glob('lessons/**/**/index.html', recursive=True)
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'telegram-web-app.js' in html:
        continue
    html = html.replace('<link rel="stylesheet" href="../../../css/base.css">', SDK + '  <link rel="stylesheet" href="../../../css/base.css">', 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    patched += 1
print(f'Done: {patched} files patched.')
