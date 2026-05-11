/* ═══════════════════════════════════════════════
   data/a2-lesson-02.js
   A2 · Урок 2: Hobbys und Freizeit — Хобби, свободное время
                Модальные глаголы können, wollen, möchten, mögen
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-02',
  level: 'A2',
  unit:  2,
  title: 'Hobbys und Freizeit',
  subtitle: 'Хобби и свободное время · модальные глаголы',

  meta: {
    duration: '30–35 мин',
    wordCount: 26,
    xpReward: 120
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Was machst du in deiner Freizeit?',     ru: 'Что ты делаешь в свободное время?',         note: 'die Freizeit = свободное время', audio: 'Was machst du in deiner Freizeit' },
    { de: 'Was sind deine Hobbys?',                ru: 'Какие у тебя хобби?',                       note: 'das Hobby — англицизм, ст. с большой', audio: 'Was sind deine Hobbys' },
    { de: 'Ich lese gern Bücher.',                 ru: 'Я люблю читать книги.',                     note: 'gern + глагол = делать с удовольствием', audio: 'Ich lese gern Bücher' },
    { de: 'Ich höre gern Musik.',                  ru: 'Я люблю слушать музыку.',                   note: 'hören = слышать / слушать', audio: 'Ich höre gern Musik' },
    { de: 'Ich kann sehr gut kochen.',             ru: 'Я очень хорошо умею готовить.',             note: 'können = уметь. Инфинитив — в конце!', audio: 'Ich kann sehr gut kochen' },
    { de: 'Ich kann ein bisschen Klavier spielen.',ru: 'Я немного играю на пианино.',               note: 'Klavier spielen — без артикля!', audio: 'Ich kann ein bisschen Klavier spielen' },
    { de: 'Ich möchte Spanisch lernen.',           ru: 'Я хотел бы учить испанский.',               note: 'möchten — вежливое «хотел бы»', audio: 'Ich möchte Spanisch lernen' },
    { de: 'Ich will am Wochenende reisen.',        ru: 'Я хочу путешествовать на выходных.',        note: 'wollen — твёрдое намерение', audio: 'Ich will am Wochenende reisen' },
    { de: 'Ich mag Fußball.',                      ru: 'Мне нравится футбол.',                      note: 'mögen + сущ. в Akk. — нравится что-то', audio: 'Ich mag Fußball' },
    { de: 'Ich spiele zweimal pro Woche Fußball.', ru: 'Я играю в футбол два раза в неделю.',       note: 'zweimal pro Woche = два раза в неделю', audio: 'Ich spiele zweimal pro Woche Fußball' },
    { de: 'Ich gehe oft schwimmen.',               ru: 'Я часто хожу плавать.',                     note: 'gehen + инф. без zu (часто с движением)', audio: 'Ich gehe oft schwimmen' },
    { de: 'Spielst du ein Instrument?',            ru: 'Ты играешь на инструменте?',                note: 'Klavier / Gitarre spielen', audio: 'Spielst du ein Instrument' },
    { de: 'Treibst du Sport?',                     ru: 'Ты занимаешься спортом?',                   note: 'Sport treiben — устойчивое выражение', audio: 'Treibst du Sport' },
    { de: 'Ich treibe gern Sport.',                ru: 'Я люблю заниматься спортом.',               note: 'Sport (без артикля!) treiben', audio: 'Ich treibe gern Sport' },
    { de: 'Wir können ins Kino gehen.',            ru: 'Мы можем пойти в кино.',                    note: 'ins Kino gehen — в кино (Akk.)', audio: 'Wir können ins Kino gehen' },
    { de: 'Ich muss heute lernen.',                ru: 'Мне нужно сегодня учиться.',                note: 'müssen = быть должным, надо', audio: 'Ich muss heute lernen' },
    { de: 'Kannst du Schach spielen?',             ru: 'Ты умеешь играть в шахматы?',               note: 'Schach — без артикля', audio: 'Kannst du Schach spielen' },
    { de: 'Magst du Filme?',                       ru: 'Тебе нравятся фильмы?',                     note: 'mögen + Pl. Akk.', audio: 'Magst du Filme' },
    { de: 'Möchtest du einen Kaffee?',             ru: 'Хочешь кофе?',                              note: 'möchten — вежливое предложение', audio: 'Möchtest du einen Kaffee' },
    { de: 'Heute Abend will ich tanzen gehen.',    ru: 'Сегодня вечером я хочу пойти танцевать.',   note: 'инверсия: время → глагол → подлеж.', audio: 'Heute Abend will ich tanzen gehen' },
    { de: 'Ich darf hier nicht rauchen.',          ru: 'Здесь мне нельзя курить.',                  note: 'dürfen + nicht = нельзя (запрет)', audio: 'Ich darf hier nicht rauchen' },
    { de: 'Wir sollen pünktlich sein.',            ru: 'Мы должны быть пунктуальны.',               note: 'sollen — должен (от чужого требования)', audio: 'Wir sollen pünktlich sein' },
    { de: 'Hast du Lust auf Pizza?',               ru: 'Хочешь пиццы? / Не желаешь?',               note: 'Lust haben auf + Akk. = хотеть чего-то', audio: 'Hast du Lust auf Pizza' },
    { de: 'Das macht Spaß!',                       ru: 'Это весело! / Это в кайф!',                 note: 'Spaß machen — приносить удовольствие', audio: 'Das macht Spaß' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'können',          ru: 'мочь, уметь',           ipa: '[ˈkœnən]',           article: '' },
    { de: 'wollen',          ru: 'хотеть',                ipa: '[ˈvɔlən]',           article: '' },
    { de: 'möchten',         ru: 'хотел бы',              ipa: '[ˈmœçtn̩]',          article: '' },
    { de: 'mögen',           ru: 'нравиться',             ipa: '[ˈmøːɡn̩]',          article: '' },
    { de: 'müssen',          ru: 'быть должным',          ipa: '[ˈmʏsn̩]',           article: '' },
    { de: 'dürfen',          ru: 'мочь (разрешено)',      ipa: '[ˈdʏʁfn̩]',          article: '' },
    { de: 'sollen',          ru: 'быть должным (внешн.)', ipa: '[ˈzɔlən]',           article: '' },
    { de: 'die Freizeit',    ru: 'свободное время',       ipa: '[ˈfʁaɪ̯ˌtsaɪ̯t]',    article: 'die' },
    { de: 'das Hobby',       ru: 'хобби',                 ipa: '[ˈhɔbi]',            article: 'das' },
    { de: 'der Sport',       ru: 'спорт',                 ipa: '[ʃpɔʁt]',            article: 'der' },
    { de: 'die Musik',       ru: 'музыка',                ipa: '[muˈziːk]',          article: 'die' },
    { de: 'der Film',        ru: 'фильм',                 ipa: '[fɪlm]',             article: 'der' },
    { de: 'das Buch',        ru: 'книга',                 ipa: '[buːx]',             article: 'das' },
    { de: 'das Klavier',     ru: 'пианино',               ipa: '[klaˈviːɐ̯]',        article: 'das' },
    { de: 'die Gitarre',     ru: 'гитара',                ipa: '[ɡiˈtaʁə]',          article: 'die' },
    { de: 'das Schach',      ru: 'шахматы',               ipa: '[ʃax]',              article: 'das' },
    { de: 'der Fußball',     ru: 'футбол',                ipa: '[ˈfuːsbal]',         article: 'der' },
    { de: 'schwimmen',       ru: 'плавать',               ipa: '[ˈʃvɪmən]',          article: '' },
    { de: 'tanzen',          ru: 'танцевать',             ipa: '[ˈtantsn̩]',         article: '' },
    { de: 'kochen',          ru: 'готовить',              ipa: '[ˈkɔxn̩]',           article: '' },
    { de: 'lesen',           ru: 'читать',                ipa: '[ˈleːzn̩]',          article: '' },
    { de: 'lernen',          ru: 'учить, изучать',        ipa: '[ˈlɛʁnən]',          article: '' },
    { de: 'spielen',         ru: 'играть',                ipa: '[ˈʃpiːlən]',         article: '' },
    { de: 'treiben',         ru: 'заниматься (спортом)',  ipa: '[ˈtʁaɪ̯bn̩]',        article: '' },
    { de: 'gern',            ru: 'охотно, с удов.',       ipa: '[ɡɛʁn]',             article: '' },
    { de: 'der Spaß',        ru: 'удовольствие',          ipa: '[ʃpaːs]',            article: 'der' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Модальные глаголы: основа A2',
      body: 'Модальные глаголы выражают <strong>возможность, желание, необходимость</strong>. Они всегда работают в паре: <strong>модальный глагол на 2-м месте + основной инфинитив в самом конце</strong>:<br><br>' +
            '<em>Ich <strong>kann</strong> sehr gut <strong>kochen</strong>.</em> — Я умею хорошо готовить.<br>' +
            '<em>Wir <strong>möchten</strong> heute ins Kino <strong>gehen</strong>.</em> — Мы хотели бы сегодня в кино.<br>' +
            '<em>Du <strong>musst</strong> mehr <strong>lernen</strong>.</em> — Тебе нужно больше учить.<br><br>' +
            '⚠️ Особенность всех модальных: <strong>ich = er/sie/es</strong> (одна форма!): <em>ich kann · er kann</em>.<br>' +
            '⚠️ В <em>ich/er</em>-форме окончания нет: <strong>kann</strong>, не *kanne.',
      conjugation: [
        { pronoun: 'ich',           form: 'kann',   audio: 'ich kann',   translation: 'я могу / умею' },
        { pronoun: 'du',            form: 'kannst', audio: 'du kannst',  translation: 'ты можешь' },
        { pronoun: 'er / sie / es', form: 'kann',   audio: 'er kann',    translation: 'он/она может' },
        { pronoun: 'wir',           form: 'können', audio: 'wir können', translation: 'мы можем' },
        { pronoun: 'ihr',           form: 'könnt',  audio: 'ihr könnt',  translation: 'вы можете' },
        { pronoun: 'Sie / sie',     form: 'können', audio: 'Sie können', translation: 'Вы / они могут' }
      ]
    },
    {
      title: '⚡ wollen vs möchten — «хочу» с разной силой',
      body: '<strong>wollen</strong> — твёрдое, решительное «хочу». Не груб, но прямолинеен:<br>' +
            '<em>Ich <strong>will</strong> jetzt nach Hause.</em> — Я хочу сейчас домой.<br><br>' +
            '<strong>möchten</strong> — вежливое «хотел бы». Чаще в магазинах, кафе, при просьбах:<br>' +
            '<em>Ich <strong>möchte</strong> einen Kaffee, bitte.</em> — Я хотел бы кофе, пожалуйста.<br><br>' +
            '👉 Правило вежливости: в ресторане/магазине — всегда <strong>möchten</strong>. <em>Wollen</em> там звучит резковато.',
      conjugation: [
        { pronoun: 'ich',           form: 'möchte / will',     audio: 'ich möchte ich will',   translation: 'я хотел бы / хочу' },
        { pronoun: 'du',            form: 'möchtest / willst', audio: 'du möchtest du willst', translation: 'ты хотел бы / хочешь' },
        { pronoun: 'er / sie / es', form: 'möchte / will',     audio: 'er möchte er will',     translation: 'он хотел бы / хочет' },
        { pronoun: 'wir',           form: 'möchten / wollen',  audio: 'wir möchten wir wollen', translation: 'мы хотели бы / хотим' },
        { pronoun: 'ihr',           form: 'möchtet / wollt',   audio: 'ihr möchtet ihr wollt', translation: 'вы хотели бы / хотите' },
        { pronoun: 'Sie / sie',     form: 'möchten / wollen',  audio: 'Sie möchten Sie wollen', translation: 'Вы / они хотят' }
      ]
    },
    {
      title: '⚡ mögen — «нравится» без инфинитива',
      body: 'У <strong>mögen</strong> особая роль: чаще он стоит <strong>без инфинитива</strong> и просто говорит о вкусах:<br><br>' +
            '<em>Ich <strong>mag</strong> Schokolade.</em> — Мне нравится шоколад.<br>' +
            '<em>Magst du Hunde?</em> — Тебе нравятся собаки?<br>' +
            '<em>Er mag keinen Kaffee.</em> — Он не любит кофе.<br><br>' +
            'Когда хочется «<em>любить делать</em>» что-то — берём <strong>gern + обычный глагол</strong>:<br>' +
            '<em>Ich lese <strong>gern</strong>.</em> — Я люблю читать.<br>' +
            '<em>Er kocht <strong>gern</strong>.</em> — Он любит готовить.',
      conjugation: [
        { pronoun: 'ich',           form: 'mag',   audio: 'ich mag',   translation: 'мне нравится' },
        { pronoun: 'du',            form: 'magst', audio: 'du magst',  translation: 'тебе нравится' },
        { pronoun: 'er / sie / es', form: 'mag',   audio: 'er mag',    translation: 'ему / ей нравится' },
        { pronoun: 'wir',           form: 'mögen', audio: 'wir mögen', translation: 'нам нравится' },
        { pronoun: 'ihr',           form: 'mögt',  audio: 'ihr mögt',  translation: 'вам нравится' },
        { pronoun: 'Sie / sie',     form: 'mögen', audio: 'Sie mögen', translation: 'Вам / им нравится' }
      ]
    },
    {
      title: '💡 Порядок слов с модальными: «рамка»',
      body: 'Модальные строят знаменитую <strong>немецкую рамку</strong> (Satzklammer): один глагол в начале, другой в конце:<br><br>' +
            '<em>Ich</em> &nbsp;<strong>will</strong>&nbsp; <em>heute Abend mit Anna ins Kino</em> &nbsp;<strong>gehen</strong>.<br>' +
            '«wollen» открывает рамку, «gehen» её закрывает — всё, что внутри, втиснуто между ними.<br><br>' +
            'В вопросе модальный — на 1-м месте:<br>' +
            '<em><strong>Kannst</strong> du Klavier <strong>spielen</strong>?</em><br>' +
            '<em><strong>Magst</strong> du Pizza?</em> (без инфинитива — тоже ок)<br><br>' +
            '⚠️ Запомни: основной глагол в инфинитиве, не спрягается!'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich',         blank: 'kann',    after: 'sehr gut kochen.',        translation: '— Я очень хорошо умею готовить.',     hintWord: 'kann',    hintRule: 'können для ich → kann (без окончания!)' },
      { before: '— Wir',         blank: 'möchten', after: 'einen Kaffee, bitte.',    translation: '— Мы хотели бы кофе, пожалуйста.',     hintWord: 'möchten', hintRule: 'wir → möchten (вежливое «хотели бы»)' },
      { before: '—',             blank: 'Magst',   after: 'du Pizza?',               translation: '— Тебе нравится пицца?',               hintWord: 'Magst',   hintRule: 'mögen → du magst (без инф., только вкус)' },
      { before: '— Er',          blank: 'will',    after: 'heute lernen.',           translation: '— Он хочет сегодня учиться.',          hintWord: 'will',    hintRule: 'wollen для er → will (одно слово, как ich)' },
      { before: '— Ich lese',    blank: 'gern',    after: 'Bücher.',                 translation: '— Я люблю читать книги.',              hintWord: 'gern',    hintRule: 'gern + обычный глагол = делать с удов.' },
      { before: '— Du',          blank: 'musst',   after: 'mehr üben.',              translation: '— Тебе нужно больше тренироваться.',   hintWord: 'musst',   hintRule: 'müssen → du musst' },
      { before: '— Hier',        blank: 'darf',    after: 'man nicht rauchen.',      translation: '— Здесь нельзя курить.',               hintWord: 'darf',    hintRule: 'dürfen + nicht = нельзя' },
      { before: '— Ich kann ein bisschen Klavier', blank: 'spielen', after: '.',     translation: '— Я немного играю на пианино.',        hintWord: 'spielen', hintRule: 'основной глагол — инфинитив в самом конце' }
    ],

    multipleChoice: [
      { question: 'Какая форма «können» для «ich»?',                                  options: ['könne', 'kann', 'kannt', 'könnt'],                                    correctIndex: 1 },
      { question: 'Что вежливее: «Хочу кофе»?',                                       options: ['Ich will Kaffee.', 'Ich möchte Kaffee.', 'Ich mag Kaffee.', 'Ich kann Kaffee.'], correctIndex: 1 },
      { question: 'Где правильное место инфинитива?',                                 options: ['Ich kann spielen Klavier.', 'Ich spielen kann Klavier.', 'Ich kann Klavier spielen.', 'Ich Klavier kann spielen.'], correctIndex: 2 },
      { question: 'Какой глагол выражает запрет с «nicht»?',                          options: ['können', 'wollen', 'dürfen', 'mögen'],                                correctIndex: 2 },
      { question: 'Как сказать «Я люблю читать»?',                                    options: ['Ich mag lesen.', 'Ich will lesen.', 'Ich lese gern.', 'Ich kann lesen.'], correctIndex: 2 },
      { question: 'Какая форма «mögen» для «du»?',                                    options: ['mögst', 'magst', 'mögest', 'magest'],                                 correctIndex: 1 },
      { question: 'Что значит «Sport treiben»?',                                      options: ['покупать спорт', 'заниматься спортом', 'смотреть спорт', 'учить спорт'], correctIndex: 1 },
      { question: 'Какое окончание у «müssen» для «wir»?',                            options: ['müsse', 'musst', 'müsst', 'müssen'],                                  correctIndex: 3 }
    ],

    matching: [
      { id: 1, de: 'können',         ru: 'мочь, уметь' },
      { id: 2, de: 'wollen',         ru: 'хотеть (твёрдо)' },
      { id: 3, de: 'möchten',        ru: 'хотел бы (вежливо)' },
      { id: 4, de: 'mögen',          ru: 'нравиться' },
      { id: 5, de: 'müssen',         ru: 'быть должным' },
      { id: 6, de: 'dürfen',         ru: 'мочь (разрешено)' },
      { id: 7, de: 'Sport treiben',  ru: 'заниматься спортом' },
      { id: 8, de: 'Spaß machen',    ru: 'приносить удовольствие' }
    ],

    dictation: [
      { word: 'Freizeit',  audio: 'Freizeit' },
      { word: 'Hobby',     audio: 'Hobby' },
      { word: 'können',    audio: 'können' },
      { word: 'möchten',   audio: 'möchten' },
      { word: 'spielen',   audio: 'spielen' },
      { word: 'schwimmen', audio: 'schwimmen' },
      { word: 'Klavier',   audio: 'Klavier' },
      { word: 'Sport',     audio: 'Sport' }
    ]
  }
};
