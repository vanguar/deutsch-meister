// Serve the repository at http://127.0.0.1:8765, then run:
// node --experimental-websocket tools/e2e/lesson_audio_flow.mjs
import assert from 'node:assert/strict';
import { start } from './cdp.mjs';

const base = process.env.BASE || 'http://127.0.0.1:8765';
const browser = await start(9372, ['--autoplay-policy=no-user-gesture-required', '--disable-audio-output']);
const { ev, go, send, errors, close, shot } = browser;
const vocab = '#vocabTableBody .lesson-speak';
const phrase = '#phraseGrid .lesson-speak';
const grammar = '.pattern-table .lesson-speak';
const query = selector => 'document.querySelector(' + JSON.stringify(selector) + ')';
const click = selector => ev(query(selector) + '.click()');
const visible = selector => query(selector) + '?.getClientRects().length > 0';
const active = selector => query(selector) + '.classList.contains("is-active")';

async function expect(expression, message) {
  assert.ok(await ev(expression), message);
  console.log('PASS ' + message);
}

async function until(expression, message) {
  for (let i = 0; i < 60; i++) {
    if (await ev(expression)) return;
    await browser.wait(50);
  }
  assert.fail(message);
}

async function capture(selector, filename) {
  if (!process.env.SP) return;
  await ev(query(selector) + '.scrollIntoView({ block: "center", behavior: "instant" })');
  await browser.wait(140);
  await shot(filename);
}

try {
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.testSpeech = { voice: true, current: null, canceled: null };
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    speechSynthesis.getVoices = () => testSpeech.voice ? [{ name: 'Deutsch', lang: 'de-DE', localService: true }] : [];
    speechSynthesis.speak = utterance => { testSpeech.current = utterance; utterance.onstart(); };
    speechSynthesis.cancel = () => {
      if (testSpeech.current) testSpeech.canceled = testSpeech.current;
      testSpeech.current = null;
    };
    // Play a one-second WAV through the real Web Audio path used for phrase highlighting.
    const wave = new Uint8Array(44 + 8000 * 2);
    const header = new DataView(wave.buffer);
    for (const [offset, text] of [[0, 'RIFF'], [8, 'WAVEfmt '], [36, 'data']]) {
      wave.set(new TextEncoder().encode(text), offset);
    }
    header.setUint32(4, wave.length - 8, true);
    header.setUint32(16, 16, true);
    header.setUint16(20, 1, true);
    header.setUint16(22, 1, true);
    header.setUint32(24, 8000, true);
    header.setUint32(28, 16000, true);
    header.setUint16(32, 2, true);
    header.setUint16(34, 16, true);
    header.setUint32(40, wave.length - 44, true);
    const fetchReal = window.fetch;
    window.fetch = (url, options) => typeof url === 'string' && url.includes('/api/tts?')
      ? Promise.resolve(new Response(wave, { headers: { 'Content-Type': 'audio/wav' } }))
      : fetchReal(url, options);
  ` });

  const lessonPath = '/lessons/b2/lesson-07/index.html';
  await go(base + lessonPath + '?lang=ru', 900);
  await until(visible(grammar), 'Lesson controls rendered');
  await ev("localStorage.setItem('dm_theme', 'light'); document.documentElement.dataset.theme = 'light'");
  for (const width of [320, 390, 1024]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 1024 });
    await expect('document.documentElement.scrollWidth <= innerWidth && ' +
      [vocab, phrase, grammar].map(selector => query(selector) + '.offsetHeight >= 44 && ' +
      'getComputedStyle(' + query(selector) + '.querySelector("svg")).display !== "none"').join(' && '),
    'Visible touch controls and no horizontal overflow at ' + width + 'px');
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await capture(grammar, 'lesson-grammar-audio.png');

  await click(vocab);
  await expect(active(vocab) + ' && testSpeech.current.text === "die These" && ' +
    query(vocab) + '.title === "Остановить озвучку" && getComputedStyle(' +
    query(vocab) + '.querySelector("svg:last-child")).display === "block"', 'Vocabulary speaks and shows the stop icon');
  await capture(vocab, 'lesson-vocab-audio.png');
  await ev('testSpeech.current.onend()');
  await expect('!' + active(vocab), 'Vocabulary resets after speech ends');

  await click(vocab);
  await click(grammar);
  await ev('testSpeech.canceled.onend()');
  await expect('!' + active(vocab) + ' && ' + active(grammar) +
    ' && testSpeech.current.text === "Ich möchte behaupten, dass"', 'Switching controls clears the old state');
  await ev('testSpeech.current.onerror({ error: "audio-hardware" })');
  await expect('!' + active(grammar), 'A synthesis error resets the grammar control');
  await ev(query(grammar) + '.focus()');
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await expect(active(grammar), 'Grammar playback can start from the keyboard');
  await click(grammar);
  await expect('!' + active(grammar) + ' && !testSpeech.current', 'Clicking the active control stops speech');

  await click(phrase);
  const highlighting = '[...document.querySelectorAll(".phrase-card:first-child .word-speak")].some(word => word.style.textShadow.includes("16px"))';
  await until(highlighting, 'Phrase starts and highlights words');
  await expect(active(phrase), 'Phrase shows the stop icon while words are highlighted');
  await capture(phrase, 'lesson-phrase-audio.png');
  await until('!' + active(phrase), 'Phrase resets at the end of Web Audio playback');
  await click(phrase);
  await until(highlighting, 'Phrase replay starts');
  await click(phrase);
  await expect('!' + active(phrase) + ' && !(' + highlighting + ')', 'Stopping the phrase clears word highlighting');

  await ev('testSpeech.voice = false; Object.defineProperty(navigator, "onLine", { value: false, configurable: true })');
  await click(vocab);
  await until('!' + active(vocab), 'Unavailable offline playback returns the speaker icon');
  await expect('document.getElementById("ttsOfflineNotice").parentElement === ' + query(vocab) + '.closest(".vocab-item")',
    'Offline notice belongs to the selected vocabulary row');
  await ev('testSpeech.voice = true; delete navigator.onLine');

  await expect('!(' + visible('.lesson-next') + ')', 'Next lesson is hidden while flashcards are pending');
  await ev('Progress.markSectionDone("fill", 100); for (const card of LESSON_DATA.vocabulary) { cardFlip(); cardGood(); } TTS.stop()');
  await expect(visible('.lesson-next') + ' && ' + query('.lesson-next') + '.textContent === "Следующий урок" && ' +
    query('.flashcard-restart.btn-ghost') + '?.textContent === "↻ Повторить флешкарты" && !Progress.isLessonFullyDone()',
    'Flashcard completion shows a secondary repeat action and a distinct next lesson link');
  await capture('.lesson-next', 'lesson-flashcards-complete.png');
  await go(base + lessonPath, 850);
  await expect(visible('.lesson-next'), 'Next lesson link survives reload');
  await click('.flashcard-restart');
  await expect('!(' + visible('.lesson-next') + ') && ' + visible('#flashcard') +
    ' && Progress.getCompletionStatus().done.includes("fill")', 'Repeating flashcards leaves exercise progress intact');
  await ev('for (const name of ["choice", "match", "dict"]) Progress.markSectionDone(name, 100)');
  await expect(visible('.lesson-next') + ' && ' + visible('#lessonComplete'), 'Previously completed flashcards count toward lesson completion');
  await click('.lesson-next');
  await until('location.pathname.endsWith("/b2/lesson-08/index.html") && typeof LESSON_DATA !== "undefined" && LESSON_DATA.id === "b2-08"',
    'Next lesson link opens B2·8');
  assert.deepEqual(errors(), []);

  for (const [lang, label, direction] of [['uk', 'Наступний урок', 'ltr'], ['ar', 'الدرس التالي', 'rtl']]) {
    await go(base + '/lessons/a1/lesson-01/index.html?lang=' + lang + '&lts=' + Date.now(), 850);
    await expect(visible(grammar) + ' && ' + visible(phrase) + ' && ' + visible(vocab) +
      ' && getComputedStyle(document.documentElement).direction === ' + JSON.stringify(direction),
    'A1·1 uses the shared speech controls in ' + lang);
    await expect(query('.lesson-next') + '.textContent === ' + JSON.stringify(label), 'Next lesson label is translated in ' + lang);
    assert.deepEqual(errors(), []);
  }
} finally {
  close();
}
