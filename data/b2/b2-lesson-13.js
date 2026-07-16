/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-13.js
   B2 · Урок 13: Politik und Medien — политика и медиа
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-13',
  level:    'B2',
  unit:     13,
  title:    'Politik und Medien',
  subtitle: 'Политика и медиа · Konjunktiv I в новостях · Wahlen und Parteien',

  meta: {
    duration:  '40–45 мин',
    wordCount: 20,
    xpReward:  200
  },

  phrases: [
    { de: 'Die Bundestagswahl findet alle vier Jahre statt.',   ru: 'Выборы в Бундестаг проходят раз в четыре года.',   note: 'die Wahl — выборы', audio: 'Die Bundestagswahl findet alle vier Jahre statt' },
    { de: 'Die Regierung hat eine neue Reform beschlossen.',    ru: 'Правительство приняло новую реформу.',             note: 'beschließen — принять решение', audio: 'Die Regierung hat eine neue Reform beschlossen' },
    { de: 'Der Minister sagte, er sei über die Lage informiert.', ru: 'Министр сказал, что он проинформирован о ситуации.', note: 'Konjunktiv I: sei — косвенная речь', audio: 'Der Minister sagte, er sei über die Lage informiert' },
    { de: 'Laut Umfrage liegt die Partei bei zwanzig Prozent.', ru: 'Согласно опросу, партия набирает двадцать процентов.', note: 'die Umfrage — опрос', audio: 'Laut Umfrage liegt die Partei bei zwanzig Prozent' },
    { de: 'Die Opposition kritisiert den Gesetzentwurf scharf.', ru: 'Оппозиция резко критикует законопроект.',         note: 'der Gesetzentwurf — законопроект', audio: 'Die Opposition kritisiert den Gesetzentwurf scharf' },
    { de: 'Die Pressefreiheit ist ein Grundrecht in der Demokratie.', ru: 'Свобода прессы — основное право в демократии.', note: 'das Grundrecht — основное право', audio: 'Die Pressefreiheit ist ein Grundrecht in der Demokratie' },
    { de: 'Der Sprecher erklärte, man werde die Entscheidung prüfen.', ru: 'Пресс-секретарь заявил, что решение будет проверено.', note: 'Konjunktiv I: werde', audio: 'Der Sprecher erklärte, man werde die Entscheidung prüfen' },
    { de: 'Viele Bürger beteiligen sich an der Debatte über den Klimaschutz.', ru: 'Многие граждане участвуют в дебатах о защите климата.', note: 'sich beteiligen an + D', audio: 'Viele Bürger beteiligen sich an der Debatte über den Klimaschutz' },
    { de: 'Die Kanzlerin betonte, es gebe keinen Grund zur Sorge.', ru: 'Канцлер подчеркнула, что нет причин для беспокойства.', note: 'Konjunktiv I: gebe', audio: 'Die Kanzlerin betonte, es gebe keinen Grund zur Sorge' },
    { de: 'Das Parlament stimmt morgen über das Gesetz ab.',    ru: 'Парламент голосует по закону завтра.',             note: 'abstimmen über + A', audio: 'Das Parlament stimmt morgen über das Gesetz ab' },
    { de: 'Die Wahlbeteiligung lag bei über siebzig Prozent.',  ru: 'Явка на выборах составила более семидесяти процентов.', note: 'die Wahlbeteiligung — явка', audio: 'Die Wahlbeteiligung lag bei über siebzig Prozent' },
    { de: 'Jeder Bürger ab achtzehn Jahren ist wahlberechtigt.', ru: 'Каждый гражданин с восемнадцати лет имеет право голоса.', note: 'wahlberechtigt — имеющий право голоса', audio: 'Jeder Bürger ab achtzehn Jahren ist wahlberechtigt' },
    { de: 'Die Medien üben starken Einfluss auf die öffentliche Meinung aus.', ru: 'СМИ оказывают сильное влияние на общественное мнение.', note: 'Einfluss ausüben auf (урок 10!)', audio: 'Die Medien üben starken Einfluss auf die öffentliche Meinung aus' },
    { de: 'Er behauptet, die Zahlen seien manipuliert worden.', ru: 'Он утверждает, что цифры якобы были подтасованы.', note: 'Konj. I + Passiv Perfekt', audio: 'Er behauptet, die Zahlen seien manipuliert worden' },
    { de: 'Die Koalition besteht aus zwei Parteien.',           ru: 'Коалиция состоит из двух партий.',                 note: 'bestehen aus + D', audio: 'Die Koalition besteht aus zwei Parteien' },
    { de: 'In der Talkshow wurde heftig über die Steuerreform diskutiert.', ru: 'В ток-шоу бурно обсуждали налоговую реформу.', note: 'unpersönliches Passiv: wurde diskutiert', audio: 'In der Talkshow wurde heftig über die Steuerreform diskutiert' },
    { de: 'Der Skandal hat das Vertrauen der Wähler erschüttert.', ru: 'Скандал пошатнул доверие избирателей.',         note: 'das Vertrauen erschüttern', audio: 'Der Skandal hat das Vertrauen der Wähler erschüttert' },
    { de: 'Die Journalistin recherchiert seit Monaten zu diesem Thema.', ru: 'Журналистка уже несколько месяцев ведёт расследование по этой теме.', note: 'recherchieren zu + D', audio: 'Die Journalistin recherchiert seit Monaten zu diesem Thema' },
    { de: 'Man sollte Nachrichten aus mehreren Quellen vergleichen.', ru: 'Новости стоит сравнивать из нескольких источников.', note: 'die Quelle (B1-13!)', audio: 'Man sollte Nachrichten aus mehreren Quellen vergleichen' },
    { de: 'Die Demokratie lebt vom Engagement ihrer Bürger.',   ru: 'Демократия живёт благодаря активности своих граждан.', note: 'das Engagement [ангажемо́] — участие', audio: 'Die Demokratie lebt vom Engagement ihrer Bürger' }
  ],

  vocabulary: [
    { de: 'die Wahl',           ru: 'выборы',                     ipa: '[vaːl]',              article: 'die' },
    { de: 'die Regierung',      ru: 'правительство',              ipa: '[ʁeˈɡiːʁʊŋ]',        article: 'die' },
    { de: 'die Partei',         ru: 'партия',                     ipa: '[paʁˈtaɪ̯]',          article: 'die' },
    { de: 'die Opposition',     ru: 'оппозиция',                  ipa: '[ɔpozit͡si̯oːn]',     article: 'die' },
    { de: 'das Gesetz',         ru: 'закон',                      ipa: '[ɡəˈzɛt͡s]',          article: 'das' },
    { de: 'der Gesetzentwurf',  ru: 'законопроект',               ipa: '[ɡəˈzɛt͡sʔɛntvʊʁf]',  article: 'der' },
    { de: 'der Bürger',         ru: 'гражданин',                  ipa: '[ˈbʏʁɡɐ]',            article: 'der' },
    { de: 'der Wähler',         ru: 'избиратель',                 ipa: '[ˈvɛːlɐ]',            article: 'der' },
    { de: 'die Umfrage',        ru: 'опрос',                      ipa: '[ˈʊmfʁaːɡə]',         article: 'die' },
    { de: 'die Pressefreiheit', ru: 'свобода прессы',             ipa: '[ˈpʁɛsəfʁaɪ̯haɪ̯t]',  article: 'die' },
    { de: 'das Grundrecht',     ru: 'основное право',             ipa: '[ˈɡʁʊntʁɛçt]',        article: 'das' },
    { de: 'abstimmen über',     ru: 'голосовать по (+A)',         ipa: '[ˈapʃtɪmən]',         article: '' },
    { de: 'beschließen',        ru: 'принимать (решение, закон)', ipa: '[bəˈʃliːsn̩]',        article: '' },
    { de: 'kritisieren',        ru: 'критиковать',                ipa: '[kʁitiˈziːʁən]',      article: '' },
    { de: 'betonen',            ru: 'подчёркивать',               ipa: '[bəˈtoːnən]',         article: '' },
    { de: 'recherchieren',      ru: 'расследовать, собирать данные', ipa: '[ʁeʃɛʁˈʃiːʁən]',  article: '' },
    { de: 'das Vertrauen',      ru: 'доверие',                    ipa: '[fɛʁˈtʁaʊ̯ən]',       article: 'das' },
    { de: 'erschüttern',        ru: 'пошатнуть, потрясти',        ipa: '[ɛʁˈʃʏtɐn]',          article: '' },
    { de: 'sich beteiligen an', ru: 'участвовать в (+D)',         ipa: '[bəˈtaɪ̯lɪɡn̩]',      article: '' },
    { de: 'die Steuer',         ru: 'налог',                      ipa: '[ˈʃtɔɪ̯ɐ]',           article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Konjunktiv I — язык новостей',
      body: 'В новостях чужие слова передают через <strong>Konjunktiv I</strong> — так журналист показывает: «это не мои слова, я только цитирую»:<br><br>' +
            '<em>Der Minister sagte, er <strong>sei</strong> informiert.</em> (≠ er ist)<br>' +
            '<em>Sie betonte, es <strong>gebe</strong> keinen Grund zur Sorge.</em> (≠ es gibt)<br><br>' +
            'Образование: основа глагола + -e: <em>er hab<strong>e</strong>, er komm<strong>e</strong>, er werd<strong>e</strong></em>. Особый глагол — sein: <em>ich sei, er sei, sie seien</em>.',
      conjugation: [
        { pronoun: 'sein',    form: 'Er sagte, er sei krank.',           audio: 'Er sagte, er sei krank',           translation: 'Он сказал, что (якобы) болен.' },
        { pronoun: 'haben',   form: 'Sie sagte, sie habe keine Zeit.',   audio: 'Sie sagte, sie habe keine Zeit',   translation: 'Она сказала, что у неё нет времени.' },
        { pronoun: 'geben',   form: 'Es gebe keinen Grund zur Sorge.',   audio: 'Es gebe keinen Grund zur Sorge',   translation: 'Причин для беспокойства (якобы) нет.' },
        { pronoun: 'werden',  form: 'Man werde das Gesetz prüfen.',      audio: 'Man werde das Gesetz prüfen',      translation: 'Закон (по их словам) проверят.' },
        { pronoun: 'Perfekt', form: 'Er sagte, er habe nichts gewusst.', audio: 'Er sagte, er habe nichts gewusst', translation: 'Он сказал, что ничего не знал.' }
      ]
    },
    {
      title: '⚡ Политическая система Германии — базовый словарь',
      body: 'Минимум для чтения новостей:<br><br>' +
            '<strong>der Bundestag</strong> — парламент; выборы (<em>die Bundestagswahl</em>) — раз в 4 года<br>' +
            '<strong>der Bundeskanzler / die Bundeskanzlerin</strong> — глава правительства<br>' +
            '<strong>der Bundespräsident</strong> — президент (представительская роль!)<br>' +
            '<strong>die Koalition</strong> — коалиция: правительство обычно формируют 2–3 партии<br>' +
            '<strong>das Bundesland</strong> — федеральная земля (их 16)',
      conjugation: [
        { pronoun: 'парламент', form: 'der Bundestag',              audio: 'der Bundestag',              translation: 'Бундестаг' },
        { pronoun: 'канцлер',   form: 'der Bundeskanzler',          audio: 'der Bundeskanzler',          translation: 'федеральный канцлер' },
        { pronoun: 'земля',     form: 'das Bundesland',             audio: 'das Bundesland',             translation: 'федеральная земля' },
        { pronoun: 'выборы',    form: 'Die Wahl findet statt.',     audio: 'Die Wahl findet statt',      translation: 'Выборы состоятся.' },
        { pronoun: 'голосовать', form: 'über das Gesetz abstimmen', audio: 'über das Gesetz abstimmen',  translation: 'голосовать по закону' }
      ]
    },
    {
      title: '💡 Критическое чтение новостей',
      body: 'Konjunktiv I — сигнал: <strong>утверждение не проверено</strong>. Сравни:<br><br>' +
            '<em>Die Zahlen <strong>wurden</strong> manipuliert.</em> — факт (Indikativ).<br>' +
            '<em>Die Zahlen <strong>seien</strong> manipuliert worden.</em> — так кто-то утверждает.<br><br>' +
            'Другие маркеры дистанции: <strong>angeblich</strong> (якобы), <strong>laut + Quelle</strong> (согласно источнику), <strong>sollen</strong> (урок 9: <em>Er soll…</em> — говорят).<br><br>' +
            'Правило B2: увидел Konjunktiv I в новости — спроси себя, кто источник.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Die Bundestagswahl findet alle vier Jahre', blank: 'statt', after: '.',          translation: '— Выборы в Бундестаг проходят раз в 4 года.', hintWord: 'statt', hintRule: 'stattfinden — приставка в конец' },
      { before: '— Er sagte, er',        blank: 'sei',       after: 'informiert.',                  translation: '— Он сказал, что проинформирован.',        hintWord: 'sei',     hintRule: 'Konjunktiv I от sein' },
      { before: '— Sie betonte, es',     blank: 'gebe',      after: 'keinen Grund zur Sorge.',      translation: '— Она подчеркнула: причин для тревоги нет.', hintWord: 'gebe',  hintRule: 'Konjunktiv I от geben' },
      { before: '— Das Parlament stimmt', blank: 'über',     after: 'das Gesetz ab.',               translation: '— Парламент голосует по закону.',           hintWord: 'über',    hintRule: 'abstimmen über + Akk.' },
      { before: '— Laut',                blank: 'Umfrage',   after: 'liegt die Partei bei 20 %.',   translation: '— Согласно опросу, у партии 20 %.',         hintWord: 'Umfrage', hintRule: 'опрос = die Umfrage' },
      { before: '— Die Koalition besteht', blank: 'aus',     after: 'zwei Parteien.',               translation: '— Коалиция состоит из двух партий.',        hintWord: 'aus',     hintRule: 'bestehen aus + Dativ' },
      { before: '— Viele Bürger beteiligen sich', blank: 'an', after: 'der Debatte.',               translation: '— Многие граждане участвуют в дебатах.',    hintWord: 'an',      hintRule: 'sich beteiligen an + Dativ' },
      { before: '— Der Skandal hat das', blank: 'Vertrauen', after: 'der Wähler erschüttert.',      translation: '— Скандал пошатнул доверие избирателей.',   hintWord: 'Vertrauen', hintRule: 'доверие = das Vertrauen' }
    ],

    multipleChoice: [
      { question: 'Konjunktiv I в новостях сигнализирует…',            options: ['приказ', 'цитирование чужих слов', 'будущее время', 'вежливость'], correctIndex: 1 },
      { question: 'Konjunktiv I от «sein» (er)…',                      options: ['wäre', 'sei', 'ist', 'war'],                                       correctIndex: 1 },
      { question: 'Выборы в Бундестаг проходят…',                      options: ['каждый год', 'раз в 4 года', 'раз в 5 лет', 'раз в 2 года'],       correctIndex: 1 },
      { question: 'Глава правительства Германии — …',                  options: ['der Bundespräsident', 'der Bundeskanzler', 'der Bürgermeister', 'der Minister'], correctIndex: 1 },
      { question: '«голосовать по закону» — …',                        options: ['über das Gesetz abstimmen', 'für das Gesetz wählen', 'das Gesetz stimmen', 'zum Gesetz voten'], correctIndex: 0 },
      { question: '«die Wahlbeteiligung» — это…',                      options: ['результат выборов', 'явка избирателей', 'предвыборная кампания', 'подсчёт голосов'], correctIndex: 1 },
      { question: '«законопроект» — …',                                options: ['das Gesetzbuch', 'der Gesetzentwurf', 'die Gesetzgebung', 'der Gesetzplan'], correctIndex: 1 },
      { question: 'Федеральных земель в Германии…',                    options: ['12', '14', '16', '18'],                                            correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'die Regierung',       ru: 'правительство' },
      { id: 2, de: 'die Wahl',            ru: 'выборы' },
      { id: 3, de: 'der Wähler',          ru: 'избиратель' },
      { id: 4, de: 'das Gesetz',          ru: 'закон' },
      { id: 5, de: 'die Umfrage',         ru: 'опрос' },
      { id: 6, de: 'das Vertrauen',       ru: 'доверие' },
      { id: 7, de: 'die Pressefreiheit',  ru: 'свобода прессы' },
      { id: 8, de: 'die Steuer',          ru: 'налог' }
    ],

    dictation: [
      { word: 'Regierung',      audio: 'Regierung' },
      { word: 'Bundestag',      audio: 'Bundestag' },
      { word: 'Opposition',     audio: 'Opposition' },
      { word: 'Gesetzentwurf',  audio: 'Gesetzentwurf' },
      { word: 'Umfrage',        audio: 'Umfrage' },
      { word: 'Vertrauen',      audio: 'Vertrauen' },
      { word: 'recherchieren',  audio: 'recherchieren' },
      { word: 'Pressefreiheit', audio: 'Pressefreiheit' }
    ]
  }
};
