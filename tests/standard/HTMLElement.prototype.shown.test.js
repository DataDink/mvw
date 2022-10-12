require('../environment.js');
require('../../dst/debug/mvw.standard.js');

test('gets !hidden', () => {
  var element = document.createElement('div');
  expect(element.shown).toBe(!element.hidden);
  element.hidden = !element.hidden;
  expect(element.shown).toBe(!element.hidden);
});

test('sets !hidden', () => {
  var element = document.createElement('div');
  expect(element.hidden).toBe(false);
  element.shown = false;
  expect(element.hidden).toBe(true);
});
