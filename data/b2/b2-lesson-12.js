/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-12.js
   B2 · Урок 12: Berufliche Kommunikation — деловое общение
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-12',
  level:    'B2',
  unit:     12,
  title:    'Berufliche Kommunikation',
  subtitle: 'Деловое общение · E-Mails, Telefonate, Meetings',

  meta: {
    duration:  '40–45 мин',
    wordCount: 20,
    xpReward:  200
  },

  phrases: [
    { de: 'Sehr geehrte Damen und Herren,',                     ru: 'Уважаемые дамы и господа,',                        note: 'стандартное обращение, если имя неизвестно', audio: 'Sehr geehrte Damen und Herren' },
    { de: 'Sehr geehrte Frau Dr. Schmidt,',                     ru: 'Уважаемая госпожа доктор Шмидт,',                  note: 'с именем и титулом', audio: 'Sehr geehrte Frau Doktor Schmidt' },
    { de: 'vielen Dank für Ihre schnelle Rückmeldung.',         ru: 'Большое спасибо за ваш быстрый ответ.',            note: 'die Rückmeldung — обратная связь', audio: 'Vielen Dank für Ihre schnelle Rückmeldung' },
    { de: 'Ich beziehe mich auf Ihr Schreiben vom 12. März.',   ru: 'Я ссылаюсь на ваше письмо от 12 марта.',           note: 'sich beziehen auf + A', audio: 'Ich beziehe mich auf Ihr Schreiben vom zwölften März' },
    { de: 'Hiermit bestätige ich den Termin am Montag.',        ru: 'Настоящим подтверждаю встречу в понедельник.',     note: 'hiermit — настоящим (офиц.)', audio: 'Hiermit bestätige ich den Termin am Montag' },
    { de: 'Könnten wir den Termin auf Donnerstag verschieben?', ru: 'Могли бы мы перенести встречу на четверг?',        note: 'verschieben auf + A', audio: 'Könnten wir den Termin auf Donnerstag verschieben' },
    { de: 'Im Anhang finden Sie die gewünschten Unterlagen.',   ru: 'Во вложении вы найдёте запрошенные документы.',    note: 'der Anhang — вложение', audio: 'Im Anhang finden Sie die gewünschten Unterlagen' },
    { de: 'Bitte lassen Sie mich wissen, ob der Vorschlag für Sie passt.', ru: 'Пожалуйста, дайте мне знать, подходит ли вам это предложение.', note: 'jemanden wissen lassen', audio: 'Bitte lassen Sie mich wissen, ob der Vorschlag für Sie passt' },
    { de: 'Ich melde mich, sobald ich Näheres weiß.',           ru: 'Я свяжусь с вами, как только узнаю подробности.',  note: 'sich melden — выйти на связь', audio: 'Ich melde mich, sobald ich Näheres weiß' },
    { de: 'Mit freundlichen Grüßen',                            ru: 'С уважением (стандартная подпись)',                note: 'сокращается как MfG, но в письме — полностью!', audio: 'Mit freundlichen Grüßen' },
    { de: 'Guten Tag, Sie sprechen mit Anna Kowal von der Firma Solaris.', ru: 'Добрый день, с вами говорит Анна Коваль из фирмы «Солярис».', note: 'представление по телефону', audio: 'Guten Tag, Sie sprechen mit Anna Kowal von der Firma Solaris' },
    { de: 'Worum geht es denn genau?',                          ru: 'О чём конкретно идёт речь?',                       note: 'телефонное уточнение', audio: 'Worum geht es denn genau' },
    { de: 'Könnten Sie mich bitte mit Herrn Weber verbinden?',  ru: 'Не могли бы вы соединить меня с господином Вебером?', note: 'verbinden mit + D', audio: 'Könnten Sie mich bitte mit Herrn Weber verbinden' },
    { de: 'Er ist gerade in einer Besprechung. Soll ich etwas ausrichten?', ru: 'Он сейчас на совещании. Что-нибудь передать?', note: 'etwas ausrichten — передать сообщение', audio: 'Er ist gerade in einer Besprechung. Soll ich etwas ausrichten' },
    { de: 'Ich rufe später noch einmal zurück.',                ru: 'Я перезвоню позже.',                               note: 'zurückrufen — перезвонить', audio: 'Ich rufe später noch einmal zurück' },
    { de: 'Lassen Sie uns einen Termin für nächste Woche vereinbaren.', ru: 'Давайте договоримся о встрече на следующей неделе.', note: 'einen Termin vereinbaren', audio: 'Lassen Sie uns einen Termin für nächste Woche vereinbaren' },
    { de: 'Ich fasse die wichtigsten Punkte kurz zusammen.',    ru: 'Кратко подведу итог по важнейшим пунктам.',        note: 'zusammenfassen — резюмировать', audio: 'Ich fasse die wichtigsten Punkte kurz zusammen' },
    { de: 'Gibt es dazu noch Fragen oder Anmerkungen?',         ru: 'Есть ли ещё вопросы или замечания по этому поводу?', note: 'die Anmerkung — замечание', audio: 'Gibt es dazu noch Fragen oder Anmerkungen' },
    { de: 'Ich bin ab Montag wieder im Büro erreichbar.',       ru: 'С понедельника я снова буду на связи в офисе.',    note: 'erreichbar — доступный для связи', audio: 'Ich bin ab Montag wieder im Büro erreichbar' },
    { de: 'Vielen Dank im Voraus für Ihre Mühe!',               ru: 'Заранее большое спасибо за ваши старания!',        note: 'im Voraus — заранее', audio: 'Vielen Dank im Voraus für Ihre Mühe' }
  ],

  vocabulary: [
    { de: 'die Rückmeldung',   ru: 'обратная связь, ответ',      ipa: '[ˈʁʏkˌmɛldʊŋ]',      article: 'die' },
    { de: 'das Schreiben',     ru: 'письмо (офиц.)',             ipa: '[ˈʃʁaɪ̯bn̩]',        article: 'das' },
    { de: 'der Anhang',        ru: 'вложение, приложение',       ipa: '[ˈanhaŋ]',           article: 'der' },
    { de: 'die Unterlagen',    ru: 'документы (Pl.)',            ipa: '[ˈʊntɐlaːɡn̩]',      article: 'die' },
    { de: 'der Termin',        ru: 'встреча, запись',            ipa: '[tɛʁˈmiːn]',         article: 'der' },
    { de: 'vereinbaren',       ru: 'договориться о',             ipa: '[fɛʁˈʔaɪ̯nbaːʁən]',  article: '' },
    { de: 'verschieben',       ru: 'переносить',                 ipa: '[fɛʁˈʃiːbn̩]',       article: '' },
    { de: 'absagen',           ru: 'отменять',                   ipa: '[ˈapzaːɡn̩]',        article: '' },
    { de: 'bestätigen',        ru: 'подтверждать',               ipa: '[bəˈʃtɛːtɪɡn̩]',     article: '' },
    { de: 'die Besprechung',   ru: 'совещание',                  ipa: '[bəˈʃpʁɛçʊŋ]',       article: 'die' },
    { de: 'ausrichten',        ru: 'передать (сообщение)',       ipa: '[ˈaʊ̯sʁɪçtn̩]',      article: '' },
    { de: 'verbinden mit',     ru: 'соединять с',                ipa: '[fɛʁˈbɪndn̩]',       article: '' },
    { de: 'zurückrufen',       ru: 'перезванивать',              ipa: '[t͡suˈʁʏkˌʁuːfn̩]', article: '' },
    { de: 'zusammenfassen',    ru: 'резюмировать',               ipa: '[t͡suˈzamənˌfasn̩]', article: '' },
    { de: 'die Anmerkung',     ru: 'замечание',                  ipa: '[ˈanmɛʁkʊŋ]',        article: 'die' },
    { de: 'erreichbar',        ru: 'доступный (на связи)',       ipa: '[ɛʁˈʁaɪ̯çbaːɐ̯]',    article: '' },
    { de: 'im Voraus',         ru: 'заранее',                    ipa: '[ɪm foˈʁaʊ̯s]',      article: '' },
    { de: 'die Mühe',          ru: 'старание, усилие',           ipa: '[ˈmyːə]',            article: 'die' },
    { de: 'der Vorschlag',     ru: 'предложение',                ipa: '[ˈfoːɐ̯ʃlaːk]',      article: 'der' },
    { de: 'sich beziehen auf', ru: 'ссылаться на (+A)',          ipa: '[bəˈt͡siːən]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ Структура деловой E-Mail',
      body: 'Немецкое деловое письмо строится по жёсткой схеме:<br><br>' +
            '<strong>1. Anrede:</strong> <em>Sehr geehrte Frau Schmidt,</em> (незнакомой) / <em>Liebe Frau Schmidt,</em> (знакомой)<br>' +
            '<strong>2.</strong> После запятой в обращении — <strong>маленькая буква</strong>: <em>…Herren, <strong>v</strong>ielen Dank für…</em><br>' +
            '<strong>3. Betreff</strong> (тема) — коротко и без точки.<br>' +
            '<strong>4. Gruß:</strong> <em>Mit freundlichen Grüßen</em> — без запятой и точки после!',
      conjugation: [
        { pronoun: 'обращение', form: 'Sehr geehrter Herr Weber,',       audio: 'Sehr geehrter Herr Weber',       translation: 'Уважаемый господин Вебер,' },
        { pronoun: 'знакомым',  form: 'Liebe Frau Schmidt,',             audio: 'Liebe Frau Schmidt',             translation: 'Дорогая госпожа Шмидт,' },
        { pronoun: 'начало',    form: 'vielen Dank für Ihre E-Mail.',    audio: 'Vielen Dank für Ihre E-Mail',    translation: 'большое спасибо за ваше письмо.' },
        { pronoun: 'финал',     form: 'Mit freundlichen Grüßen',         audio: 'Mit freundlichen Grüßen',        translation: 'С уважением' }
      ]
    },
    {
      title: '⚡ Термин-глаголы: vereinbaren, verschieben, absagen',
      body: 'Вся жизнь немецкого офиса вертится вокруг слова <strong>der Termin</strong>:<br><br>' +
            '<em>einen Termin <strong>vereinbaren</strong></em> — договориться о встрече<br>' +
            '<em>einen Termin <strong>bestätigen</strong></em> — подтвердить<br>' +
            '<em>einen Termin <strong>verschieben</strong> (auf + A)</em> — перенести (на)<br>' +
            '<em>einen Termin <strong>absagen</strong></em> — отменить<br>' +
            '<em>einen Termin <strong>wahrnehmen</strong></em> — явиться на встречу (офиц.)',
      conjugation: [
        { pronoun: 'договориться', form: 'Wir vereinbaren einen Termin.',      audio: 'Wir vereinbaren einen Termin',      translation: 'Мы договариваемся о встрече.' },
        { pronoun: 'подтвердить',  form: 'Ich bestätige den Termin.',          audio: 'Ich bestätige den Termin',          translation: 'Я подтверждаю встречу.' },
        { pronoun: 'перенести',    form: 'Wir verschieben ihn auf Freitag.',   audio: 'Wir verschieben ihn auf Freitag',   translation: 'Мы переносим её на пятницу.' },
        { pronoun: 'отменить',     form: 'Leider muss ich den Termin absagen.', audio: 'Leider muss ich den Termin absagen', translation: 'К сожалению, мне придётся отменить встречу.' }
      ]
    },
    {
      title: '💡 Телефонный этикет',
      body: 'По-немецки трубку берут, называя <strong>фамилию или фирму</strong>, а не «алло»:<br>' +
            '<em>«Müller.» / «Firma Solaris, Anna Kowal, guten Tag.»</em><br><br>' +
            'Полезный набор:<br>' +
            '<em>Könnten Sie mich mit … <strong>verbinden</strong>?</em> — соедините с…<br>' +
            '<em>Soll ich etwas <strong>ausrichten</strong>?</em> — что-нибудь передать?<br>' +
            '<em>Ich rufe <strong>zurück</strong>.</em> — я перезвоню.<br>' +
            '<em>Können Sie das bitte <strong>buchstabieren</strong>?</em> — продиктуйте по буквам.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Sehr',                blank: 'geehrte',   after: 'Damen und Herren,',            translation: '— Уважаемые дамы и господа,',              hintWord: 'geehrte',  hintRule: 'стандартное деловое обращение' },
      { before: '— Mit freundlichen',    blank: 'Grüßen',    after: '',                             translation: '— С уважением',                            hintWord: 'Grüßen',   hintRule: 'стандартная подпись' },
      { before: '— Im',                  blank: 'Anhang',    after: 'finden Sie die Unterlagen.',   translation: '— Во вложении вы найдёте документы.',      hintWord: 'Anhang',   hintRule: 'вложение = der Anhang' },
      { before: '— Können wir den Termin', blank: 'verschieben', after: '?',                        translation: '— Можем мы перенести встречу?',            hintWord: 'verschieben', hintRule: 'перенести = verschieben' },
      { before: '— Hiermit',             blank: 'bestätige', after: 'ich den Termin.',              translation: '— Настоящим подтверждаю встречу.',         hintWord: 'bestätige', hintRule: 'подтверждать = bestätigen' },
      { before: '— Soll ich etwas',      blank: 'ausrichten', after: '?',                           translation: '— Что-нибудь передать?',                   hintWord: 'ausrichten', hintRule: 'передать сообщение' },
      { before: '— Ich rufe später',     blank: 'zurück',    after: '.',                            translation: '— Я перезвоню позже.',                     hintWord: 'zurück',   hintRule: 'zurückrufen — приставка в конец' },
      { before: '— Vielen Dank im',      blank: 'Voraus',    after: '!',                            translation: '— Заранее спасибо!',                       hintWord: 'Voraus',   hintRule: 'заранее = im Voraus' }
    ],

    multipleChoice: [
      { question: 'Обращение к незнакомому адресату…',                 options: ['Hallo Herr Weber!', 'Sehr geehrter Herr Weber,', 'Lieber Weber,', 'Guten Tag Weber,'], correctIndex: 1 },
      { question: 'После «Sehr geehrte Damen und Herren,» текст начинается…', options: ['с большой буквы', 'с маленькой буквы', 'с новой темы', 'с даты'], correctIndex: 1 },
      { question: 'После «Mit freundlichen Grüßen» ставится…',         options: ['точка', 'запятая', 'ничего', 'восклицательный знак'],               correctIndex: 2 },
      { question: '«Перенести встречу на пятницу» — den Termin …',     options: ['auf Freitag verschieben', 'zu Freitag schieben', 'nach Freitag stellen', 'an Freitag bewegen'], correctIndex: 0 },
      { question: '«отменить встречу» — …',                            options: ['den Termin absagen', 'den Termin aussagen', 'den Termin zusagen', 'den Termin versagen'], correctIndex: 0 },
      { question: 'Немцы отвечают на звонок…',                         options: ['«Hallo?»', 'фамилией или названием фирмы', '«Ja, bitte?»', 'молчанием'], correctIndex: 1 },
      { question: '«Соедините меня с…» — Könnten Sie mich bitte …',    options: ['verbinden mit', 'anschließen an', 'verknüpfen mit', 'binden an'],   correctIndex: 0 },
      { question: '«die Unterlagen» — это…',                           options: ['подчинённые', 'документы', 'основания', 'нижнее бельё'],            correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Rückmeldung',       ru: 'обратная связь' },
      { id: 2, de: 'der Anhang',            ru: 'вложение' },
      { id: 3, de: 'die Besprechung',       ru: 'совещание' },
      { id: 4, de: 'einen Termin vereinbaren', ru: 'договориться о встрече' },
      { id: 5, de: 'absagen',               ru: 'отменить' },
      { id: 6, de: 'ausrichten',            ru: 'передать сообщение' },
      { id: 7, de: 'erreichbar',            ru: 'на связи, доступен' },
      { id: 8, de: 'im Voraus',             ru: 'заранее' }
    ],

    dictation: [
      { word: 'Rückmeldung',    audio: 'Rückmeldung' },
      { word: 'Unterlagen',     audio: 'Unterlagen' },
      { word: 'vereinbaren',    audio: 'vereinbaren' },
      { word: 'verschieben',    audio: 'verschieben' },
      { word: 'bestätigen',     audio: 'bestätigen' },
      { word: 'Besprechung',    audio: 'Besprechung' },
      { word: 'zusammenfassen', audio: 'zusammenfassen' },
      { word: 'erreichbar',     audio: 'erreichbar' }
    ]
  }
};
