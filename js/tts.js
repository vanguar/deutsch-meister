const TTS = (() => {
  let preferredVoice = null;
  let audio = null;
  let unlocked = false;

  // Короткий "тихий" WAV (data URI, тот же origin) — им разблокируем аудиоканал
  // на первом касании, чтобы дальше play() работал даже из async-колбэков.
  const SILENT = 'data:audio/wav;base64,UklGRqQCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYACAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8A';

  const hasSpeech = () => {
    if (!window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().length > 0;
  };

  // Внутри Telegram (WKWebView на iOS, System WebView на Android) Web Speech API
  // молчит — там всегда играем реальное аудио.
  function inTelegram() {
    const wa = window.Telegram && window.Telegram.WebApp;
    if (wa && wa.platform && wa.platform !== 'unknown') return true;
    if (typeof window.TelegramWebviewProxy !== 'undefined') return true;
    if (typeof window.TelegramWebviewProxyProto !== 'undefined') return true;
    if (typeof isTelegramWebView === 'function' && isTelegramWebView()) return true;
    return /Telegram/i.test(navigator.userAgent || '');
  }

  // Google Translate TTS — стабильно отдаёт mp3 (в т.ч. с умляутами). Лимит ~200
  // символов на запрос. Два хоста-зеркала на случай сбоя одного.
  function gUrl(host, text) {
    const t = String(text).slice(0, 200);
    return 'https://' + host + '/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=' + encodeURIComponent(t);
  }

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.playsInline = true;
      audio.setAttribute('playsinline', '');
    }
    return audio;
  }

  function unlock() {
    if (unlocked) return;
    const el = getAudio();
    try {
      el.muted = true;
      el.src = SILENT;
      const p = el.play();
      const done = () => {
        try { el.pause(); el.currentTime = 0; } catch (e) {}
        el.muted = false;
        unlocked = true;
      };
      if (p && typeof p.then === 'function') p.then(done).catch(() => { el.muted = false; });
      else done();
    } catch (e) {}
  }

  function playAudio(text) {
    const el = getAudio();
    el.muted = false;
    // На ошибке первого хоста пробуем второй Google-хост
    el.onerror = () => {
      el.onerror = null;
      el.src = gUrl('translate.googleapis.com', text);
      el.load();
      const p2 = el.play();
      if (p2 && p2.catch) p2.catch(() => {});
    };
    el.src = gUrl('translate.google.com', text);
    el.load();
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
  }

  function pickBestVoice() {
    const v = window.speechSynthesis?.getVoices() || [];
    return v.find(x => x.lang === 'de-DE') || v.find(x => x.lang.startsWith('de')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    // В Telegram нативная озвучка не звучит — сразу играем аудио.
    if (inTelegram()) {
      playAudio(text);
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

      // Сторож: если нативная озвучка не стартовала за 500 мс (тихий сбой Web
      // Speech), проигрываем аудио (элемент уже разблокирован первым касанием).
      let settled = false;
      const fallback = () => {
        if (settled) return;
        settled = true;
        try { window.speechSynthesis.cancel(); } catch (e) {}
        playAudio(text);
      };
      u.onstart = () => { settled = true; };
      u.onerror = fallback;
      window.speechSynthesis.speak(u);
      setTimeout(fallback, 500);
    } else {
      playAudio(text);
    }
  }

  function speakSlow(text) { speak(text, { rate: 0.65 }); }

  function init() {
    // Разблокировка аудио на первом же взаимодействии пользователя
    const onGesture = () => unlock();
    document.addEventListener('pointerdown', onGesture, { passive: true });
    document.addEventListener('touchend',   onGesture, { passive: true });
    document.addEventListener('click',      onGesture, { passive: true });

    if (window.speechSynthesis) {
      const update = () => { preferredVoice = pickBestVoice(); };
      window.speechSynthesis.onvoiceschanged = update;
      update();
    }
  }

  return { init, speak, speakSlow };
})();

TTS.init();
function speak(text)     { TTS.speak(text); }
function speakSlow(text) { TTS.speakSlow(text); }
