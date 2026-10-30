"""thueringen: тексты B1/B2. Сверено 2026-10-30.
Источники (география, история, экономика, языки, культура):
https://www.thueringer-landtag.de/landtag/geschichte/landesverfassung/
https://geoportal.geoportal-th.de/uek250/UEK250T_Politisch_V_R.pdf
https://www.naturpark-thueringer-wald.de/seite/546875/masserberg-rennsteig.html
https://www.wartburg.de/personen/martin-luther
https://www.weimar.de/kultur/unesco-welterbe/
https://www.buchenwald.de/de/geschichte/chronologie
https://service.jena.de/de/standortinformationen
https://www.das-ist-thueringen.de/natur-kultur/thueringer-braeuche-und-traditionen/der-thueringer-dialekt-zwischen-tradition-und-wandel/
https://www.das-ist-thueringen.de/landleben-genuss/thueringer-bratwurst-kultur-trifft-kulinarik/
"""

TEXTS = {'thueringen-b1': [('In der Mitte Deutschlands',
                    'В середине Германии',
                    '🗺️',
                    [[('Thüringen liegt in der Mitte von Deutschland.',
                       'Тюрингия расположена в середине Германии.',
                       {}),
                      ('Die Hauptstadt ist Erfurt mit seiner historischen Altstadt.',
                       'Столица — Эрфурт с его историческим старым городом.',
                       {}),
                      ('Weitere bekannte Städte sind Jena, Weimar, Gera und Eisenach.',
                       'Другие известные города — Йена, Веймар, Гера и Айзенах.',
                       {})],
                     [('Das Land hat keine Grenze zu einem anderen Staat.',
                       'У земли нет границы с другим государством.',
                       {}),
                      ('Es grenzt nur an andere deutsche Bundesländer.',
                       'Она граничит только с другими немецкими землями.',
                       {}),
                      ('Städte, kleine Orte und Wälder liegen hier oft nah beieinander.',
                       'Города, небольшие поселения и леса здесь часто находятся рядом.',
                       {})]]),
                   ('Wald und Wanderwege',
                    'Лес и туристические тропы',
                    '🌲',
                    [[('Der Thüringer Wald ist ein bekanntes Mittelgebirge.',
                       'Тюрингский Лес — известное средневысотное горное образование.',
                       {}),
                      ('Hier kann man wandern und viele verschiedene Landschaften sehen.',
                       'Здесь можно ходить в походы и видеть самые разные ландшафты.',
                       {}),
                      ('Der Rennsteig ist ein bekannter Weg durch die Berge.',
                       'Реннштайг — известная тропа через горы.',
                       {})],
                     [('Viele Gäste kommen, um sich in der Natur zu erholen.',
                       'Многие гости приезжают, чтобы отдохнуть на природе.',
                       {'sich+erholen': 'отдохнуть'}),
                      ('Auch in den Wäldern gibt es Regeln zum Schutz von Tieren und Pflanzen.',
                       'В лесах тоже действуют правила защиты животных и растений.',
                       {}),
                      ('Wer auf den Wegen bleibt, hilft beim Schutz dieser Landschaft.',
                       'Тот, кто остаётся на тропах, помогает защищать этот ландшафт.',
                       {})]]),
                   ('Geschichte auf engem Raum',
                    'История на небольшой территории',
                    '📜',
                    [[('Früher bestand die Region aus vielen kleinen Staaten.',
                       'Раньше регион состоял из многих небольших государств.',
                       {}),
                      ('1920 schlossen sich mehrere dieser Staaten zum Land Thüringen zusammen.',
                       'В 1920 году несколько этих государств объединились в землю Тюрингия.',
                       {'schlossen+zusammen': 'объединились'}),
                      ('Das damalige Land hatte noch andere Grenzen als heute.',
                       'У тогдашней земли были другие границы, чем сегодня.',
                       {})],
                     [('Am 3. Oktober 1990 wurde Thüringen als Bundesland neu gegründet.',
                       '3 октября 1990 года Тюрингия была заново создана как федеральная земля.',
                       {}),
                      ('Zur Geschichte gehört auch das Konzentrationslager Buchenwald bei Weimar.',
                       'К истории относится и концлагерь Бухенвальд под Веймаром.',
                       {}),
                      ('Die heutige Gedenkstätte erinnert an die Opfer der nationalsozialistischen Verbrechen.',
                       'Сегодняшний мемориал напоминает о жертвах преступлений национал-социализма.',
                       {})]]),
                   ('Freistaat und Parlament',
                    'Свободное государство и парламент',
                    '🏛️',
                    [[('Der offizielle Name lautet Freistaat Thüringen.',
                       'Официальное название — Свободное государство Тюрингия.',
                       {}),
                      ('Wie in Sachsen bedeutet Freistaat auch hier Republik.',
                       'Как и в Саксонии, Freistaat означает здесь республику.',
                       {}),
                      ('Der Landtag hat seinen Sitz in Erfurt.', 'Ландтаг находится в Эрфурте.', {})],
                     [('Die Abgeordneten beschließen Gesetze und kontrollieren die Regierung.',
                       'Депутаты принимают законы и контролируют правительство.',
                       {}),
                      ('Die Verfassung wurde 1993 auf der Wartburg beschlossen.',
                       'Конституция была принята в 1993 году в Вартбурге.',
                       {}),
                      ('Die Bürger bestätigten sie 1994 in einem Volksentscheid.',
                       'Граждане утвердили её на референдуме в 1994 году.',
                       {})]]),
                   ('Weimar und die Wartburg',
                    'Веймар и Вартбург',
                    '🎭',
                    [[('Weimar ist eng mit den Dichtern Goethe und Schiller verbunden.',
                       'Веймар тесно связан с поэтами Гёте и Шиллером.',
                       {}),
                      ('Ihre Wohnhäuser sind heute Museen.', 'Их жилые дома сегодня стали музеями.', {}),
                      ('1919 wurde in Weimar das Bauhaus gegründet.',
                       'В 1919 году в Веймаре был основан Баухаус.',
                       {})],
                     [('Diese Schule verband Kunst, Handwerk und neue Ideen für Gestaltung.',
                       'Эта школа соединяла искусство, ремесло и новые идеи оформления.',
                       {}),
                      ('Auf der Wartburg bei Eisenach lebte Martin Luther 1521 und 1522.',
                       'В Вартбурге под Айзенахом Мартин Лютер жил в 1521 и 1522 годах.',
                       {}),
                      ('Dort übersetzte er das Neue Testament ins Deutsche.',
                       'Там он перевёл Новый Завет на немецкий.',
                       {})]]),
                   ('Wissenschaft und Arbeit',
                    'Наука и работа',
                    '🔬',
                    [[('Jena ist für seine Universität und die optische Industrie bekannt.',
                       'Йена известна университетом и оптической промышленностью.',
                       {}),
                      ('Optik beschäftigt sich mit Licht und seinen Eigenschaften.',
                       'Оптика изучает свет и его свойства.',
                       {'beschäftigt+sich': 'занимается'}),
                      ('Unternehmen entwickeln zum Beispiel Geräte mit Linsen und Lasern.',
                       'Предприятия разрабатывают, например, приборы с линзами и лазерами.',
                       {})],
                     [('Solche Technik wird in der Medizin und in Fabriken gebraucht.',
                       'Такая техника нужна в медицине и на заводах.',
                       {}),
                      ('Forschung und berufliche Ausbildung sind deshalb wichtige Aufgaben.',
                       'Поэтому исследования и профессиональное обучение — важные задачи.',
                       {}),
                      ('Thüringen bietet also nicht nur historische Orte, sondern auch moderne Arbeitsplätze.',
                       'Таким образом, в Тюрингии есть не только исторические места, но и современные рабочие '
                       'места.',
                       {})]]),
                   ('Dialekte und regionale Küche',
                    'Диалекты и региональная кухня',
                    '🌭',
                    [[('In Thüringen gibt es nicht nur einen einzigen Dialekt.',
                       'В Тюрингии существует не один-единственный диалект.',
                       {}),
                      ('Die Sprache klingt von Region zu Region anders.',
                       'Речь звучит по-разному в разных регионах.',
                       {}),
                      ('Auch beim Essen gibt es lokale Traditionen.', 'В еде тоже есть местные традиции.', {})],
                     [('Bekannt sind die Thüringer Rostbratwurst und die Thüringer Klöße.',
                       'Известны тюрингские жареные колбаски и тюрингские клёцки.',
                       {}),
                      ('Die Klöße werden aus Kartoffeln gemacht.', 'Клёцки делают из картофеля.', {}),
                      ('Viele Familien haben eigene Rezepte und geben sie an die nächste Generation weiter.',
                       'У многих семей есть свои рецепты, которые они передают следующему поколению.',
                       {'geben+weiter': 'передают'})]])],
 'thueringen-b2': [('Ein Binnenland mit vielen Zentren',
                    'Земля внутри страны со многими центрами',
                    '🗺️',
                    [[('Thüringen liegt im Zentrum Deutschlands und besitzt im Gegensatz zu Sachsen keine Grenze '
                       'zu einem ausländischen Staat.',
                       'Тюрингия находится в центре Германии и, в отличие от Саксонии, не имеет границы с '
                       'иностранным государством.',
                       {}),
                      ('Erfurt ist die Landeshauptstadt, während Jena, Weimar, Gera und Eisenach unterschiedliche '
                       'wirtschaftliche und kulturelle Funktionen erfüllen.',
                       'Эрфурт — столица земли, а Йена, Веймар, Гера и Айзенах выполняют разные экономические и '
                       'культурные функции.',
                       {})],
                     [('Die historische Vielfalt kleiner Territorien lässt sich noch heute an zahlreichen '
                       'Residenzstädten und ihren Bauwerken erkennen.',
                       'Историческое разнообразие небольших территорий и сегодня заметно по многочисленным бывшим '
                       'резиденциям правителей и их зданиям.',
                       {}),
                      ('Das Land lässt sich daher weder allein durch seine Hauptstadt noch ausschließlich durch '
                       'seine Wälder beschreiben.',
                       'Поэтому землю нельзя описать ни одной лишь столицей, ни исключительно её лесами.',
                       {})]]),
                   ('Naturraum und Verantwortung',
                    'Природное пространство и ответственность',
                    '🌲',
                    [[('Der Thüringer Wald und der bekannte Höhenwanderweg Rennsteig prägen das Bild des Landes '
                       'weit über seine Grenzen hinaus.',
                       'Тюрингский Лес и известная горная тропа Реннштайг определяют образ земли далеко за её '
                       'пределами.',
                       {}),
                      ('Wandertourismus kann Arbeitsplätze schaffen, setzt aber voraus, dass Wege und '
                       'empfindliche Lebensräume geschützt werden.',
                       'Пеший туризм может создавать рабочие места, но требует защиты троп и уязвимых природных '
                       'местообитаний.',
                       {'setzt+voraus': 'предполагает'})],
                     [('Wer Pflanzen und Tiere beobachten möchte, sollte Rücksicht nehmen und die Regeln der '
                       'jeweiligen Schutzgebiete beachten.',
                       'Тот, кто хочет наблюдать за растениями и животными, должен проявлять бережное отношение и '
                       'соблюдать правила соответствующих охраняемых территорий.',
                       {'Rücksicht nehmen': 'проявлять бережное отношение'}),
                      ('Erholung in der Natur und ihr langfristiger Schutz gehören deshalb zusammen, auch wenn '
                       'Interessen manchmal miteinander konkurrieren.',
                       'Поэтому отдых на природе и её долгосрочная защита связаны друг с другом, хотя интересы '
                       'иногда конкурируют.',
                       {})]]),
                   ('Landesbildung und Erinnerung',
                    'Создание земли и историческая память',
                    '📜',
                    [[('1920 entstand das Land Thüringen aus mehreren kleinen Staaten, allerdings noch ohne die '
                       'damals preußische Stadt Erfurt.',
                       'В 1920 году земля Тюрингия возникла из нескольких небольших государств, однако ещё без '
                       'тогдашнего прусского Эрфурта.',
                       {}),
                      ('Die heutige Gestalt des Bundeslandes geht auf seine Neugründung im Zusammenhang mit der '
                       'deutschen Wiedervereinigung von 1990 zurück.',
                       'Современный облик федеральной земли восходит к её воссозданию в связи с объединением '
                       'Германии в 1990 году.',
                       {'geht+zurück': 'восходит'})],
                     [('Zur Auseinandersetzung mit der Vergangenheit gehört die Gedenkstätte Buchenwald bei '
                       'Weimar, wo von 1937 bis 1945 ein nationalsozialistisches Konzentrationslager bestand.',
                       'Осмысление прошлого включает мемориал Бухенвальд под Веймаром, где с 1937 по 1945 год '
                       'существовал нацистский концлагерь.',
                       {}),
                      ('Die Beschäftigung mit Verfolgung und Gewalt ist ein wichtiger Bestandteil historischer '
                       'Bildung und demokratischer Verantwortung.',
                       'Изучение преследований и насилия — важная составляющая исторического образования и '
                       'демократической ответственности.',
                       {})]]),
                   ('Verfassung und Mitbestimmung',
                    'Конституция и участие в решениях',
                    '🏛️',
                    [[('Die Bezeichnung Freistaat macht Thüringen ebenso wenig wie Sachsen zu einem Staat '
                       'außerhalb der Bundesrepublik.',
                       'Название Freistaat не делает Тюрингию, как и Саксонию, государством за пределами ФРГ.',
                       {}),
                      ('Der Thüringer Landtag beschloss die Landesverfassung 1993 auf der Wartburg; 1994 wurde '
                       'sie durch einen Volksentscheid bestätigt.',
                       'Тюрингский ландтаг принял конституцию земли в 1993 году в Вартбурге; в 1994 году её '
                       'утвердили референдумом.',
                       {})],
                     [('Die Abgeordneten vertreten die Bevölkerung, beschließen den Landeshaushalt und '
                       'kontrollieren die Landesregierung.',
                       'Депутаты представляют население, принимают бюджет земли и контролируют её правительство.',
                       {}),
                      ('Demokratische Mitbestimmung bedeutet dabei nicht nur Wählen, sondern auch Information, '
                       'Diskussion und die Achtung unterschiedlicher Meinungen.',
                       'При этом демократическое участие означает не только голосование, но и получение '
                       'информации, обсуждение и уважение разных мнений.',
                       {})]]),
                   ('Klassik, Bauhaus und Reformation',
                    'Классика, Баухаус и Реформация',
                    '🎭',
                    [[('Weimar verbindet die Erinnerung an Goethe und Schiller mit dem Bauhaus, das 1919 als '
                       'Schule für moderne Gestaltung gegründet wurde.',
                       'Веймар соединяет память о Гёте и Шиллере с Баухаусом, основанным в 1919 году как школа '
                       'современного дизайна.',
                       {}),
                      ('Die Verbindung von künstlerischer Arbeit, Handwerk und praktischer Nutzung machte die '
                       'Ideen des Bauhauses international einflussreich.',
                       'Связь художественного труда, ремесла и практического использования сделала идеи Баухауса '
                       'влиятельными во всём мире.',
                       {})],
                     [('Auf der Wartburg übersetzte Martin Luther während seines Aufenthalts 1521 und 1522 das '
                       'Neue Testament aus dem Griechischen ins Deutsche.',
                       'Во время пребывания в Вартбурге в 1521 и 1522 годах Мартин Лютер перевёл Новый Завет с '
                       'греческого на немецкий.',
                       {}),
                      ('Dabei handelte es sich nicht um die gesamte Bibel; diese Unterscheidung ist für das '
                       'Verständnis seiner Arbeit wichtig.',
                       'Речь шла не обо всей Библии; это различие важно для понимания его работы.',
                       {'handelte es sich': 'речь шла'})]]),
                   ('Optik als Zukunftsbranche',
                    'Оптика как перспективная отрасль',
                    '🔬',
                    [[('Jena ist ein bedeutender Standort für Optik und Photonik, also für Technologien, die sich '
                       'mit Licht beschäftigen.',
                       'Йена — важный центр оптики и фотоники, то есть технологий, связанных со светом.',
                       {}),
                      ('Die Zusammenarbeit zwischen Hochschulen, Forschungseinrichtungen und Unternehmen '
                       'ermöglicht neue Anwendungen in Medizin und industrieller Produktion.',
                       'Сотрудничество вузов, исследовательских учреждений и предприятий позволяет создавать '
                       'новые применения в медицине и промышленном производстве.',
                       {})],
                     [('Solche Branchen benötigen gut ausgebildete Fachkräfte und Menschen, die bereit sind, sich '
                       'während ihres Berufslebens weiterzubilden.',
                       'Таким отраслям нужны квалифицированные специалисты и люди, готовые повышать квалификацию '
                       'на протяжении трудовой жизни.',
                       {}),
                      ('Das Beispiel Jena zeigt, dass sich ein historisch geprägter Ort und ein moderner '
                       'Technologiestandort nicht ausschließen.',
                       'Пример Йены показывает, что исторический облик города и роль современного '
                       'технологического центра не исключают друг друга.',
                       {})]]),
                   ('Regionale Identität im Alltag',
                    'Региональная идентичность в повседневности',
                    '🌭',
                    [[('Die verschiedenen thüringischen Mundarten zeigen, dass regionale Identität nicht überall '
                       'im Land gleich klingt.',
                       'Разные тюрингские говоры показывают, что региональная идентичность звучит в земле не '
                       'везде одинаково.',
                       {}),
                      ('Dialekte werden in Familien und lokalen Gemeinschaften weitergegeben und verändern sich '
                       'im Kontakt mit anderen Sprechweisen.',
                       'Диалекты передаются в семьях и местных сообществах и меняются при контакте с другими '
                       'способами речи.',
                       {})],
                     [('Auch Speisen wie Rostbratwurst und Kartoffelklöße sind Teil regionaler Tradition, wobei '
                       'Rezepte je nach Ort oder Familie variieren.',
                       'Такие блюда, как жареные колбаски и картофельные клёцки, тоже относятся к региональной '
                       'традиции, причём рецепты различаются по месту или семье.',
                       {}),
                      ('Die Bezeichnung Thüringer Rostbratwurst ist als geografische Angabe geschützt und '
                       'verbindet ein Lebensmittel mit seiner Herkunft.',
                       'Название Thüringer Rostbratwurst защищено как географическое указание и связывает продукт '
                       'с его происхождением.',
                       {})]])]}
