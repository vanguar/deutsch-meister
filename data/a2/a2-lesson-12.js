/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-12.js
   A2 · Урок 12: Gefühle und Stimmungen — Чувства и настроение
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-12',
  level: 'A2',
  unit:  12,
  title: 'Gefühle und Stimmungen',
  subtitle: 'Чувства, эмоции и настроение',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Wie fühlst du dich?',                 ru: 'Как ты себя чувствуешь?',          note: 'sich fühlen — чувствовать себя (возвратный)', audio: 'Wie fühlst du dich' },
    { de: 'Ich fühle mich großartig!',           ru: 'Я чувствую себя великолепно!',     note: 'großartig — великолепно', audio: 'Ich fühle mich großartig' },
    { de: 'Ich bin heute sehr glücklich.',       ru: 'Я сегодня очень счастлив.',        note: 'glücklich — счастливый', audio: 'Ich bin heute sehr glücklich' },
    { de: 'Warum bist du so traurig?',           ru: 'Почему ты такой грустный?',        note: 'traurig — грустный; warum — почему', audio: 'Warum bist du so traurig' },
    { de: 'Ich habe schlechte Laune.',           ru: 'У меня плохое настроение.',        note: 'die Laune — настроение', audio: 'Ich habe schlechte Laune' },
    { de: 'Mach dir keine Sorgen!',              ru: 'Не беспокойся!',                   note: 'sich Sorgen machen — беспокоиться', audio: 'Mach dir keine Sorgen' },
    { de: 'Ich bin ein bisschen nervös.',        ru: 'Я немного нервничаю.',             note: 'nervös — нервный', audio: 'Ich bin ein bisschen nervös' },
    { de: 'Er ärgert sich über den Stau.',       ru: 'Он злится из-за пробки.',          note: 'sich ärgern über + Akk. — злиться из-за', audio: 'Er ärgert sich über den Stau' },
    { de: 'Ich freue mich auf das Wochenende.',  ru: 'Я с нетерпением жду выходных.',    note: 'sich freuen auf — радоваться предстоящему', audio: 'Ich freue mich auf das Wochenende' },
    { de: 'Sie hat Angst vor Spinnen.',          ru: 'Она боится пауков.',               note: 'Angst haben vor + Dativ — бояться', audio: 'Sie hat Angst vor Spinnen' },
    { de: 'Das macht mich wütend.',              ru: 'Это меня злит.',                   note: 'wütend — разъярённый', audio: 'Das macht mich wütend' },
    { de: 'Ich bin müde und brauche eine Pause.', ru: 'Я устал, и мне нужен перерыв.',   note: 'die Pause — перерыв', audio: 'Ich bin müde und brauche eine Pause' },
    { de: 'Beruhige dich!',                      ru: 'Успокойся!',                       note: 'sich beruhigen — успокаиваться', audio: 'Beruhige dich' },
    { de: 'Ich bin stolz auf dich.',             ru: 'Я горжусь тобой.',                 note: 'stolz sein auf + Akk. — гордиться', audio: 'Ich bin stolz auf dich' },
    { de: 'Das überrascht mich.',                ru: 'Это меня удивляет.',               note: 'überraschen — удивлять', audio: 'Das überrascht mich' },
    { de: 'Alles wird gut!',                     ru: 'Всё будет хорошо!',                note: 'фраза поддержки', audio: 'Alles wird gut' }
  ],

  vocabulary: [
    { de: 'das Gefühl',      ru: 'чувство',            ipa: '[ɡəˈfyːl]',        article: 'das' },
    { de: 'die Laune',       ru: 'настроение',         ipa: '[ˈlaʊ̯nə]',        article: 'die' },
    { de: 'die Angst',       ru: 'страх',              ipa: '[aŋst]',           article: 'die' },
    { de: 'die Sorge',       ru: 'забота, тревога',    ipa: '[ˈzɔʁɡə]',         article: 'die' },
    { de: 'die Freude',      ru: 'радость',            ipa: '[ˈfʁɔɪ̯də]',       article: 'die' },
    { de: 'die Pause',       ru: 'перерыв',            ipa: '[ˈpaʊ̯zə]',        article: 'die' },
    { de: 'glücklich',       ru: 'счастливый',         ipa: '[ˈɡlʏklɪç]',       article: '' },
    { de: 'traurig',         ru: 'грустный',           ipa: '[ˈtʁaʊ̯ʁɪç]',      article: '' },
    { de: 'wütend',          ru: 'разъярённый',        ipa: '[ˈvyːtn̩t]',       article: '' },
    { de: 'nervös',          ru: 'нервный',            ipa: '[nɛʁˈvøːs]',       article: '' },
    { de: 'müde',            ru: 'усталый',            ipa: '[ˈmyːdə]',         article: '' },
    { de: 'stolz',           ru: 'гордый',             ipa: '[ʃtɔlts]',         article: '' },
    { de: 'zufrieden',       ru: 'довольный',          ipa: '[tsuˈfʁiːdn̩]',    article: '' },
    { de: 'enttäuscht',      ru: 'разочарованный',     ipa: '[ɛntˈtɔɪ̯ʃt]',     article: '' },
    { de: 'großartig',       ru: 'великолепный',       ipa: '[ˈɡʁoːsʔaːɐ̯tɪç]', article: '' },
    { de: 'sich fühlen',     ru: 'чувствовать себя',   ipa: '[zɪç ˈfyːlən]',    article: '' },
    { de: 'sich freuen',     ru: 'радоваться',         ipa: '[zɪç ˈfʁɔɪ̯ən]',   article: '' },
    { de: 'sich ärgern',     ru: 'злиться',            ipa: '[zɪç ˈɛʁɡɐn]',     article: '' },
    { de: 'sich beruhigen',  ru: 'успокаиваться',      ipa: '[zɪç bəˈʁuːɪɡn̩]', article: '' },
    { de: 'überraschen',     ru: 'удивлять',           ipa: '[ˌyːbɐˈʁaʃn̩]',    article: '' }
  ],

  grammar: [
    {
      title: '⚡ Возвратные глаголы: sich fühlen, sich freuen',
      body: 'Многие глаголы чувств — возвратные, с местоимением <strong>sich</strong>, которое меняется по лицам:<br><br>' +
            '<em>Ich fühle <strong>mich</strong> gut.</em> — Я чувствую себя хорошо.<br>' +
            '<em>Du fühlst <strong>dich</strong> schlecht?</em> — Ты плохо себя чувствуешь?',
      conjugation: [
        { pronoun: 'ich',           form: 'fühle mich',   audio: 'ich fühle mich',   translation: 'я чувствую себя' },
        { pronoun: 'du',            form: 'fühlst dich',  audio: 'du fühlst dich',   translation: 'ты чувствуешь себя' },
        { pronoun: 'er / sie / es', form: 'fühlt sich',   audio: 'er fühlt sich',    translation: 'он/она чувствует себя' },
        { pronoun: 'wir',           form: 'fühlen uns',   audio: 'wir fühlen uns',   translation: 'мы чувствуем себя' },
        { pronoun: 'ihr',           form: 'fühlt euch',   audio: 'ihr fühlt euch',   translation: 'вы чувствуете себя' },
        { pronoun: 'Sie / sie',     form: 'fühlen sich',  audio: 'Sie fühlen sich',  translation: 'Вы чувствуете / они чувствуют себя' }
      ]
    },
    {
      title: '⚡ sich freuen auf / über — важная разница',
      body: '<strong>sich freuen auf</strong> + Akk. — радоваться тому, что <strong>будет</strong>:<br>' +
            '<em>Ich freue mich <strong>auf</strong> den Urlaub.</em> — Жду отпуск с нетерпением.<br><br>' +
            '<strong>sich freuen über</strong> + Akk. — радоваться тому, что <strong>уже есть</strong>:<br>' +
            '<em>Ich freue mich <strong>über</strong> das Geschenk.</em> — Я рад подарку.',
      conjugation: [
        { pronoun: 'будущее',   form: 'Ich freue mich auf den Sommer.',    audio: 'Ich freue mich auf den Sommer',    translation: 'Жду лето с нетерпением.' },
        { pronoun: 'настоящее', form: 'Ich freue mich über die Blumen.',   audio: 'Ich freue mich über die Blumen',   translation: 'Я рад цветам.' },
        { pronoun: 'злость',    form: 'Er ärgert sich über den Lärm.',     audio: 'Er ärgert sich über den Lärm',     translation: 'Он злится из-за шума.' },
        { pronoun: 'страх',     form: 'Sie hat Angst vor Hunden.',         audio: 'Sie hat Angst vor Hunden',         translation: 'Она боится собак.' }
      ]
    },
    {
      title: '💡 Устойчивые выражения о настроении',
      body: '<em>gute/schlechte <strong>Laune haben</strong></em> — быть в хорошем/плохом настроении<br>' +
            '<em>sich <strong>Sorgen machen</strong> um</em> — беспокоиться о<br>' +
            '<em><strong>stolz sein auf</strong></em> + Akk. — гордиться<br>' +
            '<em><strong>Angst haben vor</strong></em> + Dat. — бояться<br><br>' +
            '<em>Mach dir keine Sorgen!</em> — Не переживай!'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wie fühlst du',        blank: 'dich',       after: '?',                        translation: '— Как ты себя чувствуешь?',           hintWord: 'dich',       hintRule: 'du → dich (возвратное)' },
      { before: '— Ich fühle',            blank: 'mich',       after: 'großartig!',               translation: '— Я чувствую себя великолепно!',      hintWord: 'mich',       hintRule: 'ich → mich' },
      { before: '— Warum bist du so',     blank: 'traurig',    after: '?',                        translation: '— Почему ты такой грустный?',         hintWord: 'traurig',    hintRule: 'traurig — грустный' },
      { before: '— Ich habe schlechte',   blank: 'Laune',      after: '.',                        translation: '— У меня плохое настроение.',         hintWord: 'Laune',      hintRule: 'die Laune — настроение' },
      { before: '— Ich freue mich',       blank: 'auf',        after: 'das Wochenende.',          translation: '— Жду выходных с нетерпением.',       hintWord: 'auf',        hintRule: 'freuen auf — о будущем' },
      { before: '— Sie hat Angst',        blank: 'vor',        after: 'Spinnen.',                 translation: '— Она боится пауков.',                hintWord: 'vor',        hintRule: 'Angst vor + Dativ' },
      { before: '— Mach dir keine',       blank: 'Sorgen',     after: '!',                        translation: '— Не беспокойся!',                    hintWord: 'Sorgen',     hintRule: 'sich Sorgen machen' },
      { before: '— Ich bin',              blank: 'stolz',      after: 'auf dich.',                translation: '— Я горжусь тобой.',                  hintWord: 'stolz',      hintRule: 'stolz auf + Akkusativ' }
    ],

    multipleChoice: [
      { question: '«Traurig» значит…',                         options: ['счастливый', 'грустный', 'злой', 'усталый'],                  correctIndex: 1 },
      { question: '«Ich freue mich AUF…» говорит о…',          options: ['прошлом', 'настоящем', 'будущем', 'мечте'],                   correctIndex: 2 },
      { question: '«Sich ärgern über» значит…',                options: ['радоваться', 'злиться из-за', 'бояться', 'гордиться'],        correctIndex: 1 },
      { question: '«Angst haben vor» требует…',                options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                 correctIndex: 1 },
      { question: 'Возвратное местоимение для «wir»…',         options: ['sich', 'uns', 'euch', 'mich'],                                correctIndex: 1 },
      { question: '«Wütend» значит…',                          options: ['довольный', 'разъярённый', 'нервный', 'гордый'],              correctIndex: 1 },
      { question: '«Mach dir keine Sorgen!» значит…',          options: ['Соберись!', 'Не беспокойся!', 'Успокойся!', 'Радуйся!'],      correctIndex: 1 },
      { question: '«Enttäuscht» значит…',                      options: ['удивлённый', 'разочарованный', 'счастливый', 'спокойный'],    correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'glücklich',      ru: 'счастливый' },
      { id: 2, de: 'traurig',        ru: 'грустный' },
      { id: 3, de: 'wütend',         ru: 'разъярённый' },
      { id: 4, de: 'müde',           ru: 'усталый' },
      { id: 5, de: 'stolz',          ru: 'гордый' },
      { id: 6, de: 'die Angst',      ru: 'страх' },
      { id: 7, de: 'sich freuen',    ru: 'радоваться' },
      { id: 8, de: 'zufrieden',      ru: 'довольный' }
    ],

    dictation: [
      { word: 'Gefühl',     audio: 'Gefühl' },
      { word: 'glücklich',  audio: 'glücklich' },
      { word: 'traurig',    audio: 'traurig' },
      { word: 'nervös',     audio: 'nervös' },
      { word: 'müde',       audio: 'müde' },
      { word: 'Laune',      audio: 'Laune' },
      { word: 'Angst',      audio: 'Angst' },
      { word: 'zufrieden',  audio: 'zufrieden' }
    ]
  }
};
