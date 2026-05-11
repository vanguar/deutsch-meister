const TTS = (() => {
  let voices = [];
  let preferredVoice = null;
  let audioEl = null;

  const hasSpeechAPI = () => !!(window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined');

  /* Google Translate TTS fallback — works in Telegram WebView */
  function speakViaAudio(text) {
    const url = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=de&client=gtx&q=' + encodeURIComponent(text);
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.crossOrigin = 'anonymous';
    }
    audioEl.pause();
    audioEl.src = url;
    audioEl.play().catch(() => {});
  }

  function pickBestVoice(list) {
    return list.find(v => v.lang === 'de-DE')
      || list.find(v => v.lang.startsWith('de'))
      || null;
  }

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    preferredVoice = pickBestVoice(voices);
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    if (hasSpeechAPI()) {
      const voices = window.speechSynthesis.getVoices();
      // если голосов нет — значит WebView не поддерживает, падаем на audio
      if (voices.length === 0) {
        speakViaAudio(text);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang  = 'de-DE';
      utterance.rate  = rate;
      utterance.pitch = pitch;
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onerror = () => speakViaAudio(text);
      window.speechSynthesis.speak(utterance);
    } else {
      speakViaAudio(text);
    }
  }

  function speakSlow(text) {
    speak(text, { rate: 0.65 });
  }

  function init() {
    if (!hasSpeechAPI()) return;
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      voices = initial;
      preferredVoice = pickBestVoice(voices);
    }
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  return { init, speak, speakSlow };
})();

TTS.init();

function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
