"""
Метаданные статей: заголовки, уровень, даты, источник, подписи к фото.

published — дата публикации в источнике (ГГГГ-ММ-ДД);
added     — дата, когда статья появилась у нас в приложении.
w/h фото — реальные размеры файла: ридер ставит их в <img width height>,
чтобы страница не прыгала при загрузке картинки.
"""

ORDER = ['nobelpreis-physik-2026', 'plastiksteuer-2027', 'oktoberfest-rekord-2026',
         'einheitsfeier-bremen-2026', 'saturn-opposition-2026', 'crew-13-iss-2026',
         'wirtschaft-prognose-2026', 'juice-erde-2026']

ESA_LIC = 'CC BY-SA 3.0 IGO'
SA4 = 'CC BY-SA 4.0 · Wikimedia Commons'
SA3 = 'CC BY-SA 3.0 · Wikimedia Commons'

META = {
    'juice-erde-2026': {
        'title': 'Mit Schwung zum Jupiter: Juice fliegt knapp an der Erde vorbei',
        'titleRu': 'С разгона к Юпитеру: зонд Juice пролетел совсем рядом с Землёй',
        'rubric': 'astronomy',
        'level': 'B2–C1',
        'levelNote': 'Плюсквамперфект (hatte … aufgenommen), причастия в роли определений '
                     '(geplanten Kurskorrekturen, geladene Teilchen), отделяемые глаголы '
                     'с далёкой приставкой (lenkte … ab, schalteten … ein), научная лексика.',
        'published': '2026-09-28',
        'added': '2026-10-05',
        'source': 'ESA — Европейское космическое агентство',
        'sourceUrl': 'https://www.esa.int/Science_Exploration/Space_Science/Juice/'
                     'Successful_Earth_flyby_improves_Juice_s_course_to_Jupiter',
        'blurb': 'Зонд ЕКА Juice прошёл в 8640 км над Индийским океаном, разогнался на '
                 '3,5 км/с и взял курс на Юпитер. По пути он сфотографировал Африку, '
                 'Мадагаскар и Луну.',
        'license': 'Текст — пересказ новости ЕКА; фото — ESA, ' + ESA_LIC,
        'figs': {
            'earth': {'w': 1024, 'h': 640,
                      'cap': 'Земля глазами Juice: контрольная камера сняла Африку и Мадагаскар '
                             'вскоре после максимального сближения. Справа — крошечная точка Луны.',
                      'credit': 'ESA/Juice/JMC (Simeon Schmauß) · ' + ESA_LIC},
            'madagascar': {'w': 1023, 'h': 422,
                           'cap': 'Мадагаскар в объективе навигационной камеры — снимок сделан через '
                                  'две минуты после максимального сближения.',
                           'credit': 'ESA/Juice/NavCam · ' + ESA_LIC},
            'moon': {'w': 520, 'h': 520,
                     'cap': 'Серп Луны: навигационная камера сняла его примерно за восемь часов '
                            'до пролёта мимо Земли.',
                     'credit': 'ESA/Juice/NavCam · ' + ESA_LIC},
            'path': {'w': 1200, 'h': 675,
                     'cap': 'Схема пролёта: с 17 августа зонд вели к Земле, 28 сентября — '
                            'максимальное сближение на высоте 8640 км.',
                     'credit': 'ESA (ATG Europe) · ' + ESA_LIC},
        },
    },
    'saturn-opposition-2026': {
        'title': 'Saturn in Opposition: Der Ringplanet zeigt sich die ganze Nacht',
        'titleRu': 'Сатурн в противостоянии: планета с кольцами видна всю ночь',
        'rubric': 'astronomy',
        'level': 'B1–B2',
        'levelNote': 'Короткие предложения и настоящее время; из грамматики B2 — '
                     'придаточные с dass и wer, конструкция sein + zu + Infinitiv '
                     '(ist zu sehen, ist zu finden) и превосходная степень (am höchsten).',
        'published': '2026-10-04',
        'added': '2026-10-05',
        'source': 'Astronomy Magazine',
        'sourceUrl': 'https://www.astronomy.com/observing/the-sky-today-sunday-october-4-2026/',
        'blurb': '4 октября Земля оказалась точно между Солнцем и Сатурном. Планета видна всю '
                 'ночь, а её кольца после «невидимого» 2025 года снова раскрываются.',
        'license': 'Текст — пересказ новости; фото — NASA, ESA, CSA, STScI (CC BY 4.0) и NASA/JPL-Caltech/SSI',
        'figs': {
            'webb': {'w': 640, 'h': 420,
                     'cap': 'Сатурн в инфракрасном свете телескопа «Джеймс Уэбб»: кольца из '
                            'водяного льда сияют особенно ярко. Снимок опубликован в марте 2026 года.',
                     'credit': 'NASA, ESA, CSA, STScI, A. Simon, M. Wong · CC BY 4.0'},
            'hubble': {'w': 640, 'h': 420,
                       'cap': 'Тот же Сатурн в видимом свете — телескоп «Хаббл». Кольца видны '
                              'почти с ребра.',
                       'credit': 'NASA, ESA, STScI, A. Simon, M. Wong · CC BY 4.0'},
            'cassini': {'w': 1200, 'h': 466,
                        'cap': 'Сатурн на фоне Солнца — панорама зонда «Кассини». Когда Сатурн '
                               'в противостоянии, мы видим его с обратной стороны: освещённым '
                               'полностью.',
                        'credit': 'NASA/JPL-Caltech/SSI'},
        },
    },
    'crew-13-iss-2026': {
        'title': 'Rekordflug zur ISS: Vier Raumfahrer starten zu einer sechsmonatigen Mission',
        'titleRu': 'Рекордный полёт к МКС: четверо космонавтов отправились в полугодовую миссию',
        'rubric': 'astronomy',
        'level': 'B2',
        'levelNote': 'Перфект и претеритум рядом, отделяемые глаголы (hob … ab, legte … an), '
                     'Konjunktiv II (könnten), устойчивые сочетания существительного с глаголом '
                     '(in Empfang nehmen, auf dem Programm stehen).',
        'published': '2026-10-01',
        'added': '2026-10-05',
        'source': 'Spaceflight Now · NASA',
        'sourceUrl': 'https://spaceflightnow.com/2026/10/01/fresh-crew-takes-off-for-six-month-stay-aboard-space-station/',
        'blurb': 'Четверо космонавтов из США, России и Канады долетели до МКС всего за восемь '
                 'часов — рекорд для экипажей NASA. Впереди полгода работы на орбите.',
        'license': 'Текст — пересказ новости; фото — NASA (общественное достояние)',
        'figs': {
            'launch': {'w': 1200, 'h': 800,
                       'cap': 'Старт ракеты Falcon 9 с кораблём Crew Dragon «Grace» 1 октября 2026 года, '
                              'мыс Канаверал.',
                       'credit': 'NASA/John Kraus'},
            'crew': {'w': 1200, 'h': 859,
                     'cap': 'Экипаж Crew-13 выходит к автобусу перед поездкой на стартовую площадку.',
                     'credit': 'NASA/Joel Kowsky'},
            'sunset': {'w': 1200, 'h': 826,
                       'cap': 'Ракета на стартовом комплексе 40 на закате, накануне запуска.',
                       'credit': 'NASA/Joel Kowsky'},
        },
    },
    'wirtschaft-prognose-2026': {
        'title': 'Mehr Wachstum erwartet: Die Bundesregierung hebt ihre Prognose an',
        'titleRu': 'Ждут большего роста: правительство Германии повысило свой прогноз',
        'rubric': 'economy',
        'level': 'B1–B2',
        'levelNote': 'Экономическая лексика (Wachstum, Prognose, Inflation, Konsum), пассив '
                     '(wurde … angehoben), плюсквамперфект (hatte … erwartet), отделяемые '
                     'глаголы (gibt … aus, kaufen … ein), Konjunktiv I в косвенной речи (könne) '
                     'и Konjunktiv II (wäre).',
        'published': '2026-10-01',
        'added': '2026-10-06',
        'source': 'Reuters · Bloomberg',
        'sourceUrl': 'https://finance.yahoo.com/economy/articles/exclusive-german-government-raises-forecasts-155357353.html',
        'blurb': 'Правительство ФРГ ждёт в 2026 году роста экономики на 1,3 % вместо 0,5 %. '
                 'Тянут вверх госинвестиции в дороги, мосты и бундесвер, а вот цены на топливо '
                 'и пошлины США сдерживают потребление.',
        'license': 'Текст — пересказ новостей Reuters и Bloomberg; фото — Wikimedia Commons, CC BY-SA 4.0',
        'figs': {
            'hafen': {'w': 1200, 'h': 726,
                      'cap': 'Контейнерный терминал Буркхардкай в порту Гамбурга. Экспорт, по прогнозу '
                             'правительства, вырастет в 2026 году на 3,7 %.',
                      'credit': 'Tobiasi0 · ' + SA4},
            'bruecke': {'w': 1200, 'h': 675,
                        'cap': 'Стройка нового автобанного моста через Рейн у Леверкузена. Деньги на '
                               'дороги, мосты и железные дороги — главный двигатель подъёма.',
                        'credit': 'Raimond Spekking · ' + SA4},
            'bundesbank': {'w': 1200, 'h': 675,
                           'cap': 'Штаб-квартира Бундесбанка во Франкфурте-на-Майне (справа) и '
                                  'телебашня Europaturm.',
                           'credit': 'Dr. Thomas Liptak · ' + SA4},
        },
    },
    'einheitsfeier-bremen-2026': {
        'title': '550.000 Gäste: Bremen feiert den Tag der Deutschen Einheit',
        'titleRu': '550 000 гостей: Бремен отпраздновал День немецкого единства',
        'rubric': 'events',
        'level': 'B1–B2',
        'levelNote': 'Претеритум в рассказе о событии (kamen, begann, hielt), отделяемые глаголы '
                     '(findet … statt, stellten sich … vor), относительное придаточное (das gerade …), '
                     'косвенная речь с Konjunktiv I (gefährde) и устойчивые обороты '
                     '(eine Rede halten, an der Reihe sein).',
        'published': '2026-10-05',
        'added': '2026-10-06',
        'source': 'Weser-Kurier · buten un binnen · Bundespräsident',
        'sourceUrl': 'https://www.weser-kurier.de/bremen/tag-der-deutschen-einheit-550-000-gaeste-in-bremen-doc87watrykkdw1ikzk4d5w',
        'blurb': 'Три дня Бремен праздновал 36-ю годовщину объединения Германии: 550 000 гостей, '
                 'больше 600 концертов и спектаклей и речь президента Штайнмайера о единстве и демократии.',
        'license': 'Текст — пересказ новостей Weser-Kurier, buten un binnen и речи федерального '
                   'президента; фото — Wikimedia Commons, CC BY-SA 4.0',
        'figs': {
            'markt': {'w': 1200, 'h': 800,
                      'cap': 'Рыночная площадь Бремена в «синий час»: ратуша, статуя Роланда и собор, '
                             'где 3 октября прошло праздничное богослужение.',
                      'credit': 'Matthias Süßen · ' + SA4},
            'glocke': {'w': 1200, 'h': 675,
                       'cap': 'Концертный зал «Die Glocke» («Колокол») — здесь проходило торжественное '
                              'собрание с речью федерального президента.',
                       'credit': 'Matthias Süßen · ' + SA4},
            'musikanten': {'w': 1200, 'h': 800,
                           'cap': 'Бременские музыканты у ратуши — символ города, мимо которого всё '
                                  'праздничное воскресенье шли гости.',
                           'credit': 'Dietmar Rabich · ' + SA4},
            'schlachte': {'w': 1200, 'h': 797,
                          'cap': 'Набережная Шлахте на Везере — часть праздничной зоны в центре города.',
                          'credit': 'Jaimrsilva · ' + SA4},
        },
    },
    'plastiksteuer-2027': {
        'title': 'Neue Steuer auf Plastik: Verpackungen könnten ab 2027 teurer werden',
        'titleRu': 'Новый налог на пластик: упаковка с 2027 года может подорожать',
        'rubric': 'economy',
        'level': 'B1–B2',
        'levelNote': 'Модальные глаголы (soll, sollen, müssen, dürfen), пассив состояния и '
                     'процесса (betroffen sind, recycelt wird), отделяемые глаголы (liegt … vor, '
                     'plant … ein), Konjunktiv II (könnten), конструкция sich … lassen.',
        'published': '2026-10-05',
        'added': '2026-10-06',
        'source': 'Handelsblatt · Tagesspiegel',
        'sourceUrl': 'https://www.handelsblatt.com/politik/deutschland/steuern-plastiksteuer-bringt-14-milliarden-euro-und-mehr-buerokratie/100259802.html',
        'blurb': 'С 1 июля 2027 года фирмы будут платить 550 евро за тонну пластиковой упаковки. '
                 'Бюджет получит до 1,4 млрд евро в год, а йогурт и колбаса в пластике могут '
                 'немного подорожать.',
        'license': 'Текст — пересказ новостей Handelsblatt и Tagesspiegel; фото — Wikimedia Commons',
        'figs': {
            'regal': {'w': 1200, 'h': 900,
                      'cap': 'Мясо в пластиковых лотках на полке супермаркета. Налог коснётся любой '
                             'упаковки, где пластика больше пяти процентов.',
                      'credit': 'Mattes · ' + SA4},
            'tomaten': {'w': 1200, 'h': 800,
                        'cap': 'Помидоры в прозрачных пластиковых коробочках — привычная упаковка, '
                               'за которую с 2027 года придётся платить налог.',
                        'credit': 'Marek Ślusarczyk (Tupungato) · CC BY 3.0 · Wikimedia Commons'},
            'gelbersack': {'w': 1200, 'h': 683,
                           'cap': '«Жёлтые мешки» для упаковки в Германии. За пластик, который не '
                                  'перерабатывается, страна платит в бюджет ЕС.',
                           'credit': 'Tiia Monto · ' + SA3},
            'ministerium': {'w': 1200, 'h': 800,
                            'cap': 'Здание Федерального министерства финансов в Берлине '
                                   '(Detlev-Rohwedder-Haus) — здесь подготовили законопроект.',
                            'credit': 'Perituss · CC0 · Wikimedia Commons'},
        },
    },
    'nobelpreis-physik-2026': {
        'title': 'Nobelpreis für Physik: Geisterteilchen aus dem All im Eis des Südpols',
        'titleRu': 'Нобелевская премия по физике: частицы-призраки из космоса во льду Южного полюса',
        'rubric': 'science',
        'level': 'B1–B2',
        'levelNote': 'Придаточные с weil, wenn, ohne dass и относительные (die fast keine Masse '
                     'haben), инфинитив с um … zu, перфект и плюсквамперфект, пассив '
                     '(wird überreicht), отделяемые глаголы (gab … bekannt).',
        'published': '2026-10-06',
        'added': '2026-10-06',
        'source': 'Нобелевский комитет · taz · France 24',
        'sourceUrl': 'https://taz.de/Nobelpreis-fuer-Physik-2026/!6219312/',
        'blurb': 'Нобелевскую премию по физике получил Франсис Халзен — за обсерваторию IceCube: '
                 'в кубическом километре антарктического льда она ловит нейтрино из далёкого космоса.',
        'license': 'Текст — пересказ новостей taz и France 24; фото — Wikimedia Commons',
        'figs': {
            'icecube': {'w': 1200, 'h': 900,
                        'cap': 'Лаборатория IceCube на Южном полюсе. Сами датчики спрятаны глубоко '
                               'подо льдом — на глубине от 1,5 до 2,5 километра.',
                        'credit': 'Christopher Michel · ' + SA4},
            'halzen': {'w': 487, 'h': 640,
                       'cap': 'Франсис Халзен, профессор физики Висконсинского университета в Мэдисоне.',
                       'credit': 'User120011 · CC0 · Wikimedia Commons'},
            'dom': {'w': 640, 'h': 633,
                    'cap': 'Оптический модуль IceCube — стеклянный шар с датчиком света. '
                           'Таких модулей во льду больше пяти тысяч.',
                    'credit': 'Amble · ' + SA3},
            'nacht': {'w': 1200, 'h': 802,
                      'cap': 'Лаборатория IceCube полярной ночью: над ней — Млечный Путь '
                             'и южное полярное сияние.',
                      'credit': 'John Hardin · CC BY 4.0 · Wikimedia Commons'},
        },
    },
    'oktoberfest-rekord-2026': {
        'title': '7,4 Millionen Gäste: Das Oktoberfest stellt einen neuen Rekord auf',
        'titleRu': '7,4 миллиона гостей: Октоберфест установил новый рекорд',
        'rubric': 'events',
        'level': 'B1',
        'levelNote': 'Претеритум в рассказе (kamen, war, zählte), сравнение (mehr als, lieber), '
                     'пассив в претеритуме (getrunken wurden, getrübt wurde), плюсквамперфект '
                     '(hatte … gebeten), отделяемые глаголы (sammelten … ein, spielte … mit) '
                     'и устойчивые обороты (einen Rekord aufstellen, Bilanz ziehen).',
        'published': '2026-10-04',
        'added': '2026-10-06',
        'source': 'muenchen.de · ZDFheute',
        'sourceUrl': 'https://www.muenchen.de/veranstaltungen/oktoberfest/aktuell/oktoberfest-bilanz-2026',
        'blurb': '7,4 миллиона гостей за 16 дней — рекорд за всю историю Октоберфеста. '
                 'Выпито 6,7 миллиона кружек пива, а в бюро находок оказались даже аккордеон '
                 'и вставная челюсть.',
        'license': 'Текст — пересказ итогов города Мюнхена и ZDFheute; фото — Wikimedia Commons',
        'figs': {
            'umzug': {'w': 1200, 'h': 668,
                      'cap': 'Шествие в национальных костюмах и стрелков — традиционное открытие '
                             'Октоберфеста (снимок 2024 года).',
                      'credit': 'Jan Czeczotka · ' + SA4},
            'oidewiesn': {'w': 1200, 'h': 800,
                          'cap': 'Вход на «Ойде Визн» — историческую часть праздника со старинными '
                                 'каруселями и духовым оркестром.',
                          'credit': 'Wiesnlinkscom · ' + SA3},
            'karussell': {'w': 1200, 'h': 853,
                          'cap': 'Карусель на Октоберфесте вечером.',
                          'credit': 'Martin Falbisoner · ' + SA4},
        },
    },
}
