/* ═══════════════════════════════════════════════
   data/a1/a1-lesson-09.js
   A1 · Урок 9: Der Körper — Части тела
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-09',
  level: 'A1',
  unit:  9,
  title: 'Der Körper',
  subtitle: 'Части тела и внешность',

  meta: {
    duration: '25–30 мин',
    wordCount: 20,
    xpReward: 100
  },

  phrases: [
    { de: 'Das ist mein Kopf.',              ru: 'Это моя голова.',                note: 'der Kopf — голова; mein — мой', audio: 'Das ist mein Kopf' },
    { de: 'Ich habe zwei Augen.',            ru: 'У меня два глаза.',              note: 'das Auge → die Augen (мн. число)', audio: 'Ich habe zwei Augen' },
    { de: 'Meine Augen sind blau.',          ru: 'У меня голубые глаза.',          note: 'Букв.: «мои глаза — голубые»', audio: 'Meine Augen sind blau' },
    { de: 'Mein Kopf tut weh.',              ru: 'У меня болит голова.',           note: 'weh tun — болеть (о части тела)', audio: 'Mein Kopf tut weh' },
    { de: 'Ich habe lange Haare.',           ru: 'У меня длинные волосы.',         note: 'die Haare — волосы (обычно мн. число)', audio: 'Ich habe lange Haare' },
    { de: 'Wasch dir die Hände!',            ru: 'Помой руки!',                    note: 'повелительная форма для du', audio: 'Wasch dir die Hände' },
    { de: 'Er hat starke Arme.',             ru: 'У него сильные руки.',           note: 'der Arm — рука (от плеча до кисти)', audio: 'Er hat starke Arme' },
    { de: 'Mein Bauch tut weh.',             ru: 'У меня болит живот.',            note: 'der Bauch — живот', audio: 'Mein Bauch tut weh' },
    { de: 'Ich putze mir die Zähne.',        ru: 'Я чищу зубы.',                   note: 'sich die Zähne putzen — чистить зубы', audio: 'Ich putze mir die Zähne' },
    { de: 'Sie hat kleine Hände.',           ru: 'У неё маленькие руки (кисти).',  note: 'die Hand — кисть руки', audio: 'Sie hat kleine Hände' },
    { de: 'Ich sehe mit den Augen.',         ru: 'Я вижу глазами.',                note: 'sehen — видеть; mit — с помощью', audio: 'Ich sehe mit den Augen' },
    { de: 'Ich höre mit den Ohren.',         ru: 'Я слышу ушами.',                 note: 'hören — слышать; das Ohr → die Ohren', audio: 'Ich höre mit den Ohren' },
    { de: 'Mein Rücken tut weh.',            ru: 'У меня болит спина.',            note: 'der Rücken — спина', audio: 'Mein Rücken tut weh' },
    { de: 'Das Baby hat kleine Finger.',     ru: 'У малыша маленькие пальчики.',   note: 'der Finger → die Finger (форма не меняется)', audio: 'Das Baby hat kleine Finger' },
    { de: 'Meine Beine sind müde.',          ru: 'Мои ноги устали.',               note: 'das Bein → die Beine; müde — усталый', audio: 'Meine Beine sind müde' },
    { de: 'Sport macht den Körper stark.',   ru: 'Спорт делает тело сильным.',     note: 'der Körper — тело; stark — сильный', audio: 'Sport macht den Körper stark' }
  ],

  vocabulary: [
    { de: 'der Körper',   ru: 'тело',            ipa: '[ˈkœʁpɐ]',    article: 'der' },
    { de: 'der Kopf',     ru: 'голова',          ipa: '[kɔpf]',      article: 'der' },
    { de: 'das Auge',     ru: 'глаз',            ipa: '[ˈaʊ̯ɡə]',    article: 'das' },
    { de: 'die Nase',     ru: 'нос',             ipa: '[ˈnaːzə]',    article: 'die' },
    { de: 'der Mund',     ru: 'рот',             ipa: '[mʊnt]',      article: 'der' },
    { de: 'das Ohr',      ru: 'ухо',             ipa: '[oːɐ̯]',      article: 'das' },
    { de: 'das Haar',     ru: 'волосы',          ipa: '[haːɐ̯]',     article: 'das' },
    { de: 'der Arm',      ru: 'рука (вся)',      ipa: '[aʁm]',       article: 'der' },
    { de: 'die Hand',     ru: 'кисть руки',      ipa: '[hant]',      article: 'die' },
    { de: 'der Finger',   ru: 'палец',           ipa: '[ˈfɪŋɐ]',     article: 'der' },
    { de: 'das Bein',     ru: 'нога',            ipa: '[baɪ̯n]',     article: 'das' },
    { de: 'der Fuß',      ru: 'ступня',          ipa: '[fuːs]',      article: 'der' },
    { de: 'der Bauch',    ru: 'живот',           ipa: '[baʊ̯x]',     article: 'der' },
    { de: 'der Rücken',   ru: 'спина',           ipa: '[ˈʁʏkn̩]',    article: 'der' },
    { de: 'die Schulter', ru: 'плечо',           ipa: '[ˈʃʊltɐ]',    article: 'die' },
    { de: 'das Gesicht',  ru: 'лицо',            ipa: '[ɡəˈzɪçt]',   article: 'das' },
    { de: 'der Zahn',     ru: 'зуб',             ipa: '[tsaːn]',     article: 'der' },
    { de: 'das Herz',     ru: 'сердце',          ipa: '[hɛʁts]',     article: 'das' },
    { de: 'weh tun',      ru: 'болеть',          ipa: '[veː tuːn]',  article: '' },
    { de: 'stark',        ru: 'сильный',         ipa: '[ʃtaʁk]',     article: '' }
  ],

  grammar: [
    {
      title: '⚡ Множественное число частей тела',
      body: 'Части тела чаще всего называют во множественном числе. Форма множественного числа в немецком образуется по-разному — учи её вместе со словом:<br><br>' +
            '<em>Ich habe zwei <strong>Augen</strong>, zwei <strong>Ohren</strong> und zehn <strong>Finger</strong>.</em> — У меня два глаза, два уха и десять пальцев.',
      conjugation: [
        { pronoun: 'das Auge',   form: 'die Augen',  audio: 'die Augen',  translation: 'глаза' },
        { pronoun: 'das Ohr',    form: 'die Ohren',  audio: 'die Ohren',  translation: 'уши' },
        { pronoun: 'die Hand',   form: 'die Hände',  audio: 'die Hände',  translation: 'кисти рук' },
        { pronoun: 'der Fuß',    form: 'die Füße',   audio: 'die Füße',   translation: 'ступни' },
        { pronoun: 'der Zahn',   form: 'die Zähne',  audio: 'die Zähne',  translation: 'зубы' },
        { pronoun: 'das Bein',   form: 'die Beine',  audio: 'die Beine',  translation: 'ноги' }
      ]
    },
    {
      title: '⚡ Конструкция «tut weh» — что-то болит',
      body: 'Чтобы сказать, что что-то болит, используй <strong>weh tun</strong>:<br><br>' +
            '<em>Mein Kopf <strong>tut</strong> weh.</em> — У меня болит голова (ед. число → tut).<br>' +
            '<em>Meine Beine <strong>tun</strong> weh.</em> — У меня болят ноги (мн. число → tun).<br><br>' +
            'Запомни: болит ОДНА вещь → <strong>tut</strong>, болят НЕСКОЛЬКО → <strong>tun</strong>.',
      conjugation: [
        { pronoun: 'Голова',  form: 'Mein Kopf tut weh.',    audio: 'Mein Kopf tut weh',    translation: 'У меня болит голова.' },
        { pronoun: 'Живот',   form: 'Mein Bauch tut weh.',   audio: 'Mein Bauch tut weh',   translation: 'У меня болит живот.' },
        { pronoun: 'Спина',   form: 'Mein Rücken tut weh.',  audio: 'Mein Rücken tut weh',  translation: 'У меня болит спина.' },
        { pronoun: 'Ноги',    form: 'Meine Beine tun weh.',  audio: 'Meine Beine tun weh',  translation: 'У меня болят ноги.' },
        { pronoun: 'Зубы',    form: 'Meine Zähne tun weh.',  audio: 'Meine Zähne tun weh',  translation: 'У меня болят зубы.' }
      ]
    },
    {
      title: '💡 mein / meine — мой, моя, мои',
      body: 'Притяжательное <strong>mein</strong> меняется по роду существительного:<br><br>' +
            '<strong>mein</strong> — для der и das: <em>mein Kopf, mein Bein</em><br>' +
            '<strong>meine</strong> — для die и множественного числа: <em>meine Hand, meine Augen</em><br><br>' +
            'Так же работает <strong>dein/deine</strong> (твой/твоя/твои).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Mein Kopf',        blank: 'tut',    after: 'weh.',              translation: '— У меня болит голова.',        hintWord: 'tut',    hintRule: 'ед. число → tut weh' },
      { before: '— Meine Beine',      blank: 'tun',    after: 'weh.',              translation: '— У меня болят ноги.',          hintWord: 'tun',    hintRule: 'мн. число → tun weh' },
      { before: '— Ich habe zwei',    blank: 'Augen',  after: '.',                 translation: '— У меня два глаза.',           hintWord: 'Augen',  hintRule: 'das Auge → die Augen' },
      { before: '— Ich putze mir die', blank: 'Zähne', after: '.',                 translation: '— Я чищу зубы.',                hintWord: 'Zähne',  hintRule: 'der Zahn → die Zähne' },
      { before: '—',                  blank: 'Meine',  after: 'Hände sind klein.', translation: '— Мои руки маленькие.',         hintWord: 'Meine',  hintRule: 'мн. число → meine' },
      { before: '— Ich höre mit den', blank: 'Ohren',  after: '.',                 translation: '— Я слышу ушами.',              hintWord: 'Ohren',  hintRule: 'das Ohr → die Ohren' },
      { before: '— Er hat starke',    blank: 'Arme',   after: '.',                 translation: '— У него сильные руки.',        hintWord: 'Arme',   hintRule: 'der Arm → die Arme' },
      { before: '— Ich habe lange',   blank: 'Haare',  after: '.',                 translation: '— У меня длинные волосы.',      hintWord: 'Haare',  hintRule: 'das Haar → die Haare' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «голова»?',                    options: ['der Bauch', 'der Kopf', 'das Bein', 'die Hand'],           correctIndex: 1 },
      { question: '«Das Auge» — это…',                           options: ['ухо', 'нос', 'глаз', 'рот'],                               correctIndex: 2 },
      { question: 'Что значит «Mein Bauch tut weh»?',            options: ['У меня болит спина', 'У меня болит живот', 'У меня болит голова', 'Я устал'], correctIndex: 1 },
      { question: 'Множественное число от «die Hand»…',          options: ['die Hands', 'die Hände', 'die Handen', 'die Händer'],      correctIndex: 1 },
      { question: 'Когда говорят «tun weh» (а не «tut weh»)?',   options: ['Если болит одна вещь', 'Если болят несколько', 'Всегда', 'Никогда'], correctIndex: 1 },
      { question: '«Der Rücken» — это…',                         options: ['живот', 'плечо', 'спина', 'нога'],                         correctIndex: 2 },
      { question: 'Какое слово с артиклем «das»?',               options: ['Kopf', 'Nase', 'Herz', 'Fuß'],                             correctIndex: 2 },
      { question: '«Я чищу зубы» по-немецки…',                   options: ['Ich wasche die Zähne.', 'Ich putze mir die Zähne.', 'Ich tue die Zähne.', 'Ich habe Zähne.'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der Kopf',     ru: 'голова' },
      { id: 2, de: 'das Auge',     ru: 'глаз' },
      { id: 3, de: 'die Hand',     ru: 'кисть руки' },
      { id: 4, de: 'der Bauch',    ru: 'живот' },
      { id: 5, de: 'das Ohr',      ru: 'ухо' },
      { id: 6, de: 'der Zahn',     ru: 'зуб' },
      { id: 7, de: 'das Herz',     ru: 'сердце' },
      { id: 8, de: 'weh tun',      ru: 'болеть' }
    ],

    dictation: [
      { word: 'Kopf',     audio: 'Kopf' },
      { word: 'Auge',     audio: 'Auge' },
      { word: 'Hand',     audio: 'Hand' },
      { word: 'Bauch',    audio: 'Bauch' },
      { word: 'Rücken',   audio: 'Rücken' },
      { word: 'Zähne',    audio: 'Zähne' },
      { word: 'Finger',   audio: 'Finger' },
      { word: 'Herz',     audio: 'Herz' }
    ]
  }
};
