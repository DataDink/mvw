require('../../dst/mvw.core.js');

test('scan while', () => {
  expect(String.scanWhile('   asdf','\t\r\n ', 0))
    .toBe(3);
});

test('scan until', () => {
  expect(String.scanUntil('   asdf','adsf', 0))
    .toBe(3);
});

test('scan from while', () => {
  expect(String.scanWhile('asdf \t asdf','\t\r\n ', 4))
    .toBe(7);
});

test('scan from until', () => {
  expect(String.scanUntil('asdf \t asdf','fdsa', 4))
    .toBe(7);
});

test('scan while never', () => {
  expect(String.scanWhile('    ','\t\r\n ', 0))
    .toBe(-1);
});

test('scan until never', () => {
  expect(String.scanUntil('asdf','\t\r\n ', 0))
    .toBe(-1);
});
