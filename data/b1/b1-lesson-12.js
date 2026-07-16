/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-12.js
   B1 · Урок 12: Verben mit Präpositionen — глаголы с предлогами
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-12',
  level:    'B1',
  unit:     12,
  title:    'Verben mit Präpositionen',
  subtitle: 'Глаголы с предлогами · warten auf, denken an, sich interessieren für',

  meta: {
    duration:  '35–40 мин',
    wordCount: 20,
    xpReward:  150
  },

  phrases: [
    { de: 'Ich warte auf den Bus.',                             ru: 'Я жду автобус.',                                   note: 'warten auf + Akkusativ', audio: 'Ich warte auf den Bus' },
    { de: 'Sie denkt oft an ihre Familie.',                     ru: 'Она часто думает о своей семье.',                  note: 'denken an + Akkusativ', audio: 'Sie denkt oft an ihre Familie' },
    { de: 'Ich interessiere mich für Geschichte.',              ru: 'Я интересуюсь историей.',                          note: 'sich interessieren für + Akk.', audio: 'Ich interessiere mich für Geschichte' },
    { de: 'Er freut sich auf den Urlaub.',                      ru: 'Он с нетерпением ждёт отпуска.',                   note: 'freuen auf = будущее', audio: 'Er freut sich auf den Urlaub' },
    { de: 'Wir freuen uns über das Geschenk.',                  ru: 'Мы рады подарку.',                                 note: 'freuen über = уже есть', audio: 'Wir freuen uns über das Geschenk' },
    { de: 'Ich träume von einem Haus am Meer.',                 ru: 'Я мечтаю о доме у моря.',                          note: 'träumen von + Dativ', audio: 'Ich träume von einem Haus am Meer' },
    { de: 'Sie erzählt von ihrer Reise nach Italien.',          ru: 'Она рассказывает о своей поездке в Италию.',       note: 'erzählen von + Dativ', audio: 'Sie erzählt von ihrer Reise nach Italien' },
    { de: 'Er ärgert sich über den Lärm.',                      ru: 'Он злится из-за шума.',                            note: 'sich ärgern über + Akk.', audio: 'Er ärgert sich über den Lärm' },
    { de: 'Ich kümmere mich um meine Großmutter.',              ru: 'Я забочусь о своей бабушке.',                      note: 'sich kümmern um + Akk.', audio: 'Ich kümmere mich um meine Großmutter' },
    { de: 'Wir sprechen über das neue Projekt.',                ru: 'Мы говорим о новом проекте.',                      note: 'sprechen über + Akk.', audio: 'Wir sprechen über das neue Projekt' },
    { de: 'Das hängt vom Wetter ab.',                           ru: 'Это зависит от погоды.',                           note: 'abhängen von + Dativ', audio: 'Das hängt vom Wetter ab' },
    { de: 'Ich bedanke mich für Ihre Hilfe.',                   ru: 'Благодарю вас за помощь.',                         note: 'sich bedanken für + Akk.', audio: 'Ich bedanke mich für Ihre Hilfe' },
    { de: 'Sie nimmt an einem Deutschkurs teil.',               ru: 'Она участвует в курсе немецкого.',                 note: 'teilnehmen an + Dativ', audio: 'Sie nimmt an einem Deutschkurs teil' },
    { de: 'Er hat Angst vor Spinnen.',                          ru: 'Он боится пауков.',                                note: 'Angst haben vor + Dativ', audio: 'Er hat Angst vor Spinnen' },
    { de: 'Ich erinnere mich gern an meine Schulzeit.',         ru: 'Я с удовольствием вспоминаю школьные годы.',       note: 'sich erinnern an + Akk.', audio: 'Ich erinnere mich gern an meine Schulzeit' },
    { de: 'Worauf wartest du? — Auf eine Antwort.',             ru: 'Чего ты ждёшь? — Ответа.',                         note: 'wo(r) + предлог = вопрос о предмете', audio: 'Worauf wartest du. Auf eine Antwort' },
    { de: 'Woran denkst du? — Daran, dass morgen Montag ist.',  ru: 'О чём ты думаешь? — О том, что завтра понедельник.', note: 'da(r) + предлог = «о том»', audio: 'Woran denkst du. Daran, dass morgen Montag ist' },
    { de: 'Auf wen wartest du? — Auf meinen Bruder.',           ru: 'Кого ты ждёшь? — Своего брата.',                   note: 'о человеке: Präposition + wen/wem', audio: 'Auf wen wartest du. Auf meinen Bruder' },
    { de: 'Ich beschäftige mich viel mit Musik.',               ru: 'Я много занимаюсь музыкой.',                       note: 'sich beschäftigen mit + Dativ', audio: 'Ich beschäftige mich viel mit Musik' },
    { de: 'Es geht um deine Zukunft!',                          ru: 'Речь идёт о твоём будущем!',                       note: 'es geht um + Akk.', audio: 'Es geht um deine Zukunft' }
  ],

  vocabulary: [
    { de: 'warten auf (+A)',            ru: 'ждать кого-то/что-то',        ipa: '[ˈvaʁtn̩ aʊ̯f]',      article: '' },
    { de: 'denken an (+A)',             ru: 'думать о',                     ipa: '[ˈdɛŋkn̩ an]',        article: '' },
    { de: 'sich interessieren für (+A)', ru: 'интересоваться',              ipa: '[ɪntəʁɛˈsiːʁən]',     article: '' },
    { de: 'sich freuen auf (+A)',       ru: 'ждать с нетерпением',          ipa: '[ˈfʁɔɪ̯ən aʊ̯f]',     article: '' },
    { de: 'sich freuen über (+A)',      ru: 'радоваться (тому, что есть)',  ipa: '[ˈfʁɔɪ̯ən ˈyːbɐ]',    article: '' },
    { de: 'träumen von (+D)',           ru: 'мечтать о',                    ipa: '[ˈtʁɔɪ̯mən fɔn]',     article: '' },
    { de: 'erzählen von (+D)',          ru: 'рассказывать о',               ipa: '[ɛʁˈt͡sɛːlən fɔn]',   article: '' },
    { de: 'sich ärgern über (+A)',      ru: 'злиться на/из-за',             ipa: '[ˈɛʁɡɐn ˈyːbɐ]',      article: '' },
    { de: 'sich kümmern um (+A)',       ru: 'заботиться о',                 ipa: '[ˈkʏmɐn ʊm]',         article: '' },
    { de: 'sprechen über (+A)',         ru: 'говорить о',                   ipa: '[ˈʃpʁɛçn̩ ˈyːbɐ]',    article: '' },
    { de: 'abhängen von (+D)',          ru: 'зависеть от',                  ipa: '[ˈaphɛŋən fɔn]',      article: '' },
    { de: 'sich bedanken für (+A)',     ru: 'благодарить за',               ipa: '[bəˈdaŋkn̩ fyːɐ̯]',   article: '' },
    { de: 'teilnehmen an (+D)',         ru: 'участвовать в',                ipa: '[ˈtaɪ̯lneːmən an]',   article: '' },
    { de: 'Angst haben vor (+D)',       ru: 'бояться',                      ipa: '[aŋst ˈhaːbn̩ foːɐ̯]', article: '' },
    { de: 'sich erinnern an (+A)',      ru: 'вспоминать, помнить о',        ipa: '[ɛʁˈʔɪnɐn an]',       article: '' },
    { de: 'sich beschäftigen mit (+D)', ru: 'заниматься чем-то',            ipa: '[bəˈʃɛftɪɡn̩ mɪt]',   article: '' },
    { de: 'es geht um (+A)',            ru: 'речь идёт о',                  ipa: '[ɛs ɡeːt ʊm]',        article: '' },
    { de: 'der Lärm',                   ru: 'шум',                          ipa: '[lɛʁm]',              article: 'der' },
    { de: 'die Spinne',                 ru: 'паук',                         ipa: '[ˈʃpɪnə]',            article: 'die' },
    { de: 'die Schulzeit',              ru: 'школьные годы',                ipa: '[ˈʃuːlt͡saɪ̯t]',      article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Глагол + предлог = единое целое',
      body: 'Многие немецкие глаголы «женаты» на определённом предлоге, и его нельзя менять:<br><br>' +
            '<em>warten <strong>auf</strong></em> (не «warten für»!), <em>denken <strong>an</strong></em>, <em>träumen <strong>von</strong></em>.<br><br>' +
            '⚠️ Предлог часто <em>не совпадает</em> с русским: «ждать кого-то» → <em>warten <strong>auf</strong> + Akkusativ</em>.<br><br>' +
            'Учи глагол сразу с предлогом и падежом: <strong>warten auf + A</strong>.',
      conjugation: [
        { pronoun: 'auf + A',  form: 'Ich warte auf den Bus.',            audio: 'Ich warte auf den Bus',            translation: 'Я жду автобус.' },
        { pronoun: 'an + A',   form: 'Ich denke an dich.',                audio: 'Ich denke an dich',                translation: 'Я думаю о тебе.' },
        { pronoun: 'von + D',  form: 'Ich träume von einer Reise.',       audio: 'Ich träume von einer Reise',       translation: 'Я мечтаю о путешествии.' },
        { pronoun: 'für + A',  form: 'Ich interessiere mich für Kunst.',  audio: 'Ich interessiere mich für Kunst',  translation: 'Я интересуюсь искусством.' },
        { pronoun: 'um + A',   form: 'Ich kümmere mich um die Kinder.',   audio: 'Ich kümmere mich um die Kinder',   translation: 'Я забочусь о детях.' },
        { pronoun: 'vor + D',  form: 'Ich habe Angst vor Hunden.',        audio: 'Ich habe Angst vor Hunden',        translation: 'Я боюсь собак.' }
      ]
    },
    {
      title: '⚡ Вопросы: worauf? / auf wen?',
      body: 'Спрашиваем о <strong>предмете</strong> → <strong>wo(r) + предлог</strong>:<br>' +
            '<em><strong>Worauf</strong> wartest du?</em> — Чего ты ждёшь?<br>' +
            '<em><strong>Woran</strong> denkst du?</em> — О чём ты думаешь?<br><br>' +
            'Спрашиваем о <strong>человеке</strong> → <strong>предлог + wen/wem</strong>:<br>' +
            '<em><strong>Auf wen</strong> wartest du?</em> — Кого ты ждёшь?<br><br>' +
            'Отвечаем о предмете через <strong>da(r) + предлог</strong>: <em>Ich denke <strong>daran</strong>, dass…</em> — Я думаю о том, что…<br>' +
            '(-r- вставляется, если предлог начинается с гласной: wor<strong>auf</strong>, dar<strong>an</strong>, wor<strong>über</strong>.)',
      conjugation: [
        { pronoun: 'предмет',  form: 'Worauf wartest du?',       audio: 'Worauf wartest du',       translation: 'Чего ты ждёшь?' },
        { pronoun: 'человек',  form: 'Auf wen wartest du?',      audio: 'Auf wen wartest du',      translation: 'Кого ты ждёшь?' },
        { pronoun: 'ответ',    form: 'Ich warte darauf.',        audio: 'Ich warte darauf',        translation: 'Я жду этого.' },
        { pronoun: 'da + dass', form: 'Ich freue mich darauf, dass du kommst.', audio: 'Ich freue mich darauf, dass du kommst', translation: 'Я рад, что ты придёшь.' }
      ]
    },
    {
      title: '💡 freuen auf vs. freuen über — повторение',
      body: 'Классика, которую спрашивают на каждом экзамене (знакомо с A2, урок 12):<br><br>' +
            '<strong>sich freuen auf + A</strong> — радоваться тому, что <em>будет</em>: <em>Ich freue mich auf das Wochenende.</em><br>' +
            '<strong>sich freuen über + A</strong> — радоваться тому, что <em>уже есть</em>: <em>Ich freue mich über das Geschenk.</em><br><br>' +
            'Такая же пара: <strong>denken an</strong> (думать о) vs. <strong>nachdenken über</strong> (размышлять над).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich warte',           blank: 'auf',     after: 'den Bus.',                     translation: '— Я жду автобус.',                       hintWord: 'auf',     hintRule: 'warten auf + Akk.' },
      { before: '— Sie denkt oft',       blank: 'an',      after: 'ihre Familie.',                translation: '— Она часто думает о семье.',            hintWord: 'an',      hintRule: 'denken an + Akk.' },
      { before: '— Ich interessiere mich', blank: 'für',   after: 'Musik.',                       translation: '— Я интересуюсь музыкой.',               hintWord: 'für',     hintRule: 'sich interessieren für' },
      { before: '— Er träumt',           blank: 'von',     after: 'einem Auto.',                  translation: '— Он мечтает о машине.',                 hintWord: 'von',     hintRule: 'träumen von + Dativ' },
      { before: '— Ich freue mich',      blank: 'auf',     after: 'den Urlaub.',                  translation: '— Жду отпуска с нетерпением.',            hintWord: 'auf',     hintRule: 'будущее → auf' },
      { before: '— Sie hat Angst',       blank: 'vor',     after: 'Hunden.',                      translation: '— Она боится собак.',                    hintWord: 'vor',     hintRule: 'Angst haben vor + Dativ' },
      { before: '—',                     blank: 'Worauf',  after: 'wartest du?',                  translation: '— Чего ты ждёшь?',                       hintWord: 'Worauf',  hintRule: 'предмет → wo(r) + предлог' },
      { before: '— Das hängt',           blank: 'vom',     after: 'Wetter ab.',                   translation: '— Это зависит от погоды.',               hintWord: 'vom',     hintRule: 'abhängen von + Dativ (von dem = vom)' }
    ],

    multipleChoice: [
      { question: '«Я жду тебя» — …',                                  options: ['Ich warte für dich.', 'Ich warte auf dich.', 'Ich warte an dich.', 'Ich warte dich.'], correctIndex: 1 },
      { question: '«sich freuen auf» — это радость о…',                options: ['прошлом', 'настоящем', 'будущем', 'человеке'],                     correctIndex: 2 },
      { question: 'Вопрос о предмете: «… denkst du?»',                 options: ['An was', 'Woran', 'Wovon', 'Wofür'],                               correctIndex: 1 },
      { question: 'Вопрос о человеке: «… wartest du?»',                options: ['Worauf', 'Auf wen', 'Auf was', 'Wen auf'],                         correctIndex: 1 },
      { question: '«teilnehmen an» требует…',                          options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                      correctIndex: 1 },
      { question: '«заботиться о детях» — …',                          options: ['sich kümmern an die Kinder', 'sich kümmern um die Kinder', 'sich kümmern von den Kindern', 'sich kümmern für die Kinder'], correctIndex: 1 },
      { question: '«Я думаю о том, что…» — Ich denke …, dass…',        options: ['darüber', 'daran', 'davon', 'darauf'],                              correctIndex: 1 },
      { question: '«es geht um» значит…',                              options: ['это работает', 'речь идёт о', 'это зависит от', 'это происходит'],  correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'warten auf',            ru: 'ждать' },
      { id: 2, de: 'denken an',             ru: 'думать о' },
      { id: 3, de: 'träumen von',           ru: 'мечтать о' },
      { id: 4, de: 'sich ärgern über',      ru: 'злиться из-за' },
      { id: 5, de: 'sich kümmern um',       ru: 'заботиться о' },
      { id: 6, de: 'Angst haben vor',       ru: 'бояться' },
      { id: 7, de: 'teilnehmen an',         ru: 'участвовать в' },
      { id: 8, de: 'abhängen von',          ru: 'зависеть от' }
    ],

    dictation: [
      { word: 'warten',        audio: 'warten' },
      { word: 'träumen',       audio: 'träumen' },
      { word: 'teilnehmen',    audio: 'teilnehmen' },
      { word: 'sich erinnern', audio: 'sich erinnern' },
      { word: 'worauf',        audio: 'worauf' },
      { word: 'darüber',       audio: 'darüber' },
      { word: 'Angst',         audio: 'Angst' },
      { word: 'Lärm',          audio: 'Lärm' }
    ]
  }
};
