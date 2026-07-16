/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-09.js
   B2 · Урок 9: Subjektive Modalverben — субъективные модальные глаголы
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-09',
  level:    'B2',
  unit:     9,
  title:    'Subjektive Modalverben',
  subtitle: 'Субъективное значение модальных · предположение и чужие слова',

  meta: {
    duration:  '40–45 мин',
    wordCount: 20,
    xpReward:  200
  },

  phrases: [
    { de: 'Er muss krank sein — er ist heute nicht gekommen.',  ru: 'Он, должно быть, болен — он сегодня не пришёл.',   note: 'müssen = уверенность ~90%', audio: 'Er muss krank sein. Er ist heute nicht gekommen' },
    { de: 'Sie dürfte jetzt schon zu Hause sein.',              ru: 'Она, вероятно, уже дома.',                         note: 'dürfte (Konj. II) = вероятно ~70%', audio: 'Sie dürfte jetzt schon zu Hause sein' },
    { de: 'Das kann nicht wahr sein!',                          ru: 'Это не может быть правдой!',                       note: 'kann nicht = исключено', audio: 'Das kann nicht wahr sein' },
    { de: 'Er könnte im Stau stehen.',                          ru: 'Возможно, он стоит в пробке.',                     note: 'könnte = возможно ~50%', audio: 'Er könnte im Stau stehen' },
    { de: 'Sie mag etwa vierzig Jahre alt sein.',               ru: 'Ей, пожалуй, около сорока лет.',                   note: 'mag = допущение', audio: 'Sie mag etwa vierzig Jahre alt sein' },
    { de: 'Er will das Problem allein gelöst haben.',           ru: 'Он утверждает, что решил проблему сам.',           note: 'wollen = хвастливое утверждение о себе', audio: 'Er will das Problem allein gelöst haben' },
    { de: 'Sie soll sehr reich sein.',                          ru: 'Говорят, она очень богата.',                       note: 'sollen = «говорят», чужие слова', audio: 'Sie soll sehr reich sein' },
    { de: 'Der Zug müsste jeden Moment ankommen.',              ru: 'Поезд должен прибыть с минуты на минуту.',         note: 'müsste — чуть мягче, чем muss', audio: 'Der Zug müsste jeden Moment ankommen' },
    { de: 'Er muss den Schlüssel verloren haben.',              ru: 'Он, должно быть, потерял ключ.',                   note: 'прошлое: Modalverb + Infinitiv Perfekt', audio: 'Er muss den Schlüssel verloren haben' },
    { de: 'Sie kann das Buch schon gelesen haben.',             ru: 'Возможно, она уже прочитала книгу.',               note: 'kann + gelesen haben', audio: 'Sie kann das Buch schon gelesen haben' },
    { de: 'Der Täter soll das Haus durch das Fenster verlassen haben.', ru: 'Преступник, по сообщениям, покинул дом через окно.', note: 'sollen + Inf. Perfekt — стиль новостей', audio: 'Der Täter soll das Haus durch das Fenster verlassen haben' },
    { de: 'Das dürfte kein Zufall gewesen sein.',               ru: 'Это вряд ли было совпадением.',                    note: 'dürfte + gewesen sein', audio: 'Das dürfte kein Zufall gewesen sein' },
    { de: 'Er will von nichts gewusst haben.',                  ru: 'Он утверждает, что ничего не знал.',               note: 'wollen + Inf. Perfekt = сомнительное алиби', audio: 'Er will von nichts gewusst haben' },
    { de: 'Das Licht brennt — jemand muss im Büro sein.',       ru: 'Свет горит — в офисе, должно быть, кто-то есть.',  note: 'логический вывод → müssen', audio: 'Das Licht brennt. Jemand muss im Büro sein' },
    { de: 'Es könnte sein, dass ich mich irre.',                ru: 'Может быть, я ошибаюсь.',                          note: 'Es könnte sein, dass…', audio: 'Es könnte sein, dass ich mich irre' },
    { de: 'Der Film soll sehr spannend sein — alle reden davon.', ru: 'Фильм, говорят, очень захватывающий — все о нём говорят.', note: 'sollen = слухи', audio: 'Der Film soll sehr spannend sein. Alle reden davon' },
    { de: 'Sie müsste eigentlich längst hier sein.',            ru: 'Вообще-то она уже давно должна быть здесь.',       note: 'müsste + eigentlich', audio: 'Sie müsste eigentlich längst hier sein' },
    { de: 'Das kann schon stimmen, aber sicher bin ich nicht.', ru: 'Это вполне может быть правдой, но я не уверен.',   note: 'kann schon stimmen', audio: 'Das kann schon stimmen, aber sicher bin ich nicht' },
    { de: 'Angeblich hat er im Lotto gewonnen.',                ru: 'Якобы он выиграл в лотерею.',                      note: 'angeblich — синоним sollen-конструкции', audio: 'Angeblich hat er im Lotto gewonnen' },
    { de: 'Vermutlich dürfte die Lage komplizierter sein, als sie scheint.', ru: 'Предположительно, ситуация сложнее, чем кажется.', note: 'vermutlich + dürfte', audio: 'Vermutlich dürfte die Lage komplizierter sein, als sie scheint' }
  ],

  vocabulary: [
    { de: 'die Vermutung',    ru: 'предположение',               ipa: '[fɛʁˈmuːtʊŋ]',       article: 'die' },
    { de: 'vermutlich',       ru: 'предположительно',            ipa: '[fɛʁˈmuːtlɪç]',      article: '' },
    { de: 'wahrscheinlich',   ru: 'вероятно',                    ipa: '[vaːɐ̯ˈʃaɪ̯nlɪç]',   article: '' },
    { de: 'angeblich',        ru: 'якобы',                       ipa: '[ˈanɡeːplɪç]',       article: '' },
    { de: 'offenbar',         ru: 'очевидно',                    ipa: '[ˈɔfn̩baːɐ̯]',       article: '' },
    { de: 'der Zufall',       ru: 'случайность, совпадение',     ipa: '[ˈt͡suːfal]',        article: 'der' },
    { de: 'sich irren',       ru: 'ошибаться',                   ipa: '[ˈɪʁən]',            article: '' },
    { de: 'stimmen',          ru: 'быть верным',                 ipa: '[ˈʃtɪmən]',          article: '' },
    { de: 'behaupten',        ru: 'утверждать',                  ipa: '[bəˈhaʊ̯ptn̩]',      article: '' },
    { de: 'das Gerücht',      ru: 'слух',                        ipa: '[ɡəˈʁʏçt]',          article: 'das' },
    { de: 'der Täter',        ru: 'преступник, виновник',        ipa: '[ˈtɛːtɐ]',           article: 'der' },
    { de: 'der Beweis',       ru: 'доказательство',              ipa: '[bəˈvaɪ̯s]',         article: 'der' },
    { de: 'die Lage',         ru: 'положение, ситуация',         ipa: '[ˈlaːɡə]',           article: 'die' },
    { de: 'scheinen',         ru: 'казаться',                    ipa: '[ˈʃaɪ̯nən]',         article: '' },
    { de: 'spannend',         ru: 'захватывающий',               ipa: '[ˈʃpanənt]',         article: '' },
    { de: 'längst',           ru: 'уже давно',                   ipa: '[lɛŋst]',            article: '' },
    { de: 'etwa',             ru: 'примерно, около',             ipa: '[ˈɛtva]',            article: '' },
    { de: 'jemand',           ru: 'кто-то',                      ipa: '[ˈjeːmant]',         article: '' },
    { de: 'verlieren',        ru: 'терять',                      ipa: '[fɛʁˈliːʁən]',       article: '' },
    { de: 'im Lotto gewinnen', ru: 'выиграть в лотерею',         ipa: '[ˈlɔto ɡəˈvɪnən]',   article: '' }
  ],

  grammar: [
    {
      title: '⚡ Шкала уверенности: от muss до kann',
      body: 'Модальные глаголы выражают не только «должен/может», но и <strong>степень уверенности говорящего</strong>:<br><br>' +
            '<strong>muss</strong> — ~90%: <em>Er muss krank sein.</em> (иначе быть не может)<br>' +
            '<strong>müsste</strong> — ~80%: <em>Er müsste zu Hause sein.</em><br>' +
            '<strong>dürfte</strong> — ~70%: <em>Er dürfte zu Hause sein.</em> (вероятно)<br>' +
            '<strong>könnte / kann</strong> — ~50%: <em>Er könnte im Stau stehen.</em> (возможно)<br>' +
            '<strong>kann nicht</strong> — 0%: <em>Das kann nicht sein!</em> (исключено)',
      conjugation: [
        { pronoun: '~90%', form: 'Er muss krank sein.',        audio: 'Er muss krank sein',        translation: 'Он наверняка болен.' },
        { pronoun: '~80%', form: 'Er müsste da sein.',         audio: 'Er müsste da sein',         translation: 'Он должен бы быть там.' },
        { pronoun: '~70%', form: 'Er dürfte da sein.',         audio: 'Er dürfte da sein',         translation: 'Он, вероятно, там.' },
        { pronoun: '~50%', form: 'Er könnte da sein.',         audio: 'Er könnte da sein',         translation: 'Возможно, он там.' },
        { pronoun: '0%',   form: 'Das kann nicht sein.',       audio: 'Das kann nicht sein',       translation: 'Этого не может быть.' }
      ]
    },
    {
      title: '⚡ sollen и wollen — чужие слова',
      body: 'Особая пара — передаёт <strong>не факт, а чьё-то утверждение</strong>:<br><br>' +
            '<strong>sollen</strong> — «говорят, по сообщениям» (источник — другие):<br>' +
            '<em>Sie <strong>soll</strong> sehr reich sein.</em> — Говорят, она очень богата.<br><br>' +
            '<strong>wollen</strong> — «он утверждает о себе» (источник — сам субъект, говорящий сомневается):<br>' +
            '<em>Er <strong>will</strong> das allein geschafft haben.</em> — Он утверждает, что справился сам (ну-ну).',
      conjugation: [
        { pronoun: 'sollen',  form: 'Der Film soll gut sein.',            audio: 'Der Film soll gut sein',            translation: 'Говорят, фильм хороший.' },
        { pronoun: 'sollen',  form: 'Er soll im Ausland leben.',          audio: 'Er soll im Ausland leben',          translation: 'По слухам, он живёт за границей.' },
        { pronoun: 'wollen',  form: 'Sie will nichts gesehen haben.',     audio: 'Sie will nichts gesehen haben',     translation: 'Она утверждает, что ничего не видела.' },
        { pronoun: 'wollen',  form: 'Er will der Beste sein.',            audio: 'Er will der Beste sein',            translation: 'Он утверждает, что он лучший.' }
      ]
    },
    {
      title: '💡 Предположения о прошлом: Modalverb + Infinitiv Perfekt',
      body: 'Чтобы предположить о <strong>прошлом</strong>, модальный глагол остаётся в Präsens, а смысловой глагол берёт форму <strong>Infinitiv Perfekt</strong> (Partizip II + haben/sein):<br><br>' +
            '<em>Er <strong>muss</strong> den Schlüssel <strong>verloren haben</strong>.</em> — Он, должно быть, потерял ключ.<br>' +
            '<em>Sie <strong>kann</strong> schon <strong>angekommen sein</strong>.</em> — Возможно, она уже приехала.<br>' +
            '<em>Der Täter <strong>soll</strong> geflohen <strong>sein</strong>.</em> — Преступник, по сообщениям, сбежал.<br><br>' +
            'Выбор haben/sein — по тем же правилам, что и в Perfekt.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Er',                  blank: 'muss',    after: 'krank sein — er fehlt heute.',  translation: '— Он наверняка болен — его сегодня нет.', hintWord: 'muss',   hintRule: 'уверенность ~90% → muss' },
      { before: '— Sie',                 blank: 'dürfte',  after: 'schon zu Hause sein.',          translation: '— Она, вероятно, уже дома.',              hintWord: 'dürfte', hintRule: 'вероятно ~70% → dürfte' },
      { before: '— Das',                 blank: 'kann',    after: 'nicht wahr sein!',              translation: '— Это не может быть правдой!',            hintWord: 'kann',   hintRule: 'исключено → kann nicht' },
      { before: '— Der Film',            blank: 'soll',    after: 'sehr gut sein.',                translation: '— Говорят, фильм очень хороший.',         hintWord: 'soll',   hintRule: 'чужие слова → sollen' },
      { before: '— Er',                  blank: 'will',    after: 'nichts gewusst haben.',         translation: '— Он утверждает, что ничего не знал.',    hintWord: 'will',   hintRule: 'утверждение о себе → wollen' },
      { before: '— Er muss den Schlüssel', blank: 'verloren', after: 'haben.',                     translation: '— Он, должно быть, потерял ключ.',        hintWord: 'verloren', hintRule: 'прошлое: Partizip II + haben' },
      { before: '— Sie kann schon angekommen', blank: 'sein', after: '.',                          translation: '— Возможно, она уже приехала.',           hintWord: 'sein',   hintRule: 'ankommen → sein' },
      { before: '— Es',                  blank: 'könnte',  after: 'sein, dass ich mich irre.',     translation: '— Может быть, я ошибаюсь.',               hintWord: 'könnte', hintRule: 'Es könnte sein, dass…' }
    ],

    multipleChoice: [
      { question: '«Er muss krank sein» выражает…',                    options: ['обязанность', 'высокую уверенность', 'запрет', 'желание'],        correctIndex: 1 },
      { question: 'Самая высокая уверенность…',                        options: ['könnte', 'dürfte', 'muss', 'mag'],                                 correctIndex: 2 },
      { question: '«Sie soll reich sein» значит…',                     options: ['она должна разбогатеть', 'говорят, она богата', 'ей следует быть богатой', 'она хочет быть богатой'], correctIndex: 1 },
      { question: '«Er will alles allein gemacht haben» — говорящий…', options: ['верит ему', 'сомневается в его словах', 'приказывает ему', 'хвалит его'], correctIndex: 1 },
      { question: 'Предположение о прошлом: Er kann das Buch …',       options: ['lesen', 'gelesen haben', 'gelesen sein', 'zu lesen'],              correctIndex: 1 },
      { question: '«вряд ли было совпадением» — Das dürfte kein Zufall … sein.', options: ['gewesen', 'geworden', 'gehabt', 'gegangen'],             correctIndex: 0 },
      { question: 'Синоним «sollen»-конструкции…',                     options: ['vermutlich', 'angeblich', 'offenbar', 'sicher'],                   correctIndex: 1 },
      { question: '«Это исключено» — …',                               options: ['Das muss sein.', 'Das kann nicht sein.', 'Das soll sein.', 'Das mag sein.'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'Er muss krank sein.',       ru: 'Он наверняка болен.' },
      { id: 2, de: 'Er dürfte krank sein.',     ru: 'Он, вероятно, болен.' },
      { id: 3, de: 'Er könnte krank sein.',     ru: 'Возможно, он болен.' },
      { id: 4, de: 'Er soll krank sein.',       ru: 'Говорят, он болен.' },
      { id: 5, de: 'Er will krank gewesen sein.', ru: 'Он утверждает, что болел.' },
      { id: 6, de: 'Das kann nicht sein.',      ru: 'Этого не может быть.' },
      { id: 7, de: 'angeblich',                 ru: 'якобы' },
      { id: 8, de: 'das Gerücht',               ru: 'слух' }
    ],

    dictation: [
      { word: 'Vermutung',      audio: 'Vermutung' },
      { word: 'wahrscheinlich', audio: 'wahrscheinlich' },
      { word: 'angeblich',      audio: 'angeblich' },
      { word: 'Gerücht',        audio: 'Gerücht' },
      { word: 'behaupten',      audio: 'behaupten' },
      { word: 'Zufall',         audio: 'Zufall' },
      { word: 'Beweis',         audio: 'Beweis' },
      { word: 'scheinen',       audio: 'scheinen' }
    ]
  }
};
