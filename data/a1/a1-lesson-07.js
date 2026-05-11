/* ═══════════════════════════════════════════════
   data/a1-lesson-07.js
   A1 · Урок 7: Wo ist die Haltestelle? — В городе и транспорт
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-07',
  level: 'A1',
  unit:  7,
  title: 'Wo ist die Haltestelle?',
  subtitle: 'Ориентация в городе, транспорт и направления',

  meta: {
    duration: '30 мин',
    wordCount: 26,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Entschuldigung, wo ist der Bahnhof?', ru: 'Извините, где находится вокзал?',          note: 'Entschuldigung — универсальное «извините»', audio: 'Entschuldigung wo ist der Bahnhof' },
    { de: 'Gehen Sie geradeaus.',                ru: 'Идите прямо.',                              note: 'geradeaus = прямо', audio: 'Gehen Sie geradeaus' },
    { de: 'Biegen Sie links ab.',                ru: 'Поверните налево.',                         note: 'abbiegen = поворачивать (отделяемая ab-)', audio: 'Biegen Sie links ab' },
    { de: 'Biegen Sie rechts ab.',               ru: 'Поверните направо.',                        note: 'rechts = направо', audio: 'Biegen Sie rechts ab' },
    { de: 'Das ist auf der rechten Seite.',      ru: 'Это с правой стороны.',                     note: 'Seite = сторона', audio: 'Das ist auf der rechten Seite' },
    { de: 'Wie weit ist es?',                    ru: 'Как далеко это?',                           note: 'weit = далеко', audio: 'Wie weit ist es' },
    { de: 'Es sind etwa zehn Minuten zu Fuß.',   ru: 'Это около десяти минут пешком.',            note: 'zu Fuß = пешком', audio: 'Es sind etwa zehn Minuten zu Fuß' },
    { de: 'Wie komme ich zum Hotel?',            ru: 'Как добраться до отеля?',                   note: 'zum = zu + dem (Dat.)', audio: 'Wie komme ich zum Hotel' },
    { de: 'Mit dem Bus oder zu Fuß.',            ru: 'На автобусе или пешком.',                   note: 'mit dem Bus = на автобусе', audio: 'Mit dem Bus oder zu Fuß' },
    { de: 'Wo ist die nächste Apotheke?',        ru: 'Где ближайшая аптека?',                     note: 'nächste = ближайший(ая)', audio: 'Wo ist die nächste Apotheke' },
    { de: 'Gleich um die Ecke.',                 ru: 'Сразу за углом.',                           note: 'gleich = сразу; Ecke = угол', audio: 'Gleich um die Ecke' },
    { de: 'Wo ist die Haltestelle?',             ru: 'Где остановка?',                            note: 'Haltestelle = остановка автобуса/трамвая', audio: 'Wo ist die Haltestelle' },
    { de: 'Welche Linie fährt zum Zentrum?',     ru: 'Какая линия идёт в центр?',                 note: 'Linie = маршрут/линия', audio: 'Welche Linie fährt zum Zentrum' },
    { de: 'Nehmen Sie die U-Bahn.',              ru: 'Сядьте на метро.',                          note: 'U-Bahn = метро', audio: 'Nehmen Sie die U-Bahn' },
    { de: 'Wo kann ich ein Ticket kaufen?',      ru: 'Где можно купить билет?',                   note: 'kann ich = могу я', audio: 'Wo kann ich ein Ticket kaufen' },
    { de: 'Am Automaten.',                       ru: 'В автомате.',                               note: 'an + dem → am', audio: 'Am Automaten' },
    { de: 'Ist hier ein Park in der Nähe?',      ru: 'Здесь рядом есть парк?',                    note: 'in der Nähe = поблизости', audio: 'Ist hier ein Park in der Nähe' },
    { de: 'Ja, hinter dem Rathaus.',             ru: 'Да, за ратушей.',                           note: 'hinter + Dat.', audio: 'Ja, hinter dem Rathaus' },
    { de: 'Ich verstehe nicht.',                 ru: 'Я не понимаю.',                             note: 'verstehen = понимать', audio: 'Ich verstehe nicht' },
    { de: 'Können Sie das wiederholen?',         ru: 'Можете повторить?',                         note: 'wiederholen = повторять', audio: 'Können Sie das wiederholen' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Bahnhof',     ru: 'вокзал',         ipa: '[ˈbaːnˌhoːf]',     article: 'der' },
    { de: 'die Haltestelle', ru: 'остановка',      ipa: '[ˈhaltəˌʃtɛlə]',   article: 'die' },
    { de: 'die Straße',      ru: 'улица',          ipa: '[ˈʃtʁaːsə]',       article: 'die' },
    { de: 'die U-Bahn',      ru: 'метро',          ipa: '[ˈuːˌbaːn]',       article: 'die' },
    { de: 'der Bus',         ru: 'автобус',        ipa: '[bʊs]',            article: 'der' },
    { de: 'die Straßenbahn', ru: 'трамвай',        ipa: '[ˈʃtʁaːsn̩ˌbaːn]', article: 'die' },
    { de: 'das Taxi',        ru: 'такси',          ipa: '[ˈtaksi]',         article: 'das' },
    { de: 'das Auto',        ru: 'машина',         ipa: '[ˈaʊ̯to]',         article: 'das' },
    { de: 'das Fahrrad',     ru: 'велосипед',      ipa: '[ˈfaːɐ̯ʁaːt]',     article: 'das' },
    { de: 'links',           ru: 'налево / слева', ipa: '[lɪŋks]',          article: '' },
    { de: 'rechts',          ru: 'направо / справа',ipa: '[ʁɛçts]',         article: '' },
    { de: 'geradeaus',       ru: 'прямо',          ipa: '[ɡəˈʁaːdəˌʔaʊ̯s]', article: '' },
    { de: 'die Ampel',       ru: 'светофор',       ipa: '[ˈampl̩]',         article: 'die' },
    { de: 'die Brücke',      ru: 'мост',           ipa: '[ˈbʁʏkə]',         article: 'die' },
    { de: 'das Rathaus',     ru: 'ратуша / мэрия', ipa: '[ˈʁaːtˌhaʊ̯s]',    article: 'das' },
    { de: 'die Apotheke',    ru: 'аптека',         ipa: '[apoˈteːkə]',      article: 'die' },
    { de: 'die Kirche',      ru: 'церковь',        ipa: '[ˈkɪʁçə]',         article: 'die' },
    { de: 'das Hotel',       ru: 'отель',          ipa: '[hoˈtɛl]',         article: 'das' },
    { de: 'das Museum',      ru: 'музей',          ipa: '[muˈzeːʊm]',       article: 'das' },
    { de: 'der Park',        ru: 'парк',           ipa: '[paʁk]',           article: 'der' },
    { de: 'weit',            ru: 'далеко',         ipa: '[vaɪ̯t]',          article: '' },
    { de: 'nah',             ru: 'близко',         ipa: '[naː]',            article: '' },
    { de: 'zu Fuß',          ru: 'пешком',         ipa: '[tsuː fuːs]',      article: '' },
    { de: 'gehen',           ru: 'идти',           ipa: '[ˈɡeːən]',         article: '' },
    { de: 'fahren',          ru: 'ехать',          ipa: '[ˈfaːʁən]',        article: '' },
    { de: 'nehmen',          ru: 'брать (транспорт)',ipa: '[ˈneːmən]',       article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ W-вопросы для ориентации в пространстве',
      body: 'Для вопросов о месте и направлении используй три разных слова:<br><br>' +
            '<strong>Wo?</strong> — где? (статичное место)<br>' +
            '<strong>Wohin?</strong> — куда? (направление движения)<br>' +
            '<strong>Woher?</strong> — откуда? (происхождение / откуда движется)<br><br>' +
            '<em>Wo ist die Bank?</em> — Где банк?<br>' +
            '<em>Wohin gehen Sie?</em> — Куда Вы идёте?<br>' +
            '<em>Woher kommen Sie?</em> — Откуда Вы?',
      conjugation: [
        { pronoun: 'Wo?',       form: 'место',       audio: 'Wo ist das',         translation: 'Где это?' },
        { pronoun: 'Wohin?',    form: 'направление', audio: 'Wohin gehen Sie',    translation: 'Куда Вы идёте?' },
        { pronoun: 'Woher?',    form: 'откуда',      audio: 'Woher kommen Sie',   translation: 'Откуда Вы?' },
        { pronoun: 'Wie weit?', form: 'расстояние',  audio: 'Wie weit ist es',    translation: 'Как далеко?' },
        { pronoun: 'Wie lange?',form: 'время',       audio: 'Wie lange dauert es',translation: 'Сколько времени?' }
      ]
    },
    {
      title: '⚡ Императив для Sie — вежливое указание',
      body: 'Чтобы вежливо дать команду или указание (форма <strong>Sie</strong>), переставь глагол на <strong>1-е место</strong>, а <em>Sie</em> — сразу после:<br><br>' +
            'Утвердительно: <em>Sie gehen geradeaus.</em><br>' +
            'Императив: <strong>Gehen Sie</strong> geradeaus! — Идите прямо!<br><br>' +
            'Другие примеры:<br>' +
            '<em>Biegen Sie</em> links ab! — Поверните налево!<br>' +
            '<em>Nehmen Sie</em> die U-Bahn. — Садитесь на метро.<br>' +
            '<em>Warten Sie</em> bitte. — Подождите, пожалуйста.',
      conjugation: [
        { pronoun: 'gehen',     form: 'Gehen Sie!',     audio: 'Gehen Sie',     translation: 'Идите!' },
        { pronoun: 'fahren',    form: 'Fahren Sie!',    audio: 'Fahren Sie',    translation: 'Поезжайте!' },
        { pronoun: 'nehmen',    form: 'Nehmen Sie!',    audio: 'Nehmen Sie',    translation: 'Возьмите!' },
        { pronoun: 'kommen',    form: 'Kommen Sie!',    audio: 'Kommen Sie',    translation: 'Приходите!' },
        { pronoun: 'wiederholen',form: 'Wiederholen Sie!',audio: 'Wiederholen Sie',translation: 'Повторите!' },
        { pronoun: 'bleiben',   form: 'Bleiben Sie!',   audio: 'Bleiben Sie',   translation: 'Останьтесь!' }
      ]
    },
    {
      title: '💡 Транспорт: mit + Dativ',
      body: 'Чтобы сказать «на чём ты едешь», используй <strong>mit + dem/der</strong> (Dativ):<br><br>' +
            '<em>mit <strong>dem</strong> Bus</em> — на автобусе (der Bus)<br>' +
            '<em>mit <strong>der</strong> U-Bahn</em> — на метро (die U-Bahn)<br>' +
            '<em>mit <strong>dem</strong> Auto</em> — на машине (das Auto)<br>' +
            '<em>mit <strong>dem</strong> Fahrrad</em> — на велосипеде<br><br>' +
            '⚠️ Пешком — без mit: просто <strong>zu Fuß</strong>.<br><br>' +
            'Правило для Dativ: <em>der/das → dem</em>, <em>die → der</em>, <em>мн.ч. → den</em>.'
    },
    {
      title: '💡 Слитные предлоги: zum, zur, am, im',
      body: 'Часто предлог + артикль сливаются в одно слово — это удобнее произносить:<br><br>' +
            '<strong>zu + dem = zum</strong> → <em>Wie komme ich <strong>zum</strong> Bahnhof?</em><br>' +
            '<strong>zu + der = zur</strong> → <em>Wie komme ich <strong>zur</strong> Apotheke?</em><br>' +
            '<strong>an + dem = am</strong> → <em>Ich warte <strong>am</strong> Bahnhof.</em><br>' +
            '<strong>in + dem = im</strong> → <em>Er wohnt <strong>im</strong> Hotel.</em><br>' +
            '<strong>in + das = ins</strong> → <em>Ich gehe <strong>ins</strong> Kino.</em><br><br>' +
            'Это <em>обязательные</em> слияния — нельзя сказать «zu dem Bahnhof».'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Gehen Sie',           blank: 'geradeaus', after: '.',                translation: '— Идите прямо.',                                  hintWord: 'geradeaus', hintRule: 'geradeaus = прямо' },
      { before: '— Biegen Sie',          blank: 'links',     after: 'ab.',              translation: '— Поверните налево.',                              hintWord: 'links',     hintRule: 'links = налево / слева' },
      { before: '— Wo ist der',          blank: 'Bahnhof',   after: '?',                translation: '— Где находится вокзал?',                          hintWord: 'Bahnhof',   hintRule: 'Bahnhof = вокзал (Bahn + Hof)' },
      { before: '— Wie',                 blank: 'weit',      after: 'ist es?',          translation: '— Как далеко?',                                    hintWord: 'weit',      hintRule: 'weit = далеко' },
      { before: '— Ich fahre mit',       blank: 'dem',       after: 'Bus.',             translation: '— Я еду на автобусе.',                             hintWord: 'dem',       hintRule: 'mit + Dat: der Bus → dem Bus' },
      { before: '— Wie komme ich',       blank: 'zum',       after: 'Hotel?',           translation: '— Как добраться до отеля?',                        hintWord: 'zum',       hintRule: 'zu + dem = zum (для м.р./ср.р.)' },
      { before: '—',                      blank: 'Nehmen',    after: 'Sie die U-Bahn.', translation: '— Сядьте на метро.',                               hintWord: 'Nehmen',    hintRule: 'Императив Sie: глагол на 1-м месте' },
      { before: '— Es sind zehn Minuten zu', blank: 'Fuß',     after: '.',              translation: '— Это десять минут пешком.',                       hintWord: 'Fuß',       hintRule: 'zu Fuß = пешком (с большой!)' }
    ],

    multipleChoice: [
      { question: 'Что значит «die Ampel»?',                                          options: ['мост', 'остановка', 'светофор', 'улица'],                                                correctIndex: 2 },
      { question: '«Zu Fuß» означает:',                                               options: ['на автобусе', 'на такси', 'пешком', 'на велосипеде'],                                    correctIndex: 2 },
      { question: 'Как попросить повернуть направо?',                                 options: ['Gehen Sie links.', 'Biegen Sie rechts ab.', 'Fahren Sie geradeaus.', 'Nehmen Sie links.'], correctIndex: 1 },
      { question: 'Какой вопрос о месте?',                                            options: ['Wohin?', 'Woher?', 'Wo?', 'Wann?'],                                                       correctIndex: 2 },
      { question: 'Как сказать «на машине»?',                                         options: ['mit dem Auto', 'mit das Auto', 'auf das Auto', 'in dem Auto'],                            correctIndex: 0 },
      { question: '«Wie komme ich ___ Bahnhof?» — какой предлог?',                    options: ['in dem', 'zur', 'zum', 'am'],                                                              correctIndex: 2 },
      { question: 'Императив «нести» от «kommen» (Sie):',                             options: ['Sie kommen!', 'Komm Sie!', 'Kommen Sie!', 'Kommen!'],                                     correctIndex: 2 },
      { question: 'Что значит «in der Nähe»?',                                        options: ['далеко', 'поблизости', 'в центре', 'за углом'],                                            correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'links',           ru: 'налево' },
      { id: 2, de: 'rechts',          ru: 'направо' },
      { id: 3, de: 'geradeaus',       ru: 'прямо' },
      { id: 4, de: 'der Bahnhof',     ru: 'вокзал' },
      { id: 5, de: 'die Haltestelle', ru: 'остановка' },
      { id: 6, de: 'die U-Bahn',      ru: 'метро' },
      { id: 7, de: 'die Apotheke',    ru: 'аптека' },
      { id: 8, de: 'zu Fuß',          ru: 'пешком' }
    ],

    dictation: [
      { word: 'links',     audio: 'links' },
      { word: 'rechts',    audio: 'rechts' },
      { word: 'Bahnhof',   audio: 'Bahnhof' },
      { word: 'geradeaus', audio: 'geradeaus' },
      { word: 'fahren',    audio: 'fahren' },
      { word: 'Apotheke',  audio: 'Apotheke' },
      { word: 'Brücke',    audio: 'Brücke' },
      { word: 'Ecke',      audio: 'Ecke' }
    ]
  }
};
