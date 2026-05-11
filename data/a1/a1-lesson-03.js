/* ═══════════════════════════════════════════════
   data/a1-lesson-03.js
   A1 · Урок 3: Welche Farbe ist das? — Цвета и описания
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-03',
  level: 'A1',
  unit:  3,
  title: 'Welche Farbe ist das?',
  subtitle: 'Цвета, оттенки и описание предметов',

  meta: {
    duration: '25–30 мин',
    wordCount: 24,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Welche Farbe hat das Auto?',           ru: 'Какого цвета машина?',                       note: 'Farbe = цвет, hat = имеет', audio: 'Welche Farbe hat das Auto' },
    { de: 'Das Auto ist rot.',                    ru: 'Машина красная.',                            note: 'После ist прилагательное не меняется', audio: 'Das Auto ist rot' },
    { de: 'Der Himmel ist blau.',                 ru: 'Небо синее.',                                note: 'der Himmel — мужской род', audio: 'Der Himmel ist blau' },
    { de: 'Die Wand ist weiß.',                   ru: 'Стена белая.',                               note: 'die Wand — женский род', audio: 'Die Wand ist weiß' },
    { de: 'Welche Farbe magst du?',               ru: 'Какой цвет тебе нравится?',                  note: 'mögen = любить, нравиться', audio: 'Welche Farbe magst du' },
    { de: 'Meine Lieblingsfarbe ist Grün.',       ru: 'Мой любимый цвет — зелёный.',                note: 'Lieblings- = любимый. Цвет как сущ. — с большой', audio: 'Meine Lieblingsfarbe ist Grün' },
    { de: 'Ich mag Schwarz und Weiß.',            ru: 'Мне нравятся чёрный и белый.',               note: 'Цвета как существительные — с большой буквы', audio: 'Ich mag Schwarz und Weiß' },
    { de: 'Das T-Shirt ist hellblau.',            ru: 'Футболка светло-голубая.',                   note: 'hell- = светло-', audio: 'Das T-Shirt ist hellblau' },
    { de: 'Die Hose ist dunkelgrau.',             ru: 'Брюки тёмно-серые.',                         note: 'dunkel- = тёмно-', audio: 'Die Hose ist dunkelgrau' },
    { de: 'Wie findest du die Jacke?',            ru: 'Как тебе куртка?',                           note: 'finden = находить (= считать)', audio: 'Wie findest du die Jacke' },
    { de: 'Sie ist sehr schön.',                  ru: 'Она очень красивая.',                        note: 'sehr = очень', audio: 'Sie ist sehr schön' },
    { de: 'Das gefällt mir.',                     ru: 'Мне это нравится.',                          note: 'gefallen = нравиться (с Dat.)', audio: 'Das gefällt mir' },
    { de: 'Das gefällt mir nicht.',               ru: 'Мне это не нравится.',                       note: 'nicht = не', audio: 'Das gefällt mir nicht' },
    { de: 'Welche Farbe ist im Trend?',           ru: 'Какой цвет в моде?',                         note: 'im Trend = в тренде', audio: 'Welche Farbe ist im Trend' },
    { de: 'Rot ist die Farbe der Liebe.',         ru: 'Красный — цвет любви.',                      note: 'der Liebe = любви (Genitiv)', audio: 'Rot ist die Farbe der Liebe' },
    { de: 'Mein Auto ist nicht weiß, sondern silber.', ru: 'Моя машина не белая, а серебристая.', note: 'sondern = «а» (после nicht)', audio: 'Mein Auto ist nicht weiß, sondern silber' },
    { de: 'Welche Farben hat die Flagge?',        ru: 'Какие цвета у флага?',                       note: 'Farben — мн.ч.', audio: 'Welche Farben hat die Flagge' },
    { de: 'Schwarz, Rot, Gold.',                  ru: 'Чёрный, красный, золотой.',                  note: 'Цвета флага Германии', audio: 'Schwarz, Rot, Gold' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'rot',         ru: 'красный',         ipa: '[ʁoːt]',         article: '' },
    { de: 'blau',        ru: 'синий, голубой',  ipa: '[blaʊ̯]',        article: '' },
    { de: 'grün',        ru: 'зелёный',         ipa: '[ɡʁyːn]',        article: '' },
    { de: 'gelb',        ru: 'жёлтый',          ipa: '[ɡɛlp]',         article: '' },
    { de: 'schwarz',     ru: 'чёрный',          ipa: '[ʃvaʁts]',       article: '' },
    { de: 'weiß',        ru: 'белый',           ipa: '[vaɪ̯s]',        article: '' },
    { de: 'grau',        ru: 'серый',           ipa: '[ɡʁaʊ̯]',        article: '' },
    { de: 'braun',       ru: 'коричневый',      ipa: '[bʁaʊ̯n]',       article: '' },
    { de: 'orange',      ru: 'оранжевый',       ipa: '[oˈʁɑ̃ːʒ]',      article: '' },
    { de: 'lila',        ru: 'фиолетовый',      ipa: '[ˈliːla]',       article: '' },
    { de: 'rosa',        ru: 'розовый',         ipa: '[ˈʁoːza]',       article: '' },
    { de: 'gold',        ru: 'золотой',         ipa: '[ɡɔlt]',         article: '' },
    { de: 'silber',      ru: 'серебристый',     ipa: '[ˈzɪlbɐ]',       article: '' },
    { de: 'die Farbe',   ru: 'цвет',            ipa: '[ˈfaʁbə]',       article: 'die' },
    { de: 'hell',        ru: 'светлый',         ipa: '[hɛl]',          article: '' },
    { de: 'dunkel',      ru: 'тёмный',          ipa: '[ˈdʊŋkl̩]',      article: '' },
    { de: 'schön',       ru: 'красивый',        ipa: '[ʃøːn]',         article: '' },
    { de: 'hässlich',    ru: 'некрасивый',      ipa: '[ˈhɛslɪç]',      article: '' },
    { de: 'das Auto',    ru: 'машина',          ipa: '[ˈaʊ̯to]',       article: 'das' },
    { de: 'die Hose',    ru: 'брюки',           ipa: '[ˈhoːzə]',       article: 'die' },
    { de: 'die Jacke',   ru: 'куртка',          ipa: '[ˈjakə]',        article: 'die' },
    { de: 'mögen',       ru: 'любить, нравиться', ipa: '[ˈmøːɡn̩]',    article: '' },
    { de: 'finden',      ru: 'находить, считать',ipa: '[ˈfɪndn̩]',     article: '' },
    { de: 'sehr',        ru: 'очень',           ipa: '[zeːɐ̯]',        article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Прилагательные после ist — без окончания',
      body: 'Когда прилагательное стоит <strong>после глагола sein</strong> (ist, sind), оно <em>никогда</em> не меняется по роду или числу:<br><br>' +
            '<strong>Der Ball</strong> ist <em>rot</em>. — Мяч красный.<br>' +
            '<strong>Die Rose</strong> ist <em>rot</em>. — Роза красная.<br>' +
            '<strong>Das Auto</strong> ist <em>rot</em>. — Машина красная.<br>' +
            '<strong>Die Bücher</strong> sind <em>rot</em>. — Книги красные.<br><br>' +
            'Это называется <strong>предикативное</strong> употребление. (Когда же прилагательное идёт перед существительным — <em>der rote Ball</em> — оно склоняется. Это пройдём позже.)',
      conjugation: [
        { pronoun: 'der (м.р.)',  form: 'rot', audio: 'Der Ball ist rot',     translation: 'Мяч красный' },
        { pronoun: 'die (ж.р.)',  form: 'rot', audio: 'Die Rose ist rot',     translation: 'Роза красная' },
        { pronoun: 'das (ср.р.)', form: 'rot', audio: 'Das Auto ist rot',     translation: 'Машина красная' },
        { pronoun: 'die (мн.ч.)', form: 'rot', audio: 'Die Bücher sind rot',  translation: 'Книги красные' }
      ]
    },
    {
      title: '⚡ Глагол mögen — что мне нравится',
      body: '<strong>mögen</strong> — модальный глагол, выражает симпатию: «нравится / люблю». В A1 его обычно учат в формах <em>möchten</em> (вежливое «хотел бы», урок 6) и в прямой форме <em>mögen</em> (нравится).',
      conjugation: [
        { pronoun: 'ich',           form: 'mag',   audio: 'ich mag',   translation: 'я люблю / мне нравится' },
        { pronoun: 'du',            form: 'magst', audio: 'du magst',  translation: 'тебе нравится' },
        { pronoun: 'er / sie / es', form: 'mag',   audio: 'er mag',    translation: 'ему/ей нравится' },
        { pronoun: 'wir',           form: 'mögen', audio: 'wir mögen', translation: 'нам нравится' },
        { pronoun: 'ihr',           form: 'mögt',  audio: 'ihr mögt',  translation: 'вам (группе) нравится' },
        { pronoun: 'Sie / sie',     form: 'mögen', audio: 'Sie mögen', translation: 'Вам / им нравится' }
      ]
    },
    {
      title: '💡 Hellblau, dunkelgrün — оттенки',
      body: 'Оттенки образуются добавлением <strong>hell-</strong> (светло-) или <strong>dunkel-</strong> (тёмно-) <em>перед</em> цветом — без пробела, в одно слово:<br><br>' +
            '<em>hellblau</em> — голубой &nbsp;|&nbsp; <em>dunkelblau</em> — тёмно-синий<br>' +
            '<em>hellgrün</em> — салатовый &nbsp;|&nbsp; <em>dunkelgrün</em> — тёмно-зелёный<br>' +
            '<em>hellrot</em> — алый &nbsp;|&nbsp; <em>dunkelrot</em> — бордовый<br><br>' +
            'Слово <em>rosa</em> уже означает «розовый» — отдельное слово.'
    },
    {
      title: '💡 Цвета как существительные — с большой буквы!',
      body: 'Когда цвет — это название (само понятие, а не описание), он становится существительным <em>среднего рода</em> и пишется с большой буквы:<br><br>' +
            '<em>Ich mag <strong>Blau</strong>.</em> — Я люблю синий (цвет).<br>' +
            '<em>Mein Auto ist blau.</em> — Моя машина синяя. (прилагательное)<br><br>' +
            'Сравни:<br>' +
            '<em>Sie trägt <strong>Schwarz</strong>.</em> — Она в чёрном.<br>' +
            '<em>Ihre Jacke ist schwarz.</em> — Её куртка чёрная.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Das Auto ist',           blank: 'rot',         after: '.',                translation: '— Машина красная.',                                hintWord: 'rot',        hintRule: 'rot = красный' },
      { before: '— Welche',                 blank: 'Farbe',       after: 'magst du?',        translation: '— Какой цвет тебе нравится?',                       hintWord: 'Farbe',      hintRule: 'Farbe = цвет (с большой — существительное)' },
      { before: '— Ich',                    blank: 'mag',         after: 'Blau und Grün.',   translation: '— Мне нравятся синий и зелёный.',                   hintWord: 'mag',        hintRule: 'ich → mag (форма mögen для «я»)' },
      { before: '— Der Himmel ist',         blank: 'grau',        after: '.',                translation: '— Небо серое.',                                     hintWord: 'grau',       hintRule: 'grau = серый' },
      { before: '— Die Bücher',             blank: 'sind',        after: 'gelb.',            translation: '— Книги жёлтые.',                                   hintWord: 'sind',       hintRule: 'мн.ч. → sind' },
      { before: '— Das T-Shirt ist',        blank: 'hellblau',    after: '.',                translation: '— Футболка светло-голубая.',                        hintWord: 'hellblau',   hintRule: 'hell + blau = светлый оттенок' },
      { before: '— Wie findest',            blank: 'du',          after: 'die Jacke?',       translation: '— Как тебе куртка?',                                hintWord: 'du',         hintRule: 'finden + du → findest' },
      { before: '— Das gefällt',            blank: 'mir',         after: 'sehr.',            translation: '— Мне это очень нравится.',                         hintWord: 'mir',        hintRule: 'gefallen + Dativ: mir = мне' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «жёлтый»?',                              options: ['grün', 'gelb', 'blau', 'braun'],                                                  correctIndex: 1 },
      { question: '«Welche Farbe hat das?» означает:',                     options: ['Сколько это стоит?', 'Что это такое?', 'Какого это цвета?', 'Где это?'],         correctIndex: 2 },
      { question: 'Как сказать «светло-синий»?',                           options: ['dunkelblau', 'hellblau', 'blaugrün', 'grauBlau'],                                  correctIndex: 1 },
      { question: 'Что значит «schwarz»?',                                 options: ['белый', 'серый', 'коричневый', 'чёрный'],                                          correctIndex: 3 },
      { question: 'Какая форма mögen для «du»?',                           options: ['mag', 'mögen', 'magst', 'mögt'],                                                   correctIndex: 2 },
      { question: 'Прилагательное в позиции «Die Hose ist ___»:',          options: ['должно склоняться по роду', 'не склоняется никогда', 'добавляет окончание -e', 'добавляет -er'], correctIndex: 1 },
      { question: 'Цвета флага Германии — это:',                           options: ['синий, белый, красный', 'чёрный, красный, золотой', 'жёлтый, чёрный, красный', 'белый, красный, синий'], correctIndex: 1 },
      { question: 'Когда цвет пишется с большой буквы?',                   options: ['всегда', 'никогда', 'когда выступает как существительное', 'только в начале предложения'], correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'rot',       ru: 'красный' },
      { id: 2, de: 'blau',      ru: 'синий' },
      { id: 3, de: 'grün',      ru: 'зелёный' },
      { id: 4, de: 'weiß',      ru: 'белый' },
      { id: 5, de: 'schwarz',   ru: 'чёрный' },
      { id: 6, de: 'gelb',      ru: 'жёлтый' },
      { id: 7, de: 'grau',      ru: 'серый' },
      { id: 8, de: 'die Farbe', ru: 'цвет' }
    ],

    dictation: [
      { word: 'rot',     audio: 'rot' },
      { word: 'blau',    audio: 'blau' },
      { word: 'grün',    audio: 'grün' },
      { word: 'gelb',    audio: 'gelb' },
      { word: 'weiß',    audio: 'weiß' },
      { word: 'schwarz', audio: 'schwarz' },
      { word: 'Farbe',   audio: 'Farbe' },
      { word: 'schön',   audio: 'schön' }
    ]
  }
};
