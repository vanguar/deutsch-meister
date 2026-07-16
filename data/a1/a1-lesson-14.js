/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-14.js
   A1 · Урок 14: Verkehrsmittel — Транспорт
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-14',
  level: 'A1',
  unit:  14,
  title: 'Verkehrsmittel',
  subtitle: 'Транспорт · Как добраться',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Ich fahre mit dem Bus.',              ru: 'Я еду на автобусе.',               note: 'mit dem Bus — на автобусе (mit + Dativ)', audio: 'Ich fahre mit dem Bus' },
    { de: 'Sie fährt mit dem Auto.',             ru: 'Она едет на машине.',              note: 'fahren → fährt (a→ä)', audio: 'Sie fährt mit dem Auto' },
    { de: 'Wir fahren mit der Bahn.',            ru: 'Мы едем на поезде.',               note: 'die Bahn — железная дорога, поезд', audio: 'Wir fahren mit der Bahn' },
    { de: 'Ich gehe zu Fuß.',                    ru: 'Я иду пешком.',                    note: 'zu Fuß gehen — идти пешком', audio: 'Ich gehe zu Fuß' },
    { de: 'Wann kommt der Zug?',                 ru: 'Когда прибывает поезд?',           note: 'der Zug — поезд; wann — когда', audio: 'Wann kommt der Zug' },
    { de: 'Der Bus kommt in zehn Minuten.',      ru: 'Автобус придёт через десять минут.', note: 'in zehn Minuten — через 10 минут', audio: 'Der Bus kommt in zehn Minuten' },
    { de: 'Wo ist die Haltestelle?',             ru: 'Где остановка?',                   note: 'die Haltestelle — остановка', audio: 'Wo ist die Haltestelle' },
    { de: 'Eine Fahrkarte, bitte.',              ru: 'Один билет, пожалуйста.',          note: 'die Fahrkarte — билет (на транспорт)', audio: 'Eine Fahrkarte, bitte' },
    { de: 'Wie komme ich zum Bahnhof?',          ru: 'Как мне добраться до вокзала?',    note: 'der Bahnhof — вокзал; zum = zu + dem', audio: 'Wie komme ich zum Bahnhof' },
    { de: 'Nehmen Sie die U-Bahn.',              ru: 'Поезжайте на метро.',              note: 'die U-Bahn — метро', audio: 'Nehmen Sie die U-Bahn' },
    { de: 'Ich fliege nach Berlin.',             ru: 'Я лечу в Берлин.',                 note: 'fliegen — лететь; nach + город', audio: 'Ich fliege nach Berlin' },
    { de: 'Das Flugzeug landet um acht Uhr.',    ru: 'Самолёт приземляется в восемь.',   note: 'das Flugzeug — самолёт; landen — приземляться', audio: 'Das Flugzeug landet um acht Uhr' },
    { de: 'Ich fahre gern Fahrrad.',             ru: 'Я люблю кататься на велосипеде.',  note: 'Fahrrad fahren — ездить на велосипеде', audio: 'Ich fahre gern Fahrrad' },
    { de: 'Der Zug hat Verspätung.',             ru: 'Поезд опаздывает.',                note: 'die Verspätung — опоздание', audio: 'Der Zug hat Verspätung' },
    { de: 'Steigen Sie hier aus?',               ru: 'Вы здесь выходите?',               note: 'aussteigen — выходить (из транспорта)', audio: 'Steigen Sie hier aus' },
    { de: 'Ich steige an der nächsten Station um.', ru: 'Я делаю пересадку на следующей станции.', note: 'umsteigen — пересаживаться', audio: 'Ich steige an der nächsten Station um' }
  ],

  vocabulary: [
    { de: 'das Verkehrsmittel', ru: 'транспортное средство', ipa: '[fɛɐ̯ˈkeːɐ̯sˌmɪtl̩]', article: 'das' },
    { de: 'der Bus',          ru: 'автобус',        ipa: '[bʊs]',              article: 'der' },
    { de: 'das Auto',         ru: 'машина',         ipa: '[ˈaʊ̯to]',           article: 'das' },
    { de: 'der Zug',          ru: 'поезд',          ipa: '[tsuːk]',            article: 'der' },
    { de: 'die Bahn',         ru: 'железная дорога', ipa: '[baːn]',            article: 'die' },
    { de: 'die U-Bahn',       ru: 'метро',          ipa: '[ˈuːˌbaːn]',         article: 'die' },
    { de: 'die Straßenbahn',  ru: 'трамвай',        ipa: '[ˈʃtʁaːsn̩ˌbaːn]',   article: 'die' },
    { de: 'das Fahrrad',      ru: 'велосипед',      ipa: '[ˈfaːɐ̯ˌʁaːt]',      article: 'das' },
    { de: 'das Flugzeug',     ru: 'самолёт',        ipa: '[ˈfluːkˌtsɔɪ̯k]',    article: 'das' },
    { de: 'das Taxi',         ru: 'такси',          ipa: '[ˈtaksi]',           article: 'das' },
    { de: 'der Bahnhof',      ru: 'вокзал',         ipa: '[ˈbaːnˌhoːf]',       article: 'der' },
    { de: 'der Flughafen',    ru: 'аэропорт',       ipa: '[ˈfluːkˌhaːfn̩]',    article: 'der' },
    { de: 'die Haltestelle',  ru: 'остановка',      ipa: '[ˈhaltəˌʃtɛlə]',     article: 'die' },
    { de: 'die Fahrkarte',    ru: 'билет',          ipa: '[ˈfaːɐ̯ˌkaʁtə]',     article: 'die' },
    { de: 'die Verspätung',   ru: 'опоздание',      ipa: '[fɛɐ̯ˈʃpɛːtʊŋ]',     article: 'die' },
    { de: 'fahren',           ru: 'ехать',          ipa: '[ˈfaːʁən]',          article: '' },
    { de: 'fliegen',          ru: 'лететь',         ipa: '[ˈfliːɡn̩]',         article: '' },
    { de: 'aussteigen',       ru: 'выходить',       ipa: '[ˈaʊ̯sˌʃtaɪ̯ɡn̩]',   article: '' },
    { de: 'umsteigen',        ru: 'пересаживаться', ipa: '[ˈʊmˌʃtaɪ̯ɡn̩]',     article: '' },
    { de: 'zu Fuß',           ru: 'пешком',         ipa: '[tsuː fuːs]',        article: '' }
  ],

  grammar: [
    {
      title: '⚡ mit + Dativ: на чём едешь',
      body: 'Транспорт всегда с предлогом <strong>mit</strong> + дательный падеж (Dativ):<br><br>' +
            '<strong>der</strong> Bus → mit <strong>dem</strong> Bus<br>' +
            '<strong>die</strong> Bahn → mit <strong>der</strong> Bahn<br>' +
            '<strong>das</strong> Auto → mit <strong>dem</strong> Auto<br><br>' +
            'Исключение: пешком — <em>zu Fuß</em>.',
      conjugation: [
        { pronoun: 'автобус',   form: 'mit dem Bus',      audio: 'mit dem Bus',      translation: 'на автобусе' },
        { pronoun: 'машина',    form: 'mit dem Auto',     audio: 'mit dem Auto',     translation: 'на машине' },
        { pronoun: 'поезд',     form: 'mit dem Zug',      audio: 'mit dem Zug',      translation: 'на поезде' },
        { pronoun: 'метро',     form: 'mit der U-Bahn',   audio: 'mit der U-Bahn',   translation: 'на метро' },
        { pronoun: 'велосипед', form: 'mit dem Fahrrad',  audio: 'mit dem Fahrrad',  translation: 'на велосипеде' },
        { pronoun: 'пешком',    form: 'zu Fuß',           audio: 'zu Fuß',           translation: 'пешком' }
      ]
    },
    {
      title: '⚡ Глагол fahren — ехать (a → ä)',
      body: 'Как и schlafen, глагол <strong>fahren</strong> меняет корневую гласную в формах du и er/sie/es:<br><br>' +
            '<em>Ich fahre. → Du f<strong>ä</strong>hrst. → Er f<strong>ä</strong>hrt.</em>',
      conjugation: [
        { pronoun: 'ich',           form: 'fahre',   audio: 'ich fahre',   translation: 'я еду' },
        { pronoun: 'du',            form: 'fährst',  audio: 'du fährst',   translation: 'ты едешь' },
        { pronoun: 'er / sie / es', form: 'fährt',   audio: 'er fährt',    translation: 'он/она едет' },
        { pronoun: 'wir',           form: 'fahren',  audio: 'wir fahren',  translation: 'мы едем' },
        { pronoun: 'ihr',           form: 'fahrt',   audio: 'ihr fahrt',   translation: 'вы едете' },
        { pronoun: 'Sie / sie',     form: 'fahren',  audio: 'Sie fahren',  translation: 'Вы едете / они едут' }
      ]
    },
    {
      title: '💡 Отделяемые приставки: aussteigen, umsteigen',
      body: 'У многих глаголов приставка <strong>отделяется</strong> и уходит в конец предложения:<br><br>' +
            '<em>aus|steigen → Ich steige hier <strong>aus</strong>.</em> — Я здесь выхожу.<br>' +
            '<em>um|steigen → Ich steige in Hamburg <strong>um</strong>.</em> — Я пересаживаюсь в Гамбурге.<br>' +
            '<em>ein|steigen → Steigen Sie <strong>ein</strong>!</em> — Заходите (в транспорт)!'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich fahre mit',         blank: 'dem',        after: 'Bus.',                    translation: '— Я еду на автобусе.',              hintWord: 'dem',        hintRule: 'der Bus → mit dem Bus (Dativ)' },
      { before: '— Wir fahren mit',        blank: 'der',        after: 'Bahn.',                   translation: '— Мы едем на поезде.',              hintWord: 'der',        hintRule: 'die Bahn → mit der Bahn' },
      { before: '— Ich gehe zu',           blank: 'Fuß',        after: '.',                       translation: '— Я иду пешком.',                   hintWord: 'Fuß',        hintRule: 'zu Fuß — пешком' },
      { before: '— Sie',                   blank: 'fährt',      after: 'mit dem Auto.',           translation: '— Она едет на машине.',             hintWord: 'fährt',      hintRule: 'fahren → fährt (a→ä)' },
      { before: '— Wo ist die',            blank: 'Haltestelle', after: '?',                      translation: '— Где остановка?',                  hintWord: 'Haltestelle', hintRule: 'die Haltestelle — остановка' },
      { before: '— Eine',                  blank: 'Fahrkarte',  after: ', bitte.',                translation: '— Один билет, пожалуйста.',         hintWord: 'Fahrkarte',  hintRule: 'die Fahrkarte — билет' },
      { before: '— Der Zug hat',           blank: 'Verspätung', after: '.',                       translation: '— Поезд опаздывает.',               hintWord: 'Verspätung', hintRule: 'Verspätung haben — опаздывать' },
      { before: '— Ich steige hier',       blank: 'aus',        after: '.',                       translation: '— Я здесь выхожу.',                 hintWord: 'aus',        hintRule: 'aussteigen — приставка в конец' }
    ],

    multipleChoice: [
      { question: 'Как сказать «на автобусе»?',                 options: ['mit der Bus', 'mit dem Bus', 'auf dem Bus', 'in Bus'],       correctIndex: 1 },
      { question: '«Zu Fuß gehen» значит…',                     options: ['ехать на такси', 'идти пешком', 'бежать', 'лететь'],         correctIndex: 1 },
      { question: '«Die U-Bahn» — это…',                        options: ['трамвай', 'метро', 'электричка', 'автобус'],                 correctIndex: 1 },
      { question: 'Форма fahren для «du»…',                     options: ['fahrst', 'fährst', 'fährt', 'fahren'],                       correctIndex: 1 },
      { question: '«Der Zug hat Verspätung» значит…',           options: ['Поезд прибыл', 'Поезд опаздывает', 'Поезд отменён', 'Поезд полный'], correctIndex: 1 },
      { question: '«Umsteigen» значит…',                        options: ['выходить', 'заходить', 'пересаживаться', 'ждать'],           correctIndex: 2 },
      { question: 'Где садятся на самолёт?',                    options: ['am Bahnhof', 'am Flughafen', 'an der Haltestelle', 'im Büro'], correctIndex: 1 },
      { question: '«Das Fahrrad» — это…',                       options: ['мотоцикл', 'велосипед', 'самокат', 'машина'],                correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Bus',          ru: 'автобус' },
      { id: 2, de: 'der Zug',          ru: 'поезд' },
      { id: 3, de: 'das Flugzeug',     ru: 'самолёт' },
      { id: 4, de: 'das Fahrrad',      ru: 'велосипед' },
      { id: 5, de: 'die Haltestelle',  ru: 'остановка' },
      { id: 6, de: 'der Bahnhof',      ru: 'вокзал' },
      { id: 7, de: 'die Fahrkarte',    ru: 'билет' },
      { id: 8, de: 'umsteigen',        ru: 'пересаживаться' }
    ],

    dictation: [
      { word: 'Bus',        audio: 'Bus' },
      { word: 'Zug',        audio: 'Zug' },
      { word: 'Auto',       audio: 'Auto' },
      { word: 'Fahrrad',    audio: 'Fahrrad' },
      { word: 'Bahnhof',    audio: 'Bahnhof' },
      { word: 'Flugzeug',   audio: 'Flugzeug' },
      { word: 'Fahrkarte',  audio: 'Fahrkarte' },
      { word: 'fahren',     audio: 'fahren' }
    ]
  }
};
