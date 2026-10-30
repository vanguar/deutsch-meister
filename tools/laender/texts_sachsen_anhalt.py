"""sachsen-anhalt: тексты B1/B2. Сверено 2026-10-30.
Источники (география, история, экономика, языки, культура):
https://sachsen-anhalt.de/land-sachsenanhalt/land-und-leute/page/geschichte
https://statistik.sachsen-anhalt.de/news/news-details/212-mio-menschen-lebten-am-31122025-in-sachsen-anhalt
https://statistik.sachsen-anhalt.de/fileadmin/Bibliothek/Landesaemter/StaLa/startseite/Daten_und_Veroeffentlichungen/Veroeffentlichungen/Statistisches_Jahrbuch/6Z001_2024_A.pdf
https://www.landtag.sachsen-anhalt.de/landtag/plenum
https://bauhaus-dessau.de/institution/chronologie/
https://whc.unesco.org/en/list/535
https://whc.unesco.org/en/list/1470/
https://laf.sachsen-anhalt.de/projekte/oegp-oekologische-grossprojekte/leuna
https://kultur.sachsen-anhalt.de/kultur-gestalten/traditions-und-heimatpflege/niederdeutsch
https://sachsen-anhalt-tourismus.de/dein-urlaub/genuss-entspannung/essen-trinken
https://www.bpb.de/themen/zeit-kulturgeschichte/reformation/234689/schlaglicht-1517-der-sogenannte-thesenanschlag/
"""

TEXTS = {'sachsen-anhalt-b1': [('Ein Land an Elbe und Saale',
                        'Земля на Эльбе и Зале',
                        '🗺️',
                        [[('Sachsen-Anhalt liegt in der Mitte und im Osten Deutschlands.',
                           'Саксония-Анхальт расположена в средней и восточной части Германии.',
                           {}),
                          ('Die Hauptstadt Magdeburg liegt an der Elbe.', 'Столица Магдебург стоит на Эльбе.', {}),
                          ('Halle an der Saale ist eine weitere große Stadt.',
                           'Галле на Зале — ещё один большой город.',
                           {})],
                         [('Auch Dessau-Roßlau ist ein wichtiges Zentrum des Landes.',
                           'Дессау-Рослау тоже является важным центром земли.',
                           {}),
                          ('Ende 2025 lebten hier rund 2,12 Millionen Menschen.',
                           'На конец 2025 года здесь жили около 2,12 миллиона человек.',
                           {}),
                          ('Sachsen-Anhalt und Sachsen sind zwei verschiedene Bundesländer.',
                           'Саксония-Анхальт и Саксония — две разные федеральные земли.',
                           {})]]),
                       ('Vom Harz bis zur Börde',
                        'От Гарца до Бёрде',
                        '🏞️',
                        [[('Im Westen des Landes liegt ein Teil des Harzes.',
                           'На западе земли лежит часть Гарца.',
                           {}),
                          ('Der Brocken ist mit 1141 Metern der höchste Berg des Landes.',
                           'Броккен высотой 1141 метр — самая высокая гора земли.',
                           {}),
                          ('Viele Menschen besuchen die Region zum Wandern.',
                           'Многие приезжают в регион ради пеших походов.',
                           {})],
                         [('Die Magdeburger Börde hat besonders fruchtbare Böden.',
                           'Магдебургская Бёрде отличается особенно плодородными почвами.',
                           {}),
                          ('Deshalb ist die Landwirtschaft dort sehr wichtig.',
                           'Поэтому сельское хозяйство там очень важно.',
                           {}),
                          ('Flüsse, Felder und Wälder machen die Landschaft abwechslungsreich.',
                           'Реки, поля и леса делают ландшафт разнообразным.',
                           {})]]),
                       ('Luther und die Reformation',
                        'Лютер и Реформация',
                        '📜',
                        [[('Wittenberg ist eng mit Martin Luther und der Reformation verbunden.',
                           'Виттенберг тесно связан с Мартином Лютером и Реформацией.',
                           {}),
                          ('1517 veröffentlichte Luther seine 95 Thesen gegen den Ablasshandel.',
                           'В 1517 году Лютер опубликовал 95 тезисов против торговли индульгенциями.',
                           {}),
                          ('Damit begann eine große religiöse und gesellschaftliche Veränderung.',
                           'С этого начались большие религиозные и общественные перемены.',
                           {})],
                         [('Über den berühmten Anschlag der Thesen an eine Kirchentür wird bis heute diskutiert.',
                           'О знаменитом прибивании тезисов к церковной двери спорят до сих пор.',
                           {}),
                          ('Sicher ist, dass die Thesen eine große Wirkung hatten.',
                           'Достоверно известно, что тезисы оказали большое влияние.',
                           {}),
                          ('Heute erinnern Museen und historische Orte an diese Zeit.',
                           'Сегодня об этом времени напоминают музеи и исторические места.',
                           {})]]),
                       ('Ein junges Bundesland',
                        'Молодая федеральная земля',
                        '🏛️',
                        [[('Unter dem Namen Sachsen-Anhalt bestand schon von 1947 bis 1952 ein Land.',
                           'Под названием Саксония-Анхальт земля существовала уже с 1947 по 1952 год.',
                           {}),
                          ('Die DDR löste das Land 1952 auf und bildete Bezirke.',
                           'В 1952 году ГДР упразднила землю и создала округа.',
                           {'löste+auf': 'упразднила'}),
                          ('Am 3. Oktober 1990 wurde Sachsen-Anhalt neu gegründet.',
                           '3 октября 1990 года Саксония-Анхальт была создана заново.',
                           {})],
                         [('Der Landtag sitzt in Magdeburg und beschließt Gesetze.',
                           'Ландтаг заседает в Магдебурге и принимает законы.',
                           {}),
                          ('Er kontrolliert außerdem die Arbeit der Landesregierung.',
                           'Кроме того, он контролирует работу правительства земли.',
                           {}),
                          ('Bei Landtagswahlen entscheiden die Bürger über die Zusammensetzung des Parlaments.',
                           'На выборах в ландтаг граждане решают, каким будет состав парламента.',
                           {})]]),
                       ('Bauhaus und alte Städte',
                        'Баухаус и старинные города',
                        '🎨',
                        [[('Das Bauhaus zog 1925 von Weimar nach Dessau.',
                           'В 1925 году Баухаус переехал из Веймара в Дессау.',
                           {}),
                          ('In Dessau entstand sein berühmtes Schulgebäude.',
                           'В Дессау появилось его знаменитое учебное здание.',
                           {}),
                          ('Die Schule verband Kunst, Handwerk und moderne Gestaltung.',
                           'Школа соединяла искусство, ремесло и современный дизайн.',
                           {})],
                         [('Quedlinburg ist dagegen für seine vielen alten Fachwerkhäuser bekannt.',
                           'Кведлинбург, в свою очередь, известен множеством старинных фахверковых домов.',
                           {}),
                          ('Auch der Dom in Naumburg gehört zum UNESCO-Welterbe.',
                           'Собор в Наумбурге тоже относится к Всемирному наследию ЮНЕСКО.',
                           {}),
                          ('Das Land zeigt also Baukunst aus ganz verschiedenen Zeiten.',
                           'Таким образом, земля показывает архитектуру совершенно разных эпох.',
                           {})]]),
                       ('Arbeit und Wandel',
                        'Работа и перемены',
                        '🏭',
                        [[('Die chemische Industrie spielt in Sachsen-Anhalt eine wichtige Rolle.',
                           'Химическая промышленность играет в Саксонии-Анхальт важную роль.',
                           {}),
                          ('Leuna ist ein bekannter Standort dieser Branche.',
                           'Лойна — известный центр этой отрасли.',
                           {}),
                          ('Neben großen Werken gibt es viele kleinere Unternehmen.',
                           'Наряду с крупными заводами есть много небольших предприятий.',
                           {})],
                         [('Auch Landwirtschaft, Dienstleistungen und Tourismus schaffen Arbeitsplätze.',
                           'Сельское хозяйство, услуги и туризм тоже создают рабочие места.',
                           {}),
                          ('Alte Industriestandorte brauchen oft neue Technik und besseren Umweltschutz.',
                           'Старым промышленным площадкам часто нужны новая техника и более эффективная защита '
                           'окружающей среды.',
                           {}),
                          ('Dieser Wandel ist eine Aufgabe für Betriebe, Politik und Beschäftigte.',
                           'Эти перемены — задача для предприятий, политики и работников.',
                           {})]]),
                       ('Sprache und Spezialitäten',
                        'Язык и местные блюда',
                        '🍰',
                        [[('In Sachsen-Anhalt gibt es verschiedene regionale Sprechweisen.',
                           'В Саксонии-Анхальт существуют разные региональные способы речи.',
                           {}),
                          ('Im Norden und Westen hört man auch Niederdeutsch, oft Platt genannt.',
                           'На севере и западе слышен и нижненемецкий, который часто называют Platt.',
                           {}),
                          ('Die Pflege dieser Sprache ist ein Teil der regionalen Kultur.',
                           'Сохранение этого языка — часть региональной культуры.',
                           {})],
                         [('Salzwedel in der Altmark ist für seinen Baumkuchen bekannt.',
                           'Зальцведель в Альтмарке известен своим баумкухеном.',
                           {}),
                          ('Dieser Kuchen wird Schicht für Schicht an einem Spieß gebacken.',
                           'Этот пирог пекут на вертеле слой за слоем.',
                           {}),
                          ('Beim Anschneiden erinnern die Schichten an die Ringe eines Baumes.',
                           'На срезе слои напоминают годичные кольца дерева.',
                           {})]])],
 'sachsen-anhalt-b2': [('Ein eigener Raum zwischen Elbe und Saale',
                        'Самостоятельный регион между Эльбой и Зале',
                        '🗺️',
                        [[('Sachsen-Anhalt ist trotz seines Namens kein Teil Sachsens, sondern ein eigenständiges '
                           'Bundesland mit der Hauptstadt Magdeburg.',
                           'Несмотря на название, Саксония-Анхальт не часть Саксонии, а самостоятельная '
                           'федеральная земля со столицей в Магдебурге.',
                           {}),
                          ('Magdeburg an der Elbe und Halle an der Saale bilden wichtige städtische Zentren, '
                           'daneben steht Dessau-Roßlau für weitere kulturelle Traditionen.',
                           'Магдебург на Эльбе и Галле на Зале образуют важные городские центры; Дессау-Рослау '
                           'представляет и другие культурные традиции.',
                           {})],
                         [('Nach Angaben des Statistischen Landesamtes lebten Ende 2025 rund 2,12 Millionen '
                           'Menschen im Land; solche Zahlen benötigen immer einen Zeitbezug.',
                           'По данным статистического ведомства земли, на конец 2025 года в ней жили около 2,12 '
                           'миллиона человек; таким цифрам всегда нужна привязка ко времени.',
                           {}),
                          ('Eine gemeinsame Landesgrenze bedeutet dabei nicht, dass alle Regionen dieselbe '
                           'Geschichte oder dieselben wirtschaftlichen Voraussetzungen haben.',
                           'Общие границы земли при этом не означают, что у всех регионов одинаковая история или '
                           'одинаковые экономические предпосылки.',
                           {})]]),
                       ('Landschaft, Boden und Nutzung',
                        'Ландшафт, почва и использование',
                        '🏞️',
                        [[('Der Harz im Westen, die Flusslandschaften an Elbe und Saale und die Magdeburger Börde '
                           'zeigen unterschiedliche Naturräume.',
                           'Гарц на западе, речные ландшафты Эльбы и Зале и Магдебургская Бёрде представляют '
                           'разные природные пространства.',
                           {}),
                          ('Der 1141 Meter hohe Brocken ist der höchste Berg des Landes und ein bekanntes Ziel '
                           'für Besucher des Harzes.',
                           'Броккен высотой 1141 метр — высшая гора земли и известная цель посетителей Гарца.',
                           {})],
                         [('Die fruchtbaren Böden der Börde begünstigen die Landwirtschaft, während in anderen '
                           'Regionen Waldwirtschaft und Tourismus stärker sichtbar sind.',
                           'Плодородные почвы Бёрде благоприятствуют сельскому хозяйству, тогда как в других '
                           'регионах заметнее лесное хозяйство и туризм.',
                           {}),
                          ('Die Nutzung solcher Landschaften verlangt langfristige Entscheidungen, damit '
                           'wirtschaftliche Interessen und der Schutz natürlicher Lebensräume zusammenpassen.',
                           'Использование таких ландшафтов требует долгосрочных решений, чтобы экономические '
                           'интересы сочетались с защитой природных местообитаний.',
                           {})]]),
                       ('Reformation und historische Quellen',
                        'Реформация и исторические источники',
                        '📜',
                        [[('Mit Wittenberg verbindet sich die Reformation, deren Anfänge eng mit Martin Luthers '
                           'Veröffentlichung der 95 Thesen im Jahr 1517 zusammenhängen.',
                           'С Виттенбергом связана Реформация, начало которой тесно связано с публикацией '
                           'Мартином Лютером 95 тезисов в 1517 году.',
                           {}),
                          ('Seine Kritik am Ablasshandel entwickelte eine Wirkung, die weit über eine '
                           'theologische Diskussion hinausging.',
                           'Его критика торговли индульгенциями оказала влияние, далеко выходившее за рамки '
                           'богословского спора.',
                           {})],
                         [('Die berühmte Darstellung, Luther habe die Thesen selbst an eine Kirchentür genagelt, '
                           'ist historisch umstritten.',
                           'Знаменитое изображение того, как Лютер сам прибивает тезисы к церковной двери, '
                           'исторически спорно.',
                           {}),
                          ('Das Beispiel zeigt, warum man zwischen belegten Ereignissen, späteren Erzählungen und '
                           'symbolischen Bildern unterscheiden sollte.',
                           'Этот пример показывает, почему следует различать подтверждённые события, позднейшие '
                           'рассказы и символические образы.',
                           {})]]),
                       ('Landesgeschichte und Demokratie',
                        'История земли и демократия',
                        '🏛️',
                        [[('Das Land Sachsen-Anhalt bestand unter diesem Namen bereits von 1947 bis 1952, bevor '
                           'die DDR es im Zuge ihrer Zentralisierung auflöste.',
                           'Земля Саксония-Анхальт существовала под этим названием уже с 1947 по 1952 год, прежде '
                           'чем ГДР упразднила её в ходе централизации.',
                           {}),
                          ('Die Neugründung am 3. Oktober 1990 gehört zur föderalen Neuordnung Deutschlands im '
                           'Zusammenhang mit der Wiedervereinigung.',
                           'Воссоздание 3 октября 1990 года относится к федеративному переустройству Германии в '
                           'связи с её объединением.',
                           {})],
                         [('Im Landtag in Magdeburg werden Gesetze beraten und beschlossen; zugleich müssen die '
                           'Abgeordneten die Landesregierung kontrollieren.',
                           'В ландтаге в Магдебурге обсуждают и принимают законы; одновременно депутаты должны '
                           'контролировать правительство земли.',
                           {}),
                          ('Die Kontrolle politischer Macht ist ein wesentlicher Teil der parlamentarischen '
                           'Demokratie und nicht nur eine Aufgabe vor Wahlen.',
                           'Контроль политической власти — важнейшая часть парламентской демократии, а не только '
                           'задача перед выборами.',
                           {})]]),
                       ('Vom Fachwerk zur Moderne',
                        'От фахверка к модернизму',
                        '🎨',
                        [[('Sachsen-Anhalts kulturelles Erbe umfasst mittelalterliche Städte und Kirchen ebenso '
                           'wie Bauten der architektonischen Moderne.',
                           'Культурное наследие Саксонии-Анхальт включает как средневековые города и церкви, так '
                           'и здания архитектурного модернизма.',
                           {}),
                          ('Quedlinburg ist mit seinen Fachwerkhäusern ein herausragendes Beispiel historischer '
                           'Stadtentwicklung; der Naumburger Dom zeigt bedeutende mittelalterliche Kunst.',
                           'Кведлинбург с его фахверковыми домами — выдающийся пример исторического развития '
                           'города; Наумбургский собор представляет значительное средневековое искусство.',
                           {})],
                         [('Das Bauhaus setzte seine Arbeit ab 1925 in Dessau fort, nachdem die Schule zuvor in '
                           'Weimar gegründet worden war.',
                           'С 1925 года Баухаус продолжил работу в Дессау; до этого школа была основана в '
                           'Веймаре.',
                           {}),
                          ('Die unterschiedlichen Orte machen deutlich, dass kulturelles Erbe aus vielen Epochen '
                           'stammt und immer wieder neu vermittelt werden muss.',
                           'Эти разные места показывают, что культурное наследие относится ко многим эпохам и его '
                           'нужно снова и снова объяснять новым поколениям.',
                           {})]]),
                       ('Chemie und wirtschaftlicher Umbau',
                        'Химия и экономическая перестройка',
                        '🏭',
                        [[('Die chemische Industrie prägt Teile Sachsen-Anhalts seit langer Zeit; Leuna ist dafür '
                           'ein besonders bekannter Standort.',
                           'Химическая промышленность давно определяет облик части Саксонии-Анхальт; особенно '
                           'известный её центр — Лойна.',
                           {}),
                          ('Die Weiterentwicklung alter Industrieflächen umfasst nicht nur neue Anlagen, sondern '
                           'auch die Sanierung früher entstandener Umweltschäden.',
                           'Дальнейшее развитие старых промышленных территорий включает не только новые '
                           'установки, но и устранение ранее возникшего экологического ущерба.',
                           {})],
                         [('Wirtschaftlicher Wandel betrifft außerdem Qualifikationen, Energieversorgung und die '
                           'Frage, wie Beschäftigte an neuen Entwicklungen teilhaben können.',
                           'Экономические перемены затрагивают также квалификацию, энергоснабжение и вопрос о '
                           'том, как работники могут участвовать в новых процессах.',
                           {}),
                          ('Neben industriellen Zentren bleiben Landwirtschaft, Dienstleistungen und '
                           'Kulturtourismus wichtige Bestandteile einer vielfältigen regionalen Wirtschaft.',
                           'Наряду с промышленными центрами сельское хозяйство, услуги и культурный туризм '
                           'остаются важными составляющими разнообразной региональной экономики.',
                           {})]]),
                       ('Sprache und handwerkliche Tradition',
                        'Язык и ремесленная традиция',
                        '🍰',
                        [[('Niederdeutsch ist besonders im Norden und Westen des Landes beheimatet und wird durch '
                           'unterschiedliche regionale Formen repräsentiert.',
                           'Нижненемецкий особенно распространён на севере и западе земли и представлен разными '
                           'региональными формами.',
                           {}),
                          ('Seine Pflege zeigt, dass sprachliche Vielfalt nicht nur eine Frage von Landesgrenzen '
                           'ist, sondern auch im Alltag vor Ort entsteht.',
                           'Его сохранение показывает, что языковое разнообразие определяется не только границами '
                           'земель, но и местной повседневной жизнью.',
                           {})],
                         [('Eine andere Form regionaler Tradition ist der Salzwedeler Baumkuchen, der durch '
                           'wiederholtes Auftragen und Backen dünner Teigschichten entsteht.',
                           'Другая форма региональной традиции — зальцведельский баумкухен: его делают, '
                           'многократно нанося и выпекая тонкие слои теста.',
                           {}),
                          ('Solches Handwerk verbindet praktische Erfahrung mit lokaler Identität und wird durch '
                           'die Weitergabe von Wissen lebendig gehalten.',
                           'Такое ремесло соединяет практический опыт с местной идентичностью и остаётся живым '
                           'благодаря передаче знаний.',
                           {})]])]}
