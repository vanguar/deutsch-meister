/* ═══════════════════════════════════════════════
   data/a1-lesson-04.js
   A1 · Урок 4: Meine Familie — Семья и близкие
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a1-04',
  level: 'A1',
  unit:  4,
  title: 'Meine Familie',
  subtitle: 'Семья, родственники и притяжательные местоимения',

  meta: {
    duration: '30 мин',
    wordCount: 26,
    xpReward: 100
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Das ist meine Mutter.',                ru: 'Это моя мама.',                           note: 'meine = моя (ж.р.)', audio: 'Das ist meine Mutter' },
    { de: 'Das ist mein Vater.',                  ru: 'Это мой папа.',                           note: 'mein = мой (м.р./ср.р.)', audio: 'Das ist mein Vater' },
    { de: 'Das sind meine Eltern.',               ru: 'Это мои родители.',                       note: 'sind — потому что Eltern мн.ч.', audio: 'Das sind meine Eltern' },
    { de: 'Mein Vater heißt Klaus.',              ru: 'Моего папу зовут Клаус.',                 note: 'heißt + имя', audio: 'Mein Vater heißt Klaus' },
    { de: 'Sie ist meine ältere Schwester.',      ru: 'Это моя старшая сестра.',                 note: 'älter = старший (сравнит.)', audio: 'Sie ist meine ältere Schwester' },
    { de: 'Hast du Geschwister?',                 ru: 'У тебя есть братья/сёстры?',              note: 'Geschwister — собирательно', audio: 'Hast du Geschwister' },
    { de: 'Ich habe einen Bruder.',               ru: 'У меня есть брат.',                       note: 'einen = артикль м.р. в Akkusativ', audio: 'Ich habe einen Bruder' },
    { de: 'Ich habe eine Schwester.',             ru: 'У меня есть сестра.',                     note: 'eine = ж.р. в Akkusativ', audio: 'Ich habe eine Schwester' },
    { de: 'Ich bin Einzelkind.',                  ru: 'Я единственный ребёнок.',                 note: 'Einzelkind — без артикля после bin', audio: 'Ich bin Einzelkind' },
    { de: 'Wie groß ist deine Familie?',          ru: 'Насколько большая твоя семья?',           note: 'groß = большой', audio: 'Wie groß ist deine Familie' },
    { de: 'Wir sind fünf in der Familie.',        ru: 'Нас пятеро в семье.',                     note: 'in der Familie — Dativ', audio: 'Wir sind fünf in der Familie' },
    { de: 'Bist du verheiratet?',                 ru: 'Ты женат / замужем?',                     note: 'verheiratet = женат(ый)', audio: 'Bist du verheiratet' },
    { de: 'Ja, ich habe einen Mann.',             ru: 'Да, у меня есть муж.',                    note: 'der Mann = муж/мужчина', audio: 'Ja, ich habe einen Mann' },
    { de: 'Nein, ich bin ledig.',                 ru: 'Нет, я не замужем / не женат.',           note: 'ledig = холостой', audio: 'Nein, ich bin ledig' },
    { de: 'Hast du Kinder?',                      ru: 'У тебя есть дети?',                       note: 'Kinder — мн.ч. от Kind', audio: 'Hast du Kinder' },
    { de: 'Ich habe zwei Söhne.',                 ru: 'У меня два сына.',                        note: 'der Sohn → die Söhne (мн.ч.)', audio: 'Ich habe zwei Söhne' },
    { de: 'Wie heißt deine Frau?',                ru: 'Как зовут твою жену?',                    note: 'die Frau = жена/женщина', audio: 'Wie heißt deine Frau' },
    { de: 'Meine Großeltern leben in Hamburg.',   ru: 'Мои бабушка с дедушкой живут в Гамбурге.', note: 'Großeltern — всегда мн.ч.', audio: 'Meine Großeltern leben in Hamburg' },
    { de: 'Mein Onkel arbeitet als Arzt.',        ru: 'Мой дядя работает врачом.',               note: 'als + профессия', audio: 'Mein Onkel arbeitet als Arzt' },
    { de: 'Meine Tante hat einen Hund.',          ru: 'У моей тёти есть собака.',                note: 'Tante = тётя', audio: 'Meine Tante hat einen Hund' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'die Mutter',      ru: 'мама',           ipa: '[ˈmʊtɐ]',          article: 'die' },
    { de: 'der Vater',       ru: 'папа',           ipa: '[ˈfaːtɐ]',         article: 'der' },
    { de: 'die Eltern',      ru: 'родители',       ipa: '[ˈɛltɐn]',         article: 'die' },
    { de: 'die Schwester',   ru: 'сестра',         ipa: '[ˈʃvɛstɐ]',        article: 'die' },
    { de: 'der Bruder',      ru: 'брат',           ipa: '[ˈbʁuːdɐ]',        article: 'der' },
    { de: 'die Geschwister', ru: 'братья и сёстры',ipa: '[ɡəˈʃvɪstɐ]',      article: 'die' },
    { de: 'die Großmutter',  ru: 'бабушка',        ipa: '[ˈɡʁoːsˌmʊtɐ]',    article: 'die' },
    { de: 'der Großvater',   ru: 'дедушка',        ipa: '[ˈɡʁoːsˌfaːtɐ]',   article: 'der' },
    { de: 'die Großeltern',  ru: 'бабушка и дедушка', ipa: '[ˈɡʁoːsˌʔɛltɐn]', article: 'die' },
    { de: 'der Sohn',        ru: 'сын',            ipa: '[zoːn]',           article: 'der' },
    { de: 'die Tochter',     ru: 'дочь',           ipa: '[ˈtɔxtɐ]',         article: 'die' },
    { de: 'das Kind',        ru: 'ребёнок',        ipa: '[kɪnt]',           article: 'das' },
    { de: 'der Onkel',       ru: 'дядя',           ipa: '[ˈɔŋkl̩]',         article: 'der' },
    { de: 'die Tante',       ru: 'тётя',           ipa: '[ˈtantə]',         article: 'die' },
    { de: 'der Cousin',      ru: 'двоюродный брат',ipa: '[kuˈzɛŋ]',         article: 'der' },
    { de: 'die Cousine',     ru: 'двоюродная сестра',ipa: '[kuˈziːnə]',     article: 'die' },
    { de: 'der Mann',        ru: 'муж / мужчина',  ipa: '[man]',            article: 'der' },
    { de: 'die Frau',        ru: 'жена / женщина', ipa: '[fʁaʊ̯]',          article: 'die' },
    { de: 'die Familie',     ru: 'семья',          ipa: '[faˈmiːliə]',      article: 'die' },
    { de: 'haben',           ru: 'иметь',          ipa: '[ˈhaːbn̩]',        article: '' },
    { de: 'leben',           ru: 'жить',           ipa: '[ˈleːbn̩]',        article: '' },
    { de: 'arbeiten',        ru: 'работать',       ipa: '[ˈaʁbaɪ̯tn̩]',     article: '' },
    { de: 'verheiratet',     ru: 'женат / замужем',ipa: '[fɛɐ̯ˈhaɪ̯ʁaːtət]',article: '' },
    { de: 'ledig',           ru: 'холостой / незамужняя', ipa: '[ˈleːdɪç]',  article: '' },
    { de: 'der Hund',        ru: 'собака',         ipa: '[hʊnt]',           article: 'der' },
    { de: 'die Katze',       ru: 'кошка',          ipa: '[ˈkatsə]',         article: 'die' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Глагол haben (иметь) — спряжение',
      body: 'Глагол <strong>haben</strong> («иметь / у меня есть») — второй по важности после <em>sein</em>. Используется для владения, возраста (только в Akk: <em>Hunger haben</em>), и в составных временах (Perfekt — позже).',
      conjugation: [
        { pronoun: 'ich',           form: 'habe',  audio: 'ich habe',   translation: 'у меня есть' },
        { pronoun: 'du',            form: 'hast',  audio: 'du hast',    translation: 'у тебя есть' },
        { pronoun: 'er / sie / es', form: 'hat',   audio: 'er hat',     translation: 'у него/неё есть' },
        { pronoun: 'wir',           form: 'haben', audio: 'wir haben',  translation: 'у нас есть' },
        { pronoun: 'ihr',           form: 'habt',  audio: 'ihr habt',   translation: 'у вас (группы) есть' },
        { pronoun: 'Sie / sie',     form: 'haben', audio: 'Sie haben',  translation: 'у Вас / них есть' }
      ]
    },
    {
      title: '⚡ Притяжательные mein / dein / sein / ihr',
      body: 'Притяжательные местоимения согласуются с тем, <strong>чьё</strong> (с лицом) и с <strong>родом и числом</strong> того, что принадлежит:<br><br>' +
            '<strong>mein</strong> — мой<br>' +
            '<strong>dein</strong> — твой<br>' +
            '<strong>sein</strong> — его<br>' +
            '<strong>ihr</strong> — её / их<br>' +
            '<strong>unser</strong> — наш<br>' +
            '<strong>euer</strong> — ваш (группе)<br>' +
            '<strong>Ihr</strong> — Ваш (формально, с большой)<br><br>' +
            'Окончание: <em>пусто</em> для м.р. и ср.р., <strong>-e</strong> для ж.р. и мн.ч.',
      conjugation: [
        { pronoun: 'der Vater (м.р.)',     form: 'mein Vater',     audio: 'mein Vater',     translation: 'мой папа' },
        { pronoun: 'die Mutter (ж.р.)',    form: 'meine Mutter',   audio: 'meine Mutter',   translation: 'моя мама' },
        { pronoun: 'das Kind (ср.р.)',     form: 'mein Kind',      audio: 'mein Kind',      translation: 'мой ребёнок' },
        { pronoun: 'die Eltern (мн.ч.)',   form: 'meine Eltern',   audio: 'meine Eltern',   translation: 'мои родители' },
        { pronoun: 'твоя сестра',          form: 'deine Schwester',audio: 'deine Schwester',translation: 'твоя сестра' },
        { pronoun: 'её брат',              form: 'ihr Bruder',     audio: 'ihr Bruder',     translation: 'её брат' }
      ]
    },
    {
      title: '💡 Akkusativ артикля: einen / eine / ein',
      body: 'После глаголов <em>haben</em>, <em>sehen</em>, <em>kennen</em>, <em>möchten</em> существительное стоит в <strong>винительном падеже (Akkusativ)</strong>. Меняется только мужской род!<br><br>' +
            '<strong>der → einen</strong>: Ich habe <em>einen</em> Bruder.<br>' +
            '<strong>die → eine</strong>: Ich habe <em>eine</em> Schwester. <em>(не меняется)</em><br>' +
            '<strong>das → ein</strong>: Ich habe <em>ein</em> Kind. <em>(не меняется)</em><br>' +
            '<strong>мн.ч. → ø</strong>: Ich habe <em>Geschwister</em>. <em>(без артикля)</em><br><br>' +
            '⚠️ Только мужской род «выдаёт» Akkusativ: <em>ein → einen</em>!'
    },
    {
      title: '💡 Профессия и статус — без артикля!',
      body: 'Когда говорим о профессии или семейном статусе после <strong>sein</strong>, артикль <em>не нужен</em>:<br><br>' +
            '<em>Ich bin <strong>Lehrer</strong>.</em> — Я учитель.<br>' +
            '<em>Sie ist <strong>Ärztin</strong>.</em> — Она врач.<br>' +
            '<em>Mein Bruder ist <strong>Student</strong>.</em> — Мой брат — студент.<br>' +
            '<em>Ich bin <strong>Einzelkind</strong>.</em> — Я единственный ребёнок.<br><br>' +
            'А вот с <em>arbeiten als</em> — то же самое: <em>Er arbeitet als Arzt</em> (без артикля).'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich',                blank: 'habe',         after: 'eine Schwester.', translation: '— У меня есть сестра.',                          hintWord: 'habe',         hintRule: 'ich → habe (форма haben)' },
      { before: '— Das ist',            blank: 'meine',        after: 'Mutter.',         translation: '— Это моя мама.',                                hintWord: 'meine',        hintRule: 'meine = моя (ж.р., Mutter — die)' },
      { before: '— Hast du',            blank: 'Geschwister',  after: '?',               translation: '— У тебя есть братья/сёстры?',                  hintWord: 'Geschwister',  hintRule: 'Geschwister = братья и сёстры' },
      { before: '— Mein',               blank: 'Vater',        after: 'heißt Thomas.',   translation: '— Моего папу зовут Томас.',                      hintWord: 'Vater',        hintRule: 'Vater = папа (der Vater)' },
      { before: '— Ich habe',           blank: 'einen',        after: 'Bruder.',         translation: '— У меня есть брат.',                            hintWord: 'einen',        hintRule: 'der → einen в Akkusativ' },
      { before: '— Wir haben drei',     blank: 'Kinder',       after: '.',               translation: '— У нас трое детей.',                            hintWord: 'Kinder',       hintRule: 'мн.ч. от das Kind' },
      { before: '— Mein Bruder',        blank: 'arbeitet',     after: 'als Arzt.',       translation: '— Мой брат работает врачом.',                    hintWord: 'arbeitet',     hintRule: 'er → arbeitet (3-е лицо)' },
      { before: '— Sie',                blank: 'ist',          after: 'verheiratet.',    translation: '— Она замужем.',                                  hintWord: 'ist',          hintRule: 'sie → ist (форма sein)' }
    ],

    multipleChoice: [
      { question: 'Как по-немецки «бабушка»?',                                   options: ['die Mutter', 'die Schwester', 'die Großmutter', 'die Frau'],         correctIndex: 2 },
      { question: 'Форма haben для «du»:',                                       options: ['haben', 'habe', 'hat', 'hast'],                                       correctIndex: 3 },
      { question: '«Ich bin Einzelkind» означает:',                              options: ['Я единственный ребёнок', 'У меня один ребёнок', 'Я ребёнок', 'У меня маленькая семья'], correctIndex: 0 },
      { question: 'Как сказать «мой брат» (м.р.)?',                              options: ['meine Bruder', 'meinen Bruder', 'mein Bruder', 'der Bruder mein'],   correctIndex: 2 },
      { question: 'Артикль «Schwester» в Akkusativ (ich habe …):',               options: ['einen Schwester', 'eine Schwester', 'ein Schwester', 'einer Schwester'], correctIndex: 1 },
      { question: '«Meine Eltern» означает:',                                    options: ['моя мама', 'мой папа', 'мои родители', 'моя семья'],                  correctIndex: 2 },
      { question: 'Как сказать «её брат»?',                                      options: ['sein Bruder', 'ihr Bruder', 'ihre Bruder', 'seine Bruder'],           correctIndex: 1 },
      { question: '«Sie ist Lehrerin» — артикль перед профессией:',              options: ['eine', 'die', 'не нужен', 'das'],                                     correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'die Mutter',     ru: 'мама' },
      { id: 2, de: 'der Vater',      ru: 'папа' },
      { id: 3, de: 'die Schwester',  ru: 'сестра' },
      { id: 4, de: 'der Bruder',     ru: 'брат' },
      { id: 5, de: 'die Eltern',     ru: 'родители' },
      { id: 6, de: 'das Kind',       ru: 'ребёнок' },
      { id: 7, de: 'der Großvater',  ru: 'дедушка' },
      { id: 8, de: 'die Tante',      ru: 'тётя' }
    ],

    dictation: [
      { word: 'habe',       audio: 'habe' },
      { word: 'Mutter',     audio: 'Mutter' },
      { word: 'Familie',    audio: 'Familie' },
      { word: 'Geschwister',audio: 'Geschwister' },
      { word: 'Bruder',     audio: 'Bruder' },
      { word: 'Eltern',     audio: 'Eltern' },
      { word: 'einen',      audio: 'einen' },
      { word: 'Tochter',    audio: 'Tochter' }
    ]
  }
};
