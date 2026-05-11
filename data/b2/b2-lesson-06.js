/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-06.js
   B2 · Урок 6: Wirtschaft und Gesellschaft — Экономика и общество
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-06',
  level:    'B2',
  unit:     6,
  title:    'Wirtschaft und Gesellschaft',
  subtitle: 'Экономика и общество · Konjunktur, Globalisierung, Soziales',

  meta: {
    duration:  '40–45 мин',
    wordCount: 26,
    xpReward:  200
  },

  phrases: [
    { de: 'Die Wirtschaft wächst um 2 Prozent.',               ru: 'Экономика растёт на 2 процента.',                note: 'wachsen — расти', audio: 'Die Wirtschaft wächst um 2 Prozent' },
    { de: 'Die Inflation ist gestiegen.',                       ru: 'Инфляция выросла.',                             note: 'die Inflation — инфляция; steigen — расти', audio: 'Die Inflation ist gestiegen' },
    { de: 'Die Arbeitslosigkeit ist auf einem Tiefstand.',      ru: 'Безработица на минимальном уровне.',            note: 'die Arbeitslosigkeit — безработица', audio: 'Die Arbeitslosigkeit ist auf einem Tiefstand' },
    { de: 'Der Wohlstand hat sich verbessert.',                 ru: 'Благосостояние улучшилось.',                    note: 'der Wohlstand — благосостояние', audio: 'Der Wohlstand hat sich verbessert' },
    { de: 'Die Globalisierung hat Vor- und Nachteile.',         ru: 'Глобализация имеет плюсы и минусы.',            note: 'die Globalisierung — глобализация', audio: 'Die Globalisierung hat Vor- und Nachteile' },
    { de: 'Das Bruttoinlandsprodukt ist gesunken.',             ru: 'Валовой внутренний продукт снизился.',          note: 'das BIP — ВВП', audio: 'Das Bruttoinlandsprodukt ist gesunken' },
    { de: 'Die soziale Ungleichheit nimmt zu.',                 ru: 'Социальное неравенство растёт.',                note: 'zunehmen — возрастать', audio: 'Die soziale Ungleichheit nimmt zu' },
    { de: 'Die Regierung hat Maßnahmen ergriffen.',            ru: 'Правительство приняло меры.',                   note: 'Maßnahmen ergreifen — принять меры', audio: 'Die Regierung hat Maßnahmen ergriffen' },
    { de: 'Der Mindestlohn wurde erhöht.',                      ru: 'Минимальная заработная плата была повышена.',  note: 'der Mindestlohn — минимальная зарплата', audio: 'Der Mindestlohn wurde erhöht' },
    { de: 'Die Schere zwischen Arm und Reich wächst.',          ru: 'Разрыв между богатыми и бедными растёт.',      note: 'die Schere — ножницы, разрыв', audio: 'Die Schere zwischen Arm und Reich wächst' },
    { de: 'Der Fachkräftemangel ist ein großes Problem.',       ru: 'Нехватка квалифицированных кадров — большая проблема.', note: 'der Fachkräftemangel — дефицит специалистов', audio: 'Der Fachkräftemangel ist ein großes Problem' },
    { de: 'Der Konsum steigt in der Vorweihnachtszeit.',        ru: 'Потребление растёт в предрождественское время.', note: 'der Konsum — потребление', audio: 'Der Konsum steigt in der Vorweihnachtszeit' },
    { de: 'Die Digitalisierung verändert die Arbeitswelt.',     ru: 'Цифровизация меняет мир труда.',               note: 'die Digitalisierung — цифровизация', audio: 'Die Digitalisierung verändert die Arbeitswelt' },
    { de: 'Das soziale Sicherungsnetz schützt Schwächere.',     ru: 'Система социальной защиты защищает слабых.',   note: 'das Sicherungsnetz — сеть безопасности', audio: 'Das soziale Sicherungsnetz schützt Schwächere' },
    { de: 'Steuern finanzieren öffentliche Leistungen.',        ru: 'Налоги финансируют общественные услуги.',      note: 'die Steuer — налог', audio: 'Steuern finanzieren öffentliche Leistungen' },
    { de: 'Die Nachfrage übersteigt das Angebot.',              ru: 'Спрос превышает предложение.',                 note: 'die Nachfrage / das Angebot — спрос / предложение', audio: 'Die Nachfrage übersteigt das Angebot' },
    { de: 'Auf dem Schwarzmarkt werden Waren gehandelt.',       ru: 'На чёрном рынке торгуют товарами.',            note: 'der Schwarzmarkt — чёрный рынок; handeln — торговать', audio: 'Auf dem Schwarzmarkt werden Waren gehandelt' },
    { de: 'Der Exportüberschuss ist ein Zeichen von Stärke.',   ru: 'Положительное сальдо торгового баланса — признак силы.', note: 'der Exportüberschuss — положит. сальдо экспорта', audio: 'Der Exportüberschuss ist ein Zeichen von Stärke' },
    { de: 'Nachhaltiges Wirtschaften ist zukunftsweisend.',     ru: 'Устойчивое ведение хозяйства указывает на будущее.', note: 'nachhaltig wirtschaften — вести устойчивое хозяйство', audio: 'Nachhaltiges Wirtschaften ist zukunftsweisend' },
    { de: 'Investitionen in Bildung zahlen sich aus.',          ru: 'Инвестиции в образование окупаются.',           note: 'sich auszahlen — окупаться', audio: 'Investitionen in Bildung zahlen sich aus' },
    { de: 'Die Konjunktur befindet sich im Aufschwung.',        ru: 'Конъюнктура находится на подъёме.',            note: 'der Aufschwung — подъём; die Konjunktur — конъюнктура', audio: 'Die Konjunktur befindet sich im Aufschwung' },
    { de: 'Das Haushaltsdefizit muss abgebaut werden.',         ru: 'Бюджетный дефицит должен быть сокращён.',      note: 'das Defizit — дефицит; abbauen — сокращать', audio: 'Das Haushaltsdefizit muss abgebaut werden' },
    { de: 'Die Integration von Migranten ist eine Aufgabe.',    ru: 'Интеграция мигрантов — это задача.',           note: 'die Integration — интеграция', audio: 'Die Integration von Migranten ist eine Aufgabe' },
    { de: 'Bildung ist der Schlüssel zum sozialen Aufstieg.',   ru: 'Образование — ключ к социальному росту.',      note: 'der soziale Aufstieg — социальный рост', audio: 'Bildung ist der Schlüssel zum sozialen Aufstieg' }
  ],

  vocabulary: [
    { de: 'die Wirtschaft',       ru: 'экономика',                ipa: '[ˈvɪʁtʃaft]',         article: 'die' },
    { de: 'die Inflation',        ru: 'инфляция',                 ipa: '[ɪnflaˈtsi̯oːn]',      article: 'die' },
    { de: 'die Arbeitslosigkeit', ru: 'безработица',              ipa: '[ˈaʁbaɪ̯tsˌloːzɪçkaɪ̯t]', article: 'die' },
    { de: 'der Wohlstand',        ru: 'благосостояние',           ipa: '[ˈvoːlʃtant]',         article: 'der' },
    { de: 'die Globalisierung',   ru: 'глобализация',             ipa: '[ɡloːbalizˈiːʁʊŋ]',   article: 'die' },
    { de: 'das BIP',              ru: 'ВВП (Bruttoinlandsprodukt)', ipa: '[beː ʔiː ˈpeː]',     article: 'das' },
    { de: 'die Ungleichheit',     ru: 'неравенство',              ipa: '[ˈʊnɡlaɪ̯çhaɪ̯t]',     article: 'die' },
    { de: 'die Maßnahme',         ru: 'мера, мероприятие',        ipa: '[ˈmaːsˌnaːmə]',        article: 'die' },
    { de: 'der Mindestlohn',      ru: 'минимальная зарплата',     ipa: '[ˈmɪndəstˌloːn]',     article: 'der' },
    { de: 'der Fachkräftemangel', ru: 'нехватка специалистов',   ipa: '[ˈfaxkʁɛftəˌmaŋl̩]',  article: 'der' },
    { de: 'die Digitalisierung',  ru: 'цифровизация',             ipa: '[dɪɡitalizˈiːʁʊŋ]',   article: 'die' },
    { de: 'die Steuer',           ru: 'налог',                    ipa: '[ˈʃtɔɪ̯ɐ]',            article: 'die' },
    { de: 'die Nachfrage',        ru: 'спрос',                    ipa: '[ˈnaːxˌfʁaːɡə]',      article: 'die' },
    { de: 'das Angebot',          ru: 'предложение',              ipa: '[ˈanɡəboːt]',          article: 'das' },
    { de: 'die Konjunktur',       ru: 'конъюнктура',              ipa: '[kɔnjʊŋkˈtuːɐ̯]',      article: 'die' },
    { de: 'der Aufschwung',       ru: 'подъём (экон.)',           ipa: '[ˈaʊ̯fˌʃvʊŋ]',         article: 'der' },
    { de: 'das Defizit',          ru: 'дефицит',                  ipa: '[ˈdeːfitsɪt]',         article: 'das' },
    { de: 'die Integration',      ru: 'интеграция',               ipa: '[ɪntɛɡʁaˈtsi̯oːn]',    article: 'die' },
    { de: 'investieren',          ru: 'инвестировать',            ipa: '[ɪnvɛsˈtiːʁən]',       article: '' },
    { de: 'sich auszahlen',       ru: 'окупаться',                ipa: '[ˈaʊ̯sˌtsaːlən]',      article: '' },
    { de: 'übersteigen',          ru: 'превышать',                ipa: '[ˌyːbɐˈʃtaɪ̯ɡn̩]',     article: '' },
    { de: 'zunehmen',             ru: 'возрастать',               ipa: '[ˈtsuːˌneːmən]',       article: '' },
    { de: 'der Exportüberschuss', ru: 'положительное сальдо',     ipa: '[ɛksˈpɔʁtˌyːbɐʃʊs]',  article: 'der' },
    { de: 'der Aufstieg',         ru: 'рост, подъём',             ipa: '[ˈaʊ̯fˌʃtiːk]',        article: 'der' },
    { de: 'der Schwarzmarkt',     ru: 'чёрный рынок',             ipa: '[ˈʃvaʁtsˌmaʁkt]',     article: 'der' },
    { de: 'nachhaltig',           ru: 'устойчивый',               ipa: '[ˈnaːxˌhaltɪç]',      article: '' }
  ],

  grammar: [
    {
      title: '⚡ Экономический Nominalstil и генитив',
      body: 'В текстах об экономике особенно часто встречается <strong>генитивная конструкция</strong>:<br><br>' +
            '<em>Das <strong>Wachstum der Wirtschaft</strong> = Die Wirtschaft wächst.</em><br>' +
            '<em>Der <strong>Anstieg der Inflation</strong> = Die Inflation ist gestiegen.</em><br>' +
            '<em>Die <strong>Steigerung des Mindestlohns</strong> = Der Mindestlohn wurde erhöht.</em><br><br>' +
            'Такие конструкции компактнее и стилистически более формальны. Типичная структура:<br>' +
            '<strong>der/die/das + [номинализация] + [генитив]</strong>',
      conjugation: [
        { pronoun: 'wachsen',     form: 'das Wachstum + Gen.',     audio: 'das Wirtschaftswachstum', translation: 'экономический рост' },
        { pronoun: 'sinken',      form: 'der Rückgang + Gen.',     audio: 'der Rückgang des BIP',    translation: 'падение ВВП' },
        { pronoun: 'steigen',     form: 'der Anstieg + Gen.',      audio: 'der Anstieg der Inflation', translation: 'рост инфляции' },
        { pronoun: 'investieren', form: 'die Investition + in',    audio: 'Investition in Bildung',  translation: 'инвестиции в образование' },
        { pronoun: 'reduzieren',  form: 'die Reduzierung + Gen.',  audio: 'die Reduzierung des Defizits', translation: 'сокращение дефицита' },
        { pronoun: 'integrieren', form: 'die Integration + von',   audio: 'die Integration von Migranten', translation: 'интеграция мигрантов' }
      ]
    },
    {
      title: '💡 Лексика спроса и предложения',
      body: '<strong>Angebot und Nachfrage</strong> (спрос и предложение):<br><br>' +
            '<em>Die Nachfrage <strong>übersteigt</strong> das Angebot.</em> — Спрос превышает предложение.<br>' +
            '<em>Das Angebot <strong>übersteigt</strong> die Nachfrage.</em> — Предложение превышает спрос.<br><br>' +
            '<strong>Конъюнктурные глаголы:</strong><br>' +
            'wachsen, steigen, zunehmen → рост<br>' +
            'sinken, fallen, abnehmen → падение<br>' +
            'sich stabilisieren → стабилизироваться<br>' +
            'sich erholen → восстанавливаться'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Die Wirtschaft',   blank: 'wächst',        after: 'um 2 Prozent.',            translation: '— Экономика растёт на 2 процента.',      hintWord: 'wächst',        hintRule: 'wachsen → wächst (3 л. ед.ч.)' },
      { before: '— Die',              blank: 'Inflation',      after: 'ist gestiegen.',           translation: '— Инфляция выросла.',                    hintWord: 'Inflation',     hintRule: 'die Inflation — инфляция' },
      { before: '— Der',              blank: 'Mindestlohn',    after: 'wurde erhöht.',            translation: '— Минимальная зарплата была повышена.',  hintWord: 'Mindestlohn',   hintRule: 'der Mindestlohn — минимальная зарплата' },
      { before: '— Die Nachfrage',    blank: 'übersteigt',     after: 'das Angebot.',             translation: '— Спрос превышает предложение.',         hintWord: 'übersteigt',    hintRule: 'übersteigen → übersteigt' },
      { before: '— Die soziale Ungleichheit nimmt',  blank: 'zu',  after: '.',                   translation: '— Социальное неравенство растёт.',       hintWord: 'zu',            hintRule: 'zunehmen → nimmt zu (отделяемый)' },
      { before: '— Die',              blank: 'Digitalisierung', after: 'verändert die Arbeitswelt.', translation: '— Цифровизация меняет мир труда.',   hintWord: 'Digitalisierung', hintRule: 'die Digitalisierung — цифровизация' },
      { before: '— Investitionen in Bildung zahlen sich', blank: 'aus', after: '.', translation: '— Инвестиции в образование окупаются.',    hintWord: 'aus',           hintRule: 'sich auszahlen — окупаться' },
      { before: '— Die Konjunktur befindet sich im', blank: 'Aufschwung', after: '.', translation: '— Конъюнктура на подъёме.',             hintWord: 'Aufschwung',    hintRule: 'der Aufschwung — подъём' }
    ],

    multipleChoice: [
      { question: '«Die Inflation» означает…',                             options: ['занятость', 'инфляция', 'налог', 'безработица'],                    correctIndex: 1 },
      { question: '«Das BIP» = …',                                          options: ['ВВП', 'НДС', 'ВНП', 'налог'],                                       correctIndex: 0 },
      { question: '«Die Nachfrage übersteigt das Angebot» значит…',        options: ['Предложение > спрос', 'Спрос > предложение', 'Спрос = предложение', 'Ни то ни другое'], correctIndex: 1 },
      { question: '«Der Mindestlohn» — это…',                               options: ['максимальная зарплата', 'минимальная зарплата', 'средняя зарплата', 'налог'], correctIndex: 1 },
      { question: '«Zunehmen» в контексте — это…',                          options: ['убывать', 'возрастать', 'стабилизироваться', 'исчезать'],           correctIndex: 1 },
      { question: '«Der Fachkräftemangel» — это…',                          options: ['нехватка специалистов', 'избыток кадров', 'рост зарплат', 'кризис'], correctIndex: 0 },
      { question: '«Sich auszahlen» значит…',                               options: ['выплачивать', 'окупаться', 'расплачиваться', 'зарабатывать'],       correctIndex: 1 },
      { question: '«Der Aufschwung» — это…',                                options: ['спад', 'подъём', 'стагнация', 'дефицит'],                           correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Wirtschaft',    ru: 'экономика' },
      { id: 2, de: 'die Inflation',     ru: 'инфляция' },
      { id: 3, de: 'der Wohlstand',     ru: 'благосостояние' },
      { id: 4, de: 'die Nachfrage',     ru: 'спрос' },
      { id: 5, de: 'das Angebot',       ru: 'предложение' },
      { id: 6, de: 'der Mindestlohn',   ru: 'минимальная зарплата' },
      { id: 7, de: 'die Steuer',        ru: 'налог' },
      { id: 8, de: 'der Aufschwung',    ru: 'подъём (экон.)' }
    ],

    dictation: [
      { word: 'Wirtschaft',      audio: 'Wirtschaft' },
      { word: 'Inflation',       audio: 'Inflation' },
      { word: 'Mindestlohn',     audio: 'Mindestlohn' },
      { word: 'Globalisierung',  audio: 'Globalisierung' },
      { word: 'Digitalisierung', audio: 'Digitalisierung' },
      { word: 'Konjunktur',      audio: 'Konjunktur' },
      { word: 'Nachfrage',       audio: 'Nachfrage' },
      { word: 'Fachkräftemangel', audio: 'Fachkräftemangel' }
    ]
  }
};
