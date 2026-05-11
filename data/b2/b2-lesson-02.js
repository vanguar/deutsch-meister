/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-02.js
   B2 · Урок 2: Modalpartikeln — Модальные частицы
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-02',
  level:    'B2',
  unit:     2,
  title:    'Modalpartikeln',
  subtitle: 'Модальные частицы · doch, mal, ja, eben, halt, wohl, denn',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Das ist doch klar!',                    ru: 'Это же ясно! (всем известно)',              note: 'doch — усиливает очевидность, «же»', audio: 'Das ist doch klar' },
    { de: 'Komm doch mal mit!',                    ru: 'Да пойдём же! (приглашение)',               note: 'doch mal — приглашение / мягкое побуждение', audio: 'Komm doch mal mit' },
    { de: 'Ich habe dir das ja gesagt.',            ru: 'Я же тебе говорил (ты ведь знаешь).',       note: 'ja — апелляция к общеизвестному', audio: 'Ich habe dir das ja gesagt' },
    { de: 'Das ist ja interessant!',               ru: 'Это же интересно! (удивление)',             note: 'ja — выражает удивление', audio: 'Das ist ja interessant' },
    { de: 'Warte mal kurz.',                       ru: 'Подожди минутку.',                          note: 'mal — смягчает просьбу / команду', audio: 'Warte mal kurz' },
    { de: 'Zeig mir mal das Foto.',                ru: 'Покажи-ка мне фото.',                       note: 'mal — «-ка» — неформальная просьба', audio: 'Zeig mir mal das Foto' },
    { de: 'Das ist eben so.',                      ru: 'Так оно и есть. / Ничего не поделаешь.',    note: 'eben — констатация факта, смирение', audio: 'Das ist eben so' },
    { de: 'Das ist halt nicht einfach.',           ru: 'Это просто непросто (ничего не поделаешь).', note: 'halt — южнонемецкий аналог eben', audio: 'Das ist halt nicht einfach' },
    { de: 'Er wird wohl krank sein.',              ru: 'Он, должно быть, болен.',                   note: 'wohl — предположение', audio: 'Er wird wohl krank sein' },
    { de: 'Sie ist wohl zu Hause.',                ru: 'Она, наверное, дома.',                      note: 'wohl — вероятность, неуверенность', audio: 'Sie ist wohl zu Hause' },
    { de: 'Was ist denn los?',                     ru: 'Что же случилось? / Что такое?',            note: 'denn — в вопросах: интерес / удивление', audio: 'Was ist denn los' },
    { de: 'Warum kommst du denn nicht?',           ru: 'Почему же ты не приходишь?',               note: 'denn — усиливает вопрос', audio: 'Warum kommst du denn nicht' },
    { de: 'Sei doch nicht so traurig.',            ru: 'Да не будь же таким грустным.',             note: 'doch — в повелительном: мягкое убеждение', audio: 'Sei doch nicht so traurig' },
    { de: 'Das kann doch nicht sein!',             ru: 'Этого же не может быть!',                   note: 'doch — выражает несогласие / недоверие', audio: 'Das kann doch nicht sein' },
    { de: 'Du bist ja schon da!',                  ru: 'Ты уже здесь! (неожиданно)',                note: 'ja — неожиданное открытие', audio: 'Du bist ja schon da' },
    { de: 'Mach das mal schnell.',                 ru: 'Сделай это быстренько.',                    note: 'mal — неформальная просьба', audio: 'Mach das mal schnell' },
    { de: 'Das klappt eben nicht immer.',          ru: 'Это не всегда получается — что поделать.',  note: 'eben — констатация с оттенком смирения', audio: 'Das klappt eben nicht immer' },
    { de: 'Ich hab das halt vergessen.',           ru: 'Я просто забыл (ничего не поделаешь).',     note: 'halt — разговорное признание', audio: 'Ich hab das halt vergessen' },
    { de: 'Er dürfte wohl Recht haben.',           ru: 'Он, пожалуй, прав.',                        note: 'dürfte + wohl — высокая степень уверенности', audio: 'Er dürfte wohl Recht haben' },
    { de: 'Wie heißt du denn?',                    ru: 'А как тебя зовут?',                         note: 'denn — придаёт непринуждённость вопросу', audio: 'Wie heißt du denn' },
    { de: 'Das ist nun mal so.',                   ru: 'Уж так оно есть (факт).',                   note: 'nun mal — усиленное eben/halt', audio: 'Das ist nun mal so' },
    { de: 'Kannst du mir mal helfen?',             ru: 'Можешь мне помочь? (вежливо)',              note: 'mal — смягчает вопрос-просьбу', audio: 'Kannst du mir mal helfen' },
    { de: 'Das weiß ich ja auch nicht.',           ru: 'Я ведь тоже этого не знаю.',                note: 'ja — «ведь» — апелляция к общей ситуации', audio: 'Das weiß ich ja auch nicht' },
    { de: 'Der Film war doch gut, oder?',          ru: 'Фильм ведь был хорошим, правда?',           note: 'doch — подтверждение ожидаемого', audio: 'Der Film war doch gut, oder' }
  ],

  vocabulary: [
    { de: 'doch',            ru: 'же / ведь / но (частица)',     ipa: '[dɔx]',         article: '' },
    { de: 'mal',             ru: '-ка / просто / разок',         ipa: '[maːl]',        article: '' },
    { de: 'ja',              ru: 'ведь / же (удивление)',        ipa: '[jaː]',         article: '' },
    { de: 'eben',            ru: 'вот и всё / что поделать',     ipa: '[ˈeːbn̩]',      article: '' },
    { de: 'halt',            ra: 'просто (южнонем. = eben)',     ipa: '[halt]',        article: '' },
    { de: 'wohl',            ru: 'наверное / должно быть',       ipa: '[voːl]',        article: '' },
    { de: 'denn',            ru: 'же / а (в вопросах)',          ipa: '[dɛn]',         article: '' },
    { de: 'nun mal',         ru: 'уж так / раз уж так',          ipa: '[nuːn maːl]',   article: '' },
    { de: 'schon',           ru: 'уже / конечно (частица)',      ipa: '[ʃoːn]',        article: '' },
    { de: 'eigentlich',      ru: 'вообще-то / собственно',       ipa: '[ˈaɪ̯ɡn̩tlɪç]', article: '' },
    { de: 'los',             ru: 'случилось / прочь',            ipa: '[loːs]',        article: '' },
    { de: 'traurig',         ru: 'грустный',                     ipa: '[ˈtʁaʊ̯ʁɪç]',  article: '' },
    { de: 'klappen',         ru: 'получаться',                   ipa: '[ˈklapn̩]',     article: '' },
    { de: 'die Modalpartikel', ru: 'модальная частица',          ipa: '[moˈdaːlˌpaʁtɪkl̩]', article: 'die' },
    { de: 'der Ausdruck',    ru: 'выражение, оттенок',           ipa: '[ˈaʊ̯sdʁʊk]',  article: 'der' },
    { de: 'unbetont',        ru: 'безударный',                   ipa: '[ˈʊnbəˌtoːnt]', article: '' },
    { de: 'das Erstaunen',   ru: 'удивление',                    ipa: '[ɛʁˈʃtaʊ̯nən]', article: 'das' },
    { de: 'die Vermutung',   ru: 'предположение',                ipa: '[fɛʁˈmuːtʊŋ]', article: 'die' },
    { de: 'die Resignation', ru: 'смирение',                     ipa: '[ʁezɪɡˈnaːtsi̯oːn]', article: 'die' },
    { de: 'die Aufforderung',ru: 'побуждение, призыв',           ipa: '[ˈaʊ̯ffɔʁdərʊŋ]', article: 'die' },
    { de: 'der Kontext',     ru: 'контекст',                     ipa: '[kɔnˈtɛkst]',  article: 'der' },
    { de: 'südlich',         ru: 'южный',                        ipa: '[ˈzʏtlɪç]',    article: '' },
    { de: 'umgangssprachlich', ru: 'разговорный',                ipa: '[ˈʊmɡaŋsˌʃpʁaːxlɪç]', article: '' },
    { de: 'betonen',         ru: 'подчёркивать, делать ударение', ipa: '[bəˈtoːnən]', article: '' }
  ],

  grammar: [
    {
      title: '⚡ Основные модальные частицы и их функции',
      body: 'Модальные частицы — самая сложная и самая «немецкая» часть языка. Они всегда <strong>безударны</strong> и передают отношение говорящего:<br><br>' +
            '<strong>doch</strong> — «же / ведь» (очевидность, контраргумент, убеждение):<br>' +
            '<em>Das ist <strong>doch</strong> klar!</em><br><br>' +
            '<strong>mal</strong> — смягчает просьбу, неформально:<br>' +
            '<em>Warte <strong>mal</strong>!</em> = Подожди-ка.<br><br>' +
            '<strong>ja</strong> — «ведь / же» (общеизвестное, неожиданность):<br>' +
            '<em>Das weißt du <strong>ja</strong>.</em> / <em>Das ist <strong>ja</strong> schön!</em><br><br>' +
            '<strong>wohl</strong> — предположение, вероятность:<br>' +
            '<em>Er ist <strong>wohl</strong> krank.</em> = Наверное, болен.',
      conjugation: [
        { pronoun: 'doch',  form: 'Das ist doch klar',      audio: 'Das ist doch klar',      translation: 'Это же ясно (ожидаемо)' },
        { pronoun: 'mal',   form: 'Warte mal kurz',         audio: 'Warte mal kurz',         translation: 'Подожди-ка' },
        { pronoun: 'ja',    form: 'Das ist ja schön',       audio: 'Das ist ja schön',       translation: 'Это же красиво! (удивление)' },
        { pronoun: 'eben',  form: 'Das ist eben so',        audio: 'Das ist eben so',        translation: 'Так оно и есть (смирение)' },
        { pronoun: 'wohl',  form: 'Er ist wohl krank',      audio: 'Er ist wohl krank',      translation: 'Он, наверное, болен (предположение)' },
        { pronoun: 'denn',  form: 'Was ist denn los',       audio: 'Was ist denn los',       translation: 'Что же случилось? (интерес)' }
      ]
    },
    {
      title: '💡 eben vs. halt vs. schon',
      body: '<strong>eben</strong> — констатация, «ничего не поделаешь»:<br>' +
            '<em>Das <strong>eben</strong> nicht. Das ist nun mal so.</em><br><br>' +
            '<strong>halt</strong> — южнонемецкий аналог eben:<br>' +
            '<em>Ich hab es <strong>halt</strong> vergessen.</em><br><br>' +
            '<strong>schon</strong> — «конечно / всё-таки»:<br>' +
            '<em>Das stimmt <strong>schon</strong>, aber…</em> = Это конечно верно, но…<br><br>' +
            '⚠️ Модальные частицы НЕЛЬЗЯ напрямую перевести — нужно передавать интонацию и смысл!'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Das ist',          blank: 'doch',    after: 'klar!',                  translation: '— Это же ясно!',                     hintWord: 'doch',    hintRule: 'doch — очевидность «же»' },
      { before: '— Warte',            blank: 'mal',     after: 'kurz!',                  translation: '— Подожди-ка.',                       hintWord: 'mal',     hintRule: 'mal — смягчает просьбу' },
      { before: '— Das ist',          blank: 'ja',      after: 'interessant!',            translation: '— Это же интересно! (удивление)',    hintWord: 'ja',      hintRule: 'ja — удивление/общеизвестное' },
      { before: '— Er wird',          blank: 'wohl',    after: 'krank sein.',             translation: '— Он, должно быть, болен.',          hintWord: 'wohl',    hintRule: 'wohl — предположение' },
      { before: '— Das ist',          blank: 'eben',    after: 'so.',                     translation: '— Так оно и есть.',                  hintWord: 'eben',    hintRule: 'eben — констатация, смирение' },
      { before: '— Was ist',          blank: 'denn',    after: 'los?',                    translation: '— Что же случилось?',                hintWord: 'denn',    hintRule: 'denn — в вопросах (интерес)' },
      { before: '— Ich hab das',      blank: 'halt',    after: 'vergessen.',              translation: '— Я просто забыл.',                  hintWord: 'halt',    hintRule: 'halt (южн.) = eben' },
      { before: '— Komm',             blank: 'doch',    after: 'mal mit!',                translation: '— Да пойдём же!',                    hintWord: 'doch',    hintRule: 'doch mal — приглашение' }
    ],

    multipleChoice: [
      { question: '«wohl» в предложении выражает…',                          options: ['команду', 'предположение', 'смирение', 'удивление'],             correctIndex: 1 },
      { question: '«eben» выражает…',                                         options: ['интерес', 'смирение/констатацию', 'предположение', 'команду'],   correctIndex: 1 },
      { question: '«mal» в просьбе…',                                         options: ['усиливает', 'смягчает', 'отрицает', 'ничего не значит'],         correctIndex: 1 },
      { question: '«denn» используется…',                                      options: ['в утвержд. предложениях', 'в вопросах', 'в восклицаниях', 'в отрицаниях'], correctIndex: 1 },
      { question: '«Das ist ja schön!» — «ja» выражает…',                     options: ['согласие', 'удивление', 'смирение', 'отрицание'],               correctIndex: 1 },
      { question: 'Южнонемецкий аналог «eben»?',                              options: ['mal', 'doch', 'halt', 'ja'],                                     correctIndex: 2 },
      { question: 'Модальные частицы всегда…',                                 options: ['ударные', 'безударные', 'в конце предложения', 'существительные'], correctIndex: 1 },
      { question: '«Das stimmt schon, aber…» — «schon» значит…',              options: ['уже', 'конечно/всё же', 'ещё', 'никогда'],                      correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'doch',   ru: 'же / ведь (очевидность)' },
      { id: 2, de: 'mal',    ru: '-ка (смягчение просьбы)' },
      { id: 3, de: 'ja',     ru: 'ведь / же (удивление)' },
      { id: 4, de: 'eben',   ru: 'вот и всё (смирение)' },
      { id: 5, de: 'halt',   ru: 'просто (южн. = eben)' },
      { id: 6, de: 'wohl',   ru: 'наверное (предположение)' },
      { id: 7, de: 'denn',   ru: 'же / а (в вопросах)' },
      { id: 8, de: 'schon',  ru: 'конечно / всё-таки' }
    ],

    dictation: [
      { word: 'Modalpartikel', audio: 'Modalpartikel' },
      { word: 'doch',          audio: 'doch' },
      { word: 'wohl',          audio: 'wohl' },
      { word: 'eben',          audio: 'eben' },
      { word: 'halt',          audio: 'halt' },
      { word: 'Vermutung',     audio: 'Vermutung' },
      { word: 'Resignation',   audio: 'Resignation' },
      { word: 'Erstaunen',     audio: 'Erstaunen' }
    ]
  }
};
