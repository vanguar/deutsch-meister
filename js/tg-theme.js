/* ═══════════════════════════════════════════════
   js/tg-theme.js — палитра темы Telegram на всех страницах

   Грузится в <head> сразу после js/i18n.js на каждой странице
   (главная, 68 уроков, книги, новости, диалоги). Вне Telegram не
   делает ничего: остаётся общая палитра base.css.

   В мини-аппе раскладывает Telegram.WebApp.themeParams по общим
   токенам base.css (--bg, --surface*, --text*, --accent2…) — так
   у главной, уроков, книг, новостей и диалогов один и тот же цвет,
   и он совпадает с темой Telegram пользователя (iOS, Android,
   Desktop — у каждого свой). Работает, только если выбранная в
   приложении тема (светлая/тёмная) совпадает со схемой Telegram:
   выбрал другую — своя палитра.

   Цвета Telegram бывают бледными (белое на голубой кнопке ≈ 3:1),
   поэтому каждый текстовый цвет подтягивается до контраста 4.6:1
   на фонах, где он стоит.

   SDK Telegram грузится асинхронно (js/telegram.js), поэтому
   готовая палитра кэшируется в sessionStorage и ставится сразу при
   загрузке следующей страницы — без вспышки чужих цветов.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var CACHE = 'dm_tg_palette';
  var root = document.documentElement;
  // текстовые токены base.css (и главной), которые подтягиваются под фоны Telegram
  var INKS = ['--accent', '--accent3', '--green', '--blue', '--correct', '--wrong',
    '--art-der', '--art-die', '--art-das', '--h-streak'];
  var applied = [];

  function hexRgb(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(h || '').trim());
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function cssRgb(v) {
    v = String(v || '').trim();
    if (v.charAt(0) === '#') return hexRgb(v);
    var m = v.match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : null;
  }
  function rgbHex(c) {
    return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('');
  }
  function mix(a, b, t) { return a.map(function (v, i) { return v + (b[i] - v) * t; }); }
  function lum(c) {
    function f(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  }
  function contrast(a, b) {
    var x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // сдвигаем цвет к toward, пока на всех фонах не наберётся контраст
  function legible(c, backs, toward, min) {
    for (var i = 0; i < 30 && backs.some(function (b) { return contrast(c, b) < (min || 4.6); }); i++) c = mix(c, toward, 0.1);
    return c;
  }

  function tg() { return window.Telegram && window.Telegram.WebApp; }
  function theme() { return root.getAttribute('data-theme') || safeTheme(); }
  function safeTheme() { try { return localStorage.getItem('dm_theme') || 'dark'; } catch (e) { return 'dark'; } }

  function clear() {
    applied.forEach(function (k) { root.style.removeProperty(k); });
    applied = [];
    root.classList.remove('tg-theme');
  }

  function set(vals) {
    clear();
    Object.keys(vals).forEach(function (k) { root.style.setProperty(k, vals[k]); applied.push(k); });
    root.classList.add('tg-theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && vals['--bg']) meta.setAttribute('content', vals['--bg']);
  }

  /* themeParams → токены base.css */
  function compute(p) {
    var bg = hexRgb(p.bg_color), text = hexRgb(p.text_color);
    if (!bg || !text) return null;
    var dark = lum(bg) < 0.5;
    var black = [0, 0, 0], white = [255, 255, 255];
    // карточка отделяется от фона: в тёмной теме светлее, в светлой темнее
    // (у Android-тёмной secondary_bg темнее bg — тогда смешиваем)
    var card = hexRgb(p.section_bg_color);
    if (!card || card.join() === bg.join()) card = hexRgb(p.secondary_bg_color);
    if (!card || (dark ? lum(card) <= lum(bg) + 0.004 : lum(card) >= lum(bg) - 0.02)) card = mix(bg, text, dark ? 0.08 : 0.05);
    var surface = hexRgb(p.bottom_bar_bg_color) || mix(bg, text, dark ? 0.045 : 0.025);
    var backs = [card, bg, surface];
    var hint = legible(hexRgb(p.hint_color) || mix(text, bg, 0.45), backs, text);
    var accent = legible(hexRgb(p.accent_text_color) || hexRgb(p.link_color) || hexRgb(p.button_color) || text, backs, text);
    var btnText = hexRgb(p.button_text_color) || white;
    var btn = legible(hexRgb(p.button_color) || accent, [btnText], lum(btnText) > 0.5 ? black : white);
    var vals = {
      '--bg': bg, '--surface': surface, '--surface2': card,
      '--surface3': mix(card, text, 0.09),
      '--border': hexRgb(p.section_separator_color) || mix(card, text, 0.13),
      '--border-light': mix(card, text, 0.2),
      '--text': mix(text, bg, 0.06), '--text-strong': text,
      '--text-muted': hint, '--text-dim': hint,
      '--accent2': btn, '--accent2-text': accent, '--text-on-btn': btnText
    };
    // свои акценты (золото, «верно/ошибка», der/die/das…) — под чужие фоны
    var probe = getComputedStyle(root);
    INKS.forEach(function (k) {
      var c = cssRgb(probe.getPropertyValue(k));
      if (c) vals[k] = legible(c, backs, text);
    });
    var out = {};
    Object.keys(vals).forEach(function (k) { out[k] = rgbHex(vals[k]); });
    out['--tint'] = 'rgba(' + text.join(',') + ',.04)';
    out['--tint-border'] = 'rgba(' + text.join(',') + ',.07)';
    return out;
  }

  function sync() {
    var TG = tg();
    if (!TG || !TG.themeParams) return;
    var scheme = TG.colorScheme === 'light' ? 'light' : 'dark';
    if (scheme !== theme()) { clear(); return; }
    clear();                      // свои значения токенов — до пересчёта
    var vals = compute(TG.themeParams);
    if (!vals) return;
    set(vals);
    try { sessionStorage.setItem(CACHE, JSON.stringify({ scheme: scheme, vals: vals })); } catch (e) {}
  }

  // 1) сразу — палитра с прошлой страницы этой сессии мини-аппа
  try {
    var cached = JSON.parse(sessionStorage.getItem(CACHE) || 'null');
    if (cached && cached.vals && cached.scheme === theme()) set(cached.vals);
  } catch (e) {}

  // 2) когда SDK готов — по живым themeParams, и дальше при смене темы
  var hooked = false;
  function hook() {
    var TG = tg();
    if (!TG || hooked) return;
    hooked = true;
    try { TG.onEvent('themeChanged', sync); } catch (e) {}
    sync();
  }
  document.addEventListener('dm:tg-ready', hook);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();

  // 3) выбрал в приложении другую тему — своя палитра (или снова Telegram)
  new MutationObserver(function () {
    if (!hooked) {
      // SDK ещё не готов: кэш годится, только пока схема совпадает
      try {
        var c = JSON.parse(sessionStorage.getItem(CACHE) || 'null');
        if (c && c.scheme === theme()) set(c.vals); else clear();
      } catch (e) { clear(); }
      return;
    }
    sync();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  window.DMTgTheme = { sync: sync };
})();
