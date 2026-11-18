"""Original B1 texts. Sentence order is German, Russian, Ukrainian, Arabic."""

BUNDESBANK = (
    'bundesbank', 'Deutsche Bundesbank · Feiertage in Deutschland',
    'https://www.bundesbank.de/resource/blob/749314/d727f4a4d67d280c9d80b52c0f275e9c/472B63F073F071307366337C94F8C870/feiertage-in-deutschland-1-data.pdf',
)

EVENTS = [
    ('dreikoenige', (1, 6),
     'Heilige Drei Könige|День трёх королей|День трьох королів|عيد الملوك الثلاثة',
     'Германия · Баден-Вюртемберг, Бавария и Саксония-Анхальт|Німеччина · Баден-Вюртемберг, Баварія та Саксонія-Ангальт|ألمانيا · بادن-فورتمبيرغ وبافاريا وساكسونيا-أنهالت',
     [
         BUNDESBANK,
         ('segen', 'Kindermissionswerk · Fragen zum Sternsingen', 'https://www.sternsinger.de/sternsingen/faq/'),
         ('aktion', 'Kindermissionswerk · Dreikönigssingen', 'https://www.sternsinger.de/sternsingen/bischoefliche-ordnung-zur-aktion-dreikoenigssingen/'),
     ], [
         ('bundesbank', '''Am 6. Januar ist in Baden-Württemberg, Bayern und Sachsen-Anhalt ein gesetzlicher Feiertag.|6 января — официальный праздник в Баден-Вюртемберге, Баварии и Саксонии-Анхальт.|6 січня — офіційне свято в Баден-Вюртемберзі, Баварії та Саксонії-Ангальт.|السادس من يناير عطلة رسمية في بادن-فورتمبيرغ وبافاريا وساكسونيا-أنهالت.'''),
         ('segen,aktion', '''Anfang Januar gehen vielerorts Kinder als Sternsinger von Tür zu Tür.|В начале января во многих местах дети ходят от двери к двери с рождественскими песнями и звездой.|На початку січня в багатьох місцях діти ходять від дверей до дверей із різдвяними піснями та зіркою.|في أوائل يناير يطوف الأطفال في أماكن كثيرة من باب إلى باب وهم ينشدون ويحملون نجمة الميلاد.
Sie sammeln Spenden und hinterlassen den Segen C+M+B an der Haustür.|Они собирают пожертвования и оставляют на входной двери благословение C+M+B.|Вони збирають пожертви й залишають на вхідних дверях благословення C+M+B.|يجمعون التبرعات ويتركون البركة C+M+B على باب المنزل.
Die drei Buchstaben bedeuten heute: Christus segne dieses Haus.|Сегодня эти три буквы означают «Христос, благослови этот дом».|Сьогодні ці три літери означають «Христе, благослови цей дім».|تعني هذه الحروف الثلاثة اليوم: ليبارك المسيح هذا البيت.'''),
     ]),
    ('frauentag', (3, 8),
     'Internationaler Frauentag|Международный женский день|Міжнародний жіночий день|اليوم العالمي للمرأة',
     'Германия · Берлин и Мекленбург — Передняя Померания|Німеччина · Берлін і Мекленбург — Передня Померанія|ألمانيا · برلين ومكلنبورغ-فوربومرن',
     [
         ('berlin', 'Land Berlin · Sonn- und Feiertagsrecht', 'https://www.berlin.de/sen/inneres/buerger-und-staat/verfassungs-und-verwaltungsrecht/artikel.1435639.php'),
         ('mv', 'Landesregierung Mecklenburg-Vorpommern · Frauentag', 'https://www.regierung-mv.de/Aktuell/?id=211797&processor=processor.sa.pressemitteilung'),
     ], [
         ('berlin,mv', '''Am 8. März geht es um die gleichen Rechte für Frauen und Männer.|8 марта говорят о равных правах женщин и мужчин.|8 березня говорять про рівні права жінок і чоловіків.|في الثامن من مارس يدور الحديث حول المساواة في الحقوق بين النساء والرجال.
In Berlin ist der Tag ein gesetzlicher Feiertag.|В Берлине это официальный праздник.|У Берліні це офіційне свято.|وهو عطلة رسمية في برلين.
In Mecklenburg-Vorpommern gilt das seit 2023.|В Мекленбурге — Передней Померании официальный выходной появился в 2023 году.|У Мекленбурзі — Передній Померанії офіційний вихідний запровадили у 2023 році.|وفي مكلنبورغ-فوربومرن بدأ العمل بذلك عام 2023.'''),
         ('mv', '''Dort werden auch Frauen für ihr Engagement ausgezeichnet.|Там также награждают женщин за их вклад в общественную жизнь.|Там також відзначають жінок за їхній внесок у суспільне життя.|وتُكرَّم هناك أيضًا نساء تقديرًا لجهودهن في المجتمع.'''),
     ]),
    ('ostern', ('easter', 0),
     'Ostern|Пасха|Великдень|عيد الفصح',
     'Германия · Северный Рейн — Вестфалия и Саксония|Німеччина · Північний Рейн — Вестфалія та Саксонія|ألمانيا · شمال الراين-وستفاليا وساكسونيا',
     [
         ('unesco', 'Deutsche UNESCO-Kommission · Osterräderlauf', 'https://www.unesco.de/staette/osterraederlauf-in-luegde/'),
         ('lausitz', 'Deutsche UNESCO-Kommission · Bräuche der Lausitzer Sorben', 'https://www.unesco.de/staette/gesellschaftliche-braeuche-und-feste-der-lausitzer-sorben-im-jahreslauf/'),
     ], [
         ('unesco', '''In Lügde sieht der Ostersonntag besonders aus.|Пасхальное воскресенье в Люгде выглядит по-особенному.|Великодня неділя в Люґде має особливий вигляд.|يبدو أحد الفصح مختلفًا في بلدة لوغده.
Wenn es dunkel wird, rollen brennende Holzräder den Osterberg hinunter.|Когда темнеет, с горы Остерберг скатываются горящие деревянные колёса.|Коли сутеніє, з гори Остерберґ скочуються палаючі дерев’яні колеса.|حين يحل الظلام تتدحرج عجلات خشبية مشتعلة من تل أوستربرغ.
Der Osterräderlauf bringt Menschen aus der Stadt und Gäste zusammen.|На зрелище собираются и жители города, и гости.|На видовище збираються і жителі міста, і гості.|ويجمع هذا التقليد سكان البلدة وزوارها.'''),
         ('lausitz', '''In der sächsischen Oberlausitz pflegen katholische Sorben einen anderen Brauch.|В саксонской Верхней Лужице у католиков из числа лужицких сербов есть свой обычай.|У саксонській Верхній Лужиці католики з-поміж лужицьких сербів мають свій звичай.|في لوساتيا العليا بولاية ساكسونيا يحافظ الصوربيون الكاثوليك على تقليد خاص بهم.
Beim Osterreiten ziehen sie auf Pferden durch die Region.|Во время пасхального конного шествия они проезжают верхом по окрестностям.|Під час великодньої кінної ходи вони їдуть верхи околицями.|ففي موكب الفصح يجوبون المنطقة على ظهور الخيل.'''),
     ]),
    ('fronleichnam', ('easter', 60),
     'Fronleichnam|Праздник Тела Христова|Свято Тіла Христового|عيد جسد المسيح',
     'Германия · шесть земель и отдельные общины|Німеччина · шість земель і окремі громади|ألمانيا · ست ولايات وبعض البلديات',
     [
         ('kirche', 'Erzbistum München und Freising · Fronleichnam', 'https://www2.erzbistum-muenchen.de/pfarrei/pv-peiting-hohenpeissenberg/kirchenjahr-fronleichnam/117230'),
         ('seehausen', 'Gemeinde Seehausen · Seeprozession', 'https://www.seehausen-am-staffelsee.de/brauchtum-feste-traditionen.html'),
         ('koeln', 'Stadt Köln · Mülheimer Gottestracht', 'https://www.stadt-koeln.de/artikel/06802/index.html'),
         BUNDESBANK,
     ], [
         ('kirche', '''Fronleichnam ist ein katholisches Fest und fällt auf einen Donnerstag, 60 Tage nach Ostern.|Праздник Тела Христова отмечают католики в четверг, через 60 дней после Пасхи.|Свято Тіла Христового католики відзначають у четвер, через 60 днів після Великодня.|عيد جسد المسيح عيد كاثوليكي يوافق يوم خميس بعد الفصح بستين يومًا.'''),
         ('seehausen', '''In Seehausen zieht die Prozession durch geschmückte Straßen bis zum Staffelsee.|В Зеехаузене процессия идёт по украшенным улицам до озера Штаффельзе.|У Зеегаузені процесія йде прикрашеними вулицями до озера Штаффельзе.|في زيهاوزن يمر الموكب في شوارع مزينة حتى يصل إلى بحيرة شتافلزيه.
Dann geht es in vielen Booten weiter bis zur Insel Wörth.|Затем участники пересаживаются в лодки и плывут до острова Вёрт.|Потім учасники сідають у човни й пливуть до острова Верть.|ثم يواصل المشاركون الرحلة في قوارب كثيرة حتى جزيرة فيرت.'''),
         ('koeln', '''Auch in Köln-Mülheim gehört das Wasser zum Fest.|В кёльнском районе Мюльхайм праздник тоже связан с водой.|У кельнському районі Мюльгайм свято теж пов’язане з водою.|وفي حي مولهايم بمدينة كولونيا يشكل الماء أيضًا جزءًا من الاحتفال.
Bei der Mülheimer Gottestracht fahren Schiffe in einer Prozession auf dem Rhein.|Во время традиционной Мюльхаймской процессии по Рейну идут суда.|Під час традиційної Мюльгаймської процесії Рейном ідуть судна.|فخلال موكب مولهايم التقليدي تسير السفن في نهر الراين.'''),
         ('bundesbank', '''Gesetzlicher Feiertag ist Fronleichnam in Baden-Württemberg, Bayern und Hessen.|Праздник Тела Христова — официальный выходной в Баден-Вюртемберге, Баварии и Гессене.|Свято Тіла Христового — офіційний вихідний у Баден-Вюртемберзі, Баварії та Гессені.|عيد جسد المسيح عطلة رسمية في بادن-فورتمبيرغ وبافاريا وهيسن.
Das gilt auch in Nordrhein-Westfalen, Rheinland-Pfalz und im Saarland.|Это правило также действует в Северном Рейне — Вестфалии, Рейнланд-Пфальце и Сааре.|Це правило також діє в Північному Рейні — Вестфалії, Рейнланд-Пфальці та Саарі.|وينطبق ذلك أيضًا في شمال الراين-وستفاليا وراينلاند-بفالتس وسارلاند.
In Sachsen und Thüringen gilt der Feiertag in einigen Gemeinden.|В Саксонии и Тюрингии выходной действует в отдельных общинах.|У Саксонії та Тюрингії вихідний діє в окремих громадах.|وفي ساكسونيا وتورينغن تسري العطلة في بعض البلديات.'''),
     ]),
    ('bundesfeier', (8, 1),
     'Schweizer Bundesfeier|Национальный день Швейцарии|Національний день Швейцарії|العيد الوطني السويسري',
     'Швейцария|Швейцарія|سويسرا',
     [
         ('tourismus', 'Schweiz Tourismus · 1. August', 'https://www.myswitzerland.com/de/erlebnisse/veranstaltungen/braeuche-im-sommer-und-herbst/der-1-august-bundesfeier/'),
         ('bundesrat', 'Eidgenössisches Finanzdepartement · Bundesfeier auf dem Rütli', 'https://www.efd.admin.ch/de/rede-brkks-1-august-2025-ruetli-de'),
     ], [
         ('tourismus', '''Am 1. August feiert die Schweiz ihren Nationalfeiertag.|1 августа Швейцария отмечает национальный праздник.|1 серпня Швейцарія відзначає національне свято.|تحتفل سويسرا بعيدها الوطني في الأول من أغسطس.
Der Tag erinnert an den Bundesbrief von 1291.|Этот день напоминает о Союзной грамоте 1291 года.|Цей день нагадує про Союзну грамоту 1291 року.|يذكّر هذا اليوم بالميثاق الاتحادي لعام 1291.'''),
         ('tourismus,bundesrat', '''In manchen Orten gehen Kinder mit Lampions durch die Straßen.|В некоторых местах дети идут по улицам с бумажными фонариками.|У деяких місцях діти йдуть вулицями з паперовими ліхтариками.|في بعض الأماكن يمشي الأطفال في الشوارع حاملين فوانيس ورقية.
Eine bekannte Feier findet auf der Rütliwiese über dem Vierwaldstättersee statt.|Один из самых известных праздников проходит на лугу Рютли над Фирвальдштетским озером.|Одне з найвідоміших святкувань проходить на лузі Рютлі над Фірвальдштетським озером.|ومن أشهر الاحتفالات ذلك الذي يقام في مرج روتلي المطل على بحيرة لوتسرن.'''),
     ]),
    ('augsburger-friedensfest', (8, 8),
     'Augsburger Hohes Friedensfest|Праздник мира в Аугсбурге|Свято миру в Аугсбурзі|عيد السلام في أوغسبورغ',
     'Германия · Аугсбург, Бавария|Німеччина · Аугсбург, Баварія|ألمانيا · أوغسبورغ، بافاريا',
     [
         ('stadt', 'Stadt Augsburg · Hohes Friedensfest', 'https://www.augsburg.de/kultur/friedensstadt-augsburg/hohes-friedensfest'),
         ('gesetz', 'Bayerisches Feiertagsgesetz · Art. 1', 'https://www.gesetze-bayern.de/Content/Document/BayFTG-1'),
     ], [
         ('stadt,gesetz', '''Der 8. August ist in Augsburg ein eigener gesetzlicher Feiertag.|8 августа в Аугсбурге свой официальный выходной.|8 серпня в Аугсбурзі свій офіційний вихідний.|الثامن من أغسطس عطلة رسمية خاصة بمدينة أوغسبورغ.
Das Fest erinnert daran, dass die Protestanten nach dem Dreißigjährigen Krieg ihren Glauben wieder frei leben konnten.|Праздник напоминает о том, что после Тридцатилетней войны протестанты снова могли свободно исповедовать свою веру.|Свято нагадує про те, що після Тридцятилітньої війни протестанти знову могли вільно сповідувати свою віру.|يذكّر العيد بأن البروتستانت تمكنوا بعد حرب الثلاثين عامًا من ممارسة شعائرهم بحرية من جديد.'''),
         ('stadt', '''Heute sitzen Menschen auf dem Rathausplatz zusammen an der Friedenstafel.|Сегодня на Ратушной площади жители и гости садятся за общий стол мира.|Сьогодні на Ратушній площі жителі та гості сідають за спільний стіл миру.|واليوم يجلس الناس معًا حول مائدة السلام في ساحة دار البلدية.
Auch in den Stadtteilen gibt es solche Tische.|Такие столы накрывают и в районах города.|Такі столи накривают і в районах міста.|وتقام موائد مماثلة في أحياء المدينة أيضًا.'''),
     ]),
    ('deutsche-einheit-tag', (10, 3),
     'Tag der Deutschen Einheit|День германского единства|День німецької єдності|يوم الوحدة الألمانية',
     'Германия · вся страна|Німеччина · уся країна|ألمانيا · جميع أنحاء البلاد',
     [
         ('chronik', 'Bundesregierung · 3. Oktober 1990', 'https://www.bundesregierung.de/breg-de/schwerpunkte/deutsche-einheit/die-einheit-ist-wirklichkeit-432814'),
         ('bremen', 'Bundesregierung · Tag der Deutschen Einheit in Bremen', 'https://www.bundesregierung.de/breg-de/leichte-sprache/tag-der-deutschen-einheit-2454562'),
     ], [
         ('chronik', '''Am 3. Oktober 1990 wurde Deutschland wieder ein Land.|3 октября 1990 года Германия снова стала единой страной.|3 жовтня 1990 року Німеччина знову стала єдиною країною.|في الثالث من أكتوبر 1990 أصبحت ألمانيا دولة واحدة من جديد.
Seitdem ist der 3. Oktober in ganz Deutschland ein Feiertag.|С тех пор 3 октября — праздник во всей Германии.|Відтоді 3 жовтня — свято в усій Німеччині.|ومنذ ذلك الحين أصبح الثالث من أكتوبر عطلة في أنحاء ألمانيا كلها.'''),
         ('bremen', '''Jedes Jahr lädt ein anderes Bundesland zur zentralen Feier ein.|Каждый год на главное празднование приглашает новая федеральная земля.|Щороку на головне святкування запрошує інша федеральна земля.|في كل عام تستضيف ولاية اتحادية مختلفة الاحتفال الرئيسي.
2026 war die Feier in Bremen.|В 2026 году праздник принимал Бремен.|У 2026 році святкування приймав Бремен.|وفي عام 2026 أقيم الاحتفال في بريمن.'''),
     ]),
    ('nationalfeiertag-oesterreich', (10, 26),
     'Österreichischer Nationalfeiertag|Национальный день Австрии|Національний день Австрії|العيد الوطني النمساوي',
     'Австрия|Австрія|النمسا',
     [
         ('parlament', 'Österreichisches Parlament · Staatsvertrag und Neutralität', 'https://www.parlament.gv.at/verstehen/historisches/1945-1995/staatsvertrag'),
         ('archiv', 'Parlamentsarchiv · Eine freiwillige Verpflichtung', 'https://www.parlament.gv.at/fachinfos/parlamentsarchiv/Eine-freiwillige-Verpflichtung'),
     ], [
         ('parlament,archiv', '''Am 26. Oktober feiert Österreich seinen Nationalfeiertag.|26 октября Австрия отмечает национальный праздник.|26 жовтня Австрія відзначає національне свято.|تحتفل النمسا بعيدها الوطني في السادس والعشرين من أكتوبر.
An diesem Tag beschloss das Parlament im Jahr 1955 die Neutralität Österreichs.|В этот день в 1955 году парламент принял закон о нейтралитете Австрии.|Цього дня 1955 року парламент ухвалив закон про нейтралітет Австрії.|في هذا اليوم من عام 1955 أقر البرلمان حياد النمسا.
1956 hieß die Feier noch Tag der Fahne.|В 1956 году праздник ещё называли Днём флага.|У 1956 році свято ще називали Днем прапора.|في عام 1956 كان الاحتفال يُعرف باسم يوم العَلَم.
Seit 1965 ist der 26. Oktober der Nationalfeiertag.|С 1965 года 26 октября стало национальным праздником.|Із 1965 року 26 жовтня є національним святом.|ومنذ عام 1965 أصبح السادس والعشرون من أكتوبر العيد الوطني.'''),
     ]),
    ('reformationstag', (10, 31),
     'Reformationstag|День Реформации|День Реформації|يوم الإصلاح الديني',
     'Германия · девять земель|Німеччина · дев’ять земель|ألمانيا · تسع ولايات',
     [
         ('sachsen', 'REVOSax · Sächsisches Feiertagsgesetz', 'https://www.revosax.sachsen.de/vorschrift/3997-SaechsSFG'),
         ('wartburg', 'Wartburg-Stiftung · Martin Luther', 'https://www.wartburg.de/personen/martin-luther'),
         BUNDESBANK,
     ], [
         ('bundesbank,sachsen', '''Am 31. Oktober ist der Reformationstag in neun Bundesländern ein gesetzlicher Feiertag.|31 октября День Реформации — официальный выходной в девяти федеральных землях.|31 жовтня День Реформації — офіційний вихідний у дев’ятьох федеральних землях.|يوم الإصلاح الديني في الحادي والثلاثين من أكتوبر عطلة رسمية في تسع ولايات اتحادية.
Dazu gehören Bremen, Hamburg, Niedersachsen und Schleswig-Holstein.|В их числе Бремен, Гамбург, Нижняя Саксония и Шлезвиг-Гольштейн.|Серед них Бремен, Гамбург, Нижня Саксонія та Шлезвіг-Гольштейн.|من بينها بريمن وهامبورغ وساكسونيا السفلى وشليسفيغ-هولشتاين.
Auch in Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen ist der Tag frei.|Этот день также выходной в Бранденбурге, Мекленбурге — Передней Померании, Саксонии, Саксонии-Анхальт и Тюрингии.|Цей день також вихідний у Бранденбурзі, Мекленбурзі — Передній Померанії, Саксонії, Саксонії-Ангальт і Тюрингії.|وهو أيضًا يوم عطلة في براندنبورغ ومكلنبورغ-فوربومرن وساكسونيا وساكسونيا-أنهالت وتورينغن.'''),
         ('wartburg', '''Wer mehr über die Reformation erfahren möchte, kann die Wartburg in Thüringen besuchen.|Чтобы ближе познакомиться с Реформацией, можно посетить замок Вартбург в Тюрингии.|Щоб ближче познайомитися з Реформацією, можна відвідати замок Вартбурґ у Тюрингії.|ومن يرغب في معرفة المزيد عن الإصلاح الديني يمكنه زيارة قلعة فارتبورغ في تورينغن.
Dort übersetzte Martin Luther 1521 und 1522 das Neue Testament ins Deutsche.|Там в 1521 и 1522 годах Мартин Лютер переводил Новый Завет на немецкий.|Там у 1521 і 1522 роках Мартін Лютер перекладав Новий Заповіт німецькою.|هناك ترجم مارتن لوثر العهد الجديد إلى الألمانية في عامي 1521 و1522.'''),
     ]),
    ('buss-und-bettag', ('repentance',),
     'Buß- und Bettag|День покаяния и молитвы|День покаяння і молитви|يوم التوبة والصلاة',
     'Германия · Саксония и Бавария|Німеччина · Саксонія й Баварія|ألمانيا · ساكسونيا وبافاريا',
     [
         ('sachsen', 'REVOSax · Sächsisches Feiertagsgesetz', 'https://www.revosax.sachsen.de/vorschrift/3997-SaechsSFG'),
         ('bayern', 'Bayerisches Kultusministerium · Ferien und Feiertage', 'https://www.km.bayern.de/termine/ferien-und-feiertage'),
         ('kirche', 'Evangelisch.de · Einkehr und Umkehr', 'https://www.evangelisch.de/inhalte/113462/11-09-2013/buss-und-bettag-einkehr-und-umkehr'),
     ], [
         ('kirche', '''Der Buß- und Bettag liegt im November und fällt immer auf einen Mittwoch.|День покаяния и молитвы приходится на ноябрь и всегда выпадает на среду.|День покаяння і молитви припадає на листопад і завжди випадає на середу.|يقع يوم التوبة والصلاة في نوفمبر، ويوافق دائمًا يوم أربعاء.
Für evangelische Christen ist er eine Zeit zum Beten und Nachdenken.|Для протестантов это время молитвы и размышлений.|Для протестантів це час молитви й роздумів.|وهو وقت للصلاة والتأمل لدى المسيحيين البروتستانت.'''),
         ('sachsen,bayern', '''In Sachsen ist der Buß- und Bettag ein gesetzlicher Feiertag.|В Саксонии День покаяния и молитвы — официальный праздник.|У Саксонії День покаяння і молитви — офіційне свято.|يوم التوبة والصلاة عطلة رسمية في ساكسونيا.
In Bayern haben Schülerinnen und Schüler an diesem Tag keinen Unterricht.|В Баварии в этот день у школьников нет уроков.|У Баварії цього дня в школярів немає уроків.|وفي بافاريا لا يتلقى تلاميذ المدارس دروسًا في هذا اليوم.'''),
     ]),
]
