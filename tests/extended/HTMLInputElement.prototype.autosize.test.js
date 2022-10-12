require('../environment.js');
require('../../dst/debug/mvw.extended.js');

test('init without attribute', async () => {
  var element = document.createElement('input');
  var expected = element.style.width;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe(expected);
});

test('init with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  var initial = element.style.width;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe(initial);
});

test('add attribute', async () => {
  var element = document.createElement('input');
  var initial = element.style.width;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe(initial);
  element.setAttribute('autosize', 'autosize');
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe(initial);
});

test('remove attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  var initial = element.style.width;
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe(initial);
  element.style.width = '999px';
  element.removeAttribute('autosize');
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('input without attribute', async () => {
  var element = document.createElement('input');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('input'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('input with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('input'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe('999px');
});

test('change without attribute', async () => {
  var element = document.createElement('input');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('change'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('change with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('change'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe('999px');
});

test('focus without attribute', async () => {
  var element = document.createElement('input');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('focus'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('focus with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('focus'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe('999px');
});

test('blur without attribute', async () => {
  var element = document.createElement('input');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('blur'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('blur with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('blur'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe('999px');
});

test('paste without attribute', async () => {
  var element = document.createElement('input');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('paste'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).toBe('999px');
});

test('paste with attribute', async () => {
  var element = document.createElement('input');
  element.setAttribute('autosize', 'autosize');
  document.body.appendChild(element);
  await new Promise(r => setTimeout(r, 1));
  element.style.width = '999px';
  element.dispatchEvent(new CustomEvent('paste'));
  await new Promise(r => setTimeout(r, 1));
  expect(element.style.width).not.toBe('999px');
});
