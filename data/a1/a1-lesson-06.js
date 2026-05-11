/* ═══════════════════════════════════════════════
   data/a1-lesson-06.js
   A1 · Урок 6: Was möchten Sie trinken? — В кафе и ресторане
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-06',
  level: 'A1',
  unit:  6,
  title: 'Was möchten Sie trinken?',
  subtitle: 'Еда, напитки, заказ в кафе и ресторане',

  meta: {
    duration: '30 мин',
    wordCount: 28,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Was möchten Sie trinken?',           ru: 'Что Вы хотите выпить?',                       note: 'möchten — вежливое «хотел бы»', audio: 'Was möchten Sie trinken' },
    { de: 'Was möchten Sie essen?',             ru: 'Что Вы хотите поесть?',                       note: 'essen = есть, кушать', audio: 'Was möchten Sie essen' },
    { de: 'Ich möchte einen Kaffee, bitte.',    ru: 'Мне, пожалуйста, кофе.',                      note: 'einen Kaffee — Akkusativ м.р.', audio: 'Ich möchte einen Kaffee bitte' },
    { de: 'Ich möchte ein Bier.',               ru: 'Я хочу пиво.',                                note: 'ein Bier — ср.р., не меняется', audio: 'Ich möchte ein Bier' },
    { de: 'Ich hätte gern eine Suppe.',         ru: 'Мне, пожалуйста, суп.',                       note: 'hätte gern — ещё вежливее', audio: 'Ich hätte gern eine Suppe' },
    { de: 'Die Speisekarte, bitte.',            ru: 'Меню, пожалуйста.',                           note: 'Speisekarte = меню', audio: 'Die Speisekarte bitte' },
    { de: 'Was empfehlen Sie?',                 ru: 'Что Вы рекомендуете?',                        note: 'empfehlen = рекомендовать', audio: 'Was empfehlen Sie' },
    { de: 'Das Schnitzel ist sehr lecker.',     ru: 'Шницель очень вкусный.',                      note: 'lecker = вкусный', audio: 'Das Schnitzel ist sehr lecker' },
    { de: 'Sind Sie schon bestellt?',           ru: 'Вы уже заказали?',                            note: 'schon = уже', audio: 'Sind Sie schon bestellt' },
    { de: 'Noch nicht.',                        ru: 'Ещё нет.',                                    note: 'noch nicht = пока нет', audio: 'Noch nicht' },
    { de: 'Ich nehme den Salat.',               ru: 'Я возьму салат.',                             note: 'nehmen = брать; den = der в Akk.', audio: 'Ich nehme den Salat' },
    { de: 'Mit oder ohne Eis?',                 ru: 'Со льдом или без?',                           note: 'mit/ohne — с/без', audio: 'Mit oder ohne Eis' },
    { de: 'Ohne, bitte.',                       ru: 'Без, пожалуйста.',                            note: 'Краткий ответ', audio: 'Ohne bitte' },
    { de: 'Schmeckt es Ihnen?',                 ru: 'Вам нравится / Вкусно?',                      note: 'schmecken = быть вкусным', audio: 'Schmeckt es Ihnen' },
    { de: 'Ja, sehr gut!',                      ru: 'Да, очень!',                                  note: 'Стандартный ответ', audio: 'Ja, sehr gut' },
    { de: 'Die Rechnung, bitte.',               ru: 'Счёт, пожалуйста.',                           note: 'Rechnung = счёт', audio: 'Die Rechnung bitte' },
    { de: 'Zahlen, bitte!',                     ru: 'Расплатиться, пожалуйста!',                   note: 'Сокращённая просьба о счёте', audio: 'Zahlen bitte' },
    { de: 'Zusammen oder getrennt?',            ru: 'Вместе или раздельно?',                       note: 'getrennt = раздельно (часто говорят)', audio: 'Zusammen oder getrennt' },
    { de: 'Getrennt, bitte.',                   ru: 'Раздельно, пожалуйста.',                      note: 'Каждый платит сам', audio: 'Getrennt bitte' },
    { de: 'Stimmt so!',                         ru: 'Сдачи не надо!',                              note: 'Букв.: «правильно так» (= оставьте сдачу)', audio: 'Stimmt so' },
    { de: 'Ich habe Hunger.',                   ru: 'Я голоден.',                                  note: 'Hunger haben — иметь голод', audio: 'Ich habe Hunger' },
    { de: 'Ich habe Durst.',                    ru: 'Я хочу пить.',                                note: 'Durst haben — иметь жажду', audio: 'Ich habe Durst' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Kaffee',     ru: 'кофе',         ipa: '[ˈkafe]',       article: 'der' },
    { de: 'der Tee',        ru: 'чай',          ipa: '[teː]',         article: 'der' },
    { de: 'das Wasser',     ru: 'вода',         ipa: '[ˈvasɐ]',       article: 'das' },
    { de: 'das Bier',       ru: 'пиво',         ipa: '[biːɐ̯]',       article: 'das' },
    { de: 'der Wein',       ru: 'вино',         ipa: '[vaɪ̯n]',       article: 'der' },
    { de: 'der Saft',       ru: 'сок',          ipa: '[zaft]',        article: 'der' },
    { de: 'die Milch',      ru: 'молоко',       ipa: '[mɪlç]',        article: 'die' },
    { de: 'das Brot',       ru: 'хлеб',         ipa: '[bʁoːt]',       article: 'das' },
    { de: 'das Brötchen',   ru: 'булочка',      ipa: '[ˈbʁøːtçən]',   article: 'das' },
    { de: 'die Suppe',      ru: 'суп',          ipa: '[ˈzʊpə]',       article: 'die' },
    { de: 'das Fleisch',    ru: 'мясо',         ipa: '[flaɪ̯ʃ]',      article: 'das' },
    { de: 'der Fisch',      ru: 'рыба',         ipa: '[fɪʃ]',         article: 'der' },
    { de: 'das Gemüse',     ru: 'овощи',        ipa: '[ɡəˈmyːzə]',    article: 'das' },
    { de: 'das Obst',       ru: 'фрукты',       ipa: '[oːpst]',       article: 'das' },
    { de: 'der Apfel',      ru: 'яблоко',       ipa: '[ˈapfl̩]',      article: 'der' },
    { de: 'der Käse',       ru: 'сыр',          ipa: '[ˈkɛːzə]',      article: 'der' },
    { de: 'der Salat',      ru: 'салат',        ipa: '[zaˈlaːt]',     article: 'der' },
    { de: 'das Schnitzel',  ru: 'шницель',      ipa: '[ˈʃnɪtsl̩]',    article: 'das' },
    { de: 'die Pizza',      ru: 'пицца',        ipa: '[ˈpɪtsa]',      article: 'die' },
    { de: 'die Speisekarte',ru: 'меню',         ipa: '[ˈʃpaɪ̯zəˌkaʁtə]', article: 'die' },
    { de: 'die Rechnung',   ru: 'счёт',         ipa: '[ˈʁɛçnʊŋ]',     article: 'die' },
    { de: 'möchten',        ru: 'хотеть (вежл.)',ipa: '[ˈmœçtn̩]',    article: '' },
    { de: 'essen',          ru: 'есть, кушать', ipa: '[ˈɛsn̩]',       article: '' },
    { de: 'trinken',        ru: 'пить',         ipa: '[ˈtʁɪŋkn̩]',    article: '' },
    { de: 'nehmen',         ru: 'брать',        ipa: '[ˈneːmən]',     article: '' },
    { de: 'lecker',         ru: 'вкусный',      ipa: '[ˈlɛkɐ]',       article: '' },
    { de: 'der Hunger',     ru: 'голод',        ipa: '[ˈhʊŋɐ]',       article: 'der' },
    { de: 'der Durst',      ru: 'жажда',        ipa: '[dʊʁst]',       article: 'der' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Глагол möchten — вежливое «хотел бы»',
      body: '<strong>möchten</strong> — это вежливая форма от <em>mögen</em> (форма Konjunktiv II). Самый частый способ заказать что-то в кафе или магазине. Звучит вежливее, чем простое <em>ich will</em> («я хочу» — слишком прямо).',
      conjugation: [
        { pronoun: 'ich',           form: 'möchte',   audio: 'ich möchte',   translation: 'я хотел бы' },
        { pronoun: 'du',            form: 'möchtest', audio: 'du möchtest',  translation: 'ты хотел бы' },
        { pronoun: 'er / sie / es', form: 'möchte',   audio: 'er möchte',    translation: 'он/она хотел(а) бы' },
        { pronoun: 'wir',           form: 'möchten',  audio: 'wir möchten',  translation: 'мы хотели бы' },
        { pronoun: 'ihr',           form: 'möchtet',  audio: 'ihr möchtet',  translation: 'вы (группа) хотели бы' },
        { pronoun: 'Sie / sie',     form: 'möchten',  audio: 'Sie möchten',  translation: 'Вы / они хотели бы' }
      ]
    },
    {
      title: '⚡ Akkusativ артикля — определённый и неопределённый',
      body: 'После <em>möchten</em>, <em>nehmen</em>, <em>haben</em>, <em>essen</em> существительное стоит в <strong>Akkusativ</strong>. Меняется <em>только</em> мужской род!<br><br>' +
            '<strong>Неопределённый артикль (ein):</strong><br>' +
            'der → <strong>einen</strong>: Ich möchte <em>einen</em> Kaffee.<br>' +
            'die → <strong>eine</strong>: Ich möchte <em>eine</em> Pizza.<br>' +
            'das → <strong>ein</strong>: Ich möchte <em>ein</em> Bier.<br><br>' +
            '<strong>Определённый артикль (der):</strong><br>' +
            'der → <strong>den</strong>: Ich nehme <em>den</em> Salat.<br>' +
            'die → <strong>die</strong>: Ich nehme <em>die</em> Suppe.<br>' +
            'das → <strong>das</strong>: Ich nehme <em>das</em> Schnitzel.',
      conjugation: [
        { pronoun: 'der Kaffee', form: 'einen / den',   audio: 'einen Kaffee',  translation: 'кофе (м.р.)' },
        { pronoun: 'die Suppe',  form: 'eine / die',    audio: 'eine Suppe',    translation: 'суп (ж.р.)' },
        { pronoun: 'das Bier',   form: 'ein / das',     audio: 'ein Bier',      translation: 'пиво (ср.р.)' },
        { pronoun: 'die Äpfel',  form: 'ø / die',       audio: 'die Äpfel',     translation: 'яблоки (мн.ч.)' }
      ]
    },
    {
      title: '💡 Hunger / Durst haben — голоден / хочу пить',
      body: 'В немецком эти состояния выражаются через <strong>haben</strong> + существительное (без артикля!):<br><br>' +
            '<em>Ich habe <strong>Hunger</strong>.</em> — Я голоден.<br>' +
            '<em>Ich habe <strong>Durst</strong>.</em> — Я хочу пить.<br>' +
            '<em>Ich habe <strong>keinen</strong> Hunger.</em> — Я не голоден.<br><br>' +
            'То же — для других состояний: <em>Angst haben</em> (бояться), <em>Zeit haben</em> (иметь время), <em>Recht haben</em> (быть правым).'
    },
    {
      title: '💡 Полезные фразы в кафе — словарь официанта',
      body: 'Что ты услышишь от официанта (Kellner/Kellnerin):<br><br>' +
            '<em>Was darf es sein?</em> — Что Вам угодно?<br>' +
            '<em>Möchten Sie bestellen?</em> — Хотите заказать?<br>' +
            '<em>Wie ist es?</em> — Ну как?<br>' +
            '<em>Zusammen oder getrennt?</em> — Вместе или раздельно?<br><br>' +
            'Что ответишь ты:<br>' +
            '<em>Ich nehme …</em> — Я возьму …<br>' +
            '<em>Bringen Sie mir bitte …</em> — Принесите, пожалуйста, …<br>' +
            '<em>Stimmt so!</em> — Сдачи не надо!'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich',                  blank: 'möchte',    after: 'einen Kaffee.',    translation: '— Я хочу кофе.',                                  hintWord: 'möchte',   hintRule: 'ich → möchte' },
      { before: '— Die',                  blank: 'Rechnung',  after: ', bitte.',         translation: '— Счёт, пожалуйста.',                              hintWord: 'Rechnung', hintRule: 'die Rechnung = счёт' },
      { before: '— Was möchten Sie',      blank: 'trinken',   after: '?',                translation: '— Что Вы хотите выпить?',                          hintWord: 'trinken',  hintRule: 'trinken = пить (инфинитив после möchten)' },
      { before: '— Ich hätte gern ein',   blank: 'Wasser',    after: '.',                translation: '— Мне, пожалуйста, воду.',                         hintWord: 'Wasser',   hintRule: 'das Wasser → ein Wasser (ср.р. в Akk не меняется)' },
      { before: '— Ich nehme',            blank: 'den',       after: 'Salat.',           translation: '— Я возьму салат.',                                hintWord: 'den',      hintRule: 'der → den в Akkusativ' },
      { before: '— Ich habe',             blank: 'Hunger',    after: '.',                translation: '— Я голоден.',                                     hintWord: 'Hunger',   hintRule: 'Hunger haben — без артикля' },
      { before: '— Mit oder',             blank: 'ohne',      after: 'Eis?',             translation: '— Со льдом или без?',                              hintWord: 'ohne',     hintRule: 'ohne = без' },
      { before: '— Schmeckt',             blank: 'es',        after: 'Ihnen?',           translation: '— Вам нравится?',                                  hintWord: 'es',       hintRule: 'es = «оно» (безличный субъект)' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «сок»?',                                      options: ['der Tee', 'das Bier', 'der Saft', 'das Wasser'],                                       correctIndex: 2 },
      { question: '«Die Speisekarte» — это:',                                   options: ['счёт', 'меню', 'столик', 'официант'],                                                  correctIndex: 1 },
      { question: 'Как попросить счёт?',                                        options: ['Die Suppe, bitte.', 'Danke, bitte.', 'Die Rechnung, bitte.', 'Ein Kaffee, bitte.'],   correctIndex: 2 },
      { question: 'Артикль «Kaffee» в Akkusativ (ich möchte …):',               options: ['ein Kaffee', 'eine Kaffee', 'einen Kaffee', 'dem Kaffee'],                            correctIndex: 2 },
      { question: 'Что значит «Stimmt so!»?',                                   options: ['Всё верно', 'Сдачи не надо', 'Правильно так', 'Хорошо'],                              correctIndex: 1 },
      { question: 'Форма möchten для «du»:',                                    options: ['möchte', 'möchtest', 'möchten', 'möchtet'],                                            correctIndex: 1 },
      { question: '«Ich habe Hunger» дословно переводится как:',                options: ['Я ем', 'Я голоден', 'У меня голод', 'Мне нужна еда'],                                  correctIndex: 2 },
      { question: 'Что значит «zusammen»?',                                     options: ['раздельно', 'вместе', 'сейчас', 'позже'],                                              correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Kaffee',    ru: 'кофе' },
      { id: 2, de: 'das Wasser',    ru: 'вода' },
      { id: 3, de: 'das Brot',      ru: 'хлеб' },
      { id: 4, de: 'die Suppe',     ru: 'суп' },
      { id: 5, de: 'der Saft',      ru: 'сок' },
      { id: 6, de: 'die Rechnung',  ru: 'счёт' },
      { id: 7, de: 'lecker',        ru: 'вкусный' },
      { id: 8, de: 'das Gemüse',    ru: 'овощи' }
    ],

    dictation: [
      { word: 'Kaffee',    audio: 'Kaffee' },
      { word: 'Wasser',    audio: 'Wasser' },
      { word: 'möchte',    audio: 'möchte' },
      { word: 'Rechnung',  audio: 'Rechnung' },
      { word: 'essen',     audio: 'essen' },
      { word: 'trinken',   audio: 'trinken' },
      { word: 'Hunger',    audio: 'Hunger' },
      { word: 'Schnitzel', audio: 'Schnitzel' }
    ]
  }
};
