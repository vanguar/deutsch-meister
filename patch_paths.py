import os, glob, re

# Fix index.html (root level)
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace(
    'href="/manifest.json"',
    'href="manifest.json"'
)
html = html.replace(
    "navigator.serviceWorker.register('/service-worker.js')",
    "navigator.serviceWorker.register('/deutsch-meister/service-worker.js')"
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('patched: index.html')

# Fix all lesson pages (3 levels deep: lessons/xx/lesson-xx/index.html)
files = glob.glob('lessons/**/**/index.html', recursive=True)
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace(
        'href="/manifest.json"',
        'href="../../../manifest.json"'
    )
    html = html.replace(
        "navigator.serviceWorker.register('/service-worker.js')",
        "navigator.serviceWorker.register('/deutsch-meister/service-worker.js')"
    )
    html = html.replace(
        "navigator.serviceWorker.register('/deutsch-meister/service-worker.js')",
        "navigator.serviceWorker.register('/deutsch-meister/service-worker.js')"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'patched: {path}')

print('\nDone.')
