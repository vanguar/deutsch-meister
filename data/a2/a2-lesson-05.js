/* ═══════════════════════════════════════════════
   data/a2-lesson-05.js
   A2 · Урок 5: Einkaufen und Kleidung — Покупки и одежда
                Сравнительная и превосходная степень прилагательных
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-05',
  level: 'A2',
  unit:  5,
  title: 'Einkaufen und Kleidung',
  subtitle: 'Покупки и одежда · Komparativ и Superlativ',

  meta: {
    duration: '30–35 мин',
    wordCount: 26,
    xpReward: 120
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Kann ich Ihnen helfen?',                ru: 'Я могу Вам помочь?',                        note: 'Стандартное приветствие продавца', audio: 'Kann ich Ihnen helfen' },
    { de: 'Ich suche eine Hose.',                  ru: 'Я ищу брюки.',                              note: 'die Hose — ед.ч. в нем. (одни «штаны»)', audio: 'Ich suche eine Hose' },
    { de: 'Welche Größe haben Sie?',               ru: 'Какой у Вас размер?',                       note: 'die Größe — размер', audio: 'Welche Größe haben Sie' },
    { de: 'Ich habe Größe 38.',                    ru: 'У меня 38 размер.',                         note: 'Размеры читаются как числа', audio: 'Ich habe Größe achtunddreißig' },
    { de: 'Darf ich das anprobieren?',             ru: 'Можно это примерить?',                      note: 'anprobieren — примерять (отделяемая!)', audio: 'Darf ich das anprobieren' },
    { de: 'Wo ist die Umkleidekabine?',            ru: 'Где примерочная?',                          note: 'die Umkleidekabine — примерочная', audio: 'Wo ist die Umkleidekabine' },
    { de: 'Das passt mir gut.',                    ru: 'Это мне хорошо подходит.',                  note: 'passen + Dat. — подходить (по размеру)', audio: 'Das passt mir gut' },
    { de: 'Das passt mir nicht.',                  ru: 'Это мне не подходит.',                      note: 'Часто слышишь в магазине', audio: 'Das passt mir nicht' },
    { de: 'Das steht dir gut!',                    ru: 'Тебе это идёт!',                            note: 'stehen + Dat. — идти кому-то (о цвете/виде)', audio: 'Das steht dir gut' },
    { de: 'Haben Sie das in Blau?',                ru: 'У вас это есть в синем?',                   note: 'in + Farbe — в каком-то цвете', audio: 'Haben Sie das in Blau' },
    { de: 'Das ist zu teuer.',                     ru: 'Это слишком дорого.',                       note: 'zu + прил. = слишком', audio: 'Das ist zu teuer' },
    { de: 'Gibt es etwas Billigeres?',             ru: 'Есть что-нибудь подешевле?',                note: 'Komparativ + es → billigeres', audio: 'Gibt es etwas Billigeres' },
    { de: 'Diese Hose ist billiger als die andere.',ru: 'Эти брюки дешевле, чем те.',                note: 'Komparativ + als (чем)', audio: 'Diese Hose ist billiger als die andere' },
    { de: 'Das T-Shirt ist am billigsten.',        ru: 'Эта футболка самая дешёвая.',               note: 'Superlativ: am + ___sten', audio: 'Das T-Shirt ist am billigsten' },
    { de: 'Ich nehme das.',                        ru: 'Я возьму это.',                             note: 'nehmen — взять (du nimmst, er nimmt)', audio: 'Ich nehme das' },
    { de: 'Wie viel macht das zusammen?',          ru: 'Сколько это вместе?',                       note: 'zusammen = вместе, в сумме', audio: 'Wie viel macht das zusammen' },
    { de: 'Das macht 49,90 Euro.',                 ru: 'Это будет 49,90 евро.',                     note: 'Запятая в нем. = точка в русском', audio: 'Das macht neunundvierzig Euro neunzig' },
    { de: 'Zahle ich bar oder mit Karte?',         ru: 'Я плачу наличными или картой?',             note: 'bar = наличными, mit Karte = картой', audio: 'Zahle ich bar oder mit Karte' },
    { de: 'Mit Karte, bitte.',                     ru: 'Картой, пожалуйста.',                       note: 'die Karte — карта', audio: 'Mit Karte, bitte' },
    { de: 'Brauchen Sie eine Tüte?',               ru: 'Вам нужен пакет?',                          note: 'die Tüte — пакет (в Германии часто платный)', audio: 'Brauchen Sie eine Tüte' },
    { de: 'Den Kassenbon, bitte.',                 ru: 'Чек, пожалуйста.',                          note: 'der Kassenbon — кассовый чек', audio: 'Den Kassenbon, bitte' },
    { de: 'Schwarz ist schöner als Grau.',         ru: 'Чёрный красивее серого.',                   note: 'schön → schöner (с умлаутом!)', audio: 'Schwarz ist schöner als Grau' },
    { de: 'Diese Schuhe sind die besten.',         ru: 'Эти туфли — самые лучшие.',                 note: 'gut → besser → der/die/das beste', audio: 'Diese Schuhe sind die besten' },
    { de: 'Vielen Dank, auf Wiedersehen!',         ru: 'Большое спасибо, до свидания!',             note: 'Стандартное прощание в магазине', audio: 'Vielen Dank auf Wiedersehen' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'die Kleidung',     ru: 'одежда',                ipa: '[ˈklaɪ̯dʊŋ]',         article: 'die' },
    { de: 'das T-Shirt',      ru: 'футболка',              ipa: '[ˈtiːʃɜːɐ̯t]',        article: 'das' },
    { de: 'das Hemd',         ru: 'рубашка',               ipa: '[hɛmt]',              article: 'das' },
    { de: 'die Hose',         ru: 'брюки',                 ipa: '[ˈhoːzə]',            article: 'die' },
    { de: 'der Rock',         ru: 'юбка',                  ipa: '[ʁɔk]',               article: 'der' },
    { de: 'das Kleid',        ru: 'платье',                ipa: '[klaɪ̯t]',            article: 'das' },
    { de: 'die Jacke',        ru: 'куртка',                ipa: '[ˈjakə]',             article: 'die' },
    { de: 'der Mantel',       ru: 'пальто',                ipa: '[ˈmantl̩]',           article: 'der' },
    { de: 'die Schuhe',       ru: 'туфли (мн.ч.)',         ipa: '[ˈʃuːə]',             article: 'die' },
    { de: 'die Mütze',        ru: 'шапка',                 ipa: '[ˈmʏtsə]',            article: 'die' },
    { de: 'die Größe',        ru: 'размер',                ipa: '[ˈɡʁøːsə]',           article: 'die' },
    { de: 'die Farbe',        ru: 'цвет',                  ipa: '[ˈfaʁbə]',            article: 'die' },
    { de: 'der Preis',        ru: 'цена',                  ipa: '[pʁaɪ̯s]',            article: 'der' },
    { de: 'die Kasse',        ru: 'касса',                 ipa: '[ˈkasə]',             article: 'die' },
    { de: 'die Tüte',         ru: 'пакет',                 ipa: '[ˈtyːtə]',            article: 'die' },
    { de: 'billig',           ru: 'дешёвый',               ipa: '[ˈbɪlɪç]',            article: '' },
    { de: 'teuer',            ru: 'дорогой',               ipa: '[ˈtɔɪ̯ɐ]',            article: '' },
    { de: 'groß',             ru: 'большой',               ipa: '[ɡʁoːs]',             article: '' },
    { de: 'klein',            ru: 'маленький',             ipa: '[klaɪ̯n]',            article: '' },
    { de: 'kurz',             ru: 'короткий',              ipa: '[kʊʁts]',             article: '' },
    { de: 'lang',             ru: 'длинный',               ipa: '[laŋ]',               article: '' },
    { de: 'schön',            ru: 'красивый',              ipa: '[ʃøːn]',              article: '' },
    { de: 'kaufen',           ru: 'покупать',              ipa: '[ˈkaʊ̯fn̩]',          article: '' },
    { de: 'verkaufen',        ru: 'продавать',             ipa: '[fɛɐ̯ˈkaʊ̯fn̩]',      article: '' },
    { de: 'anprobieren',      ru: 'примерять',             ipa: '[ˈanpʁoˌbiːʁən]',    article: '' },
    { de: 'bezahlen',         ru: 'оплачивать',            ipa: '[bəˈtsaːlən]',        article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Komparativ — сравнительная степень',
      body: 'Чтобы сравнить два предмета, добавь к прилагательному <strong>-er</strong>, а слово «чем» — это <strong>als</strong>:<br><br>' +
            '<em>billig → <strong>billig<u>er</u></strong></em> — дешевле<br>' +
            '<em>schnell → <strong>schnell<u>er</u></strong></em> — быстрее<br><br>' +
            '<em>Die Hose ist <strong>billiger als</strong> die Jacke.</em> — Брюки дешевле, чем куртка.<br>' +
            '<em>Er ist <strong>älter als</strong> ich.</em> — Он старше меня.<br><br>' +
            '⚠️ Короткие прилагательные с гласными <strong>a, o, u</strong> часто получают <strong>умлаут</strong>: <em>alt → älter, jung → jünger, groß → größer, kurz → kürzer, oft → öfter</em>.',
      conjugation: [
        { pronoun: 'klein',  form: 'kleiner',  audio: 'kleiner',  translation: 'меньше' },
        { pronoun: 'billig', form: 'billiger', audio: 'billiger', translation: 'дешевле' },
        { pronoun: 'alt',    form: 'älter',    audio: 'älter',    translation: 'старше' },
        { pronoun: 'jung',   form: 'jünger',   audio: 'jünger',   translation: 'моложе' },
        { pronoun: 'groß',   form: 'größer',   audio: 'größer',   translation: 'больше' },
        { pronoun: 'kurz',   form: 'kürzer',   audio: 'kürzer',   translation: 'короче' }
      ]
    },
    {
      title: '⚡ Superlativ — превосходная степень',
      body: 'Когда что-то «самое-самое», есть <strong>две формы</strong>:<br><br>' +
            '<strong>1. am ___sten</strong> — стоит после глагола (предикатив):<br>' +
            '<em>Diese Hose ist <strong>am billigsten</strong>.</em> — Эти брюки самые дешёвые.<br>' +
            '<em>Er läuft <strong>am schnellsten</strong>.</em> — Он бежит быстрее всех.<br><br>' +
            '<strong>2. der/die/das ___ste</strong> — перед существительным:<br>' +
            '<em>Das ist <strong>die billigste</strong> Hose.</em> — Это самые дешёвые брюки.<br>' +
            '<em>Mein <strong>bester</strong> Freund.</em> — Мой лучший друг.<br><br>' +
            '⚠️ После <em>-t, -d, -s, -ß, -z</em> вставляется <strong>e</strong>: alt → am ält<strong>e</strong>sten, kurz → am kürz<strong>e</strong>sten.',
      conjugation: [
        { pronoun: 'klein',  form: 'am kleinsten',  audio: 'am kleinsten',  translation: 'самый маленький' },
        { pronoun: 'billig', form: 'am billigsten', audio: 'am billigsten', translation: 'самый дешёвый' },
        { pronoun: 'alt',    form: 'am ältesten',   audio: 'am ältesten',   translation: 'самый старый' },
        { pronoun: 'groß',   form: 'am größten',    audio: 'am größten',    translation: 'самый большой' },
        { pronoun: 'kurz',   form: 'am kürzesten',  audio: 'am kürzesten',  translation: 'самый короткий' },
        { pronoun: 'schön',  form: 'am schönsten',  audio: 'am schönsten',  translation: 'самый красивый' }
      ]
    },
    {
      title: '⚡ Особые формы (нерегулярные)',
      body: 'Несколько частотных прилагательных и наречий имеют <strong>особые формы</strong> — их нужно знать наизусть:',
      conjugation: [
        { pronoun: 'gut',   form: 'besser  → am besten',   audio: 'gut besser am besten',   translation: 'хороший → лучше → лучший' },
        { pronoun: 'viel',  form: 'mehr    → am meisten',  audio: 'viel mehr am meisten',   translation: 'много → больше → больше всех' },
        { pronoun: 'gern',  form: 'lieber  → am liebsten', audio: 'gern lieber am liebsten', translation: 'охотно → охотнее → охотнее всего' },
        { pronoun: 'hoch',  form: 'höher   → am höchsten', audio: 'hoch höher am höchsten', translation: 'высокий → выше → высший' },
        { pronoun: 'nah',   form: 'näher   → am nächsten', audio: 'nah näher am nächsten',  translation: 'близкий → ближе → ближайший' },
        { pronoun: 'teuer', form: 'teurer  → am teuersten', audio: 'teuer teurer am teuersten', translation: 'дорогой → дороже → самый дорогой' }
      ]
    },
    {
      title: '💡 Полезные конструкции в магазине',
      body: 'Запомни как готовые формулы — пригодится сразу:<br><br>' +
            '<em>Ich <strong>suche</strong> eine Hose.</em> — Я ищу брюки.<br>' +
            '<em>Können Sie <strong>mir</strong> ein T-Shirt zeigen?</em> — Покажете мне футболку?<br>' +
            '<em><strong>Darf ich</strong> das anprobieren?</em> — Можно это примерить?<br>' +
            '<em>Das <strong>passt mir</strong>.</em> — Это мне подходит. (по размеру)<br>' +
            '<em>Das <strong>steht mir</strong>.</em> — Это мне идёт. (по виду)<br>' +
            '<em>Das <strong>gefällt mir</strong>.</em> — Мне это нравится.<br><br>' +
            '👉 Все три — с дативом! ich → mir, du → dir.<br><br>' +
            '<em>Ich nehme das.</em> — Беру.<br>' +
            '<em>Das ist mir zu teuer.</em> — Это для меня слишком дорого.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Welche',         blank: 'Größe',    after: 'haben Sie?',           translation: '— Какой у Вас размер?',                  hintWord: 'Größe',    hintRule: 'die Größe — размер (с большой)' },
      { before: '— Die Hose ist',   blank: 'billiger', after: 'als die Jacke.',       translation: '— Брюки дешевле, чем куртка.',           hintWord: 'billiger', hintRule: 'Komparativ от billig: + er' },
      { before: '— Diese Schuhe sind am', blank: 'teuersten', after: '.',             translation: '— Эти туфли самые дорогие.',             hintWord: 'teuersten',hintRule: 'Superlativ: am + teuer-sten' },
      { before: '— Das passt',      blank: 'mir',      after: 'gut.',                 translation: '— Это мне хорошо подходит.',             hintWord: 'mir',      hintRule: 'passen + Dat. ich → mir' },
      { before: '— Ich',            blank: 'nehme',    after: 'das.',                 translation: '— Я возьму это.',                        hintWord: 'nehme',    hintRule: 'nehmen → ich nehme' },
      { before: '— Schwarz ist',    blank: 'schöner',  after: 'als Grau.',            translation: '— Чёрный красивее серого.',              hintWord: 'schöner',  hintRule: 'schön → schöner (с -er, но без умл.)' },
      { before: '— Diese Hose ist die', blank: 'beste', after: '.',                   translation: '— Эти брюки лучшие.',                    hintWord: 'beste',    hintRule: 'gut → besser → die beste' },
      { before: '— Darf ich das',   blank: 'anprobieren', after: '?',                 translation: '— Можно это примерить?',                 hintWord: 'anprobieren', hintRule: 'инфинитив в конце после модального' }
    ],

    multipleChoice: [
      { question: 'Какой Komparativ у «alt»?',                                         options: ['alter', 'älter', 'altter', 'aller'],                                  correctIndex: 1 },
      { question: 'Что значит «als» в сравнении?',                                     options: ['как', 'когда', 'чем', 'если'],                                        correctIndex: 2 },
      { question: 'Какой Superlativ у «gut»?',                                         options: ['am gutsten', 'am besten', 'am gernsten', 'am meisten'],              correctIndex: 1 },
      { question: '«Passt mir nicht» означает…',                                      options: ['Не нравится', 'Не подходит (размер)', 'Дорого', 'Нет в наличии'],   correctIndex: 1 },
      { question: 'Какой Superlativ у «teuer»?',                                       options: ['am teursten', 'am teuersten', 'am teuerten', 'am teuern'],            correctIndex: 1 },
      { question: 'Что значит «zu teuer»?',                                            options: ['к дорогому', 'слишком дорого', 'у дорогого', 'для дорогого'],         correctIndex: 1 },
      { question: 'Где правильная форма? «Diese Hose ist __»',                         options: ['die billigste', 'am billigsten', 'der billigste', 'des billigsten'],   correctIndex: 1 },
      { question: 'Какой Komparativ у «viel»?',                                        options: ['vieler', 'mehrer', 'mehr', 'vielere'],                                correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'klein → kleiner',     ru: 'маленький → меньше' },
      { id: 2, de: 'gut → besser',        ru: 'хороший → лучше' },
      { id: 3, de: 'viel → mehr',         ru: 'много → больше' },
      { id: 4, de: 'gern → lieber',       ru: 'охотно → охотнее' },
      { id: 5, de: 'teuer → am teuersten',ru: 'дорогой → самый дорогой' },
      { id: 6, de: 'die Größe',           ru: 'размер' },
      { id: 7, de: 'anprobieren',         ru: 'примерять' },
      { id: 8, de: 'bezahlen',            ru: 'оплачивать' }
    ],

    dictation: [
      { word: 'Kleidung',  audio: 'Kleidung' },
      { word: 'Größe',     audio: 'Größe' },
      { word: 'billig',    audio: 'billig' },
      { word: 'teuer',     audio: 'teuer' },
      { word: 'kaufen',    audio: 'kaufen' },
      { word: 'Schuhe',    audio: 'Schuhe' },
      { word: 'besser',    audio: 'besser' },
      { word: 'Kasse',     audio: 'Kasse' }
    ]
  }
};
