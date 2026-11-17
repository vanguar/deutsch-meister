/* Russian history pilot. Reader content and UI labels live in its catalog. */
const HistoryCourse = (() => {
  let catalog = null;
  let observer = null;
  let motion = null;
  const played = new Set();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
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
        <span class="hi-chapter-de" lang="de">${esc(ch.title)}</span>
        <span class="hi-summary">${esc(ch.summary)}</span></span>
        <span class="hi-status">${esc(ch.ready ? (done ? ui.read : ui.ready) : ui.soon)}</span>`;
      return ch.ready
        ? `<li class="hi-item is-ready${done ? ' is-read' : ''}"><a class="hi-chapter" href="#history=${esc(ch.id)}" data-history-open="${esc(ch.id)}">${body}</a></li>`
        : `<li class="hi-item is-soon"><div class="hi-chapter" aria-disabled="true">${body}</div></li>`;
    }).join('');
    $('hiToc').setAttribute('aria-busy', 'false');
    $('hiSources').innerHTML = '<ul>' + catalog.sources.filter(s => /^https:\/\//.test(s.url))
      .map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a></li>`).join('') + '</ul>';
  }

  function requestedId() {
    const match = /^#history=([a-z0-9-]+)$/.exec(location.hash);
    return match && ready(match[1]) ? match[1] : null;
  }

  function stopMotion() {
    if (!motion) return;
    clearTimeout(motion.timer);
    const { img } = motion;
    img.removeEventListener('error', motion.onError);
    img.src = img.dataset.still;
    motion = null;
  }

  function playMotion(img) {
    if (!catalog || reduced.matches || document.hidden || !img.isConnected) return false;
    stopMotion();
    img.src = img.dataset.motion;
    const onError = () => stopMotion();
    img.addEventListener('error', onError, { once: true });
    motion = { img, onError, timer: setTimeout(() => {
      img.removeEventListener('error', onError);
      motion = null; // The one-shot SVG keeps its final still frame.
    }, 4200) };
    return true;
  }

  function prepareMotion() {
    stopMotion();
    if (observer) observer.disconnect();
    const images = $('rdContent').querySelectorAll('img[data-motion]');
    if (reduced.matches || !window.IntersectionObserver) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          if (motion && motion.img === entry.target) stopMotion();
          continue;
        }
        const img = entry.target;
        const key = Reader.state.bookId + ':' + img.dataset.motion;
        if (!played.has(key) && playMotion(img)) {
          played.add(key);
        }
      }
    }, { root: $('rdViewport'), threshold: [0, 0.5] });
    images.forEach(img => observer.observe(img));
  }

  function refresh() {
    stopMotion();
    if (observer) observer.disconnect();
    if (catalog) render();
  }

  function onHistory() {
    stopMotion();
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
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-history-open]');
      if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
        event.preventDefault();
        if (ready(link.dataset.historyOpen)) Reader.open(link.dataset.historyOpen);
      }
    });
    document.addEventListener('dm:reader-render', prepareMotion);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopMotion();
      else prepareMotion();
    });
    reduced.addEventListener('change', prepareMotion);
    window.addEventListener('popstate', onHistory);
    load();
  }

  return { init, refresh };
})();
document.addEventListener('DOMContentLoaded', () => HistoryCourse.init());
