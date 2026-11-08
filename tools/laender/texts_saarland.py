"""saarland: тексты B1/B2. Сверено 2026-11-08.
https://www.saarland.de/stk/DE/service/publikationen/_documents/Die_Geschichte_des_Saarlandes.pdf?__blob=publicationFile&v=13
https://whc.unesco.org/en/list/687/
https://voelklinger-huette.org/weltkulturerbe/geschichte/
https://tourismus.saarbruecken.de/besuchen/weitere_ausflugstipps/saarschleife
https://www.saarland.de/SharedDocs/Downloads/DE/stk/europa/dld_frankreichstrategie-de-2025.pdf?__blob=publicationFile&v=4
"""

TEXTS = {
    "saarland-b1": [
    ("Im Südwesten Deutschlands", "На юго-западе Германии", "🗺️", [
        [("Das Saarland liegt im Südwesten Deutschlands.",
          "Саар расположен на юго-западе Германии.", {}),
         ("Es grenzt an Frankreich und Luxemburg.",
          "Он граничит с Францией и Люксембургом.", {}),
         ("Die Hauptstadt Saarbrücken liegt an der Saar.",
          "Столица Саарбрюккен стоит на реке Саар.", {})],
    ]),
    ("Ein Teil der Bundesrepublik", "В составе ФРГ", "📜", [
        [("Nach dem Zweiten Weltkrieg hatte das Saarland enge Beziehungen zu Frankreich.",
          "После Второй мировой войны у Саара были тесные связи с Францией.", {}),
         ("1955 gab es eine Abstimmung über die Zukunft des Saarlandes.",
          "В 1955 году прошло голосование о будущем Саара.", {}),
         ("Seit 1957 gehört das Saarland zur Bundesrepublik Deutschland.",
          "С 1957 года Саар входит в состав Федеративной Республики Германия.", {})],
    ]),
    ("Die Völklinger Hütte", "Фёльклингенский завод", "🏭", [
        [("In Völklingen steht ein altes Eisenwerk.",
          "В Фёльклингене находится старый металлургический завод.", {}),
         ("Dort stellte man in Hochöfen Roheisen her.",
          "Там в доменных печах выплавляли чугун.", {"stellte+her":"производили"}),
         ("Heute gehört das Werk zum UNESCO-Welterbe.",
          "Сегодня завод входит в список всемирного наследия UNESCO.", {})],
    ]),
    ("Eine Schleife im Fluss", "Петля реки", "🌳", [
        [("Bei Mettlach macht die Saar einen großen Bogen.",
          "У Метлаха Саар делает большой изгиб.", {}),
         ("Diese Stelle heißt Saarschleife.",
          "Это место называют петлёй Саара.", {}),
         ("Von einem Aussichtspunkt kann man den Bogen gut sehen.",
          "Со смотровой площадки изгиб хорошо виден.", {})],
    ]),
    ],
    "saarland-b2": [
    ("Vom Saarstatut zum Beitritt", "От Саарского статута к присоединению", "🗳️", [
        [("1955 lehnte die Mehrheit der Abstimmenden das vorgeschlagene Saarstatut ab.",
          "В 1955 году большинство участников голосования отвергло предложенный Саарский статут.", {"lehnte+ab":"отвергло"}),
         ("Daraufhin verhandelten Frankreich und die Bundesrepublik über die Zukunft des Saarlandes.",
          "После этого Франция и ФРГ провели переговоры о будущем Саара.", {}),
         ("Am 1. Januar 1957 wurde das Saarland ein Bundesland der Bundesrepublik.",
          "1 января 1957 года Саар стал федеральной землёй ФРГ.", {})],
    ]),
    ("Vom Erz zum Roheisen", "От руды к чугуну", "🔥", [
        [("Die Hochöfen der Völklinger Hütte dienten dazu, Roheisen aus Erz zu gewinnen.",
          "Доменные печи Фёльклингенского завода служили для выплавки чугуна из руды.", {}),
         ("Nachdem die Produktion 1986 eingestellt worden war, blieben wichtige Teile der Anlage erhalten.",
          "После остановки производства в 1986 году основные сооружения комплекса сохранили.", {}),
         ("1994 nahm die UNESCO die Völklinger Hütte in die Welterbeliste auf.",
          "В 1994 году UNESCO внесла Фёльклингенский завод в список всемирного наследия.", {})],
    ]),
    ("Die Saar in der Landschaft", "Саар в ландшафте", "🌊", [
        [("Bei Mettlach windet sich die Saar in einer weiten Schleife durch die bewaldete Landschaft.",
          "У Метлаха Саар извивается широкой петлёй среди лесов.", {}),
         ("Wer zur Cloef geht, kann die Form der Schleife von oben erkennen.",
          "Со смотровой площадки Клёф форму петли видно сверху.", {}),
         ("Der Aussichtspunkt liegt bei Orscholz, einem Ortsteil von Mettlach.",
          "Смотровая площадка находится у Оршольца, части общины Метлах.", {})],
    ]),
    ("Zusammenarbeit über die Grenze", "Сотрудничество через границу", "🤝", [
        [("Die Nähe zu Frankreich spielt für das Saarland auch nach dem Beitritt eine wichtige Rolle.",
          "Близость к Франции играет для Саара важную роль и после присоединения к ФРГ.", {}),
         ("Die Landesregierung fördert die Zusammenarbeit mit Frankreich und das Lernen der französischen Sprache.",
          "Правительство земли поддерживает сотрудничество с Францией и изучение французского языка.", {}),
         ("Wer die Sprache des Nachbarlandes versteht, kann sich im Alltag leichter über die Grenze hinweg verständigen.",
          "Тому, кто понимает язык соседней страны, проще общаться в повседневной жизни по обе стороны границы.", {})],
    ]),
    ],
}
