/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-08.js
   B1 · Урок 8: Umwelt und Natur — Окружающая среда
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-08',
  level:    'B1',
  unit:     8,
  title:    'Umwelt und Natur',
  subtitle: 'Окружающая среда и природа · Klimawandel',

  meta: {
    duration:  '35–40 мин',
    wordCount: 26,
    xpReward:  150
  },

  phrases: [
    { de: 'Der Klimawandel ist eine globale Herausforderung.',     ru: 'Изменение климата — глобальная проблема.',       note: 'die Herausforderung — вызов, проблема', audio: 'Der Klimawandel ist eine globale Herausforderung' },
    { de: 'Wir müssen die Umwelt schützen.',                       ru: 'Мы должны защищать окружающую среду.',          note: 'schützen — защищать', audio: 'Wir müssen die Umwelt schützen' },
    { de: 'Die Temperaturen steigen immer mehr.',                   ru: 'Температуры всё больше растут.',                note: 'steigen — расти, подниматься', audio: 'Die Temperaturen steigen immer mehr' },
    { de: 'Erneuerbare Energien sind die Zukunft.',                ru: 'Возобновляемая энергия — это будущее.',          note: 'erneuerbar — возобновляемый', audio: 'Erneuerbare Energien sind die Zukunft' },
    { de: 'Man sollte Energie sparen.',                            ru: 'Следует экономить энергию.',                    note: 'Energie sparen — экономить энергию', audio: 'Man sollte Energie sparen' },
    { de: 'Die Wälder werden abgeholzt.',                          ru: 'Леса вырубаются.',                              note: 'abholzen — вырубать (лес). Passiv Präsens', audio: 'Die Wälder werden abgeholzt' },
    { de: 'Viele Tierarten sind vom Aussterben bedroht.',          ru: 'Многие виды животных находятся под угрозой вымирания.', note: 'bedroht sein — быть под угрозой', audio: 'Viele Tierarten sind vom Aussterben bedroht' },
    { de: 'Plastik verschmutzt die Meere.',                        ru: 'Пластик загрязняет моря.',                      note: 'verschmutzen — загрязнять', audio: 'Plastik verschmutzt die Meere' },
    { de: 'Wir recyceln Glas, Papier und Metall.',                 ru: 'Мы перерабатываем стекло, бумагу и металл.',   note: 'recyceln — перерабатывать', audio: 'Wir recyceln Glas, Papier und Metall' },
    { de: 'Mit dem Fahrrad zu fahren ist umweltfreundlich.',       ru: 'Ездить на велосипеде — это экологично.',        note: 'umweltfreundlich — экологически чистый', audio: 'Mit dem Fahrrad zu fahren ist umweltfreundlich' },
    { de: 'Der CO₂-Ausstoß muss reduziert werden.',               ru: 'Выброс CO₂ должен быть сокращён.',              note: 'der Ausstoß — выброс; reduzieren — сокращать', audio: 'Der CO₂ Ausstoß muss reduziert werden' },
    { de: 'Solarenergie und Windkraft sind sauber.',               ru: 'Солнечная и ветровая энергия — чистые.',        note: 'sauber — чистый', audio: 'Solarenergie und Windkraft sind sauber' },
    { de: 'Das Treibhausgas erwärmt die Erde.',                    ru: 'Парниковый газ нагревает Землю.',               note: 'das Treibhausgas — парниковый газ', audio: 'Das Treibhausgas erwärmt die Erde' },
    { de: 'Jeder kann einen Beitrag leisten.',                     ru: 'Каждый может внести свой вклад.',               note: 'einen Beitrag leisten — вносить вклад', audio: 'Jeder kann einen Beitrag leisten' },
    { de: 'Wir sollten weniger Fleisch essen.',                    ru: 'Нам следует есть меньше мяса.',                 note: 'weniger — меньше', audio: 'Wir sollten weniger Fleisch essen' },
    { de: 'Die Überschwemmungen nehmen zu.',                       ru: 'Наводнения учащаются.',                         note: 'die Überschwemmung — наводнение; zunehmen — учащаться', audio: 'Die Überschwemmungen nehmen zu' },
    { de: 'Dürren bedrohen die Landwirtschaft.',                   ru: 'Засухи угрожают сельскому хозяйству.',          note: 'die Dürre — засуха', audio: 'Dürren bedrohen die Landwirtschaft' },
    { de: 'Die Ozonschicht wird durch FCKW geschädigt.',           ru: 'Озоновый слой повреждается ХФУ.',               note: 'die Ozonschicht — озоновый слой; schädigen — наносить ущерб', audio: 'Die Ozonschicht wird durch FCKW geschädigt' },
    { de: 'Wir brauchen nachhaltige Lösungen.',                    ru: 'Нам нужны устойчивые решения.',                 note: 'nachhaltig — устойчивый, долгосрочный', audio: 'Wir brauchen nachhaltige Lösungen' },
    { de: 'Der Meeresspiegel steigt.',                             ru: 'Уровень моря поднимается.',                     note: 'der Meeresspiegel — уровень моря', audio: 'Der Meeresspiegel steigt' },
    { de: 'Bäume pflanzen hilft gegen den Klimawandel.',           ru: 'Посадка деревьев помогает бороться с изменением климата.', note: 'pflanzen — сажать', audio: 'Bäume pflanzen hilft gegen den Klimawandel' },
    { de: 'Der öffentliche Nahverkehr ist umweltschonend.',        ru: 'Общественный транспорт бережёт окружающую среду.', note: 'der Nahverkehr — общественный транспорт; umweltschonend — щадящий', audio: 'Der öffentliche Nahverkehr ist umweltschonend' },
    { de: 'Wir müssen unseren Konsum reduzieren.',                 ru: 'Нам нужно сократить потребление.',              note: 'der Konsum — потребление', audio: 'Wir müssen unseren Konsum reduzieren' },
    { de: 'Die Natur braucht unseren Schutz.',                     ru: 'Природа нуждается в нашей защите.',             note: 'der Schutz — защита', audio: 'Die Natur braucht unseren Schutz' }
  ],

  vocabulary: [
    { de: 'die Umwelt',             ru: 'окружающая среда',        ipa: '[ˈʊmvɛlt]',         article: 'die' },
    { de: 'der Klimawandel',        ru: 'изменение климата',       ipa: '[ˈkliːmaˌvandl̩]',   article: 'der' },
    { de: 'die Energie',            ru: 'энергия',                 ipa: '[eneʁˈɡiː]',         article: 'die' },
    { de: 'erneuerbar',             ru: 'возобновляемый',          ipa: '[ɛʁˈnɔɪ̯ɐbɑːʁ]',    article: '' },
    { de: 'schützen',               ru: 'защищать',                ipa: '[ˈʃʏtsn̩]',           article: '' },
    { de: 'verschmutzen',           ru: 'загрязнять',              ipa: '[fɛʁˈʃmʊtsn̩]',      article: '' },
    { de: 'recyceln',               ru: 'перерабатывать',          ipa: '[ʁiˈsaɪ̯kl̩n]',       article: '' },
    { de: 'das Treibhausgas',       ru: 'парниковый газ',          ipa: '[ˈtʁaɪ̯phaʊ̯sˌɡaːs]', article: 'das' },
    { de: 'die Überschwemmung',     ru: 'наводнение',              ipa: '[ˌyːbɐˈʃvɛmʊŋ]',    article: 'die' },
    { de: 'die Dürre',              ru: 'засуха',                  ipa: '[ˈdʏʁə]',            article: 'die' },
    { de: 'nachhaltig',             ru: 'устойчивый, долгосрочный', ipa: '[ˈnaːxˌhaltɪç]',    article: '' },
    { de: 'der Meeresspiegel',      ru: 'уровень моря',            ipa: '[ˈmeːʁəsˌʃpiːɡl̩]',  article: 'der' },
    { de: 'die Ozonschicht',        ru: 'озоновый слой',           ipa: '[oˈtsoːnʃɪçt]',      article: 'die' },
    { de: 'der Ausstoß',            ru: 'выброс',                  ipa: '[ˈaʊ̯sˌʃtoːs]',      article: 'der' },
    { de: 'reduzieren',             ru: 'сокращать',               ipa: '[ʁeduˈtsiːʁən]',     article: '' },
    { de: 'pflanzen',               ru: 'сажать (растение)',       ipa: '[ˈpflantsn̩]',        article: '' },
    { de: 'abholzen',               ru: 'вырубать (лес)',          ipa: '[ˈapˌhɔltsn̩]',       article: '' },
    { de: 'bedrohen',               ru: 'угрожать',                ipa: '[bəˈdʁoːən]',        article: '' },
    { de: 'der Nahverkehr',         ru: 'общественный транспорт',  ipa: '[ˈnaːfɛʁˌkeːʁ]',    article: 'der' },
    { de: 'der Konsum',             ru: 'потребление',             ipa: '[kɔnˈzuːm]',         article: 'der' },
    { de: 'umweltfreundlich',       ru: 'экологически чистый',     ipa: '[ˈʊmvɛltˌfʁɔɪ̯ntlɪç]', article: '' },
    { de: 'die Windkraft',          ru: 'ветровая энергия',        ipa: '[ˈvɪntˌkʁaft]',      article: 'die' },
    { de: 'die Solarenergie',       ru: 'солнечная энергия',       ipa: '[zoˈlaːʁeneʁˌɡiː]',  article: 'die' },
    { de: 'die Tierart',            ru: 'вид животных',            ipa: '[ˈtiːʁˌaːɐ̯t]',       article: 'die' },
    { de: 'das Aussterben',         ru: 'вымирание',               ipa: '[ˈaʊ̯sˌʃtɛʁbn̩]',     article: 'das' },
    { de: 'die Landwirtschaft',     ru: 'сельское хозяйство',      ipa: '[ˈlantvɪʁtʃaft]',   article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Пассив для описания экологических проблем',
      body: 'В текстах об экологии часто используется <strong>Passiv</strong>, т.к. субъект действия неизвестен или неважен:<br><br>' +
            '<em>Die Wälder <strong>werden</strong> abgeholzt.</em> — Леса вырубаются.<br>' +
            '<em>Die Ozonschicht <strong>wird</strong> geschädigt.</em> — Озоновый слой разрушается.<br>' +
            '<em>Der CO₂-Ausstoß muss <strong>reduziert werden</strong>.</em> — Выброс CO₂ должен быть сокращён.<br><br>' +
            'С <em>durch + Akk.</em> — указание причины:<br>' +
            '<em>Die Schicht <strong>wird durch</strong> FCKW geschädigt.</em>',
      conjugation: [
        { pronoun: 'abholzen',    form: 'werden abgeholzt',      audio: 'werden abgeholzt',      translation: 'вырубаются' },
        { pronoun: 'verschmutzen', form: 'werden verschmutzt',  audio: 'werden verschmutzt',     translation: 'загрязняются' },
        { pronoun: 'reduzieren',  form: 'werden reduziert',      audio: 'werden reduziert',      translation: 'сокращаются' },
        { pronoun: 'bedrohen',    form: 'sind bedroht',          audio: 'sind bedroht',          translation: 'находятся под угрозой' },
        { pronoun: 'schädigen',   form: 'wird geschädigt',       audio: 'wird geschädigt',       translation: 'наносится ущерб' },
        { pronoun: 'pflanzen',    form: 'werden gepflanzt',      audio: 'werden gepflanzt',      translation: 'сажаются' }
      ]
    },
    {
      title: '💡 Инфинитивные конструкции с экологической темой',
      body: 'Полезные конструкции для обсуждения экологии:<br><br>' +
            '<em>Es ist wichtig, <strong>Energie zu sparen</strong>.</em><br>' +
            '<em>Wir müssen unseren Konsum <strong>reduzieren</strong>.</em><br>' +
            '<em>Es lohnt sich, <strong>öffentliche Verkehrsmittel zu benutzen</strong>.</em><br>' +
            '(Стоит пользоваться общественным транспортом.)<br><br>' +
            '<em>Man kann einen Beitrag leisten, <strong>indem man</strong> recycelt.</em><br>' +
            '(Можно внести вклад, перерабатывая мусор.) — <em>indem</em> = «тем, что / делая»'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wir müssen die Umwelt',    blank: 'schützen',      after: '.',                    translation: '— Мы должны защищать окружающую среду.', hintWord: 'schützen',      hintRule: 'schützen — защищать' },
      { before: '— Die Wälder werden',        blank: 'abgeholzt',     after: '.',                    translation: '— Леса вырубаются.',                     hintWord: 'abgeholzt',     hintRule: 'Passiv: werden + Partizip II' },
      { before: '— Plastik',                  blank: 'verschmutzt',   after: 'die Meere.',           translation: '— Пластик загрязняет моря.',             hintWord: 'verschmutzt',   hintRule: 'verschmutzen → verschmutzt' },
      { before: '— Solarenergie ist',         blank: 'erneuerbar',    after: '.',                    translation: '— Солнечная энергия возобновляема.',     hintWord: 'erneuerbar',    hintRule: 'erneuerbar — возобновляемый' },
      { before: '— Der Meeresspiegel',        blank: 'steigt',        after: '.',                    translation: '— Уровень моря поднимается.',            hintWord: 'steigt',        hintRule: 'steigen → steigt (3 л. ед.ч.)' },
      { before: '— Wir sollten weniger',      blank: 'Fleisch',       after: 'essen.',               translation: '— Нам стоит есть меньше мяса.',         hintWord: 'Fleisch',       hintRule: 'das Fleisch — мясо' },
      { before: '— Jeder kann einen Beitrag', blank: 'leisten',       after: '.',                    translation: '— Каждый может внести свой вклад.',     hintWord: 'leisten',       hintRule: 'einen Beitrag leisten' },
      { before: '— Wir brauchen',             blank: 'nachhaltige',   after: 'Lösungen.',            translation: '— Нам нужны устойчивые решения.',       hintWord: 'nachhaltige',   hintRule: 'nachhaltig → nachhaltige (Akk. Pl.)' }
    ],

    multipleChoice: [
      { question: 'Что значит «die Umwelt»?',                           options: ['климат', 'окружающая среда', 'природа', 'экология'],                      correctIndex: 1 },
      { question: '«Erneuerbare Energien» — это…',                      options: ['ядерная энергия', 'возобновляемые источники', 'уголь', 'нефть'],           correctIndex: 1 },
      { question: '«Der Klimawandel» — перевод?',                        options: ['смена времён года', 'изменение климата', 'климатический контроль', 'прогноз погоды'], correctIndex: 1 },
      { question: 'Что значит «recyceln»?',                              options: ['выбрасывать', 'перерабатывать', 'сжигать', 'копить'],                    correctIndex: 1 },
      { question: '«umweltfreundlich» значит…',                          options: ['дружелюбный', 'вредный', 'экологически чистый', 'дешёвый'],              correctIndex: 2 },
      { question: '«Die Ozonschicht» — это…',                            options: ['озоновый слой', 'углекислый газ', 'кислород', 'водород'],                correctIndex: 0 },
      { question: 'Как сказать «наводнение»?',                           options: ['die Dürre', 'der Sturm', 'die Überschwemmung', 'der Regen'],             correctIndex: 2 },
      { question: '«nachhaltig» значит…',                                 options: ['краткосрочный', 'устойчивый/долгосрочный', 'вредный', 'дорогой'],       correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Umwelt',        ru: 'окружающая среда' },
      { id: 2, de: 'der Klimawandel',   ru: 'изменение климата' },
      { id: 3, de: 'erneuerbar',        ru: 'возобновляемый' },
      { id: 4, de: 'verschmutzen',      ru: 'загрязнять' },
      { id: 5, de: 'die Dürre',         ru: 'засуха' },
      { id: 6, de: 'abholzen',          ru: 'вырубать лес' },
      { id: 7, de: 'nachhaltig',        ru: 'устойчивый' },
      { id: 8, de: 'recyceln',          ru: 'перерабатывать' }
    ],

    dictation: [
      { word: 'Klimawandel',    audio: 'Klimawandel' },
      { word: 'Umwelt',         audio: 'Umwelt' },
      { word: 'erneuerbar',     audio: 'erneuerbar' },
      { word: 'verschmutzen',   audio: 'verschmutzen' },
      { word: 'nachhaltig',     audio: 'nachhaltig' },
      { word: 'recyceln',       audio: 'recyceln' },
      { word: 'Überschwemmung', audio: 'Überschwemmung' },
      { word: 'Meeresspiegel',  audio: 'Meeresspiegel' }
    ]
  }
};
