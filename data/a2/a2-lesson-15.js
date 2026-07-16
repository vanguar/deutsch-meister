/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-15.js
   A2 · Урок 15: Freundschaft und Beziehungen — Дружба и отношения
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-15',
  level: 'A2',
  unit:  15,
  title: 'Freundschaft und Beziehungen',
  subtitle: 'Дружба, отношения и общение',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Er ist mein bester Freund.',          ru: 'Он мой лучший друг.',              note: 'der beste Freund — лучший друг', audio: 'Er ist mein bester Freund' },
    { de: 'Wir kennen uns seit der Schule.',     ru: 'Мы знакомы со школы.',             note: 'sich kennen — быть знакомыми', audio: 'Wir kennen uns seit der Schule' },
    { de: 'Wir verstehen uns sehr gut.',         ru: 'Мы очень хорошо ладим.',           note: 'sich verstehen — понимать друг друга, ладить', audio: 'Wir verstehen uns sehr gut' },
    { de: 'Ich kann mich auf ihn verlassen.',    ru: 'Я могу на него положиться.',       note: 'sich verlassen auf + Akk. — полагаться на', audio: 'Ich kann mich auf ihn verlassen' },
    { de: 'Wir treffen uns am Samstag.',         ru: 'Мы встречаемся в субботу.',        note: 'sich treffen — встречаться', audio: 'Wir treffen uns am Samstag' },
    { de: 'Sie hat einen neuen Freund.',         ru: 'У неё новый парень.',              note: 'ein Freund = друг ИЛИ парень (по контексту)', audio: 'Sie hat einen neuen Freund' },
    { de: 'Sie sind seit zwei Jahren verheiratet.', ru: 'Они женаты два года.',          note: 'verheiratet — женатый/замужем', audio: 'Sie sind seit zwei Jahren verheiratet' },
    { de: 'Wir haben uns gestritten.',           ru: 'Мы поссорились.',                  note: 'sich streiten — ссориться', audio: 'Wir haben uns gestritten' },
    { de: 'Ich habe mich bei ihr entschuldigt.', ru: 'Я извинился перед ней.',           note: 'sich entschuldigen bei — извиняться перед', audio: 'Ich habe mich bei ihr entschuldigt' },
    { de: 'Wir haben uns wieder vertragen.',     ru: 'Мы помирились.',                   note: 'sich vertragen — мириться', audio: 'Wir haben uns wieder vertragen' },
    { de: 'Er hilft mir immer.',                 ru: 'Он всегда мне помогает.',          note: 'helfen + Dativ', audio: 'Er hilft mir immer' },
    { de: 'Echte Freunde sind wichtig.',         ru: 'Настоящие друзья важны.',          note: 'echt — настоящий; wichtig — важный', audio: 'Echte Freunde sind wichtig' },
    { de: 'Wir haben viel gemeinsam.',           ru: 'У нас много общего.',              note: 'gemeinsam — общий, совместный', audio: 'Wir haben viel gemeinsam' },
    { de: 'Sie erzählt mir alles.',              ru: 'Она рассказывает мне всё.',        note: 'erzählen — рассказывать', audio: 'Sie erzählt mir alles' },
    { de: 'Ich vermisse dich.',                  ru: 'Я скучаю по тебе.',                note: 'vermissen + Akk. — скучать по', audio: 'Ich vermisse dich' },
    { de: 'Bleiben wir in Kontakt!',             ru: 'Будем на связи!',                  note: 'in Kontakt bleiben — оставаться на связи', audio: 'Bleiben wir in Kontakt' }
  ],

  vocabulary: [
    { de: 'die Freundschaft', ru: 'дружба',            ipa: '[ˈfʁɔɪ̯ntʃaft]',    article: 'die' },
    { de: 'der Freund',       ru: 'друг; парень',      ipa: '[fʁɔɪ̯nt]',         article: 'der' },
    { de: 'die Freundin',     ru: 'подруга; девушка',  ipa: '[ˈfʁɔɪ̯ndɪn]',      article: 'die' },
    { de: 'die Beziehung',    ru: 'отношения',         ipa: '[bəˈtsiːʊŋ]',       article: 'die' },
    { de: 'der Streit',       ru: 'ссора',             ipa: '[ʃtʁaɪ̯t]',         article: 'der' },
    { de: 'das Vertrauen',    ru: 'доверие',           ipa: '[fɛɐ̯ˈtʁaʊ̯ən]',    article: 'das' },
    { de: 'sich kennen',      ru: 'быть знакомыми',    ipa: '[zɪç ˈkɛnən]',      article: '' },
    { de: 'sich treffen',     ru: 'встречаться',       ipa: '[zɪç ˈtʁɛfn̩]',     article: '' },
    { de: 'sich verstehen',   ru: 'ладить',            ipa: '[zɪç fɛɐ̯ˈʃteːən]', article: '' },
    { de: 'sich streiten',    ru: 'ссориться',         ipa: '[zɪç ˈʃtʁaɪ̯tn̩]',  article: '' },
    { de: 'sich vertragen',   ru: 'мириться',          ipa: '[zɪç fɛɐ̯ˈtʁaːɡn̩]', article: '' },
    { de: 'sich verlassen auf', ru: 'полагаться на',   ipa: '[zɪç fɛɐ̯ˈlasn̩]',  article: '' },
    { de: 'sich entschuldigen', ru: 'извиняться',      ipa: '[zɪç ɛntˈʃʊldɪɡn̩]', article: '' },
    { de: 'vermissen',        ru: 'скучать по',        ipa: '[fɛɐ̯ˈmɪsn̩]',      article: '' },
    { de: 'erzählen',         ru: 'рассказывать',      ipa: '[ɛɐ̯ˈtsɛːlən]',     article: '' },
    { de: 'verheiratet',      ru: 'женатый, замужем',  ipa: '[fɛɐ̯ˈhaɪ̯ʁaːtət]', article: '' },
    { de: 'ledig',            ru: 'холостой, незамужняя', ipa: '[ˈleːdɪç]',      article: '' },
    { de: 'echt',             ru: 'настоящий',         ipa: '[ɛçt]',             article: '' },
    { de: 'gemeinsam',        ru: 'общий, вместе',     ipa: '[ɡəˈmaɪ̯nzaːm]',    article: '' },
    { de: 'wichtig',          ru: 'важный',            ipa: '[ˈvɪçtɪç]',         article: '' }
  ],

  grammar: [
    {
      title: '⚡ Взаимные действия: uns, euch, sich',
      body: 'Когда действие взаимное («друг друга»), используются возвратные местоимения множественного числа:<br><br>' +
            '<em>Wir treffen <strong>uns</strong>.</em> — Мы встречаемся (друг с другом).<br>' +
            '<em>Sie verstehen <strong>sich</strong> gut.</em> — Они хорошо ладят.<br>' +
            '<em>Kennt ihr <strong>euch</strong>?</em> — Вы знакомы?',
      conjugation: [
        { pronoun: 'встреча',   form: 'Wir treffen uns morgen.',     audio: 'Wir treffen uns morgen',     translation: 'Мы встречаемся завтра.' },
        { pronoun: 'знакомство', form: 'Wir kennen uns lange.',      audio: 'Wir kennen uns lange',       translation: 'Мы давно знакомы.' },
        { pronoun: 'ссора',     form: 'Sie streiten sich oft.',      audio: 'Sie streiten sich oft',      translation: 'Они часто ссорятся.' },
        { pronoun: 'мир',       form: 'Wir haben uns vertragen.',    audio: 'Wir haben uns vertragen',    translation: 'Мы помирились.' },
        { pronoun: 'вопрос',    form: 'Kennt ihr euch?',             audio: 'Kennt ihr euch',             translation: 'Вы знакомы?' }
      ]
    },
    {
      title: '⚡ Freund/Freundin: друг или пара?',
      body: 'Важная тонкость немецкого:<br><br>' +
            '<em><strong>mein</strong> Freund / <strong>meine</strong> Freundin</em> — чаще «мой парень / моя девушка»<br>' +
            '<em><strong>ein</strong> Freund von mir</em> — «один мой друг» (просто друг)<br><br>' +
            'Чтобы избежать двусмысленности, говорят: <em>ein guter Freund von mir</em>.',
      conjugation: [
        { pronoun: 'пара',    form: 'Das ist mein Freund.',        audio: 'Das ist mein Freund',        translation: 'Это мой парень.' },
        { pronoun: 'друг',    form: 'Das ist ein Freund von mir.', audio: 'Das ist ein Freund von mir', translation: 'Это мой друг.' },
        { pronoun: 'лучший',  form: 'mein bester Freund',          audio: 'mein bester Freund',         translation: 'мой лучший друг' }
      ]
    },
    {
      title: '💡 Perfekt возвратных глаголов',
      body: 'Возвратные глаголы образуют Perfekt всегда с <strong>haben</strong>:<br><br>' +
            '<em>Wir <strong>haben uns</strong> gestritten.</em> — Мы поссорились.<br>' +
            '<em>Ich <strong>habe mich</strong> entschuldigt.</em> — Я извинился.<br>' +
            '<em>Wir <strong>haben uns</strong> getroffen.</em> — Мы встретились.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wir kennen',           blank: 'uns',        after: 'seit der Schule.',        translation: '— Мы знакомы со школы.',              hintWord: 'uns',        hintRule: 'wir → uns (взаимно)' },
      { before: '— Wir verstehen uns sehr', blank: 'gut',      after: '.',                       translation: '— Мы очень хорошо ладим.',            hintWord: 'gut',        hintRule: 'sich gut verstehen' },
      { before: '— Ich kann mich auf ihn', blank: 'verlassen', after: '.',                       translation: '— Я могу на него положиться.',        hintWord: 'verlassen',  hintRule: 'sich verlassen auf' },
      { before: '— Wir',                  blank: 'treffen',    after: 'uns am Samstag.',         translation: '— Мы встречаемся в субботу.',         hintWord: 'treffen',    hintRule: 'sich treffen' },
      { before: '— Wir haben uns',        blank: 'gestritten', after: '.',                       translation: '— Мы поссорились.',                   hintWord: 'gestritten', hintRule: 'streiten → gestritten' },
      { before: '— Ich habe mich bei ihr', blank: 'entschuldigt', after: '.',                    translation: '— Я извинился перед ней.',            hintWord: 'entschuldigt', hintRule: 'sich entschuldigen bei' },
      { before: '— Ich',                  blank: 'vermisse',   after: 'dich.',                   translation: '— Я скучаю по тебе.',                 hintWord: 'vermisse',   hintRule: 'vermissen + Akkusativ' },
      { before: '— Wir haben viel',       blank: 'gemeinsam',  after: '.',                       translation: '— У нас много общего.',               hintWord: 'gemeinsam',  hintRule: 'gemeinsam — общее' }
    ],

    multipleChoice: [
      { question: '«Sich verstehen» значит…',                  options: ['ссориться', 'ладить', 'встречаться', 'скучать'],              correctIndex: 1 },
      { question: '«Das ist mein Freund» чаще значит…',        options: ['это мой коллега', 'это мой парень', 'это мой брат', 'это мой сосед'], correctIndex: 1 },
      { question: '«Просто друг» — как сказать?',              options: ['mein Freund', 'ein Freund von mir', 'der Freund', 'Freund'],  correctIndex: 1 },
      { question: '«Sich streiten» значит…',                   options: ['мириться', 'ссориться', 'дружить', 'болтать'],                correctIndex: 1 },
      { question: '«Vermissen» значит…',                       options: ['терять', 'скучать по', 'забывать', 'вспоминать'],             correctIndex: 1 },
      { question: '«Verheiratet» значит…',                     options: ['холостой', 'женатый', 'разведённый', 'влюблённый'],           correctIndex: 1 },
      { question: 'Возвратное для «ihr»…',                     options: ['uns', 'euch', 'sich', 'dich'],                                correctIndex: 1 },
      { question: '«Wir haben uns vertragen» значит…',         options: ['мы поссорились', 'мы помирились', 'мы расстались', 'мы встретились'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Freundschaft',  ru: 'дружба' },
      { id: 2, de: 'die Beziehung',     ru: 'отношения' },
      { id: 3, de: 'sich treffen',      ru: 'встречаться' },
      { id: 4, de: 'sich streiten',     ru: 'ссориться' },
      { id: 5, de: 'sich vertragen',    ru: 'мириться' },
      { id: 6, de: 'vermissen',         ru: 'скучать по' },
      { id: 7, de: 'das Vertrauen',     ru: 'доверие' },
      { id: 8, de: 'ledig',             ru: 'холостой' }
    ],

    dictation: [
      { word: 'Freundschaft', audio: 'Freundschaft' },
      { word: 'Beziehung',    audio: 'Beziehung' },
      { word: 'treffen',      audio: 'treffen' },
      { word: 'vermissen',    audio: 'vermissen' },
      { word: 'erzählen',     audio: 'erzählen' },
      { word: 'wichtig',      audio: 'wichtig' },
      { word: 'gemeinsam',    audio: 'gemeinsam' },
      { word: 'Vertrauen',    audio: 'Vertrauen' }
    ]
  }
};
