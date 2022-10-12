require('../environment.js');
require('../../dst/debug/mvw.minimal.js');

test('model.value to div-textContent', () => {
  var element = document.createElement('div');
  element.setAttribute('bind-textContent', 'value');
  element.map({value: 'asdf'});
  expect(element.textContent).toBe('asdf');
});

test('model.value to div.textcontent', () => {
  var element = document.createElement('div');
  element.setAttribute('bind-textcontent', 'value');
  element.map({value: 'asdf'});
  expect(element.textContent).toBe('asdf');
});

test('model.value to div/div-textContent', () => {
  var container = document.createElement('div');
  var child = container.appendChild(document.createElement('div'));
  child.setAttribute('bind-textContent', 'value');
  container.map({value: 'asdf'});
  expect(child.textContent).toBe('asdf');
});

test('model.value to div-a-b', () => {
  var element = document.createElement('div');
  element.a = {b: false};
  element.setAttribute('bind-a-b', 'value');
  element.map({value: true});
  expect(element.a.b).toBe(true);
});

test('model.value to div/div-a-b', () => {
  var element = document.createElement('div');
  var child = element.appendChild(document.createElement('div'));
  child.a = {b: false};
  child.setAttribute('bind-a-b', 'value');
  element.map({value: true});
  expect(child.a.b).toBe(true);
});

test('binds functions', () => {
  var element = document.createElement('div');
  element.setAttribute('bind-onclick', 'handler')
  var model = {handler: function() { this.value = 10; }};
  element.map(model);
  element.click();
  expect(model.value).toBe(10);
});

test('ignores foreign scopes', () => {
  var container = document.createElement('div');
  container.setAttribute('bind-value', 'value');
  var foreign = document.createElement('span');
  foreign.setAttribute('bind-value', 'value');
  foreign.map({value: 10});
  expect(foreign.value).toBe(10);
  container.appendChild(foreign);
  container.map({value: 20});
  expect(container.value).toBe(20);
  expect(foreign.value).toBe(10);
});

test('remaps native scopes', () => {
  var container = document.createElement('div');
  container.setAttribute('bind-value', 'value');
  var native = container.appendChild(document.createElement('span'));
  native.setAttribute('bind-value', 'value');
  container.map({value: 10});
  expect(container.value).toBe(10);
  expect(native.value).toBe(10);
  container.map({value: 20});
  expect(container.value).toBe(20);
  expect(native.value).toBe(20);
});

test('remaps unscoped', () => {
  var container = document.createElement('div');
  container.setAttribute('bind-value', 'value');
  container.map({value: 10});
  expect(container.value).toBe(10);
  var unscoped = container.appendChild(document.createElement('span'));
  unscoped.setAttribute('bind-value', 'value');
  container.map({value: 20});
  expect(container.value).toBe(20);
  expect(unscoped.value).toBe(20);
});

test('handler no query', () => {
  var element = document.createElement('div');
  element.setAttribute('bind-onclick', 'handler');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(1);
    expect(arguments[0] instanceof Event).toBe(true);
  }};
  element.map(model);
  element.click();
});

test('handler query empty', () => {
  var element = document.createElement('div');
  element[''] = true;
  element.setAttribute('bind-onclick', 'handler()');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(1);
    expect(arguments[0]).toBe(true);
  }};
  element.map(model);
  element.click();
});

test('handler query empty,empty', () => {
  var element = document.createElement('div');
  element[''] = true;
  element.setAttribute('bind-onclick', 'handler(,)');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(2);
    expect(arguments[0]).toBe(true);
    expect(arguments[1]).toBe(true);
  }};
  element.map(model);
  element.click();
});

test('handler query member', () => {
  var element = document.createElement('div');
  element['a'] = true;
  element.setAttribute('bind-onclick', 'handler(a)');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(1);
    expect(arguments[0]).toBe(true);
  }};
  element.map(model);
  element.click();
});

test('handler query empty,member', () => {
  var element = document.createElement('div');
  element['a'] = true;
  element.setAttribute('bind-onclick', 'handler(,a)');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(2);
    expect(arguments[0]).toBeUndefined();
    expect(arguments[1]).toBe(true);
  }};
  element.map(model);
  element.click();
});

test('handler query member,empty', () => {
  var element = document.createElement('div');
  element['a'] = true;
  element.setAttribute('bind-onclick', 'handler(a,)');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(2);
    expect(arguments[0]).toBe(true);
    expect(arguments[1]).toBeUndefined();
  }};
  element.map(model);
  element.click();
});

test('handler query member,member', () => {
  var element = document.createElement('div');
  element['a'] = true;
  element['b'] = false;
  element.setAttribute('bind-onclick', 'handler(a,b)');
  var model = {handler: function() {
    expect(this === model).toBe(true);
    expect(arguments.length).toBe(2);
    expect(arguments[0]).toBe(true);
    expect(arguments[1]).toBe(false);
  }};
  element.map(model);
  element.click();
});
