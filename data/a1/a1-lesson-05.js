/* ═══════════════════════════════════════════════
   data/a1-lesson-05.js
   A1 · Урок 5: Welcher Tag ist heute? — Дни, месяцы, сезоны
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-05',
  level: 'A1',
  unit:  5,
  title: 'Welcher Tag ist heute?',
  subtitle: 'Дни недели, месяцы, времена года и распорядок',

  meta: {
    duration: '25–30 мин',
    wordCount: 26,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Welcher Tag ist heute?',                ru: 'Какой сегодня день?',                     note: 'welcher = который (м.р.)', audio: 'Welcher Tag ist heute' },
    { de: 'Heute ist Montag.',                     ru: 'Сегодня понедельник.',                    note: 'Без артикля после ist', audio: 'Heute ist Montag' },
    { de: 'Morgen ist Dienstag.',                  ru: 'Завтра вторник.',                         note: 'morgen (нар.) = завтра', audio: 'Morgen ist Dienstag' },
    { de: 'Gestern war Sonntag.',                  ru: 'Вчера было воскресенье.',                 note: 'war = было (прош. от sein)', audio: 'Gestern war Sonntag' },
    { de: 'Welches Datum ist heute?',              ru: 'Какое сегодня число?',                    note: 'welches — для ср.р.', audio: 'Welches Datum ist heute' },
    { de: 'Heute ist der 15. Mai.',                ru: 'Сегодня 15-е мая.',                       note: 'der fünfzehnte Mai', audio: 'Heute ist der fünfzehnte Mai' },
    { de: 'Am Montag habe ich Schule.',            ru: 'В понедельник у меня школа.',             note: 'am = an + dem (Dat.)', audio: 'Am Montag habe ich Schule' },
    { de: 'Am Wochenende bleibe ich zu Hause.',    ru: 'В выходные я остаюсь дома.',              note: 'zu Hause = дома', audio: 'Am Wochenende bleibe ich zu Hause' },
    { de: 'Was machst du am Wochenende?',          ru: 'Что ты делаешь в выходные?',              note: 'machen = делать', audio: 'Was machst du am Wochenende' },
    { de: 'Am Freitag gehe ich ins Kino.',         ru: 'В пятницу я иду в кино.',                 note: 'gehe — иду; ins = in das', audio: 'Am Freitag gehe ich ins Kino' },
    { de: 'Im Sommer fahre ich nach Italien.',     ru: 'Летом я еду в Италию.',                   note: 'im = in + dem; nach + страна', audio: 'Im Sommer fahre ich nach Italien' },
    { de: 'Im Januar ist es kalt.',                ru: 'В январе холодно.',                       note: 'im + месяц', audio: 'Im Januar ist es kalt' },
    { de: 'Mein Geburtstag ist im April.',         ru: 'Мой день рождения в апреле.',             note: 'der Geburtstag = ДР', audio: 'Mein Geburtstag ist im April' },
    { de: 'Wann hast du Geburtstag?',              ru: 'Когда у тебя день рождения?',             note: 'wann = когда', audio: 'Wann hast du Geburtstag' },
    { de: 'Übermorgen ist Mittwoch.',              ru: 'Послезавтра — среда.',                    note: 'übermorgen = после завтра', audio: 'Übermorgen ist Mittwoch' },
    { de: 'Vorgestern war ich krank.',             ru: 'Позавчера я был болен.',                  note: 'vorgestern = до вчера', audio: 'Vorgestern war ich krank' },
    { de: 'Welcher Monat ist jetzt?',              ru: 'Какой сейчас месяц?',                     note: 'jetzt = сейчас', audio: 'Welcher Monat ist jetzt' },
    { de: 'Es ist März.',                          ru: 'Сейчас март.',                            note: 'Месяцы — м.р., с большой', audio: 'Es ist März' },
    { de: 'Eine Woche hat sieben Tage.',           ru: 'В неделе семь дней.',                     note: 'Tage — мн.ч. от Tag', audio: 'Eine Woche hat sieben Tage' },
    { de: 'Welche Jahreszeit magst du am liebsten?', ru: 'Какое время года тебе больше всего нравится?', note: 'am liebsten = больше всего', audio: 'Welche Jahreszeit magst du am liebsten' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Montag',     ru: 'понедельник', ipa: '[ˈmoːntaːk]',     article: 'der' },
    { de: 'der Dienstag',   ru: 'вторник',     ipa: '[ˈdiːnstaːk]',    article: 'der' },
    { de: 'der Mittwoch',   ru: 'среда',       ipa: '[ˈmɪtvɔx]',       article: 'der' },
    { de: 'der Donnerstag', ru: 'четверг',     ipa: '[ˈdɔnɐstaːk]',    article: 'der' },
    { de: 'der Freitag',    ru: 'пятница',     ipa: '[ˈfʁaɪ̯taːk]',    article: 'der' },
    { de: 'der Samstag',    ru: 'суббота',     ipa: '[ˈzamstaːk]',     article: 'der' },
    { de: 'der Sonntag',    ru: 'воскресенье', ipa: '[ˈzɔntaːk]',      article: 'der' },
    { de: 'das Wochenende', ru: 'выходные',    ipa: '[ˈvɔxn̩ˌʔɛndə]',  article: 'das' },
    { de: 'die Woche',      ru: 'неделя',      ipa: '[ˈvɔxə]',         article: 'die' },
    { de: 'der Monat',      ru: 'месяц',       ipa: '[ˈmoːnat]',       article: 'der' },
    { de: 'der Januar',     ru: 'январь',      ipa: '[ˈjanuaːɐ̯]',     article: 'der' },
    { de: 'der März',       ru: 'март',        ipa: '[mɛʁts]',         article: 'der' },
    { de: 'der April',      ru: 'апрель',      ipa: '[aˈpʁɪl]',        article: 'der' },
    { de: 'der Juli',       ru: 'июль',        ipa: '[ˈjuːli]',        article: 'der' },
    { de: 'der Dezember',   ru: 'декабрь',     ipa: '[deˈtsɛmbɐ]',     article: 'der' },
    { de: 'der Frühling',   ru: 'весна',       ipa: '[ˈfʁyːlɪŋ]',      article: 'der' },
    { de: 'der Sommer',     ru: 'лето',        ipa: '[ˈzɔmɐ]',         article: 'der' },
    { de: 'der Herbst',     ru: 'осень',       ipa: '[hɛʁpst]',        article: 'der' },
    { de: 'der Winter',     ru: 'зима',        ipa: '[ˈvɪntɐ]',        article: 'der' },
    { de: 'heute',          ru: 'сегодня',     ipa: '[ˈhɔɪ̯tə]',       article: '' },
    { de: 'morgen',         ru: 'завтра',      ipa: '[ˈmɔʁɡn̩]',       article: '' },
    { de: 'gestern',        ru: 'вчера',       ipa: '[ˈɡɛstɐn]',       article: '' },
    { de: 'übermorgen',     ru: 'послезавтра', ipa: '[ˈyːbɐˌmɔʁɡn̩]',  article: '' },
    { de: 'jetzt',          ru: 'сейчас',      ipa: '[jɛtst]',         article: '' },
    { de: 'wann',           ru: 'когда',       ipa: '[van]',           article: '' },
    { de: 'der Geburtstag', ru: 'день рождения',ipa: '[ɡəˈbuːɐ̯tstaːk]', article: 'der' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Предлог AM + день недели',
      body: 'Чтобы сказать <strong>«в какой день»</strong>, используй <em>am</em> (это слитное <em>an + dem</em>):<br><br>' +
            '<em>am Montag</em> — в понедельник<br>' +
            '<em>am Freitag</em> — в пятницу<br>' +
            '<em>am Wochenende</em> — в выходные<br><br>' +
            '⚠️ Это <strong>стандартная конструкция</strong>, не «in Montag» или «auf Montag»!',
      conjugation: [
        { pronoun: 'am Montag',     form: 'Пн',    audio: 'am Montag',     translation: 'в понедельник' },
        { pronoun: 'am Dienstag',   form: 'Вт',    audio: 'am Dienstag',   translation: 'во вторник' },
        { pronoun: 'am Mittwoch',   form: 'Ср',    audio: 'am Mittwoch',   translation: 'в среду' },
        { pronoun: 'am Donnerstag', form: 'Чт',    audio: 'am Donnerstag', translation: 'в четверг' },
        { pronoun: 'am Freitag',    form: 'Пт',    audio: 'am Freitag',    translation: 'в пятницу' },
        { pronoun: 'am Samstag',    form: 'Сб',    audio: 'am Samstag',    translation: 'в субботу' },
        { pronoun: 'am Sonntag',    form: 'Вс',    audio: 'am Sonntag',    translation: 'в воскресенье' },
        { pronoun: 'am Wochenende', form: 'Сб/Вс', audio: 'am Wochenende', translation: 'в выходные' }
      ]
    },
    {
      title: '⚡ Предлог IM + месяц или сезон',
      body: 'Для месяцев и времён года используй <em>im</em> (слитное <em>in + dem</em>):<br><br>' +
            '<em>im Januar</em> — в январе<br>' +
            '<em>im Sommer</em> — летом<br>' +
            '<em>im Mai</em> — в мае<br><br>' +
            'Запомни шпаргалку:<br>' +
            '<strong>am</strong> + день недели &nbsp;|&nbsp; <strong>im</strong> + месяц/сезон &nbsp;|&nbsp; <strong>um</strong> + час (урок 8)',
      conjugation: [
        { pronoun: 'im Januar',   form: '01',    audio: 'im Januar',   translation: 'в январе' },
        { pronoun: 'im April',    form: '04',    audio: 'im April',    translation: 'в апреле' },
        { pronoun: 'im Juli',     form: '07',    audio: 'im Juli',     translation: 'в июле' },
        { pronoun: 'im Oktober',  form: '10',    audio: 'im Oktober',  translation: 'в октябре' },
        { pronoun: 'im Frühling', form: '🌱',   audio: 'im Frühling', translation: 'весной' },
        { pronoun: 'im Sommer',   form: '☀️',   audio: 'im Sommer',   translation: 'летом' },
        { pronoun: 'im Herbst',   form: '🍂',   audio: 'im Herbst',   translation: 'осенью' },
        { pronoun: 'im Winter',   form: '❄️',   audio: 'im Winter',   translation: 'зимой' }
      ]
    },
    {
      title: '💡 Heute, morgen, gestern — наречия времени',
      body: 'Эти слова не используют предлог:<br><br>' +
            '<em>heute</em> — сегодня → <em>Heute ist Montag.</em><br>' +
            '<em>morgen</em> — завтра → <em>Morgen ist Dienstag.</em><br>' +
            '<em>gestern</em> — вчера → <em>Gestern war Sonntag.</em><br>' +
            '<em>übermorgen</em> — послезавтра<br>' +
            '<em>vorgestern</em> — позавчера<br><br>' +
            '⚠️ Не путай <em>der Morgen</em> (утро, существительное) и <em>morgen</em> (завтра, наречие, с маленькой буквы).'
    },
    {
      title: '💡 Welcher / welche / welches — какой / какая / какое',
      body: 'Вопросительное слово <strong>welcher</strong> («который, какой») согласуется с родом существительного:<br><br>' +
            '<strong>welcher</strong> Tag (м.р.) → <em>Welcher Tag ist heute?</em><br>' +
            '<strong>welche</strong> Jahreszeit (ж.р.) → <em>Welche Jahreszeit magst du?</em><br>' +
            '<strong>welches</strong> Datum (ср.р.) → <em>Welches Datum ist heute?</em><br>' +
            '<strong>welche</strong> Tage (мн.ч.) → <em>Welche Tage hast du frei?</em>'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Heute ist',            blank: 'Montag',     after: '.',                  translation: '— Сегодня понедельник.',                       hintWord: 'Montag',     hintRule: 'Montag — с большой (существительное)' },
      { before: '— Am Freitag gehe ich ins', blank: 'Kino',     after: '.',                  translation: '— В пятницу я иду в кино.',                    hintWord: 'Kino',       hintRule: 'Kino = кино, das Kino' },
      { before: '— Was machst du am',     blank: 'Wochenende', after: '?',                  translation: '— Что ты делаешь в выходные?',                  hintWord: 'Wochenende', hintRule: 'Wochenende = выходные' },
      { before: '— Welcher Tag ist',      blank: 'heute',      after: '?',                  translation: '— Какой сегодня день?',                         hintWord: 'heute',      hintRule: 'heute = сегодня (наречие)' },
      { before: '—',                       blank: 'Im',         after: 'Sommer ist es heiß.',translation: '— Летом жарко.',                               hintWord: 'Im',         hintRule: 'im + сезон/месяц (с большой в начале)' },
      { before: '— Mein Geburtstag ist',  blank: 'im',         after: 'April.',             translation: '— Мой день рождения в апреле.',                 hintWord: 'im',         hintRule: 'im + название месяца' },
      { before: '—',                       blank: 'Gestern',    after: 'war Sonntag.',       translation: '— Вчера было воскресенье.',                     hintWord: 'Gestern',    hintRule: 'gestern = вчера (с большой в начале)' },
      { before: '—',                       blank: 'Welche',     after: 'Jahreszeit magst du?', translation: '— Какое время года тебе нравится?',          hintWord: 'Welche',     hintRule: 'Jahreszeit — ж.р., welche' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «среда»?',                                options: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'],                                            correctIndex: 2 },
      { question: '«Gestern» означает:',                                    options: ['сегодня', 'завтра', 'вчера', 'послезавтра'],                                                correctIndex: 2 },
      { question: 'Как сказать «в субботу»?',                               options: ['an Samstag', 'am Samstag', 'der Samstag', 'in Samstag'],                                    correctIndex: 1 },
      { question: 'Какой день идёт после Dienstag?',                       options: ['Montag', 'Mittwoch', 'Donnerstag', 'Freitag'],                                              correctIndex: 1 },
      { question: 'Как сказать «летом»?',                                   options: ['am Sommer', 'in Sommer', 'im Sommer', 'an Sommer'],                                         correctIndex: 2 },
      { question: 'Какой предлог с месяцами?',                              options: ['am', 'um', 'im', 'an'],                                                                     correctIndex: 2 },
      { question: 'Welcher / welche / welches — это:',                      options: ['артикли', 'местоимения', 'вопросительные слова «какой»', 'предлоги'],                       correctIndex: 2 },
      { question: '«Übermorgen» — это:',                                    options: ['позавчера', 'вчера', 'завтра', 'послезавтра'],                                              correctIndex: 3 }
    ],

    matching: [
      { id: 1, de: 'Montag',     ru: 'понедельник' },
      { id: 2, de: 'Mittwoch',   ru: 'среда' },
      { id: 3, de: 'Freitag',    ru: 'пятница' },
      { id: 4, de: 'Sonntag',    ru: 'воскресенье' },
      { id: 5, de: 'gestern',    ru: 'вчера' },
      { id: 6, de: 'der Sommer', ru: 'лето' },
      { id: 7, de: 'der Winter', ru: 'зима' },
      { id: 8, de: 'wann',       ru: 'когда' }
    ],

    dictation: [
      { word: 'Montag',     audio: 'Montag' },
      { word: 'Freitag',    audio: 'Freitag' },
      { word: 'heute',      audio: 'heute' },
      { word: 'morgen',     audio: 'morgen' },
      { word: 'Wochenende', audio: 'Wochenende' },
      { word: 'Sommer',     audio: 'Sommer' },
      { word: 'Geburtstag', audio: 'Geburtstag' },
      { word: 'Mittwoch',   audio: 'Mittwoch' }
    ]
  }
};
