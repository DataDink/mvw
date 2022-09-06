require('../../dst/mvw.core.js');

test('can copy', () => {
  expect(Object.override({a:10}, {a:11}).a)
    .toBe(11);
});

test('only copies existing', () => {
  expect(Object.override({}, {a:11}).a)
    .toBeUndefined();
});
