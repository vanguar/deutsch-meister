/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-13.js
   B1 · Урок 13: Medien und Nachrichten — СМИ и новости
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-13',
  level:    'B1',
  unit:     13,
  title:    'Medien und Nachrichten',
  subtitle: 'СМИ и новости · косвенная речь · обсуждение прочитанного',

  meta: {
    duration:  '35–40 мин',
    wordCount: 20,
    xpReward:  150
  },

  phrases: [
    { de: 'Hast du die Nachrichten heute schon gesehen?',       ru: 'Ты уже видел сегодня новости?',                    note: 'die Nachrichten — всегда Plural', audio: 'Hast du die Nachrichten heute schon gesehen' },
    { de: 'Ich lese jeden Morgen die Schlagzeilen online.',     ru: 'Каждое утро я читаю заголовки онлайн.',            note: 'die Schlagzeile — заголовок', audio: 'Ich lese jeden Morgen die Schlagzeilen online' },
    { de: 'In der Zeitung steht, dass die Preise steigen.',     ru: 'В газете написано, что цены растут.',              note: 'in der Zeitung steht = написано', audio: 'In der Zeitung steht, dass die Preise steigen' },
    { de: 'Laut einer Studie schlafen die Deutschen zu wenig.', ru: 'Согласно исследованию, немцы слишком мало спят.',  note: 'laut + Dativ — согласно', audio: 'Laut einer Studie schlafen die Deutschen zu wenig' },
    { de: 'Der Journalist berichtet über die Wahlen.',          ru: 'Журналист сообщает о выборах.',                    note: 'berichten über + Akk.', audio: 'Der Journalist berichtet über die Wahlen' },
    { de: 'Diese Nachricht hat mich sehr überrascht.',          ru: 'Эта новость меня очень удивила.',                  note: 'überraschen — удивлять', audio: 'Diese Nachricht hat mich sehr überrascht' },
    { de: 'Ich habe einen interessanten Artikel über Umweltschutz gelesen.', ru: 'Я прочитал интересную статью о защите окружающей среды.', note: 'der Artikel über + Akk.', audio: 'Ich habe einen interessanten Artikel über Umweltschutz gelesen' },
    { de: 'Man kann nicht alles glauben, was im Internet steht.', ru: 'Нельзя верить всему, что написано в интернете.', note: 'alles, was — относительное was', audio: 'Man kann nicht alles glauben, was im Internet steht' },
    { de: 'Er sagt, dass er nichts davon gewusst hat.',         ru: 'Он говорит, что ничего об этом не знал.',          note: 'косвенная речь через dass', audio: 'Er sagt, dass er nichts davon gewusst hat' },
    { de: 'Die Reporterin interviewt eine bekannte Politikerin.', ru: 'Репортёр берёт интервью у известной женщины-политика.', note: 'interviewen + Akk.', audio: 'Die Reporterin interviewt eine bekannte Politikerin' },
    { de: 'Diese Zeitung erscheint täglich.',                   ru: 'Эта газета выходит ежедневно.',                    note: 'erscheinen — выходить (о прессе)', audio: 'Diese Zeitung erscheint täglich' },
    { de: 'Ich höre auf dem Weg zur Arbeit immer einen Podcast.', ru: 'По дороге на работу я всегда слушаю подкаст.',   note: 'auf dem Weg zu + Dativ', audio: 'Ich höre auf dem Weg zur Arbeit immer einen Podcast' },
    { de: 'Viele junge Leute informieren sich über soziale Medien.', ru: 'Многие молодые люди получают информацию из соцсетей.', note: 'sich informieren über + Akk.', audio: 'Viele junge Leute informieren sich über soziale Medien' },
    { de: 'Das ist eine Falschmeldung — glaub das nicht!',      ru: 'Это фейковая новость — не верь этому!',            note: 'die Falschmeldung = Fake News', audio: 'Das ist eine Falschmeldung. Glaub das nicht' },
    { de: 'Man sollte immer die Quelle prüfen.',                ru: 'Всегда следует проверять источник.',               note: 'die Quelle — источник', audio: 'Man sollte immer die Quelle prüfen' },
    { de: 'Im Radio wurde gemeldet, dass die Bahn streikt.',    ru: 'По радио сообщили, что железная дорога бастует.',  note: 'Passiv: wurde gemeldet', audio: 'Im Radio wurde gemeldet, dass die Bahn streikt' },
    { de: 'Ihrer Meinung nach berichten die Medien zu negativ.', ru: 'По её мнению, СМИ сообщают слишком негативно.',   note: 'Meinung nach (урок 10)', audio: 'Ihrer Meinung nach berichten die Medien zu negativ' },
    { de: 'Ich habe die Sendung verpasst. Gibt es eine Wiederholung?', ru: 'Я пропустил передачу. Будет повтор?',       note: 'verpassen — пропустить', audio: 'Ich habe die Sendung verpasst. Gibt es eine Wiederholung' },
    { de: 'Der Moderator stellt den Gästen kritische Fragen.',  ru: 'Ведущий задаёт гостям острые вопросы.',            note: 'jemandem Fragen stellen', audio: 'Der Moderator stellt den Gästen kritische Fragen' },
    { de: 'Abonnierst du eine Zeitung oder liest du alles kostenlos?', ru: 'Ты подписан на газету или читаешь всё бесплатно?', note: 'abonnieren — подписываться', audio: 'Abonnierst du eine Zeitung oder liest du alles kostenlos' }
  ],

  vocabulary: [
    { de: 'die Nachrichten',   ru: 'новости (Plural)',            ipa: '[ˈnaːxʁɪçtn̩]',      article: 'die' },
    { de: 'die Zeitung',       ru: 'газета',                      ipa: '[ˈt͡saɪ̯tʊŋ]',       article: 'die' },
    { de: 'die Zeitschrift',   ru: 'журнал',                      ipa: '[ˈt͡saɪ̯tʃʁɪft]',    article: 'die' },
    { de: 'die Schlagzeile',   ru: 'заголовок',                   ipa: '[ˈʃlaːkˌt͡saɪ̯lə]',  article: 'die' },
    { de: 'der Artikel',       ru: 'статья',                      ipa: '[aʁˈtiːkl̩]',         article: 'der' },
    { de: 'der Journalist',    ru: 'журналист',                   ipa: '[ʒʊʁnaˈlɪst]',       article: 'der' },
    { de: 'die Sendung',       ru: 'передача',                    ipa: '[ˈzɛndʊŋ]',          article: 'die' },
    { de: 'die Quelle',        ru: 'источник',                    ipa: '[ˈkvɛlə]',           article: 'die' },
    { de: 'die Falschmeldung', ru: 'фейковая новость',            ipa: '[ˈfalʃˌmɛldʊŋ]',     article: 'die' },
    { de: 'berichten über',    ru: 'сообщать о (+A)',             ipa: '[bəˈʁɪçtn̩]',        article: '' },
    { de: 'melden',            ru: 'сообщать, докладывать',       ipa: '[ˈmɛldn̩]',          article: '' },
    { de: 'erscheinen',        ru: 'выходить, появляться',        ipa: '[ɛʁˈʃaɪ̯nən]',       article: '' },
    { de: 'sich informieren',  ru: 'получать информацию',         ipa: '[ɪnfɔʁˈmiːʁən]',     article: '' },
    { de: 'überraschen',       ru: 'удивлять',                    ipa: '[yːbɐˈʁaʃn̩]',       article: '' },
    { de: 'verpassen',         ru: 'пропустить',                  ipa: '[fɛʁˈpasn̩]',        article: '' },
    { de: 'abonnieren',        ru: 'подписываться',               ipa: '[abɔˈniːʁən]',       article: '' },
    { de: 'prüfen',            ru: 'проверять',                   ipa: '[ˈpʁyːfn̩]',         article: '' },
    { de: 'laut (+D)',         ru: 'согласно',                    ipa: '[laʊ̯t]',            article: '' },
    { de: 'täglich',           ru: 'ежедневно',                   ipa: '[ˈtɛːklɪç]',         article: '' },
    { de: 'kostenlos',         ru: 'бесплатно',                   ipa: '[ˈkɔstn̩loːs]',      article: '' }
  ],

  grammar: [
    {
      title: '⚡ Как передать чужие слова',
      body: 'На B1 чужую речь передают тремя способами:<br><br>' +
            '<strong>1. dass-Satz:</strong> <em>Er sagt, <strong>dass</strong> die Preise steigen.</em><br>' +
            '<strong>2. laut + Dativ:</strong> <em><strong>Laut</strong> der Zeitung steigen die Preise.</em> (согласно газете)<br>' +
            '<strong>3. Meinung nach:</strong> <em>Seiner Meinung <strong>nach</strong> ist das falsch.</em><br><br>' +
            'Полезные глаголы-вводки: <em>sagen, meinen, berichten, melden, behaupten</em> (утверждать).',
      conjugation: [
        { pronoun: 'dass',    form: 'Er sagt, dass es regnet.',        audio: 'Er sagt, dass es regnet',        translation: 'Он говорит, что идёт дождь.' },
        { pronoun: 'laut',    form: 'Laut der Studie ist das gesund.', audio: 'Laut der Studie ist das gesund', translation: 'Согласно исследованию, это полезно.' },
        { pronoun: 'Meinung', form: 'Meiner Meinung nach stimmt das.', audio: 'Meiner Meinung nach stimmt das', translation: 'По-моему, это верно.' },
        { pronoun: 'steht',   form: 'In der Zeitung steht, dass…',     audio: 'In der Zeitung steht, dass',     translation: 'В газете написано, что…' }
      ]
    },
    {
      title: '⚡ Лексика СМИ — что с чем сочетается',
      body: 'Устойчивые связки, без которых не обсудить новости:<br><br>' +
            '<em>einen Artikel <strong>lesen</strong> / <strong>schreiben</strong></em> — читать/писать статью<br>' +
            '<em>eine Sendung <strong>sehen</strong> / <strong>verpassen</strong></em> — смотреть/пропустить передачу<br>' +
            '<em>über etwas <strong>berichten</strong></em> — сообщать о чём-то<br>' +
            '<em>eine Zeitung <strong>abonnieren</strong></em> — подписаться на газету<br>' +
            '<em>die Quelle <strong>prüfen</strong></em> — проверить источник',
      conjugation: [
        { pronoun: 'berichten', form: 'Die Medien berichten über die Wahl.',  audio: 'Die Medien berichten über die Wahl',  translation: 'СМИ сообщают о выборах.' },
        { pronoun: 'erscheinen', form: 'Die Zeitung erscheint täglich.',      audio: 'Die Zeitung erscheint täglich',       translation: 'Газета выходит ежедневно.' },
        { pronoun: 'verpassen', form: 'Ich habe die Sendung verpasst.',       audio: 'Ich habe die Sendung verpasst',       translation: 'Я пропустил передачу.' },
        { pronoun: 'informieren', form: 'Ich informiere mich online.',        audio: 'Ich informiere mich online',          translation: 'Я получаю информацию онлайн.' }
      ]
    },
    {
      title: '💡 Медиаграмотность по-немецки',
      body: 'Слова для критического разговора о новостях:<br><br>' +
            '<strong>die Falschmeldung / Fake News</strong> — фейк<br>' +
            '<strong>die Quelle</strong> — источник: <em>Welche Quelle hat diese Information?</em><br>' +
            '<strong>glaubwürdig</strong> — достоверный ↔ <strong>unglaubwürdig</strong><br>' +
            '<strong>объективно/субъективно</strong>: <em>objektiv / subjektiv berichten</em><br><br>' +
            '<em>Man kann nicht alles glauben, <strong>was</strong> im Internet steht.</em> — после «alles, etwas, nichts» используется <strong>was</strong> (урок 3).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Hast du die',          blank: 'Nachrichten', after: 'gesehen?',                 translation: '— Ты видел новости?',                    hintWord: 'Nachrichten', hintRule: 'новости — die Nachrichten (Pl.)' },
      { before: '— In der Zeitung',       blank: 'steht',    after: ', dass die Preise steigen.',  translation: '— В газете написано, что цены растут.',  hintWord: 'steht',    hintRule: 'написано = steht' },
      { before: '—',                      blank: 'Laut',     after: 'einer Studie ist das gesund.', translation: '— Согласно исследованию, это полезно.', hintWord: 'Laut',     hintRule: 'согласно = laut + Dativ' },
      { before: '— Der Journalist berichtet', blank: 'über', after: 'die Wahlen.',                 translation: '— Журналист сообщает о выборах.',        hintWord: 'über',     hintRule: 'berichten über + Akk.' },
      { before: '— Man sollte die',       blank: 'Quelle',   after: 'prüfen.',                     translation: '— Следует проверять источник.',           hintWord: 'Quelle',   hintRule: 'источник = die Quelle' },
      { before: '— Ich habe die Sendung', blank: 'verpasst', after: '.',                           translation: '— Я пропустил передачу.',                 hintWord: 'verpasst', hintRule: 'verpassen → verpasst' },
      { before: '— Die Zeitung',          blank: 'erscheint', after: 'täglich.',                   translation: '— Газета выходит ежедневно.',             hintWord: 'erscheint', hintRule: 'выходить (о прессе) = erscheinen' },
      { before: '— Glaub nicht alles,',   blank: 'was',      after: 'im Internet steht.',          translation: '— Не верь всему, что написано в интернете.', hintWord: 'was',   hintRule: 'после alles → was' }
    ],

    multipleChoice: [
      { question: '«Новости» по-немецки…',                             options: ['die Nachricht', 'die Nachrichten', 'die Neuigkeit', 'das Neue'],   correctIndex: 1 },
      { question: '«laut» (согласно) требует…',                        options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                      correctIndex: 1 },
      { question: '«berichten» сочетается с…',                         options: ['an + Dativ', 'über + Akkusativ', 'von + Akkusativ', 'für + Dativ'], correctIndex: 1 },
      { question: 'Фейковая новость — …',                              options: ['die Falschmeldung', 'die Wahrheit', 'die Schlagzeile', 'die Quelle'], correctIndex: 0 },
      { question: '«Газета выходит» — die Zeitung …',                  options: ['ausgeht', 'erscheint', 'kommt aus', 'druckt'],                     correctIndex: 1 },
      { question: '«Я пропустил передачу» — …',                        options: ['Ich habe die Sendung verloren.', 'Ich habe die Sendung verpasst.', 'Ich habe die Sendung vermisst.', 'Ich habe die Sendung gelassen.'], correctIndex: 1 },
      { question: 'После «alles» используется…',                       options: ['das', 'was', 'dass', 'wer'],                                       correctIndex: 1 },
      { question: '«подписаться на газету» — …',                       options: ['eine Zeitung anmelden', 'eine Zeitung abonnieren', 'eine Zeitung bestellen auf', 'sich einschreiben Zeitung'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'die Schlagzeile',    ru: 'заголовок' },
      { id: 2, de: 'die Quelle',         ru: 'источник' },
      { id: 3, de: 'die Sendung',        ru: 'передача' },
      { id: 4, de: 'die Zeitschrift',    ru: 'журнал' },
      { id: 5, de: 'berichten',          ru: 'сообщать' },
      { id: 6, de: 'verpassen',          ru: 'пропустить' },
      { id: 7, de: 'abonnieren',         ru: 'подписываться' },
      { id: 8, de: 'kostenlos',          ru: 'бесплатно' }
    ],

    dictation: [
      { word: 'Nachrichten',   audio: 'Nachrichten' },
      { word: 'Zeitung',       audio: 'Zeitung' },
      { word: 'Schlagzeile',   audio: 'Schlagzeile' },
      { word: 'Journalist',    audio: 'Journalist' },
      { word: 'Quelle',        audio: 'Quelle' },
      { word: 'abonnieren',    audio: 'abonnieren' },
      { word: 'überraschen',   audio: 'überraschen' },
      { word: 'täglich',       audio: 'täglich' }
    ]
  }
};
