import glob

files = glob.glob('lessons/**/**/index.html', recursive=True)
files.append('index.html')
patched = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    # Remove old version suffixes first
    import re
    html = re.sub(r'(tts\.js|telegram\.js|lesson-render\.js|exercises\.js|flashcards\.js|progress\.js)\?v=\d+', r'\1', html)
    # Add new version
    for js in ['tts.js', 'telegram.js', 'lesson-render.js', 'exercises.js', 'flashcards.js', 'progress.js']:
        html = html.replace(f'{js}"', f'{js}?v=11"')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    patched += 1
print(f'Done: {patched} files.')
