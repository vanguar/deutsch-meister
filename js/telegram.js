function isTelegramWebView() {
  const ua = navigator.userAgent || '';
  return /Telegram/i.test(ua) || /tgWebApp/i.test(location.hash + location.search);
}

function loadTelegramSdk() {
  if (window.Telegram?.WebApp) return Promise.resolve(window.Telegram.WebApp);
  if (!isTelegramWebView()) return Promise.resolve(null);

  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => resolve(window.Telegram?.WebApp || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

loadTelegramSdk().then(TG => {
  if (!TG) return;

  TG.ready();
  TG.expand();

  // Тема Telegram
  if (TG.colorScheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Кнопка "назад" (только Telegram 6.1+)
  const isLesson = location.pathname.includes('/lessons/');
  const HOME_URL = 'https://vanguar.github.io/deutsch-meister/';

  if (TG.isVersionAtLeast('6.1')) {
    if (isLesson) {
      // На уроке: назад по истории, а если истории нет — на главную (не зависаем)
      TG.BackButton.show();
      TG.BackButton.onClick(() => {
        if (window.history.length > 1) history.back();
        else window.location.href = HOME_URL;
      });
    } else {
      // На главной кнопку "назад" прячем, чтобы Telegram показал крестик "Закрыть"
      TG.BackButton.hide();
    }
  }

  // Аппаратная кнопка "назад" на Android приходит как событие backButtonClicked —
  // Telegram уже вызывает наш onClick выше. На всякий случай гарантируем закрытие
  // приложения с главной по системной кнопке через closingBehavior по умолчанию.

  // Персональное приветствие только на главной
  const isHome = !isLesson;
  if (isHome && !localStorage.getItem('tg_welcomed')) {
    localStorage.setItem('tg_welcomed', '1');
    const user = TG.initDataUnsafe?.user;
    const name = user?.first_name || 'друг';
    showTgWelcome(name);
  }
});

function tgEsc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showTgWelcome(name) {
  const overlay = document.createElement('div');
  overlay.id = 'tg-welcome';
  overlay.innerHTML = `
    <div class="tgw-card">
      <div class="tgw-flag">🇩🇪</div>
      <h2 class="tgw-title">Привет, ${tgEsc(name)}!</h2>
      <p class="tgw-text">
        Рад видеть тебя здесь — ты только что сделал отличный выбор! 🎉
      </p>
      <div class="tgw-features">
        <div class="tgw-feat">📚 32 урока · A1 → B2</div>
        <div class="tgw-feat">🔊 Озвучка всех фраз</div>
        <div class="tgw-feat">✏️ Интерактивные упражнения</div>
        <div class="tgw-feat">🃏 Флэшкарты</div>
        <div class="tgw-feat">🔥 Стрики и XP</div>
        <div class="tgw-feat">📱 Работает офлайн</div>
      </div>
      <button class="tgw-btn" onclick="closeTgWelcome()">🚀 Начать учить немецкий!</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('tgw-show'));
}

function closeTgWelcome() {
  const el = document.getElementById('tg-welcome');
  if (!el) return;
  el.classList.remove('tgw-show');
  setTimeout(() => el.remove(), 350);
}
