/* ═══════════════════════════════════════════════
   reader-gloss.js — подстрочник: переводы над словами в ридере
   Deutsch Meister Course

   Немецкий текст идёт обычным абзацем, с обычными пробелами. Переводы
   не раздвигают слова: они живут в отдельном слое .rd-gl-layer поверх
   .rd-content и расставляются по уже свёрстанным строкам. Сам .bw
   остаётся плоским (текст = немецкое слово) — тултип, TTS и сборник
   слов ничего не замечают. Перевод слова лежит в data-ru.

   Раскладка по строке:
   - все переводы стоят в одном ряду прямо над своим словом;
   - если два соседних налезают, более длинный поднимается во второй
     ряд, а к слову от него идёт тонкая вертикальная черта;
   - перевод нижнего ряда, на который попала такая черта, сдвигается
     вбок, если рядом есть место.

   Разметка предложения (поле g в главе, см. sentenceGloss):
     "4-5": "сел"        — сочетание целиком: перевод над всеми словами,
                           над ними тонкая скобка;
     "11+17": "заснули"  — разорванная конструкция (отделяемая приставка):
                           перевод над первым словом, оба слова — акцентным
                           цветом, на одной строке связаны пунктирной дугой;
     "7": "усталые"      — перевод слова в нужной форме вместо словарного;
     "2": ""             — не подписывать.
   Индексы — data-w, т.е. порядковый номер слова по WORD_RE ридера.

   Без разметки слово подписывается первым значением из глоссария,
   кроме «тихих» слов (артикли, личные местоимения, самые частые
   предлоги и союзы): их перевод по тапу.

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderGloss = (() => {

  // По ЛЕММЕ, а не по pos: pos в украинском глоссарии переведён
  // («займ.», «прийм.»), а лемма немецкая и одинакова для всех языков.
  // Список сознательно короткий: предлог или союз со смыслом (weil,
  // als, ohne, gegen) подписывается — его как раз и не знают.
  const QUIET = new Set([
    'der/die/das', 'ein/eine',
    'er', 'es', 'ich', 'du', 'wir', 'ihr', 'sie', 'sich', 'man',
    'ihr (её, их)', 'ihr (их, её)', 'sein (его, свой)',
    'mein', 'dein', 'unser', 'euer',
    'und', 'oder', 'dass',
    'in', 'an', 'auf', 'aus', 'bei', 'mit', 'nach', 'von', 'zu', 'für', 'um'
  ]);

  function isQuiet(lemma) {
    return QUIET.has(String(lemma || '').trim());
  }

  // Разметка предложения → { индекс слова: роль }.
  // head — слово, над которым стоит перевод; inner — остальные слова
  // сочетания (своего перевода не получают); part — вторая часть
  // разорванной конструкции.
  function sentenceGloss(g) {
    const map = {};
    if (!g || typeof g !== 'object') return map;
    Object.keys(g).forEach(key => {
      const ru = String(g[key] == null ? '' : g[key]);
      let m;
      if ((m = /^(\d+)-(\d+)$/.exec(key))) {
        const a = +m[1], b = +m[2];
        map[a] = { ru, to: b };
        for (let i = a + 1; i <= b; i++) map[i] = { inner: true };
      } else if ((m = /^(\d+)\+(\d+)$/.exec(key))) {
        const a = +m[1], b = +m[2];
        map[a] = { ru, link: b };
        map[b] = { part: true };
      } else if (/^\d+$/.test(key)) {
        map[+key] = { ru };
      }
    });
    return map;
  }

  /* ── Слой ── */

  function clear(content) {
    const old = content && content.querySelector(':scope > .rd-gl-layer');
    if (old) old.remove();
  }

  function rectOf(el, base) {
    const r = el.getClientRects()[0];
    if (!r) return null;
    return { l: r.left - base.left, r: r.right - base.left,
             t: r.top - base.top, b: r.bottom - base.top };
  }

  // geo: { step, width } — шаг листания и ширина колонки из measure()
  function layout(content, geo) {
    clear(content);
    if (!content || !geo || !(geo.step > 0)) return;
    const heads = content.querySelectorAll('.bw[data-ru]');
    if (!heads.length) return;

    const base = content.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'rd-gl-layer';
    layer.setAttribute('aria-hidden', 'true');

    // 1) чтение геометрии слов (до любых записей в DOM)
    const items = [];
    heads.forEach(el => {
      const r = rectOf(el, base);
      if (!r) return;
      const it = { el, r, ru: el.dataset.ru, span: null, link: null, brackets: [], head: r };
      const bs = el.closest('.bs');
      const w = Number(el.dataset.w);
      if (el.dataset.glTo && bs) {
        // Сочетание может разорвать конец строки (или колонки). Скобку
        // рисуем над каждой частью, а подпись ставим над самой широкой:
        // в начале обычно короткий предлог в конце строки.
        const to = Number(el.dataset.glTo);
        const parts = [];
        for (let i = w; i <= to; i++) {
          const we = i === w ? el : bs.querySelector(`.bw[data-w="${i}"]`);
          const wr = we && rectOf(we, base);
          if (!wr) continue;
          const last = parts[parts.length - 1];
          if (last && Math.abs(wr.t - last.t) < 2 && wr.l >= last.l) {
            last.r = Math.max(last.r, wr.r); last.b = Math.max(last.b, wr.b);
          } else {
            parts.push({ l: wr.l, r: wr.r, t: wr.t, b: wr.b });
          }
        }
        if (parts.length) {
          let main = parts[0];
          parts.forEach(pt => { if (pt.r - pt.l > main.r - main.l) main = pt; });
          it.r = main;
          it.span = { l: main.l, r: main.r };
          it.brackets = parts.map((pt, i) => ({
            l: pt.l, r: pt.r, t: pt.t,
            openL: i > 0, openR: i < parts.length - 1
          }));
        }
      }
      if (el.dataset.glLink && bs) {
        const part = bs.querySelector(`.bw[data-w="${el.dataset.glLink}"]`);
        const pr = part && rectOf(part, base);
        if (pr && Math.abs(pr.t - r.t) < 2) it.link = pr;
        else if (pr) it.linkFar = pr;   // часть на другой строке или странице
      }
      it.cx = it.span ? (it.span.l + it.span.r) / 2 : (it.r.l + it.r.r) / 2;
      it.col = Math.floor((it.r.l + 1) / geo.step);
      it.key = it.col + ':' + Math.round(it.r.t);
      it.w0 = w;
      items.push(it);
    });

    // 2) создаём подписи и меряем их одним проходом
    items.forEach(it => {
      const d = document.createElement('span');
      d.className = 'rd-gl' + (it.el.dataset.glLink ? ' rd-gl--link' : '');
      d.textContent = it.ru;
      layer.appendChild(d);
      it.box = d;
    });
    content.appendChild(layer);
    items.forEach(it => { it.w = it.box.offsetWidth; it.h = it.box.offsetHeight; });

    // 3) раскладка по строкам
    const GAP = 5;
    const lines = new Map();
    items.forEach(it => {
      if (!lines.has(it.key)) lines.set(it.key, []);
      lines.get(it.key).push(it);
    });
    lines.forEach(list => {
      list.sort((a, b) => a.r.l - b.r.l);
      const lo = list[0].col * geo.step, hi = lo + geo.width;
      list.forEach(it => { it.ideal = Math.min(Math.max(it.cx - it.w / 2, lo), hi - it.w); });

      const low = [], high = [];
      let upR = -Infinity;
      const lift = q => {
        q.up = true;
        q.x = Math.min(Math.max(q.ideal, upR + GAP), hi - q.w);
        upR = q.x + q.w;
        high.push(q);
      };
      list.forEach(it => {
        it.up = false;
        const last = low[low.length - 1];
        if (last && it.ideal < last.x + last.w + GAP) {
          const prev2 = low[low.length - 2];
          // наверх уходит более длинный из двух — короткий остаётся у слова
          if (last.w > it.w && (!prev2 || it.ideal >= prev2.x + prev2.w + GAP)) {
            low.pop(); lift(last);
          } else { lift(it); return; }
        }
        const prev = low[low.length - 1];
        it.x = prev ? Math.min(Math.max(it.ideal, prev.x + prev.w + GAP), hi - it.w) : it.ideal;
        low.push(it);
      });
      // У правого края колонки клампинг мог наложить подписи друг на друга:
      // сдвигаем ряд влево, сколько позволяет место, потом снова вправо.
      const pack = row => {
        row.sort((a, b) => a.x - b.x);
        for (let i = row.length - 1; i >= 0; i--) {
          const lim = i === row.length - 1 ? hi - row[i].w : row[i + 1].x - GAP - row[i].w;
          if (row[i].x > lim) row[i].x = Math.max(lo, lim);
        }
        for (let i = 1; i < row.length; i++) {
          const min = row[i - 1].x + row[i - 1].w + GAP;
          if (row[i].x < min) row[i].x = min;
        }
      };
      pack(low); pack(high);
      // черта из верхнего ряда не должна резать подпись нижнего
      high.forEach(u => low.forEach((b, i) => {
        if (u.cx > b.x - 3 && u.cx < b.x + b.w + 3) {
          const lb = i ? low[i - 1].x + low[i - 1].w + GAP : lo;
          const rb = i < low.length - 1 ? low[i + 1].x - GAP : hi;
          if (u.cx - 4 - b.w >= lb) b.x = u.cx - 4 - b.w;
          else if (u.cx + 4 + b.w <= rb) b.x = u.cx + 4;
        }
      }));
    });

    // 4) запись позиций
    const frag = document.createDocumentFragment();
    const add = (cls, css) => {
      const d = document.createElement('span');
      d.className = cls;
      Object.assign(d.style, css);
      frag.appendChild(d);
    };
    items.forEach(it => {
      const top = it.r.t;
      const bottom = top - 2 - (it.up ? it.h : 0);
      it.box.style.left = it.x + 'px';
      it.box.style.top = (bottom - it.h) + 'px';
      if (it.up) {
        add('rd-gl-stem' + (it.el.dataset.glLink ? ' rd-gl--link' : ''), {
          left: Math.round(it.cx) + 'px', top: bottom + 'px', height: Math.max(2, top - bottom - 1) + 'px'
        });
      }
      // одиночное слово с glTo (сочетание из одного видимого куска) скобки не требует
      if (it.brackets.length > 1 || (it.brackets.length === 1 && it.el.dataset.glTo !== it.el.dataset.w)) {
        it.brackets.forEach(bk => add(
          'rd-gl-bracket' + (bk.openL ? ' rd-gl-bracket--open-l' : '') + (bk.openR ? ' rd-gl-bracket--open-r' : ''),
          { left: (bk.l + 1) + 'px', top: (bk.t - 1) + 'px', width: Math.max(4, bk.r - bk.l - 2) + 'px' }
        ));
      }
      if (it.linkFar) {
        // Части на разных строках: под каждой — хвост дуги в сторону переноса
        const TAIL = 34;
        const lo = it.col * geo.step, hi = lo + geo.width;
        const head = it.head, far = it.linkFar;
        const before = far.t > head.t || (Math.abs(far.t - head.t) < 2 && far.l > head.l);
        const tails = before
          ? [{ x1: (head.l + head.r) / 2, x2: Math.min((head.l + head.r) / 2 + TAIL, hi), y: head.b, cls: 'rd-gl-arc--open-r' },
             { x1: Math.max((far.l + far.r) / 2 - TAIL, Math.floor((far.l + 1) / geo.step) * geo.step), x2: (far.l + far.r) / 2, y: far.b, cls: 'rd-gl-arc--open-l' }]
          : [{ x1: Math.max((head.l + head.r) / 2 - TAIL, lo), x2: (head.l + head.r) / 2, y: head.b, cls: 'rd-gl-arc--open-l' },
             { x1: (far.l + far.r) / 2, x2: Math.min((far.l + far.r) / 2 + TAIL, Math.floor((far.l + 1) / geo.step) * geo.step + geo.width), y: far.b, cls: 'rd-gl-arc--open-r' }];
        tails.forEach(t => add('rd-gl-arc ' + t.cls, {
          left: t.x1 + 'px', top: (t.y - 3) + 'px', width: Math.max(6, t.x2 - t.x1) + 'px'
        }));
      }
      if (it.link) {
        const a = (it.r.l + it.r.r) / 2, b = (it.link.l + it.link.r) / 2;
        add('rd-gl-arc', {
          left: Math.min(a, b) + 'px', top: (it.r.b - 3) + 'px', width: Math.abs(b - a) + 'px'
        });
      }
    });
    layer.appendChild(frag);
  }

  return { isQuiet, sentenceGloss, layout, clear, QUIET };
})();
