'use strict';
// Run through the local QA page. All state changes stay on the local origin.
const frame = document.getElementById('lesson');
const results = document.getElementById('results');
const key = 'dm_cards:b2-04';
const tick = ms => new Promise(resolve => setTimeout(resolve, ms));
let original;
function check(ok, label) {
  results.textContent += '\n' + (ok ? 'PASS ' : 'FAIL ') + label;
  if (!ok) throw Error(label);
}
async function load(lang = 'ru') {
  frame.src = '../lessons/b2/lesson-04/index.html?lang=' + lang + '&qa=' + Date.now();
  await new Promise(resolve => { frame.onload = resolve; });
  for (let i = 0; i < 100; i++) {
    if (frame.contentDocument.querySelectorAll('#cardDots .fc-dot').length === 24) break;
    await tick(50);
  }
  await frame.contentDocument.fonts.ready;
  await Promise.all(frame.contentDocument.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity)
    .map(a => a.finished.catch(() => {})));
  await tick(100);
  const win = frame.contentWindow;
  Object.defineProperty(win.navigator, 'onLine', { configurable: true, value: false });
  // Test the unavailable-audio path without producing sound or network requests.
  if (win.speechSynthesis) win.speechSynthesis.getVoices = () => [];
  return win.document;
}
function restore() {
  if (original === null) localStorage.removeItem(key); else if (original !== undefined) localStorage.setItem(key, original);
}
function states(doc) { return [...doc.querySelectorAll('#cardDots .fc-dot')].map(el => el.className).join('|'); }
function clickCard(doc) { doc.getElementById('flashcard').click(); }
function rate(doc, again = false) { clickCard(doc); doc.querySelector(again ? '.card-btn.again' : '.card-btn.good').click(); }
function rect(el) { return el.getBoundingClientRect(); }
function reconnectAndGoOffline(doc) {
  const win = doc.defaultView;
  Object.defineProperty(win.navigator, 'onLine', { configurable: true, value: true });
  win.dispatchEvent(new win.Event('online'));
  Object.defineProperty(win.navigator, 'onLine', { configurable: true, value: false });
}
async function preview(suffix = false) {
  original = localStorage.getItem(key);
  localStorage.removeItem(key);
  const doc = await load();
  doc.documentElement.setAttribute('data-theme', 'light');
  if (suffix) {
    const word = [...doc.querySelectorAll('.vocab-item')].find(el => el.querySelector('.vocab-word').textContent === '-nis');
    word.scrollIntoView({ block: 'center', behavior: 'instant' });
    word.querySelector('button').click();
  } else {
    doc.getElementById('flashcard').scrollIntoView({ block: 'center', behavior: 'instant' });
    clickCard(doc);
    doc.getElementById('cardActions').scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  frame.contentWindow.clearTimeout(doc.getElementById('ttsOfflineNotice')._timer);
  restore();
  results.textContent = 'Preview: offline notice occupies its own row, below the controls/content.';
}
document.getElementById('notice').onclick = () => preview();
document.getElementById('vocab').onclick = () => preview(true);
document.getElementById('run').onclick = async () => {
  const run = document.getElementById('run'); run.disabled = true;
  original = localStorage.getItem(key);
  const progressKeys = ['dm_progress', 'dm_sections:b2-04'];
  const originalProgress = progressKeys.map(key => localStorage.getItem(key));
  results.textContent = 'Running…';
  try {
    localStorage.removeItem(key);
    localStorage.removeItem('dm_sections:b2-04');
    let doc = await load();
    const phrase = doc.querySelectorAll('#phraseGrid .phrase-card')[3];
    const phraseBody = phrase.querySelector('.phrase-body');
    const phraseSpeak = phrase.querySelector('.speak-btn');
    for (const width of [320, 390, 1024]) {
      frame.style.width = width + 'px'; frame.style.maxWidth = 'none';
      await tick(150);
      const widthBefore = rect(phraseBody).width;
      phraseSpeak.click();
      const warning = doc.getElementById('ttsOfflineNotice');
      check(warning?.parentElement === phrase && Math.abs(rect(phraseBody).width - widthBefore) < 1 &&
        rect(warning).top >= Math.max(rect(phraseBody).bottom, rect(phraseSpeak).bottom) &&
        warning.scrollWidth <= warning.clientWidth, 'phrase warning fits on its own row at ' + width + 'px');
      const timer = warning._timer;
      phraseSpeak.click();
      doc.querySelector('#phraseGrid .speak-btn').click();
      check(warning.parentElement === phrase && warning._timer === timer, 'more speech attempts do not move or extend the warning at ' + width + 'px');
      reconnectAndGoOffline(doc);
    }
    frame.style.width = '360px'; frame.style.maxWidth = '100%';
    await tick(350);
    const card = doc.getElementById('flashcard');
    card.scrollIntoView({ block: 'center', behavior: 'instant' });
    const actions = doc.getElementById('cardActions');
    const before = rect(card.parentElement), actionBefore = rect(actions);
    const allRules = [];
    const walkRules = rules => { for (const rule of rules) { if (rule.cssRules) walkRules(rule.cssRules); else allRules.push(rule); } };
    for (const sheet of doc.styleSheets) { try { walkRules(sheet.cssRules); } catch (_) {} }
    check(!allRules.some(rule => rule.selectorText?.includes(':active') && rule.style?.filter &&
      card.matches(rule.selectorText.replaceAll(':active', ''))), 'press effect never flattens the 3D flashcard');
    clickCard(doc);
    await tick(120);
    const moving = frame.contentWindow.getComputedStyle(card);
    check(moving.filter === 'none' && moving.scale === 'none', 'flip has no brightness filter or scale jump');
    check(moving.transform !== 'none' && Math.abs(rect(card.parentElement).top - before.top) < 1,
      'flip animates without a vertical jump (' + before.top + ' → ' + rect(card.parentElement).top + '; ' + moving.transform + ')');
    await tick(500);
    check(Math.abs(rect(actions).top - actionBefore.top) < 1, 'answer controls keep the same layout position');
    const notice = doc.getElementById('ttsOfflineNotice');
    check(frame.contentWindow.getComputedStyle(notice).position === 'static' && rect(notice).top >= rect(actions).bottom,
      'offline notice cannot cover the card or its buttons');
    check(notice.scrollWidth <= notice.clientWidth && notice.scrollHeight <= notice.clientHeight, 'notice text fits inside the rounded background');
    doc.querySelector('.card-btn.again').click();
    rate(doc); const savedDots = states(doc);
    doc = await load();
    check(states(doc) === savedDots && doc.getElementById('cardCounter').textContent.includes('3'), 'reload restores dots and current card');
    for (let i = 2; i < 24; i++) rate(doc);
    check(doc.querySelectorAll('.fc-dot').length === 24 && doc.querySelectorAll('.fc-dot.done').length === 23, 'repeat round retains all 24 dots');
    doc = await load();
    rate(doc);
    doc = await load();
    check(doc.querySelectorAll('.fc-dot.done').length === 24 && doc.getElementById('flashcard').style.display === 'none', 'completed review survives reload');
    const restart = doc.querySelector('.flashcard-restart');
    const open = doc.querySelector('.flashcard-open');
    check(restart && !restart.getClientRects().length && open?.getClientRects().length > 0,
      'the completed deck can be opened from its own section before the lesson is done');
    open.click();
    check(doc.getElementById('cardCounter').textContent === 'Карточка 1 из 24' && !doc.querySelector('.flashcard-open'),
      'the section opener starts the deck and disappears until the review ends');
    for (let i = 0; i < 24; i++) rate(doc);
    for (const section of ['fill', 'choice', 'match', 'dict']) doc.defaultView.eval(`Progress.markSectionDone('${section}', 100)`);
    const completedRestart = doc.querySelector('.flashcard-restart');
    check(completedRestart.getClientRects().length > 0 && !doc.querySelector('.flashcard-open').getClientRects().length,
      'after lesson completion only the banner repeat action is visible');
    completedRestart.click();
    check(doc.getElementById('cardCounter').textContent === 'Карточка 1 из 24' && doc.querySelectorAll('.fc-dot.done').length === 0,
      'completed cards can be reviewed again using the restart button');
    localStorage.removeItem(key);
    doc = await load();
    for (let i = 0; i < 20; i++) rate(doc);
    for (const width of [320, 360, 390, 768]) {
      frame.style.width = width + 'px'; frame.style.maxWidth = 'none';
      await tick(100);
      if (!doc.getElementById('flashcard').classList.contains('flipped')) clickCard(doc);
      await tick(550);
      const back = doc.querySelector('.card-face.back');
      check(back.scrollHeight <= back.clientHeight && back.scrollWidth <= back.clientWidth &&
        doc.documentElement.scrollWidth <= doc.documentElement.clientWidth, 'suffix explanation fits at ' + width + 'px');
    }
    frame.style.width = '360px'; frame.style.maxWidth = '100%';
    const word = [...doc.querySelectorAll('.vocab-item')].find(el => el.querySelector('.vocab-word').textContent === '-nis');
    reconnectAndGoOffline(doc);
    word.querySelector('button').click();
    check(doc.getElementById('ttsOfflineNotice').parentElement === word && doc.querySelectorAll('#ttsOfflineNotice').length === 1,
      'first offline attempt after reconnect uses the active vocabulary row');
    check(word.textContent.includes('die Erlaubnis'), 'suffix has a concrete example and both noun genders');
    for (const lang of ['uk', 'ar']) {
      doc = await load(lang);
      const note = doc.querySelector('.vocab-note');
      check(!!note && !note.textContent.includes('развивать'), lang + ' suffix examples are translated');
    }
    results.textContent += '\nALL BROWSER CHECKS PASSED';
  } catch (error) { results.textContent += '\nERROR ' + error.message; }
  finally {
    restore();
    progressKeys.forEach((key, i) => {
      if (originalProgress[i] === null) localStorage.removeItem(key);
      else localStorage.setItem(key, originalProgress[i]);
    });
    run.disabled = false;
  }
};
