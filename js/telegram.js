const TG = window.Telegram?.WebApp;

if (TG) {
  TG.ready();
  TG.expand();

  // Тема Telegram
  if (TG.colorScheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Кнопка "назад" на страницах уроков
  const isLesson = location.pathname.includes('/lessons/');
  if (isLesson) {
    TG.BackButton.show();
    TG.BackButton.onClick(() => history.back());
  }

  // Персональное приветствие только на главной
  const isHome = !isLesson;
  console.log('[TG] isLesson:', isLesson, 'isHome:', isHome);
  console.log('[TG] initDataUnsafe:', JSON.stringify(TG.initDataUnsafe));
  console.log('[TG] tg_welcomed:', localStorage.getItem('tg_welcomed'));
  if (isHome && !localStorage.getItem('tg_welcomed')) {
    localStorage.setItem('tg_welcomed', '1');
    const user = TG.initDataUnsafe?.user;
    const name = user?.first_name || 'друг';
    console.log('[TG] Showing welcome for:', name);
    showTgWelcome(name);
  }
}

function showTgWelcome(name) {
  const overlay = document.createElement('div');
  overlay.id = 'tg-welcome';
  overlay.innerHTML = `
    <div class="tgw-card">
      <div class="tgw-flag">🇩🇪</div>
      <h2 class="tgw-title">Привет, ${name}!</h2>
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
