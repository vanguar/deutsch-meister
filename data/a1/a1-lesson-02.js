/* ═══════════════════════════════════════════════
   data/a1-lesson-02.js
   A1 · Урок 2: Eins, zwei, drei! — Числа, возраст, цены
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-02',
  level: 'A1',
  unit:  2,
  title: 'Eins, zwei, drei!',
  subtitle: 'Числа 0–100, возраст, цены и номера телефонов',

  meta: {
    duration: '25–30 мин',
    wordCount: 26,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Wie alt bist du?',                    ru: 'Сколько тебе лет?',                          note: 'alt = старый/в возрасте', audio: 'Wie alt bist du' },
    { de: 'Wie alt sind Sie?',                   ru: 'Сколько Вам лет?',                           note: 'Формальный вариант', audio: 'Wie alt sind Sie' },
    { de: 'Ich bin zwanzig Jahre alt.',          ru: 'Мне двадцать лет.',                          note: 'Jahre = лет (мн.ч. от Jahr)', audio: 'Ich bin zwanzig Jahre alt' },
    { de: 'Ich bin 25.',                         ru: 'Мне 25.',                                    note: 'В разговоре «Jahre alt» можно опустить', audio: 'Ich bin fünfundzwanzig' },
    { de: 'Wie viel kostet das?',                ru: 'Сколько это стоит?',                         note: 'kostet = стоит (3-е лицо ед.ч.)', audio: 'Wie viel kostet das' },
    { de: 'Das kostet fünf Euro.',               ru: 'Это стоит пять евро.',                       note: 'Euro во мн.ч. не меняется', audio: 'Das kostet fünf Euro' },
    { de: 'Wie viel kosten die Bücher?',         ru: 'Сколько стоят книги?',                       note: 'kosten — мн.ч., если предмет во мн.ч.', audio: 'Wie viel kosten die Bücher' },
    { de: 'Das macht zehn Euro fünfzig.',        ru: 'С Вас десять евро пятьдесят.',               note: 'Стандартная фраза кассира. macht = «получается»', audio: 'Das macht zehn Euro fünfzig' },
    { de: 'Wie ist deine Telefonnummer?',        ru: 'Какой у тебя номер телефона?',               note: 'Номера диктуют по одной цифре', audio: 'Wie ist deine Telefonnummer' },
    { de: 'Meine Nummer ist 0176 …',             ru: 'Мой номер 0176 …',                           note: 'Каждую цифру читай отдельно: null-eins-sieben-sechs', audio: 'Meine Nummer ist null eins sieben sechs' },
    { de: 'Wie ist deine Hausnummer?',           ru: 'Какой у тебя номер дома?',                   note: 'В Германии в адресах: улица + номер дома', audio: 'Wie ist deine Hausnummer' },
    { de: 'Ich wohne in Goethestraße 14.',       ru: 'Я живу на Гётештрассе, дом 14.',             note: '«vierzehn» — 14', audio: 'Ich wohne in Goethestraße vierzehn' },
    { de: 'Was ist sieben plus drei?',           ru: 'Сколько будет семь плюс три?',               note: 'plus / minus / mal / geteilt durch', audio: 'Was ist sieben plus drei' },
    { de: 'Sieben plus drei ist zehn.',          ru: 'Семь плюс три — десять.',                    note: 'ist = «равно»', audio: 'Sieben plus drei ist zehn' },
    { de: 'Zähl bis zehn!',                      ru: 'Посчитай до десяти!',                        note: 'zählen = считать (повелит.)', audio: 'Zähl bis zehn' },
    { de: 'Eins, zwei, drei, los!',              ru: 'Раз, два, три, начали!',                     note: '«los!» — поехали!', audio: 'Eins, zwei, drei, los' },
    { de: 'Ich habe zwei Geschwister.',          ru: 'У меня двое братьев/сестёр.',                note: 'Geschwister — всегда мн.ч.', audio: 'Ich habe zwei Geschwister' },
    { de: 'Wir sind zu viert.',                  ru: 'Нас четверо.',                               note: 'zu zweit / zu dritt / zu viert — нас вдвоём/втроём/вчетвером', audio: 'Wir sind zu viert' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'null',       ru: 'ноль',          ipa: '[nʊl]',          article: '' },
    { de: 'eins',       ru: 'один',          ipa: '[aɪ̯ns]',        article: '' },
    { de: 'zwei',       ru: 'два',           ipa: '[tsvaɪ̯]',       article: '' },
    { de: 'drei',       ru: 'три',           ipa: '[dʁaɪ̯]',        article: '' },
    { de: 'vier',       ru: 'четыре',        ipa: '[fiːɐ̯]',        article: '' },
    { de: 'fünf',       ru: 'пять',          ipa: '[fʏnf]',         article: '' },
    { de: 'sechs',      ru: 'шесть',         ipa: '[zɛks]',         article: '' },
    { de: 'sieben',     ru: 'семь',          ipa: '[ˈziːbn̩]',      article: '' },
    { de: 'acht',       ru: 'восемь',        ipa: '[axt]',          article: '' },
    { de: 'neun',       ru: 'девять',        ipa: '[nɔɪ̯n]',        article: '' },
    { de: 'zehn',       ru: 'десять',        ipa: '[tseːn]',        article: '' },
    { de: 'elf',        ru: 'одиннадцать',   ipa: '[ɛlf]',          article: '' },
    { de: 'zwölf',      ru: 'двенадцать',    ipa: '[tsvœlf]',       article: '' },
    { de: 'dreizehn',   ru: 'тринадцать',    ipa: '[ˈdʁaɪ̯ˌtseːn]', article: '' },
    { de: 'sechzehn',   ru: 'шестнадцать',   ipa: '[ˈzɛçtseːn]',    article: '' },
    { de: 'siebzehn',   ru: 'семнадцать',    ipa: '[ˈziːptseːn]',   article: '' },
    { de: 'zwanzig',    ru: 'двадцать',      ipa: '[ˈtsvantsɪç]',   article: '' },
    { de: 'dreißig',    ru: 'тридцать',      ipa: '[ˈdʁaɪ̯sɪç]',    article: '' },
    { de: 'fünfzig',    ru: 'пятьдесят',     ipa: '[ˈfʏnftsɪç]',    article: '' },
    { de: 'hundert',    ru: 'сто',           ipa: '[ˈhʊndɐt]',      article: '' },
    { de: 'das Jahr',   ru: 'год',           ipa: '[jaːɐ̯]',        article: 'das' },
    { de: 'der Euro',   ru: 'евро',          ipa: '[ˈɔɪ̯ʁo]',       article: 'der' },
    { de: 'die Nummer', ru: 'номер',         ipa: '[ˈnʊmɐ]',        article: 'die' },
    { de: 'kosten',     ru: 'стоить',        ipa: '[ˈkɔstn̩]',      article: '' },
    { de: 'zählen',     ru: 'считать',       ipa: '[ˈtsɛːlən]',     article: '' },
    { de: 'alt',        ru: 'старый, в возрасте', ipa: '[alt]',     article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Числа 1–20 — основа всего',
      body: 'Числа от 1 до 12 — отдельные слова (как в русском). С 13 по 19 — по схеме <strong>цифра + zehn</strong>. Внимание на исключения: <em>sechzehn</em> (без s в конце «sechs») и <em>siebzehn</em> (без -en от «sieben»).',
      conjugation: [
        { pronoun: '1',  form: 'eins',     audio: 'eins',     translation: 'один' },
        { pronoun: '5',  form: 'fünf',     audio: 'fünf',     translation: 'пять' },
        { pronoun: '11', form: 'elf',      audio: 'elf',      translation: 'одиннадцать' },
        { pronoun: '12', form: 'zwölf',    audio: 'zwölf',    translation: 'двенадцать' },
        { pronoun: '13', form: 'dreizehn', audio: 'dreizehn', translation: 'тринадцать' },
        { pronoun: '16', form: 'sechzehn', audio: 'sechzehn', translation: 'шестнадцать (без s!)' },
        { pronoun: '17', form: 'siebzehn', audio: 'siebzehn', translation: 'семнадцать (без -en!)' },
        { pronoun: '20', form: 'zwanzig',  audio: 'zwanzig',  translation: 'двадцать' }
      ]
    },
    {
      title: '⚡ Числа 21–99 — задом наперёд!',
      body: 'Главная странность немецких чисел: десятки и единицы читаются <strong>в обратном порядке</strong>, через <em>und</em> («и»):<br><br>' +
            '<strong>21</strong> = <em>einundzwanzig</em> (один-и-двадцать)<br>' +
            '<strong>34</strong> = <em>vierunddreißig</em> (четыре-и-тридцать)<br>' +
            '<strong>78</strong> = <em>achtundsiebzig</em> (восемь-и-семьдесят)<br><br>' +
            '⚠️ В числах перед <em>-zig</em> используется <em>ein</em>, а не <em>eins</em>: 21 = <em>ein</em>undzwanzig.',
      conjugation: [
        { pronoun: '21', form: 'einundzwanzig',   audio: 'einundzwanzig',   translation: '«один-и-двадцать»' },
        { pronoun: '32', form: 'zweiunddreißig',  audio: 'zweiunddreißig',  translation: '«два-и-тридцать»' },
        { pronoun: '45', form: 'fünfundvierzig',  audio: 'fünfundvierzig',  translation: '«пять-и-сорок»' },
        { pronoun: '67', form: 'siebenundsechzig',audio: 'siebenundsechzig',translation: '«семь-и-шестьдесят»' },
        { pronoun: '99', form: 'neunundneunzig',  audio: 'neunundneunzig',  translation: '«девять-и-девяносто»' }
      ]
    },
    {
      title: '💡 Возраст: Ich bin … (Jahre alt)',
      body: 'В немецком возраст всегда выражается глаголом <strong>sein</strong> («быть»), а не «иметь», как в русском.<br><br>' +
            '<em>Ich <strong>bin</strong> 25 (Jahre alt).</em> — Мне 25 (лет).<br>' +
            '<em>Mein Bruder <strong>ist</strong> 18.</em> — Моему брату 18.<br><br>' +
            'Дословно: «Я есть 25 лет старый». В разговорной речи слова <em>Jahre alt</em> часто опускают.'
    },
    {
      title: '💡 Цены и номера телефонов — как читать',
      body: '<strong>Цены:</strong> «Das kostet 3,50 €» читается как <em>drei Euro fünfzig</em> (без «cent»). Запятая, а не точка!<br><br>' +
            '<strong>Телефонные номера</strong> диктуются по одной цифре или парами:<br>' +
            '<em>0176 / 12 34 56 78</em> → <em>null-eins-sieben-sechs … zwölf-vierunddreißig…</em><br><br>' +
            '<strong>Номер дома</strong> ставится <em>после</em> улицы:<br>' +
            '<em>Goethestraße 14</em> → «Goethestraße vierzehn».'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Eins, zwei,',           blank: 'drei',          after: ', vier, fünf!',    translation: '— Один, два, три, четыре, пять!',      hintWord: 'drei',          hintRule: 'drei = три (3)' },
      { before: '— Wie alt',               blank: 'bist',          after: 'du?',              translation: '— Сколько тебе лет?',                   hintWord: 'bist',          hintRule: 'du → bist (форма sein)' },
      { before: '— Ich bin',               blank: 'zwanzig',       after: 'Jahre alt.',       translation: '— Мне двадцать лет.',                   hintWord: 'zwanzig',       hintRule: 'zwanzig = 20' },
      { before: '— Das',                   blank: 'kostet',        after: 'fünf Euro.',       translation: '— Это стоит пять евро.',                hintWord: 'kostet',        hintRule: 'es/das → kostet (3-е лицо)' },
      { before: '— Sieben plus drei',      blank: 'ist',           after: 'zehn.',            translation: '— Семь плюс три — десять.',             hintWord: 'ist',           hintRule: 'ist используется как «равно»' },
      { before: '— Meine Nummer ist',      blank: 'null',          after: 'eins sieben sechs.', translation: '— Мой номер ноль один семь шесть.',  hintWord: 'null',          hintRule: 'null = 0 (пишется как в русском «ноль»)' },
      { before: '— 21 ist',                blank: 'einundzwanzig', after: '.',                translation: '— 21 — это «единица-и-двадцать».',      hintWord: 'einundzwanzig', hintRule: 'eins → ein перед und; затем десяток' },
      { before: '— Wir sind',              blank: 'zu',            after: 'viert.',           translation: '— Нас четверо.',                        hintWord: 'zu',            hintRule: 'zu zweit / zu dritt / zu viert — устойчивое' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «восемь»?',                                          options: ['sieben', 'neun', 'acht', 'sechs'],                                       correctIndex: 2 },
      { question: '«Wie alt bist du?» означает:',                                      options: ['Как тебя зовут?', 'Сколько тебе лет?', 'Где ты живёшь?', 'Как дела?'],   correctIndex: 1 },
      { question: 'Какое число по-немецки «fünfzehn»?',                                options: ['14', '15', '16', '13'],                                                  correctIndex: 1 },
      { question: 'Что значит «das Jahr»?',                                            options: ['день', 'месяц', 'год', 'неделя'],                                        correctIndex: 2 },
      { question: 'Как сказать «33» по-немецки?',                                      options: ['dreißigdrei', 'dreiunddreißig', 'dreidreißig', 'dreißig und drei'],      correctIndex: 1 },
      { question: 'Что не так в числе «sechzehn»?',                                    options: ['Ничего, всё норм', 'Должно быть «sechszehn»', 'Должно быть «sechszehn» — но из-за фонетики «s» убрали', 'Опечатка'], correctIndex: 2 },
      { question: 'Как читается цена 7,80 €?',                                         options: ['sieben Euro achtzig', 'sieben Komma achtzig Euro', 'siebzig Euro acht', 'sieben acht Euro'], correctIndex: 0 },
      { question: 'Как сказать «нас трое»?',                                           options: ['drei sind wir', 'Wir drei', 'Wir sind zu dritt', 'Wir sind drei'],         correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'eins',           ru: 'один' },
      { id: 2, de: 'fünf',           ru: 'пять' },
      { id: 3, de: 'zehn',           ru: 'десять' },
      { id: 4, de: 'zwölf',          ru: 'двенадцать' },
      { id: 5, de: 'zwanzig',        ru: 'двадцать' },
      { id: 6, de: 'dreißig',        ru: 'тридцать' },
      { id: 7, de: 'einundzwanzig',  ru: 'двадцать один' },
      { id: 8, de: 'hundert',        ru: 'сто' }
    ],

    dictation: [
      { word: 'drei',           audio: 'drei' },
      { word: 'sieben',         audio: 'sieben' },
      { word: 'zwanzig',        audio: 'zwanzig' },
      { word: 'fünf',           audio: 'fünf' },
      { word: 'zwölf',          audio: 'zwölf' },
      { word: 'einundzwanzig',  audio: 'einundzwanzig' },
      { word: 'hundert',        audio: 'hundert' },
      { word: 'Euro',           audio: 'Euro' }
    ]
  }
};
