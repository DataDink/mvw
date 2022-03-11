require('../../dst/mvw.js');

test('map textContent to model.value', () => {
  var element = document.createElement('div');
  element.setAttribute('data-textContent', 'value');
  element.map({value: 'asdf'});
  expect(element.textContent).toBe('asdf');
});

test('map a descendant node to the model', () => {
  var container = document.createElement('div');
  var child = container.appendChild(document.createElement('div'));
  child.setAttribute('data-textContent', 'value');
  container.map({value: 'asdf'});
  expect(child.textContent).toBe('asdf');
});

test('maps to property case-insensitive', () => {
  var element = document.createElement('div');
  element.setAttribute('data-textcontent', 'value');
  element.map({value: 'asdf'});
  expect(element.textContent).toBe('asdf');
});

test('maps to descendant property', () => {
  var element = document.createElement('div');
  element.descendant = {};
  element.setAttribute('data-descendant-value', 'value');
  element.map({value: 'asdf'});
  expect(element.descendant.value).toBe('asdf');
});

test('binds functions', () => {
  var element = document.createElement('element');
  element.setAttribute('data-onclick', 'handler')
  var model = {handler: function() { this.value = 10; }};
  element.map(model);
  element.click();
  expect(model.value).toBe(10);
});
