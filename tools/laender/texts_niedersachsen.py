"""niedersachsen: тексты B1/B2. Сверено 2026-11-08.
https://www.niedersachsen.de/startseite/land_leute/die_geschichte/geschichte_des_landes_niedersachsen/themen_ereignisse/-19880.html
https://www.nls.niedersachsen.de/tabellen/allgemeines/vorstellung.html
https://www.nationalpark-wattenmeer.de/wissensbeitrag/voegel/
https://www.nationalpark-wattenmeer.de/besuchen/natur-erleben-auf-eigene-faust/
https://herrenhaeuser-gaerten.hannover.de/Herrenhausen-erleben/Gro%C3%9Fer-Garten/Geschichte
https://www.volkswagen-newsroom.com/de/werk-wolfsburg-das-herz-der-marke-vw-6811
"""

TEXTS = {
    "niedersachsen-b1": [
    ("Von der Küste bis zum Harz", "От побережья до Гарца", "🗺️", [
        [("Niedersachsen liegt im Nordwesten Deutschlands.",
          "Нижняя Саксония находится на северо-западе Германии.", {"im Nordwesten":"на северо-западе"}),
         ("Im Norden liegt die Nordsee.",
          "На севере находится Северное море.", {}),
         ("Im Süden reicht das Land bis in den Harz.",
          "На юге территория земли доходит до Гарца.", {})],
        [("Zwischen der Küste und den Bergen liegt die Lüneburger Heide.",
          "Между побережьем и горами лежит Люнебургская пустошь.", {}),
         ("Die Landschaft sieht also je nach Region ganz anders aus.",
          "Таким образом, в разных частях земли пейзаж выглядит совсем по-разному.", {"je nach":"в зависимости от"})],
    ]),
    ("Ebbe und Flut", "Отлив и прилив", "🌊", [
        [("Bei Ebbe zieht sich das Wasser zurück.",
          "Во время отлива вода отступает.", {"zieht+zurück":"отступает"}),
         ("Dann kann man den Boden sehen, der bei Flut unter Wasser liegt.",
          "Тогда виден грунт, который во время прилива находится под водой.", {})],
        [("Viele Zugvögel finden dort Nahrung.",
          "Многие перелётные птицы находят там корм.", {}),
         ("Deshalb ist das Wattenmeer für diese Vögel besonders wichtig.",
          "Поэтому Ваттовое море особенно важно для этих птиц.", {})],
    ]),
    ("Wie das Land entstand", "Как появилась земля", "🏛️", [
        [("Nach dem Zweiten Weltkrieg gehörte die Region zur britischen Besatzungszone.",
          "После Второй мировой войны регион входил в британскую зону оккупации.", {}),
         ("Aus Hannover, Oldenburg, Braunschweig und Schaumburg-Lippe entstand 1946 das neue Bundesland Niedersachsen.",
          "В 1946 году из Ганновера, Ольденбурга, Брауншвейга и Шаумбург-Липпе образовали новую федеральную землю Нижняя Саксония.", {})],
        [("Die Stadt Hannover wurde Landeshauptstadt.",
          "Город Ганновер стал столицей земли.", {}),
         ("Dort kam auch der erste Landtag zusammen.",
          "Там же собрался первый ландтаг.", {"kam+zusammen":"собрался"})],
    ]),
    ("Hannover und Wolfsburg", "Ганновер и Вольфсбург", "🏭", [
        [("In Hannover kann man die Herrenhäuser Gärten besuchen.",
          "В Ганновере можно посетить сады Херренхаузен.", {}),
         ("Der Große Garten ist ein Beispiel für die Gartenkunst des Barock.",
          "Большой сад — пример садового искусства барокко.", {})],
        [("In Wolfsburg steht ein großes Werk von Volkswagen.",
          "В Вольфсбурге находится крупный завод Volkswagen.", {}),
         ("Das Werk liegt am Mittellandkanal.",
          "Завод расположен на Среднегерманском канале.", {})],
    ]),
    ],
    "niedersachsen-b2": [
    ("Landschaften und Landwirtschaft", "Ландшафты и сельское хозяйство", "🗺️", [
        [("Wer von der Nordseeküste nach Süden fährt, kommt durch ganz unterschiedliche Landschaften.",
          "По дороге с побережья Северного моря на юг проезжаешь через совершенно разные ландшафты.", {}),
         ("Während im Norden Inseln und flache Küsten das Bild bestimmen, beginnt im Süden das Bergland.",
          "На севере пейзаж определяют острова и низкие берега, а на юге начинается гористая местность.", {})],
        [("Ein großer Teil der Fläche wird landwirtschaftlich genutzt.",
          "Значительная часть территории используется для сельского хозяйства.", {"landwirtschaftlich genutzt":"используется для сельского хозяйства"})],
    ]),
    ("Ein Rastplatz für Zugvögel", "Место отдыха перелётных птиц", "🐦", [
        [("Das Wattenmeer verändert sich im Rhythmus der Gezeiten, da große Flächen abwechselnd trockenfallen und überflutet werden.",
          "Ваттовое море меняется в ритме приливов и отливов: большие участки поочерёдно осушаются и снова уходят под воду.", {}),
         ("Bei Niedrigwasser suchen Zugvögel im Watt nach Nahrung, bevor sie ihren Flug fortsetzen.",
          "При низкой воде перелётные птицы ищут корм на отмелях, прежде чем продолжить перелёт.", {"ihren Flug fortsetzen":"продолжают перелёт"})],
        [("Der Nationalpark schützt diesen Lebensraum und bietet zugleich Möglichkeiten, die Natur auf ausgewiesenen Wegen zu erleben.",
          "Национальный парк охраняет эту среду обитания и даёт возможность знакомиться с природой на обозначенных маршрутах.", {})],
    ]),
    ("Vier Länder werden eins", "Четыре земли объединяются", "📜", [
        [("Die britische Militärregierung ordnete ihre Besatzungszone nach dem Krieg neu.",
          "После войны британская военная администрация реорганизовала свою зону оккупации.", {"ordnete+neu":"реорганизовала"}),
         ("Aus vier Ländern wurde am 1. November 1946 Niedersachsen gebildet.",
          "1 ноября 1946 года из четырёх земель образовали Нижнюю Саксонию.", {})],
        [("Die Mitglieder des ersten Landtags waren von der Besatzungsregierung ernannt worden.",
          "Членов первого ландтага назначила оккупационная администрация.", {}),
         ("Erst im April 1947 wurde ein Landtag frei gewählt.",
          "Первые свободные выборы в ландтаг прошли только в апреле 1947 года.", {})],
    ]),
    ("Barockgarten und Industriestandort", "Барочный сад и промышленный центр", "🏭", [
        [("Der Große Garten in Herrenhausen behielt seine barocke Form, obwohl viele andere Gärten später nach einem anderen Stil gestaltet wurden.",
          "Большой сад в Херренхаузене сохранил барочную форму, хотя многие другие сады позднее перепланировали в другом стиле.", {}),
         ("Die Geschichte des Gartens zeigt, wie sich der Geschmack der Zeit an Parks und Gärten ablesen lässt.",
          "История сада показывает, как по паркам и садам можно судить о вкусах эпохи.", {"ablesen lässt":"можно судить"})],
        [("Wolfsburg steht dagegen vor allem für den Automobilbau, der das wirtschaftliche Profil der Stadt prägt.",
          "Вольфсбург же известен прежде всего автомобилестроением, которое определяет экономический профиль города.", {}),
         ("Das Volkswagen-Werk am Mittellandkanal ist der Stammsitz der Marke Volkswagen Pkw.",
          "Завод Volkswagen на Среднегерманском канале — главная площадка марки легковых автомобилей Volkswagen.", {})],
    ]),
    ],
}
