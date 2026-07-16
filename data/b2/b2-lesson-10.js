/* ═══════════════════════════════════════════════
   data/b2/b2-lesson-10.js
   B2 · Урок 10: Nomen-Verb-Verbindungen — устойчивые глагольные сочетания
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b2-10',
  level:    'B2',
  unit:     10,
  title:    'Nomen-Verb-Verbindungen',
  subtitle: 'Устойчивые сочетания · eine Entscheidung treffen, in Frage kommen',

  meta: {
    duration:  '40–45 мин',
    wordCount: 20,
    xpReward:  200
  },

  phrases: [
    { de: 'Wir müssen endlich eine Entscheidung treffen.',      ru: 'Мы должны наконец принять решение.',               note: 'eine Entscheidung treffen = entscheiden', audio: 'Wir müssen endlich eine Entscheidung treffen' },
    { de: 'Er hat auf die Frage keine Antwort gegeben.',        ru: 'Он не дал ответа на вопрос.',                      note: 'eine Antwort geben = antworten', audio: 'Er hat auf die Frage keine Antwort gegeben' },
    { de: 'Das Gespräch hat gestern Abend stattgefunden.',      ru: 'Разговор состоялся вчера вечером.',                note: 'stattfinden — состояться', audio: 'Das Gespräch hat gestern Abend stattgefunden' },
    { de: 'Diese Lösung kommt für uns nicht in Frage.',         ru: 'Это решение для нас исключено.',                   note: 'in Frage kommen — рассматриваться', audio: 'Diese Lösung kommt für uns nicht in Frage' },
    { de: 'Sie hat großen Einfluss auf die Entscheidung genommen.', ru: 'Она оказала большое влияние на решение.',      note: 'Einfluss nehmen auf = beeinflussen', audio: 'Sie hat großen Einfluss auf die Entscheidung genommen' },
    { de: 'Der neue Plan wird nächste Woche in Kraft treten.',  ru: 'Новый план вступит в силу на следующей неделе.',   note: 'in Kraft treten — вступить в силу', audio: 'Der neue Plan wird nächste Woche in Kraft treten' },
    { de: 'Wir sollten seine Warnung in Betracht ziehen.',      ru: 'Нам следует принять во внимание его предупреждение.', note: 'in Betracht ziehen — учесть', audio: 'Wir sollten seine Warnung in Betracht ziehen' },
    { de: 'Ich stehe Ihnen gern zur Verfügung.',                ru: 'Я охотно в вашем распоряжении.',                   note: 'zur Verfügung stehen', audio: 'Ich stehe Ihnen gern zur Verfügung' },
    { de: 'Die Firma stellt uns einen Wagen zur Verfügung.',    ru: 'Фирма предоставляет нам автомобиль.',              note: 'zur Verfügung stellen — предоставить', audio: 'Die Firma stellt uns einen Wagen zur Verfügung' },
    { de: 'Er hat endlich Abschied von seinen Kollegen genommen.', ru: 'Он наконец попрощался с коллегами.',            note: 'Abschied nehmen von = sich verabschieden', audio: 'Er hat endlich Abschied von seinen Kollegen genommen' },
    { de: 'Die Polizei hat den Fall in Angriff genommen.',      ru: 'Полиция взялась за это дело.',                     note: 'in Angriff nehmen — приступить', audio: 'Die Polizei hat den Fall in Angriff genommen' },
    { de: 'Seine Worte haben mich tief in Erstaunen versetzt.', ru: 'Его слова глубоко удивили меня.',                  note: 'in Erstaunen versetzen — изумить', audio: 'Seine Worte haben mich tief in Erstaunen versetzt' },
    { de: 'Bitte nehmen Sie Platz!',                            ru: 'Пожалуйста, присаживайтесь!',                      note: 'Platz nehmen = sich setzen', audio: 'Bitte nehmen Sie Platz' },
    { de: 'Sie hat von dem Angebot Gebrauch gemacht.',          ru: 'Она воспользовалась предложением.',                note: 'Gebrauch machen von = benutzen', audio: 'Sie hat von dem Angebot Gebrauch gemacht' },
    { de: 'Das Thema Umwelt spielt heute eine wichtige Rolle.', ru: 'Тема экологии играет сегодня важную роль.',        note: 'eine Rolle spielen', audio: 'Das Thema Umwelt spielt heute eine wichtige Rolle' },
    { de: 'Ich möchte zunächst einige Fragen stellen.',         ru: 'Сначала я хотел бы задать несколько вопросов.',    note: 'eine Frage stellen = fragen', audio: 'Ich möchte zunächst einige Fragen stellen' },
    { de: 'Der Arzt hat den Patienten unter Druck gesetzt.',    ru: 'Врач оказал давление на пациента.',                note: 'unter Druck setzen', audio: 'Der Arzt hat den Patienten unter Druck gesetzt' },
    { de: 'Die Verhandlungen sind gestern zum Abschluss gekommen.', ru: 'Переговоры вчера завершились.',                note: 'zum Abschluss kommen = enden', audio: 'Die Verhandlungen sind gestern zum Abschluss gekommen' },
    { de: 'Wir nehmen Rücksicht auf die Wünsche unserer Kunden.', ru: 'Мы считаемся с пожеланиями наших клиентов.',     note: 'Rücksicht nehmen auf', audio: 'Wir nehmen Rücksicht auf die Wünsche unserer Kunden' },
    { de: 'Sein Vorschlag ist bei allen auf Kritik gestoßen.',  ru: 'Его предложение встретило всеобщую критику.',      note: 'auf Kritik stoßen', audio: 'Sein Vorschlag ist bei allen auf Kritik gestoßen' }
  ],

  vocabulary: [
    { de: 'eine Entscheidung treffen', ru: 'принять решение',           ipa: '[ɛntˈʃaɪ̯dʊŋ ˈtʁɛfn̩]', article: '' },
    { de: 'eine Frage stellen',        ru: 'задать вопрос',             ipa: '[ˈfʁaːɡə ˈʃtɛlən]',     article: '' },
    { de: 'eine Antwort geben',        ru: 'дать ответ',                ipa: '[ˈantvɔʁt ˈɡeːbn̩]',    article: '' },
    { de: 'eine Rolle spielen',        ru: 'играть роль',               ipa: '[ˈʁɔlə ˈʃpiːlən]',      article: '' },
    { de: 'stattfinden',               ru: 'состояться',                ipa: '[ˈʃtatˌfɪndn̩]',        article: '' },
    { de: 'in Frage kommen',           ru: 'рассматриваться как вариант', ipa: '[ɪn ˈfʁaːɡə]',        article: '' },
    { de: 'in Kraft treten',           ru: 'вступить в силу',           ipa: '[ɪn kʁaft ˈtʁeːtn̩]',   article: '' },
    { de: 'in Betracht ziehen',        ru: 'принять во внимание',       ipa: '[ɪn bəˈtʁaxt ˈt͡siːən]', article: '' },
    { de: 'in Angriff nehmen',         ru: 'приступить, взяться за',    ipa: '[ɪn ˈanɡʁɪf ˈneːmən]',  article: '' },
    { de: 'zur Verfügung stehen',      ru: 'быть в распоряжении',       ipa: '[t͡suːɐ̯ fɛʁˈfyːɡʊŋ]',  article: '' },
    { de: 'zur Verfügung stellen',     ru: 'предоставить',              ipa: '[fɛʁˈfyːɡʊŋ ˈʃtɛlən]',  article: '' },
    { de: 'Abschied nehmen von',       ru: 'прощаться с',               ipa: '[ˈapʃiːt ˈneːmən]',     article: '' },
    { de: 'Platz nehmen',              ru: 'присесть',                  ipa: '[plat͡s ˈneːmən]',      article: '' },
    { de: 'Gebrauch machen von',       ru: 'воспользоваться',           ipa: '[ɡəˈbʁaʊ̯x ˈmaxn̩]',    article: '' },
    { de: 'Rücksicht nehmen auf',      ru: 'считаться с',               ipa: '[ˈʁʏkzɪçt ˈneːmən]',    article: '' },
    { de: 'unter Druck setzen',        ru: 'оказывать давление',        ipa: '[ˈʊntɐ dʁʊk ˈzɛt͡sn̩]', article: '' },
    { de: 'zum Abschluss kommen',      ru: 'завершиться',               ipa: '[t͡sʊm ˈapʃlʊs]',       article: '' },
    { de: 'auf Kritik stoßen',         ru: 'встретить критику',         ipa: '[aʊ̯f kʁiˈtiːk ˈʃtoːsn̩]', article: '' },
    { de: 'Einfluss nehmen auf',       ru: 'влиять на',                 ipa: '[ˈaɪ̯nflʊs ˈneːmən]',   article: '' },
    { de: 'die Verhandlung',           ru: 'переговоры',                ipa: '[fɛʁˈhandlʊŋ]',         article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Что такое Nomen-Verb-Verbindung?',
      body: 'Это устойчивая связка «существительное + глагол», где глагол почти теряет своё значение, а смысл несёт существительное:<br><br>' +
            '<em>eine Entscheidung <strong>treffen</strong></em> — не «встретить решение», а <strong>принять</strong> решение (= entscheiden)<br>' +
            '<em>eine Frage <strong>stellen</strong></em> — не «поставить», а <strong>задать</strong> вопрос (= fragen)<br><br>' +
            'Такие связки — признак формального стиля (B2/C1): в докладах, письмах, новостях они звучат солиднее простого глагола.',
      conjugation: [
        { pronoun: 'treffen', form: 'eine Entscheidung treffen',   audio: 'eine Entscheidung treffen',   translation: '= entscheiden (решить)' },
        { pronoun: 'stellen', form: 'eine Frage stellen',          audio: 'eine Frage stellen',          translation: '= fragen (спросить)' },
        { pronoun: 'geben',   form: 'eine Antwort geben',          audio: 'eine Antwort geben',          translation: '= antworten (ответить)' },
        { pronoun: 'nehmen',  form: 'Abschied nehmen',             audio: 'Abschied nehmen',             translation: '= sich verabschieden (попрощаться)' },
        { pronoun: 'machen',  form: 'Gebrauch machen von',         audio: 'Gebrauch machen von',         translation: '= benutzen (воспользоваться)' }
      ]
    },
    {
      title: '⚡ Связки с предлогами: in, zur, unter, auf',
      body: 'Вторая группа — «предлог + существительное + глагол». Их нужно заучивать целиком:<br><br>' +
            '<strong>in Frage kommen</strong> — рассматриваться · <strong>in Kraft treten</strong> — вступить в силу · <strong>in Betracht ziehen</strong> — учесть · <strong>in Angriff nehmen</strong> — взяться за<br>' +
            '<strong>zur Verfügung stehen/stellen</strong> — быть в распоряжении / предоставить<br>' +
            '<strong>unter Druck setzen/stehen</strong> — давить / быть под давлением<br>' +
            '<strong>auf Kritik stoßen</strong> — встретить критику',
      conjugation: [
        { pronoun: 'in',    form: 'Das kommt nicht in Frage!',        audio: 'Das kommt nicht in Frage',        translation: 'Об этом не может быть и речи!' },
        { pronoun: 'in',    form: 'Das Gesetz tritt in Kraft.',       audio: 'Das Gesetz tritt in Kraft',       translation: 'Закон вступает в силу.' },
        { pronoun: 'zur',   form: 'Ich stehe zur Verfügung.',         audio: 'Ich stehe zur Verfügung',         translation: 'Я в распоряжении.' },
        { pronoun: 'unter', form: 'Er steht unter Druck.',            audio: 'Er steht unter Druck',            translation: 'Он под давлением.' },
        { pronoun: 'auf',   form: 'Der Plan stößt auf Kritik.',       audio: 'Der Plan stößt auf Kritik',       translation: 'План встречает критику.' }
      ]
    },
    {
      title: '💡 Как учить и где использовать',
      body: 'Три совета:<br><br>' +
            '<strong>1.</strong> Учи связку как одно слово, с артиклем и предлогом: <em>Rücksicht nehmen <strong>auf + A</strong></em>.<br>' +
            '<strong>2.</strong> Запоминай «глагольный скелет»: чаще всего это <em>treffen, stellen, geben, nehmen, machen, kommen, stehen, ziehen</em>.<br>' +
            '<strong>3.</strong> В разговоре можно проще (<em>fragen</em> вместо <em>eine Frage stellen</em>), но в письме B2 и на экзамене связки дают стилевые баллы.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wir müssen eine Entscheidung', blank: 'treffen', after: '.',                     translation: '— Мы должны принять решение.',            hintWord: 'treffen',  hintRule: 'Entscheidung + treffen' },
      { before: '— Darf ich eine Frage',   blank: 'stellen',  after: '?',                           translation: '— Можно задать вопрос?',                  hintWord: 'stellen',  hintRule: 'Frage + stellen' },
      { before: '— Das kommt nicht in',    blank: 'Frage',    after: '!',                           translation: '— Об этом не может быть и речи!',         hintWord: 'Frage',    hintRule: 'in Frage kommen' },
      { before: '— Das Gesetz tritt morgen in', blank: 'Kraft', after: '.',                        translation: '— Закон вступает в силу завтра.',          hintWord: 'Kraft',    hintRule: 'in Kraft treten' },
      { before: '— Ich stehe Ihnen zur',   blank: 'Verfügung', after: '.',                          translation: '— Я в вашем распоряжении.',                hintWord: 'Verfügung', hintRule: 'zur Verfügung stehen' },
      { before: '— Bitte nehmen Sie',      blank: 'Platz',    after: '!',                           translation: '— Пожалуйста, присаживайтесь!',            hintWord: 'Platz',    hintRule: 'Platz nehmen = sich setzen' },
      { before: '— Geld spielt keine',     blank: 'Rolle',    after: '.',                           translation: '— Деньги не имеют значения.',              hintWord: 'Rolle',    hintRule: 'eine Rolle spielen' },
      { before: '— Wir nehmen Rücksicht',  blank: 'auf',      after: 'die Kunden.',                 translation: '— Мы считаемся с клиентами.',              hintWord: 'auf',      hintRule: 'Rücksicht nehmen auf + A' }
    ],

    multipleChoice: [
      { question: '«Принять решение» — eine Entscheidung …',           options: ['machen', 'nehmen', 'treffen', 'geben'],                            correctIndex: 2 },
      { question: '«Задать вопрос» — eine Frage …',                    options: ['fragen', 'stellen', 'setzen', 'legen'],                            correctIndex: 1 },
      { question: '«in Kraft treten» значит…',                         options: ['набраться сил', 'вступить в силу', 'войти в форму', 'приступить'], correctIndex: 1 },
      { question: '«Das kommt nicht in Frage» значит…',                options: ['это не вопрос', 'об этом не может быть и речи', 'это не спрашивают', 'вопрос не задан'], correctIndex: 1 },
      { question: '«предоставить» — zur Verfügung …',                  options: ['stehen', 'stellen', 'setzen', 'kommen'],                           correctIndex: 1 },
      { question: '«попрощаться» — Abschied …',                        options: ['machen von', 'nehmen von', 'geben von', 'treffen von'],            correctIndex: 1 },
      { question: '«Sein Plan stößt auf …» (встретил критику)',        options: ['Kritik', 'Druck', 'Frage', 'Rolle'],                               correctIndex: 0 },
      { question: 'Nomen-Verb-Verbindungen типичны для…',              options: ['детской речи', 'формального стиля', 'диалекта', 'сленга'],         correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'eine Entscheidung treffen', ru: 'принять решение' },
      { id: 2, de: 'in Frage kommen',           ru: 'рассматриваться' },
      { id: 3, de: 'in Kraft treten',           ru: 'вступить в силу' },
      { id: 4, de: 'zur Verfügung stehen',      ru: 'быть в распоряжении' },
      { id: 5, de: 'in Betracht ziehen',        ru: 'принять во внимание' },
      { id: 6, de: 'Rücksicht nehmen auf',      ru: 'считаться с' },
      { id: 7, de: 'unter Druck setzen',        ru: 'оказывать давление' },
      { id: 8, de: 'eine Rolle spielen',        ru: 'играть роль' }
    ],

    dictation: [
      { word: 'Entscheidung',  audio: 'Entscheidung' },
      { word: 'Verfügung',     audio: 'Verfügung' },
      { word: 'Abschied',      audio: 'Abschied' },
      { word: 'Betracht',      audio: 'Betracht' },
      { word: 'Rücksicht',     audio: 'Rücksicht' },
      { word: 'Einfluss',      audio: 'Einfluss' },
      { word: 'Verhandlung',   audio: 'Verhandlung' },
      { word: 'stattfinden',   audio: 'stattfinden' }
    ]
  }
};
