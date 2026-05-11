/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-05.js
   B2 · Урок 5: Wissenschaftlicher Stil — Научный стиль
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-05',
  level:    'B2',
  unit:     5,
  title:    'Wissenschaftlicher Stil',
  subtitle: 'Научный стиль · Passiv, Nominalisierung, Fachsprache',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Die Studie zeigt, dass…',                         ru: 'Исследование показывает, что…',             note: 'die Studie — исследование', audio: 'Die Studie zeigt, dass' },
    { de: 'Es wurde festgestellt, dass…',                    ru: 'Было установлено, что…',                   note: 'feststellen Passiv — безличный стиль', audio: 'Es wurde festgestellt, dass' },
    { de: 'Die Ergebnisse legen nahe, dass…',                ru: 'Результаты свидетельствуют о том, что…',   note: 'nahelegen — давать основания полагать', audio: 'Die Ergebnisse legen nahe, dass' },
    { de: 'Unter Berücksichtigung der Daten…',               ru: 'С учётом данных…',                         note: 'Präpositionalgruppe — научный стиль', audio: 'Unter Berücksichtigung der Daten' },
    { de: 'Die Hypothese wurde bestätigt.',                   ru: 'Гипотеза была подтверждена.',               note: 'bestätigen → Passiv Präteritum', audio: 'Die Hypothese wurde bestätigt' },
    { de: 'Im Rahmen dieser Untersuchung…',                  ru: 'В рамках данного исследования…',            note: 'im Rahmen + Gen. — в рамках чего-то', audio: 'Im Rahmen dieser Untersuchung' },
    { de: 'Es ist davon auszugehen, dass…',                  ru: 'Следует исходить из того, что…',           note: 'auszugehen von — исходить из', audio: 'Es ist davon auszugehen, dass' },
    { de: 'Die Forschung basiert auf aktuellen Daten.',      ru: 'Исследование основано на актуальных данных.', note: 'basieren auf + Dativ — основываться на', audio: 'Die Forschung basiert auf aktuellen Daten' },
    { de: 'Wie aus Abbildung 1 ersichtlich ist,…',           ru: 'Как видно из рисунка 1,…',                 note: 'ersichtlich — очевидный, видный', audio: 'Wie aus Abbildung 1 ersichtlich ist' },
    { de: 'Im Vergleich zu früheren Studien…',               ru: 'По сравнению с более ранними исследованиями…', note: 'im Vergleich zu + Dat.', audio: 'Im Vergleich zu früheren Studien' },
    { de: 'Zusammenfassend lässt sich sagen, dass…',         ru: 'В заключение можно констатировать, что…',  note: 'sich sagen lassen — безличная конструкция', audio: 'Zusammenfassend lässt sich sagen, dass' },
    { de: 'Die vorliegende Arbeit untersucht…',             ru: 'Данная работа исследует…',                  note: 'vorliegend — имеющийся, данный', audio: 'Die vorliegende Arbeit untersucht' },
    { de: 'Es handelt sich um ein komplexes Phänomen.',      ru: 'Речь идёт о сложном феномене.',            note: 'es handelt sich um — речь идёт о', audio: 'Es handelt sich um ein komplexes Phänomen' },
    { de: 'Ziel der Untersuchung ist es, zu ermitteln,…',   ru: 'Цель исследования — установить,…',          note: 'das Ziel ist es + zu Infinitiv', audio: 'Ziel der Untersuchung ist es zu ermitteln' },
    { de: 'Die Auswertung der Daten ergab folgendes Bild.', ru: 'Обработка данных дала следующую картину.',  note: 'die Auswertung — обработка, анализ', audio: 'Die Auswertung der Daten ergab folgendes Bild' },
    { de: 'In Bezug auf die Fragestellung…',                ru: 'Относительно постановки вопроса…',          note: 'in Bezug auf + Akk. — относительно', audio: 'In Bezug auf die Fragestellung' },
    { de: 'Die Methodik wurde sorgfältig ausgewählt.',      ru: 'Методология была тщательно отобрана.',      note: 'sorgfältig — тщательный, тщательно', audio: 'Die Methodik wurde sorgfältig ausgewählt' },
    { de: 'Unter diesem Aspekt betrachtet…',               ru: 'С точки зрения этого аспекта…',             note: 'unter diesem Aspekt betrachtet — с этой точки зрения', audio: 'Unter diesem Aspekt betrachtet' },
    { de: 'Die Befunde deuten auf eine Korrelation hin.',  ru: 'Результаты указывают на корреляцию.',        note: 'hindeuten auf + Akk. — указывать на', audio: 'Die Befunde deuten auf eine Korrelation hin' },
    { de: 'Es sei darauf hingewiesen, dass…',              ru: 'Следует обратить внимание, что…',            note: 'Konjunktiv I: es sei hingewiesen', audio: 'Es sei darauf hingewiesen, dass' },
    { de: 'Im Folgenden wird erläutert,…',                 ru: 'Ниже поясняется,…',                         note: 'im Folgenden — ниже, в дальнейшем', audio: 'Im Folgenden wird erläutert' },
    { de: 'Die Schlussfolgerung lautet:',                  ru: 'Вывод таков:',                              note: 'die Schlussfolgerung — вывод, заключение', audio: 'Die Schlussfolgerung lautet' },
    { de: 'Weitere Forschung ist in diesem Bereich nötig.', ru: 'В данной области необходимы дальнейшие исследования.', note: 'weitere Forschung — дальнейшие исследования', audio: 'Weitere Forschung ist in diesem Bereich nötig' },
    { de: 'Das Ergebnis ist statistisch signifikant.',     ru: 'Результат статистически значим.',            note: 'signifikant — значимый', audio: 'Das Ergebnis ist statistisch signifikant' }
  ],

  vocabulary: [
    { de: 'die Studie',         ru: 'исследование, изучение',   ipa: '[ˈʃtuːdiə]',         article: 'die' },
    { de: 'die Forschung',      ru: 'научные исследования',     ipa: '[ˈfɔʁʃʊŋ]',          article: 'die' },
    { de: 'die Hypothese',      ru: 'гипотеза',                 ipa: '[hypoˈteːzə]',        article: 'die' },
    { de: 'die Methodik',       ru: 'методология',              ipa: '[metoˈdiːk]',          article: 'die' },
    { de: 'die Auswertung',     ru: 'обработка, анализ',        ipa: '[ˈaʊ̯svɛʁtʊŋ]',       article: 'die' },
    { de: 'die Schlussfolgerung', ru: 'вывод, заключение',      ipa: '[ˈʃlʊsfɔlɡərʊŋ]',    article: 'die' },
    { de: 'der Befund',         ru: 'результат, данные',        ipa: '[bəˈfʊnt]',           article: 'der' },
    { de: 'das Phänomen',       ru: 'феномен, явление',         ipa: '[fɛnoˈmeːn]',         article: 'das' },
    { de: 'die Korrelation',    ru: 'корреляция',               ipa: '[kɔʁelaˈtsi̯oːn]',    article: 'die' },
    { de: 'feststellen',        ru: 'устанавливать, выявлять',  ipa: '[ˈfɛstˌʃtɛlən]',     article: '' },
    { de: 'basieren auf',       ru: 'основываться на',          ipa: '[baˈziːʁən aʊ̯f]',    article: '' },
    { de: 'nahelegen',          ru: 'давать основания полагать', ipa: '[ˈnaːəˌleːɡn̩]',     article: '' },
    { de: 'ermitteln',          ru: 'устанавливать, выяснять',  ipa: '[ɛʁˈmɪtl̩n]',         article: '' },
    { de: 'hindeuten auf',      ru: 'указывать на',             ipa: '[ˈhɪndɔɪ̯tn̩ aʊ̯f]',   article: '' },
    { de: 'erläutern',          ru: 'разъяснять, пояснять',     ipa: '[ɛʁˈlɔɪ̯tɐn]',        article: '' },
    { de: 'vorliegend',         ru: 'данный, имеющийся',        ipa: '[ˈfoːɐ̯ˌliːɡn̩t]',     article: '' },
    { de: 'sorgfältig',         ru: 'тщательный',               ipa: '[ˈzɔʁkfɛltɪç]',      article: '' },
    { de: 'signifikant',        ru: 'значимый',                 ipa: '[zɪɡnɪˈfikant]',      article: '' },
    { de: 'ersichtlich',        ru: 'очевидный, видимый',       ipa: '[ɛʁˈzɪçtlɪç]',       article: '' },
    { de: 'im Rahmen',          ru: 'в рамках',                 ipa: '[ɪm ˈʁaːmən]',        article: '' },
    { de: 'in Bezug auf',       ru: 'относительно, в отношении', ipa: '[ɪn bəˈtsuːk aʊ̯f]', article: '' },
    { de: 'im Folgenden',       ru: 'ниже, в дальнейшем',       ipa: '[ɪm ˈfɔlɡndən]',      article: '' },
    { de: 'die Abbildung',      ru: 'рисунок, схема',           ipa: '[ˈapˌbɪldʊŋ]',        article: '' },
    { de: 'statistisch',        ru: 'статистический',           ipa: '[ʃtaˈtɪstɪʃ]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ Особенности научного стиля (Nominalstil)',
      body: 'Для научных текстов характерны:<br><br>' +
            '1. <strong>Nominalstil</strong> — вместо глаголов — существительные:<br>' +
            '<em>Man analysiert → die <strong>Analyse</strong> der Daten</em><br><br>' +
            '2. <strong>Passiv</strong> — безличность:<br>' +
            '<em>Es <strong>wurde festgestellt</strong>, dass…</em><br><br>' +
            '3. <strong>Konjunktiv I</strong> — косвенная речь:<br>' +
            '<em>Die Studie berichtet, die Daten <strong>seien</strong> valide.</em><br><br>' +
            '4. <strong>Genitivattribut</strong>:<br>' +
            '<em>Im Rahmen <strong>dieser Untersuchung</strong>…</em><br><br>' +
            '5. Длинные <strong>причастные обороты</strong> вместо Relativsatz.',
      conjugation: [
        { pronoun: 'Aktiv (разговор.)',  form: 'Man analysiert die Daten',        audio: 'Man analysiert die Daten',       translation: 'Анализируют данные' },
        { pronoun: 'Passiv (научный)',   form: 'Die Daten werden analysiert',      audio: 'Die Daten werden analysiert',    translation: 'Данные анализируются' },
        { pronoun: 'Nominal (научный)',  form: 'Die Analyse der Daten',           audio: 'Die Analyse der Daten',          translation: 'Анализ данных' },
        { pronoun: 'Verb (разговор.)',   form: 'Er stellt fest, dass…',           audio: 'Er stellt fest, dass',           translation: 'Он устанавливает, что…' },
        { pronoun: 'Passiv+Nom. (науч.)', form: 'Es wurde festgestellt, dass…',  audio: 'Es wurde festgestellt, dass',   translation: 'Было установлено, что…' },
        { pronoun: 'Konj. I (косв. речь)', form: 'Die Studie zeige, dass…',      audio: 'Die Studie zeige, dass',        translation: 'Исследование показывает (что)…' }
      ]
    },
    {
      title: '💡 Клише и фразы для академических текстов',
      body: '<strong>Начало:</strong><br>' +
            '<em>Die vorliegende Arbeit untersucht…</em><br>' +
            '<em>Im Rahmen dieser Studie wird…</em><br><br>' +
            '<strong>Представление данных:</strong><br>' +
            '<em>Die Ergebnisse legen nahe, dass…</em><br>' +
            '<em>Wie aus Abbildung 1 ersichtlich ist,…</em><br><br>' +
            '<strong>Выводы:</strong><br>' +
            '<em>Zusammenfassend lässt sich sagen…</em><br>' +
            '<em>Die Schlussfolgerung lautet:…</em><br><br>' +
            '<strong>Уклонение:</strong><br>' +
            '<em>Es sei darauf hingewiesen, dass…</em><br>' +
            '<em>Weitere Forschung ist nötig.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Die',             blank: 'Studie',         after: 'zeigt, dass…',              translation: '— Исследование показывает, что…',      hintWord: 'Studie',         hintRule: 'die Studie — исследование' },
      { before: '— Es wurde',        blank: 'festgestellt',   after: ', dass…',                   translation: '— Было установлено, что…',              hintWord: 'festgestellt',   hintRule: 'feststellen → festgestellt (Passiv Prät.)' },
      { before: '— Die',             blank: 'Hypothese',      after: 'wurde bestätigt.',           translation: '— Гипотеза была подтверждена.',         hintWord: 'Hypothese',      hintRule: 'die Hypothese — гипотеза' },
      { before: '— Im',             blank: 'Rahmen',          after: 'dieser Untersuchung…',       translation: '— В рамках данного исследования…',      hintWord: 'Rahmen',         hintRule: 'im Rahmen + Gen.' },
      { before: '— Die Befunde deuten auf eine Korrelation', blank: 'hin', after: '.', translation: '— Данные указывают на корреляцию.', hintWord: 'hin', hintRule: 'hindeuten auf + Akk.' },
      { before: '— Zusammenfassend lässt sich', blank: 'sagen', after: ', dass…',          translation: '— В заключение можно сказать, что…',   hintWord: 'sagen',          hintRule: 'sich sagen lassen — безличная конструкция' },
      { before: '— Das Ergebnis ist', blank: 'signifikant',  after: '.',                         translation: '— Результат значим.',                  hintWord: 'signifikant',    hintRule: 'signifikant — значимый' },
      { before: '— Die vorliegende Arbeit', blank: 'untersucht', after: ' das Phänomen.',       translation: '— Данная работа исследует феномен.',   hintWord: 'untersucht',     hintRule: 'untersuchen — исследовать' }
    ],

    multipleChoice: [
      { question: 'Что характерно для научного стиля?',                   options: ['Активный залог', 'Разговорная лексика', 'Пассив + Nominalstil', 'Модальные частицы'], correctIndex: 2 },
      { question: '«Es wurde festgestellt» — это…',                        options: ['Präsens Aktiv', 'Passiv Präteritum', 'Futur Passiv', 'Konj. II'],    correctIndex: 1 },
      { question: '«Die Ergebnisse legen nahe» значит…',                   options: ['удобно располагают', 'свидетельствуют', 'лежат рядом', 'предлагают'], correctIndex: 1 },
      { question: '«Im Rahmen dieser Studie» = …',                         options: ['в рамках этого исследования', 'в этой рамке', 'после исследования', 'вне исследования'], correctIndex: 0 },
      { question: 'Konjunktiv I в науч. тексте используется для…',         options: ['нереального желания', 'косвенной речи', 'приказа', 'вежливости'],     correctIndex: 1 },
      { question: '«Es handelt sich um» значит…',                          options: ['дело в том', 'речь идёт о', 'он торгует', 'это касается'],            correctIndex: 1 },
      { question: 'Что такое «der Befund»?',                                options: ['ошибка', 'результат/данные', 'вопрос', 'метод'],                     correctIndex: 1 },
      { question: '«Sorgfältig» означает…',                                 options: ['тщательно', 'быстро', 'примерно', 'случайно'],                        correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'die Studie',       ru: 'исследование' },
      { id: 2, de: 'die Hypothese',    ru: 'гипотеза' },
      { id: 3, de: 'der Befund',       ru: 'результаты, данные' },
      { id: 4, de: 'die Methodik',     ru: 'методология' },
      { id: 5, de: 'feststellen',      ru: 'устанавливать' },
      { id: 6, de: 'nahelegen',        ru: 'свидетельствовать' },
      { id: 7, de: 'signifikant',      ru: 'значимый' },
      { id: 8, de: 'Schlussfolgerung', ru: 'вывод, заключение' }
    ],

    dictation: [
      { word: 'Studie',          audio: 'Studie' },
      { word: 'Hypothese',       audio: 'Hypothese' },
      { word: 'Schlussfolgerung', audio: 'Schlussfolgerung' },
      { word: 'feststellen',     audio: 'feststellen' },
      { word: 'signifikant',     audio: 'signifikant' },
      { word: 'Methodik',        audio: 'Methodik' },
      { word: 'Korrelation',     audio: 'Korrelation' },
      { word: 'Forschung',       audio: 'Forschung' }
    ]
  }
};
