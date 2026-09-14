/* ═══════════════════════════════════════════════
   reader-speak.js — озвучка в ридере
   Deutsch Meister Course

   Очередь построена на opts.onEnd из js/tts.js (этап 4A): следующий
   кусок стартует по событию завершения предыдущего, без оценки
   длительности и без таймеров.

   Прокси Google TTS обрезает текст до 200 символов, поэтому длинные
   предложения режутся chunkForTts() по границам клауз. Склейка чанков
   даёт исходную строку символ в символ — куски сохраняют свою
   пунктуацию и пробелы.

   Zero dependencies (нужен только TTS из js/tts.js).
   ═══════════════════════════════════════════════ */

const ReaderSpeak = (() => {

  const MAX  = 200;   // лимит прокси
  const CONJ = ['dass', 'weil', 'und', 'aber', 'denn', 'oder', 'sondern'];

  /* ── Нарезка под лимит прокси ── */

  // Длинное слово (> MAX) режем только в крайнем случае: в живом тексте
  // таких нет, но лучше отдать два куска, чем молча потерять хвост.
  function bySpace(piece) {
    if (piece.length <= MAX) return [piece];
    const out = [];
    let rest = piece;
    while (rest.length > MAX) {
      let cut = rest.lastIndexOf(' ', MAX - 1);
      if (cut <= 0) {
        console.warn('[ReaderSpeak] слово длиннее лимита, режем по ' + MAX);
        cut = MAX - 1;
      }
      out.push(rest.slice(0, cut + 1));   // пробел остаётся в левом куске
      rest = rest.slice(cut + 1);
    }
    if (rest) out.push(rest);
    return out;
  }

  function chunkForTts(text) {
    const src = String(text == null ? '' : text);
    if (!src.trim()) return [];
    if (src.length <= MAX) return [src];

    // 1) точки разреза: после , ; : — – и перед союзом
    const cuts = new Set();
    let m;

    const punct = /[,;:—–]\s+/g;
    while ((m = punct.exec(src)) !== null) cuts.add(m.index + m[0].length);

    const conj = new RegExp('\\s+(?:' + CONJ.join('|') + ')\\s+', 'gi');
    while ((m = conj.exec(src)) !== null) {
      const lead = (m[0].match(/^\s+/) || [''])[0].length;
      cuts.add(m.index + lead);           // пробел слева, союз начинает кусок
      conj.lastIndex = m.index + lead + 1;
    }

    const idx = [0].concat(Array.from(cuts).sort((a, b) => a - b), [src.length])
      .filter((v, i, a) => i === 0 || v !== a[i - 1]);

    // 2) куски, каждый не длиннее лимита
    let pieces = [];
    for (let i = 0; i + 1 < idx.length; i++) {
      pieces = pieces.concat(bySpace(src.slice(idx[i], idx[i + 1])));
    }

    // 3) жадная склейка до лимита
    const out = [];
    let buf = '';
    pieces.forEach(p => {
      if (!buf) { buf = p; return; }
      if (buf.length + p.length <= MAX) buf += p;
      else { out.push(buf); buf = p; }
    });
    if (buf) out.push(buf);
    return out;
  }

  /* ── Тост об ошибке (тихий, без alert и модалок) ── */

  function toast(msg) {
    try {
      let el = document.getElementById('rdToast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'rdToast';
        el.className = 'dm-toast';        // вид уже есть в css/base.css
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(el._t);
      el._t = setTimeout(() => { try { el.classList.remove('show'); } catch (e) {} }, 2600);
    } catch (e) {
      console.warn('[ReaderSpeak] тост не показался', e);
    }
  }

  /* ── Очередь ── */

  // gen растёт на каждом старте и остановке: висящие onEnd от прерванной
  // озвучки сравнивают свой token с gen и молча выходят.
  let gen   = 0;
  let state = null;   // { kind, token, q, k, rate, onItem, onDone }

  function isPlaying(kind) {
    if (!state) return false;
    return kind ? state.kind === kind : true;
  }

  function finish(ok, reason) {
    const prev = state;
    state = null;
    gen++;
    if (prev && typeof prev.onDone === 'function') {
      try { prev.onDone({ ok: !!ok, reason: reason || (ok ? 'end' : 'stopped') }); }
      catch (e) { console.warn('[ReaderSpeak] onDone бросил исключение', e); }
    }
  }

  function stop() {
    if (!state) { try { TTS.stop(); } catch (e) {} return; }
    gen++;                              // onEnd прерванного куска станет чужим
    try { TTS.stop(); } catch (e) {}
    finish(false, 'interrupted');
  }

  function step() {
    if (!state) return;
    const token = state.token;
    if (token !== gen) return;

    if (state.k >= state.q.length) { finish(true, 'end'); return; }

    const cur = state.q[state.k++];
    if (cur.first && typeof state.onItem === 'function') {
      try { state.onItem(cur.item, cur.idx); }
      catch (e) { console.warn('[ReaderSpeak] onItem бросил исключение', e); }
    }

    TTS.speak(cur.chunk, {
      rate: state.rate,
      onEnd: res => {
        if (!state || state.token !== token || token !== gen) return;   // прервали
        if (res.reason === 'interrupted') return;                       // остановлены
        if (res.reason === 'empty') { step(); return; }                 // нечего играть
        if (!res.ok) {
          console.warn('[ReaderSpeak] озвучка не удалась: ' + res.reason);
          toast('Озвучка недоступна');
          finish(false, res.reason);
          return;
        }
        step();
      }
    });
  }

  // items: [{ text, el }] — для предложения один элемент, для страницы много
  function run(items, opts) {
    const o = opts || {};
    stop();                             // новый запрос прерывает прежний

    const list = (items || []).filter(it => it && String(it.text || '').trim());
    if (!list.length) return false;

    const q = [];
    list.forEach((it, idx) => {
      chunkForTts(it.text).forEach((chunk, ci) => {
        q.push({ chunk, item: it, idx, first: ci === 0 });
      });
    });
    if (!q.length) return false;

    state = {
      kind:   o.kind || 'text',
      token:  gen,
      q:      q,
      k:      0,
      rate:   typeof o.rate === 'number' ? o.rate : 0.9,
      onItem: o.onItem || null,
      onDone: o.onDone || null
    };
    step();
    return true;
  }

  /* ── Публичные сценарии ── */

  // Словоформа как в тексте, не лемма
  function word(text, opts) {
    return run([{ text: text, el: (opts && opts.el) || null }],
      Object.assign({ kind: 'word', rate: 0.9 }, opts || {}));
  }

  function sentence(text, opts) {
    return run([{ text: text, el: (opts && opts.el) || null }],
      Object.assign({ kind: 'sentence', rate: 0.9 }, opts || {}));
  }

  function page(items, opts) {
    return run(items, Object.assign({ kind: 'page', rate: 0.9 }, opts || {}));
  }

  return { chunkForTts, word, sentence, page, run, stop, isPlaying, toast };
})();
