/* ═══════════════════════════════════════════════
   data/a1-lesson-01.js
   A1 · Урок 1: Hallo! Wie heißt du? — Приветствия и знакомство
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-01',
  level: 'A1',
  unit:  1,
  title: 'Hallo! Wie heißt du?',
  subtitle: 'Приветствия, знакомство и происхождение',

  meta: {
    duration: '25–30 мин',
    wordCount: 25,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Hallo!',                       ru: 'Привет!',                       note: 'Универсальное неформальное приветствие в любое время дня', audio: 'Hallo' },
    { de: 'Guten Morgen!',                ru: 'Доброе утро!',                  note: 'До 10:00–11:00', audio: 'Guten Morgen' },
    { de: 'Guten Tag!',                   ru: 'Добрый день!',                  note: 'С 11:00 до 18:00 — нейтрально-вежливо', audio: 'Guten Tag' },
    { de: 'Guten Abend!',                 ru: 'Добрый вечер!',                 note: 'После 18:00', audio: 'Guten Abend' },
    { de: 'Gute Nacht!',                  ru: 'Спокойной ночи!',               note: 'Только перед сном — НЕ как приветствие!', audio: 'Gute Nacht' },
    { de: 'Wie heißt du?',                ru: 'Как тебя зовут?',               note: 'Неформально, к одному человеку (du = ты)', audio: 'Wie heißt du' },
    { de: 'Wie heißen Sie?',              ru: 'Как Вас зовут?',                note: 'Формально. Sie всегда с большой буквы', audio: 'Wie heißen Sie' },
    { de: 'Ich heiße Anna.',              ru: 'Меня зовут Анна.',              note: 'Подставь своё имя', audio: 'Ich heiße Anna' },
    { de: 'Mein Name ist Peter Müller.',  ru: 'Моё имя — Петер Мюллер.',       note: 'Альтернатива через Mein Name ist…', audio: 'Mein Name ist Peter Müller' },
    { de: 'Freut mich!',                  ru: 'Очень приятно!',                note: 'Букв.: «(это) меня радует». Стандарт при знакомстве', audio: 'Freut mich' },
    { de: 'Wie geht es dir?',             ru: 'Как у тебя дела?',              note: 'Неформально (dir = тебе)', audio: 'Wie geht es dir' },
    { de: 'Wie geht es Ihnen?',           ru: 'Как у Вас дела?',               note: 'Формально (Ihnen = Вам)', audio: 'Wie geht es Ihnen' },
    { de: 'Danke, gut! Und dir?',         ru: 'Спасибо, хорошо! А у тебя?',    note: 'Стандартный ответ + встречный вопрос', audio: 'Danke gut Und dir' },
    { de: 'Es geht.',                     ru: 'Нормально. / Так себе.',        note: 'Когда дела не очень, но и не плохи', audio: 'Es geht' },
    { de: 'Nicht so gut.',                ru: 'Не очень хорошо.',              note: 'Если день не задался', audio: 'Nicht so gut' },
    { de: 'Woher kommst du?',             ru: 'Откуда ты?',                    note: 'woher = откуда. kommen aus + страна', audio: 'Woher kommst du' },
    { de: 'Ich komme aus der Ukraine.',      ru: 'Я из Украины.',                  note: 'aus = из (страны обычно без артикля)', audio: 'Ich komme aus Russland' },
    { de: 'Ich wohne in Berlin.',         ru: 'Я живу в Берлине.',             note: 'wohnen in + город (без артикля)', audio: 'Ich wohne in Berlin' },
    { de: 'Sprichst du Deutsch?',         ru: 'Ты говоришь по-немецки?',       note: 'sprechen = говорить', audio: 'Sprichst du Deutsch' },
    { de: 'Ein bisschen.',                ru: 'Немного.',                      note: 'Универсальный скромный ответ', audio: 'Ein bisschen' },
    { de: 'Auf Wiedersehen!',             ru: 'До свидания!',                  note: 'Формальное прощание. Букв.: «до нового свидания»', audio: 'Auf Wiedersehen' },
    { de: 'Tschüss!',                     ru: 'Пока!',                         note: 'Неформально, ü ≈ «ю» с округлёнными губами', audio: 'Tschüss' },
    { de: 'Bis morgen!',                  ru: 'До завтра!',                    note: 'Если знаешь, что увидитесь завтра', audio: 'Bis morgen' },
    { de: 'Bis bald!',                    ru: 'До скорого!',                   note: 'Дружески, в любой ситуации', audio: 'Bis bald' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'Hallo',          ru: 'привет',                ipa: '[ˈhalo]',              article: '' },
    { de: 'Tschüss',        ru: 'пока',                  ipa: '[tʃʏs]',               article: '' },
    { de: 'Auf Wiedersehen',ru: 'до свидания',           ipa: '[aʊ̯f ˈviːdɐzeːən]',   article: '' },
    { de: 'Danke',          ru: 'спасибо',               ipa: '[ˈdaŋkə]',             article: '' },
    { de: 'Bitte',          ru: 'пожалуйста',            ipa: '[ˈbɪtə]',              article: '' },
    { de: 'Ja',             ru: 'да',                    ipa: '[jaː]',                article: '' },
    { de: 'Nein',           ru: 'нет',                   ipa: '[naɪ̯n]',              article: '' },
    { de: 'der Morgen',     ru: 'утро',                  ipa: '[ˈmɔʁɡn̩]',            article: 'der' },
    { de: 'der Tag',        ru: 'день',                  ipa: '[taːk]',               article: 'der' },
    { de: 'der Abend',      ru: 'вечер',                 ipa: '[ˈaːbn̩t]',            article: 'der' },
    { de: 'die Nacht',      ru: 'ночь',                  ipa: '[naxt]',               article: 'die' },
    { de: 'ich',            ru: 'я',                     ipa: '[ɪç]',                 article: '' },
    { de: 'du',             ru: 'ты',                    ipa: '[duː]',                article: '' },
    { de: 'er',             ru: 'он',                    ipa: '[eːɐ̯]',               article: '' },
    { de: 'sie',            ru: 'она / они',             ipa: '[ziː]',                article: '' },
    { de: 'wir',            ru: 'мы',                    ipa: '[viːɐ̯]',              article: '' },
    { de: 'Sie',            ru: 'Вы (формально)',        ipa: '[ziː]',                article: '' },
    { de: 'heißen',         ru: 'называться, зваться',   ipa: '[ˈhaɪ̯sn̩]',           article: '' },
    { de: 'sein',           ru: 'быть',                  ipa: '[zaɪ̯n]',              article: '' },
    { de: 'kommen',         ru: 'приходить, быть из',    ipa: '[ˈkɔmən]',             article: '' },
    { de: 'wohnen',         ru: 'жить, проживать',       ipa: '[ˈvoːnən]',            article: '' },
    { de: 'der Name',       ru: 'имя',                   ipa: '[ˈnaːmə]',             article: 'der' },
    { de: 'gut',            ru: 'хорошо / хороший',      ipa: '[ɡuːt]',               article: '' },
    { de: 'schlecht',       ru: 'плохо / плохой',        ipa: '[ʃlɛçt]',              article: '' },
    { de: 'Deutschland',    ru: 'Германия',              ipa: '[ˈdɔɪ̯tʃlant]',        article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Глагол sein (быть) — самый важный глагол немецкого',
      body: '<strong>sein</strong> — главный глагол. Он неправильный, формы надо просто запомнить. Используется для имени, возраста, профессии, состояния, происхождения:<br><br>' +
            '<em>Ich bin Anna.</em> — Я Анна.<br>' +
            '<em>Du bist müde.</em> — Ты устал.<br>' +
            '<em>Wir sind aus Russland.</em> — Мы из России.',
      conjugation: [
        { pronoun: 'ich',           form: 'bin',  audio: 'ich bin',   translation: 'я (есть)' },
        { pronoun: 'du',            form: 'bist', audio: 'du bist',   translation: 'ты (есть)' },
        { pronoun: 'er / sie / es', form: 'ist',  audio: 'er ist',    translation: 'он/она/оно (есть)' },
        { pronoun: 'wir',           form: 'sind', audio: 'wir sind',  translation: 'мы (есть)' },
        { pronoun: 'ihr',           form: 'seid', audio: 'ihr seid',  translation: 'вы (группа)' },
        { pronoun: 'Sie / sie',     form: 'sind', audio: 'Sie sind',  translation: 'Вы (форм.) / они' }
      ]
    },
    {
      title: '⚡ Глагол heißen — спряжение',
      body: 'Глагол <strong>heißen</strong> («называться») — типичный пример правильного спряжения. Корень <em>heiß-</em> сохраняется, меняются только окончания.<br><br>' +
            'Обрати внимание: <em>du</em> и <em>er/sie/es</em> используют одну форму — <strong>heißt</strong>, потому что корень уже оканчивается на -ß.',
      conjugation: [
        { pronoun: 'ich',           form: 'heiße',  audio: 'ich heiße',   translation: 'меня зовут' },
        { pronoun: 'du',            form: 'heißt',  audio: 'du heißt',    translation: 'тебя зовут' },
        { pronoun: 'er / sie / es', form: 'heißt',  audio: 'er heißt',    translation: 'его/её зовут' },
        { pronoun: 'wir',           form: 'heißen', audio: 'wir heißen',  translation: 'нас зовут' },
        { pronoun: 'ihr',           form: 'heißt',  audio: 'ihr heißt',   translation: 'вас (группу) зовут' },
        { pronoun: 'Sie / sie',     form: 'heißen', audio: 'Sie heißen',  translation: 'Вас (форм.) / их зовут' }
      ]
    },
    {
      title: '💡 du или Sie? Когда «ты», а когда «Вы»',
      body: 'В немецком есть <strong>два</strong> способа обращения:<br><br>' +
            '<strong>du</strong> — «ты»: друзья, семья, дети, коллеги-ровесники, в интернете<br>' +
            '<strong>Sie</strong> (с большой буквы!) — «Вы»: незнакомые взрослые, начальство, продавцы, врачи, старшие<br><br>' +
            'Сравни:<br>' +
            '<em>Wie heißt du?</em> → одногруппнику<br>' +
            '<em>Wie heißen Sie?</em> → пожилой даме на улице<br><br>' +
            '⚠️ Лучше начинать с <strong>Sie</strong> — переход на <em>du</em> предлагает старший по возрасту/положению.'
    },
    {
      title: '💡 W-вопросы: основа любого разговора',
      body: 'Вопросительные слова, начинающиеся на <strong>W</strong>, ставятся в начале вопроса. Глагол идёт <em>сразу после</em>:<br><br>' +
            '<strong>Wie</strong> — как? &nbsp;→&nbsp; <em>Wie heißt du?</em><br>' +
            '<strong>Woher</strong> — откуда? &nbsp;→&nbsp; <em>Woher kommst du?</em><br>' +
            '<strong>Wo</strong> — где? &nbsp;→&nbsp; <em>Wo wohnst du?</em><br>' +
            '<strong>Was</strong> — что? &nbsp;→&nbsp; <em>Was machst du?</em><br>' +
            '<strong>Wer</strong> — кто? &nbsp;→&nbsp; <em>Wer ist das?</em><br><br>' +
            'Порядок слов всегда: <strong>W-слово → глагол → подлежащее</strong>.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Hallo! Ich',         blank: 'heiße',   after: 'Maria.',           translation: '— Привет! Меня зовут Мария.',           hintWord: 'heiße',   hintRule: 'ich → heiße (форма для «я»)' },
      { before: '— Wie',                 blank: 'heißt',   after: 'du?',              translation: '— Как тебя зовут?',                      hintWord: 'heißt',   hintRule: 'du → heißt (форма для «ты»)' },
      { before: '— Guten',               blank: 'Abend',   after: '!',                translation: '— Добрый вечер!',                        hintWord: 'Abend',   hintRule: 'после 18:00; существительные с большой буквы' },
      { before: '— Danke,',              blank: 'gut',     after: '! Und dir?',       translation: '— Спасибо, хорошо! А у тебя?',           hintWord: 'gut',     hintRule: 'gut = хорошо / хороший' },
      { before: '— Ich',                 blank: 'komme',   after: 'aus der Ukraine.',    translation: '— Я из Украины.',                         hintWord: 'komme',   hintRule: 'ich → komme (от kommen)' },
      { before: '— Woher',               blank: 'kommst',  after: 'du?',              translation: '— Откуда ты?',                           hintWord: 'kommst',  hintRule: 'du → kommst (окончание -st)' },
      { before: '— Wir',                 blank: 'sind',    after: 'aus Berlin.',      translation: '— Мы из Берлина.',                       hintWord: 'sind',    hintRule: 'wir → sind (форма sein для «мы»)' },
      { before: '— Bis',                 blank: 'morgen',  after: '!',                translation: '— До завтра!',                           hintWord: 'morgen',  hintRule: 'morgen = завтра (наречие, с маленькой)' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «Добрый день»?',                                     options: ['Guten Morgen!', 'Guten Tag!', 'Guten Abend!', 'Gute Nacht!'],            correctIndex: 1 },
      { question: 'Что значит «Tschüss»?',                                             options: ['Здравствуйте', 'Спасибо', 'Пока!', 'Как дела?'],                          correctIndex: 2 },
      { question: 'Какая форма sein для «ich»?',                                       options: ['ist', 'bin', 'bist', 'sind'],                                             correctIndex: 1 },
      { question: 'Какая форма sein для «wir»?',                                       options: ['seid', 'bist', 'sind', 'ist'],                                            correctIndex: 2 },
      { question: 'Как сформулировать вопрос «Откуда ты?»',                            options: ['Wo kommst du?', 'Wie kommst du?', 'Was kommst du?', 'Woher kommst du?'],  correctIndex: 3 },
      { question: 'Какая форма heißen для «du»?',                                      options: ['heiße', 'heißt', 'heißen', 'heißst'],                                     correctIndex: 1 },
      { question: 'Когда употребляется «Sie» (с большой буквы)?',                     options: ['С друзьями', 'С детьми', 'С незнакомыми взрослыми', 'В интернете'],       correctIndex: 2 },
      { question: '«Freut mich!» переводится как…',                                    options: ['Извините', 'Очень приятно!', 'Спасибо', 'Хорошо'],                        correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'Guten Morgen!',     ru: 'Доброе утро!' },
      { id: 2, de: 'Auf Wiedersehen!',  ru: 'До свидания!' },
      { id: 3, de: 'Wie heißt du?',     ru: 'Как тебя зовут?' },
      { id: 4, de: 'Bitte',             ru: 'Пожалуйста' },
      { id: 5, de: 'Woher kommst du?',  ru: 'Откуда ты?' },
      { id: 6, de: 'Ich wohne in …',    ru: 'Я живу в …' },
      { id: 7, de: 'Freut mich!',       ru: 'Очень приятно!' },
      { id: 8, de: 'Bis bald!',         ru: 'До скорого!' }
    ],

    dictation: [
      { word: 'Hallo',     audio: 'Hallo' },
      { word: 'Danke',     audio: 'Danke' },
      { word: 'Tschüss',   audio: 'Tschüss' },
      { word: 'heißt',     audio: 'heißt' },
      { word: 'kommen',    audio: 'kommen' },
      { word: 'Morgen',    audio: 'Morgen' },
      { word: 'wohnen',    audio: 'wohnen' },
      { word: 'Abend',     audio: 'Abend' }
    ]
  }
};
