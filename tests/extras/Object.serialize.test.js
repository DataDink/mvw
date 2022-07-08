require('../../dst/mvw.extras.js');

test('can bool', () => {
  expect(Object.serialize(true))
    .toBe('true');
});

test('can string', () => {
  expect(Object.serialize('test"'))
    .toBe('"test\\""');
});

test('can number', () => {
  expect(Object.serialize(123))
    .toBe('123');
});

test('can array', () => {
  expect(Object.serialize([1,2,3]))
    .toBe('[1,2,3]');
});

test('can object', () => {
  expect(Object.serialize({a:10}))
    .toBe('{":":"Object","a":10}');
});

test('can class', () => {
  class A {a = 10};
  expect(Object.serialize(new A()))
    .toBe('{":":"A","a":10}');
});

test('array reference', () => {
  var array = [1,2,3];
  array.push(array);
  expect(Object.serialize(array))
    .toBe('[1,2,3,{"*":0}]');
});

test('object reference', () => {
  var obj = {a:10};
  obj.b = obj;
  expect(Object.serialize(obj))
    .toBe('{":":"Object","a":10,"b":{"*":0}}');
});
