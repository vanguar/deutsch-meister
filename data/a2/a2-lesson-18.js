/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-18.js
   A2 · Урок 18: Komparativ und Superlativ — Степени сравнения
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-18',
  level: 'A2',
  unit:  18,
  title: 'Komparativ und Superlativ',
  subtitle: 'Степени сравнения: больше, лучше, самый',

  meta: {
    duration: '30–35 мин',
    wordCount: 18,
    xpReward: 120
  },

  phrases: [
    { de: 'Berlin ist größer als Hamburg.',      ru: 'Берлин больше Гамбурга.',          note: 'größer als — больше чем', audio: 'Berlin ist größer als Hamburg' },
    { de: 'Mein Bruder ist älter als ich.',      ru: 'Мой брат старше меня.',            note: 'alt → älter (умлаут!)', audio: 'Mein Bruder ist älter als ich' },
    { de: 'Heute ist es kälter als gestern.',    ru: 'Сегодня холоднее, чем вчера.',     note: 'kalt → kälter', audio: 'Heute ist es kälter als gestern' },
    { de: 'Dieses Buch ist interessanter.',      ru: 'Эта книга интереснее.',            note: 'interessant → interessanter', audio: 'Dieses Buch ist interessanter' },
    { de: 'Ich trinke lieber Tee als Kaffee.',   ru: 'Я предпочитаю чай кофе.',          note: 'gern → lieber — охотнее', audio: 'Ich trinke lieber Tee als Kaffee' },
    { de: 'Das ist das beste Restaurant der Stadt.', ru: 'Это лучший ресторан города.',  note: 'gut → besser → am besten/das beste', audio: 'Das ist das beste Restaurant der Stadt' },
    { de: 'Der Mount Everest ist der höchste Berg.', ru: 'Эверест — самая высокая гора.', note: 'hoch → höher → am höchsten', audio: 'Der Mount Everest ist der höchste Berg' },
    { de: 'Sie läuft am schnellsten.',           ru: 'Она бегает быстрее всех.',         note: 'am schnellsten — быстрее всех', audio: 'Sie läuft am schnellsten' },
    { de: 'Deutsch ist schwerer, als ich dachte.', ru: 'Немецкий труднее, чем я думал.', note: 'schwer → schwerer', audio: 'Deutsch ist schwerer, als ich dachte' },
    { de: 'Je mehr ich lerne, desto besser spreche ich.', ru: 'Чем больше я учу, тем лучше говорю.', note: 'je … desto — чем … тем', audio: 'Je mehr ich lerne, desto besser spreche ich' },
    { de: 'Er isst am liebsten Pizza.',          ru: 'Больше всего он любит пиццу.',     note: 'am liebsten — охотнее всего', audio: 'Er isst am liebsten Pizza' },
    { de: 'Das war der schönste Tag meines Lebens.', ru: 'Это был самый прекрасный день моей жизни.', note: 'der schönste — самый красивый', audio: 'Das war der schönste Tag meines Lebens' },
    { de: 'Mein Auto ist so alt wie deins.',     ru: 'Моя машина такая же старая, как твоя.', note: 'so … wie — такой же … как', audio: 'Mein Auto ist so alt wie deins' },
    { de: 'Immer mehr Leute lernen Deutsch.',    ru: 'Всё больше людей учат немецкий.',  note: 'immer mehr — всё больше', audio: 'Immer mehr Leute lernen Deutsch' },
    { de: 'Das ist viel teurer geworden.',       ru: 'Это стало намного дороже.',        note: 'teuer → teurer (выпадает e)', audio: 'Das ist viel teurer geworden' },
    { de: 'Am wichtigsten ist die Gesundheit.',  ru: 'Самое важное — здоровье.',         note: 'am wichtigsten — важнее всего', audio: 'Am wichtigsten ist die Gesundheit' }
  ],

  vocabulary: [
    { de: 'groß → größer',        ru: 'большой → больше',      ipa: '[ˈɡʁøːsɐ]',       article: '' },
    { de: 'klein → kleiner',      ru: 'маленький → меньше',    ipa: '[ˈklaɪ̯nɐ]',      article: '' },
    { de: 'alt → älter',          ru: 'старый → старше',       ipa: '[ˈɛltɐ]',         article: '' },
    { de: 'jung → jünger',        ru: 'молодой → моложе',      ipa: '[ˈjʏŋɐ]',         article: '' },
    { de: 'gut → besser',         ru: 'хороший → лучше',       ipa: '[ˈbɛsɐ]',         article: '' },
    { de: 'viel → mehr',          ru: 'много → больше',        ipa: '[meːɐ̯]',         article: '' },
    { de: 'gern → lieber',        ru: 'охотно → охотнее',      ipa: '[ˈliːbɐ]',        article: '' },
    { de: 'hoch → höher',         ru: 'высокий → выше',        ipa: '[ˈhøːɐ]',         article: '' },
    { de: 'nah → näher',          ru: 'близкий → ближе',       ipa: '[ˈnɛːɐ]',         article: '' },
    { de: 'teuer → teurer',       ru: 'дорогой → дороже',      ipa: '[ˈtɔɪ̯ʁɐ]',       article: '' },
    { de: 'kalt → kälter',        ru: 'холодный → холоднее',   ipa: '[ˈkɛltɐ]',        article: '' },
    { de: 'warm → wärmer',        ru: 'тёплый → теплее',       ipa: '[ˈvɛʁmɐ]',        article: '' },
    { de: 'am besten',            ru: 'лучше всего',           ipa: '[am ˈbɛstn̩]',    article: '' },
    { de: 'am meisten',           ru: 'больше всего',          ipa: '[am ˈmaɪ̯stn̩]',  article: '' },
    { de: 'am liebsten',          ru: 'охотнее всего',         ipa: '[am ˈliːpstn̩]',  article: '' },
    { de: 'so … wie',             ru: 'такой же … как',        ipa: '[zoː viː]',       article: '' },
    { de: 'als',                  ru: 'чем (при сравнении)',   ipa: '[als]',           article: '' },
    { de: 'je … desto',           ru: 'чем … тем',             ipa: '[jeː ˈdɛsto]',    article: '' }
  ],

  grammar: [
    {
      title: '⚡ Komparativ: -er + als',
      body: 'Сравнительная степень = прилагательное + <strong>-er</strong>. Короткие слова с a/o/u получают умлаут:<br><br>' +
            '<em>klein → klein<strong>er</strong>, alt → <strong>ä</strong>lt<strong>er</strong>, groß → gr<strong>ö</strong>ß<strong>er</strong></em><br><br>' +
            'Сравнение — через <strong>als</strong> (НЕ wie!):<br>' +
            '<em>Berlin ist größer <strong>als</strong> Hamburg.</em>',
      conjugation: [
        { pronoun: 'больше',    form: 'größer als',        audio: 'größer als',        translation: 'больше чем' },
        { pronoun: 'старше',    form: 'älter als',         audio: 'älter als',         translation: 'старше чем' },
        { pronoun: 'холоднее',  form: 'kälter als',        audio: 'kälter als',        translation: 'холоднее чем' },
        { pronoun: 'интереснее', form: 'interessanter als', audio: 'interessanter als', translation: 'интереснее чем' },
        { pronoun: 'дороже',    form: 'teurer als',        audio: 'teurer als',        translation: 'дороже чем' }
      ]
    },
    {
      title: '⚡ Superlativ: am -sten / der -ste',
      body: 'Превосходная степень:<br><br>' +
            'как наречие: <strong>am</strong> + -sten: <em>Sie läuft <strong>am schnellsten</strong>.</em> — Она бегает быстрее всех.<br>' +
            'с артиклем: <em>der/die/das + -ste: <strong>der höchste</strong> Berg</em> — самая высокая гора.',
      conjugation: [
        { pronoun: 'быстро',  form: 'schnell → am schnellsten',  audio: 'am schnellsten',  translation: 'быстрее всех' },
        { pronoun: 'хорошо',  form: 'gut → am besten',           audio: 'am besten',       translation: 'лучше всех' },
        { pronoun: 'много',   form: 'viel → am meisten',         audio: 'am meisten',      translation: 'больше всего' },
        { pronoun: 'охотно',  form: 'gern → am liebsten',        audio: 'am liebsten',     translation: 'охотнее всего' },
        { pronoun: 'высоко',  form: 'hoch → am höchsten',        audio: 'am höchsten',     translation: 'выше всех' }
      ]
    },
    {
      title: '💡 Исключения и особые случаи',
      body: 'Запомни неправильные формы:<br><br>' +
            '<em>gut → <strong>besser</strong> → am <strong>besten</strong></em><br>' +
            '<em>viel → <strong>mehr</strong> → am <strong>meisten</strong></em><br>' +
            '<em>gern → <strong>lieber</strong> → am <strong>liebsten</strong></em><br>' +
            '<em>hoch → <strong>höher</strong> → am <strong>höchsten</strong></em><br><br>' +
            'Одинаковость: <em><strong>so</strong> alt <strong>wie</strong></em> — такой же старый, как.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Berlin ist',           blank: 'größer',     after: 'als Hamburg.',            translation: '— Берлин больше Гамбурга.',           hintWord: 'größer',     hintRule: 'groß → größer (умлаут)' },
      { before: '— Mein Bruder ist älter', blank: 'als',       after: 'ich.',                    translation: '— Мой брат старше меня.',             hintWord: 'als',        hintRule: 'сравнение → als' },
      { before: '— Ich trinke',           blank: 'lieber',     after: 'Tee als Kaffee.',         translation: '— Я предпочитаю чай кофе.',           hintWord: 'lieber',     hintRule: 'gern → lieber' },
      { before: '— Das ist das',          blank: 'beste',      after: 'Restaurant der Stadt.',   translation: '— Это лучший ресторан города.',       hintWord: 'beste',      hintRule: 'gut → das beste' },
      { before: '— Sie läuft am',         blank: 'schnellsten', after: '.',                      translation: '— Она бегает быстрее всех.',          hintWord: 'schnellsten', hintRule: 'am + -sten' },
      { before: '— Mein Auto ist so alt', blank: 'wie',        after: 'deins.',                  translation: '— Моя машина такая же старая, как твоя.', hintWord: 'wie',    hintRule: 'so … wie — одинаковость' },
      { before: '— Je mehr ich lerne,',   blank: 'desto',      after: 'besser spreche ich.',     translation: '— Чем больше учу, тем лучше говорю.', hintWord: 'desto',      hintRule: 'je … desto' },
      { before: '— Am wichtigsten ist die', blank: 'Gesundheit', after: '.',                     translation: '— Самое важное — здоровье.',          hintWord: 'Gesundheit', hintRule: 'die Gesundheit — здоровье' }
    ],

    multipleChoice: [
      { question: 'Komparativ от «gut»…',                      options: ['guter', 'besser', 'gutter', 'am besten'],                     correctIndex: 1 },
      { question: '«Больше чем» — какое слово?',               options: ['wie', 'als', 'dann', 'so'],                                   correctIndex: 1 },
      { question: '«Такой же старый, как» — …',                options: ['so alt als', 'so alt wie', 'älter wie', 'alt als'],           correctIndex: 1 },
      { question: 'Komparativ от «viel»…',                     options: ['vieler', 'mehr', 'meist', 'viele'],                           correctIndex: 1 },
      { question: '«Am liebsten» значит…',                     options: ['с любовью', 'охотнее всего', 'любимый', 'дорогой'],           correctIndex: 1 },
      { question: 'Superlativ от «hoch»…',                     options: ['am hochsten', 'am höchsten', 'am hochesten', 'höchster'],     correctIndex: 1 },
      { question: '«Je mehr, desto besser» значит…',           options: ['всё лучше и лучше', 'чем больше, тем лучше', 'больше не надо', 'лучше меньше'], correctIndex: 1 },
      { question: 'Komparativ от «teuer»…',                    options: ['teuerer', 'teurer', 'teuerster', 'mehr teuer'],               correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'gut → besser',    ru: 'хороший → лучше' },
      { id: 2, de: 'viel → mehr',     ru: 'много → больше' },
      { id: 3, de: 'gern → lieber',   ru: 'охотно → охотнее' },
      { id: 4, de: 'alt → älter',     ru: 'старый → старше' },
      { id: 5, de: 'am besten',       ru: 'лучше всего' },
      { id: 6, de: 'am liebsten',     ru: 'охотнее всего' },
      { id: 7, de: 'so … wie',        ru: 'такой же … как' },
      { id: 8, de: 'als',             ru: 'чем' }
    ],

    dictation: [
      { word: 'größer',     audio: 'größer' },
      { word: 'besser',     audio: 'besser' },
      { word: 'lieber',     audio: 'lieber' },
      { word: 'mehr',       audio: 'mehr' },
      { word: 'älter',      audio: 'älter' },
      { word: 'höher',      audio: 'höher' },
      { word: 'schneller',  audio: 'schneller' },
      { word: 'wichtig',    audio: 'wichtig' }
    ]
  }
};
