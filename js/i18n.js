/* ═══════════════════════════════════════════════
   js/i18n.js — язык интерфейса (ru — исходный, uk — перевод)

   Грузится ПЕРВЫМ скриптом в <head> каждой страницы.

   Выбор языка — «последняя запись побеждает» (last-write-wins по ts):
     • ?lang=uk&lts=<ms> в URL — так бот открывает приложение;
     • localStorage dm_lang = {"lang":"uk","ts":<ms>} — выбор на устройстве;
     • сервер /api/lang (по подписанному initData Telegram) — выбор в боте.
   Старые кнопки бота несут старый lts и потому не перебивают более
   свежий выбор: именно из-за этого раньше язык «не доезжал» до приложения.
   Если ничего не выбрано — язык Telegram (uk → uk), иначе ru.

   Перевод:
     • словари {русская строка: перевод} регистрируются через I18N.add();
       числа в строке обобщаются: «Урок 3 из 5» ищется как «Урок {n} из {n}»;
     • DOM: MutationObserver переводит текстовые узлы и атрибуты
       title / placeholder / aria-label / alt по мере появления;
     • данные: I18N.data(obj) заменяет строки в объектах (LESSON_DATA,
       JSON книг) до отрисовки;
     • alert / confirm переводятся построчно.
   В русском режиме модуль ничего не меняет на странице.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var LANGS = ['ru', 'uk'];
  var KEY = 'dm_lang';
  var API = 'https://deutsch-meister-puce.vercel.app/api/lang';
  var CYR = /[А-Яа-яЁёІіЇїЄєҐґ]/;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } }

  function norm(lang) {
    lang = String(lang || '').toLowerCase().slice(0, 2);
    return LANGS.indexOf(lang) >= 0 ? lang : '';
  }

  function readLocal() {
    try {
      var v = JSON.parse(safeGet(KEY) || 'null');
      if (v && norm(v.lang)) return { lang: norm(v.lang), ts: Number(v.ts) || 0 };
    } catch (e) { /* битая запись */ }
    return null;
  }

  function writeLocal(lang, ts) {
    safeSet(KEY, JSON.stringify({ lang: lang, ts: ts }));
  }

  /* Telegram кладёт initData в hash при первом открытии мини-аппа;
     SDK потом копирует его в sessionStorage — смотрим оба места. */
  function tgInitData() {
    try {
      var wa = window.Telegram && window.Telegram.WebApp;
      if (wa && wa.initData) return wa.initData;
    } catch (e) { /* нет SDK */ }
    try {
      var h = new URLSearchParams(location.hash.slice(1)).get('tgWebAppData');
      if (h) return h;
    } catch (e) { /* старый браузер */ }
    try {
      var s = JSON.parse(sessionStorage.getItem('__telegram__initParams') || 'null');
      if (s && s.tgWebAppData) return s.tgWebAppData;
    } catch (e) { /* нет sessionStorage */ }
    return '';
  }

  function tgLanguageCode() {
    try {
      var user = JSON.parse(new URLSearchParams(tgInitData()).get('user') || 'null');
      return (user && user.language_code) || '';
    } catch (e) { return ''; }
  }

  /* ── выбор языка при загрузке ── */
  function resolve() {
    var url = new URLSearchParams(location.search);
    var fromUrl = norm(url.get('lang'));
    var urlTs = Number(url.get('lts')) || 0;
    var local = readLocal();

    if (fromUrl && (!local || urlTs >= local.ts)) {
      if (!local || local.lang !== fromUrl || local.ts !== urlTs) writeLocal(fromUrl, urlTs);
      return fromUrl;
    }
    if (local) return local.lang;
    var tg = norm(tgLanguageCode());
    return tg === 'uk' ? 'uk' : 'ru';
  }

  var lang = resolve();
  var dict = Object.create(null);
  var values = Object.create(null);

  /* ── словари ── */
  var NUM = /\d+(?:[.,]\d+)?/g;

  /* Шаблоны с {s} — подставляется любой текст (имя, название, слово
     «слов/слова»), и он сам тоже переводится: «Собрано: {n} {s}». */
  var patterns = [];
  var PH = /\{[ns]\}/g;

  function addPattern(k, v) {
    var src = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\{n\\\}/g, '(\\d+(?:[.,]\\d+)?)')
      .replace(/\\\{s\\\}/g, '(.+?)');
    patterns.push({ re: new RegExp('^' + src + '$'), val: v, weight: k.replace(PH, '').length });
    // сначала самые конкретные (больше постоянного текста)
    patterns.sort(function (a, b) { return b.weight - a.weight; });
  }

  /* Замены без кириллицы — целые текстовые узлы вроде флага 🇷🇺 на кнопке
     перевода в читалке. */
  var swaps = Object.create(null);

  function add(map) {
    for (var k in map) {
      if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
      if (!CYR.test(k) && k.indexOf('{') < 0) { swaps[k] = map[k]; continue; }
      dict[k] = map[k];
      values[map[k]] = 1;
      if (k.indexOf('{s}') >= 0) addPattern(k, map[k]);
    }
  }

  function fromPatterns(s) {
    for (var i = 0; i < patterns.length; i++) {
      var m = s.match(patterns[i].re);
      if (!m) continue;
      var j = 1;
      return patterns[i].val.replace(PH, function (ph) {
        var part = m[j++] || '';
        return ph === '{s}' ? t(part) : part;
      });
    }
    return undefined;
  }

  function lookup(s) {
    var hit = dict[s];
    if (hit !== undefined) return hit;
    // отступы многострочных шаблонов: «текст\n          текст» → «текст текст»
    if (/\n[ \t]/.test(s)) {
      s = s.replace(/\n[ \t]+/g, ' ');
      hit = dict[s];
      if (hit !== undefined) return hit;
    }
    if (/\d/.test(s)) {
      var nums = s.match(NUM);
      var tpl = dict[s.replace(NUM, '{n}')];
      if (tpl !== undefined) {
        var i = 0;
        return tpl.replace(/\{n\}/g, function () { return nums[i++] || ''; });
      }
    }
    return patterns.length ? fromPatterns(s) : undefined;
  }

  /* Перевод строки целиком; ведущие/хвостовые пробелы сохраняются.
     Многострочный текст без точного совпадения переводится построчно. */
  function t(s) {
    if (lang === 'ru' || typeof s !== 'string' || !CYR.test(s)) return s;
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var core = m[2];
    var hit = lookup(core);
    if (hit !== undefined) return m[1] + hit + m[3];
    if (core.indexOf('\n') >= 0) {
      return s.split('\n').map(function (line) { return t(line); }).join('\n');
    }
    return s;
  }

  /* Глубокая замена строк в данных (на месте). Ключи не трогаем. */
  function data(obj) {
    if (lang === 'ru' || !obj || typeof obj !== 'object') return obj;
    var seen = [];
    (function walk(o) {
      if (!o || typeof o !== 'object' || seen.indexOf(o) >= 0) return;
      seen.push(o);
      for (var k in o) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        var v = o[k];
        if (typeof v === 'string') { if (CYR.test(v)) o[k] = t(v); }
        else if (v && typeof v === 'object') walk(v);
      }
    })(obj);
    return obj;
  }

  /* ── DOM ── */
  var ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  var done = new WeakMap();   // узел → значение, которое мы сами поставили

  function textNode(n) {
    var v = n.nodeValue;
    if (!v || done.get(n) === v) return;
    if (!CYR.test(v)) {
      var key = v.trim();
      if (key && swaps[key] !== undefined) { done.set(n, v); n.nodeValue = v.replace(key, swaps[key]); }
      return;
    }
    var p = n.parentNode;
    if (p && SKIP[p.nodeName]) return;
    var tr = t(v);
    done.set(n, tr);
    if (tr !== v) n.nodeValue = tr;
  }

  function attrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      var v = el.getAttribute && el.getAttribute(a);
      if (!v || !CYR.test(v)) continue;
      var tr = t(v);
      if (tr !== v) el.setAttribute(a, tr);
    }
  }

  function tree(root) {
    if (!root) return;
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (SKIP[root.nodeName]) return;
      attrs(root);
    }
    var w = document.createTreeWalker(root, 5 /* ELEMENT | TEXT */, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) textNode(n);
      else if (!SKIP[n.nodeName]) attrs(n);
    }
  }

  function startDom() {
    var mo = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var r = list[i];
        if (r.type === 'childList') {
          for (var j = 0; j < r.addedNodes.length; j++) tree(r.addedNodes[j]);
        } else if (r.type === 'characterData') {
          textNode(r.target);
        } else if (r.type === 'attributes') {
          var v = r.target.getAttribute(r.attributeName);
          if (v && CYR.test(v)) {
            var tr = t(v);
            if (tr !== v) r.target.setAttribute(r.attributeName, tr);
          }
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
    tree(document.documentElement);
  }

  function wrapDialogs() {
    ['alert', 'confirm', 'prompt'].forEach(function (name) {
      var orig = window[name];
      if (typeof orig !== 'function') return;
      window[name] = function (msg) {
        var args = Array.prototype.slice.call(arguments);
        args[0] = t(String(msg == null ? '' : msg));
        return orig.apply(window, args);
      };
    });
  }

  /* ── смена языка ── */
  function postServer(body) {
    var id = tgInitData();
    if (!id) return Promise.resolve(null);
    body.initData = id;
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  function cleanUrl() {
    // ?lang/lts уже учтены — убираем, чтобы перезагрузка не вернула старый выбор
    try {
      var u = new URL(location.href);
      if (!u.searchParams.has('lang') && !u.searchParams.has('lts')) return;
      u.searchParams.delete('lang');
      u.searchParams.delete('lts');
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    } catch (e) { /* без history API */ }
  }

  function setLang(next) {
    next = norm(next);
    if (!next) return Promise.resolve(false);
    var ts = Date.now();
    writeLocal(next, ts);
    var sync = postServer({ lang: next, ts: ts });
    // ждём сервер не дольше 1.5 с: перезагрузка не должна зависеть от сети
    return Promise.race([sync, new Promise(function (r) { setTimeout(r, 1500); })])
      .then(function () { cleanUrl(); location.reload(); return true; });
  }

  /* Выбор, сделанный в боте, мог быть свежее локального — сверяемся. */
  function syncFromServer() {
    postServer({}).then(function (res) {
      if (!res || !res.ok) return;          // сеть / перезагрузка SW — сверимся в следующий раз
      // Сверка удалась — до конца сессии сервер больше не спрашиваем.
      // Флаг ставим только ПОСЛЕ ответа: при первом запуске service worker
      // перезагружает страницу и обрывает запрос, и ранний флаг навсегда
      // отрезал бы выбор, сделанный в боте.
      try { sessionStorage.setItem('dm_lang_synced', '1'); } catch (e) { /* нет storage */ }
      if (!norm(res.lang)) return;
      var srv = { lang: norm(res.lang), ts: Number(res.ts) || 0 };
      var local = readLocal();
      if (local && local.ts >= srv.ts) {
        // локальный выбор свежее (например, сменили язык офлайн) — отдаём серверу
        if (local.ts > srv.ts) postServer({ lang: local.lang, ts: local.ts });
        return;
      }
      writeLocal(srv.lang, srv.ts);
      if (srv.lang !== lang) { cleanUrl(); location.reload(); }
    });
  }

  /* Книги: переведённые копии JSON лежат в i18n/<lang>/books/ с той же
     структурой. Нет копии (сеть, новая книга) — берём исходный файл. */
  function wrapFetch() {
    var orig = window.fetch;
    if (typeof orig !== 'function') return;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var m = url.match(/^(.*?)data\/books\/(.+\.json)(\?.*)?$/);
      if (!m) return orig.apply(this, arguments);
      var alt = m[1] + 'i18n/' + lang + '/books/' + m[2] + (m[3] || '');
      var self = this, args = arguments;
      return orig.call(self, alt, init).then(function (res) {
        return res && res.ok ? res : orig.apply(self, args);
      }, function () { return orig.apply(self, args); });
    };
  }

  /* Кнопки-переключатели [data-lang-toggle] показывают текущий язык */
  function paintToggles() {
    var els = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < els.length; i++) els[i].textContent = lang === 'uk' ? 'UA' : 'RU';
  }

  /* ── публичный API ── */
  window.I18N = {
    lang: lang,
    langs: LANGS.slice(),
    add: add,
    t: t,
    data: data,
    setLang: setLang,
    toggle: function () { return setLang(lang === 'uk' ? 'ru' : 'uk'); },
    has: function (s) { return lookup(s) !== undefined; },
    isValue: function (s) { return values[s] === 1; },
    _resolve: resolve
  };

  document.documentElement.setAttribute('lang', lang);

  if (lang !== 'ru') {
    // Словари грузим синхронно (document.write) — до данных урока и до
    // DOMContentLoaded, чтобы страница сразу рисовалась на нужном языке.
    var me = document.currentScript;
    var src = me ? me.getAttribute('src') : 'js/i18n.js';
    var base = src.replace(/js\/i18n\.js.*$/, '');
    var ver = (src.match(/\?v=(\d+)/) || [])[1];
    var q = ver ? '?v=' + ver : '';
    var files = ['i18n/' + lang + '/ui.js'];
    var page = location.pathname.match(/lessons\/(a1|a2|b1|b2)\/lesson-(\d+)\//);
    if (page) {
      files.push('i18n/' + lang + '/lexicon.js');
      files.push('i18n/' + lang + '/lessons/' + page[1] + '-' + page[2] + '.js');
    }
    for (var i = 0; i < files.length; i++) {
      document.write('<script src="' + base + files[i] + q + '"><\/script>');
    }
    wrapDialogs();
    wrapFetch();
    startDom();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintToggles);
  else paintToggles();

  cleanUrl();
  // С сервером сверяемся раз за сессию, а не на каждом уроке
  var synced = false;
  try { synced = sessionStorage.getItem('dm_lang_synced') === '1'; } catch (e) { /* нет storage */ }
  if (!synced && tgInitData()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncFromServer);
    else syncFromServer();
  }
})();
