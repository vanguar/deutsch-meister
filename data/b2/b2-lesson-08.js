/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-08.js
   B2 · Урок 8: Komplexe Texte — Сложные тексты и их анализ
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-08',
  level:    'B2',
  unit:     8,
  title:    'Komplexe Texte',
  subtitle: 'Сложные тексты · Анализ и стилистика',

  meta: {
    duration:  '50–55 мин',
    wordCount: 26,
    xpReward:  200
  },

  phrases: [
    { de: 'Den Text zusammenfassen',            ru: 'Резюмировать текст',                    note: 'zusammenfassen — обобщать, отделяемая приставка zusammen-', audio: 'Den Text zusammenfassen' },
    { de: 'Den roten Faden verfolgen',           ru: 'Следить за основной нитью',             note: 'der rote Faden — «красная нить», сквозная идея текста', audio: 'Den roten Faden verfolgen' },
    { de: 'Implizite Aussagen erschließen',      ru: 'Извлекать скрытый смысл',               note: 'implizit — скрытый; erschließen — выводить из контекста', audio: 'Implizite Aussagen erschließen' },
    { de: 'Die Hauptthese identifizieren',       ru: 'Определить главный тезис',              note: 'die These — тезис, главное утверждение', audio: 'Die Hauptthese identifizieren' },
    { de: 'Zwischen den Zeilen lesen',           ru: 'Читать между строк',                    note: 'die Zeile — строка; устойчивое выражение', audio: 'Zwischen den Zeilen lesen' },
    { de: 'Den Kontext berücksichtigen',         ru: 'Учитывать контекст',                    note: 'berücksichtigen — принимать во внимание', audio: 'Den Kontext berücksichtigen' },
    { de: 'Ein Argument entkräften',             ru: 'Опровергнуть аргумент',                 note: 'entkräften — букв. «лишить силы»', audio: 'Ein Argument entkräften' },
    { de: 'Die Schlussfolgerung ziehen',         ru: 'Сделать вывод',                         note: 'eine Schlussfolgerung ziehen — устойчивое сочетание', audio: 'Die Schlussfolgerung ziehen' },
    { de: 'Die Struktur analysieren',            ru: 'Анализировать структуру',               note: 'Einleitung → Hauptteil → Schluss', audio: 'Die Struktur analysieren' },
    { de: 'Den Autor zitieren',                  ru: 'Цитировать автора',                     note: 'zitieren + Akk. — цитировать кого-либо', audio: 'Den Autor zitieren' },
    { de: 'Auf einen Einwand eingehen',          ru: 'Ответить на возражение',                note: 'eingehen auf + Akk. — обращаться к, реагировать на', audio: 'Auf einen Einwand eingehen' },
    { de: 'Die Kernaussage herausarbeiten',      ru: 'Выделить ключевое положение',           note: 'der Kern — ядро, суть; herausarbeiten — выделять', audio: 'Die Kernaussage herausarbeiten' },
    { de: 'Eine kritische Haltung einnehmen',    ru: 'Занять критическую позицию',            note: 'eine Haltung einnehmen — занять позицию', audio: 'Eine kritische Haltung einnehmen' },
    { de: 'Widersprüche aufzeigen',              ru: 'Указать на противоречия',               note: 'der Widerspruch — противоречие', audio: 'Widersprüche aufzeigen' },
    { de: 'Den Standpunkt vertreten',            ru: 'Отстаивать точку зрения',               note: 'vertreten — представлять, отстаивать', audio: 'Den Standpunkt vertreten' },
    { de: 'Textbelege anführen',                 ru: 'Приводить доказательства из текста',    note: 'der Beleg — доказательство; anführen — приводить', audio: 'Textbelege anführen' },
    { de: 'Das Fazit formulieren',               ru: 'Сформулировать заключение',             note: 'das Fazit — итог, вывод', audio: 'Das Fazit formulieren' },
    { de: 'Eine Hypothese aufstellen',           ru: 'Выдвинуть гипотезу',                    note: 'aufstellen — выдвигать (тезис, гипотезу)', audio: 'Eine Hypothese aufstellen' },
    { de: 'Die Relevanz begründen',              ru: 'Обосновать значимость',                 note: 'begründen — обосновывать', audio: 'Die Relevanz begründen' },
    { de: 'Querverweise herstellen',             ru: 'Устанавливать перекрёстные ссылки',     note: 'der Querverweis — перекрёстная ссылка', audio: 'Querverweise herstellen' },
    { de: 'Den Textzusammenhang verstehen',      ru: 'Понять связность текста',               note: 'der Zusammenhang — связь, взаимосвязь', audio: 'Den Textzusammenhang verstehen' },
    { de: 'Subtile Nuancen erkennen',            ru: 'Распознавать тонкие нюансы',            note: 'subtil — тонкий, едва уловимый', audio: 'Subtile Nuancen erkennen' },
    { de: 'Eine Synthese erstellen',             ru: 'Создать синтез (обобщение)',            note: 'die Synthese — объединение идей из разных источников', audio: 'Eine Synthese erstellen' },
    { de: 'Stilmittel erkennen',                 ru: 'Распознавать стилистические средства',  note: 'das Stilmittel — стилистический приём', audio: 'Stilmittel erkennen' }
  ],

  vocabulary: [
    { de: 'der Subtext',          ru: 'подтекст',                       ipa: '[ˈzʊpˌtɛkst]',            article: 'der' },
    { de: 'die Kohärenz',         ru: 'смысловая связность',            ipa: '[kohɛˈʁɛnts]',            article: 'die' },
    { de: 'die Kohäsion',         ru: 'связность (языковая)',           ipa: '[kohɛˈzi̯oːn]',           article: 'die' },
    { de: 'die Konnotation',      ru: 'коннотация, оттенок значения',   ipa: '[kɔnotaˈtsi̯oːn]',        article: 'die' },
    { de: 'die Ambiguität',       ru: 'двусмысленность',                ipa: '[ambiɡuiˈtɛːt]',          article: 'die' },
    { de: 'der Diskurs',          ru: 'дискурс, обсуждение',            ipa: '[dɪsˈkʊʁs]',              article: 'der' },
    { de: 'die Rhetorik',         ru: 'риторика',                       ipa: '[ʁeˈtoːʁɪk]',             article: 'die' },
    { de: 'die Metapher',         ru: 'метафора',                       ipa: '[meˈtaːfɐ]',              article: 'die' },
    { de: 'die Ironie',           ru: 'ирония',                         ipa: '[iʁoˈniː]',               article: 'die' },
    { de: 'das Stilmittel',       ru: 'стилистическое средство',        ipa: '[ˈʃtiːlˌmɪtl̩]',          article: 'das' },
    { de: 'die Anapher',          ru: 'анафора (повтор в начале)',      ipa: '[aˈnaːfɐ]',               article: 'die' },
    { de: 'die Antithese',        ru: 'антитеза, противопоставление',   ipa: '[antiˈteːzə]',            article: 'die' },
    { de: 'der Euphemismus',      ru: 'эвфемизм, смягчение',            ipa: '[ɔɪ̯feˈmɪsmʊs]',          article: 'der' },
    { de: 'die Intertextualität', ru: 'интертекстуальность',            ipa: '[ɪntɐtɛkstualiˈtɛːt]',    article: 'die' },
    { de: 'explizit',             ru: 'явный, эксплицитный',            ipa: '[ɛkspliˈtsiːt]',          article: '' },
    { de: 'implizit',             ru: 'скрытый, имплицитный',           ipa: '[ɪmpliˈtsiːt]',           article: '' },
    { de: 'komplex',              ru: 'сложный',                        ipa: '[kɔmˈplɛks]',             article: '' },
    { de: 'redundant',            ru: 'избыточный, повторяющийся',      ipa: '[ʁedʊnˈdant]',            article: '' },
    { de: 'prägnant',             ru: 'ёмкий, лаконичный',              ipa: '[pʁɛˈɡnant]',             article: '' },
    { de: 'subtil',               ru: 'тонкий, едва уловимый',          ipa: '[zʊpˈtiːl]',              article: '' },
    { de: 'stringent',            ru: 'последовательный, строгий',      ipa: '[ʃtʁɪŋˈɡɛnt]',            article: '' },
    { de: 'erschließen',          ru: 'извлекать (смысл)',              ipa: '[ɛɐ̯ˈʃliːsn̩]',           article: '' },
    { de: 'paraphrasieren',       ru: 'перефразировать',                ipa: '[paʁafʁaˈziːʁən]',        article: '' },
    { de: 'dekonstruieren',       ru: 'деконструировать',               ipa: '[dekɔnstʁuˈiːʁən]',       article: '' },
    { de: 'verweisen auf',        ru: 'отсылать, ссылаться на',         ipa: '[fɛɐ̯ˈvaɪ̯zn̩]',          article: '' },
    { de: 'überzeugend',          ru: 'убедительный',                   ipa: '[ˌyːbɐˈtsɔɪ̯ɡn̩t]',       article: '' }
  ],

  grammar: [
    {
      title: '⚡ Структура текста: тезис → аргумент → вывод',
      body: 'Сложные тексты имеют чёткую структуру: <strong>Einleitung</strong> (введение) → <strong>Hauptteil</strong> (основная часть) → <strong>Schluss</strong> (заключение).<br><br>' +
            '<strong>Kohäsion</strong> — связность на уровне языковых средств (местоимения, коннекторы).<br>' +
            '<strong>Kohärenz</strong> — смысловая связность, логика содержания.<br><br>' +
            'Типичные шаги аргументации и фразы к ним — в таблице ниже:',
      conjugation: [
        { pronoun: 'These (тезис)',             form: 'Der Autor vertritt die These, dass…',        audio: 'Der Autor vertritt die These, dass', translation: 'Автор отстаивает тезис, что…' },
        { pronoun: 'Argument (аргумент)',       form: 'Als Beleg dafür führt er an, dass…',         audio: 'Als Beleg dafür führt er an, dass',  translation: 'В доказательство он приводит, что…' },
        { pronoun: 'Gegenargument (контраргумент)', form: 'Zwar könnte man einwenden, dass…',       audio: 'Zwar könnte man einwenden, dass',    translation: 'Правда, можно возразить, что…' },
        { pronoun: 'Widerlegung (опровержение)', form: 'Jedoch zeigt sich, dass…',                  audio: 'Jedoch zeigt sich, dass',            translation: 'Однако оказывается, что…' },
        { pronoun: 'Fazit (вывод)',             form: 'Zusammenfassend lässt sich sagen, dass…',    audio: 'Zusammenfassend lässt sich sagen, dass', translation: 'Подводя итог, можно сказать, что…' }
      ]
    },
    {
      title: '💡 Стилистические средства (Stilmittel)',
      body: 'Важнейшие риторические и стилистические приёмы уровня B2. Умение узнавать их позволяет понимать текст на более глубоком уровне:<br><br>' +
            '<strong>Metapher</strong> — метафора, перенос значения<br>' +
            '<strong>Ironie</strong> — ирония, противоположное сказанному<br>' +
            '<strong>Anapher</strong> — анафора, повтор в начале предложений<br>' +
            '<strong>Antithese</strong> — антитеза, противопоставление<br>' +
            '<strong>Euphemismus</strong> — эвфемизм, смягчённое выражение',
      conjugation: [
        { pronoun: 'Metapher',    form: 'Das Leben ist ein Fluss.',                    audio: 'Das Leben ist ein Fluss',                       translation: 'Жизнь — это река. (перенос значения)' },
        { pronoun: 'Ironie',      form: '„Toll gemacht!“ (nach einem Fehler)',         audio: 'Toll gemacht',                                  translation: '«Отлично сделано!» после ошибки (обратный смысл)' },
        { pronoun: 'Anapher',     form: 'Ich will Frieden. Ich will Gerechtigkeit.',   audio: 'Ich will Frieden. Ich will Gerechtigkeit',      translation: 'Я хочу мира. Я хочу справедливости. (повтор в начале)' },
        { pronoun: 'Antithese',   form: 'Gut und Böse, Licht und Schatten',            audio: 'Gut und Böse, Licht und Schatten',              translation: 'Добро и зло, свет и тень (противопоставление)' },
        { pronoun: 'Euphemismus', form: '„entschlafen“ statt „sterben“',               audio: 'entschlafen statt sterben',                     translation: '«почить» вместо «умереть» (смягчение)' }
      ]
    },
    {
      title: '⚡ Konjunktiv I — косвенная речь в академическом тексте',
      body: 'В научных и журналистских текстах <strong>Konjunktiv I</strong> маркирует косвенную речь — автор передаёт чужие слова, не оценивая их:<br><br>' +
            '<em>Der Forscher sagte, die Studie <strong>sei</strong> abgeschlossen.</em> — Исследователь сказал, что исследование завершено.<br><br>' +
            'Если форма Konjunktiv I совпадает с индикативом (например, <em>sie haben</em>), используют <strong>Konjunktiv II</strong> (<em>hätten</em>) или <strong>würde</strong>-форму. Формы для er/sie/es — самые употребительные:',
      conjugation: [
        { pronoun: 'er/sie/es (haben)',  form: 'habe',   audio: 'er habe',    translation: 'что он имеет (Konjunktiv I)' },
        { pronoun: 'er/sie/es (sein)',   form: 'sei',    audio: 'er sei',     translation: 'что он есть (Konjunktiv I)' },
        { pronoun: 'er/sie/es (wissen)', form: 'wisse',  audio: 'er wisse',   translation: 'что он знает (Konjunktiv I)' },
        { pronoun: 'er/sie/es (können)', form: 'könne',  audio: 'er könne',   translation: 'что он может (Konjunktiv I)' },
        { pronoun: 'sie/Sie Pl. (sein)', form: 'seien',  audio: 'sie seien',  translation: 'что они есть (Konjunktiv I)' },
        { pronoun: 'sie Pl. (haben)',    form: 'hätten', audio: 'sie hätten', translation: 'что они имеют (замена: Konjunktiv II)' }
      ]
    },
    {
      title: '💡 Сложные синтаксические конструкции',
      body: 'B2-тексты используют сложные конструкции: расширенные причастные определения, цепочки генитивов, двойной инфинитив, многоступенчатые придаточные (Hypotaxe).<br><br>' +
            '<strong>Ключ к пониманию:</strong> найти сказуемые, затем восстановить границы предложений.<br><br>' +
            '<strong>Erweitertes Partizip:</strong> <em>das lange diskutierte Thema</em> = <em>das Thema, das lange diskutiert wurde</em> (тема, которую долго обсуждали)<br>' +
            '<strong>Genitivkette:</strong> <em>die Lösung des Problems der Stadt</em> — решение проблемы города<br>' +
            '<strong>Doppelter Infinitiv:</strong> <em>Er hat kommen wollen.</em> = <em>Er wollte kommen.</em> (он хотел прийти)',
      conjugation: [
        { pronoun: 'Партицип-определение', form: 'das lange diskutierte Thema',              audio: 'das lange diskutierte Thema',              translation: 'долго обсуждавшаяся тема' },
        { pronoun: 'Цепочка генитивов',    form: 'die Lösung des Problems der Stadt',        audio: 'die Lösung des Problems der Stadt',        translation: 'решение проблемы города' },
        { pronoun: 'Двойной инфинитив',    form: 'Er hat kommen wollen.',                    audio: 'Er hat kommen wollen',                     translation: 'Он хотел прийти.' },
        { pronoun: 'Hypotaxe (3 уровня)',  form: 'Er sagte, dass er glaube, dass es wahr sei.', audio: 'Er sagte, dass er glaube, dass es wahr sei', translation: 'Он сказал, что верит, что это правда.' }
      ]
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Der Autor',                                blank: 'stellt',        after: 'eine interessante These auf.',  translation: '— Автор выдвигает интересный тезис.',                 hintWord: 'stellt',        hintRule: 'eine These aufstellen — выдвигать тезис (отделяемая приставка auf)' },
      { before: '— Um den Text zu verstehen, muss man den',   blank: 'Kontext',       after: 'berücksichtigen.',              translation: '— Чтобы понять текст, нужно учитывать контекст.',     hintWord: 'Kontext',       hintRule: 'der Kontext — контекст' },
      { before: '— Die Ironie ist ein wichtiges',             blank: 'Stilmittel',    after: '.',                             translation: '— Ирония — важное стилистическое средство.',          hintWord: 'Stilmittel',    hintRule: 'das Stilmittel — стилистическое средство' },
      { before: '— Der Satz ist sehr prägnant',               blank: 'formuliert',    after: '.',                             translation: '— Предложение сформулировано очень ёмко.',            hintWord: 'formuliert',    hintRule: 'formulieren → Partizip II: formuliert' },
      { before: '— Er',                                       blank: 'verweist',      after: 'auf frühere Studien.',          translation: '— Он ссылается на более ранние исследования.',        hintWord: 'verweist',      hintRule: 'verweisen auf + Akk. — ссылаться на' },
      { before: '— Die Argumentation ist stringent und',      blank: 'überzeugend',   after: '.',                             translation: '— Аргументация последовательна и убедительна.',       hintWord: 'überzeugend',   hintRule: 'überzeugend — убедительный' },
      { before: '— Man muss die',                             blank: 'Struktur',      after: 'des Textes analysieren.',       translation: '— Нужно анализировать структуру текста.',             hintWord: 'Struktur',      hintRule: 'die Struktur — структура' },
      { before: '— Das Wort hat negative',                    blank: 'Konnotationen', after: '.',                             translation: '— У этого слова негативные коннотации.',              hintWord: 'Konnotationen', hintRule: 'die Konnotation, -en — оттенок значения' }
    ],

    multipleChoice: [
      { question: '«Implizit» значит…',                                            options: ['явно высказанный', 'скрытый, не сказанный напрямую', 'очень длинный', 'противоречивый'],          correctIndex: 1 },
      { question: 'Какое стилистическое средство — повтор в начале предложений?',  options: ['Metapher', 'Ironie', 'Anapher', 'Antithese'],                                                      correctIndex: 2 },
      { question: 'Для чего в академическом тексте используется Konjunktiv I?',    options: ['Для нереального условия', 'Для косвенной речи', 'Для приказов', 'Для будущего времени'],          correctIndex: 1 },
      { question: '«Kohärenz» текста — это…',                                      options: ['длина текста', 'количество аргументов', 'смысловая связность', 'оформление шрифта'],              correctIndex: 2 },
      { question: '«Paraphrasieren» значит…',                                      options: ['цитировать дословно', 'передать своими словами', 'критиковать', 'переводить'],                    correctIndex: 1 },
      { question: 'Что такое Euphemismus (эвфемизм)?',                             options: ['прямая критика', 'смягчённое выражение', 'иностранное слово', 'научный термин'],                  correctIndex: 1 },
      { question: '«Redundant» значит…',                                           options: ['очень важный', 'избыточный, лишний', 'краткий и ёмкий', 'научный'],                               correctIndex: 1 },
      { question: '«These» в аргументативном тексте — это…',                       options: ['пример', 'заключение', 'главное утверждение', 'возражение'],                                      correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'der Subtext',           ru: 'скрытый смысл, подтекст' },
      { id: 2, de: 'die Intertextualität',  ru: 'отсылки к другим текстам' },
      { id: 3, de: 'der Diskurs',           ru: 'общественная дискуссия' },
      { id: 4, de: 'die Ambiguität',        ru: 'двусмысленность' },
      { id: 5, de: 'die Konnotation',       ru: 'оттенок значения слова' },
      { id: 6, de: 'stringent',             ru: 'логически последовательный' },
      { id: 7, de: 'erschließen',           ru: 'извлекать (смысл)' },
      { id: 8, de: 'das Fazit',             ru: 'вывод, заключение' }
    ],

    dictation: [
      { word: 'These',        audio: 'These' },
      { word: 'Stilmittel',   audio: 'Stilmittel' },
      { word: 'Metapher',     audio: 'Metapher' },
      { word: 'prägnant',     audio: 'prägnant' },
      { word: 'Kontext',      audio: 'Kontext' },
      { word: 'Struktur',     audio: 'Struktur' },
      { word: 'überzeugend',  audio: 'überzeugend' },
      { word: 'Konnotation',  audio: 'Konnotation' }
    ]
  }
};
