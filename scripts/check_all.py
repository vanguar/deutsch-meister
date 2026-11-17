"""Run the same checks locally and in CI (Python stdlib + Node only)."""
from pathlib import Path
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
PY = [sys.executable, '-B', '-X', 'utf8']
commands = [
    PY + ['scripts/validate_lessons.py'],
    PY + ['scripts/validate_dialogs.py'],
    PY + ['scripts/validate_fahrschule.py'],
    PY + ['scripts/validate_laender.py'],
    PY + ['scripts/validate_books.py'],
    PY + ['scripts/validate_books.py', '--news'],
    PY + ['scripts/validate_books.py', '--laender'],
    PY + ['scripts/validate_books.py', '--history'],
    ['node', 'tools/test_history.js'],
    PY + ['scripts/test_progress_merge.py'],
    PY + ['scripts/test_progress_reliability.py'],
    PY + ['scripts/test_bot_lang.py'],
    PY + ['scripts/test_bot_users.py'],
    PY + ['scripts/test_audience_wording.py'],
    PY + ['tools/fahrschule/test_build.py'],
    ['node', 'tools/test_phrase_audio.js'],
    ['node', 'tools/check_phrase_audio.js'],
    ['node', 'tools/check_tips.js'],
    ['node', 'tools/test_i18n.js'],
    ['node', 'tools/test_dialogs_tts.js'],
    ['node', 'tools/test_exercises.js'],
    ['node', 'tools/test_flashcards.js'],
    ['node', 'tools/test_progress.js'],
    ['node', 'tools/test_offline.js'],
    ['node', 'tools/vocab/build.js', '--check'],
    ['node', 'tools/i18n.js', 'check'],
    ['node', 'tools/i18n.js', 'check', 'ar'],
]
commands += [['node', '--check', str(p.relative_to(ROOT))] for p in sorted((ROOT / 'js').glob('*.js'))]
commands.append(['node', '--check', 'service-worker.js'])
env = dict(os.environ, PYTHONIOENCODING='utf-8', PYTHONDONTWRITEBYTECODE='1', PYTHON=sys.executable)
failed = []
for cmd in commands:
    result = subprocess.run(cmd, cwd=ROOT, env=env, capture_output=True, text=True, encoding='utf-8', errors='replace')
    label = ' '.join(cmd[4:] if cmd[:4] == PY else cmd[1:])
    print(('FAIL ' if result.returncode else 'PASS ') + label, flush=True)
    if result.returncode:
        failed.append(label)
        print(result.stdout + result.stderr, flush=True)
print(f'{len(commands) - len(failed)}/{len(commands)} checks passed', flush=True)
sys.exit(bool(failed))
