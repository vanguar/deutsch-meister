/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-05.js
   B1 · Урок 5: Infinitivkonstruktionen — zu + Infinitiv
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-05',
  level:    'B1',
  unit:     5,
  title:    'Infinitivkonstruktionen',
  subtitle: 'Конструкции с zu + Infinitiv · um zu, ohne zu, statt zu',

  meta: {
    duration:  '30–35 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Es ist wichtig, Deutsch zu lernen.',              ru: 'Важно учить немецкий.',                          note: 'zu + Infinitiv после прилагательного', audio: 'Es ist wichtig, Deutsch zu lernen' },
    { de: 'Ich versuche, jeden Tag zu üben.',                ru: 'Я стараюсь заниматься каждый день.',             note: 'versuchen + zu + Infinitiv', audio: 'Ich versuche, jeden Tag zu üben' },
    { de: 'Er vergisst, die Tür zu schließen.',              ru: 'Он забывает закрывать дверь.',                   note: 'vergessen + zu + Infinitiv', audio: 'Er vergisst, die Tür zu schließen' },
    { de: 'Sie beginnt, Klavier zu spielen.',                ru: 'Она начинает играть на фортепиано.',             note: 'beginnen + zu + Infinitiv', audio: 'Sie beginnt, Klavier zu spielen' },
    { de: 'Ich hoffe, dich bald zu sehen.',                  ru: 'Надеюсь скоро тебя увидеть.',                   note: 'hoffen + zu + Infinitiv (без запятой в разг. языке)', audio: 'Ich hoffe, dich bald zu sehen' },
    { de: 'Er hat keine Zeit, sich zu erholen.',             ru: 'У него нет времени отдохнуть.',                  note: 'keine Zeit haben + zu + Inf.', audio: 'Er hat keine Zeit, sich zu erholen' },
    { de: 'Ich lerne, um Deutsch zu sprechen.',              ru: 'Я учусь, чтобы говорить по-немецки.',            note: 'um … zu — цель', audio: 'Ich lerne, um Deutsch zu sprechen' },
    { de: 'Sie fährt nach Berlin, um Freunde zu besuchen.', ru: 'Она едет в Берлин, чтобы навестить друзей.',     note: 'um … zu — цель движения', audio: 'Sie fährt nach Berlin, um Freunde zu besuchen' },
    { de: 'Er ging weg, ohne ein Wort zu sagen.',            ru: 'Он ушёл, не сказав ни слова.',                  note: 'ohne … zu — без того чтобы', audio: 'Er ging weg, ohne ein Wort zu sagen' },
    { de: 'Sie antwortet, ohne nachzudenken.',               ru: 'Она отвечает, не думая.',                        note: 'без запятой после без. Глагол с приставкой: nachzu-denken', audio: 'Sie antwortet, ohne nachzudenken' },
    { de: 'Er arbeitet, statt zu schlafen.',                 ru: 'Он работает вместо того, чтобы спать.',          note: 'statt … zu — вместо того чтобы', audio: 'Er arbeitet, statt zu schlafen' },
    { de: 'Es ist schön, hier zu sein.',                     ru: 'Хорошо быть здесь.',                            note: 'Es ist … + zu + Inf. — безличная конструкция', audio: 'Es ist schön, hier zu sein' },
    { de: 'Es macht Spaß, Deutsch zu lernen.',               ru: 'Учить немецкий — это весело.',                  note: 'Spaß machen + zu + Inf.', audio: 'Es macht Spaß, Deutsch zu lernen' },
    { de: 'Ich bitte dich, pünktlich zu kommen.',            ru: 'Прошу тебя прийти вовремя.',                    note: 'bitten + jdn. + zu + Inf.', audio: 'Ich bitte dich, pünktlich zu kommen' },
    { de: 'Er empfiehlt mir, früh aufzustehen.',             ru: 'Он советует мне рано вставать.',                note: 'empfehlen + Dat. + zu. Отделяемый: aufzu-stehen', audio: 'Er empfiehlt mir, früh aufzustehen' },
    { de: 'Sie erlaubt mir, hier zu warten.',                ru: 'Она разрешает мне здесь ждать.',                note: 'erlauben + Dat. + zu + Inf.', audio: 'Sie erlaubt mir, hier zu warten' },
    { de: 'Es ist verboten, hier zu rauchen.',               ru: 'Здесь курить запрещено.',                       note: 'verboten + zu + Inf. = запрет', audio: 'Es ist verboten, hier zu rauchen' },
    { de: 'Ich freue mich, dich zu sehen.',                  ru: 'Я рад тебя видеть.',                            note: 'sich freuen + zu + Inf.', audio: 'Ich freue mich, dich zu sehen' },
    { de: 'Sie hat beschlossen abzunehmen.',                 ru: 'Она решила похудеть.',                          note: 'beschließen + zu + Inf. Отделяемый: abzu-nehmen', audio: 'Sie hat beschlossen abzunehmen' },
    { de: 'Es ist Zeit zu gehen.',                           ru: 'Пора идти.',                                    note: 'Es ist Zeit + zu + Inf.', audio: 'Es ist Zeit zu gehen' },
    { de: 'Ich habe vergessen, ihn anzurufen.',              ru: 'Я забыл ему позвонить.',                        note: 'vergessen + zu. Отделяемый: anzu-rufen', audio: 'Ich habe vergessen, ihn anzurufen' },
    { de: 'Er plant, nach Wien zu reisen.',                  ru: 'Он планирует поехать в Вену.',                  note: 'planen + zu + Inf.', audio: 'Er plant, nach Wien zu reisen' },
    { de: 'Es ist nicht leicht, eine Sprache zu lernen.',    ru: 'Нелегко учить язык.',                          note: 'nicht leicht + zu + Inf.', audio: 'Es ist nicht leicht, eine Sprache zu lernen' },
    { de: 'Ich bin froh, geholfen zu haben.',                ru: 'Я рад, что помог.',                             note: 'Inf. Perfekt: geholfen zu haben (действие до главного)', audio: 'Ich bin froh, geholfen zu haben' }
  ],

  vocabulary: [
    { de: 'zu + Infinitiv',    ru: 'инфинитив с частицей zu',  ipa: '[tsuː]',            article: '' },
    { de: 'um … zu',           ru: 'чтобы (цель)',             ipa: '[ʊm … tsuː]',       article: '' },
    { de: 'ohne … zu',         ru: 'без того чтобы, не…',     ipa: '[ˈoːnə … tsuː]',    article: '' },
    { de: 'statt … zu',        ru: 'вместо того чтобы',       ipa: '[ʃtat … tsuː]',     article: '' },
    { de: 'versuchen',         ru: 'стараться, пытаться',      ipa: '[fɛʁˈzuːxn̩]',      article: '' },
    { de: 'vergessen',         ru: 'забывать',                 ipa: '[fɛʁˈɡɛsn̩]',       article: '' },
    { de: 'hoffen',            ru: 'надеяться',                ipa: '[ˈhɔfn̩]',           article: '' },
    { de: 'beginnen',          ru: 'начинать',                 ipa: '[bəˈɡɪnən]',        article: '' },
    { de: 'sich erholen',      ru: 'отдыхать, восстанавливаться', ipa: '[ɛʁˈhoːlən]',   article: '' },
    { de: 'empfehlen',         ru: 'рекомендовать',            ipa: '[ɛmˈpfeːlən]',      article: '' },
    { de: 'erlauben',          ru: 'разрешать',                ipa: '[ɛʁˈlaʊ̯bn̩]',       article: '' },
    { de: 'beschließen',       ru: 'решать (принять решение)', ipa: '[bəˈʃliːsn̩]',      article: '' },
    { de: 'planen',            ru: 'планировать',              ipa: '[ˈplaːnən]',         article: '' },
    { de: 'bitten',            ru: 'просить',                  ipa: '[ˈbɪtn̩]',           article: '' },
    { de: 'sich freuen',       ru: 'радоваться',               ipa: '[ˈfʁɔɪ̯ən]',         article: '' },
    { de: 'abnehmen',          ru: 'худеть, убирать',          ipa: '[ˈapˌneːmən]',      article: '' },
    { de: 'nachdenken',        ru: 'думать, размышлять',       ipa: '[ˈnaːxˌdɛŋkn̩]',    article: '' },
    { de: 'aufstehen',         ru: 'вставать',                 ipa: '[ˈaʊ̯fˌʃteːən]',    article: '' },
    { de: 'anrufen',           ru: 'звонить по телефону',      ipa: '[ˈanˌʁuːfn̩]',      article: '' },
    { de: 'verboten',          ru: 'запрещённый',              ipa: '[fɛʁˈboːtn̩]',       article: '' },
    { de: 'pünktlich',         ru: 'вовремя',                  ipa: '[ˈpʏŋktlɪç]',       article: '' },
    { de: 'der Spaß',          ru: 'удовольствие, веселье',    ipa: '[ʃpaːs]',            article: 'der' },
    { de: 'leicht',            ru: 'лёгкий, легко',            ipa: '[laɪ̯çt]',           article: '' },
    { de: 'der Infinitiv',     ru: 'инфинитив',                ipa: '[ɪnfiˈniːtɪf]',     article: '' }
  ],

  grammar: [
    {
      title: '⚡ zu + Infinitiv — базовая конструкция',
      body: 'Инфинитив с <strong>zu</strong> используется после многих глаголов, прилагательных и существительных:<br><br>' +
            '<em>Ich <strong>versuche</strong>, Deutsch zu lernen.</em><br>' +
            '<em>Es ist <strong>wichtig</strong>, zu üben.</em><br>' +
            '<em>Es macht <strong>Spaß</strong>, zu reisen.</em><br><br>' +
            '⚠️ <strong>zu</strong> ставится <em>перед</em> инфинитивом. При отделяемых глаголах — <em>между</em> приставкой и основой: <strong>auf|zu|stehen</strong>.',
      conjugation: [
        { pronoun: 'versuchen',   form: 'zu lernen',    audio: 'versuchen zu lernen',    translation: 'стараться учить' },
        { pronoun: 'beginnen',    form: 'zu spielen',   audio: 'beginnen zu spielen',   translation: 'начинать играть' },
        { pronoun: 'vergessen',   form: 'zu schließen', audio: 'vergessen zu schließen', translation: 'забывать закрывать' },
        { pronoun: 'hoffen',      form: 'zu kommen',    audio: 'hoffen zu kommen',      translation: 'надеяться прийти' },
        { pronoun: 'Es ist schön',form: 'hier zu sein', audio: 'Es ist schön hier zu sein', translation: 'хорошо быть здесь' },
        { pronoun: 'aufstehen →', form: 'aufzu|stehen', audio: 'aufzustehen',            translation: 'вставать (отделяемый)' }
      ]
    },
    {
      title: '⚡ um zu / ohne zu / statt zu',
      body: '<strong>um … zu</strong> — цель («чтобы»). Субъект должен быть <em>один и тот же</em>!<br>' +
            '<em>Ich lerne, <strong>um</strong> Deutsch zu sprechen.</em><br><br>' +
            '<strong>ohne … zu</strong> — «не делая, без того чтобы»:<br>' +
            '<em>Er geht weg, <strong>ohne</strong> ein Wort zu sagen.</em><br><br>' +
            '<strong>statt … zu</strong> — «вместо того чтобы»:<br>' +
            '<em>Er schläft, <strong>statt</strong> zu arbeiten.</em><br><br>' +
            'Все три конструкции выделяются запятой.'
    },
    {
      title: '💡 Когда НЕ нужно zu',
      body: 'После <strong>модальных глаголов</strong> (müssen, können, wollen…) — <em>без zu</em>:<br>' +
            '<em>Ich <strong>muss</strong> lernen.</em> (не «zu lernen»!)<br><br>' +
            'После <strong>lassen, sehen, hören, helfen</strong>:<br>' +
            '<em>Ich <strong>höre</strong> sie singen.</em><br>' +
            '<em>Ich <strong>lasse</strong> ihn reden.</em><br><br>' +
            'После <strong>werden</strong> (Futur):<br>' +
            '<em>Ich <strong>werde</strong> lernen.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Es ist wichtig,',         blank: 'zu',      after: 'üben.',                     translation: '— Важно заниматься.',               hintWord: 'zu',      hintRule: 'zu + Infinitiv после «wichtig»' },
      { before: '— Ich lerne,',              blank: 'um',      after: 'Deutsch zu sprechen.',      translation: '— Я учусь, чтобы говорить по-немецки.', hintWord: 'um',   hintRule: 'um … zu — цель' },
      { before: '— Er ging,',                blank: 'ohne',    after: 'ein Wort zu sagen.',        translation: '— Он ушёл, не сказав ни слова.',    hintWord: 'ohne',    hintRule: 'ohne … zu — без того чтобы' },
      { before: '— Er schläft,',             blank: 'statt',   after: 'zu arbeiten.',              translation: '— Он спит вместо того, чтобы работать.', hintWord: 'statt', hintRule: 'statt … zu — вместо' },
      { before: '— Er empfiehlt mir früh',   blank: 'aufzustehen', after: '.',                     translation: '— Он советует мне рано вставать.',  hintWord: 'aufzustehen', hintRule: 'отделяемый: auf-zu-stehen' },
      { before: '— Ich vergesse, ihn',       blank: 'anzurufen', after: '.',                       translation: '— Я забываю ему позвонить.',        hintWord: 'anzurufen', hintRule: 'отделяемый: an-zu-rufen' },
      { before: '— Es macht Spaß,',          blank: 'zu',      after: 'reisen.',                   translation: '— Путешествовать — это весело.',     hintWord: 'zu',      hintRule: 'zu + Infinitiv' },
      { before: '— Ich bin froh, geholfen',  blank: 'zu',      after: 'haben.',                    translation: '— Я рад, что помог.',               hintWord: 'zu',      hintRule: 'Infinitiv Perfekt: geholfen zu haben' }
    ],

    multipleChoice: [
      { question: 'Как вставить zu в «aufstehen»?',                   options: ['zuaufstehen', 'aufzustehen', 'aufstehenz u', 'zu aufstehen'],    correctIndex: 1 },
      { question: '«um … zu» используется, когда…',                   options: ['субъекты разные', 'субъект один', 'глагол отделяемый', 'после модального'], correctIndex: 1 },
      { question: '«ohne … zu» значит…',                              options: ['чтобы', 'вместо', 'без того чтобы / не', 'потому что'],          correctIndex: 2 },
      { question: 'После модального глагола: zu или нет?',             options: ['Да, всегда zu', 'Нет, без zu', 'Только с um', 'Зависит от лица'], correctIndex: 1 },
      { question: '«statt … zu» = …',                                 options: ['чтобы', 'вместо того чтобы', 'не делая', 'потому что'],           correctIndex: 1 },
      { question: '«Ich vergesse, die Tür ___ schließen»',            options: ['zu', 'um zu', 'ohne', 'statt'],                                   correctIndex: 0 },
      { question: 'Инфинитив Perfekt от «helfen»:',                   options: ['zu helfen', 'geholfen zu haben', 'geholfen zu sein', 'helfen zu haben'], correctIndex: 1 },
      { question: '«Es ist verboten» + …',                             options: ['zu + Infinitiv', 'Infinitiv без zu', 'Partizip II', 'Konjunktiv'], correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'um … zu',           ru: 'чтобы (цель)' },
      { id: 2, de: 'ohne … zu',         ru: 'без того чтобы' },
      { id: 3, de: 'statt … zu',        ru: 'вместо того чтобы' },
      { id: 4, de: 'versuchen zu',      ru: 'стараться сделать' },
      { id: 5, de: 'vergessen zu',      ru: 'забывать сделать' },
      { id: 6, de: 'beginnen zu',       ru: 'начинать делать' },
      { id: 7, de: 'aufzustehen',       ru: 'вставать (zu в приставке)' },
      { id: 8, de: 'geholfen zu haben', ru: 'Infinitiv Perfekt от helfen' }
    ],

    dictation: [
      { word: 'versuchen',    audio: 'versuchen' },
      { word: 'vergessen',    audio: 'vergessen' },
      { word: 'aufzustehen',  audio: 'aufzustehen' },
      { word: 'anzurufen',    audio: 'anzurufen' },
      { word: 'beginnen',     audio: 'beginnen' },
      { word: 'erlauben',     audio: 'erlauben' },
      { word: 'verboten',     audio: 'verboten' },
      { word: 'Infinitiv',    audio: 'Infinitiv' }
    ]
  }
};
