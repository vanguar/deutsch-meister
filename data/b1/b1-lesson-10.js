/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-10.js
   B1 · Урок 10: Genitiv und Präpositionen
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-10',
  level:    'B1',
  unit:     10,
  title:    'Genitiv und Präpositionen',
  subtitle: 'Родительный падеж · wegen, trotz, während, statt',

  meta: {
    duration:  '35–40 мин',
    wordCount: 20,
    xpReward:  150
  },

  phrases: [
    { de: 'Das ist das Auto meines Vaters.',                    ru: 'Это машина моего отца.',                          note: 'Genitiv m: meines Vaters (+s!)', audio: 'Das ist das Auto meines Vaters' },
    { de: 'Die Tasche meiner Schwester ist rot.',               ru: 'Сумка моей сестры красная.',                      note: 'Genitiv f: meiner — без -s', audio: 'Die Tasche meiner Schwester ist rot' },
    { de: 'Der Titel des Buches ist sehr lang.',                ru: 'Название книги очень длинное.',                   note: 'Genitiv n: des Buches', audio: 'Der Titel des Buches ist sehr lang' },
    { de: 'Die Meinung der Eltern ist mir wichtig.',            ru: 'Мнение родителей мне важно.',                     note: 'Genitiv Plural: der', audio: 'Die Meinung der Eltern ist mir wichtig' },
    { de: 'Wegen des Regens bleiben wir zu Hause.',             ru: 'Из-за дождя мы остаёмся дома.',                   note: 'wegen + Genitiv', audio: 'Wegen des Regens bleiben wir zu Hause' },
    { de: 'Trotz des schlechten Wetters gehen wir spazieren.',  ru: 'Несмотря на плохую погоду, мы идём гулять.',      note: 'trotz + Genitiv', audio: 'Trotz des schlechten Wetters gehen wir spazieren' },
    { de: 'Während der Arbeit darf ich nicht telefonieren.',    ru: 'Во время работы мне нельзя разговаривать по телефону.', note: 'während + Genitiv', audio: 'Während der Arbeit darf ich nicht telefonieren' },
    { de: 'Statt eines Geschenks hat er Blumen gebracht.',      ru: 'Вместо подарка он принёс цветы.',                 note: 'statt + Genitiv', audio: 'Statt eines Geschenks hat er Blumen gebracht' },
    { de: 'Am Ende des Monats habe ich nie Geld.',              ru: 'В конце месяца у меня никогда нет денег.',        note: 'am Ende + Genitiv', audio: 'Am Ende des Monats habe ich nie Geld' },
    { de: 'Die Hälfte der Studenten hat die Prüfung bestanden.', ru: 'Половина студентов сдала экзамен.',              note: 'die Hälfte + Genitiv', audio: 'Die Hälfte der Studenten hat die Prüfung bestanden' },
    { de: 'Das Haus meiner Großeltern liegt am Rande der Stadt.', ru: 'Дом моих бабушки и дедушки находится на окраине города.', note: 'am Rande + Genitiv', audio: 'Das Haus meiner Großeltern liegt am Rande der Stadt' },
    { de: 'Wegen eines Staus kam er zu spät zur Arbeit.',       ru: 'Из-за пробки он опоздал на работу.',              note: 'wegen + Genitiv (ein → eines)', audio: 'Wegen eines Staus kam er zu spät zur Arbeit' },
    { de: 'Trotz seiner Müdigkeit arbeitete er weiter.',        ru: 'Несмотря на усталость, он продолжал работать.',   note: 'sein → seiner (Genitiv f)', audio: 'Trotz seiner Müdigkeit arbeitete er weiter' },
    { de: 'Während des Urlaubs haben wir viel fotografiert.',   ru: 'Во время отпуска мы много фотографировали.',      note: 'während des Urlaubs', audio: 'Während des Urlaubs haben wir viel fotografiert' },
    { de: 'Das ist Annas Fahrrad, nicht meins.',                ru: 'Это велосипед Анны, а не мой.',                   note: 'имя + s без апострофа: Annas', audio: 'Das ist Annas Fahrrad, nicht meins' },
    { de: 'In der Umgangssprache sagt man oft: das Auto von meinem Vater.', ru: 'В разговорной речи часто говорят: машина моего отца (через von).', note: 'von + Dativ вместо Genitiv', audio: 'In der Umgangssprache sagt man oft: das Auto von meinem Vater' },
    { de: 'Der Anfang des Films war langweilig, aber das Ende war super.', ru: 'Начало фильма было скучным, но конец был супер.', note: 'des Films — Genitiv', audio: 'Der Anfang des Films war langweilig, aber das Ende war super' },
    { de: 'Innerhalb einer Woche bekommen Sie eine Antwort.',   ru: 'В течение недели вы получите ответ.',             note: 'innerhalb + Genitiv', audio: 'Innerhalb einer Woche bekommen Sie eine Antwort' },
    { de: 'Außerhalb der Stadt ist die Luft besser.',           ru: 'За городом воздух лучше.',                        note: 'außerhalb + Genitiv', audio: 'Außerhalb der Stadt ist die Luft besser' },
    { de: 'Meiner Meinung nach ist das eine gute Idee.',        ru: 'По моему мнению, это хорошая идея.',              note: 'meiner Meinung nach — устойчивый Genitiv-оборот', audio: 'Meiner Meinung nach ist das eine gute Idee' }
  ],

  vocabulary: [
    { de: 'wegen',            ru: 'из-за (+ Genitiv)',           ipa: '[ˈveːɡn̩]',          article: '' },
    { de: 'trotz',            ru: 'несмотря на (+ Genitiv)',     ipa: '[tʁɔt͡s]',           article: '' },
    { de: 'während',          ru: 'во время (+ Genitiv)',        ipa: '[ˈvɛːʁənt]',         article: '' },
    { de: 'statt / anstatt',  ru: 'вместо (+ Genitiv)',          ipa: '[ʃtat]',             article: '' },
    { de: 'innerhalb',        ru: 'внутри, в течение (+ Gen.)',  ipa: '[ˈɪnɐhalp]',         article: '' },
    { de: 'außerhalb',        ru: 'вне, за пределами (+ Gen.)',  ipa: '[ˈaʊ̯sɐhalp]',       article: '' },
    { de: 'der Regen',        ru: 'дождь',                       ipa: '[ˈʁeːɡn̩]',          article: 'der' },
    { de: 'der Stau',         ru: 'пробка (на дороге)',          ipa: '[ʃtaʊ̯]',            article: 'der' },
    { de: 'die Müdigkeit',    ru: 'усталость',                   ipa: '[ˈmyːdɪçkaɪ̯t]',     article: 'die' },
    { de: 'die Meinung',      ru: 'мнение',                      ipa: '[ˈmaɪ̯nʊŋ]',         article: 'die' },
    { de: 'die Hälfte',       ru: 'половина',                    ipa: '[ˈhɛlftə]',          article: 'die' },
    { de: 'der Titel',        ru: 'название, заголовок',         ipa: '[ˈtiːtl̩]',           article: 'der' },
    { de: 'der Anfang',       ru: 'начало',                      ipa: '[ˈanfaŋ]',           article: 'der' },
    { de: 'das Ende',         ru: 'конец',                       ipa: '[ˈɛndə]',            article: 'das' },
    { de: 'der Rand',         ru: 'край, окраина',               ipa: '[ʁant]',             article: 'der' },
    { de: 'die Umgebung',     ru: 'окрестности',                 ipa: '[ʊmˈɡeːbʊŋ]',        article: 'die' },
    { de: 'die Umgangssprache', ru: 'разговорный язык',          ipa: '[ˈʊmɡaŋsʃpʁaːxə]',   article: 'die' },
    { de: 'bestehen',         ru: 'сдать (экзамен)',             ipa: '[bəˈʃteːən]',        article: '' },
    { de: 'die Antwort',      ru: 'ответ',                       ipa: '[ˈantvɔʁt]',         article: 'die' },
    { de: 'die Großeltern',   ru: 'бабушка и дедушка',           ipa: '[ˈɡʁoːsʔɛltɐn]',     article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Genitiv — падеж принадлежности «чей?»',
      body: 'Genitiv отвечает на вопрос <strong>Wessen?</strong> (чей?) и ставится <em>после</em> существительного:<br><br>' +
            '<em>das Auto <strong>des Mannes</strong></em> — машина мужчины<br>' +
            '<em>die Tasche <strong>der Frau</strong></em> — сумка женщины<br><br>' +
            '⚠️ Мужской и средний род получают <strong>-s / -es</strong> у существительного: <em>des Vater<strong>s</strong>, des Buch<strong>es</strong></em>. Женский род и Plural — без изменений.',
      conjugation: [
        { pronoun: 'm: der →',  form: 'des alten Mannes',   audio: 'des alten Mannes',   translation: 'старого мужчины' },
        { pronoun: 'f: die →',  form: 'der jungen Frau',    audio: 'der jungen Frau',    translation: 'молодой женщины' },
        { pronoun: 'n: das →',  form: 'des kleinen Kindes', audio: 'des kleinen Kindes', translation: 'маленького ребёнка' },
        { pronoun: 'Pl: die →', form: 'der neuen Kollegen', audio: 'der neuen Kollegen', translation: 'новых коллег' },
        { pronoun: 'ein (m) →', form: 'eines Freundes',     audio: 'eines Freundes',     translation: 'одного друга' }
      ]
    },
    {
      title: '⚡ Четыре главных предлога с Genitiv',
      body: 'Запомни четвёрку — она встречается в каждом тексте уровня B1:<br><br>' +
            '<strong>wegen</strong> — из-за: <em>wegen des Regens</em><br>' +
            '<strong>trotz</strong> — несмотря на: <em>trotz des Wetters</em><br>' +
            '<strong>während</strong> — во время: <em>während der Arbeit</em><br>' +
            '<strong>statt</strong> — вместо: <em>statt eines Geschenks</em><br><br>' +
            'Бонус: <strong>innerhalb</strong> (в течение / внутри) и <strong>außerhalb</strong> (вне).',
      conjugation: [
        { pronoun: 'wegen',     form: 'wegen des Staus',          audio: 'wegen des Staus',          translation: 'из-за пробки' },
        { pronoun: 'trotz',     form: 'trotz der Kälte',          audio: 'trotz der Kälte',          translation: 'несмотря на холод' },
        { pronoun: 'während',   form: 'während des Urlaubs',      audio: 'während des Urlaubs',      translation: 'во время отпуска' },
        { pronoun: 'statt',     form: 'statt einer Antwort',      audio: 'statt einer Antwort',      translation: 'вместо ответа' },
        { pronoun: 'innerhalb', form: 'innerhalb einer Woche',    audio: 'innerhalb einer Woche',    translation: 'в течение недели' }
      ]
    },
    {
      title: '💡 Genitiv в живой речи',
      body: 'В разговоре немцы часто заменяют Genitiv на <strong>von + Dativ</strong>:<br>' +
            '<em>das Auto <strong>von meinem</strong> Vater</em> = das Auto meines Vaters.<br><br>' +
            'С <strong>wegen</strong> в разговоре тоже часто Dativ: <em>wegen dem Regen</em> — но на экзамене пиши Genitiv!<br><br>' +
            'Имена получают просто <strong>-s</strong> без апострофа: <em>Annas Fahrrad, Peters Auto</em>.<br><br>' +
            'Устойчивое: <em><strong>meiner Meinung nach</strong></em> — по моему мнению.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Das ist das Auto',    blank: 'meines',   after: 'Vaters.',                     translation: '— Это машина моего отца.',              hintWord: 'meines',  hintRule: 'Genitiv m: mein → meines' },
      { before: '— Die Tasche',          blank: 'meiner',   after: 'Schwester ist rot.',          translation: '— Сумка моей сестры красная.',           hintWord: 'meiner',  hintRule: 'Genitiv f: mein → meiner' },
      { before: '—',                     blank: 'Wegen',    after: 'des Regens bleiben wir hier.', translation: '— Из-за дождя мы остаёмся здесь.',      hintWord: 'Wegen',   hintRule: 'из-за = wegen + Genitiv' },
      { before: '—',                     blank: 'Trotz',    after: 'des Wetters gehen wir raus.', translation: '— Несмотря на погоду, мы идём гулять.', hintWord: 'Trotz',   hintRule: 'несмотря на = trotz' },
      { before: '—',                     blank: 'Während',  after: 'der Arbeit telefoniere ich nicht.', translation: '— Во время работы я не звоню.',    hintWord: 'Während', hintRule: 'во время = während' },
      { before: '— Der Titel',           blank: 'des',      after: 'Buches ist lang.',            translation: '— Название книги длинное.',              hintWord: 'des',     hintRule: 'das Buch → des Buches' },
      { before: '— Das ist',             blank: 'Annas',    after: 'Fahrrad.',                    translation: '— Это велосипед Анны.',                  hintWord: 'Annas',   hintRule: 'имя + s, без апострофа' },
      { before: '— Innerhalb',           blank: 'einer',    after: 'Woche bekommen Sie eine Antwort.', translation: '— В течение недели вы получите ответ.', hintWord: 'einer', hintRule: 'Genitiv f: eine → einer' }
    ],

    multipleChoice: [
      { question: 'Genitiv отвечает на вопрос…',                       options: ['Wem?', 'Wen?', 'Wessen?', 'Wo?'],                                 correctIndex: 2 },
      { question: '«Из-за пробки» — …',                                options: ['wegen der Stau', 'wegen des Staus', 'wegen dem Staus', 'weil des Staus'], correctIndex: 1 },
      { question: 'Что получает -s/-es в Genitiv?',                    options: ['женский род', 'мужской и средний род', 'только Plural', 'все роды'], correctIndex: 1 },
      { question: '«Во время отпуска» — …',                            options: ['während des Urlaubs', 'während dem Urlaub', 'bei des Urlaubs', 'in des Urlaubs'], correctIndex: 0 },
      { question: 'Разговорная замена Genitiv…',                       options: ['zu + Dativ', 'von + Dativ', 'mit + Akkusativ', 'für + Genitiv'],  correctIndex: 1 },
      { question: '«trotz» значит…',                                   options: ['из-за', 'вместо', 'несмотря на', 'во время'],                     correctIndex: 2 },
      { question: '«Велосипед Петера» — …',                            options: ["Peter's Fahrrad", 'Peters Fahrrad', 'Fahrrad Peters der', 'des Peters Fahrrad'], correctIndex: 1 },
      { question: '«По моему мнению» — …',                             options: ['nach meiner Meinung nach', 'meiner Meinung nach', 'in meiner Meinung', 'für meine Meinung'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'wegen',              ru: 'из-за' },
      { id: 2, de: 'trotz',              ru: 'несмотря на' },
      { id: 3, de: 'während',            ru: 'во время' },
      { id: 4, de: 'statt',              ru: 'вместо' },
      { id: 5, de: 'innerhalb',          ru: 'в течение, внутри' },
      { id: 6, de: 'außerhalb',          ru: 'вне, за пределами' },
      { id: 7, de: 'des Vaters',         ru: 'отца (Genitiv)' },
      { id: 8, de: 'meiner Meinung nach', ru: 'по моему мнению' }
    ],

    dictation: [
      { word: 'wegen',       audio: 'wegen' },
      { word: 'trotz',       audio: 'trotz' },
      { word: 'während',     audio: 'während' },
      { word: 'innerhalb',   audio: 'innerhalb' },
      { word: 'Meinung',     audio: 'Meinung' },
      { word: 'Müdigkeit',   audio: 'Müdigkeit' },
      { word: 'Stau',        audio: 'Stau' },
      { word: 'Hälfte',      audio: 'Hälfte' }
    ]
  }
};
