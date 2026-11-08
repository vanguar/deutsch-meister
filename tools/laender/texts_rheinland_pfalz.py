"""rheinland-pfalz: тексты B1/B2. Сверено 2026-11-08.
https://lav.rlp.de/geschichte-entdecken/landesgeschichte/land-rheinland-pfalz
https://lav.rlp.de/geschichte-entdecken/praesentationen/75-jahre-rheinland-pfalz
https://www.koblenz.de/strukturierte-daten/veranstaltungsorte/deutsches-eck/
https://www.visitmosel.de/article/factsheet-mosel
https://whc.unesco.org/en/list/1066/
https://whc.unesco.org/en/list/168/
"""

TEXTS = {
    "rheinland-pfalz-b1": [
    ("Mainz und Koblenz", "Майнц и Кобленц", "🏛️", [
        [("Mainz ist die Hauptstadt von Rheinland-Pfalz.",
          "Майнц — столица Рейнланд-Пфальца.", {}),
         ("Die Stadt liegt am Rhein.",
          "Город находится на Рейне.", {}),
         ("Weiter nördlich liegt Koblenz, wo die Mosel in den Rhein mündet.",
          "Севернее лежит Кобленц, где Мозель впадает в Рейн.", {"mündet":"впадает"}),
         ("Diesen Ort nennt man das Deutsche Eck.",
          "Это место называют Немецким углом.", {})],
    ]),
    ("Ein Land seit 1946", "Земля с 1946 года", "📜", [
        [("Rheinland-Pfalz entstand 1946 in der französischen Besatzungszone.",
          "Рейнланд-Пфальц появился в 1946 году во французской зоне оккупации.", {}),
         ("Nach dem Krieg war Mainz stark zerstört.",
          "После войны Майнц был сильно разрушен.", {}),
         ("Deshalb arbeiteten die Landesregierung und der Landtag zuerst in Koblenz.",
          "Поэтому правительство и ландтаг сначала работали в Кобленце.", {})],
    ]),
    ("Wein an der Mosel", "Вино на Мозеле", "🍇", [
        [("An der Mosel gibt es viele Weinberge.",
          "Вдоль Мозеля много виноградников.", {}),
         ("Einige Weinberge liegen an steilen Hängen.",
          "Некоторые виноградники находятся на крутых склонах.", {}),
         ("Eine bekannte Rebsorte der Region ist der Riesling.",
          "Известный сорт винограда этого региона — рислинг.", {})],
    ]),
    ("Burgen und ein Dom", "Замки и собор", "🏰", [
        [("Am Mittelrhein stehen viele Burgen über dem Fluss.",
          "На Среднем Рейне над рекой стоит много замков.", {}),
         ("In Speyer steht ein großer romanischer Dom.",
          "В Шпайере стоит большой романский собор.", {}),
         ("Der Dom und das Obere Mittelrheintal gehören zum UNESCO-Welterbe.",
          "Собор и долина Верхнего Среднего Рейна входят в список всемирного наследия UNESCO.", {})],
    ]),
    ],
    "rheinland-pfalz-b2": [
    ("Warum Koblenz zuerst wichtig war", "Почему сначала важную роль играл Кобленц", "📜", [
        [("Als das Land 1946 gegründet wurde, war Mainz bereits als Hauptstadt vorgesehen.",
          "При основании земли в 1946 году столицей уже назначили Майнц.", {}),
         ("Weil Mainz im Krieg stark beschädigt worden war, diente Koblenz vorübergehend als Regierungssitz.",
          "Поскольку Майнц сильно пострадал в войну, Кобленц временно стал местом работы правительства.", {}),
         ("1951 zogen Regierung und Landtag nach Mainz um.",
          "В 1951 году правительство и ландтаг переехали в Майнц.", {"zogen+um":"переехали"})],
    ]),
    ("Eine Landschaft am Fluss", "Ландшафт вдоль реки", "🏞️", [
        [("Das Obere Mittelrheintal erstreckt sich von Bingen und Rüdesheim bis nach Koblenz.",
          "Долина Верхнего Среднего Рейна тянется от Бингена и Рюдесхайма до Кобленца.", {}),
         ("Die Burgen an den Hängen erinnern an die Bedeutung des Rheins als Verkehrsweg.",
          "Замки на склонах напоминают о значении Рейна как транспортного пути.", {}),
         ("Die UNESCO nahm das Tal 2002 in die Welterbeliste auf.",
          "В 2002 году UNESCO включила долину в список всемирного наследия.", {"nahm+auf":"включила"})],
    ]),
    ("Weinbau am Hang", "Виноградарство на склонах", "🍇", [
        [("An der Mosel werden Reben auch auf sehr steilen Flächen angebaut.",
          "В долине Мозеля виноград выращивают в том числе на очень крутых участках.", {}),
         ("Solche Lagen prägen das Landschaftsbild, erschweren aber die Arbeit im Weinberg.",
          "Такие участки определяют облик местности, но усложняют работу на виноградниках.", {}),
         ("Für viele Weine aus der Region wird Riesling verwendet.",
          "Многие вина региона делают из рислинга.", {})],
    ]),
    ("Romanische Baukunst in Speyer", "Романская архитектура в Шпайере", "⛪", [
        [("Der Dom zu Speyer gehört zu den bedeutenden Bauten der Romanik.",
          "Шпайерский собор — один из значительных памятников романской архитектуры.", {}),
         ("Seine Geschichte reicht bis ins 11. Jahrhundert zurück.",
          "Его история восходит к XI веку.", {"reicht+zurück":"восходит"}),
         ("Im Dom wurden mehrere Herrscher des Heiligen Römischen Reiches bestattet.",
          "В соборе похоронено несколько правителей Священной Римской империи.", {})],
    ]),
    ],
}
