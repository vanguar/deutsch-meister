/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-20.js
   A1 · Урок 20: Wiederholung A1 — Итоговый урок уровня
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-20',
  level: 'A1',
  unit:  20,
  title: 'Wiederholung A1',
  subtitle: 'Итоговый урок: повторяем весь уровень A1',

  meta: {
    duration: '30–35 мин',
    wordCount: 16,
    xpReward: 100
  },

  phrases: [
    { de: 'Hallo! Ich heiße Anna und komme aus der Ukraine.', ru: 'Привет! Меня зовут Анна, я из Украины.', note: 'урок 1: знакомство', audio: 'Hallo. Ich heiße Anna und komme aus der Ukraine' },
    { de: 'Ich bin dreißig Jahre alt und wohne in Berlin.', ru: 'Мне тридцать лет, я живу в Берлине.', note: 'уроки 1, 16: возраст и город', audio: 'Ich bin dreißig Jahre alt und wohne in Berlin' },
    { de: 'Ich bin Lehrerin von Beruf.',         ru: 'По профессии я учительница.',       note: 'урок 12: профессии без артикля', audio: 'Ich bin Lehrerin von Beruf' },
    { de: 'Meine Familie ist groß: ich habe zwei Brüder.', ru: 'Моя семья большая: у меня два брата.', note: 'урок 4: семья', audio: 'Meine Familie ist groß. Ich habe zwei Brüder' },
    { de: 'Am Montag muss ich früh aufstehen.',  ru: 'В понедельник мне нужно рано вставать.', note: 'уроки 5, 17: дни недели + müssen', audio: 'Am Montag muss ich früh aufstehen' },
    { de: 'Ich fahre mit dem Bus zur Arbeit.',   ru: 'Я езжу на работу на автобусе.',     note: 'урок 14: mit + Dativ', audio: 'Ich fahre mit dem Bus zur Arbeit' },
    { de: 'Zum Frühstück esse ich Brot mit Käse.', ru: 'На завтрак я ем хлеб с сыром.',   note: 'уроки 6, 13: еда', audio: 'Zum Frühstück esse ich Brot mit Käse' },
    { de: 'Im Café möchte ich einen Kaffee ohne Zucker.', ru: 'В кафе я хочу кофе без сахара.', note: 'урок 15: заказ', audio: 'Im Café möchte ich einen Kaffee ohne Zucker' },
    { de: 'Mein Hund ist braun und sehr klein.', ru: 'Моя собака коричневая и очень маленькая.', note: 'уроки 3, 11: цвета и животные', audio: 'Mein Hund ist braun und sehr klein' },
    { de: 'Es ist halb acht. Ich muss gehen!',   ru: 'Половина восьмого. Мне нужно идти!', note: 'уроки 8, 17: время + müssen', audio: 'Es ist halb acht. Ich muss gehen' },
    { de: 'Im Sommer kann man schwimmen gehen.', ru: 'Летом можно ходить плавать.',       note: 'уроки 10, 17: сезоны + man kann', audio: 'Im Sommer kann man schwimmen gehen' },
    { de: 'Mein Kopf tut weh. Ich bleibe zu Hause.', ru: 'У меня болит голова. Я останусь дома.', note: 'урок 9: части тела', audio: 'Mein Kopf tut weh. Ich bleibe zu Hause' },
    { de: 'Gestern habe ich im Supermarkt eingekauft.', ru: 'Вчера я сделал покупки в супермаркете.', note: 'уроки 13, 18: покупки в Perfekt', audio: 'Gestern habe ich im Supermarkt eingekauft' },
    { de: 'Am Wochenende sind wir nach Hamburg gefahren.', ru: 'На выходных мы ездили в Гамбург.', note: 'урок 18: Perfekt с sein', audio: 'Am Wochenende sind wir nach Hamburg gefahren' },
    { de: 'Herzlichen Glückwunsch! Das Geschenk ist für dich.', ru: 'Поздравляю! Этот подарок для тебя.', note: 'урок 19: праздники', audio: 'Herzlichen Glückwunsch. Das Geschenk ist für dich' },
    { de: 'Super! Du sprichst schon gut Deutsch!', ru: 'Супер! Ты уже хорошо говоришь по-немецки!', note: 'ты прошёл весь A1 — так держать!', audio: 'Super. Du sprichst schon gut Deutsch' }
  ],

  vocabulary: [
    { de: 'heißen',        ru: 'зваться (урок 1)',          ipa: '[ˈhaɪ̯sn̩]',      article: '' },
    { de: 'wohnen',        ru: 'жить (урок 1)',             ipa: '[ˈvoːnən]',       article: '' },
    { de: 'die Familie',   ru: 'семья (урок 4)',            ipa: '[faˈmiːli̯ə]',    article: 'die' },
    { de: 'der Montag',    ru: 'понедельник (урок 5)',      ipa: '[ˈmoːntaːk]',     article: 'der' },
    { de: 'das Frühstück', ru: 'завтрак (урок 6)',          ipa: '[ˈfʁyːʃtʏk]',     article: 'das' },
    { de: 'die Stadt',     ru: 'город (урок 7)',            ipa: '[ʃtat]',          article: 'die' },
    { de: 'die Uhr',       ru: 'часы, время (урок 8)',      ipa: '[uːɐ̯]',          article: 'die' },
    { de: 'der Kopf',      ru: 'голова (урок 9)',           ipa: '[kɔpf]',          article: 'der' },
    { de: 'der Sommer',    ru: 'лето (урок 10)',            ipa: '[ˈzɔmɐ]',         article: 'der' },
    { de: 'das Haustier',  ru: 'питомец (урок 11)',         ipa: '[ˈhaʊ̯sˌtiːɐ̯]',  article: 'das' },
    { de: 'der Beruf',     ru: 'профессия (урок 12)',       ipa: '[bəˈʁuːf]',       article: 'der' },
    { de: 'einkaufen',     ru: 'делать покупки (урок 13)',  ipa: '[ˈaɪ̯nˌkaʊ̯fn̩]', article: '' },
    { de: 'fahren',        ru: 'ехать (урок 14)',           ipa: '[ˈfaːʁən]',       article: '' },
    { de: 'bestellen',     ru: 'заказывать (урок 15)',      ipa: '[bəˈʃtɛlən]',     article: '' },
    { de: 'können',        ru: 'мочь, уметь (урок 17)',     ipa: '[ˈkœnən]',        article: '' },
    { de: 'das Geschenk',  ru: 'подарок (урок 19)',         ipa: '[ɡəˈʃɛŋk]',       article: 'das' }
  ],

  grammar: [
    {
      title: '⚡ Три кита A1: sein, haben, модальные',
      body: 'Всё, что ты выучил, держится на трёх опорах:<br><br>' +
            '<strong>1. sein</strong> — кто ты и какой ты: <em>Ich bin müde.</em><br>' +
            '<strong>2. haben</strong> — что у тебя есть: <em>Ich habe einen Hund.</em> (+ Akkusativ!)<br>' +
            '<strong>3. Модальные</strong> — что можешь/должен/хочешь: <em>Ich kann… / Ich muss… / Ich will…</em> + инфинитив в конце.',
      conjugation: [
        { pronoun: 'sein',    form: 'Ich bin Student.',        audio: 'Ich bin Student',        translation: 'Я студент.' },
        { pronoun: 'haben',   form: 'Ich habe einen Hund.',    audio: 'Ich habe einen Hund',    translation: 'У меня есть собака.' },
        { pronoun: 'können',  form: 'Ich kann schwimmen.',     audio: 'Ich kann schwimmen',     translation: 'Я умею плавать.' },
        { pronoun: 'müssen',  form: 'Ich muss arbeiten.',      audio: 'Ich muss arbeiten',      translation: 'Мне нужно работать.' },
        { pronoun: 'möchten', form: 'Ich möchte einen Tee.',   audio: 'Ich möchte einen Tee',   translation: 'Я хотел бы чай.' }
      ]
    },
    {
      title: '⚡ Порядок слов: главное правило',
      body: 'Глагол в немецком утвердительном предложении — всегда <strong>на 2-м месте</strong>:<br><br>' +
            '<em>Ich <strong>fahre</strong> heute nach Berlin.</em><br>' +
            '<em>Heute <strong>fahre</strong> ich nach Berlin.</em> (начали с «heute» — глагол всё равно 2-й!)<br><br>' +
            'В вопросе без W-слова глагол — <strong>на 1-м месте</strong>: <em><strong>Kommst</strong> du mit?</em>',
      conjugation: [
        { pronoun: 'утверждение', form: 'Ich lerne Deutsch.',      audio: 'Ich lerne Deutsch',      translation: 'Я учу немецкий.' },
        { pronoun: 'инверсия',    form: 'Heute lerne ich Deutsch.', audio: 'Heute lerne ich Deutsch', translation: 'Сегодня я учу немецкий.' },
        { pronoun: 'W-вопрос',    form: 'Was lernst du?',           audio: 'Was lernst du',           translation: 'Что ты учишь?' },
        { pronoun: 'да/нет-вопрос', form: 'Lernst du Deutsch?',     audio: 'Lernst du Deutsch',       translation: 'Ты учишь немецкий?' }
      ]
    },
    {
      title: '💡 Perfekt — говорим о прошлом',
      body: 'Итог урока 18 в двух строчках:<br><br>' +
            '<strong>haben</strong> + Partizip II: <em>Ich habe Pizza gegessen.</em><br>' +
            '<strong>sein</strong> (движение!) + Partizip II: <em>Ich bin nach Hause gegangen.</em><br><br>' +
            'Если сомневаешься — чаще всего правильным будет haben.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich',                   blank: 'heiße',     after: 'Anna.',                   translation: '— Меня зовут Анна. (урок 1)',          hintWord: 'heiße',     hintRule: 'ich → heiße' },
      { before: '— Ich habe',              blank: 'einen',     after: 'Hund.',                   translation: '— У меня есть собака. (урок 11)',      hintWord: 'einen',     hintRule: 'der → einen (Akkusativ)' },
      { before: '— Ich fahre mit',         blank: 'dem',       after: 'Bus.',                    translation: '— Я еду на автобусе. (урок 14)',       hintWord: 'dem',       hintRule: 'mit + Dativ' },
      { before: '— Ich',                   blank: 'muss',      after: 'jetzt gehen.',            translation: '— Мне нужно идти. (урок 17)',          hintWord: 'muss',      hintRule: 'ich → muss' },
      { before: '— Gestern habe ich Deutsch', blank: 'gelernt', after: '.',                      translation: '— Вчера я учил немецкий. (урок 18)',   hintWord: 'gelernt',   hintRule: 'lernen → gelernt' },
      { before: '— Wir',                   blank: 'sind',      after: 'nach Berlin gefahren.',   translation: '— Мы поехали в Берлин. (урок 18)',     hintWord: 'sind',      hintRule: 'движение → sein' },
      { before: '— Ich möchte einen Kaffee', blank: 'ohne',    after: 'Zucker.',                 translation: '— Мне кофе без сахара. (урок 15)',     hintWord: 'ohne',      hintRule: 'ohne — без' },
      { before: '— Im Winter',             blank: 'schneit',   after: 'es oft.',                 translation: '— Зимой часто идёт снег. (урок 10)',   hintWord: 'schneit',   hintRule: 'es schneit — идёт снег' }
    ],

    multipleChoice: [
      { question: 'Где стоит глагол в утвердительном предложении?', options: ['на 1-м месте', 'на 2-м месте', 'в конце', 'где угодно'], correctIndex: 1 },
      { question: '«Я учитель» — правильно…',                  options: ['Ich bin ein Lehrer.', 'Ich bin Lehrer.', 'Ich bin der Lehrer.', 'Ich Lehrer bin.'], correctIndex: 1 },
      { question: 'Акузатив мужского рода: Ich habe … Hund.',  options: ['ein', 'einen', 'einem', 'eines'],                             correctIndex: 1 },
      { question: 'Транспорт: «на поезде»…',                   options: ['mit der Zug', 'mit dem Zug', 'auf dem Zug', 'im Zug'],        correctIndex: 1 },
      { question: 'Perfekt от «gehen» — с каким глаголом?',    options: ['haben', 'sein', 'werden', 'wollen'],                          correctIndex: 1 },
      { question: '21 по-немецки…',                            options: ['zwanzigeins', 'einundzwanzig', 'zweiundzwanzig', 'einzwanzig'], correctIndex: 1 },
      { question: '«Мне нужно работать» — …',                  options: ['Ich kann arbeiten.', 'Ich muss arbeiten.', 'Ich will arbeiten.', 'Ich darf arbeiten.'], correctIndex: 1 },
      { question: 'Вежливый заказ в кафе…',                    options: ['Gib mir Kaffee!', 'Ich möchte einen Kaffee, bitte.', 'Kaffee, schnell!', 'Ich will Kaffee!'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'Wie heißt du?',        ru: 'Как тебя зовут?' },
      { id: 2, de: 'Woher kommst du?',     ru: 'Откуда ты?' },
      { id: 3, de: 'Was bist du von Beruf?', ru: 'Кто ты по профессии?' },
      { id: 4, de: 'Wie alt bist du?',     ru: 'Сколько тебе лет?' },
      { id: 5, de: 'Wie spät ist es?',     ru: 'Который час?' },
      { id: 6, de: 'Was kostet das?',      ru: 'Сколько это стоит?' },
      { id: 7, de: 'Wie komme ich zum Bahnhof?', ru: 'Как пройти к вокзалу?' },
      { id: 8, de: 'Wann hast du Geburtstag?', ru: 'Когда у тебя день рождения?' }
    ],

    dictation: [
      { word: 'Familie',     audio: 'Familie' },
      { word: 'Geburtstag',  audio: 'Geburtstag' },
      { word: 'einkaufen',   audio: 'einkaufen' },
      { word: 'Frühstück',   audio: 'Frühstück' },
      { word: 'arbeiten',    audio: 'arbeiten' },
      { word: 'gegangen',    audio: 'gegangen' },
      { word: 'möchten',     audio: 'möchten' },
      { word: 'Deutschland', audio: 'Deutschland' }
    ]
  }
};
