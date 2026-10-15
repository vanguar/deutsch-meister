// E2E с настоящим звуком: озвучка диалога так, как в Telegram.
//   python -m http.server 8765   (из корня репо)
//   node --experimental-websocket tools/e2e/dialogs_audio.mjs [a1-01]
// Chrome притворяется Telegram WebView (User-Agent с «Telegram»), поэтому
// TTS идёт аудио-путём: mp3 Google TTS через прокси /api/tts → Web Audio.
// Нужен интернет. Проверяет: каждая реплика скачана и сыграна по порядку,
// второму персонажу — сдвиг тона (playbackRate), «🎭» его выключает,
// паузы между репликами короткие (следующая реплика качается заранее),
// стоп посередине глушит звук. Сам звук не слушаем — в headless его нет.
import { start } from './cdp.mjs';

const B = 'http://127.0.0.1:8765';
const ID = process.argv[2] || 'a1-01';
// --disable-audio-output: фиктивный аудиовыход. Без него в headless часы
// AudioContext идут в ~3.5 раза медленнее, и реплики «длятся» дольше.
const c = await start(9334, ['--autoplay-policy=no-user-gesture-required', '--disable-audio-output']);
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };
async function waitFor(expr, ms = 6000) {
  for (let t = 0; t < ms; t += 100) { if (await c.ev(expr)) return true; await c.wait(100); }
  return false;
}

await c.send('Network.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36 Telegram-Android/11.2' });
// Журнал Web Audio: каждый старт источника — время, скорость, длительность
await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  window.__src = [];
  const P = AudioBufferSourceNode.prototype, st = P.start;
  P.start = function () {
    const s = this;
    const rec = { t: performance.now(), rate: s.playbackRate.value, dur: s.buffer ? s.buffer.duration : 0, end: 0 };
    window.__src.push(rec);
    s.addEventListener('ended', () => { rec.end = performance.now(); });
    return st.apply(s, arguments);
  };
  window.__proxy = 0;
  const f = window.fetch;
  window.fetch = function (u) { if (/\\/api\\/tts/.test(String(u))) window.__proxy++; return f.apply(this, arguments); };
})();` });
await c.go(`${B}/dialogs.html?audio=1#d=${ID}`, 2500);
ok(await waitFor(`typeof Dialogs !== 'undefined' && Dialogs.dialog && document.querySelectorAll('.dlg-line').length > 0`), `${ID}: открыт`);
ok(await c.ev(`TTS.inTelegram() && TTS.mode() === 'audio'`), 'режим Telegram: аудио-путь (mp3 Google TTS)');
const plan = JSON.parse(await c.ev(`JSON.stringify(Dialogs.voicePlan())`));
const sp = JSON.parse(await c.ev(`JSON.stringify(Dialogs.dialog.lines.map(l => l.s))`));
const n = sp.length;
ok(await c.ev(`!document.getElementById('dlgTone').hidden`), 'кнопка «🎭» видна в аудио-режиме');
console.log('    подпись: ' + await c.ev(`document.getElementById('dlgVoiceNote').textContent.trim()`));

await c.ev(`document.getElementById('dlgPlay').click()`);
ok(await waitFor(`typeof Dialogs !== 'undefined' && Dialogs.playing === null && window.__src.length > 0`, 120000), 'диалог доигран');
const src = JSON.parse(await c.ev(`JSON.stringify(window.__src)`));
const proxy = await c.ev(`window.__proxy`);
ok(src.length === n, `сыграно реплик: ${src.length} из ${n}`);
ok(proxy === n, `запросов к прокси: ${proxy} — по одному на реплику (предзагрузка не дублирует)`);
const wantRate = sp.map(s => Math.pow(2, ((s === 'A' ? plan.A.detune : plan.B.detune) || 0) / 1200));
ok(src.every((s, i) => Math.abs(s.rate - wantRate[i]) < 1e-6), `тон по персонажам: ${[...new Set(src.map(s => s.rate.toFixed(3)))].join(' / ')}`);
ok(src.every(s => s.dur > 0.3 && s.end > 0), 'каждая реплика — настоящий звук и доиграна до конца');
const pauses = src.slice(1).map((s, i) => Math.round(s.t - src[i].end));
ok(Math.max(...pauses) < 1200, `паузы между репликами ${Math.min(...pauses)}–${Math.max(...pauses)} мс (с предзагрузкой)`);

// «🎭» выключает сдвиг тона — все реплики с обычной скоростью (из кэша, без сети)
await c.ev(`document.getElementById('dlgTone').click(); window.__src = []; window.__proxy = 0`);
await c.ev(`document.querySelectorAll('.dlg-say')[1].click()`);
await waitFor(`Dialogs.playing === null && window.__src.length === 1`, 20000);
ok(await c.ev(`window.__src[0].rate === 1 && window.__proxy === 0`), '«🎭» выкл: обычный тон, реплика из кэша без запроса');
await c.ev(`document.getElementById('dlgTone').click()`);

// стоп посередине: текущий источник останавливается, новых нет
await c.ev(`window.__src = []; document.getElementById('dlgPlay').click()`);
await waitFor(`window.__src.length >= 2`, 30000);
await c.ev(`document.getElementById('dlgPlay').click()`);
const k = await c.ev(`window.__src.length`);
await c.wait(2500);
ok(await c.ev(`window.__src.length`) === k && await c.ev(`!ReaderSpeak.isPlaying()`), `стоп: после ${k}-й реплики звук не продолжается`);
const errs = c.errors();
ok(!errs.length, 'ошибок JS нет' + (errs.length ? ': ' + errs.join(' | ').slice(0, 300) : ''));
c.close();
console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВсе проверки пройдены');
process.exit(fail ? 1 : 0);
