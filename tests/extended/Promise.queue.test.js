require('../../dst/mvw.extended.js');

test('can stop', () => {
  return Promise
    .queue(() => 123)
    .then(value => expect(value).toBe(123));
});

test('can enumerate', () => {
  var count = 0;
  return Promise
    .queue(() => count < 10 ? Promise.resolve(count++) : count)
    .then(v => expect(v).toBe(10));
});

test('in order', () => {
  var index = 0;
  return Promise
    .queue(array => index < 5 ? Promise.resolve(array.push(index++)&&array||array) : array, [])
    .then(array => {
      expect(array[0]).toBe(0);
      expect(array[1]).toBe(1);
      expect(array[2]).toBe(2);
      expect(array[3]).toBe(3);
      expect(array[4]).toBe(4);
    });
});
