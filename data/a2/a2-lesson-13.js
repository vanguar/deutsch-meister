/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-13.js
   A2 · Урок 13: Sport und Fitness — Спорт и фитнес
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-13',
  level: 'A2',
  unit:  13,
  title: 'Sport und Fitness',
  subtitle: 'Спорт, фитнес и здоровый образ жизни',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Treibst du Sport?',                   ru: 'Ты занимаешься спортом?',          note: 'Sport treiben — заниматься спортом', audio: 'Treibst du Sport' },
    { de: 'Ich gehe zweimal pro Woche ins Fitnessstudio.', ru: 'Я хожу в спортзал два раза в неделю.', note: 'zweimal pro Woche — дважды в неделю', audio: 'Ich gehe zweimal pro Woche ins Fitnessstudio' },
    { de: 'Ich jogge jeden Morgen im Park.',     ru: 'Я бегаю каждое утро в парке.',     note: 'joggen — бегать трусцой', audio: 'Ich jogge jeden Morgen im Park' },
    { de: 'Er spielt seit fünf Jahren Fußball.', ru: 'Он играет в футбол пять лет.',     note: 'seit + Dativ — с (о времени)', audio: 'Er spielt seit fünf Jahren Fußball' },
    { de: 'Welche Sportart magst du?',           ru: 'Какой вид спорта тебе нравится?',  note: 'die Sportart — вид спорта', audio: 'Welche Sportart magst du' },
    { de: 'Ich schwimme lieber als ich laufe.',  ru: 'Я больше люблю плавать, чем бегать.', note: 'lieber als — охотнее чем', audio: 'Ich schwimme lieber als ich laufe' },
    { de: 'Wir haben das Spiel gewonnen!',       ru: 'Мы выиграли матч!',                note: 'gewinnen → gewonnen', audio: 'Wir haben das Spiel gewonnen' },
    { de: 'Unsere Mannschaft hat verloren.',     ru: 'Наша команда проиграла.',          note: 'verlieren → verloren; die Mannschaft — команда', audio: 'Unsere Mannschaft hat verloren' },
    { de: 'Das Training beginnt um sieben Uhr.', ru: 'Тренировка начинается в семь.',    note: 'das Training — тренировка', audio: 'Das Training beginnt um sieben Uhr' },
    { de: 'Ich muss mich vor dem Sport aufwärmen.', ru: 'Мне нужно размяться перед спортом.', note: 'sich aufwärmen — разминаться', audio: 'Ich muss mich vor dem Sport aufwärmen' },
    { de: 'Bewegung ist gesund.',                ru: 'Движение полезно для здоровья.',   note: 'die Bewegung — движение; gesund — здоровый', audio: 'Bewegung ist gesund' },
    { de: 'Ich habe mir das Bein verletzt.',     ru: 'Я повредил ногу.',                 note: 'sich verletzen — травмироваться', audio: 'Ich habe mir das Bein verletzt' },
    { de: 'Nach dem Training bin ich erschöpft.', ru: 'После тренировки я без сил.',     note: 'erschöpft — измотанный', audio: 'Nach dem Training bin ich erschöpft' },
    { de: 'Fährst du gern Ski?',                 ru: 'Ты любишь кататься на лыжах?',     note: 'Ski fahren — кататься на лыжах', audio: 'Fährst du gern Ski' },
    { de: 'Im Sommer fahre ich viel Rad.',       ru: 'Летом я много езжу на велосипеде.', note: 'Rad fahren — ездить на велосипеде', audio: 'Im Sommer fahre ich viel Rad' },
    { de: 'Der Trainer gibt uns gute Tipps.',    ru: 'Тренер даёт нам хорошие советы.',  note: 'der Trainer — тренер; der Tipp — совет', audio: 'Der Trainer gibt uns gute Tipps' }
  ],

  vocabulary: [
    { de: 'der Sport',         ru: 'спорт',              ipa: '[ʃpɔʁt]',            article: 'der' },
    { de: 'die Sportart',      ru: 'вид спорта',         ipa: '[ˈʃpɔʁtˌʔaːɐ̯t]',    article: 'die' },
    { de: 'das Fitnessstudio', ru: 'спортзал',           ipa: '[ˈfɪtnəsˌʃtuːdi̯o]', article: 'das' },
    { de: 'das Training',      ru: 'тренировка',         ipa: '[ˈtʁɛːnɪŋ]',         article: 'das' },
    { de: 'die Mannschaft',    ru: 'команда',            ipa: '[ˈmanʃaft]',         article: 'die' },
    { de: 'das Spiel',         ru: 'игра, матч',         ipa: '[ʃpiːl]',            article: 'das' },
    { de: 'der Trainer',       ru: 'тренер',             ipa: '[ˈtʁɛːnɐ]',          article: 'der' },
    { de: 'die Bewegung',      ru: 'движение',           ipa: '[bəˈveːɡʊŋ]',        article: 'die' },
    { de: 'der Fußball',       ru: 'футбол',             ipa: '[ˈfuːsˌbal]',        article: 'der' },
    { de: 'das Schwimmbad',    ru: 'бассейн',            ipa: '[ˈʃvɪmˌbaːt]',       article: 'das' },
    { de: 'joggen',            ru: 'бегать трусцой',     ipa: '[ˈdʒɔɡn̩]',          article: '' },
    { de: 'schwimmen',         ru: 'плавать',            ipa: '[ˈʃvɪmən]',          article: '' },
    { de: 'gewinnen',          ru: 'выигрывать',         ipa: '[ɡəˈvɪnən]',         article: '' },
    { de: 'verlieren',         ru: 'проигрывать',        ipa: '[fɛɐ̯ˈliːʁən]',      article: '' },
    { de: 'trainieren',        ru: 'тренироваться',      ipa: '[tʁɛˈniːʁən]',       article: '' },
    { de: 'sich aufwärmen',    ru: 'разминаться',        ipa: '[zɪç ˈaʊ̯fˌvɛʁmən]', article: '' },
    { de: 'sich verletzen',    ru: 'травмироваться',     ipa: '[zɪç fɛɐ̯ˈlɛtsn̩]',  article: '' },
    { de: 'gesund',            ru: 'здоровый',           ipa: '[ɡəˈzʊnt]',          article: '' },
    { de: 'erschöpft',         ru: 'измотанный',         ipa: '[ɛɐ̯ˈʃœpft]',        article: '' },
    { de: 'fit',               ru: 'в форме',            ipa: '[fɪt]',              article: '' }
  ],

  grammar: [
    {
      title: '⚡ Спортивные конструкции: spielen, fahren, gehen',
      body: 'Разные виды спорта требуют разных глаголов:<br><br>' +
            '<strong>spielen</strong> + игра: <em>Fußball/Tennis spielen</em><br>' +
            '<strong>fahren</strong> + средство: <em>Ski/Rad fahren</em><br>' +
            '<strong>gehen</strong> + процесс: <em>schwimmen/joggen gehen</em> — ходить плавать/бегать',
      conjugation: [
        { pronoun: 'футбол',    form: 'Ich spiele Fußball.',      audio: 'Ich spiele Fußball',      translation: 'Я играю в футбол.' },
        { pronoun: 'теннис',    form: 'Sie spielt Tennis.',       audio: 'Sie spielt Tennis',       translation: 'Она играет в теннис.' },
        { pronoun: 'лыжи',      form: 'Wir fahren Ski.',          audio: 'Wir fahren Ski',          translation: 'Мы катаемся на лыжах.' },
        { pronoun: 'велосипед', form: 'Er fährt gern Rad.',       audio: 'Er fährt gern Rad',       translation: 'Он любит ездить на велосипеде.' },
        { pronoun: 'плавание',  form: 'Ich gehe schwimmen.',      audio: 'Ich gehe schwimmen',      translation: 'Я иду плавать.' }
      ]
    },
    {
      title: '⚡ seit + Dativ — «уже … как»',
      body: '<strong>seit</strong> показывает, как давно длится действие (глагол — в настоящем времени!):<br><br>' +
            '<em>Er spielt <strong>seit fünf Jahren</strong> Fußball.</em> — Он играет в футбол (уже) пять лет.<br>' +
            '<em>Ich lerne <strong>seit einem Monat</strong> Deutsch.</em> — Я учу немецкий уже месяц.',
      conjugation: [
        { pronoun: 'годы',    form: 'seit fünf Jahren',   audio: 'seit fünf Jahren',   translation: 'уже пять лет' },
        { pronoun: 'месяц',   form: 'seit einem Monat',   audio: 'seit einem Monat',   translation: 'уже месяц' },
        { pronoun: 'неделя',  form: 'seit einer Woche',   audio: 'seit einer Woche',   translation: 'уже неделю' },
        { pronoun: 'детство', form: 'seit meiner Kindheit', audio: 'seit meiner Kindheit', translation: 'с детства' }
      ]
    },
    {
      title: '💡 gewinnen / verlieren в Perfekt',
      body: 'Оба глагола — сильные, Perfekt с haben:<br><br>' +
            '<em>Wir haben das Spiel <strong>gewonnen</strong>!</em> — Мы выиграли матч!<br>' +
            '<em>Die Mannschaft hat <strong>verloren</strong>.</em> — Команда проиграла.<br><br>' +
            'Запомни пару: <em>gewinnen → gewonnen, verlieren → verloren</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '—',                      blank: 'Treibst',    after: 'du Sport?',                translation: '— Ты занимаешься спортом?',           hintWord: 'Treibst',    hintRule: 'Sport treiben' },
      { before: '— Ich gehe ins',         blank: 'Fitnessstudio', after: '.',                     translation: '— Я хожу в спортзал.',                hintWord: 'Fitnessstudio', hintRule: 'das Fitnessstudio' },
      { before: '— Er spielt',            blank: 'seit',       after: 'fünf Jahren Fußball.',     translation: '— Он играет в футбол уже пять лет.',  hintWord: 'seit',       hintRule: 'seit + Dativ — уже как' },
      { before: '— Wir haben das Spiel',  blank: 'gewonnen',   after: '!',                        translation: '— Мы выиграли матч!',                 hintWord: 'gewonnen',   hintRule: 'gewinnen → gewonnen' },
      { before: '— Unsere Mannschaft hat', blank: 'verloren',  after: '.',                        translation: '— Наша команда проиграла.',           hintWord: 'verloren',   hintRule: 'verlieren → verloren' },
      { before: '— Bewegung ist',         blank: 'gesund',     after: '.',                        translation: '— Движение полезно для здоровья.',    hintWord: 'gesund',     hintRule: 'gesund — здоровый' },
      { before: '— Im Winter fahre ich',  blank: 'Ski',        after: '.',                        translation: '— Зимой я катаюсь на лыжах.',         hintWord: 'Ski',        hintRule: 'Ski fahren' },
      { before: '— Nach dem Training bin ich', blank: 'erschöpft', after: '.',                    translation: '— После тренировки я без сил.',       hintWord: 'erschöpft',  hintRule: 'erschöpft — измотанный' }
    ],

    multipleChoice: [
      { question: '«Заниматься спортом» по-немецки…',          options: ['Sport machen gehen', 'Sport treiben', 'Sport arbeiten', 'Sport tun'], correctIndex: 1 },
      { question: 'С каким глаголом «кататься на лыжах»?',     options: ['spielen', 'fahren', 'gehen', 'laufen'],                       correctIndex: 1 },
      { question: '«Gewinnen» значит…',                        options: ['проигрывать', 'выигрывать', 'тренироваться', 'играть'],       correctIndex: 1 },
      { question: 'Perfekt от «verlieren»…',                   options: ['verliert', 'verloren', 'geverliert', 'verlieren'],            correctIndex: 1 },
      { question: '«Die Mannschaft» — это…',                   options: ['мужчина', 'команда', 'тренировка', 'стадион'],                correctIndex: 1 },
      { question: '«Seit fünf Jahren» — глагол стоит в…',      options: ['Perfekt', 'настоящем времени', 'будущем', 'Präteritum'],      correctIndex: 1 },
      { question: '«Sich aufwärmen» значит…',                  options: ['согреваться дома', 'разминаться', 'отдыхать', 'потеть'],      correctIndex: 1 },
      { question: '«Erschöpft» значит…',                       options: ['бодрый', 'измотанный', 'сильный', 'здоровый'],                correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Mannschaft',   ru: 'команда' },
      { id: 2, de: 'das Training',     ru: 'тренировка' },
      { id: 3, de: 'gewinnen',         ru: 'выигрывать' },
      { id: 4, de: 'verlieren',        ru: 'проигрывать' },
      { id: 5, de: 'schwimmen',        ru: 'плавать' },
      { id: 6, de: 'die Bewegung',     ru: 'движение' },
      { id: 7, de: 'gesund',           ru: 'здоровый' },
      { id: 8, de: 'der Trainer',      ru: 'тренер' }
    ],

    dictation: [
      { word: 'Sport',       audio: 'Sport' },
      { word: 'Training',    audio: 'Training' },
      { word: 'Mannschaft',  audio: 'Mannschaft' },
      { word: 'schwimmen',   audio: 'schwimmen' },
      { word: 'gewinnen',    audio: 'gewinnen' },
      { word: 'verlieren',   audio: 'verlieren' },
      { word: 'gesund',      audio: 'gesund' },
      { word: 'Fußball',     audio: 'Fußball' }
    ]
  }
};
