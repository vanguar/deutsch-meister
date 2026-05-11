/* ═══════════════════════════════════════════════
   data/a2-lesson-04.js
   A2 · Урок 4: Reisen und Urlaub — Путешествия
                Perfekt (прошедшее время) с haben и sein
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-04',
  level: 'A2',
  unit:  4,
  title: 'Reisen und Urlaub',
  subtitle: 'Путешествия и отпуск · Perfekt (прошедшее время)',

  meta: {
    duration: '35–40 мин',
    wordCount: 26,
    xpReward: 130
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Ich habe Urlaub gemacht.',              ru: 'Я был в отпуске.',                          note: 'Urlaub machen = быть в отпуске', audio: 'Ich habe Urlaub gemacht' },
    { de: 'Ich bin nach Italien gefahren.',        ru: 'Я ездил в Италию.',                         note: 'fahren — с sein (движение!)', audio: 'Ich bin nach Italien gefahren' },
    { de: 'Wir sind nach Berlin geflogen.',        ru: 'Мы летали в Берлин.',                       note: 'fliegen — с sein. Partizip II = geflogen', audio: 'Wir sind nach Berlin geflogen' },
    { de: 'Ich habe Berlin besucht.',              ru: 'Я посетил Берлин.',                         note: 'besuchen — с haben (без приставки ge-!)', audio: 'Ich habe Berlin besucht' },
    { de: 'Ich habe viele Fotos gemacht.',         ru: 'Я сделал много фотографий.',                note: 'das Foto, мн.ч. die Fotos', audio: 'Ich habe viele Fotos gemacht' },
    { de: 'Ich habe ein Hotel gebucht.',           ru: 'Я забронировал отель.',                     note: 'buchen → gebucht (правильный глагол)', audio: 'Ich habe ein Hotel gebucht' },
    { de: 'Wir haben am Strand gelegen.',          ru: 'Мы лежали на пляже.',                       note: 'liegen → gelegen (неправильный)', audio: 'Wir haben am Strand gelegen' },
    { de: 'Ich bin im Meer geschwommen.',          ru: 'Я плавал в море.',                          note: 'schwimmen с sein! Partizip = geschwommen', audio: 'Ich bin im Meer geschwommen' },
    { de: 'Es hat viel Spaß gemacht.',             ru: 'Было очень весело.',                        note: 'Spaß machen — приносить удовольствие', audio: 'Es hat viel Spaß gemacht' },
    { de: 'Wo warst du im Urlaub?',                ru: 'Где ты был в отпуске?',                     note: 'warst — Präteritum от sein (так чаще!)', audio: 'Wo warst du im Urlaub' },
    { de: 'Ich war in Spanien.',                   ru: 'Я был в Испании.',                          note: 'sein → war (прош. вр., короткая форма)', audio: 'Ich war in Spanien' },
    { de: 'Wie war das Wetter?',                   ru: 'Какая была погода?',                        note: 'es war = было, sie war = она была', audio: 'Wie war das Wetter' },
    { de: 'Das Wetter war fantastisch.',           ru: 'Погода была фантастической.',               note: 'fantastisch / toll / super — синонимы', audio: 'Das Wetter war fantastisch' },
    { de: 'Ich habe deutsches Bier getrunken.',    ru: 'Я пил немецкое пиво.',                      note: 'trinken → getrunken (неправильный)', audio: 'Ich habe deutsches Bier getrunken' },
    { de: 'Wir haben viel gegessen.',              ru: 'Мы много ели.',                             note: 'essen → gegessen — двойная ge-!', audio: 'Wir haben viel gegessen' },
    { de: 'Ich bin durch die Altstadt gelaufen.',  ru: 'Я гулял по старому городу.',                note: 'durch + Akk. = через. laufen с sein', audio: 'Ich bin durch die Altstadt gelaufen' },
    { de: 'Wir haben einen Museum besichtigt.',    ru: 'Мы осматривали музей.',                     note: 'besichtigen → besichtigt (без ge-)', audio: 'Wir haben ein Museum besichtigt' },
    { de: 'Hast du gut geschlafen?',               ru: 'Ты хорошо спал?',                           note: 'schlafen → geschlafen (с haben)', audio: 'Hast du gut geschlafen' },
    { de: 'Wann seid ihr zurückgekommen?',         ru: 'Когда вы вернулись?',                       note: 'zurückkommen — приставка ge- между!', audio: 'Wann seid ihr zurückgekommen' },
    { de: 'Wir sind am Sonntag angekommen.',       ru: 'Мы прибыли в воскресенье.',                 note: 'ankommen → angekommen (с sein)', audio: 'Wir sind am Sonntag angekommen' },
    { de: 'Ich habe einen Brief geschrieben.',     ru: 'Я написал письмо.',                         note: 'schreiben → geschrieben', audio: 'Ich habe einen Brief geschrieben' },
    { de: 'Ich habe das Buch gelesen.',            ru: 'Я прочитал книгу.',                         note: 'lesen → gelesen', audio: 'Ich habe das Buch gelesen' },
    { de: 'Was hast du am Wochenende gemacht?',    ru: 'Что ты делал на выходных?',                 note: 'самый частый вопрос в понедельник!', audio: 'Was hast du am Wochenende gemacht' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Urlaub',       ru: 'отпуск',                ipa: '[ˈuːɐ̯laʊ̯p]',         article: 'der' },
    { de: 'die Reise',        ru: 'путешествие',           ipa: '[ˈʁaɪ̯zə]',           article: 'die' },
    { de: 'das Hotel',        ru: 'отель',                 ipa: '[hoˈtɛl]',            article: 'das' },
    { de: 'der Strand',       ru: 'пляж',                  ipa: '[ʃtʁant]',            article: 'der' },
    { de: 'das Meer',         ru: 'море',                  ipa: '[meːɐ̯]',             article: 'das' },
    { de: 'die Berge',        ru: 'горы (мн.ч.)',          ipa: '[ˈbɛʁɡə]',            article: 'die' },
    { de: 'das Museum',       ru: 'музей',                 ipa: '[muˈzeːʊm]',          article: 'das' },
    { de: 'die Altstadt',     ru: 'старый город',          ipa: '[ˈaltˌʃtat]',         article: 'die' },
    { de: 'das Foto',         ru: 'фотография',            ipa: '[ˈfoːto]',            article: 'das' },
    { de: 'der Koffer',       ru: 'чемодан',               ipa: '[ˈkɔfɐ]',             article: 'der' },
    { de: 'das Ticket',       ru: 'билет',                 ipa: '[ˈtɪkət]',            article: 'das' },
    { de: 'der Flug',         ru: 'полёт, рейс',           ipa: '[fluːk]',             article: 'der' },
    { de: 'das Wetter',       ru: 'погода',                ipa: '[ˈvɛtɐ]',             article: 'das' },
    { de: 'fahren',           ru: 'ехать',                 ipa: '[ˈfaːʁən]',           article: '' },
    { de: 'fliegen',          ru: 'лететь',                ipa: '[ˈfliːɡn̩]',          article: '' },
    { de: 'reisen',           ru: 'путешествовать',        ipa: '[ˈʁaɪ̯zn̩]',          article: '' },
    { de: 'besuchen',         ru: 'посещать, навещать',    ipa: '[bəˈzuːxn̩]',         article: '' },
    { de: 'besichtigen',      ru: 'осматривать',           ipa: '[bəˈzɪçtɪɡn̩]',       article: '' },
    { de: 'buchen',           ru: 'бронировать',           ipa: '[ˈbuːxn̩]',           article: '' },
    { de: 'machen',           ru: 'делать',                ipa: '[ˈmaxn̩]',            article: '' },
    { de: 'sehen',            ru: 'видеть, смотреть',      ipa: '[ˈzeːən]',            article: '' },
    { de: 'gefallen',         ru: 'нравиться',             ipa: '[ɡəˈfalən]',          article: '' },
    { de: 'ankommen',         ru: 'прибывать',             ipa: '[ˈankɔmən]',          article: '' },
    { de: 'zurückkommen',     ru: 'возвращаться',          ipa: '[tsuˈʁʏkˌkɔmən]',     article: '' },
    { de: 'fantastisch',      ru: 'фантастический',        ipa: '[fanˈtastɪʃ]',        article: '' },
    { de: 'am Wochenende',    ru: 'на выходных',           ipa: '[am ˈvɔxn̩ˌʔɛndə]',   article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Perfekt — главное прошедшее время в разговоре',
      body: 'В разговорной речи немцы используют <strong>Perfekt</strong> почти всегда. Конструкция простая:<br><br>' +
            '<strong>haben / sein</strong> (2-я позиция, спрягается) <strong>+ Partizip II</strong> (в конце!).<br><br>' +
            '<em>Ich <strong>habe</strong> Pizza <strong>gegessen</strong>.</em> — Я съел пиццу.<br>' +
            '<em>Wir <strong>sind</strong> nach Berlin <strong>gefahren</strong>.</em> — Мы ездили в Берлин.<br>' +
            '<em><strong>Hast</strong> du gestern <strong>gearbeitet</strong>?</em> — Ты вчера работал?<br><br>' +
            'Главное правило: <strong>спрягаем только haben/sein</strong>, а главный глагол стоит неизменным в самом конце.',
      conjugation: [
        { pronoun: 'ich',           form: 'habe … gemacht',  audio: 'ich habe gemacht',  translation: 'я (с)делал' },
        { pronoun: 'du',            form: 'hast … gemacht',  audio: 'du hast gemacht',   translation: 'ты (с)делал' },
        { pronoun: 'er / sie / es', form: 'hat … gemacht',   audio: 'er hat gemacht',    translation: 'он (с)делал' },
        { pronoun: 'wir',           form: 'haben … gemacht', audio: 'wir haben gemacht', translation: 'мы (с)делали' },
        { pronoun: 'ihr',           form: 'habt … gemacht',  audio: 'ihr habt gemacht',  translation: 'вы (с)делали' },
        { pronoun: 'Sie / sie',     form: 'haben … gemacht', audio: 'Sie haben gemacht', translation: 'Вы / они (с)делали' }
      ]
    },
    {
      title: '⚡ haben или sein? — два правила',
      body: 'Вспомогательный глагол зависит от смысла основного:<br><br>' +
            '👉 <strong>sein</strong> — когда есть <strong>движение или изменение состояния</strong>:<br>' +
            '<em>gehen, fahren, fliegen, kommen, laufen, schwimmen, fallen, aufstehen, einschlafen, sterben, werden, sein, bleiben</em>.<br>' +
            '<em>Ich <strong>bin</strong> gestern nach Hause <strong>gegangen</strong>.</em><br><br>' +
            '👉 <strong>haben</strong> — со всеми остальными (~90% глаголов):<br>' +
            '<em>essen, trinken, machen, kaufen, lesen, schreiben, arbeiten, sehen…</em><br>' +
            '<em>Ich <strong>habe</strong> ein Buch <strong>gelesen</strong>.</em><br><br>' +
            '⚠️ <strong>sein</strong> и <strong>bleiben</strong> в Perfekt — всегда с <em>sein</em>: <em>Ich bin in Berlin gewesen / geblieben.</em>'
    },
    {
      title: '⚡ Partizip II — как образуется',
      body: 'Это самая тонкая часть Perfekt. Три модели:<br><br>' +
            '<strong>1. Правильные глаголы</strong>: <em>ge- + основа + -t</em><br>' +
            '<em>machen → <strong>gemacht</strong></em><br>' +
            '<em>kaufen → <strong>gekauft</strong></em><br>' +
            '<em>arbeiten → <strong>gearbeitet</strong></em><br><br>' +
            '<strong>2. Неправильные</strong>: <em>ge- + основа (часто с изменением гласной) + -en</em>. Их надо учить:<br>' +
            '<em>essen → <strong>gegessen</strong></em>, <em>trinken → <strong>getrunken</strong></em>, <em>fahren → <strong>gefahren</strong></em>, <em>sehen → <strong>gesehen</strong></em>, <em>schreiben → <strong>geschrieben</strong></em>.<br><br>' +
            '<strong>3. Глаголы на be-, ver-, ent-, er-, zer- и -ieren</strong> — <span style="color:var(--accent3)">БЕЗ ge-</span>:<br>' +
            '<em>besuchen → <strong>besucht</strong></em>, <em>verstehen → <strong>verstanden</strong></em>, <em>studieren → <strong>studiert</strong></em>.<br><br>' +
            '<strong>4. Отделяемые приставки</strong> — ge- встаёт <em>внутрь</em>:<br>' +
            '<em>aufstehen → <strong>aufgestanden</strong></em>, <em>einkaufen → <strong>eingekauft</strong></em>, <em>anrufen → <strong>angerufen</strong></em>.'
    },
    {
      title: '💡 Топ-15 Partizip II для A2',
      body: 'Эти 15 форм нужно знать наизусть — встретятся 100% раз в день:<br><br>' +
            '<em>sein → <strong>gewesen</strong></em> (был)<br>' +
            '<em>haben → <strong>gehabt</strong></em> (имел)<br>' +
            '<em>gehen → <strong>gegangen</strong></em> · <em>kommen → <strong>gekommen</strong></em><br>' +
            '<em>fahren → <strong>gefahren</strong></em> · <em>fliegen → <strong>geflogen</strong></em><br>' +
            '<em>essen → <strong>gegessen</strong></em> · <em>trinken → <strong>getrunken</strong></em><br>' +
            '<em>sehen → <strong>gesehen</strong></em> · <em>lesen → <strong>gelesen</strong></em><br>' +
            '<em>schreiben → <strong>geschrieben</strong></em> · <em>sprechen → <strong>gesprochen</strong></em><br>' +
            '<em>schlafen → <strong>geschlafen</strong></em> · <em>bleiben → <strong>geblieben</strong></em><br>' +
            '<em>nehmen → <strong>genommen</strong></em><br><br>' +
            '✨ Если не уверен — пробуй модель «правильного» глагола (ge- + -t). Часто это будет верно.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich',           blank: 'habe',    after: 'Pizza gegessen.',         translation: '— Я съел пиццу.',                        hintWord: 'habe',    hintRule: 'essen → с haben (нет движения)' },
      { before: '— Wir sind nach Berlin', blank: 'gefahren', after: '.',                translation: '— Мы ездили в Берлин.',                  hintWord: 'gefahren',hintRule: 'fahren → gefahren (с sein!)' },
      { before: '— Was hast du',   blank: 'gemacht', after: '?',                       translation: '— Что ты делал?',                         hintWord: 'gemacht', hintRule: 'machen → gemacht (правильный)' },
      { before: '— Ich bin um sieben', blank: 'aufgestanden', after: '.',              translation: '— Я встал в семь.',                       hintWord: 'aufgestanden', hintRule: 'aufstehen: ge- внутрь приставки' },
      { before: '— Wir',           blank: 'sind',    after: 'um neun angekommen.',     translation: '— Мы прибыли в девять.',                 hintWord: 'sind',    hintRule: 'ankommen с sein (движение)' },
      { before: '— Sie hat das Buch', blank: 'gelesen', after: '.',                    translation: '— Она прочла книгу.',                    hintWord: 'gelesen', hintRule: 'lesen → gelesen (неправильн.)' },
      { before: '— Ich habe Berlin', blank: 'besucht', after: '.',                     translation: '— Я посетил Берлин.',                    hintWord: 'besucht', hintRule: 'besuchen → besucht (без ge-)' },
      { before: '— Hast du gut',   blank: 'geschlafen', after: '?',                    translation: '— Ты хорошо спал?',                       hintWord: 'geschlafen', hintRule: 'schlafen → geschlafen (с haben)' }
    ],

    multipleChoice: [
      { question: 'Какой Partizip II у «machen»?',                                     options: ['machte', 'gemacht', 'machen', 'gemach'],                              correctIndex: 1 },
      { question: 'Какой глагол берёт «sein» в Perfekt?',                              options: ['essen', 'trinken', 'fahren', 'kaufen'],                              correctIndex: 2 },
      { question: 'Какой Partizip II у «essen»?',                                      options: ['geesst', 'geessen', 'gegessen', 'gegegessen'],                       correctIndex: 2 },
      { question: 'Куда ставится Partizip II?',                                       options: ['в начало', 'на 2-е место', 'в конец', 'после подлежащего'],          correctIndex: 2 },
      { question: '«Я был в отпуске» — правильно:',                                   options: ['Ich war im Urlaub.', 'Ich bin im Urlaub.', 'Ich habe Urlaub.', 'Ich war Urlaub.'], correctIndex: 0 },
      { question: 'Какая правильная форма у «besuchen»?',                              options: ['gebesucht', 'besuchte', 'besucht', 'besuchten'],                     correctIndex: 2 },
      { question: 'Какой Partizip II у «aufstehen»?',                                  options: ['aufgestanden', 'aufstanden', 'aufgestehen', 'geaufstanden'],         correctIndex: 0 },
      { question: '«Wir __ nach Italien __» — заполни:',                              options: ['haben / gefahren', 'sind / gefahren', 'sind / fahren', 'haben / fahren'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'machen → gemacht',     ru: 'делать → сделал' },
      { id: 2, de: 'essen → gegessen',     ru: 'есть → съел' },
      { id: 3, de: 'fahren → gefahren',    ru: 'ехать → ездил' },
      { id: 4, de: 'sein → gewesen',       ru: 'быть → был' },
      { id: 5, de: 'lesen → gelesen',      ru: 'читать → прочитал' },
      { id: 6, de: 'aufstehen → aufgestanden', ru: 'вставать → встал' },
      { id: 7, de: 'besuchen → besucht',   ru: 'посещать → посетил' },
      { id: 8, de: 'schreiben → geschrieben', ru: 'писать → написал' }
    ],

    dictation: [
      { word: 'Urlaub',     audio: 'Urlaub' },
      { word: 'gefahren',   audio: 'gefahren' },
      { word: 'gegessen',   audio: 'gegessen' },
      { word: 'gemacht',    audio: 'gemacht' },
      { word: 'besucht',    audio: 'besucht' },
      { word: 'gesehen',    audio: 'gesehen' },
      { word: 'Hotel',      audio: 'Hotel' },
      { word: 'Strand',     audio: 'Strand' }
    ]
  }
};
