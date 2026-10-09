/* ═══════════════════════════════════════════════
   js/ar-trial.js — арабская пробная версия

   Подключается из js/i18n.js только при lang = ar.
   Переведены интерфейс (меню) и урок A1-01, поэтому:
     • в уроке A1-01 вверху и внизу — плашка «пробный урок» с просьбой
       об обратной связи и ссылкой на Telegram автора;
     • на главной — такая же плашка, остальные уроки помечены «قريبًا»
       и не открываются (тост вместо перехода), книги и новости — тоже;
     • если страницу без перевода всё же открыли (закладка, старая
       ссылка), сверху объясняем, что её ещё нет на арабском.
   Интерфейс зеркальный: js/i18n.js ставит <html dir="rtl">, физические
   left/right правит css/rtl.css. Направление текста — по месту (fixDir): блок с арабским
   текстом получает dir="rtl", немецкие вставки в нём (<strong>du</strong>,
   <em>Wie heißt du?</em>) — dir="ltr", то есть изолируются, и тире,
   кавычки и скобки на стыке языков встают на свои места. Остальное —
   unicode-bidi: plaintext (направление по первой букве абзаца).
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var CONTACT = 'ObiVan1978';
  var TRIAL_LESSON = /lessons\/a1\/lesson-01\//;
  var ANY_LESSON = /lessons\/(a1|a2|b1|b2)\/lesson-(\d+)\//;

  var path = location.pathname;
  var isLesson = ANY_LESSON.test(path);
  var isTrialLesson = TRIAL_LESSON.test(path);
  var isHome = !isLesson && !/(books|news)\.html$/.test(path);

  var me = document.currentScript;
  var base = me ? me.getAttribute('src').replace(/js\/ar-trial\.js.*$/, '') : '';

  /* ── стили ── */
  var css = [
    'html[lang="ar"] body{font-family:"Noto Sans Arabic","Segoe UI",Tahoma,system-ui,sans-serif}',
    'html[lang="ar"] :where(p,li,td,th,h1,h2,h3,h4,label,button,a,div,span){unicode-bidi:plaintext}',
    // явный dir сильнее эвристики plaintext
    'html[lang="ar"] [dir]{unicode-bidi:isolate}',
    'html[lang="ar"] [dir="rtl"][data-ar-dir]{text-align:right}',
    '.ar-trial{direction:rtl;text-align:right;unicode-bidi:isolate;margin:14px 0;padding:16px 18px;',
    'border:1px solid var(--accent2,#7c6af7);border-radius:14px;',
    'background:linear-gradient(135deg,rgba(124,106,247,.14),rgba(232,197,71,.08));color:var(--text,#e8e6f0);',
    'font-size:15px;line-height:1.7}',
    '.ar-trial b{color:var(--text-strong,#fff)}',
    '.ar-trial-title{font-weight:800;font-size:16px;margin-bottom:4px}',
    '.ar-trial p{margin:4px 0}',
    '.ar-trial-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
    '.ar-trial-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;',
    'border:0;cursor:pointer;font:inherit;font-weight:700;text-decoration:none;',
    'background:var(--accent2,#7c6af7);color:var(--text-on-btn,#fff)}',
    '.ar-trial-btn.ghost{background:var(--surface3,#2a2740);color:var(--text,#e8e6f0);border:1px solid var(--border,#2e2b4a)}',
    '.ar-trial-tg{direction:ltr;unicode-bidi:isolate;font-weight:700}',
    '.ar-soon{opacity:.45;filter:grayscale(.6);cursor:not-allowed}',
    '.lesson-card.ar-soon:hover{transform:none}',
    '.lesson-card.ar-soon::after{display:none}',
    '.ar-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,420px);',
    'direction:rtl;text-align:center;padding:12px 16px;border-radius:12px;font-size:15px;line-height:1.6;',
    'background:var(--surface2,#232136);color:var(--text,#e8e6f0);border:1px solid var(--border-light,#3d3960);',
    'box-shadow:0 8px 30px rgba(0,0,0,.35);transition:opacity .25s}'
  ].join('');
  var ver = me ? (me.getAttribute('src').match(/\?v=\d+/) || [''])[0] : '';
  document.write(
    '<link rel="stylesheet" href="' + base + 'css/rtl.css' + ver + '">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;800&display=swap">' +
    '<style id="ar-trial-css">' + css + '</style>'
  );

  /* ── обратная связь ── */
  function contact() {
    if (typeof window.openContactAuthor === 'function') { window.openContactAuthor(); return; }
    var url = 'https://t.me/' + CONTACT;
    var TG = window.Telegram && window.Telegram.WebApp;
    if (TG && typeof TG.openTelegramLink === 'function') TG.openTelegramLink(url);
    else window.open(url, '_blank', 'noopener');
  }

  function el(html) {
    var box = document.createElement('div');
    box.className = 'ar-trial';
    box.setAttribute('dir', 'rtl');
    box.setAttribute('lang', 'ar');
    box.innerHTML = html;
    var btns = box.querySelectorAll('[data-ar-contact]');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', contact);
    return box;
  }

  var TG_LINK = '<span class="ar-trial-tg">@' + CONTACT + '</span>';
  var FEEDBACK_BTN = '<button type="button" class="ar-trial-btn" data-ar-contact>💬 أرسل رأيك في Telegram</button>';

  var LESSON_TOP =
    '<div class="ar-trial-title">🧪 درس تجريبي بالعربية</div>' +
    '<p>هذا <b>درس تجريبي</b> من النسخة العربية لدورة German Morning. ' +
    'نعمل الآن على الترجمة، ومع الوقت ستظهر <b>جميع الدروس</b> و<b>النسخة الكاملة</b> من الدورة بالعربية.</p>' +
    '<p>رأيك مهم جدًا لنا: ما الذي أعجبك؟ وما الذي يحتاج إلى تحسين؟ اكتب لنا في Telegram: ' + TG_LINK + '</p>' +
    '<div class="ar-trial-actions">' + FEEDBACK_BTN + '</div>';

  var LESSON_BOTTOM =
    '<div class="ar-trial-title">🙏 شكرًا لأنك جرّبت الدرس الأول!</div>' +
    '<p>هذه <b>نسخة تجريبية</b>: باقي الدروس قيد الترجمة، وستظهر تدريجيًا حتى تكتمل الدورة بالعربية.</p>' +
    '<p>نرجو أن تشاركنا انطباعك عن الدرس والترجمة — ملاحظاتك تساعدنا على إعداد النسخة الكاملة أسرع وأفضل. ' +
    'راسلنا في Telegram: ' + TG_LINK + '</p>' +
    '<div class="ar-trial-actions">' + FEEDBACK_BTN + '</div>';

  var HOME =
    '<div class="ar-trial-title">🧪 النسخة العربية التجريبية</div>' +
    '<p>المتاح الآن بالعربية: <b>القائمة</b> و<b>الدرس الأول (<bdi dir="ltr">A1 · 01</bdi>)</b>. ' +
    'باقي الدروس قيد الترجمة، وستظهر مع الوقت جميع الدروس والنسخة الكاملة.</p>' +
    '<p>جرّب الدرس الأول وأخبرنا برأيك في Telegram: ' + TG_LINK + '</p>' +
    '<div class="ar-trial-actions">' +
      '<a class="ar-trial-btn" href="' + base + 'lessons/a1/lesson-01/index.html">🚀 ابدأ الدرس الأول</a>' +
      FEEDBACK_BTN.replace('ar-trial-btn', 'ar-trial-btn ghost') +
    '</div>';

  var NOT_YET =
    '<div class="ar-trial-title">🚧 هذه الصفحة غير متوفرة بالعربية بعد</div>' +
    '<p>النسخة العربية تجريبية حاليًا: المتاح هو القائمة والدرس الأول فقط. ' +
    'ستظهر بقية الدروس والنسخة الكاملة مع الوقت.</p>' +
    '<p>لديك اقتراح أو ملاحظة؟ اكتب لنا في Telegram: ' + TG_LINK + '</p>' +
    '<div class="ar-trial-actions">' +
      '<a class="ar-trial-btn" href="' + base + 'lessons/a1/lesson-01/index.html">🚀 الدرس الأول</a>' +
      '<a class="ar-trial-btn ghost" href="' + base + 'index.html">🏠 الرئيسية</a>' +
      FEEDBACK_BTN.replace('ar-trial-btn', 'ar-trial-btn ghost') +
    '</div>';

  var SOON_TOAST = '🔒 سيصبح هذا متاحًا بالعربية قريبًا. جرّب الآن الدرس الأول!';
  var SOON_LABEL = '🔒 قريبًا';

  /* ── тост ── */
  var toastTimer;
  function toast(msg) {
    var t = document.querySelector('.ar-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'ar-toast';
      t.setAttribute('dir', 'rtl');
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.style.opacity = '0'; }, 2600);
  }

  /* ── что ещё не переведено ── */
  function lockedHref(href) {
    if (!href) return false;
    if (ANY_LESSON.test(href)) return !TRIAL_LESSON.test(href);
    return /(^|\/)(books|news)\.html(\?|#|$)/.test(href);
  }

  // Перехват на фазе захвата: срабатывает раньше обработчиков страницы
  // и закрывает все пути — карточки, меню, «Продолжить», «Следующий урок».
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || !lockedHref(a.getAttribute('href'))) return;
    e.preventDefault();
    e.stopPropagation();
    toast(SOON_TOAST);
  }, true);

  function markLocked() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!lockedHref(a.getAttribute('href'))) continue;
      if (!a.classList.contains('ar-soon')) {
        a.classList.add('ar-soon');
        a.setAttribute('aria-disabled', 'true');
      }
      // progress.js перерисовывает статусы после нас — сверяем каждый раз
      var st = a.querySelector('.lc-status');
      if (st && st.textContent !== SOON_LABEL) { st.textContent = SOON_LABEL; st.className = 'lc-status'; }
    }
    // «Продолжить» на главной ведёт к следующему уроку — в пробной версии к первому
    var cont = document.getElementById('continueBtn');
    if (cont && lockedHref(cont.getAttribute('href'))) {
      cont.classList.remove('ar-soon');
      cont.removeAttribute('aria-disabled');
      cont.setAttribute('href', base + 'lessons/a1/lesson-01/index.html');
      cont.textContent = '🚀 الدرس الأول';
    }
  }

  // Книги и новости открываются функциями из support.js
  function lockFunctions() {
    ['openBooksModal', 'openNewsPage'].forEach(function (name) {
      if (typeof window[name] !== 'function' || window[name].__arLocked) return;
      var f = function () { toast(SOON_TOAST); };
      f.__arLocked = true;
      window[name] = f;
    });
    var acts = document.querySelectorAll('.side-action.news, .side-action[onclick*="openBooksModal"]');
    for (var i = 0; i < acts.length; i++) acts[i].classList.add('ar-soon');
  }

  /* ── направление текста ── */
  var AR = /[؀-ۿ]/;
  var LATIN = /[A-Za-zÄäÖöÜüß]/;
  var INLINE = { STRONG: 1, EM: 1, B: 1, I: 1, SPAN: 1, CODE: 1, A: 1, SMALL: 1, MARK: 1 };
  var FLOW = { block: 1, 'list-item': 1, 'table-cell': 1, 'inline-block': 1 };

  // ближайший блок, внутри которого нет flex/grid — dir на нём не
  // переворачивает раскладку
  function textBlock(node) {
    var el = node.parentElement;
    while (el && el !== document.body) {
      var d = getComputedStyle(el).display;
      if (/flex|grid/.test(d)) return null;
      if (FLOW[d]) return el;
      el = el.parentElement;
    }
    return null;
  }

  function hasLayoutKids(el) {
    var kids = el.querySelectorAll('*');
    for (var i = 0; i < kids.length; i++) {
      if (/flex|grid|table/.test(getComputedStyle(kids[i]).display)) return true;
    }
    return false;
  }

  function fixDir(root) {
    var w = document.createTreeWalker(root || document.body, 4 /* TEXT */, null);
    var blocks = [], n;
    while ((n = w.nextNode())) {
      if (!AR.test(n.nodeValue)) continue;
      var b = textBlock(n);
      if (b && blocks.indexOf(b) < 0) blocks.push(b);
    }
    blocks.forEach(function (b) {
      if (b.closest('.ar-trial') || b.hasAttribute('data-ar-dir') || hasLayoutKids(b)) return;
      b.setAttribute('dir', 'rtl');
      b.setAttribute('data-ar-dir', '');
      // немецкие вставки — отдельным LTR-островом
      var inl = b.querySelectorAll('*');
      for (var i = 0; i < inl.length; i++) {
        var e = inl[i];
        if (!INLINE[e.nodeName] || e.hasAttribute('dir')) continue;
        var t = e.textContent;
        if (LATIN.test(t) && !AR.test(t)) e.setAttribute('dir', 'ltr');
      }
    });
  }

  var dirTimer;
  function scheduleDir() {
    clearTimeout(dirTimer);
    dirTimer = setTimeout(function () { fixDir(); }, 60);
  }

  function insertAfter(node, ref) { ref.parentNode.insertBefore(node, ref.nextSibling); }

  function banners() {
    if (document.querySelector('.ar-trial')) return;
    if (isTrialLesson) {
      // внутри колонки контента — та же ширина, что у разделов урока
      var header = document.querySelector('.lesson-header');
      var content = document.querySelector('.lesson-content');
      if (content) content.insertBefore(el(LESSON_TOP), content.firstChild);
      else if (header) insertAfter(el(LESSON_TOP), header);
      if (content) content.appendChild(el(LESSON_BOTTOM));
    } else if (isHome) {
      var hero = document.querySelector('.hero');
      if (hero) insertAfter(el(HOME), hero);
    } else {
      var host = document.querySelector('.lesson-header') || document.querySelector('main') || document.body.firstElementChild;
      if (host && host.parentNode) {
        var box = el(NOT_YET);
        box.style.margin = '14px';
        if (host.classList && host.classList.contains('lesson-header')) insertAfter(box, host);
        else host.parentNode.insertBefore(box, host);
      }
    }
  }

  function init() {
    banners();
    markLocked();
    lockFunctions();
    fixDir();
    // меню, карточки и упражнения дорисовываются скриптами
    new MutationObserver(function () { markLocked(); lockFunctions(); scheduleDir(); })
      .observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
