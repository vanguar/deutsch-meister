/* ═══════════════════════════════════════════════
   data/a2-lesson-07.js
   A2 · Урок 7: Beruf und Arbeit — Работа и профессии
                Придаточные предложения с weil, dass, wenn
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-07',
  level: 'A2',
  unit:  7,
  title: 'Beruf und Arbeit',
  subtitle: 'Работа и профессии · придаточные с weil / dass / wenn',

  meta: {
    duration: '35–40 мин',
    wordCount: 26,
    xpReward: 130
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Was bist du von Beruf?',                ru: 'Кто ты по профессии?',                       note: 'von Beruf = по профессии', audio: 'Was bist du von Beruf' },
    { de: 'Ich bin Lehrer von Beruf.',             ru: 'Я учитель по профессии.',                    note: 'Без артикля у профессии после sein!', audio: 'Ich bin Lehrer von Beruf' },
    { de: 'Ich arbeite als Ingenieur.',            ru: 'Я работаю инженером.',                       note: 'arbeiten als + проф. (без артикля)', audio: 'Ich arbeite als Ingenieur' },
    { de: 'Wo arbeitest du?',                      ru: 'Где ты работаешь?',                          note: 'arbeiten — du arbeitest (с -e- вставлен.)', audio: 'Wo arbeitest du' },
    { de: 'Ich arbeite bei einer Firma.',          ru: 'Я работаю в фирме.',                         note: 'bei + Dat. = в (компании)', audio: 'Ich arbeite bei einer Firma' },
    { de: 'Ich arbeite in einem Büro.',            ru: 'Я работаю в офисе.',                         note: 'in + Dat. (где?). das Büro — Dat. einem', audio: 'Ich arbeite in einem Büro' },
    { de: 'Ich verdiene 2500 Euro im Monat.',      ru: 'Я зарабатываю 2500 евро в месяц.',           note: 'verdienen — зарабатывать', audio: 'Ich verdiene zweitausendfünfhundert Euro im Monat' },
    { de: 'Ich arbeite von neun bis siebzehn Uhr.',ru: 'Я работаю с 9 до 17 часов.',                 note: 'von … bis … = с … до …', audio: 'Ich arbeite von neun bis siebzehn Uhr' },
    { de: 'Mein Chef ist sehr nett.',              ru: 'Мой шеф очень милый.',                       note: 'der Chef [ʃɛf]', audio: 'Mein Chef ist sehr nett' },
    { de: 'Ich arbeite als Lehrer, weil ich Kinder mag.', ru: 'Я работаю учителем, потому что люблю детей.', note: 'weil → глагол в самый конец!', audio: 'Ich arbeite als Lehrer weil ich Kinder mag' },
    { de: 'Ich finde, dass meine Arbeit interessant ist.', ru: 'Я считаю, что моя работа интересная.', note: 'dass → глагол в конец', audio: 'Ich finde dass meine Arbeit interessant ist' },
    { de: 'Wenn ich Zeit habe, lese ich Bücher.',  ru: 'Когда у меня есть время, я читаю книги.',    note: 'wenn → глагол в конец; в гл.предл. инверсия', audio: 'Wenn ich Zeit habe lese ich Bücher' },
    { de: 'Ich glaube, dass er ein guter Arzt ist.', ru: 'Я думаю, что он хороший врач.',           note: 'glauben + dass-Satz', audio: 'Ich glaube dass er ein guter Arzt ist' },
    { de: 'Warum lernst du Deutsch?',              ru: 'Почему ты учишь немецкий?',                  note: 'warum = почему', audio: 'Warum lernst du Deutsch' },
    { de: 'Weil ich in Deutschland arbeiten will.',ru: 'Потому что я хочу работать в Германии.',     note: 'модальный + инфинитив в конце!', audio: 'Weil ich in Deutschland arbeiten will' },
    { de: 'Ich habe heute viel zu tun.',           ru: 'У меня сегодня много дел.',                  note: 'viel zu tun = много дел', audio: 'Ich habe heute viel zu tun' },
    { de: 'Die Arbeit macht mir Spaß.',            ru: 'Работа доставляет мне удовольствие.',        note: 'machen + Dat. + Akk.', audio: 'Die Arbeit macht mir Spaß' },
    { de: 'Ich bin Studentin.',                    ru: 'Я студентка.',                               note: 'Женская форма обычно на -in', audio: 'Ich bin Studentin' },
    { de: 'Mein Job ist anstrengend.',             ru: 'Моя работа утомительная.',                   note: 'der Job [dʒɔb] — англицизм', audio: 'Mein Job ist anstrengend' },
    { de: 'Ich bin selbstständig.',                ru: 'Я работаю на себя.',                         note: 'selbstständig = самозанятый', audio: 'Ich bin selbstständig' },
    { de: 'Ich habe um zehn ein Meeting.',         ru: 'У меня в 10 встреча.',                       note: 'das Meeting (англ.) или die Besprechung', audio: 'Ich habe um zehn ein Meeting' },
    { de: 'Heute habe ich frei.',                  ru: 'Сегодня у меня выходной.',                   note: 'frei haben — быть свободным/в отгуле', audio: 'Heute habe ich frei' },
    { de: 'Ich suche einen neuen Job.',            ru: 'Я ищу новую работу.',                        note: 'einen → Akk. (м.р.)', audio: 'Ich suche einen neuen Job' },
    { de: 'Es freut mich, dass du da bist.',       ru: 'Я рад, что ты здесь.',                       note: 'es freut mich = я рад. dass-Satz', audio: 'Es freut mich dass du da bist' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'der Beruf',        ru: 'профессия',             ipa: '[bəˈʁuːf]',           article: 'der' },
    { de: 'die Arbeit',       ru: 'работа',                ipa: '[ˈaʁbaɪ̯t]',          article: 'die' },
    { de: 'der Job',          ru: 'работа (англ.)',        ipa: '[dʒɔp]',              article: 'der' },
    { de: 'die Firma',        ru: 'фирма',                 ipa: '[ˈfɪʁma]',            article: 'die' },
    { de: 'das Büro',         ru: 'офис, бюро',            ipa: '[byˈʁoː]',            article: 'das' },
    { de: 'der Chef',         ru: 'шеф, начальник',        ipa: '[ʃɛf]',               article: 'der' },
    { de: 'der Kollege',      ru: 'коллега (м.)',          ipa: '[kɔˈleːɡə]',          article: 'der' },
    { de: 'der Lehrer',       ru: 'учитель',               ipa: '[ˈleːʁɐ]',            article: 'der' },
    { de: 'der Arzt',         ru: 'врач',                  ipa: '[aːɐ̯tst]',           article: 'der' },
    { de: 'der Ingenieur',    ru: 'инженер',               ipa: '[ɪnʒeˈniːɐ̯]',        article: 'der' },
    { de: 'der Verkäufer',    ru: 'продавец',              ipa: '[fɛɐ̯ˈkɔɪ̯fɐ]',       article: 'der' },
    { de: 'der Student',      ru: 'студент',               ipa: '[ʃtuˈdɛnt]',          article: 'der' },
    { de: 'der Polizist',     ru: 'полицейский',           ipa: '[politsˈɪst]',        article: 'der' },
    { de: 'der Koch',         ru: 'повар',                 ipa: '[kɔx]',               article: 'der' },
    { de: 'der Programmierer',ru: 'программист',           ipa: '[pʁoɡʁaˈmiːʁɐ]',     article: 'der' },
    { de: 'arbeiten',         ru: 'работать',              ipa: '[ˈaʁbaɪ̯tn̩]',        article: '' },
    { de: 'verdienen',        ru: 'зарабатывать',          ipa: '[fɛɐ̯ˈdiːnən]',      article: '' },
    { de: 'suchen',           ru: 'искать',                ipa: '[ˈzuːxn̩]',           article: '' },
    { de: 'finden',           ru: 'находить, считать',     ipa: '[ˈfɪndn̩]',           article: '' },
    { de: 'glauben',          ru: 'верить, думать',        ipa: '[ˈɡlaʊ̯bn̩]',        article: '' },
    { de: 'das Gehalt',       ru: 'зарплата',              ipa: '[ɡəˈhalt]',           article: 'das' },
    { de: 'das Meeting',      ru: 'встреча',               ipa: '[ˈmiːtɪŋ]',           article: 'das' },
    { de: 'interessant',      ru: 'интересный',            ipa: '[ɪntəʁɛˈsant]',       article: '' },
    { de: 'anstrengend',      ru: 'утомительный',          ipa: '[ˈanˌʃtʁɛŋənt]',      article: '' },
    { de: 'nett',             ru: 'милый, любезный',       ipa: '[nɛt]',               article: '' },
    { de: 'selbstständig',    ru: 'самозанятый',           ipa: '[ˈzɛlpstʃtɛndɪç]',    article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Придаточные с weil — глагол в конец!',
      body: '<strong>weil</strong> переводится как «потому что». Это <strong>подчинительный союз</strong>: после него глагол улетает в <strong>самый конец</strong> придаточного:<br><br>' +
            '<em>Ich lerne Deutsch, <strong>weil</strong> ich in Deutschland <strong>arbeiten will</strong>.</em><br>' +
            '(Я учу немецкий, потому что хочу работать в Германии.)<br><br>' +
            '<em>Sie ist müde, <strong>weil</strong> sie viel <strong>gearbeitet hat</strong>.</em><br>' +
            '(Она устала, потому что много работала.)<br><br>' +
            '⚠️ Если в конце <strong>несколько глаголов</strong> — спрягаемый стоит <strong>последним</strong>:<br>' +
            '<em>… weil ich Deutsch lernen <strong>will</strong>.</em><br>' +
            '<em>… weil sie gearbeitet <strong>hat</strong>.</em><br><br>' +
            '✦ Между главным и придаточным <strong>обязательно запятая</strong>.',
      conjugation: [
        { pronoun: 'weil',     form: 'потому что',  audio: 'weil',     translation: '+ глагол в конце' },
        { pronoun: 'dass',     form: 'что',         audio: 'dass',     translation: '+ глагол в конце' },
        { pronoun: 'wenn',     form: 'когда, если', audio: 'wenn',     translation: '+ глагол в конце' },
        { pronoun: 'ob',       form: 'ли',          audio: 'ob',       translation: '+ глагол в конце' },
        { pronoun: 'obwohl',   form: 'хотя',        audio: 'obwohl',   translation: '+ глагол в конце' },
        { pronoun: 'damit',    form: 'чтобы',       audio: 'damit',    translation: '+ глагол в конце' }
      ]
    },
    {
      title: '⚡ dass — союз «что»',
      body: '<strong>dass</strong> вводит косвенную речь, мнение, утверждение. Работает так же, как weil — глагол в конец:<br><br>' +
            '<em>Ich denke, <strong>dass</strong> Deutsch wichtig <strong>ist</strong>.</em><br>' +
            '(Я думаю, что немецкий важен.)<br>' +
            '<em>Sie sagt, <strong>dass</strong> sie kein Geld <strong>hat</strong>.</em><br>' +
            '(Она говорит, что у неё нет денег.)<br><br>' +
            'Самые частые глаголы перед dass:<br>' +
            '<em>denken / glauben</em> (думать) · <em>finden</em> (считать) · <em>sagen</em> (говорить) · <em>wissen</em> (знать) · <em>hoffen</em> (надеяться) · <em>meinen</em> (полагать).<br><br>' +
            '⚠️ <strong>dass</strong> (союз «что») — с двумя «s».<br>' +
            '<strong>das</strong> (артикль / «это») — с одной «s».'
    },
    {
      title: '⚡ wenn — «когда / если»',
      body: '<strong>wenn</strong> используется в двух смыслах:<br><br>' +
            '👉 <strong>когда (повторяющееся / условие в будущем)</strong>:<br>' +
            '<em><strong>Wenn</strong> ich Zeit <strong>habe</strong>, lese ich Bücher.</em><br>' +
            '(Когда у меня есть время, я читаю книги.)<br><br>' +
            '👉 <strong>если</strong>:<br>' +
            '<em><strong>Wenn</strong> es morgen <strong>regnet</strong>, bleibe ich zu Hause.</em><br>' +
            '(Если завтра пойдёт дождь, я останусь дома.)<br><br>' +
            '⚠️ Если придаточное стоит <strong>в начале</strong>, в главном предложении начинается с <strong>глагола</strong> (инверсия!): <em>Wenn ich Zeit habe, <strong>lese</strong> ich…</em><br><br>' +
            '👉 Для прошлого («когда — один раз») используется <strong>als</strong>, не wenn:<br>' +
            '<em><strong>Als</strong> ich Kind war, hatte ich einen Hund.</em>'
    },
    {
      title: '💡 Подсказка: «глагол на конец, запятая обязательна»',
      body: 'Запомни главный шаблон A2:<br><br>' +
            '<strong>Главное предложение, СОЮЗ + … + ГЛАГОЛ.</strong><br><br>' +
            '<em>Ich bleibe zu Hause, weil ich krank <strong>bin</strong>.</em><br>' +
            '<em>Er sagt, dass er müde <strong>ist</strong>.</em><br>' +
            '<em>Wenn ich Geld habe, kaufe ich ein Auto.</em><br><br>' +
            'Союзы, которые отправляют глагол в конец, лучше выучить списком:<br>' +
            '<strong>weil, dass, wenn, ob, obwohl, damit, bevor, nachdem, während, seit, als</strong>.<br><br>' +
            '👉 А союзы <strong>und, aber, oder, denn, sondern</strong> — <em>не</em> подчинительные. После них порядок слов <em>обычный</em> (как в простом предложении).'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Ich arbeite als', blank: 'Lehrer',  after: ', weil ich Kinder mag.',  translation: '— Я работаю учителем, потому что люблю детей.', hintWord: 'Lehrer',   hintRule: 'der Lehrer — без артикля после als' },
      { before: '— Ich glaube,',     blank: 'dass',    after: 'er nett ist.',            translation: '— Я думаю, что он милый.',                       hintWord: 'dass',     hintRule: '«что» = dass (две s!)' },
      { before: '— Ich lerne Deutsch, weil ich in Berlin arbeiten', blank: 'will', after: '.', translation: '— Я учу немецкий, потому что хочу работать в Берлине.', hintWord: 'will', hintRule: 'спряг. глагол в самом конце; will' },
      { before: '— Wenn ich Zeit habe,', blank: 'lese', after: 'ich Bücher.',             translation: '— Когда у меня есть время, я читаю книги.',     hintWord: 'lese',     hintRule: 'инверсия: глагол сразу после запятой' },
      { before: '— Ich finde, dass die Arbeit interessant', blank: 'ist', after: '.',    translation: '— Я считаю, что работа интересная.',             hintWord: 'ist',      hintRule: 'sein в конце dass-предложения' },
      { before: '— Ich arbeite bei',   blank: 'einer', after: 'Firma.',                   translation: '— Я работаю в фирме.',                          hintWord: 'einer',    hintRule: 'bei + Dat. die Firma → einer Firma' },
      { before: '— Ich',               blank: 'verdiene', after: '2500 Euro.',            translation: '— Я зарабатываю 2500 евро.',                    hintWord: 'verdiene', hintRule: 'verdienen → ich verdiene' },
      { before: '— Warum?',            blank: 'Weil',    after: 'es Spaß macht.',         translation: '— Почему? — Потому что это весело.',            hintWord: 'Weil',     hintRule: 'ответ на warum часто начинается с Weil' }
    ],

    multipleChoice: [
      { question: 'Куда уходит глагол после «weil»?',                                     options: ['в начало', 'на 2-е место', 'в конец', 'после союза'],                  correctIndex: 2 },
      { question: 'В чём разница между «dass» и «das»?',                                  options: ['нет разницы', 'das — союз, dass — артикль', 'dass — союз «что», das — артикль/«это»', 'dass — только в вопросах'], correctIndex: 2 },
      { question: '«Я работаю учителем» —',                                              options: ['Ich bin ein Lehrer.', 'Ich arbeite als Lehrer.', 'Ich arbeite mit Lehrer.', 'Ich bin Lehrer von Arbeit.'], correctIndex: 1 },
      { question: 'Какой союз требует глагол в конце?',                                  options: ['und', 'aber', 'oder', 'weil'],                                          correctIndex: 3 },
      { question: 'Что делает главное предложение, если придаточное идёт первым?',       options: ['ничего', 'добавляет dass', 'начинается с глагола (инверсия)', 'начинается с союза'], correctIndex: 2 },
      { question: 'Какое слово — союз «когда / если»?',                                  options: ['wenn', 'wann', 'wer', 'wo'],                                            correctIndex: 0 },
      { question: '«Sie ist müde, __ sie viel gearbeitet hat.» —',                       options: ['und', 'aber', 'weil', 'oder'],                                          correctIndex: 2 },
      { question: 'Какая форма глагола стоит ПОСЛЕДНЕЙ в придаточном?',                  options: ['инфинитив', 'причастие', 'спрягаемая форма', 'нет правила'],            correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'der Beruf',       ru: 'профессия' },
      { id: 2, de: 'die Firma',       ru: 'фирма' },
      { id: 3, de: 'der Lehrer',      ru: 'учитель' },
      { id: 4, de: 'der Arzt',        ru: 'врач' },
      { id: 5, de: 'arbeiten',        ru: 'работать' },
      { id: 6, de: 'verdienen',       ru: 'зарабатывать' },
      { id: 7, de: 'weil',            ru: 'потому что' },
      { id: 8, de: 'dass',            ru: 'что (союз)' }
    ],

    dictation: [
      { word: 'Beruf',       audio: 'Beruf' },
      { word: 'Arbeit',      audio: 'Arbeit' },
      { word: 'Firma',       audio: 'Firma' },
      { word: 'Lehrer',      audio: 'Lehrer' },
      { word: 'arbeiten',    audio: 'arbeiten' },
      { word: 'verdienen',   audio: 'verdienen' },
      { word: 'weil',        audio: 'weil' },
      { word: 'interessant', audio: 'interessant' }
    ]
  }
};
