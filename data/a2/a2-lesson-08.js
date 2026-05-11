/* ═══════════════════════════════════════════════
   data/a2-lesson-08.js
   A2 · Урок 8: Wetter und Jahreszeiten — Погода и времена года
                Futur I (werden + Inf.) и Imperativ
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-08',
  level: 'A2',
  unit:  8,
  title: 'Wetter und Jahreszeiten',
  subtitle: 'Погода и времена года · Futur I и Imperativ',

  meta: {
    duration: '35–40 мин',
    wordCount: 26,
    xpReward: 130
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Wie ist das Wetter heute?',                ru: 'Какая сегодня погода?',                       note: 'Стандартный вопрос о погоде', audio: 'Wie ist das Wetter heute' },
    { de: 'Heute ist es sonnig und warm.',            ru: 'Сегодня солнечно и тепло.',                   note: 'es ist + прилагательное', audio: 'Heute ist es sonnig und warm' },
    { de: 'Es regnet seit zwei Stunden.',             ru: 'Дождь идёт уже два часа.',                    note: 'es regnet — безличный оборот', audio: 'Es regnet seit zwei Stunden' },
    { de: 'Morgen wird es schneien.',                 ru: 'Завтра будет идти снег.',                     note: 'Futur I: werden + Inf. в конце', audio: 'Morgen wird es schneien' },
    { de: 'Nimm einen Regenschirm mit!',              ru: 'Возьми зонтик с собой!',                      note: 'Imperativ du: глагол на 1-м месте', audio: 'Nimm einen Regenschirm mit' },
    { de: 'Es ist sehr kalt draußen.',                ru: 'На улице очень холодно.',                     note: 'draußen = снаружи, на улице', audio: 'Es ist sehr kalt draußen' },
    { de: 'Die Sonne scheint hell.',                  ru: 'Солнце ярко светит.',                         note: 'scheinen — светить (неправ.)', audio: 'Die Sonne scheint hell' },
    { de: 'Im Sommer fahren wir ans Meer.',           ru: 'Летом мы едем к морю.',                       note: 'im + сезон = летом / зимой', audio: 'Im Sommer fahren wir ans Meer' },
    { de: 'Im Winter wird es früh dunkel.',           ru: 'Зимой рано темнеет.',                         note: 'Futur I: wird … dunkel', audio: 'Im Winter wird es früh dunkel' },
    { de: 'Es weht ein starker Wind.',                ru: 'Дует сильный ветер.',                         note: 'wehen — дуть (о ветре)', audio: 'Es weht ein starker Wind' },
    { de: 'Welche Jahreszeit magst du?',              ru: 'Какое время года ты любишь?',                 note: 'die Jahreszeit — время года', audio: 'Welche Jahreszeit magst du' },
    { de: 'Ich mag den Herbst am liebsten.',          ru: 'Больше всего я люблю осень.',                 note: 'am liebsten — превосх. от gern', audio: 'Ich mag den Herbst am liebsten' },
    { de: 'Vergiss deine Mütze nicht!',               ru: 'Не забудь свою шапку!',                       note: 'Imperativ + отрицание nicht', audio: 'Vergiss deine Mütze nicht' },
    { de: 'Im Frühling blühen die Blumen.',           ru: 'Весной цветут цветы.',                        note: 'blühen — цвести', audio: 'Im Frühling blühen die Blumen' },
    { de: 'Es wird heute regnen.',                    ru: 'Сегодня будет дождь.',                        note: 'Futur I с безличным es', audio: 'Es wird heute regnen' },
    { de: 'Zieh eine warme Jacke an!',                ru: 'Надень тёплую куртку!',                       note: 'Imperativ + отделяемая прист. an', audio: 'Zieh eine warme Jacke an' },
    { de: 'Es sind 25 Grad im Schatten.',             ru: '25 градусов в тени.',                         note: 'der Grad — градус; im Schatten = в тени', audio: 'Es sind fünfundzwanzig Grad im Schatten' },
    { de: 'Der Himmel ist heute bewölkt.',            ru: 'Сегодня небо облачное.',                      note: 'bewölkt — облачный (часть. II от bewölken)', audio: 'Der Himmel ist heute bewölkt' },
    { de: 'Es gibt ein Gewitter.',                    ru: 'Идёт гроза.',                                 note: 'das Gewitter — гроза', audio: 'Es gibt ein Gewitter' },
    { de: 'Bleib zu Hause bei dem Sturm!',            ru: 'Оставайся дома во время бури!',               note: 'Imperativ du от bleiben', audio: 'Bleib zu Hause bei dem Sturm' },
    { de: 'Im August wird es sehr heiß sein.',        ru: 'В августе будет очень жарко.',                note: 'Futur I с sein: wird … sein', audio: 'Im August wird es sehr heiß sein' },
    { de: 'Geh nicht ohne Schal hinaus!',             ru: 'Не выходи на улицу без шарфа!',               note: 'Imperativ + ohne + Akk.', audio: 'Geh nicht ohne Schal hinaus' },
    { de: 'Der Nebel ist heute sehr dicht.',          ru: 'Сегодня очень густой туман.',                 note: 'der Nebel — туман; dicht — густой', audio: 'Der Nebel ist heute sehr dicht' },
    { de: 'Hoffentlich wird es bald wärmer.',         ru: 'Надеюсь, скоро потеплеет.',                   note: 'hoffentlich = надеюсь; wärmer — компаратив', audio: 'Hoffentlich wird es bald wärmer' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'Wetter',        ru: 'погода',            ipa: '[ˈvɛtɐ]',            article: 'das' },
    { de: 'Jahreszeit',    ru: 'время года',        ipa: '[ˈjaːʁəstsaɪt]',     article: 'die' },
    { de: 'Frühling',      ru: 'весна',             ipa: '[ˈfʁyːlɪŋ]',         article: 'der' },
    { de: 'Sommer',        ru: 'лето',              ipa: '[ˈzɔmɐ]',            article: 'der' },
    { de: 'Herbst',        ru: 'осень',             ipa: '[hɛʁpst]',           article: 'der' },
    { de: 'Winter',        ru: 'зима',              ipa: '[ˈvɪntɐ]',           article: 'der' },
    { de: 'Sonne',         ru: 'солнце',            ipa: '[ˈzɔnə]',            article: 'die' },
    { de: 'Regen',         ru: 'дождь',             ipa: '[ˈʁeːɡn̩]',          article: 'der' },
    { de: 'Schnee',        ru: 'снег',              ipa: '[ʃneː]',             article: 'der' },
    { de: 'Wind',          ru: 'ветер',             ipa: '[vɪnt]',             article: 'der' },
    { de: 'Wolke',         ru: 'облако',            ipa: '[ˈvɔlkə]',           article: 'die' },
    { de: 'Himmel',        ru: 'небо',              ipa: '[ˈhɪml̩]',           article: 'der' },
    { de: 'Gewitter',      ru: 'гроза',             ipa: '[ɡəˈvɪtɐ]',          article: 'das' },
    { de: 'Nebel',         ru: 'туман',             ipa: '[ˈneːbl̩]',          article: 'der' },
    { de: 'Grad',          ru: 'градус',            ipa: '[ɡʁaːt]',            article: 'der' },
    { de: 'Regenschirm',   ru: 'зонт',              ipa: '[ˈʁeːɡn̩ʃɪʁm]',      article: 'der' },
    { de: 'regnen',        ru: 'идти (о дожде)',    ipa: '[ˈʁeːɡnən]',         article: '' },
    { de: 'schneien',      ru: 'идти (о снеге)',    ipa: '[ˈʃnaɪən]',          article: '' },
    { de: 'scheinen',      ru: 'светить',           ipa: '[ˈʃaɪnən]',          article: '' },
    { de: 'wehen',         ru: 'дуть (о ветре)',    ipa: '[ˈveːən]',           article: '' },
    { de: 'werden',        ru: 'становиться/будет', ipa: '[ˈveːɐdn̩]',         article: '' },
    { de: 'kalt',          ru: 'холодный',          ipa: '[kalt]',             article: '' },
    { de: 'warm',          ru: 'тёплый',            ipa: '[vaʁm]',             article: '' },
    { de: 'heiß',          ru: 'жаркий',            ipa: '[haɪs]',             article: '' },
    { de: 'sonnig',        ru: 'солнечный',         ipa: '[ˈzɔnɪç]',           article: '' },
    { de: 'bewölkt',       ru: 'облачный',          ipa: '[bəˈvœlkt]',         article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '🔮 Futur I — будущее время (werden + Infinitiv)',
      body: `
        В немецком языке для будущего времени часто используют <strong>Präsens</strong> с указанием времени (<em>Morgen fahre ich…</em>). Но когда нужно подчеркнуть <strong>предсказание, обещание или намерение</strong>, используется <strong>Futur I</strong>.<br><br>
        Формула: <strong>werden (спрягается)</strong> + <em>Infinitiv (в конце предложения!)</em><br><br>
        <strong>Примеры:</strong><br>
        • Ich <em>werde</em> morgen <strong>arbeiten</strong>. — Я завтра буду работать.<br>
        • Es <em>wird</em> bald <strong>regnen</strong>. — Скоро пойдёт дождь.<br>
        • Wir <em>werden</em> nach München <strong>fahren</strong>. — Мы поедем в Мюнхен.<br><br>
        ⚡ <strong>Запомни:</strong> второй глагол всегда в инфинитиве и стоит в самом конце!<br>
        💡 С <strong>sein</strong> и модальными глаголами: <em>Es wird heiß sein.</em> — Будет жарко.
      `
    },
    {
      title: '✦ Спряжение глагола werden',
      body: `
        Глагол <strong>werden</strong> — неправильный и очень важный: он работает и как смысловой ("становиться"), и как вспомогательный для Futur I и Passiv.<br><br>
        ⚠️ В формах <em>du wirst</em> и <em>er/sie/es wird</em> происходит чередование <strong>e → i</strong>.
      `,
      conjugation: [
        { pronoun: 'ich',       form: 'werde',  audio: 'ich werde',        translation: 'я становлюсь / буду' },
        { pronoun: 'du',        form: 'wirst',  audio: 'du wirst',         translation: 'ты станешь / будешь' },
        { pronoun: 'er/sie/es', form: 'wird',   audio: 'er wird',          translation: 'он станет / будет' },
        { pronoun: 'wir',       form: 'werden', audio: 'wir werden',       translation: 'мы станем / будем' },
        { pronoun: 'ihr',       form: 'werdet', audio: 'ihr werdet',       translation: 'вы станете / будете' },
        { pronoun: 'sie/Sie',   form: 'werden', audio: 'sie werden',       translation: 'они/Вы станут / будут' }
      ]
    },
    {
      title: '📣 Imperativ — повелительное наклонение',
      body: `
        Императив нужен, чтобы дать совет, просьбу или команду. В немецком есть <strong>три формы</strong>: для <em>du</em>, <em>ihr</em> и <em>Sie</em>.<br><br>
        <strong>1. Du-форма</strong> — берём основу глагола (без -en) и убираем -st:<br>
        • du kommst → <em>Komm</em>! (Иди!)<br>
        • du nimmst → <em>Nimm</em>! (Возьми!) — чередование e→i сохраняется<br>
        • du arbeitest → <em>Arbeite</em>! (Работай!) — окончание -e после d/t<br><br>
        <strong>2. Ihr-форма</strong> = форма Präsens без местоимения:<br>
        • ihr kommt → <em>Kommt</em>!<br>
        • ihr nehmt → <em>Nehmt</em>!<br><br>
        <strong>3. Sie-форма</strong> = инфинитив + Sie:<br>
        • <em>Kommen Sie</em>! (Идите!)<br>
        • <em>Nehmen Sie</em> Platz! (Садитесь!)<br><br>
        ⚠️ Глагол всегда на <strong>первом</strong> месте! Отделяемая приставка — в конце:<br>
        <em>Steh auf!</em> (Вставай!), <em>Mach das Fenster zu!</em> (Закрой окно!)
      `
    },
    {
      title: '🌧 Безличные обороты о погоде с "es"',
      body: `
        Когда мы говорим о природных явлениях, в немецком обязательно нужно подлежащее — даже если по смыслу его нет. Поэтому ставится формальное <strong>es</strong>.<br><br>
        <strong>Стандартные обороты:</strong><br>
        • <em>Es regnet.</em> — Идёт дождь.<br>
        • <em>Es schneit.</em> — Идёт снег.<br>
        • <em>Es ist kalt / warm / heiß.</em> — Холодно / тепло / жарко.<br>
        • <em>Es gibt ein Gewitter.</em> — Идёт гроза.<br>
        • <em>Es sind 20 Grad.</em> — 20 градусов. (Внимание: <strong>sind</strong>, не <em>ist</em>!)<br><br>
        💡 <strong>es</strong> здесь — пустое подлежащее, как английское "it" в "it rains". Его никогда нельзя убрать!<br><br>
        ✨ <strong>Запомни связку:</strong> Wie ist das Wetter? — <em>Es ist sonnig und 18 Grad.</em>
      `
    }
  ],

  /* ── Exercises ── */
  exercises: {
    fillBlanks: [
      { before: 'Morgen ', blank: 'wird', after: ' es regnen.',                    translation: 'Завтра пойдёт дождь.',                hintWord: 'wird',       hintRule: '3 л. ед. ч. от werden (Futur I)' },
      { before: 'Es ',     blank: 'regnet', after: ' den ganzen Tag.',             translation: 'Дождь идёт целый день.',              hintWord: 'regnet',     hintRule: 'безличный оборот с es' },
      { before: '',        blank: 'Nimm',  after: ' einen Regenschirm mit!',      translation: 'Возьми зонтик с собой!',              hintWord: 'Nimm',       hintRule: 'Imperativ du от nehmen (e→i)' },
      { before: 'Im ',     blank: 'Sommer', after: ' fahren wir ans Meer.',       translation: 'Летом мы едем к морю.',               hintWord: 'Sommer',     hintRule: 'der Sommer — лето' },
      { before: 'Wir ',    blank: 'werden', after: ' nach Berlin fahren.',        translation: 'Мы поедем в Берлин.',                 hintWord: 'werden',     hintRule: '1 л. мн. ч. от werden' },
      { before: 'Die ',    blank: 'Sonne', after: ' scheint hell.',               translation: 'Солнце светит ярко.',                 hintWord: 'Sonne',      hintRule: 'die Sonne — солнце' },
      { before: '',        blank: 'Zieh',  after: ' eine warme Jacke an!',        translation: 'Надень тёплую куртку!',               hintWord: 'Zieh',       hintRule: 'Imperativ du от anziehen (Zieh … an)' },
      { before: 'Es ',     blank: 'sind',  after: ' 20 Grad heute.',              translation: 'Сегодня 20 градусов.',                hintWord: 'sind',       hintRule: 'после числа градусов — sind, не ist!' }
    ],

    multipleChoice: [
      {
        question: 'Какая форма Futur I правильна: «Завтра он будет работать»?',
        options: ['Morgen er wird arbeiten', 'Morgen wird er arbeiten', 'Morgen arbeitet er werden', 'Morgen er arbeitet wird'],
        correctIndex: 1
      },
      {
        question: 'Imperativ для du от глагола nehmen — это…',
        options: ['Nehme!', 'Nimmst!', 'Nimm!', 'Nehmen!'],
        correctIndex: 2
      },
      {
        question: 'Es … heute sehr kalt.',
        options: ['bin', 'ist', 'sind', 'sein'],
        correctIndex: 1
      },
      {
        question: 'Какое слово означает «осень»?',
        options: ['der Frühling', 'der Sommer', 'der Herbst', 'der Winter'],
        correctIndex: 2
      },
      {
        question: 'Sie-форма Imperativ от kommen звучит как…',
        options: ['Komm Sie!', 'Kommen Sie!', 'Sie kommen!', 'Kommt Sie!'],
        correctIndex: 1
      },
      {
        question: 'Где стоит инфинитив в Futur I?',
        options: ['В начале предложения', 'Сразу после werden', 'В самом конце', 'В середине, перед дополнением'],
        correctIndex: 2
      },
      {
        question: 'Какой глагол означает «идти о снеге»?',
        options: ['regnen', 'wehen', 'scheinen', 'schneien'],
        correctIndex: 3
      },
      {
        question: '… ist das Wetter heute?',
        options: ['Was', 'Wer', 'Wie', 'Wo'],
        correctIndex: 2
      }
    ],

    matching: [
      { id: 1, de: 'die Sonne',     ru: 'солнце' },
      { id: 2, de: 'der Regen',     ru: 'дождь' },
      { id: 3, de: 'der Schnee',    ru: 'снег' },
      { id: 4, de: 'der Wind',      ru: 'ветер' },
      { id: 5, de: 'der Frühling',  ru: 'весна' },
      { id: 6, de: 'der Sommer',    ru: 'лето' },
      { id: 7, de: 'kalt',          ru: 'холодный' },
      { id: 8, de: 'heiß',          ru: 'жаркий' }
    ],

    dictation: [
      { word: 'Wetter',      audio: 'Wetter' },
      { word: 'Sonne',       audio: 'Sonne' },
      { word: 'Regen',       audio: 'Regen' },
      { word: 'Schnee',      audio: 'Schnee' },
      { word: 'Sommer',      audio: 'Sommer' },
      { word: 'Winter',      audio: 'Winter' },
      { word: 'regnen',      audio: 'regnen' },
      { word: 'werden',      audio: 'werden' }
    ]
  }
};
