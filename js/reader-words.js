/* ═══════════════════════════════════════════════
   reader-words.js — сборник слов книги
   Deutsch Meister Course

   Тап по слову в ридере = «не знаю»: лемма попадает в localStorage
   под ключом dm_book_words:<bookId>. Ключ записи — ЛЕММА, поэтому
   ging и gingen дают одну запись gehen со списком встреченных форм.

   Запись:
     { de, ru, note, pos, art, pl, forms, decl, old, fn: false,
       seen: ['ging','gingen'], n: 3,
       ch: 'ch-01', p: 4, ts: 1700000000000, status: 'new' }

   ch/p — где слово встретилось ПЕРВЫЙ раз (потом не переписываются),
   ts — время последнего тапа, n — сколько раз спросили перевод.
   status: 'new' — слово в работе (подсвечивается), 'known' — выучено
   (подсветка снимается).

   fn — служебное слово: либо служебная часть речи, либо лемма из
   FUNCTION_LEMMAS (частотные наречия-связки; pos у них честный и не
   меняется). Тап по нему работает как по любому другому:
   тултип открывается, озвучка играет, запись создаётся — человек может
   не знать dessen, и это нормально. Но в карточки и в подсветку такое
   слово по умолчанию не идёт, иначе колода забивается aber/und/nicht.
   Принцип «не запрещать, а не мешать»: слово никуда не пропадает,
   у него свой фильтр в словаре книги.

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const ReaderWords = (() => {

  const KEY = 'dm_book_words:';

  // Набор взят из фактических значений pos в data/books/*/glossary.json,
  // а не придуман: артикль, предл., союз, частица, мест., межд., числ.
  // Всё остальное (сущ., гл., прил., нареч., субст. прил., прозвище,
  // выраж., геогр.) — полнозначное. Неизвестный pos тоже считается
  // полнозначным: новая часть речи не должна молча исчезать из сборника.
  const FUNCTION_POS = ['артикль', 'предл.', 'союз', 'частица',
                        'мест.', 'межд.', 'числ.'];

  function isFunctionPos(pos) {
    return FUNCTION_POS.indexOf(String(pos || '').trim()) >= 0;
  }

  // Список исключений ПО ЛЕММЕ, отдельно от pos. Нужен потому, что
  // «so», «da», «noch», «nun» в этом тексте — настоящие наречия
  // («так», «тогда», «ещё», «теперь»), и переписывать им pos значило бы
  // врать в карточке о части речи. А записывать в служебные весь класс
  // «нареч.» нельзя: там 43 содержательных слова (gewaltig, zuletzt,
  // abends). Поэтому связки перечислены поимённо.
  //
  // Порог отбора — частотность в книге: слово, встреченное один-два
  // раза, скорее содержательное, и в список не идёт. Замер по всем
  // четырём главам: da 16, nun 9, so 6, noch 6, auch 5. Не вошли:
  // dort/immer/wohl/bald/endlich (по 2), dann/schon/wieder/hier/gar/
  // also (по 1).
  //
  // auch уже служебное по pos («частица») — оставлен в списке явно,
  // чтобы классификация не зависела от одной пометы в словаре.
  const FUNCTION_LEMMAS = ['so', 'da', 'noch', 'nun', 'auch'];

  function isFunctionLemma(lemma) {
    return FUNCTION_LEMMAS.indexOf(String(lemma || '').trim().toLowerCase()) >= 0;
  }

  // Служебное = служебная часть речи ИЛИ лемма из списка исключений
  function isFunctionWord(pos, lemma) {
    return isFunctionPos(pos) || isFunctionLemma(lemma);
  }

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
        let migrated = 0;
        Object.keys(parsed).forEach(lemma => {
          const rec = parsed[lemma];
          if (!rec || typeof rec !== 'object') return;
          // fn — ПРОИЗВОДНОЕ поле: пересчитываем его при каждой загрузке
          // по pos записи (он лежит в ней с момента add(), глоссарий
          // грузить не нужно — в словаре книги главы может не быть
          // вовсе) и по списку лемм. Так правка любого из двух списков
          // сама доезжает до уже собранных слов, а не только до новых.
          // Ничего не стираем: служебные просто уходят в свой фильтр.
          const fn = isFunctionWord(rec.pos, lemma);
          if (rec.fn !== fn) {
            rec.fn = fn;
            migrated++;
          }
          words[lemma] = rec;
        });
        if (migrated) save();
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

  // Подсвечиваем всё, что собрано, не помечено выученным и не служебное.
  // Через эту же проверку идёт счётчик карточек главы (js/reader.js:
  // chapterLemmas), поэтому служебные не попадают и в колоду.
  function isMarked(lemma) {
    const rec = words[lemma];
    return !!rec && rec.status !== 'known' && !rec.fn;
  }

  function isFunction(lemma) {
    const rec = words[lemma];
    return !!rec && !!rec.fn;
  }

  // Сколько собрано полнозначных слов: это число показывает библиотека.
  // Служебные в него не входят — иначе счётчик книги мерил бы не
  // словарный запас, а количество тапов по «und».
  function countContent() {
    return Object.keys(words).filter(l => !words[l].fn).length;
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
      // fn пишем всегда булевым: load() при каждой загрузке сверяет его
      // с текущими списками и при расхождении переписывает.
      rec.fn = isFunctionWord(e.pos, lemma);
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

  return { load, save, all, get, count, countContent, isMarked, isFunction,
           isFunctionPos, isFunctionLemma, isFunctionWord,
           add, setStatus, remove };
})();
