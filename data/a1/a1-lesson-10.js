/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-10.js
   A1 · Урок 10: Monate und Jahreszeiten — Месяцы и времена года
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-10',
  level: 'A1',
  unit:  10,
  title: 'Monate und Jahreszeiten',
  subtitle: 'Месяцы и времена года',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Der Winter ist kalt.',               ru: 'Зима холодная.',                    note: 'der Winter — зима; kalt — холодный', audio: 'Der Winter ist kalt' },
    { de: 'Im Sommer ist es warm.',             ru: 'Летом тепло.',                      note: 'im Sommer — летом (im = in + dem)', audio: 'Im Sommer ist es warm' },
    { de: 'Der Frühling beginnt im März.',      ru: 'Весна начинается в марте.',         note: 'beginnen — начинаться; im März — в марте', audio: 'Der Frühling beginnt im März' },
    { de: 'Im Herbst fallen die Blätter.',      ru: 'Осенью падают листья.',             note: 'der Herbst — осень; das Blatt → die Blätter', audio: 'Im Herbst fallen die Blätter' },
    { de: 'Mein Geburtstag ist im Mai.',        ru: 'Мой день рождения в мае.',          note: 'der Geburtstag — день рождения', audio: 'Mein Geburtstag ist im Mai' },
    { de: 'Welcher Monat ist jetzt?',           ru: 'Какой сейчас месяц?',               note: 'welcher — какой; der Monat — месяц', audio: 'Welcher Monat ist jetzt' },
    { de: 'Jetzt ist Januar.',                  ru: 'Сейчас январь.',                    note: 'jetzt — сейчас', audio: 'Jetzt ist Januar' },
    { de: 'Der Dezember ist der letzte Monat.', ru: 'Декабрь — последний месяц.',        note: 'letzte — последний', audio: 'Der Dezember ist der letzte Monat' },
    { de: 'Im Juli habe ich Urlaub.',           ru: 'В июле у меня отпуск.',             note: 'der Urlaub — отпуск', audio: 'Im Juli habe ich Urlaub' },
    { de: 'Der Herbst ist schön, aber kühl.',   ru: 'Осень красивая, но прохладная.',    note: 'kühl — прохладный; aber — но', audio: 'Der Herbst ist schön, aber kühl' },
    { de: 'Im Winter schneit es oft.',          ru: 'Зимой часто идёт снег.',            note: 'es schneit — идёт снег; oft — часто', audio: 'Im Winter schneit es oft' },
    { de: 'Ein Jahr hat zwölf Monate.',         ru: 'В году двенадцать месяцев.',        note: 'das Jahr — год; zwölf — 12', audio: 'Ein Jahr hat zwölf Monate' },
    { de: 'Welche Jahreszeit magst du?',        ru: 'Какое время года ты любишь?',       note: 'die Jahreszeit — время года; mögen — любить', audio: 'Welche Jahreszeit magst du' },
    { de: 'Ich mag den Sommer.',                ru: 'Я люблю лето.',                     note: 'ich mag — я люблю (mögen)', audio: 'Ich mag den Sommer' },
    { de: 'Im April regnet es viel.',           ru: 'В апреле часто идёт дождь.',        note: 'es regnet — идёт дождь; viel — много', audio: 'Im April regnet es viel' },
    { de: 'Der Juni ist mein Lieblingsmonat.',  ru: 'Июнь — мой любимый месяц.',         note: 'Lieblings- — любимый (приставка)', audio: 'Der Juni ist mein Lieblingsmonat' }
  ],

  vocabulary: [
    { de: 'der Monat',       ru: 'месяц',          ipa: '[ˈmoːnat]',        article: 'der' },
    { de: 'das Jahr',        ru: 'год',            ipa: '[jaːɐ̯]',          article: 'das' },
    { de: 'die Jahreszeit',  ru: 'время года',     ipa: '[ˈjaːʁəsˌtsaɪ̯t]', article: 'die' },
    { de: 'der Frühling',    ru: 'весна',          ipa: '[ˈfʁyːlɪŋ]',       article: 'der' },
    { de: 'der Sommer',      ru: 'лето',           ipa: '[ˈzɔmɐ]',          article: 'der' },
    { de: 'der Herbst',      ru: 'осень',          ipa: '[hɛʁpst]',         article: 'der' },
    { de: 'der Winter',      ru: 'зима',           ipa: '[ˈvɪntɐ]',         article: 'der' },
    { de: 'der Januar',      ru: 'январь',         ipa: '[ˈjanuaːɐ̯]',      article: 'der' },
    { de: 'der Februar',     ru: 'февраль',        ipa: '[ˈfeːbʁuaːɐ̯]',    article: 'der' },
    { de: 'der März',        ru: 'март',           ipa: '[mɛʁts]',          article: 'der' },
    { de: 'der April',       ru: 'апрель',         ipa: '[aˈpʁɪl]',         article: 'der' },
    { de: 'der Mai',         ru: 'май',            ipa: '[maɪ̯]',           article: 'der' },
    { de: 'der Juni',        ru: 'июнь',           ipa: '[ˈjuːni]',         article: 'der' },
    { de: 'der Juli',        ru: 'июль',           ipa: '[ˈjuːli]',         article: 'der' },
    { de: 'der August',      ru: 'август',         ipa: '[aʊ̯ˈɡʊst]',       article: 'der' },
    { de: 'der September',   ru: 'сентябрь',       ipa: '[zɛpˈtɛmbɐ]',      article: 'der' },
    { de: 'der Oktober',     ru: 'октябрь',        ipa: '[ɔkˈtoːbɐ]',       article: 'der' },
    { de: 'der November',    ru: 'ноябрь',         ipa: '[noˈvɛmbɐ]',       article: 'der' },
    { de: 'der Dezember',    ru: 'декабрь',        ipa: '[deˈtsɛmbɐ]',      article: 'der' },
    { de: 'der Urlaub',      ru: 'отпуск',         ipa: '[ˈuːɐ̯laʊ̯p]',     article: 'der' }
  ],

  grammar: [
    {
      title: '⚡ Предлог im — «в» для месяцев и времён года',
      body: 'С месяцами и временами года всегда используется <strong>im</strong> (= in + dem):<br><br>' +
            '<em><strong>Im</strong> Januar schneit es.</em> — В январе идёт снег.<br>' +
            '<em><strong>Im</strong> Sommer ist es warm.</em> — Летом тепло.<br><br>' +
            'Все месяцы и времена года — мужского рода (<strong>der</strong>).',
      conjugation: [
        { pronoun: 'весной',   form: 'im Frühling', audio: 'im Frühling', translation: 'весной' },
        { pronoun: 'летом',    form: 'im Sommer',   audio: 'im Sommer',   translation: 'летом' },
        { pronoun: 'осенью',   form: 'im Herbst',   audio: 'im Herbst',   translation: 'осенью' },
        { pronoun: 'зимой',    form: 'im Winter',   audio: 'im Winter',   translation: 'зимой' },
        { pronoun: 'в мае',    form: 'im Mai',      audio: 'im Mai',      translation: 'в мае' },
        { pronoun: 'в августе', form: 'im August',  audio: 'im August',   translation: 'в августе' }
      ]
    },
    {
      title: '⚡ Безличное es: es regnet, es schneit',
      body: 'О погоде немцы говорят через безличное <strong>es</strong> («оно»):<br><br>' +
            '<em><strong>Es</strong> regnet.</em> — Идёт дождь.<br>' +
            '<em><strong>Es</strong> schneit.</em> — Идёт снег.<br>' +
            '<em><strong>Es</strong> ist kalt / warm.</em> — Холодно / тепло.',
      conjugation: [
        { pronoun: 'дождь',   form: 'Es regnet.',    audio: 'Es regnet',    translation: 'Идёт дождь.' },
        { pronoun: 'снег',    form: 'Es schneit.',   audio: 'Es schneit',   translation: 'Идёт снег.' },
        { pronoun: 'холодно', form: 'Es ist kalt.',  audio: 'Es ist kalt',  translation: 'Холодно.' },
        { pronoun: 'тепло',   form: 'Es ist warm.',  audio: 'Es ist warm',  translation: 'Тепло.' }
      ]
    },
    {
      title: '💡 Глагол mögen — любить, нравиться',
      body: '<strong>mögen</strong> выражает симпатию к предметам, людям, временам года:<br><br>' +
            '<em>Ich <strong>mag</strong> den Sommer.</em> — Я люблю лето.<br>' +
            '<em>Magst du den Winter?</em> — Ты любишь зиму?',
      conjugation: [
        { pronoun: 'ich',           form: 'mag',    audio: 'ich mag',    translation: 'я люблю' },
        { pronoun: 'du',            form: 'magst',  audio: 'du magst',   translation: 'ты любишь' },
        { pronoun: 'er / sie / es', form: 'mag',    audio: 'er mag',     translation: 'он/она любит' },
        { pronoun: 'wir',           form: 'mögen',  audio: 'wir mögen',  translation: 'мы любим' },
        { pronoun: 'ihr',           form: 'mögt',   audio: 'ihr mögt',   translation: 'вы любите' },
        { pronoun: 'Sie / sie',     form: 'mögen',  audio: 'Sie mögen',  translation: 'Вы любите / они любят' }
      ]
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '—',                       blank: 'Im',        after: 'Winter schneit es.',        translation: '— Зимой идёт снег.',                hintWord: 'Im',        hintRule: 'im = in + dem (для сезонов)' },
      { before: '— Der Frühling beginnt', blank: 'im',        after: 'März.',                     translation: '— Весна начинается в марте.',       hintWord: 'im',        hintRule: 'im + месяц' },
      { before: '— Es',                    blank: 'regnet',    after: 'im April viel.',            translation: '— В апреле часто идёт дождь.',      hintWord: 'regnet',    hintRule: 'es regnet — идёт дождь' },
      { before: '— Ein Jahr hat zwölf',    blank: 'Monate',    after: '.',                         translation: '— В году двенадцать месяцев.',      hintWord: 'Monate',    hintRule: 'der Monat → die Monate' },
      { before: '— Ich',                   blank: 'mag',       after: 'den Sommer.',               translation: '— Я люблю лето.',                   hintWord: 'mag',       hintRule: 'ich → mag (mögen)' },
      { before: '— Welche',                blank: 'Jahreszeit', after: 'magst du?',                translation: '— Какое время года ты любишь?',     hintWord: 'Jahreszeit', hintRule: 'die Jahreszeit — время года' },
      { before: '— Der Winter ist',        blank: 'kalt',      after: '.',                         translation: '— Зима холодная.',                  hintWord: 'kalt',      hintRule: 'kalt — холодный' },
      { before: '— Mein Geburtstag ist',   blank: 'im',        after: 'Mai.',                      translation: '— Мой день рождения в мае.',        hintWord: 'im',        hintRule: 'im + месяц' }
    ],

    multipleChoice: [
      { question: 'Как сказать «летом»?',                       options: ['in Sommer', 'im Sommer', 'am Sommer', 'zu Sommer'],            correctIndex: 1 },
      { question: '«Der Herbst» — это…',                        options: ['весна', 'лето', 'осень', 'зима'],                              correctIndex: 2 },
      { question: 'Какой артикль у всех месяцев?',              options: ['die', 'das', 'der', 'без артикля'],                            correctIndex: 2 },
      { question: '«Es schneit» значит…',                       options: ['идёт дождь', 'идёт снег', 'светит солнце', 'холодно'],         correctIndex: 1 },
      { question: 'Сколько месяцев в году (zwölf)?',            options: ['10', '11', '12', '20'],                                        correctIndex: 2 },
      { question: 'Какая форма mögen для «du»?',                options: ['mag', 'magst', 'mögt', 'mögen'],                               correctIndex: 1 },
      { question: 'Первый месяц года — …',                      options: ['der Februar', 'der Januar', 'der März', 'der Dezember'],       correctIndex: 1 },
      { question: '«Der Urlaub» — это…',                        options: ['работа', 'отпуск', 'праздник', 'месяц'],                       correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Frühling',   ru: 'весна' },
      { id: 2, de: 'der Sommer',     ru: 'лето' },
      { id: 3, de: 'der Herbst',     ru: 'осень' },
      { id: 4, de: 'der Winter',     ru: 'зима' },
      { id: 5, de: 'der Januar',     ru: 'январь' },
      { id: 6, de: 'der Dezember',   ru: 'декабрь' },
      { id: 7, de: 'die Jahreszeit', ru: 'время года' },
      { id: 8, de: 'das Jahr',       ru: 'год' }
    ],

    dictation: [
      { word: 'Sommer',     audio: 'Sommer' },
      { word: 'Winter',     audio: 'Winter' },
      { word: 'Frühling',   audio: 'Frühling' },
      { word: 'Herbst',     audio: 'Herbst' },
      { word: 'Januar',     audio: 'Januar' },
      { word: 'Monat',      audio: 'Monat' },
      { word: 'Jahr',       audio: 'Jahr' },
      { word: 'Urlaub',     audio: 'Urlaub' }
    ]
  }
};
