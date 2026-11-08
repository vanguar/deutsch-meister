"""baden-wuerttemberg: тексты B1/B2. Сверено 2026-11-08.
https://www.baden-wuerttemberg.de/de/unser-land/geschichte/entstehung-des-suedweststaats
https://www.baden-wuerttemberg.de/de/unser-land/land-und-leute/geografie/
https://wm.baden-wuerttemberg.de/de/wirtschaft/wirtschaftsstandort-bw/wirtschaftsstruktur
https://www.stuttgart.de/tourismus/sehenswuerdigkeiten/mercedes-benz-museum
https://whc.unesco.org/en/list/1527/
"""

TEXTS = {
    "baden-wuerttemberg-b1": [
    ("Im Südwesten", "На юго-западе", "🗺️", [
        [("Baden-Württemberg liegt im Südwesten Deutschlands.",
          "Баден-Вюртемберг расположен на юго-западе Германии.", {}),
         ("Im Westen liegt der Schwarzwald.",
          "На западе находится Шварцвальд.", {}),
         ("Im Süden liegt der Bodensee.",
          "На юге находится Боденское озеро.", {})],
    ]),
    ("Drei Länder werden eins", "Три земли объединяются", "📜", [
        [("Nach dem Zweiten Weltkrieg gab es im Südwesten mehrere Länder.",
          "После Второй мировой войны на юго-западе существовало несколько земель.", {}),
         ("Baden, Württemberg-Baden und Württemberg-Hohenzollern schlossen sich 1952 zusammen.",
          "Баден, Вюртемберг-Баден и Вюртемберг-Гогенцоллерн объединились в 1952 году.", {"schlossen+zusammen":"объединились"}),
         ("So entstand das neue Bundesland Baden-Württemberg.",
          "Так возникла новая федеральная земля Баден-Вюртемберг.", {})],
    ]),
    ("Stuttgart und das Auto", "Штутгарт и автомобиль", "🚗", [
        [("Stuttgart ist die Hauptstadt des Landes.",
          "Штутгарт — столица земли.", {}),
         ("Der Automobilbau ist für die Wirtschaft des Landes wichtig.",
          "Автомобилестроение важно для экономики земли.", {}),
         ("In Stuttgart kann man im Mercedes-Benz Museum etwas über die Geschichte des Autos lernen.",
          "В штутгартском музее Mercedes-Benz можно узнать об истории автомобиля.", {})],
    ]),
    ("Kunst aus der Eiszeit", "Искусство ледникового периода", "🪈", [
        [("Auf der Schwäbischen Alb gibt es Höhlen mit sehr alten Funden.",
          "На Швабском Альбе есть пещеры с очень древними находками.", {}),
         ("Dort fand man Figuren und Flöten aus der Eiszeit.",
          "Там нашли фигурки и флейты ледникового периода.", {}),
         ("Die Höhlen und die Kunstwerke gehören zum UNESCO-Welterbe.",
          "Пещеры и произведения искусства входят в список всемирного наследия UNESCO.", {})],
    ]),
    ],
    "baden-wuerttemberg-b2": [
    ("Landschaften zwischen Rhein und Bodensee", "Ландшафты между Рейном и Боденским озером", "🧭", [
        [("Im Westen prägt der Schwarzwald weite Teile des Landes, während im Süden der Bodensee die Landschaft bestimmt.",
          "На западе обширные районы земли занимает Шварцвальд, а на юге облик местности определяет Боденское озеро.", {}),
         ("Zwischen dem Schwarzwald und der östlichen Landesgrenze liegt die Schwäbische Alb.",
          "Между Шварцвальдом и восточной границей земли лежит Швабский Альб.", {}),
         ("Der Rhein bildet im Westen über weite Strecken die Grenze zu Frankreich.",
          "На западе Рейн на значительном протяжении образует границу с Францией.", {})],
    ]),
    ("Die Abstimmung von 1951", "Голосование 1951 года", "🗳️", [
        [("1951 stimmte die Bevölkerung über die Bildung eines gemeinsamen Landes ab.",
          "В 1951 году жители голосовали по вопросу образования единой земли.", {}),
         ("In drei der vier Abstimmungsbezirke sprach sich die Mehrheit für die Vereinigung aus.",
          "В трёх из четырёх округов большинство высказалось за объединение.", {"sprach+aus":"высказалось"}),
         ("Obwohl die Mehrheit in Südbaden dagegen stimmte, wurde das neue Land im April 1952 gegründet.",
          "Хотя большинство в Южном Бадене проголосовало против, в апреле 1952 года новую землю основали.", {})],
    ]),
    ("Fahrzeuge und Maschinen", "Автомобили и машины", "🛠️", [
        [("Neben dem Fahrzeugbau gehört der Maschinenbau zu den prägenden Branchen des Landes.",
          "Наряду с производством автомобилей машиностроение относится к ключевым отраслям земли.", {}),
         ("Große Hersteller und spezialisierte Zulieferer arbeiten in diesen Branchen zusammen.",
          "В этих отраслях сотрудничают крупные производители и специализированные поставщики.", {}),
         ("Das Museum in Stuttgart zeigt, wie sich das Auto im Laufe der Zeit verändert hat.",
          "Музей в Штутгарте показывает, как автомобиль менялся со временем.", {})],
    ]),
    ("Was die Höhlen bewahren", "Что сохранили пещеры", "🦴", [
        [("In sechs Höhlen der Schwäbischen Alb wurden Spuren früher Kunst und Musik entdeckt.",
          "В шести пещерах Швабского Альба обнаружили свидетельства раннего искусства и музыки.", {}),
         ("Zu den Funden gehören Tierfiguren und Flöten, die aus Knochen oder Elfenbein gefertigt wurden.",
          "Среди находок — фигурки животных и флейты, изготовленные из кости или бивня.", {}),
         ("Die Fundorte wurden 2017 in die Welterbeliste aufgenommen.",
          "Места находок внесли в список всемирного наследия в 2017 году.", {})],
    ]),
    ],
}
