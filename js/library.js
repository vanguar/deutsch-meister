/* ═══════════════════════════════════════════════
   library.js — вид «Библиотека» (books.html)
   Читает data/books/index.json и рисует карточки книг.
   Прогресс берётся из localStorage:
     dm_book_pos:<id>   — позиция чтения
     dm_book_words:<id> — собранные слова
   Их пока никто не пишет → 0 % и 0 слов, это норма.
   Zero dependencies.
   ═══════════════════════════════════════════════ */

const Library = (() => {

  /* ── Константы ── */
  const INDEX_URL = 'data/books/index.json';
  const POS_KEY   = 'dm_book_pos:';
  const WORDS_KEY = 'dm_book_words:';

  let elRoot = null;
  let cache  = [];   // последний прочитанный каталог, для refresh()

  /* ── Утилиты ── */

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Русские числительные: 1 слово / 2 слова / 5 слов
  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5)   return forms[1];
    if (b === 1)          return forms[0];
    return forms[2];
  }

  function clampPercent(v) {
    if (typeof v !== 'number' || !isFinite(v)) return 0;
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  // Чтение localStorage может упасть (приватный режим, отключённые куки).
  // Отсутствие данных — нормальный путь: возвращаем null, в консоль warn.
  function readStore(key) {
    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch (e) {
      console.warn('[Library] localStorage недоступен для', key, e);
      return null;
    }
    if (raw === null || raw === '') return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Library] повреждённое значение', key, '→ считаем пустым', e);
      return null;
    }
  }

  /* ── Прогресс книги ── */

  // dm_book_pos:<id> — контракт этапа 2B. Читаем терпимо:
  //   { percent: 0..100 }         — готовый процент
  //   { chapter: 0.., para: 0.. } — оценка по номеру главы
  //   число                       — процент
  function getPercent(book) {
    const pos = readStore(POS_KEY + book.id);
    if (pos === null) return 0;
    if (typeof pos === 'number') return clampPercent(pos);
    if (typeof pos !== 'object') return 0;

    if (typeof pos.percent === 'number') return clampPercent(pos.percent);

    const total = Number(book.chapters) || 0;
    if (total > 0 && typeof pos.chapter === 'number') {
      return clampPercent((pos.chapter / total) * 100);
    }
    return 0;
  }

  // dm_book_words:<id> — массив слов, либо { words: [...] }, либо объект-словарь
  // (актуальный формат: лемма → запись, см. js/reader-words.js).
  //
  // Считаем только ПОЛНОЗНАЧНЫЕ слова: служебные (артикли, предлоги,
  // союзы) в сборник попадают, но счётчик книги должен мерить словарный
  // запас, а не количество тапов по «und». Классификацию берём у
  // ReaderWords — одна точка правды; если модуль почему-то не подключён,
  // считаем как раньше, все записи.
  // Считаем тем же правилом, что и ReaderWords, а не читаем rec.fn:
  // библиотека рисуется до того, как ридер откроет книгу и пересчитает
  // флаги, и на сохранённом раньше значении счётчик отставал бы на один
  // заход. Если модуль не подключён — падаем на то, что записано.
  function isFunctionRec(lemma, rec) {
    if (!rec || typeof rec !== 'object') return false;
    if (typeof ReaderWords !== 'undefined'
        && typeof ReaderWords.isFunctionWord === 'function') {
      return ReaderWords.isFunctionWord(rec.pos, lemma);
    }
    return !!rec.fn;
  }

  function getWordsCount(book) {
    const data = readStore(WORDS_KEY + book.id);
    if (data === null) return 0;
    if (Array.isArray(data)) return data.length;
    if (typeof data === 'object') {
      if (Array.isArray(data.words)) return data.words.length;
      return Object.keys(data).filter(l => !isFunctionRec(l, data[l])).length;
    }
    return 0;
  }

  /* ── Состояния: загрузка / ошибка / пусто ── */

  function renderLoading() {
    if (!elRoot) return;
    elRoot.setAttribute('aria-busy', 'true');
    elRoot.innerHTML = `
      <div class="lib-state">
        <div class="lib-spinner"></div>
        <div class="lib-state-title">Загружаем каталог</div>
        <p class="lib-state-text">Читаем список книг…</p>
      </div>`;
  }

  function renderError(message) {
    if (!elRoot) return;
    elRoot.setAttribute('aria-busy', 'false');
    elRoot.innerHTML = `
      <div class="lib-state error">
        <div class="lib-state-icon">📕</div>
        <div class="lib-state-title">Каталог не загрузился</div>
        <p class="lib-state-text">
          Не удалось прочитать <span class="font-mono">${esc(INDEX_URL)}</span>.
          Проверьте соединение и попробуйте снова.
          <span class="lib-state-detail">${esc(message)}</span>
        </p>
        <div class="lib-state-actions">
          <button class="btn btn-primary" id="libRetry">Повторить</button>
        </div>
      </div>`;
    bindRetry();
  }

  function renderEmpty() {
    if (!elRoot) return;
    elRoot.setAttribute('aria-busy', 'false');
    elRoot.innerHTML = `
      <div class="lib-state">
        <div class="lib-state-icon">📚</div>
        <div class="lib-state-title">Пока ни одной книги</div>
        <p class="lib-state-text">Каталог прочитан, но список книг пуст.</p>
        <div class="lib-state-actions">
          <button class="btn btn-ghost" id="libRetry">Повторить</button>
        </div>
      </div>`;
    bindRetry();
  }

  function bindRetry() {
    const btn = document.getElementById('libRetry');
    if (btn) btn.addEventListener('click', () => load());
  }

  /* ── Карточка книги ── */

  // Разряды тонкой неразрывной шпацией: «1182 слова» читается как число,
  // а не как случайный набор цифр, и при этом не разрывается переносом.
  function grouped(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function cardHtml(book, i) {
    const percent = getPercent(book);
    const words   = getWordsCount(book);
    const started = percent > 0;
    const done    = percent >= 100;

    const minutes  = Number(book.minutes)  || 0;
    const chapters = Number(book.chapters) || 0;
    const total    = Number(book.words)    || 0;

    // Порядок — от крупного к мелкому: сколько читать, сколько текста,
    // сколько времени. Так строка отвечает на вопрос «потяну ли я это».
    const stats = [];
    if (chapters) stats.push(`${chapters} ${plural(chapters, ['глава', 'главы', 'глав'])}`);
    if (total)    stats.push(`${grouped(total)} ${plural(total, ['слово', 'слова', 'слов'])}`);
    if (minutes)  stats.push(`~${minutes} мин`);

    // Автор и год — одной строкой-подписью над заглавием, как на
    // титульном листе. Год берём только если он есть: выдумывать дату
    // изданию, у которого её нет, нельзя.
    const byline = [book.author, book.year].filter(Boolean).map(esc).join(' · ');

    const cta = done ? 'Читать заново' : (started ? 'Продолжить' : 'Читать');

    return `
      <article class="lib-card" style="animation-delay:${i * 60}ms">
        <div class="lib-cover" aria-hidden="true">
          <span class="lib-cover-art">${esc(book.cover || '📖')}</span>
          ${book.level ? `<span class="lib-cover-level">${esc(book.level)}</span>` : ''}
        </div>

        <div class="lib-body">
          <header class="lib-head">
            ${byline ? `<div class="lib-byline">${byline}</div>` : ''}
            <h2 class="lib-title">${esc(book.title)}</h2>
            ${book.titleRu ? `<div class="lib-title-ru">${esc(book.titleRu)}</div>` : ''}
          </header>

          ${book.blurb ? `<p class="lib-blurb">${esc(book.blurb)}</p>` : ''}

          ${stats.length ? `<div class="lib-meta">
            <span class="lib-meta-stats">${stats.join('<span class="lib-dot">·</span>')}</span>
          </div>` : ''}

          <div class="lib-progress">
            <div class="lib-bar" role="progressbar" aria-label="Прогресс чтения"
                 aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
              <span class="lib-bar-fill${done ? ' done' : ''}" style="width:${percent}%"></span>
            </div>
            <div class="lib-progress-row">
              <span class="lib-percent${done ? ' done' : ''}">${percent}% прочитано</span>
              <span class="lib-words">📗 ${words} ${plural(words, ['слово', 'слова', 'слов'])} в словаре</span>
            </div>
          </div>

          <div class="lib-cta-row">
            <button class="btn btn-primary lib-cta" data-book-id="${esc(book.id)}">${cta} →</button>
            <button class="btn btn-ghost lib-dict" data-dict-id="${esc(book.id)}"
              ${words ? '' : 'disabled'} title="Словарь книги">📗 Словарь</button>
          </div>

          ${book.source ? `<div class="lib-source" title="${esc(book.source)}">${esc(book.source)}</div>` : ''}
        </div>
      </article>`;
  }

  function renderBooks(books) {
    if (!elRoot) return;
    cache = books;
    elRoot.setAttribute('aria-busy', 'false');
    elRoot.innerHTML = `<div class="lib-grid">${books.map(cardHtml).join('')}</div>`;
    elRoot.querySelectorAll('.lib-cta').forEach(btn => {
      btn.addEventListener('click', () => openBook(btn.dataset.bookId));
    });
    elRoot.querySelectorAll('.lib-dict').forEach(btn => {
      btn.addEventListener('click', () => openDict(btn.dataset.dictId));
    });
  }

  /* ── Открытие книги: передаём в ридер (js/reader.js) ── */

  function openBook(id) {
    // Reader объявлен через const — это лексический глобал, а не window.Reader
    if (typeof Reader !== 'undefined' && typeof Reader.open === 'function') {
      Reader.open(id);
      return;
    }
    console.warn('[Library] ридер не подключён, книга не открыта:', id);
  }

  /* ── Словарь книги: тот же вид, что открывается из ридера ── */

  // Тема ридера живёт в dm_reader_prefs, и словарь обязан открыться в ней
  // же — иначе из библиотеки он выглядел бы чужим видом.
  function openDict(id) {
    if (typeof ReaderDict === 'undefined') return;
    const book = cache.find(b => b.id === id);
    ReaderDict.open({
      bookId: id,
      title:  (book && book.title) || '',
      theme:  (typeof Reader !== 'undefined' && typeof Reader.theme === 'function')
        ? Reader.theme() : 'system',
      onClose: refresh
    });
  }

  /* ── Перерисовать карточки из кеша: прогресс мог измениться в ридере ── */

  function refresh() {
    if (cache.length) renderBooks(cache);
  }

  /* ── Загрузка каталога ── */

  function load() {
    renderLoading();

    fetch(INDEX_URL, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        const books = data && Array.isArray(data.books) ? data.books : null;
        if (!books) throw new Error('в index.json нет массива books');

        const valid = books.filter(b => b && b.id && b.title);
        if (valid.length !== books.length) {
          console.warn('[Library] пропущено книг без id/title:', books.length - valid.length);
        }
        if (!valid.length) { renderEmpty(); return; }

        renderBooks(valid);
      })
      .catch(err => {
        console.error('[Library] каталог не загрузился:', err);
        renderError(err && err.message ? err.message : String(err));
      });
  }

  /* ── Инициализация ── */

  function init() {
    elRoot = document.getElementById('libContent');
    if (!elRoot) return;
    load();
  }

  return { init, load, refresh, openBook, openDict };
})();

document.addEventListener('DOMContentLoaded', () => Library.init());
