/* ═══════════════════════════════════════════════
   data/a1-lesson-08.js
   A1 · Урок 8: Wie spät ist es? — Время и распорядок дня
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-08',
  level: 'A1',
  unit:  8,
  title: 'Wie spät ist es?',
  subtitle: 'Часы, минуты и распорядок дня',

  meta: {
    duration: '30 мин',
    wordCount: 26,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Wie spät ist es?',                 ru: 'Который час?',                              note: 'Букв.: «Как поздно?». Самый частый вопрос о времени', audio: 'Wie spät ist es' },
    { de: 'Wie viel Uhr ist es?',             ru: 'Сколько времени?',                          note: 'Альтернатива первому варианту', audio: 'Wie viel Uhr ist es' },
    { de: 'Es ist drei Uhr.',                 ru: 'Сейчас три часа.',                          note: '«Es ist + цифра + Uhr»', audio: 'Es ist drei Uhr' },
    { de: 'Es ist halb sieben.',              ru: 'Сейчас половина седьмого.',                 note: 'halb = ПОЛОВИНА СЛЕДУЮЩЕГО часа! Не путай', audio: 'Es ist halb sieben' },
    { de: 'Es ist Viertel nach acht.',        ru: 'Сейчас четверть девятого.',                 note: 'Viertel = четверть; nach = после', audio: 'Es ist Viertel nach acht' },
    { de: 'Es ist Viertel vor neun.',         ru: 'Сейчас без четверти девять.',               note: 'vor = до', audio: 'Es ist Viertel vor neun' },
    { de: 'Es ist fünf nach zehn.',           ru: 'Сейчас пять минут одиннадцатого.',          note: 'fünf nach = 10:05', audio: 'Es ist fünf nach zehn' },
    { de: 'Es ist zwanzig vor sechs.',        ru: 'Сейчас без двадцати шесть.',                note: 'zwanzig vor = :40', audio: 'Es ist zwanzig vor sechs' },
    { de: 'Es ist Mittag.',                   ru: 'Сейчас полдень.',                           note: 'der Mittag = 12:00', audio: 'Es ist Mittag' },
    { de: 'Es ist Mitternacht.',              ru: 'Сейчас полночь.',                           note: 'die Mitternacht = 00:00', audio: 'Es ist Mitternacht' },
    { de: 'Um wie viel Uhr stehst du auf?',   ru: 'Во сколько ты встаёшь?',                    note: 'aufstehen — отделяемый глагол', audio: 'Um wie viel Uhr stehst du auf' },
    { de: 'Ich stehe um sieben Uhr auf.',     ru: 'Я встаю в семь часов.',                     note: 'auf уходит в конец!', audio: 'Ich stehe um sieben Uhr auf' },
    { de: 'Ich frühstücke um halb acht.',     ru: 'Я завтракаю в полвосьмого.',                note: 'frühstücken = завтракать', audio: 'Ich frühstücke um halb acht' },
    { de: 'Um neun Uhr beginne ich zu arbeiten.', ru: 'В девять я начинаю работать.',         note: 'beginnen = начинать', audio: 'Um neun Uhr beginne ich zu arbeiten' },
    { de: 'Mittagspause ist um eins.',        ru: 'Обед в час.',                               note: 'eins = один (но «час» в речи)', audio: 'Mittagspause ist um eins' },
    { de: 'Am Abend sehe ich fern.',          ru: 'Вечером я смотрю телевизор.',               note: 'fernsehen = смотреть ТВ', audio: 'Am Abend sehe ich fern' },
    { de: 'Ich gehe um elf Uhr ins Bett.',    ru: 'Я ложусь спать в одиннадцать.',             note: 'ins Bett gehen = ложиться спать', audio: 'Ich gehe um elf Uhr ins Bett' },
    { de: 'Ich schlafe acht Stunden.',        ru: 'Я сплю восемь часов.',                      note: 'die Stunde = час (длительность)', audio: 'Ich schlafe acht Stunden' },
    { de: 'Es ist schon spät.',               ru: 'Уже поздно.',                               note: 'spät = поздно', audio: 'Es ist schon spät' },
    { de: 'Es ist noch früh.',                ru: 'Ещё рано.',                                 note: 'früh = рано', audio: 'Es ist noch früh' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'die Uhr',          ru: 'час, часы',         ipa: '[uːɐ̯]',          article: 'die' },
    { de: 'die Stunde',       ru: 'час (длительность)',ipa: '[ˈʃtʊndə]',       article: 'die' },
    { de: 'die Minute',       ru: 'минута',            ipa: '[miˈnuːtə]',      article: 'die' },
    { de: 'die Sekunde',      ru: 'секунда',           ipa: '[zeˈkʊndə]',      article: 'die' },
    { de: 'halb',             ru: 'половина',          ipa: '[halp]',          article: '' },
    { de: 'das Viertel',      ru: 'четверть',          ipa: '[ˈfɪʁtl̩]',       article: 'das' },
    { de: 'nach',             ru: 'после',             ipa: '[naːx]',          article: '' },
    { de: 'vor',              ru: 'до',                ipa: '[foːɐ̯]',         article: '' },
    { de: 'um',               ru: 'в (о времени)',     ipa: '[ʊm]',            article: '' },
    { de: 'der Mittag',       ru: 'полдень',           ipa: '[ˈmɪtaːk]',       article: 'der' },
    { de: 'die Mitternacht',  ru: 'полночь',           ipa: '[ˈmɪtɐˌnaxt]',    article: 'die' },
    { de: 'früh',             ru: 'рано / ранний',     ipa: '[fʁyː]',          article: '' },
    { de: 'spät',             ru: 'поздно / поздний',  ipa: '[ʃpɛːt]',         article: '' },
    { de: 'morgens',          ru: 'утром',             ipa: '[ˈmɔʁɡn̩s]',      article: '' },
    { de: 'mittags',          ru: 'в полдень',         ipa: '[ˈmɪtaːks]',      article: '' },
    { de: 'abends',           ru: 'вечером',           ipa: '[ˈaːbn̩ts]',      article: '' },
    { de: 'nachts',           ru: 'ночью',             ipa: '[naxts]',         article: '' },
    { de: 'aufstehen',        ru: 'вставать',          ipa: '[ˈaʊ̯fˌʃteːən]',  article: '' },
    { de: 'frühstücken',      ru: 'завтракать',        ipa: '[ˈfʁyːˌʃtʏkn̩]',  article: '' },
    { de: 'arbeiten',         ru: 'работать',          ipa: '[ˈaʁbaɪ̯tn̩]',    article: '' },
    { de: 'beginnen',         ru: 'начинать',          ipa: '[bəˈɡɪnən]',      article: '' },
    { de: 'schlafen',         ru: 'спать',             ipa: '[ˈʃlaːfn̩]',      article: '' },
    { de: 'fernsehen',        ru: 'смотреть телевизор',ipa: '[ˈfɛʁnˌzeːən]',   article: '' },
    { de: 'das Bett',         ru: 'кровать',           ipa: '[bɛt]',           article: 'das' },
    { de: 'das Frühstück',    ru: 'завтрак',           ipa: '[ˈfʁyːʃtʏk]',     article: 'das' },
    { de: 'die Mittagspause', ru: 'обеденный перерыв', ipa: '[ˈmɪtaːksˌpaʊ̯zə]', article: 'die' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Время — официальное (Es ist X Uhr)',
      body: 'Самый простой способ — <strong>Es ist + цифра + Uhr</strong>. Используется в расписаниях, объявлениях, новостях.<br><br>' +
            'Часы 0–24 (без AM/PM):<br>' +
            '<em>13:00</em> → Es ist <strong>dreizehn Uhr</strong>.<br>' +
            '<em>20:30</em> → Es ist <strong>zwanzig Uhr dreißig</strong>.<br><br>' +
            '⚠️ Слово <em>Uhr</em> обязательно!',
      conjugation: [
        { pronoun: '7:00',  form: 'sieben Uhr',           audio: 'Es ist sieben Uhr',           translation: 'семь часов' },
        { pronoun: '12:00', form: 'zwölf Uhr',            audio: 'Es ist zwölf Uhr',            translation: 'двенадцать часов' },
        { pronoun: '14:15', form: 'vierzehn Uhr fünfzehn',audio: 'Es ist vierzehn Uhr fünfzehn',translation: '14:15' },
        { pronoun: '18:30', form: 'achtzehn Uhr dreißig', audio: 'Es ist achtzehn Uhr dreißig', translation: '18:30' },
        { pronoun: '20:45', form: 'zwanzig Uhr fünfundvierzig', audio: 'Es ist zwanzig Uhr fünfundvierzig', translation: '20:45' }
      ]
    },
    {
      title: '⚡ Время — разговорное (halb, Viertel, nach, vor)',
      body: 'В обычной речи используют 12-часовую систему и слова <em>halb / Viertel / nach / vor</em>.<br><br>' +
            '<strong>Viertel nach</strong> X = X:15 (четверть после)<br>' +
            '<strong>halb</strong> X = (X-1):30 — <em>половина <u>СЛЕДУЮЩЕГО</u> часа!</em><br>' +
            '<strong>Viertel vor</strong> X = (X-1):45<br><br>' +
            '⚠️ <strong>halb sieben</strong> = 6:30, а НЕ 7:30! Это главная ошибка русскоязычных. Для немца «полседьмого» — это «уже половина к семи».',
      conjugation: [
        { pronoun: '8:00',  form: 'acht Uhr',            audio: 'acht Uhr',            translation: 'ровно восемь' },
        { pronoun: '8:05',  form: 'fünf nach acht',      audio: 'fünf nach acht',      translation: '«пять после восьми»' },
        { pronoun: '8:15',  form: 'Viertel nach acht',   audio: 'Viertel nach acht',   translation: '«четверть после восьми» (8:15)' },
        { pronoun: '8:30',  form: 'halb neun',           audio: 'halb neun',           translation: '«половина девятого» = 8:30!' },
        { pronoun: '8:45',  form: 'Viertel vor neun',    audio: 'Viertel vor neun',    translation: '«четверть до девяти» (8:45)' },
        { pronoun: '8:55',  form: 'fünf vor neun',       audio: 'fünf vor neun',       translation: '«пять до девяти»' }
      ]
    },
    {
      title: '💡 Шпаргалка: AM, IM, UM — три предлога времени',
      body: 'Три ключевых предлога времени, которые легко спутать:<br><br>' +
            '<strong>am</strong> + день недели / часть суток<br>' +
            '&nbsp;&nbsp;<em>am Montag, am Wochenende, am Abend</em><br><br>' +
            '<strong>im</strong> + месяц / время года / год<br>' +
            '&nbsp;&nbsp;<em>im Januar, im Sommer, im Jahr 2026</em><br><br>' +
            '<strong>um</strong> + точное время<br>' +
            '&nbsp;&nbsp;<em>um 8 Uhr, um halb neun, um Mitternacht</em><br><br>' +
            'Соедини: <em>Am Montag um halb neun im April habe ich Geburtstag.</em> — В понедельник в полдевятого в апреле у меня день рождения.'
    },
    {
      title: '💡 Отделяемые глаголы: aufstehen, fernsehen, einkaufen',
      body: 'Некоторые немецкие глаголы состоят из <strong>двух частей</strong>: приставки и корня. В предложении приставка <em>уходит в самый конец</em>!<br><br>' +
            '<strong>aufstehen</strong> (вставать):<br>' +
            'Ich <em>stehe</em> um 7 Uhr <strong>auf</strong>. — Я встаю в 7.<br><br>' +
            '<strong>fernsehen</strong> (смотреть ТВ):<br>' +
            'Wir <em>sehen</em> abends <strong>fern</strong>. — Мы вечером смотрим телевизор.<br><br>' +
            '<strong>einkaufen</strong> (делать покупки):<br>' +
            'Sie <em>kauft</em> am Samstag <strong>ein</strong>. — Она в субботу ходит в магазин.<br><br>' +
            'Подробно — на уровне A2. Пока запомни <em>aufstehen</em> для распорядка дня.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Wie',                blank: 'spät',     after: 'ist es?',           translation: '— Который час?',                                  hintWord: 'spät',     hintRule: 'spät = поздно (Wie spät = «который час»)' },
      { before: '— Es ist',             blank: 'halb',     after: 'sieben.',           translation: '— Сейчас полседьмого (= 6:30).',                  hintWord: 'halb',     hintRule: 'halb sieben = половина к 7 = 6:30!' },
      { before: '— Es ist Viertel',     blank: 'nach',     after: 'acht.',             translation: '— Сейчас четверть девятого (8:15).',              hintWord: 'nach',     hintRule: 'nach = после; Viertel nach 8 = 8:15' },
      { before: '— Es ist Viertel',     blank: 'vor',      after: 'neun.',             translation: '— Сейчас без четверти девять (8:45).',            hintWord: 'vor',      hintRule: 'vor = до; Viertel vor 9 = 8:45' },
      { before: '—',                     blank: 'Um',       after: 'wie viel Uhr stehst du auf?', translation: '— Во сколько ты встаёшь?',             hintWord: 'Um',       hintRule: 'um + точное время; в начале — с большой' },
      { before: '— Ich stehe um sieben Uhr', blank: 'auf',  after: '.',                translation: '— Я встаю в семь часов.',                          hintWord: 'auf',      hintRule: 'aufstehen — приставка auf уходит в конец' },
      { before: '— Es ist',              blank: 'Mittag',   after: '.',                translation: '— Сейчас полдень.',                                hintWord: 'Mittag',   hintRule: 'der Mittag = 12:00 (с большой буквы)' },
      { before: '— Ich schlafe acht',   blank: 'Stunden',  after: '.',                 translation: '— Я сплю восемь часов.',                           hintWord: 'Stunden',  hintRule: 'die Stunde — час (длительность); мн.ч. Stunden' }
    ],

    multipleChoice: [
      { question: 'Что значит «Es ist halb acht»?',                                    options: ['8:30', '7:30', '8:00', '7:15'],                                                          correctIndex: 1 },
      { question: 'Как сказать «без четверти десять»?',                                options: ['Viertel nach zehn', 'halb zehn', 'Viertel vor zehn', 'fünfzehn vor zehn'],                correctIndex: 2 },
      { question: 'Какой предлог с точным временем?',                                  options: ['am', 'im', 'um', 'an'],                                                                   correctIndex: 2 },
      { question: 'Что значит «Mitternacht»?',                                         options: ['полдень', 'полночь', 'утро', 'вечер'],                                                    correctIndex: 1 },
      { question: '«die Stunde» означает:',                                            options: ['минута', 'секунда', 'час (длительность)', 'четверть часа'],                               correctIndex: 2 },
      { question: 'В предложении «Ich stehe um 7 Uhr ___» что в конце?',               options: ['stehen', 'auf', 'um', 'Uhr'],                                                              correctIndex: 1 },
      { question: 'Как сказать «утром» (наречие)?',                                    options: ['der Morgen', 'morgens', 'morgen', 'am Morgen'],                                            correctIndex: 1 },
      { question: '«Es ist Viertel nach drei» — это:',                                 options: ['2:45', '3:00', '3:15', '3:45'],                                                            correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'die Uhr',         ru: 'часы' },
      { id: 2, de: 'die Stunde',      ru: 'час (длительность)' },
      { id: 3, de: 'die Minute',      ru: 'минута' },
      { id: 4, de: 'halb',            ru: 'половина' },
      { id: 5, de: 'Viertel',         ru: 'четверть' },
      { id: 6, de: 'spät',            ru: 'поздно' },
      { id: 7, de: 'früh',            ru: 'рано' },
      { id: 8, de: 'aufstehen',       ru: 'вставать' }
    ],

    dictation: [
      { word: 'Uhr',         audio: 'Uhr' },
      { word: 'halb',        audio: 'halb' },
      { word: 'Viertel',     audio: 'Viertel' },
      { word: 'Stunde',      audio: 'Stunde' },
      { word: 'Minute',      audio: 'Minute' },
      { word: 'Mittag',      audio: 'Mittag' },
      { word: 'Mitternacht', audio: 'Mitternacht' },
      { word: 'aufstehen',   audio: 'aufstehen' }
    ]
  }
};
