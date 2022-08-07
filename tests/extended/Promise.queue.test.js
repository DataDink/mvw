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
    .queue(array => index++ < 5
      ? new Promise((resolve, reject) => {
          setTimeout(() => {
            array.push(index);
            resolve(array);
          }, 100 - index*10);
        })
      : array, []
    )
    .then(array => {
      expect(array[0]).toBe(1);
      expect(array[1]).toBe(2);
      expect(array[2]).toBe(3);
      expect(array[3]).toBe(4);
      expect(array[4]).toBe(5);
    });
});
