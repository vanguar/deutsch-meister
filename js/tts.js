const TTS = (() => {
  let preferredVoice = null;
  let audio = null;
  let responsiveVoicePromise = null;

  const hasSpeech = () => {
    if (!window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().length > 0;
  };

  function makeAudio(url) {
    if (audio) audio.pause();
    audio = new Audio();
    audio.src = url;
    audio.load();
    return audio;
  }

  function speakViaStream(text, primed) {
    const el = primed || makeAudio('https://api.streamelements.com/kappa/v2/speech?voice=Marlene&text=' + encodeURIComponent(text));
    el.play().catch(() => speakViaRV(text));
  }

  function loadResponsiveVoice() {
    if (typeof responsiveVoice !== 'undefined') return Promise.resolve(true);
    if (responsiveVoicePromise) return responsiveVoicePromise;

    responsiveVoicePromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=FREE';
      script.async = true;
      script.onload = () => resolve(typeof responsiveVoice !== 'undefined');
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

    return responsiveVoicePromise;
  }

  function speakViaRV(text) {
    loadResponsiveVoice().then(ok => {
      if (ok && typeof responsiveVoice !== 'undefined') {
        responsiveVoice.speak(text, 'Deutsch Female');
      }
    });
  }

  function pickBestVoice() {
    const v = window.speechSynthesis?.getVoices() || [];
    return v.find(x => x.lang === 'de-DE') || v.find(x => x.lang.startsWith('de')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    // Always prime audio in sync user-gesture context so play() works even
    // if called later from an async callback (Telegram WebView restriction).
    const url = 'https://api.streamelements.com/kappa/v2/speech?voice=Marlene&text=' + encodeURIComponent(text);
    const primed = makeAudio(url);

    const bestVoice = pickBestVoice();
    if (hasSpeech() && bestVoice) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      u.voice = preferredVoice || bestVoice;
      u.onstart = () => { primed.pause(); primed.src = ''; };
      u.onerror = () => speakViaStream(text, primed);
      window.speechSynthesis.speak(u);
    } else {
      speakViaStream(text, primed);
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
