/* ═══════════════════════════════════════════════
   data/a2-lesson-06.js
   A2 · Урок 6: Wohnen und Möbel — Жильё и мебель
                Wechselpräpositionen: Wo? + Dativ / Wohin? + Akkusativ
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:    'a2-06',
  level: 'A2',
  unit:  6,
  title: 'Wohnen und Möbel',
  subtitle: 'Жильё и мебель · «двойные» предлоги Wo? / Wohin?',

  meta: {
    duration: '35–40 мин',
    wordCount: 26,
    xpReward: 130
  },

  /* ── Phrases ── */
  phrases: [
    { de: 'Ich wohne in einer Wohnung.',           ru: 'Я живу в квартире.',                        note: 'wohnen in + Dat. (где живу)', audio: 'Ich wohne in einer Wohnung' },
    { de: 'Meine Wohnung hat drei Zimmer.',        ru: 'У моей квартиры три комнаты.',              note: '«3-Zimmer-Wohnung» = трёхкомнатная', audio: 'Meine Wohnung hat drei Zimmer' },
    { de: 'Das Sofa steht im Wohnzimmer.',         ru: 'Диван стоит в гостиной.',                   note: 'im = in + dem (Dat., где?)', audio: 'Das Sofa steht im Wohnzimmer' },
    { de: 'Ich stelle die Lampe auf den Tisch.',   ru: 'Я ставлю лампу на стол.',                   note: 'stellen → Akk. (куда?). den Tisch — Akk.', audio: 'Ich stelle die Lampe auf den Tisch' },
    { de: 'Das Bild hängt an der Wand.',           ru: 'Картина висит на стене.',                   note: 'an + Dat. (где висит). der Wand — Dat.', audio: 'Das Bild hängt an der Wand' },
    { de: 'Ich hänge das Bild an die Wand.',       ru: 'Я вешаю картину на стену.',                 note: 'an + Akk. (куда вешаю). die Wand — Akk.', audio: 'Ich hänge das Bild an die Wand' },
    { de: 'Die Katze liegt unter dem Bett.',       ru: 'Кошка лежит под кроватью.',                 note: 'liegen + Dat. (где?). unter + Dat.', audio: 'Die Katze liegt unter dem Bett' },
    { de: 'Die Lampe steht neben dem Sofa.',       ru: 'Лампа стоит рядом с диваном.',              note: 'neben + Dat. (где?)', audio: 'Die Lampe steht neben dem Sofa' },
    { de: 'Das Buch liegt zwischen den Stühlen.',  ru: 'Книга лежит между стульями.',               note: 'zwischen + Dat.Pl. (-n!)', audio: 'Das Buch liegt zwischen den Stühlen' },
    { de: 'Ich gehe in die Küche.',                ru: 'Я иду на кухню.',                           note: 'in + Akk. (куда?). die Küche — Akk.', audio: 'Ich gehe in die Küche' },
    { de: 'Ich bin in der Küche.',                 ru: 'Я нахожусь на кухне.',                      note: 'in + Dat. (где?). der Küche — Dat.', audio: 'Ich bin in der Küche' },
    { de: 'Wo ist mein Schlüssel?',                ru: 'Где мой ключ?',                             note: 'der Schlüssel — ключ', audio: 'Wo ist mein Schlüssel' },
    { de: 'Er liegt auf dem Tisch.',               ru: 'Он лежит на столе.',                        note: 'auf + Dat. (где?). dem Tisch — Dat.', audio: 'Er liegt auf dem Tisch' },
    { de: 'Wohin gehst du?',                       ru: 'Куда ты идёшь?',                            note: 'wohin = куда (с движением)', audio: 'Wohin gehst du' },
    { de: 'Ich gehe ins Bad.',                     ru: 'Я иду в ванную.',                           note: 'ins = in + das. das Bad — Akk.', audio: 'Ich gehe ins Bad' },
    { de: 'Meine Wohnung ist hell und gemütlich.', ru: 'Моя квартира светлая и уютная.',            note: 'gemütlich — очень «немецкое» слово!', audio: 'Meine Wohnung ist hell und gemütlich' },
    { de: 'Die Miete kostet 800 Euro.',            ru: 'Аренда стоит 800 евро.',                    note: 'die Miete — арендная плата', audio: 'Die Miete kostet achthundert Euro' },
    { de: 'Ich suche eine neue Wohnung.',          ru: 'Я ищу новую квартиру.',                     note: 'suchen + Akk. — искать', audio: 'Ich suche eine neue Wohnung' },
    { de: 'Wo wohnst du?',                         ru: 'Где ты живёшь?',                            note: 'wo = где (без движения)', audio: 'Wo wohnst du' },
    { de: 'Im ersten Stock.',                      ru: 'На первом этаже.',                          note: '⚠️ ersten Stock у нас = 2-й этаж РФ!', audio: 'Im ersten Stock' },
    { de: 'Ich setze mich auf das Sofa.',          ru: 'Я сажусь на диван.',                        note: 'sich setzen + Akk. (направление)', audio: 'Ich setze mich auf das Sofa' },
    { de: 'Er sitzt auf dem Sofa.',                ru: 'Он сидит на диване.',                       note: 'sitzen + Dat. (где?)', audio: 'Er sitzt auf dem Sofa' },
    { de: 'Vor dem Haus gibt es einen Garten.',    ru: 'Перед домом есть сад.',                     note: 'vor + Dat. (где?). es gibt + Akk.', audio: 'Vor dem Haus gibt es einen Garten' },
    { de: 'Hinter dem Sofa ist die Heizung.',      ru: 'За диваном — батарея.',                     note: 'hinter + Dat. (где?)', audio: 'Hinter dem Sofa ist die Heizung' }
  ],

  /* ── Vocabulary ── */
  vocabulary: [
    { de: 'die Wohnung',      ru: 'квартира',              ipa: '[ˈvoːnʊŋ]',           article: 'die' },
    { de: 'das Haus',         ru: 'дом',                   ipa: '[haʊ̯s]',             article: 'das' },
    { de: 'das Zimmer',       ru: 'комната',               ipa: '[ˈtsɪmɐ]',            article: 'das' },
    { de: 'das Wohnzimmer',   ru: 'гостиная',              ipa: '[ˈvoːnˌtsɪmɐ]',       article: 'das' },
    { de: 'das Schlafzimmer', ru: 'спальня',               ipa: '[ˈʃlaːfˌtsɪmɐ]',      article: 'das' },
    { de: 'die Küche',        ru: 'кухня',                 ipa: '[ˈkʏçə]',             article: 'die' },
    { de: 'das Bad',          ru: 'ванная',                ipa: '[baːt]',              article: 'das' },
    { de: 'der Flur',         ru: 'прихожая, коридор',     ipa: '[fluːɐ̯]',            article: 'der' },
    { de: 'der Balkon',       ru: 'балкон',                ipa: '[balˈkɔŋ]',           article: 'der' },
    { de: 'das Sofa',         ru: 'диван',                 ipa: '[ˈzoːfa]',            article: 'das' },
    { de: 'der Tisch',        ru: 'стол',                  ipa: '[tɪʃ]',               article: 'der' },
    { de: 'der Stuhl',        ru: 'стул',                  ipa: '[ʃtuːl]',             article: 'der' },
    { de: 'das Bett',         ru: 'кровать',               ipa: '[bɛt]',               article: 'das' },
    { de: 'der Schrank',      ru: 'шкаф',                  ipa: '[ʃʁaŋk]',             article: 'der' },
    { de: 'die Lampe',        ru: 'лампа',                 ipa: '[ˈlampə]',            article: 'die' },
    { de: 'das Bild',         ru: 'картина',               ipa: '[bɪlt]',              article: 'das' },
    { de: 'die Wand',         ru: 'стена',                 ipa: '[vant]',              article: 'die' },
    { de: 'der Boden',        ru: 'пол',                   ipa: '[ˈboːdn̩]',           article: 'der' },
    { de: 'das Fenster',      ru: 'окно',                  ipa: '[ˈfɛnstɐ]',           article: 'das' },
    { de: 'die Tür',          ru: 'дверь',                 ipa: '[tyːɐ̯]',             article: 'die' },
    { de: 'die Miete',        ru: 'аренда',                ipa: '[ˈmiːtə]',            article: 'die' },
    { de: 'der Stock',        ru: 'этаж',                  ipa: '[ʃtɔk]',              article: 'der' },
    { de: 'stellen',          ru: 'ставить (вертик.)',     ipa: '[ˈʃtɛlən]',           article: '' },
    { de: 'legen',            ru: 'класть (горизонт.)',    ipa: '[ˈleːɡn̩]',           article: '' },
    { de: 'hängen',           ru: 'вешать / висеть',       ipa: '[ˈhɛŋən]',            article: '' },
    { de: 'gemütlich',        ru: 'уютный',                ipa: '[ɡəˈmyːtlɪç]',        article: '' }
  ],

  /* ── Grammar ── */
  grammar: [
    {
      title: '⚡ Wechselpräpositionen — главная тема урока',
      body: 'В немецком есть <strong>9 «двойных» предлогов</strong>, которые могут требовать <strong>и</strong> датив, <strong>и</strong> аккузатив. Выбор зависит от вопроса:<br><br>' +
            '👉 <strong>Wo? (где?)</strong> — без движения, статика → <strong>Dativ</strong><br>' +
            '👉 <strong>Wohin? (куда?)</strong> — есть движение к цели → <strong>Akkusativ</strong><br><br>' +
            'Сравни:<br>' +
            '<em>Ich bin <strong>in der Küche</strong>.</em> (Wo? — Dat.) — Я <strong>на</strong> кухне.<br>' +
            '<em>Ich gehe <strong>in die Küche</strong>.</em> (Wohin? — Akk.) — Я иду <strong>на</strong> кухню.<br><br>' +
            'Те самые 9 предлогов:',
      conjugation: [
        { pronoun: 'in',       form: 'в, на (внутрь)',     audio: 'in',       translation: 'в комнате / в комнату' },
        { pronoun: 'auf',      form: 'на (поверхн.)',      audio: 'auf',      translation: 'на столе / на стол' },
        { pronoun: 'an',       form: 'у, около, на',       audio: 'an',       translation: 'у стены / к стене' },
        { pronoun: 'unter',    form: 'под',                audio: 'unter',    translation: 'под столом / под стол' },
        { pronoun: 'über',     form: 'над',                audio: 'über',     translation: 'над столом / над стол' },
        { pronoun: 'vor',      form: 'перед',              audio: 'vor',      translation: 'перед домом' },
        { pronoun: 'hinter',   form: 'за, позади',         audio: 'hinter',   translation: 'за домом' },
        { pronoun: 'neben',    form: 'рядом с',            audio: 'neben',    translation: 'рядом с диваном' },
        { pronoun: 'zwischen', form: 'между',              audio: 'zwischen', translation: 'между столами' }
      ]
    },
    {
      title: '⚡ Глаголы-«близнецы»: legen/liegen, stellen/stehen',
      body: 'Чтобы понять, нужен ли датив или аккузатив, посмотри на <strong>глагол</strong>. Они идут парами — действие и результат:<br><br>' +
            '<strong>stellen</strong> (ставить, Akk.) ↔ <strong>stehen</strong> (стоять, Dat.)<br>' +
            '<em>Ich <strong>stelle</strong> die Lampe <strong>auf den</strong> Tisch.</em> (Akk.)<br>' +
            '<em>Die Lampe <strong>steht auf dem</strong> Tisch.</em> (Dat.)<br><br>' +
            '<strong>legen</strong> (класть, Akk.) ↔ <strong>liegen</strong> (лежать, Dat.)<br>' +
            '<em>Ich <strong>lege</strong> das Buch <strong>auf den</strong> Tisch.</em> (Akk.)<br>' +
            '<em>Das Buch <strong>liegt auf dem</strong> Tisch.</em> (Dat.)<br><br>' +
            '<strong>hängen</strong> (вешать, Akk.) ↔ <strong>hängen</strong> (висеть, Dat.)<br>' +
            '<em>Ich <strong>hänge</strong> das Bild <strong>an die</strong> Wand.</em> (Akk.)<br>' +
            '<em>Das Bild <strong>hängt an der</strong> Wand.</em> (Dat.)<br><br>' +
            '<strong>setzen / sitzen</strong>: <em>Ich setze mich aufs Sofa</em> (Akk.) / <em>Ich sitze auf dem Sofa</em> (Dat.).<br><br>' +
            '✨ Шпаргалка: <strong>динамика → Akk.</strong>, <strong>статика → Dat.</strong>',
      conjugation: [
        { pronoun: 'stellen',  form: '+ Akk. (куда)',  audio: 'stellen', translation: 'ставить (вертикально)' },
        { pronoun: 'stehen',   form: '+ Dat. (где)',   audio: 'stehen',  translation: 'стоять' },
        { pronoun: 'legen',    form: '+ Akk. (куда)',  audio: 'legen',   translation: 'класть (горизонт.)' },
        { pronoun: 'liegen',   form: '+ Dat. (где)',   audio: 'liegen',  translation: 'лежать' },
        { pronoun: 'hängen-1', form: '+ Akk. (куда)',  audio: 'hängen Akkusativ', translation: 'вешать' },
        { pronoun: 'hängen-2', form: '+ Dat. (где)',   audio: 'hängen Dativ',     translation: 'висеть' }
      ]
    },
    {
      title: '⚡ Слияния: im, ins, am, ans',
      body: 'Немцы любят сливать предлоги с артиклями. <strong>Обязательно запомни</strong> эти 4 пары:<br><br>' +
            '<strong>in + dem = im</strong> (где?) → <em>im Wohnzimmer</em><br>' +
            '<strong>in + das = ins</strong> (куда?) → <em>ins Wohnzimmer</em><br>' +
            '<strong>an + dem = am</strong> (где?) → <em>am Fenster</em><br>' +
            '<strong>an + das = ans</strong> (куда?) → <em>ans Fenster</em><br><br>' +
            'Ещё: <em>auf + dem = aufm</em> (только разговорно!), <em>vor + dem = vorm</em>.<br><br>' +
            'Все слитные формы — это пары к мужскому и среднему роду в дативе/аккузативе.'
    },
    {
      title: '💡 Местонахождение vs направление — мини-тренинг',
      body: 'Один и тот же объект, два разных вопроса:<br><br>' +
            '<strong>Wo? (Dat.)</strong> &nbsp;|&nbsp; <strong>Wohin? (Akk.)</strong><br>' +
            '<em>im Park</em> &nbsp;|&nbsp; <em>in den Park</em><br>' +
            '<em>auf dem Tisch</em> &nbsp;|&nbsp; <em>auf den Tisch</em><br>' +
            '<em>an der Wand</em> &nbsp;|&nbsp; <em>an die Wand</em><br>' +
            '<em>im Bad</em> &nbsp;|&nbsp; <em>ins Bad</em><br>' +
            '<em>im Bett</em> &nbsp;|&nbsp; <em>ins Bett</em><br>' +
            '<em>am Fenster</em> &nbsp;|&nbsp; <em>ans Fenster</em><br><br>' +
            '✨ Правило одной фразы: <strong>«ich bin» → Dativ, «ich gehe/fahre» → Akkusativ</strong>.'
    }
  ],

  /* ── Exercises ── */
  exercises: {

    fillBlanks: [
      { before: '— Das Sofa steht',     blank: 'im',       after: 'Wohnzimmer.',         translation: '— Диван стоит в гостиной.',              hintWord: 'im',       hintRule: 'wo? + Dat. → in + dem = im' },
      { before: '— Ich gehe',           blank: 'ins',      after: 'Bad.',                translation: '— Я иду в ванную.',                       hintWord: 'ins',      hintRule: 'wohin? + Akk. → in + das = ins' },
      { before: '— Die Lampe steht auf dem', blank: 'Tisch', after: '.',                  translation: '— Лампа стоит на столе.',                 hintWord: 'Tisch',    hintRule: 'der Tisch → Dat. (auf + dem)' },
      { before: '— Ich stelle die Lampe auf den', blank: 'Tisch', after: '.',            translation: '— Я ставлю лампу на стол.',               hintWord: 'Tisch',    hintRule: 'wohin? → Akk. den Tisch' },
      { before: '— Das Bild hängt',     blank: 'an',       after: 'der Wand.',            translation: '— Картина висит на стене.',               hintWord: 'an',       hintRule: 'an + Dat. der Wand (wo?)' },
      { before: '— Die Katze liegt',    blank: 'unter',    after: 'dem Bett.',            translation: '— Кошка лежит под кроватью.',             hintWord: 'unter',    hintRule: 'unter + Dat. (wo?)' },
      { before: '— Wohin gehst',        blank: 'du',       after: '?',                    translation: '— Куда ты идёшь?',                        hintWord: 'du',       hintRule: 'du — местоимение «ты»' },
      { before: '— Ich wohne im ersten', blank: 'Stock',   after: '.',                    translation: '— Я живу на первом этаже.',               hintWord: 'Stock',    hintRule: 'der Stock — этаж' }
    ],

    multipleChoice: [
      { question: 'Какой падеж после «wo?»?',                                            options: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],                          correctIndex: 2 },
      { question: 'Какой падеж после «wohin?»?',                                          options: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],                          correctIndex: 1 },
      { question: '«Я в кухне» —',                                                       options: ['Ich bin in die Küche.', 'Ich bin in der Küche.', 'Ich bin im Küche.', 'Ich bin in Küche.'], correctIndex: 1 },
      { question: 'Какое слияние верно?',                                                 options: ['in + dem = ins', 'in + das = im', 'in + dem = im', 'in + die = im'], correctIndex: 2 },
      { question: 'Какой глагол требует Dativ?',                                          options: ['stellen', 'legen', 'hängen (вешать)', 'liegen'],                       correctIndex: 3 },
      { question: 'Какой предлог НЕ из «двойных»?',                                       options: ['neben', 'mit', 'zwischen', 'über'],                                    correctIndex: 1 },
      { question: '«Я кладу книгу на стол» —',                                            options: ['Ich lege das Buch auf dem Tisch.', 'Ich lege das Buch auf den Tisch.', 'Ich liege das Buch auf den Tisch.', 'Ich lege das Buch in dem Tisch.'], correctIndex: 1 },
      { question: 'Что значит «gemütlich»?',                                              options: ['современный', 'уютный', 'дорогой', 'светлый'],                          correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'das Wohnzimmer',  ru: 'гостиная' },
      { id: 2, de: 'die Küche',       ru: 'кухня' },
      { id: 3, de: 'das Schlafzimmer',ru: 'спальня' },
      { id: 4, de: 'das Bad',         ru: 'ванная' },
      { id: 5, de: 'der Tisch',       ru: 'стол' },
      { id: 6, de: 'der Stuhl',       ru: 'стул' },
      { id: 7, de: 'das Bett',        ru: 'кровать' },
      { id: 8, de: 'der Schrank',     ru: 'шкаф' }
    ],

    dictation: [
      { word: 'Wohnung',     audio: 'Wohnung' },
      { word: 'Zimmer',      audio: 'Zimmer' },
      { word: 'Küche',       audio: 'Küche' },
      { word: 'Schrank',     audio: 'Schrank' },
      { word: 'Fenster',     audio: 'Fenster' },
      { word: 'gemütlich',   audio: 'gemütlich' },
      { word: 'Miete',       audio: 'Miete' },
      { word: 'zwischen',    audio: 'zwischen' }
    ]
  }
};
