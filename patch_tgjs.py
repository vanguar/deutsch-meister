import glob

# index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
if 'telegram.js' not in html:
    html = html.replace('<script src="js/progress.js"></script>', '<script src="js/progress.js"></script>\n<script src="js/telegram.js"></script>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('patched: index.html')

# lesson pages
files = glob.glob('lessons/**/**/index.html', recursive=True)
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'telegram.js' in html:
        continue
    html = html.replace('</body>', '  <script src="../../../js/telegram.js"></script>\n</body>', 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    patched += 1
print(f'Done: {patched} lesson pages patched.')
