const TTS = (() => {
  let preferredVoice = null;
  let audio = null;

  const hasSpeech = () => {
    if (!window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().length > 0;
  };

  function speakViaStream(text) {
    const url = 'https://api.streamelements.com/kappa/v2/speech?voice=Marlene&text=' + encodeURIComponent(text);
    if (!audio) audio = new Audio();
    audio.pause();
    audio.src = url;
    audio.play().catch(() => speakViaRV(text));
  }

  function speakViaRV(text) {
    if (typeof responsiveVoice !== 'undefined') {
      responsiveVoice.speak(text, 'Deutsch Female');
    }
  }

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
      u.voice = preferredVoice || pickBestVoice();
      u.onerror = () => speakViaStream(text);
      window.speechSynthesis.speak(u);
    } else {
      speakViaStream(text);
    }
  }

  function speakSlow(text) { speak(text, { rate: 0.65 }); }

  function init() {
    if (!window.speechSynthesis) return;
    const update = () => { preferredVoice = pickBestVoice(); };
    window.speechSynthesis.onvoiceschanged = update;
    update();
  }

  return { init, speak, speakSlow };
})();

TTS.init();
function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
