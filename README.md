# Deutsch Meister 🇩🇪

**Deutsch Meister** is a fully interactive German learning platform for Russian speakers covering levels **A1 to B2**.

It is a lightweight, offline-capable web application with a data-driven lesson engine, interactive exercises, flashcards, speech synthesis, word-by-word tooltips, progress tracking with cloud sync, Telegram Mini App integration, donations, and PWA support.

Live demo:

```text
https://vanguar.github.io/deutsch-meister/
```

> This README (like `BOT_AND_DONATIONS.md` and `ДЕПЛОЙ-инструкция.md`) is written both for people and for AI assistants working on the project. Read those two documents before touching the bot, donations, or deploy process.

---

## Overview

Deutsch Meister works directly in the browser, installs as a PWA, and runs inside Telegram as a Mini App (`@GermanMorningBot`).

The course:

- **4 CEFR levels, 68 lessons:** A1 — 20, A2 — 20, B1 — 14, B2 — 14 (each level ends with a review lesson)
- German phrases with Russian translations, notes and audio
- Hover/tap tooltips with a translation for **every word** in every phrase
- Vocabulary tables with IPA transcription and articles
- Grammar explanations, 4 exercise types, dictation, flashcards
- XP, streaks, per-section lesson progress
- Cloud progress sync inside Telegram (Upstash Redis)
- Offline support through a Service Worker

Lesson topics per level:

- **A1:** greetings, numbers, colors, family, weekdays, food, city, time, body, seasons, animals, professions, supermarket, transport, café, numbers to 100, modal verbs, Perfekt, holidays + review
- **A2:** daily routine, hobbies, doctor, travel, shopping, housing, work, weather, restaurant, traditions, media, feelings, sport, directions, friendship, nature, Präteritum, comparison, future plans + review
- **B1:** Konjunktiv II, passive, relative/subordinate clauses, weil/dass, infinitive with zu, job applications, argumentation, environment, adjective declension, Genitiv, temporal clauses, verb+preposition, media + review
- **B2:** participle constructions, modal particles, connectors, nominalization, academic style, economy, debate, complex texts, subjective modals, Nomen-Verb-Verbindungen, idioms, business communication, politics + review

---

## Architecture: two independent parts

| Part | Hosting | Deploy |
|---|---|---|
| Frontend (all static files) | GitHub Pages → `vanguar.github.io/deutsch-meister/` | automatic on `git push` to `main` |
| Backend (`api/webhook.py`) | Vercel → `deutsch-meister-puce.vercel.app` | **manual**: `vercel --prod` (`make deploy-api`) |

Zero dependencies by design: the frontend is vanilla HTML/CSS/JS with no build step; the backend is a single Python file using only the stdlib. Keep it that way.

---

## Data-Driven Lesson Engine

Content is separated from rendering. Each lesson is:

- `data/<level>/<level>-lesson-NN.js` — a `LESSON_DATA` object (id, title, meta with XP, `phrases[]`, `vocabulary[]` with IPA, `grammar[]`, `exercises{}`);
- `lessons/<level>/lesson-NN/index.html` — a thin HTML shell that loads its data file plus the shared engine.

`js/lesson-render.js` renders the whole page from `LESSON_DATA`: navigation for all four levels, phrases, vocabulary, grammar, exercises. It also contains the `COURSE_WORDS_RAW` dictionary powering per-word tooltips.

### JS modules

| Module | Purpose |
|---|---|
| `lesson-render.js` | universal lesson renderer + word-tooltip lexicon (`COURSE_WORDS_RAW`, `BASIC_WORDS`) |
| `exercises.js` | fill-in-the-blank, multiple choice, matching pairs, dictation; step-by-step mode on mobile |
| `progress.js` | XP, streaks, 5 required sections per lesson, `localStorage` persistence, "continue where you left off", home-page progress rendering |
| `flashcards.js` | flashcards from lesson vocabulary with known/repeat logic |
| `tts.js` | speech: native `speechSynthesis` → `/api/tts` proxy + Web Audio (see below) |
| `telegram.js` | lazy Telegram WebApp SDK load, expand, theme, BackButton, welcome overlay |
| `cloud-sync.js` | cloud progress: pull+merge on open, debounced push, `sendBeacon` flush; Telegram-only (needs signed `initData`) |
| `install-app.js` | "install as PWA" hint inside Telegram |
| `support.js` | donation modal: Telegram Stars via `TG.openInvoice()` + crypto wallets |

All lessons are always accessible — progress is display-only and never locks content.

### Text-to-Speech (fragile — read before touching)

- Browser/PWA: native `speechSynthesis`.
- Telegram WebView: `speechSynthesis` is silent, so the frontend fetches mp3 from our own proxy `/api/tts` (Vercel), which gets audio from Google Translate TTS and adds the CORS header, then plays via Web Audio API with a silent-WAV unlock.
- The Service Worker deliberately does **not** intercept cross-origin requests — intercepting media breaks audio on iOS.
- **StreamElements is dead (401). Never go back to it.**

### Backend — one file on Vercel

`api/webhook.py` (stdlib only) dispatches all `/api/*` routes:

- `/api/webhook` — Telegram bot: `/start`, `/donate`, Stars invoices (XTR), `pre_checkout_query` confirmation (10-second deadline — this is why a live bot is mandatory);
- `/api/tts?text=...&tl=de` — TTS proxy (mp3 + CORS, 7-day cache);
- `/api/progress` — cloud progress in Upstash Redis with cryptographic Telegram `initData` verification (HMAC-SHA256, 24h max age). Requires `UPSTASH_REDIS_REST_URL/TOKEN` env vars on Vercel.

`bot/bot.py` is a polling (aiogram) variant for local testing only.

### Donations

- Telegram Stars: invoice links opened natively via `TG.openInvoice()` (tiers 50/100/250/500 ⭐, links in `js/support.js`);
- crypto wallets (USDT, TON, BTC, ETH, SOL) with copy buttons.
- Details, pitfalls and regeneration instructions: `BOT_AND_DONATIONS.md`.

---

## Project Structure

```text
deutsch-meister/
├── index.html                 # home: hero, stats, course map, SW registration
├── 404.html
├── manifest.json
├── service-worker.js          # app-shell precache + cache-first assets
├── Makefile                   # bump / validate / deploy-web / deploy-api / check-api
├── bump_version.py            # one-command ?v=N + SW CACHE bump
│
├── css/                       # base / sidebar / lesson / exercises
├── js/                        # 9 engine modules (see table above)
├── data/{a1,a2,b1,b2}/        # 68 LESSON_DATA files
├── lessons/{a1,a2,b1,b2}/     # 68 lesson HTML shells (lesson-NN/index.html)
│
├── api/webhook.py             # entire backend (Vercel serverless)
├── bot/bot.py                 # polling bot for local testing
│
├── scripts/
│   └── validate_lessons.py    # CI validator (see below)
├── .github/workflows/validate.yml
│
├── tools/legacy/              # superseded one-off patch scripts
├── patch_*.py                 # historical one-off migrations (already applied)
├── gen_lessons.py             # lesson-shell generator (local only, gitignored)
├── gen_template.html          # shell template for gen_lessons.py (local only)
│
├── README.md
├── BOT_AND_DONATIONS.md       # donations + bot mechanics and pitfalls
└── ДЕПЛОЙ-инструкция.md       # deploy checklists (RU)
```

---

## Deployment

**Short version** (full checklists in `ДЕПЛОЙ-инструкция.md`):

1. Changed JS/CSS/lesson data? Run `python bump_version.py` (or `make bump`) — it unifies `?v=N` in all HTML files, syncs the Service Worker `STATIC` list and bumps `CACHE`. Never bump versions by hand.
2. `git push origin main` → GitHub Pages redeploys the frontend automatically.
3. Changed anything in `api/`? Deploy the backend separately: `vercel --prod` (`make deploy-api`), then smoke-test with `scripts/check_api.sh`.

Vercel is intentionally **not** connected to GitHub; backend deploys are manual.

---

## Validation and CI

`python scripts/validate_lessons.py` (also `make validate`) checks:

- lesson counts per level (20/20/14/14);
- every `LESSON_DATA` has non-empty id/title/meta/phrases/vocabulary/grammar/exercises, ids match paths, no duplicates;
- every data file has a shell and vice versa;
- all `?v=N` versions are in sync (desync is an error);
- word-tooltip coverage of phrase words (warnings only).

GitHub Actions runs it on every push and pull request (`.github/workflows/validate.yml`).

---

## Adding a New Lesson

1. Create `data/<level>/<level>-lesson-NN.js` with a `LESSON_DATA` object (copy a neighboring lesson as a template; `id` must be `<level>-NN`).
2. Create the shell `lessons/<level>/lesson-NN/index.html` — either copy a neighboring shell and update the data-file path and titles, or use the local generator `gen_lessons.py` + `gen_template.html`.
3. Add the lesson to the nav arrays in `js/lesson-render.js` (`A1_LESSONS`/`A2_LESSONS`/`B1_LESSONS`/`B2_LESSONS`), to the sidebar and course map in `index.html`, and update the expected count in `scripts/validate_lessons.py`.
4. Check tooltip coverage: run the validator; add missing words to `COURSE_WORDS_RAW` in `js/lesson-render.js`.
5. `python bump_version.py`, commit, push.

---

## Running Locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

Use a local server (not `file://`) so the Service Worker and PWA features work.

Local bot testing (polling, no Vercel needed):

```bash
export BOT_TOKEN="your_telegram_bot_token"
python bot/bot.py
```

---

## Progress Tracking

Progress lives in `localStorage` (`dm_progress`, `dm_sections:<id>`, `dm_last_lesson`): XP (200 per level), daily streak, completed lessons and section scores, last opened lesson. A lesson counts as complete when all five sections are done: flashcards, fill-in-the-blank, multiple choice, matching, dictation. XP is never granted twice.

Inside Telegram, progress is additionally synced to the cloud (`/api/progress`): the cloud snapshot is merged with local state taking the maximum/union of every field, so nothing is ever lost between devices.

The home page shows a "Continue" button leading to the last opened lesson; the sidebar highlights it and auto-scrolls to it.

---

## Engineering Decisions

- **Vanilla JS, no build step** — lightweight, trivially hosted on GitHub Pages, easy to cache offline. Do not introduce bundlers or dependencies.
- **Data-driven lessons** — new content is data files, not duplicated HTML.
- **localStorage first, cloud second** — works offline and without accounts; cloud sync is an additive merge, never a destructive overwrite.
- **Single stdlib backend file** — nothing to break, free hosting, no cold-start-heavy dependencies.

---

## Security Note

Bot tokens and other secrets live in environment variables (Vercel project settings / `.env.local`, which is gitignored) and are never committed.

---

## Author

Created by **Vladimir Zadorozhnyi** as a portfolio project demonstrating frontend architecture, PWA development, educational UX, Telegram Mini App integration and browser-based learning tools.
