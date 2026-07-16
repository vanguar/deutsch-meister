/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-15.js
   A1 · Урок 15: Im Café — В кафе
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-15',
  level: 'A1',
  unit:  15,
  title: 'Im Café',
  subtitle: 'В кафе · Заказываем еду и напитки',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Ist hier noch frei?',                  ru: 'Здесь свободно?',                  note: 'frei — свободный', audio: 'Ist hier noch frei' },
    { de: 'Die Speisekarte, bitte.',              ru: 'Меню, пожалуйста.',                note: 'die Speisekarte — меню', audio: 'Die Speisekarte, bitte' },
    { de: 'Was möchten Sie trinken?',             ru: 'Что вы хотите пить?',              note: 'möchten — хотеть (вежливо)', audio: 'Was möchten Sie trinken' },
    { de: 'Ich möchte einen Kaffee, bitte.',      ru: 'Мне кофе, пожалуйста.',            note: 'der Kaffee → einen Kaffee (Akkusativ)', audio: 'Ich möchte einen Kaffee, bitte' },
    { de: 'Einen Tee mit Zitrone, bitte.',        ru: 'Чай с лимоном, пожалуйста.',       note: 'der Tee — чай; die Zitrone — лимон', audio: 'Einen Tee mit Zitrone, bitte' },
    { de: 'Mit Milch und Zucker?',                ru: 'С молоком и сахаром?',             note: 'der Zucker — сахар', audio: 'Mit Milch und Zucker' },
    { de: 'Ohne Zucker, bitte.',                  ru: 'Без сахара, пожалуйста.',          note: 'ohne — без (+ Akkusativ)', audio: 'Ohne Zucker, bitte' },
    { de: 'Ich nehme ein Stück Kuchen.',          ru: 'Я возьму кусочек торта.',          note: 'das Stück — кусок; der Kuchen — пирог, торт', audio: 'Ich nehme ein Stück Kuchen' },
    { de: 'Schmeckt es Ihnen?',                   ru: 'Вам вкусно?',                      note: 'schmecken — быть вкусным', audio: 'Schmeckt es Ihnen' },
    { de: 'Es schmeckt sehr gut!',                ru: 'Очень вкусно!',                    note: 'стандартный комплимент еде', audio: 'Es schmeckt sehr gut' },
    { de: 'Zahlen, bitte!',                       ru: 'Счёт, пожалуйста!',                note: 'так подзывают официанта для оплаты', audio: 'Zahlen, bitte' },
    { de: 'Die Rechnung, bitte.',                 ru: 'Счёт, пожалуйста.',                note: 'die Rechnung — счёт', audio: 'Die Rechnung, bitte' },
    { de: 'Zusammen oder getrennt?',              ru: 'Вместе или раздельно?',            note: 'вопрос официанта при оплате', audio: 'Zusammen oder getrennt' },
    { de: 'Das macht acht Euro fünfzig.',         ru: 'С вас восемь евро пятьдесят.',     note: 'das macht… — итого…', audio: 'Das macht acht Euro fünfzig' },
    { de: 'Stimmt so!',                           ru: 'Сдачи не надо!',                   note: 'так оставляют чаевые', audio: 'Stimmt so' },
    { de: 'Guten Appetit!',                       ru: 'Приятного аппетита!',              note: 'стандартное пожелание', audio: 'Guten Appetit' }
  ],

  vocabulary: [
    { de: 'das Café',        ru: 'кафе',            ipa: '[kaˈfeː]',         article: 'das' },
    { de: 'die Speisekarte', ru: 'меню',            ipa: '[ˈʃpaɪ̯zəˌkaʁtə]', article: 'die' },
    { de: 'der Kaffee',      ru: 'кофе',            ipa: '[ˈkafe]',          article: 'der' },
    { de: 'der Tee',         ru: 'чай',             ipa: '[teː]',            article: 'der' },
    { de: 'der Saft',        ru: 'сок',             ipa: '[zaft]',           article: 'der' },
    { de: 'das Wasser',      ru: 'вода',            ipa: '[ˈvasɐ]',          article: 'das' },
    { de: 'der Zucker',      ru: 'сахар',           ipa: '[ˈtsʊkɐ]',         article: 'der' },
    { de: 'der Kuchen',      ru: 'пирог, торт',     ipa: '[ˈkuːxn̩]',        article: 'der' },
    { de: 'das Stück',       ru: 'кусок',           ipa: '[ʃtʏk]',           article: 'das' },
    { de: 'das Brötchen',    ru: 'булочка',         ipa: '[ˈbʁøːtçən]',      article: 'das' },
    { de: 'das Eis',         ru: 'мороженое',       ipa: '[aɪ̯s]',           article: 'das' },
    { de: 'die Rechnung',    ru: 'счёт',            ipa: '[ˈʁɛçnʊŋ]',        article: 'die' },
    { de: 'der Kellner',     ru: 'официант',        ipa: '[ˈkɛlnɐ]',         article: 'der' },
    { de: 'das Trinkgeld',   ru: 'чаевые',          ipa: '[ˈtʁɪŋkˌɡɛlt]',    article: 'das' },
    { de: 'bestellen',       ru: 'заказывать',      ipa: '[bəˈʃtɛlən]',      article: '' },
    { de: 'trinken',         ru: 'пить',            ipa: '[ˈtʁɪŋkn̩]',       article: '' },
    { de: 'essen',           ru: 'есть, кушать',    ipa: '[ˈɛsn̩]',          article: '' },
    { de: 'schmecken',       ru: 'быть вкусным',    ipa: '[ˈʃmɛkn̩]',        article: '' },
    { de: 'frei',            ru: 'свободный',       ipa: '[fʁaɪ̯]',          article: '' },
    { de: 'lecker',          ru: 'вкусный',         ipa: '[ˈlɛkɐ]',          article: '' }
  ],

  grammar: [
    {
      title: '⚡ möchten — вежливое «хочу»',
      body: '<strong>möchten</strong> — самый вежливый способ заказать что-либо:<br><br>' +
            '<em>Ich <strong>möchte</strong> einen Kaffee.</em> — Я хотел бы кофе.<br>' +
            '<em>Was <strong>möchten</strong> Sie trinken?</em> — Что вы хотите пить?<br><br>' +
            'Обрати внимание: для ich и er/sie/es форма одинаковая — <strong>möchte</strong>.',
      conjugation: [
        { pronoun: 'ich',           form: 'möchte',    audio: 'ich möchte',    translation: 'я хотел бы' },
        { pronoun: 'du',            form: 'möchtest',  audio: 'du möchtest',   translation: 'ты хотел бы' },
        { pronoun: 'er / sie / es', form: 'möchte',    audio: 'er möchte',     translation: 'он/она хотел(а) бы' },
        { pronoun: 'wir',           form: 'möchten',   audio: 'wir möchten',   translation: 'мы хотели бы' },
        { pronoun: 'ihr',           form: 'möchtet',   audio: 'ihr möchtet',   translation: 'вы хотели бы' },
        { pronoun: 'Sie / sie',     form: 'möchten',   audio: 'Sie möchten',   translation: 'Вы хотели бы / они хотели бы' }
      ]
    },
    {
      title: '⚡ Глагол essen — есть (e → i)',
      body: 'Глагол <strong>essen</strong> меняет корень в формах du и er/sie/es:<br><br>' +
            '<em>Ich esse. → Du <strong>i</strong>sst. → Er <strong>i</strong>sst.</em><br><br>' +
            'Форма du и er/sie/es совпадают: <strong>isst</strong>.',
      conjugation: [
        { pronoun: 'ich',           form: 'esse',   audio: 'ich esse',   translation: 'я ем' },
        { pronoun: 'du',            form: 'isst',   audio: 'du isst',    translation: 'ты ешь' },
        { pronoun: 'er / sie / es', form: 'isst',   audio: 'er isst',    translation: 'он/она ест' },
        { pronoun: 'wir',           form: 'essen',  audio: 'wir essen',  translation: 'мы едим' },
        { pronoun: 'ihr',           form: 'esst',   audio: 'ihr esst',   translation: 'вы едите' },
        { pronoun: 'Sie / sie',     form: 'essen',  audio: 'Sie essen',  translation: 'Вы едите / они едят' }
      ]
    },
    {
      title: '💡 mit и ohne — с и без',
      body: '<strong>mit</strong> — «с» (+ Dativ): <em>Kaffee <strong>mit</strong> Milch</em> — кофе с молоком<br>' +
            '<strong>ohne</strong> — «без» (+ Akkusativ): <em>Tee <strong>ohne</strong> Zucker</em> — чай без сахара<br><br>' +
            'В заказах напитков артикль после mit/ohne обычно не нужен.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich',                   blank: 'möchte',     after: 'einen Kaffee, bitte.',    translation: '— Мне кофе, пожалуйста.',           hintWord: 'möchte',     hintRule: 'ich → möchte' },
      { before: '— Die',                   blank: 'Speisekarte', after: ', bitte.',               translation: '— Меню, пожалуйста.',               hintWord: 'Speisekarte', hintRule: 'die Speisekarte — меню' },
      { before: '— Einen Tee',             blank: 'ohne',       after: 'Zucker, bitte.',          translation: '— Чай без сахара, пожалуйста.',     hintWord: 'ohne',       hintRule: 'ohne — без' },
      { before: '— Es',                    blank: 'schmeckt',   after: 'sehr gut!',               translation: '— Очень вкусно!',                   hintWord: 'schmeckt',   hintRule: 'schmecken — быть вкусным' },
      { before: '— Die',                   blank: 'Rechnung',   after: ', bitte.',                translation: '— Счёт, пожалуйста.',               hintWord: 'Rechnung',   hintRule: 'die Rechnung — счёт' },
      { before: '— Zusammen oder',         blank: 'getrennt',   after: '?',                       translation: '— Вместе или раздельно?',           hintWord: 'getrennt',   hintRule: 'getrennt — раздельно' },
      { before: '— Er',                    blank: 'isst',       after: 'ein Stück Kuchen.',       translation: '— Он ест кусочек торта.',           hintWord: 'isst',       hintRule: 'essen → isst (e→i)' },
      { before: '— Guten',                 blank: 'Appetit',    after: '!',                       translation: '— Приятного аппетита!',             hintWord: 'Appetit',    hintRule: 'Guten Appetit — приятного аппетита' }
    ],

    multipleChoice: [
      { question: 'Как вежливо заказать кофе?',                options: ['Gib mir Kaffee!', 'Ich möchte einen Kaffee, bitte.', 'Kaffee!', 'Ich habe Kaffee.'], correctIndex: 1 },
      { question: '«Die Rechnung» — это…',                     options: ['меню', 'счёт', 'чаевые', 'заказ'],                           correctIndex: 1 },
      { question: '«Ohne» требует падежа…',                    options: ['Dativ', 'Akkusativ', 'Genitiv', 'Nominativ'],                correctIndex: 1 },
      { question: 'Форма essen для «du»…',                     options: ['esst', 'isst', 'esse', 'essen'],                             correctIndex: 1 },
      { question: '«Stimmt so!» значит…',                      options: ['Это неправильно', 'Сдачи не надо', 'Повторите', 'До свидания'], correctIndex: 1 },
      { question: '«Schmeckt es Ihnen?» спрашивает…',          options: ['цену', 'вкусно ли вам', 'время', 'адрес'],                   correctIndex: 1 },
      { question: '«Das Trinkgeld» — это…',                    options: ['напиток', 'чаевые', 'счёт', 'сдача'],                        correctIndex: 1 },
      { question: '«Zusammen oder getrennt?» — вопрос о…',     options: ['еде', 'оплате', 'месте', 'времени'],                         correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Kaffee',      ru: 'кофе' },
      { id: 2, de: 'der Kuchen',      ru: 'пирог, торт' },
      { id: 3, de: 'die Speisekarte', ru: 'меню' },
      { id: 4, de: 'die Rechnung',    ru: 'счёт' },
      { id: 5, de: 'der Kellner',     ru: 'официант' },
      { id: 6, de: 'bestellen',       ru: 'заказывать' },
      { id: 7, de: 'lecker',          ru: 'вкусный' },
      { id: 8, de: 'das Trinkgeld',   ru: 'чаевые' }
    ],

    dictation: [
      { word: 'Kaffee',     audio: 'Kaffee' },
      { word: 'Tee',        audio: 'Tee' },
      { word: 'Kuchen',     audio: 'Kuchen' },
      { word: 'Zucker',     audio: 'Zucker' },
      { word: 'Rechnung',   audio: 'Rechnung' },
      { word: 'bestellen',  audio: 'bestellen' },
      { word: 'lecker',     audio: 'lecker' },
      { word: 'trinken',    audio: 'trinken' }
    ]
  }
};
