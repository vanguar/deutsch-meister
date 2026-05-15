# Deutsch Meister 🇩🇪

**Deutsch Meister** is a fully interactive German learning platform covering levels **A1 to B2**.

The project was built as a lightweight, offline-capable web application with a structured lesson engine, interactive exercises, spaced-repetition flashcards, speech synthesis, progress tracking, Telegram Mini App integration, and PWA support.

Live demo:

```text
https://vanguar.github.io/deutsch-meister/
```

---

## Overview

Deutsch Meister is designed as a self-contained language learning application that works directly in the browser and can also be launched inside Telegram as a Mini App.

The course includes:

- **4 CEFR levels:** A1, A2, B1, B2
- **32 complete lessons**
- German phrases, vocabulary, grammar explanations and exercises
- Audio pronunciation support
- Flashcards with repeat/known logic
- XP, streaks and lesson progress
- Offline support through a Service Worker
- Mobile-first responsive UI
- Telegram WebApp support

The goal of the project was to build not just static learning pages, but a reusable lesson system where lesson content is separated from rendering logic.

---

## Key Features

### Complete A1–B2 Course

The app contains a full course structure from beginner to upper-intermediate German:

- **A1:** greetings, numbers, colors, family, weekdays, food, city, time
- **A2:** daily routine, hobbies, doctor visit, travel, shopping, housing, work, weather
- **B1:** Konjunktiv II, passive voice, relative clauses, subordinate clauses, infinitive constructions, work, opinions, environment
- **B2:** participle constructions, modal particles, connectors, nominalization, academic style, economy, debate, complex texts

Each lesson follows a consistent structure and is rendered from a dedicated lesson data file.

---

## Lesson Structure

Every lesson includes:

- German phrases with Russian translations
- pronunciation notes
- vocabulary table with IPA transcription
- grammar explanations
- fill-in-the-blank exercises
- multiple-choice exercises
- matching exercises
- dictation
- flashcards
- XP reward
- section-based progress tracking

Lesson content is stored separately from the UI, which makes the system easier to extend and maintain.

---

## Technical Highlights

### Data-Driven Lesson Engine

Lessons are defined as JavaScript data objects and rendered by a universal lesson renderer.

This allows the application to reuse the same layout and logic across all 32 lessons instead of duplicating markup manually.

Example lesson data structure:

```js
const LESSON_DATA = {
  id: 'a1-01',
  level: 'A1',
  unit: 1,
  title: 'Hallo! Wie heißt du?',
  subtitle: 'Greetings and introductions',

  meta: {
    duration: '25–30 min',
    wordCount: 25,
    xpReward: 100
  },

  phrases: [],
  vocabulary: [],
  grammar: [],
  exercises: {}
};
```

---

### Progress Tracking

User progress is stored locally in the browser using `localStorage`.

The app tracks:

- total XP
- daily streak
- completed lessons
- completed lesson sections
- exercise scores
- selected theme
- Telegram welcome state

The lesson is considered complete only when all required sections are finished:

```text
flashcards
fill-in-the-blank
multiple choice
matching
dictation
```

---

### Flashcards

The flashcard module automatically builds a review deck from lesson vocabulary.

Users can mark each card as:

- **Known**
- **Repeat**

Cards marked for repetition are shown again in the same session. Correct answers add XP and update progress.

---

### Text-to-Speech

The project includes German pronunciation support using multiple fallback layers:

1. Browser Web Speech API
2. StreamElements TTS fallback
3. ResponsiveVoice fallback

This improves compatibility across desktop browsers, mobile browsers and Telegram WebView.

---

### PWA and Offline Support

Deutsch Meister is installable as a Progressive Web App.

It includes:

- `manifest.json`
- `service-worker.js`
- offline caching
- app icons
- standalone display mode
- mobile-friendly launch experience

The Service Worker pre-caches the main app shell, styles, scripts, lesson pages and lesson data.

---

### Telegram Mini App Integration

The project supports Telegram WebApp mode.

Inside Telegram, the app can:

- expand to full screen
- detect Telegram color scheme
- show Telegram Back Button on lesson pages
- display a personalized welcome screen
- launch from a Telegram bot button

The Telegram bot is implemented with Python and `aiogram`.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Web Speech API
- Service Worker
- PWA Manifest
- Telegram WebApp SDK

### Bot

- Python
- aiogram
- Telegram Bot API

### Deployment

- GitHub Pages
- Static hosting
- Offline-first architecture

---

## Project Structure

```text
deutsch-meister/
├── index.html
├── 404.html
├── manifest.json
├── service-worker.js
├── bot.py
│
├── css/
│   ├── base.css
│   ├── sidebar.css
│   ├── lesson.css
│   └── exercises.css
│
├── js/
│   ├── progress.js
│   ├── lesson-render.js
│   ├── exercises.js
│   ├── flashcards.js
│   ├── tts.js
│   └── telegram.js
│
├── data/
│   ├── a1/
│   ├── a2/
│   ├── b1/
│   └── b2/
│
├── lessons/
│   ├── a1/
│   ├── a2/
│   ├── b1/
│   └── b2/
│
└── tools/
    ├── gen_lessons.py
    ├── gen_template.html
    └── patch_*.py
```

---

## Running Locally

Because this is a static web application, it can be served with any local static server.

Using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

For the best experience, use a local server instead of opening `index.html` directly, because Service Worker and PWA features require a proper web context.

---

## Deployment

The app is configured for GitHub Pages deployment under the `/deutsch-meister/` base path.

Typical deployment flow:

```bash
git add .
git commit -m "Update Deutsch Meister"
git push
```

GitHub Pages configuration:

```text
Settings → Pages → Deploy from branch → main → /root
```

---

## Telegram Bot Setup

The Telegram bot opens the web app through an inline keyboard button.

Install dependencies:

```bash
pip install aiogram
```

Recommended environment-based configuration:

```bash
export BOT_TOKEN="your_telegram_bot_token"
export APP_URL="https://your-username.github.io/deutsch-meister/"
```

Run the bot:

```bash
python bot.py
```

---

## Engineering Decisions

### Why Vanilla JavaScript?

The project intentionally uses vanilla JavaScript instead of a frontend framework.

This keeps the application:

- lightweight
- easy to host on GitHub Pages
- fast to load
- simple to cache offline
- independent from a build step

### Why Data-Driven Lessons?

A data-driven lesson architecture allows the same UI components to render different lesson content.

This makes the project scalable: new lessons can be added by creating new data files instead of duplicating HTML pages.

### Why LocalStorage?

For this version, progress is stored locally to avoid backend complexity and allow offline usage.

This makes the app usable even without account registration or network connection.

---

## What This Project Demonstrates

This project demonstrates practical experience with:

- building a full educational web application from scratch
- structuring a multi-level course system
- designing reusable frontend architecture without a framework
- implementing local progress persistence
- building PWA/offline functionality
- integrating Telegram Mini Apps
- working with speech synthesis and browser APIs
- creating responsive UI for desktop and mobile
- organizing a static project for GitHub Pages deployment
- automating repetitive page generation with Python scripts

---

## Future Improvements

Possible next steps:

- backend-based user accounts
- cloud synchronization of progress
- admin panel for editing lessons
- spaced repetition scheduling by date
- placement test
- final tests for each CEFR level
- analytics dashboard
- TypeScript migration
- automated tests for lesson data validation
- CI/CD validation for broken links and missing assets

---

## Security Note

For production use, bot tokens and other secrets should be stored in environment variables and never committed to the repository.

---

## Author

Created by **Vladimir Zadorozhnyi** as a portfolio project demonstrating frontend architecture, PWA development, educational UX, Telegram Mini App integration and browser-based learning tools.