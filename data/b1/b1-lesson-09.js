/* ═══════════════════════════════════════════════
   data/b1/b1-lesson-09.js
   B1 · Урок 9: Adjektivdeklination — склонение прилагательных
   ═══════════════════════════════════════════════ */

const LESSON_DATA = {

  id:       'b1-09',
  level:    'B1',
  unit:     9,
  title:    'Adjektivdeklination',
  subtitle: 'Склонение прилагательных · окончания после der/ein/без артикля',

  meta: {
    duration:  '35–40 мин',
    wordCount: 20,
    xpReward:  150
  },

  phrases: [
    { de: 'Der neue Kollege ist sehr nett.',                    ru: 'Новый коллега очень милый.',                       note: 'после der → -e (Nominativ)', audio: 'Der neue Kollege ist sehr nett' },
    { de: 'Ich habe den neuen Film schon gesehen.',             ru: 'Я уже видел новый фильм.',                         note: 'Akkusativ m: den neuen', audio: 'Ich habe den neuen Film schon gesehen' },
    { de: 'Das kleine Kind spielt im Garten.',                  ru: 'Маленький ребёнок играет в саду.',                 note: 'das + -e', audio: 'Das kleine Kind spielt im Garten' },
    { de: 'Die junge Frau arbeitet bei einer großen Firma.',    ru: 'Молодая женщина работает в большой фирме.',        note: 'bei einer großen — Dativ f', audio: 'Die junge Frau arbeitet bei einer großen Firma' },
    { de: 'Ich trinke gern heißen Tee mit frischer Zitrone.',   ru: 'Я люблю пить горячий чай со свежим лимоном.',      note: 'без артикля: сильные окончания', audio: 'Ich trinke gern heißen Tee mit frischer Zitrone' },
    { de: 'Er wohnt in einem alten Haus mit einem schönen Garten.', ru: 'Он живёт в старом доме с красивым садом.',     note: 'Dativ n: einem alten / einem schönen', audio: 'Er wohnt in einem alten Haus mit einem schönen Garten' },
    { de: 'Ich suche eine günstige Wohnung im Zentrum.',        ru: 'Я ищу недорогую квартиру в центре.',               note: 'Akkusativ f: eine günstige', audio: 'Ich suche eine günstige Wohnung im Zentrum' },
    { de: 'Die deutschen Städte sind sehr sauber.',             ru: 'Немецкие города очень чистые.',                    note: 'Plural с die → -en', audio: 'Die deutschen Städte sind sehr sauber' },
    { de: 'Kleine Kinder brauchen viel Schlaf.',                ru: 'Маленьким детям нужно много спать.',               note: 'Plural без артикля → -e', audio: 'Kleine Kinder brauchen viel Schlaf' },
    { de: 'Er trägt heute einen dunklen Anzug.',                ru: 'Сегодня на нём тёмный костюм.',                    note: 'dunkel → dunklen (выпадает e)', audio: 'Er trägt heute einen dunklen Anzug' },
    { de: 'Das ist ein interessantes Buch über deutsche Geschichte.', ru: 'Это интересная книга о немецкой истории.',   note: 'ein + n → -es', audio: 'Das ist ein interessantes Buch über deutsche Geschichte' },
    { de: 'Ich hätte gern ein kaltes Wasser, bitte.',           ru: 'Мне, пожалуйста, холодной воды.',                  note: 'ein kaltes Wasser (n, Akk)', audio: 'Ich hätte gern ein kaltes Wasser, bitte' },
    { de: 'Bei schlechtem Wetter bleiben wir zu Hause.',        ru: 'В плохую погоду мы остаёмся дома.',                note: 'без артикля Dativ n → -em', audio: 'Bei schlechtem Wetter bleiben wir zu Hause' },
    { de: 'Sie hat lange braune Haare und grüne Augen.',        ru: 'У неё длинные каштановые волосы и зелёные глаза.', note: 'Plural без артикля → -e', audio: 'Sie hat lange braune Haare und grüne Augen' },
    { de: 'Mein bester Freund wohnt in einer anderen Stadt.',   ru: 'Мой лучший друг живёт в другом городе.',           note: 'mein склоняется как ein', audio: 'Mein bester Freund wohnt in einer anderen Stadt' },
    { de: 'Wir hatten einen wunderbaren Urlaub am Schwarzen Meer.', ru: 'У нас был чудесный отпуск на Чёрном море.',    note: 'am Schwarzen Meer — устойчивое название', audio: 'Wir hatten einen wunderbaren Urlaub am Schwarzen Meer' },
    { de: 'Der Preis des neuen Autos ist zu hoch.',             ru: 'Цена нового автомобиля слишком высокая.',          note: 'Genitiv: des neuen', audio: 'Der Preis des neuen Autos ist zu hoch' },
    { de: 'Ich gratuliere dir zum bestandenen Examen!',         ru: 'Поздравляю тебя со сданным экзаменом!',            note: 'Partizip II как прилагательное', audio: 'Ich gratuliere dir zum bestandenen Examen' },
    { de: 'Frisches Obst und grünes Gemüse sind gesund.',       ru: 'Свежие фрукты и зелёные овощи полезны.',           note: 'без артикля n → -es', audio: 'Frisches Obst und grünes Gemüse sind gesund' },
    { de: 'Das Gute daran ist: Übung macht den Meister.',       ru: 'Хорошее в этом то, что практика ведёт к мастерству.', note: 'das Gute — прилагательное как существительное', audio: 'Das Gute daran ist: Übung macht den Meister' }
  ],

  vocabulary: [
    { de: 'die Deklination',  ru: 'склонение',               ipa: '[deklinaˈt͡si̯oːn]', article: 'die' },
    { de: 'die Endung',       ru: 'окончание',               ipa: '[ˈɛndʊŋ]',           article: 'die' },
    { de: 'günstig',          ru: 'недорогой, выгодный',     ipa: '[ˈɡʏnstɪç]',         article: '' },
    { de: 'dunkel',           ru: 'тёмный',                  ipa: '[ˈdʊŋkl̩]',           article: '' },
    { de: 'hell',             ru: 'светлый',                 ipa: '[hɛl]',              article: '' },
    { de: 'sauber',           ru: 'чистый',                  ipa: '[ˈzaʊ̯bɐ]',           article: '' },
    { de: 'schmutzig',        ru: 'грязный',                 ipa: '[ˈʃmʊt͡sɪç]',        article: '' },
    { de: 'bequem',           ru: 'удобный',                 ipa: '[bəˈkveːm]',         article: '' },
    { de: 'gemütlich',        ru: 'уютный',                  ipa: '[ɡəˈmyːtlɪç]',       article: '' },
    { de: 'breit',            ru: 'широкий',                 ipa: '[bʁaɪ̯t]',            article: '' },
    { de: 'schmal',           ru: 'узкий',                   ipa: '[ʃmaːl]',            article: '' },
    { de: 'weich',            ru: 'мягкий',                  ipa: '[vaɪ̯ç]',             article: '' },
    { de: 'hart',             ru: 'твёрдый, жёсткий',        ipa: '[haʁt]',             article: '' },
    { de: 'frisch',           ru: 'свежий',                  ipa: '[fʁɪʃ]',             article: '' },
    { de: 'wunderbar',        ru: 'чудесный',                ipa: '[ˈvʊndɐbaːɐ̯]',      article: '' },
    { de: 'der Anzug',        ru: 'костюм',                  ipa: '[ˈant͡suːk]',        article: 'der' },
    { de: 'die Firma',        ru: 'фирма',                   ipa: '[ˈfɪʁma]',           article: 'die' },
    { de: 'der Preis',        ru: 'цена',                    ipa: '[pʁaɪ̯s]',            article: 'der' },
    { de: 'die Geschichte',   ru: 'история',                 ipa: '[ɡəˈʃɪçtə]',         article: 'die' },
    { de: 'gesund',           ru: 'здоровый, полезный',      ipa: '[ɡəˈzʊnt]',          article: '' }
  ],

  grammar: [
    {
      title: '⚡ Три типа склонения — общая логика',
      body: 'Окончание прилагательного зависит от того, <strong>что стоит перед ним</strong>:<br><br>' +
            '<strong>1. После der/die/das</strong> (слабое): артикль уже всё показал → прилагательное получает только <strong>-e</strong> или <strong>-en</strong>.<br>' +
            '<strong>2. После ein/kein/mein</strong> (смешанное): ein не показывает род → в Nominativ m/n прилагательное «доигрывает»: <em>ein gut<strong>er</strong> Mann, ein gut<strong>es</strong> Kind</em>.<br>' +
            '<strong>3. Без артикля</strong> (сильное): прилагательное берёт окончания артикля der/die/das на себя: <em>heiß<strong>er</strong> Tee, frisch<strong>e</strong> Milch, kalt<strong>es</strong> Wasser</em>.',
      conjugation: [
        { pronoun: 'der + m',  form: 'der neue Kollege',    audio: 'der neue Kollege',    translation: 'новый коллега' },
        { pronoun: 'ein + m',  form: 'ein neuer Kollege',   audio: 'ein neuer Kollege',   translation: 'один новый коллега' },
        { pronoun: 'das + n',  form: 'das kalte Wasser',    audio: 'das kalte Wasser',    translation: 'холодная вода' },
        { pronoun: 'ein + n',  form: 'ein kaltes Wasser',   audio: 'ein kaltes Wasser',   translation: 'холодная вода (одна)' },
        { pronoun: 'без арт. m', form: 'heißer Tee',        audio: 'heißer Tee',          translation: 'горячий чай' },
        { pronoun: 'без арт. f', form: 'frische Milch',     audio: 'frische Milch',       translation: 'свежее молоко' }
      ]
    },
    {
      title: '⚡ Золотое правило -en',
      body: 'Хорошая новость: в большинстве случаев окончание — просто <strong>-en</strong>. Оно стоит:<br><br>' +
            '• во <strong>всём Dativ</strong>: <em>mit dem neu<strong>en</strong> Auto, in einer groß<strong>en</strong> Stadt</em><br>' +
            '• во всём <strong>Genitiv</strong>: <em>der Preis des neu<strong>en</strong> Autos</em><br>' +
            '• в <strong>Akkusativ мужского рода</strong>: <em>Ich sehe den neu<strong>en</strong> Film / einen neu<strong>en</strong> Film</em><br>' +
            '• во <strong>множественном числе после die/keine/meine</strong>: <em>die deutsch<strong>en</strong> Städte</em><br><br>' +
            'Если сомневаешься — <strong>-en</strong> будет правильным чаще всего.',
      conjugation: [
        { pronoun: 'Dativ',    form: 'mit dem neuen Auto',       audio: 'mit dem neuen Auto',       translation: 'на новой машине' },
        { pronoun: 'Akk. m',   form: 'Ich sehe den neuen Film.', audio: 'Ich sehe den neuen Film',  translation: 'Я смотрю новый фильм.' },
        { pronoun: 'Genitiv',  form: 'der Preis des neuen Autos', audio: 'der Preis des neuen Autos', translation: 'цена нового автомобиля' },
        { pronoun: 'Plural',   form: 'die deutschen Städte',     audio: 'die deutschen Städte',     translation: 'немецкие города' }
      ]
    },
    {
      title: '💡 Мелочи, которые выдают уровень',
      body: '<strong>dunkel, teuer</strong> теряют e: <em>ein dunk<strong>l</strong>er Anzug, ein teu<strong>r</strong>es Auto</em>.<br><br>' +
            '<strong>hoch</strong> → <em>ein hoh<strong>es</strong> Haus</em> (c выпадает!).<br><br>' +
            'Прилагательное <strong>после</strong> глагола не склоняется: <em>Das Haus ist alt.</em> Но: <em>das alt<strong>e</strong> Haus</em>.<br><br>' +
            'Прилагательные как существительные пишутся с большой буквы и склоняются: <em>das Gute, etwas Neues, nichts Besonderes</em>.'
    }
  ],

  exercises: {
    fillBlanks: [
      { before: '— Der',                blank: 'neue',     after: 'Kollege ist nett.',            translation: '— Новый коллега милый.',                hintWord: 'neue',     hintRule: 'после der → -e' },
      { before: '— Ich sehe den',       blank: 'neuen',    after: 'Film.',                        translation: '— Я смотрю новый фильм.',               hintWord: 'neuen',    hintRule: 'Akkusativ m → -en' },
      { before: '— Das ist ein',        blank: 'gutes',    after: 'Buch.',                        translation: '— Это хорошая книга.',                  hintWord: 'gutes',    hintRule: 'ein + n → -es' },
      { before: '— Ich trinke',         blank: 'heißen',   after: 'Tee.',                         translation: '— Я пью горячий чай.',                  hintWord: 'heißen',   hintRule: 'без артикля, Akk m → -en' },
      { before: '— Wir wohnen in einem', blank: 'alten',   after: 'Haus.',                        translation: '— Мы живём в старом доме.',             hintWord: 'alten',    hintRule: 'Dativ → всегда -en' },
      { before: '— Sie hat',            blank: 'grüne',    after: 'Augen.',                       translation: '— У неё зелёные глаза.',                hintWord: 'grüne',    hintRule: 'Plural без артикля → -e' },
      { before: '— Er trägt einen',     blank: 'dunklen',  after: 'Anzug.',                       translation: '— На нём тёмный костюм.',               hintWord: 'dunklen',  hintRule: 'dunkel → dunkl- (e выпадает)' },
      { before: '— Bei',                blank: 'schlechtem', after: 'Wetter bleiben wir hier.',   translation: '— В плохую погоду мы остаёмся здесь.',  hintWord: 'schlechtem', hintRule: 'без артикля Dativ n → -em' }
    ],

    multipleChoice: [
      { question: '«Ein … Mann» (Nominativ) — …',                     options: ['ein alte Mann', 'ein alter Mann', 'ein alten Mann', 'ein altes Mann'],  correctIndex: 1 },
      { question: 'Dativ: «mit der … Frau»',                          options: ['jungen', 'junge', 'junger', 'junges'],                                   correctIndex: 0 },
      { question: 'Без артикля: «… Wasser» (n)',                      options: ['kalte', 'kalter', 'kaltes', 'kalten'],                                   correctIndex: 2 },
      { question: 'Где ВСЕГДА окончание -en?',                        options: ['в Nominativ', 'в Dativ и Genitiv', 'в Plural без артикля', 'после ein'], correctIndex: 1 },
      { question: '«die … Städte» (Plural)',                          options: ['deutsche', 'deutschen', 'deutscher', 'deutsches'],                       correctIndex: 1 },
      { question: 'От «hoch»: «ein … Haus»',                          options: ['hoches', 'hohes', 'höches', 'hochs'],                                    correctIndex: 1 },
      { question: 'Прилагательное после «ist»…',                      options: ['получает -e', 'получает -en', 'не склоняется', 'получает -es'],           correctIndex: 2 },
      { question: '«ничего особенного» — …',                          options: ['nichts besonders', 'nichts Besonderes', 'kein besonders', 'nicht Besondere'], correctIndex: 1 }
    ],

    matching: [
      { id: 1, de: 'der neue Kollege',    ru: 'новый коллега (после der)' },
      { id: 2, de: 'ein neuer Kollege',   ru: 'новый коллега (после ein)' },
      { id: 3, de: 'heißer Tee',          ru: 'горячий чай (без артикля)' },
      { id: 4, de: 'ein kaltes Wasser',   ru: 'холодная вода' },
      { id: 5, de: 'mit dem neuen Auto',  ru: 'на новой машине (Dativ)' },
      { id: 6, de: 'gemütlich',           ru: 'уютный' },
      { id: 7, de: 'günstig',             ru: 'недорогой' },
      { id: 8, de: 'etwas Neues',         ru: 'что-то новое' }
    ],

    dictation: [
      { word: 'gemütlich',   audio: 'gemütlich' },
      { word: 'günstig',     audio: 'günstig' },
      { word: 'dunkel',      audio: 'dunkel' },
      { word: 'sauber',      audio: 'sauber' },
      { word: 'bequem',      audio: 'bequem' },
      { word: 'wunderbar',   audio: 'wunderbar' },
      { word: 'frisch',      audio: 'frisch' },
      { word: 'Endung',      audio: 'Endung' }
    ]
  }
};
