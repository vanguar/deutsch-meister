# History pilot

The Russian-only pilot lives in `history.html` and `data/history/`. The home
card is inserted only when the selected interface language is Russian.
Ukrainian and Arabic catalogs are deliberately unchanged until editorial review.

`index.json` contains the complete planned contents. Only entries with
`ready: true` open in the reader, including through direct links. The `items`
array contains the metadata of published reader texts for validation.

Each factual paragraph in `ch-01.json` records its `sourceIds`. Sources are
listed in the chapter and in the catalog. The text is an original B1 educational
adaptation, not an official textbook. Sources were reviewed on 2026-11-17:

- Staatliche Museen zu Berlin: teaching materials, PDF page 3, for the meaning
  of “Germanen” and the diversity of communities.
- bpb: *Meilensteine der deutschen Geschichte*, sample PDF page 12, for Roman
  territories and settlements around military camps.
- Limesmuseum Aalen: *Das römische Aalen – Militärbasis am Limes*, for the
  mixed population, watchtowers and controlled passages.
- Planet Schule / SWR: *Welche Handelswaren standen bei den Römern hoch im
  Kurs?*, for cross-border trade and demand for goods and raw materials.
- Limesmuseum Aalen: *Der Limes – Eine Grenze für Rom*, for changing relations
  and cultural contacts.
- Stadt Trier: *Weltkulturerbe*, for the Porta Nigra as a surviving Roman gate.

The two Limes SVGs are original schematic drawings, not reconstructions of an
identified site. The animated variant runs once for four seconds and holds its
last frame. The controller starts it when at least half the image is visible,
respects reduced-motion preferences, and adds no controls.

`porta-nigra.jpg`: original photo by Valeri Koshelev, downloaded unchanged from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Porta_Nigra_in_Trier.jpg),
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution and
license links are visible below the image. No image model was used.

Validation: `python -B -X utf8 scripts/validate_books.py --history` and
`node tools/test_history.js`; both are included in `scripts/check_all.py`.
