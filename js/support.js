/* ════════════════════════════════════════════════
   support.js — Поддержать проект (Telegram Stars / USDT)
   ════════════════════════════════════════════════ */

const DONATE = {
  // Кошельки для доната (объединённый набор из проектов freetour + dawnmarketpulse)
  // TODO(владелец): подтвердить адрес USDT TRC-20 перед возвратом в UI.
  //   Кандидаты: TZ6rTYbF5Go94Q4f9uZwcVZ4g3oAnzwDHN (dawnmarketpulse)
  //   и TJJ63iThrWz4mLRNob5C5GezYsRwQtwmeg (freetour). Пока адрес не
  //   подтверждён, TRC-20 в списке НЕ показываем.
  wallets: [
    { icon: '💎', name: 'USDT',     net: 'ERC-20 (Ethereum)', addr: '0xf0e70cb55f38ad3Ca7ABCDD276A997092ecb7346' },
    { icon: '💧', name: 'TON',      net: 'The Open Network',  addr: 'UQB0W1KEAR7RFQ03AIA872jw-2G2ntydiXlyhfTN8rAb2KN5' },
    { icon: '🟡', name: 'Bitcoin',  net: 'BTC',               addr: 'bc1qq0rs5j43yh09tyvdynregg56c68d2yaz6ek8dx' },
    { icon: '💠', name: 'Ethereum', net: 'ETH (ERC-20)',      addr: '0xf0e70cb55f38ad3Ca7ABCDD276A997092ecb7346' },
    { icon: '🟣', name: 'Solana',   net: 'SOL',               addr: '6u31e9B6RMMqWaU6JHX2GTskdsmcNLAKdyqKaUjPq9xk' },
  ],
  // Invoice-ссылки Telegram Stars (createInvoiceLink, currency=XTR).
  // Открываются нативно в мини-аппе через TG.openInvoice — оплата не выходит из апка.
  // ⚠️ При смене токена бота ссылки нужно перегенерировать (см. DEPLOY.md).
  starsTiers: [
    { stars: 50,  url: 'https://t.me/$Uw2g_wP3KUobGAAAphv7F1Jx5Yw' },
    { stars: 100, url: 'https://t.me/$kXjrKAP3KUocGAAARJsQ6jW1TsY' },
    { stars: 250, url: 'https://t.me/$9cRO-wP3KUodGAAAhVHJE9PyOuI' },
    { stars: 500, url: 'https://t.me/$2vFNhAP3KUoeGAAAYGTSN26uKDM' },
  ],
  // @username бота (для оплаты звёздами вне Telegram / открытия чата)
  botUsername: 'GermanMorningBot',
};

/* ── Утилиты ── */
function dmTG() {
  return (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
}
function dmHaptic(type) {
  try { dmTG()?.HapticFeedback?.impactOccurred?.(type || 'light'); } catch (e) {}
}
function dmToast(msg) {
  document.querySelectorAll('.dm-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'dm-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2400);
}

/* ── Каркас модалки ── */
function dmOpen(html) {
  dmClose();
  const overlay = document.createElement('div');
  overlay.className = 'dm-modal';
  overlay.id = 'dmModal';
  overlay.innerHTML = `<div class="dm-card">
      <button class="dm-close" onclick="dmClose()" aria-label="Закрыть">✕</button>
      ${html}
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) dmClose(); });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
}
function dmClose() {
  const el = document.getElementById('dmModal');
  if (!el) return;
  el.classList.remove('show');
  setTimeout(() => el.remove(), 300);
}

/* ── Экран 1: выбор способа ── */
function openDonateModal() {
  dmHaptic('light');
  dmOpen(`
    <div class="dm-emoji">❤️</div>
    <h2 class="dm-title">Поддержать проект</h2>
    <p class="dm-text">
      German Morning — бесплатный проект. Ваша поддержка помогает
      добавлять новые уроки, озвучку и книги. Спасибо! 🙏
    </p>
    <button class="dm-choice" onclick="donateStars()">
      <span class="dm-ci">⭐</span>
      <span>
        <span class="dm-cname">Telegram Stars</span>
        <span class="dm-cdesc">Быстро, прямо в Telegram</span>
      </span>
      <span class="dm-carrow">→</span>
    </button>
    <button class="dm-choice" onclick="donateCrypto()">
      <span class="dm-ci">💎</span>
      <span>
        <span class="dm-cname">Криптовалюта (USDT)</span>
        <span class="dm-cdesc">Перевод на кошелёк</span>
      </span>
      <span class="dm-carrow">→</span>
    </button>
  `);
}

/* ── Способ 1: Telegram Stars ── */
function donateStars() {
  dmHaptic('medium');
  const TG = dmTG();
  const canNative = !!(TG && typeof TG.openInvoice === 'function');

  const tiers = DONATE.starsTiers.map(t => `
    <button class="dm-choice dm-star" onclick="dmPayStars(${t.stars})">
      <span class="dm-ci">⭐</span>
      <span><span class="dm-cname">${t.stars} звёзд</span></span>
      <span class="dm-carrow">→</span>
    </button>`).join('');

  // Апк открыт не в Telegram → звёзды там недоступны, показываем подсказку
  if (!canNative) {
    dmOpen(`
      <div class="dm-emoji">⭐</div>
      <h2 class="dm-title">Оплата звёздами</h2>
      <p class="dm-text">
        Telegram Stars доступны только внутри приложения <b>Telegram</b>.
        Откройте курс через бота <b>@${DONATE.botUsername}</b> — и оплата
        пройдёт прямо в мини-аппе.
      </p>
      <button class="dm-btn stars" onclick="dmOpenBotDonate()">📲 Открыть в Telegram</button>
      <button class="dm-btn-ghost" onclick="donateCrypto()">💎 Поддержать криптой</button>
      <button class="dm-btn-ghost" onclick="openDonateModal()">← Назад</button>
    `);
    return;
  }

  dmOpen(`
    <div class="dm-emoji">⭐</div>
    <h2 class="dm-title">Поддержать звёздами</h2>
    <p class="dm-text">Выберите количество Telegram Stars — оплата пройдёт прямо здесь.</p>
    ${tiers}
    <button class="dm-btn-ghost" onclick="openDonateModal()">← Назад</button>
  `);
}

function dmPayStars(stars) {
  const TG = dmTG();
  const tier = DONATE.starsTiers.find(t => t.stars === stars);
  if (!tier) return;
  dmHaptic('medium');

  // Нативная оплата прямо в мини-аппе
  if (TG && typeof TG.openInvoice === 'function') {
    TG.openInvoice(tier.url, status => {
      if (status === 'paid') {
        dmClose();
        dmToast('Спасибо за поддержку! ⭐');
      } else if (status === 'failed') {
        dmToast('Платёж не прошёл, попробуйте ещё раз');
      }
      // 'cancelled' / 'pending' — тихо
    });
    return;
  }
  // На всякий случай — подсказка вернуться в Telegram
  donateStars();
}

function dmOpenBotDonate() {
  const url = `https://t.me/${DONATE.botUsername}?start=donate`;
  const TG = dmTG();
  if (TG && typeof TG.openTelegramLink === 'function') TG.openTelegramLink(url);
  else window.open(url, '_blank');
}

/* ── Способ 2: Криптовалюта ── */
function donateCrypto() {
  dmHaptic('medium');
  const list = DONATE.wallets.map((w, i) => `
    <div class="dm-wallet-item">
      <div class="dm-wallet-head">
        <span class="dm-wallet-coin">${w.icon} ${w.name}</span>
        <span class="dm-wallet-net">${w.net}</span>
      </div>
      <div class="dm-wallet">
        <code>${w.addr}</code>
        <button class="dm-copy" data-i="${i}" onclick="dmCopyWallet(${i}, this)">Копировать</button>
      </div>
    </div>`).join('');
  dmOpen(`
    <div class="dm-emoji">💎</div>
    <h2 class="dm-title">Поддержать криптовалютой</h2>
    <p class="dm-text">Отправьте любую сумму на один из кошельков ниже.</p>
    <div class="dm-wallet-list">${list}</div>
    <p class="dm-note">
      ⚠️ Отправляйте монету строго в указанной сети —
      перевод в другой сети может привести к потере средств.
    </p>
    <button class="dm-btn-ghost" onclick="openDonateModal()">← Назад</button>
  `);
}

function dmCopyWallet(i, btn) {
  const w = DONATE.wallets[i];
  if (!w) return;
  const done = () => {
    dmHaptic('light');
    if (btn) { btn.textContent = 'Готово ✓'; btn.classList.add('copied'); }
    dmToast(`Адрес ${w.name} (${w.net}) скопирован`);
    setTimeout(() => { if (btn) { btn.textContent = 'Копировать'; btn.classList.remove('copied'); } }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(w.addr).then(done).catch(() => dmFallbackCopy(w.addr, done));
  } else {
    dmFallbackCopy(w.addr, done);
  }
}
function dmFallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) { dmToast('Скопируйте адрес вручную'); }
  ta.remove();
}

/* ── Пункт «Книги на немецком» ───────────────────────────────────
   Имя openBooksModal() сохранено: его вызывают 68 оболочек уроков
   через inline-onclick, менять их нельзя. Модалки-заглушки больше
   нет — пункт ведёт в библиотеку.                                  */

// Глубина страницы вычисляется по <link rel="manifest">: в корне это
// manifest.json, в уроке — ../../../manifest.json. Отдельной константы
// с базовым путём в проекте нет, а манифест есть на каждой странице.
function dmBasePath() {
  try {
    const link = document.querySelector('link[rel="manifest"]');
    const href = (link && link.getAttribute('href')) || '';
    const base = href.replace(/manifest\.json(?:\?.*)?$/, '');
    if (/manifest\.json/.test(href)) return base;
  } catch (e) {}
  return '';
}

function dmBooksUrl() { return dmBasePath() + 'books.html'; }

function openBooksModal() {
  dmHaptic('light');
  window.location.href = dmBooksUrl();
}

// В 68 оболочках пункт подписан старым текстом заглушки, а сами оболочки
// править нельзя — поправляем подпись на месте, при загрузке страницы.
function dmFixBooksItem() {
  try {
    document.querySelectorAll('.side-action').forEach(btn => {
      if (((btn.getAttribute('onclick') || '').indexOf('openBooksModal') < 0)) return;
      const title = btn.querySelector('.sa-title');
      const sub   = btn.querySelector('.sa-sub');
      btn.classList.add('books');
      if (title) title.textContent = 'Книги на немецком';
      if (sub)   sub.textContent   = 'Чтение с переводом и озвучкой';
    });
  } catch (e) {}
}

/* ── Пункт «Новости на немецком» ─────────────────────────────────
   news.html — витрина рубрик «Астрономия», «Наука», «Технологии»,
   «Экономика» и «События», у каждой своя страница со статьями. Пункт
   добавляется сразу после «Книг» во всех меню, где они есть: так не
   нужно править 68 оболочек уроков и главную по отдельности.        */
function dmNewsUrl() { return dmBasePath() + 'news.html'; }

function openNewsPage() {
  dmHaptic('light');
  window.location.href = dmNewsUrl();
}

function dmAddNewsItem() {
  try {
    document.querySelectorAll('.side-action').forEach(books => {
      if (((books.getAttribute('onclick') || '').indexOf('openBooksModal') < 0)) return;
      const parent = books.parentNode;
      if (!parent || parent.querySelector('.side-action.news')) return;
      const btn = document.createElement('button');
      btn.className = 'side-action news';
      btn.setAttribute('onclick', 'openNewsPage()');
      btn.innerHTML =
        '<span class="sa-ico">📰</span>' +
        '<span class="sa-txt">' +
          '<span class="sa-title">Новости на немецком <span class="sa-new"><span>Есть статьи</span></span></span>' +
          '<span class="sa-sub">Свежие статьи с переводом и озвучкой</span>' +
        '</span>';
      books.insertAdjacentElement('afterend', btn);
    });
    dmNewsBadgeLive();
  } catch (e) {}
}

/* Бейдж у «Новостей» — живой: пока есть статья не старше DM_NEWS_FRESH_DAYS
   дней (по дате публикации в источнике), вместо «Есть статьи» горит
   «🔥 Свежее». Правило то же, что у ленты (FRESH_DAYS в js/news.js).
   Без сети или при ошибке остаётся «Есть статьи» — это всегда правда. */
const DM_NEWS_FRESH_DAYS = 3;

function dmNewsAgeDays(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return Infinity;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // локальная полночь, а не UTC — иначе западнее Гринвича «сегодня» станет «вчера»
  return Math.round((today - new Date(+m[1], +m[2] - 1, +m[3])) / 864e5);
}

function dmNewsBadgeLive() {
  if (!document.querySelector('.side-action.news .sa-new') || typeof fetch !== 'function') return;
  fetch(dmBasePath() + 'data/news/index.json')
    .then(r => (r.ok ? r.json() : null))
    .then(idx => {
      const items = (idx && idx.items) || [];
      const fresh = items.some(it => dmNewsAgeDays(it.published) <= DM_NEWS_FRESH_DAYS);
      document.querySelectorAll('.side-action.news .sa-new').forEach(b => {
        b.classList.toggle('fresh', fresh);
        // число/эмодзи и слово — в разных узлах, чтобы DOM-переводчик перевёл слово
        b.innerHTML = fresh ? '🔥 <span>Свежее</span>' : '<span>Есть статьи</span>';
      });
    })
    .catch(() => {});
}

/* ── Пункт «Связь с автором» ─────────────────────────────────────
   Замечания и предложения — в личные сообщения Telegram. Внутри
   мини-аппа ссылку открывает сам Telegram (иначе WebView уйдёт со
   страницы), в браузере — новая вкладка. Добавляется последним в тот
   же блок, что «Книги» и «Новости», — во всех меню сразу.            */
const DM_CONTACT = { username: 'ObiVan1978' };

function dmContactUrl() { return 'https://t.me/' + DM_CONTACT.username; }

function openContactAuthor() {
  dmHaptic('light');
  const url = dmContactUrl();
  const TG = dmTG();
  if (TG && typeof TG.openTelegramLink === 'function') TG.openTelegramLink(url);
  else window.open(url, '_blank', 'noopener');
}

function dmAddContactItem() {
  try {
    document.querySelectorAll('.sidebar-extra').forEach(box => {
      if (box.querySelector('.side-action.contact')) return;
      const btn = document.createElement('button');
      btn.className = 'side-action contact';
      btn.type = 'button';
      btn.setAttribute('onclick', 'openContactAuthor()');
      btn.innerHTML =
        '<span class="sa-ico">💬</span>' +
        '<span class="sa-txt">' +
          '<span class="sa-title">Связь с автором</span>' +
          '<span class="sa-sub">Замечания и предложения <span class="sa-tg">@' + DM_CONTACT.username + '</span></span>' +
        '</span>';
      box.appendChild(btn);
    });
  } catch (e) {}
}

function dmSidebarExtras() {
  dmFixBooksItem();
  dmAddNewsItem();
  dmAddContactItem();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', dmSidebarExtras);
} else {
  dmSidebarExtras();
}

Object.assign(window, {
  openContactAuthor,
  dmClose,
  openDonateModal,
  donateStars,
  donateCrypto,
  dmPayStars,
  dmOpenBotDonate,
  dmCopyWallet,
  openBooksModal,
  dmBooksUrl,
  openNewsPage,
  dmNewsUrl
});

/* Закрытие по Esc */
document.addEventListener('keydown', e => { if (e.key === 'Escape') dmClose(); });
