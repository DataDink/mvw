require('../environment.js');
Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {writable: true, value: 0});
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {writable: true, value: 0});

test('init without attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('');
  expect(element.style.height).toBe('');
});

test('init with attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
});

test('add attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('');
  expect(element.style.height).toBe('');
  element.setAttribute('autosize', 'autosize');
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
});

test('remove attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
  element.style.width = '999px';
  element.style.height = '999px';
  element.removeAttribute('autosize');
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
  expect(element.style.height).toBe('999px');
});

test('input without attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.dispatchEvent(new CustomEvent('input', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('');
  expect(element.style.height).toBe('');
});

test('input with attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
  element.scrollWidth = 300;
  element.scrollHeight = 400;
  element.dispatchEvent(new CustomEvent('input', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('300px');
  expect(element.style.height).toBe('400px');
});

test('paste without attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.dispatchEvent(new CustomEvent('paste', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('');
  expect(element.style.height).toBe('');
});

test('paste with attribute', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
  element.scrollWidth = 300;
  element.scrollHeight = 400;
  element.dispatchEvent(new CustomEvent('paste', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('300px');
  expect(element.style.height).toBe('400px');
});

test('input with attribute removed', async () => {
  var element = document.createElement('input');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('100px');
  expect(element.style.height).toBe('200px');
  element.scrollWidth = 300;
  element.scrollHeight = 400;
  element.dispatchEvent(new CustomEvent('input', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('300px');
  expect(element.style.height).toBe('400px');
  element.removeAttribute('autosize');
  element.scrollWidth = 100;
  element.scrollHeight = 200;
  element.dispatchEvent(new CustomEvent('input', {bubbles: true}));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('300px');
  expect(element.style.height).toBe('400px');
});
