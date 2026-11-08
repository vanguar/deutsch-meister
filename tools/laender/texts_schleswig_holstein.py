"""schleswig-holstein: тексты B1/B2. Сверено 2026-11-08.
https://www.schleswig-holstein.de/DE/landesregierung/themen/kultur/landesgeschichte
https://www.schleswig-holstein.de/DE/landesregierung/themen/kueste-wasser-meer
https://www.schleswig-holstein.de/DE/landesregierung/themen/verkehr-infrastruktur/nord-ostsee-kanal
https://www.schleswig-holstein.de/DE/fachinhalte/M/minderheiten/minderheiten_geschichte?nn=123bc88f-f546-4734-833f-9bccc8ae0280
https://whc.unesco.org/en/list/272/
"""

TEXTS = {
    "schleswig-holstein-b1": [
    ("Zwischen zwei Meeren", "Между двумя морями", "🌊", [
        [("Schleswig-Holstein liegt ganz im Norden Deutschlands.",
          "Шлезвиг-Гольштейн находится на самом севере Германии.", {}),
         ("Im Westen liegt die Nordsee, im Osten die Ostsee.",
          "На западе находится Северное море, на востоке — Балтийское.", {}),
         ("Im Norden grenzt das Land an Dänemark.",
          "На севере земля граничит с Данией.", {"grenzt+an":"граничит с"})],
    ]),
    ("Kiel und der Kanal", "Киль и канал", "⚓", [
        [("Kiel ist die Hauptstadt und liegt an der Ostsee.",
          "Киль — столица земли на Балтийском море.", {}),
         ("Von Kiel bis Brunsbüttel führt der Nord-Ostsee-Kanal.",
          "От Киля до Брунсбюттеля проходит Кильский канал.", {}),
         ("Durch den Kanal ist der Weg von einem Meer zum anderen kürzer.",
          "Благодаря каналу путь из одного моря в другое короче.", {})],
    ]),
    ("Lübeck und die Hanse", "Любек и Ганза", "🏰", [
        [("Lübeck war ein wichtiges Zentrum der Hanse.",
          "Любек был важным центром Ганзы.", {}),
         ("Die Hanse verband Städte durch den Handel.",
          "Ганза связывала города торговлей.", {}),
         ("Die Altstadt von Lübeck gehört zum UNESCO-Welterbe.",
          "Старый город Любека входит в список всемирного наследия UNESCO.", {})],
    ]),
    ("Sprachen an der Grenze", "Языки у границы", "🗣️", [
        [("In Schleswig-Holstein lebt eine dänische Minderheit.",
          "В Шлезвиг-Гольштейне живёт датское меньшинство.", {}),
         ("Auch Nordfriesisch wird im Land gesprochen.",
          "В земле также говорят на севернофризском языке.", {}),
         ("Dänisch und Nordfriesisch werden als Minderheitensprachen geschützt.",
          "Датский и севернофризский охраняются как языки меньшинств.", {})],
    ]),
    ],
    "schleswig-holstein-b2": [
    ("Eine Lage, zwei Küsten", "Одна земля, два побережья", "🧭", [
        [("Schleswig-Holstein ist das einzige deutsche Bundesland, das sowohl an der Nordsee als auch an der Ostsee liegt.",
          "Шлезвиг-Гольштейн — единственная немецкая земля, которая выходит и к Северному, и к Балтийскому морю.", {"sowohl+als auch":"как …, так и …"}),
         ("Während an der Westküste das Wattenmeer die Landschaft prägt, öffnet sich die Ostküste zur Ostsee.",
          "На западе ландшафт определяет Ваттовое море, а восточное побережье выходит к Балтийскому морю.", {}),
         ("Die Lage zwischen den Meeren prägt die Häfen und den Schiffsverkehr des Landes.",
          "Положение между морями определяет развитие портов и судоходства земли.", {})],
    ]),
    ("Eine Abkürzung für Schiffe", "Короткий путь для судов", "🚢", [
        [("Wer den Nord-Ostsee-Kanal nutzt, muss nicht um die Halbinsel Jütland fahren.",
          "Судам, которые идут по Кильскому каналу, не нужно огибать полуостров Ютландия.", {}),
         ("Bei Brunsbüttel erreicht der Kanal die Elbe, die weiter in die Nordsee fließt.",
          "У Брунсбюттеля канал выходит в Эльбу, которая далее впадает в Северное море.", {}),
         ("Auf der anderen Seite mündet er bei Kiel in die Ostsee.",
          "На другом конце он выходит в Балтийское море у Киля.", {"mündet+in":"выходит в"})],
    ]),
    ("Handel und Stadtbild", "Торговля и облик города", "🧱", [
        [("Lübeck wurde zu einem bedeutenden Handelszentrum, von dem aus die Hanse ihre Geschäfte organisierte.",
          "Любек стал крупным торговым центром, откуда Ганза управляла своими делами.", {}),
         ("Die historische Altstadt und das Holstentor erinnern an diese Zeit.",
          "Исторический центр и ворота Хольстентор напоминают о той эпохе.", {}),
         ("Seit 1987 gehört die Altstadt zum Weltkulturerbe.",
          "С 1987 года старый город входит в список всемирного культурного наследия.", {})],
    ]),
    ("Minderheiten im Grenzland", "Меньшинства в приграничье", "🤝", [
        [("Die Bonn-Kopenhagener Erklärungen von 1955 verbesserten die Lage der Minderheiten auf beiden Seiten der deutsch-dänischen Grenze.",
          "Боннско-Копенгагенские декларации 1955 года улучшили положение меньшинств по обе стороны немецко-датской границы.", {}),
         ("Jeder Mensch darf selbst entscheiden, ob er sich zu einer nationalen Minderheit bekennt.",
          "Каждый человек вправе сам решать, относит ли он себя к национальному меньшинству.", {}),
         ("Der Schutz von Minderheiten ist heute in der Landesverfassung verankert.",
          "Сегодня защита меньшинств закреплена в конституции земли.", {"ist+verankert":"закреплена"})],
    ]),
    ],
}
