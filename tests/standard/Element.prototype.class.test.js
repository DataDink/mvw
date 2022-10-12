require('../environment.js');
require('../../dst/debug/mvw.standard.js');

test('map a class to a boolean', () => {
  var model = {value: true};
  var element = document.createElement('div');
  element.setAttribute('bind-class-test', 'value');
  element.map(model);
  expect(element.classList.contains('test')).toBe(true);
  model.value = false;
  element.map(model);
  expect(element.classList.contains('test')).toBe(false);
});

test('supports in opperator', () => {
  var element = document.createElement('div');
  element.classList.add('test');
  expect('test' in element.class).toBe(true);
  expect('no' in element.class).toBe(false);
});

test('supports enumeration', () => {
  var element = document.createElement('div');
  element.classList.add('test');
  var classes = Object.getOwnPropertyNames(element.class);
  expect(Array.isArray(classes)).toBe(true);
  expect(classes.length).toBe(1);
  expect(classes[0]).toBe('test');
});

test('supports setting', () => {
  var element = document.createElement('div');
  element.class.test = true;
  element.class.no = false;
  expect(element.classList.contains('test')).toBe(true);
  expect(element.classList.contains('no')).toBe(false);
});
