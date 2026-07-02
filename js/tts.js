const TTS = (() => {
  const VERSION = 'v15';
  const PROXY = 'https://deutsch-meister-puce.vercel.app/api/tts';

  let preferredVoice = null;
  let audio = null;
  let actx = null;
  let unlocked = false;
  const bufCache = {};

  // Короткий "тихий" WAV (data URI, тот же origin) — разблокировка аудиоканала.
  const SILENT = 'data:audio/wav;base64,UklGRqQCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYACAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8A';

  /* ── Экранная диагностика (видна в Telegram или при dm_tts_debug=1) ── */
  function diag(msg) {
    try {
      let on = inTelegram();
      if (!on) { try { on = localStorage.getItem('dm_tts_debug') === '1'; } catch (e) {} }
      if (!on) return;
      let box = document.getElementById('ttsDiag');
      if (!box) {
        box = document.createElement('div');
        box.id = 'ttsDiag';
        box.style.cssText =
          'position:fixed;top:6px;left:6px;right:6px;z-index:100000;' +
          'background:rgba(0,0,0,.86);color:#7dff7d;font:11px/1.45 monospace;' +
          'padding:7px 9px;border-radius:8px;max-height:44vh;overflow:auto;' +
          'white-space:pre-wrap;word-break:break-word;pointer-events:none';
        (document.body || document.documentElement).appendChild(box);
      }
      box.textContent = '[TTS ' + VERSION + '] ' + msg + '\n' + box.textContent;
      clearTimeout(box._t);
      box._t = setTimeout(() => { try { box.remove(); } catch (e) {} }, 10000);
    } catch (e) {}
  }

  const hasSpeech = () => {
    if (!window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().length > 0;
  };

  function platform() {
    const wa = window.Telegram && window.Telegram.WebApp;
    return (wa && wa.platform) || '';
  }

  function inTelegram() {
    const wa = window.Telegram && window.Telegram.WebApp;
    if (wa && wa.platform && wa.platform !== 'unknown') return true;
    if (typeof window.TelegramWebviewProxy !== 'undefined') return true;
    if (typeof window.TelegramWebviewProxyProto !== 'undefined') return true;
    if (typeof isTelegramWebView === 'function' && isTelegramWebView()) return true;
    return /Telegram/i.test(navigator.userAgent || '');
  }

  function getCtx() {
    if (!actx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) { try { actx = new C(); } catch (e) {} }
    }
    return actx;
  }

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.playsInline = true;
      try { audio.setAttribute('playsinline', ''); } catch (e) {}
    }
    return audio;
  }

  // Разблокировка на квалифицирующем жесте (click/touchend). touchstart на iOS
  // НЕ считается активацией — поэтому его не используем.
  function unlock() {
    if (!unlocked) {
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
    const c = getCtx();
    if (c && c.state === 'suspended') { try { c.resume(); } catch (e) {} }
  }

  function gUrl(host, text) {
    return 'https://' + host + '/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=' +
           encodeURIComponent(String(text).slice(0, 200));
  }
  function proxyUrl(text) {
    return PROXY + '?tl=de&text=' + encodeURIComponent(String(text).slice(0, 200));
  }

  /* ── Путь 1: Web Audio (надёжнее в WebView) ── */
  function playWebAudio(text) {
    const c = getCtx();
    if (!c) return Promise.reject(new Error('no AudioContext'));
    const key = text;
    const get = bufCache[key]
      ? Promise.resolve(bufCache[key])
      : fetch(proxyUrl(text))
          .then(r => { if (!r.ok) throw new Error('proxy HTTP ' + r.status); return r.arrayBuffer(); })
          .then(ab => new Promise((res, rej) => { c.decodeAudioData(ab, res, rej); }))
          .then(buf => { bufCache[key] = buf; return buf; });
    return get.then(buf => {
      if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }
      const s = c.createBufferSource();
      s.buffer = buf;
      s.connect(c.destination);
      s.start(0);
    });
  }

  /* ── Путь 2: <audio> с перебором источников ── */
  function playAudioEl(text) {
    const urls = [proxyUrl(text), gUrl('translate.google.com', text), gUrl('translate.googleapis.com', text)];
    const el = getAudio();
    el.muted = false;
    let i = 0;
    const tryNext = () => {
      if (i >= urls.length) { diag('❌ audio: все источники молчат'); return; }
      const url = urls[i++];
      el.onerror = () => { diag('audio error code=' + (el.error && el.error.code) + ' на #' + i + ' → next'); tryNext(); };
      el.onplaying = () => diag('▶ PLAYING (audio) #' + i);
      el.src = url;
      el.load();
      const p = el.play();
      if (p && typeof p.then === 'function') {
        p.then(() => diag('play() ok (audio) #' + i)).catch(e => { diag('play() reject: ' + e.name + ' → next'); tryNext(); });
      }
    };
    tryNext();
  }

  function speakAudio(text) {
    playWebAudio(text)
      .then(() => diag('✅ WebAudio сыграл'))
      .catch(e => { diag('WebAudio не смог: ' + (e && e.message) + ' → <audio>'); playAudioEl(text); });
  }

  function pickBestVoice() {
    const v = window.speechSynthesis?.getVoices() || [];
    return v.find(x => x.lang === 'de-DE') || v.find(x => x.lang.startsWith('de')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1 } = {}) {
    unlock();   // мы внутри пользовательского жеста (onclick) — разблокируем тут же
    diag('speak "' + text + '"\nplatform=' + platform() + ' inTG=' + inTelegram() +
         ' ctx=' + ((getCtx() || {}).state));

    if (inTelegram()) { speakAudio(text); return; }

    const bestVoice = pickBestVoice();
    if (hasSpeech() && bestVoice) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      u.voice = preferredVoice || bestVoice;
      let settled = false;
      const fb = () => {
        if (settled) return;
        settled = true;
        try { window.speechSynthesis.cancel(); } catch (e) {}
        speakAudio(text);
      };
      u.onstart = () => { settled = true; };
      u.onerror = fb;
      window.speechSynthesis.speak(u);
      setTimeout(fb, 500);
    } else {
      speakAudio(text);
    }
  }

  function speakSlow(text) { speak(text, { rate: 0.65 }); }

  function init() {
    const g = () => unlock();
    document.addEventListener('touchend', g, { passive: true });
    document.addEventListener('click',    g, { passive: true });

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
