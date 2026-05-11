const LESSON_DATA = {
  id: "b2-lesson-08",
  level: "B2",
  unit: 8,
  title: "Komplexe Texte",
  subtitle: "Сложные тексты",
  meta: { duration: "55 мин", wordCount: 26, xpReward: 200 },

  phrases: [
    { de: "Den Text zusammenfassen", ru: "Резюмировать текст" },
    { de: "Den roten Faden verfolgen", ru: "Следить за основной нитью" },
    { de: "Implizite Aussagen erschließen", ru: "Извлекать скрытый смысл" },
    { de: "Die Hauptthese identifizieren", ru: "Определить главный тезис" },
    { de: "Zwischen den Zeilen lesen", ru: "Читать между строк" },
    { de: "Den Kontext berücksichtigen", ru: "Учитывать контекст" },
    { de: "Ein Argument entkräften", ru: "Опровергнуть аргумент" },
    { de: "Die Schlussfolgerung ziehen", ru: "Сделать вывод" },
    { de: "Die Struktur analysieren", ru: "Анализировать структуру" },
    { de: "Den Autor zitieren", ru: "Цитировать автора" },
    { de: "Auf einen Einwand eingehen", ru: "Ответить на возражение" },
    { de: "Die Kernaussage herausarbeiten", ru: "Выделить ключевое положение" },
    { de: "Eine kritische Haltung einnehmen", ru: "Занять критическую позицию" },
    { de: "Widersprüche aufzeigen", ru: "Указать на противоречия" },
    { de: "Den Standpunkt vertreten", ru: "Отстаивать точку зрения" },
    { de: "Textbelege anführen", ru: "Приводить текстовые доказательства" },
    { de: "Das Fazit formulieren", ru: "Сформулировать заключение" },
    { de: "Eine Hypothese aufstellen", ru: "Выдвинуть гипотезу" },
    { de: "Die Relevanz begründen", ru: "Обосновать релевантность" },
    { de: "Querverweise herstellen", ru: "Устанавливать перекрёстные ссылки" },
    { de: "Den Textzusammenhang verstehen", ru: "Понять связность текста" },
    { de: "Subtile Nuancen erkennen", ru: "Распознавать тонкие нюансы" },
    { de: "Eine Synthese erstellen", ru: "Создавать синтез (обзор)" },
    { de: "Stilmittel erkennen", ru: "Распознавать стилистические средства" }
  ],

  vocabulary: [
    { de: "der Subtext, -e", ru: "подтекст", example: "Der Subtext enthüllt die wahre Botschaft." },
    { de: "die Kohärenz (nur Sg.)", ru: "когерентность, связность", example: "Die Kohärenz des Textes ist überzeugend." },
    { de: "die Konnotation, -en", ru: "коннотация", example: "Das Wort hat negative Konnotationen." },
    { de: "die Ambiguität, -en", ru: "двусмысленность", example: "Die Ambiguität erschwert das Verständnis." },
    { de: "der Diskurs, -e", ru: "дискурс", example: "Im öffentlichen Diskurs wird darüber gestritten." },
    { de: "die Rhetorik (nur Sg.)", ru: "риторика", example: "Er beherrschte die Rhetorik meisterhaft." },
    { de: "die Metapher, -n", ru: "метафора", example: "Das ist eine treffende Metapher." },
    { de: "die Ironie (nur Sg.)", ru: "ирония", example: "Er benutzte Ironie, um zu kritisieren." },
    { de: "das Stilmittel, -", ru: "стилистическое средство", example: "Anapher ist ein häufiges Stilmittel." },
    { de: "die Anapher, -n", ru: "анафора (повтор в начале)", example: "Die Anapher betont die Kernidee." },
    { de: "das Enjambement, -s", ru: "анжамбеман (перенос строки)", example: "Das Enjambement erzeugt einen Fließeffekt." },
    { de: "die Intertextualität (nur Sg.)", ru: "интертекстуальность", example: "Der Roman spielt mit Intertextualität." },
    { de: "explizit (Adj.)", ru: "явный, эксплицитный", example: "Der Autor macht seine Absicht explizit." },
    { de: "implizit (Adj.)", ru: "скрытый, имплицитный", example: "Die Kritik ist implizit formuliert." },
    { de: "linear (Adj.)", ru: "линейный", example: "Der Text folgt keiner linearen Struktur." },
    { de: "komplex (Adj.)", ru: "сложный", example: "Das ist ein sehr komplexes Thema." },
    { de: "redundant (Adj.)", ru: "избыточный, повторяющийся", example: "Einige Argumente wirken redundant." },
    { de: "prägnant (Adj.)", ru: "ёмкий, лаконичный", example: "Der Satz ist prägnant formuliert." },
    { de: "subtil (Adj.)", ru: "тонкий, едва уловимый", example: "Die Kritik ist subtil, aber deutlich." },
    { de: "stringent (Adj.)", ru: "последовательный, строгий", example: "Die Argumentation ist stringent." },
    { de: "erschließen (etw. ~)", ru: "извлекать (смысл)", example: "Den Sinn muss man sich erschließen." },
    { de: "paraphrasieren (etw. ~)", ru: "перефразировать", example: "Er paraphrasierte den Hauptgedanken." },
    { de: "elaborieren (etw. ~)", ru: "детально разрабатывать", example: "Der Autor elaboriert seinen Standpunkt." },
    { de: "dekonstruieren (etw. ~)", ru: "деконструировать", example: "Man kann den Mythos dekonstruieren." },
    { de: "verweisen (auf etw. ~)", ru: "отсылать, ссылаться", example: "Der Autor verweist auf frühere Studien." },
    { de: "überzeugend (Adj.)", ru: "убедительный", example: "Das Argument ist überzeugend." }
  ],

  grammar: [
    {
      title: "Textanalyse: Struktur und Kohäsion",
      explanation: "Сложные тексты имеют чёткую структуру. Анализируя текст, выделяют: Einleitung (введение), Hauptteil (основная часть), Schluss (заключение). Kohäsion — связность на уровне языковых средств (Pronomen, Konnektoren), Kohärenz — смысловая связность.",
      table: {
        headers: ["Element", "Funktion", "Beispiel"],
        rows: [
          ["These", "Hauptaussage einführen", "Der Autor vertritt die These, dass..."],
          ["Argument", "These stützen", "Als Beleg dafür führt er an, dass..."],
          ["Gegenargument", "Einwand nennen", "Zwar könnte man einwenden, dass..."],
          ["Widerlegung", "Einwand entkräften", "Jedoch zeigt sich, dass..."],
          ["Fazit", "Schluss ziehen", "Zusammenfassend lässt sich sagen, dass..."]
        ]
      }
    },
    {
      title: "Stilmittel erkennen und benennen",
      explanation: "Wichtige rhetorische und stilistische Mittel auf B2-Niveau. Das Erkennen von Stilmitteln erlaubt es, Texte auf einer tieferen Ebene zu verstehen und zu analysieren.",
      table: {
        headers: ["Stilmittel", "Definition", "Beispiel"],
        rows: [
          ["Metapher", "Übertragener Ausdruck", "Das Leben ist ein Fluss."],
          ["Ironie", "Gegenteil des Gemeinten", "„Toll gemacht!" (nach Fehler)"],
          ["Anapher", "Wiederholung am Satzanfang", "Ich will Frieden. Ich will Gerechtigkeit."],
          ["Antithese", "Gegenüberstellung von Gegensätzen", "Gut und Böse, Licht und Schatten"],
          ["Euphemismus", "Beschönigung", "„entschlafen" statt „sterben""]
        ]
      }
    },
    {
      title: "Konjunktiv I — indirekte Rede im akademischen Kontext",
      explanation: "Im wissenschaftlichen und journalistischen Schreiben wird Konjunktiv I verwendet, um indirekte Rede zu markieren — ohne die Aussage zu kommentieren. Bei unklarer Unterscheidung zu Indikativ → Konjunktiv II oder würde-Form.",
      table: {
        headers: ["Person", "haben", "sein", "wissen", "können"],
        rows: [
          ["er/sie/es", "habe", "sei", "wisse", "könne"],
          ["sie/Sie (Pl.)", "hätten*", "seien", "wüssten*", "könnten*"],
          ["ich (selten)", "habe", "sei", "wisse", "könne"]
        ]
      }
    },
    {
      title: "Komplexe Satzkonstruktionen",
      explanation: "B2-Texte nutzen komplexe Konstruktionen: erweiterte Partizipialattribute, Genitivketten, Infinitivgruppen, mehrstufige Hypotaxe (verschachtelte Nebensätze). Das Schlüssel zum Verstehen: Prädikate identifizieren, dann Satzgrenzen rekonstruieren.",
      table: {
        headers: ["Konstruktion", "Beispiel", "Umformung"],
        rows: [
          ["Erweitertes Partizip II", "das lange diskutierte Thema", "das Thema, das lange diskutiert wurde"],
          ["Genitivkette", "die Lösung des Problems der Stadt", "die Lösung, die das Problem der Stadt löst"],
          ["Doppelter Infinitiv", "Er hat kommen wollen.", "Er wollte kommen."],
          ["Hypotaxe (3 Stufen)", "Er sagte, dass er glaube, dass es wahr sei.", "Konjunktiv I → indirekte Rede"],
          ["Ausklammerung", "Er hat es gesagt, obwohl er es wusste.", "Nebensatz nach Klammer → Betonung"]
        ]
      }
    }
  ],

  exercises: {
    fillBlanks: {
      instruction: "Вставьте подходящее слово.",
      items: [
        { sentence: "Der Autor _____ eine interessante These auf.", answer: "stellt", hint: "aufstellen" },
        { sentence: "Um den Text zu verstehen, muss man den _____ berücksichtigen.", answer: "Kontext", hint: "Kontext" },
        { sentence: "Die Ironie ist ein wichtiges _____.", answer: "Stilmittel", hint: "Stilmittel" },
        { sentence: "Der Satz ist sehr prägnant _____ .", answer: "formuliert", hint: "formulieren (Part.II)" },
        { sentence: "Er _____ auf frühere Studien.", answer: "verweist", hint: "verweisen" },
        { sentence: "Die Argumentation ist stringent und _____.", answer: "überzeugend", hint: "überzeugend" },
        { sentence: "Man muss die _____ des Textes analysieren.", answer: "Struktur", hint: "Struktur" },
        { sentence: "Das Wort hat negative _____.", answer: "Konnotationen", hint: "Konnotation (Pl.)" }
      ]
    },

    multipleChoice: {
      instruction: "Выберите правильный вариант.",
      items: [
        {
          question: "Was bedeutet 'implizit'?",
          options: ["deutlich ausgesprochen", "verborgen, nicht direkt gesagt", "sehr lang", "widersprüchlich"],
          answer: 1
        },
        {
          question: "Welches Stilmittel ist eine Wiederholung am Satzanfang?",
          options: ["Metapher", "Ironie", "Anapher", "Antithese"],
          answer: 2
        },
        {
          question: "Wofür wird Konjunktiv I im akademischen Text verwendet?",
          options: ["Für Irrealis", "Für indirekte Rede", "Für Befehle", "Für die Zukunft"],
          answer: 1
        },
        {
          question: "Was ist die 'Kohärenz' eines Textes?",
          options: ["Die Länge des Textes", "Die Anzahl der Argumente", "Die inhaltliche Sinnhaftigkeit", "Die Schriftart"],
          answer: 2
        },
        {
          question: "Was bedeutet 'paraphrasieren'?",
          options: ["Wörtlich zitieren", "Mit eigenen Worten wiedergeben", "Kritisieren", "Übersetzen"],
          answer: 1
        },
        {
          question: "Was ist ein Euphemismus?",
          options: ["Eine direkte Kritik", "Eine Beschönigung", "Ein Fremdwort", "Ein Fachbegriff"],
          answer: 1
        },
        {
          question: "Was bedeutet 'redundant'?",
          options: ["Sehr wichtig", "Unnötig wiederholt, überflüssig", "Kurz und prägnant", "Wissenschaftlich"],
          answer: 1
        },
        {
          question: "Was ist die 'These' in einem Argumentationstext?",
          options: ["Ein Beispiel", "Die Schlussfolgerung", "Die Hauptbehauptung", "Ein Einwand"],
          answer: 2
        }
      ]
    },

    matching: {
      instruction: "Соотнесите понятие с его определением.",
      pairs: [
        { left: "Subtext", right: "Скрытый смысл за словами" },
        { left: "Intertextualität", right: "Verweise auf andere Texte" },
        { left: "Diskurs", right: "Öffentliche Debatte / Gespräch" },
        { left: "Ambiguität", right: "Doppeldeutigkeit" },
        { left: "Konnotation", right: "Mitbedeutung eines Wortes" },
        { left: "Stringent", right: "Логически последовательный" },
        { left: "Elaborieren", right: "Ausführlich ausarbeiten" },
        { left: "Fazit", right: "Schlussbemerkung" }
      ]
    },

    dictation: {
      instruction: "Прослушайте и запишите предложения.",
      sentences: [
        "Der Text ist komplex, aber prägnant formuliert.",
        "Man muss zwischen den Zeilen lesen, um den Subtext zu verstehen.",
        "Der Autor stellt eine interessante These auf.",
        "Die Kohärenz des Textes macht ihn überzeugend.",
        "Stilmittel wie Metaphern und Ironie bereichern den Text.",
        "Er erschließt den impliziten Sinn aus dem Kontext.",
        "Widersprüche im Text sollte man kritisch aufzeigen.",
        "Zusammenfassend lässt sich sagen, dass der Autor überzeugend argumentiert."
      ]
    }
  }
};
