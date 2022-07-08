require('../../dst/mvw.extras.js');

test('can bool', () => {
  expect(Object.deserialize('true'))
    .toBe(true);
});

test('can number', () => {
  expect(Object.deserialize('123'))
    .toBe(123);
});

test('can string', () => {
  expect(Object.deserialize('"test\\""'))
    .toBe('test"');
});

test('can array', () => {
  var array = Object.deserialize('[1,2,3]');
  expect(array[0]).toBe(1);
  expect(array[1]).toBe(2);
  expect(array[2]).toBe(3);
});

test('can object', () => {
  var obj = Object.deserialize('{"a":10, "b": 11}');
  expect(obj.a).toBe(10);
  expect(obj.b).toBe(11);
});

test('can class', () => {
  window.A = class A {};
  var obj = Object.deserialize('{":":"A", "a": 10, "b": 11}');
  expect(obj instanceof A).toBe(true);
  expect(':' in obj).toBe(false);
  expect(obj.a).toBe(10);
  expect(obj.b).toBe(11);
});

test('can reference', () => {
  var obj = Object.deserialize('{"a":{"*":0},"b":[{"*":0},{"*":1}]}');
  expect(obj.a === obj).toBe(true);
  expect(obj.b[0] === obj).toBe(true);
  expect(obj.b[1] === obj.b).toBe(true);
  expect(obj.b[0] !== obj.b[1]).toBe(true);
});
