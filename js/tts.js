/* ═══════════════════════════════════════════════
   js/tts.js — Text-to-Speech (Web Speech API)
               German pronunciation helper
   ═══════════════════════════════════════════════ */

const TTS = (() => {
  let voices = [];
  let preferredVoice = null;
  let ready = false;

  /* Load and cache available voices */
  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    preferredVoice = pickBestVoice(voices);
    ready = true;
  }

  /* Pick the best German voice available */
  function pickBestVoice(list) {
    // Priority 1: German (Germany) — de-DE
    const deDE = list.find(v => v.lang === 'de-DE');
    if (deDE) return deDE;

    // Priority 2: any German
    const de = list.find(v => v.lang.startsWith('de'));
    if (de) return de;

    // Fallback: null (browser default)
    return null;
  }

  /* Speak a text string */
  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    if (!window.speechSynthesis) {
      console.warn('TTS: Web Speech API not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'de-DE';
    utterance.rate  = rate;
    utterance.pitch = pitch;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /* Speak slowly — useful for dictation */
  function speakSlow(text) {
    speak(text, { rate: 0.65 });
  }

  /* Init — handles the async nature of voice loading */
  function init() {
    if (!window.speechSynthesis) return;

    // Voices may already be loaded
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      voices = initial;
      preferredVoice = pickBestVoice(voices);
      ready = true;
    }

    // Or they arrive via event (Chrome, Edge)
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  /* Expose public API */
  return { init, speak, speakSlow };
})();

/* Auto-init on script load */
TTS.init();

/* Global shorthand — used inline via onclick="speak('...')" */
function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
