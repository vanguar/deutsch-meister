/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-11.js
   A1 · Урок 11: Tiere — Животные
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-11',
  level: 'A1',
  unit:  11,
  title: 'Tiere',
  subtitle: 'Животные и питомцы',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Hast du ein Haustier?',            ru: 'У тебя есть питомец?',            note: 'das Haustier — домашнее животное', audio: 'Hast du ein Haustier' },
    { de: 'Ich habe einen Hund.',             ru: 'У меня есть собака.',             note: 'der Hund → einen Hund (Akkusativ)', audio: 'Ich habe einen Hund' },
    { de: 'Meine Katze heißt Mimi.',          ru: 'Мою кошку зовут Мими.',           note: 'die Katze — кошка', audio: 'Meine Katze heißt Mimi' },
    { de: 'Der Hund ist mein Freund.',        ru: 'Собака — мой друг.',              note: 'der Freund — друг', audio: 'Der Hund ist mein Freund' },
    { de: 'Die Katze schläft auf dem Sofa.',  ru: 'Кошка спит на диване.',           note: 'schlafen — спать', audio: 'Die Katze schläft auf dem Sofa' },
    { de: 'Der Vogel singt schön.',           ru: 'Птица красиво поёт.',             note: 'der Vogel — птица; singen — петь', audio: 'Der Vogel singt schön' },
    { de: 'Fische leben im Wasser.',          ru: 'Рыбы живут в воде.',              note: 'der Fisch → die Fische; das Wasser — вода', audio: 'Fische leben im Wasser' },
    { de: 'Das Pferd ist groß und stark.',    ru: 'Лошадь большая и сильная.',       note: 'das Pferd — лошадь', audio: 'Das Pferd ist groß und stark' },
    { de: 'Die Kuh gibt Milch.',              ru: 'Корова даёт молоко.',             note: 'die Kuh — корова; die Milch — молоко', audio: 'Die Kuh gibt Milch' },
    { de: 'Ich gehe mit dem Hund spazieren.', ru: 'Я гуляю с собакой.',              note: 'spazieren gehen — гулять', audio: 'Ich gehe mit dem Hund spazieren' },
    { de: 'Magst du Tiere?',                  ru: 'Ты любишь животных?',             note: 'das Tier → die Tiere', audio: 'Magst du Tiere' },
    { de: 'Im Zoo gibt es viele Tiere.',      ru: 'В зоопарке много животных.',      note: 'es gibt — есть, имеется', audio: 'Im Zoo gibt es viele Tiere' },
    { de: 'Der Löwe ist der König der Tiere.', ru: 'Лев — царь зверей.',             note: 'der Löwe — лев; der König — король', audio: 'Der Löwe ist der König der Tiere' },
    { de: 'Die Maus ist sehr klein.',         ru: 'Мышь очень маленькая.',           note: 'die Maus — мышь', audio: 'Die Maus ist sehr klein' },
    { de: 'Der Hund bellt laut.',             ru: 'Собака громко лает.',             note: 'bellen — лаять; laut — громко', audio: 'Der Hund bellt laut' },
    { de: 'Ich füttere die Katze.',           ru: 'Я кормлю кошку.',                 note: 'füttern — кормить (животных)', audio: 'Ich füttere die Katze' }
  ],

  vocabulary: [
    { de: 'das Tier',      ru: 'животное',           ipa: '[tiːɐ̯]',       article: 'das' },
    { de: 'das Haustier',  ru: 'домашнее животное',  ipa: '[ˈhaʊ̯sˌtiːɐ̯]', article: 'das' },
    { de: 'der Hund',      ru: 'собака',             ipa: '[hʊnt]',        article: 'der' },
    { de: 'die Katze',     ru: 'кошка',              ipa: '[ˈkatsə]',      article: 'die' },
    { de: 'der Vogel',     ru: 'птица',              ipa: '[ˈfoːɡl̩]',     article: 'der' },
    { de: 'der Fisch',     ru: 'рыба',               ipa: '[fɪʃ]',         article: 'der' },
    { de: 'das Pferd',     ru: 'лошадь',             ipa: '[pfeːɐ̯t]',     article: 'das' },
    { de: 'die Kuh',       ru: 'корова',             ipa: '[kuː]',         article: 'die' },
    { de: 'das Schwein',   ru: 'свинья',             ipa: '[ʃvaɪ̯n]',      article: 'das' },
    { de: 'die Maus',      ru: 'мышь',               ipa: '[maʊ̯s]',       article: 'die' },
    { de: 'der Löwe',      ru: 'лев',                ipa: '[ˈløːvə]',      article: 'der' },
    { de: 'der Bär',       ru: 'медведь',            ipa: '[bɛːɐ̯]',       article: 'der' },
    { de: 'der Hase',      ru: 'заяц',               ipa: '[ˈhaːzə]',      article: 'der' },
    { de: 'der Zoo',       ru: 'зоопарк',            ipa: '[tsoː]',        article: 'der' },
    { de: 'schlafen',      ru: 'спать',              ipa: '[ˈʃlaːfn̩]',    article: '' },
    { de: 'singen',        ru: 'петь',               ipa: '[ˈzɪŋən]',      article: '' },
    { de: 'bellen',        ru: 'лаять',              ipa: '[ˈbɛlən]',      article: '' },
    { de: 'füttern',       ru: 'кормить (животных)', ipa: '[ˈfʏtɐn]',      article: '' },
    { de: 'leben',         ru: 'жить, обитать',      ipa: '[ˈleːbn̩]',     article: '' },
    { de: 'laut',          ru: 'громко, громкий',    ipa: '[laʊ̯t]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ Akkusativ: Ich habe einen Hund',
      body: 'После <strong>haben</strong> существительное стоит в винительном падеже (Akkusativ). Меняется только мужской род:<br><br>' +
            '<strong>der</strong> Hund → Ich habe <strong>einen</strong> Hund.<br>' +
            '<strong>die</strong> Katze → Ich habe <strong>eine</strong> Katze.<br>' +
            '<strong>das</strong> Pferd → Ich habe <strong>ein</strong> Pferd.',
      conjugation: [
        { pronoun: 'der Hund (м.р.)',   form: 'Ich habe einen Hund.',  audio: 'Ich habe einen Hund',  translation: 'У меня есть собака.' },
        { pronoun: 'die Katze (ж.р.)',  form: 'Ich habe eine Katze.',  audio: 'Ich habe eine Katze',  translation: 'У меня есть кошка.' },
        { pronoun: 'das Pferd (ср.р.)', form: 'Ich habe ein Pferd.',   audio: 'Ich habe ein Pferd',   translation: 'У меня есть лошадь.' },
        { pronoun: 'мн. число',         form: 'Ich habe zwei Katzen.', audio: 'Ich habe zwei Katzen', translation: 'У меня две кошки.' }
      ]
    },
    {
      title: '⚡ Конструкция es gibt — «есть, имеется»',
      body: '<strong>Es gibt</strong> + Akkusativ означает «есть, существует, имеется»:<br><br>' +
            '<em>Im Zoo <strong>gibt es</strong> viele Tiere.</em> — В зоопарке (есть) много животных.<br>' +
            '<em><strong>Gibt es</strong> hier einen Zoo?</em> — Здесь есть зоопарк?',
      conjugation: [
        { pronoun: 'утверждение', form: 'Es gibt viele Tiere.',    audio: 'Es gibt viele Tiere',    translation: 'Есть много животных.' },
        { pronoun: 'вопрос',      form: 'Gibt es hier einen Zoo?', audio: 'Gibt es hier einen Zoo', translation: 'Здесь есть зоопарк?' },
        { pronoun: 'отрицание',   form: 'Es gibt keinen Hund.',    audio: 'Es gibt keinen Hund',    translation: 'Собаки нет.' }
      ]
    },
    {
      title: '💡 Глагол schlafen — спать (с изменением корня)',
      body: 'У некоторых глаголов в формах <em>du</em> и <em>er/sie/es</em> меняется корневая гласная: <strong>a → ä</strong>:<br><br>' +
            '<em>Ich schlafe. → Du schl<strong>ä</strong>fst. → Die Katze schl<strong>ä</strong>ft.</em>',
      conjugation: [
        { pronoun: 'ich',           form: 'schlafe',   audio: 'ich schlafe',   translation: 'я сплю' },
        { pronoun: 'du',            form: 'schläfst',  audio: 'du schläfst',   translation: 'ты спишь' },
        { pronoun: 'er / sie / es', form: 'schläft',   audio: 'sie schläft',   translation: 'он/она спит' },
        { pronoun: 'wir',           form: 'schlafen',  audio: 'wir schlafen',  translation: 'мы спим' },
        { pronoun: 'ihr',           form: 'schlaft',   audio: 'ihr schlaft',   translation: 'вы спите' },
        { pronoun: 'Sie / sie',     form: 'schlafen',  audio: 'sie schlafen',  translation: 'Вы спите / они спят' }
      ]
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich habe',            blank: 'einen',    after: 'Hund.',              translation: '— У меня есть собака.',          hintWord: 'einen',    hintRule: 'der → einen (Akkusativ м.р.)' },
      { before: '— Ich habe',            blank: 'eine',     after: 'Katze.',             translation: '— У меня есть кошка.',           hintWord: 'eine',     hintRule: 'die → eine' },
      { before: '— Die Katze',           blank: 'schläft',  after: 'auf dem Sofa.',      translation: '— Кошка спит на диване.',        hintWord: 'schläft',  hintRule: 'schlafen → a→ä для er/sie/es' },
      { before: '— Der Hund',            blank: 'bellt',    after: 'laut.',              translation: '— Собака громко лает.',          hintWord: 'bellt',    hintRule: 'bellen — лаять' },
      { before: '— Im Zoo',              blank: 'gibt',     after: 'es viele Tiere.',    translation: '— В зоопарке много животных.',   hintWord: 'gibt',     hintRule: 'es gibt — есть, имеется' },
      { before: '— Fische',              blank: 'leben',    after: 'im Wasser.',         translation: '— Рыбы живут в воде.',           hintWord: 'leben',    hintRule: 'leben — жить, обитать' },
      { before: '— Der Vogel',           blank: 'singt',    after: 'schön.',             translation: '— Птица красиво поёт.',          hintWord: 'singt',    hintRule: 'singen → singt' },
      { before: '— Ich',                 blank: 'füttere',  after: 'die Katze.',         translation: '— Я кормлю кошку.',              hintWord: 'füttere',  hintRule: 'füttern — кормить животных' }
    ],

    multipleChoice: [
      { question: '«Der Hund» — это…',                          options: ['кошка', 'собака', 'птица', 'мышь'],                         correctIndex: 1 },
      { question: 'Как сказать «У меня есть собака»?',          options: ['Ich habe ein Hund.', 'Ich habe einen Hund.', 'Ich habe eine Hund.', 'Ich bin ein Hund.'], correctIndex: 1 },
      { question: '«Das Pferd» — это…',                         options: ['корова', 'свинья', 'лошадь', 'медведь'],                    correctIndex: 2 },
      { question: 'Что делает собака? Sie …',                   options: ['singt', 'bellt', 'schwimmt', 'liest'],                      correctIndex: 1 },
      { question: '«Es gibt» означает…',                        options: ['оно даёт', 'есть, имеется', 'идёт дождь', 'нравится'],      correctIndex: 1 },
      { question: 'Форма schlafen для «du»…',                   options: ['schlafst', 'schläfst', 'schläft', 'schlafen'],              correctIndex: 1 },
      { question: 'Какое животное «die Kuh»?',                  options: ['коза', 'корова', 'курица', 'овца'],                         correctIndex: 1 },
      { question: '«Füttern» значит…',                          options: ['гладить', 'кормить животных', 'гулять', 'мыть'],            correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Hund',     ru: 'собака' },
      { id: 2, de: 'die Katze',    ru: 'кошка' },
      { id: 3, de: 'der Vogel',    ru: 'птица' },
      { id: 4, de: 'der Fisch',    ru: 'рыба' },
      { id: 5, de: 'das Pferd',    ru: 'лошадь' },
      { id: 6, de: 'der Bär',      ru: 'медведь' },
      { id: 7, de: 'die Maus',     ru: 'мышь' },
      { id: 8, de: 'das Haustier', ru: 'домашнее животное' }
    ],

    dictation: [
      { word: 'Hund',     audio: 'Hund' },
      { word: 'Katze',    audio: 'Katze' },
      { word: 'Vogel',    audio: 'Vogel' },
      { word: 'Fisch',    audio: 'Fisch' },
      { word: 'Pferd',    audio: 'Pferd' },
      { word: 'Tier',     audio: 'Tier' },
      { word: 'Zoo',      audio: 'Zoo' },
      { word: 'Maus',     audio: 'Maus' }
    ]
  }
};
