'use strict';
const assert = require('node:assert/strict');
const { matches } = require('./check_phrase_audio');

for (const phrase of [
  { de: 'Ich kündige meinen Job, weil ich eine bessere Stelle gefunden habe.', audio: 'Ich kündige meinen Job' },
  { de: 'Hätte ich gewusst, dass…', audio: 'Hätte ich gewusst' },
  { de: 'Wir haben einen Museum besichtigt.', audio: 'Wir haben ein Museum besichtigt' },
  { de: 'Ich bin 25.', audio: 'Ich bin' },
  { de: 'Ich arbeite in Vollzeit / Teilzeit.', audio: 'Ich arbeite in Vollzeit' },
]) {
  assert.equal(matches(phrase), false, `must reject omitted/changed words: ${phrase.de}`);
}

for (const phrase of [
  { de: 'Eine vollständige Phrase.' },
  { de: 'Eine vollständige Phrase.', audio: '' },
  { de: 'Hätte ich gewusst, dass…', audio: 'Hätte ich gewusst, dass' },
  { de: 'Ich bin 25.', audio: 'Ich bin fünfundzwanzig' },
  { de: 'Heute ist der 15. Mai.', audio: 'Heute ist der fünfzehnte Mai' },
  { de: 'Sehr geehrte Frau Dr. Schmidt,', audio: 'Sehr geehrte Frau Doktor Schmidt' },
  { de: 'Ich arbeite in Vollzeit / Teilzeit.', audio: 'Ich arbeite in Vollzeit oder Teilzeit' },
]) {
  assert.equal(matches(phrase), true, `must accept full text or reviewed reading: ${phrase.de}`);
}
console.log('Phrase audio regression checks passed');
