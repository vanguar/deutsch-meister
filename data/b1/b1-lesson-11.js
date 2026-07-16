/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-11.js
   B1 · Урок 11: Temporale Nebensätze — временные придаточные
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-11',
  level:    'B1',
  unit:     11,
  title:    'Temporale Nebensätze',
  subtitle: 'Временные придаточные · als, wenn, während, bevor, nachdem, seitdem, bis',

  meta: {
    duration:  '35–40 мин',
    wordCount: 20,
    xpReward:  150
  },

  phrases: [
    { de: 'Als ich ein Kind war, wohnte ich auf dem Land.',     ru: 'Когда я был ребёнком, я жил в деревне.',           note: 'als — однократно в прошлом', audio: 'Als ich ein Kind war, wohnte ich auf dem Land' },
    { de: 'Wenn ich Zeit habe, lese ich gern.',                 ru: 'Когда у меня есть время, я с удовольствием читаю.', note: 'wenn — настоящее/повторяемость', audio: 'Wenn ich Zeit habe, lese ich gern' },
    { de: 'Immer wenn es regnet, bleibe ich zu Hause.',         ru: 'Всегда, когда идёт дождь, я остаюсь дома.',        note: 'immer wenn — каждый раз', audio: 'Immer wenn es regnet, bleibe ich zu Hause' },
    { de: 'Als ich gestern nach Hause kam, war niemand da.',    ru: 'Когда я вчера пришёл домой, никого не было.',      note: 'als: один раз в прошлом', audio: 'Als ich gestern nach Hause kam, war niemand da' },
    { de: 'Während ich koche, hört er Musik.',                  ru: 'Пока я готовлю, он слушает музыку.',               note: 'während — параллельные действия', audio: 'Während ich koche, hört er Musik' },
    { de: 'Bevor ich schlafen gehe, putze ich mir die Zähne.',  ru: 'Перед тем как лечь спать, я чищу зубы.',           note: 'bevor — до', audio: 'Bevor ich schlafen gehe, putze ich mir die Zähne' },
    { de: 'Nachdem ich gegessen hatte, ging ich spazieren.',    ru: 'После того как я поел, я пошёл гулять.',           note: 'nachdem + Plusquamperfekt', audio: 'Nachdem ich gegessen hatte, ging ich spazieren' },
    { de: 'Seitdem ich in Deutschland lebe, spreche ich jeden Tag Deutsch.', ru: 'С тех пор как я живу в Германии, я каждый день говорю по-немецки.', note: 'seitdem — с тех пор как', audio: 'Seitdem ich in Deutschland lebe, spreche ich jeden Tag Deutsch' },
    { de: 'Ich warte hier, bis du zurückkommst.',               ru: 'Я подожду здесь, пока ты не вернёшься.',           note: 'bis — до тех пор пока', audio: 'Ich warte hier, bis du zurückkommst' },
    { de: 'Sobald ich die E-Mail bekomme, rufe ich dich an.',   ru: 'Как только я получу письмо, я тебе позвоню.',      note: 'sobald — как только', audio: 'Sobald ich die E-Mail bekomme, rufe ich dich an' },
    { de: 'Solange es hell ist, können wir draußen bleiben.',   ru: 'Пока светло, мы можем оставаться на улице.',       note: 'solange — до тех пор пока (длится)', audio: 'Solange es hell ist, können wir draußen bleiben' },
    { de: 'Als wir in Wien waren, haben wir viele Museen besucht.', ru: 'Когда мы были в Вене, мы посетили много музеев.', note: 'als + Perfekt/Präteritum', audio: 'Als wir in Wien waren, haben wir viele Museen besucht' },
    { de: 'Wenn ich früher Zeit hatte, spielte ich oft Fußball.', ru: 'Когда (каждый раз) у меня раньше было время, я часто играл в футбол.', note: 'wenn в прошлом = повторялось', audio: 'Wenn ich früher Zeit hatte, spielte ich oft Fußball' },
    { de: 'Bevor du gehst, schließ bitte das Fenster.',         ru: 'Прежде чем уйти, закрой, пожалуйста, окно.',       note: 'bevor + императив в главном', audio: 'Bevor du gehst, schließ bitte das Fenster' },
    { de: 'Nachdem sie die Prüfung bestanden hat, feiert sie mit Freunden.', ru: 'После того как она сдала экзамен, она празднует с друзьями.', note: 'nachdem + Perfekt (наст. время в главном)', audio: 'Nachdem sie die Prüfung bestanden hat, feiert sie mit Freunden' },
    { de: 'Während des Essens spricht man nicht mit vollem Mund.', ru: 'Во время еды не говорят с полным ртом.',        note: 'während + Genitiv (урок 10!) vs союз', audio: 'Während des Essens spricht man nicht mit vollem Mund' },
    { de: 'Ich bleibe so lange, bis die Arbeit fertig ist.',    ru: 'Я останусь до тех пор, пока работа не будет готова.', note: 'so lange … bis', audio: 'Ich bleibe so lange, bis die Arbeit fertig ist' },
    { de: 'Seitdem er Sport macht, fühlt er sich viel besser.', ru: 'С тех пор как он занимается спортом, он чувствует себя гораздо лучше.', note: 'seitdem + Präsens', audio: 'Seitdem er Sport macht, fühlt er sich viel besser' },
    { de: 'Sobald der Film anfängt, machen wir das Licht aus.', ru: 'Как только начнётся фильм, мы выключим свет.',     note: 'sobald + отделяемый глагол в конце', audio: 'Sobald der Film anfängt, machen wir das Licht aus' },
    { de: 'Immer wenn ich dieses Lied höre, denke ich an den Sommer.', ru: 'Каждый раз, когда я слышу эту песню, я думаю о лете.', note: 'immer wenn + denken an', audio: 'Immer wenn ich dieses Lied höre, denke ich an den Sommer' }
  ],

  vocabulary: [
    { de: 'als',              ru: 'когда (один раз в прошлом)',   ipa: '[als]',              article: '' },
    { de: 'wenn',             ru: 'когда, если (повторяемость)',  ipa: '[vɛn]',              article: '' },
    { de: 'während',          ru: 'пока, в то время как',         ipa: '[ˈvɛːʁənt]',         article: '' },
    { de: 'bevor',            ru: 'прежде чем',                   ipa: '[bəˈfoːɐ̯]',         article: '' },
    { de: 'nachdem',          ru: 'после того как',               ipa: '[naːxˈdeːm]',        article: '' },
    { de: 'seitdem',          ru: 'с тех пор как',                ipa: '[zaɪ̯tˈdeːm]',       article: '' },
    { de: 'bis',              ru: 'до тех пор пока',              ipa: '[bɪs]',              article: '' },
    { de: 'sobald',           ru: 'как только',                   ipa: '[zoˈbalt]',          article: '' },
    { de: 'solange',          ru: 'пока (длится)',                ipa: '[zoˈlaŋə]',          article: '' },
    { de: 'zurückkommen',     ru: 'возвращаться',                 ipa: '[t͡suˈʁʏkˌkɔmən]',  article: '' },
    { de: 'anfangen',         ru: 'начинаться',                   ipa: '[ˈanˌfaŋən]',        article: '' },
    { de: 'aufhören',         ru: 'прекращаться, заканчивать',    ipa: '[ˈaʊ̯fˌhøːʁən]',    article: '' },
    { de: 'die Kindheit',     ru: 'детство',                      ipa: '[ˈkɪnthaɪ̯t]',       article: 'die' },
    { de: 'die Zähne putzen', ru: 'чистить зубы',                 ipa: '[ˈt͡sɛːnə ˈpʊt͡sn̩]', article: '' },
    { de: 'niemand',          ru: 'никто',                        ipa: '[ˈniːmant]',         article: '' },
    { de: 'draußen',          ru: 'на улице, снаружи',            ipa: '[ˈdʁaʊ̯sn̩]',        article: '' },
    { de: 'das Licht',        ru: 'свет',                         ipa: '[lɪçt]',             article: 'das' },
    { de: 'das Lied',         ru: 'песня',                        ipa: '[liːt]',             article: 'das' },
    { de: 'fertig',           ru: 'готовый, законченный',         ipa: '[ˈfɛʁtɪç]',          article: '' },
    { de: 'auf dem Land',     ru: 'в деревне, за городом',        ipa: '[aʊ̯f deːm lant]',   article: '' }
  ],

  grammar: [
    {
      title: '⚡ als vs. wenn — главная ловушка',
      body: 'Оба переводятся «когда», но:<br><br>' +
            '<strong>als</strong> — <em>однократное</em> событие в прошлом:<br>' +
            '<em><strong>Als</strong> ich Kind war…</em> (детство было один раз!)<br><br>' +
            '<strong>wenn</strong> — настоящее, будущее и <em>повторяющиеся</em> события в прошлом:<br>' +
            '<em><strong>Wenn</strong> ich Zeit habe…</em> / <em><strong>Immer wenn</strong> es regnete…</em><br><br>' +
            'Проверка: можно подставить «каждый раз, когда»? → <strong>wenn</strong>. Нельзя? → <strong>als</strong>.',
      conjugation: [
        { pronoun: 'als',        form: 'Als ich Kind war, …',           audio: 'Als ich Kind war',           translation: 'Когда я был ребёнком, …' },
        { pronoun: 'wenn (наст.)', form: 'Wenn ich Zeit habe, …',       audio: 'Wenn ich Zeit habe',         translation: 'Когда у меня есть время, …' },
        { pronoun: 'immer wenn', form: 'Immer wenn es regnet, …',       audio: 'Immer wenn es regnet',       translation: 'Всегда, когда идёт дождь, …' },
        { pronoun: 'als (1 раз)', form: 'Als er gestern kam, …',        audio: 'Als er gestern kam',         translation: 'Когда он вчера пришёл, …' }
      ]
    },
    {
      title: '⚡ Семь временных союзов',
      body: 'Все они отправляют глагол <strong>в конец придаточного</strong>:<br><br>' +
            '<strong>während</strong> — пока (параллельно) · <strong>bevor</strong> — прежде чем · <strong>nachdem</strong> — после того как · <strong>seitdem</strong> — с тех пор как · <strong>bis</strong> — до тех пор пока · <strong>sobald</strong> — как только · <strong>solange</strong> — пока длится',
      conjugation: [
        { pronoun: 'während', form: 'Während ich koche, hört er Musik.',    audio: 'Während ich koche, hört er Musik',    translation: 'Пока я готовлю, он слушает музыку.' },
        { pronoun: 'bevor',   form: 'Bevor ich gehe, rufe ich an.',         audio: 'Bevor ich gehe, rufe ich an',         translation: 'Прежде чем уйти, я позвоню.' },
        { pronoun: 'bis',     form: 'Ich warte, bis du kommst.',            audio: 'Ich warte, bis du kommst',            translation: 'Я жду, пока ты не придёшь.' },
        { pronoun: 'sobald',  form: 'Sobald ich es weiß, sage ich es dir.', audio: 'Sobald ich es weiß, sage ich es dir', translation: 'Как только узнаю, скажу тебе.' },
        { pronoun: 'seitdem', form: 'Seitdem er hier lebt, ist er glücklich.', audio: 'Seitdem er hier lebt, ist er glücklich', translation: 'С тех пор как он живёт здесь, он счастлив.' }
      ]
    },
    {
      title: '💡 nachdem и согласование времён',
      body: 'После <strong>nachdem</strong> действие всегда происходит <em>раньше</em>, поэтому время в придаточном — «на шаг назад»:<br><br>' +
            'Главное в <strong>Präteritum/Perfekt</strong> → придаточное в <strong>Plusquamperfekt</strong>:<br>' +
            '<em>Nachdem ich gegessen <strong>hatte</strong>, ging ich spazieren.</em><br><br>' +
            'Главное в <strong>Präsens</strong> → придаточное в <strong>Perfekt</strong>:<br>' +
            '<em>Nachdem ich gegessen <strong>habe</strong>, gehe ich spazieren.</em><br><br>' +
            'Не забудь: <strong>während</strong> может быть и предлогом с Genitiv (урок 10): <em>während des Essens</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '—',                    blank: 'Als',      after: 'ich Kind war, wohnte ich in Kyjiw.', translation: '— Когда я был ребёнком, я жил в Киеве.', hintWord: 'Als',  hintRule: 'однократно в прошлом → als' },
      { before: '—',                    blank: 'Wenn',     after: 'ich Zeit habe, lese ich.',       translation: '— Когда у меня есть время, я читаю.',    hintWord: 'Wenn',    hintRule: 'настоящее время → wenn' },
      { before: '—',                    blank: 'Bevor',    after: 'ich schlafe, putze ich mir die Zähne.', translation: '— Перед сном я чищу зубы.',       hintWord: 'Bevor',   hintRule: 'прежде чем = bevor' },
      { before: '— Nachdem ich gegessen', blank: 'hatte',  after: ', ging ich spazieren.',          translation: '— После того как я поел, я пошёл гулять.', hintWord: 'hatte', hintRule: 'nachdem + Plusquamperfekt' },
      { before: '— Ich warte,',         blank: 'bis',      after: 'du zurückkommst.',               translation: '— Я жду, пока ты не вернёшься.',          hintWord: 'bis',     hintRule: 'до тех пор пока = bis' },
      { before: '—',                    blank: 'Sobald',   after: 'ich es weiß, rufe ich an.',      translation: '— Как только узнаю, позвоню.',            hintWord: 'Sobald',  hintRule: 'как только = sobald' },
      { before: '—',                    blank: 'Seitdem',  after: 'ich hier lebe, lerne ich Deutsch.', translation: '— С тех пор как я живу здесь, я учу немецкий.', hintWord: 'Seitdem', hintRule: 'с тех пор как = seitdem' },
      { before: '— Während ich koche,', blank: 'hört',     after: 'er Musik.',                      translation: '— Пока я готовлю, он слушает музыку.',    hintWord: 'hört',    hintRule: 'главное предложение: глагол на 1-м месте после запятой' }
    ],

    multipleChoice: [
      { question: '«Когда я был молод…» — …',                          options: ['Wenn ich jung war', 'Als ich jung war', 'Ob ich jung war', 'Während ich jung war'], correctIndex: 1 },
      { question: '«Каждый раз, когда идёт дождь» — …',                 options: ['Als es regnet', 'Immer wenn es regnet', 'Nachdem es regnet', 'Bis es regnet'], correctIndex: 1 },
      { question: 'После nachdem (главное в Präteritum) — какое время?', options: ['Präsens', 'Perfekt', 'Plusquamperfekt', 'Futur I'],              correctIndex: 2 },
      { question: '«bevor» значит…',                                   options: ['после того как', 'прежде чем', 'как только', 'пока'],             correctIndex: 1 },
      { question: '«sobald» значит…',                                  options: ['пока длится', 'как только', 'до тех пор', 'с тех пор'],           correctIndex: 1 },
      { question: 'Где глагол в придаточном с seitdem?',                options: ['на 1-м месте', 'на 2-м месте', 'в конце', 'перед союзом'],        correctIndex: 2 },
      { question: '«Я жду, пока ты не придёшь» — …',                    options: ['Ich warte, bis du kommst.', 'Ich warte, bevor du kommst.', 'Ich warte, als du kommst.', 'Ich warte, ob du kommst.'], correctIndex: 0 },
      { question: '«während» как предлог требует…',                     options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],                     correctIndex: 2 }
    ],

    matching: [
      { id: 1, de: 'als',        ru: 'когда (1 раз в прошлом)' },
      { id: 2, de: 'immer wenn', ru: 'каждый раз, когда' },
      { id: 3, de: 'bevor',      ru: 'прежде чем' },
      { id: 4, de: 'nachdem',    ru: 'после того как' },
      { id: 5, de: 'seitdem',    ru: 'с тех пор как' },
      { id: 6, de: 'bis',        ru: 'до тех пор пока' },
      { id: 7, de: 'sobald',     ru: 'как только' },
      { id: 8, de: 'solange',    ru: 'пока (длится)' }
    ],

    dictation: [
      { word: 'nachdem',      audio: 'nachdem' },
      { word: 'seitdem',      audio: 'seitdem' },
      { word: 'sobald',       audio: 'sobald' },
      { word: 'solange',      audio: 'solange' },
      { word: 'bevor',        audio: 'bevor' },
      { word: 'Kindheit',     audio: 'Kindheit' },
      { word: 'draußen',      audio: 'draußen' },
      { word: 'zurückkommen', audio: 'zurückkommen' }
    ]
  }
};
