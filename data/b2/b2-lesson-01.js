/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-01.js
   B2 · Урок 1: Partizipialkonstruktionen — Причастные обороты
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-01',
  level:    'B2',
  unit:     1,
  title:    'Partizipialkonstruktionen',
  subtitle: 'Причастные обороты · Partizip I и II как замена придаточных',

  meta: {
    duration:  '40–45 мин',
    wordCount: 24,
    xpReward:  200
  },

  phrases: [
    { de: 'Das singend­e Kind ist meine Tochter.',               ru: 'Поющая девочка — моя дочь.',                      note: 'Partizip I (Präsens): singen → singend', audio: 'Das singende Kind ist meine Tochter' },
    { de: 'Der schlafende Hund bellt nicht.',                    ru: 'Спящая собака не лает.',                          note: 'schlafend — причастие I от schlafen', audio: 'Der schlafende Hund bellt nicht' },
    { de: 'Das gelesene Buch liegt auf dem Tisch.',              ru: 'Прочитанная книга лежит на столе.',               note: 'Partizip II (Vergangenheit): gelesen', audio: 'Das gelesene Buch liegt auf dem Tisch' },
    { de: 'Der reparierte Wagen fährt wieder.',                  ru: 'Отремонтированная машина снова ездит.',           note: 'repariert — причастие II от reparieren', audio: 'Der reparierte Wagen fährt wieder' },
    { de: 'Die auf dem Tisch liegende Zeitung ist alt.',         ru: 'Лежащая на столе газета старая.',                 note: 'Расширенное причастие I — замена Relativsatz', audio: 'Die auf dem Tisch liegende Zeitung ist alt' },
    { de: 'Der von ihr geschriebene Brief war wunderschön.',     ru: 'Написанное ею письмо было прекрасным.',           note: 'Расширенное Partizip II — замена Passiv-Relativsatz', audio: 'Der von ihr geschriebene Brief war wunderschön' },
    { de: 'In der Zeitung stand ein erschreckend­er Bericht.',   ru: 'В газете был пугающий репортаж.',                 note: 'erschreckend — причастие I = прилагательное', audio: 'In der Zeitung stand ein erschreckender Bericht' },
    { de: 'Das gestern gekaufte Brot schmeckt gut.',             ru: 'Купленный вчера хлеб вкусный.',                   note: 'Расширенный оборот с наречием', audio: 'Das gestern gekaufte Brot schmeckt gut' },
    { de: 'Die wartenden Passagiere wurden informiert.',         ru: 'Ожидающих пассажиров проинформировали.',          note: 'wartend → wartenden (Dativ Plural)', audio: 'Die wartenden Passagiere wurden informiert' },
    { de: 'Eine abwechslungsreiche, gut bezahlte Stelle.',       ru: 'Разнообразная, хорошо оплачиваемая должность.',  note: 'gut bezahlt — причастие II с наречием = хорошо оплачиваемый', audio: 'Eine abwechslungsreiche, gut bezahlte Stelle' },
    { de: 'Der steigende Meeresspiegel ist besorgniserregend.',  ru: 'Растущий уровень моря вызывает беспокойство.',   note: 'steigend — Partizip I от steigen', audio: 'Der steigende Meeresspiegel ist besorgniserregend' },
    { de: 'Das im Laden verkaufte Produkt ist günstig.',         ru: 'Продаваемый в магазине товар недорогой.',         note: 'im Laden verkauft — Passiv-Partizip II', audio: 'Das im Laden verkaufte Produkt ist günstig' },
    { de: 'Mit dem Zug fahrend, konnte er lesen.',               ru: 'Едя на поезде, он мог читать.',                   note: 'Partizip I = деепричастие (одновременность)', audio: 'Mit dem Zug fahrend, konnte er lesen' },
    { de: 'Das längst vergessene Gedicht wurde entdeckt.',       ru: 'Давно забытое стихотворение было обнаружено.',   note: 'längst vergessen — Partizip II с наречием', audio: 'Das längst vergessene Gedicht wurde entdeckt' },
    { de: 'Die ankommenden Züge haben Verspätung.',              ru: 'Прибывающие поезда опаздывают.',                  note: 'ankommen → ankommend', audio: 'Die ankommenden Züge haben Verspätung' },
    { de: 'Das vom Staat finanzierte Projekt läuft gut.',        ru: 'Финансируемый государством проект идёт хорошо.', note: 'vom Staat finanziert — агент пассива', audio: 'Das vom Staat finanzierte Projekt läuft gut' },
    { de: 'Ein wachsendes Bewusstsein für Umweltschutz.',        ru: 'Растущее осознание важности защиты природы.',    note: 'wachsend — Partizip I от wachsen', audio: 'Ein wachsendes Bewusstsein für Umweltschutz' },
    { de: 'Der gut gemeinte Rat half nicht.',                    ru: 'Добрый по замыслу совет не помог.',               note: 'gut gemeint — Partizip II от gut meinen', audio: 'Der gut gemeinte Rat half nicht' },
    { de: 'Das Partizip I drückt Gleichzeitigkeit aus.',         ru: 'Причастие I выражает одновременность.',           note: 'Gleichzeitigkeit — одновременность', audio: 'Das Partizip I drückt Gleichzeitigkeit aus' },
    { de: 'Das Partizip II drückt Vorzeitigkeit aus.',           ru: 'Причастие II выражает предшествование.',          note: 'Vorzeitigkeit — предшествование', audio: 'Das Partizip II drückt Vorzeitigkeit aus' },
    { de: 'Die zerstörten Häuser wurden wieder aufgebaut.',      ru: 'Разрушенные дома были отстроены заново.',        note: 'zerstört — Partizip II от zerstören', audio: 'Die zerstörten Häuser wurden wieder aufgebaut' },
    { de: 'Ein bekannter Schriftsteller las aus seinem Buch.',   ru: 'Известный писатель читал из своей книги.',       note: 'bekannt — Partizip II → прилагательное', audio: 'Ein bekannter Schriftsteller las aus seinem Buch' },
    { de: 'Das neu eröffnete Restaurant ist sehr beliebt.',      ru: 'Недавно открывшийся ресторан очень популярен.',  note: 'neu eröffnet — Partizip II с наречием', audio: 'Das neu eröffnete Restaurant ist sehr beliebt' },
    { de: 'Der vor einer Stunde angekommene Zug ist leer.',      ru: 'Поезд, прибывший час назад, пустой.',            note: 'vor einer Stunde angekommene — расширенный оборот', audio: 'Der vor einer Stunde angekommene Zug ist leer' }
  ],

  vocabulary: [
    { de: 'das Partizip I',         ru: 'причастие I (Präsens)',       ipa: '[paʁˈtiːtsɪp]',     article: 'das' },
    { de: 'das Partizip II',        ru: 'причастие II (Präteritum)',   ipa: '[paʁˈtiːtsɪp]',     article: 'das' },
    { de: 'singend',                ru: 'поющий',                      ipa: '[ˈzɪŋənt]',          article: '' },
    { de: 'schlafend',              ru: 'спящий',                      ipa: '[ˈʃlaːfənt]',        article: '' },
    { de: 'gelesen',                ru: 'прочитанный',                 ipa: '[ɡəˈleːzn̩]',        article: '' },
    { de: 'repariert',              ru: 'отремонтированный',           ipa: '[ʁepaˈʁiːɐ̯t]',      article: '' },
    { de: 'erschreckend',           ru: 'пугающий',                    ipa: '[ɛʁˈʃʁɛkn̩t]',       article: '' },
    { de: 'wachsend',               ru: 'растущий',                    ipa: '[ˈvaksn̩t]',          article: '' },
    { de: 'steigend',               ru: 'поднимающийся',               ipa: '[ˈʃtaɪ̯ɡn̩t]',        article: '' },
    { de: 'ankommend',              ru: 'прибывающий',                 ipa: '[ˈankɔmn̩t]',         article: '' },
    { de: 'die Gleichzeitigkeit',   ru: 'одновременность',             ipa: '[ˈɡlaɪ̯çtsaɪ̯tɪçkaɪ̯t]', article: 'die' },
    { de: 'die Vorzeitigkeit',      ru: 'предшествование',             ipa: '[ˈfoːɐ̯tsaɪ̯tɪçkaɪ̯t]', article: 'die' },
    { de: 'der Relativsatz',        ru: 'придаточное определительное', ipa: '[ʁelaˈtiːfzats]',    article: 'der' },
    { de: 'zerstören',              ru: 'разрушать',                   ipa: '[tsɛʁˈʃtøːʁən]',     article: '' },
    { de: 'finanzieren',            ru: 'финансировать',               ipa: '[finanˈtsiːʁən]',     article: '' },
    { de: 'entdecken',              ru: 'обнаруживать',                ipa: '[ɛntˈdɛkn̩]',         article: '' },
    { de: 'das Bewusstsein',        ru: 'осознание, сознание',         ipa: '[bəˈvʊstzaɪ̯n]',      article: 'das' },
    { de: 'besorgniserregend',      ru: 'вызывающий беспокойство',     ipa: '[bəˈzɔʁɡnɪsˌɛʁeːɡn̩t]', article: '' },
    { de: 'abwechslungsreich',      ru: 'разнообразный',               ipa: '[ˈapvɛkslʊŋsˌʁaɪ̯ç]', article: '' },
    { de: 'gut gemeint',            ru: 'добрый по намерению',         ipa: '[ɡuːt ɡəˈmaɪ̯nt]',    article: '' },
    { de: 'beliebt',                ru: 'популярный',                  ipa: '[bəˈliːpt]',          article: '' },
    { de: 'eröffnen',               ru: 'открывать (заведение)',       ipa: '[ɛʁˈœfnən]',          article: '' },
    { de: 'aufbauen',               ru: 'строить, отстраивать',        ipa: '[ˈaʊ̯fˌbaʊ̯ən]',       article: '' },
    { de: 'der Schriftsteller',     ru: 'писатель',                    ipa: '[ˈʃʁɪftˌʃtɛlɐ]',     article: 'der' }
  ],

  grammar: [
    {
      title: '⚡ Partizip I — образование и употребление',
      body: '<strong>Partizip I</strong> = Infinitiv + <strong>-d</strong>. Как прилагательное добавляет окончание согласно падежу.<br><br>' +
            '<em>schlafen → schlafend → der <strong>schlafende</strong> Hund</em><br>' +
            '<em>lesen → lesend → das <strong>lesende</strong> Kind</em><br><br>' +
            'Выражает <strong>одновременность</strong> с действием в главном предложении.<br>' +
            'Заменяет придаточное: <em>der Hund, der schläft</em> → <em>der <strong>schlafende</strong> Hund</em><br><br>' +
            '⚠️ Характерно для <em>письменного</em> немецкого. В речи чаще используют Relativsatz.',
      conjugation: [
        { pronoun: 'singen',    form: 'singend-',    audio: 'singend',    translation: 'поющий/-ая/-ее' },
        { pronoun: 'schlafen',  form: 'schlafend-',  audio: 'schlafend',  translation: 'спящий/-ая/-ее' },
        { pronoun: 'wachsen',   form: 'wachsend-',   audio: 'wachsend',   translation: 'растущий/-ая/-ее' },
        { pronoun: 'steigen',   form: 'steigend-',   audio: 'steigend',   translation: 'поднимающийся/-аяся' },
        { pronoun: 'ankommen',  form: 'ankommend-',  audio: 'ankommend',  translation: 'прибывающий/-ая' },
        { pronoun: 'warten',    form: 'wartend-',    audio: 'wartend',    translation: 'ожидающий/-ая' }
      ]
    },
    {
      title: '⚡ Расширенный причастный оборот (erweitertes Partizip)',
      body: 'В немецком языке причастие может расширяться дополнениями и обстоятельствами, стоя <strong>перед</strong> существительным:<br><br>' +
            '<em>Die [auf dem Tisch liegende] Zeitung ist alt.</em><br>' +
            '(Газета, лежащая на столе, старая.)<br><br>' +
            '<em>Der [von ihr geschriebene] Brief war schön.</em><br>' +
            '(Письмо, написанное ею, было красивым.)<br><br>' +
            'Структура: [обстоятельства + причастие] + существительное.<br>' +
            'Порядок чтения: существительное → причастие → обстоятельства (читается «наизнанку» по-русски).'
    },
    {
      title: '💡 Partizip II — прилагательное и страдательный оборот',
      body: '<strong>Partizip II как прилагательное</strong> — выражает завершённость / пассивность:<br><br>' +
            '<em>das <strong>gelesene</strong> Buch</em> — прочитанная книга (пассивный результат)<br>' +
            '<em>der <strong>reparierte</strong> Wagen</em> — отремонтированная машина<br><br>' +
            'Расширенный оборот с Partizip II заменяет пассивное придаточное:<br>' +
            '<em>das Buch, das gelesen wurde</em> → <em>das <strong>gelesene</strong> Buch</em>'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Das',          blank: 'singende',     after: 'Kind ist meine Tochter.',        translation: '— Поющая девочка — моя дочь.',              hintWord: 'singende',     hintRule: 'Partizip I: singen → singende (Nom. Neut.)' },
      { before: '— Das',          blank: 'gelesene',     after: 'Buch liegt auf dem Tisch.',      translation: '— Прочитанная книга лежит на столе.',       hintWord: 'gelesene',     hintRule: 'Partizip II: lesen → gelesen → gelesene' },
      { before: '— Der',          blank: 'schlafende',   after: 'Hund bellt nicht.',              translation: '— Спящая собака не лает.',                  hintWord: 'schlafende',   hintRule: 'schlafen → schlafende (Nom. Mask.)' },
      { before: '— Die',          blank: 'ankommenden',  after: 'Züge haben Verspätung.',         translation: '— Прибывающие поезда опаздывают.',          hintWord: 'ankommenden',  hintRule: 'ankommen → ankommend → -en (Nom. Pl.)' },
      { before: '— Ein',          blank: 'wachsendes',   after: 'Bewusstsein ist nötig.',         translation: '— Необходимо растущее осознание.',          hintWord: 'wachsendes',   hintRule: 'wachsen → wachsend → -es (Nom. Neut.)' },
      { before: '— Die',          blank: 'zerstörten',   after: 'Häuser wurden aufgebaut.',       translation: '— Разрушенные дома отстроены заново.',      hintWord: 'zerstörten',   hintRule: 'zerstören → zerstört → -en (Nom. Pl.)' },
      { before: '— Das neu',      blank: 'eröffnete',    after: 'Restaurant ist beliebt.',        translation: '— Новый ресторан очень популярен.',         hintWord: 'eröffnete',    hintRule: 'eröffnen → eröffnet → -e (Nom. Neut.)' },
      { before: '— Der gut',      blank: 'gemeinte',     after: 'Rat half nicht.',                translation: '— Добрый совет не помог.',                  hintWord: 'gemeinte',     hintRule: 'meinen → gemeint → -e (Nom. Mask.)' }
    ],

    multipleChoice: [
      { question: 'Partizip I образуется как…',                          options: ['Infinitiv + -t', 'Infinitiv + -d', 'Stamm + -end', 'ge- + Stamm + -t'], correctIndex: 1 },
      { question: 'Partizip I выражает…',                                 options: ['завершённость', 'одновременность', 'предшествование', 'будущее'],      correctIndex: 1 },
      { question: '«schlafend» — это Partizip…',                          options: ['I', 'II', 'Futur', 'Passiv'],                                           correctIndex: 0 },
      { question: '«gelesen» — это Partizip…',                            options: ['I', 'II', 'Futur', 'Präsens'],                                          correctIndex: 1 },
      { question: 'Как по-немецки «поющая девушка»?',                     options: ['die singende Frau', 'die gesungene Frau', 'die Frau singen', 'die singen Frau'], correctIndex: 0 },
      { question: 'Расширенный причастный оборот стоит…',                  options: ['после существительного', 'перед существительным', 'в конце', 'в начале предложения'], correctIndex: 1 },
      { question: 'Partizip II от «reparieren»:',                          options: ['reparierend', 'repariert', 'gerepariert', 'reparieren'],               correctIndex: 1 },
      { question: '«Das gelesene Buch» заменяет…',                        options: ['das Buch, das liest', 'das Buch, das gelesen wurde', 'das lesende Buch', 'das Buch lesen'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'singend',         ru: 'поющий (Partizip I)' },
      { id: 2, de: 'gelesen',         ru: 'прочитанный (Partizip II)' },
      { id: 3, de: 'schlafend',       ru: 'спящий' },
      { id: 4, de: 'repariert',       ru: 'отремонтированный' },
      { id: 5, de: 'wachsend',        ru: 'растущий' },
      { id: 6, de: 'zerstört',        ru: 'разрушенный' },
      { id: 7, de: 'Gleichzeitigkeit', ru: 'одновременность' },
      { id: 8, de: 'Vorzeitigkeit',   ru: 'предшествование' }
    ],

    dictation: [
      { word: 'Partizip',       audio: 'Partizip' },
      { word: 'singend',        audio: 'singend' },
      { word: 'schlafend',      audio: 'schlafend' },
      { word: 'gelesen',        audio: 'gelesen' },
      { word: 'zerstört',       audio: 'zerstört' },
      { word: 'wachsend',       audio: 'wachsend' },
      { word: 'Bewusstsein',    audio: 'Bewusstsein' },
      { word: 'Gleichzeitigkeit', audio: 'Gleichzeitigkeit' }
    ]
  }
};
