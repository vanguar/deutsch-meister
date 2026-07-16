/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-11.js
   A2 · Урок 11: Medien und Handy — Медиа и смартфон
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-11',
  level: 'A2',
  unit:  11,
  title: 'Medien und Handy',
  subtitle: 'Медиа, смартфон и интернет',

  meta: {
    duration: '30–35 мин',
    wordCount: 20,
    xpReward: 120
  },

  phrases: [
    { de: 'Ich schaue jeden Abend Videos.',      ru: 'Я смотрю видео каждый вечер.',     note: 'schauen — смотреть; jeden Abend — каждый вечер', audio: 'Ich schaue jeden Abend Videos' },
    { de: 'Mein Handy ist kaputt.',              ru: 'Мой телефон сломан.',              note: 'das Handy — мобильный телефон; kaputt — сломанный', audio: 'Mein Handy ist kaputt' },
    { de: 'Der Akku ist leer.',                  ru: 'Батарея разряжена.',               note: 'der Akku — аккумулятор; leer — пустой', audio: 'Der Akku ist leer' },
    { de: 'Ich muss mein Handy aufladen.',       ru: 'Мне нужно зарядить телефон.',      note: 'aufladen — заряжать', audio: 'Ich muss mein Handy aufladen' },
    { de: 'Wie ist das WLAN-Passwort?',          ru: 'Какой пароль от вайфая?',          note: 'das WLAN — Wi-Fi; das Passwort — пароль', audio: 'Wie ist das WLAN-Passwort' },
    { de: 'Ich schicke dir eine Nachricht.',     ru: 'Я отправлю тебе сообщение.',       note: 'schicken — отправлять; die Nachricht — сообщение', audio: 'Ich schicke dir eine Nachricht' },
    { de: 'Hast du meine E-Mail bekommen?',      ru: 'Ты получил моё письмо?',           note: 'bekommen — получать', audio: 'Hast du meine E-Mail bekommen' },
    { de: 'Ich lade eine App herunter.',         ru: 'Я скачиваю приложение.',           note: 'herunterladen — скачивать', audio: 'Ich lade eine App herunter' },
    { de: 'Das Internet ist heute sehr langsam.', ru: 'Интернет сегодня очень медленный.', note: 'langsam — медленный', audio: 'Das Internet ist heute sehr langsam' },
    { de: 'Ich lese die Nachrichten online.',    ru: 'Я читаю новости онлайн.',          note: 'die Nachrichten — новости', audio: 'Ich lese die Nachrichten online' },
    { de: 'Er verbringt zu viel Zeit am Handy.', ru: 'Он проводит слишком много времени в телефоне.', note: 'Zeit verbringen — проводить время', audio: 'Er verbringt zu viel Zeit am Handy' },
    { de: 'Kannst du mir das Foto schicken?',    ru: 'Можешь отправить мне это фото?',   note: 'das Foto — фотография', audio: 'Kannst du mir das Foto schicken' },
    { de: 'Ich rufe dich später an.',            ru: 'Я позвоню тебе позже.',            note: 'anrufen — звонить (отделяемая приставка)', audio: 'Ich rufe dich später an' },
    { de: 'Mein Laptop ist schon alt.',          ru: 'Мой ноутбук уже старый.',          note: 'der Laptop — ноутбук', audio: 'Mein Laptop ist schon alt' },
    { de: 'Schalte bitte den Fernseher aus.',    ru: 'Выключи, пожалуйста, телевизор.',  note: 'ausschalten — выключать', audio: 'Schalte bitte den Fernseher aus' },
    { de: 'Ich höre gern Podcasts auf Deutsch.', ru: 'Я люблю слушать подкасты на немецком.', note: 'отличный способ учить язык!', audio: 'Ich höre gern Podcasts auf Deutsch' }
  ],

  vocabulary: [
    { de: 'das Handy',       ru: 'мобильный телефон',  ipa: '[ˈhɛndi]',          article: 'das' },
    { de: 'der Akku',        ru: 'аккумулятор',        ipa: '[ˈaku]',            article: 'der' },
    { de: 'das Passwort',    ru: 'пароль',             ipa: '[ˈpasvɔʁt]',        article: 'das' },
    { de: 'die Nachricht',   ru: 'сообщение',          ipa: '[ˈnaːxʁɪçt]',       article: 'die' },
    { de: 'die E-Mail',      ru: 'электронное письмо', ipa: '[ˈiːmeɪ̯l]',        article: 'die' },
    { de: 'die App',         ru: 'приложение',         ipa: '[ɛp]',              article: 'die' },
    { de: 'das Internet',    ru: 'интернет',           ipa: '[ˈɪntɐnɛt]',        article: 'das' },
    { de: 'der Laptop',      ru: 'ноутбук',            ipa: '[ˈlɛptɔp]',         article: 'der' },
    { de: 'der Fernseher',   ru: 'телевизор',          ipa: '[ˈfɛʁnˌzeːɐ]',      article: 'der' },
    { de: 'das Foto',        ru: 'фотография',         ipa: '[ˈfoːto]',          article: 'das' },
    { de: 'der Bildschirm',  ru: 'экран',              ipa: '[ˈbɪltˌʃɪʁm]',      article: 'der' },
    { de: 'schicken',        ru: 'отправлять',         ipa: '[ˈʃɪkn̩]',          article: '' },
    { de: 'bekommen',        ru: 'получать',           ipa: '[bəˈkɔmən]',        article: '' },
    { de: 'anrufen',         ru: 'звонить',            ipa: '[ˈanˌʁuːfn̩]',      article: '' },
    { de: 'aufladen',        ru: 'заряжать',           ipa: '[ˈaʊ̯fˌlaːdn̩]',    article: '' },
    { de: 'herunterladen',   ru: 'скачивать',          ipa: '[hɛˈʁʊntɐˌlaːdn̩]', article: '' },
    { de: 'ausschalten',     ru: 'выключать',          ipa: '[ˈaʊ̯sˌʃaltn̩]',    article: '' },
    { de: 'einschalten',     ru: 'включать',           ipa: '[ˈaɪ̯nˌʃaltn̩]',    article: '' },
    { de: 'kaputt',          ru: 'сломанный',          ipa: '[kaˈpʊt]',          article: '' },
    { de: 'langsam',         ru: 'медленный',          ipa: '[ˈlaŋzaːm]',        article: '' }
  ],

  grammar: [
    {
      title: '⚡ Техника и отделяемые приставки',
      body: 'Почти все «технические» глаголы — с отделяемыми приставками:<br><br>' +
            '<em>an|rufen → Ich rufe dich <strong>an</strong>.</em> — Я тебе позвоню.<br>' +
            '<em>auf|laden → Ich lade das Handy <strong>auf</strong>.</em> — Я заряжаю телефон.<br>' +
            '<em>aus|schalten → Schalte den Fernseher <strong>aus</strong>!</em> — Выключи телевизор!',
      conjugation: [
        { pronoun: 'anrufen',        form: 'Ich rufe dich an.',            audio: 'Ich rufe dich an',            translation: 'Я тебе позвоню.' },
        { pronoun: 'aufladen',       form: 'Ich lade das Handy auf.',      audio: 'Ich lade das Handy auf',      translation: 'Я заряжаю телефон.' },
        { pronoun: 'herunterladen',  form: 'Ich lade eine App herunter.',  audio: 'Ich lade eine App herunter',  translation: 'Я скачиваю приложение.' },
        { pronoun: 'ausschalten',    form: 'Ich schalte das Licht aus.',   audio: 'Ich schalte das Licht aus',   translation: 'Я выключаю свет.' },
        { pronoun: 'einschalten',    form: 'Ich schalte den Laptop ein.',  audio: 'Ich schalte den Laptop ein',  translation: 'Я включаю ноутбук.' }
      ]
    },
    {
      title: '⚡ Dativ + Akkusativ: кому что',
      body: 'С глаголами <strong>schicken, geben, zeigen</strong> сначала кому (Dativ), потом что (Akkusativ):<br><br>' +
            '<em>Ich schicke <strong>dir</strong> (кому) <strong>eine Nachricht</strong> (что).</em><br>' +
            '<em>Kannst du <strong>mir das Foto</strong> schicken?</em> — Можешь отправить мне фото?',
      conjugation: [
        { pronoun: 'мне',   form: 'Schick mir das Foto!',          audio: 'Schick mir das Foto',          translation: 'Отправь мне фото!' },
        { pronoun: 'тебе',  form: 'Ich schicke dir die Adresse.',  audio: 'Ich schicke dir die Adresse',  translation: 'Я отправлю тебе адрес.' },
        { pronoun: 'ему',   form: 'Ich gebe ihm mein Handy.',      audio: 'Ich gebe ihm mein Handy',      translation: 'Я даю ему свой телефон.' },
        { pronoun: 'ей',    form: 'Zeig ihr das Video!',           audio: 'Zeig ihr das Video',           translation: 'Покажи ей видео!' }
      ]
    },
    {
      title: '💡 anrufen vs telefonieren',
      body: 'Два способа «звонить»:<br><br>' +
            '<strong>anrufen + Akkusativ</strong> (кого): <em>Ich rufe <strong>dich</strong> an.</em><br>' +
            '<strong>telefonieren mit + Dativ</strong> (с кем): <em>Ich telefoniere <strong>mit dir</strong>.</em><br><br>' +
            'Оба переводятся «звонить», но управление разное!'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Der Akku ist',          blank: 'leer',       after: '.',                        translation: '— Батарея разряжена.',                hintWord: 'leer',       hintRule: 'leer — пустой' },
      { before: '— Ich muss mein Handy',   blank: 'aufladen',   after: '.',                        translation: '— Мне нужно зарядить телефон.',       hintWord: 'aufladen',   hintRule: 'aufladen — заряжать' },
      { before: '— Ich schicke',           blank: 'dir',        after: 'eine Nachricht.',          translation: '— Я отправлю тебе сообщение.',        hintWord: 'dir',        hintRule: 'кому → Dativ' },
      { before: '— Ich rufe dich später',  blank: 'an',         after: '.',                        translation: '— Я позвоню тебе позже.',             hintWord: 'an',         hintRule: 'anrufen — приставка в конец' },
      { before: '— Wie ist das WLAN-',     blank: 'Passwort',   after: '?',                        translation: '— Какой пароль от вайфая?',           hintWord: 'Passwort',   hintRule: 'das Passwort — пароль' },
      { before: '— Ich lade eine App',     blank: 'herunter',   after: '.',                        translation: '— Я скачиваю приложение.',            hintWord: 'herunter',   hintRule: 'herunterladen — скачивать' },
      { before: '— Schalte den Fernseher', blank: 'aus',        after: '.',                        translation: '— Выключи телевизор.',                hintWord: 'aus',        hintRule: 'ausschalten — выключать' },
      { before: '— Mein Handy ist',        blank: 'kaputt',     after: '.',                        translation: '— Мой телефон сломан.',               hintWord: 'kaputt',     hintRule: 'kaputt — сломанный' }
    ],

    multipleChoice: [
      { question: '«Das Handy» — это…',                        options: ['ноутбук', 'мобильный телефон', 'телевизор', 'планшет'],       correctIndex: 1 },
      { question: '«Der Akku ist leer» значит…',               options: ['телефон новый', 'батарея разряжена', 'экран разбит', 'нет сети'], correctIndex: 1 },
      { question: '«Herunterladen» значит…',                   options: ['загружать наверх', 'скачивать', 'удалять', 'обновлять'],      correctIndex: 1 },
      { question: '«Я тебе позвоню» — правильно…',             options: ['Ich anrufe dich.', 'Ich rufe dich an.', 'Ich rufe an dich.', 'Ich dich anrufe.'], correctIndex: 1 },
      { question: '«Telefonieren» используется с…',            options: ['Akkusativ', 'mit + Dativ', 'für + Akkusativ', 'zu + Dativ'],   correctIndex: 1 },
      { question: 'Противоположность «ausschalten»…',          options: ['aufladen', 'einschalten', 'herunterladen', 'anrufen'],         correctIndex: 1 },
      { question: '«Die Nachricht» — это…',                    options: ['ночь', 'сообщение', 'новость дня', 'газета'],                  correctIndex: 1 },
      { question: '«Langsam» значит…',                         options: ['быстрый', 'медленный', 'длинный', 'громкий'],                  correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'das Handy',      ru: 'мобильный телефон' },
      { id: 2, de: 'der Akku',       ru: 'аккумулятор' },
      { id: 3, de: 'die Nachricht',  ru: 'сообщение' },
      { id: 4, de: 'anrufen',        ru: 'звонить' },
      { id: 5, de: 'aufladen',       ru: 'заряжать' },
      { id: 6, de: 'herunterladen',  ru: 'скачивать' },
      { id: 7, de: 'kaputt',         ru: 'сломанный' },
      { id: 8, de: 'der Bildschirm', ru: 'экран' }
    ],

    dictation: [
      { word: 'Handy',      audio: 'Handy' },
      { word: 'Passwort',   audio: 'Passwort' },
      { word: 'Nachricht',  audio: 'Nachricht' },
      { word: 'Internet',   audio: 'Internet' },
      { word: 'anrufen',    audio: 'anrufen' },
      { word: 'aufladen',   audio: 'aufladen' },
      { word: 'kaputt',     audio: 'kaputt' },
      { word: 'Fernseher',  audio: 'Fernseher' }
    ]
  }
};
