"""nordrhein-westfalen: тексты B1/B2. Сверено 2026-11-08.
https://www.landtag.nrw.de/home/der-landtag/geschichte-des-landtags/zur-geschichte-des-landes-nrw/zeitleiste-zur-landesgeschich-1.html
https://www.landtag.nrw.de/portal/WWW/dokumentenarchiv/Dokument/MMD17-7904.pdf
https://whc.unesco.org/en/list/975
https://whc.unesco.org/en/list/292/
"""

TEXTS = {
    "nordrhein-westfalen-b1": [
    ("Städte am Rhein", "Города на Рейне", "🗺️", [
        [("Nordrhein-Westfalen liegt im Westen Deutschlands.",
          "Северный Рейн — Вестфалия находится на западе Германии.", {}),
         ("Der Rhein fließt durch Köln und Düsseldorf.",
          "Рейн протекает через Кёльн и Дюссельдорф.", {}),
         ("Düsseldorf ist die Hauptstadt des Landes.",
          "Дюссельдорф — столица земли.", {})],
    ]),
    ("Die Gründung des Landes", "Образование земли", "📜", [
        [("Das Land entstand 1946 nach dem Zweiten Weltkrieg.",
          "Земля появилась в 1946 году после Второй мировой войны.", {}),
         ("Die britische Besatzungsmacht vereinte den Norden der Rheinprovinz mit Westfalen.",
          "Британская оккупационная администрация объединила север Рейнской провинции с Вестфалией.", {}),
         ("Ein Jahr später kam Lippe dazu.",
          "Годом позже присоединилась Липпе.", {"kam+dazu":"присоединилась"})],
    ]),
    ("Das Ruhrgebiet", "Рурская область", "⛏️", [
        [("Essen liegt im Ruhrgebiet.",
          "Эссен находится в Рурской области.", {}),
         ("Dort wurde lange Kohle gefördert.",
          "Там долгое время добывали уголь.", {}),
         ("Die Zeche Zollverein ist heute Teil des UNESCO-Welterbes.",
          "Шахта Цольферайн сегодня входит в список всемирного наследия UNESCO.", {})],
    ]),
    ("Der Kölner Dom", "Кёльнский собор", "⛪", [
        [("Der Kölner Dom ist eine gotische Kirche.",
          "Кёльнский собор — готический храм.", {}),
         ("Der Bau begann 1248 und dauerte mit langen Pausen bis 1880.",
          "Строительство началось в 1248 году и с долгими перерывами продолжалось до 1880 года.", {}),
         ("Auch dieser Dom gehört zum UNESCO-Welterbe.",
          "Этот собор тоже входит в список всемирного наследия UNESCO.", {})],
    ]),
    ],
    "nordrhein-westfalen-b2": [
    ("Von der Besatzungszone zum Land", "От зоны оккупации к федеральной земле", "🏛️", [
        [("Nordrhein-Westfalen entstand, als die britische Militärregierung die Grenzen in ihrer Besatzungszone neu ordnete.",
          "Северный Рейн — Вестфалия возникла, когда британская военная администрация перекроила границы в своей зоне оккупации.", {}),
         ("Im August 1946 wurden der nördliche Teil der Rheinprovinz und Westfalen zu einem Land zusammengefasst.",
          "В августе 1946 года северную часть Рейнской провинции и Вестфалию объединили в одну землю.", {}),
         ("Lippe wurde erst im Januar 1947 Teil des neuen Landes.",
          "Липпе вошла в состав новой земли только в январе 1947 года.", {})],
    ]),
    ("Ein Parlament in Düsseldorf", "Парламент в Дюссельдорфе", "🗳️", [
        [("Im Oktober 1946 tagte der Landtag zum ersten Mal im Düsseldorfer Opernhaus.",
          "В октябре 1946 года ландтаг впервые собрался в Дюссельдорфском оперном театре.", {}),
         ("Seine Mitglieder waren zunächst von der britischen Besatzungsmacht ernannt worden.",
          "Поначалу его членов назначала британская оккупационная администрация.", {}),
         ("Erst 1947 konnten die Bürgerinnen und Bürger ihre Abgeordneten selbst wählen.",
          "Только в 1947 году жители получили возможность сами избрать своих депутатов.", {})],
    ]),
    ("Industrie als Kulturerbe", "Промышленность как культурное наследие", "🏭", [
        [("Der Komplex Zollverein zeigt, wie Kohle gefördert, verarbeitet und transportiert wurde.",
          "Комплекс Цольферайн показывает, как добывали, перерабатывали и перевозили уголь.", {}),
         ("Zur Anlage gehörten eine Kokerei und mehrere Bahnstrecken.",
          "В состав комплекса входили коксовый завод и несколько железнодорожных линий.", {}),
         ("Seit 2001 steht der Komplex auf der Welterbeliste.",
          "С 2001 года комплекс входит в список всемирного наследия.", {})],
    ]),
    ("Ein Bau über Jahrhunderte", "Строительство длиной в века", "🧱", [
        [("Der Bau des Kölner Doms wurde im Mittelalter begonnen und erst im 19. Jahrhundert vollendet.",
          "Кёльнский собор начали строить в Средние века и завершили лишь в XIX веке.", {}),
         ("Obwohl zwischen Beginn und Vollendung viele Jahrhunderte lagen, wurde der gotische Charakter des Baus bewahrt.",
          "Хотя между началом и завершением работ прошли века, готический характер здания сохранился.", {}),
         ("So erzählt der Dom von mittelalterlicher Baukunst ebenso wie von späteren Jahrhunderten.",
          "Так собор рассказывает и о средневековом зодчестве, и о более поздних эпохах.", {})],
    ]),
    ],
}
