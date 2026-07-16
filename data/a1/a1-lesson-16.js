/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-16.js
   A1 · Урок 16: Zahlen bis 100 — Числа до 100 и цены
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-16',
  level: 'A1',
  unit:  16,
  title: 'Zahlen bis 100',
  subtitle: 'Числа до 100 и цены',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Einundzwanzig, zweiundzwanzig…',      ru: 'Двадцать один, двадцать два…',      note: 'единицы ПЕРЕД десятками: ein+und+zwanzig', audio: 'Einundzwanzig, zweiundzwanzig' },
    { de: 'Ich bin dreißig Jahre alt.',          ru: 'Мне тридцать лет.',                 note: 'Jahre alt — лет (о возрасте)', audio: 'Ich bin dreißig Jahre alt' },
    { de: 'Wie alt bist du?',                    ru: 'Сколько тебе лет?',                 note: 'wie alt — сколько лет', audio: 'Wie alt bist du' },
    { de: 'Das kostet fünfzig Euro.',            ru: 'Это стоит пятьдесят евро.',         note: 'der Euro — евро', audio: 'Das kostet fünfzig Euro' },
    { de: 'Meine Telefonnummer ist null-eins-fünf-neun.', ru: 'Мой номер телефона 0159.', note: 'номера называют по цифрам', audio: 'Meine Telefonnummer ist null-eins-fünf-neun' },
    { de: 'Ich wohne in der Hausnummer vierzehn.', ru: 'Я живу в доме номер четырнадцать.', note: 'die Hausnummer — номер дома', audio: 'Ich wohne in der Hausnummer vierzehn' },
    { de: 'Das macht zusammen neunzehn Euro.',   ru: 'Итого девятнадцать евро.',          note: 'zusammen — вместе, итого', audio: 'Das macht zusammen neunzehn Euro' },
    { de: 'Hundert Prozent!',                    ru: 'Сто процентов!',                    note: 'das Prozent — процент', audio: 'Hundert Prozent' },
    { de: 'Ich habe zwei Brüder und eine Schwester.', ru: 'У меня два брата и одна сестра.', note: 'числа с существительными', audio: 'Ich habe zwei Brüder und eine Schwester' },
    { de: 'Der Bus Nummer fünfundvierzig fährt zum Zentrum.', ru: 'Автобус номер сорок пять едет в центр.', note: 'fünf+und+vierzig = 45', audio: 'Der Bus Nummer fünfundvierzig fährt zum Zentrum' },
    { de: 'Ein Kilo kostet drei Euro neunzig.',  ru: 'Килограмм стоит три евро девяносто.', note: 'цены: Euro + центы без слова Cent', audio: 'Ein Kilo kostet drei Euro neunzig' },
    { de: 'Kannst du bis hundert zählen?',       ru: 'Ты умеешь считать до ста?',         note: 'zählen — считать; bis — до', audio: 'Kannst du bis hundert zählen' },
    { de: 'Ich brauche sechzig Minuten.',        ru: 'Мне нужно шестьдесят минут.',       note: 'die Minute → die Minuten', audio: 'Ich brauche sechzig Minuten' },
    { de: 'Wir sind zu viert.',                  ru: 'Нас четверо.',                      note: 'zu viert — вчетвером', audio: 'Wir sind zu viert' },
    { de: 'Das ist mein achtes Buch.',           ru: 'Это моя восьмая книга.',            note: 'achte — восьмой (порядковое)', audio: 'Das ist mein achtes Buch' },
    { de: 'Fünfzig plus fünfzig ist hundert.',   ru: 'Пятьдесят плюс пятьдесят — сто.',   note: 'plus — плюс; minus — минус', audio: 'Fünfzig plus fünfzig ist hundert' }
  ],

  vocabulary: [
    { de: 'zwanzig',        ru: 'двадцать',       ipa: '[ˈtsvantsɪç]',       article: '' },
    { de: 'einundzwanzig',  ru: 'двадцать один',  ipa: '[ˌaɪ̯nʊntˈtsvantsɪç]', article: '' },
    { de: 'dreißig',        ru: 'тридцать',       ipa: '[ˈdʁaɪ̯sɪç]',        article: '' },
    { de: 'vierzig',        ru: 'сорок',          ipa: '[ˈfɪʁtsɪç]',         article: '' },
    { de: 'fünfzig',        ru: 'пятьдесят',      ipa: '[ˈfʏnftsɪç]',        article: '' },
    { de: 'sechzig',        ru: 'шестьдесят',     ipa: '[ˈzɛçtsɪç]',         article: '' },
    { de: 'siebzig',        ru: 'семьдесят',      ipa: '[ˈziːptsɪç]',        article: '' },
    { de: 'achtzig',        ru: 'восемьдесят',    ipa: '[ˈaxtsɪç]',          article: '' },
    { de: 'neunzig',        ru: 'девяносто',      ipa: '[ˈnɔɪ̯ntsɪç]',       article: '' },
    { de: 'hundert',        ru: 'сто',            ipa: '[ˈhʊndɐt]',          article: '' },
    { de: 'die Zahl',       ru: 'число',          ipa: '[tsaːl]',            article: 'die' },
    { de: 'die Nummer',     ru: 'номер',          ipa: '[ˈnʊmɐ]',            article: 'die' },
    { de: 'der Euro',       ru: 'евро',           ipa: '[ˈɔɪ̯ʁo]',           article: 'der' },
    { de: 'der Cent',       ru: 'цент',           ipa: '[sɛnt]',             article: 'der' },
    { de: 'das Prozent',    ru: 'процент',        ipa: '[pʁoˈtsɛnt]',        article: 'das' },
    { de: 'zählen',         ru: 'считать',        ipa: '[ˈtsɛːlən]',         article: '' },
    { de: 'plus',           ru: 'плюс',           ipa: '[plʊs]',             article: '' },
    { de: 'minus',          ru: 'минус',          ipa: '[ˈmiːnʊs]',          article: '' },
    { de: 'alt',            ru: 'старый; о возрасте', ipa: '[alt]',          article: '' },
    { de: 'zusammen',       ru: 'вместе, итого',  ipa: '[tsuˈzamən]',        article: '' }
  ],

  grammar: [
    {
      title: '⚡ Числа 21–99: единицы ПЕРЕД десятками',
      body: 'Немцы называют числа «задом наперёд»: сначала единицы, потом десятки, соединяя их <strong>und</strong>:<br><br>' +
            '21 = <em>ein<strong>und</strong>zwanzig</em> (один-и-двадцать)<br>' +
            '35 = <em>fünf<strong>und</strong>dreißig</em> (пять-и-тридцать)<br>' +
            '99 = <em>neun<strong>und</strong>neunzig</em> (девять-и-девяносто)<br><br>' +
            '⚠️ 21: <em>ein</em>undzwanzig (не «eins»).',
      conjugation: [
        { pronoun: '21', form: 'einundzwanzig',   audio: 'einundzwanzig',   translation: 'двадцать один' },
        { pronoun: '32', form: 'zweiunddreißig',  audio: 'zweiunddreißig',  translation: 'тридцать два' },
        { pronoun: '47', form: 'siebenundvierzig', audio: 'siebenundvierzig', translation: 'сорок семь' },
        { pronoun: '58', form: 'achtundfünfzig',  audio: 'achtundfünfzig',  translation: 'пятьдесят восемь' },
        { pronoun: '76', form: 'sechsundsiebzig', audio: 'sechsundsiebzig', translation: 'семьдесят шесть' },
        { pronoun: '99', form: 'neunundneunzig',  audio: 'neunundneunzig',  translation: 'девяносто девять' }
      ]
    },
    {
      title: '⚡ Десятки: -zig',
      body: 'Десятки образуются суффиксом <strong>-zig</strong>. Запомни три исключения:<br><br>' +
            '<strong>dreißig</strong> — 30 (с -ßig!)<br>' +
            '<strong>sechzig</strong> — 60 (без -s: НЕ sechszig)<br>' +
            '<strong>siebzig</strong> — 70 (без -en: НЕ siebenzig)',
      conjugation: [
        { pronoun: '20', form: 'zwanzig',  audio: 'zwanzig',  translation: 'двадцать' },
        { pronoun: '30', form: 'dreißig',  audio: 'dreißig',  translation: 'тридцать (исключение: -ßig)' },
        { pronoun: '60', form: 'sechzig',  audio: 'sechzig',  translation: 'шестьдесят (без -s)' },
        { pronoun: '70', form: 'siebzig',  audio: 'siebzig',  translation: 'семьдесят (без -en)' },
        { pronoun: '100', form: 'hundert', audio: 'hundert',  translation: 'сто' }
      ]
    },
    {
      title: '💡 Цены: Euro и Cent',
      body: 'Цены называются просто:<br><br>' +
            '<em>3,90 € = drei Euro neunzig</em> (слово Cent обычно опускают)<br>' +
            '<em>0,50 € = fünfzig Cent</em><br><br>' +
            '<em>Das macht zusammen…</em> — «итого с вас…» (говорит продавец).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— 21 =',                  blank: 'einundzwanzig', after: '',                     translation: '— 21 = двадцать один.',              hintWord: 'einundzwanzig', hintRule: 'ein + und + zwanzig' },
      { before: '— Ich bin',               blank: 'dreißig',    after: 'Jahre alt.',              translation: '— Мне тридцать лет.',                hintWord: 'dreißig',    hintRule: '30 = dreißig (-ßig!)' },
      { before: '— Wie',                   blank: 'alt',        after: 'bist du?',                translation: '— Сколько тебе лет?',                hintWord: 'alt',        hintRule: 'wie alt — сколько лет' },
      { before: '— Das kostet',            blank: 'fünfzig',    after: 'Euro.',                   translation: '— Это стоит пятьдесят евро.',        hintWord: 'fünfzig',    hintRule: '50 = fünfzig' },
      { before: '— Kannst du bis hundert', blank: 'zählen',     after: '?',                       translation: '— Ты умеешь считать до ста?',        hintWord: 'zählen',     hintRule: 'zählen — считать' },
      { before: '— Das macht',             blank: 'zusammen',   after: 'neunzehn Euro.',          translation: '— Итого девятнадцать евро.',         hintWord: 'zusammen',   hintRule: 'zusammen — итого' },
      { before: '— 70 =',                  blank: 'siebzig',    after: '',                        translation: '— 70 = семьдесят.',                  hintWord: 'siebzig',    hintRule: 'siebzig — без -en' },
      { before: '— Fünfzig plus fünfzig ist', blank: 'hundert', after: '.',                       translation: '— Пятьдесят плюс пятьдесят — сто.',  hintWord: 'hundert',    hintRule: '100 = hundert' }
    ],

    multipleChoice: [
      { question: 'Как читается 21?',                          options: ['zwanzigeins', 'einundzwanzig', 'zweiundzwanzig', 'einzwanzig'], correctIndex: 1 },
      { question: '«Fünfundvierzig» — это…',                   options: ['54', '45', '55', '44'],                                      correctIndex: 1 },
      { question: 'Как правильно 30?',                         options: ['dreizig', 'dreißig', 'dreisig', 'drei-zig'],                 correctIndex: 1 },
      { question: 'Как правильно 60?',                         options: ['sechszig', 'sechzig', 'sechsig', 'seczig'],                  correctIndex: 1 },
      { question: 'Как правильно 70?',                         options: ['siebenzig', 'siebzig', 'siebenszig', 'siebe'],               correctIndex: 1 },
      { question: '«Wie alt bist du?» спрашивает о…',          options: ['имени', 'возрасте', 'адресе', 'работе'],                     correctIndex: 1 },
      { question: '3,90 € читается как…',                      options: ['drei Komma neun Euro', 'drei Euro neunzig', 'dreißig Euro neun', 'drei und neunzig'], correctIndex: 1 },
      { question: '«Neunundneunzig» — это…',                   options: ['89', '98', '99', '90'],                                      correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'zwanzig',         ru: '20' },
      { id: 2, de: 'dreißig',         ru: '30' },
      { id: 3, de: 'vierzig',         ru: '40' },
      { id: 4, de: 'sechzig',         ru: '60' },
      { id: 5, de: 'siebzig',         ru: '70' },
      { id: 6, de: 'hundert',         ru: '100' },
      { id: 7, de: 'einundzwanzig',   ru: '21' },
      { id: 8, de: 'achtundfünfzig',  ru: '58' }
    ],

    dictation: [
      { word: 'zwanzig',    audio: 'zwanzig' },
      { word: 'dreißig',    audio: 'dreißig' },
      { word: 'fünfzig',    audio: 'fünfzig' },
      { word: 'sechzig',    audio: 'sechzig' },
      { word: 'siebzig',    audio: 'siebzig' },
      { word: 'hundert',    audio: 'hundert' },
      { word: 'zählen',     audio: 'zählen' },
      { word: 'Nummer',     audio: 'Nummer' }
    ]
  }
};
