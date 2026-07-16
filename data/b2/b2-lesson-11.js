/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-11.js
   B2 · Урок 11: Redewendungen und Idiome — идиомы и крылатые выражения
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-11',
  level:    'B2',
  unit:     11,
  title:    'Redewendungen und Idiome',
  subtitle: 'Идиомы · Daumen drücken, ins Fettnäpfchen treten',

  meta: {
    duration:  '40–45 мин',
    wordCount: 20,
    xpReward:  200
  },

  phrases: [
    { de: 'Ich drücke dir die Daumen für die Prüfung!',         ru: 'Держу за тебя кулачки на экзамене!',               note: 'die Daumen drücken = желать удачи', audio: 'Ich drücke dir die Daumen für die Prüfung' },
    { de: 'Das ist mir Wurst.',                                 ru: 'Мне это без разницы.',                             note: 'дословно: «мне это колбаса»', audio: 'Das ist mir Wurst' },
    { de: 'Er hat wieder ins Fettnäpfchen getreten.',           ru: 'Он снова попал впросак.',                          note: 'ins Fettnäpfchen treten — сказать бестактность', audio: 'Er hat wieder ins Fettnäpfchen getreten' },
    { de: 'Jetzt verstehe ich nur Bahnhof.',                    ru: 'Я вообще ничего не понимаю.',                      note: 'nur Bahnhof verstehen', audio: 'Jetzt verstehe ich nur Bahnhof' },
    { de: 'Du gehst mir auf die Nerven!',                       ru: 'Ты действуешь мне на нервы!',                      note: 'auf die Nerven gehen', audio: 'Du gehst mir auf die Nerven' },
    { de: 'Er hat die Nase voll von seiner Arbeit.',            ru: 'Он сыт по горло своей работой.',                   note: 'die Nase voll haben', audio: 'Er hat die Nase voll von seiner Arbeit' },
    { de: 'Das kostet doch kein Vermögen — es ist ein Schnäppchen!', ru: 'Это же не стоит целого состояния — это выгодная покупка!', note: 'das Schnäppchen — удачная покупка', audio: 'Das kostet doch kein Vermögen. Es ist ein Schnäppchen' },
    { de: 'Ich muss jetzt die Ohren steif halten.',             ru: 'Мне сейчас нужно держаться / не падать духом.',    note: 'die Ohren steif halten', audio: 'Ich muss jetzt die Ohren steif halten' },
    { de: 'Er nimmt kein Blatt vor den Mund.',                  ru: 'Он говорит без обиняков.',                         note: 'kein Blatt vor den Mund nehmen', audio: 'Er nimmt kein Blatt vor den Mund' },
    { de: 'Das Projekt steht auf der Kippe.',                   ru: 'Проект висит на волоске.',                         note: 'auf der Kippe stehen', audio: 'Das Projekt steht auf der Kippe' },
    { de: 'Sie hat den Nagel auf den Kopf getroffen.',          ru: 'Она попала не в бровь, а в глаз.',                 note: 'den Nagel auf den Kopf treffen', audio: 'Sie hat den Nagel auf den Kopf getroffen' },
    { de: 'Ich habe heute einen Kater — wir haben gestern gefeiert.', ru: 'У меня сегодня похмелье — мы вчера праздновали.', note: 'der Kater = похмелье (не только кот!)', audio: 'Ich habe heute einen Kater. Wir haben gestern gefeiert' },
    { de: 'Das war der Tropfen, der das Fass zum Überlaufen brachte.', ru: 'Это была последняя капля, переполнившая чашу.', note: 'das Fass zum Überlaufen bringen', audio: 'Das war der Tropfen, der das Fass zum Überlaufen brachte' },
    { de: 'Er schiebt die Entscheidung auf die lange Bank.',    ru: 'Он откладывает решение в долгий ящик.',            note: 'auf die lange Bank schieben', audio: 'Er schiebt die Entscheidung auf die lange Bank' },
    { de: 'Hals- und Beinbruch!',                               ru: 'Ни пуха ни пера!',                                 note: 'дословно: «перелом шеи и ноги»', audio: 'Hals- und Beinbruch' },
    { de: 'Wir sitzen alle im selben Boot.',                    ru: 'Мы все в одной лодке.',                            note: 'im selben Boot sitzen', audio: 'Wir sitzen alle im selben Boot' },
    { de: 'Er hat zwei linke Hände.',                           ru: 'У него руки не из того места растут.',             note: 'zwei linke Hände haben', audio: 'Er hat zwei linke Hände' },
    { de: 'Das liegt mir auf der Zunge!',                       ru: 'Это вертится у меня на языке!',                    note: 'auf der Zunge liegen', audio: 'Das liegt mir auf der Zunge' },
    { de: 'Sie macht aus einer Mücke einen Elefanten.',         ru: 'Она делает из мухи слона.',                        note: 'aus einer Mücke einen Elefanten machen', audio: 'Sie macht aus einer Mücke einen Elefanten' },
    { de: 'Übung macht den Meister — bleib dran!',              ru: 'Повторение — мать учения, не бросай!',             note: 'Übung macht den Meister', audio: 'Übung macht den Meister. Bleib dran' }
  ],

  vocabulary: [
    { de: 'die Redewendung',   ru: 'идиома, оборот речи',        ipa: '[ˈʁeːdəˌvɛndʊŋ]',    article: 'die' },
    { de: 'der Daumen',        ru: 'большой палец',              ipa: '[ˈdaʊ̯mən]',          article: 'der' },
    { de: 'die Wurst',         ru: 'колбаса',                    ipa: '[vʊʁst]',            article: 'die' },
    { de: 'das Fettnäpfchen',  ru: 'горшочек с жиром (идиома)',  ipa: '[ˈfɛtnɛpfçən]',      article: 'das' },
    { de: 'der Nerv',          ru: 'нерв',                       ipa: '[nɛʁf]',             article: 'der' },
    { de: 'das Vermögen',      ru: 'состояние (деньги)',         ipa: '[fɛʁˈmøːɡn̩]',       article: 'das' },
    { de: 'das Schnäppchen',   ru: 'выгодная покупка',           ipa: '[ˈʃnɛpçən]',         article: 'das' },
    { de: 'das Blatt',         ru: 'лист',                       ipa: '[blat]',             article: 'das' },
    { de: 'die Kippe',         ru: 'грань, край',                ipa: '[ˈkɪpə]',            article: 'die' },
    { de: 'der Nagel',         ru: 'гвоздь',                     ipa: '[ˈnaːɡl̩]',           article: 'der' },
    { de: 'der Kater',         ru: 'кот; похмелье',              ipa: '[ˈkaːtɐ]',           article: 'der' },
    { de: 'der Tropfen',       ru: 'капля',                      ipa: '[ˈtʁɔpfn̩]',         article: 'der' },
    { de: 'das Fass',          ru: 'бочка',                      ipa: '[fas]',              article: 'das' },
    { de: 'überlaufen',        ru: 'переливаться через край',    ipa: '[ˈyːbɐˌlaʊ̯fn̩]',    article: '' },
    { de: 'schieben',          ru: 'толкать, двигать',           ipa: '[ˈʃiːbn̩]',          article: '' },
    { de: 'die Mücke',         ru: 'комар',                      ipa: '[ˈmʏkə]',            article: 'die' },
    { de: 'der Elefant',       ru: 'слон',                       ipa: '[eleˈfant]',         article: 'der' },
    { de: 'die Zunge',         ru: 'язык (орган)',               ipa: '[ˈt͡sʊŋə]',          article: 'die' },
    { de: 'wörtlich',          ru: 'дословно',                   ipa: '[ˈvœʁtlɪç]',         article: '' },
    { de: 'die Bedeutung',     ru: 'значение',                   ipa: '[bəˈdɔɪ̯tʊŋ]',       article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Идиомы нельзя переводить дословно',
      body: 'Redewendung — это выражение, чьё значение <strong>не складывается из значений слов</strong>:<br><br>' +
            '<em>Das ist mir <strong>Wurst</strong>.</em> — не про колбасу, а «мне всё равно».<br>' +
            '<em>Ich verstehe nur <strong>Bahnhof</strong>.</em> — не про вокзал, а «ничего не понимаю».<br>' +
            '<em>einen <strong>Kater</strong> haben</em> — не про кота, а про похмелье.<br><br>' +
            'Учи идиому целиком: форма + ситуация употребления. Изменять слова внутри нельзя!',
      conjugation: [
        { pronoun: 'удача',    form: 'Ich drücke dir die Daumen!',   audio: 'Ich drücke dir die Daumen',   translation: 'Держу кулачки! (удачи!)' },
        { pronoun: 'безразличие', form: 'Das ist mir Wurst.',        audio: 'Das ist mir Wurst',           translation: 'Мне без разницы.' },
        { pronoun: 'непонимание', form: 'Ich verstehe nur Bahnhof.', audio: 'Ich verstehe nur Bahnhof',    translation: 'Ничего не понимаю.' },
        { pronoun: 'раздражение', form: 'Du gehst mir auf die Nerven.', audio: 'Du gehst mir auf die Nerven', translation: 'Ты действуешь мне на нервы.' },
        { pronoun: '«хватит»',  form: 'Ich habe die Nase voll.',     audio: 'Ich habe die Nase voll',      translation: 'Я сыт по горло.' }
      ]
    },
    {
      title: '⚡ Русские параллели — где совпадает, где нет',
      body: 'Часть немецких идиом почти совпадает с русскими:<br><br>' +
            '<em>aus einer Mücke einen Elefanten machen</em> — делать из мухи слона (только «комар» вместо «мухи»!)<br>' +
            '<em>im selben Boot sitzen</em> — быть в одной лодке<br>' +
            '<em>auf der Zunge liegen</em> — вертится на языке<br><br>' +
            'А часть — совсем другая картинка:<br>' +
            '<em>Hals- und Beinbruch!</em> — «ни пуха ни пера» (дословно: перелом шеи и ноги)<br>' +
            '<em>auf die lange Bank schieben</em> — «в долгий ящик» (у немцев — скамья)',
      conjugation: [
        { pronoun: '≈ рус.',  form: 'aus einer Mücke einen Elefanten machen', audio: 'aus einer Mücke einen Elefanten machen', translation: 'делать из мухи слона' },
        { pronoun: '≈ рус.',  form: 'im selben Boot sitzen',                  audio: 'im selben Boot sitzen',                  translation: 'быть в одной лодке' },
        { pronoun: '≠ рус.',  form: 'Hals- und Beinbruch!',                   audio: 'Hals- und Beinbruch',                    translation: 'ни пуха ни пера!' },
        { pronoun: '≠ рус.',  form: 'auf die lange Bank schieben',            audio: 'auf die lange Bank schieben',            translation: 'откладывать в долгий ящик' }
      ]
    },
    {
      title: '💡 Как использовать идиомы, не попадая впросак',
      body: 'Три правила B2:<br><br>' +
            '<strong>1. Регистр.</strong> <em>Das ist mir Wurst</em> — разговорное; на собеседовании лучше <em>Das ist mir egal / Das spielt keine Rolle</em>.<br>' +
            '<strong>2. Точная форма.</strong> Идиома ломается при замене слов: не «die Finger drücken», а только <em>die Daumen drücken</em>.<br>' +
            '<strong>3. Дозировка.</strong> Одна-две идиомы делают речь живой, пять подряд — комичной. Кстати, «попасть впросак» — <em>ins Fettnäpfchen treten</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich drücke dir die',   blank: 'Daumen',   after: '!',                            translation: '— Держу за тебя кулачки!',                hintWord: 'Daumen',   hintRule: 'die Daumen drücken' },
      { before: '— Das ist mir',          blank: 'Wurst',    after: '.',                            translation: '— Мне это без разницы.',                  hintWord: 'Wurst',    hintRule: 'идиома с колбасой' },
      { before: '— Ich verstehe nur',     blank: 'Bahnhof',  after: '.',                            translation: '— Я ничего не понимаю.',                  hintWord: 'Bahnhof',  hintRule: 'nur Bahnhof verstehen' },
      { before: '— Du gehst mir auf die', blank: 'Nerven',   after: '!',                            translation: '— Ты действуешь мне на нервы!',           hintWord: 'Nerven',   hintRule: 'auf die Nerven gehen' },
      { before: '— Ich habe die Nase',    blank: 'voll',     after: 'davon.',                       translation: '— Я сыт этим по горло.',                  hintWord: 'voll',     hintRule: 'die Nase voll haben' },
      { before: '— Sie macht aus einer Mücke einen', blank: 'Elefanten', after: '.',                translation: '— Она делает из мухи слона.',             hintWord: 'Elefanten', hintRule: 'Mücke → Elefant' },
      { before: '— Wir sitzen alle im selben', blank: 'Boot', after: '.',                           translation: '— Мы все в одной лодке.',                 hintWord: 'Boot',     hintRule: 'im selben Boot sitzen' },
      { before: '— Nach der Party hatte er einen', blank: 'Kater', after: '.',                      translation: '— После вечеринки у него было похмелье.', hintWord: 'Kater',    hintRule: 'der Kater = похмелье' }
    ],

    multipleChoice: [
      { question: '«Ich verstehe nur Bahnhof» значит…',                options: ['я на вокзале', 'я ничего не понимаю', 'я понимаю расписание', 'я жду поезд'], correctIndex: 1 },
      { question: 'Пожелать удачи: «Ich drücke dir …»',                options: ['die Finger', 'die Daumen', 'die Hände', 'die Ohren'],              correctIndex: 1 },
      { question: '«einen Kater haben» значит…',                       options: ['иметь кота', 'иметь похмелье', 'злиться', 'простудиться'],         correctIndex: 1 },
      { question: '«ins Fettnäpfchen treten» — …',                     options: ['разбогатеть', 'попасть впросак', 'испачкаться', 'вкусно поесть'],  correctIndex: 1 },
      { question: 'Русское «делать из мухи слона» — у немцев вместо мухи…', options: ['die Fliege', 'die Mücke', 'die Biene', 'der Käfer'],           correctIndex: 1 },
      { question: '«Hals- und Beinbruch» говорят, когда…',             options: ['кто-то упал', 'желают удачи', 'ругаются', 'болеют'],               correctIndex: 1 },
      { question: '«auf die lange Bank schieben» = …',                 options: ['сидеть долго', 'откладывать в долгий ящик', 'двигать мебель', 'отдыхать'], correctIndex: 1 },
      { question: '«den Nagel auf den Kopf treffen» = …',              options: ['удариться головой', 'попасть в точку', 'забить гвоздь', 'ошибиться'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Daumen drücken',        ru: 'желать удачи' },
      { id: 2, de: 'nur Bahnhof verstehen',     ru: 'ничего не понимать' },
      { id: 3, de: 'die Nase voll haben',       ru: 'быть сытым по горло' },
      { id: 4, de: 'einen Kater haben',         ru: 'иметь похмелье' },
      { id: 5, de: 'ins Fettnäpfchen treten',   ru: 'попасть впросак' },
      { id: 6, de: 'auf der Kippe stehen',      ru: 'висеть на волоске' },
      { id: 7, de: 'zwei linke Hände haben',    ru: 'быть неумёхой' },
      { id: 8, de: 'im selben Boot sitzen',     ru: 'быть в одной лодке' }
    ],

    dictation: [
      { word: 'Redewendung',  audio: 'Redewendung' },
      { word: 'Daumen',       audio: 'Daumen' },
      { word: 'Bahnhof',      audio: 'Bahnhof' },
      { word: 'Schnäppchen',  audio: 'Schnäppchen' },
      { word: 'Vermögen',     audio: 'Vermögen' },
      { word: 'Elefant',      audio: 'Elefant' },
      { word: 'Zunge',        audio: 'Zunge' },
      { word: 'Bedeutung',    audio: 'Bedeutung' }
    ]
  }
};
