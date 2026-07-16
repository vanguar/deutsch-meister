/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-16.js
   A2 · Урок 16: Natur und Ausflüge — Природа и прогулки
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-16',
  level: 'A2',
  unit:  16,
  title: 'Natur und Ausflüge',
  subtitle: 'Природа, походы и прогулки',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Am Wochenende machen wir einen Ausflug.', ru: 'На выходных мы едем на прогулку.', note: 'der Ausflug — вылазка, экскурсия', audio: 'Am Wochenende machen wir einen Ausflug' },
    { de: 'Wir wandern gern in den Bergen.',     ru: 'Мы любим ходить в горы.',          note: 'wandern — ходить в поход; der Berg → die Berge', audio: 'Wir wandern gern in den Bergen' },
    { de: 'Der Wald ist im Herbst besonders schön.', ru: 'Лес особенно красив осенью.',  note: 'der Wald — лес; besonders — особенно', audio: 'Der Wald ist im Herbst besonders schön' },
    { de: 'Wir machen ein Picknick am See.',     ru: 'Мы устраиваем пикник у озера.',    note: 'der See — озеро; am See — у озера', audio: 'Wir machen ein Picknick am See' },
    { de: 'Der Weg führt durch den Wald.',       ru: 'Дорога ведёт через лес.',          note: 'führen — вести; durch + Akk. — через', audio: 'Der Weg führt durch den Wald' },
    { de: 'Von hier hat man eine tolle Aussicht.', ru: 'Отсюда открывается отличный вид.', note: 'die Aussicht — вид', audio: 'Von hier hat man eine tolle Aussicht' },
    { de: 'Wir übernachten auf dem Campingplatz.', ru: 'Мы ночуем в кемпинге.',          note: 'übernachten — ночевать', audio: 'Wir übernachten auf dem Campingplatz' },
    { de: 'Vergiss die Sonnencreme nicht!',      ru: 'Не забудь солнцезащитный крем!',   note: 'vergessen — забывать', audio: 'Vergiss die Sonnencreme nicht' },
    { de: 'Die frische Luft tut gut.',           ru: 'Свежий воздух идёт на пользу.',    note: 'die Luft — воздух; gut tun — идти на пользу', audio: 'Die frische Luft tut gut' },
    { de: 'Wir sammeln Pilze im Wald.',          ru: 'Мы собираем грибы в лесу.',        note: 'sammeln — собирать; der Pilz — гриб', audio: 'Wir sammeln Pilze im Wald' },
    { de: 'Der Fluss ist zum Schwimmen zu kalt.', ru: 'Река слишком холодная для купания.', note: 'der Fluss — река; zu kalt — слишком холодная', audio: 'Der Fluss ist zum Schwimmen zu kalt' },
    { de: 'Wir grillen im Garten.',              ru: 'Мы жарим гриль в саду.',           note: 'grillen — жарить на гриле', audio: 'Wir grillen im Garten' },
    { de: 'Nimm feste Schuhe mit!',              ru: 'Возьми с собой крепкую обувь!',    note: 'mitnehmen — брать с собой', audio: 'Nimm feste Schuhe mit' },
    { de: 'Die Blumen blühen im Frühling.',      ru: 'Цветы цветут весной.',             note: 'blühen — цвести; die Blume — цветок', audio: 'Die Blumen blühen im Frühling' },
    { de: 'Wir beobachten die Vögel.',           ru: 'Мы наблюдаем за птицами.',         note: 'beobachten — наблюдать', audio: 'Wir beobachten die Vögel' },
    { de: 'Bitte keinen Müll liegen lassen!',    ru: 'Пожалуйста, не оставляйте мусор!', note: 'der Müll — мусор', audio: 'Bitte keinen Müll liegen lassen' }
  ],

  vocabulary: [
    { de: 'die Natur',        ru: 'природа',           ipa: '[naˈtuːɐ̯]',        article: 'die' },
    { de: 'der Ausflug',      ru: 'вылазка, экскурсия', ipa: '[ˈaʊ̯sˌfluːk]',    article: 'der' },
    { de: 'der Berg',         ru: 'гора',              ipa: '[bɛʁk]',            article: 'der' },
    { de: 'der Wald',         ru: 'лес',               ipa: '[valt]',            article: 'der' },
    { de: 'der See',          ru: 'озеро',             ipa: '[zeː]',             article: 'der' },
    { de: 'der Fluss',        ru: 'река',              ipa: '[flʊs]',            article: 'der' },
    { de: 'die Wiese',        ru: 'луг',               ipa: '[ˈviːzə]',          article: 'die' },
    { de: 'die Blume',        ru: 'цветок',            ipa: '[ˈbluːmə]',         article: 'die' },
    { de: 'der Baum',         ru: 'дерево',            ipa: '[baʊ̯m]',           article: 'der' },
    { de: 'der Pilz',         ru: 'гриб',              ipa: '[pɪlts]',           article: 'der' },
    { de: 'die Luft',         ru: 'воздух',            ipa: '[lʊft]',            article: 'die' },
    { de: 'die Aussicht',     ru: 'вид (панорама)',    ipa: '[ˈaʊ̯sˌzɪçt]',      article: 'die' },
    { de: 'der Müll',         ru: 'мусор',             ipa: '[mʏl]',             article: 'der' },
    { de: 'wandern',          ru: 'ходить в поход',    ipa: '[ˈvandɐn]',         article: '' },
    { de: 'übernachten',      ru: 'ночевать',          ipa: '[ˌyːbɐˈnaxtn̩]',    article: '' },
    { de: 'sammeln',          ru: 'собирать',          ipa: '[ˈzaml̩n]',         article: '' },
    { de: 'grillen',          ru: 'жарить на гриле',   ipa: '[ˈɡʁɪlən]',         article: '' },
    { de: 'blühen',           ru: 'цвести',            ipa: '[ˈblyːən]',         article: '' },
    { de: 'beobachten',       ru: 'наблюдать',         ipa: '[bəˈʔoːbaxtn̩]',    article: '' },
    { de: 'mitnehmen',        ru: 'брать с собой',     ipa: '[ˈmɪtˌneːmən]',     article: '' }
  ],

  grammar: [
    {
      title: '⚡ Императив на du: Nimm mit! Vergiss nicht!',
      body: 'Императив для <strong>du</strong> — форма без окончания -st и без местоимения:<br><br>' +
            '<em>du nimmst → <strong>Nimm</strong> feste Schuhe <strong>mit</strong>!</em> — Возьми крепкую обувь!<br>' +
            '<em>du vergisst → <strong>Vergiss</strong> die Karte <strong>nicht</strong>!</em> — Не забудь карту!<br>' +
            '<em>du gehst → <strong>Geh</strong> nach Hause!</em> — Иди домой!',
      conjugation: [
        { pronoun: 'nehmen',    form: 'Nimm die Jacke mit!',       audio: 'Nimm die Jacke mit',       translation: 'Возьми куртку с собой!' },
        { pronoun: 'vergessen', form: 'Vergiss das Wasser nicht!', audio: 'Vergiss das Wasser nicht', translation: 'Не забудь воду!' },
        { pronoun: 'gehen',     form: 'Geh langsam!',              audio: 'Geh langsam',              translation: 'Иди медленно!' },
        { pronoun: 'kommen',    form: 'Komm mit!',                 audio: 'Komm mit',                 translation: 'Пойдём вместе!' },
        { pronoun: 'sein',      form: 'Sei vorsichtig!',           audio: 'Sei vorsichtig',           translation: 'Будь осторожен!' }
      ]
    },
    {
      title: '⚡ durch, um, entlang — предлоги движения',
      body: 'Куда идёт путь — предлоги с Akkusativ:<br><br>' +
            '<em>Der Weg führt <strong>durch den</strong> Wald.</em> — Дорога ведёт через лес.<br>' +
            '<em>Wir gehen <strong>um den</strong> See.</em> — Мы идём вокруг озера.<br>' +
            '<em>Wir laufen <strong>den Fluss entlang</strong>.</em> — Мы идём вдоль реки (entlang — после слова!).',
      conjugation: [
        { pronoun: 'через',  form: 'durch den Wald',     audio: 'durch den Wald',     translation: 'через лес' },
        { pronoun: 'вокруг', form: 'um den See',         audio: 'um den See',         translation: 'вокруг озера' },
        { pronoun: 'вдоль',  form: 'den Fluss entlang',  audio: 'den Fluss entlang',  translation: 'вдоль реки' },
        { pronoun: 'в горы', form: 'in die Berge',       audio: 'in die Berge',       translation: 'в горы' }
      ]
    },
    {
      title: '💡 einen Ausflug machen — устойчивые сочетания',
      body: 'Полезные сочетания с machen:<br><br>' +
            '<em>einen <strong>Ausflug</strong> machen</em> — поехать на вылазку<br>' +
            '<em>ein <strong>Picknick</strong> machen</em> — устроить пикник<br>' +
            '<em>eine <strong>Wanderung</strong> machen</em> — сходить в поход<br>' +
            '<em>eine <strong>Pause</strong> machen</em> — сделать перерыв'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wir machen einen',     blank: 'Ausflug',    after: 'ans Meer.',               translation: '— Мы едем на прогулку к морю.',       hintWord: 'Ausflug',    hintRule: 'einen Ausflug machen' },
      { before: '— Wir',                  blank: 'wandern',    after: 'gern in den Bergen.',     translation: '— Мы любим ходить в горы.',           hintWord: 'wandern',    hintRule: 'wandern — ходить в поход' },
      { before: '— Der Weg führt',        blank: 'durch',      after: 'den Wald.',               translation: '— Дорога ведёт через лес.',           hintWord: 'durch',      hintRule: 'durch + Akkusativ' },
      { before: '— Von hier hat man eine tolle', blank: 'Aussicht', after: '.',                  translation: '— Отсюда отличный вид.',              hintWord: 'Aussicht',   hintRule: 'die Aussicht — вид' },
      { before: '— Wir',                  blank: 'sammeln',    after: 'Pilze im Wald.',          translation: '— Мы собираем грибы в лесу.',         hintWord: 'sammeln',    hintRule: 'sammeln — собирать' },
      { before: '—',                      blank: 'Nimm',       after: 'feste Schuhe mit!',       translation: '— Возьми крепкую обувь!',             hintWord: 'Nimm',       hintRule: 'императив du: nimm!' },
      { before: '— Die Blumen',           blank: 'blühen',     after: 'im Frühling.',            translation: '— Цветы цветут весной.',              hintWord: 'blühen',     hintRule: 'blühen — цвести' },
      { before: '— Die frische',          blank: 'Luft',       after: 'tut gut.',                translation: '— Свежий воздух идёт на пользу.',     hintWord: 'Luft',       hintRule: 'die Luft — воздух' }
    ],

    multipleChoice: [
      { question: '«Der Ausflug» — это…',                      options: ['полёт', 'вылазка, экскурсия', 'выход', 'вылет'],              correctIndex: 1 },
      { question: '«Wandern» значит…',                         options: ['гулять по городу', 'ходить в поход', 'бегать', 'путешествовать на машине'], correctIndex: 1 },
      { question: '«Der See» — это…',                          options: ['море', 'озеро', 'река', 'пруд'],                              correctIndex: 1 },
      { question: 'Императив du от «nehmen»…',                 options: ['Nehmst!', 'Nimm!', 'Nehm!', 'Nimmst!'],                       correctIndex: 1 },
      { question: '«Durch» требует падежа…',                   options: ['Dativ', 'Akkusativ', 'Genitiv', 'Nominativ'],                 correctIndex: 1 },
      { question: '«Übernachten» значит…',                     options: ['гулять ночью', 'ночевать', 'просыпаться', 'засыпать'],        correctIndex: 1 },
      { question: '«Die Aussicht» — это…',                     options: ['внешность', 'вид, панорама', 'взгляд', 'осмотр'],             correctIndex: 1 },
      { question: 'Что нельзя оставлять на природе?',          options: ['die Blumen', 'den Müll', 'die Pilze', 'das Wasser'],          correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Wald',      ru: 'лес' },
      { id: 2, de: 'der Berg',      ru: 'гора' },
      { id: 3, de: 'der Fluss',     ru: 'река' },
      { id: 4, de: 'die Blume',     ru: 'цветок' },
      { id: 5, de: 'wandern',       ru: 'ходить в поход' },
      { id: 6, de: 'sammeln',       ru: 'собирать' },
      { id: 7, de: 'die Luft',      ru: 'воздух' },
      { id: 8, de: 'der Baum',      ru: 'дерево' }
    ],

    dictation: [
      { word: 'Natur',      audio: 'Natur' },
      { word: 'Ausflug',    audio: 'Ausflug' },
      { word: 'Wald',       audio: 'Wald' },
      { word: 'Berg',       audio: 'Berg' },
      { word: 'wandern',    audio: 'wandern' },
      { word: 'Blume',      audio: 'Blume' },
      { word: 'Aussicht',   audio: 'Aussicht' },
      { word: 'grillen',    audio: 'grillen' }
    ]
  }
};
