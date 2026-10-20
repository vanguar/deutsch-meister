// Эмуляция мини-аппа Telegram для e2e: SDK «грузится» асинхронно (как настоящий
// telegram-web-app.js), схема — window.__tgScheme (по умолчанию светлая).
(function () {
  var orig = Node.prototype.appendChild;
  Node.prototype.appendChild = function (el) {
    if (el && el.tagName === 'SCRIPT' && /telegram-web-app\.js/.test(el.src || '')) {
      setTimeout(function () {
        window.Telegram = { WebApp: { colorScheme: window.__tgScheme || 'light', platform: 'android', initData: '', initDataUnsafe: {},
          themeParams: { bg_color: '#ffffff', text_color: '#000000', hint_color: '#707579', link_color: '#2481cc', button_color: '#2481cc', button_text_color: '#ffffff', secondary_bg_color: '#f0f0f0' },
          ready: function () {}, expand: function () {}, isVersionAtLeast: function () { return true; }, onEvent: function () {},
          BackButton: { show: function () {}, hide: function () {}, onClick: function () {} } } };
        if (el.onload) el.onload();
      }, 400);
      return el;
    }
    return orig.call(this, el);
  };
})();
