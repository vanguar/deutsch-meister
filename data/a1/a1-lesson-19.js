/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-19.js
   A1 · Урок 19: Feste und Geburtstage — Праздники и день рождения
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-19',
  level: 'A1',
  unit:  19,
  title: 'Feste und Geburtstage',
  subtitle: 'Праздники и день рождения',

  meta: {
    duration: '25–30 мин',
    wordCount: 18,
    xpReward: 100
  },

  phrases: [
    { de: 'Herzlichen Glückwunsch zum Geburtstag!', ru: 'С днём рождения!',              note: 'стандартное поздравление', audio: 'Herzlichen Glückwunsch zum Geburtstag' },
    { de: 'Alles Gute!',                         ru: 'Всего хорошего!',                  note: 'короткое поздравление', audio: 'Alles Gute' },
    { de: 'Wann hast du Geburtstag?',            ru: 'Когда у тебя день рождения?',      note: 'Geburtstag haben — иметь день рождения', audio: 'Wann hast du Geburtstag' },
    { de: 'Ich habe am fünften Mai Geburtstag.', ru: 'У меня день рождения пятого мая.', note: 'am + порядковое числительное + месяц', audio: 'Ich habe am fünften Mai Geburtstag' },
    { de: 'Ich lade dich zu meiner Party ein.',  ru: 'Я приглашаю тебя на свою вечеринку.', note: 'einladen — приглашать (отделяемая приставка)', audio: 'Ich lade dich zu meiner Party ein' },
    { de: 'Kommst du zu meiner Feier?',          ru: 'Ты придёшь на моё торжество?',     note: 'die Feier — торжество, праздник', audio: 'Kommst du zu meiner Feier' },
    { de: 'Ja, gerne! Ich komme.',               ru: 'Да, с удовольствием! Я приду.',    note: 'gerne — охотно', audio: 'Ja, gerne. Ich komme' },
    { de: 'Hier ist ein Geschenk für dich.',     ru: 'Вот подарок для тебя.',            note: 'das Geschenk — подарок; für + Akk.', audio: 'Hier ist ein Geschenk für dich' },
    { de: 'Vielen Dank! Wie schön!',             ru: 'Большое спасибо! Как красиво!',    note: 'реакция на подарок', audio: 'Vielen Dank. Wie schön' },
    { de: 'Wir feiern Weihnachten mit der Familie.', ru: 'Мы празднуем Рождество с семьёй.', note: 'feiern — праздновать; Weihnachten — Рождество', audio: 'Wir feiern Weihnachten mit der Familie' },
    { de: 'Frohe Weihnachten!',                  ru: 'Счастливого Рождества!',           note: 'froh — радостный', audio: 'Frohe Weihnachten' },
    { de: 'Ein gutes neues Jahr!',               ru: 'С Новым годом!',                   note: 'также: Frohes neues Jahr!', audio: 'Ein gutes neues Jahr' },
    { de: 'Wir machen eine Torte.',              ru: 'Мы делаем торт.',                  note: 'die Torte — торт', audio: 'Wir machen eine Torte' },
    { de: 'Die Kerzen brennen.',                 ru: 'Свечи горят.',                     note: 'die Kerze — свеча; brennen — гореть', audio: 'Die Kerzen brennen' },
    { de: 'Wir singen ein Geburtstagslied.',     ru: 'Мы поём песню на день рождения.',  note: 'das Lied — песня', audio: 'Wir singen ein Geburtstagslied' },
    { de: 'Die Party war super!',                ru: 'Вечеринка была супер!',            note: 'war — была (прошедшее от sein)', audio: 'Die Party war super' }
  ],

  vocabulary: [
    { de: 'das Fest',        ru: 'праздник',           ipa: '[fɛst]',            article: 'das' },
    { de: 'der Geburtstag',  ru: 'день рождения',      ipa: '[ɡəˈbuːɐ̯tstaːk]',  article: 'der' },
    { de: 'die Party',       ru: 'вечеринка',          ipa: '[ˈpaːɐ̯ti]',        article: 'die' },
    { de: 'die Feier',       ru: 'торжество',          ipa: '[ˈfaɪ̯ɐ]',          article: 'die' },
    { de: 'das Geschenk',    ru: 'подарок',            ipa: '[ɡəˈʃɛŋk]',         article: 'das' },
    { de: 'die Torte',       ru: 'торт',               ipa: '[ˈtɔʁtə]',          article: 'die' },
    { de: 'die Kerze',       ru: 'свеча',              ipa: '[ˈkɛʁtsə]',         article: 'die' },
    { de: 'das Lied',        ru: 'песня',              ipa: '[liːt]',            article: 'das' },
    { de: 'der Gast',        ru: 'гость',              ipa: '[ɡast]',            article: 'der' },
    { de: 'Weihnachten',     ru: 'Рождество',          ipa: '[ˈvaɪ̯naxtn̩]',     article: 'das' },
    { de: 'Ostern',          ru: 'Пасха',              ipa: '[ˈoːstɐn]',         article: 'das' },
    { de: 'Silvester',       ru: 'канун Нового года',  ipa: '[zɪlˈvɛstɐ]',       article: 'das' },
    { de: 'feiern',          ru: 'праздновать',        ipa: '[ˈfaɪ̯ɐn]',         article: '' },
    { de: 'einladen',        ru: 'приглашать',         ipa: '[ˈaɪ̯nˌlaːdn̩]',    article: '' },
    { de: 'schenken',        ru: 'дарить',             ipa: '[ˈʃɛŋkn̩]',         article: '' },
    { de: 'gratulieren',     ru: 'поздравлять',        ipa: '[ɡʁatuˈliːʁən]',    article: '' },
    { de: 'tanzen',          ru: 'танцевать',          ipa: '[ˈtantsn̩]',        article: '' },
    { de: 'froh',            ru: 'радостный',          ipa: '[fʁoː]',            article: '' }
  ],

  grammar: [
    {
      title: '⚡ Даты: am + порядковое числительное',
      body: 'Даты называются с <strong>am</strong> и окончанием <strong>-ten</strong> (до 19) или <strong>-sten</strong> (от 20):<br><br>' +
            '<em>Ich habe <strong>am fünften</strong> Mai Geburtstag.</em> — У меня день рождения 5 мая.<br>' +
            '<em><strong>am ersten</strong> Januar</em> — первого января<br><br>' +
            '⚠️ Особые формы: <em>am ersten (1.), am dritten (3.), am siebten (7.)</em>.',
      conjugation: [
        { pronoun: '1.',  form: 'am ersten',           audio: 'am ersten',           translation: 'первого' },
        { pronoun: '3.',  form: 'am dritten',          audio: 'am dritten',          translation: 'третьего' },
        { pronoun: '5.',  form: 'am fünften',          audio: 'am fünften',          translation: 'пятого' },
        { pronoun: '7.',  form: 'am siebten',          audio: 'am siebten',          translation: 'седьмого' },
        { pronoun: '20.', form: 'am zwanzigsten',      audio: 'am zwanzigsten',      translation: 'двадцатого' },
        { pronoun: '31.', form: 'am einunddreißigsten', audio: 'am einunddreißigsten', translation: 'тридцать первого' }
      ]
    },
    {
      title: '⚡ Поздравления',
      body: 'Готовые формулы поздравлений — просто запомни их:<br><br>' +
            '<em><strong>Herzlichen Glückwunsch</strong> zum Geburtstag!</em> — С днём рождения!<br>' +
            '<em><strong>Alles Gute!</strong></em> — Всего хорошего!<br>' +
            '<em><strong>Frohe</strong> Weihnachten!</em> — Счастливого Рождества!<br>' +
            '<em><strong>Ein gutes neues Jahr!</strong></em> — С Новым годом!',
      conjugation: [
        { pronoun: 'день рождения', form: 'Herzlichen Glückwunsch!', audio: 'Herzlichen Glückwunsch', translation: 'Поздравляю!' },
        { pronoun: 'универсально',  form: 'Alles Gute!',             audio: 'Alles Gute',             translation: 'Всего хорошего!' },
        { pronoun: 'Рождество',     form: 'Frohe Weihnachten!',      audio: 'Frohe Weihnachten',      translation: 'Счастливого Рождества!' },
        { pronoun: 'Новый год',     form: 'Frohes neues Jahr!',      audio: 'Frohes neues Jahr',      translation: 'С Новым годом!' },
        { pronoun: 'Пасха',         form: 'Frohe Ostern!',           audio: 'Frohe Ostern',           translation: 'Счастливой Пасхи!' }
      ]
    },
    {
      title: '💡 einladen — приглашать (отделяемая приставка)',
      body: 'Приставка <strong>ein-</strong> отделяется и уходит в конец:<br><br>' +
            '<em>Ich lade dich <strong>ein</strong>.</em> — Я приглашаю тебя.<br>' +
            '<em>Er lädt uns zur Party <strong>ein</strong>.</em> — Он приглашает нас на вечеринку.<br><br>' +
            'Также заметь: <em>laden → l<strong>ä</strong>dt</em> (a→ä для er/sie/es).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Herzlichen',            blank: 'Glückwunsch', after: 'zum Geburtstag!',       translation: '— С днём рождения!',                  hintWord: 'Glückwunsch', hintRule: 'Herzlichen Glückwunsch — поздравляю' },
      { before: '— Wann hast du',          blank: 'Geburtstag',  after: '?',                     translation: '— Когда у тебя день рождения?',       hintWord: 'Geburtstag',  hintRule: 'Geburtstag haben' },
      { before: '— Ich habe am',           blank: 'fünften',     after: 'Mai Geburtstag.',       translation: '— У меня день рождения пятого мая.',  hintWord: 'fünften',     hintRule: 'am + -ten (порядковое)' },
      { before: '— Hier ist ein',          blank: 'Geschenk',    after: 'für dich.',             translation: '— Вот подарок для тебя.',             hintWord: 'Geschenk',    hintRule: 'das Geschenk — подарок' },
      { before: '— Wir',                   blank: 'feiern',      after: 'Weihnachten zu Hause.', translation: '— Мы празднуем Рождество дома.',      hintWord: 'feiern',      hintRule: 'feiern — праздновать' },
      { before: '— Ich lade dich zur Party', blank: 'ein',       after: '.',                     translation: '— Я приглашаю тебя на вечеринку.',    hintWord: 'ein',         hintRule: 'einladen — приставка в конец' },
      { before: '— Frohe',                 blank: 'Weihnachten', after: '!',                     translation: '— Счастливого Рождества!',            hintWord: 'Weihnachten', hintRule: 'Weihnachten — Рождество' },
      { before: '— Die Party',             blank: 'war',         after: 'super!',                translation: '— Вечеринка была супер!',             hintWord: 'war',         hintRule: 'war — прошедшее от sein' }
    ],

    multipleChoice: [
      { question: 'Как поздравить с днём рождения?',           options: ['Guten Tag!', 'Herzlichen Glückwunsch!', 'Auf Wiedersehen!', 'Danke schön!'], correctIndex: 1 },
      { question: '«Das Geschenk» — это…',                     options: ['торт', 'подарок', 'песня', 'гость'],                          correctIndex: 1 },
      { question: '«Пятого мая» по-немецки…',                  options: ['am fünf Mai', 'am fünften Mai', 'im fünften Mai', 'fünf Mai'], correctIndex: 1 },
      { question: '«Weihnachten» — это…',                      options: ['Пасха', 'Новый год', 'Рождество', 'день рождения'],           correctIndex: 2 },
      { question: '«Einladen» значит…',                        options: ['дарить', 'приглашать', 'праздновать', 'петь'],                correctIndex: 1 },
      { question: '«Schenken» значит…',                        options: ['покупать', 'дарить', 'получать', 'заворачивать'],             correctIndex: 1 },
      { question: '«Silvester» — это…',                        options: ['Рождество', 'канун Нового года', 'Пасха', 'карнавал'],        correctIndex: 1 },
      { question: '«Die Party war super» — глагол «war» это…', options: ['настоящее время', 'прошедшее от sein', 'будущее время', 'повелительное наклонение'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Geburtstag',  ru: 'день рождения' },
      { id: 2, de: 'das Geschenk',    ru: 'подарок' },
      { id: 3, de: 'die Torte',       ru: 'торт' },
      { id: 4, de: 'die Kerze',       ru: 'свеча' },
      { id: 5, de: 'Weihnachten',     ru: 'Рождество' },
      { id: 6, de: 'feiern',          ru: 'праздновать' },
      { id: 7, de: 'einladen',        ru: 'приглашать' },
      { id: 8, de: 'der Gast',        ru: 'гость' }
    ],

    dictation: [
      { word: 'Geburtstag',  audio: 'Geburtstag' },
      { word: 'Geschenk',    audio: 'Geschenk' },
      { word: 'Party',       audio: 'Party' },
      { word: 'Torte',       audio: 'Torte' },
      { word: 'feiern',      audio: 'feiern' },
      { word: 'einladen',    audio: 'einladen' },
      { word: 'tanzen',      audio: 'tanzen' },
      { word: 'Fest',        audio: 'Fest' }
    ]
  }
};
