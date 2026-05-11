const TG = window.Telegram?.WebApp;

if (TG) {
  TG.ready();
  TG.expand();

  // Применяем цветовую схему Telegram
  const scheme = TG.colorScheme;
  if (scheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Кнопка "назад" на страницах уроков
  if (location.pathname !== '/' && !location.pathname.endsWith('index.html') === false) {
    TG.BackButton.show();
    TG.BackButton.onClick(() => history.back());
  }
}
