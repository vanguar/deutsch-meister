/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-18.js
   A1 · Урок 18: Perfekt — Прошедшее время
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-18',
  level: 'A1',
  unit:  18,
  title: 'Perfekt',
  subtitle: 'Прошедшее время: Was hast du gemacht?',

  meta: {
    duration: '30 мин',
    wordCount: 18,
    xpReward: 100
  },

  phrases: [
    { de: 'Was hast du gestern gemacht?',        ru: 'Что ты делал вчера?',              note: 'gestern — вчера; machen → gemacht', audio: 'Was hast du gestern gemacht' },
    { de: 'Ich habe Deutsch gelernt.',           ru: 'Я учил немецкий.',                 note: 'lernen → gelernt (ge- + -t)', audio: 'Ich habe Deutsch gelernt' },
    { de: 'Wir haben Pizza gegessen.',           ru: 'Мы ели пиццу.',                    note: 'essen → gegessen (неправильный)', audio: 'Wir haben Pizza gegessen' },
    { de: 'Er hat Fußball gespielt.',            ru: 'Он играл в футбол.',               note: 'spielen → gespielt', audio: 'Er hat Fußball gespielt' },
    { de: 'Ich habe einen Film gesehen.',        ru: 'Я посмотрел фильм.',               note: 'sehen → gesehen', audio: 'Ich habe einen Film gesehen' },
    { de: 'Sie hat ein Buch gelesen.',           ru: 'Она читала книгу.',                note: 'lesen → gelesen', audio: 'Sie hat ein Buch gelesen' },
    { de: 'Ich bin nach Hause gegangen.',        ru: 'Я пошёл домой.',                   note: 'движение → sein: bin gegangen', audio: 'Ich bin nach Hause gegangen' },
    { de: 'Wir sind nach Berlin gefahren.',      ru: 'Мы поехали в Берлин.',             note: 'fahren → (sein) gefahren', audio: 'Wir sind nach Berlin gefahren' },
    { de: 'Bist du gut angekommen?',             ru: 'Ты хорошо доехал?',                note: 'ankommen → angekommen', audio: 'Bist du gut angekommen' },
    { de: 'Ich habe gut geschlafen.',            ru: 'Я хорошо спал.',                   note: 'schlafen → geschlafen', audio: 'Ich habe gut geschlafen' },
    { de: 'Was hast du gekauft?',                ru: 'Что ты купил?',                    note: 'kaufen → gekauft', audio: 'Was hast du gekauft' },
    { de: 'Ich habe Brot und Käse gekauft.',     ru: 'Я купил хлеб и сыр.',              note: 'Perfekt: haben на 2-м месте, Partizip в конце', audio: 'Ich habe Brot und Käse gekauft' },
    { de: 'Er ist spät aufgestanden.',           ru: 'Он поздно встал.',                 note: 'aufstehen → (sein) aufgestanden', audio: 'Er ist spät aufgestanden' },
    { de: 'Wir haben viel gelacht.',             ru: 'Мы много смеялись.',               note: 'lachen → gelacht', audio: 'Wir haben viel gelacht' },
    { de: 'Ich habe mit meiner Mutter telefoniert.', ru: 'Я говорил по телефону с мамой.', note: 'telefonieren → telefoniert (без ge-!)', audio: 'Ich habe mit meiner Mutter telefoniert' },
    { de: 'Am Wochenende bin ich zu Hause geblieben.', ru: 'На выходных я остался дома.', note: 'bleiben → (sein) geblieben', audio: 'Am Wochenende bin ich zu Hause geblieben' }
  ],

  vocabulary: [
    { de: 'machen → gemacht',        ru: 'делать → сделал',     ipa: '[ɡəˈmaxt]',        article: '' },
    { de: 'lernen → gelernt',        ru: 'учить → учил',        ipa: '[ɡəˈlɛʁnt]',       article: '' },
    { de: 'spielen → gespielt',      ru: 'играть → играл',      ipa: '[ɡəˈʃpiːlt]',      article: '' },
    { de: 'kaufen → gekauft',        ru: 'покупать → купил',    ipa: '[ɡəˈkaʊ̯ft]',      article: '' },
    { de: 'essen → gegessen',        ru: 'есть → ел',           ipa: '[ɡəˈɡɛsn̩]',       article: '' },
    { de: 'sehen → gesehen',         ru: 'видеть → видел',      ipa: '[ɡəˈzeːən]',       article: '' },
    { de: 'lesen → gelesen',         ru: 'читать → читал',      ipa: '[ɡəˈleːzn̩]',      article: '' },
    { de: 'schlafen → geschlafen',   ru: 'спать → спал',        ipa: '[ɡəˈʃlaːfn̩]',     article: '' },
    { de: 'trinken → getrunken',     ru: 'пить → пил',          ipa: '[ɡəˈtʁʊŋkn̩]',     article: '' },
    { de: 'gehen → gegangen',        ru: 'идти → пошёл (sein)', ipa: '[ɡəˈɡaŋən]',       article: '' },
    { de: 'fahren → gefahren',       ru: 'ехать → поехал (sein)', ipa: '[ɡəˈfaːʁən]',    article: '' },
    { de: 'kommen → gekommen',       ru: 'приходить → пришёл (sein)', ipa: '[ɡəˈkɔmən]', article: '' },
    { de: 'bleiben → geblieben',     ru: 'оставаться → остался (sein)', ipa: '[ɡəˈbliːbn̩]', article: '' },
    { de: 'gestern',                 ru: 'вчера',               ipa: '[ˈɡɛstɐn]',        article: '' },
    { de: 'heute',                   ru: 'сегодня',             ipa: '[ˈhɔɪ̯tə]',        article: '' },
    { de: 'das Wochenende',          ru: 'выходные',            ipa: '[ˈvɔxn̩ˌʔɛndə]',   article: 'das' },
    { de: 'lachen',                  ru: 'смеяться',            ipa: '[ˈlaxn̩]',         article: '' },
    { de: 'zu Hause',                ru: 'дома',                ipa: '[tsuː ˈhaʊ̯zə]',   article: '' }
  ],

  grammar: [
    {
      title: '⚡ Perfekt = haben/sein + Partizip II',
      body: 'О прошлом в разговоре немцы говорят в <strong>Perfekt</strong>:<br><br>' +
            '<em>Ich <strong>habe</strong> Pizza <strong>gegessen</strong>.</em> — Я ел пиццу.<br><br>' +
            'Вспомогательный глагол (haben/sein) — на <strong>2-м месте</strong>, Partizip II — <strong>в конце</strong>.<br><br>' +
            'Правильные глаголы: <strong>ge- + корень + -t</strong>: <em>machen → gemacht</em>.',
      conjugation: [
        { pronoun: 'machen',  form: 'Ich habe … gemacht',  audio: 'Ich habe das gemacht',   translation: 'я сделал' },
        { pronoun: 'lernen',  form: 'Ich habe … gelernt',  audio: 'Ich habe Deutsch gelernt', translation: 'я учил' },
        { pronoun: 'kaufen',  form: 'Ich habe … gekauft',  audio: 'Ich habe Brot gekauft',  translation: 'я купил' },
        { pronoun: 'spielen', form: 'Ich habe … gespielt', audio: 'Ich habe Fußball gespielt', translation: 'я играл' }
      ]
    },
    {
      title: '⚡ haben или sein?',
      body: 'Большинство глаголов образуют Perfekt с <strong>haben</strong>. С <strong>sein</strong> — глаголы <strong>движения</strong> и <strong>смены состояния</strong>:<br><br>' +
            '<em>Ich <strong>bin</strong> nach Hause <strong>gegangen</strong>.</em> — Я пошёл домой.<br>' +
            '<em>Wir <strong>sind</strong> nach Berlin <strong>gefahren</strong>.</em> — Мы поехали в Берлин.<br><br>' +
            'Запомни с sein: gehen, fahren, kommen, fliegen, aufstehen, bleiben (исключение!).',
      conjugation: [
        { pronoun: 'gehen',     form: 'Ich bin gegangen.',     audio: 'Ich bin gegangen',     translation: 'я пошёл' },
        { pronoun: 'fahren',    form: 'Wir sind gefahren.',    audio: 'Wir sind gefahren',    translation: 'мы поехали' },
        { pronoun: 'kommen',    form: 'Er ist gekommen.',      audio: 'Er ist gekommen',      translation: 'он пришёл' },
        { pronoun: 'bleiben',   form: 'Ich bin geblieben.',    audio: 'Ich bin geblieben',    translation: 'я остался' },
        { pronoun: 'aufstehen', form: 'Sie ist aufgestanden.', audio: 'Sie ist aufgestanden', translation: 'она встала' }
      ]
    },
    {
      title: '💡 Неправильные Partizip II',
      body: 'Сильные глаголы образуют Partizip II на <strong>-en</strong>, часто с изменением корня — учи их наизусть:<br><br>' +
            '<em>essen → ge<strong>gess</strong>en, trinken → ge<strong>trunk</strong>en, sehen → gesehen, lesen → gelesen</em><br><br>' +
            '⚠️ Глаголы на <strong>-ieren</strong> — без ge-: <em>telefonieren → telefoniert</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Was hast du gestern',  blank: 'gemacht',    after: '?',                     translation: '— Что ты делал вчера?',              hintWord: 'gemacht',    hintRule: 'machen → ge-mach-t' },
      { before: '— Ich habe Deutsch',     blank: 'gelernt',    after: '.',                     translation: '— Я учил немецкий.',                 hintWord: 'gelernt',    hintRule: 'lernen → gelernt' },
      { before: '— Wir haben Pizza',      blank: 'gegessen',   after: '.',                     translation: '— Мы ели пиццу.',                    hintWord: 'gegessen',   hintRule: 'essen → gegessen (неправ.)' },
      { before: '— Ich',                  blank: 'bin',        after: 'nach Hause gegangen.',  translation: '— Я пошёл домой.',                   hintWord: 'bin',        hintRule: 'движение → sein' },
      { before: '— Sie hat ein Buch',     blank: 'gelesen',    after: '.',                     translation: '— Она читала книгу.',                hintWord: 'gelesen',    hintRule: 'lesen → gelesen' },
      { before: '— Wir',                  blank: 'sind',       after: 'nach Berlin gefahren.', translation: '— Мы поехали в Берлин.',             hintWord: 'sind',       hintRule: 'fahren → с sein' },
      { before: '— Ich habe gut',         blank: 'geschlafen', after: '.',                     translation: '— Я хорошо спал.',                   hintWord: 'geschlafen', hintRule: 'schlafen → geschlafen' },
      { before: '— Was hast du',          blank: 'gekauft',    after: '?',                     translation: '— Что ты купил?',                    hintWord: 'gekauft',    hintRule: 'kaufen → gekauft' }
    ],

    multipleChoice: [
      { question: 'Perfekt от «machen»…',                      options: ['gemachen', 'gemacht', 'machte', 'gemact'],                   correctIndex: 1 },
      { question: 'Perfekt от «essen»…',                       options: ['geesst', 'gegessen', 'geessen', 'gessen'],                   correctIndex: 1 },
      { question: 'С чем образуется Perfekt глагола «gehen»?', options: ['с haben', 'с sein', 'с werden', 'без вспомогательного'],     correctIndex: 1 },
      { question: 'Где стоит Partizip II в предложении?',      options: ['на 1-м месте', 'на 2-м месте', 'в конце', 'после подлежащего'], correctIndex: 2 },
      { question: '«Ich bin geblieben» значит…',               options: ['я ушёл', 'я остался', 'я приехал', 'я встал'],               correctIndex: 1 },
      { question: 'Какой глагол образует Partizip II без ge-?', options: ['machen', 'telefonieren', 'kaufen', 'spielen'],              correctIndex: 1 },
      { question: '«Gestern» значит…',                         options: ['сегодня', 'вчера', 'завтра', 'сейчас'],                      correctIndex: 1 },
      { question: 'Perfekt от «trinken»…',                     options: ['getrinkt', 'getrunken', 'getrinken', 'trank'],               correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'machen',   ru: 'gemacht' },
      { id: 2, de: 'essen',    ru: 'gegessen' },
      { id: 3, de: 'sehen',    ru: 'gesehen' },
      { id: 4, de: 'gehen',    ru: 'gegangen (sein)' },
      { id: 5, de: 'fahren',   ru: 'gefahren (sein)' },
      { id: 6, de: 'lesen',    ru: 'gelesen' },
      { id: 7, de: 'trinken',  ru: 'getrunken' },
      { id: 8, de: 'bleiben',  ru: 'geblieben (sein)' }
    ],

    dictation: [
      { word: 'gemacht',    audio: 'gemacht' },
      { word: 'gelernt',    audio: 'gelernt' },
      { word: 'gegessen',   audio: 'gegessen' },
      { word: 'gegangen',   audio: 'gegangen' },
      { word: 'gefahren',   audio: 'gefahren' },
      { word: 'gekauft',    audio: 'gekauft' },
      { word: 'gestern',    audio: 'gestern' },
      { word: 'geblieben',  audio: 'geblieben' }
    ]
  }
};
