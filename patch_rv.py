import glob

RV = '  <script src="https://code.responsivevoice.org/responsivevoice.js?key=FREE"></script>\n'
files = glob.glob('lessons/**/**/index.html', recursive=True)
files.append('index.html')
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'responsivevoice' in html:
        continue
    html = html.replace(
        '<script src="https://telegram.org/js/telegram-web-app.js"></script>',
        '<script src="https://telegram.org/js/telegram-web-app.js"></script>\n' + RV,
        1
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    patched += 1
print(f'Done: {patched} files.')
