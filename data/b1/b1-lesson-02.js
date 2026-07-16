/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-02.js
   B1 · Урок 2: Das Passiv — Пассивный залог
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-02',
  level:    'B1',
  unit:     2,
  title:    'Das Passiv',
  subtitle: 'Пассивный залог · werden + Partizip II',

  meta: {
    duration:  '35–40 мин',
    wordCount: 24,
    xpReward:  150
  },

  phrases: [
    { de: 'Das Buch wird gelesen.',                     ru: 'Книгу читают. / Книга читается.',             note: 'werden + Partizip II — Vorgangspassiv', audio: 'Das Buch wird gelesen' },
    { de: 'Das Haus wurde gebaut.',                     ru: 'Дом был построен.',                           note: 'wurde + Partizip II — Passiv Präteritum', audio: 'Das Haus wurde gebaut' },
    { de: 'Der Brief wird geschrieben.',                ru: 'Письмо пишут / пишется.',                     note: 'Субъект действия не важен или неизвестен', audio: 'Der Brief wird geschrieben' },
    { de: 'Die Prüfung wird morgen gemacht.',           ru: 'Экзамен пройдёт завтра.',                     note: 'morgen — указывает на будущее', audio: 'Die Prüfung wird morgen gemacht' },
    { de: 'Das Fenster wurde geöffnet.',                ru: 'Окно было открыто.',                          note: 'Präteritum Passiv — прошедшее', audio: 'Das Fenster wurde geöffnet' },
    { de: 'Hier wird Deutsch gesprochen.',              ru: 'Здесь говорят по-немецки.',                   note: 'Pассив без субъекта — часто с обстоятельствами', audio: 'Hier wird Deutsch gesprochen' },
    { de: 'Der Kuchen wird von meiner Mutter gebacken.', ru: 'Торт испечён моей мамой.',                  note: 'von + Dat. — указывает на действующее лицо', audio: 'Der Kuchen wird von meiner Mutter gebacken' },
    { de: 'Das Auto wird repariert.',                   ru: 'Машину ремонтируют.',                         note: 'repariert — Partizip II от reparieren', audio: 'Das Auto wird repariert' },
    { de: 'Die Stadt wurde zerstört.',                  ru: 'Город был разрушен.',                         note: 'wurde + Partizip II', audio: 'Die Stadt wurde zerstört' },
    { de: 'Das ist gemacht worden.',                    ru: 'Это было сделано (к этому моменту).',          note: 'worden — Partizip II von werden (Passiv Perfekt!)', audio: 'Das ist gemacht worden' },
    { de: 'Es wird viel gearbeitet.',                   ru: 'Много работают.',                             note: 'es — формальный субъект в пассиве', audio: 'Es wird viel gearbeitet' },
    { de: 'Der Vertrag muss unterzeichnet werden.',     ru: 'Договор должен быть подписан.',               note: 'Modalverb + werden (Infinitiv Passiv)', audio: 'Der Vertrag muss unterzeichnet werden' },
    { de: 'Alle Türen werden geschlossen.',             ru: 'Все двери закрываются.',                      note: 'Plural: werden (без Umlaut)', audio: 'Alle Türen werden geschlossen' },
    { de: 'Das Essen wird von ihm zubereitet.',         ru: 'Еда готовится им.',                           note: 'von + Dat. — исполнитель', audio: 'Das Essen wird von ihm zubereitet' },
    { de: 'Das Kind wurde von der Ärztin untersucht.', ru: 'Ребёнок был осмотрен врачом.',                note: 'Präteritum Passiv + von', audio: 'Das Kind wurde von der Ärztin untersucht' },
    { de: 'Wann wird das Problem gelöst?',             ru: 'Когда будет решена проблема?',                note: 'вопрос в пассиве', audio: 'Wann wird das Problem gelöst' },
    { de: 'Das darf nicht vergessen werden.',          ru: 'Об этом нельзя забывать.',                   note: 'darf nicht + werden — запрет', audio: 'Das darf nicht vergessen werden' },
    { de: 'Der Tisch ist gedeckt.',                    ru: 'Стол накрыт.',                               note: 'Zustandspassiv: sein + Partizip II (результат)', audio: 'Der Tisch ist gedeckt' },
    { de: 'Das Gebäude ist renoviert worden.',         ru: 'Здание было отремонтировано.',               note: 'Perfekt Passiv: ist + Partizip II + worden', audio: 'Das Gebäude ist renoviert worden' },
    { de: 'Das Paket wird morgen geliefert werden.',   ru: 'Посылка будет доставлена завтра.',            note: 'Futur Passiv: wird + Partizip II + werden', audio: 'Das Paket wird morgen geliefert werden' },
    { de: 'Durch den Sturm wurden viele Bäume gefällt.', ru: 'Из-за бури было повалено много деревьев.', note: 'durch + Akk. — причина/средство (не живое)', audio: 'Durch den Sturm wurden viele Bäume gefällt' },
    { de: 'Das Projekt wird abgeschlossen.',           ru: 'Проект завершается.',                        note: 'abschließen — отделяемый глагол', audio: 'Das Projekt wird abgeschlossen' },
    { de: 'Hier darf nicht geraucht werden.',          ru: 'Здесь курить запрещено.',                    note: 'darf nicht + Passiv — общий запрет', audio: 'Hier darf nicht geraucht werden' },
    { de: 'Die Aufgabe wurde erledigt.',               ru: 'Задача была выполнена.',                     note: 'erledigen — выполнять', audio: 'Die Aufgabe wurde erledigt' }
  ],

  vocabulary: [
    { de: 'werden',          ru: 'стать / вспомогательный в пассиве', ipa: '[ˈveːʁdn̩]',     article: '' },
    { de: 'worden',          ru: 'Partizip II от werden (в пассиве)',   ipa: '[ˈvɔʁdn̩]',     article: '' },
    { de: 'das Partizip II', ru: 'причастие прошедшего времени',       ipa: '[paʁˈtiːtsɪp]', article: 'das' },
    { de: 'bauen',           ru: 'строить',                            ipa: '[ˈbaʊ̯ən]',      article: '' },
    { de: 'reparieren',      ru: 'ремонтировать',                      ipa: '[ʁepaˈʁiːʁən]', article: '' },
    { de: 'unterzeichnen',   ru: 'подписывать',                        ipa: '[ˈʊntɐˌtsaɪ̯çnən]', article: '' },
    { de: 'zubereiten',      ru: 'готовить (еду)',                     ipa: '[ˈtsuːbəˌʁaɪ̯tn̩]', article: '' },
    { de: 'untersuchen',     ru: 'осматривать, исследовать',           ipa: '[ˈʊntɐˌzuːxn̩]', article: '' },
    { de: 'lösen',           ru: 'решать',                             ipa: '[ˈløːzn̩]',      article: '' },
    { de: 'liefern',         ru: 'доставлять',                         ipa: '[ˈliːfɐn]',     article: '' },
    { de: 'renovieren',      ru: 'ремонтировать (помещение)',           ipa: '[ʁenoˈviːʁən]', article: '' },
    { de: 'fällen',          ru: 'валить (дерево)',                    ipa: '[ˈfɛlən]',      article: '' },
    { de: 'abschließen',     ru: 'завершать',                          ipa: '[ˈapˌʃliːsn̩]', article: '' },
    { de: 'erledigen',       ru: 'выполнять (задачу)',                  ipa: '[ɛʁˈleːdɪɡn̩]', article: '' },
    { de: 'vergessen',       ru: 'забывать',                           ipa: '[fɛʁˈɡɛsn̩]',   article: '' },
    { de: 'der Vertrag',     ru: 'договор',                            ipa: '[fɛʁˈtʁaːk]',   article: 'der' },
    { de: 'die Prüfung',     ru: 'экзамен, проверка',                  ipa: '[ˈpʁyːfʊŋ]',    article: 'die' },
    { de: 'das Gebäude',     ru: 'здание',                             ipa: '[ɡəˈbɔɪ̯də]',   article: 'das' },
    { de: 'das Paket',       ru: 'посылка, пакет',                     ipa: '[paˈkeːt]',     article: 'das' },
    { de: 'der Sturm',       ru: 'буря, шторм',                        ipa: '[ʃtʊʁm]',       article: 'der' },
    { de: 'von',             ru: 'от, кем (исполнитель)',              ipa: '[fɔn]',         article: '' },
    { de: 'durch',           ru: 'через, посредством (причина)',       ipa: '[dʊʁç]',        article: '' },
    { de: 'das Vorgangspassiv', ru: 'пассив процесса (werden)',        ipa: '[ˈfoːɐ̯ɡaŋsˌpasiːf]',   article: 'das' },
    { de: 'das Zustandspassiv', ru: 'пассив состояния (sein)',         ipa: '[ˈt͡suːʃtant͡sˌpasiːf]', article: 'das' }
  ],

  grammar: [
    {
      title: '⚡ Vorgangspassiv — пассив процесса',
      body: 'Основная конструкция: <strong>werden + Partizip II</strong><br><br>' +
            'Präsens: <em>Das Buch <strong>wird gelesen</strong>.</em> — Книгу читают.<br>' +
            'Präteritum: <em>Das Buch <strong>wurde gelesen</strong>.</em> — Книгу читали.<br>' +
            'Perfekt: <em>Das Buch <strong>ist gelesen worden</strong>.</em> — Книгу прочитали.<br>' +
            'Futur I: <em>Das Buch <strong>wird gelesen werden</strong>.</em> — Книгу будут читать.<br><br>' +
            '⚠️ В Perfekt пассива: <em>worden</em> (не geworden!)',
      conjugation: [
        { pronoun: 'Präsens',    form: 'wird gelesen',        audio: 'wird gelesen',        translation: 'читают (сейчас)' },
        { pronoun: 'Präteritum', form: 'wurde gelesen',       audio: 'wurde gelesen',       translation: 'читали' },
        { pronoun: 'Perfekt',    form: 'ist gelesen worden',  audio: 'ist gelesen worden',  translation: 'прочитали' },
        { pronoun: 'Plusquam.',  form: 'war gelesen worden',  audio: 'war gelesen worden',  translation: 'было прочитано (до...)' },
        { pronoun: 'Futur I',    form: 'wird gelesen werden', audio: 'wird gelesen werden', translation: 'будут читать' },
        { pronoun: 'Modal',      form: 'muss gelesen werden', audio: 'muss gelesen werden', translation: 'должны читать' }
      ]
    },
    {
      title: '⚡ Zustandspassiv — пассив состояния',
      body: 'Конструкция: <strong>sein + Partizip II</strong>. Описывает <em>результирующее состояние</em>, а не процесс.<br><br>' +
            '<em>Die Tür <strong>ist geöffnet</strong>.</em> — Дверь открыта (= находится в открытом состоянии)<br>' +
            '<em>Der Tisch <strong>ist gedeckt</strong>.</em> — Стол накрыт.<br><br>' +
            'Сравни:<br>' +
            'Vorgangspassiv: <em>Die Tür <strong>wird geöffnet</strong>.</em> (кто-то открывает)<br>' +
            'Zustandspassiv: <em>Die Tür <strong>ist geöffnet</strong>.</em> (дверь уже открыта)'
    },
    {
      title: '💡 von vs. durch в пассиве',
      body: '<strong>von + Dativ</strong> — указывает на <em>живого исполнителя</em>:<br>' +
            '<em>Der Kuchen wird <strong>von meiner Mutter</strong> gebacken.</em><br><br>' +
            '<strong>durch + Akkusativ</strong> — указывает на <em>неживую причину или средство</em>:<br>' +
            '<em><strong>Durch den Sturm</strong> wurden Bäume gefällt.</em><br><br>' +
            'Если исполнитель не важен — ни <em>von</em>, ни <em>durch</em> не нужны:<br>' +
            '<em>Hier wird Deutsch gesprochen.</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Das Buch',           blank: 'wird',   after: 'gelesen.',                  translation: '— Книгу читают.',                      hintWord: 'wird',    hintRule: 'Präsens Passiv: werden (3 л. ед.ч.)' },
      { before: '— Das Haus',           blank: 'wurde',  after: 'gebaut.',                   translation: '— Дом был построен.',                  hintWord: 'wurde',   hintRule: 'Präteritum Passiv: wurde' },
      { before: '— Die Aufgabe ist',    blank: 'erledigt', after: 'worden.',                 translation: '— Задача была выполнена.',              hintWord: 'erledigt', hintRule: 'Perfekt Passiv: ist + Part.II + worden' },
      { before: '— Der Tisch ist',      blank: 'gedeckt', after: '.',                        translation: '— Стол накрыт.',                       hintWord: 'gedeckt', hintRule: 'Zustandspassiv: sein + Partizip II' },
      { before: '— Der Vertrag muss',   blank: 'unterzeichnet', after: 'werden.',            translation: '— Договор должен быть подписан.',      hintWord: 'unterzeichnet', hintRule: 'Modal + Partizip II + werden' },
      { before: '— Das Essen wird',     blank: 'von',    after: 'ihm zubereitet.',           translation: '— Еда готовится им.',                  hintWord: 'von',     hintRule: 'von + Dativ — живой исполнитель' },
      { before: '— Hier darf nicht',    blank: 'geraucht', after: 'werden.',                 translation: '— Здесь курить запрещено.',             hintWord: 'geraucht', hintRule: 'rauchen → geraucht (Partizip II)' },
      { before: '— Viele Bäume wurden', blank: 'durch',  after: 'den Sturm gefällt.',        translation: '— Много деревьев было повалено бурей.', hintWord: 'durch',   hintRule: 'durch + Akk. — неживая причина' }
    ],

    multipleChoice: [
      { question: 'Как образуется Präsens Passiv?',                      options: ['sein + Partizip II', 'werden + Partizip II', 'haben + Partizip II', 'ist + Infinitiv'],  correctIndex: 1 },
      { question: 'В чём разница Vorgangs- и Zustandspassiv?',           options: ['Ничем', 'werden vs. sein', 'haben vs. sein', 'wurden vs. wird'],                         correctIndex: 1 },
      { question: 'Partizip II от «bauen»?',                             options: ['gebaut', 'gebauen', 'baut', 'baute'],                                                    correctIndex: 0 },
      { question: '«Das Buch ist gelesen _____» — Perfekt Passiv?',      options: ['geworden', 'worden', 'wird', 'war'],                                                    correctIndex: 1 },
      { question: 'Кто указывается с «von»?',                            options: ['Неживой предмет', 'Живой исполнитель', 'Причина', 'Средство'],                          correctIndex: 1 },
      { question: 'Как перевести: «Hier wird Deutsch gesprochen»?',      options: ['Здесь говорили.', 'Здесь говорят по-немецки.', 'Здесь должны говорить.', 'Говорится.'], correctIndex: 1 },
      { question: 'Futur Passiv от «öffnen»?',                           options: ['wird geöffnet werden', 'wird öffnen', 'wird geöffnet', 'wurde geöffnet'],               correctIndex: 0 },
      { question: 'Что обозначает «durch» в пассиве?',                   options: ['Исполнитель', 'Цель', 'Неживая причина/средство', 'Место'],                            correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'wird gemacht',          ru: 'делают (сейчас)' },
      { id: 2, de: 'wurde gemacht',         ru: 'сделали (в прошлом)' },
      { id: 3, de: 'ist gemacht worden',    ru: 'было сделано (Perfekt)' },
      { id: 4, de: 'ist gedeckt',           ru: 'накрыт (состояние)' },
      { id: 5, de: 'muss gemacht werden',   ru: 'должны сделать' },
      { id: 6, de: 'von meiner Mutter',     ru: 'моей мамой (исполнитель)' },
      { id: 7, de: 'durch den Sturm',       ru: 'из-за бури (причина)' },
      { id: 8, de: 'darf nicht geraucht werden', ru: 'курить запрещено' }
    ],

    dictation: [
      { word: 'wird',          audio: 'wird' },
      { word: 'wurde',         audio: 'wurde' },
      { word: 'worden',        audio: 'worden' },
      { word: 'gelesen',       audio: 'gelesen' },
      { word: 'gebaut',        audio: 'gebaut' },
      { word: 'unterzeichnet', audio: 'unterzeichnet' },
      { word: 'repariert',     audio: 'repariert' },
      { word: 'Vertrag',       audio: 'Vertrag' }
    ]
  }
};
