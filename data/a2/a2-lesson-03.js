/* ═══════════════════════════════════════════════
   data/a2-lesson-03.js
   A2 · Урок 3: Beim Arzt — У врача
                Части тела · датив · конструкция «mir tut … weh»
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-03',
  level: 'A2',
  unit:  3,
  title: 'Beim Arzt',
  subtitle: 'У врача · части тела · датив',

  meta: {
    duration: '30–35 мин',
    wordCount: 26,
    xpReward: 120
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Wie geht es dir?',                      ru: 'Как ты себя чувствуешь?',                   note: 'dir = тебе (датив)', audio: 'Wie geht es dir' },
    { de: 'Mir geht es nicht gut.',                ru: 'Мне нехорошо.',                             note: 'mir = мне. Безличная конструкция', audio: 'Mir geht es nicht gut' },
    { de: 'Ich bin krank.',                        ru: 'Я болен.',                                  note: 'krank — больной (без артикля после sein)', audio: 'Ich bin krank' },
    { de: 'Ich fühle mich schlecht.',              ru: 'Я плохо себя чувствую.',                    note: 'sich fühlen — возвратный глагол', audio: 'Ich fühle mich schlecht' },
    { de: 'Was tut dir weh?',                      ru: 'Что у тебя болит?',                         note: 'weh tun + Dat. = причинять боль кому-то', audio: 'Was tut dir weh' },
    { de: 'Mir tut der Kopf weh.',                 ru: 'У меня болит голова.',                      note: 'дословно: «голова мне причиняет боль»', audio: 'Mir tut der Kopf weh' },
    { de: 'Ich habe Kopfschmerzen.',               ru: 'У меня головная боль.',                     note: 'Schmerzen — мн.ч. die Schmerzen', audio: 'Ich habe Kopfschmerzen' },
    { de: 'Mein Bauch tut weh.',                   ru: 'У меня болит живот.',                       note: 'Альтернативный вариант — без датива', audio: 'Mein Bauch tut weh' },
    { de: 'Ich habe Fieber.',                      ru: 'У меня температура.',                       note: 'das Fieber — жар, температура', audio: 'Ich habe Fieber' },
    { de: 'Ich habe Husten und Schnupfen.',        ru: 'У меня кашель и насморк.',                  note: 'der Husten, der Schnupfen', audio: 'Ich habe Husten und Schnupfen' },
    { de: 'Ich brauche einen Termin.',             ru: 'Мне нужна запись (на приём).',              note: 'einen Termin brauchen / haben', audio: 'Ich brauche einen Termin' },
    { de: 'Können Sie mir helfen?',                ru: 'Вы можете мне помочь?',                     note: 'helfen + Dat. (mir, dir, ihm…)', audio: 'Können Sie mir helfen' },
    { de: 'Der Arzt verschreibt mir Medikamente.', ru: 'Врач выписывает мне лекарства.',            note: 'verschreiben + Dat. + Akk.', audio: 'Der Arzt verschreibt mir Medikamente' },
    { de: 'Nehmen Sie diese Tabletten dreimal täglich.', ru: 'Принимайте эти таблетки три раза в день.', note: 'dreimal täglich = трижды в день', audio: 'Nehmen Sie diese Tabletten dreimal täglich' },
    { de: 'Gute Besserung!',                       ru: 'Поправляйся! / Выздоравливай!',             note: 'die Besserung — улучшение. Стандартное пожелание', audio: 'Gute Besserung' },
    { de: 'Ich gehe zum Arzt.',                    ru: 'Я иду к врачу.',                            note: 'zu + dem → zum (Dat., направление к человеку)', audio: 'Ich gehe zum Arzt' },
    { de: 'Ich gehe in die Apotheke.',             ru: 'Я иду в аптеку.',                           note: 'die Apotheke; in + Akk. = направление', audio: 'Ich gehe in die Apotheke' },
    { de: 'Mein Hals tut weh.',                    ru: 'У меня болит горло.',                       note: 'der Hals — горло / шея', audio: 'Mein Hals tut weh' },
    { de: 'Wo tut es weh?',                        ru: 'Где болит?',                                note: 'безличное «es» — у врача', audio: 'Wo tut es weh' },
    { de: 'Seit wann haben Sie diese Schmerzen?',  ru: 'С каких пор у Вас эти боли?',               note: 'seit + Dat. = с (момента времени)', audio: 'Seit wann haben Sie diese Schmerzen' },
    { de: 'Seit drei Tagen.',                      ru: 'Три дня уже.',                              note: 'seit + Dat.Pl. → drei Tagen (-n)!', audio: 'Seit drei Tagen' },
    { de: 'Trinken Sie viel Wasser!',              ru: 'Пейте много воды!',                         note: 'Imperativ для Sie — форма как у инф.', audio: 'Trinken Sie viel Wasser' },
    { de: 'Ich gebe dir eine Tablette.',           ru: 'Я дам тебе таблетку.',                      note: 'geben + Dat. + Akk. (кому — что)', audio: 'Ich gebe dir eine Tablette' },
    { de: 'Das tut mir weh.',                      ru: 'Мне это больно.',                           note: 'универсальная фраза', audio: 'Das tut mir weh' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Kopf',         ru: 'голова',               ipa: '[kɔpf]',              article: 'der' },
    { de: 'der Hals',         ru: 'горло, шея',           ipa: '[hals]',              article: 'der' },
    { de: 'der Bauch',        ru: 'живот',                ipa: '[baʊ̯x]',             article: 'der' },
    { de: 'der Rücken',       ru: 'спина',                ipa: '[ˈʁʏkn̩]',            article: 'der' },
    { de: 'das Bein',         ru: 'нога',                 ipa: '[baɪ̯n]',             article: 'das' },
    { de: 'der Arm',          ru: 'рука (от плеча)',      ipa: '[aʁm]',               article: 'der' },
    { de: 'die Hand',         ru: 'кисть руки',           ipa: '[hant]',              article: 'die' },
    { de: 'der Fuß',          ru: 'ступня',               ipa: '[fuːs]',              article: 'der' },
    { de: 'das Auge',         ru: 'глаз',                 ipa: '[ˈaʊ̯ɡə]',            article: 'das' },
    { de: 'das Ohr',          ru: 'ухо',                  ipa: '[oːɐ̯]',              article: 'das' },
    { de: 'der Zahn',         ru: 'зуб',                  ipa: '[tsaːn]',             article: 'der' },
    { de: 'der Arzt',         ru: 'врач (м.)',            ipa: '[aːɐ̯tst]',           article: 'der' },
    { de: 'die Ärztin',       ru: 'врач (ж.)',            ipa: '[ˈɛːɐ̯tstɪn]',        article: 'die' },
    { de: 'die Apotheke',     ru: 'аптека',               ipa: '[apoˈteːkə]',         article: 'die' },
    { de: 'der Termin',       ru: 'запись на приём',      ipa: '[tɛʁˈmiːn]',          article: 'der' },
    { de: 'die Tablette',     ru: 'таблетка',             ipa: '[taˈblɛtə]',          article: 'die' },
    { de: 'das Medikament',   ru: 'лекарство',            ipa: '[medikaˈmɛnt]',       article: 'das' },
    { de: 'das Fieber',       ru: 'температура',          ipa: '[ˈfiːbɐ]',            article: 'das' },
    { de: 'der Husten',       ru: 'кашель',               ipa: '[ˈhuːstn̩]',          article: 'der' },
    { de: 'der Schnupfen',    ru: 'насморк',              ipa: '[ˈʃnʊpfn̩]',          article: 'der' },
    { de: 'die Schmerzen',    ru: 'боль (мн.ч.)',         ipa: '[ˈʃmɛʁtsn̩]',         article: 'die' },
    { de: 'krank',            ru: 'больной',              ipa: '[kʁaŋk]',             article: '' },
    { de: 'gesund',           ru: 'здоровый',             ipa: '[ɡəˈzʊnt]',           article: '' },
    { de: 'weh tun',          ru: 'болеть, причин. боль', ipa: '[veː tuːn]',          article: '' },
    { de: 'helfen',           ru: 'помогать',             ipa: '[ˈhɛlfn̩]',           article: '' },
    { de: 'die Besserung',    ru: 'выздоровление',        ipa: '[ˈbɛsəʁʊŋ]',          article: 'die' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Датив (Dativ) — третий падеж: «кому? чему?»',
      body: 'Датив отвечает на вопрос <strong>«кому?» / «чему?»</strong>. Используется, когда действие <strong>направлено на адресата</strong>:<br><br>' +
            '<em>Ich gebe <strong>dem Kind</strong> ein Buch.</em> — Я даю ребёнку книгу.<br>' +
            '<em>Der Arzt hilft <strong>der Frau</strong>.</em> — Врач помогает женщине.<br><br>' +
            'Артикли в дативе меняются — это надо запомнить:',
      conjugation: [
        { pronoun: 'м.р. (der)',  form: 'dem',  audio: 'dem Mann',   translation: 'мужчине, мальчику' },
        { pronoun: 'ж.р. (die)',  form: 'der',  audio: 'der Frau',   translation: 'женщине' },
        { pronoun: 'ср.р. (das)', form: 'dem',  audio: 'dem Kind',   translation: 'ребёнку' },
        { pronoun: 'мн.ч. (die)', form: 'den',  audio: 'den Leuten', translation: 'людям (+ -n у сущ.!)' },
        { pronoun: 'a/an + м/с',  form: 'einem', audio: 'einem Mann', translation: 'какому-то мужчине' },
        { pronoun: 'eine + ж.р.', form: 'einer', audio: 'einer Frau', translation: 'какой-то женщине' }
      ]
    },
    {
      title: '⚡ Личные местоимения в дативе',
      body: 'Местоимения в дативе используются <strong>постоянно</strong> — в фразах вежливости, при просьбах, описании самочувствия:<br><br>' +
            '<em><strong>Mir</strong> geht es gut.</em> — У меня всё хорошо.<br>' +
            '<em>Kannst du <strong>mir</strong> helfen?</em> — Можешь мне помочь?<br>' +
            '<em>Was tut <strong>dir</strong> weh?</em> — Что у тебя болит?<br><br>' +
            '👉 Глаголы, требующие <strong>датив</strong>: <em>helfen</em> (помогать), <em>danken</em> (благодарить), <em>gehören</em> (принадлежать), <em>passen</em> (подходить), <em>gefallen</em> (нравиться), <em>antworten</em> (отвечать).',
      conjugation: [
        { pronoun: 'ich',           form: 'mir',   audio: 'mir',    translation: 'мне' },
        { pronoun: 'du',            form: 'dir',   audio: 'dir',    translation: 'тебе' },
        { pronoun: 'er / es',       form: 'ihm',   audio: 'ihm',    translation: 'ему' },
        { pronoun: 'sie',           form: 'ihr',   audio: 'ihr',    translation: 'ей' },
        { pronoun: 'wir',           form: 'uns',   audio: 'uns',    translation: 'нам' },
        { pronoun: 'ihr',           form: 'euch',  audio: 'euch',   translation: 'вам' },
        { pronoun: 'sie / Sie',     form: 'ihnen / Ihnen', audio: 'ihnen Ihnen', translation: 'им / Вам' }
      ]
    },
    {
      title: '⚡ Конструкция «X tut mir weh» — самая частая у врача',
      body: 'В русском мы говорим «у меня болит голова». В немецком конструкция другая — буквально <strong>«голова мне причиняет боль»</strong>:<br><br>' +
            '<em>Der Kopf tut <strong>mir</strong> weh.</em> — У меня болит голова.<br>' +
            '<em>Die Zähne tun <strong>mir</strong> weh.</em> — У меня болят зубы. (tun — мн.ч.!)<br>' +
            '<em>Tut es <strong>dir</strong> weh?</em> — Тебе больно?<br><br>' +
            'Альтернатива — через <strong>haben + Schmerzen</strong>:<br>' +
            '<em>Ich habe <strong>Kopfschmerzen</strong>.</em> — У меня головная боль.<br>' +
            '<em>Ich habe <strong>Zahnschmerzen</strong>.</em> — У меня болят зубы.<br><br>' +
            '👉 Можно сложить любую часть тела + Schmerzen: <em>Bauch-, Hals-, Rücken-, Ohr-schmerzen</em>.'
    },
    {
      title: '💡 Дативные предлоги: mit, bei, zu, seit, aus, nach, von',
      body: 'Эти предлоги <strong>всегда</strong> требуют датив (запомни как песню!):<br><br>' +
            '<em><strong>mit</strong> dem Bus</em> — на автобусе<br>' +
            '<em><strong>bei</strong> dem (=beim) Arzt</em> — у врача<br>' +
            '<em><strong>zu</strong> der (=zur) Apotheke</em> — в аптеку<br>' +
            '<em><strong>seit</strong> drei Tagen</em> — три дня (уже)<br>' +
            '<em><strong>aus</strong> der Ukraine</em> — из Украины<br>' +
            '<em><strong>nach</strong> Hause</em> — домой<br>' +
            '<em><strong>von</strong> der Mutter</em> — от мамы<br><br>' +
            'Полезные слияния: <strong>zu + dem = zum</strong>, <strong>zu + der = zur</strong>, <strong>bei + dem = beim</strong>, <strong>von + dem = vom</strong>.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Wie geht es',  blank: 'dir',     after: '?',                       translation: '— Как ты себя чувствуешь?',           hintWord: 'dir',     hintRule: 'дательный от «du» = dir' },
      { before: '— Mir tut der',  blank: 'Kopf',    after: 'weh.',                    translation: '— У меня болит голова.',              hintWord: 'Kopf',    hintRule: 'der Kopf — мужской род, голова' },
      { before: '— Ich gehe',     blank: 'zum',     after: 'Arzt.',                   translation: '— Я иду к врачу.',                    hintWord: 'zum',     hintRule: 'zu + dem (м.р.) → zum' },
      { before: '— Können Sie',   blank: 'mir',     after: 'helfen?',                 translation: '— Вы можете мне помочь?',             hintWord: 'mir',     hintRule: 'helfen + Dativ. ich → mir' },
      { before: '— Ich habe',     blank: 'Fieber',  after: '.',                       translation: '— У меня температура.',               hintWord: 'Fieber',  hintRule: 'das Fieber — жар. Сущ. с большой' },
      { before: '— Sie ist seit drei', blank: 'Tagen', after: 'krank.',              translation: '— Она больна уже три дня.',           hintWord: 'Tagen',   hintRule: 'seit + Dat.Pl.: die Tage → den Tagen' },
      { before: '— Gute',         blank: 'Besserung',after: '!',                      translation: '— Поправляйся!',                      hintWord: 'Besserung',hintRule: 'die Besserung = выздоровление' },
      { before: '— Der Arzt verschreibt', blank: 'ihr', after: 'Medikamente.',       translation: '— Врач выписывает ей лекарства.',     hintWord: 'ihr',     hintRule: 'sie (она) в Dativ → ihr' }
    ],

    multipleChoice: [
      { question: 'Какая форма дательного для «ich»?',                                options: ['mich', 'mir', 'ich', 'mein'],                                          correctIndex: 1 },
      { question: 'Что значит «Mir tut der Bauch weh»?',                              options: ['Я голоден', 'У меня болит живот', 'Я хочу есть', 'Мне холодно'],       correctIndex: 1 },
      { question: 'Какой артикль у «der Mann» в дательном?',                          options: ['dem', 'den', 'der', 'des'],                                           correctIndex: 0 },
      { question: 'Какой глагол НЕ требует датив?',                                   options: ['helfen', 'danken', 'sehen', 'gefallen'],                              correctIndex: 2 },
      { question: 'Как сказать «к врачу» (направление)?',                             options: ['bei dem Arzt', 'zum Arzt', 'von dem Arzt', 'mit Arzt'],               correctIndex: 1 },
      { question: '«Seit drei Tagen» означает…',                                      options: ['через три дня', 'три дня (уже)', 'до трёх дней', 'на три дня'],       correctIndex: 1 },
      { question: 'Какой ответ верен: «У меня кашель» —',                             options: ['Ich bin Husten.', 'Ich habe Husten.', 'Mir ist Husten.', 'Ich Husten habe.'], correctIndex: 1 },
      { question: 'Что значит «Gute Besserung!»?',                                    options: ['Хорошего дня!', 'Поправляйся!', 'Спокойной ночи!', 'Будь здоров!'],   correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Kopf',        ru: 'голова' },
      { id: 2, de: 'der Bauch',       ru: 'живот' },
      { id: 3, de: 'das Bein',        ru: 'нога' },
      { id: 4, de: 'der Arm',         ru: 'рука' },
      { id: 5, de: 'die Apotheke',    ru: 'аптека' },
      { id: 6, de: 'das Fieber',      ru: 'температура' },
      { id: 7, de: 'helfen',          ru: 'помогать' },
      { id: 8, de: 'Gute Besserung!', ru: 'Поправляйся!' }
    ],

    dictation: [
      { word: 'Arzt',       audio: 'Arzt' },
      { word: 'Apotheke',   audio: 'Apotheke' },
      { word: 'Fieber',     audio: 'Fieber' },
      { word: 'Schmerzen',  audio: 'Schmerzen' },
      { word: 'krank',      audio: 'krank' },
      { word: 'gesund',     audio: 'gesund' },
      { word: 'helfen',     audio: 'helfen' },
      { word: 'Besserung',  audio: 'Besserung' }
    ]
  }
};
