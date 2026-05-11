/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-07.js
   B1 · Урок 7: Meinungen ausdrücken — Выражение мнений
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-07',
  level:    'B1',
  unit:     7,
  title:    'Meinungen ausdrücken',
  subtitle: 'Выражение мнений · Аргументация · Zustimmung und Ablehnung',

  meta: {
    duration:  '35–40 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Ich bin der Meinung, dass…',              ru: 'Я придерживаюсь мнения, что…',                  note: 'der Meinung sein + dass — выражение позиции', audio: 'Ich bin der Meinung, dass' },
    { de: 'Meiner Meinung nach ist das falsch.',     ru: 'По моему мнению, это неверно.',                 note: 'Meiner Meinung nach — по моему мнению', audio: 'Meiner Meinung nach ist das falsch' },
    { de: 'Ich finde, dass Lernen Spaß macht.',      ru: 'Я считаю, что учёба приносит удовольствие.',    note: 'finden + dass — считать', audio: 'Ich finde, dass Lernen Spaß macht' },
    { de: 'Ich denke, dass wir Recht haben.',        ru: 'Я думаю, что мы правы.',                        note: 'denken + dass — думать', audio: 'Ich denke, dass wir Recht haben' },
    { de: 'Ich glaube, dass es wichtig ist.',        ru: 'Я полагаю, что это важно.',                     note: 'glauben + dass — полагать', audio: 'Ich glaube, dass es wichtig ist' },
    { de: 'Da bin ich anderer Meinung.',             ru: 'Я придерживаюсь другого мнения.',               note: 'anderer Meinung sein — не соглашаться', audio: 'Da bin ich anderer Meinung' },
    { de: 'Ich stimme dir völlig zu.',               ru: 'Я полностью с тобой согласен.',                 note: 'zustimmen + Dat. — соглашаться', audio: 'Ich stimme dir völlig zu' },
    { de: 'Da haben Sie völlig Recht.',              ru: 'Вы совершенно правы.',                          note: 'Recht haben — быть правым', audio: 'Da haben Sie völlig Recht' },
    { de: 'Ich widerspreche dem nicht.',             ru: 'Я с этим не спорю.',                            note: 'widersprechen + Dat. — возражать', audio: 'Ich widerspreche dem nicht' },
    { de: 'Das sehe ich genauso.',                   ru: 'Я вижу это точно так же.',                      note: 'Das sehe ich genauso — полное согласие', audio: 'Das sehe ich genauso' },
    { de: 'Das halte ich für übertrieben.',          ru: 'Я считаю это преувеличением.',                  note: 'halten für + Akk. — считать чем-то', audio: 'Das halte ich für übertrieben' },
    { de: 'Einerseits …, andererseits …',           ru: 'С одной стороны …, с другой стороны …',         note: 'структура аргументации «за и против»', audio: 'Einerseits andererseits' },
    { de: 'Zum einen …, zum anderen …',             ru: 'Во-первых …, во-вторых …',                      note: 'также: erstens, zweitens', audio: 'Zum einen zum anderen' },
    { de: 'Hinzu kommt, dass…',                     ru: 'К тому же, что…',                               note: 'добавление аргумента', audio: 'Hinzu kommt, dass' },
    { de: 'Das Hauptargument ist, dass…',            ru: 'Главный аргумент состоит в том, что…',          note: 'das Hauptargument — главный аргумент', audio: 'Das Hauptargument ist, dass' },
    { de: 'Im Großen und Ganzen bin ich dafür.',     ru: 'В целом я за.',                                 note: 'im Großen und Ganzen — в целом', audio: 'Im Großen und Ganzen bin ich dafür' },
    { de: 'Ich bin dagegen, weil…',                 ru: 'Я против, потому что…',                         note: 'dagegen sein — быть против', audio: 'Ich bin dagegen, weil' },
    { de: 'Das überzeugt mich nicht.',              ru: 'Это меня не убеждает.',                         note: 'überzeugen — убеждать', audio: 'Das überzeugt mich nicht' },
    { de: 'Es kommt darauf an, ob…',               ru: 'Это зависит от того, …',                         note: 'es kommt darauf an — зависит от', audio: 'Es kommt darauf an, ob' },
    { de: 'Soweit ich weiß,…',                     ru: 'Насколько мне известно,…',                      note: 'soweit ich weiß — насколько я знаю', audio: 'Soweit ich weiß' },
    { de: 'Ich würde sagen, dass…',                 ru: 'Я бы сказал, что…',                             note: 'Konj. II — вежливое мнение', audio: 'Ich würde sagen, dass' },
    { de: 'Das ist eine gute Frage.',               ru: 'Это хороший вопрос.',                           note: 'выигрышная фраза в дискуссии', audio: 'Das ist eine gute Frage' },
    { de: 'Ich muss zugeben, dass…',                ru: 'Я должен признать, что…',                       note: 'zugeben — признавать', audio: 'Ich muss zugeben, dass' },
    { de: 'Zusammenfassend lässt sich sagen, dass…', ru: 'В заключение можно сказать, что…',             note: 'zusammenfassen — подводить итог', audio: 'Zusammenfassend lässt sich sagen, dass' }
  ],

  vocabulary: [
    { de: 'die Meinung',       ru: 'мнение',                    ipa: '[ˈmaɪ̯nʊŋ]',      article: 'die' },
    { de: 'die Ansicht',       ru: 'точка зрения',              ipa: '[ˈanzɪçt]',       article: 'die' },
    { de: 'das Argument',      ru: 'аргумент',                  ipa: '[aʁɡuˈmɛnt]',     article: 'das' },
    { de: 'die Zustimmung',    ru: 'согласие',                  ipa: '[ˈtsuːˌʃtɪmʊŋ]', article: 'die' },
    { de: 'die Ablehnung',     ru: 'отказ, несогласие',         ipa: '[ˈapleːnʊŋ]',     article: 'die' },
    { de: 'zustimmen',         ru: 'соглашаться',               ipa: '[ˈtsuːˌʃtɪmən]',  article: '' },
    { de: 'widersprechen',     ru: 'возражать',                 ipa: '[ˈviːdɐˌʃpʁɛçn̩]', article: '' },
    { de: 'überzeugen',        ru: 'убеждать',                  ipa: '[ˌyːbɐˈtsɔɪ̯ɡn̩]', article: '' },
    { de: 'dafür',             ru: 'за (согласен)',             ipa: '[daˈfyːʁ]',       article: '' },
    { de: 'dagegen',           ru: 'против',                   ipa: '[daˈɡeːɡn̩]',      article: '' },
    { de: 'einerseits',        ru: 'с одной стороны',           ipa: '[ˈaɪ̯nɐˌzaɪ̯ts]',  article: '' },
    { de: 'andererseits',      ru: 'с другой стороны',          ipa: '[ˈandərɐˌzaɪ̯ts]', article: '' },
    { de: 'hinzukommen',       ru: 'добавляться',               ipa: '[ˈhɪntsʊˌkɔmən]', article: '' },
    { de: 'übertrieben',       ru: 'преувеличенный',            ipa: '[ˌyːbɐˈtʁiːbn̩]', article: '' },
    { de: 'zugeben',           ru: 'признавать',                ipa: '[ˈtsuːˌɡeːbn̩]',  article: '' },
    { de: 'zusammenfassen',    ru: 'подводить итог',            ipa: '[tsuˈzamənˌfasn̩]', article: '' },
    { de: 'soweit',            ru: 'насколько',                 ipa: '[zoˈvaɪ̯t]',       article: '' },
    { de: 'völlig',            ru: 'полностью, совершенно',     ipa: '[ˈfœlɪç]',        article: '' },
    { de: 'genau',             ru: 'точно, именно',             ipa: '[ɡəˈnaʊ̯]',        article: '' },
    { de: 'genauso',           ru: 'точно так же',              ipa: '[ɡəˈnaʊ̯zoː]',     article: '' },
    { de: 'halten für',        ru: 'считать чем-то',            ipa: '[ˈhaltən fyːʁ]',  article: '' },
    { de: 'die Diskussion',    ru: 'дискуссия',                 ipa: '[dɪskuˈsi̯oːn]',   article: 'die' },
    { de: 'der Standpunkt',    ru: 'позиция, точка зрения',     ipa: '[ˈʃtantˌpʊŋkt]',  article: 'der' },
    { de: 'das Fazit',         ru: 'вывод, итог',               ipa: '[ˈfaːtsɪt]',       article: 'das' }
  ],

  grammar: [
    {
      title: '⚡ Конструкции для выражения мнения',
      body: 'Ключевые шаблоны для аргументации:<br><br>' +
            '<em>Ich <strong>bin der Meinung</strong>, dass…</em> — официально<br>' +
            '<em>Ich <strong>finde</strong>, dass…</em> — нейтрально<br>' +
            '<em>Ich <strong>denke</strong> / <strong>glaube</strong>, dass…</em> — нейтрально<br>' +
            '<em><strong>Meiner Meinung nach</strong> ist…</em> — по моему мнению<br>' +
            '<em>Ich <strong>würde sagen</strong>, dass…</em> — вежливо (Konj. II)<br><br>' +
            '⚠️ Все эти конструкции + <em>dass</em> → глагол в конец придаточного!',
      conjugation: [
        { pronoun: 'ich finde',           form: 'dass es wichtig ist',  audio: 'Ich finde, dass es wichtig ist',  translation: 'Я считаю, что это важно' },
        { pronoun: 'ich denke',           form: 'dass wir Recht haben', audio: 'Ich denke, dass wir Recht haben', translation: 'Я думаю, что мы правы' },
        { pronoun: 'ich glaube',          form: 'dass es stimmt',       audio: 'Ich glaube, dass es stimmt',      translation: 'Я полагаю, что это верно' },
        { pronoun: 'meiner Meinung nach', form: 'ist es falsch',        audio: 'Meiner Meinung nach ist es falsch', translation: 'По-моему, это неверно' },
        { pronoun: 'ich bin dafür',       form: 'weil…',                audio: 'Ich bin dafür, weil',             translation: 'Я за, потому что…' },
        { pronoun: 'ich bin dagegen',     form: 'weil…',                audio: 'Ich bin dagegen, weil',           translation: 'Я против, потому что…' }
      ]
    },
    {
      title: '💡 Структура аргументации',
      body: '<strong>Введение тезиса:</strong><br>' +
            '<em>Ich möchte über das Thema sprechen…</em><br><br>' +
            '<strong>Аргумент ЗА:</strong><br>' +
            '<em>Einerseits / Zum einen / Erstens…</em><br>' +
            '<em>Hinzu kommt, dass…</em> (добавление)<br><br>' +
            '<strong>Аргумент ПРОТИВ / уступка:</strong><br>' +
            '<em>Andererseits / Zum anderen…</em><br>' +
            '<em>Es stimmt zwar, dass … aber…</em><br><br>' +
            '<strong>Вывод:</strong><br>' +
            '<em>Zusammenfassend lässt sich sagen, dass…</em><br>' +
            '<em>Im Großen und Ganzen bin ich dafür / dagegen.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich bin der',         blank: 'Meinung',      after: ', dass das stimmt.',        translation: '— Я придерживаюсь мнения, что это верно.',  hintWord: 'Meinung',      hintRule: 'der Meinung sein' },
      { before: '— Ich stimme',          blank: 'dir',          after: 'völlig zu.',                translation: '— Я полностью с тобой согласен.',           hintWord: 'dir',          hintRule: 'zustimmen + Dativ' },
      { before: '—',                     blank: 'Einerseits',   after: 'ist es gut, andererseits…', translation: '— С одной стороны хорошо, с другой…',        hintWord: 'Einerseits',   hintRule: 'einerseits … andererseits' },
      { before: '— Das halte ich',       blank: 'für',          after: 'übertrieben.',              translation: '— Я считаю это преувеличением.',            hintWord: 'für',          hintRule: 'halten für + Akk.' },
      { before: '— Ich bin',             blank: 'dagegen',      after: ', weil es teuer ist.',      translation: '— Я против, потому что это дорого.',        hintWord: 'dagegen',      hintRule: 'dagegen sein — быть против' },
      { before: '— Das',                 blank: 'überzeugt',    after: 'mich nicht.',               translation: '— Это меня не убеждает.',                   hintWord: 'überzeugt',    hintRule: 'überzeugen — убеждать' },
      { before: '— Ich muss',            blank: 'zugeben',      after: ', dass er Recht hat.',      translation: '— Я должен признать, что он прав.',         hintWord: 'zugeben',      hintRule: 'zugeben — признавать' },
      { before: '— Meiner Meinung',      blank: 'nach',         after: 'ist das falsch.',           translation: '— По моему мнению, это неверно.',           hintWord: 'nach',         hintRule: 'Meiner Meinung nach — порядок слов!' }
    ],

    multipleChoice: [
      { question: 'Как сказать «я согласен»?',                            options: ['Ich widerspreche.', 'Ich stimme zu.', 'Ich bin dagegen.', 'Ich lehne ab.'],      correctIndex: 1 },
      { question: 'Что значит «einerseits»?',                             options: ['наконец', 'с одной стороны', 'к тому же', 'в целом'],                          correctIndex: 1 },
      { question: '«halten für + Akk.» значит…',                          options: ['держать', 'считать чем-то', 'выдерживать', 'держаться'],                       correctIndex: 1 },
      { question: 'Как завершить аргумент (вывод)?',                       options: ['Einerseits', 'Hinzu kommt', 'Zusammenfassend lässt sich sagen', 'Ich finde'], correctIndex: 2 },
      { question: '«Dagegen sein» = …',                                    options: ['быть за', 'быть против', 'быть нейтральным', 'быть удивлённым'],               correctIndex: 1 },
      { question: 'После «Ich bin der Meinung, ___» идёт:',               options: ['zu + Infinitiv', 'dass + глагол в конце', 'weil', 'ob'],                       correctIndex: 1 },
      { question: 'Синоним «Meiner Meinung nach»:',                        options: ['Ich denke, dass', 'Nach meiner Ansicht', 'Im Großen und Ganzen', 'Zugeben'],  correctIndex: 1 },
      { question: '«überzeugen» значит…',                                  options: ['убеждать', 'удивлять', 'спрашивать', 'отвечать'],                             correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'zustimmen',          ru: 'соглашаться' },
      { id: 2, de: 'widersprechen',      ru: 'возражать' },
      { id: 3, de: 'überzeugen',         ru: 'убеждать' },
      { id: 4, de: 'einerseits',         ru: 'с одной стороны' },
      { id: 5, de: 'andererseits',       ru: 'с другой стороны' },
      { id: 6, de: 'dafür',              ru: 'за' },
      { id: 7, de: 'dagegen',            ru: 'против' },
      { id: 8, de: 'zusammenfassen',     ru: 'подводить итог' }
    ],

    dictation: [
      { word: 'Meinung',          audio: 'Meinung' },
      { word: 'zustimmen',        audio: 'zustimmen' },
      { word: 'widersprechen',    audio: 'widersprechen' },
      { word: 'einerseits',       audio: 'einerseits' },
      { word: 'andererseits',     audio: 'andererseits' },
      { word: 'überzeugen',       audio: 'überzeugen' },
      { word: 'Argument',         audio: 'Argument' },
      { word: 'Zusammenfassung',  audio: 'Zusammenfassung' }
    ]
  }
};
