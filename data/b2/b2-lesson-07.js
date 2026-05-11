/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-07.js
   B2 · Урок 7: Debatte und Argumentation — Дискуссия и аргументация
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-07',
  level:    'B2',
  unit:     7,
  title:    'Debatte und Argumentation',
  subtitle: 'Дискуссия и аргументация · Rhetorische Mittel',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Ich möchte zunächst auf den Kern des Problems eingehen.', ru: 'Для начала хотел бы обратиться к сути проблемы.', note: 'eingehen auf + Akk. — обращаться к теме', audio: 'Ich möchte zunächst auf den Kern des Problems eingehen' },
    { de: 'Es stimmt zwar, dass … , aber …',                        ru: 'Это конечно верно, что … , однако …',           note: 'zwar … aber — риторическое уступительное', audio: 'Es stimmt zwar, dass, aber' },
    { de: 'Ich teile diese Ansicht nicht vollständig.',             ru: 'Я не вполне разделяю эту точку зрения.',        note: 'teilen — разделять (мнение)', audio: 'Ich teile diese Ansicht nicht vollständig' },
    { de: 'Das führt mich zu meinem nächsten Punkt.',               ru: 'Это подводит меня к следующему пункту.',        note: 'strukturierende Phrase', audio: 'Das führt mich zu meinem nächsten Punkt' },
    { de: 'Erlauben Sie mir, das zu konkretisieren.',               ru: 'Позвольте мне конкретизировать это.',           note: 'вежливое уточнение', audio: 'Erlauben Sie mir, das zu konkretisieren' },
    { de: 'Im Gegensatz dazu möchte ich behaupten, dass…',         ru: 'В отличие от этого я хотел бы утверждать, что…', note: 'im Gegensatz dazu — в отличие от этого', audio: 'Im Gegensatz dazu möchte ich behaupten, dass' },
    { de: 'Dieser Einwand ist durchaus berechtigt.',                ru: 'Это возражение вполне обосновано.',             note: 'der Einwand — возражение; berechtigt — обоснованный', audio: 'Dieser Einwand ist durchaus berechtigt' },
    { de: 'Lassen Sie mich das an einem Beispiel verdeutlichen.',   ru: 'Позвольте проиллюстрировать это на примере.',  note: 'verdeutlichen — наглядно показать', audio: 'Lassen Sie mich das an einem Beispiel verdeutlichen' },
    { de: 'Die Fakten sprechen für sich.',                          ru: 'Факты говорят сами за себя.',                   note: 'für sich sprechen — говорить самим по себе', audio: 'Die Fakten sprechen für sich' },
    { de: 'Ich möchte dem widersprechen.',                          ru: 'Я хотел бы возразить на это.',                  note: 'widersprechen + Dat. — возражать', audio: 'Ich möchte dem widersprechen' },
    { de: 'Aus meiner Perspektive sieht das anders aus.',           ru: 'С моей точки зрения это выглядит иначе.',       note: 'aus der Perspektive — с точки зрения', audio: 'Aus meiner Perspektive sieht das anders aus' },
    { de: 'Das ist ein schlagendes Argument.',                      ru: 'Это весомый аргумент.',                         note: 'schlagend — весомый, убедительный', audio: 'Das ist ein schlagendes Argument' },
    { de: 'Ich gebe zu, dass das eine Schwäche meines Arguments ist.', ru: 'Признаю, что это слабое место моего аргумента.', note: 'zugeben — признавать', audio: 'Ich gebe zu, dass das eine Schwäche meines Arguments ist' },
    { de: 'Die empirischen Belege stützen diese These.',            ru: 'Эмпирические данные подтверждают этот тезис.', note: 'die Belege — доказательства; stützen — подкреплять', audio: 'Die empirischen Belege stützen diese These' },
    { de: 'Um die Diskussion zu strukturieren,…',                   ru: 'Чтобы структурировать дискуссию,…',            note: 'strukturieren — структурировать', audio: 'Um die Diskussion zu strukturieren' },
    { de: 'Das ist ein Trugschluss.',                               ru: 'Это логическая ошибка.',                        note: 'der Trugschluss — логическая ошибка, заблуждение', audio: 'Das ist ein Trugschluss' },
    { de: 'Ich plädiere für einen ausgewogenen Ansatz.',            ru: 'Я выступаю за взвешенный подход.',              note: 'plädieren für — выступать за; ausgewogen — взвешенный', audio: 'Ich plädiere für einen ausgewogenen Ansatz' },
    { de: 'Das geht an der eigentlichen Frage vorbei.',             ru: 'Это не касается собственно вопроса.',           note: 'an der Frage vorbeigehen — уклоняться от вопроса', audio: 'Das geht an der eigentlichen Frage vorbei' },
    { de: 'Die Gegenpartei übersieht einen wichtigen Aspekt.',      ru: 'Противная сторона упускает важный аспект.',    note: 'übersehen — упускать из виду', audio: 'Die Gegenpartei übersieht einen wichtigen Aspekt' },
    { de: 'Ich stimme dem im Grundsatz zu, jedoch…',               ru: 'В принципе я согласен, однако…',               note: 'im Grundsatz — в принципе', audio: 'Ich stimme dem im Grundsatz zu, jedoch' },
    { de: 'Um auf den Ausgangspunkt zurückzukommen,…',             ru: 'Возвращаясь к отправной точке,…',               note: 'auf den Ausgangspunkt zurückkommen', audio: 'Um auf den Ausgangspunkt zurückzukommen' },
    { de: 'Mein Fazit lautet deshalb wie folgt:',                  ru: 'Поэтому мой вывод таков:',                     note: 'das Fazit — итог, вывод; lautet — гласит', audio: 'Mein Fazit lautet deshalb wie folgt' },
    { de: 'Ein starkes Argument muss nachvollziehbar sein.',        ru: 'Сильный аргумент должен быть понятен.',        note: 'nachvollziehbar — понятный, прослеживаемый', audio: 'Ein starkes Argument muss nachvollziehbar sein' },
    { de: 'Lassen wir die Daten für sich sprechen.',               ru: 'Пусть данные говорят сами за себя.',           note: 'Lassen + Akk. + Infinitiv', audio: 'Lassen wir die Daten für sich sprechen' }
  ],

  vocabulary: [
    { de: 'die These',          ru: 'тезис',                      ipa: '[ˈteːzə]',           article: 'die' },
    { de: 'der Einwand',        ru: 'возражение',                 ipa: '[ˈaɪ̯nvant]',         article: 'der' },
    { de: 'der Beleg',          ru: 'доказательство',             ipa: '[bəˈleːk]',           article: 'der' },
    { de: 'der Trugschluss',    ru: 'логическая ошибка',          ipa: '[ˈtʁuːkˌʃlʊs]',      article: 'der' },
    { de: 'das Fazit',          ru: 'вывод, итог',                ipa: '[ˈfaːtsɪt]',          article: 'das' },
    { de: 'die Gegenpartei',    ru: 'противная сторона',          ipa: '[ˈɡeːɡn̩paʁˌtaɪ̯]',   article: 'die' },
    { de: 'die Perspektive',    ru: 'перспектива, точка зрения',  ipa: '[pɛʁspɛkˈtiːvə]',    article: 'die' },
    { de: 'stützen',            ru: 'подкреплять',                ipa: '[ˈʃtʏtsn̩]',          article: '' },
    { de: 'plädieren für',      ru: 'выступать за',               ipa: '[plɛˈdiːʁən fyːʁ]',  article: '' },
    { de: 'widersprechen',      ru: 'возражать',                  ipa: '[ˈviːdɐˌʃpʁɛçn̩]',   article: '' },
    { de: 'verdeutlichen',      ru: 'наглядно показывать',        ipa: '[fɛʁˈdɔɪ̯tlɪçn̩]',    article: '' },
    { de: 'behaupten',          ru: 'утверждать',                 ipa: '[bəˈhaʊ̯ptn̩]',        article: '' },
    { de: 'zugeben',            ru: 'признавать',                 ipa: '[ˈtsuːˌɡeːbn̩]',      article: '' },
    { de: 'übersehen',          ru: 'упускать из виду',           ipa: '[ˌyːbɐˈzeːən]',       article: '' },
    { de: 'ausgewogen',         ru: 'взвешенный, сбалансированный', ipa: '[ˈaʊ̯sɡəˌvoːɡn̩]',  article: '' },
    { de: 'berechtigt',         ru: 'обоснованный',               ipa: '[bəˈʁɛçtɪçt]',       article: '' },
    { de: 'nachvollziehbar',    ru: 'понятный, прослеживаемый',   ipa: '[ˈnaːxfɔlˌtsiːbaʁ]', article: '' },
    { de: 'schlagend',          ru: 'убедительный, весомый',      ipa: '[ˈʃlaːɡn̩t]',         article: '' },
    { de: 'empirisch',          ru: 'эмпирический',               ipa: '[ɛmˈpiːʁɪʃ]',        article: '' },
    { de: 'der Ausgangspunkt',  ru: 'отправная точка',            ipa: '[ˈaʊ̯sɡaŋsˌpʊŋkt]',  article: 'der' },
    { de: 'der Kern',           ru: 'суть, ядро',                 ipa: '[kɛʁn]',              article: 'der' },
    { de: 'strukturieren',      ru: 'структурировать',            ipa: '[ʃtʁʊktuˈʁiːʁən]',   article: '' },
    { de: 'konkretisieren',     ru: 'конкретизировать',           ipa: '[kɔŋkʁetiˈziːʁən]',  article: '' },
    { de: 'im Grundsatz',       ru: 'в принципе',                 ipa: '[ɪm ˈɡʁʊntˌzats]',   article: '' }
  ],

  grammar: [
    {
      title: '⚡ Риторические конструкции в дискуссии',
      body: '<strong>Уступка + контраргумент</strong>:<br>' +
            '<em>Es stimmt <strong>zwar</strong>, dass X, <strong>aber</strong> Y.</em><br>' +
            '<em>X stimmt <strong>zwar</strong>, <strong>jedoch</strong>…</em><br><br>' +
            '<strong>Противопоставление</strong>:<br>' +
            '<em>Im Gegensatz <strong>dazu</strong>…</em><br>' +
            '<em>Im Gegensatz <strong>zu</strong> dem, was gesagt wurde,…</em><br><br>' +
            '<strong>Уклонение или возражение</strong>:<br>' +
            '<em>Das geht an der eigentlichen Frage <strong>vorbei</strong>.</em><br>' +
            '<em>Ich möchte dem <strong>widersprechen</strong>.</em><br><br>' +
            '<strong>Инклюзивное согласие + но</strong>:<br>' +
            '<em>Ich stimme dem <strong>im Grundsatz</strong> zu, <strong>jedoch</strong>…</em>',
      conjugation: [
        { pronoun: 'Tese einführen',  form: 'Ich möchte behaupten, dass…',     audio: 'Ich möchte behaupten, dass',    translation: 'Хочу утверждать, что…' },
        { pronoun: 'Uступка',         form: 'Es stimmt zwar, dass…, aber…',    audio: 'Es stimmt zwar, dass, aber',    translation: 'Хотя … верно, однако…' },
        { pronoun: 'Widerspruch',     form: 'Ich möchte dem widersprechen.',   audio: 'Ich möchte dem widersprechen',  translation: 'Хочу возразить.' },
        { pronoun: 'Beispiel',        form: 'Lassen Sie mich das verdeutlichen.', audio: 'Lassen Sie mich das verdeutlichen', translation: 'Позвольте пояснить.' },
        { pronoun: 'Schluss',         form: 'Mein Fazit lautet: …',            audio: 'Mein Fazit lautet',             translation: 'Мой вывод таков:' },
        { pronoun: 'Rückbezug',       form: 'Um auf den Punkt zurückzukommen,', audio: 'Um auf den Punkt zurückzukommen', translation: 'Возвращаясь к исходному...' }
      ]
    },
    {
      title: '💡 Структура академического/дебатного текста',
      body: '<strong>1. Введение тезиса:</strong><br>' +
            '<em>Ich möchte zunächst auf den Kern eingehen…</em><br><br>' +
            '<strong>2. Аргументы:</strong><br>' +
            '<em>Erstens… / Hinzu kommt, dass…</em><br>' +
            '<em>Die Fakten sprechen für sich.</em><br><br>' +
            '<strong>3. Уступка:</strong><br>' +
            '<em>Dieser Einwand ist berechtigt; dennoch…</em><br><br>' +
            '<strong>4. Контраргумент:</strong><br>' +
            '<em>Im Gegensatz dazu…</em><br><br>' +
            '<strong>5. Заключение:</strong><br>' +
            '<em>Mein Fazit lautet deshalb wie folgt:…</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Es stimmt',          blank: 'zwar',        after: ', dass X, aber Y.',        translation: '— Это конечно верно, что X, но Y.',    hintWord: 'zwar',        hintRule: 'zwar … aber — уступка + контраргумент' },
      { before: '— Ich möchte dem',     blank: 'widersprechen', after: '.',                      translation: '— Хочу возразить.',                    hintWord: 'widersprechen', hintRule: 'widersprechen + Dativ' },
      { before: '— Dieser Einwand ist', blank: 'berechtigt',  after: '.',                        translation: '— Это возражение обосновано.',          hintWord: 'berechtigt',  hintRule: 'berechtigt — обоснованный' },
      { before: '— Mein',               blank: 'Fazit',       after: 'lautet wie folgt:',        translation: '— Мой вывод таков:',                   hintWord: 'Fazit',       hintRule: 'das Fazit — итог, вывод' },
      { before: '— Im',                 blank: 'Gegensatz',   after: 'dazu möchte ich sagen,…', translation: '— В отличие от этого я бы сказал,…',  hintWord: 'Gegensatz',   hintRule: 'im Gegensatz dazu — в отличие' },
      { before: '— Die',                blank: 'Fakten',      after: 'sprechen für sich.',       translation: '— Факты говорят сами за себя.',        hintWord: 'Fakten',      hintRule: 'Fakten — факты (множ.)' },
      { before: '— Ich plädiere',       blank: 'für',         after: 'einen ausgewogenen Ansatz.', translation: '— Я выступаю за взвешенный подход.', hintWord: 'für',         hintRule: 'plädieren für + Akk.' },
      { before: '— Das ist ein',        blank: 'Trugschluss', after: '.',                        translation: '— Это логическая ошибка.',             hintWord: 'Trugschluss', hintRule: 'der Trugschluss — ошибочный вывод' }
    ],

    multipleChoice: [
      { question: '«zwar … aber» используется для…',                       options: ['добавления аргумента', 'уступки + контраргумента', 'вывода', 'вопроса'], correctIndex: 1 },
      { question: '«Der Einwand» — это…',                                   options: ['тезис', 'возражение', 'вывод', 'пример'],                             correctIndex: 1 },
      { question: '«Plädieren für» значит…',                                 options: ['возражать', 'выступать за', 'сомневаться', 'отвергать'],              correctIndex: 1 },
      { question: '«Das Fazit» — это…',                                      options: ['введение', 'вывод', 'аргумент', 'пример'],                           correctIndex: 1 },
      { question: '«Berechtigt» в дискуссии значит…',                        options: ['неверный', 'обоснованный', 'риторический', 'риторический'],         correctIndex: 1 },
      { question: '«Übersehen» в аргументации значит…',                      options: ['наблюдать', 'упускать из виду', 'видеть', 'рассматривать'],         correctIndex: 1 },
      { question: '«Im Grundsatz» = …',                                      options: ['в деталях', 'в принципе', 'в заключение', 'в частности'],           correctIndex: 1 },
      { question: '«Nachvollziehbar» = …',                                   options: ['непонятный', 'понятный/прослеживаемый', 'ошибочный', 'риторический'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die These',       ru: 'тезис' },
      { id: 2, de: 'der Einwand',     ru: 'возражение' },
      { id: 3, de: 'der Beleg',       ru: 'доказательство' },
      { id: 4, de: 'das Fazit',       ru: 'итог, вывод' },
      { id: 5, de: 'berechtigt',      ru: 'обоснованный' },
      { id: 6, de: 'widersprechen',   ru: 'возражать' },
      { id: 7, de: 'plädieren für',   ru: 'выступать за' },
      { id: 8, de: 'Trugschluss',     ru: 'логическая ошибка' }
    ],

    dictation: [
      { word: 'These',          audio: 'These' },
      { word: 'Einwand',        audio: 'Einwand' },
      { word: 'Fazit',          audio: 'Fazit' },
      { word: 'berechtigt',     audio: 'berechtigt' },
      { word: 'widersprechen',  audio: 'widersprechen' },
      { word: 'ausgewogen',     audio: 'ausgewogen' },
      { word: 'Trugschluss',    audio: 'Trugschluss' },
      { word: 'Perspektive',    audio: 'Perspektive' }
    ]
  }
};
