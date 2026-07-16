/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-14.js
   B2 · Урок 14: Wiederholung B2 — Итоговый урок уровня
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-14',
  level:    'B2',
  unit:     14,
  title:    'Wiederholung B2',
  subtitle: 'Итоговый урок: повторяем весь уровень B2',

  meta: {
    duration:  '40–45 мин',
    wordCount: 16,
    xpReward:  200
  },

  phrases: [
    { de: 'Die im letzten Jahr gestiegenen Preise belasten viele Familien.', ru: 'Выросшие за последний год цены обременяют многие семьи.', note: 'урок 1: расширенный причастный оборот', audio: 'Die im letzten Jahr gestiegenen Preise belasten viele Familien' },
    { de: 'Das ist doch mal eine gute Nachricht!',              ru: 'Вот это действительно хорошая новость!',            note: 'урок 2: частицы doch, mal', audio: 'Das ist doch mal eine gute Nachricht' },
    { de: 'Es regnete stark; dennoch fand das Konzert statt.',  ru: 'Шёл сильный дождь; тем не менее концерт состоялся.', note: 'урок 3: dennoch + урок 10: stattfinden', audio: 'Es regnete stark; dennoch fand das Konzert statt' },
    { de: 'Beim Lesen komplexer Texte hilft die Nominalisierung oft nicht — sie erschwert sie.', ru: 'При чтении сложных текстов номинализация часто не помогает — она их усложняет.', note: 'урок 4: beim Lesen = когда читаешь', audio: 'Beim Lesen komplexer Texte hilft die Nominalisierung oft nicht. Sie erschwert sie' },
    { de: 'In der vorliegenden Studie wird untersucht, wie sich Medien auf Jugendliche auswirken.', ru: 'В данном исследовании изучается, как медиа влияют на подростков.', note: 'урок 5: научный стиль + Passiv', audio: 'In der vorliegenden Studie wird untersucht, wie sich Medien auf Jugendliche auswirken' },
    { de: 'Die Nachfrage nach Fachkräften steigt weiter.',      ru: 'Спрос на квалифицированных специалистов продолжает расти.', note: 'урок 6: экономика — die Nachfrage', audio: 'Die Nachfrage nach Fachkräften steigt weiter' },
    { de: 'Einerseits spart das Zeit, andererseits kostet es Nerven.', ru: 'С одной стороны, это экономит время, с другой — стоит нервов.', note: 'уроки 3, 7: einerseits … andererseits', audio: 'Einerseits spart das Zeit, andererseits kostet es Nerven' },
    { de: 'Der Autor vertritt die These, dass Sprache unser Denken prägt.', ru: 'Автор отстаивает тезис, что язык формирует наше мышление.', note: 'урок 8: анализ текста', audio: 'Der Autor vertritt die These, dass Sprache unser Denken prägt' },
    { de: 'Sie dürfte die E-Mail noch nicht gelesen haben.',    ru: 'Она, вероятно, ещё не прочитала письмо.',           note: 'урок 9: dürfte + Infinitiv Perfekt', audio: 'Sie dürfte die E-Mail noch nicht gelesen haben' },
    { de: 'Der Film soll ausgezeichnet sein.',                  ru: 'Говорят, фильм превосходный.',                      note: 'урок 9: sollen = слухи', audio: 'Der Film soll ausgezeichnet sein' },
    { de: 'Wir müssen endlich eine Entscheidung treffen und das Projekt in Angriff nehmen.', ru: 'Мы должны наконец принять решение и взяться за проект.', note: 'урок 10: две Nomen-Verb-Verbindungen', audio: 'Wir müssen endlich eine Entscheidung treffen und das Projekt in Angriff nehmen' },
    { de: 'Drück mir die Daumen — heute ist das Vorstellungsgespräch!', ru: 'Держи за меня кулачки — сегодня собеседование!', note: 'урок 11: идиома', audio: 'Drück mir die Daumen. Heute ist das Vorstellungsgespräch' },
    { de: 'Könnten wir den Termin auf nächste Woche verschieben?', ru: 'Могли бы мы перенести встречу на следующую неделю?', note: 'урок 12: деловое общение', audio: 'Könnten wir den Termin auf nächste Woche verschieben' },
    { de: 'Der Ministerpräsident erklärte, man werde die Reform sorgfältig prüfen.', ru: 'Премьер-министр заявил, что реформу тщательно проверят.', note: 'урок 13: Konjunktiv I', audio: 'Der Ministerpräsident erklärte, man werde die Reform sorgfältig prüfen' },
    { de: 'Trotz aller Schwierigkeiten hast du durchgehalten.', ru: 'Несмотря на все трудности, ты выдержал.',           note: 'durchhalten — продержаться', audio: 'Trotz aller Schwierigkeiten hast du durchgehalten' },
    { de: 'Herzlichen Glückwunsch: B2 ist geschafft — jetzt sprichst du fließend!', ru: 'Поздравляем: B2 позади — теперь ты говоришь свободно!', note: 'весь курс пройден!', audio: 'Herzlichen Glückwunsch: B2 ist geschafft. Jetzt sprichst du fließend' }
  ],

  vocabulary: [
    { de: 'das Partizip',       ru: 'причастие (урок 1)',           ipa: '[paʁtiˈt͡siːp]',     article: 'das' },
    { de: 'die Modalpartikel',  ru: 'модальная частица (урок 2)',   ipa: '[moˈdaːlpaʁˌtɪkl̩]',  article: 'die' },
    { de: 'dennoch',            ru: 'тем не менее (урок 3)',        ipa: '[ˈdɛnɔx]',            article: '' },
    { de: 'die Nominalisierung', ru: 'номинализация (урок 4)',      ipa: '[nominalizɪˈʁʊŋ]',    article: 'die' },
    { de: 'untersuchen',        ru: 'исследовать (урок 5)',         ipa: '[ʊntɐˈzuːxn̩]',       article: '' },
    { de: 'die Nachfrage',      ru: 'спрос (урок 6)',               ipa: '[ˈnaːxfʁaːɡə]',       article: 'die' },
    { de: 'die These',          ru: 'тезис (уроки 7, 8)',           ipa: '[ˈteːzə]',            article: 'die' },
    { de: 'die Vermutung',      ru: 'предположение (урок 9)',       ipa: '[fɛʁˈmuːtʊŋ]',        article: 'die' },
    { de: 'eine Entscheidung treffen', ru: 'принять решение (урок 10)', ipa: '[ɛntˈʃaɪ̯dʊŋ]',   article: '' },
    { de: 'die Redewendung',    ru: 'идиома (урок 11)',             ipa: '[ˈʁeːdəˌvɛndʊŋ]',     article: 'die' },
    { de: 'der Termin',         ru: 'встреча, запись (урок 12)',    ipa: '[tɛʁˈmiːn]',          article: 'der' },
    { de: 'die Regierung',      ru: 'правительство (урок 13)',      ipa: '[ʁeˈɡiːʁʊŋ]',         article: 'die' },
    { de: 'sorgfältig',         ru: 'тщательно',                    ipa: '[ˈzɔʁkfɛltɪç]',       article: '' },
    { de: 'durchhalten',        ru: 'выдержать, продержаться',      ipa: '[ˈdʊʁçhaltn̩]',       article: '' },
    { de: 'fließend',           ru: 'свободно (о языке)',           ipa: '[ˈfliːsn̩t]',         article: '' },
    { de: 'ausgezeichnet',      ru: 'превосходный',                 ipa: '[ˈaʊ̯sɡət͡saɪ̯çnət]', article: '' }
  ],

  grammar: [
    {
      title: '⚡ Ядро B2: три уровня «дистанции» в речи',
      body: 'B2 научил тебя говорить не только факты, но и оттенки достоверности:<br><br>' +
            '<strong>1. Факт:</strong> <em>Er ist krank.</em><br>' +
            '<strong>2. Моё предположение</strong> (урок 9): <em>Er <strong>muss</strong> krank sein. / Er <strong>dürfte</strong> krank sein.</em><br>' +
            '<strong>3. Чужие слова:</strong> <em>Er <strong>soll</strong> krank sein</em> (говорят) / <em>Er sagte, er <strong>sei</strong> krank</em> (Konjunktiv I, урок 13).',
      conjugation: [
        { pronoun: 'факт',       form: 'Er ist krank.',                audio: 'Er ist krank',                translation: 'Он болен.' },
        { pronoun: 'уверен',     form: 'Er muss krank sein.',          audio: 'Er muss krank sein',          translation: 'Он наверняка болен.' },
        { pronoun: 'вероятно',   form: 'Er dürfte krank sein.',        audio: 'Er dürfte krank sein',        translation: 'Он, вероятно, болен.' },
        { pronoun: 'слухи',      form: 'Er soll krank sein.',          audio: 'Er soll krank sein',          translation: 'Говорят, он болен.' },
        { pronoun: 'цитата',     form: 'Er sagte, er sei krank.',      audio: 'Er sagte, er sei krank',      translation: 'Он сказал, что болен.' }
      ]
    },
    {
      title: '⚡ Формальный стиль: конструкции-визитки B2',
      body: 'Что делает текст «взрослым» — сводка уроков 1, 4, 5, 10:<br><br>' +
            '<strong>Причастные обороты</strong> (урок 1): <em>die <strong>gestiegenen</strong> Preise</em> = цены, которые выросли<br>' +
            '<strong>Номинализация</strong> (урок 4): <em><strong>beim Lesen</strong></em> = когда читаешь<br>' +
            '<strong>Passiv</strong> (урок 5): <em>Es <strong>wird untersucht</strong>, …</em><br>' +
            '<strong>Nomen-Verb-Verbindungen</strong> (урок 10): <em>eine Entscheidung <strong>treffen</strong>, in Kraft <strong>treten</strong></em>',
      conjugation: [
        { pronoun: 'Partizip',  form: 'die steigenden Preise',           audio: 'die steigenden Preise',           translation: 'растущие цены' },
        { pronoun: 'Nominal',   form: 'beim Lesen des Textes',           audio: 'beim Lesen des Textes',           translation: 'при чтении текста' },
        { pronoun: 'Passiv',    form: 'Es wird viel diskutiert.',        audio: 'Es wird viel diskutiert',         translation: 'Много дискутируют.' },
        { pronoun: 'N-V-V',     form: 'Das Gesetz tritt in Kraft.',      audio: 'Das Gesetz tritt in Kraft',       translation: 'Закон вступает в силу.' },
        { pronoun: 'Konnektor', form: 'dennoch / allerdings / zudem',    audio: 'dennoch, allerdings, zudem',      translation: 'тем не менее / однако / к тому же' }
      ]
    },
    {
      title: '💡 Живая речь: частицы и идиомы',
      body: 'Формальный стиль — половина B2. Вторая половина — звучать естественно:<br><br>' +
            '<strong>Модальные частицы</strong> (урок 2): <em>Das ist <strong>doch</strong> klar! Komm <strong>mal</strong> her! Das ist <strong>eben</strong> so.</em><br>' +
            '<strong>Идиомы</strong> (урок 11): <em>die Daumen drücken, die Nase voll haben, nur Bahnhof verstehen</em>.<br>' +
            '<strong>Деловые формулы</strong> (урок 12): <em>Ich melde mich. / Mit freundlichen Grüßen.</em><br><br>' +
            'Дальше — C1: читай, слушай, говори. <em>Übung macht den Meister!</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Die',                 blank: 'steigenden', after: 'Preise sind ein Problem.',    translation: '— Растущие цены — это проблема. (урок 1)',  hintWord: 'steigenden', hintRule: 'Partizip I + окончание' },
      { before: '— Es regnete;',         blank: 'dennoch',   after: 'kamen alle.',                  translation: '— Шёл дождь; тем не менее пришли все. (урок 3)', hintWord: 'dennoch', hintRule: 'тем не менее' },
      { before: '— Er',                  blank: 'dürfte',    after: 'schon zu Hause sein.',         translation: '— Он, вероятно, уже дома. (урок 9)',        hintWord: 'dürfte',  hintRule: 'вероятность ~70%' },
      { before: '— Der Film',            blank: 'soll',      after: 'sehr gut sein.',               translation: '— Говорят, фильм очень хорош. (урок 9)',    hintWord: 'soll',    hintRule: 'чужие слова → sollen' },
      { before: '— Wir müssen eine Entscheidung', blank: 'treffen', after: '.',                     translation: '— Мы должны принять решение. (урок 10)',    hintWord: 'treffen', hintRule: 'Entscheidung + treffen' },
      { before: '— Ich drücke dir die',  blank: 'Daumen',    after: '!',                            translation: '— Держу за тебя кулачки! (урок 11)',        hintWord: 'Daumen',  hintRule: 'идиома удачи' },
      { before: '— Können wir den Termin', blank: 'verschieben', after: '?',                        translation: '— Можем перенести встречу? (урок 12)',      hintWord: 'verschieben', hintRule: 'перенести = verschieben' },
      { before: '— Er sagte, er',        blank: 'sei',       after: 'informiert.',                  translation: '— Он сказал, что проинформирован. (урок 13)', hintWord: 'sei',   hintRule: 'Konjunktiv I от sein' }
    ],

    multipleChoice: [
      { question: '«die gestiegenen Preise» — это замена…',            options: ['пассива', 'придаточного (die Preise, die gestiegen sind)', 'номинализации', 'инфинитива'], correctIndex: 1 },
      { question: 'Частица «doch» в «Das ist doch klar!» выражает…',   options: ['вопрос', 'усиление/очевидность', 'сомнение', 'вежливость'],        correctIndex: 1 },
      { question: '«dennoch» — это…',                                  options: ['союз (глагол в конец)', 'наречие (инверсия после него)', 'предлог', 'частица'], correctIndex: 1 },
      { question: '«Er will alles gewusst haben» значит…',             options: ['он хочет всё знать', 'он утверждает, что всё знал', 'ему следовало знать', 'он всё узнает'], correctIndex: 1 },
      { question: '«in Kraft treten» — …',                             options: ['тренироваться', 'вступить в силу', 'войти в комнату', 'набрать силу'], correctIndex: 1 },
      { question: '«einen Kater haben» — …',                           options: ['иметь кота', 'иметь похмелье', 'злиться', 'уставать'],             correctIndex: 1 },
      { question: 'Деловое письмо заканчивается…',                     options: ['Tschüss!', 'Mit freundlichen Grüßen', 'Auf Wiedersehen.', 'Danke schön!'], correctIndex: 1 },
      { question: 'Konjunktiv I в новостях означает…',                 options: ['будущее время', 'цитирование без гарантии истинности', 'вежливую просьбу', 'приказ'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die steigenden Preise',      ru: 'растущие цены' },
      { id: 2, de: 'dennoch',                    ru: 'тем не менее' },
      { id: 3, de: 'Er soll reich sein.',        ru: 'Говорят, он богат.' },
      { id: 4, de: 'eine Entscheidung treffen',  ru: 'принять решение' },
      { id: 5, de: 'die Daumen drücken',         ru: 'желать удачи' },
      { id: 6, de: 'einen Termin vereinbaren',   ru: 'договориться о встрече' },
      { id: 7, de: 'die Nachfrage',              ru: 'спрос' },
      { id: 8, de: 'fließend sprechen',          ru: 'говорить свободно' }
    ],

    dictation: [
      { word: 'Entscheidung',   audio: 'Entscheidung' },
      { word: 'Regierung',      audio: 'Regierung' },
      { word: 'Vermutung',      audio: 'Vermutung' },
      { word: 'Redewendung',    audio: 'Redewendung' },
      { word: 'sorgfältig',     audio: 'sorgfältig' },
      { word: 'durchhalten',    audio: 'durchhalten' },
      { word: 'fließend',       audio: 'fließend' },
      { word: 'ausgezeichnet',  audio: 'ausgezeichnet' }
    ]
  }
};
