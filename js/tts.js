const TTS = (() => {
  const VERSION = 'v20';
  const PROXY = 'https://deutsch-meister-puce.vercel.app/api/tts';

  let preferredVoice = null;
  let audio = null;
  let actx = null;
  let currentSource = null;
  let unlocked = false;
  const bufCache = {};

  // Короткий "тихий" WAV (data URI, тот же origin) — разблокировка аудиоканала.
  const SILENT = 'data:audio/wav;base64,UklGRqQCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYACAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8A';

  /* ── Экранная диагностика (по умолчанию выключена; включить: в консоли
     localStorage.setItem('dm_tts_debug','1')) ── */
  function diag(msg) {
    try {
      let on = false;
      try { on = localStorage.getItem('dm_tts_debug') === '1'; } catch (e) {}
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

  function cleanText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  /* ── Синхронная подсветка слов ────────────────────────────────
     spans — массив DOM-элементов слов в порядке фразы.            */
  let hlSpans = null;
  let hlTimers = [];

  // Визуал задаём inline-стилями (не CSS-классом) — чтобы не зависеть от кэша
  // base.css, особенно в Telegram WebView. Только мягкое свечение (тень),
  // БЕЗ смены цвета текста — иначе слова «рябят» при быстром переключении.
  // Длинный transition даёт плавную волну: свечение соседних слов перетекает.
  const HL_TRANS = 'text-shadow .38s ease';
  function hlOn(el) {
    el.style.transition = HL_TRANS;
    el.style.textShadow = '0 0 16px var(--accent, #e8c547), 0 0 7px var(--accent, #e8c547)';
  }
  function hlOff(el) {
    el.style.transition = HL_TRANS;
    el.style.textShadow = '0 0 0 rgba(0,0,0,0)';
  }

  function hlClear() {
    hlTimers.forEach(t => clearTimeout(t));
    hlTimers = [];
    if (hlSpans) { hlSpans.forEach(hlOff); }
    hlSpans = null;
  }

  // Раскладка по длительности аудио, пропорционально длине слов.
  // Если длительность неизвестна (в TG <audio> она часто не готова к старту) —
  // оцениваем по буквам, чтобы подсветка запускалась в любом случае.
  function hlByDuration(spans, durSec) {
    hlClear();
    if (!spans || !spans.length) return;
    hlSpans = spans;
    const letters = s => Math.max(1, (s.textContent.match(/[A-Za-zÄäÖöÜüßÉé]/g) || []).length);
    const weights = spans.map(letters);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let ms = durSec * 1000;
    let estimated = false;
    if (!ms || !isFinite(ms) || ms <= 0) { ms = 300 + total * 70; estimated = true; }
    // У Google TTS есть небольшая пауза в начале/конце — чуть поджимаем.
    const lead = Math.min(120, ms * 0.04);
    const usable = ms * 0.92;
    let acc = 0;
    spans.forEach((el, i) => {
      const startAt = lead + (acc / total) * usable;
      acc += weights[i];
      const endAt = lead + (acc / total) * usable;
      hlTimers.push(setTimeout(() => hlOn(el), startAt));
      hlTimers.push(setTimeout(() => hlOff(el), endAt));
    });
    hlTimers.push(setTimeout(hlClear, ms + 250));
    diag('highlight: ' + spans.length + ' слов за ' + (ms / 1000).toFixed(2) + 'с' +
         (estimated ? ' (оценка)' : ''));
  }

  function wordCount(text) {
    return (cleanText(text).match(/[A-Za-zÄäÖöÜüß]+/g) || []).length;
  }

  function letterCount(text) {
    return (String(text || '').match(/[A-Za-zÄäÖöÜüßÉé]/g) || []).length;
  }

  /* ── Сессия озвучки ───────────────────────────────────────────
     Один вызов speak() = одна сессия. Она гарантирует, что
     opts.onEnd будет вызван РОВНО ОДИН РАЗ: при нормальном
     завершении, при ошибке и при прерывании. Каскад
     speechSynthesis → Web Audio → <audio> сессию не закрывает:
     onEnd отдаётся на итоговом исходе, а не на каждом шаге.

     Без onEnd сессия ничего не делает: ни таймеров, ни работы —
     старые вызовы (68 уроков) идут прежним путём.               */

  let activeSession = null;
  let endedHandler  = null;   // слушатель 'ended' на singleton <audio>

  // На <audio> держим не больше одного нашего слушателя.
  // ses === null — снять любой, иначе снять только слушатель этой сессии.
  function clearEnded(ses) {
    if (!endedHandler || !audio) return;
    if (ses && endedHandler.ses !== ses) return;
    try { audio.removeEventListener('ended', endedHandler); } catch (e) {}
    endedHandler = null;
  }

  // Без onEnd слушатель не нужен: у старых вызовов путь остаётся прежним
  function attachEnded(ses) {
    if (!ses || !ses.onEnd) return;
    clearEnded(null);
    endedHandler = () => ses.finish(true, 'end');
    endedHandler.ses = ses;
    getAudio().addEventListener('ended', endedHandler);
  }

  function newSession(text, onEnd) {
    const ses = {
      onEnd: (typeof onEnd === 'function') ? onEnd : null,
      // Базовая страховка из длины текста; ветки уточняют её по реальной
      // длительности, когда та известна (буфер Web Audio, <audio>.duration).
      base: (300 + letterCount(text) * 70) * 1.6,
      done: false,
      timer: null,

      finish(ok, reason) {
        if (ses.done) return;
        ses.done = true;
        if (ses.timer) { clearTimeout(ses.timer); ses.timer = null; }
        clearEnded(ses);
        if (activeSession === ses) activeSession = null;
        if (!ses.onEnd) return;
        try {
          ses.onEnd({ ok: !!ok, reason: reason || (ok ? 'end' : 'error') });
        } catch (e) {
          diag('onEnd бросил исключение: ' + (e && e.message));
        }
      },

      // Аварийная страховка, а не основной механизм: если событие
      // завершения не пришло, сессию закрываем сами.
      arm(ms) {
        if (!ses.onEnd || ses.done) return;
        const wait = Math.max(ses.base, ms || 0);
        if (ses.timer) clearTimeout(ses.timer);
        ses.timer = setTimeout(() => {
          diag('⏱ событие завершения не пришло за ' + Math.round(wait) + 'мс → страховка');
          ses.finish(true, 'timeout');
        }, wait);
      }
    };
    return ses;
  }

  function stopCurrent(reason) {
    const prev = activeSession;
    activeSession = null;
    hlClear();
    try { window.speechSynthesis?.cancel(); } catch (e) {}
    try {
      if (currentSource) {
        currentSource.onended = null;
        currentSource.stop(0);
      }
    } catch (e) {}
    currentSource = null;
    try {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (e) {}
    clearEnded(null);
    // onEnd прерванной озвучки отдаём уже после фактической остановки
    if (prev) prev.finish(false, reason || 'interrupted');
  }

  // Остановить текущую озвучку: onEnd приходит с признаком прерывания.
  function stop() { stopCurrent('interrupted'); }

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
  function playWebAudio(text, spans, ses) {
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
      currentSource = s;
      s.buffer = buf;
      s.connect(c.destination);
      s.onended = () => {
        if (currentSource === s) currentSource = null;
        if (ses) ses.finish(true, 'end');
      };
      s.start(0);
      hlByDuration(spans, buf.duration);   // точная длительность из буфера
      if (ses) ses.arm(buf.duration * 1000 * 1.6 + 500);
    });
  }

  /* ── Путь 2: <audio> с перебором источников ── */
  function playAudioEl(text, spans, ses) {
    const urls = [proxyUrl(text), gUrl('translate.google.com', text), gUrl('translate.googleapis.com', text)];
    const el = getAudio();
    try { el.pause(); el.currentTime = 0; } catch (e) {}
    el.muted = false;
    attachEnded(ses);
    let i = 0;
    const tryNext = () => {
      if (i >= urls.length) {
        diag('❌ audio: все источники молчат');
        if (ses) ses.finish(false, 'no-audio');
        return;
      }
      const url = urls[i++];
      el.onerror = () => { diag('audio error code=' + (el.error && el.error.code) + ' на #' + i + ' → next'); tryNext(); };
      el.onplaying = () => {
        diag('▶ PLAYING (audio) #' + i);
        hlByDuration(spans, el.duration);
        if (ses && isFinite(el.duration)) ses.arm(el.duration * 1000 * 1.6 + 500);
      };
      el.src = url;
      el.load();
      const p = el.play();
      if (p && typeof p.then === 'function') {
        p.then(() => diag('play() ok (audio) #' + i)).catch(e => { diag('play() reject: ' + e.name + ' → next'); tryNext(); });
      }
    };
    tryNext();
  }

  function speakAudio(text, spans, ses) {
    playWebAudio(text, spans, ses)
      .then(() => diag('✅ WebAudio сыграл'))
      .catch(e => { diag('WebAudio не смог: ' + (e && e.message) + ' → <audio>'); playAudioEl(text, spans, ses); });
  }

  function pickBestVoice() {
    const v = window.speechSynthesis?.getVoices() || [];
    return v.find(x => x.lang === 'de-DE') || v.find(x => x.lang.startsWith('de')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1, fallbackDelay = null, spans = null, onEnd = null } = {}) {
    text = cleanText(text);
    if (!text) {
      // Озвучивать нечего, но ждущий onEnd не должен зависнуть
      if (typeof onEnd === 'function') setTimeout(() => onEnd({ ok: false, reason: 'empty' }), 0);
      return;
    }
    const words = wordCount(text);
    const delay = fallbackDelay ?? (words > 1 ? 1800 : 700);

    stopCurrent();   // прерывает предыдущую озвучку и отдаёт её onEnd

    const ses = newSession(text, onEnd);
    activeSession = ses;
    ses.arm(0);      // базовая страховка; ветки уточнят по длительности
    unlock();   // мы внутри пользовательского жеста (onclick) — разблокируем тут же
    diag('speak "' + text + '"\nplatform=' + platform() + ' inTG=' + inTelegram() +
         ' ctx=' + ((getCtx() || {}).state) + ' words=' + words + ' fb=' + delay);

    // Фразы с подсветкой всегда идём через аудио-путь: там известна точная
    // длительность MP3, поэтому подсветка синхронна и в браузере, и в Telegram.
    // (speechSynthesis.onboundary ненадёжен — на многих голосах не срабатывает.)
    if (inTelegram() || (spans && spans.length)) { speakAudio(text, spans, ses); return; }

    const bestVoice = pickBestVoice();
    if (hasSpeech() && bestVoice) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'de-DE';
      u.rate  = rate;
      u.pitch = pitch;
      u.voice = preferredVoice || bestVoice;
      let settled = false;
      let abandoned = false;   // ушли на аудио-путь: onend этой фразы не наш
      const fb = () => {
        if (settled) return;
        settled = true;
        abandoned = true;
        try { window.speechSynthesis.cancel(); } catch (e) {}
        speakAudio(text, spans, ses);
      };
      u.onstart = () => { settled = true; };
      u.onend   = () => { if (!abandoned) ses.finish(true, 'end'); };
      u.onerror = () => {
        // Уже говорил и сломался — фолбэк не поможет, закрываем сессию
        if (settled) { ses.finish(false, 'error'); return; }
        fb();
      };
      window.speechSynthesis.speak(u);
      setTimeout(fb, delay);
    } else {
      speakAudio(text, spans, ses);
    }
  }

  function speakPhrase(text, spans, opts) {
    speak(text, Object.assign(
      { rate: 0.82, fallbackDelay: 2200, spans: spans || null },
      opts || {}
    ));
  }

  function speakSlow(text, opts) {
    speak(text, Object.assign({ rate: 0.65 }, opts || {}));
  }

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

  return { init, speak, speakPhrase, speakSlow, stop };
})();

TTS.init();
function speak(text)     { TTS.speak(text); }
function speakPhrase(text) { TTS.speakPhrase(text); }
function speakSlow(text) { TTS.speakSlow(text); }

// Озвучка фразы с синхронной подсветкой слов внутри её карточки.
function speakPhraseEl(btn, text) {
  let spans = [];
  try {
    const card = btn.closest('.phrase-card');
    if (card) spans = Array.prototype.slice.call(card.querySelectorAll('.phrase-de .word-speak'));
  } catch (e) {}
  TTS.speakPhrase(text, spans);
}
