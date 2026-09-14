/* ═══════════════════════════════════════════════
   reader-dict.js — словарь книги
   Deutsch Meister Course

   Полноэкранный вид поверх библиотеки и поверх ридера. Как и карточки,
   лежит отдельной секцией с .rd-scope: ридер под ним не размонтируется
   и размеров .rd-viewport не меняет.

   Показывает то, что собрано тапами по словам (dm_book_words:<id>):
   поиск, фильтр «все / новые / знаю», запуск карточек по видимому
   списку и экспорт в текст.

   Тултип по тапу на слово — тот же ReaderTip, что в ридере. Глоссарий
   ему собирается из самой записи сборника: в словаре книги глава может
   быть не загружена, а вся грамматика уже лежит в записи.

   Экспорт отдаём текстом в поле, а не файлом: в Telegram WebView
   скачивание не работает, а скопировать можно везде.

   Кнопка «Учить» — главное действие экрана (акцентный фон), «Экспорт»
   рядом второстепенный. Подпись строится из visible(): того же списка,
   который уходит в карточки, — поэтому и число, и формулировка всегда
   совпадают с тем, что на экране.

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderDict = (() => {

  let elView, elSub, elList, elSearch, elCards, elExport, elExportText;
  let bound  = false;
  let open_  = false;

  let bookId = null;
  let title  = '';
  let theme  = 'system';
  let filter = 'all';
  let query  = '';
  let onClose = null;

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5)   return forms[1];
    if (b === 1)          return forms[0];
    return forms[2];
  }

  function records() {
    if (typeof ReaderWords === 'undefined') return [];
    const all = ReaderWords.all() || {};
    return Object.keys(all).map(lemma => all[lemma]).filter(Boolean);
  }

  // Сортировка по алфавиту, регистр не важен: в списке рядом должны
  // стоять Hund и hundert, а не «все существительные сверху»
  function sorted(list) {
    return list.slice().sort((a, b) =>
      String(a.de).toLowerCase().localeCompare(String(b.de).toLowerCase(), 'de'));
  }

  function isKnown(rec) { return rec.status === 'known'; }

  // Что сейчас на экране: фильтр + поиск. Карточки и экспорт берут
  // именно этот список, поэтому число на кнопке всегда совпадает с ним.
  function visible() {
    const q = query.trim().toLowerCase();
    return sorted(records()).filter(rec => {
      if (filter === 'new'   && isKnown(rec)) return false;
      if (filter === 'known' && !isKnown(rec)) return false;
      if (!q) return true;
      return String(rec.de).toLowerCase().indexOf(q) >= 0
          || String(rec.ru || '').toLowerCase().indexOf(q) >= 0
          || (Array.isArray(rec.seen) && rec.seen.some(f =>
               String(f).toLowerCase().indexOf(q) >= 0));
    });
  }

  /* ── Строка списка ── */

  function grammar(rec) {
    const parts = [];
    if (rec.pos) parts.push(rec.pos);
    if (rec.pos === 'сущ.') parts.push(rec.pl ? 'мн. ч.: ' + rec.pl : 'мн. ч. нет');
    if (rec.decl)  parts.push(rec.decl);
    if (rec.forms) parts.push(rec.forms);
    return parts.join(' · ');
  }

  function rowHtml(rec) {
    const known = isKnown(rec);
    const n = Number(rec.n) || 0;
    return `
      <div class="rd-dw" data-lemma="${esc(rec.de)}">
        <div class="rd-dw-main">
          <div class="rd-dw-head">
            ${rec.art ? `<span class="rd-dw-art">${esc(rec.art)}</span>` : ''}
            <span class="bw rd-dw-de" data-t="${esc(String(rec.de).toLowerCase())}"
              >${esc(rec.de)}</span>
            ${n > 1 ? `<span class="rd-dw-n">×${n}</span>` : ''}
          </div>
          <div class="rd-dw-ru">${esc(rec.ru || '—')}</div>
          ${grammar(rec) ? `<div class="rd-dw-gram">${esc(grammar(rec))}</div>` : ''}
        </div>
        <button type="button" class="rd-dw-badge ${known ? 'known' : 'new'}"
          data-toggle="${esc(rec.de)}"
          title="${known ? 'Вернуть в изучаемые' : 'Пометить «знаю»'}"
          >${known ? 'знаю' : 'новое'}</button>
      </div>`;
  }

  /* ── Подпись кнопки «Учить» ── */

  // Кнопка стояла рядом с «Экспортом» и читалась как счётчик, поэтому
  // подпись теперь начинается с действия. При активном поиске или фильтре
  // она называет, что именно уйдёт в карточки: видимый список, а не весь
  // словарь. Считаем по visible() — тому же источнику, что и startCards().
  function cardsLabel(n) {
    if (!n)                 return '▶ Учить';
    if (query.trim())       return `▶ Учить найденные (${n})`;
    if (filter === 'new')   return `▶ Учить новые (${n})`;
    if (filter === 'known') return `▶ Учить «знаю» (${n})`;
    return `▶ Учить ${n} ${plural(n, ['слово', 'слова', 'слов'])}`;
  }

  function cardsTitle(n) {
    if (!n) return 'Нет слов для карточек';
    const narrowed = query.trim() || filter !== 'all';
    return narrowed
      ? `Учить ${n} ${plural(n, ['отобранное слово', 'отобранных слова', 'отобранных слов'])}`
      : `Учить ${n} ${plural(n, ['слово', 'слова', 'слов'])} словаря`;
  }

  function render() {
    if (!elList) return;
    const list = visible();
    const total = records().length;

    if (elCards) {
      elCards.textContent = cardsLabel(list.length);
      elCards.title = cardsTitle(list.length);
      elCards.setAttribute('aria-label', cardsTitle(list.length));
      elCards.disabled = list.length === 0;
    }

    if (!total) {
      elList.innerHTML = `
        <div class="rd-dict-empty">
          <div class="rd-dict-empty-icon">📗</div>
          <div class="rd-dict-empty-title">Словарь пуст</div>
          <p class="rd-dict-empty-text">Тапайте по незнакомым словам в тексте —
            они будут собираться сюда.</p>
        </div>`;
      return;
    }
    if (!list.length) {
      elList.innerHTML = `
        <div class="rd-dict-empty">
          <div class="rd-dict-empty-icon">🔍</div>
          <div class="rd-dict-empty-title">Ничего не нашлось</div>
          <p class="rd-dict-empty-text">Попробуйте другой запрос или снимите фильтр.</p>
        </div>`;
      return;
    }
    elList.innerHTML = list.map(rowHtml).join('');
  }

  function renderSub() {
    if (!elSub) return;
    const all   = records();
    const known = all.filter(isKnown).length;
    elSub.textContent = title
      ? `${title} · ${all.length} ${plural(all.length, ['слово', 'слова', 'слов'])}`
        + ` · ${known} знаю`
      : `${all.length} ${plural(all.length, ['слово', 'слова', 'слов'])}`;
  }

  /* ── Тултип: тот же ReaderTip, что в ридере ── */

  // Глава в словаре может быть не загружена, поэтому глоссарий собираем
  // из самой записи — формат тот же, что у data/books/<id>/glossary.json.
  function glossOf(rec) {
    const entry = { ru: rec.ru || '', pos: rec.pos || '' };
    if (rec.art)   entry.art   = rec.art;
    if ('pl' in rec) entry.pl  = rec.pl;
    if (rec.forms) entry.forms = rec.forms;
    if (rec.decl)  entry.decl  = rec.decl;
    if (rec.old)   entry.old   = rec.old;
    // В строке списка — только ru; разбор употребления показывается
    // при раскрытии, то есть в тултипе по тапу на слово.
    if (rec.note)  entry.note  = rec.note;

    const w = {}; const l = {};
    w[String(rec.de).toLowerCase()] = rec.de;
    l[rec.de] = entry;
    return { w: w, l: l };
  }

  function openTip(el, lemma) {
    if (typeof ReaderTip === 'undefined') return;
    const rec = ReaderWords.get(lemma);
    if (!rec) return;
    ReaderTip.open(el, {
      gloss: glossOf(rec),
      theme: theme,
      sentenceRu: '',          // предложения тут нет — кнопка не появится
      bs: null,
      onAct: act => {
        if (act !== 'speak-word' || typeof ReaderSpeak === 'undefined') return;
        if (ReaderSpeak.isPlaying('word')) { ReaderSpeak.stop(); return; }
        ReaderSpeak.word(rec.de);
      }
    });
  }

  /* ── Статус ── */

  // Тап по бейджу переключает new ↔ known: так же, как «Знаю» в карточках,
  // и с тем же эффектом на подсветку в тексте.
  function toggleStatus(lemma) {
    const rec = ReaderWords.get(lemma);
    if (!rec) return;
    ReaderWords.setStatus(lemma, isKnown(rec) ? 'new' : 'known');
    if (typeof Reader !== 'undefined' && typeof Reader.markLemma === 'function') {
      Reader.markLemma(lemma);
    }
    render();
    renderSub();
  }

  /* ── Экспорт ── */

  function exportText() {
    const list = visible();
    const all  = records();
    const known = all.filter(isKnown).length;
    const head = [
      (title || 'Книга') + ' — словарь',
      `Собрано: ${all.length} ${plural(all.length, ['слово', 'слова', 'слов'])}`
        + ` (${all.length - known} новых, ${known} знаю)`,
      ''
    ];
    const body = list.map(rec => {
      const face = (rec.art ? rec.art + ' ' : '') + rec.de;
      const g = grammar(rec);
      return face + ' — ' + (rec.ru || '—') + (g ? ' · ' + g : '');
    });
    return head.concat(body).join('\n');
  }

  function showExport() {
    if (!elExport || !elExportText) return;
    elExportText.value = exportText();
    elExport.hidden = false;
    try { elExportText.select(); } catch (e) {}
  }

  function copyExport() {
    if (!elExportText) return;
    const done = () => {
      if (typeof ReaderSpeak !== 'undefined') ReaderSpeak.toast('Скопировано');
    };
    try { elExportText.select(); } catch (e) {}
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(elExportText.value).then(done, fallback);
      return;
    }
    fallback();

    // execCommand устарел, но в старых WebView это единственный путь;
    // если и он не сработал, текст уже выделен — копируется руками
    function fallback() {
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      if (ok) done();
      else if (typeof ReaderSpeak !== 'undefined') {
        ReaderSpeak.toast('Скопируйте текст вручную');
      }
    }
  }

  /* ── Карточки по видимому списку ── */

  function startCards() {
    const list = visible();
    if (!list.length || typeof ReaderCards === 'undefined') return;
    ReaderCards.open({
      records: list,
      subtitle: title,
      theme: theme,
      onClose: () => { render(); renderSub(); refreshOutside(); }
    });
  }

  // После сессии карточек счётчики снаружи устарели: и кнопка в ридере,
  // и карточка книги в библиотеке считают из того же localStorage.
  function refreshOutside() {
    if (typeof Reader !== 'undefined' && typeof Reader.refreshCards === 'function') {
      Reader.refreshCards();
    }
    if (typeof Library !== 'undefined' && typeof Library.refresh === 'function') {
      Library.refresh();
    }
  }

  /* ── Открыть / закрыть ── */

  function bind() {
    if (bound) return;
    bound = true;

    document.getElementById('rdDictBack')?.addEventListener('click', () => close());
    document.getElementById('rdDictCards')?.addEventListener('click', startCards);
    document.getElementById('rdDictExport')?.addEventListener('click', showExport);
    document.getElementById('rdExportClose')?.addEventListener('click', () => {
      if (elExport) elExport.hidden = true;
    });
    document.getElementById('rdExportCopy')?.addEventListener('click', copyExport);

    elSearch?.addEventListener('input', () => {
      query = elSearch.value || '';
      render();
    });

    elView?.querySelector('.rd-dict-filter')?.addEventListener('click', e => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filter = btn.dataset.filter;
      elView.querySelectorAll('.rd-dict-filter button').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render();
    });

    // Делегирование: список перерисовывается целиком на каждый фильтр
    elList?.addEventListener('click', e => {
      const badge = e.target.closest('button[data-toggle]');
      if (badge) { toggleStatus(badge.dataset.toggle); return; }
      const word = e.target.closest('.rd-dw-de');
      if (word) {
        const row = word.closest('.rd-dw');
        openTip(word, row ? row.dataset.lemma : word.textContent);
      }
    });

    document.addEventListener('keydown', e => {
      if (!open_ || e.key !== 'Escape') return;
      if (elExport && !elExport.hidden) { elExport.hidden = true; return; }
      close();
    });
  }

  // opts: { bookId, title, theme, onClose }
  function open(opts) {
    const o = opts || {};
    elView       = document.getElementById('rdDict');
    elSub        = document.getElementById('rdDictSub');
    elList       = document.getElementById('rdDictList');
    elSearch     = document.getElementById('rdDictSearch');
    elCards      = document.getElementById('rdDictCards');
    elExport     = document.getElementById('rdExport');
    elExportText = document.getElementById('rdExportText');
    if (!elView || !elList) return false;

    bind();
    bookId  = o.bookId || null;
    title   = o.title || '';
    theme   = o.theme || 'system';
    onClose = (typeof o.onClose === 'function') ? o.onClose : null;
    filter  = 'all';
    query   = '';

    if (elSearch) elSearch.value = '';
    elView.querySelectorAll('.rd-dict-filter button').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.filter === 'all' ? 'true' : 'false');
    });
    if (elExport) elExport.hidden = true;

    // localStorage — источник истины: сборник мог пополниться в ридере
    if (typeof ReaderWords !== 'undefined') ReaderWords.load(bookId);

    elView.dataset.rdTheme = theme;
    renderSub();
    render();

    elView.hidden = false;
    open_ = true;
    document.body.classList.add('rd-open');
    return true;
  }

  function close() {
    if (!elView) return;
    if (typeof ReaderTip !== 'undefined') ReaderTip.close();
    if (typeof ReaderSpeak !== 'undefined') ReaderSpeak.stop();
    if (elExport) elExport.hidden = true;
    elView.hidden = true;
    open_ = false;

    const rd = document.getElementById('rdView');
    if (!rd || rd.hidden) document.body.classList.remove('rd-open');
    refreshOutside();
    if (onClose) {
      const cb = onClose;
      onClose = null;
      try { cb(); } catch (e) { console.warn('[ReaderDict] onClose бросил исключение', e); }
    }
  }

  function isOpen() { return open_; }

  return { open, close, isOpen, exportText, visible };
})();
