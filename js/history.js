/* History course: localized catalog and shared reader. */
const HistoryCourse = (() => {
  let catalog = null;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  function ready(id) {
    return catalog && catalog.chapters.some(ch => ch.id === id && ch.ready);
  }

  function progress(id) {
    try {
      const value = JSON.parse(localStorage.getItem('dm_book_pos:' + id) || 'null');
      return Math.min(100, Math.max(0, Number(value && value.percent) || 0));
    } catch (_) { return 0; }
  }

  function render() {
    const ui = catalog.ui;
    $('hiCount').textContent = catalog.chapters.filter(ch => ch.ready).length + ' / ' + catalog.chapters.length;
    $('hiToc').innerHTML = catalog.chapters.map((ch, i) => {
      const done = ch.ready && progress(ch.id) >= 90;
      const body = `<span class="hi-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="hi-chapter-body"><span class="hi-period">${esc(ch.period)}</span>
        <span class="hi-chapter-title">${esc(ch.titleRu)}</span>
        <span class="hi-chapter-de" lang="de" dir="ltr">${esc(ch.title)}</span>
        <span class="hi-summary">${esc(ch.summary)}</span></span>
        <span class="hi-status">${esc(ch.ready ? (done ? ui.read : ui.ready) : ui.soon)}</span>`;
      return ch.ready
        ? `<li class="hi-item is-ready${done ? ' is-read' : ''}"><a class="hi-chapter" href="#history=${esc(ch.id)}" data-history-open="${esc(ch.id)}">${body}</a></li>`
        : `<li class="hi-item is-soon"><div class="hi-chapter" aria-disabled="true">${body}</div></li>`;
    }).join('');
    $('hiToc').setAttribute('aria-busy', 'false');
    $('hiSources').innerHTML = '<ul>' + catalog.sources.filter(s => /^https:\/\//.test(s.url))
      .map(s => `<li><a class="hi-source-link" data-reader-external href="${esc(s.url)}" rel="noopener noreferrer">
        <span class="hi-source-name">${esc(s.name)}</span>
        <span class="hi-source-domain" dir="ltr">${esc(new URL(s.url).hostname.replace(/^www\./, ''))}${/\.pdf(?:$|[?#])/i.test(s.url) ? ' · PDF' : ''}</span>
        <span class="hi-link-icon" aria-hidden="true">↗</span></a></li>`).join('') + '</ul>';
  }

  function requestedId() {
    const match = /^#history=([a-z0-9-]+)$/.exec(location.hash);
    return match && ready(match[1]) ? match[1] : null;
  }

  function refresh() {
    if (catalog) render();
  }

  function onHistory() {
    const id = requestedId();
    if (id && (!Reader.state.open || Reader.state.bookId !== id)) Reader.open(id, { fromHistory: true });
  }

  async function load() {
    const list = $('hiToc');
    list.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('data/history/index.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('History catalog: HTTP ' + response.status);
      catalog = await response.json();
      render();
      const id = requestedId();
      if (id) {
        if (history.state && history.state.view === 'reader') Reader.open(id, { fromHistory: true });
        else {
          history.replaceState(null, '', location.pathname + location.search);
          Reader.open(id);
        }
      } else if (location.hash.startsWith('#history=')) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    } catch (err) {
      console.error('[History]', err);
      // Static fallback is readable even when the catalog request fails.
      list.replaceChildren($('hiErrorTemplate').content.cloneNode(true));
      list.setAttribute('aria-busy', 'false');
      $('hiRetry').addEventListener('click', load);
    }
  }

  function init() {
    if (!$('hiToc')) return;
    if (window.I18N) document.title = I18N.t(document.title);
    document.addEventListener('click', event => {
      const external = event.target.closest('a[data-reader-external]');
      if (external && !event.defaultPrevented && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        const tg = window.Telegram && window.Telegram.WebApp;
        if (tg && typeof tg.openLink === 'function' && /^https:\/\//.test(external.href)) {
          try {
            tg.openLink(external.href, { try_instant_view: false });
            event.preventDefault();
          } catch (err) {
            // Native same-tab navigation remains available if the SDK fails.
            console.warn('[History] External link fallback', err);
          }
        }
      }
      const link = event.target.closest('[data-history-open]');
      if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
        event.preventDefault();
        if (ready(link.dataset.historyOpen)) Reader.open(link.dataset.historyOpen);
      }
    });
    window.addEventListener('popstate', onHistory);
    load();
  }

  return { init, refresh };
})();
document.addEventListener('DOMContentLoaded', () => HistoryCourse.init());
