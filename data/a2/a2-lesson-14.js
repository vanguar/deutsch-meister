/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-14.js
   A2 · Урок 14: Wegbeschreibung — Как пройти?
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-14',
  level: 'A2',
  unit:  14,
  title: 'Wegbeschreibung',
  subtitle: 'Спрашиваем и объясняем дорогу',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Entschuldigung, wie komme ich zum Rathaus?', ru: 'Извините, как пройти к ратуше?', note: 'zum = zu + dem; das Rathaus — ратуша', audio: 'Entschuldigung, wie komme ich zum Rathaus' },
    { de: 'Gehen Sie geradeaus.',                ru: 'Идите прямо.',                     note: 'geradeaus — прямо', audio: 'Gehen Sie geradeaus' },
    { de: 'Biegen Sie an der Ampel links ab.',   ru: 'Поверните налево на светофоре.',   note: 'abbiegen — поворачивать; die Ampel — светофор', audio: 'Biegen Sie an der Ampel links ab' },
    { de: 'Dann die zweite Straße rechts.',      ru: 'Потом вторая улица направо.',      note: 'rechts — направо; links — налево', audio: 'Dann die zweite Straße rechts' },
    { de: 'Die Apotheke ist neben der Bank.',    ru: 'Аптека рядом с банком.',           note: 'neben + Dativ — рядом с', audio: 'Die Apotheke ist neben der Bank' },
    { de: 'Das Museum liegt gegenüber dem Park.', ru: 'Музей находится напротив парка.', note: 'gegenüber + Dativ — напротив', audio: 'Das Museum liegt gegenüber dem Park' },
    { de: 'Gehen Sie über die Brücke.',          ru: 'Перейдите через мост.',            note: 'die Brücke — мост; über — через', audio: 'Gehen Sie über die Brücke' },
    { de: 'Ist es weit von hier?',               ru: 'Это далеко отсюда?',               note: 'weit — далеко', audio: 'Ist es weit von hier' },
    { de: 'Nein, nur fünf Minuten zu Fuß.',      ru: 'Нет, всего пять минут пешком.',    note: 'nur — только', audio: 'Nein, nur fünf Minuten zu Fuß' },
    { de: 'Sie können es nicht verfehlen.',      ru: 'Вы не пройдёте мимо.',             note: 'verfehlen — пропустить, не заметить', audio: 'Sie können es nicht verfehlen' },
    { de: 'Ich habe mich verlaufen.',            ru: 'Я заблудился.',                    note: 'sich verlaufen — заблудиться (пешком)', audio: 'Ich habe mich verlaufen' },
    { de: 'Können Sie mir das auf der Karte zeigen?', ru: 'Можете показать мне это на карте?', note: 'die Karte — карта; zeigen — показывать', audio: 'Können Sie mir das auf der Karte zeigen' },
    { de: 'An der Kreuzung rechts abbiegen.',    ru: 'На перекрёстке повернуть направо.', note: 'die Kreuzung — перекрёсток', audio: 'An der Kreuzung rechts abbiegen' },
    { de: 'Der Eingang ist um die Ecke.',        ru: 'Вход за углом.',                   note: 'der Eingang — вход; die Ecke — угол', audio: 'Der Eingang ist um die Ecke' },
    { de: 'Folgen Sie der Straße bis zur Kirche.', ru: 'Следуйте по улице до церкви.',   note: 'folgen + Dativ — следовать', audio: 'Folgen Sie der Straße bis zur Kirche' },
    { de: 'Vielen Dank für Ihre Hilfe!',         ru: 'Большое спасибо за помощь!',       note: 'die Hilfe — помощь', audio: 'Vielen Dank für Ihre Hilfe' }
  ],

  vocabulary: [
    { de: 'der Weg',        ru: 'путь, дорога',      ipa: '[veːk]',           article: 'der' },
    { de: 'die Straße',     ru: 'улица',             ipa: '[ˈʃtʁaːsə]',       article: 'die' },
    { de: 'die Kreuzung',   ru: 'перекрёсток',       ipa: '[ˈkʁɔɪ̯tsʊŋ]',     article: 'die' },
    { de: 'die Ampel',      ru: 'светофор',          ipa: '[ˈampl̩]',         article: 'die' },
    { de: 'die Brücke',     ru: 'мост',              ipa: '[ˈbʁʏkə]',         article: 'die' },
    { de: 'die Ecke',       ru: 'угол',              ipa: '[ˈɛkə]',           article: 'die' },
    { de: 'der Eingang',    ru: 'вход',              ipa: '[ˈaɪ̯nˌɡaŋ]',      article: 'der' },
    { de: 'das Rathaus',    ru: 'ратуша',            ipa: '[ˈʁaːtˌhaʊ̯s]',    article: 'das' },
    { de: 'die Kirche',     ru: 'церковь',           ipa: '[ˈkɪʁçə]',         article: 'die' },
    { de: 'die Apotheke',   ru: 'аптека',            ipa: '[apoˈteːkə]',      article: 'die' },
    { de: 'die Karte',      ru: 'карта',             ipa: '[ˈkaʁtə]',         article: 'die' },
    { de: 'geradeaus',      ru: 'прямо',             ipa: '[ɡəʁaːdəˈʔaʊ̯s]',  article: '' },
    { de: 'links',          ru: 'налево, слева',     ipa: '[lɪŋks]',          article: '' },
    { de: 'rechts',         ru: 'направо, справа',   ipa: '[ʁɛçts]',          article: '' },
    { de: 'weit',           ru: 'далеко',            ipa: '[vaɪ̯t]',          article: '' },
    { de: 'nah',            ru: 'близко',            ipa: '[naː]',            article: '' },
    { de: 'abbiegen',       ru: 'поворачивать',      ipa: '[ˈapˌbiːɡn̩]',     article: '' },
    { de: 'folgen',         ru: 'следовать',         ipa: '[ˈfɔlɡn̩]',        article: '' },
    { de: 'zeigen',         ru: 'показывать',        ipa: '[ˈtsaɪ̯ɡn̩]',      article: '' },
    { de: 'sich verlaufen', ru: 'заблудиться',       ipa: '[zɪç fɛɐ̯ˈlaʊ̯fn̩]', article: '' }
  ],

  grammar: [
    {
      title: '⚡ Императив на Sie: Gehen Sie…!',
      body: 'Объясняя дорогу незнакомцу, используй вежливый императив — <strong>глагол + Sie</strong>:<br><br>' +
            '<em><strong>Gehen Sie</strong> geradeaus!</em> — Идите прямо!<br>' +
            '<em><strong>Biegen Sie</strong> links ab!</em> — Поверните налево!<br>' +
            '<em><strong>Nehmen Sie</strong> den Bus!</em> — Поезжайте на автобусе!',
      conjugation: [
        { pronoun: 'прямо',      form: 'Gehen Sie geradeaus!',      audio: 'Gehen Sie geradeaus',      translation: 'Идите прямо!' },
        { pronoun: 'налево',     form: 'Biegen Sie links ab!',      audio: 'Biegen Sie links ab',      translation: 'Поверните налево!' },
        { pronoun: 'направо',    form: 'Biegen Sie rechts ab!',     audio: 'Biegen Sie rechts ab',     translation: 'Поверните направо!' },
        { pronoun: 'через мост', form: 'Gehen Sie über die Brücke!', audio: 'Gehen Sie über die Brücke', translation: 'Перейдите через мост!' },
        { pronoun: 'следуйте',   form: 'Folgen Sie der Straße!',    audio: 'Folgen Sie der Straße',    translation: 'Следуйте по улице!' }
      ]
    },
    {
      title: '⚡ Предлоги места с Dativ: neben, gegenüber, an, hinter',
      body: 'Где находится здание — предлоги с Dativ:<br><br>' +
            '<em><strong>neben</strong> der Bank</em> — рядом с банком<br>' +
            '<em><strong>gegenüber</strong> dem Park</em> — напротив парка<br>' +
            '<em><strong>an</strong> der Kreuzung</em> — на перекрёстке<br>' +
            '<em><strong>hinter</strong> dem Rathaus</em> — за ратушей',
      conjugation: [
        { pronoun: 'рядом',    form: 'neben der Apotheke',   audio: 'neben der Apotheke',   translation: 'рядом с аптекой' },
        { pronoun: 'напротив', form: 'gegenüber der Kirche', audio: 'gegenüber der Kirche', translation: 'напротив церкви' },
        { pronoun: 'за',       form: 'hinter dem Bahnhof',   audio: 'hinter dem Bahnhof',   translation: 'за вокзалом' },
        { pronoun: 'перед',    form: 'vor dem Museum',       audio: 'vor dem Museum',       translation: 'перед музеем' },
        { pronoun: 'на углу',  form: 'an der Ecke',          audio: 'an der Ecke',          translation: 'на углу' }
      ]
    },
    {
      title: '💡 sich verlaufen vs sich verfahren',
      body: 'Заблудиться можно по-разному:<br><br>' +
            '<em>Ich habe mich <strong>verlaufen</strong>.</em> — Я заблудился (пешком).<br>' +
            '<em>Ich habe mich <strong>verfahren</strong>.</em> — Я заблудился (на машине).<br><br>' +
            'Приставка <strong>ver-</strong> часто означает «сделать неправильно».'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wie komme ich',        blank: 'zum',        after: 'Rathaus?',                translation: '— Как пройти к ратуше?',              hintWord: 'zum',        hintRule: 'zu + dem = zum' },
      { before: '— Gehen Sie',            blank: 'geradeaus',  after: '.',                       translation: '— Идите прямо.',                      hintWord: 'geradeaus',  hintRule: 'geradeaus — прямо' },
      { before: '— Biegen Sie an der Ampel links', blank: 'ab', after: '.',                      translation: '— Поверните налево на светофоре.',    hintWord: 'ab',         hintRule: 'abbiegen — приставка в конец' },
      { before: '— Die Apotheke ist',     blank: 'neben',      after: 'der Bank.',               translation: '— Аптека рядом с банком.',            hintWord: 'neben',      hintRule: 'neben + Dativ — рядом с' },
      { before: '— Ist es',               blank: 'weit',       after: 'von hier?',               translation: '— Это далеко отсюда?',                hintWord: 'weit',       hintRule: 'weit — далеко' },
      { before: '— Ich habe mich',        blank: 'verlaufen',  after: '.',                       translation: '— Я заблудился.',                     hintWord: 'verlaufen',  hintRule: 'sich verlaufen — заблудиться' },
      { before: '— Der Eingang ist um die', blank: 'Ecke',     after: '.',                       translation: '— Вход за углом.',                    hintWord: 'Ecke',       hintRule: 'um die Ecke — за углом' },
      { before: '— Gehen Sie über die',   blank: 'Brücke',     after: '.',                       translation: '— Перейдите через мост.',             hintWord: 'Brücke',     hintRule: 'die Brücke — мост' }
    ],

    multipleChoice: [
      { question: '«Geradeaus» значит…',                       options: ['налево', 'направо', 'прямо', 'назад'],                        correctIndex: 2 },
      { question: '«Die Kreuzung» — это…',                     options: ['мост', 'перекрёсток', 'светофор', 'угол'],                    correctIndex: 1 },
      { question: '«Gegenüber dem Park» значит…',              options: ['в парке', 'напротив парка', 'за парком', 'рядом с парком'],   correctIndex: 1 },
      { question: 'Вежливый императив: «Идите прямо!»…',       options: ['Geh geradeaus!', 'Gehen Sie geradeaus!', 'Du gehst geradeaus!', 'Geradeaus gehen!'], correctIndex: 1 },
      { question: '«Sich verlaufen» — заблудиться…',           options: ['на машине', 'пешком', 'в мыслях', 'в море'],                  correctIndex: 1 },
      { question: '«Folgen» требует падежа…',                  options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                 correctIndex: 1 },
      { question: '«Die Ampel» — это…',                        options: ['лампа', 'светофор', 'вывеска', 'остановка'],                  correctIndex: 1 },
      { question: '«Sie können es nicht verfehlen» значит…',   options: ['Вам туда нельзя', 'Вы не пройдёте мимо', 'Вы опоздаете', 'Это закрыто'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'geradeaus',      ru: 'прямо' },
      { id: 2, de: 'links',          ru: 'налево' },
      { id: 3, de: 'rechts',         ru: 'направо' },
      { id: 4, de: 'die Kreuzung',   ru: 'перекрёсток' },
      { id: 5, de: 'die Brücke',     ru: 'мост' },
      { id: 6, de: 'abbiegen',       ru: 'поворачивать' },
      { id: 7, de: 'die Ecke',       ru: 'угол' },
      { id: 8, de: 'der Weg',        ru: 'путь, дорога' }
    ],

    dictation: [
      { word: 'geradeaus',  audio: 'geradeaus' },
      { word: 'links',      audio: 'links' },
      { word: 'rechts',     audio: 'rechts' },
      { word: 'Kreuzung',   audio: 'Kreuzung' },
      { word: 'Brücke',     audio: 'Brücke' },
      { word: 'Ampel',      audio: 'Ampel' },
      { word: 'Straße',     audio: 'Straße' },
      { word: 'zeigen',     audio: 'zeigen' }
    ]
  }
};
