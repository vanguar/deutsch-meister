/* ═══════════════════════════════════════════════
   data/a2-lesson-01.js
   A2 · Урок 1: Mein Tagesablauf — Распорядок дня
                Отделяемые приставки и возвратные глаголы
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-01',
  level: 'A2',
  unit:  1,
  title: 'Mein Tagesablauf',
  subtitle: 'Распорядок дня · отделяемые приставки и возвратные глаголы',

  meta: {
    duration: '30–35 мин',
    wordCount: 26,
    xpReward: 120
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Ich stehe um sieben Uhr auf.',          ru: 'Я встаю в семь часов.',                     note: 'aufstehen — приставка auf- уходит в конец!', audio: 'Ich stehe um sieben Uhr auf' },
    { de: 'Ich wache früh auf.',                   ru: 'Я просыпаюсь рано.',                        note: 'aufwachen = просыпаться (отделяемая приставка)', audio: 'Ich wache früh auf' },
    { de: 'Ich wasche mich.',                      ru: 'Я умываюсь.',                               note: 'sich waschen — возвратный глагол. mich для «я»', audio: 'Ich wasche mich' },
    { de: 'Ich putze mir die Zähne.',              ru: 'Я чищу зубы.',                              note: 'Букв.: «я чищу себе зубы». mir — датив', audio: 'Ich putze mir die Zähne' },
    { de: 'Ich ziehe mich an.',                    ru: 'Я одеваюсь.',                               note: 'sich anziehen — возвратный + отделяемая приставка', audio: 'Ich ziehe mich an' },
    { de: 'Ich frühstücke um halb acht.',          ru: 'Я завтракаю в полвосьмого.',                note: 'halb acht = «половина к восьми» = 7:30', audio: 'Ich frühstücke um halb acht' },
    { de: 'Ich fahre zur Arbeit.',                 ru: 'Я еду на работу.',                          note: 'zur = zu + der (датив; направление)', audio: 'Ich fahre zur Arbeit' },
    { de: 'Ich beginne um neun mit der Arbeit.',   ru: 'Я начинаю работу в девять.',                note: 'beginnen mit + Dat. — начинать что-то', audio: 'Ich beginne um neun mit der Arbeit' },
    { de: 'Ich mache eine Pause.',                 ru: 'Я делаю перерыв.',                          note: 'eine Pause machen — устойчивое выражение', audio: 'Ich mache eine Pause' },
    { de: 'Ich esse zu Mittag.',                   ru: 'Я обедаю.',                                 note: 'zu Mittag essen = обедать. zu Abend essen = ужинать', audio: 'Ich esse zu Mittag' },
    { de: 'Ich kaufe ein.',                        ru: 'Я делаю покупки.',                          note: 'einkaufen — приставка ein- в конец', audio: 'Ich kaufe ein' },
    { de: 'Ich räume die Wohnung auf.',            ru: 'Я убираю квартиру.',                        note: 'aufräumen = убирать. die Wohnung — Akk.', audio: 'Ich räume die Wohnung auf' },
    { de: 'Ich rufe meine Mutter an.',             ru: 'Я звоню маме.',                             note: 'anrufen + Akk. (не «mit + Dat»!)', audio: 'Ich rufe meine Mutter an' },
    { de: 'Ich komme um sechs nach Hause.',        ru: 'Я прихожу домой в шесть.',                  note: 'nach Hause = домой (движение). zu Hause = дома', audio: 'Ich komme um sechs nach Hause' },
    { de: 'Ich ruhe mich aus.',                    ru: 'Я отдыхаю.',                                note: 'sich ausruhen — возвратный + отделяемая', audio: 'Ich ruhe mich aus' },
    { de: 'Ich sehe fern.',                        ru: 'Я смотрю телевизор.',                       note: 'fernsehen — буквально «смотреть далеко»', audio: 'Ich sehe fern' },
    { de: 'Ich treffe mich mit Freunden.',         ru: 'Я встречаюсь с друзьями.',                  note: 'sich treffen mit + Dat. = встречаться с', audio: 'Ich treffe mich mit Freunden' },
    { de: 'Ich ziehe mich um.',                    ru: 'Я переодеваюсь.',                           note: 'sich umziehen — возвратный + отделяемая', audio: 'Ich ziehe mich um' },
    { de: 'Ich dusche mich.',                      ru: 'Я принимаю душ.',                           note: 'sich duschen. Также: «Ich dusche» — без mich', audio: 'Ich dusche mich' },
    { de: 'Ich gehe um elf ins Bett.',             ru: 'Я ложусь спать в одиннадцать.',             note: 'ins Bett gehen — ложиться. ins = in + das', audio: 'Ich gehe um elf ins Bett' },
    { de: 'Ich schlafe gut.',                      ru: 'Я хорошо сплю.',                            note: 'schlafen — е → ä в du/er форме (du schläfst)', audio: 'Ich schlafe gut' },
    { de: 'Wann stehst du normalerweise auf?',     ru: 'Когда ты обычно встаёшь?',                  note: 'normalerweise = обычно. wann = когда', audio: 'Wann stehst du normalerweise auf' },
    { de: 'Wie sieht dein Tag aus?',               ru: 'Как выглядит твой день?',                   note: 'aussehen = выглядеть. Идиоматический вопрос', audio: 'Wie sieht dein Tag aus' },
    { de: 'Ich habe viel zu tun.',                 ru: 'У меня много дел.',                         note: 'viel zu tun haben — быть очень занятым', audio: 'Ich habe viel zu tun' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'aufstehen',        ru: 'вставать',                ipa: '[ˈaʊ̯fˌʃteːən]',       article: '' },
    { de: 'aufwachen',        ru: 'просыпаться',             ipa: '[ˈaʊ̯fˌvaxn̩]',         article: '' },
    { de: 'anziehen (sich)',  ru: 'одеваться',               ipa: '[ˈantsiːən]',           article: '' },
    { de: 'ausziehen (sich)', ru: 'раздеваться',             ipa: '[ˈaʊ̯stsiːən]',         article: '' },
    { de: 'umziehen (sich)',  ru: 'переодеваться',           ipa: '[ˈʊmtsiːən]',           article: '' },
    { de: 'waschen (sich)',   ru: 'умываться',               ipa: '[ˈvaʃn̩]',              article: '' },
    { de: 'duschen (sich)',   ru: 'принимать душ',           ipa: '[ˈdʊʃn̩]',              article: '' },
    { de: 'frühstücken',      ru: 'завтракать',              ipa: '[ˈfʁyːʃtʏkn̩]',         article: '' },
    { de: 'einkaufen',        ru: 'делать покупки',          ipa: '[ˈaɪ̯nˌkaʊ̯fn̩]',        article: '' },
    { de: 'aufräumen',        ru: 'убирать',                 ipa: '[ˈaʊ̯fˌʁɔɪ̯mən]',        article: '' },
    { de: 'anrufen',          ru: 'звонить (по тел.)',       ipa: '[ˈanˌʁuːfn̩]',          article: '' },
    { de: 'fernsehen',        ru: 'смотреть ТВ',             ipa: '[ˈfɛʁnˌzeːən]',         article: '' },
    { de: 'ausruhen (sich)',  ru: 'отдыхать',                ipa: '[ˈaʊ̯sˌʁuːən]',         article: '' },
    { de: 'treffen (sich)',   ru: 'встречаться',             ipa: '[ˈtʁɛfn̩]',             article: '' },
    { de: 'schlafen',         ru: 'спать',                   ipa: '[ˈʃlaːfn̩]',            article: '' },
    { de: 'der Tagesablauf',  ru: 'распорядок дня',          ipa: '[ˈtaːɡəsˌaplaʊ̯f]',     article: 'der' },
    { de: 'der Morgen',       ru: 'утро',                    ipa: '[ˈmɔʁɡn̩]',             article: 'der' },
    { de: 'der Mittag',       ru: 'полдень / обед',          ipa: '[ˈmɪtaːk]',             article: 'der' },
    { de: 'die Pause',        ru: 'перерыв',                 ipa: '[ˈpaʊ̯zə]',             article: 'die' },
    { de: 'die Arbeit',       ru: 'работа',                  ipa: '[ˈaʁbaɪ̯t]',            article: 'die' },
    { de: 'die Wohnung',      ru: 'квартира',                ipa: '[ˈvoːnʊŋ]',             article: 'die' },
    { de: 'die Zähne',        ru: 'зубы (мн.ч.)',            ipa: '[ˈtsɛːnə]',             article: 'die' },
    { de: 'das Bett',         ru: 'кровать',                 ipa: '[bɛt]',                 article: 'das' },
    { de: 'früh',             ru: 'рано',                    ipa: '[fʁyː]',                article: '' },
    { de: 'spät',             ru: 'поздно',                  ipa: '[ʃpɛːt]',               article: '' },
    { de: 'normalerweise',    ru: 'обычно',                  ipa: '[nɔʁˈmaːlɐvaɪ̯zə]',     article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Отделяемые приставки (trennbare Verben) — глагол на две части',
      body: 'Это сердце уровня A2. У многих глаголов есть приставка, которая <strong>отрывается</strong> и улетает в самый конец предложения:<br><br>' +
            '<em>aufstehen</em> → Ich <strong>stehe</strong> um sieben <strong>auf</strong>.<br>' +
            '<em>einkaufen</em> → Wir <strong>kaufen</strong> im Supermarkt <strong>ein</strong>.<br>' +
            '<em>fernsehen</em> → Er <strong>sieht</strong> jeden Abend <strong>fern</strong>.<br><br>' +
            'В словаре такой глагол пишется слитно (<em>aufstehen</em>), но в речи приставка отделяется. Ударение всегда на приставке: <strong>AUF</strong>stehen, <strong>EIN</strong>kaufen.<br><br>' +
            'Самые частые отделяемые приставки: <em>auf-, ein-, aus-, an-, ab-, mit-, vor-, zu-, fern-, um-, weiter-</em>.',
      conjugation: [
        { pronoun: 'ich',           form: 'stehe … auf',  audio: 'ich stehe auf',  translation: 'я встаю' },
        { pronoun: 'du',            form: 'stehst … auf', audio: 'du stehst auf',  translation: 'ты встаёшь' },
        { pronoun: 'er / sie / es', form: 'steht … auf',  audio: 'er steht auf',   translation: 'он/она встаёт' },
        { pronoun: 'wir',           form: 'stehen … auf', audio: 'wir stehen auf', translation: 'мы встаём' },
        { pronoun: 'ihr',           form: 'steht … auf',  audio: 'ihr steht auf',  translation: 'вы встаёте' },
        { pronoun: 'Sie / sie',     form: 'stehen … auf', audio: 'Sie stehen auf', translation: 'Вы / они встают' }
      ]
    },
    {
      title: '⚡ Возвратные глаголы (Reflexivverben) с sich',
      body: 'Многие действия, направленные «на себя», требуют <strong>возвратное местоимение</strong>. В словаре стоит <em>sich</em>:<br><br>' +
            '<em>sich waschen</em> — умываться<br>' +
            '<em>sich anziehen</em> — одеваться<br>' +
            '<em>sich treffen</em> — встречаться<br><br>' +
            'Местоимение меняется по лицам и обычно стоит <strong>сразу после глагола</strong>:<br>' +
            '<em>Ich wasche <strong>mich</strong>.</em> · <em>Du wäschst <strong>dich</strong>.</em> · <em>Er wäscht <strong>sich</strong>.</em><br><br>' +
            '⚠️ Если есть прямое дополнение (Akk.), местоимение переходит в <strong>датив</strong>: <em>Ich putze <strong>mir</strong> die Zähne</em> (себе — зубы).',
      conjugation: [
        { pronoun: 'ich',           form: 'mich / mir',  audio: 'mich mir',   translation: 'себя / себе' },
        { pronoun: 'du',            form: 'dich / dir',  audio: 'dich dir',   translation: 'себя / себе' },
        { pronoun: 'er / sie / es', form: 'sich',        audio: 'sich',       translation: 'себя / себе' },
        { pronoun: 'wir',           form: 'uns',         audio: 'uns',        translation: 'нас / нам' },
        { pronoun: 'ihr',           form: 'euch',        audio: 'euch',       translation: 'вас / вам' },
        { pronoun: 'Sie / sie',     form: 'sich',        audio: 'sich',       translation: 'себя / себе' }
      ]
    },
    {
      title: '💡 Время: um, gegen, halb, Viertel',
      body: 'Чтобы сказать <strong>когда</strong>, используй предлог <strong>um</strong> + время:<br><br>' +
            '<em>um 7 Uhr</em> — в 7 часов (точно)<br>' +
            '<em>gegen 7</em> — около 7 (приблизительно)<br>' +
            '<em>um halb acht</em> — в 7:30 («половина к восьми»!)<br>' +
            '<em>um Viertel nach acht</em> — в 8:15 («четверть после восьми»)<br>' +
            '<em>um Viertel vor neun</em> — в 8:45 («четверть до девяти»)<br><br>' +
            '⚠️ <strong>halb</strong> в немецком работает наоборот: <em>halb 8 = 7:30</em>, потому что это «половина пути к 8».'
    },
    {
      title: '💡 Время суток: am Morgen, am Abend',
      body: 'Когда речь о <strong>части дня</strong>, используем <strong>am</strong> (= an + dem):<br><br>' +
            '<em>am Morgen</em> — утром &nbsp;·&nbsp; <em>am Vormittag</em> — в первой половине дня<br>' +
            '<em>am Mittag</em> — в обед &nbsp;·&nbsp; <em>am Nachmittag</em> — во второй половине дня<br>' +
            '<em>am Abend</em> — вечером<br><br>' +
            '❗ Исключение: <em>in der Nacht</em> — ночью.<br><br>' +
            'Наречие тоже работает: <em>morgens, mittags, abends, nachts</em> — обычно по утрам / вечерам.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich',         blank: 'stehe',  after: 'um sieben Uhr auf.',     translation: '— Я встаю в семь часов.',            hintWord: 'stehe',  hintRule: 'aufstehen: основа в позиции 2, auf — в конец' },
      { before: '— Wir kaufen',  blank: 'ein',    after: '.',                       translation: '— Мы делаем покупки.',               hintWord: 'ein',    hintRule: 'einkaufen → приставка ein в конец' },
      { before: '— Ich wasche',  blank: 'mich',   after: '.',                       translation: '— Я умываюсь.',                      hintWord: 'mich',   hintRule: 'sich waschen → ich → mich (Akk.)' },
      { before: '— Du putzt',    blank: 'dir',    after: 'die Zähne.',              translation: '— Ты чистишь зубы.',                 hintWord: 'dir',    hintRule: 'есть прямое дополнение → датив: dir' },
      { before: '— Er sieht oft',blank: 'fern',   after: '.',                       translation: '— Он часто смотрит ТВ.',             hintWord: 'fern',   hintRule: 'fernsehen → fern в конец' },
      { before: '— Ich gehe',    blank: 'um',     after: 'elf ins Bett.',           translation: '— Я ложусь в одиннадцать.',          hintWord: 'um',     hintRule: 'предлог um + точное время' },
      { before: '— Sie ruft ihre Mutter', blank: 'an', after: '.',                  translation: '— Она звонит маме.',                 hintWord: 'an',     hintRule: 'anrufen → an в конец' },
      { before: '— Ich frühstücke um', blank: 'halb', after: 'acht.',               translation: '— Я завтракаю в полвосьмого.',       hintWord: 'halb',   hintRule: 'halb 8 = «половина к 8» = 7:30' }
    ],

    multipleChoice: [
      { question: 'Где приставка в предложении «Ich __ um 7 __»?',                 options: ['kaufe / ein', 'stehe / auf', 'esse / zu', 'mache / pause'],            correctIndex: 1 },
      { question: 'Какое местоимение нужно: «Ich wasche __ »?',                    options: ['sich', 'dich', 'mich', 'mir'],                                          correctIndex: 2 },
      { question: 'Что значит «halb acht»?',                                       options: ['8:30', '7:30', '8:00', '7:00'],                                         correctIndex: 1 },
      { question: 'Какой глагол означает «звонить по телефону»?',                  options: ['ausrufen', 'aufrufen', 'anrufen', 'einrufen'],                          correctIndex: 2 },
      { question: '«Ich ziehe __ an» — заполни пропуск.',                          options: ['mich', 'mir', 'sich', 'dich'],                                          correctIndex: 0 },
      { question: 'Как сказать «во второй половине дня»?',                        options: ['am Morgen', 'am Vormittag', 'am Nachmittag', 'in der Nacht'],          correctIndex: 2 },
      { question: 'Какая форма у «du» от глагола «schlafen»?',                     options: ['schlafst', 'schläfst', 'schlafest', 'schliefst'],                       correctIndex: 1 },
      { question: '«nach Hause» означает…',                                        options: ['дома', 'домой', 'из дома', 'около дома'],                              correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'aufstehen',          ru: 'вставать' },
      { id: 2, de: 'sich duschen',       ru: 'принимать душ' },
      { id: 3, de: 'frühstücken',        ru: 'завтракать' },
      { id: 4, de: 'einkaufen',          ru: 'делать покупки' },
      { id: 5, de: 'aufräumen',          ru: 'убирать' },
      { id: 6, de: 'sich ausruhen',      ru: 'отдыхать' },
      { id: 7, de: 'fernsehen',          ru: 'смотреть ТВ' },
      { id: 8, de: 'ins Bett gehen',     ru: 'ложиться спать' }
    ],

    dictation: [
      { word: 'aufstehen',    audio: 'aufstehen' },
      { word: 'frühstücken',  audio: 'frühstücken' },
      { word: 'duschen',      audio: 'duschen' },
      { word: 'anziehen',     audio: 'anziehen' },
      { word: 'einkaufen',    audio: 'einkaufen' },
      { word: 'fernsehen',    audio: 'fernsehen' },
      { word: 'schlafen',     audio: 'schlafen' },
      { word: 'Tagesablauf',  audio: 'Tagesablauf' }
    ]
  }
};
