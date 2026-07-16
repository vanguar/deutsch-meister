/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-09.js
   A2 · Урок 9: Im Restaurant — В ресторане
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-09',
  level: 'A2',
  unit:  9,
  title: 'Im Restaurant',
  subtitle: 'В ресторане · Заказ, пожелания, оплата',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Ich möchte einen Tisch für zwei Personen reservieren.', ru: 'Я хотел бы забронировать столик на двоих.', note: 'reservieren — бронировать', audio: 'Ich möchte einen Tisch für zwei Personen reservieren' },
    { de: 'Haben Sie einen Tisch am Fenster?',   ru: 'У вас есть столик у окна?',        note: 'am Fenster — у окна', audio: 'Haben Sie einen Tisch am Fenster' },
    { de: 'Können Sie etwas empfehlen?',         ru: 'Вы можете что-нибудь порекомендовать?', note: 'empfehlen — рекомендовать', audio: 'Können Sie etwas empfehlen' },
    { de: 'Als Vorspeise nehme ich die Suppe.',  ru: 'На закуску я возьму суп.',         note: 'die Vorspeise — закуска', audio: 'Als Vorspeise nehme ich die Suppe' },
    { de: 'Als Hauptgericht möchte ich das Schnitzel.', ru: 'На горячее я хотел бы шницель.', note: 'das Hauptgericht — основное блюдо', audio: 'Als Hauptgericht möchte ich das Schnitzel' },
    { de: 'Was können Sie zum Nachtisch anbieten?', ru: 'Что вы можете предложить на десерт?', note: 'der Nachtisch — десерт; anbieten — предлагать', audio: 'Was können Sie zum Nachtisch anbieten' },
    { de: 'Ich bin Vegetarier.',                 ru: 'Я вегетарианец.',                  note: 'der Vegetarier — вегетарианец', audio: 'Ich bin Vegetarier' },
    { de: 'Ist in diesem Gericht Fleisch?',      ru: 'В этом блюде есть мясо?',          note: 'das Gericht — блюдо', audio: 'Ist in diesem Gericht Fleisch' },
    { de: 'Das Essen ist ausgezeichnet!',        ru: 'Еда превосходная!',                note: 'ausgezeichnet — превосходный', audio: 'Das Essen ist ausgezeichnet' },
    { de: 'Entschuldigung, die Suppe ist kalt.', ru: 'Извините, суп холодный.',          note: 'вежливая жалоба', audio: 'Entschuldigung, die Suppe ist kalt' },
    { de: 'Könnten Sie mir noch Wasser bringen?', ru: 'Не могли бы вы принести мне ещё воды?', note: 'könnten — вежливее, чем können', audio: 'Könnten Sie mir noch Wasser bringen' },
    { de: 'Wir möchten bitte bezahlen.',         ru: 'Мы хотели бы расплатиться.',       note: 'bezahlen — оплачивать', audio: 'Wir möchten bitte bezahlen' },
    { de: 'Die Rechnung stimmt nicht.',          ru: 'Счёт неверный.',                   note: 'stimmen — быть верным', audio: 'Die Rechnung stimmt nicht' },
    { de: 'Das Trinkgeld ist für Sie.',          ru: 'Чаевые — для вас.',                note: 'обычно 5–10% в Германии', audio: 'Das Trinkgeld ist für Sie' },
    { de: 'Hat es Ihnen geschmeckt?',            ru: 'Вам понравилось (было вкусно)?',   note: 'вопрос официанта после еды', audio: 'Hat es Ihnen geschmeckt' },
    { de: 'Es war köstlich, danke!',             ru: 'Было очень вкусно, спасибо!',      note: 'köstlich — восхитительный на вкус', audio: 'Es war köstlich, danke' }
  ],

  vocabulary: [
    { de: 'das Restaurant',   ru: 'ресторан',          ipa: '[ʁɛstoˈʁãː]',       article: 'das' },
    { de: 'die Vorspeise',    ru: 'закуска',           ipa: '[ˈfoːɐ̯ˌʃpaɪ̯zə]',  article: 'die' },
    { de: 'das Hauptgericht', ru: 'основное блюдо',    ipa: '[ˈhaʊ̯ptɡəˌʁɪçt]',  article: 'das' },
    { de: 'der Nachtisch',    ru: 'десерт',            ipa: '[ˈnaːxˌtɪʃ]',       article: 'der' },
    { de: 'das Gericht',      ru: 'блюдо',             ipa: '[ɡəˈʁɪçt]',         article: 'das' },
    { de: 'die Suppe',        ru: 'суп',               ipa: '[ˈzʊpə]',           article: 'die' },
    { de: 'das Schnitzel',    ru: 'шницель',           ipa: '[ˈʃnɪtsl̩]',        article: 'das' },
    { de: 'der Salat',        ru: 'салат',             ipa: '[zaˈlaːt]',         article: 'der' },
    { de: 'das Besteck',      ru: 'столовые приборы',  ipa: '[bəˈʃtɛk]',         article: 'das' },
    { de: 'die Serviette',    ru: 'салфетка',          ipa: '[zɛʁˈvi̯ɛtə]',      article: 'die' },
    { de: 'der Vegetarier',   ru: 'вегетарианец',      ipa: '[veɡeˈtaːʁiɐ]',     article: 'der' },
    { de: 'reservieren',      ru: 'бронировать',       ipa: '[ʁezɛʁˈviːʁən]',    article: '' },
    { de: 'empfehlen',        ru: 'рекомендовать',     ipa: '[ɛmˈpfeːlən]',      article: '' },
    { de: 'bestellen',        ru: 'заказывать',        ipa: '[bəˈʃtɛlən]',       article: '' },
    { de: 'bezahlen',         ru: 'оплачивать',        ipa: '[bəˈtsaːlən]',      article: '' },
    { de: 'anbieten',         ru: 'предлагать',        ipa: '[ˈanˌbiːtn̩]',      article: '' },
    { de: 'bringen',          ru: 'приносить',         ipa: '[ˈbʁɪŋən]',         article: '' },
    { de: 'ausgezeichnet',    ru: 'превосходный',      ipa: '[ˈaʊ̯sɡəˌtsaɪ̯çnət]', article: '' },
    { de: 'köstlich',         ru: 'очень вкусный',     ipa: '[ˈkœstlɪç]',        article: '' },
    { de: 'satt',             ru: 'сытый',             ipa: '[zat]',             article: '' }
  ],

  grammar: [
    {
      title: '⚡ Könnten Sie…? — сверхвежливая просьба',
      body: '<strong>Könnten</strong> (Konjunktiv II от können) звучит вежливее, чем können:<br><br>' +
            '<em><strong>Können</strong> Sie mir helfen?</em> — Вы можете мне помочь? (нормально)<br>' +
            '<em><strong>Könnten</strong> Sie mir helfen?</em> — Не могли бы вы мне помочь? (очень вежливо)<br><br>' +
            'В ресторане и в сфере услуг лучше использовать könnten.',
      conjugation: [
        { pronoun: 'просьба',    form: 'Könnten Sie mir Wasser bringen?',   audio: 'Könnten Sie mir Wasser bringen',   translation: 'Не могли бы вы принести мне воды?' },
        { pronoun: 'совет',      form: 'Können Sie etwas empfehlen?',       audio: 'Können Sie etwas empfehlen',       translation: 'Можете что-то порекомендовать?' },
        { pronoun: 'заказ',      form: 'Ich hätte gern das Schnitzel.',     audio: 'Ich hätte gern das Schnitzel',     translation: 'Я бы хотел шницель.' },
        { pronoun: 'оплата',     form: 'Wir möchten bitte bezahlen.',       audio: 'Wir möchten bitte bezahlen',       translation: 'Мы хотели бы расплатиться.' }
      ]
    },
    {
      title: '⚡ als + блюдо: последовательность заказа',
      body: 'Порядок блюд оформляется через <strong>als</strong> («в качестве»):<br><br>' +
            '<em><strong>Als Vorspeise</strong> nehme ich die Suppe.</em> — На закуску я возьму суп.<br>' +
            '<em><strong>Als Hauptgericht</strong> möchte ich Fisch.</em> — На горячее я хочу рыбу.<br>' +
            '<em><strong>Zum Nachtisch</strong> gibt es Eis.</em> — На десерт — мороженое.',
      conjugation: [
        { pronoun: 'закуска',  form: 'als Vorspeise',    audio: 'als Vorspeise',    translation: 'на закуску' },
        { pronoun: 'горячее',  form: 'als Hauptgericht', audio: 'als Hauptgericht', translation: 'на основное блюдо' },
        { pronoun: 'десерт',   form: 'zum Nachtisch',    audio: 'zum Nachtisch',    translation: 'на десерт' },
        { pronoun: 'напиток',  form: 'zum Trinken',      audio: 'zum Trinken',      translation: 'из напитков' }
      ]
    },
    {
      title: '💡 Perfekt вежливости: Hat es Ihnen geschmeckt?',
      body: 'После еды официант спросит в Perfekt:<br><br>' +
            '<em><strong>Hat</strong> es Ihnen <strong>geschmeckt</strong>?</em> — Вам было вкусно?<br><br>' +
            'Ответы:<br>' +
            '<em>Ja, es <strong>war</strong> köstlich!</em> — Да, было восхитительно!<br>' +
            '<em>Es war in Ordnung.</em> — Было нормально.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich möchte einen Tisch', blank: 'reservieren', after: '.',                   translation: '— Я хотел бы забронировать столик.',   hintWord: 'reservieren', hintRule: 'reservieren — бронировать' },
      { before: '— Können Sie etwas',      blank: 'empfehlen',   after: '?',                    translation: '— Можете что-нибудь порекомендовать?', hintWord: 'empfehlen',   hintRule: 'empfehlen — рекомендовать' },
      { before: '— Als',                   blank: 'Vorspeise',   after: 'nehme ich die Suppe.', translation: '— На закуску я возьму суп.',           hintWord: 'Vorspeise',   hintRule: 'die Vorspeise — закуска' },
      { before: '— Was gibt es zum',       blank: 'Nachtisch',   after: '?',                    translation: '— Что есть на десерт?',                hintWord: 'Nachtisch',   hintRule: 'der Nachtisch — десерт' },
      { before: '— Ich bin',               blank: 'Vegetarier',  after: '.',                    translation: '— Я вегетарианец.',                    hintWord: 'Vegetarier',  hintRule: 'без артикля, как профессия' },
      { before: '—',                       blank: 'Könnten',     after: 'Sie mir Wasser bringen?', translation: '— Не могли бы вы принести воды?',   hintWord: 'Könnten',     hintRule: 'Konjunktiv II — вежливо' },
      { before: '— Wir möchten bitte',     blank: 'bezahlen',    after: '.',                    translation: '— Мы хотели бы расплатиться.',         hintWord: 'bezahlen',    hintRule: 'bezahlen — оплачивать' },
      { before: '— Hat es Ihnen',          blank: 'geschmeckt',  after: '?',                    translation: '— Вам было вкусно?',                   hintWord: 'geschmeckt',  hintRule: 'schmecken → geschmeckt' }
    ],

    multipleChoice: [
      { question: '«Die Vorspeise» — это…',                    options: ['десерт', 'закуска', 'горячее', 'напиток'],                   correctIndex: 1 },
      { question: 'Что вежливее?',                             options: ['Bringen Sie Wasser!', 'Könnten Sie mir Wasser bringen?', 'Wasser, bitte, schnell!', 'Ich will Wasser!'], correctIndex: 1 },
      { question: '«Empfehlen» значит…',                       options: ['заказывать', 'рекомендовать', 'приносить', 'платить'],       correctIndex: 1 },
      { question: '«Das Hauptgericht» — это…',                 options: ['закуска', 'основное блюдо', 'десерт', 'суп'],                correctIndex: 1 },
      { question: 'Как пожаловаться вежливо?',                 options: ['Das ist schlecht!', 'Entschuldigung, die Suppe ist kalt.', 'Ich zahle nicht!', 'Schrecklich!'], correctIndex: 1 },
      { question: '«Hat es Ihnen geschmeckt?» спрашивают…',    options: ['до еды', 'во время еды', 'после еды', 'при бронировании'],   correctIndex: 2 },
      { question: '«Köstlich» значит…',                        options: ['дорого', 'очень вкусно', 'холодно', 'быстро'],               correctIndex: 1 },
      { question: 'Сколько чаевых принято в Германии?',        options: ['ничего', '5–10%', '25%', '50%'],                             correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Vorspeise',    ru: 'закуска' },
      { id: 2, de: 'das Hauptgericht', ru: 'основное блюдо' },
      { id: 3, de: 'der Nachtisch',    ru: 'десерт' },
      { id: 4, de: 'empfehlen',        ru: 'рекомендовать' },
      { id: 5, de: 'reservieren',      ru: 'бронировать' },
      { id: 6, de: 'bezahlen',         ru: 'оплачивать' },
      { id: 7, de: 'köstlich',         ru: 'очень вкусный' },
      { id: 8, de: 'satt',             ru: 'сытый' }
    ],

    dictation: [
      { word: 'Restaurant',   audio: 'Restaurant' },
      { word: 'Vorspeise',    audio: 'Vorspeise' },
      { word: 'Nachtisch',    audio: 'Nachtisch' },
      { word: 'empfehlen',    audio: 'empfehlen' },
      { word: 'reservieren',  audio: 'reservieren' },
      { word: 'bezahlen',     audio: 'bezahlen' },
      { word: 'Gericht',      audio: 'Gericht' },
      { word: 'köstlich',     audio: 'köstlich' }
    ]
  }
};
