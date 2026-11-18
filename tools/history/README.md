# A short history of Germany

The 14 chapters live in `history.html` and `data/history/`. The catalog and
reader support Russian, Ukrainian and Arabic translations alongside B1 German.
Chapter sources and translations are authored in `tools/history/content/`.

`index.json` contains the complete table of contents. Only entries with
`ready: true` open in the reader, including through direct links. The `items`
array contains the metadata of published reader texts for validation.

Each factual paragraph in `ch-01.json` records its `sourceIds`. Sources are
listed in the chapter and in the catalog. The text is an original B1 educational
adaptation. Chapter 1 sources were reviewed on 2026-11-17:

- Landesmuseum für Vorgeschichte Halle: *Die Erfindung der Germanen*, for
  the Roman name for communities east of the Rhine and their diversity.
- bpb: *Meilensteine der deutschen Geschichte*, sample PDF page 12, for Roman
  territories and settlements around military camps.
- Limesmuseum Aalen: *Das römische Aalen – Militärbasis am Limes*, for the
  mixed population, watchtowers and controlled passages.
- Planet Schule / SWR: *Welche Handelswaren standen bei den Römern hoch im
  Kurs?*, for cross-border trade and demand for goods and raw materials.
- Limesmuseum Aalen: *Der Limes – Eine Grenze für Rom*, for changing relations
  and cultural contacts.
- Stadt Trier: *Weltkulturerbe*, for the Porta Nigra as a surviving Roman gate.

Chapter 1 and the catalog feature photographs of Roman sites.
Source links are marked with an external-link icon, domain and PDF indicator.
They use native same-tab navigation in browsers and Telegram openLink inside
the Mini App, avoiding unsupported pop-up tabs.

`porta-nigra.jpg`: original photo by Valeri Koshelev, downloaded unchanged from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Porta_Nigra_in_Trier.jpg),
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution and
license links are visible below the image. No image model was used.

`saalburg.jpg`: 1280 × 720 Wikimedia thumbnail of an aerial photograph by
Archaecopteryx, [source](https://commons.wikimedia.org/wiki/File:Luftbild_saalburg.jpg),
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The cover identifies
the fort as reconstructed; the chapter uses a different photograph, Porta Nigra.

Reader positions include source links and figures, so browser Back and reload
return to those pages. Source anchors use the paragraph after the prose and the
source index in the existing numeric p/s/w progress format.

Validation: `python -B -X utf8 scripts/validate_books.py --history` and
`node tools/test_history.js`; both are included in `scripts/check_all.py`.
