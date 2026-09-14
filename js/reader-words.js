/* ═══════════════════════════════════════════════
   reader-words.js — сборник слов книги
   Deutsch Meister Course

   Тап по слову в ридере = «не знаю»: лемма попадает в localStorage
   под ключом dm_book_words:<bookId>. Ключ записи — ЛЕММА, поэтому
   ging и gingen дают одну запись gehen со списком встреченных форм.

   Запись:
     { de, ru, note, pos, art, pl, forms, decl, old,
       seen: ['ging','gingen'], n: 3,
       ch: 'ch-01', p: 4, ts: 1700000000000, status: 'new' }

   ch/p — где слово встретилось ПЕРВЫЙ раз (потом не переписываются),
   ts — время последнего тапа, n — сколько раз спросили перевод.
   status: 'new' — слово в работе (подсвечивается), 'known' — выучено
   (подсветка снимается).

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderWords = (() => {

  const KEY = 'dm_book_words:';

  let bookId = null;
  let words  = {};   // лемма → запись

  /* ── Хранилище ── */

  function load(id) {
    bookId = id;
    words  = {};
    if (!id) return words;

    let raw = null;
    try {
      raw = localStorage.getItem(KEY + id);
    } catch (e) {
      console.warn('[ReaderWords] localStorage недоступен', e);
      return words;
    }
    if (!raw) return words;

    try {
      const parsed = JSON.parse(raw);
      // Битый или чужой формат не должен ронять ридер: начинаем с пустого
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        Object.keys(parsed).forEach(lemma => {
          const rec = parsed[lemma];
          if (rec && typeof rec === 'object') words[lemma] = rec;
        });
      } else {
        console.warn('[ReaderWords] неожиданный формат dm_book_words → пустой сборник');
      }
    } catch (e) {
      console.warn('[ReaderWords] повреждённый JSON в dm_book_words → пустой сборник', e);
    }
    return words;
  }

  function save() {
    if (!bookId) return;
    try {
      localStorage.setItem(KEY + bookId, JSON.stringify(words));
    } catch (e) {
      console.warn('[ReaderWords] не удалось сохранить сборник', e);
    }
  }

  /* ── Чтение ── */

  function all()   { return words; }
  function count() { return Object.keys(words).length; }
  function get(lemma) { return words[lemma] || null; }

  // Подсвечиваем всё, что собрано и ещё не помечено выученным
  function isMarked(lemma) {
    const rec = words[lemma];
    return !!rec && rec.status !== 'known';
  }

  /* ── Запись ── */

  // info — результат ReaderTip.lookup: { lemma, oldForm, entry }.
  // Без словарной записи не сохраняем: «нет в словаре» в сборник не идёт.
  // ctx — { form, ch, p }.
  function add(info, ctx) {
    if (!bookId || !info || !info.entry || !info.lemma) return null;

    const e     = info.entry;
    const lemma = info.lemma;
    const form  = (ctx && ctx.form) || lemma;
    const now   = Date.now();

    let rec = words[lemma];
    if (!rec) {
      rec = {
        de:     lemma,
        ru:     e.ru  || '',
        pos:    e.pos || '',
        seen:   [],
        n:      0,
        ch:     (ctx && ctx.ch) || '',   // где встретилось впервые
        p:      (ctx && typeof ctx.p === 'number') ? ctx.p : -1,
        ts:     now,
        status: 'new'
      };
      // Грамматику кладём только ту, что реально есть в словаре
      if (e.art)   rec.art   = e.art;
      if ('pl' in e) rec.pl  = e.pl;         // pl: null — «мн. ч. нет», это факт
      if (e.forms) rec.forms = e.forms;
      if (e.decl)  rec.decl  = e.decl;
      if (e.old)   rec.old   = e.old;
      // note — разбор употребления. На карточке не показывается, но нужен
      // тултипу в словаре книги, где глава (а с ней и глоссарий) может
      // быть не загружена.
      if (e.note)  rec.note  = e.note;
      words[lemma] = rec;
    }

    // Повторный тап по другой форме: дубля нет, растёт n и список форм
    rec.n  = (Number(rec.n) || 0) + 1;
    rec.ts = now;
    if (!Array.isArray(rec.seen)) rec.seen = [];
    const known = rec.seen.some(f => String(f).toLowerCase() === form.toLowerCase());
    if (!known) rec.seen.push(form);

    save();
    return rec;
  }

  function setStatus(lemma, status) {
    const rec = words[lemma];
    if (!rec) return null;
    rec.status = status;
    rec.ts = Date.now();
    save();
    return rec;
  }

  function remove(lemma) {
    if (!words[lemma]) return false;
    delete words[lemma];
    save();
    return true;
  }

  return { load, save, all, get, count, isMarked, add, setStatus, remove };
})();
