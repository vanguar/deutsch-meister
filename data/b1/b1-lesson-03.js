/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-03.js
   B1 · Урок 3: Relativsätze — Придаточные определительные
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-03',
  level:    'B1',
  unit:     3,
  title:    'Relativsätze',
  subtitle: 'Придаточные определительные · Relativpronomen',

  meta: {
    duration:  '35–40 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Das ist der Mann, der Deutsch spricht.',          ru: 'Это мужчина, который говорит по-немецки.',        note: 'der — Relativpronomen для der-существительных', audio: 'Das ist der Mann, der Deutsch spricht' },
    { de: 'Die Frau, die dort sitzt, ist meine Lehrerin.',  ru: 'Женщина, которая сидит там, — моя учительница.', note: 'die — для die-существительных', audio: 'Die Frau, die dort sitzt, ist meine Lehrerin' },
    { de: 'Das Kind, das weint, sucht seine Mutter.',       ru: 'Ребёнок, который плачет, ищет маму.',             note: 'das — для das-существительных', audio: 'Das Kind, das weint, sucht seine Mutter' },
    { de: 'Die Leute, die kommen, sind meine Freunde.',     ru: 'Люди, которые приходят, — мои друзья.',           note: 'die — для множественного числа', audio: 'Die Leute, die kommen, sind meine Freunde' },
    { de: 'Das ist das Buch, das ich lese.',                ru: 'Это книга, которую я читаю.',                     note: 'das (Akkusativ) — объект придаточного', audio: 'Das ist das Buch, das ich lese' },
    { de: 'Der Film, den ich gesehen habe, war gut.',       ru: 'Фильм, который я посмотрел, был хорошим.',        note: 'den — Akkusativ от der', audio: 'Der Film, den ich gesehen habe, war gut' },
    { de: 'Die Stadt, in der ich wohne, ist groß.',         ru: 'Город, в котором я живу, большой.',               note: 'in der — предлог + Relativpronomen (Dativ)', audio: 'Die Stadt, in der ich wohne, ist groß' },
    { de: 'Der Mann, dem ich helfe, ist krank.',            ru: 'Мужчина, которому я помогаю, болен.',             note: 'dem — Dativ от der', audio: 'Der Mann, dem ich helfe, ist krank' },
    { de: 'Das ist die Frau, deren Kind ich kenne.',        ru: 'Это женщина, чьего ребёнка я знаю.',              note: 'deren — Genitiv от die', audio: 'Das ist die Frau, deren Kind ich kenne' },
    { de: 'Das Haus, dessen Dach rot ist, gehört uns.',     ru: 'Дом, чья крыша красная, принадлежит нам.',        note: 'dessen — Genitiv от das/der', audio: 'Das Haus, dessen Dach rot ist, gehört uns' },
    { de: 'Wer das versteht, ist klug.',                    ru: 'Кто это понимает, тот умён.',                     note: 'wer — Relativpronomen без антецедента (лицо)', audio: 'Wer das versteht, ist klug' },
    { de: 'Was du sagst, stimmt.',                          ru: 'То, что ты говоришь, верно.',                     note: 'was — Relativpronomen без антецедента (вещь)', audio: 'Was du sagst, stimmt' },
    { de: 'Alles, was er macht, ist perfekt.',              ru: 'Всё, что он делает, — отлично.',                  note: 'was — после alles, nichts, etwas', audio: 'Alles, was er macht, ist perfekt' },
    { de: 'Der Arzt, bei dem ich war, ist sehr gut.',       ru: 'Врач, у которого я был, очень хороший.',          note: 'bei dem — предлог + Dativ Mask.', audio: 'Der Arzt, bei dem ich war, ist sehr gut' },
    { de: 'Die Aufgabe, mit der ich kämpfe, ist schwer.',   ru: 'Задание, с которым я борюсь, — сложное.',         note: 'mit der — Dat. Fem.', audio: 'Die Aufgabe, mit der ich kämpfe, ist schwer' },
    { de: 'Die Kinder, denen ich vorlese, schlafen ein.',   ru: 'Дети, которым я читаю вслух, засыпают.',          note: 'denen — Dativ Plural', audio: 'Die Kinder, denen ich vorlese, schlafen ein' },
    { de: 'Das ist etwas, was mich stört.',                 ru: 'Это кое-что, что меня беспокоит.',                note: 'was — после etwas, nichts, das', audio: 'Das ist etwas, was mich stört' },
    { de: 'Ein Mensch, dem man vertrauen kann, ist selten.', ru: 'Человек, которому можно доверять, редок.',       note: 'dem — Dativ Mask. + Modal', audio: 'Ein Mensch, dem man vertrauen kann, ist selten' },
    { de: 'Das Restaurant, in dem wir essen, ist teuer.',   ru: 'Ресторан, в котором мы едим, дорогой.',           note: 'in dem = worin (разговорная замена)', audio: 'Das Restaurant, in dem wir essen, ist teuer' },
    { de: 'Der Kollege, mit dem ich arbeite, ist nett.',    ru: 'Коллега, с которым я работаю, приятный.',         note: 'mit dem — Dat. Mask.', audio: 'Der Kollege, mit dem ich arbeite, ist nett' },
    { de: 'Das Thema, über das wir sprechen, ist wichtig.', ru: 'Тема, о которой мы говорим, важна.',              note: 'über das — Akk. Neut.', audio: 'Das Thema, über das wir sprechen, ist wichtig' },
    { de: 'Nichts, was er sagt, überrascht mich.',         ru: 'Ничто из того, что он говорит, меня не удивляет.', note: 'was — после nichts', audio: 'Nichts, was er sagt, überrascht mich' },
    { de: 'Die Sprache, die ich lerne, ist Deutsch.',      ru: 'Язык, который я учу, — немецкий.',                note: 'die — Akk. Fem.', audio: 'Die Sprache, die ich lerne, ist Deutsch' },
    { de: 'Der Zug, auf den ich warte, hat Verspätung.',   ru: 'Поезд, которого я жду, опаздывает.',              note: 'auf + Akk. → auf den', audio: 'Der Zug, auf den ich warte, hat Verspätung' }
  ],

  vocabulary: [
    { de: 'der Relativsatz',   ru: 'придаточное определительное', ipa: '[ʁelaˈtiːfzats]',  article: 'der' },
    { de: 'das Relativpronomen', ru: 'относительное местоимение', ipa: '[ʁelaˈtiːfpʁoˌnoːmən]', article: 'das' },
    { de: 'der Antezedent',    ru: 'антецедент (поясняемое слово)', ipa: '[anteˈtsɛdɛnt]', article: 'der' },
    { de: 'der (Rel.Pron.)',   ru: 'который (мужской род, Nom.)',   ipa: '[deːʁ]',          article: '' },
    { de: 'die (Rel.Pron.)',   ru: 'которая / которые',            ipa: '[diː]',           article: '' },
    { de: 'das (Rel.Pron.)',   ru: 'которое (средний род, Nom.)',   ipa: '[das]',           article: '' },
    { de: 'den',               ru: 'которого / которую (Akk.)',    ipa: '[deːn]',          article: '' },
    { de: 'dem',               ru: 'которому (Dativ Mask./Neut.)', ipa: '[deːm]',          article: '' },
    { de: 'der (Dativ Fem.)',  ru: 'которой (Dativ Fem.)',         ipa: '[deːʁ]',          article: '' },
    { de: 'denen',             ru: 'которым (Dativ Plural)',       ipa: '[ˈdeːnən]',       article: '' },
    { de: 'dessen',            ru: 'чей/чьего (Genitiv Mask.)',    ipa: '[ˈdɛsn̩]',        article: '' },
    { de: 'deren',             ru: 'чьей/чьих (Genitiv Fem./Pl.)',  ipa: '[ˈdeːʁən]',      article: '' },
    { de: 'wer',               ru: 'кто (без антецедента)',        ipa: '[veːʁ]',          article: '' },
    { de: 'was',               ru: 'что / то что (без антецедента)', ipa: '[vas]',         article: '' },
    { de: 'weinen',            ru: 'плакать',                      ipa: '[ˈvaɪ̯nən]',      article: '' },
    { de: 'gehören',           ru: 'принадлежать',                 ipa: '[ɡəˈhøːʁən]',    article: '' },
    { de: 'vertrauen',         ru: 'доверять',                     ipa: '[fɛʁˈtʁaʊ̯ən]',   article: '' },
    { de: 'stören',            ru: 'беспокоить, мешать',           ipa: '[ˈʃtøːʁən]',     article: '' },
    { de: 'überraschen',       ru: 'удивлять',                     ipa: '[ˌyːbɐˈʁaʃn̩]',  article: '' },
    { de: 'vorlesen',          ru: 'читать вслух',                 ipa: '[ˈfoːʁˌleːzn̩]',  article: '' },
    { de: 'kämpfen',           ru: 'бороться',                     ipa: '[ˈkɛmpfn̩]',      article: '' },
    { de: 'die Verspätung',    ru: 'опоздание',                    ipa: '[fɛʁˈʃpɛːtʊŋ]', article: 'die' },
    { de: 'selten',            ru: 'редко',                        ipa: '[ˈzɛltn̩]',       article: '' },
    { de: 'stimmen',           ru: 'быть правильным, верным',      ipa: '[ˈʃtɪmən]',      article: '' }
  ],

  grammar: [
    {
      title: '⚡ Relativpronomen — таблица форм',
      body: 'Относительное местоимение согласуется с <strong>антецедентом</strong> (род и число) и принимает падеж, требуемый <em>глаголом придаточного предложения</em>.<br><br>' +
            'Форм почти как у <em>определённого артикля</em>, за исключением Dativ Plural (<strong>denen</strong>) и всех Genitiv (<strong>dessen / deren</strong>).',
      conjugation: [
        { pronoun: 'Nom.',  form: 'der / die / das / die',       audio: 'der die das die',      translation: 'который / которая / которое / которые' },
        { pronoun: 'Akk.',  form: 'den / die / das / die',       audio: 'den die das die',      translation: '(объект)' },
        { pronoun: 'Dat.',  form: 'dem / der / dem / denen',     audio: 'dem der dem denen',    translation: '(косвенный объект)' },
        { pronoun: 'Gen.',  form: 'dessen / deren / dessen / deren', audio: 'dessen deren dessen deren', translation: 'чей / чья / чьё / чьи' }
      ]
    },
    {
      title: '⚡ Порядок слов в Relativsatz',
      body: 'В придаточном определительном <strong>глагол всегда стоит в конце</strong>.<br><br>' +
            '<em>Das ist der Mann, [der Deutsch <strong>spricht</strong>].</em><br>' +
            '<em>Das Buch, [das ich <strong>lese</strong>], ist interessant.</em><br><br>' +
            'Придаточное всегда выделяется <strong>запятыми</strong> с обеих сторон.<br><br>' +
            'С предлогом: предлог идёт <em>перед</em> Relativpronomen:<br>' +
            '<em>Die Stadt, [<strong>in der</strong> ich wohne], ist groß.</em>'
    },
    {
      title: '💡 wer и was — без антецедента',
      body: '<strong>wer</strong> — «тот, кто» (для лиц): <em><strong>Wer</strong> lernt, hat Erfolg.</em><br>' +
            '<strong>was</strong> — «то, что» (для вещей/идей): <em><strong>Was</strong> du sagst, stimmt.</em><br><br>' +
            '<em>was</em> также используется после: <em>alles, nichts, etwas, vieles, das</em>:<br>' +
            '<em>Alles, <strong>was</strong> er macht, ist gut.</em><br>' +
            '<em>Nichts, <strong>was</strong> du sagst, hilft.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Das ist der Mann,',      blank: 'der',    after: 'Deutsch spricht.',               translation: '— Это мужчина, который говорит по-немецки.', hintWord: 'der',    hintRule: 'der Mann → Nom. → der' },
      { before: '— Der Film,',              blank: 'den',    after: 'ich sah, war gut.',               translation: '— Фильм, который я видел, был хорошим.',    hintWord: 'den',    hintRule: 'der Film + sehen (Akk.) → den' },
      { before: '— Die Stadt,',             blank: 'in der', after: 'ich wohne, ist klein.',           translation: '— Город, в котором я живу, маленький.',     hintWord: 'in der', hintRule: 'in + Dat. Fem. → in der' },
      { before: '— Das ist die Frau,',      blank: 'deren',  after: 'Kind ich kenne.',                 translation: '— Это женщина, чьего ребёнка я знаю.',      hintWord: 'deren',  hintRule: 'Genitiv Fem. → deren' },
      { before: '—',                        blank: 'Wer',    after: 'viel lernt, hat Erfolg.',         translation: '— Кто много учит, тот добивается успеха.',  hintWord: 'Wer',    hintRule: 'wer — без антецедента (лицо)' },
      { before: '— Alles,',                 blank: 'was',    after: 'er sagt, ist wahr.',              translation: '— Всё, что он говорит, правда.',            hintWord: 'was',    hintRule: 'was — после alles' },
      { before: '— Die Kinder,',            blank: 'denen',  after: 'ich vorlese, schlafen ein.',      translation: '— Дети, которым я читаю, засыпают.',        hintWord: 'denen',  hintRule: 'Dativ Plural → denen' },
      { before: '— Das Haus,',              blank: 'dessen', after: 'Dach rot ist, gehört uns.',       translation: '— Дом, чья крыша красная, принадлежит нам.', hintWord: 'dessen', hintRule: 'Genitiv Mask./Neut. → dessen' }
    ],

    multipleChoice: [
      { question: '«der Mann, ___ hilft» — какое местоимение?',                 options: ['den', 'dem', 'der', 'dessen'],                               correctIndex: 2 },
      { question: '«die Frau, ___ ich helfe» — Dativ!',                         options: ['die', 'der', 'deren', 'denen'],                              correctIndex: 1 },
      { question: 'После «alles» какое местоимение?',                           options: ['der', 'die', 'was', 'wer'],                                  correctIndex: 2 },
      { question: 'Где стоит глагол в Relativsatz?',                            options: ['В начале', 'В середине', 'В конце', 'На 2-й позиции'],        correctIndex: 2 },
      { question: '«das Buch, ___ ich lese» — Akkusativ Neutrum!',              options: ['das', 'dem', 'des', 'den'],                                  correctIndex: 0 },
      { question: 'Genitiv Plural от die → ?',                                  options: ['denen', 'deren', 'dessen', 'der'],                           correctIndex: 1 },
      { question: '«Wer lernt» — кто может быть антецедентом?',                 options: ['Предмет', 'Ничего (лицо без антецедента)', 'Животное', 'Идея'], correctIndex: 1 },
      { question: '«in dem» можно заменить на…',                                options: ['worin', 'wohin', 'woher', 'worüber'],                        correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'der (Nom. Mask.)',  ru: 'который (мужской, именительный)' },
      { id: 2, de: 'den (Akk. Mask.)', ru: 'которого (мужской, Akkusativ)' },
      { id: 3, de: 'dem (Dat. Mask.)', ru: 'которому (мужской, Dativ)' },
      { id: 4, de: 'dessen',           ru: 'чей/чьего (Genitiv)' },
      { id: 5, de: 'denen',            ru: 'которым (Dativ Plural)' },
      { id: 6, de: 'deren',            ru: 'чьей/чьих (Genitiv Fem./Pl.)' },
      { id: 7, de: 'wer',              ru: 'кто (без антецедента)' },
      { id: 8, de: 'was',              ru: 'что (без антецедента)' }
    ],

    dictation: [
      { word: 'Relativsatz',  audio: 'Relativsatz' },
      { word: 'der',          audio: 'der' },
      { word: 'dessen',       audio: 'dessen' },
      { word: 'denen',        audio: 'denen' },
      { word: 'deren',        audio: 'deren' },
      { word: 'Verspätung',   audio: 'Verspätung' },
      { word: 'gehören',      audio: 'gehören' },
      { word: 'vertrauen',    audio: 'vertrauen' }
    ]
  }
};
