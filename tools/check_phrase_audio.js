/* Check every course phrase: speech must contain the displayed German text.
   Run: node tools/check_phrase_audio.js [data/.../lesson.js ...]
   Only reviewed number/date/abbreviation readings may differ from the text. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const normalize = text => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const readings = new Map([
  ['Ich bin 25.', 'Ich bin fünfundzwanzig'],
  ['Meine Nummer ist 0176 …', 'Meine Nummer ist null eins sieben sechs'],
  ['Ich wohne in Goethestraße 14.', 'Ich wohne in Goethestraße vierzehn'],
  ['Heute ist der 15. Mai.', 'Heute ist der fünfzehnte Mai'],
  ['Ich habe Größe 38.', 'Ich habe Größe achtunddreißig'],
  ['Das macht 49,90 Euro.', 'Das macht neunundvierzig Euro neunzig'],
  ['Die Miete kostet 800 Euro.', 'Die Miete kostet achthundert Euro'],
  ['Ich verdiene 2500 Euro im Monat.', 'Ich verdiene zweitausendfünfhundert Euro im Monat'],
  ['Es sind 25 Grad im Schatten.', 'Es sind fünfundzwanzig Grad im Schatten'],
  ['Sehr geehrte Frau Dr. Schmidt,', 'Sehr geehrte Frau Doktor Schmidt'],
  ['Ich beziehe mich auf Ihr Schreiben vom 12. März.', 'Ich beziehe mich auf Ihr Schreiben vom zwölften März'],
]);

function matches(phrase) {
  // The renderer falls back to de if audio is absent or empty.
  const audio = phrase.audio || phrase.de;
  const expected = readings.get(phrase.de) || phrase.de.replace(/\s*\/\s*/g, ' oder ');
  return normalize(audio) === normalize(expected);
}

if (require.main === module) {
  const files = process.argv.slice(2);
  if (!files.length) {
    for (const level of ['a1', 'a2', 'b1', 'b2']) {
      for (const name of fs.readdirSync(path.join(ROOT, 'data', level)).sort()) {
        if (name.endsWith('.js')) files.push(path.join(ROOT, 'data', level, name));
      }
    }
  }
  let count = 0, failures = 0;
  for (const file of files) {
    const context = {};
    vm.runInNewContext(fs.readFileSync(file, 'utf8') + ';globalThis.data = LESSON_DATA;', context);
    for (const [index, phrase] of context.data.phrases.entries()) {
      count++;
      if (!matches(phrase)) {
        failures++;
        console.error(`${path.relative(ROOT, file)} phrase ${index + 1}:\n  text:  ${phrase.de}\n  audio: ${phrase.audio}`);
      }
    }
  }
  console.log(`Phrase audio: ${count} phrases in ${files.length} lessons, ${failures} mismatches`);
  process.exitCode = failures ? 1 : 0;
}

module.exports = { matches };
