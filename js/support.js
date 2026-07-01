/* ════════════════════════════════════════════════
   support.js — Поддержать проект (Telegram Stars / USDT)
   ════════════════════════════════════════════════ */

const DONATE = {
  // Кошельки для доната (объединённый набор из проектов freetour + dawnmarketpulse)
  // ⚠️ USDT TRC-20: взят актуальный адрес из активного бота dawnmarketpulse.
  //    В проекте freetour был другой адрес (TJJ63iThrWz4mLRNob5C5GezYsRwQtwmeg) — подтвердить.
  wallets: [
    { icon: '🔴', name: 'USDT',     net: 'TRC-20 (Tron)',     addr: 'TZ6rTYbF5Go94Q4f9uZwcVZ4g3oAnzwDHN' },
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
      Deutsch Meister — бесплатный проект. Ваша поддержка помогает
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

/* ── Пункт: развитие проекта / книги ── */
function openBooksModal() {
  dmHaptic('light');
  dmOpen(`
    <div class="dm-emoji">📖</div>
    <h2 class="dm-title">Проект развивается</h2>
    <p class="dm-text">
      Мы активно работаем над Deutsch Meister! Уже скоро выйдут
      <b>книги на немецком</b> с встроенным обучающим процессом:
      чтение с озвучкой, разбором слов и упражнениями прямо по тексту.
    </p>
    <div class="dm-net-badge">🚀 Скоро в обновлении</div>
    <p class="dm-note">Следите за новостями — спасибо, что вы с нами!</p>
    <button class="dm-btn" onclick="dmClose()">Отлично, жду! 🙌</button>
  `);
}

/* Закрытие по Esc */
document.addEventListener('keydown', e => { if (e.key === 'Escape') dmClose(); });
