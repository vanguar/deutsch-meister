/* ═══════════════════════════════════════════════
   data/a2/a2-lesson-20.js
   A2 · Урок 20: Wiederholung A2 — Итоговый урок уровня
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-20',
  level: 'A2',
  unit:  20,
  title: 'Wiederholung A2',
  subtitle: 'Итоговый урок: повторяем весь уровень A2',

  meta: {
    duration: '30–35 мин',
    wordCount: 16,
    xpReward: 120
  },

  phrases: [
    { de: 'Jeden Morgen stehe ich um sieben Uhr auf.', ru: 'Каждое утро я встаю в семь часов.', note: 'урок 1: отделяемая приставка в конец', audio: 'Jeden Morgen stehe ich um sieben Uhr auf' },
    { de: 'Ich interessiere mich für Sport und Musik.', ru: 'Я интересуюсь спортом и музыкой.', note: 'уроки 2, 13: хобби', audio: 'Ich interessiere mich für Sport und Musik' },
    { de: 'Mir tut der Rücken weh. Ich gehe zum Arzt.', ru: 'У меня болит спина. Я иду к врачу.', note: 'урок 3: Dativ', audio: 'Mir tut der Rücken weh. Ich gehe zum Arzt' },
    { de: 'Letztes Jahr sind wir ans Meer gefahren.', ru: 'В прошлом году мы ездили на море.', note: 'урок 4: Perfekt с sein', audio: 'Letztes Jahr sind wir ans Meer gefahren' },
    { de: 'Diese Jacke ist billiger als die blaue.', ru: 'Эта куртка дешевле, чем синяя.', note: 'уроки 5, 18: Komparativ + als', audio: 'Diese Jacke ist billiger als die blaue' },
    { de: 'Der Schlüssel liegt auf dem Tisch in der Küche.', ru: 'Ключ лежит на столе на кухне.', note: 'урок 6: Wo? → Dativ', audio: 'Der Schlüssel liegt auf dem Tisch in der Küche' },
    { de: 'Ich lerne Deutsch, weil ich in Berlin arbeiten will.', ru: 'Я учу немецкий, потому что хочу работать в Берлине.', note: 'урок 7: weil — глагол в конец', audio: 'Ich lerne Deutsch, weil ich in Berlin arbeiten will' },
    { de: 'Könnten Sie mir bitte die Speisekarte bringen?', ru: 'Не могли бы вы принести мне меню?', note: 'урок 9: сверхвежливая просьба', audio: 'Könnten Sie mir bitte die Speisekarte bringen' },
    { de: 'Ich gratuliere dir herzlich zum Geburtstag!', ru: 'Сердечно поздравляю тебя с днём рождения!', note: 'урок 10: gratulieren + Dativ + zu', audio: 'Ich gratuliere dir herzlich zum Geburtstag' },
    { de: 'Ruf mich heute Abend an, wir müssen reden.', ru: 'Позвони мне сегодня вечером, нам нужно поговорить.', note: 'уроки 11, 16: anrufen + императив на du', audio: 'Ruf mich heute Abend an, wir müssen reden' },
    { de: 'Ich freue mich schon auf den Urlaub.', ru: 'Я уже с нетерпением жду отпуска.', note: 'урок 12: sich freuen auf + Akkusativ', audio: 'Ich freue mich schon auf den Urlaub' },
    { de: 'Ich mache seit einem Jahr Yoga.', ru: 'Я занимаюсь йогой уже год.', note: 'урок 13: seit + Dativ', audio: 'Ich mache seit einem Jahr Yoga' },
    { de: 'Gehen Sie geradeaus und dann links, das Museum ist neben der Bank.', ru: 'Идите прямо, потом налево, музей рядом с банком.', note: 'урок 14: дорога + neben + Dativ', audio: 'Gehen Sie geradeaus und dann links, das Museum ist neben der Bank' },
    { de: 'Wir kennen uns seit der Schule und verstehen uns super.', ru: 'Мы знакомы со школы и отлично ладим.', note: 'урок 15: взаимное uns', audio: 'Wir kennen uns seit der Schule und verstehen uns super' },
    { de: 'Als Kind hatte ich einen Hund und war sehr glücklich.', ru: 'В детстве у меня была собака, и я был очень счастлив.', note: 'урок 17: hatte + war', audio: 'Als Kind hatte ich einen Hund und war sehr glücklich' },
    { de: 'Nächstes Jahr werde ich die B1-Prüfung machen!', ru: 'В следующем году я буду сдавать экзамен B1!', note: 'уроки 8, 19: Futur I — ты готов идти дальше!', audio: 'Nächstes Jahr werde ich die B1-Prüfung machen' }
  ],

  vocabulary: [
    { de: 'aufstehen',        ru: 'вставать (урок 1)',            ipa: '[ˈaʊ̯fˌʃteːən]',    article: '' },
    { de: 'das Hobby',        ru: 'хобби (урок 2)',               ipa: '[ˈhɔbi]',            article: 'das' },
    { de: 'der Arzt',         ru: 'врач (урок 3)',                ipa: '[aːɐ̯tst]',          article: 'der' },
    { de: 'der Urlaub',       ru: 'отпуск (урок 4)',              ipa: '[ˈuːɐ̯laʊ̯p]',       article: 'der' },
    { de: 'anprobieren',      ru: 'примерять (урок 5)',           ipa: '[ˈanpʁoˌbiːʁən]',    article: '' },
    { de: 'die Wohnung',      ru: 'квартира (урок 6)',            ipa: '[ˈvoːnʊŋ]',          article: 'die' },
    { de: 'die Bewerbung',    ru: 'заявка на работу (урок 7)',    ipa: '[bəˈvɛʁbʊŋ]',        article: 'die' },
    { de: 'das Wetter',       ru: 'погода (урок 8)',              ipa: '[ˈvɛtɐ]',            article: 'das' },
    { de: 'die Rechnung',     ru: 'счёт (урок 9)',                ipa: '[ˈʁɛçnʊŋ]',          article: 'die' },
    { de: 'gratulieren',      ru: 'поздравлять (урок 10)',        ipa: '[ɡʁatuˈliːʁən]',     article: '' },
    { de: 'anrufen',          ru: 'звонить (урок 11)',            ipa: '[ˈanˌʁuːfn̩]',       article: '' },
    { de: 'sich freuen',      ru: 'радоваться (урок 12)',         ipa: '[zɪç ˈfʁɔɪ̯ən]',     article: '' },
    { de: 'die Wegbeschreibung', ru: 'описание дороги (урок 14)', ipa: '[ˈveːkbəˌʃʁaɪ̯bʊŋ]', article: 'die' },
    { de: 'der Ausflug',      ru: 'вылазка, экскурсия (урок 16)', ipa: '[ˈaʊ̯sfluːk]',       article: 'der' },
    { de: 'die Vergangenheit', ru: 'прошлое (уроки 4, 17)',       ipa: '[fɛɐ̯ˈɡaŋənhaɪ̯t]',  article: 'die' },
    { de: 'die Zukunft',      ru: 'будущее (урок 19)',            ipa: '[ˈt͡suːkʊnft]',      article: 'die' }
  ],

  grammar: [
    {
      title: '⚡ Прошлое: Perfekt vs Präteritum',
      body: 'Два способа говорить о прошлом (уроки 4 и 17):<br><br>' +
            '<strong>Perfekt</strong> — для большинства глаголов в разговоре: <em>Ich habe gearbeitet. Ich bin gefahren.</em> (движение → sein)<br>' +
            '<strong>Präteritum</strong> — только для sein, haben и модальных: <em>Ich war müde. Ich hatte Zeit. Ich musste gehen.</em><br><br>' +
            'Никто не говорит «Ich bin müde gewesen» — говорят <em>Ich war müde</em>.',
      conjugation: [
        { pronoun: 'Perfekt (haben)', form: 'Ich habe Pizza gegessen.',   audio: 'Ich habe Pizza gegessen',   translation: 'Я поел пиццы.' },
        { pronoun: 'Perfekt (sein)',  form: 'Wir sind nach Wien gefahren.', audio: 'Wir sind nach Wien gefahren', translation: 'Мы поехали в Вену.' },
        { pronoun: 'war',             form: 'Das Wetter war super.',      audio: 'Das Wetter war super',      translation: 'Погода была супер.' },
        { pronoun: 'hatte',           form: 'Ich hatte keine Zeit.',      audio: 'Ich hatte keine Zeit',      translation: 'У меня не было времени.' },
        { pronoun: 'konnte',          form: 'Er konnte nicht kommen.',    audio: 'Er konnte nicht kommen',    translation: 'Он не смог прийти.' }
      ]
    },
    {
      title: '⚡ Рамка и придаточные — где стоит глагол',
      body: 'Два главных правила порядка слов на A2:<br><br>' +
            '<strong>1. Рамка:</strong> модальный/werden/haben — на 2-м месте, второй глагол — в конце: <em>Ich <strong>will</strong> morgen Deutsch <strong>lernen</strong>.</em><br>' +
            '<strong>2. Придаточные</strong> с weil / dass / wenn: глагол уходит в самый конец: <em>…, weil ich müde <strong>bin</strong>.</em>',
      conjugation: [
        { pronoun: 'модальный',  form: 'Ich muss heute lange arbeiten.',      audio: 'Ich muss heute lange arbeiten',      translation: 'Мне сегодня долго работать.' },
        { pronoun: 'Futur I',    form: 'Ich werde mehr Sport machen.',        audio: 'Ich werde mehr Sport machen',        translation: 'Я буду больше заниматься спортом.' },
        { pronoun: 'weil',       form: 'Ich bleibe zu Hause, weil es regnet.', audio: 'Ich bleibe zu Hause, weil es regnet', translation: 'Я остаюсь дома, потому что идёт дождь.' },
        { pronoun: 'dass',       form: 'Ich glaube, dass du das schaffst.',   audio: 'Ich glaube, dass du das schaffst',   translation: 'Я думаю, что ты справишься.' },
        { pronoun: 'wenn',       form: 'Wenn ich Zeit habe, rufe ich dich an.', audio: 'Wenn ich Zeit habe, rufe ich dich an', translation: 'Если будет время, я тебе позвоню.' }
      ]
    },
    {
      title: '💡 Шпаргалка по падежам',
      body: 'Итог уроков 3 и 6 в трёх строчках:<br><br>' +
            '<strong>Dativ всегда</strong> после mit, bei, zu, seit, aus, nach, von: <em>mit dem Bus, seit einem Jahr</em>.<br>' +
            '<strong>Двойные предлоги</strong> (in, auf, an, neben…): Wo? → Dativ (<em>Das Buch liegt auf dem Tisch</em>), Wohin? → Akkusativ (<em>Ich lege das Buch auf den Tisch</em>).<br>' +
            '<strong>Komparativ</strong> не забывай: billiger <strong>als</strong>, am billigsten (урок 18).'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Ich stehe jeden Tag früh', blank: 'auf',    after: '.',                        translation: '— Я каждый день рано встаю. (урок 1)',        hintWord: 'auf',    hintRule: 'приставка — в конец' },
      { before: '— Mir tut der Kopf',         blank: 'weh',    after: '.',                        translation: '— У меня болит голова. (урок 3)',             hintWord: 'weh',    hintRule: 'weh tun + Dativ' },
      { before: '— Wir',                      blank: 'sind',   after: 'nach Italien gefahren.',   translation: '— Мы ездили в Италию. (урок 4)',              hintWord: 'sind',   hintRule: 'движение → sein' },
      { before: '— Berlin ist größer',        blank: 'als',    after: 'München.',                 translation: '— Берлин больше Мюнхена. (уроки 5, 18)',      hintWord: 'als',    hintRule: 'Komparativ + als' },
      { before: '— Ich lerne Deutsch,',       blank: 'weil',   after: 'ich hier lebe.',           translation: '— Я учу немецкий, потому что живу здесь. (урок 7)', hintWord: 'weil', hintRule: 'weil — глагол в конец' },
      { before: '— Ich freue mich',           blank: 'auf',    after: 'das Wochenende.',          translation: '— Жду выходных с нетерпением. (урок 12)',     hintWord: 'auf',    hintRule: 'freuen auf = ждать (будущее)' },
      { before: '— Gestern',                  blank: 'hatte',  after: 'ich keine Zeit.',          translation: '— Вчера у меня не было времени. (урок 17)',   hintWord: 'hatte',  hintRule: 'haben → hatte' },
      { before: '— Nächstes Jahr',            blank: 'werde',  after: 'ich nach Deutschland fliegen.', translation: '— В следующем году я полечу в Германию. (урок 19)', hintWord: 'werde', hintRule: 'Futur I: ich → werde' }
    ],

    multipleChoice: [
      { question: '«Ich rufe dich an» — какой инфинитив?',            options: ['rufen', 'anrufen', 'aufrufen', 'rufen an'],                       correctIndex: 1 },
      { question: 'Perfekt от «fahren»…',                             options: ['hat gefahren', 'ist gefahren', 'ist gefahrt', 'hat fahren'],      correctIndex: 1 },
      { question: '«…, weil ich müde …» — где глагол?',               options: ['weil bin ich müde', 'weil ich bin müde', 'weil ich müde bin', 'bin weil ich müde'], correctIndex: 2 },
      { question: 'Wo? «Книга лежит … столе»',                        options: ['auf den Tisch', 'auf dem Tisch', 'auf der Tisch', 'auf das Tisch'], correctIndex: 1 },
      { question: 'Компаратив от «gut»…',                             options: ['guter', 'mehr gut', 'besser', 'am gut'],                          correctIndex: 2 },
      { question: 'Прошедшее от «sein» в разговоре…',                 options: ['ich bin gewesen', 'ich war', 'ich wurde', 'ich hatte'],           correctIndex: 1 },
      { question: 'Сверхвежливая просьба…',                           options: ['Bring mir Wasser!', 'Ich will Wasser.', 'Könnten Sie mir Wasser bringen?', 'Wasser, bitte, schnell!'], correctIndex: 2 },
      { question: 'Futur I: «Я буду учиться» — …',                    options: ['Ich werde lernen.', 'Ich will lernen.', 'Ich lerne werden.', 'Ich bin lernen.'], correctIndex: 0 }
    ],

    matching: [
      { id: 1, de: 'Was hast du am Wochenende gemacht?', ru: 'Что ты делал на выходных?' },
      { id: 2, de: 'Wie komme ich zum Bahnhof?',         ru: 'Как пройти к вокзалу?' },
      { id: 3, de: 'Was fehlt Ihnen?',                   ru: 'Что вас беспокоит? (у врача)' },
      { id: 4, de: 'Die Rechnung, bitte!',               ru: 'Счёт, пожалуйста!' },
      { id: 5, de: 'Worauf freust du dich?',             ru: 'Чего ты ждёшь с нетерпением?' },
      { id: 6, de: 'Wie war dein Urlaub?',               ru: 'Как прошёл твой отпуск?' },
      { id: 7, de: 'Was sind deine Pläne für morgen?',   ru: 'Какие у тебя планы на завтра?' },
      { id: 8, de: 'Treibst du Sport?',                  ru: 'Ты занимаешься спортом?' }
    ],

    dictation: [
      { word: 'aufstehen',    audio: 'aufstehen' },
      { word: 'Urlaub',       audio: 'Urlaub' },
      { word: 'Rechnung',     audio: 'Rechnung' },
      { word: 'gratulieren',  audio: 'gratulieren' },
      { word: 'gefahren',     audio: 'gefahren' },
      { word: 'billiger',     audio: 'billiger' },
      { word: 'Zukunft',      audio: 'Zukunft' },
      { word: 'Wochenende',   audio: 'Wochenende' }
    ]
  }
};
