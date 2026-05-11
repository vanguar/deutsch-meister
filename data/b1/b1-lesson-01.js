/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-01.js
   B1 · Урок 1: Konjunktiv II — Сослагательное наклонение
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-01',
  level:    'B1',
  unit:     1,
  title:    'Konjunktiv II',
  subtitle: 'Сослагательное наклонение · Wunsch, Hypothese, Höflichkeit',

  meta: {
    duration:  '35–40 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Wenn ich Zeit hätte, würde ich reisen.',        ru: 'Если бы у меня было время, я бы путешествовал.',   note: 'hätte + würde — классическая пара Konj. II', audio: 'Wenn ich Zeit hätte, würde ich reisen' },
    { de: 'Ich würde gern Deutsch lernen.',                ru: 'Я бы с удовольствием учил немецкий.',              note: 'würde + Inf. — вежливое желание', audio: 'Ich würde gern Deutsch lernen' },
    { de: 'Könntest du mir helfen?',                       ru: 'Не мог бы ты мне помочь?',                         note: 'könnte — вежливая просьба (= können в Konj. II)', audio: 'Könntest du mir helfen' },
    { de: 'Dürfte ich fragen?',                            ru: 'Разрешите спросить?',                              note: 'dürfte — очень вежливая форма', audio: 'Dürfte ich fragen' },
    { de: 'Ich wäre froh, wenn du käm­est.',               ru: 'Я бы обрадовался, если бы ты пришёл.',             note: 'wäre + käme — оба глагола в Konj. II', audio: 'Ich wäre froh, wenn du kämest' },
    { de: 'Das wäre schön!',                               ru: 'Это было бы прекрасно!',                           note: 'wäre = sein в сослагательном', audio: 'Das wäre schön' },
    { de: 'Wenn ich du wäre, würde ich das nicht tun.',    ru: 'На твоём месте я бы этого не делал.',              note: 'устойчивая конструкция «на твоём месте»', audio: 'Wenn ich du wäre, würde ich das nicht tun' },
    { de: 'Hätte ich gewusst, dass…',                      ru: 'Знал бы я, что…',                                  note: 'hätte + Partizip II — Konj. II Vergangenheit', audio: 'Hätte ich gewusst' },
    { de: 'Ich wünschte, ich hätte mehr Geld.',            ru: 'Я бы хотел иметь больше денег.',                   note: 'wünschen + Konj. II — нереальное желание', audio: 'Ich wünschte, ich hätte mehr Geld' },
    { de: 'Wenn das Wetter besser wäre, gingen wir spazieren.', ru: 'Если бы погода была лучше, мы бы пошли гулять.', note: 'gingen — Konj. II от gehen (без würde)', audio: 'Wenn das Wetter besser wäre, gingen wir spazieren' },
    { de: 'Würdest du mir bitte die Tür aufmachen?',       ru: 'Не мог бы ты открыть мне дверь?',                  note: 'würdest + Inf. — вежливая просьба', audio: 'Würdest du mir bitte die Tür aufmachen' },
    { de: 'An deiner Stelle würde ich früher aufstehen.',  ru: 'На твоём месте я бы вставал пораньше.',            note: 'an deiner Stelle = на твоём месте', audio: 'An deiner Stelle würde ich früher aufstehen' },
    { de: 'Wenn ich fliegen könnte, wäre ich glücklich.',  ru: 'Если бы я мог летать, был бы счастлив.',           note: 'könnte — модальный глагол в Konj. II', audio: 'Wenn ich fliegen könnte, wäre ich glücklich' },
    { de: 'Ich sollte mehr schlafen.',                     ru: 'Мне следовало бы больше спать.',                   note: 'sollte — долженствование в Konj. II', audio: 'Ich sollte mehr schlafen' },
    { de: 'Das müsste eigentlich klappen.',                ru: 'Это должно было бы получиться.',                   note: 'müsste = muss в Konj. II', audio: 'Das müsste eigentlich klappen' },
    { de: 'Wenn ich reich wäre, kaufte ich ein Haus.',     ru: 'Будь я богат, купил бы дом.',                      note: 'kaufte — Konj. II от kaufen (книжная форма)', audio: 'Wenn ich reich wäre, kaufte ich ein Haus' },
    { de: 'Ich möchte einen Kaffee, bitte.',               ru: 'Я хотел бы кофе, пожалуйста.',                     note: 'möchte — самый частый Konj. II в быту', audio: 'Ich möchte einen Kaffee, bitte' },
    { de: 'Hätte er das gesagt, hätte ich reagiert.',      ru: 'Скажи он это, я бы отреагировал.',                 note: 'hätte…gesagt — прошедшее нереальное условие', audio: 'Hätte er das gesagt, hätte ich reagiert' },
    { de: 'Wenn ich früher angefangen hätte…',             ru: 'Начни я раньше…',                                  note: 'hätte + Partizip II — сожаление о прошлом', audio: 'Wenn ich früher angefangen hätte' },
    { de: 'Das wäre mir lieber gewesen.',                  ru: 'Мне бы это было предпочтительнее.',                note: 'Konj. II Perfekt: wäre + Partizip II', audio: 'Das wäre mir lieber gewesen' },
    { de: 'Ohne deine Hilfe hätte ich es nicht geschafft.', ru: 'Без твоей помощи я бы не справился.',            note: 'ohne + Akk. — конструкция нереального условия', audio: 'Ohne deine Hilfe hätte ich es nicht geschafft' },
    { de: 'Wenn nur alles so einfach wäre!',               ru: 'Если бы только всё было так просто!',              note: 'wenn nur / wäre… — восклицательное желание', audio: 'Wenn nur alles so einfach wäre' },
    { de: 'Er täte so, als ob er nichts wüsste.',          ru: 'Он вёл себя так, будто ничего не знал.',           note: 'als ob + Konj. II — «как будто»', audio: 'Er täte so, als ob er nichts wüsste' },
    { de: 'Ich würde lieber zu Hause bleiben.',            ru: 'Я бы лучше остался дома.',                         note: 'lieber — сравнительная степень от gern', audio: 'Ich würde lieber zu Hause bleiben' }
  ],

  vocabulary: [
    { de: 'würde',          ru: '(я/ты…) бы сделал',    ipa: '[ˈvʏʁdə]',       article: '' },
    { de: 'hätte',          ru: 'имел бы',               ipa: '[ˈhɛtə]',        article: '' },
    { de: 'wäre',           ru: 'был бы',                ipa: '[ˈvɛːʁə]',       article: '' },
    { de: 'könnte',         ru: 'мог бы',                ipa: '[ˈkœntə]',       article: '' },
    { de: 'sollte',         ru: 'следовало бы',          ipa: '[ˈzɔltə]',       article: '' },
    { de: 'müsste',         ru: 'должен был бы',         ipa: '[ˈmʏstə]',       article: '' },
    { de: 'dürfte',         ru: 'мог бы (разрешение)',   ipa: '[ˈdʏʁftə]',      article: '' },
    { de: 'möchte',         ru: 'хотел бы',              ipa: '[ˈmœçtə]',       article: '' },
    { de: 'wünschte',       ru: 'пожелал бы',            ipa: '[ˈvʏnʃtə]',      article: '' },
    { de: 'die Hypothese',  ru: 'гипотеза',              ipa: '[hypoˈteːzə]',   article: 'die' },
    { de: 'nirealen Fall',  ru: 'нереальный случай',     ipa: '[nɪˈʁeːaːln]',   article: '' },
    { de: 'die Höflichkeit',ru: 'вежливость',            ipa: '[ˈhøːflɪçkaɪ̯t]', article: 'die' },
    { de: 'die Bedingung',  ru: 'условие',               ipa: '[bəˈdɪŋʊŋ]',    article: 'die' },
    { de: 'der Wunsch',     ru: 'желание',               ipa: '[vʊnʃ]',         article: 'der' },
    { de: 'klappen',        ru: 'получаться, удаваться', ipa: '[ˈklapn̩]',      article: '' },
    { de: 'eigentlich',     ru: 'вообще-то, собственно', ipa: '[ˈaɪ̯ɡn̩tlɪç]',  article: '' },
    { de: 'an deiner Stelle',ru: 'на твоём месте',       ipa: '[an ˈdaɪ̯nɐ ˈʃtɛlə]', article: '' },
    { de: 'lieber',         ru: 'лучше (предпочтение)',  ipa: '[ˈliːbɐ]',       article: '' },
    { de: 'reagieren',      ru: 'реагировать',           ipa: '[ʁeaˈɡiːʁən]',  article: '' },
    { de: 'schaffen',       ru: 'справляться, успевать', ipa: '[ˈʃafn̩]',       article: '' },
    { de: 'als ob',         ru: 'как будто',             ipa: '[als ɔp]',       article: '' },
    { de: 'ohne',           ru: 'без',                   ipa: '[ˈoːnə]',        article: '' },
    { de: 'die Vergangenheit', ru: 'прошлое',            ipa: '[fɛʁˈɡaŋənhaɪ̯t]', article: 'die' },
    { de: 'nirealen Konj.', ru: 'нереальное сослаг.',    ipa: '',               article: '' }
  ],

  grammar: [
    {
      title: '⚡ Konjunktiv II — образование: würde + Infinitiv',
      body: 'Самый простой способ образовать Konjunktiv II — взять <strong>würde</strong> (= вспомогательный глагол) + инфинитив основного глагола.<br><br>' +
            '<em>Ich <strong>würde</strong> gehen.</em> — Я бы пошёл.<br>' +
            '<em>Er <strong>würde</strong> kaufen.</em> — Он бы купил.<br><br>' +
            'Эта форма работает для большинства глаголов. Исключение — <em>sein, haben</em> и модальные: они образуют Konj. II по-своему (см. ниже).',
      conjugation: [
        { pronoun: 'ich',           form: 'würde … machen', audio: 'ich würde machen',  translation: 'я бы делал' },
        { pronoun: 'du',            form: 'würdest … machen', audio: 'du würdest machen', translation: 'ты бы делал' },
        { pronoun: 'er / sie / es', form: 'würde … machen', audio: 'er würde machen',  translation: 'он бы делал' },
        { pronoun: 'wir',           form: 'würden … machen', audio: 'wir würden machen', translation: 'мы бы делали' },
        { pronoun: 'ihr',           form: 'würdet … machen', audio: 'ihr würdet machen', translation: 'вы бы делали' },
        { pronoun: 'Sie / sie',     form: 'würden … machen', audio: 'Sie würden machen', translation: 'Вы/они бы делали' }
      ]
    },
    {
      title: '⚡ Konj. II от sein, haben и модальных',
      body: 'Глаголы <strong>sein → wäre</strong>, <strong>haben → hätte</strong> и модальные используются напрямую, без würde:<br><br>' +
            '<em>Ich <strong>wäre</strong> glücklich.</em> — Я был бы счастлив.<br>' +
            '<em>Ich <strong>hätte</strong> Zeit.</em> — У меня было бы время.<br>' +
            '<em>Ich <strong>könnte</strong> kommen.</em> — Я мог бы прийти.<br><br>' +
            'Образование: Präteritum → изменить корневую гласную (Umlaut) → добавить окончания -e, -est, -e, -en, -et, -en.',
      conjugation: [
        { pronoun: 'ich',           form: 'wäre / hätte',    audio: 'ich wäre ich hätte',   translation: 'был бы / имел бы' },
        { pronoun: 'du',            form: 'wär(e)st / hättest', audio: 'du wärest du hättest', translation: 'был бы / имел бы' },
        { pronoun: 'er / sie / es', form: 'wäre / hätte',    audio: 'er wäre er hätte',     translation: 'был бы / имел бы' },
        { pronoun: 'wir',           form: 'wären / hätten',  audio: 'wir wären wir hätten', translation: 'были бы / имели бы' },
        { pronoun: 'ihr',           form: 'wär(e)t / hättet', audio: 'ihr wäret ihr hättet', translation: 'были бы / имели бы' },
        { pronoun: 'Sie / sie',     form: 'wären / hätten',  audio: 'Sie wären Sie hätten', translation: 'были бы / имели бы' }
      ]
    },
    {
      title: '💡 Нереальное условие (Irrealis)',
      body: 'Конструкция <strong>Wenn … Konj. II, … Konj. II</strong> выражает нереальное или маловероятное условие:<br><br>' +
            '<em>Wenn ich Zeit <strong>hätte</strong>, <strong>würde</strong> ich reisen.</em><br>' +
            '(Если бы у меня было время, я бы путешествовал.)<br><br>' +
            '⚠️ Слово <em>wenn</em> отправляет глагол в конец. <strong>Порядок в главном предложении: Konj. II на 2-й позиции.</strong><br><br>' +
            'Без wenn: <em>Hätte ich Zeit, <strong>würde</strong> ich reisen.</em> (инверсия — «было бы время, я бы…»)'
    },
    {
      title: '💡 Konjunktiv II Vergangenheit',
      body: 'Нереальное в прошлом: <strong>hätte/wäre + Partizip II</strong><br><br>' +
            '<em>Wenn ich früher aufgestanden <strong>wäre</strong>, <strong>hätte</strong> ich den Zug nicht verpasst.</em><br>' +
            '(Встань я раньше, не опоздал бы на поезд.)<br><br>' +
            'Глаголы движения/состояния → <strong>wäre</strong>, остальные → <strong>hätte</strong>.<br>' +
            '<em>Er <strong>hätte</strong> gelernt.</em> · <em>Sie <strong>wäre</strong> gegangen.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wenn ich Geld',       blank: 'hätte',   after: ', würde ich reisen.',         translation: '— Если бы у меня были деньги, я бы путешествовал.',  hintWord: 'hätte',   hintRule: 'haben → hätte (Konj. II)' },
      { before: '— Das',                 blank: 'wäre',    after: 'wirklich schön!',              translation: '— Это было бы действительно прекрасно!',            hintWord: 'wäre',    hintRule: 'sein → wäre (Konj. II)' },
      { before: '— Ich',                 blank: 'würde',   after: 'gern mitkommen.',              translation: '— Я бы с удовольствием пошёл.',                     hintWord: 'würde',   hintRule: 'würde + Infinitiv = Konj. II' },
      { before: '— Könn',                blank: 'test',    after: 'du mir helfen?',               translation: '— Не мог бы ты помочь?',                            hintWord: 'test',    hintRule: 'können → könnte → könntest (du)' },
      { before: '— Ich',                 blank: 'möchte',  after: 'einen Tee, bitte.',            translation: '— Я хотел бы чаю, пожалуйста.',                     hintWord: 'möchte',  hintRule: 'möchte — Konj. II от mögen' },
      { before: '— Ohne dich',           blank: 'hätte',   after: 'ich es nicht geschafft.',      translation: '— Без тебя я бы не справился.',                     hintWord: 'hätte',   hintRule: 'hätte + Partizip II — прошедшее нереальное' },
      { before: '— Er täte so,',         blank: 'als ob',  after: 'er schläft.',                  translation: '— Он делает вид, будто спит.',                      hintWord: 'als ob',  hintRule: 'als ob + Konj. II — «как будто»' },
      { before: '— An deiner Stelle',    blank: 'würde',   after: 'ich früher anfangen.',         translation: '— На твоём месте я бы начал раньше.',               hintWord: 'würde',   hintRule: 'würde + Infinitiv' }
    ],

    multipleChoice: [
      { question: 'Как правильно: «Если бы я мог…»?',                      options: ['Wenn ich kann…', 'Wenn ich könnte…', 'Wenn ich konnte…', 'Wenn ich darf…'],          correctIndex: 1 },
      { question: 'Что значит «Das wäre schön»?',                           options: ['Это красиво.', 'Это было красиво.', 'Это было бы красиво.', 'Было бы!'],            correctIndex: 2 },
      { question: '«Ich möchte» — это…',                                    options: ['Präteritum от mögen', 'Konj. II от mögen', 'Imperativ от mögen', 'Futur'],          correctIndex: 1 },
      { question: 'Верный Konj. II от «haben» для «ich»?',                  options: ['hatte', 'hat', 'hätte', 'habe'],                                                     correctIndex: 2 },
      { question: 'Что стоит в конце предложения с «wenn»?',                options: ['würde', 'hätte', 'глагол (финитный)', 'ничего'],                                   correctIndex: 2 },
      { question: '«Könntest du helfen?» — это…',                           options: ['прошедшее время', 'вежливая просьба', 'будущее', 'приказ'],                        correctIndex: 1 },
      { question: 'Konj. II Vergangenheit образуется через…',                options: ['würde + Infinitiv', 'hätte/wäre + Partizip II', 'hatte + Infinitiv', 'wird + Partizip II'], correctIndex: 1 },
      { question: '«Als ob» требует…',                                       options: ['Präsens', 'Konjunktiv II', 'Imperativ', 'Futur I'],                                correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'hätte',          ru: 'имел бы (haben)' },
      { id: 2, de: 'wäre',           ru: 'был бы (sein)' },
      { id: 3, de: 'könnte',         ru: 'мог бы (können)' },
      { id: 4, de: 'würde … machen', ru: 'делал бы' },
      { id: 5, de: 'möchte',         ru: 'хотел бы' },
      { id: 6, de: 'sollte',         ru: 'следовало бы' },
      { id: 7, de: 'müsste',         ru: 'должен был бы' },
      { id: 8, de: 'dürfte',         ru: 'мог бы (разрешение)' }
    ],

    dictation: [
      { word: 'hätte',       audio: 'hätte' },
      { word: 'wäre',        audio: 'wäre' },
      { word: 'würde',       audio: 'würde' },
      { word: 'könnte',      audio: 'könnte' },
      { word: 'möchte',      audio: 'möchte' },
      { word: 'sollte',      audio: 'sollte' },
      { word: 'Hypothese',   audio: 'Hypothese' },
      { word: 'Bedingung',   audio: 'Bedingung' }
    ]
  }
};
