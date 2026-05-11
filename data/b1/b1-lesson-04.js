/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-04.js
   B1 · Урок 4: Nebensätze — Придаточные предложения
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-04',
  level:    'B1',
  unit:     4,
  title:    'Nebensätze',
  subtitle: 'Придаточные предложения · weil, dass, wenn, ob, obwohl',

  meta: {
    duration:  '35–40 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Ich lerne Deutsch, weil es interessant ist.',       ru: 'Я учу немецкий, потому что это интересно.',       note: 'weil — причина, глагол в конец', audio: 'Ich lerne Deutsch, weil es interessant ist' },
    { de: 'Er kommt nicht, weil er krank ist.',                ru: 'Он не придёт, потому что болен.',                 note: 'weil + глагол в конце придаточного', audio: 'Er kommt nicht, weil er krank ist' },
    { de: 'Ich weiß, dass du Recht hast.',                     ru: 'Я знаю, что ты прав.',                           note: 'dass — изъяснительное, глагол в конец', audio: 'Ich weiß, dass du Recht hast' },
    { de: 'Sie sagt, dass sie kommt.',                         ru: 'Она говорит, что придёт.',                        note: 'dass — косвенная речь', audio: 'Sie sagt, dass sie kommt' },
    { de: 'Wenn ich Zeit habe, lese ich.',                     ru: 'Когда у меня есть время, я читаю.',               note: 'wenn — условие или повторение', audio: 'Wenn ich Zeit habe, lese ich' },
    { de: 'Wenn es regnet, bleibe ich zu Hause.',              ru: 'Если идёт дождь, я остаюсь дома.',               note: 'wenn (= если) — условие', audio: 'Wenn es regnet, bleibe ich zu Hause' },
    { de: 'Ich frage mich, ob er kommt.',                      ru: 'Мне интересно, придёт ли он.',                   note: 'ob — косвенный вопрос (ли)', audio: 'Ich frage mich, ob er kommt' },
    { de: 'Weißt du, ob der Zug pünktlich ist?',               ru: 'Ты знаешь, придёт ли поезд вовремя?',           note: 'ob — yes/no вопрос в косвенной речи', audio: 'Weißt du, ob der Zug pünktlich ist' },
    { de: 'Obwohl es kalt ist, geht er spazieren.',            ru: 'Хотя холодно, он идёт гулять.',                  note: 'obwohl — уступка (несмотря на)', audio: 'Obwohl es kalt ist, geht er spazieren' },
    { de: 'Sie arbeitet viel, obwohl sie müde ist.',           ru: 'Она много работает, хотя устала.',               note: 'obwohl — вопреки ожиданию', audio: 'Sie arbeitet viel, obwohl sie müde ist' },
    { de: 'Als ich jung war, spielte ich Gitarre.',            ru: 'Когда я был молодым, я играл на гитаре.',         note: 'als — однократное событие в прошлом', audio: 'Als ich jung war, spielte ich Gitarre' },
    { de: 'Bevor er kommt, muss ich aufräumen.',               ru: 'Прежде чем он придёт, я должен убраться.',       note: 'bevor — до того как', audio: 'Bevor er kommt, muss ich aufräumen' },
    { de: 'Nachdem er gegessen hatte, las er.',                ru: 'После того как он поел, он читал.',              note: 'nachdem — после того как (временна́я последовательность)', audio: 'Nachdem er gegessen hatte, las er' },
    { de: 'Seitdem sie Deutsch lernt, reist sie oft.',         ru: 'С тех пор как она учит немецкий, она часто путешествует.', note: 'seitdem — с тех пор как', audio: 'Seitdem sie Deutsch lernt, reist sie oft' },
    { de: 'Ich warte, bis du fertig bist.',                    ru: 'Я подожду, пока ты не закончишь.',               note: 'bis — пока не (до момента)', audio: 'Ich warte, bis du fertig bist' },
    { de: 'Während er schläft, koche ich.',                    ru: 'Пока он спит, я готовлю.',                       note: 'während — одновременность', audio: 'Während er schläft, koche ich' },
    { de: 'Er lernt so, dass er Erfolg hat.',                  ru: 'Он учится так, что добивается успеха.',          note: 'so … dass — следствие', audio: 'Er lernt so, dass er Erfolg hat' },
    { de: 'Falls es Probleme gibt, ruf mich an.',              ru: 'Если возникнут проблемы, позвони мне.',          note: 'falls — если (более гипотетично, чем wenn)', audio: 'Falls es Probleme gibt, ruf mich an' },
    { de: 'Damit sie versteht, erkläre ich langsam.',          ru: 'Чтобы она поняла, я объясняю медленно.',         note: 'damit — цель (чтобы)', audio: 'Damit sie versteht, erkläre ich langsam' },
    { de: 'Ich bin froh, dass du hier bist.',                  ru: 'Я рад, что ты здесь.',                          note: 'dass — после прилагательного + sein', audio: 'Ich bin froh, dass du hier bist' },
    { de: 'Weil es spät ist, gehe ich schlafen.',              ru: 'Так как уже поздно, я иду спать.',              note: 'Wenn Nebensatz первый — главное с инверсией', audio: 'Weil es spät ist, gehe ich schlafen' },
    { de: 'Ich frage, woher er kommt.',                        ru: 'Я спрашиваю, откуда он.',                       note: 'woher — косвенный вопрос с вопросительным словом', audio: 'Ich frage, woher er kommt' },
    { de: 'Er tut so, als ob er schläft.',                     ru: 'Он делает вид, будто спит.',                    note: 'als ob + Konj. II в конце', audio: 'Er tut so, als ob er schläft' },
    { de: 'Je mehr er lernt, desto besser spricht er.',        ru: 'Чем больше он учит, тем лучше говорит.',        note: 'je … desto — сравнение', audio: 'Je mehr er lernt, desto besser spricht er' }
  ],

  vocabulary: [
    { de: 'weil',         ru: 'потому что',          ipa: '[vaɪ̯l]',       article: '' },
    { de: 'dass',         ru: 'что (союз)',           ipa: '[das]',        article: '' },
    { de: 'wenn',         ru: 'когда / если',         ipa: '[vɛn]',        article: '' },
    { de: 'ob',           ru: 'ли (косвенный вопрос)',ipa: '[ɔp]',         article: '' },
    { de: 'obwohl',       ru: 'хотя, несмотря на',   ipa: '[ɔpˈvoːl]',    article: '' },
    { de: 'als',          ru: 'когда (однократно)',   ipa: '[als]',        article: '' },
    { de: 'bevor',        ru: 'прежде чем, до того', ipa: '[bəˈfoːʁ]',    article: '' },
    { de: 'nachdem',      ru: 'после того как',      ipa: '[ˈnaːxdeːm]',  article: '' },
    { de: 'seitdem',      ru: 'с тех пор как',       ipa: '[zaɪ̯tˈdeːm]', article: '' },
    { de: 'bis',          ru: 'пока не, до',         ipa: '[bɪs]',        article: '' },
    { de: 'während',      ru: 'пока, в то время как', ipa: '[ˈvɛːʁənt]',  article: '' },
    { de: 'falls',        ru: 'если (гипотетически)', ipa: '[fals]',       article: '' },
    { de: 'damit',        ru: 'чтобы (цель)',         ipa: '[daˈmɪt]',     article: '' },
    { de: 'je … desto',   ru: 'чем … тем',           ipa: '[jeː ˈdɛsto]', article: '' },
    { de: 'der Nebensatz',ru: 'придаточное предложение', ipa: '[ˈneːbnˌzats]', article: 'der' },
    { de: 'der Hauptsatz',ru: 'главное предложение',  ipa: '[ˈhaʊ̯ptˌzats]', article: 'der' },
    { de: 'die Inversion',ru: 'инверсия (обратный порядок)', ipa: '[ɪnvɛʁˈzjoːn]', article: 'die' },
    { de: 'pünktlich',    ru: 'вовремя, пунктуально', ipa: '[ˈpʏŋktlɪç]',  article: '' },
    { de: 'erklären',     ru: 'объяснять',            ipa: '[ɛʁˈklɛːʁən]', article: '' },
    { de: 'der Erfolg',   ru: 'успех',                ipa: '[ɛʁˈfɔlk]',   article: '' },
    { de: 'aufräumen',    ru: 'убираться',            ipa: '[ˈaʊ̯fˌʁɔɪ̯mən]', article: '' },
    { de: 'fertig',       ru: 'готовый, закончивший', ipa: '[ˈfɛʁtɪç]',   article: '' },
    { de: 'woher',        ru: 'откуда',               ipa: '[voˈheːʁ]',    article: '' },
    { de: 'der Grund',    ru: 'причина, основание',   ipa: '[ɡʁʊnt]',     article: 'der' }
  ],

  grammar: [
    {
      title: '⚡ Порядок слов в придаточном (Nebensatz)',
      body: 'В придаточном предложении <strong>спрягаемый глагол стоит в самом конце</strong>.<br><br>' +
            'Hauptsatz: <em>Ich lerne Deutsch.</em><br>' +
            'Nebensatz: <em>…weil es interessant <strong>ist</strong>.</em><br><br>' +
            'Если в предложении 2 глагола (модальный + инфинитив):<br>' +
            '<em>…weil er kommen <strong>kann</strong>.</em> (Modal последний)<br><br>' +
            '⚠️ <strong>Инверсия в главном</strong>: если Nebensatz стоит первым, в главном предложении глагол идёт на 2-ю позицию:<br>' +
            '<em>Weil es spät ist, <strong>gehe</strong> ich schlafen.</em>',
      conjugation: [
        { pronoun: 'weil',    form: '… [глагол в конце]', audio: 'weil er krank ist',       translation: 'потому что он болен' },
        { pronoun: 'dass',    form: '… [глагол в конце]', audio: 'dass du Recht hast',      translation: 'что ты прав' },
        { pronoun: 'wenn',    form: '… [глагол в конце]', audio: 'wenn ich Zeit habe',       translation: 'когда/если у меня есть время' },
        { pronoun: 'ob',      form: '… [глагол в конце]', audio: 'ob er kommt',              translation: 'придёт ли он' },
        { pronoun: 'obwohl',  form: '… [глагол в конце]', audio: 'obwohl es kalt ist',       translation: 'хотя холодно' },
        { pronoun: 'während', form: '… [глагол в конце]', audio: 'während er schläft',       translation: 'пока он спит' }
      ]
    },
    {
      title: '💡 Временны́е союзы: als vs. wenn',
      body: '<strong>als</strong> — однократное событие в <em>прошлом</em>:<br>' +
            '<em>Als ich jung <strong>war</strong>, spielte ich Gitarre.</em><br><br>' +
            '<strong>wenn</strong> — повторяющиеся события (любое время) или условие:<br>' +
            '<em>Wenn ich Zeit <strong>habe</strong>, lese ich.</em> (каждый раз)<br>' +
            '<em>Wenn er kommt, bin ich glücklich.</em> (условие)<br><br>' +
            '⚠️ Никогда <em>als</em> для повторяющихся событий или настоящего!'
    },
    {
      title: '💡 damit vs. um … zu',
      body: '<strong>damit</strong> — цель, когда в главном и придаточном <em>разные субъекты</em>:<br>' +
            '<em>Ich erkläre langsam, <strong>damit sie</strong> versteht.</em><br><br>' +
            '<strong>um … zu + Infinitiv</strong> — цель, когда субъект <em>один и тот же</em>:<br>' +
            '<em>Ich lerne, <strong>um</strong> Erfolg <strong>zu</strong> haben.</em><br><br>' +
            'Оба варианта = «чтобы», но выбор зависит от субъекта!'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich lerne,',          blank: 'weil',    after: 'es interessant ist.',      translation: '— Я учусь, потому что это интересно.',   hintWord: 'weil',    hintRule: 'weil — причина' },
      { before: '— Ich weiß,',           blank: 'dass',    after: 'du Recht hast.',           translation: '— Я знаю, что ты прав.',                 hintWord: 'dass',    hintRule: 'dass — изъяснительное' },
      { before: '— Ich frage,',          blank: 'ob',      after: 'er kommt.',                translation: '— Я спрашиваю, придёт ли он.',           hintWord: 'ob',      hintRule: 'ob — косвенный да/нет вопрос' },
      { before: '— Er geht,',            blank: 'obwohl',  after: 'es regnet.',               translation: '— Он идёт, хотя идёт дождь.',            hintWord: 'obwohl',  hintRule: 'obwohl — уступка' },
      { before: '—',                     blank: 'Als',     after: 'ich jung war, spielte ich.', translation: '— Когда я был молод, я играл.',         hintWord: 'Als',     hintRule: 'als — однократно в прошлом' },
      { before: '— Ich warte,',          blank: 'bis',     after: 'du fertig bist.',           translation: '— Я жду, пока ты не закончишь.',        hintWord: 'bis',     hintRule: 'bis — до момента' },
      { before: '— Ich erkläre,',        blank: 'damit',   after: 'sie versteht.',             translation: '— Я объясняю, чтобы она поняла.',       hintWord: 'damit',   hintRule: 'damit — цель (разные субъекты)' },
      { before: '— Je mehr er lernt,',   blank: 'desto',   after: 'besser spricht er.',        translation: '— Чем больше он учит, тем лучше говорит.', hintWord: 'desto', hintRule: 'je … desto — сравнение' }
    ],

    multipleChoice: [
      { question: 'Где стоит глагол в Nebensatz?',                       options: ['На 1-й позиции', 'На 2-й позиции', 'В конце', 'После подлежащего'],   correctIndex: 2 },
      { question: 'Для однократного прошлого события: als или wenn?',    options: ['wenn', 'als', 'ob', 'weil'],                                           correctIndex: 1 },
      { question: '«Ich frage mich, ___ er kommt» — вставь союз:',       options: ['dass', 'weil', 'ob', 'wenn'],                                          correctIndex: 2 },
      { question: '«Hотя» по-немецки:',                                  options: ['weil', 'damit', 'obwohl', 'seitdem'],                                  correctIndex: 2 },
      { question: 'Что значит «damit»?',                                  options: ['потому что', 'чтобы', 'если', 'хотя'],                                 correctIndex: 1 },
      { question: '«Weil es spät ist, ___ ich schlafen» — инверсия!',    options: ['ich gehe', 'gehe ich', 'ich gehen', 'gehen ich'],                     correctIndex: 1 },
      { question: '«nachdem» требует в главном предложении…',             options: ['Präsens', 'более ранее прошедшее (Plusquamperfekt)', 'Futur', 'Konj. II'], correctIndex: 1 },
      { question: '«Je mehr, ___ besser» — вставь:',                     options: ['so', 'desto', 'wenn', 'obwohl'],                                       correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'weil',     ru: 'потому что' },
      { id: 2, de: 'dass',     ru: 'что (союз)' },
      { id: 3, de: 'wenn',     ru: 'когда / если' },
      { id: 4, de: 'ob',       ru: 'ли (косвенный вопрос)' },
      { id: 5, de: 'obwohl',   ru: 'хотя' },
      { id: 6, de: 'als',      ru: 'когда (однократно в прошлом)' },
      { id: 7, de: 'damit',    ru: 'чтобы (цель)' },
      { id: 8, de: 'während',  ru: 'пока / в то время как' }
    ],

    dictation: [
      { word: 'weil',       audio: 'weil' },
      { word: 'obwohl',     audio: 'obwohl' },
      { word: 'nachdem',    audio: 'nachdem' },
      { word: 'seitdem',    audio: 'seitdem' },
      { word: 'während',    audio: 'während' },
      { word: 'damit',      audio: 'damit' },
      { word: 'Nebensatz',  audio: 'Nebensatz' },
      { word: 'pünktlich',  audio: 'pünktlich' }
    ]
  }
};
