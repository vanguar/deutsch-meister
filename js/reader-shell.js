/* Shared reader and its overlays for the culture catalogs. */
const ReaderShell = (() => {
  const markup = `<!-- ── РИДЕР (вид переключается без перезагрузки, js/reader.js) ── -->
<section class="rd-view" id="rdView" hidden>

  <header class="rd-top">
    <button class="rd-icon-btn" id="rdBack" title="К оглавлению" aria-label="К оглавлению">←</button>
    <div class="rd-top-titles">
      <div class="rd-chapter-title" id="rdChapterTitle"></div>
      <div class="rd-chapter-sub" id="rdChapterSub"></div>
    </div>
    <div class="rd-pages" id="rdPages" aria-live="polite"></div>
    <button class="rd-icon-btn" id="rdDictBtn" title="Словарь текста"
      aria-label="Словарь текста">📗</button>
  </header>

  <div class="rd-viewport" id="rdViewport">
    <div class="rd-content" id="rdContent" lang="de"></div>
    <div class="rd-state" id="rdState" hidden></div>
  </div>

  <footer class="rd-bottom">
    <div class="rd-bar"><span class="rd-bar-fill" id="rdBarFill"></span></div>
    <div class="rd-controls">
      <button class="rd-nav-btn" id="rdPrev">‹ Назад</button>
      <div class="rd-slot" id="rdSlot">
        <button class="rd-slot-btn" id="rdPrefsBtn" title="Настройки чтения"
          aria-label="Настройки чтения">Aa</button>
        <button class="rd-slot-btn" id="rdSpeakBtn" title="Читать дальше вслух"
          aria-label="Читать дальше вслух" aria-pressed="false">🔊<span
          class="rd-btn-label">дальше</span></button>
        <button class="rd-slot-btn" id="rdCardsBtn" title="Карточки этого текста"
          aria-label="Карточки этого текста" disabled>🃏<span
          class="rd-btn-label">карточки</span> <span id="rdCardsN">(0)</span></button>
        <button class="rd-slot-btn" id="rdInterlinearBtn" title="Показать перевод над словами"
          aria-label="Показать перевод над словами" aria-pressed="false"><span
          class="rd-btn-icon" aria-hidden="true">🔤</span><span class="rd-btn-label">слова</span></button>
        <button class="rd-slot-btn" id="rdFullTranslationBtn" title="Показать перевод главы"
          aria-label="Показать перевод главы" aria-pressed="false"><span
          class="rd-btn-icon" aria-hidden="true">🌐</span><span class="rd-btn-label">перевод</span></button>
        <!-- Только у книги с рифмованным переводом (meta.rhymed). Скрыта
             атрибутом hidden, показывает её js/reader.js при открытии книги. -->
        <button class="rd-slot-btn" id="rdRhymeBtn" title="Показать перевод в рифму"
          aria-label="Показать перевод в рифму" aria-pressed="false" hidden>рифма</button>
      </div>
      <button class="rd-nav-btn" id="rdNext">Вперёд ›</button>
    </div>
  </footer>

  <!-- ── НАСТРОЙКИ ЧТЕНИЯ: подложка + шторка, ряды строит js/reader.js ── -->
  <div class="rd-sheet-back" id="rdSheetBack"></div>
  <aside class="rd-sheet" id="rdSheet" role="dialog" aria-modal="true"
    aria-label="Настройки чтения">
    <div class="rd-sheet-grip"></div>
    <div class="rd-sheet-head">
      <div class="rd-sheet-title">Как читать</div>
      <button class="rd-sheet-close" id="rdSheetClose" aria-label="Закрыть">✕</button>
    </div>
    <div id="rdSheetBody"></div>
  </aside>

</section>

<!-- ── КАРТОЧКИ КНИГИ: оверлей поверх ридера, js/reader-cards.js.
     Лежит на уровне body и несёт .rd-scope, потому что открывается и из
     ридера, и из словаря; ридер при этом не размонтируется. ── -->
<section class="rd-cards rd-scope" id="rdCards" hidden
  role="dialog" aria-modal="true" aria-label="Карточки текста">

  <header class="rd-top">
    <button class="rd-icon-btn" id="rdCardsBack" title="Закрыть карточки"
      aria-label="Закрыть карточки">←</button>
    <div class="rd-top-titles">
      <div class="rd-chapter-title">Карточки</div>
      <div class="rd-chapter-sub" id="rdCardsSub"></div>
    </div>
    <div class="rd-pages" id="rdCardsCounter" aria-live="polite"></div>
  </header>

  <div class="rd-cards-body">
    <div class="flashcard-dots" id="rdCardsDots"></div>

    <div class="flashcard-viewport">
      <div class="flashcard" id="rdCard">
        <div class="card-face front">
          <div class="card-de" id="rdCardDE">…</div>
          <button type="button" class="fc-say" id="rdCardSayFront"
            aria-label="Озвучить слово">🔊</button>
          <div class="card-hint">Нажмите, чтобы увидеть перевод</div>
        </div>
        <div class="card-face back">
          <div class="card-ru" id="rdCardRU">…</div>
          <div class="fc-meta" id="rdCardMeta"></div>
          <div class="fc-old" id="rdCardOld" hidden></div>
          <div class="card-ipa" id="rdCardIPA"></div>
          <button type="button" class="fc-say" id="rdCardSayBack"
            aria-label="Озвучить слово">🔊</button>
        </div>
      </div>
    </div>

    <div class="card-actions" id="rdCardActions" style="display:none">
      <button class="card-btn again" id="rdCardAgain">↻ Повторить</button>
      <button class="card-btn good"  id="rdCardGood">✓ Знаю</button>
    </div>

    <div class="fc-done" id="rdCardsDone" hidden>
      <div class="fc-done-emoji">🃏</div>
      <div class="fc-done-title" id="rdCardsDoneTitle"></div>
      <button class="btn btn-primary" id="rdCardsBackToRead">Продолжить чтение →</button>
    </div>
  </div>
</section>

<!-- ── СЛОВАРЬ СТАТЬИ: js/reader-dict.js ── -->
<section class="rd-dict rd-scope" id="rdDict" hidden
  role="dialog" aria-modal="true" aria-label="Словарь текста">

  <header class="rd-top">
    <button class="rd-icon-btn" id="rdDictBack" title="Закрыть словарь"
      aria-label="Закрыть словарь">←</button>
    <div class="rd-top-titles">
      <div class="rd-chapter-title">Словарь текста</div>
      <div class="rd-chapter-sub" id="rdDictSub"></div>
    </div>
  </header>

  <div class="rd-dict-tools">
    <input type="search" class="rd-dict-search" id="rdDictSearch"
      placeholder="Поиск по слову или переводу" aria-label="Поиск по словарю">
    <!-- «Все» — это все полнозначные. Служебные (артикли, предлоги, союзы)
         показывает только их собственный фильтр: число в подписи ставит
         js/reader-dict.js -->
    <div class="rd-seg rd-seg--grid rd-dict-filter" role="group" aria-label="Фильтр">
      <button type="button" data-filter="all"   aria-pressed="true">Все</button>
      <button type="button" data-filter="new"   aria-pressed="false">Новые</button>
      <button type="button" data-filter="known" aria-pressed="false">Знаю</button>
      <button type="button" data-filter="fn"    aria-pressed="false">Служебные</button>
    </div>
    <!-- Главное действие экрана: подпись целиком ставит js/reader-dict.js,
         она называет, что именно уйдёт в карточки (весь словарь или то,
         что отобрано поиском и фильтром) -->
    <div class="rd-dict-actions">
      <button class="rd-dict-go" id="rdDictCards">▶ Учить</button>
      <button class="rd-slot-btn rd-dict-export" id="rdDictExport">⬇ Экспорт</button>
    </div>
  </div>

  <div class="rd-dict-list" id="rdDictList"></div>

  <!-- Экспорт: текст в поле, откуда его можно скопировать где угодно,
       включая Telegram WebView, где скачивание файла не работает -->
  <div class="rd-export" id="rdExport" hidden>
    <div class="rd-export-box">
      <div class="rd-export-head">
        <span class="rd-sheet-title">Экспорт словаря</span>
        <button class="rd-sheet-close" id="rdExportClose" aria-label="Закрыть">✕</button>
      </div>
      <textarea class="rd-export-text" id="rdExportText" readonly rows="10"></textarea>
      <button class="btn btn-primary" id="rdExportCopy">Скопировать</button>
    </div>
  </div>
</section>`;

  function openExternal(event) {
    const link = event.target.closest('a[data-reader-external]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const telegram = window.Telegram?.WebApp;
    if (typeof telegram?.openLink !== 'function' || !/^https:\/\//.test(link.href)) return;
    try {
      telegram.openLink(link.href, { try_instant_view: false });
      event.preventDefault();
    } catch (err) {
      console.warn('[Reader] External link fallback', err);
    }
  }

  const mount = document.getElementById('readerShell');
  if (mount) {
    const template = document.createElement('template');
    template.innerHTML = markup;
    const back = template.content.getElementById('rdBack');
    const label = mount.dataset.backLabel;
    if (label) {
      back.title = label;
      back.setAttribute('aria-label', label);
    }
    mount.replaceWith(template.content);
  }
  return { openExternal };
})();
