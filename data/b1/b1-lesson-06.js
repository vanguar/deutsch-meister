/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-06.js
   B1 · Урок 6: Beruf und Bewerbung — Работа и резюме
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-06',
  level:    'B1',
  unit:     6,
  title:    'Beruf und Bewerbung',
  subtitle: 'Работа и резюме · Vorstellungsgespräch',

  meta: {
    duration:  '35–40 мин',
    wordCount: 26,
    xpReward:  150
  },

  phrases: [
    { de: 'Ich bewerbe mich um die Stelle als Ingenieur.',      ru: 'Я претендую на должность инженера.',               note: 'sich bewerben um + Akk. — подавать заявку', audio: 'Ich bewerbe mich um die Stelle als Ingenieur' },
    { de: 'Haben Sie Erfahrung in diesem Bereich?',             ru: 'У вас есть опыт в этой области?',                  note: 'Erfahrung + Präp. in — опыт в области', audio: 'Haben Sie Erfahrung in diesem Bereich' },
    { de: 'Ich habe fünf Jahre Berufserfahrung.',               ru: 'У меня пять лет профессионального опыта.',         note: 'Berufserfahrung — профессиональный опыт', audio: 'Ich habe fünf Jahre Berufserfahrung' },
    { de: 'Welche Qualifikationen haben Sie?',                   ru: 'Какие у вас квалификации?',                        note: 'die Qualifikation — квалификация', audio: 'Welche Qualifikationen haben Sie' },
    { de: 'Ich spreche fließend Englisch und Russisch.',         ru: 'Я свободно говорю по-английски и по-русски.',      note: 'fließend — свободно (о языке)', audio: 'Ich spreche fließend Englisch und Russisch' },
    { de: 'Meine Stärken sind Teamarbeit und Kreativität.',      ru: 'Мои сильные стороны — командная работа и творчество.', note: 'die Stärke — сильная сторона', audio: 'Meine Stärken sind Teamarbeit und Kreativität' },
    { de: 'Warum möchten Sie bei uns arbeiten?',                 ru: 'Почему вы хотите работать у нас?',                 note: 'Типичный вопрос на собеседовании', audio: 'Warum möchten Sie bei uns arbeiten' },
    { de: 'Ich bin motiviert und zuverlässig.',                  ru: 'Я мотивирован и надёжен.',                         note: 'zuverlässig — надёжный', audio: 'Ich bin motiviert und zuverlässig' },
    { de: 'Das Gehalt beträgt 3.500 Euro pro Monat.',            ru: 'Зарплата составляет 3500 евро в месяц.',           note: 'das Gehalt — зарплата (для офисных работников)', audio: 'Das Gehalt beträgt 3500 Euro pro Monat' },
    { de: 'Ich bin bereit, Überstunden zu machen.',              ru: 'Я готов работать сверхурочно.',                    note: 'bereit sein + zu + Infinitiv', audio: 'Ich bin bereit, Überstunden zu machen' },
    { de: 'Bitte schicken Sie Ihren Lebenslauf per E-Mail.',     ru: 'Пожалуйста, пришлите ваше CV по электронной почте.', note: 'der Lebenslauf — резюме (CV)', audio: 'Bitte schicken Sie Ihren Lebenslauf per E-Mail' },
    { de: 'Ich habe mich auf Ihre Stellenanzeige beworben.',     ru: 'Я откликнулся на ваше объявление о вакансии.',     note: 'die Stellenanzeige — объявление о вакансии', audio: 'Ich habe mich auf Ihre Stellenanzeige beworben' },
    { de: 'Das Vorstellungsgespräch findet am Montag statt.',    ru: 'Собеседование состоится в понедельник.',           note: 'das Vorstellungsgespräch — собеседование', audio: 'Das Vorstellungsgespräch findet am Montag statt' },
    { de: 'Wir bieten 30 Urlaubstage pro Jahr.',                 ru: 'Мы предоставляем 30 дней отпуска в год.',          note: 'der Urlaub — отпуск; Urlaubstag — день отпуска', audio: 'Wir bieten 30 Urlaubstage pro Jahr' },
    { de: 'Die Stelle ist ab sofort zu besetzen.',               ru: 'Должность свободна с немедленного вступления.',    note: 'ab sofort — с немедленного вступления', audio: 'Die Stelle ist ab sofort zu besetzen' },
    { de: 'Ich kündige meinen Job, weil ich eine bessere Stelle gefunden habe.', ru: 'Я увольняюсь, потому что нашёл лучшую работу.', note: 'kündigen — увольняться/увольнять', audio: 'Ich kündige meinen Job' },
    { de: 'Er wurde eingestellt.',                               ru: 'Его приняли на работу.',                          note: 'einstellen — принимать на работу (Passiv)', audio: 'Er wurde eingestellt' },
    { de: 'Die Firma sucht einen erfahrenen Buchhalter.',        ru: 'Фирма ищет опытного бухгалтера.',                 note: 'erfahren — опытный; der Buchhalter — бухгалтер', audio: 'Die Firma sucht einen erfahrenen Buchhalter' },
    { de: 'Ich arbeite in Vollzeit / Teilzeit.',                 ru: 'Я работаю полный / неполный день.',                note: 'Vollzeit / Teilzeit — полная / частичная занятость', audio: 'Ich arbeite in Vollzeit oder Teilzeit' },
    { de: 'Das ist eine Festanstellung, keine Zeitarbeit.',      ru: 'Это постоянная работа, не временная.',             note: 'die Festanstellung — постоянная должность', audio: 'Das ist eine Festanstellung, keine Zeitarbeit' },
    { de: 'Ich mache zurzeit ein Praktikum.',                    ru: 'Сейчас я на стажировке.',                         note: 'das Praktikum — практика, стажировка', audio: 'Ich mache zurzeit ein Praktikum' },
    { de: 'Welche Aufgaben hat diese Stelle?',                   ru: 'Какие задачи у этой должности?',                   note: 'die Aufgabe — задача, обязанность', audio: 'Welche Aufgaben hat diese Stelle' },
    { de: 'Ich bin selbstständig / angestellt.',                 ru: 'Я самозанятый / наёмный работник.',               note: 'selbstständig — самозанятый; angestellt — наёмный', audio: 'Ich bin selbstständig oder angestellt' },
    { de: 'Das Team arbeitet sehr gut zusammen.',                ru: 'Команда работает очень хорошо вместе.',            note: 'zusammenarbeiten — работать вместе', audio: 'Das Team arbeitet sehr gut zusammen' }
  ],

  vocabulary: [
    { de: 'die Stelle',           ru: 'должность, место',          ipa: '[ˈʃtɛlə]',          article: 'die' },
    { de: 'die Bewerbung',        ru: 'заявка, заявление',         ipa: '[bəˈvɛʁbʊŋ]',       article: 'die' },
    { de: 'der Lebenslauf',       ru: 'резюме (CV)',               ipa: '[ˈleːbm̩sˌlaʊ̯f]',    article: 'der' },
    { de: 'das Gehalt',           ru: 'зарплата (оклад)',          ipa: '[ɡəˈhalt]',          article: 'das' },
    { de: 'die Erfahrung',        ru: 'опыт',                      ipa: '[ɛʁˈfaːʁʊŋ]',       article: 'die' },
    { de: 'die Qualifikation',    ru: 'квалификация',              ipa: '[kvalɪfɪˈkaːtsi̯oːn]', article: 'die' },
    { de: 'das Vorstellungsgespräch', ru: 'собеседование',         ipa: '[ˈfoːɐ̯ʃtɛlʊŋsɡəˌʃpʁɛːç]', article: 'das' },
    { de: 'die Stellenanzeige',   ru: 'объявление о вакансии',     ipa: '[ˈʃtɛlənˌantˌsaɪ̯ɡə]', article: 'die' },
    { de: 'die Stärke',           ru: 'сильная сторона',           ipa: '[ˈʃtɛʁkə]',          article: 'die' },
    { de: 'die Schwäche',         ru: 'слабая сторона',            ipa: '[ˈʃvɛçə]',           article: 'die' },
    { de: 'fließend',             ru: 'свободно (о языке)',         ipa: '[ˈfliːsn̩t]',         article: '' },
    { de: 'zuverlässig',          ru: 'надёжный',                  ipa: '[tsuːfɛʁˈlɛsɪç]',    article: '' },
    { de: 'motiviert',            ru: 'мотивированный',            ipa: '[motiˈviːɐ̯t]',        article: '' },
    { de: 'einstellen',           ru: 'принимать на работу',       ipa: '[ˈaɪ̯nˌʃtɛlən]',      article: '' },
    { de: 'kündigen',             ru: 'увольнять / увольняться',   ipa: '[ˈkʏndɪɡn̩]',         article: '' },
    { de: 'das Praktikum',        ru: 'стажировка, практика',      ipa: '[ˈpʁaktɪkʊm]',        article: 'das' },
    { de: 'die Vollzeit',         ru: 'полный рабочий день',       ipa: '[ˈfɔltˌtsaɪ̯t]',      article: 'die' },
    { de: 'die Teilzeit',         ru: 'неполный рабочий день',     ipa: '[ˈtaɪ̯lˌtsaɪ̯t]',      article: 'die' },
    { de: 'die Festanstellung',   ru: 'постоянная работа',         ipa: '[ˈfɛstˌanˌʃtɛlʊŋ]',  article: 'die' },
    { de: 'selbstständig',        ru: 'самозанятый, независимый',  ipa: '[ˈzɛlpstˌʃtɛndɪç]',  article: '' },
    { de: 'die Überstunden',      ru: 'сверхурочные (мн. ч.)',     ipa: '[ˈyːbɐˌʃtʊndn̩]',     article: '' },
    { de: 'der Urlaub',           ru: 'отпуск',                   ipa: '[ˈʊʁlaʊ̯p]',           article: 'der' },
    { de: 'der Buchhalter',       ru: 'бухгалтер',                 ipa: '[ˈbuːxˌhaltɐ]',       article: 'der' },
    { de: 'die Kreativität',      ru: 'креативность',              ipa: '[kʁeativɪˈtɛːt]',     article: 'die' },
    { de: 'bewerben (sich)',      ru: 'подавать заявку, претендовать', ipa: '[bəˈvɛʁbn̩]',    article: '' },
    { de: 'betragen',             ru: 'составлять (о сумме)',       ipa: '[bəˈtʁaːɡn̩]',        article: '' }
  ],

  grammar: [
    {
      title: '⚡ sich bewerben um — подавать заявку',
      body: 'Глагол <strong>sich bewerben</strong> (претендовать, подавать заявку) — возвратный, требует <strong>um + Akkusativ</strong>:<br><br>' +
            '<em>Ich bewerbe <strong>mich</strong> um die <strong>Stelle</strong>.</em><br>' +
            '<em>Er hat sich um den <strong>Job</strong> beworben.</em><br><br>' +
            'Сопутствующие конструкции:<br>' +
            '<em>Ich bewerbe mich <strong>bei</strong> der Firma.</em> (у фирмы)<br>' +
            '<em>Ich bewerbe mich <strong>auf</strong> die Stellenanzeige.</em> (на объявление)',
      conjugation: [
        { pronoun: 'ich',           form: 'bewerbe mich',   audio: 'ich bewerbe mich',   translation: 'я претендую' },
        { pronoun: 'du',            form: 'bewirbst dich',  audio: 'du bewirbst dich',   translation: 'ты претендуешь' },
        { pronoun: 'er / sie / es', form: 'bewirbt sich',   audio: 'er bewirbt sich',    translation: 'он/она претендует' },
        { pronoun: 'wir',           form: 'bewerben uns',   audio: 'wir bewerben uns',   translation: 'мы претендуем' },
        { pronoun: 'ihr',           form: 'bewerbt euch',   audio: 'ihr bewerbt euch',   translation: 'вы претендуете' },
        { pronoun: 'Sie / sie',     form: 'bewerben sich',  audio: 'Sie bewerben sich',  translation: 'Вы/они претендуют' }
      ]
    },
    {
      title: '💡 Полезные конструкции для собеседования',
      body: 'Шаблонные фразы, которые ценятся на Vorstellungsgespräch:<br><br>' +
            '<em>Meine <strong>Stärken</strong> sind…</em> — Мои сильные стороны…<br>' +
            '<em>Ich habe Erfahrung <strong>in</strong> + Dativ.</em> — У меня опыт в…<br>' +
            '<em>Ich spreche <strong>fließend</strong>…</em> — Я свободно говорю…<br>' +
            '<em>Ich bin bereit, Überstunden <strong>zu machen</strong>.</em> — Готов к сверхурочным.<br>' +
            '<em>Ich bin <strong>zuverlässig</strong> und <strong>teamfähig</strong>.</em> — Надёжный и умею работать в команде.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich bewerbe mich',     blank: 'um',           after: 'die Stelle.',              translation: '— Я претендую на должность.',           hintWord: 'um',           hintRule: 'sich bewerben um + Akk.' },
      { before: '— Ich spreche',          blank: 'fließend',     after: 'Deutsch.',                 translation: '— Я свободно говорю по-немецки.',       hintWord: 'fließend',     hintRule: 'fließend — свободно (о языке)' },
      { before: '— Das',                  blank: 'Gehalt',       after: 'beträgt 3.000 Euro.',      translation: '— Зарплата составляет 3000 евро.',       hintWord: 'Gehalt',       hintRule: 'das Gehalt — оклад' },
      { before: '— Er wurde',             blank: 'eingestellt',  after: '.',                        translation: '— Его приняли на работу.',              hintWord: 'eingestellt',  hintRule: 'einstellen → eingestellt (Passiv)' },
      { before: '— Ich bin',             blank: 'bereit',        after: ', Überstunden zu machen.', translation: '— Я готов работать сверхурочно.',       hintWord: 'bereit',       hintRule: 'bereit sein + zu + Infinitiv' },
      { before: '— Bitte schicken Sie',  blank: 'Ihren',         after: 'Lebenslauf per E-Mail.',   translation: '— Пришлите ваше резюме по почте.',      hintWord: 'Ihren',        hintRule: 'Ihren Lebenslauf — Akk. от Ihr' },
      { before: '— Ich mache ein',       blank: 'Praktikum',     after: 'bei der Firma.',           translation: '— Я на стажировке в фирме.',            hintWord: 'Praktikum',    hintRule: 'das Praktikum — стажировка' },
      { before: '— Die Stelle ist ab',   blank: 'sofort',        after: 'zu besetzen.',             translation: '— Должность свободна с немедленного.',  hintWord: 'sofort',       hintRule: 'ab sofort — с немедленного вступления' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «резюме»?',                             options: ['die Bewerbung', 'der Lebenslauf', 'die Stelle', 'das Gespräch'],       correctIndex: 1 },
      { question: 'После «sich bewerben» идёт…',                          options: ['auf + Dativ', 'um + Akkusativ', 'bei + Nominativ', 'für + Dativ'],     correctIndex: 1 },
      { question: 'Что значит «fließend Englisch sprechen»?',             options: ['немного', 'свободно', 'с акцентом', 'плохо'],                          correctIndex: 1 },
      { question: 'Как сказать «полный рабочий день»?',                    options: ['Teilzeit', 'Überstunden', 'Vollzeit', 'Praktikum'],                   correctIndex: 2 },
      { question: '«Er wurde eingestellt» — это…',                         options: ['Aktiv Präsens', 'Passiv Präteritum', 'Aktiv Präteritum', 'Futur'],    correctIndex: 1 },
      { question: 'Как перевести «zuverlässig»?',                          options: ['мотивированный', 'надёжный', 'творческий', 'опытный'],                correctIndex: 1 },
      { question: '«Die Überstunden» — это…',                              options: ['отпуск', 'перерыв', 'сверхурочные', 'рабочее время'],                 correctIndex: 2 },
      { question: 'Синоним к «das Gehalt»?',                               options: ['der Lohn (для рабочих)', 'die Stelle', 'die Aufgabe', 'das Büro'],   correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'die Bewerbung',     ru: 'заявка на работу' },
      { id: 2, de: 'der Lebenslauf',    ru: 'резюме (CV)' },
      { id: 3, de: 'das Gehalt',        ru: 'зарплата (оклад)' },
      { id: 4, de: 'die Stärke',        ru: 'сильная сторона' },
      { id: 5, de: 'einstellen',        ru: 'принимать на работу' },
      { id: 6, de: 'kündigen',          ru: 'увольняться' },
      { id: 7, de: 'das Praktikum',     ru: 'стажировка' },
      { id: 8, de: 'zuverlässig',       ru: 'надёжный' }
    ],

    dictation: [
      { word: 'Bewerbung',    audio: 'Bewerbung' },
      { word: 'Lebenslauf',   audio: 'Lebenslauf' },
      { word: 'Gehalt',       audio: 'Gehalt' },
      { word: 'fließend',     audio: 'fließend' },
      { word: 'zuverlässig',  audio: 'zuverlässig' },
      { word: 'Praktikum',    audio: 'Praktikum' },
      { word: 'Überstunden',  audio: 'Überstunden' },
      { word: 'einstellen',   audio: 'einstellen' }
    ]
  }
};
