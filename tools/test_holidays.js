'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { key, occurrence, today, inYear } = require('../js/holidays');
const read = relative => JSON.parse(fs.readFileSync(path.join(__dirname, '..', relative), 'utf8'));
const base = 'data/holidays';
const catalog = read(base + '/index.json');
const byId = new Map(catalog.items.map(item => [item.id, item]));

const expectDates = (slug, dates) => {
  const item = byId.get('holiday-' + slug);
  assert.ok(item, slug);
  for (const iso of dates) assert.equal(key(occurrence(item.rule, Number(iso.slice(0, 4)))), iso);
};
expectDates('ostern', ['2024-03-31', '2025-04-20', '2026-04-05', '2027-03-28', '2038-04-25']);
expectDates('fronleichnam', ['2025-06-19', '2026-06-04', '2027-05-27']);
expectDates('buss-und-bettag', ['2025-11-19', '2026-11-18', '2027-11-17', '2028-11-22']);
expectDates('augsburger-friedensfest', ['2026-08-08', '2027-08-08']);
expectDates('deutsche-einheit-tag', ['2026-10-03', '2027-10-03']);
assert.equal(key(today(new Date('2026-07-31T22:01:00Z'))), '2026-08-01');
assert.equal(key(today(new Date('2026-07-31T21:59:00Z'))), '2026-07-31');
assert.equal(key(today(new Date('2026-11-17T23:01:00Z'))), '2026-11-18');
assert.equal(key(today(new Date('2026-11-17T22:59:00Z'))), '2026-11-17');

assert.equal(byId.size, catalog.items.length);
assert.notEqual(catalog.items.length, 0);
assert.ok(catalog.items.every(item => /^holiday-[a-z0-9-]+$/.test(item.id)));
for (const year of [2026, 2027, 2028]) {
  const dates = inYear(catalog.items, year).map(entry => key(entry.date));
  assert.deepEqual(dates, dates.slice().sort());
  assert.ok(dates.every(iso => iso.startsWith(`${year}-`)));
}

for (const lang of ['uk', 'ar']) {
  const section = `i18n/${lang}/holidays`;
  const translated = read(section + '/index.json');
  assert.deepEqual(translated.items.map(item => [item.id, item.rule]), catalog.items.map(item => [item.id, item.rule]));
  for (const item of translated.items) {
    const original = read(`${base}/${item.id}/ch-01.json`);
    const chapter = read(`${section}/${item.id}/ch-01.json`);
    const glossary = read(`${section}/${item.id}/glossary.json`);
    assert.deepEqual(read(`${section}/${item.id}/meta.json`), item);
    assert.deepEqual(chapter.sources, original.sources);
    const ids = new Set(chapter.sources.map(source => source.id));
    for (const paragraph of chapter.paragraphs) {
      assert.ok(paragraph.sourceIds.length && paragraph.sourceIds.every(id => ids.has(id)));
      assert.ok(paragraph.s.every(pair => pair.ru.trim() && (lang !== 'ar' || /\p{Script=Arabic}/u.test(pair.ru))));
    }
    assert.deepEqual(chapter.paragraphs.flatMap(p => p.s.map(s => s.de)), original.paragraphs.flatMap(p => p.s.map(s => s.de)));
    assert.deepEqual(glossary.w, read(`${base}/${item.id}/glossary.json`).w);
    if (lang === 'ar') {
      for (const info of Object.values(glossary.l)) {
        assert.ok(!Object.values(info).some(field => typeof field === 'string' && /\p{Script=Cyrillic}/u.test(field)));
      }
    }
  }
}
console.log('PASS holidays: fixed dates, Gregorian Easter, November rule, Berlin midnight, translations and sources');
