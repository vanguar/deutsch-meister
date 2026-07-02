/* ═══════════════════════════════════════════════
   js/install-app.js — подсказка и установка PWA

   Внутри Telegram звук иногда молчит (ограничения WebView). Решение —
   установить приложение на телефон (PWA) и запускать с иконки: там звук,
   офлайн и полноценный режим.

   Модуль добавляет:
     • всплывающую подсказку (только внутри Telegram),
     • пункт меню «Установить на телефон»,
     • модалку с инструкцией (отдельно для iPhone / Android) и кнопкой
       «Открыть в браузере» (из Telegram установка недоступна).
   Стили инлайновые с фолбэками — правок CSS не требуется.
   ═══════════════════════════════════════════════ */
(function () {
  const APP_URL = 'https://vanguar.github.io/deutsch-meister/';

  function tg() { return window.Telegram && window.Telegram.WebApp; }

  function inTelegram() {
    const wa = tg();
    if (wa && wa.platform && wa.platform !== 'unknown') return true;
    if (typeof window.TelegramWebviewProxy !== 'undefined') return true;
    if (typeof window.TelegramWebviewProxyProto !== 'undefined') return true;
    if (typeof isTelegramWebView === 'function' && isTelegramWebView()) return true;
    return /Telegram/i.test(navigator.userAgent || '');
  }

  function isIOS() {
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod/i.test(ua) ||
           (/Macintosh/.test(ua) && 'ontouchend' in document);
  }

  /* ── Модалка с инструкцией ── */
  function buildModal() {
    if (document.getElementById('installModal')) return;
    const ios = isIOS();
    const wrap = document.createElement('div');
    wrap.id = 'installModal';
    wrap.style.cssText =
      'position:fixed;inset:0;z-index:10000;display:none;align-items:center;' +
      'justify-content:center;background:rgba(0,0,0,.6);padding:20px';

    wrap.innerHTML =
      '<div style="background:var(--surface2,#1b1b25);border:1px solid var(--border,#333);' +
      'border-radius:18px;max-width:430px;width:100%;padding:24px;color:var(--text,#eee);' +
      'box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow:auto">' +
        '<div style="font-size:40px;text-align:center;margin-bottom:8px">📲</div>' +
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:22px;margin:0 0 6px;' +
        'text-align:center;color:#fff">Установить приложение</h2>' +
        '<p style="font-size:14px;color:var(--text-muted,#9a9);line-height:1.5;text-align:center;margin:0 0 16px">' +
          'Если в Telegram нет звука — установи Deutsch Meister на телефон и запускай ' +
          'с иконки. Там озвучка работает, плюс офлайн-доступ. 🔊' +
        '</p>' +
        (inTelegram()
          ? '<button id="installOpenBrowser" style="width:100%;border:0;border-radius:12px;' +
            'padding:14px;font-size:15px;font-weight:600;background:var(--accent,#7c6af7);' +
            'color:#fff;cursor:pointer;margin-bottom:8px">🌐 Открыть в браузере</button>' +
            '<p style="font-size:12px;color:var(--text-dim,#777);text-align:center;margin:0 0 16px">' +
            'Установка возможна только из браузера, не из Telegram.</p>'
          : '') +
        '<div style="background:var(--surface3,#232330);border-radius:12px;padding:14px;' +
        'font-size:13px;line-height:1.7">' +
          '<div style="font-weight:600;margin-bottom:6px">' +
            (ios ? '📱 На iPhone / iPad (Safari):' : '🤖 На Android (Chrome):') +
          '</div>' +
          (ios
            ? '1. Открой сайт в <b>Safari</b><br>' +
              '2. Нажми кнопку <b>«Поделиться»</b> (квадрат со стрелкой ↑)<br>' +
              '3. Выбери <b>«На экран „Домой“»</b><br>' +
              '4. Запускай курс с новой иконки 🇩🇪'
            : '1. Открой сайт в <b>Chrome</b><br>' +
              '2. Нажми меню <b>⋮</b> (три точки справа вверху)<br>' +
              '3. Выбери <b>«Установить приложение»</b> / «Добавить на главный экран»<br>' +
              '4. Запускай курс с новой иконки 🇩🇪') +
        '</div>' +
        '<button id="installClose" style="width:100%;border:1px solid var(--border,#333);' +
        'background:transparent;color:var(--text-muted,#9a9);border-radius:12px;padding:12px;' +
        'font-size:14px;cursor:pointer;margin-top:16px">Закрыть</button>' +
      '</div>';

    document.body.appendChild(wrap);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });
    document.getElementById('installClose').addEventListener('click', closeModal);

    const ob = document.getElementById('installOpenBrowser');
    if (ob) ob.addEventListener('click', () => {
      const wa = tg();
      if (wa && typeof wa.openLink === 'function') wa.openLink(APP_URL);
      else window.open(APP_URL, '_blank');
    });
  }

  function openModal() {
    buildModal();
    const m = document.getElementById('installModal');
    if (m) m.style.display = 'flex';
  }
  function closeModal() {
    const m = document.getElementById('installModal');
    if (m) m.style.display = 'none';
  }
  window.openInstallModal = openModal;

  /* ── Всплывающая подсказка (только в Telegram) ── */
  function buildBanner() {
    if (!inTelegram()) return;
    try { if (sessionStorage.getItem('dm_install_banner_hidden')) return; } catch (e) {}
    if (document.getElementById('installBanner')) return;

    const bar = document.createElement('div');
    bar.id = 'installBanner';
    // Полупрозрачный, с размытием, ненавязчивый: приглушённый фон, тонкая рамка,
    // плавное появление. Легко убрать (× с большой зоной нажатия) и авто-скрытие.
    bar.style.cssText =
      'position:fixed;left:12px;right:12px;bottom:12px;z-index:9998;' +
      'background:rgba(27,27,37,.72);backdrop-filter:blur(10px);' +
      '-webkit-backdrop-filter:blur(10px);border:1px solid rgba(124,106,247,.35);' +
      'border-radius:14px;padding:10px 12px;display:flex;align-items:center;gap:9px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:0;transition:opacity .35s ease;' +
      'font-size:12px';
    bar.innerHTML =
      '<div style="font-size:18px;opacity:.9">🔊</div>' +
      '<div style="flex:1;font-size:12px;line-height:1.35;color:rgba(235,235,245,.82)">' +
        'Нет звука в Telegram? Установи приложение на телефон.' +
      '</div>' +
      '<button id="installBannerBtn" style="border:0;border-radius:9px;padding:7px 11px;' +
      'font-size:12.5px;font-weight:600;background:rgba(124,106,247,.85);color:#fff;' +
      'cursor:pointer;white-space:nowrap">Установить</button>' +
      '<button id="installBannerClose" aria-label="Закрыть" style="border:0;background:transparent;' +
      'color:rgba(200,200,215,.7);font-size:20px;cursor:pointer;line-height:1;' +
      'padding:6px 8px;margin:-6px -4px -6px 0">×</button>';

    document.body.appendChild(bar);
    requestAnimationFrame(() => { bar.style.opacity = '1'; });

    const dismiss = (remember) => {
      if (remember) { try { sessionStorage.setItem('dm_install_banner_hidden', '1'); } catch (e) {} }
      bar.style.opacity = '0';
      setTimeout(() => bar.remove(), 350);
    };

    document.getElementById('installBannerBtn').addEventListener('click', openModal);
    document.getElementById('installBannerClose').addEventListener('click', () => dismiss(true));

    // Ненавязчиво: сам исчезает через 9 секунд (пункт меню остаётся всегда)
    setTimeout(() => { if (document.body.contains(bar)) dismiss(false); }, 9000);
  }

  /* ── Пункт меню ── */
  function addMenuItem() {
    if (document.getElementById('installMenuBtn')) return;
    const extra = document.querySelector('.sidebar-extra');
    if (extra) {
      // Главная — используем существующий стиль кнопок меню
      extra.insertAdjacentHTML('afterbegin',
        '<button class="side-action" id="installMenuBtn">' +
          '<span class="sa-ico">📲</span>' +
          '<span class="sa-txt">' +
            '<span class="sa-title">Установить на телефон</span>' +
            '<span class="sa-sub">Для звука и офлайн-доступа</span>' +
          '</span>' +
        '</button>');
      document.getElementById('installMenuBtn').addEventListener('click', openModal);
      return;
    }
    // Страница урока — добавляем кнопку внизу сайдбара
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    const box = document.createElement('div');
    box.style.cssText = 'padding:12px';
    box.innerHTML =
      '<button id="installMenuBtn" style="width:100%;border:1px solid var(--accent,#7c6af7);' +
      'background:rgba(124,106,247,.08);color:var(--text,#eee);border-radius:12px;padding:12px;' +
      'font-size:13px;font-weight:600;cursor:pointer">📲 Установить на телефон</button>';
    sb.appendChild(box);
    document.getElementById('installMenuBtn').addEventListener('click', openModal);
  }

  function start() {
    addMenuItem();
    // Дадим Telegram SDK время подгрузиться, потом решаем про подсказку
    setTimeout(buildBanner, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
