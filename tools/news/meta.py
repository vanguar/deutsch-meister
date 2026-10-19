"""
Метаданные статей: заголовки, уровень, даты, источник, подписи к фото.

published — дата публикации в источнике (ГГГГ-ММ-ДД);
added     — дата, когда статья появилась у нас в приложении.
w/h фото — реальные размеры файла: ридер ставит их в <img width height>,
чтобы страница не прыгала при загрузке картинки.
"""

ORDER = ['telekom-ki-2026', 'draconiden-2026', 'homo-erectus-drimolen-2026',
         'nobelpreis-physik-2026','plastiksteuer-2027', 'oktoberfest-rekord-2026',
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
    'homo-erectus-drimolen-2026': {
        'title': 'Zwei Millionen Jahre alt: Forscher finden den ältesten erwachsenen Homo erectus',
        'titleRu': 'Два миллиона лет: учёные нашли древнейшего взрослого Homo erectus',
        'rubric': 'science',
        'level': 'B1–B2',
        'levelNote': 'Превосходная степень (älteste, ältesten), пассив в претеритуме (gefunden wurden), '
                     'плюсквамперфект (hatte … gefunden), придаточные с dass, das, während, '
                     'отделяемые глаголы (starb … aus), сравнение (mehr als, zehnmal so häufig wie).',
        'published': '2026-10-01',
        'added': '2026-10-06',
        'source': 'scinexx · Archaeology Magazine',
        'sourceUrl': 'https://www.scinexx.de/news/archaeologie/aeltestes-erwachsenenfossil-von-homo-erectus-entdeckt/',
        'blurb': 'В пещере Дримолен в ЮАР нашли фрагменты черепа взрослого Homo erectus возрастом '
                 'около 2 млн лет — это древнейшая такая находка. А рядом жил его родственник, '
                 'которого было в десять раз больше.',
        'license': 'Текст — пересказ новостей scinexx и Archaeology Magazine; фото — Wikimedia Commons',
        'figs': {
            'drimolen': {'w': 1200, 'h': 800,
                         'cap': 'Раскопки в Дримолене (ЮАР). Здесь нашли и череп ребёнка, и новый '
                                'фрагмент черепа взрослого Homo erectus.',
                         'credit': 'Andy Herries · ' + SA4},
            'erectus': {'w': 482, 'h': 640,
                        'cap': 'Так мог выглядеть Homo erectus — художественная реконструкция.',
                        'credit': 'Tales from the Workshop · CC0 · Wikimedia Commons'},
            'paranthropus': {'w': 1200, 'h': 900,
                             'cap': 'Череп Paranthropus robustus (Музей природы, Фрайбург). Сильные '
                                    'челюсти и огромные коренные зубы, но маленький мозг.',
                             'credit': 'Daderot · CC0 · Wikimedia Commons'},
            'wiege': {'w': 1200, 'h': 618,
                      'cap': '«Колыбель человечества» — район к северо-западу от Йоханнесбурга с '
                             'десятками мест находок древних людей.',
                      'credit': 'Olof Somell (Nobel Museum) · ' + SA4},
        },
    },
    'draconiden-2026': {
        'title': 'Sternschnuppen am Abendhimmel: Die Draconiden fallen in eine mondlose Nacht',
        'titleRu': 'Падающие звёзды в вечернем небе: Дракониды придутся на безлунную ночь',
        'rubric': 'astronomy',
        'level': 'B1',
        'levelNote': 'Настоящее время и модальные глаголы (kann man, sollte man, können), '
                     'конструкция scheinen … zu, придаточные с wenn и der, '
                     'устойчивые обороты (es lohnt sich, am besten, Tausende von).',
        'published': '2026-10-03',
        'added': '2026-10-06',
        'source': 'Hersfelder Zeitung · VOL.AT · Royal Observatory Greenwich',
        'sourceUrl': 'https://www.hersfelder-zeitung.de/panorama/draconiden-2026-wann-und-wo-sie-die-sternschnuppen-sehen-zr-94522820.html',
        'blurb': 'С 6 по 10 октября активны Дракониды, пик — в ночь с 8 на 9 октября. Луна не '
                 'помешает: 10 октября новолуние. Смотреть лучше уже ранним вечером.',
        'license': 'Текст — пересказ новостей Hersfelder Zeitung, VOL.AT и Royal Observatory Greenwich; '
                   'фото — Wikimedia Commons',
        'figs': {
            'komet': {'w': 1200, 'h': 845,
                      'cap': 'Комета Джакобини — Циннера в сентябре 2018 года. Из её пыли и '
                             'рождаются Дракониды.',
                      'credit': 'Alexander Vasenin · ' + SA4},
            'drache': {'w': 760, 'h': 760,
                       'cap': 'Карта созвездия Дракона. Метеоры словно вылетают из его «головы» — '
                              'ромба из четырёх звёзд.',
                       'credit': 'IAU and Sky & Telescope · CC BY 4.0 · Wikimedia Commons'},
            'sturm1933': {'w': 1200, 'h': 904,
                          'cap': 'Метеорный шторм Драконид 9 октября 1933 года на снимке '
                                 'Фердинанда Кениссе: десятки следов на одной фотопластинке.',
                          'credit': 'Ferdinand Quénisset · общественное достояние'},
        },
    },
    'telekom-ki-2026': {
        'title': 'Chatbots statt Callcenter: Die Telekom will mit KI Milliarden sparen',
        'titleRu': 'Чат-боты вместо колл-центров: Telekom хочет сэкономить миллиарды с помощью ИИ',
        'rubric': 'tech',
        'level': 'B1–B2',
        'levelNote': 'Технологическая лексика (KI, Chatbot, Automatisierung), модальные глаголы '
                     '(sollen, will), отделяемые глаголы (stellte … vor), перфект (haben … übernommen), '
                     'союзы nicht nur … sondern auch, устойчивые обороты (im Einsatz sein, '
                     'auf etwas setzen, von Grund auf).',
        'published': '2026-10-05',
        'added': '2026-10-06',
        'source': 'dpa · inFranken.de · Handelsblatt',
        'sourceUrl': 'https://www.infranken.de/ueberregional/newsticker-national/netzwelt/deutsche-telekom-will-durch-ki-einsatz-milliarden-sparen-art-6400841',
        'blurb': 'К 2030 году ИИ и автоматизация должны экономить Deutsche Telekom около 2,5 млрд евро '
                 'в год. Чат-боты уже приняли 2,6 млн звонков, а в США ИИ-агенты ведут 40 % обращений клиентов.',
        'license': 'Текст — пересказ новостей dpa, inFranken.de и Handelsblatt; фото — Wikimedia Commons',
        'figs': {
            'rechenzentrum': {'w': 1200, 'h': 797,
                              'cap': 'Серверы в дата-центре. Для ИИ телеком-компаниям нужны '
                                     'огромные вычислительные мощности.',
                              'credit': 'BalticServers.com · ' + SA3},
            'shop': {'w': 1200, 'h': 827,
                     'cap': 'Магазин Telekom во Фрайбурге. Часть вопросов клиентов уже решают '
                            'чат-боты, а не люди.',
                     'credit': 'Andreas Schwarzkopf · ' + SA4},
            'netz': {'w': 1200, 'h': 799,
                     'cap': 'Инженеры у серверных стоек. Работу сетей Telekom тоже хочет '
                            'частично автоматизировать.',
                     'credit': 'Daoducquan · ' + SA4},
            'berlin': {'w': 1200, 'h': 905,
                       'cap': 'Представительство Deutsche Telekom в Берлине. Штаб-квартира концерна '
                              'находится в Бонне.',
                       'credit': 'Ricostorch · ' + SA3},
        },
    },
}

META.update({
    'mars-krippe-2026': {
        'title': 'Der Rote Planet in der Krippe: Mars wandert durch einen Sternhaufen',
        'titleRu': 'Красная планета в Яслях: Марс проходит через звёздное скопление',
        'rubric': 'astronomy',
        'level': 'B1',
        'levelNote': 'Настоящее время и безличное man (sieht man, kann man), конструкция '
                     'sein + zu + Infinitiv (ist leicht zu finden), инфинитив с zu (lohnt es sich, '
                     'früh aufzustehen), сравнение (heller als, mehr als), придаточные с weil, wo, wer.',
        'published': '2026-10-10',
        'added': '2026-10-10',
        'source': 'Spektrum der Wissenschaft · IT BOLTWISE',
        'sourceUrl': 'https://www.spektrum.de/news/aktuelles-am-himmel-der-rote-planet-in-der-krippe/2348171',
        'blurb': 'С 10 по 12 октября перед рассветом Марс проходит сквозь звёздное скопление Ясли '
                 '(M44) в созвездии Рака. Новолуние не помешает, а в бинокль видно больше дюжины звёзд.',
        'license': 'Текст — пересказ новостей Spektrum der Wissenschaft и IT BOLTWISE; фото — Wikimedia Commons',
        'figs': {
            'krippe': {'w': 1200, 'h': 900,
                       'cap': 'Звёздное скопление Ясли (M44, Praesepe) в созвездии Рака. Самые яркие '
                              'его звёзды хорошо видны в обычный бинокль.',
                       'credit': 'Giuseppe Donatiello · CC0 · Wikimedia Commons'},
            'krebs': {'w': 960, 'h': 960,
                      'cap': 'Карта созвездия Рака. Ясли (M44) — в самом его центре, между '
                             'звёздами Асселус Бореалис и Асселус Аустралис.',
                      'credit': 'IAU and Sky & Telescope · CC BY 4.0 · Wikimedia Commons'},
            'mars': {'w': 1200, 'h': 808,
                     'cap': 'Марс в телескоп «Хаббл». Невооружённым глазом он виден как яркая '
                            'красноватая звёздочка.',
                     'credit': 'NASA, J. Bell, S. Lee, M. Wolff · общественное достояние'},
        },
    },
    'schildkroete-jonathan-2026': {
        'title': '194 Jahre alt: Was die Schildkröte Jonathan über das Altern verrät',
        'titleRu': '194 года: что черепаха Джонатан рассказывает о старении',
        'rubric': 'science',
        'level': 'B1–B2',
        'levelNote': 'Превосходная степень (das älteste Landtier), перфект с sein (ist geschlüpft, '
                     'sind erschienen), модальные глаголы в претеритуме (wollte, durften), '
                     'относительные придаточные (die nur Jonathan hat, das … aufspürt), '
                     'инфинитив с zu (helfen, … zu erkennen), пассив (wird gefüttert).',
        'published': '2026-10-08',
        'added': '2026-10-10',
        'source': 'science.ORF.at · dpa · forschung-und-wissen.de',
        'sourceUrl': 'https://science.orf.at/stories/3237652/',
        'blurb': 'Гигантской черепахе Джонатану с острова Святой Елены около 194 лет. В его генах '
                 'учёные нашли 287 особых вариантов — они помогают чинить ДНК и избавляться от старых клеток.',
        'license': 'Текст — пересказ новостей science.ORF.at, dpa и forschung-und-wissen.de; '
                   'фото — Wikimedia Commons',
        'figs': {
            'jonathan': {'w': 1200, 'h': 900,
                         'cap': 'Джонатан на лужайке перед Плантейшн-хаус — резиденцией губернатора '
                                'острова Святой Елены.',
                         'credit': 'Kevin Gepford · ' + SA4},
            'aldabra': {'w': 1200, 'h': 889,
                        'cap': 'Альдабрская гигантская черепаха на Сейшельских островах. Джонатан — '
                               'того же вида; обычно такие черепахи живут около 80 лет.',
                        'credit': 'Norbert Nagel · ' + SA4},
            'plantation': {'w': 1200, 'h': 800,
                           'cap': 'Плантейшн-хаус на острове Святой Елены. В его саду Джонатан '
                                  'живёт с 1882 года.',
                           'credit': 'Luke McKernan · CC BY-SA 2.0 · Wikimedia Commons'},
            'jonathan1900': {'w': 430, 'h': 430,
                             'cap': 'Одна из самых старых фотографий Джонатана — около 1900 года. '
                                    'Ему тогда было уже почти 70 лет.',
                             'credit': 'Автор неизвестен · общественное достояние'},
        },
    },
    'synthid-ki-erkennung-2026': {
        'title': 'Echt oder KI? Ein Werkzeug von Google findet unsichtbare Wasserzeichen',
        'titleRu': 'Настоящее или ИИ? Инструмент Google находит невидимые водяные знаки',
        'rubric': 'tech',
        'level': 'B1–B2',
        'levelNote': 'Технологическая лексика (Wasserzeichen, Datei, Konto), отделяемые глаголы '
                     '(lädt … hoch, bauen … ein, macht … mit), пассив (sind … markiert, '
                     'erstellt worden sein), союзы weder … noch, auch wenn, инфинитив с zu (raten, … zu achten).',
        'published': '2026-10-08',
        'added': '2026-10-10',
        'source': 'Kurier Verlag · appgefahren.de · onlinemarketing.de',
        'sourceUrl': 'https://www.kurierverlag.de/ratgeber/verbraucher/google-ki-erkennung-synthid-prueft-jetzt-bilder-videos-und-audio-zr-94531327.html',
        'blurb': 'Google открыл для всех бесплатный SynthID Detector: он ищет в фото, видео и аудио '
                 'невидимый водяной знак ИИ. Но если знака нет, это ещё не доказывает, что файл настоящий.',
        'license': 'Текст — пересказ новостей Kurier Verlag, appgefahren.de и onlinemarketing.de; '
                   'фото — Wikimedia Commons',
        'figs': {
            'smartphone': {'w': 1200, 'h': 900,
                           'cap': 'Посетители музея фотографируют картины на смартфон. Отличить '
                                  'настоящий снимок от созданного ИИ на глаз всё труднее.',
                           'credit': 'TANNMY NAISZE Wanguo · CC0 · Wikimedia Commons'},
            'googleplex': {'w': 1200, 'h': 878,
                           'cap': 'Штаб-квартира Google в Маунтин-Вью (Калифорния). Технологию '
                                  'SynthID разработало подразделение Google DeepMind.',
                           'credit': 'Asoundd · ' + SA4},
            'schild': {'w': 1200, 'h': 800,
                       'cap': 'Табличка у офисов Google в Маунтин-Вью. Детектор пока работает '
                              'только на английском.',
                       'credit': 'Dietmar Rabich · ' + SA4},
        },
    },
    'temu-shein-zoll-2026': {
        'title': 'Weniger Pakete aus Asien: Der Umsatz von Temu und Shein bricht ein',
        'titleRu': 'Меньше посылок из Азии: выручка Temu и Shein обвалилась',
        'rubric': 'economy',
        'level': 'B1–B2',
        'levelNote': 'Экономическая лексика (Umsatz, Anteil, Quartal, Zoll), сравнение (weniger als, '
                     'seltener als, höheren), перфект с sein (ist geschrumpft), отделяемые глаголы '
                     '(kommt … dazu), устойчивые обороты (an Umsatz verlieren, ins Stocken geraten).',
        'published': '2026-10-09',
        'added': '2026-10-10',
        'source': 'bevh · dpa · VerkehrsRundschau',
        'sourceUrl': 'https://www.verkehrsrundschau.de/nachrichten/transport-logistik/temu-und-shein-verlieren-deutlich-an-umsatz-in-deutschland-3915131',
        'blurb': 'В третьем квартале выручка Temu, Shein и AliExpress в Германии упала на 35,5 % — '
                 'до 566 млн евро. Причина — новые правила ЕС: беспошлинного порога в 150 евро больше нет.',
        'license': 'Текст — пересказ новостей dpa и VerkehrsRundschau по данным bevh; фото — Wikimedia Commons',
        'figs': {
            'laden': {'w': 1200, 'h': 900,
                      'cap': 'Магазин Shein в торговом центре в Варшаве. В Германии платформа '
                             'продаёт в основном через интернет.',
                      'credit': 'DMCGN · CC BY 4.0 · Wikimedia Commons'},
            'paketzentrum': {'w': 1200, 'h': 675,
                             'cap': 'Посылочный центр DHL в Нойвиде с высоты. Через такие центры '
                                    'проходят и посылки из Азии.',
                             'credit': 'Wolkenkratzer · ' + SA4},
            'schlange': {'w': 1200, 'h': 900,
                         'cap': 'Очередь к открытию магазина Shein в Варшаве. Бум дешёвых '
                                'платформ в Европе пока замедлился.',
                         'credit': 'DMCGN · CC BY 4.0 · Wikimedia Commons'},
        },
    },
    'buchmesse-2026': {
        'title': 'Bücher, Gäste und ein Land am Meer: Die Frankfurter Buchmesse hat begonnen',
        'titleRu': 'Книги, гости и страна у моря: открылась Франкфуртская книжная ярмарка',
        'rubric': 'events',
        'level': 'B1–B2',
        'levelNote': 'Перфект (hat begonnen, sind gereist), отделяемые глаголы (treten … auf, '
                     'ging … zurück), пассив состояния (sind reserviert), безличный пассив '
                     '(diskutiert wird), придаточное с obwohl, превосходная степень (die größte).',
        'published': '2026-10-07',
        'added': '2026-10-10',
        'source': 't-online · hessenschau · ZDFheute',
        'sourceUrl': 'https://frankfurt.t-online.de/region/frankfurt-am-main/id_101467824/frankfurter-buchmesse-startet-250000-besucher-erwartet.html',
        'blurb': 'До 11 октября во Франкфурте идёт 78-я книжная ярмарка: больше 250 000 гостей, '
                 'тысяча спикеров и почётная гостья Чехия с девизом «Страна на побережье».',
        'license': 'Текст — пересказ новостей t-online, hessenschau и ZDFheute; фото — Wikimedia Commons',
        'figs': {
            'halle': {'w': 1200, 'h': 800,
                      'cap': 'Павильон 3 Франкфуртской книжной ярмарки — стенды немецких '
                             'издательств и газет (снимок 2025 года).',
                      'credit': 'Dr. Thomas Liptak · ' + SA4},
            'forum': {'w': 1200, 'h': 800,
                      'cap': 'Площадь перед зданием «Форум» на территории выставки во Франкфурте '
                             '(снимок 2025 года).',
                      'credit': 'Dr. Thomas Liptak · ' + SA4},
            'prag': {'w': 1200, 'h': 799,
                     'cap': 'Карлов мост через Влтаву в Праге. Моря в Чехии нет — зато есть '
                            'шекспировская «Богемия у моря».',
                     'credit': 'Scotch Mist · ' + SA4},
        },
    },
})

ORDER = ['mars-krippe-2026', 'schildkroete-jonathan-2026', 'synthid-ki-erkennung-2026',
         'temu-shein-zoll-2026', 'buchmesse-2026'] + ORDER

META.update({
    'weisse-zwerge-2026': {
        'title': 'Schwerer als erlaubt? Magnetfelder könnten Weiße Zwerge wachsen lassen',
        'titleRu': 'Тяжелее положенного? Магнитные поля могут дать белым карликам вырасти',
        'rubric': 'astronomy',
        'level': 'B2',
        'levelNote': 'Конъюнктив II (könnten anheben, könnten erklären), придаточные с wenn, dass, ob, als, '
                     'перфект (ist erschienen, haben berechnet), инфинитив с zu (hilft, … standzuhalten), '
                     'сравнение (schwerer, immer stärker), научная лексика.',
        'published': '2026-10-10',
        'added': '2026-10-15',
        'source': 'scinexx · Indian Institute of Science',
        'sourceUrl': 'https://www.scinexx.de/news/kosmos/weisse-zwerge-koennen-dank-starker-magnetfelder-die-chandrasekhar-grenze-knacken/',
        'blurb': 'Считалось, что белый карлик не может быть тяжелее 1,4 массы Солнца. Модели индийских '
                 'астрофизиков показывают: сильное магнитное поле может поднять предел до 2,4.',
        'license': 'Текст — пересказ новости scinexx по данным IISc и The Astrophysical Journal Letters; '
                   'иллюстрации — NASA/ESA, общественное достояние',
        'figs': {
            'zwergnova': {'w': 1200, 'h': 675,
                          'cap': 'Так художник представляет белого карлика (слева), который забирает '
                                 'вещество у соседней звезды. Вокруг карлика образуется светящийся диск.',
                          'credit': 'NASA, L. Hustak (STScI) · общественное достояние'},
            'sirius': {'w': 1200, 'h': 900,
                       'cap': 'Сириус A и его спутник — белый карлик Сириус B (маленькая голубая точка '
                              'справа). Рисунок художника.',
                       'credit': 'NASA, ESA, G. Bacon (STScI) · общественное достояние'},
            'supernova': {'w': 652, 'h': 652,
                          'cap': 'Сверхновая типа Ia SN 1994D (яркая точка внизу слева) на окраине '
                                 'галактики NGC 4526. Снимок телескопа «Хаббл».',
                          'credit': 'NASA/ESA, The Hubble Key Project Team, The High-Z Supernova Search Team · '
                                    'общественное достояние'},
        },
    },
    'schiffswrack-kekova-2026': {
        'title': 'Aus der Zeit der Pyramiden: Archäologen finden das wohl älteste Schiffswrack der Welt',
        'titleRu': 'Ровесник пирамид: археологи нашли, вероятно, древнейшее затонувшее судно в мире',
        'rubric': 'science',
        'level': 'B1–B2',
        'levelNote': 'Перфект и претерит (haben entdeckt, sank, fanden, verglichen), пассив в прошедшем '
                     '(gebaut wurden), конструкция sein + zu + Infinitiv (sind zu sehen), относительные '
                     'придаточные (das …, deren Alter …), превосходная степень (das älteste).',
        'published': '2026-10-15',
        'added': '2026-10-15',
        'source': 'watson · dpa · GMX',
        'sourceUrl': 'https://www.watson.ch/international/tuerkei/418393649-mutmasslich-aeltestes-schiffswrack-der-welt-entdeckt',
        'blurb': 'У турецкого острова Кекова на глубине 30 метров нашли груз торгового судна, затонувшего '
                 '4400–4700 лет назад: три каменных якоря и больше 30 амфор из долины Иордана.',
        'license': 'Текст — пересказ новостей watson и GMX по данным dpa; фото — Wikimedia Commons',
        'figs': {
            'kekova': {'w': 1200, 'h': 800,
                       'cap': 'Остров Кекова и деревня Калекёй на юге Турции. Где-то у этих берегов '
                              'на дне лежит древний корабль.',
                       'credit': 'Bjørn Christian Tørrissen · ' + SA4},
            'ruinen': {'w': 900, 'h': 1200,
                       'cap': 'Прозрачная вода у острова Кекова. Здесь под водой лежат и руины '
                              'античного города, затонувшего после землетрясения.',
                       'credit': 'Josep Renalias · CC BY 4.0 · Wikimedia Commons'},
            'pyramiden': {'w': 1200, 'h': 798,
                          'cap': 'Пирамиды Гизы в Египте. Корабль у Кековы затонул примерно тогда, '
                                 'когда их строили.',
                          'credit': 'Ricardo Liberato · CC BY-SA 2.0 · Wikimedia Commons'},
        },
    },
    'd-you-wallet-2026': {
        'title': 'Der Ausweis im Handy: Die digitale Brieftasche „d-you“ kommt im Januar',
        'titleRu': 'Документы в телефоне: цифровой кошелёк d-you появится в январе',
        'rubric': 'tech',
        'level': 'B1–B2',
        'levelNote': 'Модальные глаголы (soll starten, darf man nutzen, möchten), возвратные и отделяемые '
                     'глаголы (sich ausweisen, sich ausgeben, dazukommen), перфект (hat gebilligt, '
                     'haben versprochen), инфинитив с zu, конъюнктив II (könnten), лексика документов.',
        'published': '2026-10-14',
        'added': '2026-10-15',
        'source': 'beck-aktuell · teltarif.de · t3n',
        'sourceUrl': 'https://www.beck-aktuell.de/heute-im-recht/rechtspolitik-gesetzgebung/gesetzentwurf-digitale-identitaet-eudi-wallet-d-you-datenschutz-eu-2026-10-14',
        'blurb': 'С 2 января 2027 года в Германии заработает приложение d-you: удостоверение личности, '
                 'возраст, банковский счёт — со смартфона. Для настройки подойдёт и электронный ВНЖ.',
        'license': 'Текст — пересказ новостей beck-aktuell, teltarif.de и t3n; фото — Wikimedia Commons',
        'figs': {
            'ausweis': {'w': 1000, 'h': 631,
                        'cap': 'Образец немецкого удостоверения личности (Personalausweis). Его данные '
                               'можно будет перенести в приложение d-you.',
                        'credit': 'Bundesministerium des Innern · общественное достояние'},
            'smartphone': {'w': 1200, 'h': 800,
                           'cap': 'Приложение d-you будет бесплатным и работать на обычном смартфоне. '
                                  'Пользоваться им — по желанию.',
                           'credit': 'Dennis Cortés · CC0 · Wikimedia Commons'},
            'reichstag': {'w': 1200, 'h': 707,
                          'cap': 'Здание Рейхстага в Берлине — здесь заседает бундестаг. Закон о '
                                 'цифровой идентичности одобрил его комитет по цифровым делам.',
                          'credit': 'Jörg Braukmann · ' + SA4},
        },
    },
    'inflation-september-2026': {
        'title': 'Teures Tanken: Die Inflation steigt auf 3,3 Prozent',
        'titleRu': 'Дорогой бензин: инфляция выросла до 3,3 процента',
        'rubric': 'economy',
        'level': 'B1',
        'levelNote': 'Сравнительная степень (teurer, billiger, höher als, mehr als), werden + прилагательное '
                     '(wurden teurer), плюсквамперфект (hatte … gelegen), проценты и числа, '
                     'экономическая лексика (Verbraucherpreise, Inflationsrate, Dienstleistungen).',
        'published': '2026-10-13',
        'added': '2026-10-15',
        'source': 'Statistisches Bundesamt (Destatis)',
        'sourceUrl': 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_364_611.html',
        'blurb': 'В сентябре цены в Германии выросли на 3,3 % — больше всего с декабря 2023 года. '
                 'Бензин подорожал на 37 %, печное топливо — на 75 %, а масло подешевело почти на треть.',
        'license': 'Текст — пересказ пресс-релиза Destatis; фото — Wikimedia Commons',
        'figs': {
            'markt': {'w': 1200, 'h': 800,
                      'cap': 'Брюссельская капуста на рынке в Мюнстере. Свежие овощи за год '
                             'подорожали на 12 процентов.',
                      'credit': 'Dietmar Rabich · ' + SA4},
            'tankstelle': {'w': 1200, 'h': 800,
                           'cap': 'Заправка в Лейпциге. Бензин и дизель за год подорожали больше '
                                  'чем на треть.',
                           'credit': 'Frank Eritt · ' + SA4},
            'eier': {'w': 1200, 'h': 972,
                     'cap': 'Упаковка из десяти яиц. Яйца в сентябре стоили на 15 процентов '
                            'больше, чем год назад.',
                     'credit': 'Frank C. Müller · ' + SA4},
        },
    },
    'zwiebelmarkt-weimar-2026': {
        'title': 'Zwiebeln, Zöpfe und Goethe: Weimar feiert seinen 373. Zwiebelmarkt',
        'titleRu': 'Лук, косы и Гёте: Веймар отпраздновал 373-й Луковый рынок',
        'rubric': 'events',
        'level': 'B1',
        'levelNote': 'Претерит (drehte sich, fand … statt, verkauften, schmückte), пассив (werden '
                     'geflochten, wurde erwähnt), отделяемые глаголы (fand … statt, bauten … auf), '
                     'плюсквамперфект (hatte gerechnet), sollen в значении «говорят» (soll gewesen sein).',
        'published': '2026-10-11',
        'added': '2026-10-15',
        'source': 'Stadt Weimar · weimar-kennenlernen.de · Polizei Weimar',
        'sourceUrl': 'https://www.weimar.de/kultur/veranstaltungen/maerkte-und-feste/zwiebelmarkt/',
        'blurb': 'С 9 по 11 октября Веймар отмечал 373-й Луковый рынок: 450 торговцев, девять сцен, '
                 'луковый пирог и знаменитые луковые косы из Хельдрунгена — их любил даже Гёте.',
        'license': 'Текст — пересказ материалов города Веймар, weimar-kennenlernen.de и полиции Веймара; '
                   'фото — Wikimedia Commons',
        'figs': {
            'zwiebeln': {'w': 1200, 'h': 709,
                         'cap': 'Луковые косы с сухими цветами — главный товар Лукового рынка в Веймаре.',
                         'credit': 'Kora27 · ' + SA4},
            'markt': {'w': 1200, 'h': 746,
                      'cap': 'Сувениры на Луковом рынке: человечки из луковиц в платочках.',
                      'credit': 'Kora27 · ' + SA4},
            'gartenhaus': {'w': 1200, 'h': 803,
                           'cap': 'Садовый домик Гёте в парке на Ильме в Веймаре. Поэт прожил в '
                                  'Веймаре больше пятидесяти лет.',
                           'credit': 'Rolf Kranz · ' + SA4},
        },
    },
})

ORDER = ['weisse-zwerge-2026', 'schiffswrack-kekova-2026', 'd-you-wallet-2026',
         'inflation-september-2026', 'zwiebelmarkt-weimar-2026'] + ORDER

META.update({
    'asteroiden-erdnaehe-2026': {
        'title': 'Näher als der Mond: Zwei kleine Asteroiden fliegen an der Erde vorbei',
        'titleRu': 'Ближе Луны: два небольших астероида пролетели мимо Земли',
        'rubric': 'astronomy',
        'level': 'B1–B2',
        'levelNote': 'Перфект и претерит (sind vorbeigeflogen, flog vorbei, kam heran), пассив '
                     '(wurde beobachtet, wurden verletzt), конъюнктив II в прошедшем (Hätten sie … '
                     'getroffen, wären sie … zerplatzt), je … desto, отделяемые приставки, числа и время.',
        'published': '2026-10-14',
        'added': '2026-10-16',
        'source': 'NASA/JPL · Sky TG24',
        'sourceUrl': 'https://tg24.sky.it/scienze/2026/10/14/asteroidi-terra',
        'blurb': 'Астероиды 2026 TG9 и 2026 TP6 размером с дом с разницей в 19 часов прошли '
                 'примерно на полпути между Землёй и Луной. Их открыли всего за несколько дней до этого.',
        'license': 'Текст — пересказ по данным NASA/JPL (Close-Approach Database) и Sky TG24; '
                   'фото — Wikimedia Commons',
        'figs': {
            'bennu': {'w': 1200, 'h': 675,
                      'cap': 'Так выглядит астероид вблизи: Бенну, снятый зондом OSIRIS-REx. Он намного '
                             'больше (около 500 метров), а 2026 TG9 и 2026 TP6 размером всего с дом.',
                      'credit': 'NASA/Goddard/University of Arizona · общественное достояние'},
            'catalina': {'w': 1200, 'h': 800,
                         'cap': 'Купол одного из телескопов обзора Catalina Sky Survey в горах Аризоны. '
                                'Такие телескопы каждую ночь ищут астероиды, сближающиеся с Землёй.',
                         'credit': 'Daniel Oberhaus · CC BY-SA 4.0'},
            'bok': {'w': 1200, 'h': 800,
                    'cap': 'Национальная обсерватория Китт-Пик в Аризоне. Справа — башня телескопа Бок, '
                           'на снимках которого впервые заметили 2026 TP6.',
                    'credit': 'KPNO/NOIRLab/NSF/AURA/D. Wilmarth · CC BY 4.0'},
        },
    },
})

ORDER = ['asteroiden-erdnaehe-2026'] + ORDER

META.update({
    'trump-iran-atomwaffen-2026': {
        'title': 'Keine Atomwaffen, keine Bodentruppen: Trump spricht über den Krieg mit dem Iran',
        'titleRu': 'Без ядерного оружия и сухопутных войск: Трамп о войне с Ираном',
        'rubric': 'events',
        'level': 'B1',
        'levelNote': 'Модальные глаголы с инфинитивом в конце (will … einsetzen, können … zwingen), '
                     'пассив (wurden angegriffen, sind getötet worden), безличный пассив (wird gekämpft), '
                     'претерит (griffen an, brach zusammen, starben), плюсквамперфект (hatte … geäußert), '
                     'конъюнктив II (könnte enden), придаточные с dass.',
        'published': '2026-10-16',
        'added': '2026-10-17',
        'source': 'Newsmax · Reuters · wallstreet-online · Tagesspiegel',
        'sourceUrl': 'https://www.wallstreet-online.de/nachricht/21534607-oel-105-hormus-blutet-trump-regierung-prueft-mutter-bomben-iran-droht-angriffen',
        'blurb': 'Трамп заявил, что не применит против Ирана ядерное оружие и не пошлёт туда сухопутные '
                 'войска. Тегеран отвечает, что бомбами его не заставить сдаться, а нефть из-за '
                 'обстановки в Ормузском проливе подорожала до 105 долларов за баррель.',
        'license': 'Текст — пересказ сообщений Newsmax, Reuters, wallstreet-online и Tagesspiegel; '
                   'фото — Wikimedia Commons',
        'figs': {
            'trump': {'w': 1000, 'h': 800,
                      'cap': 'Дональд Трамп на официальном портрете 2025 года. Война с Ираном идёт '
                             'с конца февраля 2026 года.',
                      'credit': 'Daniel Torok / The White House · общественное достояние'},
            'moab': {'w': 1200, 'h': 900,
                     'cap': 'GBU-43/B, «мать всех бомб», перед испытанием. Это самая мощная '
                            'неядерная бомба в арсенале США.',
                     'credit': 'U.S. Department of Defense · общественное достояние'},
            'hormus': {'w': 1200, 'h': 674,
                       'cap': 'Ормузский пролив, вид с МКС. Он соединяет Персидский залив с Оманским '
                              'заливом — это главный морской путь для нефти из стран Залива.',
                       'credit': 'NASA · общественное достояние'},
        },
    },
})

ORDER = ['trump-iran-atomwaffen-2026'] + ORDER

META.update({
    'korea-humanoide-fabrik-2026': {
        'title': 'Ohne Schutzzaun: In Südkorea arbeiten Roboter bald direkt neben Menschen',
        'titleRu': 'Без защитного ограждения: в Южной Корее роботы будут работать рядом с людьми',
        'rubric': 'tech',
        'level': 'B1',
        'levelNote': 'Модальные глаголы (dürfen, müssen, sollen, wollen) с инфинитивом в конце, '
                     'отделяемые глаголы (fällt … weg, schreibt … vor, kommen … hinauf), косвенные вопросы '
                     '(welche, wie lange, ob, wie oft), косвенная речь с конъюнктивом (sagte, die Regeln müssten …), '
                     'претерит (mussten, trennte), лексика ИИ и производства.',
        'published': '2026-10-13',
        'added': '2026-10-17',
        'source': 'Kyunghyang Shinmun · Humanoids Daily · Origin of Bots',
        'sourceUrl': 'https://www.khan.co.kr/en/article/202610131633027',
        'blurb': 'Южная Корея впервые разрешила человекоподобным роботам с ИИ работать на заводах, верфи и '
                 'складе без защитного ограждения: 20 двуногих роботов компании Robros проходят испытание '
                 'рядом с людьми. А в Чхонане парки будут патрулировать роботы на четырёх ногах.',
        'license': 'Текст — пересказ сообщений Kyunghyang Shinmun, Humanoids Daily и Origin of Bots; '
                   'фото — Wikimedia Commons',
        'figs': {
            'hubo': {'w': 1200, 'h': 799,
                     'cap': 'Человекоподобный робот HUBO из корейского института KAIST на соревновании DARPA '
                            'в 2015 году. Южная Корея давно развивает таких роботов.',
                     'credit': 'John Williams / U.S. Navy · общественное достояние'},
            'fabrik': {'w': 1200, 'h': 900,
                       'cap': 'Роботы KUKA собирают кузова на заводе Ford в Кёльне. Такие роботы закреплены '
                              'на месте и огорожены сеткой: людям в эту зону входить нельзя.',
                       'credit': 'GillyBerlin · CC BY 2.0 · Wikimedia Commons'},
            'spot': {'w': 1200, 'h': 800,
                     'cap': 'Робот на четырёх ногах на лесной тропе. Такие роботы проходят там, '
                            'где не проедут колёсные: по ступенькам и бездорожью.',
                     'credit': 'Jonte · ' + SA4},
        },
    },
})

ORDER = ['korea-humanoide-fabrik-2026'] + ORDER

META.update({
    'neptun-ringboegen-2026': {
        'title': 'Zwei Bögen weg, ein neuer da: Neptuns Ring verändert sich',
        'titleRu': 'Две дуги пропали, одна появилась: кольцо Нептуна меняется',
        'rubric': 'astronomy',
        'level': 'B1',
        'levelNote': 'Перфект с sein (sind verschwunden, ist entstanden, ist geworden), претерит '
                     '(entdeckte, bekamen, sahen, fotografierte), пассив состояния (ist verteilt), '
                     'конъюнктив II (müsste … verteilen), сравнительная степень (dichter, schwächer, kürzer, heller), '
                     'отделяемые глаголы (hält … zusammen), лексика астрономии.',
        'published': '2026-10-16',
        'added': '2026-10-19',
        'source': 'Observatoire de Paris · forschung-und-wissen.de',
        'sourceUrl': 'https://forschung-und-wissen.de/nachrichten/astronomie/neptuns-ring-verliert-zwei-boegen-und-bildet-einen-neuen-133714586',
        'blurb': 'В кольце Адамса у Нептуна с 1989 года были четыре яркие дуги. Две из них исчезли, '
                 'третья ослабла, зато появилась новая — Sincerity. Почему вещество не расходится '
                 'по всему кольцу, учёные пока точно не знают.',
        'license': 'Текст — пересказ сообщений Парижской обсерватории и forschung-und-wissen.de; '
                   'фото — Wikimedia Commons',
        'figs': {
            'neptun': {'w': 900, 'h': 899,
                       'cap': 'Нептун на снимке «Вояджера-2», август 1989 года. Это единственный зонд, '
                              'который пролетел мимо этой планеты.',
                       'credit': 'NASA/JPL · общественное достояние'},
            'boegen': {'w': 1125, 'h': 889,
                       'cap': 'Кольца Нептуна на снимке «Вояджера-2». На внешнем кольце, кольце Адамса, '
                              'видны яркие сгущения вещества — дуги.',
                       'credit': 'NASA/JPL, Voyager 2 Team · общественное достояние'},
            'webb': {'w': 1200, 'h': 800,
                     'cap': 'Нептун и его тонкие кольца на снимке телескопа «Джеймс Уэбб» 2022 года. '
                            'В инфракрасном свете планета тёмная, поэтому кольца хорошо видны.',
                     'credit': 'NASA, ESA, CSA, STScI · общественное достояние'},
        },
    },
})

ORDER = ['neptun-ringboegen-2026'] + ORDER

META.update({
    'riesenpilz-d-rex-2026': {
        'title': 'D-rex aus dem Wald: Forscher entdecken einen Riesenpilz in China',
        'titleRu': 'D-rex из леса: в Китае нашли гигантский гриб',
        'rubric': 'science',
        'level': 'B1',
        'levelNote': 'Перфект (haben entdeckt, hat gesammelt, ist entstanden, ist erschienen), претерит '
                     '(wuchsen, kannte, waren), относительные придаточные (den bisher niemand kannte, die gerade absterben), '
                     'косвенный вопрос (wie alt … ist), dass-придаточное, so … dass, сложные существительные '
                     '(Schlauchpilz, Pilzfamilie, Fachzeitschrift), лексика биологии.',
        'published': '2026-10-18',
        'added': '2026-10-19',
        'source': 'scinexx · Frontiers',
        'sourceUrl': 'https://www.scinexx.de/news/biowissen/d-rex-riesenpilz-aus-china-koennte-zur-zeit-des-dinosauriersterbens-entstanden-sein/',
        'blurb': 'В провинции Юньнань учёные нашли гриб высотой до 50 сантиметров и весом до 2,2 килограмма — '
                 'самый крупный среди сумчатых грибов. Его назвали D-rex, а для него пришлось выделить '
                 'новое семейство: оно возникло вскоре после вымирания динозавров.',
        'license': 'Текст — пересказ сообщений scinexx и Frontiers; фото — Senanayake et al., '
                   'Frontiers in Fungal Biology (CC BY 4.0) и Wikimedia Commons',
        'figs': {
            'pilz': {'w': 885, 'h': 1135,
                     'cap': 'Плодовые тела D-rex у корней дерева в лесу провинции Юньнань. '
                            'Они светлые и растут вертикально, как толстые пальцы.',
                     'credit': 'Senanayake et al. 2026, Frontiers in Fungal Biology · CC BY 4.0'},
            'waage': {'w': 800, 'h': 660,
                      'cap': 'Несколько грибов D-rex на весах. Одно плодовое тело может весить '
                             'до 2,2 килограмма.',
                      'credit': 'Senanayake et al. 2026, Frontiers in Fungal Biology · CC BY 4.0'},
            'trex': {'w': 1200, 'h': 848,
                     'cap': 'Скелет тираннозавра «Сью» в Музее естественной истории Филда в Чикаго. '
                            'Слово rex в названии гриба — то же, что у тираннозавра: «король».',
                     'credit': 'Michael Gray · CC BY-SA 2.0 · Wikimedia Commons'},
        },
    },
})

ORDER = ['riesenpilz-d-rex-2026'] + ORDER

META.update({
    'sparkassen-krypto-2026': {
        'title': 'Bitcoin in der Sparkassen-App: Erste Sparkassen starten den Kryptohandel',
        'titleRu': 'Биткоин в приложении: первые сберкассы Sparkasse запустили торговлю криптовалютой',
        'rubric': 'tech',
        'level': 'B1',
        'levelNote': 'Отделяемые глаголы (bieten … an, dazukommen), модальные глаголы с инфинитивом в конце '
                     '(sollen … dazukommen, kann … verlieren), es gibt … nicht, возвратный глагол (richtet sich an), '
                     'косвенная речь с конъюнктивом I (seien), относительное придаточное (die selbst handeln wollen), '
                     'лексика финансов и банков.',
        'published': '2026-10-19',
        'added': '2026-10-19',
        'source': 't3n · WinFuture',
        'sourceUrl': 'https://t3n.de/news/sparkassen-kryptohandel-bitcoin-warnung-1768795/',
        'blurb': 'С 19 октября первые немецкие сберкассы позволяют покупать Bitcoin, Ethereum и ещё три '
                 'криптовалюты прямо в своём приложении. Консультаций не будет, а сами Sparkassen предупреждают: '
                 'это высокоспекулятивные вложения, деньги можно потерять полностью.',
        'license': 'Текст — пересказ сообщений t3n и WinFuture; фото — Wikimedia Commons',
        'figs': {
            'sparkasse': {'w': 567, 'h': 378,
                          'cap': 'Здание сберкассы в Тауберфранкене (Баден-Вюртемберг). Sparkassen — '
                                 'местные банки, они есть почти в каждом немецком городе.',
                          'credit': 'Biest55 · CC0 · Wikimedia Commons'},
            'bitcoin': {'w': 1200, 'h': 801,
                        'cap': 'Сувенирная монета с символом биткоина. Настоящие биткоины существуют '
                               'только в цифровом виде.',
                        'credit': 'Shixart1985 · CC BY 2.0 · Wikimedia Commons'},
            'boerse': {'w': 1200, 'h': 800,
                       'cap': 'Здание Штутгартской биржи. Вместе с ней DekaBank хранит криптовалюты '
                              'клиентов сберкасс.',
                       'credit': 'Fred Romero · CC BY 2.0 · Wikimedia Commons'},
        },
    },
})

ORDER = ['sparkassen-krypto-2026'] + ORDER
