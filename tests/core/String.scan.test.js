require('../../dst/mvw.core.js');

test('scan while', () => {
  expect(String.scan('   asdf','\t\r\n ', 0, true))
    .toBe(3);
});

test('scan until', () => {
  expect(String.scan('   asdf','adsf', 0, false))
    .toBe(3);
});

test('scan from while', () => {
  expect(String.scan('asdf \t asdf','\t\r\n ', 4, true))
    .toBe(7);
});

test('scan from until', () => {
  expect(String.scan('asdf \t asdf','fdsa', 4, false))
    .toBe(7);
});

test('scan while never', () => {
  expect(String.scan('    ','\t\r\n ', 0, true))
    .toBe(-1);
});

test('scan until never', () => {
  expect(String.scan('asdf','\t\r\n ', 0, false))
    .toBe(-1);
});
