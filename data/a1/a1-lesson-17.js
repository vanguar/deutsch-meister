/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-17.js
   A1 · Урок 17: Modalverben — Модальные глаголы
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-17',
  level: 'A1',
  unit:  17,
  title: 'Modalverben',
  subtitle: 'Модальные глаголы: können, müssen, wollen',

  meta: {
    duration: '30 мин',
    wordCount: 18,
    xpReward: 100
  },

  phrases: [
    { de: 'Ich kann schwimmen.',                 ru: 'Я умею плавать.',                 note: 'können — мочь, уметь', audio: 'Ich kann schwimmen' },
    { de: 'Kannst du mir helfen?',               ru: 'Ты можешь мне помочь?',           note: 'helfen — помогать (+ Dativ)', audio: 'Kannst du mir helfen' },
    { de: 'Ich muss jetzt gehen.',               ru: 'Мне нужно идти.',                 note: 'müssen — быть должным', audio: 'Ich muss jetzt gehen' },
    { de: 'Wir müssen Deutsch lernen.',          ru: 'Нам нужно учить немецкий.',       note: 'смысловой глагол — в конце!', audio: 'Wir müssen Deutsch lernen' },
    { de: 'Ich will nach Deutschland fahren.',   ru: 'Я хочу поехать в Германию.',      note: 'wollen — хотеть (сильное желание)', audio: 'Ich will nach Deutschland fahren' },
    { de: 'Was willst du werden?',               ru: 'Кем ты хочешь стать?',            note: 'wollen + werden', audio: 'Was willst du werden' },
    { de: 'Er kann gut kochen.',                 ru: 'Он хорошо умеет готовить.',       note: 'können + инфинитив в конце', audio: 'Er kann gut kochen' },
    { de: 'Hier darf man nicht rauchen.',        ru: 'Здесь нельзя курить.',            note: 'dürfen — иметь разрешение; man — безличное', audio: 'Hier darf man nicht rauchen' },
    { de: 'Darf ich reinkommen?',                ru: 'Можно войти?',                    note: 'Darf ich…? — можно мне…?', audio: 'Darf ich reinkommen' },
    { de: 'Du sollst deine Hausaufgaben machen.', ru: 'Ты должен сделать домашнее задание.', note: 'sollen — следовать (чужая воля)', audio: 'Du sollst deine Hausaufgaben machen' },
    { de: 'Ich kann heute leider nicht kommen.', ru: 'К сожалению, я сегодня не могу прийти.', note: 'leider — к сожалению', audio: 'Ich kann heute leider nicht kommen' },
    { de: 'Musst du morgen arbeiten?',           ru: 'Тебе завтра нужно работать?',     note: 'вопрос: модальный глагол на 1-м месте', audio: 'Musst du morgen arbeiten' },
    { de: 'Sie will Ärztin werden.',             ru: 'Она хочет стать врачом.',         note: 'wollen + профессия + werden', audio: 'Sie will Ärztin werden' },
    { de: 'Man kann hier gut essen.',            ru: 'Здесь можно хорошо поесть.',      note: 'man kann — можно', audio: 'Man kann hier gut essen' },
    { de: 'Ich möchte etwas fragen.',            ru: 'Я хотел бы кое-что спросить.',    note: 'möchten — вежливая форма wollen', audio: 'Ich möchte etwas fragen' },
    { de: 'Kinder müssen früh schlafen gehen.',  ru: 'Детям нужно рано ложиться спать.', note: 'früh — рано', audio: 'Kinder müssen früh schlafen gehen' }
  ],

  vocabulary: [
    { de: 'können',      ru: 'мочь, уметь',           ipa: '[ˈkœnən]',      article: '' },
    { de: 'müssen',      ru: 'быть должным',          ipa: '[ˈmʏsn̩]',      article: '' },
    { de: 'wollen',      ru: 'хотеть',                ipa: '[ˈvɔlən]',      article: '' },
    { de: 'dürfen',      ru: 'иметь разрешение',      ipa: '[ˈdʏʁfn̩]',     article: '' },
    { de: 'sollen',      ru: 'быть обязанным',        ipa: '[ˈzɔlən]',      article: '' },
    { de: 'möchten',     ru: 'хотел бы (вежливо)',    ipa: '[ˈmœçtn̩]',     article: '' },
    { de: 'helfen',      ru: 'помогать',              ipa: '[ˈhɛlfn̩]',     article: '' },
    { de: 'schwimmen',   ru: 'плавать',               ipa: '[ˈʃvɪmən]',     article: '' },
    { de: 'rauchen',     ru: 'курить',                ipa: '[ˈʁaʊ̯xn̩]',    article: '' },
    { de: 'lernen',      ru: 'учить',                 ipa: '[ˈlɛʁnən]',     article: '' },
    { de: 'fragen',      ru: 'спрашивать',            ipa: '[ˈfʁaːɡn̩]',    article: '' },
    { de: 'die Hausaufgabe', ru: 'домашнее задание',  ipa: '[ˈhaʊ̯sˌʔaʊ̯fɡaːbə]', article: 'die' },
    { de: 'man',         ru: 'безличное «кто-то»',    ipa: '[man]',         article: '' },
    { de: 'leider',      ru: 'к сожалению',           ipa: '[ˈlaɪ̯dɐ]',     article: '' },
    { de: 'früh',        ru: 'рано',                  ipa: '[fʁyː]',        article: '' },
    { de: 'spät',        ru: 'поздно',                ipa: '[ʃpɛːt]',       article: '' },
    { de: 'etwas',       ru: 'что-то, кое-что',       ipa: '[ˈɛtvas]',      article: '' },
    { de: 'jetzt',       ru: 'сейчас',                ipa: '[jɛtst]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ können — мочь, уметь',
      body: 'Модальный глагол стоит на <strong>2-м месте</strong>, а смысловой глагол — <strong>в конце</strong> предложения в инфинитиве:<br><br>' +
            '<em>Ich <strong>kann</strong> gut <strong>schwimmen</strong>.</em> — Я хорошо умею плавать.<br><br>' +
            '⚠️ Формы ich и er/sie/es совпадают и БЕЗ окончания: <em>ich kann, er kann</em>.',
      conjugation: [
        { pronoun: 'ich',           form: 'kann',    audio: 'ich kann',    translation: 'я могу' },
        { pronoun: 'du',            form: 'kannst',  audio: 'du kannst',   translation: 'ты можешь' },
        { pronoun: 'er / sie / es', form: 'kann',    audio: 'er kann',     translation: 'он/она может' },
        { pronoun: 'wir',           form: 'können',  audio: 'wir können',  translation: 'мы можем' },
        { pronoun: 'ihr',           form: 'könnt',   audio: 'ihr könnt',   translation: 'вы можете' },
        { pronoun: 'Sie / sie',     form: 'können',  audio: 'Sie können',  translation: 'Вы можете / они могут' }
      ]
    },
    {
      title: '⚡ müssen — быть должным',
      body: '<strong>müssen</strong> выражает необходимость:<br><br>' +
            '<em>Ich <strong>muss</strong> jetzt <strong>gehen</strong>.</em> — Мне нужно идти.<br>' +
            '<em>Wir <strong>müssen</strong> viel <strong>lernen</strong>.</em> — Нам нужно много учиться.',
      conjugation: [
        { pronoun: 'ich',           form: 'muss',    audio: 'ich muss',    translation: 'я должен' },
        { pronoun: 'du',            form: 'musst',   audio: 'du musst',    translation: 'ты должен' },
        { pronoun: 'er / sie / es', form: 'muss',    audio: 'er muss',     translation: 'он/она должен(на)' },
        { pronoun: 'wir',           form: 'müssen',  audio: 'wir müssen',  translation: 'мы должны' },
        { pronoun: 'ihr',           form: 'müsst',   audio: 'ihr müsst',   translation: 'вы должны' },
        { pronoun: 'Sie / sie',     form: 'müssen',  audio: 'Sie müssen',  translation: 'Вы должны / они должны' }
      ]
    },
    {
      title: '⚡ wollen — хотеть',
      body: '<strong>wollen</strong> — сильное желание или намерение:<br><br>' +
            '<em>Ich <strong>will</strong> nach Deutschland <strong>fahren</strong>.</em> — Я хочу поехать в Германию.<br><br>' +
            'Вежливее использовать <strong>möchten</strong>: <em>Ich möchte…</em> — я хотел бы…',
      conjugation: [
        { pronoun: 'ich',           form: 'will',    audio: 'ich will',    translation: 'я хочу' },
        { pronoun: 'du',            form: 'willst',  audio: 'du willst',   translation: 'ты хочешь' },
        { pronoun: 'er / sie / es', form: 'will',    audio: 'er will',     translation: 'он/она хочет' },
        { pronoun: 'wir',           form: 'wollen',  audio: 'wir wollen',  translation: 'мы хотим' },
        { pronoun: 'ihr',           form: 'wollt',   audio: 'ihr wollt',   translation: 'вы хотите' },
        { pronoun: 'Sie / sie',     form: 'wollen',  audio: 'Sie wollen',  translation: 'Вы хотите / они хотят' }
      ]
    },
    {
      title: '💡 dürfen и man: что можно и что нельзя',
      body: '<strong>dürfen</strong> — разрешение:<br>' +
            '<em><strong>Darf</strong> ich reinkommen?</em> — Можно войти?<br><br>' +
            '<strong>man</strong> + модальный глагол — безличные правила:<br>' +
            '<em>Hier <strong>darf man</strong> nicht rauchen.</em> — Здесь нельзя курить.<br>' +
            '<em>Hier <strong>kann man</strong> gut essen.</em> — Здесь можно хорошо поесть.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich',              blank: 'kann',      after: 'schwimmen.',              translation: '— Я умею плавать.',                    hintWord: 'kann',      hintRule: 'ich → kann (без окончания)' },
      { before: '—',                  blank: 'Kannst',    after: 'du mir helfen?',          translation: '— Ты можешь мне помочь?',              hintWord: 'Kannst',    hintRule: 'du → kannst' },
      { before: '— Ich',              blank: 'muss',      after: 'jetzt gehen.',            translation: '— Мне нужно идти.',                    hintWord: 'muss',      hintRule: 'ich → muss' },
      { before: '— Er',               blank: 'will',      after: 'Arzt werden.',            translation: '— Он хочет стать врачом.',             hintWord: 'will',      hintRule: 'er → will (как ich)' },
      { before: '—',                  blank: 'Darf',      after: 'ich reinkommen?',         translation: '— Можно войти?',                       hintWord: 'Darf',      hintRule: 'Darf ich…? — можно мне…?' },
      { before: '— Hier darf man nicht', blank: 'rauchen', after: '.',                      translation: '— Здесь нельзя курить.',               hintWord: 'rauchen',   hintRule: 'смысловой глагол в конце' },
      { before: '— Wir',              blank: 'müssen',    after: 'Deutsch lernen.',         translation: '— Нам нужно учить немецкий.',          hintWord: 'müssen',    hintRule: 'wir → müssen' },
      { before: '— Ich möchte etwas', blank: 'fragen',    after: '.',                       translation: '— Я хотел бы кое-что спросить.',       hintWord: 'fragen',    hintRule: 'инфинитив в конце' }
    ],

    multipleChoice: [
      { question: '«Können» означает…',                        options: ['хотеть', 'мочь, уметь', 'быть должным', 'разрешать'],        correctIndex: 1 },
      { question: 'Форма müssen для «ich»…',                   options: ['müsse', 'muss', 'musst', 'müssen'],                          correctIndex: 1 },
      { question: 'Где стоит смысловой глагол при модальном?',  options: ['на 1-м месте', 'на 2-м месте', 'в конце предложения', 'где угодно'], correctIndex: 2 },
      { question: '«Hier darf man nicht rauchen» значит…',     options: ['Здесь можно курить', 'Здесь нельзя курить', 'Здесь все курят', 'Здесь нет курящих'], correctIndex: 1 },
      { question: 'Вежливая форма «хочу»…',                    options: ['ich will', 'ich möchte', 'ich muss', 'ich kann'],            correctIndex: 1 },
      { question: '«Man kann hier gut essen» значит…',         options: ['Мужчина хорошо ест', 'Здесь можно хорошо поесть', 'Все должны есть', 'Он умеет готовить'], correctIndex: 1 },
      { question: 'Форма wollen для «du»…',                    options: ['willst', 'wollst', 'will', 'wollt'],                         correctIndex: 0 },
      { question: '«Sollen» выражает…',                        options: ['умение', 'желание', 'чужую волю, поручение', 'разрешение'],  correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'können',       ru: 'мочь, уметь' },
      { id: 2, de: 'müssen',       ru: 'быть должным' },
      { id: 3, de: 'wollen',       ru: 'хотеть' },
      { id: 4, de: 'dürfen',       ru: 'иметь разрешение' },
      { id: 5, de: 'möchten',      ru: 'хотел бы (вежливо)' },
      { id: 6, de: 'helfen',       ru: 'помогать' },
      { id: 7, de: 'leider',       ru: 'к сожалению' },
      { id: 8, de: 'etwas',        ru: 'что-то' }
    ],

    dictation: [
      { word: 'können',    audio: 'können' },
      { word: 'müssen',    audio: 'müssen' },
      { word: 'wollen',    audio: 'wollen' },
      { word: 'dürfen',    audio: 'dürfen' },
      { word: 'helfen',    audio: 'helfen' },
      { word: 'lernen',    audio: 'lernen' },
      { word: 'schwimmen', audio: 'schwimmen' },
      { word: 'fragen',    audio: 'fragen' }
    ]
  }
};
