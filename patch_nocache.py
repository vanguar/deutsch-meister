import glob, re

NO_CACHE = '  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n  <meta http-equiv="Pragma" content="no-cache">\n  <meta http-equiv="Expires" content="0">\n'

# Remove old inline debug block
DEBUG_RE = re.compile(r'<script>\s*// INLINE DEBUG.*?</script>\s*', re.DOTALL)

files = glob.glob('lessons/**/**/index.html', recursive=True)
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    # Remove debug block
    html = DEBUG_RE.sub('', html)
    # Add no-cache meta if not present
    if 'Cache-Control' not in html:
        html = html.replace('<meta name="viewport"', NO_CACHE + '  <meta name="viewport"', 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    patched += 1

print(f'Done: {patched} files.')
