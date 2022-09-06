require('../../dst/mvw.extended.js');

test('can get/set', () => {
  var element = document.createElement('input');
  expect(element.autosize).toBe(false);
  element.autosize = true;
  expect(element.autosize).toBe(true);
  element.autosize = false;
  expect(element.autosize).toBe(false);
});

test('resizes', () => {
  var element = document.body.appendChild(document.createElement('input'));
  element.autosize = true;
  Object.defineProperty(element, 'scrollWidth', {
    enumerable: true, writable: true,
    value: 0
  });
  var pre, post;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      pre = parseInt(element.style.width);
      element.scrollWidth = 100;
      setTimeout(() => {
        element.dispatchEvent(new Event('input'));
        post = parseInt(element.style.width);
        resolve();
      }, 1);
    }, 1);
  })
  .then(() => expect(pre < post).toBe(true));
});
