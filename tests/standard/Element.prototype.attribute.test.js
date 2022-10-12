require('../environment.js');
require('../../dst/debug/mvw.standard.js');

test('map an attribute to a boolean', () => {
  var model = {value: true};
  var element = document.createElement('div');
  element.setAttribute('bind-attribute-test', 'value');
  element.map(model);
  expect(element.hasAttribute('test')).toBe(true);
  model.value = false;
  element.map(model);
  expect(element.hasAttribute('test')).toBe(false);
});

test('supports enumeration', () => {
  var element = document.createElement('div');
  element.setAttribute('test', 'test');
  var attributes = Object.getOwnPropertyNames(element.attribute);
  expect(Array.isArray(attributes)).toBe(true);
  expect(attributes.length).toBe(1);
  expect(attributes[0]).toBe('test');
});

test('false when missing', () => {
  var element = document.createElement('div');
  expect(element.attribute.no).toBe(false);
});

test('supports in', () => {
  var element = document.createElement('div');
  element.setAttribute('test', 'value');
  expect('test' in element.attribute).toBe(true);
  expect('no' in element.attribute).toBe(false);
});

test('false removes, undefined/null adds', () => {
  var element = document.createElement('div');
  element.setAttribute('false', 'false');
  element.attribute.undefined = undefined;
  expect(element.hasAttribute('undefined')).toBe(true);
  element.attribute.null = null;
  expect(element.hasAttribute('null')).toBe(true);
  element.attribute.false = false;
  expect(element.hasAttribute('false')).toBe(false);
});

test('adds when falsy', () => {
  var element = document.createElement('div');
  element.attribute.empty = '';
  expect(element.hasAttribute('empty')).toBe(true);
  element.attribute.zero = 0;
  expect(element.hasAttribute('zero')).toBe(true);
});

test('adds name when true', () => {
  var element = document.createElement('div');
  element.attribute.test = true;
  expect(element.hasAttribute('test')).toBe(true);
});

test('adds value when string', () => {
  var element = document.createElement('div');
  element.attribute.test = 'value';
  expect(element.getAttribute('test')).toBe('value');
});
