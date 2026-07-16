/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-10.js
   A2 · Урок 10: Feste und Traditionen — Праздники и традиции
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-10',
  level: 'A2',
  unit:  10,
  title: 'Feste und Traditionen',
  subtitle: 'Праздники и традиции немецкоязычных стран',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Weihnachten ist das wichtigste Fest in Deutschland.', ru: 'Рождество — самый важный праздник в Германии.', note: 'das wichtigste — самый важный', audio: 'Weihnachten ist das wichtigste Fest in Deutschland' },
    { de: 'Im Advent backen wir Plätzchen.',     ru: 'В адвент мы печём печенье.',        note: 'der Advent — предрождественское время; backen — печь', audio: 'Im Advent backen wir Plätzchen' },
    { de: 'Der Weihnachtsmarkt öffnet Ende November.', ru: 'Рождественский рынок открывается в конце ноября.', note: 'der Weihnachtsmarkt — рождественский рынок', audio: 'Der Weihnachtsmarkt öffnet Ende November' },
    { de: 'Wir schmücken den Weihnachtsbaum.',   ru: 'Мы наряжаем рождественскую ёлку.',  note: 'schmücken — украшать', audio: 'Wir schmücken den Weihnachtsbaum' },
    { de: 'An Silvester gibt es ein Feuerwerk.', ru: 'В новогоднюю ночь бывает фейерверк.', note: 'das Feuerwerk — фейерверк', audio: 'An Silvester gibt es ein Feuerwerk' },
    { de: 'Zu Ostern verstecken wir bunte Eier.', ru: 'На Пасху мы прячем разноцветные яйца.', note: 'verstecken — прятать; bunt — разноцветный', audio: 'Zu Ostern verstecken wir bunte Eier' },
    { de: 'Der Karneval beginnt im Februar.',    ru: 'Карнавал начинается в феврале.',    note: 'der Karneval — карнавал (особенно в Кёльне)', audio: 'Der Karneval beginnt im Februar' },
    { de: 'Die Leute tragen lustige Kostüme.',   ru: 'Люди носят весёлые костюмы.',       note: 'tragen — носить; das Kostüm — костюм', audio: 'Die Leute tragen lustige Kostüme' },
    { de: 'Das Oktoberfest findet in München statt.', ru: 'Октоберфест проходит в Мюнхене.', note: 'stattfinden — состояться (отделяемая приставка)', audio: 'Das Oktoberfest findet in München statt' },
    { de: 'Wir gratulieren dir zum Feiertag!',   ru: 'Поздравляем тебя с праздником!',    note: 'gratulieren + Dativ + zu', audio: 'Wir gratulieren dir zum Feiertag' },
    { de: 'Am ersten Mai haben alle frei.',      ru: 'Первого мая у всех выходной.',      note: 'frei haben — иметь выходной', audio: 'Am ersten Mai haben alle frei' },
    { de: 'Die ganze Familie kommt zusammen.',   ru: 'Вся семья собирается вместе.',      note: 'zusammenkommen — собираться', audio: 'Die ganze Familie kommt zusammen' },
    { de: 'Es gibt traditionelles Essen.',       ru: 'Есть традиционная еда.',            note: 'traditionell — традиционный', audio: 'Es gibt traditionelles Essen' },
    { de: 'Um Mitternacht stoßen wir an.',       ru: 'В полночь мы чокаемся.',            note: 'anstoßen — чокаться; die Mitternacht — полночь', audio: 'Um Mitternacht stoßen wir an' },
    { de: 'Ich wünsche dir ein frohes Fest!',    ru: 'Желаю тебе счастливого праздника!', note: 'wünschen — желать', audio: 'Ich wünsche dir ein frohes Fest' },
    { de: 'Diese Tradition ist sehr alt.',       ru: 'Эта традиция очень старая.',        note: 'die Tradition — традиция', audio: 'Diese Tradition ist sehr alt' }
  ],

  vocabulary: [
    { de: 'das Fest',            ru: 'праздник',              ipa: '[fɛst]',              article: 'das' },
    { de: 'der Feiertag',        ru: 'праздничный день',      ipa: '[ˈfaɪ̯ɐˌtaːk]',       article: 'der' },
    { de: 'die Tradition',       ru: 'традиция',              ipa: '[tʁadiˈtsi̯oːn]',     article: 'die' },
    { de: 'der Advent',          ru: 'адвент',                ipa: '[atˈvɛnt]',           article: 'der' },
    { de: 'der Weihnachtsmarkt', ru: 'рождественский рынок',  ipa: '[ˈvaɪ̯naxtsˌmaʁkt]',  article: 'der' },
    { de: 'der Weihnachtsbaum',  ru: 'рождественская ёлка',   ipa: '[ˈvaɪ̯naxtsˌbaʊ̯m]',  article: 'der' },
    { de: 'das Plätzchen',       ru: 'печенье',               ipa: '[ˈplɛtsçən]',         article: 'das' },
    { de: 'das Feuerwerk',       ru: 'фейерверк',             ipa: '[ˈfɔɪ̯ɐˌvɛʁk]',       article: 'das' },
    { de: 'der Karneval',        ru: 'карнавал',              ipa: '[ˈkaʁnəval]',         article: 'der' },
    { de: 'das Kostüm',          ru: 'костюм',                ipa: '[kɔsˈtyːm]',          article: 'das' },
    { de: 'die Mitternacht',     ru: 'полночь',               ipa: '[ˈmɪtɐˌnaxt]',        article: 'die' },
    { de: 'backen',              ru: 'печь',                  ipa: '[ˈbakn̩]',            article: '' },
    { de: 'schmücken',           ru: 'украшать',              ipa: '[ˈʃmʏkn̩]',           article: '' },
    { de: 'verstecken',          ru: 'прятать',               ipa: '[fɛɐ̯ˈʃtɛkn̩]',       article: '' },
    { de: 'stattfinden',         ru: 'состояться',            ipa: '[ˈʃtatˌfɪndn̩]',      article: '' },
    { de: 'gratulieren',         ru: 'поздравлять',           ipa: '[ɡʁatuˈliːʁən]',      article: '' },
    { de: 'wünschen',            ru: 'желать',                ipa: '[ˈvʏnʃn̩]',           article: '' },
    { de: 'anstoßen',            ru: 'чокаться',              ipa: '[ˈanˌʃtoːsn̩]',       article: '' },
    { de: 'bunt',                ru: 'разноцветный',          ipa: '[bʊnt]',              article: '' },
    { de: 'traditionell',        ru: 'традиционный',          ipa: '[tʁaditsi̯oˈnɛl]',    article: '' }
  ],

  grammar: [
    {
      title: '⚡ Предлоги с праздниками: an, zu, im',
      body: 'С праздниками используются разные предлоги:<br><br>' +
            '<strong>an/zu</strong> + праздник: <em><strong>an</strong> Weihnachten / <strong>zu</strong> Ostern</em> — на Рождество / на Пасху<br>' +
            '<strong>am</strong> + день: <em><strong>am</strong> ersten Mai</em> — первого мая<br>' +
            '<strong>im</strong> + месяц: <em><strong>im</strong> Februar</em> — в феврале',
      conjugation: [
        { pronoun: 'Рождество',  form: 'an Weihnachten',   audio: 'an Weihnachten',   translation: 'на Рождество' },
        { pronoun: 'Пасха',      form: 'zu Ostern',        audio: 'zu Ostern',        translation: 'на Пасху' },
        { pronoun: 'Новый год',  form: 'an Silvester',     audio: 'an Silvester',     translation: 'в новогоднюю ночь' },
        { pronoun: 'дата',       form: 'am ersten Mai',    audio: 'am ersten Mai',    translation: 'первого мая' },
        { pronoun: 'месяц',      form: 'im Dezember',      audio: 'im Dezember',      translation: 'в декабре' }
      ]
    },
    {
      title: '⚡ gratulieren + Dativ + zu',
      body: 'Глагол <strong>gratulieren</strong> требует Dativ (кому) и предлог <strong>zu</strong> (с чем):<br><br>' +
            '<em>Ich gratuliere <strong>dir zum</strong> Geburtstag.</em> — Поздравляю тебя с днём рождения.<br>' +
            '<em>Wir gratulieren <strong>Ihnen zum</strong> Jubiläum.</em> — Поздравляем вас с юбилеем.<br><br>' +
            'Также: <em>wünschen</em> + Dativ: <em>Ich wünsche <strong>dir</strong> ein frohes Fest!</em>',
      conjugation: [
        { pronoun: 'тебе',   form: 'Ich gratuliere dir zum Fest.',    audio: 'Ich gratuliere dir zum Fest',    translation: 'Поздравляю тебя с праздником.' },
        { pronoun: 'Вам',    form: 'Wir gratulieren Ihnen herzlich.', audio: 'Wir gratulieren Ihnen herzlich', translation: 'Сердечно поздравляем Вас.' },
        { pronoun: 'пожелание', form: 'Ich wünsche dir alles Gute!',  audio: 'Ich wünsche dir alles Gute',     translation: 'Желаю тебе всего хорошего!' }
      ]
    },
    {
      title: '💡 stattfinden — состояться',
      body: 'Полезный глагол для событий (отделяемая приставка statt-):<br><br>' +
            '<em>Das Oktoberfest <strong>findet</strong> in München <strong>statt</strong>.</em> — Октоберфест проходит в Мюнхене.<br>' +
            '<em>Wann <strong>findet</strong> das Konzert <strong>statt</strong>?</em> — Когда состоится концерт?'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wir',                   blank: 'schmücken',   after: 'den Weihnachtsbaum.',     translation: '— Мы наряжаем ёлку.',                  hintWord: 'schmücken',   hintRule: 'schmücken — украшать' },
      { before: '— An Silvester gibt es ein', blank: 'Feuerwerk', after: '.',                      translation: '— В новогоднюю ночь бывает фейерверк.', hintWord: 'Feuerwerk',  hintRule: 'das Feuerwerk — фейерверк' },
      { before: '— Zu Ostern',             blank: 'verstecken',  after: 'wir bunte Eier.',         translation: '— На Пасху мы прячем разноцветные яйца.', hintWord: 'verstecken', hintRule: 'verstecken — прятать' },
      { before: '— Das Oktoberfest findet in München', blank: 'statt', after: '.',                 translation: '— Октоберфест проходит в Мюнхене.',    hintWord: 'statt',       hintRule: 'stattfinden — приставка в конец' },
      { before: '— Ich gratuliere',        blank: 'dir',         after: 'zum Geburtstag.',         translation: '— Поздравляю тебя с днём рождения.',   hintWord: 'dir',         hintRule: 'gratulieren + Dativ' },
      { before: '— Im Advent',             blank: 'backen',      after: 'wir Plätzchen.',          translation: '— В адвент мы печём печенье.',         hintWord: 'backen',      hintRule: 'backen — печь' },
      { before: '— Die Leute tragen lustige', blank: 'Kostüme',  after: '.',                       translation: '— Люди носят весёлые костюмы.',        hintWord: 'Kostüme',     hintRule: 'das Kostüm → die Kostüme' },
      { before: '— Ich wünsche dir ein frohes', blank: 'Fest',   after: '!',                       translation: '— Желаю тебе счастливого праздника!',  hintWord: 'Fest',        hintRule: 'das Fest — праздник' }
    ],

    multipleChoice: [
      { question: 'Самый важный праздник в Германии…',         options: ['Ostern', 'Weihnachten', 'Karneval', 'Oktoberfest'],           correctIndex: 1 },
      { question: '«Schmücken» значит…',                       options: ['печь', 'украшать', 'прятать', 'дарить'],                      correctIndex: 1 },
      { question: 'Где проходит Октоберфест?',                 options: ['в Берлине', 'в Кёльне', 'в Мюнхене', 'в Гамбурге'],           correctIndex: 2 },
      { question: '«Gratulieren» требует падежа…',             options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                 correctIndex: 1 },
      { question: 'Что прячут на Пасху?',                      options: ['подарки', 'разноцветные яйца', 'печенье', 'костюмы'],         correctIndex: 1 },
      { question: '«Stattfinden» значит…',                     options: ['находить место', 'состояться', 'стоять', 'искать'],           correctIndex: 1 },
      { question: '«Der Advent» — это…',                       options: ['карнавал', 'предрождественское время', 'Новый год', 'Пасха'], correctIndex: 1 },
      { question: 'Когда чокаются (anstoßen) на Silvester?',   options: ['утром', 'в полдень', 'в полночь', 'вечером'],                 correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'das Fest',            ru: 'праздник' },
      { id: 2, de: 'der Weihnachtsbaum',  ru: 'рождественская ёлка' },
      { id: 3, de: 'das Feuerwerk',       ru: 'фейерверк' },
      { id: 4, de: 'schmücken',           ru: 'украшать' },
      { id: 5, de: 'verstecken',          ru: 'прятать' },
      { id: 6, de: 'gratulieren',         ru: 'поздравлять' },
      { id: 7, de: 'wünschen',            ru: 'желать' },
      { id: 8, de: 'die Tradition',       ru: 'традиция' }
    ],

    dictation: [
      { word: 'Weihnachten',  audio: 'Weihnachten' },
      { word: 'Feiertag',     audio: 'Feiertag' },
      { word: 'Feuerwerk',    audio: 'Feuerwerk' },
      { word: 'schmücken',    audio: 'schmücken' },
      { word: 'Tradition',    audio: 'Tradition' },
      { word: 'Karneval',     audio: 'Karneval' },
      { word: 'backen',       audio: 'backen' },
      { word: 'wünschen',     audio: 'wünschen' }
    ]
  }
};
