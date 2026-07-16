/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-19.js
   A2 · Урок 19: Zukunftspläne — Планы на будущее
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-19',
  level: 'A2',
  unit:  19,
  title: 'Zukunftspläne',
  subtitle: 'Планы на будущее · Futur I',

  meta: {
    duration: '30–35 мин',
    wordCount: 18,
    xpReward: 120
  },

  phrases: [
    { de: 'Was sind deine Pläne für die Zukunft?', ru: 'Какие у тебя планы на будущее?', note: 'der Plan → die Pläne; die Zukunft — будущее', audio: 'Was sind deine Pläne für die Zukunft' },
    { de: 'Ich werde nächstes Jahr nach Deutschland ziehen.', ru: 'В следующем году я перееду в Германию.', note: 'werden + Infinitiv = Futur I; ziehen — переезжать', audio: 'Ich werde nächstes Jahr nach Deutschland ziehen' },
    { de: 'Ich habe vor, Deutsch zu lernen.',    ru: 'Я планирую учить немецкий.',       note: 'vorhaben + zu + Infinitiv — планировать', audio: 'Ich habe vor, Deutsch zu lernen' },
    { de: 'Nächste Woche beginne ich einen Sprachkurs.', ru: 'На следующей неделе я начинаю языковой курс.', note: 'о планах часто говорят в настоящем!', audio: 'Nächste Woche beginne ich einen Sprachkurs' },
    { de: 'Er wird bestimmt Erfolg haben.',      ru: 'Он обязательно добьётся успеха.',  note: 'bestimmt — обязательно; der Erfolg — успех', audio: 'Er wird bestimmt Erfolg haben' },
    { de: 'Wir wollen ein Haus kaufen.',         ru: 'Мы хотим купить дом.',             note: 'wollen — намерение', audio: 'Wir wollen ein Haus kaufen' },
    { de: 'Ich möchte eine neue Sprache lernen.', ru: 'Я хотел бы выучить новый язык.',  note: 'die Sprache — язык', audio: 'Ich möchte eine neue Sprache lernen' },
    { de: 'Vielleicht mache ich eine Weltreise.', ru: 'Может быть, я отправлюсь в кругосветное путешествие.', note: 'vielleicht — может быть', audio: 'Vielleicht mache ich eine Weltreise' },
    { de: 'Ich träume von einem eigenen Café.',  ru: 'Я мечтаю о собственном кафе.',     note: 'träumen von + Dativ — мечтать о', audio: 'Ich träume von einem eigenen Café' },
    { de: 'Was wirst du nach dem Studium machen?', ru: 'Что ты будешь делать после учёбы?', note: 'nach dem Studium — после учёбы', audio: 'Was wirst du nach dem Studium machen' },
    { de: 'Ich hoffe, einen guten Job zu finden.', ru: 'Надеюсь найти хорошую работу.',  note: 'hoffen + zu + Infinitiv', audio: 'Ich hoffe, einen guten Job zu finden' },
    { de: 'In fünf Jahren spreche ich fließend Deutsch.', ru: 'Через пять лет я буду свободно говорить по-немецки.', note: 'in fünf Jahren — через 5 лет; fließend — свободно', audio: 'In fünf Jahren spreche ich fließend Deutsch' },
    { de: 'Es wird bald regnen.',                ru: 'Скоро пойдёт дождь.',              note: 'Futur I для предсказаний; bald — скоро', audio: 'Es wird bald regnen' },
    { de: 'Alles wird gut werden.',              ru: 'Всё будет хорошо.',                note: 'werden дважды: вспомогательный + смысловой', audio: 'Alles wird gut werden' },
    { de: 'Ich plane, im Sommer zu heiraten.',   ru: 'Я планирую летом жениться.',       note: 'planen + zu; heiraten — жениться', audio: 'Ich plane, im Sommer zu heiraten' },
    { de: 'Mein Ziel ist es, B2 zu erreichen.',  ru: 'Моя цель — достичь уровня B2.',    note: 'das Ziel — цель; erreichen — достигать', audio: 'Mein Ziel ist es, B2 zu erreichen' }
  ],

  vocabulary: [
    { de: 'die Zukunft',     ru: 'будущее',            ipa: '[ˈtsuːkʊnft]',      article: 'die' },
    { de: 'der Plan',        ru: 'план',               ipa: '[plaːn]',           article: 'der' },
    { de: 'das Ziel',        ru: 'цель',               ipa: '[tsiːl]',           article: 'das' },
    { de: 'der Traum',       ru: 'мечта, сон',         ipa: '[tʁaʊ̯m]',          article: 'der' },
    { de: 'der Erfolg',      ru: 'успех',              ipa: '[ɛɐ̯ˈfɔlk]',        article: 'der' },
    { de: 'die Sprache',     ru: 'язык',               ipa: '[ˈʃpʁaːxə]',        article: 'die' },
    { de: 'das Studium',     ru: 'учёба в вузе',       ipa: '[ˈʃtuːdi̯ʊm]',      article: 'das' },
    { de: 'die Weltreise',   ru: 'кругосветное путешествие', ipa: '[ˈvɛltˌʁaɪ̯zə]', article: 'die' },
    { de: 'werden',          ru: 'становиться; буду',  ipa: '[ˈveːɐ̯dn̩]',       article: '' },
    { de: 'vorhaben',        ru: 'планировать',        ipa: '[ˈfoːɐ̯ˌhaːbn̩]',   article: '' },
    { de: 'planen',          ru: 'планировать',        ipa: '[ˈplaːnən]',        article: '' },
    { de: 'hoffen',          ru: 'надеяться',          ipa: '[ˈhɔfn̩]',          article: '' },
    { de: 'träumen',         ru: 'мечтать',            ipa: '[ˈtʁɔɪ̯mən]',       article: '' },
    { de: 'erreichen',       ru: 'достигать',          ipa: '[ɛɐ̯ˈʁaɪ̯çn̩]',     article: '' },
    { de: 'ziehen',          ru: 'переезжать',         ipa: '[ˈtsiːən]',         article: '' },
    { de: 'heiraten',        ru: 'жениться',           ipa: '[ˈhaɪ̯ʁaːtn̩]',     article: '' },
    { de: 'vielleicht',      ru: 'может быть',         ipa: '[fiˈlaɪ̯çt]',       article: '' },
    { de: 'bestimmt',        ru: 'обязательно',        ipa: '[bəˈʃtɪmt]',        article: '' },
    { de: 'bald',            ru: 'скоро',              ipa: '[balt]',            article: '' },
    { de: 'fließend',        ru: 'свободно (о языке)', ipa: '[ˈfliːsn̩t]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ Futur I: werden + Infinitiv',
      body: 'Будущее время = <strong>werden</strong> (на 2-м месте) + инфинитив (в конце):<br><br>' +
            '<em>Ich <strong>werde</strong> nach Deutschland <strong>ziehen</strong>.</em> — Я перееду в Германию.<br>' +
            '<em>Es <strong>wird</strong> bald <strong>regnen</strong>.</em> — Скоро пойдёт дождь.',
      conjugation: [
        { pronoun: 'ich',           form: 'werde',   audio: 'ich werde',   translation: 'я буду' },
        { pronoun: 'du',            form: 'wirst',   audio: 'du wirst',    translation: 'ты будешь' },
        { pronoun: 'er / sie / es', form: 'wird',    audio: 'er wird',     translation: 'он/она будет' },
        { pronoun: 'wir',           form: 'werden',  audio: 'wir werden',  translation: 'мы будем' },
        { pronoun: 'ihr',           form: 'werdet',  audio: 'ihr werdet',  translation: 'вы будете' },
        { pronoun: 'Sie / sie',     form: 'werden',  audio: 'Sie werden',  translation: 'Вы будете / они будут' }
      ]
    },
    {
      title: '⚡ Настоящее время для будущего',
      body: 'Немцы чаще говорят о планах в <strong>настоящем времени</strong> + слово-указатель:<br><br>' +
            '<em><strong>Morgen</strong> fahre ich nach Berlin.</em> — Завтра я еду в Берлин.<br>' +
            '<em><strong>Nächste Woche</strong> beginne ich den Kurs.</em> — На следующей неделе начинаю курс.<br><br>' +
            'Futur I нужен для обещаний и предсказаний.',
      conjugation: [
        { pronoun: 'завтра',       form: 'morgen',           audio: 'morgen',           translation: 'завтра' },
        { pronoun: 'на след. неделе', form: 'nächste Woche', audio: 'nächste Woche',    translation: 'на следующей неделе' },
        { pronoun: 'в след. году', form: 'nächstes Jahr',    audio: 'nächstes Jahr',    translation: 'в следующем году' },
        { pronoun: 'через 5 лет',  form: 'in fünf Jahren',   audio: 'in fünf Jahren',   translation: 'через пять лет' },
        { pronoun: 'скоро',        form: 'bald',             audio: 'bald',             translation: 'скоро' }
      ]
    },
    {
      title: '💡 Планы: vorhaben, planen, hoffen + zu',
      body: 'Глаголы намерения соединяются с действием через <strong>zu + Infinitiv</strong>:<br><br>' +
            '<em>Ich habe vor, Deutsch <strong>zu lernen</strong>.</em> — Я планирую учить немецкий.<br>' +
            '<em>Ich hoffe, einen Job <strong>zu finden</strong>.</em> — Надеюсь найти работу.<br>' +
            '<em>Ich träume davon, ein Café <strong>zu eröffnen</strong>.</em> — Мечтаю открыть кафе.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich',                  blank: 'werde',      after: 'nächstes Jahr umziehen.', translation: '— В следующем году я перееду.',       hintWord: 'werde',      hintRule: 'ich → werde' },
      { before: '— Er',                   blank: 'wird',       after: 'bestimmt Erfolg haben.',  translation: '— Он обязательно добьётся успеха.',   hintWord: 'wird',       hintRule: 'er → wird' },
      { before: '— Ich habe vor, Deutsch', blank: 'zu',        after: 'lernen.',                 translation: '— Я планирую учить немецкий.',        hintWord: 'zu',         hintRule: 'vorhaben + zu + Infinitiv' },
      { before: '— Was sind deine Pläne für die', blank: 'Zukunft', after: '?',                  translation: '— Какие у тебя планы на будущее?',    hintWord: 'Zukunft',    hintRule: 'die Zukunft — будущее' },
      { before: '— Ich träume',           blank: 'von',        after: 'einem eigenen Café.',     translation: '— Я мечтаю о собственном кафе.',      hintWord: 'von',        hintRule: 'träumen von + Dativ' },
      { before: '— Es wird bald',         blank: 'regnen',     after: '.',                       translation: '— Скоро пойдёт дождь.',               hintWord: 'regnen',     hintRule: 'Futur I: инфинитив в конце' },
      { before: '— Mein',                 blank: 'Ziel',       after: 'ist es, B2 zu erreichen.', translation: '— Моя цель — достичь B2.',           hintWord: 'Ziel',       hintRule: 'das Ziel — цель' },
      { before: '— In fünf Jahren spreche ich', blank: 'fließend', after: 'Deutsch.',            translation: '— Через 5 лет я буду свободно говорить.', hintWord: 'fließend', hintRule: 'fließend — свободно' }
    ],

    multipleChoice: [
      { question: 'Futur I образуется с помощью…',             options: ['haben + Infinitiv', 'werden + Infinitiv', 'sein + Infinitiv', 'wollen + Partizip'], correctIndex: 1 },
      { question: 'Форма werden для «du»…',                    options: ['werdest', 'wirst', 'wird', 'werdet'],                         correctIndex: 1 },
      { question: '«Vorhaben» значит…',                        options: ['мечтать', 'планировать', 'надеяться', 'обещать'],             correctIndex: 1 },
      { question: '«Träumen» используется с предлогом…',       options: ['an', 'von', 'über', 'für'],                                   correctIndex: 1 },
      { question: '«Morgen fahre ich nach Berlin» — время…',   options: ['прошедшее', 'настоящее (о будущем)', 'Futur I', 'Perfekt'],   correctIndex: 1 },
      { question: '«Die Zukunft» — это…',                      options: ['прошлое', 'настоящее', 'будущее', 'мечта'],                   correctIndex: 2 },
      { question: '«Erreichen» значит…',                       options: ['стараться', 'достигать', 'начинать', 'заканчивать'],          correctIndex: 1 },
      { question: '«Fließend Deutsch sprechen» значит…',       options: ['говорить с ошибками', 'говорить свободно', 'говорить быстро', 'понимать немецкий'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Zukunft',   ru: 'будущее' },
      { id: 2, de: 'das Ziel',      ru: 'цель' },
      { id: 3, de: 'der Traum',     ru: 'мечта' },
      { id: 4, de: 'der Erfolg',    ru: 'успех' },
      { id: 5, de: 'hoffen',        ru: 'надеяться' },
      { id: 6, de: 'erreichen',     ru: 'достигать' },
      { id: 7, de: 'vielleicht',    ru: 'может быть' },
      { id: 8, de: 'bald',          ru: 'скоро' }
    ],

    dictation: [
      { word: 'Zukunft',     audio: 'Zukunft' },
      { word: 'Ziel',        audio: 'Ziel' },
      { word: 'Erfolg',      audio: 'Erfolg' },
      { word: 'werden',      audio: 'werden' },
      { word: 'hoffen',      audio: 'hoffen' },
      { word: 'träumen',     audio: 'träumen' },
      { word: 'vielleicht',  audio: 'vielleicht' },
      { word: 'fließend',    audio: 'fließend' }
    ]
  }
};
