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
const wave = selector => selector + ' .speech-wave';
const animated = selector => 'getComputedStyle(' + query(wave(selector) + ' span') + ').animationName === "speech-wave"';
const markExercises = 'for (const name of ["fill", "choice", "match", "dict"]) Progress.markSectionDone(name, 100)';

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
    query(vocab) + '.title === "Остановить озвучку" && ' + visible(wave(vocab)) + ' && ' + animated(vocab),
    'Vocabulary indicates speech with three animated bars');
  await expect('getComputedStyle(' + query(wave(vocab)) + ').color === getComputedStyle(document.querySelector(".vocab-word")).color',
    'Speaking bars use the neutral text color');
  await capture(vocab, 'lesson-vocab-audio.png');
  await ev('testSpeech.current.onend()');
  await expect('!' + active(vocab) + ' && !(' + visible(wave(vocab)) + ')', 'Vocabulary resets after speech ends');

  await click(vocab);
  await click(grammar);
  await ev('testSpeech.canceled.onend()');
  await expect('!' + active(vocab) + ' && ' + active(grammar) + ' && ' + visible(wave(grammar)) + ' && ' + animated(grammar) +
    ' && testSpeech.current.text === "Ich möchte behaupten, dass"', 'Switching controls clears the old state');
  await ev('testSpeech.current.onerror({ error: "audio-hardware" })');
  await expect('!' + active(grammar), 'A synthesis error resets the grammar control');
  await ev(query(grammar) + '.focus()');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await expect(active(grammar) + ' && ' + visible(wave(grammar)) + ' && !(' + animated(grammar) + ')',
    'Keyboard starts grammar playback with steady bars when reduced motion is enabled');
  await click(grammar);
  await expect('!' + active(grammar) + ' && !testSpeech.current', 'Clicking the active control stops speech');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });

  await click(phrase);
  const highlighting = '[...document.querySelectorAll(".phrase-card:first-child .word-speak")].some(word => word.style.textShadow.includes("16px"))';
  await until(highlighting, 'Phrase starts and highlights words');
  await expect(active(phrase) + ' && ' + visible(wave(phrase)) + ' && ' + animated(phrase), 'Phrase animates the bars while words are highlighted');
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

  await expect('!(' + visible('.lesson-next') + ') && !(' + visible('.flashcard-restart') + ')',
    'Both actions are hidden while the lesson is incomplete');
  await ev('Progress.markSectionDone("fill", 100); for (const card of LESSON_DATA.vocabulary) { cardFlip(); cardGood(); } TTS.stop()');
  await expect('!(' + visible('.lesson-next') + ') && !(' + visible('.flashcard-restart') + ') && !Progress.isLessonFullyDone()',
    'Finishing only flashcards leaves both actions hidden');
  await go(base + lessonPath, 850);
  await expect('!(' + visible('.lesson-next') + ') && !(' + visible('.flashcard-restart') + ')',
    'Both actions stay hidden after reloading a partially completed lesson');
  await ev(markExercises);
  await until(visible('.lesson-preview-example'), 'The next lesson preview loads after all five sections are complete');
  await expect(visible('.lesson-next') + ' && ' + visible('.flashcard-restart.btn-ghost') +
    ' && ' + query('.lesson-preview h3') + '.textContent === "Komplexe Texte" && ' +
    query('.lesson-preview-details') + '.textContent.includes("Анализ и стилистика") && ' +
    query('.lesson-preview-example bdi') + '.textContent === "Den Text zusammenfassen"',
    'Completion shows the new topic, a sample phrase and both actions');
  await capture('.lesson-preview', 'lesson-completion-preview.png');
  await go(base + lessonPath, 850);
  await expect(visible('.lesson-next') + ' && ' + visible('.flashcard-restart'), 'Both actions stay visible after reloading the completed lesson');
  await click('.flashcard-restart');
  await expect(visible('.lesson-next') + ' && ' + visible('.flashcard-restart') + ' && ' + visible('#flashcard') +
    ' && document.activeElement.id === "flashcard" && Progress.isLessonFullyDone()',
    'Repeating flashcards returns focus to the deck and preserves lesson completion');
  await click('.lesson-next');
  await until('location.pathname.endsWith("/b2/lesson-08/index.html") && typeof LESSON_DATA !== "undefined" && LESSON_DATA.id === "b2-08"',
    'Next lesson link opens B2·8');
  assert.deepEqual(errors(), []);

  for (const [lang, label, example, direction] of [
    ['uk', 'Перейти до уроку', 'Скільки тобі років', 'ltr'],
    ['ar', 'انتقل إلى الدرس', 'كم عمرك', 'rtl']
  ]) {
    await go(base + '/lessons/a1/lesson-01/index.html?lang=' + lang + '&lts=' + Date.now(), 850);
    await expect(visible(grammar) + ' && ' + visible(phrase) + ' && ' + visible(vocab) +
      ' && getComputedStyle(document.documentElement).direction === ' + JSON.stringify(direction),
    'A1·1 uses the shared speech controls in ' + lang);
    await ev(markExercises + '; if (!Progress.isLessonFullyDone()) { for (const card of LESSON_DATA.vocabulary) { cardFlip(); cardGood(); } TTS.stop(); }');
    await until(visible('.lesson-preview-example'), 'Translated preview rendered in ' + lang);
    await expect(query('.lesson-next') + '.textContent === ' + JSON.stringify(label) + ' && ' +
      query('.lesson-preview-example') + '.textContent.includes(' + JSON.stringify(example) + ')',
    'Next lesson action and example are translated in ' + lang);
    assert.deepEqual(errors(), []);
  }
  await ev('localStorage.removeItem("dm_cards:a1-01")');
  await go(base + '/lessons/a1/lesson-01/index.html', 850);
  await expect(visible('.lesson-next') + ' && ' + visible('.flashcard-restart'), 'Both actions work with synced completion and no local deck');
  await ev('Progress.resetLessonProgress(LESSON_DATA.id)');
  await expect('!(' + visible('.lesson-next') + ') && !(' + visible('.flashcard-restart') + ')',
    'Resetting the lesson hides both completion actions');
} finally {
  close();
}
