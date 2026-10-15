#!/usr/bin/env node
/* ═══════════════════════════════════════════════
   tools/test_dialogs_tts.js — юнит-тест озвучки диалогов без браузера

   js/tts.js и js/reader-speak.js в vm с заглушками speechSynthesis,
   AudioContext, <audio>, fetch и Telegram. Проверяет:
     • старые вызовы (уроки, книги, новости) идут прежним путём:
       системный голос — лучший, pitch 1; в Telegram — Web Audio без
       сдвига скорости; <audio> — обычная скорость с сохранением высоты;
     • новые опции: voiceName выбирает голос, detune меняет тон на
       аудио-пути (Web Audio и <audio>) и не «прилипает» к следующей фразе;
     • предзагрузка: фраза качается один раз, игра берёт её из кэша;
     • очередь ReaderSpeak: порядок реплик, опции голоса у каждой,
       пауза между репликами, предзагрузка следующей, остановка и
       повторный запуск, замена очереди новой.
   Запуск: node tools/test_dialogs_tts.js
   ═══════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const TTS_SRC = fs.readFileSync(path.join(ROOT, 'js/tts.js'), 'utf8');
const RS_SRC = fs.readFileSync(path.join(ROOT, 'js/reader-speak.js'), 'utf8');

let fails = 0;
function check(name, cond, extra) {
  console.log((cond ? '  ok   ' : '  FAIL ') + name + (!cond && extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
  if (!cond) fails++;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

const VOICES = [
  { name: 'Microsoft Hedda - German (Germany)', lang: 'de-DE', localService: true },
  { name: 'Microsoft Katja Online (Natural) - German (Germany)', lang: 'de-DE', localService: false },
  { name: 'Microsoft Conrad Online (Natural) - German (Germany)', lang: 'de-DE', localService: false },
  { name: 'Google UK English Female', lang: 'en-GB', localService: false }
];

/* Окружение: tg — Telegram WebView (аудио-путь), voices — голоса системы,
   webAudio=false — Web Audio падает и работает <audio> */
function boot({ tg = false, voices = VOICES, webAudio = true, fetchMs = 5 } = {}) {
  const log = { utter: [], fetch: [], sources: [], audio: [] };
  const synth = {
    speaking: false, cur: null,
    getVoices: () => voices,
    speak(u) {
      log.utter.push(u);
      synth.cur = u; synth.speaking = true;
      setTimeout(() => { if (synth.cur === u) u.onstart && u.onstart(); }, 2);
      setTimeout(() => { if (synth.cur === u) { synth.speaking = false; synth.cur = null; u.onend && u.onend(); } }, 12);
    },
    cancel() {
      const u = synth.cur;
      synth.cur = null; synth.speaking = false;
      if (u && u.onerror) u.onerror({ error: 'interrupted' });
    },
    addEventListener() {}
  };
  class Utter { constructor(t) { this.text = t; this.pitch = 1; this.rate = 1; } }
  class Ctx {
    constructor() { this.state = 'running'; }
    resume() {}
    decodeAudioData(ab, res, rej) { if (!webAudio) { rej(new Error('decode')); return; } setTimeout(() => res({ duration: 0.02 }), 1); }
    createBufferSource() {
      const s = { playbackRate: { value: 1 }, connect() {}, stop() { s.stopped = true; },
        start() { log.sources.push(s); setTimeout(() => { if (!s.stopped && s.onended) s.onended(); }, 10); } };
      return s;
    }
    get destination() { return {}; }
  }
  class AudioEl {
    constructor() {
      this.listeners = {}; this.paused = true; this.ended = false; this.duration = 0.02;
      this.preservesPitch = true; this.playbackRate = 1; this.defaultPlaybackRate = 1;
    }
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
    removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter(x => x !== f); }
    load() { this.playbackRate = this.defaultPlaybackRate; }
    pause() { this.paused = true; }
    play() {
      if (/^data:/.test(this.src)) return Promise.resolve();
      this.paused = false;
      log.audio.push({ src: this.src, rate: this.playbackRate, keep: this.preservesPitch });
      const src = this.src;
      setTimeout(() => { if (this.src === src && this.onplaying) this.onplaying(); }, 1);
      setTimeout(() => {
        if (this.src !== src || this.paused) return;
        this.paused = true; (this.listeners.ended || []).forEach(f => f());
      }, 10);
      return Promise.resolve();
    }
  }
  const ctx = {
    navigator: { userAgent: tg ? 'Mozilla/5.0 Telegram-Android' : 'Mozilla/5.0 Chrome', onLine: true },
    speechSynthesis: synth, SpeechSynthesisUtterance: Utter,
    AudioContext: Ctx, Audio: AudioEl,
    fetch: url => { log.fetch.push(url); return sleep(fetchMs).then(() => ({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) })); },
    localStorage: { getItem: () => null, setItem() {} },
    document: { addEventListener() {}, getElementById: () => null,
      createElement: () => ({ classList: { add() {}, remove() {} } }), body: { appendChild() {} } },
    setTimeout, clearTimeout, Promise, Math, Object, Array, String, Number, JSON, RegExp, Error, encodeURIComponent, console,
    isFinite
  };
  if (tg) ctx.Telegram = { WebApp: { platform: 'android' } };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(TTS_SRC + '\n;this.TTS = TTS;', ctx);
  vm.runInContext(RS_SRC + '\n;this.ReaderSpeak = ReaderSpeak;', ctx);
  return { ctx, TTS: ctx.TTS, RS: ctx.ReaderSpeak, log, synth };
}

function speakAsync(TTS, text, opts) {
  return new Promise(res => TTS.speak(text, Object.assign({}, opts || {}, { onEnd: res })));
}

(async () => {
  console.log('1. Старые вызовы — прежний путь');
  {
    const { TTS, log } = boot();
    const r = await speakAsync(TTS, 'Guten Morgen');
    const u = log.utter[0];
    check('браузер: системный голос, исход end', r.ok && r.reason === 'end', r);
    check('браузер: голос — лучший (Natural), не Hedda', u && /Katja|Conrad/.test(u.voice.name), u && u.voice.name);
    check('браузер: pitch 1, rate 0.85 по умолчанию', u.pitch === 1 && u.rate === 0.85);
    check('браузер: mp3 не качается', log.fetch.length === 0);
    check('mode() = speech', TTS.mode() === 'speech');
  }
  {
    const { TTS, log } = boot({ tg: true });
    const r = await speakAsync(TTS, 'Guten Morgen');
    check('Telegram: Web Audio, исход end', r.ok && log.sources.length === 1, r);
    check('Telegram: скорость буфера 1 (без detune)', log.sources[0].playbackRate.value === 1);
    check('Telegram: системный голос не трогаем', log.utter.length === 0);
    check('mode() = audio', TTS.mode() === 'audio');
  }
  {
    const { TTS, log } = boot({ tg: true, webAudio: false });
    const r = await speakAsync(TTS, 'Hallo');
    check('<audio>: сыграл, скорость 1, высота сохраняется', r.ok && log.audio.length === 1 && log.audio[0].rate === 1 && log.audio[0].keep === true, log.audio);
  }

  console.log('2. Новые опции: голос и тон');
  {
    const { TTS, log } = boot();
    await speakAsync(TTS, 'Hallo', { voiceName: 'Microsoft Conrad Online (Natural) - German (Germany)', pitch: 0.85 });
    check('voiceName выбирает голос', log.utter[0].voice.name.includes('Conrad'), log.utter[0].voice.name);
    check('pitch передаётся системному голосу', log.utter[0].pitch === 0.85);
    await speakAsync(TTS, 'Hallo', { voiceName: 'Nicht vorhanden' });
    check('неизвестный voiceName → лучший голос', /Katja|Conrad/.test(log.utter[1].voice.name));
    const names = TTS.germanVoices().map(v => v.name);
    check('germanVoices: только немецкие, Hedda последней', names.length === 3 && /Hedda/.test(names[2]), names);
    check('voiceGender: Katja f, Conrad m, Hedda f', TTS.voiceGender(VOICES[1]) === 'f' && TTS.voiceGender(VOICES[2]) === 'm' && TTS.voiceGender(VOICES[0]) === 'f');
    check('voiceGender: неизвестное имя → пусто', TTS.voiceGender({ name: 'Deutsch 3' }) === '');
  }
  {
    const { TTS, log } = boot({ tg: true });
    await speakAsync(TTS, 'Ich heiße Taras.', { detune: -150 });
    const pr = log.sources[0].playbackRate.value;
    check('Web Audio: detune −150 → скорость 2^(−150/1200)', Math.abs(pr - Math.pow(2, -150 / 1200)) < 1e-9, pr);
    await speakAsync(TTS, 'Freut mich!');
    check('следующая фраза без detune — снова 1', log.sources[1].playbackRate.value === 1);
    await speakAsync(TTS, 'Zu tief', { detune: -5000 });
    check('detune ограничен ±400 центов', Math.abs(log.sources[2].playbackRate.value - Math.pow(2, -400 / 1200)) < 1e-9);
  }
  {
    const { TTS, log } = boot({ tg: true, webAudio: false });
    await speakAsync(TTS, 'Guten Tag', { detune: -150 });
    const a = log.audio[0];
    check('<audio>: detune → playbackRate < 1 и preservesPitch=false', a.rate < 0.95 && a.keep === false, a);
    await speakAsync(TTS, 'Tschüss');
    check('<audio>: следующая фраза — скорость 1 и высота сохраняется', log.audio[1].rate === 1 && log.audio[1].keep === true, log.audio[1]);
  }

  console.log('3. Предзагрузка');
  {
    const { TTS, log } = boot({ tg: true, fetchMs: 30 });
    TTS.preload('Zwei Brötchen, bitte.');
    await sleep(5);
    const r = await speakAsync(TTS, 'Zwei Brötchen, bitte.');
    check('предзагрузка + игра той же фразы = один запрос', r.ok && log.fetch.length === 1, log.fetch.length);
    await speakAsync(TTS, 'Zwei Brötchen, bitte.');
    check('повтор фразы — из кэша, без запроса', log.fetch.length === 1);
  }
  {
    const { TTS, log } = boot();
    TTS.preload('Hallo');
    await sleep(10);
    check('браузер с голосом: preload ничего не качает', log.fetch.length === 0);
  }

  console.log('4. Очередь ReaderSpeak');
  {
    const { RS, log } = boot();
    const order = [];
    const done = await new Promise(res => RS.run([
      { text: 'Guten Morgen!', idx: 0, tts: { voiceName: 'Microsoft Katja Online (Natural) - German (Germany)' } },
      { text: 'Hallo!', idx: 1, tts: { voiceName: 'Microsoft Conrad Online (Natural) - German (Germany)', pitch: 0.9 } },
      { text: 'Wie geht es Ihnen?', idx: 2, tts: { voiceName: 'Microsoft Katja Online (Natural) - German (Germany)' } }
    ], { rate: 0.8, gap: 30, onItem: it => order.push([it.idx, Date.now()]), onDone: res }));
    check('реплики по порядку, исход end', done.ok && order.map(x => x[0]).join() === '0,1,2', { done, order });
    check('у каждой реплики свой голос', log.utter.map(u => /Katja/.test(u.voice.name) ? 'K' : 'C').join('') === 'KCK');
    check('rate очереди и pitch реплики', log.utter[0].rate === 0.8 && log.utter[1].pitch === 0.9 && log.utter[2].pitch === 1);
    check('пауза между репликами ≥ gap', order[1][1] - order[0][1] >= 30 + 10, order.map(x => x[1] - order[0][1]));
  }
  {
    const { RS, log } = boot({ tg: true, fetchMs: 20 });
    const long = 'Ich habe mir die Wohnung angesehen, und sie gefällt mir sehr gut, aber die Miete ist für mich leider zu hoch, weil ich im Moment nur einen Minijob habe und die Nebenkosten noch dazukommen, deshalb möchte ich gern verhandeln.';
    const done = await new Promise(res => RS.run([
      { text: 'Erste Zeile.', tts: { detune: 0 } }, { text: long, tts: { detune: -150 } }, { text: 'Danke!', tts: { detune: 0 } }
    ], { preload: true, gap: 5, onDone: res }));
    const uniq = new Set(log.fetch).size;
    check('Telegram: длинная реплика режется по 200 символов', RS.chunkForTts(long).length >= 2 && RS.chunkForTts(long).every(c => c.length <= 200));
    check('Telegram: всё сыграно, каждый кусок скачан один раз (предзагрузка)', done.ok && log.fetch.length === uniq && uniq === 2 + RS.chunkForTts(long).length, { fetch: log.fetch.length, uniq });
    const rates = log.sources.map(s => s.playbackRate.value);
    check('тон: кускам длинной реплики — detune, остальным — нет', rates[0] === 1 && rates.slice(1, -1).every(r => r < 1) && rates[rates.length - 1] === 1, rates);
  }
  {
    const { RS, log } = boot();
    let doneRes = null;
    const items = [{ text: 'Eins.' }, { text: 'Zwei.' }, { text: 'Drei.' }, { text: 'Vier.' }];
    RS.run(items, { gap: 20, onDone: r => { doneRes = r; } });
    await sleep(8);
    RS.stop();
    const n = log.utter.length;
    await sleep(120);
    check('стоп: onDone с interrupted', doneRes && !doneRes.ok && doneRes.reason === 'interrupted', doneRes);
    check('стоп: дальше ничего не звучит', log.utter.length === n, { before: n, after: log.utter.length });
    check('стоп: isPlaying = false', !RS.isPlaying());
    const again = await new Promise(res => RS.run(items, { onDone: res }));
    check('повторный запуск после стопа играет всё', again.ok && log.utter.length === n + 4, log.utter.length);
  }
  {
    const { RS, log } = boot();
    let first = null;
    RS.run([{ text: 'Alt eins.' }, { text: 'Alt zwei.' }], { onDone: r => { first = r; } });
    await sleep(5);
    const second = await new Promise(res => RS.run([{ text: 'Neu.' }], { onDone: res }));
    check('новая очередь прерывает старую', first && first.reason === 'interrupted' && second.ok, { first, second });
    check('после замены старые реплики не доигрываются', !log.utter.slice(1).some(u => /Alt zwei/.test(u.text)));
  }
  {
    // книги/новости: ReaderSpeak.page без новых опций — без пауз и предзагрузки
    const { RS, log } = boot({ tg: true });
    const t0 = Date.now();
    const r = await new Promise(res => RS.page([{ text: 'Satz eins.' }, { text: 'Satz zwei.' }], { onDone: res }));
    check('page(): как раньше — всё сыграно, без лишних запросов', r.ok && log.fetch.length === 2 && log.sources.every(s => s.playbackRate.value === 1));
    check('page(): без пауз между предложениями', Date.now() - t0 < 500);
  }
  {
    const { RS, log } = boot();
    await new Promise(res => RS.page([{ text: 'Satz eins.' }], { onDone: res }));
    check('page() в браузере: rate 0.9, лучший голос, pitch 1', log.utter[0].rate === 0.9 && /Katja|Conrad/.test(log.utter[0].voice.name) && log.utter[0].pitch === 1);
  }

  console.log(fails ? `\nПРОВАЛЕНО: ${fails}` : '\nВсе проверки пройдены');
  process.exitCode = fails ? 1 : 0;
})();
