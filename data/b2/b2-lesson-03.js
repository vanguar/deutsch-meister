/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-03.js
   B2 · Урок 3: Konnektoren — Коннекторы
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-03',
  level:    'B2',
  unit:     3,
  title:    'Konnektoren',
  subtitle: 'Коннекторы · обwohl, trotzdem, dennoch, zudem, außerdem',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Obwohl es regnete, gingen wir spazieren.',          ru: 'Хотя шёл дождь, мы пошли гулять.',              note: 'obwohl — уступка (союз придаточного)', audio: 'Obwohl es regnete, gingen wir spazieren' },
    { de: 'Es regnete; trotzdem gingen wir spazieren.',        ru: 'Шёл дождь; тем не менее мы пошли гулять.',      note: 'trotzdem — несмотря на это (наречие)', audio: 'Es regnete; trotzdem gingen wir spazieren' },
    { de: 'Er ist krank; dennoch arbeitet er.',                ru: 'Он болен; тем не менее он работает.',            note: 'dennoch — всё же (книжное)', audio: 'Er ist krank; dennoch arbeitet er' },
    { de: 'Das ist teuer; außerdem ist es hässlich.',          ru: 'Это дорого; к тому же это некрасиво.',          note: 'außerdem — к тому же, помимо этого', audio: 'Das ist teuer; außerdem ist es hässlich' },
    { de: 'Er ist klug; zudem ist er fleißig.',                ru: 'Он умный; вдобавок ещё и трудолюбивый.',       note: 'zudem — вдобавок (книжное = außerdem)', audio: 'Er ist klug; zudem ist er fleißig' },
    { de: 'Weder er noch sie kam zur Party.',                  ru: 'Ни он, ни она не пришли на вечеринку.',         note: 'weder … noch — ни … ни', audio: 'Weder er noch sie kam zur Party' },
    { de: 'Sowohl das Essen als auch der Service war gut.',    ru: 'И еда, и обслуживание были хорошими.',          note: 'sowohl … als auch — и … и (оба)', audio: 'Sowohl das Essen als auch der Service war gut' },
    { de: 'Er arbeitet hart; deshalb hat er Erfolg.',         ru: 'Он работает усердно; поэтому у него успех.',    note: 'deshalb — поэтому (следствие)', audio: 'Er arbeitet hart; deshalb hat er Erfolg' },
    { de: 'Ich bin müde; trotzdem mache ich weiter.',         ru: 'Я устал; тем не менее продолжаю.',              note: 'trotzdem — вопреки ожиданию', audio: 'Ich bin müde; trotzdem mache ich weiter' },
    { de: 'Da es spät war, gingen sie nach Hause.',           ru: 'Поскольку было поздно, они пошли домой.',       note: 'da — поскольку (= weil, но в начале)', audio: 'Da es spät war, gingen sie nach Hause' },
    { de: 'Indem er übte, verbesserte er sich.',              ru: 'Занимаясь, он совершенствовался.',              note: 'indem — тем, что / делая что-то', audio: 'Indem er übte, verbesserte er sich' },
    { de: 'Je mehr er lernte, desto besser wurde er.',        ru: 'Чем больше он учил, тем лучше становился.',    note: 'je … desto — чем … тем', audio: 'Je mehr er lernte, desto besser wurde er' },
    { de: 'Entweder du kommst, oder du bleibst.',             ru: 'Либо ты придёшь, либо останешься.',             note: 'entweder … oder — либо … либо', audio: 'Entweder du kommst, oder du bleibst' },
    { de: 'Nicht nur er, sondern auch sie war eingeladen.',   ru: 'Не только он, но и она была приглашена.',       note: 'nicht nur … sondern auch — не только … но и', audio: 'Nicht nur er, sondern auch sie war eingeladen' },
    { de: 'Zwar ist er reich, aber glücklich ist er nicht.',  ru: 'Хотя он и богат, но счастлив он не.',          note: 'zwar … aber — хотя … но (противопоставление)', audio: 'Zwar ist er reich, aber glücklich ist er nicht' },
    { de: 'Stattdessen schlug er etwas anderes vor.',         ru: 'Вместо этого он предложил кое-что другое.',    note: 'stattdessen — вместо этого', audio: 'Stattdessen schlug er etwas anderes vor' },
    { de: 'Anstatt zu schlafen, arbeitete er weiter.',        ru: 'Вместо того чтобы спать, он продолжал работать.', note: 'anstatt zu — вместо того чтобы', audio: 'Anstatt zu schlafen, arbeitete er weiter' },
    { de: 'Das Projekt scheiterte; folglich mussten wir neu beginnen.', ru: 'Проект провалился; следовательно, пришлось начать заново.', note: 'folglich — следовательно', audio: 'Das Projekt scheiterte; folglich mussten wir neu beginnen' },
    { de: 'Einerseits ist es gut; andererseits ist es teuer.', ru: 'С одной стороны — хорошо; с другой — дорого.',  note: 'einerseits … andererseits', audio: 'Einerseits ist es gut; andererseits ist es teuer' },
    { de: 'Sofern du kommst, helfe ich dir.',                 ru: 'При условии что придёшь, я помогу.',            note: 'sofern — при условии что', audio: 'Sofern du kommst, helfe ich dir' },
    { de: 'Sobald er ankommt, beginnen wir.',                 ru: 'Как только он приедет, мы начнём.',             note: 'sobald — как только', audio: 'Sobald er ankommt, beginnen wir' },
    { de: 'Solange du hier bist, bin ich ruhig.',             ru: 'Пока ты здесь, я спокоен.',                    note: 'solange — пока', audio: 'Solange du hier bist, bin ich ruhig' },
    { de: 'Er war erschöpft; nichtsdestotrotz gab er nicht auf.', ru: 'Он был истощён; тем не менее не сдавался.', note: 'nichtsdestotrotz — тем не менее (торжественное)', audio: 'Er war erschöpft; nichtsdestotrotz gab er nicht auf' },
    { de: 'Wenngleich er müde war, lächelte er.',             ru: 'Хотя он и устал, он улыбался.',                note: 'wenngleich — хотя (книжное = obwohl)', audio: 'Wenngleich er müde war, lächelte er' }
  ],

  vocabulary: [
    { de: 'obwohl',            ru: 'хотя (союз придаточного)',   ipa: '[ɔpˈvoːl]',         article: '' },
    { de: 'trotzdem',          ru: 'тем не менее (наречие)',     ipa: '[ˈtʁɔtsdəm]',       article: '' },
    { de: 'dennoch',           ru: 'всё же (книжное)',           ipa: '[ˈdɛnnɔx]',         article: '' },
    { de: 'außerdem',          ru: 'к тому же',                 ipa: '[ˈaʊ̯sɐdeːm]',       article: '' },
    { de: 'zudem',             ru: 'вдобавок',                  ipa: '[tsuˈdeːm]',         article: '' },
    { de: 'deshalb',           ru: 'поэтому',                   ipa: '[ˈdɛshalp]',         article: '' },
    { de: 'folglich',          ru: 'следовательно',             ipa: '[ˈfɔlklɪç]',         article: '' },
    { de: 'da',                ru: 'поскольку (= weil)',         ipa: '[daː]',              article: '' },
    { de: 'indem',             ru: 'тем что / делая',           ipa: '[ɪnˈdeːm]',          article: '' },
    { de: 'sowohl … als auch', ru: 'и … и (оба)',               ipa: '[zoːˈvoːl … als aʊ̯x]', article: '' },
    { de: 'weder … noch',      ru: 'ни … ни',                   ipa: '[ˈveːdɐ … nɔx]',    article: '' },
    { de: 'entweder … oder',   ru: 'либо … либо',               ipa: '[ɛntˈveːdɐ … ˈoːdɐ]', article: '' },
    { de: 'nicht nur … sondern auch', ru: 'не только … но и',   ipa: '[nɪçt nuːʁ … ˈzɔndɐn aʊ̯x]', article: '' },
    { de: 'zwar … aber',       ru: 'хотя … но',                 ipa: '[tsvaːʁ … ˈaːbɐ]',  article: '' },
    { de: 'stattdessen',       ru: 'вместо этого',              ipa: '[ˈʃtatdɛsn̩]',        article: '' },
    { de: 'sofern',            ru: 'при условии что',           ipa: '[zoˈfɛʁn]',          article: '' },
    { de: 'sobald',            ru: 'как только',                ipa: '[zoˈbalt]',           article: '' },
    { de: 'solange',           ru: 'пока',                      ipa: '[zoˈlaŋə]',           article: '' },
    { de: 'wenngleich',        ru: 'хотя (книжное)',            ipa: '[vɛnˈɡlaɪ̯ç]',        article: '' },
    { de: 'nichtsdestotrotz',  ru: 'тем не менее (торжественное)', ipa: '[nɪçtsdɛstoˈtʁɔts]', article: '' },
    { de: 'scheitern',         ru: 'терпеть неудачу, проваливаться', ipa: '[ˈʃaɪ̯tɐn]',   article: '' },
    { de: 'der Konnektor',     ru: 'коннектор, соединительный элемент', ipa: '[kɔˈnɛktɔʁ]', article: 'der' },
    { de: 'die Inversion',     ru: 'инверсия',                  ipa: '[ɪnvɛʁˈzjoːn]',     article: '' },
    { de: 'hässlich',          ru: 'некрасивый',                ipa: '[ˈhɛslɪç]',          article: '' }
  ],

  grammar: [
    {
      title: '⚡ Коннекторы: союзы vs. наречия — влияние на порядок слов',
      body: 'Ключевое различие:<br><br>' +
            '<strong>Союзы придаточного</strong> (obwohl, da, indem…) → глагол в конец:<br>' +
            '<em><strong>Obwohl</strong> es regnete, gingen wir.</em><br><br>' +
            '<strong>Наречия</strong> (trotzdem, deshalb, außerdem…) → <strong>инверсия</strong> в главном:<br>' +
            '<em>Es regnete; <strong>trotzdem gingen</strong> wir.</em> (глагол на 2-й позиции)<br><br>' +
            '<strong>Сочинительные союзы</strong> (aber, denn, und, oder, sondern) → без изменения порядка:<br>' +
            '<em>Es regnet, <strong>aber</strong> wir gehen.</em>',
      conjugation: [
        { pronoun: 'obwohl (Nebensatz)', form: 'Glz im Kontext → V-Ende',  audio: 'obwohl es regnete',   translation: '→ глагол в конец' },
        { pronoun: 'trotzdem (Adverb)', form: 'trotzdem + Verb an 2.',     audio: 'trotzdem gingen wir', translation: '→ инверсия' },
        { pronoun: 'deshalb (Adverb)', form: 'deshalb + Verb an 2.',       audio: 'deshalb hat er Erfolg', translation: '→ инверсия' },
        { pronoun: 'außerdem (Adverb)', form: 'außerdem + Verb an 2.',     audio: 'außerdem ist es hässlich', translation: '→ инверсия' },
        { pronoun: 'aber (Konj.)',     form: 'aber + normaler Satz.',       audio: 'aber glücklich ist er nicht', translation: '→ обычный порядок' },
        { pronoun: 'sowohl…als auch', form: 'sowohl A als auch B',         audio: 'sowohl das Essen als auch der Service', translation: '→ и то, и другое' }
      ]
    },
    {
      title: '💡 Двойные коннекторы (Dopelkonnektoren)',
      body: '<strong>sowohl … als auch</strong> — и … и (оба положительно):<br>' +
            '<em>Sowohl das Essen <strong>als auch</strong> der Service war gut.</em><br><br>' +
            '<strong>weder … noch</strong> — ни … ни (оба отрицательно):<br>' +
            '<em>Weder er <strong>noch</strong> sie kam.</em><br><br>' +
            '<strong>entweder … oder</strong> — либо … либо (альтернатива):<br>' +
            '<em>Entweder du <strong>oder</strong> ich.</em><br><br>' +
            '<strong>nicht nur … sondern auch</strong> — не только … но и:<br>' +
            '<em>Nicht nur klug, <strong>sondern auch</strong> fleißig.</em><br><br>' +
            '<strong>zwar … aber</strong> — хотя … но:<br>' +
            '<em>Zwar teuer, <strong>aber</strong> gut.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '—',                blank: 'Obwohl',      after: 'es regnete, gingen wir.',     translation: '— Хотя шёл дождь, мы пошли.',        hintWord: 'Obwohl',     hintRule: 'obwohl — союз придаточного, V в конец' },
      { before: '— Es regnete;',    blank: 'trotzdem',    after: 'gingen wir.',                 translation: '— Шёл дождь; тем не менее пошли.',   hintWord: 'trotzdem',   hintRule: 'trotzdem — наречие, инверсия' },
      { before: '— Er arbeitet;',   blank: 'deshalb',     after: 'hat er Erfolg.',              translation: '— Он работает; поэтому у него успех.', hintWord: 'deshalb',   hintRule: 'deshalb — поэтому (инверсия)' },
      { before: '—',                blank: 'Sowohl',      after: 'er als auch sie kam.',        translation: '— И он, и она пришли.',               hintWord: 'Sowohl',     hintRule: 'sowohl … als auch — и … и' },
      { before: '—',                blank: 'Weder',       after: 'er noch sie kam.',            translation: '— Ни он, ни она не пришли.',          hintWord: 'Weder',      hintRule: 'weder … noch — ни … ни' },
      { before: '— Das ist teuer;', blank: 'außerdem',    after: 'ist es hässlich.',            translation: '— Это дорого; к тому же некрасиво.', hintWord: 'außerdem',   hintRule: 'außerdem — к тому же (инверсия)' },
      { before: '—',                blank: 'Sobald',      after: 'er kommt, beginnen wir.',     translation: '— Как только он придёт, начнём.',    hintWord: 'Sobald',     hintRule: 'sobald — как только (Nebensatz)' },
      { before: '— Zwar ist er reich,', blank: 'aber',   after: 'glücklich ist er nicht.',     translation: '— Хотя он богат, но не счастлив.',   hintWord: 'aber',       hintRule: 'zwar … aber — хотя … но' }
    ],

    multipleChoice: [
      { question: '«obwohl» требует…',                                     options: ['инверсии', 'глагол в конец', 'нормального порядка', 'Perfekt'],      correctIndex: 1 },
      { question: '«trotzdem» = …',                                         options: ['поэтому', 'хотя', 'тем не менее', 'поскольку'],                      correctIndex: 2 },
      { question: '«sowohl … als auch» выражает…',                          options: ['ни то ни другое', 'и то, и другое', 'либо то либо другое', 'только одно'], correctIndex: 1 },
      { question: 'Наречие «deshalb» требует в предложении…',               options: ['глагол в конец', 'нормального порядка', 'инверсии', 'Konjunktiv'],   correctIndex: 2 },
      { question: '«weder … noch» означает…',                               options: ['и … и', 'ни … ни', 'либо … либо', 'не только … но и'],              correctIndex: 1 },
      { question: 'Синоним «obwohl»:',                                       options: ['wenngleich', 'sofern', 'sobald', 'deshalb'],                         correctIndex: 0 },
      { question: '«folglich» = …',                                          options: ['однако', 'следовательно', 'хотя', 'к тому же'],                      correctIndex: 1 },
      { question: '«da» как коннектор означает…',                            options: ['тогда', 'поскольку', 'там', 'потом'],                                correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'obwohl',         ru: 'хотя (союз придаточного)' },
      { id: 2, de: 'trotzdem',       ru: 'тем не менее (наречие)' },
      { id: 3, de: 'deshalb',        ru: 'поэтому' },
      { id: 4, de: 'außerdem',       ru: 'к тому же' },
      { id: 5, de: 'sowohl … als auch', ru: 'и … и' },
      { id: 6, de: 'weder … noch',   ru: 'ни … ни' },
      { id: 7, de: 'sobald',         ru: 'как только' },
      { id: 8, de: 'folglich',       ru: 'следовательно' }
    ],

    dictation: [
      { word: 'obwohl',      audio: 'obwohl' },
      { word: 'trotzdem',    audio: 'trotzdem' },
      { word: 'dennoch',     audio: 'dennoch' },
      { word: 'außerdem',    audio: 'außerdem' },
      { word: 'deshalb',     audio: 'deshalb' },
      { word: 'sobald',      audio: 'sobald' },
      { word: 'folglich',    audio: 'folglich' },
      { word: 'Konnektor',   audio: 'Konnektor' }
    ]
  }
};
