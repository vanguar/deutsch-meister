const TTS = (() => {
  let preferredVoice = null;
  let audio = null;
  let responsiveVoicePromise = null;

  const hasSpeech = () => {
    if (!window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().length > 0;
  };

  // Telegram's in-app browser (WKWebView on iOS, System WebView on Android) exposes
  // the Web Speech API but it is SILENT — speechSynthesis.speak() plays nothing and
  // fires no error. So inside Telegram we must never rely on it: we play a real
  // <audio> stream started directly inside the tap gesture, which works everywhere.
  function inTelegram() {
    const wa = window.Telegram && window.Telegram.WebApp;
    if (wa && wa.platform && wa.platform !== 'unknown') return true;
    if (typeof window.TelegramWebviewProxy !== 'undefined') return true;          // iOS bridge
    if (typeof window.TelegramWebviewProxyProto !== 'undefined') return true;
    if (typeof isTelegramWebView === 'function' && isTelegramWebView()) return true;
    return /Telegram/i.test(navigator.userAgent || '');
  }

  function streamUrl(text) {
    return 'https://api.streamelements.com/kappa/v2/speech?voice=Marlene&text=' + encodeURIComponent(text);
  }

  // Reuse ONE <audio> element. Once it has played once inside a gesture, iOS keeps
  // it "unlocked", so subsequent plays are reliable even from async callbacks.
  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
    }
    return audio;
  }

  function playPrimed(el, text) {
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => speakViaRV(text));
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
    // Prime the shared <audio> element synchronously inside the user gesture so
    // playback is permitted even if we call .play() later from a callback.
    const el = getAudio();
    el.onerror = () => speakViaRV(text);
    el.src = streamUrl(text);
    el.load();

    // Inside Telegram the Web Speech API is silent — go straight to the stream.
    if (inTelegram()) {
      playPrimed(el, text);
      return;
    }

    const bestVoice = pickBestVoice();
    if (hasSpeech() && bestVoice) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      u.voice = preferredVoice || bestVoice;
      u.onstart = () => { try { el.pause(); } catch (e) {} };
      u.onerror = () => playPrimed(el, text);
      window.speechSynthesis.speak(u);
    } else {
      playPrimed(el, text);
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
