/* Calendar dates are computed as civil dates in UTC, independent of DST. */
const HolidayDates = (() => {
  const formatToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const date = (year, month, day = 1) => new Date(Date.UTC(year, month - 1, day));
  const key = value => value.toISOString().slice(0, 10);

  function today(now = new Date()) {
    const parts = Object.fromEntries(formatToday.formatToParts(now).map(part => [part.type, part.value]));
    return date(Number(parts.year), Number(parts.month), Number(parts.day));
  }

  // Gregorian computus (Meeus–Jones–Butcher).
  function easter(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - c % 4) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = h + l - 7 * m + 114;
    return date(year, Math.floor(n / 31), n % 31 + 1);
  }

  function occurrence(rule, year) {
    if (rule.type === 'easter') {
      const sunday = easter(year);
      sunday.setUTCDate(sunday.getUTCDate() + rule.offset);
      return sunday;
    }
    if (rule.type === 'repentance') {
      const last = date(year, 11, 22);
      return date(year, 11, 22 - (last.getUTCDay() + 4) % 7);
    }
    return date(year, rule.month, rule.day);
  }

  function inYear(items, year) {
    return items.map(item => ({ item, date: occurrence(item.rule, year) }))
      .sort((left, right) => left.date - right.date || left.item.id.localeCompare(right.item.id));
  }

  function validRule(rule) {
    if (rule?.type === 'repentance') return true;
    if (rule?.type === 'easter') return Number.isInteger(rule.offset) && Number.isFinite(+occurrence(rule, 2026));
    if (rule?.type !== 'fixed' || !Number.isInteger(rule.month) || !Number.isInteger(rule.day)) return false;
    const when = occurrence(rule, 2026);
    return when.getUTCFullYear() === 2026 && when.getUTCMonth() + 1 === rule.month && when.getUTCDate() === rule.day;
  }

  function validCatalog(catalog) {
    if (catalog?.version !== 1 || !Array.isArray(catalog.items)) return false;
    const valid = catalog.items.every(item => typeof item?.id === 'string' && /^holiday-[a-z0-9-]+$/.test(item.id)
      && typeof item.titleRu === 'string' && item.titleRu.trim()
      && typeof item.region === 'string' && item.region.trim() && validRule(item.rule));
    return valid && new Set(catalog.items.map(item => item.id)).size === catalog.items.length;
  }

  return { date, key, today, occurrence, inYear, validCatalog };
})();

if (typeof module !== 'undefined') module.exports = HolidayDates;

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => {
  const { date, key, today, occurrence, inYear, validCatalog } = HolidayDates;
  const $ = id => document.getElementById(id);
  const root = $('holidayCalendar');
  const tile = $('readHolidays');
  if (!root && !tile) return;

  const fetchCatalog = async () => {
    const response = await fetch('data/holidays/index.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Holiday calendar: HTTP ' + response.status);
    const catalog = await response.json();
    if (!validCatalog(catalog)) throw new Error('Holiday calendar: invalid catalog');
    return catalog;
  };
  const t = text => window.I18N ? I18N.t(text) : text;

  if (tile) {
    const subtitle = $('holidayHomeDate');
    let catalog = null;
    function paintTile() {
      if (!catalog) return;
      const now = today();
      const matches = inYear(catalog.items, now.getUTCFullYear()).filter(entry => key(entry.date) === key(now));
      const item = matches.length === 1 ? matches[0].item : null;
      subtitle.textContent = item ? `${t('Сегодня')} · ${item.titleRu}`
        : t(matches.length ? 'Праздники сегодня' : 'Календарь и обычаи');
      tile.href = item ? `holidays.html#holiday=${item.id}` : 'holidays.html';
    }
    async function updateTile() {
      try {
        catalog = await fetchCatalog();
        paintTile();
      } catch (_) { /* The ordinary calendar link is usable without data. */ }
    }
    if (typeof IntersectionObserver === 'undefined') updateTile();
    else {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        updateTile();
      });
      observer.observe(tile);
    }
    window.addEventListener('pageshow', paintTile);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) paintTile(); });
    return;
  }

  const language = window.I18N?.lang || 'ru';
  const format = options => new Intl.DateTimeFormat(language, { ...options, timeZone: 'UTC' });
  const monthTitle = format({ month: 'long', year: 'numeric' });
  const weekday = format({ weekday: 'short' });
  const shortDate = format({ month: 'short', day: 'numeric' });
  const longDate = format({ weekday: 'long', month: 'long', day: 'numeric' });
  const digits = new Intl.NumberFormat(language);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const toMonth = day => date(day.getUTCFullYear(), day.getUTCMonth() + 1);
  const monthParam = /^([2-9]\d{3})-(0[1-9]|1[012])$/.exec(new URLSearchParams(location.search).get('month') || '');
  let shown = monthParam ? date(Number(monthParam[1]), Number(monthParam[2])) : toMonth(today());
  let items = null;
  let lastLink = null;
  const days = $('holidayDays');
  const agenda = $('holidayList');
  const nextDateButton = $('holidayNextDate');

  function render() {
    $('holidayMonth').textContent = monthTitle.format(shown);
    const year = shown.getUTCFullYear();
    const month = shown.getUTCMonth() + 1;
    const current = key(today());
    const monthDates = items ? inYear(items, year).filter(entry => entry.date.getUTCMonth() + 1 === month) : [];
    const byDate = new Map();
    for (const entry of monthDates) {
      const iso = key(entry.date);
      if (!byDate.has(iso)) byDate.set(iso, []);
      byDate.get(iso).push(entry.item);
    }
    const start = (shown.getUTCDay() + 6) % 7;
    const count = date(year, month + 1, 0).getUTCDate();
    const empty = '<li aria-hidden="true"></li>';
    const cells = Array.from({ length: count }, (_, i) => {
      const day = i + 1;
      const timestamp = date(year, month, day);
      const iso = key(timestamp);
      const events = byDate.get(iso);
      const marker = iso === current ? ' aria-current="date"' : '';
      const label = digits.format(day);
      if (!events) return `<li><span class="hd-day" data-date="${iso}"${marker}>${label}</span></li>`;
      const titles = esc([longDate.format(timestamp), ...events.map(item => item.titleRu)].join(' · '));
      const anchor = events.length === 1
        ? `href="#holiday=${esc(events[0].id)}" data-holiday="${esc(events[0].id)}"`
        : `href="#holiday-list-${iso}" data-agenda-day="${iso}"`;
      return `<li><a class="hd-day" data-date="${iso}" ${anchor}${marker} aria-label="${titles}">${label}</a></li>`;
    });
    days.innerHTML = empty.repeat(start) + cells.join('') + empty.repeat((7 - (start + count) % 7) % 7);
    if (!items) return;
    $('holidayStatus').textContent = monthDates.length ? '' : t('В этом месяце нет дат с описанием.');
    if (nextDateButton) nextDateButton.hidden = monthDates.length > 0 || items.length === 0;
    agenda.innerHTML = monthDates.map(({ item, date: when }) => {
      const iso = key(when);
      const group = byDate.get(iso);
      const target = group.length > 1 && group[0] === item ? ` id="holiday-list-${iso}"` : '';
      return `<li><a class="hd-event"${target} href="#holiday=${esc(item.id)}" data-holiday="${esc(item.id)}" data-date="${iso}">
        <time datetime="${iso}">${esc(shortDate.format(when))}</time>
        <span><span class="hd-event-title">${esc(item.titleRu)}</span><span class="hd-event-place">${esc(item.region)}</span></span>
        <span class="hd-event-arrow" aria-hidden="true">→</span></a></li>`;
    }).join('');
  }

  function monthUrl() {
    const url = new URL(location.href);
    url.searchParams.set('month', key(shown).slice(0, 7));
    return url;
  }

  function changeMonth(value) {
    shown = value;
    history.replaceState(history.state, '', monthUrl());
    render();
  }

  function fromHash() {
    const match = /^#holiday=([a-z0-9-]+)$/.exec(location.hash);
    return match && items?.find(item => item.id === match[1]);
  }

  function openHoliday(id, fromHistory = false) {
    Reader.open(id, { fromHistory });
    $('rdBack').focus({ preventScroll: true });
  }

  function refreshTodayMarker() {
    if (document.hidden) return;
    const previous = days.querySelector('[aria-current="date"]');
    const current = days.querySelector(`[data-date="${key(today())}"]`);
    if (previous === current) return;
    previous?.removeAttribute('aria-current');
    current?.setAttribute('aria-current', 'date');
  }

  async function load() {
    root.setAttribute('aria-busy', 'true');
    $('holidayStatus').textContent = t('Загружаем календарь…');
    $('holidayRetry').hidden = true;
    if (nextDateButton) nextDateButton.hidden = true;
    try {
      const catalog = await fetchCatalog();
      items = catalog.items;
      const item = fromHash();
      let restored = false;
      if (item) {
        if (!monthParam) shown = toMonth(occurrence(item.rule, shown.getUTCFullYear()));
        restored = history.state?.view === 'reader';
        const url = monthUrl();
        if (!restored) url.hash = '';
        history.replaceState(restored ? history.state : null, '', url);
      } else if (location.hash.startsWith('#holiday=')) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      render();
      if (item) openHoliday(item.id, restored);
      const group = /^#(holiday-list-\d{4}-\d{2}-\d{2})$/.exec(location.hash);
      if (group) $(group[1])?.focus();
    } catch (err) {
      console.warn('[Holidays]', err);
      $('holidayStatus').textContent = t('Календарь не загрузился.');
      $('holidayRetry').hidden = false;
    } finally {
      root.setAttribute('aria-busy', 'false');
    }
  }

  document.title = t(document.title);
  $('holidayWeek').innerHTML = Array.from({ length: 7 }, (_, i) => `<li>${esc(weekday.format(date(2024, 1, i + 1)))}</li>`).join('');
  root.querySelectorAll('[data-month-step]').forEach(button => button.addEventListener('click', () => {
    changeMonth(date(shown.getUTCFullYear(), shown.getUTCMonth() + 1 + Number(button.dataset.monthStep)));
  }));
  $('holidayToday').addEventListener('click', () => changeMonth(toMonth(today())));
  $('holidayRetry').addEventListener('click', load);
  nextDateButton?.addEventListener('click', () => {
    if (!items?.length) return;
    const year = shown.getUTCFullYear();
    const next = inYear(items, year).find(entry => entry.date >= shown) || inYear(items, year + 1)[0];
    changeMonth(toMonth(next.date));
    agenda.querySelector('a')?.focus();
  });
  window.addEventListener('pageshow', refreshTodayMarker);
  document.addEventListener('visibilitychange', refreshTodayMarker);
  document.addEventListener('click', ReaderShell.openExternal);
  root.addEventListener('click', event => {
    if (event.button !== 0 || event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;
    const link = event.target.closest('[data-holiday], [data-agenda-day]');
    if (!link) return;
    if (link.dataset.agendaDay) {
      event.preventDefault();
      $(`holiday-list-${link.dataset.agendaDay}`)?.focus();
    } else if (items?.some(item => item.id === link.dataset.holiday)) {
      event.preventDefault();
      lastLink = link;
      openHoliday(link.dataset.holiday);
    }
  });
  window.addEventListener('popstate', () => {
    const item = fromHash();
    if (item && (!Reader.state.open || Reader.state.bookId !== item.id)) {
      openHoliday(item.id, true);
    } else if (!item && Reader.state.bookId) {
      const id = Reader.state.bookId;
      const selector = `[data-holiday="${id}"]`;
      const target = lastLink?.isConnected && lastLink.dataset.holiday === id ? lastLink
        : days.querySelector(selector) || agenda.querySelector(selector);
      // The browser can focus the fragment after popstate restores a shared date.
      requestAnimationFrame(() => { if (!Reader.state.open) target?.focus(); });
    }
  });

  render();
  load();
});
