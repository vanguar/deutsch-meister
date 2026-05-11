const TTS = (() => {
  let preferredVoice = null;
  let audioEl = null;

  const hasSpeechAPI = () => !!(window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined');

  function speakViaAudio(text) {
    console.log('[TTS] Using audio fallback for:', text);
    const url = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=de&client=gtx&q=' + encodeURIComponent(text);
    if (!audioEl) audioEl = new Audio();
    audioEl.pause();
    audioEl.src = url;
    const p = audioEl.play();
    if (p) p.catch(e => console.warn('[TTS] Audio play failed:', e));
  }

  function pickBestVoice(list) {
    return list.find(v => v.lang === 'de-DE')
      || list.find(v => v.lang.startsWith('de'))
      || null;
  }

  function loadVoices() {
    const v = window.speechSynthesis.getVoices();
    preferredVoice = pickBestVoice(v);
    console.log('[TTS] Voices loaded:', v.length, 'preferred:', preferredVoice?.name);
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    console.log('[TTS] speak() called, hasSpeechAPI:', hasSpeechAPI());
    if (hasSpeechAPI()) {
      const v = window.speechSynthesis.getVoices();
      console.log('[TTS] Available voices:', v.length);
      if (v.length === 0) {
        speakViaAudio(text);
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      if (preferredVoice) u.voice = preferredVoice;
      u.onerror = (e) => {
        console.warn('[TTS] SpeechSynthesis error:', e.error, '— falling back to audio');
        speakViaAudio(text);
      };
      window.speechSynthesis.speak(u);
    } else {
      speakViaAudio(text);
    }
  }

  function speakSlow(text) { speak(text, { rate: 0.65 }); }

  function init() {
    if (!hasSpeechAPI()) {
      console.log('[TTS] No SpeechAPI, will use audio fallback');
      return;
    }
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      preferredVoice = pickBestVoice(initial);
    }
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  return { init, speak, speakSlow };
})();

TTS.init();
function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
