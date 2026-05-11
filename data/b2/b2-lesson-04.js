/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-04.js
   B2 · Урок 4: Nominalisierung — Номинализация
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-04',
  level:    'B2',
  unit:     4,
  title:    'Nominalisierung',
  subtitle: 'Номинализация · глагол и прилагательное → существительное',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Die Entscheidung wurde getroffen.',                   ru: 'Решение было принято.',                         note: 'entscheiden → die Entscheidung', audio: 'Die Entscheidung wurde getroffen' },
    { de: 'Die Entwicklung der Technologie ist rasant.',        ru: 'Развитие технологий стремительно.',              note: 'entwickeln → die Entwicklung', audio: 'Die Entwicklung der Technologie ist rasant' },
    { de: 'Die Verbesserung des Systems ist notwendig.',        ru: 'Совершенствование системы необходимо.',          note: 'verbessern → die Verbesserung', audio: 'Die Verbesserung des Systems ist notwendig' },
    { de: 'Die Analyse der Daten dauert lange.',                ru: 'Анализ данных занимает много времени.',          note: 'analysieren → die Analyse', audio: 'Die Analyse der Daten dauert lange' },
    { de: 'Das Lesen fördert das Denken.',                      ru: 'Чтение способствует мышлению.',                  note: 'lesen → das Lesen (субстантивированный инфинитив)', audio: 'Das Lesen fördert das Denken' },
    { de: 'Das Scheitern lehrt uns viel.',                      ru: 'Провал учит нас многому.',                      note: 'scheitern → das Scheitern', audio: 'Das Scheitern lehrt uns viel' },
    { de: 'Die Schönheit der Natur ist einzigartig.',           ru: 'Красота природы уникальна.',                    note: 'schön → die Schönheit (-heit)', audio: 'Die Schönheit der Natur ist einzigartig' },
    { de: 'Die Freiheit ist ein hohes Gut.',                    ru: 'Свобода — высокое благо.',                      note: 'frei → die Freiheit (-heit)', audio: 'Die Freiheit ist ein hohes Gut' },
    { de: 'Die Gleichheit aller Menschen ist ein Grundsatz.',   ru: 'Равенство всех людей — основной принцип.',      note: 'gleich → die Gleichheit', audio: 'Die Gleichheit aller Menschen ist ein Grundsatz' },
    { de: 'Die Möglichkeit, zu reisen, begeistert sie.',        ru: 'Возможность путешествовать её восхищает.',      note: 'möglich → die Möglichkeit (-keit)', audio: 'Die Möglichkeit zu reisen begeistert sie' },
    { de: 'Die Wichtigkeit dieser Aufgabe ist klar.',           ru: 'Важность этой задачи очевидна.',                note: 'wichtig → die Wichtigkeit', audio: 'Die Wichtigkeit dieser Aufgabe ist klar' },
    { de: 'Das Schreiben des Berichts dauerte zwei Stunden.',   ru: 'Написание отчёта заняло два часа.',             note: 'субстантивированный инфинитив с Genitivattribut', audio: 'Das Schreiben des Berichts dauerte zwei Stunden' },
    { de: 'Die Lösung des Problems wurde gefunden.',            ru: 'Решение проблемы было найдено.',                note: 'lösen → die Lösung (-ung)', audio: 'Die Lösung des Problems wurde gefunden' },
    { de: 'Die Einführung neuer Gesetze ist geplant.',          ru: 'Введение новых законов запланировано.',         note: 'einführen → die Einführung', audio: 'Die Einführung neuer Gesetze ist geplant' },
    { de: 'Die Nutzung von Smartphones nimmt zu.',              ru: 'Использование смартфонов растёт.',              note: 'nutzen → die Nutzung', audio: 'Die Nutzung von Smartphones nimmt zu' },
    { de: 'Die Zusammenarbeit zwischen den Ländern ist wichtig.', ru: 'Сотрудничество между странами важно.',       note: 'zusammenarbeiten → die Zusammenarbeit', audio: 'Die Zusammenarbeit zwischen den Ländern ist wichtig' },
    { de: 'Die Genehmigung wurde erteilt.',                     ru: 'Разрешение было выдано.',                      note: 'genehmigen → die Genehmigung', audio: 'Die Genehmigung wurde erteilt' },
    { de: 'Das Verständnis für andere Kulturen ist wichtig.',   ru: 'Понимание других культур важно.',              note: 'verstehen → das Verständnis (-nis)', audio: 'Das Verständnis für andere Kulturen ist wichtig' },
    { de: 'Die Überzeugung, dass es besser wird, hilft.',       ru: 'Убеждённость в том, что станет лучше, помогает.', note: 'überzeugen → die Überzeugung', audio: 'Die Überzeugung, dass es besser wird, hilft' },
    { de: 'Das Aufgeben ist keine Option.',                     ru: 'Сдаться — не вариант.',                        note: 'aufgeben → das Aufgeben (инфинитив)', audio: 'Das Aufgeben ist keine Option' },
    { de: 'Die Umsetzung des Plans beginnt morgen.',            ru: 'Реализация плана начнётся завтра.',            note: 'umsetzen → die Umsetzung', audio: 'Die Umsetzung des Plans beginnt morgen' },
    { de: 'Das Versagen hat mich gelehrt, durchzuhalten.',      ru: 'Провал научил меня держаться.',               note: 'versagen → das Versagen', audio: 'Das Versagen hat mich gelehrt, durchzuhalten' },
    { de: 'Die Bereitschaft zur Veränderung ist gefragt.',      ru: 'Востребована готовность к переменам.',         note: 'bereit → die Bereitschaft (-schaft)', audio: 'Die Bereitschaft zur Veränderung ist gefragt' },
    { de: 'Das Ergebnis der Studie ist überraschend.',          ru: 'Результат исследования удивителен.',           note: 'ergeben → das Ergebnis', audio: 'Das Ergebnis der Studie ist überraschend' }
  ],

  vocabulary: [
    { de: 'die Nominalisierung', ru: 'номинализация',           ipa: '[nomɪnalɪˈziːʁʊŋ]',  article: 'die' },
    { de: 'die Entscheidung',    ru: 'решение',                 ipa: '[ɛntˈʃaɪ̯dʊŋ]',       article: 'die' },
    { de: 'die Entwicklung',     ru: 'развитие',                ipa: '[ɛntˈvɪklʊŋ]',        article: 'die' },
    { de: 'die Verbesserung',    ru: 'улучшение',               ipa: '[fɛʁˈbɛsɐʊŋ]',        article: 'die' },
    { de: 'die Lösung',          ru: 'решение (задачи)',        ipa: '[ˈløːzʊŋ]',            article: 'die' },
    { de: 'die Einführung',      ru: 'введение',                ipa: '[ˈaɪ̯nˌfyːʁʊŋ]',      article: 'die' },
    { de: 'die Nutzung',         ru: 'использование',           ipa: '[ˈnʊtsʊŋ]',            article: 'die' },
    { de: 'die Genehmigung',     ru: 'разрешение, одобрение',  ipa: '[ɡəˈneːmɪɡʊŋ]',       article: 'die' },
    { de: 'die Umsetzung',       ru: 'реализация',              ipa: '[ˈʊmzɛtsʊŋ]',          article: 'die' },
    { de: 'die Bereitschaft',    ru: 'готовность',              ipa: '[bəˈʁaɪ̯tʃaft]',        article: 'die' },
    { de: 'das Ergebnis',        ru: 'результат',               ipa: '[ɛʁˈɡeːpnɪs]',         article: 'das' },
    { de: 'das Verständnis',     ru: 'понимание',               ipa: '[fɛʁˈʃtɛntnɪs]',       article: 'das' },
    { de: 'das Lesen',           ru: 'чтение',                  ipa: '[ˈleːzn̩]',             article: 'das' },
    { de: 'das Scheitern',       ru: 'провал (процесс)',        ipa: '[ˈʃaɪ̯tɐn]',            article: 'das' },
    { de: 'die Schönheit',       ru: 'красота',                 ipa: '[ˈʃøːnhaɪ̯t]',          article: 'die' },
    { de: 'die Freiheit',        ru: 'свобода',                 ipa: '[ˈfʁaɪ̯haɪ̯t]',          article: 'die' },
    { de: 'die Möglichkeit',     ru: 'возможность',             ipa: '[ˈmøːklɪçkaɪ̯t]',       article: 'die' },
    { de: 'die Wichtigkeit',     ru: 'важность',                ipa: '[ˈvɪçtɪçkaɪ̯t]',        article: 'die' },
    { de: '-ung',                ru: 'суффикс fem. (действие)', ipa: '[ʊŋ]',                 article: '' },
    { de: '-heit / -keit',       ru: 'суффикс fem. (свойство)', ipa: '[haɪ̯t / kaɪ̯t]',       article: '' },
    { de: '-nis',                ru: 'суффикс neut. (состояние)', ipa: '[nɪs]',              article: '' },
    { de: '-schaft',             ru: 'суффикс fem. (коллект./свойство)', ipa: '[ʃaft]',       article: '' },
    { de: 'rasant',              ru: 'стремительный',           ipa: '[ʁaˈzant]',             article: '' },
    { de: 'einzigartig',         ru: 'уникальный',              ipa: '[ˈaɪ̯ntsɪçˌʔaːɐ̯tɪç]',  article: '' }
  ],

  grammar: [
    {
      title: '⚡ Способы номинализации',
      body: '1. <strong>Глагол → существительное на -ung</strong> (die, всегда!):<br>' +
            '<em>entwickeln → die Entwickl<strong>ung</strong></em><br>' +
            '<em>lösen → die Lös<strong>ung</strong></em><br><br>' +
            '2. <strong>Субстантивированный инфинитив</strong> (das, всегда!):<br>' +
            '<em>lesen → <strong>das Lesen</strong></em> · <em>schreiben → <strong>das Schreiben</strong></em><br><br>' +
            '3. <strong>Прилагательное + -heit/-keit/-schaft</strong> (die, всегда!):<br>' +
            '<em>schön → die Schön<strong>heit</strong></em><br>' +
            '<em>möglich → die Möglich<strong>keit</strong></em><br>' +
            '<em>bereit → die Bereit<strong>schaft</strong></em>',
      conjugation: [
        { pronoun: 'Verb → -ung',      form: 'entscheiden → Entscheidung', audio: 'Entscheidung',  translation: 'die (всегда)' },
        { pronoun: 'Inf. → das Verb.',  form: 'lesen → das Lesen',         audio: 'das Lesen',     translation: 'das (всегда)' },
        { pronoun: 'Adj. → -heit',     form: 'frei → Freiheit',           audio: 'Freiheit',      translation: 'die' },
        { pronoun: 'Adj. → -keit',     form: 'möglich → Möglichkeit',     audio: 'Möglichkeit',   translation: 'die' },
        { pronoun: 'Adj. → -schaft',   form: 'bereit → Bereitschaft',     audio: 'Bereitschaft',  translation: 'die' },
        { pronoun: 'Verb → -nis',      form: 'verstehen → Verständnis',   audio: 'Verständnis',   translation: 'das (обычно)' }
      ]
    },
    {
      title: '💡 Зачем нужна номинализация?',
      body: 'В официальном и научном немецком существительные встречаются чаще, чем глаголы:<br><br>' +
            'Разговорный: <em>Wir <strong>entscheiden</strong>, wie wir das machen.</em><br>' +
            'Официальный: <em><strong>Die Entscheidung</strong>, wie das gemacht wird, wurde getroffen.</em><br><br>' +
            'Номинализация позволяет:<br>' +
            '• использовать Genitivattribut: <em>die Lösung <strong>des Problems</strong></em><br>' +
            '• строить пассивные конструкции: <em>die Entscheidung <strong>wurde getroffen</strong></em><br>' +
            '• сжимать информацию без придаточного предложения'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Die',            blank: 'Entscheidung',   after: 'wurde getroffen.',      translation: '— Решение было принято.',             hintWord: 'Entscheidung',  hintRule: 'entscheiden → die Entscheidung (-ung)' },
      { before: '— Das',            blank: 'Lesen',          after: 'fördert das Denken.',   translation: '— Чтение развивает мышление.',        hintWord: 'Lesen',         hintRule: 'субстантивированный инфинитив = das' },
      { before: '— Die',            blank: 'Schönheit',      after: 'der Natur ist toll.',   translation: '— Красота природы прекрасна.',        hintWord: 'Schönheit',     hintRule: 'schön → die Schönheit (-heit)' },
      { before: '— Die',            blank: 'Möglichkeit',    after: 'zu reisen begeistert.', translation: '— Возможность путешествовать восхищает.', hintWord: 'Möglichkeit', hintRule: 'möglich → die Möglichkeit (-keit)' },
      { before: '— Die',            blank: 'Bereitschaft',   after: 'zur Arbeit ist gefragt.', translation: '— Готовность к работе востребована.', hintWord: 'Bereitschaft', hintRule: 'bereit → die Bereitschaft (-schaft)' },
      { before: '— Das',            blank: 'Ergebnis',       after: 'ist positiv.',          translation: '— Результат положительный.',          hintWord: 'Ergebnis',      hintRule: 'ergeben → das Ergebnis (-nis)' },
      { before: '— Die',            blank: 'Entwicklung',    after: 'ist rasant.',           translation: '— Развитие стремительное.',           hintWord: 'Entwicklung',   hintRule: 'entwickeln → die Entwicklung (-ung)' },
      { before: '— Das',            blank: 'Verständnis',    after: 'ist wichtig.',          translation: '— Понимание важно.',                  hintWord: 'Verständnis',   hintRule: 'verstehen → das Verständnis (-nis)' }
    ],

    multipleChoice: [
      { question: 'Субстантивированный инфинитив всегда…',              options: ['der', 'die', 'das', 'зависит от глагола'],         correctIndex: 2 },
      { question: 'Существительные на -ung всегда…',                     options: ['der', 'die', 'das', 'зависит'],                   correctIndex: 1 },
      { question: '«lösen» → номинализация?',                            options: ['der Löser', 'die Lösung', 'das Lösen', 'der Lös'], correctIndex: 1 },
      { question: '«schön» → прилагательное → существительное?',         options: ['die Schönheit', 'das Schöne', 'der Schön', 'die Schönkeit'], correctIndex: 0 },
      { question: 'Суффикс -keit дают…',                                 options: ['существительные', 'прилагательные', 'глаголы', 'наречия'], correctIndex: 1 },
      { question: 'Nominalstil характерен для…',                          options: ['разговорной речи', 'официального/научного стиля', 'рекламы', 'диалогов'], correctIndex: 1 },
      { question: '«möglich» → существительное?',                         options: ['die Möglichkeit', 'die Möglichheit', 'das Mögliche', 'der Möglich'], correctIndex: 0 },
      { question: '«das Scheitern» — это…',                               options: ['причастие', 'субстантивированный инфинитив', 'существительное с -ung', 'прилагательное'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: '-ung',         ru: 'die (от глагола)' },
      { id: 2, de: '-heit',        ru: 'die (от прилаг. на согл.)' },
      { id: 3, de: '-keit',        ru: 'die (от прилаг. на -ig/-lich)' },
      { id: 4, de: '-schaft',      ru: 'die (коллект./свойство)' },
      { id: 5, de: 'das Lesen',    ru: 'субстантивированный инфинитив' },
      { id: 6, de: 'Entscheidung', ru: 'решение (entscheiden)' },
      { id: 7, de: 'Freiheit',     ru: 'свобода (frei)' },
      { id: 8, de: 'Möglichkeit',  ru: 'возможность (möglich)' }
    ],

    dictation: [
      { word: 'Nominalisierung', audio: 'Nominalisierung' },
      { word: 'Entscheidung',    audio: 'Entscheidung' },
      { word: 'Entwicklung',     audio: 'Entwicklung' },
      { word: 'Schönheit',       audio: 'Schönheit' },
      { word: 'Möglichkeit',     audio: 'Möglichkeit' },
      { word: 'Bereitschaft',    audio: 'Bereitschaft' },
      { word: 'Verständnis',     audio: 'Verständnis' },
      { word: 'Ergebnis',        audio: 'Ergebnis' }
    ]
  }
};
