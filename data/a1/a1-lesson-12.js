/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-12.js
   A1 · Урок 12: Berufe — Профессии
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-12',
  level: 'A1',
  unit:  12,
  title: 'Berufe',
  subtitle: 'Профессии и род занятий',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Was bist du von Beruf?',            ru: 'Кто ты по профессии?',            note: 'der Beruf — профессия; von Beruf — по профессии', audio: 'Was bist du von Beruf' },
    { de: 'Ich bin Lehrer.',                   ru: 'Я учитель.',                      note: 'профессии — БЕЗ артикля: Ich bin Lehrer', audio: 'Ich bin Lehrer' },
    { de: 'Sie ist Ärztin.',                   ru: 'Она врач.',                       note: 'der Arzt → die Ärztin (женская форма на -in)', audio: 'Sie ist Ärztin' },
    { de: 'Er arbeitet als Koch.',             ru: 'Он работает поваром.',            note: 'arbeiten als — работать кем-либо', audio: 'Er arbeitet als Koch' },
    { de: 'Wo arbeitest du?',                  ru: 'Где ты работаешь?',               note: 'wo — где', audio: 'Wo arbeitest du' },
    { de: 'Ich arbeite in einem Büro.',        ru: 'Я работаю в офисе.',              note: 'das Büro — офис', audio: 'Ich arbeite in einem Büro' },
    { de: 'Mein Vater ist Ingenieur.',         ru: 'Мой папа — инженер.',             note: 'der Ingenieur — инженер', audio: 'Mein Vater ist Ingenieur' },
    { de: 'Meine Mutter ist Verkäuferin.',     ru: 'Моя мама — продавщица.',          note: 'der Verkäufer → die Verkäuferin', audio: 'Meine Mutter ist Verkäuferin' },
    { de: 'Der Arzt hilft den Menschen.',      ru: 'Врач помогает людям.',            note: 'helfen — помогать; der Mensch → die Menschen', audio: 'Der Arzt hilft den Menschen' },
    { de: 'Ich bin Student.',                  ru: 'Я студент.',                      note: 'der Student — студент', audio: 'Ich bin Student' },
    { de: 'Sie studiert Medizin.',             ru: 'Она изучает медицину.',           note: 'studieren — учиться в вузе', audio: 'Sie studiert Medizin' },
    { de: 'Der Koch kocht in der Küche.',      ru: 'Повар готовит на кухне.',         note: 'kochen — готовить; die Küche — кухня', audio: 'Der Koch kocht in der Küche' },
    { de: 'Die Arbeit macht mir Spaß.',        ru: 'Работа доставляет мне удовольствие.', note: 'Spaß machen — доставлять удовольствие', audio: 'Die Arbeit macht mir Spaß' },
    { de: 'Der Fahrer fährt einen Bus.',       ru: 'Водитель водит автобус.',         note: 'der Fahrer — водитель; fahren — ездить', audio: 'Der Fahrer fährt einen Bus' },
    { de: 'Ich möchte Polizist werden.',       ru: 'Я хочу стать полицейским.',       note: 'werden — становиться', audio: 'Ich möchte Polizist werden' },
    { de: 'Er ist arbeitslos.',                ru: 'Он безработный.',                 note: 'arbeitslos — безработный', audio: 'Er ist arbeitslos' }
  ],

  vocabulary: [
    { de: 'der Beruf',        ru: 'профессия',        ipa: '[bəˈʁuːf]',        article: 'der' },
    { de: 'die Arbeit',       ru: 'работа',           ipa: '[ˈaʁbaɪ̯t]',       article: 'die' },
    { de: 'der Lehrer',       ru: 'учитель',          ipa: '[ˈleːʁɐ]',         article: 'der' },
    { de: 'die Lehrerin',     ru: 'учительница',      ipa: '[ˈleːʁəʁɪn]',      article: 'die' },
    { de: 'der Arzt',         ru: 'врач',             ipa: '[aːɐ̯tst]',        article: 'der' },
    { de: 'die Ärztin',       ru: 'врач (женщина)',   ipa: '[ˈɛːɐ̯tstɪn]',     article: 'die' },
    { de: 'der Koch',         ru: 'повар',            ipa: '[kɔx]',            article: 'der' },
    { de: 'der Verkäufer',    ru: 'продавец',         ipa: '[fɛɐ̯ˈkɔɪ̯fɐ]',    article: 'der' },
    { de: 'der Ingenieur',    ru: 'инженер',          ipa: '[ɪnʒeˈni̯øːɐ̯]',   article: 'der' },
    { de: 'der Fahrer',       ru: 'водитель',         ipa: '[ˈfaːʁɐ]',         article: 'der' },
    { de: 'der Polizist',     ru: 'полицейский',      ipa: '[poliˈtsɪst]',     article: 'der' },
    { de: 'der Student',      ru: 'студент',          ipa: '[ʃtuˈdɛnt]',       article: 'der' },
    { de: 'das Büro',         ru: 'офис',             ipa: '[byˈʁoː]',         article: 'das' },
    { de: 'die Firma',        ru: 'фирма',            ipa: '[ˈfɪʁma]',         article: 'die' },
    { de: 'das Krankenhaus',  ru: 'больница',         ipa: '[ˈkʁaŋkn̩ˌhaʊ̯s]', article: 'das' },
    { de: 'die Schule',       ru: 'школа',            ipa: '[ˈʃuːlə]',         article: 'die' },
    { de: 'arbeiten',         ru: 'работать',         ipa: '[ˈaʁbaɪ̯tn̩]',     article: '' },
    { de: 'studieren',        ru: 'учиться в вузе',   ipa: '[ʃtuˈdiːʁən]',     article: '' },
    { de: 'werden',           ru: 'становиться',      ipa: '[ˈveːɐ̯dn̩]',      article: '' },
    { de: 'arbeitslos',       ru: 'безработный',      ipa: '[ˈaʁbaɪ̯tsloːs]',  article: '' }
  ],

  grammar: [
    {
      title: '⚡ Профессии — без артикля!',
      body: 'Когда называешь профессию после <strong>sein</strong> или <strong>werden</strong>, артикль НЕ нужен:<br><br>' +
            '<em>Ich bin <strong>Lehrer</strong>.</em> — Я учитель. (НЕ «ein Lehrer»)<br>' +
            '<em>Sie ist <strong>Ärztin</strong>.</em> — Она врач.<br>' +
            '<em>Er möchte <strong>Polizist</strong> werden.</em> — Он хочет стать полицейским.',
      conjugation: [
        { pronoun: 'учитель',    form: 'Ich bin Lehrer.',       audio: 'Ich bin Lehrer',       translation: 'Я учитель.' },
        { pronoun: 'врач',       form: 'Sie ist Ärztin.',       audio: 'Sie ist Ärztin',       translation: 'Она врач.' },
        { pronoun: 'студент',    form: 'Er ist Student.',       audio: 'Er ist Student',       translation: 'Он студент.' },
        { pronoun: 'повар',      form: 'Ich arbeite als Koch.', audio: 'Ich arbeite als Koch', translation: 'Я работаю поваром.' }
      ]
    },
    {
      title: '⚡ Женские формы профессий: -in',
      body: 'Женская форма профессии образуется добавлением <strong>-in</strong> (иногда с умлаутом):<br><br>' +
            '<em>der Lehrer → die Lehrer<strong>in</strong></em> — учительница<br>' +
            '<em>der Arzt → die <strong>Ä</strong>rzt<strong>in</strong></em> — врач (женщина)<br>' +
            '<em>der Verkäufer → die Verkäufer<strong>in</strong></em> — продавщица',
      conjugation: [
        { pronoun: 'der Lehrer',    form: 'die Lehrerin',    audio: 'die Lehrerin',    translation: 'учительница' },
        { pronoun: 'der Arzt',      form: 'die Ärztin',      audio: 'die Ärztin',      translation: 'врач (женщина)' },
        { pronoun: 'der Koch',      form: 'die Köchin',      audio: 'die Köchin',      translation: 'повариха' },
        { pronoun: 'der Student',   form: 'die Studentin',   audio: 'die Studentin',   translation: 'студентка' },
        { pronoun: 'der Verkäufer', form: 'die Verkäuferin', audio: 'die Verkäuferin', translation: 'продавщица' }
      ]
    },
    {
      title: '💡 Глагол arbeiten — работать',
      body: 'Корень <em>arbeit-</em> оканчивается на <strong>-t</strong>, поэтому в формах du/er/ihr добавляется <strong>-e-</strong> для удобства произношения:<br><br>' +
            '<em>du arbeit<strong>e</strong>st, er arbeit<strong>e</strong>t</em>',
      conjugation: [
        { pronoun: 'ich',           form: 'arbeite',    audio: 'ich arbeite',    translation: 'я работаю' },
        { pronoun: 'du',            form: 'arbeitest',  audio: 'du arbeitest',   translation: 'ты работаешь' },
        { pronoun: 'er / sie / es', form: 'arbeitet',   audio: 'er arbeitet',    translation: 'он/она работает' },
        { pronoun: 'wir',           form: 'arbeiten',   audio: 'wir arbeiten',   translation: 'мы работаем' },
        { pronoun: 'ihr',           form: 'arbeitet',   audio: 'ihr arbeitet',   translation: 'вы работаете' },
        { pronoun: 'Sie / sie',     form: 'arbeiten',   audio: 'Sie arbeiten',   translation: 'Вы работаете / они работают' }
      ]
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Was bist du von',      blank: 'Beruf',      after: '?',                     translation: '— Кто ты по профессии?',            hintWord: 'Beruf',      hintRule: 'von Beruf — по профессии' },
      { before: '— Ich bin',              blank: 'Lehrer',     after: '.',                     translation: '— Я учитель.',                      hintWord: 'Lehrer',     hintRule: 'профессия без артикля' },
      { before: '— Sie ist',              blank: 'Ärztin',     after: '.',                     translation: '— Она врач.',                       hintWord: 'Ärztin',     hintRule: 'женская форма на -in' },
      { before: '— Wo',                   blank: 'arbeitest',  after: 'du?',                   translation: '— Где ты работаешь?',               hintWord: 'arbeitest',  hintRule: 'du → arbeitest (-e- перед -st)' },
      { before: '— Ich arbeite in einem', blank: 'Büro',       after: '.',                     translation: '— Я работаю в офисе.',              hintWord: 'Büro',       hintRule: 'das Büro — офис' },
      { before: '— Er arbeitet',          blank: 'als',        after: 'Koch.',                 translation: '— Он работает поваром.',            hintWord: 'als',        hintRule: 'arbeiten als — работать кем-то' },
      { before: '— Sie',                  blank: 'studiert',   after: 'Medizin.',              translation: '— Она изучает медицину.',           hintWord: 'studiert',   hintRule: 'studieren — учиться в вузе' },
      { before: '— Ich möchte Polizist',  blank: 'werden',     after: '.',                     translation: '— Я хочу стать полицейским.',       hintWord: 'werden',     hintRule: 'werden — становиться' }
    ],

    multipleChoice: [
      { question: 'Как спросить «Кто ты по профессии?»',        options: ['Wer bist du?', 'Was bist du von Beruf?', 'Wie heißt du?', 'Wo bist du?'], correctIndex: 1 },
      { question: 'Правильный вариант: «Я учитель»…',           options: ['Ich bin ein Lehrer.', 'Ich bin Lehrer.', 'Ich bin der Lehrer.', 'Ich Lehrer.'], correctIndex: 1 },
      { question: 'Женская форма от «der Arzt»…',               options: ['die Arztin', 'die Ärztin', 'die Arztin', 'die Ärzte'],       correctIndex: 1 },
      { question: '«Der Verkäufer» работает…',                  options: ['в больнице', 'в магазине', 'в школе', 'в полиции'],          correctIndex: 1 },
      { question: '«Arbeiten als» значит…',                     options: ['работать у', 'работать кем-либо', 'работать с', 'искать работу'], correctIndex: 1 },
      { question: 'Форма arbeiten для «er»…',                   options: ['arbeitt', 'arbeitet', 'arbeitest', 'arbeiten'],              correctIndex: 1 },
      { question: '«Studieren» значит…',                        options: ['работать', 'учиться в вузе', 'читать', 'учить наизусть'],   correctIndex: 1 },
      { question: '«Das Krankenhaus» — это…',                   options: ['аптека', 'школа', 'больница', 'офис'],                       correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'der Lehrer',      ru: 'учитель' },
      { id: 2, de: 'der Arzt',        ru: 'врач' },
      { id: 3, de: 'der Koch',        ru: 'повар' },
      { id: 4, de: 'der Verkäufer',   ru: 'продавец' },
      { id: 5, de: 'der Fahrer',      ru: 'водитель' },
      { id: 6, de: 'der Polizist',    ru: 'полицейский' },
      { id: 7, de: 'der Beruf',       ru: 'профессия' },
      { id: 8, de: 'arbeitslos',      ru: 'безработный' }
    ],

    dictation: [
      { word: 'Beruf',    audio: 'Beruf' },
      { word: 'Lehrer',   audio: 'Lehrer' },
      { word: 'Arzt',     audio: 'Arzt' },
      { word: 'Koch',     audio: 'Koch' },
      { word: 'Büro',     audio: 'Büro' },
      { word: 'Arbeit',   audio: 'Arbeit' },
      { word: 'Student',  audio: 'Student' },
      { word: 'Schule',   audio: 'Schule' }
    ]
  }
};
