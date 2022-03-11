require('../../dst/mvw.js');

test('map an attribute to a boolean', () => {
  var model = {value: true};
  var element = document.createElement('div');
  element.setAttribute('data-settings-test', 'value');
  element.map(model);
  expect(element.hasAttribute('test')).toBe(true);
  model.value = false;
  element.map(model);
  expect(element.hasAttribute('test')).toBe(false);
});

test('supports enumeration', () => {
  var element = document.createElement('div');
  element.setAttribute('test', 'test');
  var attributes = Object.getOwnPropertyNames(element.settings);
  expect(Array.isArray(attributes)).toBe(true);
  expect(attributes.length).toBe(1);
  expect(attributes[0]).toBe('test');
});

test('false when missing', () => {
  var element = document.createElement('div');
  expect(element.settings.no).toBe(false);
});

test('supports in', () => {
  var element = document.createElement('div');
  element.setAttribute('test', 'value');
  expect('test' in element.settings).toBe(true);
  expect('no' in element.settings).toBe(false);
});

test('removes when undefined, null, false', () => {
  var element = document.createElement('div');
  element.setAttribute('undefined', 'undefined');
  element.setAttribute('null', 'null');
  element.setAttribute('false', 'false');
  element.settings.undefined = undefined;
  expect(element.hasAttribute('undefined')).toBe(false);
  expect(element.hasAttribute('null')).toBe(true);
  expect(element.hasAttribute('false')).toBe(true);
  element.settings.null = null;
  expect(element.hasAttribute('null')).toBe(false);
  element.settings.false = false;
  expect(element.hasAttribute('false')).toBe(false);
});

test('adds when falsy', () => {
  var element = document.createElement('div');
  element.settings.empty = '';
  expect(element.hasAttribute('empty')).toBe(true);
  element.settings.zero = 0;
  expect(element.hasAttribute('zero')).toBe(true);
});

test('adds name when true', () => {
  var element = document.createElement('div');
  element.settings.test = true;
  expect(element.getAttribute('test')).toBe('test');
});

test('adds value when string', () => {
  var element = document.createElement('div');
  element.settings.test = 'value';
  expect(element.getAttribute('test')).toBe('value');
});
