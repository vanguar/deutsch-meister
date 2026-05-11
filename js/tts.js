/* TTS — ResponsiveVoice fallback for Telegram WebView */

const TTS = (() => {
  let preferredVoice = null;

  const hasRV    = () => typeof responsiveVoice !== 'undefined';
  const hasSpeech = () => !!(window.speechSynthesis && window.speechSynthesis.getVoices().length);

  function pickBestVoice() {
    const v = window.speechSynthesis?.getVoices() || [];
    return v.find(x => x.lang === 'de-DE') || v.find(x => x.lang.startsWith('de')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    if (hasSpeech()) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      u.voice = pickBestVoice();
      u.onerror = () => speakRV(text);
      window.speechSynthesis.speak(u);
    } else if (hasRV()) {
      speakRV(text, rate);
    }
  }

  function speakRV(text, rate = 0.85) {
    responsiveVoice.speak(text, 'Deutsch Female', { rate });
  }

  function speakSlow(text) { speak(text, { rate: 0.65 }); }

  function init() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.onvoiceschanged = () => { preferredVoice = pickBestVoice(); };
    const v = window.speechSynthesis.getVoices();
    if (v.length) preferredVoice = pickBestVoice();
  }

  return { init, speak, speakSlow };
})();

TTS.init();
function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
