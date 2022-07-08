require('../../dst/mvw.core.js');

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
  var element = document.createElement('div');
  element.setAttribute('data-onclick', 'handler')
  var model = {handler: function() { this.value = 10; }};
  element.map(model);
  element.click();
  expect(model.value).toBe(10);
});

test('ignores foreign scopes', () => {
  var container = document.createElement('div');
  var foreign = document.createElement('span');
  foreign.setAttribute('data-value', 'value');
  foreign.map({value: 10});
  expect(foreign.value).toBe(10);
  container.appendChild(foreign);
  container.map({value: 20});
  expect(foreign.value).toBe(10);
});

test('remaps native scopes', () => {
  var container = document.createElement('div');
  var native = container.appendChild(document.createElement('span'));
  native.setAttribute('data-value', 'value');
  container.map({value: 10});
  expect(native.value).toBe(10);
  container.map({value: 20});
  expect(native.value).toBe(20);
});

test('remaps unscoped', () => {
  var container = document.createElement('div');
  container.map({});
  var unscoped = container.appendChild(document.createElement('span'));
  unscoped.setAttribute('data-value', 'value');
  container.map({value: 10});
  expect(unscoped.value).toBe(10);
});

test('repath styles', () => {
  expect(
    Node.prototype.map.repath(document.body, 'data-style-backgroundimage', Node.Scope.create(document.body))
  ).toBe('style.backgroundImage');
});
