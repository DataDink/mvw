require('../../dst/mvw.js');

test('map a class to a boolean', () => {
  var model = {value: true};
  var element = document.createElement('div');
  element.setAttribute('data-classes-test', 'value');
  element.map(model);
  expect(element.classList.contains('test')).toBe(true);
  model.value = false;
  element.map(model);
  expect(element.classList.contains('test')).toBe(false);
});

test('supports in opperator', () => {
  var element = document.createElement('div');
  element.classList.add('test');
  expect('test' in element.classes).toBe(true);
  expect('no' in element.classes).toBe(false);
});

test('supports enumeration', () => {
  var element = document.createElement('div');
  element.classList.add('test');
  var classes = Object.getOwnPropertyNames(element.classes);
  expect(Array.isArray(classes)).toBe(true);
  expect(classes.length).toBe(1);
  expect(classes[0]).toBe('test');
});

test('supports setting', () => {
  var element = document.createElement('div');
  element.classes.test = true;
  element.classes.no = false;
  expect(element.classList.contains('test')).toBe(true);
  expect(element.classList.contains('no')).toBe(false);
});
