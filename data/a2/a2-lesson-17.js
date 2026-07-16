/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-17.js
   A2 · Урок 17: Präteritum: war & hatte — Простое прошедшее время
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-17',
  level: 'A2',
  unit:  17,
  title: 'Präteritum: war & hatte',
  subtitle: 'Простое прошедшее: war, hatte и модальные',

  meta: {
    duration: '30–35 мин',
    wordCount: 18,
    xpReward: 120
  },

  phrases: [
    { de: 'Gestern war ich zu Hause.',           ru: 'Вчера я был дома.',                note: 'war — был (Präteritum от sein)', audio: 'Gestern war ich zu Hause' },
    { de: 'Wo warst du am Wochenende?',          ru: 'Где ты был на выходных?',          note: 'du → warst', audio: 'Wo warst du am Wochenende' },
    { de: 'Wir waren im Kino.',                  ru: 'Мы были в кино.',                  note: 'wir → waren', audio: 'Wir waren im Kino' },
    { de: 'Der Film war langweilig.',            ru: 'Фильм был скучный.',               note: 'langweilig — скучный', audio: 'Der Film war langweilig' },
    { de: 'Ich hatte keine Zeit.',               ru: 'У меня не было времени.',          note: 'hatte — имел (Präteritum от haben)', audio: 'Ich hatte keine Zeit' },
    { de: 'Hattest du gestern Stress?',          ru: 'У тебя вчера был стресс?',         note: 'du → hattest', audio: 'Hattest du gestern Stress' },
    { de: 'Wir hatten viel Spaß.',               ru: 'Нам было очень весело.',           note: 'Spaß haben — веселиться', audio: 'Wir hatten viel Spaß' },
    { de: 'Als Kind wollte ich Pilot werden.',   ru: 'В детстве я хотел стать пилотом.', note: 'wollte — хотел (Präteritum от wollen)', audio: 'Als Kind wollte ich Pilot werden' },
    { de: 'Ich konnte gestern nicht kommen.',    ru: 'Я вчера не мог прийти.',           note: 'konnte — мог (Präteritum от können)', audio: 'Ich konnte gestern nicht kommen' },
    { de: 'Er musste lange arbeiten.',           ru: 'Ему пришлось долго работать.',     note: 'musste — должен был', audio: 'Er musste lange arbeiten' },
    { de: 'Das Wetter war herrlich.',            ru: 'Погода была великолепная.',        note: 'herrlich — великолепный', audio: 'Das Wetter war herrlich' },
    { de: 'Es war einmal…',                      ru: 'Жили-были… (Однажды…)',            note: 'начало всех сказок', audio: 'Es war einmal' },
    { de: 'Ich hatte Glück!',                    ru: 'Мне повезло!',                     note: 'Glück haben — везти', audio: 'Ich hatte Glück' },
    { de: 'Früher gab es hier einen Park.',      ru: 'Раньше здесь был парк.',           note: 'es gab — было (Präteritum от es gibt)', audio: 'Früher gab es hier einen Park' },
    { de: 'Wir durften nicht laut sein.',        ru: 'Нам нельзя было шуметь.',          note: 'durfte — имел разрешение', audio: 'Wir durften nicht laut sein' },
    { de: 'Das war ein schöner Tag!',            ru: 'Это был прекрасный день!',         note: 'подводим итог дня', audio: 'Das war ein schöner Tag' }
  ],

  vocabulary: [
    { de: 'war',           ru: 'был (sein)',           ipa: '[vaːɐ̯]',        article: '' },
    { de: 'hatte',         ru: 'имел (haben)',         ipa: '[ˈhatə]',        article: '' },
    { de: 'wollte',        ru: 'хотел (wollen)',       ipa: '[ˈvɔltə]',       article: '' },
    { de: 'konnte',        ru: 'мог (können)',         ipa: '[ˈkɔntə]',       article: '' },
    { de: 'musste',        ru: 'должен был (müssen)',  ipa: '[ˈmʊstə]',       article: '' },
    { de: 'durfte',        ru: 'мог/имел разрешение (dürfen)', ipa: '[ˈdʊʁftə]', article: '' },
    { de: 'es gab',        ru: 'было, имелось (es gibt)', ipa: '[ɛs ɡaːp]',   article: '' },
    { de: 'gestern',       ru: 'вчера',                ipa: '[ˈɡɛstɐn]',      article: '' },
    { de: 'früher',        ru: 'раньше',               ipa: '[ˈfʁyːɐ]',       article: '' },
    { de: 'damals',        ru: 'тогда, в то время',    ipa: '[ˈdaːmaːls]',    article: '' },
    { de: 'als Kind',      ru: 'в детстве',            ipa: '[als kɪnt]',     article: '' },
    { de: 'die Zeit',      ru: 'время',                ipa: '[tsaɪ̯t]',       article: 'die' },
    { de: 'der Spaß',      ru: 'веселье, удовольствие', ipa: '[ʃpaːs]',       article: 'der' },
    { de: 'das Glück',     ru: 'счастье, удача',       ipa: '[ɡlʏk]',         article: 'das' },
    { de: 'der Stress',    ru: 'стресс',               ipa: '[ʃtʁɛs]',        article: 'der' },
    { de: 'langweilig',    ru: 'скучный',              ipa: '[ˈlaŋvaɪ̯lɪç]',  article: '' },
    { de: 'herrlich',      ru: 'великолепный',         ipa: '[ˈhɛʁlɪç]',      article: '' },
    { de: 'einmal',        ru: 'однажды',              ipa: '[ˈaɪ̯nmaːl]',    article: '' }
  ],

  grammar: [
    {
      title: '⚡ war — прошедшее от sein',
      body: 'Для <strong>sein</strong> и <strong>haben</strong> в разговоре используют не Perfekt, а простое прошедшее (Präteritum):<br><br>' +
            '<em>Ich <strong>war</strong> gestern im Kino.</em> — Я вчера был в кино.<br>' +
            '(НЕ «Ich bin im Kino gewesen» — так тоже можно, но war короче и естественнее)',
      conjugation: [
        { pronoun: 'ich',           form: 'war',    audio: 'ich war',    translation: 'я был' },
        { pronoun: 'du',            form: 'warst',  audio: 'du warst',   translation: 'ты был' },
        { pronoun: 'er / sie / es', form: 'war',    audio: 'er war',     translation: 'он/она был(а)' },
        { pronoun: 'wir',           form: 'waren',  audio: 'wir waren',  translation: 'мы были' },
        { pronoun: 'ihr',           form: 'wart',   audio: 'ihr wart',   translation: 'вы были' },
        { pronoun: 'Sie / sie',     form: 'waren',  audio: 'Sie waren',  translation: 'Вы были / они были' }
      ]
    },
    {
      title: '⚡ hatte — прошедшее от haben',
      body: '<em>Ich <strong>hatte</strong> keine Zeit.</em> — У меня не было времени.<br>' +
            '<em>Wir <strong>hatten</strong> viel Spaß.</em> — Нам было весело.',
      conjugation: [
        { pronoun: 'ich',           form: 'hatte',    audio: 'ich hatte',    translation: 'я имел' },
        { pronoun: 'du',            form: 'hattest',  audio: 'du hattest',   translation: 'ты имел' },
        { pronoun: 'er / sie / es', form: 'hatte',    audio: 'er hatte',     translation: 'он/она имел(а)' },
        { pronoun: 'wir',           form: 'hatten',   audio: 'wir hatten',   translation: 'мы имели' },
        { pronoun: 'ihr',           form: 'hattet',   audio: 'ihr hattet',   translation: 'вы имели' },
        { pronoun: 'Sie / sie',     form: 'hatten',   audio: 'Sie hatten',   translation: 'Вы имели / они имели' }
      ]
    },
    {
      title: '⚡ Модальные в прошедшем: konnte, musste, wollte',
      body: 'Модальные глаголы в прошлом теряют умлаут и получают <strong>-te</strong>:<br><br>' +
            '<em>können → <strong>konnte</strong>, müssen → <strong>musste</strong>, dürfen → <strong>durfte</strong>, wollen → <strong>wollte</strong></em><br><br>' +
            '<em>Ich <strong>konnte</strong> nicht kommen.</em> — Я не мог прийти.',
      conjugation: [
        { pronoun: 'können',  form: 'ich konnte',   audio: 'ich konnte',   translation: 'я мог' },
        { pronoun: 'müssen',  form: 'ich musste',   audio: 'ich musste',   translation: 'я должен был' },
        { pronoun: 'wollen',  form: 'ich wollte',   audio: 'ich wollte',   translation: 'я хотел' },
        { pronoun: 'dürfen',  form: 'ich durfte',   audio: 'ich durfte',   translation: 'мне было можно' },
        { pronoun: 'es gibt', form: 'es gab',       audio: 'es gab',       translation: 'было, имелось' }
      ]
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Gestern',              blank: 'war',        after: 'ich zu Hause.',           translation: '— Вчера я был дома.',                 hintWord: 'war',        hintRule: 'ich → war' },
      { before: '— Wo',                   blank: 'warst',      after: 'du am Wochenende?',       translation: '— Где ты был на выходных?',           hintWord: 'warst',      hintRule: 'du → warst' },
      { before: '— Wir',                  blank: 'waren',      after: 'im Kino.',                translation: '— Мы были в кино.',                   hintWord: 'waren',      hintRule: 'wir → waren' },
      { before: '— Ich',                  blank: 'hatte',      after: 'keine Zeit.',             translation: '— У меня не было времени.',           hintWord: 'hatte',      hintRule: 'ich → hatte' },
      { before: '— Wir',                  blank: 'hatten',     after: 'viel Spaß.',              translation: '— Нам было очень весело.',            hintWord: 'hatten',     hintRule: 'wir → hatten' },
      { before: '— Ich',                  blank: 'konnte',     after: 'gestern nicht kommen.',   translation: '— Я вчера не мог прийти.',            hintWord: 'konnte',     hintRule: 'können → konnte (без умлаута)' },
      { before: '— Als Kind',             blank: 'wollte',     after: 'ich Pilot werden.',       translation: '— В детстве я хотел стать пилотом.',  hintWord: 'wollte',     hintRule: 'wollen → wollte' },
      { before: '— Früher',               blank: 'gab',        after: 'es hier einen Park.',     translation: '— Раньше здесь был парк.',            hintWord: 'gab',        hintRule: 'es gibt → es gab' }
    ],

    multipleChoice: [
      { question: 'Präteritum от «sein» для «ich»…',           options: ['bin', 'war', 'waren', 'gewesen'],                             correctIndex: 1 },
      { question: 'Präteritum от «haben» для «wir»…',          options: ['haben', 'hatte', 'hatten', 'gehabt'],                         correctIndex: 2 },
      { question: '«Ich konnte nicht kommen» значит…',         options: ['я не хочу приходить', 'я не мог прийти', 'я не приду', 'мне нельзя приходить'], correctIndex: 1 },
      { question: 'Модальные в Präteritum теряют…',            options: ['окончание', 'приставку', 'умлаут', 'корень'],                 correctIndex: 2 },
      { question: '«Es gab» — прошедшее от…',                  options: ['geben (давать)', 'es gibt (имеется)', 'gehen', 'haben'],      correctIndex: 1 },
      { question: '«Es war einmal…» — начало…',                options: ['письма', 'сказки', 'новостей', 'разговора'],                  correctIndex: 1 },
      { question: '«Ich hatte Glück» значит…',                 options: ['я был счастлив', 'мне повезло', 'у меня было золото', 'я выиграл'], correctIndex: 1 },
      { question: '«Damals» значит…',                          options: ['сейчас', 'тогда, в то время', 'скоро', 'всегда'],             correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'ich war',      ru: 'я был' },
      { id: 2, de: 'ich hatte',    ru: 'я имел' },
      { id: 3, de: 'ich konnte',   ru: 'я мог' },
      { id: 4, de: 'ich musste',   ru: 'я должен был' },
      { id: 5, de: 'ich wollte',   ru: 'я хотел' },
      { id: 6, de: 'es gab',       ru: 'было, имелось' },
      { id: 7, de: 'früher',       ru: 'раньше' },
      { id: 8, de: 'damals',       ru: 'тогда' }
    ],

    dictation: [
      { word: 'war',        audio: 'war' },
      { word: 'hatte',      audio: 'hatte' },
      { word: 'konnte',     audio: 'konnte' },
      { word: 'musste',     audio: 'musste' },
      { word: 'wollte',     audio: 'wollte' },
      { word: 'gestern',    audio: 'gestern' },
      { word: 'früher',     audio: 'früher' },
      { word: 'langweilig', audio: 'langweilig' }
    ]
  }
};
