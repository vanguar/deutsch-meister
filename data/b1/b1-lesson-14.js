/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-14.js
   B1 · Урок 14: Wiederholung B1 — Итоговый урок уровня
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-14',
  level:    'B1',
  unit:     14,
  title:    'Wiederholung B1',
  subtitle: 'Итоговый урок: повторяем весь уровень B1',

  meta: {
    duration:  '35–40 мин',
    wordCount: 16,
    xpReward:  150
  },

  phrases: [
    { de: 'Wenn ich mehr Zeit hätte, würde ich mehr reisen.',   ru: 'Если бы у меня было больше времени, я бы больше путешествовал.', note: 'урок 1: Konjunktiv II', audio: 'Wenn ich mehr Zeit hätte, würde ich mehr reisen' },
    { de: 'Könnten Sie mir bitte helfen?',                      ru: 'Не могли бы вы мне помочь?',                       note: 'урок 1: вежливость через Konj. II', audio: 'Könnten Sie mir bitte helfen' },
    { de: 'Das Haus wurde vor hundert Jahren gebaut.',          ru: 'Дом был построен сто лет назад.',                  note: 'урок 2: Passiv Präteritum', audio: 'Das Haus wurde vor hundert Jahren gebaut' },
    { de: 'Der Mann, der dort steht, ist mein Nachbar.',        ru: 'Мужчина, который там стоит, — мой сосед.',         note: 'урок 3: Relativsatz', audio: 'Der Mann, der dort steht, ist mein Nachbar' },
    { de: 'Ich weiß nicht, ob er heute kommt.',                 ru: 'Я не знаю, придёт ли он сегодня.',                 note: 'урок 4: ob — ли', audio: 'Ich weiß nicht, ob er heute kommt' },
    { de: 'Obwohl es regnete, sind wir gewandert.',             ru: 'Хотя шёл дождь, мы ходили в поход.',               note: 'урок 4: obwohl', audio: 'Obwohl es regnete, sind wir gewandert' },
    { de: 'Ich versuche, jeden Tag ein bisschen zu üben.',      ru: 'Я стараюсь каждый день немного заниматься.',       note: 'урок 5: zu + Infinitiv', audio: 'Ich versuche, jeden Tag ein bisschen zu üben' },
    { de: 'Ich habe mich um die Stelle beworben.',              ru: 'Я подал заявку на эту вакансию.',                  note: 'урок 6: sich bewerben um', audio: 'Ich habe mich um die Stelle beworben' },
    { de: 'Ich bin der Meinung, dass das eine gute Lösung ist.', ru: 'Я считаю, что это хорошее решение.',              note: 'урок 7: выражение мнения', audio: 'Ich bin der Meinung, dass das eine gute Lösung ist' },
    { de: 'Die Umwelt muss besser geschützt werden.',           ru: 'Окружающую среду нужно лучше защищать.',           note: 'уроки 2, 8: Passiv с модальным', audio: 'Die Umwelt muss besser geschützt werden' },
    { de: 'Ich suche eine kleine Wohnung mit einem großen Balkon.', ru: 'Я ищу маленькую квартиру с большим балконом.', note: 'урок 9: Adjektivdeklination', audio: 'Ich suche eine kleine Wohnung mit einem großen Balkon' },
    { de: 'Wegen des Streiks fahren heute keine Züge.',         ru: 'Из-за забастовки сегодня не ходят поезда.',        note: 'урок 10: wegen + Genitiv', audio: 'Wegen des Streiks fahren heute keine Züge' },
    { de: 'Als ich nach Deutschland kam, konnte ich kein Wort Deutsch.', ru: 'Когда я приехал в Германию, я не знал ни слова по-немецки.', note: 'урок 11: als', audio: 'Als ich nach Deutschland kam, konnte ich kein Wort Deutsch' },
    { de: 'Ich freue mich darauf, dich bald wiederzusehen.',    ru: 'Я с нетерпением жду нашей скорой встречи.',        note: 'уроки 5, 12: darauf + zu-Infinitiv', audio: 'Ich freue mich darauf, dich bald wiederzusehen' },
    { de: 'Laut den Nachrichten wird das Wetter morgen besser.', ru: 'Согласно новостям, завтра погода будет лучше.',   note: 'урок 13: laut + СМИ', audio: 'Laut den Nachrichten wird das Wetter morgen besser' },
    { de: 'Du hast B1 geschafft — darauf kannst du stolz sein!', ru: 'Ты одолел B1 — этим можно гордиться!',            note: 'stolz sein auf — весь уровень позади!', audio: 'Du hast B1 geschafft. Darauf kannst du stolz sein' }
  ],

  vocabulary: [
    { de: 'der Konjunktiv',    ru: 'сослагательное наклонение (урок 1)', ipa: '[ˈkɔnjʊŋktiːf]',  article: 'der' },
    { de: 'das Passiv',        ru: 'пассивный залог (урок 2)',     ipa: '[ˈpasiːf]',           article: 'das' },
    { de: 'der Nachbar',       ru: 'сосед (урок 3)',               ipa: '[ˈnaxbaːɐ̯]',         article: 'der' },
    { de: 'obwohl',            ru: 'хотя (урок 4)',                ipa: '[ɔpˈvoːl]',           article: '' },
    { de: 'versuchen',         ru: 'пытаться (урок 5)',            ipa: '[fɛʁˈzuːxn̩]',        article: '' },
    { de: 'die Stelle',        ru: 'вакансия, место (урок 6)',     ipa: '[ˈʃtɛlə]',            article: 'die' },
    { de: 'die Lösung',        ru: 'решение (урок 7)',             ipa: '[ˈløːzʊŋ]',           article: 'die' },
    { de: 'der Umweltschutz',  ru: 'защита среды (урок 8)',        ipa: '[ˈʊmvɛltʃʊt͡s]',     article: 'der' },
    { de: 'die Endung',        ru: 'окончание (урок 9)',           ipa: '[ˈɛndʊŋ]',            article: 'die' },
    { de: 'wegen',             ru: 'из-за + Genitiv (урок 10)',    ipa: '[ˈveːɡn̩]',           article: '' },
    { de: 'der Streik',        ru: 'забастовка (урок 10)',         ipa: '[ʃtʁaɪ̯k]',           article: 'der' },
    { de: 'nachdem',           ru: 'после того как (урок 11)',     ipa: '[naːxˈdeːm]',         article: '' },
    { de: 'sich bewerben um',  ru: 'подавать заявку (урок 6)',     ipa: '[bəˈvɛʁbn̩]',         article: '' },
    { de: 'warten auf',        ru: 'ждать (урок 12)',              ipa: '[ˈvaʁtn̩ aʊ̯f]',      article: '' },
    { de: 'die Quelle',        ru: 'источник (урок 13)',           ipa: '[ˈkvɛlə]',            article: 'die' },
    { de: 'stolz auf (+A)',    ru: 'гордый (чем-то)',              ipa: '[ʃtɔlt͡s]',           article: '' }
  ],

  grammar: [
    {
      title: '⚡ Ядро B1: Konjunktiv II, Passiv, Relativsätze',
      body: 'Три конструкции, которые отличают B1 от A2:<br><br>' +
            '<strong>1. Konjunktiv II</strong> — мечты и вежливость: <em>Ich <strong>würde</strong> gern reisen. <strong>Hätte</strong> ich Zeit… <strong>Könnten</strong> Sie…?</em><br>' +
            '<strong>2. Passiv</strong> — важно действие, не деятель: <em>Das Haus <strong>wird gebaut</strong> / <strong>wurde gebaut</strong>.</em><br>' +
            '<strong>3. Relativsätze</strong> — описываем существительное: <em>der Mann, <strong>der</strong>… / die Frau, <strong>mit der</strong>…</em>',
      conjugation: [
        { pronoun: 'Konj. II',  form: 'Ich würde gern mehr reisen.',      audio: 'Ich würde gern mehr reisen',      translation: 'Я бы с удовольствием больше путешествовал.' },
        { pronoun: 'Irrealis',  form: 'Wenn ich reich wäre, …',           audio: 'Wenn ich reich wäre',             translation: 'Если бы я был богат, …' },
        { pronoun: 'Passiv',    form: 'Der Brief wird geschrieben.',      audio: 'Der Brief wird geschrieben',      translation: 'Письмо пишется.' },
        { pronoun: 'Passiv Prät.', form: 'Das Auto wurde repariert.',     audio: 'Das Auto wurde repariert',        translation: 'Машину отремонтировали.' },
        { pronoun: 'Relativ',   form: 'Das ist der Film, den ich liebe.', audio: 'Das ist der Film, den ich liebe', translation: 'Это фильм, который я люблю.' }
      ]
    },
    {
      title: '⚡ Все виды придаточных — глагол в конец!',
      body: 'B1 добавил к weil/dass/wenn целый арсенал союзов. Правило одно: <strong>глагол уходит в конец</strong>.<br><br>' +
            '<strong>obwohl</strong> — хотя · <strong>ob</strong> — ли · <strong>als</strong> — когда (1 раз в прошлом) · <strong>während</strong> — пока · <strong>bevor</strong> — прежде чем · <strong>nachdem</strong> — после того как · <strong>seitdem</strong> — с тех пор как · <strong>damit</strong> — чтобы (другой субъект)',
      conjugation: [
        { pronoun: 'obwohl',  form: 'Obwohl es regnet, gehe ich raus.',   audio: 'Obwohl es regnet, gehe ich raus',   translation: 'Хотя идёт дождь, я иду гулять.' },
        { pronoun: 'ob',      form: 'Ich weiß nicht, ob er kommt.',       audio: 'Ich weiß nicht, ob er kommt',       translation: 'Не знаю, придёт ли он.' },
        { pronoun: 'als',     form: 'Als ich jung war, …',                audio: 'Als ich jung war',                  translation: 'Когда я был молод, …' },
        { pronoun: 'nachdem', form: 'Nachdem ich gegessen hatte, …',      audio: 'Nachdem ich gegessen hatte',        translation: 'После того как я поел, …' },
        { pronoun: 'um … zu', form: 'Ich lerne, um zu arbeiten.',         audio: 'Ich lerne, um zu arbeiten',         translation: 'Я учусь, чтобы работать.' }
      ]
    },
    {
      title: '💡 Падежи и предлоги — финальная шпаргалка',
      body: '<strong>Genitiv-предлоги</strong> (урок 10): wegen, trotz, während, statt — <em>wegen des Regens</em>.<br><br>' +
            '<strong>Глагол + предлог</strong> (урок 12): учи парой — <em>warten auf, denken an, träumen von, Angst haben vor</em>. Вопрос о предмете: <em>Worauf? Woran?</em><br><br>' +
            '<strong>Прилагательные</strong> (урок 9): Dativ и Genitiv → всегда <strong>-en</strong>; после ein в Nominativ прилагательное показывает род: <em>ein gut<strong>er</strong> Mann, ein gut<strong>es</strong> Kind</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Wenn ich Zeit hätte,',  blank: 'würde',   after: 'ich mehr lesen.',              translation: '— Будь у меня время, я бы больше читал. (урок 1)', hintWord: 'würde', hintRule: 'Konjunktiv II: würde + Inf.' },
      { before: '— Das Haus',              blank: 'wurde',   after: '1900 gebaut.',                 translation: '— Дом был построен в 1900. (урок 2)',    hintWord: 'wurde',   hintRule: 'Passiv Präteritum' },
      { before: '— Der Mann,',             blank: 'der',     after: 'dort steht, ist nett.',        translation: '— Мужчина, который там стоит, милый. (урок 3)', hintWord: 'der', hintRule: 'Relativpronomen m Nom.' },
      { before: '— Ich weiß nicht,',       blank: 'ob',      after: 'sie kommt.',                   translation: '— Не знаю, придёт ли она. (урок 4)',     hintWord: 'ob',      hintRule: '«ли» = ob' },
      { before: '— Es ist wichtig, täglich', blank: 'zu',    after: 'üben.',                        translation: '— Важно заниматься ежедневно. (урок 5)',  hintWord: 'zu',      hintRule: 'zu + Infinitiv' },
      { before: '—',                       blank: 'Wegen',   after: 'des Streiks fahren keine Züge.', translation: '— Из-за забастовки поезда не ходят. (урок 10)', hintWord: 'Wegen', hintRule: 'из-за = wegen + Genitiv' },
      { before: '—',                       blank: 'Als',     after: 'ich ankam, war es dunkel.',    translation: '— Когда я приехал, было темно. (урок 11)', hintWord: 'Als',    hintRule: '1 раз в прошлом → als' },
      { before: '— Ich warte',             blank: 'auf',     after: 'deine Antwort.',               translation: '— Жду твоего ответа. (урок 12)',          hintWord: 'auf',     hintRule: 'warten auf + Akk.' }
    ],

    multipleChoice: [
      { question: '«Не могли бы вы…» — самая вежливая форма…',         options: ['Können Sie…?', 'Könnten Sie…?', 'Wollen Sie…?', 'Müssen Sie…?'],   correctIndex: 1 },
      { question: 'Passiv образуется с помощью…',                      options: ['haben + Partizip II', 'werden + Partizip II', 'sein + Infinitiv', 'werden + Infinitiv'], correctIndex: 1 },
      { question: '«…, который я вижу» (der Film) — …',                options: ['der ich sehe', 'den ich sehe', 'dem ich sehe', 'dessen ich sehe'],  correctIndex: 1 },
      { question: '«хотя» — …',                                        options: ['weil', 'obwohl', 'damit', 'sobald'],                                correctIndex: 1 },
      { question: 'После модального глагола zu…',                      options: ['нужно всегда', 'не нужно', 'нужно с um', 'нужно в Perfekt'],        correctIndex: 1 },
      { question: '«wegen» требует…',                                  options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                       correctIndex: 2 },
      { question: 'Однократное «когда» в прошлом — …',                 options: ['wenn', 'als', 'ob', 'bis'],                                          correctIndex: 1 },
      { question: '«Чего ты ждёшь?» — …',                              options: ['Wofür wartest du?', 'Worauf wartest du?', 'Was wartest du?', 'Wen wartest du?'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'Ich würde gern…',        ru: 'Я бы с удовольствием…' },
      { id: 2, de: 'wird gebaut',            ru: 'строится (Passiv)' },
      { id: 3, de: 'der Mann, der…',         ru: 'мужчина, который…' },
      { id: 4, de: 'obwohl',                 ru: 'хотя' },
      { id: 5, de: 'um … zu',                ru: 'чтобы' },
      { id: 6, de: 'trotz des Regens',       ru: 'несмотря на дождь' },
      { id: 7, de: 'sich bewerben um',       ru: 'подавать заявку на' },
      { id: 8, de: 'meiner Meinung nach',    ru: 'по моему мнению' }
    ],

    dictation: [
      { word: 'würde',        audio: 'würde' },
      { word: 'obwohl',       audio: 'obwohl' },
      { word: 'Bewerbung',    audio: 'Bewerbung' },
      { word: 'Umweltschutz', audio: 'Umweltschutz' },
      { word: 'während',      audio: 'während' },
      { word: 'Nachrichten',  audio: 'Nachrichten' },
      { word: 'geschrieben',  audio: 'geschrieben' },
      { word: 'stolz',        audio: 'stolz' }
    ]
  }
};
