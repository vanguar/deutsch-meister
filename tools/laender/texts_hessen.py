"""hessen: тексты B1/B2. Сверено 2026-11-08.
https://hbc.hessen.de/Wissen/Geschichte-des-Landes/Aufbauzeit-nach-dem-zweiten-Weltkrieg
https://hessen.de/regierung/politisches-system/das-hessische-grundgesetz
https://gutregiert.hessen.de/handeln/mpk/das-land-im-herzen-europas
https://www.ecb.europa.eu/ecb/contacts/address/html/index.de.html
https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/five_things.em.html
https://wissenschaft.hessen.de/kultur-erleben/unesco-welterbe/bergpark-wilhelmshoehe
https://whc.unesco.org/en/list/720/
"""

TEXTS = {
    "hessen-b1": [
    ("Wiesbaden und der Rhein", "Висбаден и Рейн", "🗺️", [
        [("Hessen liegt in der Mitte Deutschlands.",
          "Гессен расположен в центральной части Германии.", {}),
         ("Die Landeshauptstadt Wiesbaden liegt am Rhein.",
          "Столица земли Висбаден находится на Рейне.", {}),
         ("Auf der anderen Seite des Flusses liegt Mainz, die Hauptstadt von Rheinland-Pfalz.",
          "На другом берегу реки находится Майнц, столица Рейнланд-Пфальца.", {})],
    ]),
    ("Frankfurt am Main", "Франкфурт-на-Майне", "🏦", [
        [("Der Main fließt durch Frankfurt.",
          "Майн протекает через Франкфурт.", {}),
         ("Die Stadt ist ein wichtiges Finanzzentrum.",
          "Город является крупным финансовым центром.", {}),
         ("Hier hat die Europäische Zentralbank ihren Sitz.",
          "Здесь находится Европейский центральный банк.", {"hat+Sitz":"имеет штаб-квартиру"})],
    ]),
    ("Ein neues Land nach dem Krieg", "Новая земля после войны", "📜", [
        [("Nach dem Zweiten Weltkrieg entstand das Land Groß-Hessen.",
          "После Второй мировой войны появилась земля Большой Гессен.", {}),
         ("Das war im September 1945.",
          "Это произошло в сентябре 1945 года.", {}),
         ("Im Dezember 1946 stimmten die Menschen über die Landesverfassung ab.",
          "В декабре 1946 года жители проголосовали по конституции земли.", {"stimmten+ab":"проголосовали"})],
    ]),
    ("Ein Park und alte Fossilien", "Парк и древние ископаемые", "🏞️", [
        [("In Kassel liegt der Bergpark Wilhelmshöhe.",
          "В Касселе находится горный парк Вильгельмсхёэ.", {}),
         ("Der Park ist für seine Wasserspiele bekannt.",
          "Парк известен своими водными каскадами и фонтанами.", {}),
         ("In der Grube Messel fand man viele Fossilien.",
          "В карьере Мессель нашли много ископаемых остатков.", {})],
    ]),
    ],
    "hessen-b2": [
    ("Zwei Hauptstädte am selben Fluss", "Две столицы на одной реке", "🧭", [
        [("Zwischen Wiesbaden und Mainz verläuft im Rhein die Grenze von Hessen und Rheinland-Pfalz.",
          "Между Висбаденом и Майнцем граница Гессена и Рейнланд-Пфальца проходит по Рейну.", {}),
         ("Beide Städte sind Landeshauptstädte, obwohl sie so nahe beieinanderliegen.",
          "Оба города — столицы земель, хотя расположены так близко друг к другу.", {}),
         ("Wer dem Main nach Osten folgt, gelangt nach Frankfurt.",
          "Если идти вдоль Майна на восток, попадёшь во Франкфурт.", {})],
    ]),
    ("Frankfurt als Finanzplatz", "Франкфурт как финансовый центр", "💶", [
        [("Frankfurt entwickelte sich in der Bundesrepublik zu einem bedeutenden Finanzplatz.",
          "Во времена ФРГ Франкфурт превратился в крупный финансовый центр.", {}),
         ("Die Europäische Zentralbank, die ihren Sitz in Frankfurt hat, ist für die Geldpolitik im Euroraum zuständig.",
          "Европейский центральный банк, расположенный во Франкфурте, отвечает за денежно-кредитную политику еврозоны.", {"für+zuständig":"отвечает за"}),
         ("Der Name Frankfurt am Main hilft, die Stadt von Frankfurt an der Oder zu unterscheiden.",
          "Название Франкфурт-на-Майне помогает отличить город от Франкфурта-на-Одере.", {})],
    ]),
    ("Von Groß-Hessen zur Verfassung", "От Большого Гессена к конституции", "🗳️", [
        [("Groß-Hessen wurde im September 1945 von der amerikanischen Militärregierung gebildet.",
          "Большой Гессен был создан американской военной администрацией в сентябре 1945 года.", {}),
         ("Zur Hauptstadt wurde im Oktober Wiesbaden bestimmt.",
          "В октябре столицей назначили Висбаден.", {}),
         ("Die Verfassung wurde 1946 durch eine Volksabstimmung angenommen.",
          "Конституцию приняли в 1946 году на референдуме.", {})],
    ]),
    ("Was die Grube Messel erzählt", "О чём рассказывает карьер Мессель", "🦴", [
        [("Die Grube Messel ist eine Fundstätte, in der außergewöhnlich gut erhaltene Fossilien entdeckt wurden.",
          "Карьер Мессель — место, где обнаружили исключительно хорошо сохранившиеся окаменелости.", {}),
         ("Anhand dieser Funde lässt sich untersuchen, welche Tiere und Pflanzen vor vielen Millionen Jahren dort lebten.",
          "По этим находкам можно изучать, какие животные и растения жили там много миллионов лет назад.", {"Anhand":"на основании"}),
         ("Die Fundstätte wurde 1995 in die UNESCO-Welterbeliste aufgenommen.",
          "В 1995 году это место внесли в список всемирного наследия UNESCO.", {})],
    ]),
    ],
}
