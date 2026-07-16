/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-13.js
   A1 · Урок 13: Im Supermarkt — В супермаркете
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-13',
  level: 'A1',
  unit:  13,
  title: 'Im Supermarkt',
  subtitle: 'В супермаркете · Продукты и покупки',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Ich gehe einkaufen.',                 ru: 'Я иду за покупками.',              note: 'einkaufen gehen — идти за покупками', audio: 'Ich gehe einkaufen' },
    { de: 'Was brauchen wir?',                   ru: 'Что нам нужно?',                   note: 'brauchen — нуждаться', audio: 'Was brauchen wir' },
    { de: 'Wir brauchen Brot und Milch.',        ru: 'Нам нужны хлеб и молоко.',         note: 'das Brot — хлеб; die Milch — молоко', audio: 'Wir brauchen Brot und Milch' },
    { de: 'Wo finde ich das Obst?',              ru: 'Где мне найти фрукты?',            note: 'finden — находить; das Obst — фрукты', audio: 'Wo finde ich das Obst' },
    { de: 'Das Gemüse ist dort drüben.',         ru: 'Овощи вон там.',                   note: 'das Gemüse — овощи; dort drüben — вон там', audio: 'Das Gemüse ist dort drüben' },
    { de: 'Ich nehme einen Apfel.',              ru: 'Я возьму яблоко.',                 note: 'nehmen — брать; der Apfel — яблоко', audio: 'Ich nehme einen Apfel' },
    { de: 'Was kostet die Butter?',              ru: 'Сколько стоит масло?',             note: 'kosten — стоить; die Butter — масло', audio: 'Was kostet die Butter' },
    { de: 'Das ist zu teuer.',                   ru: 'Это слишком дорого.',              note: 'zu teuer — слишком дорого', audio: 'Das ist zu teuer' },
    { de: 'Haben Sie frische Eier?',             ru: 'У вас есть свежие яйца?',          note: 'frisch — свежий; das Ei → die Eier', audio: 'Haben Sie frische Eier' },
    { de: 'Ich hätte gern ein Kilo Tomaten.',    ru: 'Мне, пожалуйста, килограмм помидоров.', note: 'ich hätte gern — я бы хотел (вежливо)', audio: 'Ich hätte gern ein Kilo Tomaten' },
    { de: 'Sonst noch etwas?',                   ru: 'Что-нибудь ещё?',                  note: 'стандартный вопрос продавца', audio: 'Sonst noch etwas' },
    { de: 'Nein, danke. Das ist alles.',         ru: 'Нет, спасибо. Это всё.',           note: 'das ist alles — это всё', audio: 'Nein, danke. Das ist alles' },
    { de: 'Wo ist die Kasse?',                   ru: 'Где касса?',                       note: 'die Kasse — касса', audio: 'Wo ist die Kasse' },
    { de: 'Zahlen Sie bar oder mit Karte?',      ru: 'Вы платите наличными или картой?', note: 'bar — наличными; die Karte — карта', audio: 'Zahlen Sie bar oder mit Karte' },
    { de: 'Ich zahle mit Karte.',                ru: 'Я плачу картой.',                  note: 'zahlen — платить', audio: 'Ich zahle mit Karte' },
    { de: 'Hier ist Ihr Kassenbon.',             ru: 'Вот ваш чек.',                     note: 'der Kassenbon — чек', audio: 'Hier ist Ihr Kassenbon' }
  ],

  vocabulary: [
    { de: 'der Supermarkt', ru: 'супермаркет',      ipa: '[ˈzuːpɐˌmaʁkt]',  article: 'der' },
    { de: 'das Brot',       ru: 'хлеб',             ipa: '[bʁoːt]',         article: 'das' },
    { de: 'die Milch',      ru: 'молоко',           ipa: '[mɪlç]',          article: 'die' },
    { de: 'die Butter',     ru: 'сливочное масло',  ipa: '[ˈbʊtɐ]',         article: 'die' },
    { de: 'das Ei',         ru: 'яйцо',             ipa: '[aɪ̯]',           article: 'das' },
    { de: 'der Käse',       ru: 'сыр',              ipa: '[ˈkɛːzə]',        article: 'der' },
    { de: 'das Obst',       ru: 'фрукты',           ipa: '[oːpst]',         article: 'das' },
    { de: 'das Gemüse',     ru: 'овощи',            ipa: '[ɡəˈmyːzə]',      article: 'das' },
    { de: 'der Apfel',      ru: 'яблоко',           ipa: '[ˈapfl̩]',        article: 'der' },
    { de: 'die Tomate',     ru: 'помидор',          ipa: '[toˈmaːtə]',      article: 'die' },
    { de: 'die Kartoffel',  ru: 'картофель',        ipa: '[kaʁˈtɔfl̩]',     article: 'die' },
    { de: 'das Fleisch',    ru: 'мясо',             ipa: '[flaɪ̯ʃ]',        article: 'das' },
    { de: 'die Kasse',      ru: 'касса',            ipa: '[ˈkasə]',         article: 'die' },
    { de: 'der Preis',      ru: 'цена',             ipa: '[pʁaɪ̯s]',        article: 'der' },
    { de: 'einkaufen',      ru: 'делать покупки',   ipa: '[ˈaɪ̯nˌkaʊ̯fn̩]', article: '' },
    { de: 'brauchen',       ru: 'нуждаться',        ipa: '[ˈbʁaʊ̯xn̩]',     article: '' },
    { de: 'kosten',         ru: 'стоить',           ipa: '[ˈkɔstn̩]',       article: '' },
    { de: 'zahlen',         ru: 'платить',          ipa: '[ˈtsaːlən]',      article: '' },
    { de: 'teuer',          ru: 'дорогой',          ipa: '[ˈtɔɪ̯ɐ]',        article: '' },
    { de: 'billig',         ru: 'дешёвый',          ipa: '[ˈbɪlɪç]',        article: '' }
  ],

  grammar: [
    {
      title: '⚡ Ich hätte gern… — вежливая просьба в магазине',
      body: '<strong>Ich hätte gern</strong> («я бы хотел») — самая полезная фраза для покупок:<br><br>' +
            '<em>Ich hätte gern ein Kilo Äpfel.</em> — Мне, пожалуйста, килограмм яблок.<br>' +
            '<em>Ich hätte gern zwei Brötchen.</em> — Мне, пожалуйста, две булочки.<br><br>' +
            'Проще (но менее вежливо): <em>Ich nehme…</em> — я возьму…',
      conjugation: [
        { pronoun: 'вежливо',  form: 'Ich hätte gern ein Brot.',   audio: 'Ich hätte gern ein Brot',   translation: 'Мне, пожалуйста, хлеб.' },
        { pronoun: 'просто',   form: 'Ich nehme einen Apfel.',     audio: 'Ich nehme einen Apfel',     translation: 'Я возьму яблоко.' },
        { pronoun: 'вопрос',   form: 'Haben Sie frische Eier?',    audio: 'Haben Sie frische Eier',    translation: 'У вас есть свежие яйца?' },
        { pronoun: 'цена',     form: 'Was kostet der Käse?',       audio: 'Was kostet der Käse',       translation: 'Сколько стоит сыр?' }
      ]
    },
    {
      title: '⚡ Глагол nehmen — брать (e → i)',
      body: 'У <strong>nehmen</strong> в формах du и er/sie/es корень меняется: <strong>e → i</strong> (и удваивается m):<br><br>' +
            '<em>Ich nehme. → Du n<strong>imm</strong>st. → Er n<strong>imm</strong>t.</em>',
      conjugation: [
        { pronoun: 'ich',           form: 'nehme',   audio: 'ich nehme',   translation: 'я беру' },
        { pronoun: 'du',            form: 'nimmst',  audio: 'du nimmst',   translation: 'ты берёшь' },
        { pronoun: 'er / sie / es', form: 'nimmt',   audio: 'er nimmt',    translation: 'он/она берёт' },
        { pronoun: 'wir',           form: 'nehmen',  audio: 'wir nehmen',  translation: 'мы берём' },
        { pronoun: 'ihr',           form: 'nehmt',   audio: 'ihr nehmt',   translation: 'вы берёте' },
        { pronoun: 'Sie / sie',     form: 'nehmen',  audio: 'Sie nehmen',  translation: 'Вы берёте / они берут' }
      ]
    },
    {
      title: '💡 Was kostet…? — спрашиваем цену',
      body: 'Спросить цену просто:<br><br>' +
            '<em><strong>Was kostet</strong> das Brot?</em> — Сколько стоит хлеб? (одна вещь → kostet)<br>' +
            '<em><strong>Was kosten</strong> die Äpfel?</em> — Сколько стоят яблоки? (несколько → kosten)<br><br>' +
            'Ответ: <em>Das Brot kostet zwei Euro.</em> — Хлеб стоит два евро.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich gehe',              blank: 'einkaufen',  after: '.',                       translation: '— Я иду за покупками.',              hintWord: 'einkaufen',  hintRule: 'einkaufen gehen — за покупками' },
      { before: '— Wir',                   blank: 'brauchen',   after: 'Brot und Milch.',         translation: '— Нам нужны хлеб и молоко.',         hintWord: 'brauchen',   hintRule: 'brauchen — нуждаться' },
      { before: '— Was',                   blank: 'kostet',     after: 'die Butter?',             translation: '— Сколько стоит масло?',             hintWord: 'kostet',     hintRule: 'ед. число → kostet' },
      { before: '— Das ist zu',            blank: 'teuer',      after: '.',                       translation: '— Это слишком дорого.',              hintWord: 'teuer',      hintRule: 'teuer — дорогой' },
      { before: '— Ich hätte',             blank: 'gern',       after: 'ein Kilo Tomaten.',       translation: '— Мне, пожалуйста, кило помидоров.', hintWord: 'gern',       hintRule: 'ich hätte gern — вежливая просьба' },
      { before: '— Er',                    blank: 'nimmt',      after: 'einen Apfel.',            translation: '— Он берёт яблоко.',                 hintWord: 'nimmt',      hintRule: 'nehmen → nimmt (e→i)' },
      { before: '— Ich zahle mit',         blank: 'Karte',      after: '.',                       translation: '— Я плачу картой.',                  hintWord: 'Karte',      hintRule: 'mit Karte — картой' },
      { before: '— Wo ist die',            blank: 'Kasse',      after: '?',                       translation: '— Где касса?',                       hintWord: 'Kasse',      hintRule: 'die Kasse — касса' }
    ],

    multipleChoice: [
      { question: '«Das Obst» — это…',                         options: ['овощи', 'фрукты', 'мясо', 'молоко'],                        correctIndex: 1 },
      { question: '«Ich hätte gern…» значит…',                 options: ['я имею', 'я бы хотел (вежливо)', 'мне нравится', 'я беру силой'], correctIndex: 1 },
      { question: 'Форма nehmen для «er»…',                    options: ['nehmt', 'nimmt', 'nehmet', 'nimmst'],                       correctIndex: 1 },
      { question: 'Противоположность «teuer»…',                options: ['frisch', 'billig', 'gut', 'neu'],                           correctIndex: 1 },
      { question: '«Sonst noch etwas?» спрашивает…',           options: ['покупатель', 'продавец', 'врач', 'учитель'],                correctIndex: 1 },
      { question: 'Как сказать «наличными»?',                  options: ['mit Karte', 'bar', 'teuer', 'per Handy'],                   correctIndex: 1 },
      { question: '«Die Kasse» — это…',                        options: ['полка', 'касса', 'корзина', 'цена'],                        correctIndex: 1 },
      { question: 'Несколько вещей: «Was … die Äpfel?»',       options: ['kostet', 'kosten', 'kostest', 'koste'],                     correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'das Brot',      ru: 'хлеб' },
      { id: 2, de: 'die Milch',     ru: 'молоко' },
      { id: 3, de: 'das Gemüse',    ru: 'овощи' },
      { id: 4, de: 'der Apfel',     ru: 'яблоко' },
      { id: 5, de: 'das Fleisch',   ru: 'мясо' },
      { id: 6, de: 'der Preis',     ru: 'цена' },
      { id: 7, de: 'billig',        ru: 'дешёвый' },
      { id: 8, de: 'einkaufen',     ru: 'делать покупки' }
    ],

    dictation: [
      { word: 'Brot',       audio: 'Brot' },
      { word: 'Milch',      audio: 'Milch' },
      { word: 'Apfel',      audio: 'Apfel' },
      { word: 'Käse',       audio: 'Käse' },
      { word: 'Kasse',      audio: 'Kasse' },
      { word: 'teuer',      audio: 'teuer' },
      { word: 'billig',     audio: 'billig' },
      { word: 'einkaufen',  audio: 'einkaufen' }
    ]
  }
};
