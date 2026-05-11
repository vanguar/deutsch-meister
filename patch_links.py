import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove old version suffixes from lesson links
html = re.sub(r'(lessons/[^"]+/index\.html)\?v=\d+', r'\1', html)
# Add ?v=15
html = re.sub(r'href="(lessons/[^"]+/index\.html)"', r'href="\1?v=15"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done')
